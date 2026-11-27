// A window opened while the Discover window is open (a hotkey, a script) opens under Discover,
// which covers the screen. A real Esc then closes Discover, the window in front, and the next Esc
// the window under it; with the focus on the page too. Until 3.697 the Esc closed the hidden window
// under Discover (Analytics, the Spectator director) and Discover stayed open.
// Everything is closed after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !(window.LMDiscovery && window.LMAnalytics && window.LMDirector); w++) await sleep(250);
  var DC = window.LMDiscovery;
  if (!DC || !window.LMAnalytics || !window.LMDirector) return { fail: ['Discover, Analytics or the director missing'], info: info };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'deo' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 200); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var wins = [
    { name: 'Analytics', open: function () { LMAnalytics.open(); }, isOpen: function () { return LMAnalytics.isOpen(); }, close: function () { LMAnalytics.close(); } },
    { name: 'Director', open: function () { LMDirector.open(); }, isOpen: function () { return LMDirector.isOpen(); }, close: function () { LMDirector.close(); } }
  ];
  /* opening the director turns it on (a leaderboard listener): it is turned off again after */
  var dirOn = !!LMDirector.enabled;
  /* closing Discover marks its cards as seen: the stored state is put back after */
  var dcStored = null;
  try { dcStored = localStorage.getItem('lmDiscover'); } catch (e) { }
  var menu0 = (function () { var o = document.getElementById('overlays'); return !!(o && getComputedStyle(o).display !== 'none'); })();
  for (var i = 0; i < wins.length; i++) {
    var wn = wins[i];
    for (var f = 0; f < 2; f++) {
      var r = {}, tag = wn.name + (f ? ' (focus on the page)' : ' (focus in Discover)');
      try {
        DC.open('features');
        await sleep(200);
        wn.open();
        await sleep(300);
        if (!wn.isOpen() || !DC.isOpen()) { info[tag] = 'did not open'; fail.push(tag + ': did not open'); continue; }
        if (f) { var a = document.activeElement; if (a && a.blur) a.blur(); }
        r.sent = await esc();
        /* a busy phone run can deliver the key late: nothing changed yet, look again */
        for (var lw = 0; lw < 10 && DC.isOpen() && wn.isOpen(); lw++) await sleep(150);
        r.afterEsc1 = { discover: DC.isOpen(), win: wn.isOpen() };
        if (DC.isOpen() || !wn.isOpen()) fail.push(tag + ': the first Esc: ' + JSON.stringify(r.afterEsc1));
        if (DC.isOpen()) DC.close();
        var a2 = document.activeElement; if (a2 && a2.blur) a2.blur();
        await esc();
        r.afterEsc2 = wn.isOpen();
        if (wn.isOpen()) fail.push(tag + ': the second Esc did not close it');
      } catch (e) { fail.push(tag + ': ' + e); }
      info[tag] = r;
      try { if (DC.isOpen()) DC.close(); } catch (e) { }
      try { if (wn.isOpen()) wn.close(); } catch (e) { }
    }
  }
  /* the Command Centre opened over Discover closes first */
  try {
    var CC = window.LMCommandCentre;
    if (CC && CC.open) {
      DC.open('features');
      await sleep(200);
      CC.open();
      await sleep(200);
      await esc();
      info.ccOverDiscover = { cc: CC.isOpen(), discover: DC.isOpen() };
      if (CC.isOpen() || !DC.isOpen()) fail.push('Esc with the Command Centre over Discover: ' + JSON.stringify(info.ccOverDiscover));
    }
  } catch (e) { fail.push('cc over discover: ' + e); }
  try { if (window.LMCommandCentre && LMCommandCentre.isOpen()) LMCommandCentre.close(); if (DC.isOpen()) DC.close(); } catch (e) { }
  try {
    var o = document.getElementById('overlays'), shown = !!(o && getComputedStyle(o).display !== 'none');
    if (menu0 && !shown && window.application && application.showMenu) application.showMenu();
    if (!menu0 && shown && window.application && application.hideMenu) application.hideMenu();
  } catch (e) { }
  try { if (!dirOn && LMDirector.enabled && LMDirector.disable) LMDirector.disable(); } catch (e) { }
  try { if (dcStored == null) localStorage.removeItem('lmDiscover'); else localStorage.setItem('lmDiscover', dcStored); } catch (e) { }
  return { fail: fail, info: info };
})()
