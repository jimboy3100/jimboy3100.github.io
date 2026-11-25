/* Dense-scene jelly physics benchmark and harness.
 *
 * Loads the real jelly code from ogario/ogario.v4.js (Cell.updateNumPoints / sqDist /
 * movePoints / isInView, LM.updateQuadtree, the jelly frame preparation when it is a function)
 * and ogario/wasm_quadtree.js with wasm/quadtree.wasm into a vm, builds a seeded synthetic
 * world and times each phase of one jelly frame:
 *   prepare   point preparation (visibility + updateNumPoints, as the frame loop does it)
 *   build     collision index build (LM.updateQuadtree)
 *   queries   the broad + per-point collision queries of every cell, on their own (no changes)
 *   move      movePoints() of every cell (includes its own queries)
 *   geometry  triangle-fan vertex fill from the final points (stand-in for the GPU upload copy)
 *
 * Usage:
 *   node developers/tests/bench-dense.js            quick self-check (small scene, a few frames)
 *   node developers/tests/bench-dense.js --bench    full table: 100/500/1000/2000 bodies x 2k/10k food
 *     --frames N      measured frames per scene (default 40, plus 8 warm-up frames)
 *     --bodies a,b    body counts (default 100,500,1000,2000)
 *     --food a,b      food counts (default 2000,10000)
 *     --engine wasm|js|both   collision index: the WASM module, the JS fallback, or both (default wasm)
 *     --src FILE      another copy of ogario.v4.js (for example an older version from git)
 *     --qt FILE       another copy of wasm_quadtree.js
 *     --json          also print the results as JSON
 * Also used as a library by developers/tests/jelly.js (require: nothing runs). */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');

function sliceBetween(src, from, to) {
    const a = src.indexOf(from);
    if (a < 0) throw new Error('not found in ogario.v4.js: ' + from);
    const b = src.indexOf(to, a + from.length);
    if (b < 0) throw new Error('not found in ogario.v4.js: ' + to);
    return src.slice(a, b);
}

/* Park-Miller style LCG: deterministic and the same on every machine. */
function makeRng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
        s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

/* Load the jelly code into a fresh vm context. Returns an object with the context, the Cell
 * constructor, LM, a helper to run one frame by phases and initWasm() (async). */
function loadJelly(opts) {
    opts = opts || {};
    const src = fs.readFileSync(opts.src || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
    const qtSrc = fs.readFileSync(opts.qt || path.join(root, 'ogario', 'wasm_quadtree.js'), 'utf8').replace(/\r\n/g, '\n');
    const pqtSrc = fs.readFileSync(path.join(root, 'ogario', 'quadtree.js'), 'utf8');
    const wasmBytes = fs.readFileSync(path.join(root, 'wasm', 'quadtree.wasm'));

    const cellBody = sliceBetween(src, '        this.updateNumPoints = function () {', '        this.update = function (x, y, mass, isVirus, isPlayer, nick) {') +
        sliceBetween(src, '        this.isInView = function () {', '        this.isInV = function () {');
    /* The frame's preparation pass, when the source has it as an LM function (it sits just
     * before updateQuadtree). */
    const hasPrepare = src.indexOf('        prepareJellyCells: function (') >= 0;
    const lmBody = sliceBetween(src, hasPrepare ? '        prepareJellyCells: function (' : '        updateQuadtree: function (', '        isFreeSpectate: false,');

    /* Plain function scope, not a vm context: global lookups through a vm context are many
     * times slower and would distort the timings. The slices see these names as their globals. */
    const env = {
        window: {},
        console: console,
        performance: { now: () => Number(process.hrtime.bigint()) / 1e6 },
        fetch: async function () {
            return { ok: true, status: 200, arrayBuffer: async () => wasmBytes.buffer.slice(wasmBytes.byteOffset, wasmBytes.byteOffset + wasmBytes.byteLength) };
        },
        rng: makeRng(opts.physicsSeed || 7),
        Math: Object.create(Math)
    };
    env.Math.random = function () { return env.rng(); };
    const factory = new Function('env',
        'var window = env.window, console = env.console, performance = env.performance, fetch = env.fetch, Math = env.Math;\n' +
        'var drawRender = { scale: 0.35, canvasWidth: 1920, canvasHeight: 1080, _jellyFrameId: 0 };\n' +
        'var defaultSettings = { virusSpikesSize: 6 };\n' +
        'var defaultmapsettings = { jellyPhisycs: true };\n' +
        'var LM_UNIT_ID_STEP = 1e9;\n' +
        'function lmMultiboxIdMaster() { return false; }\n' +
        pqtSrc + '\n' + qtSrc + '\n' +
        'var LM = ({ quadtree: null,\n' + lmBody + '});\n' +
        'LM.cells = []; LM.viewX = 0; LM.viewY = 0; LM.camMinX = 0; LM.camMinY = 0; LM.camMaxX = 0; LM.camMaxY = 0; LM.hideSmallBots = false;\n' +
        'function Cell() {\n' + cellBody + '}\n' +
        'return { LM: LM, Cell: Cell, drawRender: drawRender, defaultmapsettings: defaultmapsettings,\n' +
        '  getQT: function () { return WasmQuadTree; }, setQT: function (v) { WasmQuadTree = v; } };');
    const scope = factory(env);
    const wasmRef = scope.getQT();

    const api = {
        env: env,
        window: env.window,
        LM: scope.LM,
        Cell: scope.Cell,
        drawRender: scope.drawRender,
        defaultmapsettings: scope.defaultmapsettings,
        WasmQuadTree: wasmRef,
        hasPrepare: hasPrepare,
        initWasm: async function () {
            const log = console.log;
            console.log = function () { };
            try { await wasmRef.init(); } finally { console.log = log; }
            return wasmRef.ready;
        },
        /* 'wasm' uses the module when it loaded; 'js' hides it so the JS fallback runs. */
        setEngine: function (engine) { scope.setQT(engine === 'js' ? undefined : wasmRef); },
        setRandomSeed: function (seed) { env.rng = makeRng(seed); }
    };
    return api;
}

/* Viewport of the scene: 1920x1080 canvas at scale 0.35 around (0, 0). */
function setCamera(J) {
    const LM = J.LM, d = J.drawRender;
    const w = d.canvasWidth / d.scale, h = d.canvasHeight / d.scale;
    LM.viewX = 0; LM.viewY = 0;
    LM.camMinX = -w / 2; LM.camMaxX = w / 2; LM.camMinY = -h / 2; LM.camMaxY = h / 2;
    return { w: w, h: h };
}

/* Seeded synthetic world: non-food bodies (viruses, clusters of overlapping cells, groups of
 * coincident cells at the same place, a few off screen) plus food. */
function makeScene(J, nBodies, nFood, seed, extra) {
    extra = extra || {};
    const rng = makeRng(seed || 12345);
    const view = setCamera(J);
    const cells = [];
    let id = 1;
    function body(x, y, size, isVirus) {
        const c = new J.Cell();
        c.id = id++; c.x = x; c.y = y; c.size = size; c.isVirus = !!isVirus; c.isFood = false;
        c.removed = false; c.invisible = false; c.points = []; c.pointsVel = []; c.maxPointRad = 0;
        c.vx = (rng() - 0.5) * 6; c.vy = (rng() - 0.5) * 6;
        cells.push(c);
        return c;
    }
    const hw = view.w / 2, hh = view.h / 2;
    const clusters = [];
    for (let k = 0; k < 8; k++) clusters.push([(rng() - 0.5) * view.w * 0.8, (rng() - 0.5) * view.h * 0.8]);
    function size() {
        const r = rng();
        if (r < 0.7) return 30 + rng() * 50;
        if (r < 0.95) return 80 + rng() * 170;
        return 250 + rng() * 450;
    }
    let made = 0;
    while (made < nBodies) {
        const r = rng();
        if (r < 0.08) { body((rng() - 0.5) * view.w, (rng() - 0.5) * view.h, 100, true); made++; }
        else if (r < 0.38) {
            const cl = clusters[(rng() * clusters.length) | 0];
            body(cl[0] + (rng() - 0.5) * 800, cl[1] + (rng() - 0.5) * 800, size(), false); made++;
        } else if (r < 0.46) {
            /* coincident group: same place and size (split pieces, multibox copies) */
            const x = (rng() - 0.5) * view.w, y = (rng() - 0.5) * view.h, s = size();
            const n = 2 + ((rng() * 3) | 0);
            for (let k = 0; k < n && made < nBodies; k++) { const c = body(x, y, s, false); c.vx = cells[cells.length - 1 - k] ? cells[cells.length - 1 - k].vx : 0; c.vy = 0; made++; }
        } else if (r < 0.52) {
            /* off screen */
            const side = rng() < 0.5 ? -1 : 1;
            body(side * (hw + 600 + rng() * 2000), (rng() - 0.5) * view.h, size(), false); made++;
        } else { body((rng() - 0.5) * view.w * 1.05, (rng() - 0.5) * view.h * 1.05, size(), false); made++; }
    }
    if (extra.hiddenEvery) {
        for (let i = 0; i < cells.length; i += extra.hiddenEvery) cells[i].invisible = true;
    }
    for (let f = 0; f < nFood; f++) {
        const c = new J.Cell();
        c.id = id++; c.x = (rng() - 0.5) * view.w * 1.4; c.y = (rng() - 0.5) * view.h * 1.4; c.size = 10 + rng() * 4;
        c.isFood = true; c.isVirus = false; c.removed = false; c.invisible = false; c.points = []; c.pointsVel = []; c.vx = 0; c.vy = 0;
        cells.push(c);
    }
    J.LM.cells = cells;
    return cells;
}

/* Move bodies a little each frame (bounce inside a box a bit bigger than the view). */
function stepWorld(J, cells) {
    const LM = J.LM;
    const bx = (LM.camMaxX - LM.camMinX) * 0.8, by = (LM.camMaxY - LM.camMinY) * 0.8;
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (c.isFood) continue;
        c.x += c.vx; c.y += c.vy;
        if (c.x > bx || c.x < -bx) c.vx = -c.vx;
        if (c.y > by || c.y < -by) c.vy = -c.vy;
    }
}

/* The frame loop's preparation pass as it was inline in the render function (used when the
 * source has no LM.prepareJellyCells). */
function prepareInline(LM, out) {
    out.length = 0;
    for (let i = 0; i < LM.cells.length; i++) {
        const c = LM.cells[i];
        if (!c || c.removed || c.isFood || typeof c.updateNumPoints !== 'function') continue;
        let inView = true;
        if (typeof c.isInView === 'function') { try { inView = c.isInView(); } catch (e) { inView = true; } }
        if (!inView) continue;
        c.updateNumPoints();
        if (c.points && c.points.length >= 3 && c.pointsVel && c.pointsVel.length === c.points.length) out.push(c);
    }
    return out;
}

/* Broad + per-point queries of every cell without changing anything (what movePoints asks):
 * one broad query per cell, then one question per point. */
function queriesOnly(LM, cells, counts) {
    const qt = LM.quadtree;
    if (!qt) return;
    const probe = { x: 0, y: 0, w: 10, h: 10 };
    const grid = typeof qt.touches === 'function';
    for (let ci = 0; ci < cells.length; ci++) {
        const self = cells[ci], pts = self.points, len = pts.length;
        const step = len;
        const ord = grid ? qt.ordOf(self) : -1;
        for (let a = 0; a < len; a += step) {
            const end = Math.min(a + step, len);
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = a; i < end; i++) {
                const p = pts[i];
                if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
            }
            let broadHit;
            if (grid) broadHit = qt.anyForeign(minX - 6, minY - 6, maxX - minX + 12, maxY - minY + 12, ord);
            else {
                probe.x = minX - 6; probe.y = minY - 6; probe.w = maxX - minX + 12; probe.h = maxY - minY + 12;
                broadHit = qt.some(probe, (it) => !!it && it.parent !== self);
                probe.w = 10; probe.h = 10;
            }
            counts.broad++;
            if (!broadHit) { counts.skipped++; continue; }
            for (let i = a; i < end; i++) {
                const p = pts[i];
                let hit;
                if (grid) hit = qt.touches(p.x, p.y, ord);
                else {
                    probe.x = p.x - 5; probe.y = p.y - 5;
                    hit = qt.some(probe, (it) => it && it.parent !== self && self.sqDist(it, p) <= 25);
                }
                counts.narrow++;
                if (hit) counts.hits++;
            }
        }
    }
}

/* Triangle-fan fill: centre, every point, first point again (2 floats per vertex). */
let fanBuf = new Float32Array(1 << 16);
function geometryFill(cells) {
    let need = 0;
    for (let i = 0; i < cells.length; i++) need += (cells[i].points.length + 2) * 2;
    if (fanBuf.length < need) fanBuf = new Float32Array(need * 2);
    let o = 0;
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i], pts = c.points;
        fanBuf[o++] = c.x; fanBuf[o++] = c.y;
        for (let k = 0; k < pts.length; k++) { fanBuf[o++] = pts[k].x; fanBuf[o++] = pts[k].y; }
        fanBuf[o++] = pts[0].x; fanBuf[o++] = pts[0].y;
    }
    return o;
}

function now() { return Number(process.hrtime.bigint()) / 1e6; }

/* One jelly frame by phases. Returns per-phase milliseconds. */
function runFrame(J, scratch, withQueries) {
    const LM = J.LM;
    J.drawRender._jellyFrameId++;
    const t0 = now();
    const jc = J.hasPrepare ? LM.prepareJellyCells(LM.cells, scratch) : prepareInline(LM, scratch);
    const t1 = now();
    if (jc.length) LM.updateQuadtree(jc); else LM.quadtree = null;
    const t2 = now();
    const counts = { broad: 0, skipped: 0, narrow: 0, hits: 0 };
    if (withQueries) queriesOnly(LM, jc, counts);
    const t3 = now();
    for (let i = 0; i < jc.length; i++) jc[i].movePoints();
    const t4 = now();
    geometryFill(jc);
    const t5 = now();
    let pts = 0;
    for (let i = 0; i < jc.length; i++) pts += jc[i].points.length;
    return { prepare: t1 - t0, build: t2 - t1, queries: t3 - t2, move: t4 - t3, geometry: t5 - t4, cells: jc.length, points: pts, counts: counts };
}

function pct(a, p) {
    const s = a.slice().sort((x, y) => x - y);
    if (!s.length) return 0;
    const i = (s.length - 1) * p / 100, lo = Math.floor(i), hi = Math.ceil(i);
    return s[lo] + (s[hi] - s[lo]) * (i - lo);
}

/* Points of the prepared cells inside the viewport box (float32 compare, as the index does):
 * what a complete index holds. */
function insidePoints(J, cells) {
    const d = J.drawRender, LM = J.LM, f = Math.fround;
    const w = d.canvasWidth / d.scale, h = d.canvasHeight / d.scale;
    const x0 = f(LM.viewX - w / 2), y0 = f(LM.viewY - h / 2), x1 = f(x0 + f(w)), y1 = f(y0 + f(h));
    let n = 0;
    for (const c of cells) for (const p of c.points) {
        const x = f(p.x), y = f(p.y);
        if (isFinite(p.x) && isFinite(p.y) && x >= x0 && x <= x1 && y >= y0 && y <= y1) n++;
    }
    return n;
}

function indexedPoints(J) {
    const qt = J.LM.quadtree;
    if (!qt) return 0;
    if (typeof qt.size === 'number') return qt.size;
    if (qt === J.LM._wasmQuadtreeWrapper) return J.WasmQuadTree.stats().points;
    /* JS PointQuadTree: count by walking */
    let n = 0;
    (function walk(node) { if (!node) return; if (node.children) node.children.forEach(walk); else n += node.points.length; })(qt.root);
    return n;
}

async function benchScene(J, nBodies, nFood, frames, warm) {
    J.setRandomSeed(99);
    const cells = makeScene(J, nBodies, nFood, 4242 + nBodies);
    const scratch = [];
    const keys = ['prepare', 'build', 'queries', 'move', 'geometry'];
    const acc = {}; keys.forEach((k) => (acc[k] = []));
    acc.total = [];
    let last = null;
    for (let f = 0; f < warm + frames; f++) {
        stepWorld(J, cells);
        const r = runFrame(J, scratch, true);
        if (f >= warm) {
            keys.forEach((k) => acc[k].push(r[k]));
            acc.total.push(r.prepare + r.build + r.move + r.geometry);
        }
        last = r;
    }
    const out = { bodies: nBodies, food: nFood, cells: last.cells, points: last.points, inside: insidePoints(J, scratch), indexed: indexedPoints(J), counts: last.counts };
    keys.concat(['total']).forEach((k) => { out[k] = { p50: pct(acc[k], 50), p95: pct(acc[k], 95) }; });
    return out;
}

function fmt(x) { return x.p50.toFixed(2) + '/' + x.p95.toFixed(2); }

async function main() {
    const args = process.argv.slice(2);
    const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
    const J = loadJelly({ src: opt('--src', null), qt: opt('--qt', null) });
    const wasmOk = await J.initWasm();
    if (args.indexOf('--bench') < 0) {
        /* quick self-check: the harness loads the real code and a small dense frame runs */
        let fail = 0;
        const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
        check('the collision index (WasmQuadTree) is ready in the harness', wasmOk === true);
        J.setEngine('wasm');
        const r = await benchScene(J, 100, 200, 3, 2);
        check('100-body frame prepares cells with points', r.cells > 50 && r.points > r.cells * 5);
        check('every prepared point inside the view is indexed', r.indexed === r.inside && r.inside > r.points * 0.5);
        check('phases are timed', isFinite(r.total.p50) && r.total.p50 >= 0);
        if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
        console.log('bench-dense quick check ok (run with --bench for the full table)');
        return;
    }
    const frames = parseInt(opt('--frames', '40'), 10);
    const bodies = opt('--bodies', '100,500,1000,2000').split(',').map(Number);
    const foods = opt('--food', '2000,10000').split(',').map(Number);
    const engArg = opt('--engine', 'wasm');
    const engines = engArg === 'both' ? ['wasm', 'js'] : [engArg];
    const rows = [];
    console.log('jelly dense-scene benchmark, ms p50/p95 per frame, ' + frames + ' frames (+8 warm-up)' + (wasmOk ? '' : ' [quadtree.wasm did not load]'));
    console.log('engine bodies  food  cells points indexed/in view | prepare     build       queries     move        geometry    | total (no queries)');
    for (const eng of engines) {
        J.setEngine(eng);
        for (const b of bodies) for (const fd of foods) {
            const r = await benchScene(J, b, fd, frames, 8);
            r.engine = eng;
            rows.push(r);
            console.log([eng.padEnd(6), String(b).padStart(6), String(fd).padStart(5), String(r.cells).padStart(6), String(r.points).padStart(6), (r.indexed + '/' + r.inside).padStart(13), '|',
                fmt(r.prepare).padEnd(11), fmt(r.build).padEnd(11), fmt(r.queries).padEnd(11), fmt(r.move).padEnd(11), fmt(r.geometry).padEnd(11), '|', fmt(r.total)].join(' '));
        }
    }
    if (args.indexOf('--json') >= 0) console.log(JSON.stringify(rows));
}

module.exports = { loadJelly, makeScene, stepWorld, runFrame, prepareInline, makeRng, setCamera, indexedPoints, insidePoints, sliceBetween };

if (require.main === module) {
    main().catch((e) => { console.error(e); process.exit(1); });
}
