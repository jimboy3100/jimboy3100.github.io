/* Map border (opcode 64) as the server sends it, in Node with the real code cut out of
 * ogario/ogario.v4.js: the packet handler (handleMessage, _lmHandlePacket with opcode 64, the
 * LW beacon 240 and the map event 200), handleSubmessage (compressed 64), handleMapEvent, the
 * border snapshot methods (_lmOnServerBorder, _lmServerBorderNow, _lmReapplyServerBorder, the
 * trace), setMapOffset, calMinMax (the food box of "show viewports"), the tab-return restore of
 * the visibilitychange handler, the border resets of connect() and onClose(), drawMapBorders
 * (the Canvas border) and _lmElTeamsActive.
 * Cases: the 3.614-3.627 shrink (border, food box, tab return, valid packet), expansion and
 * shrink over every tier with tab returns during the transitions, a late beacon, a beacon before
 * any border, reconnect and server switch (no border from the previous socket), no food, FFA and
 * Teams, ordinary and full-world spectate camera, NaN / Infinity / reversed / empty borders,
 * a cut-short compressed border, EL with an integrity socket or a replay token, the Canvas
 * border and the world-spectate clamp agreeing with the server's centre and radius, the trace.
 * node developers/tests/mapborder.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function block(start, from) {
    const i = src.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
function between(a, b, from) {
    const i = src.indexOf(a, from || 0);
    const j = i < 0 ? -1 : src.indexOf(b, i + a.length);
    return i < 0 || j < 0 ? null : src.slice(i, j + b.length);
}
const methods = ['        _lmBorderValid(', '        _lmOnServerBorder(', '        _lmServerBorderNow()', '        _lmReapplyServerBorder(',
    '        _lmBorderTraceAdd(', '        borderTrace()', '        setMapOffset(left', '        handleMapEvent(eventType',
    '        handleSubmessage(message) {', '        calMinMax() {', '        drawMapBorders(ctx, macros', '        _lmApplyFullBorder(', '        _lmFullBorderNow()',
    '        translateX(x) {', '        translateY(x) {'].map((m) => [m, block(m)]);
const sectorFn = block('        calculateMapSector(t, xgh2');
if (!sectorFn) { console.log('FAIL code not found: calculateMapSector'); process.exit(1); }
const pktStart = src.indexOf('        handleMessage(data) {\n'), pktEnd = src.indexOf('        countPps() {', pktStart);
const teams = block('function _lmElTeamsActive(');
const resume = between("LM._lmBorderTraceAdd('visible', hiddenMs);", "LM._lmReapplyServerBorder('resume', false);");
const connectReset = between('            this._connectSeq = (this._connectSeq || 0) + 1;', 'LM.isLegendWorld = false;');
const closeReset = between("            /* the closed socket's border must not outlive it", 'LM.isLegendWorld = false;');
const missing = methods.filter((m) => !m[1]).map((m) => m[0].trim());
if (pktStart < 0 || pktEnd < 0) missing.push('handleMessage');
if (!teams) missing.push('_lmElTeamsActive');
if (!resume) missing.push('tab-return restore');
if (!connectReset) missing.push('connect reset');
if (!closeReset) missing.push('onClose reset');
if (missing.length) { console.log('FAIL code not found: ' + missing.join(', ')); process.exit(1); }

const TIERS = [7071, 10000, 14142, 20000, 28284, 40000, 56569, 80000, 113137, 160000, 226274, 320000, 452548];
/* the server's circular border: diameter = 2 * size / sqrt(pi) */
const diam = (tier) => 2 * TIERS[tier] / Math.sqrt(Math.PI);

function boot(opts) {
    opts = opts || {};
    const warns = [], sent = [];
    const ctx = {
        console: { log() { }, info() { }, warn: (...a) => warns.push(a.join(' ')), error: (...a) => warns.push('ERROR ' + a.join(' ')) },
        Math, Date, Number, Object, Array, String, JSON, isFinite, DataView, ArrayBuffer, Uint8Array, RangeError, TextDecoder, setTimeout() { },
        defaultmapsettings: { recordReplays: false }, defaultSettings: { foodSize: 5, bordersWidth: 20, bordersColor: '#ff0000' },
        $: () => ({ val: () => ctx.token || '' }), token: opts.token || '',
        toastr: { info() { }, warning() { }, error() { } }, _lmTH: (k, en) => en, consoleMsgLM: '',
        application: { sendElClanTag() { } }, master: { login() { } },
        userBots: {}, devicePixelRatio: 2,
        LMEvents: { _has: () => false, emit() { } },
        drawRender: { scale: 0.5, canvasWidth: 915, canvasHeight: 412, onLegendWorldConnected() { }, onLegendWorldMapEvent() { } }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(teams, ctx);
    const h = vm.runInContext('({' + methods.map((m) => m[1]).join(',\n') + ',\n' + src.slice(pktStart, pktEnd).replace(/,\s*$/, '') + '})', ctx);
    Object.assign(h, {
        _connectSeq: 0, mapEvent: {}, mapTier: -1, mapSize: 0, mapOffset: 0, isLegendWorld: false, serverType: 'private',
        connectionIntegrity: !!opts.integrity, socket: { id: 1 }, viewX: 0, viewY: 0, food: [], viewXTrue: 0, viewYTrue: 0,
        scale: 1, addSpect() { }, countPps() { }, flushCellsData() { }, closeConnection() { },
        createView: (n) => new DataView(new ArrayBuffer(n)), sendMessage: (v) => sent.push(v),
        decompressMessage: (m) => m
    });
    ctx.LM = ctx.legendmod = ctx.ogario = h;
    ctx.legendmod = h;
    const connect = vm.runInContext('(function () {\n' + connectReset + '\n})', ctx);
    const close = vm.runInContext('(function () {\n' + closeReset + '\n})', ctx);
    const restore = vm.runInContext('(function (hiddenMs) {\n' + resume + '\n})', ctx);
    return {
        h, ctx, warns, sent,
        connect() { h.socket = { id: h._connectSeq + 2 }; connect.call(h); },
        close() { close.call(h); },
        resume(ms) { restore(ms || 3000); }
    };
}
function border(minX, minY, maxX, maxY, gameType) {
    const n = gameType === undefined ? 33 : 38;
    const v = new DataView(new ArrayBuffer(n));
    v.setUint8(0, 64);
    [minX, minY, maxX, maxY].forEach((x, i) => v.setFloat64(1 + i * 8, x, true));
    if (gameType !== undefined) v.setUint32(33, gameType >>> 0, true);
    return v;
}
const circle = (d, cx, cy) => border((cx || 0) - d / 2, (cy || 0) - d / 2, (cx || 0) + d / 2, (cy || 0) + d / 2);
const beacon = () => new DataView(new Uint8Array([240, 0x4C, 0x57]).buffer);
function mapEvent(type, cur, target, transTicks, tier) {
    const v = new DataView(new ArrayBuffer(43));
    v.setUint8(0, 200); v.setUint8(1, type);
    [cur, target, 0, 0].forEach((x, i) => v.setFloat64(2 + i * 8, x, true));
    v.setUint32(34, transTicks || 0, true); v.setUint32(38, 0, true); v.setUint8(42, tier);
    return v;
}
/* a compressed (255) packet; decompressMessage is the identity here, so this is the decoded body */
function compressed(minX, minY, maxX, maxY, len) {
    const b = Buffer.alloc(33);
    b[0] = 64;
    [minX, minY, maxX, maxY].forEach((x, i) => b.writeDoubleLE(x, 1 + i * 8));
    return len ? b.subarray(0, len) : b;
}
const box = (h) => [h.mapMinX, h.mapMinY, h.mapMaxX, h.mapMaxY].map((v) => Math.round(v)).join(',');
const want = (d, cx, cy) => [(cx || 0) - d / 2, (cy || 0) - d / 2, (cx || 0) + d / 2, (cy || 0) + d / 2].map((v) => Math.round(v)).join(',');
/* an Expanding Land join: connect, the handshake border (with game type), the beacon */
function elJoin(t, d, gameType) {
    t.connect();
    t.h.handleMessage(border(-d / 2, -d / 2, d / 2, d / 2, gameType === undefined ? 0 : gameType));
    t.h.handleMessage(beacon());
}
const foodBox = (h, half) => { h.food = []; for (let x = -half; x <= half; x += half / 4) for (let y = -half; y <= half; y += half / 4) h.food.push({ x, y }); };

/* 1. the reported shrink: border, food box, tab return, then a valid packet */
{
    const t = boot(), h = t.h;
    elJoin(t, 40000);
    check('EL join: map 40000 centred, mapOffset 0', h.isLegendWorld && h.mapSize === 40000 && h.mapOffset === 0 && box(h) === want(40000), box(h) + ' size ' + h.mapSize);
    foodBox(h, 8000);
    h.calMinMax();
    check('food box goes to srvViewMin/Max, not the border fields', Math.round(h.srvViewMaxX) === 8015 && h.viewMaxX === 20000, h.srvViewMaxX + ' ' + h.viewMaxX);
    /* even a writer that puts the food box into viewMin/Max (the 3.614 bug) cannot reach the map */
    h.viewMinX = h.srvViewMinX; h.viewMinY = h.srvViewMinY; h.viewMaxX = h.srvViewMaxX; h.viewMaxY = h.srvViewMaxY;
    t.resume();
    check('tab return keeps the server border (was 16000 from the food box)', h.mapSize === 40000 && box(h) === want(40000), box(h) + ' size ' + h.mapSize);
    h.mapMinX = -8000; h.mapMaxX = 8000; h.mapSize = 16000;
    t.resume();
    check('tab return repairs a map that no longer matches the last packet', h.mapSize === 40000 && box(h) === want(40000), box(h));
    h.handleMessage(circle(40000));
    check('the next valid packet: same map', h.mapSize === 40000 && box(h) === want(40000));
}

/* 2. expansion and shrink over every tier, tab returns during transitions, repeated */
{
    const t = boot(), h = t.h;
    elJoin(t, diam(0));
    let ok = true, info = '';
    const path = [];
    for (let i = 0; i < TIERS.length; i++) path.push(i);
    for (let i = TIERS.length - 2; i >= 0; i--) path.push(i);
    for (let i = 0; i <= 5; i++) path.push(i);
    for (let i = 4; i >= 2; i--) path.push(i);
    for (let k = 1; k < path.length; k++) {
        const a = path[k - 1], b = path[k];
        h.handleMessage(mapEvent(b > a ? 1 : 4, diam(a), diam(b), 50, a));
        /* the server sends the border every tick while it moves; a tab return halfway */
        for (let s = 1; s <= 4; s++) {
            const d = diam(a) + (diam(b) - diam(a)) * s / 4;
            h.handleMessage(circle(d));
            if (s === 2) {
                const before = box(h), cam = h.viewX + ',' + h.viewY;
                h.viewX = 123; h.viewY = -45;
                t.resume(5000);
                if (box(h) !== before || h.viewX !== 123) { ok = false; info = 'resume changed ' + before + ' -> ' + box(h) + ' cam ' + cam; }
            }
            if (box(h) !== want(d) || h.mapSize !== ~~d) { ok = false; info = 'tier ' + a + '->' + b + ' step ' + s + ': ' + box(h) + ' want ' + want(d); }
        }
        if (h.mapTier !== b) { ok = false; info = 'tier ' + h.mapTier + ' want ' + b; }
        h.handleMessage(mapEvent(5, diam(b), diam(b), 0, b));
    }
    check('expansion and shrink through tiers 0-12-0-5-2: map follows every packet, tier right', ok, info);
    check('no warnings', !t.warns.length, t.warns[0]);
}

/* 3. late beacon, beacon before any border, reconnect, server switch */
{
    const t = boot(), h = t.h;
    t.connect();
    h.handleMessage(circle(diam(5)));
    check('before the beacon: generic private map', !h.isLegendWorld && h.mapOffset === h.mapSize / 2);
    h.handleMessage(beacon());
    check('late beacon re-derives this socket\'s border as EL', h.isLegendWorld && h.mapOffset === 0 && h.mapSize === ~~diam(5) && h.mapTier === 5 && box(h) === want(diam(5)));

    /* switch to another server: the old border must not come back */
    t.connect();
    h.mapMinX = -7071; h.mapMinY = -7071; h.mapMaxX = 7071; h.mapMaxY = 7071; h.mapSize = 14142;
    check('connect drops the snapshot', h._lmServerBorderNow() === null);
    h.handleMessage(beacon());
    check('beacon before the new border keeps the old one away', box(h) === '-7071,-7071,7071,7071' && h.mapSize === 14142, box(h));
    t.resume();
    check('tab return without a border of this socket changes nothing', box(h) === '-7071,-7071,7071,7071');
    h.handleMessage(circle(diam(2)));
    check('then the new server\'s border', h.mapSize === ~~diam(2) && box(h) === want(diam(2)) && h.mapTier === 2);

    /* socket drops: onClose clears it, auto-reconnect starts with none */
    t.close();
    check('onClose drops the snapshot and EL', h._lmServerBorderNow() === null && !h.isLegendWorld);
    elJoin(t, diam(3));
    check('reconnect: the new border', h.mapSize === ~~diam(3) && box(h) === want(diam(3)));

    /* a snapshot from an older connect sequence is never used */
    h._connectSeq++;
    check('stale epoch is not used', h._lmServerBorderNow() === null && h._lmReapplyServerBorder('test', true) === false);
}

/* 4. ClearAll / respawn keep the border; no food */
{
    const t = boot(), h = t.h;
    elJoin(t, diam(6));
    h.food = [];
    h.calMinMax();
    /* ClearAll of a tab resync without preserveMapGeometry resets the map to +-7071 */
    h.mapMinX = -7071; h.mapMinY = -7071; h.mapMaxX = 7071; h.mapMaxY = 7071;
    check('ClearAll keeps the snapshot', !!h._lmServerBorderNow());
    t.resume();
    check('no food, after ClearAll: tab return restores the server border', box(h) === want(diam(6)) && h.mapSize === ~~diam(6));
}

/* 5. FFA and Teams through border packets, beacon and tab return */
{
    const t = boot(), h = t.h;
    elJoin(t, diam(4), 1);
    check('Teams handshake: teams mode', h.gameMode === ':teams');
    h.handleMessage(border(-diam(5) / 2, -diam(5) / 2, diam(5) / 2, diam(5) / 2, 0xFFFFFFFF));
    h.handleMessage(circle(diam(5)));
    t.resume();
    check('Teams survives play border, tier change and tab return', h.gameMode === ':teams' && h.mapSize === ~~diam(5));
    elJoin(t, diam(4), 0);
    check('FFA handshake on a new socket: not teams', h.gameMode === ':expandingland' && h.mapSize === ~~diam(4));
}

/* 6. invalid borders change nothing */
{
    const t = boot(), h = t.h;
    elJoin(t, diam(5));
    const snap = h._lmServerBorder, before = box(h) + ' ' + h.mapSize + ' ' + h.mapTier;
    const bad = [[NaN, 0, 100, 100], [0, 0, Infinity, 100], [-Infinity, -100, 100, 100], [100, 100, -100, -100], [0, 0, 0, 5000], [10, 10, 10.5, 9000]];
    bad.forEach((b) => h.handleMessage(border(b[0], b[1], b[2], b[3])));
    check('NaN / Infinity / reversed / empty borders: map, size, tier, snapshot unchanged', box(h) + ' ' + h.mapSize + ' ' + h.mapTier === before && h._lmServerBorder === snap && h.viewMaxX === diam(5) / 2, box(h));
    h.setMapOffset(NaN, 0, 1, 1);
    check('setMapOffset itself ignores an invalid border', box(h) + ' ' + h.mapSize + ' ' + h.mapTier === before);
    check('snapshot is frozen', Object.isFrozen(snap));
    h.handleSubmessage(compressed(-3000, -3000, 3000, 3000, 20));
    check('cut-short compressed border is dropped whole', box(h) + ' ' + h.mapSize === before.split(' ').slice(0, 2).join(' ') && h.viewMinX === -diam(5) / 2);
    h.handleSubmessage(compressed(-3000, -3000, 3000, 3000));
    check('compressed border goes through the same handler', h.mapSize === 6000 && box(h) === want(6000) && h._lmServerBorder.maxX === 3000);
    h.handleSubmessage(compressed(NaN, 0, 1, 1));
    check('compressed invalid border is dropped', h.mapSize === 6000);
    check('one warning per 5 s', t.warns.filter((w) => w.indexOf('invalid map border') >= 0).length === 1, t.warns.join(' | '));
}

/* 7. EL never uses the agar.io offset math (integrity socket, replay token) */
[['EL on an integrity socket', { integrity: true }], ['EL replay with a 7-character token', { token: 'replay^abcdefg(1).lm' }]].forEach(([name, o]) => {
    const t = boot(o), h = t.h;
    elJoin(t, 40000);
    h.connectionIntegrity = !!o.integrity; /* connect() clears it, _finishConnect sets it */
    h.handleMessage(circle(30000));
    check(name + ': not zero-size', h.mapMaxX - h.mapMinX === 30000 && box(h) === want(30000) && h.mapSize === 30000, box(h));
});
/* and the agar.io branch itself: a 14142 border as before */
{
    const t = boot(), h = t.h;
    t.connect();
    h.connectionIntegrity = true; /* set by _finishConnect for agar.io */
    h.handleMessage(border(1000, 2000, 15142, 16142));
    check('agar.io 14142 border: same map as before (edges, offset, size 14142)', h.mapSize === 14142 && h.mapOffset === 7071 && h.mapMinX === 1000 && h.mapMaxY === 16142 &&
        h.mapOffsetX === -8071 && h.mapOffsetY === -9071 && h.mapOffsetFixed);
    h.handleMessage(border(5000, 5000, 9000, 9000));
    check('agar.io: a later small opcode 64 is still ignored', h.mapMinX === 1000);
}
/* 7b. agar.io gives every connection its own scale: a live full border 14189.6 x 14102.1 (LM put the
 *     edges at 7071 - right: mapMinX -7277.0, 47.6 off the real -7324.6) */
{
    const B = [-7324.601462458406, -6192.663946706215, 6864.994673375264, 7909.431799099125];
    const t = boot(), h = t.h;
    t.connect();
    h.connectionIntegrity = true;
    h.handleMessage(border(B[0], B[1], B[2], B[3]));
    const cx = (B[0] + B[2]) / 2, cy = (B[1] + B[3]) / 2;
    check('live border: map edges are the real ones', h.mapMinX === B[0] && h.mapMinY === B[1] && h.mapMaxX === B[2] && h.mapMaxY === B[3] && h.mapOffsetFixed, box(h));
    check('live border: exact centre (mapMid, mapOffsetX = -centre) and spect.js scale', h.mapMidX === cx && h.mapMidY === cy && h.mapOffsetX === -cx && h.mapOffsetY === -cy &&
        h._lmBorderCX === cx && Math.abs(h._lmBorderKX * (B[2] - B[0]) - 14142.135623730952) < 1e-9 && Math.abs(h._lmBorderKY * (B[3] - B[1]) - 14142.135623730952) < 1e-9);
    /* sectors (application.calculateMapSector, raw coordinates as the minimap passes them) */
    const app = vm.runInContext('({' + sectorFn + '})', t.ctx);
    t.ctx.LM.mapOffsetFixed = true;
    const sec = (x, y) => app.calculateMapSector(x, y, true);
    check('live border: sectors A1 at the top left edge, C3 at the centre, E5 at the bottom right edge',
        sec(B[0] + 1, B[1] + 1) === 'A1' && sec(cx, cy) === 'C3' && sec(B[2] - 1, B[3] - 1) === 'E5', [sec(B[0] + 1, B[1] + 1), sec(cx, cy), sec(B[2] - 1, B[3] - 1)].join());
    /* minimap: px = (x + mapOffsetX + mapOffset) * width / mapSize: the edges at the minimap edges (within 0.2%) */
    const mm = (x, off) => (x + off + h.mapOffset) / h.mapSize;
    check('live border: minimap puts the edges at its edges and the centre in the middle',
        Math.abs(mm(B[0], h.mapOffsetX)) < 0.002 && Math.abs(mm(B[2], h.mapOffsetX) - 1) < 0.002 && Math.abs(mm(B[1], h.mapOffsetY)) < 0.002 &&
        Math.abs(mm(B[3], h.mapOffsetY) - 1) < 0.002 && mm(cx, h.mapOffsetX) === 0.5, [mm(B[0], h.mapOffsetX), mm(B[2], h.mapOffsetX)].join());
    /* Rotate Map mirrors about the real centre: an edge onto the other edge, twice = back */
    let drift = 0;
    for (const x of [B[0], cx, B[2], 1234.5, -6000.25]) drift = Math.max(drift, Math.abs(h.translateX(h.translateX(x)) - x));
    check('live border: Rotate Map mirrors edge onto edge, centre fixed, no drift', h.translateX(B[0]) === B[2] && h.translateY(B[3]) === B[1] && h.translateX(cx) === cx && drift < 1e-9);
    /* the view rects of a playing connection, and after a ClearAll (mapOffsetFixed off) too */
    h.handleMessage(border(-1716.85, 834.87, 2533.1, 3394.9));
    check('live border: a view rect (4250 x 2560) never becomes the map', h.mapMinX === B[0] && h.mapMaxY === B[3]);
    h.mapOffsetFixed = false;
    h.handleMessage(border(-1716.85, 834.87, 2533.1, 3394.9));
    check('live border: after a ClearAll a view rect keeps the full border', h.mapMinX === B[0] && h.mapMaxY === B[3] && h.mapOffsetX === -cx && h.mapOffsetFixed);
    t.connect();
    h.connectionIntegrity = true;
    h.handleMessage(border(-1716.85, 834.87, 2533.1, 3394.9));
    check('live border: a new socket does not reuse the previous one\'s full border', h.mapMinX !== B[0] && !h.mapOffsetFixed && h._lmFullBorderNow() === null);
}

/* 8. consumers: Canvas border, world-spectate camera clamp, deformation centre use the same circle */
{
    const t = boot(), h = t.h;
    elJoin(t, diam(7));
    h.handleMessage(circle(diam(7), 0, 0));
    const arcs = [];
    const ctx2d = { arc(x, y, r) { arcs.push([x, y, r]); }, beginPath() { }, stroke() { }, moveTo() { }, lineTo() { }, closePath() { } };
    const bw = 20 / 2;
    h.isLegendWorldMapDeformationVisible = () => false;
    h.drawMapBorders(ctx2d, h.mapOffsetFixed, h.mapMinX - bw, h.mapMinY - bw, h.mapMaxX + bw, h.mapMaxY + bw, '#f00', 20);
    const b = h._lmServerBorder, cx = (b.minX + b.maxX) / 2, r = (b.maxX - b.minX) / 2;
    check('Canvas border circle = server centre and radius', arcs.length === 1 && arcs[0][0] === cx && arcs[0][1] === (b.minY + b.maxY) / 2 && arcs[0][2] === r + bw, JSON.stringify(arcs));
    /* full-world spectate: the camera centre is the map midpoint; a tab return does not move it */
    h.viewX = 4000; h.viewY = -2000;
    t.resume();
    check('world spectate camera kept on tab return; map midpoint = server centre', h.viewX === 4000 && h.mapMidX === cx && h.mapMidY === (b.minY + b.maxY) / 2);
}

/* 9. the trace: epoch, raw bounds, map, food box, camera and DPR; no address */
{
    const t = boot(), h = t.h;
    elJoin(t, 40000);
    foodBox(h, 8000); h.calMinMax();
    t.resume(1234);
    h.handleMessage(border(NaN, 0, 1, 1));
    const lines = h.borderTrace();
    const last = lines.join('\n');
    check('trace lists connect, border, beacon, tab return and the rejected border', /connect epoch 1/.test(last) && / packet epoch 1 raw -20000,-20000,20000,20000/.test(last) &&
        /visible 1234ms epoch 1 EL .* map -20000,-20000,20000,20000 size 40000 offset 0 tier \d+ food -8015,-8015,8015,8015 cam 0,0,0.5 dpr 2 canvas 915,412/.test(last) && /reject-packet .*raw NaN,0,1,1/.test(last), last);
    check('trace has no server address', !/wss?:|token/i.test(last));
    for (let i = 0; i < 200; i++) h.handleMessage(circle(40000 + i));
    check('trace keeps the last 64', h.borderTrace().length === 64);
}

/* 10. a message still queued on the replaced socket does not reach the game (the real _finishConnect) */
{
    const fc = block('        _finishConnect(url, app) {');
    if (!fc) check('_finishConnect found', false);
    else {
        const noop = () => { };
        const g = { console: { log: noop, warn: noop, error: noop }, Math, Date, Number, Object, JSON, parseInt, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop };
        g.window = g;
        g.WebSocket = function (url) { this.url = url; this.readyState = 0; this.close = noop; };
        g.WebSocket.CONNECTING = 0; g.WebSocket.OPEN = 1;
        g.application = new Proxy({}, { get: () => noop });
        g.localStorage = { getItem: () => null, setItem: noop };
        g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: () => noop });
        vm.createContext(g);
        try {
            const obj = vm.runInContext('with (__env) { ({' + fc + '}) }', g);
            let got = 0;
            Object.assign(obj, { serverType: 'private', socket: null, ws: 'wss://b.example/', integrity: false, onMessage() { got++; }, onOpen: noop, onClose: noop, onError: noop });
            /* the other connection steps of the game object are no-ops here */
            const app = new Proxy(obj, { get: (t, k) => k in t ? t[k] : noop });
            app._finishConnect('wss://a.example/', app);
            const oldHandler = app.socket.onmessage;
            app._finishConnect('wss://b.example/', app);
            oldHandler({ data: new ArrayBuffer(33) });
            app.socket.onmessage({ data: new ArrayBuffer(33) });
            check('replaced socket: its queued message is dropped, the new socket\'s is read', got === 1, 'onMessage calls ' + got);
        } catch (e) { check('_finishConnect runs in the test', false, e.message); }
    }
}

console.log(failed ? failed + ' check(s) failed' : 'all map border checks passed');
process.exit(failed ? 1 : 0);
