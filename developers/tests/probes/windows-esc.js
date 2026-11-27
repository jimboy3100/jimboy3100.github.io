// Esc closes the Theme workshop, the Practice window and the Spectator director wherever the focus
// is, as it closes Analytics and Custom macros: a real Esc with the focus on the page (after a click
// on the game) closes each. Until 3.697 they closed only with the focus inside them, so after a click
// elsewhere Esc opened the game menu and the window stayed open. With the Command Centre opened over
// Analytics, Esc closes the Command Centre only (Analytics took that Esc too and closed under it).
// Everything is closed after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'we' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 200); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var unfocus = function () { var a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); };
  var menuShown = function () { var o = document.getElementById('overlays'); return !!(o && getComputedStyle(o).display !== 'none'); };
  for (var w0 = 0; w0 < 60 && !(window.LMThemeWorkshop && window.LMDirector && typeof window.lmPractice === 'function'); w0++) await sleep(250);
  var wins = [
    { name: 'Theme workshop', open: function () { LMThemeWorkshop.open(); }, isOpen: function () { return !!(window.LMThemeWorkshop && LMThemeWorkshop.isOpen()); }, close: function () { LMThemeWorkshop.close(); } },
    { name: 'Practice', open: function () { lmPractice('open'); }, isOpen: function () { return !!(window.LMPractice && LMPractice.isOpen && LMPractice.isOpen()); }, close: function () { if (window.LMPractice && LMPractice.close) LMPractice.close(); } },
    { name: 'Director', open: function () { LMDirector.open(); }, isOpen: function () { return !!(window.LMDirector && LMDirector.isOpen()); }, close: function () { LMDirector.close(); } }
  ];
  /* opening the director turns it on (a leaderboard listener): it is turned off again after */
  var dirOn = !!(window.LMDirector && LMDirector.enabled);
  var menu0 = menuShown();
  if (menu0 && window.application && application.hideMenu) { application.hideMenu(); await sleep(200); }
  for (var i = 0; i < wins.length; i++) {
    var wn = wins[i], r = {};
    try {
      wn.open();
      for (var w = 0; w < 40 && !wn.isOpen(); w++) await sleep(150);
      if (!wn.isOpen()) { info[wn.name] = 'did not open'; fail.push(wn.name + ': did not open'); continue; }
      unfocus();
      r.menuBefore = menuShown();
      await esc();
      await sleep(150);
      r.open = wn.isOpen();
      r.menuAfter = menuShown();
      if (r.open) fail.push(wn.name + ': Esc with the focus on the page did not close it');
      if (!r.menuBefore && r.menuAfter) fail.push(wn.name + ': that Esc opened the game menu');
      if (r.menuAfter && !r.menuBefore && window.application && application.hideMenu) { application.hideMenu(); await sleep(150); }
    } catch (e) { fail.push(wn.name + ': ' + e); }
    info[wn.name] = r;
    try { if (wn.isOpen()) wn.close(); } catch (e) { }
  }
  /* the Command Centre over Analytics: one Esc closes the Command Centre only */
  try {
    var CC = window.LMCommandCentre;
    for (var w1 = 0; w1 < 40 && !window.LMAnalytics; w1++) await sleep(150);
    var an = function () { return !!document.getElementById('lm-analytics'); };
    if (CC && CC.open && window.LMAnalytics) {
      LMAnalytics.open();
      for (var w2 = 0; w2 < 40 && !an(); w2++) await sleep(150);
      if (an()) {
        CC.open();
        await sleep(200);
        var q = document.getElementById('lm-cc-q');
        if (q) q.focus();
        await esc();
        await sleep(150);
        info.ccOverAnalytics = { cc: CC.isOpen(), analytics: an() };
        if (CC.isOpen() || !an()) fail.push('Esc in the Command Centre over Analytics: ' + JSON.stringify(info.ccOverAnalytics));
        if (CC.isOpen()) CC.close();
        unfocus();
        await esc();
        await sleep(150);
        if (an()) fail.push('Analytics: the second Esc did not close it');
      } else info.ccOverAnalytics = 'Analytics did not open';
    } else info.ccOverAnalytics = 'skipped';
  } catch (e) { fail.push('cc over analytics: ' + e); }
  try { if (window.LMCommandCentre && LMCommandCentre.isOpen()) LMCommandCentre.close(); } catch (e) { }
  try { var a2 = document.getElementById('lm-analytics-close'); if (a2) a2.click(); } catch (e) { }
  try { if (!dirOn && window.LMDirector && LMDirector.enabled && LMDirector.disable) LMDirector.disable(); } catch (e) { }
  if (menu0 && window.application && application.showMenu && !menuShown()) application.showMenu();
  return { fail: fail, info: info };
})()
