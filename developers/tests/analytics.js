/* Analytics checks: aggregation, coach scoring, heatmap binning, objective generation and a
 * recorded life, against ogario/modules/analytics.js loaded in a vm with stubs.
 * node developers/tests/analytics.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
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
vm.runInContext(src, ctx);
const A = ctx.LMAnalytics, C = A.core;

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
check('store with another schema reads empty', C.parseStore(JSON.stringify({ v: 2, games: [{ t: clock }] }), 'games', C.sanitizeGame, 10).length === 0);
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
    check('average peak and survival', a.avgPeak === 2000 && a.avgMs === Math.round((30 * MIN + 5000) / 5));
    check('top-10 finish share over recorded games only', near(a.top10, 0.5));
    check('mass per minute = sum of peaks / sum of minutes (lives of 10 s+)', a.perMin === Math.round(9000 / 30));
    check('time in 1st adds up', a.firstMs === 90000);
    check('best servers: b first, single-game server left out', a.servers.length === 2 && a.servers[0].name === 'b.example' && a.servers[0].avgPeak === 3000 && a.servers[1].n === 2);
    check('best modes', a.modes[0].name === 'Teams' && a.modes[0].n === 2);
    check('8 weeks, oldest first, this week last', a.weeks.length === 8 && a.weeks[7].start === ws && a.weeks[7].n === 2 && a.weeks[7].avgPeak === 3000 && a.weeks[6].n === 2 && a.weeks[6].avgPeak === 1500);
    check('week buckets are consecutive Mondays', a.weeks.every((w, i) => i === 0 || (w.start > a.weeks[i - 1].start && new RealDate(w.start).getDay() === 1)));
    check('this week vs last week', a.thisWeek.games === 2 && a.lastWeek.games === 2 && a.thisWeek.avgPeak === 3000 && a.lastWeek.avgPeak === 1500 && near(a.thisWeek.top10, 0.5) && near(a.lastWeek.top10, 0.5));
    const e = C.aggregate([], clock, 0);
    check('no games: zeros, no top-10 value', e.games === 0 && e.highest === 0 && e.top10 === null && e.weeks.length === 8);
}

/* ---------- coach */
{
    const s = C.coachScores(G({ ms: 5 * MIN, peak: 2500, end: 1250, spl: 4, splLoss: 0.25, cov: 18, edge: 0.1, n: 300 }));
    check('survival 5 min = 63', s.survival === 63);
    check('growth 500/min = 52', s.rate === 500 && s.growth === 52);
    check('splits 25 % average loss = 50', s.splits === 50);
    /* coverage 18 / min(24, 3 + 15) = 1; edge 0.1 / 0.5 = 0.2 -> 100 * (0.6 + 0.4 * 0.8) = 92 */
    check('movement = 92', s.movement === 92);
    check('retention = 50', s.retention === 50);
    check('overall = average of the parts', s.overall === Math.round((63 + 52 + 50 + 92 + 50) / 5));
    const n = C.coachScores(G({ spl: 0, n: 2 }));
    check('no splits / few samples: null parts', n.splits === null && n.movement === null);
    const m = C.coachScores(C.sanitizeGame({ src: 'mh', t: clock, ms: 10 * MIN, peak: 50000 }));
    check('old match history game: survival and growth only', m.splits === null && m.movement === null && m.retention === null && m.survival === 86 && m.growth === 100);
    check('very short life: growth uses at least 30 s', C.coachScores(G({ ms: 1000, peak: 25 })).rate === 50);
}
{
    const prev = [];
    for (let i = 0; i < 12; i++) prev.push(G({ t: clock - (20 - i) * MIN, ms: 10 * MIN, peak: 5000 }));
    const g = G({ ms: 2 * MIN, peak: 1000, end: 300, loss20: 0.42, spl: 3, splBad: 2, splLoss: 0.4, n: 200, edge: 0.5, cov: 3 });
    const games = prev.concat([g]);
    const rec = C.recentAverages(games, games.length - 1);
    check('recent average: last 10 games before this one', rec.n === 10 && rec.ms === 10 * MIN && rec.survival === 86);
    const tips = C.coachSuggestions(g, C.coachScores(g), rec);
    check('2-4 suggestions', tips.length >= 2 && tips.length <= 4);
    check('final 20 s loss comes first with its number', tips[0][0] === 'sgFinal' && C.text(tips[0][0], tips[0][1]).indexOf('42%') !== -1);
    check('split rule names the splits', tips.some(t => t[0] === 'sgSplits' && C.text(t[0], t[1]).indexOf('2 of your 3 splits') === 0));
    check('at most 3 problems', tips.filter(t => /^sg(Final|Splits|Edge|Coverage|Short|Growth|Retention)$/.test(t[0])).length <= 3);
    const good = G({ ms: 12 * MIN, peak: 20000, end: 20000, first: 95000, n: 700, cov: 24, edge: 0.05, spl: 0 });
    const t2 = C.coachSuggestions(good, C.coachScores(good), { n: 0 });
    check('good game: praise for 1st place plus a tip (2 lines)', t2.length === 2 && t2[0][0] === 'sgFirst' && C.text(t2[0][0], t2[0][1]).indexOf('1:35') !== -1 && /^sgTip/.test(t2[1][0]));
    const same = C.coachSuggestions(g, C.coachScores(g), rec);
    check('suggestions are deterministic', JSON.stringify(same) === JSON.stringify(tips));
}

/* ---------- objectives */
check('niceFloor keeps 2 digits, rounds down', C.niceFloor(3456) === 3400 && C.niceFloor(87) === 87 && C.niceFloor(0) === 0 && C.niceFloor(5.5) === 5);
{
    const d0 = C.generateDaily([], '2026-11-25');
    check('no history: play 3, survive 2 min, reach 500', JSON.stringify(d0.map(g => g.type + g.target)) === JSON.stringify(['games3', 'survive2', 'mass500']));
    const hist = [];
    for (let i = 0; i < 30; i++) hist.push(G({ t: clock - (30 - i) * DAYMS / 3, peak: 1000 + i * 100, ms: (2 + (i % 6)) * MIN, bestPos: i % 2 ? 4 : 0 }));
    const d1 = C.generateDaily(hist, '2026-11-25'), d2 = C.generateDaily(hist, '2026-11-25');
    check('3 daily objectives, games first, ids carry the day', d1.length === 3 && d1[0].type === 'games' && d1.every(g => g.id.indexOf('2026-11-25:') === 0));
    check('same day, same objectives', JSON.stringify(d1) === JSON.stringify(d2));
    check('games target = median games per day (3)', d1[0].target === 3);
    const all = C.generateDaily(hist, 'x'), types = {};
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(k => C.generateDaily(hist, k).forEach(g => { types[g.type] = g.target; }));
    check('mass target = median peak rounded down (2400)', types.mass === 2400);
    check('mass target is reached by at least half the games', hist.filter(g => g.peak >= types.mass).length >= 15);
    check('survive target = median minutes (4)', types.survive === 4);
    check('top target from the leaderboard history (5)', types.top === 5);
    check('beat average = average peak (2450)', types.beatAvg === 2450);
    check('different days rotate the other two', Object.keys(types).length === 5 && all.length === 3);
    const from = clock - 1000;
    const today = [G({ t: clock, peak: 3000, ms: 6.5 * MIN, bestPos: 4 }), G({ t: clock + 1, peak: 1000, ms: MIN, bestPos: 0 })];
    const P = (type, target) => C.goalProgress({ id: 'x', type, target }, today, from);
    check('progress: mass', P('mass', 3000).done && near(P('mass', 6000).frac, 0.5));
    check('progress: survive (minutes, one decimal)', P('survive', 6).done && P('survive', 6).value === 6.5 && !P('survive', 7).done);
    check('progress: top', P('top', 5).done && !P('top', 3).done && P('top', 3).value === 4);
    check('progress: games', P('games', 2).done && near(P('games', 4).frac, 0.5));
    check('progress: beat average needs more than the average', !P('beatAvg', 3000).done && P('beatAvg', 3000).frac < 1 && P('beatAvg', 2999).done);
    check('progress counts only games since the start', C.goalProgress({ id: 'x', type: 'games', target: 1 }, today, clock + 5).value === 0);
    check('custom objective validation', C.sanitizeGoal({ type: 'nope', target: 1 }, true) === null && C.sanitizeGoal({ type: 'survive', target: 9999 }, true).target === 360 && C.sanitizeGoal({ type: 'mass', target: 0 }, true) === null);
    const st1 = { day: '', daily: [], custom: [], done: { 'old:games': 1 } }, st2 = { day: '', daily: [], custom: [], done: {} };
    C.ensureDaily(st1, hist, clock);
    C.ensureDaily(st2, hist.concat([G({ t: clock, peak: 99999, ms: 60 * MIN })]), clock);
    check('daily objectives ignore games of the same day', JSON.stringify(st1.daily) === JSON.stringify(st2.daily));
    st1.daily = [{ id: 'old:games', type: 'games', target: 1 }];
    st1.day = '2020-01-01';
    check('a new day replaces them and forgets old marks', C.ensureDaily(st1, hist, clock) && !st1.done['old:games'] && st1.day === C.dayKey(clock));
    check('same day: kept', !C.ensureDaily(st1, hist, clock));
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
    check('coach toast after the game', toasts.some(t => t[0] === 'info' && t[1].indexOf('Coach: ') !== -1));
    check('objective toast for the completed objective only', toasts.filter(t => t[0] === 'success').length === 1 && toasts.some(t => t[0] === 'success' && t[1].indexOf('Reach 500 mass') !== -1));
    const goals = JSON.parse(store.get('lmAnalyticsGoals'));
    check('daily objectives stored for today', goals.v === 1 && goals.day === C.dayKey(clock) && goals.daily.length === 3);
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
