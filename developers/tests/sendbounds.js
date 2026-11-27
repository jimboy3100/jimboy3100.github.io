/* Outgoing and incoming packet bounds, byte for byte, with the real code cut out of
 * ogario/ogario.v4.js (LM: createView, sendBuffer, sendMessage, sendAction, sendPosition, the
 * standard and Garix handshakes, shiftMessage/shiftKey, application.sendBuffer/strToBuff/
 * buildChat99View, core.proxy/proxyMobileData, handleMessage opcode 16 and replay recording),
 * ogario/spect.js (Spect: onopen handshake, sendBuffer, sendMessage, sendAction, sendPosition,
 * shiftMessage/shiftKey), LMexpress/standby-server.js (the team relay send adapter) and
 * ogario/modules/replaystudio.js (replay files to packets).
 *
 * The send paths transmit view.buffer, not the view, and opcode 16 reads Buffer(data.buffer)
 * with an offset counted from the view's start. Both are right only for a view that spans its
 * whole buffer. Every sender builds its packet with createView(n) / new Uint8Array(list), every
 * received packet is new DataView(event.data) and every replay packet gets its own buffer, so no
 * caller passes a part of a bigger buffer. Nothing is sliced: a slice would cost nothing here
 * (never taken) but the transport contract of the adapters is not the same everywhere (the team
 * relay adapter takes only an ArrayBuffer, the Expanding Land socket and the Senpa WASM socket
 * are outside this repo), so these checks guard the invariant instead: whole-buffer views, the
 * very same ArrayBuffer handed to the socket (no copy), unchanged bytes, encryption, key
 * order and packet order.
 * node developers/tests/sendbounds.js [ogario.v4.js] [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const src = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const spectSrc = read(process.argv[3] || path.join(root, 'ogario', 'spect.js'));
const standbySrc = read(path.join(root, 'LMexpress', 'standby-server.js'));
const studioSrc = read(path.join(root, 'ogario', 'modules', 'replaystudio.js'));
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

/* the method starting at `start`, up to its closing brace (braces in comments and strings skipped) */
function block(text, start, from) {
    const i = text.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = text.indexOf('{', i); k < text.length; k++) {
        const c = text[k];
        if (c === '/' && text[k + 1] === '/') k = text.indexOf('\n', k);
        else if (c === '/' && text[k + 1] === '*') k = text.indexOf('*/', k + 2) + 1;
        else if (c === "'" || c === '"' || c === '`') { for (k++; k < text.length && text[k] !== c; k++) if (text[k] === '\\') k++; }
        else if (c === '{') d++;
        else if (c === '}' && !--d) return text.slice(i, k + 1);
        if (k < 0) return null;
    }
    return null;
}
const need = [];
const get = (text, start, from) => { const b = block(text, start, from); if (!b) need.push(start.trim()); return b || ''; };
const between = (text, a, b) => { const i = text.indexOf(a), j = text.indexOf(b, i + 1); if (i < 0 || j < 0) { need.push(a.trim()); return ''; } return text.slice(i + a.length, j); };

/* ---- the code under test ---- */
const lmParts = ['        isSocketOpen() {', '        createView(t) {', '        sendBuffer(data) {', '        sendMessage(message) {', '        sendAction(action) {',
    '        sendPosition(cell, target2, specialcommand, periodic) {', '        _startGarixPing() {']
    .map((m) => get(src, m, m === '        isSocketOpen() {' ? src.indexOf('        _startGarixPing() {') - 400 : 0));
lmParts.push(get(src, '        "shiftMessage": function (view, key, write) {'), get(src, '        "shiftKey": function (key) {'));
/* the handshakes of onOpen: the standard 254 + 255 pair and Garix opcode 171 */
const hsStd = between(src, '                // ===== Standard Handshake: 0xFE + 0xFF =====', '            } // end of non-garix handshake');
const hsGarixAt = src.indexOf("            else if (this.serverType === 'garix') {\n                this.garixProtocol = 1;");
const hsGarix = hsGarixAt < 0 ? (need.push('garix handshake'), '{}') : block(src, '{', hsGarixAt);
lmParts.push('_hsStandard() {' + hsStd + '}', '_hsGarix() ' + hsGarix);
const appParts = ['        isSocketOpen() {', '        createView(value) {', '        strToBuff(offset, str) {', '        sendBuffer(value) {', '        buildChat99View(text) {']
    .map((m) => get(src, m));
const coreParts = ['        proxyMobileData(arr = []) {', '        proxy(data) {'].map((m) => get(src, m));
const handler = (() => {
    const a = src.indexOf('        handleMessage(data) {\n'), b = src.indexOf('        countPps() {', a);
    if (a < 0 || b < 0) { need.push('handleMessage'); return ''; }
    return src.slice(a, b).replace(/,\s*$/, '');
})();
const recHelpers = [get(src, '\nfunction lmRecRoom('), get(src, '\nfunction lmRecPacketBytes(')];
const spectParts = ['    isSocketOpen() {', '    createView(value) {', '    sendBuffer(data) {', '    sendMessage(message) {', '    sendAction(action) {',
    '    sendPosition(x, y) {', '    shiftKey(key) {', '    shiftMessage(view, key, write) {', '    onopen() {'].map((m) => get(spectSrc, m));
const standbySend = (() => { const i = standbySrc.indexOf('        this.send = function (data) {'); return i < 0 ? (need.push('standby send'), '') : block(standbySrc, 'function (data) {', i); })();
if (need.length) { console.log('FAIL code not found: ' + need.join(', ')); process.exit(1); }

/* ---- a reference cipher, written from the protocol (murmur-like key step, XOR by key byte i % 4) ---- */
const refKey = (k) => { const m = 1540483477; k = Math.imul(k, m) | 0; k = (Math.imul(k >>> 24 ^ k, m) | 0) ^ 114296087; k = Math.imul(k >>> 13 ^ k, m) | 0; return k >>> 15 ^ k; };
const refXor = (bytes, key) => bytes.map((b, i) => b ^ key >>> i % 4 * 8 & 255);
const hex = (ab) => Buffer.from(ab instanceof ArrayBuffer ? ab : ab.buffer, ab.byteOffset || 0, ab.byteLength).toString('hex');
/* movement (x 1000, y -2000, protocol key 0x11223344), split, feed sent with client key 0x5a5aa5a5 */
const GOLDEN_LM = 'b54d595aa595a2a55ae16978b4 e3 30';
const bytesOf = (ab) => Array.from(new Uint8Array(ab));

function fakeSocket(state) {
    const s = { readyState: state === undefined ? 1 : state, OPEN: 1, sent: [], send(d) { this.sent.push(d); } };
    return s;
}
/* every view handed to a sendBuffer: offset and length against its buffer */
function spanLog(obj) {
    const real = obj.sendBuffer, log = [];
    obj.sendBuffer = function (d) { log.push({ off: d.byteOffset, len: d.byteLength, buf: d.buffer.byteLength, op: new Uint8Array(d.buffer, d.byteOffset, 1)[0] }); return real.call(this, d); };
    return log;
}
const fullSpans = (log) => log.length > 0 && log.every((e) => e.off === 0 && e.len === e.buf);

function lmEnv() {
    const win = {
        _lmRecLive: false, multiboxPlayerEnabled: false, autoPlay: false, lockPosition: false, followStraight: false,
        userBots: { startedBots: false }, gameBots: {}, customProtol: 6, customClient: 1, disableIntegrity: false,
    };
    const ctx = { window: win, console: { log() { }, warn() { }, error() { } }, DataView, ArrayBuffer, Uint8Array, TextEncoder, Date, Math, Number, Array, String, JSON,
        defaultmapsettings: {}, setInterval: () => 1, clearInterval() { }, ReqPing() { }, master: { protocolVersion: 22 } };
    ctx.LM = { dance: false, ws: 'wss://example.test', integrity: true };
    ctx.legendmod = ctx.LM;
    vm.createContext(ctx);
    const lm = vm.runInContext('({' + lmParts.join(',\n') + '})', ctx);
    Object.assign(lm, {
        socket: fakeSocket(), serverType: '', connectionOpened: false, connectionIntegrity: true, clientKey: 0, protocolKey: 0x11223344,
        protocolVersion: 22, clientVersion: 31200, play: true, cursorX: 1000, cursorY: -2000, viewXTrue: 0, viewYTrue: 0, vector: [[0, 0]], vnr: 0,
        translateX: (x) => x, translateY: (y) => y, garixTabID1: 0x0102,
    });
    win.legendmod = lm;
    ctx.LM = Object.assign(lm, { dance: false, ws: 'wss://example.test', integrity: true });
    ctx.legendmod = lm;
    return { lm, ctx, win };
}

/* ---- 1. LM.sendBuffer: the very same ArrayBuffer, nothing copied, nothing sent while closed ---- */
{
    const { lm } = lmEnv();
    const v = lm.createView(13);
    check('LM.createView: a whole-buffer view', v.byteOffset === 0 && v.byteLength === 13 && v.buffer.byteLength === 13);
    lm.sendBuffer(v);
    check('LM.sendBuffer: the socket gets the view\'s own ArrayBuffer (no copy)', lm.socket.sent.length === 1 && lm.socket.sent[0] === v.buffer && lm.socket.sent[0] instanceof ArrayBuffer);
    [0, 2, 3].forEach((st) => { lm.socket = fakeSocket(st); lm.sendBuffer(lm.createView(1)); check('LM.sendBuffer: nothing sent with readyState ' + st, lm.socket.sent.length === 0); });
    lm.socket = null; let threw = false; try { lm.sendBuffer(lm.createView(1)); } catch (e) { threw = true; }
    check('LM.sendBuffer: no socket, no throw', !threw);
}

/* ---- 2. handshake: plain 254/255 (before connectionOpened), then encrypted movement, split, feed in order ---- */
{
    const { lm } = lmEnv();
    const log = spanLog(lm);
    lm._hsStandard();
    const hs = lm.socket.sent.map(hex);
    check('handshake: 254 + protocol version, 255 + client version, unencrypted', hs.join(' ') === 'fe16000000 ffe0790000', hs.join(' '));
    check('handshake: connection opened, the key not advanced', lm.connectionOpened === true && lm.clientKey === 0);
    /* no key yet (241 not received): an integrity connection sends nothing and keeps the key */
    lm.sendAction(17);
    check('integrity, no client key: nothing sent', lm.socket.sent.length === 2);
    const key0 = 0x5a5aa5a5 | 0;
    lm.clientKey = key0;
    lm.socket.sent = [];
    lm.sendPosition();
    lm.sendAction(17);
    lm.sendAction(21);
    const out = lm.socket.sent;
    const k1 = refKey(key0), k2 = refKey(k1), k3 = refKey(k2);
    const move = [16, 0xe8, 3, 0, 0, 0x30, 0xf8, 0xff, 0xff, 0x44, 0x33, 0x22, 0x11];
    check('movement, split, feed: three packets in call order', out.length === 3 && out.every((b) => b instanceof ArrayBuffer));
    check('movement: 13 bytes, XOR with the first key', out[0] && hex(out[0]) === Buffer.from(refXor(move, key0)).toString('hex'), out[0] && hex(out[0]));
    check('split: XOR with the next key', out[1] && hex(out[1]) === Buffer.from(refXor([17], k1)).toString('hex'));
    check('feed: XOR with the key after that', out[2] && hex(out[2]) === Buffer.from(refXor([21], k2)).toString('hex'));
    check('the client key advanced once per sent packet', lm.clientKey === k3);
    /* frozen bytes of this exact sequence (any change to the cipher, key step or layout shows here) */
    check('golden bytes', out.map(hex).join(' ') === GOLDEN_LM, out.map(hex).join(' '));
    check('every LM packet is a whole-buffer view', fullSpans(log));
    /* decrypting with the same key stream gives the original bytes back */
    let k = key0; const plain = out.map((b) => { const r = refXor(bytesOf(b), k); k = refKey(k); return r; });
    check('decrypted: movement x 1000, y -2000, protocol key', Buffer.from(plain[0]).readInt32LE(1) === 1000 && Buffer.from(plain[0]).readInt32LE(5) === -2000 && Buffer.from(plain[0]).readUInt32LE(9) === 0x11223344);
}

/* ---- 3. unencrypted connection (private servers): bytes as built, key untouched ---- */
{
    const { lm } = lmEnv();
    lm.connectionIntegrity = false; lm.connectionOpened = true;
    lm.sendAction(17); lm.sendAction(21); lm.sendAction(18);
    check('no integrity: split, feed, Q as plain one-byte packets', lm.socket.sent.map(hex).join(' ') === '11 15 12');
    check('no integrity: the client key stays 0', lm.clientKey === 0);
}

/* ---- 4. Garix: handshake 171, split/eject with tab id, 15-byte mouse with zero padding, all plain ---- */
{
    const { lm } = lmEnv();
    lm.serverType = 'garix';
    const log = spanLog(lm);
    lm._hsGarix();
    const hs = lm.socket.sent[0];
    check('Garix handshake: opcode 171, protocol 1, 9 bytes', hs && hs.byteLength === 9 && new Uint8Array(hs)[0] === 171 && new DataView(hs).getUint32(1, true) === 1);
    lm.connectionIntegrity = true; lm.clientKey = 1234;
    lm.socket.sent = [];
    lm.sendAction(17); lm.sendAction(21); lm.sendPosition();
    check('Garix split / eject: [op][tab id u16], not encrypted', lm.socket.sent.slice(0, 2).map(hex).join(' ') === '110201 150201');
    check('Garix mouse: 15 bytes, tab id, x, y, zero padding', lm.socket.sent[2] && hex(lm.socket.sent[2]) === '100201e803000030f8ffff00000000');
    check('Garix: the client key not used', lm.clientKey === 1234);
    check('every Garix packet is a whole-buffer view', fullSpans(log));
}

/* ---- 5. delt.io filter: reads the opcode at the view's own offset ---- */
{
    const { lm } = lmEnv();
    lm.serverType = 'deltio'; lm.connectionIntegrity = false; lm.connectionOpened = true;
    lm.sendMessage(lm.createView(1)); /* opcode 0 spawn: allowed */
    const bad = lm.createView(2); bad.setUint8(0, 99);
    lm.sendMessage(bad);
    /* a part of a bigger buffer whose own first byte is 17 (split) behind a 99 */
    const big = new ArrayBuffer(4); new Uint8Array(big).set([99, 17, 0, 0]);
    let sentSub = 0; const realSend = lm.sendBuffer; lm.sendBuffer = function (d) { sentSub++; };
    lm.sendMessage(new DataView(big, 1, 1));
    lm.sendBuffer = realSend;
    check('delt.io: opcode 0 sent, chat 99 dropped', lm.socket.sent.length === 1 && hex(lm.socket.sent[0]) === '00');
    check('delt.io: the opcode is read at the view offset', sentSub === 1);
}

/* ---- 6. shiftMessage: only the view's bytes, counted from its start, in place ---- */
{
    const { lm } = lmEnv();
    const back = new ArrayBuffer(8); const u = new Uint8Array(back); u.set([0xaa, 1, 2, 3, 4, 5, 0xbb, 0xbb]);
    const sub = new DataView(back, 1, 5);
    const key = 0x0a0b0c0d;
    const r = lm.shiftMessage(sub, key);
    check('LM.shiftMessage: returns the same view (no copy)', r === sub);
    check('LM.shiftMessage: sentinel bytes outside the view untouched', u[0] === 0xaa && u[6] === 0xbb && u[7] === 0xbb);
    check('LM.shiftMessage: view bytes XOR from the view start', bytesOf(back).slice(1, 6).join() === refXor([1, 2, 3, 4, 5], key).join());
    lm.shiftMessage(sub, key);
    check('LM.shiftMessage: applied twice gives the bytes back', bytesOf(back).join() === [0xaa, 1, 2, 3, 4, 5, 0xbb, 0xbb].join());
}

/* ---- 7. chat and protobuf packets (application.buildChat99View, core.proxy / proxyMobileData) ---- */
{
    const { lm, ctx, win } = lmEnv();
    lm.connectionIntegrity = false; lm.connectionOpened = true;
    const log = spanLog(lm);
    ctx.LM = lm;
    const app = vm.runInContext('({' + appParts.join(',\n') + '})', ctx);
    ctx.application = app;
    const core = vm.runInContext('({' + coreParts.join(',\n') + '})', ctx);
    win.core = core;
    ctx.consoleMsgLM = '';
    lm.sendMessage(app.buildChat99View('hi'));
    lm.isLegendWorld = true;
    lm.sendMessage(app.buildChat99View('hi'));
    lm.isLegendWorld = false;
    core.proxy([8, 1, 18, 0]);
    core.proxy([17]);
    const s = lm.socket.sent.map(hex);
    check('chat 99 (UTF-16), chat 99 (Expanding Land UTF-8), protobuf 102, other opcode', s.join(' ') === '6300680069000000 6300686900 6608011200 11', s.join(' '));
    check('every chat / protobuf packet is a whole-buffer view', fullSpans(log));
}

/* ---- 8. team relay (application.sendBuffer) and its adapter: ArrayBuffer in, same bytes queued ---- */
{
    const ctx = { window: {}, console, DataView, ArrayBuffer, Uint8Array };
    vm.createContext(ctx);
    const app = vm.runInContext('({' + appParts.join(',\n') + '})', ctx);
    app.socket = fakeSocket();
    const v = app.strToBuff(10, 'ab');
    check('application.strToBuff: whole-buffer view, [op][UTF-16]', v.byteOffset === 0 && v.byteLength === v.buffer.byteLength && hex(v) === '0a61006200');
    app.sendBuffer(v);
    check('application.sendBuffer: the view\'s own ArrayBuffer', app.socket.sent[0] === v.buffer);
    app.socket = fakeSocket(0); app.sendBuffer(v);
    check('application.sendBuffer: nothing while connecting', app.socket.sent.length === 0);
    /* the standby-server adapter (window.ogarioWS) wraps what it gets in new DataView(data) */
    const relay = { cached: {}, sockets: [{ queue: [] }], sent: 0 };
    const send = vm.runInContext('(function (self, socketsEach) { return ' + standbySend + '; })', ctx)(relay, (fn) => relay.sockets.forEach(fn));
    const bound = send.bind({ sendAll() { relay.sent++; } });
    const pos = new DataView(new ArrayBuffer(17)); pos.setUint8(0, 30); pos.setInt32(5, -7, true);
    bound(pos.buffer);
    check('relay adapter: takes the ArrayBuffer, queues the same bytes', relay.sockets[0].queue.length === 1 && hex(relay.sockets[0].queue[0]) === hex(pos) && relay.sent === 1);
    let threw = null; try { bound(pos); } catch (e) { threw = e; }
    check('relay adapter: a DataView is refused (the payload type must stay ArrayBuffer)', !!threw && threw.name === 'TypeError');
}

/* ---- 9. Spect (multibox unit / spectator): same cipher, same order, whole buffers ---- */
{
    const win = { master: { clientVersion: 31200, protocolVersion: 22 }, disableIntegrity: false, lockPosition: false };
    const ctx = { window: win, console: { log() { }, warn() { }, error() { } }, DataView, ArrayBuffer, Uint8Array, Date, Math, Number, legendmod: { cursorX: 0, cursorY: 0 } };
    vm.createContext(ctx);
    const sp = vm.runInContext('({' + spectParts.join(',\n') + '})', ctx);
    Object.assign(sp, { socket: fakeSocket(), integrity: true, connectionOpened: false, clientKey: 0, protocolKey: 0x11223344, number: 1, player: true, active: true });
    const log = spanLog(sp);
    sp.onopen();
    check('Spect handshake: 254 + protocol, 255 + client version, plain', sp.socket.sent.map(hex).join(' ') === 'fe16000000 ffe0790000');
    const v = sp.createView(1);
    sp.socket.sent = [];
    sp.clientKey = 0x5a5aa5a5 | 0;
    sp.sendPosition(1000, -2000); sp.sendAction(17); sp.sendAction(21);
    check('Spect: movement / split / feed bytes equal the main client\'s', sp.socket.sent.map(hex).join(' ') === GOLDEN_LM, sp.socket.sent.map(hex).join(' '));
    check('Spect: every packet is a whole-buffer view', fullSpans(log));
    sp.socket = fakeSocket(); sp.sendBuffer(v);
    check('Spect.sendBuffer: the view\'s own ArrayBuffer', sp.socket.sent[0] === v.buffer);
    const back = new ArrayBuffer(4); new Uint8Array(back).set([0xaa, 1, 2, 0xbb]);
    sp.shiftMessage(new DataView(back, 1, 2), 0x0a0b0c0d);
    check('Spect.shiftMessage: sentinels untouched, bytes XOR from the view start', bytesOf(back).join() === [0xaa, 1 ^ 0x0d, 2 ^ 0x0c, 0xbb].join());
    sp.socket = fakeSocket(3); sp.sendBuffer(v);
    check('Spect.sendBuffer: nothing while closed', sp.socket.sent.length === 0);
}

/* ---- 10. incoming opcode 16: Buffer(data.buffer) shares the packet's bytes; recording keeps the same view ---- */
{
    const warns = [];
    const ctx = {
        console: { log() { }, warn: (...a) => warns.push(a.join(' ')), error: (...a) => warns.push('ERROR ' + a.join(' ')) },
        defaultmapsettings: { recordReplays: true }, TextDecoder, Uint8Array, DataView, Date, Math, RangeError,
        $: () => ({ val: () => 'wss://example.test' }), drawRender: {}, _lmElTeamsActive: () => false,
        application: {}, LM: {}, catholicCalculator: 0, temporaryRecordedProtocol: 'x', RecordedProtocol: { x: [] }, _lmRecChkAt: 1048576, _lmRecBudgetCheck() { },
        buffer: { Buffer: function (ab) { return Buffer.from(ab); } },
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(recHelpers.join('\n'), ctx);
    const h = vm.runInContext('({' + handler + '})', ctx);
    const got = [];
    Object.assign(h, { serverType: '', _lmKeepMainSuppressed: () => false, countPps() { this.pps = (this.pps || 0) + 1; },
        updateCells(buf, s) { got.push({ buf, s }); }, garixUpdateCells(d, s) { got.push({ d, s }); } });
    const raw = new Uint8Array([16, 1, 0, 2, 0, 0, 0, 3, 0, 0, 0]).buffer;
    const data = new DataView(raw);
    h.handleMessage(data);
    const g = got[0];
    check('opcode 16: updateCells gets the bytes from offset 1', g && g.s === 1 && g.buf.length === 11 && g.buf.readUInt16LE(1) === 1 && g.buf.readUInt32LE(3) === 2);
    check('opcode 16: the Buffer shares the packet memory (no copy)', g && g.buf.buffer === raw && g.buf.byteOffset === 0);
    check('opcode 16: packets per second counted once', h.pps === 1);
    check('recording: the very view is kept (replay plays the same bytes)', ctx.RecordedProtocol.x[0] === data && ctx.catholicCalculator === 1);
    check('recording: its memory is its own buffer', ctx._lmRecSlotBytes === 11);
    h.serverType = 'garix';
    h.handleMessage(data);
    check('Garix opcode 16: the view itself goes to garixUpdateCells', got[1] && got[1].d === data && got[1].s === 1);
    check('no errors logged', !warns.some((w) => w.startsWith('ERROR')));
}

/* ---- 10b. Practice arena stand-in socket: reads the ArrayBuffer LM sends (movement, split, feed) ---- */
{
    const sim = require(path.join(root, 'ogario', 'modules', 'practice-sim.js'));
    const { lm } = lmEnv();
    lm.connectionIntegrity = false; lm.connectionOpened = true; lm.integrity = false;
    lm.sendPosition(); lm.sendAction(17); lm.sendAction(21);
    const cmds = lm.socket.sent.map((b) => sim.decodeClient(b));
    check('practice socket: move 1000/-2000, split, eject from the sent buffers', cmds.length === 3 && cmds[0] && cmds[0].t === 'move' && cmds[0].x === 1000 && cmds[0].y === -2000 &&
        cmds[1] && cmds[1].t === 'split' && cmds[2] && cmds[2].t === 'eject', JSON.stringify(cmds));
}

/* ---- 11. replay files: every packet has its own whole buffer (a slice, never a view into the file) ---- */
{
    const ctx = { console: { log() { }, info() { }, warn() { } }, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite,
        Number, String, Array, Object, Promise, URL, TextDecoder, AbortController, setTimeout, parseInt };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(studioSrc, ctx);
    const L = ctx.LMReplayStudio && ctx.LMReplayStudio.lib;
    if (!L || !L.packPackets || !L.unpackPackets || !L.strView) check('replay library found', false);
    else {
        /* a packet that is a part of a bigger buffer, with sentinels around it */
        const back = new ArrayBuffer(6); new Uint8Array(back).set([0xaa, 16, 1, 2, 3, 0xbb]);
        const packed = L.packPackets([new DataView(back, 1, 4), new DataView(new Uint8Array([53, 0]).buffer)]);
        const un = L.unpackPackets(packed.buf, packed.lens);
        check('replay pack: only the view\'s bytes are stored', un && un.length === 2 && hex(un[0]) === '10010203' && hex(un[1]) === '3500');
        check('replay unpack: each packet a whole buffer of its own', un && un.every((d) => d.byteOffset === 0 && d.byteLength === d.buffer.byteLength) && un[0].buffer !== un[1].buffer);
        const sv = L.strView('\x10\x01\x02');
        check('replay .lm text: whole-buffer packet', sv.byteOffset === 0 && sv.byteLength === sv.buffer.byteLength && hex(sv) === '100102');
        const jim = path.join(root, 'extras', 'jim.lm');
        if (fs.existsSync(jim) && L.parseLmText) {
            const p = L.parseLmText(fs.readFileSync(jim, 'utf8'));
            check('extras/jim.lm: all ' + p.packets.length + ' packets are whole-buffer views', p.packets.length > 0 && p.packets.every((d) => d.byteOffset === 0 && d.byteLength === d.buffer.byteLength));
        }
    }
}

console.log(failed ? failed + ' check(s) failed' : 'all send bounds checks passed');
process.exit(failed ? 1 : 0);
