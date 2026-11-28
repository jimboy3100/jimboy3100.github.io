/* Time alive (Settings > Stats "Time alive"): from the first own cell to the moment none is left,
 * with the real code cut out of ogario/ogario.v4.js: lmTimeAlive, the stats line (displayStats,
 * _lmAliveText), removeCell's own-cell block, the connection flush, onPlayerSpawn's reset line and
 * onPlayerDeath (what the session line, personal bests, match history and the death event record).
 * Spawn -> starts at the first own cell, split / merge -> goes on, death -> stops and keeps its value,
 * respawn -> starts from 0, server change -> 0, spectating / menu -> nothing shown; multibox: the
 * controlled unit's own time, measured from its first own cell to its death (spect.js _lmAdoptOwn /
 * terminate) also with the stats line off, and each unit life counted as the main player's are
 * (lmMbUnitLifeEnd: session line, personal bests, match history with its slot while controlled;
 * LMEvents playerDied with its mass, time and scope before the focus moves on). The main player's
 * death keeps Pause and permanent feed while you steer a living unit (application._lmLifeInputEnd),
 * a unit's death ends them when it was the one you control.
 * node developers/tests/timealive.js [ogario.v4.js] [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const v4 = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const spx = fs.readFileSync(process.argv[3] || path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
function block(start, from, src) {
    src = src || v4;
    const i = src.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
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
    death: block('        onPlayerDeath() {'),
    inputEnd: block('        _lmLifeInputEnd('),
    lifeEnd: block('function lmMbUnitLifeEnd(sp, active, now) {'),
    session: block('function _lmSessionStats(update) {'),
    bests: block('function _lmPersonalBests(update) {'),
    history: block('function _lmMatchHistory(add) {'),
    hostOnly: block('function _lmHostOnly(u) {'),
    adopt: block('    _lmAdoptOwn(cell) {', 0, spx),
    terminate: block('    terminate(reason) {', 0, spx)
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
    g.lmMbPlayerEvent = (type, p, reason, extra) => { calls[type] = extra; };
    g.$ = () => ({ text: () => '', val: () => '', hide: noop });
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: () => noop });
    vm.createContext(g);
    const h = vm.runInContext('with (__env) { ({' + src.death + ',\n' + src.inputEnd + '}) }', g);
    Object.assign(h, { sendPlayerDeath: noop, updateDeathLocations: noop, unlockButtons: noop, autoResp: noop });
    h.pause = true; g.ogario.pause = true; h.feedIntervalPerm = 5;
    h.onPlayerDeath();
    check('main player controlled dies: Pause and permanent feed end with its life', h.pause === false && g.ogario.pause === false && h.feedIntervalPerm === null);
    check('LMEvents playerDied of the main player: its mass, time alive and scope',
        !!calls.playerDied && calls.playerDied.mass === 900 && calls.playerDied.msAlive === 18000 && calls.playerDied.scope === 'scope-of-0', JSON.stringify(calls.playerDied));
    check('death handling records the life (18 s, not 18.6 s): session, best, history, death event',
        calls.session === 18000 && calls.best === 18000 && calls.history === 18000 && calls.death && calls.death.msAlive === 18000, JSON.stringify(calls));
    check('death event: the main player (unit 0) with its scope', calls.death && calls.death.unit === 0 && calls.death.scope === 'scope-of-0', JSON.stringify(calls.death));
    /* the game-over packet before the last own cell is removed: the life ends at the handler */
    T += 1000;
    spawn(); const g1 = addOwn(); T += 4000;
    g.ogario.play = true; h._lmLastDeathAt = 0;
    /* ... while you steer a living multibox unit: its Pause and permanent feed go on */
    const steered = { number: 18, player: true, active: true };
    g.multiboxPlayerEnabled = 18;
    g.getActiveSpect = (n) => (n === 18 ? steered : null);
    g.lmMbAlive = (p) => !!p && p.player === true && p.active === true;
    h.pause = true; g.ogario.pause = true; h.feedIntervalPerm = 7;
    h.onPlayerDeath();
    T += 500; removeOwn(g1);
    check('game-over packet first: the life ends there (4 s) and stays when the cell goes', calls.session === 4000 && ctx.lmTimeAlive(LM) === 4000, JSON.stringify(calls));
    check('main player dies while you steer a living unit: Pause and permanent feed go on', h.pause === true && g.ogario.pause === true && h.feedIntervalPerm === 7);
    T += 1000;
    spawn(); const g2 = addOwn(); T += 1000;
    g.ogario.play = true; h._lmLastDeathAt = 0; steered.active = false;
    h.onPlayerDeath();
    removeOwn(g2);
    check('    ... the unit you steer is dead too: they end', h.pause === false && h.feedIntervalPerm === null);
    g.multiboxPlayerEnabled = null;
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
/* 6. multibox: the controlled unit's own time, with the real spect.js spawn (_lmAdoptOwn) and
 * death (terminate), and what its life records (lmMbUnitLifeEnd) */
const store = (m) => ({ getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } });
const ss = new Map(), ls = new Map(), ev = [], order = [];
Object.assign(ctx, {
    sessionStorage: store(ss), localStorage: store(ls), document: { getElementById: () => null }, URL,
    lmSpectIdx: () => ({ push: (a, c) => a.push(c), remove: (a, c) => { const i = a.indexOf(c); if (i >= 0) a.splice(i, 1); } }),
    profiles: [], lmUnitProfileIdx: () => 0, lmPreloadUnitSkin: noop, loadMultiCellSkin: noop,
    lmMbSlotOf: (p) => (p === LM ? 1 : p.slotId),
    lmDeathScope: () => 'unit',
    lmMbAlive: (p) => !!p && (p === LM ? !!LM.play : p.player === true && p.active === true),
    lmMbFallbackUnit: () => 0,
    lmSetMbUnit: (u) => { order.push('focus' + u); ctx.multiboxPlayerEnabled = +u || null; },
    lmMbPlayerEvent: (type, p, reason, extra) => { order.push(type); ev.push(Object.assign({ type, slot: p.slotId, active: ctx.multiboxPlayerEnabled === p.number }, extra || {})); },
    application: { showMenu: noop, _lmLifeInputEnd() { order.push('inputEnd'); } },
    LMEvents: { _has: () => true, emit: (n, d) => ev.push(Object.assign({ type: n }, d)) }
});
LM.playerCellsMulti = []; LM.gameMode = ':ffa'; LM.ws = 'wss://srv.example:443/x?token=1';
ctx.$ = (sel) => ({ hide: noop, show: noop, text: () => (sel === '#gamemode option:selected' ? 'FFA' : ''), val: () => '' });
vm.runInContext([src.session, src.bests, src.history, src.hostOnly, src.lifeEnd, 'function _lmMatchHistoryRefreshOpen() { }'].join('\n'), ctx);
const Unit = vm.runInContext('(class Unit { constructor(n, slot) { this.number = n; this.slotId = slot; this.slotEpoch = 1; this.player = true; this.active = null; this.connectionGeneration = 1; this.playerCellIDs = []; this.playerMass = 0; this.playerScore = 0; }\n' +
    'getOwnPlayerCells() { return this._lmOwn || (this._lmOwn = []); }\n_lmOwnsId() { return true; }\nsendCursor() { }\n' + src.adopt + '\n' + src.terminate + '\n})', ctx);
const unit = new Unit(18, 3);
ctx.spects.push(unit);
ctx.multiboxPlayerEnabled = 18;
ctx.defaultmapsettings.showStatsAlive = false; /* the stats line off: the time is measured anyway */
line();
T += 1000;
check('unit not spawned: nothing shown', shown() === null);
const uCell = () => ({ id: nextId++, spectator: 18, _lmGen: 1 });
unit._lmAdoptOwn(uCell());
T += 6000;
ctx.defaultmapsettings.showStatsAlive = true;
check('unit alive: its own time from its first own cell, also with the stats line off until then (6 s)', shown() === 6, line());
unit.playerScore = 900; unit.playerMass = 850;
ev.length = 0; order.length = 0;
/* a replay being recorded: the recording format has no marker type for a unit (its events are
 * the main player's d / s / k / v / p / f), so a unit's death adds none */
const recEv = [];
ctx._lmRecLive = true; ctx._lmRecEv = (t) => recEv.push(t);
unit.terminate();
ctx._lmRecLive = false;
check('replay recording: no event of the main player for a unit death (format unchanged)', recEv.length === 0, recEv.join());
T += 3000;
check('unit dead: the focus back on the main player (its time, 13 s), the value of the unit kept (6 s)', shown() === 13 && ctx.lmTimeAlive(unit) === 6000, line());
const died = ev.find((e) => e.type === 'playerDied');
check('LMEvents playerDied of the unit: its best mass and time alive, sent before the focus moves on (active)',
    !!died && died.mass === 900 && died.msAlive === 6000 && died.scope === 'unit' && died.active === true && order.indexOf('playerDied') < order.indexOf('focus0'), JSON.stringify(died) + ' ' + order.join());
const sess = JSON.parse(ss.get('lmSessionStats') || '{}'), best = JSON.parse(ls.get('lmPersonalBests') || '{}'), hist = JSON.parse(ls.get('lmMatchHistory') || '[]');
check('the unit\'s life counts: session line (1 game, best 900, 6 s) and personal bests', sess.g === 1 && sess.b === 900 && sess.t === 6000 && best.g === 1 && best.m === 900 && best.t === 6000, JSON.stringify([sess, best]));
check('the controlled unit\'s life in the match history with its slot (P3), server host only', hist.length === 1 && hist[0].slot === 3 && hist[0].mass === 900 && hist[0].ms === 6000 && hist[0].server === 'srv.example' && hist[0].mode === 'FFA' && hist[0].killer === null, JSON.stringify(hist));
check('the controlled unit died: its Pause, permanent feed and keys end (application._lmLifeInputEnd)', order.indexOf('inputEnd') !== -1, order.join());
ctx.multiboxPlayerEnabled = 0;
check('back on the main player: its own time went on (13 s)', shown() === 13, line());
/* a second terminate of the same life (a later packet): nothing counted twice */
unit.terminate();
check('a second terminate of that life records nothing more', JSON.parse(ss.get('lmSessionStats')).g === 1 && JSON.parse(ls.get('lmMatchHistory')).length === 1);
/* a background life (the main player controlled and alive): counted, no match history, the main player's Pause stays */
unit._lmAdoptOwn(uCell());
T += 4000;
unit.playerScore = 2000;
order.length = 0; ev.length = 0;
unit.terminate();
check('a new best mass of a unit life: LMEvents personalBest with its slot', ev.some((e) => e.type === 'personalBest' && e.slot === 3 && e.mass === 2000 && e.massRecord === true), JSON.stringify(ev));
check('background unit\'s life: counted (2 games, best 2000), no match history record, the main player\'s Pause and feed untouched',
    JSON.parse(ss.get('lmSessionStats')).g === 2 && JSON.parse(ss.get('lmSessionStats')).b === 2000 && JSON.parse(ls.get('lmMatchHistory')).length === 1 && order.indexOf('inputEnd') === -1, order.join());
check('    ... its new life measured from 0 (4 s)', ctx.lmTimeAlive(unit) === 4000);
/* a lost socket is no death: the time stops, nothing is recorded */
unit._lmAdoptOwn(uCell());
T += 2000;
ev.length = 0;
unit.terminate('disconnect');
check('lost socket: the time stops (2 s), no life recorded, no playerDied', ctx.lmTimeAlive(unit) === 2000 && JSON.parse(ss.get('lmSessionStats')).g === 2 && !ev.some((e) => e.type === 'playerDied'));
/* practice arena: no stats */
ctx.LMPractice = { on: true };
unit._lmAdoptOwn(uCell());
T += 1000;
unit.terminate();
check('practice arena: a unit life records nothing', JSON.parse(ss.get('lmSessionStats')).g === 2);
ctx.LMPractice = null;

console.log(failed ? failed + ' FAILED' : 'all ok');
process.exit(failed ? 1 : 0);
