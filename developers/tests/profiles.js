/* Settings profiles checks: validation, comparison, templates and backup rotation of
 * ogario/modules/profiles.js, against the real setting schemas of ogario/ogario.v4.js.
 * node developers/tests/profiles.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const mod = fs.readFileSync(path.join(root, 'ogario', 'modules', 'profiles.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };

/* a localStorage that throws like a full one once it holds more than `limit` characters */
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
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = makeStorage(0);
ctx.hotkeysCommand = { 'hk-feed': { defaultKey: 'W' }, 'hk-split': { defaultKey: 'SPACE' }, 'hk-newThing': { defaultKey: 'N' }, 'hk-noKey': { defaultKey: '' } };
vm.createContext(ctx);
/* the real schemas and validators (defaultSettings + LM_THEME_DEFAULTS + lmThemeValue, defaultmapsettings + LM_SETTINGS_DEFAULTS + lmSettingValue) */
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext(mod, ctx);
const C = ctx.LMProfiles && ctx.LMProfiles.core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C) { console.log('FAIL LMProfiles.core missing'); process.exit(1); }
const D = ctx.LM_SETTINGS_DEFAULTS, TD = ctx.LM_THEME_DEFAULTS;
const J = v => JSON.stringify(v);

// ── validation
const b = C.cleanBundle({
  s: { showMass: 'false', fpsLimit: '60', animation: NaN, notASetting: true, chatHideWords: 5, oppColors: true },
  t: { miniMapWidth: '240', notTheme: 1, mainColor: 'red;background:url(x)' },
  h: { W: 'hk-feed', Q: 'hk-unknown', 'spec-messageKey': 'ENTER' },
  m: { btnScale: 9, jsSensitivity: '250', targetMode: 'yes', other: 1 },
  k: ['hk-feed', 7]
});
check('settings: "false" becomes false, "60" becomes 60', b.s.showMass === false && b.s.fpsLimit === 60);
check('settings: NaN, unknown key and wrong type dropped', !('animation' in b.s) && !('notASetting' in b.s) && !('chatHideWords' in b.s) && b.s.oppColors === true);
check('theme: numeric string converted, unknown key dropped', b.t.miniMapWidth === 240 && !('notTheme' in b.t));
check('theme: a colour that is not a plain colour is dropped', !('mainColor' in b.t) || typeof TD.mainColor !== 'string');
check('hotkeys: unknown command dropped, chat key kept', b.h.W === 'hk-feed' && !('Q' in b.h) && b.h['spec-messageKey'] === 'ENTER');
check('hotkeys: known command list keeps strings only', J(b.k) === J(['hk-feed']));
check('phone controls: clamped to range, wrong types and unknown keys dropped', b.m.btnScale === 1.5 && b.m.jsSensitivity === 250 && !('targetMode' in b.m) && !('other' in b.m));
check('a set with nothing valid is null', C.cleanBundle({ s: { nope: 1 }, h: { X: 'hk-gone' } }) === null && C.cleanBundle('x') === null && C.cleanBundle([1]) === null);
check('an empty hotkey part is not kept (it would unbind everything)', !('h' in C.cleanBundle({ s: { showMass: true }, h: {} })));
const profs = C.cleanProfiles([
  { id: 'a1', name: '  Mine\u0007 ', data: { s: { showMass: true } } },
  { id: 'a1', name: 'dup', data: { s: { showMass: true } } },
  { id: 'bad id!', name: 'x', data: { s: { showMass: true } } },
  { id: 'c', name: '', data: { s: { showMass: true } } },
  { id: 'd', name: 'no data', data: { s: { zzz: 1 } } },
  { id: 'e', name: 'x'.repeat(90), data: { s: { showMass: false } }, tpl: 'ffa', created: -5 },
  null, 'str'
]);
check('profiles: duplicates, bad ids, empty names and empty data dropped', profs.length === 2 && profs[0].name === 'Mine' && profs[1].id === 'e');
check('profiles: names capped at 40, bad dates 0, known template kept', profs[1].name.length === 40 && profs[1].created === 0 && profs[1].tpl === 'ffa');
check('profiles: at most 30', C.cleanProfiles(Array.from({ length: 40 }, (_, i) => ({ id: 'p' + i, name: 'n' + i, data: { s: { showMass: true } } }))).length === 30);
check('profiles: not an array -> empty', C.cleanProfiles({ a: 1 }).length === 0);

// ── comparison
const cur = C.cleanBundle({ s: Object.assign({}, D), t: Object.assign({}, TD), h: { W: 'hk-feed', SPACE: 'hk-split', 'spec-messageKey': 'ENTER' }, m: { btnScale: 1, netGraph: false } });
const other = C.cleanBundle({ s: { showMass: !D.showMass, fpsLimit: D.fpsLimit + 30, oppColors: D.oppColors }, t: { miniMapWidth: TD.miniMapWidth + 10 }, h: { E: 'hk-feed', SPACE: 'hk-split', 'spec-messageKey': 'ENTER' }, m: { btnScale: 1.2, netGraph: false } });
const rows = C.diffBundles(cur, other, (p, k) => p + ':' + k);
const keys = rows.map(r => r.part + '.' + r.key).sort();
check('diff lists every differing setting, theme option, hotkey and phone control', J(keys) === J(['h.hk-feed', 'm.btnScale', 's.fpsLimit', 's.showMass', 't.miniMapWidth']));
const hk = rows.filter(r => r.part === 'h')[0];
check('diff: hotkeys compared per command (its keys)', hk.a === 'W' && hk.b === 'E');
check('diff: labels from the label function, values both sides', rows.filter(r => r.key === 'showMass')[0].label === 's:showMass' && rows.filter(r => r.key === 'fpsLimit')[0].b === D.fpsLimit + 30);
check('diff: a part only one side has is not compared', C.diffBundles(cur, C.cleanBundle({ s: { showMass: D.showMass } })).length === 0);
check('diff: identical sets have no differences', C.diffBundles(cur, JSON.parse(J(cur))).length === 0);
const unbound = C.diffBundles(C.cleanBundle({ h: { W: 'hk-feed' } }), C.cleanBundle({ h: { SPACE: 'hk-split' } }));
check('diff: a command bound on one side only shows as unbound on the other', unbound.length === 2 && unbound.some(r => r.key === 'hk-feed' && r.b === '') && unbound.some(r => r.key === 'hk-split' && r.a === ''));

// ── hotkeys of commands newer than a profile
const filled = C.fillNewDefaults({ W: 'hk-feed' }, ['hk-feed', 'hk-split', 'hk-noKey'], ctx.hotkeysCommand);
check('new commands get their free default key; known unbound commands stay unbound', filled.N === 'hk-newThing' && !('SPACE' in filled) && filled.W === 'hk-feed');
check('a default key already used is not taken', C.fillNewDefaults({ N: 'hk-feed' }, ['hk-feed'], ctx.hotkeysCommand).N === 'hk-feed');
check('without a known list nothing is added', J(C.fillNewDefaults({ W: 'hk-feed' }, null, ctx.hotkeysCommand)) === J({ W: 'hk-feed' }));
check('effective(): the set as applied', C.effective(C.cleanBundle({ h: { W: 'hk-feed' }, k: ['hk-feed', 'hk-split'] })).h.N === 'hk-newThing');

// ── templates
const tplIds = Object.keys(C.TEMPLATES);
check('six templates: FFA, Teams, Multibox, Streaming, Mobile, Competitive', J(tplIds) === J(['ffa', 'teams', 'multibox', 'streaming', 'mobile', 'competitive']));
tplIds.forEach(id => {
  const set = C.TEMPLATES[id].set;
  const bad = Object.keys(set).filter(k => !Object.prototype.hasOwnProperty.call(D, k) || ctx.lmSettingValue(k, set[k]) !== set[k]);
  check('template ' + id + ': every key is a gameplay setting with a valid value', bad.length === 0 || !console.log('   bad: ' + bad.join(', ')));
  const res = C.applyTemplate(cur, id);
  const changed = C.diffBundles(cur, res.data).map(r => r.key).sort();
  const expect = Object.keys(set).filter(k => set[k] !== D[k]).sort();
  check('template ' + id + ': on top of the current settings, only its own keys change', J(changed) === J(expect) && res.keys.length === Object.keys(set).length);
  check('template ' + id + ': theme, hotkeys and phone controls kept', J(res.data.t) === J(cur.t) && J(res.data.h) === J(cur.h) && J(res.data.m) === J(cur.m));
});
check('template: the base set is not changed', J(C.applyTemplate(cur, 'ffa').data) !== J(cur) && cur.s.showTop5 === D.showTop5);
check('unknown template: the set unchanged', J(C.applyTemplate(cur, 'nope').data) === J(cur));

// ── backup rotation
const snap = n => ({ s: { fpsLimit: n } });
let list = [];
for (let i = 1; i <= 7; i++) list = C.pushBackup(list, { t: 1000 + i, reason: 'change', data: snap(i) }, 5, 1e9);
check('rotation: the last 5 kept, newest first', list.length === 5 && J(list.map(x => x.data.s.fpsLimit)) === J([7, 6, 5, 4, 3]));
check('rotation: a backup equal to the newest is not added', C.pushBackup(list, { t: 2000, reason: 'profile', data: snap(7) }, 5, 1e9).length === 5 && C.pushBackup(list, { t: 2000, reason: 'profile', data: snap(7) }, 5, 1e9)[0].t === 1007);
check('rotation: equal to an older one is still added (a real change back)', C.pushBackup(list, { t: 2000, reason: 'change', data: snap(5) }, 5, 1e9)[0].t === 2000);
const big = { s: { chatHideWords: 'x'.repeat(30000) } };
let capped = [];
for (let i = 0; i < 5; i++) capped = C.pushBackup(capped, { t: 10 + i, reason: 'change', data: { s: { chatHideWords: 'x'.repeat(30000) + i } } }, 5, 100000);
check('rotation: the size cap drops the oldest first', capped.length === 3 && capped[0].t === 14 && capped[2].t === 12);
check('rotation: a single backup over the entry limit is not kept', C.pushBackup([], { t: 1, reason: 'change', data: { s: { chatHideWords: 'x'.repeat(300000) } } }, 5, 1e9).length === 0);
const cb = C.cleanBackups([{ t: 5, reason: 'weird', data: snap(1) }, { t: 9, reason: 'import', data: snap(2) }, { t: 0, data: snap(3) }, { t: 7, data: { s: { nope: 1 } } }, { t: 1, data: snap(4) }, { t: 2, data: snap(5) }, { t: 3, data: snap(6) }, { t: 4, data: snap(7) }]);
check('stored backups: invalid ones dropped, unknown reason -> change, sorted, at most 5', cb.length === 5 && cb[0].t === 9 && cb[0].reason === 'import' && cb[1].reason === 'change' && cb[4].t === 2);
// storage full: saveBackups drops the oldest until the list fits, and never throws
const full = makeStorage(40000);
const saved = C.saveBackups(capped, full);
check('storage full: the oldest backups are dropped until it fits', saved && saved.length >= 1 && saved.length < capped.length && saved[0].t === 14 && JSON.parse(full.getItem(C.KEY_BACKUPS)).length === saved.length);
const tiny = makeStorage(10);
check('storage full: nothing fits -> null, no exception', C.saveBackups(capped, tiny) === null);

// ── transactional writes
const st = makeStorage(200);
st.setItem('a', 'old-a');
check('transaction: all written when it fits', C.writeTransaction([{ key: 'a', text: 'A' }, { key: 'b', text: 'B' }], st) && st.getItem('a') === 'A' && st.getItem('b') === 'B');
st.setItem('a', 'old-a'); st.removeItem('b');
const okT = C.writeTransaction([{ key: 'a', text: 'new' }, { key: 'b', text: 'y'.repeat(500) }], st);
check('transaction: a full storage rolls everything back', !okT && st.getItem('a') === 'old-a' && st.getItem('b') === null);

// ── automatic switching rules
const rules = C.cleanRules({ enabled: true, server: { agario: 'p1', nowhere: 'p2' }, mode: { ':teams': 'p2' }, device: { touch: 'p3', gamepad: 'p4', desktop: 'gone' } }, [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }]);
check('rules: unknown server types and deleted profiles dropped', J(rules.server) === J({ agario: 'p1' }) && !('desktop' in rules.device));
check('rules: off unless enabled is true', C.cleanRules({ enabled: 'true' }).enabled === false && C.cleanRules(null).enabled === false);
check('rules: server type first', C.pickRule(rules, { serverType: 'agario', gameMode: ':teams', touch: true }).id === 'p1');
check('rules: then game mode', C.pickRule(rules, { serverType: 'deltio', gameMode: ':teams', touch: true }).id === 'p2');
check('rules: then a connected gamepad, then touch', C.pickRule(rules, { serverType: 'deltio', gameMode: ':ffa', touch: true, gamepad: true }).id === 'p4' && C.pickRule(rules, { serverType: '', gameMode: '', touch: true }).id === 'p3');
check('rules: no match -> null; disabled -> null', C.pickRule(rules, { serverType: 'deltio', gameMode: ':ffa', touch: false }) === null && C.pickRule(Object.assign({}, rules, { enabled: false }), { serverType: 'agario' }) === null);

// ── zoom bookmarks (hudhelpers.js keeps them as an array of 3 zoom levels, 0 = not saved)
const zbSet = C.cleanBundle({ s: { showMass: true }, zb: [1, 2, 3] });
check('zoom bookmarks: kept by the validation', !!zbSet && J(zbSet.zb) === J([1, 2, 3]) && zbSet.s.showMass === true);
check('zoom bookmarks: an unsaved slot (0) is kept', J((C.cleanBundle({ zb: [0, 2.5, 0] }) || {}).zb) === J([0, 2.5, 0]));
check('zoom bookmarks: wrong length, type or range dropped as a whole', [[1, 2], [1, '2', 3], [1, 99, 1], [1, NaN, 1], [0, 0, 0], { 0: 1 }, 'x'].every(z => !('zb' in (C.cleanBundle({ s: { showMass: true }, zb: z }) || {}))));
check('zoom bookmarks: a difference is listed', C.diffBundles(C.cleanBundle({ s: { showMass: true }, zb: [1, 2, 3] }), C.cleanBundle({ s: { showMass: true }, zb: [1, 2, 4] })).some(r => r.part === 'zb'));

// ── gamepad buttons and phone control layouts are compared too
const gpOnly = C.diffBundles(C.cleanBundle({ s: { showMass: true }, gp: { v: 1, map: ['split'] } }), C.cleanBundle({ s: { showMass: true }, gp: { v: 1, map: ['feed'] } }));
check('diff: a set differing only in the gamepad buttons is not the same', gpOnly.length === 1 && gpOnly[0].part === 'gp');
const mlOnly = C.diffBundles(C.cleanBundle({ s: { showMass: true } }), C.cleanBundle({ s: { showMass: true }, ml: { v: 1, active: 'x' } }));
check('diff: a set differing only in the phone control layout is not the same', mlOnly.length === 1 && mlOnly[0].part === 'ml');

// ── settings export / import: one list of the module configuration keys (round trip)
{
  const fn = (n) => typeof ctx[n] === 'function' ? ctx[n] : null;
  const exp = fn('lmExportExtras'), imp = fn('lmImportExtras');
  check('export registry: lmExportExtras / lmImportExtras exist', !!(exp && imp && Array.isArray(ctx.LM_EXPORT_KEYS)));
  if (exp && imp) {
    const src = makeStorage(0);
    const conf = {
      lmHudLayouts: { v: 1, active: 'A', list: [{ name: 'A', c: {} }] }, lmCustomMacros: { slots: [{ name: 'm', steps: [] }] },
      'lm-zoom-bookmarks': [1, 0, 3], lmThemeWorkshop: { v: 1, themes: [] }, 'lm-director': { speed: 3 },
      'lm-director-bookmarks': [{ x: 1, y: 2 }], lmPracticeCfg: { bots: 4 }, lmAnalyticsGoals: { v: 1, custom: [] },
      lmSettingsProfiles: [{ id: 'p1', name: 'P', data: { s: { showMass: true } } }], lmSettingsProfilesRules: { enabled: false },
      lmGamepad: { v: 1, map: [] }, 'lm-mobile-prefs': { btnScale: 1 }, 'lm-mobile-layouts': { v: 1 }, lmPerfBackup: { jellyPhisycs: true }, lmPresetUndo: { s: {} }
    };
    const priv = { lmAnalyticsGames: [{ m: 1 }], lmAnalyticsTracks: [{ t: 1 }], lmPracticeStore: { best: 1 }, 'lm-director-watch': ['nick'], lmSettingsBackups: [{ t: 1 }], ogarioPlayerProfiles: [1] };
    Object.keys(conf).concat(Object.keys(priv)).forEach(k => src.setItem(k, J(conf[k] || priv[k])));
    const out = JSON.parse(J(exp(src)));
    check('export: every configuration key is carried', Object.keys(conf).every(k => J(out[k]) === J(conf[k])) || !console.log('   missing: ' + Object.keys(conf).filter(k => J(out[k]) !== J(conf[k])).join(', ')));
    check('export: no history, statistics, watch list or backups', Object.keys(priv).every(k => !(k in out)));
    const dst = makeStorage(0);
    dst.setItem('lmPerfBackup', '{"old":1}'); dst.setItem('lmHudLayouts', '{"keep":1}');
    imp(out, (k, t) => dst.setItem(k, t), k => dst.removeItem(k));
    check('import: round trip restores every configuration key', Object.keys(conf).every(k => dst.getItem(k) === J(conf[k])));
    const dst2 = makeStorage(0);
    dst2.setItem('lmPerfBackup', '{"old":1}'); dst2.setItem('lmHudLayouts', '{"keep":1}');
    imp({ lmHudLayouts: [1, 2], 'lm-zoom-bookmarks': { a: 1 }, lmSettingsProfiles: { a: 1 } }, (k, t) => dst2.setItem(k, t), k => dst2.removeItem(k));
    check('import: a value of the wrong type is not written', dst2.getItem('lmHudLayouts') === '{"keep":1}' && dst2.getItem('lm-zoom-bookmarks') === null && dst2.getItem('lmSettingsProfiles') === null);
    check('import: Performance mode backup of the replaced settings goes when the export has none', dst2.getItem('lmPerfBackup') === null);
  }
}

// ── applying sets: the module in its own vm with small stand-ins for the page
function bootApply() {
  const ls = makeStorage(0), toasts = [], calls = [], timers = [];
  let tid = 0;
  const handlers = {};
  const c = {
    console, JSON, Math, Date, Object, Array, Number, String, isFinite, Event: function (t) { this.type = t; },
    setTimeout(f, ms) { timers.push({ id: ++tid, f, ms }); return tid; },
    clearTimeout(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    setInterval() { return 0; }, clearInterval() { }, addEventListener() { }, removeEventListener() { }
  };
  c.window = c;
  c.localStorage = ls;
  c.hotkeysCommand = ctx.hotkeysCommand;
  c.navigator = { getGamepads: () => [] };
  c.matchMedia = () => ({ matches: false });
  c.isMobile = false;
  const els = {};
  c.document = { getElementById: id => els[id] || null, addEventListener() { } };
  const stub = { length: 0 };
  ['closest', 'val', 'trigger', 'change', 'text', 'on', 'find', 'empty', 'remove'].forEach(m => { stub[m] = () => stub; });
  stub.hasClass = () => false;
  c.jQuery = x => (x && x._inOptions ? { length: 1, closest: () => ({ length: 1 }) } : stub);
  c.toastr = {};
  ['info', 'success', 'warning', 'error'].forEach(k => { c.toastr[k] = m => toasts.push([k, m]); });
  c.LMEvents = { on(n, f) { (handlers[n] = handlers[n] || []).push(f); }, off(n, f) { handlers[n] = (handlers[n] || []).filter(x => x !== f); }, _has: n => !!(handlers[n] && handlers[n].length) };
  c.LMGamepad = { release() { calls.push('gp-release'); }, _reload() { calls.push('gp-reload'); } };
  c.LMMobileEditor = { reload() { calls.push('ml-reload'); } };
  vm.createContext(c);
  vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), c);
  vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), c);
  vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'hudeditor.js'), 'utf8'), c);
  vm.runInContext(mod, c);
  const S = c.defaultmapsettings;
  c.application = { saveSettings(o, n) { ls.setItem(n, JSON.stringify(o)); }, setSettings(k, v) { S[k] = v; } };
  /* Performance mode as setSettings does it: a copy of the effect settings, then they go off;
   * off puts the copy back */
  els.performanceMode = {
    type: 'checkbox', checked: S.performanceMode === true, _inOptions: true,
    dispatchEvent() {
      const on = this.checked;
      if (on) { ls.setItem('lmPerfBackup', J({ jellyPhisycs: S.jellyPhisycs })); S.jellyPhisycs = false; }
      else { const b = JSON.parse(ls.getItem('lmPerfBackup') || 'null'); if (b) S.jellyPhisycs = b.jellyPhisycs; ls.removeItem('lmPerfBackup'); }
      S.performanceMode = on;
    }
  };
  const runTimers = () => { const now = timers.splice(0); now.forEach(t => t.f()); };
  const emit = (n, d) => (handlers[n] || []).slice().forEach(f => f(d));
  return { c, ls, S, P: c.LMProfiles, HE: c.LMHudEditor, toasts, calls, els, runTimers, emit, handlers };
}

{
  const e = bootApply();
  e.ls.setItem('lm-zoom-bookmarks', J([2, 2, 2]));
  const r = e.P.applySet({ zb: [1.5, 0, 3] }, 'zoom');
  check('zoom bookmarks: a set with only them is applied and saved', !!r && r.length === 1 && e.ls.getItem('lm-zoom-bookmarks') === J([1.5, 0, 3]));
  e.P.undo();
  check('zoom bookmarks: Undo puts them back', e.ls.getItem('lm-zoom-bookmarks') === J([2, 2, 2]));
}
{
  const e = bootApply();
  e.ls.setItem('lmGamepad', J({ v: 1, map: ['split'] }));
  const r = e.P.applySet({ gp: { v: 1, map: ['feed'] } }, 'pad');
  check('gamepad only: applied, saved, held buttons let go before the new buttons are read', !!r && r.length === 1 && JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'feed' && J(e.calls) === J(['gp-release', 'gp-reload']));
  e.calls.length = 0;
  const r2 = e.P.applySet({ ml: { v: 1, active: 'thumb' } }, 'phone');
  check('phone layout only: applied, saved and the controls placed again', !!r2 && r2.length === 1 && JSON.parse(e.ls.getItem('lm-mobile-layouts')).active === 'thumb' && J(e.calls) === J(['ml-reload']));
  e.calls.length = 0;
  e.P.applySet({ s: { showMass: !e.S.showMass } }, 'other');
  check('a set without gamepad / phone layout does not reload them', e.calls.length === 0);
}
{
  const e = bootApply();
  e.HE.saveLayout('A', { leaderboard: { h: 'l', x: 1, v: 't', y: 1, s: 1 } });
  e.HE.saveLayout('B', { leaderboard: { h: 'r', x: 1, v: 't', y: 1, s: 1 } });
  e.HE.linkProfile('p1', 'B');
  e.HE.linkProfile('p2', 'A');
  const cur = e.S.showMass;
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'p1', name: 'One', data: { s: { showMass: !cur } } }, { id: 'p2', name: 'Two', data: { s: { showMass: !cur } } }, { id: 'p3', name: 'Three', data: { s: { showMass: cur } } }]));
  e.P.applyById('p1');
  check('linked HUD layout: applied with the profile', e.HE.active() === 'B' && JSON.parse(e.ls.getItem('lmHudLayouts')).active === 'B');
  const bk = JSON.parse(e.ls.getItem('lmSettingsBackups') || '[]');
  check('linked HUD layout: the backup has the layout before', bk.length > 0 && bk[0].data.hl === '');
  e.P.undo();
  check('linked HUD layout: Undo puts the previous layout back', e.HE.active() === '' && e.S.showMass === cur);
  e.P.applyById('p1');
  const r = e.P.applyById('p2');
  check('only the HUD layout differs: still applied, with Undo', !!r && r.length === 1 && r[0].part === 'hl' && e.HE.active() === 'A');
  e.P.undo();
  check('HUD-only switch: Undo goes back to the layout before', e.HE.active() === 'B');
  e.P.applyById('p3');
  check('a profile without a link keeps the current layout', e.HE.active() === 'B');
}
{
  // Performance mode on in both profiles: the copy of the effect settings is the new profile's
  const e = bootApply();
  e.S.performanceMode = true; e.S.jellyPhisycs = false; e.els.performanceMode.checked = true;
  e.ls.setItem('lmPerfBackup', J({ jellyPhisycs: true }));
  e.P.applySet({ s: { performanceMode: true, jellyPhisycs: false, showMass: !e.S.showMass }, pb: { jellyPhisycs: false } }, 'B');
  check('performance mode on -> on: the backup is the applied profile\'s', e.ls.getItem('lmPerfBackup') === J({ jellyPhisycs: false }));
  e.els.performanceMode.checked = false; e.els.performanceMode.dispatchEvent();
  check('performance mode off afterwards: no value of the other profile comes back', e.S.jellyPhisycs === false);
}
{
  const e = bootApply();
  e.S.performanceMode = true; e.S.jellyPhisycs = false; e.els.performanceMode.checked = true;
  e.ls.setItem('lmPerfBackup', J({ jellyPhisycs: true }));
  e.P.applySet({ s: { performanceMode: true, showMass: !e.S.showMass } }, 'old');
  check('performance mode: a profile without its own copy drops the other one', e.ls.getItem('lmPerfBackup') === null);
}
{
  const e = bootApply();
  e.S.performanceMode = false; e.S.jellyPhisycs = true; e.els.performanceMode.checked = false;
  e.P.applySet({ s: { performanceMode: true, jellyPhisycs: false }, pb: { jellyPhisycs: false } }, 'B');
  check('performance mode off -> on: the copy is the profile\'s, not the settings it replaced', e.ls.getItem('lmPerfBackup') === J({ jellyPhisycs: false }) && e.S.performanceMode === true);
  const cap = e.P.core.captureCurrent();
  check('performance mode on: the snapshot carries its copy', !!cap && J(cap.pb) === J({ jellyPhisycs: false }));
}
{
  // automatic switching: game mode changes, and no switch in the middle of a life
  const e = bootApply();
  const cur = e.S.showMass;
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'p1', name: 'Teams', data: { s: { showMass: !cur } } }]));
  e.ls.setItem('lmSettingsProfilesRules', J({ enabled: true, mode: { ':teams': 'p1' } }));
  e.c.legendmod = { serverType: 'deltio', gameMode: ':ffa', play: false };
  const listen = e.P.core.listen;
  check('auto: listen() available', typeof listen === 'function');
  if (typeof listen === 'function') {
    listen(true);
    check('auto: listens to game mode changes', e.c.LMEvents._has('gameModeChange'));
    e.c.legendmod.gameMode = ':teams';
    e.c.legendmod.play = true;
    e.emit('gameModeChange', { mode: 'teams', previous: 'ffa' });
    e.emit('gameModeChange', { mode: 'teams', previous: 'ffa' });
    e.runTimers();
    check('auto: not switched while playing', e.S.showMass === cur);
    e.c.legendmod.play = false;
    e.emit('death', {});
    e.runTimers();
    check('auto: switched once the life ended', e.S.showMass === !cur);
    listen(false);
    check('auto off: no listeners left', !e.c.LMEvents._has('gameModeChange') && !e.c.LMEvents._has('death') && !e.c.LMEvents._has('serverChange'));
  }
}

console.log(fail ? fail + ' failed' : 'all profiles checks passed');
process.exit(fail ? 1 : 0);
