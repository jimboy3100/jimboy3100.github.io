// Phone run: the clock (Settings > Stats > Show current time) is on the screen while playing and does not
// cover the leaderboard, the team list, the stats line, the minimap or the touch controls. Up to 3.697 a
// phone kept the desktop top below the leaderboard, which is below the bottom of a phone screen.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* a touch-only screen: LMmobile.js may still be loading when the probes start */
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var app = window.application, s = window.legendmod5, t = document.getElementById('time-hud');
  if (!app || !s || !t) return { fail: ['application, settings or #time-hud missing'] };
  var keep = s.showTime, ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var R = function (el) { var r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; };
  try {
    app.setSettings('showTime', true);
    if (typeof app.displayTime === 'function') app.displayTime();
    app.hideMenu();
    await sleep(1300);
    var r = t.getBoundingClientRect();
    info.clock = R(t);
    info.screen = [innerWidth, innerHeight];
    if (!(r.width > 0 && r.height > 0)) fail.push('clock not shown');
    else if (r.left < 0 || r.top < 0 || r.right > innerWidth || r.bottom > innerHeight) fail.push('clock off screen: ' + info.clock.join(','));
    var H = window._lmMobileHost, els = ['leaderboard-hud', 'leaderboard-data', 'top5-hud', 'lm-stats', 'minimap-hud', 'lm-notif-bell', 'lm-net-graph'].map(function (id) { return document.getElementById(id); });
    if (H) { var c = H.controls(); for (var k in c) if (c[k]) els.push(c[k]); }
    var hits = [];
    els.forEach(function (el) {
      if (!el || !el.getClientRects().length) return;
      var q = el.getBoundingClientRect();
      if (q.width < 1 || q.height < 1) return;
      if (q.left < r.right && r.left < q.right && q.top < r.bottom && r.top < q.bottom) hits.push(el.id || el.textContent);
    });
    /* a phone in portrait shows the rotate overlay over the game (the clock is not seen there) */
    var rot = document.getElementById('lm-portrait-ov');
    if (rot && rot.classList.contains('on')) info.rotateOverlay = hits;
    else if (hits.length) fail.push('clock covers ' + hits.join(', '));
  } finally {
    app.setSettings('showTime', keep);
    if (typeof app.displayTime === 'function') app.displayTime();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
