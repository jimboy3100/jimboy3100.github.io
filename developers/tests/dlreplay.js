/* Dying Light in a Replay Studio replay (extras/dyinglight.js LMDyingLight.replayLook) with the real
 * LMEvents, settings and theme override of ogario/ogario.v4.js, on a fake clock and fake timers:
 * a replay recorded with the theme on shows its look with the player's switch off (never saved),
 * the scene follows the recorded clock and a seek at once, sounds stay silent, the end gives the
 * normal look back; with the player's own theme on, the replay's intensity and clock only while it
 * plays; a turn-off by the player during the replay holds; a press on the banner makes it the
 * player's own (LMexpress.js lmDyingLightOwnState). The Studio side is in replaystudio.js.
 * node developers/tests/dlreplay.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const main = rd('ogario/ogario.v4.js'), dl = rd('extras/dyinglight.js'), lmx = rd('LMexpress/LMexpress.js');
const cutIn = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

let T = 0, seq = 0;
const timers = new Map();
const setTimeout_ = (fn, ms) => { const id = ++seq; timers.set(id, { fn, due: T + (+ms || 0) }); return id; };
const clearTimeout_ = id => { timers.delete(id); };
function advance(ms) {
    const end = T + ms;
    for (;;) {
        let best = null;
        for (const [id, t] of timers) if (t.due <= end && (!best || t.due < best[1].due)) best = [id, t];
        if (!best) break;
        timers.delete(best[0]);
        T = Math.max(T, best[1].due);
        best[1].fn();
    }
    T = Math.max(T, end);
}
const mkEl = tag => ({ tag, attrs: {}, style: { setProperty() { } }, parentNode: null, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener() { }, removeEventListener() { } });
const parent = () => ({ kids: [], appendChild(n) { n.parentNode = this; this.kids.push(n); return n; }, removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; } });
const head = parent(), body = parent(), cls = new Set();
const document = {
    hidden: false, head, body, activeElement: null,
    documentElement: { classList: { add(c) { cls.add(c); }, remove(c) { cls.delete(c); } } },
    createElement: mkEl, getElementById: () => null, addEventListener() { }, removeEventListener() { }
};
const pics = [];
class Img { set src(u) { this._src = u; pics.push(this); } get src() { return this._src; } }
const flushPics = () => { while (pics.length) { const im = pics.shift(); im.naturalWidth = 64; im.onload && im.onload(); } };
const plays = [];
class Aud { constructor() { this.paused = true; } play() { this.paused = false; } pause() { this.paused = true; } removeAttribute() { } load() { } }
let saves = 0, asked = 0, answer = true;
const ctx = {
    document, Image: Img, Audio: Aud, console: { warn() { }, log() { } }, Promise, Object, JSON, Array, String, Number, Error, Map, Math,
    setTimeout: setTimeout_, clearTimeout: clearTimeout_, performance: { now: () => T },
    LMNotifications: { play: (a) => plays.push(a.src) },
    toastr: { info() { plays.push('toast'); }, warning() { } },
    legendmod: { play: true }, lmT: k => k,
    application: { saveSettings() { saves++; } },
    confirm: () => { asked++; return answer; },
    localStorage: { removeItem() { } }
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), ctx);
vm.runInContext(cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n};', ctx);
const painted = [];
vm.runInContext('var defaultSettings = { menuMainColor: "#01d9cc", menuPanelColor: "#00243e", menuPanelColor2: "#002f52", menuTextColor: "#ffffff", menuTextColor2: "#8096a7", hudMainColor: "#01d9cc", hudColor: "rgba(0,0,0,0.4)", hudTextColor: "#ffffff" };\n' +
    cutIn(main, 'var LM_THEME_OV_KEYS', '\nvar defaultSettings = {'), ctx);
ctx.Settings = { setMenuMainColor() { painted.push(ctx.lmThemeEffective()); }, setMenuPanelColor() { }, setMenuTextColor() { }, setHudColors() { } };
vm.runInContext(dl, ctx);
/* the banner's view of the switch */
vm.runInContext('var _lmDlFetching = false;\n' + cutIn(lmx, 'function lmDyingLightOwnState(api) {', '\nfunction lmDyingLightToggle() {'), ctx);
const D = ctx.defaultmapsettings, L = ctx.LMDyingLight, info = () => ctx.LMDyingLightDirector.info();
const cell = { size: 100, targetNick: 'enemy', x: 0, y: 0 };
const flush = () => new Promise(r => setImmediate(r));
const sceneOf = () => { const b = L.getBackground(); return b ? /backgrounds\/(back\d+)-/.exec(b.url)[1] : null; };
const states = [];
ctx.LMEvents.on('dyingLightChange', d => states.push(d.state));

(async () => {
    check('start: the player\'s switch off, nothing on', D.dyingLight === false && L.state === 'off' && L.getFallbackSkinKey(cell) === null);
    ctx._lmEvReplayOn = true;

    /* ═══ the player's switch off: on for the replay only ═══ */
    check('replay look: asked with the switch off, it loads', L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 250000 }) === true && L.state === 'loading' && asked === 0);
    flushPics(); await flush();
    check('replay look: on with the zombie skins, for the replay only', L.isEnabled() && L.replayScoped() && /dyinglight\/skins\//.test(L.getFallbackSkinKey(cell) || '') && cls.has('lm-dl'));
    check('replay look: the switch stays off and nothing is saved, no question asked', D.dyingLight === false && saves === 0 && asked === 0);
    check('replay look: the banner shows the player\'s switch (off)', ctx.lmDyingLightOwnState(L) === 'off');
    advance(1000); flushPics(); advance(1000);
    check('replay look: the scene of the recorded clock (night at 4:10)', info().phase === 'night' && info().replay === true && /^back(0|1)$/.test(sceneOf()));
    check('replay look: the recorded intensity, the player\'s untouched', L.replay().i === 'nightmare' && L.intensity() === 'immersive' && D.dyingLightIntensity === 'immersive');

    /* a seek: the phase follows at once */
    L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 30000 });
    check('seek: the phase follows at once (day at 0:30)', info().phase === 'day');
    flushPics(); L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 31000 });
    check('seek: its scene shown once loaded', /^back(9|8)$/.test(sceneOf()));
    L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 500000 });
    check('seek: deep night at 8:20', info().phase === 'deepNight');
    L.replayLook({ on: 1, i: 'nightmare', cy: 0, ck: 500000 });
    check('recorded without Day and night: the fixed scene', info().phase === 'night' && sceneOf() === 'back0');
    L.replayLook({ on: 1, i: 'competitive', cy: 1, ck: 30000 });
    check('recorded competitive: the fixed scene', info().phase === 'night' && sceneOf() === 'back0');
    L.replayLook({ on: 1, i: 'immersive', cy: 1 });
    check('no recorded clock: the fixed scene', info().phase === 'night' && sceneOf() === 'back0');

    /* silent: nightfall, rare events, deaths */
    L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 200000 }); flushPics();
    for (let i = 0; i < 300; i++) { advance(1000); L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 200000 + i * 1000 }); flushPics(); }
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('replay look: no sound, toast or figure while it plays (night fell and deep night came, a death)', plays.length === 0 && body.kids.length === 0 && info().phase === 'deepNight');

    /* the end */
    const nPaint = painted.length;
    check('end: replayLook(null)', L.replayLook(null) === true);
    check('end: the normal look exactly (off, no skins, no background, no class, no timer)', L.state === 'off' && L.getFallbackSkinKey(cell) === null && L.getBackground() === null &&
        !cls.has('lm-dl') && timers.size === 0 && ctx.dyinglight1load === null && head.kids.length === 0);
    check('end: the player\'s theme painted again', painted.length === nPaint + 1 && painted[painted.length - 1] === ctx.defaultSettings);
    check('end: the switch still off, never saved', D.dyingLight === false && saves === 0);
    check('end: nothing more to end', L.replayLook(null) === false);

    /* the replay ends while it still loads */
    L.replayLook({ on: 1, i: 'immersive', cy: 1, ck: 0 });
    L.replayLook(null);
    flushPics(); await flush();
    check('end while loading: stays off', L.state === 'off' && saves === 0 && timers.size === 0);

    /* ═══ the player turns it off during the replay: it stays off for that replay ═══ */
    L.replayLook({ on: 1, i: 'immersive', cy: 1, ck: 0 }); flushPics(); await flush();
    await L.disable();
    check('player off during the replay: off', L.state === 'off');
    check('player off: the next position does not turn it on again', L.replayLook({ on: 1, i: 'immersive', cy: 1, ck: 2000 }) === false && L.state === 'off');
    L.replayLook(null);

    /* ═══ a press on the banner during the replay: the player's own from then on ═══ */
    L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 0 }); flushPics(); await flush();
    saves = 0;
    answer = true;
    check('press during the replay: asked, kept on, saved on', await L.enable({ confirm: true }) === true && asked === 1 && !L.replayScoped() && D.dyingLight === true && saves === 1 &&
        ctx.lmDyingLightOwnState(L) === 'on');
    L.replayLook(null);
    check('press during the replay: the replay\'s end leaves the player\'s own on', L.state === 'on' && L.replay() === null);
    await L.disable();
    D.dyingLight = false; saves = 0;

    /* ═══ the player's own theme on: the recorded look only while the replay plays ═══ */
    ctx._lmEvReplayOn = false;
    let p = L.enable(); flushPics(); await p;
    saves = 0;
    advance(1000); flushPics(); advance(1000);
    const ownPhase = info().phase, ownClock = info().clock;
    check('own: on, day at its start', L.isEnabled() && ownPhase === 'day' && !L.replayScoped());
    ctx._lmEvReplayOn = true;
    L.replayLook({ on: 1, i: 'nightmare', cy: 1, ck: 300000 });
    check('own + DL replay: the recorded phase at once, the switch untouched', info().phase === 'night' && L.isEnabled() && !L.replayScoped() && D.dyingLight === true && saves === 0);
    advance(3000);
    L.replayLook(null);
    ctx._lmEvReplayOn = false;
    plays.length = 0;
    advance(1000); flushPics(); advance(1000);
    check('own after the replay: still on, its own phase and clock, its intensity', L.isEnabled() && info().phase === ownPhase && info().clock >= ownClock + 5000 && L.intensity() === 'immersive' && L.replay() === null);
    check('own after the replay: no nightfall for the phase change back, nothing saved', plays.length === 0 && saves === 0 && D.dyingLight === true);
    await L.disable();

    if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
    console.log('all Dying Light replay checks passed');
})().catch(e => { console.log('FAIL threw: ' + (e && e.stack)); process.exit(1); });
