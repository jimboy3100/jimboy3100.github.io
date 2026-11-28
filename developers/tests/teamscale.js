/* Team positions (relay opcode 30) and waves (opcode 45) between two agar.io connections with
 * their own map scale, offset and mirror, with real code cut out of ogario/ogario.v4.js:
 * getPlayerX/Y, sendPlayerPosition, updateTeamPlayerPosition, the lmTeam* helpers, the wave
 * send/receive path (sendTeamWave, sendWavePing, readWavePing...), readMessage, minimapCell,
 * and LM.setMapOffset / _lmApplyFullBorder / translateX/Y (the Rotate Map flip that matches a
 * mirrored connection to the team frame, as the cell parser applies it).
 * A point of the shared world W is raw = C + s * W / k on a connection (C its border centre,
 * k = 14142.1 / its border width, s its mirror); every client must put a teammate there.
 * Checked: borders 14098.493 and 14189.596 wide, all 4 mirror cases on both sides, the
 * teammate marker and the wave within 2 units of the true spot; the op30 packet stays 17
 * bytes with the same fields; an older build's positions and waves placed exactly as before;
 * private servers and Expanding Land unchanged (scale 1); a Delta wave on such a border.
 * With multibox the position sent (and LMEvents.api.getPosition, the Socket3 "pos" message) is the
 * player you control (lmMyPosition), not the camera centre, with that player's mass.
 * node developers/tests/teamscale.js [ogario.v4.js] */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const safe = (name, fn) => { try { fn(); } catch (e) { check(name, false, 'threw ' + (e && e.message)); } };

function block(i) {
    if (i < 0) return null;
    let d = 0, k = src.indexOf('{', i);
    for (; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && --d === 0) return src.slice(i, k + 1);
    }
    return null;
}
/* a method from its header to the matching closing brace; null when the source has none */
function method(header) {
    const i = src.indexOf('\n        ' + header);
    return i < 0 ? null : block(i + 1);
}
const need = (s, what) => { if (!s) { console.log('FAIL source marker not found: ' + what); process.exit(1); } return s; };
/* the lmTeam* helpers are new: an older source runs without them (its own behaviour) */
const APP = ['getPlayerX()', 'getPlayerY()', 'sendPlayerPosition()', 'updateTeamPlayerPosition(message)', 'checkPlayerID(id)',
    'isSocketOpen()', 'createView(value)', 'sendBuffer(value)', 'readMessage(message)',
    'lmWaveStats()', 'lmWaveOffsetX()', 'lmWaveOffsetY()', 'lmWaveSeen(', 'lmWaveSenderIndex(', 'readWavePing(view)',
    'lmPingLabel(type)', 'lmMarkerPoint()', 'sendTeamWave()', 'lmWaveRoute()', 'sendWavePing(', 'updateTarget('];
const appSrc = APP.map(h => need(method(h), h));
const OPT = ['lmTeamScale(', 'lmTeamWorldOut(', 'lmTeamWorldIn('].map(h => method(h)).filter(Boolean);
const LMSRC = ['sendWaves(', 'setMapOffset(', '_lmBorderValid(', '_lmApplyFullBorder(', '_lmFullBorderNow()', 'translateX(x)', 'translateY(x)']
    .map(h => need(method(h), h));
const cellSrc = need(block(src.indexOf('function minimapCell(')), 'minimapCell');
/* "my position" (the player you control, else the main player, else the camera); an older source has none */
const myPosSrc = [block(src.indexOf('function getActiveSpect(')), block(src.indexOf('function lmMyPosition() {'))].filter(Boolean).join('\n');

const W = 14142.135623730952;
const VNR = { '1,1': 0, '-1,1': 1, '-1,-1': 2, '1,-1': 3 }; /* vnr of a mirror [sx, sy] */

function page(conn, opts) {
    opts = opts || {};
    let clock = 1000000;
    const ctx = {
        console: { log() { }, warn() { }, debug() { }, error() { } },
        Date: { now: () => clock }, Math, Number, Array, Object, String, DataView, ArrayBuffer, Uint8Array, RangeError, JSON,
        defaultSettings: { splitRangeColor: '#00e6ff', miniMapTeammatesColor: '#ffffff' },
        defaultmapsettings: {},
        lmT: (k) => k,
        $: () => ({ val: () => '', includes: () => false }),
        setTimeout: () => 0,
        toastr: { info() { }, error() { } },
        ogarcopythelb: { color: '#123456' },
        WebSocket: { OPEN: 1 }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(myPosSrc, ctx);
    const LM = vm.runInContext('({' + LMSRC.join(',\n') + ', addSpect() { } })', ctx);
    Object.assign(LM, {
        Waves: [], _lmPings: [], mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, mapOffsetFixed: false,
        connectionIntegrity: false, serverType: '', isLegendWorld: false, cursorX: 0, cursorY: 0,
        play: true, playerCellsMulti: [], playerMass: 1234, vnr: 0, vector: [[0, 0], [1, 0], [1, 1], [0, 1]]
    });
    ctx.LM = ctx.ogario = ctx.legendmod = LM;
    const app = vm.runInContext('({' + appSrc.concat(OPT).join(',\n') + '})', ctx);
    const relay = { isFake: true, readyState: 1, OPEN: 1, sockets: [{ readyState: 1 }], sent: [], send(b) { this.sent.push(new DataView(b)); } };
    Object.assign(app, { playerID: opts.playerID || 7, teamPlayers: [], socket: relay, targeting: false });
    ctx.ogarioWS = relay;
    ctx.application = app;
    vm.runInContext(cellSrc, ctx);
    /* the connection: border edges from centre C and width per axis */
    const kind = conn.kind || 'agar';
    LM.isLegendWorld = kind === 'el'; LM.connectionIntegrity = kind === 'agar'; LM.serverType = kind === 'agar' ? 'agario' : '';
    if (kind === 'el') LM.mapOffset = 0;
    LM.setMapOffset(conn.cx - conn.w / 2, conn.cy - conn.h / 2, conn.cx + conn.w / 2, conn.cy + conn.h / 2);
    LM.vnr = VNR[conn.s.join()];
    const kx = kind === 'agar' ? W / conn.w : 1, ky = kind === 'agar' ? W / conn.h : 1;
    /* a world point on this connection: raw as the server sends it, local as the cells keep it */
    const local = (wx, wy) => {
        let x = conn.cx + conn.s[0] * wx / kx, y = conn.cy + conn.s[1] * wy / ky;
        if (LM.vector[LM.vnr][0]) x = LM.translateX(x);
        if (LM.vector[LM.vnr][1]) y = LM.translateY(y);
        return { x, y };
    };
    return {
        ctx, LM, app, relay, kx, ky, local,
        tick(ms) { clock += ms; },
        at(wx, wy) { const p = local(wx, wy); LM.playerX = p.x; LM.playerY = p.y; },
        addMate(id) { const m = vm.runInContext('new minimapCell(' + id + ', "mate", "mate", "")', ctx); app.teamPlayers.push(m); return m; },
        recv(v) { app.readMessage(v); }
    };
}
/* where this client shows a teammate (minimap, edge arrows: x - mapOffsetX in the cells' frame) */
const shown = (p, m) => ({ x: m.x - p.LM.mapOffsetX, y: m.y - p.LM.mapOffsetY });
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const A0 = { w: 14098.493, h: 14080.25, cx: 1234.5, cy: -876.25 };
const B0 = { w: 14189.596, h: 14197.75, cx: -2222.75, cy: 3333.5 };
const MIRRORS = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
/* points near the edges and the centre (the error grows with the distance from the centre) */
const PTS = [[7000, -6990], [-6995, 7005], [3561.4, 2048.7], [-7020.2, -7011.9], [6.3, -4.8], [6990.6, 6999.1], [-12.5, 7030.3]];

/* ---------- 1. new build to new build: marker and wave on the true spot ---------- */
let worstPos = 0, worstWave = 0, layoutOk = true, layoutInfo = '';
for (const sa of MIRRORS) for (const sb of MIRRORS) safe('mirror ' + sa + ' / ' + sb, () => {
    const A = page(Object.assign({ s: sa }, A0), { playerID: 7001 });
    const B = page(Object.assign({ s: sb }, B0), { playerID: 7002 });
    const mate = B.addMate(7001);
    for (const [wx, wy] of PTS) {
        A.at(wx, wy);
        A.app.sendPlayerPosition();
        const pkt = A.relay.sent[A.relay.sent.length - 1];
        if (!pkt || pkt.byteLength !== 17 || pkt.getUint8(0) !== 30 || pkt.getUint32(1, true) !== 7001 || pkt.getUint32(13, true) !== 1234) {
            layoutOk = false; layoutInfo = pkt ? pkt.byteLength + ' bytes' : 'not sent';
        }
        B.recv(pkt);
    }
    /* the last point again (positions are classified once several have come) */
    for (const [wx, wy] of PTS) {
        A.at(wx, wy);
        A.app.sendPlayerPosition();
        B.recv(A.relay.sent[A.relay.sent.length - 1]);
        const truth = B.local(wx, wy);
        worstPos = Math.max(worstPos, dist(shown(B, mate), truth));
        /* wave at the same spot (A's cursor there) */
        const c = A.local(wx, wy);
        A.LM.cursorX = c.x; A.LM.cursorY = c.y;
        A.tick(400); B.tick(400);
        A.app.sendTeamWave();
        B.recv(A.relay.sent[A.relay.sent.length - 1]);
        const w = B.LM.Waves[B.LM.Waves.length - 1];
        worstWave = Math.max(worstWave, w && w.sender !== 'wave:self' ? dist(w, truth) : Infinity);
    }
});
check('teammate marker within 2 units of the true spot (2 borders, 16 mirror pairs): worst ' + worstPos.toFixed(2), worstPos < 2, 'worst ' + worstPos.toFixed(2));
check('wave within 2 units of the true spot (2 borders, 16 mirror pairs): worst ' + worstWave.toFixed(2), worstWave < 2, 'worst ' + worstWave.toFixed(2));
check('op30 layout unchanged: 17 bytes, u8 30, u32 id, i32 x, i32 y, u32 mass', layoutOk, layoutInfo);

/* ---------- 2. an older build (centred units of its own connection, truncated) ---------- */
safe('older build', () => {
    const B = page(Object.assign({ s: [1, 1] }, B0), { playerID: 7002 });
    const mate = B.addMate(5);
    const packet = (x, y) => { const v = new DataView(new ArrayBuffer(17)); v.setUint8(0, 30); v.setUint32(1, 5, true); v.setInt32(5, x, true); v.setInt32(9, y, true); v.setUint32(13, 500, true); return v; };
    /* three even sums first, then odd ones: every position as it came (as before) */
    const seq = [[6900, -6900], [6902, -6900], [6904, -6898], [6905, -6898], [-7003, 7001], [12, 13], [-5, 2]];
    let asBefore = true;
    for (const [x, y] of seq) {
        B.recv(packet(x, y));
        if (mate.x !== x || mate.y !== y) asBefore = false;
    }
    check('older build: every position placed exactly as before', asBefore, mate.x + ',' + mate.y);
    /* stays an older build: even sums later are still taken as they come */
    for (let i = 0; i < 10; i++) B.recv(packet(1000 + 2 * i, 2000));
    check('older build: still placed as before after many even sums', mate.x === 1018 && mate.y === 2000, mate.x + ',' + mate.y);
    /* its wave: in its own units, as before */
    const wv = new DataView(new ArrayBuffer(14));
    wv.setUint8(0, 45); wv.setUint16(1, 5, true); wv.setUint16(3, 5, true); wv.setUint8(5, 4); wv.setInt32(6, 6800, true); wv.setInt32(10, -6700, true);
    B.recv(wv);
    const w = B.LM.Waves[B.LM.Waves.length - 1];
    check('older build: its wave placed as before', w && w.x === 6800 - B.LM.mapOffsetX && w.y === -6700 - B.LM.mapOffsetY, w && w.x + ',' + w.y);
});

/* ---------- 3. an older receiver of the new packet: no worse than the scale difference ---------- */
safe('older receiver', () => {
    const A = page(Object.assign({ s: [1, 1] }, A0));
    const B = page(Object.assign({ s: [1, 1] }, B0));
    let worst = 0;
    for (const [wx, wy] of PTS) {
        A.at(wx, wy);
        A.app.sendPlayerPosition();
        const v = A.relay.sent[A.relay.sent.length - 1];
        /* the older updateTeamPlayerPosition: the values as they come */
        const t = B.local(wx, wy);
        worst = Math.max(worst, Math.hypot(v.getInt32(5, true) - B.LM.mapOffsetX - t.x, v.getInt32(9, true) - B.LM.mapOffsetY - t.y));
    }
    check('older receiver: within the scale difference of its own map (< 50 units): ' + worst.toFixed(1), worst < 50, worst.toFixed(1));
});

/* ---------- 4. scale 1: private servers and Expanding Land as before ---------- */
for (const [name, conn] of [['private server', { kind: 'private', w: 12000, h: 10000, cx: 3000, cy: -3000 }], ['Expanding Land', { kind: 'el', w: 14142, h: 14142, cx: 0, cy: 0 }]]) safe(name, () => {
    const A = page(Object.assign({ s: [1, 1] }, conn), { playerID: 31 });
    check(name + ': scale 1', !A.app.lmTeamScale || (A.app.lmTeamScale(0) === 1 && A.app.lmTeamScale(1) === 1));
    let worst = 0;
    for (const [px, py] of [[1234.7, -2345.2], [-4000.4, 3999.6], [10.5, 11.5]]) {
        A.LM.playerX = px; A.LM.playerY = py;
        A.app.sendPlayerPosition();
        const v = A.relay.sent[A.relay.sent.length - 1];
        worst = Math.max(worst, Math.abs(v.getInt32(5, true) - A.app.getPlayerX()), Math.abs(v.getInt32(9, true) - A.app.getPlayerY()));
    }
    check(name + ': positions sent as before (less than 1 unit)', worst < 1, worst);
    A.LM.cursorX = 1500; A.LM.cursorY = -1500;
    A.app.sendTeamWave();
    const v = A.relay.sent[A.relay.sent.length - 1];
    check(name + ': wave sent as before', v.getInt32(6, true) === Math.round(1500 + A.app.lmWaveOffsetX()) && v.getInt32(10, true) === Math.round(-1500 + A.app.lmWaveOffsetY()));
});

/* ---------- 5. Delta's wave (its stage: the map scaled to 14142 and centred) ---------- */
safe('Delta wave', () => {
    const B = page(Object.assign({ s: [1, 1] }, B0));
    const wv = new DataView(new ArrayBuffer(14));
    const [wx, wy] = [6950.2, -7001.7];
    wv.setUint8(0, 45); wv.setUint16(1, 99, true); wv.setUint16(3, 42, true); wv.setUint8(5, 4);
    wv.setInt32(6, Math.round(wx * 14142 / W), true); wv.setInt32(10, Math.round(wy * 14142 / W), true);
    B.recv(wv);
    const w = B.LM.Waves[B.LM.Waves.length - 1];
    const d = w ? dist(w, B.local(wx, wy)) : Infinity;
    check('a Delta wave on a 14189.6 wide border: within 2 units of its spot', d < 2, d.toFixed(2));
});

/* ---------- 6. multibox: the team position is where you are (the player you control), not the camera ---------- */
safe('multibox position', () => {
    const A = page({ kind: 'private', s: [1, 1], w: 12000, h: 10000, cx: 3000, cy: -3000 }, { playerID: 41 });
    const sent = () => { A.app.sendPlayerPosition(); const v = A.relay.sent[A.relay.sent.length - 1]; return [v.getInt32(5, true) - A.LM.mapOffsetX, v.getInt32(9, true) - A.LM.mapOffsetY, v.getUint32(13, true)]; };
    const near = (p, x, y) => Math.abs(p[0] - x) < 1.01 && Math.abs(p[1] - y) < 1.01;
    /* the camera between both players (middle view), the main player and a unit elsewhere */
    Object.assign(A.LM, { playerX: 0, playerY: 0, playerCells: [{}], viewXTrue: 1234.7, viewYTrue: -2345.2 });
    A.ctx.spects = [{ number: 1, player: false }, { number: 2, player: true, playerCellIDs: [3], playerX: -4000.4, playerY: 3999.6, playerMass: 777 }];
    let p = sent();
    check('multibox: main player controlled: its own cells, not the camera', near(p, 1234.7, -2345.2), p);
    check('multibox: main player controlled: its mass', p[2] === 1234, p);
    A.ctx.multiboxPlayerEnabled = 2;
    p = sent();
    check('multibox: a unit controlled: that unit', near(p, -4000.4, 3999.6), p);
    check('multibox: a unit controlled: the unit\'s mass, not the main player\'s', p[2] === 777, p);
    A.ctx.spects[1].playerCellIDs = [];
    p = sent();
    check('multibox: the controlled unit dead: the main player', near(p, 1234.7, -2345.2), p);
    check('multibox: the controlled unit dead: the main player\'s mass', p[2] === 1234, p);
});

/* ---------- 6b. Socket3 "pos": the same position and mass, in the getPlayerX/Y frame ---------- */
safe('Socket3 position', () => {
    const A = page({ kind: 'private', s: [1, 1], w: 12000, h: 10000, cx: 3000, cy: -3000 }, { playerID: 42 });
    const s3 = need(method('sendSocket3Position()'), 'sendSocket3Position()');
    const msgs = [];
    Object.assign(A.ctx, { Socket3: { readyState: 1, send(t) { msgs.push(JSON.parse(t).msg); } }, unescape: (s) => s, encodeURIComponent: (s) => s });
    const app = vm.runInContext('({' + [s3, need(method('getMass()'), 'getMass()')].join(',\n') + ', sendChatInvisibleData() { } })', A.ctx);
    A.ctx.application = Object.assign(A.app, { lastSentNick: 'me', getMass: app.getMass });
    const sent = () => { app.sendSocket3Position(); const m = msgs[msgs.length - 1]; return [m.x - A.LM.mapOffsetX, m.y - A.LM.mapOffsetY, m.mass].map(v => Math.round(v * 10) / 10); };
    Object.assign(A.LM, { playerX: 10, playerY: 20, playerCells: [{}], viewXTrue: 1234.7, viewYTrue: -2345.2 });
    A.ctx.spects = [{ number: 3, player: true, playerCellIDs: [3], playerX: -4000.4, playerY: 3999.6, playerMass: 555 }];
    let p = sent();
    check('Socket3 pos: main player: its own cells and mass, not the camera', p.join() === '1234.7,-2345.2,1234', p);
    A.ctx.multiboxPlayerEnabled = 3;
    p = sent();
    check('Socket3 pos: a unit controlled: that unit and its mass', p.join() === '-4000.4,3999.6,555', p);
    A.ctx.multiboxPlayerEnabled = null; A.LM.playerCells = [];
    p = sent();
    check('Socket3 pos: no own cells: the camera and the main player\'s mass, as before', p.join() === '10,20,1234', p);
});

/* ---------- 7. LMEvents.api.getPosition: the same position (map offset added as before) ---------- */
safe('LMEvents getPosition', () => {
    const evSrc = need(src.slice(src.indexOf('/* LMEvents: hooks for user scripts'), src.indexOf('window.spects = window.spects || [];')), 'LMEvents');
    const ctx = { console, Object, Math, Number, String, Array, Date, WeakSet };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(evSrc + '\n' + myPosSrc, ctx);
    ctx.legendmod = { mapOffsetX: 7000, mapOffsetY: -7000, play: true, playerX: 0, playerY: 0, playerCells: [{}], viewXTrue: 100.4, viewYTrue: 200.6 };
    ctx.spects = [{ number: 5, player: true, playerCellIDs: [1], playerX: -300, playerY: 400 }];
    const g = () => { const q = ctx.LMEvents.api.getPosition(); return q.x + ',' + q.y; };
    /* getMass: the mass of the same player (the unit you control while it lives, else the main one) */
    ctx.legendmod.playerMass = 1500.4; ctx.spects[0].playerMass = 820.6;
    const m = () => ctx.LMEvents.api.getMass();
    check('getPosition: the main player\'s own cells, not the camera', g() === '7100,-6799', g());
    check('getMass: the main player\'s mass', m() === 1500, m());
    ctx.multiboxPlayerEnabled = 5;
    check('getPosition: the multibox unit you control', g() === '6700,-6600', g());
    check('getMass: the mass of the multibox unit you control (as getPosition)', m() === 821, m());
    ctx.legendmod.play = false; ctx.legendmod.playerMass = 0;
    check('getMass: the main player dead, the unit you control alive: its mass', m() === 821, m());
    ctx.spects[0].playerCellIDs = []; ctx.legendmod.play = true; ctx.legendmod.playerMass = 1500;
    check('getMass: the unit you control dead: the main player\'s mass', m() === 1500, m());
    ctx.spects[0].playerCellIDs = [1];
    ctx.multiboxPlayerEnabled = null; ctx.legendmod.play = false; ctx.legendmod.playerX = 50;
    check('getPosition: not playing: the camera, as before', g() === '7050,-7000', g());
});

console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
