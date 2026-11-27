// Phone run, two fixes of the mobile audit kept working: (1) with the gear moved by a control-editor
// layout, turning quick chat / multibox / ping on and off and a settings profile reload throw nothing,
// the buttons land in the left row and a tap on the moved gear still opens the phone settings; (2) a
// ping choice held open (hold on the ping button) is closed by the menu opening and sends nothing.
// The stored layouts, the phone preferences and the menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application;
  if (!H || !app) return { fail: ['phone controls or application missing'] };
  var KEY = 'lm-mobile-layouts', stored = null, keepPrefs = null;
  try { stored = localStorage.getItem(KEY); keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length), keepPing = app.sendTeamPing;
  var set = function (id, on) { var cb = document.getElementById(id); cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); };
  var touch = function (type, el, id) {
    var r = el.getBoundingClientRect(), t = new Touch({ identifier: id, target: el, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    var on = type === 'touchend' ? [] : [t];
    el.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var errs = [], onErr = function (e) { errs.push(String(e.message || e)); };
  window.addEventListener('error', onErr);
  try {
    H.openEditor();
    for (var i = 0; i < 40 && !(window.LMMobileEditor && window.LMMobileEditor.ready && document.getElementById('lm-ed')); i++) await sleep(200);
    var E = window.LMMobileEditor;
    if (!E) return { fail: ['control editor did not load'], info: info };
    E.close(false);
    var o = innerWidth >= innerHeight ? 'landscape' : 'portrait', st = { v: 1, current: { landscape: null, portrait: null }, named: {}, active: null, snap: true, barBottom: false };
    st.current[o] = { controls: { gear: { cx: 0.45, cy: 0.4, s: 1 } } };
    localStorage.setItem(KEY, JSON.stringify(st));
    E.reload();
    app.hideMenu();
    await sleep(300);
    var drawer = H.root.drawer, gear = H.controls().gear;
    if (drawer.contains(gear)) fail.push('the layout did not move the gear');
    try {
      ['lm-qcmd', 'lm-mbbtn', 'lm-pingbtn'].forEach(function (id) { set(id, true); set(id, false); set(id, true); });
      H.reloadPrefs();
    } catch (e) { fail.push('toggling with the gear moved threw: ' + e); }
    var c = H.controls();
    ['q1', 'multibox', 'ping'].forEach(function (k) { if (!c[k] || !drawer.contains(c[k])) fail.push(k + ' not in the left row with the gear moved'); });
    var sp = document.getElementById('lm-sp');
    touch('touchstart', gear, 31); touch('touchend', gear, 31);
    info.panel = sp && sp.classList.contains('on');
    if (!info.panel || !sp.getClientRects().length) fail.push('a tap on the moved gear did not open the phone settings');
    touch('touchstart', gear, 32); touch('touchend', gear, 32);
    /* a ping choice held open, then the menu opens */
    var sent = [];
    app.sendTeamPing = function (t) { sent.push(t); };
    var ping = H.controls().ping, rad = document.getElementById('lm-ping-rad');
    touch('touchstart', ping, 33);
    await sleep(450);
    info.radialOpen = !!(rad && rad.style.display === 'block');
    if (!info.radialOpen) fail.push('holding the ping button did not open the ping choice');
    app.showMenu();
    await sleep(300);
    if (rad && rad.style.display !== 'none') fail.push('the menu opening left the ping choice open');
    touch('touchend', ping, 33);
    await sleep(50);
    info.sent = sent.slice();
    if (sent.length) fail.push('a ping was sent after the menu closed the choice: ' + sent.join(','));
    if (errs.length) fail.push('page errors: ' + errs.slice(0, 3).join(' | '));
  } finally {
    window.removeEventListener('error', onErr);
    app.sendTeamPing = keepPing;
    try { if (stored === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, stored); } catch (e) { }
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (window.LMMobileEditor && window.LMMobileEditor.reload) window.LMMobileEditor.reload();
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
