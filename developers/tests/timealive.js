/* Time alive (Settings > Stats "Time alive"): from the first own cell to the moment none is left,
 * with the real code cut out of ogario/ogario.v4.js: lmTimeAlive, the stats line (displayStats,
 * _lmAliveText), removeCell's own-cell block, the connection flush, onPlayerSpawn's reset line and
 * onPlayerDeath (what the session line, personal bests, match history and the death event record).
 * Spawn -> starts at the first own cell, split / merge -> goes on, death -> stops and keeps its value,
 * respawn -> starts from 0, server change -> 0, spectating / menu -> nothing shown; multibox: the
 * controlled unit's own time.
 * node developers/tests/timealive.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const v4 = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
function block(start, from) {
    const i = v4.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = v4.indexOf('{', i); k < v4.length; k++) {
        if (v4[k] === '{') d++;
        else if (v4[k] === '}' && !--d) return v4.slice(i, k + 1);
    }
    return null;
}
const noop = () => { };
const src = {
    fn: block('function lmTimeAlive(p, n, now) {'),
    text: block('        _lmAliveText(p, n) {'),
    stats: block('        displayStats() {'),
    remove: block("if (lmIdxRemove(LM.playerCells, this, '_playerIdx')) {"),
    flush: block('if (_connectionLevelFlush && this === window.legendmod) {'),
    spawn: (v4.match(/\n\s*(if \(window\.legendmod && legendmod\._lmAliveEnd\) lmTimeAlive\(legendmod, -1\);)/) || [])[1],
    death: block('        onPlayerDeath() {')
};
const missing = Object.keys(src).filter((k) => !src[k]);
if (missing.length) { console.log('FAIL code not found: ' + missing.join(', ')); process.exit(1); }
/* each parser's own-cell add is followed by lmTimeAlive(<parser>, <parser>.playerCells.length) */
const adds = (v4.match(/indexedPush\((this|self)\.playerCells, \w+, '_playerIdx'\);\n\s*lmTimeAlive\(\1, \1\.playerCells\.length\);/g) || []).length;
const allAdds = (v4.match(/indexedPush\((this|self)\.playerCells, /g) || []).length;
check('every own-cell add (' + allAdds + ' parsers) starts the time alive', adds === allAdds && allAdds >= 4, adds + '/' + allAdds);

let T = 1000000;
const ctx = { Math, JSON, Object, Array, String, Number, console: { log: noop, warn: noop } };
ctx.Date = { now: () => T };
ctx.window = ctx;
const LM = { playerCells: [], playerCellIDs: [], play: false, playerScore: 0 };
ctx.legendmod = ctx.LM = ctx.ogario = LM;
ctx.spects = [];
ctx.getActiveSpect = (n) => ctx.spects.find((s) => s && s.number === n);
ctx.defaultmapsettings = { showStats: true, showStatsAlive: true };
ctx.drawRender = {};
ctx.Languageletter49 = 'Mass'; ctx.Languageletter366 = 'Score';
ctx.lmT = (k) => k;
ctx.$ = () => ({ hide: noop, show: noop, text: () => '', val: () => '' });
ctx.lmIdxRemove = (arr, c) => { const i = arr.indexOf(c); if (i < 0) return false; arr.splice(i, 1); return true; };
ctx.quickSwapDelete = (arr, i) => arr.splice(i, 1);
vm.createContext(ctx);
vm.runInContext(src.fn, ctx);
const app = vm.runInContext('({' + src.text + ',' + src.stats + '})', ctx);
app.statsHUD = { innerHTML: '' };
app._displayStatsInterval = 1;
const removeCell = vm.runInContext('(function () { ' + src.remove + ' })', ctx);
const flush = vm.runInContext('(function (_connectionLevelFlush) { ' + src.flush + ' })', ctx);
const spawnLine = vm.runInContext('(function () { ' + src.spawn + ' })', ctx);
const line = () => { app.displayStats(); return app.statsHUD.innerHTML; };
const shown = () => { const m = /⏱ (\d+):(\d\d)/.exec(line()); return m ? +m[1] * 60 + +m[2] : null; };
/* the parsers: the spawn packet (onPlayerSpawn), an own cell added, an own cell removed */
const spawn = () => { LM.play = true; spawnLine(); };
let nextId = 1;
const addOwn = () => { const c = { id: nextId++ }; LM.playerCellIDs.push(c.id); LM.playerCells.push(c); ctx.lmTimeAlive(LM, LM.playerCells.length); return c; };
const removeOwn = (c) => removeCell.call(c);

/* 1. before the first own cell, spectating and in the menu: nothing */
check('menu: no time alive shown', shown() === null);
spawn();
T += 3000;
check('spawn packet without an own cell yet: nothing shown, 0', shown() === null && ctx.lmTimeAlive(LM) === 0);
const c1 = addOwn();
T += 5000;
check('first own cell: counts from it (5 s, not 8 s)', shown() === 5, line());
/* 2. split and merge go on */
const c2 = addOwn(); const c3 = addOwn();
T += 10000;
removeOwn(c2); removeOwn(c3);
T += 2000;
check('split and merge: the life goes on (17 s)', shown() === 17, line());
/* 3. death: stops at the last own cell, the value stays for the death handling */
T += 1000;
removeOwn(c1);
const frozen = ctx.lmTimeAlive(LM);
LM.play = false;
T += 600;
check('death: stopped at the last own cell (18 s) and kept', frozen === 18000 && ctx.lmTimeAlive(LM) === 18000);
check('dead / spectating: nothing shown', shown() === null);
/* the real death handler, 600 ms later (Expanding Land's death animation) */
{
    const calls = {};
    const g = { Math, Date: ctx.Date, JSON, Object, Array, String, Number, console: { log: noop, warn: noop } };
    g.window = g; g.legendmod = LM;
    g.lmTimeAlive = ctx.lmTimeAlive;
    g.lmDeathScope = (u) => 'scope-of-' + u;
    g.LMEvents = { _has: () => true, emit: (n, e) => { calls[n] = e; } };
    g.defaultmapsettings = { matchHistory: true };
    g.ogario = { playerScore: 900, play: true };
    g._lmSessionStats = (u) => { calls.session = u.ms; };
    g._lmPersonalBests = (u) => { calls.best = u.ms; return {}; };
    g._lmMatchHistory = (r) => { calls.history = r.ms; };
    g.$ = () => ({ text: () => '', val: () => '' });
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: () => noop });
    vm.createContext(g);
    const h = vm.runInContext('with (__env) { ({' + src.death + '}) }', g);
    Object.assign(h, { sendPlayerDeath: noop, updateDeathLocations: noop, unlockButtons: noop, autoResp: noop });
    h.onPlayerDeath();
    check('death handling records the life (18 s, not 18.6 s): session, best, history, death event',
        calls.session === 18000 && calls.best === 18000 && calls.history === 18000 && calls.death && calls.death.msAlive === 18000, JSON.stringify(calls));
    check('death event: the main player (unit 0) with its scope', calls.death && calls.death.unit === 0 && calls.death.scope === 'scope-of-0', JSON.stringify(calls.death));
    /* the game-over packet before the last own cell is removed: the life ends at the handler */
    T += 1000;
    spawn(); const g1 = addOwn(); T += 4000;
    g.ogario.play = true; h._lmLastDeathAt = 0;
    h.onPlayerDeath();
    T += 500; removeOwn(g1);
    check('game-over packet first: the life ends there (4 s) and stays when the cell goes', calls.session === 4000 && ctx.lmTimeAlive(LM) === 4000, JSON.stringify(calls));
}
/* 4. respawn: from 0 at the next first own cell */
LM.play = false;
T += 2000;
spawn();
T += 700;
check('respawn, no own cell yet: the old life is gone (0, nothing shown)', ctx.lmTimeAlive(LM) === 0 && shown() === null);
const r1 = addOwn();
T += 2000;
check('respawn: counts from 0 (2 s)', shown() === 2, line());
/* 5. server change / lost connection: the connection flush forgets the life */
flush.call(LM, false);
check('a flush that keeps the connection (clear all) keeps the life', ctx.lmTimeAlive(LM) === 2000);
flush.call(LM, true);
LM.playerCells.length = 0; LM.playerCellIDs.length = 0; LM.play = false;
check('server change: 0, nothing shown', ctx.lmTimeAlive(LM) === 0 && shown() === null);
spawn(); T += 1500; addOwn(); T += 3000;
check('first life on the new server: from 0 (3 s)', shown() === 3, line());
/* 6. multibox: the controlled unit's own time (spect.js: active, playerCellIDs) */
const unit = { number: 1, active: false, playerCellIDs: [], playerMass: 10, playerScore: 10 };
ctx.spects.push(unit);
ctx.multiboxPlayerEnabled = 1;
line();
T += 1000;
check('unit not spawned: nothing shown', shown() === null);
unit.active = true; unit.playerCellIDs.push(77);
line();
T += 6000;
check('unit alive: its own time (6 s)', shown() === 6, line());
unit.active = false; unit.playerCellIDs = [];
line();
T += 3000;
check('unit dead: nothing shown, its value kept (6 s)', shown() === null && ctx.lmTimeAlive(unit) === 6000);
ctx.multiboxPlayerEnabled = 0;
check('back on the main player: its own time went on (13 s)', shown() === 13, line());

console.log(failed ? failed + ' FAILED' : 'all ok');
process.exit(failed ? 1 : 0);
