/**
 * wasm_cell_interp.js — Glue for cell_interp.wasm
 *
 * Provides WasmCellInterp.batchMove(cells, time, anim, suckAnim)
 * which replaces the per-cell moveCell() loop with a single WASM call
 * that batch-interpolates all cell positions+sizes.
 *
 * Also provides WasmCellInterp.batchSort(cells, ids) for render sorting.
 */
(function () {
    'use strict';

    var FLOATS_PER_CELL = 10;
    var ready = false;
    var instance = null;
    var memory = null;
    var bufferPtr = 0;
    var sortBufPtr = 0;
    var maxCells = 0;

    /* Typed array views (re-created if memory grows) */
    var f32 = null;
    var i32 = null;

    function updateViews() {
        var buf = memory.buffer;
        f32 = new Float32Array(buf);
        i32 = new Int32Array(buf);
    }

    var WasmCellInterp = {
        ready: false,

        init: function () {
            var wasmPath = '/wasm/cell_interp.wasm';
            /* Try relative paths for local dev */
            if (typeof window !== 'undefined' && window.location &&
                window.location.pathname.indexOf('/LMexpress/') !== -1) {
                wasmPath = '../wasm/cell_interp.wasm';
            }

            fetch(wasmPath)
                .then(function (r) { return r.arrayBuffer(); })
                .then(function (bytes) {
                    return WebAssembly.instantiate(bytes, {
                        env: { memory: new WebAssembly.Memory({ initial: 4 }) }
                    });
                })
                .then(function (result) {
                    instance = result.instance;
                    memory = instance.exports.memory;
                    updateViews();

                    maxCells = instance.exports.init();
                    bufferPtr = instance.exports.get_buffer();
                    sortBufPtr = instance.exports.get_sort_buffer();

                    ready = true;
                    WasmCellInterp.ready = true;
                    console.log('%c[WASM CellInterp]%c Initialized (max ' + maxCells + ' cells)',
                        'color: #0f0; font-weight: bold', 'color: inherit');
                })
                .catch(function (err) {
                    console.warn('[WASM CellInterp] Failed to load:', err);
                });
        },

        /**
         * batchMove — Batch-interpolate all cells in WASM.
         *
         * @param {Array} cells    LM.cells array
         * @param {number} time    LM.time (ms timestamp)
         * @param {number} anim    animation duration (default 120)
         * @param {boolean} suckAnim  suckAnimation enabled?
         * @returns {boolean} true if WASM path was used
         */
        batchMove: function (cells, time, anim, suckAnim) {
            if (!ready || !cells || !cells.length) return false;

            var count = cells.length;
            if (count > maxCells) count = maxCells;

            /* Ensure views are current */
            if (f32.buffer !== memory.buffer) updateViews();

            /* Fill input buffer: pack cell data into flat float32 array */
            var base = bufferPtr >> 2; /* float32 offset */
            var validCount = 0;

            for (var i = 0; i < count; i++) {
                var cell = cells[i];
                if (!cell) continue;

                /* Skip spectator cells that snap to master (handled in JS) */
                if (cell.spectator && cell.spectator > 0) continue;

                var off = base + validCount * FLOATS_PER_CELL;

                /* Use startX if available, else current x */
                f32[off + 0] = cell.startX != null ? cell.startX : cell.x;
                f32[off + 1] = cell.startY != null ? cell.startY : cell.y;
                f32[off + 2] = cell.targetX;
                f32[off + 3] = cell.targetY;
                f32[off + 4] = cell.startSize != null ? cell.startSize : cell.size;
                f32[off + 5] = cell.targetSize;
                f32[off + 6] = cell.updateTime || cell.time;
                /* slots 7-9 are output */

                /* Store JS index for writeback */
                cell._wasmIdx = validCount;
                validCount++;
            }

            if (validCount === 0) return false;

            /* Call WASM interpolation */
            instance.exports.interp_cells(validCount, time, anim, suckAnim ? 1 : 0);

            /* Read back results */
            for (var i = 0; i < count; i++) {
                var cell = cells[i];
                if (!cell || cell._wasmIdx === undefined) continue;

                var off = base + cell._wasmIdx * FLOATS_PER_CELL;
                cell.x = f32[off + 7];
                cell.y = f32[off + 8];

                var newSize = f32[off + 9];
                if (!suckAnim || newSize >= 0) {
                    cell.size = newSize;
                }

                /* Compute alpha (delay value) for fade effects */
                var time2 = time - (cell.updateTime || cell.time);
                var delay = time2 / anim;
                if (delay < 0) delay = 0;
                else if (delay > 1) delay = 1;
                cell.alpha = delay;

                /* Handle removed cell cleanup */
                if (cell.removed && delay >= 1) {
                    var LM = window.legendmod || window.LM;
                    if (LM && LM.removedCells) {
                        var removedIdx = LM.removedCells.indexOf(cell);
                        if (removedIdx !== -1) {
                            var last = LM.removedCells.length - 1;
                            if (removedIdx !== last) LM.removedCells[removedIdx] = LM.removedCells[last];
                            LM.removedCells.length = last;
                        }
                    }
                }

                delete cell._wasmIdx;
            }

            return true;
        },

        /**
         * batchSort — Sort cells by size (ascending) in WASM.
         *
         * @param {Array} cells  LM.cells array
         * @returns {boolean} true if WASM path was used
         */
        batchSort: function (cells) {
            if (!ready || !cells || !cells.length) return false;

            var count = cells.length;
            if (count > maxCells) return false;

            /* Ensure views are current */
            if (f32.buffer !== memory.buffer) updateViews();

            /* The size values should already be in the buffer from batchMove.
             * We need to provide cell IDs for tiebreaking. */
            var idPtr = sortBufPtr + maxCells * 4; /* Use space after sort_buf */

            /* Actually, we need separate ID storage. For now, use a simpler
             * approach: write IDs into a temporary region of WASM memory.
             * Since we have 4 pages (256KB), we have plenty of room. */

            /* Build ID array in JS (IDs don't fit in the existing buffer) */
            var ids = new Int32Array(count);
            for (var i = 0; i < count; i++) {
                ids[i] = cells[i] ? cells[i].id : 0;
            }

            /* Copy IDs into WASM memory after sort_buf */
            var idOffset = (sortBufPtr >> 2) + maxCells;
            for (var i = 0; i < count; i++) {
                i32[idOffset + i] = ids[i];
            }

            /* Call WASM sort */
            instance.exports.sort_cells(count, (sortBufPtr + maxCells * 4));

            /* Read sort order and rearrange cells array */
            var sortBase = sortBufPtr >> 2;
            var temp = new Array(count);
            for (var i = 0; i < count; i++) {
                var origIdx = i32[sortBase + i];
                temp[i] = cells[origIdx];
            }
            for (var i = 0; i < count; i++) {
                cells[i] = temp[i];
            }

            return true;
        }
    };

    window.WasmCellInterp = WasmCellInterp;
})();
