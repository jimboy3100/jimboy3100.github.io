// A long leaderboard (rows the real displayLeaderboard writes) that would reach down over the minimap
// and the button rows above it is drawn smaller until it ends above them, never hidden, and at the
// HUD scale again once it is short; a HUD layout that moves the leaderboard keeps its own size.
// Phones fit their leaderboard themselves (LMmobile.js): skipped there. The real leaderboard is put back.
(async () => {
  var fail = [], info = {};
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  var app = window.application, lb = document.getElementById('leaderboard-hud'), mm = document.getElementById('minimap-hud');
  var pos = document.getElementById('leaderboard-positions');
  if (!app || typeof app.displayLeaderboard !== 'function' || !lb || !mm || !pos) return { fail: ['application, leaderboard or minimap missing'] };
  if (!lb.getClientRects().length || !mm.getClientRects().length) return { skip: 'leaderboard or minimap not shown' };
  var frames = function (n) { return new Promise(function (res) { (function f() { if (n-- <= 0) res(); else requestAnimationFrame(f); })(); }); };
  var scaleOf = function () { var m = /scale\(([\d.]+)\)/.exec(lb.style.transform); return m ? +m[1] : NaN; };
  var rowsTop = function () {
    var t = mm.getBoundingClientRect().top;
    for (var c = mm.firstElementChild; c; c = c.nextElementSibling) {
      if (c.offsetTop >= 0 || !c.getClientRects().length) continue;
      var r = c.getBoundingClientRect(); if (r.height && r.top < t) t = r.top;
    }
    return t;
  };
  var hs = typeof window.lmHudScale === 'function' ? window.lmHudScale() : 1;
  var savedPos = pos._lmHtml, savedData = document.getElementById('leaderboard-data') ? document.getElementById('leaderboard-data')._lmHtml : '';
  var ed = window.LMHudEditor, owns = ed && ed.owns;
  /* the live server's leaderboard updates stay out while the probe's rows are shown */
  var display = app.displayLeaderboard, show = function (p) { display.call(app, p, ''); };
  app.displayLeaderboard = function () { };
  try {
    /* enough rows to reach the minimap on this window (20 at 1366 x 768) */
    var n = 20, html = '';
    for (var k = 0; k < 60; k++) {
      html = '';
      for (var i = 1; i <= n; i++) html += '<span>' + i + '. <bdi>player ' + i + '</bdi></span>';
      show(html);
      lb.style.transform = 'scale(' + hs + ')';
      if (lb.getBoundingClientRect().top + lb.offsetHeight * hs > rowsTop()) break;
      n += 5;
    }
    info.rows = n;
    info.unfitBottom = Math.round(lb.getBoundingClientRect().top + lb.offsetHeight * hs);
    await frames(3);
    var r = lb.getBoundingClientRect(), top = rowsTop(), s = scaleOf();
    info.long = { scale: s, hudScale: hs, bottom: Math.round(r.bottom), minimapRowsTop: Math.round(top), shownRows: pos.children.length };
    if (pos.children.length !== n) fail.push('long leaderboard: ' + pos.children.length + ' of ' + n + ' rows shown');
    if (r.bottom > top + 0.5 && s > hs / 2 + 0.001) fail.push('long leaderboard reaches over the minimap: bottom ' + Math.round(r.bottom) + ', minimap rows top ' + Math.round(top) + ', scale ' + s);
    if (!(s >= hs / 2 - 0.001)) fail.push('long leaderboard drawn below half the HUD scale: ' + s);
    if (!(r.width > 0 && r.height > 0) || getComputedStyle(lb).display === 'none' || getComputedStyle(lb).visibility === 'hidden') fail.push('long leaderboard hidden');
    /* a HUD layout that moves the leaderboard keeps its own size */
    if (ed && typeof owns === 'function') {
      ed.owns = function (id) { return id === 'leaderboard' || owns.apply(ed, arguments); };
      if (typeof app._lmLbFit === 'function') app._lmLbFit();
      info.layoutScale = scaleOf();
      if (scaleOf() !== hs) fail.push('leaderboard moved by a HUD layout still fitted: scale ' + scaleOf() + ' (HUD scale ' + hs + ')');
      ed.owns = owns;
    }
    /* short again: the HUD scale again */
    show('<span>1. <bdi>player</bdi></span>');
    await frames(3);
    info.shortScale = scaleOf();
    if (scaleOf() !== hs) fail.push('short leaderboard not at the HUD scale again: ' + scaleOf() + ' (HUD scale ' + hs + ')');
  } finally {
    if (ed && owns) ed.owns = owns;
    app.displayLeaderboard = display;
    display.call(app, savedPos || '', savedData || '');
    await frames(2);
  }
  return { fail: fail, info: info };
})()
