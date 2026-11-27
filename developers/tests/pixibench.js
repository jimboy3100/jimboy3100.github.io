/* The geometry packer of the PixiJS benchmark prototype (developers/bench/pixi-mesh-page.js)
 * against the real Legend Mod code cut out of ogario/ogario.v4.js, in Node:
 *   - bodies: for seeded cells (normal cells and viruses with spikes, 5..120 points) the
 *     prototype's vertices, colours and triangles must be exactly those of drawWebGLCellBatch's
 *     jelly writers (_lmJellyWriteFill, writeWebGLJellyStrokeBand, _lmJellyBuildIndices with
 *     lmJellyFanIndices / lmJellyBandIndices), cell by cell in the same order;
 *   - index reuse: a frame with the same counts keeps the indices; a changed count rebuilds
 *     from that cell on and gives the same list as a fresh build;
 *   - food: the instances in the order and size of drawCachedFood's Canvas2D drawing (rainbow
 *     food: one fill per colour in the order the colours first appear; one colour: round-cap
 *     strokes), with the same culling box.
 * The benchmark itself (headless Chrome, GPU): node developers/bench/pixi-mesh.js
 * node developers/tests/pixibench.js [ogario.v4.js] */
'use strict';
const fs = require('fs');
const path = require('path');
const { rendererFactory } = require('./glbatch.js');
const P = require('../bench/pixi-mesh-page.js');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

const F = rendererFactory(src);
const D = new Function('return ' + F.defaults)();
const LM = { cells: [], food: [], playerCells: [], playerCellsMulti: [], play: false, showFood: true, gameMode: ':ffa' };
const window = { legendmod: LM, fullSpectator: false };
const env = { window, LM, application: {}, defaultSettings: D.defaultSettings, defaultmapsettings: D.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
const R = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/\}$/, ''))(env);

/* Park-Miller, as the bench scenes */
function rng(seed) { let s = seed; return () => { s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647; return (s - 1) / 2147483646; }; }

/* cells with a deformed perimeter (viruses: alternating spikes, as movePoints makes them) */
function makeCells(n, seed) {
    const r = rng(seed), out = [];
    for (let i = 0; i < n; i++) {
        const virus = r() < 0.15, size = virus ? 100 : 32 + r() * 400, x = (r() - 0.5) * 4000, y = (r() - 0.5) * 2200;
        const np = virus ? 100 : 5 + ((r() * 116) | 0), pts = [];
        for (let k = 0; k < np; k++) {
            /* uneven angles: a virus's radial normals differ from the averaged edge normals */
            const a = (k + (r() - 0.5) * 0.6) / np * Math.PI * 2, rr = size * (virus ? (k % 2 ? 1 : 1.08) : 0.9 + r() * 0.2);
            pts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr });
        }
        /* now and then two points at the same place (zero-length edge: the normal falls back) */
        if (!virus && np > 6 && r() < 0.2) pts[3] = { x: pts[2].x, y: pts[2].y };
        out.push({ id: i + 1, x, y, size, isVirus: virus, points: pts, color: (r() * 0xffffff) | 0, alpha: r() < 0.2 ? 0.4 : 1 });
    }
    return out;
}
const VSTROKE = 14;

/* LM: the emission of drawWebGLCellBatch's jelly pass with the real writers */
function lmEmit(cells) {
    let nv = 0, ns = 0;
    cells.forEach((c) => { nv += c.points.length + 1; ns += c.isVirus ? c.points.length * 2 : 0; });
    R.glJellyStride = 11; R.glJellyStrokeStride = 7;
    R.glJellyVertexData = new Float32Array(nv * 11);
    R.glJellyStrokeVertexData = new Float32Array(Math.max(1, ns) * 7);
    const k = cells.length;
    R.glJellyDrawStarts = new Int32Array(k); R.glJellyDrawCounts = new Int32Array(k); R.glJellyDrawBands = new Int32Array(k); R.glJellyDrawStrokeStarts = new Int32Array(k);
    R.glJellyFillIdxStarts = new Int32Array(k); R.glJellyStrokeIdxStarts = new Int32Array(k);
    R.glJellyIndexData = new Uint32Array(nv * 3); R.glJellyStrokeIndexData = new Uint32Array(Math.max(1, ns) * 3);
    R._glJellyVertexCount = 0; R._glJellyStrokeVertexCount = 0; R._glJellyOffX = 0; R._glJellyOffY = 0;
    cells.forEach((c, i) => {
        const rgb = [((c.color >> 16) & 255) / 255, ((c.color >> 8) & 255) / 255, (c.color & 255) / 255];
        const fillStart = R._lmJellyWriteFill(c, c.points, c.size, rgb, c.alpha, -1, 0, 0.5);
        const strokeStart = R._glJellyStrokeVertexCount;
        let bands = 0;
        if (c.isVirus) bands += R.writeWebGLJellyStrokeBand(c, c.points, -VSTROKE * 0.5, VSTROKE * 0.5, rgb[0], rgb[1], rgb[2], 1, 1, 0.5);
        R.glJellyDrawStarts[i] = fillStart; R.glJellyDrawCounts[i] = c.points.length; R.glJellyDrawBands[i] = bands; R.glJellyDrawStrokeStarts[i] = strokeStart;
    });
    const idx = R._lmJellyBuildIndices(0, k);
    return { fill: R.glJellyVertexData, stroke: R.glJellyStrokeVertexData, fi: R.glJellyIndexData, si: R.glJellyStrokeIndexData, idx };
}
function packEmit(bp, cells) {
    bp.begin();
    cells.forEach((c) => bp.cell(c.x, c.y, c.points, P.rgba(c.color, c.alpha), c.isVirus, -VSTROKE * 0.5, VSTROKE * 0.5, P.rgba(c.color, 1), c.isVirus));
    return bp.end();
}

/* ---------------- bodies: the same geometry ---------------- */
{
    const cells = makeCells(300, 4242);
    const L = lmEmit(cells), bp = new P.BodyPack();
    packEmit(bp, cells);
    let posBad = 0, colBad = 0, triBad = 0, first = '';
    const f32 = (v) => Math.fround(v);
    let fiAt = 0, siAt = 0;
    cells.forEach((c, i) => {
        const n = c.points.length, s = R.glJellyDrawStarts[i], m = bp.starts[i];
        const col = P.rgba(c.color, c.alpha);
        /* fill: centre + points, x/y and colour */
        for (let v = 0; v <= n; v++) {
            const lx = L.fill[(s + v) * 11], ly = L.fill[(s + v) * 11 + 1];
            if (bp.pos[(m + v) * 2] !== lx || bp.pos[(m + v) * 2 + 1] !== ly) { posBad++; if (!first) first = 'cell ' + i + ' fill v' + v; }
            const lc = P.rgba(Math.round(L.fill[(s + v) * 11 + 4] * 255) << 16 | Math.round(L.fill[(s + v) * 11 + 5] * 255) << 8 | Math.round(L.fill[(s + v) * 11 + 6] * 255), L.fill[(s + v) * 11 + 7]);
            if (bp.col[m + v] !== lc || lc !== col) colBad++;
        }
        /* band: inner/outer per point */
        if (c.isVirus) {
            const ss = R.glJellyDrawStrokeStarts[i], b0 = m + n + 1;
            for (let v = 0; v < 2 * n; v++) {
                if (bp.pos[(b0 + v) * 2] !== L.stroke[(ss + v) * 7] || bp.pos[(b0 + v) * 2 + 1] !== L.stroke[(ss + v) * 7 + 1]) { posBad++; if (!first) first = 'cell ' + i + ' band v' + v; }
            }
        }
        /* triangles in order: LM's fill triangles of the cell, then its band triangles, against the
         * prototype's list of the cell (fan then band), compared by vertex position */
        const mine = bp.idx, at = bp.idxAt[i];
        const pos = (arr, stride, vi) => arr[vi * stride] + ',' + arr[vi * stride + 1];
        for (let t = 0; t < n * 3; t++) {
            if (pos(L.fill, 11, L.fi[fiAt + t]) !== f32(bp.pos[mine[at + t] * 2]) + ',' + f32(bp.pos[mine[at + t] * 2 + 1])) { triBad++; if (!first) first = 'cell ' + i + ' fill index ' + t; }
        }
        fiAt += n * 3;
        if (c.isVirus) {
            for (let t = 0; t < n * 6; t++) {
                if (pos(L.stroke, 7, L.si[siAt + t]) !== f32(bp.pos[mine[at + n * 3 + t] * 2]) + ',' + f32(bp.pos[mine[at + n * 3 + t] * 2 + 1])) { triBad++; if (!first) first = 'cell ' + i + ' band index ' + t; }
            }
            siAt += n * 6;
        }
    });
    check('bodies: every fill and band vertex at the position LM writes', posBad === 0, posBad + ' differ, first ' + first);
    check('bodies: every vertex in the colour and alpha LM writes', colBad === 0, colBad + ' differ');
    check('bodies: the triangles of each cell are LM\'s, in LM\'s order', triBad === 0, triBad + ' differ, first ' + first);
    const lmTris = L.idx.fillTotal / 3 + L.idx.strokeTotal / 3;
    check('bodies: as many triangles as LM draws (' + lmTris + ')', bp.ni / 3 === lmTris, bp.ni / 3);
    check('bodies: cell order kept (cell k starts after cell k-1)', cells.every((c, i) => i === 0 || bp.starts[i] > bp.starts[i - 1]));
}

/* ---------------- index reuse ---------------- */
{
    const cells = makeCells(200, 99);
    const bp = new P.BodyPack();
    check('indices: the first frame builds them', packEmit(bp, cells) === true);
    const before = bp.idx.slice(0, bp.ni);
    check('indices: the same counts keep them (no rebuild)', packEmit(bp, cells) === false && bp.validFrom === -1);
    /* cell 120 loses a point, a virus is added at the end */
    cells[120].points = cells[120].points.slice(0, -1);
    const extra = makeCells(30, 7).find((c) => c.isVirus);
    cells.push(extra);
    const changed = packEmit(bp, cells);
    const fresh = new P.BodyPack();
    packEmit(fresh, cells);
    const same = bp.ni === fresh.ni && bp.idx.subarray(0, bp.ni).every((v, i) => v === fresh.idx[i]);
    check('indices: a changed count rebuilds from that cell on', changed && bp.validFrom === 120 && bp.idxFrom === bp.idxAt[120], 'from ' + bp.validFrom);
    check('indices: the rebuilt list equals a fresh build', same);
    check('indices: the cells before the change keep their indices', before.subarray(0, bp.idxAt[120]).every((v, i) => v === bp.idx[i]));
    /* fewer cells than before */
    cells.length = 150;
    packEmit(bp, cells);
    const fresh2 = new P.BodyPack();
    packEmit(fresh2, cells);
    check('indices: fewer cells: same list as a fresh build', bp.ni === fresh2.ni && bp.idx.subarray(0, bp.ni).every((v, i) => v === fresh2.idx[i]));
    /* growth from a small start */
    const big = makeCells(2000, 5), g = new P.BodyPack();
    packEmit(g, big);
    const gf = new P.BodyPack();
    gf.pos = new Float32Array(1 << 22); gf.col = new Uint32Array(1 << 21); gf.idx = new Uint32Array(1 << 23);
    packEmit(gf, big);
    check('growth: arrays grown during a frame keep what was written', g.nv === gf.nv && g.pos.subarray(0, g.nv * 2).every((v, i) => v === gf.pos[i]) && g.idx.subarray(0, g.ni).every((v, i) => v === gf.idx[i]));
}

/* ---------------- colour packing ---------------- */
{
    const v = new Uint8Array(new Uint32Array([P.rgba(0x123456, 1), P.rgba(0xff0080, 0.4)]).buffer);
    check('colour: bytes r, g, b, a (normalized UNSIGNED_BYTE attribute)', [...v].join(',') === '18,52,86,255,255,0,128,102', [...v].join(','));
}

/* ---------------- food: drawCachedFood's order and size ---------------- */
function recordCtx() {
    const calls = [];
    const ctx = { calls, fillStyle: '', strokeStyle: '', lineWidth: 1, lineCap: 'butt' };
    ['save', 'restore', 'beginPath'].forEach((k) => (ctx[k] = () => { }));
    ctx.arc = (x, y, r) => calls.push({ x, y, r, c: ctx.fillStyle });
    ctx.moveTo = (x, y) => { ctx._m = [x, y]; };
    ctx.lineTo = (x, y) => calls.push({ x, y, r: ctx.lineWidth / 2, c: ctx.strokeStyle });
    ctx.fill = () => { }; ctx.stroke = () => { };
    return ctx;
}
function foodWorld(n, seed) {
    const r = rng(seed), out = [], cols = ['#ff4040', '#40a0ff', '#50dc78', '#ffc828', 'rgb(190, 90, 255)', '#f80', 'teal'];
    for (let i = 0; i < n; i++) out.push({ id: i, x: Math.round((r() - 0.5) * 9000), y: Math.round((r() - 0.5) * 5000), size: 10 + ((r() * 4) | 0), color: cols[(r() * cols.length) | 0], invisible: r() < 0.03 });
    out.push(null);
    return out;
}
{
    const food = foodWorld(3000, 31);
    R.canvasWidth = 1600; R.canvasHeight = 900; R.camX = 120; R.camY = -40; R.scale = 0.4;
    R.isLegendWorldMapDeformationVisible = () => false;
    const box = () => {
        const hw = R.canvasWidth / R.scale / 2 + 200, hh = R.canvasHeight / R.scale / 2 + 200;
        return { minX: R.camX - hw, maxX: R.camX + hw, minY: R.camY - hh, maxY: R.camY + hh };
    };
    const colorInt = (c) => { const v = R._lmGlColorInt(c); return v < 0 ? 0xff0000 : v; };
    for (const rainbow of [true, false]) {
        env.defaultmapsettings.rainbowFood = rainbow;
        const ctx = recordCtx();
        R.drawCachedFood(ctx, food, R.scale);
        const fp = new P.FoodPack();
        const o = Object.assign(box(), { rainbow, foodSize: env.defaultSettings.foodSize, defColor: env.defaultSettings.foodColor || '#FF0000', colorInt });
        const n = fp.pack(food, o);
        let bad = 0, firstBad = -1;
        for (let i = 0; i < Math.max(n, ctx.calls.length); i++) {
            const a = ctx.calls[i];
            const ok = a && i < n && fp.inst[i * 3] === a.x && fp.inst[i * 3 + 1] === a.y && fp.inst[i * 3 + 2] === a.r && fp.col[i] === P.rgba(colorInt(a.c), 1);
            if (!ok) { bad++; if (firstBad < 0) firstBad = i; }
        }
        check('food (' + (rainbow ? 'rainbow' : 'one colour') + '): ' + ctx.calls.length + ' circles in Canvas2D order, position, radius and colour', bad === 0 && n === ctx.calls.length, bad + ' differ from #' + firstBad + ', ' + n + ' vs ' + ctx.calls.length);
        /* the second frame (colour slots already known) gives the same */
        const again = new Float32Array(fp.inst.subarray(0, n * 3));
        fp.pack(food, o);
        check('food (' + (rainbow ? 'rainbow' : 'one colour') + '): the next frame packs the same', fp.n === n && again.every((v, i) => v === fp.inst[i]));
    }
}

console.log(failed ? 'FAILED: ' + failed : 'ALL PASSED');
process.exit(failed ? 1 : 0);
