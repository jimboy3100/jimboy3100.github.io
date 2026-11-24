/* Adaptive performance, diagnostics and network history checks (ogario/modules/perf.js):
 * level stepping with hysteresis, percentile math, exact restore of the player's values,
 * nothing running while off. node developers/tests/perf.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const file = process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'perf.js');
const P = require(file);
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-9);

/* ---- percentiles ---- */
const hundred = []; for (let i = 1; i <= 100; i++) hundred.push(i);
check('p50 of 1..100 is 50.5', near(P.percentile(hundred, 50), 50.5));
check('p95 of 1..100 is 95.05', near(P.percentile(hundred, 95), 95.05));
check('p99 of 1..100 is 99.01', near(P.percentile(hundred, 99), 99.01));
check('p0 / p100 are min / max', P.percentile(hundred, 0) === 1 && P.percentile(hundred, 100) === 100);
check('empty list gives 0', P.percentile([], 50) === 0);
check('one value', P.percentile([7], 99) === 7);
check('sortedCopy sorts numbers (not as text) and keeps the input', (() => { const a = [10, 9, 100, 1]; const s = P.sortedCopy(a); return s.join() === '1,9,10,100' && a.join() === '10,9,100,1'; })());
check('sortedCopy of a Float32Array', P.sortedCopy(new Float32Array([3, 1, 2])).join() === '1,2,3');
check('p50 of 4 values interpolates', near(P.percentile([10, 20, 30, 40], 50), 25));

/* ---- targets ---- */
check('target snaps to 30/60/90/120', P.snapTarget(61) === 60 && P.snapTarget(100) === 90 && P.snapTarget(500) === 120 && P.snapTarget('x') === 60 && P.snapTarget(10) === 30);
check('FPS limit lowers the target', P.effectiveTarget(120, 60, 0) === 60);
check('limit 0 is no limit', P.effectiveTarget(90, 0, 0) === 90);
check('60 Hz screen caps a 120 target', P.effectiveTarget(120, 0, 60) === 60);
check('a measured 30 Hz is not trusted as the screen rate', P.effectiveTarget(60, 0, 30) === 60);
check('refresh rate snaps (59.6 -> 60, 143 -> 144)', P.snapRefresh(59.6) === 60 && P.snapRefresh(143) === 144);
const even33 = new Array(30).fill(33.3), uneven = []; for (let i = 0; i < 30; i++) uneven.push(i % 2 ? 16.7 : 40);
check('even frames with little drawing: held by the screen', P.displayBound(P.sortedCopy(even33), 4) === true);
check('even frames with heavy drawing: held by the game', P.displayBound(P.sortedCopy(even33), 25) === false);
check('uneven frames: held by the game', P.displayBound(P.sortedCopy(uneven), 4) === false);

/* ---- controller: stepping with hysteresis ---- */
const run = (st, fps, secs, target, rp90) => { const ch = []; for (let i = 0; i < secs; i++) { const c = P.controllerStep(st, fps, target || 60, rp90 === undefined ? 4 : rp90, 1); if (c) ch.push([st.t, c]); } return ch; };
let st = P.newController();
check('2 s slow: no change', run(st, 40, 2).length === 0 && st.level === 0);
run(st, 60, 1);
check('slow stretch broken by a fast second starts again', run(st, 40, 2).length === 0 && st.level === 0);
st = P.newController();
let ch = run(st, 40, 3);
check('3 s below target: level 1', st.level === 1 && ch.length === 1);
ch = run(st, 40, 4);
check('next level waits for the settle time (not after 3 more s)', st.level === 1 && ch.length === 0);
ch = run(st, 40, 1);
check('level 2 after 3 s + settle', st.level === 2 && ch.length === 1);
run(st, 40, 5); run(st, 40, 5);
check('never past level 3', st.level === 3);
st = P.newController(); run(st, 40, 3);
check('close to the target (55 of 60): no change either way', run(st, 55, 30).length === 0 && st.level === 1);
ch = run(st, 60, 9);
check('9 s fast: not back yet', st.level === 1 && ch.length === 0);
ch = run(st, 60, 1);
check('10 s fast: one level back', st.level === 0 && ch.length === 1 && ch[0][1] === -1);
st = P.newController(); run(st, 40, 3);
check('fast but no render time to spare: stays lowered', run(st, 60, 30, 60, 14).length === 0 && st.level === 1);
check('render time unknown: recovers', run(st, 60, 10, 60, null).length === 1 && st.level === 0);
/* bounce: slow again right after coming back doubles the wait */
st = P.newController(); run(st, 40, 3); run(st, 60, 10);
check('came back after 10 s', st.level === 0);
run(st, 40, 3);
check('slow again at once: down, recovery wait doubled', st.level === 1 && st.upAfter === 20);
ch = run(st, 60, 19);
check('19 s fast: still lowered', st.level === 1 && ch.length === 0);
run(st, 60, 1);
check('20 s fast: back', st.level === 0);
run(st, 60, 60);
check('a calm minute after coming back: wait back to 10 s', st.upAfter === 10);
st = P.newController(); run(st, 40, 3); run(st, 60, 10); run(st, 40, 3); run(st, 60, 20); run(st, 40, 3); run(st, 60, 40); run(st, 40, 3); run(st, 60, 80); run(st, 40, 3);
check('repeated bounces: wait capped at 120 s', st.upAfter === 120);

/* ---- overrides: runtime only, exact restore ---- */
const base = () => ({ suckAnimation: true, eatPulse: true, borderGlow: false, animatedRainbowColor: true, showBgSectors: true, hudBlur: 3, jellyPhisycs: true, videoSkins: true, highDPI: true, showMass: true });
let s = base(), mirror = { eatPulse: true };
let ov = P.createOverrides(s, mirror);
let changed = ov.sync(1, false);
check('level 1 lowers the decorative effects that were on', s.suckAnimation === false && s.eatPulse === false && s.animatedRainbowColor === false && s.showBgSectors === false && s.hudBlur === 0);
check('an effect the player had off is not touched', changed.indexOf('borderGlow') < 0 && s.borderGlow === false);
check('level 1 leaves jelly physics, video skins, other settings', s.jellyPhisycs === true && s.videoSkins === true && s.highDPI === true && s.showMass === true);
check('a mirrored key is lowered there too', mirror.eatPulse === false);
const view = ov.userView();
check('userView has the player\'s own values', view.hudBlur === 3 && view.suckAnimation === true && view.borderGlow === false && s.hudBlur === 0);
ov.sync(2, false);
check('level 2 adds jelly physics and video skins', s.jellyPhisycs === false && s.videoSkins === false && s.hudBlur === 0);
ov.sync(3, false);
check('level 3 keeps the settings of level 2 (resolution is separate)', s.jellyPhisycs === false && ov.size() === 7);
ov.sync(1, false);
check('back to level 1 restores level 2 keys exactly', s.jellyPhisycs === true && s.videoSkins === true && s.hudBlur === 0);
ov.sync(0, false);
check('level 0 restores everything exactly', JSON.stringify(s) === JSON.stringify(base()) && mirror.eatPulse === true && ov.size() === 0);
ov.sync(2, false);
ov.sync(2, true);
check('menu open: own values in place', JSON.stringify(s) === JSON.stringify(base()));
ov.sync(2, false);
check('menu closed: lowered again', s.jellyPhisycs === false);
/* changed by someone else while lowered (a hotkey): the player's choice is kept */
s.showBgSectors = true;
ov.check();
check('a lowered key changed elsewhere is no longer managed', !ov.isLowered('showBgSectors') && ov.isLocked('showBgSectors'));
ov.sync(0, false); ov.sync(2, false);
check('... and stays as the player set it for the session', s.showBgSectors === true);
ov.userChanged('hudBlur'); s.hudBlur = 0; /* the player moves the slider to 0 while lowered */
ov.sync(0, false);
check('player set a lowered key to the lowered value: it stays', s.hudBlur === 0);
check('other keys restored', s.jellyPhisycs === true && s.suckAnimation === true);
s = base(); ov = P.createOverrides(s, null); ov.sync(2, false); ov.restoreAll();
check('restoreAll puts back every value', JSON.stringify(s) === JSON.stringify(base()));

/* ---- network summaries ---- */
check('jitter = mean change between pings', near(P.jitter([50, 60, 50, 50]), 20 / 3));
check('jitter of one ping is 0', P.jitter([40]) === 0);
const sum = P.summarizeSession(1000, 61000, [40, 50, 60, 50], [25, 25, 30], [{ code: 1006, reason: '' }, { code: 1006, reason: '' }, { code: 4408, reason: 'timeout' }], 2, ['a.example']);
check('summary numbers', sum.dur === 60000 && sum.pingAvg === 50 && sum.ppsAvg === 27 && sum.disc === 3 && sum.reconn === 2 && sum.reasons[0].code === 1006 && sum.reasons[0].n === 2);
let hist = [];
for (let i = 1; i <= 14; i++) hist = P.mergeHistory(hist, Object.assign({}, sum, { start: i * 1000 }));
check('history keeps the last 10 sessions', hist.length === 10 && hist[0].start === 5000 && hist[9].start === 14000);
hist = P.mergeHistory(hist, Object.assign({}, sum, { start: 14000, disc: 9 }));
check('the same session is replaced, not added', hist.length === 10 && hist[9].disc === 9);
const bad = P.validateHistory([null, 5, { start: 'x' }, { start: 10, pingAvg: 'NaN', reasons: [{ code: 1, reason: 'a\u0000<b>' + 'x'.repeat(200) }], hosts: [{}] }]);
check('broken history entries are dropped or cleaned', bad.length === 1 && bad[0].pingAvg === 0 && bad[0].reasons[0].reason.length <= 60 && bad[0].reasons[0].reason.indexOf('\u0000') < 0);
check('history that is not a list is empty', P.validateHistory({ a: 1 }).length === 0);

/* ---- in a page (vm): off costs nothing, levels apply runtime only, survive a reload ---- */
const src = fs.readFileSync(file, 'utf8');
function page(settings, stored, extra) {
    const timers = [], toasts = [], store = Object.assign({}, stored || {}), calls = [], listeners = {};
    const overlays = { style: { display: 'none' }, isConnected: true };
    const ctx = {
        performance: { now: () => ctx._now || 0 }, Date, Math, JSON, Object, Array, String, Number, Float32Array, isFinite, console,
        setInterval: (f) => { timers.push(f); return timers.length; }, clearInterval: (i) => { timers[i - 1] = null; },
        /* addEventListener: perf.js watches visibilitychange (stall detector) */
        document: { hidden: false, addEventListener(t, f) { listeners[t] = f; }, removeEventListener() { }, getElementById: (id) => id === 'overlays' ? overlays : null, createElement: () => ({ style: {} }), body: { appendChild() { } } },
        localStorage: { getItem: (k) => store.hasOwnProperty(k) ? store[k] : null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
        toastr: { info: (t) => toasts.push(t) },
        application: { setAnimatedRainbowColor() { calls.push('rainbow'); }, applyHudBlur() { calls.push('blur'); }, saveSettings(o, n) { store[n] = JSON.stringify(o); } },
        drawRender: { dpr: 1, resizeCanvas() { calls.push('resize:' + ctx._lmAdaptiveScale); } },
        legendmod: { cells: [], pps: 0, ping: 0, isSocketOpen: () => false },
        addEventListener() { }, devicePixelRatio: 1, innerWidth: 915, innerHeight: 412, navigator: {}
    };
    ctx.window = ctx;
    ctx.legendmod5 = settings;
    if (extra) Object.assign(ctx, extra);
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return { ctx, timers, toasts, store, calls, overlays, listeners };
}
/* frames: n frames of dt ms with r ms of drawing */
const frames = (pg, n, dt, r) => { for (let i = 0; i < n; i++) { pg.t = (pg.t || 1) + dt; pg.ctx._lmPerfFrame(pg.t, pg.t + r); } };

const user = () => Object.assign(base(), { adaptivePerf: false, adaptivePerfTarget: 60, adaptivePerfToasts: true, netHistory: false, fpsLimit: 0, performanceMode: false });
let pg = page(user());
check('all off: no frame hook, no timer', pg.ctx._lmPerfFrame == null && pg.timers.length === 0 && typeof pg.ctx.LMPerf === 'object');
pg.ctx.legendmod5.adaptivePerf = true; pg.ctx.LMPerf.configChanged();
check('adaptive on: frame hook set, still no timer', typeof pg.ctx._lmPerfFrame === 'function' && pg.timers.length === 0);
frames(pg, 120, 16.7, 3); /* 2 s at 60 */
check('60 FPS: level 0', pg.ctx.LMPerf.level() === 0);
frames(pg, 31 * 4, 33.3, 20); /* about 4 s at 30 with heavy drawing */
check('30 FPS for 3 s: level 1, one message', pg.ctx.LMPerf.level() === 1 && pg.toasts.length === 1);
const S = pg.ctx.legendmod5;
check('level 1 values lowered at runtime', S.suckAnimation === false && S.hudBlur === 0 && pg.calls.indexOf('rainbow') >= 0 && pg.calls.indexOf('blur') >= 0);
pg.ctx.application.saveSettings(S, 'ogarioSettings');
let saved = JSON.parse(pg.store.ogarioSettings);
check('saved settings hold the player\'s values', saved.suckAnimation === true && saved.hudBlur === 3 && saved.animatedRainbowColor === true && !('toJSON' in saved));
check('export (nested) holds them too', JSON.parse(JSON.stringify({ ogarioSettings: S })).ogarioSettings.hudBlur === 3);
frames(pg, 31 * 6, 33.3, 20);
check('still slow: level 2', pg.ctx.LMPerf.level() === 2 && S.jellyPhisycs === false);
frames(pg, 31 * 6, 33.3, 20);
check('still slow: level 3, lower resolution', pg.ctx.LMPerf.level() === 3 && pg.ctx._lmAdaptiveScale === 0.75 && pg.calls.indexOf('resize:0.75') >= 0);
check('one message per level', pg.toasts.length === 3);
/* menu opened: own values back (presets and Performance mode see them), frames ignored */
pg.overlays.style.display = '';
frames(pg, 60, 33.3, 20);
check('menu open: own values in place, level kept', S.jellyPhisycs === true && S.hudBlur === 3 && pg.ctx.LMPerf.level() === 3);
pg.overlays.style.display = 'none';
frames(pg, 2, 33.3, 20);
check('menu closed: lowered again', S.jellyPhisycs === false && S.hudBlur === 0);
/* a reload while lowered: what was saved is the player's own settings */
pg.ctx.application.saveSettings(S, 'ogarioSettings');
const reloaded = page(JSON.parse(pg.store.ogarioSettings), pg.store);
check('after a reload: the player\'s values, level 0', reloaded.ctx.legendmod5.jellyPhisycs === true && reloaded.ctx.legendmod5.hudBlur === 3 && reloaded.ctx.LMPerf.level() === 0);
/* Performance mode turned on in game: it must back up the own values */
pg.ctx.LMPerf.onSetting('performanceMode', true);
check('Performance mode: own values in place before its backup', S.jellyPhisycs === true && S.hudBlur === 3 && S.suckAnimation === true);
frames(pg, 2, 33.3, 20);
/* fast again: back one level per 10 s */
frames(pg, 60 * 9, 16.7, 2);
check('9 s fast: still level 3', pg.ctx.LMPerf.level() === 3);
frames(pg, 60 * 2, 16.7, 2);
check('10 s fast: level 2, full resolution', pg.ctx.LMPerf.level() === 2 && pg.ctx._lmAdaptiveScale === 0 && pg.calls[pg.calls.length - 1] === 'resize:0');
frames(pg, 60 * 25, 16.7, 2);
check('fast long enough: level 0, all values exactly the player\'s', pg.ctx.LMPerf.level() === 0 && JSON.stringify(P.keysForLevel(2).map(k => S[k])) === JSON.stringify(P.keysForLevel(2).map(k => user()[k])));
/* the player toggles a lowered effect with a hotkey in game */
pg.ctx.LMPerf._setLevel(1);
S.showBgSectors = true; /* hotkey flips the lowered value */
pg.ctx.LMPerf._setLevel(1);
check('hotkey change of a lowered key is kept', S.showBgSectors === true);
pg.ctx.LMPerf.onSetting('suckAnimation', false); S.suckAnimation = false; /* checkbox off while lowered */
pg.ctx.LMPerf._setLevel(0);
check('checkbox change of a lowered key is kept', S.suckAnimation === false && S.eatPulse === true);
/* turning it off restores everything and removes the hook */
pg.ctx.LMPerf._setLevel(2);
S.adaptivePerf = false; pg.ctx.LMPerf.configChanged();
check('adaptive off: own values, no hook, full resolution', S.jellyPhisycs === true && S.hudBlur === 3 && pg.ctx._lmPerfFrame == null && pg.ctx._lmAdaptiveScale === 0);
/* messages can be silenced */
const quiet = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfToasts: false }));
frames(quiet, 31 * 5, 33.3, 20);
check('messages off: level changes without a message', quiet.ctx.LMPerf.level() === 1 && quiet.toasts.length === 0);
/* 60 Hz screen and a 120 target: not "too slow" */
const hz = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfTarget: 120 }));
frames(hz, 60 * 20, 16.7, 4);
check('120 target on a 60 Hz screen: no level change', hz.ctx.LMPerf.level() === 0);
/* FPS limit below the target */
const lim = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfTarget: 120, fpsLimit: 30 }));
frames(lim, 30 * 20, 33.3, 5);
check('FPS limit 30: 30 FPS is the target reached', lim.ctx.LMPerf.level() === 0);

/* network history: sampling only while on, saved summary, capped */
const nt = page(Object.assign(user(), { netHistory: true }));
check('network history on: one 1 s timer', nt.timers.filter(Boolean).length === 1);
const lm = nt.ctx.legendmod; let pings = [40, 40, 55, 41, 60];
lm.isSocketOpen = () => true; lm.pps = 25; lm.ws = 'wss://srv.example:443/path?token=secret';
nt.ctx.LMPerf.netEvent('open', { ws: lm.ws });
for (let i = 0; i < 40; i++) { lm.ping = pings[i % pings.length] + (i % 3); lm.pingTime = Date.now() - 2000; nt.timers[0](); }
nt.ctx.LMPerf.netEvent('close', { code: 1006, reason: '', wasClean: false, openMs: 5000 });
nt.ctx.LMPerf.netEvent('open', { ws: lm.ws });
for (let i = 0; i < 20; i++) nt.timers[0]();
const h = JSON.parse(nt.store.lmNetHistory);
check('session summary saved with ping, jitter, disconnects', h.length === 1 && h[0].pingAvg > 0 && h[0].jitter > 0 && h[0].disc === 1 && h[0].reconn === 1 && h[0].ppsAvg === 25);
check('host only (no token) is kept', h[0].hosts.length === 1 && h[0].hosts[0] === 'srv.example');
check('report text is built', /FPS:/.test(nt.ctx.LMPerf.report()) && /disconnects 1/.test(nt.ctx.LMPerf.report()));
nt.ctx.legendmod5.netHistory = false; nt.ctx.LMPerf.configChanged();
check('network history off: timer stopped', nt.timers.filter(Boolean).length === 0);

/* ---- stalls, freezes and the event list (diagnostics only) ---- */
check('gap kinds', P.classifyGap(16.7, false, -1) === '' && P.classifyGap(150, false, -1) === 'stall' && P.classifyGap(1500, false, -1) === 'freeze' &&
    P.classifyGap(1500, true, -1) === 'background' && P.classifyGap(20000, false, -1) === 'pause' && P.classifyGap(1500, false, 200) === 'return' &&
    P.classifyGap(1500, false, 5000) === 'freeze' && P.classifyGap(0, false, -1) === '');
check('host only: path, query and user:password dropped', P.hostOf('wss://user:pw@srv.example.com:443/ws?token=secret') === 'srv.example.com' &&
    P.hostOf('ws://1.2.3.4:8080/?key=abc') === '1.2.3.4' && P.hostOf('wss://[::1]:443/x') === '[::1]' && P.hostOf('token=abc') === '' && P.hostOf(null) === '');
const ring = P.createEventRing(200);
for (let i = 0; i < 260; i++) ring.push({ t: i * 10000, w: 0, type: 'freeze', dur: i, info: '' });
check('event list bounded at 200, the oldest dropped', ring.size() === 200 && ring.list()[0].dur === 60 && ring.list()[199].dur === 259);
ring.clear();
ring.push({ t: 0, type: 'render error', dur: 3, info: 'x is null' }, true);
ring.push({ t: 16, type: 'render error', dur: 5, info: 'x is null' }, true);
ring.push({ t: 32, type: 'render error', dur: 4, info: 'other' }, true);
check('the same error every frame is one entry with a count', ring.size() === 2 && ring.list()[0].n === 2 && ring.list()[0].dur === 5);
check('event line', /^\d\d:\d\d:\d\d\.\d{3} freeze 1532 ms render 1490 ms$/.test(P.eventLine({ w: Date.now(), type: 'freeze', dur: 1532, info: 'render 1490 ms', n: 1 })));

/* frame callbacks (raf) and drawn frames as drawRender.render calls them */
const rec = (opts) => {
    const pg = page(user(), null, opts);
    pg.t = 1000;
    pg.raf = (dt) => { pg.t += dt; pg.ctx._now = pg.t; pg.ctx._lmPerfFrame.raf(pg.t); };
    pg.draw = (r, err) => { pg.ctx._lmPerfFrame(pg.t, pg.t + r, err); pg.ctx._now = pg.t + r; };
    pg.frame = (dt, r, err) => { pg.raf(dt); pg.draw(r || 2, err); };
    return pg;
};
let pr = page(user());
pr.ctx.LMPerf.event('packet gap', 900, 'x');
check('off: nothing hooked, events not kept', pr.ctx._lmPerfFrame == null && pr.ctx.LMPerf.events().length === 0);
pr.listeners.visibilitychange();
check('off: tab hidden / shown keeps nothing', pr.ctx.LMPerf.events().length === 0);
pr = rec();
pr.ctx.LMPerf.keepRecording(true);
check('recording on: frame and callback hooks set', typeof pr.ctx._lmPerfFrame === 'function' && typeof pr.ctx._lmPerfFrame.raf === 'function');
for (let i = 0; i < 120; i++) pr.frame(16.7, 2);
pr.frame(1500, 3);
for (let i = 0; i < 10; i++) pr.frame(16.7, 2);
let evs = pr.ctx.LMPerf.events(), rep = pr.ctx.LMPerf.report();
check('1500 ms foreground stall is a freeze event with its time', evs.length === 1 && evs[0].type === 'freeze' && evs[0].dur === 1500 && evs[0].w > 0);
check('report: freeze counted with its duration', /Freezes \(≥250 ms, foreground\): 1, worst 1500 ms/.test(rep) && /stalls ≥100ms: 1/.test(rep));
check('report: the freeze is in the frame times (mean FPS) and long frames', /FPS: 3\d\.\d/.test(rep) && /1 recent, 1 measured in total/.test(rep) && /p99: |p50\/p95\/p99/.test(rep));
check('report lists the event', /\n  \d\d:\d\d:\d\d\.\d{3} freeze 1500 ms/.test(rep));
/* adaptive performance's own seconds still leave the gap out */
pr = rec();
pr.ctx.legendmod5.adaptivePerf = true; pr.ctx.LMPerf.configChanged();
for (let i = 0; i < 200; i++) { pr.frame(16.7, 2); if (i % 50 === 0) pr.frame(1500, 2); }
check('adaptive performance ignores the freezes (no level for 60 FPS with gaps)', pr.ctx.LMPerf.level() === 0 && pr.ctx.LMPerf.events().filter(e => e.type === 'freeze').length === 4);
/* a frame that throws: its time and the error are kept */
pr = rec(); pr.ctx.LMPerf.keepRecording(true);
for (let i = 0; i < 5; i++) pr.frame(16.7, 2);
pr.frame(16.7, 40, new Error('boom'));
pr.frame(16.7, 41, new Error('boom'));
evs = pr.ctx.LMPerf.events(); rep = pr.ctx.LMPerf.report();
check('render throw: timing and error recorded (repeats merged)', evs.length === 1 && evs[0].type === 'render error' && evs[0].info === 'boom' && evs[0].n === 2 && evs[0].dur === 41 && /Frames that failed to draw: 2/.test(rep));
check('render throw: the frame is in the frame times', /last 6 frames/.test(rep));
/* the tab hidden for 5 s and shown: not a freeze, not a frame time */
pr = rec(); pr.ctx.LMPerf.keepRecording(true);
for (let i = 0; i < 30; i++) pr.frame(16.7, 2);
pr.ctx.document.hidden = true; pr.ctx._now = pr.t + 5; pr.listeners.visibilitychange();
pr.t += 5000; pr.ctx._now = pr.t; pr.ctx.document.hidden = false; pr.listeners.visibilitychange();
pr.frame(16.7, 2);
for (let i = 0; i < 30; i++) pr.frame(16.7, 2);
evs = pr.ctx.LMPerf.events(); rep = pr.ctx.LMPerf.report();
check('visibility transition: listed, not a freeze or stall', evs.map(e => e.type + ':' + e.info).join() === 'visibility:hidden,visibility:visible' && /Freezes \(≥250 ms, foreground\): 0/.test(rep) && !/stalls ≥100ms/.test(rep));
check('visibility transition: not a frame time', /0 recent, 0 measured in total/.test(rep) && /last 59 frames/.test(rep));
/* a slow frame right after coming back: listed, not counted */
pr.ctx.document.hidden = true; pr.listeners.visibilitychange(); pr.ctx.document.hidden = false; pr.listeners.visibilitychange();
pr.frame(16.7, 2); pr.frame(400, 2);
check('a freeze right after the tab came back is listed as such, not counted', /came back/.test(pr.ctx.LMPerf.events().pop().info) && /Freezes \(≥250 ms, foreground\): 0/.test(pr.ctx.LMPerf.report()));
/* sleep / suspend over 10 s */
pr.t += 20000; pr.frame(16.7, 2);
check('a 20 s gap is a pause, not a freeze', pr.ctx.LMPerf.events().pop().type === 'pause' && /Freezes \(≥250 ms, foreground\): 0/.test(pr.ctx.LMPerf.report()));

/* ---- the real render loop of ogario.v4.js: callback times before the FPS limit, timing in a finally ---- */
const v4 = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const rStart = v4.indexOf('\n        render() {\n            /* Performance diagnostics');
const rEnd = v4.indexOf('\n        init() {\n            this.setCanvas();', rStart);
const resetSrc = /\n        (_lmResetFreezeDetector\(\) \{[\s\S]*?\n        \}),\n/.exec(v4);
check('render() and the freeze detector reset found in ogario.v4.js', rStart > 0 && rEnd > rStart && !!resetSrc);
const loop = (settings, frameFn, extra) => {
    const pg = page(Object.assign(user(), settings), null, extra);
    const warns = [];
    const dr = { countFps() { }, renderFrame: frameFn || (() => { }), ctx: null };
    Object.assign(pg.ctx, {
        defaultmapsettings: pg.ctx.legendmod5, LM: { play: true }, drawRender: dr, requestAnimationFrame() { },
        console: { log() { }, error() { }, warn(...a) { warns.push(a); } }
    });
    vm.runInContext('drawRender.render = (' + '{' + v4.slice(rStart, rEnd) + '\n}).render;', pg.ctx);
    pg.t = 1000;
    pg.tick = (dt) => { pg.t += dt; pg.ctx._now = pg.t; dr.render(); };
    pg.warns = warns; pg.dr = dr;
    return pg;
};
let lp = loop({ fpsLimit: 10 });
lp.ctx.LMPerf.keepRecording(true);
let drawn = 0; lp.dr.renderFrame = () => { drawn++; lp.ctx._now += 3; };
for (let i = 0; i < 180; i++) lp.tick(16.7);
rep = lp.ctx.LMPerf.report();
check('FPS limit 10: frames skipped on purpose (about 1 in 6 drawn)', drawn >= 25 && drawn <= 35);
check('FPS limit gaps: no stall, freeze or long frame, counted as FPS-limit frames', !/stalls ≥100ms/.test(rep) && /Freezes \(≥250 ms, foreground\): 0/.test(rep) && /0 recent, 0 measured in total, \d+ only long by the FPS limit/.test(rep));
lp.tick(700);
for (let i = 0; i < 30; i++) lp.tick(16.7);
check('FPS limit on: a real 700 ms stall is still a freeze', lp.ctx.LMPerf.events().some(e => e.type === 'freeze' && e.dur === 700));
lp = loop({ fpsLimit: 0 });
lp.ctx.LMPerf.keepRecording(true);
let n = 0; lp.dr.renderFrame = () => { lp.ctx._now += 30; if (++n === 5) throw new Error('bad cell'); };
for (let i = 0; i < 10; i++) lp.tick(16.7);
evs = lp.ctx.LMPerf.events();
check('render loop: a frame that throws keeps its 30 ms and the error, drawing goes on', evs.length === 1 && evs[0].type === 'render error' && evs[0].dur === 30 && evs[0].info === 'bad cell' && n === 10);
check('render loop: the error still reaches the frame error handler', /bad cell/.test(lp.dr._lastRenderErrorMsg || ''));
lp = loop({ fpsLimit: 0 });
let offDrawn = 0; lp.dr.renderFrame = () => { offDrawn++; };
for (let i = 0; i < 5; i++) lp.tick(16.7);
check('render loop with everything off: draws, no hook, nothing kept', offDrawn === 5 && lp.ctx._lmPerfFrame == null && lp.ctx.LMPerf.events().length === 0);
/* freeze detector: host only, a packet gap event, latches reset on a new connection */
lp = loop({ fpsLimit: 0 });
lp.ctx.LMPerf.keepRecording(true);
const conn = { ws: 'wss://srv.example.com:443/?token=secret', serverType: 'x', pps: 0, play: true, isSocketOpen: () => true, _lmLastWorldUpdate: Date.now() - 3500 };
vm.runInContext('legendmod._lmResetFreezeDetector = ({' + resetSrc[1] + '})._lmResetFreezeDetector;', Object.assign(lp.ctx, { legendmod: Object.assign(lp.ctx.legendmod, conn) }));
lp.tick(16.7);
const fz = lp.warns.find(w => /LM FREEZE\] No world update/.test(w[0]));
check('freeze log has the host only, no token', !!fz && fz[1].server === 'srv.example.com' && JSON.stringify(lp.warns).indexOf('secret') < 0);
lp.ctx.legendmod._lmLastWorldUpdate = Date.now();
lp.tick(16.7);
check('packet gap listed when world updates come back', lp.ctx.LMPerf.events().some(e => e.type === 'packet gap' && e.dur >= 3500));
lp.ctx.legendmod._lmLastWorldUpdate = Date.now() - 2000; lp.tick(16.7);
lp.ctx.legendmod._lmLastWorldUpdate = Date.now() - 3500; lp.tick(16.7);
check('latched again by a new stall', !!lp.dr._lmFreezeLogged && !!lp.dr._lmStallLogged && lp.dr._lmStallMax >= 3500);
lp.ctx.legendmod._lmResetFreezeDetector();
check('reset on connect / close: latches and the last update time cleared', !lp.dr._lmFreezeLogged && !lp.dr._lmStallLogged && !lp.dr._lmStallMax && lp.ctx.legendmod._lmLastWorldUpdate === 0);
check('ogario calls the reset on open and on close', (v4.match(/if \(this === window\.legendmod\) this\._lmResetFreezeDetector\(\);/g) || []).length === 2);

/* long tasks: only observed while recording, where supported */
const observers = [];
function FakePO(cb) { this.cb = cb; this.on = false; observers.push(this); }
FakePO.prototype.observe = function () { this.on = true; };
FakePO.prototype.disconnect = function () { this.on = false; };
FakePO.supportedEntryTypes = ['longtask'];
pr = rec({ PerformanceObserver: FakePO });
check('long tasks: no observer while off', observers.length === 0);
pr.ctx.LMPerf.keepRecording(true);
check('long tasks: observed while recording', observers.length === 1 && observers[0].on);
observers[0].cb({ getEntries: () => [{ duration: 60, startTime: 900 }, { duration: 180, startTime: 950 }] });
evs = pr.ctx.LMPerf.events();
check('long tasks: all counted, from 100 ms listed', evs.length === 1 && evs[0].type === 'long task' && evs[0].dur === 180 && /Long tasks \(≥50 ms\): 2, worst 180 ms/.test(pr.ctx.LMPerf.report()));
pr.ctx.LMPerf.keepRecording(false);
check('long tasks: observer stopped with recording', !observers[0].on && pr.ctx._lmPerfFrame == null);

console.log(fail ? fail + ' failed' : 'all perf checks passed');
process.exit(fail ? 1 : 0);
