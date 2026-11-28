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
const check = (n, c, why) => { console.log((c ? "ok   " : "FAIL ") + n + (c || why === undefined ? "" : " (" + why + ")")); if (!c) fail++; };

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
const plays = [], toasts = [], warns = [], cleared = [];
/* the sounds playing come to their end */
const endSounds = () => audios.forEach(a => { a.paused = true; });
const ctx = {
    document, Image: Img, Audio: Aud, console: { warn: (m, e) => warns.push(m + ' ' + (e && e.message)), log() { } }, Promise, Object, JSON, Array, String, Number, Error, Map,
    setTimeout: setTimeout_, clearTimeout: clearTimeout_, performance: { now: () => T },
    /* the mixer: Gameplay channel x master x the sound's gain, as ogario/modules/notifications.js */
    LMNotifications: {
        soundVolume: ch => ch === 'gameplay' ? ctx.defaultmapsettings.volGameplay * ctx.defaultmapsettings.volMaster : 1,
        play: (a, ch, g) => { plays.push({ t: T, id: /([\w-]+)\.mp3$/.exec(a.src)[1], ch, g }); a.volume = ctx.LMNotifications.soundVolume(ch) * g; a.play(); }
    },
    /* a toast is a jQuery set of one element on the page; clear(toast, opts) records what goes */
    toastr: { info: (m, t, o) => { toasts.push({ t: T, m, o }); const j = [{ parentNode: body }]; return j; }, warning() { }, clear: (el, o) => { cleared.push({ el, o }); } },
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
    check('on: the director runs with one timer (and the threat look its own)', L.isEnabled() && info().running && timers.size === 2 && info().listeners === 6 &&
        info().threat.timer && info().threat.listeners === 6);
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
    check('back: same clock and phase as when hidden', Math.abs(info().clock - cl) < 1 && info().phase === ph && timers.size === 2);
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
    ctx.LMPractice = { on: true };
    ctx.LMEvents.emit('death', { scope: 'all' });
    ctx.LMEvents.emit('disconnect', { playing: true });
    check('practice arena: no death or signal-lost sound', plays.length === 1);
    ctx.LMPractice = { on: false };
    ctx._lmEvReplayOn = true;
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('Replay Studio replay: no death sound', plays.length === 1);
    ctx._lmEvReplayOn = false;
    D.dyingLightVolume = 0.5;
    ctx.LMEvents.emit('death', { scope: 'all' });
    check('its sound level halves the gain', plays.length === 2 && plays[1].id === 'death-2' && Math.abs(plays[1].g - 1 * 0.42 * 0.5) < 1e-9);
    {
        /* a volume change while it plays: the sound goes on at the new volume (no restart) */
        const a = audios.find(x => !x.paused), v0 = a && a.volume;
        const set = (k, v) => { D[k] = v; ctx.LMEvents.emit('settingsChange', { key: k, value: v }); };
        set('volGameplay', 0.5);
        const v1 = a.volume;
        set('dyingLightVolume', 1);
        const v2 = a.volume;
        set('volMaster', 0);
        const v3 = a.volume;
        set('volMaster', 1); set('volGameplay', 1); set('dyingLightVolume', 0.5);
        check('volume: a playing sound follows the Gameplay, master and Dying Light levels live', a && Math.abs(v0 - 0.21) < 1e-9 &&
            Math.abs(v1 - 0.105) < 1e-9 && Math.abs(v2 - 0.21) < 1e-9 && v3 === 0 && Math.abs(a.volume - 0.21) < 1e-9 && !a.paused &&
            plays.length === 2, [v0, v1, v2, v3, a && a.volume].join());
        a.paused = true;
        set('volGameplay', 0.2);
        check('volume: a sound that ended is left alone', Math.abs(a.volume - 0.21) < 1e-9);
        set('volGameplay', 1);
    }
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

    /* ═══ Stream mode: no figures and no story lines (the sounds stay) ═══ */
    D.streamMode = true;
    plays.length = 0; toasts.length = 0;
    {
        const n0 = body.kids.length;
        let added = 0;
        const bodyAppend = body.appendChild.bind(body);
        body.appendChild = n => { added++; return bodyAppend(n); };
        /* each sound comes to its end before the next roll */
        for (let i = 0; i < 180; i++) { endSounds(); advance(10000); }
        body.appendChild = bodyAppend;
        check('Stream mode: no figure or toast in 30 min, the radio still heard', added === 0 && toasts.length === 0 && body.kids.length === n0 && plays.some(p => /^radio-/.test(p.id)));
    }
    D.streamMode = false;

    /* ═══ the light of the hour: gradual, darker towards deep night, the background's only ═══ */
    {
        /* a fresh activation (the scenes failed above are not asked again in that one) */
        await L.disable(); p = L.enable(); flushPics(true); await p;
        const samples = [];
        for (let i = 0; i < 600; i++) {
            endSounds(); advance(1000); flushPics(true);
            const b = L.getBackground();
            if (b && b.grade !== undefined) samples.push({ ph: info().phase, a: b.gradeA, g: b.grade, b });
        }
        const avg = ph => { const s = samples.filter(x => x.ph === ph); return s.reduce((n, x) => n + x.a, 0) / (s.length || 1); };
        const steps = samples.slice(1).map((x, i) => Math.abs(x.a - samples[i].a));
        check('light: a whole cycle of scenes with their light', samples.length >= 590 && ['day', 'dusk', 'night', 'deepNight', 'dawn'].every(ph => samples.some(x => x.ph === ph)));
        check('light: gradual (at most 0.015 a second), never more than half dark', Math.max(...steps) <= 0.015 && samples.every(x => x.a >= 0 && x.a <= 0.5));
        check('light: darker from day to dusk to night to deep night, dawn lifts it', avg('day') < avg('dusk') && avg('dusk') < avg('night') && avg('night') < avg('deepNight') &&
            avg('dawn') < avg('deepNight') && samples.filter(x => x.ph === 'night').some(x => x.a > samples.find(y => y.ph === 'night').a + 0.05));
        check('light: a colour with it, a new look only when it changed (one a second at most)', samples.every(x => x.a === 0 ? x.g === null : /^rgb\(\d+,\d+,\d+\)$/.test(x.g)) &&
            L.getBackground() === L.getBackground() && Object.isFrozen(L.getBackground()));
        L.setIntensity('competitive');
        advance(1000);
        check('light: none on the fixed scene (Competitive)', /back0-1920.webp$/.test(L.getBackground().url) && !L.getBackground().grade);
        L.setIntensity('immersive');
        advance(1000); flushPics(true); advance(1000);
    }

    /* ═══ the figures: drawn silhouettes, placed clear of the HUD, in the scene's layer ═══ */
    {
        const layer = { kids: [], insertBefore(n, ref) { n.parentNode = this; const i = this.kids.indexOf(ref); this.kids.splice(i < 0 ? this.kids.length : i, 0, n); return n; },
            removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; } };
        const bgc = { style: { zIndex: '3' }, parentNode: layer, get nextSibling() { return layer.kids[layer.kids.indexOf(this) + 1] || null; } }, grid = { style: { zIndex: '4' } };
        layer.kids.push(bgc, grid);
        ctx.drawRender = { backgroundCanvas: bgc };
        ctx.innerWidth = 1000; ctx.innerHeight = 600;
        /* the minimap at the bottom right, the chat at the bottom left, the leaderboard top right */
        const hud = { 'minimap-hud': { left: 800, right: 1000, top: 400, bottom: 600 }, 'chat-box': { left: 0, right: 300, top: 380, bottom: 600 },
            'leaderboard-hud': { left: 820, right: 1000, top: 0, bottom: 260 } };
        document.getElementById = id => hud[id] ? { getBoundingClientRect: () => Object.assign({ width: 1, height: 1 }, hud[id]) } : null;
        const got = [];
        const ins = layer.insertBefore.bind(layer);
        layer.insertBefore = (n, ref) => { got.push({ n, after: layer.kids[layer.kids.indexOf(ref) - 1] }); return ins(n, ref); };
        D.reducedMotion = false;
        for (let i = 0; i < 3600 && got.length < 6; i++) { endSounds(); advance(1000); flushPics(true); }
        const css = (head.kids.find(n => n.id === 'lm-dl-director-style') || {}).textContent || '';
        const box = n => { const w = /lm-dl-watcher/.test(n.className), top = parseInt(n.style.top, 10), h = w ? 102 : 204, ww = w ? 46.2 : 122.4;
            const x0 = /ghost-l/.test(n.className) ? (w ? 30 : 0) : 1000 - (w ? 30 + ww : ww * 0.8); return { x0, x1: x0 + ww, y0: top, y1: top + h }; };
        const hits = got.filter(g => { const b = box(g.n); return Object.values(hud).some(r => r.left < b.x1 && r.right > b.x0 && r.top < b.y1 && r.bottom > b.y0); });
        check('figures: drawn silhouettes (SVG made here), no zombie skin picture, no filter', got.length >= 2 &&
            got.every(g => /^url\("data:image\/svg\+xml,/.test(g.n.style.backgroundImage) && !/webp|png/.test(g.n.style.backgroundImage)) && !/filter:/.test(css));
        check('figures: both kinds, each moving its own way (lurker leans in from its side, watcher breathes)', got.some(g => /lm-dl-watcher/.test(g.n.className)) &&
            got.some(g => !/lm-dl-watcher/.test(g.n.className)) && /@keyframes lm-dl-pass-l/.test(css) && /@keyframes lm-dl-pass-r/.test(css) && /@keyframes lm-dl-watch/.test(css));
        check('figures: sized for phones too (at most 34 % of the short side, 240 px)', /height:min\(34vmin,240px\)/.test(css) && /height:min\(17vmin,120px\)/.test(css));
        check('figures: placed clear of the HUD parts on the screen', got.every(g => /^\d+px$/.test(g.n.style.top)) && hits.length === 0);
        check('figures: in the scene\'s layer, right above the map background canvas (under the grid and the cells), no clicks',
            got.every(g => g.after === bgc && g.n.style.zIndex === '3') && /pointer-events:none/.test(css) && got.every(g => g.n.attrs['aria-hidden'] === 'true'));
        /* Legend's Reduced motion: only a fade */
        D.reducedMotion = true;
        const n1 = got.length;
        for (let i = 0; i < 3600 && got.length < n1 + 1; i++) { endSounds(); advance(1000); flushPics(true); }
        check('Reduced motion: the watcher only fades (no movement)', got.length > n1 && got.slice(n1).every(g => /lm-dl-calm/.test(g.n.className) && /lm-dl-watcher/.test(g.n.className)) &&
            /\.lm-dl-ghost\.lm-dl-calm\{animation-name:lm-dl-fade\}/.test(css) && !/@keyframes lm-dl-fade\{[^}]*transform/.test(css));
        /* the whole side covered: no figure at all */
        hud['chat-box'] = { left: 0, right: 1000, top: 0, bottom: 600 };
        const n2 = got.length;
        for (let i = 0; i < 1800; i++) { endSounds(); advance(1000); flushPics(true); }
        check('no free place: no figure', got.length === n2);
        layer.insertBefore = ins;
        document.getElementById = () => null;
        delete ctx.drawRender; delete ctx.innerWidth; delete ctx.innerHeight;
        D.reducedMotion = true;
        advance(5000);
    }

    /* ═══ the threat look: compareCells' level, 4 Hz, up after 250 ms, down after 1.5 s ═══ */
    {
        let snap = null;
        ctx.lmDlThreat = () => snap;
        const thr = () => info().threat;
        const vig = () => body.kids.find(n => n.className === 'lm-dl-threat');
        /* a fresh level from the frames before each tick */
        const run = (ms, level, unit, valid) => { for (let e = 0; e < ms; e += 250) { snap = { t: T, unit: unit || 0, level, valid: valid !== false }; advance(250); } };
        check('threat: asked while on (Immersive)', thr().asked && L.needsThreatData() === true && !thr().shown);
        run(250, 2);
        check('threat: not shown before it held 250 ms', thr().level === 0 && !vig());
        run(250, 2);
        const v = vig();
        check('threat: shown after 250 ms, decorative (no clicks, under the HUD)', thr().level === 2 && v && v.style.opacity === '0.85' &&
            /pointer-events:none/.test(v.style.cssText) && /z-index:1;/.test(v.style.cssText) && v.attrs['aria-hidden'] === 'true');
        run(500, 0); run(500, 2);
        check('threat: a short gap keeps it (hysteresis)', thr().level === 2);
        run(1250, 0);
        check('threat: still shown 1.25 s after the danger', thr().level === 2);
        run(500, 0);
        check('threat: gone 1.5 s after the danger', thr().level === 0 && v.style.opacity === '0');
        run(500, 1);
        check('threat: a bigger player near is level 1', thr().level === 1 && v.style.opacity === '0.45');
        snap = { t: T - 5000, unit: 0, level: 2, valid: true };
        advance(2000);
        check('threat: the level of an old frame is not used', thr().level === 0);
        run(2000, 2, 0, false);
        check('threat: not valid (spectating, menu) shows nothing', thr().level === 0);
        run(500, 2);
        ctx.LMEvents.emit('death', { scope: 'all' });
        check('threat: a death resets it at once', thr().level === 0 && v.style.opacity === '0' && v.style.transition === 'none');
        run(500, 2);
        run(250, 2, 4);
        check('threat: another player to control starts from zero', thr().level === 0);
        run(250, 2, 4);
        check('...and shows its own level after 250 ms', thr().level === 2);
        ['spawn', 'serverChange', 'multiboxSwap', 'disconnect'].forEach(n => { run(500, 2, 4); ctx.LMEvents.emit(n, {}); check('threat: reset by ' + n, thr().level === 0); });
        run(500, 2, 4);
        const shownBefore = thr().level;
        L.setIntensity('competitive');
        check('threat: Competitive: its timer stops at once and the look goes', shownBefore === 2 && !thr().timer && thr().level === 0 && timers.size === 1);
        run(1000, 2, 4);
        check('threat: not in Competitive (not asked, no timer)', thr().level === 0 && L.needsThreatData() === false && !thr().timer);
        L.setIntensity('immersive');
        check('threat: back to Immersive: its timer again at once', thr().timer && timers.size === 2);
        D.dyingLightIntensity = 'competitive'; ctx.LMEvents.emit('settingsChange', { key: 'dyingLightIntensity', value: 'competitive' });
        check('threat: the intensity setting changed to Competitive: no timer', !thr().timer && L.intensity() === 'competitive');
        D.dyingLightIntensity = 'immersive'; ctx.LMEvents.emit('settingsChange', { key: 'dyingLightIntensity', value: 'immersive' });
        check('...and back: its timer', thr().timer);
        L.setEffect('threat', false);
        check('threat: suppressed: no timer', !thr().timer);
        run(1000, 2, 4);
        check('threat: suppressed on its own', thr().level === 0 && L.needsThreatData() === false);
        L.setEffect('threat', true);
        check('threat: allowed again: its timer', thr().timer);
        /* a busy page (the director's late ticks): the level is not asked for, the look fades */
        run(500, 2, 4);
        advance(6000, 600);
        check('threat: a busy page: not asked (no threat work in the frames)', info().busy === true && L.needsThreatData() === false && thr().timer);
        run(2000, 2, 4);
        check('...the look gone meanwhile', thr().level === 0);
        run(12000, 2, 4);
        check('...asked again once the page is not busy', info().busy === false && L.needsThreatData() === true && thr().level === 2);
        run(2000, 0, 4);
        ctx._lmEvReplayOn = true;
        run(1000, 2, 4);
        check('threat: nothing in a replay', thr().level === 0 && L.needsThreatData() === false);
        ctx._lmEvReplayOn = false;
        run(500, 2, 4);
        document.hidden = true; fireVis();
        check('threat: a hidden tab stops it (no timer, nothing shown)', thr().level === 0 && !thr().timer);
        document.hidden = false; fireVis();
        check('threat: back, its timer again', thr().timer);
        run(500, 2, 4);
        check('threat: shown again before the turn-off', thr().level === 2 && !!vig());
        delete ctx.lmDlThreat;
    }

    /* ═══ teardown ═══ */
    advance(1000);
    const late = pics.slice();
    /* its own toasts still on the page (the last few); one that went by itself is not kept */
    toasts.length = 0; cleared.length = 0;
    const ownToasts = info().toasts;
    await L.disable();
    check('off: only its own toasts are dismissed (each with force, never a clear of all)', ownToasts >= 1 && ownToasts <= 4 && cleared.length === ownToasts &&
        cleared.every(c => Array.isArray(c.el) && c.el.length === 1 && c.o && c.o.force === true) && info().toasts === 0);
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
    check('on again after toggles: one timer (and one of the threat look), the same listeners', timers.size === 2 && info().listeners === 6 && info().threat.listeners === 6 && head.kids.filter(n => n.id === 'lm-dl-director-style').length === 1);
    await L.disable();
    check('off again: nothing left', timers.size === 0 && docCount() === lsBefore && info().listeners === 0);

    /* ═══ the players' lifecycle (lmMbPlayerEvent, lmMbAlive, lmMbUnits of the core) ═══ */
    {
        const unit = { player: true, active: false };
        ctx.lmMbPlayerEvent = () => { };
        ctx.lmMbAlive = q => q === ctx.legendmod ? !!q.play : !!q && q.player === true && q.active === true;
        ctx.lmMbUnits = out => { out.length = 0; out.push(unit); return out; };
        D.dyingLightIntensity = 'immersive'; L.setIntensity('immersive');
        p = L.enable(); flushPics(true); await p;
        const E = ctx.LMEvents;
        check('lifecycle: listens to playerDied / playerSpawned, not death / spawn', info().listeners === 6 && E._has('playerDied') && E._has('playerSpawned'));
        const rWas = ctx.__r;
        ctx.__r = () => 0; plays.length = 0; toasts.length = 0;
        ctx.legendmod.play = false;
        advance(31000);
        check('lifecycle: nobody of yours alive: no rare event', plays.length === 0);
        unit.active = true;
        advance(25000);
        check('lifecycle: the main player dead, a multibox unit alive: the game goes on, the radio comes', plays.length === 1 && /^radio-/.test(plays[0].id));
        plays.length = 0;
        E.emit('playerDied', { scope: 'unit', role: 'unit', living: 1 });
        check('lifecycle: a player lost while another lives: no death signal', plays.length === 0);
        unit.active = false;
        E.emit('playerDied', { scope: 'all', role: 'unit', living: 0 });
        check('lifecycle: the last of your players (the main player died first): the death signal', plays.length === 1 && /^death-/.test(plays[0].id));
        advance(11000);
        ctx.legendmod.play = false;
        E.emit('death', { scope: 'all', unit: 0 });
        E.emit('playerDied', { scope: 'all', role: 'main', living: 0 });
        check('lifecycle: the main player last: one death signal (death and playerDied together)', plays.length === 2);
        const mine = audios.filter(a => a.src);
        mine.forEach(a => { a.paused = false; });
        E.emit('playerSpawned', { role: 'unit', living: 2, active: false });
        check('lifecycle: another unit spawning while one lives: the sound goes on', mine.length > 0 && mine.every(a => !a.paused));
        E.emit('playerSpawned', { role: 'unit', living: 1, active: true });
        check('lifecycle: the first of your players alive again: the sound stops (a new game)', mine.every(a => a.paused));
        await L.disable();
        check('lifecycle: off: no listener left', info().listeners === 0 && !E._has('playerDied') && !E._has('playerSpawned') && timers.size === 0);
        ctx.legendmod.play = true;
        delete ctx.lmMbPlayerEvent; delete ctx.lmMbAlive; delete ctx.lmMbUnits;
        ctx.__r = rWas;
    }
    /* Competitive from the start: the threat look's timer never runs */
    L.setIntensity('competitive');
    p = L.enable(); flushPics(true); await p;
    check('Competitive from the start: no threat timer (only the director\'s)', !info().threat.timer && timers.size === 1);
    L.setIntensity('immersive');
    check('...Immersive: its timer', info().threat.timer && timers.size === 2);
    await L.disable();

    /* ═══ made sounds (Web Audio): ambience by phase, heartbeat, live volume, rests, teardown ═══ */
    {
        const acs = [];
        const prm = v => ({ value: v, ev: [], setValueAtTime(x, t) { this.ev.push(['set', x, t]); this.value = x; }, linearRampToValueAtTime(x, t) { this.ev.push(['lin', x, t]); },
            /* as the browsers: these throw on values they cannot take */
            exponentialRampToValueAtTime(x, t) { if (!(x > 0) || !(t >= 0)) throw new RangeError('exp ' + x); this.ev.push(['exp', x, t]); },
            setTargetAtTime(x, t, c) { if (!(c > 0) || !(t >= 0) || x !== x) throw new RangeError('tgt'); this.ev.push(['tgt', x, t, c]); this.target = x; }, cancelScheduledValues(t) { this.ev.push(['cancel', t]); } });
        class FakeAC {
            constructor() { this.state = 'running'; this.sampleRate = 8000; this._acc = 0; this._t0 = T; this.nodes = []; this.destination = this.node('dest'); acs.push(this); }
            get currentTime() { return (this._acc + (this.state === 'running' ? T - this._t0 : 0)) / 1000; }
            node(kind, extra) {
                const ac = this, n = Object.assign({ kind, to: [], connect(d) { this.to.push(d); return d; }, disconnect() { this.to = []; this.off = true; } }, extra || {});
                ac.nodes.push(n);
                return n;
            }
            src(kind, extra) {
                const ac = this;
                return this.node(kind, Object.assign({ start(t) { if (this.at != null || !(t >= 0)) throw new Error('start'); this.at = t; },
                    stop(t) { if (this.at == null || !(t >= 0)) throw new Error('stop'); this.end = t; } }, extra));
            }
            createGain() { return this.node('gain', { gain: prm(1) }); }
            createBiquadFilter() { return this.node('filter', { type: 'lowpass', frequency: prm(350), Q: prm(1) }); }
            createOscillator() { return this.src('osc', { type: 'sine', frequency: prm(440) }); }
            createBufferSource() { return this.src('buf', { buffer: null, loop: false }); }
            createDelay() { return this.node('delay', { delayTime: prm(0) }); }
            createStereoPanner() { return this.node('pan', { pan: prm(0) }); }
            createBuffer(ch, n) { const d = new Float32Array(n); return { getChannelData: () => d, length: n }; }
            suspend() { if (this.state === 'running') { this._acc += T - this._t0; this.state = 'suspended'; } return Promise.resolve(); }
            resume() { if (this.state === 'suspended') { this._t0 = T; this.state = 'running'; } return Promise.resolve(); }
            close() { if (this.state === 'running') this._acc += T - this._t0; this.state = 'closed'; return Promise.resolve(); }
        }
        const A = () => info().audio, ac0 = () => acs[acs.length - 1];
        const outOf = ac => ac.nodes.find(n => n.kind === 'gain' && n.to.includes(ac.destination));
        /* the sources of the bed sounding now (started, not given an end) */
        const bedSrcs = ac => ac.nodes.filter(n => (n.kind === 'buf' || (n.kind === 'osc' && n.type !== 'triangle')) && n.at != null && n.end == null);
        ctx.AudioContext = FakeAC;
        ctx.navigator = { userActivation: { hasBeenActive: false } };
        p = L.enable(); flushPics(true); await p;
        advance(3000);
        check('made sounds: no context before the page was touched (the browser would keep it silent)', acs.length === 0 && A().ctx === null);
        ctx.navigator.userActivation.hasBeenActive = true;
        advance(1000);
        const c = ac0(), out = outOf(c);
        check('ambience: one context, the phase\'s bed fading in over 4 s through one output at the mixer\'s Gameplay volume x Dying Light level',
            acs.length === 1 && A().ctx === 'running' && A().bed === 'day' && out && out.gain.target === 1 &&
            c.nodes.some(n => n.kind === 'gain' && n.to.includes(out) && n.gain.ev.some(e => e[0] === 'lin' && Math.abs(e[1] - 0.12) < 1e-9 && Math.abs(e[2] - c.currentTime - 4) < 1.01)));
        const daySrcs = bedSrcs(c).length;
        {
            const set = (k, v) => { D[k] = v; ctx.LMEvents.emit('settingsChange', { key: k, value: v }); };
            set('volGameplay', 0.5);
            const g1 = out.gain.target;
            set('dyingLightVolume', 0.4);
            const g2 = out.gain.target;
            set('volMaster', 0.5);
            const g3 = out.gain.target;
            set('volMaster', 1); set('volGameplay', 1); set('dyingLightVolume', 1);
            check('ambience: the output follows Gameplay, Dying Light level and master at once', g1 === 0.5 && Math.abs(g2 - 0.2) < 1e-9 && Math.abs(g3 - 0.1) < 1e-9 && out.gain.target === 1);
            const nev = out.gain.ev.length;
            advance(10000);
            check('ambience: an unchanged volume is not handed to the audio clock every tick', out.gain.ev.length === nev);
            set('volGameplay', 0);
            advance(1000);
            check('volume 0: the context rests, nothing sounds', c.state === 'suspended' && A().bed === null && bedSrcs(c).length === 0);
            set('volGameplay', 1);
            advance(1000);
            check('volume back: the bed again', c.state === 'running' && A().bed === 'day');
        }
        /* the next phase: cross-faded, the old bed let go once silent */
        advance(180000 - info().clock % 600000);
        advance(1000);
        const fadingAt = A().fading;
        const old = c.nodes.filter(n => n.kind === 'buf' && n.at != null && n.end != null && n.end > c.currentTime);
        check('ambience: dusk cross-fades from day (no cut: the old bed fades for 4 s)', A().bed === 'dusk' && fadingAt === 1 && old.length >= 1 &&
            old.every(n => n.end - c.currentTime > 3 && n.end - c.currentTime < 5.2));
        advance(6000);
        check('ambience: the faded bed is let go', A().fading === 0);
        advance(240000 - info().clock % 600000 + 1000);
        check('ambience: the night has its own bed (a drone under the wind)', A().bed === 'night' && bedSrcs(c).length > daySrcs);

        /* the heartbeat from the threat level */
        let snap = null;
        ctx.lmDlThreat = () => snap;
        const run = (ms, level) => { const out = []; for (let e = 0; e < ms; e += 250) { snap = { t: T, unit: 0, level, valid: true }; advance(250); if (e % 1000 === 750) out.push(A().heart); } return out; };
        run(5000, 0);
        check('heartbeat: silent without a threat', A().heart.beats === 0 && A().heart.level === 0);
        let tr = run(10000, 1);
        const b1 = A().heart.beats;
        run(20000, 1);
        const rate1 = (A().heart.beats - b1) / 20 * 60;
        check('heartbeat: a bigger player near: about 82 BPM, quiet', A().heart.level === 1 && A().heart.bpm >= 75 && A().heart.bpm <= 90 &&
            rate1 >= 72 && rate1 <= 92 && A().heart.vol > 0.09 && A().heart.vol <= 0.3, rate1);
        tr = run(10000, 2);
        const steps = tr.slice(1).map((h, i) => Math.abs(h.bpm - tr[i].bpm));
        const b2 = A().heart.beats;
        run(20000, 2);
        const rate2 = (A().heart.beats - b2) / 20 * 60;
        check('heartbeat: one can split onto you: about 124 BPM, the tempo glides there (no jump, no restart)', A().heart.bpm >= 110 && A().heart.bpm <= 135 &&
            rate2 >= 108 && rate2 <= 137 && steps.every(x => x <= 10) && tr[0].bpm < 100 && A().heart.vol > 0.16 && A().heart.vol <= 0.3, rate2 + ' ' + steps.join());
        /* the threat look falls after 1.5 s, the heartbeat fades for 2.5 s more */
        run(5000, 0);
        const b3 = A().heart.beats;
        run(8000, 0);
        check('heartbeat: the danger gone: fades out, then nothing is scheduled', A().heart.level === 0 && A().heart.vol === 0 && A().heart.beats === b3);
        run(3000, 2);
        const lvlBefore = A().heart.level;
        snap = null;
        ctx.LMEvents.emit('death', { scope: 'all' });
        const b4 = A().heart.beats;
        advance(3000);
        check('heartbeat: a death ends it at once', lvlBefore === 2 && A().heart.level === 0 && A().heart.beats === b4);
        L.setEffect('threat', false);
        run(4000, 2);
        check('heartbeat: off with the threat look', A().heart.beats === b4 && A().heart.level === 0);
        L.setEffect('threat', true);
        run(3000, 0);

        /* rests: hidden tab, replay, Competitive */
        document.hidden = true; fireVis();
        check('hidden: the context rests (no audio work), the bed ends', c.state === 'suspended' && A().bed === null);
        T += 60000;
        document.hidden = false; fireVis();
        advance(1000);
        check('back: the bed of the phase again, fading in', c.state === 'running' && /night/.test(A().bed));
        ctx._lmEvReplayOn = true;
        advance(1000);
        check('replay: silent', c.state === 'suspended' && A().bed === null);
        ctx._lmEvReplayOn = false;
        advance(1000);
        L.setIntensity('nightmare');
        advance(1000);
        check('Nightmare: a richer bed (whine and whispers on top)', /\+$/.test(A().bed) && bedSrcs(c).length > daySrcs + 4);
        L.setIntensity('competitive');
        advance(1000);
        check('Competitive: no ambience or heartbeat (the context rests)', c.state === 'suspended' && A().bed === null);
        L.setIntensity('immersive');
        advance(1000);

        /* the made event sounds: kinds by intensity, cooldowns and the gap between any two, suppressed */
        {
            let seed = 11;
            ctx.__r = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
            let figs = 0;
            const bodyAppend = body.appendChild.bind(body);
            body.appendChild = n => { figs++; return bodyAppend(n); };
            const made = () => Object.entries(A().events).reduce((n, [k, v]) => n + (k === 'radioStatic' ? 0 : v), 0);
            const radios = () => plays.filter(x => /^radio-/.test(x.id)).length;
            const total = () => made() + radios() + figs;
            /* secs of play; the times (director clock) of every rare event */
            const sim = (secs, lateBy) => { const at = []; let n = total(); for (let i = 0; i < secs; i++) { endSounds(); advance(1000, lateBy); flushPics(true); const m = total(); if (m > n) at.push(info().clock); n = m; } return at; };
            const gapsOk = (at, g) => at.slice(1).every((t, i) => t - at[i] >= g);
            const ev0 = Object.assign({}, A().events), r0 = radios();
            const atI = sim(90 * 60);
            const evI = A().events;
            const kindsI = Object.keys(evI).filter(k => k !== 'radioStatic');
            check('events (Immersive): distant screams, growls, footsteps and static among the radio calls and figures, never two at once',
                kindsI.length >= 3 && kindsI.every(k => ['scream', 'growl', 'footsteps', 'static'].includes(k)) && atI.length >= 10 && gapsOk(atI, 150000), JSON.stringify(evI) + ' ' + atI.length);
            check('events: a radio call comes through a moment of static', (evI.radioStatic || 0) - (ev0.radioStatic || 0) === radios() - r0 && radios() > r0);
            L.setIntensity('nightmare');
            advance(1000);
            const before = Object.assign({}, A().events);
            const atN = sim(90 * 60);
            const evN = A().events, kindsN = Object.keys(evN).filter(k => k !== 'radioStatic' && evN[k] > (before[k] || 0));
            check('events (Nightmare): richer, not only more often: breathing and impacts too, more kinds, the 75 s gap kept',
                kindsN.length >= 5 && (kindsN.includes('breathing') || kindsN.includes('impact')) && atN.length > atI.length && gapsOk(atN, 75000), JSON.stringify(evN) + ' ' + atN.length);
            /* suppressed */
            {
                D.dyingLightScares = false;
                const b = Object.assign({}, A().events);
                sim(60 * 60);
                const grew = Object.keys(A().events).filter(k => A().events[k] > (b[k] || 0));
                D.dyingLightScares = true;
                check('events: the Scares switch off silences the startling ones (scream, growl, impact), the others stay',
                    grew.length >= 2 && grew.every(k => ['footsteps', 'static', 'breathing', 'radioStatic'].includes(k)), grew.join());
            }
            document.activeElement = { tagName: 'INPUT' };
            let m0 = total();
            sim(20 * 60);
            check('events: none while typing', total() === m0);
            document.activeElement = null;
            ctx.matchMedia = q => ({ matches: /reduce/.test(q) });
            m0 = made();
            sim(20 * 60);
            check('events: no made sound with the system\'s reduced motion', made() === m0);
            delete ctx.matchMedia;
            m0 = made();
            sim(20 * 60, 600);
            check('events: no made sound on a busy page', info().busy === true && made() === m0);
            sim(15);
            m0 = made();
            ctx._lmEvReplayOn = true;
            sim(10 * 60);
            check('events: none in a replay', made() === m0);
            ctx._lmEvReplayOn = false;
            /* a respawn cuts the one playing */
            let got = false;
            for (let i = 0; i < 3600 && !got; i++) { endSounds(); advance(1000); got = A().fx; }
            const bus = got && c.nodes.filter(n => n.kind === 'gain' && n.to.includes(out)).pop();
            ctx.LMEvents.emit('spawn', {});
            check('events: a spawn cuts the sound playing (faded at once, let go)', got && !A().fx && bus && bus.gain.target === 0);
            advance(2000);
            check('...its bus let go', bus.off === true);
            body.appendChild = bodyAppend;
            L.setIntensity('immersive');
            advance(1000);
        }

        check('made sounds: none of them failed (the fake throws where the browsers do)', !warns.some(w => /\] (audio|sound|director)/.test(w)), warns.join('; '));
        await L.disable();
        check('off: the context closed and let go', c.state === 'closed' && A().ctx === null && A().bed === null);
        L.setIntensity('competitive');
        p = L.enable(); flushPics(true); await p;
        advance(5000);
        check('Competitive from the start: no context made', acs.length === 1);
        await L.disable();
        L.setIntensity('immersive');
        for (let i = 0; i < 3; i++) { p = L.enable(); flushPics(true); await p; advance(2000); await L.disable(); }
        check('on / off: one context per activation, every one closed', acs.length === 4 && acs.every(a => a.state === 'closed'));
        delete ctx.lmDlThreat;
        delete ctx.AudioContext;
        delete ctx.navigator;
    }
    /* a scene that never comes: skipped after 8 s like a failed one, by the tick (no timer of its own) */
    p = L.enable(); flushPics(true); await p;
    advance(1000);
    const stalled = pics.slice();
    advance(5000);
    const waiting = info().loading !== null && timers.size === 2;
    advance(4000);
    check('a stalled scene: skipped after 8 s, not asked again, the fixed scene stays, no extra timer', stalled.length === 1 && waiting && info().loading === null &&
        pics.length === 1 && info().scene === null && /back0-1920\.webp$/.test(L.getBackground().url) && timers.size === 2 && stalled[0].onload === null);
    advance(5000);
    check('...and not loaded again this activation', pics.length === 1);
    pics.length = 0;
    await L.disable();

    /* ═══ theme override (ogario.v4.js) ═══ */
    painted.length = 0;
    check('theme: only colours of the known keys, one owner at a time', ctx.lmThemeOverride('a', { menuMainColor: 'url(x)', menuBg: '#000' }) === false &&
        ctx.lmThemeOverride('a', { menuMainColor: '#123' }) === true && ctx.lmThemeOverride('b', { menuMainColor: '#456' }) === false &&
        ctx.lmThemeOverride('b', null) === false && ctx.lmThemeEffective().menuMainColor === '#123' && ctx.defaultSettings.menuMainColor === '#01d9cc');
    check('theme: one view per override (canvas painters ask every frame, nothing made per call)', ctx.lmThemeEffective() === ctx.lmThemeEffective());
    {
        /* the windows that paint canvas / SVG / their own CSS with resolved colours show it too */
        const fn = (file, a, end) => { const s = rd(file), i = s.indexOf(a); if (i < 0) throw new Error('not found: ' + a); return s.slice(i, s.indexOf(end, i) + end.length); };
        vm.runInContext('var __t = {' +
            'analytics: (function () {' + fn('ogario/modules/analytics.js', 'function theme(raw) {', '\n    }\n') + 'return theme; })(),' +
            'gamepad: (function () {' + fn('ogario/modules/gamepad-ui.js', 'function colors(raw) {', '\n    }\n') + 'return colors; })(),' +
            'practice: (function () {' + fn('ogario/modules/practice.js', 'function accent() {', '\n') + 'return accent; })(),' +
            'studio: (function () {' + fn('ogario/modules/replaystudio.js', 'function accent() {', '\n') + 'return accent; })(),' +
            'shop: (function () {' + fn('LMexpress/skinsAndDeals.js', 'function getShopTheme() {', '\n}\n') + 'return getShopTheme; })()' +
            '};', ctx);
        const t = ctx.__t, mc = () => [t.analytics(true).mc, t.gamepad(true).mc, t.practice(), t.studio(), t.shop().mc];
        check('theme: Analytics, gamepad stick, practice and Replay Studio canvas, shop colours follow the override', mc().every(c => c === '#123'), mc().join());
        ctx.lmThemeOverride('a', null);
        check('...and the player theme once it is cleared', mc().every(c => c === '#01d9cc'), mc().join());
        ctx.lmThemeOverride('a', { menuMainColor: '#123' });
        painted.length = 1;
    }
    {
        /* a Legend page opened from the mod (link token / message) gets the colours as shown, for
         * that page only: the saved theme stays the player's, the player's colours once cleared */
        const lmx = rd('LMexpress/LMexpress.js');
        vm.runInContext(cutIn(lmx, '/* a colour as the page accepts it', '\n/* the theme as one bounded base64url value'), ctx);
        ctx.$ = () => ({ val: () => '' });
        const saved = JSON.stringify(ctx.defaultSettings);
        const on = ctx.lmThemeData();
        ctx.lmThemeOverride('a', null);
        const off = ctx.lmThemeData();
        ctx.lmThemeOverride('a', { menuMainColor: '#123' });
        painted.length = 1;
        check('theme: a Legend page opened while overridden gets those colours, the player\'s once cleared, the saved theme unchanged',
            on.mc === '#123' && on.pc === '#00243e' && off.mc === '#01d9cc' && JSON.stringify(ctx.defaultSettings) === saved, on.mc + ',' + off.mc);
    }
    ctx.defaultSettings.menuPanelColor = '#222';
    check('theme: a change to the player\'s theme while overridden shows when cleared', ctx.lmThemeEffective().menuPanelColor === '#222' &&
        ctx.lmThemeOverride('a', null) === true && ctx.lmThemeEffective() === ctx.defaultSettings && painted.length === 2);
    {
        /* the repaint of the HUD colours gives the team top 5 bars the colour they are built with */
        const s = rd('ogario/ogario.v4.js').replace(/\r\n/g, '\n'), i = s.indexOf('        setHudColors() {'), j = s.indexOf('\n        },\n', i);
        let bar = null;
        ctx.$ = (q) => q === '#hudMainColor' ? [{ value: '#0f0' }] : { css: (k, v) => { bar = v; } };
        vm.runInContext('var __hud = ({' + s.slice(i, j) + '\n        }, addCustomCSS() { } }); var _lmCssVal = function (v, d) { return v || d; };', ctx);
        ctx.lmThemeOverride('a', { hudMainColor: '#a12b30' });
        ctx.__hud.setHudColors();
        const on = bar;
        ctx.lmThemeOverride('a', null);
        ctx.__hud.setHudColors();
        check('theme: team top 5 bars repainted in the HUD colour as shown, the picker\'s once cleared', on === '#a12b30' && bar === '#0f0', on + ',' + bar);
    }

    if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
    console.log('all Dying Light director checks passed');
})().catch(e => { console.log('FAIL threw: ' + (e && e.stack)); process.exit(1); });
