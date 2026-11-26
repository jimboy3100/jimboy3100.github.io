// Analytics > History with the "Match history" option off: the list says the option is off (it
// said "No games recorded yet." while the Dashboard counted the games Analytics recorded) with a
// Turn on button; the button turns the Settings switch on and the list then reads as usual. The
// option and the stored lists are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !window.LMAnalytics; w++) await sleep(250);
  var A = window.LMAnalytics, s = window.legendmod5, app = window.application;
  if (!A) return { skip: 'LMAnalytics missing' };
  if (!s || !app) return { fail: ['settings missing'], info: info };
  var keep = s.matchHistory, KEYS = ['lmMatchHistory'], saved = {};
  KEYS.forEach(function (k) { try { saved[k] = localStorage.getItem(k); localStorage.removeItem(k); } catch (e) { } });
  var empty = lmT('mhEmpty');
  var text = function () { var b = document.getElementById('lm-analytics-body'); return b ? b.textContent : ''; };
  try {
    app.setSettings('matchHistory', false);
    A.open('history');
    await sleep(300);
    info.off = text().slice(0, 120);
    var note = document.getElementById('lm-mh-off'), on = document.getElementById('lm-mh-on');
    if (!note || note.textContent.indexOf(lmT('pkg.r14.mhOff')) < 0) fail.push('option off: no note that Match history is off');
    if (text().indexOf(empty) >= 0) fail.push('option off: still says ' + empty);
    if (!on) fail.push('option off: no Turn on button');
    else {
      on.click();
      await sleep(300);
      var cb = document.getElementById('matchHistory');
      info.on = [s.matchHistory, cb && cb.checked, text().slice(0, 80)];
      if (s.matchHistory !== true) fail.push('Turn on did not turn the option on');
      if (cb && !cb.checked) fail.push('Turn on: the Settings switch stayed off');
      if (document.getElementById('lm-mh-off')) fail.push('Turn on: the note stayed');
      if (text().indexOf(empty) < 0) fail.push('option on with an empty list: no "' + empty + '"');
    }
    /* games in the list with the option off: the note and the list */
    app.setSettings('matchHistory', false);
    try { localStorage.setItem('lmMatchHistory', JSON.stringify([{ t: Date.now() - 60000, mass: 1234, ms: 65000, server: 'x', mode: 'FFA' }])); } catch (e) { }
    A.open('history');
    await sleep(300);
    if (!document.getElementById('lm-mh-off') || !document.querySelector('#lm-analytics-body .lm-mh-row')) fail.push('option off with games: note and list expected');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { A.close(); } catch (e) { }
    app.setSettings('matchHistory', keep);
    var cb2 = document.getElementById('matchHistory');
    if (cb2 && cb2.type === 'checkbox') cb2.checked = !!keep;
    KEYS.forEach(function (k) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } });
  }
  return { fail: fail, info: info };
})()
