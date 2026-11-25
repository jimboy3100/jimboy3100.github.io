/* Adaptive performance, diagnostics and network history checks (ogario/modules/perf.js):
 * level stepping with hysteresis, percentile math, exact restore of the player's values,
 * nothing running while off. node developers/tests/perf.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const file = process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'perf.js');
const P = require(file);
const i18n = require('./lib/i18n-env');
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
/* rp90 left out: slow seconds draw heavily (10 ms of a 16.7 ms frame), fast ones lightly (4 ms) */
const run = (st, fps, secs, target, rp90) => { const ch = []; for (let i = 0; i < secs; i++) { const c = P.controllerStep(st, fps, target || 60, rp90 === undefined ? (fps < (target || 60) * 0.9 ? 10 : 4) : rp90, 1); if (c) ch.push([st.t, c]); } return ch; };
let st = P.newController();
check('2 s slow: no change', run(st, 40, 2).length === 0 && st.level === 0);
run(st, 60, 1);
check('slow stretch broken by a fast second starts again', run(st, 40, 2).length === 0 && st.level === 0);
/* slow, but drawing takes little of the frame (packets, scripts, the browser): fewer effects
 * would not help, nothing is lowered */
st = P.newController();
check('slow with light drawing (4 of 16.7 ms): nothing lowered', run(st, 40, 60, 60, 4).length === 0 && st.level === 0);
/* the share of the frames as they really come: 30 FPS (33.3 ms) with 9 ms of drawing is 27% */
st = P.newController();
check('30 FPS of 60 with 9 ms drawing (27% of the real frame): nothing lowered', run(st, 30, 60, 60, 9).length === 0 && st.level === 0);
st = P.newController();
check('drawing time unknown: nothing lowered', run(st, 40, 60, 60, null).length === 0 && st.level === 0);
st = P.newController();
run(st, 40, 3, 60, 14);
let gapCh = run(st, 40, 8, 60, null);
check('unknown seconds during a check: not counted (no decision, no next level)', st.level === 1 && gapCh.length === 0);
gapCh = run(st, 40, 6, 60, 14);
check('the check then uses measured seconds only: did not help, undone', st.level === 0 && gapCh.length === 1 && gapCh[0][1] === -1);
st = P.newController();
let ch = run(st, 40, 3, 60, 14);
check('3 s slow with heavy drawing: level 1', st.level === 1 && ch.length === 1);
ch = run(st, 40, 5, 60, 14);
check('no next level while the last one is being checked', st.level === 1 && ch.length === 0);
ch = run(st, 40, 1, 60, 14);
check('a level that helped neither FPS nor drawing is undone after 6 s', st.level === 0 && ch.length === 1 && ch[0][1] === -1);
ch = run(st, 40, 300, 60, 14);
check('and not tried again for 10 minutes', st.level === 0 && ch.length === 0);
ch = run(st, 40, 400, 60, 14);
check('tried again after 10 minutes', ch.some(c => c[1] === 1 && c[0] >= 609));
st = P.newController();
run(st, 40, 3, 60, 14);
ch = run(st, 40, 6, 60, 10);
check('drawing 15% faster counts as helped: kept', st.level >= 1 && !ch.some(c => c[1] === -1));
run(st, 40, 3, 60, 10);
check('still slow and drawing-bound: the next level follows', st.level === 2);
st = P.newController();
run(st, 40, 3, 60, 14);
ch = run(st, 43, 6, 60, 14);
check('FPS 5% up counts as helped: kept', st.level >= 1 && !ch.some(c => c[1] === -1));
st = P.newController();
for (let l = 0; l < 6; l++) { run(st, 40, 3, 60, 14 - l * 3 > 9 ? 14 - l * 3 : 9); run(st, 40, 6, 60, Math.max(9, 11 - l * 3)); }
check('never past level 3', st.level <= 3);
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
/* lang: the language of the translation runtime given to the page (default English) */
function page(settings, stored, extra, lang) {
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
    i18n(ctx, lang);
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
check('the level message comes from the language pack', pg.toasts[0] === i18n.t('settings.lmAdaptiveLevel1') && /level 1/.test(pg.toasts[0]));
const S = pg.ctx.legendmod5;
check('level 1 values lowered at runtime', S.suckAnimation === false && S.hudBlur === 0 && pg.calls.indexOf('rainbow') >= 0 && pg.calls.indexOf('blur') >= 0);
pg.ctx.application.saveSettings(S, 'ogarioSettings');
let saved = JSON.parse(pg.store.ogarioSettings);
check('saved settings hold the player\'s values', saved.suckAnimation === true && saved.hudBlur === 3 && saved.animatedRainbowColor === true && !('toJSON' in saved));
check('export (nested) holds them too', JSON.parse(JSON.stringify({ ogarioSettings: S })).ogarioSettings.hudBlur === 3);
/* each level helps a little (about 7% more FPS) but the game is still slow and drawing-bound */
frames(pg, 205, 31, 20);
check('still slow: level 2', pg.ctx.LMPerf.level() === 2 && S.jellyPhisycs === false);
frames(pg, 220, 29, 20);
check('resolution option off (default): stays at level 2, full resolution', pg.ctx.LMPerf.level() === 2 && !(pg.ctx._lmAdaptiveScale > 0) && pg.calls.indexOf('resize:0.75') < 0);
S.adaptivePerfRes = true; pg.ctx.LMPerf.configChanged();
frames(pg, 236, 27, 20);
check('still slow: level 3, lower resolution', pg.ctx.LMPerf.level() === 3 && pg.ctx._lmAdaptiveScale === 0.75 && pg.calls.indexOf('resize:0.75') >= 0);
check('one message per level', pg.toasts.length === 3 && pg.toasts[2] === i18n.t('settings.lmAdaptiveLevel3'));
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
check('report lists the freeze with its attribution line', /\n  1500 ms freeze \d\d:\d\d:\d\d\.\d{3} · /.test(rep));
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

/* ---- freeze attribution: timing scopes ---- */
let clk = 0;
const S1 = P.createScopes(() => clk, ['a', 'b', 'c']);
let d0 = S1.b('a'); clk += 10; let d1 = S1.b('b'); clk += 30; S1.e(d1); clk += 5; S1.e(d0);
check('scopes: self time (a part inside another counts for itself)', S1.acc[0] === 15 && S1.acc[1] === 30 && S1.cnt[0] === 1 && S1.cnt[1] === 1 && S1.depth() === 0);
d0 = S1.b('a'); S1.b('b'); S1.b('c'); clk += 7; S1.e(d0);
check('scopes: closing an outer part closes parts left open inside it', S1.depth() === 0 && S1.acc[2] === 7 && S1.cnt[2] === 1);
check('scopes: unknown name is ignored', S1.b('nope') === -1 && S1.depth() === 0);
S1.reset();
check('scopes: reset every frame', S1.total() === 0 && S1.cnt[0] === 0);
let calls = 0;
const wf = S1.wrap(function (x) { calls++; clk += 20; if (x === 'throw') throw new Error('x'); return this.k + x; }, 'c');
check('wrapper while off: just the call, nothing timed', wf.call({ k: 1 }, 2) === 3 && S1.total() === 0 && calls === 1);
S1.on = true;
check('wrapper while on: same result, time counted', wf.call({ k: 1 }, 2) === 3 && S1.acc[2] === 20 && S1.cnt[2] === 1);
try { wf('throw'); } catch (e) { }
check('wrapper: a throw still closes the part', S1.depth() === 0 && S1.acc[2] === 40 && S1.cnt[2] === 2);
const sr = P.createScopeRing(4, 3, 2);
for (let i = 0; i < 6; i++) sr.push(new Float64Array([i, 1, 0]), new Uint32Array([1, 1, 0]), new Float64Array([i, 100]));
const srt = sr.totals();
check('slow frame ring keeps the last 4 in place', sr.size() === 4 && srt.frames === 4 && srt.ms[0] === 2 + 3 + 4 + 5 && srt.gap === 400);
check('topScopes sorts and drops tiny parts', JSON.stringify(P.topScopes([1, 50, 0.2], [1, 2, 3], ['x', 'y', 'z'], 0.5).map(s => s.n)) === '["y","x"]');

/* ---- script addresses and long animation frames, cleaned ---- */
check('script file: name only, no query or token', JSON.stringify(P.scriptFile('https://www.legendmod.ml/ogario/ogario.v4.js?v=3.589&token=abc#x')) === '{"file":"ogario.v4.js","kind":"legendmod"}');
check('script owners: agar.io, extension, page, other', P.scriptFile('https://agar.io/mc/agario.core.js?x=1').kind === 'agar.io' &&
    P.scriptFile('chrome-extension://abcdef/content.js').kind === 'extension' && P.scriptFile('https://expanding.land/a.js', 'expanding.land').kind === 'page' &&
    P.scriptFile('https://cdn.example.com/lib/x.js;jsessionid=SECRET').file === 'x.js' && P.scriptFile('blob:https://x/123').file === 'blob:' && P.scriptFile('').file === '');
check('invoker addresses reduced to the file name', P.cleanInvoker('https://www.legendmod.ml/a/b.js?key=SECRET') === 'b.js' && P.cleanInvoker('TimerHandler:setInterval') === 'TimerHandler:setInterval');
const loafEntry = {
    startTime: 1000, duration: 280, blockingDuration: 230, renderStart: 1250, styleAndLayoutStart: 1262,
    scripts: [
        { invoker: 'FrameRequestCallback', invokerType: 'user-callback', sourceFunctionName: 'render', sourceURL: 'https://www.legendmod.ml/ogario/ogario.v4.js?v=1&token=SECRET', sourceCharPosition: 3456789, duration: 20, forcedStyleAndLayoutDuration: 0, startTime: 1250 },
        { invoker: 'https://www.legendmod.ml/x.js?token=SECRET', invokerType: 'user-callback', sourceFunctionName: 'uploadSkinTexture', sourceURL: 'https://www.legendmod.ml/ogario/ogario.v4.js?token=SECRET', sourceCharPosition: 12345678, duration: 241, forcedStyleAndLayoutDuration: 3, startTime: 1002 }
    ]
};
const lf = P.parseLoaf(loafEntry, 'www.legendmod.ml');
check('LoAF parsed: offsets, longest script first', lf.dur === 280 && lf.block === 230 && lf.render === 250 && lf.style === 262 && lf.scriptMs === 261 && lf.scripts[0].fn === 'uploadSkinTexture' && lf.scripts[0].pos === 12345678 && lf.scripts[0].file === 'ogario.v4.js');
check('LoAF sanitized: no token anywhere', JSON.stringify(lf).indexOf('SECRET') < 0 && JSON.stringify(lf).indexOf('token') < 0);
check('LoAF keeps at most 5 scripts', P.parseLoaf({ startTime: 0, duration: 200, scripts: new Array(9).fill(loafEntry.scripts[0]) }).scripts.length === 5);

/* ---- function names from character positions (anonymous callbacks) ---- */
const srcText = 'var app = window.app = {\n    init() {\n        setInterval(function () {\n            tick();\n        }, 10000);\n    },\n    draw(a) {\n        if (a) { x(); }\n        return 1;\n    }\n};\nfunction lone() { return 2; }\n';
check('position of an anonymous setInterval callback', P.enclosingName(srcText, srcText.indexOf('function ()')) === 'setInterval callback in window.app.init');
check('position of a method', P.enclosingName(srcText, srcText.indexOf('draw(a)')) === 'window.app.draw');
check('position inside a method body', P.enclosingName(srcText, srcText.indexOf('x();')) === 'window.app.draw');
check('position of a plain function', P.enclosingName(srcText, srcText.indexOf('function lone')) === 'lone' && P.enclosingName(srcText, -1) === '');

/* ---- freeze classification ---- */
const fzBase = { t: 10000, w: Date.now(), dur: 287 };
let cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL2', s: [{ n: 'skin texture upload', ms: 241 }, { n: 'cells update', ms: 21 }, { n: 'render', ms: 17 }], q: '' } }), [], [], { loaf: true });
check('dominant part is the probable contributor', cf.probable === 'skin texture upload' && /^287 ms freeze \d\d:\d\d:\d\d\.\d{3} · WebGL2 · skin texture upload 241 ms, cells update 21 ms, render 17 ms · LoAF: none · network normal · probable contributor: skin texture upload$/.test(cf.line));
cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL2', s: [{ n: 'render', ms: 40 }, { n: 'packets', ms: 30 }], q: '' } }), [], [], { loaf: true });
check('no dominant part: unattributed', cf.probable === '' && /unattributed \(GC\/GPU\/browser\?\)$/.test(cf.line));
const lfAt = Object.assign({}, lf, { t: 10000 - 287 + 2 });
cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL2', s: [{ n: 'render', ms: 30 }], q: '' } }), [lfAt], [], { loaf: true });
check('LoAF overlapping the freeze names the script; it dominates', /LoAF 280 ms: uploadSkinTexture \(ogario\.v4\.js:12345678\) 241 ms/.test(cf.line) && cf.probable === 'script uploadSkinTexture (ogario.v4.js)');
cf = P.classifyFreeze(Object.assign({}, fzBase), [Object.assign({}, lfAt, { t: 50000 })], [], { loaf: true });
check('a LoAF elsewhere is not this freeze', /LoAF: none/.test(cf.line));
const agarLoaf = P.parseLoaf({ startTime: 9720, duration: 290, scripts: [{ invoker: 'WebSocket.onmessage', invokerType: 'event-listener', sourceFunctionName: 'Ab', sourceURL: 'https://agar.io/agario.core.js?123', sourceCharPosition: 77, duration: 260 }] });
cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL', s: [], q: '' } }), [agarLoaf], [], { loaf: true });
check('a third-party script is named as such', cf.probable === 'script Ab (agario.core.js, agar.io)' && /\[agar\.io\]/.test(cf.line));
cf = P.classifyFreeze(fzBase, [], [{ type: 'packet gap', t: 10050, dur: 900 }, { type: 'visibility', t: 9800, info: 'visible' }], { loaf: false });
check('packet gap that began before the freeze: network or server; tab change listed', /packet gap 900 ms, began before the freeze/.test(cf.line) && /tab visible nearby/.test(cf.line));
cf = P.classifyFreeze(fzBase, [], [{ type: 'packet gap', t: 10010, dur: 300 }, { type: 'long task', t: 9720, dur: 280 }], { loaf: false });
check('packet gap inside the freeze: updates only waited; long task listed without LoAF', /world updates only waited for the freeze/.test(cf.line) && /long task 280 ms/.test(cf.line));

/* ---- in a page: a synthetic stall in a wrapped part is attributed ---- */
const observers2 = [];
function FakePO2(cb) { this.cb = cb; this.on = false; this.opts = null; observers2.push(this); }
FakePO2.prototype.observe = function (o) { this.on = true; this.opts = o; };
FakePO2.prototype.disconnect = function () { this.on = false; };
FakePO2.supportedEntryTypes = ['longtask', 'long-animation-frame'];
const stubs = () => {
    const dr = { dpr: 1, resizeCanvas() { }, _lmTextBytes: 3 * 1048576, _lmSkinReady: [1, 2] };
    dr.renderFrame = function () { return 'drawn'; };
    dr._lmUploadSkinJob = function (ms) { stubs.ctx._now += ms; };
    dr.uploadSkinTexture = function () { return 7; };
    const lm = { cells: new Array(412), pps: 0, ping: 0, isSocketOpen: () => false };
    lm.handleMessage = function (ms) { stubs.ctx._now += ms; };
    lm.updateCells = function () { };
    const ap = { setAnimatedRainbowColor() { }, applyHudBlur() { }, saveSettings() { }, _lmSkinJobs: [1, 2, 3] };
    ap.displayTop5 = function () { };
    return { drawRender: dr, legendmod: lm, application: ap, PerformanceObserver: FakePO2, repeatSendingSpecialSkins: function () { stubs.ctx._now += 1; } };
};
const ex = stubs();
const origUpload = ex.drawRender._lmUploadSkinJob, origHandle = ex.legendmod.handleMessage, origRepeat = ex.repeatSendingSpecialSkins, origRF = ex.drawRender.renderFrame;
pr = rec(ex);
stubs.ctx = pr.ctx;
check('attribution off: nothing wrapped, no _lmScope, no LoAF observer', pr.ctx.drawRender._lmUploadSkinJob === origUpload && pr.ctx.legendmod.handleMessage === origHandle &&
    pr.ctx._lmScope == null && observers2.length === 0 && pr.ctx.LMPerf._scopes.on === false);
pr.ctx.legendmod5.adaptivePerf = true; pr.ctx.LMPerf.configChanged();
const loafObs2 = () => observers2.filter(o => o.opts && o.opts.type === 'long-animation-frame');
check('Adaptive performance alone: no attribution', pr.ctx._lmScope == null && pr.ctx.drawRender._lmUploadSkinJob === origUpload && loafObs2().length === 0);
pr.ctx.legendmod5.adaptivePerf = false; pr.ctx.LMPerf.configChanged();
pr.ctx.LMPerf.keepRecording(true);
check('recording: parts wrapped (also global functions), _lmScope set, LoAF observed (not buffered)', pr.ctx.drawRender._lmUploadSkinJob !== origUpload && pr.ctx.repeatSendingSpecialSkins !== origRepeat &&
    pr.ctx._lmScope === pr.ctx.LMPerf._scopes && loafObs2().length === 1 && loafObs2()[0].on && loafObs2()[0].opts.buffered === false);
check('a wrapped method gives the same result', pr.ctx.drawRender.renderFrame() === 'drawn' && pr.ctx.drawRender.uploadSkinTexture() === 7);
for (let i = 0; i < 30; i++) pr.frame(16.7, 2);
/* during the next gap: one skin upload takes 240 ms, a packet 20 ms */
pr.ctx.drawRender._lmUploadSkinJob(240);
pr.ctx.legendmod.handleMessage(20);
pr.frame(300, 2);
for (let i = 0; i < 5; i++) pr.frame(16.7, 2);
let fzs = pr.ctx.LMPerf.freezes();
check('synthetic stall: one freeze with its breakdown', fzs.length === 1 && fzs[0].dur === 300 && fzs[0].bd && fzs[0].bd.s[0].n === 'skin texture upload' && fzs[0].bd.s[0].ms === 240 && fzs[0].bd.s[1].n === 'packets');
check('synthetic stall attributed to the skin upload', fzs[0].probable === 'skin texture upload' && /skin texture upload 240 ms, packets 20 ms/.test(fzs[0].line) && /probable contributor: skin texture upload/.test(fzs[0].line));
check('breakdown carries queue sizes', /412 cells, skin jobs 3, skin uploads 2, text textures 3\.0 MB/.test(fzs[0].line));
rep = pr.ctx.LMPerf.report();
check('report: breakdown state, probable contributors and slow frames', /Freeze breakdown: on, long animation frames: observed/.test(rep) && /Probable contributors: skin texture upload x1/.test(rep) &&
    /Slow frames \(≥50 ms, last 1\): average 300 ms, timed parts in total: skin texture upload 240 ms \(1x\), packets 20 ms \(1x\)/.test(rep));
/* a stall with nothing timed is not attributed; a LoAF arrives for it afterwards */
pr.ctx._now += 0;
pr.frame(400, 2);
const tEnd = pr.t;
loafObs2()[0].cb({ getEntries: () => [{ startTime: tEnd - 395, duration: 390, blockingDuration: 340, renderStart: 0, styleAndLayoutStart: 0, scripts: [{ invoker: 'TimerHandler:setInterval', invokerType: 'user-callback', sourceFunctionName: '', sourceURL: 'https://www.legendmod.ml/ogario/ogario.v4.js?v=1&token=SECRET', sourceCharPosition: 4242, duration: 30 }] }, { startTime: 1, duration: 60 }] });
fzs = pr.ctx.LMPerf.freezes();
check('stall with nothing timed: unattributed, the LoAF is listed with it', fzs.length === 2 && fzs[1].probable === '' && /no timed part over 1 ms/.test(fzs[1].line) &&
    /LoAF 390 ms: TimerHandler:setInterval \(ogario\.v4\.js:4242\) 30 ms/.test(fzs[1].line) && /unattributed/.test(fzs[1].line));
rep = pr.ctx.LMPerf.report();
check('LoAFs under 100 ms are not kept; report lists LoAFs without the token', pr.ctx.LMPerf.loafs().length === 1 && /Long animation frames \(≥100 ms, 1 kept/.test(rep) && rep.indexOf('SECRET') < 0 && rep.indexOf('token') < 0);
check('report has the time origin for trace correlation and freeze times', /time origin /.test(rep) && /@\d+/.test(rep));
/* the window list shows the attribution lines too */
check('every counted freeze attributed once', pr.ctx.LMPerf.freezes().every(f => /^\d+ ms freeze /.test(f.line)));
pr.ctx.LMPerf.keepRecording(false);
check('recording off: originals back, _lmScope null, LoAF observer stopped', pr.ctx.drawRender._lmUploadSkinJob === origUpload && pr.ctx.legendmod.handleMessage === origHandle &&
    pr.ctx.repeatSendingSpecialSkins === origRepeat && pr.ctx.drawRender.renderFrame === origRF && pr.ctx._lmScope === null && !loafObs2()[0].on && pr.ctx.LMPerf._scopes.on === false);
/* off: per-frame work is the same as before (no accumulators touched, no ring copies) */
const accBefore = Array.from(pr.ctx.LMPerf._scopes.acc).join();
pr.ctx.drawRender._lmUploadSkinJob(5);
check('off: a call is not timed', Array.from(pr.ctx.LMPerf._scopes.acc).join() === accBefore);
/* replaced by someone else while recording: left in place, it only checks the flag */
pr.ctx.LMPerf.keepRecording(true);
const theirs = function () { return 'theirs'; };
pr.ctx.application.displayTop5 = theirs;
pr.ctx.LMPerf.keepRecording(false);
check('a method replaced meanwhile is not put back over the new one', pr.ctx.application.displayTop5 === theirs);

/* ---- ogario.v4.js: the inline markers and wrapped methods exist ---- */
const marks = v4.match(/window\._lmScope\.b\('([^']+)'\)|S\.b\('([^']+)'\)/g) || [];
const markNames = marks.map(m => /'([^']+)'/.exec(m)[1]);
check('inline markers use known part names', markNames.length >= 5 && markNames.every(n => P.SCOPES.indexOf(n) >= 0));
check('every inline marker is closed', (v4.match(/window\._lmScope\.e\(_lmSc\w+\)/g) || []).length === (v4.match(/var _lmSc\w+ = window\._lmScope \? window\._lmScope\.b\(/g) || []).length);
const perfSrc = src.replace(/\r\n/g, '\n');
const patches = [...perfSrc.matchAll(/\['(legendmod|drawRender|application|window|Storage\.prototype)', '([\w$]+)', '([^']+)'\]/g)];
const methodIn = (name) => new RegExp('\\n {8}' + name.replace(/\$/g, '\\$') + '\\([^)]*\\) \\{|\\nfunction ' + name + '\\(|window\\.' + name + ' = function').test(v4);
const missing = patches.filter(p => p[1] !== 'Storage.prototype' && !methodIn(p[2])).map(p => p[2]);
check('every wrapped method is defined in ogario.v4.js (' + patches.length + ')', patches.length >= 20 && missing.length === 0 && patches.every(p => P.SCOPES.indexOf(p[3]) >= 0) || (console.log('  missing:', missing), false));

/* the resolution option switched off while at level 3: back to level 2 and full resolution at once */
{
    const rp = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfRes: true }));
    frames(rp, 120, 16.7, 3);
    /* slow and drawing-bound, each level a little faster (a level that does not help is undone) */
    frames(rp, 31 * 4, 33.3, 20); frames(rp, 205, 31, 20); frames(rp, 220, 29, 20); frames(rp, 236, 27, 20);
    const was3 = rp.ctx.LMPerf.level() === 3 && rp.ctx._lmAdaptiveScale === 0.75;
    rp.ctx.legendmod5.adaptivePerfRes = false; rp.ctx.LMPerf.configChanged();
    check('resolution option off at level 3: level 2, full resolution now', was3 && rp.ctx.LMPerf.level() === 2 && !(rp.ctx._lmAdaptiveScale > 0));
}
/* ---- texts: language packs (developers/i18n/src/modules-c.json, keys modules.perf.*) ---- */
{
    const PFX = 'modules.perf.';
    /* the English texts in perf.js (the copied report, the trace tools) are the pack's English ones */
    const perfSrc2 = src.replace(/\r\n/g, '\n');
    const pairs = [...perfSrc2.matchAll(/(?:say\(tr, |tp\()'(\w+)', '((?:[^'\\]|\\.)*)'/g)].map(m => [m[1], JSON.parse('"' + m[2].replace(/"/g, '\\"') + '"')]);
    for (const map of [P.EV_KEYS, P.INFO_KEYS, P.RN_KEYS, P.KIND_KEYS]) for (const en of Object.keys(map)) pairs.push([map[en], en]);
    pairs.push(['cfStyleBrowser', 'style and layout (browser)']);
    const differ = pairs.filter(p => i18n.t(PFX + p[0]) !== p[1]).map(p => p[0] + ': ' + JSON.stringify(i18n.t(PFX + p[0])) + ' vs ' + JSON.stringify(p[1]));
    check('English texts in perf.js match the pack (' + pairs.length + ')', pairs.length >= 50 && differ.length === 0 || (console.log('  ' + differ.join('\n  ')), false));
    /* every key the window uses exists in English and Greek */
    const used = new Set(pairs.map(p => PFX + p[0]));
    for (const m of perfSrc2.matchAll(/\bT\('(\w+)'/g)) used.add(PFX + m[1]);
    for (const m of perfSrc2.matchAll(/\bTS\('(\w+)'/g)) used.add('settings.' + m[1]);
    /* not keys: the level number is added in the code, 'x' is the comment's example */
    used.delete('settings.lmAdaptiveLevel'); used.delete(PFX + 'x'); used.delete('settings.x');
    ['keepOn', 'keepOff'].forEach(k => used.add(PFX + k));
    for (let l = 0; l <= 3; l++) used.add('settings.lmAdaptiveLevel' + l);
    const elRt = {}; i18n(elRt, 'el');
    const absent = [...used].filter(k => i18n.t(k) === k || !elRt.LMi18n.has(k, 'el'));
    check('every text key used exists and has its Greek (' + used.size + ')', used.size >= 60 && absent.length === 0 || (console.log('  ' + absent.join(', ')), false));

    /* the window's lines: English through the pack are the same as the report's, Greek differs */
    const trOf = (code) => (k, v) => { const r = i18n.t(PFX + k, v, code); return r === PFX + k ? null : r; };
    const fzT = { t: 10000, w: Date.now(), dur: 287, bd: { r: 'Canvas2D (WebGL off)', s: [{ n: 'render', ms: 40 }], q: '412 cells', qp: { s: ', ', p: [P.tp('infoCells', '{0} cells', [412])] } } };
    const evsT = [{ type: 'packet gap', t: 10050, dur: 900 }, { type: 'visibility', t: 9800, info: 'hidden' }];
    const enLine = P.classifyFreeze(fzT, [], evsT, { loaf: true }).line;
    check('freeze line: English through the pack = report line', P.classifyFreeze(fzT, [], evsT, { loaf: true, tr: trOf('en') }).line === enLine);
    const elLine = P.classifyFreeze(fzT, [], evsT, { loaf: true, tr: trOf('el') });
    check('freeze line in Greek: translated, probable stays English data', elLine.line !== enLine && elLine.line.indexOf(i18n.t(PFX + 'cfTabHidden', null, 'el')) >= 0 &&
        elLine.line.indexOf(i18n.t(PFX + 'infoCells', [412], 'el')) >= 0 && elLine.line.indexOf(i18n.t(PFX + 'rn2dOff', null, 'el')) >= 0 && elLine.probable === '');
    const evT = { w: Date.now(), type: 'disconnect', dur: 0, info: 'code 1006 (not clean)', n: 1, ip: { s: ' ', p: [P.tp('infoCode', 'code {0}', [1006]), P.tp('notClean', '(not clean)')] } };
    check('event line: English by default, Greek with the Greek texts', / disconnect code 1006 \(not clean\)$/.test(P.eventLine(evT)) &&
        P.eventLine(evT, trOf('el')).indexOf(i18n.t(PFX + 'evDisconnect', null, 'el') + ' ' + i18n.t(PFX + 'infoCode', [1006], 'el') + ' ' + i18n.t(PFX + 'notClean', null, 'el')) > 0);
    check('event line: details from ogario.v4.js translated, unknown ones kept', P.eventLine({ w: 0, type: 'packet gap', dur: 300, info: 'no world update', n: 1 }, trOf('el')).indexOf(i18n.t(PFX + 'infoNoUpdate', null, 'el')) > 0 &&
        / x-type 5 ms player text$/.test(P.eventLine({ w: 0, type: 'x-type', dur: 5, info: 'player text', n: 1 }, trOf('el'))));

    /* the diagnostics window in a small fake DOM: texts from the packs, a language change redraws them */
    const mkEl = (tag) => {
        const e = { tagName: tag.toUpperCase(), style: {}, children: [], attrs: {}, textContent: '', title: '', dir: '', fills: [],
            appendChild(c) { c.parentNode = e; e.children.push(c); return c; },
            removeChild(c) { e.children = e.children.filter(x => x !== c); c.parentNode = null; },
            addEventListener() { }, setAttribute(k, v) { e.attrs[k] = String(v); }, getAttribute(k) { return e.attrs[k]; },
            getBoundingClientRect: () => ({ left: 8, top: 8, width: 380, height: 300 }) };
        if (tag === 'canvas') {
            const c2 = { fillText(t) { e.fills.push(t); } };
            ['clearRect', 'fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'setLineDash'].forEach(n => { c2[n] = () => { }; });
            e.getContext = () => c2;
        }
        return e;
    };
    const body = mkEl('body');
    const wp = page(user(), null, { setTimeout: () => 0 });
    wp.ctx.document.createElement = mkEl;
    wp.ctx.document.body = body;
    wp.ctx.LMPerf.openDiag();
    const md = body.children[0];
    const all = (e, out) => { out.push(e); (e.children || []).forEach(c => all(c, out)); return out; };
    const nodes = all(md, []);
    const byId = (id) => nodes.find(n => n.id === id);
    const title = md.children[0].children[0];
    const stats = nodes.find(n => n.tagName === 'PRE');
    check('window: title, buttons and stats from the packs (English)', md.id === 'lm-perf-diag' && title.textContent === i18n.t('settings.lmPerfDiag') &&
        byId('lm-perf-copy').textContent === i18n.t('settings.lmPerfCopy') && byId('lm-perf-keep').textContent === i18n.t(PFX + 'keepOff') &&
        byId('lm-perf-diag-close').title === i18n.t('settings.close') && stats.textContent.indexOf(i18n.t(PFX + 'statAdaptiveOff')) >= 0 && md.dir === 'ltr');
    const canv = nodes.filter(n => n.tagName === 'CANVAS');
    check('window: graph labels from the packs', canv[0].fills.some(t => t === i18n.t(PFX + 'graphFrames', [50, 60])) && canv[1].fills.some(t => t === i18n.t(PFX + 'graphWaiting')));
    wp.ctx.LMi18n.setLang('el');
    check('window: a language change redraws it in Greek', title.textContent === i18n.t('settings.lmPerfDiag', null, 'el') && title.textContent !== i18n.t('settings.lmPerfDiag') &&
        byId('lm-perf-clear').textContent === i18n.t('settings.lmNetClear', null, 'el') && stats.textContent.indexOf(i18n.t(PFX + 'statAdaptiveOff', null, 'el')) >= 0 &&
        canv[0].fills.some(t => t === i18n.t(PFX + 'graphFrames', [50, 60], 'el')));
    wp.ctx.LMi18n.setLang('ar');
    check('window: right-to-left in Arabic, graphs stay left-to-right', md.dir === 'rtl' && canv.every(c => c.dir === 'ltr') && title.textContent === i18n.t('settings.lmPerfDiag', null, 'ar'));
    check('report stays English in another language', /^Legend Mod .* performance report/.test(wp.ctx.LMPerf.report()) && /Freezes \(\u2265250 ms, foreground\): 0/.test(wp.ctx.LMPerf.report()));
    wp.ctx.LMPerf.closeDiag();
    check('window closed: removed', body.children.length === 0);
}
console.log(fail ? fail + ' failed' : 'all perf checks passed');
process.exit(fail ? 1 : 0);
