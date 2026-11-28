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
 * connection number used again starts without the old connection's food state or shared colours. Prints the food
 * observations against the pellets drawn and the cost of the list.
 * node developers/tests/fullmapfood.js */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const src = read(path.join(root, 'ogario', 'ogario.v4.js'));
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
    slice('var _lmSrcObs = new Map();', 'var LM_MB_RING_MIN_SCREEN_PX'),
    /* the shared colours per connection (forgotten when one closes) */
    slice('var _lmMbLooks = new Map();', '/* Nearest copy to `cell` in idx'),
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
/* agar.io update body: eats, cells (id, x, y, size, flags[, ext], colour), 0, removes */
function packet(eats, cells, removes) {
    const b = Buffer.alloc(8 + eats.length * 8 + cells.reduce((n, c) => n + 20 + (c.name ? c.name.length + 1 : 0), 0) + 4 + removes.length * 4);
    let o = 0;
    b.writeUInt16LE(eats.length, o); o += 2;
    for (const [a, v] of eats) { b.writeUInt32LE(a, o); b.writeUInt32LE(v, o + 4); o += 8; }
    for (const c of cells) {
        b.writeUInt32LE(c.id, o); b.writeInt32LE(c.x, o + 4); b.writeInt32LE(c.y, o + 8); b.writeUInt16LE(c.size || 11, o + 12); o += 14;
        const col = c.color === undefined ? 0x40a0f0 : c.color;
        b.writeUInt8(128 | 2 | (c.virus ? 1 : 0) | (c.name ? 8 : 0), o++); b.writeUInt8(c.food === false ? 0 : 1, o++);
        b.writeUInt8((col >> 16) & 255, o++); b.writeUInt8((col >> 8) & 255, o++); b.writeUInt8(col & 255, o++);
        if (c.name) { o += b.write(c.name, o, 'latin1'); b.writeUInt8(0, o++); }
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

console.log(fail ? fail + ' check(s) failed' : 'all fullmapfood checks passed');
process.exit(fail ? 1 : 0);
