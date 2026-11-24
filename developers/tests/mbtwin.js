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

if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all multibox twin checks passed');
