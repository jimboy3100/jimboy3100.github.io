/* Theme settings checks with the real code of ogario/ogario.v4.js and its modules: the theme
 * schema (LM_THEME_SCHEMA + lmThemeValue: type, range, step, choices, colour format) and every
 * path that stores theme values (loadThemeSettings, the settings import, the theme presets
 * through Settings.changePreset, the Theme tab sliders through Settings.addSliderBox, settings
 * profiles and the Theme Workshop). Valid values and the defaults never change.
 * node developers/tests/themesettings.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const J = v => JSON.stringify(v);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
/* a jQuery stand-in that records what the slider builder and the preset setter do */
const dom = {};
function el(sel) {
  if (sel && typeof sel === 'object') return sel;
  if (!dom[sel]) {
    const e = dom[sel] = { sel, html: '', v: undefined, t: undefined, handlers: {}, length: 1 };
    e.append = h => { e.html += h; return e; };
    e.val = x => { if (x === undefined) return e.v; e.v = x; return e; };
    e.text = x => { if (x === undefined) return e.t; e.t = x; return e; };
    e.on = (n, f) => { (e.handlers[n] = e.handlers[n] || []).push(f); return e; };
    e.change = () => e;
    e.colorpicker = (a, b) => { if (a === 'setValue') e.v = b; return e; };
    e.trigger = n => { (e.handlers[n] || []).forEach(f => f.call(e)); return e; };
  }
  return dom[sel];
}
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { }, lmT: k => k };
ctx.window = ctx;
ctx.localStorage = makeStorage();
ctx.$ = ctx.jQuery = el;
ctx.textLanguage = {};
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext('var profiles = [];', ctx);
const TD = ctx.LM_THEME_DEFAULTS, SCH = ctx.LM_THEME_SCHEMA, V = ctx.lmThemeValue;
/* the real Settings methods that store theme values */
const Settings = vm.runInContext('({\n' +
  cut('        loadThemeSettings() {', '        saveThemeSettings() {') +
  cut('        addSliderBox(id, name, min, max, step, callback) {', '        addInputBox(id, name, holder, callback) {') +
  cut('        changePreset(names, theme) {', '        changeThemePreset(name) {') + '\n})', ctx);
ctx.ogario = {};

// ── the schema
check('every theme default is a valid value, kept exactly', Object.keys(TD).every(k => V(k, TD[k]) === TD[k]) || (console.log('   changed: ' + Object.keys(TD).filter(k => V(k, TD[k]) !== TD[k]).join(', ')), false));
const numKeys = Object.keys(TD).filter(k => typeof TD[k] === 'number');
check('every number theme setting has a range (also those without a slider)', numKeys.every(k => own(SCH, k) && Array.isArray(SCH[k])) || (console.log('   no rule: ' + numKeys.filter(k => !own(SCH, k)).join(', ')), false));
check('the schema names only real theme settings of the right type', Object.keys(SCH).every(k => own(TD, k) && (Array.isArray(SCH[k]) ? typeof TD[k] === 'number' && SCH[k][0] <= SCH[k][1] : typeof TD[k] === 'string' && (Array.isArray(SCH[k].choices) || SCH[k].color === true))));
check('the schema is frozen', Object.isFrozen(SCH) && Object.keys(SCH).every(k => Object.isFrozen(SCH[k])));
/* the Theme tab sliders as setThemeMenu builds them: their range and step are the schema's */
const menu = cut('        setThemeMenu() {', "            this.addInputBox('#theme-images', 'customCursor'");
const calls = [...menu.matchAll(/this\.addSliderBox\('[^']+', '(\w+)', ([-\d.]+), ([-\w.]+), ([\d.]+)/g)].map(m => [m[1], +m[2], m[3], +m[4]]);
check('the Theme tab has its sliders (' + calls.length + ')', calls.length >= 34);
check('every stepped range of the schema is a Theme tab slider', Object.keys(SCH).every(k => !Array.isArray(SCH[k]) || !(SCH[k][2] > 0) || /FontWeight$/.test(k) || calls.some(c => c[0] === k)));
/* the slider's own range: hudScale's top is the screen limit (at most 1.5) */
const sliderRange = c => [c[1], c[2] === 'hudScaleLimit' ? 1.5 : +c[2], c[3]];
const callOff = calls.filter(c => {
  const r = own(SCH, c[0]) && SCH[c[0]], s = sliderRange(c);
  if (!Array.isArray(r)) return true;
  /* a stepped schema range is the slider's exactly; a range without a step (hudScale: the phone's
   * HUD zoom sets any value from 0.3) holds the slider's */
  return r[2] > 0 ? r[0] !== s[0] || r[1] !== s[1] || r[2] !== s[2] : r[0] > s[0] || r[1] < s[1];
});
check('every Theme tab slider has the range and step of the schema', callOff.length === 0 || (console.log('   ' + callOff.map(c => c.join(' ')).join('; ')), false));
let offStep = [];
calls.forEach(c => {
  const k = c[0], r = sliderRange(c);
  const n = Math.floor((r[1] - r[0]) / r[2] + 1e-9);
  for (let i = 0; i <= n; i++) { const v = Number((r[0] + i * r[2]).toFixed(6)); if (V(k, v) !== v) offStep.push(k + '=' + v + '->' + V(k, v)); }
});
check('the screen limits of the hudScale slider (0.9, 1, 1.1) are kept', [0.9, 1, 1.1].every(v => V('hudScale', v) === v));
check('every value a theme slider can show is kept exactly (no float drift: 0.46, 7.5, 0.15)', offStep.length === 0 || (console.log('   ' + offStep.slice(0, 8).join(', ')), false));
/* values the old type-only check stored as they were */
check('out of range: put on the range', V('bordersWidth', 5000) === 200 && V('namesScale', 99) === 2 && V('cellsAlpha', 0) === 0.01 && V('miniMapWidth', -5) === 120 && V('sectorsX', 1e9) === 10);
check('between steps: the nearest step from min (as the slider shows it)', V('bordersWidth', 13) === 14 && V('sectorsFontSize', 1234) === 1230 && V('namesScale', 1.04) === 1 && V('miniMapMyCellSize', 7.3) === 7.5 && V('gameBrightness', 98) === 100);
check('hudScale above a small screen\'s slider top (0.9) is kept: it is valid on another device', V('hudScale', 1.2) === 1.2 && V('hudScale', 1.5) === 1.5 && V('hudScale', 3) === 1.5);
check('hudScale from the phone\'s HUD zoom (any value from 0.3) is kept exactly', V('hudScale', 0.3) === 0.3 && V('hudScale', 0.4123) === 0.4123 && V('hudScale', 0.7345) === 0.7345 && V('hudScale', 0.1) === 0.3);
check('settings without a slider have a range (cell shadow, minimap top), any value inside it', V('cellShadowBlur', 0) === 0 && V('cellShadowBlur', 33.3) === 33.3 && V('cellShadowBlur', 1e6) === 100 && V('cellShadowOffsetX', -80) === -50 && V('miniMapTop', 24) === 24);
check('font weights 400/700 kept, others put on 100..900', V('hudFontWeight', 400) === 400 && V('namesFontWeight', 700) === 700 && V('massFontWeight', 5000) === 900 && V('massFontWeight', 0) === 100);
check('NaN, Infinity, -Infinity refused (the default stays)', [NaN, Infinity, -Infinity].every(x => V('foodSize', x) === undefined && V('menuOpacity', x) === undefined));
check('numeric strings from old saves converted and fitted, other strings refused', V('foodSize', '7') === 7 && V('menuOpacity', ' 0.5 ') === 0.5 && V('foodSize', '') === undefined && V('foodSize', '7px') === undefined && V('foodSize', true) === undefined);
check('choices: preset / menu theme / chat position / graphics / indicators take only their lists', V('preset', 'legendv1') === 'legendv1' && V('preset', 'nope') === undefined && V('menuPreset', 'agario') === 'agario' && V('chatPos', 'topright') === 'topright' && V('chatPos', 'middle') === undefined && V('graphics', 'very_low') === 'very_low' && V('indicators', 'heart') === 'heart' && V('indicators', '<b>') === undefined);
check('choices are own keys only (no prototype names)', V('preset', 'toString') === undefined && V('chatPos', '__proto__') === undefined && V('graphics', 'constructor') === undefined);
check('fonts take the font list, families the family list', V('namesFont', 'oswald-bold') === 'oswald-bold' && V('hudFont', 'comic-sans') === undefined && V('miniMapNickFontFamily', 'Allura') === 'Allura' && V('massFontFamily', 'Arial') === undefined);
check('colours: hex, rgb(a) and colour names kept', V('bgColor', '#abc') === '#abc' && V('mainColor', '#01d9ccff') === '#01d9ccff' && V('hudColor', 'rgba(0,0,0,0.4)') === 'rgba(0,0,0,0.4)' && V('namesColor', 'red') === 'red' && V('cellShadowColor', 'rgb(1, 2, 3)') === 'rgb(1, 2, 3)');
check('colours: CSS / HTML injection and non-colours refused', ['red;}body{display:none', '#fff" onload="x', 'url(https://x.com/a.png)', 'expression(alert(1))', '', '#ggg', 5].every(x => V('bgColor', x) === undefined && V('messageColor', x) === undefined));
check('lbTeammateColor (a marker, not drawn) is left as stored', V('lbTeammateColor', 'anything') === 'anything');
check('free text kept (URLs, sector symbol), booleans as before, unknown keys refused', V('menuBg', 'https://x.com/a.png') === 'https://x.com/a.png' && V('sectorsSymbol', '*') === '*' && V('darkTheme', 'false') === false && V('darkTheme', 1) === undefined && V('noSuchKey', 1) === undefined && V('__proto__', {}) === undefined);

// ── shipped data is kept exactly: the theme presets, the menu themes, the gallery themes
const presetOff = [];
[['themePresets', ctx.themePresets], ['themeMenus', ctx.themeMenus], ['chatPositions', ctx.chatPositions]].forEach(([n, m]) => {
  Object.keys(m).forEach(p => Object.keys(m[p]).forEach(k => { if (own(TD, k) && V(k, m[p][k]) !== m[p][k]) presetOff.push(n + '.' + p + '.' + k + '=' + m[p][k]); }));
});
check('every theme preset / menu theme value is kept exactly', presetOff.length === 0 || (console.log('   ' + presetOff.join(', ')), false));
const cat = JSON.parse(fs.readFileSync(path.join(root, 'ogario', 'themes', 'catalogue.json'), 'utf8'));
const catOff = [];
cat.themes.forEach(t => Object.keys(t.theme || {}).forEach(k => { if (own(TD, k) && V(k, t.theme[k]) !== t.theme[k]) catOff.push(t.name + '.' + k); }));
check('every gallery theme value (catalogue.json) is kept exactly', catOff.length === 0 || (console.log('   ' + catOff.join(', ')), false));

// ── loading (the real loadThemeSettings)
const DS = ctx.defaultSettings;
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(Object.assign({}, TD, {
  bordersWidth: 13, namesScale: 99, hudScale: 1.2, foodSize: '9', virusAlpha: 0.25, bgColor: 'red;}x', mainColor: '#123456',
  lbTeammateColor: 'marker', preset: 'gone', menuPreset: 'legendv1', namesFont: 'comic', namesFontFamily: 'Oswald', cellShadowBlur: 0, sectorsFontSize: null
})));
Settings.loadThemeSettings();
check('load: off-range/off-step numbers fitted, valid values kept exactly', DS.bordersWidth === 14 && DS.namesScale === 2 && DS.hudScale === 1.2 && DS.foodSize === 9 && DS.virusAlpha === 0.25 && DS.cellShadowBlur === 0);
check('load: a bad colour, an unknown preset or font keeps the default; valid ones kept', DS.bgColor === TD.bgColor && DS.mainColor === '#123456' && DS.preset === TD.preset && DS.menuPreset === 'legendv1' && DS.namesFont === TD.namesFont && DS.namesFontFamily === 'Oswald' && DS.lbTeammateColor === 'marker' && DS.sectorsFontSize === TD.sectorsFontSize);
ctx.localStorage.setItem('ogarioThemeSettings', JSON.stringify(TD));
Settings.loadThemeSettings();
check('load: the stored defaults come back unchanged', Object.keys(TD).every(k => DS[k] === TD[k]));

// ── the settings import (the real loop of importSettings)
const impLoop = cut("                    var _impT = importValue.ogarioThemeSettings;", "                /* Transaction:");
const imported = { ogarioThemeSettings: { bordersWidth: 13, chatScale: 7, bgColor: 'url(x)', mVirusColor: '#ce6363', graphics: 'ultra', indicators: 'smile', hudFont: 'roboto', nope: 1, menuOpacity: 'NaN' } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(imported);
check('import: values fitted, unusable ones dropped (their defaults apply)', J(imported.ogarioThemeSettings) === J({ bordersWidth: 14, chatScale: 2, mVirusColor: '#ce6363', indicators: 'smile', hudFont: 'roboto' }));

// ── the theme presets (the real Settings.changePreset)
Object.keys(TD).forEach(k => { DS[k] = TD[k]; });
Settings.changePreset('legendv1', ctx.themePresets);
const lv1 = ctx.themePresets.legendv1;
check('preset: a shipped preset sets its values exactly', Object.keys(lv1).every(k => !own(TD, k) || DS[k] === lv1[k]));
Settings.changePreset('odd', { odd: { bordersWidth: 999, virusAlpha: 0.4, namesFont: 'bad', bgColor: 'red;}', foodSize: NaN } });
check('preset: a value that does not fit is fitted or left out', DS.bordersWidth === 200 && DS.virusAlpha === 0.4 && DS.namesFont === TD.namesFont && DS.bgColor === lv1.bgColor && DS.foodSize === (own(lv1, 'foodSize') ? lv1.foodSize : TD.foodSize));
check('preset: the slider shows the stored value', el('#bordersWidth-slider').v === 200 && el('#bordersWidth-value').t === 200);

// ── the Theme tab sliders (the real Settings.addSliderBox)
let cb = 0;
Settings.cbTest = () => { cb++; };
Settings.addSliderBox('#t', 'bordersWidth', 0, 1000, 7, 'cbTest');
const sl = el('#t').html;
check('slider: range and step come from the schema, not the call', /min="2"/.test(sl) && /max="200"/.test(sl) && /step="2"/.test(sl));
Settings.addSliderBox('#t2', 'hudScale', 0.5, 0.9, 0.01, 'cbTest');
check('slider: hudScale shows 0.5 up to the screen top (0.9) in 0.01 steps', /min="0.5"/.test(el('#t2').html) && /max="0.9"/.test(el('#t2').html) && /step="0.01"/.test(el('#t2').html));
Settings.addSliderBox('#t5', 'hudScale', 0.1, 9, 0.01);
check('slider: a call cannot widen the hudScale range', /min="0.3"/.test(el('#t5').html) && /max="1.5"/.test(el('#t5').html));
Settings.addSliderBox('#t3', 'chatScale', 1, 9, 0.01, 'cbTest');
check('slider: a call above the schema top gets the schema top', /max="2"/.test(el('#t3').html));
Settings.addSliderBox('#t4', 'cellShadowBlur', 0, 100, 0);
Settings.addSliderBox('#t6', 'cellShadowOffsetX', -50, 50, 1);
check('slider: a range without a step takes the call\'s step, else any value', /step="any"/.test(el('#t4').html) && /step="1"/.test(el('#t6').html));
const s = el('#bordersWidth-slider');
s.v = '13'; s.trigger('input');
check('slider input: a value from a script off the steps is put on them', DS.bordersWidth === 14 && el('#bordersWidth-value').t === 14 && cb === 1);
s.v = '40'; s.trigger('input');
check('slider input: a value the slider shows is kept exactly', DS.bordersWidth === 40 && cb === 2);
s.v = 'abc'; s.trigger('input');
check('slider input: not a number changes nothing', DS.bordersWidth === 40 && cb === 2);

// ── settings profiles and the Theme Workshop use the same schema
const pc = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { }, lmT: k => k };
pc.window = pc; pc.localStorage = makeStorage();
vm.createContext(pc);
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), pc);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), pc);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), pc);
vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'profiles.js'), 'utf8'), pc);
vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'themeworkshop.js'), 'utf8'), pc);
const P = pc.LMProfiles.core, W = pc.LMThemeWorkshop.core;
const pb = P.cleanBundle({ t: { bordersWidth: 13, hudScale: 1.2, bgColor: 'x;y', namesFont: 'bad', menuPreset: 'agario', virusAlpha: 0.25 } });
check('profiles: theme values fitted, unusable ones dropped, valid ones kept', pb && J(pb.t) === J({ bordersWidth: 14, hudScale: 1.2, menuPreset: 'agario', virusAlpha: 0.25 }));
check('workshop: the same schema (fitted, choices, colours)', W.themeValue('bordersWidth', 13) === 14 && W.themeValue('namesScale', 99) === 2 && W.themeValue('namesFont', 'bad') === undefined && W.themeValue('preset', 'legendv1') === 'legendv1' && W.themeValue('bgColor', 'url(x)') === undefined && W.themeValue('bgColor', '#010203') === '#010203');
check('workshop: every default it takes is kept exactly', Object.keys(TD).every(k => { const v = W.themeValue(k, TD[k]); return v === undefined || v === TD[k]; }));

console.log(fail ? fail + ' theme settings check(s) FAILED' : 'all theme settings checks passed');
process.exit(fail ? 1 : 0);
