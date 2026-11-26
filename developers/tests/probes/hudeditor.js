// HUD editor: nothing applied without a layout; the editor opens and fits the screen, the
// leaderboard is dragged, saved, the default HUD comes back, the layout is re-applied, off-screen
// values are clamped, Reset (one box, all) works; at the end everything is as before.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var HE = window.LMHudEditor;
  if (!HE) return { fail: ['LMHudEditor missing (ogario/modules/hudeditor.js not loaded)'] };
  var KEY = 'lmHudLayouts', savedRaw = null;
  try { savedRaw = localStorage.getItem(KEY); } catch (e) { }
  var ui = function () { return window.LMHudEditorUI; };
  var isOpen = function () { return !!(ui() && ui().isOpen()); };
  var rect = function (el) { var r = el.getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };
  var near = function (a, b, tol) { return Math.abs(a.l - b.l) <= tol && Math.abs(a.t - b.t) <= tol && Math.abs(a.w - b.w) <= tol && Math.abs(a.h - b.h) <= tol; };
  var openEditor = async function () {
    HE.open();
    for (var i = 0; i < 50 && !isOpen(); i++) await sleep(100);
    await sleep(450);
    return isOpen();
  };
  var click = function (sel) { var b = document.querySelector(sel); if (!b) { fail.push(sel + ' missing'); return false; } b.click(); return true; };
  var allOnScreen = function (what) {
    var bad = [];
    HE.components.forEach(function (c) {
      /* the popups grow with the number of toasts: only checked where a layout places them */
      if (c.id === 'popups' && !HE.owns('popups')) return;
      var m = ui() && ui()._measure(c.id);
      if (!m || m.ghost) return;
      var u = m.union;
      if (u.left < -1 || u.top < -1 || u.left + u.width > innerWidth + 1 || u.top + u.height > innerHeight + 1)
        bad.push(c.id + ' [' + [u.left, u.top, u.width, u.height].map(Math.round).join(',') + ']');
    });
    if (bad.length) fail.push(what + ': off screen ' + bad.join(' '));
  };

  if (HE.active()) fail.push('a layout is active by default');
  if (document.getElementById('lm-hud-layout')) fail.push('layout stylesheet present without a layout');
  var hk = window.hotkeysCommand && hotkeysCommand['hk-hudEditor'];
  if (!hk || hk.defaultKey !== '') fail.push('hk-hudEditor missing or has a default key');
  if (!document.getElementById('lm-he-open')) fail.push('Edit HUD button missing in Theme > HUD');
  var lb = document.getElementById('leaderboard-hud');
  if (!lb) return { fail: fail.concat(['#leaderboard-hud missing']) };
  var before = rect(lb), moved = null;
  info.viewport = [innerWidth, innerHeight];
  info.lbBefore = before;

  try {
    if (!(await openEditor())) { fail.push('editor did not open'); return { fail: fail, info: info }; }
    var panel = document.getElementById('lm-he-p');
    var pr = panel.getBoundingClientRect();
    info.panel = [Math.round(pr.left), Math.round(pr.top), Math.round(pr.width), Math.round(pr.height)];
    if (pr.left < 0 || pr.top < 0 || pr.right > innerWidth + 1 || pr.bottom > innerHeight + 1) fail.push('editor panel does not fit the screen');
    ['.lm-he-done', '.lm-he-x'].forEach(function (s) {
      var b = panel.querySelector(s), r = b && b.getBoundingClientRect();
      if (!r || r.width < 28 || r.height < 28) fail.push(s + ' too small for touch');
    });
    var rows = panel.querySelectorAll('.lm-he-c').length;
    if (rows !== HE.components.length) fail.push('component list has ' + rows + ' rows');
    /* phones fold the full stats line (shown by a tap on the phone stats): it can still be placed */
    var phStats = document.getElementById('lm-stats'), stEl = document.getElementById('stats-hud');
    info.phone = !!phStats;
    if (phStats && stEl && stEl.getBoundingClientRect().width < 1) {
      var sm = ui()._measure('stats');
      if (!sm || !sm.ghost) fail.push('phone: the folded stats line has no frame (cannot be placed)');
    }
    /* every frame can be grabbed: at its centre it is on top, or a smaller frame lies over it */
    var fArea = function (el) { return el.offsetWidth * el.offsetHeight; };
    Array.prototype.forEach.call(document.querySelectorAll('#lm-he .lm-he-f'), function (f) {
      if (f.style.display === 'none') return;
      var b = f.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return;
      var hit = document.elementFromPoint(x, y), hf = hit && hit.closest ? hit.closest('.lm-he-f') : null;
      /* the panel, or the popups themselves (they are drawn above the editor) */
      if (hit && hit.closest && (hit.closest('#lm-he-p') || hit.closest('#toast-container'))) return;
      if (hf !== f && !(hf && fArea(hf) < fArea(f))) fail.push('frame ' + f.getAttribute('data-id') + ' covered by ' + (hf ? hf.getAttribute('data-id') : (hit && (hit.id || hit.className))));
    });
    var frame = document.querySelector('#lm-he .lm-he-f[data-id="leaderboard"]');
    if (!frame || frame.style.display === 'none') fail.push('no frame for the leaderboard');
    else {
      var fb = frame.getBoundingClientRect(), r0 = rect(lb);
      var x0 = fb.left + fb.width / 2, y0 = fb.top + Math.min(30, fb.height / 2);
      var dx = -Math.round(innerWidth * 0.3), dy = 30;
      var pe = function (type, x, y) {
        frame.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'mouse', isPrimary: true, clientX: x, clientY: y, button: 0, buttons: type === 'pointerup' ? 0 : 1 }));
      };
      pe('pointerdown', x0, y0);
      pe('pointermove', x0 + dx / 2, y0 + dy / 2);
      pe('pointermove', x0 + dx, y0 + dy);
      pe('pointerup', x0 + dx, y0 + dy);
      await sleep(60);
      moved = rect(lb);
      info.lbMoved = moved;
      if (Math.abs(moved.l - r0.l - dx) > 12 || Math.abs(moved.t - r0.t - dy) > 12) fail.push('leaderboard did not follow the drag (' + (moved.l - r0.l) + ',' + (moved.t - r0.t) + ' for ' + dx + ',' + dy + ')');
      if (!ui()._draft().leaderboard) fail.push('drag not in the draft');
      var fb2 = frame.getBoundingClientRect();
      if (Math.abs(fb2.left - lb.getBoundingClientRect().left) > 80) fail.push('frame did not follow the box');
    }
    allOnScreen('while editing');
    document.querySelector('#lm-he-p .lm-he-name').value = 'Probe layout';
    click('#lm-he-p .lm-he-save');
    if (HE.active() !== 'Probe layout') fail.push('Save did not activate the layout (' + HE.active() + ')');
    click('#lm-he-p .lm-he-done');
    await sleep(80);
    if (isOpen()) fail.push('Done did not close the editor');
    if (document.getElementById('lm-he')) fail.push('editor overlay left behind');
    if (moved && !near(rect(lb), moved, 2)) fail.push('saved layout not kept after closing');

    HE.applyLayout('', true);
    await sleep(30);
    if (document.getElementById('lm-hud-layout')) fail.push('default HUD: stylesheet still there');
    if (!near(rect(lb), before, 2)) fail.push('default HUD: leaderboard not back (' + JSON.stringify(rect(lb)) + ')');
    HE.applyLayout('Probe layout', true);
    await sleep(30);
    if (moved && !near(rect(lb), moved, 2)) fail.push('re-applied layout differs (' + JSON.stringify(rect(lb)) + ')');

    /* saved far off screen (another screen size): clamped on apply */
    HE.saveLayout('Probe far', {
      leaderboard: { h: 'l', x: 9000, v: 'b', y: -9000, s: 1 },
      minimap: { h: 'r', x: -500, v: 't', y: 9000, s: 2 },
      stats: { h: 'c', x: 9000, v: 'c', y: 0, s: 1 },
      chatBox: { h: 'l', x: -300, v: 'b', y: 5000, s: 1.5 },
      time: { h: 'r', x: 3000, v: 'b', y: 3000, s: 3 }
    });
    HE.applyLayout('Probe far', true);
    await sleep(60);
    allOnScreen('far layout');

    /* Reset one box (Cancel keeps the saved layout), then Reset all + Done */
    HE.applyLayout('Probe layout', true);
    if (!(await openEditor())) fail.push('editor did not open again');
    else {
      var rb = document.querySelector('#lm-he-p .lm-he-c[data-id="leaderboard"] .lm-he-b:last-child');
      if (!rb) fail.push('reset button missing');
      else {
        rb.click();
        await sleep(30);
        if (ui()._draft().leaderboard) fail.push('reset did not drop the leaderboard');
        if (!near(rect(lb), before, 2)) fail.push('reset: leaderboard not at its normal place');
      }
      click('#lm-he-p .lm-he-x');
      await sleep(30);
      if (HE.active() !== 'Probe layout' || (moved && !near(rect(lb), moved, 2))) fail.push('Cancel did not keep the saved layout');
    }
    if (!(await openEditor())) fail.push('editor did not open a third time');
    else {
      click('#lm-he-p .lm-he-resetall');
      await sleep(30);
      if (Object.keys(ui()._draft()).length) fail.push('Reset all left entries');
      if (!near(rect(lb), before, 2)) fail.push('Reset all: leaderboard not back');
      click('#lm-he-p .lm-he-done');
      await sleep(30);
      if (document.getElementById('lm-hud-layout')) fail.push('empty layout still writes a stylesheet');
    }
    allOnScreen('after reset');
  } finally {
    try { if (isOpen()) ui().close(false); } catch (e) { fail.push('close: ' + e); }
    HE.applyLayout('', true);
    HE.deleteLayout('Probe layout');
    HE.deleteLayout('Probe far');
    try { if (savedRaw === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, savedRaw); } catch (e) { }
    HE._internal.reset();
    HE.refreshNow();
  }
  if (document.getElementById('lm-hud-layout')) fail.push('stylesheet left after the probe');
  if (!near(rect(lb), before, 2)) fail.push('leaderboard not back at the end');
  return { fail: fail, info: info };
})()
