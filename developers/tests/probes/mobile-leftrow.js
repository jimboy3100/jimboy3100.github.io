// Phone run: with every optional left-row button on (quick chat 1-4, multibox, ping, zoom +/-, free
// spectate, quick respawn, macros M1-M3) every phone control is on the screen and the left row stays off Split / Feed, 4x / 16x and
// the minimap (it wraps upward). Up to 3.698 the row ran under Feed on a 915x412 phone and past the right
// edge of a 640x360 one (SMOKE_VIEWPORT=640x360). The usual row (options off) keeps one row.
// The phone preferences are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, drawer = document.getElementById('lm-drawer');
  if (!H || !app || !drawer) return { fail: ['phone controls missing'] };
  var IDS = ['lm-qcmd', 'lm-mbbtn', 'lm-pingbtn', 'lm-zoombtn', 'lm-freespec', 'lm-respbtn', 'lm-macrobtn'];
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var set = function (on) { IDS.forEach(function (id) { var cb = document.getElementById(id); if (cb && cb.checked !== on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); } }); };
  var R = function (el) { var r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  var hit = function (a, b) { return a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1; };
  info.screen = [innerWidth, innerHeight];
  try {
    app.hideMenu();
    set(false);
    H.reposition();
    await sleep(100);
    info.usualRow = Math.round(R(drawer).h);
    /* (a portrait phone has no room for one row: it wraps there too, under the rotate overlay) */
    if (info.usualRow > 50 && innerWidth > innerHeight) fail.push('the usual left row (options off) is ' + info.usualRow + ' px high (more than one row)');
    set(true);
    H.reposition();
    await sleep(200);
    var c = H.controls(), mine = [], others = [];
    for (var k in c) {
      if (!c[k] || !c[k].getClientRects().length) continue;
      var r = R(c[k]);
      if (r.w < 1) continue;
      if (r.l < -0.5 || r.t < -0.5 || r.r > innerWidth + 0.5 || r.b > innerHeight + 0.5) fail.push(k + ' off screen: ' + [r.l, r.t, r.r, r.b].map(Math.round).join(','));
      if (drawer.contains(c[k])) mine.push([k, r]); else if (k !== 'menu') others.push([k, r]);
    }
    var mm = document.getElementById('minimap-hud');
    if (mm && mm.getClientRects().length) others.push(['minimap', R(mm)]);
    mine.forEach(function (a) { others.forEach(function (b) { if (hit(a[1], b[1])) fail.push('left-row ' + a[0] + ' overlaps ' + b[0]); }); });
    info.rowWithOptions = [R(drawer).l, R(drawer).t, R(drawer).r, R(drawer).b].map(Math.round);
    /* Button size (gear panel) scales the left group too, and the row still ends before Feed and the
     * minimap at 50 % and 150 %. Up to 3.702 the left group stayed at 100 % (a stylesheet
     * transform:none!important beat it) while the row's room was divided by the size, so at 50 %
     * it ran under Feed and the minimap. */
    var bs = document.getElementById('lm-bs'), rootL = document.getElementById('lm-mc-l');
    if (bs && rootL) {
      for (var si = 0; si < 2; si++) {
        var pct = si ? 150 : 50;
        bs.value = String(pct);
        bs.dispatchEvent(new Event('input', { bubbles: true }));
        bs.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(200);
        var tf = getComputedStyle(rootL).transform, m = /^matrix\(([-\d.e]+)/.exec(tf || '');
        info['leftTransform' + pct] = tf;
        if (!m || Math.abs(parseFloat(m[1]) - pct / 100) > 0.01) fail.push('Button size ' + pct + ' %: the left group is drawn at ' + tf);
        var c2 = H.controls(), mm2 = document.getElementById('minimap-hud'), oth2 = [];
        for (var k2 in c2) if (c2[k2] && c2[k2].getClientRects().length && !drawer.contains(c2[k2]) && k2 !== 'menu' && R(c2[k2]).w >= 1) oth2.push([k2, R(c2[k2])]);
        if (mm2 && mm2.getClientRects().length) oth2.push(['minimap', R(mm2)]);
        for (var k3 in c2) {
          if (!c2[k3] || !drawer.contains(c2[k3]) || !c2[k3].getClientRects().length) continue;
          var r3 = R(c2[k3]);
          if (r3.w < 1) continue;
          if (r3.r > innerWidth + 0.5 || r3.t < -0.5) fail.push('Button size ' + pct + ' %: ' + k3 + ' off screen');
          oth2.forEach(function (b) { if (hit(r3, b[1])) fail.push('Button size ' + pct + ' %: left-row ' + k3 + ' overlaps ' + b[0]); });
        }
      }
    }
  } finally {
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
