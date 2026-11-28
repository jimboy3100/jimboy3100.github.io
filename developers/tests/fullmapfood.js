/* Full Map / multibox food and per-connection cells, with the real code in a vm: the cell class
 * (removeCell), the per-connection index and the reconciled food list of ogario/ogario.v4.js
 * (lmObsTrack, lmFoodAdd ... lmFoodDrawList), drawFood, and the unit / spectator packet handler,
 * flushCellsData and connect's generation cleanup of ogario/spect.js, fed agar.io packets.
 * Cases: one pellet seen by the main socket and 5 spectators is drawn once; two pellets close
 * together stay two; the same raw id on two connections is two pellets; the drawn copy goes and
 * another connection's copy is drawn at once; a pellet eaten by a cell the spectator does not
 * see is removed; a spectator disconnect removes only its own cells (from its index, not a scan
 * of the world); cells of an earlier socket are dropped; a spectator whose residual is corrected
 * has its pellets placed again; after an orientation flip (Rotate Map) every pellet is drawn once
 * where it now is, each pellet placed once for it; a main ClearAll or respawn flush keeps the other
 * connections' cells and pellets (their servers cleared nothing); a rebuild of the list takes no
 * unverified connection's pellets; a pellet whose drawn copy leaves moves to the copy drawn next
 * (live capture with a small residual); Canvas2D and Expanding Land WebGL get the same list; a
 * connection number used again starts without the old connection's food state or shared colours;
 * the grouping is the same in any arrival order (each hidden copy within LM_FOOD_TOL of its drawn
 * copy) and equal to the groups made from scratch; a drawn copy placed again moves its entry; a
 * feed state that changes and changes back between two frames is followed; Rainbow food keeps a
 * pellet's colour when another connection's copy is drawn; an unverified steered unit's pellet
 * is left to another connection only where it has a copy, whatever the order of two such units;
 * a stale tile or stalled played unit keeps its pellets except where a fresh view shows them gone
 * (section 14c/14d: food evidence), and comes back with no duplicate; the pellet pool's references
 * (section 18); past
 * LM_FOOD_COMP_MAX copies around a change the copies grouped again do not depend on the order of
 * the entries in the grid buckets, and dense pellets every connection sees are drawn once in any
 * history and over a Rotate Map flip; a flip moves jelly perimeters and the minimap trail, and a
 * flip while a tile reconnects (no border yet) leaves that tile's pellets as they came, so its
 * border places them where they are drawn (section 6g). Prints the food observations against the
 * pellets drawn and the cost of the list and of a dense place.
 * node developers/tests/fullmapfood.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const src = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const spectSrc = read(path.join(root, 'ogario', 'spect.js'));
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
function slice(from, to) {
    const a = src.indexOf(from), b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error('not found in ogario.v4.js: ' + (a < 0 ? from : to));
    return src.slice(a, b);
}

const g = { console: { log() { }, warn() { }, error: console.error }, Date, Math, JSON, Buffer, Map, Set, Array, Float64Array, Int32Array };
g.window = g;
vm.createContext(g);
vm.runInContext([
    slice('var LM_UNIT_ID_STEP = ', 'var _lmMbGridTime = -1;'),
    /* the shared "does this connection contribute now" (the food's stale evidence, section 14c) */
    slice('function _lmMbStalled(sp, now) {', '/* the speed taken for a copy with one packet so far'),
    slice('var _lmSrcObs = new Map();', 'var LM_MB_RING_MIN_SCREEN_PX'),
    /* the shared colours per connection (forgotten when one closes) */
    slice('var _lmMbLooks = new Map();', '/* Nearest copy to `cell` in idx'),
    /* the views a steered unit's draw-only cells and pellets are left to (lmMbFrameHide) */
    slice('var _lmMbDoCov = [], _lmMbDoRect', 'function lmMbFrameHide() {'),
    slice('/* Does the main connection or a verified spectator (_lmMbDoCov) see this cell? */', 'var _lmMbPosC = '),
    'var _DEATH_SLOWMO_ANIM = 600;',
    'var defaultmapsettings = { virusesRange: true, animation: 120, shortMass: false, virMassShots: false, rainbowFood: true };',
    'var defaultSettings = { foodColor: "#5000ff", foodSize: 0 };',
    'var application = { mbSlots: [], selectedOldProfile: 0, teamPlayers: [] }, profiles = [];',
    'function lmMultiboxPositionTwin() { return null; }',
    slice('    function quickSwapDelete(', '    }).call(ogarbasicassembly.prototype);\n') + '    }).call(ogarbasicassembly.prototype);',
    'window.legendmod1 = ogarbasicassembly;',
    'window.lmCellIdx = { push: indexedPush, of: lmIdxOf, remove: lmIdxRemove, filter: lmIdxFilter };',
    'this.indexedPush = indexedPush;',
    'var LM = { cells: [], food: [], viruses: [], foodMulti: [], playerCells: [], playerCellIDs: [], playerCellsMulti: [], removedCells: [], indexedCells: {}, fbOnline: [], cellcolors: {}, time: 0, showFood: true,',
    '  rgb2Hex: function (r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }, vanillaskins: function () { } };',
    'window.legendmod = LM; var legendmod = LM;',
    /* drawFood with the two food passes recorded */
    'this.renderer = { scale: 1, ctx: {}, _el: false, got: [], isLegendWorldMapDeformationVisible: function () { return this._el; },',
    '  drawLegendWorldMapFoodWebGL: function (list) { this.got.push(["webgl", list]); return true; },',
    '  drawCachedFood: function (ctx, list) { this.got.push(["canvas", list]); },',
    '  ' + (function () { const a = src.indexOf('        drawFood() {'), b = src.indexOf('        drawCachedFood(ctx, food, scale, reset) {', a); return src.slice(a, b).trim().replace(/,$/, ''); })(),
    '};',
    'this.LM = LM;',
    /* the main socket's flush (ClearAll 18, respawn: a boolean; a connection change: none) */
    'LM.flushCellsData = ({ ' + (function () { const a = src.indexOf('        flushCellsData(preserveMapGeometry) {'), b = src.indexOf('        /* Spectator toggles', a); return src.slice(a, b).trim().replace(/,$/, ''); })() + ' }).flushCellsData;',
    /* the orientation flip of every local coordinate store (Rotate Map, teammate orientation) */
    'this.flipper = { deathLocations: [],',
    '  ' + (function () { const a = src.indexOf('        _retranslateAllOnFlip('), b = src.lastIndexOf('        /*', src.indexOf('        settechvnr(b) {', a)); return src.slice(a, b).trim().replace(/,$/, ''); })(),
    '};'
].join('\n'), g);
vm.runInContext(spectSrc + '\nthis.Spect = Spect;', g);
const LM = g.LM;

function reset() {
    vm.runInContext('lmObsResetAll(); LM.cells = []; LM.food = []; LM.viruses = []; LM.foodMulti = []; LM.playerCells = []; LM.playerCellsMulti = []; LM.removedCells = []; LM.indexedCells = {}; window.spects = [];', g);
}
function spect(number) {
    const sp = Object.create(g.Spect.prototype);
    Object.assign(sp, { number, player: false, integrity: true, active: false, foodCalibrated: true, nick: '', playerCellIDs: [], time: 0, connectionGeneration: 1 });
    /* its transform counts as verified (spect.js _lmFeedOk, tested in spectcoords.js) unless a
     * test says otherwise: its pellets take part in the list */
    sp._lmFeedOk = function () { return this._testFeed !== false; };
    g.spects.push(sp);
    return sp;
}
/* agar.io update body: eats, cells (id, x, y, size, flags[, ext], colour[, name][, account]), 0, removes */
function packet(eats, cells, removes) {
    const b = Buffer.alloc(8 + eats.length * 8 + cells.reduce((n, c) => n + 20 + (c.name ? c.name.length + 1 : 0) + (c.acc ? 4 : 0), 0) + 4 + removes.length * 4);
    let o = 0;
    b.writeUInt16LE(eats.length, o); o += 2;
    for (const [a, v] of eats) { b.writeUInt32LE(a, o); b.writeUInt32LE(v, o + 4); o += 8; }
    for (const c of cells) {
        b.writeUInt32LE(c.id, o); b.writeInt32LE(c.x, o + 4); b.writeInt32LE(c.y, o + 8); b.writeUInt16LE(c.size || 11, o + 12); o += 14;
        const col = c.color === undefined ? 0x40a0f0 : c.color;
        b.writeUInt8(128 | 2 | (c.virus ? 1 : 0) | (c.name ? 8 : 0), o++); b.writeUInt8((c.food === false ? 0 : 1) | (c.acc ? 4 : 0), o++);
        b.writeUInt8((col >> 16) & 255, o++); b.writeUInt8((col >> 8) & 255, o++); b.writeUInt8(col & 255, o++);
        if (c.name) { o += b.write(c.name, o, 'latin1'); b.writeUInt8(0, o++); }
        if (c.acc) { b.writeUInt32LE(c.acc, o); o += 4; }
    }
    b.writeUInt32LE(0, o); o += 4;
    b.writeUInt16LE(removes.length, o); o += 2;
    for (const id of removes) { b.writeUInt32LE(id, o); o += 4; }
    return b.slice(0, o);
}
/* a main-socket pellet, as the main updateCells stores it */
function mainFood(id, x, y, color, size) {
    const c = new g.legendmod1(id, x, y, size || 11, color || '#3a90d8', true, false, false, false, false);
    c.spectator = false;
    g.indexedPush(LM.food, c, '_foodIdx');
    LM.indexedCells[id] = c;
    c.targetX = x; c.targetY = y;
    return c;
}
const drawList = () => vm.runInContext('lmFoodDrawList()', g);
const stats = () => vm.runInContext('lmFoodStats()', g);
/* main copy colour of a server colour 0x40a0f0 (x0.9, as both decoders do) */
const hex = (v) => LM.rgb2Hex(~~(((v >> 16) & 255) * 0.9), ~~(((v >> 8) & 255) * 0.9), ~~((v & 255) * 0.9));

/* 1. one pellet: the main socket and 5 Full Map spectators (each its own raw id) */
reset();
{
    const m = mainFood(10, 500, 500, hex(0x40a0f0));
    const sps = [1, 2, 3, 4, 5].map(spect);
    sps.forEach((sp, k) => sp.updateCells(packet([], [{ id: 1000 + k * 7, x: 500, y: 500 }], []), 0));
    const list = drawList();
    check('same pellet seen by the main socket and 5 spectators: drawn once, the main copy', list.length === 1 && list[0] === m, list.length);
    check('spectator pellets are not in LM.cells (no second drawing as cells)', LM.cells.length === 0 && LM.foodMulti.length === 5);
    /* the main copy is eaten: another copy is drawn in its slot at once */
    m.removeCell();
    const l2 = drawList();
    check('drawn copy gone: the pellet is still drawn once, by a spectator copy', l2.length === 1 && l2[0].spectator === 1, l2.length);
    /* every spectator leaves its view of it but one */
    for (let k = 0; k < 4; k++) sps[k].updateCells(packet([], [], [1000 + k * 7]), 0);
    check('the last copy left keeps it drawn', drawList().length === 1 && drawList()[0].spectator === 5);
    sps[4].updateCells(packet([], [], [1000 + 4 * 7]), 0);
    check('no copy left: the list is off, LM.food drawn as before', !stats().on && drawList() === LM.food);
}
/* 2. two pellets close together stay two; pellets of one connection never merge; another
 * size is another pellet; the colour is not compared (not the same on every connection) */
reset();
{
    mainFood(20, 1000, 1000, hex(0x40a0f0)); mainFood(21, 1006, 1000, hex(0x40a0f0)); mainFood(22, 1900, 1900, hex(0x40a0f0));
    const sp = spect(1);
    sp.updateCells(packet([], [{ id: 5, x: 1000, y: 1000 }, { id: 6, x: 1006, y: 1000 }, { id: 7, x: 1300, y: 1300 }, { id: 8, x: 1301, y: 1300 },
        { id: 9, x: 1600, y: 1600 }, { id: 10, x: 1600, y: 1600, size: 14 }, { id: 11, x: 1902, y: 1899, color: 0xff3300 }, { id: 12, x: 1000, y: 1000, size: 16 }], []), 0);
    check('two adjacent pellets seen by two connections: two pellets', drawList().filter(c => c.x < 1100 && c.size === 11).length === 2, drawList().length);
    check('pellets of one connection at one place stay two; another size is another pellet', drawList().filter(c => c.x >= 1300 && c.x < 1700).length === 4 && drawList().filter(c => c.size === 16).length === 1);
    check('the same pellet in another colour on the other connection: one pellet', drawList().filter(c => c.x >= 1890).length === 1, drawList().length);
}
/* 2b. live capture: a main socket and 3 Full Map spectators (own offsets, mirrors and scales),
 * each spectator placed in the main frame from its border (what AGFM-C's transform does):
 * every pellet matched across two connections in the capture is one pellet here */
reset();
{
    const L = JSON.parse(read(path.join(__dirname, 'lib', 'fullmap-food-live.json')));
    const M = L.main, byConn = new Map();
    for (const c of L.conns) {
        const w = c.maxX - c.minX, h = c.maxY - c.minY;
        const fx = (x) => M.minX + (c.o[0] > 0 ? (x - c.minX) / w : (c.maxX - x) / w) * M.w;
        const fy = (y) => M.minY + (c.o[1] > 0 ? (y - c.minY) / h : (c.maxY - y) / h) * M.h;
        if (c.n === 0) c.food.forEach((p, i) => mainFood(i + 1, p[0], p[1], null, p[2]));
        else {
            const sp = spect(c.n);
            sp.getX = fx; sp.getY = fy;
            sp.updateCells(packet([], c.food.map((p, i) => ({ id: 10 + i, x: p[0], y: p[1], size: p[2] })), []), 0);
        }
        byConn.set(c.n, c);
    }
    const find = (n, x, y) => {
        if (n === 0) return LM.food.find(c => c.x === x && c.y === y);
        const set = vm.runInContext('lmObsOfSource(' + n + ')', g);
        for (const c of set) if (c._lmRawX === x && c._lmRawY === y) return c;
        return null;
    };
    let same = 0, missing = 0;
    for (const [a, xa, ya, b, xb, yb] of L.pairs) {
        const ca = find(a, xa, ya), cb = find(b, xb, yb);
        if (!ca || !cb) { missing++; continue; }
        if (ca._lmFoodEnt && ca._lmFoodEnt === cb._lmFoodEnt) same++;
    }
    const st = stats();
    check('live capture: every matched pellet pair is one pellet (' + same + ' of ' + (L.pairs.length - missing) + ' pairs; ' + st.observations + ' observations, ' + st.pellets + ' pellets drawn)', same === L.pairs.length - missing && same > 100, same);
}
/* 3. raw ids: the same raw id on two connections is two pellets; different ids, one place, one */
reset();
{
    const a = spect(1), b = spect(2);
    a.updateCells(packet([], [{ id: 100, x: 0, y: 0 }, { id: 101, x: 2000, y: 2000 }], []), 0);
    b.updateCells(packet([], [{ id: 100, x: 700, y: 700 }, { id: 555, x: 2000, y: 2000 }], []), 0);
    check('same raw id, different places: two pellets', drawList().filter(c => c.x < 1000).length === 2);
    check('different raw ids, same pellet: one', drawList().filter(c => c.x === 2000).length === 1);
}
/* 4. eaten by a cell the spectator does not see: removed (no removal record follows) */
reset();
{
    const sp = spect(1);
    sp.updateCells(packet([], [{ id: 300, x: 50, y: 50 }, { id: 301, x: 80, y: 50 }], []), 0);
    const victim = LM.indexedCells[g.lmUnitCellId(300, 1)];
    sp.updateCells(packet([[999999, 300]], [], []), 0);
    check('eaten victim without a local eater: removed', victim.removed && !LM.indexedCells[g.lmUnitCellId(300, 1)] && drawList().length === 1);
    /* a player cell eaten the same way */
    sp.updateCells(packet([], [{ id: 400, x: 90, y: 90, size: 60, food: false }], []), 0);
    const body = LM.indexedCells[g.lmUnitCellId(400, 1)];
    sp.updateCells(packet([[999998, 400]], [], []), 0);
    check('eaten player cell without a local eater: removed from LM.cells', body.removed && !LM.cells.includes(body));
}
/* 5. a spectator disconnect removes only its own cells, from its own index */
reset();
{
    const m = mainFood(1, 0, 0, hex(0x40a0f0));
    const a = spect(1), b = spect(2);
    const cells = [];
    for (let i = 0; i < 300; i++) cells.push({ id: 10 + i, x: i * 40, y: 0 });
    a.updateCells(packet([], cells.concat([{ id: 5000, x: 9000, y: 9000, size: 80, food: false }]), []), 0);
    b.updateCells(packet([], cells.slice(0, 150).concat([{ id: 6000, x: -9000, y: -9000, size: 80, food: false }]), []), 0);
    const before = drawList().length;
    /* the world's cells must not be scanned: indexedCells keys are counted */
    let keyScans = 0;
    const ic = LM.indexedCells;
    LM.indexedCells = new Proxy(ic, { ownKeys(t) { keyScans++; return Reflect.ownKeys(t); } });
    b.flushCellsData();
    LM.indexedCells = ic;
    const bLeft = Object.keys(ic).filter(k => ic[k].spectator === 2).length;
    check('spectator disconnect: its cells removed, others kept', bLeft === 0 && !!ic[g.lmUnitCellId(5000, 1)] && !!ic[1] && !m.removed);
    check('spectator disconnect: the pellets it shared stay drawn once', before === 300 && drawList().length === 300, before + '/' + drawList().length);
    check('spectator disconnect: no scan of the world cells', keyScans === 0, keyScans);
    /* a new socket of spectator 1: the cells of the old socket go */
    a.connectionGeneration = 2;
    a._lmDropOtherGenerations(2);
    check('new socket generation: the old socket cells dropped (main pellet kept)', !Object.keys(ic).some(k => ic[k].spectator === 1) && drawList().length === 1 && drawList()[0] === m);
    /* a stale cell under the same id is replaced, not reused */
    a.connectionGeneration = 3;
    a.updateCells(packet([], [{ id: 77, x: 5, y: 5 }], []), 0);
    const stale = ic[g.lmUnitCellId(77, 1)];
    a.connectionGeneration = 4;
    a.updateCells(packet([], [{ id: 77, x: 3000, y: 3000 }], []), 0);
    const fresh = ic[g.lmUnitCellId(77, 1)];
    check('packet of a new socket under an old id: a new cell, the old one removed', stale.removed && fresh !== stale && fresh._lmGen === 4 && fresh.x === 3000);
}
/* 6. a spectator's residual d is corrected (spect.js _lmApplyTransform reprojects its cells
 *    from raw): its pellets are placed again */
reset();
{
    const m = mainFood(1, 100, 100, hex(0x40a0f0));
    const sp = spect(1);
    /* main frame = world (centre 0, scale 1); the spectator: centre 0, no mirror, d = 0 */
    Object.assign(LM, { _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1, mapOffsetX: 0, mapOffsetY: 0 });
    Object.assign(sp, { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1, _lmSameFrame: false });
    sp.updateCells(packet([], [{ id: 9, x: 70, y: 100 }, { id: 10, x: 470, y: 100 }], []), 0);
    check('pellet seen with a residual 30 off: two pellets until it is corrected', drawList().length === 3, drawList().length);
    sp._lmApplyTransform(1, 1, 30, 0);
    const list = drawList();
    check('offset fixed: placed again, the pellet drawn once', list.length === 2 && list.includes(m), list.length);
}
/* 6a. Rotate Map / orientation flip (_retranslateAllOnFlip moves every cell, main and spectator):
 *     every pellet is drawn once where it now is (the main pellets kept their old places, so a
 *     spectator copy of another pellet matched one: that one was drawn twice, the other not) */
reset();
{
    Object.assign(LM, { _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1, mapOffsetX: 0, mapOffsetY: 0,
        mapMinX: -1000, mapMaxX: 1000, mapMinY: -1000, mapMaxY: 1000, vector: [[0, 0], [1, 0]], vnr: 0 });
    LM.translateX = (v) => LM.mapMaxX - (v - LM.mapMinX);
    LM.translateY = (v) => v;
    const m1 = mainFood(1, 100, 100, hex(0x40a0f0)), m2 = mainFood(2, -100, 300, hex(0x40a0f0));
    const sp = spect(1);
    Object.assign(sp, { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1, _lmSameFrame: false });
    /* the spectator sees pellet 1 (the main socket's too) and a third one at (100, 300) */
    sp.updateCells(packet([], [{ id: 9, x: 100, y: 100 }, { id: 10, x: 100, y: 300 }], []), 0);
    check('before the flip: three pellets, each drawn once', drawList().length === 3, drawList().length);
    g.flipper._retranslateAllOnFlip(false, false, [1, 0]);
    LM.vnr = 1;
    const list = drawList(), at = (x, y) => list.filter((c) => Math.abs(c.x - x) < 1 && Math.abs(c.y - y) < 1).length;
    check('after the flip: the main pellets moved', m1.x === -100 && m2.x === 100, m1.x + ',' + m2.x);
    check('after the flip: every pellet drawn once where it now is', list.length === 3 && at(-100, 100) === 1 && at(100, 300) === 1 && at(-100, 300) === 1,
        list.map((c) => c.x + ',' + c.y + '/' + (c.spectator || 0)).join(' '));
    /* a moving cell's velocity (extrapolated between packets) turns with the x axis: kept, it
     * went on the old way, 40 units off after 40 ms at 1000 units/s */
    const mover = { id: 77, x: 50, y: 50, targetX: 50, targetY: 50, startX: 50, startY: 50, _lmVX: 0.5, _lmVY: 0.2 };
    const dying = { id: 78, x: 60, y: 60, targetX: 60, targetY: 60, startX: 60, startY: 60, _lmVX: 0.5, _lmVY: 0.2 };
    LM.indexedCells[77] = mover;
    LM.removedCells.push(dying);
    g.flipper._retranslateAllOnFlip(true, false, [0, 0]);
    check('flip: the velocity of a moving cell changes sign with x, not with y (live cell, removed cell)',
        mover._lmVX === -0.5 && mover._lmVY === 0.2 && dying._lmVX === -0.5 && dying._lmVY === 0.2, [mover._lmVX, mover._lmVY, dying._lmVX, dying._lmVY]);
    /* a jelly cell's perimeter (its points, the centre of its last step) and the minimap trail are
     * drawn positions too: left, the next jelly step laid the perimeter out and dented it at the old
     * place, and the trail stayed on the other side of the map */
    const jel = { id: 79, x: 200, y: 50, targetX: 200, targetY: 50, startX: 200, startY: 50, _lmJellyCX: 200, _lmJellyCY: 50,
        points: [{ x: 230, y: 50, rl: 30 }, { x: 200, y: 80, rl: 30 }, { x: 170, y: 50, rl: 30 }] };
    LM.indexedCells[79] = jel;
    g.flipper._lmTrail = [{ x: 100, y: 10 }, { x: 150, y: 20 }];
    g.flipper._retranslateAllOnFlip(false, false, [1, 0]);
    check('flip: a jelly cell\'s perimeter points and the centre of its last step move with it (x only)',
        jel.x === -200 && jel.points.map((p) => p.x + ',' + p.y).join(' ') === '-230,50 -200,80 -170,50' && jel._lmJellyCX === -200 && jel._lmJellyCY === 50,
        jel.points.map((p) => p.x + ',' + p.y).join(' ') + ' / ' + jel._lmJellyCX);
    check('flip: the minimap trail moves with the map', g.flipper._lmTrail.map((p) => p.x + ',' + p.y).join(' ') === '-100,10 -150,20', JSON.stringify(g.flipper._lmTrail));
    delete g.flipper._lmTrail;
    delete LM.translateX; delete LM.translateY; LM.vector = null; LM.vnr = 0;
}
/* 6b. A spectator whose orientation is not verified (PROVISIONAL, CONFLICTED: _lmFeedOk false) does
 *     not feed the list: its pellets are not drawn and hide no other copy; once verified they join
 *     at once (a pellet is sent once), and they leave again when it becomes CONFLICTED */
reset();
{
    const m = mainFood(1, 100, 100, hex(0x40a0f0));
    const sp = spect(1);
    sp._testFeed = false; /* PROVISIONAL */
    sp.updateCells(packet([], [{ id: 9, x: 100, y: 100 }, { id: 10, x: 900, y: 100 }], []), 0);
    let list = drawList();
    check('unverified spectator: its pellets are not drawn', list.length === 1 && list[0] === m, list.length);
    sp._testFeed = true; /* VERIFIED */
    list = drawList();
    check('verified: its pellets join at once, the shared one drawn once', list.length === 2 && list.includes(m), list.length);
    sp._testFeed = false; /* CONFLICTED */
    list = drawList();
    check('conflicted: its pellets leave the list', list.length === 1 && list[0] === m, list.length);
}
/* 6c. main ClearAll (opcode 18 -> flushCellsData(false)) and the Expanding Land respawn flush (true)
 *     clear only the main socket's world: the spectator and multibox sockets stay open and their
 *     servers send a pellet, a virus, a name once, so their cells stay (before: every spectator
 *     pellet, virus and name was gone, for good on a static Full Map tile) */
for (const arg of [false, true]) {
    reset();
    const m = mainFood(1, 100, 100, hex(0x40a0f0));
    const sp = spect(1), unit = spect(2);
    unit.player = true;
    unit.active = true; /* already playing (its first own cell starts timers) */
    unit.playerCellIDs = [unit.newID(7000)];
    const cells = [];
    for (let i = 0; i < 200; i++) cells.push({ id: 10 + i, x: 1000 + i * 40, y: 0 });
    sp.updateCells(packet([], cells.concat([{ id: 5000, x: 9000, y: 9000, size: 80, food: false, name: 'P' },
        { id: 5001, x: 8000, y: 8000, size: 100, food: false, virus: true }]), []), 0);
    unit.updateCells(packet([], [{ id: 7000, x: 3000, y: 3000, size: 60, food: false }, { id: 7001, x: 1000, y: 0 }], []), 0);
    check('flush(' + arg + '): before, every pellet drawn once', drawList().length === 201, drawList().length);
    LM.flushCellsData(arg);
    let list = drawList();
    check('flush(' + arg + '): the spectator pellets stay drawn, the main pellet goes', list.length === 200 && list.every((c) => c.spectator > 0) && LM.food.length === 0 && !list.includes(m), list.length);
    const pl = LM.cells.find((c) => c.spectator === 1 && !c.isVirus);
    check('flush(' + arg + '): the spectator player keeps its name, its virus stays', !!pl && pl.targetNick === 'P' && LM.viruses.length === 1 && LM.viruses[0].spectator === 1, pl && pl.targetNick);
    check('flush(' + arg + '): the multibox unit keeps its own cell', LM.playerCellsMulti.length === 1 && LM.playerCellsMulti[0].spectator === 2 && LM.cells.includes(LM.playerCellsMulti[0]));
    check('flush(' + arg + '): no main socket cell is left', !LM.indexedCells[1] && Object.keys(LM.indexedCells).every((k) => LM.indexedCells[k].spectator > 0));
    /* the main server sends its pellet again: drawn once with the spectator copies */
    mainFood(1, 100, 100, hex(0x40a0f0));
    sp.updateCells(packet([], [{ id: 5000, x: 9010, y: 9000, size: 80, food: false }], []), 0);
    list = drawList();
    check('flush(' + arg + '): the main pellet back, each pellet drawn once', list.length === 201 && list.filter((c) => !c.spectator).length === 1, list.length);
    sp.updateCells(packet([], [], cells.map((c) => c.id)), 0);
    /* left: the main pellet and the unit's copy of the pellet at (1000, 0) */
    check('flush(' + arg + '): the kept pellets still leave with their removal records', drawList().length === 2, drawList().length);
}
/* 6d. the list rebuilt (spawn gate, opcode 32, ClearAll): an unverified connection's pellets stay
 *     out (before: they joined it and stayed drawn, lmFoodFrame acts only on a state change) */
reset();
{
    const m = mainFood(1, 100, 100, hex(0x40a0f0));
    const a = spect(1), b = spect(2);
    b._testFeed = false; /* PROVISIONAL */
    a.updateCells(packet([], [{ id: 5, x: 100, y: 100 }], []), 0);
    b.updateCells(packet([], [{ id: 6, x: 103, y: 100 }, { id: 7, x: 900, y: 900 }], []), 0);
    check('rebuild: before, only the verified pellets', drawList().length === 1 && drawList()[0] === m);
    vm.runInContext('LM.food = lmIdxClear(LM.food, "_foodIdx"); lmFoodRebuild();', g);
    drawList();
    let list = drawList();
    check('rebuild: no unverified pellet drawn', list.length === 1 && list[0].spectator === 1, list.map((c) => (c.spectator || 0) + '@' + c.x).join(' '));
    b._testFeed = true;
    list = drawList();
    check('rebuild: verified later, its pellets join', list.length === 2 && list.filter((c) => c.spectator === 2).length === 1, list.length);
}
/* 6e. live capture: the copy that made a pellet's entry leaves (out of its view, disconnect) and
 *     another connection's copy arrives; with a residual of +-2 on two connections (orientation
 *     verified, d not yet) the pellet is still drawn once: the entry moved to the copy drawn now
 *     (before: it kept the departed copy's place and some 44 pellets were drawn twice, 2 apart) */
{
    const L = JSON.parse(read(path.join(__dirname, 'lib', 'fullmap-food-live.json')));
    const M = L.main, conv = {};
    for (const c of L.conns) {
        const w = c.maxX - c.minX, h = c.maxY - c.minY, r = c.n === 2 ? 2 : c.n === 4 ? -2 : 0;
        conv[c.n] = { c, fx: (x) => r + M.minX + (c.o[0] > 0 ? (x - c.minX) / w : (c.maxX - x) / w) * M.w,
            fy: (y) => M.minY + (c.o[1] > 0 ? (y - c.minY) / h : (c.maxY - y) / h) * M.h };
    }
    const load = (order, firstLeaves) => {
        reset();
        const sps = {};
        for (const n of order) {
            const c = conv[n].c, sp = sps[n] = spect(n);
            sp.getX = conv[n].fx; sp.getY = conv[n].fy;
            sp.updateCells(packet([], c.food.map((p, i) => ({ id: 10 + i, x: p[0], y: p[1], size: p[2] })), []), 0);
            if (firstLeaves && n === order[1]) sps[order[0]].updateCells(packet([], [], conv[order[0]].c.food.map((p, i) => 10 + i)), 0);
        }
        return stats().pellets;
    };
    for (const o of [[2, 3, 4], [4, 3, 2]]) {
        const a = load(o, true), b = load(o.slice(1));
        check('live capture, residual 2: ' + o[0] + ' leaves after ' + o[1] + ', then ' + o[2] + ': each pellet once (' + a + ' drawn, ' + b + ' without ' + o[0] + ')', a === b, a + '/' + b);
    }
}
/* 6f. Rotate Map / orientation flip at Full Map scale: every pellet placed once for it (before: the
 *     spectators' pellets a second time in the next frame, their transforms stored before the flip) */
reset();
{
    Object.assign(LM, { _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1, mapOffsetX: 0, mapOffsetY: 0,
        mapMinX: -7071, mapMaxX: 7071, mapMinY: -7071, mapMaxY: 7071, vector: [[0, 0], [1, 0]], vnr: 0 });
    LM.translateX = (v) => LM.mapMaxX - (v - LM.mapMinX);
    LM.translateY = (v) => v;
    let s = 7;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 300; i++) mainFood(i + 1, Math.floor(rnd() * 6000), Math.floor(rnd() * 6000), hex(0x40a0f0));
    const sps = [1, 2, 3].map((n) => Object.assign(spect(n), { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1, _lmSameFrame: false }));
    sps.forEach((sp, k) => {
        const v = [];
        for (let i = 0; i < 400; i++) v.push({ id: 10 + i, x: Math.floor(rnd() * 7000) - 3500 + k * 500, y: Math.floor(rnd() * 7000) - 3500 });
        sp.updateCells(packet([], v, []), 0);
    });
    drawList();
    const before = stats();
    vm.runInContext('var __att = 0, __attOrig = _lmFoodAttach; _lmFoodAttach = function (c) { __att++; return __attOrig(c); };', g);
    g.flipper._retranslateAllOnFlip(false, false, [1, 0]);
    LM.vnr = 1;
    drawList();
    const n1 = vm.runInContext('__att', g);
    vm.runInContext('__att = 0', g);
    drawList();
    const n2 = vm.runInContext('__att', g);
    vm.runInContext('_lmFoodAttach = __attOrig', g);
    const after = stats();
    check('flip: every observation placed once (' + n1 + ' of ' + before.observations + '), none in the frame after', n1 === before.observations && n2 === 0, n1 + '/' + n2);
    check('flip: as many pellets as before', after.pellets === before.pellets && after.observations === before.observations, before.pellets + '/' + after.pellets);
    delete LM.translateX; delete LM.translateY; LM.vector = null; LM.vnr = 0;
}
/* 6g. Rotate Map while a Full Map tile reconnects: its new socket's pellets came before its border
 *     (held as they came: spect.js getX is the identity until then) and stay out of the list; the map
 *     flips; its border comes and it is verified: each of its pellets is drawn where it is under the
 *     flip, once, beside the main socket's and a placed tile's (flipped while unplaced, the border
 *     took the flipped place for the raw one: drawn on the other side of the map for good) */
reset();
{
    Object.assign(LM, { _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1, mapOffsetX: 0, mapOffsetY: 0, mapOffsetFixed: true, ghostCells: [],
        mapMinX: -7071, mapMaxX: 7071, mapMinY: -7071, mapMaxY: 7071, vector: [[0, 0], [1, 0]], vnr: 0 });
    LM.translateX = (v) => LM.mapMaxX - (v - LM.mapMinX);
    LM.translateY = (v) => v;
    const m = mainFood(1, 1000, 500, hex(0x40a0f0));
    const t1 = Object.assign(spect(1), { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1, _lmSameFrame: false });
    t1.updateCells(packet([], [{ id: 9, x: 1000, y: 500 }, { id: 10, x: 1500, y: 500 }], []), 0);
    /* tile 2: the real feed test (border and verified orientation), a new socket without its border */
    const t2 = spect(2);
    delete t2._lmFeedOk;
    t2.resetConnectionState();
    t2.connectionGeneration = 2;
    t2.updateCells(packet([], [{ id: 20, x: 1000, y: 500 }, { id: 21, x: 2500, y: -3000 }, { id: 22, x: -4000, y: 1200 }], []), 0);
    const pellets = [20, 21, 22].map((id) => LM.indexedCells[id + 2 * 4294967296]);
    const n0 = drawList().length;
    g.flipper._retranslateAllOnFlip(false, false, [1, 0]);
    LM.vnr = 1;
    drawList();
    t2.setMapOffset(-7071, -7071, 7071, 7071);
    t2.setOrientation(1, 1);
    const list = drawList(), at = (x, y) => list.filter((c) => Math.abs(c.x - x) < 1 && Math.abs(c.y - y) < 1).length;
    check('Rotate Map while a tile reconnects: before its border its pellets are not drawn (it does not feed the list)', n0 === 2, n0);
    check('  ... after its border: each of its pellets drawn once where it is under the flip (drawn and listed place agree)',
        list.length === 4 && at(-1000, 500) === 1 && at(-1500, 500) === 1 && at(-2500, -3000) === 1 && at(4000, 1200) === 1 &&
        pellets.every((c) => Math.abs(c.x - c.targetX) < 1 && Math.abs(c.x - t2.getX(c._lmRawX)) < 1e-6),
        list.map((c) => Math.round(c.x) + ',' + c.y + '/' + (c.spectator || 0)).join(' ') + ' | ' + pellets.map((c) => Math.round(c.x) + '~' + Math.round(c.targetX)).join(' '));
    check('  ... the main pellet moved with the map, still the drawn copy of its pellet', m.x === -1000 && list.includes(m));
    delete LM.translateX; delete LM.translateY; LM.vector = null; LM.vnr = 0; LM.mapOffsetFixed = false;
}
/* 6b. a spectator's named cells: the colour first seen for the nick (LM.cellcolors, shared with
 * the main connection), teammates only with a colour they sent, own cells the profile colour
 * without it becoming the nick's colour */
reset();
{
    const sp = spect(1);
    LM.cellcolors = Object.create(null);
    LM.cellcolors.Bob = '#123456';
    g.application.teamPlayers = [{ nick: 'Mate', color: '#ffffff' }, { nick: 'Sent', color: '#3366ff', _lmColorSent: true }];
    g.profiles[0] = { color: '#ff00ff' };
    g.application.selectedProfile = 0;
    g.defaultmapsettings.myCustomColor = true;
    sp.playerCellIDs = [sp.newID(24)];
    sp.active = true; /* an own cell arriving would start the cursor timer */
    sp.updateCells(packet([], [{ id: 20, x: 100, y: 100, size: 60, food: false, name: 'Bob', color: 0x00c800 },
        { id: 21, x: 300, y: 100, size: 60, food: false, name: 'Mate', color: 0xc80000 },
        { id: 22, x: 500, y: 100, size: 60, food: false, name: 'Sent', color: 0xc80000 },
        { id: 23, x: 700, y: 100, size: 60, food: false, name: 'New', color: 0x0000c8 },
        { id: 24, x: 900, y: 100, size: 60, food: false, name: 'Me', color: 0x00c8c8 }], []), 0);
    const col = (raw) => { const c = LM.cells.find((x) => x._lmRawId === raw); return c ? c.color : 'none'; };
    check('spectator: a nick seen before keeps that colour', col(20) === '#123456', col(20));
    check('spectator: a teammate that sent no colour keeps the server colour', col(21) === hex(0xc80000), col(21));
    check('spectator: a teammate that sent a colour is drawn in it', col(22) === '#3366ff', col(22));
    check('spectator: a new nick keeps its server colour and is remembered with it', col(23) === hex(0x0000c8) && LM.cellcolors.New === hex(0x0000c8), [col(23), LM.cellcolors.New]);
    check('spectator: own cell in the profile colour, not remembered as the nick colour', col(24) === '#ff00ff' && !LM.cellcolors.Me, [col(24), LM.cellcolors.Me]);
    /* Teams: the server's colours are the team colours (main applies no nick, teammate or
     * profile colour there): a nick's colour from another team, or a teammate's sent colour,
     * painted a spectator's cell of that nick in the wrong team colour */
    reset();
    LM.gameMode = ':teams';
    const st = spect(2);
    st.playerCellIDs = [st.newID(34)];
    st.active = true;
    g.application.teamPlayers = [{ nick: 'Sent', color: '#3366ff', _lmColorSent: true }];
    st.updateCells(packet([], [{ id: 30, x: 100, y: 100, size: 60, food: false, name: 'Bob', color: 0x0000ff },
        { id: 31, x: 300, y: 100, size: 60, food: false, name: 'Sent', color: 0x00ff00 },
        { id: 34, x: 500, y: 100, size: 60, food: false, name: 'Me', color: 0xff0000 }], []), 0);
    check('Teams: a nick seen in another colour keeps its team colour', col(30) === hex(0x0000ff) && LM.cellcolors.Bob === '#123456', [col(30), LM.cellcolors.Bob]);
    check('Teams: a teammate that sent a colour keeps the server team colour', col(31) === hex(0x00ff00), col(31));
    check('Teams: the own cell of the unit keeps its team colour', col(34) === hex(0xff0000), col(34));
    LM.gameMode = ':ffa';
    g.application.teamPlayers = [];
    g.defaultmapsettings.myCustomColor = false;
    /* a colour sent after the cell's first record (main: "a later colour is applied") */
    reset();
    const sl = spect(3);
    const rec = (id, rgb, name) => {
        const h = Buffer.alloc(16); h.writeUInt32LE(id, 0); h.writeInt32LE(500, 4); h.writeInt32LE(500, 8); h.writeUInt16LE(120, 12);
        h.writeUInt8(128 | (rgb ? 2 : 0) | (name ? 8 : 0), 14); h.writeUInt8(0, 15);
        return Buffer.concat([Buffer.from([0, 0]), h, rgb ? Buffer.from(rgb) : Buffer.alloc(0), name ? Buffer.from(name + '\0', 'latin1') : Buffer.alloc(0), Buffer.from([0, 0, 0, 0, 0, 0])]);
    };
    sl.updateCells(rec(40, null, null), 0);
    sl.updateCells(rec(40, [255, 0, 0], 'Late'), 0);
    check('spectator: a colour sent after the first record is applied', col(40) === LM.rgb2Hex(229, 0, 0), col(40));
    /* the other way round: a later record without a colour keeps the known colour (no default black) */
    sl.updateCells(rec(43, [255, 0, 0], 'X'), 0);
    sl.updateCells(rec(43, null, null), 0);
    check('spectator: a later record without a colour keeps the known colour', col(43) === LM.rgb2Hex(229, 0, 0), col(43));
    /* sent later without the name: the cell's name finds its nick colour and its shared look */
    LM.cellcolors = Object.create(null);
    LM.cellcolors.Known = '#abcdef';
    sl.updateCells(rec(41, null, 'Known'), 0);
    sl.updateCells(rec(41, [0, 255, 0], null), 0);
    check('spectator: a later colour without the name takes the nick colour of the name it has', col(41) === '#abcdef', col(41));
    vm.runInContext('_lmMbLookSet({ spectator: 3, _lmGen: 1, _lmRawColor: "' + LM.rgb2Hex(0, 0, 229) + '", _lmSrvName: "Seen", color: "#fedcba", _lmMbLookT: 1 })', g);
    LM.gameMode = ':party';
    sl.updateCells(rec(42, null, 'Seen'), 0);
    sl.updateCells(rec(42, [0, 0, 255], null), 0);
    check('spectator: a later colour without the name takes the shared look of the name it has', col(42) === '#fedcba', col(42));
    /* Teams with "one colour for spectator cells": the unit's own cells keep the team colour */
    reset();
    LM.gameMode = ':teams';
    g.defaultmapsettings.oneColoredSpectator = true;
    const so = spect(4);
    so.playerCellIDs = [so.newID(54)];
    so.active = true;
    so.updateCells(packet([], [{ id: 54, x: 500, y: 100, size: 60, food: false, name: 'Me', color: 0xff0000 }], []), 0);
    check('Teams, one colour for spectator cells: the own cell of the unit in its team colour', col(54) === hex(0xff0000) && so.playerColor === hex(0xff0000), [col(54), so.playerColor]);
    LM.gameMode = ':ffa';
    /* "Simplified cell colors" (oneColoredSpectator) is drawn by the renderers
     * (lmBodyColorOverride), never written into the observation: a connection's cells keep the
     * server colour, the nick colour and the own colour, so turning it off needs no new packet */
    reset();
    LM.cellcolors = Object.create(null);
    g.profiles[0] = { color: '#ff00ff' };
    g.application.selectedProfile = 0;
    g.defaultmapsettings.myCustomColor = true;
    const s1 = spect(5);
    s1.playerCellIDs = [s1.newID(64)];
    s1.active = true;
    s1.updateCells(packet([], [{ id: 60, x: 100, y: 100, size: 60, food: false, name: 'Foe', color: 0x00c800 },
        { id: 61, x: 300, y: 100, size: 60, food: false, color: 0xc80000 },
        { id: 62, x: 500, y: 100, size: 100, food: false, virus: true, color: 0x33ff33 },
        { id: 64, x: 700, y: 100, size: 60, food: false, name: 'Me', color: 0x00c8c8 }], []), 0);
    check('simplified cell colours on: another player\'s cell keeps its server colour (and is remembered with it)', col(60) === hex(0x00c800) && LM.cellcolors.Foe === hex(0x00c800), [col(60), LM.cellcolors.Foe]);
    check('simplified cell colours on: an unnamed cell keeps its server colour', col(61) === hex(0xc80000), col(61));
    check('simplified cell colours on: a virus keeps its colour', col(62) === hex(0x33ff33), col(62));
    check('simplified cell colours on: the unit\'s own cell keeps the profile colour', col(64) === '#ff00ff', col(64));
    /* a later colour for a known cell is applied as it is */
    s1.updateCells(packet([], [{ id: 61, x: 300, y: 100, size: 60, food: false, color: 0x0000c8 }], []), 0);
    check('simplified cell colours on: a later server colour is applied as it is', col(61) === hex(0x0000c8), col(61));
    g.defaultmapsettings.myCustomColor = false;
    g.defaultmapsettings.oneColoredSpectator = false;
}

/* 7. Canvas2D and Expanding Land WebGL draw the same list */
reset();
{
    mainFood(1, 0, 0, hex(0x40a0f0));
    const sp = spect(1);
    sp.updateCells(packet([], [{ id: 2, x: 0, y: 0 }, { id: 3, x: 50, y: 0 }], []), 0);
    const R = g.renderer;
    R.got = []; R._el = false; R.drawFood();
    R._el = true; R.drawFood();
    const want = drawList();
    check('Canvas2D and WebGL food passes get the same list (one per pellet)', R.got.length === 2 && R.got[0][0] === 'canvas' && R.got[1][0] === 'webgl' && R.got[0][1] === want && R.got[1][1] === want && want.length === 2);
}
/* 8. cost: 5 spectators over 4000 pellets with overlapping views (Full Map) */
reset();
{
    let s = 99;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const pel = [];
    for (let i = 0; i < 4000; i++) pel.push({ x: Math.floor(rnd() * 7000), y: Math.floor(rnd() * 7000), color: (rnd() * 0xffffff) | 0 });
    for (let i = 0; i < 1500; i++) mainFood(i + 1, pel[i].x, pel[i].y, hex(pel[i].color));
    const sps = [1, 2, 3, 4, 5].map(spect);
    const t0 = process.hrtime.bigint();
    sps.forEach((sp, k) => {
        const view = pel.map((p, i) => Object.assign({ id: 100000 * (k + 1) + i }, p)).filter((p) => p.x >= k * 1200 && p.x <= k * 1200 + 2400);
        sp.updateCells(packet([], view, []), 0);
    });
    const addMs = Number(process.hrtime.bigint() - t0) / 1e6;
    const st = stats();
    let t1 = process.hrtime.bigint();
    for (let f = 0; f < 200; f++) drawList();
    const frameUs = Number(process.hrtime.bigint() - t1) / 1e3 / 200;
    /* unique pellets: every pellet in some view */
    const unique = pel.filter((p, i) => i < 1500 || sps.some((sp, k) => p.x >= k * 1200 && p.x <= k * 1200 + 2400)).length;
    check('Full Map scale: one entry per pellet (' + st.observations + ' observations, ' + st.pellets + ' pellets drawn, ' + unique + ' pellets)', st.pellets === unique, st.pellets + '/' + unique);
    t1 = process.hrtime.bigint();
    sps.forEach((sp) => sp.flushCellsData());
    const flushMs = Number(process.hrtime.bigint() - t1) / 1e6;
    console.log('info food: ' + (st.observations - 1500) + ' spectator + 1500 main observations -> ' + st.pellets + ' pellets drawn (before: ' + st.observations + ' drawn, ' + (st.observations - 1500) + ' of them as cells); packets ' + addMs.toFixed(1) + ' ms, list per frame ' + frameUs.toFixed(2) + ' us, 5 disconnects ' + flushMs.toFixed(1) + ' ms');
    check('all spectators gone: back to LM.food', drawList() === LM.food && LM.food.length === 1500);
}
/* a connection number used again (Full Map off / on, a reconnect: spect.js numbers from 1
 * again): the new connection starts from nothing of the old one's food state or colours */
reset();
{
    const gone = (sp) => { sp.flushCellsData(); sp._lmDropLooks(); g.spects.splice(g.spects.indexOf(sp), 1); };
    const pel = (base, n, x0) => Array.from({ length: n }, (_, i) => ({ id: base + i, x: x0 + i * 40, y: 300 }));
    /* pellets that come before the orientation is verified, no frame until it is (hidden tab,
     * food hidden or zoomed out): all drawn once it is verified */
    const a = spect(1);
    a.updateCells(packet([], pel(100, 50, 0), []), 0);
    check('reused number: the first connection\'s 50 pellets drawn', drawList().length === 50, drawList().length);
    gone(a);
    const b = spect(1);
    b._testFeed = false;
    b.updateCells(packet([], pel(200, 50, 0), []), 0);
    b._testFeed = true;
    const l = drawList();
    check('reused number: the new connection\'s 50 pellets from before its verification are drawn (were 0: the old one\'s "fed" was kept)', l.length === 50 && l.every((c) => c.spectator === 1), l.length);
    /* with a unit open (the list stays on): a new tile with the old number and another transform */
    reset();
    const unit = spect(1);
    unit.updateCells(packet([], pel(300, 5, 5000), []), 0);
    const t1 = spect(2);
    t1.getX = (x) => x + 300; t1.getY = (y) => y;
    t1.updateCells(packet([], pel(400, 40, 0), []), 0);
    drawList();
    gone(t1);
    const t2 = spect(2);
    t2.getX = (x) => x - 300; t2.getY = (y) => y;
    t2.updateCells(packet([], pel(500, 40, 0), []), 0);
    const own = Array.from(vm.runInContext('lmObsOfSource(2)', g)), ents = own.map((c) => c._lmFoodEnt);
    drawList();
    const moved = own.filter((c, i) => c._lmFoodEnt !== ents[i]).length;
    check('reused number beside a unit: the new tile\'s 40 pellets are not placed again on the first frame (were 40: the old tile\'s transform was compared)', own.length === 40 && moved === 0, own.length + ' / ' + moved);
    check('reused number beside a unit: 45 pellets drawn', drawList().length === 45, drawList().length);
    /* shared colours: the closed connection's go, another connection's (12, the main socket) stay */
    vm.runInContext('[2, 12, 0].forEach(function (s) { _lmMbLookSet({ spectator: s, _lmGen: 1, _lmRawColor: "#40a0f0", _lmSrvName: "x", color: "#123456", _lmMbLookT: 1 }); });', g);
    gone(t2);
    const look = (s) => vm.runInContext('lmMbLookOf(' + s + ', 1, "#40a0f0", "x")', g);
    check('a closed connection\'s shared colours are forgotten, the others\' kept', !look(2) && !!look(12) && !!look(0));
}
/* a round trip VERIFIED -> CONFLICTED -> VERIFIED with no frame in between (hidden tab, food
 * hidden): the pellets that came while CONFLICTED are drawn once it is verified again (the
 * real _lmFeedOk / _lmOriSet; the list only added them when a frame saw the CONFLICTED state) */
reset();
{
    const pel = (base, n, x0) => Array.from({ length: n }, (_, i) => ({ id: base + i, x: x0 + i * 40, y: 300 }));
    const sp = spect(3);
    delete sp._lmFeedOk;
    Object.assign(sp, { mapOffsetFixed: true, _lmSameFrame: false, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1 });
    sp._lmOriSet('VERIFIED');
    sp.updateCells(packet([], pel(700, 50, 0), []), 0);
    const n0 = drawList().length;
    sp._lmOriSet('CONFLICTED');
    sp.updateCells(packet([], pel(800, 30, 3000), []), 0);
    sp._lmOriSet('VERIFIED');
    const n1 = drawList().length;
    check('CONFLICTED and verified again with no frame between: 50 + 30 pellets drawn (were 50)', n0 === 50 && n1 === 80, n0 + ' / ' + n1);
}

/* The Canvas2D food pass (drawCachedFood) on the Full Map list: the same pellets drawn, but a
 * pellet far off screen is culled by its entry (same slot), not read as a cell: each of the
 * ~10000 pellets of the map was read every frame (~2 ms) to draw the few hundred on screen. */
reset();
{
    const fr = vm.runInContext('({ canvasWidth: 1600, canvasHeight: 900, camX: 0, camY: 0, scale: 1, isLegendWorldMapDeformationVisible: function () { return false; },\n' +
        src.slice(src.indexOf('        drawCachedFood(ctx, food, scale, reset) {'), src.indexOf('        drawCircle(ctx, x, y, radius, color) {')).trim().replace(/,$/, '') + '})', g);
    const sp = spect(1);
    sp.getX = (x) => x; sp.getY = (y) => y;
    const cells = [];
    for (let i = 0; i < 60; i++) for (let j = 0; j < 40; j++) cells.push({ id: 5000 + i * 40 + j, x: -6000 + i * 200, y: -4000 + j * 200 });
    sp.updateCells(packet([], cells, []), 0);
    mainFood(9, 100, 100);
    const list = drawList();
    let reads = 0;
    const drawnAt = (rainbow) => {
        g.defaultmapsettings.rainbowFood = rainbow;
        const pts = [];
        const ctx = { save() { }, restore() { }, beginPath() { }, stroke() { }, fill() { }, lineTo() { }, arc() { }, moveTo(x, y) { pts.push(x + ',' + y); } };
        for (const c of list) {
            const inv = c.invisible;
            Object.defineProperty(c, 'invisible', { configurable: true, get() { reads++; return inv; } });
        }
        reads = 0;
        fr.drawCachedFood(ctx, list, 1);
        const n = reads;
        for (const c of list) { const inv = c.invisible; delete c.invisible; c.invisible = inv; }
        reads = n;
        return pts;
    };
    /* the screen at zoom 1 is -800..800 x -450..450, 200 more for the cull */
    const want = list.filter((c) => c.x >= -1000 && c.x <= 1000 && c.y >= -650 && c.y <= 650).length;
    for (const rainbow of [false, true]) {
        const pts = drawnAt(rainbow);
        check('Full Map food pass (' + (rainbow ? 'rainbow' : 'one colour') + '): the pellets near the screen drawn, once each', pts.length === want && new Set(pts).size === want, pts.length + ' / ' + want);
        check('Full Map food pass (' + (rainbow ? 'rainbow' : 'one colour') + '): only pellets near the screen read (' + reads + ' of ' + list.length + ')', reads < list.length / 4, reads);
    }
    g.defaultmapsettings.rainbowFood = true;
}

/* Packets cut short on a unit / spectator connection (spect.js lmWorldUpdateEnd, opcodes 17, 64,
 * 69, 255): a world update that is not whole changes nothing (before: its eats and first records
 * were applied, then it threw), a cut camera or ghost list keeps the last one, an LZ4 block that
 * decodes short is refused (its zero tail read as records) */
{
    /* the page's own Buffer (handleMessage 16 / 64 wrap the message in it) and the main decoder */
    Object.assign(g, { DataView, RangeError, TypeError, Error, Uint8Array, ArrayBuffer, Object, Number, String });
    vm.runInContext(read(path.join(root, 'extras', 'buffer.js')), g);
    g._lz4wasmLoading = true; /* the JS decoder (no WASM in the vm) */
    const dmA = src.indexOf('        decompressMessage(message) {\n'), dmB = src.indexOf('        /* ── Expanding Land: Handle map resize', dmA);
    LM.decompressMessage = vm.runInContext('({' + src.slice(dmA, dmB).trim().replace(/,$/, '') + '})', g).decompressMessage;
    const ab = (b) => { const u = new Uint8Array(b); return u.buffer.slice(u.byteOffset, u.byteOffset + u.length); };
    const msg = (op, b) => ab(Buffer.concat([Buffer.from([op]), b]));
    const world = () => {
        reset();
        LM.cellcolors = {};
        const sp = spect(1);
        sp._lmAnchors = [];
        sp.updateCells(packet([], [
            { id: 100, x: 1000, y: 1000, size: 60, name: 'alice', food: false },
            { id: 101, x: 1050, y: 1000, size: 30, name: 'bob', food: false },
            { id: 200, x: 2000, y: 2000 }, { id: 201, x: 2100, y: 2000 }], []), 0);
        sp.time = 1; sp._lmWorldAt = 1;
        return sp;
    };
    const snap = (sp) => {
        const cells = Object.keys(LM.indexedCells).sort().map((k) => { const c = LM.indexedCells[k]; return [k, c.targetX, c.targetY, c.targetSize, !!c.removed, c.accID, c.targetNick]; });
        return JSON.stringify({ cells, n: [LM.cells.length, LM.foodMulti.length, LM.removedCells.length, LM.playerCellsMulti.length], food: stats(),
            anchors: sp._lmAnchors.length, time: sp.time, at: sp._lmWorldAt, colors: LM.cellcolors });
    };
    /* A eats B, A moves, new C with an account id, a new pellet, food 200 and 201 removed */
    const P = packet([[100, 101]], [{ id: 100, x: 1300, y: 1000, size: 64, name: 'alice', food: false },
        { id: 102, x: 3000, y: 3000, size: 40, name: 'carol', food: false, acc: 777 }, { id: 202, x: 2500, y: 2500 }], [200, 201]);
    let same = 0, bad = 0, errs = 0;
    for (let len = 0; len < P.length; len++) {
        const sp = world(), before = snap(sp);
        sp.onmessage({ data: msg(16, P.slice(0, len)) });
        if (snap(sp) === before) same++;
        if (sp._lmBadUpdates === 1) bad++;
        errs += sp._lmDecodeErrors || 0;
    }
    check('every cut of a world update (' + P.length + ' lengths) changes nothing: cells, eats, removals, account ids, food list, anchors, update time, nick colours',
        same === P.length, same + ' / ' + P.length);
    check('each cut counted as a bad update (_lmBadUpdates), none thrown', bad === P.length && errs === 0, bad + ' bad, ' + errs + ' thrown');
    /* the cuts of the earlier failures: eat list, after it, after a record, before the account id,
     * before the removal count, in the removal list */
    const named = { 'eat list': 6, 'after the eat list': 10, 'after record A': 35, 'before the account id of C': 60, 'before the removal count': P.length - 10, 'in the removal list': P.length - 4 };
    for (const k in named) {
        const sp = world(), before = snap(sp);
        sp.onmessage({ data: msg(16, P.slice(0, named[k])) });
        check('cut ' + k + ' (' + named[k] + ' bytes): nothing changed', snap(sp) === before);
    }
    {
        const sp = world();
        sp.onmessage({ data: msg(16, P) });
        const A = LM.indexedCells[g.lmUnitCellId(100, 1)], C = LM.indexedCells[g.lmUnitCellId(102, 1)];
        check('the whole update is applied (eat, move, account id, new pellet, removals) and stamps _lmWorldAt',
            A && A.targetX === 1300 && !LM.indexedCells[g.lmUnitCellId(101, 1)] && C && C.accID === 777 && LM.indexedCells[g.lmUnitCellId(202, 1)] &&
            !LM.indexedCells[g.lmUnitCellId(200, 1)] && !LM.indexedCells[g.lmUnitCellId(201, 1)] && sp._lmWorldAt > 1 && sp.time > 1 && !sp._lmBadUpdates);
        /* two bad, one good: nothing; then three bad in a row: the socket is renewed (the server
         * sends only what changed, so a local flush lost the food and still cells for good) */
        const sock = { readyState: 1, closes: 0, close() { this.closes++; this.readyState = 2; } };
        sp.socket = sock;
        Object.assign(sp, { isSpectateEnabled: true, isFreeSpectate: true, _openedAt: Date.now() - 5000, _reconnectAttempts: 2 });
        const cut = msg(16, P.slice(0, 35));
        sp.onmessage({ data: cut }); sp.onmessage({ data: cut });
        sp.onmessage({ data: msg(16, packet([], [{ id: 100, x: 1310, y: 1000, size: 64, name: 'alice', food: false }], [])) });
        check('two bad updates then a whole one: kept, the run counter reset, socket left open',
            LM.indexedCells[g.lmUnitCellId(100, 1)] && sp._lmBadRun === 0 && sp._lmBadUpdates === 2 && sock.closes === 0);
        let flushes = 0;
        sp.flushCellsData = function () { flushes++; return g.Spect.prototype.flushCellsData.call(this); };
        sp.onmessage({ data: cut }); sp.onmessage({ data: cut });
        const kept = !!LM.indexedCells[g.lmUnitCellId(100, 1)] && sock.closes === 0;
        sp.onmessage({ data: cut }); sp.onmessage({ data: cut });
        check('spectator / Full Map tile, bad updates in a row: the socket closed once, after the third; no local flush, spectate flags not reset',
            kept && sock.closes === 1 && flushes === 0 && sp.socket === sock && LM.indexedCells[g.lmUnitCellId(100, 1)] &&
            sp.isSpectateEnabled === true && sp.isFreeSpectate === true && sp._lmBadUpdates === 6,
            sock.closes + ' closes, ' + flushes + ' flushes, ' + sp._lmBadUpdates + ' bad');
        /* the close event takes the dropped-socket path (onclose: flush, reset, backoff, reconnect) */
        const timers = [], st = g.setTimeout, made = [];
        g.setTimeout = (f, ms) => { timers.push([f, ms]); return 9; };
        g.createLegendWebSocket = () => { const w = { readyState: 0, closes: 0, _lwIntegrity: true, close() { this.closes++; this.readyState = 2; } }; made.push(w); return w; };
        sock.readyState = 3;
        sp.onclose(sock, sp.connectionGeneration);
        const ic = LM.indexedCells;
        check('renewal: onclose drops the old generation\'s cells and counts the attempt in the reconnect budget (3rd attempt, 4 s backoff)',
            flushes === 1 && !Object.keys(ic).some((k) => ic[k].spectator === 1) && sp.socket === null &&
            sp._reconnectAttempts === 3 && timers.length === 1 && timers[0][1] === 4000, [flushes, sp._reconnectAttempts, timers.map((t) => t[1])].join());
        timers[0][0]();
        check('renewal: the backoff timer opens a new socket of a new generation, the bad run starts again',
            made.length === 1 && sp.socket === made[0] && sp.connectionGeneration === 2 && sp._lmBadRun === 0 && typeof made[0].onclose === 'function');
        /* a socket open for more than 60 s: a dropped one would reset the budget, a renewal still
         * counts (garbage after a minute must not renew once a minute for ever) */
        sp._openedAt = Date.now() - 70000;
        made[0].readyState = 1;
        for (let k = 0; k < 3; k++) sp.onmessage({ data: cut });
        const renewedLong = made[0].closes === 1;
        made[0].readyState = 3;
        made[0].onclose();
        check('renewal of a connection open > 60 s: the attempt count still goes up (3 -> 4, 8 s backoff), no reset',
            renewedLong && sp._reconnectAttempts === 4 && timers.length === 2 && timers[1][1] === 8000, [sp._reconnectAttempts, timers.map((t) => t[1])].join());
        timers[1][0]();
        /* the budget: a server that keeps sending garbage cannot loop, it ends as a dropped socket does */
        sp._reconnectAttempts = 8; sp._openedAt = Date.now() - 70000;
        made[1].readyState = 1;
        for (let k = 0; k < 3; k++) sp.onmessage({ data: cut });
        const renewed = made.length === 2 && made[1].closes === 1;
        made[1].readyState = 3;
        made[1].onclose();
        check('renewal with the reconnect budget used up (even after > 60 s open): closed, but no further reconnect', renewed && timers.length === 2 && sp.socket === null && made.length === 2, timers.length);
        g.setTimeout = st; delete g.createLegendWebSocket;
    }
    /* a playing multibox unit with its own cells: bad updates never flush or end it */
    {
        reset();
        LM.cellcolors = {};
        const sp = spect(1), own = g.lmUnitCellId(100, 1);
        Object.assign(sp, { player: true, active: true, playerCellIDs: [own], _lmAnchors: [] });
        let ended = 0, flushes = 0;
        sp.terminate = () => { ended++; };
        sp.beforecalculation = () => { };
        sp.flushCellsData = function () { flushes++; return g.Spect.prototype.flushCellsData.call(this); };
        const sock = { readyState: 1, closes: 0, close() { this.closes++; } };
        sp.socket = sock;
        sp.onmessage({ data: msg(16, packet([], [{ id: 100, x: 1000, y: 1000, size: 60, name: 'alice', food: false }, { id: 200, x: 2000, y: 2000 }], [])) });
        const mine = LM.indexedCells[own];
        const cut = msg(16, P.slice(0, 35));
        for (let k = 0; k < 4; k++) sp.onmessage({ data: cut });
        check('playing unit, 4 bad updates in a row: still alive (no flush, no terminate, no reconnect), own cells and playerCellIDs kept, counted',
            mine && !mine.removed && LM.indexedCells[own] === mine && LM.playerCellsMulti.includes(mine) && sp.getOwnPlayerCells().length === 1 &&
            sp.playerCellIDs.length === 1 && sp.playerCellIDs[0] === own && ended === 0 && flushes === 0 && sock.closes === 0 && sp.socket === sock &&
            sp._lmBadUpdates === 4 && sp._lmBadRun === 4,
            ended + ' ended, ' + flushes + ' flushes, ' + sock.closes + ' closes');
        sp.onmessage({ data: msg(16, packet([], [{ id: 100, x: 1020, y: 1000, size: 60, name: 'alice', food: false }], [])) });
        check('playing unit: its next whole update goes on', mine.targetX === 1020 && sp._lmBadRun === 0 && ended === 0);
    }
    /* an in-game spectator in free spectate: bad updates renew its socket; nothing is dropped or
     * reset locally before the close event (it keeps following the cursor until then) */
    {
        reset();
        const sp = spect(1);
        let tick = null, sent = 0;
        const si = g.setInterval, ci = g.clearInterval;
        g.setInterval = (f) => { tick = f; return 7; }; g.clearInterval = () => { };
        Object.assign(sp, { staticX: null, staticY: null, _lmAnchors: [], isSpectateEnabled: true, isFreeSpectate: false });
        sp.sendAction = () => { }; sp.sendPosition = () => { sent++; }; sp.convertX = sp.convertY = (v) => v;
        LM.cursorX = 100; LM.cursorY = 200;
        sp.sendFreeSpectate();
        sp.updateCells(packet([], [{ id: 100, x: 1000, y: 1000, size: 60, name: 'alice', food: false }], []), 0);
        const sock = { readyState: 1, closes: 0, close() { this.closes++; this.readyState = 2; } };
        sp.socket = sock;
        const cut = msg(16, P.slice(0, 35));
        for (let k = 0; k < 3; k++) sp.onmessage({ data: cut });
        tick();
        g.setInterval = si; g.clearInterval = ci;
        check('in-game spectator in free spectate, 3 cut updates: socket closed once, cells and spectate flags untouched until the close event, cursor still followed',
            sock.closes === 1 && LM.indexedCells[g.lmUnitCellId(100, 1)] && sp.isFreeSpectate === true && sp.isSpectateEnabled === true && sp.positionController === 7 && sent === 1,
            [sock.closes, sp.isFreeSpectate, sp.isSpectateEnabled, sent].join());
    }
    /* legacy MultiOgar (imsolo, agar2, private, no integrity) and Garix records are not the layout
     * the pass reads: their updates go through updateCells as before */
    {
        const legacy = packet([], [{ id: 100, x: 1000, y: 1000, size: 60, name: 'alice', food: false }], []).slice(0, 26);
        const run = (serverType, integrity) => {
            reset();
            LM.serverType = serverType;
            const sp = spect(1);
            sp.integrity = integrity; sp._lmAnchors = [];
            let threw = false;
            try { sp.updateCells(legacy, 0); } catch (e) { threw = true; }
            delete LM.serverType;
            return { bad: sp._lmBadUpdates || 0, read: threw && sp.time > 0 };
        };
        const agar = run('agario', true), el = run('expandingland', false);
        const skipped = [['imsolo', true], ['agar2', true], ['private', true], ['garix', false], ['senpa', false]].map((a) => run(a[0], a[1]));
        check('agar.io / Expanding Land: the whole-update check runs', agar.bad === 1 && el.bad === 1 && !agar.read && !el.read);
        check('legacy MultiOgar / Garix / no-integrity servers: the check is skipped, the packet read as before', skipped.every((r) => r.bad === 0 && r.read), JSON.stringify(skipped));
    }
    /* opcode 17: cut after x, NaN position, out-of-range or NaN scale */
    {
        const sp = world();
        Object.assign(sp, { viewX: 11, viewY: 22, scale: 0.5, _lmCamAt: 5 });
        const warn = g.console.warn, error = g.console.error; let warns = 0, errors = 0; g.console.warn = () => warns++; g.console.error = () => errors++;
        const cam = (x, y, s) => { const b = Buffer.alloc(12); b.writeFloatLE(x, 0); b.writeFloatLE(y, 4); b.writeFloatLE(s, 8); return b; };
        const at = () => [sp.viewX, sp.viewY, sp.scale, sp._lmCamAt].join();
        sp.onmessage({ data: msg(17, cam(999, 888, 0.3).slice(0, 6)) });
        const cut = at();
        sp.onmessage({ data: msg(17, cam(NaN, 888, 0.3)) });
        const nanX = at();
        check('opcode 17 cut at 7 bytes or NaN position: camera and _lmCamAt kept', cut === '11,22,0.5,5' && nanX === cut, cut + ' | ' + nanX);
        sp.onmessage({ data: msg(17, cam(999, 888, 5)) });
        check('opcode 17 scale 5: position and _lmCamAt taken, the last usable scale kept', sp.viewX === 999 && sp.viewY === 888 && sp.scale === 0.5 && sp._lmCamAt > 5, at());
        sp.scale = NaN; sp._lmCamAt = 5;
        sp.onmessage({ data: msg(17, cam(990, 880, NaN)) });
        check('opcode 17 NaN scale with no usable one before: position taken, the free spectate scale stored', sp.viewX === 990 && sp.viewY === 880 &&
            sp.scale === vm.runInContext('LM_SPECT_FREE_SCALE', g) && sp._lmCamAt > 5, at());
        sp.onmessage({ data: msg(17, cam(999, 888, 0.25)) });
        check('opcode 17 whole: camera taken', sp.viewX === 999 && sp.viewY === 888 && sp.scale === 0.25 && sp._lmCamAt > 5);
        check('bad packets counted (_lmDecodeErrors), one warning a minute at most', sp._lmDecodeErrors === 2 && warns === 1 && errors === 0, warns);
        /* a fault in the handler (not a short packet): logged with its stack, once per message */
        const hm = sp.handleMessage;
        sp.handleMessage = () => { throw new TypeError('boom'); };
        sp.onmessage({ data: msg(17, cam(1, 2, 0.3)) }); sp.onmessage({ data: msg(17, cam(1, 2, 0.3)) });
        sp.handleMessage = hm;
        g.console.warn = warn; g.console.error = error;
        check('a TypeError in the handler: console.error once per message, counted, no warning', errors === 1 && warns === 1 && sp._lmDecodeErrors === 4, errors);
    }
    /* opcode 69: count 3, 2.4 records */
    {
        const sp = world();
        const old = [{ x: 1, y: 1, size: 100, mass: 100 }, { x: 2, y: 2, size: 100, mass: 100 }, { x: 3, y: 3, size: 100, mass: 100 }];
        sp.ghostCells = old; sp._lmGhostTime = 5;
        const b = Buffer.alloc(2 + 13 * 2 + 5); b.writeUInt16LE(3, 0);
        for (let k = 0; k < 2; k++) { b.writeInt32LE(500 + k, 2 + k * 13); b.writeInt32LE(600, 6 + k * 13); b.writeUInt32LE(4000, 10 + k * 13); }
        sp.onmessage({ data: msg(69, b) });
        check('opcode 69 with 3 records announced and 2.4 sent: the last ghost cells and _lmGhostTime kept', sp.ghostCells === old && sp.ghostCells.length === 3 && sp._lmGhostTime === 5);
    }
    /* opcode 64: a cut border sets no side */
    {
        const sp = world();
        Object.assign(sp, { viewMinX: 7, viewMinY: 7, viewMaxX: 7, viewMaxY: 7, mapOffsetFixed: false });
        const b = Buffer.alloc(32); b.writeDoubleLE(-7000, 0); b.writeDoubleLE(-7000, 8); b.writeDoubleLE(7000, 16); b.writeDoubleLE(7000, 24);
        sp.onmessage({ data: msg(64, b.slice(0, 20)) });
        check('opcode 64 cut short: no side of the border set', sp.viewMinX === 7 && sp.viewMinY === 7 && sp.viewMaxX === 7 && sp.viewMaxY === 7);
    }
    /* opcode 255: a literals-only LZ4 block of the update, cut short */
    {
        const inner = Buffer.concat([Buffer.from([16]), P]);
        const ext = []; for (let n = inner.length - 15; ; n -= 255) { if (n >= 255) ext.push(255); else { ext.push(n); break; } }
        const block = Buffer.concat([Buffer.from([0xF0]), Buffer.from(ext), inner]);
        const z = (blk) => { const h = Buffer.alloc(5); h[0] = 255; h.writeUInt32LE(inner.length, 1); return ab(Buffer.concat([h, blk])); };
        const short = z(block.slice(0, ext.length + 1 + 1 + 40));
        let sp = world(), before = snap(sp);
        sp.handleMessage(new DataView(short));
        check('opcode 255 block cut short (main decoder): nothing changed, counted', snap(sp) === before && sp._lmDecodeErrors === 1);
        const mainDm = LM.decompressMessage;
        delete LM.decompressMessage;
        sp = world(); before = snap(sp);
        sp.handleMessage(new DataView(short));
        check('opcode 255 block cut short (the copy for a core without the main decoder): nothing changed', snap(sp) === before && sp._lmDecodeErrors === 1);
        sp.handleMessage(new DataView(z(block)));
        const okCopy = LM.indexedCells[g.lmUnitCellId(102, 1)] && LM.indexedCells[g.lmUnitCellId(102, 1)].accID === 777;
        LM.decompressMessage = mainDm;
        sp = world();
        sp.handleMessage(new DataView(z(block)));
        check('opcode 255 whole block: applied (main decoder and the copy)', okCopy && LM.indexedCells[g.lmUnitCellId(102, 1)] && LM.indexedCells[g.lmUnitCellId(102, 1)].accID === 777 && !sp._lmDecodeErrors);
        /* opcode 255 (agar.io's normal world update) cut short three times in a row: the socket is
         * renewed as for opcode 16 (the decode error returned before the bad run was counted) */
        const sock = () => ({ readyState: 1, closes: 0, close() { this.closes++; this.readyState = 2; } });
        sp = world(); sp.socket = sock();
        sp.handleMessage(new DataView(short)); sp.handleMessage(new DataView(short));
        const two = sp.socket.closes === 0 && sp._lmBadRun === 2;
        sp.handleMessage(new DataView(z(block)));
        const reset255 = sp._lmBadRun === 0 && sp.socket.closes === 0;
        for (let k = 0; k < 3; k++) sp.handleMessage(new DataView(short));
        check('opcode 255 blocks that do not decode: counted as bad world updates, a whole one resets the run, the third in a row renews the socket',
            two && reset255 && sp.socket.closes === 1 && sp._lmBadUpdates === 5 && sp._lmDecodeErrors === 5,
            [two, reset255, sp.socket.closes, sp._lmBadUpdates, sp._lmDecodeErrors].join());
        /* a block that decodes to nothing: the same */
        sp = world(); sp.socket = sock();
        sp.decompressMessage = () => g.buffer.Buffer.alloc(0);
        for (let k = 0; k < 3; k++) sp.handleMessage(new DataView(z(block)));
        check('opcode 255 blocks that decode to nothing, three in a row: the socket is renewed', sp.socket.closes === 1 && sp._lmBadRun === 3, [sp.socket.closes, sp._lmBadRun].join());
    }
    /* cost of the check on a dense update (600 records, a third named) */
    {
        const recs = [];
        for (let k = 0; k < 600; k++) recs.push({ id: 1000 + k, x: k * 10, y: k * 7, size: 30 + (k % 50), name: k % 3 ? '' : 'player' + k, food: k % 2 === 0 && k % 3 !== 0 });
        const D = new g.buffer.Buffer(ab(packet([[1, 2], [3, 4]], recs, [5, 6, 7])));
        const f = vm.runInContext('typeof lmWorldUpdateEnd === "function" ? lmWorldUpdateEnd : function () { return -1; }', g);
        let s = 0; const N = 5000; const t0 = process.hrtime.bigint();
        for (let i = 0; i < N; i++) s += f(D, 0);
        const us = Number(process.hrtime.bigint() - t0) / 1e3 / N;
        console.log('     whole-update check, 600 records (' + D.length + ' bytes): ' + us.toFixed(2) + ' us per update');
        check('the check reads the dense update to its end', s / N === D.length);
    }
}
/* 9. the grouping does not depend on the arrival order: every hidden copy is within LM_FOOD_TOL of
 *    the copy drawn for it, and the same copies give the same pellets in any order */
{
    const TOL = vm.runInContext('LM_FOOD_TOL', g);
    const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((p) => [x].concat(p)));
    const shape = () => vm.runInContext('_lmFood.ents', g).map((e) => e.rep.spectator + '@' + e.rep.x + ':' + e.obs.map((c) => c.spectator).sort().join('')).sort().join(' ');
    const far = () => { let m = 0; for (const e of vm.runInContext('_lmFood.ents', g)) for (const c of e.obs) m = Math.max(m, Math.hypot(c.x - e.rep.x, c.y - e.rep.y)); return m; };
    const load = (xs, order) => {
        reset();
        const sps = xs.map((x, k) => spect(k + 1));
        for (const k of order) sps[k].updateCells(packet([], [{ id: 50 + k, x: xs[k], y: 0, size: 10 }], []), 0);
        drawList();
        return { shape: shape(), far: far(), n: stats().pellets };
    };
    for (const xs of [[0, 4, 8], [0, 4, 8, 12, 16, 20]]) {
        const orders = xs.length === 3 ? perms([0, 1, 2]) : [[0, 1, 2, 3, 4, 5], [5, 4, 3, 2, 1, 0], [2, 5, 0, 4, 1, 3], [3, 0, 5, 1, 4, 2]];
        const res = orders.map((o) => load(xs, o));
        check('food order: ' + xs.length + ' copies ' + (xs[1] - xs[0]) + ' apart, ' + orders.length + ' arrival orders: the same pellets each time', res.every((r) => r.shape === res[0].shape), res.map((r) => r.n).join(','));
        check('food order: ' + xs.length + ' copies: every hidden copy within ' + TOL + ' of its drawn copy', res.every((r) => r.far <= TOL), res.map((r) => r.far).join(','));
    }
    /* live capture with the residual of 6e (+2 / -2): the same number of pellets in every order */
    const L = JSON.parse(read(path.join(__dirname, 'lib', 'fullmap-food-live.json')));
    const M = L.main, counts = [];
    for (const o of perms([2, 3, 4])) {
        reset();
        for (const n of o) {
            const c = L.conns.find((k) => k.n === n), w = c.maxX - c.minX, h = c.maxY - c.minY, r = n === 2 ? 2 : n === 4 ? -2 : 0, sp = spect(n);
            sp.getX = (x) => r + M.minX + (c.o[0] > 0 ? (x - c.minX) / w : (c.maxX - x) / w) * M.w;
            sp.getY = (y) => M.minY + (c.o[1] > 0 ? (y - c.minY) / h : (c.maxY - y) / h) * M.h;
            sp.updateCells(packet([], c.food.map((p, i) => ({ id: 10 + i, x: p[0], y: p[1], size: p[2] })), []), 0);
        }
        counts.push(stats().pellets + '/' + far().toFixed(1));
    }
    check('food order: live capture, residual 2, all 6 connection orders give the same pellets, none hidden past ' + TOL, new Set(counts).size === 1 && counts.every((c) => +c.split('/')[1] <= TOL), counts.join(' '));
}
/* 10. a drawn copy placed again within LM_FOOD_TOL: its entry and bucket follow it (before: the
 *     entry kept the old place; a copy near the new place made a second pellet, one 8 away joined) */
reset();
{
    const s1 = spect(1), s2 = spect(2), s3 = spect(3), s4 = spect(4);
    s1.updateCells(packet([], [{ id: 1, x: 0, y: 0, size: 10 }], []), 0);
    s2.updateCells(packet([], [{ id: 2, x: 4, y: 0, size: 10 }], []), 0);
    s1.updateCells(packet([], [{ id: 1, x: 4, y: 0, size: 10 }], []), 0);
    const e = vm.runInContext('_lmFood.ents', g);
    check('touch within tolerance: the entry is where its drawn copy is', e.length === 1 && e[0].rep.spectator === 1 && e[0].x === 4 && e[0].x === e[0].rep.x, e.map((x) => x.x + '/' + x.rep.x).join(' '));
    s3.updateCells(packet([], [{ id: 3, x: 9, y: 0, size: 10 }], []), 0);
    s4.updateCells(packet([], [{ id: 4, x: -4, y: 0, size: 10 }], []), 0);
    const ents = vm.runInContext('_lmFood.ents', g), of = (n) => ents.find((x) => x.obs.some((c) => c.spectator === n));
    check('touch within tolerance: a copy 5 from the new place joins, one 8 away does not', of(3) === of(1) && of(4) !== of(1), ents.length);
    s1.updateCells(packet([], [{ id: 1, x: 4, y: 0, size: 11 }], []), 0);
    check('touch within tolerance: the entry takes its drawn copy\'s size', of(1) && vm.runInContext('_lmFood.ents', g).every((x) => x.size === x.rep.size));
}
/* 11. the groups kept up copy by copy equal the groups made again from scratch (lmFoodReplaceAll) */
reset();
{
    let s = 5;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const sps = [1, 2, 3, 4].map(spect), ids = [[], [], [], []];
    for (let step = 0; step < 3000; step++) {
        const k = Math.floor(rnd() * 4), sp = sps[k];
        if (ids[k].length && rnd() < 0.35) {
            const id = ids[k].splice(Math.floor(rnd() * ids[k].length), 1)[0];
            sp.updateCells(packet([], [], [id]), 0);
        } else {
            /* pellets on a coarse lattice, each connection off by up to 2: many near copies */
            const id = 1000 + step, x = Math.floor(rnd() * 40) * 6 + Math.round((rnd() - 0.5) * 4), y = Math.floor(rnd() * 8) * 6 + Math.round((rnd() - 0.5) * 4);
            ids[k].push(id);
            sp.updateCells(packet([], [{ id, x, y, size: 10 }], []), 0);
        }
    }
    const sig = () => vm.runInContext('_lmFood.ents', g).map((e) => e.rep.spectator + ':' + e.rep._lmRawId + '<' + e.obs.map((c) => c.spectator + ':' + c._lmRawId).sort().join(',')).sort().join(' ');
    drawList();
    const inc = sig(), n = stats().pellets;
    vm.runInContext('lmFoodReplaceAll()', g);
    drawList();
    check('incremental groups = groups made again from scratch (' + n + ' pellets)', sig() === inc, n + '/' + stats().pellets);
    /* and the groups of one pass over all copies at once */
    vm.runInContext('(function () { var F = _lmFood, cells = []; F.ents.forEach(function (e) { e.obs.forEach(function (c) { cells.push(c); }); }); F.ents.slice().forEach(_lmFoodEntDrop); _lmFoodW.capped = false; _lmFoodRegroup(cells); })()', g);
    check('incremental groups = the groups of one pass over all copies', sig() === inc, stats().pellets);
}
/* 12. a connection's feed state changing twice between two frames (hidden tab, food hidden):
 *     the pellets follow the state it has at the frame */
reset();
{
    const sp = spect(1);
    sp.updateCells(packet([], [{ id: 1, x: 100, y: 100 }], []), 0);
    drawList();
    sp._testFeed = false;
    sp.updateCells(packet([], [{ id: 2, x: 900, y: 900 }], []), 0);
    sp._testFeed = true;
    check('feed off and on between frames: the pellet that came meanwhile is drawn', drawList().length === 2, drawList().length);
    reset();
    const s2 = spect(1);
    s2.updateCells(packet([], [{ id: 1, x: 100, y: 100 }], []), 0);
    drawList();
    s2._testFeed = false;
    s2.updateCells(packet([], [{ id: 2, x: 900, y: 900 }], []), 0);
    s2.updateCells(packet([], [], [1]), 0); /* the last listed pellet leaves: the list goes off */
    s2._testFeed = true;
    const l = drawList();
    check('feed off, list off, feed on between frames: the pellet that came meanwhile is drawn', l !== LM.food && l.length === 1, l === LM.food ? 'list off' : l.length);
    reset();
    const s3 = spect(1);
    s3._testFeed = false;
    s3.updateCells(packet([], [{ id: 1, x: 100, y: 100 }], []), 0);
    drawList();
    s3._testFeed = true;
    s3.updateCells(packet([], [{ id: 2, x: 900, y: 900 }], []), 0);
    s3._testFeed = false;
    const l3 = drawList();
    check('feed on and off between frames: none of its pellets drawn', l3 === LM.food || l3.length === 0, l3.length);
}
/* 13. Rainbow food: a pellet keeps the colour it was drawn in when another connection's copy (each
 *     connection has its own colours) is drawn from then on (before: its colour changed) */
reset();
{
    const fr = vm.runInContext('({ canvasWidth: 1600, canvasHeight: 900, camX: 0, camY: 0, scale: 1, isLegendWorldMapDeformationVisible: function () { return false; },\n' +
        src.slice(src.indexOf('        drawCachedFood(ctx, food, scale, reset) {'), src.indexOf('        drawCircle(ctx, x, y, radius, color) {')).trim().replace(/,$/, '') + '})', g);
    const fills = () => {
        const got = [];
        const ctx = { fillStyle: '', save() { }, restore() { }, beginPath() { }, stroke() { }, lineTo() { }, arc() { }, moveTo() { }, fill() { got.push(this.fillStyle); } };
        fr.drawCachedFood(ctx, drawList(), 1);
        return got.join(' ');
    };
    const m = mainFood(10, 100, 100, hex(0x40a0f0)), s1 = spect(1), s2 = spect(2);
    s1.updateCells(packet([], [{ id: 1, x: 101, y: 100, color: 0xf04040 }], []), 0);
    s2.updateCells(packet([], [{ id: 2, x: 102, y: 100, color: 0x40f040 }], []), 0);
    const want = hex(0x40a0f0), first = fills();
    m.removeCell();
    const after = fills(), l = drawList();
    check('Rainbow food: the drawn copy goes, another connection\'s copy is drawn in the pellet\'s colour', first === want && after === want && l.length === 1 && l[0].spectator === 1 && l[0].color !== want, first + ' / ' + after);
    /* the copy drawn now is placed again: the pellet is grouped again, its colour stays */
    s1.updateCells(packet([], [{ id: 1, x: 100, y: 100, color: 0xf04040 }], []), 0);
    check('Rainbow food: a pellet grouped again keeps its colour', fills() === want && drawList().length === 1, fills());
    /* the list built again (a spawn, ClearAll) and a Rotate Map flip (every pellet placed again) */
    vm.runInContext('lmFoodRebuild()', g);
    const afterRebuild = fills();
    vm.runInContext('lmFoodReplaceAll()', g);
    const afterFlip = fills();
    check('Rainbow food: a pellet keeps its colour over a rebuild of the list and a Rotate Map flip (were the drawn copy\'s own colour)', afterRebuild === want && afterFlip === want && drawList().length === 1, afterRebuild + ' / ' + afterFlip);
}
/* 14. a steered multibox unit not verified yet (lmMbFrameHide marks it _lmMbDrawOnly): its pellets
 *     outside the main server view and every verified spectator's fresh view are drawn once, from a
 *     separate list in the same food pass, not in the reconciled list; inside such a view only
 *     where that connection has a copy of the pellet (one inside the main view that the main
 *     socket has no copy of was not drawn by anyone); once it is verified they are in the list,
 *     once each (before: none of its pellets were drawn) */
reset();
{
    const R = g.renderer, ids = (l) => (l || []).filter((c) => c.spectator === 3).map((c) => c._lmRawId).sort().join(',');
    const u = spect(3);
    u._testFeed = false;
    u.player = true;
    u._lmServerViewDisplay = () => null;
    u._lmCoverageOk = () => false;
    u.updateCells(packet([], [{ id: 1, x: 5000, y: 5000 }, { id: 2, x: 100, y: 100 }, { id: 3, x: 3000, y: 3000 }, { id: 4, x: 600, y: 600 }], []), 0);
    const v = spect(1);
    v.updateCells(packet([], [{ id: 9, x: 6000, y: 100 }, { id: 10, x: 3002, y: 3001 }], []), 0);
    mainFood(11, 101, 100, hex(0x40a0f0));
    v._lmServerViewDisplay = (o) => { o[0] = 2500; o[1] = 2500; o[2] = 3500; o[3] = 3500; return o; };
    v._lmCoverageOk = () => true;
    v.time = Date.now();
    Object.assign(LM, { srvViewMinX: 0, srvViewMinY: 0, srvViewMaxX: 1000, srvViewMaxY: 1000 });
    const hide = (drawOnly) => vm.runInContext('_lmMbFeed.length = 0; _lmMbFeed[1] = true; _lmMbFeed[3] = ' + !drawOnly + '; _lmMbDrawOnly.length = 0;' + (drawOnly ? ' _lmMbDrawOnly[3] = true;' : '') + ' _lmMbDrawOnlyCover(window.spects, Date.now());', g);
    hide(true);
    R.got = []; R._el = false; R.drawFood();
    check('unverified steered unit: its pellet outside every view drawn once, from its own list after the food list', R.got.length === 2 && ids(R.got[1][1]).split(',').includes('1') && ids(R.got[0][1]) === '', R.got.map((x) => ids(x[1])).join(' | '));
    check('unverified steered unit: its pellets inside the main view or a verified spectator\'s view that connection has are not drawn by it', R.got.length === 2 && !R.got[1][1].some((c) => c._lmRawId === 2 || c._lmRawId === 3));
    check('unverified steered unit: its pellet inside the main view that the main socket has no copy of is drawn (was drawn by nobody)', R.got.length === 2 && ids(R.got[1][1]) === '1,4', R.got.length === 2 ? ids(R.got[1][1]) : R.got.length);
    vm.runInContext('_lmMbDrawOnly.length = 0;', g);
    R.got = []; R.drawFood();
    check('no draw-only unit: one food pass only', R.got.length === 1, R.got.length);
    /* verified: its pellets join the list at the next frame (feed state rescan) */
    u._testFeed = false;
    hide(true);
    u._testFeed = true;
    hide(false);
    R.got = []; R.drawFood();
    check('the unit verified: its 4 pellets in the food list, 2 and 3 with the copies of the other connections (5 pellets)', R.got.length === 1 && R.got[0][1].length === 5 && ids(R.got[0][1]) === '1,4', R.got.map((x) => ids(x[1]) + ' of ' + x[1].length).join(' | '));
    Object.assign(LM, { srvViewMinX: NaN, srvViewMinY: NaN, srvViewMaxX: NaN, srvViewMaxY: NaN });
    vm.runInContext('_lmMbFeed.length = 0; _lmMbDrawOnly.length = 0; _lmMbDoCov.length = 0;', g);
}
/* 14b. two steered units not verified yet, unit 4 listed first, its view (from its unverified
 *     transform) over the place of unit 3's pellets: unit 3's pellets are drawn in either order
 *     (they were left to unit 4, which has none there); the main socket has no food (no list) and
 *     its view holds one of unit 3's pellets it has a copy of (not drawn by unit 3) */
for (const order of ['unit 4 first', 'unit 3 first']) {
    reset();
    const R = g.renderer;
    const mk = (n, rect) => {
        const s = spect(n);
        s._testFeed = false;
        s.player = true;
        s._lmServerViewDisplay = (o) => { o[0] = rect[0]; o[1] = rect[1]; o[2] = rect[2]; o[3] = rect[3]; return o; };
        s._lmCoverageOk = () => false;
        return s;
    };
    const w = order === 'unit 4 first' ? mk(4, [4800, 4800, 5600, 5600]) : null;
    const u = mk(3, [7000, 7000, 8000, 8000]);
    const w2 = w || mk(4, [4800, 4800, 5600, 5600]);
    u.updateCells(packet([], [{ id: 1, x: 5000, y: 5000 }, { id: 2, x: 5100, y: 5000 }, { id: 3, x: 200, y: 200 }], []), 0);
    w2.updateCells(packet([], [{ id: 5, x: 9000, y: 9000 }], []), 0);
    mainFood(12, 201, 200, hex(0x40a0f0));
    Object.assign(LM, { srvViewMinX: 0, srvViewMinY: 0, srvViewMaxX: 1000, srvViewMaxY: 1000 });
    vm.runInContext('_lmMbFeed.length = 0; _lmMbDrawOnly.length = 0; _lmMbDrawOnly[3] = _lmMbDrawOnly[4] = true; _lmMbDrawOnlyCover(window.spects, Date.now());', g);
    R.got = []; R._el = false; R.drawFood();
    const own = (n) => (R.got[1] ? R.got[1][1] : []).filter((c) => c.spectator === n).map((c) => c._lmRawId).sort().join(',');
    check('two unverified units (' + order + '): each one\'s pellets drawn, none left to the other unit\'s unverified view', R.got.length === 2 && own(3) === '1,2' && own(4) === '5', own(3) + ' / ' + own(4));
    Object.assign(LM, { srvViewMinX: NaN, srvViewMinY: NaN, srvViewMaxX: NaN, srvViewMaxY: NaN });
    vm.runInContext('_lmMbFeed.length = 0; _lmMbDrawOnly.length = 0; _lmMbDoCov.length = 0;', g);
}
/* 14c. food evidence (ogario.v4.js lmFoodFrame, _lmFoodStaleSweep): a Full Map tile 500 ms behind
 *     the main socket's fresh world updates (stale): a pellet the player ate (the main copy gone)
 *     inside the main server view is not drawn from the tile's frozen copy; its pellet outside every
 *     fresh view stays drawn (no hole for the stall: absence of evidence); fresh again, both are
 *     drawn once; a busy page (every socket late, the main one too) drops nothing */
reset();
{
    const t = spect(2);
    t.updateCells(packet([], [{ id: 1, x: 3000, y: 3000 }, { id: 2, x: 4000, y: 3000 }], []), 0);
    const m = mainFood(13, 3001, 3000, hex(0x40a0f0));
    Object.assign(LM, { integrity: true, srvViewMinX: 2500, srvViewMinY: 2500, srvViewMaxX: 3500, srvViewMaxY: 3500 });
    LM._lmLastWorldUpdate = Date.now();
    const before = drawList().length;
    t._lmWorldAt = Date.now() - 500;
    m.removeCell();
    const stalledL = drawList(), stalled = stalledL.length, kept = stalledL.map((c) => c._lmRawId).join();
    t._lmWorldAt = Date.now();
    const back = drawList().length, backObs = stats().observations;
    t._lmWorldAt = Date.now() - 500;
    LM._lmLastWorldUpdate = Date.now() - 450;
    const busy = drawList().length;
    LM._lmLastWorldUpdate = 0;
    Object.assign(LM, { integrity: undefined, srvViewMinX: NaN, srvViewMinY: NaN, srvViewMaxX: NaN, srvViewMaxY: NaN });
    check('tile 500 ms behind the fresh main socket: the pellet the player ate (in the main view) not drawn, its pellet no fresh view sees still drawn, both back once fresh (once each)',
        before === 2 && stalled === 1 && kept === '2' && back === 2 && backObs === 2, before + ' / ' + stalled + ' (' + kept + ') / ' + back + ' / ' + backObs);
    check('every socket late (busy page): the tile\'s pellets still drawn', busy === 2, busy);
}
/* 14d. a played unit stalled (no world update for LM_MB_STALL_MS; lmSrcStale never holds a played
 *     unit): a pellet eaten in the main view since (no main copy) is not drawn from its frozen copy,
 *     a pellet the main socket still has is drawn once, one outside every fresh view stays; a fresh
 *     live tile's view is evidence too, where that tile has a copy the pellet stays; the unit's next
 *     update (its removal of the eaten pellet) brings the rest back with no duplicate; a unit
 *     healthy but silent about its pellets keeps them all (absence from a packet is no removal) */
reset();
{
    const now = Date.now(), ids = (l) => l.filter((c) => c.spectator === 3).map((c) => c._lmRawId).sort().join(',');
    const u = spect(3);
    u.player = true;
    u.updateCells(packet([], [{ id: 1, x: 3000, y: 3000 }, { id: 2, x: 3200, y: 3000 }, { id: 3, x: 6000, y: 6000 }, { id: 4, x: 8000, y: 8000 }, { id: 5, x: 8200, y: 8000 }], []), 0);
    const m1 = mainFood(21, 3001, 3000, hex(0x40a0f0));
    mainFood(22, 3201, 3000, hex(0x40a0f0));
    /* a fresh, verified Full Map tile on its place over (7500..8500): it has pellet 4, not 5 */
    const t = spect(7);
    t.tile = 3;
    t.updateCells(packet([], [{ id: 40, x: 8001, y: 8000 }], []), 0);
    t._lmCoverageOk = () => true;
    t._lmTileArrived = () => true;
    t._lmServerViewDisplay = (o) => { o[0] = 7500; o[1] = 7500; o[2] = 8500; o[3] = 8500; return o; };
    Object.assign(LM, { integrity: true, srvViewMinX: 2500, srvViewMinY: 2500, srvViewMaxX: 3500, srvViewMaxY: 3500 });
    LM._lmLastWorldUpdate = now;
    const before = drawList().length;
    u._lmWorldAt = now - 300;
    const quiet = drawList().length;
    m1.removeCell();
    vm.runInContext('_lmFoodSweepAt = -Infinity;', g);
    const healthyQuiet = drawList().length;
    u._lmWorldAt = now - 1500;
    const st = drawList(), stN = st.length, stIds = ids(st);
    check('played unit healthy, its pellets unchanged: all drawn (a main copy eaten is no evidence against a contributing unit)', before === 5 && quiet === 5 && healthyQuiet === 5, before + ' / ' + quiet + ' / ' + healthyQuiet);
    /* pellet 4: one entry with the tile's copy (drawn with the unit's copy, the first in the order: the same place) */
    const e4 = vm.runInContext('_lmFood.ents', g).find((e) => e.obs.some((c) => c.spectator === 7));
    check('played unit stalled: the pellet eaten in the main view and the one a fresh tile sees gone not drawn; the main socket pellet, the tile pellet and the unseen pellet drawn once',
        stN === 3 && stIds === '3,4' && e4 && e4.obs.length === 2 && st.filter((c) => !c.spectator).length === 1, stN + ' ' + stIds);
    /* a sweep later in the stall changes nothing more (bounded: only listed stale copies are looked at) */
    vm.runInContext('_lmFoodSweepAt = -Infinity;', g);
    check('played unit stalled: a later sweep keeps the same pellets', drawList().length === 3);
    /* its next update: the eaten pellet removed by its server, the rest back, none twice */
    u.updateCells(packet([], [], [1]), 0);
    const rec = drawList(), recIds = rec.map((c) => (c.spectator || 0) + ':' + (c._lmRawId || c.id)).sort().join(',');
    check('played unit fresh again: its pellets back once each (pellet 5 drawn again, the pellet it removed gone), no duplicate',
        rec.length === 4 && stats().pellets === 4 && stats().observations === 6 && !rec.some((c) => c._lmRawId === 1), rec.length + ' ' + recIds + ' obs ' + stats().observations);
    /* recovering while every view is stale (no main view, the tile stale too): nothing goes */
    LM._lmLastWorldUpdate = 0;
    t._lmWorldAt = now - 1500;
    u._lmWorldAt = now - 1500;
    check('every source stale, no fresh view: no pellet erased', drawList().length === 4, drawList().length);
    u._lmWorldAt = t._lmWorldAt = Date.now();
    /* the unit's socket closes: its pellets leave with it (flush), the others stay */
    u.flushCellsData();
    check('a stale unit leaving: its pellets gone, the main and tile pellets stay, its stale state forgotten', drawList().length === 2 && !vm.runInContext('_lmFood.stale.has(3)', g), drawList().length);
    Object.assign(LM, { integrity: undefined, srvViewMinX: NaN, srvViewMinY: NaN, srvViewMaxX: NaN, srvViewMaxY: NaN });
}
/* 15. the list built again (lmFoodRebuild) while a connection is not verified, verified again
 *     before the next frame: its pellets are drawn (were left out: its feed state was kept) */
reset();
{
    const a = spect(1), b = spect(2);
    a.updateCells(packet([], [{ id: 1, x: 100, y: 100 }, { id: 2, x: 900, y: 900 }], []), 0);
    b.updateCells(packet([], [{ id: 5, x: 3000, y: 3000 }], []), 0);
    drawList();
    a._testFeed = false;
    vm.runInContext('lmFoodRebuild()', g);
    a._testFeed = true;
    check('rebuild while a connection is unverified, verified again before the frame: its pellets drawn', drawList().length === 3, drawList().length);
    /* a copy that comes before the drawn one in the order (the main socket's): drawn from now
     * on, the pellet's entry (slot, colour) kept */
    const e0 = vm.runInContext('_lmFood.ents', g).find((e) => e.rep.spectator === 2);
    const m = mainFood(7, 3001, 3000, hex(0x40a0f0));
    const ents = vm.runInContext('_lmFood.ents', g), l = drawList();
    check('a main copy coming after a spectator copy: drawn in the same entry', ents.length === 3 && m._lmFoodEnt === e0 && l[e0.slot] === m && e0.x === 3001 && e0.obs.length === 2, ents.length);
}
/* 16. dense food past LM_FOOD_COMP_MAX copies around a change: the search stops at the limit, and
 *     the copies it takes do not depend on the order of the entries in the grid buckets (before,
 *     the entries met first were taken up to the limit: the same groups and the same change gave
 *     other groups when only that order differed); pellets every connection sees are drawn once
 *     in any arrival order, with removals, copies seen again and moved copies; a Rotate Map flip
 *     keeps them and their Rainbow colours; a lone pellet next to the dense place stays lone */
{
    const MAX = vm.runInContext('LM_FOOD_COMP_MAX', g), TOL = vm.runInContext('LM_FOOD_TOL', g);
    const mk = (seed) => { let s = seed; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; };
    vm.runInContext('var _tCap = 0, _tGather = _lmFoodGather; _lmFoodGather = function (o, f) { var r = _tGather(o, f); if (_lmFoodW.capped) _tCap++; return r; };', g);
    const ents = () => vm.runInContext('_lmFood.ents', g);
    const sig = () => ents().map((e) => e.obs.map((c) => c.spectator + ':' + c._lmRawId).sort().join(',')).sort().join(' ');
    /* no entry with two copies of one connection, every hidden copy within LM_FOOD_TOL of the drawn one */
    const sound = () => ents().every((e) => new Set(e.obs.map((c) => c.spectator)).size === e.obs.length && e.obs.every((c) => Math.hypot(c._lmFoodX - e.rep._lmFoodX, c._lmFoodY - e.rep._lmFoodY) <= TOL && Math.abs(c._lmFoodS - e.rep._lmFoodS) <= 1));
    /* (a) 10 connections, copies 3 apart with up to 3 off: one component of ~1500 copies */
    const K = 10, pos = (rnd) => [Math.floor(rnd() * 30) * 3 + Math.round((rnd() - 0.5) * 6), Math.floor(rnd() * 10) * 3 + Math.round((rnd() - 0.5) * 6)];
    const runs = [0, 1, 2].map((shuffle) => {
        reset();
        vm.runInContext('_tCap = 0', g);
        const sps = Array.from({ length: K }, (_, k) => spect(k + 1)), rnd = mk(7);
        const t0 = process.hrtime.bigint();
        for (let i = 0; i < 1500; i++) {
            const k = Math.floor(rnd() * K), [x, y] = pos(rnd);
            sps[k].updateCells(packet([], [{ id: 1000 + i, x, y, size: 10 }], []), 0);
        }
        const start = sig();
        if (shuffle) {
            /* the same entries in the buckets in another order (bslot kept right) */
            g._tRnd = mk(100 + shuffle);
            vm.runInContext('_lmFood.grid.forEach(function (b) { for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(_tRnd() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } for (i = 0; i < b.length; i++) b[i].bslot = i; })', g);
        }
        const ev = [], er = mk(11);
        let ok = true;
        for (let i = 0; i < 300; i++) {
            const k = Math.floor(er() * K);
            if (er() < 0.5) sps[k].updateCells(packet([], [], [1000 + Math.floor(er() * 1500)]), 0);
            else { const [x, y] = pos(er); sps[k].updateCells(packet([], [{ id: 5000 + i, x, y, size: 10 }], []), 0); }
            ev.push(sig());
            if (i % 30 === 0) ok = ok && sound();
        }
        const ms = Number(process.hrtime.bigint() - t0) / 1e6;
        return { start, ev, ok: ok && sound(), caps: vm.runInContext('_tCap', g), ms, n: ents().length, obs: stats().observations };
    });
    let first = -1;
    for (let i = 0; i < runs[0].ev.length && first < 0; i++) if (runs.some((r) => r.ev[i] !== runs[0].ev[i])) first = i;
    check('dense food: the same groups with the entries in another order in their buckets, 300 changes past ' + MAX + ' copies (' + runs[0].caps + ' searches at the limit): the same groups after each', runs.every((r) => r.start === runs[0].start) && runs[0].caps > 100 && first < 0, 'first other result at change ' + first);
    check('dense food: no entry with two copies of one connection or a hidden copy past ' + TOL + ' from its drawn copy', runs.every((r) => r.ok));
    console.log('info dense food: ' + runs[0].obs + ' copies in one place, ' + runs[0].n + ' pellets drawn; 1500 copies + 300 changes ' + runs.map((r) => r.ms.toFixed(1)).join(' / ') + ' ms');
    /* (b) pellets 6 apart, each seen by every connection at most 1 off (its own copy nearer than
     *     any other pellet's): 36 pellets in one component of 216 or 432 copies */
    for (const KC of [6, 12]) {
        const pel = [];
        for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) pel.push({ x: 2000 + i * 6, y: 2000 + j * 6 });
        const res = [];
        let caps = 0;
        for (const seed of [1, 2, 3]) {
            reset();
            vm.runInContext('_tCap = 0', g);
            const rnd = mk(seed * 13), sps = Array.from({ length: KC }, (_, k) => spect(k + 1)), live = new Set();
            const put = (k, i) => {
                const x = pel[i].x + Math.floor(rnd() * 3) - 1, y = pel[i].y + Math.floor(rnd() * 3) - 1;
                sps[k].updateCells(packet([], [{ id: 100 + i, x, y, size: 10, color: (i * 7919 + k * 104729) & 0xffffff }], []), 0);
                live.add(k * 100 + i);
            };
            /* arrivals, removals, copies seen again and moved copies in another order each time */
            for (let step = 0; step < 1500; step++) {
                const k = Math.floor(rnd() * KC), i = Math.floor(rnd() * pel.length);
                if (live.has(k * 100 + i) && rnd() < 0.4) {
                    sps[k].updateCells(packet([], [], [100 + i]), 0);
                    live.delete(k * 100 + i);
                } else put(k, i);
            }
            for (let k = 0; k < KC; k++) for (let i = 0; i < pel.length; i++) if (!live.has(k * 100 + i)) put(k, i);
            caps += vm.runInContext('_tCap', g);
            const by = ents().map((e) => new Set(e.obs.map((c) => c._lmRawId)));
            res.push({ n: by.length, mixed: by.filter((s) => s.size > 1).length, once: new Set(by.map((s) => [...s][0])).size, ok: sound(), groups: ents().map((e) => e.obs.length === KC).every(Boolean) });
        }
        check('dense food: 36 pellets 6 apart seen by ' + KC + ' connections (' + 36 * KC + ' copies, ' + caps + ' searches at the limit), 3 histories: each pellet drawn once, no entry with two pellets\' copies', caps > 0 && res.every((r) => r.n === 36 && r.mixed === 0 && r.once === 36 && r.ok && r.groups), res.map((r) => r.n + '/' + r.mixed).join(' '));
    }
    /* (c) the last of them flipped (lmFoodReplaceAll: every copy placed again): the same pellets in
     *     their colours; a lone pellet next to the dense place: lone, its drawn copy leaving moves it */
    const iso = spect(13);
    iso.updateCells(packet([], [{ id: 900, x: 2045, y: 2000, size: 10 }], []), 0);
    const loneEnt = ents().find((e) => e.obs.some((c) => c.spectator === 13));
    const cols = () => ents().map((e) => e.rep._lmRawId + '=' + e.color).sort().join(' ');
    const before = sig(), colBefore = cols();
    drawList();
    vm.runInContext('lmFoodReplaceAll()', g);
    drawList();
    check('dense food: a Rotate Map flip (every copy placed again) gives the same pellets in their colours', sig() === before && cols() === colBefore && stats().pellets === 37, stats().pellets);
    const le = ents().find((e) => e.obs.some((c) => c.spectator === 13));
    const s14 = spect(14);
    s14.updateCells(packet([], [{ id: 901, x: 2046, y: 2000, size: 10 }], []), 0);
    const slot = le.slot;
    iso.updateCells(packet([], [], [900]), 0);
    check('dense food: a lone pellet next to the dense place stays lone, its drawn copy leaving moves it (same entry and slot)', loneEnt && le.lone && le.slot === slot && le.rep.spectator === 14 && le.x === 2046 && stats().pellets === 37, le && le.lone + '/' + le.slot);
    vm.runInContext('_lmFoodGather = _tGather', g);
}
/* 17. the packet path: known cells found by the raw id (lmObsIds, no unit id string per record),
 * LM.indexedCells kept as before; a removed pellet is the connection's next pellet (Spect
 * _lmFoodRelease / _lmRenew): every field as on a new pellet, in the same order, its old anchor
 * dead; one with a removal fade or drawn as a cell is not reused */
reset();
{
    const prim = (c) => { const o = {}; for (const k of Object.keys(c)) if (k !== 'time' && k !== 'updateTime' && (c[k] === null || typeof c[k] !== 'object')) o[k] = c[k]; return JSON.stringify(o); };
    const uid = (raw, n) => g.lmUnitCellId(raw, n);
    let sp = spect(1);
    sp._lmAnchors = []; sp._lmAnchorNext = 0;
    sp.updateCells(packet([], [{ id: 70, x: 300, y: 300 }, { id: 71, x: 340, y: 300, size: 40, food: false, name: 'bob' }], []), 0);
    const ids = vm.runInContext('lmObsIds(1)', g);
    const p70 = LM.indexedCells[uid(70, 1)], b71 = LM.indexedCells[uid(71, 1)];
    check('raw id index: each cell of the connection under its raw id, as in LM.indexedCells', ids && ids.get(70) === p70 && ids.get(71) === b71 && ids.size === 2);
    sp.updateCells(packet([], [{ id: 71, x: 350, y: 300, size: 41, food: false }], []), 0);
    check('raw id index: a known cell updated in place (no second cell)', LM.indexedCells[uid(71, 1)] === b71 && b71.targetX === 350 && LM.cells.length === 1 && ids.size === 2);
    const a70 = p70._lmAnchored;
    sp.updateCells(packet([], [], [70]), 0);
    check('raw id index: a removed cell leaves it', !ids.has(70) && p70.removed && !LM.indexedCells[uid(70, 1)]);
    sp.updateCells(packet([], [{ id: 72, x: 500, y: 520, size: 12 }], []), 0);
    const p72 = LM.indexedCells[uid(72, 1)];
    check('removed pellet reused for the next pellet of its connection', p72 === p70 && !p72.removed && p72._lmRawId === 72 && p72.x === 500 && p72.id === uid(72, 1) && ids.get(72) === p72);
    check('reused pellet: its old anchor dead, the new one its own', a70 && !g.lmAnchorLive(a70, 1) && p72._lmAnchored && p72._lmAnchored.rawX === 500 && g.lmAnchorLive(p72._lmAnchored, 1));
    check('reused pellet: listed once (foodMulti, the connection index, the food list)', LM.foodMulti.filter((c) => c === p72).length === 1 && vm.runInContext('lmObsOfSource(1)', g).has(p72) && p72._lmFoodEnt && drawList().filter((c) => c === p72).length === 1);
    const keysReused = Object.keys(p72).join(), primReused = prim(p72);
    /* eaten pellet reused too */
    sp.updateCells(packet([[71, 72]], [], []), 0);
    sp.updateCells(packet([], [{ id: 73, x: 600, y: 620, size: 12 }], []), 0);
    check('eaten pellet reused for the next pellet', LM.indexedCells[uid(73, 1)] === p70 && !p70._lmEaten && !p70.removed);
    /* the same pellet made new on a fresh world: same fields, values and order */
    reset();
    sp = spect(1);
    sp._lmAnchors = []; sp._lmAnchorNext = 0;
    sp.updateCells(packet([], [{ id: 71, x: 340, y: 300, size: 40, food: false, name: 'bob' }], []), 0);
    sp.updateCells(packet([], [{ id: 72, x: 500, y: 520, size: 12 }], []), 0);
    const fresh = LM.indexedCells[uid(72, 1)];
    check('reused pellet: the fields of a new pellet, in the same order, with the same values', Object.keys(fresh).join() === keysReused && prim(fresh) === primReused, prim(fresh) + ' vs ' + primReused);
    /* not reused: a pellet drawn as a cell, or one still fading in LM.removedCells */
    fresh.redrawed = 1;
    sp.updateCells(packet([], [], [72]), 0);
    sp.updateCells(packet([], [{ id: 74, x: 700, y: 720, size: 12 }], []), 0);
    check('a pellet drawn as a cell is not reused', LM.indexedCells[uid(74, 1)] !== fresh && fresh.removed);
    /* LM.indexedCells replaced without the connection index (an outside reset): looked up there
     * again, as before (a new cell, stored in the new object) */
    const old74 = LM.indexedCells[uid(74, 1)];
    LM.indexedCells = {};
    sp.updateCells(packet([], [{ id: 74, x: 700, y: 720, size: 12 }], []), 0);
    const new74 = LM.indexedCells[uid(74, 1)];
    check('LM.indexedCells replaced: a record not found there makes a new cell, as before', new74 && new74 !== old74 && vm.runInContext('lmObsIds(1)', g).get(74) === new74);
}
/* 18. the pellet pool's references (Spect _lmFoodRelease / _lmRenew): a reused pellet keeps its
 *     emptied jelly arrays (the constructor makes none for it); after a long life (list, a new
 *     transform, an eat) it is a new pellet field for field; the old raw id leads nowhere (a late
 *     removal or eat of it leaves the successor alone); released once; the pool stays bounded; a
 *     new socket drops it; a whole-world reset leaves no live anchor and no cell a packet finds */
reset();
{
    const prim = (c) => { const o = {}; for (const k of Object.keys(c)) if (k !== 'time' && k !== 'updateTime' && k !== '_lmEatenT' && (c[k] === null || typeof c[k] !== 'object')) o[k] = c[k]; return JSON.stringify(o); };
    const uid = (raw, n) => g.lmUnitCellId(raw, n);
    let sp = spect(1);
    sp._lmAnchors = []; sp._lmAnchorNext = 0;
    sp.updateCells(packet([], [{ id: 80, x: 300, y: 300 }, { id: 81, x: 340, y: 300, size: 40, food: false, name: 'eve' }], []), 0);
    const p80 = LM.indexedCells[uid(80, 1)], pts = p80.points, ptsV = p80.pointsVel;
    pts.push({ x: 1 }); ptsV.push(0);
    drawList();
    /* placed again for a new transform (lmFoodFrame), then eaten */
    sp.fix3x = 0.5;
    drawList();
    sp.fix3x = 0;
    sp.updateCells(packet([[81, 80]], [], []), 0);
    const ids = vm.runInContext('lmObsIds(1)', g), pool = () => sp._lmFoodPool.length;
    const pooled = pool();
    sp._lmFoodRelease(p80);
    check('released once: a second release of the same pellet does not pool it twice', pooled === 1 && pool() === 1, pooled + ' / ' + pool());
    sp.updateCells(packet([], [{ id: 82, x: 500, y: 520, size: 12 }], []), 0);
    const p82 = LM.indexedCells[uid(82, 1)];
    check('reused pellet: the same jelly arrays, emptied (no array made for it)', p82 === p80 && p82.points === pts && p82.pointsVel === ptsV && !pts.length && !ptsV.length);
    check('reused pellet: the old raw id is in no index, the new one is', !ids.has(80) && ids.get(82) === p82 && !LM.indexedCells[uid(80, 1)] && !p82._lmEaten && !p82.removed);
    sp.updateCells(packet([[81, 80]], [], [80]), 0);
    check('a late eat or removal of the old raw id leaves the successor alone', !p82.removed && ids.get(82) === p82 && p82._lmFoodEnt && drawList().includes(p82));
    const keysReused = Object.keys(p82).join(), primReused = prim(p82);
    reset();
    sp = spect(1);
    sp._lmAnchors = []; sp._lmAnchorNext = 0;
    sp.updateCells(packet([], [{ id: 81, x: 340, y: 300, size: 40, food: false, name: 'eve' }], []), 0);
    sp.updateCells(packet([], [{ id: 82, x: 500, y: 520, size: 12 }], []), 0);
    const fresh = LM.indexedCells[uid(82, 1)];
    drawList();
    check('pellet reused after a long life (list, new transform, eaten): the fields of a new pellet, same order and values', Object.keys(fresh).join() === keysReused && prim(fresh) === primReused, prim(fresh) + ' vs ' + primReused);
    /* bounded: LM_SPECT_FOOD_POOL at most, whatever goes */
    const many = [];
    for (let i = 0; i < 300; i++) many.push({ id: 1000 + i, x: 1000 + i * 30, y: 2000 });
    sp.updateCells(packet([], many, []), 0);
    sp.updateCells(packet([], [], many.map((c) => c.id)), 0);
    const cap = vm.runInContext('LM_SPECT_FOOD_POOL', g);
    check('pool bounded: ' + cap + ' kept of 300 removed', sp._lmFoodPool.length === cap, sp._lmFoodPool.length);
    sp.resetConnectionState();
    check('a new socket (resetConnectionState) drops the old socket\'s spare pellets', sp._lmFoodPool.length === 0);
    /* a whole-world reset (connection flush): no index holds the pellets, none of them stays a live
     * anchor (the connection's own flush that follows finds no index), none is found or reused */
    sp._lmAnchors = []; sp._lmAnchorNext = 0;
    sp.updateCells(packet([], [{ id: 90, x: 700, y: 700 }], []), 0);
    const p90 = LM.indexedCells[uid(90, 1)], a90 = p90._lmAnchored;
    const liveBefore = g.lmAnchorLive(a90, sp.connectionGeneration);
    vm.runInContext('lmObsResetAll(); LM.indexedCells = {}; LM.foodMulti = [];', g);
    sp.flushCellsData();
    check('whole-world reset: the orphaned pellet is removed and its anchor no evidence', liveBefore && p90.removed && !g.lmAnchorLive(a90, sp.connectionGeneration));
    sp.updateCells(packet([], [{ id: 90, x: 700, y: 700 }], []), 0);
    const n90 = LM.indexedCells[uid(90, 1)];
    check('whole-world reset: the same raw id again is a new pellet (the orphan is not revived or reused)', n90 && n90 !== p90 && !n90.removed && p90.removed && sp._lmFoodPool.indexOf(p90) < 0);
}

console.log(fail ? fail + ' check(s) failed' : 'all fullmapfood checks passed');
process.exit(fail ? 1 : 0);
