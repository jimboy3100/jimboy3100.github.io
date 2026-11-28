// Full Map / multibox entity lifecycle and ghost cells, with the real code cut from ogario.v4.js:
// the twin search and the frame's hide step (lmMultiboxPositionTwin and the frame compaction),
// removeCell() and drawGhostCells().
// Removal, on 19 frames of a live agar.io Full Map capture (developers/tests/lib/fullmap-twin-live.json,
// 59 cells seen by 2-8 connections): an eaten cell plays one eat animation and is not drawn again by
// another connection's lagging copy (eats of one cell reach the connections up to 16 ms and more
// apart); a copy that leaves its view while another connection still sees the cell plays no fade
// on top of the live copy; a copy that sat behind a main cell dropped without removeCell() is drawn
// again (a ClearAll flush keeping the other connections' cells is tested in fullmapfood.js).
// Ghost cells (opcode 69): hidden only by cells that can be the player's (his server name, or his
// own cells, with about his mass on one connection; not another player's of the same nick or none,
// not an unverified or stalled spectator's) or, without them, inside verified fresh coverage (the
// main view only while the main socket's world updates are fresh, a spectator's only while the
// reconciliation takes its cells); culled by the frame's view box, also with the camera on a
// distant unit.
// Playing with Full Map on, with the real flushCellsData / flushSpecsData: a ClearAll on the same
// socket (18 / 20: flushCellsData(false)) and the respawn flush (true) keep every tile open and its
// observations (cells, viruses, the objects themselves), the main player's cells go; the
// connection's own flush (server change, lost socket: no argument) closes every tile with its cells.
// Usage: node developers/tests/fullmaplifecycle.js [ogario.v4.js]
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../../ogario/ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (info === undefined ? '' : '  [' + info + ']'));
    if (!ok) failed++;
}
function cut(from, to, what) {
    const a = src.indexOf(from), b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error(what + ' not found in ogario.v4.js');
    return src.slice(a, b);
}
const hist = (a) => { const h = {}; for (const v of a) h[v] = (h[v] || 0) + 1; return JSON.stringify(h); };

/* ---------- the real code ---------- */
const twinCode = (() => {
    const start = src.indexOf('var LM_UNIT_ID_STEP'), endMark = src.indexOf('function lmMultiboxPositionTwin(');
    const end = src.indexOf('\n}\n', endMark);
    if (start < 0 || endMark < 0 || end < 0) throw new Error('multibox twin functions not found in ogario.v4.js');
    return src.slice(start, end + 3);
})();
const compact = (() => { const s = cut('var _cW = 0;', '* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION', 'frame compaction'); return s.slice(0, s.lastIndexOf('/*')); })();
const helpers = cut('    function quickSwapDelete(', '    var ogarCellPool = [];', 'indexed list helpers');
const rmBody = (() => { const s = cut('this.removeCell = function (', '        this.moveCell = function', 'removeCell'); return s.slice('this.removeCell = '.length).trim().replace(/;$/, ''); })();
const ghostBody = cut('        drawGhostCells() {', '        preDrawPellet() {', 'drawGhostCells').trim().replace(/,$/, '');

const g = { window: { legendmod: null, spects: [] }, Number, Math, Map, Set, Float64Array, Int32Array, Array, Object, Date, console, _lmDlThr: false };
vm.createContext(g);
vm.runInContext('var LM = { cells: [], indexedCells: {}, time: 0, removedCells: [], viruses: [], food: [], foodMulti: [], playerCells: [], playerCellsMulti: [], playerCellIDs: [], leaderboard: [] };\n' +
    'window.legendmod = LM;\nfunction lmFoodRemove() {}\n' +
    'var defaultmapsettings = { showGhostCells: true }, defaultSettings = {};\n' +
    twinCode + '\nfunction _frame() { var i, cell;\nlmMbFrameHide();\n' + compact + '\n}\n' + helpers + '\nvar _removeCell = ' + rmBody + ';\n' +
    'var _ghostR = {' + ghostBody + '};', g);
const LM = g.window.legendmod;
for (let k = 1; k <= 15; k++) g.window.spects.push({ number: k, staticX: 0 });

/* ---------- removal on the live capture ---------- */
const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib/fullmap-twin-live.json'), 'utf8'));
const NF = fix.fields, S = fix.strs, T0 = 100000;
function frame(now) { LM.time = now; g._frame(); for (const c of LM.cells) if (!c.removed && c.invisible !== true) c.redrawed++; }
function load() {
    LM.cells.length = 0; LM.removedCells.length = 0; LM.indexedCells = {};
    const obs = new Map();
    let now = T0;
    for (const [ft, rows] of fix.frames) {
        now = T0 + ft;
        const seen = new Set();
        for (let o = 0; o < rows.length; o += NF) {
            const conn = rows[o], key = rows[o + 1], fl = rows[o + 7];
            let c = obs.get(key);
            if (!c || c.removed) {
                const raw = S[rows[o + 5]];
                c = { id: key, spectator: conn, color: raw, _lmRawColor: raw, isFood: false, removed: false, invisible: false, redrawed: 0,
                    isVirus: !!(fl & 4), isEjected: !!(fl & 8), isPlayerCell: !!(fl & 16), isPlayerCellMulti: !!(fl & 32), _cellsIdx: LM.cells.length };
                c.removeCell = g._removeCell;
                obs.set(key, c); LM.cells.push(c); LM.indexedCells[key] = c;
            }
            const nick = rows[o + 6] >= 0 ? S[rows[o + 6]] : null;
            if (nick) c._lmSrvName = nick;
            c.x = c.targetX = rows[o + 2]; c.y = c.targetY = rows[o + 3];
            c.size = c.targetSize = rows[o + 4]; c.updateTime = T0 + rows[o + 8];
            c._lmVX = rows[o + 9] / 1000; c._lmVY = rows[o + 10] / 1000;
            seen.add(c);
        }
        for (const c of obs.values()) if (!c.removed && !seen.has(c)) c.removeCell();
        LM.removedCells.length = 0;
        frame(now);
    }
    return now;
}
/* a drawn copy and the copies hidden behind it (a hidden copy can sit behind one hidden later) */
function groups() {
    const root = (c) => { let n = 0; while (c.invisible === true && c._lmMbTwin && n++ < 20) c = c._lmMbTwin; return c; };
    const m = new Map();
    for (const c of LM.cells) if (!c.removed && c.invisible === true && c._lmMbTwin) {
        const d = root(c);
        if (!m.has(d)) m.set(d, [d]);
        m.get(d).push(c);
    }
    return [...m.values()];
}
const anims = (grp) => LM.removedCells.filter((r) => grp.includes(r) && r.invisible !== true).length;
const live = (grp) => grp.filter((c) => !c.removed && c.invisible !== true).length;

let now = load(), G = groups();
check('capture: cells seen by several connections', G.length >= 50, G.length + ' cells');
const animA = [];
for (const grp of G) { for (const c of grp) c.removeCell(true); animA.push(anims(grp)); }
check('eaten, every connection\'s eat in one task: one eat animation per cell', animA.every((n) => n === 1), hist(animA));

now = load(); G = groups();
const animB = [], liveB = [];
for (const grp of G) {
    let t = now, shown = 0;
    for (let k = 0; k < grp.length; k++) {
        grp[k].removeCell(true);
        if (k < grp.length - 1) { t += 16; frame(t); if (live(grp) > 0) shown++; }
    }
    animB.push(anims(grp)); liveB.push(shown);
}
check('eaten, a frame between the connections\' eats: one eat animation per cell', animB.every((n) => n === 1), hist(animB));
check('eaten: not drawn again by a lagging copy of another connection', liveB.every((n) => n === 0), 'frames drawn live after the eat ' + hist(liveB));

now = load(); G = groups();
const animE = [];
for (const grp of G) {
    let t = now;
    const order = grp.slice(1).concat([grp[0]]);
    for (let k = 0; k < order.length; k++) { order[k].removeCell(true); if (k < order.length - 1) { t += 16; frame(t); } }
    animE.push(anims(grp));
}
check('eaten, the drawn copy\'s eat last: one eat animation per cell', animE.every((n) => n === 1), hist(animE));

now = load(); G = groups();
let fadeC = 0, liveC = 0;
for (const grp of G) { grp[0].removeCell(); fadeC += anims(grp) ? 1 : 0; liveC += live(grp) > 0 ? 1 : 0; }
check('drawn copy leaves its view, others still see the cell: no fade on the live cell', fadeC === 0, fadeC + ' of ' + G.length + ' faded');
check('drawn copy leaves its view: another copy draws the cell in the same frame', liveC === G.length, liveC + ' of ' + G.length);
frame(now + 16);
const oneC = G.filter((grp) => live(grp) === 1).length;
check('drawn copy leaves its view: next frame exactly one live copy', oneC === G.length, oneC + ' of ' + G.length);

now = load(); G = groups();
const animD = [], gapsD = [];
for (const grp of G) {
    let t = now, gaps = 0;
    for (let k = 0; k < grp.length; k++) { grp[k].removeCell(); if (k < grp.length - 1) { t += 16; frame(t); if (live(grp) !== 1) gaps++; } }
    animD.push(anims(grp)); gapsD.push(gaps);
}
check('every copy leaves its view in turn: drawn once until the last goes', gapsD.every((n) => n === 0), hist(gapsD));
check('every copy leaves its view in turn: one removal fade per cell', animD.every((n) => n === 1), hist(animD));

/* eaten on one connection only (the others never get the eat): hidden during the eat animation,
 * shown again after it (nothing lost) */
now = load(); G = groups();
for (const grp of G) grp[0].removeCell(true);
frame(now + 16);
const hiddenF = G.filter((grp) => live(grp) === 0).length;
LM.removedCells.length = 0;
for (const grp of G) grp[0]._removedIdx = -1;
frame(now + 200);
const backF = G.filter((grp) => live(grp) === 1).length;
check('eaten on one connection only: other copies hidden during its eat animation', hiddenF >= G.length - 3, hiddenF + ' of ' + G.length);
check('eaten on one connection only: shown again after the animation', backF >= G.length - 1, backF + ' of ' + G.length);

/* a main cell dropped from LM.cells without removeCell() (spawn gate, dead main player with a unit) */
{
    LM.cells.length = 0; LM.removedCells.length = 0;
    const mk = (id, sp, x, y, size, virus, name) => {
        const c = { id, spectator: sp, x, y, targetX: x, targetY: y, size, targetSize: size, color: '#33ff33', _lmRawColor: '#33ff33', isFood: false, removed: false,
            invisible: false, redrawed: 0, isVirus: virus, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false, updateTime: now, _lmVX: 0, _lmVY: 0,
            _cellsIdx: LM.cells.length, _lmSrvName: name };
        c.removeCell = g._removeCell; LM.cells.push(c); return c;
    };
    const M = mk(1, 0, 1000, 1000, 100, true, null), Sv = mk(2 + 3 * 4294967296, 3, 1001, 1000, 100, true, null);
    const P = mk(3, 0, 3000, 3000, 200, false, 'x'), Q = mk(4 + 5 * 4294967296, 5, 3002, 3001, 200, false, 'x');
    frame(now + 16);
    const before = [M, Sv, P, Q].map((c) => c.invisible ? 'H' : 'D').join('');
    LM.cells = g.lmIdxFilter(LM.cells, '_cellsIdx', (c) => c && c.spectator > 0);
    g.window.legendmod = LM;
    const after = [];
    for (const dt of [32, 1000, 10000]) { frame(now + dt); after.push([Sv, Q].every((c) => c.invisible !== true)); }
    check('copies behind main cells dropped without removeCell(): drawn again', before === 'DHDH' && after.every(Boolean), before + ' then ' + after.join('/'));
}

/* one cell seen by connections 1 (drawn), 2 and 3 (hidden behind it): the copies leave in some
 * order in one tick; the drawn one gives way without a fade while a live copy is left, whichever
 * copy was hidden last */
{
    const mk3 = () => {
        LM.cells.length = 0; LM.removedCells.length = 0;
        const mk = (sp, x) => {
            const c = { id: sp * 4294967296 + 1, spectator: sp, x, y: 0, targetX: x, targetY: 0, size: 60, targetSize: 60, color: '#33ff33', _lmRawColor: '#33ff33',
                isFood: false, removed: false, invisible: false, redrawed: 0, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false,
                updateTime: now, _lmVX: 0, _lmVY: 0, _cellsIdx: LM.cells.length, _lmSrvName: 'P' };
            c.removeCell = g._removeCell; LM.cells.push(c); return c;
        };
        const R = mk(1, 0), A = mk(2, 1), B = mk(3, 2);
        frame(now + 16); frame(now + 32);
        return { R, A, B };
    };
    for (const [first, second, eaten] of [['B', 'R'], ['A', 'R'], ['R', null]]) {
        const m = mk3(), all = [m.R, m.A, m.B];
        const st = all.map((c) => c.invisible ? 'H' : 'D').join('');
        m[first].removeCell(); if (second) m[second].removeCell();
        const fades = anims(all);
        frame(now + 48);
        const liveN = live(all);
        check('one cell on 3 connections, ' + first + (second ? ' then ' + second : '') + ' leave(s): no fade, one live copy drawn', st === 'DHH' && fades === 0 && liveN === 1, st + ' fades=' + fades + ' live=' + liveN);
    }
    {
        const m = mk3(), all = [m.R, m.A, m.B];
        m.A.removeCell(); m.B.removeCell(); m.R.removeCell();
        check('one cell on 3 connections, every copy leaves: one fade', anims(all) === 1, anims(all));
    }
    {
        const m = mk3(), all = [m.R, m.A, m.B];
        m.A.removeCell(); m.R.removeCell(true);
        check('one cell on 3 connections, the drawn copy eaten: its eat animation plays, the live copy stays hidden behind it', anims(all) === 1 && live(all) === 0, anims(all) + '/' + live(all));
    }
}

/* the opponent colours, rings and split ranges (compareCells) and the virus ranges come after the
 * frame's hide step: a copy hidden behind its twin and an unverified spectator's cell get none
 * (every packet sets invisible = false again, so before the hide step every copy was counted) */
{
    const cmpBody = cut('        compareCells() {', '        setCellOppColor(isPlayer, mass) {', 'compareCells').trim().replace(/,$/, '');
    vm.runInContext('var _cmp = {' + cmpBody + '};', g);
    Object.assign(g.defaultmapsettings, { oppColors: true, oppRings: true, splitRange: true, dominationRate: 1.33, dominatedRate: 0.75 });
    g.getActiveSpect = () => null;
    const rf = cut('        renderFrame() {', 'var _cW = 0;', 'renderFrame');
    const iSort = rf.indexOf('LM.sortCells();'), iHide = rf.indexOf('lmMbFrameHide();'), iCmp = rf.indexOf('LM.compareCells();');
    const iVr = rf.indexOf('this.drawVirusesRange('), iHelp = rf.indexOf('this.drawHelpers();');
    check('render frame: the hide step runs after sortCells, before compareCells, the virus ranges and drawHelpers',
        iSort > 0 && iHide > iSort && iCmp > iHide && iVr > iHide && iHelp > iHide, [iSort, iHide, iCmp, iVr, iHelp].join(','));
    now = load();
    g.window.spects[14]._lmFeedOk = () => false; /* connection 15: not verified */
    /* the next packets: every copy shown again, then the frame */
    for (const c of LM.cells) if (c) c.invisible = false;
    LM.time = now + 16;
    g.lmMbFrameHide();
    Object.assign(LM, { play: true, playerCells: [{}], playerMinMass: 200, playerMaxMass: 200, camMinX: -1e9, camMinY: -1e9, camMaxX: 1e9, camMaxY: 1e9, srvViewMinX: NaN });
    g._cmp.compareCells.call(LM);
    const caches = ['biggerSTEDCellsCache', 'biggerSTECellsCache', 'biggerCellsCache', 'SSCellsCache', 'smallerCellsCache', 'STECellsCache', 'STEDCellsCache'];
    const ringN = caches.reduce((a, k) => a + LM[k].length, 0);
    const big = (c) => c && !c.removed && !c.isVirus && !c.isPlayerCell && ~~(c.size * c.size * 0.01) > 14;
    const drawnN = LM.cells.filter((c) => big(c) && !c.invisible).length, allN = LM.cells.filter(big).length;
    const unver = LM.cells.filter((c) => big(c) && c.spectator === 15 && !c.isPlayerCellMulti);
    check('opponent rings: one entry per drawn cell, none for hidden copies or an unverified spectator\'s cells',
        ringN === drawnN && allN > drawnN + 50 && unver.length > 0 && unver.every((c) => c.invisible), ringN + ' entries, ' + drawnN + ' drawn, ' + allN + ' copies, ' + unver.length + ' unverified');
    delete g.window.spects[14]._lmFeedOk;
}

/* the last connection closes: the search index lets go of the last frame's cells */
{
    now = load();
    const all = vm.runInContext('_lmMbAll', g);
    const held = all.cells.filter(Boolean).length;
    const sp = g.window.spects;
    g.window.spects = [];
    frame(now + 16);
    const left = all.cells.filter(Boolean).length;
    g.window.spects = sp;
    check('no connection left: the search index holds no cell', held > 100 && left === 0 && all.n === 0, held + ' then ' + left);
}
/* the main copy hidden behind a unit's own cell; the unit's socket closes in the same tick (its
 * cells dropped, no spectator left): the main copy is drawn again at the next frame */
{
    LM.cells.length = 0; LM.removedCells.length = 0;
    const mk = (sp, x, own) => {
        const c = { id: sp * 4294967296 + 7, spectator: sp, x, y: 0, targetX: x, targetY: 0, size: 80, targetSize: 80, color: '#33ff33', _lmRawColor: '#33ff33',
            isFood: false, removed: false, invisible: false, redrawed: 0, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: own,
            updateTime: now, _lmVX: 0, _lmVY: 0, _cellsIdx: LM.cells.length, _lmSrvName: 'P' };
        c.removeCell = g._removeCell; LM.cells.push(c); return c;
    };
    const M = mk(0, 0, false), U = mk(2, 2, true);
    g._lmMbFeed[2] = true;
    frame(now + 16); frame(now + 32);
    const before = (M.invisible ? 'H' : 'D') + (U.invisible ? 'H' : 'D');
    const sp = g.window.spects;
    LM.cells = g.lmIdxFilter(LM.cells, '_cellsIdx', (c) => c && !(c.spectator > 0));
    g.window.spects = [];
    frame(now + 48);
    const after = M.invisible ? 'H' : 'D';
    frame(now + 64);
    g.window.spects = sp;
    check('last connection closes with a copy hidden behind its cell: the copy is drawn again', before === 'HD' && after === 'D' && !M.invisible && !M._lmMbTwin, before + ' then ' + after);
}

/* eats of one cell up to 120 ms apart (live capture: 99 % of packet ages within 119 ms), the eat
 * animation 80 ms: the other connections' copies stay hidden until their own eat comes (not drawn
 * again in between, no second eat animation) */
now = load(); G = groups();
{
    const liveL = [], animL = [];
    for (const grp of G) {
        grp[0].removeCell(true);
        let shown = 0;
        for (let t = 16; t <= 112; t += 16) {
            /* its eat animation is over (the removed-cell loop drops it) */
            if (t === 96 && LM.removedCells[grp[0]._removedIdx] === grp[0]) g.lmIdxRemove(LM.removedCells, grp[0], '_removedIdx');
            frame(now + t);
            if (live(grp) > 0) shown++;
        }
        for (const c of grp.slice(1)) c.removeCell(true);
        liveL.push(shown); animL.push(anims(grp));
    }
    check('eaten, the other connections\' eats 120 ms later (after the eat animation): not drawn again in between, no second eat animation',
        liveL.every((n) => n === 0) && animL.every((n) => n === 0), 'frames drawn ' + hist(liveL) + ', eat animations ' + hist(animL));
}
/* the drawn copy goes first and the copy it showed goes in the same task (two connections' packets
 * between two frames): no fade while a third copy still sees the cell; all three go: one fade */
{
    const mk = (sp, x) => {
        const c = { id: sp * 4294967296 + 9, spectator: sp, x, y: 0, targetX: x, targetY: 0, size: 60, targetSize: 60, color: '#33ff33', _lmRawColor: '#33ff33',
            isFood: false, removed: false, invisible: false, redrawed: 0, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false,
            updateTime: now, _lmVX: 0, _lmVY: 0, _cellsIdx: LM.cells.length, _lmSrvName: 'P' };
        c.removeCell = g._removeCell; LM.cells.push(c); return c;
    };
    const three = (drawnBefore) => {
        LM.cells.length = 0; LM.removedCells.length = 0;
        const all = [mk(1, 0), mk(2, 1), mk(3, 2)];
        frame(now + 16); frame(now + 32);
        /* the hidden copies were drawn on some earlier frame (a split or first-packet double draw) */
        if (drawnBefore) all[1].redrawed = all[2].redrawed = 3;
        return all;
    };
    let all = three(true);
    const st = all.map((c) => c.invisible ? 'H' : 'D').join('');
    all[0].removeCell(); all[2].removeCell();
    const fades = anims(all);
    frame(now + 48);
    check('drawn copy, then the copy it showed leave in one task: no fade, the third copy drawn', st === 'DHH' && fades === 0 && live(all) === 1 && !all[1].invisible, st + ' fades=' + fades + ' live=' + live(all));
    all = three(false);
    all[0].removeCell(); all[2].removeCell(); all[1].removeCell();
    check('every copy leaves in one task, the drawn copy first: one fade', anims(all) === 1, anims(all));
}
/* a connection whose world updates stopped while its socket stays open (stalled): its copies are
 * not drawn and hide no copy of another connection (they would stay frozen, or draw an eaten cell
 * for good) */
{
    now = load();
    const sp = g.window.spects[0];
    sp._lmWorldStamp = () => Date.now() - 5000;
    frame(now + 16);
    const c1 = LM.cells.filter((c) => c && !c.removed && c.spectator === 1 && !c.isPlayerCellMulti);
    const behind = LM.cells.filter((c) => c && !c.removed && c.invisible === true && c._lmMbTwin && c._lmMbTwin.spectator === 1).length;
    delete sp._lmWorldStamp;
    check('stalled connection (no world update for 5 s): its cells not drawn, no copy hidden behind them', c1.length > 0 && c1.every((c) => c.invisible === true) && behind === 0,
        c1.filter((c) => c.invisible !== true).length + ' of ' + c1.length + ' drawn, ' + behind + ' hidden behind them');
    /* a tile 500 ms behind the main socket's world updates while those are fresh (lmSrcStale):
     * stalled too; a page that was busy (every socket late, the main one too) drops nothing */
    now = load();
    sp._lmWorldStamp = () => Date.now() - 500;
    LM._lmLastWorldUpdate = Date.now();
    frame(now + 16);
    const r1 = LM.cells.filter((c) => c && !c.removed && c.spectator === 1 && !c.isPlayerCellMulti);
    const relStalled = r1.length > 0 && r1.every((c) => c.invisible === true && !c._lmMbTwin) && g._lmMbFeed[1] === false;
    LM._lmLastWorldUpdate = Date.now() - 450;
    frame(now + 32);
    /* feeds again: each of its cells drawn or hidden behind its twin */
    const busyDrawn = g._lmMbFeed[1] === true && r1.every((c) => c.invisible !== true || !!c._lmMbTwin);
    delete sp._lmWorldStamp;
    LM._lmLastWorldUpdate = 0;
    check('tile 500 ms behind the fresh main socket: its cells not drawn (was drawn, frozen, as a second cell)', relStalled, r1.filter((c) => c.invisible !== true).length + ' of ' + r1.length + ' drawn');
    check('every socket late (busy page, main 450 ms old too): the tile\'s cells still drawn', busyDrawn);
}
/* a copy hidden behind its twin gets a packet (spect.js sets invisible = false on a unit's cells)
 * and leaves its view before the next frame: no removal fade over the live copy (it was drawn
 * fading on top of it) */
{
    const mk = (sp, x, o) => {
        const c = Object.assign({ id: sp * 4294967296 + 21, spectator: sp, x, y: 0, targetX: x, targetY: 0, size: 60, targetSize: 60, color: '#3333ff', _lmRawColor: '#3333ff',
            isFood: false, removed: false, invisible: false, redrawed: 0, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false,
            updateTime: now, _lmVX: 0, _lmVY: 0, _cellsIdx: LM.cells.length, _lmSrvName: 'Q' }, o);
        c.removeCell = g._removeCell; LM.cells.push(c); return c;
    };
    LM.cells.length = 0; LM.removedCells.length = 0;
    const a = mk(1, 0), b = mk(2, 2);
    b.redrawed = 3; /* drawn on an earlier frame */
    frame(now + 16); frame(now + 32);
    const hid = b.invisible === true && b._lmMbTwin === a;
    b.invisible = false; /* its packet */
    b.removeCell();
    check('hidden copy, a packet, then it leaves before the next frame: no removal fade', hid && !LM.removedCells.includes(b) && b.invisible === true && !a.invisible,
        'hidden ' + hid + ', in the removed list ' + LM.removedCells.includes(b));
    /* a seam: connection 1 drops the cell and connection 2 gets it between two frames (nothing hid
     * behind the copy that left): its fade is not drawn over connection 2's copy */
    LM.cells.length = 0; LM.removedCells.length = 0;
    const c = mk(1, 500);
    c.id += 1;
    frame(now + 48); frame(now + 64);
    c.removeCell();
    const d = mk(2, 503, { id: 2 * 4294967296 + 23, _lmVX: undefined, _lmVY: undefined });
    const pushed = LM.removedCells.includes(c);
    frame(now + 80);
    check('seam: a copy leaves while another connection gets the cell between two frames: no fade over it', pushed && c.invisible === true && !d.invisible,
        'in the removed list ' + pushed + ', fade drawn ' + (c.invisible !== true));
    /* the same, the other connection's copy one frame later */
    LM.cells.length = 0; LM.removedCells.length = 0;
    const e = mk(1, 900);
    e.id += 2;
    frame(now + 96); frame(now + 112);
    e.removeCell();
    frame(now + 128);
    const fadeFirst = e.invisible !== true;
    const f = mk(2, 902, { id: 2 * 4294967296 + 25 });
    frame(now + 144);
    check('seam, the other copy a frame later: its fade drawn while no copy is there, not over the copy', fadeFirst && e.invisible === true && !f.invisible, fadeFirst + ' / ' + e.invisible);
    /* no other copy: the fade plays */
    LM.cells.length = 0; LM.removedCells.length = 0;
    const h = mk(1, 1300);
    h.id += 3;
    frame(now + 160); frame(now + 176);
    h.removeCell();
    frame(now + 192);
    check('a copy that leaves with no other copy of the cell: its fade plays', LM.removedCells.includes(h) && h.invisible !== true);
    /* opcode 18: the connection's world is cleared and the server sends every cell again under a
     * new id a tick later: the old copy fades while the cell is not there, not over the new copy */
    LM.cells.length = 0; LM.removedCells.length = 0;
    const k = mk(1, 1700);
    k.id += 4;
    frame(now + 208); frame(now + 224);
    k.removeCell();
    frame(now + 240);
    const fadeK = k.invisible !== true;
    const k2 = mk(1, 1702, { id: 4294967296 + 40, time: now + 250, _lmVX: undefined, _lmVY: undefined });
    frame(now + 256);
    check('opcode 18, the same connection sends the cell again under a new id: the fade of the old copy not drawn over it', fadeK && k.invisible === true && !k2.invisible,
        fadeK + ' / ' + k.invisible + ' / ' + k2.invisible);
    /* a cell of that connection that was there before the copy left is another cell: the fade plays */
    LM.cells.length = 0; LM.removedCells.length = 0;
    const q1 = mk(1, 2100, { id: 4294967296 + 41, time: now + 260 }), q2 = mk(1, 2104, { id: 4294967296 + 42, time: now + 260 });
    frame(now + 272); frame(now + 288);
    q1.removeCell();
    frame(now + 304);
    check('a cell of the same connection there before the copy left: the fade plays', LM.removedCells.includes(q1) && q1.invisible !== true && !q2.invisible);
    LM.cells.length = 0; LM.removedCells.length = 0;
}

/* ---------- ghost cells ---------- */
{
    const R = g._ghostR;
    const arcs = [];
    const fctx = { beginPath() {}, moveTo() {}, arc(x, y, r) { arcs.push([x, y, r]); }, fill() {}, drawImage() {}, fillText() {}, save() {}, restore() {}, translate() {}, rotate() {} };
    Object.assign(g, { lmSkinsShown: () => false, lmT: (k) => k, removeEmojis: (s) => s, application: {}, LM_GHOST_TOL0: 60, LM_GHOST_SPEED: 0.5 });
    Object.assign(R, { ctx: fctx, scale: 0.1, canvasWidth: 1920, canvasHeight: 1080, camX: 0, camY: 0, pi2: Math.PI * 2,
        getLegendWorldAttachedRenderPoint: (x, y) => ({ x, y }), drawTextAlongArc() {} });
    const gh = (x, y, mass) => ({ x, y, rawX: x, rawY: y, mass, size: ~~Math.sqrt(100 * mass) });
    function drawn(ghosts, cells, setup) {
        LM.ghostCells = ghosts; LM.cells = cells; LM.leaderboard = [{ nick: 'Top' }];
        LM.ghostCellsTime = Date.now(); LM.srvViewMinX = LM.srvViewMinY = LM.srvViewMaxX = LM.srvViewMaxY = NaN;
        LM.camMinX = LM.camMinY = LM.camMaxX = LM.camMaxY = NaN; LM._lmLastWorldUpdate = 0;
        g.window.spects = [];
        g._lmMbFeed.length = 0;
        if (setup) setup();
        arcs.length = 0; R.drawGhostCells();
        return arcs.length;
    }
    const top = () => [gh(2000, 1000, 5000)];
    const cell = (x, y, size, extra) => Object.assign({ x, y, size, isFood: false, isVirus: false, invisible: false, spectator: 0 }, extra || {});
    check('ghost without any cell or coverage: drawn', drawn(top(), []) === 1);
    check('ghost: the player himself (same server name) hides it', drawn(top(), [cell(2100, 1050, 700, { spectator: 3, _lmSrvName: 'Top' })], () => { g._lmMbFeed[3] = true; }) === 0);
    /* a named ghost: only a cell with its name is his; an unnamed real cell (size 40 or more, of a
     * verified connection) inside its radius is another player and hid it */
    check('ghost with a name: an unnamed cell inside its radius does not hide it', drawn(top(), [cell(2100, 1050, 700)]) === 1);
    check('ghost with a name: an unnamed cell of a verified spectator does not hide it either', drawn(top(), [cell(2100, 1050, 700, { spectator: 3 })], () => { g._lmMbFeed[3] = true; }) === 1);
    check('ghost with a name: the unnamed cell beside his own named cell: hidden (his cell)', drawn(top(), [cell(2100, 1050, 700), cell(2050, 1000, 600, { _lmSrvName: 'Top' })]) === 0);
    check('ghost without a name (an unnamed player\'s row): an unnamed cell there hides it', drawn(top(), [cell(2100, 1050, 700)], () => { LM.leaderboard = [{ nick: '' }]; }) === 0);
    check('ghost of me: my own unnamed cell hides it', drawn(top(), [cell(2030, 1000, 700, { isPlayerCell: true })]) === 0);
    check('ghost: another named player inside its radius does not hide it', drawn(top(), [cell(2400, 1000, 300, { _lmSrvName: 'someone' })]) === 1);
    check('ghost: a cell of an unverified spectator does not hide it', drawn(top(), [cell(2050, 980, 700, { spectator: 3, _lmSrvName: 'Top' })], () => { g._lmMbFeed[3] = false; }) === 1);
    check('ghost: a verified spectator\'s copy hidden behind its twin still hides it', drawn(top(), [cell(2100, 1050, 700, { spectator: 4, invisible: true, _lmSrvName: 'Top' })], () => { g._lmMbFeed[4] = true; }) === 0);
    check('ghost of me: my own cell hides it whatever its server name', drawn(top(), [cell(2030, 1000, 700, { isPlayerCell: true, _lmSrvName: 'srv' })]) === 0);
    check('ghost of a verified unit: the unit\'s own cell hides it whatever its server name', drawn(top(), [cell(2030, 1000, 700, { spectator: 2, isPlayerCellMulti: true, _lmSrvName: 'srv' })], () => { g._lmMbFeed[2] = true; }) === 0);
    check('ghost of an unverified unit: the unit\'s own cell with the ghost\'s name hides it', drawn(top(), [cell(2030, 1000, 700, { spectator: 2, isPlayerCellMulti: true, _lmSrvName: 'Top' })], () => { g._lmMbFeed[2] = false; }) === 0);
    /* an unverified unit's cells may be mirrored: its own cell of another player is no proof */
    check('ghost: an unverified unit\'s own cell of another name does not hide it', drawn(top(), [cell(2100, 1000, 300, { spectator: 2, isPlayerCellMulti: true, _lmSrvName: 'Other' })], () => { g._lmMbFeed[2] = false; }) === 1);
    check('ghost: an unverified unit\'s unnamed own cell does not hide it', drawn(top(), [cell(2100, 1000, 300, { spectator: 2, isPlayerCellMulti: true })], () => { g._lmMbFeed[2] = false; }) === 1);
    check('ghost: ejected mass (size 45) inside it does not hide it', drawn(top(), [cell(2010, 1000, 45, { isEjected: true })]) === 1);
    check('ghost: a cell of a connection that is gone (not in spects) does not hide it', drawn(top(), [cell(2100, 1000, 300, { spectator: 9, _lmSrvName: 'Top' })]) === 1);
    const mainView = () => { LM.srvViewMinX = 0; LM.srvViewMinY = -1000; LM.srvViewMaxX = 5000; LM.srvViewMaxY = 3000; LM._lmLastWorldUpdate = Date.now(); };
    check('ghost inside the main server view without his cell: stale, not drawn', drawn(top(), [], mainView) === 0);
    check('ghost: another player there does not keep a stale ghost', drawn(top(), [cell(2400, 1000, 300, { _lmSrvName: 'someone' })], mainView) === 0);
    check('ghost near the edge of the main view (within the lag margin): drawn', drawn([gh(4950, 1000, 5000)], [], mainView) === 1);
    check('ghost: a list 1 s old shrinks the view by 560 (ghost 400 inside the edge: drawn)', drawn([gh(4600, 1000, 5000)], [], () => { mainView(); LM.ghostCellsTime = Date.now() - 1000; }) === 1);
    check('ghost outside every view: drawn', drawn([gh(-2000, 1000, 5000)], [], mainView) === 1);
    /* fills the array it is given, as Spect._lmServerViewDisplay does */
    const outs = [];
    const sp = (ok, open, age) => ({ number: 3, _lmFeedOk: () => ok, isSocketOpen: () => open, time: Date.now() - (age || 0),
        _lmServerViewDisplay: (out) => { outs.push(out); const o = out || []; o[0] = 1000; o[1] = 0; o[2] = 4000; o[3] = 2000; return o; } });
    check('ghost inside a verified open spectator\'s server view: stale, not drawn', drawn(top(), [], () => { g.window.spects = [sp(true, true)]; }) === 0);
    const two = [sp(true, true), sp(true, true)];
    outs.length = 0; drawn(top(), [], () => { g.window.spects = two; }); drawn(top(), [], () => { g.window.spects = two; });
    check('ghost coverage: every spectator\'s view read into one kept array, frame after frame (no new arrays)',
        outs.length === 4 && Array.isArray(outs[0]) && outs.every((o) => o === outs[0]), outs.length + ' reads');
    check('ghost inside an unverified spectator\'s view (calibrating): drawn', drawn(top(), [], () => { g.window.spects = [sp(false, true)]; }) === 1);
    check('ghost inside a reconnecting spectator\'s view: drawn', drawn(top(), [], () => { g.window.spects = [sp(true, false)]; }) === 1);
    check('ghost list without a time (other servers): coverage not used, drawn', drawn(top(), [], () => { mainView(); LM.ghostCellsTime = 0; }) === 1);
    /* coverage only from a spectator whose view is fresh: its last update at (about) the list's time or later, and recent */
    check('ghost inside a stalled spectator\'s view (last update 550 ms ago, after the list): drawn', drawn(top(), [], () => { g.window.spects = [sp(true, true, 550)]; LM.ghostCellsTime = Date.now() - 600; }) === 1);
    check('ghost inside a spectator\'s view last updated well before the list: drawn', drawn(top(), [], () => { g.window.spects = [sp(true, true, 400)]; }) === 1);
    /* 25 packets per second with a gap of 2.5 ticks: its last update 150 ms before the list still counts */
    check('ghost inside a spectator\'s view last updated 150 ms before the list: stale, not drawn', drawn(top(), [], () => { g.window.spects = [sp(true, true, 150)]; }) === 0);
    check('ghost inside the view of a spectator whose own coverage test says stale: drawn', drawn(top(), [], () => { const o = sp(true, true); o._lmCoverageOk = () => false; g.window.spects = [o]; }) === 1);
    check('ghost: a spectator\'s own coverage test is used when it has one (fresh, covers it)', drawn(top(), [], () => { const o = sp(true, false); o._lmCoverageOk = () => true; g.window.spects = [o]; }) === 0);
    /* the list has not come again for over 3 s: its players may be anywhere */
    check('ghost list past its max age: no ghost drawn', drawn([gh(2000, 1000, 5000), gh(-2000, 1000, 5000)], [], () => { LM.ghostCellsTime = Date.now() - 3500; }) === 0);
    check('ghost list within its max age outside every view: drawn', drawn([gh(-2000, 1000, 5000)], [], () => { mainView(); LM.ghostCellsTime = Date.now() - 2500; }) === 1);
    /* the minimap's ghost block (drawMiniMap) follows the same list age */
    {
        const mm = cut('                    if (defaultmapsettings.showMiniMapGhostCells', '                    if (defaultmapsettings.showMiniMapGuides)', 'minimap ghosts');
        let arcsMM = 0;
        const ctxMM = { beginPath() {}, moveTo() {}, arc() { arcsMM++; }, fill() {} };
        const runMM = vm.runInContext('(function (ogario, defaultmapsettings, defaultSettings, r, l, n, o) {' + mm + '})', g);
        const mmDrawn = (age, rawX) => {
            arcsMM = 0;
            const lm = { ghostCells: [{ x: 0, y: 0, size: 500, inView: false, rawX }], ghostCellsTime: age === null ? 0 : Date.now() - age };
            runMM.call({ miniMapCtx: ctxMM, pi2: 2 * Math.PI }, lm, { showMiniMapGhostCells: true }, {}, 7000, 7000, 0.01, 200);
            return arcsMM;
        };
        check('minimap ghosts: a list 2.5 s old drawn', mmDrawn(2500, 0) === 1);
        check('minimap ghosts: a list past its max age (3.5 s) not drawn, as on the game canvas', mmDrawn(3500, 0) === 0);
        check('minimap ghosts: a list without a time or rawX (other servers) drawn', mmDrawn(null, 0) === 1 && mmDrawn(3500, undefined) === 1);
    }
    check('ghost: the cell of a stalled spectator (no world update for 5 s) does not hide it', drawn(top(), [cell(2100, 1050, 700, { spectator: 3, _lmSrvName: 'Top' })], () => {
        g.window.spects = [{ number: 3, _lmFeedOk: () => true, isSocketOpen: () => true, _lmWorldStamp: () => Date.now() - 5000 }]; g.lmMbFrameHide(); }) === 1);
    /* culling: the frame's view box (LM.camMin/Max, the cells' culling), not a box moved to the
     * main player's view when the camera is on a distant unit */
    {
        const cam = (cx, cy) => () => { Object.assign(R, { scale: 1, camX: cx, camY: cy }); LM.viewX = 0; LM.viewY = 0;
            LM.camMinX = cx - 960; LM.camMaxX = cx + 960; LM.camMinY = cy - 540; LM.camMaxY = cy + 540; };
        check('ghost culling: camera on a distant controlled unit, a ghost on screen there: drawn', drawn([gh(6100, 6000, 500)], [], cam(6000, 6000)) === 1);
        check('ghost culling: camera on a distant unit, a ghost round the main player (off screen): not drawn', drawn([gh(100, 0, 500)], [], cam(6000, 6000)) === 0);
        check('ghost culling: the frame\'s box framing two players (grown by calMinMax): a ghost between them drawn',
            drawn([gh(3000, 3000, 500)], [], () => { cam(6000, 6000)(); LM.camMinX = -960; LM.camMinY = -540; }) === 1);
        check('ghost culling: no frame box and no valid camera: the main view stands in', drawn([gh(100, 0, 500)], [], () => { cam(NaN, NaN)(); LM.camMinX = NaN; }) === 1);
        Object.assign(R, { scale: 0.1, camX: 0, camY: 0 });
    }
    /* the main server view covers only while the main socket's world updates are fresh */
    check('ghost inside the main server view, main socket stalled (last world update 2 s ago): drawn', drawn(top(), [], () => { mainView(); LM._lmLastWorldUpdate = Date.now() - 2000; }) === 1);
    check('ghost inside the main server view of a new connection without a world update yet: drawn', drawn(top(), [], () => { mainView(); LM._lmLastWorldUpdate = 0; }) === 1);
    check('ghost inside the main server view, its last world update 300 ms before the list: drawn', drawn(top(), [], () => { mainView(); LM._lmLastWorldUpdate = Date.now() - 300; }) === 1);
    /* a source the reconciliation leaves out (stalled) gives no coverage, even with a fresh camera */
    {
        const fresh = (w, player) => ({ number: 3, player: !!player, _lmFeedOk: () => true, isSocketOpen: () => true, time: Date.now(), _lmCoverageOk: () => true,
            _lmWorldStamp: () => w, _lmServerViewDisplay: (o) => { o[0] = 1000; o[1] = 0; o[2] = 4000; o[3] = 2000; return o; } });
        check('ghost inside a tile\'s view, its world 700 ms behind the fresh main socket (lmSrcStale): drawn',
            drawn(top(), [], () => { LM._lmLastWorldUpdate = Date.now(); g.window.spects = [fresh(Date.now() - 700)]; }) === 1);
        check('ghost inside a unit\'s view, no world update for 1.5 s (_lmMbStalled): drawn',
            drawn(top(), [], () => { g.window.spects = [fresh(Date.now() - 1500, true)]; }) === 1);
        check('ghost inside the view of a spectator with packets but no world update yet: drawn',
            drawn(top(), [], () => { g.window.spects = [fresh(0)]; }) === 1);
        check('ghost inside a fresh tile\'s view (world update now): stale, not drawn',
            drawn(top(), [], () => { LM._lmLastWorldUpdate = Date.now(); g.window.spects = [fresh(Date.now())]; }) === 0);
    }
    /* identity: proximity or a nick alone is not the player */
    const unnamed = () => { LM.leaderboard = [{ nick: '' }]; };
    check('ghost without a name: an unrelated small unnamed player beside it does not hide it', drawn(top(), [cell(2100, 1000, 200)], unnamed) === 1);
    check('ghost without a name: a named player there does not hide it', drawn(top(), [cell(2100, 1000, 700, { _lmSrvName: 'someone' })], unnamed) === 1);
    check('ghost without a name: two unnamed players there of twice its mass do not hide it', drawn(top(), [cell(2100, 1000, 700), cell(1900, 1000, 700)], unnamed) === 1);
    check('ghost with a name: a smaller player with the same nick does not hide it', drawn(top(), [cell(2100, 1000, 200, { _lmSrvName: 'Top' })]) === 1);
    check('ghost with a name: a far bigger player with the same nick does not hide it', drawn(top(), [cell(2100, 1000, 1000, { _lmSrvName: 'Top' })]) === 1);
    check('ghost with a name: two players of that nick there, twice its mass, do not hide it',
        drawn(top(), [cell(2200, 1000, 700, { _lmSrvName: 'Top' }), cell(1800, 1000, 700, { _lmSrvName: 'Top' })]) === 1);
    const four = (extra) => [cell(1850, 850, 350, extra), cell(2150, 850, 350, extra), cell(1850, 1150, 350, extra), cell(2150, 1150, 350, extra)];
    check('ghost with a name: the player split in four (his mass together) hides it', drawn(top(), four({ _lmSrvName: 'Top' })) === 0);
    check('ghost of me split in four: my own cells hide it', drawn(top(), four({ isPlayerCell: true })) === 0);
    check('ghost: my own much smaller cell inside another player\'s ghost does not hide it', drawn(top(), [cell(2100, 1000, 200, { isPlayerCell: true, _lmSrvName: 'me' })]) === 1);
    check('ghost: a verified unit\'s much smaller own cell inside it does not hide it',
        drawn(top(), [cell(2100, 1000, 200, { spectator: 2, isPlayerCellMulti: true, _lmSrvName: 'u' })], () => { g._lmMbFeed[2] = true; }) === 1);
    check('ghost: ten blobs of ejected mass inside it do not hide it',
        drawn(top(), Array.from({ length: 10 }, (_, i) => cell(1900 + 20 * i, 1000, 45, { isEjected: true, _lmSrvName: 'Top' }))) === 1);
    /* the copy that is drawn changes: one connection's copy is enough, copies are not added up */
    const copy = (sp, inv) => cell(2050, 1000, 700, { spectator: sp, _lmSrvName: 'Top', invisible: !!inv, _lmMbPosDup: !!inv });
    const feed = () => { g._lmMbFeed[3] = g._lmMbFeed[4] = true; };
    check('ghost: the player drawn by the main copy, a tile\'s copy hidden behind it: hidden', drawn(top(), [copy(0), copy(3, true)], feed) === 0);
    check('ghost: the drawn copy changes to the tile\'s (main copy hidden): still hidden', drawn(top(), [copy(0, true), copy(3)], feed) === 0);
    check('ghost: only the tile\'s copy left: still hidden', drawn(top(), [copy(3)], feed) === 0);
    check('ghost: the player seen by three connections (not three times his mass): hidden', drawn(top(), [copy(0), copy(3, true), copy(4, true)], feed) === 0);
    /* one pass over the cells: 50 ghosts and 4000 cells */
    {
        let s = 11;
        const rnd = () => ((s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff) / 0x7fffffff);
        const gs = [], cs = [];
        for (let i = 0; i < 50; i++) gs.push(gh(-9000 + rnd() * 18000, -5000 + rnd() * 10000, 500 + ~~(rnd() * 20000)));
        for (let i = 0; i < 4000; i++) cs.push(cell(-9000 + rnd() * 18000, -5000 + rnd() * 10000, 40 + rnd() * 260, { _lmSrvName: rnd() < 0.3 ? undefined : 'N' + ~~(rnd() * 300) }));
        const lb = gs.map((_, i) => ({ nick: i % 5 ? 'P' + i : '' }));
        let reads = 0;
        const counted = cs.map((c) => new Proxy(c, { get(t, k) { if (k === 'isFood') reads++; return t[k]; } }));
        drawn(gs, counted, () => { LM.leaderboard = lb; });
        check('ghost: 50 ghosts and 4000 cells read each cell once (was once per ghost)', reads === 4000, reads + ' reads');
    }
}

/* ---------- playing with Full Map: the main socket's flushes ---------- */
{
    const flushBody = cut('        flushCellsData(preserveMapGeometry) {', '        /* Spectator toggles', 'flushCellsData').trim().replace(/,$/, '');
    const specBody = cut('        flushSpecsData() {', '        /* A map border is four finite numbers', 'flushSpecsData').trim().replace(/,$/, '');
    const f = { window: {}, Number, Math, Object, Array, Date, console };
    f.window.window = f.window;
    vm.createContext(f);
    vm.runInContext(helpers + '\nfunction lmSetMbUnit(u) { window.multiboxPlayerEnabled = +u || null; }\nfunction lmTimeAlive() {}\n' +
        'function lmFoodRebuild() { window.rebuilt = (window.rebuilt || 0) + 1; }\nfunction lmObsResetAll() { window.obsReset = (window.obsReset || 0) + 1; }\n' +
        'var spects = window.spects = [];\n' +
        'var LM = window.legendmod = { isLegendWorld: false, connectionIntegrity: true, serverType: "agario", play: true, mapOffsetFixed: true,\n' +
        '  _lmFullBorderNow: function () { return { minX: -7071, minY: -7071, maxX: 7071, maxY: 7071 }; },\n' +
        '  _lmApplyFullBorder: function () { this.fullBorderApplied = (this.fullBorderApplied || 0) + 1; },\n' +
        flushBody + ',\n' + specBody + ' };\nvar ogario = LM;', f);
    const L = f.window.legendmod;
    /* the player's cells (main socket, spectator 0), 15 tiles each with a cell, a pellet and a virus */
    function world() {
        const tiles = [];
        for (let k = 1; k <= 15; k++) tiles.push({ number: k, tile: k - 1, player: false, closed: false, closeConnection() { this.closed = true; } });
        f.window.spects = tiles;
        vm.runInContext('spects = window.spects;', f);
        Object.assign(L, { cells: [], indexedCells: {}, playerCells: [], playerCellsMulti: [], food: [], viruses: [], playerCellIDs: [1, 2], ghostCells: [], removedCells: [] });
        const mk = (id, sp, kind) => {
            const c = { id, spectator: sp, isFood: kind === 'food', isVirus: kind === 'virus', removed: false };
            if (kind !== 'food') { f.indexedPush(L.cells, c, '_cellsIdx'); L.indexedCells[id] = c; }
            if (kind === 'food') f.indexedPush(L.food, c, '_foodIdx');
            if (kind === 'virus') f.indexedPush(L.viruses, c, '_virusIdx');
            if (kind === 'own') f.indexedPush(L.playerCells, c, '_playerIdx');
            return c;
        };
        const own = [mk(1, 0, 'own'), mk(2, 0, 'own')], mainOther = mk(3, 0, 'cell'), mainVirus = mk(4, 0, 'virus');
        const obs = [];
        for (const t of tiles) {
            const base = t.number * 4294967296;
            obs.push(mk(base + 10, t.number, 'cell'), mk(base + 11, t.number, 'virus'));
            mk(base + 12, t.number, 'food');
        }
        return { tiles, own, main: [mainOther, mainVirus].concat(own), obs };
    }
    for (const arg of [false, true]) {
        const w = world();
        L.flushCellsData(arg);
        const name = arg ? 'respawn flush (true)' : 'same-socket ClearAll (false)';
        check(name + ': every tile open, none closed, the same objects', f.window.spects.length === 15 && w.tiles.every((t, i) => f.window.spects[i] === t && !t.closed));
        check(name + ': the tiles\' cells and viruses kept (the same objects, indexed), the main socket\'s gone',
            w.obs.every((c) => L.cells.includes(c) && L.indexedCells[c.id] === c) && w.main.every((c) => !L.cells.includes(c) && !L.indexedCells[c.id]) &&
            L.viruses.length === 15 && L.viruses.every((c) => c.spectator > 0), L.cells.length + ' cells, ' + L.viruses.length + ' viruses');
        check(name + ': no own cell left, no tile cell made an own cell', L.playerCells.length === 0 && L.playerCellIDs.length === 0 && L.playerCellsMulti.length === 0);
        if (!arg) check(name + ': agar.io full border kept (no new calibration from view rects)', L.mapOffsetFixed === true && L.fullBorderApplied >= 1);
    }
    {
        const w = world();
        L.flushCellsData();
        check('connection flush (server change, lost socket): every tile closed, spects empty', w.tiles.every((t) => t.closed) && f.window.spects.length === 0);
        check('connection flush: no cell of any connection left', L.cells.length === 0 && Object.keys(L.indexedCells).length === 0 && L.viruses.length === 0 && L.food.length === 0);
    }
}

console.log(failed ? failed + ' FAILED' : 'all passed');
process.exit(failed ? 1 : 0);
