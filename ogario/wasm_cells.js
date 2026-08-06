/*
 * wasm_cells.js — JS glue for WASM cell update binary parser
 *
 * Loads cell_parser.wasm and provides a high-level API that replaces
 * the hot binary-read loop in legendmod.updateCells().
 *
 * Usage:
 *   await WasmCellParser.init();
 *   var result = WasmCellParser.parse(uint8ArrayBuffer, isLegacy);
 *   // result.eatEvents: [{eater, victim}, ...]
 *   // result.cells: [{id, x, y, size, flags, extFlags, r, g, b, hasColor,
 *   //                 accountId, skinOff, skinLen, nameOff, nameLen, ownerId, cellType}, ...]
 *   // result.removes: [id, ...]
 */

var WasmCellParser = (function () {
    'use strict';

    var instance = null;
    var memory = null;
    var HEAP8 = null;
    var HEAPU32 = null;
    var ready = false;

    /* WASM memory layout pointers (resolved after instantiation) */
    var eatBufPtr = 0;
    var cellBufPtr = 0;
    var removeBufPtr = 0;

    var CELL_SLOTS = 9; /* uint32 slots per cell record */

    /* Shared input buffer in WASM memory */
    var inputBufPtr = 0;
    var inputBufSize = 0;
    var INPUT_BUF_MAX = 65536; /* 64KB — larger than any single cell update packet */

    async function init() {
        if (ready) return;

        try {
            var wasmUrl = 'wasm/cell_parser.wasm';
            var importObject = {
                env: {
                    memory: new WebAssembly.Memory({ initial: 16 }) /* 1MB */
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

            /* Get buffer pointers */
            eatBufPtr = instance.exports.get_eat_buf();
            cellBufPtr = instance.exports.get_cell_buf();
            removeBufPtr = instance.exports.get_remove_buf();

            /* Allocate input buffer in WASM linear memory */
            inputBufPtr = eatBufPtr - INPUT_BUF_MAX - 256; /* Safe area before static buffers */

            ready = true;
            console.log('%c[WASM CellParser]%c Initialized (cell_parser.wasm loaded)',
                'color: #0ff; font-weight: bold', 'color: inherit');
        } catch (e) {
            console.warn('[WASM CellParser] Failed to load, falling back to JS:', e);
            ready = false;
        }
    }

    /**
     * Parse a cell update packet.
     *
     * @param {Uint8Array} rawBuf — the raw packet bytes (WITHOUT opcode byte, starting at eat events)
     * @param {boolean} isLegacy — true for MultiOgar/legacy protocol servers
     * @returns {object} {eatEvents, cells, removes, rawBuf}
     */
    function parse(rawBuf, isLegacy) {
        if (!ready || !instance) return null;

        var len = rawBuf.length;
        if (len > INPUT_BUF_MAX) {
            console.warn('[WASM CellParser] Packet too large:', len);
            return null;
        }

        /* Copy input buffer into WASM memory */
        var wasmMem = new Uint8Array(memory.buffer);
        /* Use a safe region at the end of memory for input */
        var inputOffset = memory.buffer.byteLength - INPUT_BUF_MAX;
        wasmMem.set(rawBuf, inputOffset);

        /* Call WASM parser */
        var resultPtr = instance.exports.parse_cells(inputOffset, len, isLegacy ? 1 : 0);

        /* Read ParseResult struct: {eat_count, cell_count, remove_count} as 3 x uint32 */
        var resultView = new Uint32Array(memory.buffer, resultPtr, 3);
        var eatCount = resultView[0];
        var cellCount = resultView[1];
        var removeCount = resultView[2];

        /* Read eat events */
        var eatView = new Uint32Array(memory.buffer, eatBufPtr, eatCount * 2);
        var eatEvents = new Array(eatCount);
        for (var i = 0; i < eatCount; i++) {
            eatEvents[i] = {
                eater: eatView[i * 2],
                victim: eatView[i * 2 + 1]
            };
        }

        /* Read cell records */
        var cellView = new Uint32Array(memory.buffer, cellBufPtr, cellCount * CELL_SLOTS);
        var cells = new Array(cellCount);
        for (var i = 0; i < cellCount; i++) {
            var base = i * CELL_SLOTS;
            var packed3 = cellView[base + 3];
            var packed4 = cellView[base + 4];
            var packed6 = cellView[base + 6];
            var packed7 = cellView[base + 7];
            var packed8 = cellView[base + 8];

            cells[i] = {
                id: cellView[base + 0],
                x: cellView[base + 1] | 0, /* interpret as signed int32 */
                y: cellView[base + 2] | 0,
                size: packed3 & 0xFFFF,
                flags: (packed3 >> 16) & 0xFF,
                extFlags: (packed3 >> 24) & 0xFF,
                r: packed4 & 0xFF,
                g: (packed4 >> 8) & 0xFF,
                b: (packed4 >> 16) & 0xFF,
                hasColor: (packed4 >> 24) & 0xFF,
                accountId: cellView[base + 5],
                skinOff: packed6 & 0xFFFF,
                skinLen: (packed6 >> 16) & 0xFFFF,
                nameOff: packed7 & 0xFFFF,
                nameLen: (packed7 >> 16) & 0xFFFF,
                ownerId: packed8 & 0xFFFF,
                cellType: (packed8 >> 16) | 0  /* sign-extend int16 */
            };
            /* Fix sign extension for cellType (it's int16) */
            if (cells[i].cellType > 32767) cells[i].cellType -= 65536;
        }

        /* Read remove events */
        var removeView = new Uint32Array(memory.buffer, removeBufPtr, removeCount);
        var removes = new Array(removeCount);
        for (var i = 0; i < removeCount; i++) {
            removes[i] = removeView[i];
        }

        return {
            eatEvents: eatEvents,
            cells: cells,
            removes: removes,
            rawBuf: rawBuf  /* keep reference for string decode */
        };
    }

    /**
     * Decode a string from the raw packet buffer at the given offset/length.
     * Used by the JS side to extract name/skin strings that WASM skipped.
     */
    function decodeString(rawBuf, offset, len) {
        if (len === 0) return '';
        var slice = rawBuf.subarray(offset, offset + len);
        try {
            var text = (window._wasmTextDecoder ||
                (window._wasmTextDecoder = new TextDecoder('utf-8'))).decode(slice);
            return decodeURIComponent(escape(text));
        } catch (e) {
            /* Fallback: char-by-char */
            var s = '';
            for (var i = 0; i < slice.length; i++) {
                s += String.fromCharCode(slice[i]);
            }
            return s;
        }
    }

    return {
        init: init,
        parse: parse,
        decodeString: decodeString,
        get ready() { return ready; }
    };
})();
