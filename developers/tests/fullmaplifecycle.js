// Full Map / multibox entity lifecycle and ghost cells, with the real code cut from ogario.v4.js:
// the twin search and the frame's hide step (lmMultiboxPositionTwin and the frame compaction),
// removeCell() and drawGhostCells().
// Removal, on 19 frames of a live agar.io Full Map capture (developers/tests/lib/fullmap-twin-live.json,
// 59 cells seen by 2-8 connections): an eaten cell plays one eat animation and is not drawn again by
// another connection's lagging copy (eats of one cell reach the connections up to 16 ms and more
// apart); a copy that leaves its view while another connection still sees the cell plays no fade
// on top of the live copy; a copy that sat behind a main cell dropped without removeCell() is drawn
// again (a ClearAll flush keeping the other connections' cells is tested in fullmapfood.js).
// Ghost cells (opcode 69): hidden only by the player's own cells (same server name, not another
// player's, not an unverified spectator's) or, without them, inside verified coverage.
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

const g = { window: { legendmod: null, spects: [] }, Number, Math, Map, Set, Float64Array, Int32Array, Array, Object, Date, console };
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
    check('ghost: an unnamed cell there still hides it (names compared only when both are known)', drawn(top(), [cell(2100, 1050, 700)]) === 0);
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
    const mainView = () => { LM.srvViewMinX = 0; LM.srvViewMinY = -1000; LM.srvViewMaxX = 5000; LM.srvViewMaxY = 3000; };
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
    check('ghost inside the view of a spectator whose own coverage test says stale: drawn', drawn(top(), [], () => { const o = sp(true, true); o._lmCoverageOk = () => false; g.window.spects = [o]; }) === 1);
    check('ghost: a spectator\'s own coverage test is used when it has one (fresh, covers it)', drawn(top(), [], () => { const o = sp(false, false); o._lmCoverageOk = () => true; g.window.spects = [o]; }) === 0);
    /* the list has not come again for over 3 s: its players may be anywhere */
    check('ghost list past its max age: no ghost drawn', drawn([gh(2000, 1000, 5000), gh(-2000, 1000, 5000)], [], () => { LM.ghostCellsTime = Date.now() - 3500; }) === 0);
    check('ghost list within its max age outside every view: drawn', drawn([gh(-2000, 1000, 5000)], [], () => { mainView(); LM.ghostCellsTime = Date.now() - 2500; }) === 1);
}

console.log(failed ? failed + ' FAILED' : 'all passed');
process.exit(failed ? 1 : 0);
