// Phone run, control editor layouts: a control moved out of its group (here Chat, to the middle of the
// screen) takes no taps while the main menu is open, so it cannot eat the menu's taps; the gear (phone
// settings) and the menu button stay usable. Up to 3.698 only Split, Feed, 4x, 16x and Wave did that.
// In the editor, a control dragged onto the leaderboard is reported as overlapping it (it was not).
// The stored layouts and the menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application;
  if (!H || !app) return { fail: ['phone controls or application missing'] };
  var KEY = 'lm-mobile-layouts', stored = null;
  try { stored = localStorage.getItem(KEY); localStorage.removeItem(KEY); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var center = function (el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  var touch = function (type, el, id, x, y, ended) {
    var t = new Touch({ identifier: id, target: el, clientX: x, clientY: y });
    var on = ended ? [] : [t];
    el.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  try {
    /* the editor file is loaded by opening the editor once */
    H.openEditor();
    for (var i = 0; i < 40 && !(window.LMMobileEditor && window.LMMobileEditor.ready && document.getElementById('lm-ed')); i++) await sleep(200);
    var E = window.LMMobileEditor;
    if (!E || !document.getElementById('lm-ed')) return { fail: ['control editor did not open'], info: info };
    /* drag Split onto the leaderboard */
    var lb = document.getElementById('leaderboard-hud'), p = document.querySelector('#lm-ed [data-ed="split"]');
    if (lb && lb.getClientRects().length && p) {
      var lr = lb.getBoundingClientRect(), c = center(p), tx = lr.left + lr.width / 2, ty = lr.top + Math.min(40, lr.height / 2);
      touch('touchstart', p, 9, c.x, c.y);
      for (var k = 1; k <= 4; k++) { touch('touchmove', p, 9, c.x + (tx - c.x) * k / 4, c.y + (ty - c.y) * k / 4); await sleep(10); }
      touch('touchend', p, 9, tx, ty, true);
      await sleep(30);
      info.overlaps = JSON.stringify(E._overlaps || []);
      if (!(E._overlaps || []).some(function (pr) { return pr.indexOf('split') >= 0 && pr.indexOf('leaderboard') >= 0; })) fail.push('Split dragged onto the leaderboard is not reported: ' + info.overlaps);
    } else info.overlaps = 'no leaderboard shown';
    E.close(false);
    /* Chat and the gear moved to the middle, the menu open */
    var o = innerWidth >= innerHeight ? 'landscape' : 'portrait', st = { v: 1, current: { landscape: null, portrait: null }, named: {}, active: null, snap: true, barBottom: false };
    st.current[o] = { controls: { chat: { cx: 0.5, cy: 0.5, s: 1 }, gear: { cx: 0.35, cy: 0.5, s: 1 } } };
    localStorage.setItem(KEY, JSON.stringify(st));
    E.reload();
    app.showMenu();
    await sleep(600);
    var ctl = H.controls();
    if (!document.body.classList.contains('lm-menu')) fail.push('the menu state class is missing');
    var cc = center(ctl.chat), gc = center(ctl.gear);
    var atChat = document.elementFromPoint(cc.x, cc.y), atGear = document.elementFromPoint(gc.x, gc.y);
    info.atChat = atChat ? (atChat.id || atChat.className || atChat.tagName) : null;
    if (atChat === ctl.chat || ctl.chat.contains(atChat)) fail.push('the moved Chat button takes taps over the open menu');
    if (!(atGear === ctl.gear || ctl.gear.contains(atGear))) fail.push('the moved gear does not take taps with the menu open (covered by ' + info.atChat + ')');
    if (!ctl.chat.getClientRects().length) fail.push('the moved Chat button is hidden in the menu (it should only take no taps)');
  } finally {
    try { if (window.LMMobileEditor && window.LMMobileEditor.isOpen && window.LMMobileEditor.isOpen()) window.LMMobileEditor.close(false); } catch (e) { }
    try { if (stored === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, stored); } catch (e) { }
    if (window.LMMobileEditor && window.LMMobileEditor.reload) window.LMMobileEditor.reload();
    if (!menuWas) app.hideMenu();
  }
  return { fail: fail, info: info };
})()
