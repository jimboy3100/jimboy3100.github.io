/* Original Legend Mod extras, with the real code of extras/legendhelper.js, LMexpress/LMexpress.js
 * and ogario/ogario.v4.js: the Mod Info templates (six one-click looks that keep the player's
 * profiles, hotkeys and chat commands), the Dying Light expansion (window.LMDyingLight: turned on
 * and off without a reload, its switch the setting dyingLight), the nick easter eggs EasterEgg1/2/3
 * and the Facebook bubble tracker option. node developers/tests/legacyextras.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const main = rd('ogario/ogario.v4.js'), lmx = rd('LMexpress/LMexpress.js'), helper = rd('extras/legendhelper.js');
const cutIn = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* a tiny jQuery stand-in: records html(), clicks, appended scripts and values */
function makeDom() {
    const log = { html: {}, clicks: [], scripts: [], vals: {}, toasts: [] };
    const els = { 'import-settings': { value: '' } };
    const $ = sel => {
        const api = {
            html: h => { log.html[sel] = h; return api; },
            click: () => { log.clicks.push(sel); return api; },
            attr: () => api, css: () => api, text: () => api,
            append: s => { log.scripts.push(s.src); return api; },
            val: v => { if (v === undefined) return log.vals[sel]; log.vals[sel] = v; return api; }
        };
        return api;
    };
    const document = { getElementById: id => els[id] || null, createElement: () => ({}) };
    const toastr = { info: m => { log.toasts.push(m); return { css: () => { } }; } };
    return { log, els, $, document, toastr };
}

/* ═══ Mod Info templates ═══ */
{
    const d = makeDom();
    const ctx = { $: d.$, document: d.document, window: { history: { pushState: () => { } }, location: { pathname: '/' } }, toastr: d.toastr,
        _lmHT: k => k, _lmHTx: k => k, _lmHelperSrc: () => 'x', languagemod: 1, JSON };
    ctx.window.document = d.document;
    vm.createContext(ctx);
    vm.runInContext('var history = window.history; ' + cutIn(helper, 'function templatesIframe()', '\n/* openbleedmod'), ctx);
    vm.runInContext('templatesIframe()', ctx);
    const page = d.log.html['#Userscriptshud3'] || '';
    const looks = ['agariowhitesettings', 'nosoups', 'vanillabetter', 'galaxysettings', 'legenddefaultsettings', 'vanillalike'];
    check('Templates page offers the six looks', looks.every(f => page.indexOf('onclick="' + f + '()') !== -1));
    check('Templates page shows the Dying Light expansion banner (bound by LMexpress: no inline click, no second #LEGENDAds2)',
        page.indexOf('data-lm-dl="on"') !== -1 && page.indexOf('dyinglightbanner2.jpg') !== -1 && page.indexOf('LEGENDAds2') === -1 && page.indexOf('onclick="opendyinglight') === -1);
    for (const f of looks) {
        d.els['import-settings'].value = ''; d.log.clicks.length = 0;
        vm.runInContext(f + '()', ctx);
        let o = null;
        try { o = JSON.parse(d.els['import-settings'].value); } catch (e) { }
        check(f + ': a settings file is imported (Import clicked)', !!o && d.log.clicks.indexOf('#import-settings-btn') !== -1);
        check(f + ': the profiles, hotkeys and chat commands of the player are kept', !!o && !('ogarioPlayerProfiles' in o) && !('ogarioHotkeys' in o) && !('ogarioCommands' in o));
    }
    /* removed: Information, Manual templates, Languages (its list, its sync and its once-only toast) */
    check('Mod Info footer: Close and Templates only', helper.indexOf('<button id="TemplatesBtn"') !== -1 &&
        !/Infobtn11|ManualyTemplatesBtn|LanguagesTempBtn|LanguagesTempIframe|manualytemplatesIframe|changeModLanguage2|legendlanguages2|Languagetimesused/.test(helper));
    const lph = rd('languages/LanguagePackHandler.js');
    check('language handler: no Languages page texts and no language changed toast', !/Infobtn11|ManualyTemplatesBtn|LanguagesTempBtn|chooselangtext1|Languagetimesused|Externalletter0c/.test(lph) && /#TemplatesBtn/.test(lph));
    check('LMexpress: no #legendlanguages2 sync', !/legendlanguages2/.test(lmx));
    const en = rd('languages/lm-en.js');
    /* (their old Externalletter* globals stay defined for old scripts, see i18n.js) */
    check('window title Mod Info', /"pack\.modInfoTemplates": "Mod Info",/.test(en));
}

/* ═══ Dying Light expansion and nick easter eggs (LMexpress) ═══ */
{
    const d = makeDom();
    const ctx = { $: d.$, document: d.document, window: {}, toastr: d.toastr, Premadeletter3: 'egg1', Premadeletter4: 'egg2', Premadeletter5: 'egg3', Premadeletter6: '' };
    vm.createContext(ctx);
    vm.runInContext(cutIn(lmx, 'function openbleedmod()', '\nfunction languagemodfun()'), ctx);
    const eggs = 'function nickPlay(nick) { $("#nick").val(nick); ' + cutIn(lmx, '        if ($("#nick").val() == "EasterEgg1") {', '\n    });\n    $("#nick").on("input"') + ' }';
    vm.runInContext(eggs, ctx);
    d.log.scripts.length = 0;
    vm.runInContext('nickPlay("EasterEgg1"); nickPlay("EasterEgg1")', ctx);
    check('EasterEgg1: renamed, Play pressed, BleedingMod loaded once', d.log.vals['#nick'] === 'Easter Egg' && d.log.clicks.length === 2 &&
        d.log.scripts.length === 1 && /extras\/BleedingMod\.js$/.test(d.log.scripts[0]));
    d.log.scripts.length = 0;
    vm.runInContext('nickPlay("EasterEgg2")', ctx);
    check('EasterEgg2: rotating pictures loaded', d.log.vals['#nick'] === 'Easter Egg' && /extras\/rotating500images\.js$/.test(d.log.scripts[0]));
    vm.runInContext('nickPlay("EasterEgg3")', ctx);
    check('EasterEgg3: renamed Video with its toast', d.log.vals['#nick'] === 'Video' && /^egg3/.test(d.log.toasts[d.log.toasts.length - 1]));
    d.log.scripts.length = 0; d.log.toasts.length = 0;
    vm.runInContext('nickPlay("Jimboy")', ctx);
    check('another nick: nothing loaded', d.log.scripts.length === 0 && d.log.toasts.length === 0);
    /* the Mod Info window (extras/legendhelper.js) is loaded later: its functions must not replace
     * the egg loaders (a copy there loaded the missing extras/bleedmod.js, with no load-once guard) */
    const d2 = makeDom();
    const ctx2 = { $: d2.$, document: d2.document, window: {}, toastr: d2.toastr, Premadeletter3: 'egg1', Premadeletter4: 'egg2', Premadeletter5: 'egg3', Premadeletter6: '' };
    vm.createContext(ctx2);
    vm.runInContext(cutIn(lmx, 'function openbleedmod()', '\nfunction languagemodfun()'), ctx2);
    vm.runInContext(eggs, ctx2);
    vm.runInContext(cutIn(helper, 'function templatesIframe()', '\n/* openbleedmod'), ctx2);
    vm.runInContext('nickPlay("EasterEgg1"); nickPlay("EasterEgg1")', ctx2);
    check('after Mod Info was opened: EasterEgg1 still loads extras/BleedingMod.js once',
        d2.log.scripts.length === 1 && d2.log.scripts[0] === 'https://www.legendmod.ml/extras/BleedingMod.js');
    check('Dying Light: the old flag is no longer exported (dyingLight goes with the settings), an old file\'s flag is still read',
        !/legendSettings\.dyinglight1load = /.test(lmx) && /_lmImportSet\("dyinglight1load", LegendJSON\.legendSettings\.dyinglight1load\)/.test(lmx));
    check('Restore defaults also removes the old Dying Light flag', /restoreSettings\(\) \{[\s\S]{0,900}removeItem\('dyinglight1load'\)/.test(main));
    for (const f of ['extras/dyinglight.js', 'extras/BleedingMod.js', 'extras/rotating500images.js']) {
        let ok = true; try { new vm.Script(rd(f)); } catch (e) { ok = false; }
        check(f + ' is there and parses', ok);
    }
}

/* ═══ Facebook bubble tracker option ═══ */
{
    const defs = vm.runInNewContext('(function(){' + cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n}; return defaultmapsettings; })()', { window: {}, localStorage: { getItem: () => null } });
    check('FBTracking is a setting, on by default as before', defs.FBTracking === true);
    check('FBTracking switch in the helpers group', /this\.addOptions\(\[[^\]]*"FBTracking"[^\]]*\], "helpersGroup"\)/.test(main));
}

/* ═══ Dying Light lifecycle: the real loader of LMexpress.js, the real extras/dyinglight.js, the
 * real LMEvents, settings defaults and change announcements of ogario.v4.js ═══ */
async function dyingLightLifecycle() {
    const dl = rd('extras/dyinglight.js');
    const lmxText = cutIn(lmx, 'function _lmxT(', '\n/* Choose Language') + '\n';
    /* the old payloads are gone: settings imports, history rewrite, fullscreen, Play / disconnect
     * hooks, timer chains, quote toasts, page audio, the old defaults reset, any Discord address */
    check('extras/dyinglight.js has none of the old payloads',
        !/import-settings|pushState|[Ff]ullscreen|core\.disconnect|olddeath|btnmgs|aab\d|createElement\(['"]audio|legenddefaultsettings|discord|webhook|playSound|toastr\["error"\]/i.test(dl) &&
        /* the picture wait and the spawn burst's one later try (dlfx.js); the director (after
         * LMDyingLight) has its one-shot clock */
        (dl.slice(0, dl.indexOf('/* The Dying Light director')).match(/setTimeout\(/g) || []).length === 2 && (dl.match(/setTimeout\(/g) || []).length === 3);
    check('old banner files: static markup, no ga() or inline script',
        ['banners/bannerDyingLight', 'banners/bannerStopDyingLight'].every(f => { const t = rd(f); return /data-lm-dl="toggle"/.test(t) && !/ga\(|<script|onclick/.test(t); }));

    const store = {};
    const localStorage = {
        getItem: k => Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null,
        setItem: (k, v) => { if (localStorage.full) throw new Error('QuotaExceededError'); store[k] = String(v); },
        removeItem: k => { delete store[k]; }
    };
    /* pictures: each waits until the test lets it load (ok) or fail */
    const pics = [];
    class Img { set src(u) { this._src = u; pics.push(this); } get src() { return this._src; } }
    const flushPics = ok => { while (pics.length) { const im = pics.shift(); if (ok) { im.naturalWidth = 64; im.onload && im.onload(); } else im.onerror && im.onerror(); } };
    const head = { kids: [], appendChild(n) { n.parentNode = head; this.kids.push(n); if (n._script) scripts.push(n); return n; }, removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; } };
    const cls = new Set();
    const scripts = [];
    const box = { innerHTML: '' };
    const document = {
        head, documentElement: { classList: { add: c => { if (document.failClass) throw new Error('boom'); cls.add(c); }, remove: c => cls.delete(c) } },
        createElement: t => (t === 'script' ? { _script: true } : { tag: t }),
        getElementById: id => (id === 'LEGENDAds2' ? box : null)
    };
    const toasts = [];
    const ctx = { localStorage, document, Image: Img, console: { warn() { }, log() { } }, Promise, setTimeout, clearTimeout, Object, JSON, Array, String, Number, Error,
        toastr: { warning: m => toasts.push(m), info: () => { } }, confirm: () => ctx.answer, answer: true, OgVer: 3.7,
        $: () => ({ off() { return this; }, on() { return this; } }), lmT: k => k };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), ctx);
    vm.runInContext(cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n};\nvar LM_SETTINGS_DEFAULTS = Object.freeze(Object.assign({}, defaultmapsettings));\n' +
        cutIn(main, 'var LM_SETTINGS_SCHEMA', '\n/* "Video skins volume"') + cutIn(main, 'var _lmSettingsSeen = null', '\n/* The settings export carries'), ctx);
    vm.runInContext('var application = { saveSettings: function (o, n) { var v = lmSettingsUserView(); localStorage.setItem(n, JSON.stringify(v)); lmSettingsCommit(v); } };' +
        'lmSettingsCommit(lmSettingsUserView()); var dyinglight1load = localStorage.getItem("dyinglight1load");', ctx);
    vm.runInContext(lmxText + cutIn(lmx, '/* Dying Light expansion (extras/dyinglight.js, window.LMDyingLight)', '\nfunction bluebtns()'), ctx);
    const states = [];
    /* the state changes (an intensity change is sent with the same state) */
    ctx.LMEvents.on('dyingLightChange', d => { if (states[states.length - 1] !== d.state) states.push(d.state); });
    const tick = () => new Promise(r => setImmediate(r));
    const runScript = async () => { const s = scripts.shift(); vm.runInContext(dl, ctx); s.onload(); await tick(); };
    const D = ctx.defaultmapsettings;
    check('dyingLight: a gameplay setting, off by default', ctx.LM_SETTINGS_DEFAULTS.dyingLight === false);

    /* a start with it off: nothing is loaded, the banner offers it */
    ctx.application.saveSettings(D, 'ogarioSettings');
    const snap = () => JSON.stringify(Object.keys(store).sort().map(k => [k, store[k]]));
    const before = snap();
    vm.runInContext('lmDyingLightStartup()', ctx);
    check('start with it off: no script, no listener, the turn-on banner', scripts.length === 0 && !ctx.LMEvents._has('settingsChange') &&
        /data-lm-dl="toggle"/.test(box.innerHTML) && /dyinglightbanner2/.test(box.innerHTML) && snap() === before);

    /* a new activation asks first; No leaves everything as it was */
    ctx.answer = false;
    let p = vm.runInContext('opendyinglight()', ctx);
    check('the script is loaded once, with the release version', scripts.length === 1 && /extras\/dyinglight\.js\?v=3\.7$/.test(scripts[0].src) && /aria-busy/.test(box.innerHTML));
    await runScript();
    check('refused at the question: off, nothing saved', (await p) === false && ctx.LMDyingLight.state === 'off' && snap() === before && pics.length === 0);

    ctx.answer = true;
    p = vm.runInContext('opendyinglight()', ctx);
    await tick();
    check('no second script load', scripts.length === 0 && ctx.LMDyingLight.state === 'loading');
    flushPics(true);
    check('on after the pictures', (await p) === true && ctx.LMDyingLight.isEnabled() && D.dyingLight === true && JSON.parse(store.ogarioSettings).dyingLight === true);
    check('on: the old readers see the flag (no global zombie picture), the scoped style is there, the banner turns it off',
        ctx.dyinglight1load === 'yes' && ctx.cimgDyingLight === undefined && cls.has('lm-dl') && head.kids.some(n => n.id === 'lm-dl-style') && /dyinglightbanner3/.test(box.innerHTML));
    check('on: its controls under the banner with the saved values', /data-lm-dl-opt="dyingLightIntensity"/.test(box.innerHTML) &&
        /value="immersive" selected/.test(box.innerHTML) && /data-lm-dl-opt="dyingLightCycle" checked/.test(box.innerHTML) &&
        /data-lm-dl-opt="dyingLightScares" checked/.test(box.innerHTML) && /value="100" data-lm-dl-opt="dyingLightVolume"/.test(box.innerHTML));
    {
        const opt = (key, type, value, checked) => vm.runInContext('lmDyingLightOpt', ctx)({ getAttribute: () => key, type, value, checked });
        const ok1 = opt('dyingLightIntensity', 'select-one', 'nightmare') && D.dyingLightIntensity === 'nightmare' && ctx.LMDyingLight.intensity() === 'nightmare' &&
            JSON.parse(store.ogarioSettings).dyingLightIntensity === 'nightmare';
        const ok2 = !opt('dyingLightIntensity', 'select-one', 'party') && D.dyingLightIntensity === 'nightmare' && !opt('dyingLight', 'checkbox', '', false) && D.dyingLight === true;
        const ok3 = opt('dyingLightScares', 'checkbox', '', false) && D.dyingLightScares === false && opt('dyingLightVolume', 'range', '40') && D.dyingLightVolume === 0.4;
        opt('dyingLightIntensity', 'select-one', 'immersive'); opt('dyingLightScares', 'checkbox', '', true); opt('dyingLightVolume', 'range', '100');
        check('a control saves its setting (only its own keys and values), the intensity follows', ok1 && ok2 && ok3 && D.dyingLightIntensity === 'immersive' &&
            ctx.LMDyingLight.intensity() === 'immersive' && D.dyingLightVolume === 1 && D.dyingLightScares === true);
    }
    const L = ctx.LMDyingLight;
    const other = { mass: 200, targetNick: 'enemy' };
    check('fallback skin only for another real player body', !!L.getFallbackSkinKey(other) && L.getFallbackSkinKey(other) === L.getFallbackSkinKey({ mass: 50, targetNick: 'enemy' }) &&
        /* mass label not drawn (cell.mass 0): the size decides */
        L.getFallbackSkinKey({ mass: 0, size: 60, targetNick: 'enemy' }) === L.getFallbackSkinKey(other) &&
        [{ mass: 200, targetNick: 'me', isPlayerCell: true }, { mass: 200, targetNick: 'u', isPlayerCellMulti: true }, { mass: 200, targetNick: 'f', isFood: true },
         { mass: 200, targetNick: 'v', isVirus: true }, { mass: 20, targetNick: 'e', isEjected: true }, { mass: 10, targetNick: 's' }, { mass: 0, size: 34, targetNick: 'z' }, { mass: 200, targetNick: '' }, { mass: 200, targetNick: 'r', removed: true }]
            .every(c => L.getFallbackSkinKey(c) === null));
    check('background while on', !!L.getBackground() && L.getBackground() === L.getBackground() && !!L.getBackground().img && !L.hasForegroundFx() && !L.needsThreatData());

    /* off: the stored settings are exactly as before, nothing of it left on the page */
    const gen = L.generation;
    await vm.runInContext('stopdyinglight()', ctx);
    check('off: stored settings identical to before, no style, flag cleared, no listener, no background',
        snap() === before && L.state === 'off' && !cls.has('lm-dl') && !head.kids.some(n => n.id === 'lm-dl-style') && ctx.dyinglight1load === null && ctx.cimgDyingLight === undefined &&
        !ctx.LMEvents._has('settingsChange') && L.getBackground() === null && L.getFallbackSkinKey(other) === null && L.generation > gen);
    check('states sent: loading, on, disabling, off', states.join() === 'loading,on,disabling,off');

    /* on again: no new script, the pictures kept */
    states.length = 0;
    p = vm.runInContext('lmDyingLightToggle()', ctx);
    check('on again at once (pictures kept)', (await p) === true && L.isEnabled() && pics.length === 0);
    await L.disable(); await L.disable();
    check('disable twice: off once', L.state === 'off' && states.join() === 'loading,on,disabling,off' && snap() === before);

    /* turned off while the pictures load: a late load does nothing */
    L.setIntensity('competitive');
    const parts = [];
    L.addPart({ name: 'probe', start: g => parts.push('start' + g), stop: () => parts.push('stop'), fx: true });
    pics.length = 0;
    p = L.enable({ confirm: false });
    // the pictures are cached: a new enable resolves on the next tick; cut it while loading
    check('loading', L.state === 'loading');
    vm.runInContext('lmDyingLightToggle()', ctx);
    check('cancelled while loading: off, nothing saved', (await p) === false && L.state === 'off' && snap() === before && !cls.has('lm-dl') && parts.length === 0);
    p = L.enable(); const p2 = L.enable();
    check('one enable at a time', p === p2 && (await p) === true && parts.join() === 'start' + L.generation && L.hasForegroundFx() && L.intensity() === 'competitive');
    await L.disable();
    check('parts stopped by the turn-off', parts[parts.length - 1] === 'stop' && !L.hasForegroundFx());

    /* a start that fails part way: everything undone, the switch stays off */
    document.failClass = true; toasts.length = 0;
    check('failed start rolled back', (await L.enable()) === false && L.state === 'off' && !head.kids.some(n => n.id === 'lm-dl-style') &&
        ctx.dyinglight1load === null && snap() === before && toasts.length === 1 && !ctx.LMEvents._has('settingsChange'));
    document.failClass = false;

    /* the settings turn it off (an import, Restore defaults' save): the theme follows */
    await L.enable();
    D.dyingLight = false; ctx.application.saveSettings(D, 'ogarioSettings');
    check('setting turned off elsewhere: theme off', L.state === 'off' && !cls.has('lm-dl'));

    /* storage refused on the turn-off: off for this visit all the same */
    await L.enable(); localStorage.full = true;
    try { await L.disable(); } catch (e) { }
    localStorage.full = false;
    check('storage full: still turned off', L.state === 'off' && !cls.has('lm-dl') && ctx.dyinglight1load === null);
    ctx.application.saveSettings(D, 'ogarioSettings');

    /* turned off while the script itself loads */
    {
        const c2 = { localStorage, document, Image: Img, console, Promise, setTimeout, clearTimeout, Object, JSON, Array, String, Number, Error,
            toastr: { warning: () => { } }, confirm: () => true, $: () => ({ off() { return this; }, on() { return this; } }), lmT: k => k };
        c2.window = c2; vm.createContext(c2);
        vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), c2);
        vm.runInContext(cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n};\nvar application = { saveSettings: function (o, n) { localStorage.setItem(n, JSON.stringify(o)); } };', c2);
        vm.runInContext(lmxText + cutIn(lmx, '/* Dying Light expansion (extras/dyinglight.js, window.LMDyingLight)', '\nfunction bluebtns()'), c2);
        const q = vm.runInContext('opendyinglight()', c2);
        vm.runInContext('stopdyinglight()', c2);
        vm.runInContext(dl, c2); scripts.shift().onload(); await tick(); flushPics(true);
        check('turned off before the script came: stays off', (await q) === false && c2.LMDyingLight.state === 'off' && c2.defaultmapsettings.dyingLight === false);
        /* the old flag of an earlier version: moved into the setting once, no question at that start */
        store.dyinglight1load = 'yes'; c2.dyinglight1load = 'yes';
        let asked = 0; c2.confirm = () => { asked++; return true; };
        vm.runInContext('lmDyingLightStartup()', c2);
        await tick(); flushPics(true); await tick();
        check('old flag "yes": moved into dyingLight, removed, on without asking', c2.defaultmapsettings.dyingLight === true && store.dyinglight1load === undefined &&
            JSON.parse(store.ogarioSettings).dyingLight === true && c2.LMDyingLight.isEnabled() && asked === 0);
        await c2.LMDyingLight.disable();
        store.dyinglight1load = 'null';
        vm.runInContext('lmDyingLightStartup()', c2);
        check('old flag "null": removed, stays off', store.dyinglight1load === undefined && c2.defaultmapsettings.dyingLight === false && c2.LMDyingLight.state === 'off');
    }

    /* an old "yes" whose script does not load, then an import that turns the switch off while the
     * pictures still load (a start with it saved on) */
    {
        const c3 = { localStorage, document, Image: Img, console: { warn() { }, log() { } }, Promise, setTimeout, clearTimeout, Object, JSON, Array, String, Number, Error,
            toastr: { warning: () => { } }, confirm: () => true, $: () => ({ off() { return this; }, on() { return this; } }), lmT: k => k };
        c3.window = c3; vm.createContext(c3);
        vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), c3);
        vm.runInContext(cutIn(main, 'var defaultmapsettings = {', '\n};') + '\n};\nvar LM_SETTINGS_DEFAULTS = Object.freeze(Object.assign({}, defaultmapsettings));\n' +
            cutIn(main, 'var _lmSettingsSeen = null', '\n/* The settings export carries'), c3);
        vm.runInContext('var application = { saveSettings: function (o, n) { var v = lmSettingsUserView(); localStorage.setItem(n, JSON.stringify(v)); lmSettingsCommit(v); } };' +
            'lmSettingsCommit(lmSettingsUserView());', c3);
        vm.runInContext(lmxText + cutIn(lmx, '/* Dying Light expansion (extras/dyinglight.js, window.LMDyingLight)', '\nfunction bluebtns()'), c3);
        const D3 = c3.defaultmapsettings;
        scripts.length = 0; pics.length = 0;
        store.dyinglight1load = 'yes'; c3.dyinglight1load = 'yes';
        vm.runInContext('lmDyingLightStartup()', c3);
        scripts.shift().onerror(); await tick();
        check('old flag "yes", script not loaded: the old readers\' flag is off', c3.dyinglight1load === null && !c3.LMDyingLight && store.dyinglight1load === undefined);
        vm.runInContext('stopdyinglight()', c3);
        check('...and the switch turns off without the script', D3.dyingLight === false && JSON.parse(store.ogarioSettings).dyingLight === false && c3.dyinglight1load === null);
        D3.dyingLight = true; c3.application.saveSettings(D3, 'ogarioSettings');
        const q = vm.runInContext('opendyinglight(true)', c3);
        vm.runInContext(dl, c3); scripts.shift().onload(); await tick();
        const loading = c3.LMDyingLight.state === 'loading' && pics.length > 0;
        D3.dyingLight = false; c3.application.saveSettings(D3, 'ogarioSettings');
        flushPics(true); await tick();
        check('import turns the switch off while the pictures load: off, stays off', loading && (await q) === false && c3.LMDyingLight.state === 'off' &&
            D3.dyingLight === false && JSON.parse(store.ogarioSettings).dyingLight === false && c3.dyinglight1load === null && !c3.LMEvents._has('settingsChange'));
        /* Restore defaults reloads the page: a theme that finishes loading then saves nothing */
        const saved = store.ogarioSettings;
        const q2 = c3.LMDyingLight.enable({ confirm: false });
        c3._lmSettingsReload = true; delete store.ogarioSettings;
        flushPics(true); await q2;
        check('Restore defaults while it loads: the settings are not saved back', store.ogarioSettings === undefined && saved !== undefined);
    }
}

dyingLightLifecycle().catch(e => { check('Dying Light lifecycle ran: ' + (e && e.stack), false); }).then(() => {
    if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
    console.log('all legacy extras checks passed');
});
