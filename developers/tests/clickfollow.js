/* Spectate follows: always on, no option, no "Following ..." label, and they work from every
 * spectate mode, with the real code of ogario/ogario.v4.js and ogario/hotkeysCommand.js in a vm:
 *   - no Click to follow option: the old clickSpectate / lbClickSpectate / minimapClickSpectate
 *     values are dropped quietly on load and import
 *   - a leaderboard mass click, a player cell click and the "follow next leaderboard player" hotkey
 *     follow that player from the follow camera (Spectate), from free spectate and from Expanding
 *     Land World Spectate: free spectate is switched on first (the camera moves to the cursor sent,
 *     checked on the real sendPosition packet); they did nothing outside free spectate, and nothing
 *     at all with the option off (the default)
 *   - no follow while playing, while a multibox unit plays on, or when not spectating
 *   - the Expanding Land minimap click moves the World Spectate camera with no option
 *   - the director's hotkeys, camera lock and saved data stay gone
 * node developers/tests/clickfollow.js   (LM_ROOT=<other checkout> runs it on another version) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const hkSrc = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
/* a method of an object literal (8-space indent), the first one after `after` */
const method = (name, after) => {
  const from = after ? main.indexOf(after) : 0;
  const i = main.indexOf('\n        ' + name + '(', from);
  if (i < 0 || from < 0) return name + ': function () { throw new Error("' + name + ' missing"); }';
  /* braces counted outside comments and strings */
  let d = 0, k = main.indexOf('{', i);
  for (; k < main.length; k++) {
    const ch = main[k], nx = main[k + 1];
    if (ch === '/' && nx === '/') { k = main.indexOf('\n', k); continue; }
    if (ch === '/' && nx === '*') { k = main.indexOf('*/', k + 2) + 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { for (k++; k < main.length && main[k] !== ch; k++) if (main[k] === '\\') k++; continue; }
    if (ch === '{') d++; else if (ch === '}' && !--d) break;
  }
  return name + ': function ' + main.slice(main.indexOf('(', i), k + 1);
};
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); } };
}
let created = 0, toasts = 0;
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, DataView, ArrayBuffer, Uint8Array, setTimeout(f) { f(); }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = makeStorage();
ctx.LMEvents = { _has() { return false; }, emit() { } };
ctx.document = { createElement() { created++; return { style: {} }; }, getElementById() { return null; }, body: { appendChild() { } } };
ctx.toastr = { info() { toasts++; } };
ctx.lmT = k => k;
ctx._lmTH = k => k;
ctx.application = { shortMassFormat: m => String(m), calculateMapSector: () => 'C3' };
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext('var profiles = [];', ctx);
vm.runInContext(cut('function lmMultiboxControlledPlayer() {', '/* C4:'), ctx);
let activeSpect = null;
ctx.getActiveSpect = () => activeSpect;
const D = ctx.LM_SETTINGS_DEFAULTS;

// ── no option: old values dropped quietly
check('no Click to follow option (nor the two older switches)',
  !('clickSpectate' in D) && !('lbClickSpectate' in D) && !('minimapClickSpectate' in D));
ctx._f = { clickSpectate: false, lbClickSpectate: true, minimapClickSpectate: 'true', showMass: true };
const changed = vm.runInContext('lmFoldLegacySettings(_f)', ctx);
check('fold: the three old keys are dropped, other values stay', changed === true &&
  !('clickSpectate' in ctx._f) && !('lbClickSpectate' in ctx._f) && !('minimapClickSpectate' in ctx._f) && ctx._f.showMass === true, JSON.stringify(ctx._f));
ctx._f = { showMass: false };
check('fold: a set without them is left as it is', vm.runInContext('lmFoldLegacySettings(_f)', ctx) === false && ctx._f.showMass === false);
{
  const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
  ctx.ogario = {};
  ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, D, { clickSpectate: false })));
  app.loadSettings();
  const reSaved = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
  check('load: an old save with Click to follow off loads without it, the save is rewritten without it',
    !('clickSpectate' in ctx.defaultmapsettings) && !('clickSpectate' in reSaved));
  const impLoop = cut("                    var _impS = importValue.ogarioSettings;", "                if (Object.prototype.hasOwnProperty.call(importValue, 'ogarioThemeSettings')");
  const v = { ogarioSettings: { clickSpectate: true, lbClickSpectate: false } };
  vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(v);
  check('import: an old export\'s Click to follow is dropped', !('clickSpectate' in v.ogarioSettings) && !('lbClickSpectate' in v.ogarioSettings));
}

// ── the follows on the real LM methods
const NAMES = ['sendAction', 'createView', 'sendSpectate', '_lmSpawnEndsSpectate', 'sendFreeSpectate', 'sendPosition', 'translateX', 'translateY',
  'targetingLead', '_lmSpecFree', '_lmSpecLbCheck', '_lmSpecLbHud', '_lmSpecCellPick', '_lmSpecCellPos', '_lmSpecCellStop', '_lmSpecCellHud', '_lmSpecFollowTop'];
const lmSrc = '({' + NAMES.filter(n => main.indexOf('\n        ' + n + '(', main.indexOf('    var LM = {')) > 0).map(n => method(n, '    var LM = {')).join(',\n') + '})';
function makeLM(opts) {
  const lm = vm.runInContext(lmSrc, ctx);
  const sent = [];
  Object.assign(lm, {
    socket: { readyState: 1, OPEN: 1, send(b) { sent.push(new Uint8Array(b)[0]); } }, connectionOpened: true, clientKey: 1, protocolKey: 7,
    isSocketOpen() { return true; },
    sendMessage(v) { const b = new Uint8Array(v.buffer); sent.push(b.length === 13 ? { x: v.getInt32(1, true), y: v.getInt32(5, true) } : b[0]); },
    play: false, isSpectateEnabled: false, isFreeSpectate: false, _isWorldSpectating: false, isLegendWorld: false,
    vector: [[0, 0], [1, 0]], vnr: 0, mapMinX: -7000, mapMaxX: 7000, mapMinY: -7000, mapMaxY: 7000,
    viewX: 0, viewY: 0, viewXTrue: 0, viewYTrue: 0, cursorX: 111, cursorY: 222,
    ghostCells: [{ x: 1000, y: 2000, mass: 900 }, { x: -3000, y: 500, mass: 800 }, { x: 4000, y: -4000, mass: 700 }],
    leaderboard: [{ nick: 'a' }, { nick: 'b' }, { nick: 'c' }],
    cells: [{ x: 300, y: 400, size: 100, nick: 'bob', color: '#f00' }, { x: 500, y: 400, size: 50, nick: 'bob', color: '#f00' }, { x: -900, y: -900, size: 80, nick: 'eve', color: '#0f0' }],
    indexedCells: {}
  }, opts || {});
  lm.sent = sent;
  ctx.legendmod = lm; ctx.LM = lm;
  ctx.userBots = {};
  return lm;
}
const cursorOut = lm => { lm.sent.length = 0; lm._lmLastCursorAt = 0; lm.sendPosition(undefined, undefined, undefined, true); return lm.sent.find(e => typeof e === 'object'); };

{ // agar.io: the follow camera (Spectate), leaderboard mass click
  const lm = makeLM({ isSpectateEnabled: true });
  lm.targetingLead(2);
  check('leaderboard click in the follow camera: free spectate is switched on (Q, 18) and player #3 followed',
    lm.isFreeSpectate === true && lm._lmSpecLb === 2 && lm.sent.indexOf(18) >= 0, JSON.stringify([lm.isFreeSpectate, lm._lmSpecLb, lm.sent]));
  const c = cursorOut(lm);
  check('the cursor sent is that player (the server moves the free camera there)', c && c.x === 4000 && c.y === -4000, JSON.stringify(c));
  lm.sent.length = 0;
  lm.targetingLead(0);
  check('a click on another mass follows that one, without toggling free spectate off', lm._lmSpecLb === 0 && lm.isFreeSpectate === true && lm.sent.indexOf(18) < 0);
  lm.targetingLead(0);
  const c2 = cursorOut(lm);
  check('a second click on the same mass stops; the cursor is the mouse again', lm._lmSpecLb === null && c2 && c2.x === 111 && c2.y === 222, JSON.stringify(c2));
  lm.vnr = 1; /* Rotate map / mirrored teammate map: ghost cells are local coordinates */
  lm.targetingLead(1);
  const cm = cursorOut(lm);
  check('mirrored map: the followed player goes out in server coordinates', cm && cm.x === lm.translateX(-3000) && cm.y === 500, JSON.stringify(cm));
  lm.ghostCells.length = 1;
  cursorOut(lm);
  check('the followed leaderboard entry gone: the follow ends', lm._lmSpecLb === null);
  check('no "Following" label element is created', created === 0, created);
}
{ // a player cell click
  const lm = makeLM({ isSpectateEnabled: true });
  check('cell click on empty space in the follow camera: nothing happens (no free spectate)', lm._lmSpecCellPick(3000, 3000) === null && lm.isFreeSpectate === false && lm.sent.length === 0);
  const t = lm._lmSpecCellPick(320, 410);
  check('cell click on a player in the follow camera: free spectate on, that player followed',
    t && t.nick === 'bob' && lm.isFreeSpectate === true && lm._lmSpecCell === t && lm.sent.indexOf(18) >= 0, JSON.stringify([t, lm.isFreeSpectate, lm.sent]));
  const c = cursorOut(lm);
  /* mass-weighted centre of bob's two cells: (300*1e4 + 500*2500) / 12500 = 340 */
  check('the cursor sent is the mass-weighted centre of its cells', c && c.x === 340 && c.y === 400, JSON.stringify(c));
  lm._lmSpecLb = 1; lm._lmSpecCellPick(-900, -900);
  check('a click on another player follows that one (one follow at a time)', lm._lmSpecCell && lm._lmSpecCell.nick === 'eve' && lm._lmSpecLb === null);
  lm._lmSpecCellPick(3000, 3000);
  check('in free spectate a click on empty space stops', lm._lmSpecCell === null && lm.isFreeSpectate === true);
  check('still no label element', created === 0, created);
}
{ // Expanding Land World Spectate
  const lm = makeLM({ isLegendWorld: true, _isWorldSpectating: true, _worldSpecPanX: 50, _worldSpecPanY: 50 });
  lm.targetingLead(0);
  check('Expanding Land World Spectate: a leaderboard click goes to free spectate (Spectate 1, then Q 18) and follows',
    JSON.stringify(lm.sent) === '[1,18]' && lm.isFreeSpectate === true && lm._isWorldSpectating === false && lm._lmSpecLb === 0, JSON.stringify([lm.sent, lm.isFreeSpectate, lm._isWorldSpectating]));
  const lm2 = makeLM({ isLegendWorld: true, _isWorldSpectating: true });
  check('World Spectate: a player cell click does the same', !!lm2._lmSpecCellPick(300, 400) && JSON.stringify(lm2.sent) === '[1,18]' && lm2.isFreeSpectate === true, JSON.stringify(lm2.sent));
}
{ // other protocols: one free spectate, not toggled back off
  const sig = makeLM({ isSpectateEnabled: true, serverType: 'sigmally', sigOpcodeMap: { 1: 101, 18: 118, 19: 119 } });
  sig.targetingLead(1);
  check('Sigmally: the click ends in free spectate (18 + 19 sent once) and follows', sig.isFreeSpectate === true && sig._lmSpecLb === 1 && JSON.stringify(sig.sent) === '[118,119]', JSON.stringify(sig.sent));
  const sen = makeLM({ isSpectateEnabled: true, serverType: 'senpa' });
  sen.targetingLead(1);
  check('Senpa: free roam mode (1) and the follow', sen.isFreeSpectate === true && sen._senpaSpecMode === 1 && sen._lmSpecLb === 1);
}
{ // when nothing may happen
  let lm = makeLM({});
  lm.targetingLead(0); lm._lmSpecCellPick(300, 400);
  check('not spectating (menu, Game Over): no spectate packet, no follow', lm.sent.length === 0 && lm._lmSpecLb == null && !lm._lmSpecCell);
  lm = makeLM({ play: true, isSpectateEnabled: true });
  lm.targetingLead(0);
  check('playing: the leaderboard click only targets (no follow, no packet)', lm.sent.length === 0 && lm._lmSpecLb == null && ctx.targetingLeadX === 1000);
  lm = makeLM({ isSpectateEnabled: true });
  ctx.multiboxPlayerEnabled = 1; activeSpect = {};
  lm.targetingLead(0); lm._lmSpecCellPick(300, 400);
  check('a multibox unit plays on: the main connection does not switch to free spectate', lm.sent.length === 0 && lm.isFreeSpectate === false && lm._lmSpecLb == null);
  ctx.multiboxPlayerEnabled = 0; activeSpect = null;
  lm.isFreeSpectate = true; lm._lmSpecLb = 1;
  lm._lmSpawnEndsSpectate(); cursorOut(lm);
  check('a spawn ends the follow', lm._lmSpecLb === null);
}
{ // the hotkey "follow next leaderboard player" (real hotkeysCommand.js)
  const hctx = { console, Object, String, Array, JSON, Math, lmT: k => k, textLanguage: {}, chatCommand: {}, application: {}, toastr: { info() { toasts++; } }, $: () => ({ trigger() { }, val() { return ''; } }) };
  hctx.window = hctx;
  vm.createContext(hctx);
  vm.runInContext(hkSrc, hctx);
  const hk = hctx.hotkeysCommand['hk-specNextTop'];
  const lm = makeLM({ isSpectateEnabled: true });
  hctx.legendmod = lm;
  toasts = 0;
  hk.keyDown();
  check('hotkey in the follow camera: free spectate on, the top player followed', lm.isFreeSpectate === true && lm._lmSpecLb === 0, JSON.stringify([lm.isFreeSpectate, lm._lmSpecLb]));
  hk.keyDown(); hk.keyDown(); hk.keyDown();
  check('hotkey steps through the leaderboard and wraps around', lm._lmSpecLb === 0 && lm.isFreeSpectate === true);
  check('hotkey shows no "Following #N" / "Free spectate first" toast', toasts === 0, toasts);
  const lm2 = makeLM({});
  hctx.legendmod = lm2;
  hk.keyDown();
  check('hotkey when not spectating: nothing', lm2.sent.length === 0 && lm2._lmSpecLb == null);
  const ids = Object.keys(hctx.hotkeysCommand);
  check('hotkeys: no spectator director or camera lock commands', !ids.some(id => /^hk-dir/.test(id) || id === 'hk-director' || id === 'hk-cameraLock'));
  check('hotkeys: the previous server command is gone', ids.indexOf('hk-prevServer') < 0);
  const rs = main.indexOf('function lmRenameOldHotkeys(map) {'), re = main.indexOf('\n}', rs);
  const rctx = { JSON, Object, String };
  vm.createContext(rctx);
  vm.runInContext(main.slice(rs, re + 2), rctx);
  const map = { D: 'hk-director', A: 'hk-dirAuto', B: 'hk-dirBroadcast', N: 'hk-dirWatchNext', P: 'hk-dirWatchPrev', W: 'hk-dirWatchAdd', S: 'hk-dirMarkSave', '1': 'hk-dirMark1', '5': 'hk-dirMark5', L: 'hk-cameraLock', Q: 'hk-feed', T: 'hk-specNextTop', R: 'hk-prevServer' };
  check('saved keys on the removed director commands and the previous server are free again, the others stay', rctx.lmRenameOldHotkeys(map) === true && JSON.stringify(map) === JSON.stringify({ Q: 'hk-feed', T: 'hk-specNextTop' }));
  const exp = vm.runInContext('LM_EXPORT_KEYS', (() => { const c = { console }; vm.createContext(c); vm.runInContext(cut('var LM_EXPORT_KEYS = [', '];') + '];', c); return c; })());
  check('settings export: no director configuration', !exp.some(e => /^lm-director/.test(e.key)));
  check('the director module is not loaded any more', main.indexOf('modules/director.js') < 0 && !fs.existsSync(path.join(root, 'ogario', 'modules', 'director.js')));
  const ln = main.split(/\r?\n/).find(l => l.indexOf("'lm-director-watch'") >= 0 && l.indexOf('removeItem') >= 0);
  const sctx = { localStorage: makeStorage() };
  ['lm-director', 'lm-director-bookmarks', 'lm-director-watch', 'lmHudLayouts'].forEach(k => sctx.localStorage.setItem(k, '{}'));
  vm.createContext(sctx);
  if (ln) vm.runInContext(ln, sctx);
  check('startup: the director\'s saved camera settings, bookmarks and watchlist are deleted, other data stays',
    !!ln && ['lm-director', 'lm-director-bookmarks', 'lm-director-watch'].every(k => sctx.localStorage.getItem(k) === null) && sctx.localStorage.getItem('lmHudLayouts') === '{}');
}
{ // Expanding Land minimap click, with the real defaults (no option to turn on)
  const app = vm.runInContext('({' + method('_lmMmSpecPE') + ',' + method('_lmMmSpecClick') + '})', ctx);
  const listeners = {}, st = {};
  const mm = { style: { getPropertyPriority: () => '', set pointerEvents(v) { st.pe = v; }, get pointerEvents() { return st.pe; }, cursor: '' }, addEventListener(t, f) { listeners[t] = f; } };
  ctx.document = { getElementById: id => (id === 'minimap-hud' ? mm : null), createElement() { created++; return { style: {} }; } };
  const lm = makeLM({ isLegendWorld: true, _isWorldSpectating: true, mapSize: 10000, mapMinX: -5000, mapMaxX: 5000, mapMinY: -5000, mapMaxY: 5000, viewX: 500, viewY: -200 });
  ctx.ogario = { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0 };
  ctx.defaultSettings.miniMapWidth = 218; ctx.defaultSettings.miniMapTop = 0;
  app.miniMap = { width: 218, height: 218, getBoundingClientRect: () => ({ left: 0, top: 0, width: 218, height: 218 }) };
  app._lmMmSpecPE();
  check('World Spectate on Expanding Land: the minimap takes the mouse (no option needed)', st.pe === 'auto' && typeof listeners.click === 'function', st.pe);
  /* world (2000, 3000) is at 9.5 + 2000 * 200 / 10000 = 49.5, 9.5 + 60 = 69.5 on the minimap */
  if (listeners.click) listeners.click({ clientX: 49.5, clientY: 69.5 });
  check('a minimap click moves the World Spectate camera there', Math.abs(lm._worldSpecPanX - 1500) < 1e-6 && Math.abs(lm._worldSpecPanY - 3200) < 1e-6, [lm._worldSpecPanX, lm._worldSpecPanY].join(','));
  lm._isWorldSpectating = false;
  app._lmMmSpecPE();
  check('out of World Spectate the minimap lets the mouse through again', st.pe === '');
}

if (fail) { console.log(fail + ' check(s) FAILED'); process.exit(1); }
console.log('all spectate follow checks passed');
