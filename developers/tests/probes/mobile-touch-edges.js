// Phone run: (1) the ping choice (hold the ping button) stays on the screen with a long translation
// (Polish "Niebezpieczeństwo" on the left choice reached past the left edge when held near it);
// (2) the finger that closes the chat box with a tap on the game does not make a pinch with a second
// finger put down meanwhile (the map zoomed). The wheel events the pinch would send are caught before
// the game sees them; the ping is counted, not sent; preferences, texts and the menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, canvas = document.getElementById('canvas');
  if (!H || !app || !canvas) return { fail: ['phone controls, application or canvas missing'] };
  var mkT = function (el, id, x, y) { return new Touch({ identifier: id, target: el, clientX: x, clientY: y }); };
  var send = function (el, type, changed, all) {
    el.dispatchEvent(new TouchEvent(type, { touches: all, targetTouches: all, changedTouches: changed, bubbles: true, cancelable: true }));
  };
  var keepPrefs = null;
  try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var keepPing = app.sendTeamPing, keepChat = app.enterChatMessage, wheels = 0;
  var eatWheel = function (e) { if (e.target === canvas) { wheels++; e.stopImmediatePropagation(); e.preventDefault(); } };
  try {
    app.sendTeamPing = function () { };
    app.enterChatMessage = function () { };
    var p = {};
    try { p = JSON.parse(keepPrefs || '{}') || {}; } catch (e) { p = {}; }
    p.pingBtn = true;
    localStorage.setItem('lm-mobile-prefs', JSON.stringify(p));
    H.reloadPrefs();
    app.hideMenu();
    await sleep(400);
    /* (1) */
    var ping = H.controls().ping, rad = document.getElementById('lm-ping-rad');
    if (!ping || !rad) fail.push('the ping button or its choice was not built');
    else {
      rad.children[1].innerHTML = '⚠ Niebezpieczeństwo';
      var t0 = mkT(ping, 61, 30, innerHeight - 40), t1 = mkT(ping, 61, 30, innerHeight - 10);
      send(ping, 'touchstart', [t0], [t0]);
      send(ping, 'touchmove', [t1], [t1]);
      var out = [];
      [].forEach.call(rad.children, function (it) {
        var q = it.getBoundingClientRect();
        if (q.left < 0 || q.right > innerWidth || q.top < 0 || q.bottom > innerHeight) out.push(it.textContent + ' ' + [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)].join(','));
      });
      info.radShown = getComputedStyle(rad).display;
      if (info.radShown === 'none') fail.push('the ping choice did not open');
      if (out.length) fail.push('ping choices past the screen edge: ' + out.join(' | '));
      send(ping, 'touchcancel', [t1], []);
    }
    /* (2) */
    window.addEventListener('wheel', eatWheel, true);
    var bChat = H.controls().chat, ct = mkT(bChat, 62, 1, 1);
    send(bChat, 'touchstart', [ct], [ct]);
    send(bChat, 'touchend', [ct], []);
    await sleep(50);
    var a = mkT(canvas, 63, innerWidth * 0.4, innerHeight * 0.5);
    send(canvas, 'touchstart', [a], [a]);
    var b = mkT(canvas, 64, innerWidth * 0.5, innerHeight * 0.5);
    send(canvas, 'touchstart', [b], [a, b]);
    var a2 = mkT(canvas, 63, innerWidth * 0.3, innerHeight * 0.5), b2 = mkT(canvas, 64, innerWidth * 0.6, innerHeight * 0.5);
    send(canvas, 'touchmove', [a2, b2], [a2, b2]);
    send(canvas, 'touchend', [a2, b2], []);
    window.removeEventListener('wheel', eatWheel, true);
    info.pinchWheels = wheels;
    if (wheels) fail.push('the finger that closed the chat box made a pinch with a second finger (' + wheels + ' zoom steps)');
  } finally {
    window.removeEventListener('wheel', eatWheel, true);
    app.sendTeamPing = keepPing; app.enterChatMessage = keepChat;
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    H.reloadPrefs();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
