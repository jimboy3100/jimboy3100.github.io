/* Hotkeys brought back as they were: Multibox middle view (hk-middleMultiView), enlarge the
 * minimap (hk-bigMinimap), precision zoom (hk-precisionZoom, hold), all without default keys.
 * The next / previous / Undo settings profile hotkeys stay gone with the settings profiles, the
 * conflict list of the Hotkeys window stays removed (owner 2026-11-28). The real ogario/hotkeysCommand.js and the
 * real Settings.lmToggleBigMinimap / saveThemeSettings / setMiniMapWidth of ogario/ogario.v4.js
 * run in a vm.
 * node developers/tests/hotkeysrestore.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const hkSrc = read('ogario/hotkeysCommand.js');
const v4 = read('ogario/ogario.v4.js');

/* the commands, run in a vm */
{
    const calls = [];
    const ctx = { console, Object, String, Array, JSON, Math, lmT: k => k, textLanguage: {}, chatCommand: {}, toastr: { info() { } } };
    ctx.window = ctx;
    ctx.$ = () => ({ toggle() { }, trigger() { }, val() { return ''; } });
    ctx.defaultmapsettings = { middleMultiView: false };
    ctx.application = { syncHotkeyOption(k) { calls.push(['sync', k]); } };
    ctx.Settings = { lmToggleBigMinimap() { calls.push(['big']); } };
    ctx.LMHudHelpers = { precisionZoom(d) { calls.push(['precision', d]); } };
    vm.createContext(ctx);
    vm.runInContext(hkSrc, ctx);
    const hc = ctx.hotkeysCommand;
    ['hk-middleMultiView', 'hk-bigMinimap', 'hk-precisionZoom'].forEach(id =>
        check(id + ': a command without a default key, with its label', !!hc[id] && hc[id].defaultKey === '' && hc[id].label === 'settings.' + id && typeof hc[id].keyDown === 'function'));
    hc['hk-middleMultiView'].keyDown();
    check('middle view: the key turns Multibox middle view on and syncs its switch', ctx.defaultmapsettings.middleMultiView === true && JSON.stringify(calls) === JSON.stringify([['sync', 'middleMultiView']]));
    hc['hk-middleMultiView'].keyDown();
    check('middle view: again turns it off', ctx.defaultmapsettings.middleMultiView === false);
    calls.length = 0;
    hc['hk-bigMinimap'].keyDown();
    hc['hk-precisionZoom'].keyDown();
    hc['hk-precisionZoom'].keyUp();
    check('enlarge minimap and precision zoom (hold) call their code', JSON.stringify(calls) === JSON.stringify([['big'], ['precision', true], ['precision', false]]));
    check('the settings profile next / previous / Undo hotkeys stay gone', !hc['hk-lmProfileNext'] && !hc['hk-lmProfilePrev'] && !hc['hk-lmProfileUndo']);
}

/* the enlarged minimap: ~1.8x, press again to restore; the save keeps the normal width; the slider ends it */
{
    const cut = (a, b) => { const i = v4.indexOf(a), j = v4.indexOf(b, i); return i > 0 && j > i ? v4.slice(i, j) : ''; };
    const src = cut('        saveThemeSettings() {', '        restoreThemeSettings() {') + cut('        setMiniMapWidth() {', '            /* Until the first minimap frame');
    check('lmToggleBigMinimap, saveThemeSettings and setMiniMapWidth found', src.indexOf('lmToggleBigMinimap()') > 0 && src.indexOf('setMiniMapWidth()') > 0);
    const store = {};
    const css = [];
    const ctx = {
        JSON, Math, defaultSettings: { miniMapWidth: 200, miniMapTop: 20 }, ogario: { miniMapWidth: 200 },
        window: { innerWidth: 1920, innerHeight: 1080, localStorage: { setItem(k, v) { store[k] = v; } } },
        $: Object.assign(() => ({ css(o) { css.push(o.width); } }), { extend: (a, b) => Object.assign(a, b) })
    };
    vm.createContext(ctx);
    const St = vm.runInContext('({\n' + src + '\n}})', ctx);
    St.lmToggleBigMinimap();
    check('enlarge: 200 -> 360 px, the game and the HUD follow', ctx.defaultSettings.miniMapWidth === 360 && ctx.ogario.miniMapWidth === 360 && css[css.length - 1] === 360 && St._lmMiniBigOrig === 200);
    St.saveThemeSettings();
    check('enlarge: the theme save keeps the normal width', JSON.parse(store.ogarioThemeSettings).miniMapWidth === 200 && JSON.parse(store.ogarioThemeSettings).miniMapTop === 20 && ctx.defaultSettings.miniMapWidth === 360);
    St.lmToggleBigMinimap();
    check('enlarge: pressed again restores 200 px', ctx.defaultSettings.miniMapWidth === 200 && !St._lmMiniBigOrig);
    St.lmToggleBigMinimap();
    ctx.defaultSettings.miniMapWidth = 250;
    St.setMiniMapWidth();
    check('enlarge: a slider change replaces the enlarged width', !St._lmMiniBigOrig && ctx.defaultSettings.miniMapWidth === 250);
    ctx.window.innerWidth = 300; ctx.window.innerHeight = 300;
    St.lmToggleBigMinimap();
    check('enlarge: a screen too small for a bigger minimap leaves it', ctx.defaultSettings.miniMapWidth === 250 && !St._lmMiniBigOrig);
}

/* a key saved on the restored hotkeys stays; one on the settings profile hotkeys is free */
{
    const a = v4.indexOf('function lmRenameOldHotkeys(map) {'), b = v4.indexOf('\n}', a);
    const hk = { M: 'hk-middleMultiView', N: 'hk-bigMinimap', Z: 'hk-precisionZoom', F7: 'hk-lmProfileNext', F8: 'hk-lmProfilePrev', F9: 'hk-lmProfileUndo', W: 'hk-feed' };
    vm.runInNewContext(v4.slice(a, b + 2) + '\nlmRenameOldHotkeys(hk);', { hk });
    check('stored keys: restored hotkeys kept, settings profile ones dropped', JSON.stringify(hk) === JSON.stringify({ M: 'hk-middleMultiView', N: 'hk-bigMinimap', Z: 'hk-precisionZoom', W: 'hk-feed' }));
}

/* the texts of the restored hotkeys are shipped (English; other languages keep their old
 * translations); the conflict list's are not */
{
    const en = read('languages/lm-en.js'), el = read('languages/lm-el.js');
    ['settings.hk-middleMultiView', 'settings.hk-bigMinimap', 'settings.hk-precisionZoom']
        .forEach(k => check(k + ': text shipped', en.indexOf('"' + k + '"') >= 0 && el.indexOf('"' + k + '"') >= 0));
    ['settings.hk-lmProfileNext', 'settings.hk-hotkeyConflicts', 'pkg.pt.hkCheck', 'pkg.pt.hkLoading', 'modules.smalltools.noConflicts', 'modules.smalltools.cDup', 'pkg.mb.cMoved', 'pkg.mb.migratedNotes']
        .forEach(k => check(k + ': no text', en.indexOf('"' + k + '"') < 0 && el.indexOf('"' + k + '"') < 0));
}

console.log(fail ? fail + ' FAILED' : 'all hotkey restore checks passed');
process.exit(fail ? 1 : 0);
