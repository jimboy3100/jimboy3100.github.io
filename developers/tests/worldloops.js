/* The frame's full-world loops: every cell id is in LM.cells once by construction, so the
 * frame has no duplicate-id pass over the whole world (it went over every cell, with a Map
 * entry each, after every packet once LM.cells held 2500 cells, and never found anything).
 *
 * Oracle: two worlds are fed the same long seeded random sequence of real packets and frames,
 * one with the frame as it is now, one with the old dedup pass put back in front of it. The
 * real code runs in a vm: handleMessage / updateCells / flushCellsData of the main connection
 * (Expanding Land world updates: adds, plain updates, eats, removes, food, respawn wipes), the
 * multibox unit handler of ogario/spect.js (unit cells under main cells' server ids,
 * unit food, own unit cells), the cell class (removeCell, moveCell), sortCells,
 * the head of renderFrame (stall snap, moveCell for every cell, sort) and the frame compaction.
 * After every step both worlds must hold the same cells in the same order with the same
 * positions, sizes and slots, every listed cell must be the one indexedCells has for its id,
 * and the old pass must never have found a duplicate.
 * node developers/tests/worldloops.js [ogario.v4.js] [spect.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const src = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const spectSrc = read(process.argv[3] || path.join(root, 'ogario', 'spect.js'));
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function slice(from, to, plus) {
    const a = src.indexOf(from), b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error('not found in ogario.v4.js: ' + (a < 0 ? from : to));
    return src.slice(a, b + (plus ? to.length : 0));
}
function block(from) {
    const a = src.indexOf(from);
    if (a < 0) throw new Error('not found in ogario.v4.js: ' + from);
    let i = src.indexOf('{', a), depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i], nx = src[i + 1];
        if (ch === '/' && nx === '/') { i = src.indexOf('\n', i); continue; }
        if (ch === '/' && nx === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { for (i++; src[i] !== ch; i++) if (src[i] === '\\') i++; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return src.slice(a, i + 1);
    }
    throw new Error('unclosed block: ' + from);
}
const strip = (t) => t.replace(/,\s*$/, '');

/* The frame up to the end of the sort and the view bounds (renderFrame's head), and the active-cell compaction. */
const head = slice('        renderFrame() {\n', '            /* Build chat/command lookup map once per frame')
    .replace('        renderFrame() {\n', '');
const compactionSrc = (() => {
    const t = slice('var _cW = 0;', '* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION');
    return t.slice(0, t.lastIndexOf('/*'));
})();
/* The pass the frame had before LM.time was set (reference for the oracle). */
const OLD_DEDUP = `
            if (LM._cellsDirty && LM.cells.length > 2500) {
                LM._cellsDirty = false;
                var _cellsBefore = LM.cells.length;
                var _dedupMap = this._dedupMap || (this._dedupMap = new Map());
                _dedupMap.clear();
                for (var ci = 0; ci < _cellsBefore; ci++) {
                    var cellItem = LM.cells[ci];
                    if (cellItem && cellItem.id && !_dedupMap.has(cellItem.id)) {
                        _dedupMap.set(cellItem.id, cellItem);
                    }
                }
                __ref.passes++;
                if (_dedupMap.size < _cellsBefore) {
                    __ref.pruned += _cellsBefore - _dedupMap.size;
                    for (ci = 0; ci < _cellsBefore; ci++) {
                        cellItem = LM.cells[ci];
                        if (cellItem && (!cellItem.id || _dedupMap.get(cellItem.id) !== cellItem)) cellItem._cellsIdx = -1;
                    }
                    var _w = 0;
                    _dedupMap.forEach(function(v) { LM.cells[_w++] = v; });
                    LM.cells.length = _w;
                    LM._lmRebuildCellsIdx(LM.cells);
                }
            }
`;
const TIME_MARK = '            LM.time = _now;\n';
if (head.indexOf(TIME_MARK) < 0) throw new Error('LM.time = _now not found in renderFrame');

/* A world: the real main handler, unit handler, cell class and frame pieces in their own vm. */
function makeWorld(withOldPass) {
    const noop = function () { };
    const clock = { now: 1000 };
    class FakeDate extends Date {
        constructor(...a) { super(...(a.length ? a : [clock.now])); }
        static now() { return clock.now; }
    }
    const g = {
        console: { log: noop, warn: noop, error: noop }, Math, JSON, Object, Array, Map, Set, Number, String, Boolean,
        Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, Error, isFinite, escape, unescape, decodeURIComponent,
        encodeURIComponent, parseInt, parseFloat, Infinity, NaN, undefined, performance, setTimeout: () => 0, clearTimeout: noop, Buffer, Date: FakeDate
    };
    g.window = g;
    g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
    g.buffer = { Buffer: function (ab) { return Buffer.from(ab); } };
    g.defaultmapsettings = { recordReplays: false, virusesRange: true, animation: 120, shortMass: false, virMassShots: false };
    g.defaultSettings = { foodColor: '#5000ff' };
    g.$ = () => ({ val: () => '', on: noop });
    g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0, mbSlots: [], selectedOldProfile: 0 }, { get: (t, k) => k in t ? t[k] : noop });
    g.userBots = { startedBots: false };
    g.profiles = [];
    g.__ref = { passes: 0, pruned: 0 };
    g.__h = null; g.__frame = null; g.__compact = null;
    vm.createContext(g);
    g.drawRender = new Proxy({}, { get: () => noop });
    /* names the vm does not have get a no-op stand-in (the answer per name is kept: every
     * identifier the handlers use asks) */
    const known = new Map();
    g.__env = new Proxy({}, {
        has: (t, k) => { if (typeof k !== 'string') return false; let v = known.get(k); if (v === undefined) { v = !(k in g); known.set(k, v); } return v; },
        get: (t, k) => k in t ? t[k] : noop
    });
    /* the packet handlers, with stand-ins for every name the vm does not have */
    const hm = strip(slice('        handleMessage(data) {\n', '        countPps() {'));
    const uc = strip(slice(src.includes('        _lmCellIdentityScan(view, offset) {\n') ? '        _lmCellIdentityScan(view, offset) {\n' : '        updateCells(view, offset) {\n', '        calculatePlayerMassAndPosition() {'));
    const fl = strip(slice('        flushCellsData(preserveMapGeometry) {\n', '        /* Spectator toggles'));
    vm.runInContext('with (__env) { __h = ({' + hm + ',\n' + uc + ',\n' + fl + '}); }', g);
    const L = g.__h;
    Object.assign(L, {
        serverType: 'expandingland', isLegendWorld: true, connectionIntegrity: false, integrity: false, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
        cells: [], food: [], viruses: [], foodMulti: [], removedCells: [], playerCells: [], playerCellIDs: [], playerCellsMulti: [], indexedCells: {}, cellcolors: {},
        vector: [[0, 0]], vnr: 0, play: false, time: 0, mapEvent: {}, decayInfo: {},
        countPps: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushSpecsData: noop,
        getCursorPosition: noop, compareCells: noop, clearJellyIndex: noop,
        rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join(''), _lmKeepMainSuppressed: () => false
    });
    g.legendmod = g.LM = L;
    /* the cell class, the id helpers and the frame pieces in one closure: their hot names
     * (LM, defaultmapsettings...) are locals there, not lookups on the vm's global object */
    /* the id helpers, the per-connection index and the reconciled food list */
    const ids = slice('var LM_UNIT_ID_STEP = ', 'var _lmMbGridTime = -1;') + slice('var _lmSrcObs = new Map();', 'var LM_MB_RING_MIN_SCREEN_PX');
    const cellSrc = slice('    function quickSwapDelete(', '    }).call(ogarbasicassembly.prototype);\n', true);
    const names = [...(ids + '\n' + cellSrc).matchAll(/^ {0,4}function (\w+)\(/gm)].map(m => m[1]);
    const frameSrc = withOldPass ? head.replace(TIME_MARK, OLD_DEDUP + TIME_MARK) : head;
    vm.runInContext([
        '(function () {',
        'var LM = __h, legendmod = LM, defaultmapsettings = window.defaultmapsettings, defaultSettings = window.defaultSettings, application = window.application, profiles = window.profiles, __ref = window.__ref;',
        'var _DEATH_SLOWMO_ANIM = 600;',
        'function lmMultiboxPositionTwin() { return null; }',
        ids, cellSrc,
        names.map(n => 'window.' + n + ' = ' + n + ';').join(' '),
        'window.LM_UNIT_ID_STEP = LM_UNIT_ID_STEP; window.lmMultiboxPositionTwin = lmMultiboxPositionTwin;',
        'window.legendmod1 = ogarbasicassembly;',
        'window.lmCellIdx = { push: indexedPush, of: lmIdxOf, remove: lmIdxRemove, filter: lmIdxFilter };',
        'var _isExpandingLandClient = ' + block('function _isExpandingLandClient(') + '; window._isExpandingLandClient = _isExpandingLandClient;',
        'window.__frame = function () { var i;\n' + frameSrc + '\n};',
        'window.__compact = function () { var i, cell;\n' + compactionSrc + '\n};',
        '})();'
    ].join('\n'), g);
    vm.runInContext(spectSrc + '\nthis.Spect = Spect;', g);
    const view = { gl: null, camX: 0, camY: 0, camXMulti: 0, camYMulti: 0, scale: 1, canvasWidth: 1920, canvasHeight: 1080, setView: noop };
    return {
        g, L, clock,
        frame() { g.__frame.call(view); g.__compact.call(view); },
        unit(number) {
            const sp = Object.create(g.Spect.prototype);
            Object.assign(sp, { number, player: true, integrity: true, active: true, foodCalibrated: true, nick: 'Unit' + number, playerCellIDs: [], time: 0 });
            return sp;
        }
    };
}

/* Expanding Land world update (opcode 16), as in developers/tests/elidentity.js */
function elPacket(eats, recs, removes) {
    const b = [];
    const u8 = (v) => b.push(v & 255), u16 = (v) => { u8(v); u8(v >>> 8); }, u32 = (v) => { for (let i = 0; i < 4; i++) u8(v >>> (8 * i)); };
    const str = (s) => { for (const ch of Buffer.from(s, 'utf8')) u8(ch); u8(0); };
    u8(16); u16(eats.length);
    eats.forEach(e => { u32(e[0]); u32(e[1]); });
    recs.forEach(r => {
        const flags = (r.food ? 0x80 : 0) | (r.color ? 2 : 0) | (r.skin != null ? 4 : 0) | (r.name != null ? 8 : 0);
        u32(r.id); u32(r.x || 0); u32(r.y || 0); u16(r.size || 100); u8(flags);
        if (r.food) u8(1);
        if (r.color) r.color.forEach(u8);
        if (r.skin != null) str(r.skin);
        if (r.name != null) str(r.name);
    });
    u32(0); u16(removes.length); removes.forEach(u32);
    return new Uint8Array(b);
}
/* agar.io update body for a unit connection, as in developers/tests/cellindex.js */
function unitPacket(eats, cells, removes) {
    const b = Buffer.alloc(4 + eats.length * 8 + cells.length * 16 + 4 + 2 + removes.length * 4);
    let o = 0;
    b.writeUInt16LE(eats.length, o); o += 2;
    for (const [a, v] of eats) { b.writeUInt32LE(a, o); b.writeUInt32LE(v, o + 4); o += 8; }
    for (const c of cells) {
        b.writeUInt32LE(c.id, o); b.writeInt32LE(c.x, o + 4); b.writeInt32LE(c.y, o + 8); b.writeUInt16LE(c.size, o + 12); o += 14;
        if (c.food) { b.writeUInt8(128, o++); b.writeUInt8(1, o++); } else b.writeUInt8(c.virus ? 1 : 0, o++);
    }
    b.writeUInt32LE(0, o); o += 4;
    b.writeUInt16LE(removes.length, o); o += 2;
    for (const id of removes) { b.writeUInt32LE(id, o); o += 4; }
    return b.slice(0, o);
}

/* where the two worlds differ ('' when they hold the same cells in the same order, with the
 * same positions, sizes, slots and visibility, and the same lookup and side lists) */
function differ(A, B, full) {
    const a = A.L.cells, b = B.L.cells;
    if (a.length !== b.length) return 'length ' + a.length + ' / ' + b.length;
    for (let i = 0; i < a.length; i++) {
        const x = a[i], y = b[i];
        if (!x || !y) { if (x !== y && (!x) !== (!y)) return 'empty slot ' + i; continue; }
        if (x.id !== y.id || x.x !== y.x || x.y !== y.y || x.size !== y.size || x._cellsIdx !== y._cellsIdx || !x.invisible !== !y.invisible || x.alpha !== y.alpha) return 'cell at ' + i;
    }
    if (!full) return '';
    let ka = 0, kb = 0;
    for (const k in A.L.indexedCells) { ka++; if (!B.L.indexedCells[k] || B.L.indexedCells[k]._cellsIdx !== A.L.indexedCells[k]._cellsIdx) return 'indexedCells ' + k; }
    for (const k in B.L.indexedCells) kb++;
    if (ka !== kb) return 'indexedCells size';
    for (const k of ['food', 'foodMulti', 'viruses', 'removedCells', 'playerCellsMulti']) if (A.L[k].length !== B.L[k].length) return k;
    return '';
}
/* every listed cell is the one indexedCells holds for its id (so no id is listed twice) */
function listedOnce(w) {
    const L = w.L, seen = new Set();
    for (let i = 0; i < L.cells.length; i++) {
        const c = L.cells[i];
        if (!c) return 'empty slot ' + i;
        if (L.indexedCells[c.id] !== c) return 'cell ' + c.id + ' at ' + i + ' is not the indexed one';
        if (seen.has(c.id)) return 'id ' + c.id + ' twice';
        seen.add(c.id);
        if (c._cellsIdx !== i) return 'slot of ' + c.id;
    }
    return '';
}

function run(seed, steps, opts) {
    let s = seed >>> 0 || 1;
    const rnd = () => (s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647) / 2147483647;
    const ri = (n) => Math.floor(rnd() * n);
    const A = makeWorld(false), B = makeWorld(true);
    const unitsA = [A.unit(1), A.unit(2)], unitsB = [B.unit(1), B.unit(2)];
    const alive = new Map();      /* main body ids -> size */
    const unitSeen = [new Set(), new Set()];
    const own = [[], []];
    let nextId = 1, foodId = 4000000, mismatch = '', broken = '', maxCells = 0, frames = 0, packets = 0;
    const both = (fn) => { fn(A, unitsA); fn(B, unitsB); };
    function mainPacket(nAdd, nUpd, nEat, nRem, nFood) {
        const recs = [], eats = [], rems = [];
        const ids = [...alive.keys()];
        for (let k = 0; k < nAdd; k++) {
            const id = nextId++;
            const size = 30 + ri(400);
            alive.set(id, size);
            recs.push({ id, x: ri(14000), y: ri(14000), size, color: [ri(256), ri(256), ri(256)], skin: '', name: rnd() < 0.5 ? 'p' + ri(50) : '' });
        }
        for (let k = 0; k < nUpd && ids.length; k++) {
            const id = ids[ri(ids.length)];
            if (!alive.has(id)) continue;
            /* equal sizes are common (ejected mass, food-sized pieces): ids order them */
            const size = rnd() < 0.3 ? 38 : Math.max(10, alive.get(id) + ri(9) - 4);
            alive.set(id, size);
            recs.push({ id, x: ri(14000), y: ri(14000), size });
        }
        for (let k = 0; k < nEat && ids.length > 2; k++) {
            const v = ids[ri(ids.length)], e = ids[ri(ids.length)];
            if (v === e || !alive.has(v) || !alive.has(e)) continue;
            alive.delete(v); eats.push([e, v]);
        }
        for (let k = 0; k < nRem && ids.length; k++) {
            const id = ids[ri(ids.length)];
            if (!alive.has(id)) continue;
            alive.delete(id); rems.push(id);
        }
        for (let k = 0; k < nFood; k++) recs.push({ id: foodId++, x: ri(14000), y: ri(14000), size: 12, food: true, color: [10, 20, 30] });
        const bytes = elPacket(eats, recs, rems);
        both((w) => w.L.handleMessage(new DataView(bytes.slice().buffer)));
        packets++;
    }
    function unitStep(u) {
        /* a unit sees a part of the main world (same server ids: hidden copies), its own cells,
         * food and its own new cells; and loses some of what it saw */
        const cells = [], eats = [], rems = [];
        const ids = [...alive.keys()];
        for (let k = 0; k < 40 && ids.length; k++) {
            const id = ids[ri(ids.length)];
            cells.push({ id, x: ri(14000), y: ri(14000), size: alive.get(id) });
            unitSeen[u].add(id);
        }
        if (rnd() < 0.3 && own[u].length < 8) {
            const id = 5000000 + u * 100000 + nextId++;
            own[u].push(id);
            both((w, units) => { units[u].playerCellIDs.push(w.g.lmUnitCellId(id, u + 1)); });
        }
        for (const id of own[u]) cells.push({ id, x: 7000, y: 7000, size: 60 + ri(20) });
        for (let k = 0; k < 5; k++) cells.push({ id: 6000000 + u * 100000 + nextId++, x: ri(14000), y: ri(14000), size: 10, food: true });
        const seen = [...unitSeen[u]];
        for (let k = 0; k < 15 && seen.length; k++) {
            const id = seen[ri(seen.length)];
            if (unitSeen[u].delete(id)) rems.push(id);
        }
        if (own[u].length && rnd() < 0.1) { const id = own[u].pop(); eats.push([seen[0] || 1, id]); }
        const buf = unitPacket(eats, cells, rems);
        both((w, units) => units[u].updateCells(Buffer.from(buf), 0));
    }
    function compare(label, full) {
        if (!mismatch) { const d = differ(A, B, full); if (d) mismatch = label + ': ' + d; }
        const lo = full ? listedOnce(A) : '';
        if (!broken && lo) broken = label + ': ' + lo;
        if (A.L.cells.length > maxCells) maxCells = A.L.cells.length;
    }
    /* grow a world past the old pass's 2500 cells */
    for (let k = 0; k < (opts.initial / 250 | 0); k++) { mainPacket(250, 0, 0, 0, 20); }
    both((w) => w.frame());
    compare('start', true);
    for (let step = 0; step < steps; step++) {
        const r = rnd();
        if (r < 0.55) mainPacket(ri(12), 10 + ri(80), ri(6), ri(8), ri(3));
        else if (r < 0.80) unitStep(ri(2));
        else if (r < 0.81 && opts.wipes) {
            /* Expanding Land respawn wipe: the server keeps its cells and sends plain updates */
            both((w) => w.L.flushCellsData(true));
            for (const u of unitSeen) u.clear();
            for (const o of own) o.length = 0;
            both((w, units) => { for (const sp of units) sp.playerCellIDs.length = 0; });
            const recs = [];
            for (const [id, size] of alive) recs.push({ id, x: ri(14000), y: ri(14000), size });
            const bytes = elPacket([], recs, []);
            both((w) => w.L.handleMessage(new DataView(bytes.slice().buffer)));
        }
        compare('step ' + step + ' (packet)', true);
        /* one to three frames, sometimes after a stall (hidden tab: snap to targets) */
        const nf = 1 + ri(3);
        for (let f = 0; f < nf; f++) {
            const dt = rnd() < 0.01 ? 1500 : 16;
            A.clock.now += dt; B.clock.now += dt;
            both((w) => w.frame());
            frames++;
            compare('step ' + step + ' frame ' + f, f === nf - 1);
        }
    }
    return { mismatch, broken, maxCells, frames, packets, passes: B.g.__ref.passes, pruned: B.g.__ref.pruned, A, B };
}

/* ---- the frame does no whole-world work for duplicates ---- */
{
    const w = makeWorld(false);
    for (let k = 0; k < 12; k++) {
        const recs = [];
        for (let i = 0; i < 250; i++) recs.push({ id: k * 250 + i + 1, x: 100 + i, y: 100 + k, size: 40 + i % 300, color: [200, 50, 50], skin: '', name: '' });
        w.L.handleMessage(new DataView(elPacket([], recs, []).buffer));
    }
    const M = w.g.Map.prototype, set0 = M.set, has0 = M.has;
    let ops = 0;
    M.set = function () { ops++; return set0.apply(this, arguments); };
    M.has = function () { ops++; return has0.apply(this, arguments); };
    w.L._cellsDirty = true;
    w.clock.now += 16;
    w.frame();
    M.set = set0; M.has = has0;
    check('3000 cells, a packet just added cells: the frame makes no Map entry per cell (was one set and one has per cell)', w.L.cells.length === 3000 && ops < 100);
    /* the checks below see a second object for an id, and the old pass would drop it */
    const ref = makeWorld(true);
    for (let i = 0; i < 2600; i++) ref.g.indexedPush(ref.L.cells, new ref.g.ogarbasicassembly(i + 1, 0, 0, 40, '#fff', false, false, false, false, false), '_cellsIdx');
    for (const c of ref.L.cells) ref.L.indexedCells[c.id] = c;
    ref.g.indexedPush(ref.L.cells, new ref.g.ogarbasicassembly(7, 0, 0, 40, '#fff', false, false, false, false, false), '_cellsIdx');
    const seen = listedOnce(ref);
    ref.L._cellsDirty = true;
    ref.clock.now += 16;
    ref.frame();
    check('a second object for one id is caught by the checks (' + seen + ') and the old pass drops it', /not the indexed one/.test(seen) && ref.g.__ref.pruned === 1 && ref.L.cells.length === 2600);
}

/* ---- long random sequences: the frame without the pass equals the frame with it ---- */
for (const [seed, steps, initial, wipes] of [[1, 200, 2750, false], [7, 200, 2750, true], [20261127, 300, 3000, true]]) {
    const r = run(seed, steps, { initial, wipes });
    check('seed ' + seed + ': ' + r.packets + ' packets, ' + r.frames + ' frames, up to ' + r.maxCells + ' cells: same cells, order, positions, sizes and slots in both worlds' + (r.mismatch ? ' (first difference at ' + r.mismatch + ')' : ''), !r.mismatch);
    check('seed ' + seed + ': every listed cell is the indexed one for its id, no empty slot, never twice' + (r.broken ? ' (' + r.broken + ')' : ''), !r.broken);
    check('seed ' + seed + ': the old pass ran ' + r.passes + ' times over more than 2500 cells and found ' + r.pruned + ' duplicates', r.passes > 50 && r.pruned === 0);
    /* unit cells under a main cell's server id are other cells (other id): both listed */
    const both = r.A.L.cells.filter(c => c.spectator > 0 && r.A.L.indexedCells[r.A.g.lmRawCellId(c.id)] && r.A.L.indexedCells[r.A.g.lmRawCellId(c.id)]._cellsIdx >= 0).length;
    check('seed ' + seed + ': unit cells with a main cell server id stay listed next to it (' + both + ' at the end)', both > 0);
}

if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
console.log('all checks passed');
