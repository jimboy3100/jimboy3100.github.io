/* Merge timer checks: the real ogario/mergetimer.js in a fake page. Its table of own cells
 * (window.playerCellsId) keeps only cells that are still in the world, and the core's death
 * and connection close lines reset it.
 * node developers/tests/mergetimer.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'mergetimer.js'), 'utf8');
const core = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
let tick = null, now = 0, fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const win = { playerCellsId: [], legendmod: { playerCells: [], indexedCells: {} }, legendmod5: { mergeTimer: true } };
const ctx = { window: win, performance: { now: () => now }, setInterval: f => { tick = f; return 1; }, clearInterval: () => {}, Number, Math, Object, console };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const LM = win.legendmod;
const setOwn = cells => {
    for (const k of Object.keys(LM.indexedCells)) if (LM.indexedCells[k].isPlayerCell && !LM.indexedCells[k].isPlayerCellMulti) delete LM.indexedCells[k];
    for (const c of cells) { c.isPlayerCell = true; LM.indexedCells[c.id] = c; }
    LM.playerCells = cells;
};
const step = () => { now += 100; tick(); };
const entries = () => Object.keys(win.playerCellsId).length;

/* a multibox unit's own cell (drawn by drawMerge, not in LM.playerCells) stays tracked */
const unitCell = { id: 900001, mass: 300, isPlayerCell: true, isPlayerCellMulti: true };
LM.indexedCells[unitCell.id] = unitCell;
win.playerCellsId[unitCell.id] = { historyMass: [300] };

let id = 1000, maxSeen = 0, liveCounting = true;
for (let life = 0; life < 100; life++) {
    let cells = [{ id: id++, mass: 400 }];
    setOwn(cells); step();
    for (let s = 0; s < 4; s++) {
        cells = cells.flatMap(c => [{ id: c.id, mass: c.mass / 2 }, { id: id++, mass: c.mass / 2 }]);
        setOwn(cells); step();
        maxSeen = Math.max(maxSeen, entries());
    }
    if (life === 0) liveCounting = cells.every(c => win.playerCellsId[c.id] && win.playerCellsId[c.id]._mergeState === 'counting');
    setOwn([]); step();
}
check('16 split pieces of a life are all counting', liveCounting);
check('table never holds more than the live cells (max ' + maxSeen + ')', maxSeen <= 17);
check('after 100 lives only the multibox unit cell is left (' + entries() + ')', entries() === 1 && !!win.playerCellsId[unitCell.id]);
check('an entry of the first life is gone', win.playerCellsId[1000] === undefined);

/* an enemy cell that gets an id of an earlier own cell does not inherit its merge state */
setOwn([{ id: 5, mass: 200 }, { id: 6, mass: 200 }]);
win.playerCellsId[5] = { historyMass: [200], _mergeState: 'counting', mergeTime: 20 };
win.playerCellsId[6] = { historyMass: [200] };
setOwn([]);
LM.indexedCells[5] = { id: 5, mass: 200, isPlayerCell: false };
step();
check('own cell id reused by an enemy cell is dropped', win.playerCellsId[5] === undefined);
delete LM.indexedCells[5];

/* the core's death and close lines call the timer's reset (it used to call a function that
 * did not exist); run those exact lines with merge timers off, where the timer does not tick */
const lines = core.split(/\r?\n/).filter(l => /MergeTimerController\.reset/.test(l)).map(l => l.trim());
check('death and close each reset the merge timer (' + lines.length + ' lines)', lines.length === 2);
win.legendmod5.mergeTimer = false;
for (const line of lines) {
    win.playerCellsId[42] = { historyMass: [100], _mergeState: 'counting' };
    vm.runInContext(line, ctx);
    check('core line clears a dead cell: ' + line.slice(0, 50), win.playerCellsId[42] === undefined && !!win.playerCellsId[unitCell.id]);
}

/* reset forgets the last cell count: a respawn into 2 cells is not taken as a split of the old life */
win.legendmod5.mergeTimer = true;
setOwn([{ id: 70, mass: 100 }, { id: 71, mass: 100 }]); step();
setOwn([{ id: 70, mass: 100 }, { id: 71, mass: 100 }, { id: 72, mass: 100 }]);
win.MergeTimerController.reset();
setOwn([{ id: 80, mass: 100 }, { id: 81, mass: 100 }, { id: 82, mass: 100 }, { id: 83, mass: 100 }]); step();
check('first tick after reset arms no timer', !win.playerCellsId[80] || win.playerCellsId[80]._mergeState !== 'counting');

/* one merge countdown or the other: the core's drawPostCellOverlays (real code) draws no merge
 * rings while the seconds timer (mergeTimer) is on */
{
    const i = core.indexOf('        drawPostCellOverlays(fxCtx) {'), j = core.indexOf('        markSplitPrediction(owner) {', i);
    const body = core.slice(i, j).replace(/,\s*\/\*[^]*$/, '').replace(/\},\s*$/, '}');
    let rings = 0;
    const dctx = { window: { ExternalScripts: true }, LM: { play: true, playerCells: [{}, {}], playerCellsMulti: [] }, defaultmapsettings: { cursorTracking: true, mergeRings: true, mergeTimer: false }, spects: null };
    vm.createContext(dctx);
    const R = vm.runInContext('({' + body + '})', dctx);
    R.drawSplitVectorGuide = () => { }; R.markSplitPrediction = () => { }; R.drawMergeProgressRings = () => { rings++; };
    R.drawPostCellOverlays({});
    const withRings = rings;
    rings = 0; dctx.defaultmapsettings.mergeTimer = true;
    R.drawPostCellOverlays({});
    check('merge rings drawn with the merge timer off, none with it on', withRings === 1 && rings === 0);

    /* two multibox units with one cell each, unit 1 selected: the split guide gets only unit 1's
     * cell, the merge rings get each unit's cells apart (the list of every unit's cells made two
     * single cells look split) */
    const u = core.indexOf('function lmUnitCellsInto('), ue = core.indexOf('\n}', u) + 2;
    const LM2 = { play: false, playerCells: [], playerCellsMulti: [{ spectator: 1 }, { spectator: 2 }, { spectator: 2, removed: true }] };
    const d2 = { window: { ExternalScripts: true, multiboxPlayerEnabled: 1, legendmod: LM2 }, LM: LM2, defaultmapsettings: { cursorTracking: true, mergeRings: true, mergeTimer: false },
        spects: [{ number: 1 }, { number: 2 }] };
    vm.createContext(d2);
    vm.runInContext(u < 0 ? '' : core.slice(u, ue), d2);
    const R2 = vm.runInContext('({' + body + '})', d2);
    const guide = [], ringLists = [];
    R2.markSplitPrediction = () => { };
    R2.drawSplitVectorGuide = (c, cells) => { guide.push(cells.map((x) => x.spectator).join('+')); };
    R2.drawMergeProgressRings = (c, cells) => { ringLists.push(cells.map((x) => x.spectator).join('+')); };
    R2.drawPostCellOverlays({});
    check('multibox: the split guide gets the selected unit\'s own cells only', guide.join(',') === '1', guide.join(','));
    check('multibox: merge rings get each unit\'s own cells apart (one cell each: no split)', ringLists.join(',') === '1,2', ringLists.join(','));
}

console.log(fail ? fail + ' failed' : 'all merge timer checks passed');
process.exit(fail ? 1 : 0);
