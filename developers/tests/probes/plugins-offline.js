// User Scripts > Catalogue when the catalogue cannot be loaded (offline, or the file missing): it is
// tried once, the panel says it failed, nothing is fetched again while it stays open or after it is
// closed, and opening the catalogue again tries once more. Until 3.666 every failed try drew the
// panel again, which loaded again at once: about 90 requests a second, without end, also with the
// panel closed. fetch fails here for the catalogue only; it and the panel are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !window.LMPlugins; w++) await sleep(250);
  var P = window.LMPlugins;
  if (!P || typeof P.open !== 'function') return { skip: 'LMPlugins missing' };
  var of = window.fetch, tries = 0;
  var ov = document.getElementById('overlays'), ovShown = !!(ov && getComputedStyle(ov).display !== 'none');
  window.fetch = function (u) {
    if (/extras\/plugins\/catalogue\.json/.test(String(u))) { tries++; return Promise.reject(new TypeError('Failed to fetch')); }
    return of.apply(this, arguments);
  };
  try {
    P.open('catalogue');
    await sleep(1500);
    info.open = tries;
    var ext = document.getElementById('lm-us-ext');
    var failText = typeof window.lmT === 'function' ? window.lmT('modules.plugins.catFail') : '';
    /* loaded earlier in this page (it is kept): nothing to test here */
    if (tries < 1 && document.querySelector('#lm-us-ext [data-act="install"], #lm-us-ext .lm-us-cat')) return { skip: 'the catalogue was loaded before' };
    if (tries < 1) fail.push('the catalogue was not loaded');
    if (tries > 1) fail.push('the failed catalogue was loaded ' + tries + ' times in 1.5 s with the panel open');
    if (ext && failText && ext.textContent.indexOf(failText) < 0) fail.push('the panel does not say the catalogue failed');
    var n = tries;
    P.close();
    await sleep(1000);
    info.closed = tries - n;
    if (tries !== n) fail.push('loaded ' + (tries - n) + ' times more in 1 s after the panel closed');
    n = tries;
    P.open('catalogue');
    await sleep(1000);
    info.reopen = tries - n;
    if (tries - n !== 1) fail.push('opening the catalogue again tried ' + (tries - n) + ' times, expected once');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    window.fetch = of;
    try { P.close(); } catch (e) { }
    if (ov && !ovShown) $(ov).hide();
  }
  return { fail: fail, info: info };
})()
