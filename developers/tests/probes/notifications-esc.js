// Notification centre opened with a real click / tap on the bell, then a real Esc key press: the
// panel closes and the menu stays as it was. Until 3.689 Esc only worked with the focus inside the
// panel; after a tap on the bell the panel stayed open and Esc opened the menu over the game.
// With Analytics opened over the panel, Esc closes Analytics first, the next Esc the panel.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !window.LMNotifications; w++) await sleep(250);
  var N = window.LMNotifications, s = window.legendmod5, app = window.application;
  if (!N) return { skip: 'LMNotifications missing' };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (o) {
    return new Promise(function (res) {
      var id = 'ne' + Date.now() + Math.random();
      o.id = id;
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(o));
    });
  };
  var tap = function (el) { var r = el.getBoundingClientRect(); return send({ type: mobile ? 'tap' : 'click', x: r.left + r.width / 2, y: r.top + r.height / 2 }); };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var keep = s.notificationCentre, aside = [];
  var panelOpen = function () { var p = document.getElementById('lm-notif-panel'); return !!(p && p.style.display !== 'none'); };
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  try {
    app.setSettings('notificationCentre', true);
    N.refresh();
    app.hideMenu();
    await sleep(400);
    var bell = document.getElementById('lm-notif-bell');
    if (!bell) return { fail: ['no bell with the option on'], info: info };
    if (!(await tap(bell))) return { fail: ['the harness did not send the input'], info: info };
    await sleep(300);
    if (!panelOpen()) return { fail: ['a tap on the bell did not open the panel'], info: info };
    info.focus = document.activeElement && (document.activeElement.id || document.activeElement.tagName);
    var menuBefore = $('#overlays').is(':visible');
    await esc();
    await sleep(300);
    info.menu = [menuBefore, $('#overlays').is(':visible')];
    if (panelOpen()) fail.push('Esc left the panel open');
    if ($('#overlays').is(':visible') !== menuBefore) fail.push('Esc ' + (menuBefore ? 'closed' : 'opened') + ' the menu');
    /* two windows: the one in front closes */
    if (window.LMAnalytics) {
      N.open();
      await sleep(100);
      LMAnalytics.open('dash');
      await sleep(300);
      await esc();
      await sleep(300);
      info.two = [LMAnalytics.isOpen(), panelOpen()];
      if (LMAnalytics.isOpen() || !panelOpen()) fail.push('first Esc with Analytics over the panel: Analytics ' + (LMAnalytics.isOpen() ? 'open' : 'closed') + ', panel ' + (panelOpen() ? 'open' : 'closed'));
      await esc();
      await sleep(300);
      if (panelOpen()) fail.push('second Esc left the panel open');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { if (window.LMAnalytics) LMAnalytics.close(); } catch (e) { }
    try { N.close(); } catch (e) { }
    app.setSettings('notificationCentre', keep);
    N.refresh();
    app.showMenu();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
