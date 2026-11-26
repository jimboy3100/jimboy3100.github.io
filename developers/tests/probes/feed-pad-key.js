// Macro feed held on a gamepad (B, the default "feed" button) and on the keyboard (E) at once, with a
// real E key press: letting E go keeps feeding while the pad button is still held, and letting the pad
// button go then stops it; the other way round too. Until 3.693 letting E go stopped the feed the pad
// was still holding. The pad is a stand-in for navigator.getGamepads; everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var frames = function (n) { return new Promise(function (res) { (function f() { if (n-- <= 0) res(); else requestAnimationFrame(f); })(); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  var app = window.application, G = window.LMGamepad;
  if (!app || !G || typeof G.getMap !== 'function' || typeof hotkeys !== 'object') return { fail: ['application, gamepad or hotkeys missing'] };
  if (hotkeys.E !== 'hk-macroFeed') return { skip: 'E is not macro feed: ' + hotkeys.E };
  if (G.getMap()[1] !== 'feed') return { skip: 'pad button B is not feed' };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'fp' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var key = function (type) { return send({ type: type, key: 'e', code: 'KeyE', keyCode: 69 }); };
  var buttons = [];
  for (var i = 0; i < 17; i++) buttons.push({ pressed: false, touched: false, value: 0 });
  var pad = { index: 0, id: 'probe pad', connected: true, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0], buttons: buttons };
  var hasOwnGp = Object.prototype.hasOwnProperty.call(navigator, 'getGamepads'), origGp = navigator.getGamepads;
  var ov = document.getElementById('overlays'), ovDisp = ov ? ov.style.display : '';
  var origFeed = app.feed, feeds = 0;
  var B = function (down) { buttons[1].pressed = down; buttons[1].value = down ? 1 : 0; pad.timestamp++; };
  try {
    app.feed = function () { feeds++; };
    if (ov) ov.style.display = 'none';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    /* a headless window never has the focus, and the pad acts on nothing without it */
    document.hasFocus = function () { return true; };
    Object.defineProperty(navigator, 'getGamepads', { configurable: true, writable: true, value: function () { return [pad]; } });
    window.dispatchEvent(new Event('gamepadconnected'));
    /* pad first, then E pressed and let go while the pad holds */
    B(true);
    await frames(4);
    info.padOn = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('pad B held did not start macro feed');
    await key('keydown');
    await sleep(60);
    await key('keyup');
    await sleep(60);
    await frames(3);
    info.afterKeyUp = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('letting E go stopped the feed the pad button still holds');
    B(false);
    await frames(4);
    info.padOff = !!app.macroFeedActive;
    if (app.macroFeedActive) fail.push('letting the pad button go did not stop macro feed');
    /* E first, then the pad pressed and let go while E holds */
    await key('keydown');
    await sleep(60);
    B(true);
    await frames(4);
    B(false);
    await frames(4);
    info.keyStillHeld = !!app.macroFeedActive;
    if (!app.macroFeedActive) fail.push('letting the pad button go stopped the feed E still holds');
    await key('keyup');
    await sleep(60);
    info.keyOff = !!app.macroFeedActive;
    if (app.macroFeedActive) fail.push('letting E go at the end did not stop macro feed');
    info.feeds = feeds;
  } catch (e) { fail.push('feed: ' + e); }
  B(false);
  await frames(4);
  try { app.macroFeed(false); } catch (e) { }
  if (hasOwnGp) navigator.getGamepads = origGp; else delete navigator.getGamepads;
  delete document.hasFocus;
  window.dispatchEvent(new Event('gamepaddisconnected'));
  await frames(3);
  app.feed = origFeed;
  if (ov) ov.style.display = ovDisp;
  if (typeof keyBlind === 'object') keyBlind.E = false;
  return { fail: fail, info: info };
})()
