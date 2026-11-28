/* Dying Light in recordings: what the recording keeps (window._lmRecDl in ogario/ogario.v4.js:
 * on / off with its time, intensity, Day and night, the director's clock) and that it goes through
 * the Replay Studio sidecar, the library form and .lm files and back (ogario/modules/replaystudio.js),
 * while old recordings and files without it keep the normal look.
 * node developers/tests/replaydl.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const core = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(src, start) {
    const i = src.indexOf(start);
    if (i < 0) throw Error(start + ' not found');
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
}
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ---- recording side ---- */
let now = 1000000;
const listeners = {};
const visListeners = [], timers = [];
let queued = 0;
const ctx = {
    Math, isFinite, JSON,
    Date: { now: () => now },
    LMEvents: { on(n, f) { (listeners[n] || (listeners[n] = [])).push(f); } },
    defaultmapsettings: { dyingLightCycle: true },
    document: { addEventListener(n, f) { if (n === 'visibilitychange') visListeners.push(f); } },
    setTimeout(f) { timers.push(f); queued++; },
    catholicCalculator: 0, _lmRecSlotBytes: 0, _lmRecFull: false, _lmRecLive: true,
    RecordedProtocol: {}, temporaryRecordedProtocol: 'k'
};
ctx.window = ctx;
vm.createContext(ctx);
const dlStart = core.indexOf('\nvar LM_REC_DL_MAX');
const dlEnd = core.indexOf('\n//window.fpsloopsetter', dlStart);
if (dlStart < 0 || dlEnd < 0) throw Error('Dying Light recording code not found');
vm.runInContext([block(core, '\nfunction lmRecRoom(').slice(1), block(core, 'window._lmRecM = function') + ';',
    block(core, 'window._lmRecSample = function') + ';', core.slice(dlStart, dlEnd)].join('\n'), ctx);
const emit = (n, d) => (listeners[n] || []).forEach(f => f(d));
/* the theme and its director as extras/dyinglight.js shows them */
let dlOn = false, intensity = 'immersive', clock = 0, running = true;
const DL = { _lm: 1, isEnabled: () => dlOn, intensity: () => intensity };
const DIR = { info: () => ({ on: dlOn, running: dlOn && running, clock: dlOn ? clock : 0 }) };
function newRec() {
    ctx.RecordedProtocol.k = [];
    ctx.RecordedProtocol.k._lm = { v: 1, t0: now, ct: 0, st: 0, t: [], s: [], e: [], c: [] };
    ctx._lmRecDl();
    return ctx.RecordedProtocol.k._lm;
}
const lm = { playerMass: 10, playerCells: [], playerPosition: 1 };
const tick = (ms) => { now += ms; if (dlOn && running) clock += ms; };

check('listens to dyingLightChange and settingsChange', (listeners.dyingLightChange || []).length === 1 && (listeners.settingsChange || []).length === 1);
let m = newRec();
check('theme script not loaded: no dl (normal look)', m.dl === undefined);
ctx.LMDyingLight = DL; ctx.LMDyingLightDirector = DIR;
m = newRec();
check('theme off at the start: no dl', m.dl === undefined);
tick(3000); ctx._lmRecSample(lm);
check('off and samples: still no dl', m.dl === undefined);
dlOn = true; tick(1000); clock = 0; emit('dyingLightChange', { state: 'on' });
check('turned on later: entry at its time', same(m.dl, [{ t: 4000, on: 1, i: 'immersive', cy: 1, ck: 0 }]));
emit('dyingLightChange', { state: 'on' });
check('same state again: no new entry', m.dl.length === 1);
tick(20000); ctx._lmRecSample(lm);
check('clock runs with the recording: no drift entry', m.dl.length === 1);
intensity = 'nightmare'; emit('dyingLightChange', { state: 'on' });
check('intensity change recorded with the clock', same(m.dl[1], { t: 24000, on: 1, i: 'nightmare', cy: 1, ck: 20000 }));
ctx.defaultmapsettings.dyingLightCycle = false; emit('settingsChange', { key: 'dyingLightCycle', value: false });
check('Day and night off recorded', m.dl.length === 3 && m.dl[2].cy === 0);
emit('settingsChange', { key: 'showMass', value: true });
check('other settings ignored', m.dl.length === 3);
ctx.defaultmapsettings.dyingLightCycle = true; emit('settingsChange', { key: 'dyingLightCycle', value: true });
running = false; tick(6000); ctx._lmRecSample(lm);
check('hidden tab: the clock standing still is recorded once', m.dl.length === 5 && m.dl[4].ps === 1 && m.dl[4].ck === 20000);
tick(6000); ctx._lmRecSample(lm); tick(6000); ctx._lmRecSample(lm);
check('still hidden: no more entries', m.dl.length === 5);
running = true; tick(6000); ctx._lmRecSample(lm);
check('visible again: clock going again', m.dl.length === 6 && !m.dl[5].ps && m.dl[5].ck === 26000);
clock += 5000; tick(6000); ctx._lmRecSample(lm);
check('clock drift of 5 s: a new entry', m.dl.length === 7 && m.dl[6].ck === clock);
dlOn = false; emit('dyingLightChange', { state: 'disabling' });
check('turned off: off entry', same(m.dl[7], { t: m.dl[7].t, on: 0 }) && m.dl[7].t === now - m.t0);
emit('dyingLightChange', { state: 'off' });
check('off twice: one off entry', m.dl.length === 8);
const n0 = m.dl.length;
dlOn = true; clock = 0; m = newRec();
check('new recording with the theme on: state at 0', same(m.dl, [{ t: 0, on: 1, i: 'nightmare', cy: 1, ck: 0 }]) && n0 === 8);
ctx._lmRecLive = false; tick(10000); intensity = 'competitive'; emit('dyingLightChange', { state: 'on' });
check('not recording (a replay): nothing kept', m.dl.length === 1);
ctx._lmRecLive = true;
for (let i = 0; i < 600; i++) { intensity = i & 1 ? 'immersive' : 'competitive'; emit('dyingLightChange', { state: 'on' }); }
check('entries capped at 512', m.dl.length === 512);
ctx.LMDyingLightDirector = { info() { throw Error('x'); } };
m = newRec();
check('a throwing director: nothing recorded, no error', m.dl === undefined);
ctx.LMDyingLightDirector = null; m = newRec();
check('no director: on without a clock', same(m.dl, [{ t: 0, on: 1, i: m.dl[0].i, cy: 1 }]));
tick(30000); ctx._lmRecSample(lm);
check('no director: no clock drift entries', m.dl.length === 1);
/* a hidden tab: no frames, so no samples; the director pauses in its own visibilitychange handler */
const runTimers = () => { while (timers.length) timers.shift()(); };
const visChange = (hidden) => { visListeners.forEach(f => f()); running = !hidden; runTimers(); };
ctx.LMDyingLightDirector = DIR; dlOn = true; running = true; clock = 0; m = newRec();
tick(10000); visChange(true); const tHide = now - m.t0;
tick(60000); visChange(false); const tShow = now - m.t0;
check('hidden tab without frames: the stop and the start are recorded at their times',
    same(m.dl.slice(1), [{ t: tHide, on: 1, i: m.dl[0].i, cy: 1, ck: 10000, ps: 1 }, { t: tShow, on: 1, i: m.dl[0].i, cy: 1, ck: 10000 }]));
tick(5000); ctx._lmRecSample(lm);
check('after the return: clock in step, no drift entry', m.dl.length === 3);
dlOn = false; m = newRec(); queued = 0; visChange(true); visChange(false);
check('theme never on in this recording: a visibility change does nothing', m.dl === undefined && queued === 0);

/* ---- Replay Studio sidecar, library and .lm files ---- */
const rsSrc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'replaystudio.js'), 'utf8');
const rctx = { console, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite, Number, String, Array, Object };
rctx.window = rctx;
vm.createContext(rctx);
vm.runInContext(rsSrc, rctx);
const L = rctx.LMReplayStudio.lib;
const dl = [{ t: 0, on: 1, i: 'immersive', cy: 1, ck: 120000 }, { t: 60000, on: 1, i: 'immersive', cy: 1, ck: 150000, ps: 1 },
    { t: 90000, on: 1, i: 'immersive', cy: 1, ck: 150000 }, { t: 200000, on: 0 }];
const meta = { t: [0, 10, 20], s: [], e: [], c: [], dl };
const side = L.makeSidecar(meta, 3);
check('sidecar keeps dl', same(side.dl, dl));
const back = L.readSidecar(JSON.parse(JSON.stringify(side)), 3);
check('sidecar read back: dl the same', same(back.dl, dl));
check('library form (sideOut) keeps dl', same(L.sideOut(back, 3).dl, dl));
check('no dl in the meta: none in the sidecar', L.makeSidecar({ t: [0, 10, 20], s: [], e: [], c: [] }, 3).dl === undefined);
check('old sidecar: empty dl, normal look', same(L.readSidecar({ lmrs: 1, s: [], e: [], c: [] }, 3).dl, []) && L.dlAt([], 5000) === null);
check('not a sidecar: empty dl', same(L.readSidecar(null, 3).dl, []));
check('sideOut of an old sidecar: no dl field', L.sideOut(L.readSidecar({ lmrs: 1 }, 3), 3).dl === undefined);
const pk = [new DataView(new Uint8Array([16, 1]).buffer), new DataView(new Uint8Array([18]).buffer), new DataView(new Uint8Array([17, 2]).buffer)];
const text = L.lmFileParts(pk, [1700000000000, ':ffa', 'EU', 'nick', '{}'], side).join('');
const file = L.parseLmText(text);
check('.lm file round trip keeps dl', same(file.side.dl, dl) && file.packets.length === 3);
check('.lm file stays in the old layout', JSON.parse(text).length === 4 && Array.isArray(JSON.parse(text)[3]));
const old = L.parseLmText(JSON.stringify(['\u0010\u0001', '\u0012', [1, 'm', 'r', 'n']]));
check('old .lm file without Studio data: no dl', same(old.side.dl, []));
const oldStudio = L.parseLmText(JSON.stringify(['\u0010\u0001', '\u0012', [1, 'm', 'r', 'n', '{}', { lmrs: 1, t: [0, 40], s: [], e: [], c: [] }]]));
check('Studio file of an older version: no dl, times kept', same(oldStudio.side.dl, []) && !oldStudio.side.est);
const dirty = L.cleanDl([{ t: 5, on: 1, i: 'party', cy: 0, ck: -3, x: 'y' }, 'z', [1], { t: 2, on: 1 }, { t: 'a', on: 1 }, { t: 9, on: 1, i: 'nightmare', ck: 7.6, ps: 5, extra: {} }, { t: 2e9, on: 0 }]);
check('untrusted dl cleaned (bad entries, backwards times, unknown fields and intensities)',
    same(dirty, [{ t: 5, on: 1, i: 'immersive', cy: 0 }, { t: 9, on: 1, i: 'nightmare', cy: 1, ck: 8, ps: 1 }]));
check('dl not a list: empty', same(L.cleanDl({ t: 0, on: 1 }), []) && same(L.cleanDl('x'), []));
check('dl longer than 512 is cut', L.cleanDl(Array.from({ length: 900 }, (_, i) => ({ t: i, on: i & 1 }))).length === 512);
check('state at a time: clock moves on', same(L.dlAt(dl, 30000), { on: 1, i: 'immersive', cy: 1, ck: 150000 }));
check('state at a time: paused clock stands', L.dlAt(dl, 80000).ck === 150000 && L.dlAt(dl, 100000).ck === 160000);
check('state after off and before the first entry: normal look', L.dlAt(dl, 250000) === null && L.dlAt([{ t: 5000, on: 1, i: 'immersive', cy: 1 }], 1000) === null);
const cs = L.cutSide({ s: [], e: [], c: [], dl }, 70000, 70000, 150000);
check('clip: state at its start first (paused), later changes rebased, after its end dropped',
    same(cs.dl, [{ on: 1, i: 'immersive', cy: 1, ck: 150000, t: 0, ps: 1 }, { t: 20000, on: 1, i: 'immersive', cy: 1, ck: 150000 }]));
check('clip of a live recording takes the live dl', L.cutSide({ s: [], e: [], c: [], live: { dl } }, 10000, 10000, 20000).dl[0].ck === 130000);
check('clip without dl: empty', same(L.cutSide({ s: [], e: [], c: [] }, 0, 0, 100).dl, []));
check('clip with the theme off at its start: no first entry', same(L.cutSide({ s: [], e: [], c: [], dl }, 210000, 210000, 300000).dl, []));

console.log(failed ? failed + ' FAILED' : 'all ok');
process.exit(failed ? 1 : 0);
