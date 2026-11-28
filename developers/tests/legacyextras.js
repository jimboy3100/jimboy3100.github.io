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
        page.indexOf('data-lm-dl="on"') !== -1 && page.indexOf('dyinglight/interface/banner2-950.webp') !== -1 && page.indexOf('LEGENDAds2') === -1 && page.indexOf('onclick="opendyinglight') === -1);
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
         * LMDyingLight) has its one-shot clock, its threat look one of its own (4 a second) */
        (dl.slice(0, dl.indexOf('/* The Dying Light director')).match(/setTimeout\(/g) || []).length === 2 && (dl.match(/setTimeout\(/g) || []).length === 4);
    check('old banner files: static markup, no ga() or inline script',
        ['banners/bannerDyingLight', 'banners/bannerStopDyingLight'].every(f => { const t = rd(f); return /data-lm-dl="toggle"/.test(t) && !/ga\(|<script|onclick/.test(t); }));

    const store = {};
    const localStorage = {
        getItem: k => Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null,
        /* full: nothing is kept; fullBig: only the settings (the large value) are refused */
        setItem: (k, v) => { if (localStorage.full || (localStorage.fullBig && k === 'ogarioSettings')) throw new Error('QuotaExceededError'); store[k] = String(v); },
        removeItem: k => { delete store[k]; }
    };
    /* pictures: each waits until the test lets it load (ok) or fail */
    const pics = [];
    class Img { set src(u) { this._src = u; pics.push(this); } get src() { return this._src; } }
    /* an enable with its picture there at once */
    const loaded = q => { flushPics(true); return q; };
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
        /data-lm-dl="toggle"/.test(box.innerHTML) && /interface\/banner2-950\.webp/.test(box.innerHTML) && snap() === before);

    /* a new activation asks first; No leaves everything as it was */
    ctx.answer = false;
    let p = vm.runInContext('opendyinglight()', ctx);
    check('the script is loaded once, with the release version', scripts.length === 1 && /extras\/dyinglight\.js\?v=3\.7$/.test(scripts[0].src) && /aria-busy/.test(box.innerHTML));
    await runScript();
    check('refused at the question: off, nothing saved', (await p) === false && ctx.LMDyingLight.state === 'off' && snap() === before && pics.length === 0);
    check('refused at the question: the banner offers it again (not left loading)', !/aria-busy/.test(box.innerHTML) && /interface\/banner2-950\.webp/.test(box.innerHTML));

    ctx.answer = true;
    p = vm.runInContext('opendyinglight()', ctx);
    await tick();
    check('no second script load', scripts.length === 0 && ctx.LMDyingLight.state === 'loading');
    flushPics(true);
    check('on after the pictures', (await p) === true && ctx.LMDyingLight.isEnabled() && D.dyingLight === true && JSON.parse(store.ogarioSettings).dyingLight === true);
    check('on: the old readers see the flag (no global zombie picture), the scoped style is there, the banner turns it off',
        ctx.dyinglight1load === 'yes' && ctx.cimgDyingLight === undefined && cls.has('lm-dl') && head.kids.some(n => n.id === 'lm-dl-style') && /interface\/banner3-950\.webp/.test(box.innerHTML) &&
        /interface\/teamboard-323\.webp/.test(head.kids.find(n => n.id === 'lm-dl-style').textContent));
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
    {
        /* an import (or Undo preset) changes the intensity setting while on: the theme follows */
        D.dyingLightIntensity = 'nightmare'; ctx.application.saveSettings(D, 'ogarioSettings');
        const followed = ctx.LMDyingLight.intensity() === 'nightmare';
        D.dyingLightIntensity = 'immersive'; ctx.application.saveSettings(D, 'ogarioSettings');
        check('the intensity follows its setting changed elsewhere while on', followed && ctx.LMDyingLight.intensity() === 'immersive');
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

    /* on again: no new script; the scene was let go at the turn-off (the browser's cache has it) */
    states.length = 0;
    p = vm.runInContext('lmDyingLightToggle()', ctx);
    await tick();
    const asked = pics.length === 1 && /back0-1920\.webp$/.test(pics[0].src) && !pics.some(im => /skins\//.test(im.src));
    check('on again: the scene asked again (released at the turn-off), no separate zombie picture', asked && (await loaded(p)) === true && L.isEnabled() && pics.length === 0);
    await L.disable(); await L.disable();
    check('disable twice: off once', L.state === 'off' && states.join() === 'loading,on,disabling,off' && snap() === before);
    /* changed while off (an import): the next activation uses it */
    D.dyingLightIntensity = 'nightmare'; ctx.application.saveSettings(D, 'ogarioSettings');
    await loaded(L.enable());
    const offFollowed = L.intensity() === 'nightmare';
    await L.disable();
    D.dyingLightIntensity = 'immersive'; ctx.application.saveSettings(D, 'ogarioSettings');
    check('the intensity setting changed while off is used by the next activation', offFollowed && snap() === before);

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
    check('one enable at a time', p === p2 && (await loaded(p)) === true && parts.join() === 'start' + L.generation && L.hasForegroundFx() && L.intensity() === 'competitive');
    await L.disable();
    check('parts stopped by the turn-off', parts[parts.length - 1] === 'stop' && !L.hasForegroundFx());

    /* a start that fails part way: everything undone, the switch stays off */
    document.failClass = true; toasts.length = 0;
    check('failed start rolled back', (await loaded(L.enable())) === false && L.state === 'off' && !head.kids.some(n => n.id === 'lm-dl-style') &&
        ctx.dyinglight1load === null && snap() === before && toasts.length === 1 && !ctx.LMEvents._has('settingsChange'));
    document.failClass = false;

    /* the settings turn it off (an import, Restore defaults' save): the theme follows */
    await loaded(L.enable());
    D.dyingLight = false; ctx.application.saveSettings(D, 'ogarioSettings');
    check('setting turned off elsewhere: theme off', L.state === 'off' && !cls.has('lm-dl'));

    /* storage refused on the turn-off: off for this visit all the same */
    await loaded(L.enable()); localStorage.full = true; toasts.length = 0;
    try { await L.disable(); } catch (e) { }
    localStorage.full = false;
    check('storage full: still turned off', L.state === 'off' && !cls.has('lm-dl') && ctx.dyinglight1load === null);
    check('storage full: the turn-off is not kept and the player is told', L.saved() === false && JSON.parse(store.ogarioSettings).dyingLight === true &&
        toasts.indexOf('pkg.dlv4life.notSaved') >= 0);
    ctx.application.saveSettings(D, 'ogarioSettings');
    check('...a later save keeps it off', JSON.parse(store.ogarioSettings).dyingLight === false);

    /* only the settings refused (the large value): the turn-off is kept in the small old flag and a
     * reload with the old settings (switch on) stays off */
    await loaded(L.enable()); localStorage.fullBig = true; toasts.length = 0;
    try { await L.disable(); } catch (e) { }
    check('settings refused: off, kept in the old flag, nothing more to tell', L.state === 'off' && L.saved() === 'flag' && store.dyinglight1load === 'no' &&
        JSON.parse(store.ogarioSettings).dyingLight === true && toasts.indexOf('pkg.dlv4life.notSaved') < 0);
    {
        /* the reload: the settings as stored (on), the start reads the old flag first */
        D.dyingLight = JSON.parse(store.ogarioSettings).dyingLight;
        localStorage.fullBig = false; pics.length = 0;
        vm.runInContext('lmDyingLightStartup()', ctx);
        await tick();
        check('...the reload stays off (the flag moved into the setting, then removed)', D.dyingLight === false && L.state === 'off' && pics.length === 0 &&
            JSON.parse(store.ogarioSettings).dyingLight === false && store.dyinglight1load === undefined);
    }

    /* a picture that is still loading at the turn-off: its wait ends then, nothing is kept */
    {
        pics.length = 0;
        const q = L.enable(); const im = pics[pics.length - 1];
        await L.disable();
        check('turned off while the scene loads: the wait ends at once, the picture let go', !!im && (await q) === false && im.onload === null && im.onerror === null &&
            L.state === 'off');
        pics.length = 0;
    }
    /* a phone or a weak device: the small scene and the 256 px zombie skins */
    {
        ctx.isMobile = true;
        const q = L.enable(); const src = pics.length === 1 ? pics[0].src : '';
        await loaded(q);
        const k = L.getFallbackSkinKey(other), bgUrl = L.getBackground() && L.getBackground().url;
        await L.disable();
        check('phone: the small scene and the 256 px skins (one design per name as before)', /back0-1280\.webp$/.test(src) && /-256\.webp$/.test(k) &&
            L.variants.some(v => v.small === k) && /back0-1280\.webp$/.test(bgUrl));
        ctx.isMobile = undefined; ctx.navigator = { deviceMemory: 2 };
        await loaded(L.enable());
        const k2 = L.getFallbackSkinKey(other);
        await L.disable();
        ctx.navigator = { deviceMemory: 8, hardwareConcurrency: 8 };
        await loaded(L.enable());
        const k3 = L.getFallbackSkinKey(other);
        await L.disable();
        delete ctx.navigator;
        check('little memory: 256 px; a strong device: 512 px', /-256\.webp$/.test(k2) && /-512\.webp$/.test(k3) && L.variants.some(v => v.key === k3));
    }

    /* a part whose start fails after making something: stopped at once; an optional one fails
     * alone, an essential one undoes the whole activation */
    {
        const made = { opt: 0, ess: 0 }, boom = { opt: false, ess: false, stop: false };
        L.addPart({ name: 'opt', fx: true, start() { made.opt = 1; if (boom.opt) throw new Error('opt'); }, stop() { made.opt = 0; } });
        L.addPart({ name: 'ess', essential: true, start() { made.ess = 1; if (boom.ess) throw new Error('ess'); }, stop() { made.ess = 0; } });
        boom.opt = true; toasts.length = 0;
        const on1 = await loaded(L.enable());
        check('optional part fails: on without it, what it made is gone', on1 === true && L.isEnabled() && made.opt === 0 && made.ess === 1 && toasts.length === 0);
        await L.disable();
        boom.opt = false; boom.ess = true; toasts.length = 0;
        const on2 = await loaded(L.enable());
        check('essential part fails: off, every part and the style undone, the switch not saved', on2 === false && L.state === 'off' && made.opt === 0 && made.ess === 0 &&
            !cls.has('lm-dl') && !head.kids.some(n => n.id === 'lm-dl-style') && ctx.dyinglight1load === null && D.dyingLight === false &&
            !ctx.LMEvents._has('settingsChange') && toasts.length === 1);
        boom.ess = false;
        /* a stop that throws: the turn-off goes on with the rest */
        L.addPart({ name: 'badstop', start() { }, stop() { if (boom.stop) throw new Error('stop'); } });
        await loaded(L.enable());
        boom.stop = true;
        await L.disable();
        boom.stop = false;
        check('a part whose stop throws: everything else still cleaned up', L.state === 'off' && made.opt === 0 && made.ess === 0 && !cls.has('lm-dl') &&
            !head.kids.some(n => n.id === 'lm-dl-style') && ctx.dyinglight1load === null && !ctx.LMEvents._has('settingsChange') && L.getBackground() === null);
        /* turned off by a listener of a transition: the activation stops there */
        let offAt = 'loading';
        const offer = d => { if (d.state === offAt) L.disable(); };
        ctx.LMEvents.on('dyingLightChange', offer);
        pics.length = 0;
        const q1 = L.enable();
        check('turned off by a listener of "loading": no picture asked, no listener left', (await q1) === false && L.state === 'off' && pics.length === 0 &&
            !ctx.LMEvents._has('settingsChange') && D.dyingLight === false);
        offAt = 'on';
        const q2 = L.enable();
        check('turned off by a listener of "on": reported off, nothing left', (await loaded(q2)) === false && L.state === 'off' && made.ess === 0 && made.opt === 0 &&
            !cls.has('lm-dl') && D.dyingLight === false && JSON.parse(store.ogarioSettings).dyingLight === false);
        ctx.LMEvents.off('dyingLightChange', offer);
        /* a part that turns it off while it starts: the parts after it never start, it is stopped */
        let selfOff = true, selfStopped = 0;
        L.addPart({ name: 'selfoff', start() { if (selfOff) L.disable(); }, stop() { selfStopped++; } });
        L.addPart({ name: 'after', start() { made.after = 1; }, stop() { made.after = 0; } });
        const q3 = L.enable();
        check('turned off while a part starts: off, nothing left, later parts not started, the switch not saved on', (await loaded(q3)) === false && L.state === 'off' &&
            made.ess === 0 && made.opt === 0 && !made.after && selfStopped === 1 && !cls.has('lm-dl') && D.dyingLight === false && JSON.parse(store.ogarioSettings).dyingLight === false);
        selfOff = false;
    }

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
        check('...and its banner is not left loading', !/aria-busy/.test(box.innerHTML));
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
        c3._lmSettingsReload = false;
    }

    /* the question in Legend's dialog look (no browser confirm): what it does, the intensity,
     * "your gameplay settings stay unchanged"; Cancel / Esc / a click beside it / a turn-off say no */
    {
        let focused = null;
        const mkEl = tag => ({ tag, kids: [], attrs: {}, style: {}, ls: {}, parentNode: null, className: '', textContent: '',
            appendChild(n) { n.parentNode = this; this.kids.push(n); return n; },
            removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; },
            setAttribute(k, v) { this.attrs[k] = String(v); }, addEventListener(n, f) { this.ls[n] = f; }, focus() { focused = this; } });
        const body4 = mkEl('body'), dLs = {};
        const doc4 = { head: mkEl('head'), body: body4, documentElement: { classList: { add() { }, remove() { } } }, createElement: mkEl,
            addEventListener(n, f) { (dLs[n] = dLs[n] || []).push(f); }, removeEventListener(n, f) { dLs[n] = (dLs[n] || []).filter(x => x !== f); } };
        const all = (n, out = []) => { out.push(n); n.kids.forEach(k => all(k, out)); return out; };
        const text = n => all(n).map(x => x.textContent).join(' ');
        let natives = 0, saves4 = 0, uiKit = 0;
        const c4 = { document: doc4, Image: Img, console: { warn() { }, log() { } }, Promise, setTimeout, clearTimeout, Object, JSON, Array, String, Number, Error, Map,
            confirm: () => { natives++; return true; }, lmT: k => k, _lmEnsureModalCSS: () => { uiKit++; },
            defaultmapsettings: { dyingLight: false, dyingLightIntensity: 'immersive' }, application: { saveSettings: () => { saves4++; } } };
        c4.window = c4; vm.createContext(c4);
        vm.runInContext(dl, c4);
        const L4 = c4.LMDyingLight, D4 = c4.defaultmapsettings;
        const dialog = () => body4.kids.find(n => n.id === 'lm-dl-ask');
        const buttons = () => all(dialog()).filter(n => n.tag === 'button');
        const btn = v => buttons().find(b => b._lmV === v || b.textContent === v);
        let q = L4.enable({ confirm: true });
        const dg = dialog();
        check('the question: Legend\'s dialog (shared window chrome), not the browser\'s', !!dg && natives === 0 && uiKit === 1 && /lm-modal-overlay/.test(dg.className) &&
            /lm-modal-container/.test(dg.kids[0].className) && dg.attrs.role === 'dialog' && dg.attrs['aria-modal'] === 'true' && L4.state === 'off');
        check('...it says what it does, offers the three intensities (the saved one chosen) and that the gameplay settings stay',
            /pkg\.dlv4p\.intro/.test(text(dg)) && /pkg\.dlv4p\.kept/.test(text(dg)) && buttons().length === 5 &&
            ['competitive', 'immersive', 'nightmare'].every(v => !!btn(v) && text(btn(v)).includes('pkg.dlv3dir.' + v) && text(btn(v)).includes('pkg.dlv4p.' + v + 'Tip')) &&
            btn('immersive').attrs['aria-pressed'] === 'true' && focused === btn('pkg.dlv3life.turnOn'));
        check('one question at a time', L4.enable({ confirm: true }) !== null && body4.kids.filter(n => n.id === 'lm-dl-ask').length === 1);
        btn('nightmare').ls.click({});
        check('an intensity picked is shown as picked', btn('nightmare').attrs['aria-pressed'] === 'true' && btn('immersive').attrs['aria-pressed'] === 'false');
        btn('pkg.dlv3life.turnOn').ls.click({});
        await tick(); flushPics(true); await tick(); flushPics(true);
        check('Turn on: on with the intensity picked (its setting saved), the dialog and its key listener gone',
            (await q) === true && L4.isEnabled() && L4.intensity() === 'nightmare' && D4.dyingLightIntensity === 'nightmare' && D4.dyingLight === true &&
            !dialog() && (dLs.keydown || []).length === 0);
        await L4.disable();
        saves4 = 0;
        q = L4.enable({ confirm: true });
        (dLs.keydown || []).forEach(f => f({ key: 'Escape', preventDefault() { } }));
        check('Esc: no, off, nothing saved, nothing left', (await q) === false && L4.state === 'off' && !dialog() && saves4 === 0 && D4.dyingLight === false &&
            D4.dyingLightIntensity === 'nightmare' && (dLs.keydown || []).length === 0);
        q = L4.enable({ confirm: true });
        btn('competitive').ls.click({});
        btn('pkg.dlv4p.cancel').ls.click({});
        check('Cancel: no, the intensity not changed', (await q) === false && L4.state === 'off' && D4.dyingLightIntensity === 'nightmare' && saves4 === 0);
        q = L4.enable({ confirm: true });
        dialog().ls.click({ target: dialog() });
        check('a click beside the dialog: no', (await q) === false && !dialog());
        q = L4.enable({ confirm: true });
        await L4.disable();
        check('turned off while it asks: answered no, the dialog gone', (await q) === false && !dialog() && L4.state === 'off');
        check('no browser question at all', natives === 0);
    }
}

/* ═══ Dying Light texts: every text it shows has its English text (the other languages fall back
 * to English until a translation pass) and is in the English pack the game loads ═══ */
{
    const dlSrc = rd('extras/dyinglight.js');
    const dlLmx = cutIn(lmx, '/* Dying Light expansion (extras/dyinglight.js, window.LMDyingLight)', '\nfunction bluebtns()');
    const used = new Set();
    for (const s of [dlSrc, dlLmx]) {
        for (const m of s.matchAll(/(?:\btx|_lmxE|_lmxT|lmT)\(\s*(['"])([A-Za-z0-9_.]+)\1\s*[,)]/g)) used.add(m[2]);
        /* and every whole text key written out (a choice between texts: a ? 'x' : 'y') */
        for (const m of s.matchAll(/(['"])(pkg\.dl[a-z0-9]+\.[A-Za-z0-9_]+)\1(?!\s*\+)/g)) used.add(m[2]);
        /* keys put together from a part and a name: every name it can take */
        for (const m of s.matchAll(/(?:\btx|_lmxE|_lmxT|lmT)\(\s*(['"])([A-Za-z0-9_.]+)\1\s*\+/g)) used.add(m[2] + '*');
    }
    const expand = { 'pkg.dlv3dir.*': ['competitive', 'immersive', 'nightmare'], 'pkg.dlv3dir.radio*': ['1', '2', '3'] };
    const keys = [];
    used.forEach(k => {
        if (!k.endsWith('*')) { keys.push(k); return; }
        if (k === 'pkg.dlv4p.*') ['competitive', 'immersive', 'nightmare'].forEach(v => keys.push('pkg.dlv4p.' + v + 'Tip'));
        else if (expand[k]) expand[k].forEach(v => keys.push(k.slice(0, -1) + v));
        else keys.push(k);
    });
    /* the opt() helper of the banner controls passes its key as a variable */
    keys.push('pkg.dlv3dir.competitive', 'pkg.dlv3dir.immersive', 'pkg.dlv3dir.nightmare', 'pkg.dlv3dir.cycle', 'pkg.dlv3dir.scares');
    const srcDir = path.join(root, 'developers', 'i18n', 'src'), all = {};
    for (const f of fs.readdirSync(srcDir).filter(f => f.endsWith('.json'))) Object.assign(all, JSON.parse(fs.readFileSync(path.join(srcDir, f), 'utf8')));
    const enPack = rd('languages/lm-en.js');
    const uniq = [...new Set(keys)];
    const missing = uniq.filter(k => k.endsWith('*') || !all[k] || typeof all[k].en !== 'string' || !all[k].en.trim() || enPack.indexOf(JSON.stringify(k) + ': ') < 0);
    check('Dying Light texts: all ' + uniq.length + ' keys it shows have English and are in the English pack' + (missing.length ? ' (missing: ' + missing.join(', ') + ')' : ''),
        uniq.length >= 20 && missing.length === 0);
}

dyingLightLifecycle().catch(e => { check('Dying Light lifecycle ran: ' + (e && e.stack), false); }).then(() => {
    if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
    console.log('all legacy extras checks passed');
});
