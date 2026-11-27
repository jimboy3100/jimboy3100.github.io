// Analytics > History, Clear: asks with a text that says only this device's list goes (its games
// Analytics did not record leave the Dashboard too; the games Analytics recorded and the account's
// server history stay), then empties only that list: the Analytics games (lmAnalyticsGames) are kept.
// The stored lists, the option and confirm are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !window.LMAnalytics; w++) await sleep(250);
  var A = window.LMAnalytics, s = window.legendmod5, app = window.application;
  if (!A) return { skip: 'LMAnalytics missing' };
  if (!s || !app) return { fail: ['settings missing'], info: info };
  var KEYS = ['lmMatchHistory', 'lmAnalyticsGames'], saved = {}, keep = s.matchHistory, conf = window.confirm, asked = [];
  KEYS.forEach(function (k) { try { saved[k] = localStorage.getItem(k); } catch (e) { } });
  try {
    var now = Date.now();
    var games = JSON.stringify({ v: 2, games: [{ v: 2, src: 'lm', t: now - 3600000, ms: 120000, peak: 5000, srv: 'probe', mode: 'FFA' }] });
    localStorage.setItem('lmAnalyticsGames', games);
    localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: now - 60000, mass: 1234, ms: 65000, server: 'x', mode: 'FFA' }]));
    app.setSettings('matchHistory', true);
    A.open('history');
    await sleep(300);
    var body = document.getElementById('lm-analytics-body');
    if (!body || !body.querySelector('.lm-mh-row')) fail.push('no row in the History tab');
    /* the Clear button: the one of the list bar (its text is mhClear) */
    var clr = null, want = lmT('mhClear');
    if (body) Array.prototype.forEach.call(body.querySelectorAll('button, div, span, a'), function (b) { if (!clr && b.children.length === 0 && b.textContent.trim() === want) clr = b; });
    if (!clr) fail.push('no Clear button');
    else {
      window.confirm = function (m) { asked.push(String(m)); return false; };
      clr.click();
      if (!localStorage.getItem('lmMatchHistory')) fail.push('Cancel in the question cleared the list');
      window.confirm = function (m) { asked.push(String(m)); return true; };
      /* the Dashboard and statistics are made of the Analytics games plus the entries of this list
       * that Analytics did not record too: those leave with the list, the question says so */
      var count = function () { return A.core.mergeGames(A.core.parseStore(localStorage.getItem('lmAnalyticsGames'), 'games', A.core.sanitizeGame, 1e6), A.core.fromMatchHistory(localStorage.getItem('lmMatchHistory'))).length; };
      var before = count();
      clr.click();
      await sleep(100);
      info.dashboardGames = [before, count()];
      if (before !== 2 || count() !== 1) fail.push('the list game did not leave the Dashboard games: ' + info.dashboardGames);
      info.asked = asked[0];
      var expect = lmT('pkg.ha8x.mhClearAsk', [lmT('modules.analytics.title')]);
      if (asked.length !== 2) fail.push('confirm asked ' + asked.length + ' times');
      else if (asked[0] !== expect) fail.push('the question does not say what is kept: ' + asked[0]);
      if (localStorage.getItem('lmMatchHistory')) fail.push('the list was not cleared');
      if (localStorage.getItem('lmAnalyticsGames') !== games) fail.push('Clear changed the games Analytics recorded');
      if (body.querySelector('.lm-mh-row')) fail.push('a row is still shown');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    window.confirm = conf;
    try { A.close(); } catch (e) { }
    app.setSettings('matchHistory', keep);
    KEYS.forEach(function (k) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } });
  }
  return { fail: fail, info: info };
})()
