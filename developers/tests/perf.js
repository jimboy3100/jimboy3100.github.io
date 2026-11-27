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
/* Performance mode automatic aims at 60 FPS (its own target option is gone) */
check('the target is 60 FPS, no target choices', P.TARGET === 60 && !('snapTarget' in P) && !('TARGETS' in P));
check('FPS limit lowers the target', P.effectiveTarget(30, 0) === 30);
check('limit 0 is no limit, a limit above 60 keeps 60', P.effectiveTarget(0, 0) === 60 && P.effectiveTarget(120, 0) === 60);
check('a 50 Hz screen caps the target', P.effectiveTarget(0, 50) === 50);
check('a measured 30 Hz is not trusted as the screen rate', P.effectiveTarget(0, 30) === 60);
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
check('never past level 2 (the resolution is never lowered)', P.MAX_LEVEL === 2 && st.level <= 2);
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
const sum = P.summarizeSession(1000, 61000, [40, 50, 60, 50], [25, 25, 30], [{ code: 1006, reason: '' }, { code: 1006, reason: '' }, { code: 4408, reason: 'timeout' }], 2);
check('summary numbers', sum.dur === 60000 && sum.pingAvg === 50 && sum.ppsAvg === 27 && sum.disc === 3 && sum.reconn === 2);
check('no session history functions (Network quality history is removed)', P.mergeHistory === undefined && P.validateHistory === undefined);

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
        /* window listeners (blur / focus for the window-not-in-front gaps) */
        addEventListener(t, f) { listeners['win:' + t] = f; }, devicePixelRatio: 1, innerWidth: 915, innerHeight: 412, navigator: {}
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

const user = () => Object.assign(base(), { adaptivePerf: false, fpsLimit: 0, performanceMode: false });
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
frames(pg, 236, 27, 20);
check('still slow: stays at level 2, the resolution is never lowered', pg.ctx.LMPerf.level() === 2 && !(pg.ctx._lmAdaptiveScale > 0) && !pg.calls.some(c => /^resize/.test(c)));
check('one message per level', pg.toasts.length === 2 && pg.toasts[1] === i18n.t('settings.lmAdaptiveLevel2'));
/* menu opened: own values back (presets and Performance mode see them), frames ignored */
pg.overlays.style.display = '';
frames(pg, 60, 33.3, 20);
check('menu open: own values in place, level kept', S.jellyPhisycs === true && S.hudBlur === 3 && pg.ctx.LMPerf.level() === 2);
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
check('9 s fast: still level 2', pg.ctx.LMPerf.level() === 2);
frames(pg, 60 * 2, 16.7, 2);
check('10 s fast: level 1', pg.ctx.LMPerf.level() === 1);
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
check('automatic off: own values, no hook, full resolution', S.jellyPhisycs === true && S.hudBlur === 3 && pg.ctx._lmPerfFrame == null && !(pg.ctx._lmAdaptiveScale > 0));
/* the old message switch is gone: a saved "off" of it keeps nothing quiet */
const quiet = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfToasts: false }));
frames(quiet, 31 * 5, 33.3, 20);
check('a saved adaptivePerfToasts off is ignored: the level message shows', quiet.ctx.LMPerf.level() === 1 && quiet.toasts.length === 1);
/* a 60 Hz screen at 60 FPS: not "too slow" (a saved 120 target is ignored) */
const hz = page(Object.assign(user(), { adaptivePerf: true, adaptivePerfTarget: 120 }));
frames(hz, 60 * 20, 16.7, 4);
check('60 FPS on a 60 Hz screen: no level change', hz.ctx.LMPerf.level() === 0);
/* FPS limit below the target */
const lim = page(Object.assign(user(), { adaptivePerf: true, fpsLimit: 30 }));
frames(lim, 30 * 20, 33.3, 5);
check('FPS limit 30: 30 FPS is the target reached', lim.ctx.LMPerf.level() === 0);

/* the removed Network quality history: its saved sessions go once on load; nothing measures the
 * network with the diagnostics window closed (the live measuring is checked with the window below) */
const nt = page(user(), { lmNetHistory: '[{"start":1}]' });
check('old network history removed on load, no timer', !('lmNetHistory' in nt.store) && nt.timers.filter(Boolean).length === 0);
nt.ctx.LMPerf.netEvent('close', { code: 1006, reason: '', wasClean: false, openMs: 5000 });
check('report text is built; a disconnect with the window closed is not counted', /FPS:/.test(nt.ctx.LMPerf.report()) && /disconnects 0/.test(nt.ctx.LMPerf.report()));
/* frames by renderer and Canvas2D reason: drawRender counts them (GLW_IDS of ogario.v4.js) */
{
    const idsM = /\n        GLW_IDS: (\[[^\]]*\]),/.exec(fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n'));
    const ids = idsM ? new Function('return ' + idsM[1])() : null;
    check('reason names found in ogario.v4.js', !!ids && ids[0] === 'webgl');
    if (ids) {
        const dr = nt.ctx.drawRender, c = new Uint32Array(32);
        check('no renderer line before any frame is counted', !/Renderer frames/.test(nt.ctx.LMPerf.report()) && nt.ctx.LMPerf.rendererFrames() === null);
        c[0] = 900; c[ids.indexOf('coveredEffect')] = 80; c[ids.indexOf('chatNew')] = 20;
        dr._lmGlWhyN = c; dr.GLW_IDS = ids;
        const rf = nt.ctx.LMPerf.rendererFrames();
        check('rendererFrames: total, WebGL and the Canvas2D reasons, most first', rf.total === 1000 && rf.webgl === 900 && rf.canvas.length === 2 &&
            rf.canvas[0][0] === 'coveredEffect' && rf.canvas[0][1] === 80 && rf.canvas[1][0] === 'chatNew');
        check('report: renderer frames line', nt.ctx.LMPerf.report().indexOf('Renderer frames since load: 1000, WebGL 900 (90.0%), Canvas2D: coveredEffect 80, chatNew 20') >= 0);
        delete dr._lmGlWhyN; delete dr.GLW_IDS;
    }
}
/* cell colour anomalies (window._lmColorDiag): set only while recording, deduplicated, bounded */
{
    check('colour diagnostics: nothing is set while not recording', nt.ctx._lmColorDiag == null);
    nt.ctx.LMPerf.keepRecording(true);
    const cd = nt.ctx._lmColorDiag;
    check('colour diagnostics: set while recording', typeof cd === 'function');
    const lmc = nt.ctx.legendmod;
    lmc._teamColorMap = new Map([['Mate', '#000000']]);
    lmc.cellcolors = { Bob: '#000000' };
    lmc._connectSeq = 3;
    const mate = { id: 7, targetNick: 'Mate', color: '#000000', _lmRawColor: '#c80e0e' };
    for (let i = 0; i < 5; i++) cd('drawn black', mate, { raw: '#c80e0e', op: 16, flags: 10 });
    cd('drawn black', { id: 8, targetNick: 'Bob', color: '#000000', _lmRawColor: '#00e600' }, { op: 16 });
    cd('server black', { id: 9, targetNick: 'Coal', color: '#000000', _lmRawColor: '#000000' }, { op: 16 });
    cd('without colour', { id: 10, color: null, spectator: 2 }, { op: 16 });
    let rows = nt.ctx.LMPerf.colorAnomalies();
    check('colour diagnostics: one row per kind and cell identity, repeats counted', rows.length === 4 && rows[0].n === 5 && rows[0].id === 7 && rows[0].session === 3);
    check('colour diagnostics: the source is named', rows[0].src === 'team colour (chat relay)' && rows[1].src === 'colour remembered for the nick' &&
        rows[2].src === 'server black' && rows[3].src === 'no colour received' && rows[3].conn === 'spectator 2');
    lmc.cells = [Object.assign({ isFood: false, isVirus: false }, mate), { id: 11, color: '#f80ff', targetNick: 'Odd', isFood: false }, { id: 12, color: '#33ff33', isFood: false }];
    nt.ctx.lmColorInt = (s) => /^#[0-9a-f]{6}$/i.test(s) ? parseInt(s.slice(1), 16) : -1;
    const rep = nt.ctx.LMPerf.report();
    check('report: the anomalies, then the cells drawn black or without colour now', /Cell colour anomalies \(4, last 256 kept\):/.test(rep) &&
        /drawn black x5: main cell 7, connection 3, nick "Mate", server colour #c80e0e, colour #000000, from team colour \(chat relay\)/.test(rep) &&
        /Cells now: 1 black \(0 sent black by the server\), 0 without colour \(drawn grey\), 1 with no colour string/.test(rep) &&
        /no colour string: main cell 11, nick "Odd"/.test(rep));
    for (let i = 0; i < 300; i++) cd('without colour', { id: 100 + i, targetNick: 'n' + i, color: null }, {});
    rows = nt.ctx.LMPerf.colorAnomalies();
    check('colour diagnostics: at most 256 rows, the oldest go', rows.length === 256 && rows[rows.length - 1].nick === 'n299' && !rows.some((r) => r.id === 7));
    nt.ctx.LMPerf.keepRecording(false);
    check('colour diagnostics: unset when recording stops', nt.ctx._lmColorDiag == null);
    delete lmc._teamColorMap; lmc.cellcolors = {}; lmc.cells = []; delete nt.ctx.lmColorInt;
}
check('colour log alone: a repeat counts, rows are bounded', (() => {
    const log = P.createColorLog(2);
    log.add('a', { nick: 'x' }, 1); log.add('a', { nick: 'x' }, 2); log.add('b', {}, 3); log.add('c', {}, 4);
    const l = log.list();
    return l.length === 2 && l[0].kind === 'b' && l[1].kind === 'c' && P.colorRowText({ kind: 'a', n: 2, t: 0, tl: 0, nick: 'x' }).indexOf('a x2: main') === 0;
})());

/* ---- stalls, freezes and the event list (diagnostics only) ---- */
check('gap kinds', P.classifyGap(16.7, false, -1) === '' && P.classifyGap(150, false, -1) === 'stall' && P.classifyGap(1500, false, -1) === 'freeze' &&
    P.classifyGap(1500, true, -1) === 'background' && P.classifyGap(20000, false, -1) === 'pause' && P.classifyGap(1500, false, 200) === 'return' &&
    P.classifyGap(1500, false, 5000) === 'freeze' && P.classifyGap(0, false, -1) === '');
check('gap kinds: window not in front', P.classifyGap(1500, false, -1, true) === 'unfocused' && P.classifyGap(150, false, -1, true) === 'unfocused' &&
    P.classifyGap(50, false, -1, true) === '' && P.classifyGap(1500, true, -1, true) === 'background' && P.classifyGap(20000, false, -1, true) === 'pause');
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
/* the browser window not in front (an editor over it): its gaps are listed, not counted */
pr = rec(); pr.ctx.LMPerf.keepRecording(true);
for (let i = 0; i < 30; i++) pr.frame(16.7, 2);
pr.ctx._now = pr.t; pr.listeners['win:blur']();
pr.frame(1500, 2); pr.frame(800, 2);
for (let i = 0; i < 10; i++) pr.frame(16.7, 2);
evs = pr.ctx.LMPerf.events(); rep = pr.ctx.LMPerf.report();
check('window not in front: gaps listed as such, not freezes', evs.filter(e => e.type === 'freeze').length === 2 && evs.filter(e => e.type === 'freeze').every(e => /window not in front/.test(e.info)) && /Freezes \(≥250 ms, foreground\): 0/.test(rep) && /2 while the window was not in front, 2300 ms, not counted/.test(rep));
check('window not in front: no stall, not frame times', !/stalls ≥100ms/.test(rep) && /0 recent, 0 measured in total/.test(rep));
pr.ctx._now = pr.t; pr.listeners['win:focus']();
pr.frame(16.7, 2);
pr.frame(1500, 2);
check('back in front: such a gap is a freeze again', /Freezes \(≥250 ms, foreground\): 1, worst 1500 ms/.test(pr.ctx.LMPerf.report()));

/* ---- the real render loop of ogario.v4.js: callback times before the FPS limit, timing in a finally ---- */
const v4 = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const rStart = v4.indexOf('\n        render() {\n            /* Performance diagnostics');
const rEnd = v4.indexOf('\n        init() {\n            this.setCanvas();', rStart);
const resetSrc = /\n        (_lmResetFreezeDetector\([^)]*\) \{[\s\S]*?\n        \}),\n/.exec(v4);
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
const gapsOf = () => lp.ctx.LMPerf.events().filter(e => e.type === 'packet gap');
const gapsBefore = gapsOf().length;
lp.ctx.legendmod._lmResetFreezeDetector(true);
check('a packet gap still open when the connection closes is listed, not lost', gapsOf().length === gapsBefore + 1 && gapsOf()[gapsBefore].dur >= 3500);
lp.ctx.legendmod._lmResetFreezeDetector();
check('a second reset lists nothing more', gapsOf().length === gapsBefore + 1);
check('reset on connect / close: latches and the last update time cleared', !lp.dr._lmFreezeLogged && !lp.dr._lmStallLogged && !lp.dr._lmStallMax && lp.ctx.legendmod._lmLastWorldUpdate === 0);
/* leaving the server during a stall (Disconnect, a server change: closeConnection, no close
 * event): the gap is listed then, not at the next open with the time spent in between */
const closeSrc = /\n        (closeConnection\(\) \{[\s\S]*?\n        \}),\n/.exec(v4.slice(resetSrc.index));
check('closeConnection of the game connection found', !!closeSrc);
vm.runInContext('legendmod.closeConnection = ({' + closeSrc[1] + '}).closeConnection;', lp.ctx);
lp.ctx.legendmod._lmLastWorldUpdate = Date.now() - 3500; lp.tick(16.7);
lp.ctx.legendmod.socket = { readyState: 1, OPEN: 1, close() { } };
lp.ctx.legendmod.closeConnection();
check('a stall still going on when you leave the server is listed then, with its time up to then', gapsOf().length === gapsBefore + 2 && gapsOf()[gapsBefore + 1].dur >= 3500 && gapsOf()[gapsBefore + 1].dur < 5000 && lp.ctx.legendmod.socket === null);
lp.ctx.legendmod._lmResetFreezeDetector();
check('the next connection opening lists nothing more', gapsOf().length === gapsBefore + 2);
/* a measured gap left open, the next connection opens a minute later: only what was measured */
lp.ctx.legendmod._lmLastWorldUpdate = Date.now() - 3500; lp.tick(16.7);
lp.ctx.legendmod._lmLastWorldUpdate = Date.now() - 60000;
lp.ctx.legendmod._lmResetFreezeDetector();
check('opening a connection does not count the time since the last server', gapsOf().length === gapsBefore + 3 && gapsOf()[gapsBefore + 2].dur < 5000);
check('ogario calls the reset on open, on close and when leaving the server', (v4.match(/if \(this === window\.legendmod\) this\._lmResetFreezeDetector\(\);/g) || []).length === 1 &&
    (v4.match(/if \(this === window\.legendmod\) this\._lmResetFreezeDetector\(true\);/g) || []).length === 2);

/* network diagnostics (ogario.v4.js _lmND, developers/tests/netdiag.js): the real render loop
 * marks the last frame drawn and counts failed ones; a packet gap carries what happened in it */
{
    const gapSrc = /\n        (_lmGapEvent\(dur, sinceEnd\) \{[\s\S]*?\n        \}),\n/.exec(v4);
    check('_lmGapEvent found in ogario.v4.js', !!gapSrc);
    const lq = loop({ fpsLimit: 0 });
    lq.ctx.LMPerf.keepRecording(true);
    const nd = { gen: 2, live: true, t0: 0, rx: 40, wRx: 30, wTry: 20, wOk: 18, wPart: 1, wBad: 1, wMb: 10, wGate: 0, msgAt: 0, tryAt: 0, okAt: 0, renderAt: 0, renderErr: 0,
        mbAt: 0, gateAt: 0, badAt: 0, visAt: 0, hidden: false, oAt: 0, wMsgAt: 0, msgGap: 900, msgGapVis: 300,
        prev: { gen: 1, live: false, reason: 'closeConnection', t0: 0, endAt: 60000, rx: 5, wOk: 4 } };
    vm.runInContext('legendmod._lmResetFreezeDetector = ({' + resetSrc[1] + '})._lmResetFreezeDetector; legendmod._lmGapEvent = ({' + gapSrc[1] + '})._lmGapEvent;',
        Object.assign(lq.ctx, { legendmod: Object.assign(lq.ctx.legendmod, { ws: 'wss://srv.example.com/', serverType: 'x', pps: 0, play: true, isSocketOpen: () => true, _lmLastWorldUpdate: Date.now(), _lmND: nd }) }));
    lq.tick(16.7);
    const at1 = nd.renderAt;
    let bad = true; lq.dr.renderFrame = () => { if (bad) throw new Error('bad'); };
    lq.tick(16.7);
    check('render loop: the last frame drawn is marked, a failed one counted and not marked', at1 > 0 && nd.renderAt === at1 && nd.renderErr === 1);
    bad = false;
    /* world updates held back for the dead main player during a 3.5 s gap, then they come back */
    lq.ctx.legendmod._lmLastWorldUpdate = Date.now() - 3500; nd.mbAt = lq.ctx._now; lq.tick(16.7);
    lq.ctx.legendmod._lmLastWorldUpdate = Date.now(); lq.tick(16.7);
    const gap = lq.ctx.LMPerf.events().filter(e => e.type === 'packet gap').pop();
    check('packet gap while updates were held back: listed with why (multibox), not as nothing received', !!gap && gap.dur >= 3500 && gap.held === 'multibox' &&
        gap.info === 'no world update, playing, held back on purpose (main player dead, multibox unit plays)', gap && gap.info);
    const fzH = { t: gap.t, w: Date.now(), dur: 300 };
    check('freeze in a held-back gap: not the network', /world updates held back on purpose \(main player dead, multibox unit plays\), not the network/.test(P.classifyFreeze(fzH, [], [gap], { loaf: false }).line));
    check('freeze in a gap with rejected updates', /world updates rejected \(malformed packets\)/.test(P.classifyFreeze(fzH, [], [Object.assign({}, gap, { held: '', bad: true })], { loaf: false }).line));
    check('freeze in an ordinary gap: as before', /packet gap \d+ ms, began before the freeze/.test(P.classifyFreeze(fzH, [], [Object.assign({}, gap, { held: '' })], { loaf: false }).line));
    lq.ctx.LMPerf.packetGap(600, false, '', false, true, false);
    check('packet gap parts: tab hidden, nothing received', lq.ctx.LMPerf.events().pop().info === 'no world update, tab hidden or device asleep, nothing received');
    lq.ctx.LMPerf.packetGap(600, true, 'spawn', true, false, true);
    const g2 = lq.ctx.LMPerf.events().pop();
    check('packet gap parts: spawn gate, rejected', g2.info === 'no world update, playing, held back on purpose (spawn), malformed updates rejected' && g2.held === 'spawn' && g2.bad === true);
    const rep2 = lq.ctx.LMPerf.report();
    check('report: world updates of this and the previous connection', /\nWorld updates, connection #2, open \d+ s: callbacks 40, world updates received 30, attempted 20, applied 18, incomplete 1, rejected 1, held back: multibox 10, spawn gate 0; last callback -, attempt -, applied -, frame drawn \d+ ms ago \(1 failed\); longest callback gap 300 ms visible, 900 ms in all\n  previous connection #1, closeConnection after 60 s: callbacks 5,/.test(rep2),
        rep2.split('\n').filter(l => /World updates|previous/.test(l)).join(' | '));
    const wu = lq.ctx.LMPerf.worldUpdates();
    check('worldUpdates(): copies of this and the previous connection', wu && wu.cur.wOk === 18 && wu.cur !== nd && !('prev' in wu.cur) && wu.prev.gen === 1 && wu.prev !== nd.prev);
    const gapsN = lq.ctx.LMPerf.events().filter(e => e.type === 'packet gap').length;
    lq.ctx.legendmod._lmND = null;
    lq.ctx.legendmod._lmLastWorldUpdate = Date.now() - 900; lq.tick(16.7); lq.ctx.legendmod._lmLastWorldUpdate = Date.now(); lq.tick(16.7);
    check('without diagnostics (another object): the packet gap as before', lq.ctx.LMPerf.events().filter(e => e.type === 'packet gap').length === gapsN + 1 &&
        lq.ctx.LMPerf.events().filter(e => e.type === 'packet gap').pop().info === 'no world update, playing' && lq.ctx.LMPerf.worldUpdates() === null && !/World updates,/.test(lq.ctx.LMPerf.report()));
}

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
/* the report line of a long frame with several scripts (it threw from the second one on) */
let lfLine = '';
try { lfLine = P.loafLine(lf); } catch (e) { lfLine = 'threw ' + e.message; }
check('LoAF line with 2 scripts lists both (English report)', /uploadSkinTexture \(ogario\.v4\.js:12345678\) 241 ms.*; render \(ogario\.v4\.js:3456789\) 20 ms/.test(lfLine));

/* ---- function names from character positions (anonymous callbacks) ---- */
const srcText = 'var app = window.app = {\n    init() {\n        setInterval(function () {\n            tick();\n        }, 10000);\n    },\n    draw(a) {\n        if (a) { x(); }\n        return 1;\n    }\n};\nfunction lone() { return 2; }\n';
check('position of an anonymous setInterval callback', P.enclosingName(srcText, srcText.indexOf('function ()')) === 'setInterval callback in window.app.init');
check('position of a method', P.enclosingName(srcText, srcText.indexOf('draw(a)')) === 'window.app.draw');
check('position inside a method body', P.enclosingName(srcText, srcText.indexOf('x();')) === 'window.app.draw');
check('position of a plain function', P.enclosingName(srcText, srcText.indexOf('function lone')) === 'lone' && P.enclosingName(srcText, -1) === '');

/* ---- freeze classification ---- */
const fzBase = { t: 10000, w: Date.now(), dur: 287 };
let cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL2', s: [{ n: 'skin texture upload', ms: 241 }, { n: 'cells update', ms: 21 }, { n: 'render', ms: 17 }], q: '' } }), [], [], { loaf: true });
check('dominant part is the probable contributor', cf.probable === 'skin texture upload' && /^287 ms freeze \d\d:\d\d:\d\d\.\d{3} · WebGL2 · skin texture upload 241 ms, cells update 21 ms, render 17 ms · LoAF: none · network normal · probable contributor: skin texture upload · cause: client \(this page\)$/.test(cf.line));
cf = P.classifyFreeze(Object.assign({}, fzBase, { bd: { r: 'WebGL2', s: [{ n: 'render', ms: 40 }, { n: 'packets', ms: 30 }], q: '' } }), [], [], { loaf: true });
check('no dominant part: unattributed', cf.probable === '' && /unattributed \(GC\/GPU\/browser\?\) · cause: unknown$/.test(cf.line));
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
    const ap = { setAnimatedRainbowColor() { }, applyHudBlur() { }, saveSettings() { }, _lmSkinJobs: [1, 2, 3], _lmSkinDecodeWait: [4, 5] };
    ap._lmSkinJobTrim = function (ms) { stubs.ctx._now += ms || 0; };
    ap.displayTop5 = function () { };
    return { drawRender: dr, legendmod: lm, application: ap, PerformanceObserver: FakePO2, repeatSendingSpecialSkins: function () { stubs.ctx._now += 1; } };
};
const ex = stubs();
const origTrim = ex.application._lmSkinJobTrim, origUpload = ex.drawRender._lmUploadSkinJob, origHandle = ex.legendmod.handleMessage, origRepeat = ex.repeatSendingSpecialSkins, origRF = ex.drawRender.renderFrame;
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
check('recording: the skin job trim is timed too', pr.ctx.application._lmSkinJobTrim !== origTrim);
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
check('breakdown carries queue sizes (skin jobs: canvas jobs and waiting decodes)', /412 cells, skin jobs 5, skin uploads 2, text textures 3\.0 MB/.test(fzs[0].line));
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
check('report: timer callbacks named by the long animation frames (not wrapped there)', /Timer callbacks in long animation frames \(most time first\): anonymous \(ogario\.v4\.js:4242\) 30 ms/.test(rep) && !pr.ctx.setInterval._lmScopeOf);
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

/* ---- the jelly collision index (ogario/wasm_quadtree.js occupancy) and skin queue waits ---- */
/* the real index; the oracle is its own touches() with a counter in the bucket loop and no early
 * return, asked at every indexed point (integer positions: float32 the same as the index's) */
const qtSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'wasm_quadtree.js'), 'utf8').replace(/\r\n/g, '\n');
const loadQt = (s) => { const c = vm.createContext({}); vm.runInContext(s + '\nthis.QT = WasmQuadTree;', c); return c; };
/* cells for one index (an index marks its cells with its build number) */
const mkCells = () => {
    let seed = 7;
    const rnd = () => (seed = (Math.imul(seed, 48271) % 2147483647 + 2147483647) % 2147483647) / 2147483647;
    const out = [];
    for (let i = 0; i < 60; i++) {
        /* half of them crowded around the middle (overlapping), the rest spread out */
        const cx = Math.round(i < 30 ? rnd() * 80 : rnd() * 3000 - 1500), cy = Math.round(i < 30 ? rnd() * 80 : rnd() * 3000 - 1500), r = 20 + Math.round(rnd() * 120);
        const c = { id: i + 1, points: [] };
        for (let k = 0; k < 40; k++) c.points.push({ x: cx + Math.round(Math.cos(k / 40 * 2 * Math.PI) * r), y: cy + Math.round(Math.sin(k / 40 * 2 * Math.PI) * r), parent: c });
        out.push(c);
    }
    return out;
};
{
    const QT = loadQt(qtSrc).QT;
    const tA = qtSrc.indexOf('    function touches('), tB = qtSrc.indexOf('    function anyForeign(', tA);
    const counted = qtSrc.slice(0, tA) + qtSrc.slice(tA, tB).replace('var o = k * 3;', 'READ++; var o = k * 3;').replace('if (dx * dx + dy * dy <= 25) return true;', 'if (dx * dx + dy * dy <= 25) { }') + qtSrc.slice(tB);
    const oc = loadQt('var READ = 0;\n' + counted), Q2 = oc.QT;
    const qtCells = mkCells();
    QT.rebuild(-2000, -2000, 4000, 4000, qtCells); Q2.rebuild(-2000, -2000, 4000, 4000, mkCells());
    const pts = []; qtCells.forEach(c => c.points.forEach(p => pts.push(p)));
    let most = 0;
    pts.forEach(p => { const r0 = oc.READ; Q2.touches(p.x, p.y, -1); most = Math.max(most, oc.READ - r0); });
    const o = QT.occupancy(0);
    check('jelly index occupancy: every point, the points one touches() reads (average and most) as counted in touches()', o.points === pts.length && o.sampled === pts.length &&
        Math.abs(o.perQuery - oc.READ / pts.length) < 1e-9 && o.mostRead === most && o.cells === 60 && o.step >= 10);
    /* fullest bucket: the most points of one bucket (step x step, from the smallest x / y) */
    const mx = Math.min(...pts.map(p => p.x)), my = Math.min(...pts.map(p => p.y)), byB = {};
    pts.forEach(p => { const k = Math.floor((p.x - mx) * (1 / o.step)) + ',' + Math.floor((p.y - my) * (1 / o.step)); byB[k] = (byB[k] || 0) + 1; });
    check('jelly index occupancy: fullest bucket and buckets used', o.fullest === Math.max(...Object.values(byB)) && o.used === Object.keys(byB).length);
    const s = QT.occupancy(100);
    check('jelly index occupancy sampled: at most the sample size, average close to the full one', s.sampled === 100 && s.perQuery > o.perQuery * 0.5 && s.perQuery < o.perQuery * 2);
    const ask = () => pts.map((p, i) => QT.touches(p.x + 3, p.y - 2, i % 60) ? 1 : 0).join('');
    const before = ask();
    QT.occupancy(0);
    check('jelly index occupancy changes nothing (same answers after it)', ask() === before && before.indexOf('1') >= 0);
    QT.clear();
    const e = QT.occupancy(4096);
    check('jelly index occupancy: an empty index gives zeros', e.points === 0 && e.sampled === 0 && e.perQuery === 0 && e.fullest === 0);
}
{
    const QT = loadQt(qtSrc).QT;
    const ap = {
        _lmSkinJobMap: new Map(), _lmSkinJobs: [], _lmSkinDecodeWait: [],
        _lmSkinJobAdd(img, url) { if (this._lmSkinJobMap.has(url)) return; const j = { url }; this._lmSkinJobMap.set(url, j); this._lmSkinJobs.push(j); },
        _lmSkinJobRun(job) { this._lmSkinJobs.splice(this._lmSkinJobs.indexOf(job), 1); this._lmSkinJobMap.delete(job.url); return 'ran'; },
        setAnimatedRainbowColor() { }, applyHudBlur() { }, saveSettings() { }
    };
    const dr = {
        dpr: 1, resizeCanvas() { }, _lmSkinReady: [], _lmSkinBmpN: 2, _lmSkinQBytes: 2 * 1048576, _lmSkinPend: { nodes: new WeakMap(), keys: {} },
        _lmQueueSkinUpload(node) { const j = { node }; this._lmSkinPend.nodes.set(node, j); this._lmSkinReady.push(j); return true; },
        _lmUploadSkinJob(job) { this._lmSkinReady.splice(this._lmSkinReady.indexOf(job), 1); return 'up'; }
    };
    const lm = { cells: new Array(5), pps: 0, ping: 0, isSocketOpen: () => false, quadtree: QT };
    const origs = [ap._lmSkinJobAdd, ap._lmSkinJobRun, dr._lmQueueSkinUpload, dr._lmUploadSkinJob];
    const qp = rec({ application: ap, drawRender: dr, legendmod: lm, PerformanceObserver: FakePO2 });
    const A = qp.ctx.application, D = qp.ctx.drawRender;
    A._lmSkinJobAdd(null, 'old.png');
    const oldJob = A._lmSkinJobMap.get('old.png');
    check('skin queue, off: nothing wrapped, a queued job gets no queue time', A._lmSkinJobAdd === origs[0] && D._lmUploadSkinJob === origs[3] && !('_lmQt' in oldJob));
    qp.ctx.LMPerf.keepRecording(true);
    check('skin queue, recording: the queue and run methods wrapped', A._lmSkinJobAdd !== origs[0] && A._lmSkinJobRun !== origs[1] && D._lmQueueSkinUpload !== origs[2] && D._lmUploadSkinJob !== origs[3]);
    for (let i = 0; i < 5; i++) qp.frame(16.7, 2);
    QT.rebuild(-2000, -2000, 4000, 4000, mkCells());
    const t0 = qp.ctx._now;
    A._lmSkinJobAdd(null, 'a.png');
    A._lmSkinJobAdd(null, 'old.png');
    const node = {};
    check('skin queue: a wrapped call gives the same result', D._lmQueueSkinUpload(node) === true);
    check('skin queue: only jobs made while recording get a queue time (a job asked for again keeps none)', A._lmSkinJobMap.get('a.png')._lmQt === t0 && !('_lmQt' in oldJob));
    qp.ctx._now = t0 + 300;
    check('skin queue: run gives the same result', A._lmSkinJobRun(A._lmSkinJobMap.get('a.png')) === 'ran');
    A._lmSkinJobAdd(null, 'b.png');
    /* a 400 ms freeze: the upload queued at t0 and job b (queued at t0 + 300) still waiting */
    qp.frame(400, 2);
    const fz = qp.ctx.LMPerf.freezes().pop();
    check('freeze: the oldest skin waits and the decodes going on', fz && new RegExp('a skin waiting ' + Math.round(qp.t - t0 - 300) + ' ms for its canvases').test(fz.line) && new RegExp('a skin waiting ' + Math.round(qp.t - t0) + ' ms for its upload').test(fz.line) &&
        /skin decodes 2 \(2\.0 MB\)/.test(fz.line));
    const o = QT.occupancy(4096);
    check('freeze: the jelly index (fullest bucket, points read per question)', fz.bd.jx && fz.bd.jx.fullest === o.fullest && fz.bd.jx.points === o.points &&
        new RegExp('jelly index: fullest bucket ' + o.fullest + ' points, ' + (Math.round(o.perQuery * 10) / 10).toFixed(1) + ' read per point').test(fz.line));
    const tu = qp.ctx._now;
    D._lmUploadSkinJob(D._lmSkinReady[0]);
    A._lmSkinJobRun(oldJob);
    const w = qp.ctx.LMPerf.skinWaits();
    check('skin queue waits: canvases and uploads counted (a job queued before recording is not)', w.canvas.n === 1 && w.canvas.max === 300 && w.upload.n === 1 && w.upload.max === tu - t0);
    const rp = qp.ctx.LMPerf.report();
    check('report: skin queue waits and the jelly index at the last freeze', /Skin queue waits since recording \(queued to done, decode included\): canvases 1, average 300\.0 ms, longest 300 ms; GPU uploads 1/.test(rp) &&
        /Jelly collision index at the last freeze: 2400 points of 60 cells, buckets [\d.]+ units \(\d+ used\), fullest \d+ points/.test(rp));
    qp.ctx.LMPerf.keepRecording(false);
    check('skin queue, recording off: originals back', A._lmSkinJobAdd === origs[0] && A._lmSkinJobRun === origs[1] && D._lmQueueSkinUpload === origs[2] && D._lmUploadSkinJob === origs[3]);
    A._lmSkinJobAdd(null, 'c.png');
    check('skin queue, off again: no queue time', !('_lmQt' in A._lmSkinJobMap.get('c.png')));
}

/* ---- connections, GPU time, timers and the timeline: pure parts ---- */
check('gap cause: the page busy for half of it or more is the client', P.classifyStall({ gap: 400, blocked: 200, others: 0, known: true }) === 'client');
check('gap cause: page free, another connection to the server got messages: the server', P.classifyStall({ gap: 400, blocked: 30, others: 1, known: true }) === 'server');
check('gap cause: page free, nothing came on any connection: network or server', P.classifyStall({ gap: 400, blocked: 0, others: 0, known: true }) === 'network');
check('gap cause: tab hidden: background; frames not measured: unknown', P.classifyStall({ gap: 400, blocked: 400, background: true, known: true }) === 'background' && P.classifyStall({ gap: 400, blocked: 0 }) === 'unknown');
check('longest block: the part of one frame gap inside the window, or the one still going on',
    P.longestBlock([[1100, 300], [1500, 40], [1900, 120]], 1000, 2000, 50, 0) === 120 && P.longestBlock([[1100, 300]], 1000, 2000, 50, 1450) === 550 &&
    P.longestBlock([[1500, 40]], 1000, 2000, 50, 0) === 0 && P.longestBlock([[1300, 250]], 1000, 2000, 50, 0) === 250);
const tline = P.createTimeline(4);
const row0 = tline.push(10, P.TL.MSG, 0, 0, 100, 4);
tline.push(20, P.TL.RAF, 300, 16, 0, 0);
check('timeline: a row gets its duration when it ends; connection numbers kept in 0..255', tline.set(row0, 2.5, 5) && tline.rows(0, 100)[0].join() === '10,3,0,2.5,100,5' && tline.rows(0, 100)[1][2] === 255);
for (let i = 0; i < 5; i++) tline.push(30 + i, P.TL.FRAME, 0, 1, 0, 0);
check('timeline: bounded (the oldest rows go); a row already overwritten is not changed', tline.size() === 4 && tline.rows(0, 100).length === 4 && tline.rows(0, 100)[0][0] === 31 && tline.set(row0, 1) === false);
check('timeline: rows by time, kind and a limit (the newest)', tline.rows(32, 33).length === 2 && tline.rows(0, 100, P.TL.RAF).length === 0 && tline.rows(0, 100, 0, 1)[0][0] === 34);
check('timeline row text', P.rowText([1010, P.TL.MSG, 2, 3.04, 1520, 7], 1000) === '+10 msg c2 3 ms 1520 B world at once after busy' &&
    P.rowText([1400, P.TL.GAP, 0, 400, 2, 0], 1000) === '+400 gap c0 400 ms network, busy 0 ms');
cf = P.classifyFreeze({ t: 10000, w: Date.now(), dur: 300, gpu: 220, bd: { r: 'WebGL2', s: [{ n: 'render', ms: 20 }], q: '' } }, [], [], { loaf: true });
check('a freeze whose frames took the GPU over half of it: GPU', cf.probable === 'GPU' && cf.cause === 'GPU' && /GPU 220 ms/.test(cf.line) && /cause: GPU$/.test(cf.line));
cf = P.classifyFreeze({ t: 10000, w: Date.now(), dur: 300, gpu: 220, bd: { r: 'WebGL2', s: [{ n: 'cells update', ms: 200 }], q: '' } }, [], [], { loaf: true });
check('a timed part over half of it stays the contributor, the GPU time is listed', cf.probable === 'cells update' && cf.cause === 'client' && /GPU 220 ms/.test(cf.line));

/* ---- in a page: messages per connection (main + a unit with the real spect.js handler), gaps and their cause ---- */
const spectSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
const omA = spectSrc.indexOf('\n    onmessage(message) {'), omB = spectSrc.indexOf('\n    onerror(socket, generation) {', omA);
check('spect.js onmessage found', omA > 0 && omB > omA);
const netPage = () => {
    const sock = { bufferedAmount: 0 }, usock = { bufferedAmount: 1234 };
    const lm = { cells: new Array(30), food: new Array(7), pps: 0, ping: 0, play: true, isSocketOpen: () => true, ws: 'wss://game.example:443/play?token=SECRET', socket: sock };
    lm.updateCells = function () { };
    lm.onMessage = function (m) { if (m.boom) throw new Error('bad packet'); if (m.world) this.updateCells(); pg.ctx._now += m.ms || 0; return 'handled'; };
    const dr = { dpr: 1, resizeCanvas() { }, renderFrame() { }, glSkinTexSize: 512 };
    const pg = rec({ legendmod: lm, drawRender: dr, PerformanceObserver: FakePO2 });
    const Unit = vm.runInContext('(class Unit {' + spectSrc.slice(omA, omB) + '\n})', pg.ctx);
    Unit.prototype.handleMessage = function () { if (this.world) this.updateCells(); };
    Unit.prototype.updateCells = function () { };
    pg.unit = Object.assign(new Unit(), { number: 1, player: true, ws: lm.ws, socket: usock, world: true });
    pg.Unit = Unit;
    pg.msg = (bytes, o) => Object.assign({ data: new ArrayBuffer(bytes) }, o || {});
    return pg;
};
let np = netPage();
const origOnMessage = np.ctx.legendmod.onMessage, origUnitCells = np.Unit.prototype.updateCells;
np.unit.onmessage(np.msg(10));
check('not recording: no connection recorder, main messages not wrapped, a unit message is handled as before',
    np.ctx._lmNetRec == null && np.ctx.legendmod.onMessage === origOnMessage && np.Unit.prototype.updateCells === origUnitCells);
np.ctx.LMPerf.keepRecording(true);
check('recording: the recorder is set, main messages wrapped (same result)', np.ctx._lmNetRec && np.ctx.legendmod.onMessage !== origOnMessage &&
    np.ctx.legendmod.onMessage(np.msg(100, { world: true })) === 'handled');
/* steady: a message every 40 ms on both, frames every 16.7 ms */
const both = (k, worldMain) => { for (let i = 0; i < k; i++) { np.frame(20, 2); np.ctx.legendmod.onMessage(np.msg(200, { world: worldMain !== false, ms: 1 })); np.frame(20, 2); np.unit.onmessage(np.msg(150)); } };
both(20);
let cs = np.ctx.LMPerf.connections();
check('both connections counted: messages, bytes, world updates, host only, the send queue', cs.length === 2 && cs[0].id === 0 && cs[0].n === 21 && cs[0].world === 21 && cs[0].bytes === 100 + 20 * 200 &&
    cs[1].id === 1 && cs[1].kind === 'unit' && cs[1].n === 20 && cs[1].world === 20 && cs[0].host === 'game.example' && cs[1].sendQ === 1234 && cs[0].gaps === 0);
check('the unit\'s world update is timed while recording (its class method wrapped)', np.Unit.prototype.updateCells !== origUnitCells);
/* 1) the main connection gets nothing for 500 ms while frames run and the unit keeps getting its messages: the server */
for (let i = 0; i < 12; i++) { np.frame(20, 2); np.frame(20, 2); np.unit.onmessage(np.msg(150)); }
np.frame(20, 2);
np.ctx.legendmod.onMessage(np.msg(200, { world: true }));
cs = np.ctx.LMPerf.connections();
let gapEv = np.ctx.LMPerf.events().filter(e => e.type === 'connection gap');
check('main connection silent, page free, unit served: a gap of the server', cs[0].gaps === 1 && cs[0].maxCause === 'server' && cs[0].maxGap >= 480 && gapEv.length === 1 && gapEv[0].net.cause === 'server' &&
    /main connection, server \(this connection only\)/.test(gapEv[0].info));
/* 2) both silent for 600 ms while frames run: network or server */
for (let i = 0; i < 15; i++) np.frame(20, 2);
np.ctx.legendmod.onMessage(np.msg(200, { world: true }));
np.unit.onmessage(np.msg(150));
cs = np.ctx.LMPerf.connections();
check('every connection silent while the page was free: network or server (main: the unit came back after it)', cs[0].causes.network === 1 && cs[1].causes.network === 1);
/* 3) the page blocked for 700 ms (no frame callback): messages waited; they came at once after it */
both(3);
np.t += 700; np.ctx._now = np.t;
np.ctx.legendmod.onMessage(np.msg(300, { world: true }));
for (let i = 0; i < 4; i++) { np.ctx._now += 1; np.ctx.legendmod.onMessage(np.msg(250)); }
np.frame(0.5, 2);
cs = np.ctx.LMPerf.connections();
gapEv = np.ctx.LMPerf.events().filter(e => e.type === 'connection gap');
const lastGap = gapEv[gapEv.length - 1];
check('the page busy for the whole gap: the client, with the messages that came at once after it', cs[0].causes.client === 1 && lastGap.net.cause === 'client' && lastGap.net.blocked >= 690 &&
    lastGap.net.q === 4 && lastGap.net.qb === 1000 && cs[0].bursts >= 1 && /page busy \d+ ms of it/.test(lastGap.info));
both(5);
/* the timeline: rows with the message flags; the report: connections, gap causes, the timeline around the gaps, no token */
const tlr = np.ctx.LMPerf.timeline();
const msgRows = tlr.rows.filter(r => r[1] === P.TL.MSG);
check('timeline: every message a row (world flag, at once after a gap, after a busy page); hosts apart, no payload',
    msgRows.length >= 60 && msgRows.some(r => (r[5] & 1) && r[2] === 0) && msgRows.some(r => r[5] & 2) && msgRows.some(r => r[5] & 4) && tlr.hosts[0] === 'game.example' && tlr.hosts[1] === 'game.example' &&
    tlr.rows.some(r => r[1] === P.TL.GAP && r[4] === P.STALL_CAUSES.indexOf('client')) && tlr.rows.some(r => r[1] === P.TL.RAF));
rep = np.ctx.LMPerf.report();
check('report: connections with their gap causes, the timeline around the gaps, no token',
    /Connections since recording/.test(rep) && /\n  main game\.example: \d+ messages, [\d.]+ KB, \d+ world updates/.test(rep) && /\(server x1, network x1, client x1\)/.test(rep) &&
    /\n  unit 1 game\.example: /.test(rep) && /then 4 messages \(1\.0 KB\) came at once/.test(rep) && /Timeline around the last 3 freezes \/ gaps \(ms from time origin \d+; c0 main connection, cN unit N, c0 game\.example, c1 game\.example\):/.test(rep) &&
    /\n    \+\d+(\.\d)? gap c0 \d+(\.\d)? ms client, busy \d+ ms/.test(rep) && rep.indexOf('SECRET') < 0 && rep.indexOf('token') < 0);
/* a new socket (reconnect) or another server: its first message is not a gap */
np.ctx.legendmod.socket = { bufferedAmount: 0 };
np.t += 3000; np.ctx._now = np.t;
const gapsNow = np.ctx.LMPerf.connections()[0].gaps;
np.ctx.legendmod.onMessage(np.msg(50));
check('a new socket starts again: the time it took is not a gap', np.ctx.LMPerf.connections()[0].gaps === gapsNow);
/* a message whose handling throws: the error still reaches the caller, its row ends, the next one is recorded */
let threw = false;
try { np.ctx.legendmod.onMessage(np.msg(5, { boom: true })); } catch (e) { threw = /bad packet/.test(e.message); }
const msgsBefore = np.ctx.LMPerf.timeline().rows.filter(r => r[1] === P.TL.MSG).length;
np.ctx.legendmod.onMessage(np.msg(7));
check('a message that throws: the error goes on, its row and timed part end, the next message is recorded',
    threw && np.ctx.LMPerf.timeline().rows.filter(r => r[1] === P.TL.MSG).length === msgsBefore + 1 && np.ctx.LMPerf._scopes.depth() === 0);
threw = false;
np.ctx.LMPerf.keepRecording(false);
check('recording off: recorder gone, main messages and the unit class put back', np.ctx._lmNetRec === null && np.ctx.legendmod.onMessage === origOnMessage && np.Unit.prototype.updateCells === origUnitCells);
const rowsOff = np.ctx.LMPerf.timeline().rows.length;
np.unit.onmessage(np.msg(10)); np.ctx.legendmod.onMessage(np.msg(10));
check('recording off: messages leave nothing in the timeline', np.ctx.LMPerf.timeline().rows.length === rowsOff && !threw);

/* ---- GPU time: timer queries around renderFrame in the real render loop, never waited for ---- */
const fakeGl = () => {
    const g = { ext: { TIME_ELAPSED_EXT: 0x88BF, GPU_DISJOINT_EXT: 0x8FBB }, QUERY_RESULT_AVAILABLE: 0x8867, QUERY_RESULT: 0x8866, made: 0, active: null, ended: [], calls: [], disjoint: false, ns: 4e6 };
    g.getExtension = (n) => n === 'EXT_disjoint_timer_query_webgl2' ? g.ext : null;
    g.isContextLost = () => false;
    g.createQuery = () => ({ id: ++g.made, avail: false, ns: 0 });
    g.beginQuery = (t, q) => { g.calls.push('begin'); q.avail = false; g.active = q; };
    g.endQuery = () => { g.calls.push('end'); g.active.ns = g.ns; g.ended.push(g.active); g.active = null; };
    g.getQueryParameter = (q, p) => p === g.QUERY_RESULT_AVAILABLE ? q.avail : q.ns;
    g.getParameter = (p) => p === g.ext.GPU_DISJOINT_EXT ? g.disjoint : null;
    g.finish = () => g.calls.push('finish'); g.readPixels = () => g.calls.push('readPixels'); g.getError = () => { g.calls.push('getError'); return 0; };
    /* the GPU finishes the frames queued so far (a frame later in a browser) */
    g.done = () => { g.ended.forEach(q => { q.avail = true; }); g.ended.length = 0; };
    return g;
};
lp = loop({ fpsLimit: 0 });
const gl = fakeGl();
lp.dr.gl = gl;
lp.dr.renderFrame = () => { lp.ctx._now += 2; };
for (let i = 0; i < 5; i++) lp.tick(16.7);
check('not recording: no timer query', gl.calls.length === 0);
lp.ctx.LMPerf.keepRecording(true);
for (let i = 0; i < 30; i++) { lp.tick(16.7); gl.done(); }
let gs = lp.ctx.LMPerf.gpu();
check('recording: one query per drawn frame, read when its result is there; no finish, read back or error query',
    gs.supported && gs.frames >= 28 && gs.stats[0] === '4.0' && gl.calls.filter(c => c === 'begin').length === 30 && gl.calls.indexOf('finish') < 0 && gl.calls.indexOf('readPixels') < 0 && gl.calls.indexOf('getError') < 0 && gl.made <= 8);
/* results that never come: at most 8 queries wait, then frames go untimed (nothing blocks) */
const begun = gl.calls.filter(c => c === 'begin').length;
for (let i = 0; i < 20; i++) lp.tick(16.7);
check('results late: at most 8 queries wait, frames still drawn', gl.calls.filter(c => c === 'begin').length - begun <= 8);
gl.done();
/* a freeze whose frame kept the GPU 280 ms: GPU */
lp.tick(16.7); gl.done();
gl.ns = 280e6;
lp.tick(16.7);
lp.tick(320); gl.done(); gl.ns = 4e6;
for (let i = 0; i < 5; i++) { lp.tick(16.7); gl.done(); }
const gfz = lp.ctx.LMPerf.freezes().pop();
check('a freeze with its frame 280 ms on the GPU: probable contributor GPU', !!gfz && gfz.cause === 'GPU' && gfz.gpu >= 279 && /GPU 280 ms/.test(gfz.line));
gl.disjoint = true;
const fr0 = lp.ctx.LMPerf.gpu().frames;
for (let i = 0; i < 3; i++) { lp.tick(16.7); gl.done(); }
check('a disjoint period: its results are dropped', lp.ctx.LMPerf.gpu().frames === fr0 && lp.ctx.LMPerf.gpu().disjoint >= 2);
check('report: GPU time per frame', /GPU time per frame \(timer query\): \d+ frames, p50\/p95\/max /.test(lp.ctx.LMPerf.report()));
lp.ctx.LMPerf.keepRecording(false);
const callsOff = gl.calls.length;
for (let i = 0; i < 5; i++) lp.tick(16.7);
check('recording off: no query, the last one ended', gl.calls.length === callsOff && !gl.active);
lp = loop({ fpsLimit: 0 });
lp.dr.gl = Object.assign(fakeGl(), { getExtension: () => null });
lp.ctx.LMPerf.keepRecording(true);
for (let i = 0; i < 5; i++) lp.tick(16.7);
check('no timer query extension: said so in the report, frames drawn as before', /GPU time per frame \(timer query\): not supported/.test(lp.ctx.LMPerf.report()) && lp.dr.gl.calls.length === 0);

/* ---- timers set while recording and the text atlas growth ---- */
/* a browser with long tasks but without long animation frames (they name timer callbacks themselves) */
function FakePO3(cb) { FakePO2.call(this, cb); }
FakePO3.prototype = FakePO2.prototype;
FakePO3.supportedEntryTypes = ['longtask'];
const tmPage = (po) => {
    const pend = [];
    const pg = rec({ setTimeout: function (f, ms) { pend.push([f, [].slice.call(arguments, 2)]); return pend.length; }, PerformanceObserver: po || FakePO3,
        drawRender: { dpr: 1, resizeCanvas() { }, _lmTextAtlasBank(a, layers) { a.layers = layers; return true; } } });
    pg.pend = pend;
    pg.runTimers = () => { const p = pend.splice(0); p.forEach(([f, a]) => { if (typeof f === "function") f.apply(null, a); }); };
    return pg;
};
let tp2 = tmPage(FakePO2);
tp2.ctx.LMPerf.keepRecording(true);
check('long animation frames there: timers not wrapped (they name the timer callbacks)', typeof tp2.ctx.setTimeout === 'function' && !tp2.ctx.setTimeout._lmScopeOf && !tp2.ctx.setInterval._lmScopeOf);
tp2.ctx.LMPerf.keepRecording(false);
tp2 = tmPage();
const nativeTO = tp2.ctx.setTimeout;
tp2.ctx._now = 1000;
tp2.ctx.LMPerf.keepRecording(true);
check('recording without long animation frames: setTimeout wrapped', tp2.ctx.setTimeout !== nativeTO && tp2.ctx.setTimeout._lmScopeOf === nativeTO);
let got = null;
const id1 = tp2.ctx.setTimeout(function saveSkins(a, b) { got = a + b; tp2.ctx._now += 30; }, 10, 2, 3);
tp2.ctx.setTimeout(function () { tp2.ctx._now += 5; }, 10);
tp2.ctx.setTimeout('x = 1', 10);
tp2.runTimers();
const tst = tp2.ctx.LMPerf.timers();
check('timer callbacks: same arguments and id, timed by name (anonymous by the start of its code)', got === 5 && id1 === 1 && tst.saveSkins && tst.saveSkins.n === 1 && tst.saveSkins.ms === 30 &&
    Object.keys(tst).some(k => /^anonymous function \(\) \{ tp2\.ctx\._now \+= 5; \}/.test(k)) && tp2.pend.length === 0);
const atl = { w: 2048, h: 1024, layers: 2 };
tp2.ctx.drawRender._lmTextAtlasBank(atl, 4);
tp2.ctx.drawRender._lmTextAtlasBank(atl, 4);
rep = tp2.ctx.LMPerf.report();
check('text atlas: a new bank counted with its new pages only (a bank already there: nothing)', atl.layers === 4 && /Text atlas resized 1x since recording, 16\.0 MB of new texture/.test(rep) && /Timer callbacks set since recording \(most time first\): saveSkins 30 ms \/ 1x/.test(rep));
tp2.ctx.LMPerf.keepRecording(false);
check('recording off: setTimeout put back', tp2.ctx.setTimeout === nativeTO);

/* ---- ogario.v4.js: the inline markers and wrapped methods exist ---- */
const marks = v4.match(/window\._lmScope\.b\('([^']+)'\)|S\.b\('([^']+)'\)/g) || [];
const markNames = marks.map(m => /'([^']+)'/.exec(m)[1]);
check('inline markers use known part names', markNames.length >= 5 && markNames.every(n => P.SCOPES.indexOf(n) >= 0));
check('every inline marker is closed', (v4.match(/window\._lmScope\.e\(_lmSc\w+\)/g) || []).length === (v4.match(/var _lmSc\w+ = window\._lmScope \? window\._lmScope\.b\(/g) || []).length);
const perfSrc = src.replace(/\r\n/g, '\n');
/* [object, method, part] and [object, method, part, wrapper]; the browser's own timers are not in ogario.v4.js */
const patches = [...perfSrc.matchAll(/\['(legendmod|drawRender|application|window|Storage\.prototype)', '([\w$]+)', '([^']+)'(?:, \w+)?\]/g)];
const methodIn = (name) => new RegExp('\\n {8}' + name.replace(/\$/g, '\\$') + '(\\([^)]*\\) \\{|: function \\()|\\nfunction ' + name + '\\(|window\\.' + name + ' = function').test(v4);
/* the text atlas grows by a resize (older core) or by a new bank: one of the two is there */
const altOf = { _lmTextAtlasResize: '_lmTextAtlasBank', _lmTextAtlasBank: '_lmTextAtlasResize' };
const missing = patches.filter(p => p[1] !== 'Storage.prototype' && !(p[1] === 'window' && /^set(Timeout|Interval)$/.test(p[2])) && !methodIn(p[2]) && !(altOf[p[2]] && methodIn(altOf[p[2]]))).map(p => p[2]);
check('every wrapped method is defined in ogario.v4.js (' + patches.length + ')', patches.length >= 20 && missing.length === 0 && patches.every(p => P.SCOPES.indexOf(p[3]) >= 0) || (console.log('  missing:', missing), false));

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
    for (let l = 0; l <= P.MAX_LEVEL; l++) used.add('settings.lmAdaptiveLevel' + l);
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
            addEventListener(t, f) { (e.on = e.on || {})[t] = f; }, setAttribute(k, v) { e.attrs[k] = String(v); }, getAttribute(k) { return e.attrs[k]; },
            getBoundingClientRect: () => ({ left: 8, top: 8, width: 380, height: 300 }),
            classList: { add() { } } };
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
        byId('lm-perf-copy').textContent === i18n.t('game1.set.copyDebug') && byId('lm-perf-keep').textContent === i18n.t(PFX + 'keepOff') &&
        byId('lm-perf-diag-close').title === i18n.t('settings.close') && stats.textContent.indexOf(i18n.t(PFX + 'statAdaptiveOff')) >= 0 && md.dir === 'ltr');
    const canv = nodes.filter(n => n.tagName === 'CANVAS');
    /* its Copy button gives the one report of Settings > Copy debug info (ogario.v4.js lmCopyDebugInfo) */
    let copied = 0;
    wp.ctx.lmCopyDebugInfo = () => { copied++; };
    byId('lm-perf-copy').on.click({ preventDefault() { }, stopPropagation() { } });
    check('window: Copy is Copy debug info (one report)', copied === 1);
    check('report: LMPerf.report is the performance part of it', typeof wp.ctx.LMPerf.report === 'function' && /performance report/.test(wp.ctx.LMPerf.report()));
    check('window: graph labels from the packs', canv[0].fills.some(t => t === i18n.t(PFX + 'graphFrames', [50, 60])) && canv[1].fills.some(t => t === i18n.t(PFX + 'graphWaiting')));
    /* the developer console switch of the window: saved with the settings, and its text follows a
     * change made elsewhere (a preset, a profile, an import) while the window is open */
    const bDev = byId('lm-perf-dev');
    check('window: developer console switch off', bDev && bDev.textContent === i18n.t('pkg.caw.devOff') && !wp.ctx.legendmod5.showDevConsole);
    bDev.on.click({ preventDefault() { }, stopPropagation() { } });
    check('window: developer console switched on and saved', wp.ctx.legendmod5.showDevConsole === true && bDev.textContent === i18n.t('pkg.caw.devOn') &&
        JSON.parse(wp.store.ogarioSettings).showDevConsole === true);
    wp.ctx.legendmod5.showDevConsole = false;
    wp.timers.filter(Boolean).forEach(f => f());
    check('window: developer console turned off elsewhere: the switch says off', bDev.textContent === i18n.t('pkg.caw.devOff'));
    wp.ctx.LMi18n.setLang('el');
    check('window: a language change redraws it in Greek', title.textContent === i18n.t('settings.lmPerfDiag', null, 'el') && title.textContent !== i18n.t('settings.lmPerfDiag') &&
        byId('lm-perf-keep').textContent === i18n.t(PFX + 'keepOff', null, 'el') && stats.textContent.indexOf(i18n.t(PFX + 'statAdaptiveOff', null, 'el')) >= 0 &&
        canv[0].fills.some(t => t === i18n.t(PFX + 'graphFrames', [50, 60], 'el')));
    wp.ctx.LMi18n.setLang('ar');
    check('window: right-to-left in Arabic, graphs stay left-to-right', md.dir === 'rtl' && canv.every(c => c.dir === 'ltr') && title.textContent === i18n.t('settings.lmPerfDiag', null, 'ar'));
    check('report stays English in another language', /^Legend Mod .* performance report/.test(wp.ctx.LMPerf.report()) && /Freezes \(\u2265250 ms, foreground\): 0/.test(wp.ctx.LMPerf.report()));
    /* network quality: measured live while the window is open, nothing is stored */
    {
        const lm = wp.ctx.legendmod, pings = [40, 40, 55, 41, 60];
        lm.isSocketOpen = () => true; lm.pps = 25; lm.ws = 'wss://srv.example:443/path?token=secret';
        const tick = () => wp.timers.forEach((f) => { if (f) f(); });
        wp.ctx.LMPerf.netEvent('open', { ws: lm.ws });
        for (let i = 0; i < 40; i++) { lm.ping = pings[i % pings.length] + (i % 3); lm.pingTime = Date.now() - 2000; tick(); }
        wp.ctx.LMPerf.netEvent('close', { code: 1006, reason: '', wasClean: false, openMs: 5000 });
        wp.ctx.LMPerf.netEvent('open', { ws: lm.ws });
        for (let i = 0; i < 20; i++) tick();
        const rep = wp.ctx.LMPerf.report();
        check('window open: live ping, jitter, packet rate and the disconnect in the report', /Network: ping \d+ ms, avg [1-9]\d*, p95 \d+, jitter [1-9]/.test(rep) && /\(avg 25\), disconnects 1, reconnects 1/.test(rep));
        check('window open: no sessions stored, no history section or Clear button', !Object.keys(wp.store).some((k) => /net/i.test(k)) && !byId('lm-perf-clear') && !/Last sessions/.test(rep));
    }
    wp.ctx.LMPerf.closeDiag();
    check('window closed: removed', body.children.length === 0);
    check('window closed: network measuring stopped (no timer left)', wp.timers.filter(Boolean).length === 0);
}
console.log(fail ? fail + ' failed' : 'all perf checks passed');
process.exit(fail ? 1 : 0);
