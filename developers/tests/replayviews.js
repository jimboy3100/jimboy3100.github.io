/* The Replays window (ogario/modules/replaystudio.js) is the one place for the recorded games: next to
 * Player and Library its Match history, Dashboard and Heatmaps tabs draw the match history list
 * (ogario.v4.js _lmMatchHistoryPaint) and the game stats (analytics.js LMAnalytics.paint) into the same
 * window. The real window is built in a vm with a small fake document; the two painters are stubs that
 * note where and what they were asked to draw. While the stats file is not loaded yet the view says
 * so and draws itself once it is there.
 * node developers/tests/replayviews.js [replaystudio.js] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv } = require('./lib/fakedom');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'replaystudio.js'), 'utf8');

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
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
