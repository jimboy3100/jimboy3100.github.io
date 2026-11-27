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
 * verifies (d = 0, also on live food) or corrects d with reprojection.
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
    Cell.prototype.removeCell = function () { this.removed = true; delete LM.indexedCells[this.id]; LM.removedCells.push(this); };
    const win = { legendmod: LM, legendmod1: Cell, spects: [] };
    const ctx = {
        window: win, legendmod: LM, console: { log() { }, warn() { }, error: console.error }, Math, Number, Date, Object, Map, Buffer,
        setInterval: () => 0, clearInterval() { }, setTimeout: () => 0, clearTimeout() { },
        defaultmapsettings: {}, defaultSettings: { foodColor: '#5000ff' }, application: { teamPlayers: [] }, profiles: [],
        lmUnitCellId: (id, n) => id + n * STEP,
        /* the per-connection index and the food list of ogario.v4.js (fullmapfood.js tests them) */
        lmObsTrack() { }, lmObsUntrack() { }, lmObsOfSource: () => null, lmObsVelocity() { }, lmFoodAdd() { }, lmFoodTouch() { }, toastr: {}, $: () => ({ val: () => '' })
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
    check('second clear snapshot: verified as mirrored on x', sp._lmOri === 'VERIFIED' && sp.fixX === -1 && sp.fixY === 1 && sp.ghostFixed === true);
    check('the provisional cell reprojected from raw: now where the main client has it',
        near(cell.targetX, LM.worldX(-5000), 1) && near(cell.x, LM.worldX(-5000), 1) && near(cell.targetY, LM.worldY(2000), 1), [cell.x, cell.targetX, LM.worldX(-5000)].join());
    snap(5000, players, 0, true);
    check('verified, then contrary evidence: CONFLICTED, cells kept', sp._lmOri === 'CONFLICTED' && sp.fixX === -1);
    snap(6000, players);
    snap(7000, players);
    check('evidence back for the verified orientation: VERIFIED again', sp._lmOri === 'VERIFIED' && sp.fixX === -1);
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
    for (let i = 0; i < 40; i++) pellets.push([-3000 + (i * 7919 % 2000), 1500 + (i * 104729 % 1500), 10 + i % 6]);
    /* main food (its frame) and the unit's food packet; the unit's raw positions carry d */
    LM.food = pellets.map((p) => ({ x: draw(LM.worldX(p[0]), 0), y: draw(LM.worldY(p[1]), 1), targetX: draw(LM.worldX(p[0]), 0), targetY: draw(LM.worldY(p[1]), 1),
        _lmRawX: LM.worldX(p[0]), _lmRawY: LM.worldY(p[1]), size: p[2], targetSize: p[2] }));
    const raws = pellets.map((p, i) => ({ id: 5000 + i, x: Math.round(cx + S[0] * (p[0] - d)), y: Math.round(cy + S[1] * (p[1] - d)), size: p[2], food: true }));
    sp.time = 10000;
    sp.updateCells(packet(raws.concat([{ id: 9, x: Math.round(cx + S[0] * (-2000 - d)), y: Math.round(cy + S[1] * (2000 - d)), size: 90 }])), 0);
    const body = LM.indexedCells[9 + 4 * STEP];
    const t0 = sp.time; /* updateCells stamps its packets with Date.now() */
    for (let k = 1; k <= 8; k++) sp._lmCalibrate(t0 + k * 3100);
    check('food (d=' + d + '): orientation verified from 40 shared pellets', sp._lmOri === 'VERIFIED' && sp.fixX === 1 && sp.fixY === -1, [sp._lmOri, sp.fixX, sp.fixY, sp._lmFoodCounts].join());
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
    check('live shared food (' + pairs.length + ' pellets): orientation ' + want + ' verified, residual verified (fix3 ' + sp.fix3x + ', ' + sp.fix3y + ')',
        sp._lmOri === 'VERIFIED' && sp.fixX === want[0] && sp.fixY === want[1] && sp.foodCalibrated && sp.fix3x === 0 && sp.fix3y === 0, [sp._lmOri, sp.fixX, sp.fixY, sp._lmFoodCounts].join());
}

console.log(failed ? 'FAILED ' + failed : 'all spectcoords checks passed');
process.exit(failed ? 1 : 0);
