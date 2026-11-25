/* Multibox ring colours as theme settings, with the real code of ogario/ogario.v4.js and
 * ogario/modules/profiles.js: the one-time move of a player's colours from the gameplay settings
 * into the theme (loadThemeSettings), the ring drawn in the theme's colour (lmMultiboxRing), the
 * gameplay copy (loadSettings / saveThemeSettings), Export / Import Settings, the theme reset and
 * settings profiles (old sets keep their colours).
 * node developers/tests/mbringtheme.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, clear: () => m.clear(), _map: m };
}
/* a jQuery stand-in: every switch of the export / import is on; text boxes keep their value */
const boxes = {};
function $(sel) {
  if (sel && typeof sel === 'object') return { length: 1 };
  const e = boxes[sel] = boxes[sel] || { v: '' };
  return {
    length: 0,
    prop: () => true,
    val(x) { if (x === undefined) return e.v; e.v = x; return this; },
    blur() { return this; },
    closest() { return { length: 0 }; },
    colorpicker() { return this; }, text() { return this; }, change() { return this; }, trigger() { return this; }
  };
}
$.extend = (...a) => Object.assign(...a);
let reloads = 0;
const ctx = {
  console, JSON, Math, Date, Object, Array, Number, String, isFinite, Error,
  setTimeout() { }, clearTimeout() { }, lmT: k => k, $, jQuery: $,
  toastr: { error(m) { throw new Error('toastr ' + m); }, info() { }, success() { } },
  _lmG1tag: (a, b) => b, location: { reload() { reloads++; } }
};
ctx.window = ctx;
ctx.localStorage = makeStorage();
ctx.document = { getElementById: () => null };
ctx.textLanguage = {};
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext('var profiles = [], chatCommand = {}, hotkeys = {}, hotkeysCommand = {}, ogario = {};', ctx);
const TD = ctx.LM_THEME_DEFAULTS, SD = ctx.LM_SETTINGS_DEFAULTS, DS = ctx.defaultSettings, MS = ctx.defaultmapsettings;
const KEYS = ['mbRingColorP1', 'mbRingColorP2'];
/* the real Settings methods (theme) and application methods (gameplay, export, import) */
const Settings = vm.runInContext('({\n' +
  cut('        loadThemeSettings() {', '        /* Hotkey (no default key): enlarge the minimap') +
  cut('        restoreThemeSettings() {', '        addCustomCSS(name, css) {') + '\n})', ctx);
ctx.Settings = Settings;
const application = vm.runInContext('({\n' +
  cut('        saveSettings(option, name) {', '        restoreSettings() {') + '\n})', ctx);
ctx.application = application;
const loadSettingsTail = cut('            /* "Multibox unit stroke rings" (mbRings) became', '            /* the loaded values are the ones later changes are compared with');
const reset = () => { KEYS.forEach(k => { DS[k] = TD[k]; MS[k] = SD[k]; }); ctx.localStorage.clear(); };
const stored = k => { const t = JSON.parse(ctx.localStorage.getItem(k) || 'null'); return t; };
const oldTheme = () => { const t = Object.assign({}, TD); KEYS.forEach(k => { delete t[k]; }); return t; };

// ── the keys
check('theme defaults: the two ring colours, as before', TD.mbRingColorP1 === '#FF2FD6' && TD.mbRingColorP2 === '#00E5FF');
check('theme schema: colour rule for both', KEYS.every(k => ctx.LM_THEME_SCHEMA[k] && ctx.LM_THEME_SCHEMA[k].color === true));
check('theme schema: hex kept, non-colours refused', ctx.lmThemeValue('mbRingColorP1', '#123abc') === '#123abc' && ctx.lmThemeValue('mbRingColorP2', 'x;}') === undefined);
check('gameplay key still valid (old imports, old scripts)', SD.mbRingColorP1 === '#FF2FD6' && ctx.lmSettingValue('mbRingColorP2', '#010203') === '#010203');

// ── the one-time move (the real loadThemeSettings)
reset();
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(oldTheme()));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify({ mbRingColorP1: '#112233', mbRingColorP2: '#00E5FF', showMass: true }));
Settings.loadThemeSettings();
check('move: a custom gameplay colour goes into the theme', DS.mbRingColorP1 === '#112233');
check('move: a default gameplay colour leaves the theme default', DS.mbRingColorP2 === '#00E5FF');
check('move: the theme is saved with it (done once)', stored('ogarioThemeSettings').mbRingColorP1 === '#112233' && stored('ogarioThemeSettings').mbRingColorP2 === '#00E5FF');
DS.mbRingColorP1 = TD.mbRingColorP1;
Settings.loadThemeSettings();
check('move: next load reads the saved theme value', DS.mbRingColorP1 === '#112233');

reset();
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(Object.assign(oldTheme(), { mbRingColorP1: '#abcdef' })));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify({ mbRingColorP1: '#112233', mbRingColorP2: '#445566' }));
Settings.loadThemeSettings();
check('move: a theme value is never overwritten', DS.mbRingColorP1 === '#abcdef');
check('move: only the key the theme lacks is carried', DS.mbRingColorP2 === '#445566');

reset();
ctx.localStorage.setItem('ogarioSettings', JSON.stringify({ mbRingColorP1: '#ff0000' }));
Settings.loadThemeSettings();
check('move: no theme saved at all: the custom colour is carried', DS.mbRingColorP1 === '#ff0000' && stored('ogarioThemeSettings').mbRingColorP1 === '#ff0000');

reset();
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(oldTheme()));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify({ mbRingColorP1: '#ff2fd6', mbRingColorP2: 'red;}x' }));
Settings.loadThemeSettings();
check('move: default (any case) and unusable values are not carried, nothing saved', DS.mbRingColorP1 === '#FF2FD6' && DS.mbRingColorP2 === '#00E5FF' && !('mbRingColorP1' in stored('ogarioThemeSettings')));
reset();
Settings.loadThemeSettings();
check('move: a new player (nothing stored) keeps the defaults, nothing written', DS.mbRingColorP1 === '#FF2FD6' && ctx.localStorage.getItem('ogarioThemeSettings') === null);

// ── the gameplay copy
reset();
DS.mbRingColorP1 = '#0a0b0c';
vm.runInContext('(function (settings) {\n' + loadSettingsTail + '\n})', ctx)({});
check('copy: loadSettings gives the gameplay key the theme value', MS.mbRingColorP1 === '#0a0b0c' && MS.mbRingColorP2 === '#00E5FF');
DS.mbRingColorP2 = '#0d0e0f';
Settings.saveThemeSettings();
check('copy: a theme save updates it', MS.mbRingColorP2 === '#0d0e0f');

// ── the ring is drawn in the theme colour (the real lmMultiboxRing)
const ringSrc = ['lmMultiboxRingPlayer', 'lmMultiboxRingColor', 'lmMultiboxRing'].map(n => cut('\nfunction ' + n + '(', '\n}\n') + '\n}\n').join('\n') +
  cut('var LM_MB_RING_MIN_SCREEN_PX', '\n') + '\n' + cut('var LM_MB_RING_DEFAULT_COLORS', '\n') + '\n';
const ringWin = { legendmod: { multiBoxPlayerExists: true } };
const ring = new Function('window', 'defaultmapsettings', 'defaultSettings', 'function lmMultiboxControlledPlayer() { return 1; }\n' + ringSrc + '\nreturn lmMultiboxRing;');
const ms = { mbRingsP1: true, mbRingsP2: true, mbRingSizeP1: 6, mbRingSizeP2: 6, mbRingColorP1: '#111111', mbRingColorP2: '#222222' };
const own1 = { isPlayerCell: true }, unit = { spectator: 1, isPlayerCellMulti: true };
let r1 = ring(ringWin, ms, { mbRingColorP1: '#a1a2a3', mbRingColorP2: '#b1b2b3' });
check('ring: player 1 and 2 drawn in the theme colours', r1(own1, 100, 1).color === '#a1a2a3' && r1(unit, 100, 1).color === '#b1b2b3');
r1 = ring(ringWin, ms, { mbRingColorP1: 'red', mbRingColorP2: undefined });
check('ring: no usable theme colour: the old gameplay key', r1(own1, 100, 1).color === '#111111' && r1(unit, 100, 1).color === '#222222');
r1 = ring(ringWin, { mbRingsP1: true, mbRingsP2: true }, {});
check('ring: neither: the built-in colours', r1(own1, 100, 1).color === '#FF2FD6' && r1(unit, 100, 1).color === '#00E5FF');

// ── Export / Import Settings (the real exportSettings / importSettings)
reset();
DS.mbRingColorP1 = '#123456'; DS.mbRingColorP2 = '#654321';
Settings.saveThemeSettings();
application.exportSettings();
const exported = boxes['#export-settings'].v;
const ex = JSON.parse(exported);
check('export: the theme part has the ring colours, the gameplay part the same copy', ex.ogarioThemeSettings.mbRingColorP1 === '#123456' && ex.ogarioThemeSettings.mbRingColorP2 === '#654321' && ex.ogarioSettings.mbRingColorP1 === '#123456');
reset();
boxes['#import-settings'].v = exported;
application.importSettings();
Settings.loadThemeSettings();
check('import: round trip brings the ring colours back', DS.mbRingColorP1 === '#123456' && DS.mbRingColorP2 === '#654321' && reloads === 1);
reset();
const oldExport = { ogarioSettings: { mbRingColorP1: '#0f0f0f', mbRingColorP2: '#00E5FF', showMass: true }, ogarioThemeSettings: oldTheme() };
boxes['#import-settings'].v = JSON.stringify(oldExport);
application.importSettings();
Settings.loadThemeSettings();
check('import: an export of an older version keeps its custom ring colour', DS.mbRingColorP1 === '#0f0f0f' && DS.mbRingColorP2 === '#00E5FF');
reset();
boxes['#import-settings'].v = JSON.stringify({ ogarioSettings: { mbRingColorP1: 5 }, ogarioThemeSettings: { mbRingColorP1: 'url(x)' } });
application.importSettings();
Settings.loadThemeSettings();
check('import: unusable values are dropped (defaults stay)', DS.mbRingColorP1 === '#FF2FD6');

// ── the theme reset (the real restoreThemeSettings)
reset();
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(Object.assign({}, TD, { mbRingColorP1: '#121212' })));
MS.mbRingColorP1 = '#121212';
Settings.restoreThemeSettings();
KEYS.forEach(k => { DS[k] = TD[k]; });
Settings.loadThemeSettings();
check('theme reset: the ring colours go back to the defaults (the gameplay copy does not bring them back)', DS.mbRingColorP1 === '#FF2FD6' && stored('ogarioSettings').mbRingColorP1 === '#FF2FD6');

// ── settings profiles (the real profiles.js)
const pc = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { }, lmT: k => k };
pc.window = pc; pc.localStorage = makeStorage();
pc.document = { getElementById: () => null };
vm.createContext(pc);
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), pc);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), pc);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), pc);
vm.runInContext('var ogario = {};', pc);
pc.$ = pc.jQuery = $;
pc.application = { saveSettings(o, n) { pc.localStorage.setItem(n, JSON.stringify(o)); }, setSettings() { } };
let themeSaved = 0;
pc.Settings = vm.runInContext('({ setTheme() { },\n' + cut('        saveThemeSettings() {', '        /* Hotkey (no default key): enlarge the minimap') + '\n})', pc);
const realSave = pc.Settings.saveThemeSettings;
pc.Settings.saveThemeSettings = function () { themeSaved++; return realSave.call(this); };
vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'profiles.js'), 'utf8'), pc);
const P = pc.LMProfiles.core, PD = pc.defaultSettings, PS = pc.defaultmapsettings;
const oldSet = P.cleanBundle({ s: { showMass: true, mbRingColorP1: '#334455', mbRingColorP2: '#00E5FF' }, t: { bgColor: '#000000' } });
check('profiles: an old set gets its ring colours in the theme part', oldSet.t.mbRingColorP1 === '#334455' && oldSet.t.mbRingColorP2 === '#00E5FF');
check('profiles: the gameplay copy is left out of a set', !('mbRingColorP1' in oldSet.s) && oldSet.s.showMass === true);
const newSet = P.cleanBundle({ s: { mbRingColorP1: '#111111' }, t: { mbRingColorP1: '#222222' } });
check('profiles: a theme value in the set is never overwritten; a set of only the copy has no gameplay part', newSet.t.mbRingColorP1 === '#222222' && !newSet.s);
PD.mbRingColorP1 = '#a0a0a0';
PS.mbRingColorP1 = '#a0a0a0';
const cur = P.captureCurrent({ explicit: true });
check('profiles: a saved set has the ring colours in its theme part only', cur.t.mbRingColorP1 === '#a0a0a0' && !(cur.s && 'mbRingColorP1' in cur.s));
const rows = pc.LMProfiles.applySet({ s: { mbRingColorP1: '#556677' }, t: { bgColor: PD.bgColor } }, 'old');
check('profiles: applying an old set sets the theme ring colour live and saves it', rows && PD.mbRingColorP1 === '#556677' && themeSaved > 0 && JSON.parse(pc.localStorage.getItem('ogarioThemeSettings')).mbRingColorP1 === '#556677');
check('profiles: the gameplay copy follows', PS.mbRingColorP1 === '#556677');
pc.LMProfiles.applySet({ t: { mbRingColorP2: '#778899' } }, 'theme');
check('profiles: a theme part with a ring colour is applied', PD.mbRingColorP2 === '#778899' && PS.mbRingColorP2 === '#778899');

console.log(fail ? fail + ' multibox ring colour check(s) FAILED' : 'all multibox ring colour checks passed');
process.exit(fail ? 1 : 0);
