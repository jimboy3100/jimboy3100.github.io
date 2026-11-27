/* My themes checks (Theme tab, under the Theme preset): the values of a stored theme against the
 * real theme schema of ogario/ogario.v4.js (malicious and oversized input), whole-look apply, version
 * rotation and restore, stored data of the old Theme workshop window, storage caps.
 * node developers/tests/mythemes.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const mod = fs.readFileSync(path.join(root, 'ogario', 'modules', 'mythemes.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };

function makeStorage(limit) {
  const m = new Map();
  const size = () => { let n = 0; m.forEach((v, k) => { n += k.length + v.length; }); return n; };
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { v = String(v); const old = m.get(k); m.set(k, v); if (limit && size() > limit) { if (old === undefined) m.delete(k); else m.set(k, old); throw new Error('QuotaExceededError'); } },
    removeItem: k => { m.delete(k); },
    _map: m
  };
}
/* the English texts of the language packs (developers/i18n/src), as lmT gives them */
const EN = {}; Object.values(require('../i18n/lib').readAll()).forEach((a) => Object.keys(a).forEach((k) => { EN[k] = a[k].en; }));
const enT = (k, v) => { const s = EN[k]; if (s === undefined) return k; if (v == null) return s; if (typeof v !== 'object') v = [v]; return s.replace(/{([A-Za-z0-9_]+)}/g, (m, n) => (v[n] != null ? String(v[n]) : m)); };
const ctx = { lmT: enT, console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = makeStorage(0);
ctx.textLanguage = { bgColor: 'Background', hudScale: '<b>HUD</b> scale', messageSound: 'Message notification sound' };
vm.createContext(ctx);
i18n(ctx);
/* the real schema: preset maps, defaultSettings + LM_THEME_DEFAULTS + lmThemeValue, the gameplay settings validator */
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext(mod, ctx);
const C = ctx.LMMyThemes && ctx.LMMyThemes.core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C) { console.log('FAIL LMMyThemes.core missing'); process.exit(1); }
const TD = ctx.LM_THEME_DEFAULTS;
const J = v => JSON.stringify(v);

// ── values of a stored theme: the theme schema, https URLs, nothing executable
const cb = C.cleanBody({ theme: { bgColor: '#101010', hudScale: '1.2', darkTheme: 'false', namesFont: 'roboto-bold', notATheme: 5, miniMapWidth: 9999, mainColor: 'red;}body{x', customCursor: 'javascript:alert(1)', checkonetimeLc2: true, sectorsSymbol: '<b>abcdef' }, sounds: { messageSound: 'https://www.legendmod.ml/sounds/a.mp3', other: 'https://x.y/z.mp3', commandSound: 'http://x.y/a.mp3' }, hudLayout: 'X' });
check('stored body: values converted and fitted, unknown / unsafe ones dropped', cb && cb.theme.bgColor === '#101010' && cb.theme.hudScale === 1.2 && cb.theme.darkTheme === false && cb.theme.namesFont === 'roboto-bold' && cb.theme.miniMapWidth === 400 && !('notATheme' in cb.theme) && !('mainColor' in cb.theme) && !('customCursor' in cb.theme) && !('checkonetimeLc2' in cb.theme) && cb.theme.sectorsSymbol === 'abcd');
check('stored body: https sounds only, no HUD layout part', J(cb.sounds) === J({ messageSound: 'https://www.legendmod.ml/sounds/a.mp3' }) && !('hudLayout' in cb));
check('stored body with nothing usable is refused', C.cleanBody({ theme: { nothing: 1, bgColor: 'url(x)' } }) === null && C.cleanBody('x') === null && C.cleanBody({ theme: [1] }) === null);
check('URLs: https only, no quotes / spaces / user:password', C.cleanUrl('https://i.imgur.com/abc.png?x=1&y=2#z') === 'https://i.imgur.com/abc.png?x=1&y=2#z' && C.cleanUrl('') === '' && ['http://x.com/a.png', 'https://x.com/a b.png', 'https://u:p@x.com/a.png', 'https://x.com/a").png', 'data:image/png;base64,AA'].every(u => C.cleanUrl(u) === undefined));
check('theme values: the core schema (fitted, choices, colours)', C.themeValue('bordersWidth', 13) === 14 && C.themeValue('preset', 'legendv1') === 'legendv1' && C.themeValue('preset', 'nope') === undefined && C.themeValue('bgColor', '#010203') === '#010203');

// ── sparse and effective themes
const sp = C.sparseTheme(Object.assign({}, TD, { bgColor: '#222222' }));
check('a saved theme keeps only its differences (plus cursor / background)', sp.bgColor === '#222222' && !('mainColor' in sp) && 'customCursor' in sp);
const eff = C.effectiveTheme({ theme: { bgColor: '#222222' } }, Object.assign({}, TD, { mainColor: '#abcdef', customCursor: 'https://x.com/mine.cur' }));
check('applied theme: left-out values are the defaults, the cursor stays', eff.bgColor === '#222222' && eff.mainColor === TD.mainColor && eff.customCursor === 'https://x.com/mine.cur' && !('checkonetimeLc2' in eff) && !('lbTeammateColor' in eff));

// ── history rotation
const e = { id: 'h1', name: 'H', created: 1000, updated: 1000, body: { theme: { bgColor: '#000001' } }, history: [] };
for (let i = 2; i <= 8; i++) C.pushHistory(e, { theme: { bgColor: '#00000' + i } }, 1000 * i);
check('history keeps the last 5 versions, newest first', e.history.length === 5 && e.body.theme.bgColor === '#000008' && J(e.history.map(h => h.body.theme.bgColor)) === J(['#000007', '#000006', '#000005', '#000004', '#000003']));
check('history versions carry the time they were saved', e.history[0].t === 7000 && e.history[4].t === 3000);
check('saving the same theme again adds no version', !C.pushHistory(e, { theme: { bgColor: '#000008' } }, 9999) && e.history.length === 5);
C.restoreVersion(e, 2, 10000);
check('restore: that version is the theme, the replaced one goes to the history', e.body.theme.bgColor === '#000005' && e.history[0].body.theme.bgColor === '#000008' && e.history.length === 5 && !e.history.some(h => h.body.theme.bgColor === '#000005'));
check('restore of a missing version does nothing', !C.restoreVersion(e, 9, 1) && e.body.theme.bgColor === '#000005');

// ── stored data
const st = C.cleanStore({ themes: [
  { id: 'a1', name: 'One<script>', body: { theme: { bgColor: '#010101' } }, history: [{ t: 5, body: { theme: { bgColor: '#020202' } } }, { body: { theme: { nope: 1 } } }, 'x'] },
  { id: 'a1', name: 'Dup', body: { theme: { bgColor: '#010101' } } },
  { id: 'BAD ID', name: 'x', body: { theme: { bgColor: '#010101' } } },
  { id: 'b2', name: 'No body' },
  { id: 'c3', name: 'Bad theme', body: { theme: { bgColor: 'javascript:x' } } },
  { id: 'd4', name: 'Ok', src: 'g:neon', body: { theme: { bgColor: '#030303' } }, history: Array.from({ length: 9 }, (_, i) => ({ t: Date.parse('2025-01-01') + i, body: { theme: { bgColor: '#04040' + i } } })) },
  { id: 'e5', name: 'Bad src', src: 'javascript:', body: { theme: { bgColor: '#030303' } } }
] });
check('stored themes: bad ids, duplicates and unusable bodies dropped', J(st.themes.map(x => x.id)) === J(['a1', 'd4', 'e5']) && st.themes[0].name === 'One');
check('stored history: invalid versions dropped, at most 5', st.themes[0].history.length === 1 && st.themes[1].history.length === 5);
check('stored source checked (a theme installed from the gallery of the old window stays)', st.themes[1].src === 'g:neon' && !('src' in st.themes[2]));
check('garbage store is empty', C.cleanStore('x').themes.length === 0 && C.cleanStore({ themes: 'x' }).themes.length === 0);
const big = C.cleanStore({ themes: Array.from({ length: 50 }, (_, i) => ({ id: 'x' + i, name: 'T' + i, body: { theme: { bgColor: '#000000' } } })) });
check('at most 30 themes', big.themes.length === C.MAX_THEMES);
// fitting the cap: oldest versions go first
const fat = { v: 1, themes: [0, 1].map(i => ({ id: 'f' + i, name: 'F', created: 1, updated: 1, body: { theme: { sectorsSymbol: 'x' } }, history: Array.from({ length: 5 }, (_, j) => ({ t: 1000 + j * 10 + i, body: { theme: { bgColor: '#00000' + j, x: 'y'.repeat(1000) } } })) })) };
const before = JSON.stringify(fat).length;
check('cap: oldest history versions dropped until it fits', C.fitStore(fat, before - 2500) && fat.themes[0].history.length + fat.themes[1].history.length === 7);
const left = fat.themes.reduce((a, x) => a.concat(x.history.map(h => h.t)), []);
check('cap: the oldest are the ones removed', ![1000, 1001, 1010].some(x => left.includes(x)) && left.includes(1011));
const fat2 = JSON.parse(J(fat));
check('cap: refused when even without history it is too big', !C.fitStore(fat2, 50) && fat2.themes.every(x => x.history.length === 0));

// storage full: nothing changes, the old text stays
ctx.localStorage = makeStorage(400);
ctx.localStorage.setItem(C.KEY_STORE, JSON.stringify({ v: 1, themes: [{ id: 'k1', name: 'Kept', body: { theme: { bgColor: '#000000' } } }] }));
const full = C.loadStore();
full.themes.push({ id: 'k2', name: 'New', description: 'x'.repeat(300), created: 1, updated: 1, body: { theme: { bgColor: '#ffffff', menuMainColor: '#ffffff', hudMainColor: '#ffffff' } }, history: [] });
check('storage full: save reports it', C.saveStore(full) === 'storageFull');
check('storage full: the stored themes are unchanged', C.loadStore().themes.length === 1 && C.loadStore().themes[0].name === 'Kept');
ctx.localStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
check('blocked storage: loads empty, save fails without throwing', C.loadStore().themes.length === 0 && C.saveStore({ v: 1, themes: [] }) === 'storageFull');
ctx.localStorage = makeStorage(0);
ctx.localStorage.setItem(C.KEY_STORE, '{"v":1,"themes":[{"id":"z1","name":"Z","body":{"theme":{"bgColor":"#000"}}}]');
check('broken stored JSON loads empty', C.loadStore().themes.length === 0);
// ── a store of the old Theme workshop window loads as My themes (same key); its extra fields are dropped
ctx.localStorage = makeStorage(0);
ctx.localStorage.setItem('lmThemeWorkshop', J({ v: 1, themes: [{ id: 'tw1', name: 'Neon', author: 'Legend Mod', description: 'd', created: '2026-11-24T00:00:00Z', updated: 1764000000000, src: 'g:neon', body: { theme: { bgColor: '#0a0010' }, sounds: { messageSound: 'https://www.legendmod.ml/sounds/a.mp3' }, hudLayout: 'Compact' }, history: [{ t: 1764000000000, body: { theme: { bgColor: '#000000' } } }] }] }));
const old = C.loadStore().themes;
check('old workshop store: the theme, its sound and its version are kept', C.KEY_STORE === 'lmThemeWorkshop' && old.length === 1 && old[0].name === 'Neon' && old[0].body.theme.bgColor === '#0a0010' && old[0].body.sounds.messageSound === 'https://www.legendmod.ml/sounds/a.mp3' && old[0].history.length === 1);
check('old workshop store: author, description and HUD layout dropped', !('author' in old[0]) && !('description' in old[0]) && !('hudLayout' in old[0].body));

// ── the Theme workshop window is gone: its hotkey, and a key a player bound to it is free again
{
  const hkSrc = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
  const hctx = { console, Object, String, Array, JSON, Math, lmT: k => k, textLanguage: {}, chatCommand: {}, application: {}, toastr: { info() { } }, $: () => ({ trigger() { }, val() { return ''; } }) };
  hctx.window = hctx;
  vm.createContext(hctx);
  vm.runInContext(hkSrc, hctx);
  check('hotkeys: no Theme workshop command', !('hk-lmThemeWorkshop' in hctx.hotkeysCommand));
  const rs = main.indexOf('function lmRenameOldHotkeys(map) {'), re = main.indexOf('\n}', rs);
  const rctx = { JSON, Object, String };
  vm.createContext(rctx);
  vm.runInContext(main.slice(rs, re + 2), rctx);
  const map = { F7: 'hk-lmThemeWorkshop', Q: 'hk-feed' };
  check('a saved key on the Theme workshop is dropped quietly, the others stay', rctx.lmRenameOldHotkeys(map) === true && J(map) === J({ Q: 'hk-feed' }));
  check('My themes is loaded instead of the window', main.indexOf('modules/mythemes.js') > 0 && main.indexOf('modules/themeworkshop.js') < 0 && !fs.existsSync(path.join(root, 'ogario', 'modules', 'themeworkshop.js')));
}
console.log(fail ? fail + ' my themes check(s) FAILED' : 'all my themes checks passed');
process.exit(fail ? 1 : 0);
