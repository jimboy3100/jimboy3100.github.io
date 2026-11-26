/* Bot reliability tests: validates buffer helpers, URL regex, JSON guards, and
 * compressed-size cap without requiring network or the full ws server.
 * node developers/tests/bots.js */
const fs = require('fs'), path = require('path');
const botsDir = path.join(__dirname, '..', '..', 'ExampleScripts', 'agario-bots2');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

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

// ---- server.js: JSON.parse is guarded ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    // The control-message JSON parsing block should be inside a try
    const msgBlockIdx = serverSrc.indexOf('bufStr.includes(\'"message"\')');
    check('Control message block found', msgBlockIdx > -1);
    if (msgBlockIdx > -1) {
        // Find the next JSON.parse after the message check
        const afterMsg = serverSrc.substring(msgBlockIdx, msgBlockIdx + 300);
        const tryIdx = afterMsg.indexOf('try {');
        const parseIdx = afterMsg.indexOf('JSON.parse');
        check('JSON.parse is inside try block', tryIdx > -1 && parseIdx > tryIdx);
    }

    // Update checker JSON.parse should also be guarded
    const updateBlock = serverSrc.indexOf('requesterConfig = JSON.parse');
    const updateBlockConst = serverSrc.indexOf('const requesterConfig = JSON.parse');
    // Should use 'const' (our fix) or be inside try
    if (updateBlockConst > -1) {
        const before = serverSrc.substring(Math.max(0, updateBlockConst - 200), updateBlockConst);
        check('Update JSON.parse is inside try block', before.includes('try {'));
    } else {
        check('Update JSON.parse uses const (our fix applied)', false);
    }
}

// ---- server.js: shutdown intervals are tracked ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('shutdownInterval variable declared', serverSrc.includes('let shutdownInterval'));
    check('shutdown interval cleared before new one', serverSrc.includes('if (shutdownInterval) clearInterval(shutdownInterval)'));
    check('statusInterval cleared on disconnect', serverSrc.includes('statusInterval = null'));
}

// ---- server.js: socket cleanup in Bot.onclose ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('Bot.onclose nulls ws reference', serverSrc.includes('this.ws = null'));
    check('Bot.onclose clears onmessage handler', serverSrc.includes('this.ws.onmessage = null'));
}

// ---- server.js: userWS nulled on close ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('userWS nulled on user disconnect', serverSrc.includes('userWS = null'));
}

// ---- server.js: compressed size safety cap ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('Compressed size has 1MB safety cap', serverSrc.includes('compressedSize > 1048576'));
}

// ---- server.js: player position opcode (ghost-cell orientation) ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('server.js has playerX on user object', serverSrc.includes('playerX: 0'));
    check('server.js has playerY on user object', serverSrc.includes('playerY: 0'));
    check('server.js handles opcode 7 (player position)', serverSrc.includes('case 7:'));
    check('server.js reads playerX from opcode 7', serverSrc.includes('user.playerX = reader.readInt32()'));
    check('server.js reads playerY from opcode 7', serverSrc.includes('user.playerY = reader.readInt32()'));
    // AI orbit logic: bot should orbit near player when in AI mode
    check('server.js has player orbit logic (distToPlayer)', serverSrc.includes('distToPlayer'));
    check('server.js converts player absolute to bot local', serverSrc.includes('user.playerX + this.offsetX'));
    // Bot position reporting (opcode 9 to client)
    check('server.js sends opcode 9 (bot positions)', serverSrc.includes("posBuf.writeUInt8(9, 0)"));
    check('server.js converts bot local to absolute (subtracts offset)', serverSrc.includes('bx - b.offsetX'));
}

// ---- server-fast.js: player position opcode (ghost-cell orientation) ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    check('server-fast.js has playerX on user object', fastSrc.includes('playerX: 0'));
    check('server-fast.js handles opcode 7', fastSrc.includes('case 7:'));
    check('server-fast.js has player orbit logic', fastSrc.includes('distToPlayer') || fastSrc.includes('playerLocalX'));
}

// ---- userscript: player position sending ----
{
    const usSrc = fs.readFileSync(path.join(botsDir, 'free-agario-bots.vanilla.user.js'), 'utf8');
    check('userscript has playerPosition buffer', usSrc.includes('playerPosition(x, y)'));
    check('userscript sends opcode 7', usSrc.includes("writer.writeUint8(7)"));
    check('userscript has playerPosInterval', usSrc.includes('playerPosInterval'));
    check('userscript cleans up playerPosInterval on close', usSrc.includes('clearInterval(window.user.playerPosInterval)'));
    // Bot ghost cell positions received
    check('userscript handles opcode 9 (bot positions)', usSrc.includes('case 9:'));
    check('userscript stores botGhostCells', usSrc.includes('window.botGhostCells'));
}

// ---- process.js: only restarts on non-zero exit ----
{
    const processSrc = fs.readFileSync(path.join(botsDir, 'process.js'), 'utf8');
    check('process.js restarts only on non-zero exit code', processSrc.includes('code !== 0'));
}

// ---- server-fast.js: spawn2 called correctly (no missing args) ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    // All spawn2 calls should use bots.name
    const spawn2Calls = fastSrc.match(/buffers\.spawn2\([^)]+\)/g) || [];
    check('server-fast.js has spawn2 calls', spawn2Calls.length > 0);
    const allHaveArg = spawn2Calls.every(c => c.includes('bots.name'));
    check('server-fast.js spawn2 always passes bots.name', allHaveArg);

    // URL regex safety
    check('server-fast.js URL regex validates match', fastSrc.includes('urlMatch') || !fastSrc.includes('game.url.match'));
}

console.log('\n' + (fail ? 'FAIL: ' + fail + ' failure(s)' : 'ALL PASS'));
process.exit(fail ? 1 : 0);
