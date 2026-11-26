// Legend Mod test runner.
// 1. node --check on the main JS files.
// 2. Desktop and mobile smoke test (smoke.js) with every probe in probes/.
// Exit code is non-zero on a syntax error, a page exception or a probe failure.
// Console/network "log errors" are reported as warnings only: the smoke test
// loads the real game servers, which are not always reachable.
//
// Usage: node developers/tests/run.js [--secs N] [--only desktop|mobile] [--keep]
// Env: CHROME_PATH (optional), SMOKE_SECS (default 14).
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const outRoot = path.join(here, 'out');
const args = process.argv.slice(2);
const argVal = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const secs = Number(argVal('--secs', process.env.SMOKE_SECS || 14));
const only = argVal('--only', '');

const FILES = ['ogario/ogario.v4.js', 'ogario/hotkeysCommand.js', 'ogario/spect.js', 'ogario/gamepad.js', 'ogario/modules/deathrecap.js',
  'LMexpress/LMexpress.js', 'LMexpress/lm_extended_ui.js', 'LMexpress/skinsAndDeals.js',
  'LMmobile/LMmobile.js', 'LMmobile/LMmobile-editor.js'];
const OPTIONAL = new Set(['ogario/gamepad.js']);
/* feature modules (ogario/modules/*.js), whichever exist */
try { fs.readdirSync(path.join(repo, 'ogario', 'modules')).filter(f => f.endsWith('.js')).sort().forEach(f => FILES.push('ogario/modules/' + f)); } catch (e) { }

let failed = false;
const warnings = [];
const summary = [];

// 1. syntax
let checked = 0;
for (const rel of FILES) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) {
    if (OPTIONAL.has(rel)) continue;
    console.log('MISSING ' + rel); failed = true; continue;
  }
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  checked++;
  if (r.status !== 0) { failed = true; console.log('SYNTAX ' + rel + '\n' + (r.stderr || '').split('\n').slice(0, 6).join('\n')); }
}
summary.push('syntax: ' + checked + ' files checked' + (failed ? ', FAILED' : ', ok'));

// 2. smoke + probes
const probeDir = path.join(here, 'probes');
const probes = fs.readdirSync(probeDir).filter(f => f.endsWith('.js')).sort();
const strip = src => src.replace(/^\s*\/\/.*$/gm, '').trim().replace(/;\s*$/, '');
const combined = '(async () => {\n' +
  '  var res = {}, t0 = Date.now();\n' +
  '  while (!(window.legendmod && window.application && window.jQuery && jQuery("#og-options").children().length) && Date.now() - t0 < 20000) await new Promise(function (r) { setTimeout(r, 250); });\n' +
  probes.map(f => '  try { res[' + JSON.stringify(f.replace(/\.js$/, '')) + '] = await (\n' + strip(fs.readFileSync(path.join(probeDir, f), 'utf8')) +
    '\n  ); } catch (e) { res[' + JSON.stringify(f.replace(/\.js$/, '')) + '] = { err: String(e && e.stack || e) }; }\n').join('') +
  '  return JSON.stringify(res);\n})()';

const modes = ['desktop', 'mobile'].filter(m => !only || m === only);
for (const mode of modes) {
  const out = path.join(outRoot, mode + '-' + Date.now());
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'probe.js'), combined);
  const smokeArgs = [path.join(here, 'smoke.js'), repo, out, String(secs)];
  if (mode === 'mobile') smokeArgs.push('', 'mobile');
  console.log('\n== ' + mode + ' smoke (' + secs + 's) ==');
  const r = spawnSync(process.execPath, smokeArgs, { encoding: 'utf8', timeout: (secs + 120) * 1000 });
  const text = (r.stdout || '') + (r.stderr || '');
  const resFile = path.join(out, 'result.json');
  if (r.status !== 0 || !fs.existsSync(resFile)) {
    console.log(text.trim());
    console.log(mode + ': smoke run failed (exit ' + r.status + (r.error ? ', ' + r.error.message : '') + ')');
    summary.push(mode + ': smoke run FAILED'); failed = true; continue;
  }
  const res = JSON.parse(fs.readFileSync(resFile, 'utf8'));
  let probe = null, probeProblems = [];
  try { probe = typeof res.probe === 'string' ? JSON.parse(res.probe) : null; } catch (e) { }
  if (!probe) probeProblems.push('probe returned no result: ' + JSON.stringify(res.probe).slice(0, 500));
  else {
    for (const name of probes.map(f => f.replace(/\.js$/, ''))) {
      const p = probe[name];
      if (!p) { probeProblems.push(name + ': no result'); continue; }
      if (p.err) probeProblems.push(name + ': ' + p.err);
      (p.fail || []).forEach(f => probeProblems.push(name + ': ' + f));
      console.log('  probe ' + name + ': ' + (p.err || (p.fail && p.fail.length) ? 'FAIL' : 'ok') + (p.info ? ' ' + JSON.stringify(p.info) : ''));
    }
  }
  console.log('  served from repo: ' + res.served + (res.missing.length ? ', missing on disk: ' + res.missing.slice(0, 15).join(', ') : ''));
  console.log('  page errors: ' + res.errorCount);
  res.errors.forEach(e => console.log('    ' + e));
  probeProblems.forEach(e => console.log('    PROBE ' + e));
  console.log('  log errors (warning only): ' + res.logErrorCount);
  res.logErrors.slice(0, 15).forEach(e => console.log('    ' + e));
  if (res.logErrorCount) warnings.push(mode + ': ' + res.logErrorCount + ' log errors');
  const ok = res.errorCount === 0 && probeProblems.length === 0;
  if (!ok) failed = true;
  summary.push(mode + ': ' + (ok ? 'ok' : 'FAILED') + ' (page errors ' + res.errorCount + ', probe problems ' + probeProblems.length + ', log errors ' + res.logErrorCount + ')');
  if (!args.includes('--keep')) { try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { } }
}

console.log('\n== summary ==');
summary.forEach(s => console.log('  ' + s));
warnings.forEach(w => console.log('  warning: ' + w));
console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
