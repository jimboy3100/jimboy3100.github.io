/* The trace summary of developers/tests/trace.js on a small synthetic Chrome trace: long tasks
 * with their top self-time functions by owner (legendmod / agar.io / extension), GC and GPU
 * work during them, Legend Mod's freeze lines lined up by the sync mark, function names at
 * LoAF positions. node developers/tests/trace-summary.js */
const path = require('path');
const T = require(path.join(__dirname, 'trace.js'));
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const PID = 10, MAIN = 1, GPU = 20, GPUMAIN = 5;
const ms = v => v * 1000;
const T0 = 5e9; /* trace clock, µs */
const evs = [
  { ph: 'M', name: 'process_name', pid: PID, tid: 0, args: { name: 'Renderer' } },
  { ph: 'M', name: 'thread_name', pid: PID, tid: MAIN, args: { name: 'CrRendererMain' } },
  { ph: 'M', name: 'thread_name', pid: PID, tid: 7, args: { name: 'Compositor' } },
  { ph: 'M', name: 'process_name', pid: GPU, tid: 0, args: { name: 'GPU Process' } },
  { ph: 'M', name: 'thread_name', pid: GPU, tid: GPUMAIN, args: { name: 'CrGpuMain' } },
  /* the sync mark: performance.now 2000 ms is trace time T0 + 1 s */
  { ph: 'R', cat: 'blink.user_timing', name: 'lm-trace-sync', pid: PID, tid: MAIN, ts: T0 + ms(1000) },
  /* short tasks */
  { ph: 'X', name: 'RunTask', pid: PID, tid: MAIN, ts: T0 + ms(1100), dur: ms(8) },
  /* long task 1: 287 ms at +2 s (performance.now 3000..3287) */
  { ph: 'X', name: 'RunTask', pid: PID, tid: MAIN, ts: T0 + ms(2000), dur: ms(287) },
  { ph: 'X', name: 'FunctionCall', pid: PID, tid: MAIN, ts: T0 + ms(2001), dur: ms(280) },
  { ph: 'X', name: 'MinorGC', pid: PID, tid: MAIN, ts: T0 + ms(2200), dur: ms(30) },
  { ph: 'X', name: 'V8.GC_SCAVENGER', pid: PID, tid: MAIN, ts: T0 + ms(2205), dur: ms(20) },
  { ph: 'X', name: 'ThreadControllerImpl::RunTask', pid: GPU, tid: GPUMAIN, ts: T0 + ms(2100), dur: ms(120) },
  { ph: 'X', name: 'GPUTask', pid: GPU, tid: GPUMAIN, ts: T0 + ms(2150), dur: ms(40) },
  /* long task 2: 150 ms at +6 s, mostly agar.io's code */
  { ph: 'X', name: 'RunTask', pid: PID, tid: MAIN, ts: T0 + ms(6000), dur: ms(150) },
  /* long task 3: 200 ms at +7 s, the main thread idle while the GPU process works */
  { ph: 'X', name: 'RunTask', pid: PID, tid: MAIN, ts: T0 + ms(7000), dur: ms(200) },
  { ph: 'X', name: 'RunTask', pid: GPU, tid: GPUMAIN, ts: T0 + ms(6990), dur: ms(215) },
  /* a long task on another (compositor) thread is not the page's */
  { ph: 'X', name: 'RunTask', pid: PID, tid: 7, ts: T0 + ms(8000), dur: ms(400) },
  /* the CPU profile: nodes and 1 ms samples */
  { ph: 'P', name: 'Profile', pid: PID, tid: MAIN, id: '0x1', ts: T0, args: { data: { startTime: T0 + ms(1990) } } }
];
const nodes = [
  { id: 1, callFrame: { functionName: '(root)', url: '' } },
  { id: 2, parent: 1, callFrame: { functionName: '(program)', url: '' } },
  { id: 3, parent: 1, callFrame: { functionName: 'uploadSkinTexture', url: 'https://www.legendmod.ml/ogario/ogario.v4.js?v=3.589&token=SECRET', lineNumber: 64299, columnNumber: 8 } },
  { id: 4, parent: 1, callFrame: { functionName: 'Ab', url: 'https://agar.io/mc/agario.core.js?1', lineNumber: 0, columnNumber: 5 } },
  { id: 5, parent: 1, callFrame: { functionName: '(garbage collector)', url: '' } },
  { id: 6, parent: 1, callFrame: { functionName: 'hook', url: 'chrome-extension://abc/content.js', lineNumber: 9, columnNumber: 0 } },
  { id: 7, parent: 1, callFrame: { functionName: '(idle)', url: '' } },
  { id: 8, parent: 3, callFrame: { functionName: 'texImage2D', url: '' } }
];
/* samples from +1990 ms, 1 ms apart: 10 idle, then task 1 (200 upload, 30 GC, 57 program), idle until task 2 (120 agar.io, 20 extension, 10 program) */
const samples = [], deltas = [];
const add = (node, n) => { for (let i = 0; i < n; i++) { samples.push(node); deltas.push(samples.length === 1 ? 0 : 1000); } };
add(7, 10); add(3, 180); add(8, 20); add(5, 30); add(2, 57); add(7, 3713); add(4, 120); add(6, 20); add(2, 10); add(7, 850); add(7, 200);
evs.push({ ph: 'P', name: 'ProfileChunk', pid: PID, tid: MAIN, id: '0x1', ts: T0 + ms(7000), args: { data: { cpuProfile: { nodes, samples }, timeDeltas: deltas } } });

const text = 'var drawRender = window.drawRender = {\n    initWebGL() {\n        setTimeout(function () { up(); }, 5);\n    }\n};\n';
const freezes = [
  { t: 3290, dur: 300, line: '300 ms freeze 12:00:03.290 · WebGL2 · skin texture upload 240 ms · network normal · probable contributor: skin texture upload', probable: 'skin texture upload' },
  { t: 9500, dur: 260, line: '260 ms freeze 12:00:09.500 · WebGL2 · no timed part over 1 ms · network normal · unattributed (GC/GPU/browser?)', probable: '' }
];
const loafs = [{ t: 3000, dur: 287, scripts: [{ fn: '', inv: 'TimerHandler:setTimeout', type: 'user-callback', file: 'ogario.v4.js', kind: 'legendmod', pos: text.indexOf('function ()'), dur: 250 }] }];

const lines = T.summarize({ traceEvents: evs }, { sync: { perfNow: 2000 }, freezes, loafs, sources: { 'ogario.v4.js': text }, pageHost: 'www.legendmod.ml' });
const out = lines.join('\n');
console.log(out.split('\n').map(l => '    | ' + l).join('\n'));
check('three long tasks on the main thread (the compositor one is left out)', /Long tasks \(≥100 ms\) on the page main thread: 3/.test(out) && !/400 ms/.test(out));
check('task 1: 287 ms with the upload as top self time, labelled legendmod, line:col shown', /#1 at [\d.]+ s: 287 ms/.test(out) && /180 ms {2}uploadSkinTexture ogario\.v4\.js:64300:9 {2}\[legendmod\]/.test(out) && /20 ms {2}texImage2D \(built-in\) {2}\[legendmod\]/.test(out));
check('task 1: verdict names the owner and the top function', /verdict: mostly JavaScript of legendmod \(top: uploadSkinTexture\)/.test(out));
check('task 3: idle main thread while the GPU process works is a GPU stall', /#3 .*: 200 ms[\s\S]*?verdict: the main thread waited for the GPU process/.test(out));
check('task 1: time by owner', /time by owner: legendmod 200 ms, browser 57 ms, GC 30 ms/.test(out));
check('task 1: GC events overlapping it, nested ones counted once', /GC during it: 30 ms \(MinorGC, V8\.GC\)/.test(out));
check('task 1: GPU process busy during it', /GPU process busy during it: 120 ms \(CrGpuMain 120\)/.test(out));
check('task 1: the Legend Mod freeze lined up through the sync mark', /Legend Mod: 300 ms freeze 12:00:03\.290 .*probable contributor: skin texture upload/.test(out));
check('task 1: the LoAF script named from its character position', /LoAF script: TimerHandler:setTimeout \(ogario\.v4\.js:\d+\) = setTimeout callback in window\.drawRender\.initWebGL 250 ms/.test(out));
check('task 2: agar.io and extension code labelled as such', /#2 .*: 150 ms/.test(out) && /120 ms {2}Ab agario\.core\.js:1:6 {2}\[agar\.io\]/.test(out) && /20 ms {2}hook content\.js:10:1 {2}\[extension\]/.test(out) && /GC during it: none/.test(out));
check('a freeze without a long task is listed with GPU / GC during it', /Legend Mod freezes: 2, 1 with a long task/.test(out) && /260 ms freeze .* \| no long task; GPU process busy 0 ms, GC 0 ms/.test(out));
check('whole trace: main thread time by owner', /Main thread time by owner \(whole trace, without idle\): legendmod 46%, agar\.io 27%, browser 15%, GC 7%, extension 5%/.test(out));
check('no token or query in the summary', out.indexOf('SECRET') < 0 && out.indexOf('?v=') < 0);
check('union of nested intervals', T.unionUs([[0, 10], [2, 5], [8, 12], [20, 25]]) === 17 && T.unionUs([]) === 0);
const noSync = T.summarize([].concat(evs.filter(e => e.name !== 'lm-trace-sync')), { freezes }).join('\n');
check('without the sync mark the freezes are listed, not lined up', /the clocks could not be lined up/.test(noSync) && !/Legend Mod: /.test(noSync));

console.log(fail ? fail + ' failed' : 'all trace summary checks passed');
process.exit(fail ? 1 : 0);
