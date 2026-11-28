/* Original Legend Mod extras, with the real code of extras/legendhelper.js, LMexpress/LMexpress.js
 * and ogario/ogario.v4.js: the Mod Info templates (six one-click looks that keep the player's
 * profiles, hotkeys and chat commands), the Dying Light expansion (loaded once from its banner,
 * its saved state kept and exported), the nick easter eggs EasterEgg1/2/3 and the Facebook bubble
 * tracker option. node developers/tests/legacyextras.js */
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
    vm.runInContext('var history = window.history; ' + cutIn(helper, 'function templatesIframe()', '\nfunction changeModLanguage2()'), ctx);
    vm.runInContext('templatesIframe()', ctx);
    const page = d.log.html['#Userscriptshud3'] || '';
    const looks = ['agariowhitesettings', 'nosoups', 'vanillabetter', 'galaxysettings', 'legenddefaultsettings', 'vanillalike'];
    check('Templates page offers the six looks', looks.every(f => page.indexOf('onclick="' + f + '()') !== -1));
    check('Templates page shows the Dying Light expansion banner', page.indexOf('opendyinglight()') !== -1 && page.indexOf('dyinglightbanner2.jpg') !== -1);
    for (const f of looks) {
        d.els['import-settings'].value = ''; d.log.clicks.length = 0;
        vm.runInContext(f + '()', ctx);
        let o = null;
        try { o = JSON.parse(d.els['import-settings'].value); } catch (e) { }
        check(f + ': a settings file is imported (Import clicked)', !!o && d.log.clicks.indexOf('#import-settings-btn') !== -1);
        check(f + ': the profiles, hotkeys and chat commands of the player are kept', !!o && !('ogarioPlayerProfiles' in o) && !('ogarioHotkeys' in o) && !('ogarioCommands' in o));
    }
    vm.runInContext('LanguagesTempIframe()', ctx);
    check('Languages page: a list of every language, the current one chosen', /legendlanguages2/.test(d.log.html['#Userscriptshud3']) && d.log.vals['#legendlanguages2'] === 1);
    check('Mod Info footer: Information, Templates, Manual templates and Languages buttons',
        ['Infobtn11', 'TemplatesBtn', 'ManualyTemplatesBtn', 'LanguagesTempBtn'].every(id => helper.indexOf('<button id="' + id + '"') !== -1));
}

/* ═══ Dying Light expansion and nick easter eggs (LMexpress) ═══ */
{
    const d = makeDom();
    const ctx = { $: d.$, document: d.document, window: {}, toastr: d.toastr, Premadeletter3: 'egg1', Premadeletter4: 'egg2', Premadeletter5: 'egg3', Premadeletter6: '' };
    vm.createContext(ctx);
    vm.runInContext(cutIn(lmx, 'function opendyinglight()', '\nfunction bluebtns()'), ctx);
    vm.runInContext(cutIn(lmx, 'function openbleedmod()', '\nfunction languagemodfun()'), ctx);
    vm.runInContext('opendyinglight()', ctx);
    check('Dying Light banner loads extras/dyinglight.js', d.log.scripts[0] === 'https://www.legendmod.ml/extras/dyinglight.js');
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
    check('Dying Light state exported and imported again', /legendSettings\.dyinglight1load = localStorage\.getItem\("dyinglight1load"\)/.test(lmx) &&
        /_lmImportSet\("dyinglight1load", LegendJSON\.legendSettings\.dyinglight1load\)/.test(lmx));
    check('the saved Dying Light state is no longer deleted on load', !/removeItem\('dyinglight1load'\)/.test(main));
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

if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
console.log('all legacy extras checks passed');
