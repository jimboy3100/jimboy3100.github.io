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
  vm.runInContext('var lmMultiboxControlledPlayer = function () { return 0; }; var _L = {' + lmBlock + ', sendAction: function (o) { _sent.push(o); } };', ctx);
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

// ── held Feed and a death: the death's scope decides (a connected but dead unit kept it feeding)
let stops = 0;
ctx.feedStop = () => { stops++; };
vm.runInContext(body(mob, 'function feedDeath('), ctx);
ctx.legendmod = { multiBoxPlayerExists: true };
ctx.feedDeath({ unit: 0, scope: 'all' });
check('game over (scope all) with a dead unit still connected: the held Feed stops', stops === 1, stops);
ctx.feedDeath({ unit: 0, scope: 'unit' });
check('main player died, a unit still plays (scope unit): the held Feed goes on', stops === 1, stops);
ctx.legendmod = { multiBoxPlayerExists: false };
ctx.feedDeath({ unit: 0, scope: 'all' });
check('no multibox: a death stops it as before', stops === 2, stops);

// ── multibox indicator: the number of the player you control, not "P2" for every unit
const mbNo = body(mob, 'function mbPlayerNo() {');
vm.runInContext((mbNo || '') + '\n' + body(mob, 'function syncMbIndicator() {') + '\nvar bMb = { textContent: "", style: {} }, _mbShown = null;', ctx);
const ind = (enabled, list) => { ctx.multiboxPlayerEnabled = enabled; ctx.spects = list; ctx.legendmod = { multiBoxPlayerExists: true }; vm.runInContext('syncMbIndicator()', ctx); return vm.runInContext('bMb.textContent', ctx); };
const spec = (n) => ({ number: n, player: false }), unit = (n) => ({ number: n, player: true });
check('two players, main controlled: P1', ind(null, [unit(1)]) === 'P1');
check('two players, the unit controlled: P2 (also when a Full Map spectator took number 1)', ind(1, [unit(1)]) === 'P2' && ind(2, [spec(1), unit(2)]) === 'P2');
check('three players: the second unit (number 5) is P3, not P2', ind(5, [spec(1), unit(2), spec(3), unit(5)]) === 'P3', ind(5, [spec(1), unit(2), spec(3), unit(5)]));

console.log(fail ? fail + ' check(s) failed' : 'all phone extras checks passed');
process.exit(fail ? 1 : 0);
