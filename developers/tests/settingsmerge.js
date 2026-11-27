/* Settings that became one choice, with the real code of ogario/ogario.v4.js:
 *   Mass format: "Short mass" + "Mass format" (0 = as Short mass) are massFormat 1 / 2 / 3; the old
 *   key stays a copy (lmFoldLegacySettings on load, import, profiles; setSettings for scripts).
 *   Game stats position and Theme > Chat "Chat Position" are gone (the HUD editor places the boxes):
 *   a saved place other than the default goes once into the HUD layout (lmHudAdoptOld, lmHudAdopt).
 *   Cursor tracking: the bubble tracker is its bubble look; an old set with the bubble alone gets
 *   Cursor tracking on, and setSettings keeps the pair so (Cursor tracking off takes the look off).
 * node developers/tests/settingsmerge.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const J = v => JSON.stringify(v);

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); } };
}
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = makeStorage();
ctx.LMEvents = { _has() { return false; }, emit() { } };
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext('var profiles = [];', ctx);
const D = ctx.LM_SETTINGS_DEFAULTS, V = ctx.lmSettingValue;
const fold = (o) => { ctx._f = o; const r = vm.runInContext('typeof lmFoldLegacySettings === "function" ? lmFoldLegacySettings(_f) : null', ctx); return [ctx._f, r]; };
const pick = (o, keys) => { const r = {}; keys.forEach(k => { r[k] = o[k]; }); return r; };
const M = ['massFormat', 'shortMass'];

// ── 1. Mass format
check('mass: the fold exists', typeof vm.runInContext('typeof lmFoldLegacySettings', ctx) === 'string' && vm.runInContext('typeof lmFoldLegacySettings', ctx) === 'function');
check('mass: the default is 12.3k (2) with its Short mass copy on, as before (Short mass on, format 0)', D.massFormat === 2 && D.shortMass === true);
check('mass: 0 is no mode any more (1 exact, 2 12.3k, 3 auto)', V('massFormat', 0) === 1 && V('massFormat', 3) === 3 && V('massFormat', 2) === 2);
check('mass: old Short mass on + format 0 -> 12.3k', J(pick(fold({ shortMass: true, massFormat: 0 })[0], M)) === J({ massFormat: 2, shortMass: true }));
check('mass: old Short mass off + format 0 -> exact', J(pick(fold({ shortMass: false, massFormat: 0 })[0], M)) === J({ massFormat: 1, shortMass: false }));
check('mass: old "false" string + format "0" -> exact', J(pick(fold({ shortMass: 'false', massFormat: '0' })[0], M)) === J({ massFormat: 1, shortMass: false }));
check('mass: a chosen mode wins over the switch (it did before): 3 auto, 1 exact', J(pick(fold({ shortMass: true, massFormat: 3 })[0], M)) === J({ massFormat: 3, shortMass: false }) && J(pick(fold({ shortMass: true, massFormat: 1 })[0], M)) === J({ massFormat: 1, shortMass: false }));
check('mass: a save from before Mass format existed (only the switch)', J(pick(fold({ shortMass: false })[0], M)) === J({ massFormat: 1, shortMass: false }) && J(pick(fold({ shortMass: true })[0], M)) === J({ massFormat: 2, shortMass: true }));
check('mass: format 0 without the switch = the switch default (on)', J(pick(fold({ massFormat: 0 })[0], M)) === J({ massFormat: 2, shortMass: true }));
check('mass: an unusable format falls back to the switch, as it did', J(pick(fold({ massFormat: 'x', shortMass: false })[0], M)) === J({ massFormat: 1, shortMass: false }));
const again = fold({ massFormat: 2, shortMass: true });
check('mass: a new save is left as it is (folded once)', again[1] === false && J(pick(again[0], M)) === J({ massFormat: 2, shortMass: true }));
check('mass: other settings are not touched', J(fold({ showMass: false })[0]) === J({ showMass: false }) && fold({ showMass: false })[1] === false);

// the import path (the real loop of importSettings)
const impLoop = cut("                    var _impS = importValue.ogarioSettings;", "                if (Object.prototype.hasOwnProperty.call(importValue, 'ogarioThemeSettings')");
const runImport = (s) => { const v = { ogarioSettings: s }; vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(v); return v.ogarioSettings; };
check('mass: an old export with Short mass off keeps exact mass', J(pick(runImport({ shortMass: false, massFormat: 0 }), M)) === J({ massFormat: 1, shortMass: false }));

// the real loadSettings: an old save is folded and rewritten
const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
ctx.ogario = {};
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, D, { shortMass: false, massFormat: 0 })));
app.loadSettings();
const S = ctx.defaultmapsettings, reSaved = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('mass: load of an old save with Short mass off -> exact, save rewritten', S.massFormat === 1 && S.shortMass === false && reSaved.massFormat === 1);

// the real setSettings: scripts and older addons still set the old key or 0
const app2 = vm.runInContext('({\n' + cut('        setSettings(id, checked) {', '        profiling() {') + cut('        _lmChoiceSync(name) {', '        addSliderBox(id, name') + '\n})', ctx);
app2.saveSettings = function () { };
app2._lmLoadOptSounds = function () { };
ctx.hotkeys = {};
ctx.$ = (q) => ({ length: 0, prop() { }, val() { }, text() { }, css() { }, show() { }, hide() { }, toggle() { }, toggleClass() { }, addClass() { }, removeClass() { }, attr() { }, on() { }, off() { }, find() { return this; }, closest() { return this; }, each() { } });
ctx.toastr = { info() { }, warning() { }, success() { } };
ctx.legendmod = {};
ctx.lmT = k => k;
ctx._lmG1tag = () => '';
const sel = { tagName: 'SELECT', value: '' };
ctx.document = { getElementById: id => (id === 'massFormat' ? sel : null), createElement: () => ({}), head: { appendChild() { } } };
app2.setSettings('massFormat', 2);
check('mass: choosing 12.3k turns the Short mass copy on and shows it in the dropdown', S.massFormat === 2 && S.shortMass === true && sel.value === '2');
app2.setSettings('shortMass', false);
check('mass: a script turning Short mass off picks exact', S.massFormat === 1 && S.shortMass === false && sel.value === '1');
app2.setSettings('massFormat', 3);
app2.setSettings('shortMass', true);
check('mass: Short mass in auto changes nothing (as before)', S.massFormat === 3 && S.shortMass === false);
app2.setSettings('massFormat', 2);
app2.setSettings('massFormat', 0);
check('mass: a script setting format 0 ("as Short mass") keeps 12.3k', S.massFormat === 2 && S.shortMass === true);

// -- 2. Game stats position and Chat Position are the HUD editor's now (one place for HUD positions)
const adoptQ = () => JSON.parse(ctx.localStorage.getItem('lmHudAdopt') || 'null');
const E_BL = { h: 'l', x: 10, v: 'b', y: 10, s: 1 }, E_BC = { h: 'c', x: 0, v: 'b', y: 10, s: 1 };
check('stats: no Game stats position setting any more, nor its two old switches', !('statsPosition' in D) && !('fpsAtTop' in D) && !('statsAtCenter' in D) && V('statsPosition', 'center') === undefined && V('fpsAtTop', true) === undefined);
check('popups: no toast position setting (positionClass) either', !('positionClass' in D) && V('positionClass', 'toast-top-right') === undefined);
const loadOld = (extra) => { ctx.localStorage.removeItem('lmHudAdopt'); ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, D, extra))); app.loadSettings(); return JSON.parse(ctx.localStorage.getItem('ogarioSettings')); };
let sv = loadOld({ statsPosition: 'center', fpsAtTop: true, statsAtCenter: true });
check('stats: a saved bottom centre goes once into the HUD layout (centred, 10 px up); the old keys leave the save', J(adoptQ()) === J({ stats: E_BC }) && !('statsPosition' in sv) && !('fpsAtTop' in sv) && !('statsAtCenter' in sv) && !('statsPosition' in S));
ctx.localStorage.removeItem('lmHudAdopt');
app.loadSettings();
check('stats: once: the next load leaves nothing for the layout', adoptQ() === null);
loadOld({ statsPosition: 'bottom' });
check('stats: bottom left -> 10 px from the left and the bottom', J(adoptQ()) === J({ stats: E_BL }));
loadOld({ fpsAtTop: false, statsAtCenter: false });
check('stats: an older save with the two switches (top off) -> bottom left', J(adoptQ()) === J({ stats: E_BL }));
loadOld({ fpsAtTop: 'false', statsAtCenter: 'true' });
check('stats: an older save with the centre on (it won over the top) -> bottom centre', J(adoptQ()) === J({ stats: E_BC }));
sv = loadOld({ statsPosition: 'top', fpsAtTop: true, statsAtCenter: false });
check('stats: at the top (the default place) nothing goes to the layout; the keys still leave the save', adoptQ() === null && !('statsPosition' in sv) && !('fpsAtTop' in sv));
/* the HUD editor already loaded (an import loads the settings again): it takes the place at once */
let taken = 0;
ctx.LMHudEditor = { adoptPending() { taken++; } };
loadOld({ statsPosition: 'bottom' });
check('stats: a loaded HUD editor is asked to take it', taken === 1);
delete ctx.LMHudEditor;
/* Theme > Chat "Chat Position": the corner of the chat popups (the real loadThemeSettings) */
const ST = vm.runInContext('({' + String.fromCharCode(10) + cut('        loadThemeSettings() {', '        saveThemeSettings() {') + '        saveThemeSettings() { }' + String.fromCharCode(10) + '})', ctx);
const TDf = ctx.LM_THEME_DEFAULTS;
const loadTheme = (extra, keepQ) => { if (!keepQ) ctx.localStorage.removeItem('lmHudAdopt'); ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(Object.assign({}, TDf, extra))); ST.loadThemeSettings(); return JSON.parse(ctx.localStorage.getItem('ogarioThemeSettings')); };
check('popups: no Chat Position theme setting any more', !('chatPos' in TDf) && ctx.lmThemeValue('chatPos', 'topright') === undefined && typeof ctx.chatPositions === 'undefined');
let tv = loadTheme({ chatPos: 'topright' });
check('popups: a saved top right corner goes once into the HUD layout (12 px from both edges); the key leaves the save', J(adoptQ()) === J({ popups: { h: 'r', x: 12, v: 't', y: 12, s: 1 } }) && !('chatPos' in tv) && !('chatPos' in ctx.defaultSettings));
ctx.localStorage.removeItem('lmHudAdopt');
ST.loadThemeSettings();
check('popups: once: the next load leaves nothing for the layout', adoptQ() === null);
loadTheme({ chatPos: 'topleft' });
check('popups: top left', J(adoptQ()) === J({ popups: { h: 'l', x: 12, v: 't', y: 12, s: 1 } }));
loadTheme({ chatPos: 'bottomright' });
check('popups: bottom right', J(adoptQ()) === J({ popups: { h: 'r', x: 12, v: 'b', y: 12, s: 1 } }));
tv = loadTheme({ chatPos: 'bottomleft' });
check('popups: bottom left (the default) and unknown corners: nothing for the layout, the key leaves the save', adoptQ() === null && !('chatPos' in tv) && (loadTheme({ chatPos: '__proto__' }), adoptQ() === null));
loadOld({ statsPosition: 'center' });
loadTheme({ chatPos: 'topright' }, true);
check('stats and popups together: both wait for the layout', J(adoptQ()) === J({ stats: E_BC, popups: { h: 'r', x: 12, v: 't', y: 12, s: 1 } }));
ctx.localStorage.removeItem('lmHudAdopt');

// ── 3. Cursor tracking looks: the bubble tracker is the bubble look of Cursor tracking
const CT = ['cursorTracking', 'bubbleCursorTracker'];
check('cursor: an old set with the bubble alone gets Cursor tracking on (the same bubble is drawn)', J(pick(fold({ cursorTracking: false, bubbleCursorTracker: true })[0], CT)) === J({ cursorTracking: true, bubbleCursorTracker: true }) && fold({ cursorTracking: false, bubbleCursorTracker: true })[1] === true);
check('cursor: ... also without a cursorTracking key, and with a stored "true"', fold({ bubbleCursorTracker: true })[0].cursorTracking === true && fold({ bubbleCursorTracker: 'true', cursorTracking: 'false' })[0].cursorTracking === true);
check('cursor: the line look, both on, both off and no keys are left as they are', [{ cursorTracking: true, bubbleCursorTracker: false }, { cursorTracking: true, bubbleCursorTracker: true }, { cursorTracking: false, bubbleCursorTracker: false }, { cursorTracking: false }]
  .every(o => { const c = Object.assign({}, o); const r = fold(c); return r[1] === false && J(r[0]) === J(o); }));
check('cursor: an old export with the bubble alone (import path)', runImport({ cursorTracking: false, bubbleCursorTracker: true }).cursorTracking === true);
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, D, { cursorTracking: false, bubbleCursorTracker: true })));
app.loadSettings();
check('cursor: load of an old save with the bubble alone -> Cursor tracking on, save rewritten', S.cursorTracking === true && S.bubbleCursorTracker === true && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).cursorTracking === true);
const synced = [];
app2._lmOptionUi = (k) => synced.push(k);
app2.setSettings('cursorTracking', false);
check('cursor: Cursor tracking off takes the bubble look off too (no save holds the bubble alone)', S.cursorTracking === false && S.bubbleCursorTracker === false && synced.join() === 'cursorTracking,bubbleCursorTracker');
synced.length = 0;
app2.setSettings('bubbleCursorTracker', true);
check('cursor: choosing the bubble look turns Cursor tracking on', S.cursorTracking === true && S.bubbleCursorTracker === true && synced.join() === 'bubbleCursorTracker,cursorTracking');
synced.length = 0;
app2.setSettings('bubbleCursorTracker', false);
check('cursor: back to the line look: Cursor tracking stays on', S.cursorTracking === true && S.bubbleCursorTracker === false && synced.join() === 'bubbleCursorTracker');
synced.length = 0;
app2.setSettings('cursorTracking', false);
check('cursor: Cursor tracking off with the line look changes nothing else', S.bubbleCursorTracker === false && synced.join() === 'cursorTracking');

if (fail) { console.log(fail + ' check(s) FAILED'); process.exit(1); }
console.log('all settings merge checks passed');
