/* Phone extras brought back (LMmobile/LMmobile.js), with the real code in a vm:
 *   - gear panel prefs: Short vibration on Split / Feed (tapHaptic), Free spectate button and
 *     Joystick opacity (20-100 %) are read from lm-mobile-prefs again with their old defaults; the
 *     Dead zone stays removed (a saved value is skipped, always 8 px)
 *   - the Free spectate button: from the follow camera and from Expanding Land World Spectate it
 *     switches to free spectate (real sendSpectate / sendFreeSpectate / _lmSpecFree of ogario.v4.js;
 *     from World Spectate a plain Q went to the follow camera), a second tap ends it
 *   - the replay rewind / forward buttons seek Replay Studio 250 packets back / on (real
 *     lmReplaySeek), only while a replay plays
 * node developers/tests/phoneextras.js   (LM_ROOT=<other checkout> runs it on another version) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const mob = fs.readFileSync(path.join(root, 'LMmobile', 'LMmobile.js'), 'utf8');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
const cutIn = (src, a, b, name) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ' + name + ': ' + a); return src.slice(i, j); };
/* a function or object-literal method: from `head` to its closing brace (braces outside comments / strings) */
const body = (src, head) => {
  const i = src.indexOf(head);
  if (i < 0) return null;
  let d = 0, k = src.indexOf('{', i + head.length - 1);
  for (; k < src.length; k++) {
    const ch = src[k], nx = src[k + 1];
    if (ch === '/' && nx === '/') { k = src.indexOf('\n', k); continue; }
    if (ch === '/' && nx === '*') { k = src.indexOf('*/', k + 2) + 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { for (k++; k < src.length && src[k] !== ch; k++) if (src[k] === '\\') k++; continue; }
    if (ch === '{') d++; else if (ch === '}' && !--d) break;
  }
  return src.slice(i, k + 1);
};
const store = new Map();
const ctx = { console, JSON, Math, Object, Number, isFinite, setTimeout(f) { f(); },
  localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) } };
ctx.window = ctx;
vm.createContext(ctx);

// ── prefs
vm.runInContext(cutIn(mob, "var PREF_KEY = 'lm-mobile-prefs';", '        function savePrefs', 'LMmobile.js'), ctx);
const P = () => vm.runInContext('prefs', ctx);
check('defaults: tap vibration off, Free spectate button off, joystick opacity 100 %, no dead zone pref',
  P().tapHaptic === false && P().freeSpecBtn === false && P().jsOpacity === 1 && !('joystickDeadZone' in P()), JSON.stringify(P()));
store.set('lm-mobile-prefs', JSON.stringify({ tapHaptic: true, freeSpecBtn: 1, jsOpacity: '0.45', joystickDeadZone: 30 }));
vm.runInContext('readPrefs()', ctx);
check('saved values are read again (tapHaptic, freeSpecBtn, jsOpacity 0.45); a saved dead zone is skipped',
  P().tapHaptic === true && P().freeSpecBtn === true && P().jsOpacity === 0.45 && !('joystickDeadZone' in P()), JSON.stringify(P()));
store.set('lm-mobile-prefs', JSON.stringify({ jsOpacity: 0.05 }));
vm.runInContext('readPrefs()', ctx);
check('joystick opacity is kept within its slider (20 %)', P().jsOpacity === 0.2 && P().tapHaptic === false, P().jsOpacity);
check('the joystick always ignores the first 8 px (no slider)', /if \(rawD < 8\) return;/.test(mob) && mob.indexOf("id=\"lm-dz\"") < 0);
check('Split and Feed vibrate 10 ms with the option on', (mob.match(/if \(prefs\.tapHaptic\) vibrate\(10\);/g) || []).length === 2);

// ── joystick opacity
vm.runInContext(body(mob, 'function joystickLook() {'), ctx);
ctx.jO = { style: { width: '', height: '', opacity: '' } }; ctx.jI = { style: { width: '', height: '', opacity: '' } };
vm.runInContext('prefs.jsSize = 1; prefs.jsOpacity = 0.5; joystickLook()', ctx);
check('Joystick opacity 50 %: ring and knob drawn at 0.5', ctx.jO.style.opacity === '0.5' && ctx.jI.style.opacity === '0.5', ctx.jO.style.opacity);
vm.runInContext('prefs.jsOpacity = 1; joystickLook()', ctx);
check('at 100 % the stylesheet opacity, as before', ctx.jO.style.opacity === '' && ctx.jI.style.opacity === '');

// ── Free spectate button with the real spectate code
vm.runInContext(body(mob, 'function freeSpecToggle(L) {'), ctx);
const lmBlock = ['sendSpectate() {', 'sendFreeSpectate() {', '_lmSpecFree() {'].map(h => {
  const b = body(main, '\n        ' + h);
  if (!b) throw new Error('missing ' + h);
  return b.trim();
}).join(',\n');
const mkLM = (st) => {
  ctx._sent = [];
  vm.runInContext('var lmMultiboxControlledPlayer = function () { return 1; }; var _L = {' + lmBlock + ', sendAction: function (o) { _sent.push(o); } };', ctx);
  return Object.assign(vm.runInContext('_L', ctx), { play: false, isFreeSpectate: false, isSpectateEnabled: false, _isWorldSpectating: false, isLegendWorld: false, serverType: 'agario' }, st);
};
let L = mkLM({ isSpectateEnabled: true });
ctx.freeSpecToggle(L);
check('follow camera: a tap starts free spectate (opcode 18)', L.isFreeSpectate === true && ctx._sent.join() === '18', ctx._sent.join());
ctx.freeSpecToggle(L);
check('a second tap ends it', L.isFreeSpectate === false && ctx._sent.join() === '18,18', ctx._sent.join());
L = mkLM({ isLegendWorld: true, _isWorldSpectating: true, serverType: 'legendworld' });
ctx.freeSpecToggle(L);
check('Expanding Land World Spectate: Spectate then free spectate (was: the follow camera only)',
  L.isFreeSpectate === true && L._isWorldSpectating === false && ctx._sent.join() === '1,18', ctx._sent.join() + ' free=' + L.isFreeSpectate);
L = mkLM({ isFreeSpectate: true, _lmSpecLb: 3 });
ctx.freeSpecToggle(L);
check('in free spectate a tap ends it and its follow', L.isFreeSpectate === false && L._lmSpecLb === null && ctx._sent.join() === '18');
L = mkLM({});
ctx.freeSpecToggle(L);
check('not spectating (menu): the plain toggle, as the menu button', L.isFreeSpectate === true && ctx._sent.join() === '18');

// ── replay rewind / forward
vm.runInContext(cutIn(main, 'function lmReplayActive() {', 'window.lmReplayTogglePause = lmReplayTogglePause;', 'ogario.v4.js'), ctx);
const cmds = [];
let driving = true;
ctx.LMReplayStudio = { isDriving: () => driving, command: (c, a) => { cmds.push(c + ' ' + a); return true; } };
ctx.toastr = { info() { } }; ctx.lmT = k => k;
const mkBtn = () => { const h = {}; return { h, addEventListener: (t, f) => { h[t] = f; } }; };
ctx.bRwd = mkBtn(); ctx.bFwd = mkBtn();
let shown = true;
ctx.replayBarShown = () => shown;
vm.runInContext(body(mob, '[[bRwd, -250], [bFwd, 250]].forEach(function (r) {') + ');', ctx);
const ev = { preventDefault() { }, stopPropagation() { } };
ctx.bRwd.h.touchstart(ev); ctx.bFwd.h.touchstart(ev);
check('rewind / forward seek Replay Studio 250 packets back / on', cmds.join() === 'seek -250,seek 250', cmds.join());
shown = false;
ctx.bRwd.h.touchstart(ev);
check('no seek without a replay playing', cmds.length === 2);
const sync = body(mob, 'function syncAiPause() {');
check('the buttons show only while the replay bar shows', !!sync && /bRwd\.style\.display = rd; bFwd\.style\.display = rd;/.test(sync));

// ── held Feed and a death (LMEvents playerDied): the death of the player you control or the game
// over ends it, another player's death while you steer a living one does not
let stops = 0;
ctx.feedStop = () => { stops++; };
vm.runInContext(body(mob, 'function feedDeath('), ctx);
check('the held Feed listens to the deaths of all players (playerDied), not the main-only death',
  /\('playerDied', feedDeath\)/.test(mob) && !/\('death', feedDeath\)/.test(mob));
ctx.legendmod = { multiBoxPlayerExists: true };
ctx.feedDeath({ slot: 1, role: 'main', active: false, scope: 'all' });
check('game over (scope all) with a dead unit still connected: the held Feed stops', stops === 1, stops);
ctx.feedDeath({ slot: 1, role: 'main', active: false, scope: 'unit' });
check('main player died while you steer a living unit: the held Feed goes on', stops === 1, stops);
ctx.feedDeath({ slot: 3, role: 'unit', active: true, scope: 'unit' });
check('the unit you control (P3) dies, the main player still plays: the held Feed stops', stops === 2, stops);
ctx.feedDeath({ slot: 1, role: 'main', active: true, scope: 'unit' });
check('the main player you control dies, a unit still plays: the held Feed stops', stops === 3, stops);
ctx.feedDeath({ slot: 2, role: 'unit', active: false, scope: 'unit' });
check('a background unit dies: the held Feed goes on', stops === 3, stops);
ctx.legendmod = { multiBoxPlayerExists: false };
ctx.feedDeath({ slot: 1, role: 'main', active: true, scope: 'all' });
check('no multibox: a death stops it as before', stops === 4, stops);

// ── held Feed and a multibox switch, with the game's real macro feed (application.macroFeed,
// window.core.act): a held E stays with the player it started on, the phone's Feed button keeps
// following the player you control (its own death / server change listeners end it)
{
  let fnow = 0, frames = [];
  const fctx = { Math, Number, performance: { now: () => fnow }, defaultmapsettings: { macroFeeding: 10 }, spects: [] };
  fctx.window = fctx;
  fctx.requestAnimationFrame = (f) => { frames.push(f); return frames.length; };
  fctx.cancelAnimationFrame = () => { frames = []; };
  fctx.setInterval = () => 1; fctx.clearInterval = () => { };
  vm.createContext(fctx);
  const mainLf = main.replace(/\r\n/g, '\n');
  const ca = mainLf.indexOf('\n        act(m, bound) {'), cb = mainLf.indexOf('\n        specialOn() {', ca);
  const parts = ['function getActiveSpect(', 'function lmActiveUnit(', '        feed(bound) {', '        _lmFeedTick(bind, mode) {', '        macroFeed(on) {', '        _lmLifeInputEnd('].map((h) => body(mainLf, h));
  const fs2 = [body(mob, 'function feedStart() {'), body(mob, 'function feedStop() {')];
  if (ca < 0 || cb < 0 || parts.concat(fs2).some((p) => !p)) check('feed code found', false);
  else {
    vm.runInContext(parts[0] + '\n' + parts[1] + '\nwindow.core = {' + mainLf.slice(ca, cb) + '\n};\nvar application = window.application = {\n' + parts.slice(2).join(',\n') + '\n};\n' +
      'var feedIv = null, feedMacroOn = false;\nfunction feedWatch() { }\nfunction emitKey() { }\n' + fs2.join('\n') + '\nwindow._lmMobileFeedHeld = function () { return feedMacroOn; };\nwindow._lmMobileFeedStop = feedStop;\n' +
      'var ogario = {};\nfunction resetonkeydown() { }\nfunction $() { return { hide: function () { } }; }', fctx);
    const sent = [];
    const p = (name, o) => Object.assign({ socket: { readyState: 1, OPEN: 1 }, isSocketOpen() { return true; }, sendEject() { sent.push(name); } }, o);
    fctx.legendmod = p('main', { play: true, _connectSeq: 1 });
    fctx.spects.push(p('unit', { number: 2, player: true, active: true, connectionGeneration: 1, playerCellIDs: [1] }));
    fctx.application._lmLifeStartAt = 1;
    const frame = (t) => { while (fnow < t) { fnow += 16; const f = frames; frames = []; f.forEach((cb2) => cb2(fnow)); } };
    const n = (who) => sent.filter((s) => s === who).length;
    vm.runInContext('feedStart()', fctx); frame(100);
    fctx.multiboxPlayerEnabled = 2; frame(300);
    check('phone Feed held across a switch: it feeds the player switched to (its old behaviour)', n('main') >= 5 && n('unit') >= 5, n('main') + '/' + n('unit'));
    vm.runInContext('feedStop()', fctx); sent.length = 0; frame(500);
    check('phone Feed let go: no more feeding', sent.length === 0 && !fctx.application.macroFeedActive, sent.length);
    fctx.multiboxPlayerEnabled = null;
    fctx.application.macroFeed(true); frame(700);
    fctx.multiboxPlayerEnabled = 2; frame(900);
    check('held E (no phone button) across the same switch: the unit is not fed', n('main') >= 5 && n('unit') === 0 && !fctx.application.macroFeedActive, n('main') + '/' + n('unit'));
    /* the unit the held Feed feeds leaves (a removed or closed unit) with its number still in the
     * focus: lmActiveUnit gives the main player then; the held Feed is not moved to it, it feeds
     * nobody until the focus names a player again */
    fctx.multiboxPlayerEnabled = 2; sent.length = 0;
    vm.runInContext('feedStart()', fctx); frame(1100);
    const gone = fctx.spects.pop();
    const m0 = n('main'), u0 = n('unit'); frame(1400);
    check('phone Feed held on a unit that leaves, its number still selected: nothing fed, P1 not in its place, still held', u0 >= 5 && n('main') === m0 && n('unit') === u0 && fctx.application.macroFeedActive, n('main') - m0);
    fctx.multiboxPlayerEnabled = null; frame(1700);
    check('    ... the focus on P1 again: it feeds P1', n('main') >= m0 + 5, n('main') - m0);
    fctx.spects.push(gone);
    /* the end of the life of the player you control: by a death the phone's own listener ends it
     * (feedDeath above), _lmLifeInputEnd() leaves it; by a lost socket, a removal, Multibox off
     * (_lmLifeInputEnd(true)) it ends here: the player the focus goes to is not fed */
    fctx.application._lmLifeInputEnd();
    check('_lmLifeInputEnd() (a death): the phone Feed is left to its own death listener', fctx._lmMobileFeedHeld() && fctx.application.macroFeedActive);
    fctx.application._lmLifeInputEnd(true); fctx.multiboxPlayerEnabled = null;
    const m1 = n('main'); frame(2000);
    check('_lmLifeInputEnd(true) (the unit you control lost its socket / was removed): the phone Feed ends, P1 the focus went to is not fed',
      !fctx._lmMobileFeedHeld() && !fctx.application.macroFeedActive && n('main') === m1, n('main') - m1);
  }
  /* no simulated W key loop any more: without the game's macroFeed the button starts nothing */
  if (fs2.every(Boolean)) {
    const nctx = { timers: 0, keys: 0 };
    nctx.setInterval = () => { nctx.timers++; return 1; }; nctx.clearInterval = () => { };
    nctx.document = { dispatchEvent() { nctx.keys++; } };
    vm.createContext(nctx);
    vm.runInContext('var application = {}, feedMacroOn = false;\nfunction feedWatch() { }\nfunction emitKey() { document.dispatchEvent(); }\n' + fs2.join('\n') + '\nfeedStart(); feedStop();', nctx);
    check('phone Feed without macroFeed: no 50 ms key loop, no key events', nctx.timers === 0 && nctx.keys === 0, nctx.timers + '/' + nctx.keys);
  }
}

// ── multibox indicator: the number of the player you control, not "P2" for every unit
const mbNo = body(mob, 'function mbPlayerNo() {');
vm.runInContext((mbNo || '') + '\n' + body(mob, 'function syncMbIndicator() {') + '\nvar bMb = { textContent: "", style: {} }, _mbShown = null;', ctx);
const ind = (enabled, list) => { ctx.multiboxPlayerEnabled = enabled; ctx.spects = list; ctx.legendmod = { multiBoxPlayerExists: true }; vm.runInContext('syncMbIndicator()', ctx); return vm.runInContext('bMb.textContent', ctx); };
const spec = (n) => ({ number: n, player: false }), unit = (n) => ({ number: n, player: true });
check('two players, main controlled: P1', ind(null, [unit(1)]) === 'P1');
check('two players, the unit controlled: P2 (also when a Full Map spectator took number 1)', ind(1, [unit(1)]) === 'P2' && ind(2, [spec(1), unit(2)]) === 'P2');
check('three players: the second unit (number 5) is P3, not P2', ind(5, [spec(1), unit(2), spec(3), unit(5)]) === 'P3', ind(5, [spec(1), unit(2), spec(3), unit(5)]));
/* units in player slots (lmMbPlayers): the slot, also after P3 was removed (P4 stays P4), and the slot's colour */
{
  const u4 = { number: 9, player: true, slotId: 4 };
  ctx.lmMbPlayers = { bySource: new Map([[9, u4]]) };
  ctx.LM_MB_RING_DEFAULT_COLORS = { 1: '#FF2FD6', 2: '#00E5FF', 3: '#A855F7', 4: '#10B981' };
  check('slots: P4 stays P4 when P3 is gone, its border in the P4 colour', ind(9, [unit(2), u4]) === 'P4' && vm.runInContext('bMb.style.borderColor', ctx) === '#10B98199');
  check('slots: the main player P1 in its colour', ind(null, [unit(2), u4]) === 'P1' && vm.runInContext('bMb.style.borderColor', ctx) === '#FF2FD699');
  delete ctx.lmMbPlayers; delete ctx.LM_MB_RING_DEFAULT_COLORS;
}

// ── decision 8: the phone buttons while the main player (P1) is dead or spectating. The real Split,
// 2x, 16x and Feed touch handlers of LMmobile.js on the real actions (developers/tests/lib/mbaction.js):
// a living multibox unit you selected gets from each button exactly what P1 gets while it plays; a
// selected unit that is dead or on a closed socket gets nothing (nor P1); the open menu blocks them
// as before. A tap on the game while P1 spectates is no follow pick then (it moved the unit's aim).
{
  const { world } = require('./lib/mbaction.js');
  const W = world();
  const h = (name) => { const b = body(mob, name + ".addEventListener('touchstart', function (e) {"); return b ? b + ');' : null; };
  const parts = [h('bSplit'), h('bDbl'), h('b16'), h('bFeed'), body(mob, "bFeed.addEventListener('touchend', function (e) {"),
    cutIn(mob, '        var lastActionByKey = {};', '        /* ═══', 'LMmobile.js'), body(mob, 'function feedStart() {'), body(mob, 'function feedStop() {')];
  if (W.missing || parts.some((p) => !p)) check('phone button / action code found', false);
  else {
    const c = W.ctx, btn = (n) => ({ n, h: {}, addEventListener(t, f) { this.h[t] = f; } });
    Object.assign(c, { bSplit: btn('split'), bDbl: btn('dbl'), b16: btn('16'), bFeed: btn('feed'), prefs: { tapHaptic: false }, vibrate() { } });
    let clock = 0;
    c.Date = { now: () => (clock += 1000) }; /* each tap past the buttons' debounce */
    vm.runInContext('var feedMacroOn = false;\nfunction feedWatch() { }\nfunction isMenuVisible() { return !!window._menu; }\n' + parts.slice(5).join('\n') +
      '\nwindow._lmMobileFeedHeld = function () { return feedMacroOn; };\n' + parts.slice(0, 4).join('\n') + '\n' + parts[4] + ');', c);
    const ev = { preventDefault() { }, stopPropagation() { }, targetTouches: [] };
    const tap = (b) => { c[b].h.touchstart(ev); if (b === 'bFeed') { W.advance(100); c.bFeed.h.touchend(ev); } W.advance(2000); };
    for (const b of ['bSplit', 'bDbl', 'b16', 'bFeed']) {
      W.state({ main: 'alive', focus: 0 }); tap(b); const ref = W.kinds('main');
      const got = ['dead', 'spectating'].map((m) => { W.state({ main: m, focus: 2 }); tap(b); return W.kinds('u2') === ref && W.count('main') === 0; });
      const none = ['dead', 'stale'].map((u) => { W.state({ main: 'dead', unit: u, focus: 2 }); tap(b); return W.log.length === 0; });
      check('phone ' + c[b].n + ' button, P1 dead / spectating, living P2 selected: P2 gets what P1 gets; P2 dead / closed socket: nothing',
        ref.length > 0 && got.every(Boolean) && none.every(Boolean), ref);
    }
    W.state({ main: 'dead', focus: 2 }); c._menu = true; tap('bSplit'); tap('bFeed');
    check('phone buttons with the menu open: nothing, also for a living P2', W.log.length === 0);
    const canvas = { tagName: 'CANVAS', closest: () => null };
    W.state({ main: 'spectating', focus: 2 }); let picked = 0; W.lm()._lmSpecCellPick = () => { picked++; };
    const taken = W.lm()._lmSpecClickAt(canvas, 300, 200);
    check('P1 spectating, living P2 selected: a tap on the game is no follow pick (the aim of P2 stays)', taken === false && picked === 0 && !W.lm()._cursorCalls && W.lm().clientX === 0);
    picked = 0; W.state({ main: 'spectating', focus: 0 }); W.lm()._lmSpecCellPick = () => { picked++; };
    check('P1 spectating, no unit selected: a tap still picks the player to follow', W.lm()._lmSpecClickAt(canvas, 300, 200) === true && picked === 1);
  }
}

console.log(fail ? fail + ' check(s) failed' : 'all phone extras checks passed');
process.exit(fail ? 1 : 0);
