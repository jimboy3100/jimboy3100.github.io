/* Connection drops and replays (ogario/ogario.v4.js, ogario/ogario.v4.master.js):
 * 1. a server picked while a private-server auto-reconnect is pending (account-domain logout
 *    wait of 500 ms) is the one joined, not the old server;
 * 2. after agar.io reconnects give up, Play is enabled and reconnects;
 * 3. private-server retries last about 2 minutes, and the network coming back ('online')
 *    reopens the server after the retries gave up;
 * 4. the late error/close of the replay URL socket does not wipe a playing replay;
 * 5. text typed into the Join box does not stop the live recording.
 * The real LM.connect, _finishConnect, onClose, closeConnection, the 'online' listener,
 * master.onDisconnect / onConnect / setNick, lmPlayBlockReason and the recording step of
 * _lmHandlePacket run with stubs and a fake clock.
 * node developers/tests/reconnect.js */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const msrc = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.master.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : ' (' + info + ')')); if (!c) fail++; };
const cut = (s, from, to) => { const a = s.indexOf(from), b = a < 0 ? -1 : s.indexOf(to, a + from.length); if (a < 0 || b < 0) throw new Error('code not found: ' + from.trim()); return s.slice(a, b).replace(/,\s*$/, ''); };

/* ---- LM connection methods in a stubbed scope ---- */
const methods = [
    cut(src, '        connect(t) {\n', '        onOpen() {'),
    cut(src, '        onClose(t) {\n', '        replayfunctions() {'),
    cut(src, '        closeConnection() {\n            /* P1 fix', '        isSocketOpen() {')
].join(',\n');
const onlineBody = (function () {
    const a = src.indexOf("    window.addEventListener('online', function () {\n", src.indexOf('    window.legendmod = LM;'));
    const b = src.indexOf('\n    });', a);
    if (a < 0 || b < 0) throw new Error("code not found: 'online' listener");
    return src.slice(src.indexOf('{', a + 40) + 1, b);
})();
function mkStub() {
    const f = function () { return p; };
    const p = new Proxy(f, { get: (t, k) => k === Symbol.toPrimitive ? () => '' : k === 'length' ? 1 : k === 'then' ? undefined : p, set: () => true, apply: () => p });
    return p;
}
function world(opts) {
    const stub = mkStub();
    const w = { now: 0, timers: [], tid: 0, sockets: [], logouts: [], flushes: [] };
    const setTimeout_ = (fn, ms) => { const id = ++w.tid; w.timers.push({ id, fn, at: w.now + (ms || 0) }); return id; };
    const clearTimeout_ = (id) => { const i = w.timers.findIndex(x => x.id === id); if (i >= 0) w.timers.splice(i, 1); };
    w.run = (t) => { for (; ;) { w.timers.sort((x, y) => x.at - y.at); if (!w.timers.length || w.timers[0].at > t) break; const x = w.timers.shift(); w.now = x.at; x.fn(); } w.now = t; };
    class WS { constructor(u) { this.url = u; this.readyState = 0; w.sockets.push(this); } send() { } close() { this.readyState = 3; } }
    WS.CONNECTING = 0; WS.OPEN = 1; WS.CLOSING = 2; WS.CLOSED = 3;
    let LM;
    const win = new Proxy({ agarioUID: opts.loggedIn ? 'uid' : '', expandingLandUID: '', logout: () => w.logouts.push(w.now), _lmReplayQuiet: false, master: undefined,
        core: { connect: (u) => LM.connect(u) } }, { get: (t, k) => k in t ? t[k] : stub, set: (t, k, v) => { t[k] = v; return true; } });
    const base = { window: win, WebSocket: WS, setTimeout: setTimeout_, clearTimeout: clearTimeout_, setInterval: () => 0, clearInterval: () => { },
        console: { log() { }, warn() { }, error() { } }, Date: { now: () => w.now }, Math: Object.assign(Object.create(Math), { random: () => 0.5 }),
        Object, Array, String, Number, Boolean, JSON, parseInt, URL, URLSearchParams, Promise, undefined, Error };
    const scope = new Proxy(base, { has: () => true, get: (t, k) => k === Symbol.unscopables ? undefined : (k in t ? t[k] : stub) });
    const noop = () => { };
    LM = Object.assign(new Function('scope', 'with (scope) { return ({' + methods + '}); }')(scope), {
        flushCellsData() { w.flushes.push(w.now); }, replayfunctions: noop, flushMegaFFAscore: noop,
        _lmResetFreezeDetector: noop, _lmNetDiagEnd: noop, createView: () => stub, sendMessage: noop, onOpen: noop, onMessage: noop,
        onError() { this.flushCellsData(); }, mapEvent: {}, decayInfo: {}
    });
    base.LM = LM;
    w.LM = LM;
    w.online = new Function('scope', 'with (scope) { return function () {' + onlineBody + '}; }')(scope);
    /* every socket opened from now on fails at once (network away) */
    w.failAll = () => { for (let i = 0; i < 30 && LM._reconnTimer; i++) { const t = w.timers.find(x => x.id === LM._reconnTimer); w.run(t.at); if (LM.socket && LM.socket.readyState === 0) { LM.socket.readyState = 3; LM.socket.onclose({ code: 1006 }); } } };
    return w;
}
const EL = 'wss://ffa.legendmod.ml:8080', AG = 'wss://live-arena-abcde.agar.io:443';

/* 1. agar.io picked during the logout wait while the old server's retry is pending */
(function () {
    const w = world({ loggedIn: true });
    w.LM.connect(EL); w.run(600);
    const s = w.LM.socket; s.readyState = 1;
    w.now = 10000; s.readyState = 3; s.onclose({ code: 1006 });
    const pending = !!w.LM._reconnTimer;
    w.run(10600); w.LM.connect(AG);
    w.run(13000);
    const after = w.sockets.slice(1).map(x => x.url);
    check('server picked during the logout wait: only it is opened, the old server\'s retry is dropped', pending && after.length === 1 && after[0] === AG && w.LM.ws === AG, JSON.stringify(after));
    w.online();
    check("'online' afterwards opens nothing", w.sockets.length === 2);
})();

/* 3. private server: retries last about 2 minutes; 'online' after the give-up reopens it */
(function () {
    const w = world({ loggedIn: false });
    w.LM.connect(EL); w.LM.socket.readyState = 1;
    w.now = 10000; w.LM.socket.readyState = 3; w.LM.socket.onclose({ code: 1006 });
    w.failAll();
    const gaveUpAfter = (w.now - 10000) / 1000;
    check('retries go on for about 2 minutes (gave up after ' + gaveUpAfter + ' s, ' + (w.sockets.length - 1) + ' tries)', gaveUpAfter >= 100 && !w.LM._reconnTimer, gaveUpAfter);
    w.now += 40000; const n = w.sockets.length; w.online();
    check("'online' after the give-up reopens the server once", w.sockets.length === n + 1 && w.LM.ws === EL && w.sockets[n].url === EL);
    w.online();
    check("a second 'online' while that socket connects opens nothing", w.sockets.length === n + 1);
    /* a give-up, then the player joins another server: 'online' leaves it alone */
    w.LM.socket.readyState = 3; w.LM.socket.onclose({ code: 1006 }); w.failAll();
    w.LM.connect('wss://imsolo.pro:2102/'); w.LM.socket.readyState = 3;
    const m = w.sockets.length; w.online();
    check("'online' never reopens a server the player has left", w.sockets.length === m);
})();

/* 4. replay URL: its socket's late error/close does not flush the replayed world */
(function () {
    const w = world({ loggedIn: false });
    w.LM.connect('wss://imsolo.pro.replay:2000');
    const s = w.LM.socket;
    w.flushes.length = 0;
    w.now = 700; s.readyState = 3; s.onerror({}); s.onclose({ code: 1006 });
    check('replay socket failing after playback started: no flush, no reconnect', w.flushes.length === 0 && !w.LM._reconnTimer, JSON.stringify(w.flushes));
    w.LM.connect(EL); const e = w.LM.socket; w.flushes.length = 0; e.readyState = 3; e.onerror({}); e.onclose({ code: 1006 });
    check('a real server failing still flushes and retries', w.flushes.length === 2 && !!w.LM._reconnTimer);
})();

/* 2. agar.io: after 8 failed reconnects Play is enabled and reconnects */
(function () {
    const od = cut(msrc, '        onDisconnect() {', '        recaptchaRequested() {');
    const oc = cut(msrc, '        onConnect() {', '        onDisconnect() {');
    const sn = cut(msrc, '        setNick() {', '/*\t\t\n        setNick() {');
    const pbr = cut(src, 'function lmPlayBlockReason(', '/* Applies lmPlayBlockReason');
    let now = 1e6; const timers = []; let reconnects = 0;
    const self = { core: { sendNick() { } }, legendmod: { serverType: 'agario' } };
    const window = { LMPractice: null };
    const master = new Function('self', 'window', 'Date', 'setTimeout', 'clearTimeout', 'console', 'toastr', '_lmMTag', '_lmMT', '$', 'fancyCount2',
        'return ({' + od + ',\n' + oc + ',\n' + sn + '});')(self, window, { now: () => now }, (f, t) => { timers.push({ f, at: now + t }); return timers.length; }, () => { }, { log() { }, warn() { }, error() { } },
        { error() { }, warning() { } }, () => '', (k, d) => d, () => ({ val: () => 'me' }), (s) => s.length);
    master.reconnect = () => { reconnects++; master._lastConnectAt = now; }; master.login = () => { }; master.connectionGeneration = 1; master.serverIP = 'x'; master._lastConnectAt = now;
    for (let i = 0; i < 9; i++) { master.onDisconnect(); timers.sort((a, b) => a.at - b.at); while (timers.length) { const t = timers.shift(); now = t.at; t.f(); } }
    const lmPlayBlockReason = new Function('window', pbr + '\nreturn lmPlayBlockReason;')(window);
    const LM = { socket: { readyState: 3 }, ws: 'wss://live-arena-x.agar.io', serverType: 'agario' };
    check('after the give-up the play buttons are enabled', lmPlayBlockReason(LM, 0, master) === '', lmPlayBlockReason(LM, 0, master));
    const r0 = reconnects; master.setNick();
    check('Play after the give-up reconnects once', reconnects - r0 === 1);
    master.setNick();
    check('the next Play does not reconnect again', reconnects - r0 === 1);
    for (let i = 0; i < 9; i++) { master.onDisconnect(); timers.sort((a, b) => a.at - b.at); while (timers.length) { const t = timers.shift(); now = t.at; t.f(); } }
    master.onConnect(); const r1 = reconnects; master.setNick();
    check('a server joined after the give-up: Play does not reconnect', reconnects === r1 && !master._lmFindGaveUp);
})();

/* 5. recording goes on while a replay token is typed into the Join box */
(function () {
    const a = src.indexOf('            var _recServerToken;'), b = src.indexOf('            var textDecoder = window._textDecoderSIMD', a);
    if (a < 0 || b < 0) throw new Error('code not found: recording step');
    const step = src.slice(a, b);
    /* the real writer (updateServerInfo's) and reader of the box */
    const tb = cut(src, 'function _lmSetTokenBox(sel, value) {', '/* The Private list entries');
    const rf = src.slice(src.indexOf('function lmRecRoom('), src.indexOf('\n}\n', src.indexOf('function lmRecRoom(')) + 3);
    const box = { value: '', _lmHeld: null, _lmTyped: false };
    const document = { getElementById: () => box, activeElement: null };
    const $ = () => ({ val: (v) => { if (v === undefined) return box.value; box.value = v; }, each: (fn) => fn.call(box) });
    const window = { RecordedProtocol: { 'ffa.legendmod.ml:8080': [] }, temporaryRecordedProtocol: 'ffa.legendmod.ml:8080', catholicCalculator: 0, _lmRecSlotBytes: 0, _lmRecFull: false, _lmRecChkAt: 1e9, _lmRecBudgetCheck() { }, _lmRecKeepLatest() { } };
    const f = new Function('window', '$', 'document', 'defaultmapsettings', 'lmRecPacketBytes', 'data', 'write',
        rf + '\n' + tb + '\nif (write !== undefined) { _lmSetTokenBox("#server-token", write); return; }\n' + step);
    const rec = () => f(window, $, document, {}, () => 10, { byteLength: 10 });
    const write = (v) => f(window, $, document, {}, null, null, v); /* updateServerInfo */
    const n = () => window.RecordedProtocol['ffa.legendmod.ml:8080'].length;
    write('ffa.legendmod.ml:8080');
    for (let i = 0; i < 5; i++) rec();
    /* playing (no connect meanwhile), the player pastes a replay token into the box, then leaves the box */
    box.value = 'replay^ffa.legendmod.ml:8080(1)'; box._lmTyped = true; document.activeElement = box;
    for (let i = 0; i < 5; i++) rec();
    check('typing a replay token into the Join box: the live server is still recorded', n() === 10, n());
    document.activeElement = null;
    for (let i = 0; i < 5; i++) rec();
    check('... also after the player left the box', n() === 15, n());
    /* a reconnect while the box keeps the typing (held value) */
    document.activeElement = box; write('ffa.legendmod.ml:8080');
    rec();
    check('a connect while the player types: still recorded, the typing kept', n() === 16 && box.value === 'replay^ffa.legendmod.ml:8080(1)', n() + ' ' + box.value);
    /* joined: the box is written with the replay server */
    box._lmTyped = false; document.activeElement = null; write('imsolo.pro.replay:2000');
    rec();
    check('a replay joined is not recorded', n() === 16, n());
    box.value = 'replay^ffa.legendmod.ml:8080(1)'; rec();
    check('a replay token that is the box value (joined) is not recorded', n() === 16, n());
})();

console.log(fail ? 'FAILED ' + fail : 'all ok');
process.exit(fail ? 1 : 0);
