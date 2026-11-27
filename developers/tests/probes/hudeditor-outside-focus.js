// The HUD editor opened while the keyboard focus is on a page element outside it (a minimap icon
// that was clicked, or the element the Command Centre gives the focus back to when it runs "HUD
// editor"): real arrow keys move the selected box and a real Esc closes the editor. Since 3.697 the
// editor left every key aimed at an element outside it to that element, so the arrows did nothing
// and Esc went to the game (the menu opened over the editor). All put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !(window.LMHudEditor && window.application); w0++) await sleep(250);
  var HE = window.LMHudEditor;
  if (!HE) return { fail: ['HUD editor missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'ho' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var key = function (k, code, kc) { return send({ type: 'key', key: k, code: code, keyCode: kc }); };
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.style.display !== 'none');
  var raw = null, UI = null;
  try { raw = localStorage.getItem('lmHudLayouts'); } catch (e) { }
  try {
    application.hideMenu();
    await sleep(300);
    /* a visible link outside the menu and the editor, as a clicked minimap icon */
    var outside = [].slice.call(document.querySelectorAll('#fullscreenBtn, #minimap-hud a[href], a[href]')).filter(function (el) {
      var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !(ov && ov.contains(el));
    })[0];
    if (!outside) return { skip: 'no visible link outside the menu' };
    info.outside = outside.tagName + '#' + outside.id;
    HE.open();
    for (var w = 0; w < 40 && !(window.LMHudEditorUI && LMHudEditorUI.isOpen()); w++) await sleep(250);
    UI = window.LMHudEditorUI;
    if (!UI || !UI.isOpen()) return { fail: ['the HUD editor did not open'] };
    await sleep(500);
    outside.focus();
    info.focused = document.activeElement === outside;
    UI._select('leaderboard');
    var before = UI._measure('leaderboard');
    await key('ArrowRight', 'ArrowRight', 39);
    await sleep(200);
    var de = UI._draft().leaderboard;
    info.before = before && before.main ? before.main.left : null;
    info.after = de ? de.left : null;
    if (!de) fail.push('a real ArrowRight with the focus on ' + info.outside + ' did not move the selected leaderboard');
    /* drop the move so Esc closes at once (an unsaved change asks first) */
    UI.close(false);
    await sleep(200);
    HE.open();
    for (var w2 = 0; w2 < 40 && !UI.isOpen(); w2++) await sleep(250);
    await sleep(300);
    outside.focus();
    await key('Escape', 'Escape', 27);
    await sleep(300);
    info.openAfterEsc = UI.isOpen();
    info.menuAfterEsc = !!(ov && ov.style.display !== 'none');
    if (UI.isOpen()) fail.push('a real Esc with the focus on ' + info.outside + ' did not close the HUD editor');
    if (info.menuAfterEsc) fail.push('that Esc opened the menu');
  } catch (e) { fail.push('keys: ' + e); }
  try { if (UI && UI.isOpen()) UI.close(false); } catch (e) { }
  try { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); } catch (e) { }
  try { if (raw == null) localStorage.removeItem('lmHudLayouts'); else localStorage.setItem('lmHudLayouts', raw); } catch (e) { }
  if (HE._internal && HE._internal.reset) HE._internal.reset();
  try { if (menuWas) application.showMenu(); else application.hideMenu(); } catch (e) { }
  return { fail: fail, info: info };
})()
