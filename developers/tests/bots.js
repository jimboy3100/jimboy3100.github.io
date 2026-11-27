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
    check('moveInterval variable declared', serverSrc.includes('moveInterval'));
    check('moveInterval guarded before creation', serverSrc.includes('if (!moveInterval)'));
}

// ---- server.js: socket cleanup in Bot.onclose ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('Bot.onclose nulls ws reference', serverSrc.includes('this.ws = null'));
    check('Bot.onclose clears onmessage handler', serverSrc.includes('this.ws.onmessage = null'));
    check('Bot.onerror null-checks this.ws', serverSrc.includes('if (this.ws && (this.ws.readyState'));
}

// ---- server.js: isSplited field properly initialized ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    // isSplited should be in constructor and reset
    const constructorIdx = serverSrc.indexOf('constructor() {');
    const resetIdx = serverSrc.indexOf('reset() {');
    const connectIdx = serverSrc.indexOf('connect() {', resetIdx);
    const constructorBlock = serverSrc.substring(constructorIdx, resetIdx);
    const resetBlock = serverSrc.substring(resetIdx, connectIdx);
    check('isSplited initialized in constructor', constructorBlock.includes('this.isSplited'));
    check('isSplited reset in reset()', resetBlock.includes('this.isSplited'));
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

// ---- server.js: player position opcode ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('server.js has playerX on user object', serverSrc.includes('playerX: 0'));
    check('server.js has playerY on user object', serverSrc.includes('playerY: 0'));
    check('server.js handles opcode 7 (player position)', serverSrc.includes('case 7:'));
    check('server.js reads playerX from opcode 7', serverSrc.includes('user.playerX = reader.readInt32()'));
    check('server.js reads playerY from opcode 7', serverSrc.includes('user.playerY = reader.readInt32()'));
    // Orbit and position-reporting removed per owner request
    check('server.js does NOT have orbit logic', !serverSrc.includes('distToPlayer'));
    check('server.js does NOT send opcode 9', !serverSrc.includes("posBuf.writeUInt8(9, 0)"));
    // Crash fix: uses buffer.length (not data.length) for opcode 7/11 guard
    check('server.js uses buffer.length for opcode guard', serverSrc.includes('buffer.length === 9'));
    check('server.js does NOT use data.length for opcode guard', !serverSrc.includes('data.length === 9'));
}

// ---- server-fast.js: player position opcode ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    check('server-fast.js has playerX on user object', fastSrc.includes('playerX: 0'));
    check('server-fast.js handles opcode 7', fastSrc.includes('case 7:'));
    // Orbit and position-reporting removed per owner request
    check('server-fast.js does NOT have orbit logic', !fastSrc.includes('distToPlayer'));
    check('server-fast.js does NOT send opcode 9', !fastSrc.includes("posBuf.writeUInt8(9, 0)"));
    // Crash fix: uses buffer.length (not data.length) for opcode 7/11 guard
    check('server-fast.js uses buffer.length for opcode guard', fastSrc.includes('buffer.length === 9'));
    check('server-fast.js does NOT use data.length for opcode guard', !fastSrc.includes('data.length === 9'));
}

// ---- server-fast.js: parity with server.js reliability fixes ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    check('server-fast.js tracks connectedBots', fastSrc.includes('connectedBots'));
    check('server-fast.js tracks spawnedBots', fastSrc.includes('spawnedBots'));
    check('server-fast.js Bot.onclose nulls ws', fastSrc.includes('this.ws = null'));
    check('server-fast.js Bot.onclose clears onmessage', fastSrc.includes('this.ws.onmessage = null'));
    check('server-fast.js has statusInterval', fastSrc.includes('statusInterval'));
    check('server-fast.js has shutdownInterval tracked', fastSrc.includes('let shutdownInterval'));
    check('server-fast.js clears shutdownInterval', fastSrc.includes('if(shutdownInterval) clearInterval(shutdownInterval)'));
    check('server-fast.js nulls userWS on disconnect', fastSrc.includes('userWS = null'));
    check('server-fast.js compressed size cap', fastSrc.includes('compressedSize > 1048576'));
    check('server-fast.js has virus evasion', fastSrc.includes("'virus'"));
    check('server-fast.js has upperhand AI', fastSrc.includes("'upperhand'"));
    check('server-fast.js has sendPositionDirect', fastSrc.includes('sendPositionDirect'));
    check('server-fast.js isSplited initialized', fastSrc.includes('this.isSplited = false'));
    check('server-fast.js moveInterval guarded', fastSrc.includes('moveInterval'));
    check('server-fast.js Bot.onerror null-checks ws', fastSrc.includes('this.ws &&'));
}

// ---- userscript: obsolete position/ghost-cell code removed ----
{
    const usSrc = fs.readFileSync(path.join(botsDir, 'free-agario-bots.vanilla.user.js'), 'utf8');
    check('userscript: no playerPosition buffer', !usSrc.includes('playerPosition(x, y)'));
    check('userscript: no playerPosInterval', !usSrc.includes('playerPosInterval'));
    check('userscript: no opcode 9 handler', !usSrc.includes('case 9:'));
    check('userscript: no botGhostCells', !usSrc.includes('window.botGhostCells'));
}

// ---- server.js: reusable lifecycle (no process.exit on stop) ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    check('server.js has resetServer function', serverSrc.includes('function resetServer()'));
    // No uncommented process.exit calls (commented-out blocks don't count)
    const uncommentedSrc = serverSrc.replace(/\/\*[\s\S]*?\*\//g, '');
    check('server.js does NOT call process.exit on stop', !uncommentedSrc.includes('process.exit'));
    check('server.js resetServer clears bots', serverSrc.includes('userBots.length = 0'));
    check('server.js resetServer resets stoppingBots', serverSrc.includes('stoppingBots = false'));
    check('server.js resetServer clears moveInterval', serverSrc.includes('clearInterval(moveInterval)'));
}

// ---- server-fast.js: reusable lifecycle (no process.exit on stop) ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    check('server-fast.js has resetServer function', fastSrc.includes('function resetServer()'));
    check('server-fast.js does NOT call process.exit on stop', !fastSrc.includes('setTimeout(process.exit'));
    check('server-fast.js resetServer clears bots', fastSrc.includes('userBots.length = 0'));
    check('server-fast.js resetServer resets stoppingBots', fastSrc.includes('stoppingBots = false'));
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

// ---- Both servers accept opcode 11 (alias for opcode 7) ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    check('server.js accepts opcode 11', serverSrc.includes('case 11:'));
    check('server-fast.js accepts opcode 11', fastSrc.includes('case 11:'));
}

// ---- Opcode 7/11 length guard: servers must reject sendMode-sized packets ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    // The guard checks buffer.length === 9 before reading playerX/playerY (crash fix)
    check('server.js guards opcode 7 by buffer.length', serverSrc.includes('buffer.length === 9'));
    check('server-fast.js guards opcode 7 by buffer.length', fastSrc.includes('buffer.length === 9'));
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
    check('ogario: BR fill auto-calculates needed bots', ogSrc.includes('15 - currentPlayers'));
    check('ogario: BR fill auto-stops when game starts', ogSrc.includes('battleRoyale.state > 1'));
    check('ogario: BR fill stops on mode change', /gameMode\s*!==\s*':battleroyale'.*brStopFilling/.test(ogSrc));
    check('ogario: BR watcher interval cleaned on stop', ogSrc.includes('clearInterval(window._brLobbyWatcher)'));
    // Lifecycle edge-case fixes
    check('ogario: brStopFilling exposed on window for onclose', ogSrc.includes('window._brStopFilling = brStopFilling'));
    check('ogario: onclose calls _brStopFilling', ogSrc.includes("typeof window._brStopFilling === 'function'"));
    check('ogario: brStopFilling guards send with readyState', /function brStopFilling[\s\S]{0,700}readyState\s*===\s*WebSocket\.OPEN/.test(ogSrc));
    check('ogario: brStopFilling is idempotent (early return)', /brStopFilling[\s\S]{0,100}!window\._brFilling\s*&&\s*!window\._brLobbyWatcher.*return/.test(ogSrc));
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

// ---- Behavioral: mouse position send no longer uses broken readyState check ----
{
    const ogSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    // Find the cursor/mouse sending block
    const mouseBlock = ogSrc.match(/userBots\.startedBots[\s\S]{0,500}mousePosition/);
    check('ogario: mouse send block found', !!mouseBlock);
    if (mouseBlock) {
        check('ogario: mouse send uses connectionBots.send (not raw ws)', mouseBlock[0].includes('connectionBots.send'));
        check('ogario: mouse send does not check wrapper readyState', !mouseBlock[0].includes('connectionBots.readyState'));
    }
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

// ---- server.js: improved lifecycle (followMouseTimeout, dataBot, statusInterval, startup cancel) ----
{
    const serverSrc = fs.readFileSync(path.join(botsDir, 'server.js'), 'utf8');
    // Extract resetServer function body
    const resetMatch = serverSrc.match(/function resetServer\(\)\s*\{([\s\S]*?)\n\}/);
    check('server.js resetServer extractable', !!resetMatch);
    if (resetMatch) {
        const resetBody = resetMatch[1];
        check('server.js resetServer clears followMouseTimeout', resetBody.includes('followMouseTimeout'));
        check('server.js resetServer disconnects dataBot', resetBody.includes('dataBot.ws'));
        check('server.js resetServer resets dataBot.buffersKey', resetBody.includes('dataBot.buffersKey = 0'));
        check('server.js resetServer does NOT clear statusInterval', !resetBody.includes('clearInterval(statusInterval)'));
    }
    // Stop handler allows stopping during startup (before user.startedBots is true)
    check('server.js stop handler allows startup cancel', serverSrc.includes('user.startedBots || startBotsInterval'));
    // Close handler also allows startup cancel
    const closeSection = serverSrc.substring(serverSrc.indexOf("ws.on('close'"));
    check('server.js close handler allows startup cancel', closeSection.includes('user.startedBots || startBotsInterval'));
}

// ---- server-fast.js: improved lifecycle (followMouseTimeout, dataBot, statusInterval, startup cancel) ----
{
    const fastSrc = fs.readFileSync(path.join(botsDir, 'server-fast.js'), 'utf8');
    const resetMatch = fastSrc.match(/function resetServer\(\)\s*\{([\s\S]*?)\n\}/);
    check('server-fast.js resetServer extractable', !!resetMatch);
    if (resetMatch) {
        const resetBody = resetMatch[1];
        check('server-fast.js resetServer clears followMouseTimeout', resetBody.includes('followMouseTimeout'));
        check('server-fast.js resetServer disconnects dataBot', resetBody.includes('dataBot.ws'));
        check('server-fast.js resetServer resets dataBot.buffersKey', resetBody.includes('dataBot.buffersKey = 0'));
        check('server-fast.js resetServer does NOT clear statusInterval', !resetBody.includes('clearInterval(statusInterval)'));
    }
    check('server-fast.js stop handler allows startup cancel', fastSrc.includes('user.startedBots || startBotsInterval'));
    const closeSection = fastSrc.substring(fastSrc.indexOf("ws.on('close'"));
    check('server-fast.js close handler allows startup cancel', closeSection.includes('user.startedBots || startBotsInterval'));
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
    check('ogario: BR fill validates lobby state (br.state !== 0)', ogSrc.includes('br.state !== 0'));
    check('ogario: BR fill validates lobby joined', ogSrc.includes('!br.joined'));
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

console.log('\n' + (fail ? 'FAIL: ' + fail + ' failure(s)' : 'ALL PASS'));
process.exit(fail ? 1 : 0);
