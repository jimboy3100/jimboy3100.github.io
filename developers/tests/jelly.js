/* Jelly physics collision index (ogario/wasm_quadtree.js) and the jelly frame passes in
 * ogario/ogario.v4.js (LM.prepareJellyCells, LM.updateQuadtree, Cell.movePoints):
 * - the point grid answers every collision question exactly like a brute-force scan
 *   (float32 boxes like quadtree.wasm, current-position distance, other cells only),
 *   also with more than 32768 points and more than 4096 points in one query box, where
 *   quadtree.wasm silently dropped points / results;
 * - whole frames give bit-identical points to the previous code (the quadtree.wasm wrapper
 *   with the generic some(box, test) path, and the code of 5583d10f from git when available)
 *   on the same seeded scene;
 * - cells that are not drawn (invisible multibox copies, hideSmallBots) get no physics.
 * Uses developers/tests/bench-dense.js as the loader. Usage: node developers/tests/jelly.js */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const B = require('./bench-dense.js');

const root = path.join(__dirname, '..', '..');
let failed = 0;
function check(name, ok, extra) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra ? '  (' + extra + ')' : ''));
    if (!ok) failed++;
}
const f32 = Math.fround;

/* ---- the previous glue for quadtree.wasm (3.601), kept here as the reference ---- */
async function makeOldWasmIndex(noResultLimit) {
    const bytes = fs.readFileSync(path.join(root, 'wasm', 'quadtree.wasm'));
    const env = { memory: new WebAssembly.Memory({ initial: 32 }) };
    const wasi = { proc_exit() { }, fd_close() { return 0; }, fd_write() { return 0; }, fd_seek() { return 0; } };
    const inst = (await WebAssembly.instantiate(bytes, { env: env, wasi_snapshot_preview1: wasi })).instance;
    const ex = inst.exports, memory = ex.memory || env.memory;
    const BULK = 32768, MAXR = 4096;
    const resultPtr = ex.get_result_buf();
    const bulkPtr = memory.buffer.byteLength - BULK * 12;
    const refs = [];
    const idx = {
        ready: true,
        rebuild(x, y, w, h, cells) {
            ex.qt_init(x, y, w, h);
            refs.length = 0;
            const fv = new Float32Array(memory.buffer, bulkPtr, BULK * 3);
            let count = 0;
            for (let i = 0; i < cells.length && count < BULK; i++) {
                const cell = cells[i];
                if (!cell || cell.removed || cell.isFood || !cell.points || cell.points.length < 3) continue;
                const pts = cell.points;
                for (let n = 0; n < pts.length && count < BULK; n++) {
                    const pt = pts[n];
                    if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) continue;
                    pt.parent = cell;
                    fv[count * 3] = pt.x; fv[count * 3 + 1] = pt.y; fv[count * 3 + 2] = count;
                    refs.push(pt);
                    count++;
                }
            }
            if (count > 0) ex.qt_bulk_insert(bulkPtr, count);
            return true;
        },
        some(aabb, test) {
            let count = ex.qt_query(aabb.x, aabb.y, aabb.w, aabb.h);
            if (count === 0) return false;
            const rv = new Int32Array(memory.buffer, resultPtr, MAXR);
            if (count >= MAXR && noResultLimit) {
                /* complete answer: scan every indexed point (as qt_query would without its limit) */
                const ax = Math.fround(aabb.x), ay = Math.fround(aabb.y), axe = Math.fround(ax + Math.fround(aabb.w)), aye = Math.fround(ay + Math.fround(aabb.h));
                const fv = new Float32Array(memory.buffer, bulkPtr, BULK * 3);
                for (let i = 0; i < refs.length; i++) {
                    const x = fv[i * 3], y = fv[i * 3 + 1];
                    if (x >= ax && x <= axe && y >= ay && y <= aye && test(refs[i])) return true;
                }
                return false;
            }
            if (count > MAXR) count = MAXR;
            for (let i = 0; i < count; i++) {
                const id = rv[i];
                if (id >= 0 && id < refs.length && test(refs[id])) return true;
            }
            return false;
        },
        stats() { return { points: ex.qt_point_count() }; },
        init() { return Promise.resolve(); }
    };
    return idx;
}

/* ---- brute force reference over what a complete index holds ---- */
function viewBox(J) {
    const d = J.drawRender, LM = J.LM;
    const w = d.canvasWidth / d.scale, h = d.canvasHeight / d.scale;
    return { x: LM.viewX - w / 2, y: LM.viewY - h / 2, w: w, h: h };
}
function snapshot(J, cells) {
    const v = viewBox(J);
    const x0 = f32(v.x), y0 = f32(v.y), x1 = f32(x0 + f32(v.w)), y1 = f32(y0 + f32(v.h));
    const snap = [];
    for (const c of cells) {
        if (!c || c.removed || c.isFood || !c.points || c.points.length < 3) continue;
        for (const p of c.points) {
            if (!isFinite(p.x) || !isFinite(p.y)) continue;
            const fx = f32(p.x), fy = f32(p.y);
            if (fx < x0 || fx > x1 || fy < y0 || fy > y1) continue;
            snap.push({ fx: fx, fy: fy, cell: c, p: p });
        }
    }
    /* sorted by x so the reference scan below can start at the box (a plain scan of every
     * point for every question took minutes with 70k points) */
    snap.sort((a, b) => a.fx - b.fx);
    return snap;
}
/* Reference answer: every indexed point with x in the box, in x order. */
function bruteTouches(snap, x, y, self) {
    const ax = f32(x - 5), ay = f32(y - 5), axe = f32(ax + 10), aye = f32(ay + 10);
    let lo = 0, hi = snap.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (snap[m].fx < ax) lo = m + 1; else hi = m; }
    for (let i = lo; i < snap.length && snap[i].fx <= axe; i++) {
        const s = snap[i];
        if (s.cell === self) continue;
        if (s.fx < ax || s.fx > axe || s.fy < ay || s.fy > aye) continue;
        const dx = s.p.x - x, dy = s.p.y - y;
        if (dx * dx + dy * dy <= 25) return true;
    }
    return false;
}

function body(J, id, x, y, size, isVirus) {
    const c = new J.Cell();
    c.id = id; c.x = x; c.y = y; c.size = size; c.isVirus = !!isVirus; c.isFood = false;
    c.removed = false; c.invisible = false; c.points = []; c.pointsVel = []; c.maxPointRad = 0;
    return c;
}
/* Give a cell n points on its circle (as movePoints leaves them) without running physics. */
function ring(c, n, jitter, rng) {
    c.points = []; c.pointsVel = [];
    for (let i = 0; i < n; i++) {
        const a = 2 * Math.PI * i / n, r = c.size + (rng ? (rng() - 0.5) * jitter : 0);
        c.points.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r, rl: r, parent: c });
        c.pointsVel.push(0);
    }
    return c;
}

function compareAll(J, cells, label) {
    J.LM.updateQuadtree(cells);
    const qt = J.LM.quadtree;
    const snap = snapshot(J, cells);
    let n = 0, bad = 0, hits = 0;
    for (const c of cells) {
        const ord = qt.ordOf(c);
        for (const p of c.points) {
            const a = qt.touches(p.x, p.y, ord), b = bruteTouches(snap, p.x, p.y, c);
            n++; if (b) hits++;
            if (a !== b) bad++;
        }
    }
    check(label + ': grid answers = brute force for every point', bad === 0 && n > 0, n + ' questions, ' + hits + ' touching, ' + bad + ' different');
    return { snap, n, hits };
}

/* Run frames of the real jelly passes; returns all point coordinates. */
function runFrames(J, cells, frames, prepare) {
    const scratch = [];
    for (let f = 0; f < frames; f++) {
        B.stepWorld(J, cells);
        J.drawRender._jellyFrameId++;
        const jc = prepare ? prepare(J, scratch) : J.LM.prepareJellyCells(J.LM.cells, scratch);
        if (jc.length) J.LM.updateQuadtree(jc); else J.LM.quadtree = null;
        for (const c of jc) c.movePoints();
    }
    const out = [];
    for (const c of cells) for (const p of c.points) out.push(p.x, p.y, p.rl);
    return out;
}
function maxDiff(a, b) {
    if (a.length !== b.length) return Infinity;
    let m = 0;
    for (let i = 0; i < a.length; i++) { const d = Math.abs(a[i] - b[i]); if (!(d <= m)) m = d; }
    return m;
}

(async function main() {
    /* ---- 1. dense seeded scene: grid = brute force ---- */
    {
        const J = B.loadJelly();
        const cells = B.makeScene(J, 500, 500, 777);
        runFrames(J, cells, 6);
        const jc = J.LM.prepareJellyCells(J.LM.cells, []);
        compareAll(J, jc, '500 bodies after 6 frames');
        /* positions moved after the build (cells already simulated this frame): distance uses
         * the current position, the box the indexed one */
        J.LM.updateQuadtree(jc);
        const built = snapshot(J, jc); /* box positions as indexed */
        /* as movePoints does: beginCell() first, then the points move */
        for (let i = 0; i < jc.length; i += 2) { J.LM.quadtree.beginCell(jc[i]); for (const p of jc[i].points) { p.x += 3; p.y -= 2; } }
        const qt = J.LM.quadtree;
        let bad = 0, n = 0, hits = 0;
        for (const c of jc) {
            const ord = qt.ordOf(c);
            for (const p of c.points) {
                const want = bruteTouches(built, p.x, p.y, c);
                n++; if (want) hits++;
                if (qt.touches(p.x, p.y, ord) !== want) bad++;
            }
        }
        check('points moved after the build: indexed position for the box, current one for the distance', bad === 0, n + ' questions, ' + hits + ' touching');
    }

    /* ---- 2. more than 32768 points ---- */
    {
        const J = B.loadJelly();
        const cells = B.makeScene(J, 2000, 0, 31337);
        runFrames(J, cells, 3);
        const jc = J.LM.prepareJellyCells(J.LM.cells, []);
        let total = 0; for (const c of jc) total += c.points.length;
        const r = compareAll(J, jc, '2000 bodies');
        check('more than 32768 points: all points in view are indexed', total > 32768 && J.LM.quadtree.size === r.snap.length, J.LM.quadtree.size + ' of ' + total + ' points (' + r.snap.length + ' in view)');
        const old = await makeOldWasmIndex();
        old.rebuild(viewBox(J).x, viewBox(J).y, viewBox(J).w, viewBox(J).h, jc);
        check('(quadtree.wasm held at most 32768 of them)', old.stats().points <= 32768, old.stats().points + ' indexed');
        /* points past the first 32768 were no colliders with quadtree.wasm; the grid (checked
         * against brute force above) finds every contact */
        const probe = { x: 0, y: 0, w: 10, h: 10 };
        let lost = 0;
        for (const c of jc) for (const p of c.points) {
            if (!bruteTouches(r.snap, p.x, p.y, c)) continue;
            probe.x = p.x - 5; probe.y = p.y - 5;
            if (!old.some(probe, (it) => it && it.parent !== c && c.sqDist(it, p) <= 25)) lost++;
        }
        check('(quadtree.wasm missed ' + lost + ' of the ' + r.hits + ' touching points)', lost > 0);
    }

    /* ---- 3. more than 4096 points in one query box ---- */
    {
        const J = B.loadJelly();
        B.setCamera(J);
        const rng = B.makeRng(5);
        const self = ring(body(J, 1, 0, 0, 100), 40);
        const probe = self.points[0]; /* at (100, 0) */
        const cells = [self];
        /* 900 tiny cells whose 5 points all sit in the probe box but more than 5 units away,
         * up and left of the probe: quadtree.wasm visits that part of the box first, and its
         * first 4096 results were all decoys */
        let id = 2;
        for (let i = 0; i < 900; i++) {
            const c = body(J, id++, probe.x, probe.y, 4);
            c.points = []; c.pointsVel = [];
            for (let k = 0; k < 5; k++) {
                c.points.push({ x: probe.x - (4 + rng() * 0.9), y: probe.y - (4 + rng() * 0.9), rl: 4, parent: c });
                c.pointsVel.push(0);
            }
            cells.push(c);
        }
        /* one real contact, listed first or last */
        const near = body(J, id++, probe.x + 1, probe.y + 1, 4);
        near.points = []; near.pointsVel = [];
        for (let k = 0; k < 3; k++) { near.points.push({ x: probe.x + 1 + k * 0.1, y: probe.y + 1, rl: 4, parent: near }); near.pointsVel.push(0); }
        const old = await makeOldWasmIndex();
        let oldMissed = 0;
        for (const order of ['last', 'first']) {
            const list = order === 'last' ? cells.concat([near]) : [self, near].concat(cells.slice(1));
            J.LM.updateQuadtree(list);
            const qt = J.LM.quadtree;
            check('more than 4096 points in the box, contact listed ' + order + ': found', qt.touches(probe.x, probe.y, qt.ordOf(self)) === true);
            const box = { x: probe.x - 5, y: probe.y - 5, w: 10, h: 10 };
            /* the decoys, the contact and the probe point itself */
            check('  query() returns all ' + (900 * 5 + 3 + 1) + ' points of the box (no 4096 limit)', qt.query(box).length === 900 * 5 + 3 + 1);
            const v = viewBox(J);
            old.rebuild(v.x, v.y, v.w, v.h, list);
            if (!old.some(box, (it) => it && it.parent !== self && self.sqDist(it, probe) <= 25)) oldMissed++;
        }
        check('(quadtree.wasm missed the contact in ' + oldMissed + ' of 2 orders)', oldMissed >= 1);
        /* without the contact: no false hit from the decoys */
        J.LM.updateQuadtree(cells);
        check('decoys inside the box but farther than 5 units do not touch', J.LM.quadtree.touches(probe.x, probe.y, J.LM.quadtree.ordOf(self)) === false);
    }

    /* ---- 4. coincident cells, the same cell listed twice, own points ---- */
    {
        const J = B.loadJelly();
        B.setCamera(J);
        const a = ring(body(J, 1, 50, 50, 80), 30), b = ring(body(J, 2, 50, 50, 80), 30), lone = ring(body(J, 3, 900, 300, 60), 20);
        J.LM.updateQuadtree([a, b, lone]);
        const qt = J.LM.quadtree;
        check('coincident cells: every point of each touches the other', a.points.every((p) => qt.touches(p.x, p.y, qt.ordOf(a))) && b.points.every((p) => qt.touches(p.x, p.y, qt.ordOf(b))));
        check('a lone cell does not touch itself', lone.points.every((p) => !qt.touches(p.x, p.y, qt.ordOf(lone))));
        J.LM.updateQuadtree([lone, a, lone]);
        const q2 = J.LM.quadtree;
        check('a cell listed twice is still one cell (its points are not foreign to it)', lone.points.every((p) => !q2.touches(p.x, p.y, q2.ordOf(lone))));
        check('a cell not in the index treats all indexed points as foreign', q2.ordOf(b) === -1 && b.points.every((p) => q2.touches(p.x, p.y, -1)));
        compareAll(J, [a, b, lone], 'coincident scene');
        /* points outside the view are not colliders (as before) */
        const out = ring(body(J, 4, 5000, 0, 60), 20), out2 = ring(body(J, 5, 5000, 0, 60), 20);
        J.LM.updateQuadtree([out, out2]);
        check('points outside the viewport box are not indexed', J.LM.quadtree.size === 0 && !J.LM.quadtree.touches(out.points[0].x, out.points[0].y, J.LM.quadtree.ordOf(out)));
        /* non-finite points are skipped and never touch */
        const nan = ring(body(J, 6, 50, 50, 80), 30);
        nan.points[3].x = NaN; nan.points[4].y = Infinity;
        J.LM.updateQuadtree([a, nan]);
        check('non-finite points: not indexed, their questions answer false', J.LM.quadtree.size === 58 && !J.LM.quadtree.touches(NaN, 0, -1) && !J.LM.quadtree.touches(Infinity, 0, -1));
    }

    /* ---- 5. some() / query() complete for random boxes (small and large) ---- */
    {
        const J = B.loadJelly();
        const cells = B.makeScene(J, 300, 0, 99);
        runFrames(J, cells, 2);
        const jc = J.LM.prepareJellyCells(J.LM.cells, []);
        J.LM.updateQuadtree(jc);
        const qt = J.LM.quadtree, snap = snapshot(J, jc);
        const rng = B.makeRng(3);
        let bad = 0;
        for (let i = 0; i < 300; i++) {
            const big = i % 3 === 0;
            const box = { x: (rng() - 0.6) * 5000, y: (rng() - 0.6) * 3000, w: big ? rng() * 4000 : rng() * 40, h: big ? rng() * 3000 : rng() * 40 };
            const ax = f32(box.x), ay = f32(box.y), axe = f32(ax + f32(box.w)), aye = f32(ay + f32(box.h));
            const want = snap.filter((s) => s.fx >= ax && s.fx <= axe && s.fy >= ay && s.fy <= aye).length;
            if (qt.query(box).length !== want) bad++;
            const someWant = want > 0;
            if (qt.some(box, () => true) !== someWant) bad++;
        }
        check('query()/some() return exactly the points in 300 random boxes', bad === 0);
    }

    /* ---- 6. whole frames: same points as the previous code ---- */
    {
        const frames = 25;
        const scene = (J) => B.makeScene(J, 500, 300, 2024);
        const Jn = B.loadJelly(); Jn.setRandomSeed(11);
        const a = runFrames(Jn, scene(Jn), frames);
        /* The same code with quadtree.wasm as the index: it has no touches(), so movePoints
         * takes the generic some(box, test) path. Its result limit is lifted for this (a broad
         * box can hold more than 4096 points), so this compares the grid path with the
         * generic path on a complete index. */
        const Jo = B.loadJelly(); Jo.setRandomSeed(11);
        const oldIdx = await makeOldWasmIndex(true);
        const cellsO = scene(Jo);
        Jo.LM.updateQuadtree = function (cells) {
            const v = viewBox(Jo);
            oldIdx.rebuild(v.x, v.y, v.w, v.h, cells);
            this.quadtree = oldIdx;
        };
        const b = runFrames(Jo, cellsO, frames);
        const d = maxDiff(a, b);
        check('25 frames, 500 bodies: same points as with quadtree.wasm and the generic path', d === 0, a.length / 3 + ' points, max difference ' + d);

        /* the previous version of the code itself, from git */
        let oldSrc = null, oldQt = null;
        try {
            oldSrc = cp.execFileSync('git', ['-C', root, 'show', '5583d10f:ogario/ogario.v4.js'], { maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
            oldQt = cp.execFileSync('git', ['-C', root, 'show', '5583d10f:ogario/wasm_quadtree.js'], { maxBuffer: 8 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
        } catch (e) { oldSrc = null; }
        if (oldSrc) {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-jelly-'));
            const fo = path.join(dir, 'ogario.v4.js'), fq = path.join(dir, 'wasm_quadtree.js');
            fs.writeFileSync(fo, oldSrc); fs.writeFileSync(fq, oldQt);
            try {
                const Jg = B.loadJelly({ src: fo, qt: fq });
                await Jg.initWasm();
                Jg.setRandomSeed(11);
                const g = runFrames(Jg, scene(Jg), frames, (J, out) => B.prepareInline(J.LM, out));
                const dg = maxDiff(a, g);
                check('25 frames, 500 bodies: same points as the code of 5583d10f (quadtree.wasm)', dg === 0, 'max difference ' + dg);
                /* and with the JS PointQuadTree fallback of both versions */
                const Jg2 = B.loadJelly({ src: fo, qt: fq }); Jg2.setEngine('js'); Jg2.setRandomSeed(11);
                const g2 = runFrames(Jg2, scene(Jg2), 10, (J, out) => B.prepareInline(J.LM, out));
                const Jn2 = B.loadJelly(); Jn2.setEngine('js'); Jn2.setRandomSeed(11);
                const n2 = runFrames(Jn2, scene(Jn2), 10);
                check('10 frames with the JS PointQuadTree fallback: same points as 5583d10f', maxDiff(g2, n2) === 0, 'max difference ' + maxDiff(g2, n2));
            } finally {
                try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { }
            }
        } else {
            console.log('skip 5583d10f comparison (git history not available)');
        }
    }

    /* ---- 7. cells that are not drawn get no physics ---- */
    {
        const J = B.loadJelly();
        const cells = B.makeScene(J, 200, 50, 4);
        runFrames(J, cells, 3);
        const hidden = cells.filter((c) => !c.isFood && c.isInView()).slice(0, 10);
        hidden.forEach((c) => (c.invisible = true));
        const small = cells.find((c) => !c.isFood && !c.invisible && c.size <= 36 && c.isInView());
        const jc = J.LM.prepareJellyCells(J.LM.cells, []);
        check('invisible cells are not prepared and their points are dropped', hidden.every((c) => jc.indexOf(c) < 0 && c.points.length === 0 && c.pointsVel.length === 0));
        const inline = B.prepareInline(J.LM, []).filter((c) => !c.invisible);
        check('the other cells are the ones the previous inline pass prepared', inline.length === jc.length && inline.every((c, i) => c === jc[i]));
        J.LM.updateQuadtree(jc);
        check('hidden cells are no colliders', hidden.every((c) => J.LM.quadtree.ordOf(c) === -1));
        if (small) {
            J.LM.hideSmallBots = true;
            const jc2 = J.LM.prepareJellyCells(J.LM.cells, []);
            check('hideSmallBots: cells of size <= 36 are not prepared', jc2.indexOf(small) < 0 && jc2.every((c) => c.size > 36));
            J.LM.hideSmallBots = false;
        } else check('scene has a small bot to hide', false);
        hidden.forEach((c) => (c.invisible = false));
        const jc3 = J.LM.prepareJellyCells(J.LM.cells, []);
        const c0 = hidden[0];
        check('shown again: a fresh round perimeter at the current size', jc3.indexOf(c0) >= 0 && c0.points.length >= 5 && c0.points.every((p) => p.rl === c0.size && p.x === c0.x && p.y === c0.y));
        J.LM.updateQuadtree(jc3);
        c0.movePoints();
        check('  and it moves normally on the next frame', c0.points.every((p) => isFinite(p.x) && Math.abs(Math.hypot(p.x - c0.x, p.y - c0.y) - c0.size) < 3));
    }

    if (failed) {
        console.log(failed + ' check(s) failed');
        process.exit(1);
    }
    console.log('all jelly physics checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
