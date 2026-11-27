// Phone run: the minimap, the compact leaderboard and the left-row buttons that do nothing in the menu
// (wave, ping, zoom) take no taps while the main menu is open, and take them again once it is
// hidden. Up to 3.702 they kept inline pointer-events:auto!important and lay over skin slots and
// World Spectate on a 640x360 phone (SMOKE_VIEWPORT=640x360). The phone preferences are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application;
  var mm = document.getElementById('minimap-hud'), lb = document.getElementById('leaderboard-hud');
  if (!H || !app || !mm || !lb) return { fail: ['phone controls missing'] };
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var set = function (id, on) { var cb = document.getElementById(id); if (cb && cb.checked !== on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); } };
  var pe = function (el) { return el ? getComputedStyle(el).pointerEvents : 'missing'; };
  try {
    ['lm-lbc', 'lm-pingbtn', 'lm-zoombtn'].forEach(function (id) { set(id, true); });
    await sleep(100);
    var c = H.controls();
    var act = ['wave', 'ping', 'zoomIn', 'zoomOut'];
    app.showMenu();
    for (var w1 = 0; w1 < 20 && !document.body.classList.contains('lm-menu'); w1++) await sleep(100);
    await sleep(100);
    info.menu = { minimap: pe(mm), leaderboard: pe(lb) };
    if (pe(mm) !== 'none') fail.push('menu open: the minimap takes taps (' + pe(mm) + ')');
    if (pe(lb) !== 'none') fail.push('menu open: the compact leaderboard takes taps (' + pe(lb) + ')');
    act.forEach(function (k) { if (c[k] && pe(c[k]) !== 'none') fail.push('menu open: ' + k + ' takes taps'); });
    ['menu', 'gear'].forEach(function (k) { if (c[k] && pe(c[k]) === 'none') fail.push('menu open: ' + k + ' takes no taps'); });
    /* nothing of the phone HUD is the topmost element over a skin slot */
    var hits = [];
    document.querySelectorAll('[id^="profile-"]').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return;
      var t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (t && (mm.contains(t) || lb.contains(t))) hits.push(s.id);
    });
    if (hits.length) fail.push('menu open: the minimap or leaderboard is over ' + hits.join(','));
    /* a two-finger pinch on the open menu changes the HUD scale of the game HUD too (--lm-hud-scale)
     * and saves it; up to 3.702 only the menu followed and nothing saved it */
    var keepTheme = null; try { keepTheme = localStorage.getItem('ogarioThemeSettings'); } catch (e) { }
    var hs0 = defaultSettings.hudScale;
    try {
      var tch = function (id, x) { return new Touch({ identifier: id, target: ov, clientX: x, clientY: 200 }); };
      var fire = function (type, a, b) { var l = [tch(1, a), tch(2, b)]; ov.dispatchEvent(new TouchEvent(type, { touches: l, targetTouches: l, changedTouches: l, bubbles: true, cancelable: true })); };
      fire('touchstart', 300, 400);
      for (var px = 1; px <= 10; px++) fire('touchmove', 300 + px * 5, 400 - px * 5);
      ov.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [tch(1, 350), tch(2, 350)], bubbles: true }));
      var cssHs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lm-hud-scale'));
      info.pinch = { from: hs0, to: defaultSettings.hudScale, shown: window.lmHudScale && window.lmHudScale(), css: cssHs };
      if (!(defaultSettings.hudScale < hs0)) fail.push('menu pinch did not change hudScale');
      else if (!(Math.abs(cssHs - window.lmHudScale()) < 0.005)) fail.push('menu pinch: the game HUD scale is ' + cssHs + ', the shown scale ' + window.lmHudScale());
      await sleep(800);
      var saved = null; try { saved = JSON.parse(localStorage.getItem('ogarioThemeSettings') || 'null'); } catch (e) { }
      if (!saved || Math.abs(saved.hudScale - defaultSettings.hudScale) > 1e-9) fail.push('menu pinch: the HUD scale was not saved (' + (saved && saved.hudScale) + ')');
    } finally {
      defaultSettings.hudScale = hs0; if (window.ogario) ogario.hudScale = hs0;
      if (window.Settings && Settings.setHudScale) Settings.setHudScale();
      try { if (keepTheme === null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', keepTheme); } catch (e) { }
    }
    app.hideMenu();
    for (var w2 = 0; w2 < 20 && document.body.classList.contains('lm-menu'); w2++) await sleep(100);
    await sleep(100);
    info.game = { minimap: pe(mm), leaderboard: pe(lb) };
    if (pe(mm) !== 'auto') fail.push('menu hidden: the minimap takes no taps (' + pe(mm) + ')');
    if (pe(lb) !== 'auto') fail.push('menu hidden: the compact leaderboard takes no taps (' + pe(lb) + ')');
    act.forEach(function (k) { if (c[k] && pe(c[k]) === 'none') fail.push('menu hidden: ' + k + ' takes no taps'); });
    /* a tap enlarges the minimap: Split, Feed, 4x and 16x move off it within a moment (up to 3.702
     * only on the 5 s poll), and back once a second tap shrinks it */
    var R = function (el) { var r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
    var hit = function (a, b) { return a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1; };
    var btns = ['split', 'feed', 'x4', 'x16'].filter(function (k) { return c[k] && c[k].getClientRects().length; });
    var at0 = btns.map(function (k) { return R(c[k]); });
    mm.dispatchEvent(new Event('touchstart'));
    await sleep(700);
    info.bigMinimap = [R(mm).l, R(mm).t, R(mm).r, R(mm).b].map(Math.round);
    btns.forEach(function (k) { if (hit(R(c[k]), R(mm))) fail.push('enlarged minimap covers ' + k); });
    mm.dispatchEvent(new Event('touchstart'));
    await sleep(700);
    btns.forEach(function (k, i) { var r = R(c[k]); if (Math.abs(r.l - at0[i].l) > 1 || Math.abs(r.t - at0[i].t) > 1) fail.push(k + ' not back in place after the minimap shrank: ' + [r.l, r.t].map(Math.round) + ' (was ' + [at0[i].l, at0[i].t].map(Math.round) + ')'); });
    /* compact leaderboard: a tap on a player's mass / sector entry only targets (its click); a tap
     * elsewhere on the leaderboard changes the rows. Up to 3.702 the entry did both. */
    var span = lb.querySelector('.lb-data'), own = null;
    if (!span) { own = span = document.createElement('span'); span.className = 'lb-data'; lb.appendChild(span); }
    var ex0 = lb._lmExpanded;
    span.dispatchEvent(new Event('touchstart', { bubbles: true }));
    if (lb._lmExpanded !== ex0) fail.push('compact leaderboard: a tap on a mass entry changed the rows (' + ex0 + ' -> ' + lb._lmExpanded + ')');
    lb.dispatchEvent(new Event('touchstart', { bubbles: true }));
    if (lb._lmExpanded === ex0) fail.push('compact leaderboard: a tap on it no longer changes the rows');
    while (lb._lmExpanded !== ex0) lb.dispatchEvent(new Event('touchstart', { bubbles: true }));
    if (own) own.remove();
  } finally {
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
