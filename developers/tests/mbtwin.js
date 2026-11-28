// Unit check of the multibox position twin rule (lmMultiboxPositionTwin in ogario.v4.js), run
// through the frame's real hide step and compaction (cut from drawRender): a cell seen by two
// connections is drawn once, matched by position (time-adjusted), size, kind and server name, one
// to one; never by raw id and never by colour (agar.io gives every connection its own colour for
// one cell). A different cell next to a copy (enemy of the same size with another name, virus, a
// split piece, a cell with the same raw id) is never hidden. The drawn copy keeps the colour the
// cell was shown with first, and the copy drawn last frame stays drawn (no switching).
// Section 16: the same rules with 1 to 6 playing clients x Full Map off / on (lib/mbplayers.js).
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
const ca = src.indexOf('var _cW = 0;'), cb = src.indexOf('* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION', ca);
if (ca < 0 || cb < 0) throw new Error('frame compaction not found in ogario.v4.js');
const compact = src.slice(ca, cb).slice(0, src.slice(ca, cb).lastIndexOf('/*'));
/* the frame: its hide step (lmMbFrameHide, before compareCells), then the compaction */
const loop = 'function _frame() { var LM = window.legendmod, i, cell;\nlmMbFrameHide();\n' + compact + '\n}';

let failed = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']'));
    if (!ok) failed++;
}

let nextId = 1;
function cell(o) {
    return Object.assign({ id: nextId++, x: 1000, y: 1000, size: 100, targetSize: 100, color: '#ff0000', spectator: 0,
        isPlayerCell: false, isPlayerCellMulti: false, isVirus: false, isEjected: false, isFood: false, removed: false, invisible: false }, o);
}
function env(units) {
    const spects = [];
    for (let k = 1; k <= (units || 1); k++) spects.push({ player: true, number: k });
    const ctx = vm.createContext({ window: { legendmod: { cells: [], indexedCells: {}, time: 0, multiBoxPlayerExists: true, playerCellsMulti: [] }, spects },
        Number, Math, Map, Float64Array, Int32Array, Array });
    vm.runInContext(code + '\n' + loop, ctx);
    return ctx;
}
/* frames of the real hide step over these cells (in this order) */
function run(cells, frames, ctx) {
    ctx = ctx || env(3);
    const LM = ctx.window.legendmod;
    LM.cells = cells;
    for (const c of cells) LM.indexedCells[c.id] = c;
    for (let i = 0; i < (frames || 3); i++) { LM.time++; ctx._frame(); }
    return ctx;
}
const drawn = (cells) => cells.filter((c) => !c.invisible).length;

/* 1. The unit's own cell (spectator 1) and the main connection's copy of it: drawn once, the own copy */
{
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#00ff00' });
    const mainCopy = cell({ spectator: 0, x: 1004, color: '#00ff00' });
    run([mainCopy, own]);
    check('own cell twin: main copy hidden once, own copy drawn', mainCopy.invisible && !own.invisible);
}
/* 2. An enemy of about the same size over the unit's own cell, seen by both connections */
for (const order of ['main first', 'unit first']) {
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#00ff00', _lmRawColor: '#00e600' });
    const ownMain = cell({ spectator: 0, x: 1003, color: '#00e600', _lmRawColor: '#00e600' });
    const enemyMain = cell({ spectator: 0, x: 1006, size: 104, targetSize: 104, color: '#0000ff', _lmRawColor: '#0000e6' });
    const enemyUnit = cell({ spectator: 1, x: 1008, size: 104, targetSize: 104, color: '#0000ff', _lmRawColor: '#0000e6' });
    const cells = order === 'main first' ? [ownMain, enemyMain, own, enemyUnit] : [enemyUnit, own, enemyMain, ownMain];
    run(cells);
    check('enemy over own cell (' + order + '): enemy drawn on exactly one connection', drawn([enemyMain, enemyUnit]) === 1);
    check('enemy over own cell (' + order + '): own cell drawn once, the own copy (ownership kept)', drawn([own, ownMain]) === 1 && !own.invisible);
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
/* 5. Same enemy on both connections, different raw ids: drawn once (main copy) */
{
    const a = cell({ spectator: 0, color: '#123456' });
    const b = cell({ spectator: 1, x: 1006, color: '#123456' });
    run([b, a]);
    check('different ids, same cell: one representative, the main copy', !a.invisible && b.invisible);
}
/* 6. One cell, each connection with its own server colour (live agar.io: always): drawn once, in
 * the colour it was shown with first, also after the drawn copy changes */
{
    const ctx = env(2);
    const a = cell({ spectator: 1, color: '#7de506', _lmRawColor: '#7de506' });
    run([a], 2, ctx);
    const b = cell({ spectator: 2, x: 1004, color: '#5106e5', _lmRawColor: '#5106e5' });
    const c = cell({ spectator: 0, x: 1002, color: '#06e575', _lmRawColor: '#06e575' });
    ctx.window.legendmod.cells.push(b, c);
    run(ctx.window.legendmod.cells, 2, ctx);
    check('other server colour on every connection: drawn once', drawn([a, b, c]) === 1 && !c.invisible, drawn([a, b, c]));
    check('other server colour on every connection: drawn in the colour shown first', c.color === '#7de506' && a.color === '#7de506' && b.color === '#7de506', [a.color, b.color, c.color]);
    c.removed = true;
    run(ctx.window.legendmod.cells, 2, ctx);
    check('drawn copy gone: the survivor keeps that colour', drawn([a, b]) === 1 && (a.invisible ? b : a).color === '#7de506');
    /* two different enemies of the same size side by side: other names */
    const d = cell({ spectator: 0, color: '#123456', _lmSrvName: 'alpha' });
    const e = cell({ spectator: 1, x: 1006, color: '#123456', _lmSrvName: 'beta' });
    run([e, d]);
    check('same colour, other names: both drawn', drawn([d, e]) === 2);
}
/* 6b. Hysteresis: a cell drawn by spectator 7 that comes into the view of spectator 3 stays drawn
 * by spectator 7 (the new copy hides behind it); two copies both new: the lower number */
{
    const ctx = env(7);
    const a = cell({ spectator: 7, color: '#111111' });
    run([a], 2, ctx);
    const b = cell({ spectator: 3, x: 1003, color: '#222222' });
    ctx.window.legendmod.cells.push(b);
    run(ctx.window.legendmod.cells, 5, ctx);
    check('copy that comes later hides behind the drawn one', !a.invisible && b.invisible);
    const c = cell({ spectator: 5, x: 3000, color: '#333333' });
    const d = cell({ spectator: 4, x: 3002, color: '#444444' });
    ctx.window.legendmod.cells.push(c, d);
    run(ctx.window.legendmod.cells, 3, ctx);
    check('two new copies: the lower number drawn', !d.invisible && c.invisible);
    /* the main connection's copy is drawn before a spectator's, also one drawn already; the colour stays */
    const m = cell({ spectator: 0, x: 1001, color: '#555555' });
    ctx.window.legendmod.cells.push(m);
    run(ctx.window.legendmod.cells, 2, ctx);
    check('main copy drawn first, colour kept', !m.invisible && a.invisible && b.invisible && m.color === '#111111', [m.invisible, a.invisible, b.invisible, m.color]);
}
/* 6d. Party: skins are found by nick and the main connection's colour, so the main copy keeps its
 * colour and the spectator's copy takes it (also when the spectator saw the cell first) */
{
    const ctx = env(2);
    ctx.window.legendmod.gameMode = ':party';
    const a = cell({ spectator: 1, color: '#7de506' });
    run([a], 2, ctx);
    const m = cell({ spectator: 0, x: 1002, color: '#06e575' });
    ctx.window.legendmod.cells.push(m);
    run(ctx.window.legendmod.cells, 2, ctx);
    check('party: main copy drawn in its own colour, the copy takes it', !m.invisible && a.invisible && m.color === '#06e575' && a.color === '#06e575', [m.color, a.color]);
}
/* 6c. The kept link (the copy it hid behind last frame) reaches 1.5 times the tolerance; a new
 * link only the tolerance */
{
    const ctx = env(2);
    const a = cell({ spectator: 1, color: '#7de506' });
    run([a], 2, ctx);
    const b = cell({ spectator: 2, x: 1004, color: '#5106e5' });
    ctx.window.legendmod.cells.push(b);
    run(ctx.window.legendmod.cells, 2, ctx);
    check('kept link: hidden', b.invisible && b._lmMbTwin === a);
    b.targetX = 1000 + 12 * 1.4; /* tolerance 12 for radius 100, not moving */
    run(ctx.window.legendmod.cells, 1, ctx);
    check('kept link within 1.5 tolerance: still hidden', b.invisible);
    const c = cell({ spectator: 2, x: 3000 + 12 * 1.4, color: '#5106e5' });
    const d = cell({ spectator: 1, x: 3000, color: '#7de506' });
    run([c, d], 1, env(2));
    check('new link beyond the tolerance: both drawn', drawn([c, d]) === 2);
}
/* 7. A virus next to an enemy of the same size and colour */
{
    const enemy = cell({ spectator: 0, color: '#33ff33' });
    const virus = cell({ spectator: 1, x: 1004, isVirus: true, color: '#33ff33' });
    run([virus, enemy]);
    check('virus next to an enemy: both drawn', drawn([enemy, virus]) === 2);
}
/* 8. Two enemies with the same colour but different server names (_lmSrvName, not the drawn nick) */
{
    const a = cell({ spectator: 0, color: '#123456', targetNick: 'alpha', _lmSrvName: 'alpha' });
    const b = cell({ spectator: 1, x: 1006, color: '#123456', targetNick: 'beta', _lmSrvName: 'beta' });
    run([b, a]);
    check('different names: both drawn', drawn([a, b]) === 2);
    /* the name is only compared when both copies have one */
    const c = cell({ spectator: 0, color: '#123456', targetNick: 'alpha', _lmSrvName: 'alpha' });
    const d = cell({ spectator: 1, x: 1006, color: '#123456', targetNick: '' });
    run([d, c]);
    check('name on one copy only: still one cell', !c.invisible && d.invisible);
}
/* 9. Tolerance: copies of a big cell 30 apart (radius 300 allows 36) are one cell; a different
 * cell of the same size and colour 60 or 120 apart is not (the old rule, max(1.2 r, 60) on drawn
 * positions, hid it) */
{
    const a = cell({ spectator: 0, x: 1000, size: 300, targetSize: 300, color: '#123456' });
    const b = cell({ spectator: 1, x: 1030, size: 300, targetSize: 300, color: '#123456' });
    run([b, a]);
    check('big cell copies 30 apart: drawn once', !a.invisible && b.invisible);
    const c = cell({ spectator: 0, x: 1000, size: 300, targetSize: 300, color: '#123456' });
    const d = cell({ spectator: 1, x: 1120, size: 300, targetSize: 300, color: '#123456' });
    run([d, c]);
    check('two big cells 120 apart: both drawn', drawn([c, d]) === 2);
    const e = cell({ spectator: 0, x: 1000, size: 100, targetSize: 100, color: '#123456' });
    const f = cell({ spectator: 1, x: 1060, size: 100, targetSize: 100, color: '#123456' });
    run([f, e]);
    check('two cells 60 apart (radius 100): both drawn', drawn([e, f]) === 2);
}
/* 9a. Time-adjusted: a moving cell's copies from packets 80 ms apart (40 units at 0.5 per ms)
 * are one cell; the same two positions without speed are two cells */
{
    const a = cell({ spectator: 0, x: 1000, targetX: 1000, targetY: 1000, updateTime: 100, _lmVX: 0.5, _lmVY: 0 });
    const b = cell({ spectator: 1, x: 1040, targetX: 1040, targetY: 1000, updateTime: 180, _lmVX: 0.5, _lmVY: 0 });
    run([b, a]);
    check('moving cell, packets 80 ms apart: drawn once', !a.invisible && b.invisible);
    const c = cell({ spectator: 0, x: 1000, targetX: 1000, targetY: 1000, updateTime: 100 });
    const d = cell({ spectator: 1, x: 1040, targetX: 1040, targetY: 1000, updateTime: 180 });
    run([d, c]);
    check('same positions, not moving: two cells, both drawn', drawn([c, d]) === 2);
}
/* 9b. Own cells take the player's profile colour (myCustomColor on the main player, the unit's
 * profile on a unit), the other connection's copy keeps the server's colour: matched by the server
 * colour (or, not known yet, without the colour). Each own cell is drawn once, the own copy; both
 * connections, both orders. */
for (const raw of [false, true]) for (const order of ['own first', 'copy first']) {
    const rc = (v) => raw ? { _lmRawColor: v } : {};
    const mainOwn = cell(Object.assign({ spectator: 0, isPlayerCell: true, size: 42, targetSize: 42, color: '#01d9cc', targetNick: 'Coco' }, rc('#00b4e5')));
    const unitCopyOfMain = cell(Object.assign({ spectator: 1, x: 1004, size: 42, targetSize: 42, color: '#00b4e5', targetNick: 'Coco' }, rc('#00b4e5')));
    const unitOwn = cell(Object.assign({ spectator: 1, isPlayerCell: true, isPlayerCellMulti: true, x: 3000, size: 21, targetSize: 21, color: '#01d9cc', targetNick: 'Coco' }, rc('#e56c00')));
    const mainCopyOfUnit = cell(Object.assign({ spectator: 0, x: 3004, y: 997, size: 21, targetSize: 21, color: '#e56c00', targetNick: 'Coco' }, rc('#e56c00')));
    const cells = order === 'own first' ? [mainOwn, unitOwn, unitCopyOfMain, mainCopyOfUnit] : [mainCopyOfUnit, unitCopyOfMain, unitOwn, mainOwn];
    run(cells);
    const tag = (raw ? 'server colour' : 'no colour yet') + ', ' + order;
    check('profile colour (' + tag + '): main player cell drawn once, the own copy', unitCopyOfMain.invisible && !mainOwn.invisible);
    check('profile colour (' + tag + '): unit cell drawn once, the own copy', mainCopyOfUnit.invisible && !unitOwn.invisible);
}
/* 9c. An enemy over the unit's own cell with another server name is never hidden behind it (the
 * own cell shows the profile nick; its server name is compared) */
{
    const own = cell({ spectator: 1, isPlayerCellMulti: true, color: '#01d9cc', targetNick: 'Coco', _lmSrvName: 'Coco' });
    const enemy = cell({ spectator: 0, x: 1002, color: '#777777', targetNick: 'Rex', _lmSrvName: 'Rex' });
    run([enemy, own]);
    check('enemy over an own cell, other server name: both drawn', drawn([own, enemy]) === 2);
}
/* 12. Raw ids say nothing across connections: the same raw id on two connections, two cells */
{
    const STEP = 4294967296;
    const mainCell = cell({ id: 77, spectator: 0, x: 1000, color: '#123456' });
    const unitCell = cell({ id: 77 + STEP, spectator: 1, x: 5000, color: '#123456' });
    const unitOwn = cell({ id: 78 + STEP, spectator: 1, isPlayerCellMulti: true, x: -3000, color: '#00ff00' });
    const mainOther = cell({ id: 78, spectator: 0, x: 3000, color: '#654321' });
    const ctx = run([mainCell, unitCell, unitOwn, mainOther]);
    check('same raw id, different cells: both drawn, both kept in LM.cells', drawn([mainCell, unitCell]) === 2 && ctx.window.legendmod.cells.includes(unitCell));
    check("main cell with the raw id of a unit's own cell: not hidden", !mainOther.invisible && !unitOwn.invisible);
}
/* 13. One to one (split / merge): a connection's two pieces never hide behind one copy */
{
    /* the main connection sees one piece, the unit both pieces of a split (same colour and size) */
    const a1 = cell({ spectator: 0, x: 1000, size: 40, targetSize: 40, color: '#abcabc' });
    const b1 = cell({ spectator: 1, x: 1002, size: 40, targetSize: 40, color: '#abcabc' });
    const b2 = cell({ spectator: 1, x: 1006, size: 40, targetSize: 40, color: '#abcabc' });
    for (const order of [[b2, b1, a1], [a1, b1, b2]]) {
        for (const c of order) { c.invisible = false; c._lmMbPosDup = false; c._lmMbTwin = null; }
        run(order.slice());
        check('split piece seen by one connection only stays drawn (' + (order[0] === a1 ? 'main first' : 'unit first') + ')', drawn([a1, b1, b2]) === 2 && b1.invisible && !b2.invisible);
    }
    /* merging own pieces of a unit (overlapping) with their main copies: each drawn once, own copy */
    const u1 = cell({ spectator: 1, isPlayerCellMulti: true, x: 2000, size: 80, targetSize: 80, color: '#00ff00', _lmRawColor: '#00aa00' });
    const u2 = cell({ spectator: 1, isPlayerCellMulti: true, x: 2009, size: 80, targetSize: 80, color: '#00ff00', _lmRawColor: '#00aa00' });
    const m1 = cell({ spectator: 0, x: 2001, size: 80, targetSize: 80, color: '#00aa00', _lmRawColor: '#00aa00' });
    const m2 = cell({ spectator: 0, x: 2010, size: 80, targetSize: 80, color: '#00aa00', _lmRawColor: '#00aa00' });
    run([m2, u1, m1, u2]);
    check('merging own pieces: both own copies drawn, both main copies hidden', !u1.invisible && !u2.invisible && m1.invisible && m2.invisible);
}
/* 14. The drawn copy goes: the hidden one is drawn in the very next frame (no frame without it) */
{
    const ctx = env(2);
    const a = cell({ spectator: 0, color: '#123456' });
    const b = cell({ spectator: 1, x: 1003, color: '#123456' });
    const c = cell({ spectator: 2, x: 1004, color: '#123456' });
    run([c, b, a], 2, ctx);
    const before = drawn([a, b, c]);
    a.removed = true;
    run(ctx.window.legendmod.cells, 1, ctx);
    check('representative gone: one survivor drawn at once', before === 1 && drawn([b, c]) === 1 && !b.invisible && c.invisible, before + '/' + drawn([b, c]));
}

/* 15. A connection whose transform is not verified (spect.js _lmFeedOk false: PROVISIONAL,
 * CONFLICTED): its cells are not drawn, hide nothing and nothing hides behind them, except its own
 * cells (a multibox unit's), which stay drawn with the main copy hidden behind them */
{
    const ctx = env(2);
    ctx.window.spects[1]._lmFeedOk = () => false;
    const a = cell({ spectator: 2, x: 1000, color: '#111111' });
    const b = cell({ spectator: 1, x: 1003, color: '#222222' });
    /* its own cell stands in for the main copy only with the same server name on both */
    const own = cell({ spectator: 2, isPlayerCellMulti: true, x: 5000, color: '#333333', _lmSrvName: 'U' });
    const m = cell({ spectator: 0, x: 5002, color: '#444444', _lmSrvName: 'U' });
    /* at a wrong place (mirrored), its own cell lands on other players' unnamed cells */
    const own2 = cell({ spectator: 2, isPlayerCellMulti: true, x: 8000, color: '#333333', _lmSrvName: 'U' });
    const m2 = cell({ spectator: 0, x: 8002, color: '#555555' });
    const v2 = cell({ spectator: 1, x: 8003, color: '#666666' });
    const own3 = cell({ spectator: 2, isPlayerCellMulti: true, x: -3000, color: '#333333', _lmSrvName: 'U' });
    const m3 = cell({ spectator: 0, x: -3002, color: '#777777', _lmSrvName: 'other' });
    run([a, b, own, m, own2, m2, v2, own3, m3], 3, ctx);
    check('unverified connection: its cell not drawn, the verified copy drawn', a.invisible && !b.invisible && !b._lmMbTwin);
    check('unverified unit: its own cell drawn, the main copy (same server name) hidden behind it', !own.invisible && m.invisible);
    check('unverified unit: its own cell hides no unnamed cell of another connection', !own2.invisible && !m2.invisible && drawn([m2, v2]) === 1 && m2._lmMbTwin !== own2 && v2._lmMbTwin !== own2);
    check('unverified unit: its own cell hides no cell of another name', !own3.invisible && !m3.invisible);
    ctx.window.spects[1]._lmFeedOk = () => true;
    run(ctx.window.legendmod.cells, 2, ctx);
    check('verified again: one copy drawn', drawn([a, b]) === 1);
}
/* 15b. A multibox unit not verified yet but steered (transformReady: the camera follows it): the
 * cells only it sees are drawn (the player could be eaten by a cell he does not see), they hide
 * nothing and nothing hides behind them; inside the main server view the main copy draws them */
{
    const ctx = env(2);
    const unit = ctx.window.spects[1];
    unit._lmFeedOk = () => false;
    unit.transformReady = () => true;
    const LM = ctx.window.legendmod;
    LM.srvViewMinX = -1000; LM.srvViewMinY = -1000; LM.srvViewMaxX = 1000; LM.srvViewMaxY = 1000;
    const enemy = cell({ spectator: 2, x: 6000, y: 6000, color: '#123456' });
    const virus = cell({ spectator: 2, x: 6500, y: 6000, isVirus: true, color: '#33ff33' });
    /* a verified spectator's cell at the same place as one of the unit's cells */
    const v = cell({ spectator: 1, x: 7000, y: 6000, color: '#222222' });
    const u = cell({ spectator: 2, x: 7002, y: 6000, color: '#333333' });
    const inMain = cell({ spectator: 2, x: 0, y: 0, color: '#444444' });
    /* centre 50 outside the main view, radius 100: the main connection gets it too */
    const nearMain = cell({ spectator: 2, x: 1050, y: 0, color: '#555555' });
    run([enemy, virus, v, u, inMain, nearMain], 3, ctx);
    check('unverified unit: an enemy only it sees is drawn', !enemy.invisible && !virus.invisible);
    check('unverified unit: its cells hide nothing and hide behind nothing', !v.invisible && !v._lmMbTwin && !u.invisible && !u._lmMbTwin);
    check('unverified unit: its cell inside the main server view is left to the main connection', inMain.invisible);
    check('unverified unit: its cell inside the main server view grown by its radius is left to the main connection', nearMain.invisible);
    /* the verified spectator 1 sees x 6800..7200, y 5800..6200 (fresh view) */
    const sp1 = ctx.window.spects[0];
    sp1._lmServerViewDisplay = (o) => { o[0] = 6800; o[1] = 5800; o[2] = 7200; o[3] = 6200; return o; };
    sp1.isSocketOpen = () => true;
    sp1.time = Date.now();
    run(LM.cells, 1, ctx);
    check('unverified unit: its cell inside a verified spectator\'s fresh view is left to that spectator (drawn once)',
        u.invisible && !v.invisible && drawn([u, v]) === 1 && !enemy.invisible && !virus.invisible);
    sp1.time = Date.now() - 2000;
    run(LM.cells, 1, ctx);
    check('unverified unit: a spectator\'s stalled view (2 s old) does not take its cell', !u.invisible && !v.invisible);
    sp1.time = Date.now();
    sp1._lmCoverageOk = () => false;
    run(LM.cells, 1, ctx);
    check('unverified unit: a spectator whose own coverage test says stale does not take its cell', !u.invisible);
    delete sp1._lmServerViewDisplay;
    unit.transformReady = () => false;
    run(LM.cells, 1, ctx);
    check('unit not steered yet: its cells are not drawn', enemy.invisible && virus.invisible && u.invisible);
}

/* 10. Search against a scan of every cell (same rule, nearest + mutual nearest), frame by frame,
 * on seeded crowded scenes with 3 connections, own cells, viruses, ejected mass, hidden and
 * removed cells; and the candidate tests per frame in a crowded bucket. */
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
            const o = { x, y, size: z, targetSize: z, color: col, targetNick: nick, _lmSrvName: nick, isVirus: kind < 0.1, isEjected: kind > 0.9 };
            const conns = 1 + ((rnd() * 3) | 0);
            for (let k = 0; k < conns; k++) add(Object.assign({}, o, { spectator: k, x: x + (rnd() - 0.5) * 12, y: y + (rnd() - 0.5) * 12, invisible: rnd() < 0.03, removed: rnd() < 0.02 }));
        }
        for (let i = 0; i < crowd; i++) {
            const x = 50 + rnd() * 200, y = 50 + rnd() * 200;
            for (let k = 0; k < 2; k++) add({ spectator: k, x: x + rnd() * 4, y: y + rnd() * 4, size: 38, targetSize: 38, color: '#00ff00', isEjected: true });
        }
        for (let i = 0; i < own; i++) {
            const x = (rnd() - 0.5) * 600, y = (rnd() - 0.5) * 600, z = 40 + rnd() * 80;
            const unit = 1 + ((rnd() * 2) | 0);
            add({ spectator: unit, isPlayerCellMulti: true, x, y, size: z, targetSize: z, color: '#abcdef' });
            add({ spectator: 0, x: x + 3, y: y - 3, size: z, targetSize: z, color: '#abcdef' });
            if (rnd() < 0.5) add({ spectator: unit === 1 ? 2 : 1, x: x - 3, y, size: z, targetSize: z, color: '#abcdef' });
            add({ spectator: 0, isPlayerCell: true, x: -x, y: -y, size: z, targetSize: z, color: '#fedcba' });
            add({ spectator: 1, x: -x + 4, y: -y, size: z, targetSize: z, color: '#fedcba' });
        }
        return cs;
    }
    /* the scan of every cell, with the real match rule */
    function scanAll(ctx, cells, c) {
        const dist = vm.runInContext('_lmMbTwinDist2', ctx), rad = vm.runInContext('_lmMbCellRadius', ctx);
        if (!c || c.removed || c.isFood) return null;
        if (c.spectator > 0 ? c.isPlayerCellMulti : c.isPlayerCell) return null;
        const r = rad(c);
        if (!r) return null;
        const mine = c.spectator > 0 ? c.spectator : 0;
        let best = null, bestD = Infinity;
        if (c._refTwin) { const d = dist(c, c._refTwin, r, false, true); if (d >= 0) { best = c._refTwin; bestD = d; } }
        c._refTwin = null;
        if (!best) for (const o of cells) {
            if (o.removed || o.isFood || (o.spectator > 0 ? o.spectator : 0) === mine) continue;
            if (mine === 0 && !(o.spectator > 0 && o.isPlayerCellMulti)) continue;
            const d = dist(c, o, r);
            if (d >= 0 && (d < bestD || (d === bestD && best && o.id < best.id))) { best = o; bestD = d; }
        }
        if (!best) return null;
        let near = null, nearD = Infinity;
        for (const o of cells) {
            if (o.removed || o.isFood || (o.spectator > 0 ? o.spectator : 0) !== mine) continue;
            const d = dist(o, best, rad(o), true);
            if (d >= 0 && (d < nearD || (d === nearD && near && o.id < near.id))) { near = o; nearD = d; }
        }
        if (near && near !== c) return null;
        c._refTwin = best;
        return best;
    }
    let frames = 0, diff = 0, found = 0;
    for (const [n, crowd, own] of [[250, 0, 12], [150, 150, 10], [300, 60, 20]]) {
        const cells = scene(n, crowd, own);
        const ctx = env(2);
        ctx.window.legendmod.cells = cells;
        const twin = vm.runInContext('lmMultiboxPositionTwin', ctx);
        /* the frame's hide step fills which connections feed (both are verified here) */
        vm.runInContext('_lmMbFeed[1] = _lmMbFeed[2] = true;', ctx);
        for (let f = 0; f < 3; f++) {
            /* cells move between world updates; the search indexes them once per update */
            for (const c of cells) if (!c.isPlayerCell && !c.isPlayerCellMulti) { c.x += (rnd() - 0.5) * 6; c.y += (rnd() - 0.5) * 6; }
            ctx.window.legendmod.time++;
            /* as the frame: every copy hidden last frame is shown first */
            for (const c of cells) if (c._lmMbPosDup) { c._lmMbPosDup = false; c.invisible = false; }
            for (const c of cells) {
                if (c.invisible || c.isFood) continue;
                const want = scanAll(ctx, cells, c), got = twin(c);
                if (want !== got) diff++;
                if (got) { found++; c._lmMbPosDup = true; c.invisible = true; }
            }
            frames++;
        }
    }
    check('twins identical to a scan of every cell (' + frames + ' frames, ' + found + ' twins)', diff === 0 && found > 100, diff);

    /* candidate tests per frame in a crowded bucket: 300 ejected blobs on 2 connections */
    const cells = scene(0, 300, 0);
    const ctx = run(cells, 3, env(1));
    vm.runInContext('var _lmTests = 0; var _lmD0 = _lmMbTwinDist2; _lmMbTwinDist2 = function (a, b, r, o, k) { _lmTests++; return _lmD0(a, b, r, o, k); };', ctx);
    run(cells, 1, ctx);
    const tests = vm.runInContext('_lmTests', ctx);
    check('crowded bucket, no own cells: main copies test no candidates (' + tests + ' tests for ' + cells.length + ' cells)', tests <= cells.length * 4, tests);

    /* big cells over a sparse world: the search reads the cells in reach column by column */
    const L = env(1);
    const LM = L.window.legendmod;
    for (let i = 0; i < 40; i++) LM.cells.push(cell({ spectator: i % 2, x: -4000 + i * 200, y: (i % 5) * 900, size: 1500, targetSize: 1500, color: '#0' + (10000 + i) }));
    vm.runInContext('var _lmGets = 0; Map.prototype.get = (function (g) { return function (k) { _lmGets++; return g.call(this, k); }; })(Map.prototype.get);', L);
    const twin = vm.runInContext('lmMultiboxPositionTwin', L);
    vm.runInContext('_lmMbFeed[1] = true;', L);
    LM.time++;
    for (const c of LM.cells) twin(c);
    vm.runInContext('_lmGets = 0', L);
    for (const c of LM.cells) { c._lmMbTwin = null; twin(c); }
    const gets = vm.runInContext('_lmGets', L);
    check('big cells over a sparse world: no bucket-by-bucket probing (' + gets + ' bucket lookups for 40 searches)', gets <= 40 * 17);

}

/* A split reaches the connections one packet apart: connection 1 has the parent split already
 * (size 71, 100 before that packet), connection 2 not yet (100, its packet 25 ms older): drawn
 * once, not as a second bigger cell for a tick. A cell of 71 next to a cell of 100 that changed
 * no size is not matched. */
{
    const a = cell({ spectator: 1, size: 71, targetSize: 71, startSize: 100, updateTime: 1000 });
    const b = cell({ spectator: 2, x: 1003, size: 100, targetSize: 100, startSize: 100, updateTime: 975 });
    run([a, b], 2);
    check('split one packet apart (71 on one connection, 100 on the other): drawn once', drawn([a, b]) === 1, drawn([a, b]));
    const c = cell({ spectator: 1, size: 71, targetSize: 71, startSize: 71, updateTime: 1000 });
    const d = cell({ spectator: 2, x: 1003, size: 100, targetSize: 100, startSize: 100, updateTime: 975 });
    run([c, d], 2);
    check('  a cell of 71 next to one of 100 (no size change): both drawn', drawn([c, d]) === 2, drawn([c, d]));
}
/* 16. 1 to 6 playing clients (the main player and K - 1 units with the sparse numbers 1, 2, 18, 5,
 * 9) with Full Map off / on (tiles 3, 4, 20, 21 with shifted and mirrored transforms), built by
 * lib/mbplayers.js over this hide step and the units' real beforecalculation: own cells seen by
 * every connection, shared enemies, a virus, ejected mass, cells only one unit or only the tiles
 * see, pellets. Then the last unit dies, respawns (a new life), P2 reconnects (a new socket and
 * new raw ids), the last unit is removed, the drawn copy of a shared enemy leaves and the main
 * player dies (onPlayerDeath's switch). After each: no cell drawn twice or not at all, every own
 * cell drawn (its owner's copy), the drawn copy by the rule (own, main, lowest number), own mass
 * of each player = sum r^2 / 100 of its cells, no cell owned twice. Configurations today's code
 * fails go in KNOWN ('KNOWN N>2: what, why, file:line'); none does. */
{
    const MB = require('./lib/mbplayers');
    const KNOWN = {};
    const t0 = Date.now();
    for (let K = 1; K <= 6; K++) for (const fm of [false, true]) {
        const s = MB.scene({ players: K, fullMap: fm, v4: process.argv[2] });
        MB.populate(s);
        const bad = [];
        const at = (what) => { const r = s.audit(); if (!r.ok) bad.push(what + ': ' + r.text); };
        s.step(3); at('start');
        const last = s.players[K - 1].slot;
        if (K > 1) {
            s.kill(last); s.step(2); at('P' + last + ' dies');
            s.respawn(last); s.step(2); at('P' + last + ' respawns');
            s.reconnect(2); s.step(2); at('P2 reconnects');
        }
        if (K > 2) { s.remove(last); s.step(2); at('P' + last + ' removed'); }
        const e = s.ents.find((x) => x.kind === 'enemy' && !x.gone && x.copies.size > 2);
        const rep = e && [...e.copies.values()].find((c) => !c.invisible && s.LM.cells.includes(c));
        if (rep) { s.unobserve(e, rep._lmSrc); s.step(1); at('the drawn copy of a shared enemy leaves'); }
        s.kill(1); s.step(2); at('P1 dies');
        MB.verdict(check, 'K=' + K + ' (' + K + ' playing, Full Map ' + (fm ? 'on' : 'off') + '): every cell drawn once, own cells drawn, own mass counted once, through death / respawn / reconnect / removal',
            !bad.length, bad.join(' / '), KNOWN[K + (fm ? '/fm' : '')]);
    }
    /* Own cells of the last two players stacked (same server name and size, same place), seen by
     * every connection: each drawn once (two cells, not three or four). With two players only the
     * Full Map tiles see both (the main player owns one), from three players on the main socket
     * and the other units do too. */
    const STACK = 'KNOWN N>2: an observer\'s copies of two stacked own cells are paired greedily (each takes the nearest own cell, ' +
        'ogario.v4.js:2274 lmMultiboxPositionTwin, then the mutual-nearest test at 2281): when both copies pick the same own cell ' +
        'the other copy stays drawn (one cell drawn twice); only the main player\'s copies of its own never search, so 2 players without Full Map hold';
    for (let K = 2; K <= 6; K++) for (const fm of [false, true]) {
        const s = MB.scene({ players: K, fullMap: fm, v4: process.argv[2] });
        MB.populate(s);
        for (const p of s.players.slice(-2)) s.own(p.slot, { x: 5000, y: 0, size: 70, name: 'Same', seenBy: s.allSources() });
        s.step(3);
        const r = s.audit();
        MB.verdict(check, 'K=' + K + ' (Full Map ' + (fm ? 'on' : 'off') + '): own cells of two players stacked, each drawn once', r.ok, r.text,
            K === 2 && !fm ? undefined : STACK);
    }
    /* K = 2: the same cells give the same result in the two-player harness above */
    {
        const s = MB.scene({ players: 2, v4: process.argv[2] });
        MB.populate(s);
        const copies = s.LM.cells.map((c) => Object.assign({}, c, { _ent: null }));
        run(copies, 3, env(1));
        s.step(3);
        const diff = s.LM.cells.filter((c, i) => c.invisible !== copies[i].invisible || c.id !== copies[i].id).length;
        check('K=2: the scene gives the two-player harness\'s result on the same ' + copies.length + ' cells', diff === 0 && copies.length === s.LM.cells.length, diff);
    }
    console.log('info 1 to 6 players x Full Map off / on: ' + (Date.now() - t0) + ' ms');
}
/* Two units' own cells with the same name, size, colour and place: two cells (each has its own
 * authoritative owner), never one drawn for the other; the main copies of them hide behind one each */
{
    const a = cell({ spectator: 1, isPlayerCellMulti: true, isPlayerCell: true, color: '#22ccee', _lmSrvName: 'Twin', targetNick: 'Twin' });
    const b = cell({ spectator: 2, isPlayerCellMulti: true, isPlayerCell: true, x: 1001, color: '#22ccee', _lmSrvName: 'Twin', targetNick: 'Twin' });
    run([a, b]);
    check('two units\' own cells alike in every way: both drawn, neither hidden behind the other',
        !a.invisible && !b.invisible && a._lmMbTwin !== b && b._lmMbTwin !== a);
    const a2 = cell({ spectator: 1, isPlayerCellMulti: true, isPlayerCell: true, color: '#22ccee', _lmSrvName: 'Twin' });
    const b2 = cell({ spectator: 2, isPlayerCellMulti: true, isPlayerCell: true, x: 1001, color: '#22ccee', _lmSrvName: 'Twin' });
    const m1 = cell({ spectator: 0, x: 999, color: '#22ccee', _lmSrvName: 'Twin' });
    const m2 = cell({ spectator: 0, x: 1002, color: '#22ccee', _lmSrvName: 'Twin' });
    run([m1, m2, a2, b2]);
    check('...with the main connection seeing both: both own cells drawn, the two main copies hidden',
        !a2.invisible && !b2.invisible && m1.invisible && m2.invisible);
}
/* Kills (LMEvents 'kill', the replay's "k" bookmark): eating my own multibox unit is no kill. On
 * the main connection the victim is the main copy of the unit's cell, which never carries
 * isPlayerCellMulti (the old test): it is known by the unit cell it hides behind or by the unit's
 * copy under lmUnitCellId (lmMbOwnUnitCell). */
{
    const ctx = env(1);
    const has = vm.runInContext('typeof lmMbOwnUnitCell', ctx) === 'function';
    const own = cell({ spectator: 1, isPlayerCellMulti: true, isPlayerCell: true, _lmSrvName: 'me' });
    const mainCopy = cell({ spectator: 0, x: 1004, _lmSrvName: 'me' });
    const enemy = cell({ spectator: 0, x: 3000, _lmSrvName: 'me' });
    const unitEnemy = cell({ spectator: 1, x: 3003, _lmSrvName: 'me' });
    run([mainCopy, own, enemy, unitEnemy], 3, ctx);
    const f = has ? vm.runInContext('lmMbOwnUnitCell', ctx) : () => null;
    check('kill check: the main copy of my unit\'s cell (hidden behind it) is my unit, not a kill', has && mainCopy._lmMbTwin === own && f(mainCopy, 11) === true);
    check('kill check: the unit\'s own cell is my unit', f(own, 12) === true);
    check('kill check: an enemy with my nick on either connection is a kill', f(enemy, 13) === false && f(unitEnemy, 14) === false);
    /* not hidden (e.g. the unit's connection not verified yet): found by its id on the unit */
    const LM = ctx.window.legendmod;
    const lone = cell({ spectator: 0, x: 5000 });
    LM.indexedCells[vm.runInContext('lmUnitCellId(777, 1)', ctx)] = cell({ spectator: 1, isPlayerCellMulti: true });
    check('kill check: a main copy not hidden, my unit\'s cell by its id on the unit', f(lone, 777) === true && f(lone, 778) === false);
    /* both kill sites of the eat handler use it */
    const eatA = src.indexOf("/* LMEvents 'kill'"), eatB = src.indexOf('* EXPANDING LAND CINEMATIC EAT EFFECTS', eatA);
    const eat = eatA > 0 && eatB > eatA ? src.slice(eatA, src.lastIndexOf('/*', eatB)) : '';
    check('kill check: LMEvents kill and the replay "k" bookmark both ask lmMbOwnUnitCell, the dead isPlayerCellMulti test is gone',
        /emit\('kill'/.test(eat) && /_lmRecEv\('k'/.test(eat) && (eat.match(/!lmMbOwnUnitCell\(victimID, victimRawID\)/g) || []).length === 2 && eat.indexOf('!victimID.isPlayerCellMulti') < 0);
}

/* "My custom colour" and the "Player 1 & 2" glow (multiBoxShadow), the rules both renderers use */
{
    const fnSrc = (n) => { const a = src.indexOf('\nfunction ' + n + '('); return a < 0 ? '' : src.slice(a + 1, src.indexOf('\n}\n', a) + 3); };
    const names = ['lmOwnColorPlaying', 'lmOwnBodyColor', 'lmMbShadowOn', 'lmMbShadowColor'];
    const ok = names.every((n) => fnSrc(n));
    const LM = { play: true, playerCells: [], playerCellsMulti: [], gameMode: ':ffa' };
    const app = { selectedProfile: 0, selectedOldProfile: 1, mbSlots: [0, 1] };
    const c = vm.createContext({ window: { legendmod: LM, application: app }, defaultmapsettings: { myCustomColor: true, multiBoxShadow: true },
        ogarcopythelb: { color: '#123456' }, profiles: [{ nick: 'Me', color: '#aa0000' }, { nick: 'Me2', color: '#00bb00' }, { nick: 'Me3', color: '#0000cc' }] });
    if (ok) vm.runInContext(names.map(fnSrc).join('\n'), c);
    const F = (n) => (ok ? c[n] : () => undefined);
    const mainCell = cell({ isPlayerCell: true, targetNick: 'Me' });
    const unitCell = cell({ spectator: 1, isPlayerCell: true, isPlayerCellMulti: true, targetNick: 'Me2' });
    const enemyMe = cell({ targetNick: 'Me' }), enemyMe2 = cell({ spectator: 1, targetNick: 'Me2' });
    LM.playerCells = [mainCell]; LM.playerCellsMulti = [unitCell];
    check('own colour: main player and unit cells, not an enemy', F('lmOwnBodyColor')(mainCell) === '#123456' && F('lmOwnBodyColor')(unitCell) === '#123456' && F('lmOwnBodyColor')(enemyMe) === null);
    LM.play = false; LM.playerCells = [];
    check('own colour: main player dead, a unit alive (none selected): still the own colour', F('lmOwnColorPlaying')() === true && F('lmOwnBodyColor')(unitCell) === '#123456');
    LM.playerCellsMulti = [];
    check('own colour: nobody alive: not playing', F('lmOwnColorPlaying')() === false && F('lmOwnBodyColor')(unitCell) === null);
    LM.play = true; LM.playerCells = [mainCell]; LM.playerCellsMulti = [unitCell];
    check('glow: main player in profile 1\'s colour, the unit in its slot\'s', F('lmMbShadowColor')(mainCell) === '#aa0000' && F('lmMbShadowColor')(unitCell) === '#00bb00');
    check('glow: enemies with my nicks do not glow', F('lmMbShadowColor')(enemyMe) === null && F('lmMbShadowColor')(enemyMe2) === null);
    const unit2 = cell({ spectator: 2, isPlayerCell: true, isPlayerCellMulti: true });
    app.mbSlots = [0, 1, 2];
    check('glow: a third player in its own slot\'s colour', F('lmMbShadowColor')(unit2) === '#0000cc');
    LM.play = false; LM.playerCells = [];
    check('glow: main player dead, the unit still glows', F('lmMbShadowColor')(unitCell) === '#00bb00');
    LM.playerCellsMulti = [];
    check('glow: no unit alive (no multibox): nothing glows', F('lmMbShadowOn')() === false && F('lmMbShadowColor')(mainCell) === null);
    /* the renderers: Cell.draw by ownership, the WebGL gate per glowing cell on screen */
    const gate = src.slice(src.indexOf('var _glMbShadow'), src.indexOf('/* Chat bubbles (GL text pass or overlay)'));
    check('glow: Cell.draw has no nick match left, the WebGL batch falls back only for a glowing cell',
        src.indexOf('this.targetNick === profiles[application.selectedOldProfile].nick') < 0 && /lmMbShadowColor\(this\)/.test(src) &&
        /_glMbShadow && lmMbShadowColor\(cell\)/.test(src) && gate.indexOf('MB_SHADOW') < 0);
}

if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all multibox twin checks passed');
