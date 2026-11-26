/* Settings that became one choice, with the real code of ogario/ogario.v4.js:
 *   Mass format: "Short mass" + "Mass format" (0 = as Short mass) are massFormat 1 / 2 / 3; the old
 *   key stays a copy (lmFoldLegacySettings on load, import, profiles; setSettings for scripts).
 *   Game stats position: "at the top" + "at the bottom centre" are statsPosition top / bottom /
 *   center, the switches copies of it; setFpsAtTop places the stats line from it.
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
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
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
const app2 = vm.runInContext('({\n' + cut('        setSettings(id, checked) {', '        profiling() {') + cut('        _lmChoiceSync(name) {', '        addSliderBox(id, name') + (main.indexOf("_lmPos === 'top'") >= 0 ? cut('        setFpsAtTop() {', '        setTweenMaxEffect() {') : '') + '\n})', ctx);
app2.saveSettings = function () { };
app2._lmLoadOptSounds = function () { };
ctx.hotkeys = {};
/* the classes setFpsAtTop gives the stats line */
const cls = new Set();
const statsEl = { removeClass(c) { c.split(' ').forEach(x => cls.delete(x)); return this; }, addClass(c) { c.split(' ').forEach(x => cls.add(x)); return this; }, toggleClass(c, on) { if (on) cls.add(c); else cls.delete(c); return this; } };
ctx.$ = (q) => (q === '#stats-hud' ? statsEl : { length: 0, prop() { }, val() { }, text() { }, css() { }, show() { }, hide() { }, toggle() { }, toggleClass() { }, addClass() { }, removeClass() { }, attr() { }, on() { }, off() { }, find() { return this; }, closest() { return this; }, each() { } });
ctx.toastr = { info() { }, warning() { }, success() { } };
ctx.legendmod = {};
ctx.lmT = k => k;
ctx._lmG1tag = () => '';
const sel = { tagName: 'SELECT', value: '' }, posSel = { tagName: 'SELECT', value: '' };
ctx.document = { getElementById: id => (id === 'massFormat' ? sel : id === 'statsPosition' ? posSel : null), createElement: () => ({}), head: { appendChild() { } } };
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

// -- 2. Game stats position
const P = ['statsPosition', 'fpsAtTop', 'statsAtCenter'];
const placed = () => (cls.has('hud-top') ? 'top' : cls.has('hud-bottom') ? 'bottom' : '?') + (cls.has('lm-stats-center') ? '+center' : '');
check('stats: the default is at the top, as before (top on, centre off)', D.statsPosition === 'top' && D.fpsAtTop === true && D.statsAtCenter === false);
check('stats: three positions, nothing else', V('statsPosition', 'center') === 'center' && V('statsPosition', 'bottom') === 'bottom' && V('statsPosition', 'left') === undefined);
check('stats: old top on, centre off -> top', J(pick(fold({ fpsAtTop: true, statsAtCenter: false })[0], P)) === J({ statsPosition: 'top', fpsAtTop: true, statsAtCenter: false }));
check('stats: old top off, centre off -> bottom', J(pick(fold({ fpsAtTop: false, statsAtCenter: false })[0], P)) === J({ statsPosition: 'bottom', fpsAtTop: false, statsAtCenter: false }));
check('stats: old centre on wins over the top (both combinations) -> center', fold({ fpsAtTop: true, statsAtCenter: true })[0].statsPosition === 'center' && fold({ fpsAtTop: false, statsAtCenter: 'true' })[0].statsPosition === 'center');
check('stats: only one old key = the other one at its default', fold({ fpsAtTop: false })[0].statsPosition === 'bottom' && fold({ statsAtCenter: false })[0].statsPosition === 'top');
const sNew = fold({ statsPosition: 'bottom', fpsAtTop: true, statsAtCenter: true });
check('stats: a new save: the choice wins and the copies follow it', J(pick(sNew[0], P)) === J({ statsPosition: 'bottom', fpsAtTop: false, statsAtCenter: false }));
check('stats: a consistent new save is left as it is', fold({ statsPosition: 'center', fpsAtTop: true, statsAtCenter: true })[1] === false);
check('stats: an old export at the bottom centre stays there', runImport({ fpsAtTop: false, statsAtCenter: true }).statsPosition === 'center');
const oldSave = Object.assign({}, D, { fpsAtTop: false, statsAtCenter: false });
delete oldSave.statsPosition;
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(oldSave));
app.loadSettings();
check('stats: load of an old save with the stats at the bottom -> bottom, save rewritten', S.statsPosition === 'bottom' && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).statsPosition === 'bottom');
const hasPlace = typeof app2.setFpsAtTop === 'function';
check('stats: setFpsAtTop places from the choice', hasPlace);
if (hasPlace) {
  app2.setSettings('statsPosition', 'top');
  check('stats: top -> the stats line at the top, the dropdown shows it', placed() === 'top' && posSel.value === 'top' && S.fpsAtTop === true && S.statsAtCenter === false);
  app2.setSettings('statsPosition', 'center');
  check('stats: center -> bottom centre, the centre copy on', placed() === 'bottom+center' && S.statsAtCenter === true);
  app2.setSettings('statsPosition', 'bottom');
  check('stats: bottom -> bottom left', placed() === 'bottom' && S.fpsAtTop === false && S.statsAtCenter === false);
  app2.setSettings('fpsAtTop', true);
  check('stats: a script turning "at the top" on moves the stats to the top', S.statsPosition === 'top' && placed() === 'top' && posSel.value === 'top');
  app2.setSettings('statsAtCenter', true);
  check('stats: a script turning "at the bottom centre" on: centre (it wins over the top)', S.statsPosition === 'center' && placed() === 'bottom+center');
  app2.setSettings('statsAtCenter', false);
  check('stats: and off again: back to the top it had', S.statsPosition === 'top' && placed() === 'top');
}

if (fail) { console.log(fail + ' check(s) FAILED'); process.exit(1); }
console.log('all settings merge checks passed');
