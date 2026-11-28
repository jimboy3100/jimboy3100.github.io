/* Performance mode's copy of the settings it turns off, with Adaptive performance, presets,
 * and changes by hand (ogario/ogario.v4.js: _lmPerfModeOwn, setSettings and its
 * performanceMode case, the presets row; ogario/modules/perf.js loaded as it is).
 * Precedence: what the player sets while the mode is on wins over the copy; the copy holds the
 * player's own values, never one Adaptive performance has lowered for now.
 * node developers/tests/perfmode.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const main = fs.readFileSync(process.argv[2] || path.join(ROOT, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const perfSrc = fs.readFileSync(path.join(ROOT, 'ogario', 'modules', 'perf.js'), 'utf8');
const i18n = require('./lib/i18n-env');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const cut = (a, b, from) => {
    const i = main.indexOf(a, from || 0), j = main.indexOf(b, i + a.length);
    if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a);
    return main.slice(i, j);
};

/* the real pieces */
const defaultsSrc = cut('var defaultmapsettings = {', '\nvar LM_EXPORT_KEYS');
/* (an older core without the copy rules: the same list, no rules; for before/after runs) */
const ownSrc = main.indexOf('        _lmPerfModeKeys:') >= 0 ? cut('        _lmPerfModeKeys:', '        profiling() {') :
    "_lmPerfModeKeys: ['jellyPhisycs', 'videoSkins', 'highDPI', 'showBgSectors', 'animatedRainbowColor', 'borderGlow', 'suckAnimation', 'eatPulse', 'glAntialias'], _lmPerfModeOwn() { },";
const setStart = main.indexOf('        setSettings(id, checked) {');
const headSrc = cut('            if (defaultmapsettings.hasOwnProperty(id) && null !== checked) {', '                switch (id) {', setStart);
const caseSrc = cut("                    case 'performanceMode':", "                this.saveSettings(defaultmapsettings, 'ogarioSettings');", setStart);
const presetSrc = cut("                var _lmTx = function (k, en)", '                /* Recently added options');
check('setSettings asks Adaptive performance first, then the copy', headSrc.indexOf('LMPerf.onSetting(id, checked)') >= 0 &&
    headSrc.indexOf('LMPerf.onSetting(id, checked)') < headSrc.indexOf('this._lmPerfModeOwn(id, checked)') &&
    headSrc.indexOf('this._lmPerfModeOwn(id, checked)') < headSrc.indexOf('defaultmapsettings[id] = checked'));

/* a small jQuery: enough for the presets row (handlers kept, no DOM) */
function makeJq(ctx) {
    const made = [];
    function Q(x) {
        this.x = x; this.h = {};
        /* '#key-slider' and similar: no such control here; a fake control element: in the menu */
        this.length = x && typeof x === 'object' ? 1 : (typeof x === 'string' && x.charAt(0) === '<' ? 1 : 0);
        if (typeof x === 'string' && x.charAt(0) === '<') made.push(this);
    }
    const self = function () { return this; };
    ['append', 'text', 'appendTo', 'toggle', 'show', 'hide', 'val', 'trigger', 'toggleClass', 'addClass', 'removeClass', 'css'].forEach((m) => { Q.prototype[m] = self; });
    Q.prototype.attr = function (a, b) {
        if (typeof a === 'string' && b === undefined) return this.x && this.x.dataset ? this.x.dataset[a] : undefined;
        return this;
    };
    Q.prototype.closest = function () { return { length: this.x && typeof this.x === 'object' && this.x.inMenu ? 1 : 0 }; };
    Q.prototype.on = function (ev, sel, fn) { if (typeof sel === 'function') this.h[ev] = sel; else this.h[ev + ' ' + sel] = fn; return this; };
    const $ = (x) => new Q(x);
    $.made = made;
    return $;
}

/* a page: the settings, perf.js, the application methods under test, the presets row */
function page(opts) {
    opts = opts || {};
    const store = Object.assign({}, opts.store || {}), toasts = [], timers = [], confirms = [];
    const ctx = {
        performance: { now: () => ctx._now || 0 }, Date, Math, JSON, Object, Array, String, Number, Float32Array, isFinite, console,
        setInterval: (f) => { timers.push(f); return timers.length; }, clearInterval() { }, setTimeout: () => 0, clearTimeout() { },
        localStorage: { getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null), setItem: (k, v) => { if (opts.full && k === 'lmPerfBackup') throw new Error('QuotaExceeded'); store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
        toastr: { info: (t) => toasts.push(t), warning: (t) => toasts.push(t) },
        drawRender: { dpr: 1, resizeCanvas() { } },
        legendmod: { cells: [], pps: 0, ping: 0, isSocketOpen: () => false },
        addEventListener() { }, devicePixelRatio: 1, innerWidth: 915, innerHeight: 412, navigator: {},
        confirm: (t) => { confirms.push(t); return opts.confirm !== false; },
        textLanguage: {}, ogario: {}, Event: function (t, o) { this.type = t; this.bubbles = !!(o && o.bubbles); }
    };
    ctx.window = ctx;
    const overlays = { style: { display: 'none' }, isConnected: true };
    /* checkboxes in the menu for some keys: their change runs setSettings, like the real switches */
    const boxes = {};
    ctx.document = {
        hidden: false, addEventListener() { }, removeEventListener() { }, createElement: () => ({ style: {} }), body: { appendChild() { } },
        getElementById: (id) => id === 'overlays' ? overlays : (boxes[id] || null)
    };
    vm.createContext(ctx);
    i18n(ctx);
    vm.runInContext(defaultsSrc + '\nvar LM_SETTINGS_DEFAULTS = Object.freeze(Object.assign({}, defaultmapsettings));\n' +
        main.slice(main.indexOf('function lmSettingValue(key, value) {'), main.indexOf('\n/* The settings export carries')) +
        '\nfunction _lmG1e(s) { return String(s); }\n' + main.slice(main.indexOf('function _lmG1tag('), main.indexOf('\n', main.indexOf('function _lmG1tag('))) +
        '\nthis.defaultmapsettings = defaultmapsettings; this.LM_SETTINGS_DEFAULTS = LM_SETTINGS_DEFAULTS; this.lmSettingValue = lmSettingValue;', ctx);
    Object.assign(ctx.defaultmapsettings, opts.settings || {});
    ctx.legendmod5 = ctx.defaultmapsettings;
    ctx.$ = makeJq(ctx);
    /* the application: the real members and the real start of setSettings + its performanceMode case */
    vm.runInContext('var application = ({' + ownSrc +
        'setSettings(id, checked) {\n' + headSrc + 'switch (id) {\n' + caseSrc + "this.saveSettings(defaultmapsettings, 'ogarioSettings');\n}\n}," +
        'saveSettings(o, n) { localStorage.setItem(n, JSON.stringify(o)); }, setAnimatedRainbowColor() { } });\nthis.application = application;', ctx);
    if (opts.boxes) opts.boxes.forEach((k) => {
        /* only a bubbling change reaches the settings handler; one that does not bubble moves the Switchery */
        boxes[k] = { type: 'checkbox', inMenu: true, checked: !!ctx.defaultmapsettings[k], moves: 0, dispatchEvent(e) { if (e && e.bubbles) ctx.application.setSettings(k, this.checked); else this.moves++; } };
    });
    if (opts.perf !== false) vm.runInContext(perfSrc, ctx);
    /* the presets row (box: the settings search area it is added to) */
    vm.runInContext('(function () { var box = $("<div>"); var newOnly = false; var apply = function () { };\n' + presetSrc + '\nthis._lmPresetRow = row; this._lmUndoBtn = undoBtn; }).call(this);', ctx);
    const S = ctx.defaultmapsettings, A = ctx.application;
    const backup = () => { const t = store.lmPerfBackup; return t ? JSON.parse(t) : null; };
    const user = (id, v) => A.setSettings(id, v);           /* a switch or a hotkey */
    const preset = (id) => ctx._lmPresetRow.h['click .lm-preset-btn'].call({ dataset: { 'data-preset': id } });
    const undo = () => ctx._lmUndoBtn.h.click();
    const frames = (n, dt, r) => { for (let i = 0; i < n; i++) { ctx._t = (ctx._t || 1) + dt; ctx._lmPerfFrame(ctx._t, ctx._t + r); } };
    return { ctx, S, A, store, toasts, confirms, backup, user, preset, undo, frames, overlays, boxes };
}
const ON = { jellyPhisycs: true, videoSkins: true, highDPI: true, showBgSectors: true, animatedRainbowColor: true, borderGlow: true, suckAnimation: true, eatPulse: true, glAntialias: true };
const KEYS = Object.keys(ON);
const vals = (S) => KEYS.map((k) => k + '=' + S[k]).join(',');

/* defaults: jelly physics on, the mode off, Reduced motion off */
{
    const p = page();
    check('defaults: jelly physics on, Performance mode and Reduced motion off', p.S.jellyPhisycs === true && p.S.performanceMode === false && p.S.reducedMotion === false);
    check('the mode keys are the settings it turns off', JSON.stringify(p.A._lmPerfModeKeys) === JSON.stringify(KEYS));
}

/* 1. on, then off with nothing changed: every value back exactly */
{
    const p = page({ settings: ON });
    p.user('performanceMode', true);
    check('mode on: all costly effects off, the copy holds the player\'s values', KEYS.every((k) => p.S[k] === false) && JSON.stringify(p.backup()) === JSON.stringify(ON));
    p.user('performanceMode', false);
    check('mode off: every value back', vals(p.S) === vals(ON) && p.store.lmPerfBackup === undefined);
}

/* 2. changes by hand while the mode is on win over the copy */
{
    const p = page({ settings: ON });
    p.user('performanceMode', true);
    p.user('jellyPhisycs', true);        /* switch on again */
    p.user('borderGlow', true); p.user('borderGlow', false); /* on and off again: off is the choice */
    check('a switch set while on leaves the copy', p.backup() && !('jellyPhisycs' in p.backup()) && !('borderGlow' in p.backup()) && p.backup().videoSkins === true);
    p.user('performanceMode', false);
    check('mode off: hand changes kept (jelly on, glow off)', p.S.jellyPhisycs === true && p.S.borderGlow === false);
    check('mode off: the untouched settings come back', p.S.videoSkins === true && p.S.highDPI === true && p.S.suckAnimation === true && p.S.glAntialias === true);
}

/* 3. the mode's own changes (and the checkbox events they cause) are not hand changes */
{
    const p = page({ settings: ON, boxes: KEYS });
    p.user('performanceMode', true);
    check('mode on through the switches: the copy is complete', JSON.stringify(p.backup()) === JSON.stringify(ON));
    p.user('performanceMode', false);
    check('mode off through the switches: every value back', vals(p.S) === vals(ON));
}

/* 4. Adaptive performance: the copy and the restore never use its lowered values */
{
    const p = page({ settings: Object.assign({}, ON, { adaptivePerf: true }) });
    p.ctx.LMPerf._setLevel(2);
    check('adaptive level 2 lowered effects for now', p.S.jellyPhisycs === false && p.S.suckAnimation === false);
    p.user('performanceMode', true);
    check('mode on during level 2: the copy has the player\'s values, not the lowered ones', JSON.stringify(p.backup()) === JSON.stringify(ON));
    /* while on: the player turns jelly on while level 2 is on: the player's choice, kept */
    p.user('jellyPhisycs', true);
    p.ctx.LMPerf._setLevel(2);
    check('adaptive leaves the jelly turned on by hand during its level', p.S.jellyPhisycs === true && p.ctx.LMPerf.userValue('jellyPhisycs') === true);
    p.user('performanceMode', false);
    check('mode off: the restore writes the copy and the player\'s jelly, adaptive keeps its own values apart', p.ctx.LMPerf.userValue('jellyPhisycs') === true &&
        KEYS.every((k) => p.ctx.LMPerf.userValue(k) === ON[k]));
    p.ctx.LMPerf._setLevel(0);
    check('adaptive back to 0: exactly the player\'s values', vals(p.S) === vals(ON));
    const saved = JSON.parse(p.store.ogarioSettings);
    check('saved settings never hold a lowered value', KEYS.every((k) => saved[k] === ON[k]));
}

/* 5. presets while the mode is on */
{
    const p = page({ settings: ON });
    p.user('performanceMode', true);
    p.preset('battery');                 /* sets jelly, video skins, rainbow, glow, suck off */
    check('preset over the mode: its keys leave the copy', !['jellyPhisycs', 'videoSkins', 'animatedRainbowColor', 'borderGlow', 'suckAnimation', 'highDPI', 'showBgSectors'].some((k) => k in p.backup()) &&
        p.backup().glAntialias === true && p.backup().eatPulse === true);
    p.user('performanceMode', false);
    check('mode off after a preset: the preset values stay, the rest comes back', p.S.jellyPhisycs === false && p.S.videoSkins === false &&
        p.S.highDPI === false && p.S.showBgSectors === false && p.S.eatPulse === true && p.S.glAntialias === true);
    /* the preset Undo has the values from before the preset: the mode's (they were in place) */
    p.user('performanceMode', true);
    p.undo();
    check('Undo while the mode is on: its values are the player\'s choice too', p.backup() && !('jellyPhisycs' in p.backup()) && !('highDPI' in p.backup()) && p.backup().eatPulse === true);
}

/* 6. a preset while Adaptive performance has lowered a value: Undo gets the player's value */
{
    const p = page({ settings: Object.assign({}, ON, { adaptivePerf: true }) });
    p.ctx.LMPerf._setLevel(2);
    p.preset('battery');
    const snap = JSON.parse(p.store.lmPresetUndo);
    check('preset Undo snapshot: the player\'s values, not the lowered ones', snap.jellyPhisycs === true && snap.suckAnimation === true);
    p.undo();
    p.ctx.LMPerf._setLevel(0);
    check('Undo then adaptive back to 0: the player\'s values', p.S.jellyPhisycs === true && p.S.suckAnimation === true);
}

/* 8. a reload while on: the copy in storage still gives way to later hand changes */
{
    const first = page({ settings: Object.assign({}, ON, { showBgSectors: false }) });
    first.user('performanceMode', true);
    const p = page({ settings: JSON.parse(first.store.ogarioSettings), store: { lmPerfBackup: first.store.lmPerfBackup } });
    p.user('showBgSectors', true);
    p.user('performanceMode', false);
    check('after a reload: hand change kept, the rest back', p.S.showBgSectors === true && p.S.jellyPhisycs === true);
}

/* 9. storage full: the copy in memory follows the same rules */
{
    const p = page({ settings: ON, full: true });
    p.user('performanceMode', true);
    check('storage full: copy kept in memory', p.ctx._lmPerfBackupMem && p.ctx._lmPerfBackupMem.jellyPhisycs === true);
    p.user('jellyPhisycs', true);
    p.user('videoSkins', false);
    check('storage full: hand changes leave the memory copy', !('videoSkins' in p.ctx._lmPerfBackupMem));
    p.user('performanceMode', false);
    check('storage full: mode off keeps the hand changes', p.S.videoSkins === false && p.S.jellyPhisycs === true && p.S.highDPI === true);
}

/* 10. outside the mode nothing is touched; other settings never touch the copy */
{
    const p = page({ settings: ON, store: { lmPerfBackup: JSON.stringify(ON) } });
    p.user('jellyPhisycs', false);
    check('mode off: a switch does not edit a copy', JSON.stringify(p.backup()) === JSON.stringify(ON));
    p.user('performanceMode', true);
    p.user('showMass', false);
    check('mode on: a setting outside its list leaves the copy alone', JSON.stringify(Object.keys(p.backup()).sort()) === JSON.stringify(KEYS.slice().sort()));
}

/* 11. Reduced motion and Streamer presets: only on a deliberate, confirmed click */
{
    const p = page({ settings: ON, confirm: false });
    p.preset('reducedMotion');
    check('Reduced motion cancelled: jelly and the rest unchanged', p.S.jellyPhisycs === true && p.S.reducedMotion === false && p.store.lmPresetUndo === undefined);
    const q = page({ settings: ON });
    check('loading the presets changes nothing (jelly stays on)', q.S.jellyPhisycs === true && q.S.reducedMotion === false && q.confirms.length === 0);
    q.preset('reducedMotion');
    check('Reduced motion confirmed: jelly off, Undo has it on', q.S.jellyPhisycs === false && q.S.reducedMotion === true && JSON.parse(q.store.lmPresetUndo).jellyPhisycs === true);
    q.undo();
    check('Undo: jelly on again', q.S.jellyPhisycs === true && q.S.reducedMotion === false);
    const before = { disableChat: q.S.disableChat };
    const eyes = [];
    q.A.setStreamMode = () => eyes.push('stream:' + q.S.streamMode);
    q.A.setHideSkinUrl = () => eyes.push('url:' + q.S.hideSkinUrl);
    q.preset('streamer');
    const msg = q.confirms[q.confirms.length - 1];
    check('Streamer preset: the confirmation says what it is not, and names the privacy controls', msg.indexOf(i18n.t('pkg.pt.streamerTip')) > 0 && /not a privacy guarantee/.test(i18n.t('pkg.pt.streamerTip')) && /Stream mode/.test(i18n.t('pkg.pt.streamerTip')));
    check('Streamer preset: the confirmation lists Stream mode and Hide skin URL by name', msg.indexOf('- ' + i18n.t('pkg.pt.streamMode') + ': ON') >= 0 && msg.indexOf('- ' + i18n.t('pkg.pt.hideSkinUrl') + ': ON') >= 0);
    check('Streamer preset: its display keys, Stream mode and Hide skin URL change (as the Streaming template did), the chat box does not', q.S.hidecountry === true && q.S.showChat === false &&
        q.S.streamMode === true && q.S.hideSkinUrl === true && JSON.stringify(before) === JSON.stringify({ disableChat: q.S.disableChat }));
    check('Streamer preset: the eye buttons follow', eyes.join() === 'stream:true,url:true');
    q.undo();
    check('Streamer preset Undo: Stream mode and Hide skin URL off again, the eye buttons follow', q.S.streamMode === false && q.S.hideSkinUrl === false && q.S.hidecountry === false && eyes.slice(2).sort().join() === 'stream:false,url:false');
}

/* 11b. the merged presets: the old profile templates are presets (one list) */
{
    const q = page();
    check('one list: the menu publishes the presets', !!q.A.lmPresets && Object.keys(q.A.lmPresets).join() === 'competitive,battery,streamer,reducedMotion,cleanHud,ffa,teams,multibox');
    q.preset('battery');
    check('Battery saver: also High DPI and background sectors off (from the Mobile template)', q.S.highDPI === false && q.S.showBgSectors === false && q.S.jellyPhisycs === false);
    q.undo();
    q.preset('competitive');
    check('Competitive: also split prediction (from the old profiles template)', q.S.splitPrediction === true && q.S.oppColors === true);
    q.undo();
    check('Competitive Undo: split prediction back off', q.S.splitPrediction === false);
    q.preset('multibox');
    check('Multibox preset: switching after death on, no ring settings (the ring is fixed)', q.S.mbSwitchAfterDeath === true && !('mbRingsP1' in q.S));
    q.undo();
}

/* 11c. Adaptive performance and changes by hand, the mode's own changes and the same Performance mode value */
{
    const AD = { adaptivePerf: true, adaptivePerfToasts: false };
    const p = page({ settings: Object.assign({}, ON, AD) });
    p.ctx.LMPerf._setLevel(2);
    /* a script with the mode as it is (same value), and a switch sending the same value */
    p.ctx.LMPerf.onSetting('performanceMode', false);
    p.ctx.LMPerf.onSetting('performanceMode');
    p.user('performanceMode', false);
    check('the same Performance mode value again: the effects Adaptive performance lowered stay lowered', p.S.jellyPhisycs === false && p.S.suckAnimation === false &&
        p.ctx.LMPerf.userValue('jellyPhisycs') === true);
    /* a key that was off when its level came, turned on by hand (hotkey) while that level is on: kept, as a lowered key the player changes */
    const q = page({ settings: Object.assign({}, ON, AD, { showBgSectors: false, videoSkins: false }) });
    q.ctx.LMPerf._setLevel(2);
    q.user('showBgSectors', true);
    /* a value set with _lmPerfApplying (the mode's own changes) is not such a choice */
    q.A._lmPerfApplying = true;
    try { q.user('videoSkins', true); } finally { q.A._lmPerfApplying = false; }
    q.ctx.LMPerf._setLevel(2);
    check('a key turned on by hand while its level is on stays on; a value of the mode itself is lowered for now', q.S.showBgSectors === true && q.S.videoSkins === false && q.ctx.LMPerf.userValue('videoSkins') === true);
    /* Adaptive performance off and on again starts afresh: the choice no longer blocks it */
    q.S.adaptivePerf = false; q.ctx.LMPerf.configChanged();
    q.S.adaptivePerf = true; q.ctx.LMPerf.configChanged();
    q.ctx.LMPerf._setLevel(2);
    check('Adaptive performance off and on: the kept choices end, the key is lowered for now', q.S.showBgSectors === false && q.ctx.LMPerf.userValue('showBgSectors') === true);
    /* a change before any level is the player's setting, lowered later when the game is slow */
    const r = page({ settings: Object.assign({}, ON, AD, { eatPulse: false }) });
    r.user('eatPulse', true);
    r.ctx.LMPerf._setLevel(1);
    check('a key turned on before its level: lowered for now when the level comes', r.S.eatPulse === false && r.ctx.LMPerf.userValue('eatPulse') === true);
    /* the mode on again while it is on (a script): nothing switches, the lowered values stay lowered */
    const m = page({ settings: Object.assign({}, ON, AD, { performanceMode: true }), boxes: KEYS });
    m.ctx.LMPerf._setLevel(2);
    m.user('performanceMode', true);
    check('Performance mode on again during level 2: no copy of lowered values, they stay lowered', m.backup() === null && m.S.jellyPhisycs === false && m.ctx.LMPerf.userValue('jellyPhisycs') === true);
}

/* 11d. presets: one path for every key (Adaptive performance and the mode's copy asked once per key) */
{
    const p = page({ settings: Object.assign({}, ON, { performanceMode: true, adaptivePerf: true, adaptivePerfToasts: false }), boxes: ['jellyPhisycs', 'videoSkins', 'highDPI'] });
    p.store.lmPerfBackup = JSON.stringify(ON);
    p.S.highDPI = false; p.ctx.document.getElementById('highDPI').checked = false;   /* already the preset's value: no change event */
    const own = {}, asked = {};
    const realOwn = p.A._lmPerfModeOwn;
    p.A._lmPerfModeOwn = function (k, v) { own[k] = (own[k] || 0) + 1; return realOwn.call(this, k, v); };
    const realOn = p.ctx.LMPerf.onSetting;
    p.ctx.LMPerf.onSetting = function (k, v) { asked[k] = (asked[k] || 0) + 1; return realOn.call(this, k, v); };
    p.preset('battery');
    const keys = Object.keys(p.A.lmPresets.battery.set).filter((k) => k in p.S);
    check('preset: every key asks the mode\'s copy and Adaptive performance once (switch, same value, other)', keys.every((k) => own[k] === 1 && asked[k] === 1) ||
        (console.log('   own ' + JSON.stringify(own) + ' asked ' + JSON.stringify(asked)), false));
    check('preset: its keys left the mode\'s copy, also the one already at its value', p.backup() && !('highDPI' in p.backup()) && !('jellyPhisycs' in p.backup()) && p.backup().eatPulse === true);
}

/* 11e. presets turn on what their options need (Settings > Helpers, Stats), and leave the looks */
{
    const DEPS = vm.runInNewContext('(' + cut('                var DEPS = {', '\n                };').replace('                var DEPS = ', '') + '\n})');
    const parentOf = {};
    Object.keys(DEPS).forEach((par) => DEPS[par].forEach((c) => { parentOf[c] = par; }));
    const allOff = {};
    Object.keys(DEPS).forEach((par) => { allOff[par] = false; });
    const q = page({ settings: Object.assign({}, allOff, { bubbleCursorTracker: true }) });
    const missing = [];
    Object.keys(q.A.lmPresets).forEach((id) => {
        const p = page({ settings: allOff });
        p.A.setStreamMode = p.A.setHideSkinUrl = () => { };
        p.preset(id);
        Object.keys(p.A.lmPresets[id].set).forEach((k) => {
            if (!(k in p.S) || !p.S[k]) return;
            for (let par = parentOf[k], n = 0; par && n < 5; par = parentOf[par], n++) if (par in p.S && !p.S[par]) missing.push(id + ': ' + k + ' needs ' + par);
        });
    });
    check('presets: every option a preset turns on has the switches it needs on', missing.length === 0 || (console.log('   ' + missing.join('; ')), false));
    q.preset('competitive');
    check('Competitive: Cursor tracking and Stats on for split prediction and FPS / PPS, the bubble look kept', q.S.cursorTracking === true && q.S.showStats === true && q.S.bubbleCursorTracker === true);
    q.undo();
    check('Competitive Undo: Cursor tracking and Stats back off', q.S.cursorTracking === false && q.S.showStats === false);
}

/* 11f. the preset Undo: its copy goes only when everything is back */
{
    const q = page({ settings: ON });
    let fails = false;
    q.A.setStreamMode = () => { if (fails) throw new Error('eye button'); };
    q.A.setHideSkinUrl = () => { };
    q.preset('streamer');
    fails = true;
    let err = null;
    try { q.undo(); } catch (e) { err = e; }
    const left = q.store.lmPresetUndo ? JSON.parse(q.store.lmPresetUndo) : null;
    check('Undo with a value that fails: the others are back, the copy keeps what failed', !err && q.S.hidecountry === false && q.S.showChat === true && !!left && 'streamMode' in left && !('showChat' in left));
    fails = false;
    q.undo();
    check('Undo again: the rest back, the copy gone', q.S.streamMode === false && q.store.lmPresetUndo === undefined);
}

/* 12. without perf.js (it failed to load): the copy rules still hold */
{
    const p = page({ settings: Object.assign({}, ON, { jellyPhisycs: false }), perf: false });
    p.user('performanceMode', true);
    p.user('jellyPhisycs', true);
    p.user('performanceMode', false);
    check('no perf.js: hand change kept, the rest back', p.S.jellyPhisycs === true && p.S.videoSkins === true);
}

/* 13. the mode acts on a real change only: a second "on" (a script) kept the copy of the
 * player's values; a storage failure */
{
    const p = page({ settings: ON });
    p.user('performanceMode', true);
    p.user('performanceMode', true);
    check('on, on again: the copy still holds the player\'s values', JSON.stringify(p.backup()) === JSON.stringify(ON));
    p.user('performanceMode', false);
    check('on, on, off: every value back (jelly physics on)', vals(p.S) === vals(ON) && p.store.lmPerfBackup === undefined);
    const t = p.toasts.length;
    p.user('performanceMode', false);
    check('off again: nothing put back, no message', vals(p.S) === vals(ON) && p.toasts.length === t);
}
{
    /* the Performance mode hotkey is removed: the Settings switch turns it on and off */
    const hkSrc = fs.readFileSync(path.join(ROOT, 'ogario', 'hotkeysCommand.js'), 'utf8');
    check('no Performance mode hotkey', hkSrc.indexOf("'hk-performanceMode'") < 0);
}
{
    /* storage full with an older stored copy: the copy of this "on" (in memory) is the one put back */
    const stale = Object.assign({}, ON, { jellyPhisycs: false, videoSkins: false });
    const p = page({ settings: ON, full: true, store: { lmPerfBackup: JSON.stringify(stale) } });
    p.user('performanceMode', true);
    check('storage full: the older stored copy is not kept beside the one in memory', p.store.lmPerfBackup === undefined && p.ctx._lmPerfBackupMem.jellyPhisycs === true);
    p.user('performanceMode', false);
    check('storage full, mode off: the values of this "on" come back, not the older copy', vals(p.S) === vals(ON));
}

/* the texts: in every complete language, and Greek differs from English */
['pkg.pt.streamerTip', 'pkg.i.streamModeTip', 'pkg.pt.presetTeams', 'pkg.pt.streamMode', 'pkg.pt.hideSkinUrl'].forEach((k) => {
    check(k + ': English and Greek', i18n.t(k) !== k && i18n.t(k, null, 'el') !== k && i18n.t(k, null, 'el') !== i18n.t(k));
});
check('legacy textStroke / mouseInvert kept with their defaults (saved settings and old scripts)', (() => {
    const p = page();
    return p.S.textStroke === false && p.S.mouseInvert === false && p.ctx.LM_SETTINGS_DEFAULTS.textStroke === false && p.ctx.lmSettingValue('mouseInvert', 'true') === true;
})());

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
