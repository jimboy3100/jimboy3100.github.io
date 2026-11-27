/* Analytics without its 1 s timer: ogario/modules/analytics.js runs in a vm with a small fake
 * document. No setInterval at all; recording turned on or off by a profile / preset / import
 * (settingsChange) adds or removes its listeners and footer link at once; the Match history link
 * (ogario.v4.js _lmMatchHistoryButton, run here from the real source) takes the footer link's
 * place at once; a life cut by a lost connection or a new connection to the same server is
 * dropped when its next event comes, without a timer.
 * node developers/tests/anpoll.js [analytics.js] [--old <older analytics.js>] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv, makeEl } = require('./lib/fakedom');
const args = process.argv.slice(2);
const oi = args.indexOf('--old');
const oldPath = oi >= 0 ? args.splice(oi, 2)[1] : null;
const srcPath = args[0] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'analytics.js');
const corePath = path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* _lmMatchHistoryButton and the functions it calls, from the core */
const core = fs.readFileSync(corePath, 'utf8');
function fnSrc(name) {
  const i = core.indexOf('\nfunction ' + name + '(');
  if (i < 0) return '';
  let d = 0, j = core.indexOf('{', i);
  for (let k = j; k < core.length; k++) {
    if (core[k] === '{') d++;
    else if (core[k] === '}' && --d === 0) return core.slice(i, k + 1);
  }
  return '';
}
const mhSrc = ['_lmMhT', '_lmMatchHistoryButton', '_lmMatchHistoryButtonNow'].map(fnSrc).join('\n') +
  '\nwindow._lmMatchHistoryButton = _lmMatchHistoryButton; window._lmMatchHistoryOpen = function () {};';

function suite(label, src) {
  const res = {};
  const e = makeEnv({ analytics: false, matchHistory: false }, { toastr: { info() {}, success() {}, warning() {} } });
  i18n(e.ctx);
  /* the menu footer as ogario.v4.js builds it, the profile stats box */
  const foot = makeEl(e.doc, 'div'); foot.id = 'menu-footer';
  const us = makeEl(e.doc, 'div'); us.id = 'user-stats';
  e.doc.body.appendChild(us); e.doc.body.appendChild(foot);
  e.run(src);
  e.run(mhSrc);
  e.flush();
  const E = e.ctx.LMEvents, S = e.ctx.defaultmapsettings, id = x => e.doc.getElementById(x);
  res.noTimer = e.intervals.size === 0 && e.started() === 0;
  res.profileBtn = !!id('lm-analytics-btn');
  res.offQuiet = !E._has('spawn') && !id('lm-analytics-link');
  /* a profile turns recording on */
  S.analytics = true;
  E.emit('settingsChange', { key: 'analytics', value: true });
  e.flush();
  res.onAtOnce = E._has('spawn') && E._has('massUpdate') && E._has('death') && !!id('lm-analytics-link');
  /* Match history turned on: its link replaces the Analytics one at once */
  S.matchHistory = true;
  e.ctx._lmMatchHistoryButton();
  res.mhReplaces = !!id('lm-mh-btn') && !id('lm-analytics-link');
  S.matchHistory = false;
  E.emit('settingsChange', { key: 'matchHistory', value: false });
  e.ctx._lmMatchHistoryButton();
  e.flush();
  res.mhGone = !id('lm-mh-btn') && !!id('lm-analytics-link');
  /* lives: a lost connection, then a late death: nothing stored */
  const store = () => { const g = e.ctx.localStorage.getItem('lmAnalyticsGames'); return g ? JSON.parse(g).games.length : 0; };
  let open = true;
  e.ctx.legendmod = { mapSize: 14142, mapOffset: 7071, mapOffsetX: 0, mapOffsetY: 0, playerX: 0, playerY: 0, isLegendWorld: false, ws: 'wss://a.example:443', serverType: 'agario', _connectSeq: 1, isSocketOpen: () => open };
  e.ctx._lmHostOnly = u => String(u).replace(/^wss?:\/\//, '').split(/[:/?]/)[0];
  const now = Date.now();
  E.emit('spawn', { time: now - 5000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 600 + i, cells: 1, context: 'live' });
  open = false;
  E.emit('death', { time: now, mass: 600, msAlive: 5000, context: 'live' });
  res.lostDropped = store() === 0;
  /* connected again to the same server: the old life does not go on into the new one */
  open = true;
  E.emit('spawn', { time: now - 5000, context: 'live' });
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 900, cells: 1, context: 'live' });
  e.ctx.legendmod._connectSeq = 2;
  for (let i = 0; i < 4; i++) E.emit('massUpdate', { mass: 300, cells: 1, context: 'live' });
  E.emit('death', { time: now, mass: 300, msAlive: 1000, context: 'live' });
  const g = JSON.parse(e.ctx.localStorage.getItem('lmAnalyticsGames') || '{"games":[]}').games;
  res.reconnectNew = g.length === 1 && g[0].peak === 300;
  /* recording off by an import: listeners and footer link gone at once */
  S.analytics = false;
  E.emit('settingsChange', { key: 'analytics', value: false });
  e.flush();
  res.offAtOnce = !E._has('spawn') && !E._has('massUpdate') && !id('lm-analytics-link');
  res.noTimerEnd = e.started() === 0;
  console.log('  ' + label + ': ' + JSON.stringify(res));
  return res;
}

const r = suite('current', fs.readFileSync(srcPath, 'utf8'));
check('no setInterval at all', r.noTimer && r.noTimerEnd);
check('profile stats button added at start', r.profileBtn);
check('recording off: no listeners, no footer link', r.offQuiet);
check('settingsChange analytics on: listeners and footer link at once', r.onAtOnce);
check('Match history link added: the Analytics footer link goes at once; removed: it comes back', r.mhReplaces && r.mhGone);
check('connection lost mid-life: the late death stores nothing', r.lostDropped);
check('connected again to the same server: the old life is not continued', r.reconnectNew);
check('settingsChange analytics off: listeners and footer link gone at once', r.offAtOnce);
if (oldPath) {
  const o = suite('older', fs.readFileSync(oldPath, 'utf8'));
  check('older version ran a 1 s timer (comparison is real)', !o.noTimer);
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
