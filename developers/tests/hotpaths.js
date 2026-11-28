/* Per-frame and per-second hot paths in ogario.v4.js:
 * - LM.sortCells: budgeted insertion sort with the native sort as fallback must give exactly
 *   the order of the old full insertion sort (size, then id), and be fast on bad input.
 * - lmTop5TempTeammates: a temporary (socket 3) teammate expires 6 s after its last update,
 *   is not added twice, and fresh ones stay listed.
 * - application._lmTop5Write: teamboard DOM writes only when something changed.
 * - split range with multibox units: each unit's own cell index, no list per unit per frame.
 * Usage: node developers/tests/hotpaths.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
function check(name, ok) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name);
    if (!ok) failed++;
}
function slice(from, to) {
    const a = src.indexOf(from);
    const b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error('not found in ogario.v4.js: ' + from);
    return src.slice(a, b);
}

/* ---- sortCells ---- */
const LM = vm.runInNewContext('({\n' + slice('        sortCells() {', '        calculatePlayerMassAndPosition() {') + '})');

/* the insertion sort as it was before the budget */
function oldSort(a) {
    for (var i = 1, len = a.length; i < len; i++) {
        var tmp = a[i];
        if (!tmp) continue;
        var tSize = tmp.size, tId = tmp.id;
        var j = i - 1;
        while (j >= 0 && a[j] && (a[j].size > tSize || (a[j].size === tSize && a[j].id > tId))) {
            a[j + 1] = a[j]; j--;
        }
        a[j + 1] = tmp;
    }
}
function newSort(a) { LM.cells = a; LM.sortCells(); }

let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
const N = 2500;
function cell(i, size, id) { return { size: size, id: id, tag: i }; }
const cases = {
    reversed: () => Array.from({ length: N }, (_, i) => cell(i, N - i, N - i)),
    random: () => Array.from({ length: N }, (_, i) => cell(i, Math.floor(rnd() * 3000) + 10, Math.floor(rnd() * 1e6))),
    nearlySorted: () => {
        const a = Array.from({ length: N }, (_, i) => cell(i, 10 + i * 0.5 + (rnd() - 0.5) * 2, i));
        for (let k = 0; k < 40; k++) { const i = Math.floor(rnd() * (N - 1)); const t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; }
        return a;
    },
    equalSizes: () => Array.from({ length: N }, (_, i) => cell(i, 50, N - i)),
    equalSizesAndDuplicateIds: () => Array.from({ length: N }, (_, i) => cell(i, 50 + (i % 3), (N - i) % 97)),
    reversedWithHoles: () => { const a = cases.reversed(); for (let i = 7; i < N; i += 131) a[i] = null; return a; },
    appendedBatch: () => {
        const a = Array.from({ length: 1500 }, (_, i) => cell(i, 10 + i, i));
        for (let i = 0; i < 1000; i++) a.push(cell(1500 + i, 5 + rnd() * 2000, 5000 + i));
        return a;
    },
    empty: () => [],
    one: () => [cell(0, 3, 3)]
};
const tagsOf = (a) => a.map((c) => (c ? c.tag : 'x')).join(',');
function time(fn, make, reps) {
    let best = Infinity;
    for (let r = 0; r < reps; r++) {
        const a = make();
        const t0 = process.hrtime.bigint();
        fn(a);
        best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6);
    }
    return best;
}
const timings = {};
for (const name of Object.keys(cases)) {
    seed = 777;
    const base = cases[name]();
    const a = base.slice(), b = base.slice();
    oldSort(a);
    newSort(b);
    check('sortCells ' + name + ': same draw order as the full insertion sort', tagsOf(a) === tagsOf(b));
    const again = b.slice();
    newSort(again);
    check('sortCells ' + name + ': sorting a sorted list changes nothing', tagsOf(again) === tagsOf(b));
    if (base.length > 1) {
        seed = 777;
        timings[name] = { old: time(oldSort, cases[name], 3), now: time(newSort, cases[name], 3) };
    }
}
for (const name of Object.keys(timings)) {
    console.log('     ' + name.padEnd(26) + ' old ' + timings[name].old.toFixed(2).padStart(8) + ' ms   new ' + timings[name].now.toFixed(2).padStart(8) + ' ms');
}
check('2500 reversed cells: at least 5x faster than before', timings.reversed.now * 5 < timings.reversed.old);
check('2500 reversed cells: under 20 ms', timings.reversed.now < 20);
check('appended batch of 1000: faster than before', timings.appendedBatch.now < timings.appendedBatch.old);
check('nearly sorted: not slower than before (2x + 0.5 ms margin)', timings.nearlySorted.now <= timings.nearlySorted.old * 2 + 0.5);

/* ---- temporary teammates on the skin teamboard ---- */
const tempCode = slice('var LM_TEMP_TEAMMATE_TIMEOUT', 'function Socket3updateTeamPlayer(');
const T = vm.runInNewContext(tempCode + '; ({ run: lmTop5TempTeammates, timeout: LM_TEMP_TEAMMATE_TIMEOUT })');
check('temp teammate timeout is 6 s', T.timeout === 6000);
const now = 1000000;
function temp(id, age, extra) { return Object.assign({ id: id, nick: id, lbgpi: -2, mass: 500, alive: true, temp: true, lastUpdatedTime: now - age }, extra || {}); }
{
    const players = [temp('fresh', 500), temp('stale', 6500), temp('edge', 6000), { id: 'normal', lbgpi: 3, mass: 900, alive: true }];
    const top5 = [];
    T.run(players, top5, now);
    check('fresh temp teammate stays alive with its mass', players[0].alive === true && players[0].mass === 500);
    check('temp teammate silent for over 6 s is marked dead (mass 1)', players[1].alive === false && players[1].mass === 1);
    check('exactly 6 s is not yet stale', players[2].alive === true);
    check('normal teammates are left alone', players[3].alive === true && players[3].mass === 900);
    check('fresh ones missing from the list are added once', top5.length === 2 && top5[0] === players[0] && top5[1] === players[2]);
    T.run(players, top5, now);
    check('a second refresh (row limit click) adds no duplicate', top5.length === 2);
}
{
    const p = temp('copy', 100);
    const top5 = [{ id: 'copy', nick: 'copy', mass: 500, lbgpi: -2 }];
    T.run([p], top5, now);
    check('teammate already listed as a copy by updateTeamPlayers is not added again', top5.length === 1);
}
{
    const players = [temp('dead', 100, { alive: false }), temp('nomass', 100, { mass: 1 }), temp('notime', 0, { lastUpdatedTime: 0 })];
    const top5 = [];
    T.run(players, top5, now);
    check('dead or massless temp teammates are not listed; one without a time is', top5.length === 1 && top5[0] === players[2]);
}
check('old reversed test would kill a 0.5 s old update (the bug)', (now - 500) - now < 6000);

/* ---- teamboard DOM writes ---- */
const writeCode = slice('        _lmTop5Write(html, mass, players) {', '\n        },\n') + '\n        }';
const W = vm.runInNewContext('({ shortMassFormat(v) { return v < 1000 ? v : Math.round(v / 100) / 10 + "k"; },\n' + writeCode + '})');
function el() {
    const e = { writes: 0, _v: '' };
    ['innerHTML', 'textContent'].forEach((k) => Object.defineProperty(e, k, { get() { return e._v; }, set(v) { e._v = String(v); e.writes++; } }));
    return e;
}
W.top5pos = el(); W.top5totalMass = el(); W.top5totalPlayers = el();
W._lmTop5Write('<li>a</li>', 1500, 2);
check('first write fills list and totals', W.top5pos.innerHTML === '<li>a</li>' && W.top5totalMass.textContent === '1.5k' && W.top5totalPlayers.textContent === '2');
W._lmTop5Write('<li>a</li>', 1500, 2);
check('unchanged teamboard writes nothing', W.top5pos.writes === 1 && W.top5totalMass.writes === 1 && W.top5totalPlayers.writes === 1);
W.top5totalPlayers.textContent = 40; // the server packet writes the player count too
W._lmTop5Write('<li>a</li>', 1500, 2);
check('player count overwritten elsewhere is written back', W.top5totalPlayers.textContent === '2');
W._lmTop5Write('', 0, 0);
check('an empty team clears the list', W.top5pos.innerHTML === '' && W.top5totalMass.textContent === '0');

/* ---- displayTop5 source checks ---- */
const top5Src = slice('        displayTop5() {\n            if (defaultmapsettings.top5skins', '        _lmTop5Write(');
check('skin rows no longer look up #hudMainColor per row', (top5Src.match(/\$\('#hudMainColor'\)/g) || []).length === 1 && /if \(totalMass === undefined\)/.test(top5Src));
check('reversed time test is gone', !/lastUpdatedTime\) - tempTime < 6000/.test(top5Src));

/* ---- the message handler of a multibox / spectator unit (spect.js onmessage) reads no
 * global (the Performance diagnostics recorder it checked is gone) and handles the message
 * as before ---- */
{
    const spect = fs.readFileSync(path.join(root, 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
    const om = spect.slice(spect.indexOf('\n    onmessage(message) {'), spect.indexOf('\n    onerror(socket, generation) {'));
    const reads = [];
    const win = new Proxy({}, { get(t, k) { reads.push(String(k)); return undefined; } });
    const ctx = vm.createContext({ window: win, DataView, RangeError, console });
    const U = vm.runInContext('(class {' + om + '\n})', ctx);
    let handled = null;
    U.prototype.handleMessage = function (v) { handled = v; };
    const buf = new ArrayBuffer(8);
    new U().onmessage({ data: buf });
    check('a unit message reads no window global and is handled as before', om.length > 0 && reads.length === 0 && handled instanceof DataView && handled.buffer === buf);
    U.prototype.handleMessage = function () { throw new RangeError('short'); };
    let thrown = false;
    try { new U().onmessage({ data: buf }); } catch (e) { thrown = true; }
    check('a truncated unit message is still swallowed', !thrown);
}

/* ---- opponent colours (LM.compareCells) with a multibox unit selected: "playing" is the selected
 * unit's own cells, not any unit's cells (a dead selected unit compared every cell with mass 0) ---- */
{
    /* _lmDlThr: no Dying Light threat look asking (developers/tests/dlthreat.js) */
    const ctx = vm.createContext({ window: {}, Math, Number, _lmDlThr: false,
        defaultmapsettings: { oppColors: true, dominationRate: 4 / 3, dominatedRate: 3 / 4 },
        defaultSettings: { enemyBSTEDColor: 'BSTED', enemyBSTEColor: 'BSTE', enemyBColor: 'B', enemySColor: 'S', enemySSTEColor: 'SSTE', enemySSTEDColor: 'SSTED' } });
    ctx.window = ctx;
    const ui = src.indexOf('function lmUnitCellsInto('), unitFn = ui < 0 ? '' : src.slice(ui, src.indexOf('\n}\n', ui) + 3);
    vm.runInContext(unitFn + 'var _cmp = ({\n' + slice('        compareCells() {', '        setCellOppColor(isPlayer, mass) {') + '});', ctx);
    const units = { 2: { number: 2, playerMinMass: 0, playerMaxMass: 0 }, 3: { number: 3, playerMinMass: 900, playerMaxMass: 900 } };
    ctx.getActiveSpect = (n) => units[n] || null;
    const enemy = () => ({ x: 0, y: 0, size: Math.sqrt(90000), isPlayerCell: false });
    const L = ctx.legendmod = ctx.LM = Object.assign(ctx._cmp, { play: false, playerCells: [], selectBiggestCell: false, camMinX: -1e4, camMinY: -1e4, camMaxX: 1e4, camMaxY: 1e4 });
    /* unit 2 selected and dead, unit 3 alive */
    L.playerCellsMulti = [{ x: 50, y: 0, size: 300, spectator: 3 }];
    ctx.multiboxPlayerEnabled = 2;
    L.cells = [enemy()];
    L.compareCells();
    const deadSel = L.cells[0].oppColor;
    /* unit 3 selected (900 mass): the 900 enemy is about its size */
    ctx.multiboxPlayerEnabled = 3;
    L.cells = [enemy()];
    L.compareCells();
    const liveSel = L.cells[0].oppColor;
    check('compareCells: a dead selected unit is not playing (another unit\'s cells made every enemy "much smaller")', deadSel === undefined, deadSel);
    check('compareCells: the selected live unit is the reference (900 vs 900)', liveSel === '#FFDC00', liveSel);
}
/* ---- jelly (LM.prepareJellyCells): a multibox copy hidden behind another connection's copy
 * gives its point records back to the shared pool (they were left to the garbage collector on
 * every hide), each once, holding no cell ---- */
{
    const B = require('./bench-dense.js');
    const J = B.loadJelly();
    B.setCamera(J);
    const body = (id, x) => Object.assign(new J.Cell(), { id: id, x: x, y: 0, size: 100, isVirus: false, isFood: false, removed: false, invisible: false, points: [], pointsVel: [], maxPointRad: 0 });
    const a = body(1, 0), b = body(2, 3);
    J.LM.cells = [a, b];
    J.LM.prepareJellyCells(J.LM.cells, []);
    const old = b.points.slice();
    b.invisible = true; b._lmMbTwin = a;
    J.LM.prepareJellyCells(J.LM.cells, []);
    const pool = J.window._lmJellyPointPool || [];
    check('hidden multibox copy: its jelly point records go back to the pool once each, holding no cell',
        old.length >= 5 && b.points.length === 0 && old.every((p) => pool.indexOf(p) >= 0 && p.parent === null) &&
        new Set(pool).size === pool.length && !a.points.some((p) => pool.indexOf(p) >= 0));
}
/* ---- split range (drawHelpers) with multibox units: each unit's rings come from its own cell
 * index (the same list every frame, no list built per unit per frame); a Full Map spectator never
 * draws own rings; the enemy rings are drawn once ---- */
{
    const a = src.indexOf('                if (defaultmapsettings.splitRange) {\n                    if (LM.playerCells && LM.playerCells.length) {');
    const b = src.indexOf('/* Triple split range', a);
    const calls = [];
    const R = { ctx: {}, drawSplitRange(ctx, enemy, players) { calls.push(['range', enemy, players]); }, drawDoubleSplitRange(ctx, enemy, players) { calls.push(['double', enemy, players]); } };
    const own = (n) => { const list = [{ id: n, size: 100 }]; return { number: n, player: true, playerCellIDs: [n], getOwnPlayerCells: () => list, list }; };
    const u2 = own(2), u5 = own(5), dead = Object.assign(own(9), { playerCellIDs: [] });
    const fm = { number: 3, player: false, playerCellIDs: [7], getOwnPlayerCells: () => [{ id: 7, size: 50 }] };
    const LMx = { playerCells: [{ id: 1, size: 80 }], selectBiggestCell: false, biggerSTECellsCache: ['E1'], biggerSTEDCellsCache: ['E2'], indexedCells: { 7: { id: 7, size: 50 } } };
    const run = new Function('LM', 'spects', 'defaultmapsettings', src.slice(a, b));
    const frame = () => { calls.length = 0; run.call(R, LMx, [fm, u2, dead, u5], { splitRange: true }); return calls.slice(); };
    const f1 = frame(), f2 = frame();
    const unitLists = (f) => f.filter((c) => c[2] && c[2] !== LMx.playerCells).map((c) => c[2]);
    check('split range: each unit draws from its own cell index (the same list every frame)', unitLists(f1).length === 4 && unitLists(f1).every((l, i) => l === unitLists(f2)[i]) &&
        unitLists(f1)[0] === u2.list && unitLists(f1)[2] === u5.list);
    check('split range: a Full Map spectator and a dead unit draw no own rings', !f1.some((c) => c[2] && (c[2][0].id === 7 || c[2][0].id === 9)));
    check('split range: the enemy rings are drawn once (by the main player)', f1.filter((c) => c[1] === LMx.biggerSTECellsCache).length === 1);
    check('split range: no list is built per unit per frame', !/var unitCells = \[\];/.test(src.slice(a, b)));
}

/* ---- the action resolver (lmActiveUnit(true), up to 100 calls a second from macro feed): no copy of
 * the own cells (getOwnPlayerCells / playerCells are not read), the full form still has them ---- */
{
    const fnOf = (name) => { const i = src.indexOf('\nfunction ' + name + '('); return i < 0 ? '' : src.slice(i + 1, src.indexOf('\n}\n', i) + 3); };
    const ctx = vm.createContext({ Math, Number });
    ctx.window = ctx;
    vm.runInContext(fnOf('getActiveSpect') + fnOf('lmActiveUnit'), ctx);
    let reads = 0;
    const u = { number: 2, player: true, active: true, socket: {}, connectionGeneration: 3, playerCellIDs: [1], playerMass: 50, getOwnPlayerCells() { reads++; return [{ size: 100 }]; } };
    ctx.spects = [u];
    ctx.legendmod = { play: true, socket: {}, get playerCells() { reads++; return []; } };
    ctx.multiboxPlayerEnabled = 2;
    const lite = ctx.lmActiveUnit(true);
    ctx.multiboxPlayerEnabled = 0;
    const liteMain = ctx.lmActiveUnit(true);
    const litereads = reads;
    ctx.multiboxPlayerEnabled = 2;
    const full = ctx.lmActiveUnit();
    check('lmActiveUnit(true) copies no cells (unit and main player); the full form still does', litereads === 0 && lite.target === u && liteMain.target === ctx.legendmod &&
        !('cells' in lite) && full.cells.length === 1 && full.index === 1, litereads);
    /* the full form: one result object and cells list per client, filled again on each call (min /
     * max of this call's cells); no own cell left: every stat 0, not the last life's mass */
    const own = [{ size: 100 }, { size: 50 }];
    u.getOwnPlayerCells = () => own;
    const f1 = ctx.lmActiveUnit(), f1cells = f1.cells, f1min = f1.minMass, f1max = f1.maxMass;
    own[1].size = 30;
    const f2 = ctx.lmActiveUnit();
    check('lmActiveUnit(): the same result and cells list each call, its stats from this call', f2 === f1 && f2.cells === f1cells && f1min === 25 && f1max === 100 &&
        f2.minMass === 9 && f2.maxMass === 100 && f2.mass === 50 && f2.playing === true);
    own.length = 0;
    const f3 = ctx.lmActiveUnit();
    check('lmActiveUnit(): no own cell: not playing, mass / min / max / ref 0 (playerMass still says 50)', f3.playing === false && f3.mass === 0 && f3.minMass === 0 &&
        f3.maxMass === 0 && f3.refMass === 0 && f3.cells.length === 0);
    /* lmSessionType: 'live' from the lite resolver and the own list (the full form is not asked) */
    vm.runInContext(fnOf('lmSessionType') + 'var __au = lmActiveUnit; lmActiveUnit = function (lite) { if (lite !== true) throw new Error("full form"); return __au(true); };', ctx);
    own.push({ size: 80 });
    const liveUnit = ctx.lmSessionType();
    own.length = 0;
    const deadUnit = ctx.lmSessionType();
    ctx.multiboxPlayerEnabled = 0;
    const mainNoCells = ctx.lmSessionType();
    ctx.legendmod = { play: true, socket: {}, playerCells: [{ size: 60, removed: true }, { size: 60 }] };
    const mainLive = ctx.lmSessionType();
    ctx.legendmod.play = false;
    const mainDead = ctx.lmSessionType();
    check('lmSessionType: live while the player you control has an own cell (the lite resolver only), else menu',
        liveUnit === 'live' && deadUnit === 'menu' && mainNoCells === 'menu' && mainLive === 'live' && mainDead === 'menu');
}

console.log(failed ? 'FAILED: ' + failed : 'all hotpaths checks passed');
process.exit(failed ? 1 : 0);
