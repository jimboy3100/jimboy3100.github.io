/* Settings profiles checks: validation, comparison, templates and backup rotation of
 * ogario/modules/profiles.js, against the real setting schemas of ogario/ogario.v4.js.
 * node developers/tests/profiles.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
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
i18n(ctx);
/* the real schemas and validators (the preset maps, defaultSettings + LM_THEME_SCHEMA + lmThemeValue, defaultmapsettings + LM_SETTINGS_DEFAULTS + lmSettingValue) */
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext(mod, ctx);
/* the presets of Settings (the one list of starter setups), as the menu publishes them */
vm.runInContext('(function () {\n' + cut('                var presets = {', '                application.lmPresets = presets;') + '\nwindow.application = { lmPresets: presets }; })();', ctx);
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
check('profiles: at most 50 (30 own + the 20 moved from the Gamepad window)', C.MAX_PROFILES === 50 && C.cleanProfiles(Array.from({ length: 60 }, (_, i) => ({ id: 'p' + i, name: 'n' + i, data: { s: { showMass: true } } }))).length === 50);
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

// ── a new profile from a preset: the presets of Settings are the one list
const PR = C.presets();
const tplIds = Object.keys(PR);
check('the profiles use the Settings presets (the same object, no list of their own)', PR === ctx.application.lmPresets && C.TEMPLATES === undefined);
check('eight presets: the five of Settings + FFA, Teams, Multibox', J(tplIds) === J(['competitive', 'battery', 'streamer', 'reducedMotion', 'cleanHud', 'ffa', 'teams', 'multibox']));
/* the six built-in templates the profiles had before (3.656): nothing of them is lost */
const OLD_TPL = {
  ffa: { oppColors: true, oppRings: true, splitRange: true, virusesRange: true, virMassShots: true, showMass: true, mergeRings: true, showTop5: false, showTargeting: false },
  teams: { showTop5: true, teammatesInd: true, showTargeting: true, showMiniMap: true, showMiniMapGhostCells: true, hideTeammatesNames: false, oneColoredTeammates: false, showChat: true },
  multibox: { mbRingsP1: true, mbRingsP2: true, mbSwitchAfterDeath: true, mbAutoRespawn: true, multiKeepMoving: true, middleMultiViewWhenClose: true, cameraSmoothLerp: true },
  streaming: { streamMode: true, hideSkinUrl: true, hidecountry: true, showChatImages: false, showChatVideos: false, showDevConsole: false },
  mobile: { fpsLimit: 60, menuFpsCap: true, jellyPhisycs: false, videoSkins: false, highDPI: false, showGhostCells: false, borderGlow: false, virusGlow: false, suckAnimation: false, showBgSectors: false, hudBlur: 0 },
  competitive: { oppColors: true, oppRings: true, virColors: true, splitRange: true, virusesRange: true, virMassShots: true, showMass: true, mergeRings: true, splitPrediction: true, showStatsFPS: true, showStatsPPS: true }
};
Object.keys(OLD_TPL).forEach(id => {
  const to = C.TPL_OLD[id] || id, set = PR[to] && PR[to].set;
  const lost = set ? Object.keys(OLD_TPL[id]).filter(k => set[k] !== OLD_TPL[id][k]) : ['(no preset)'];
  check('old template ' + id + ': every value is in the preset ' + to, lost.length === 0 || !console.log('   lost: ' + lost.join(', ')));
});
/* what the presets did before (3.656) still happens */
const OLD_PRESET = {
  battery: { fpsLimit: 60, menuFpsCap: true, jellyPhisycs: false, videoSkins: false, animatedRainbowColor: false, rainbowMapBorders: false, borderGlow: false, virusGlow: false, suckAnimation: false, showGhostCells: false, hudBlur: 0 },
  streamer: { hidecountry: true, showChat: false, showChatImages: false, showChatVideos: false, showDevConsole: false }
};
Object.keys(OLD_PRESET).forEach(id => {
  check('preset ' + id + ': its old values are kept', Object.keys(OLD_PRESET[id]).every(k => PR[id].set[k] === OLD_PRESET[id][k]));
});
check('Streamer: an honest tip (what it turns on, not a privacy guarantee) in the packs, labels for the settings without a menu label',
  PR.streamer.tip === 'pkg.pt.streamerTip' && /not a privacy guarantee/.test(i18n.t('pkg.pt.streamerTip')) && /Stream mode/.test(i18n.t('pkg.pt.streamerTip')) &&
  i18n.t('pkg.pt.streamerTip', null, 'el') !== i18n.t('pkg.pt.streamerTip') && i18n.t(PR.streamer.lbl.streamMode) !== PR.streamer.lbl.streamMode && i18n.t(PR.streamer.lbl.hideSkinUrl) !== PR.streamer.lbl.hideSkinUrl);
check('preset names: from the packs in every language', tplIds.every(id => i18n.t(PR[id].key) !== PR[id].key && ['el', 'ru', 'zh', 'ja', 'it'].every(l => !!i18n.t(PR[id].key, null, l))));
tplIds.forEach(id => {
  const set = PR[id].set;
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
{
  /* profiles saved from the old templates keep working: same data, the template id moved */
  const old = C.cleanProfiles([
    { id: 'a', name: 'Stream', data: { s: { streamMode: true, hidecountry: true } }, tpl: 'streaming' },
    { id: 'b', name: 'Phone', data: { s: { fpsLimit: 60 } }, tpl: 'mobile' },
    { id: 'c', name: 'Mine', data: { s: { showMass: true } }, tpl: 'competitive' },
    { id: 'd', name: 'Odd', data: { s: { showMass: true } }, tpl: '<b>' }
  ]);
  check('old templates: Streaming is Streamer, Mobile is Battery saver, others kept, bad ids dropped', old.length === 4 && old[0].tpl === 'streamer' && old[1].tpl === 'battery' && old[2].tpl === 'competitive' && !('tpl' in old[3]));
  check('old templates: their settings unchanged', old[0].data.s.streamMode === true && old[0].data.s.hidecountry === true && old[1].data.s.fpsLimit === 60);
}

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

// ── zoom bookmarks were removed: an older set or backup holding them loads without them
const zbSet = C.cleanBundle({ s: { showMass: true }, zb: [1, 2, 3] });
check('removed zoom bookmarks: the rest of an older set is kept, the bookmarks are ignored', !!zbSet && zbSet.s.showMass === true && !('zb' in zbSet));
check('removed zoom bookmarks: a set with only them is no set', C.cleanBundle({ zb: [1, 2, 3] }) === null && C.cleanBundle({ zb: [0, 0, 0] }) === null);

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
      lmThemeWorkshop: { v: 1, themes: [] }, 'lm-director': { speed: 3 },
      'lm-director-bookmarks': [{ x: 1, y: 2 }], lmPracticeCfg: { bots: 4 }, lmAnalyticsGoals: { v: 1, custom: [] },
      lmSettingsProfiles: [{ id: 'p1', name: 'P', data: { s: { showMass: true } } }], lmSettingsProfilesRules: { enabled: false },
      lmGamepad: { v: 1, map: [] }, 'lm-mobile-prefs': { btnScale: 1 }, 'lm-mobile-layouts': { v: 1 }, lmPerfBackup: { jellyPhisycs: true }, lmPresetUndo: { s: {} },
      /* the radial menu's commands and the screenshot options */
      lmRadialMenu: { v: 1, items: ['hk-feed'] }, lmSmallTools: { shot: { lb: true, map: false } }
    };
    const priv = { lmAnalyticsGames: [{ m: 1 }], lmAnalyticsTracks: [{ t: 1 }], lmPracticeStore: { best: 1 }, 'lm-director-watch': ['nick'], lmSettingsBackups: [{ t: 1 }], ogarioPlayerProfiles: [1] };
    Object.keys(conf).concat(Object.keys(priv)).forEach(k => src.setItem(k, J(conf[k] || priv[k])));
    const out = JSON.parse(J(exp(src)));
    check('export: every configuration key is carried', Object.keys(conf).every(k => J(out[k]) === J(conf[k])) || (console.log('   missing: ' + Object.keys(conf).filter(k => J(out[k]) !== J(conf[k])).join(', ')), false));
    check('export: no history, statistics, watch list or backups', Object.keys(priv).every(k => !(k in out)));
    src.setItem('lm-zoom-bookmarks', '[1,0,3]');
    check('export: the removed zoom bookmarks are not carried', !('lm-zoom-bookmarks' in exp(src)));
    /* the old skin collections are player profiles now: never exported, but an older export
     * still brings them in (they become profiles on the reload after the import) */
    const srcC = makeStorage(0);
    srcC.setItem('lmSkinCollections', J({ v: 1, items: { 'https://s.example/a.png': { s: true } } }));
    check('export: no skin collections (they are player profiles now)', !('lmSkinCollections' in JSON.parse(J(exp(srcC)))));
    const dstC = makeStorage(0);
    imp({ lmSkinCollections: { v: 1, items: { 'https://s.example/a.png': { s: true } } } }, (k, t) => dstC.setItem(k, t), k => dstC.removeItem(k));
    check('import: an older export still brings its skin collections in', dstC.getItem('lmSkinCollections') === J({ v: 1, items: { 'https://s.example/a.png': { s: true } } }));
    const dst = makeStorage(0);
    dst.setItem('lmPerfBackup', '{"old":1}'); dst.setItem('lmHudLayouts', '{"keep":1}');
    imp(out, (k, t) => dst.setItem(k, t), k => dst.removeItem(k));
    check('import: round trip restores every configuration key', Object.keys(conf).every(k => dst.getItem(k) === J(conf[k])));
    const dst2 = makeStorage(0);
    dst2.setItem('lmPerfBackup', '{"old":1}'); dst2.setItem('lmHudLayouts', '{"keep":1}');
    imp({ lmHudLayouts: [1, 2], 'lm-zoom-bookmarks': [1, 0, 3], lmSettingsProfiles: { a: 1 } }, (k, t) => dst2.setItem(k, t), k => dst2.removeItem(k));
    check('import: a value of the wrong type is not written', dst2.getItem('lmHudLayouts') === '{"keep":1}' && dst2.getItem('lmSettingsProfiles') === null);
    check('import: the zoom bookmarks of an older export are not written', dst2.getItem('lm-zoom-bookmarks') === null);
    check('import: Performance mode backup of the replaced settings goes when the export has none', dst2.getItem('lmPerfBackup') === null);
    /* the removed Command Centre: stars left in this browser are not exported, and an older
     * export that has them writes nothing (and no error) */
    const src3 = makeStorage(0);
    src3.setItem('lmCommandCentre', J({ fav: ['hk:hk-feed', 'opt:showMass'], recent: ['hk:hk-split'] }));
    const out3 = JSON.parse(J(exp(src3)));
    check('export: no Command Centre stars', !('lmCommandCentre' in out3));
    const dst3 = makeStorage(0);
    let impErr = null;
    try { imp({ lmCommandCentre: { fav: ['hk:hk-feed'] } }, (k, t) => dst3.setItem(k, t), k => dst3.removeItem(k), null, k => dst3.getItem(k)); } catch (e) { impErr = e; }
    check('import: old Command Centre stars are ignored', !impErr && dst3.getItem('lmCommandCentre') === null);
    /* Notifications: the muted categories go, the read mark and the list filter stay per device */
    const src4 = makeStorage(0);
    src4.setItem('lmNotificationPrefs', J({ readId: 40, muted: { chat: true }, cat: 'chat', type: 'all' }));
    const out4 = JSON.parse(J(exp(src4)));
    check('export: the muted notification categories only', J(out4.lmNotificationPrefs) === J({ muted: { chat: true } }));
    const dst4 = makeStorage(0);
    dst4.setItem('lmNotificationPrefs', J({ readId: 3, muted: {}, cat: 'all', type: 'all' }));
    imp(out4, (k, t) => dst4.setItem(k, t), k => dst4.removeItem(k), null, k => dst4.getItem(k));
    check('import: muted categories come in, this device keeps its read mark', dst4.getItem('lmNotificationPrefs') === J({ readId: 3, muted: { chat: true }, cat: 'all', type: 'all' }));
    /* Settings > Voice: the chat prefix and the speech language, stored as plain text (not JSON) */
    const src5 = makeStorage(0);
    src5.setItem('prefix', 'VX'); src5.setItem('lang', 'ja');
    const out5 = JSON.parse(J(exp(src5)));
    check('export: the voice prefix and language', out5.prefix === 'VX' && out5.lang === 'ja');
    check('export: a device that never set them exports none', !('prefix' in JSON.parse(J(exp(makeStorage(0))))) && !('lang' in JSON.parse(J(exp(makeStorage(0))))));
    const dst5 = makeStorage(0);
    dst5.setItem('prefix', 'old'); dst5.setItem('lang', 'de');
    imp(out5, (k, t) => dst5.setItem(k, t), k => dst5.removeItem(k));
    check('import: the voice prefix and language come in as text', dst5.getItem('prefix') === 'VX' && dst5.getItem('lang') === 'ja');
    imp({ prefix: 'x'.repeat(40), lang: '"><b>' }, (k, t) => dst5.setItem(k, t), k => dst5.removeItem(k));
    imp({ prefix: 7, lang: ['ja'] }, (k, t) => dst5.setItem(k, t), k => dst5.removeItem(k));
    check('import: a voice value that does not fit, or none, leaves this device\'s', dst5.getItem('prefix') === 'VX' && dst5.getItem('lang') === 'ja');
    imp({ lang: 'default' }, (k, t) => dst5.setItem(k, t), k => dst5.removeItem(k));
    check('import: the voice language All', dst5.getItem('lang') === 'default');
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
  i18n(c);
  vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), c);
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
  /* an older set with only zoom bookmarks: nothing to apply, nothing written, no error */
  const e = bootApply();
  e.ls.removeItem('lm-zoom-bookmarks');
  let r = 'x', err = null;
  try { r = e.P.applySet({ zb: [1.5, 0, 3] }, 'zoom'); } catch (x) { err = x; }
  check('removed zoom bookmarks: an older set with only them applies nothing', !err && !(r && r.length) && e.ls.getItem('lm-zoom-bookmarks') === null);
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
  /* a reload only for Anti-aliasing that differs from the running WebGL context; WebGL on/off switches at once */
  const reloadAsked = () => e.toasts.some(t => String(t[1]).includes(i18n.t('modules.profiles.reloadSome')));
  e.c.drawRender = { gl: {}, _lmGlAA: e.S.glAntialias !== false };
  e.toasts.length = 0;
  e.P.applySet({ s: { webgl2Acceleration: !e.S.webgl2Acceleration } }, 'webgl');
  const noWebglReload = !reloadAsked();
  e.P.applySet({ s: { glAntialias: !e.S.glAntialias } }, 'aa');
  const aaReload = reloadAsked();
  e.toasts.length = 0;
  e.P.applySet({ s: { glAntialias: !e.S.glAntialias } }, 'aa-back');
  check('profile: WebGL on/off and anti-aliasing back to what the context has ask no reload, other anti-aliasing does', noWebglReload && aaReload && !reloadAsked());
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
  // the same for gamepad buttons and phone control layouts that did not exist before
  const e = bootApply();
  e.ls.removeItem('lmGamepad'); e.ls.removeItem('lm-mobile-layouts');
  e.P.applySet({ gp: { v: 1, map: ['feed'] }, ml: { v: 1, active: 'thumb' } }, 'pad+phone');
  check('gamepad + phone layout: applied where there were none', JSON.parse(e.ls.getItem('lmGamepad') || 'null').map[0] === 'feed' && JSON.parse(e.ls.getItem('lm-mobile-layouts') || 'null').active === 'thumb');
  e.calls.length = 0;
  e.P.undo();
  check('gamepad + phone layout: Undo removes them again and reloads both', e.ls.getItem('lmGamepad') === null && e.ls.getItem('lm-mobile-layouts') === null && e.calls.indexOf('gp-reload') >= 0 && e.calls.indexOf('ml-reload') >= 0);
  e.P.applySet({ s: { showMass: !e.S.showMass } }, 'plain');
  const bk = JSON.parse(e.ls.getItem('lmSettingsBackups') || '[]');
  check('backup of a state without them: says none (restoring it removes them)', bk.length > 0 && !('zb' in bk[0].data) && bk[0].data.gp && bk[0].data.gp._lmAbsent === 1);
  const cap = e.P.core.captureCurrent();
  check('a plain snapshot (profiles) still leaves missing parts out', !!cap && !('zb' in cap) && !('gp' in cap) && !('ml' in cap));
}
{
  // phone preferences: the first ones on a device, applied live; Undo removes them again
  const e = bootApply();
  e.ls.removeItem('lm-mobile-prefs');
  e.c._lmMobileHost = { reloadPrefs() { e.calls.push('m-reload'); } };
  e.calls.length = 0;
  const r = e.P.applySet({ m: { btnScale: 1.2 } }, 'first-mobile');
  check('phone preferences on a fresh device: applied', !!r && r.length === 1 && JSON.parse(e.ls.getItem('lm-mobile-prefs') || 'null').btnScale === 1.2);
  check('phone preferences: the phone controls apply them at once', e.calls.indexOf('m-reload') >= 0);
  e.calls.length = 0;
  e.P.undo();
  check('phone preferences: Undo removes the first ones again (and applies that)', e.ls.getItem('lm-mobile-prefs') === null && e.calls.indexOf('m-reload') >= 0);
  e.ls.setItem('lm-mobile-prefs', J({ btnScale: 1, btnOpacity: 0.5 }));
  e.calls.length = 0;
  e.P.applySet({ m: { btnScale: 0.8 } }, 'smaller');
  const mp = JSON.parse(e.ls.getItem('lm-mobile-prefs'));
  check('phone preferences: a change keeps the others and is applied at once', mp.btnScale === 0.8 && mp.btnOpacity === 0.5 && e.calls.indexOf('m-reload') >= 0);
  delete e.c._lmMobileHost.reloadPrefs;
  e.P.applySet({ m: { btnScale: 1.1 } }, 'old-host');
  check('phone controls without the live call (older cached file): a reload is asked for', e.toasts.some(t => t[1].includes(i18n.t('modules.profiles.reloadSome'))));
}
{
  // gamepad buttons have their own switch: a desktop player has no phone preferences
  const e = bootApply();
  e.ls.removeItem('lm-mobile-prefs');
  e.ls.setItem('lmGamepad', J({ v: 1, map: ['split'] }));
  const cap = e.P.core.captureCurrent({ m: false, g: true });
  check('gamepad captured without the phone controls', !!cap && !!cap.gp && cap.gp.map[0] === 'split' && !('m' in cap) && !('ml' in cap));
  const cap2 = e.P.core.captureCurrent({ m: true, g: false });
  check('phone controls captured without the gamepad', !!cap2 && !('gp' in cap2));
}
{
  // ChatGPT 3.599 re-verification (2): the same settings, only the Performance mode copy differs
  const e = bootApply();
  e.S.performanceMode = true; e.S.jellyPhisycs = false; e.els.performanceMode.checked = true;
  e.ls.setItem('lmPerfBackup', J({ jellyPhisycs: true }));
  const r = e.P.applySet({ s: { performanceMode: true, jellyPhisycs: false }, pb: { jellyPhisycs: false } }, 'backup-only');
  check('performance mode copy only: a difference, applied', !!r && r.length === 1 && r[0].part === 'pb' && e.ls.getItem('lmPerfBackup') === J({ jellyPhisycs: false }));
  e.P.undo();
  check('performance mode copy only: Undo puts the copy back', e.ls.getItem('lmPerfBackup') === J({ jellyPhisycs: true }));
  e.ls.setItem('lmPerfBackup', J({ jellyPhisycs: false }));
  const r2 = e.P.applySet({ s: { performanceMode: true, jellyPhisycs: false }, pb: { jellyPhisycs: false } }, 'same');
  check('performance mode: the same copy is no difference', !!r2 && r2.length === 0);
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
{
  // automatic switching: a replay or the practice arena has the recorded / practice server's type
  // and mode, not the server played on: no switch for them, checked again once they end
  const e = bootApply();
  const cur = e.S.showMass;
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'p1', name: 'Teams', data: { s: { showMass: !cur } } }]));
  e.ls.setItem('lmSettingsProfilesRules', J({ enabled: true, mode: { ':teams': 'p1' } }));
  e.c.legendmod = { serverType: 'deltio', gameMode: ':ffa', play: false };
  e.P.core.listen(true);
  e.c._lmEvReplayOn = true;
  e.c.legendmod.gameMode = ':teams';
  e.emit('serverChange', { host: 'replay' });
  e.emit('gameModeChange', { mode: 'teams', previous: 'ffa' });
  e.runTimers();
  check('auto: no switch for the game mode of a replay', e.S.showMass === cur);
  e.c._lmEvReplayOn = false;
  e.emit('replayStop', { reason: 'stopped' });
  e.runTimers();
  check('auto: checked again once the replay ends', e.S.showMass === !cur);
  e.P.core.listen(false);
  check('auto off: no replay listener left', !e.c.LMEvents._has('replayStop'));

  const e2 = bootApply();
  const cur2 = e2.S.showMass;
  e2.ls.setItem('lmSettingsProfiles', J([{ id: 'p1', name: 'FFA', data: { s: { showMass: !cur2 } } }]));
  e2.ls.setItem('lmSettingsProfilesRules', J({ enabled: true, mode: { ':ffa': 'p1' } }));
  e2.c.legendmod = { serverType: 'deltio', gameMode: ':teams', play: false };
  e2.P.core.listen(true);
  e2.c.LMPractice = { on: true };
  e2.c.legendmod.gameMode = ':ffa';
  e2.emit('gameModeChange', { mode: 'ffa', previous: 'teams' });
  e2.runTimers();
  check('auto: no switch for the practice arena\'s game mode', e2.S.showMass === cur2);
  e2.P.core.listen(false);
}

{
  // texts from the language packs, and a language change shows the next message in that language
  const e = bootApply();
  e.P.undo();
  const en = e.toasts.pop();
  check('texts: English message and tag from the packs', en && en[1].includes(i18n.t('modules.profiles.nothingUndo')) && en[1].includes('[' + i18n.t('modules.profiles.tag') + ']'));
  e.c.LMi18n.setLang('el');
  e.P.undo();
  const el = e.toasts.pop();
  check('texts: after switching to Greek the message is Greek', el && el[1].includes(i18n.t('modules.profiles.nothingUndo', null, 'el')) && i18n.t('modules.profiles.nothingUndo', null, 'el') !== i18n.t('modules.profiles.nothingUndo'));
}

// ── gamepad-only profiles: the named profiles of the Gamepad window moved here
{
  const e = bootApply();
  const PC = e.P.core;
  const oldPad = {
    v: 1, map: { 0: 'hk-tripleSplit', 1: 'feed' },
    profiles: [
      { name: 'Phone', map: { 0: 'hk-tripleSplit', 1: 'feed', 2: '<x>' }, opts: { gamepadMoveRange: 0.7, gamepadVibrate: true, gamepadEnabled: true, nope: 1 } },
      { name: 'Xbox', map: { 0: 'split' }, opts: { gamepadDeadzone: 9 } },
      { name: '', map: {} }, 'junk'
    ]
  };
  e.ls.setItem('lmGamepad', J(oldPad));
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'p1', name: 'Phone', data: { s: { showMass: true } } }]));
  const n = PC.migrateGamepadProfiles();
  const list = JSON.parse(e.ls.getItem('lmSettingsProfiles'));
  const pads = list.filter(p => p.only === 'gp');
  check('gamepad migration: both named gamepad profiles became gamepad-only Settings profiles, the own one kept', n === 2 && list.length === 3 && list[0].id === 'p1' && pads.length === 2);
  check('gamepad migration: a name a full profile has gets a number', pads[0].name === 'Phone 2' && pads[1].name === 'Xbox');
  check('gamepad migration: buttons and tuning carried, unusable values dropped', pads[0].data.gp.map[0] === 'hk-tripleSplit' && pads[0].data.gp.map[1] === 'feed' && !('2' in pads[0].data.gp.map) &&
    pads[0].data.s.gamepadMoveRange === 0.7 && pads[0].data.s.gamepadVibrate === true && !('gamepadEnabled' in pads[0].data.s) && Object.keys(pads[0].data).sort().join() === 'gp,s');
  check('gamepad migration: a value out of range is fitted (as the slider would)', pads[1].data.s.gamepadDeadzone === 0.5);
  const after = JSON.parse(e.ls.getItem('lmGamepad'));
  check('gamepad migration: the list leaves lmGamepad, the current buttons stay, the pad reads them again', !('profiles' in after) && J(after.map) === J(oldPad.map) && e.calls.indexOf('gp-reload') >= 0);
  check('gamepad migration: a second run does nothing', PC.migrateGamepadProfiles() === 0 && JSON.parse(e.ls.getItem('lmSettingsProfiles')).length === 3);
  /* an old backup or profile that still carries the list brings no duplicates */
  e.ls.setItem('lmGamepad', J(oldPad));
  check('gamepad migration: names already moved are not added twice', PC.migrateGamepadProfiles() === 0 && JSON.parse(e.ls.getItem('lmSettingsProfiles')).length === 3 && !('profiles' in JSON.parse(e.ls.getItem('lmGamepad'))));
  /* applying a gamepad profile changes the buttons and the tuning, nothing else */
  e.S.gamepadMoveRange = 0.45; e.S.gamepadVibrate = false;
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' } }));
  const showMass = e.S.showMass;
  e.calls.length = 0;
  const r = e.P.applyById(pads[0].id);
  check('gamepad profile: applied, only the gamepad changes', !!r && e.S.gamepadMoveRange === 0.7 && e.S.gamepadVibrate === true && e.S.showMass === showMass &&
    JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'hk-tripleSplit' && e.calls.indexOf('gp-release') >= 0);
  check('gamepad profile: the message names the tuning as the Gamepad window does', /Movement range/.test(e.toasts[e.toasts.length - 1][1]));
  e.P.undo();
  check('gamepad profile: Undo puts the tuning and the buttons back', e.S.gamepadMoveRange === 0.45 && e.S.gamepadVibrate === false && JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'split');
  /* capture: the current buttons and tuning only, without the old list */
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 3: 'hk-feed' }, profiles: [] }));
  e.S.gamepadZoomSens = 2;
  const g = PC.captureGamepad();
  check('gamepad profile: saving takes the buttons and every tuning setting, nothing else', g.gp.map[3] === 'hk-feed' && !('profiles' in g.gp) && g.s.gamepadZoomSens === 2 &&
    Object.keys(g.s).every(k => /^gamepad[A-Z]/.test(k) && k !== 'gamepadEnabled') && Object.keys(g.s).length === 9 && !g.t && !g.h);
  check('a full capture leaves the old gamepad list out too', !('profiles' in (PC.captureCurrent().gp || {})));
  check('gamepad-only kept on read', C.cleanProfiles([{ id: 'g', name: 'G', data: { gp: { v: 1, map: {} } }, only: 'gp' }, { id: 'h', name: 'H', data: { gp: { v: 1, map: {} } }, only: 'x' }]).map(p => p.only || '-').join() === 'gp,-');
}
{
  /* storage full: nothing removed from lmGamepad, the next start tries again */
  const e = bootApply();
  e.ls.setItem('lmGamepad', J({ v: 1, map: {}, profiles: [{ name: 'A', map: {}, opts: {} }] }));
  const set = e.ls.setItem;
  e.ls.setItem = (k, v) => { if (k === 'lmSettingsProfiles') throw new Error('QuotaExceededError'); set(k, v); };
  check('gamepad migration: storage full keeps the old setup (in lmGamepad or the pending store)', e.P.core.migrateGamepadProfiles() === 0 && J(oldHeld(e)) === J(['A']));
  e.ls.setItem = set;
  check('gamepad migration: next try moves it', e.P.core.migrateGamepadProfiles() === 1 && !('profiles' in JSON.parse(e.ls.getItem('lmGamepad'))));
}
// ── N3 / N4: no old Gamepad window setup is lost on the way to the gamepad profiles
/* the names of the old Gamepad window setups that are not profiles yet, wherever they are kept */
function oldHeld(e) {
  const g = JSON.parse(e.ls.getItem('lmGamepad') || 'null'), pend = JSON.parse(e.ls.getItem('lmGamepadPending') || 'null');
  return [].concat(g && Array.isArray(g.profiles) ? g.profiles.map(x => x.name) : [], pend && Array.isArray(pend.items) ? pend.items.map(x => x.name) : []).sort();
}
function gpProfiles(e) { return JSON.parse(e.ls.getItem('lmSettingsProfiles') || '[]').filter(p => p.only === 'gp'); }
function fullProfiles(n) { return Array.from({ length: n }, (_, i) => ({ id: 'f' + i, name: 'Full ' + i, data: { s: { showMass: i % 2 === 0 } } })); }
{
  /* the fixture of the audit: a gamepad profile Xbox, and the old list with another Xbox and a
   * Second that has the same buttons as the profile */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'x1', name: 'Xbox', data: { gp: { v: 1, map: { 0: 'split' } } }, only: 'gp' }]));
  const oldList = [{ name: 'Xbox', map: { 0: 'feed' }, opts: { gamepadDeadzone: 0.3 } }, { name: 'Second', map: { 0: 'split' }, opts: {} }];
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: oldList }));
  const n = PC.migrateGamepadProfiles(), pads = gpProfiles(e);
  check('N3 migration: an old setup with the name of a gamepad profile but other buttons is kept under a numbered name', n === 2 && pads.some(p => p.name === 'Xbox 2' && p.data.gp.map[0] === 'feed' && !!p.data.s && p.data.s.gamepadDeadzone === 0.3));
  check('N3 migration: an old setup with the buttons of a profile but its own name is kept', pads.some(p => p.name === 'Second' && p.data.gp.map[0] === 'split'));
  check('N3 migration: the existing profile stays as it was', pads.length === 3 && pads[0].id === 'x1' && pads[0].name === 'Xbox' && pads[0].data.gp.map[0] === 'split');
  check('N3 migration: nothing old is left over, a second run adds nothing', J(oldHeld(e)) === '[]' && PC.migrateGamepadProfiles() === 0 && gpProfiles(e).length === 3);
  /* the same list again (an old set or backup that still carries it): no copies */
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: oldList }));
  check('N3 migration: the same old list found again adds no copies', PC.migrateGamepadProfiles() === 0 && gpProfiles(e).length === 3 && J(oldHeld(e)) === '[]');
}
{
  const e = bootApply(), PC = e.P.core;
  const names = ['constructor', 'toString', '__proto__', 'hasOwnProperty', 'valueOf'];
  e.ls.setItem('lmGamepad', J({ v: 1, map: {}, profiles: names.map((nm, i) => ({ name: nm, map: { 0: i % 2 ? 'feed' : 'split', 1: 'menu' }, opts: {} })) }));
  const n = PC.migrateGamepadProfiles();
  check('N3 migration: names like built-in object properties are names too (same buttons, own names)', n === 5 && J(gpProfiles(e).map(p => p.name)) === J(names));
  check('N3 unique names: "constructor" is free in an empty list, a taken name gets a number', typeof PC.uniqueName === 'function' && PC.uniqueName('constructor', []) === 'constructor' && PC.uniqueName('toString', [{ name: 'TOSTRING' }]) === 'toString 2');
}
{
  /* the profiles are saved but the pending store cannot be written afterwards: the next try
   * neither adds the moved setup again nor loses the one still waiting */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmSettingsProfiles', J(fullProfiles(49)));
  e.ls.setItem('lmGamepad', J({ v: 1, map: {}, profiles: [{ name: 'A', map: { 0: 'feed' } }, { name: 'B', map: { 0: 'menu' } }] }));
  const set = e.ls.setItem;
  let pendWrites = 0;
  e.ls.setItem = (k, v) => { if (k === 'lmGamepadPending' && ++pendWrites === 2) throw new Error('QuotaExceededError'); set(k, v); };
  const n1 = PC.migrateGamepadProfiles();
  e.ls.setItem = set;
  check('N3 retry: one place free: A moved, B waits', n1 === 1 && J(gpProfiles(e).map(p => p.name)) === J(['A']) && oldHeld(e).indexOf('B') >= 0);
  check('N3 retry: the next try adds no second A, B still waits', PC.migrateGamepadProfiles() === 0 && gpProfiles(e).length === 1 && J(oldHeld(e)) === J(['B']));
  e.ls.setItem('lmSettingsProfiles', J(JSON.parse(e.ls.getItem('lmSettingsProfiles')).slice(1)));
  check('N3 retry: a place free again: B moves', PC.migrateGamepadProfiles() === 1 && J(gpProfiles(e).map(p => p.name)) === J(['A', 'B']) && J(oldHeld(e)) === '[]');
}
{
  /* 50 profiles: the old setups wait; applying a gamepad profile, Undo and a backup keep them */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmSettingsProfiles', J(fullProfiles(49).concat([{ id: 'gpx', name: 'Pad', data: { gp: { v: 1, map: { 0: 'hk-tripleSplit' } }, s: { gamepadMoveRange: 0.7 } }, only: 'gp' }])));
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: [{ name: 'Old one', map: { 0: 'feed' }, opts: { gamepadMoveRange: 0.4 } }, { name: 'Old two', map: { 0: 'menu' } }] }));
  const both = J(['Old one', 'Old two']);
  check('N4 50 profiles: nothing moves, both old setups wait', PC.migrateGamepadProfiles() === 0 && J(oldHeld(e)) === both);
  e.S.gamepadMoveRange = 0.45;
  const r = e.P.applyById('gpx');
  check('N4 applying a gamepad profile while old setups wait: the buttons change, the old setups stay', !!r && JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'hk-tripleSplit' && e.S.gamepadMoveRange === 0.7 && J(oldHeld(e)) === both);
  check('N4 the old setups are not part of a capture', !('profiles' in PC.captureGamepad().gp) && !('profiles' in (PC.captureCurrent().gp || {})));
  e.P.undo();
  check('N4 Undo: the buttons come back, the old setups stay', JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'split' && J(oldHeld(e)) === both);
  const bk = JSON.parse(e.ls.getItem('lmSettingsBackups') || '[]')[0];
  const r2 = bk ? e.P.applySet(bk.data, 'backup') : null;
  check('N4 a backup applied: the old setups stay', !!r2 && J(oldHeld(e)) === both);
  e.ls.setItem('lmSettingsProfiles', J(JSON.parse(e.ls.getItem('lmSettingsProfiles')).slice(2)));
  const n = PC.migrateGamepadProfiles(), pads = gpProfiles(e);
  check('N4 places free: the waiting setups become gamepad profiles with their buttons and tuning', n === 2 && J(oldHeld(e)) === '[]' &&
    pads.some(p => p.name === 'Old one' && p.data.gp.map[0] === 'feed' && p.data.s.gamepadMoveRange === 0.4) && pads.some(p => p.name === 'Old two' && p.data.gp.map[0] === 'menu'));
}
{
  /* the storage is full: the old list cannot even be moved out of lmGamepad */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'gpx', name: 'Pad', data: { gp: { v: 1, map: { 0: 'hk-tripleSplit' } } }, only: 'gp' }]));
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: [{ name: 'Old', map: { 0: 'feed' } }] }));
  const set = e.ls.setItem;
  let full = true;
  e.ls.setItem = (k, v) => { if (full && (k === 'lmGamepadPending' || k === 'lmSettingsProfiles')) throw new Error('QuotaExceededError'); set(k, v); };
  check('N4 storage full: the old setup is not moved and not lost', PC.migrateGamepadProfiles() === 0 && J(oldHeld(e)) === J(['Old']));
  const r = e.P.applyById('gpx');
  check('N4 storage full: applying a gamepad profile keeps the old setup next to the new buttons', !!r && JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'hk-tripleSplit' && J(oldHeld(e)) === J(['Old']));
  check('N4 storage full: the old list is still not part of a capture', !('profiles' in PC.captureGamepad().gp) && !('profiles' in (PC.captureCurrent().gp || {})));
  e.P.undo();
  check('N4 storage full: Undo keeps it too', JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'split' && J(oldHeld(e)) === J(['Old']));
  full = false;
  e.ls.setItem = set;
  check('N4 storage free again: the next try moves it', PC.migrateGamepadProfiles() === 1 && gpProfiles(e).some(p => p.name === 'Old' && p.data.gp.map[0] === 'feed') && J(oldHeld(e)) === '[]');
}
{
  /* the settings export and import */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmSettingsProfiles', J(fullProfiles(50)));
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: [{ name: 'Waiting', map: { 0: 'feed' }, opts: { gamepadMoveRange: 0.4 } }] }));
  PC.migrateGamepadProfiles();
  const out = JSON.parse(J(e.c.lmExportExtras(e.ls)));
  check('N4 export: a waiting setup goes with the gamepad buttons (in the old list)', out.lmGamepad.map[0] === 'split' && J((out.lmGamepad.profiles || []).map(p => p.name)) === J(['Waiting']));
  e.c.lmImportExtras({ lmGamepad: { v: 1, map: { 0: 'menu' } } }, (k, t) => e.ls.setItem(k, t), k => e.ls.removeItem(k));
  PC.migrateGamepadProfiles();
  check('N4 import of a file without it: the waiting setup stays', JSON.parse(e.ls.getItem('lmGamepad')).map[0] === 'menu' && J(oldHeld(e)) === J(['Waiting']));
  const e2 = bootApply();
  e2.c.lmImportExtras(out, (k, t) => e2.ls.setItem(k, t), k => e2.ls.removeItem(k));
  check('N4 the export imported elsewhere (50 profiles there too): it waits there', e2.P.core.migrateGamepadProfiles() === 0 && J(oldHeld(e2)) === J(['Waiting']));
  e2.ls.setItem('lmSettingsProfiles', J(fullProfiles(49)));
  check('N4 ... and becomes a gamepad profile there once a place is free', e2.P.core.migrateGamepadProfiles() === 1 && gpProfiles(e2).some(p => p.name === 'Waiting' && p.data.s.gamepadMoveRange === 0.4) && J(oldHeld(e2)) === '[]');
}
{
  /* saving a gamepad profile takes the buttons in use */
  const e = bootApply(), PC = e.P.core;
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' } }));
  e.c.LMGamepad.getMap = () => ({ 0: 'hk-tripleSplit', 1: 'feed', 2: 'none' });
  const g = PC.captureGamepad();
  check('N4 capture: the buttons in use (a change the full storage did not keep), not the stored ones', g.gp.map[0] === 'hk-tripleSplit' && g.gp.map[2] === 'none');
  delete e.c.LMGamepad.getMap;
  e.c.LMGamepad._cleanConfig = c => ({ v: 1, map: { 0: c && c.map && c.map[0] === 'split' ? 'split' : 'none', 5: 'split16' }, profiles: [] });
  check('N4 capture: without the live buttons, the stored ones through the gamepad file validator', PC.captureGamepad().gp.map[5] === 'split16' && PC.captureGamepad().gp.map[0] === 'split');
  delete e.c.LMGamepad._cleanConfig;
  check('N4 capture: without the gamepad file, the stored buttons', PC.captureGamepad().gp.map[0] === 'split' && !('5' in PC.captureGamepad().gp.map));
}
{
  /* with the real ogario/gamepad.js: the move keeps the buttons in use, the old list leaves its copy */
  const e = bootApply();
  e.ls.setItem('lmGamepad', J({ v: 1, map: { 0: 'split' }, profiles: [{ name: 'Old', map: { 0: 'feed' } }] }));
  Object.assign(e.c, { requestAnimationFrame() { return 0; }, innerWidth: 1000, innerHeight: 800, MouseEvent: function () { }, WheelEvent: function () { } });
  Object.assign(e.c.document, { hidden: false, hasFocus: () => true, activeElement: null, querySelector: () => null, dispatchEvent() { } });
  e.c.legendmod5 = e.S;
  delete e.c.LMGamepad;
  let loaded = true;
  try { vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'gamepad.js'), 'utf8'), e.c); } catch (err) { loaded = false; console.log('   ' + err.message); }
  const G = e.c.LMGamepad;
  check('N4 real gamepad file: loaded', loaded && !!G && typeof G.setButton === 'function');
  if (G) {
    const set = e.ls.setItem;
    e.ls.setItem = (k, v) => { if (k === 'lmGamepad') throw new Error('QuotaExceededError'); set(k, v); };
    G.setButton(1, 'hk-tripleSplit');
    e.ls.setItem = set;
    check('N4 real gamepad file: a button changed while the storage was full is in use, not stored', G.getMap()[1] === 'hk-tripleSplit' && JSON.parse(e.ls.getItem('lmGamepad')).map[1] !== 'hk-tripleSplit');
    check('N4 real gamepad file: a gamepad profile saved now has that button', e.P.core.captureGamepad().gp.map[1] === 'hk-tripleSplit');
    const n = e.P.core.migrateGamepadProfiles();
    const st = JSON.parse(e.ls.getItem('lmGamepad'));
    check('N4 real gamepad file: the old setup moved, the stored buttons are the ones in use, no old list left', n === 1 && !('profiles' in st) && st.map[1] === 'hk-tripleSplit' && G.getMap()[1] === 'hk-tripleSplit' && J(oldHeld(e)) === '[]');
  }
}
{
  /* Rename (the profile's Rename button): the name of another profile gets a number like a new
   * profile does; until 3.689 two profiles could both be called "Alpha" */
  const e = bootApply();
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'a1', name: 'Alpha', data: { s: { showMass: true } } }, { id: 'b1', name: 'Beta', data: { s: { showMass: false } } }]));
  const names = () => JSON.parse(e.ls.getItem('lmSettingsProfiles')).map(p => p.name).join(',');
  e.c.prompt = () => 'alpha';
  e.P.core.act('rename', 'b1');
  check('rename: to the name of another profile gives a numbered name', names() === 'Alpha,alpha 2');
  e.c.prompt = () => 'Gamma';
  e.P.core.act('rename', 'b1');
  check('rename: a free name is taken as typed', names() === 'Alpha,Gamma');
  e.c.prompt = () => 'ALPHA';
  e.P.core.act('rename', 'a1');
  check('rename: a profile may change the case of its own name', names() === 'ALPHA,Gamma');
}
{
  /* Delete: the profile's link to a HUD layout goes with it, the layout stays; rename keeps it
   * (until 3.693 a deleted profile left its link behind in lmHudLayouts) */
  const e = bootApply();
  e.ls.setItem('lmSettingsProfiles', J([{ id: 'a1', name: 'Alpha', data: { s: { showMass: true } } }, { id: 'b1', name: 'Beta', data: { s: { showMass: false } } }]));
  e.HE.saveLayout('L', { leaderboard: { h: 'l', x: 1, v: 't', y: 1, s: 1 } });
  e.HE.linkProfile('a1', 'L');
  e.HE.linkProfile('b1', 'L');
  e.c.prompt = () => 'Alpha new';
  e.P.core.act('rename', 'a1');
  check('rename: the HUD layout link stays', e.HE.profileLayout('a1') === 'L');
  e.c.confirm = () => true;
  e.P.core.act('del', 'a1');
  const st = JSON.parse(e.ls.getItem('lmHudLayouts'));
  check('delete: the profile is gone', JSON.parse(e.ls.getItem('lmSettingsProfiles')).map(p => p.id).join() === 'b1');
  check('delete: its HUD layout link is dropped (also in storage)', e.HE.profileLayout('a1') === '' && !('a1' in st.links));
  check('delete: the layout and the link of another profile stay', st.list.some(l => l.name === 'L') && st.links.b1 === 'L');
}
{
  /* the parts line under a profile names every part it brings (a set with only a phone control
   * layout or gamepad buttons showed none of them until 3.697) */
  const t = k => i18n.t('modules.profiles.' + k);
  const badge = d => C.partsBadge(C.cleanBundle(d));
  check('parts line: a phone control layout alone is Phone controls', badge({ s: { showMass: true }, ml: { landscape: { split: { x: 0.5, y: 0.5 } } } }) === [t('partS'), t('partM')].join(' + '));
  check('parts line: gamepad buttons are named, the zoom bookmarks of an older set are not', badge({ s: { showMass: true }, gp: { buttons: { 0: 'hk-split' } }, zb: [1, 2, 3] }) === [t('partS'), t('partGP')].join(' + '));
  check('parts line: the "none" of an Undo or backup is not a part', C.partsBadge({ s: { showMass: true }, m: { _lmAbsent: 1 }, ml: { _lmAbsent: 1 }, gp: { _lmAbsent: 1 }, zb: [0, 0, 0] }) === t('partS'));
}
{
  /* a set saved before commands were merged into others: their keys go where the stored hotkeys
   * take them on load (Open the Lab -> User Scripts, zoom bookmark -> zoom level, Screenshot mode
   * -> Show/hide HUD); the profile check dropped them as unknown commands, so the key did nothing */
  const add = { 'hk-lmPlugins': { defaultKey: '' }, 'hk-zoom1': { defaultKey: '' }, 'hk-zoom2': { defaultKey: '' }, 'hk-showHUD': { defaultKey: '' } };
  Object.assign(ctx.hotkeysCommand, add);
  try {
    const h = C.cleanBundle({ h: { F9: 'hk-lmLab', 'ALT+1': 'hk-zoomRecall1', 'ALT+2': 'hk-zoomRecall2', Z: 'hk-zoom2', F2: 'hk-screenshotMode', W: 'hk-feed', X: 'hk-hotkeyConflicts', K: 'hk-zoomSave3', Y: 'hk-skinCollections', C: 'hk-commandCentre' } });
    check('renamed commands: Open the Lab key opens User Scripts', h && h.h.F9 === 'hk-lmPlugins');
    check('renamed commands: a zoom bookmark key goes to its zoom level', h && h.h['ALT+1'] === 'hk-zoom1');
    check('renamed commands: a zoom level with its own key keeps it, the old key is free', h && h.h.Z === 'hk-zoom2' && !('ALT+2' in h.h));
    check('renamed commands: Screenshot mode key is Show/hide HUD', h && h.h.F2 === 'hk-showHUD');
    check('renamed commands: other keys stay, a removed command (Hotkey conflicts, zoom save, Skin collections, Command Centre) is dropped', h && h.h.W === 'hk-feed' && !('X' in h.h) && !('K' in h.h) && !('Y' in h.h) && !('C' in h.h));
    const h2 = C.cleanBundle({ h: { F9: 'hk-lmLab', F10: 'hk-lmPlugins' } });
    check('renamed commands: User Scripts with a key of its own: the Lab key is free', h2 && h2.h.F10 === 'hk-lmPlugins' && !('F9' in h2.h));
    const raw = { h: { F9: 'hk-lmLab' } };
    C.cleanBundle(raw);
    check('renamed commands: the stored set itself is not changed', raw.h.F9 === 'hk-lmLab');
  } finally { Object.keys(add).forEach(k => { delete ctx.hotkeysCommand[k]; }); }
}
{
  /* the old switches that only follow a choice now (Short mass -> Mass format, the two stats
   * switches -> Stats position) are no change of their own: no menu row has them, and the
   * profile's changes list showed "Short mass (k)" and "Stats at center" next to the choice */
  const base = Object.assign({}, ctx.defaultmapsettings);
  const a = C.cleanBundle({ s: base });
  const b = C.cleanBundle({ s: Object.assign({}, base, { massFormat: 1, statsPosition: 'center' }) });
  const keys = C.diffBundles(a, b).map(r => r.key).sort().join();
  check('copies of a choice: only the choices are listed as changes (' + keys + ')', keys === 'massFormat,statsPosition');
  const old = C.cleanBundle({ s: { shortMass: false } });
  const ko = C.diffBundles(a, old).map(r => r.key).sort().join();
  check('copies of a choice: an older set with only Short mass lists Mass format (' + ko + ')', ko === 'massFormat');
}
check('gamepad texts: in the packs, Greek differs', ['pkg.pt.gpView', 'pkg.pt.gpNote', 'pkg.pt.saveGp', 'pkg.pt.gpBadge', 'pkg.pt.gpEmpty', 'pkg.pt.gpMoved', 'pkg.pt.gpOpen', 'pkg.pt.allView', 'pkg.pt.fromPreset', 'pkg.pt.fromPresetNote', 'pkg.pt.empty', 'pkg.n34.gpPending'].every(k => i18n.t(k) !== k && i18n.t(k, null, 'el') !== i18n.t(k)));

// ── player profiles: favourite star, search and the move of the old Skin collections into them
{
  const M = ctx.lmMergeSkinCollections, Q = ctx.lmProfileMatches;
  check('skin collections move: helpers exist', typeof M === 'function' && typeof Q === 'function');
  if (typeof M === 'function' && typeof Q === 'function') {
    const prof = (n, s, extra) => Object.assign({ nick: n, clanTag: '', skinURL: s, color: '#fff' }, extra || {});
    const mk = () => [prof('Me', 'https://s.example/me.png'), prof('Profile #2', ''), prof('Profile #3', ''), prof('Profile #4', '')];
    const col = { v: 1, folders: ['Fun'], items: {
      'https://s.example/me.png': { f: '', t: [], s: true },
      'https://s.example/a.png': { f: 'Fun', t: ['red'], s: false },
      ' https://s.example/b.png ': { f: '', t: ['clan war'], s: true },
      'https://s.example/c.png': { f: '', t: [], s: false },
      'https://s.example/d.png': { f: '', t: [], s: false },
      'bad<url>': { s: true }, 'https://s.example/e.png': 'x'
    } };
    let list = mk(), extra = [];
    let res = M(JSON.parse(J(col)), list, extra, [1, 0], '#123');
    check('skin collections move: every kept link is in a profile once (' + J(res) + ')', res.added === 4 && J(list.concat(extra).map(p => p.skinURL).filter(Boolean).sort()) === J(['https://s.example/a.png', 'https://s.example/b.png', 'https://s.example/c.png', 'https://s.example/d.png', 'https://s.example/me.png']));
    check('skin collections move: the selected profile 2 is not used, the free ones are', list[1].skinURL === '' && list[2].skinURL !== '' && list[3].skinURL !== '');
    check('skin collections move: favourites get the visible profiles first and keep the star', list[2].skinURL === 'https://s.example/b.png' && list[2].fav === true);
    check('skin collections move: a favourite already in a profile stars that profile', list[0].fav === true && res.favs === 1);
    check('skin collections move: folder or first tag becomes the nick, else the default one', list[2].nick === 'clan war' && list.concat(extra).some(p => p.skinURL === 'https://s.example/a.png' && p.nick === 'Fun') && list.concat(extra).some(p => p.skinURL === 'https://s.example/d.png' && /^Profile #\d+$/.test(p.nick)));
    check('skin collections move: no room left -> hidden profiles with the given colour', res.hidden === 2 && extra.length === 2 && extra.every(p => p.color === '#123' && p.clanTag === '' && !('f' in p)));
    const before = J([list, extra]);
    res = M(JSON.parse(J(col)), list, extra, [1, 0], '#123');
    check('skin collections move: running it again adds nothing', res.added === 0 && res.favs === 0 && J([list, extra]) === before);
    const bad = [null, 'x', 5, [], { items: [] }, { items: 'x' }, { v: 1 }];
    check('skin collections move: an empty or broken value changes nothing', bad.every(v => { const l = mk(), e = []; const r = M(v, l, e, [0], '#fff'); return r.added === 0 && J(l) === J(mk()) && e.length === 0; }));
    const many = { items: {} };
    for (let i = 0; i < 700; i++) many.items['https://s.example/m' + i + '.png'] = {};
    const l2 = mk(), e2 = [];
    check('skin collections move: at most the 500 the old window kept', M(many, l2, e2, [0], '#fff').added === 500 && l2.length + e2.length === 501);
    // search: every word in the nick, clan tag or skin link; * keeps the favourites
    const p1 = prof('Jimbo', 'https://i.imgur.com/AbC.png', { clanTag: 'LM', fav: true }), p2 = prof('Other', 'https://s.example/x.png');
    check('profile search: empty finds all', Q(p1, '') && Q(p2, '  '));
    check('profile search: words over nick, clan tag and link, any case', Q(p1, 'jim lm') && Q(p1, 'IMGUR') && !Q(p2, 'jim') && !Q(p1, 'jim other'));
    check('profile search: * = favourites', Q(p1, '*') && !Q(p2, '*') && Q(p1, '* jim') && !Q(p1, '* other'));
    check('profile search: a broken profile never matches', !Q(null, '') && !Q('x', ''));
    check('profile texts: in the packs, Greek differs', ['pkg.skcol.search', 'pkg.skcol.star', 'pkg.skcol.unstar', 'pkg.skcol.none', 'pkg.skcol.moved', 'pkg.skcol.movedHidden'].every(k => i18n.t(k) !== k && i18n.t(k, null, 'el') !== i18n.t(k)));
  }
}

console.log(fail ? fail + ' failed' : 'all profiles checks passed');
process.exit(fail ? 1 : 0);
