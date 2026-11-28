/* The Dying Light director (extras/dyinglight.js, the part after LMDyingLight) with the real
 * LMEvents and the real theme override of ogario/ogario.v4.js, on a fake clock and fake timers:
 * phase selection, scenes by phase, cooldowns and the gap between events, a hidden tab (paused, no
 * burst after), death / spawn / replay, competitive, teardown (no timer, listener, sound, figure,
 * style or theme colour left after the turn-off) and the theme colours over the player's theme.
 * node developers/tests/dyinglightdirector.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const main = rd('ogario/ogario.v4.js'), dl = rd('extras/dyinglight.js');
const cutIn = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* fake clock and one-shot timers */
let T = 0, seq = 0;
const timers = new Map();
const setTimeout_ = (fn, ms) => { const id = ++seq; timers.set(id, { fn, due: T + (+ms || 0) }); return id; };
const clearTimeout_ = id => { timers.delete(id); };
function advance(ms, lateBy) {
    const end = T + ms;
    for (;;) {
        let best = null;
        for (const [id, t] of timers) if (t.due <= end && (!best || t.due < best[1].due)) best = [id, t];
        if (!best) break;
        timers.delete(best[0]);
        T = Math.max(T, best[1].due + (lateBy || 0));
        best[1].fn();
    }
    T = Math.max(T, end);
}

/* page stand-ins */
const mkEl = tag => {
    const el = { tag, attrs: {}, style: { props: {}, setProperty(k, v) { this.props[k] = v; } }, ls: {}, parentNode: null,
        setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(n, f) { this.ls[n] = f; }, removeEventListener(n, f) { if (this.ls[n] === f) delete this.ls[n]; } };
    return el;
};
const parent = () => ({ kids: [], appendChild(n) { n.parentNode = this; this.kids.push(n); return n; }, removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; } });
const head = parent(), body = parent();
const docLs = {};
const document = {
    hidden: false, head, body, activeElement: null,
    documentElement: { classList: { add() { }, remove() { } } },
    createElement: mkEl, getElementById: () => null,
    addEventListener(n, f) { (docLs[n] = docLs[n] || []).push(f); },
    removeEventListener(n, f) { const a = docLs[n] || []; const i = a.indexOf(f); if (i >= 0) a.splice(i, 1); }
};
const docCount = () => Object.values(docLs).reduce((n, a) => n + a.length, 0);
const fireVis = () => (docLs.visibilitychange || []).slice().forEach(f => f());
const pics = [];
class Img { set src(u) { this._src = u; pics.push(this); } get src() { return this._src; } }
const flushPics = (ok = true) => { while (pics.length) { const im = pics.shift(); if (ok) { im.naturalWidth = 64; im.onload && im.onload(); } else im.onerror && im.onerror(); } };
const audios = [];
class Aud {
    constructor() { this.paused = true; this.ended = false; this.srcSet = []; audios.push(this); }
    set src(u) { this._src = u; this.srcSet.push(u); } get src() { return this._src; }
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
    removeAttribute(k) { if (k === 'src') this._src = undefined; }
    load() { }
}
const plays = [], toasts = [];
/* the sounds playing come to their end */
const endSounds = () => audios.forEach(a => { a.paused = true; });
const ctx = {
    document, Image: Img, Audio: Aud, console: { warn() { }, log() { } }, Promise, Object, JSON, Array, String, Number, Error, Map,
    setTimeout: setTimeout_, clearTimeout: clearTimeout_, performance: { now: () => T },
    LMNotifications: { play: (a, ch, g) => { plays.push({ t: T, id: /([\w-]+)\.mp3$/.exec(a.src)[1], ch, g }); a.volume = g; a.play(); } },
    toastr: { info: (m, t, o) => toasts.push({ t: T, m, o }), warning() { } },
    legendmod: { play: true }, lmT: k => k
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), ctx);
vm.runInContext(cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n};', ctx);
/* the real theme override, with the theme setters reporting the colours they paint */
const painted = [];
vm.runInContext('var defaultSettings = { menuMainColor: "#01d9cc", menuPanelColor: "#00243e", menuPanelColor2: "#002f52", menuTextColor: "#ffffff", menuTextColor2: "#8096a7", hudMainColor: "#01d9cc", hudColor: "rgba(0,0,0,0.4)", hudTextColor: "#ffffff", chatColor: "#abc" };\n' +
    cutIn(main, 'var LM_THEME_OV_KEYS', '\nvar defaultSettings = {'), ctx);
ctx.Settings = { setMenuMainColor() { painted.push(ctx.lmThemeEffective()); }, setMenuPanelColor() { }, setMenuTextColor() { }, setHudColors() { } };
let R = 0;
vm.runInContext('Math.random = function () { return __r(); };', Object.assign(ctx, { __r: () => R }));
vm.runInContext(dl, ctx);
const D = ctx.defaultmapsettings, L = ctx.LMDyingLight, Dir = ctx.LMDyingLightDirector, info = () => Dir.info();

/* ═══ phases of the 10 minute cycle ═══ */
check('phases: day 0-3 min, dusk 3-4, night 4-8, deep night 8-9, dawn 9-10, then day again',
    [[0, 'day'], [179999, 'day'], [180000, 'dusk'], [239999, 'dusk'], [240000, 'night'], [479999, 'night'], [480000, 'deepNight'],
     [540000, 'dawn'], [599999, 'dawn'], [600000, 'day'], [1080000, 'deepNight']].every(([ms, id]) => Dir.phaseAt(ms) === id));
check('the new settings: off by default with Dying Light, immersive, full sound, cycle and scares on',
    D.dyingLight === false && D.dyingLightIntensity === 'immersive' && D.dyingLightVolume === 1 && D.dyingLightCycle === true && D.dyingLightScares === true);

(async () => {
    /* ═══ on: the clock runs, its colours over the theme ═══ */
    const lsBefore = docCount(), eventsBefore = ['death', 'spawn', 'disconnect', 'serverChange'].filter(n => ctx.LMEvents._has(n)).length;
    let p = L.enable({ confirm: false });
    flushPics(true);
    await p;
    check('on: the director runs with one timer', L.isEnabled() && info().running && timers.size === 1 && info().listeners === 5);
    check('theme: its colours painted over the player\'s, the player\'s theme unchanged',
        painted.length === 1 && painted[0].menuMainColor === '#a12b30' && painted[0].hudColor === 'rgba(9,12,13,0.55)' && painted[0].chatColor === '#abc' &&
        ctx.defaultSettings.menuMainColor === '#01d9cc' && !Object.prototype.hasOwnProperty.call(ctx.defaultSettings, 'hudColor') === false);
    const fixed = L.getBackground();
    check('the fixed scene until the first phase scene is there', fixed && /back0-1920\.webp$/.test(fixed.url));

    advance(1000);
    check('day: its scene loads (small screen: the small copy)', pics.length === 1 && /backgrounds\/back9-1280\.webp$/.test(pics[0].src) && L.getBackground() === fixed);
    flushPics(true);
    advance(1000);
    check('day: its scene shown once loaded', /back9-1280\.webp$/.test(L.getBackground().url) && info().phase === 'day');

    /* the next scene in the last 30 s of a phase, shown at the change */
    advance(145000);
    check('no next scene before the last 30 s', pics.length === 0);
    advance(5000);
    check('dusk scene loads in the last 30 s of day', pics.length === 1 && /back7-1200\.webp$/.test(pics[0].src) && /back9/.test(L.getBackground().url));
    flushPics(true);
    advance(30000);
    check('dusk: its scene at the change', info().phase === 'dusk' && /back7-1200\.webp$/.test(L.getBackground().url));

    /* ═══ events: cooldowns, the gap between any two, nightfall once a cycle ═══ */
    plays.length = 0; toasts.length = 0;
    const figures = [];
    const bodyAppend = body.appendChild.bind(body);
    body.appendChild = n => { figures.push({ t: T, cls: n.attrs && n.tag === 'div' ? n : null, clock: info().clock }); return bodyAppend(n); };
    /* a fixed pseudo-random sequence (mulberry32) */
    let seed = 7;
    ctx.__r = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const log = [];
    const t0 = T;
    /* Legend's Reduced motion (on by default) for the first half, then off */
    D.reducedMotion = true;
    let calmFigures = null;
    for (let i = 0; i < 4500; i++) {
        if (i === 3000) { calmFigures = figures.slice(); D.reducedMotion = false; }
        const before = plays.length + figures.length;
        endSounds();
        advance(1000);
        flushPics(true);
        const E = info().clock;
        if (plays.length + figures.length > before) {
            const newPlays = plays.slice(plays.length - (plays.length + figures.length - before)).map(x => x.id);
            log.push({ E, ph: info().phase, n: plays.length + figures.length - before, plays: newPlays });
        }
    }
    const radios = plays.filter(x => /^radio-/.test(x.id)), chimes = plays.filter(x => x.id === 'chime');
    const rare = [...radios.map(x => x.t), ...figures.map(x => x.t)].sort((a, b) => a - b);
    const gaps = rare.slice(1).map((t, i) => t - rare[i]);
    check('rare events happen (radio and figures), each at most one at a time', radios.length >= 2 && figures.length >= 2 && log.every(l => l.n <= 1 || (l.n === 2 && l.plays.includes('chime'))));
    check('at least 150 s between two rare events (immersive)', gaps.length > 0 && gaps.every(g => g >= 150000));
    const sameGaps = (arr, cd) => arr.slice(1).every((t, i) => t - arr[i] >= cd);
    check('radio cooldown 120 s, figures 120 s / 180 s', sameGaps(radios.map(x => x.t), 120000) && sameGaps(figures.map(x => x.t), 120000));
    const order = ['radio-join', 'radio-spectate', 'radio-profile'];
    check('radio calls rotate and carry a story line', radios.slice(1).every((x, i) => order.indexOf(x.id) === (order.indexOf(radios[i].id) + 1) % 3) &&
        toasts.some(x => x.m === 'pkg.dlv3dir.radio1' && x.o && /lm-dl-toast/.test(x.o.toastClass)));
    /* 75 minutes from 3:02 into the cycle: 8 nights begin */
    check('nightfall: once per cycle, a quiet chime and a scenery note', chimes.length === 8 && toasts.filter(x => x.m === 'pkg.dlv3dir.nightfall').length === 8 &&
        sameGaps(chimes.map(x => x.t), 600000) && chimes.every(x => Math.abs(x.g - 0.24 * 0.38) < 1e-9));
    check('sounds: gameplay channel, gains inside 0..1 (suggested x kind), at most 2 elements', plays.every(x => x.ch === 'gameplay' && x.g > 0 && x.g <= 1) &&
        radios.every(x => Math.abs(x.g - { 'radio-join': 0.5, 'radio-spectate': 0.39, 'radio-profile': 0.87 }[x.id] * 0.32) < 1e-9) && audios.length <= 2);
    const kind = f => f.cls && f.cls.className || '';
    check('Reduced motion: only the slow watcher, then also the sudden shadow', calmFigures.length >= 1 && calmFigures.every(f => /lm-dl-watcher/.test(kind(f))) &&
        figures.slice(calmFigures.length).some(f => !/lm-dl-watcher/.test(kind(f)) && /lm-dl-ghost-[lr]/.test(kind(f))));
    ctx.matchMedia = q => ({ matches: /reduce/.test(q) });
    const nFig = figures.length;
    for (let i = 0; i < 1200; i++) { endSounds(); advance(1000); flushPics(true); }
    check('the system reduced motion: no figures', figures.length === nFig && radios.length > 0);
    delete ctx.matchMedia;
    check('a figure goes away after its time', !info().ghost || body.kids.length <= 1);
    body.appendChild = bodyAppend;

    /* ═══ hidden tab: paused, no catch-up ═══ */
    advance(3000);
    const cl = info().clock, ph = info().phase, nPlays = plays.length, nToasts = toasts.length;
    audios.forEach(a => { a.paused = false; });
    document.hidden = true; fireVis();
    check('hidden: no timer, sounds paused, clock stopped', timers.size === 0 && !info().running && audios.every(a => a.paused));
    T += 25 * 60000;
    document.hidden = false; fireVis();
    check('back: same clock and phase as when hidden', Math.abs(info().clock - cl) < 1 && info().phase === ph && timers.size === 1);
    advance(1000); flushPics(true); advance(1000);
    check('back: no burst of events', plays.length === nPlays && toasts.length === nToasts);

    /* ═══ death, spawn, replay, volume ═══ */
    plays.length = 0;
    ctx.LMEvents.emit('death', { scope: 'unit', unit: 0 });
    check('a multibox unit lost (no Game Over): no death signal', plays.length === 0);
    ctx.LMEvents.emit('death', { scope: 'all', unit: 0 });
    check('death: its signal once', plays.length === 1 && plays[0].id === 'death-1' && Math.abs(plays[0].g - 0.15 * 0.42) < 1e-9);
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('a second death within 10 s: no repeat', plays.length === 1);
    ctx.LMEvents.emit('spawn', {});
    check('a quick respawn stops it', audios.every(a => a.paused));
    advance(11000);
    ctx.legendmod._isReplay = true;
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('replay: no death signal', plays.length === 1);
    ctx.legendmod._isReplay = false;
    D.dyingLightVolume = 0.5;
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('its sound level halves the gain', plays.length === 2 && plays[1].id === 'death-2' && Math.abs(plays[1].g - 1 * 0.42 * 0.5) < 1e-9);
    D.dyingLightVolume = 0;
    advance(11000);
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('sound level 0: nothing played', plays.length === 2);
    D.dyingLightVolume = 1;
    ctx.LMEvents.emit('disconnect', { playing: false });
    ctx.LMEvents.emit('disconnect', { playing: true });
    check('a dropped connection while playing: signal lost once', plays.length === 3 && plays[2].id === 'signal-lost');

    /* ═══ a busy page: late ticks ═══ */
    advance(6000, 600);
    check('three late ticks: busy (no scares, scene kept)', info().busy === true);
    advance(12000);
    check('ten on time: not busy', info().busy === false);

    /* ═══ competitive: fixed scene, no surprises ═══ */
    L.setIntensity('competitive');
    plays.length = 0; toasts.length = 0;
    const kids = body.kids.length;
    advance(1000);
    check('competitive: the fixed scene', L.getBackground() === fixed);
    advance(20 * 60000);
    check('competitive: no rare events or nightfall in 20 min', plays.length === 0 && toasts.length === 0 && body.kids.length === kids);
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('competitive: the death signal stays', plays.length === 1);
    L.setIntensity('immersive');
    D.dyingLightCycle = false;
    advance(1000);
    check('day and night off: the fixed scene', L.getBackground() === fixed);
    D.dyingLightCycle = true;

    /* ═══ teardown ═══ */
    advance(1000);
    const late = pics.slice();
    await L.disable();
    check('off: no timer, no listener, no style, no figure', timers.size === 0 && docCount() === lsBefore &&
        ['death', 'spawn', 'disconnect', 'serverChange'].filter(n => ctx.LMEvents._has(n)).length === eventsBefore &&
        !head.kids.some(n => n.id === 'lm-dl-director-style') && body.kids.length === 0 && info().on === false && info().listeners === 0);
    check('off: sounds stopped and let go', info().sounds === 0 && audios.every(a => a.paused && a.src === undefined));
    check('off: the player\'s theme painted again, no background', painted[painted.length - 1] === ctx.defaultSettings && L.getBackground() === null);
    late.forEach(im => { im.naturalWidth = 64; im.onload && im.onload(); });
    plays.length = 0;
    ctx.LMEvents.emit('death', { scope: 'all' });
    advance(60000);
    check('off: a late picture or event does nothing', L.getBackground() === null && plays.length === 0 && timers.size === 0);

    /* on / off / on: nothing grows */
    for (let i = 0; i < 3; i++) { p = L.enable(); flushPics(true); await p; await L.disable(); }
    p = L.enable(); flushPics(true); await p;
    check('on again after toggles: one timer, the same listeners', timers.size === 1 && info().listeners === 5 && head.kids.filter(n => n.id === 'lm-dl-director-style').length === 1);
    await L.disable();
    check('off again: nothing left', timers.size === 0 && docCount() === lsBefore && info().listeners === 0);

    /* ═══ theme override (ogario.v4.js) ═══ */
    painted.length = 0;
    check('theme: only colours of the known keys, one owner at a time', ctx.lmThemeOverride('a', { menuMainColor: 'url(x)', menuBg: '#000' }) === false &&
        ctx.lmThemeOverride('a', { menuMainColor: '#123' }) === true && ctx.lmThemeOverride('b', { menuMainColor: '#456' }) === false &&
        ctx.lmThemeOverride('b', null) === false && ctx.lmThemeEffective().menuMainColor === '#123' && ctx.defaultSettings.menuMainColor === '#01d9cc');
    ctx.defaultSettings.menuPanelColor = '#222';
    check('theme: a change to the player\'s theme while overridden shows when cleared', ctx.lmThemeEffective().menuPanelColor === '#222' &&
        ctx.lmThemeOverride('a', null) === true && ctx.lmThemeEffective() === ctx.defaultSettings && painted.length === 2);

    if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
    console.log('all Dying Light director checks passed');
})().catch(e => { console.log('FAIL threw: ' + (e && e.stack)); process.exit(1); });
