/* Spectate: one "Click to follow" option (clickSpectate) and no spectator director / camera lock,
 * with the real code of ogario/ogario.v4.js and ogario/hotkeysCommand.js in a vm:
 *   - the leaderboard click (lbClickSpectate) and minimap click (minimapClickSpectate) switches are
 *     folded into clickSpectate once (on when any of the three was on) on load, import and profiles
 *   - the director's hotkeys and camera lock are gone; a key a player bound to them is free again
 * node developers/tests/clickfollow.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const hkSrc = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

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
const D = ctx.LM_SETTINGS_DEFAULTS;
const fold = (o) => { ctx._f = o; const r = vm.runInContext('lmFoldLegacySettings(_f)', ctx); return [ctx._f, r]; };
const C = o => ({ c: o.clickSpectate, lb: 'lbClickSpectate' in o, mm: 'minimapClickSpectate' in o });

// ── the one option
check('click to follow: one option, off by default; the two other switches are gone',
  D.clickSpectate === false && !('lbClickSpectate' in D) && !('minimapClickSpectate' in D));
let r = fold({ clickSpectate: false, lbClickSpectate: true, minimapClickSpectate: false });
check('fold: leaderboard click on -> click to follow on, old keys removed', JSON.stringify(C(r[0])) === JSON.stringify({ c: true, lb: false, mm: false }) && r[1] === true);
r = fold({ minimapClickSpectate: 'true' });
check('fold: minimap click on (old "true" string) -> on', r[0].clickSpectate === true && !('minimapClickSpectate' in r[0]));
r = fold({ clickSpectate: true, lbClickSpectate: false, minimapClickSpectate: false });
check('fold: cell click on, the others off -> stays on', r[0].clickSpectate === true && !('lbClickSpectate' in r[0]));
r = fold({ clickSpectate: false, lbClickSpectate: false, minimapClickSpectate: false });
check('fold: all three off -> off', r[0].clickSpectate === false && r[1] === true);
r = fold({ lbClickSpectate: 7 });
check('fold: an unusable old value is just removed', !('clickSpectate' in r[0]) && !('lbClickSpectate' in r[0]));
r = fold({ clickSpectate: true });
check('fold: a new save is left as it is', r[0].clickSpectate === true && r[1] === false);

// the real loadSettings: an old save is folded and rewritten
const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
ctx.ogario = {};
const old = Object.assign({}, D, { clickSpectate: false, lbClickSpectate: true, minimapClickSpectate: false });
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(old));
app.loadSettings();
const reSaved = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('load: an old save with the leaderboard click on has click to follow on, save rewritten',
  ctx.defaultmapsettings.clickSpectate === true && reSaved.clickSpectate === true && !('lbClickSpectate' in reSaved) && !('minimapClickSpectate' in reSaved));

// the import path (the real loop of importSettings)
const impLoop = cut("                    var _impS = importValue.ogarioSettings;", "                if (Object.prototype.hasOwnProperty.call(importValue, 'ogarioThemeSettings')");
const v = { ogarioSettings: { clickSpectate: false, minimapClickSpectate: true } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(v);
check('import: an old export with the minimap click on has click to follow on', v.ogarioSettings.clickSpectate === true && !('minimapClickSpectate' in v.ogarioSettings));

// ── the director and camera lock are gone
{
  const hctx = { console, Object, String, Array, JSON, Math, lmT: k => k, textLanguage: {}, chatCommand: {}, application: {}, toastr: { info() { } }, $: () => ({ trigger() { }, val() { return ''; } }) };
  hctx.window = hctx;
  vm.createContext(hctx);
  vm.runInContext(hkSrc, hctx);
  const ids = Object.keys(hctx.hotkeysCommand);
  check('hotkeys: no spectator director or camera lock commands', !ids.some(id => /^hk-dir/.test(id) || id === 'hk-director' || id === 'hk-cameraLock'));
  check('hotkeys: follow the next leaderboard player stays', ids.indexOf('hk-specNextTop') >= 0);
  const rs = main.indexOf('function lmRenameOldHotkeys(map) {'), re = main.indexOf('\n}', rs);
  const rctx = { JSON, Object, String };
  vm.createContext(rctx);
  vm.runInContext(main.slice(rs, re + 2), rctx);
  const map = { D: 'hk-director', A: 'hk-dirAuto', B: 'hk-dirBroadcast', N: 'hk-dirWatchNext', P: 'hk-dirWatchPrev', W: 'hk-dirWatchAdd', S: 'hk-dirMarkSave', '1': 'hk-dirMark1', '5': 'hk-dirMark5', L: 'hk-cameraLock', Q: 'hk-feed', T: 'hk-specNextTop' };
  const changed = rctx.lmRenameOldHotkeys(map);
  check('saved keys on the removed commands are free again, the others stay', changed === true && JSON.stringify(map) === JSON.stringify({ Q: 'hk-feed', T: 'hk-specNextTop' }));
  const exp = vm.runInContext('LM_EXPORT_KEYS', (() => { const c = { console }; vm.createContext(c); vm.runInContext(cut('var LM_EXPORT_KEYS = [', '];') + '];', c); return c; })());
  check('settings export: no director configuration', !exp.some(e => /^lm-director/.test(e.key)));
  check('the director module is not loaded any more', main.indexOf('modules/director.js') < 0 && !fs.existsSync(path.join(root, 'ogario', 'modules', 'director.js')));
  // the startup line that deletes the director's saved data, run on a storage that has it
  const ln = main.split(/\r?\n/).find(l => l.indexOf("'lm-director-watch'") >= 0 && l.indexOf('removeItem') >= 0);
  const sctx = { localStorage: makeStorage() };
  ['lm-director', 'lm-director-bookmarks', 'lm-director-watch', 'lmHudLayouts'].forEach(k => sctx.localStorage.setItem(k, '{}'));
  vm.createContext(sctx);
  if (ln) vm.runInContext(ln, sctx);
  check('startup: the director\'s saved camera settings, bookmarks and watchlist are deleted, other data stays',
    !!ln && ['lm-director', 'lm-director-bookmarks', 'lm-director-watch'].every(k => sctx.localStorage.getItem(k) === null) && sctx.localStorage.getItem('lmHudLayouts') === '{}');
}

if (fail) { console.log(fail + ' check(s) FAILED'); process.exit(1); }
console.log('all click to follow checks passed');
