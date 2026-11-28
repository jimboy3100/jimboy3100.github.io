// Recorded games in the Replays window (ogario/modules/replaystudio.js): "Record replays" is the one
// switch (no Analytics or Match history switch, window, button, footer link or hotkey any more); the
// Match history, Dashboard and Heatmaps tabs draw with sample data in that same window, which fits the
// screen. Restores localStorage after.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 50 && !window.LMAnalytics; w++) await sleep(100);
  var A = window.LMAnalytics;
  need('LMAnalytics loaded, a painter for the Replays window (no window of its own)', !!A && typeof A.paint === 'function' && !A.open);
  if (!A) return { fail: fail, info: info };
  var S = window.legendmod5 || {};
  need('one switch: Record replays on by default, no Analytics or Match history switch', S.recordReplays === true && !('analytics' in S) && !('matchHistory' in S));
  need('recording listeners with Record replays on', window.LMEvents._has('massUpdate') && window.LMEvents._has('death'));
  need('no Analytics hotkey, profile button or footer links', !(typeof hotkeysCommand === 'object' && hotkeysCommand['hk-analytics']) &&
    !document.getElementById('lm-analytics-btn') && !document.getElementById('lm-analytics-link') && !document.getElementById('lm-mh-btn'));
  var keys = ['lmAnalyticsGames', 'lmAnalyticsTracks', 'lmMatchHistory'], saved = {}, origConfirm = window.confirm;
  keys.forEach(function (k) { saved[k] = localStorage.getItem(k); });
  var $id = function (x) { return document.getElementById(x); };
  var openStudio = async function () {
    window.lmReplayStudio('open');
    for (var i = 0; i < 50 && !($id('lm-rs') && $id('lm-rs').style.display !== 'none'); i++) await sleep(100);
  };
  try {
    var now = Date.now(), games = [], tracks = [], C = A.core, p = '';
    for (var i = 0; i < 40; i++) p += C.encodeCell(0.5 + 0.3 * Math.cos(i / 6), 0.5 + 0.3 * Math.sin(i / 6));
    for (var j = 0; j < 12; j++) {
      games.push({ v: 1, src: 'lm', t: now - (12 - j) * 86400000, ms: 120000 + j * 30000, peak: 800 + j * 150, end: 400 + j * 50, srv: 'probe.example', mode: 'FFA',
        map: 14142, bestPos: j % 3 ? 4 : 0, lastPos: j % 3 ? 7 : 0, first: 0, spl: 3, splBad: 1, splLoss: 0.2, cov: 12, edge: 0.2, n: 40, loss20: 0.3 });
      tracks.push({ v: 1, t: now - (12 - j) * 86400000, map: 14142, shape: 's', p: p, s: p.slice(0, 2), d: p.slice(-2) });
    }
    localStorage.setItem('lmAnalyticsGames', JSON.stringify({ v: 1, games: games }));
    localStorage.setItem('lmAnalyticsTracks', JSON.stringify({ v: 1, tracks: tracks }));
    localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: now - 60000, mass: 1234, ms: 65000, server: 'probe.example', mode: 'FFA', killer: { nick: 'Probe killer', mass: 2000 } },
      { t: now - 30000, mass: 4321, ms: 125000, server: 'probe.example', mode: 'FFA', killer: { virus: true } }]));
    await openStudio();
    var W = $id('lm-rs');
    need('Replays window opens', !!W && W.style.display !== 'none');
    need('Match history, Dashboard and Heatmaps tabs', !!$id('lm-rs-tab-games') && !!$id('lm-rs-tab-dash') && !!$id('lm-rs-tab-heat') &&
      $id('lm-rs-tab-games').textContent === lmT('matchHistory'));
    $id('lm-rs-tab-dash').click();
    need('Dashboard tiles in the Replays window (with the longest time alive)', document.querySelectorAll('#lm-rs-games #lm-analytics-tiles > div').length === 8);
    need('weekly chart', !!document.querySelector('#lm-rs-games #lm-analytics-weeks path'));
    var r = W.getBoundingClientRect();
    info.rect = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    need('window fits the screen', r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1);
    $id('lm-rs-tab-games').click();
    var rows = document.querySelectorAll('#lm-rs-games #lm-mh-view .lm-mh-row');
    need('Match history lists the games, newest first', rows.length === 2 && rows[0].children[1].textContent === (4321).toLocaleString() && rows[1].children[3].textContent.indexOf('Probe killer') === 0);
    /* Expanding Land, logged in: the chosen "Account (server)" list stays chosen when the list is
     * drawn again (opened again, a language change); after a logout the list of this device */
    var lm = window.legendmod, lwSaved = window._lwAuth, elSaved = lm && lm.isLegendWorld, sockOwn = lm && Object.prototype.hasOwnProperty.call(lm, 'isSocketOpen'), sockSaved = lm && lm.isSocketOpen, elOwn = lm && Object.prototype.hasOwnProperty.call(lm, 'isLegendWorld'), smhSaved = window._lmServerMatchHistory;
    if (lm) {
      try {
        lm.isLegendWorld = true;
        lm.isSocketOpen = function () { return true; };
        window._lwAuth = { state: 'logged_in' };
        /* asked just now: no request is sent (at most one per 2 s) */
        window._lmServerMatchHistory = { state: 'done', askedAt: Date.now(), games: [{ time: Math.floor(now / 1000) - 50, aliveSecs: 70, highestMass: 777, finalMass: 700, topPosition: 3, playersEaten: 2, virusesEaten: 1, killerKnown: false }] };
        $id('lm-rs-tab-games').click();
        var st = $id('lm-mh-tab-server');
        need('account tab on Expanding Land while logged in', !!st);
        if (st) st.click();
        need('account list shown', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1);
        $id('lm-rs-tab-games').click();
        need('account list stays chosen when drawn again', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1 && $id('lm-mh-clear').style.display === 'none');
        window.lmReplayStudio('close');
        await openStudio();
        need('account list stays chosen when opened again', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1);
        /* logout: the previous account's list goes */
        window._lwAuth = { state: 'logged_out' };
        window._lmServerMatchHistory = null;
        window._lmMatchHistoryRefreshOpen();
        need('after a logout the open list shows this device, not the account list', !$id('lm-mh-tab-server') && document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 0 &&
          document.querySelectorAll('#lm-mh-view .lm-mh-row').length === 2);
      } finally {
        if (elOwn) lm.isLegendWorld = elSaved; else delete lm.isLegendWorld;
        if (sockOwn) lm.isSocketOpen = sockSaved; else delete lm.isSocketOpen; window._lwAuth = lwSaved; window._lmServerMatchHistory = smhSaved;
      }
    }
    window.confirm = function () { return true; };
    $id('lm-mh-clear').click();
    window.confirm = origConfirm;
    need('Clear empties the list', document.querySelectorAll('#lm-mh-view .lm-mh-row').length === 0 && !localStorage.getItem('lmMatchHistory'));
    $id('lm-rs-tab-heat').click();
    var cv = $id('lm-analytics-heat');
    need('heatmap canvas in the Replays window', !!cv && cv.width > 0 && !!cv.closest && !!cv.closest('#lm-rs'));
    var dl = document.querySelector('#lm-rs [data-layer="death"]');
    if (dl) dl.click();
    need('deaths layer', !!$id('lm-analytics-heat'));
    need('no window of its own', !$id('lm-analytics'));
  } catch (e) {
    fail.push('threw: ' + e);
  } finally {
    try { window.lmReplayStudio('close'); } catch (e) { }
    window.confirm = origConfirm;
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
  }
  return { fail: fail, info: info };
})()
