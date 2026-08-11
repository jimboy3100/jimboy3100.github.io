/*
 * wasm_quadtree.js — JS glue for WASM flat-memory PointQuadTree
 *
 * Replaces the JS PointQuadTree with a WASM-backed version that uses
 * pre-allocated linear memory (zero GC pressure per frame).
 *
 * Usage:
 *   await WasmQuadTree.init();
 *   WasmQuadTree.rebuild(x, y, w, h, cells);  // cells = [{points: [{x,y},...]}]
 *   var hit = WasmQuadTree.some({x, y, w, h}, function(pointId) { return true; });
 */

var WasmQuadTree = (function () {
    'use strict';

    var instance = null;
    var memory = null;
    var ready = false;
    var resultBufPtr = 0;

    /* Point reference map: WASM point ID -> original JS point object */
    var pointRefs = [];

    /* Pre-allocated Float32Array for bulk insert */
    var bulkBuf = null;
    var bulkBufPtr = 0;
    var BULK_BUF_MAX = 32768; /* max points per frame */

    async function init() {
        if (ready) return;

        try {
            var wasmUrl = '/wasm/quadtree.wasm';
            var importObject = {
                env: {
                    memory: new WebAssembly.Memory({ initial: 32 }) /* 2MB */
                },
                wasi_snapshot_preview1: {
                    proc_exit: function () { },
                    fd_close: function () { return 0; },
                    fd_write: function () { return 0; },
                    fd_seek: function () { return 0; }
                }
            };

            var response = await fetch(wasmUrl);
            var bytes = await response.arrayBuffer();
            var result = await WebAssembly.instantiate(bytes, importObject);
            instance = result.instance;
            memory = instance.exports.memory || importObject.env.memory;

            resultBufPtr = instance.exports.get_result_buf();

            /* Allocate bulk insert buffer at the end of WASM memory */
            bulkBufPtr = memory.buffer.byteLength - (BULK_BUF_MAX * 12); /* 3 floats × 4 bytes */

            ready = true;
            console.log('%c[WASM QuadTree]%c Initialized (quadtree.wasm loaded)',
                'color: #0ff; font-weight: bold', 'color: inherit');
        } catch (e) {
            console.warn('[WASM QuadTree] Failed to load, falling back to JS:', e);
            ready = false;
        }
    }

    /**
     * Rebuild the quadtree for the current viewport.
     *
     * @param {number} x - viewport left
     * @param {number} y - viewport top
     * @param {number} w - viewport width
     * @param {number} h - viewport height
     * @param {Array} cells - array of cell objects with .points[] arrays
     */
    function rebuild(x, y, w, h, cells) {
        if (!ready || !instance) return false;

        instance.exports.qt_init(x, y, w, h);
        pointRefs.length = 0;

        /* Collect all points into bulk insert buffer */
        var floatView = new Float32Array(memory.buffer, bulkBufPtr, BULK_BUF_MAX * 3);
        var count = 0;

        for (var i = 0; i < cells.length && count < BULK_BUF_MAX; i++) {
            var cell = cells[i];
            var pts = cell.points;
            for (var n = 0; n < pts.length && count < BULK_BUF_MAX; n++) {
                var pt = pts[n];
                var idx = count * 3;
                floatView[idx] = pt.x;
                floatView[idx + 1] = pt.y;
                floatView[idx + 2] = count; /* point ID = index into pointRefs */
                pointRefs.push(pt);
                count++;
            }
        }

        if (count > 0) {
            instance.exports.qt_bulk_insert(bulkBufPtr, count);
        }

        return true;
    }

    /**
     * Test if any point in the AABB satisfies the test callback.
     * Mimics PointQuadTree.some(aabb, test).
     *
     * @param {object} aabb - {x, y, w, h}
     * @param {function} test - function(point) → boolean
     * @returns {boolean}
     */
    function some(aabb, test) {
        if (!ready || !instance) return false;

        /* Get all points in AABB from WASM */
        var count = instance.exports.qt_query(aabb.x, aabb.y, aabb.w, aabb.h);

        if (count === 0) return false;

        /* Read result IDs */
        var resultView = new Int32Array(memory.buffer, resultBufPtr, count);

        for (var i = 0; i < count; i++) {
            var pointId = resultView[i];
            if (pointId >= 0 && pointId < pointRefs.length) {
                var pt = pointRefs[pointId];
                if (test(pt)) return true;
            }
        }

        return false;
    }

    /**
     * Query all points within an AABB.
     *
     * @param {object} aabb - {x, y, w, h}
     * @returns {Array} array of point objects
     */
    function query(aabb) {
        if (!ready || !instance) return [];

        var count = instance.exports.qt_query(aabb.x, aabb.y, aabb.w, aabb.h);
        if (count === 0) return [];

        var resultView = new Int32Array(memory.buffer, resultBufPtr, count);
        var results = [];
        for (var i = 0; i < count; i++) {
            var pid = resultView[i];
            if (pid >= 0 && pid < pointRefs.length) {
                results.push(pointRefs[pid]);
            }
        }
        return results;
    }

    function stats() {
        if (!ready || !instance) return { nodes: 0, points: 0 };
        return {
            nodes: instance.exports.qt_node_count(),
            points: instance.exports.qt_point_count()
        };
    }

    return {
        init: init,
        rebuild: rebuild,
        some: some,
        query: query,
        stats: stats,
        get ready() { return ready; }
    };
})();
