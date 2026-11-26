// Esc with two windows open that close on Esc (Analytics, the small tools windows, Custom Macros):
// a real Esc key press closes only the window in front, the next one closes the other. Until 3.665
// each window's own Esc listener ran in the order the windows were opened: Analytics + Skin
// collections both closed on one Esc, and Custom Macros under Analytics closed instead of Analytics.
// A window brought to the front (LMWinStack.front, as a touch does) takes the Esc. All closed after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !(window.LMAnalytics && window.LMSmallTools && window.LMWinStack && typeof window.lmMacroEditor === 'function'); w++) await sleep(250);
  if (!window.LMAnalytics || !window.LMSmallTools || !window.LMWinStack || typeof window.lmMacroEditor !== 'function') return { skip: 'windows missing' };
  lmMacroEditor('load');
  for (w = 0; w < 60 && !window.LMMacroEditor; w++) await sleep(250);
  var M = window.LMMacroEditor;
  if (!M) return { fail: ['Custom Macros did not load'], info: info };
  var esc = function () {
    return new Promise(function (res) {
      var id = 'esc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      window.__lmInput(JSON.stringify({ id: id, type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }));
    });
  };
  var A = { name: 'Analytics', open: function () { LMAnalytics.open('dash'); }, close: function () { LMAnalytics.close(); }, is: function () { return LMAnalytics.isOpen(); }, el: function () { return document.getElementById('lm-analytics'); } };
  var S = { name: 'Skin collections', open: function () { LMSmallTools.open('skins'); }, close: function () { LMSmallTools.close(); }, is: function () { return LMSmallTools.isOpen('skins'); }, el: function () { return document.getElementById('lm-st-skins'); } };
  var C = { name: 'Custom Macros', open: function () { M.open(1); }, close: function () { M.close(); }, is: function () { return M.isOpen(); }, el: function () { return document.getElementById('lm-me'); } };
  var all = [A, S, C];
  var closeAll = function () { all.forEach(function (x) { try { x.close(); } catch (e) { } }); };
  var state = function () { return all.map(function (x) { return x.name + ':' + (x.is() ? 'open' : 'closed'); }).join(', '); };
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  try {
    /* older, newer, (the one brought to the front) */
    var cases = [[A, S], [C, A], [A, C], [A, S, A]];
    for (var c = 0; c < cases.length; c++) {
      var k = cases[c], older = k[0], newer = k[1], front = k[2] || newer, back = front === newer ? older : newer;
      var tag = older.name + ' then ' + newer.name + (k[2] ? ', ' + front.name + ' touched' : '');
      closeAll();
      await sleep(100);
      older.open(); await sleep(250);
      newer.open(); await sleep(250);
      if (!older.is() || !newer.is()) { fail.push(tag + ': both should be open (' + state() + ')'); continue; }
      if (k[2]) { LMWinStack.front(front.el()); await sleep(100); }
      if (!(await esc())) { fail.push(tag + ': the harness did not send Esc'); continue; }
      await sleep(300);
      info[tag] = state();
      if (front.is()) fail.push(tag + ': Esc did not close ' + front.name + ' in front (' + state() + ')');
      if (!back.is()) fail.push(tag + ': Esc also closed ' + back.name + ' behind it (' + state() + ')');
      await esc(); await sleep(300);
      if (back.is()) fail.push(tag + ': a second Esc did not close ' + back.name + ' (' + state() + ')');
    }
    /* one window alone still closes on Esc */
    closeAll(); await sleep(100);
    A.open(); await sleep(250);
    await esc(); await sleep(300);
    if (A.is()) fail.push('Analytics alone: Esc did not close it');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    closeAll();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
