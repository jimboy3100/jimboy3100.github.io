/* Theme workshop checks: package validation (malicious and oversized input), export / import
 * round trip, comparison, version history rotation, storage caps and the shipped gallery of
 * ogario/modules/themeworkshop.js, against the real theme schema of ogario/ogario.v4.js.
 * node developers/tests/themeworkshop.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const mod = fs.readFileSync(path.join(root, 'ogario', 'modules', 'themeworkshop.js'), 'utf8');
const catalogue = fs.readFileSync(path.join(root, 'ogario', 'themes', 'catalogue.json'), 'utf8');
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
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext(mod, ctx);
const C = ctx.LMThemeWorkshop && ctx.LMThemeWorkshop.core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C) { console.log('FAIL LMThemeWorkshop.core missing'); process.exit(1); }
const TD = ctx.LM_THEME_DEFAULTS;
const J = v => JSON.stringify(v);
const pkg = extra => Object.assign({ format: 'lm-theme', version: 1, name: 'Test', theme: { bgColor: '#123456' } }, extra || {});

// ── a normal package
let r = C.parsePackage(JSON.stringify(pkg({
  author: 'Me', description: 'Nice', created: '2025-03-01T10:00:00Z',
  theme: { bgColor: '#101010', hudScale: '1.2', darkTheme: 'false', namesFont: 'roboto-bold', chatPos: 'topright', notATheme: 5, miniMapWidth: 9999 },
  sounds: { messageSound: 'https://www.legendmod.ml/sounds/a.mp3', other: 'https://x.y/z.mp3' },
  cursor: 'https://www.legendmod.ml/cursors/cursor_10.cur',
  hudLayout: 'Compact 2',
  extraTop: { a: 1 }
})));
check('valid package accepted', r.ok);
const t = r.ok ? r.pkg.body.theme : {};
check('values converted to the setting types', t.bgColor === '#101010' && t.hudScale === 1.2 && t.darkTheme === false && t.namesFont === 'roboto-bold' && t.chatPos === 'topright');
check('numbers clamped to the slider range', t.miniMapWidth === 400);
check('cursor URL becomes the theme cursor', t.customCursor === 'https://www.legendmod.ml/cursors/cursor_10.cur');
check('unknown keys dropped (theme, sounds, top level)', !('notATheme' in t) && r.dropped.includes('notATheme') && r.dropped.includes('sounds.other') && r.dropped.includes('extraTop'));
check('sounds and HUD layout kept', r.ok && r.pkg.body.sounds.messageSound === 'https://www.legendmod.ml/sounds/a.mp3' && r.pkg.body.hudLayout === 'Compact 2');
check('created date read', r.ok && r.pkg.created === Date.parse('2025-03-01T10:00:00Z'));
check('URLs listed for review', r.ok && r.urls.length === 2 && r.urls.some(u => u.key === 'customCursor') && r.urls.some(u => u.key === 'messageSound'));

// ── wrong format, version, JSON
check('not JSON is refused', C.parsePackage('{nope').error === 'notJson');
check('other format is refused', C.parsePackage({ format: 'lm-profile', version: 1, theme: { bgColor: '#000' } }).error === 'notTheme');
check('newer version is refused with its own message', C.parsePackage(pkg({ version: 2 })).error === 'newer');
check('arrays and primitives are refused', C.parsePackage('[1,2]').error === 'notTheme' && C.parsePackage('"x"').error === 'notTheme' && C.parsePackage(null).error === 'notTheme');
check('a theme with nothing usable is refused', C.parsePackage(pkg({ theme: { nothing: 1, bgColor: 'url(x)' } })).error === 'empty');

// ── malicious input
const bad = ['javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'http://example.com/c.cur', 'data:image/png;base64,AAAA', '//example.com/x.png',
  'https://example.com/x.png)};body{background:red', "https://example.com/x'.png", 'https://example.com/a b.png', 'https://user:pw@example.com/x.png',
  'https://example.com/x.png"onerror="alert(1)', 'https://example.com\\@evil.com/x', 'https://' + 'a'.repeat(500) + '.com/x', ' javascript:alert(1)'];
bad.forEach(u => {
  const p = C.parsePackage(pkg({ cursor: u, background: u, sounds: { messageSound: u }, theme: { bgColor: '#000000', menuBg: u } }));
  check('URL refused everywhere: ' + u.slice(0, 50), p.ok && !('customCursor' in p.pkg.body.theme) && !('customBackground' in p.pkg.body.theme) && !('menuBg' in p.pkg.body.theme) && !p.pkg.body.sounds);
});
check('https URL with query accepted', C.cleanUrl('https://i.imgur.com/abc.png?x=1&y=2#z') === 'https://i.imgur.com/abc.png?x=1&y=2#z' && C.cleanUrl('') === '');
r = C.parsePackage(pkg({ name: '<img src=x onerror=alert(1)>Cool<script>alert(2)</script>', author: 'A\u0000B‮C<b>x</b>', description: 'd'.repeat(5000) }));
check('HTML and control characters removed from texts', r.ok && !/[<>]/.test(r.pkg.name) && r.pkg.name.includes('Cool') && !/[\u0000‮<>]/.test(r.pkg.author));
check('texts capped (name 40, description 200)', r.ok && Array.from(r.pkg.name).length <= 40 && r.pkg.description.length === 200);
check('empty name becomes "Theme"', C.parsePackage(pkg({ name: '<b></b>' })).pkg.name === i18n.t('modules.themeworkshop.defaultName'));
ctx.LMi18n.setLang('el');
check('empty name in Greek after a language change', C.parsePackage(pkg({ name: '<b></b>' })).pkg.name === i18n.t('modules.themeworkshop.defaultName', null, 'el') && i18n.t('modules.themeworkshop.defaultName', null, 'el') !== 'Theme');
ctx.LMi18n.setLang('en');
r = C.parsePackage(pkg({ theme: { bgColor: 'red;background:url(javascript:x)', mainColor: '#12345g', hudColor: 'rgba(0,0,0,0.4)', borderGlowColor: 'expression(alert(1))', virusColor: 'blue' } }));
check('colour check: CSS injection refused, plain colours kept', r.ok && !('bgColor' in r.pkg.body.theme) && !('mainColor' in r.pkg.body.theme) && !('borderGlowColor' in r.pkg.body.theme) && r.pkg.body.theme.hudColor === 'rgba(0,0,0,0.4)' && r.pkg.body.theme.virusColor === 'blue');
r = C.parsePackage(pkg({ theme: { bgColor: '#000', namesFont: 'Comic Sans; }', namesFontFamily: 'x}*{display:none', chatPos: '__proto__', preset: 'constructor', menuPreset: 'legendv2', sectorsSymbol: '<b>☆☆☆☆☆', graphics: 'high' } }));
check('fonts and presets must be known names', r.ok && !('namesFont' in r.pkg.body.theme) && !('namesFontFamily' in r.pkg.body.theme) && !('chatPos' in r.pkg.body.theme) && !('preset' in r.pkg.body.theme) && r.pkg.body.theme.menuPreset === 'legendv2' && r.pkg.body.theme.graphics === 'high');
check('sector symbol: no tags, at most 4 characters', r.ok && r.pkg.body.theme.sectorsSymbol === '☆☆☆☆');
r = C.parsePackage(pkg({ theme: { bgColor: '#000', hudScale: 'NaN', chatScale: Infinity, namesScale: { valueOf: 1 }, cellsAlpha: [1], darkTheme: 1, checkonetimeLc2: true, lbTeammateColor: '#fff', commanderImage: 'https://x.com/a.png', customCursor: 'https://www.legendmod.ml/c.cur' } }));
check('NaN, Infinity, objects, arrays and wrong types dropped', r.ok && !('hudScale' in r.pkg.body.theme) && !('chatScale' in r.pkg.body.theme) && !('namesScale' in r.pkg.body.theme) && !('cellsAlpha' in r.pkg.body.theme) && !('darkTheme' in r.pkg.body.theme));
check('flag, LMexpress marker and commander images are not theme values', r.ok && !('checkonetimeLc2' in r.pkg.body.theme) && !('lbTeammateColor' in r.pkg.body.theme) && !('commanderImage' in r.pkg.body.theme) && r.pkg.body.theme.customCursor === 'https://www.legendmod.ml/c.cur');
r = C.parsePackage('{"format":"lm-theme","version":1,"name":"P","theme":{"__proto__":{"polluted":1},"constructor":{"x":1},"bgColor":"#000"},"__proto__":{"polluted":2}}');
check('__proto__ / constructor keys do nothing', r.ok && ({}).polluted === undefined && ctx.Object.prototype.polluted === undefined && J(Object.keys(r.pkg.body.theme)) === J(['bgColor']));
check('executable values are not kept', (() => { const p = C.parsePackage({ format: 'lm-theme', version: 1, theme: { bgColor: '#000', mainColor: () => 1, sectorsSymbol: { toString() { return 'x'; } } } }); return p.ok && J(Object.keys(p.pkg.body.theme)) === J(['bgColor']); })());

// ── huge payloads
check('text over 64 KB refused before parsing', C.parsePackage('{"format":"lm-theme","version":1,"theme":{"bgColor":"#000"},"x":"' + 'a'.repeat(70000) + '"}').error === 'tooBig');
const many = { bgColor: '#000' }; for (let i = 0; i < 5000; i++) many['k' + i] = i;
check('a theme with thousands of keys refused', C.parsePackage(pkg({ theme: many })).error === 'tooBig');
r = C.parsePackage(pkg({ name: 'n'.repeat(1e6), theme: { bgColor: '#000', sectorsSymbol: 's'.repeat(1e6) } }));
check('huge strings in a parsed object are cut', r.ok && r.pkg.name.length === 40 && r.pkg.body.theme.sectorsSymbol.length === 4);

// ── export / import round trip
const entry = { id: 'a1', name: 'Round', author: 'Au', description: 'De', created: Date.parse('2025-01-02T00:00:00Z'), body: { theme: { bgColor: '#111111', customCursor: 'https://www.legendmod.ml/cursors/cursor_03.cur', customBackground: '' }, sounds: { commandSound: '' }, hudLayout: 'Mine' } };
const out = C.toPackage(entry);
check('export: format, version, cursor / background at the top', out.format === 'lm-theme' && out.version === 1 && out.cursor === entry.body.theme.customCursor && out.background === '' && !('customCursor' in out.theme) && out.created === '2025-01-02T00:00:00.000Z');
r = C.parsePackage(JSON.stringify(out));
check('import of an export gives the same theme', r.ok && J(r.pkg.body) === J(entry.body) && r.pkg.name === 'Round' && r.pkg.author === 'Au');

// ── sparse and effective themes
const sp = C.sparseTheme(Object.assign({}, TD, { bgColor: '#222222' }));
check('a saved theme keeps only its differences (plus cursor / background)', sp.bgColor === '#222222' && !('mainColor' in sp) && 'customCursor' in sp);
const eff = C.effectiveTheme({ theme: { bgColor: '#222222' } }, Object.assign({}, TD, { mainColor: '#abcdef', customCursor: 'https://x.com/mine.cur' }));
check('applied theme: left-out values are the defaults, the cursor stays', eff.bgColor === '#222222' && eff.mainColor === TD.mainColor && eff.customCursor === 'https://x.com/mine.cur' && !('checkonetimeLc2' in eff) && !('lbTeammateColor' in eff));

// ── comparison
const cur = Object.assign({}, TD);
let rows = C.diffBodies({ theme: { bgColor: '#000000', hudScale: 1.2 } }, { theme: { bgColor: '#ffffff', hudScale: 1.2 }, sounds: { messageSound: '' }, hudLayout: 'X' }, cur);
check('diff lists what differs', rows.length === 3 && rows.some(x => x.key === 'bgColor' && x.a === '#000000' && x.b === '#ffffff') && rows.some(x => x.key === 'messageSound' && x.part === 'sound') && rows.some(x => x.key === 'hudLayout'));
check('diff labels translated, without markup', rows.find(x => x.key === 'bgColor').label === 'Background' && C.diffBodies({ theme: { hudScale: 1.1 } }, { theme: { hudScale: 1.3 } }, cur)[0].label === 'HUD scale');
check('diff label falls back to a readable key', C.diffBodies({ theme: { miniMapNickSize: 9 } }, { theme: { miniMapNickSize: 12 } }, cur)[0].label === 'Mini map nick size');
check('diff: left-out value counts as the default', C.diffBodies({ theme: { bgColor: TD.bgColor } }, { theme: { mainColor: TD.mainColor } }, cur).length === 0);
check('diff of a theme with itself is empty', C.diffBodies(entry.body, JSON.parse(J(entry.body)), cur).length === 0);

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
check('stored source checked', st.themes[1].src === 'g:neon' && !('src' in st.themes[2]));
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

// ── placement
let p = C.fitRect({ w: 915, h: 412 }, [{ left: 470, top: 6, right: 502, bottom: 38 }], 6, 300, 220);
check('window below a bell at the top: ' + J(p), p.top >= 44 && p.left === 8 && p.width === 899 && p.top + p.height <= 404 && !p.overlap);
p = C.fitRect({ w: 915, h: 412 }, [{ left: 875, top: 190, right: 907, bottom: 222 }], 6, 300, 220);
check('window left of a bell at the right edge: ' + J(p), p.left + p.width <= 869 && p.height === 396);
p = C.fitRect({ w: 915, h: 412 }, [], 6, 300, 220);
check('no bell: the whole screen with a margin', p.left === 8 && p.top === 8 && p.width === 899 && p.height === 396);

// ── the shipped gallery
const cat = JSON.parse(catalogue);
const g = C.cleanCatalogue(cat);
check('gallery: 4-6 themes, all valid', Array.isArray(g) && g.length >= 4 && g.length <= 6 && g.length === cat.themes.length);
cat.themes.forEach(th => {
  const res = C.parsePackage(th);
  check('gallery theme "' + th.name + '": nothing dropped, has a description', res.ok && res.dropped.length === 0 && res.pkg.description.length > 10 && Object.keys(res.pkg.body.theme).length === Object.keys(th.theme).length + (th.cursor ? 1 : 0) + (th.background ? 1 : 0));
});
check('gallery: distinct names and ids', new Set(g.map(x => x.pkg.name)).size === g.length && new Set(g.map(x => x.gid)).size === g.length);
check('gallery: fonts consistent with their family / weight', cat.themes.every(th => ['names', 'mass', 'hud', 'sectors', 'miniMap', 'miniMapNick'].every(f => {
  const v = th.theme[f + 'Font']; if (!v) return true;
  return th.theme[f + 'FontFamily'] === v.split('-')[0].replace(/^./, c => c.toUpperCase()) && th.theme[f + 'FontWeight'] === (/bold/.test(v) ? 700 : 400);
})));
check('gallery: a catalogue of another format is refused', C.cleanCatalogue({ format: 'x', themes: [] }) === null && C.cleanCatalogue({ format: 'lm-theme-catalogue', themes: [{ format: 'lm-theme', version: 1, theme: { bgColor: 'javascript:x' } }] }).length === 0);
check('catalogue file is small', catalogue.length < 256 * 1024);

// ── built-in presets (the Theme preset / Menu theme lists that moved from the Theme tab)
const B = C.builtins();
const nGame = Object.keys(ctx.themePresets).length, nMenu = Object.keys(ctx.themeMenus).length;
check('built-in: every game and menu preset listed', B.filter(b => b.kind === 'game').length === nGame && B.filter(b => b.kind === 'menu').length === nMenu && nGame >= 8 && nMenu >= 3);
check('built-in: distinct ids', new Set(B.map(b => b.bid)).size === B.length && B.every(b => /^[a-z0-9-]+$/.test(b.bid)));
B.forEach(b => {
  const src = (b.kind === 'menu' ? ctx.themeMenus : ctx.themePresets)[b.key];
  const m = C.presetMap(b) || {};
  /* the old list set every key of the preset that is a setting (Settings.changePreset); except
   * lbTeammateColor: not drawn, only a marker LMexpress reads, and never part of a theme */
  const keys = Object.keys(src).filter(k => k !== 'name' && k !== 'lbTeammateColor' && Object.prototype.hasOwnProperty.call(TD, k));
  const lost = keys.filter(k => !(k in m) || J(m[k]) !== J(C.themeValue(k, src[k])));
  check('built-in "' + b.name + '" (' + b.kind + '): every value kept' + (lost.length ? ' (lost: ' + lost.join(', ') + ')' : ''), lost.length === 0 && m[b.kind === 'menu' ? 'menuPreset' : 'preset'] === b.key);
});
const base = { theme: { bgColor: '#123456', hudScale: 1.2 } };
const lv1 = B.filter(b => b.kind === 'menu' && b.key === 'legendv1')[0];
const ob = lv1 && C.builtinBody(lv1, base);
check('built-in over a theme: other settings stay, the preset wins', !!ob && ob.theme.bgColor === '#123456' && ob.theme.hudScale === 1.2 && ob.theme.menuMainColor === ctx.themeMenus.legendv1.menuMainColor && base.theme.menuMainColor === undefined);
check('built-in: unknown preset gives nothing', C.presetMap({ kind: 'game', key: 'nope' }) === null && C.presetMap({ kind: 'x', key: 'legendv2' }) === null);

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
