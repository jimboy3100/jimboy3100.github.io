// Phone run: the control editor opens from the gear panel, a control is dragged (overlap warning
// on the way), saved, read again from storage (clamped onto the screen, hidden only when chosen),
// and Reset puts everything back where LMmobile.js places it. The stored layouts are restored.
(async () => {
  var fail = [], info = {};
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var H = window._lmMobileHost;
  if (!H) return { fail: ['window._lmMobileHost missing (LMmobile.js hooks)'] };
  var KEY = 'lm-mobile-layouts', stored = null;
  try { stored = localStorage.getItem(KEY); localStorage.removeItem(KEY); } catch (e) { }
  var center = function (el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r }; };
  var touch = function (type, el, id, x, y, ended) {
    var t = new Touch({ identifier: id, target: el, clientX: x, clientY: y });
    var on = ended ? [] : [t];
    el.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var dragTo = async function (el, x, y) {
    var c = center(el);
    touch('touchstart', el, 7, c.x, c.y);
    for (var i = 1; i <= 4; i++) { touch('touchmove', el, 7, c.x + (x - c.x) * i / 4, c.y + (y - c.y) * i / 4); await sleep(10); }
    touch('touchend', el, 7, x, y, true);
    await sleep(30);
  };
  /* a text button by its language-pack key (its text must be that key's text), a symbol button by its text */
  var barBtn = function (id) {
    var bs = document.querySelectorAll('#lm-ed-bar button');
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].getAttribute('data-i18n') === id) return bs[i].textContent === window.lmT(id) && bs[i].textContent !== id ? bs[i] : null;
      if (bs[i].textContent === id) return bs[i];
    }
    return null;
  };
  var openEd = async function () {
    var b = document.getElementById('lm-ed-open');
    if (!b) { fail.push('no Edit controls button in the gear panel'); return false; }
    b.click();
    var t0 = Date.now();
    while (!document.getElementById('lm-ed') && Date.now() - t0 < 8000) await sleep(100);
    if (!document.getElementById('lm-ed')) { fail.push('editor did not open (LMmobile-editor.js)'); return false; }
    await sleep(50);
    return true;
  };
  try {
    if (!(await openEd())) return { fail: fail, info: info };
    var E = window.LMMobileEditor;
    var ov = document.getElementById('lm-ed'), bar = document.getElementById('lm-ed-bar');
    var orc = ov.getBoundingClientRect(), br = bar.getBoundingClientRect();
    info.bar = Math.round(br.width) + 'x' + Math.round(br.height) + ' in ' + innerWidth + 'x' + innerHeight;
    if (orc.width < innerWidth - 1 || orc.height < innerHeight - 1) fail.push('editor does not cover the screen (game input not paused)');
    if (br.left < 0 || br.top < 0 || br.right > innerWidth + 1 || br.bottom > innerHeight + 1) fail.push('editor bar outside the screen: ' + info.bar);
    if (br.height > 120) fail.push('editor bar too tall: ' + info.bar);
    ['misc.editor.save', 'misc.editor.cancel', 'misc.editor.reset', 'misc.editor.layouts'].forEach(function (t) { var b = barBtn(t); if (!b) fail.push('no ' + t + ' button'); else if (b.getBoundingClientRect().height < 32) fail.push(t + ' button too small for touch'); });
    var ids = ['joystick', 'split', 'feed', 'x4', 'x16', 'menu'];
    ids.forEach(function (id) { if (!ov.querySelector('[data-ed="' + id + '"]')) fail.push('no handle for ' + id); });
    var ctl = H.controls();
    if (ctl.split.style.visibility !== 'hidden') fail.push('real Split button still shown under the editor');
    var pSplit = ov.querySelector('[data-ed="split"]'), pFeed = ov.querySelector('[data-ed="feed"]');
    if (!pSplit || !pFeed) return { fail: fail, info: info };
    // onto Feed: overlap warning
    var f = center(pFeed);
    await dragTo(pSplit, f.x, f.y);
    var warn = document.getElementById('lm-ed-warn').textContent;
    info.warn = warn;
    if (!/Split overlaps Feed|Feed overlaps Split/.test(warn) || !pSplit.classList.contains('bad')) fail.push('no overlap warning with Split on Feed');
    // away from everything
    var tx = Math.round(innerWidth * 0.45), ty = Math.round(innerHeight * 0.55);
    await dragTo(pSplit, tx, ty);
    var moved = center(pSplit);
    info.split = Math.round(moved.x) + ',' + Math.round(moved.y);
    if (Math.abs(moved.x - tx) > 20 || Math.abs(moved.y - ty) > 20) fail.push('Split did not follow the drag: ' + info.split + ' for ' + tx + ',' + ty);
    if (pSplit.classList.contains('bad')) fail.push('Split still marked as overlapping after moving it away');
    // size and opacity of the selected control
    var w0 = moved.r.width;
    barBtn('+').click();
    await sleep(20);
    if (!(pSplit.getBoundingClientRect().width > w0 + 2)) fail.push('+ did not make Split bigger');
    var op = document.querySelector('#lm-ed-bar input[type=range]');
    op.value = '50'; op.dispatchEvent(new Event('input', { bubbles: true }));
    barBtn('misc.editor.save').click();
    await sleep(50);
    if (document.getElementById('lm-ed')) fail.push('Save did not close the editor');
    ctl = H.controls();
    var slot = ctl.split.parentNode;
    if (!slot || !/lm-ed-slot/.test(slot.className)) fail.push('Split not placed by the layout');
    if (ctl.split.style.visibility === 'hidden') fail.push('Split still invisible after saving');
    var sc = center(ctl.split);
    info.placed = Math.round(sc.x) + ',' + Math.round(sc.y);
    if (Math.abs(sc.x - moved.x) > 6 || Math.abs(sc.y - moved.y) > 6) fail.push('Split saved at ' + info.placed + ', edited at ' + info.split);
    if (slot && Math.abs(Number(slot.style.opacity) - 0.5) > 0.01) fail.push('per-button opacity not applied: ' + slot.style.opacity);
    if (ctl.feed.parentNode !== H.root.right) fail.push('Feed (not edited) left its usual group');
    var st = E.store(), o = innerWidth >= innerHeight ? 'landscape' : 'portrait';
    if (!(st.current[o] && st.current[o].controls.split)) fail.push('layout not stored for ' + o);
    // the 2.5 s placement next to the minimap does not move it
    H.reposition();
    await sleep(20);
    var sc2 = center(ctl.split);
    if (Math.abs(sc2.x - sc.x) > 1 || Math.abs(sc2.y - sc.y) > 1) fail.push('repositionButtons moved the edited Split');
    // read again from storage: an off-screen value is clamped, hide only when chosen
    var raw = JSON.parse(localStorage.getItem(KEY));
    raw.current[o].controls.split = { cx: 1, cy: 1, s: 2.5 };
    raw.current[o].controls.feed = { cx: 0.5, cy: 0.5, s: 1, hide: true };
    raw.current[o].controls.menu = { cx: 0.02, cy: 0.98, s: 1, hide: true };
    localStorage.setItem(KEY, JSON.stringify(raw));
    E.reload();
    await sleep(20);
    var r2 = ctl.split.getBoundingClientRect();
    info.clamped = Math.round(r2.left) + ',' + Math.round(r2.top) + ' ' + Math.round(r2.width);
    if (r2.left < -0.5 || r2.top < -0.5 || r2.right > innerWidth + 0.5 || r2.bottom > innerHeight + 0.5) fail.push('stored layout put Split off screen: ' + info.clamped);
    if (ctl.feed.getClientRects().length) fail.push('Feed chosen hidden but still shown');
    if (!ctl.menu.getClientRects().length) fail.push('the menu button was hidden (never allowed)');
    // the editor still shows the hidden one
    if (!(await openEd())) return { fail: fail, info: info };
    var pf = document.querySelector('#lm-ed [data-ed="feed"]');
    if (!pf || !pf.classList.contains('hid') || !pf.getClientRects().length) fail.push('editor does not show the hidden Feed');
    // named layout
    if (E.saveNamed('Probe layout') !== 'Probe layout' || !E.store().named['Probe layout']) fail.push('named layout not saved');
    // Reset
    barBtn('misc.editor.reset').click();
    await sleep(20);
    barBtn('misc.editor.save').click();
    await sleep(50);
    ctl = H.controls();
    if (ctl.split.parentNode !== H.root.right || ctl.feed.parentNode !== H.root.right) fail.push('Reset did not put Split / Feed back');
    if (ctl.menu.parentNode !== H.root.left) fail.push('Reset did not put the menu button back');
    if (document.querySelectorAll('.lm-ed-slot').length) fail.push('slots left after Reset');
    if (!ctl.feed.getClientRects().length) fail.push('Feed still hidden after Reset');
    if (E.store().current[o] !== null) fail.push('Reset left a stored layout');
    if (!E.store().named['Probe layout']) fail.push('Reset removed the named layout');
  } finally {
    try { if (stored === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, stored); } catch (e) { }
    if (window.LMMobileEditor && window.LMMobileEditor.close) window.LMMobileEditor.close(false);
    if (window.LMMobileEditor && window.LMMobileEditor.reload) window.LMMobileEditor.reload();
  }
  return { fail: fail, info: info };
})()
