// Phone run: the minimap, the compact leaderboard and the left-row buttons that do nothing in the menu
// (wave, ping, zoom, macros) take no taps while the main menu is open, and take them again once it is
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
    ['lm-lbc', 'lm-pingbtn', 'lm-zoombtn', 'lm-macrobtn'].forEach(function (id) { set(id, true); });
    await sleep(100);
    var c = H.controls();
    var act = ['wave', 'ping', 'zoomIn', 'zoomOut', 'm1'];
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
    app.hideMenu();
    for (var w2 = 0; w2 < 20 && document.body.classList.contains('lm-menu'); w2++) await sleep(100);
    await sleep(100);
    info.game = { minimap: pe(mm), leaderboard: pe(lb) };
    if (pe(mm) !== 'auto') fail.push('menu hidden: the minimap takes no taps (' + pe(mm) + ')');
    if (pe(lb) !== 'auto') fail.push('menu hidden: the compact leaderboard takes no taps (' + pe(lb) + ')');
    act.forEach(function (k) { if (c[k] && pe(c[k]) === 'none') fail.push('menu hidden: ' + k + ' takes no taps'); });
  } finally {
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
