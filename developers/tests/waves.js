/* Team waves (relay opcode 45) between Legend Mod and Delta, with real code cut out of
 * ogario/ogario.v4.js: the relay dispatch (readMessage), readWavePing / sendWavePing /
 * sendTeamWave / sendTeamPing and their helpers, LM.sendWaves, LM.setMapOffset (the map offset
 * of each server type) and drawRender.drawWaves, plus lmDebugReport.
 * Delta's side is the 14-byte packet of DeltaClient/js/Communications/deltaProtocol.ts
 * (create.commander: u8 45, u16 userID = RootSocket.connectionID, u16 playerID = the tab's
 * ID, u8 type, i32 x, i32 y, little endian) in Delta's stage coordinates (connection.ts
 * setMapOffset / receiveX: the map centred on its border; agar.io also scaled to 14142).
 * Checked both directions: the same physical point on agar.io, a private server with an
 * asymmetric border and Expanding Land (also when its border grows between sending and
 * drawing), negative coordinates, separate user / player IDs, the same low 16 bits of
 * another identity, our own echo (also after a relay reconnect gave us a new ID), a wave
 * delivered twice, two Delta tabs, unknown sender colours, malformed packets, a bounded
 * queue, no wave before the new server's border, and no wave queued in a reconnecting relay.
 * node developers/tests/waves.js [ogario.v4.js] */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const safe = (name, fn) => { try { fn(); } catch (e) { check(name, false, 'threw ' + (e && e.message)); } };

/* a method from its header to the matching closing brace; null when the source has none */
function method(header, from) {
    const i = src.indexOf('\n        ' + header, from || 0);
    if (i < 0) return null;
    let d = 0, k = src.indexOf('{', i);
    for (; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && --d === 0) return src.slice(i + 1, k + 1);
    }
    return null;
}
const APP = ['lmWaveStats()', 'lmWaveOffsetX()', 'lmWaveOffsetY()', 'lmWaveSeen(', 'lmWaveSenderIndex(', 'readWavePing(view)',
    'lmPingLabel(type)', 'addLmPing(', 'lmMarkerPoint()', 'sendTeamPing(type)', 'sendTeamWave()', 'lmWaveRoute()', 'sendWavePing(', 'checkPlayerID(id)',
    'isSocketOpen()', 'readMessage(message)', 'lmTeamScale('];
const appSrc = APP.map(h => method(h)).filter(Boolean);
const LMSRC = ['sendWaves(', 'setMapOffset(', '_lmBorderValid(', '_lmApplyFullBorder(', '_lmFullBorderNow()'].map(h => method(h));
const drawSrc = method('drawWaves()');
const reportSrc = (() => { const i = src.indexOf('function lmDebugReport() {'); if (i < 0) return null; let d = 0, k = src.indexOf('{', i); for (; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}' && --d === 0) return src.slice(i, k + 1); } return null; })();
if (LMSRC.some(s => !s) || !drawSrc || !reportSrc) { console.log('FAIL source markers not found'); process.exit(1); }

/* ---------- Delta's side (deltaProtocol.ts create.commander, connection.ts setMapOffset) ---------- */
function deltaCommander(userID, playerID, type, x, y) {
    const v = new DataView(new ArrayBuffer(14));
    v.setUint8(0, 45); v.setUint16(1, userID, true); v.setUint16(3, playerID, true); v.setUint8(5, type);
    v.setInt32(6, x, true); v.setInt32(10, y, true);
    return v;
}
function deltaParse(v) {
    return { userID: v.getUint16(1, true), playerID: v.getUint16(3, true), type: v.getUint8(5), x: v.getInt32(6, true), y: v.getInt32(10, true) };
}
/* Delta's stage coordinates of a server point: shrink (agar.io only), then shift so the border is centred */
function deltaStage(border, isAgar) {
    let { left, top, right, bottom } = border;
    let sx = 1, sy = 1;
    if (isAgar) { sx = 14142 / (right - left); sy = 14142 / (bottom - top); left *= sx; right *= sx; top *= sy; bottom *= sy; }
    const shiftX = -(-(right - left) * 0.5 - left), shiftY = -(-(bottom - top) * 0.5 - top);
    return { x: (x) => x * sx - shiftX, y: (y) => y * sy - shiftY, rx: (x) => (x + shiftX) / sx, ry: (y) => (y + shiftY) / sy };
}

/* ---------- a Legend Mod page ---------- */
function page(opts) {
    opts = opts || {};
    let clock = 1000000;
    const ctx = {
        console: { log() { }, warn() { }, debug() { }, error() { } },
        Date: { now: () => clock }, Math, Number, Array, Object, String, DataView, ArrayBuffer, Uint8Array, RangeError, JSON,
        defaultSettings: { splitRangeColor: '#00e6ff', darkTheme: false },
        defaultmapsettings: {},
        lmT: (k) => k,
        $: () => ({ val: () => '', includes: () => false }),
        setTimeout: () => 0,
        toastr: { info() { }, error() { } },
        ogarcopythelb: { color: '#123456' }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    const LM = vm.runInContext('({' + LMSRC.join(',\n') + ', addSpect() { } })', ctx);
    Object.assign(LM, {
        Waves: [], _lmPings: [], mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, mapOffsetFixed: false,
        connectionIntegrity: false, serverType: '', isLegendWorld: false, cursorX: 0, cursorY: 0
    });
    ctx.LM = ctx.ogario = ctx.legendmod = LM;
    const app = vm.runInContext('({' + appSrc.join(',\n') + '})', ctx);
    Object.assign(app, { playerID: opts.playerID || 0, teamPlayers: [], socket: null, privateMode: false });
    ctx.application = app;
    /* the relay wrapper of LMexpress/standby-server.js: always "open", one inner socket */
    const relay = { isFake: true, readyState: 1, sockets: [{ readyState: 1 }], sent: [], send(b) { this.sent.push(new DataView(b)); } };
    if (opts.relay !== false) { ctx.ogarioWS = relay; app.socket = relay; }
    const dr = vm.runInContext('({' + drawSrc + '})', ctx);
    const arcs = [], stops = [];
    dr.ctx = {
        globalAlpha: 1, strokeStyle: '', lineWidth: 1,
        createRadialGradient: (x0, y0, r0, x1, y1, r1) => ({ addColorStop: (o, c) => stops.push(c) }),
        beginPath() { }, closePath() { }, stroke() { }, arc: (x, y, r) => arcs.push({ x, y, r })
    };
    dr.pi2 = 2 * Math.PI;
    dr._elMapScratch = { x: 0, y: 0 };
    dr.deformWorldPoint = (x, y, out) => { out.x = x; out.y = y; return out; };
    ctx.drawRender = dr;
    const report = vm.runInContext('(' + reportSrc + ')', Object.assign(ctx, { location: { hostname: 'x' }, navigator: { userAgent: 'UA' }, innerWidth: 1, innerHeight: 1, document: { querySelector: () => null } }));
    return {
        ctx, LM, app, relay, dr, arcs, stops, report,
        tick(ms) { clock += ms; },
        border(l, t, r, b, kind) {
            LM.isLegendWorld = kind === 'el'; LM.connectionIntegrity = kind === 'agar'; LM.serverType = kind === 'agar' ? 'agario' : '';
            if (kind === 'el') LM.mapOffset = 0;
            LM.setMapOffset(l, t, r, b);
        },
        recv(v) { app.readMessage(v); },
        teamWaves() { return LM.Waves.filter(w => w.sender !== 'wave:self'); }
    };
}
const near = (a, b) => Math.abs(a - b) < 1.0001;

/* ---------- 1. Legend Mod -> Delta: the packet and where Delta draws it ---------- */
safe('LM send', () => {
    const p = page({ playerID: 17 });
    p.border(-6071, -7771, 8071, 6371, 'agar'); /* right 8071: mapOffsetX = 7071 - 8071 = -1000 */
    p.LM.cursorX = 1200; p.LM.cursorY = -2300;
    p.app.sendTeamWave();
    const pkt = p.relay.sent[0];
    check('hk-wave sends one 14-byte opcode 45 packet', pkt && pkt.byteLength === 14 && pkt.getUint8(0) === 45, pkt && pkt.byteLength);
    const d = pkt && deltaParse(pkt);
    check('both ID fields carry our ID, type 4', d && d.userID === 17 && d.playerID === 17 && d.type === 4, JSON.stringify(d));
    const stage = deltaStage({ left: -6071, top: -7771, right: 8071, bottom: 6371 }, true);
    check('agar.io: Delta draws it at the same point (its stage coordinates)', d && near(d.x, stage.x(1200)) && near(d.y, stage.y(-2300)), d && [d.x, d.y, stage.x(1200), stage.y(-2300)].join());
    check('drawn locally once at the cursor', p.LM.Waves.length === 1 && p.LM.Waves[0].x === 1200 && p.LM.Waves[0].y === -2300);
});

/* ---------- 2. Delta -> Legend Mod: the same physical point, every server type ---------- */
const SERVERS = [
    ['agar.io', { left: -6071, top: -7771, right: 8071, bottom: 6371 }, 'agar'],
    ['private server, asymmetric border', { left: -3000, top: -8000, right: 9000, bottom: 2000 }, 'private'],
    ['Expanding Land', { left: -7071, top: -7071, right: 7071, bottom: 7071 }, 'el']
];
for (const [name, b, kind] of SERVERS) safe(name, () => {
    const stage = deltaStage(b, kind === 'agar');
    /* Delta -> LM: Delta waves at server point P */
    const P = { x: 1234, y: -4321 };
    const p = page({ playerID: 500 });
    p.border(b.left, b.top, b.right, b.bottom, kind);
    p.recv(deltaCommander(99, 42, 4, Math.round(stage.x(P.x)), Math.round(stage.y(P.y))));
    const w = p.teamWaves()[0];
    check(name + ': a Delta wave is drawn at the point Delta clicked', w && near(w.x, P.x) && near(w.y, P.y), w ? w.x + ',' + w.y : 'no wave');
    /* LM -> Delta at the same point */
    p.LM.cursorX = P.x; p.LM.cursorY = P.y;
    p.app.sendTeamWave();
    const d = p.relay.sent[0] && deltaParse(p.relay.sent[0]);
    check(name + ': Delta draws our wave at the point we clicked', d && near(stage.rx(d.x), P.x) && near(stage.ry(d.y), P.y), d ? d.x + ',' + d.y : 'not sent');
    /* LM -> LM: our packet read by another Legend Mod */
    const q = page({ playerID: 600 });
    q.border(b.left, b.top, b.right, b.bottom, kind);
    if (p.relay.sent[0]) q.recv(p.relay.sent[0]);
    const w2 = q.teamWaves()[0];
    check(name + ': another Legend Mod draws it at the same point', w2 && near(w2.x, P.x) && near(w2.y, P.y), w2 ? w2.x + ',' + w2.y : 'no wave');
});
safe('EL growing border', () => {
    /* Expanding Land grows its border (tier change) between sending and drawing */
    const a = page({ playerID: 21 }), b = page({ playerID: 22 });
    a.border(-7071, -7071, 7071, 7071, 'el');
    a.LM.cursorX = 3000; a.LM.cursorY = -2500;
    a.app.sendTeamWave();
    b.border(-10000, -10000, 10000, 10000, 'el');
    b.recv(a.relay.sent[0]);
    const w = b.teamWaves()[0];
    check('Expanding Land: the wave stays on its point when the map grows before it is drawn', w && near(w.x, 3000) && near(w.y, -2500), w ? w.x + ',' + w.y : 'no wave');
});

/* ---------- 3. identities ---------- */
safe('identities', () => {
    const p = page({ playerID: 17 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    p.recv(deltaCommander(99, 17, 4, 1200, -2300));
    check('a Delta wave whose playerID equals our ID (other userID) is drawn', p.teamWaves().length === 1);
    const q = page({ playerID: 0x10011 });
    q.border(-7071, -7071, 7071, 7071, 'private');
    q.app.teamPlayers.push({ id: 0x20011, color: '#ff00aa' });
    q.recv(deltaCommander(0x0011, 0x0011, 4, 10, -20));
    const w = q.teamWaves()[0];
    check('a teammate with the same low 16 bits but another 32-bit ID is drawn', !!w, q.teamWaves().length);
    check('... in that teammate\'s colour', w && w.color === '#ff00aa', w && w.color);
    /* Delta multibox: two tabs of one connection */
    const m = page({ playerID: 300 });
    m.border(-7071, -7071, 7071, 7071, 'private');
    m.app.teamPlayers.push({ id: 41, color: '#11aa11' }, { id: 42, color: '#aa1111' });
    m.recv(deltaCommander(7, 41, 4, 100, 100));
    m.recv(deltaCommander(7, 42, 4, 100, 100));
    const tw = m.teamWaves();
    check('two Delta tabs of one connection: both waves, each in its colour', tw.length === 2 && tw[0].color === '#11aa11' && tw[1].color === '#aa1111', tw.map(x => x.color).join());
    /* unknown sender and invalid colours */
    const u = page({ playerID: 300 });
    u.border(-7071, -7071, 7071, 7071, 'private');
    u.app.teamPlayers.push({ id: 50, color: 'red' });
    u.recv(deltaCommander(9, 4444, 4, 5, 5));
    u.recv(deltaCommander(9, 50, 4, 6, 6));
    const uw = u.teamWaves();
    check('unknown sender: drawn in the fallback colour', uw[0] && uw[0].color === '#00e6ff', uw[0] && uw[0].color);
    check('teammate colour that is not #rrggbb: fallback colour', uw[1] && uw[1].color === '#00e6ff', uw[1] && uw[1].color);
});

/* ---------- 4. echo, duplicates, reconnect ---------- */
safe('echo', () => {
    const p = page({ playerID: 17 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    p.LM.cursorX = -800; p.LM.cursorY = 900;
    p.app.sendTeamWave();
    p.tick(80);
    p.recv(p.relay.sent[0]);
    check('our own echo is not drawn a second time', p.LM.Waves.length === 1, p.LM.Waves.length);
    /* the old ogario layout: u32 ID at offset 1 */
    const q = page({ playerID: 0x30005 });
    q.border(-7071, -7071, 7071, 7071, 'private');
    q.LM.cursorX = 10; q.LM.cursorY = 10;
    q.app.sendTeamWave();
    const e = new DataView(q.relay.sent[0].buffer.slice(0));
    e.setUint32(1, 0x30005, true);
    q.recv(e);
    check('our echo with the 32-bit ID of the old layout is not drawn', q.LM.Waves.length === 1, q.LM.Waves.length);
    /* relay reconnect: a new ID, then the echo of a wave sent with the old one */
    const r = page({ playerID: 17 });
    r.border(-7071, -7071, 7071, 7071, 'private');
    r.LM.cursorX = 70; r.LM.cursorY = -70;
    r.app.sendTeamWave();
    const idPkt = new DataView(new ArrayBuffer(5)); idPkt.setUint8(0, 0); idPkt.setUint32(1, 23, true);
    r.recv(idPkt);
    check('opcode 0 gives the new ID', r.app.playerID === 23);
    r.recv(r.relay.sent[0]);
    check('echo of a wave sent before the reconnect is not drawn', r.LM.Waves.length === 1, r.LM.Waves.length);
    /* a later wave of another player at our old ID is drawn */
    r.tick(6000);
    r.recv(deltaCommander(17, 17, 4, 70, -70));
    check('an old echo after 5 s no longer hides a real wave', r.teamWaves().length === 1, r.teamWaves().length);
    /* delivered twice (two relay sockets) */
    const d = page({ playerID: 300 });
    d.border(-7071, -7071, 7071, 7071, 'private');
    const pk = deltaCommander(99, 42, 4, 1, 2);
    d.recv(pk); d.tick(30); d.recv(pk);
    check('one wave delivered twice is drawn once', d.teamWaves().length === 1, d.teamWaves().length);
    d.recv(deltaCommander(99, 43, 4, 1, 2));
    check('another sender at the same point is drawn', d.teamWaves().length === 2, d.teamWaves().length);
    d.tick(1500); d.recv(pk);
    check('the same sender waving there again later is drawn', d.teamWaves().length === 3, d.teamWaves().length);
});

/* ---------- 5. malformed, bounded, server switch ---------- */
safe('robustness', () => {
    const p = page({ playerID: 300 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    let threw = false;
    try {
        for (const n of [1, 2, 5, 13]) { const v = new DataView(new ArrayBuffer(n)); v.setUint8(0, 45); p.recv(v); }
    } catch (e) { threw = e.message; }
    check('short opcode 45 packets: no exception, no wave', !threw && p.LM.Waves.length === 0, threw || p.LM.Waves.length);
    const neg = deltaCommander(1, 2, 4, -2147483648, 2147483647);
    p.recv(neg);
    check('extreme coordinates: a finite wave', p.LM.Waves.length === 1 && Number.isFinite(p.LM.Waves[0].x) && Number.isFinite(p.LM.Waves[0].y));
    for (let i = 0; i < 100; i++) p.recv(deltaCommander(1, 100 + i, 4, i * 10, -i * 10));
    check('100 waves: the queue stays bounded', p.LM.Waves.length <= 31, p.LM.Waves.length);
    /* a server switch: flushCellsData empties the waves and clears mapOffsetFixed until the new border */
    const s = page({ playerID: 300 });
    s.border(-7071, -7071, 7071, 7071, 'private');
    s.LM.Waves.length = 0; s.LM.mapOffsetFixed = false;
    s.recv(deltaCommander(9, 9, 4, 50, 50));
    check('no wave before the new server\'s border (one from the room we left)', s.LM.Waves.length === 0, s.LM.Waves.length);
    s.border(-5000, -5000, 5000, 5000, 'private');
    s.recv(deltaCommander(9, 9, 4, 51, 51));
    check('waves again once the border is known', s.LM.Waves.length === 1, s.LM.Waves.length);
    /* typed ping from Delta's layout: label and minimap marker at the converted point */
    const t = page({ playerID: 300 });
    t.border(-3000, -8000, 9000, 2000, 'private');
    t.recv(deltaCommander(9, 9, 6, -1766, 2433));
    const pg = t.LM._lmPings[0];
    check('typed ping 6: label at the same point as its wave', pg && pg.type === 6 && near(pg.x, 1234) && near(pg.y, -567) && t.LM.Waves.length === 1, pg && pg.x + ',' + pg.y);
});

/* ---------- 6. sending only on an open relay ---------- */
safe('route', () => {
    const p = page({ playerID: 17 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    p.LM.cursorX = 1; p.LM.cursorY = 1;
    p.relay.sockets[0].readyState = 0; /* the wrapper reconnects its socket */
    p.app.sendTeamWave();
    check('relay socket reconnecting: nothing queued to arrive late', p.relay.sent.length === 0, p.relay.sent.length);
    check('... still drawn here', p.LM.Waves.length === 1);
    p.relay.sockets[0].readyState = 1; p.tick(400);
    p.app.sendTeamWave();
    check('relay open again: sent', p.relay.sent.length === 1, p.relay.sent.length);
    const q = page({ playerID: 17 });
    q.border(-7071, -7071, 7071, 7071, 'private');
    q.ctx.LMPractice = { on: true };
    q.app.sendTeamWave();
    check('practice arena: not sent to teammates', q.relay.sent.length === 0, q.relay.sent.length);
    /* private mode: the relay down, the private socket open (not the relay that gave our ID) */
    const r = page({ playerID: 17 });
    r.border(-7071, -7071, 7071, 7071, 'private');
    r.relay.sockets[0].readyState = 3;
    const own = { readyState: 1, OPEN: 1, sent: [], send(b) { this.sent.push(b); } };
    r.app.socket = own; r.app.privateMode = true;
    r.app.sendTeamWave();
    check('private mode, relay down: not sent to the private socket', own.sent.length === 0 && r.relay.sent.length === 0);
    r.app.privateMode = false; r.tick(400);
    r.app.sendTeamWave();
    check('public mode, wrapper down: our own open socket is used', own.sent.length === 1, own.sent.length);
});

/* ---------- 7. drawn (drawWaves) and counted ---------- */
safe('draw', () => {
    const p = page({ playerID: 300 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    p.app.teamPlayers.push({ id: 42, color: '#ff00ff' });
    p.recv(deltaCommander(99, 42, 4, 640, -480));
    p.tick(200);
    p.dr.drawWaves();
    const a = p.arcs.filter(c => c.x === 640 && c.y === -480);
    check('drawWaves strokes the received wave at its point', a.length >= 1, JSON.stringify(p.arcs.slice(0, 2)));
    check('... in the sender\'s colour', p.stops.indexOf('#ff00ff') >= 0, p.stops.join());
    p.tick(2500);
    p.dr.drawWaves();
    check('expired after its time, removed from the queue', p.LM.Waves.length === 0, p.LM.Waves.length);
    const st = p.app._lmWaveStats || {};
    check('counters: received 1, shown 1, drawn 1, expired 1', st.received === 1 && st.shown === 1 && st.rendered === 1 && st.expired === 1, JSON.stringify(st));
    const text = p.report();
    const line = text.split('\n').filter(l => l.indexOf('Team waves:') === 0)[0];
    check('Copy debug info has the team wave line', !!line, text.slice(0, 300));
    check('... without IDs or positions', line && !/\b(42|99|640|480)\b/.test(line), line);
});

/* ---------- 8. a cursor off the screen (the phone joystick's far synthetic mouse) ---------- */
safe('off-screen aim', () => {
    const p = page({ playerID: 5 });
    p.border(-7071, -7071, 7071, 7071, 'private');
    /* a 915x412 screen at view scale 0.5 around (1000, 500): it shows x -830..2830, y 88..912 */
    Object.assign(p.LM, { canvasWidth: 915, canvasHeight: 412, viewScale: 0.5 });
    p.dr.camX = 1000; p.dr.camY = 500;
    p.LM.cursorX = 1000 + 18000; p.LM.cursorY = 500 + 300;
    p.app.sendTeamPing(7);
    const pg = p.LM._lmPings[0];
    check('ping aimed 18,000 units away is marked on the screen', pg && Math.abs(pg.x - 1000) <= 915 && Math.abs(pg.y - 500) <= 412, pg && [pg.x, pg.y].join());
    check('... in the aimed direction', pg && pg.x > 1000 + 600 && Math.abs((pg.y - 500) / (pg.x - 1000) - 300 / 18000) < 1e-6, pg && [pg.x, pg.y].join());
    check('... the drawn wave too', p.LM.Waves.length === 1 && Math.abs(p.LM.Waves[0].x - pg.x) < 1e-6);
    p.tick(400);
    p.LM.cursorX = 1000 - 40000; p.LM.cursorY = 500 - 40000;
    p.app.sendTeamWave();
    const w = p.LM.Waves[1];
    check('wave aimed off the screen is drawn on the screen', w && Math.abs(w.x - 1000) <= 915 && Math.abs(w.y - 500) <= 412, w && [w.x, w.y].join());
    p.tick(600);
    p.LM.cursorX = 1500; p.LM.cursorY = 300;
    p.app.sendTeamPing(5);
    const pg2 = p.LM._lmPings[1];
    check('a cursor on the screen is marked where it is', pg2 && pg2.x === 1500 && pg2.y === 300, pg2 && [pg2.x, pg2.y].join());
});

console.log(failed ? failed + ' check(s) failed' : 'all wave checks passed');
process.exit(failed ? 1 : 0);
