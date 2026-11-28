/* Analytics checks: aggregation, heatmap binning and a recorded life (no Coach or objective toast,
 * nothing stored for them), against ogario/modules/analytics.js loaded in a vm with stubs.
 * node developers/tests/analytics.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'analytics.js'), 'utf8');

const RealDate = Date;
let clock = new RealDate(2026, 10, 25, 12, 0, 0).getTime(); // Wednesday 25 Nov 2026, 12:00 local
function FakeDate(...a) { return a.length ? new RealDate(...a) : new RealDate(clock); }
FakeDate.now = () => clock;
FakeDate.prototype = RealDate.prototype;

const store = new Map();
const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: k => { store.delete(k); }
};
const L = {};
const LMEvents = {
    on(n, f) { (L[n] = L[n] || []).push(f); return this; },
    off(n, f) { L[n] = (L[n] || []).filter(x => x !== f); return this; },
    _has(n) { return !!(L[n] && L[n].length); },
    emit(n, d) { (L[n] || []).slice().forEach(f => f(Object.freeze(d))); }
};
const toasts = [];
let tickFn = null;
const ctx = {
    Date: FakeDate, Math, JSON, Number, String, Array, Object, isFinite, Infinity, console,
    localStorage, LMEvents,
    legendmod5: { analytics: false },
    toastr: { info: m => toasts.push(['info', m]), success: m => toasts.push(['success', m]), warning: m => toasts.push(['warning', m]) },
    _lmHostOnly: u => String(u).replace(/^wss?:\/\//, '').split(/[:/?]/)[0],
    setInterval: f => { tickFn = f; return 1; }
};
ctx.window = ctx;
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);
const A = ctx.LMAnalytics, C = A.core;
/* the option is applied by LMAnalytics.sync (settingsChange, the Match history link); older
 * versions ran it from a 1 s timer */
if (!tickFn) tickFn = A.sync;

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-9);
const MIN = 60000, DAYMS = 86400000;
const G = o => C.sanitizeGame(Object.assign({ src: 'lm', t: clock, ms: 5 * MIN, peak: 1000, end: 800, srv: 'a.example', mode: 'FFA', map: 14142, n: 300, cov: 20, edge: 0.1 }, o));

/* ---------- off by default: no listeners */
check('recording off: no LMEvents listeners', !['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].some(n => LMEvents._has(n)));

/* ---------- positions and heatmap binning */
check('encode corners', C.encodeCell(0, 0) === 'AA' && C.encodeCell(1, 1) === '__' && C.encodeCell(-3, 7) === 'A_');
check('decode round trip', JSON.stringify(C.decodeCells(C.encodeCell(0.5, 0.25) + C.encodeCell(0.99, 0))) === JSON.stringify([[32, 16], [63, 0]]));
check('decode skips bad characters', C.decodeCells('AA**BB').length === 2);
{
    const p = C.encodeCell(0, 0) + C.encodeCell(0.01, 0.01) + C.encodeCell(1, 1);
    const tracks = [{ p: p, s: C.encodeCell(0.5, 0.5), d: C.encodeCell(1, 1) }, { p: C.encodeCell(0, 0), s: C.encodeCell(0.5, 0.5), d: '' }];
    const h = C.binHeat(tracks, 'move', 32);
    check('move bins: res and total', h.res === 32 && h.cells.length === 1024 && h.total === 4);
    check('move bins: corner cell counts 3, far corner 1', h.cells[0] === 3 && h.cells[1023] === 1 && h.max === 3);
    const d = C.binHeat(tracks, 'death', 16), s = C.binHeat(tracks, 'spawn', 16);
    check('death layer: one point in the last cell', d.total === 1 && d.cells[255] === 1);
    check('spawn layer: two points in the centre cell', s.total === 2 && s.cells[8 * 16 + 8] === 2);
}
{
    const sq = C.trackFacts(C.decodeCells(C.encodeCell(0.01, 0.5) + C.encodeCell(0.5, 0.5) + C.encodeCell(0.5, 0.99) + C.encodeCell(0.52, 0.52)), 's');
    check('square map: 2 of 4 samples near the edge, 3 grid cells', near(sq.edge, 0.5) && sq.cov === 3 && sq.n === 4);
    const ci = C.trackFacts(C.decodeCells(C.encodeCell(0.1, 0.1) + C.encodeCell(0.5, 0.06)), 'c');
    check('round map: corner and top both near the rim', near(ci.edge, 1));
    const ci2 = C.trackFacts(C.decodeCells(C.encodeCell(0.3, 0.5)), 'c');
    check('round map: inside is not edge', ci2.edge === 0);
}

/* ---------- records: validation, schema, old match history */
check('sanitize rejects junk', C.sanitizeGame(null) === null && C.sanitizeGame([]) === null && C.sanitizeGame({ t: 'x' }) === null);
{
    const g = C.sanitizeGame({ t: clock, ms: -5, peak: 1e12, end: 5e9, splLoss: 4, spl: 2, splBad: 9, srv: 'x'.repeat(200), first: 1e9 });
    check('sanitize clamps', g.v === 1 && g.ms === 0 && g.peak === 1e9 && g.end === 1e9 && g.splLoss === 1 && g.splBad === 2 && g.srv.length === 80 && g.first === 0);
}
/* stores of another schema version are read too (migration), but every entry still goes through sanitizeGame */
check('store with another schema: valid entries kept, junk dropped', C.parseStore(JSON.stringify({ v: 2, games: [{ t: clock, ms: 1000, peak: 50 }, { t: 'x' }, null] }), 'games', C.sanitizeGame, 10).length === 1);
check('broken JSON reads empty', C.parseStore('{oops', 'games', C.sanitizeGame, 10).length === 0);
check('store is capped and sorted', (() => {
    const r = C.parseStore(JSON.stringify({ v: 1, games: [{ t: 30 }, { t: 10 }, { t: 20 }, 5, { t: 40 }] }), 'games', C.sanitizeGame, 3);
    return r.length === 3 && r[0].t === 20 && r[2].t === 40;
})());
check('track validation', C.sanitizeTrack({ t: 1, p: 'AAB' }) === null && C.sanitizeTrack({ t: 1, p: 'A<' }) === null && C.sanitizeTrack({ t: 1, p: 'AABB', s: 'zz', d: 'bad!' }).d === '');
{
    const mh = JSON.stringify([{ t: clock - 10000, mass: 500, ms: 60000, killer: null, server: 'b.example', mode: 'Teams' }, 'junk', { t: clock - 500000, mass: 300, ms: 30000 }]);
    const legacy = C.fromMatchHistory(mh);
    check('old match history is read as schema 1', legacy.length === 2 && legacy[0].src === 'mh' && legacy[0].peak === 500 && legacy[0].srv === 'b.example' && legacy[0].v === 1);
    const merged = C.mergeGames([G({ t: clock - 9000 })], legacy);
    check('same life in both lists counts once', merged.length === 2 && merged[0].src === 'mh' && merged[1].src === 'lm');
}

/* ---------- dashboard aggregation */
{
    const ws = C.weekStart(clock);
    const wd = new RealDate(ws);
    check('week starts on Monday 00:00', wd.getDay() === 1 && wd.getHours() === 0 && ws <= clock && clock - ws < 7 * DAYMS);
    const games = [
        G({ t: ws - 3 * DAYMS, peak: 2000, ms: 10 * MIN, lastPos: 3, bestPos: 1, first: 60000, srv: 'a.example' }),
        G({ t: ws - 2 * DAYMS, peak: 1000, ms: 5 * MIN, lastPos: 0, bestPos: 0, srv: 'a.example' }),
        G({ t: ws + 1000, peak: 4000, ms: 10 * MIN, lastPos: 8, bestPos: 2, first: 30000, srv: 'b.example', mode: 'Teams' }),
        G({ t: ws + 2000, peak: 2000, ms: 5 * MIN, lastPos: 12, bestPos: 9, srv: 'b.example', mode: 'Teams' }),
        C.sanitizeGame({ src: 'mh', t: ws - 20 * DAYMS, peak: 1000, ms: 5000, srv: 'c.example' })
    ];
    const a = C.aggregate(games, clock, 9000);
    check('games, highest (personal best counts)', a.games === 5 && a.highest === 9000);
    check('longest life: of the stored games without a personal best, else the personal best', a.longest === 10 * MIN && C.aggregate(games, clock, 0, 25 * MIN).longest === 25 * MIN);
    check('average peak and survival', a.avgPeak === 2000 && a.avgMs === Math.round((30 * MIN + 5000) / 5));
    check('top-10 finish share over recorded games only', near(a.top10, 0.5));
    check('mass per minute = sum of peaks / sum of minutes (lives of 10 s+)', a.perMin === Math.round(9000 / 30));
    check('time in 1st adds up', a.firstMs === 90000);
    check('no best servers list (agar.io hosts change with almost every join)', !('servers' in a));
    check('best modes', a.modes[0].name === 'Teams' && a.modes[0].n === 2);
    check('8 weeks, oldest first, this week last', a.weeks.length === 8 && a.weeks[7].start === ws && a.weeks[7].n === 2 && a.weeks[7].avgPeak === 3000 && a.weeks[6].n === 2 && a.weeks[6].avgPeak === 1500);
    check('week buckets are consecutive Mondays', a.weeks.every((w, i) => i === 0 || (w.start > a.weeks[i - 1].start && new RealDate(w.start).getDay() === 1)));
    check('this week vs last week', a.thisWeek.games === 2 && a.lastWeek.games === 2 && a.thisWeek.avgPeak === 3000 && a.lastWeek.avgPeak === 1500 && near(a.thisWeek.top10, 0.5) && near(a.lastWeek.top10, 0.5));
    const e = C.aggregate([], clock, 0);
    check('no games: zeros, no top-10 value', e.games === 0 && e.highest === 0 && e.longest === 0 && e.top10 === null && e.weeks.length === 8);
}

/* ---------- practice / replay lives and a life cut by a server change or disconnect (audit A16) */
{
  ctx.legendmod5.analytics = true;
  tickFn();
  ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: 0, playerY: 0, isLegendWorld: false, ws: 'wss://a.example:443', serverType: 'agario' };
  const games = () => { const g = store.get('lmAnalyticsGames'); return g ? JSON.parse(g).games : []; };
  store.clear();
  ['practice', 'replay'].forEach(cx => {
    LMEvents.emit('spawn', { time: clock, context: cx });
    for (let i = 0; i < 20; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 800, cells: 1, context: cx }); }
    LMEvents.emit('death', { time: clock, mass: 800, msAlive: 5000, context: cx });
  });
  check('practice and replay lives are not stored', games().length === 0);
  /* a life on server a, then the player joins server b: the unfinished life is dropped */
  LMEvents.emit('spawn', { time: clock, context: 'live' });
  for (let i = 0; i < 40; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 900, cells: 1, context: 'live' }); }
  ctx.legendmod.ws = 'wss://b.example:443';
  LMEvents.emit('serverChange', { host: 'b.example', context: 'live' });
  const tB = clock;
  LMEvents.emit('spawn', { time: clock, context: 'live' });
  for (let i = 0; i < 8; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 300, cells: 1, context: 'live' }); }
  LMEvents.emit('death', { time: clock, mass: 300, msAlive: clock - tB, context: 'live' });
  const g1 = games();
  check('server change: the old unfinished life is not merged into the next', g1.length === 1 && g1[0].srv === 'b.example' && g1[0].peak === 300);
  /* disconnected mid-life: the next event of the life drops it, a late death records nothing */
  store.clear();
  ctx.legendmod.isSocketOpen = () => true;
  LMEvents.emit('spawn', { time: clock, context: 'live' });
  for (let i = 0; i < 8; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 600, cells: 1, context: 'live' }); }
  tickFn();
  ctx.legendmod.isSocketOpen = () => false;
  tickFn();
  LMEvents.emit('death', { time: clock, mass: 600, msAlive: 2000, context: 'live' });
  check('disconnect: the unfinished life is dropped', games().length === 0);
  ctx.legendmod5.analytics = false;
  tickFn();
  store.clear();
}

/* ---------- a recorded life through the LMEvents hooks */
{
    ctx.legendmod5.analytics = true;
    tickFn();
    check('recording on: listeners added', ['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].every(n => LMEvents._has(n)));
    store.clear();
    toasts.length = 0;
    ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: -7071, playerY: 0, isLegendWorld: false, ws: 'wss://live.example:443/?token=secret', serverType: 'agario' };
    const t0 = clock;
    LMEvents.emit('spawn', { time: clock });
    let mass = 100;
    for (let i = 0; i < 240; i++) { // 60 s at 4 updates per second, moving right along the middle
        clock += 250;
        mass += 20;
        ctx.legendmod.playerX = -7071 + i * 50;
        if (i === 100) { LMEvents.emit('split', { time: clock, count: 1 }); LMEvents.emit('split', { time: clock + 10, count: 1 }); }
        if (i > 100 && i < 110) mass = Math.min(mass, 1000); // lost a lot right after the split
        if (i === 104) mass = 1000;
        if (i % 4 === 0) LMEvents.emit('leaderboard', { position: i >= 160 && i < 200 ? 1 : 5, entries: [] });
        LMEvents.emit('massUpdate', { mass: mass, cells: 1 });
    }
    clock += 250;
    LMEvents.emit('death', { time: clock, mass: 0, msAlive: clock - t0 });
    const games = JSON.parse(store.get('lmAnalyticsGames')).games;
    const tracks = JSON.parse(store.get('lmAnalyticsTracks')).tracks;
    const g = games[0];
    check('one game stored with schema 1', games.length === 1 && g.v === 1 && g.src === 'lm');
    check('time alive and peak', g.ms === 60250 && g.peak === Math.max(...[2120, 1000 + 20 * 130]));
    check('server host only, no token', g.srv === 'live.example' && g.st === 'agario');
    check('grouped splits: one split', g.spl === 1);
    check('split loss measured within 5 s', g.splBad === 1 && g.splLoss > 0.4 && g.splLoss < 0.6);
    check('best and last place, time in 1st', g.bestPos === 1 && g.lastPos === 5 && g.first >= 9000 && g.first <= 11000);
    check('position samples once a second', g.n >= 59 && g.n <= 61 && tracks.length === 1 && tracks[0].p.length === g.n * 2);
    check('spawn at the left edge, death further right', C.decodeCells(tracks[0].s)[0][0] === 0 && C.decodeCells(tracks[0].d)[0][0] > 40 && tracks[0].shape === 's' && tracks[0].map === 14142);
    check('end mass is the last update', g.end === mass);
    check('no Coach or objective toast after the game', toasts.length === 0);
    check('no objectives stored', store.get('lmAnalyticsGoals') == null);
    check('no Coach or objective helpers left', !C.coachScores && !C.generateDaily && !C.goalProgress);
    store.set('lmAnalyticsTracks', '{"v":1,"tracks":[{"t":1,"p":"<script>"}]}');
    check('tampered track store reads empty', C.parseStore(store.get('lmAnalyticsTracks'), 'tracks', C.sanitizeTrack, 50).length === 0);
    /* a second life: split, then eaten 2 s later -> that split lost everything */
    LMEvents.emit('spawn', { time: clock });
    for (let i = 0; i < 20; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 500, cells: 1 }); }
    LMEvents.emit('split', { time: clock, count: 1 });
    clock += 2000;
    LMEvents.emit('death', { time: clock, mass: 500, msAlive: 7000 });
    const g2 = JSON.parse(store.get('lmAnalyticsGames')).games.pop();
    check('dying within 5 s of a split counts as a full loss', g2.spl === 1 && g2.splBad === 1 && g2.splLoss === 1);
    check('the broken track store was replaced by a valid one', JSON.parse(store.get('lmAnalyticsTracks')).tracks.length === 1);
    ctx.legendmod5.analytics = false;
    tickFn();
    check('recording off again: listeners removed', !['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].some(n => LMEvents._has(n)));
}

console.log(fail ? fail + ' failed' : 'all analytics checks passed');
process.exit(fail ? 1 : 0);
