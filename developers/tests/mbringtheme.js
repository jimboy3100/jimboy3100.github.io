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

// ── a gameplay-only set saved before the move (no theme part): its colours become a theme patch
const gpOld = P.cleanBundle({ s: { mbRingColorP1: '#123456', showMass: true } });
check('profiles: an old gameplay-only set keeps its ring colour (as a theme patch of that key only)', gpOld && gpOld.s && gpOld.s.showMass === true && gpOld.t && gpOld.t.mbRingColorP1 === '#123456' && Object.keys(gpOld.t).length === 1);
const ringOnly = P.cleanBundle({ s: { mbRingColorP1: '#123456', mbRingColorP2: '#654321' } });
check('profiles: an old set of only ring colours is not dropped', ringOnly && !ringOnly.s && ringOnly.t && ringOnly.t.mbRingColorP1 === '#123456' && ringOnly.t.mbRingColorP2 === '#654321');
check('profiles: an unusable old ring colour gives no theme patch', !P.cleanBundle({ s: { mbRingColorP1: 'red;}' } }) && !P.cleanBundle({ s: { mbRingColorP1: 'url(x)', showMass: true } }).t);
check('profiles: cleaning twice changes nothing', JSON.stringify(P.cleanBundle(gpOld)) === JSON.stringify(gpOld));
PD.mbRingColorP1 = '#0b0b0b'; PS.mbRingColorP1 = '#0b0b0b';
const gpNew = P.captureCurrent({ t: false, h: false, m: false, g: false, hl: false });
check('profiles: a new gameplay-only set has no ring colours (not in its gameplay part, no theme patch)', gpNew && gpNew.s && !('mbRingColorP1' in gpNew.s) && !gpNew.t);
check('profiles: capturing it leaves the live gameplay copy alone', PS.mbRingColorP1 === '#0b0b0b');
const bgBefore = PD.bgColor;
pc.LMProfiles.applySet({ s: { mbRingColorP1: '#2a2b2c', showMass: true } }, 'old gameplay-only');
check('profiles: applying an old gameplay-only set sets the ring colour, the rest of the theme stays', PD.mbRingColorP1 === '#2a2b2c' && PS.mbRingColorP1 === '#2a2b2c' && PD.bgColor === bgBefore);
const themeStored = JSON.parse(pc.localStorage.getItem('ogarioThemeSettings'));
check('profiles: the saved theme keeps its other values', themeStored.mbRingColorP1 === '#2a2b2c' && themeStored.bgColor === bgBefore && Object.keys(themeStored).length > 20);
/* an old Undo with only a ring colour in its gameplay part: the restore merges the patch
 * (a restore otherwise writes its theme part as the whole theme) */
pc.LMProfiles.undo(); /* uses up the in-memory Undo of the apply above */
pc.localStorage.setItem('lmSettingsProfilesUndo', JSON.stringify({ t: Date.now(), name: 'x', data: { s: Object.assign({}, PS, { mbRingColorP1: '#3c3d3e' }) } }));
const undoOk = pc.LMProfiles.undo();
const themeAfterUndo = JSON.parse(pc.localStorage.getItem('ogarioThemeSettings'));
check('profiles: the Undo of an old gameplay set brings its ring colour back and keeps the rest of the saved theme', undoOk && PD.mbRingColorP1 === '#3c3d3e' && themeAfterUndo.bgColor === bgBefore && Object.keys(themeAfterUndo).length > 20);

// ── Update / Duplicate of an old gameplay-only set (its theme part is only the ring colour patch)
pc.confirm = () => true;
const storedProfile = id => JSON.parse(pc.localStorage.getItem('lmSettingsProfiles')).filter(p => p.id === id)[0];
const ringKeysOnly = t => !!t && Object.keys(t).length > 0 && Object.keys(t).every(k => KEYS.indexOf(k) >= 0);
pc.localStorage.setItem('lmSettingsProfiles', JSON.stringify([
  { id: 'oldgp', name: 'Old gameplay', data: { s: { showMass: true, mbRingColorP1: '#123456', mbRingColorP2: '#654321' } } },
  { id: 'oldring', name: 'Old rings', data: { s: { mbRingColorP1: '#111111' } } },
  { id: 'full', name: 'Full', data: { s: { showMass: true }, t: { bgColor: '#000000', mbRingColorP1: '#222222' } } }
]));
PD.mbRingColorP1 = '#a1b2c3'; PD.mbRingColorP2 = '#c3b2a1'; PS.mbRingColorP1 = '#a1b2c3'; PS.mbRingColorP2 = '#c3b2a1';
PD.bgColor = '#0f1e2d';
P.act('update', 'oldgp');
const upd = storedProfile('oldgp');
check('profiles: Update of an old gameplay-only set keeps it without a theme (only its ring colours)', upd && ringKeysOnly(upd.data.t) && !('bgColor' in upd.data.t));
check('profiles: Update stores the current ring colours in that patch', upd && upd.data.t.mbRingColorP1 === '#a1b2c3' && upd.data.t.mbRingColorP2 === '#c3b2a1');
check('profiles: Update captures the gameplay settings, without the ring copy', upd && upd.data.s && upd.data.s.showMass === PS.showMass && !('mbRingColorP1' in upd.data.s));
P.act('update', 'oldring');
const updR = storedProfile('oldring');
check('profiles: Update of an old set of one ring colour keeps just that colour', updR && updR.data.t && Object.keys(updR.data.t).join() === 'mbRingColorP1' && updR.data.t.mbRingColorP1 === '#a1b2c3');
check('profiles: the badge of an old gameplay-only set says gameplay, not theme', P.partsBadge({ s: { showMass: true }, t: { mbRingColorP1: '#111111' } }) === P.partsBadge({ s: {} }) && P.partsBadge({ t: { mbRingColorP1: '#111111' } }) === P.partsBadge({ s: {} }));
P.act('update', 'full');
const updF = storedProfile('full');
check('profiles: Update of a set with a theme still saves the whole theme', updF && updF.data.t && updF.data.t.bgColor === '#0f1e2d' && updF.data.t.mbRingColorP1 === '#a1b2c3' && Object.keys(updF.data.t).length > 20);
P.act('dup', 'oldgp');
const dupP = JSON.parse(pc.localStorage.getItem('lmSettingsProfiles')).filter(p => p.id !== 'oldgp' && p.name.indexOf('Old gameplay') === 0)[0];
check('profiles: Duplicate keeps the scope (ring colours only)', dupP && ringKeysOnly(dupP.data.t));
PD.bgColor = '#334455'; PD.mbRingColorP1 = '#000001';
pc.LMProfiles.applyById('oldgp');
check('profiles: applying the updated set brings its ring colours and leaves the rest of the theme', PD.mbRingColorP1 === '#a1b2c3' && PD.bgColor === '#334455' && JSON.parse(pc.localStorage.getItem('ogarioThemeSettings')).bgColor === '#334455');

// ── "Video skins volume" (volVideo, removed): an old set keeps its loudness (the core's own fold)
const vv = (s) => { const b = P.cleanBundle({ s: s }); return b && b.s ? b.s.videoSkinSoundLevel : undefined; };
check('profiles: old set with video skins muted (volVideo 0) stays muted', vv({ videoSkinSoundLevel: 0.7, volVideo: 0 }) === 0);
check('profiles: old set at half (volVideo 0.5) folds into the level', Math.abs(vv({ videoSkinSoundLevel: 0.8, volVideo: 0.5 }) - 0.4) < 1e-9);
check('profiles: old set at full (volVideo 1) keeps its level', vv({ videoSkinSoundLevel: 0.7, volVideo: 1 }) === 0.7);
check('profiles: old set with only volVideo 0 (no level saved) is muted', vv({ volVideo: 0 }) === 0);
check('profiles: the old key itself is left out; the input object is not changed', (function () { const s = { videoSkinSoundLevel: 0.7, volVideo: 0 }; const b = P.cleanBundle({ s: s }); return !('volVideo' in b.s) && s.volVideo === 0 && s.videoSkinSoundLevel === 0.7; })());
check('profiles: a set without volVideo is unchanged', vv({ videoSkinSoundLevel: 0.3 }) === 0.3);
check('profiles: stored profiles and backups fold too', (function () {
  const pr = P.cleanProfiles([{ id: 'a1', name: 'old', data: { s: { videoSkinSoundLevel: 0.6, volVideo: 0 } } }]);
  const bk = P.cleanBackups([{ t: 5, reason: 'change', data: { s: { videoSkinSoundLevel: 0.6, volVideo: 0 }, t: { bgColor: '#000000' } } }]);
  return pr.length === 1 && pr[0].data.s.videoSkinSoundLevel === 0 && bk.length === 1 && bk[0].data.s.videoSkinSoundLevel === 0;
})());
PS.videoSkinSoundLevel = 0.9;
pc.LMProfiles.applySet({ s: { videoSkinSoundLevel: 0.9, volVideo: 0 } }, 'old muted');
check('profiles: applying an old muted set mutes the video skins', PS.videoSkinSoundLevel === 0);

console.log(fail ? fail + ' multibox ring colour check(s) FAILED' : 'all multibox ring colour checks passed');
process.exit(fail ? 1 : 0);
