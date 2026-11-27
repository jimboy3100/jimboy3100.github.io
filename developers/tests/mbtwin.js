// Unit check of the multibox position twin rule (lmMultiboxPositionTwin in ogario.v4.js):
// a cell seen by two connections is drawn once, and a different cell over a unit's own
// cell (enemy of the same size, virus) is never hidden on both connections.
// Usage: node developers/tests/mbtwin.js [ogario.v4.js]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../../ogario/ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const start = src.indexOf('var LM_UNIT_ID_STEP');
const endMark = src.indexOf('function lmMultiboxPositionTwin(');
const end = src.indexOf('\n}\n', endMark);
if (start < 0 || endMark < 0 || end < 0) throw new Error('multibox twin functions not found in ogario.v4.js');
const code = src.slice(start, end + 3);

let failed = 0;
function check(name, ok) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name);
    if (!ok) failed++;
}

function cell(o) {
    return Object.assign({ x: 1000, y: 1000, size: 100, targetSize: 100, color: '#ff0000', spectator: 0,
        isPlayerCell: false, isPlayerCellMulti: false, isVirus: false, isFood: false, removed: false, invisible: false }, o);
}

/* the hide step of the per-frame cell loop (drawRender, "Not matched by id") */
function frame(ctx, cells) {
    ctx.window.legendmod.cells = cells;
    ctx.window.legendmod.time++;
    for (const c of cells) {
        if (c._lmMbPosDup) { c._lmMbPosDup = false; c.invisible = false; }
        if (!c.invisible && !c.isFood) {
            const twin = vm.runInContext('lmMultiboxPositionTwin', ctx)(c);
            if (twin) { c._lmMbPosDup = true; c.invisible = true; }
        }
    }
}
function run(cells, frames) {
    const ctx = vm.createContext({ window: { legendmod: { cells: [], time: 0 }, spects: [{}] }, Number, Math, Map });
    vm.runInContext(code, ctx);
    for (let i = 0; i < (frames || 3); i++) frame(ctx, cells);
    return cells;
}
const drawn = (cells) => cells.filter((c) => !c.invisible).length;

/* 1. The unit's own cell (spectator 1) and the main connection's copy of it: drawn once, the own copy */
{
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#00ff00' });
    const mainCopy = cell({ spectator: 0, x: 1020, color: '#00ff00' });
    run([mainCopy, own]);
    check('own cell twin: main copy hidden once, own copy drawn', mainCopy.invisible && !own.invisible);
}
/* 2. An enemy of about the same size over the unit's own cell, seen by both connections */
for (const order of ['main first', 'unit first']) {
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#00ff00' });
    const ownMain = cell({ spectator: 0, x: 1010, color: '#00ff00' });
    const enemyMain = cell({ spectator: 0, x: 1030, size: 104, targetSize: 104, color: '#0000ff' });
    const enemyUnit = cell({ spectator: 1, x: 1032, size: 104, targetSize: 104, color: '#0000ff' });
    const cells = order === 'main first' ? [ownMain, enemyMain, own, enemyUnit] : [enemyUnit, own, enemyMain, ownMain];
    run(cells);
    check('enemy over own cell (' + order + '): enemy drawn on exactly one connection', drawn([enemyMain, enemyUnit]) === 1);
    check('enemy over own cell (' + order + '): own cell drawn once', drawn([own, ownMain]) === 1 && !own.invisible);
}
/* 3. A virus over the unit's own cell, seen by both connections */
{
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#33ff33' });
    const virusMain = cell({ spectator: 0, x: 1005, isVirus: true, color: '#33ff33' });
    const virusUnit = cell({ spectator: 1, x: 1006, isVirus: true, color: '#33ff33' });
    run([virusMain, own, virusUnit]);
    check('virus over own cell: virus drawn on exactly one connection', drawn([virusMain, virusUnit]) === 1);
    check('virus over own cell: main copy stays drawn', !virusMain.invisible);
}
/* 4. A virus seen only by the main connection over the unit's own cell (unit view elsewhere) */
{
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#33ff33' });
    const virusMain = cell({ spectator: 0, isVirus: true, color: '#33ff33' });
    run([virusMain, own]);
    check('virus on one connection only: stays drawn', !virusMain.invisible);
}
/* 5. Same enemy on both connections, not near own cells: drawn once (main copy) */
{
    const a = cell({ spectator: 0, color: '#123456' });
    const b = cell({ spectator: 1, x: 1015, color: '#123456' });
    run([b, a]);
    check('enemy on both connections: drawn once, main copy', !a.invisible && b.invisible);
}
/* 6. Two different enemies of the same size, side by side, on different connections */
{
    const a = cell({ spectator: 0, color: '#123456' });
    const b = cell({ spectator: 1, x: 1015, color: '#654321' });
    run([b, a]);
    check('different colours: both drawn', drawn([a, b]) === 2);
}
/* 7. A virus next to an enemy of the same size and colour */
{
    const enemy = cell({ spectator: 0, color: '#33ff33' });
    const virus = cell({ spectator: 1, x: 1010, isVirus: true, color: '#33ff33' });
    run([virus, enemy]);
    check('virus next to an enemy: both drawn', drawn([enemy, virus]) === 2);
}
/* 8. Two enemies with the same colour but different names */
{
    const a = cell({ spectator: 0, color: '#123456', targetNick: 'alpha' });
    const b = cell({ spectator: 1, x: 1015, color: '#123456', targetNick: 'beta' });
    run([b, a]);
    check('different names: both drawn', drawn([a, b]) === 2);
    /* the name is only compared when both copies have one */
    const c = cell({ spectator: 0, color: '#123456', targetNick: 'alpha' });
    const d = cell({ spectator: 1, x: 1015, color: '#123456', targetNick: '' });
    run([d, c]);
    check('name on one copy only: still one cell', !c.invisible && d.invisible);
}
/* 9. Copies of a big cell 300 apart (radius 300 allows 360): two grid buckets away */
{
    const a = cell({ spectator: 0, x: 1000, size: 300, targetSize: 300, color: '#123456' });
    const b = cell({ spectator: 1, x: 1300, size: 300, targetSize: 300, color: '#123456' });
    run([b, a]);
    check('big cell copies 300 apart: drawn once', !a.invisible && b.invisible);
}

/* 9b. Own cells take the player's profile colour (myCustomColor on the main player, the unit's
 * profile on a unit), the other connection's copy keeps the server's colour (agar.io numbers
 * cells per connection, so only the position match can hide it). Each own cell is still drawn
 * once, the own copy; both connections, both orders. */
for (const order of ['own first', 'copy first']) {
    const mainOwn = cell({ spectator: 0, isPlayerCell: true, size: 42, targetSize: 42, color: '#01d9cc', targetNick: 'Coco' });
    const unitCopyOfMain = cell({ spectator: 1, x: 1020, size: 42, targetSize: 42, color: '#00b4e5', targetNick: 'Coco' });
    const unitOwn = cell({ spectator: 1, isPlayerCell: true, isPlayerCellMulti: true, x: 3000, size: 21, targetSize: 21, color: '#01d9cc', targetNick: 'Coco' });
    const mainCopyOfUnit = cell({ spectator: 0, x: 3015, y: 990, size: 21, targetSize: 21, color: '#e56c00', targetNick: 'Coco' });
    const cells = order === 'own first' ? [mainOwn, unitOwn, unitCopyOfMain, mainCopyOfUnit] : [mainCopyOfUnit, unitCopyOfMain, unitOwn, mainOwn];
    run(cells);
    check('profile colour (' + order + '): main player cell drawn once, the own copy', unitCopyOfMain.invisible && !mainOwn.invisible);
    check('profile colour (' + order + '): unit cell drawn once, the own copy', mainCopyOfUnit.invisible && !unitOwn.invisible);
}
/* 10. Same twins as a scan of every cell nearby (the search before the own-cell grid), frame by
 * frame, on seeded crowded scenes with 3 connections, own cells, viruses, ejected mass, hidden
 * and removed cells; and main-connection cells no longer test every crowded neighbour. */
{
    let s = 4242;
    const rnd = () => { s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647; return (s - 1) / 2147483646; };
    const cols = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    function scene(n, crowd, own) {
        const cs = [];
        const add = (o) => { cs.push(cell(o)); return cs[cs.length - 1]; };
        for (let i = 0; i < n; i++) {
            const x = (rnd() - 0.5) * 3000, y = (rnd() - 0.5) * 2000, z = 20 + rnd() * 250, col = cols[(rnd() * 4) | 0];
            const kind = rnd(), nick = rnd() < 0.5 ? 'n' + ((rnd() * 5) | 0) : '';
            const o = { x, y, size: z, targetSize: z, color: col, targetNick: nick, isVirus: kind < 0.1, isEjected: kind > 0.9 };
            const conns = 1 + ((rnd() * 3) | 0);
            for (let k = 0; k < conns; k++) add(Object.assign({}, o, { spectator: k, x: x + (rnd() - 0.5) * 40, y: y + (rnd() - 0.5) * 40, invisible: rnd() < 0.03, removed: rnd() < 0.02 }));
        }
        for (let i = 0; i < crowd; i++) {
            const x = 50 + rnd() * 200, y = 50 + rnd() * 200;
            for (let k = 0; k < 2; k++) add({ spectator: k, x: x + rnd() * 4, y: y + rnd() * 4, size: 38, targetSize: 38, color: '#00ff00', isEjected: true });
        }
        for (let i = 0; i < own; i++) {
            const x = (rnd() - 0.5) * 600, y = (rnd() - 0.5) * 600, z = 40 + rnd() * 80;
            const unit = 1 + ((rnd() * 2) | 0);
            add({ spectator: unit, isPlayerCellMulti: true, x, y, size: z, targetSize: z, color: '#abcdef' });
            add({ spectator: 0, x: x + 5, y: y - 5, size: z, targetSize: z, color: '#abcdef' });
            if (rnd() < 0.5) add({ spectator: unit === 1 ? 2 : 1, x: x - 5, y, size: z, targetSize: z, color: '#abcdef' });
            add({ spectator: 0, isPlayerCell: true, x: -x, y: -y, size: z, targetSize: z, color: '#fedcba' });
            add({ spectator: 1, x: -x + 4, y: -y, size: z, targetSize: z, color: '#fedcba' });
        }
        return cs;
    }
    /* the scan of every cell in reach, with the real match rule */
    function scanAll(ctx, cells, c) {
        const pref = vm.runInContext('_lmMbIsPreferredTwin', ctx), rad = vm.runInContext('_lmMbCellRadius', ctx);
        if (!c || c.removed || c.isFood) return null;
        if (c.spectator > 0 ? c.isPlayerCellMulti : c.isPlayerCell) return null;
        if (!Number.isFinite(c.x) || !Number.isFinite(c.y)) return null;
        const r = rad(c);
        if (!r) return null;
        if (c._refTwin && pref(c, c._refTwin, r)) return c._refTwin;
        c._refTwin = null;
        const g = new Map();
        for (const o of cells) {
            if (!o || o.removed || o.isFood || !Number.isFinite(o.x) || !Number.isFinite(o.y)) continue;
            const k = Math.floor(o.x / 256) * 65536 + Math.floor(o.y / 256);
            if (!g.has(k)) g.set(k, []);
            g.get(k).push(o);
        }
        const gx = Math.floor(c.x / 256), gy = Math.floor(c.y / 256), reach = Math.max(1, Math.ceil(Math.max(1.2 * r, 60) / 256));
        for (let ox = -reach; ox <= reach; ox++) for (let oy = -reach; oy <= reach; oy++) {
            const b = g.get((gx + ox) * 65536 + gy + oy) || [];
            for (const o of b) if (pref(c, o, r)) { c._refTwin = o; return o; }
        }
        return null;
    }
    let frames = 0, diff = 0, found = 0;
    for (const [n, crowd, own] of [[300, 0, 0], [300, 0, 12], [200, 150, 0], [200, 150, 10], [600, 60, 20]]) {
        const cells = scene(n, crowd, own);
        const ctx = vm.createContext({ window: { legendmod: { cells: cells, time: 0 }, spects: [{}, {}] }, Number, Math, Map });
        vm.runInContext(code, ctx);
        const twin = vm.runInContext('lmMultiboxPositionTwin', ctx);
        for (let f = 0; f < 4; f++) {
            ctx.window.legendmod.time++;
            for (const c of cells) if (!c.isPlayerCell && !c.isPlayerCellMulti) { c.x += (rnd() - 0.5) * 30; c.y += (rnd() - 0.5) * 30; }
            /* reference first (no side effects), then the real search, for every cell as drawn so far */
            for (const c of cells) {
                if (c._lmMbPosDup) { c._lmMbPosDup = false; c.invisible = false; }
                if (c.invisible || c.isFood) continue;
                const want = scanAll(ctx, cells, c), got = twin(c);
                if (want !== got) diff++;
                if (got) { found++; c._lmMbPosDup = true; c.invisible = true; }
            }
            frames++;
        }
    }
    check('twins identical to a scan of every cell nearby (' + frames + ' frames, ' + found + ' twins)', diff === 0 && found > 100);

    /* candidate tests per frame in a crowded bucket: 300 ejected blobs on 2 connections */
    const cells = scene(0, 300, 0);
    const ctx = vm.createContext({ window: { legendmod: { cells: cells, time: 0 }, spects: [{}] }, Number, Math, Map });
    vm.runInContext(code, ctx);
    vm.runInContext('var _lmTests = 0; var _lmPref0 = _lmMbIsPreferredTwin; _lmMbIsPreferredTwin = function (a, b, r) { _lmTests++; return _lmPref0(a, b, r); };', ctx);
    for (let f = 0; f < 3; f++) frame(ctx, cells);
    vm.runInContext('_lmTests = 0', ctx);
    frame(ctx, cells);
    const tests = vm.runInContext('_lmTests', ctx);
    check('crowded bucket, no own cells: main copies test no candidates (' + tests + ' tests for ' + cells.length + ' cells)', tests <= cells.length);
}
/* 11. The frame's real hide step and compaction (cut from drawRender) with this search, frame by
 * frame, against the same frames with the search it replaced (a Map of 256-unit buckets built
 * once per world update and scanned bucket by bucket): every cell's drawn / hidden state, its
 * twin, the copy it hides and the order of LM.cells must be identical. Seeded scenes with 2-4
 * connections, own cells, big cells, crowds, cells moving between updates, cells dying (the
 * removeCell() unhide), copies appearing as views cross, removed cells compacted mid-loop and
 * different ids on each connection (agar.io) or shared ids (Expanding Land). */
{
    const a = src.indexOf('var _cW = 0;'), b = src.indexOf('* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION', a);
    if (a < 0 || b < 0) throw new Error('frame compaction not found in ogario.v4.js');
    const compact = src.slice(a, b).slice(0, src.slice(a, b).lastIndexOf('/*'));
    /* the search before, kept here as the reference */
    const before = [
        'var _refGrid = null, _refGridTime = -1, _refGridMap = new Map(), _refOwnMap = new Map(), _refPool = [];',
        'function _refRecycle(bucket) { bucket.length = 0; _refPool.push(bucket); }',
        'function _refAdd(grid, key, c) {',
        '    var bucket = grid.get(key);',
        '    if (bucket) bucket.push(c);',
        '    else { bucket = _refPool.length ? _refPool.pop() : []; bucket.push(c); grid.set(key, bucket); }',
        '}',
        'function _refBuild() {',
        '    var LM = window.legendmod, grid = _refGridMap, own = _refOwnMap;',
        '    grid.forEach(_refRecycle); grid.clear(); own.forEach(_refRecycle); own.clear();',
        '    var cells = LM && LM.cells;',
        '    for (var i = 0; cells && i < cells.length; i++) {',
        '        var c = cells[i];',
        '        if (!c || c.removed || c.isFood || !Number.isFinite(c.x) || !Number.isFinite(c.y)) continue;',
        '        var key = Math.floor(c.x / 256) * 65536 + Math.floor(c.y / 256);',
        '        _refAdd(grid, key, c);',
        '        if (c.spectator > 0 && c.isPlayerCellMulti) _refAdd(own, key, c);',
        '    }',
        '    return grid;',
        '}',
        'lmMultiboxPositionTwin = function (cell) {',
        '    var LM = window.legendmod;',
        '    if (!cell || cell.removed || cell.isFood || !LM || !window.spects || !window.spects.length) return null;',
        '    if (cell.spectator > 0 ? cell.isPlayerCellMulti : cell.isPlayerCell) return null;',
        '    if (!Number.isFinite(cell.x) || !Number.isFinite(cell.y)) return null;',
        '    var radius = _lmMbCellRadius(cell);',
        '    if (!radius) return null;',
        '    if (cell._lmMbTwin && _lmMbIsPreferredTwin(cell, cell._lmMbTwin, radius)) return cell._lmMbTwin;',
        '    cell._lmMbTwin = null;',
        '    if (_refGridTime !== LM.time || !_refGrid) { _refGrid = _refBuild(); _refGridTime = LM.time; }',
        '    var grid = cell.spectator > 0 ? _refGrid : _refOwnMap;',
        '    if (!grid.size) return null;',
        '    var gx = Math.floor(cell.x / 256), gy = Math.floor(cell.y / 256);',
        '    var reach = Math.max(1, Math.ceil(Math.max(1.2 * radius, 60) / 256));',
        '    for (var ox = -reach; ox <= reach; ox++) for (var oy = -reach; oy <= reach; oy++) {',
        '        var bucket = grid.get((gx + ox) * 65536 + gy + oy);',
        '        for (var i = 0; bucket && i < bucket.length; i++) if (_lmMbIsPreferredTwin(cell, bucket[i], radius)) { cell._lmMbTwin = bucket[i]; return bucket[i]; }',
        '    }',
        '    return null;',
        '};'
    ].join('\n');
    const loop = 'function _frame() { var LM = window.legendmod, i, cell;\n' + compact + '\n}';
    function env(ref) {
        const ctx = vm.createContext({ window: { legendmod: { cells: [], indexedCells: {}, time: 0 }, spects: [] }, Number, Math, Map, Float64Array, Int32Array, Array });
        vm.runInContext(code + '\n' + (ref ? before : '') + '\n' + loop, ctx);
        return ctx;
    }
    /* one seeded world, replayed the same way on both clients */
    function world(seed, conns, shared, nBodies, bigFrac, own, crowd) {
        let s = seed;
        const rnd = () => { s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647; return (s - 1) / 2147483646; };
        const cols = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
        const bodies = [];
        for (let i = 0; i < nBodies; i++) {
            const big = rnd() < bigFrac, z = big ? 350 + rnd() * 1200 : 18 + rnd() * 220, kind = rnd();
            bodies.push({ raw: i + 1, x: (rnd() - 0.5) * 9000, y: (rnd() - 0.5) * 6000, vx: (rnd() - 0.5) * 30, vy: (rnd() - 0.5) * 30,
                size: kind < 0.08 ? 140 : kind > 0.92 ? 38 : z, color: cols[(rnd() * 4) | 0], nick: rnd() < 0.5 ? 'n' + ((rnd() * 6) | 0) : '',
                isVirus: kind < 0.08, isEjected: kind > 0.92, owner: -1, copies: [] });
        }
        for (let i = 0; i < crowd; i++) bodies.push({ raw: bodies.length + 1, x: 100 + rnd() * 200, y: 100 + rnd() * 200, vx: 0, vy: 0, size: 38, color: '#00ff00', nick: '', isVirus: false, isEjected: true, owner: -1, copies: [] });
        /* own cells of the main player (owner 0) and of the units (owner >= 1) */
        for (let i = 0; i < own; i++) bodies.push({ raw: bodies.length + 1, x: (rnd() - 0.5) * 900, y: (rnd() - 0.5) * 900, vx: (rnd() - 0.5) * 20, vy: (rnd() - 0.5) * 20,
            size: 40 + rnd() * 400, color: '#abcdef', nick: 'me', isVirus: false, isEjected: false, owner: (rnd() * conns) | 0, copies: [] });
        return { rnd, bodies, conns, shared };
    }
    /* each connection sees a band of the world that drifts, so copies appear and go (views cross) */
    const sees = (w, k, b, f) => { const c = (k + 0.5) / w.conns - 0.5 + 0.15 * Math.sin(f / 9 + k); return Math.abs(b.x / 9000 - c) < 0.75 / w.conns + 0.1; };
    function step(w, f, lms) {
        const r = w.rnd, ev = [];
        for (const b of w.bodies) { b.x += b.vx; b.y += b.vy; if (Math.abs(b.x) > 4500) b.vx = -b.vx; if (Math.abs(b.y) > 3000) b.vy = -b.vy; }
        if (f % 5 === 0 || f % 5 === 2) ev.push(['tick']);
        if (r() < 0.3) { const b = w.bodies[(r() * w.bodies.length) | 0]; if (b.owner < 0) b.dead = true; }
        if (r() < 0.3) { const b = w.bodies[(r() * w.bodies.length) | 0]; if (b.owner < 0) b.dead = false; }
        for (const b of w.bodies) for (let k = 0; k < w.conns; k++) {
            const want = !b.dead && sees(w, k, b, f) && r() > 0.02;
            const has = b.copies[k] !== undefined;
            if (want && !has) ev.push(['add', b, k, (r() - 0.5) * 40, (r() - 0.5) * 40, r() < 0.02]);
            else if (!want && has) ev.push(['remove', b, k]);
        }
        const jit = [];
        for (let i = 0; i < 401; i++) jit.push((r() - 0.5) * 12);
        /* the same events on both clients */
        for (const L of lms) apply(w, L, ev, jit);
        for (const e of ev) { if (e[0] === 'add') e[1].copies[e[2]] = true; else if (e[0] === 'remove') delete e[1].copies[e[2]]; }
    }
    function apply(w, L, ev, jit) {
        const LM = L.window.legendmod;
        L.copies = L.copies || new Map();
        for (const e of ev) {
            if (e[0] === 'tick') { LM.time++; continue; }
            const b = e[1], k = e[2], key = b.raw + ':' + k;
            if (e[0] === 'add') {
                const raw = w.shared ? b.raw : b.raw + 1000000 * k;
                const own = b.owner === k;
                const c = { _k: key, id: k ? raw + k * 4294967296 : raw, x: b.x + e[3], y: b.y + e[4], size: b.size, targetSize: b.size,
                    color: own && k ? '#00ffaa' : b.color, targetNick: b.nick, spectator: k, isVirus: b.isVirus, isEjected: b.isEjected, isFood: false,
                    isPlayerCell: own, isPlayerCellMulti: own && k > 0, removed: false, invisible: e[5] };
                L.copies.set(key, c);
                LM.cells.push(c);
                LM.indexedCells[c.id] = c;
                if (c.isPlayerCellMulti) LM.playerCellsMulti.push(c);
            } else {
                const c = L.copies.get(key);
                L.copies.delete(key);
                /* removeCell(): its multibox part */
                c.removed = true;
                if (c.isPlayerCellMulti && c.id >= 4294967296) {
                    const m = LM.indexedCells[c.id % 4294967296];
                    if (m && m._lmMbOwnDup) { m._lmMbOwnDup = false; m.invisible = false; }
                }
                const h = c._lmMbHides;
                if (h && h._lmMbPosDup && h._lmMbTwin === c) { h._lmMbPosDup = false; h._lmMbTwin = null; h.invisible = false; }
                c._lmMbHides = null;
                delete LM.indexedCells[c.id];
                const pi = LM.playerCellsMulti.indexOf(c);
                if (pi >= 0) LM.playerCellsMulti.splice(pi, 1);
            }
        }
        /* moving between world updates (the search keeps the buckets of the last update) */
        let j = 0;
        for (const c of LM.cells) if (!c.removed && !c.isPlayerCellMulti) { c.x += jit[j++ % jit.length]; c.y += jit[j++ % jit.length]; }
    }
    const tag = (c) => c ? c._k : null;
    function state(L) {
        const out = [];
        for (const c of L.window.legendmod.cells) out.push([c._k, !!c.invisible, !!c._lmMbPosDup, !!c._lmMbOwnDup, !!c._renderSuppressed, tag(c._lmMbTwin), tag(c._lmMbHides)].join('|'));
        return out.join(';');
    }
    let frames = 0, diffs = 0, hidden = 0, firstDiff = null;
    const cases = [[11, 2, false, 300, 0.03, 10, 0], [12, 2, true, 300, 0.03, 10, 0], [13, 3, false, 400, 0.1, 16, 40], [14, 4, false, 250, 0.2, 20, 0], [15, 3, true, 200, 0.05, 12, 120]];
    for (const [seed, conns, shared, n, big, own, crowd] of cases) {
        const w = world(seed, conns, shared, n, big, own, crowd);
        const lms = [env(false), env(true)];
        for (const L of lms) {
            for (let k = 1; k < conns; k++) L.window.spects.push({ player: true, number: k });
            L.window.legendmod.multiBoxPlayerExists = true;
            L.window.legendmod.playerCellsMulti = [];
        }
        for (let f = 0; f < 40; f++) {
            step(w, f, lms);
            for (const L of lms) L._frame();
            const sa = state(lms[0]), sb = state(lms[1]);
            if (sa !== sb) { diffs++; if (!firstDiff) firstDiff = 'seed ' + seed + ' frame ' + f; }
            hidden += (sa.match(/\|true\|true\|/g) || []).length;
            frames++;
        }
    }
    check('real frame step: same drawn cells, twins and order as the bucket-by-bucket search (' + frames + ' frames, ' + hidden + ' copies hidden)' + (firstDiff ? ', first difference: ' + firstDiff : ''), diffs === 0 && hidden > 1000);

    /* big cells (reach 8 buckets each way) over a sparse world: the search reads the cells in
     * reach column by column instead of probing each of the 17 x 17 buckets in a Map */
    const L = env(false);
    L.window.spects.push({ player: true, number: 1 });
    const LM = L.window.legendmod;
    for (let i = 0; i < 40; i++) LM.cells.push(cell({ spectator: i % 2, x: -4000 + i * 200, y: (i % 5) * 900, size: 1500, targetSize: 1500, color: '#0' + (10000 + i) }));
    vm.runInContext('var _lmGets = 0; Map.prototype.get = (function (g) { return function (k) { _lmGets++; return g.call(this, k); }; })(Map.prototype.get);', L);
    const twin = vm.runInContext('lmMultiboxPositionTwin', L);
    LM.time++;
    for (const c of LM.cells) twin(c);
    vm.runInContext('_lmGets = 0', L);
    for (const c of LM.cells) { c._lmMbTwin = null; twin(c); }
    const gets = vm.runInContext('_lmGets', L);
    check('big cells over a sparse world: no bucket-by-bucket probing (' + gets + ' bucket lookups for 40 searches)', gets <= 40 * 17);
}

if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all multibox twin checks passed');
