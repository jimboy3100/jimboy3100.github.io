// Window stacking (ogario/modules/winstack.js): the window opened or touched last is in front.
// A stacking module window (999992, as the Analytics window was; it is part of the Replays window
// now) open, then User Scripts (a menu page) from its hotkey path: User Scripts is on top (it opened
// behind). The private room window (999990) opened over it is on top; a touch on it brings it back. The toasts stay above, and
// with one window left every z-index is back to its own. Everything is closed again at the end.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!window.LMWinStack) fail.push('LMWinStack missing (ogario/modules/winstack.js not loaded)');
  if (!window.LMPlugins || typeof window._lmRoomOpen !== 'function') return { skip: 'windows missing' };
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
    /* a module window of the stacking tier, as the module windows build theirs */
    var me = document.createElement('div'), mePanel = me, i;
    me.id = 'lm-ws-probe';
    me.className = 'lm-modal-container lm-w';
    me.style.cssText = 'position:fixed;top:60px;left:60px;width:320px;height:220px;z-index:999992;background:#123;';
    document.body.appendChild(me);
    await sleep(100);
    info.meAlone = zOf(me);
    /* it sets its own 999992 inline: alone, it keeps exactly that */
    if (info.meAlone !== '999992') fail.push('one window open: its z-index was changed (' + info.meAlone + ')');

    window.LMPlugins.open('plugins');
    await sleep(400);
    var us = document.getElementById('userscripts');
    info.usOpen = window.LMPlugins.isOpen();
    /* the menu that holds User Scripts is drawn there (a promo dialog of the menu itself may lie over it) */
    var ur = us.getBoundingClientRect(), uh = document.elementFromPoint(ur.left + ur.width / 2, ur.top + Math.min(40, ur.height / 2));
    if (!(uh && ov.contains(uh))) fail.push('User Scripts opened behind the module window (' + zOf(ov) + ' vs ' + zOf(me) + ', on top: ' + (uh ? uh.id || uh.className : '-') + ')');
    /* the menu keeps its own value: the Hotkeys window, colour pickers and tooltips stay above it */
    if (zOf(ov) !== ovZ) fail.push('menu z-index changed (' + ovZ + ' -> ' + zOf(ov) + ')');
    var hk = document.getElementById('hotkeys');
    if (hk && +zOf(hk) <= +zOf(ov)) fail.push('Hotkeys window below the menu');
    window.LMPlugins.close();
    await sleep(200);

    window._lmRoomOpen();
    for (i = 0; i < 30 && !document.getElementById('lm-room-modal'); i++) await sleep(100);
    var sp = document.getElementById('lm-room-modal'), spPanel = sp;
    await sleep(150);
    if (!spPanel) fail.push('the private room window did not open');
    else {
      info.z = [zOf(sp), zOf(me), zOf(ov)];
      if (!onTop(spPanel)) fail.push('the private room window opened behind the module window (' + info.z.join(' / ') + ')');
      pd(mePanel);
      await sleep(50);
      if (!onTop(mePanel)) fail.push('a touch on the module window did not bring it to the front');
      pd(spPanel);
      await sleep(50);
      if (!onTop(spPanel)) fail.push('a touch on the private room window did not bring it back to the front');
      [sp, me].forEach(function (w) { if (+zOf(w) > 999992) fail.push(w.id + ' raised above the window tiers (' + zOf(w) + ')'); });
      var tc = document.getElementById('toast-container');
      if (tc && +zOf(tc) <= +zOf(sp)) fail.push('toasts below a window');
      sp._lmClose(true);
      await sleep(300);
      if (document.getElementById('lm-room-modal') && onTop(document.getElementById('lm-room-modal'))) info.roomLeft = true;
    }
    /* the module window (and the menu, if open) left: values back to their own once only one is open */
    if (!onTop(mePanel) && !menuWas) fail.push('the module window not in front after the private room window closed');
  } finally {
    try { window.LMPlugins.close(); } catch (e) { }
    try { me.remove(); } catch (e) { }
    try { var rm = document.getElementById('lm-room-modal'); if (rm && rm._lmClose) rm._lmClose(true); } catch (e) { }
    await sleep(300);
  }
  ['lm-ws-probe', 'lm-room-modal', 'overlays'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && /99999/.test(el.style.zIndex)) fail.push(id + ' kept a raised z-index after closing (' + el.style.zIndex + ')');
  });
  return { fail: fail, info: info };
})()
