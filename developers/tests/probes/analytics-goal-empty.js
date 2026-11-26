// Analytics > Objectives with no games played yet: "Beat your average" + Add (a real click / tap)
// says there are no games yet in a toast and adds no objective. Until 3.667 the button did nothing
// at all (it focused the number field, which this objective hides). Stored games and objectives
// are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !window.LMAnalytics; w++) await sleep(250);
  var A = window.LMAnalytics;
  if (!A) return { skip: 'LMAnalytics missing' };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var input = function (x, y) {
    return new Promise(function (res) {
      var id = 'ag' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var KEYS = ['lmAnalyticsGames', 'lmMatchHistory', 'lmAnalyticsGoals'], saved = {};
  KEYS.forEach(function (k) { try { saved[k] = localStorage.getItem(k); localStorage.removeItem(k); } catch (e) { } });
  /* toasts shown: the calls counted (the container drops old toasts when it is full) */
  var nToasts = 0, T = window.toastr, kinds = ['error', 'warning', 'info', 'success'], orig = {};
  if (T) kinds.forEach(function (k) { orig[k] = T[k]; T[k] = function () { nToasts++; return orig[k].apply(this, arguments); }; });
  var unspy = function () { if (T) kinds.forEach(function (k) { T[k] = orig[k]; }); };
  var toasts = function () { return nToasts; };
  try {
    A.open('goals');
    await sleep(300);
    var type = document.getElementById('lm-analytics-goal-type'), add = document.getElementById('lm-analytics-goal-add');
    if (!type || !add) return { fail: ['no objective form'], info: info };
    type.value = 'beatAvg';
    type.dispatchEvent(new Event('change', { bubbles: true }));
    var t0 = toasts();
    var r = add.getBoundingClientRect();
    if (!(await input(r.left + r.width / 2, r.top + r.height / 2))) return { fail: ['the harness did not send the input'], info: info };
    await sleep(400);
    var goals = null;
    try { goals = JSON.parse(localStorage.getItem('lmAnalyticsGoals') || 'null'); } catch (e) { }
    info.custom = goals && goals.custom ? goals.custom.length : 0;
    info.toasts = toasts() - t0;
    if (info.custom) fail.push('an objective was added without games (target ' + goals.custom[0].target + ')');
    if (info.toasts < 1) fail.push('Add did nothing: no message that there are no games yet');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    unspy();
    try { A.close(); } catch (e) { }
    KEYS.forEach(function (k) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } });
  }
  return { fail: fail, info: info };
})()
