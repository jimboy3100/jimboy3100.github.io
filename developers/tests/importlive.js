/* Import settings / cloud Download without reloading the page (owner, 2026-11-28), with the real
 * functions cut out of ogario.v4.js and LMexpress.js:
 * - the import writes as before (all or nothing), then puts the values into the running game
 *   (_lmImportLive: settings, theme, hotkeys, commands, player profiles, phone controls); it never
 *   reloads by itself, only the Reload now button of a part read at the next load does
 * - lmImportExtras writes every registered key
 * - Legend Mod settings: memory keys (last mode, nick, address, open count) need no reload, the
 *   language switches at once, an unchanged value is nothing, any other changed key and new user
 *   scripts offer a Reload
 * node developers/tests/importlive.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repo = path.resolve(__dirname, '..', '..');
const og = fs.readFileSync(path.join(repo, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const lmx = fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : ' -> ' + JSON.stringify(info)));
    if (!ok) fail++;
}
const cut = (src, start, end) => { const a = src.indexOf(start); const b = src.indexOf(end, a); return a < 0 || b < 0 ? '' : src.slice(a, b); };

/* the core import */
const imp = cut(og, '        importSettings() {', '        restoreSettings() {');
check('importSettings found', imp.length > 0);
check('import: writes everything first, then applies it live', imp.includes("var importKeys = ['ogarioCommands', 'ogarioHotkeys', 'ogarioPlayerProfiles', 'ogarioSettings', 'ogarioThemeSettings'];") &&
    imp.indexOf('var _impNeed = this._lmImportLive(importValue, _impSelected, _impBackup, _impTouched);') > imp.indexOf('fullRolledBack'));
check('import: no reload by itself, only from the Reload now button', (imp.match(/location\.reload\(\)/g) || []).length === 1 &&
    /'\.lm-import-reload', function \(\) \{\s*window\._lmSettingsReload = true;\s*window\.location\.reload\(\);/.test(imp));
check('import: settings through setSettings, theme, hotkeys with new defaults, commands, player profiles', imp.includes('        _lmImportLive(v, sel, backup, touched) {') &&
    imp.includes('app.setSettings(k, sv[k]);') && !imp.includes('performanceMode') && !imp.includes('lmPerfBackup') && imp.includes('Settings.setTheme(); Settings.saveThemeSettings();') &&
    imp.includes("if (typeof dk === 'string' && dk && !own(h, dk)) h[dk] = c;") && imp.includes('this._lmImportCommandsLive()') && imp.includes('this._lmImportProfilesLive()'));
check('import: anti-aliasing, gamepad, voice and HUD layouts offer Reload when they changed', imp.includes("need.push('glAntialias')") &&
    imp.includes("['lmGamepad', 'prefix', 'lang', 'lmHudLayouts'].forEach(function (k) { if (changed(k)) need.push(k); });"));
check('import: a part read at the next load offers Reload (button), else a done notice', imp.includes('        _lmImportDone(need) {') && imp.includes("'game1.import.needsReload'") && imp.includes("'game1.import.done'"));
check('no settings profiles module to depend on', !og.includes('LMProfiles') && !fs.existsSync(path.join(repo, 'ogario', 'modules', 'profiles.js')));

/* lmImportExtras */
const extrasSrc = cut(og, 'var LM_EXPORT_KEYS = [', '/* the registered keys found in storage ls') + cut(og, 'function lmImportExtras(', '/* The move of the old Skin collections');
check('lmImportExtras found', extrasSrc.length > 0);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(extrasSrc + '\nthis.lmImportExtras = lmImportExtras;', ctx);
const wrote = {}, removed = [];
/* lmPerfBackup: the copy of the removed Performance mode, not imported any more */
const src = { 'lm-mobile-prefs': { a: 1 }, lmGamepad: { b: 1 }, prefix: '!', lmPerfBackup: { c: 1 } };
ctx.lmImportExtras(src, (k, v) => { wrote[k] = v; }, k => removed.push(k), null, () => null);
check('extras: the registered keys of the export are written, a cleared one without a value removed', wrote['lm-mobile-prefs'] === '{"a":1}' && wrote.lmGamepad === '{"b":1}' &&
    wrote.prefix === '!' && removed.indexOf('lmPresetUndo') !== -1, { wrote: Object.keys(wrote), removed });
check('extras: a Performance mode copy in an export is ignored (neither written nor removed)', !('lmPerfBackup' in wrote) && removed.indexOf('lmPerfBackup') === -1);

/* Legend Mod settings */
const setSrc = cut(lmx, 'var _LM_IMPORT_LIVE_KEYS = ', '/* Imported user scripts (Userscript1-5 URLs');
check('LMexpress: _lmImportSet found', setSrc.length > 0);
const store = { gamemode: ':ffa', note1: 'old', languagemod: '1' }, langs = [];
const w = { _lmImportReload: [] };
const lc = {
    window: w, String, Array,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    $: () => ({ length: 0 }),
    changeModLanguage() { }
};
w.LMi18n = { setLang: n => langs.push(n) };
vm.createContext(lc);
vm.runInContext(setSrc + '\nthis._lmImportSet = _lmImportSet;', lc);
lc._lmImportSet('gamemode', ':experimental');
lc._lmImportSet('previousnickname', 'Me');
check('Legend: memory keys need no reload', w._lmImportReload.length === 0 && store.gamemode === ':experimental');
lc._lmImportSet('note1', 'old');
check('Legend: an unchanged value is nothing', w._lmImportReload.length === 0);
lc._lmImportSet('note1', 'new');
lc._lmImportSet('minimapbckimg', '');
check('Legend: a changed key read at load offers Reload; empty over nothing is no change', JSON.stringify(w._lmImportReload) === '["note1"]', w._lmImportReload);
lc._lmImportSet('languagemod', '5');
check('Legend: the language switches at once, no Reload for it', JSON.stringify(langs) === '["5"]' && w._lmImportReload.indexOf('languagemod') === -1);
check('Legend: new user scripts offer Reload', /localStorage\.setItem\("UserscriptEnabled" \+ slot, "1"\);\n    \}\);\n    \/\* a user script runs when the page loads: the import offers a Reload \*\/\n    if \(Array\.isArray\(window\._lmImportReload\)\) window\._lmImportReload\.push\('userscripts'\);/.test(lmx));
check('Legend: the list starts with each Legend Mod import, none without it', lmx.includes('        window._lmImportReload = [];\n        saveLegendJSONAPI();') && lmx.includes('        window._lmImportReload = null;\n        $("#import-settings-btn").click();'));

console.log(fail ? fail + ' failed' : 'all import checks passed');
process.exit(fail ? 1 : 0);
