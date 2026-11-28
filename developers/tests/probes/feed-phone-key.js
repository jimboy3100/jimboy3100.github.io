// Phone run: macro feed held on the Feed button and on the keyboard (E) at once, with real E key
// presses: letting E go keeps feeding while the Feed button is still held, and letting the button go
// then stops it; the other way round too. Up to 3.702 letting E go stopped the feed the Feed button
// still held (the button was not one of the holders the game asks). app.feed is counted, not run.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var frames = function (n) { return new Promise(function (res) { (function f() { if (n-- <= 0) res(); else requestAnimationFrame(f); })(); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application;
  if (!H || !app || typeof app.macroFeed !== 'function' || typeof hotkeys !== 'object') return { fail: ['phone controls, application.macroFeed or hotkeys missing'] };
  if (hotkeys.E !== 'hk-macroFeed') return { skip: 'E is not macro feed: ' + hotkeys.E };
  var bFeed = H.controls().feed;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'fk' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var key = function (type) { return send({ type: type, key: 'e', code: 'KeyE', keyCode: 69 }); };
  var touch = function (type) {
    var r = bFeed.getBoundingClientRect();
    var t = new Touch({ identifier: 91, target: bFeed, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    var on = type === 'touchend' ? [] : [t];
    bFeed.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var origFeed = app.feed, feeds = 0, ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  try {
    /* true: the feed was sent (a held feed ends when the feed is refused: its player is gone) */
    app.feed = function () { feeds++; return true; };
    app.hideMenu();
    await sleep(400);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    /* the Feed button first, then E pressed and let go while the button holds */
    touch('touchstart');
    await frames(2);
    info.buttonOn = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('the Feed button did not start macro feed');
    await key('keydown');
    await sleep(60);
    await key('keyup');
    await sleep(60);
    await frames(2);
    info.afterKeyUp = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('letting E go stopped the feed the Feed button still holds');
    touch('touchend');
    await frames(2);
    info.buttonOff = !!app.macroFeedActive;
    if (app.macroFeedActive) fail.push('letting the Feed button go did not stop macro feed');
    /* E first, then the Feed button pressed and let go while E holds */
    await key('keydown');
    await sleep(60);
    touch('touchstart');
    await frames(2);
    touch('touchend');
    await frames(2);
    info.keyStillHeld = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('letting the Feed button go stopped the feed E still holds');
    await key('keyup');
    await sleep(60);
    info.keyOff = !!app.macroFeedActive;
    if (app.macroFeedActive) fail.push('letting E go at the end did not stop macro feed');
    info.feeds = feeds;
  } catch (e) { fail.push('feed: ' + e); }
  try { touch('touchend'); } catch (e) { }
  try { app.macroFeed(false); } catch (e) { }
  app.feed = origFeed;
  if (typeof keyBlind === 'object') keyBlind.E = false;
  if (menuWas) app.showMenu();
  return { fail: fail, info: info };
})()
