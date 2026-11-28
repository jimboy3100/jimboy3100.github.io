/* Game stats (ogario/modules/analytics.js) without a timer and without a window of their own: the
 * module runs in a vm with a small fake document. No setInterval at all; "Record replays"
 * (recordReplays, an undefined value counts as on) is the one switch: turned on or off by a preset or
 * import (settingsChange) it adds or removes the listeners at once, and the old "analytics" switch
 * does nothing. No profile button, footer link or window is made: the Dashboard and Heatmaps are
 * drawn into the element the Replays window gives (LMAnalytics.paint) and drawn again when a game
 * ends while one is shown. A life cut by a lost connection or a new connection to the same server
 * is dropped when its next event comes, without a timer.
 * node developers/tests/anpoll.js [analytics.js] [--old <older analytics.js>] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv, makeEl } = require('./lib/fakedom');
const args = process.argv.slice(2);
const oi = args.indexOf('--old');
const oldPath = oi >= 0 ? args.splice(oi, 2)[1] : null;
const srcPath = args[0] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'analytics.js');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function suite(label, src) {
  const res = {};
  /* undefined recordReplays: recording on (as for the replay packets) */
  const u = makeEnv({}, { toastr: { info() {}, success() {}, warning() {} } });
  i18n(u.ctx);
  u.run(src);
  u.flush();
  res.undefinedOn = u.ctx.LMEvents._has('spawn') && u.ctx.LMEvents._has('death');
  /* this file run before the core started (legendmod5 not set yet, defaultmapsettings is): recording on */
  const p = makeEnv({}, { toastr: { info() {}, success() {}, warning() {} } });
  i18n(p.ctx);
  delete p.ctx.legendmod5;
  p.run(src);
  p.flush();
  res.earlyOn = p.ctx.LMEvents._has('spawn') && p.ctx.LMEvents._has('death');

  const e = makeEnv({ recordReplays: false, analytics: true }, { toastr: { info() {}, success() {}, warning() {} } });
  i18n(e.ctx);
  e.doc.createElementNS = (ns, t) => makeEl(e.doc, t);
  /* the menu footer as ogario.v4.js builds it, the profile stats box */
  const foot = makeEl(e.doc, 'div'); foot.id = 'menu-footer';
  const us = makeEl(e.doc, 'div'); us.id = 'user-stats';
  e.doc.body.appendChild(us); e.doc.body.appendChild(foot);
  e.run(src);
  e.flush();
  const E = e.ctx.LMEvents, S = e.ctx.defaultmapsettings, id = x => e.doc.getElementById(x), T = k => e.ctx.lmT(k);
  res.noTimer = e.intervals.size === 0 && e.started() === 0;
  res.offQuiet = !E._has('spawn') && !E._has('death');
  /* the old Analytics switch on: nothing records */
  E.emit('settingsChange', { key: 'analytics', value: true });
  e.flush();
  res.oldSwitchIgnored = !E._has('spawn');
  /* a preset turns Record replays on */
  S.recordReplays = true;
  E.emit('settingsChange', { key: 'recordReplays', value: true });
  e.flush();
  res.onAtOnce = E._has('spawn') && E._has('massUpdate') && E._has('death');
  res.noEntryPoints = !id('lm-analytics-btn') && !id('lm-analytics-link') && !id('lm-analytics') && !id('lm-mh-btn');
  res.api = typeof e.ctx.LMAnalytics.paint === 'function' && !e.ctx.LMAnalytics.open && !e.ctx.LMAnalytics.close;
  /* lives: a lost connection, then a late death: nothing stored */
  const stored = () => { const g = e.ctx.localStorage.getItem('lmAnalyticsGames'); return g ? JSON.parse(g).games.length : 0; };
  let open = true;
  e.ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: 0, playerY: 0, isLegendWorld: false, ws: 'wss://a.example:443', serverType: 'agario', _connectSeq: 1, isSocketOpen: () => open };
  e.ctx._lmHostOnly = h => String(h).replace(/^wss?:\/\//, '').split(/[:/?]/)[0];
  const now = Date.now();
  E.emit('spawn', { time: now - 5000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 600 + i, cells: 1, context: 'live' });
  open = false;
  E.emit('death', { time: now, mass: 600, msAlive: 5000, context: 'live' });
  res.lostDropped = stored() === 0;
  /* connected again to the same server: the old life does not go on into the new one */
  open = true;
  E.emit('spawn', { time: now - 5000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 900, cells: 1, context: 'live' });
  e.ctx.legendmod._connectSeq = 2;
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 300, cells: 1, context: 'live' });
  E.emit('death', { time: now, mass: 300, msAlive: 1000, context: 'live' });
  const g = JSON.parse(e.ctx.localStorage.getItem('lmAnalyticsGames') || '{"games":[]}').games;
  res.reconnectNew = g.length === 1 && g[0].peak === 300;
  /* the Replays window's view: the Dashboard in its element, the old match history merged in */
  e.ctx.localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: now - 3600000, mass: 1234, ms: 65000, server: 'b.example', mode: 'FFA' }]));
  const host = makeEl(e.doc, 'div');
  e.doc.body.appendChild(host);
  const gamesTile = () => { const row = id('lm-analytics-tiles'); return row && row.children[0] && row.children[0].children[1] ? row.children[0].children[1].textContent : null; };
  if (res.api) e.ctx.LMAnalytics.paint(host, 'dash');
  res.dashDrawn = !!id('lm-analytics-tiles') && host.contains(id('lm-analytics-tiles')) && gamesTile() === '2';
  /* a game ends while the Dashboard is shown: drawn again with it */
  E.emit('spawn', { time: Date.now() - 4000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 700, cells: 1, context: 'live' });
  E.emit('death', { time: Date.now(), mass: 700, msAlive: 4000, context: 'live' });
  res.dashRedrawn = gamesTile() === '3';
  /* Heatmaps: the heat canvas of the recorded lives instead of the Dashboard; without tracks it says so */
  if (res.api) e.ctx.LMAnalytics.paint(host, 'heat');
  res.heatNote = !!id('lm-analytics-heat') && host.contains(id('lm-analytics-heat')) && !id('lm-analytics-tiles');
  const tracks = e.ctx.localStorage.getItem('lmAnalyticsTracks');
  e.ctx.localStorage.removeItem('lmAnalyticsTracks');
  if (res.api) e.ctx.LMAnalytics.paint(host, 'heat');
  res.heatNote = res.heatNote && host.children.some(c => c.textContent === T('pkg.rpm.noTracks')) && T('pkg.rpm.noTracks') !== 'pkg.rpm.noTracks' && !id('lm-analytics-heat');
  if (tracks) e.ctx.localStorage.setItem('lmAnalyticsTracks', tracks);
  /* the window shows another view there: a game that ends does not draw over it */
  host._lmAnView = null;
  while (host.firstChild) host.removeChild(host.firstChild);
  host.appendChild(makeEl(e.doc, 'div'));
  E.emit('spawn', { time: Date.now() - 4000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 700, cells: 1, context: 'live' });
  E.emit('death', { time: Date.now(), mass: 700, msAlive: 4000, context: 'live' });
  res.otherViewKept = host.children.length === 1 && !id('lm-analytics-tiles');
  /* the saved "off" read after this file started listening (loadSettings announces no change):
   * a live life stores nothing and the listeners go */
  const before = stored();
  S.recordReplays = false;
  E.emit('spawn', { time: Date.now() - 4000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 700, cells: 1, context: 'live' });
  E.emit('death', { time: Date.now(), mass: 700, msAlive: 4000, context: 'live' });
  e.flush();
  res.silentOff = stored() === before && !E._has('spawn') && !E._has('death');
  S.recordReplays = true;
  E.emit('settingsChange', { key: 'recordReplays', value: true });
  e.flush();
  /* Record replays off by an import: listeners gone at once; the Dashboard says recording is off */
  S.recordReplays = false;
  E.emit('settingsChange', { key: 'recordReplays', value: false });
  e.flush();
  res.offAtOnce = !E._has('spawn') && !E._has('massUpdate') && !E._has('death');
  if (res.api) e.ctx.LMAnalytics.paint(host, 'dash');
  res.offNote = host.children.length > 0 && host.children[0].textContent === T('pkg.rpm.recOff') && T('pkg.rpm.recOff') !== 'pkg.rpm.recOff';
  res.noTimerEnd = e.started() === 0;
  console.log('  ' + label + ': ' + JSON.stringify(res));
  return res;
}

const r = suite('current', fs.readFileSync(srcPath, 'utf8'));
check('no setInterval at all', r.noTimer && r.noTimerEnd);
check('Record replays not set: recording on', r.undefinedOn);
check('loaded before the core started (no legendmod5 yet): recording on', r.earlyOn);
check('Record replays off: no listeners; the old Analytics switch records nothing', r.offQuiet && r.oldSwitchIgnored);
check('settingsChange recordReplays on: listeners at once', r.onAtOnce);
check('no profile button, footer link or window of its own; LMAnalytics.paint, no open / close', r.noEntryPoints && r.api);
check('connection lost mid-life: the late death stores nothing', r.lostDropped);
check('connected again to the same server: the old life is not continued', r.reconnectNew);
check('Dashboard drawn into the given element, with the old match history merged in', r.dashDrawn);
check('a game that ends while the Dashboard is shown draws it again', r.dashRedrawn);
check("Heatmaps: the heat canvas of the recorded lives; without data they say so", r.heatNote);
check('another view shown in the element is not drawn over', r.otherViewKept);
check('Record replays off without a settingsChange (saved value read late): nothing stored, listeners go', r.silentOff);
check('settingsChange recordReplays off: listeners gone at once; the Dashboard says recording is off', r.offAtOnce && r.offNote);
if (oldPath) {
  const o = suite('older', fs.readFileSync(oldPath, 'utf8'));
  check('older version: a window and entry points of its own (comparison is real)', !o.api || !o.noEntryPoints);
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
