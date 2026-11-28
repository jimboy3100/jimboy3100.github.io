/* Settings presets, the settings export / import of the module configuration keys and the
 * player profiles (the move of the old Skin collections into them), against the real code of
 * ogario/ogario.v4.js. The settings profiles (named sets, Compare, automatic switching, backups)
 * are removed: their stored keys are neither exported nor imported, the loader deletes them.
 * node developers/tests/profiles.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
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
vm.createContext(ctx);
i18n(ctx);
/* the real schemas and validators (defaultmapsettings + LM_SETTINGS_DEFAULTS + lmSettingValue, the export registry) */
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
/* the presets of Settings (the one list of starter setups), as the menu publishes them */
vm.runInContext('(function () {\n' + cut('                var presets = {', '                application.lmPresets = presets;') + '\nwindow.application = { lmPresets: presets }; })();', ctx);
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const D = ctx.LM_SETTINGS_DEFAULTS;
const J = v => JSON.stringify(v);
// ── the settings profiles are gone from the code, the hotkeys, the menu and the language packs
check('settings profiles removed: no module, no loader, no button, no hotkey', !fs.existsSync(path.join(root, 'ogario', 'modules', 'profiles.js')) &&
  !/modules\/profiles\.js|LMProfiles|lm-profiles-open/.test(main) && !/'hk-lmProfilesWindow':/.test(fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8')));
check('settings profiles removed: texts gone from the packs', ['modules.profiles.title', 'lmSettingsProfiles', 'settings.hk-lmProfilesWindow', 'pkg.pt.gpMoved', 'game1.set.profilesLoading'].every(k => i18n.t(k) === k));
/* the player profile badges (P1..P4 on the profile boxes) were removed right after their CSS was injected:
 * no badge CSS in the core or skins/skins.css, and choosing a profile still updates the multibox slots */
check('profile badges: no badge CSS left (core, skins.css), setProfile still updates the multibox slots',
  !/mb-badge|updateProfileBadges|_mbBadgeCSSInjected/.test(main) && !/mb-badge/.test(fs.readFileSync(path.join(root, 'skins', 'skins.css'), 'utf8')) &&
  /this\.ensureMbSlots\(\);\s*\},/.test(cut('        setProfile() {', '        ensureMbSlots() {')));
{
  /* the loader deletes what the removed feature kept */
  const at = main.indexOf("['lmSettingsProfiles', 'lmSettingsProfilesRules', 'lmSettingsBackups', 'lmSettingsProfilesUndo', 'lmSettingsProfilesLast', 'lmGamepadPending']");
  const line = at >= 0 ? main.slice(main.lastIndexOf('try {', at), main.indexOf('\n', at)) : '';
  const ls = makeStorage(0);
  ['lmSettingsProfiles', 'lmSettingsProfilesRules', 'lmSettingsBackups', 'lmSettingsProfilesUndo', 'lmSettingsProfilesLast', 'lmGamepadPending', 'ogarioPlayerProfiles', 'lmPresetUndo'].forEach(k => ls.setItem(k, '1'));
  if (line) vm.runInNewContext(line, { localStorage: ls });
  check('stored settings profiles, rules, backups and Undo deleted; player profiles and Undo preset kept', !!line && J([...ls._map.keys()].sort()) === J(['lmPresetUndo', 'ogarioPlayerProfiles']));
}

// ── the Settings presets: the one list of starter setups
const PR = ctx.application.lmPresets;
const tplIds = Object.keys(PR || {});
check('eight presets: the five of Settings + FFA, Teams, Multibox', J(tplIds) === J(['competitive', 'battery', 'streamer', 'reducedMotion', 'cleanHud', 'ffa', 'teams', 'multibox']));
/* the six built-in templates of the removed settings profiles (3.656): nothing of them is lost */
const OLD_TPL = {
  ffa: { oppColors: true, oppRings: true, splitRange: true, virusesRange: true, virMassShots: true, showMass: true, mergeRings: true, showTop5: false, showTargeting: false },
  teams: { showTop5: true, teammatesInd: true, showTargeting: true, showMiniMap: true, showMiniMapGhostCells: true, hideTeammatesNames: false, oneColoredTeammates: false, showChat: true },
  /* its two ring switches are gone: the ring on the player you control has no settings */
  multibox: { mbSwitchAfterDeath: true, mbAutoRespawn: true, multiKeepMoving: true, middleMultiViewWhenClose: true, cameraSmoothLerp: true },
  streaming: { streamMode: true, hideSkinUrl: true, hidecountry: true, showChatImages: false, showChatVideos: false, showDevConsole: false },
  mobile: { fpsLimit: 60, jellyPhisycs: false, videoSkins: false, highDPI: false, showGhostCells: false, borderGlow: false, virusGlow: false, suckAnimation: false, showBgSectors: false, hudBlur: 0 },
  competitive: { oppColors: true, oppRings: true, virColors: true, splitRange: true, virusesRange: true, virMassShots: true, showMass: true, mergeRings: true, showStatsFPS: true, showStatsPPS: true } /* its splitPrediction: always part of the cursor line now */
};
Object.keys(OLD_TPL).forEach(id => {
  const to = { streaming: 'streamer', mobile: 'battery' }[id] || id, set = PR[to] && PR[to].set;
  const lost = set ? Object.keys(OLD_TPL[id]).filter(k => set[k] !== OLD_TPL[id][k]) : ['(no preset)'];
  check('old template ' + id + ': every value is in the preset ' + to, lost.length === 0 || !console.log('   lost: ' + lost.join(', ')));
});
/* what the presets did before (3.656) still happens (except the removed 25 FPS menu cap) */
const OLD_PRESET = {
  battery: { fpsLimit: 60, jellyPhisycs: false, videoSkins: false, animatedRainbowColor: false, rainbowMapBorders: false, borderGlow: false, virusGlow: false, suckAnimation: false, showGhostCells: false, hudBlur: 0 },
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
  check('preset ' + id + ': every key is a gameplay setting with a valid value', bad.length === 0 || !console.log('   bad: ' + bad.join(', ')));
});

// ── settings export / import: one list of the module configuration keys (round trip)
{
  const fn = (n) => typeof ctx[n] === 'function' ? ctx[n] : null;
  const exp = fn('lmExportExtras'), imp = fn('lmImportExtras');
  check('export registry: lmExportExtras / lmImportExtras exist', !!(exp && imp && Array.isArray(ctx.LM_EXPORT_KEYS)));
  if (exp && imp) {
    const src = makeStorage(0);
    const conf = {
      lmHudLayouts: { v: 1, active: 'A', list: [{ name: 'A', c: {} }] },
      lmThemeWorkshop: { v: 1, themes: [] }, 'lm-director': { speed: 3 },
      'lm-director-bookmarks': [{ x: 1, y: 2 }], lmPracticeCfg: { bots: 4 }, lmAnalyticsGoals: { v: 1, custom: [] },
      lmGamepad: { v: 1, map: [] }, 'lm-mobile-prefs': { btnScale: 1 }, 'lm-mobile-layouts': { v: 1 }, lmPresetUndo: { s: {} },
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
    /* settings profiles are removed: what an older version kept is neither exported nor imported */
    const srcP = makeStorage(0);
    ['lmSettingsProfiles', 'lmSettingsProfilesRules', 'lmSettingsBackups', 'lmGamepadPending'].forEach(k => srcP.setItem(k, J(k === 'lmSettingsProfilesRules' ? { enabled: true } : [{ id: 'p1', name: 'P', data: { s: { showMass: true } } }])));
    const outP = JSON.parse(J(exp(srcP)));
    check('export: no settings profiles, rules or backups', ['lmSettingsProfiles', 'lmSettingsProfilesRules', 'lmSettingsBackups', 'lmGamepadPending'].every(k => !(k in outP)));
    const dstP = makeStorage(0);
    imp({ lmSettingsProfiles: [{ id: 'p1', name: 'P', data: { s: { showMass: true } } }], lmSettingsProfilesRules: { enabled: true } }, (k, t) => dstP.setItem(k, t), k => dstP.removeItem(k));
    check('import: the settings profiles of an older export are not written', dstP.getItem('lmSettingsProfiles') === null && dstP.getItem('lmSettingsProfilesRules') === null);
    /* the removed custom macros */
    src.setItem('lmCustomMacros', J({ v: 1, slots: [{ name: 'm', steps: [{ a: 'split' }] }] }));
    check('export: the custom macros are not carried', !('lmCustomMacros' in exp(src)));
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
    imp({ lmHudLayouts: [1, 2], 'lm-zoom-bookmarks': [1, 0, 3] }, (k, t) => dst2.setItem(k, t), k => dst2.removeItem(k));
    check('import: a value of the wrong type is not written', dst2.getItem('lmHudLayouts') === '{"keep":1}');
    check('import: the zoom bookmarks of an older export are not written', dst2.getItem('lm-zoom-bookmarks') === null);
    imp({ lmCustomMacros: { v: 1, slots: [{ name: 'm', steps: [] }] } }, (k, t) => dst2.setItem(k, t), k => dst2.removeItem(k));
    check('import: the custom macros of an older export are not written', dst2.getItem('lmCustomMacros') === null);
    /* the removed Performance mode: its copy is neither exported nor imported */
    { const srcPm = makeStorage(0); srcPm.setItem('lmPerfBackup', J({ jellyPhisycs: true })); check('export: no Performance mode copy', !('lmPerfBackup' in exp(srcPm))); }
    { const dstPm = makeStorage(0); imp({ lmPerfBackup: { jellyPhisycs: true } }, (k, t) => dstPm.setItem(k, t), k => dstPm.removeItem(k)); check('import: the Performance mode copy of an older export is not written', dstPm.getItem('lmPerfBackup') === null); }
    /* Command Centre: the starred commands (also its quick bar) are configuration, the recently
     * used ones history: only the stars go, the importing device keeps its own recent list */
    const src3 = makeStorage(0);
    src3.setItem('lmCommandCentre', J({ fav: ['hk:hk-feed', 'opt:showMass'], recent: ['hk:hk-split'] }));
    const out3 = JSON.parse(J(exp(src3)));
    check('export: the Command Centre stars, not its recently used list', J(out3.lmCommandCentre) === J({ fav: ['hk:hk-feed', 'opt:showMass'] }));
    const dst3 = makeStorage(0);
    dst3.setItem('lmCommandCentre', J({ fav: ['opt:x'], recent: ['hk:hk-menu'] }));
    imp(out3, (k, t) => dst3.setItem(k, t), k => dst3.removeItem(k), null, k => dst3.getItem(k));
    check('import: the stars come in, this device keeps its recently used list', dst3.getItem('lmCommandCentre') === J({ fav: ['hk:hk-feed', 'opt:showMass'], recent: ['hk:hk-menu'] }));
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

// ── player profiles: the move of the old Skin collections into them (no favourite stars, no search)
{
  const M = ctx.lmMergeSkinCollections;
  check('skin collections move: helper exists, the profile search is gone', typeof M === 'function' && typeof ctx.lmProfileMatches === 'undefined');
  if (typeof M === 'function') {
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
    check('skin collections move: favourites get the visible profiles first, no fav field', list[2].skinURL === 'https://s.example/b.png' && list.concat(extra).every(p => !('fav' in p)));
    check('skin collections move: a favourite already in a profile changes nothing there', J(list[0]) === J(mk()[0]));
    check('skin collections move: folder or first tag becomes the nick, else the default one', list[2].nick === 'clan war' && list.concat(extra).some(p => p.skinURL === 'https://s.example/a.png' && p.nick === 'Fun') && list.concat(extra).some(p => p.skinURL === 'https://s.example/d.png' && /^Profile #\d+$/.test(p.nick)));
    check('skin collections move: no room left -> hidden profiles with the given colour', res.hidden === 2 && extra.length === 2 && extra.every(p => p.color === '#123' && p.clanTag === '' && !('f' in p)));
    const before = J([list, extra]);
    res = M(JSON.parse(J(col)), list, extra, [1, 0], '#123');
    check('skin collections move: running it again adds nothing', res.added === 0 && J([list, extra]) === before);
    const bad = [null, 'x', 5, [], { items: [] }, { items: 'x' }, { v: 1 }];
    check('skin collections move: an empty or broken value changes nothing', bad.every(v => { const l = mk(), e = []; const r = M(v, l, e, [0], '#fff'); return r.added === 0 && J(l) === J(mk()) && e.length === 0; }));
    const many = { items: {} };
    for (let i = 0; i < 700; i++) many.items['https://s.example/m' + i + '.png'] = {};
    const l2 = mk(), e2 = [];
    check('skin collections move: at most the 500 the old window kept', M(many, l2, e2, [0], '#fff').added === 500 && l2.length + e2.length === 501);
    // an old starred but otherwise unused profile is free for a link
    const l3 = [prof('Me', 'x'), prof('Profile #2', '', { fav: true })], e3 = [];
    check('skin collections move: an old fav field does not keep a profile', M({ items: { 'https://s.example/z.png': {} } }, l3, e3, [0], '#fff').added === 1 && l3[1].skinURL === 'https://s.example/z.png' && e3.length === 0);
    check('profile texts: the move notices in the packs, Greek differs; star and search texts gone', ['pkg.skcol.moved', 'pkg.skcol.movedHidden'].every(k => i18n.t(k) !== k && i18n.t(k, null, 'el') !== i18n.t(k)) &&
      ['pkg.skcol.star', 'pkg.skcol.unstar', 'pkg.skcol.search', 'pkg.skcol.none'].every(k => i18n.t(k) === k));
    check('profile texts: the move notice points to no star or favourites', !/star|\*|favourite/i.test(i18n.t('pkg.skcol.moved')) && !/\u03b1\u03c3\u03c4\u03ad\u03c1\u03b9|\u03b1\u03b3\u03b1\u03c0\u03b7\u03bc\u03ad\u03bd\u03b1/.test(i18n.t('pkg.skcol.moved', null, 'el')));
  }
}

/* multibox slots (application.mbSlots, index slot - 1) with the real ensureMbSlots / syncFromMbSlots /
 * selectProfile / setProfileCount and the player registry (lmMbPlayers, lmMbCapacity, lmMbProfileIdx) */
{
  const src = main.replace(/\r\n/g, '\n');
  const blk = (start) => { const i = src.indexOf(start); if (i < 0) throw new Error('not found: ' + start); for (let k = src.indexOf('{', i), d = 0; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}' && !--d) return src.slice(i, k + 1); } };
  const evA = src.indexOf('/* LMEvents: hooks'), ev = src.slice(evA, src.indexOf('window.OgVer', evA));
  const meth = ['        ensureMbSlots() {', '        syncFromMbSlots() {', '        selectProfile(value) {', '        setProfileCount() {'].map(blk).join(',\n');
  const mk = (cap, n) => {
    const c = { console, Math, Date, JSON, Object, Array, Number, Map, Set };
    c.window = c;
    vm.createContext(c);
    vm.runInContext(ev, c);
    vm.runInContext('var defaultmapsettings = window.defaultmapsettings = { multiboxAmount: ' + cap + ', profileNumber: ' + n + ', multiBoxShadow: false };\n' +
      'var profiles = []; for (var i = 0; i < ' + n + '; i++) profiles.push({ nick: "p" + i, skinURL: "s" + i });\n' +
      'function $() { return { length: 0 }; }\n' +
      'var application = window.application = { selectedProfile: 0, selectedOldProfile: 1, mbSlots: [], setPlayerSettings() { }, setProfile() { this.ensureMbSlots(); },\n' +
      ' setProfileboxShadow() { }, eraseProfileboxShadow() { }, saveSettings() { }, profiling() { }, _lmFitProfiles(k) { profiles.length = k; },\n' + meth + ' };', c);
    return c;
  };
  {
    const c = mk(3, 12), a = c.application;
    a.ensureMbSlots();
    check('multibox slots: Settings "Multibox slots" 3 (the shipped default) gives P1, P2 and P3 a profile (' + J(a.mbSlots) + ')', J(a.mbSlots) === '[0,1,2]');
    c.defaultmapsettings.multiboxAmount = 6; a.ensureMbSlots();
    check('multibox slots: six, each its own profile (' + J(a.mbSlots) + ')', J(a.mbSlots) === '[0,1,2,3,4,5]');
    c.defaultmapsettings.multiboxAmount = 4; a.ensureMbSlots();
    check('multibox slots: an old saved 4 is four slots (it opens nothing)', J(a.mbSlots) === '[0,1,2,3]' && c.lmMbPlayers.count() === 1);
    /* only P1 and P2 play: the swap / cascade of two players, as always */
    a.selectProfile(1);
    check('two players: the second profile clicked swaps P1 and P2 (' + J(a.mbSlots) + ')', J(a.mbSlots.slice(0, 2)) === '[1,0]' && a.selectedProfile === 1 && a.selectedOldProfile === 0);
    a.selectProfile(7);
    check('two players: a new profile becomes P1, the old P1 is P2 (' + J(a.mbSlots) + ')', J(a.mbSlots.slice(0, 2)) === '[7,1]' && a.selectedOldProfile === 1);
    a.selectProfile(2);
    check('two players: the profile P3 had becomes P1; P3 gets another one, P4 keeps its own (' + J(a.mbSlots) + ')', J(a.mbSlots.slice(0, 2)) === '[2,7]' &&
      a.mbSlots[2] !== 2 && a.mbSlots[2] !== 7 && a.mbSlots[3] === 3 && a.mbSlots.length === 4);
  }
  {
    const c = mk(4, 12), a = c.application, reg = c.lmMbPlayers;
    a.ensureMbSlots();
    const mkUnit = (n) => { const r = reg.reserve(); const u = { number: n, player: true, slotId: r.slotId, slotEpoch: r.slotEpoch }; reg.attach(u); c.spects.push(u); return u; };
    const u2 = mkUnit(1), u3 = mkUnit(16);
    c.lmSetMbUnit(16);
    a.selectProfile(9);
    check('an optional player (P3) open and controlled: the click gives P3 that profile only (' + J(a.mbSlots) + ')', J(a.mbSlots.slice(0, 3)) === '[0,1,9]' &&
      a.selectedProfile === 0 && a.selectedOldProfile === 1 && c.lmMbProfileIdx(u3) === 9 && c.lmMbProfileIdx(u2) === 1);
    c.lmSetMbUnit(0);
    a.selectProfile(8);
    check('    ... P1 controlled: P1 gets it, no cascade into the living P2 (' + J(a.mbSlots) + ')', J(a.mbSlots.slice(0, 3)) === '[8,1,9]' && a.selectedProfile === 8 && a.selectedOldProfile === 1);
    /* the profile count cut from 12 to 10 while a skin of P3's profile still loads: P3's profile is gone, it
     * gets another one; P4 keeps its own; a unit's skin is loaded by its link, so the picture
     * that arrives later belongs to no slot */
    a.mbSlots[3] = 4;
    a.selectedProfile = 0;
    c.defaultmapsettings.profileNumber = 10;
    a.setProfileCount();
    check('the profile count cut (12 -> 10, two profiles gone): P1 / P2 from the selection, P3 (profile 9 gone) gets a free one, P4 keeps 4 (' + J(a.mbSlots) + ')',
      a.mbSlots[0] === 0 && a.mbSlots[1] === 1 && a.mbSlots[2] < 10 && [0, 1, 4].indexOf(a.mbSlots[2]) === -1 && a.mbSlots[3] === 4 && c.lmMbProfileIdx(u3) === a.mbSlots[2]);
  }
  check('settings load / import open no connection: only enable and Add Player call addBox',
    (src.match(/\badd\(\)/g) || []).length === 2 && /add \? add\(\) : null/.test(blk('        _lmMbStart() {')) && /add \? add\(\) : null/.test(blk('        mbAddPlayer() {')) &&
    !/\baddBox\(\)/.test(src));
}

console.log(fail ? fail + ' failed' : 'all profiles checks passed');
process.exit(fail ? 1 : 0);
