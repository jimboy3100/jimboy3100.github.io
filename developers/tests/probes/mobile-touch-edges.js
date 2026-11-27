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
    /* (3) the left row's buttons take a tap up to 1.5 px outside their 40 px circle (a 44 px tap
     * area), and the middle of the gap between two of them still takes none */
    var tc = document.getElementById('toast-container'), tcPe = tc ? tc.style.pointerEvents : '';
    if (tc) tc.style.pointerEvents = 'none';
    /* a phone held upright shows the "rotate" cover over the game: the row is checked under it */
    var po = document.getElementById('lm-portrait-ov'), poDisp = po ? po.style.display : '';
    if (po) po.style.display = 'none';
    var row = [].filter.call(H.root.drawer.children, function (el) { return el.classList.contains('lm-d') && el.getClientRects().length; });
    var pairs = 0, hits = [], gaps = [];
    for (var i = 0; i + 1 < row.length; i++) {
      var ra = row[i].getBoundingClientRect(), rb = row[i + 1].getBoundingClientRect(), y = ra.top + ra.height / 2;
      if (Math.abs(ra.top - rb.top) > 2 || rb.left <= ra.right) continue;
      pairs++;
      var e1 = document.elementFromPoint(ra.right + 1.5, y), e2 = document.elementFromPoint((ra.right + rb.left) / 2, y);
      if (!(e1 && row[i].contains(e1))) hits.push(row[i].textContent + ' (' + (e1 ? e1.tagName + '#' + e1.id + '.' + e1.className : 'none') + ')');
      if (e2 && (row[i].contains(e2) || row[i + 1].contains(e2))) gaps.push(row[i].textContent + '|' + row[i + 1].textContent);
    }
    if (tc) tc.style.pointerEvents = tcPe;
    if (po) po.style.display = poDisp;
    info.tapArea = { pairs: pairs, size: row.length ? Math.round(row[0].getBoundingClientRect().width) : 0 };
    if (!pairs) fail.push('no two buttons side by side in the left row');
    if (hits.length) fail.push('a tap just outside a left-row button missed it: ' + hits.join(', '));
    if (gaps.length) fail.push('the gap between two left-row buttons takes taps: ' + gaps.join(', '));
  } finally {
    window.removeEventListener('wheel', eatWheel, true);
    app.sendTeamPing = keepPing; app.enterChatMessage = keepChat;
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    H.reloadPrefs();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
