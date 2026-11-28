/* The Replays window (ogario/modules/replaystudio.js) is the one place for the recorded games: next to
 * Player and Library its Match history, Dashboard and Heatmaps tabs draw the match history list
 * (ogario.v4.js _lmMatchHistoryPaint) and the game stats (analytics.js LMAnalytics.paint) into the same
 * window. The real window is built in a vm with a small fake document; the two painters are stubs that
 * note where and what they were asked to draw. While the stats file is not loaded yet the view says
 * so and draws itself once it is there; with the stats file from before the merge (no paint) it says
 * to reload at once. Then the real stats file (analytics.js) and the real match history list
 * (ogario.v4.js) in the real window, from saved lmAnalyticsGames / lmAnalyticsTracks / lmMatchHistory:
 * the Dashboard figures and the Heatmaps layers, Last games, Map size and legend.
 * node developers/tests/replayviews.js [replaystudio.js] [--old <analytics.js with its own window>]
 * (--old: the Dashboard and Heatmaps of that file's window must read the same as the tabs) */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv, makeEl } = require('./lib/fakedom');
const argv = process.argv.slice(2);
const oldAt = argv.indexOf('--old');
const oldAnalytics = oldAt >= 0 ? fs.readFileSync(argv.splice(oldAt, 2)[1], 'utf8') : null;
const ROOT = path.join(__dirname, '..', '..');
const src = fs.readFileSync(argv[0] || path.join(ROOT, 'ogario', 'modules', 'replaystudio.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const e = makeEnv({ recordReplays: true }, { toastr: { info() {}, success() {}, warning() {}, error() {} }, navigator: {}, performance: { now: () => Date.now() } });
i18n(e.ctx);
const calls = [];
e.ctx._lmMatchHistoryPaint = host => { calls.push(['games', host && host.id]); host.appendChild(e.doc.createElement('div')); };
e.run(src);
const RS = e.ctx.LMReplayStudio;
RS.run('open');
const W = e.doc.getElementById('lm-rs'), view = e.doc.getElementById('lm-rs-games');
check('the Replays window opens with its games view element', !!W && !!view && W.contains(view));
/* the header buttons by their text */
const all = [];
(function walk(n) { (n.children || []).forEach(c => { all.push(c); walk(c); }); })(W || { children: [] });
const T = k => e.ctx.lmT(k);
const tabBtn = label => all.find(b => b.tagName === 'BUTTON' && b.textContent === label);
const click = b => { if (b && b._ls.click) b._ls.click.forEach(f => f({ preventDefault() {}, stopPropagation() {} })); };
const tG = tabBtn(T('matchHistory')), tD = tabBtn(T('modules.analytics.tabDash')), tH = tabBtn(T('modules.analytics.tabHeat'));
check('Match history, Dashboard and Heatmaps tabs in the header (' + [T('matchHistory'), T('modules.analytics.tabDash'), T('modules.analytics.tabHeat')].join(', ') + ')', !!tG && !!tD && !!tH);
check('the Player is shown first, the games view hidden', view && view.style.display === 'none');
/* Dashboard before the stats file is there: a loading line, then drawn once it loads */
click(tD);
check('Dashboard without the stats file yet: the view says it is loading', view && view.style.display === 'block' && view.children.length === 1 && view.children[0].textContent === T('mhLoading'));
const an = [];
e.ctx.LMAnalytics = { paint(host, which) { an.push([host && host.id, which]); while (host.firstChild) host.removeChild(host.firstChild); host.appendChild(e.doc.createElement('div')); } };
e.flush();
check('Dashboard: drawn into the same window once the stats file is there', an.length === 1 && an[0][0] === 'lm-rs-games' && an[0][1] === 'dash');
click(tH);
check('Heatmaps: drawn into the same window', an.length === 2 && an[1][0] === 'lm-rs-games' && an[1][1] === 'heat' && view.style.display === 'block');
click(tG);
check('Match history: the list drawn into the same window, marked as no stats view', calls.length === 1 && calls[0][1] === 'lm-rs-games' && view._lmAnView === null);
/* Player again: the games view is hidden; opened again later, the last tab is back */
click(tabBtn(T('modules.replaystudio.player')));
check('Player tab: the games view hidden', view.style.display === 'none');
click(tD);
RS.run('close');
RS.run('open');
check('opened again: the Dashboard is drawn again', view.style.display === 'block' && an.length === 4 && an[3][1] === 'dash');
/* the stats file failed to download: asked for again, then the failure is said */
click(tG);
delete e.ctx.LMAnalytics;
let asked = 0;
e.ctx._lmAnalyticsLoadFailed = true;
e.ctx._lmAnalyticsLoad = () => { asked++; };
click(tH);
e.flush();
check('stats file failed: asked for again, the view says it could not be loaded', asked === 1 && view.children.length === 1 && view.children[0].textContent === T('pkg.rpm.loadFailed') && T('pkg.rpm.loadFailed') !== 'pkg.rpm.loadFailed');
/* a page loaded before the update: its stats file has a window of its own and no paint. Said at
 * once (reload), not "Loading..." until it ends as a download failure */
click(tG);
e.ctx._lmAnalyticsLoadFailed = false;
e.ctx.LMAnalytics = { open() {}, close() {}, isOpen() { return false; }, sync() {}, core: {} };
click(tH);
e.flush();
check('stats file from before the merge (no paint): the view says to reload the page, no loading wait', view.children.length === 1 && view.children[0].textContent === T('pkg.rptab.stale') && T('pkg.rptab.stale') !== 'pkg.rptab.stale');
RS.run('close');
/* the real Match history list of ogario.v4.js (_lmMatchHistoryPaint): with Record replays off it says
 * so in one short line, like the Dashboard and Heatmaps; no second switch (the old "Turn on" button
 * and the "Match history is off" notice are gone: Record replays is the one switch) */
{
  const main = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
  const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found: ' + a); return main.slice(i, j); };
  const m = makeEnv({ recordReplays: false }, { toastr: { info() {} } });
  i18n(m.ctx);
  m.ctx._lmMhServerAvailable = () => false;
  m.ctx.lmT = m.ctx.lmT || m.ctx.window.lmT;
  m.run(cut('function _lmMatchHistory(add) {', 'window._lmMatchHistory = ') + cut('function _lmMhT(', '\n') + '\n' + cut('function _lmMatchHistoryPaint(host) {', 'window._lmMatchHistoryPaint = '));
  m.ctx.localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: 1, mass: 500, ms: 60000 }]));
  const host = m.doc.createElement('div');
  const texts = [], btns = [];
  const walk = n => (n.children || []).forEach(c => { if (c.textContent) texts.push(c.textContent); if (c.tagName === 'BUTTON') btns.push(c); walk(c); });
  m.ctx._lmMatchHistoryPaint(host); walk(host);
  const byId = (n, id) => n.id === id ? n : (n.children || []).reduce((f, c) => f || byId(c, id), null);
  const off = byId(host, 'lm-mh-off');
  check('Record replays off: one short line in the Match history, no Turn on button, the old games still listed',
    !!off && off.textContent === T('pkg.rpm.recOff') && off.children.length === 0 && btns.length === 0 && texts.filter(x => x === T('pkg.rpm.recOff')).length === 1 &&
    !texts.some(x => /Match history is off/i.test(x)) && !!byId(host, 'lm-mh-view') && texts.indexOf('500') !== -1 && main.indexOf('pkg.r14.mhTurnOn') < 0);
  m.ctx.defaultmapsettings.recordReplays = true;
  m.ctx._lmMatchHistoryPaint(host);
  check('Record replays on: no note at all', !byId(host, 'lm-mh-off') && !!byId(host, 'lm-mh-view'));
}

/* ---- the real stats file and the real match history list in the real window ---- */
const walkAll = n => { const out = []; (function w(x) { (x.children || []).forEach(c => { out.push(c); w(c); }); })(n); return out; };
const DAYMS = 86400000, now = Date.now();
/* saved data of the three stores: three recorded games with their stats, one older match history
 * life (merged into the Dashboard), the all-time personal bests and three heatmap tracks */
const sample = {
  lmAnalyticsGames: { v: 1, games: [
    { v: 1, src: 'lm', t: now - 3 * 60000, ms: 60000, peak: 1000, end: 800, srv: 'a.example', mode: 'FFA', st: 'agario', map: 14142, bestPos: 5, lastPos: 5, first: 0, spl: 2, splBad: 1, splLoss: 0.3, cov: 10, edge: 0.1, n: 60, loss20: 0.2 },
    { v: 1, src: 'lm', t: now - 2 * 60000, ms: 120000, peak: 2000, end: 1500, srv: 'a.example', mode: 'FFA', st: 'agario', map: 14142, bestPos: 9, lastPos: 12, first: 0, spl: 0, splBad: 0, splLoss: 0, cov: 12, edge: 0.2, n: 120, loss20: 0 },
    { v: 1, src: 'lm', t: now - 60000, ms: 180000, peak: 3000, end: 2900, srv: 'a.example', mode: 'FFA', st: 'agario', map: 14142, bestPos: 1, lastPos: 1, first: 30000, spl: 1, splBad: 0, splLoss: 0.1, cov: 20, edge: 0.05, n: 180, loss20: 0.01 }
  ] },
  lmMatchHistory: [
    { t: now - 2 * DAYMS, mass: 4000, ms: 240000, killer: { nick: 'Rival', mass: 9000 }, server: 'b.example', mode: 'Teams' },
    { t: now - 60000 + 500, mass: 3000, ms: 180000, killer: { virus: true }, server: 'a.example', mode: 'FFA' }
  ],
  lmPersonalBests: { m: 5000, t: 300000, g: 10 },
  lmAnalyticsTracks: { v: 1, tracks: [
    { v: 1, t: now - 3 * 60000, map: 14142, shape: 's', p: 'AAAAABBB', s: 'AA', d: 'BB' },
    { v: 1, t: now - 2 * 60000, map: 14142, shape: 's', p: 'gggggggg', s: 'gg', d: 'gg' },
    { v: 1, t: now - 60000, map: 14142, shape: 's', p: 'ggAAgg', s: 'AA', d: 'gg' }
  ] }
};
function realEnv(an) {
  const r = makeEnv({ recordReplays: true, analytics: true }, { toastr: { info() {}, success() {}, warning() {}, error() {} }, navigator: {}, performance: { now: () => Date.now() }, confirm: () => false });
  i18n(r.ctx);
  r.doc.createElementNS = (ns, t) => makeEl(r.doc, t);
  /* canvases note what is filled */
  const mk = r.doc.createElement;
  /* '#id' inside an element (the old window finds its body that way) */
  const findIn = (x, id) => { for (const c of x.children || []) { if (c.id === id) return c; const f = findIn(c, id); if (f) return f; } return null; };
  r.doc.createElement = t => {
    const n = mk(t);
    n.querySelector = sel => (/^#[\w-]+$/.test(sel) ? findIn(n, sel.slice(1)) : null);
    if (String(t).toLowerCase() === 'canvas') {
      n.fills = [];
      const c = { fillStyle: '', save() {}, restore() {}, beginPath() {}, arc() {}, clip() {}, rect() {}, stroke() {}, fillRect() { n.fills.push(c.fillStyle); } };
      n.getContext = () => c;
    }
    return n;
  };
  Object.keys(sample).forEach(k => r.ctx.localStorage.setItem(k, JSON.stringify(sample[k])));
  /* the real match history list of ogario.v4.js (with its store and helpers); no account list here */
  const core = fs.readFileSync(path.join(ROOT, 'ogario', 'ogario.v4.js'), 'utf8');
  const a = core.indexOf('function _lmMatchHistory(add)'), b = core.indexOf('window._lmMatchHistoryPaint = _lmMatchHistoryPaint;');
  r.run('function _lmMhServerAvailable() { return false; }\nfunction _lmMatchHistoryServerRequest() {}\n' + core.slice(a, b) + 'window._lmMatchHistoryPaint = _lmMatchHistoryPaint;');
  r.mhFound = a > 0 && b > a;
  r.run(an);
  return r;
}
const anSrc = fs.readFileSync(path.join(ROOT, 'ogario', 'modules', 'analytics.js'), 'utf8');
const r = realEnv(anSrc);
r.run(src);
r.ctx.LMReplayStudio.run('open');
const rid = x => r.doc.getElementById(x), RT = (k, v) => r.ctx.lmT(k, v), AT = (k, v) => RT('modules.analytics.' + k, v);
const rClick = b => { if (b && b._ls.click) b._ls.click.forEach(f => f({ preventDefault() {}, stopPropagation() {} })); };
const rView = rid('lm-rs-games');
check('real files: the match history list of ogario.v4.js found, the Replays window opened', r.mhFound && !!rView);
/* Match history: the saved lives, newest first */
rClick(rid('lm-rs-tab-games'));
const rows = walkAll(rView).filter(n => n.className === 'lm-mh-row');
check('Match history: the saved lmMatchHistory lives as rows, newest first (mass, killer)', rows.length === 2 &&
  rows[0].children[1].textContent === (3000).toLocaleString() && rows[1].children[1].textContent === (4000).toLocaleString() && rows[1].children[3].textContent === 'Rival (' + (9000).toLocaleString() + ')');
/* Dashboard: the figures of the Analytics window from the three stores */
rClick(rid('lm-rs-tab-dash'));
const tiles = rid('lm-analytics-tiles');
const tileText = tiles ? tiles.children.map(t => t.children[0].textContent + '=' + t.children[1].textContent) : [];
const wantTiles = [AT('games') + '=4', AT('highest') + '=5,000', RT('game2.stLongest') + '=5:00', AT('avgSurv') + '=2:30', AT('avgPeak') + '=2,500', AT('top10') + '=67%', AT('perMin') + '=1,000', AT('first') + '=0:30'];
check('Dashboard tiles: games, highest, longest, average survival, average peak, top-10, mass per minute, time in 1st (' + tileText.join(', ') + ')',
  !!tiles && rView.contains(tiles) && JSON.stringify(tileText) === JSON.stringify(wantTiles));
const svg = rid('lm-analytics-weeks'), rAll = walkAll(rView);
check('Dashboard: the weekly chart with a bar, the week table and Best modes (FFA first)', !!svg && svg.children.some(c => c.tagName === 'PATH') &&
  rAll.some(n => n.tagName === 'TABLE') && rAll.some(n => n.textContent === AT('bestModes')) && rAll.some(n => n.tagName === 'SPAN' && n.textContent === 'FFA'));
check('Dashboard: no "Record replays is off" note while it is on, no window of its own', !rAll.some(n => n.textContent === RT('pkg.rpm.recOff')) && !rid('lm-analytics'));
/* Heatmaps: layers Movement / Deaths / Spawns, Last games, Map size, legend, the canvas */
rClick(rid('lm-rs-tab-heat'));
const layerBtn = l => walkAll(rView).find(n => n.tagName === 'BUTTON' && n.getAttribute('data-layer') === l);
const info = () => { const s = walkAll(rView).filter(n => n.tagName === 'DIV' && /·/.test(n.textContent)); return s.length ? s[0].textContent : ''; };
const lastN = rid('lm-analytics-heat-n'), mapSel = rid('lm-analytics-heat-map'), cv = rid('lm-analytics-heat');
check('Heatmaps: Movement, Deaths and Spawns layers with their names', ['move', 'death', 'spawn'].every(l => layerBtn(l) && layerBtn(l).textContent === AT(l)));
check('Heatmaps: Last games 10 / 25 / 50 (25 chosen) and Map size with the games per size', !!lastN && lastN.children.map(o => o.value).join() === '10,25,50' && lastN.children[1].selected === true &&
  !!mapSel && mapSel.children.length === 1 && mapSel.children[0].textContent === '14,142 (3)');
check('Heatmaps: the legend (fewer ... more) and the movement count (' + info() + ')', walkAll(rView).some(n => n.textContent === AT('fewer')) && walkAll(rView).some(n => n.textContent === AT('more')) &&
  info() === AT('heatInfo', [3, '11']));
check('Heatmaps: the movement layer drawn in blue on the canvas', !!cv && rView.contains(cv) && cv.fills.length > 0 && cv.fills.indexOf('#cde2fb') >= 0 && !cv.fills.some(c => /^#(5c2a06|fde0c2)$/.test(c)));
rClick(layerBtn('death'));
const cvD = rid('lm-analytics-heat');
check('Heatmaps: Deaths drawn in orange, one point per game (' + info() + ')', !!cvD && cvD !== cv && cvD.fills.indexOf('#fde0c2') >= 0 && info() === AT('heatInfo', [3, '3']));
rClick(layerBtn('spawn'));
check('Heatmaps: Spawns, one point per game', info() === AT('heatInfo', [3, '3']) && layerBtn('spawn').style.cssText.indexOf('font-weight:700') >= 0);
const nSel = rid('lm-analytics-heat-n');
nSel.value = '10';
(nSel._ls.change || []).forEach(f => f({}));
check('Heatmaps: Last games changed: drawn again with the choice kept', rid('lm-analytics-heat-n') !== nSel && rid('lm-analytics-heat-n').children[0].selected === true);
/* a game that ends while the Heatmaps are shown: drawn again in the window with it */
r.ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: 7000, playerY: 7000, isLegendWorld: false, ws: 'wss://a.example:443', serverType: 'agario', _connectSeq: 1, isSocketOpen: () => true };
const E2 = r.ctx.LMEvents;
E2.emit('spawn', { time: Date.now() - 5000, context: 'live' });
E2.emit('massUpdate', { mass: 700, cells: 1, context: 'live' });
E2.emit('death', { time: Date.now(), mass: 700, msAlive: 5000, context: 'live' });
check('a game ending while the Heatmaps are shown: drawn again with 4 games', rid('lm-analytics-heat-map') && rid('lm-analytics-heat-map').children[0].textContent === '14,142 (4)' && rView.contains(rid('lm-analytics-heat')));
/* Coach and Objectives: views of the same window (the Coach and objective toasts open them there) */
check('Coach and Objectives tabs with their names', !!rid('lm-rs-tab-coach') && rid('lm-rs-tab-coach').textContent === AT('tabCoach') && !!rid('lm-rs-tab-goals') && rid('lm-rs-tab-goals').textContent === AT('tabGoals'));
rClick(rid('lm-rs-tab-coach'));
check('Coach: the newest recorded game scored in the window (overall, 5 parts, 2-4 tips)', !!rid('lm-analytics-overall') && rView.contains(rid('lm-analytics-overall')) &&
  walkAll(rView).filter(n => n.getAttribute && n.getAttribute('data-part')).length === 5 && rid('lm-analytics-tips').children.length >= 2 && rid('lm-analytics-tips').children.length <= 4);
rClick(rid('lm-rs-tab-goals'));
check('Objectives: three daily objectives and the form for own ones', !!rid('lm-analytics-daily') && rid('lm-analytics-daily').children.length === 3 && rView.contains(rid('lm-analytics-goal-add')));
rClick(rid('lm-rs-tab-games'));
r.ctx.LMReplayStudio.run('view', 'coach');
check('run("view", "coach") (the Coach toast) shows the Coach', rView.style.display === 'block' && rView.contains(rid('lm-analytics-overall')));
r.ctx.LMReplayStudio.run('close');

/* --old: the window of the stats file from before the merge shows the same Dashboard and Heatmaps */
if (oldAnalytics) {
  const shape = n => (n.children || []).length ? n.tagName + (n.id ? '#' + n.id : '') + '[' + n.children.map(shape).join(',') + ']' : n.tagName + (n.id ? '#' + n.id : '') + ':' + n.textContent;
  const o = realEnv(oldAnalytics);
  const nw = realEnv(anSrc);
  ['dash', 'heat'].forEach(which => {
    o.ctx.LMAnalytics.open(which);
    const ob = o.doc.getElementById('lm-analytics-body');
    const host = makeEl(nw.doc, 'div'); nw.doc.body.appendChild(host);
    nw.ctx.LMAnalytics.paint(host, which);
    const a = ob ? ob.children.map(shape).join('|') : '', b = host.children.map(shape).join('|');
    check('the old Analytics window and the ' + which + ' tab read the same', !!a && a === b);
    if (a !== b) console.log('  old: ' + a.slice(0, 600) + '\n  new: ' + b.slice(0, 600));
    o.ctx.LMAnalytics.close();
  });
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
