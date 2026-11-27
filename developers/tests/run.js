// Legend Mod test runner.
// 1. node --check on the main JS files.
// 2. Desktop and mobile smoke test (smoke.js) with every probe in probes/.
// Exit code is non-zero on a syntax error, a page exception or a probe failure.
// Console/network "log errors" are reported as warnings only: the smoke test
// loads the real game servers, which are not always reachable.
//
// Usage: node developers/tests/run.js [--secs N] [--only desktop|mobile] [--probes a,b] [--limit N] [--keep]
//                                     [--full] [--jobs N] [--prune DAYS] [--node]
// Default: the fast set, without the slow probes (the SLOW list in run.js), desktop and mobile side by side.
// --full: every probe (the coordinator's check before a version bump). --quick is the default and still accepted.
// --node: run the node tests (every developers/tests/*.js but the tools run.js, smoke.js, crlf.js, trace.js)
//   instead of the browser runs, --jobs at once (default 4), each at most 300 s.
// --jobs N: up to N headless Chromes at once (default 2: desktop and mobile side by side; 1 is the old
//   sequential run); more splits each mode's probes into parts (probes sharing a name prefix,
//   e.g. plugins-*, stay together and in order), each part in its own page with its own page-error check.
// --keep: keep each run's Chrome profile in its output folder (removed otherwise, also after a failed run).
// --prune DAYS: first remove the run folders in out/ and the temporary profiles of the Chrome tests not
//   changed for DAYS days (0.25 = 6 hours), never one changed in the last hour or a running test uses; also: node developers/tests/lib/testchrome.js prune DAYS.
// Env: CHROME_PATH (optional), SMOKE_SECS (default 14), SMOKE_PROBES (like --probes),
// SMOKE_LIMIT (like --limit: seconds the probes may take per page; default 15 per probe, at least 240),
// SMOKE_FULL=1 (like --full), SMOKE_JOBS (like --jobs).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const testChrome = require('./lib/testchrome');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const outRoot = path.join(here, 'out');
const args = process.argv.slice(2);
const argVal = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
if (args.includes('--help') || args.includes('-h')) {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n'));
  process.exit(0);
}
const secs = Number(argVal('--secs', process.env.SMOKE_SECS || 14));
const only = argVal('--only', '');
/* only these probes (names without .js), e.g. --probes smalltools,zzz-practice */
const pick = String(argVal('--probes', process.env.SMOKE_PROBES || '')).split(',').map(s => s.trim().replace(/\.js$/, '')).filter(Boolean);
/* the fast set is the default (owner: the updates waited on the tests); --full runs every probe */
const quick = !(args.includes('--full') || process.env.SMOKE_FULL === '1');
const nodeTests = args.includes('--node');
const jobs = Math.max(1, Math.floor(Number(argVal('--jobs', process.env.SMOKE_JOBS || (nodeTests ? 4 : 2)))) || 1);
const keep = args.includes('--keep');
const pruneDays = argVal('--prune', '');

/* probes of about 5 s or more per mode (seconds: the slower of desktop / mobile, from the "probe x: ok (N s)"
 * lines of full runs). Only --full runs them; --jobs uses the numbers to give the parts equal time
 * (any other probe counts as 2 s). Update when a probe gets much slower or faster. */
const SLOW = {
  'smalltools': 10, 'themebridge': 8, 'winstack': 6, 'replaystudio': 6,
  'perf': 5, 'server-token-typing': 31, 'conn-drop-menu': 10
};
const weight = name => SLOW[name] || 2;

const FILES = [...new Set(['ogario/skinresolver.js', 'ogario/skinregistry.js', 'ogario/ogario.v4.js', 'ogario/hotkeysCommand.js', 'ogario/spect.js', 'ogario/gamepad.js', 'ogario/modules/deathrecap.js',
  'LMexpress/LMexpress.js', 'LMexpress/lm_extended_ui.js', 'LMexpress/skinsAndDeals.js',
  'LMmobile/LMmobile.js', 'LMmobile/LMmobile-editor.js'])];
const OPTIONAL = new Set(['ogario/gamepad.js']);
/* feature modules (ogario/modules/*.js), whichever exist */
try { fs.readdirSync(path.join(repo, 'ogario', 'modules')).filter(f => f.endsWith('.js')).sort().forEach(f => { const rel = 'ogario/modules/' + f; if (!FILES.includes(rel)) FILES.push(rel); }); } catch (e) { }

let failed = false;
const warnings = [];
const summary = [];

/* a node child process as a promise: { status, stdout, stderr, error } like spawnSync (status null
 * and an error after the timeout) */
function runNode(argv, opts) {
  return new Promise(resolve => {
    let stdout = '', stderr = '', error = null, timer = null;
    const p = spawn(process.execPath, argv, { env: (opts && opts.env) || process.env });
    p.stdout.on('data', d => { stdout += d; });
    p.stderr.on('data', d => { stderr += d; });
    p.on('error', e => { error = e; });
    if (opts && opts.timeout) timer = setTimeout(() => { error = new Error('timed out after ' + Math.round(opts.timeout / 1000) + ' s'); try { p.kill(); } catch (e) { } }, opts.timeout);
    p.on('close', code => { clearTimeout(timer); resolve({ status: error ? null : code, stdout, stderr, error }); });
  });
}
/* runs fn over items, at most n at once; results in item order */
async function pool(items, n, fn) {
  const res = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) { const i = next++; res[i] = await fn(items[i], i); }
  }));
  return res;
}

/* the node tests, n at once: one line each with its time, the output of the failed ones */
async function runNodeTests(n) {
  const TOOLS = new Set(['run.js', 'smoke.js', 'crlf.js', 'trace.js']);
  const list = fs.readdirSync(here).filter(f => f.endsWith('.js') && !TOOLS.has(f)).sort();
  const t0 = Date.now();
  let bad = 0;
  await pool(list, n, async f => {
    const t = Date.now();
    const r = await runNode([path.join(here, f)], { timeout: 300000 });
    const ok = r.status === 0;
    if (!ok) bad++;
    const tail = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-15).join('\n') + (r.error ? '\n' + r.error.message : '');
    console.log('node ' + f + ': ' + (ok ? 'ok' : 'FAIL') + ' (' + Math.round((Date.now() - t) / 100) / 10 + ' s)' + (ok ? '' : '\n' + tail));
  });
  console.log('\n== node tests: ' + (list.length - bad) + ' of ' + list.length + ' ok in ' + Math.round((Date.now() - t0) / 1000) + ' s ==');
  console.log(bad ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad ? 1 : 0);
}

(async () => {
  if (nodeTests) return runNodeTests(jobs);
  if (pruneDays !== '') {
    if (!(Number(pruneDays) >= 0)) { console.log('--prune needs a number of days'); process.exit(1); }
    console.log(testChrome.pruneReport(outRoot, Number(pruneDays), true));
  }
  // 1. syntax (in parallel: node --check of the big files takes about a second each)
  const syntaxJobs = Math.max(2, Math.min(6, jobs * 2));
  let checked = 0;
  const checks = await pool(FILES, syntaxJobs, async rel => {
    const file = path.join(repo, rel);
    if (!fs.existsSync(file)) return OPTIONAL.has(rel) ? null : { missing: true };
    return runNode(['--check', file]);
  });
  FILES.forEach((rel, i) => {
    const r = checks[i];
    if (!r) return;
    if (r.missing) { console.log('MISSING ' + rel); failed = true; return; }
    checked++;
    if (r.status !== 0) { failed = true; console.log('SYNTAX ' + rel + '\n' + (r.stderr || '').split('\n').slice(0, 6).join('\n')); }
  });
  summary.push('syntax: ' + checked + ' files checked' + (failed ? ', FAILED' : ', ok'));

  // 2. smoke + probes
  const probeDir = path.join(here, 'probes');
  const all = fs.readdirSync(probeDir).filter(f => f.endsWith('.js') && (!pick.length || pick.includes(f.replace(/\.js$/, '')))).sort();
  const unknown = pick.filter(n => !all.includes(n + '.js'));
  if (unknown.length) { console.log('no such probe: ' + unknown.join(', ')); process.exit(1); }
  /* the fast set leaves the slow probes out, unless they were named with --probes */
  const probes = quick && !pick.length ? all.filter(f => !SLOW[f.replace(/\.js$/, '')]) : all;
  if (quick && !pick.length) console.log('fast set: ' + (all.length - probes.length) + ' slow probes left out (--full runs them: ' + Object.keys(SLOW).filter(n => all.includes(n + '.js')).join(', ') + ')');
  const strip = src => src.replace(/^\s*\/\/.*$/gm, '').trim().replace(/;\s*$/, '');
  const combine = list => '(async () => {\n' +
    /* window.__lmProbeRes: smoke.js reads the results so far when the probes run out of time */
    '  var res = window.__lmProbeRes = {}, t0 = Date.now();\n' +
    /* 20 s, and on (up to 60 s) while the page is still parsed: a third-party stylesheet in its head
     * (Google Fonts, cdnjs) that answers slowly holds the parser and every script after it, and the
     * probes ran on a page whose scripts had not run yet */
    '  while (!(window.legendmod && window.application && window.jQuery && jQuery("#og-options").children().length) && (Date.now() - t0 < 20000 || (document.readyState === "loading" && Date.now() - t0 < 60000))) await new Promise(function (r) { setTimeout(r, 250); });\n' +
    /* then until the module scripts the game added at its start have loaded (smoke.js records each
     * script's load or error): a probe run first in its part found its module not there yet
     * (hudeditor, winstack-dom). Bounded, at most 60 s from the start */
    '  var lmModsLeft = function () { var d = window.__lmScriptsDone; return d ? Array.prototype.filter.call(document.querySelectorAll("script[src*=\\"/ogario/modules/\\"]"), function (s) { return !d[s.src]; }).length : 0; };\n' +
    '  while (lmModsLeft() && Date.now() - t0 < 60000) await new Promise(function (r) { setTimeout(r, 100); });\n' +
    list.map(f => '  console.debug("[lm-probe]", ' + JSON.stringify(f.replace(/\.js$/, '')) + ');\n' +
      '  try { res[' + JSON.stringify(f.replace(/\.js$/, '')) + '] = await (\n' + strip(fs.readFileSync(path.join(probeDir, f), 'utf8')) +
      '\n  ); } catch (e) { res[' + JSON.stringify(f.replace(/\.js$/, '')) + '] = { err: String(e && e.stack || e) }; }\n').join('') +
    '  console.debug("[lm-probe]", "");\n  return JSON.stringify(res);\n})()';
  /* splits the sorted probes into k parts of about equal time; probes sharing the first part of
   * their name (plugins-erase, plugins-load-again) stay in one part, in their order */
  function split(list, k) {
    if (k <= 1 || list.length < 2) return [list];
    const groups = [];
    list.forEach(f => {
      const key = f.replace(/\.js$/, '').replace(/^z+-/, '').split('-')[0];
      const g = groups.length && groups[groups.length - 1];
      if (g && g.key === key) g.files.push(f); else groups.push({ key, files: [f] });
    });
    groups.forEach(g => { g.w = g.files.reduce((s, f) => s + weight(f.replace(/\.js$/, '')), 0); });
    const total = groups.reduce((s, g) => s + g.w, 0);
    const parts = [[]];
    let acc = 0;
    groups.forEach(g => {
      if (parts[parts.length - 1].length && parts.length < k && acc + g.w / 2 > total * parts.length / k) parts.push([]);
      parts[parts.length - 1].push(...g.files);
      acc += g.w;
    });
    return parts;
  }

  const modes = ['desktop', 'mobile'].filter(m => !only || m === only);
  const perMode = Math.max(1, Math.ceil(jobs / modes.length));
  const tasks = [];
  modes.forEach(mode => {
    const parts = split(probes, perMode);
    parts.forEach((list, i) => tasks.push({ mode, list, label: mode + (parts.length > 1 ? ' [' + (i + 1) + '/' + parts.length + ']' : '') }));
  });

  async function runTask(t, ti) {
    /* the time the probes may take grows with their number (a slow machine runs each one longer);
     * smoke.js stops there and says which probe was running, run.js waits a little longer than that */
    const limit = Number(argVal('--limit', process.env.SMOKE_LIMIT || Math.max(240, t.list.length * 15)));
    const out = path.join(outRoot, t.mode + '-' + Date.now() + (tasks.length > modes.length ? '-' + ti : ''));
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'probe.js'), combine(t.list));
    const smokeArgs = [path.join(here, 'smoke.js'), repo, out, String(secs)];
    if (t.mode === 'mobile') smokeArgs.push('', 'mobile');
    const head = '\n== ' + t.label + ' smoke (' + secs + 's, ' + t.list.length + ' probes, limit ' + limit + 's) ==';
    if (jobs === 1) console.log(head); else console.log('started ' + t.label + ' (' + t.list.length + ' probes)');
    const started = Date.now();
    const r = await runNode(smokeArgs, { timeout: (secs + limit + 120) * 1000,
      env: Object.assign({}, process.env, { SMOKE_PROBE_LIMIT: String(limit) }, keep ? { SMOKE_KEEP_PROFILE: '1' } : {}) });
    /* smoke.js ends its Chrome and removes the profile on its own; when it was killed (out of time) or
     * did not get that far, its Chrome may still run: end every process using the profile, then remove it */
    const profile = path.join(out, 'profile');
    if (fs.existsSync(profile) && !(keep && (r.status === 0 || r.status === 4))) testChrome.cleanupProfile(profile, { search: true, keep });
    if (jobs > 1) console.log('finished ' + t.label + ' in ' + Math.round((Date.now() - started) / 1000) + ' s');
    return { t, r, out, limit, head };
  }

  function report({ t, r, out, limit, head }) {
    const lines = [];
    const log = s => lines.push(s);
    if (jobs > 1) log(head);
    const mode = t.label;
    const text = (r.stdout || '') + (r.stderr || '');
    const resFile = path.join(out, 'result.json');
    const timedOut = r.status === 4 && fs.existsSync(resFile);
    if ((r.status !== 0 && !timedOut) || !fs.existsSync(resFile)) {
      log(text.trim());
      /* which probe was running (smoke.js keeps it in progress.json while the probes run) */
      let prog = null;
      try { prog = JSON.parse(fs.readFileSync(path.join(out, 'progress.json'), 'utf8')); } catch (e) { }
      if (prog && prog.probe) log(mode + ': probe ' + prog.probe + ' was running (for ' + Math.round((Date.now() - prog.at) / 1000) + ' s, ' + Math.round((Date.now() - prog.start) / 1000) + ' s after the probes started)');
      log(mode + ': smoke run failed (exit ' + r.status + (r.error ? ', ' + r.error.message : '') + ')');
      summary.push(mode + ': smoke run FAILED'); failed = true;
      return lines;
    }
    const res = JSON.parse(fs.readFileSync(resFile, 'utf8'));
    let probe = null;
    const probeProblems = [];
    try { probe = typeof res.probe === 'string' ? JSON.parse(res.probe) : null; } catch (e) { }
    /* out of time: the probes that finished are reported, the one that was running is named */
    const to = res.timedOut;
    if (to) probeProblems.push('probes out of time (limit ' + limit + ' s): ' + (to.probe ? to.probe + ' was running for ' + to.probeSecs + ' s' : 'the page was not ready for the first probe yet') + ', ' + (t.list.length - Object.keys(probe || {}).length) + ' without a result');
    if (!probe) probeProblems.push('probe returned no result: ' + JSON.stringify(res.probe).slice(0, 500));
    else {
      for (const name of t.list.map(f => f.replace(/\.js$/, ''))) {
        const p = probe[name];
        if (!p && to) continue;
        if (!p) { probeProblems.push(name + ': no result'); continue; }
        if (p.err) probeProblems.push(name + ': ' + p.err);
        (p.fail || []).forEach(f => probeProblems.push(name + ': ' + f));
        const ts = res.probeTimes && res.probeTimes[name];
        log('  probe ' + name + ': ' + (p.err || (p.fail && p.fail.length) ? 'FAIL' : 'ok') + (ts != null ? ' (' + ts + ' s)' : '') + (p.info ? ' ' + JSON.stringify(p.info) : ''));
      }
    }
    log('  served from repo: ' + res.served + (res.missing.length ? ', missing on disk: ' + res.missing.slice(0, 15).join(', ') : ''));
    log('  page errors: ' + res.errorCount);
    res.errors.forEach(e => log('    ' + e));
    probeProblems.forEach(e => log('    PROBE ' + e));
    log('  log errors (warning only): ' + res.logErrorCount);
    res.logErrors.slice(0, 15).forEach(e => log('    ' + e));
    if (res.logErrorCount) warnings.push(mode + ': ' + res.logErrorCount + ' log errors');
    const ok = res.errorCount === 0 && probeProblems.length === 0;
    if (!ok) failed = true;
    summary.push(mode + ': ' + (ok ? 'ok' : 'FAILED') + ' (page errors ' + res.errorCount + ', probe problems ' + probeProblems.length + ', log errors ' + res.logErrorCount + ')');
    return lines;
  }

  /* each page's report is printed in task order, as soon as it and the ones before it are done */
  const done = new Array(tasks.length);
  let printed = 0;
  await pool(tasks, jobs, async (t, i) => {
    done[i] = await runTask(t, i);
    while (printed < tasks.length && done[printed]) console.log(report(done[printed++]).join('\n'));
  });

  console.log('\n== summary ==');
  summary.forEach(s => console.log('  ' + s));
  warnings.forEach(w => console.log('  warning: ' + w));
  console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(failed ? 1 : 0);
})();
