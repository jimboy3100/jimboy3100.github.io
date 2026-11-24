// Analytics window (ogario/modules/analytics.js): loads, stays silent while off, every tab draws
// with sample data, the window fits the screen and closes by tap. Restores localStorage after.
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
  var keys = ['lmAnalyticsGames', 'lmAnalyticsTracks', 'lmAnalyticsGoals'], saved = {};
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
    localStorage.removeItem('lmAnalyticsGoals');
    A.open('dash');
    var md = document.getElementById('lm-analytics');
    need('window opens', !!md && A.isOpen());
    var r = md.getBoundingClientRect();
    info.rect = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    need('window fits the screen', r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1);
    need('dashboard tiles', document.querySelectorAll('#lm-analytics-tiles > div').length === 7);
    need('weekly chart', !!document.querySelector('#lm-analytics-weeks path'));
    document.getElementById('lm-analytics-tab-heat').click();
    var cv = document.getElementById('lm-analytics-heat');
    need('heatmap canvas', !!cv && cv.width > 0);
    var dl = document.querySelector('[data-layer="death"]');
    if (dl) dl.click();
    need('deaths layer', !!document.getElementById('lm-analytics-heat'));
    document.getElementById('lm-analytics-tab-coach').click();
    need('coach report', !!document.getElementById('lm-analytics-overall') && document.querySelectorAll('#lm-analytics-tips li').length >= 2 &&
      document.querySelectorAll('[data-part]').length === 5);
    document.getElementById('lm-analytics-tab-goals').click();
    need('daily objectives', document.querySelectorAll('#lm-analytics-daily .lm-analytics-goal').length === 3);
    document.getElementById('lm-analytics-goal-target').value = '1500';
    document.getElementById('lm-analytics-goal-add').click();
    need('custom objective added', document.querySelectorAll('#lm-analytics-custom .lm-analytics-goal').length === 1);
    var x = document.getElementById('lm-analytics-close');
    var xr = x.getBoundingClientRect();
    need('close button is a touch-sized target', xr.width >= 32 && xr.height >= 32);
    x.click();
    need('close button closes', !document.getElementById('lm-analytics') && !A.isOpen());
  } catch (e) {
    fail.push('threw: ' + e);
  } finally {
    try { A.close(); } catch (e) { }
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
  }
  return { fail: fail, info: info };
})()
