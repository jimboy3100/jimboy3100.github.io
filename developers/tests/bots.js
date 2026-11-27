/* Bot reliability tests: validates buffer helpers, URL regex, JSON guards, and
 * compressed-size cap without requiring network or the full ws server.
 * Behavioural tests drive both bot servers (fake WebSocket) and run the bot client code
 * of ogario.v4.js in a vm sandbox.
 * node developers/tests/bots.js */
const fs = require('fs'), path = require('path');
const botsDir = path.join(__dirname, '..', '..', 'ExampleScripts', 'agario-bots2');
let fail = 0;
const _log = console.log;
const check = (n, c) => { _log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

// ---- buffers.js ----
const buffers = require(path.join(botsDir, 'buffers'));
{
    // spawn2(name) must produce a valid buffer without crashing
    const buf = buffers.spawn2('TestBot');
    check('spawn2 returns a buffer', Buffer.isBuffer(buf));
    check('spawn2 opcode is 0', buf[0] === 0);
    check('spawn2 contains name', buf.toString('ascii', 1, 8) === 'TestBot');

    // spawn(name, token) must work with two arguments
    const buf2 = buffers.spawn('Bot', 'tok123');
    check('spawn(name,token) returns a buffer', Buffer.isBuffer(buf2));
    check('spawn opcode is 0', buf2[0] === 0);

    // protocolVersion and clientVersion
    const pv = buffers.protocolVersion(22);
    check('protocolVersion opcode 254', pv[0] === 254);
    check('protocolVersion encodes LE', pv.readUInt32LE(1) === 22);

    const cv = buffers.clientVersion(3104);
    check('clientVersion opcode 255', cv[0] === 255);
    check('clientVersion encodes LE', cv.readUInt32LE(1) === 3104);

    // move(x, y, key)
    const mv = buffers.move(100, -200, 42);
    check('move opcode 16', mv[0] === 16);
    check('move x', mv.readInt32LE(1) === 100);
    check('move y', mv.readInt32LE(5) === -200);
    check('move key', mv.readInt32LE(9) === 42);
}

// ---- reader.js ----
const Reader = require(path.join(botsDir, 'reader'));
{
    const buf = Buffer.from([0x2A, 0x01, 0x00, 0x48, 0x69, 0x00]);
    const r = new Reader(buf);
    check('readUint8', r.readUint8() === 0x2A);
    check('readUint16', r.readUint16() === 1);
    check('readString', r.readString() === 'Hi');
}

// ---- writer.js ----
const Writer = require(path.join(botsDir, 'writer'));
{
    const w = new Writer(10);
    w.writeUint8(42);
    w.writeInt32(-1);
    w.writeUint32(0xDEAD);
    check('Writer round-trip uint8', w.buffer[0] === 42);
    check('Writer round-trip int32', w.buffer.readInt32LE(1) === -1);
    check('Writer round-trip uint32', w.buffer.readUInt32LE(5) === 0xDEAD);
}

// ---- algorithm.js ----
const algorithm = require(path.join(botsDir, 'algorithm'));
{
    // rotateEncryptionKey should return a number
    const k = algorithm.rotateEncryptionKey(12345);
    check('rotateEncryptionKey returns a number', typeof k === 'number' && isFinite(k));

    // rotateBufferBytes round-trip: encrypt then decrypt with same key
    const original = Buffer.from([10, 20, 30, 40, 50]);
    const copy = Buffer.from(original);
    algorithm.rotateBufferBytes(copy, 999);
    check('rotateBufferBytes changes data', !copy.equals(original));
    algorithm.rotateBufferBytes(copy, 999);
    check('rotateBufferBytes round-trip restores data', copy.equals(original));
}

// ---- entity.js ----
const Entity = require(path.join(botsDir, 'entity'));
{
    const e = new Entity();
    check('Entity defaults', e.id === 0 && e.x === 0 && e.y === 0 && e.size === 0 && e.isVirus === false && e.isPellet === false);
}

// ---- URL regex (used for encryption key derivation) ----
{
    const regex = /(live-arena-([\w\d]+(\.tech)?).agar\.io)/;
    const url1 = 'wss://live-arena-abc123.agar.io';
    const url2 = 'wss://live-arena-abc123.tech.agar.io';
    const url3 = 'wss://something-else.example.com';
    const url4 = 'wss://live-arena-.agar.io'; // edge: empty subdomain part

    const m1 = url1.match(regex);
    check('URL regex matches standard arena URL', m1 && m1[1] === 'live-arena-abc123.agar.io');

    const m2 = url2.match(regex);
    check('URL regex matches .tech arena URL', m2 && m2[1] === 'live-arena-abc123.tech.agar.io');

    check('URL regex rejects non-agar URL', !url3.match(regex));
    check('URL regex handles edge-case empty subdomain', url4.match(regex) === null || url4.match(regex)[1] === 'live-arena-.agar.io');
}

// ---- server.js: TLS not globally disabled ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('TLS: no global process.env disable', !serverSrc.includes("process.env['NODE_TLS_REJECT_UNAUTHORIZED']"));
    check('TLS: request-promise defaults still have strictSSL:false', serverSrc.includes('strictSSL: false'));
}

// ---- buffers.spawn: same bytes as the client's own spawn packet ----
{
    // The client (ogario.v4.js sendSpawn) writes: 0, nick bytes, 0, token bytes, 0,
    // nick = unescape(encodeURIComponent(nick)), one byte per character.
    const clientSpawn = (nick, token) => {
        nick = unescape(encodeURIComponent(nick));
        const view = Buffer.alloc(1 + nick.length + 1 + token.length + 1);
        let pos = 1;
        for (let i = 0; i < nick.length; i++, pos++) view[pos] = nick.codePointAt(i);
        pos++;
        for (let i = 0; i < token.length; i++, pos++) view[pos] = token.codePointAt(i);
        return view;
    };
    const realToken = '03AFcWeA' + 'aB3_-x9Zq'.repeat(60);
    const ascii = buffers.spawn('LM Bot', '0');
    check('spawn ASCII nick + token 0: exact bytes', ascii.equals(Buffer.from([0, 0x4C, 0x4D, 0x20, 0x42, 0x6F, 0x74, 0, 0x30, 0])));
    check('spawn ASCII nick + token 0 matches the client', ascii.equals(clientSpawn('LM Bot', '0')));
    check('spawn ASCII nick + real token matches the client', buffers.spawn('LM Bot', realToken).equals(clientSpawn('LM Bot', realToken)));
    const greek = 'Ελλάδα★';
    const wire = unescape(encodeURIComponent(greek)); // what the client sends in startBots
    const utf8 = buffers.spawn(wire, realToken);
    check('spawn UTF-8 nick matches the client byte for byte', utf8.equals(clientSpawn(greek, realToken)));
    check('spawn UTF-8 nick length = 3 + UTF-8 bytes + token', utf8.length === 3 + Buffer.byteLength(greek, 'utf8') + realToken.length);
    check('spawn UTF-8 nick: separator after the nick bytes', utf8[1 + Buffer.byteLength(greek, 'utf8')] === 0 && utf8[utf8.length - 1] === 0);
    check('spawn plain Unicode nick encodes to the same UTF-8 bytes', buffers.spawn(greek, '0').equals(clientSpawn(greek, '0')));
    check('spawn without token uses 0', buffers.spawn('a').equals(Buffer.from([0, 0x61, 0, 0x30, 0])));
    check('spawn drops zero bytes inside the nick', buffers.spawn('a\0b', '0').equals(Buffer.from([0, 0x61, 0x62, 0, 0x30, 0])));
    const v3 = buffers.captchaV3('tok');
    check('captchaV3 = 88, token, 0', v3.equals(Buffer.from([88, 0x74, 0x6F, 0x6B, 0])));
}

// ---- Behavioural: both servers driven with a fake WebSocket ----
const out = console.log;
const Module = require('module');
class FakeWS {
    constructor(url, opts) { this.url = url; this.opts = opts; this.readyState = 0; this.sent = []; FakeWS.instances.push(this); }
    send(data) { this.sent.push(Buffer.from(data)); }
    close() { if (this.readyState === 3) return; this.readyState = 3; if (this.onclose) this.onclose(); }
    open() { this.readyState = 1; if (this.onopen) this.onopen(); }
    drop() { this.readyState = 3; if (this.onclose) this.onclose(); } // closed by the game server
}
FakeWS.CONNECTING = 0; FakeWS.OPEN = 1; FakeWS.CLOSING = 2; FakeWS.CLOSED = 3;
FakeWS.instances = [];
FakeWS.Server = class { constructor(options) { this.options = options; } on() { return this; } };
class FakeClient {
    constructor() { this.readyState = 1; this.sent = []; this.handlers = {}; }
    send(data) { this.sent.push(Buffer.from(data)); }
    on(event, fn) { this.handlers[event] = fn; }
    count(bytes) { return this.sent.filter(b => b.equals(Buffer.from(bytes))).length; }
}
const murmurCalls = [];
const stubs = {
    'ws': FakeWS,
    'murmurhash-js': { murmur2: (str, seed) => { murmurCalls.push([str, seed]); return 0; } },
    'request-promise': { defaults: () => () => undefined },
    './logger.js': { good: (...a) => console.log(a.join(' ')), warn: (...a) => console.log(a.join(' ')), error: (...a) => console.log(a.join(' ')) }
};
const origLoad = Module._load;
Module._load = function (request) { return Object.prototype.hasOwnProperty.call(stubs, request) ? stubs[request] : origLoad.apply(this, arguments); };
const logs = [];
console.log = (...a) => logs.push(a.join(' '));
const servers = {};
try {
    servers['server.js'] = require(path.join(botsDir, 'server.js'));
    servers['server-fast.js'] = require(path.join(botsDir, 'server-fast.js'));
} finally {
    Module._load = origLoad;
    console.log = out;
}

const u16 = v => { const b = Buffer.alloc(2); b.writeUInt16LE(v); return b; };
const u32 = v => { const b = Buffer.alloc(4); b.writeUInt32LE(v); return b; };
const i32 = v => { const b = Buffer.alloc(4); b.writeInt32LE(v); return b; };
const f64 = v => { const b = Buffer.alloc(8); b.writeDoubleLE(v); return b; };
const GAME_URL = 'wss://live-arena-abc123.agar.io:443';
const startPacket = (name, amount) => Buffer.concat([Buffer.from([0]), Buffer.from(GAME_URL, 'latin1'), Buffer.from([0]),
    u32(22), u32(31000), Buffer.from([1]), Buffer.from(name, 'latin1'), Buffer.from([0]), Buffer.from([amount])]);
const tokenMsg = t => JSON.stringify({ message: 'botscode', msg: JSON.stringify(t) });
const expectSpawn = (name, token) => Buffer.concat([Buffer.from([0]), Buffer.from(name, 'latin1'), Buffer.from([0]), Buffer.from(token, 'latin1'), Buffer.from([0])]);
const T = n => 'tok' + n + '_' + 'Qw9-'.repeat(30);

for (const [file, M] of Object.entries(servers)) {
    const tag = file + ': ';
    const NAME = unescape(encodeURIComponent('Bot★'));
    console.log = (...a) => logs.push(a.join(' '));
    let threw = null;
    try {
        const begin = (amount = 5) => {
            M.resetServer();
            FakeWS.instances.length = 0;
            const c = new FakeClient();
            M.onUserConnection(c);
            M.handleUserMessage(c, startPacket(NAME, amount));
            return c;
        };
        const newBot = () => { const b = new M.Bot(); M.userBots.push(b); b.ws.open(); return b; };
        const last = b => b.ws.sent[b.ws.sent.length - 1];
        const ready = b => b.handleBuffer(Buffer.from([242, 0, 0, 0, 0]));
        const alive = (b, id) => b.handleBuffer(Buffer.concat([Buffer.from([32]), u32(id)]));
        const die = (b, id) => b.handleCompressedBuffer(Buffer.concat([Buffer.from([16]), u16(0), u32(0), u16(1), u32(id)]));
        const st = () => M.state();

        // start
        let c = begin(5);
        check(tag + 'start parses url/name/amount', M.game.url === GAME_URL && M.bots.name === NAME && M.bots.amount === 5 && M.session.active);
        check(tag + 'start opens no extra game connection (no leaderboard bot)', FakeWS.instances.length === 0);
        check(tag + 'second start while active is ignored', (M.handleUserMessage(c, startPacket('x', 9)), M.bots.amount === 5 && FakeWS.instances.length === 0));
        check(tag + 'control socket has an error handler', typeof c.handlers.error === 'function');

        // no captcha: spawn with '0'
        const b1 = newBot();
        check(tag + 'open counts one connected bot', st().connectedBots === 1);
        const sentBefore = b1.ws.sent.length;
        ready(b1);
        check(tag + 'no token: spawns with token 0', b1.ws.sent.length === sentBefore + 1 && last(b1).equals(expectSpawn(NAME, '0')));
        check(tag + 'no captcha: client gets no 12', c.count([12]) === 0);

        // queued token is used, once
        M.handleUserMessage(c, tokenMsg(T(1)));
        check(tag + 'token queued (no bot waiting)', M.session.tokens.length === 1);
        const b2 = newBot(); ready(b2);
        check(tag + 'queued token: spawn carries it', last(b2).equals(expectSpawn(NAME, T(1))));
        check(tag + 'token is single use', M.session.tokens.length === 0);
        const b3 = newBot(); ready(b3);
        check(tag + 'after the token is used: back to 0', last(b3).equals(expectSpawn(NAME, '0')));
        M.handleUserMessage(c, Buffer.from(tokenMsg(T(9))));
        check(tag + 'token message as a binary frame is accepted too', M.session.tokens.length === 1);
        M.session.tokens.length = 0;

        // opcode 85: captcha mode
        let n1 = b1.ws.sent.length;
        b1.handleBuffer(Buffer.from([85]));
        check(tag + '85: captcha mode on', M.session.captchaRequired === true);
        check(tag + '85: client gets [12] once', c.count([12]) === 1);
        check(tag + '85: bot keeps its connection and waits', b1.ws && b1.ws.readyState === 1 && b1.waitingToken === 'spawn' && b1.ws.sent.length === n1 && st().connectedBots === 3);
        b2.handleBuffer(Buffer.from([85]));
        check(tag + 'second 85: still only one [12]', c.count([12]) === 1);
        const b4 = newBot(); n1 = b4.ws.sent.length; ready(b4);
        check(tag + 'captcha mode: new bot waits instead of spawning with 0', b4.waitingToken === 'spawn' && b4.ws.sent.length === n1);

        // tokens arrive: one waiting bot each
        M.handleUserMessage(c, tokenMsg(T(2)));
        check(tag + 'token arrives: first waiting bot spawns with it', last(b1).equals(expectSpawn(NAME, T(2))) && b1.waitingToken === null);
        check(tag + 'token arrives: other bots still wait', b2.waitingToken === 'spawn' && b4.waitingToken === 'spawn');
        M.handleUserMessage(c, tokenMsg(T(3)));
        check(tag + 'next token: next waiting bot', last(b2).equals(expectSpawn(NAME, T(3))) && M.session.tokens.length === 0);

        // respawn after death in captcha mode
        alive(b1, 101);
        check(tag + 'spawned: counters and client [0]', st().spawnedBots === 1 && c.count([0]) === 1 && M.user.startedBots);
        n1 = b1.ws.sent.length;
        die(b1, 101);
        check(tag + 'death in captcha mode: waits for a token', st().spawnedBots === 0 && b1.waitingToken === 'spawn' && b1.ws.sent.length === n1);
        M.handleUserMessage(c, tokenMsg(T(4)));
        check(tag + 'death in captcha mode: respawns with the next token', last(b1).equals(expectSpawn(NAME, T(4))) && last(b4).equals(Buffer.from([0x30, 0])) === false);
        M.handleUserMessage(c, tokenMsg(T(5)));
        check(tag + 'waiting new bot spawns with a later token', last(b4).equals(expectSpawn(NAME, T(5))));

        // opcode 87: captcha v3 answered with 88
        b3.handleBuffer(Buffer.from([87]));
        check(tag + '87: waits for a v3 token', b3.waitingToken === 'v3' && c.count([12]) === 1);
        M.handleUserMessage(c, tokenMsg(T(6)));
        check(tag + '87: token sent as 88, token, 0', last(b3).equals(Buffer.concat([Buffer.from([88]), Buffer.from(T(6)), Buffer.from([0])])));

        // tokens never logged
        check(tag + 'token contents never logged', ![1, 2, 3, 4, 5, 6, 9].some(i => logs.some(l => l.includes(T(i)))));

        // close: counters once, reconnect scheduled
        alive(b2, 202);
        const conn = st().connectedBots, spawned = st().spawnedBots;
        b2.ws.drop();
        check(tag + 'close: connectedBots and spawnedBots decremented once', st().connectedBots === conn - 1 && st().spawnedBots === spawned - 1);
        b2.onclose();
        check(tag + 'close twice: no double decrement', st().connectedBots === conn - 1 && st().spawnedBots === spawned - 1);
        check(tag + 'close: reconnect scheduled, bot kept', !!b2.reconnectTimeout && M.userBots.includes(b2) && b2.ws === null);

        // stop / reset
        M.handleUserMessage(c, Buffer.from([1]));
        check(tag + 'stop: client gets [1], stopping', c.count([1]) === 1 && st().stoppingBots);
        const dead = b4; n1 = dead.ws.sent.length; die(dead, 0); ready(dead);
        check(tag + 'stopping: no new spawns', dead.ws.sent.length === n1);
        M.handleUserMessage(c, tokenMsg(T(7)));
        const sockets = FakeWS.instances.slice();
        M.resetServer();
        check(tag + 'reset: captcha mode off, tokens dropped', M.session.captchaRequired === false && M.session.tokens.length === 0 && !M.session.active);
        check(tag + 'reset: bots and counters cleared', M.userBots.length === 0 && st().connectedBots === 0 && st().spawnedBots === 0);
        check(tag + 'reset: reconnect timers cleared, sockets closed', b2.reconnectTimeout === null && b2.destroyed && sockets.every(s => s.readyState === 3));
        check(tag + 'reset: intervals cleared', !st().startBotsInterval && !st().moveInterval && !st().shutdownInterval);
        check(tag + 'stop with nothing running: client gets [2]', (M.handleUserMessage(c, Buffer.from([1])), c.count([2]) === 1));

        // captcha mode again after a reset: [12] again
        c = begin(5);
        const b5 = newBot(); ready(b5);
        check(tag + 'after reset: spawn with 0 again', last(b5).equals(expectSpawn(NAME, '0')));
        b5.handleBuffer(Buffer.from([85]));
        check(tag + 'after reset: [12] sent again on new captcha', c.count([12]) === 1);

        // expired token is not used
        c = begin(5);
        M.session.tokens.push({ token: T(8), time: Date.now() - 200000 });
        const b6 = newBot(); ready(b6);
        check(tag + 'expired token dropped: spawn with 0', last(b6).equals(expectSpawn(NAME, '0')) && M.session.tokens.length === 0);

        // amount
        c = begin(2);
        for (let i = 0; i < 6; i++) M.addBotTick();
        check(tag + 'start loop never exceeds amount (bots still connecting)', M.userBots.length === 2 && FakeWS.instances.length === 2);
        check(tag + 'start loop bots connect to the game url with the agar.io origin', FakeWS.instances.every(w => w.url === GAME_URL && w.opts.origin === 'https://agar.io'));

        // malformed input does not throw
        let ok = true;
        try {
            M.handleUserMessage(c, Buffer.alloc(0));
            M.handleUserMessage(c, '{bad json');
            M.handleUserMessage(c, tokenMsg('0'));
            M.handleUserMessage(c, tokenMsg(''));
            M.handleUserMessage(c, tokenMsg('has space'));
            M.handleUserMessage(c, JSON.stringify({ message: 'other', msg: '"abcdef"' }));
            M.handleUserMessage(c, Buffer.from([6, 1]));
            const b7 = newBot();
            b7.onmessage({ data: Buffer.from([241, 1]) });
            b7.onmessage({ data: Buffer.from([255, 0xff, 0xff, 0xff, 0x7f]) });
            b7.onmessage({ data: Buffer.from([255, 10, 0, 0, 0, 0xff]) });
            b7.onmessage({ data: 'text' });
            b7.onmessage({ data: Buffer.alloc(0) });
        } catch (e) { ok = false; }
        check(tag + 'malformed control/bot packets do not throw', ok);
        check(tag + 'invalid tokens (0, empty, spaces, other message) not queued', M.session.tokens.length === 0);
        M.resetServer();
        M.handleUserMessage(c, Buffer.from([0, 0x77, 0x73]));
        check(tag + 'truncated start packet does not start a session', !M.session.active);

        // client disconnect: spawn after that does not throw
        c = begin(5);
        const b8 = newBot(); ready(b8);
        c.handlers.close();
        ok = true;
        try { alive(b8, 5); } catch (e) { ok = false; }
        check(tag + 'client gone: bot events do not throw', ok && st().userWS === null);
        check(tag + 'client gone: session ended at once', !M.session.active && M.userBots.length === 0 && b8.destroyed && !st().stoppingBots);

        // client gone in captcha mode with an orientation reference: all cleared
        c = begin(5);
        const b10 = newBot(); ready(b10); b10.handleBuffer(Buffer.from([85]));
        M.handleUserMessage(c, Buffer.concat([Buffer.from([10, 1]), i32(5), i32(6), u32(700)]));
        M.handleUserMessage(c, tokenMsg(T(10)));
        c.handlers.close();
        check(tag + 'client gone: captcha mode, tokens and ghost reference cleared', !M.session.captchaRequired && M.session.tokens.length === 0 && M.user.ghostRef.length === 0 && !st().startBotsInterval);

        // cipher key: hostname + path like the client's generateClientKey
        {
            M.resetServer();
            const cc = new FakeClient(); M.onUserConnection(cc);
            const url = 'wss://live-arena-ab-12x.agar.io:443/';
            M.handleUserMessage(cc, Buffer.concat([Buffer.from([0]), Buffer.from(url), Buffer.from([0]), u32(22), u32(31000), Buffer.from([1]), Buffer.from('b'), Buffer.from([0, 1])]));
            check(tag + 'hyphenated live-arena host accepted', M.session.active && M.game.url === url);
            const b = newBot();
            murmurCalls.length = 0;
            b.handleBuffer(Buffer.concat([Buffer.from([241]), i32(77), Buffer.from('3.11.21'), Buffer.from([0])]));
            check(tag + '241: key from hostname + path + server version, seed 255', murmurCalls.length === 1 && murmurCalls[0][0] === 'live-arena-ab-12x.agar.io3.11.21' && murmurCalls[0][1] === 255 && b.decryptionKey === 77);
            check(tag + 'gameHost keeps a path without trailing slash', M.gameHost('wss://live-arena-x.agar.io/a/b/') === 'live-arena-x.agar.io/a/b');
            check(tag + 'gameHost rejects other hosts and schemes', M.gameHost('wss://example.com') === null && M.gameHost('https://live-arena-x.agar.io') === null && M.gameHost('wss://live-arena-x.agar.io.evil.com') === null && M.gameHost('nope') === null);
            M.resetServer();
            M.handleUserMessage(cc, Buffer.concat([Buffer.from([0]), Buffer.from('wss://imsolo.pro:2102'), Buffer.from([0]), u32(22), u32(31000), Buffer.from([1]), Buffer.from('b'), Buffer.from([0, 3])]));
            check(tag + 'non-agar.io game server: client gets 13 then 2, nothing starts', cc.count([13]) === 1 && cc.count([2]) === 1 && !M.session.active && M.userBots.length === 0 && !st().startBotsInterval);
        }

        // control socket origins
        check(tag + 'origin allow-list accepts LM pages, localhost and no origin', ['https://agar.io', 'https://jimboy3100.github.io', 'https://legendmod.ml', 'http://localhost', 'http://localhost:8080', 'https://localhost:3000', undefined, ''].every(o => M.isAllowedOrigin(o)));
        check(tag + 'origin allow-list rejects other pages', !['https://evil.com', 'https://agar.io.evil.com', 'http://agar.io', 'https://jimboy3100.github.io.evil.com', 'http://localhost.evil.com'].some(o => M.isAllowedOrigin(o)));

        // a second control socket takes over: the first one is told and then ignored
        {
            const c1 = begin(5);
            const bA = newBot(); ready(bA);
            const c2 = new FakeClient();
            M.onUserConnection(c2);
            check(tag + 'replaced client gets 2, its session ends', c1.count([2]) === 1 && !M.session.active && bA.destroyed);
            M.handleUserMessage(c1, startPacket(NAME, 5));
            check(tag + 'messages from the replaced client are ignored', !M.session.active);
            c1.handlers.close();
            check(tag + 'closing the replaced client does not touch the new one', st().userWS === c2);
            M.handleUserMessage(c2, startPacket(NAME, 4));
            check(tag + 'new client can start', M.session.active && M.bots.amount === 4);
        }

        // onerror closes only the socket that failed
        {
            c = begin(5);
            const b = newBot(); ready(b);
            const realST = global.setTimeout;
            let errorTimer = null;
            global.setTimeout = fn => { errorTimer = fn; return 0; };
            try { b.onerror(); } finally { global.setTimeout = realST; }
            const oldWs = b.ws;
            oldWs.drop();
            if (b.reconnectTimeout) { clearTimeout(b.reconnectTimeout); b.reconnectTimeout = null; }
            b.connect(); b.ws.open();
            const newWs = b.ws;
            errorTimer();
            check(tag + 'error timer does not close the reconnected socket', newWs.readyState === 1 && b.ws === newWs && oldWs !== newWs);
        }

        // captcha mode ends: spawn with 0 succeeded, or 5 minutes without 85
        {
            c = begin(5);
            const bA = newBot(); ready(bA); // spawned with '0'
            const bB = newBot(); ready(bB);
            bB.handleBuffer(Buffer.from([85]));
            check(tag + 'captcha on, bot waits', M.session.captchaRequired && bB.waitingToken === 'spawn' && c.count([12]) === 1);
            alive(bA, 31);
            check(tag + 'a bot spawned with 0: captcha mode off, waiting bot spawns with 0', !M.session.captchaRequired && bB.waitingToken === null && last(bB).equals(expectSpawn(NAME, '0')));
            bB.handleBuffer(Buffer.from([85]));
            check(tag + '85 again: [12] sent again', M.session.captchaRequired && c.count([12]) === 2);
            const realNow = Date.now;
            const t0 = realNow();
            Date.now = () => t0 + 4 * 60 * 1000;
            try { M.addBotTick(); } finally { Date.now = realNow; }
            check(tag + 'captcha mode kept before 5 minutes', M.session.captchaRequired && bB.waitingToken === 'spawn');
            Date.now = () => t0 + 5 * 60 * 1000 + 1;
            try { M.addBotTick(); } finally { Date.now = realNow; }
            check(tag + '5 minutes without 85: captcha mode off, bot spawns with 0', !M.session.captchaRequired && bB.waitingToken === null && last(bB).equals(expectSpawn(NAME, '0')));
            check(tag + 'each captcha-mode exit spawns the waiting bot once', bB.ws.sent.filter(p => p.equals(expectSpawn(NAME, '0'))).length === 3);
        }

        // sendMode nick: the player is never a bot target
        {
            c = begin(5);
            const b = newBot(); ready(b); alive(b, 1);
            const ent = (id, x, y, size, extra) => Object.assign({ id, x, y, size, name: '', isVirus: false, isPellet: false }, extra);
            b.viewportEntities = { 1: ent(1, 0, 0, 50), 2: ent(2, 300, 0, 200, { name: 'Mé' }), 3: ent(3, 0, 500, 10, { isPellet: true }) };
            M.bots.ai = true;
            const aim = () => { b.lastSentX = 0; b.lastSentY = 0; b.move(); const p = last(b); return [p.readInt32LE(1), p.readInt32LE(5)]; };
            const flee = aim();
            check(tag + 'AI flees a bigger player', flee[0] === -14142);
            M.handleUserMessage(c, Buffer.concat([Buffer.from([7, 1]), Buffer.from(unescape(encodeURIComponent('Mé')), 'latin1'), Buffer.from([0])]));
            check(tag + 'sendMode stores the decoded player nick', M.user.nickName === 'Mé');
            const eat = aim();
            check(tag + 'AI ignores the player (goes for the pellet)', eat[0] === 0 && eat[1] === 500);
            M.handleUserMessage(c, Buffer.concat([Buffer.from([7]), Buffer.from('sometoken'), Buffer.from([0])]));
            check(tag + 'other opcode 7 forms are ignored', M.user.nickName === 'Mé' && M.session.tokens.length === 0);
            M.resetServer();
            check(tag + 'reset clears the player nick', M.user.nickName === '');
        }
        M.resetServer();

        // ---- FFA/EXP orientation ----
        const CX = 500, CY = -300;
        const setBorder = b => b.handleCompressedBuffer(Buffer.concat([Buffer.from([64]), f64(CX - 7071), f64(CY - 7071), f64(CX + 7071), f64(CY + 7071)]));
        const refs = [{ x: 3000, y: -2000, mass: 5000 }, { x: -4000, y: 1500, mass: 3000 }, { x: 1000, y: 4200, mass: 1500 }];
        const op10 = list => Buffer.concat([Buffer.from([10, list.length]), ...list.map(r => Buffer.concat([i32(r.x), i32(r.y), u32(r.mass)]))]);
        const op69 = (list, fx, fy) => Buffer.concat([Buffer.from([69]), u16(list.length),
            ...list.map(r => Buffer.concat([i32(CX + fx * r.x), i32(CY + fy * r.y), u32(r.mass), Buffer.from([0])]))]);
        const orientBot = () => { const b = newBot(); ready(b); setBorder(b); return b; };
        const followTarget = (b, mx, my) => {
            M.handleUserMessage(c, Buffer.concat([Buffer.from([6]), i32(mx), i32(my)]));
            M.user.isAlive = true; M.bots.ai = false; b.followMouse = true;
            b.move();
            const p = last(b);
            return p[0] === 16 ? [p.readInt32LE(1), p.readInt32LE(5)] : null;
        };
        const cases = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
        cases.forEach(([fx, fy], i) => {
            c = begin(5);
            const b = orientBot();
            check(tag + 'border accepted: offsetFixed', b.offsetFixed && b.offsetX === CX && b.offsetY === CY);
            // alternate the order: 10 then 69, or 69 then 10
            if (i % 2) { M.handleUserMessage(c, op10(refs)); b.handleCompressedBuffer(op69(refs, fx, fy)); }
            else { b.handleCompressedBuffer(op69(refs, fx, fy)); M.handleUserMessage(c, op10(refs)); }
            check(tag + 'orientation ' + fx + '/' + fy + ' detected', b.orientFixed && b.fixX === fx && b.fixY === fy);
            const t = followTarget(b, 1234, -567);
            check(tag + 'orientation ' + fx + '/' + fy + ' follow target', t && t[0] === 1234 * fx + CX && t[1] === -567 * fy + CY);
        });
        {
            c = begin(5);
            const b = orientBot();
            b.handleBuffer(op69(refs, -1, 1)); // opcode 69 outside the compressed packet
            M.handleUserMessage(c, op10(refs.map(r => ({ x: r.x + 150, y: r.y - 100, mass: Math.round(r.mass * 1.05) }))));
            check(tag + 'orientation tolerates movement and 5% mass change', b.orientFixed && b.fixX === -1 && b.fixY === 1);
        }
        {
            c = begin(5);
            const b = orientBot();
            b.handleCompressedBuffer(op69(refs.map(r => ({ x: 100, y: r.y, mass: r.mass })), -1, -1));
            M.handleUserMessage(c, op10(refs.map(r => ({ x: 100, y: r.y, mass: r.mass }))));
            check(tag + 'players near the centre line: undecided', !b.orientFixed && b.fixX === 1 && b.fixY === 1);
        }
        {
            c = begin(5);
            const b = orientBot();
            M.handleUserMessage(c, op10(refs));
            const realNow = Date.now;
            const t0 = realNow();
            Date.now = () => t0 + 3500;
            try { b.handleCompressedBuffer(op69(refs, -1, -1)); } finally { Date.now = realNow; }
            check(tag + 'stale reference (> 3 s) ignored', !b.orientFixed && b.fixX === 1 && b.fixY === 1);
        }
        {
            c = begin(5);
            const b = newBot(); ready(b);
            M.handleUserMessage(c, op10(refs));
            b.handleCompressedBuffer(op69(refs, -1, -1));
            check(tag + 'no 14142 border yet: no ghost cells, no decision', !b.offsetFixed && !b.orientFixed && b.ghostCells.length === 0);
        }
        {
            c = begin(5);
            const b = orientBot();
            const realNow = Date.now;
            const at = b.offsetFixedAt;
            Date.now = () => at + 9000;
            try { b.move(); } finally { Date.now = realNow; }
            check(tag + 'no fallback before 10 s', !b.orientFixed);
            Date.now = () => at + 10001;
            try { b.move(); } finally { Date.now = realNow; }
            check(tag + 'fallback after 10 s: 1/1', b.orientFixed && b.fixX === 1 && b.fixY === 1);
            b.handleCompressedBuffer(op69(refs, -1, -1));
            M.handleUserMessage(c, op10(refs));
            check(tag + 'after the fallback the orientation stays', b.fixX === 1 && b.fixY === 1);
        }
        {
            c = begin(5);
            M.handleUserMessage(c, op10(refs));
            const good = M.user.ghostRef;
            ok = true;
            try {
                M.handleUserMessage(c, op10(refs).subarray(0, 2 + 12 * 2)); // n = 3 but only 2 records
                M.handleUserMessage(c, Buffer.concat([Buffer.from([10, 11]), Buffer.alloc(11 * 12)])); // n > 10
                M.handleUserMessage(c, Buffer.from([10]));
            } catch (e) { ok = false; }
            check(tag + 'malformed opcode 10 ignored', ok && M.user.ghostRef === good && good.length === 3);
            const before = { x: M.user.mouseX, y: M.user.mouseY };
            M.handleUserMessage(c, Buffer.concat([Buffer.from([7, 1]), Buffer.from('nick12'), Buffer.from([0])])); // sendMode, 9 bytes
            check(tag + '9-byte sendMode (opcode 7) changes nothing', M.user.mouseX === before.x && M.user.mouseY === before.y && !('playerX' in M.user));
            const b = orientBot();
            b.handleCompressedBuffer(op69(refs, 1, -1));
            check(tag + 'valid reference kept after malformed packets', b.orientFixed && b.fixY === -1);
            M.resetServer();
            check(tag + 'reset clears the ghost reference', M.user.ghostRef.length === 0 && M.user.ghostRefAt === 0);
            const b9 = new M.Bot();
            check(tag + 'new bot starts with orientation 1/1, unfixed', b9.fixX === 1 && b9.fixY === 1 && !b9.orientFixed && !b9.offsetFixed && b9.ghostCells.length === 0);
            b9.destroy();
        }
    } catch (e) {
        threw = e;
    } finally {
        M.resetServer();
        console.log = out;
    }
    check(tag + 'behavioural suite ran without exceptions' + (threw ? ' (' + threw.stack + ')' : ''), !threw);
}

// ---- both servers: forbidden features stay out; no process.exit on stop ----
for (const file of ['server.js', 'server-fast.js']) {
    const src = fs.readFileSync(path.join(botsDir, file), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
    check(file + ' does NOT have orbit logic', !src.includes('distToPlayer'));
    check(file + ' does NOT send bot positions (opcode 9)', !src.includes('writeUInt8(9, 0)') && !/sendToUser\(Buffer\.from\(\[9/.test(src));
    check(file + ' does NOT call process.exit', !code.includes('process.exit'));
    check(file + ' starts only when run directly', src.includes('if (require.main === module) start()'));
}

// ---- ogario.v4.js bot client: real code run in a vm sandbox ----
{
    const vm = require('vm');
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // Text from `start` (first occurrence of marker) to its matching closing brace;
    // skips strings, template literals and comments.
    const extract = (marker, from) => {
        const start = ogSrc.indexOf(marker, from || 0);
        if (start < 0) return null;
        let i = ogSrc.indexOf('{', start), depth = 0;
        if (i < 0) return null;
        for (; i < ogSrc.length; i++) {
            const ch = ogSrc[i], nx = ogSrc[i + 1];
            if (ch === '/' && nx === '/') { i = ogSrc.indexOf('\n', i); continue; }
            if (ch === '/' && nx === '*') { i = ogSrc.indexOf('*/', i + 2) + 1; continue; }
            if (ch === '"' || ch === "'" || ch === '`') {
                for (i++; i < ogSrc.length && ogSrc[i] !== ch; i++) if (ogSrc[i] === '\\') i++;
                continue;
            }
            if (ch === '{') depth++;
            else if (ch === '}' && --depth === 0) return ogSrc.slice(start, i + 1);
        }
        return null;
    };
    const run = (code, sandbox, self) => {
        vm.createContext(sandbox);
        return vm.runInContext(self ? '(function () { ' + code + ' }).call(__self)' : code, Object.assign(sandbox, { __self: self }));
    };
    const ab = buf => Buffer.from(buf);
    const el = () => ({ style: {}, disabled: false, innerText: '', click() { this.clicked = (this.clicked || 0) + 1; } });

    // window.buffers with the real Writer: bytes accepted by the bot server
    const writerSrc = extract('class Writer {');
    const buffersSrc = extract('window.buffers = {');
    check('ogario: Writer and window.buffers extractable', !!writerSrc && !!buffersSrc);
    const win = {};
    run(writerSrc + '\n' + buffersSrc, { window: win, DataView, ArrayBuffer, Math, Number });
    const B = win.buffers;
    const cells = [{ rawX: 1500.7, rawY: -200, mass: 3000 }, { rawX: -4000, rawY: 6000.2, mass: 120 }];
    const gr = ab(B.ghostRef(cells, 500, -300));
    check('ogario: ghostRef = 10, n, n x (i32 x, i32 y, u32 mass)', gr.length === 2 + 2 * 12 && gr[0] === 10 && gr[1] === 2 &&
        gr.readInt32LE(2) === 1000 && gr.readInt32LE(6) === 100 && gr.readUInt32LE(10) === 3000 &&
        gr.readInt32LE(14) === -4500 && gr.readInt32LE(18) === 6300 && gr.readUInt32LE(22) === 120);
    const many = Array.from({ length: 14 }, (_, i) => ({ rawX: i, rawY: i, mass: 100 + i }));
    const gr14 = ab(B.ghostRef(many, 0, 0));
    check('ogario: ghostRef sends at most 10 cells', gr14[1] === 10 && gr14.length === 2 + 10 * 12);
    check('ogario: captchabots is Writer(5)', ab(B.captchabots(7)).length === 5);
    const mp = ab(B.mousePosition(-1234, 5678));
    check('ogario: mousePosition = 6, i32 x, i32 y', mp.length === 9 && mp[0] === 6 && mp.readInt32LE(1) === -1234 && mp.readInt32LE(5) === 5678);
    // round trip into the bot server
    for (const [file, M] of Object.entries(servers)) {
        console.log = () => {};
        try {
            M.resetServer();
            const c = new FakeClient();
            M.onUserConnection(c);
            const nick = unescape(encodeURIComponent('Νίκος'));
            M.handleUserMessage(c, ab(B.startBots('wss://live-arena-q1w2.agar.io:443', 22, 31000, true, nick, 7)));
            const started = M.session.active && M.game.url === 'wss://live-arena-q1w2.agar.io:443' && M.game.protocolVersion === 22 && M.game.clientVersion === 31000 && M.bots.amount === 7 && M.bots.name === nick && M.user.isAlive === true;
            M.handleUserMessage(c, ab(B.sendMode(unescape(encodeURIComponent('Mé')))));
            M.handleUserMessage(c, gr);
            M.handleUserMessage(c, mp);
            check(file + ': client startBots packet parsed', started);
            check(file + ': client sendMode packet gives the player nick', M.user.nickName === 'Mé');
            check(file + ': client ghostRef packet parsed', M.user.ghostRef.length === 2 && M.user.ghostRef[0].x === 1000 && M.user.ghostRef[1].y === 6300 && M.user.ghostRef[1].mass === 120);
            check(file + ': client mousePosition parsed', M.user.mouseX === -1234 && M.user.mouseY === 5678);
            M.resetServer();
        } finally { console.log = out; }
    }

    // window._lmBotsStop
    const stopSrc = extract('window._lmBotsStop = function');
    check('ogario: _lmBotsStop extractable', !!stopSrc);
    const stopCase = (startedBots, startSent, readyState) => {
        const sent = [];
        const w = { userBots: { startedBots, startSent }, connectionBots: { ws: readyState == null ? null : { readyState }, send: b => sent.push(ab(b)) } };
        run(stopSrc + '; window._lmBotsStop()', { window: w, WebSocket: { OPEN: 1 }, Uint8Array });
        return { sent, startSent: w.userBots.startSent };
    };
    let r = stopCase(true, false, 1);
    check('ogario: _lmBotsStop sends [1] when bots run', r.sent.length === 1 && r.sent[0].equals(Buffer.from([1])));
    r = stopCase(false, true, 1);
    check('ogario: _lmBotsStop sends [1] while bots are starting', r.sent.length === 1 && r.startSent === false);
    r = stopCase(false, false, 1);
    check('ogario: _lmBotsStop sends nothing when nothing runs', r.sent.length === 0);
    r = stopCase(true, true, 3);
    check('ogario: _lmBotsStop does not send on a closed socket, clears startSent', r.sent.length === 0 && r.startSent === false);
    r = stopCase(true, true, null);
    check('ogario: _lmBotsStop without a socket does not throw', r.sent.length === 0 && r.startSent === false);
    check('ogario: Stop button and new game server use _lmBotsStop', /getElementById\('stopBots'\)\.addEventListener\('click', \(\) => \{\s*window\._lmBotsStop\(\)/.test(ogSrc) && (ogSrc.match(/window\._lmBotsStop\(\)/g) || []).length >= 3);

    // brResetFill / brStopFilling
    const resetSrc = extract('function brResetFill()');
    const stopFillSrc = extract('function brStopFilling()');
    check('ogario: brResetFill and brStopFilling extractable', !!resetSrc && !!stopFillSrc);
    const brCase = (filling, watcher, call) => {
        const els = { brFillLobby: el(), brStopFill: el() };
        els.brFillLobby.style.display = 'none'; els.brStopFill.style.display = '';
        let cleared = null, stops = 0;
        const w = { _brFilling: filling, _brLobbyWatcher: watcher, _brFillPending: true, _lmBotsStop() { stops++; } };
        const result = run(resetSrc + '\n' + stopFillSrc + '\n' + call, { window: w, document: { getElementById: id => els[id] || null }, clearInterval: id => { cleared = id; } });
        return { result, w, els, cleared, stops };
    };
    r = brCase(false, null, 'brResetFill()');
    check('ogario: brResetFill returns false when nothing runs, clears pending', r.result === false && r.w._brFillPending === false && r.stops === 0);
    r = brCase(true, 42, 'brResetFill()');
    check('ogario: brResetFill clears fill and watcher, restores buttons, sends nothing', r.result === true && r.w._brFilling === false && r.w._brLobbyWatcher === null && r.cleared === 42 &&
        r.els.brFillLobby.style.display === '' && r.els.brStopFill.style.display === 'none' && r.stops === 0);
    r = brCase(false, null, 'brStopFilling()');
    check('ogario: brStopFilling is a no-op when no fill runs', r.stops === 0);
    r = brCase(true, 7, 'brStopFilling(); brStopFilling()');
    check('ogario: brStopFilling stops the fill bots once', r.stops === 1 && r.cleared === 7);
    check('ogario: brResetFill/brStopFilling exposed on window', ogSrc.includes('window._brStopFilling = brStopFilling') && ogSrc.includes('window._brResetFill = brResetFill'));
    check('ogario: BR fill no longer writes window.bots.amount', /needed = Math\.min\(needed, 190\)[\s\S]{0,300}sessionAmount = needed/.test(ogSrc) && !/window\.bots\.amount = needed/.test(ogSrc));

    // connectionBots: messages 0, 2, 4, 12, 13; captcha popups only from startCaptcha
    const cbSrc = extract('window.connectionBots = {');
    check('ogario: connectionBots extractable', !!cbSrc);
    const makeCB = () => {
        const els = {}, toasts = [], html = {}, timers = [], popups = [];
        const getEl = id => els[id] || (els[id] = el());
        const w = { userBots: { startedBots: false, startSent: true, isAlive: true, sessionAmount: 9 }, bots: { amount: 50, ai: true }, captchaOpenedWindow: 3, capthaWindow: [],
            addEventListener() {}, _brResetFill() { w.resets = (w.resets || 0) + 1; } };
        const sb = {
            window: w, DataView, Uint8Array, WebSocket: { OPEN: 1, CONNECTING: 0 },
            document: { getElementById: getEl },
            toastr: { info: m => toasts.push(['info', m]), warning: (m, t, o) => toasts.push(['warning', m, o]) },
            $: sel => ({ html: v => { html[sel] = v; } }),
            _lmG1set() {}, lmT: k => k, _lmTH: (k, d) => k,
            Premadeletter123: 'LM', legendmod: { sendTokenForBots() {}, sendTimeOutTokenForBots() { w.tokenLoop = (w.tokenLoop || 0) + 1; } },
            createCaptchaWindow: i => popups.push(i), setTimeout: f => timers.push(f)
        };
        run(cbSrc, sb);
        const cb = w.connectionBots;
        cb.sent = [];
        cb.ws = { readyState: 1 };
        cb.send = b => cb.sent.push(ab(b));
        const msg = bytes => cb.onmessage({ data: new Uint8Array(bytes).buffer });
        return { cb, w, els, toasts, html, timers, popups, msg };
    };
    let k = makeCB();
    k.w._brFillPending = false;
    k.cb.onopen();
    check('ogario: onopen opens no captcha popups', k.popups.length === 0 && k.cb.captchaActive === false);
    k.msg([0]);
    check('ogario: message 0 marks started and sends [5, isAlive]', k.w.userBots.startedBots === true && k.cb.sent.length === 1 && k.cb.sent[0].equals(Buffer.from([5, 1])));
    k.msg([4, 3, 2]);
    check('ogario: message 4 shows connected/spawned/sessionAmount', k.html['#botCount'] === '3/2/9');
    k.msg([12]);
    const captchaToast = k.toasts.find(t => t[0] === 'warning' && t[1].includes('lm-bots-captcha-open'));
    check('ogario: message 12 shows a sticky toast with the captcha button, no popups', !!captchaToast && captchaToast[2] && captchaToast[2].timeOut === 0 && k.popups.length === 0 && !k.cb.captchaActive);
    k.cb.startCaptcha();
    check('ogario: startCaptcha opens the popups and the token loop', k.cb.captchaActive === true && k.popups.length === 3 && k.w.tokenLoop === 1);
    k.cb.startCaptcha();
    check('ogario: startCaptcha twice opens nothing more', k.popups.length === 3);
    const toastsBefore = k.toasts.length;
    k.msg([12]);
    check('ogario: message 12 while solving shows no second toast', k.toasts.length === toastsBefore);
    k.msg([13]);
    check('ogario: message 13 toasts agarOnly', k.toasts.some(t => t[1].includes('game1.bots.agarOnly')));
    k.msg([2]);
    check('ogario: message 2 resets the session, closes captcha, resets a BR fill', k.w.userBots.startedBots === false && k.w.userBots.startSent === false && k.cb.captchaActive === false && k.w.resets === 1);
    k = makeCB();
    k.cb.ws = { readyState: 3 };
    k.cb.startCaptcha();
    check('ogario: startCaptcha needs an open bot socket', k.popups.length === 0 && !k.cb.captchaActive);
    k = makeCB();
    k.w._brFillPending = true;
    k.cb.onopen();
    check('ogario: onopen continues a pending Fill lobby once', k.w._brFillPending === false && k.timers.length === 1 && (k.timers[0](), k.els.brFillLobby.clicked === 1));
    check('ogario: captcha button click calls startCaptcha', ogSrc.includes("$(document).on('click', '.lm-bots-captcha-open', function () { window.connectionBots.startCaptcha() })"));
    check('ogario: token loop runs only in captcha mode', /sendTimeOutTokenForBots\(\) \{[\s\S]{0,300}if \(window\.connectionBots\.captchaActive &&/.test(ogSrc));

    // mouse to bots: centred on the player's map, Rotate map undone
    const mouseMarker = 'if (window.userBots.startedBots && window.userBots.isAlive) {';
    const mouseIdx = ogSrc.lastIndexOf(mouseMarker, ogSrc.indexOf('window.buffers.mousePosition(window.userBots.mouseX'));
    const mouseSrc = mouseIdx > -1 ? extract(mouseMarker, mouseIdx) : null;
    check('ogario: mouse send block found', !!mouseSrc && mouseIdx > -1 && mouseSrc.includes('mousePosition'));
    const mouseCase = flip => {
        const sent = [];
        const w = { userBots: { startedBots: true, isAlive: true, offsetX: 500, offsetY: -300 }, legendmod: { vector: [flip], vnr: 0 },
            buffers: B, connectionBots: { send: b => sent.push(ab(b)) } };
        const self = { cursorX: 2000, cursorY: 100, translateX: x => 10000 - x, translateY: y => -y };
        run(extract('if (window.userBots.startedBots && window.userBots.isAlive) {', mouseIdx), { window: w }, self);
        return { sent, w };
    };
    let mc = mouseCase([false, false]);
    check('ogario: mouse to bots = cursor - player offset', mc.w.userBots.mouseX === 1500 && mc.w.userBots.mouseY === 400 && mc.sent.length === 1 && mc.sent[0].readInt32LE(1) === 1500 && mc.sent[0].readInt32LE(5) === 400);
    mc = mouseCase([true, true]);
    check('ogario: mouse to bots undoes Rotate map', mc.w.userBots.mouseX === 8000 - 500 && mc.w.userBots.mouseY === -100 + 300);

    // opcode 69: ghost reference to the bot server, throttled, player connection only
    const ghostIdx = ogSrc.indexOf('if (this === window.legendmod && window.userBots && window.userBots.startedBots && window.userBots.offsetFixed &&');
    const ghostSrc = ghostIdx > -1 ? extract('if (this === window.legendmod', ghostIdx) : null;
    check('ogario: opcode 69 ghostRef block found', !!ghostSrc && ghostSrc.includes('buffers.ghostRef('));
    const ghostCase = (self, userBots, times) => {
        const sent = [];
        const w = { userBots, buffers: B, connectionBots: { send: b => sent.push(ab(b)) } };
        w.legendmod = self.isMain ? self : {};
        for (const t of times) { self.ghostCellsTime = t; run(ghostSrc, { window: w }, self); }
        return sent;
    };
    const mainSelf = () => ({ isMain: true, ghostCells: [{ rawX: 600, rawY: -200, mass: 900 }] });
    const ub = () => ({ startedBots: true, offsetFixed: true, offsetX: 500, offsetY: -300 });
    let gs = ghostCase(mainSelf(), ub(), [10000, 10400, 11000, 11999, 12100]);
    check('ogario: ghostRef sent at most once a second', gs.length === 3);
    check('ogario: ghostRef bytes centred on the player offset', gs[0].equals(Buffer.concat([Buffer.from([10, 1]), (b => (b.writeInt32LE(100, 0), b.writeInt32LE(100, 4), b.writeUInt32LE(900, 8), b))(Buffer.alloc(12))])));
    gs = ghostCase(Object.assign(mainSelf(), { isMain: false }), ub(), [10000]);
    check('ogario: no ghostRef from a multibox/spectator connection', gs.length === 0);
    gs = ghostCase(mainSelf(), Object.assign(ub(), { offsetFixed: false }), [10000]);
    check('ogario: no ghostRef before the player offset is known', gs.length === 0);
    gs = ghostCase(mainSelf(), Object.assign(ub(), { startedBots: false }), [10000]);
    check('ogario: no ghostRef while bots are not started', gs.length === 0);

    // _lmOnServerBorder: bot offset from the player's own connection only
    const borderIdx = ogSrc.indexOf('if (~~(maxX - minX) === LM.mapSize && ~~(maxY - minY) === LM.mapSize && window.userBots && this === window.legendmod) {');
    const borderSrc = borderIdx > -1 ? extract('if (~~(maxX', borderIdx) : null;
    check('ogario: bot offset block found', !!borderSrc);
    const borderCase = (isMain, minX, minY, maxX, maxY) => {
        const self = {};
        const w = { userBots: { offsetX: 0, offsetY: 0 }, legendmod: isMain ? self : {} };
        run('var minX = ' + minX + ', minY = ' + minY + ', maxX = ' + maxX + ', maxY = ' + maxY + ';\n' + borderSrc, { window: w, LM: { mapSize: 14142 } }, self);
        return w.userBots;
    };
    let bo = borderCase(true, 500 - 7071, -300 - 7071, 500 + 7071, -300 + 7071);
    check('ogario: bot offset = border centre of the player connection', bo.offsetX === 500 && bo.offsetY === -300 && bo.offsetFixed === true);
    bo = borderCase(false, -7071, -7071, 7071, 7071);
    check('ogario: bot offset not taken from another connection', bo.offsetFixed !== true && bo.offsetX === 0);
    bo = borderCase(true, 0, 0, 5000, 5000);
    check('ogario: bot offset not taken from a partial border', bo.offsetFixed !== true);

    // Start / Fill: agar.io only, session amount local
    check('ogario: Start requires legendmod.integrity', /getElementById\('startBots'\)\.addEventListener[\s\S]{0,400}if \(!legendmod\.integrity\) \{[\s\S]{0,200}game1\.bots\.agarOnly/.test(ogSrc));
    check('ogario: Fill requires legendmod.integrity', /getElementById\('brFillLobby'\)\.addEventListener[\s\S]{0,500}if \(!legendmod\.integrity\) \{[\s\S]{0,200}game1\.bots\.agarOnly/.test(ogSrc));
    check('ogario: Start clamps a local amount and records the session amount', ogSrc.includes('var _lmBotsN = Math.max(1, Math.min(window.bots.amount,') && ogSrc.includes('window.userBots.sessionAmount = _lmBotsN'));
    check('ogario: Fill while disconnected sets _brFillPending and connects', /_brFillPending = true\s*\n\s*window\.connectionBots\.connect\(\)/.test(ogSrc));
}

// ---- userscript: obsolete position/ghost-cell code removed ----
{
    const usSrc = fs.readFileSync(path.join(botsDir, 'free-agario-bots.vanilla.user.js'), 'utf8');
    check('userscript: no playerPosition buffer', !usSrc.includes('playerPosition(x, y)'));
    check('userscript: no playerPosInterval', !usSrc.includes('playerPosInterval'));
    check('userscript: no opcode 9 handler', !usSrc.includes('case 9:'));
    check('userscript: no botGhostCells', !usSrc.includes('window.botGhostCells'));
}

// ---- process.js: only restarts on non-zero exit ----
{
    const processSrc = fs.readFileSync(path.join(botsDir, 'process.js'), 'utf8');
    check('process.js restarts only on non-zero exit code', processSrc.includes('code !== 0'));
}

// ---- ogario.v4.js: built-in bot client integration ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');

    // playerPosition buffer removed (orbit/position-reporting not needed)
    check('ogario: no playerPosition buffer', !ogSrc.includes('playerPosition(x, y)'));
    check('ogario: no playerPosInterval in userBots', !ogSrc.includes('playerPosInterval'));

    // Mouse position sending uses connectionBots.send() (not broken readyState check)
    check('ogario: mouse position uses connectionBots.send', ogSrc.includes('window.connectionBots.send(window.buffers.mousePosition('));
    check('ogario: no broken readyState===1 check on connectionBots', !ogSrc.includes('window.connectionBots.readyState === 1'));

    // Player position no longer sent alongside mouse
    check('ogario: no player position sent with mouse', !ogSrc.includes('window.connectionBots.send(window.buffers.playerPosition('));

    // displayPartyBots shows button in FFA/EXP/BR
    check('ogario: displayPartyBots shows in FFA', ogSrc.includes('legendmod.gameMode === ":ffa"') && ogSrc.includes('.show()'));
    check('ogario: displayPartyBots shows in EXP', ogSrc.includes('legendmod.gameMode === ":experimental"'));
    check('ogario: displayPartyBots shows in BR', ogSrc.includes('legendmod.gameMode === ":battleroyale"'));

    // Start bots gate allows FFA/EXP/BR
    check('ogario: start bots gate includes FFA', ogSrc.includes('":ffa"') && ogSrc.includes('":experimental"') && ogSrc.includes('":battleroyale"'));

    // Menu background uses fixed attachment for shared background
    check('ogario: menu bg uses background-attachment:fixed', ogSrc.includes('background-attachment:fixed'));
    check('ogario: menu bg uses viewport sizing', ogSrc.includes('100vw 100vh'));
}

// ---- ogario.v4.js: opcode 9 handled gracefully ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    check('ogario: handles opcode 9 from server', ogSrc.includes('case 9:'));
}

// ---- ogario.v4.js: Battle Royale bots button ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    check('ogario: BR bots section exists', ogSrc.includes('brBotsSection'));
    check('ogario: BR fill lobby button', ogSrc.includes('brFillLobby'));
    check('ogario: BR stop fill button', ogSrc.includes('brStopFill'));
    check('ogario: BR lobby status display', ogSrc.includes('brLobbyStatus'));
    // agar.io never sends the lobby size: learned from the player count when a countdown (176) starts, 15 until then
    check('ogario: BR lobby size learned at countdown start', ogSrc.includes("localStorage.setItem('lmBrStartPlayers'") && ogSrc.includes('brRequired - currentPlayers') && ogSrc.includes('var brRequired = 15'));
    // bots stay during the countdown (176) and leave when the battle begins (177), not on ring state 1
    check('ogario: BR bots leave only when the battle begins', ogSrc.includes('if (legendmod.battleRoyale.started)') && !ogSrc.includes('battleRoyale.state > 1') && ogSrc.includes('this.battleRoyale.started = true'));
    check('ogario: BR fill stops on mode change', /gameMode\s*!==\s*':battleroyale'.*brStopFilling/.test(ogSrc));
    check('ogario: BR watcher interval cleaned on stop', ogSrc.includes('clearInterval(window._brLobbyWatcher)'));
    // Lifecycle edge-case fixes
    check('ogario: brStopFilling exposed on window for onclose', ogSrc.includes('window._brStopFilling = brStopFilling'));
    check('ogario: onclose calls _brStopFilling', ogSrc.includes("typeof window._brStopFilling === 'function'"));
    check('ogario: BR fill rejects when lobby full', ogSrc.includes("needed <= 0"));
    check('ogario: BR watcher detects bot server disconnect', /brLobbyWatcher[\s\S]{0,800}readyState\s*!==\s*WebSocket\.OPEN[\s\S]{0,200}brStopFilling/.test(ogSrc));
}

// ---- Behavioral: sendMode uses opcode 7 for mode identification ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    const smMatch = ogSrc.match(/sendMode\(nick\)\s*\{([^}]+)\}/);
    check('ogario: sendMode function extractable', !!smMatch);
    if (smMatch) {
        const body = smMatch[1];
        check('ogario: sendMode uses opcode 7', body.includes('writeUint8(7)'));
        check('ogario: sendMode encodes nick with correct Writer size', body.includes('Writer(3 + nick.length)'));
    }
}

// ---- Behavioral: connectionBots.send() has proper WebSocket guard ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // The send method must check this.ws.readyState === WebSocket.OPEN
    const sendMatch = ogSrc.match(/send\(buffer\)\s*\{([^}]+)\}/);
    check('ogario: connectionBots.send has ws guard', !!sendMatch && sendMatch[1].includes('this.ws') && sendMatch[1].includes('WebSocket.OPEN'));
}

// ---- Behavioral: opcode 7 round-trip with Writer and Reader ----
{
    // Test that an opcode 7 position message is correctly parsed by Reader
    const Writer = require(path.join(botsDir, 'writer'));
    const Reader = require(path.join(botsDir, 'reader'));
    const w = new Writer(9);
    w.writeUint8(7);
    w.writeInt32(-5000);
    w.writeInt32(3200);
    const buf = Buffer.from(w.buffer);
    check('opcode 7 round-trip: buffer is 9 bytes', buf.length === 9);
    check('opcode 7 round-trip: opcode byte', buf[0] === 7);
    const r = new Reader(buf);
    r.readUint8(); // skip opcode
    check('opcode 7 round-trip: x decoded', r.readInt32() === -5000);
    check('opcode 7 round-trip: y decoded', r.readInt32() === 3200);
}

// ---- ogario.v4.js: BR i18n (translated strings) ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // HTML template uses i18n data attributes
    check('ogario: BR section uses data-i18n for lobby title', ogSrc.includes('data-i18n="game2.brLobbyTitle"'));
    check('ogario: BR section uses data-i18n for waiting data', ogSrc.includes('data-i18n="game2.brWaitingData"'));
    check('ogario: BR fill button uses data-i18n', ogSrc.includes('data-i18n="game2.brFillLobby"'));
    check('ogario: BR stop button uses data-i18n', ogSrc.includes('data-i18n="game2.brStop"'));
    // JS logic uses _lmTH for translated toastr messages
    check('ogario: BR mode required message uses i18n', ogSrc.includes("_lmTH('game2.brModeRequired'"));
    check('ogario: BR connecting message uses i18n', ogSrc.includes("_lmTH('game2.brConnecting'"));
    check('ogario: BR no game server message uses i18n', ogSrc.includes("_lmTH('game2.brNoGameServer'"));
    check('ogario: BR bots running message uses i18n', ogSrc.includes("_lmTH('game2.brBotsRunning'"));
    check('ogario: BR lobby full message uses i18n', ogSrc.includes("_lmTH('game2.brLobbyFull'"));
    check('ogario: BR filling message uses i18n', ogSrc.includes("_lmTH('game2.brFilling'"));
    check('ogario: BR disconnected message uses i18n', ogSrc.includes("_lmTH('game2.brDisconnected'"));
    check('ogario: BR game started message uses i18n', ogSrc.includes("_lmTH('game2.brGameStarted'"));
    // Status text uses translated state strings
    check('ogario: BR status uses i18n state strings', ogSrc.includes("_lmTH('game2.brStateWaiting'"));
    check('ogario: BR status uses i18n players template', ogSrc.includes("_lmTH('game2.brPlayers'"));
    check('ogario: BR not in lobby uses i18n', ogSrc.includes("_lmTH('game2.brNotInLobby'"));
    // No hardcoded English in BR toastr (all toastr calls use _lmTH)
    check('ogario: BR no hardcoded "Battle Royale mode required" in toastr', !ogSrc.includes("']:</b> Battle Royale mode required'"));
    check('ogario: BR no hardcoded "Connecting to bot server" in toastr', !ogSrc.includes("']:</b> Connecting to bot server"));
}

// ---- ogario.v4.js: BR theme consistency ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // BR section uses CSS custom properties instead of hardcoded colors
    check('ogario: BR section background uses CSS var', ogSrc.includes('var(--lm-pc2,rgba(0,0,0,0.3))'));
    check('ogario: BR title color uses CSS var', ogSrc.includes('var(--lm-tc-h,#ff9800)'));
    check('ogario: BR section no hardcoded background rgba(0,0,0,0.3) in brBotsSection', !ogSrc.includes('brBotsSection" style="display:none;margin:8px 15px;padding:8px;border-radius:var(--lm-radius,6px);background:rgba(0,0,0,0.3)'));
}

// ---- ogario.v4.js: BR waiting-lobby validation ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // 177 means the battle began (not 'joined'): the fill is refused only during the countdown or the battle
    check('ogario: BR fill refused during countdown or battle', ogSrc.includes('if (br.started || br.countdown)') && !ogSrc.includes('!br.joined || br.state !== 0'));
    check('ogario: BR 178 without flags (lobby) is read safely', ogSrc.includes('data.byteLength >= s + 2 ? data.getUint16(s, true) : 0'));
    check('ogario: BR fill shows not-waiting message', ogSrc.includes("_lmTH('game2.brNotWaiting'"));
}

// ---- i18n: BR keys exist in game2.json ----
{
    const game2 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'i18n', 'src', 'game2.json'), 'utf8'));
    const brKeys = ['brLobbyTitle', 'brWaitingData', 'brFillLobby', 'brStop', 'brPlayers',
                    'brStateWaiting', 'brStateStarting', 'brStateInGame', 'brNotInLobby',
                    'brModeRequired', 'brConnecting', 'brNoGameServer', 'brBotsRunning',
                    'brLobbyFull', 'brNotWaiting', 'brFilling', 'brDisconnected', 'brGameStarted'];
    for (const key of brKeys) {
        const fullKey = 'game2.' + key;
        check('i18n: ' + fullKey + ' has en', !!(game2[fullKey] && game2[fullKey].en));
        check('i18n: ' + fullKey + ' has el', !!(game2[fullKey] && game2[fullKey].el));
    }
}

// ---- ogario.v4.js: P4 CAPTCHA popup security ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // The message listener must check event.origin
    check('captcha: message listener checks event.origin', ogSrc.includes("event.origin !== 'https://agar.io'"));
    // The message listener must verify event.source against registered popup windows
    check('captcha: message listener checks event.source against capthaWindow', ogSrc.includes('event.source === window.capthaWindow[ci]'));
    // The message listener must require an active bot connection
    check('captcha: message listener requires active bot connection', ogSrc.includes('connectionBots.ws.readyState !== WebSocket.OPEN') && ogSrc.includes('!window.connectionBots.ws'));
    // Verify guards appear BEFORE sendSpawn2 within the message listener
    // Find the listener body between addEventListener("message" and the matching closing
    const listenerStart = ogSrc.indexOf('addEventListener("message", function (event)');
    const spawnCall = listenerStart > -1 ? ogSrc.indexOf('sendSpawn2', listenerStart) : -1;
    const originCheck = listenerStart > -1 ? ogSrc.indexOf("event.origin", listenerStart) : -1;
    const sourceCheck = listenerStart > -1 ? ogSrc.indexOf("event.source", listenerStart) : -1;
    check('captcha: message listener found', listenerStart > -1 && spawnCall > -1);
    check('captcha: origin check appears before sendSpawn2', originCheck > -1 && originCheck < spawnCall);
    check('captcha: source check appears before sendSpawn2', sourceCheck > -1 && sourceCheck < spawnCall);
}

console.log('\n' + (fail ? 'FAIL: ' + fail + ' failure(s)' : 'ALL PASS'));
process.exit(fail ? 1 : 0);
