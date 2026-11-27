/* Play buttons wait for a working server, with the real code of ogario.v4.js (lmPlayBlockReason,
 * lmPlayGate): fake main sockets and world update times; disabled (never hidden) with the reason
 * as title, enabled again the moment the server works; no false "not working" for replays,
 * Practice, other servers' silence, Battle Royale, a slow server or a tab just shown again.
 * node developers/tests/playgate.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return main.slice(i, j + b.length); };
let fail = 0;
const check = (n, c, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || extra === undefined ? '' : '  -> ' + JSON.stringify(extra))); if (!c) fail++; };

/* fake buttons and a tiny jQuery for the selector lmPlayGate uses */
function btn(cls, inToast) {
  const a = {};
  return { cls, inToast, disabled: false, title: '', style: {},
    setAttribute(k, v) { a[k] = String(v); if (k === 'title') this.title = String(v); },
    hasAttribute(k) { return k in a; }, getAttribute(k) { return k in a ? a[k] : null; },
    removeAttribute(k) { delete a[k]; if (k === 'title') this.title = ''; } };
}
const buttons = [btn('btn-play'), btn('btn-play-guest'), btn('btn-login-play'), btn('btn-spectate'), btn('btn-play', true)];
let queries = 0;
const $ = (x) => {
  if (typeof x === 'string') { queries++; return { each(fn) { buttons.forEach((b) => fn.call(b)); } }; }
  return { closest() { return { length: x.inToast ? 1 : 0 }; } };
};
let now = 0;
const ctx = { console, String, $, performance: { now: () => now }, lmT: (k) => 'T:' + k };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cut('function lmPlayBlockReason(LM, now, master) {', '\n}') + '\n' +
  cut('var _lmPlayOff = null;', 'window.lmPlayGate = lmPlayGate;'), ctx);
const R = (lm, t, master) => ctx.lmPlayBlockReason(lm, t, master);
const nd = (o) => Object.assign({ live: true, t0: 0, wMsgAt: 0, hidden: false, visAt: -1e9 }, o);
const conn = (rs, o) => Object.assign({ socket: { readyState: rs }, ws: 'wss://live-arena-x.agar.io:443', serverType: 'agario', gameMode: ':ffa', _lmND: nd() }, o);

/* the signal */
check('nothing chosen (no connection / no socket): not judged', R(null, 0) === '' && R({ socket: null, ws: null }, 0) === '');
check('socket opening: connecting', R(conn(0), 0) === 'connecting');
check('socket closing / closed: closed', R(conn(2), 0) === 'closed' && R(conn(3), 0) === 'closed');
check('agar.io open, first 3 s without a world update: still playable', R(conn(1), 2900) === '');
check('agar.io open, no world update for over 3 s since opening: stalled', R(conn(1), 3100) === 'stalled');
check('agar.io: a world update 0.5 s ago: works', R(conn(1, { _lmND: nd({ wMsgAt: 2600 }) }), 3100) === '');
let slow = true;
for (let t = 2500; t <= 30000; t += 100) if (R(conn(1, { _lmND: nd({ wMsgAt: Math.floor(t / 2500) * 2500 }) }), t) !== '') slow = false;
check('a slow but working server (a world update every 2.5 s) is never stalled', slow);
check('updates stopped for 3 s mid-game: stalled; resumed: works', R(conn(1, { _lmND: nd({ wMsgAt: 10000 }) }), 13100) === 'stalled' && R(conn(1, { _lmND: nd({ wMsgAt: 13050 }) }), 13100) === '');
check('private / Expanding Land server silent while open: not judged (some send nothing before a spawn)', R(conn(1, { serverType: 'expandingland', ws: 'wss://x.expanding.land' }), 60000) === '');
check('Expanding Land closed: closed', R(conn(3, { serverType: 'expandingland' }), 0) === 'closed');
check('Battle Royale silent: not judged', R(conn(1, { gameMode: ':battleroyale' }), 60000) === '');
check('tab hidden, or shown again under 3 s ago: not judged', R(conn(1, { _lmND: nd({ hidden: true }) }), 60000) === '' && R(conn(1, { _lmND: nd({ visAt: 58000 }) }), 60000) === '' && R(conn(1, { _lmND: nd({ visAt: 50000 }) }), 60000) === 'stalled');
check('connection ended (diagnostics not live) while open: not judged', R(conn(1, { _lmND: nd({ live: false }) }), 60000) === '');
check("master's \"no server found\": Play stays (it retries)", R(conn(3), 0, { _lmFindGaveUp: true }) === '');
check('replay address / Practice stand-in socket: not judged', R(conn(3, { ws: 'imsolo.pro.replay' }), 0) === '' && R(conn(1, { socket: { readyState: 1, _lmPractice: true } }), 60000) === '');
ctx._lmEvReplayOn = true; check('a replay plays: not judged', R(conn(3), 0) === ''); ctx._lmEvReplayOn = false;
ctx.LMPractice = { on: true }; check('Practice on: not judged', R(conn(3), 0) === ''); ctx.LMPractice = null;

/* the buttons */
const menu = buttons.slice(0, 4), toast = buttons[4];
ctx.legendmod = conn(1, { _lmND: nd({ wMsgAt: 0 }) });
now = 1000;
check('first frame, server works: enabled', ctx.lmPlayGate(false) === '' && menu.every((b) => !b.disabled && !b.title));
const q0 = queries;
for (let i = 0; i < 50; i++) ctx.lmPlayGate(false);
check('frames without a change touch no button', queries === q0);
ctx.legendmod.socket.readyState = 3;
ctx.lmPlayGate(false);
check('socket closed: all four menu play buttons disabled with the reason', menu.every((b) => b.disabled && b.title === 'T:pkg.playdis.closed' && b.getAttribute('data-i18n-title') === 'pkg.playdis.closed'));
check('a toast button with the same class is left alone', !toast.disabled && !toast.title);
ctx.legendmod = conn(0); ctx.lmPlayGate(false);
check('reconnecting: connecting', menu.every((b) => b.disabled && b.title === 'T:pkg.playdis.connecting'));
ctx.legendmod = conn(1, { _lmND: nd({ t0: 5000 }) }); now = 5100; ctx.lmPlayGate(false);
check('opened again: enabled at once, title removed', menu.every((b) => !b.disabled && !b.title && !b.hasAttribute('data-i18n-title')));
now = 8200; ctx.lmPlayGate(false);
check('no world update 3 s after opening: stalled', menu.every((b) => b.disabled && b.title === 'T:pkg.playdis.stalled'));
ctx.legendmod._lmND.wMsgAt = 8150; ctx.lmPlayGate(false);
check('a world update arrives: enabled again', menu.every((b) => !b.disabled && !b.title));
/* unlockButtons (after a death) enables, then forces the gate: stays off while the server does not work */
ctx.legendmod.socket.readyState = 3; ctx.lmPlayGate(false);
menu.forEach((b) => { b.disabled = false; }); ctx.lmPlayGate(true);
check('forced (unlockButtons) while closed: disabled again', menu.every((b) => b.disabled));
const keep = btn('btn-play'); keep.setAttribute('title', 'own'); buttons.push(keep);
ctx.legendmod.socket.readyState = 1; ctx.legendmod._lmND.wMsgAt = now; ctx.lmPlayGate(false);
check("enabling leaves a title it did not set", keep.title === 'own' && !keep.disabled);

console.log(fail ? 'FAILED: ' + fail : 'all playgate checks passed');
process.exit(fail ? 1 : 0);
