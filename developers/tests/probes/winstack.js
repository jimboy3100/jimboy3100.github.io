// Window stacking (ogario/modules/winstack.js): the window opened or touched last is in front.
// Analytics (999992) open, then User Scripts (a menu page) from its hotkey path: User Scripts is
// on top (it opened behind). Profiles (999990) opened over Analytics is on top; a touch on
// Analytics brings it back. The toasts stay above, and
// with one window left every z-index is back to its own. Everything is closed again at the end.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!window.LMWinStack) fail.push('LMWinStack missing (ogario/modules/winstack.js not loaded)');
  if (!window.LMAnalytics || !window.LMPlugins || !window.LMProfiles) return { skip: 'windows missing' };
  /* what is drawn at a point inside an element (its upper middle, clear of other windows' edges) */
  var onTop = function (el) {
    if (!el) return false;
    var r = el.getBoundingClientRect(), h = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(40, r.height / 2));
    return !!(h && el.contains(h));
  };
  var zOf = function (el) { return el ? getComputedStyle(el).zIndex : null; };
  var pd = function (el) { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 3, isPrimary: true, clientX: 5, clientY: 5 })); };
  var ov = document.getElementById('overlays'), ovZ = zOf(ov), menuWas = !!(ov && ov.offsetParent !== null && getComputedStyle(ov).display !== 'none');
  try {
    window.LMAnalytics.open();
    for (var i = 0; i < 30 && !document.getElementById('lm-analytics'); i++) await sleep(100);
    /* the Analytics window is its own panel (the window tier 999992) */
    var me = document.getElementById('lm-analytics'), mePanel = me;
    if (!mePanel) return { fail: ['Analytics did not open'] };
    await sleep(100);
    info.meAlone = zOf(me);
    if (me.style.zIndex) fail.push('one window open: its z-index was changed (' + me.style.zIndex + ')');

    window.LMPlugins.open('plugins');
    await sleep(400);
    var us = document.getElementById('userscripts');
    info.usOpen = window.LMPlugins.isOpen();
    /* the menu that holds User Scripts is drawn there (a promo dialog of the menu itself may lie over it) */
    var ur = us.getBoundingClientRect(), uh = document.elementFromPoint(ur.left + ur.width / 2, ur.top + Math.min(40, ur.height / 2));
    if (!(uh && ov.contains(uh))) fail.push('User Scripts opened behind Analytics (' + zOf(ov) + ' vs ' + zOf(me) + ', on top: ' + (uh ? uh.id || uh.className : '-') + ')');
    /* the menu keeps its own value: the Hotkeys window, colour pickers and tooltips stay above it */
    if (zOf(ov) !== ovZ) fail.push('menu z-index changed (' + ovZ + ' -> ' + zOf(ov) + ')');
    var hk = document.getElementById('hotkeys');
    if (hk && +zOf(hk) <= +zOf(ov)) fail.push('Hotkeys window below the menu');
    window.LMPlugins.close();
    await sleep(200);

    window.LMProfiles.open();
    for (i = 0; i < 30 && !document.querySelector('#lm-sp-overlay .lm-modal-container'); i++) await sleep(100);
    var sp = document.getElementById('lm-sp-overlay'), spPanel = sp && sp.querySelector('.lm-modal-container');
    await sleep(150);
    if (!spPanel) fail.push('Profiles did not open');
    else {
      info.z = [zOf(sp), zOf(me), zOf(ov)];
      if (!onTop(spPanel)) fail.push('Profiles opened behind Analytics (' + info.z.join(' / ') + ')');
      pd(mePanel);
      await sleep(50);
      if (!onTop(mePanel)) fail.push('a touch on Analytics did not bring it to the front');
      pd(spPanel);
      await sleep(50);
      if (!onTop(spPanel)) fail.push('a touch on Profiles did not bring it back to the front');
      [sp, me].forEach(function (w) { if (+zOf(w) > 999992) fail.push(w.id + ' raised above the window tiers (' + zOf(w) + ')'); });
      var tc = document.getElementById('toast-container');
      if (tc && +zOf(tc) <= +zOf(sp)) fail.push('toasts below a window');
      window.LMProfiles.close();
      await sleep(300);
      if (document.getElementById('lm-sp-overlay') && onTop(document.getElementById('lm-sp-overlay'))) info.profilesLeft = true;
    }
    /* Analytics (and the menu, if open) left: values back to their own once only one is open */
    if (!onTop(mePanel) && !menuWas) fail.push('Analytics not in front after Profiles closed');
  } finally {
    try { window.LMPlugins.close(); } catch (e) { }
    try { window.LMAnalytics.close(); } catch (e) { }
    try { window.LMProfiles.close(); } catch (e) { }
    await sleep(300);
  }
  ['lm-analytics', 'lm-sp-overlay', 'overlays'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && /99999/.test(el.style.zIndex)) fail.push(id + ' kept a raised z-index after closing (' + el.style.zIndex + ')');
  });
  return { fail: fail, info: info };
})()
