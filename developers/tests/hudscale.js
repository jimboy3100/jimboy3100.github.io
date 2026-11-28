/* HUD scale per screen: the real _lmHudScaleLimit / _lmHudScaleNow, Settings.setHudScale and the
 * theme load and save of ogario/ogario.v4.js (run in a vm). A small screen shows the HUD at most
 * at its limit (0.9 / 1 / 1.1), but the player's own value stays in the settings: a larger value
 * chosen on a big screen came back as the small screen's limit after the next theme save
 * (setHudScale wrote the limit into defaultSettings.hudScale).
 * node developers/tests/hudscale.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* one browser start: a fresh page on a screen of the given height with the given storage */
function start(screenH, storage) {
  const css = {}, styles = {};
  const el = sel => {
    const e = { css(k, v) { (styles[sel] = styles[sel] || {})[k] = v; return e; }, width(v) { (styles[sel] = styles[sel] || {}).width = v; return e; } };
    return e;
  };
  const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, parseFloat, setTimeout() { }, clearTimeout() { }, lmT: k => k };
  ctx.window = ctx;
  ctx.screen = { height: screenH };
  ctx.localStorage = storage;
  ctx.$ = ctx.jQuery = el;
  ctx.textLanguage = {};
  vm.createContext(ctx);
  vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
  vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
  vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
  vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
  vm.runInContext('var profiles = [];', ctx);
  vm.runInContext(cut('function _lmCssNum(', 'function _lmCssUrl('), ctx);
  vm.runInContext(cut('    function _lmHudScaleLimit(', '    function _lmMenuFitQueue()'), ctx);
  ctx.ogario = { hudScale: 1 };
  ctx._lmMenuFitQueue = () => { ctx.fitQueued = (ctx.fitQueued || 0) + 1; };
  const Settings = vm.runInContext('({\n' +
    cut('        loadThemeSettings() {', '        /* Hotkey (no default key): enlarge the minimap') +
    cut('        setHudScale() {', '        setChat() {') +
    '        addCustomCSS(name, text) { this._css[name] = text; }, _css: {}\n})', ctx);
  Settings.loadThemeSettings();
  Settings.setHudScale();
  return { ctx, Settings, styles, DS: ctx.defaultSettings };
}
function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
const stored = s => JSON.parse(s.getItem('ogarioThemeSettings') || '{}').hudScale;
const scaleVar = p => (/--lm-hud-scale:([\d.]+)/.exec(p.Settings._css.hudScaleVarCSS || '') || [])[1];

const st = makeStorage();
/* 1. big screen (1440 px): the player picks 1.21 on the slider and the theme is saved */
let p = start(1440, st);
check('screen limits: 0.9 up to 800 px, 1 up to 992, 1.1 up to 1080, else 1.5',
  [[768, 0.9], [800, 0.9], [900, 1], [992, 1], [1080, 1.1], [1081, 1.5], [1440, 1.5]].every(([h, l]) => p.ctx._lmHudScaleLimit(h) === l));
p.DS.hudScale = 1.21; p.ctx.ogario.hudScale = 1.21;
p.Settings.setHudScale();
p.Settings.saveThemeSettings();
check('big screen: the HUD uses 1.21', scaleVar(p) === '1.21' && p.styles['#leaderboard-hud'].transform === 'scale(1.21)');
check('big screen: 1.21 is saved', stored(st) === 1.21);
/* 2. small screen (768 px): the HUD is shown at 0.9, the settings keep 1.21, a theme save keeps 1.21 */
p = start(768, st);
check('small screen: the HUD uses the screen limit 0.9 (font ' + p.styles['#overlays-hud']['font-size'] + ')',
  scaleVar(p) === '0.9' && p.styles['#leaderboard-hud'].transform === 'scale(0.9)' && p.styles['#overlays-hud']['font-size'] === '18px');
check('small screen: the effective scale is 0.9', p.ctx._lmHudScaleNow() === 0.9);
check('small screen: the player\'s 1.21 stays in the settings (was 0.9)', p.DS.hudScale === 1.21 && p.ctx.ogario.hudScale === 1.21);
p.Settings.saveThemeSettings();
check('small screen: a theme save keeps 1.21 (was 0.9)', stored(st) === 1.21);
/* a value under the limit is used as it is */
p.DS.hudScale = 0.7; p.Settings.setHudScale();
check('small screen: 0.7 (under the limit) is used as it is', scaleVar(p) === '0.7' && p.ctx._lmHudScaleNow() === 0.7);
p.DS.hudScale = 1.21; p.Settings.setHudScale();
/* 3. big screen again: 1.21 */
p = start(1440, st);
check('big screen again: 1.21 is back (HUD and settings)', p.DS.hudScale === 1.21 && scaleVar(p) === '1.21');
/* a broken value counts as 1 */
check('a broken hudScale counts as 1', p.ctx._lmHudScaleNow('x', 1440) === 1 && p.ctx._lmHudScaleNow(NaN, 768) === 0.9);
/* 4. a phone sizes the leaderboard (its fit) and a tablet the teamboard with an inline !important
 * transform: the theme HUD scale (slider, the phone's menu pinch) leaves those, and still scales a
 * box without one. Up to 3.702 it replaced them, and the phone stylesheet's 0.75 showed instead. */
const inline = (v, pr) => ({ style: { getPropertyPriority: k => (k === 'transform' ? pr : ''), v } });
p.ctx.document = { getElementById: id => ({ 'leaderboard-hud': inline('scale(0.5)', 'important'), 'top5-hud': inline('scale(0.9)', 'important') })[id] || null };
delete p.styles['#leaderboard-hud']; delete p.styles['#top5-hud'];
p.DS.hudScale = 0.6; p.Settings.setHudScale();
check('phone: the fitted leaderboard and the tablet teamboard keep their own size',
  !(p.styles['#leaderboard-hud'] || {}).transform && !(p.styles['#top5-hud'] || {}).transform && scaleVar(p) === '0.6');
p.ctx.document = { getElementById: id => ({ 'leaderboard-hud': inline('scale(0.5)', ''), 'top5-hud': inline('', '') })[id] || null };
p.Settings.setHudScale();
check('without an !important transform both follow the HUD scale',
  p.styles['#leaderboard-hud'].transform === 'scale(0.6)' && p.styles['#top5-hud'].transform === 'scale(0.6)');
delete p.ctx.document;

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
