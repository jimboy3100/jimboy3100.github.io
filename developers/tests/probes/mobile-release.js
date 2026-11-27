// Phone run: a held Feed button and the joystick are let go when the window loses focus or is left
// (blur, pagehide), on a rotation and when a settings profile changes the phone controls, not only when
// the menu opens or the tab is hidden (up to 3.698 a Feed held through those kept feeding: the finger's
// touchend never arrives there). The game's own feed (application.macroFeed) is counted, not run.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, canvas = document.getElementById('canvas');
  if (!H || !app || !canvas || typeof app.macroFeed !== 'function') return { fail: ['phone controls, application.macroFeed or canvas missing'] };
  var bFeed = H.controls().feed, jo = document.querySelector('.lm-jo');
  var touch = function (el, type, id, x, y) {
    var t = new Touch({ identifier: id, target: el, clientX: x, clientY: y });
    var on = type === 'touchend' ? [] : [t];
    el.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var calls = [], keepFeed = app.macroFeed, ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var feeding = function () { return calls.length && calls[calls.length - 1] === true; };
  try {
    app.macroFeed = function (on) { calls.push(!!on); };
    app.hideMenu();
    await sleep(400);
    var r = bFeed.getBoundingClientRect();
    var cases = [['blur', function () { window.dispatchEvent(new Event('blur')); }],
      ['pagehide', function () { window.dispatchEvent(new Event('pagehide')); }],
      ['orientationchange', function () { window.dispatchEvent(new Event('orientationchange')); }],
      ['settings profile', function () { H.reloadPrefs(); }]];
    info.feed = {};
    for (var i = 0; i < cases.length; i++) {
      calls = [];
      touch(bFeed, 'touchstart', 50 + i, r.left + r.width / 2, r.top + r.height / 2);
      if (!feeding()) { fail.push(cases[i][0] + ': the Feed button did not start feeding'); continue; }
      cases[i][1]();
      await sleep(30);
      info.feed[cases[i][0]] = calls.join(',');
      if (feeding()) fail.push(cases[i][0] + ': a held Feed kept feeding');
      touch(bFeed, 'touchend', 50 + i, r.left + r.width / 2, r.top + r.height / 2);
    }
    /* the joystick: a thumb down on the game, then the window loses focus */
    touch(canvas, 'touchstart', 70, innerWidth * 0.25, innerHeight * 0.6);
    touch(canvas, 'touchmove', 70, innerWidth * 0.25 + 40, innerHeight * 0.6);
    var shownBefore = jo && getComputedStyle(jo).display !== 'none';
    window.dispatchEvent(new Event('blur'));
    await sleep(30);
    info.joystick = [!!shownBefore, jo && getComputedStyle(jo).display];
    if (!shownBefore) fail.push('the joystick did not show for a thumb on the game');
    else if (getComputedStyle(jo).display !== 'none') fail.push('blur: the joystick stayed held');
    touch(canvas, 'touchend', 70, innerWidth * 0.25 + 40, innerHeight * 0.6);
  } finally {
    app.macroFeed = keepFeed;
    try { keepFeed.call(app, false); } catch (e) { }
    /* the window is in front again, as after a real blur: the faked blur left Performance
     * diagnostics counting every later stall as "window not in front" (probe perf failed) */
    window.dispatchEvent(new Event('focus'));
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
