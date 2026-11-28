/* Analytics checks: aggregation, coach scoring, heatmap binning, objective generation and a
 * recorded life, against ogario/modules/analytics.js loaded in a vm with stubs.
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
    legendmod5: { recordReplays: false },
    toastr: { info: m => toasts.push(['info', m]), success: m => toasts.push(['success', m]), warning: m => toasts.push(['warning', m]) },
    _lmHostOnly: u => String(u).replace(/^wss?:\/\//, '').split(/[:/?]/)[0],
    setInterval: f => { tickFn = f; return 1; }
};
ctx.window = ctx;
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);
const A = ctx.LMAnalytics, C = A.core;
/* LMAnalytics.sync checks the session again; older versions ran it from a 1 s timer */
if (!tickFn) tickFn = A.sync;

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-9);
const MIN = 60000, DAYMS = 86400000;
const G = o => C.sanitizeGame(Object.assign({ src: 'lm', t: clock, ms: 5 * MIN, peak: 1000, end: 800, srv: 'a.example', mode: 'FFA', map: 14142, n: 300, cov: 20, edge: 0.1 }, o));

/* ---------- every game is recorded: listening from the start, an old saved recordReplays false is ignored */
check('no switch: LMEvents listeners from the start, also with an old saved recordReplays false', ['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].every(n => LMEvents._has(n)));

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
    check('suggestion texts come from the language pack', C.text('sgFirst', ['1:35']) === i18n.t('modules.analytics.sgFirst', ['1:35']));
    ctx.LMi18n.setLang('el', { save: false });
    const el = C.text(t2[0][0], t2[0][1]);
    check('suggestions follow the language (Greek)', el === i18n.t('modules.analytics.sgFirst', t2[0][1], 'el') && el.indexOf('1:35') !== -1 && el !== i18n.t('modules.analytics.sgFirst', t2[0][1]));
    ctx.LMi18n.setLang('en', { save: false });
    const same = C.coachSuggestions(g, C.coachScores(g), rec);
    check('suggestions are deterministic', JSON.stringify(same) === JSON.stringify(tips));
}

/* ---------- objectives */
check('niceFloor keeps 2 digits, rounds down', C.niceFloor(3456) === 3400 && C.niceFloor(87) === 87 && C.niceFloor(0) === 0 && C.niceFloor(5.5) === 5);
{
    /* daily objectives are for experienced players in long sessions: targets from their own history */
    const T3 = d => JSON.stringify(d.map(g => g.type + g.target + (g.mass ? 'x' + g.mass : '')));
    const d0 = C.generateDaily([], '2026-11-25');
    check('fresh player: 3 games of 2,500+, survive 5 min, reach 5,000', T3(d0) === JSON.stringify(['big3x2500', 'survive5', 'mass5000']));
    const dp = C.generateDaily([G({ t: clock - DAYMS, peak: 900, ms: MIN })], '2026-11-25', { m: 20000, t: 20 * MIN });
    check('little history: from the all-time bests', T3(dp) === JSON.stringify(['big3x7000', 'survive12', 'mass14000']));
    /* strong player: 5 days of 10 games, peaks 8,000-17,800, 6-15 min alive, often 1st or 2nd */
    const hist = [];
    for (let i = 0; i < 50; i++) hist.push(G({ t: clock - (5 - Math.floor(i / 10)) * DAYMS - (10 - i % 10) * 20 * MIN, peak: 8000 + i * 200, ms: (6 + i % 10) * MIN, bestPos: i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 0 }));
    const d1 = C.generateDaily(hist, '2026-11-25'), d2 = C.generateDaily(hist, '2026-11-25');
    check('3 daily objectives, the session one first, ids carry the day', d1.length === 3 && d1[0].type === 'big' && d1.every(g => g.id.indexOf('2026-11-25:') === 0));
    check('same day, same objectives', JSON.stringify(d1) === JSON.stringify(d2));
    check('session: half the games per day (5), each above the median peak (12,000)', d1[0].target === 5 && d1[0].mass === 12000);
    const all = C.generateDaily(hist, 'x'), types = {};
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(k => C.generateDaily(hist, k).forEach(g => { types[g.type] = g.target; }));
    check('mass target = 1.25 x average peak, rounded down (16,000)', types.mass === 16000);
    check('mass target is a step up: under a quarter of the games reach it, some do', hist.filter(g => g.peak >= types.mass).length === 10);
    check('survive target = better quarter of lives (13 min)', types.survive === 13);
    check('playtime target = minutes alive per day (105)', types.playtime === 105);
    check('top target from the better quarter of places (1st)', types.top === 1);
    check('no beginner objectives (games, beat average) in the daily set', !('games' in types) && !('beatAvg' in types));
    check('different days rotate the other two', Object.keys(types).length === 5 && all.length === 3);
    /* weak numbers never give trivially easy objectives */
    const weak = [];
    for (let i = 0; i < 30; i++) weak.push(G({ t: clock - (10 - Math.floor(i / 3)) * DAYMS, peak: 500 + i * 20, ms: MIN + i * 1000, bestPos: 0 }));
    const wt = {};
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach(k => C.generateDaily(weak, k).forEach(g => { wt[g.type] = g.mass ? g.target + 'x' + g.mass : g.target; }));
    check('minimums: 3 x 2,500, 5,000 mass, 5 min, 30 min in total, no top', wt.big === '3x2500' && wt.mass === 5000 && wt.survive === 5 && wt.playtime === 30 && !('top' in wt));
    /* a long session today */
    const sess = [];
    for (let i = 0; i < 6; i++) sess.push(G({ t: clock + i, peak: i < 5 ? 13000 : 9000, ms: 20 * MIN }));
    const big = C.goalProgress(d1[0], sess, clock - 1000), big4 = C.goalProgress(d1[0], sess.slice(0, 4), clock - 1000);
    check('session progress counts the games above the mass', big.done && big.value === 5 && !big4.done && near(big4.frac, 0.8));
    const pt = C.goalProgress({ id: 'x', type: 'playtime', target: 105 }, sess, clock - 1000), pt5 = C.goalProgress({ id: 'x', type: 'playtime', target: 105 }, sess.slice(0, 5), clock - 1000);
    check('playtime adds up every life of the day', pt.done && pt.value === 120 && !pt5.done && pt5.value === 100);
    check('session objective: mass is required and kept', C.sanitizeGoal({ type: 'big', target: 5 }, false) === null && C.sanitizeGoal({ id: 'k:big', type: 'big', target: 5, mass: 12000 }, false).mass === 12000);
    check('texts', C.goalText(d1[0]) === 'Reach 12,000 mass in 5 games' && C.goalText({ type: 'playtime', target: 105 }) === 'Stay alive 105 min in total');
    store.set('lmPersonalBests', JSON.stringify({ m: 20000, t: 20 * MIN }));
    const stp = { day: '', daily: [], custom: [], done: {} };
    C.ensureDaily(stp, [], clock);
    check('a new day reads the all-time bests', stp.daily[2].type === 'mass' && stp.daily[2].target === 14000);
    store.delete('lmPersonalBests');
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

/* ---------- practice / replay lives and a life cut by a server change or disconnect (audit A16) */
{
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
  tickFn();
  store.clear();
}

/* ---------- a recorded life through the LMEvents hooks */
{
    tickFn();
    check('listeners there', ['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].every(n => LMEvents._has(n)));
    store.clear();
    toasts.length = 0;
    store.set('lmAnalyticsGoals', JSON.stringify({ v: 1, day: '', daily: [], custom: [{ id: 'c1', type: 'mass', target: 3000, since: clock - 1 }], done: {} }));
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
    check('objective toast for the completed own objective only (a 1 min game completes no daily one)', toasts.filter(t => t[0] === 'success').length === 1 && toasts.some(t => t[0] === 'success' && t[1].indexOf('Reach 3,000 mass in one game') !== -1));
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
    ctx.legendmod5.recordReplays = false;
    tickFn();
    check('no switch: an old recordReplays false keeps the listeners', ['spawn', 'massUpdate', 'split', 'leaderboard', 'death'].every(n => LMEvents._has(n)));
}

/* ---------- the heatmap records where you are (the core's lmMyPosition), not the camera centre */
{
    const v4 = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
    const fnSrc = head => { const i = v4.indexOf(head); if (i < 0) return ''; let d = 0, k = v4.indexOf('{', i); for (; k < v4.length; k++) { if (v4[k] === '{') d++; else if (v4[k] === '}' && --d === 0) break; } return v4.slice(i, k + 1); };
    vm.runInContext(fnSrc('function getActiveSpect(') + '\n' + fnSrc('function lmMyPosition() {') + '\nif (typeof lmMyPosition === "function") window.lmMyPosition = lmMyPosition;', ctx);
    const life = () => {
        LMEvents.emit('spawn', { time: clock });
        for (let i = 0; i < 12; i++) { clock += 250; LMEvents.emit('massUpdate', { mass: 400, cells: 1 }); }
        LMEvents.emit('death', { time: clock, mass: 400, msAlive: 3000 });
        const t = JSON.parse(store.get('lmAnalyticsTracks')).tracks;
        return C.decodeCells(t[t.length - 1].s)[0][0];
    };
    tickFn();
    /* the camera in the middle (between two multibox players), the main player at the left edge */
    ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: 0, playerY: 0, isLegendWorld: false, ws: 'wss://live.example:443', serverType: 'agario',
        play: true, playerCells: [{}], viewXTrue: -7071, viewYTrue: 0 };
    ctx.spects = [{ number: 1, player: false }, { number: 2, player: true, playerCellIDs: [5], playerX: 7000, playerY: 0 }];
    ctx.multiboxPlayerEnabled = null;
    check('main player controlled: its own cells at the left edge, not the camera in the middle', life() === 0);
    ctx.multiboxPlayerEnabled = 2;
    check('a multibox unit controlled: its cells at the right edge', life() === 63);
    ctx.spects[1].playerCellIDs = [];
    check('the controlled unit dead: the main player\'s position', life() === 0);
    ctx.legendmod.play = false; ctx.legendmod.playerCells = [];
    check('nothing of ours alive: the camera, as before', life() === 32);
    ctx.multiboxPlayerEnabled = null; delete ctx.spects;
}

/* ---------- every multibox unit life is a record with its slot (LMEvents playerDied, role 'unit') */
{
    const games = () => JSON.parse(store.get('lmAnalyticsGames')).games;
    check('listens to the players\' deaths (playerDied)', LMEvents._has('playerDied'));
    const n0 = games().length, t0 = toasts.length;
    clock += 60000;
    LMEvents.emit('playerDied', { slot: 3, source: 18, role: 'unit', active: true, living: 1, life: 2, reason: 'death', mass: 4200, msAlive: 95000, scope: 'unit', context: 'live' });
    const g = games()[games().length - 1];
    check('a unit life: one record with its slot, time alive and best mass', games().length === n0 + 1 && g.slot === 3 && g.ms === 95000 && g.peak === 4200 && g.src === 'lm', JSON.stringify(g));
    check('    ... its unmeasured numbers are 0 and it is no traced life (no Coach for it)', g.n === 0 && g.spl === 0 && g.end === 0 && !C.traced(g) && !toasts.slice(t0).some(t => t[1].indexOf('Coach: ') !== -1));
    LMEvents.emit('playerDied', { slot: 1, role: 'main', active: true, mass: 900, msAlive: 9000, scope: 'all', context: 'live' });
    check('the main player\'s playerDied adds nothing (its life is the spawn ... death record)', games().length === n0 + 1);
    LMEvents.emit('playerDied', { slot: 2, role: 'unit', active: false, mass: 3000, msAlive: 20000, scope: 'unit', context: 'practice' });
    check('a practice life of a unit: nothing', games().length === n0 + 1);
    LMEvents.emit('playerDied', { slot: 2, role: 'unit', active: false, mass: 3000, msAlive: 20000, scope: 'unit', context: 'live' });
    check('a background unit life is recorded too (slot 2)', games().length === n0 + 2 && games()[games().length - 1].slot === 2);
    check('slot only 2-6: junk is dropped', C.sanitizeGame({ t: clock, slot: 9 }).slot === undefined && C.sanitizeGame({ t: clock, slot: 1 }).slot === undefined && C.sanitizeGame({ t: clock, slot: '4' }).slot === 4);
    /* the match history (also P2-P6 lives, with slot) merged in: the same life only for the same player */
    const mh = C.fromMatchHistory(JSON.stringify([{ t: g.t + 500, mass: 4200, ms: 95000, slot: 3 }, { t: g.t + 800, mass: 700, ms: 4000 }]));
    const merged = C.mergeGames([g], mh);
    check('match history: its slot is read, a record of the same unit life is not counted twice, the main player\'s death at that moment is',
        mh[0].slot === 3 && merged.length === 2 && merged.filter(x => x.slot === 3).length === 1 && merged.some(x => x.src === 'mh' && !x.slot));
}

console.log(fail ? fail + ' failed' : 'all analytics checks passed');
process.exit(fail ? 1 : 0);
