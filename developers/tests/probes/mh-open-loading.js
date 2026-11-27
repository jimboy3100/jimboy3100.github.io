// Match history pressed before the Analytics window has loaded (_lmMatchHistoryOpen): it says it is
// loading and opens the History tab once the window is there; after a failed download it asks
// for the file again and, if that fails too, says the window could not be loaded. The real
// window, the loader and toastr are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !window.LMAnalytics; w++) await sleep(250);
  var A = window.LMAnalytics;
  if (!A) return { skip: 'LMAnalytics missing' };
  if (typeof window._lmMatchHistoryOpen !== 'function' || !window.toastr) return { fail: ['_lmMatchHistoryOpen or toastr missing'] };
  var keepLoad = window._lmAnalyticsLoad, keepFailed = window._lmAnalyticsLoadFailed;
  var keepInfo = toastr.info, keepErr = toastr.error, said = [], loads = 0;
  toastr.info = function (m) { said.push(['info', String(m)]); };
  toastr.error = function (m) { said.push(['error', String(m)]); };
  try {
    /* 1: still loading, the window arrives 600 ms later */
    window.LMAnalytics = undefined;
    window._lmAnalyticsLoadFailed = false;
    window._lmMatchHistoryOpen();
    if (!said.length || said[0][0] !== 'info') fail.push('loading: no message (' + JSON.stringify(said) + ')');
    await sleep(600);
    window.LMAnalytics = A;
    await sleep(900);
    info.loading = said.slice();
    if (!A.isOpen()) fail.push('loading: the window did not open once it was there');
    else if (!document.querySelector('#lm-analytics-body #lm-mh-view')) fail.push('loading: not the History tab');
    try { A.close(); } catch (e) { }
    /* 2: the download failed: asked for again, failing again says so */
    said = [];
    window.LMAnalytics = undefined;
    window._lmAnalyticsLoadFailed = true;
    window._lmAnalyticsLoad = function () { loads++; window._lmAnalyticsLoadFailed = false; setTimeout(function () { window._lmAnalyticsLoadFailed = true; }, 200); };
    window._lmMatchHistoryOpen();
    await sleep(1200);
    info.failed = said.slice();
    if (loads !== 1) fail.push('failed download: the file was asked for ' + loads + ' times');
    var err = said.filter(function (x) { return x[0] === 'error'; });
    if (err.length !== 1 || err[0][1] !== lmT('pkg.hf.analyticsLoadFailed')) fail.push('failed download: no "could not be loaded" message');
    if (A.isOpen()) fail.push('failed download: the window opened');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    clearTimeout(window._lmMatchHistoryOpen._t);
    window.LMAnalytics = A;
    window._lmAnalyticsLoad = keepLoad;
    window._lmAnalyticsLoadFailed = keepFailed;
    toastr.info = keepInfo;
    toastr.error = keepErr;
    try { A.close(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
