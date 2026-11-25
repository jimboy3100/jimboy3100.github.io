/* Spectator director checks: runs ogario/modules/director.js in a vm. Part 1 uses only the pure
 * functions (no DOM: the module stops after defining them); part 2 boots it with a small stub page
 * (no panel is built) and drives the camera with a fake clock.
 * node developers/tests/director.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const T = (k, v, code) => i18n.t('modules.director.' + k, v, code);
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'director.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeStorage() {
  const data = {};
  return {
    data,
    getItem: k => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: k => { delete data[k]; }
  };
}

function bootPure() {
  const ctx = { Date, Math, Number, JSON, String, Array, Object, localStorage: makeStorage() };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.LMDirector;
}

const api = bootPure();
const P = api._pure;
const cell = (nick, color, x, y, size, extra) => Object.assign({ nick, color, x, y, size }, extra || {});
const sizeOf = m => Math.sqrt(m * 100);

/* 1. easing */
{
  let ok = true;
  for (const e of P.EASINGS) {
    if (P.ease(e, 0) !== 0 || P.ease(e, 1) !== 1 || P.ease(e, -1) !== 0 || P.ease(e, 2) !== 1) ok = false;
    let prev = 0;
    for (let t = 0.01; t < 1; t += 0.01) { const v = P.ease(e, t); if (v < prev - 1e-12 || v < 0 || v > 1) ok = false; prev = v; }
  }
  check('easing: 0 at start, 1 at end, monotonic for every easing', ok);
  check('easing: unknown name eases like smooth', P.ease('nope', 0.3) === P.ease('smooth', 0.3));
  check('easing: NaN time gives 0', P.ease('linear', NaN) === 0);
}

/* 2. grouping */
{
  const cells = [
    cell('A', '#f00', 0, 0, 100), cell('A', '#f00', 200, 0, 100),
    cell('A', '#0f0', 5000, 0, 80),                     /* same nick, other colour: another player */
    cell('', '#00f', 900, 900, 75),
    cell('food', '#fff', 1, 1, 10, { isFood: true }), cell('v', '#0f0', 2, 2, 100, { isVirus: true }),
    cell('e', '#0f0', 3, 3, 30, { isEjected: true }), cell('r', '#0f0', 4, 4, 100, { removed: true }),
    cell('tiny', '#123', 0, 0, 10), cell('nan', '#123', NaN, 0, 80)
  ];
  const g = P.groupCells(cells);
  check('group: food, viruses, ejected, removed, tiny and NaN cells left out', g.length === 3);
  const a = g.find(x => x.key === P.groupKey('A', '#f00'));
  check('group: same nick + colour is one player (2 cells)', a && a.count === 2 && a.mass === 200);
  check('group: mass-weighted centre', a && Math.abs(a.x - 100) < 1e-9 && a.y === 0);
  check('group: radius reaches the farthest cell edge', a && Math.abs(a.r - 200) < 1e-9);
  check('group: sorted by mass', g[0].mass >= g[1].mass && g[1].mass >= g[2].mass);
  const g2 = P.groupCells(cells.slice().reverse());
  check('group: cell order does not change the result', JSON.stringify(g) === JSON.stringify(g2));
}

/* 3. scoring */
{
  const fightCells = [
    cell('A', 1, 0, 0, sizeOf(3000)), cell('B', 2, sizeOf(3000) + sizeOf(2500) + 10, 0, sizeOf(2500)),
    cell('C', 3, 20000, 20000, sizeOf(6000))
  ];
  const groups = P.groupCells(fightCells);
  const r = P.scoreGroups(groups, {}, { now: 0 });
  check('score: two big players next to each other beat a bigger lone player', r[0].nick === 'A' || r[0].nick === 'B');
  check('score: fight partner is the neighbour', r[0].partner === P.groupKey(r[0].nick === 'A' ? 'B' : 'A', r[0].nick === 'A' ? 2 : 1));
  check('score: lone player has no fight part', r.find(x => x.nick === 'C').fight === 0);
  const far = P.scoreGroups(P.groupCells([cell('A', 1, 0, 0, sizeOf(3000)), cell('B', 2, 9000, 0, sizeOf(2500))]), {}, { now: 0 });
  check('score: far apart is no fight', far.every(x => x.fight === 0 && x.partner === null));
  const small = P.scoreGroups(P.groupCells([cell('A', 1, 0, 0, sizeOf(150)), cell('B', 2, 30, 0, sizeOf(150))]), {}, { now: 0 });
  check('score: small cells close together are no fight', small.every(x => x.fight === 0));
  const r2 = P.scoreGroups(P.groupCells(fightCells.slice().reverse()), {}, { now: 0 });
  check('score: deterministic (same scores and order for shuffled input)', JSON.stringify(r) === JSON.stringify(r2));

  const two = [cell('X', 1, 0, 0, sizeOf(1000)), cell('Y', 2, 50000, 0, sizeOf(1000))];
  const base = P.scoreGroups(P.groupCells(two), {}, { now: 0 });
  check('score: equal players tie, broken by key', base[0].score === base[1].score && base[0].nick === 'X');
  const top = P.scoreGroups(P.groupCells(two), {}, { now: 0, lbTop: 'Y' });
  check('score: leaderboard #1 bonus', top[0].nick === 'Y' && top[0].top > 0);
  const w = P.scoreGroups(P.groupCells(two), {}, { now: 0, watch: { Y: true } });
  check('score: watched player bonus', w[0].nick === 'Y' && w[0].watch > 0);
  const proto = P.scoreGroups(P.groupCells([cell('constructor', 1, 0, 0, sizeOf(500))]), {}, { now: 0, watch: {} });
  check('score: nick "constructor" is not on an empty watchlist', proto[0].watch === 0);

  /* splits and mass changes via the tracks */
  const tracks = {};
  P.updateTracks(tracks, P.groupCells([cell('S', 1, 0, 0, sizeOf(2000)), cell('Z', 2, 50000, 0, sizeOf(2000))]), 1000);
  check('tracks: first sighting has no activity', tracks[P.groupKey('S', 1)].act === 0);
  P.updateTracks(tracks, P.groupCells([cell('S', 1, 0, 0, sizeOf(1000)), cell('S', 1, 300, 0, sizeOf(1000)), cell('Z', 2, 50000, 0, sizeOf(2000))]), 1200);
  const sp = P.scoreGroups(P.groupCells([cell('S', 1, 0, 0, sizeOf(1000)), cell('S', 1, 300, 0, sizeOf(1000)), cell('Z', 2, 50000, 0, sizeOf(2000))]), tracks, { now: 1200 });
  check('score: a recent split counts', sp[0].nick === 'S' && sp[0].split > 0);
  const later = P.scoreGroups(P.groupCells([cell('S', 1, 0, 0, sizeOf(1000)), cell('S', 1, 300, 0, sizeOf(1000))]), tracks, { now: 1200 + 3001 });
  check('score: the split bonus fades out after 3 s', later[0].split === 0);
  P.updateTracks(tracks, P.groupCells([cell('S', 1, 0, 0, sizeOf(1000)), cell('S', 1, 300, 0, sizeOf(1000)), cell('Z', 2, 50000, 0, sizeOf(4000))]), 1400);
  check('tracks: sudden mass change raises activity', tracks[P.groupKey('Z', 2)].act > 0.4);
  const ch = P.scoreGroups(P.groupCells([cell('Z', 2, 50000, 0, sizeOf(4000))]), tracks, { now: 1400 });
  check('score: mass change part', ch[0].change > 0);
  const t2 = {};
  P.updateTracks(t2, P.groupCells([cell('Q', 1, 0, 0, sizeOf(500))]), 0);
  P.updateTracks(t2, P.groupCells([cell('Q', 1, 0, 0, sizeOf(5000))]), 5000);
  check('tracks: coming back into view is not a mass change', t2[P.groupKey('Q', 1)].act === 0);
  P.updateTracks(t2, [], 16000);
  check('tracks: players unseen for 10 s are dropped', !t2[P.groupKey('Q', 1)]);
}

/* 4. dwell and hysteresis */
{
  const o = { dwellMs: 6000, hyst: 0.25, minGap: 3, graceMs: 1500 };
  const R = (list) => list.map(([key, score]) => ({ key, score, partner: null }));
  let sel = { key: null, partner: null, since: 0, lostAt: null };
  P.pickFocus(sel, R([['a', 50], ['b', 40]]), 0, o);
  check('dwell: first pick is the best', sel.key === 'a' && sel.changed === true);
  P.pickFocus(sel, R([['b', 200], ['a', 50]]), 3000, o);
  check('dwell: a much better one waits for the minimum time', sel.key === 'a' && sel.changed === false);
  P.pickFocus(sel, R([['b', 60], ['a', 50]]), 7000, o);
  check('hysteresis: after the dwell, slightly better is not enough', sel.key === 'a');
  P.pickFocus(sel, R([['b', 70], ['a', 50]]), 7100, o);
  check('hysteresis: clearly better switches', sel.key === 'b' && sel.changed === true && sel.since === 7100);
  P.pickFocus(sel, R([['a', 90]]), 8000, o);
  check('lost: kept during the grace time', sel.key === 'b' && sel.lostAt === 8000);
  P.pickFocus(sel, R([['b', 10], ['a', 90]]), 8500, o);
  check('lost: back in view clears the lost time and keeps it', sel.key === 'b' && sel.lostAt === null);
  P.pickFocus(sel, R([['a', 90]]), 9000, o);
  P.pickFocus(sel, R([['a', 90]]), 10600, o);
  check('lost: after the grace time the best takes over at once (no dwell)', sel.key === 'a' && sel.changed);
  P.pickFocus(sel, [], 20000, o);
  P.pickFocus(sel, [], 21600, o);
  check('lost: nothing left gives no target', sel.key === null);

  /* no jitter: two candidates whose scores keep crossing switch rarely */
  let s2 = { key: null, partner: null, since: 0, lostAt: null }, switches = 0;
  for (let tm = 0; tm <= 120000; tm += 200) {
    const wob = Math.sin(tm / 700) * 10;
    P.pickFocus(s2, R([['x', 100 + wob], ['y', 100 - wob]]).sort((a, b) => b.score - a.score), tm, o);
    if (s2.changed && tm > 0) switches++;
  }
  check('jitter: close, crossing scores never switch', switches === 0);
  let s3 = { key: null, partner: null, since: 0, lostAt: null }, sw3 = 0;
  for (let tm = 0; tm <= 120000; tm += 200) {
    const wob = Math.sin(tm / 300) * 80;
    P.pickFocus(s3, R([['x', 100 + wob], ['y', 100 - wob]]).sort((a, b) => b.score - a.score), tm, o);
    if (s3.changed && tm > 0) sw3++;
  }
  check('dwell: big swings switch at most once per dwell time (' + sw3 + ' in 120 s)', sw3 > 0 && sw3 <= 20);
}

/* 5. smooth moves */
{
  const tr = { fx: 0, fy: 0, start: 1000, dur: 1000 }, out = {};
  P.transitionPoint(tr, { x: 1000, y: 0 }, 1000, 'smooth', out);
  check('transition: starts where the camera was', out.x === 0);
  const done = P.transitionPoint(tr, { x: 1000, y: 0 }, 2000, 'smooth', out);
  check('transition: arrives at the target', done && out.x === 1000);
  let prev = 0, maxStep = 0, mono = true;
  for (let tm = 1000; tm <= 2000; tm += 16) {
    P.transitionPoint(tr, { x: 1000 + (tm - 1000), y: 0 }, tm, 'cubic', out); /* moving target */
    if (out.x < prev) mono = false;
    maxStep = Math.max(maxStep, out.x - prev); prev = out.x;
  }
  check('transition: moving target, no step back', mono);
  check('transition: no jump (max step ' + Math.round(maxStep) + ')', maxStep < 100);
  const z = { fx: 5, fy: 5, start: 0, dur: 0 };
  check('transition: 0 ms is a cut', P.transitionPoint(z, { x: 9, y: 9 }, 0, 'linear', out) && out.x === 9);
  const f = { x: 0, y: 0 };
  P.followStep(f, { x: 100, y: 0 }, 16, 250);
  check('follow: smoothing moves part of the way', f.x > 0 && f.x < 20);
  P.followStep(f, { x: 100, y: 0 }, 16, 0);
  check('follow: 0 ms is no smoothing', f.x === 100);
  const a = { x: 0, y: 0 }, b = { x: 0, y: 0 };
  P.followStep(a, { x: 100, y: 0 }, 32, 250);
  P.followStep(b, { x: 100, y: 0 }, 16, 250); P.followStep(b, { x: 100, y: 0 }, 16, 250);
  check('follow: frame-rate independent', Math.abs(a.x - b.x) < 1e-9);
}

/* 6. bookmark validation */
{
  const v = P.validBookmark({ name: '  Top\u0007 left ', x: 100.4, y: -200.6, zoom: 0.51234 });
  check('bookmark: valid one is normalised', v && v.name === 'Top left' && v.x === 100 && v.y === -201 && v.zoom === 0.512);
  check('bookmark: zoom missing means keep (0)', P.validBookmark({ x: 0, y: 0 }).zoom === 0);
  check('bookmark: name capped at 24', P.validBookmark({ name: 'x'.repeat(50), x: 0, y: 0 }).name.length === 24);
  check('bookmark: string coordinates refused', P.validBookmark({ x: '1', y: 2 }) === null);
  check('bookmark: NaN / Infinity refused', P.validBookmark({ x: NaN, y: 0 }) === null && P.validBookmark({ x: 0, y: Infinity }) === null);
  check('bookmark: far outside the map refused', P.validBookmark({ x: 2e6, y: 0 }) === null);
  check('bookmark: zoom out of range refused', P.validBookmark({ x: 0, y: 0, zoom: 41 }) === null && P.validBookmark({ x: 0, y: 0, zoom: 0.001 }) === null && P.validBookmark({ x: 0, y: 0, zoom: -1 }) === null);
  check('bookmark: zoom as string refused', P.validBookmark({ x: 0, y: 0, zoom: '2' }) === null);
  check('bookmark: null / array / number refused', P.validBookmark(null) === null && P.validBookmark([1, 2]) === null && P.validBookmark(5) === null);
  check('bookmark: non-string name becomes empty', P.validBookmark({ name: { a: 1 }, x: 0, y: 0 }).name === '');
  check('bookmarks: broken JSON gives none', P.parseBookmarks('{nope').length === 0 && P.parseBookmarks('{"x":1}').length === 0 && P.parseBookmarks(null).length === 0);
  const many = []; for (let i = 0; i < 30; i++) many.push({ x: i, y: i });
  many.splice(3, 0, { x: 'bad' });
  const pb = P.parseBookmarks(JSON.stringify(many));
  check('bookmarks: invalid entries dropped, capped at 20', pb.length === P.LIMITS.MAX_BOOKMARKS && pb[3].x === 3);
}

/* 7. watchlist / config */
{
  const w = P.parseWatch(JSON.stringify(['a', 'b', 'a', '', '   ', 5, null, 'c\u0001d', ' spaced ']));
  check('watch: deduped, empty and non-strings dropped, control chars removed, spaces kept', JSON.stringify(w) === JSON.stringify(['a', 'b', 'cd', ' spaced ']));
  const many = []; for (let i = 0; i < 40; i++) many.push('n' + i);
  check('watch: capped at 20', P.parseWatch(many).length === P.LIMITS.MAX_WATCH);
  check('watch: nick capped at 60', P.validNick('x'.repeat(80)).length === 60);
  const c0 = P.parseConfig(null);
  check('config: defaults', c0.transitionMs === 1200 && c0.easing === 'smooth' && c0.dwellSec === 6 && c0.overrideSec === 8 && c0.bcTicker === true && c0.hide.bell === false);
  const c1 = P.parseConfig(JSON.stringify({ transitionMs: 99999, dwellSec: -5, easing: 'evil', bcName: 'yes', hide: { bell: true, quickBar: 1, other: true } }));
  check('config: clamped and type checked', c1.transitionMs === 5000 && c1.dwellSec === 2 && c1.easing === 'smooth' && c1.bcName === true && c1.hide.bell === true && c1.hide.quickBar === false && !('other' in c1.hide));
}

/* 8. leaderboard diff and history */
{
  const d = P.diffLeaderboard(['A', 'B', 'C', 'D'], ['B', 'A', 'C', 'D']);
  check('lb diff: swap gives "B passed A"', d.length === 1 && d[0].nick === 'B' && d[0].passed === 'A' && d[0].rank === 1);
  const d2 = P.diffLeaderboard(['A', 'B', 'C', 'D'], ['D', 'A', 'B', 'C']);
  check('lb diff: one jump passes three, in order', d2.length === 3 && d2.every(e => e.nick === 'D') && d2.map(e => e.passed).join() === 'A,B,C');
  check('lb diff: no change, no events', P.diffLeaderboard(['A', 'B'], ['A', 'B']).length === 0);
  const d3 = P.diffLeaderboard(['A', 'B', 'C'], ['N', 'A', 'B']);
  check('lb diff: newcomer and drop-out give no "passed"', d3.length === 0);
  const d4 = P.diffLeaderboard(['x', 'B', 'x', 'C'], ['C', 'x', 'B', 'x']);
  check('lb diff: repeated nicks ignored', d4.length === 1 && d4[0].nick === 'C' && d4[0].passed === 'B');
  const d5 = P.diffLeaderboard(['', 'B', ' '], ['B', '', ' ']);
  check('lb diff: empty nicks ignored', d5.length === 0);
  const d6 = P.diffLeaderboard(['A', 'B', 'C', 'D', 'E', 'F', 'G'], ['G', 'F', 'E', 'D', 'C', 'B', 'A']);
  check('lb diff: capped at 5, sorted by new rank', d6.length === 5 && d6[0].nick === 'G' && d6[0].passed === 'F' && d6.every((e, i) => !i || e.rank >= d6[i - 1].rank));
  const d7 = P.diffLeaderboard(['__proto__', 'constructor'], ['constructor', '__proto__']);
  check('lb diff: odd nicks work', d7.length === 1 && d7[0].nick === 'constructor');
  check('lb snapshot: nicks of the top 10', JSON.stringify(P.lbSnapshot([{ nick: 'a', pos: 1 }, { nick: 5 }, 'c'].concat(Array(20).fill({ nick: 'z' })))) === JSON.stringify(['a', '', 'c', 'z', 'z', 'z', 'z', 'z', 'z', 'z']));
  const h = [];
  check('history: first snapshot added', P.pushHistory(h, ['A', 'B'], 1, 3));
  check('history: unchanged order not added again', !P.pushHistory(h, ['A', 'B'], 2, 3) && h.length === 1);
  P.pushHistory(h, ['B', 'A'], 3, 3); P.pushHistory(h, ['A', 'B'], 4, 3); P.pushHistory(h, ['B', 'A'], 5, 3);
  check('history: capped, newest kept', h.length === 3 && h[0].t === 3 && h[2].t === 5);
  const snap = ['C', 'D']; P.pushHistory(h, snap, 6, 3); snap[0] = 'Z';
  check('history: stores a copy', h[2].r[0] === 'C');
  const s = P.rankSeries(h, 'A', 0);
  check('history: rank series (0 = not listed)', JSON.stringify(s) === JSON.stringify([[4, 1], [5, 2], [6, 0]]));
}

/* 9. placement */
{
  const view = { w: 915, h: 412 };
  const sp = P.pickSpot(view, 100, 30, [{ x: 0, y: 0 }, { x: 200, y: 0 }], [{ left: 0, top: 0, right: 50, bottom: 50 }], 4);
  check('spot: skips a spot over a HUD box', sp.x === 200 && sp.overlap === 0);
  const off = P.pickSpot(view, 100, 30, [{ x: 900, y: 0 }, { x: 0, y: 400 }], [], 4);
  check('spot: off-screen spots skipped', off.overlap === -1);
}

/* 10. the running director with a stub page and a fake clock */
{
  let clock = 0, rafs = [];
  const listeners = {};
  const doc = {
    addEventListener() {}, removeEventListener() {},
    createElement() { return { style: {}, setAttribute() {}, appendChild() {}, classList: { toggle() {} } }; },
    getElementById() { return null; }, querySelectorAll() { return []; },
    body: { classList: { toggle() {} }, appendChild() {}, contains() { return false; } }, head: null
  };
  const toasts = [];
  const lmListeners = {};
  const ctx = {
    Date, Math, Number, JSON, String, Array, Object, console,
    document: doc, localStorage: makeStorage(),
    performance: { now: () => clock },
    requestAnimationFrame: f => { rafs.push(f); return rafs.length; },
    setTimeout: () => 0,
    addEventListener: (n, f) => { (listeners[n] = listeners[n] || []).push(f); },
    removeEventListener: (n, f) => { listeners[n] = (listeners[n] || []).filter(x => x !== f); },
    getComputedStyle: () => ({}),
    toastr: { info: m => toasts.push(m) },
    LMEvents: { on: (n, f) => { lmListeners[n] = f; }, off: (n) => { delete lmListeners[n]; } },
    innerWidth: 915, innerHeight: 412
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(src, ctx);
  const D = ctx.LMDirector;
  const LM = {
    play: false, isFreeSpectate: true, isSpectateEnabled: true, playerCellsMulti: [], viewX: 0, viewY: 0, zoomValue: 1,
    cells: [], leaderboard: [{ nick: 'A' }, { nick: 'B' }], ghostCells: []
  };
  ctx.legendmod = LM;
  ctx.drawRender = { camX: 0, camY: 0 };
  const frame = (ms) => { clock += ms; const q = rafs.splice(0); q.forEach(f => f()); };

  check('runtime: off until used', D.enabled === false && D.camPoint(LM) === null && !lmListeners.leaderboard);
  D.setAuto(true);
  check('runtime: auto camera enables the director', D.enabled === true && D.isAuto() && typeof lmListeners.leaderboard === 'function');
  LM.cells = [cell('A', 1, 1000, 0, sizeOf(3000)), cell('B', 2, 1000 + sizeOf(3000) + sizeOf(2500), 0, sizeOf(2500)), cell('C', 3, -4000, 0, sizeOf(6000))];
  frame(16); frame(200);
  const p0 = D.camPoint(LM);
  check('runtime: picks the fight and starts from the camera', p0 && Math.abs(p0.x) < 50);
  let maxStep = 0, last = p0 ? p0.x : 0, end = null;
  for (let i = 0; i < 200; i++) { frame(16); const p = D.camPoint(LM); if (!p) break; maxStep = Math.max(maxStep, Math.abs(p.x - last)); last = p.x; end = p; }
  const mid = 1000 + (sizeOf(3000) + sizeOf(2500)) / 2;
  check('runtime: glides to the middle of the fight (' + Math.round(end && end.x) + ')', end && Math.abs(end.x - mid) < 5);
  check('runtime: smooth (max step ' + Math.round(maxStep) + ' per frame)', maxStep < 40);
  check('runtime: followed player reported', D.followed() === 'A' || D.followed() === 'B');

  /* manual override: mouse moved over the game while the director has the camera */
  const canvas = { tagName: 'CANVAS' };
  const mv = listeners.pointermove[0];
  mv({ target: canvas, clientX: 100, clientY: 100 });
  mv({ target: canvas, clientX: 200, clientY: 100 });
  check('override: mouse over the game hands the camera back', D.camPoint(LM) === null);
  frame(7000);
  check('override: still paused before overrideSec', D.camPoint(LM) === null);
  frame(1100);
  check('override: auto camera resumes after overrideSec', D.camPoint(LM) !== null);

  /* playing: never */
  LM.play = true;
  frame(16);
  check('runtime: nothing while playing', D.camPoint(LM) === null);
  LM.play = false;

  /* existing follows and camera lock win */
  LM._lmSpecCell = { nick: 'C' };
  check('runtime: a free spectate follow wins', D.camPoint(LM) === null);
  LM._lmSpecCell = null;
  frame(9000);
  ctx.LMHudHelpers = { camLocked: true };
  check('runtime: camera lock wins', D.camPoint(LM) === null);
  ctx.LMHudHelpers = { camLocked: false };
  check('runtime: back after the lock', D.camPoint(LM) !== null);

  /* fixed spectate: the server picks the camera */
  LM.isFreeSpectate = false;
  check('runtime: no camera in fixed spectate', D.camPoint(LM) === null);
  LM.isFreeSpectate = true;

  /* bookmarks: save the view, go there */
  ctx.drawRender.camX = 1234; ctx.drawRender.camY = -50;
  const bi = D.saveView('base');
  check('bookmark: current view saved', bi === 0 && D.bookmarks()[0].x === 1234 && D.bookmarks()[0].name === 'base');
  check('bookmark: stored as JSON', JSON.parse(ctx.localStorage.getItem('lm-director-bookmarks'))[0].y === -50);
  check('bookmark: invalid ones refused', D.addBookmark({ x: 'a', y: 0 }) === -1 && D.bookmarks().length === 1);
  ctx.drawRender.camX = 0; ctx.drawRender.camY = 0;
  D.recallBookmark(0);
  for (let i = 0; i < 120; i++) { frame(16); D.camPoint(LM); }
  const bp = D.camPoint(LM);
  check('bookmark: camera goes there and stays (auto waits)', bp && Math.abs(bp.x - 1234) < 1 && Math.abs(bp.y + 50) < 1);
  check('bookmark: missing number only toasts', D.recallBookmark(7) === false && toasts.length > 0);
  check('toast text from the language pack', toasts[toasts.length - 1] === T('markNone', [8]));
  check('status text from the language pack', D.status() === T('stPoint', ['base']));

  /* watchlist */
  check('watch: add', D.addWatch('C') && D.addWatch('C') && D.watchlist().length === 1);
  check('watch: empty nick refused', D.addWatch('  ') === false);
  D.watchNext();
  for (let i = 0; i < 150; i++) { frame(16); D.camPoint(LM); }
  const wp = D.camPoint(LM);
  check('watch: next follows the watched player', wp && Math.abs(wp.x + 4000) < 2 && D.followed() === 'C');
  D.removeWatch('C');
  check('watch: removed', D.watchlist().length === 0);

  /* leaderboard history through the event */
  lmListeners.leaderboard({ entries: [{ nick: 'A' }, { nick: 'B' }, { nick: 'C' }] });
  lmListeners.leaderboard({ entries: [{ nick: 'A' }, { nick: 'B' }, { nick: 'C' }] });
  lmListeners.leaderboard({ entries: [{ nick: 'C' }, { nick: 'A' }, { nick: 'B' }] });
  check('history: recorded while spectating', D.history().length === 2);
  check('history: ticker "C passed A", "C passed B"', D.ticker().length === 2 && D.ticker()[0].nick === 'C' && D.ticker()[0].passed === 'A');
  LM.play = true;
  lmListeners.leaderboard({ entries: [{ nick: 'B' }, { nick: 'A' }] });
  check('history: not recorded while playing', D.history().length === 2);
  LM.play = false;

  /* nothing in view: the leaderboard #1 through its ghost cell */
  LM.cells = []; LM.ghostCells = [{ x: 7000, y: 300, mass: 9000 }];
  D.setAuto(true);
  for (let i = 0; i < 200; i++) { frame(16); D.camPoint(LM); }
  const gp = D.camPoint(LM);
  check('auto: nothing in view goes to the leaderboard #1', gp && Math.abs(gp.x - 7000) < 2 && D.followed() === 'A');

  D.setAuto(false);
  check('status: idle', D.status() === T('stIdle'));
  ctx.LMi18n.setLang('el');
  check('status follows a language change (Greek)', D.status() === T('stIdle', null, 'el') && D.status() !== T('stIdle'));
  D.toggleAuto();
  check('toast in Greek', toasts[toasts.length - 1] === T('dirOn', null, 'el'));
  D.toggleAuto();
  ctx.LMi18n.setLang('en');
  D.disable();
  check('runtime: turn off stops everything', D.enabled === false && !D.isAuto() && !lmListeners.leaderboard && D.camPoint(LM) === null && (listeners.pointermove || []).length === 0);
}

/* 11. the panel in a small fake DOM: every text from the packs, rebuilt on a language change */
{
  const mkEl = (tag) => {
    const e = {
      tagName: String(tag).toUpperCase(), style: { setProperty() { } }, children: [], attrs: {}, className: '', _t: '', title: '', dir: '',
      value: '', placeholder: '', type: '', id: '', parentNode: null, offsetHeight: 200, offsetWidth: 300,
      get textContent() { return e._t + e.children.map(c => c.textContent).join(''); },
      set textContent(v) { e._t = String(v); e.children = []; },
      get firstChild() { return e.children[0] || null; },
      classList: { toggle(c, on) { const l = e.className.split(' ').filter(Boolean).filter(x => x !== c); if (on) l.push(c); e.className = l.join(' '); }, contains(c) { return e.className.split(' ').indexOf(c) >= 0; } },
      appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = e; e.children.push(c); return c; },
      removeChild(c) { e.children = e.children.filter(x => x !== c); c.parentNode = null; return c; },
      addEventListener() { }, setAttribute(k, v) { e.attrs[k] = String(v); }, getAttribute(k) { return k in e.attrs ? e.attrs[k] : null; },
      contains(x) { for (; x; x = x.parentNode) if (x === e) return true; return false; },
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }),
      querySelectorAll(sel) {
        const out = [], walk = (n) => n.children.forEach(c => { if (c.children) { if (sel[0] === '.' ? (' ' + c.className + ' ').indexOf(' ' + sel.slice(1) + ' ') >= 0 : c.tagName === sel.toUpperCase()) out.push(c); walk(c); } });
        walk(e);
        return out;
      }
    };
    if (e.tagName === 'CANVAS') e.getContext = () => null;
    return e;
  };
  const body = mkEl('body'), head = mkEl('head');
  const doc = {
    body, head, addEventListener() { }, removeEventListener() { },
    createElement: mkEl, createTextNode: (t) => ({ textContent: String(t) }),
    getElementById: (id) => [head, body].map(r => [r].concat(r.querySelectorAll('div'), r.querySelectorAll('style'))).flat().find(n => n.id === id) || null,
    querySelectorAll: () => []
  };
  const ctx = {
    Date, Math, Number, JSON, String, Array, Object, console, document: doc, localStorage: makeStorage(),
    performance: { now: () => 0 }, requestAnimationFrame: () => 1, setTimeout: () => 0,
    addEventListener() { }, removeEventListener() { }, getComputedStyle: () => ({}), innerWidth: 915, innerHeight: 412
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(src, ctx);
  const D = ctx.LMDirector;
  D.open();
  const panel = () => body.children.find(c => c.id === 'lm-dir-panel');
  const find = (root, pred) => { let r = null; const w = (n) => (n.children || []).forEach(c => { if (!r && pred(c)) r = c; if (!r) w(c); }); w(root); return r; };
  const all = (root, pred, out) => { out = out || []; (root.children || []).forEach(c => { if (pred(c)) out.push(c); all(c, pred, out); }); return out; };
  const p1 = panel();
  const titleOf = (p) => find(p, n => n.className === 'lmd-title').textContent;
  const tabs = (p) => all(p, n => n.tagName === 'BUTTON' && n.attrs['data-tab']).map(b => b.textContent).join('|');
  check('panel: title, tabs and buttons from the packs', p1 && titleOf(p1).indexOf(T('title')) >= 0 &&
    tabs(p1) === [T('tCamera'), T('tWatch'), T('tMarks'), T('tBroadcast'), T('tHistory')].join('|') &&
    find(p1, n => n.attrs['data-act'] === 'auto').textContent === T('auto') + ': ' + T('offShort') && p1.dir === 'ltr');
  check('panel: easing names from the packs', all(p1, n => n.tagName === 'OPTION').map(o => o.textContent).join('|') === ['easeLinear', 'easeSmooth', 'easeCubic', 'easeSine', 'easeExpo'].map(k => T(k)).join('|'));
  const nick = find(p1, n => n.tagName === 'INPUT' && n.placeholder === T('nickPh'));
  nick.value = 'typed';
  ctx.LMi18n.setLang('el');
  const p2 = panel();
  check('language change: the panel is built again in Greek, still open, typed text kept', p2 && p2 !== p1 && !p1.parentNode && D.isOpen() &&
    titleOf(p2).indexOf(T('title', null, 'el')) >= 0 && tabs(p2).indexOf(T('tBroadcast', null, 'el')) >= 0 &&
    find(p2, n => n.tagName === 'INPUT' && n.placeholder === T('nickPh', null, 'el')).value === 'typed' && body.children.filter(c => c.id === 'lm-dir-panel').length === 1);
  ctx.LMi18n.setLang('ar');
  check('Arabic: right-to-left panel, the chart canvas stays left-to-right', panel().dir === 'rtl' && find(panel(), n => n.tagName === 'CANVAS').dir === 'ltr');
  D.close();
  ctx.LMi18n.setLang('en');
  check('closed panel: a language change keeps it closed', !D.isOpen() && !panel());
  D.open();
  check('opened again: English', titleOf(panel()).indexOf(T('title')) >= 0 && panel().dir === 'ltr');
}

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
