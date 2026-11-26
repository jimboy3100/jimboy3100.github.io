// Unit check of the multibox position twin rule (lmMultiboxPositionTwin in ogario.v4.js):
// a cell seen by two connections is drawn once, and a different cell over a unit's own
// cell (enemy of the same size, virus) is never hidden on both connections.
// Usage: node developers/tests/mbtwin.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../../ogario/ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
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

if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all multibox twin checks passed');
