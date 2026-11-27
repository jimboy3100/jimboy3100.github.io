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
        check(tag + 'open alone is not counted as connected (the socket can still hang)', st().connectedBots === 0);
        const sentBefore = b1.ws.sent.length;
        ready(b1);
        check(tag + '242 counts one connected bot', st().connectedBots === 1);
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
        check(tag + 'bot sockets get a handshake timeout (a game server that never answers the upgrade)', FakeWS.instances.every(w => w.opts.handshakeTimeout === 10000));

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
            // the matchmaker's current endpoints: region and arena address in the path
            check(tag + 'gameHost accepts miniclippt arenas with path', M.gameHost('wss://web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/10.1.2.3') === 'web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/10.1.2.3');
            check(tag + 'gameHost refuses other hosts', M.gameHost('wss://ffa.legendmod.ml:8080') === null && M.gameHost('wss://agario.miniclippt.com.evil.example/x') === null);
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
            check(tag + 'orientation ' + fx + '/' + fy + ' follow target', t && Math.abs(t[0] - (1234 * fx + CX)) <= 2 && Math.abs(t[1] - (-567 * fy + CY)) <= 2);
        });
        {
            // agar.io: each connection's full border has its own width/height (14073..14210) and centre;
            // the player sends canonical units u = (raw - C) * 14142.1356 / W, each bot maps them back
            const S = 14142.135623730952;
            const P = { cx: 812.25, cy: -1540.5, w: 14189.596, h: 14110.375 };   // the player's map
            const Q = { cx: -2210.75, cy: 3305.125, w: 14098.493, h: 14197.902 }; // this bot's map
            const border = m => b => b.handleCompressedBuffer(Buffer.concat([Buffer.from([64]), f64(m.cx - m.w / 2), f64(m.cy - m.h / 2), f64(m.cx + m.w / 2), f64(m.cy + m.h / 2)]));
            const canon = (m, x, y) => [Math.round((x - m.cx) * S / m.w), Math.round((y - m.cy) * S / m.h)];
            // the same top players, raw in the player's map; on the bot's map: scaled, own centre, mirrored
            const players = [{ x: 4000, y: -5200, mass: 5000 }, { x: -3500, y: 2500, mass: 3000 }, { x: 1800, y: 4700, mass: 1500 }];
            const onBot = (fx, fy) => players.map(r => ({ x: Q.cx + fx * (r.x - P.cx) * Q.w / P.w, y: Q.cy + fy * (r.y - P.cy) * Q.h / P.h, mass: r.mass }));
            cases.forEach(([fx, fy]) => {
                c = begin(5);
                const b = newBot(); ready(b);
                b.handleCompressedBuffer(Buffer.concat([Buffer.from([64]), f64(-2125), f64(-1280), f64(2125), f64(1280)])); // view rect
                const viewRectIgnored = !b.offsetFixed;
                border(Q)(b);
                border({ cx: 0, cy: 0, w: 4250, h: 2560 })(b); // view rects later change nothing
                check(tag + 'scaled map ' + fx + '/' + fy + ': view rects ignored, first full border = map', viewRectIgnored && b.offsetFixed && Math.abs(b.offsetX - Q.cx) < 1e-9 && Math.abs(b.offsetY - Q.cy) < 1e-9 && Math.abs(b.scaleX - Q.w / S) < 1e-12 && Math.abs(b.scaleY - Q.h / S) < 1e-12);
                M.handleUserMessage(c, op10(players.map(r => { const u = canon(P, r.x, r.y); return { x: u[0], y: u[1], mass: r.mass }; })));
                b.handleCompressedBuffer(Buffer.concat([Buffer.from([69]), u16(players.length),
                    ...onBot(fx, fy).map(r => Buffer.concat([i32(Math.round(r.x)), i32(Math.round(r.y)), u32(r.mass), Buffer.from([0])]))]));
                check(tag + 'scaled map ' + fx + '/' + fy + ': orientation detected', b.orientFixed && b.fixX === fx && b.fixY === fy);
                const mouse = { x: 3333.3, y: -4444.4 }; // the player's mouse, raw in the player's map
                const u = canon(P, mouse.x, mouse.y);
                const t = followTarget(b, u[0], u[1]);
                const want = [Q.cx + fx * (mouse.x - P.cx) * Q.w / P.w, Q.cy + fy * (mouse.y - P.cy) * Q.h / P.h];
                check(tag + 'scaled map ' + fx + '/' + fy + ': bot targets the player\'s mouse within 2 units', t && Math.abs(t[0] - want[0]) <= 2 && Math.abs(t[1] - want[1]) <= 2);
            });
        }
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
            check(tag + 'fallback after 10 s: 1/1, provisional', b.orientFixed && b.orientProvisional && b.fixX === 1 && b.fixY === 1);
            b.handleCompressedBuffer(op69(refs, -1, -1));
            M.handleUserMessage(c, op10(refs));
            check(tag + 'after the fallback a real decision (opcode 10) replaces it', b.fixX === -1 && b.fixY === -1 && b.orientFixed && !b.orientProvisional);
            b.handleCompressedBuffer(op69(refs, 1, 1));
            M.handleUserMessage(c, op10(refs));
            check(tag + 'a real decision then stays', b.fixX === -1 && b.fixY === -1);
            // the same through opcode 69 arriving after the player's reference
            const b2 = orientBot();
            Date.now = () => b2.offsetFixedAt + 10001;
            try { b2.move(); } finally { Date.now = realNow; }
            M.handleUserMessage(c, op10(refs));
            b2.handleCompressedBuffer(op69(refs, 1, -1));
            check(tag + 'after the fallback a real decision (opcode 69) replaces it', b2.fixX === 1 && b2.fixY === -1 && !b2.orientProvisional);
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

// ---- bot core reliability (fake clock): hung sockets, refused connections, captcha status, eat list ----
{
    const core = require(path.join(botsDir, 'botcore'));
    const real = { setTimeout: global.setTimeout, clearTimeout: global.clearTimeout, setInterval: global.setInterval, clearInterval: global.clearInterval, now: Date.now };
    let now = 1e12, seq = 0;
    const timers = new Map();
    const add = (fn, ms, every) => { const id = ++seq; timers.set(id, { fn, at: now + Math.max(0, ms || 0), every }); return id; };
    const advance = ms => {
        const end = now + ms;
        for (;;) {
            let next = null;
            for (const [id, t] of timers) if (t.at <= end && (!next || t.at < next[1].at)) next = [id, t];
            if (!next) break;
            now = next[1].at;
            if (next[1].every) next[1].at += next[1].every; else timers.delete(next[0]);
            next[1].fn();
        }
        now = end;
    };
    global.setTimeout = (fn, ms) => add(fn, ms); global.clearTimeout = id => { timers.delete(id); };
    global.setInterval = (fn, ms) => add(fn, ms, ms); global.clearInterval = id => { timers.delete(id); };
    Date.now = () => now;
    let threw = null;
    try {
        const URL1 = 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/1-2-3-4';
        const start = n => Buffer.concat([Buffer.from([0]), Buffer.from(URL1), Buffer.from([0]), u32(22), u32(31000), Buffer.from([1]), Buffer.from('b'), Buffer.from([0, n])]);
        const logs = [];
        const session = n => {
            const S = core.createServer({ WebSocket: FakeWS, log: { good() {}, warn: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push(a.join(' ')) } });
            const c = new FakeClient();
            S.onUserConnection(c);
            FakeWS.instances.length = 0;
            S.handleUserMessage(c, start(n));
            advance(160 * n);
            return { S, c, status: () => { const s = c.sent.filter(b => b[0] === 4).pop(); return s ? Array.from(s) : null; } };
        };
        const msg = (ws, bytes) => ws.onmessage({ data: Buffer.from(bytes) });
        const refuse = (ws, code) => { ws.readyState = 3; ws.onclose({ code }); };
        const nextSocket = () => { const n = FakeWS.instances.length; for (let i = 0; i < 40 && FakeWS.instances.length === n; i++) advance(500); return FakeWS.instances[FakeWS.instances.length - 1]; };

        // hung sockets: no 242 / no answer to the spawn within 10 s -> closed, the bot reconnects
        let { S, c, status } = session(2);
        const [b1, b2] = S.userBots, [w1, w2] = FakeWS.instances;
        w1.open(); w2.open();
        advance(1000);
        check('core: open sockets are not counted as connected before 242', status()[1] === 0);
        msg(w1, [242]);
        advance(1000);
        check('core: status [4, connected, spawned, captcha, stopped]: 242 counts the bot', JSON.stringify(status()) === '[4,1,0,0,0]');
        advance(8500);
        check('core: no 242 within 10 s: the socket is closed, the bot reconnects', w2.readyState === 3 && b2.ws === null && !!b2.reconnectTimeout && b2.failures === 1 && logs.some(l => /no handshake/.test(l)));
        check('core: spawn sent 9.5 s ago: still waiting', w1.readyState === 1 && b1.failures === 0);
        advance(1000);
        check('core: no answer to the spawn within 10 s: the socket is closed', w1.readyState === 3 && b1.ws === null && b1.failures === 1 && logs.some(l => /no answer to spawn/.test(l)));
        // the reconnected bot spawns: its failures are forgotten; a later close is no failure
        const w3 = nextSocket();
        const bw3 = S.userBots.find(b => b.ws === w3);
        w3.open(); msg(w3, [242]); msg(w3, [32, ...u32(777)]);
        check('core: spawned after reconnecting: no deadline, failures reset', bw3.isAlive && !bw3.deadlineTimeout && bw3.failures === 0);
        advance(20000);
        check('core: a playing bot is never closed by a deadline', w3.readyState === 1 && bw3.isAlive);
        // eat list: the bot's cell eaten (eat record only) -> dead, respawns at once
        const spawns = () => w3.sent.filter(p => p[0] === 0).length;
        const before = spawns();
        bw3.handleCompressedBuffer(Buffer.concat([Buffer.from([16]), u16(1), u32(999), u32(777), u32(0), u16(0)]));
        check('core: a cell eaten in the eat list (not in the remove list) is a death: respawn sent', !bw3.isAlive && bw3.cellsIDs.length === 0 && spawns() === before + 1 && !!bw3.deadlineTimeout);
        msg(w3, [32, ...u32(778)]);
        refuse(w3, 1006);
        check('core: closed after it spawned on that socket: no failure counted', bw3.failures === 0 && !!bw3.reconnectTimeout);
        // refused again and again (403 -> 1006): the bot stops after 6 failures; the session goes on
        const other = S.userBots.find(b => b !== bw3);
        let guard = 0;
        while (!other.gaveUp && guard++ < 20) {
            const w = nextSocket();
            if (w === bw3.ws) { w.open(); msg(w, [242]); msg(w, [32, ...u32(900 + guard)]); continue; }
            if (other.ws === w) refuse(w, 1006);
        }
        check('core: 6 refused connections in a row: the bot stops (no reconnect), close code kept and logged', other.gaveUp && other.failures === 6 && !other.reconnectTimeout && other.ws === null && other.lastCloseCode === 1006 && logs.some(l => /close code 1006/.test(l)));
        const n = FakeWS.instances.length;
        advance(60000);
        check('core: a stopped bot opens no socket any more; status counts it', !FakeWS.instances.slice(n).some(w => other.ws === w) && status()[4] === 1 && c.count([14]) === 0 && S.session.active);
        // the last bot fails too: client gets 14 + close code, then 1 and 2, session over
        guard = 0;
        if (bw3.ws) refuse(bw3.ws, 1006);
        while (!bw3.gaveUp && guard++ < 20) { const w = nextSocket(); if (bw3.ws === w) refuse(w, 1006); }
        advance(2500);
        const m14 = c.sent.find(b => b[0] === 14);
        check('core: every bot stopped: client gets 14 with the close code, then 1 and 2, session ends', !!m14 && m14.length === 3 && m14.readUInt16LE(1) === 1006 &&
            c.sent.findIndex(b => b[0] === 14) < c.sent.findIndex(b => b.length === 1 && b[0] === 1) && c.count([2]) === 1 && !S.session.active && S.userBots.length === 0);
        const left = [...timers.values()].filter(t => !t.every).length;
        check('core: after the session ended no bot timer is left', left === 0);
        S.onUserClose(c);

        // captcha: waiting bots keep their socket (no deadline, no failure) and are counted
        ({ S, c, status } = session(1));
        const w = FakeWS.instances[0], b = S.userBots[0];
        w.open(); msg(w, [242]); msg(w, [85]);
        advance(60000);
        check('core: a bot waiting for a captcha is not closed by a deadline', w.readyState === 1 && b.waitingToken === 'spawn' && !b.deadlineTimeout);
        check('core: status counts the bot waiting for a captcha', JSON.stringify(status()) === '[4,1,0,1,0]');
        refuse(w, 1006);
        check('core: a socket lost while waiting for a captcha is no failure', b.failures === 0 && !!b.reconnectTimeout);
        S.resetServer(); S.onUserClose(c);
        check('core: reset leaves no timer', timers.size === 0);

        // a socket that cannot be created: counted like a refused one, no exception
        const Throwing = function () { throw new Error('bad url'); };
        const S3 = core.createServer({ WebSocket: Throwing, log: {} });
        const c3 = new FakeClient(); S3.onUserConnection(c3);
        S3.handleUserMessage(c3, start(1));
        advance(200);
        advance(120000);
        check('core: WebSocket constructor throwing: the bot stops after 6 tries, client gets 14', S3.userBots.length === 0 && c3.count([2]) === 1 && c3.sent.some(m => m[0] === 14));
        S3.onUserClose(c3);
    } catch (e) {
        threw = e;
    } finally {
        Object.assign(global, { setTimeout: real.setTimeout, clearTimeout: real.clearTimeout, setInterval: real.setInterval, clearInterval: real.clearInterval });
        Date.now = real.now;
    }
    check('core: reliability suite ran without exceptions' + (threw ? ' (' + threw.stack + ')' : ''), !threw);
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

// ---- agario-bots.zip (the README's download of the Node.js server): the current files, byte for byte ----
{
    const zlib = require('zlib'), os = require('os'), { execFileSync } = require('child_process');
    const { FILES, fileBytes } = require(path.join(__dirname, '..', 'bots-zip.js'));
    const zip = fs.readFileSync(path.join(botsDir, 'agario-bots.zip'));
    /* entries from the central directory, data inflated from each local header */
    const entries = {};
    let end = zip.length - 22;
    while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
    for (let i = 0, p = end >= 0 ? zip.readUInt32LE(end + 16) : 0, n = end >= 0 ? zip.readUInt16LE(end + 10) : 0; i < n; i++) {
        const method = zip.readUInt16LE(p + 10), csize = zip.readUInt32LE(p + 20), nlen = zip.readUInt16LE(p + 28);
        const xlen = zip.readUInt16LE(p + 30), clen = zip.readUInt16LE(p + 32), off = zip.readUInt32LE(p + 42);
        const name = zip.toString('utf8', p + 46, p + 46 + nlen);
        const start = off + 30 + zip.readUInt16LE(off + 26) + zip.readUInt16LE(off + 28), raw = zip.subarray(start, start + csize);
        entries[name] = method === 8 ? zlib.inflateRawSync(raw) : raw;
        p += 46 + nlen + xlen + clen;
    }
    const names = Object.keys(entries);
    const hint = ' (rebuild: node developers/bots-zip.js)';
    check('agario-bots.zip holds exactly the server files, no node_modules' + hint,
        names.length === FILES.length && FILES.every((f) => entries[f]) && !names.some((n) => /node_modules|\//.test(n)));
    const stale = FILES.filter((f) => !entries[f] || !entries[f].equals(fileBytes(f)));
    check('agario-bots.zip: every entry equals the repo file byte for byte' + (stale.length ? ' (differs: ' + stale.join(', ') + ')' : '') + hint, !stale.length);
    /* and the bytes git holds, for the files without uncommitted changes */
    let gitStale = [];
    try {
        const repo = path.join(__dirname, '..', '..'), rel = (f) => 'ExampleScripts/agario-bots2/' + f;
        const dirty = execFileSync('git', ['-C', repo, 'diff', '--name-only', 'HEAD', '--', 'ExampleScripts/agario-bots2']).toString().split('\n');
        gitStale = FILES.filter((f) => entries[f] && !dirty.includes(rel(f))
            && !entries[f].equals(execFileSync('git', ['-C', repo, 'cat-file', 'blob', 'HEAD:' + rel(f)], { maxBuffer: 1 << 26 })));
    } catch (e) { /* not a git checkout */ }
    check('agario-bots.zip: entries equal the committed files' + (gitStale.length ? ' (differs: ' + gitStale.join(', ') + ')' : '') + hint, !gitStale.length);
    /* the extracted server parses, and everything it requires is in the ZIP or its package.json */
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-botszip-'));
    try {
        for (const n of names) if (!/[\\/]/.test(n)) fs.writeFileSync(path.join(tmp, n), entries[n]);
        let parsed = true;
        for (const f of ['server.js', 'server-fast.js', 'botcore.js']) {
            try { execFileSync(process.execPath, ['--check', path.join(tmp, f)], { stdio: 'pipe' }); } catch (e) { parsed = false; }
        }
        check('agario-bots.zip: node --check passes on the extracted server.js, server-fast.js and botcore.js', parsed);
        const missing = [], external = new Set();
        for (const n of names.filter((x) => /\.js$/.test(x))) {
            for (const m of entries[n].toString('utf8').matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)) {
                if (!m[1].startsWith('./')) { external.add(m[1]); continue; }
                const want = m[1].slice(2);
                if (![want, want + '.js', want + '.json'].some((c) => entries[c])) missing.push(n + ' -> ' + want);
            }
        }
        check('agario-bots.zip: every local file the server requires is in the ZIP' + (missing.length ? ' (' + missing.join(', ') + ')' : ''), !missing.length);
        const deps = Object.keys(JSON.parse(entries['package.json'].toString('utf8')).dependencies || {});
        const undeclared = [...external].filter((d) => !deps.includes(d) && !require('module').builtinModules.includes(d));
        check('agario-bots.zip: every package the server requires is in its package.json' + (undeclared.length ? ' (' + undeclared.join(', ') + ')' : ''), !undeclared.length);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    const readme = fileBytes('README.md').toString('utf8');
    check('bots README: no http:// link', !/http:\/\//.test(readme));
    check('bots README: links the ZIP on www.legendmod.ml', readme.includes('(https://www.legendmod.ml/ExampleScripts/agario-bots2/agario-bots.zip)'));
    check('bots README: says to allow Chrome\'s local network access for ws://localhost:1337', /local network access/i.test(readme) && readme.includes('ws://localhost:1337'));
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
    const el = () => ({ style: {}, disabled: false, innerText: '', attrs: {}, setAttribute(k, v) { this.attrs[k] = String(v); }, click() { this.clicked = (this.clicked || 0) + 1; } });

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
    const followSrc = ['window._lmBotsForget = function', 'window._lmBotsCannotFollow = function', 'window._lmBotsTryResume = function',
        'window._lmBotsAiShow = function', 'window._lmBotsAiToggle = function', 'window._lmBotsClampAmount = function'].map(m => extract(m))
        .concat([(ogSrc.match(/window\._lmBotsMax = \d+/) || [''])[0], (ogSrc.match(/window\._lmBotsServerMax = \d+/) || [''])[0]]);
    check('ogario: _lmBotsStop and the follow helpers extractable', !!stopSrc && followSrc.every(Boolean));
    /* Bots AI toggle, amount 0..20, players + bots + the player at most 180 (owner, 2026-11-28) */
    {
        const sent = [], els = {};
        const w = { userBots: { startedBots: false }, bots: { ai: false }, connectionBots: { send: b => sent.push(Array.from(new Uint8Array(b))) } };
        const sb = { window: w, document: { getElementById: id => els[id] || (els[id] = el()) }, lmT: k => k, _lmTH: (k, en) => en, Math, Number, Uint8Array, String };
        vm.createContext(sb);
        vm.runInContext(followSrc.join('\n'), sb);
        check('Bots AI: no toggle while no bots run', w._lmBotsAiToggle() === false && sent.length === 0 && w.bots.ai === false);
        w._lmBotsAiShow();
        check('Bots AI: the line looks off and says to start the bots first', els.aiTextBots.style.opacity === '0.6' && els.aiTextBots.attrs['aria-disabled'] === 'true' && /Start the bots/.test(els.aiTextBots.title));
        w.userBots.startedBots = true;
        check('Bots AI: on while bots run: message [4, 1], shown Enabled in green', w._lmBotsAiToggle() === true && JSON.stringify(sent[0]) === '[4,1]' && w.bots.ai === true && els.botsAI.innerText === 'Enabled' && els.botsAI.style.color === '#00C02E' && els.aiTextBots.attrs['aria-pressed'] === 'true');
        check('Bots AI: off again: message [4, 0], shown Disabled', w._lmBotsAiToggle() === true && JSON.stringify(sent[1]) === '[4,0]' && w.bots.ai === false && els.botsAI.innerText === 'game1.bots.disabled');
        check('amount: 0..20, older saved values (50, 190) become 20, junk becomes 20', w._lmBotsMax === 20 && w._lmBotsClampAmount(0) === 0 && w._lmBotsClampAmount('7') === 7 && w._lmBotsClampAmount('50') === 20 && w._lmBotsClampAmount(190) === 20 && w._lmBotsClampAmount(-3) === 0 && w._lmBotsClampAmount('x') === 20);
        check('server total: 180 (200 - 20)', w._lmBotsServerMax === 180);
    }
    check('ogario: Start refuses when players + 1 (the player) leave no room under 180, before connecting', /var _lmBotsRoom = window\._lmBotsServerMax - _lmBotsTotal - 1\s+if \(_lmBotsRoom < 1\) return refuse\(_lmTH\('pkg\.bots\.serverFull'[\s\S]{0,600}cb\.ensure\('start'\)/.test(ogSrc));
    check('ogario: the amount field is 0..20 and saved values are clamped', ogSrc.includes('id="botsAmount" ${_lmG1a(\'placeholder\', \'game1.bots.amountPh\')} min="0" max="20"') && ogSrc.includes('window.bots.amount = window._lmBotsClampAmount(storedbotsamount)') && ogSrc.includes('window.bots.amount = window._lmBotsClampAmount(this.value)'));
    check('ogario: the Bots AI line is a button (click, Enter / Space) and the hotkey uses the same toggle', ogSrc.includes('<span id="aiTextBots" role="button" tabindex="0"') && /aiLine\.addEventListener\('click', \(\) => \{ window\._lmBotsAiToggle\(\) \}\)/.test(ogSrc) && /'hk-bots-ai': \{[\s\S]{0,300}window\._lmBotsAiToggle\(\)/.test(fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'hotkeysCommand.js'), 'utf8')));
    /* window with the real _lmBotsStop / follow helpers, fake timers and toasts */
    const followWin = (o) => {
        const sent = [], toasts = [], timers = [];
        let cancels = 0, starts = 0;
        const w = {
            userBots: Object.assign({ startedBots: false, startSent: false, offsetFixed: true, offsetSeq: 1 }, o.userBots),
            legendmod: Object.assign({ ws: 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/5-6-7-8', integrity: true, _connectSeq: 2 }, o.legendmod),
            connectionBots: { pending: o.pending || null, ws: o.readyState == null ? null : { readyState: o.readyState }, send: b => sent.push(ab(b)), cancel() { cancels++; this.pending = null; } },
            _brFilling: !!o.filling,
            _lmBotsStart() { starts++; }
        };
        const sb = { window: w, WebSocket: { OPEN: 1 }, Uint8Array, Premadeletter123: 'LM', _lmTH: (k, d) => k,
            toastr: { warning: m => toasts.push(m) },
            setTimeout: (fn, ms) => { timers.push({ fn, ms, live: true }); return timers.length; },
            clearTimeout: id => { if (timers[id - 1]) timers[id - 1].live = false; } };
        run(stopSrc + '\n' + followSrc.join('\n') + '\nwindow._lmBotsResume = null', sb);
        return { w, sent, toasts, timers, get cancels() { return cancels; }, get starts() { return starts; } };
    };
    const stopCase = (startedBots, startSent, readyState) => {
        const f = followWin({ userBots: { startedBots, startSent }, readyState });
        f.w._lmBotsStop();
        return { sent: f.sent, startSent: f.w.userBots.startSent, cancels: f.cancels };
    };
    let r = stopCase(true, false, 1);
    check('ogario: _lmBotsStop sends [1] when bots run', r.sent.length === 1 && r.sent[0].equals(Buffer.from([1])));
    r = stopCase(false, true, 1);
    check('ogario: _lmBotsStop sends [1] while bots are starting', r.sent.length === 1 && r.startSent === false);
    r = stopCase(false, false, 1);
    check('ogario: _lmBotsStop sends nothing when nothing runs', r.sent.length === 0);
    check('ogario: _lmBotsStop always cancels a Start / Fill still connecting', r.cancels === 1);
    r = stopCase(true, true, 3);
    check('ogario: _lmBotsStop does not send on a closed socket, clears startSent', r.sent.length === 0 && r.startSent === false);
    r = stopCase(true, true, null);
    check('ogario: _lmBotsStop without a socket does not throw', r.sent.length === 0 && r.startSent === false);
    check('ogario: Stop button stops for good, a new game server stops with serverChange', /getElementById\('stopBots'\)\.addEventListener\('click', \(\) => \{\s*window\._lmBotsStop\(\)/.test(ogSrc) &&
        (ogSrc.match(/window\._lmBotsStop\(true\)/g) || []).length === 1 && /this\.arrowFB\[0\]\.visible = false;[\s\S]{0,200}window\._lmBotsStop\(true\)/.test(ogSrc));
    check('ogario: the player\'s map border (game ready) runs _lmBotsTryResume', /window\.userBots\.offsetFixed = true;\s*\/\*[^*]*\*\/\s*if \(window\._lmBotsResume && typeof window\._lmBotsTryResume === 'function'\) setTimeout\(window\._lmBotsTryResume, 0\)/.test(ogSrc));

    // bots follow the player to a new game server (mode / region switch, reconnect, version change, party)
    {
        let f = followWin({ userBots: { startedBots: true }, readyState: 1 });
        f.w._lmBotsStop(true);
        check('follow: server change with bots running: [1] sent, bots remembered, 30 s timer', f.sent.length === 1 && f.sent[0][0] === 1 && !!f.w._lmBotsResume && f.timers.length === 1 && f.timers[0].ms === 30000 && f.toasts.length === 0);
        check('follow: not before the old session ended (no message 2 yet)', f.w._lmBotsTryResume() === false && f.starts === 0);
        f.w.userBots.startedBots = false; // message 2
        f.w.userBots.offsetSeq = 1; // border of the old connection only
        check('follow: not before the new server\'s map border', f.w._lmBotsTryResume() === false && f.starts === 0);
        f.w.userBots.offsetSeq = 2;
        check('follow: old session over + new server ready: Start runs once, timer cleared', f.w._lmBotsTryResume() === true && f.starts === 1 && !f.w._lmBotsResume && !f.timers[0].live && f.w._lmBotsTryResume() === false && f.starts === 1);
        f = followWin({ userBots: { startedBots: true }, readyState: 1 });
        f.w._lmBotsStop(true);
        f.w.userBots.startedBots = false;
        f.w._lmBotsStop();
        f.w.userBots.offsetSeq = 2;
        check('follow: the Stop button after a server change: no restart', !f.w._lmBotsResume && f.w._lmBotsTryResume() === false && f.starts === 0 && !f.timers[0].live);
        f = followWin({ userBots: { startSent: true }, readyState: 1 });
        f.w._lmBotsStop(true);
        check('follow: bots still starting (Start sent) follow too', !!f.w._lmBotsResume);
        f = followWin({ pending: 'start' });
        f.w._lmBotsStop(true);
        f.w.userBots.offsetSeq = 2;
        check('follow: a Start still connecting follows too', f.w._lmBotsTryResume() === true && f.starts === 1);
        f = followWin({ readyState: 1 });
        f.w._lmBotsStop(true);
        check('follow: no bots running: nothing remembered', !f.w._lmBotsResume && f.timers.length === 0);
        f = followWin({ userBots: { startedBots: true }, readyState: 1, filling: true });
        f.w._lmBotsStop(true);
        check('follow: a Battle Royale fill does not follow', !f.w._lmBotsResume);
        f = followWin({ userBots: { startedBots: true }, readyState: 1, legendmod: { integrity: false } });
        f.w._lmBotsStop(true);
        check('follow: new server not on agar.io: toast "stopped because the game server changed", nothing pending', !f.w._lmBotsResume && f.toasts.length === 1 && f.toasts[0].includes('pkg.bots.serverChanged'));
        f = followWin({ userBots: { startedBots: true }, readyState: 1 });
        f.w._lmBotsStop(true);
        f.w.userBots.startedBots = false;
        f.w._lmBotsStop(true); // a second switch before the first server was ready: still remembered
        check('follow: a second server change keeps them remembered', !!f.w._lmBotsResume && f.toasts.length === 0);
        f.timers[0].fn();
        check('follow: new server not ready in 30 s: toast, nothing pending', !f.w._lmBotsResume && f.toasts.length === 1 && f.toasts[0].includes('pkg.bots.serverChanged') && (f.w.userBots.offsetSeq = 2, f.w._lmBotsTryResume() === false));
        check('follow: Start and Fill lobby forget a pending follow when they start', /window\.userBots\.startSent = true\s*\/\*[^*]*\*\/\s*if \(typeof window\._lmBotsForget === 'function'\) window\._lmBotsForget\(\)/.test(ogSrc) &&
            /window\.userBots\.startSent = true\s*if \(typeof window\._lmBotsForget === 'function'\) window\._lmBotsForget\(\)\s*window\.userBots\.sessionAmount = needed/.test(ogSrc));
    }

    // brResetFill / brStopFilling
    const resetSrc = extract('function brResetFill()');
    const stopFillSrc = extract('function brStopFilling()');
    check('ogario: brResetFill and brStopFilling extractable', !!resetSrc && !!stopFillSrc);
    const brCase = (filling, call, pending) => {
        const els = { brFillLobby: el(), brStopFill: el() };
        els.brFillLobby.style.display = 'none'; els.brStopFill.style.display = '';
        let stops = 0;
        const w = { _brFilling: filling, connectionBots: { pending: pending === undefined ? 'fill' : pending }, _lmBotsStop() { stops++; } };
        const result = run(resetSrc + '\n' + stopFillSrc + '\n' + call, { window: w, document: { getElementById: id => els[id] || null } });
        return { result, w, els, stops };
    };
    r = brCase(false, 'brResetFill()');
    check('ogario: brResetFill returns false when nothing runs, forgets a Fill waiting for the connection', r.result === false && r.w.connectionBots.pending === null && r.stops === 0);
    r = brCase(false, 'brResetFill()', 'start');
    check('ogario: brResetFill keeps a Start waiting for the connection', r.w.connectionBots.pending === 'start');
    r = brCase(true, 'brResetFill()');
    check('ogario: brResetFill clears the fill, restores buttons, sends nothing', r.result === true && r.w._brFilling === false &&
        r.els.brFillLobby.style.display === '' && r.els.brStopFill.style.display === 'none' && r.stops === 0);
    r = brCase(false, 'brStopFilling()');
    check('ogario: brStopFilling is a no-op when no fill runs', r.stops === 0);
    r = brCase(true, 'brStopFilling(); brStopFilling()');
    check('ogario: brStopFilling stops the fill bots once', r.stops === 1);
    check('ogario: no Battle Royale watcher timer (the lobby packets and the bot connection drive the fill)', !ogSrc.includes('_brLobbyWatcher') && !/setInterval\(\s*brUpdateSection/.test(ogSrc));
    check('ogario: brResetFill/brStopFilling exposed on window', ogSrc.includes('window._brStopFilling = brStopFilling') && ogSrc.includes('window._brResetFill = brResetFill'));
    check('ogario: BR fill no longer writes window.bots.amount', /needed = Math\.min\(needed, window\._lmBotsServerMax - currentPlayers - 1\)[\s\S]{0,1200}sessionAmount = needed/.test(ogSrc) && !/window\.bots\.amount = needed/.test(ogSrc));

    // connectionBots messages: 0, 1, 2, 4, 5 (gone), 12, 13
    const cbSrc = extract('window.connectionBots = {');
    check('ogario: connectionBots extractable', !!cbSrc);
    const makeCB = () => {
        const els = {}, toasts = [], html = {}, timers = [];
        const getEl = id => els[id] || (els[id] = el());
        const w = { userBots: { startedBots: false, startSent: true, isAlive: true, sessionAmount: 9 }, bots: { amount: 50, ai: true },
            addEventListener() {}, _brResetFill() { w.resets = (w.resets || 0) + 1; } };
        const sb = {
            window: w, DataView, Uint8Array, WebSocket: { OPEN: 1, CONNECTING: 0 },
            document: { getElementById: getEl },
            toastr: { info: m => toasts.push(['info', m]), warning: (m, t, o) => toasts.push(['warning', m, o]) },
            $: sel => ({ html: v => { html[sel] = v; } }),
            _lmG1set(e, k) { if (e) { e.i18n = k; } }, lmT: k => k, _lmTH: (k, d) => k,
            Premadeletter123: 'LM', setTimeout: f => timers.push(f)
        };
        run(cbSrc, sb);
        const cb = w.connectionBots;
        cb.sent = [];
        cb.ws = { readyState: 1 };
        cb.send = b => cb.sent.push(ab(b));
        const msg = bytes => cb.onmessage({ data: new Uint8Array(bytes).buffer });
        return { cb, w, els, toasts, html, timers, msg };
    };
    let k = makeCB();
    k.cb.onopen();
    check('ogario: onopen: status Connected, nothing else to run', k.els.userStatus.i18n === 'game1.bots.connected' && k.timers.length === 0);
    k.msg([0]);
    check('ogario: message 0 marks started, shows Stop and sends [5, isAlive]', k.w.userBots.startedBots === true && k.cb.sent.length === 1 && k.cb.sent[0].equals(Buffer.from([5, 1])) &&
        k.els.startBots.style.display === 'none' && k.els.stopBots.style.display === 'inline' && !k.els.stopBots.disabled);
    k.msg([4, 3, 2]);
    check('ogario: message 4 shows connected/spawned/sessionAmount', k.html['#botCount'] === '3/2/9');
    k.msg([5, 0]);
    check('ogario: message 5 (old bot servers) changes nothing: no fake "/200"', Object.keys(k.html).length === 1);
    k.msg([12]);
    const captchaToast = k.toasts.find(t => t[0] === 'warning' && t[1].includes('game1.bots.captchaNeeded'));
    check('ogario: message 12 is a plain notice: the bots wait (no captcha button, no popups)', !!captchaToast && captchaToast[1].includes('game1.bots.captchaWait') && !captchaToast[1].includes('<button') && !captchaToast[2]);
    k.msg([13]);
    check('ogario: message 13 toasts agarOnly', k.toasts.some(t => t[1].includes('game1.bots.agarOnly')));
    k.msg([1]);
    check('ogario: message 1 shows Stopping', k.els.stopBots.disabled === true && k.els.stopBots.i18n === 'game1.bots.stopping');
    k.msg([2]);
    check('ogario: message 2 resets the session, shows Start, resets a BR fill', k.w.userBots.startedBots === false && k.w.userBots.startSent === false && k.w.resets === 1 &&
        k.els.startBots.style.display === 'inline' && !k.els.startBots.disabled && k.els.stopBots.style.display === 'none');
    check('ogario: connectionBots has no captcha popups or token loop', !('startCaptcha' in k.cb) && !('closeCaptcha' in k.cb) && !('captchaActive' in k.cb));
    // status line: bots waiting for a captcha / refused (message 4 bytes 3 and 4), message 14, follow on message 2
    {
        const q = makeCB();
        q.cb.onopen();
        q.msg([4, 2, 0]);
        check('ogario: 3-byte status (older bot servers): status stays Connected', q.els.userStatus.i18n === 'game1.bots.connected');
        q.msg([4, 2, 0, 2, 0]);
        check('ogario: bots waiting for a captcha: the status line says so with the count, not Connected', q.els.userStatus.textContent === 'Waiting for a captcha: 2' && q.els.userStatus.style.color === '#FF9800');
        q.msg([4, 2, 1, 0, 1]);
        check('ogario: bots refused by the game server: counted in the status line', q.els.userStatus.textContent === 'Refused by the game server: 1');
        q.msg([4, 2, 2, 0, 0]);
        check('ogario: nobody waiting or refused: Connected again', q.els.userStatus.i18n === 'game1.bots.connected' && q.els.userStatus.style.color === '#00C02E');
        q.msg([14, 0xee, 0x03]);
        check('ogario: message 14: toast "refused", with the close code', q.toasts.some(t => t[0] === 'warning' && t[1].includes('pkg.bots.refused') && t[1].includes('(1006)')));
        let tries = 0;
        q.w._lmBotsTryResume = () => { tries++; };
        q.msg([2]);
        check('ogario: message 2 lets bots stopped by a server change follow (_lmBotsTryResume)', tries === 1);
    }

    // Start / Stop / Fill lobby: the real connectionBots, _lmBotsStop, botsStart and brFill with fake sockets
    const startSrc = extract('function botsStart()');
    const fillSrc = extract('function brFill()');
    const playersSrc = extract('function botsServerPlayersText()');
    check('ogario: botsStart, brFill and botsServerPlayersText extractable', !!startSrc && !!fillSrc && !!playersSrc);
    const flow = (opts) => {
        opts = opts || {};
        const els = {}, toasts = [], timers = [], socks = [], removed = [];
        const getEl = id => els[id] || (els[id] = el());
        class FakeSock {
            constructor(url, kind) {
                if (!kind && !/^wss?:\/\//.test(url)) throw new SyntaxError('bad url');
                this.url = url; this.kind = kind || 'ws'; this.readyState = 0; this.sent = []; socks.push(this);
            }
            send(d) { this.sent.push(typeof d === 'string' ? d : ab(d)); }
            close() { if (this.readyState === 3) return; this.readyState = 3; if (this.onclose) this.onclose({}); }
            open() { this.readyState = 1; if (this.onopen) this.onopen({}); }
            fail() { this.readyState = 3; if (this.onclose) this.onclose({}); }
            push(bytes) { if (this.onmessage) this.onmessage({ data: new Uint8Array(bytes).buffer }); }
        }
        FakeSock.CONNECTING = 0; FakeSock.OPEN = 1;
        const w = {
            SERVER_HOST: opts.host == null ? 'browser' : opts.host, OgVer: '9.9',
            userBots: { startedBots: false, startSent: false, isAlive: true }, bots: { amount: opts.amount == null ? 50 : opts.amount, nameLM: 'Bot', ai: false },
            gameBots: { protocolVersion: 22, clientVersion: 31000 }, EnvConfig: { configVersion: 1 }, master: { clientVersion: 31000 },
            buffers: B, unescape, encodeURIComponent, _brFilling: false, _brLobbyWatcher: null,
            LMBotsWorkerSocket: function (src) { return new FakeSock(src, 'worker'); }
        };
        const lm = Object.assign({ ws: 'wss://live-arena-q1w2.agar.io:443', integrity: true, gameMode: ':ffa', leaderboard: [], battleRoyale: { players: 0, started: false, countdown: false } }, opts.lm || {});
        const sb = {
            window: w, legendmod: lm, ogarcopythelb: { nick: 'Me' }, WebSocket: FakeSock, DataView, Uint8Array, Math, Number, parseInt,
            document: { getElementById: getEl },
            toastr: { info: m => toasts.push(m), warning: m => toasts.push(m), success: m => toasts.push(m) },
            $: () => ({ html() {}, is: () => true }),
            _lmG1set(e, key) { if (e) e.i18n = key; }, lmT: key => key, _lmTH: key => key, Premadeletter123: 'LM',
            setTimeout: f => { timers.push(f); return timers.length; }, clearTimeout() {}, setInterval: () => 99, clearInterval() {},
            localStorage: { getItem: () => null, removeItem: key => removed.push(key) }
        };
        run(cbSrc + '\n' + stopSrc + '\n' + followSrc.join('\n') + '\nwindow._lmBotsResume = null\n' + resetSrc + '\n' + stopFillSrc + '\n' + startSrc + '\n' + fillSrc +
            '\nfunction brUpdateSection() {}\nwindow._lmBotsStart = botsStart; window._lmBrFill = brFill; window._brResetFill = brResetFill; window._brStopFilling = brStopFilling', sb);
        const cb = w.connectionBots;
        const flush = () => { while (timers.length) timers.shift()(); };
        const ops = s => s.sent.filter(p => typeof p !== 'string').map(p => p[0]);
        return { w, lm, cb, els, toasts, socks, removed, flush, ops, start: () => w._lmBotsStart(), fill: () => w._lmBrFill(), stop: () => w._lmBotsStop() };
    };
    for (const [path, host] of [['worker', 'browser'], ['ws', 'ws://localhost:1337']]) {
        const f = flow({ host });
        f.start();
        const s = f.socks[0];
        check('Start (' + path + '): one click connects: ' + (path === 'worker' ? 'the browser worker with the bot core' : 'the bot server of the address field'), f.socks.length === 1 && s.kind === path &&
            s.url === (path === 'worker' ? 'https://www.legendmod.ml/ExampleScripts/agario-bots2/botcore.js?v=9.9' : 'ws://localhost:1337'));
        check('Start (' + path + '): while connecting: status Connecting, Stop shown, Start hidden, nothing sent yet', f.els.userStatus.i18n === 'game1.bots.connecting' && f.cb.pending === 'start' &&
            f.els.startBots.style.display === 'none' && f.els.startBots.disabled && f.els.stopBots.style.display === 'inline' && !f.els.stopBots.disabled && s.sent.length === 0 && !f.w.userBots.startSent);
        f.start(); f.start();
        check('Start (' + path + '): double click while connecting: one connection, no second start, no notice', f.socks.length === 1 && f.toasts.length === 0 && f.cb.pending === 'start');
        s.open();
        check('Start (' + path + '): connected: status Connected', f.els.userStatus.i18n === 'game1.bots.connected' && f.cb.pending === null);
        f.flush();
        const startPk = s.sent.find(p => typeof p !== 'string' && p[0] === 0);
        check('Start (' + path + '): starts once connected: startBots (game url, amount: 50 typed, 20 sent) and the player nick (7)', JSON.stringify(f.ops(s)) === '[0,7]' && !!startPk &&
            startPk.includes(Buffer.from('wss://live-arena-q1w2.agar.io:443')) && startPk[startPk.length - 1] === 20 && f.w.userBots.startSent === true && f.w.userBots.sessionAmount === 20);
        f.start();
        check('Start (' + path + '): a further click: "Bots already running", nothing sent', f.ops(s).length === 2 && f.toasts.length === 1 && f.toasts[0].includes('game2.brBotsRunning'));
        s.push([0]);
        check('Start (' + path + '): message 0: running, Stop shown', f.w.userBots.startedBots === true && f.els.stopBots.style.display === 'inline');
        f.stop();
        check('Stop (' + path + '): sends [1], the connection stays open', f.ops(s)[f.ops(s).length - 1] === 1 && s.readyState === 1);
        s.push([1]); s.push([2]);
        check('Stop (' + path + '): 1 then 2: Start shown again, Status still Connected', f.els.startBots.style.display === 'inline' && !f.els.startBots.disabled && f.els.stopBots.style.display === 'none' &&
            f.els.userStatus.i18n === 'game1.bots.connected' && !f.w.userBots.startedBots);
        f.start();
        check('Start (' + path + ') again while connected: starts at once on the same connection', f.socks.length === 1 && f.ops(s).filter(o => o === 0).length === 2);
        s.close();
        check('Start (' + path + '): connection closed: Disconnected, Start shown, "closed" notice', f.els.userStatus.i18n === 'game1.bots.disconnected' && f.els.startBots.style.display === 'inline' &&
            f.toasts.some(t => t.includes('game1.bots.wsClosed')) && !f.w.userBots.startSent);
    }
    {
        const f = flow({ host: 'ws://localhost:1337' });
        f.start();
        const s = f.socks[0];
        f.stop();
        check('Stop while connecting: cancelled: socket closed quietly, Disconnected, Start shown, no notice', s.readyState === 3 && s.onopen === null && f.cb.pending === null && f.cb.ws === null &&
            f.els.userStatus.i18n === 'game1.bots.disconnected' && f.els.startBots.style.display === 'inline' && !f.els.startBots.disabled && f.els.stopBots.style.display === 'none' && f.toasts.length === 0);
        f.flush();
        check('Stop while connecting: nothing is started later', s.sent.length === 0 && !f.w.userBots.startSent);
        f.start();
        check('Start after a cancel: a new connection', f.socks.length === 2 && f.cb.pending === 'start');
    }
    {
        const f = flow({ host: 'browser' });
        f.start();
        f.socks[0].fail();
        check('Start: connection failed: Disconnected, Start shown, notice to check the address', f.els.userStatus.i18n === 'game1.bots.disconnected' && f.cb.pending === null &&
            f.els.startBots.style.display === 'inline' && f.toasts.length === 1 && f.toasts[0].includes('game1.bots.connectFailed'));
        const g = flow({ host: 'localhost:1337' });
        g.w.application = { _lmQuickBotsShown: () => true };
        g.start();
        check('Start: an address that is not ws:// fails without throwing (address field shown: the notice)', g.socks.length === 0 && g.cb.ws === null && g.toasts.some(t => t.includes('game1.bots.connectFailed')) && g.els.startBots.style.display === 'inline');
    }
    {
        // a bot server address saved by an earlier version while the bots panel (its only editor) is hidden
        for (const host of ['wss://party-bots--legendmod.repl.co', 'ws://localhost:1337', 'localhost:1337']) {
            const f = flow({ host, lm: { gameMode: ':battleroyale', battleRoyale: { players: 5, started: false, countdown: false } } });
            f.w.application = { _lmQuickBotsShown: () => false };
            f.fill();
            if (f.socks[0] && f.socks[0].kind === 'ws') f.socks[0].fail();
            const wk = f.socks.find(x => x.kind === 'worker');
            check('Saved bot address ' + host + ' that does not answer, bots panel hidden: Fill lobby goes on with the browser bots, no "check the address" notice', !!wk && f.cb.ws === wk &&
                f.cb.pending === 'fill' && f.w.SERVER_HOST === 'browser' && f.w.bots.remoteIP === 'browser' && f.removed.includes('localstoredBotsRemoteIP') && f.els.botsRemoteIP.value === 'browser' &&
                !f.toasts.some(t => t.includes('game1.bots.connectFailed')));
            if (wk) { wk.open(); f.flush(); }
            const pk = wk && wk.sent.find(p => typeof p !== 'string' && p[0] === 0);
            check('... the same click fills the lobby (10 bots)', !!pk && pk[pk.length - 1] === 10 && f.w._brFilling === true);
        }
        const g = flow({ host: 'ws://localhost:1337' });
        g.w.application = { _lmQuickBotsShown: () => true };
        g.start(); g.socks[0].fail();
        check('Bot address that does not answer, address field shown: kept, the notice to check it, no fallback', g.socks.length === 1 && g.w.SERVER_HOST === 'ws://localhost:1337' &&
            !g.removed.length && g.toasts.some(t => t.includes('game1.bots.connectFailed')));
        const w = flow({ host: 'browser' });
        w.start(); w.socks[0].fail();
        check('Browser bots that fail: the notice, no retry loop', w.socks.length === 1 && w.toasts.some(t => t.includes('game1.bots.connectFailed')));
        // a changed address takes effect on the next Start when no bots run (the open socket was kept until a reload)
        const c = flow({ host: 'ws://localhost:1337' });
        c.start(); c.socks[0].open(); c.flush(); c.socks[0].push([0]);
        c.w.SERVER_HOST = 'browser';
        c.start();
        check('Changed address while bots run: nothing reconnects', c.socks.length === 1);
        c.stop(); c.socks[0].push([1]); c.socks[0].push([2]);
        c.start();
        check('Changed address, no bots running: the next Start uses the new address, the old socket closed quietly', c.socks.length === 2 && c.socks[1].kind === 'worker' &&
            c.socks[0].readyState === 3 && c.socks[0].onclose === null && c.cb.pending === 'start' && !c.toasts.some(t => t.includes('game1.bots.wsClosed')));
        c.start();
        check('Same address: the open connection is reused', c.socks.length === 2);
    }
    {
        const f = flow({ lm: { integrity: false, ws: 'wss://eu.expanding.land' } });
        f.start();
        check('Start on a server that is not agar.io: refused before connecting', f.socks.length === 0 && f.toasts[0].includes('game1.bots.agarOnly') && f.els.startBots.style.display === 'inline');
        const g = flow({ lm: { ws: '' } });
        g.start();
        check('Start without a game server: refused with a notice, no connection', g.socks.length === 0 && g.toasts[0].includes('game2.brNoGameServer'));
        const h = flow({ amount: 0 });
        h.start();
        check('Start without an amount: refused, no connection', h.socks.length === 0 && h.toasts[0].includes('game2.botsAmount'));
        const t = flow({ lm: { gameMode: ':teams' } });
        t.start(); t.socks[0].open(); t.flush();
        check('Start works in every agar.io mode (Teams too): no "Party bots only" gate', t.ops(t.socks[0])[0] === 0 && !t.toasts.length);
        const p = flow({ lm: { gameMode: ':party' } });
        p.start(); p.socks[0].open(); p.flush();
        check('Start on Party: no player nick message (7), like before', JSON.stringify(p.ops(p.socks[0])) === '[0]');
    }
    {
        // server switch while connecting for a Start: cancelled, nothing starts on the new server
        const f = flow();
        f.start();
        f.stop(); // LM.connect -> window._lmBotsStop()
        f.socks[0].open && f.socks[0].open();
        f.flush();
        check('Server switch while connecting: the waiting Start is dropped', f.socks[0].sent.length === 0 && f.cb.pending === null);
    }
    {
        // Battle Royale Fill lobby: one click, the same connection code
        const f = flow({ lm: { gameMode: ':battleroyale', battleRoyale: { players: 5, started: false, countdown: false } } });
        f.fill();
        const s = f.socks[0];
        check('Fill lobby: one click connects (status Connecting, "connecting" notice)', f.socks.length === 1 && f.cb.pending === 'fill' && f.els.userStatus.i18n === 'game1.bots.connecting' && f.toasts.some(t => t.includes('game2.brConnecting')));
        f.fill();
        check('Fill lobby: double click while connecting: one connection', f.socks.length === 1);
        s.open(); f.flush();
        const pk = s.sent.find(p => typeof p !== 'string' && p[0] === 0);
        check('Fill lobby: once connected it fills: 15 - 5 = 10 bots, Stop fill shown', !!pk && pk[pk.length - 1] === 10 && f.w._brFilling === true && f.els.brFillLobby.style.display === 'none' &&
            f.els.brStopFill.style.display === '' && f.w.userBots.sessionAmount === 10 && f.els.stopBots.style.display === 'inline');
        f.start();
        check('Fill lobby running: Start does not start twice', s.sent.filter(p => typeof p !== 'string' && p[0] === 0).length === 1);
        const g = flow({ lm: { gameMode: ':battleroyale', battleRoyale: { players: 5, started: false, countdown: false } } });
        g.fill();
        g.start();
        check('Start pressed while a Fill waits for the connection: the Start wins, one connection', g.socks.length === 1 && g.cb.pending === 'start');
        g.socks[0].open(); g.flush();
        check('... and it starts the user\'s amount once', JSON.stringify(g.ops(g.socks[0])) === '[0,7]' && g.socks[0].sent[0][g.socks[0].sent[0].length - 1] === 20 && !g.w._brFilling);
        const h = flow({ lm: { gameMode: ':battleroyale', battleRoyale: { players: 5, started: false, countdown: false } } });
        h.fill();
        h.stop();
        check('Stop while a Fill connects: cancelled', h.socks[0].readyState === 3 && h.cb.pending === null);
    }
    {
        // Fill lobby again within the ~2 s the bot core needs to stop the previous bots (it drops a start meanwhile)
        const BR = { gameMode: ':battleroyale', battleRoyale: { players: 5, started: false, countdown: false } };
        const starts = s => s.sent.filter(p => typeof p !== 'string' && p[0] === 0).length;
        for (const spawned of [false, true]) {
            const f = flow({ lm: BR });
            f.fill(); const s = f.socks[0]; s.open(); f.flush();
            if (spawned) s.push([0]);
            f.w._brStopFilling();
            check('Stop fill (' + (spawned ? 'bots spawned' : 'bots still joining') + '): [1] sent, Fill lobby shown', f.ops(s)[f.ops(s).length - 1] === 1 && f.els.brFillLobby.style.display === '');
            f.toasts.length = 0;
            f.fill(); f.flush();
            check('... Fill lobby again at once: no start the bot core would drop, no false "Filling" or "already running" notice, it waits', starts(s) === 1 && f.cb.pending === 'fill' &&
                !f.w._brFilling && f.toasts.length === 1 && f.toasts[0].includes('game1.bots.stopping'));
            f.fill();
            check('... a second click while it waits: nothing more', starts(s) === 1 && f.toasts.length === 1);
            s.push([1]); s.push([2]); f.flush();
            const pk = s.sent.filter(p => typeof p !== 'string' && p[0] === 0)[1];
            check('... message 2 (the old bots stopped): the waiting fill starts on the same connection (10 bots), Stop fill shown', starts(s) === 2 && !!pk && pk[pk.length - 1] === 10 &&
                f.w._brFilling === true && f.els.brFillLobby.style.display === 'none' && f.w.userBots.startSent === true && f.toasts.some(t => t.includes('game2.brFilling')));
        }
        // a server switch (LM.connect -> _lmBotsStop) or the battle beginning stops them the same way
        const g = flow({ lm: BR });
        g.start(); g.socks[0].open(); g.flush(); g.socks[0].push([0]);
        g.stop();
        g.start();
        check('Start again while the bots stop: waits, nothing sent', starts(g.socks[0]) === 1 && g.cb.pending === 'start');
        g.socks[0].push([2]); g.flush();
        check('... message 2: it starts', starts(g.socks[0]) === 2 && g.w.userBots.startSent === true);
        const h = flow({ lm: BR });
        h.fill(); h.socks[0].open(); h.flush();
        h.w._brStopFilling(); h.fill(); h.stop();
        h.socks[0].push([2]); h.flush();
        check('Stop pressed while a fill waits for the old bots: nothing starts', starts(h.socks[0]) === 1 && h.cb.pending === null && !h.w._brFilling);
        const o = flow({ lm: BR });
        o.fill(); o.socks[0].open(); o.flush();
        o.w._brStopFilling(); o.fill(); o.socks[0].close();
        check('Bot connection closed while a fill waits: forgotten, nothing waits any more', o.cb.pending === null && !o.w.userBots.stopSentAt);
        const t = flow({ lm: BR });
        t.fill(); t.socks[0].open(); t.flush();
        t.w._brStopFilling();
        t.w.userBots.stopSentAt = Date.now() - 6000;
        t.fill();
        check('A bot server that never answers the Stop (no message 2 in 5 s): Fill lobby is not held back', starts(t.socks[0]) === 2 && t.w._brFilling === true);
    }
    // Battle Royale leaderboard footer: shrinkTime is ms (server time), not seconds
    {
        const fsrc = extract('else if (legendmod.gameMode === ":battleroyale") {');
        check('BR footer: extractable', !!fsrc);
        const footer = (shrinkTime, diff) => run('var teamText = ""; if (false) {} ' + fsrc + '; teamText',
            { legendmod: { gameMode: ':battleroyale', serverTimeDiff: diff || 0, battleRoyale: { shrinkTime, timeLeft: 0, players: 7 } }, lmT: k => k, Languageletter313: 'Players', Date });
        const now = Date.now();
        check('BR footer: a shrink that ended 2 minutes ago: no "Shrink time"', !footer(1000 * Math.floor(now / 1000 - 120)).includes('game2.shrinkTime'));
        check('BR footer: no zone (0): no "Shrink time"', !footer(0).includes('game2.shrinkTime'));
        check('BR footer: 90 s left: "Shrink time: 89/90", counted from shrinkTime', /game2\.shrinkTime: (89|90)</.test(footer(now + 90500)));
        check('BR footer: server clock 30 s ahead (serverTimeDiff): 60 s left', /game2\.shrinkTime: (59|60)</.test(footer(now + 90500, -30000)));
        const reset = (ogSrc.match(/if \(this\.battleRoyale\) \{ this\.battleRoyale\.joined = false;[^\n]*\}/) || [''])[0];
        const self = { battleRoyale: { joined: true, started: true, countdown: false, players: 9, shrinkTime: now + 5000, timeLeft: 5 } };
        run(reset, {}, self);
        check('BR: a new game server clears the zone timer of the previous lobby', !!reset && self.battleRoyale.shrinkTime === 0 && self.battleRoyale.timeLeft === 0 && self.battleRoyale.players === 0);
    }

    // "On this server": players (and bot groups) from the whole agar.io leaderboard, no fake capacity
    {
        const players = lm => run(playersSrc + '\nbotsServerPlayersText()', { window: { legendmod: lm }, lmT: (key, a) => key + (a ? ':' + a[0] : '') });
        const board = (names) => names.map(nick => ({ nick }));
        const real = Array.from({ length: 71 }, (_, i) => 'p' + i);
        check('players: not connected: Waiting', players(null) === 'game1.bots.waiting' && players({ ws: '' }) === 'game1.bots.waiting');
        check('players: not an agar.io server (top 10 only): no number', players({ ws: 'wss://x', integrity: false, leaderboard: board(real) }) === '-');
        check('players: 71 players and 52 bots, as the leaderboard footer counts them', players({ ws: 'wss://a', integrity: true, gameMode: ':ffa', leaderboard: board(real.concat(Array(52).fill('Legendmod|ml'))) }) === 'game2.sbPlayers:71 · game2.sbBots:52');
        check('players: two players with the same name are players, not bots', players({ ws: 'wss://a', integrity: true, leaderboard: board(['a', 'a', 'b']) }) === 'game2.sbPlayers:3');
        check('players: one player, nick "__proto__"', players({ ws: 'wss://a', integrity: true, leaderboard: board(['__proto__']) }) === 'game2.sbPlayer:1');
        check('players: Battle Royale: the lobby count', players({ ws: 'wss://a', integrity: true, gameMode: ':battleroyale', battleRoyale: { players: 12 }, leaderboard: [] }) === 'game2.sbPlayers:12');
        check('players: empty board: Waiting', players({ ws: 'wss://a', integrity: true, leaderboard: [] }) === 'game1.bots.waiting');
        check('players: panel row "On this server"; no "/200", no server slots value',
            ogSrc.includes("${_lmG1s('game1.bots.onServer')}</b>: <span id=\"botsServerPlayers\"") &&
            !ogSrc.includes('"/200"') && !ogSrc.includes("id=\"slots\"") && !ogSrc.includes("$('#slots')"));
        // no timer: the row is written by the leaderboard of the main connection and when the panel opens, only while it is open
        const refSrc = extract('window._lmBotsServerPlayersRefresh = function ()');
        check('players: refresh function extractable, no timer around it', !!refSrc && !/botsServerPlayersText\(\)[\s\S]{0,160}\}, 1000\)/.test(ogSrc));
        const refresh = (open, lm) => {
            const row = { textContent: 'old' };
            run(playersSrc + '\n' + refSrc + '\nwindow._lmBotsServerPlayersRefresh()', { window: { legendmod: lm }, defaultmapsettings: { showQuickBots: open }, document: { getElementById: id => id === 'botsServerPlayers' ? row : null }, lmT: (key, a) => key + (a ? ':' + a[0] : '') });
            return row.textContent;
        };
        const lm3 = { ws: 'wss://a', integrity: true, gameMode: ':ffa', leaderboard: board(['a', 'b', 'c']) };
        check('players: refresh writes the count while the panel is open, nothing while it is closed', refresh(true, lm3) === 'game2.sbPlayers:3' && refresh(false, lm3) === 'old');
        const hl = ogSrc.indexOf('        handleLeaderboard() {');
        check('players: every leaderboard of the main connection refreshes the row', hl > 0 && ogSrc.slice(hl, hl + 400).includes('if (this === window.legendmod && window._lmBotsServerPlayersRefresh) window._lmBotsServerPlayersRefresh();'));
        const core = fs.readFileSync(path.join(botsDir, 'botcore.js'), 'utf8');
        check('botcore: no fake server player total (message 5) any more', !core.includes('new Uint8Array([5, 0])'));
    }

    // the panel: Start and Stop only, no Connect, no captcha tokens, no install links
    {
        const i = ogSrc.indexOf('<div id="quick-bots"');
        const panel = i < 0 ? '' : ogSrc.slice(i, ogSrc.indexOf('</div>`);', i));
        check('panel: found', panel.length > 500);
        check('panel: no Connect button', !panel.includes('connectBots') && !ogSrc.includes("getElementById('connectBots')") && !ogSrc.includes('#connectBots'));
        check('panel: Start enabled, Stop hidden until a Start', /<button id="startBots" class="btn btn-primary btn" data-i18n/.test(panel) && /<button id="stopBots" class="btn btn-danger" disabled/.test(panel));
        check('panel: no captcha tokens row or counter', !panel.includes('captchatokens') && !ogSrc.includes('captchatokens') && !panel.includes('game1.bots.tokens'));
        check('panel: no Installation / tutorial links / tokens tip', !/game1\.bots\.(install|tutPc|tutRepl|tip)\b/.test(ogSrc) && !panel.includes('repl.it') && !panel.includes('youtube'));
        check('panel: Status, Bots AI, name, amount and address (browser / ws://) stay', ['id="userStatus"', 'id="botsAI"', 'id="botsNameLM"', 'id="botsAmount"', 'id="botsRemoteIP"', 'list="botsRemoteIPList"'].every(x => panel.includes(x)));
        check('panel: Start and Fill buttons call botsStart / brFill', ogSrc.includes("getElementById('startBots').addEventListener('click', () => botsStart())") && ogSrc.includes("getElementById('brFillLobby').addEventListener('click', () => brFill())") &&
            ogSrc.includes('window._lmBotsStart = botsStart') && ogSrc.includes('window._lmBrFill = brFill'));
    }

    // Battle Royale HUD status: lobby players split into real players and our bots (spawned, message 4)
    {
        const updSrc = extract('function brUpdateSection()');
        check('ogario: brUpdateSection extractable', !!updSrc);
        const brLog = { stops: 0, toasts: [] };
        const brStatus = (players, spawned, running, state, extra) => {
            const els = { brBotsSection: el(), brLobbyStatus: el() };
            const w = Object.assign({ userBots: { spawned, startedBots: running, startSent: false } }, (extra && extra.w) || {});
            const lm = { gameMode: (extra && extra.mode) || ':battleroyale', battleRoyale: Object.assign({ players, started: false, countdown: false }, state || {}) };
            brLog.stops = 0; brLog.toasts = [];
            run(updSrc + '\nfunction brStopFilling() { brLog.stops++; window._brFilling = false }\nbrUpdateSection()', { window: w, legendmod: lm, document: { getElementById: id => els[id] || null }, _lmTH: (k, d) => d, Math, Premadeletter123: 'LM',
                toastr: { success: m => brLog.toasts.push(m) }, brLog });
            return els.brLobbyStatus.textContent;
        };
        check('BR status: 8 in the lobby, 3 of them our bots: "Players: 8 (5 real + 3 bots)"', brStatus(8, 3, true) === 'Players: 8 (5 real + 3 bots) | State: Waiting');
        check('BR status: no bots of ours: the plain count', brStatus(8, 0, true) === 'Players: 8 | State: Waiting' && brStatus(8, 3, false) === 'Players: 8 | State: Waiting');
        check('BR status: never more bots than lobby players', brStatus(2, 5, true) === 'Players: 2 (0 real + 2 bots) | State: Waiting');
        check('BR status: countdown state kept', brStatus(15, 10, true, { countdown: true }) === 'Players: 15 (5 real + 10 bots) | State: Starting');
        brStatus(15, 10, true, { countdown: true }, { w: { _brFilling: true } });
        check('BR fill: the countdown (176) keeps the fill bots', brLog.stops === 0 && !brLog.toasts.length);
        brStatus(15, 10, true, { started: true }, { w: { _brFilling: true } });
        check('BR fill: the battle begun (177) ends the fill once, with the "started" notice', brLog.stops === 1 && brLog.toasts.length === 1 && brLog.toasts[0].includes('BR game started!'));
        brStatus(15, 10, true, { started: true }, { w: { _brFilling: false } });
        check('BR fill: bots started by hand stay when the battle begins', brLog.stops === 0 && !brLog.toasts.length);
        brStatus(15, 10, true, {}, { mode: ':ffa', w: { _brFilling: true } });
        check('BR fill: another mode ends the fill', brLog.stops === 1);
        // a language change: the packs fill every [data-i18n] element (lib/lm-i18n.js apply) after the onChange listeners; no timer rewrites the lobby line
        {
            const reg = (ogSrc.match(/\r?\n    if \(window\.LMi18n && typeof window\.LMi18n\.onChange === 'function'\) window\.LMi18n\.onChange\(function \(\) \{ brUpdateSection\(\) \}\)/) || [''])[0];
            const attrEl = () => { const a = { 'data-i18n': 'game2.brWaitingData' }; return { style: {}, textContent: 'Waiting for lobby data…', getAttribute: k => (k in a ? a[k] : null), removeAttribute: k => { delete a[k]; }, setAttribute: (k, v) => { a[k] = String(v); } }; };
            const els = { brBotsSection: el(), brLobbyStatus: attrEl() };
            const dict = { en: { 'game2.brWaitingData': 'Waiting for lobby data…', 'game2.brPlayers': 'Players: {0} | State: {1}', 'game2.brStateWaiting': 'Waiting' },
                fr: { 'game2.brWaitingData': 'En attente des données du lobby…', 'game2.brPlayers': 'Joueurs : {0} | État : {1}', 'game2.brStateWaiting': 'En attente' } };
            let lang = 'en';
            const listeners = [];
            const w = { userBots: { spawned: 0, startedBots: false, startSent: false }, LMi18n: { onChange: fn => listeners.push(fn) } };
            const lm = { gameMode: ':battleroyale', battleRoyale: { players: 9, started: false, countdown: false } };
            run(updSrc + '\nfunction brStopFilling() {}\n' + reg + '\nbrUpdateSection()', { window: w, legendmod: lm, document: { getElementById: id => els[id] || null }, _lmTH: (k, d) => dict[lang][k] || d, Math, Premadeletter123: 'LM', toastr: {} });
            const packsApply = () => { for (const id in els) { const e = els[id], k = e.getAttribute && e.getAttribute('data-i18n'); if (k && dict[lang][k]) e.textContent = dict[lang][k]; } };
            const st = els.brLobbyStatus;
            lang = 'fr'; listeners.forEach(f => f('fr', 'en')); packsApply();
            check('BR status: a language change in the lobby rewrites the lobby line in the new language (not "Waiting for lobby data" until the next lobby packet): ' + st.textContent, !!reg && listeners.length === 1 && st.textContent === 'Joueurs : 9 | État : En attente');
            lang = 'en'; packsApply();
            check('BR status: the live line carries no data-i18n the packs would write over it', st.getAttribute('data-i18n') === null && st.textContent === 'Joueurs : 9 | État : En attente');
        }
        // no timer: the Battle Royale lobby packets of the main connection, our bots' count and the server/mode switch update it
        const brHook = 'if (this === window.legendmod && window._brUpdateSection) window._brUpdateSection();';
        const c176 = ogSrc.indexOf('this.battleRoyale.countdown = true;');
        for (const op of ['176', '177', '178', '180']) {
            const at = ogSrc.indexOf('case ' + op + ':', c176 - 4000);
            const body = at < 0 ? '' : ogSrc.slice(at, ogSrc.indexOf('                case ', at + 12));
            check('BR status: lobby packet ' + op + ' updates the Battle Royale HUD', body.includes(brHook));
        }
        check('BR status: our bots\' count (messages 2 and 4), Stop and the bot connection closing update it', (ogSrc.match(/if \(typeof window\._brUpdateSection === 'function'\) window\._brUpdateSection\(\)\r?\n/g) || []).length >= 4);
        k = makeCB();
        k.msg([4, 6, 5]);
        const spawned4 = k.w.userBots.spawned;
        k.msg([2]);
        check('ogario: message 4 records the spawned bots of the session, message 2 clears them', spawned4 === 5 && k.w.userBots.spawned === 0);
        const st = { userBots: { startedBots: true, startSent: false, spawned: 7 }, connectionBots: { ws: { readyState: 1 }, send() {}, cancel() {} }, _lmBotsForget() {} };
        run(stopSrc + '; window._lmBotsStop()', { window: st, WebSocket: { OPEN: 1 }, Uint8Array });
        check('ogario: Stop / server switch: our bots no longer counted on this server', st.userBots.spawned === 0);
    }
    // the Battle Royale HUD: its own panel (title from the packs), the lobby section and Fill lobby moved there
    {
        const i = ogSrc.indexOf('<div id="quick-br"');
        const hud = i < 0 ? '' : ogSrc.slice(i, ogSrc.indexOf('</div>`);', i));
        check('BR HUD: own panel, same classes as the bots panel, hidden at first', /<div id="quick-br" class="agario-panel agario-side-panel" style="display:none">/.test(hud));
        check('BR HUD: title "Battle Royale" from the packs', hud.includes("${_lmG1s('game2.brHudTitle')}"));
        check('BR HUD: holds the lobby status and Fill / Stop fill', ['id="brBotsSection"', 'id="brLobbyStatus"', 'id="brFillLobby"', 'id="brStopFill"'].every(x => hud.includes(x)));
        const b = ogSrc.indexOf('<div id="quick-bots"');
        const bots = b < 0 ? '' : ogSrc.slice(b, ogSrc.indexOf('</div>`);', b));
        check('BR HUD: no Battle Royale section left in the bots panel', !bots.includes('brBotsSection') && !bots.includes('brFillLobby'));
        const css = fs.readFileSync(path.join(__dirname, '..', '..', 'css', 'ogario.v3.css'), 'utf8');
        check('BR HUD: same size as the bots panel, its button in the row of round buttons', /#quick-bots,#quick-br\{\s*width:300px;/.test(css) && /\.quick-br\{\s*left:60px\s*\}/.test(css));
    }

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
    const borderIdx = ogSrc.indexOf('if (maxX - minX > 14000 && maxY - minY > 14000 && window.userBots && this === window.legendmod &&');
    const borderSrc = borderIdx > -1 ? extract('if (maxX - minX > 14000', borderIdx) : null;
    check('ogario: bot offset block found', !!borderSrc);
    const borderCase = (isMain, minX, minY, maxX, maxY, userBots, seq) => {
        const self = { _connectSeq: seq || 1 };
        const w = { userBots: userBots || { offsetX: 0, offsetY: 0 }, legendmod: isMain ? self : {} };
        run('var minX = ' + minX + ', minY = ' + minY + ', maxX = ' + maxX + ', maxY = ' + maxY + ';\n' + borderSrc, { window: w, LM: { mapSize: 14142 } }, self);
        return w.userBots;
    };
    let bo = borderCase(true, 500 - 7071, -300 - 7071, 500 + 7071, -300 + 7071);
    check('ogario: bot offset = border centre of the player connection', bo.offsetX === 500 && bo.offsetY === -300 && bo.offsetFixed === true);
    bo = borderCase(false, -7071, -7071, 7071, 7071);
    check('ogario: bot offset not taken from another connection', bo.offsetFixed !== true && bo.offsetX === 0);
    bo = borderCase(true, 0, 0, 5000, 5000);
    check('ogario: bot offset not taken from a partial border', bo.offsetFixed !== true);
    bo = borderCase(true, 100 - 14189.596 / 2, 50 - 14110.375 / 2, 100 + 14189.596 / 2, 50 + 14110.375 / 2);
    check('ogario: bot frame from a scaled agar.io border: centre and canonical scale', bo.offsetFixed && bo.offsetX === 100 && bo.offsetY === 50 &&
        Math.abs(bo.scaleX * 14189.596 - 14142.135623730952) < 1e-6 && Math.abs(bo.scaleY * 14110.375 - 14142.135623730952) < 1e-6);
    borderCase(true, -2125, -1280, 2125, 1280, bo);
    borderCase(true, -7071, -7071, 7071, 7071, bo);
    check('ogario: bot frame: view rects and later borders of the same connection change nothing', bo.offsetX === 100 && bo.offsetY === 50);
    borderCase(true, -7071, -7071, 7071, 7071, bo, 2);
    check('ogario: bot frame: the next connection takes its own first border', bo.offsetX === 0 && bo.offsetY === 0 && bo.offsetSeq === 2);

    // player -> bots end to end: the real border, mouse and ghost cell code of ogario.v4.js feeding server.js
    {
        const out0 = console.log;
        const M = servers['server.js'];
        const S = 14142.135623730952;
        const P = { cx: -3010.5, cy: 2200.25, w: 14098.493, h: 14072.8 };   // the player's map
        const Q = { cx: 4500.75, cy: -1250.5, w: 14189.596, h: 14198.1 };   // a bot's map
        const ubP = borderCase(true, P.cx - P.w / 2, P.cy - P.h / 2, P.cx + P.w / 2, P.cy + P.h / 2, { startedBots: true, isAlive: true });
        const players = [{ x: 2500, y: -4100, mass: 6000 }, { x: -6200, y: 3900, mass: 2500 }, { x: 900, y: 6100, mass: 1200 }];
        const ghostOut = [];
        const wg = { userBots: ubP, buffers: B, connectionBots: { send: b => ghostOut.push(ab(b)) } };
        const gself = { ghostCells: players.map(r => ({ rawX: r.x, rawY: r.y, mass: r.mass })), ghostCellsTime: 50000 };
        wg.legendmod = gself;
        run(ghostSrc, { window: wg }, gself);
        const mouseOut = [];
        const wm = { userBots: ubP, legendmod: { vector: [[true, false]], vnr: 0 }, buffers: B, connectionBots: { send: b => mouseOut.push(ab(b)) } };
        const raw = { x: -5000.4, y: 7000.6 }; // the player's mouse, raw on the player's map (Rotate map flips x)
        run(extract(mouseMarker, mouseIdx), { window: wm }, { cursorX: -raw.x, cursorY: raw.y, translateX: x => -x, translateY: y => y });
        check('ogario->server: ghost ref and mouse sent', ghostOut.length === 1 && mouseOut.length === 1);
        const mirror = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
        console.log = () => {};
        const out = mirror.map(([fx, fy]) => {
            M.resetServer();
            const c = new FakeClient();
            M.onUserConnection(c);
            M.handleUserMessage(c, startPacket('b', 1));
            const b = new M.Bot(); M.userBots.push(b); b.ws.open();
            b.handleBuffer(Buffer.from([242, 0, 0, 0, 0]));
            b.handleCompressedBuffer(Buffer.concat([Buffer.from([64]), f64(Q.cx - Q.w / 2), f64(Q.cy - Q.h / 2), f64(Q.cx + Q.w / 2), f64(Q.cy + Q.h / 2)]));
            M.handleUserMessage(c, ghostOut[0]);
            b.handleCompressedBuffer(Buffer.concat([Buffer.from([69]), u16(players.length), ...players.map(r => Buffer.concat([
                i32(Math.round(Q.cx + fx * (r.x - P.cx) * Q.w / P.w)), i32(Math.round(Q.cy + fy * (r.y - P.cy) * Q.h / P.h)), u32(r.mass), Buffer.from([0])]))]));
            M.handleUserMessage(c, mouseOut[0]);
            M.user.isAlive = true; M.bots.ai = false; b.followMouse = true;
            b.move();
            const pk = b.ws.sent[b.ws.sent.length - 1];
            const want = [Q.cx + fx * (raw.x - P.cx) * Q.w / P.w, Q.cy + fy * (raw.y - P.cy) * Q.h / P.h];
            const ok = b.orientFixed && b.fixX === fx && b.fixY === fy && pk[0] === 16 && Math.abs(pk.readInt32LE(1) - want[0]) <= 2 && Math.abs(pk.readInt32LE(5) - want[1]) <= 2;
            M.resetServer();
            return ok;
        });
        console.log = out0;
        check('ogario->server: different map sizes, all 4 mirrors: the bot finds its orientation and targets the player\'s mouse within 2 units', out.every(Boolean));
    }

    // Start / Fill: agar.io only, session amount local, one connection code
    check('ogario: Start requires legendmod.integrity', /function botsStart\(\) \{[\s\S]{0,1500}if \(!legendmod\.integrity\) return refuse\(_lmTH\('game1\.bots\.agarOnly'/.test(ogSrc));
    check('ogario: Fill requires legendmod.integrity', /function brFill\(\) \{[\s\S]{0,600}if \(!legendmod\.integrity\) \{[\s\S]{0,200}game1\.bots\.agarOnly/.test(ogSrc));
    check('ogario: Start clamps a local amount and records the session amount', ogSrc.includes('var _lmBotsN = Math.max(1, Math.min(window._lmBotsClampAmount(window.bots.amount), _lmBotsRoom));') && ogSrc.includes('window.userBots.sessionAmount = _lmBotsN'));
    check('ogario: Start and Fill lobby connect through the same code (connectionBots.ensure)', ogSrc.includes("cb.ensure('start')") && ogSrc.includes("cb.ensure('fill')") && !ogSrc.includes('_brFillPending'));
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

    // the quick HUD buttons (menu, bots, Battle Royale): created hidden except the menu, tabs, follow the server
    check('ogario: bots button created hidden', ogSrc.includes('<a href="#" class="quick quick-bots ogicon-trophy" style="display: none;"></a>'));
    check('ogario: Battle Royale button created hidden, next to the menu and bots buttons', ogSrc.includes('<a href="#" class="quick quick-bots ogicon-trophy" style="display: none;"></a><a href="#" class="quick quick-br ogicon-target" style="display: none;"></a>'));
    {
        const vm = require('vm');
        const method = name => {
            const i = ogSrc.indexOf('\n        ' + name + '(');
            const j = i < 0 ? -1 : ogSrc.indexOf('\n        },', i + 1);
            return i < 0 || j < 0 ? '' : ogSrc.slice(i + 1, j + 10).trim().replace(/,$/, '');
        };
        const line = name => { const m = ogSrc.match(new RegExp('\\n        (' + name + ': [^\\n]*),\\r?\\n')); return m ? m[1] : ''; };
        const names = ['quickOpenPanel', 'applyQuickPanels', 'setQuickPanel', 'toggleQuickPanel', 'setShowQuickMenu', 'setShowQuickBots', '_lmQuickBefore', '_lmQuickBotsShown', 'syncQuickPanels', '_lmQuickSwitchBR', 'displayPartyBots'];
        const parts = names.map(method).concat([line('_lmQuickIds'), line('_lmQuickBotsButton')]);
        check('quick HUDs: controller methods extractable', parts.every(Boolean));
        const PANELS = { menu: '#quick-menu', bots: '#quick-bots', br: '#quick-br' };
        const BTNS = { menu: '.quick.quick-menu', bots: '.quick.quick-bots', br: '.quick.quick-br' };
        const make = (opts) => {
            opts = opts || {};
            const dom = {}, store = Object.assign({}, opts.store || {});
            let saves = 0;
            const node = sel => dom[sel] || (dom[sel] = { shown: sel === BTNS.menu, cls: {}, stops: 0 });
            const $ = sel => {
                const n = node(sel === '.quick.quick-bots.ogicon-trophy' ? BTNS.bots : sel);
                const o = {
                    stop() { n.stops++; return o; }, toggle(v) { n.shown = !!v; return o; }, show() { n.shown = true; return o; }, hide() { n.shown = false; return o; },
                    toggleClass(c, v) { n.cls[c] = !!v; return o; }
                };
                return o;
            };
            const lm = { ws: '', integrity: false, gameMode: ':ffa' };
            const sb = {
                window: { legendmod: lm }, $, defaultmapsettings: Object.assign({ showQuickMenu: true, showQuickBots: false }, opts.flags || {}),
                localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }
            };
            vm.createContext(sb);
            vm.runInContext('var app = { ' + parts.join(',\n') + ', saveSettings() { __saves(); } }' + '; app._lmQuickBotsButton = ' + !!opts.botsButton, Object.assign(sb, { __saves: () => saves++ }));
            const app = sb.app, s = sb.defaultmapsettings;
            const open = () => Object.keys(PANELS).filter(k => node(PANELS[k]).shown);
            const consistent = () => {
                const o = open();
                return o.length <= 1 && node(PANELS.menu).shown === !!s.showQuickMenu && node(PANELS.bots).shown === !!s.showQuickBots && node(PANELS.br).shown === !!app._lmQuickBR &&
                    Object.keys(BTNS).every(k => !!node(BTNS[k]).cls['lm-quick-on'] === node(PANELS[k]).shown);
            };
            const server = (integrity, mode) => { lm.ws = integrity == null ? '' : 'wss://x'; lm.integrity = !!integrity; lm.gameMode = mode || ':ffa'; app.displayPartyBots(); };
            return { app, s, lm, w: sb.window, open, consistent, server, store, node, saves: () => saves, btn: k => node(BTNS[k]).shown };
        };
        check('quick HUDs: the bots button is on (shown on agar.io arenas only)', /_lmQuickBotsButton: true,/.test(ogSrc) && /return !!this\._lmQuickBotsButton && !!\(lm && lm\.integrity\);/.test(ogSrc));
        // tabs: A = quick menu, B = Battle Royale HUD (a build with the bots panel's button off)
        let q = make();
        q.app.setShowQuickMenu();
        check('quick HUDs: at load the saved flag shows the quick menu with its ring', q.open().join() === 'menu' && q.consistent());
        q.app.setQuickPanel(null);
        const seq = [['menu', 'menu'], ['menu', ''], ['br', 'br'], ['menu', 'menu'], ['br', 'br'], ['br', '']];
        let ok = true, trail = [];
        for (const [click, want] of seq) {
            q.app.toggleQuickPanel(click);
            trail.push(click + ':' + (q.open().join() || '-'));
            ok = ok && q.open().join() === want && q.consistent();
        }
        check('quick HUDs: clicks A, A, B, A, B, B: one HUD at most, flags = visibility, ring on the open one (' + trail.join(' ') + ')', ok);
        check('quick HUDs: shown and hidden at once (animations stopped, no fades)', q.node(PANELS.menu).stops > 0 && !/fadeIn|fadeOut/.test(parts.join('\n')));
        // three tabs when the bots button is on (the code still supports it)
        q = make({ botsButton: true });
        q.server(true);
        ok = true; trail = [];
        for (const [click, want] of [['bots', 'bots'], ['menu', 'menu'], ['br', 'br'], ['bots', 'bots'], ['bots', ''], ['menu', 'menu'], ['menu', '']]) {
            q.app.toggleQuickPanel(click);
            trail.push(click + ':' + (q.open().join() || '-'));
            ok = ok && q.open().join() === want && q.consistent();
        }
        check('quick HUDs: three tabs (menu, bots, Battle Royale): ' + trail.join(' '), ok);
        // the bots button: hidden at load, before any connection and on every server (agar.io too); its panel closed, its flag off
        q = make({ flags: { showQuickMenu: false, showQuickBots: true } });
        q.app.setShowQuickMenu();
        q.app.syncQuickPanels();
        check('bots button: hidden at load, the saved open bots panel closed and its flag saved off', !q.btn('bots') && q.open().length === 0 && q.s.showQuickBots === false && q.saves() === 1 && q.consistent());
        q.server(true, ':ffa');
        check('bots button: hidden on agar.io too', !q.btn('bots') && !q.btn('br'));
        q.server(false, ':ffa');
        check('bots button: hidden on other servers', !q.btn('bots'));
        q.app.setQuickPanel('menu');
        q.s.showQuickBots = true; q.app.setShowQuickBots(); // a settings profile with the bots panel open (profiles.js: s[k] = v, then setShowQuickBots; no sync follows)
        check('bots button: a profile with the bots panel open: it stays closed at once, its flag off, the quick menu stays', !q.s.showQuickBots && q.open().join() === 'menu' && q.consistent());
        q.s.showQuickMenu = false; q.app.setShowQuickMenu(); q.s.showQuickBots = true; q.app.setShowQuickBots(); // a profile with the menu off and the bots panel open
        check('bots button: a profile with only the bots panel open: no HUD open, flags = what is shown', !q.s.showQuickBots && q.open().length === 0 && q.consistent());
        // Battle Royale: its button on agar.io Battle Royale only; the HUD opens by itself and the one before comes back
        q = make();
        q.app.setShowQuickMenu();
        q.server(false, ':battleroyale');
        check('Battle Royale button: not on other servers (even in a mode called battleroyale)', !q.btn('br') && q.open().join() === 'menu');
        q.server(true, ':battleroyale');
        check('Battle Royale: entering on agar.io: its button shows, its HUD opens alone, the menu before is remembered', q.btn('br') && q.open().join() === 'br' && q.consistent() && q.store.lmQuickBeforeBR === 'menu' && !q.s.showQuickMenu);
        q.app.syncQuickPanels(); q.app.syncQuickPanels();
        check('Battle Royale: syncing again (mode select, setParty) changes nothing while in it', q.open().join() === 'br' && q.store.lmQuickBeforeBR === 'menu');
        q.server(true, ':ffa');
        check('Battle Royale: leaving: its button hides, its HUD closes, the quick menu comes back', !q.btn('br') && q.open().join() === 'menu' && q.consistent() && !('lmQuickBeforeBR' in q.store));
        q.app.setQuickPanel(null);
        q.server(true, ':battleroyale');
        q.server(true, ':party');
        check('Battle Royale: entered with no HUD open: none after leaving', q.open().length === 0 && q.consistent() && !('lmQuickBeforeBR' in q.store));
        q = make({ botsButton: true });
        q.server(true, ':ffa');
        q.app.toggleQuickPanel('bots');
        q.server(true, ':battleroyale');
        check('Battle Royale: entered with the bots panel open: Battle Royale HUD only', q.open().join() === 'br' && q.store.lmQuickBeforeBR === 'bots' && !q.s.showQuickBots && q.consistent());
        q.server(true, ':ffa');
        check('Battle Royale: left: the bots panel is back', q.open().join() === 'bots' && q.s.showQuickBots === true && q.consistent());
        q = make();
        q.app.setShowQuickMenu();
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('br');
        check('Battle Royale: its HUD closed by the player: no HUD, the menu still remembered', q.open().length === 0 && q.store.lmQuickBeforeBR === 'menu' && q.consistent());
        q.server(false, ':ffa');
        check('Battle Royale: HUD closed by the player, then leaving: the menu comes back', q.open().join() === 'menu' && q.s.showQuickMenu === true && !('lmQuickBeforeBR' in q.store) && q.consistent());
        q = make({ botsButton: true });
        q.server(true, ':ffa');
        q.app.toggleQuickPanel('bots');
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('br');
        q.server(true, ':party');
        check('Battle Royale: bots panel before, Battle Royale HUD closed by hand, leaving: the bots panel comes back', q.open().join() === 'bots' && q.consistent());
        q = make();
        q.app.setQuickPanel(null);
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('br');
        q.server(true, ':ffa');
        check('Battle Royale: entered with no HUD, closed by hand, leaving: still none', q.open().length === 0 && q.consistent());
        q = make();
        q.app.setShowQuickMenu();
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('menu');
        q.app.toggleQuickPanel('menu');
        q.server(true, ':ffa');
        check('Battle Royale: the player opened the menu in it and closed it again: leaving keeps his choice (none)', q.open().length === 0 && !('lmQuickBeforeBR' in q.store) && q.consistent());
        q = make();
        q.app.setQuickPanel(null);
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('br');
        q.s.showQuickMenu = true; q.app.setShowQuickMenu(); // a settings profile with the menu open, applied in Battle Royale
        q.server(true, ':ffa');
        check('Battle Royale: a profile opened the menu after the HUD was closed: leaving keeps it', q.open().join() === 'menu' && q.consistent());
        q = make();
        q.app.setShowQuickMenu();
        q.server(true, ':battleroyale');
        q.app.toggleQuickPanel('menu');
        check('Battle Royale: the menu button in it opens the menu and closes the Battle Royale HUD', q.open().join() === 'menu' && q.consistent());
        q.server(true, ':ffa');
        check('... leaving then keeps the menu (no double restore)', q.open().join() === 'menu' && q.consistent());
        // a reload in Battle Royale: the saved flags are off, the HUD from before is in lmQuickBeforeBR
        q = make({ flags: { showQuickMenu: false }, store: { lmQuickBeforeBR: 'menu' } });
        q.app.setShowQuickMenu();
        q.app.syncQuickPanels(); // no connection yet: nothing decided
        check('reload in Battle Royale: before the connection nothing opens, the remembered HUD is kept', q.open().length === 0 && q.store.lmQuickBeforeBR === 'menu');
        q.server(true, ':battleroyale');
        check('reload in Battle Royale: back in it: its HUD, the menu still remembered', q.open().join() === 'br' && q.store.lmQuickBeforeBR === 'menu');
        q.server(true, ':ffa');
        check('reload in Battle Royale: leaving brings the menu back', q.open().join() === 'menu' && q.consistent());
        q = make({ flags: { showQuickMenu: false }, store: { lmQuickBeforeBR: 'menu' } });
        q.app.setShowQuickMenu();
        q.server(true, ':ffa');
        check('reload in Battle Royale, then another mode first: the menu comes back', q.open().join() === 'menu' && !('lmQuickBeforeBR' in q.store));
        // one call, in LM.connect right where integrity is set: every join (Discover, server list, party token, URL, reconnect, Expanding Land, private rooms) passes there
        const k = ogSrc.indexOf("this.integrity = (this.ws.indexOf('agario.miniclippt') > -1");
        const next = k < 0 ? '' : ogSrc.slice(k, ogSrc.indexOf('this.serverType = _earlyType;', k));
        check('quick HUDs: LM.connect updates the buttons right after integrity is set (main connection only)', next.includes('if (this === window.legendmod) application.displayPartyBots();'));
        check('quick HUDs: displayPartyBots is called from that one place only', (ogSrc.match(/application\.displayPartyBots\(\)/g) || []).length === 1);
        check('quick HUDs: synced at load, no timer', /this\.setShowQuickMenu\(\);[\s\S]{0,200}this\.syncQuickPanels\(\);/.test(ogSrc) && !/syncQuickPanels\(\); \}, \d+\)/.test(ogSrc));
        const gmc = ogSrc.indexOf('app.gameMode = ogario.gameMode = modeVal;'), spy = ogSrc.indexOf('        setParty() {');
        check('quick HUDs: the agar.io mode select and setParty sync the Battle Royale button and HUD', gmc > 0 && ogSrc.slice(gmc, gmc + 200).includes('app.syncQuickPanels();') && spy > 0 && ogSrc.slice(spy, spy + 900).includes('this.syncQuickPanels();'));
        // every sync updates the Battle Royale HUD's lobby line and fill (when that code is loaded)
        q = make();
        let brUpd = 0;
        q.app.syncQuickPanels();
        q.w._brUpdateSection = () => brUpd++;
        q.server(true, ':battleroyale');
        q.app.syncQuickPanels();
        check('quick HUDs: each sync updates the Battle Royale HUD (none needed before its code loads)', brUpd === 2);
        // the bots panel's players line is fresh when the panel opens
        q = make({ botsButton: true });
        let plRef = 0;
        q.w._lmBotsServerPlayersRefresh = () => plRef++;
        q.server(true, ':ffa');
        q.app.toggleQuickPanel('menu');
        const plBefore = plRef;
        q.app.toggleQuickPanel('bots');
        check('quick HUDs: opening the bots panel writes its players line', plBefore === 0 && plRef === 1);
        check('quick HUDs: one click handler for the three buttons, blurred after a click', /on\("click", "\.quick-menu, \.quick-bots, \.quick-br", function \(event\) \{[\s\S]{0,120}this\.blur\(\)[\s\S]{0,200}app\.toggleQuickPanel\(/.test(ogSrc));
        check('quick HUDs: settings profiles re-apply the flags', fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'modules', 'profiles.js'), 'utf8').includes("showQuickMenu: 'setShowQuickMenu', showQuickBots: 'setShowQuickBots'"));
        check('quick HUDs: the open button\'s ring in the theme colour', ogSrc.includes(".quick.lm-quick-on{box-shadow:0 0 0 2px ' + defaultSettings.menuMainColor + '}"));
        check('bots button: LM.connect still stops running bots on a server switch (they follow, serverChange)', /window\._lmBotsStop\(true\)\s*\r?\n\s*window\.userBots\.isAlive = false/.test(ogSrc));
    }

    // every agar.io mode takes bots: no "Party bots only" gate or message
    check('ogario: no Party-only gate for Start', !ogSrc.includes('game2.botsPartyOnly') && !/legendmod\.gameMode === ":party" \|\| legendmod\.gameMode === ":ffa"/.test(ogSrc));

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
    check('ogario: BR bots leave only when the battle begins', ogSrc.includes('if (window._brFilling && br.started)') && !ogSrc.includes('battleRoyale.state > 1') && ogSrc.includes('this.battleRoyale.started = true'));
    check('ogario: BR fill stops on mode change', /if \(!isBR\) \{ brStopFilling\(\); return \}/.test(ogSrc));
    // Lifecycle edge-case fixes
    check('ogario: brStopFilling exposed on window for onclose', ogSrc.includes('window._brStopFilling = brStopFilling'));
    check('ogario: onclose calls _brStopFilling', ogSrc.includes("typeof window._brStopFilling === 'function'"));
    check('ogario: BR fill rejects when lobby full', ogSrc.includes("needed <= 0"));
    check('ogario: the bot connection closing ends the fill and updates the Battle Royale HUD', /_brStopFilling\(\)\r?\n\s*if \(typeof window\._brUpdateSection === 'function'\) window\._brUpdateSection\(\)/.test(ogSrc));
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
    check('ogario: BR title color is the theme\'s main colour', ogSrc.includes('<b style="color:var(--lm-mc,#01d9cc)"><span data-i18n="game2.brLobbyTitle">') && !ogSrc.includes('--lm-tc-h'));
    check('ogario: BR ranks notice in the theme colour, no fixed yellow', !ogSrc.includes('<font color="yellow"><b>\' + lmT(\'game2.brRanks\')') && !ogSrc.includes('<font color="yellow"><b>\' + legendmod.battleRoyale.playerRank') && ogSrc.includes("<b class=\"main-color\">' + lmT('game2.brRanks') + '</b>"));
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
                    'brLobbyFull', 'brNotWaiting', 'brFilling', 'brGameStarted'];
    for (const key of brKeys) {
        const fullKey = 'game2.' + key;
        check('i18n: ' + fullKey + ' has en', !!(game2[fullKey] && game2[fullKey].en));
        check('i18n: ' + fullKey + ' has el', !!(game2[fullKey] && game2[fullKey].el));
    }
}

// ---- ogario.v4.js: no captcha tokens in the bots panel flow ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // agar.io asks for no captcha now and the browser bots take no tokens: no popups, no token loops
    for (const gone of ['createCaptchaWindow', 'startCaptcha', 'closeCaptcha', 'captchaActive', 'sendTokenForBots', 'sendTimeOutTokenForBots', 'sendSpawn2', 'lm-bots-captcha-open',
        'capthaWindow', 'captchaOpenedWindow', 'RequestedTokens', 'botsSpawncode', 'captchaSpeed', 'game1.bots.captchaOpen', 'game1.bots.captchaTip']) {
        check('captcha: no ' + gone + ' in ogario.v4.js', !ogSrc.includes(gone));
    }
    check('captcha: message 12 keeps a plain notice (the bots wait)', /case 12:[\s\S]{0,400}game1\.bots\.captchaNeeded[\s\S]{0,200}game1\.bots\.captchaWait/.test(ogSrc));
}

// ---- i18n: the bots panel texts ----
{
    const I = require(path.join(__dirname, '..', 'i18n', 'lib'));
    const all = I.readAll();
    const g1 = all.game1, g2 = all.game2;
    check('i18n: bots panel title is "Bots" (en, el)', g1['game1.bots.title'] && g1['game1.bots.title'].en === 'Bots' && g1['game1.bots.title'].el === 'Bots');
    check('i18n: bots panel title is the same word as the Bots of rooms in all 16 languages', I.CODES.every(c => g1['game1.bots.title'][c] === all.core.roomBots[c]));
    let partyBots = [];
    for (const area of Object.keys(all)) for (const key of Object.keys(all[area])) if (/party[ -]?bots/i.test(all[area][key].en || '')) partyBots.push(key);
    check('i18n: no English text says "Party bots" (' + partyBots.join(', ') + ')', partyBots.length === 0);
    check('i18n: the obsolete "Party bots only available for Party mode" is gone', !g2['game2.botsPartyOnly']);
    for (const gone of ['tokens', 'install', 'tutPc', 'tutRepl', 'tip', 'connect', 'slots', 'captchaOpen', 'captchaTip', 'outdated', 'visit'])
        check('i18n: game1.bots.' + gone + ' removed', !g1['game1.bots.' + gone]);
    for (const key of ['onServer', 'connecting', 'connectFailed', 'captchaNeeded', 'captchaWait'])
        check('i18n: game1.bots.' + key + ' in all 16 languages', !!g1['game1.bots.' + key] && I.CODES.every(c => typeof g1['game1.bots.' + key][c] === 'string' && g1['game1.bots.' + key][c].trim() !== ''));
    for (const c of ['en', 'el']) {
        const pack = fs.readFileSync(path.join(__dirname, '..', '..', 'languages', 'lm-' + c + '.js'), 'utf8');
        check('i18n: built pack lm-' + c + '.js has the title "Bots"', pack.includes('"game1.bots.title": "Bots"'));
    }
}

// ---- browser bots: botcore.js in a Web Worker (emulated: vm context without require/Buffer) ----
// The real LMBotsWorkerSocket and connectionBots of ogario.v4.js, the real botcore.js, a fake
// game server WebSocket and a manual clock for both sides.
async function browserBots() {
    const vm = require('vm');
    const coreSrc = fs.readFileSync(path.join(botsDir, 'botcore.js'), 'utf8');
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    const core = require(path.join(botsDir, 'botcore'));
    const algorithm = core.algorithm;
    const extractFrom = (marker) => {
        const start = ogSrc.indexOf(marker);
        if (start < 0) return null;
        let i = ogSrc.indexOf('{', start), depth = 0;
        for (; i < ogSrc.length; i++) {
            const ch = ogSrc[i], nx = ogSrc[i + 1];
            if (ch === '/' && nx === '/') { i = ogSrc.indexOf('\n', i); continue; }
            if (ch === '/' && nx === '*') { i = ogSrc.indexOf('*/', i + 2) + 1; continue; }
            if (ch === '"' || ch === "'" || ch === '`') { for (i++; i < ogSrc.length && ogSrc[i] !== ch; i++) if (ogSrc[i] === '\\') i++; continue; }
            if (ch === '{') depth++;
            else if (ch === '}' && --depth === 0) return ogSrc.slice(start, i + 1);
        }
        return null;
    };

    // murmur2 copy in botcore.js = murmurhash-js 1.0.0 (values from the npm package, seed 255)
    const vectors = [['', 1981237060], ['a', 1381613397], ['ab', 2681217873], ['abc', 3785473039], ['abcd', 724329609],
        ['live-arena-ab-12x.agar.io3.11.21', 2125815976], ['web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/10.1.2.33.11.21', 1372224960], ['éÿĀx', 2990779056]];
    let npm = null;
    try { npm = require(require.resolve('murmurhash-js', { paths: [botsDir] })).murmur2; } catch (e) { }
    check('botcore: murmur2 = murmurhash-js output' + (npm ? ' (npm package found too)' : ''), vectors.every(([s, h]) => core.murmur2(s, 255) === h && (!npm || npm(s, 255) === h && npm(s, 7) === core.murmur2(s, 7))));
    check('botcore: no Node modules or Buffer in the shared core', !/require\(|Buffer\./.test(coreSrc.replace(/\/\/.*$/gm, '')));
    check('botcore: no orbit logic / bot positions / process.exit', !coreSrc.includes('distToPlayer') && !/\[9\]/.test(coreSrc) && !coreSrc.includes('process.exit'));

    // manual clock: setTimeout/setInterval of one side
    const clock = () => {
        const c = { now: 0, list: [], id: 0 };
        c.setTimeout = (fn, ms) => { const t = { id: ++c.id, fn, at: c.now + (ms || 0) }; c.list.push(t); return t.id; };
        c.setInterval = (fn, ms) => { const t = { id: ++c.id, fn, at: c.now + ms, every: ms }; c.list.push(t); return t.id; };
        c.clear = id => { c.list = c.list.filter(t => t.id !== id); };
        c.run = ms => {
            const end = c.now + ms;
            for (;;) {
                const due = c.list.filter(t => t.at <= end).sort((a, b) => a.at - b.at)[0];
                if (!due) break;
                c.now = due.at;
                if (due.every) due.at += due.every; else c.clear(due.id);
                due.fn();
            }
            c.now = end;
        };
        return c;
    };
    const page = clock(), wk = clock();
    // the game server side of each bot socket
    class GameWS {
        constructor(url, opts) { this.url = url; this.opts = opts; this.readyState = 0; this.sent = []; GameWS.all.push(this); }
        send(d) { this.sent.push(Buffer.from(d)); }
        close() { if (this.readyState === 3) return; this.readyState = 3; if (this.onclose) this.onclose({}); }
        open() { this.readyState = 1; this.onopen && this.onopen({}); }
        push(bytes) { const b = Buffer.from(bytes); this.onmessage({ data: b.buffer.slice(b.byteOffset, b.byteOffset + b.length) }); }
    }
    GameWS.all = [];
    const blobs = {}, workers = [];
    const cloneAB = d => typeof d === 'string' ? d : new Uint8Array(new Uint8Array(d)).buffer;
    class FakeWorker {
        constructor(url) {
            this.terminated = false;
            this.timers = new Set();
            workers.push(this);
            const self = this;
            const add = id => (self.timers.add(id), id);
            const clear = id => { self.timers.delete(id); wk.clear(id); };
            /* messages to the page arrive in a later task (step()) */
            const ctx = this.ctx = {
                WebSocket: GameWS, URL, console: { warn() {}, log() {} },
                setTimeout: (f, ms) => add(wk.setTimeout(f, ms)), setInterval: (f, ms) => add(wk.setInterval(f, ms)), clearTimeout: clear, clearInterval: clear,
                postMessage: d => { const c = cloneAB(d); page.setTimeout(() => { if (!self.terminated && self.onmessage) self.onmessage({ data: c }); }, 0); }
            };
            ctx.self = ctx;
            vm.createContext(ctx);
            /* the blob's last line starts the worker; keep its server for the test */
            vm.runInContext(blobs[url].replace(';LMBotCore.runWorker(self);', ';self.__server = LMBotCore.runWorker(self);'), ctx);
        }
        postMessage(d) { if (!this.terminated) this.ctx.onmessage({ data: cloneAB(d) }); }
        /* like a real worker: its timers stop; live = what was still running (leak check) */
        terminate() {
            this.terminated = true;
            this.live = wk.list.filter(t => this.timers.has(t.id));
            this.live.forEach(t => wk.clear(t.id));
        }
    }
    const listeners = {};
    const win = {
        OgVer: '9.9', SERVER_HOST: '',
        addEventListener: (n, f) => { listeners[n] = f; }, removeEventListener: (n, f) => { if (listeners[n] === f) delete listeners[n]; }
    };
    const fetched = [];
    const sb = {
        window: win, Uint8Array, ArrayBuffer, console: { warn() {} },
        setTimeout: page.setTimeout, Worker: FakeWorker,
        Blob: class { constructor(parts) { this.text = parts.join(''); } },
        URL: { createObjectURL: b => { const u = 'blob:' + Object.keys(blobs).length; blobs[u] = b.text; return u; }, revokeObjectURL: u => { delete blobs[u]; } },
        fetch: url => { fetched.push(url); return Promise.resolve({ ok: true, text: () => Promise.resolve(coreSrc) }); }
    };
    const sockSrc = extractFrom('class LMBotsWorkerSocket {');
    check('browser: LMBotsWorkerSocket extractable', !!sockSrc);
    vm.createContext(sb);
    vm.runInContext(sockSrc + '\nwindow.LMBotsWorkerSocket = LMBotsWorkerSocket', sb);

    // connectionBots.connect: browser worker for an empty address or "browser", else the WebSocket
    const cbSrc = extractFrom('window.connectionBots = {');
    const made = [];
    const cbw = { SERVER_HOST: '', OgVer: '9.9', LMBotsWorkerSocket: function (src) { made.push(['worker', src]); this.readyState = 0; } };
    const WS = function (url) { made.push(['ws', url]); this.readyState = 0; };
    WS.OPEN = 1; WS.CONNECTING = 0;
    const cbCtx = { window: cbw, WebSocket: WS, document: { getElementById: () => null }, _lmG1set() {} };
    vm.createContext(cbCtx);
    vm.runInContext(cbSrc, cbCtx);
    const CB = cbw.connectionBots;
    const pick = host => { cbw.SERVER_HOST = host; CB.ws = null; made.length = 0; CB.connect(); return made[0] && made[0][0]; };
    check('browser: connect uses the worker for "", "browser", " Browser ", null', ['', 'browser', ' Browser ', null].every(h => pick(h) === 'worker' && CB.inBrowser === true));
    check('browser: worker code from the bots folder on legendmod.ml', (pick('browser'), made[0][1] === 'https://www.legendmod.ml/ExampleScripts/agario-bots2/botcore.js?v=9.9'));
    check('browser: connect uses the WebSocket for a bot server address', ['ws://localhost:1337', 'wss://party-bots--x.repl.co'].every(h => pick(h) === 'ws' && made[0][1] === h && CB.inBrowser === false));
    check('browser: Bots address default is "browser" when none was saved', /if \(storedbotsRemoteIP == null \|\| storedbotsRemoteIP === ""\) \{\s*storedbotsRemoteIP = "browser";/.test(ogSrc) &&
        ogSrc.includes('list="botsRemoteIPList"') && ogSrc.includes('<option value="browser" data-i18n="game1.bots.hostBrowser">'));
    // browser mode: message 12 is the wait notice (no captcha button)
    {
        const toasts = [];
        const w = { userBots: {}, bots: {} };
        const ctx = { window: w, WebSocket: WS, DataView, Uint8Array, toastr: { warning: m => toasts.push(m), info: m => toasts.push(m) }, _lmTH: k => k, lmT: k => k,
            Premadeletter123: 'LM', setTimeout() {} };
        vm.createContext(ctx);
        vm.runInContext(cbSrc, ctx);
        const cb = w.connectionBots;
        cb.inBrowser = true; cb.ws = { readyState: 1 };
        cb.onmessage({ data: new Uint8Array([12]).buffer });
        check('browser: message 12 shows the wait notice, no captcha button', toasts.length === 1 && toasts[0].includes('game1.bots.captchaWait') && !toasts[0].includes('<button'));
    }

    // the worker socket end to end
    const got = [];
    const sock = new win.LMBotsWorkerSocket('https://www.legendmod.ml/ExampleScripts/agario-bots2/botcore.js?v=t');
    sock.onmessage = e => got.push(Buffer.from(e.data));
    let opened = 0, closed = 0;
    sock.onopen = () => opened++;
    sock.onclose = () => closed++;
    check('browser: connecting (readyState 0) until the code is loaded', sock.readyState === 0 && fetched.length === 1);
    await new Promise(r => setImmediate(r));
    const count = bytes => got.filter(b => b.equals(Buffer.from(bytes))).length;
    check('browser: open after the load, idle status [4,0,0], no worker yet', sock.readyState === 1 && opened === 1 && count([4, 0, 0]) === 1 && workers.length === 0);
    const step = () => page.run(0);
    sock.send(new Uint8Array([6, 0, 0, 0, 0, 0, 0, 0, 0]).buffer);
    sock.send(new Uint8Array([1]).buffer);
    check('browser: idle: other messages start nothing, Stop answers 2', workers.length === 0 && count([2]) === 1);

    const URL1 = 'wss://live-arena-ab-12x.agar.io:443/';
    const start = (url, n) => Buffer.concat([Buffer.from([0]), Buffer.from(url, 'latin1'), Buffer.from([0]), u32(22), u32(31000), Buffer.from([1]), Buffer.from('Bot', 'latin1'), Buffer.from([0]), Buffer.from([n])]);
    const toAB = b => b.buffer.slice(b.byteOffset, b.byteOffset + b.length);
    // not an agar.io server: 13, 2 and the worker goes
    sock.send(toAB(start('wss://imsolo.pro:2102', 3)));
    step();
    check('browser: non-agar.io server: 13 then 2, worker terminated, idle again', workers.length === 1 && workers[0].terminated && count([13]) === 1 && count([2]) === 2 && !sock._worker && count([4, 0, 0]) === 2);

    sock.send(toAB(start(URL1, 2)));
    const worker = workers[1], srv = worker && worker.ctx.__server;
    check('browser: Start runs a new worker with the bot core', !!srv && !worker.terminated && srv.session.active && srv.bots.amount === 2);
    wk.run(400);
    check('browser: bots join the game server like the browser does (no ws options, arraybuffer)', GameWS.all.length === 2 && GameWS.all.every(w => w.url === URL1 && w.opts === undefined && w.binaryType === 'arraybuffer'));
    const [g1, g2] = GameWS.all;
    g1.open(); g2.open();
    check('browser: handshake 254/255 sent', g1.sent.length === 2 && g1.sent[0][0] === 254 && g1.sent[1].readUInt32LE(1) === 31000);
    // bot 1 without a cipher: the spawn packet bytes
    g1.push([242, 0, 0, 0, 0]);
    check('browser: spawn packet = 0, nick, 0, "0", 0 (like server.js)', g1.sent[2] && g1.sent[2].equals(expectSpawn('Bot', '0')));
    // bot 2 with the cipher: key = murmur2(host + path + version, 255)
    g2.push(Buffer.concat([Buffer.from([241]), i32(77), Buffer.from('3.11.21'), Buffer.from([0])]));
    g2.push(algorithm.rotateBufferBytes(Buffer.from([242, 0, 0, 0, 0]), 77 ^ 31000)); // the game server's packets: decryption key ^ client version
    const enc = g2.sent[2] && Buffer.from(g2.sent[2]);
    check('browser: cipher key from the vendored murmur2 (= npm value)', !!enc && algorithm.rotateBufferBytes(enc, 2125815976).equals(expectSpawn('Bot', '0')));
    // captcha: 12 once, the bot waits, tokens are not taken
    const b1 = srv.userBots.find(b => b.ws === g1);
    g1.push([85]);
    sock.send(JSON.stringify({ message: 'botscode', msg: JSON.stringify('tok_' + 'Qw9-'.repeat(30)) }));
    step();
    check('browser: captcha: client gets 12 once, the bot keeps its socket and waits, no token taken', count([12]) === 1 && b1.waitingToken === 'spawn' && g1.readyState === 1 && g1.sent.length === 3 && srv.session.tokens.length === 0);
    // orientation and follow on a scaled, mirrored map
    {
        const S = 14142.135623730952, Q = { cx: 1500.5, cy: -800.25, w: 14189.596, h: 14098.493 }, fx = -1, fy = 1;
        /* 255: LZ4 block of one literal run (the game server compresses its world packets) */
        const packed = b => { const n = b.length, head = [Math.min(n, 15) << 4]; if (n >= 15) { let r = n - 15; while (r >= 255) { head.push(255); r -= 255; } head.push(r); } return Buffer.concat([Buffer.from([255]), u32(n), Buffer.from(head), b]); };
        g1.push(packed(Buffer.concat([Buffer.from([64]), f64(-2125), f64(-1280), f64(2125), f64(1280)]))); // a view rect first
        g1.push(packed(Buffer.concat([Buffer.from([64]), f64(Q.cx - Q.w / 2), f64(Q.cy - Q.h / 2), f64(Q.cx + Q.w / 2), f64(Q.cy + Q.h / 2)])));
        const refs = [{ x: 3000, y: -2000, mass: 5000 }, { x: -4000, y: 1500, mass: 3000 }, { x: 1000, y: 4200, mass: 1500 }];
        sock.send(toAB(Buffer.concat([Buffer.from([10, refs.length]), ...refs.map(r => Buffer.concat([i32(r.x), i32(r.y), u32(r.mass)]))])));
        g1.push(packed(Buffer.concat([Buffer.from([69]), u16(refs.length), ...refs.map(r => Buffer.concat([i32(Math.round(Q.cx + fx * r.x * Q.w / S)), i32(Math.round(Q.cy + fy * r.y * Q.h / S)), u32(r.mass), Buffer.from([0])]))])));
        sock.send(toAB(Buffer.concat([Buffer.from([6]), i32(1234), i32(-567)])));
        srv.user.isAlive = true; b1.followMouse = true;
        b1.move();
        const p = g1.sent[g1.sent.length - 1];
        check('browser: orientation found from ghost cells, bot follows the mouse on its scaled mirrored map', b1.orientFixed && b1.fixX === fx && b1.fixY === fy && p[0] === 16 &&
            Math.abs(p.readInt32LE(1) - (Q.cx + fx * 1234 * Q.w / S)) <= 2 && Math.abs(p.readInt32LE(5) - (Q.cy + fy * -567 * Q.h / S)) <= 2);
    }
    // status every second, then Stop: 1, 2, sockets closed, worker terminated, no timer left
    wk.run(1000); step();
    check('browser: status [4, connected, spawned, waiting for a captcha, stopped] every second', count([4, 2, 0, 1, 0]) >= 1);
    sock.send(new Uint8Array([1]).buffer);
    wk.run(2100); step();
    check('browser: Stop: 1 then 2, all game sockets closed, worker terminated, idle status', count([1]) === 1 && count([2]) === 3 && GameWS.all.every(w => w.readyState === 3) && worker.terminated && !sock._worker && count([4, 0, 0]) === 3);
    check('browser: Stop: no bot timer left in the worker but its status interval', worker.live.length === 1 && worker.live[0].every === 1000);
    // a new Start after Stop: a fresh worker; then close() (new connect / disconnect)
    sock.send(toAB(start(URL1, 1)));
    wk.run(200);
    const w3 = workers[2], g3 = GameWS.all[2];
    g3.open();
    check('browser: Start after Stop runs a fresh worker', !!w3 && !w3.terminated && w3.ctx.__server.session.active && GameWS.all.length === 3);
    sock.close();
    check('browser: close: the worker closes its game sockets, readyState 3', sock.readyState === 3 && g3.readyState === 3 && !listeners.pagehide);
    page.run(400);
    check('browser: close: worker terminated with no timer left, onclose once, blob URL revoked', w3.terminated && w3.live.length === 0 && closed === 1 && (page.run(1000), Object.keys(blobs).length === 0));
    sock.send(toAB(start(URL1, 1)));
    check('browser: closed socket sends nothing', workers.length === 3);
    // page closing while bots run: terminated at once
    {
        const s2 = new win.LMBotsWorkerSocket('x');
        await new Promise(r => setImmediate(r));
        s2.send(toAB(start(URL1, 1)));
        const w4 = workers[3];
        listeners.pagehide();
        check('browser: page closing terminates the running worker', s2.readyState === 3 && w4.terminated);
    }
}

browserBots().catch(e => check('browser bots: suite ran without exceptions (' + (e && e.stack) + ')', false)).then(() => {
    console.log('\n' + (fail ? 'FAIL: ' + fail + ' failure(s)' : 'ALL PASS'));
    process.exit(fail ? 1 : 0);
});
