/* Spectator / multibox coordinates (ogario/spect.js): the transform contract
 * world = s * k * (raw - C) + d, raw = C + s * (world - d) / k, for every connection
 * (C = exact centre of its full border, k = 14142.1356 / its width or height: agar.io scales
 * every connection per axis). The real spect.js runs in a vm with a small main client.
 * Cases: the 4 orientations with different offsets and scales land on the main client's
 * frame exactly, raw -> drawn -> raw is exact under every Rotate Map state, repeated
 * Rotate Map flips do not drift, live agar.io pellet pairs (a slice of a capture: 7
 * connections, their full borders and orientations) agree to median <= 1.5 / p95 <= 2.5
 * (centre and mirror without the scale: tens of units), the orientation is verified from top
 * players (live lists too; 2 snapshots, ambiguous ones ignored, no 10 s timeout) and the cells
 * placed provisionally are reprojected from their raw values, decode stores
 * _lmSrc/_lmGen/_lmRawId/_lmRawX/_lmRawY, and the food check finds the orientation and
 * verifies (d = 0, also on live food) or corrects d with reprojection; votes need independent
 * evidence (top-player lists 1.5 s apart, other pellets); a CONFLICTED source is not fed to the
 * reconciliation (_lmFeedOk); anchors die with their pellet or socket; live pellet pairs of FFA,
 * Experimental, Party and FFA with Rotate Map agree per mode; ClearAll and later borders keep a
 * connection's transform; "Keep moving" keeps the world direction across a reconnect on a mirrored socket;
 * the calibration evidence (section 11: one entity per pellet, second
 * clusters, d only from verified d, liveness in the cached reference, per-transform snaps, the
 * whole anchor ring).
 * node developers/tests/spectcoords.js [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

const W = 14142.135623730952, STEP = 4294967296;
/* main client on agar.io: full border [l, t, l + w, t + h], cells kept raw, Rotate Map by vnr
 * (setMapOffset / translateX of ogario.v4.js) */
function mainClient(l, t, w, h) {
    w = w || W; h = h || W;
    const right = l + w, bottom = t + h;
    const LM = {
        mapOffsetX: -(l + right) / 2, mapOffsetY: -(t + bottom) / 2, _lmBorderCX: (l + right) / 2, _lmBorderCY: (t + bottom) / 2,
        _lmBorderKX: W / w, _lmBorderKY: W / h, mapMinX: l, mapMaxX: right, mapMinY: t, mapMaxY: bottom,
        vector: [[0, 0], [1, 0], [1, 1], [0, 1]], vnr: 0, integrity: true, mapOffsetFixed: true,
        indexedCells: {}, removedCells: [], cells: [], food: [], foodMulti: [], viruses: [], playerCellsMulti: [],
        ghostCells: [], ghostCellsTime: 0, cellcolors: {}, fbOnline: [], gameMode: ':ffa',
        rgb2Hex: () => '#ffffff', vanillaskins() { }
    };
    LM.translateX = (x) => LM.mapMaxX - (x - LM.mapMinX);
    LM.translateY = (y) => LM.mapMaxY - (y - LM.mapMinY);
    /* world -> main raw */
    LM.worldX = (v) => LM._lmBorderCX + v / LM._lmBorderKX;
    LM.worldY = (v) => LM._lmBorderCY + v / LM._lmBorderKY;
    return LM;
}
const mainOf = (b) => mainClient(b[0], b[1], b[2] - b[0], b[3] - b[1]);
function load(LM) {
    function Cell(id, x, y, size, color, isFood, isVirus) {
        Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, startX: x, startY: y, removed: false });
    }
    /* the per-connection index of ogario.v4.js (lmObsTrack / lmObsOfSource) */
    const obs = new Map();
    Cell.prototype.removeCell = function () { this.removed = true; delete LM.indexedCells[this.id]; LM.removedCells.push(this); if (this._lmObsSet) this._lmObsSet.delete(this); };
    const win = { legendmod: LM, legendmod1: Cell, spects: [] };
    const ctx = {
        window: win, legendmod: LM, console: { log() { }, warn() { }, error: console.error }, Math, Number, Date, Object, Map, Buffer,
        setInterval: () => 0, clearInterval() { }, setTimeout: () => 0, clearTimeout() { },
        defaultmapsettings: {}, defaultSettings: { foodColor: '#5000ff' }, application: { teamPlayers: [] }, profiles: [],
        lmUnitCellId: (id, n) => id + n * STEP,
        /* the per-connection index and the food list of ogario.v4.js (fullmapfood.js tests them) */
        lmObsTrack(c, src) { if (!obs.has(src)) obs.set(src, new Set()); obs.get(src).add(c); c._lmObsSet = obs.get(src); },
        lmObsUntrack(c) { if (c._lmObsSet) c._lmObsSet.delete(c); c._lmObsSet = null; }, lmObsOfSource: (src) => obs.get(src) || null, lmObsVelocity() { }, lmFoodAdd() { }, lmFoodTouch() { }, toastr: {}, $: () => ({ val: () => '' })
    };
    vm.createContext(ctx);
    vm.runInContext(src + '\n;window.Spect = Spect; window.h = { lmRawToWorld, lmWorldToRaw };', ctx);
    return ctx;
}
/* a connection with the full border b = [minX, minY, maxX, maxY] in its raw frame (no socket) */
function unitB(ctx, b, opts) {
    const sp = Object.create(ctx.window.Spect.prototype);
    Object.assign(sp, { number: (opts && opts.number) || 1, player: !!(opts && opts.player), integrity: true, connectionGeneration: 1, staticX: null, staticY: null });
    sp.resetConnectionState();
    sp.setMapOffset(b[0], b[1], b[2], b[3]);
    ctx.window.spects.push(sp);
    return sp;
}
/* the same, centred on (cx, cy), w x h (default 14142.1356) */
const unit = (ctx, cx, cy, opts, w, h) => unitB(ctx, [cx - (w || W) / 2, cy - (h || W) / 2, cx + (w || W) / 2, cy + (h || W) / 2], opts);
const ORI = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);

/* 1. 4 orientations x different offsets and scales: the same world point lands where the main client has it */
{
    let worst = 0, n = 0;
    for (const [l, t, w, h] of [[-7071.067811865476, -7071.067811865476, W, W], [-7324.601462458406, -6192.663946706215, 14189.59613583367, 14102.09574580534], [12345.25, -20000.0678, 14073.66, 14198.5]]) {
        const LM = mainClient(l, t, w, h), ctx = load(LM);
        for (const [cx, cy, uw, uh] of [[0, 0, W, W], [4321.5, -987.25, 14210.66, 14072.41], [-15000.0678118654, 777, 14098.49321956181, 14096.388278921886]]) {
            for (const o of ORI) {
                const sp = unit(ctx, cx, cy, null, uw, uh);
                sp.setOrientation(o[0], o[1]);
                for (const [wx, wy] of [[0, 0], [-6000, 3100], [5432, -7000], [12.5, -0.25], [-W / 2, W / 2]]) {
                    const rx = cx + o[0] * wx * uw / W, ry = cy + o[1] * wy * uh / W;
                    worst = Math.max(worst, Math.abs(sp.getX(rx) - LM.worldX(wx)), Math.abs(sp.getY(ry) - LM.worldY(wy)));
                    n++;
                }
            }
        }
    }
    check('4 orientations x 9 offset / scale pairs (' + n + ' points, border edges too): unit point drawn where the main client has it (exact)', worst < 1e-6, worst);
}

/* 2. raw -> drawn -> raw exact (integer sent), every orientation and Rotate Map state */
{
    const LM = mainClient(-3021.0678118654755, 5000.5, 14189.59613583367, 14102.09574580534), ctx = load(LM);
    let bad = 0, n = 0;
    for (const o of ORI) {
        const sp = unit(ctx, 4321.5, -987.25, null, 14098.49321956181, 14167.784316744233);
        sp.setOrientation(o[0], o[1]);
        sp.fix3x = 0.37; sp.fix3y = -1.5;
        for (let vnr = 0; vnr < 4; vnr++) {
            LM.vnr = vnr;
            for (let i = 0; i < 50; i++) {
                const rx = Math.round(4321.5 + (i * 2654435761 % 14000) - 7000), ry = Math.round(-987.25 + (i * 40503 % 14000) - 7000);
                const back = [sp.convertX(sp.getX(rx)), sp.convertY(sp.getY(ry))];
                if (back[0] !== rx || back[1] !== ry) bad++;
                const w = sp.rawToWorldX(rx);
                if (Math.round(sp.worldToRawX(w)) !== rx || !near(ctx.window.h.lmWorldToRaw(ctx.window.h.lmRawToWorld(rx, 5.5, o[0], 2, 1.0033), 5.5, o[0], 2, 1.0033), rx, 1e-9)) bad++;
                n++;
            }
        }
    }
    LM.vnr = 0;
    check('raw -> drawn -> raw: the same integer for ' + n + ' points (4 orientations x 4 Rotate Map states, scaled, d != 0)', bad === 0, bad);
}

/* 2b. live agar.io: pellets seen by two of 7 connections (main, multibox, in-game spectator,
 *     4 tiles; borders 14092..14189 x 14090..14195, 2 connections mirrored) */
const LIVE = {"b":[[-7324.601462458406,-6192.663946706215,6864.994673375264,7909.431799099125],[-7508.7125469007115,-6418.94555552712,6589.780672661098,7677.442723394766],[-7411.476732876488,-5337.295744360623,6681.170105298836,8830.48857238361],[-9658.720664008262,-7152.786770754233,4520.409398123486,7042.798327811054],[-10999.188012378732,-10526.549327470273,3155.202122358225,3608.2092035359547],[-4933.145741948388,-5555.417645519918,9235.874287408515,8637.512978346187],[-8696.252527297273,-9912.876585124986,5423.601248285704,4178.1009201542565]],"o":[[1,1],[-1,1],[1,1],[1,1],[1,1],[1,1],[-1,-1]],"p":[[0,4580,5336,11,2,4411,6245,11],[0,4196,5539,10,2,4030,6449,10],[0,-6194,6715,10,2,-6288,7631,11],[0,4283,6568,12,2,4116,7483,12],[0,4617,5822,10,2,4448,6733,10],[0,5587,6337,10,2,5412,7250,10],[0,2927,5533,10,2,2770,6443,10],[0,-1889,6667,11,2,-2013,7583,11],[0,1566,6016,11,2,1418,6928,10],[0,2681,5320,10,2,2526,6229,10],[0,-6235,6345,10,2,-6329,7259,10],[0,-429,6319,10,2,-563,7233,10],[0,2490,5626,11,2,2336,6537,10],[0,5997,6176,10,2,5820,7089,10],[0,-3886,6470,10,2,-3996,7384,10],[0,5749,6131,11,2,5573,7044,11],[0,1552,5820,10,2,1404,6732,10],[0,-1554,6119,10,2,-1680,7032,10],[0,3050,4675,10,2,2892,5581,10],[0,-1650,6659,10,2,-1776,7575,10],[0,3753,5562,10,2,3591,6473,10],[0,-5735,6550,10,2,-5833,7465,10],[0,4871,2085,10,2,4700,2979,10],[0,2033,5575,10,2,1882,6485,10],[1,-6881,-879,13,2,6054,229,13],[1,-6731,-1161,11,2,5904,-53,11],[1,-6201,-824,10,2,5374,285,10],[1,2478,3181,10,2,-3301,4311,10],[1,-7099,-858,10,2,6272,251,10],[1,3931,3362,10,2,-4754,4493,10],[1,-6101,-964,10,2,5274,145,10],[1,1603,3210,10,2,-2426,4341,10],[1,-6525,-567,10,2,5698,543,10],[1,2389,3865,10,2,-3212,4998,10],[2,-1281,2283,10,3,-3491,483,10],[2,-2177,2297,10,3,-4392,497,10],[2,-1484,278,10,3,-3695,-1525,10],[2,-2858,1718,10,3,-5077,-83,10],[2,-2693,1390,10,3,-4911,-412,10],[2,1472,2479,10,3,-719,679,10],[2,1942,2317,10,3,-247,516,10],[2,-2458,2138,10,3,-4675,337,10],[2,-2592,2233,10,3,-4809,432,10],[2,-2458,1214,10,3,-4675,-587,10],[2,-1281,2283,10,4,-4842,-2923,10],[2,-2177,2297,10,4,-5742,-2909,10],[2,-1484,278,10,4,-5046,-4923,10],[2,-2858,1718,10,4,-6426,-3487,10],[2,-2693,1390,10,4,-6260,-3814,10],[2,1472,2479,10,4,-2075,-2727,10],[2,1942,2317,10,4,-1604,-2889,10],[2,-2458,2138,10,4,-6024,-3068,10],[2,-2592,2233,10,4,-6158,-2973,10],[2,-2458,1214,10,4,-6024,-3989,10],[2,-1281,2283,10,5,1229,2079,10],[2,-2177,2297,10,5,329,2093,10],[2,-1484,278,10,5,1026,70,10],[2,-2858,1718,10,5,-355,1512,10],[2,-2593,1476,10,5,-89,1270,10],[2,-1814,275,10,5,694,67,11],[2,1632,2312,10,5,4159,2108,10],[2,1078,872,10,5,3602,665,10],[2,2067,1786,10,5,4597,1581,10],[2,-2249,2206,10,5,257,2001,10],[2,-1281,2283,10,6,-717,-3401,10],[2,-2177,2297,10,6,179,-3415,10],[2,-1484,278,10,6,-514,-1407,10],[2,-2858,1718,10,6,861,-2838,10],[2,-2593,1476,10,6,596,-2599,10],[2,-1814,275,10,6,-184,-1404,11],[2,1632,2312,10,6,-3637,-3430,10],[2,1078,872,10,6,-3082,-1998,10],[2,2067,1786,10,6,-4073,-2907,10],[2,-2249,2206,10,6,251,-3324,10],[3,-3491,483,10,4,-4842,-2923,10],[3,-4392,497,10,4,-5742,-2909,10],[3,-3695,-1525,10,4,-5046,-4923,10],[3,-5077,-83,10,4,-6426,-3487,10],[3,-4911,-412,10,4,-6260,-3814,10],[3,-719,679,10,4,-2075,-2727,10],[3,-247,516,10,4,-1604,-2889,10],[3,-4675,337,10,4,-6024,-3068,10],[3,-4809,432,10,4,-6158,-2973,10],[3,-4675,-587,10,4,-6024,-3989,10],[3,-3491,483,10,5,1229,2079,10],[3,-4392,497,10,5,329,2093,10],[3,-3695,-1525,10,5,1026,70,10],[3,-5077,-83,10,5,-355,1512,10],[3,-4811,-325,10,5,-89,1270,10],[3,-4027,-1529,10,5,694,67,11],[3,-559,512,10,5,4159,2108,10],[3,-1117,-930,10,5,3602,665,10],[3,-121,-15,10,5,4597,1581,10],[3,-4464,406,10,5,257,2001,10]],"gb":[[-10618.60661571368,-3716.873940198938,3455.049027662773,10355.53369599476],[-5514.815734792803,-3725.63089476774,8622.029940357948,10472.872574837445]],"go":[[1,-1],[-1,-1]],"g":[[16572,[[-5072,3448,27874],[-4495,795,9508],[487,-121,5921],[-2476,5680,4605],[2638,4487,3918],[-4220,7478,3906],[-890,1040,3674],[-4207,1692,3352],[-2292,2571,2945],[-8614,7951,2606]],16789,[[3055,3499,27823],[2463,847,9508],[-2561,-139,5896],[465,5743,4576],[-4669,4579,3919],[2214,7557,3906],[-1166,1053,3674],[2160,1743,3340],[229,2613,2937],[6632,8064,2613]]],[17580,[[-5081,3412,27659],[-4449,895,9491],[507,-375,5839],[-2593,5623,4524],[2510,4618,3914],[-4315,7411,3906],[-805,937,3674],[-4097,1739,3352],[-2148,2552,2937],[-8734,8038,2613]],17772,[[3062,3460,27609],[2412,945,9491],[-2535,-402,5837],[581,5696,4524],[-4540,4710,3910],[2309,7487,3906],[-1252,948,3666],[2048,1788,3352],[85,2596,2937],[6746,8159,2613]]],[18586,[[-5095,3462,27412],[-4381,981,9480],[535,-626,5770],[-2563,5598,4504],[2380,4748,3905],[-4400,7332,3893],[-719,832,3666],[-3984,1782,3340],[-2004,2538,2937],[-8814,8163,2613]],18763,[[3080,3549,27365],[2343,1032,9480],[-2589,-658,5764],[534,5650,4504],[-4409,4842,3910],[2393,7405,3893],[-1338,843,3666],[1935,1832,3340],[-59,2583,2937],[6828,8284,2613]]]]};
{
    const LM = mainOf(LIVE.b[0]), ctx = load(LM);
    const conns = LIVE.b.map((b, n) => {
        if (!n) return null;
        const sp = unitB(ctx, b, { number: n });
        sp.setOrientation(LIVE.o[n][0], LIVE.o[n][1]);
        return sp;
    });
    const world = (n, x, y) => (n ? [conns[n].rawToWorldX(x), conns[n].rawToWorldY(y)] : [(x - LM._lmBorderCX) * LM._lmBorderKX, (y - LM._lmBorderCY) * LM._lmBorderKY]);
    /* without k (centre and mirror only, the previous contract) */
    const flat = (n, x, y) => { const b = LIVE.b[n], o = LIVE.o[n]; return [o[0] * (x - (b[0] + b[2]) / 2), o[1] * (y - (b[1] + b[3]) / 2)]; };
    const stats = (f) => {
        const d = LIVE.p.map((p) => { const a = f(p[0], p[1], p[2]), b = f(p[4], p[5], p[6]); return Math.hypot(a[0] - b[0], a[1] - b[1]); }).sort((a, b) => a - b);
        return { med: d[d.length >> 1], p95: d[Math.floor(d.length * 0.95)], max: d[d.length - 1] };
    };
    const s = stats(world), f = stats(flat);
    check('live pellet pairs (' + LIVE.p.length + '): median ' + s.med.toFixed(2) + ' <= 1.5, p95 ' + s.p95.toFixed(2) + ' <= 2.5 (max ' + s.max.toFixed(2) + ')', s.med <= 1.5 && s.p95 <= 2.5);
    check('(centre and mirror without the scale: median ' + f.med.toFixed(1) + ', p95 ' + f.p95.toFixed(1) + ')', f.med > 5);
    /* drawn: a unit pellet lands on the main client's copy */
    let worst = 0;
    for (const p of LIVE.p) if (p[0] === 0) worst = Math.max(worst, Math.hypot(conns[p[4]].getX(p[5]) - p[1], conns[p[4]].getY(p[6]) - p[2]));
    check('live: the in-game spectator\'s pellets drawn on the main client\'s copies (worst ' + worst.toFixed(2) + ' <= 4, int rounding)', worst <= 4);
}

/* 3. repeated Rotate Map: flipping the drawn position like _retranslateAllOnFlip never drifts */
{
    const LM = mainClient(-3021.0678118654755, 5000.5), ctx = load(LM);
    const sp = unit(ctx, 4321.5, -987.25);
    sp.setOrientation(-1, 1);
    const raw = [5123, -3333];
    let x = sp.getX(raw[0]), y = sp.getY(raw[1]), vnr = 0, worst = 0;
    for (let k = 0; k < 400; k++) {
        const nv = (k * 7 + 3) % 4, o = LM.vector[vnr], m = LM.vector[nv];
        if (!o[0] !== !m[0]) x = LM.translateX(x);
        if (!o[1] !== !m[1]) y = LM.translateY(y);
        LM.vnr = vnr = nv;
        worst = Math.max(worst, Math.abs(x - sp.getX(raw[0])), Math.abs(y - sp.getY(raw[1])));
        if (sp.convertX(x) !== raw[0] || sp.convertY(y) !== raw[1]) worst = Infinity;
    }
    LM.vnr = 0;
    check('400 Rotate Map changes: drawn position = placement from raw, and it sends the same raw', worst < 1e-6, worst);
}

/* 4. orientation from the top players: 2 clear snapshots, ambiguous ones ignored, no timeout,
 *    cells placed provisionally reprojected from their raw values */
function packet(cells) {
    const b = Buffer.alloc(2 + cells.length * 16 + 6);
    let o = 0;
    b.writeUInt16LE(0, o); o += 2;
    for (const c of cells) {
        b.writeUInt32LE(c.id, o); b.writeInt32LE(c.x, o + 4); b.writeInt32LE(c.y, o + 8); b.writeUInt16LE(c.size, o + 12); o += 14;
        if (c.food) { b.writeUInt8(128, o++); b.writeUInt8(1, o++); } else b.writeUInt8(0, o++);
    }
    b.writeUInt32LE(0, o); o += 4;
    b.writeUInt16LE(0, o); o += 2;
    return b.slice(0, o);
}
{
    const LM = mainClient(-3021.0678118654755, 5000.5), ctx = load(LM);
    const S = [-1, 1], cx = 4321.5, cy = -987.25;
    const sp = unit(ctx, cx, cy, { number: 2 });
    sp.time = Date.now();
    const toRaw = (w, a) => Math.round((a ? cy : cx) + S[a] * w);
    /* a cell decoded while the orientation is still provisional (drawn as not mirrored) */
    sp.updateCells(packet([{ id: 77, x: toRaw(-5000, 0), y: toRaw(2000, 1), size: 80 }]), 0);
    const cell = LM.indexedCells[77 + 2 * STEP];
    check('decode stores the observation: _lmSrc, _lmGen, _lmRawId, _lmRawX, _lmRawY',
        cell && cell._lmSrc === 2 && cell._lmGen === 1 && cell._lmRawId === 77 && cell._lmRawX === toRaw(-5000, 0) && cell._lmRawY === toRaw(2000, 1),
        cell && [cell._lmSrc, cell._lmGen, cell._lmRawId, cell._lmRawX, cell._lmRawY].join());
    check('provisional: spectator not trusted (no camera / checks), drawn as not mirrored', sp._lmOri === 'PROVISIONAL' && !sp.transformReady() && near(cell.targetX, LM.worldX(5000) - 0, 2));
    sp._lmOffsetFixedAt = Date.now() - 60000;
    check('no timeout: still unverified after 60 s without data', !sp.transformReady() && sp._lmOri === 'PROVISIONAL');
    const players = [[-5000, 2000, 9000], [4000, -3000, 7000], [2500, 6000, 5000], [-6200, -4100, 3000]];
    /* main and unit top-player lists (the unit's moved by dx; flip: sent as if not mirrored) */
    const snap = (t, list, dx, flip) => {
        LM.ghostCells = list.map((p) => ({ rawX: LM.worldX(p[0]), rawY: LM.worldY(p[1]), mass: p[2] }));
        LM.ghostCellsTime = t;
        sp.ghostCells = list.map((p) => ({ x: toRaw((flip ? -1 : 1) * (p[0] + (dx || 0)), 0), y: toRaw(p[1], 1), mass: p[2] + 30 }));
        sp._lmGhostTime = t + 200;
        sp.detectOrientation();
    };
    /* players on the x centre line fit both x signs: decides nothing */
    snap(1000, [[10, 2000, 9000], [-40, -3000, 7000], [60, 6000, 5000]]);
    snap(2000, [[30, 2100, 9000], [-20, -3100, 7000], [50, 5900, 5000]]);
    check('ambiguous top players (all near the centre line): no decision', sp._lmOri === 'PROVISIONAL' && sp.fixX === 1);
    snap(3000, players, 80);
    check('one clear snapshot: not verified yet', sp._lmOri === 'PROVISIONAL');
    sp.detectOrientation();
    check('the same pair of lists is not counted twice', sp._lmOri === 'PROVISIONAL');
    snap(4000, players, -60);
    check('the next lists 1 s later: not independent, not verified yet', sp._lmOri === 'PROVISIONAL');
    snap(4600, players, 200);
    check('players farther than 60 + 0.5 per ms of the gap: no vote', sp._lmOri === 'PROVISIONAL');
    snap(5000, players, -60);
    check('second clear snapshot 2 s later: verified as mirrored on x', sp._lmOri === 'VERIFIED' && sp.fixX === -1 && sp.fixY === 1 && sp.ghostFixed === true);
    check('the provisional cell reprojected from raw: now where the main client has it',
        near(cell.targetX, LM.worldX(-5000), 1) && near(cell.x, LM.worldX(-5000), 1) && near(cell.targetY, LM.worldY(2000), 1), [cell.x, cell.targetX, LM.worldX(-5000)].join());
    snap(7000, players, 0, true);
    check('verified, then contrary evidence: CONFLICTED, cells kept, not fed to the reconciliation', sp._lmOri === 'CONFLICTED' && sp.fixX === -1 && !sp._lmFeedOk());
    snap(9000, players);
    snap(11000, players);
    check('evidence back for the verified orientation: VERIFIED again', sp._lmOri === 'VERIFIED' && sp.fixX === -1 && sp._lmFeedOk());
    /* two players of one mass in reach of one: that one is ambiguous and not counted */
    const amb = vm.runInContext('lmGhostOrientationCounts', ctx)([{ x: 1000, y: 1000, mass: 5000 }, { x: -3000, y: 2000, mass: 8000 }],
        [{ x: 1000, y: 1000, mass: 5000 }, { x: 1100, y: 1000, mass: 5010 }, { x: -3000, y: 2000, mass: 8000 }], 200, 0.03, true);
    check('distinct matches: a player with two candidates of its mass in reach is not counted', amb[0] === 1, amb.join());
    const mb = unit(ctx, 10, 20, { number: 3, player: true });
    check('multibox unit: usable (controls, camera) while provisional', mb._lmOri === 'PROVISIONAL' && mb.transformReady());
}

/* 5. shared food: orientation and d, matched by place and size (not by id), with reprojection;
 *    the second run with Rotate Map on (main food drawn flipped, its raw kept in _lmRawX/Y) */
for (const [d, vnr] of [[0, 0], [3, 2]]) {
    const LM = mainClient(-7071.067811865476, -7071.067811865476), ctx = load(LM);
    LM.vnr = vnr;
    const draw = (x, a) => (vnr ? (a ? LM.translateY(x) : LM.translateX(x)) : x);
    const S = [1, -1], cx = -2500.5, cy = 9000;
    const sp = unit(ctx, cx, cy, { number: 4, player: true });
    const pellets = [];
    for (let i = 0; i < 80; i++) pellets.push([-3000 + (i * 7919 % 2000) + (i >= 40 ? 2500 : 0), 1500 + (i * 104729 % 1500), 10 + i % 6]);
    /* main food (its frame) and the unit's food packet; the unit's raw positions carry d */
    LM.food = pellets.map((p) => ({ x: draw(LM.worldX(p[0]), 0), y: draw(LM.worldY(p[1]), 1), targetX: draw(LM.worldX(p[0]), 0), targetY: draw(LM.worldY(p[1]), 1),
        _lmRawX: LM.worldX(p[0]), _lmRawY: LM.worldY(p[1]), size: p[2], targetSize: p[2] }));
    const raws = pellets.map((p, i) => ({ id: 5000 + i, x: Math.round(cx + S[0] * (p[0] - d)), y: Math.round(cy + S[1] * (p[1] - d)), size: p[2], food: true }));
    sp.time = 10000;
    /* the first 40 pellets: one vote; the same pellets checked again are no second confirmation */
    sp.updateCells(packet(raws.slice(0, 40).concat([{ id: 9, x: Math.round(cx + S[0] * (-2000 - d)), y: Math.round(cy + S[1] * (2000 - d)), size: 90 }])), 0);
    const body = LM.indexedCells[9 + 4 * STEP];
    const t0 = sp.time; /* updateCells stamps its packets with Date.now() */
    for (let k = 1; k <= 4; k++) sp._lmCalibrate(t0 + k * 3100);
    check('food (d=' + d + '): 40 shared pellets checked 4 times are one vote, not a verification', sp._lmOri === 'PROVISIONAL' && sp._lmOriStreakN === 1, [sp._lmOri, sp._lmOriStreakN].join());
    /* 40 other shared pellets: the second, independent vote */
    sp.updateCells(packet(raws.slice(40)), 0);
    for (let k = 5; k <= 12; k++) sp._lmCalibrate(t0 + k * 3100);
    check('food (d=' + d + '): orientation verified from 2 x 40 different shared pellets', sp._lmOri === 'VERIFIED' && sp.fixX === 1 && sp.fixY === -1, [sp._lmOri, sp.fixX, sp.fixY, sp._lmFoodCounts].join());
    check('food (d=' + d + '): residual ' + (d ? 'corrected' : 'verified as 0') + ' (fix3 ' + sp.fix3x + ', ' + sp.fix3y + ')',
        sp.foodCalibrated && near(sp.fix3x, d, 0.51) && near(sp.fix3y, d, 0.51));
    check('food (d=' + d + '): the unit\'s cells reprojected from raw onto the main frame',
        near(body.targetX, draw(LM.worldX(-2000), 0), 1) && near(body.targetY, draw(LM.worldY(2000), 1), 1) && near(body.x, draw(LM.worldX(-2000), 0), 1),
        [body.x, body.targetX, draw(LM.worldX(-2000), 0)].join());
}
/* 6. food that is not shared (another place): nothing is decided or moved */
{
    const LM = mainClient(-7071.067811865476, -7071.067811865476), ctx = load(LM);
    const sp = unit(ctx, 100, 100, { number: 5 });
    LM.food = [];
    for (let i = 0; i < 40; i++) LM.food.push({ x: 3000 + i * 37, y: 3000 + i * 53, size: 12, targetSize: 12 });
    const raws = [];
    for (let i = 0; i < 40; i++) raws.push({ id: 100 + i, x: -4000 + i * 41, y: -2000 + i * 29, size: 12, food: true });
    sp.time = 20000;
    sp.updateCells(packet(raws), 0);
    const t0 = sp.time;
    for (let k = 1; k <= 8; k++) sp._lmCalibrate(t0 + k * 3100);
    check('no shared food: no orientation decision, no residual', sp._lmOri === 'PROVISIONAL' && sp.fix3x === 0 && sp.fix3y === 0 && !sp.foodCalibrated);
}

/* 7. live agar.io: orientation from real top-player lists (two Full Map tiles of one capture,
 *    one mirrored on x against the other) and from real shared food (multibox unit mirrored on
 *    x against the in-game spectator taken as main), residual verified as 0 */
{
    const LM = mainOf(LIVE.gb[0]), ctx = load(LM);
    const sp = unitB(ctx, LIVE.gb[1], { number: 2 });
    const want = [LIVE.go[0][0] * LIVE.go[1][0], LIVE.go[0][1] * LIVE.go[1][1]];
    for (const g of LIVE.g) {
        LM.ghostCells = g[1].map((q) => ({ rawX: q[0], rawY: q[1], mass: q[2] }));
        LM.ghostCellsTime = g[0];
        sp.ghostCells = g[3].map((q) => ({ x: q[0], y: q[1], mass: q[2] }));
        sp._lmGhostTime = g[2];
        sp.detectOrientation();
    }
    check('live top players: orientation verified as ' + want + ' (scores ' + sp._lmGhostCounts + ')', sp._lmOri === 'VERIFIED' && sp.fixX === want[0] && sp.fixY === want[1]);
}
{
    const LM = mainOf(LIVE.b[2]), ctx = load(LM);
    const sp = unitB(ctx, LIVE.b[1], { number: 3, player: true });
    const pairs = LIVE.p.filter((p) => p[0] === 1 && p[4] === 2);
    LM.food = pairs.map((p) => ({ x: p[5], y: p[6], targetX: p[5], targetY: p[6], _lmRawX: p[5], _lmRawY: p[6], size: p[7], targetSize: p[7] }));
    sp.updateCells(packet(pairs.map((p, i) => ({ id: 300 + i, x: p[1], y: p[2], size: p[3], food: true }))), 0);
    const t0 = sp.time;
    for (let k = 1; k <= 8; k++) sp._lmCalibrate(t0 + k * 3100);
    const want = [LIVE.o[1][0] * LIVE.o[2][0], LIVE.o[1][1] * LIVE.o[2][1]];
    const wantC = (want[0] < 0 ? 1 : 0) + (want[1] < 0 ? 2 : 0);
    check('live shared food (' + pairs.length + ' pellets): one vote for ' + want + ', the same pellets again are no second one',
        sp._lmOri === 'PROVISIONAL' && sp._lmOriStreakC === wantC && sp._lmOriStreakN === 1, [sp._lmOri, sp._lmOriStreakC, sp._lmOriStreakN, sp._lmFoodCounts].join());
    /* a second, independent vote (top players): verified; the residual on the live food is 0 */
    sp._lmOriVote(wantC, 'top players');
    for (let k = 9; k <= 16; k++) sp._lmCalibrate(t0 + k * 3100);
    check('live shared food: orientation ' + want + ' verified, residual verified (fix3 ' + sp.fix3x + ', ' + sp.fix3y + ')',
        sp._lmOri === 'VERIFIED' && sp.fixX === want[0] && sp.fixY === want[1] && sp.foodCalibrated && sp.fix3x === 0 && sp.fix3y === 0, [sp._lmOri, sp.fixX, sp.fixY, sp._lmFoodCounts].join());
}

/* 8. food anchors: {sourceId, generation, rawId, rawX, rawY, size, observedAt, alive}; a pellet that is
 *    eaten or leaves the view is no evidence; a closed socket's anchors are gone from the reference;
 *    a unit's own cells come from its own index, not a scan of every cell */
{
    const LM = mainClient(-7071.067811865476, -7071.067811865476), ctx = load(LM);
    const sp = unit(ctx, 0, 0, { number: 6 });
    sp.setOrientation(1, 1);
    const raws = [];
    for (let i = 0; i < 20; i++) raws.push({ id: 700 + i, x: -3000 + i * 97, y: 1200 + i * 31, size: 10 + i % 4, food: true });
    sp.updateCells(packet(raws), 0);
    const A = sp._lmAnchors, a0 = A[0];
    check('anchor record: source, generation, raw id, raw place, size, time, alive',
        A.length === 20 && a0.sourceId === 6 && a0.generation === 1 && a0.rawId === 700 && a0.rawX === -3000 && a0.rawY === 1200 && a0.size === 10 && a0.observedAt > 0 && a0.alive === true,
        JSON.stringify(Object.assign({}, a0, { cell: !!a0.cell })));
    const live = () => A.filter((a) => vm.runInContext('lmAnchorLive', ctx)(a, sp.connectionGeneration)).length;
    for (let i = 0; i < 5; i++) LM.indexedCells[700 + i + 6 * STEP].removeCell();
    check('5 pellets eaten / out of view: their anchors are dead (15 live)', live() === 15, live());
    const ref = vm.runInContext('lmFoodReference', ctx)(Date.now() + 5000);
    check('the reference grid holds the 15 live anchors of the verified unit only', ref.grid.n === 15, ref.grid.n);
    /* 1000 cells of other connections: the unit's own cells come from its index */
    for (let i = 0; i < 1000; i++) LM.indexedCells[90000 + i] = { _lmSrc: 2, spectator: 2, x: 0, y: 0 };
    const seen = []; sp._lmForEachUnitCell((c) => seen.push(c));
    check('own cells only, from the index (15 live), plus those animating their removal (5)', seen.length === 20 && seen.every((c) => c._lmSrc === 6), seen.length);
    sp.connectionGeneration++;
    sp.resetConnectionState();
    check('a closed / new socket: every old anchor dead, the reference rebuilt without them',
        A.every((a) => !a.alive) && vm.runInContext('lmFoodReference', ctx)(Date.now() + 5100).grid.n === 0 && sp._lmAnchors.length === 0);
}

/* 9. live agar.io per mode (developers/tests/lib/fullmap-modes-live.json: FFA, Experimental, Party and
 *    FFA with Rotate Map on, main + 15 Full Map spectators each): pellets seen by two connections land
 *    on one world point (median <= 1.5, p95 <= 2.5, 97 % within 2), each connection with its own
 *    full border, scale and orientation */
{
    const M = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'fullmap-modes-live.json'), 'utf8'));
    for (const m of M.modes) {
        const P = m.pairs;
        if (!P || P.p.length < 20) { check('live ' + m.label + ': 20 or more pellet pairs', false, P ? P.p.length : 0); continue; }
        const LM = mainOf(P.b[0] || m.main.border), ctx = load(LM), conns = {};
        for (const n in P.b) if (+n) { conns[n] = unitB(ctx, P.b[n], { number: +n }); conns[n].setOrientation(P.o[n][0], P.o[n][1]); }
        const world = (n, x, y) => (+n ? [conns[n].rawToWorldX(x), conns[n].rawToWorldY(y)] : [(x - LM._lmBorderCX) * LM._lmBorderKX, (y - LM._lmBorderCY) * LM._lmBorderKY]);
        const d = P.p.map((p) => { const a = world(p[0], p[1], p[2]), b = world(p[4], p[5], p[6]); return Math.hypot(a[0] - b[0], a[1] - b[1]); }).sort((a, b) => a - b);
        const med = d[d.length >> 1], p95 = d[Math.floor(d.length * 0.95)], in2 = d.filter((v) => v <= 2).length / d.length;
        const ws = Object.values(P.b).map((b) => (b[2] - b[0]).toFixed(0));
        check('live ' + m.label + ' (' + m.gameMode + ', vnr ' + m.vnr + ', ' + d.length + ' pairs, widths ' + Math.min(...ws) + '..' + Math.max(...ws) + '): median ' + med.toFixed(2) + ' <= 1.5, p95 ' + p95.toFixed(2) + ' <= 2.5, ' + (100 * in2).toFixed(1) + ' % within 2',
            med <= 1.5 && p95 <= 2.5 && in2 >= 0.97);
    }
}

/* 10. ClearAll (opcode 18) and the later borders of a connection keep its transform: C, k, mirror and d
 *     stay as the first full border set them (a playing connection also gets ~4250 x 2560 view rects);
 *     only a new socket (resetConnectionState) takes a new border */
{
    const LM = mainClient(-7100, -7000, 14142.1356, 14142.1356), ctx = load(LM);
    ctx.window.buffer = { Buffer };
    ctx.window.lmCellIdx = { filter: (a, k, f) => a.filter(f), remove() { return false; } };
    const sp = unitB(ctx, [-5755.624, -6626.416, 8418.153, 7540.138], { number: 3 });
    sp.setOrientation(-1, 1);
    const xf = () => JSON.stringify([sp.mapOffsetX, sp.mapOffsetY, sp._lmKX, sp._lmKY, sp.fixX, sp.fixY, sp.fix3x, sp.fix3y, sp.mapOffsetFixed]);
    const before = xf(), pt = [sp.rawToWorldX(1234), sp.rawToWorldY(-2345)];
    const border = (l, t, r, b) => { const v = new DataView(new ArrayBuffer(33)); v.setUint8(0, 64); [l, t, r, b].forEach((x, i) => v.setFloat64(1 + 8 * i, x, true)); return v; };
    let err = null;
    try {
        sp.handleMessage(new DataView(new Uint8Array([18]).buffer));
        sp.handleMessage(border(-1200, -800, 3050, 1760));
        sp.handleMessage(border(-7000, -7100, 7189, 7002));
    } catch (e) { err = e.message; }
    check('ClearAll, a view rect and another full border: the transform is unchanged (k ' + sp._lmKX.toFixed(6) + ', ' + sp._lmKY.toFixed(6) + ')',
        !err && xf() === before && sp.rawToWorldX(1234) === pt[0] && sp.rawToWorldY(-2345) === pt[1], err || xf());
    sp.connectionGeneration++;
    sp.resetConnectionState();
    sp.handleMessage(border(-7000, -7100, 7189, 7002));
    check('a new socket takes its own border (k ' + sp._lmKX.toFixed(6) + ')', sp.mapOffsetFixed && near(sp._lmKX, W / 14189) && near(sp.mapOffsetX, -94.5));
}

/* 11. "Keep moving" (sendCursor): the uncontrolled unit keeps the world direction the cursor gave it,
 *     also after its socket dropped and reconnected in the background on a mirrored socket
 *     (the offset was a raw delta of the old socket: +500 became -500) */
{
    const LM = mainClient(-7071.0678, -7071.0678), ctx = load(LM);
    let tick = null;
    ctx.setInterval = (fn) => { tick = fn; return 1; };
    ctx.window.multiboxPlayerEnabled = 0;
    const sp = unitB(ctx, [-7000, -7100, 7142.1356, 7042.1356], { number: 1, player: true });
    sp.setOrientation(1, 1);
    const sent = [];
    sp.sendPosition = (x, y) => { sent.push([x, y]); return true; };
    sp.playerX = LM.worldX(1000); sp.playerY = LM.worldY(0);
    /* controlled: the cursor 500 right and 300 down of the unit */
    ctx.window.multiboxPlayerEnabled = 1; LM.cursorX = sp.playerX + 500; LM.cursorY = sp.playerY + 300;
    sp.sendCursor(); tick();
    /* the main player takes control back; the unit keeps moving: target - unit centre in world units */
    ctx.window.multiboxPlayerEnabled = 0; ctx.defaultmapsettings.multiKeepMoving = true;
    const dir = () => {
        sent.length = 0; tick();
        return [sp.rawToWorldX(sent[0][0]) - sp.rawToWorldX(sp.convertX(sp.playerX)), sp.rawToWorldY(sent[0][1]) - sp.rawToWorldY(sp.convertY(sp.playerY))].map((v) => Math.round(v)).join(',');
    };
    const a = dir();
    sp.connectionGeneration++; sp.resetConnectionState(); sp.setMapOffset(-7100, -7000, 7042.1356, 7142.1356); sp.setOrientation(-1, 1);
    sp.sendCursor();
    const b = dir();
    check('Keep moving: the unit runs toward where the cursor was (world +500, +300)', a === '500,300', a);
    check('Keep moving after a background reconnect on a mirrored socket: the same world direction (ran the opposite way)', b === '500,300', b);
}

/* 12. a new orientation or offset (_lmReproject): a moving cell's velocity (extrapolated between
 *     packets, lmObsVelocity) follows the linear part of the change: a mirror turns it round, a
 *     shift leaves it. Kept as it was, a cell verified mirrored ran the wrong way until its next
 *     two packets (40 units off after 40 ms at 1000 units/s, 200 at the extrapolation limit). */
{
    const LM = mainClient(-3021.0678118654755, 5000.5), ctx = load(LM);
    const sp = unit(ctx, 4321.5, -987.25, { number: 2 });
    sp.time = Date.now();
    sp.updateCells(packet([{ id: 91, x: 4000, y: -500, size: 80 }]), 0);
    const cell = LM.indexedCells[91 + 2 * STEP];
    cell._lmVX = -0.5; cell._lmVY = 0.25;
    sp.setOrientation(-1, 1);
    const v1 = [cell._lmVX, cell._lmVY];
    sp.setOrientation(-1, -1);
    const v2 = [cell._lmVX, cell._lmVY];
    sp._lmApplyTransform(-1, -1, 2.5, 3);
    const v3 = [cell._lmVX, cell._lmVY];
    check('mirror in x: velocity x turned round, y kept', near(v1[0], 0.5) && near(v1[1], 0.25), v1.join());
    check('mirror in y as well: velocity y turned round', near(v2[0], 0.5) && near(v2[1], -0.25), v2.join());
    check('offset only (d): velocity unchanged', near(v3[0], 0.5) && near(v3[1], -0.25), v3.join());
}

/* 11. Calibration evidence: one pellet seen by several connections is one reference entity
 *     (never two votes), a second cluster or unverified d is not evidence, a cached reference
 *     never counts a pellet that is gone, residual evidence belongs to one transform, and the
 *     check reaches the whole anchor ring. updateCells runs a throttled check at Date.now():
 *     the checks below run at later times. */
{
    const food = (p, size) => ({ x: p[0], y: p[1], _lmRawX: p[0], _lmRawY: p[1], size: size || 10, targetSize: size || 10 });
    const T = () => Date.now() + 100000;
    /* 11a. one reference pellet seen by two connections is one anchor: two observations near it are
     *      ambiguous (no vote twice); copies up to the quantization reach are one pellet; no arrival order */
    {
        const ctx = load(mainClient(-W / 2, -W / 2)), put = vm.runInContext('lmAnchorPut', ctx), res = vm.runInContext('lmAnchorResiduals', ctx), G = vm.runInContext('lmAnchorGrid', ctx);
        let g = G(); put(g, 0, 0, 10, 1); put(g, 1, 0, 10, 2);
        const r1 = res(g, [{ x: 0, y: 0, size: 10 }, { x: 1, y: 0, size: 10 }], 24, 3);
        check('11a one pellet, 2 copies, 2 observations: at most one match (got ' + r1.length + ')', r1.length <= 1, JSON.stringify(r1));
        g = G(); put(g, 0, 0, 10, 0); put(g, 2.5, 1.5, 10, 1);
        const r2 = res(g, [{ x: 1, y: 1, size: 10 }], 24, 3);
        check('11a copies 2.5 / 1.5 apart (2 x the live per-axis max): one pellet, matched', r2.length === 1, r2.length);
        g = G(); put(g, 0, 0, 10, 1); put(g, 3, 0, 10, 1);
        check('11a two pellets of one connection 3 apart stay two (observation ambiguous)', res(g, [{ x: 0, y: 0, size: 10 }], 24, 3).length === 0);
        const ord = [[{ x: 20, y: 0, size: 10 }, { x: 0, y: 0, size: 10 }], [{ x: 0, y: 0, size: 10 }, { x: 20, y: 0, size: 10 }]].map((o) => {
            const gg = G(); put(gg, 0, 0, 10, 0); return res(gg, o, 24, 3).map((r) => r[0] + ',' + r[1]).join(';');
        });
        check('11a two observations in reach of one pellet: the same result in both orders, no 20-unit residual', ord[0] === ord[1] && ord[0].indexOf('-20') < 0, ord.join(' | '));
        /* the flat grid grows past its first arrays and its hashed buckets keep pellets apart */
        g = G();
        const many = Array.from({ length: 3000 }, (_, i) => ({ x: -7000 + (i % 60) * 233 + 0.5, y: -7000 + Math.floor(i / 60) * 280 + 0.5, size: 10 }));
        many.forEach((p) => put(g, p.x + 1, p.y - 1, 10, 0));
        const rm = res(g, many, 24, 3);
        check('11a 3000 pellets: every observation matched once, residual (1, -1)', g.n === 3000 && rm.length === 3000 && rm.every((r, i) => r[0] === 1 && r[1] === -1 && r[2] === i), g.n + ' / ' + rm.length);
    }
    /* 11b. lmRobustOffset: a second cluster of nearly the same support is not one offset */
    {
        const ctx = load(mainClient(-W / 2, -W / 2)), rob = vm.runInContext('lmRobustOffset', ctx);
        const R = (a, n) => Array.from({ length: n }, () => [a[0], a[1], 0]);
        const a = rob(R([0, 0], 5).concat(R([23, 23], 3)));
        check('11b 5 at 0 + 3 at 23: all-match p95 reported (' + a.p95All + '), inlier p95 ' + a.p95, a.inl === 5 && a.p95All >= 23, JSON.stringify(a));
        const b = rob(R([0, 0], 8).concat(R([6, 6], 7)));
        check('11b 8 at 0 + 7 at 6: second cluster reported (alt ' + b.alt + ')', b.alt === 7, JSON.stringify(b));
    }
    /* 11c. d is only taken from verified d: a tile whose orientation is verified but whose d is not
     *      (wrong by 6) does not move another connection's d */
    {
        const LM = mainClient(-W / 2, -W / 2), ctx = load(LM);
        const bad = unit(ctx, 0, 0, { number: 2 }); bad.setOrientation(1, 1); bad._lmApplyTransform(1, 1, 6, 6);
        const sp = unit(ctx, 0, 0, { number: 3 }); sp.setOrientation(1, 1);
        const P = (i) => [-3000 + i * 150, 1000 + (i % 4) * 150];
        LM.food = Array.from({ length: 7 }, (_, i) => food(P(i)));
        bad.updateCells(packet(Array.from({ length: 9 }, (_, j) => ({ id: 100 + j, x: P(7 + j)[0], y: P(7 + j)[1], size: 10, food: true }))), 0);
        sp.updateCells(packet(Array.from({ length: 16 }, (_, j) => ({ id: 300 + j, x: P(j)[0], y: P(j)[1], size: 10, food: true }))), 0);
        const t0 = T();
        for (let k = 1; k <= 3; k++) sp._lmCalibrate(t0 + k * 3100);
        check('11c 7 pellets shared with main (d 0) + 9 with an unverified-d tile (d 6): d stays 0 (fix3 ' + sp.fix3x + ', ' + sp.fix3y + ')', sp.fix3x === 0 && sp.fix3y === 0);
    }
    /* 11d. the cached reference never counts a pellet that is gone */
    {
        const LM = mainClient(-W / 2, -W / 2), ctx = load(LM);
        const tile = unit(ctx, 0, 0, { number: 2 }); tile.setOrientation(1, 1);
        tile.updateCells(packet(Array.from({ length: 20 }, (_, j) => ({ id: 100 + j, x: -3000 + j * 150, y: 1000, size: 10, food: true }))), 0);
        LM.food = [food([10, 10])];
        const FR = vm.runInContext('lmFoodReference', ctx), res = vm.runInContext('lmAnchorResiduals', ctx), t = T();
        vm.runInContext('lmFoodRefInvalidate', ctx)();
        FR(t);
        for (let j = 0; j < 10; j++) LM.indexedCells[100 + j + 2 * STEP].removeCell();
        LM.food[0].removed = true;
        const r = FR(t + 300);
        const m = res(r.grid, [{ x: -3000, y: 1000, size: 10 }, { x: 10, y: 10, size: 10 }, { x: -1500, y: 1000, size: 10 }], 24, 3);
        check('11d reference cached 300 ms: an eaten tile pellet and a removed main pellet match nothing, a live one does', m.length === 1 && m[0][2] === 2, JSON.stringify(m));
    }
    /* 11e. residual evidence belongs to one transform: a pending snap is dropped by a transform change;
     *      leaving VERIFIED or a new orientation makes d unverified again */
    {
        const LM = mainClient(-W / 2, -W / 2), ctx = load(LM);
        const sp = unit(ctx, 0, 0, { number: 3 }); sp.setOrientation(1, 1);
        const pts = Array.from({ length: 12 }, (_, i) => [-3000 + i * 150, 1000 + (i % 3) * 170]);
        LM.food = pts.map((p) => food(p));
        sp.updateCells(packet(pts.map((p, j) => ({ id: 400 + j, x: p[0], y: p[1], size: 10, food: true }))), 0);
        const pend = sp._lmCalibSnaps.length;
        sp._lmApplyTransform(1, 1, 0.9, 0.9);
        const t0 = T();
        sp._lmCalibrate(t0);
        check('11e a snap from before a transform change is not paired with one after it (pending ' + pend + ')', pend === 1 && !sp.foodCalibrated, [sp.foodCalibrated, JSON.stringify(sp._lmCalibSnaps)].join(' '));
        sp._lmCalibrate(t0 + 3100);
        check('11e two snaps of the new transform: d verified from them alone (fix3 ' + sp.fix3x + ', residual within the 1-unit rule)', sp.foodCalibrated && Math.abs(sp.fix3x) <= 1 && Math.abs(sp.fix3y) <= 1);
        sp._lmOriVote(1, 'test');
        check('11e contrary vote: CONFLICTED and d no longer verified', sp._lmOri === 'CONFLICTED' && !sp.foodCalibrated);
    }
    /* 11f. the check reaches every anchor, not only the newest 128: 256 older shared pellets, 128 newest unshared */
    {
        const LM = mainClient(-W / 2, -W / 2), ctx = load(LM);
        const sp = unit(ctx, 0, 0, { number: 3 }); sp.setOrientation(1, 1);
        const old = Array.from({ length: 256 }, (_, i) => [-6000 + (i % 32) * 150, -6000 + Math.floor(i / 32) * 150]);
        LM.food = old.map((p) => food(p));
        sp.updateCells(packet(Array.from({ length: 128 }, (_, j) => ({ id: 2000 + j, x: 3000 + (j % 16) * 150, y: 3000 + Math.floor(j / 16) * 150, size: 10, food: true }))), 0);
        sp.updateCells(packet(old.map((p, j) => ({ id: 1000 + j, x: p[0], y: p[1], size: 10, food: true }))), 0);
        sp.updateCells(packet(Array.from({ length: 128 }, (_, j) => ({ id: 3000 + j, x: 4000 + (j % 16) * 150, y: -3000 + Math.floor(j / 16) * 150, size: 10, food: true }))), 0);
        const t0 = T();
        for (let k = 1; k <= 6; k++) sp._lmCalibrate(t0 + k * 3100);
        check('11f shared pellets older than the newest 128: d verified within 6 checks', sp.foodCalibrated, sp._lmCalibSnaps.length);
    }
    /* 11g. d is verified across neighbouring tiles, not only on the main view: a verified
     *      neighbour can verify d (|median| <= 1), only the main food and tiles whose d is verified
     *      can correct it. Live fixture (main + 3 tiles), pellets in 4 packets 1 s apart, simulated
     *      clock: all 3 within a few seconds (were never in 120 s with main / verified-d only) */
    {
        const L = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'fullmap-food-live.json'), 'utf8'));
        const m = L.conns.find((c) => c.n === 0), tiles = L.conns.filter((c) => c.n > 0);
        const LM = mainClient(m.minX, m.minY, m.maxX - m.minX, m.maxY - m.minY), ctx = load(LM);
        LM.food = m.food.map((p) => ({ x: p[0], y: p[1], targetX: p[0], targetY: p[1], _lmRawX: p[0], _lmRawY: p[1], size: p[2], targetSize: p[2] }));
        const sps = tiles.map((c) => { const sp = unitB(ctx, [c.minX, c.minY, c.maxX, c.maxY], { number: c.n }); sp.setOrientation(c.o[0], c.o[1]); return sp; });
        const t0 = T(), at = sps.map(() => -1);
        for (let sec = 0; sec <= 8; sec++) {
            if (sec < 4) tiles.forEach((c, i) => { const q = Math.ceil(c.food.length / 4); sps[i].updateCells(packet(c.food.slice(sec * q, (sec + 1) * q).map((p, j) => ({ id: 10 + sec * q + j, x: p[0], y: p[1], size: p[2], food: true }))), 0); });
            sps.forEach((sp, i) => { sp._lmCalibrate(t0 + sec * 1000); if (sp.foodCalibrated && at[i] < 0) at[i] = sec; });
        }
        check('11g live fixture: the 3 tiles verify d within 8 simulated s (at ' + at.join(', ') + ' s), d 0',
            at.every((s) => s >= 0) && sps.every((sp) => sp.fix3x === 0 && sp.fix3y === 0), at.join(','));
    }
    /* 11h. 3 x 5 tiles (own border, scale and mirror each, views 100 beyond their cell), the main
     *      view (4250 x 2560) in a corner: every tile verifies d within 10 simulated s */
    {
        let seed = 7932; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
        const h = W / 2, pel = Array.from({ length: 6000 }, () => [-h + rnd() * W, -h + rnd() * W, 10 + Math.floor(rnd() * 3)]);
        const mw = W + (rnd() - 0.5) * 80, mh = W + (rnd() - 0.5) * 80, mcx = (rnd() - 0.5) * 6000, mcy = (rnd() - 0.5) * 6000;
        const LM = mainClient(mcx - mw / 2, mcy - mh / 2, mw, mh), ctx = load(LM);
        const inV = (p, r) => p[0] >= r[0] && p[0] <= r[2] && p[1] >= r[1] && p[1] <= r[3];
        const mv = [-h + 2200 - 2125, -h + 1400 - 1280, -h + 2200 + 2125, -h + 1400 + 1280];
        LM.food = pel.filter((p) => inV(p, mv)).map((p) => { const rx = Math.round(LM._lmBorderCX + p[0] / LM._lmBorderKX), ry = Math.round(LM._lmBorderCY + p[1] / LM._lmBorderKY);
            return { x: rx, y: ry, targetX: rx, targetY: ry, _lmRawX: rx, _lmRawY: ry, size: p[2], targetSize: p[2] }; });
        const tiles = [], tw = W / 3, th = W / 5;
        for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
            const w = W + (rnd() - 0.5) * 100, hh = W + (rnd() - 0.5) * 100, cx = (rnd() - 0.5) * 8000, cy = (rnd() - 0.5) * 8000, o = [rnd() < 0.5 ? -1 : 1, rnd() < 0.5 ? -1 : 1];
            const sp = unitB(ctx, [cx - w / 2, cy - hh / 2, cx + w / 2, cy + hh / 2], { number: tiles.length + 1 });
            sp.setOrientation(o[0], o[1]);
            const view = [-h + c * tw - 100, -h + r * th - 100, -h + (c + 1) * tw + 100, -h + (r + 1) * th + 100];
            tiles.push({ sp, mine: pel.filter((p) => inV(p, view)).map((p) => [Math.round(cx + o[0] * p[0] * w / W), Math.round(cy + o[1] * p[1] * hh / W), p[2]]), at: -1 });
        }
        for (const t of tiles) t.sp.updateCells(packet(t.mine.map((p, i) => ({ id: 10 + i, x: p[0], y: p[1], size: p[2], food: true }))), 0);
        const t0 = T();
        for (let sec = 0; sec <= 10; sec++) for (const t of tiles) { t.sp._lmCalibrate(t0 + sec * 1000); if (t.sp.foodCalibrated && t.at < 0) t.at = sec; }
        const done = tiles.filter((t) => t.at >= 0).length;
        check('11h 3 x 5 tiles, main view in a corner: ' + done + ' / 15 verify d within 10 simulated s (latest ' + Math.max(...tiles.map((t) => t.at)) + ' s), d 0',
            done === 15 && tiles.every((t) => t.sp.fix3x === 0 && t.sp.fix3y === 0), tiles.map((t) => t.at).join(','));
    }
    /* 11i. a verified neighbour with a wrong d (6) and no verified d, sharing 40 pellets and
     *      nothing shared with the main view: d is neither verified nor moved */
    {
        const LM = mainClient(-W / 2, -W / 2), ctx = load(LM);
        const bad = unit(ctx, 0, 0, { number: 2 }); bad.setOrientation(1, 1); bad._lmApplyTransform(1, 1, 6, 6);
        const sp = unit(ctx, 0, 0, { number: 3 }); sp.setOrientation(1, 1);
        const P = (i) => [-3000 + (i % 10) * 150, 1000 + Math.floor(i / 10) * 150];
        LM.food = Array.from({ length: 20 }, (_, i) => food([4000 + i * 150, -4000]));
        bad.updateCells(packet(Array.from({ length: 40 }, (_, j) => ({ id: 100 + j, x: P(j)[0], y: P(j)[1], size: 10, food: true }))), 0);
        sp.updateCells(packet(Array.from({ length: 40 }, (_, j) => ({ id: 300 + j, x: P(j)[0], y: P(j)[1], size: 10, food: true }))), 0);
        const t0 = T();
        for (let k = 1; k <= 4; k++) sp._lmCalibrate(t0 + k * 3100);
        check('11i a wrong-d neighbour (40 shared pellets) neither verifies nor moves d (fix3 ' + sp.fix3x + ', ' + sp.fix3y + ')', !sp.foodCalibrated && sp.fix3x === 0 && sp.fix3y === 0);
    }
}

console.log(failed ? 'FAILED ' + failed : 'all spectcoords checks passed');
process.exit(failed ? 1 : 0);
