// Analytics window (ogario/modules/analytics.js): loads, stays silent while off, every tab draws
// with sample data (History: the match history list, once a window of its own), one footer link,
// the window fits the screen and closes by tap. Restores localStorage and the options after.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  for (var w = 0; w < 50 && !window.LMAnalytics; w++) await new Promise(function (r) { setTimeout(r, 100); });
  var A = window.LMAnalytics;
  need('LMAnalytics loaded', !!A && typeof A.open === 'function');
  if (!A) return { fail: fail, info: info };
  need('option off by default', window.legendmod5 && window.legendmod5.analytics === false);
  need('no recording listeners while off', !window.LMEvents._has('split') && !window.LMEvents._has('massUpdate'));
  need('hotkey without a default key', typeof hotkeysCommand === 'object' && hotkeysCommand['hk-analytics'] && hotkeysCommand['hk-analytics'].defaultKey === '');
  need('Analytics button in the profile stats', !document.getElementById('user-stats') || !!document.getElementById('lm-analytics-btn'));
  var keys = ['lmAnalyticsGames', 'lmAnalyticsTracks', 'lmMatchHistory'], saved = {};
  var optMh = window.legendmod5 && window.legendmod5.matchHistory, optAn = window.legendmod5 && window.legendmod5.analytics, origConfirm = window.confirm;
  keys.forEach(function (k) { saved[k] = localStorage.getItem(k); });
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
    A.open('dash');
    var md = document.getElementById('lm-analytics');
    need('window opens', !!md && A.isOpen());
    var r = md.getBoundingClientRect();
    info.rect = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    need('window fits the screen', r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1);
    need('dashboard tiles (with the longest time alive)', document.querySelectorAll('#lm-analytics-tiles > div').length === 8);
    need('weekly chart', !!document.querySelector('#lm-analytics-weeks path'));
    /* History tab: the match history list (ogario.v4.js _lmMatchHistoryPaint) */
    localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: now - 60000, mass: 1234, ms: 65000, server: 'probe.example', mode: 'FFA', killer: { nick: 'Probe killer', mass: 2000 } },
      { t: now - 30000, mass: 4321, ms: 125000, server: 'probe.example', mode: 'FFA', killer: { virus: true } }]));
    var ht = document.getElementById('lm-analytics-tab-history');
    need('History tab, labelled Match history', !!ht && ht.textContent === lmT('matchHistory'));
    if (ht) ht.click();
    var rows = document.querySelectorAll('#lm-analytics-body #lm-mh-view .lm-mh-row');
    need('History tab lists the games, newest first', rows.length === 2 && rows[0].children[1].textContent === (4321).toLocaleString() && rows[1].children[3].textContent.indexOf('Probe killer') === 0);
    A.close();
    window._lmMatchHistoryOpen();
    need('Match history opens the Analytics window at History', A.isOpen() && document.getElementById('lm-analytics-tab-history').getAttribute('aria-pressed') === 'true' &&
      document.querySelectorAll('#lm-mh-view .lm-mh-row').length === 2 && !document.getElementById('lm-mh-modal'));
    /* Expanding Land, logged in: the chosen "Account (server)" list stays chosen when the window
     * is drawn again (opened again, a language change); after a logout the list of this device */
    var lm = window.legendmod, lwSaved = window._lwAuth, elSaved = lm && lm.isLegendWorld, sockOwn = lm && Object.prototype.hasOwnProperty.call(lm, 'isSocketOpen'), sockSaved = lm && lm.isSocketOpen, elOwn = lm && Object.prototype.hasOwnProperty.call(lm, 'isLegendWorld'), smhSaved = window._lmServerMatchHistory;
    if (lm) {
      try {
        lm.isLegendWorld = true;
        lm.isSocketOpen = function () { return true; };
        window._lwAuth = { state: 'logged_in' };
        /* asked just now: no request is sent (at most one per 2 s) */
        window._lmServerMatchHistory = { state: 'done', askedAt: Date.now(), games: [{ time: Math.floor(now / 1000) - 50, aliveSecs: 70, highestMass: 777, finalMass: 700, topPosition: 3, playersEaten: 2, virusesEaten: 1, killerKnown: false }] };
        A.open('history');
        var st = document.getElementById('lm-mh-tab-server');
        need('account tab on Expanding Land while logged in', !!st);
        if (st) st.click();
        need('account list shown', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1);
        A.open('history');
        need('account list stays chosen when drawn again', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1 && document.getElementById('lm-mh-clear').style.display === 'none');
        A.close();
        window._lmMatchHistoryOpen();
        need('account list stays chosen when opened again', document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 1);
        /* logout: the previous account's list goes */
        window._lwAuth = { state: 'logged_out' };
        window._lmServerMatchHistory = null;
        window._lmMatchHistoryRefreshOpen();
        need('after a logout the open window shows this device, not the account list', !document.getElementById('lm-mh-tab-server') && document.querySelectorAll('#lm-mh-view .lm-mh-srow').length === 0 &&
          document.querySelectorAll('#lm-mh-view .lm-mh-row').length === 2);
      } finally {
        if (elOwn) lm.isLegendWorld = elSaved; else delete lm.isLegendWorld;
        if (sockOwn) lm.isSocketOpen = sockSaved; else delete lm.isSocketOpen; window._lwAuth = lwSaved; window._lmServerMatchHistory = smhSaved;
      }
    }
    window.confirm = function () { return true; };
    document.getElementById('lm-mh-clear').click();
    window.confirm = origConfirm;
    need('Clear empties the list', document.querySelectorAll('#lm-mh-view .lm-mh-row').length === 0 && !localStorage.getItem('lmMatchHistory'));
    if (document.getElementById('menu-footer') && window.legendmod5) {
      legendmod5.matchHistory = true;
      legendmod5.analytics = true;
      window._lmMatchHistoryButton();
      await new Promise(function (r) { setTimeout(r, 1300); });
      need('one footer link while both options are on', !!document.getElementById('lm-mh-btn') && !document.getElementById('lm-analytics-link'));
      legendmod5.matchHistory = false;
      window._lmMatchHistoryButton();
      await new Promise(function (r) { setTimeout(r, 1300); });
      need('Analytics footer link while only recording is on', !document.getElementById('lm-mh-btn') && !!document.getElementById('lm-analytics-link'));
      legendmod5.matchHistory = optMh;
      legendmod5.analytics = optAn;
      window._lmMatchHistoryButton();
    }
    document.getElementById('lm-analytics-tab-heat').click();
    var cv = document.getElementById('lm-analytics-heat');
    need('heatmap canvas', !!cv && cv.width > 0);
    var dl = document.querySelector('[data-layer="death"]');
    if (dl) dl.click();
    need('deaths layer', !!document.getElementById('lm-analytics-heat'));
    need('three tabs, no Coach or Objectives', document.querySelectorAll('#lm-analytics-tabs [data-tab]').length === 3 && !document.getElementById('lm-analytics-tab-coach') && !document.getElementById('lm-analytics-tab-goals'));
    var x = document.getElementById('lm-analytics-close');
    var xr = x.getBoundingClientRect();
    need('close button is a touch-sized target', xr.width >= 32 && xr.height >= 32);
    x.click();
    need('close button closes', !document.getElementById('lm-analytics') && !A.isOpen());
  } catch (e) {
    fail.push('threw: ' + e);
  } finally {
    try { A.close(); } catch (e) { }
    window.confirm = origConfirm;
    if (window.legendmod5) { legendmod5.matchHistory = optMh; legendmod5.analytics = optAn; try { window._lmMatchHistoryButton(); } catch (e) { } }
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
  }
  return { fail: fail, info: info };
})()
