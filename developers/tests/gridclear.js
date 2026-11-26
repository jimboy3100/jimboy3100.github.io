/* Jelly point grid lifecycle (ogario/wasm_quadtree.js, LM.clearJellyIndex in ogario/ogario.v4.js):
 * the grid is one global object holding the points it indexed (and through point.parent their
 * cells). Checks that after a dense scene it lets them go and resets its stats when
 * - the next jelly frame is empty (LM.updateQuadtree with no cells),
 * - the world is flushed (the real LM.flushCellsData, ClearAll packet and connection change),
 * - a build throws half way and the JS fallback takes over,
 * - the tab is hidden,
 * and that the renderFrame jelly branches go through LM.clearJellyIndex().
 * Release is checked with WeakRefs and a forced GC; a control shows the check sees retention.
 * Usage: node developers/tests/gridclear.js */
'use strict';
const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const vm = require('vm');
const B = require('./bench-dense.js');

v8.setFlagsFromString('--expose-gc');
const gc = vm.runInNewContext('gc');

const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
function check(name, ok, extra) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra ? '  (' + extra + ')' : ''));
    if (!ok) failed++;
}
const tick = () => new Promise((r) => setTimeout(r, 0));
/* WeakRef targets stay alive until the current job ends: wait a turn, then collect. */
async function aliveCount(weak) {
    await tick();
    gc();
    await tick();
    gc();
    let n = 0;
    for (const w of weak) if (w.deref() !== undefined) n++;
    return n;
}

/* A dense scene built into the grid. Only WeakRefs to its cells and points leave this
 * function; LM.cells and the frame list are emptied again. */
function denseFrame(J, scratch, seed) {
    const cells = B.makeScene(J, 500, 0, seed);
    J.drawRender._jellyFrameId++;
    const jc = J.LM.prepareJellyCells(J.LM.cells, scratch);
    J.LM.updateQuadtree(jc);
    const weak = [];
    for (let i = 0; i < jc.length; i += 7) { weak.push(new WeakRef(jc[i])); weak.push(new WeakRef(jc[i].points[0])); }
    const probe = jc[0];
    const st = J.WasmQuadTree.stats();
    const info = { cells: jc.length, points: st.points, gridCells: st.cells, nodes: st.nodes, ordBefore: J.WasmQuadTree.ordOf(probe), probe: new WeakRef(probe) };
    cells.length = 0;
    J.LM.cells = [];
    return { weak: weak, info: info };
}
function statsZero(J) {
    const st = J.WasmQuadTree.stats();
    return st.points === 0 && st.cells === 0 && st.nodes === 0 && J.WasmQuadTree.size === 0;
}

/* The real LM.flushCellsData method, run on the harness LM. */
function attachFlush(J) {
    const a = src.indexOf('        flushCellsData(preserveMapGeometry) {');
    const b = src.indexOf('        /* Spectator toggles', a);
    if (a < 0 || b < 0) throw new Error('flushCellsData not found in ogario.v4.js');
    const win = {};
    /* the page-level setter of the controlled multibox unit (ogario.v4.js lmSetMbUnit) */
    const holder = new Function('LM', 'drawRender', 'spects', 'window', 'lmSetMbUnit', 'return {\n' + src.slice(a, b) + '};')(J.LM, J.drawRender, [], win, (u) => { win.multiboxPlayerEnabled = +u || null; });
    J.LM.flushCellsData = holder.flushCellsData;
    J.LM.flushSpecsData = function () { };
}

(async function main() {
    /* ---- 1. dense -> empty frame ---- */
    {
        const J = B.loadJelly();
        await J.initWasm();
        const scratch = [];
        const s = denseFrame(J, scratch, 101);
        check('dense scene is indexed', s.info.points > 10000 && s.info.gridCells > 300 && s.info.ordBefore === 0, s.info.cells + ' cells, ' + s.info.points + ' points');
        scratch.length = 0;
        /* control: nothing but the grid holds the scene now, and the GC check sees that */
        const held = await aliveCount(s.weak);
        check('control: the built grid alone keeps the scene alive', held === s.weak.length, held + '/' + s.weak.length + ' alive');
        const abBefore = process.memoryUsage().arrayBuffers;
        J.LM.updateQuadtree([]);
        check('empty frame: LM.quadtree is null', J.LM.quadtree === null);
        check('empty frame: grid stats reset (points, cells, buckets)', statsZero(J), JSON.stringify(J.WasmQuadTree.stats()));
        const left = await aliveCount(s.weak);
        check('empty frame: every point and cell of the dense scene is released', left === 0 && s.info.probe.deref() === undefined, left + '/' + s.weak.length + ' alive');
        const abAfter = process.memoryUsage().arrayBuffers;
        check('empty frame: the typed buffers are kept for the next build', abAfter >= abBefore * 0.9, (abBefore / 1e6).toFixed(2) + ' MB -> ' + (abAfter / 1e6).toFixed(2) + ' MB');
        /* the next scene builds and answers again */
        const s2 = denseFrame(J, scratch, 102);
        check('a new scene after the clear is indexed', s2.info.points > 10000 && s2.info.ordBefore === 0);
        const abNext = process.memoryUsage().arrayBuffers;
        check('rebuild after the clear allocates no new point buffers', abNext <= abAfter * 1.1, (abNext / 1e6).toFixed(2) + ' MB');
        /* jelly switched off / renderFrame empty branch */
        J.LM.clearJellyIndex();
        scratch.length = 0;
        check('clearJellyIndex: stats reset', statsZero(J) && J.LM.quadtree === null);
        check('clearJellyIndex: scene released', (await aliveCount(s2.weak)) === 0);
        /* a cell from before the clear has no ordinal any more */
        const c = new J.Cell();
        c._lmJellyQtBuild = -1;
        check('ordOf of a cell not in the grid is -1', J.WasmQuadTree.ordOf(c) === -1);
    }

    /* ---- 2. dense -> flush (ClearAll packet and connection change) ---- */
    {
        const J = B.loadJelly();
        await J.initWasm();
        attachFlush(J);
        for (const mode of ['ClearAll packet flushCellsData(false)', 'connection flushCellsData()']) {
            const scratch = [];
            J.drawRender._jellyCellsScratch = scratch;
            const s = denseFrame(J, scratch, 201);
            /* the world arrays still hold the scene until the flush */
            J.LM.cells = scratch.slice();
            check(mode + ': dense scene indexed', s.info.points > 10000 && scratch.length > 300);
            if (mode.indexOf('(false)') >= 0) J.LM.flushCellsData(false); else J.LM.flushCellsData();
            check(mode + ': grid stats reset at once', statsZero(J), JSON.stringify(J.WasmQuadTree.stats()));
            check(mode + ': LM.quadtree null, LM.cells and the frame jelly list empty', J.LM.quadtree === null && J.LM.cells.length === 0 && scratch.length === 0);
            const left = await aliveCount(s.weak);
            check(mode + ': every point and cell of the old world is released', left === 0, left + '/' + s.weak.length + ' alive');
        }
    }

    /* ---- 3. build throws half way -> JS fallback ---- */
    {
        const J = B.loadJelly();
        await J.initWasm();
        const scratch = [];
        const s = denseFrame(J, scratch, 301);
        scratch.length = 0;
        /* a small scene whose 5th point throws on its first read: the grid has then written
         * 4 new references over the dense scene's and still counts the dense scene */
        const cells = B.makeScene(J, 40, 0, 302);
        J.drawRender._jellyFrameId++;
        const jc = J.LM.prepareJellyCells(J.LM.cells, scratch);
        const pt = jc[0].points[4], vx = pt.x;
        let thrown = 0;
        Object.defineProperty(pt, 'x', { configurable: true, enumerable: true, get() { if (!thrown) { thrown = 1; throw new Error('test: bad point'); } return vx; }, set(v) { } });
        J.LM.updateQuadtree(jc);
        check('failed build: the rebuild threw and the JS fallback is the index', thrown === 1 && J.LM.quadtree && J.LM.quadtree !== J.WasmQuadTree && typeof J.LM.quadtree.some === 'function');
        check('failed build: grid stats reset', statsZero(J), JSON.stringify(J.WasmQuadTree.stats()));
        const left = await aliveCount(s.weak);
        check('failed build: the dense scene is no longer held by the grid', left === 0, left + '/' + s.weak.length + ' alive');
        /* the next normal build uses the grid again */
        delete pt.x; pt.x = vx;
        J.LM.updateQuadtree(jc);
        check('after a failed build the grid is used again', J.LM.quadtree === J.WasmQuadTree && J.WasmQuadTree.stats().points > 0);
        cells.length = 0;
    }

    /* ---- 4. tab hidden ---- */
    {
        const listeners = [];
        const doc = { hidden: false, addEventListener(type, fn) { if (type === 'visibilitychange') listeners.push(fn); } };
        global.document = doc;
        try {
            const J = B.loadJelly();
            await J.initWasm();
            const scratch = [];
            J.drawRender._jellyCellsScratch = scratch;
            const s = denseFrame(J, scratch, 401);
            const s2 = denseFrame(J, scratch, 402);
            check('hidden: one visibilitychange listener after several builds', listeners.length === 1, listeners.length + ' listener(s)');
            doc.hidden = false; listeners.forEach((f) => f());
            check('hidden: becoming visible keeps the grid', J.WasmQuadTree.stats().points > 10000 && scratch.length > 0);
            doc.hidden = true; listeners.forEach((f) => f());
            check('hidden: grid stats reset, frame jelly list emptied', statsZero(J) && J.LM.quadtree === null && scratch.length === 0);
            const left = (await aliveCount(s.weak)) + (await aliveCount(s2.weak));
            check('hidden: the last scene is released', left === 0, left + ' alive');
        } finally {
            delete global.document;
        }
    }

    /* ---- 5. renderFrame jelly branches clear the global grid ---- */
    {
        const a = src.indexOf('                if (\n                    defaultmapsettings\n                        .jellyPhisycs\n                ) {');
        const b = src.indexOf('PASS 3', a);
        const c = src.indexOf('Jelly was switched off.', b);
        const pass2 = a >= 0 && b > a ? src.slice(a, b) : '';
        const off = c > 0 ? src.slice(c, c + 400) : '';
        check('renderFrame: empty and failed collision build call LM.clearJellyIndex()', (pass2.match(/LM\.clearJellyIndex\(\);/g) || []).length === 2 && pass2.indexOf('LM.quadtree.clear()') < 0);
        check('renderFrame: jelly off calls LM.clearJellyIndex()', off.indexOf('LM.clearJellyIndex();') >= 0);
    }

    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('gridclear: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
