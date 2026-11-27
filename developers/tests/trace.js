// Freeze trace on your own PC: what really runs when the game stops for a moment.
//
//   node developers/tests/trace.js --secs 120            (play.html, up to 120 s or 3 freezes)
//   node developers/tests/trace.js --secs 120 --until-freezes 3 --url https://www.legendmod.ml/play.html
// (without any option it only prints this help, so a loop over the test files does not open Chrome)
//
// A normal (visible) Chrome window opens with a temporary profile (no extensions, nothing of
// your own profile). Log in / pick a server and play normally until it stops by itself: after
// --secs seconds, or as soon as Legend Mod's Performance diagnostics have counted
// --until-freezes freezes (0 = only the time limit). Ctrl+C stops early and still writes
// everything. Do not close the Chrome window yourself: the trace is read from it at the end.
//
// While it runs, Chrome records a performance trace (main thread tasks, JavaScript samples,
// garbage collection, GPU process) and Legend Mod's diagnostics record with their freeze
// breakdown (LMPerf.keepRecording). A performance.mark lines both clocks up.
// Output (developers/tests/out/, ignored by git; nothing is uploaded anywhere):
//   trace-<time>.json          the Chrome trace: open it in DevTools > Performance > Load profile
//   trace-<time>-summary.txt   the summary printed at the end + Legend Mod's own report
// The summary lists every task of 100 ms or more on the page's main thread with the
// JavaScript functions that took its time (by self time, labelled legendmod / agar.io /
// extension / other), the garbage collection and GPU work during it, and Legend Mod's own
// line for the freeze it caused. A freeze without a long task points at the GPU or the browser.
//
// Comparing: --url https://agar.io traces agar.io without Legend Mod (a baseline: if it also
// freezes every few seconds there, the cause is not Legend Mod).
// Options: --url, --secs (default 120), --until-freezes (default 3), --out <dir>, --keep-profile,
// --no-gpu (leave the GPU command buffer events out: a smaller trace),
// --headless (no window: only to check the tool itself, a hidden page is not a real game).
// Chrome: env CHROME_PATH, otherwise the usual install locations are tried. Needs Node 22+.
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

let P = null; /* ogario/modules/perf.js pure functions: script owners, function names at positions */
try { P = require(path.join(__dirname, '..', '..', 'ogario', 'modules', 'perf.js')); } catch (e) { P = null; }

/* ------------------------------------------------------------------------------------------
 * Summary of a trace (pure: developers/tests/trace-summary.js tests it with a small trace)
 * ------------------------------------------------------------------------------------------ */

const LONG_TASK_US = 100000;
const GC_NAME = /^(MajorGC|MinorGC|V8\.GC|V8\.GCScavenger|V8\.GCFinalize|V8\.GCIncremental|V8\.GCCompactor|BlinkGC|CppGC|ThreadState::|GCEvent|V8\.ScavengeMain|V8\.MarkCompact)/;
const TASK_NAME = /^(RunTask|ThreadControllerImpl::RunTask|ThreadPool_RunTask)$/;

function ownerOf(url, pageHost) {
  if (!url) return '';
  if (P && P.scriptFile) return P.scriptFile(url, pageHost).kind;
  if (/^[a-z-]+-extension:/i.test(url)) return 'extension';
  if (/legendmod\.ml|jimboy3100\.github\.io/i.test(url)) return 'legendmod';
  if (/agar\.io|miniclip/i.test(url)) return 'agar.io';
  return 'other';
}
function fileOf(url) {
  if (!url) return '';
  if (P && P.scriptFile) return P.scriptFile(url).file;
  return String(url).split(/[?#]/)[0].split('/').pop();
}
/* total length of the union of [a, b] intervals (nested events are counted once) */
function unionUs(iv) {
  if (!iv.length) return 0;
  iv = iv.slice().sort((x, y) => x[0] - y[0]);
  let tot = 0, s = iv[0][0], e = iv[0][1];
  for (let i = 1; i < iv.length; i++) {
    if (iv[i][0] > e) { tot += e - s; s = iv[i][0]; e = iv[i][1]; } else if (iv[i][1] > e) e = iv[i][1];
  }
  return tot + e - s;
}
const clip = (a0, a1, b0, b1) => [Math.max(a0, b0), Math.min(a1, b1)];
const ms = us => Math.round(us / 1000);

/* threads by name, the page's main threads, CPU profiles as timed samples */
function indexTrace(trace) {
  const evs = Array.isArray(trace) ? trace : (trace && trace.traceEvents) || [];
  const threadName = new Map(), procName = new Map();
  for (const e of evs) {
    if (e.ph !== 'M') continue;
    if (e.name === 'thread_name') threadName.set(e.pid + ':' + e.tid, e.args && e.args.name);
    else if (e.name === 'process_name') procName.set(e.pid, e.args && e.args.name);
  }
  const key = e => e.pid + ':' + e.tid;
  const mains = new Set([...threadName].filter(([, n]) => n === 'CrRendererMain').map(([k]) => k));
  const gpuThreads = new Set([...threadName].filter(([k, n]) => {
    const pid = +k.split(':')[0];
    return /GPU/i.test(procName.get(pid) || '') ? /CrGpuMain|VizCompositor|GpuMemory|Chrome_InProcGpuThread/.test(n || '') : /Chrome_InProcGpuThread|VizCompositor/.test(n || '');
  }).map(([k]) => k));
  /* CPU profile: Profile gives the start, ProfileChunk the nodes, samples and time deltas */
  const profiles = new Map();
  for (const e of evs) {
    if (e.name !== 'Profile' && e.name !== 'ProfileChunk') continue;
    const id = e.pid + ':' + e.id;
    let p = profiles.get(id);
    if (!p) { p = { pid: e.pid, tid: e.tid, start: 0, t: 0, nodes: new Map(), samples: [] }; profiles.set(id, p); }
    const d = (e.args && e.args.data) || {};
    if (e.name === 'Profile') { p.start = p.t = +d.startTime || e.ts; p.tid = e.tid; continue; }
    const cp = d.cpuProfile || {};
    for (const n of cp.nodes || []) p.nodes.set(n.id, n);
    const samples = cp.samples || [], deltas = d.timeDeltas || [];
    if (!p.t) p.t = e.ts;
    for (let i = 0; i < samples.length; i++) { p.t += +deltas[i] || 0; p.samples.push([p.t, samples[i]]); }
  }
  for (const p of profiles.values()) {
    p.samples.sort((a, b) => a[0] - b[0]);
    /* a sample lasts until the next one (the last one: the usual interval) */
    for (let i = 0; i < p.samples.length; i++) p.samples[i][2] = i + 1 < p.samples.length ? Math.min(p.samples[i + 1][0] - p.samples[i][0], 50000) : 500;
  }
  return { evs, threadName, procName, key, mains, gpuThreads, profiles };
}

/* a sample's function and whose code it is; a built-in (texImage2D, measureText) counts for
 * the script that called it */
function frameLabel(n, pageHost, nodes) {
  const cf = (n && n.callFrame) || {};
  const fn = cf.functionName || '';
  if (/^\((program|idle|garbage collector|root)\)$/.test(fn)) return { name: fn, owner: fn === '(garbage collector)' ? 'GC' : fn === '(idle)' ? 'idle' : 'browser' };
  if (!cf.url) {
    let p = n, caller = '';
    for (let i = 0; i < 50 && p && p.parent !== undefined && nodes; i++) {
      p = nodes.get(p.parent);
      if (p && p.callFrame && p.callFrame.url) { caller = ownerOf(p.callFrame.url, pageHost) || 'other'; break; }
    }
    return { name: (fn || '(anonymous)') + ' (built-in)', owner: caller || 'native' };
  }
  const owner = ownerOf(cf.url, pageHost) || 'other';
  return { name: (fn || '(anonymous)') + ' ' + fileOf(cf.url) + ':' + ((+cf.lineNumber || 0) + 1) + ':' + ((+cf.columnNumber || 0) + 1), owner };
}
/* one line on what a long task mostly was */
function verdict(durUs, byOwner, byFn, gcUs, gpuUs) {
  const of = k => (byOwner.find(([o]) => o === k) || [0, 0])[1];
  const sampled = byOwner.reduce((s, [, us]) => s + us, 0);
  if (!sampled) return 'no JavaScript samples in it';
  if (of('idle') > durUs * 0.5 && gpuUs > durUs * 0.5) return 'the main thread waited for the GPU process (a GPU stall: texture uploads, readbacks or the driver)';
  if (Math.max(gcUs, of('GC')) > durUs * 0.5) return 'mostly garbage collection';
  const js = byOwner.filter(([o]) => !/^(idle|GC|browser)$/.test(o));
  if (js.length && js[0][1] > durUs * 0.5) {
    const f = byFn.find(([, v]) => v.owner === js[0][0]);
    return 'mostly JavaScript of ' + js[0][0] + (f ? ' (top: ' + f[0].split(' ')[0] + ')' : '');
  }
  if (of('browser') > durUs * 0.5) return 'mostly browser work outside JavaScript (style, layout, paint, messages)';
  if (of('idle') > durUs * 0.5) return 'the main thread was mostly waiting (GPU, a lock or another process)';
  return 'mixed: no single part over half of it';
}

/* self time per function and per owner inside [t0, t1] (µs) on one thread */
function selfTimes(ix, pid, tid, t0, t1, pageHost) {
  const byFn = new Map(), byOwner = new Map();
  for (const p of ix.profiles.values()) {
    /* the profile of this thread (its events may come from a sampler thread of the process) */
    if (p.pid !== pid || (p.tid !== tid && ix.mains.has(p.pid + ':' + p.tid))) continue;
    for (const s of p.samples) {
      if (s[0] < t0 || s[0] > t1) continue;
      const lab = frameLabel(p.nodes.get(s[1]), pageHost, p.nodes);
      byFn.set(lab.name, { us: ((byFn.get(lab.name) || {}).us || 0) + s[2], owner: lab.owner });
      byOwner.set(lab.owner, (byOwner.get(lab.owner) || 0) + s[2]);
    }
  }
  return { byFn: [...byFn].sort((a, b) => b[1].us - a[1].us), byOwner: [...byOwner].sort((a, b) => b[1] - a[1]) };
}

/* opts: { sync: { perfNow, traceTs } , freezes: LMPerf.freezes(), loafs, sources: { file: text }, pageHost } */
function summarize(trace, opts) {
  opts = opts || {};
  const ix = indexTrace(trace);
  const out = [];
  const pageHost = opts.pageHost || '';
  /* the clock of the page (performance.now, ms) on the trace clock (µs) */
  let off = null;
  if (opts.sync && opts.sync.traceTs > 0) off = opts.sync.traceTs - opts.sync.perfNow * 1000;
  else {
    const mark = ix.evs.find(e => e.name === 'lm-trace-sync' && (e.ph === 'R' || e.ph === 'I' || e.ph === 'i' || e.ph === 'b' || e.ph === 'n'));
    if (mark && opts.sync && opts.sync.perfNow >= 0) off = mark.ts - opts.sync.perfNow * 1000;
  }
  const toTrace = msPerf => off === null ? null : msPerf * 1000 + off;
  /* the long tasks: top level only */
  const tasks = [];
  for (const e of ix.evs) {
    if (e.ph !== 'X' || !(e.dur >= LONG_TASK_US) || !ix.mains.has(ix.key(e)) || !TASK_NAME.test(e.name)) continue;
    tasks.push(e);
  }
  tasks.sort((a, b) => a.ts - b.ts);
  const top = [];
  for (const t of tasks) if (!top.length || t.ts >= top[top.length - 1].ts + top[top.length - 1].dur) top.push(t);
  const mainKeys = [...ix.mains];
  const pidCount = new Set(mainKeys.map(k => k.split(':')[0])).size;
  const gcOn = (k, t0, t1) => {
    const iv = [], names = new Map();
    for (const e of ix.evs) {
      if (e.ph !== 'X' || !GC_NAME.test(e.name) || ix.key(e) !== k || e.ts > t1 || e.ts + (e.dur || 0) < t0) continue;
      iv.push(clip(e.ts, e.ts + e.dur, t0, t1));
      const n = /^(MajorGC|MinorGC)/.test(e.name) ? e.name : e.name.replace(/_.*$/, '');
      names.set(n, (names.get(n) || 0) + 1);
    }
    return { us: unionUs(iv.filter(x => x[1] > x[0])), names };
  };
  const gpuDuring = (t0, t1) => {
    const iv = [], per = new Map();
    for (const e of ix.evs) {
      if (e.ph !== 'X' || !(e.dur > 0) || !ix.gpuThreads.has(ix.key(e)) || e.ts > t1 || e.ts + e.dur < t0) continue;
      const c = clip(e.ts, e.ts + e.dur, t0, t1);
      if (c[1] <= c[0]) continue;
      iv.push(c);
      const tn = ix.threadName.get(ix.key(e)) || '?';
      if (!per.has(tn)) per.set(tn, []);
      per.get(tn).push(c);
    }
    return { us: unionUs(iv), per: [...per].map(([n, l]) => [n, unionUs(l)]).sort((a, b) => b[1] - a[1]) };
  };
  const lmFreezes = (opts.freezes || []).map(f => Object.assign({}, f, { ts0: toTrace(f.t - f.dur), ts1: toTrace(f.t) }));
  const loafs = opts.loafs || [];
  const nameAt = (file, pos) => {
    const text = opts.sources && opts.sources[file];
    return text && P && P.enclosingName && pos >= 0 ? P.enclosingName(text, pos) : '';
  };

  const t0 = ix.evs.reduce((m, e) => e.ts > 0 && e.ph !== 'M' && e.ts < m ? e.ts : m, Infinity);
  const rel = ts => isFinite(t0) ? ((ts - t0) / 1e6).toFixed(2) + ' s' : '';
  out.push('Long tasks (≥' + ms(LONG_TASK_US) + ' ms) on the page main thread' + (pidCount > 1 ? 's (' + pidCount + ' renderer processes)' : '') + ': ' + top.length);
  top.forEach((t, i) => {
    const k = ix.key(t), t1 = t.ts + t.dur;
    out.push('');
    out.push('#' + (i + 1) + ' at ' + rel(t.ts) + ': ' + ms(t.dur) + ' ms' + (pidCount > 1 ? ' (renderer ' + t.pid + ')' : ''));
    const st = selfTimes(ix, t.pid, t.tid, t.ts, t1, pageHost);
    if (st.byOwner.length) out.push('  time by owner: ' + st.byOwner.map(([o, us]) => o + ' ' + ms(us) + ' ms').join(', '));
    st.byFn.filter(([n]) => n !== '(idle)').slice(0, 8).forEach(([n, v]) => out.push('    ' + ms(v.us) + ' ms  ' + n + (v.owner && !/^(GC|browser|idle)$/.test(v.owner) ? '  [' + v.owner + ']' : '')));
    if (!st.byFn.length) out.push('  (no JavaScript samples: is the cpu_profiler category on?)');
    const gc = gcOn(k, t.ts, t1);
    const gpu = gpuDuring(t.ts, t1);
    out.push('  verdict: ' + verdict(t.dur, st.byOwner, st.byFn, gc.us, gpu.us));
    out.push('  GC during it: ' + (gc.us ? ms(gc.us) + ' ms (' + [...gc.names].map(([n, c]) => n + (c > 1 ? ' x' + c : '')).join(', ') + ')' : 'none'));
    out.push('  GPU process busy during it: ' + (gpu.us ? ms(gpu.us) + ' ms (' + gpu.per.slice(0, 3).map(([n, us]) => n + ' ' + ms(us)).join(', ') + ')' : 'none'));
    const fz = lmFreezes.filter(f => f.ts0 !== null && f.ts0 < t1 && f.ts1 > t.ts);
    fz.forEach(f => out.push('  Legend Mod: ' + f.line));
    loafs.filter(l => off !== null && toTrace(l.t) < t1 && toTrace(l.t + l.dur) > t.ts).slice(0, 2).forEach(l => {
      (l.scripts || []).slice(0, 3).forEach(s => {
        const nm = s.file && s.pos >= 0 ? nameAt(s.file, s.pos) : '';
        out.push('  LoAF script: ' + (s.fn || s.inv || s.type || 'script') + ' (' + (s.file || '?') + (s.pos >= 0 ? ':' + s.pos : '') + ')' + (nm ? ' = ' + nm : '') + ' ' + s.dur + ' ms' + (s.kind && s.kind !== 'legendmod' ? ' [' + s.kind + ']' : ''));
      });
    });
  });
  /* freezes Legend Mod counted that no long task explains */
  if (lmFreezes.length) {
    const lone = lmFreezes.filter(f => f.ts0 === null || !top.some(t => f.ts0 < t.ts + t.dur && f.ts1 > t.ts));
    out.push('');
    out.push('Legend Mod freezes: ' + lmFreezes.length + (off === null ? ' (the clocks could not be lined up)' : ', ' + (lmFreezes.length - lone.length) + ' with a long task'));
    lone.forEach(f => {
      let extra = '';
      if (f.ts0 !== null) {
        const g = gpuDuring(f.ts0, f.ts1), mk = mainKeys[0];
        const gc = mk ? gcOn(mk, f.ts0, f.ts1) : { us: 0 };
        extra = ' | no long task; GPU process busy ' + ms(g.us) + ' ms, GC ' + ms(gc.us) + ' ms';
      }
      out.push('  ' + f.line + extra);
    });
  }
  /* JavaScript time of the whole trace by owner (third-party causes show here) */
  const all = new Map();
  for (const p of ix.profiles.values()) {
    if (!mainKeys.some(k => +k.split(':')[0] === p.pid)) continue;
    for (const s of p.samples) {
      const lab = frameLabel(p.nodes.get(s[1]), pageHost, p.nodes);
      all.set(lab.owner, (all.get(lab.owner) || 0) + s[2]);
    }
  }
  if (all.size) {
    const busy = [...all].filter(([o]) => o !== 'idle');
    const tot = busy.reduce((s, [, us]) => s + us, 0) || 1;
    out.push('');
    out.push('Main thread time by owner (whole trace, without idle): ' + busy.sort((a, b) => b[1] - a[1]).map(([o, us]) => o + ' ' + Math.round(us * 100 / tot) + '%').join(', '));
  }
  return out;
}

module.exports = { summarize, indexTrace, unionUs, selfTimes, ownerOf, verdict };

/* ------------------------------------------------------------------------------------------
 * The run (only when started from the command line)
 * ------------------------------------------------------------------------------------------ */

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help')) {
    console.log('usage: node developers/tests/trace.js --secs 120 [--until-freezes 3] [--url URL] [--out DIR] [--keep-profile]');
    console.log('opens a visible Chrome, records a performance trace while you play, then prints which code ran during each freeze');
    process.exit(0);
  }
  const argVal = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : def; };
  const url = argVal('--url', 'https://www.legendmod.ml/play.html');
  const secs = Math.max(5, Number(argVal('--secs', 120)) || 120);
  const untilFreezes = Math.max(0, Number(argVal('--until-freezes', 3)) || 0);
  const outDir = path.resolve(argVal('--out', path.join(__dirname, 'out')));
  const keepProfile = args.includes('--keep-profile');
  const headless = args.includes('--headless');
  if (typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('Node 22+ is required (global fetch and WebSocket)'); process.exit(1); }

  function findChrome() {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    const cands = [];
    if (process.platform === 'win32') {
      for (const base of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA, 'C:/Program Files', 'C:/Program Files (x86)']) {
        if (base) cands.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Chromium/Application/chrome.exe'));
      }
    } else if (process.platform === 'darwin') {
      cands.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium');
    } else {
      const dirs = (process.env.PATH || '').split(path.delimiter).concat(['/usr/bin', '/usr/local/bin', '/snap/bin']);
      for (const n of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) for (const d of dirs) if (d) cands.push(path.join(d, n));
    }
    return cands.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
  }
  const chrome = findChrome();
  if (!chrome) { console.log('chrome not found: set CHROME_PATH'); process.exit(2); }
  const port = 9300 + Math.floor(Math.random() * 500);
  fs.mkdirSync(outDir, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-trace-'));
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace(/Z$/, '');
  const traceFile = path.join(outDir, 'trace-' + stamp + '.json');
  const summaryFile = path.join(outDir, 'trace-' + stamp + '-summary.txt');

  const proc = spawn(chrome, [...(headless ? ['--headless=new'] : []), '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--window-size=1600,900', '--autoplay-policy=no-user-gesture-required',
    ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  proc.on('error', e => { console.log('chrome failed to start:', e.message); process.exit(2); });
  const cleanup = () => { try { proc.kill(); } catch (e) { } if (!keepProfile) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } }, 1500); };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let id = 0; const pending = new Map(), waiters = new Map();
  let stopping = false;
  const tStartAll = Date.now();
  process.on('SIGINT', () => { if (stopping) { cleanup(); process.exit(130); } stopping = true; console.log('\nstopping, reading the trace...'); });

  (async () => {
    let ver;
    for (let i = 0; i < 50; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); break; } catch (e) { await sleep(200); } }
    if (!ver) { console.log('chrome did not start'); cleanup(); process.exit(2); }
    const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    const waitEvent = (method) => new Promise(res => waiters.set(method, res));
    let bufferFull = false;
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
      if (m.method === 'Tracing.bufferUsage' && m.params && m.params.percentFull > 0.98 && !bufferFull) {
        bufferFull = true; console.log('trace buffer full: from now on the oldest part is dropped (the last ~' + Math.round((Date.now() - tStartAll) / 1000) + ' s are kept)');
      }
      if (m.method && waiters.has(m.method)) { const w = waiters.get(m.method); waiters.delete(m.method); w(m.params); }
    };
    ws.onclose = () => { if (!stopping) { console.log('the Chrome window was closed: no trace'); cleanup(); process.exit(4); } };
    await new Promise(r => ws.onopen = r);
    const evalPage = async (expression, awaitPromise) => {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: !!awaitPromise, returnByValue: true });
      return r && r.result ? r.result.value : undefined;
    };
    await send('Page.enable'); await send('Runtime.enable');
    /* no Player Monitor entry for this test browser (lib/nopresence.js) */
    await send('Page.addScriptToEvaluateOnNewDocument', { source: require('./lib/nopresence').source });
    console.log('opening ' + url + ' (Chrome ' + (ver.Browser || '') + ')');
    await send('Page.navigate', { url });
    /* Legend Mod's diagnostics: recording with the freeze breakdown, also with the window closed */
    let lm = false;
    for (let i = 0; i < 120 && !stopping; i++) {
      lm = await evalPage('!!(window.LMPerf && window.LMPerf.keepRecording)');
      if (lm) break;
      await sleep(500);
    }
    if (lm) {
      await evalPage('window.LMPerf.keepRecording(true), true');
      console.log('Legend Mod Performance diagnostics: recording (freeze breakdown on)');
    } else console.log('Legend Mod not found in the page: only the browser trace (no freeze count, runs for --secs)');
    const pageHost = await evalPage('location.host') || '';
    /* what DevTools records (tasks, GPU tasks), JavaScript samples, GC, Blink and the GPU
     * command buffers; without "toplevel" and frame pipelines, which would fill the buffer */
    const cats = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8', 'v8.execute', 'disabled-by-default-v8.cpu_profiler',
      'disabled-by-default-v8.gc', 'blink', 'blink.user_timing', ...(args.includes('--no-gpu') ? [] : ['gpu'])];
    await send('Tracing.start', {
      transferMode: 'ReturnAsStream', streamFormat: 'json', bufferUsageReportingInterval: 2000,
      /* a ring buffer: a long run keeps its last part (the freezes that ended it) */
      traceConfig: { recordMode: 'recordContinuously', traceBufferSizeInKb: 200 * 1024, includedCategories: cats, excludedCategories: ['*'] }
    });
    await sleep(300);
    /* one mark seen by both clocks: the page's performance.now and the trace time */
    const sync = await evalPage('(function () { var m = performance.mark("lm-trace-sync"); return { perfNow: m ? m.startTime : performance.now(), timeOrigin: performance.timeOrigin }; })()') || {};
    console.log('tracing: play normally; stops after ' + secs + ' s' + (lm && untilFreezes ? ' or ' + untilFreezes + ' freezes' : '') + ' (Ctrl+C to stop now). performance.timeOrigin ' + Math.round(sync.timeOrigin || 0));
    const base = lm ? (await evalPage('window.LMPerf.freezes().length')) || 0 : 0;
    const tStart = Date.now();
    let seen = 0;
    while (!stopping && Date.now() - tStart < secs * 1000) {
      await sleep(2000);
      if (!lm) continue;
      const list = await evalPage('window.LMPerf.freezes().map(function (f) { return f.line; })') || [];
      for (let i = base + seen; i < list.length; i++) { seen++; console.log('  freeze ' + seen + (untilFreezes ? '/' + untilFreezes : '') + ': ' + list[i]); }
      if (untilFreezes && seen >= untilFreezes) { await sleep(1500); break; }
    }
    stopping = true;
    /* Legend Mod's own data, and the texts of its scripts for the function names at LoAF positions */
    let report = '', freezes = [], loafs = [], sources = {};
    if (lm) {
      report = await evalPage('window.LMPerf.report()') || '';
      freezes = await evalPage('window.LMPerf.freezes()') || [];
      loafs = await evalPage('window.LMPerf.loafs()') || [];
      const files = [...new Set(loafs.flatMap(l => (l.scripts || []).filter(s => s.kind === 'legendmod' && s.pos >= 0).map(s => s.file)))];
      if (files.length) {
        sources = await evalPage('(async function (files) { var out = {}, urls = []; ' +
          'Array.prototype.forEach.call(document.scripts, function (s) { if (s.src) urls.push(s.src); }); ' +
          'performance.getEntriesByType("resource").forEach(function (e) { urls.push(e.name); }); ' +
          'for (var i = 0; i < urls.length; i++) { var f = urls[i].split(/[?#]/)[0].split("/").pop(); ' +
          'if (files.indexOf(f) < 0 || out[f] || !/legendmod\\.ml|jimboy3100\\.github\\.io/.test(urls[i])) continue; ' +
          'try { out[f] = await (await fetch(urls[i], { cache: "force-cache" })).text(); } catch (e) { } } return out; })(' + JSON.stringify(files) + ')', true) || {};
      }
      await evalPage('window.LMPerf.keepRecording(false), true');
    }
    /* the trace, streamed to the file */
    const done = waitEvent('Tracing.tracingComplete');
    await send('Tracing.end');
    const tc = await done;
    const fd = fs.openSync(traceFile, 'w');
    for (;;) {
      const r = await send('IO.read', { handle: tc.stream, size: 4 * 1024 * 1024 });
      if (!r || r.code) break;
      if (r.data) fs.writeSync(fd, r.base64Encoded ? Buffer.from(r.data, 'base64') : Buffer.from(r.data, 'utf8'));
      if (r.eof) break;
    }
    fs.closeSync(fd);
    await send('IO.close', { handle: tc.stream });
    ws.onclose = null;
    try { ws.close(); } catch (e) { }
    cleanup();
    console.log('trace: ' + traceFile + ' (' + Math.round(fs.statSync(traceFile).size / 1048576) + ' MB)');
    let lines;
    try {
      /* a string this long cannot be parsed in one piece: DevTools can still open the file */
      if (fs.statSync(traceFile).size > 480 * 1048576) throw new Error('the trace is too big to summarize here (try --secs 60 or --no-gpu); open it in DevTools > Performance');
      const trace = JSON.parse(fs.readFileSync(traceFile, 'utf8'));
      lines = summarize(trace, { sync, freezes, loafs, sources, pageHost });
    } catch (e) { lines = ['could not read the trace: ' + e.message]; }
    console.log('');
    lines.forEach(l => console.log(l));
    fs.writeFileSync(summaryFile, lines.join('\n') + (report ? '\n\n--- Legend Mod performance report ---\n' + report + '\n' : '\n'));
    console.log('\nsummary: ' + summaryFile);
    process.exit(0);
  })().catch(e => { console.log('trace error', e); cleanup(); process.exit(3); });
}
