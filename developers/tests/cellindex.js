/* Cell list membership: every list a cell can be in (LM.cells, food, viruses, foodMulti,
 * playerCells, playerCellsMulti, removedCells) stores the cell's slot, and -1 means "not in
 * it", so removing a cell never scans a list. The real code runs in a vm: the cell class
 * (removeCell, moveCell, reset), sortCells, the frame's compaction, the virus range
 * switch and the removed-cell loop from ogario/ogario.v4.js, and the multibox unit packet
 * handler from ogario/spect.js. Array.prototype.indexOf/includes are counted, so the checks
 * are on the work done, not only on the result: body, food, virus, own and multibox removals,
 * bulk disappearance, and lists after a sort, compaction, unit packets and pool reuse.
 * (Ids listed once, with no pass over the world for duplicates.) A unit's own-cell index
 * (opcode 32 before or after the record, raw id reuse, eat, remove list, ClearAll, close) and
 * socket generations that never repeat for a new Spect with a reused number.
 * node developers/tests/cellindex.js
 * (LM_SRC=<ogario.v4.js> LM_SPECT=<spect.js> runs it on other copies and prints their counts) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const src = read(process.env.LM_SRC || path.join(root, 'ogario', 'ogario.v4.js'));
const spectSrc = read(process.env.LM_SPECT || path.join(root, 'ogario', 'spect.js'));
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* source between two markers */
function slice(from, to, plus) {
    const a = src.indexOf(from), b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error('not found in ogario.v4.js: ' + (a < 0 ? from : to));
    return src.slice(a, b + (plus ? to.length : 0));
}
/* from a marker to the brace that closes its first block (skips strings and comments) */
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

/* the frame's active-cell compaction: from its first statement to the jelly comment after it */
function compaction() {
    const t = slice('var _cW = 0;', '* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION');
    return t.slice(0, t.lastIndexOf('/*'));
}

const g = { console: { log() { }, warn() { }, error: console.error }, Date, Math, JSON, Buffer };
g.window = g;
vm.createContext(g);
vm.runInContext([
    slice('var LM_UNIT_ID_STEP = ', 'var _lmMbGridTime = -1;'),
    /* the per-connection index and the reconciled food list */
    slice('var _lmSrcObs = new Map();', 'var LM_MB_RING_MIN_SCREEN_PX'),
    'var _DEATH_SLOWMO_ANIM = 600;',
    'var defaultmapsettings = { virusesRange: true, animation: 120, shortMass: false, virMassShots: false };',
    'var defaultSettings = { foodColor: "#5000ff" };',
    'var application = { mbSlots: [], selectedOldProfile: 0 }, profiles = [];',
    'function lmMultiboxPositionTwin() { return null; }',
    /* the cell class with the list helpers before it */
    slice('    function quickSwapDelete(', '    }).call(ogarbasicassembly.prototype);\n', true),
    'window.legendmod1 = ogarbasicassembly;',
    'window.lmCellIdx = typeof lmIdxOf === "function" ? { push: indexedPush, of: lmIdxOf, remove: lmIdxRemove, filter: lmIdxFilter } : undefined;',
    'this.C = ogarbasicassembly; this.pool = ogarCellPool; this.getPooledCell = getPooledCell; this.indexedPush = indexedPush;',
    'var LM = { cells: [], food: [], viruses: [], foodMulti: [], playerCells: [], playerCellIDs: [], playerCellsMulti: [], removedCells: [], indexedCells: {}, fbOnline: [], time: 0,',
    slice('        sortCells() {', '        calculatePlayerMassAndPosition() {'),
    '};',
    'window.legendmod = LM; var legendmod = LM;',
    /* frame pieces of renderFrame, each run as in the frame */
    'this.compact = function () { var i, cell;', compaction(), '};',
    'this.virusRangeOn = function () {', block('if (!this._virusesRangeWasOn && LM.cells && LM.viruses) {'), '};',
    'this.removedLoop = function () {', block('for (var i = LM.removedCells.length - 1; i >= 0; i--) {'), '};',
    'this.stallSnap = function (_now) { var i;', block('if (LM.time && (_now - LM.time) > 1000) {'), '};',
    'this.LM = LM;'
].join('\n'), g);
vm.runInContext(spectSrc + '\nthis.Spect = Spect;', g);

/* count every indexOf/includes, and those on the indexed lists */
vm.runInContext(`var __scan = { calls: 0, lists: 0, elems: 0 };
(function () {
    var io = Array.prototype.indexOf, inc = Array.prototype.includes;
    function listed(a) { var L = LM; return a === L.cells || a === L.food || a === L.viruses || a === L.foodMulti || a === L.playerCells || a === L.playerCellsMulti || a === L.removedCells; }
    Array.prototype.indexOf = function () { __scan.calls++; if (listed(this)) { __scan.lists++; __scan.elems += this.length; } return io.apply(this, arguments); };
    Array.prototype.includes = function () { __scan.calls++; if (listed(this)) { __scan.lists++; __scan.elems += this.length; } return inc.apply(this, arguments); };
})();
this.scan = __scan;`, g);

const LM = g.LM, C = g.C, scan = g.scan;
const LISTS = [['cells', '_cellsIdx'], ['food', '_foodIdx'], ['viruses', '_virusIdx'], ['foodMulti', '_foodMultiIdx'], ['playerCells', '_playerIdx'], ['playerCellsMulti', '_playerMultiIdx'], ['removedCells', '_removedIdx']];
const counts = [];
/* list scans while fn runs */
function scans(name, fn) {
    const c0 = scan.calls, l0 = scan.lists, e0 = scan.elems;
    fn();
    const r = { name, lists: scan.lists - l0, elems: scan.elems - e0, calls: scan.calls - c0 };
    counts.push(r);
    return r;
}
/* every member sits at its stored slot */
function consistent() {
    for (const [k, p] of LISTS) {
        const a = LM[k];
        for (let i = 0; i < a.length; i++) if (a[i] && a[i][p] !== i) return k + '[' + i + ']';
    }
    return '';
}
let nextId = 1;
const rnd = (() => { let s = 7; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; })();
function body(opts) {
    const o = opts || {};
    const c = new C(o.id || nextId++, rnd() * 10000, rnd() * 10000, o.size || 30 + Math.floor(rnd() * 300), '#ff0000', !!o.food, !!o.virus, false, false, false);
    if (o.food) g.indexedPush(LM.food, c, '_foodIdx');
    else {
        if (o.virus) g.indexedPush(LM.viruses, c, '_virusIdx');
        g.indexedPush(LM.cells, c, '_cellsIdx');
    }
    if (o.own) { c.isPlayerCell = true; g.indexedPush(LM.playerCells, c, '_playerIdx'); LM.playerCellIDs.push(c.id); }
    LM.indexedCells[c.id] = c;
    return c;
}
/* empty lists made in the vm, so their indexOf is the counted one */
function reset() {
    for (const [k] of LISTS) LM[k] = vm.runInContext('[]', g);
    LM.indexedCells = {}; LM.playerCellIDs = vm.runInContext('[]', g); LM.removePlayerCell = false;
}

/* A sparse, reverse-ordered world must not disable the sorting budget.
 * Match the old stable insertion-sort order within each contiguous run,
 * keep holes intact until frame compaction, and verify native fallback runs. */
reset();
{
    const originalOrder = LM._lmCellOrder;
    let comparisons = 0;
    LM._lmCellOrder = function (a, b) { comparisons++; return originalOrder(a, b); };
    const a = LM.cells;
    a.length++;
    for (let run = 0; run < 3; run++) {
        for (let i = 2500; i > 0; i--) {
            const c = { size: Math.floor(i / 2), id: i % 2, _cellsIdx: a.length };
            a.push(c);
        }
        if (run === 0) a.push(null);
        else a.length++;
    }
    const expected = a.slice();
    for (let start = 0; start < expected.length;) {
        if (!expected[start]) { start++; continue; }
        let end = start + 1;
        while (end < expected.length && expected[end]) end++;
        const sorted = expected.slice(start, end).sort(originalOrder);
        for (let i = 0; i < sorted.length; i++) expected[start + i] = sorted[i];
        start = end;
    }
    LM.sortCells();
    LM._lmCellOrder = originalOrder;
    check('sparse reverse sort: bounded native fallback, stable runs and unchanged holes',
        comparisons > 0 && comparisons < 250000 &&
        a.length === expected.length &&
        Array.from({ length: a.length }, (_, i) => i).every(i =>
            (i in a) === (i in expected) && a[i] === expected[i] &&
            (!a[i] || a[i]._cellsIdx === i)));
}

/* The first frame after a stall (hidden tab) snaps every cell to its target; an empty slot
 * in LM.cells must not stop it (it threw there and the frame was lost, the cells after the
 * slot and the camera kept their old positions). */
reset();
{
    const a = LM.cells, c1 = body(), c2 = body();
    a.length++;
    const c3 = body();
    for (const c of [c1, c2, c3]) { c.targetX = c.x + 50; c.targetY = c.y - 50; c.targetSize = c.size + 5; }
    LM.time = 1000; LM.viewX = 123; LM.viewY = 456;
    let err = null;
    try { g.stallSnap(5000); } catch (e) { err = e; }
    check('stall snap with an empty slot in LM.cells: no error, every cell and the camera snapped',
        !err && [c1, c2, c3].every(c => c.x === c.targetX && c.y === c.targetY && c.size === c.targetSize && c.time === 5000) &&
        g.camX === 123 && g.camY === 456);
    LM.time = 0;
}

/* ---- a dense world: bodies, food, viruses, own cells, sorted by the real sortCells ---- */
reset();
const bodies = [], foods = [], viruses = [], own = [];
for (let i = 0; i < 1000; i++) bodies.push(body());
for (let i = 0; i < 10000; i++) foods.push(body({ food: true, size: 10 }));
for (let i = 0; i < 50; i++) viruses.push(body({ virus: true, size: 100 }));
for (let i = 0; i < 8; i++) own.push(body({ own: true }));
for (const c of LM.cells) c.size = 30 + Math.floor(rnd() * 300);
LM.sortCells();
check('dense world: the real sortCells keeps every stored slot right', consistent() === '');
/* a nearly sorted frame: only a few cells grow (the insertion sort moves just those) */
for (let i = 0; i < 20; i++) LM.cells[Math.floor(rnd() * LM.cells.length)].size += 5;
LM.sortCells();
check('sortCells on a nearly sorted list: slots still right', consistent() === '');
let r = scans('500 body removals', () => { for (let i = 0; i < 500; i++) bodies[i].removeCell(); });
check('500 body removals: no list scan (were LM.cells + both player lists + viruses)', r.lists === 0 && consistent() === '' && LM.cells.length === 1000 + 50 + 8 - 500);
r = scans('5000 food removals', () => { for (let i = 0; i < 5000; i++) foods[i].removeCell(); });
check('5000 food removals: no scan of LM.cells, foodMulti or the player lists', r.lists === 0 && LM.food.length === 5000 && consistent() === '');
r = scans('50 virus removals', () => { for (const v of viruses) v.removeCell(); });
check('50 virus removals (virus range on): no scan, virus list empty', r.lists === 0 && LM.viruses.length === 0 && !LM.cells.some(c => c.isVirus));
r = scans('4 own cell removals', () => { for (let i = 0; i < 4; i++) own[i].removeCell(); });
check('own cell removals: no list scan, playerCells and playerCellIDs follow', r.lists === 0 && LM.removePlayerCell === true && LM.playerCells.length === 4 && LM.playerCellIDs.length === 4 && consistent() === '');
check('removed cells are out of every list', ![...bodies.slice(0, 500), ...foods.slice(0, 5000), ...viruses, ...own.slice(0, 4)].some(c => LISTS.some(([k]) => LM[k].includes(c) && k !== 'removedCells')));

/* ---- frame compaction: cells flagged removed are dropped ---- */
const rest = bodies.slice(500);
for (let i = 0; i < 100; i++) rest[i].removed = true;
/* a unit cell (spectator 1) under a raw id the main connection also uses: another cell
 * (ids are per connection), kept and drawn (it was dropped from LM.cells by id) */
const masters = rest.slice(100, 120), copies = [];
for (const m of masters) {
    const cp = body({ id: g.lmUnitCellId(m.id, 1) });
    cp.spectator = 1;
    copies.push(cp);
}
r = scans('compaction', () => g.compact());
check('compaction drops flagged cells, keeps unit cells with a main raw id, slots right, no scan', r.lists === 0 && consistent() === '' && copies.every(c => c._cellsIdx >= 0 && LM.cells.includes(c) && !c.invisible) && !rest.slice(0, 100).some(c => LM.cells.includes(c)));
r = scans('300 removals after compaction', () => { for (let i = 100; i < 400; i++) rest[i].removeCell(); });
check('removals after compaction: no list scan', r.lists === 0 && consistent() === '');

/* ---- virus range switched on with viruses already known ---- */
reset();
const vr = [];
for (let i = 0; i < 1000; i++) body();
for (let i = 0; i < 60; i++) { const v = new C(nextId++, 0, 0, 100, '#0f0', false, true, false, false, false); g.indexedPush(LM.cells, v, '_cellsIdx'); vr.push(v); }
r = scans('virus range switched on', () => g.virusRangeOn.call({ _virusesRangeWasOn: false }));
check('virus range on: known viruses added without scanning the virus list', r.lists === 0 && LM.viruses.length === 60 && consistent() === '');
r = scans('60 virus removals', () => { for (const v of vr) v.removeCell(); });
check('those viruses then leave in O(1)', r.lists === 0 && LM.viruses.length === 0);

/* ---- multibox unit packets (spect.js updateCells): cells, food, viruses, own unit cells ---- */
reset();
for (let i = 0; i < 200; i++) body();
const sp = Object.create(g.Spect.prototype);
Object.assign(sp, { number: 1, player: true, integrity: true, active: true, foodCalibrated: true, nick: 'Unit', playerCellIDs: [], time: 0 });
/* its transform counts as verified (spect.js _lmFeedOk): its pellets feed the food list */
sp._lmFeedOk = function () { return true; };
const OWN_IDS = [], unitIds = [];
for (let i = 0; i < 16; i++) OWN_IDS.push(900000 + i);
/* the unit keeps its own cell ids in the stored (unit) form */
sp.playerCellIDs = OWN_IDS.map(id => g.lmUnitCellId(id, 1));
/* agar.io update body: eats, cells (id, x, y, size, flags[, ext]), 0, removes */
function packet(eats, cells, removes) {
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
const add = [];
for (const id of OWN_IDS) add.push({ id, x: 100, y: 100, size: 60 });
for (let i = 0; i < 300; i++) add.push({ id: 500000 + i, x: 200, y: 200, size: 40 + i % 200 });
for (let i = 0; i < 400; i++) add.push({ id: 600000 + i, x: 300, y: 300, size: 10, food: true });
for (let i = 0; i < 20; i++) add.push({ id: 700000 + i, x: 400, y: 400, size: 100, virus: true });
for (const c of add) unitIds.push(c.id);
r = scans('unit packet: 736 new cells', () => sp.updateCells(packet([], add, []), 0));
const ucell = (id) => LM.indexedCells[g.lmUnitCellId(id, 1)];
check('unit packet: cells, food, viruses and own unit cells all stored with their slots', consistent() === '' && LM.playerCellsMulti.length === 16 && LM.foodMulti.length === 400 && LM.viruses.length === 20 && ucell(500000)._cellsIdx >= 0);
check('unit packet: its pellets go to the food list, not LM.cells', ucell(600000)._cellsIdx === -1 && !!ucell(600000)._lmFoodEnt && !LM.cells.some(c => c.isFood));
check('unit packet: own-cell checks on new cells do not scan playerCellsMulti', r.lists === 0);
LM.sortCells();
/* a main cell with the same raw id does not touch the unit's cell */
const back = ucell(500001), mainCopy = body({ id: 500001 });
g.compact();
check('the frame keeps a unit cell whose raw id the main connection also uses', !back._renderSuppressed && back._cellsIdx >= 0 && LM.cells.includes(back) && consistent() === '');
mainCopy.removeCell();
r = scans('unit packet: update of a kept cell', () => sp.updateCells(packet([], [{ id: 500001, x: 210, y: 210, size: 41 }], []), 0));
check('an updated unit cell stays in LM.cells once, without a scan', r.lists === 0 && LM.cells.filter(c => c === back).length === 1 && consistent() === '');
/* the unit eats 8 of its foods, 4 own cells are eaten, the rest goes out of view */
const eats = [];
for (let i = 0; i < 8; i++) eats.push([OWN_IDS[15], 600000 + i]);
for (let i = 0; i < 4; i++) eats.push([500000, OWN_IDS[i]]);
const outOfView = unitIds.filter(id => !OWN_IDS.slice(0, 4).includes(id) && !(id >= 600000 && id < 600008));
r = scans('unit packet: 12 eats, ' + outOfView.length + ' removes', () => sp.updateCells(packet(eats, [], outOfView), 0));
check('unit eats and removes (multibox food, bodies, viruses, own unit cells): no list scan', r.lists === 0 && consistent() === '');
check('unit lists empty afterwards, main cells untouched', LM.playerCellsMulti.length === 0 && LM.foodMulti.length === 0 && LM.viruses.length === 0 && LM.cells.length === 200);

/* ---- pool reuse: a recycled cell starts outside every list ---- */
reset();
const pooled = [];
for (let i = 0; i < 200; i++) { const c = body({ virus: i % 2 === 0 }); pooled.push(c); }
for (const c of pooled) { c.removeCell(); g.pool.push(c); }
const reused = [];
for (let i = 0; i < 200; i++) { const c = g.getPooledCell(nextId++, 0, 0, 50, '#fff', false, false, false, false, false); g.indexedPush(LM.cells, c, '_cellsIdx'); reused.push(c); }
check('pool reuse: reset() marks the object absent from every list but the new one', reused.every(c => c._virusIdx === -1 && c._foodIdx === -1 && c._playerIdx === -1 && c._removedIdx === -1));
r = scans('200 removals of reused cells', () => { for (const c of reused) c.removeCell(); });
check('removals of reused cells: no list scan', r.lists === 0 && LM.cells.length === 0);

/* ---- bulk disappearance: removedCells and the fade ---- */
reset();
const gone = [];
for (let i = 0; i < 2000; i++) { const c = body(); c.redrawed = 1; gone.push(c); }
const hidden = gone.slice(0, 300), slow = gone.slice(300, 310);
for (const c of hidden) c.invisible = true;
for (const c of slow) c._deathSlowMo = true;
LM.time = 1000;
for (const c of gone) { c.time = c.updateTime = 1000; c.startX = c.x; c.startY = c.y; c.startSize = c.size; c.targetX = c.x + 50; c.targetY = c.y; c.targetSize = c.size; }
r = scans('2000 removals at once (100 twice)', () => { for (const c of gone) c.removeCell(); for (let i = 0; i < 100; i++) gone[i].removeCell(); });
check('bulk disappearance: each cell queued once, no scan', r.lists === 0 && LM.removedCells.length === 2000 && consistent() === '');
const frame = { drawLegendWorldDeformedCanvasCell() { }, ctx: {} };
LM.time = 1060;
r = scans('fade frame at half time', () => g.removedLoop.call(frame));
const vis = gone.slice(310);
check('half way: nobody dropped, the fade is at 0.5 (unchanged animation)', r.lists === 0 && LM.removedCells.length === 2000 && Math.abs(vis[0].alpha - 0.5) < 1e-9 && Math.abs(vis[0].x - (vis[0].startX + 25)) < 1e-9);
LM.time = 1130;
r = scans('fade frame after the fade time', () => g.removedLoop.call(frame));
check('after the fade: visible and hidden cells dropped without a scan, slow-motion deaths stay', r.lists === 0 && LM.removedCells.length === 10 && slow.every(c => LM.removedCells.includes(c)) && consistent() === '');
LM.time = 1700;
g.removedLoop.call(frame);
check('slow-motion deaths dropped after their 600 ms', LM.removedCells.length === 0);

/* ---- a unit's own cells (spect.js _lmAdoptOwn / _lmOwnDrop): its own index, playerCellIDs and
 * the aggregate playerCellsMulti, whichever of the opcode 32 and the record comes first ---- */
reset();
for (let i = 0; i < 50; i++) body();
{
    const mk = (n) => {
        const u = Object.create(g.Spect.prototype);
        Object.assign(u, { number: n, player: true, integrity: true, foodCalibrated: true, nick: 'U' + n, time: 0, connectionGeneration: 40 + n });
        u.resetConnectionState();
        u.sendCursor = function () { };
        u._lmFeedOk = function () { return true; };
        return u;
    };
    const u = mk(2), v = mk(3);
    let drops = 0;
    const realDrop = g.Spect.prototype._lmOwnDrop;
    u._lmOwnDrop = function (c) { const r = realDrop.call(this, c); if (r) drops++; return r; };
    const own32 = (sp, id) => { const d = new DataView(new ArrayBuffer(5)); d.setUint8(0, 32); d.setUint32(1, id, true); sp.handleMessage(d); };
    const rec = (id) => ({ id, x: 100 + id % 7, y: 100, size: 60 });
    const upd = (sp, eats, recs, removes) => sp.updateCells(packet(eats, recs, removes), 0);
    const uc = (id, n) => LM.indexedCells[g.lmUnitCellId(id, n || 2)];
    /* the unit's index, ids and the aggregate agree, every slot right */
    const ownOk = (sp) => {
        const o = sp.getOwnPlayerCells();
        return o.every((c, i) => c._lmOwnIdx === i && c._lmOwner === sp && !c.removed && c.isPlayerCell && LM.playerCellsMulti[c._playerMultiIdx] === c) &&
            sp.playerCellIDs.length === sp._lmOwnIds.size && sp.playerCellIDs.every((id) => sp._lmOwnIds.has(id)) && consistent() === '';
    };
    const ids = (sp) => sp.playerCellIDs.map((id) => id - sp.number * 4294967296).sort((a, b) => a - b).join(',');

    own32(u, 1001);
    const pending = u.getOwnPlayerCells().length === 0 && ids(u) === '1001' && u.active === null;
    upd(u, [], [rec(1001)], []);
    check('ownership before the record: pending until the record comes, then own (index, aggregate, life 1)',
        pending && u.getOwnPlayerCells().length === 1 && uc(1001)._lmOwner === u && u.active === true && u._lmLife === 1 && ownOk(u));
    upd(u, [], [rec(1002)], []);
    const notYet = !uc(1002).isPlayerCell && uc(1002)._lmOwnIdx === -1;
    own32(u, 1002);
    own32(u, 1002);
    check('record before ownership: the known cell is adopted by opcode 32, once (32 twice), same life',
        notYet && uc(1002)._lmOwner === u && u.getOwnPlayerCells().length === 2 && ids(u) === '1001,1002' && u._lmLife === 1 && ownOk(u));
    own32(v, 1001);
    upd(v, [], [rec(1001)], []);
    check('another unit with the same raw id: its own cell, apart from this unit\'s',
        uc(1001, 3)._lmOwner === v && uc(1001, 2)._lmOwner === u && LM.playerCellsMulti.length === 3 && ownOk(u) && ownOk(v));

    /* getOwnPlayerCells: the index itself (no new array, no pass over playerCellsMulti) */
    const same = u.getOwnPlayerCells() === u.getOwnPlayerCells();
    const agg = LM.playerCellsMulti;
    LM.playerCellsMulti = null;
    let noScan = false;
    try { noScan = u.getOwnPlayerCells().length === 2; } catch (e) { noScan = false; }
    LM.playerCellsMulti = agg;
    check('getOwnPlayerCells: the same list every call, read without playerCellsMulti (O(own cells))', same && noScan);

    for (const id of [1003, 1004, 1005, 1006]) own32(u, id);
    upd(u, [], [1003, 1004, 1005, 1006].map(rec), []);
    const old1003 = uc(1003), old1004 = uc(1004);
    drops = 0;
    upd(u, [], [], [1003]);
    check('remove list: the own cell leaves the index, aggregate and playerCellIDs once',
        drops === 1 && old1003._lmOwner === null && old1003._lmOwnIdx === -1 && old1003._playerMultiIdx === -1 &&
        u.getOwnPlayerCells().length === 5 && ids(u) === '1001,1002,1004,1005,1006' && ownOk(u));
    upd(u, [], [rec(1003)], []);
    check('raw id reused after its removal: a new cell, not own without a new opcode 32',
        uc(1003) !== old1003 && !uc(1003).isPlayerCell && uc(1003)._lmOwner === null && u.getOwnPlayerCells().length === 5 && ownOk(u));
    own32(u, 1003);
    check('...and own again (a new incarnation) once opcode 32 names it', uc(1003)._lmOwner === u && old1003._lmOwner === null && u.getOwnPlayerCells().length === 6 && ownOk(u));
    upd(u, [], [], [1004]);
    own32(u, 1004);
    check('pending ownership does not bring back a removed record', old1004.removed && old1004._lmOwner === null && !uc(1004) &&
        u.getOwnPlayerCells().indexOf(old1004) === -1 && u.getOwnPlayerCells().length === 5 && ownOk(u));
    upd(u, [], [rec(1004)], []);
    check('...the new record under that id is the own cell', uc(1004) !== old1004 && uc(1004)._lmOwner === u && u.getOwnPlayerCells().length === 6 && ownOk(u));
    drops = 0;
    u.removePlayerCell = false;
    const eaten = uc(1005);
    upd(u, [[1001, 1005]], [], []);
    check('eat: the own victim leaves once (removeCell after it finds it gone)', drops === 1 && eaten.removed && eaten._lmOwner === null &&
        u.removePlayerCell === true && u.getOwnPlayerCells().length === 5 && ids(u) === '1001,1002,1003,1004,1006' && ownOk(u));
    own32(u, 1010);
    upd(u, [], [], [1010]);
    upd(u, [], [rec(1010)], []);
    check('an own id removed before its record came: forgotten, the later record is no own cell',
        !uc(1010).isPlayerCell && ids(u) === '1001,1002,1003,1004,1006' && ownOk(u));

    /* ClearAll (opcode 18 of a playing unit): all its own cells and ids go, the other unit's stay */
    const before = u.getOwnPlayerCells().slice(), aggN = LM.playerCellsMulti.length;
    const op18 = new DataView(new ArrayBuffer(1)); op18.setUint8(0, 18);
    u.handleMessage(op18);
    check('ClearAll: the unit\'s own index, ids and aggregate entries go once, the other unit\'s cell stays',
        u.getOwnPlayerCells().length === 0 && u.playerCellIDs.length === 0 && u._lmOwnIds.size === 0 &&
        LM.playerCellsMulti.length === aggN - before.length && before.every((c) => c._lmOwner === null && c._lmOwnIdx === -1 && c._playerMultiIdx === -1) &&
        uc(1001, 3)._lmOwner === v && ownOk(v) && consistent() === '');

    /* a closed socket: the same, and the life counter stays (a new life only at a spawn) */
    u.active = null;
    for (const id of [2001, 2002]) own32(u, id);
    upd(u, [], [rec(2001), rec(2002)], []);
    const lives = u._lmLife, kept = u.getOwnPlayerCells().slice(), gen0 = u.connectionGeneration;
    u.closeConnection();
    check('close: own cells out of the index and the aggregate once, a new generation, the life count kept',
        lives === 2 && u.getOwnPlayerCells().length === 0 && u.playerCellIDs.length === 0 && kept.every((c) => c._lmOwner === null && c.removed) &&
        LM.playerCellsMulti.length === 1 && u.connectionGeneration > gen0 && u._lmLife === 2 && ownOk(v));

    /* the main player's own cell removed twice leaves playerCells and playerCellIDs once */
    const m1 = body({ own: true }), m2 = body({ own: true });
    m1.removeCell(); m1.removeCell();
    check('main player: an own cell removed twice leaves playerCells and playerCellIDs once',
        LM.playerCells.length === 1 && LM.playerCells[0] === m2 && LM.playerCellIDs.length === 1 && LM.playerCellIDs[0] === m2.id && consistent() === '');
}

/* ---- socket generations: one counter for every Spect, so a new object that reuses a number
 * never gets an older (number, generation); the old object's leftover cells are not its own ---- */
reset();
{
    g.createLegendWebSocket = function () { return { readyState: 0, close() { } }; };
    const gens = [];
    const a = new g.Spect({ player: true });
    gens.push(a.number + ':' + a.connectionGeneration);
    a.connect();
    gens.push(a.number + ':' + a.connectionGeneration);
    a.updateCells(packet([], [{ id: 77, x: 5, y: 5, size: 50 }], []), 0);
    const left = LM.indexedCells[g.lmUnitCellId(77, a.number)];
    /* a dropped without its flush (the number is free again): b is made with the same number */
    const b = new g.Spect({ player: true });
    gens.push(b.number + ':' + b.connectionGeneration);
    b.closeConnection();
    gens.push(b.number + ':' + b.connectionGeneration);
    check('a new Spect with the same number: its generations repeat none of the old object\'s',
        a.number === b.number && new Set(gens).size === gens.length && b.connectionGeneration > a.connectionGeneration, gens.join(' '));
    check('...and the old object\'s cell under the same key is dropped, not taken as the new one\'s', !!left && left.removed && !LM.indexedCells[g.lmUnitCellId(77, b.number)]);
    delete g.createLegendWebSocket;
}

console.log('\nindexOf/includes calls on the indexed lists per step, and the list lengths they covered:');
for (const c of counts) console.log('  ' + String(c.lists).padStart(6) + String(c.elems).padStart(10) + '  ' + c.name);
if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
console.log('all checks passed');
