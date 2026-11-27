// Phone run: a ping button placed in the control editor stays in its place when the Ping button option
// is turned off and on again; up to 3.702 it came back in the left row until the next 5 s layout poll
// (the ping option was the only optional button that did not reapply the layout). Everything is put back.
(async () => {
  var fail = [], info = {};
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application;
  if (!H || !app) return { fail: ['phone controls missing'] };
  var KEY = 'lm-mobile-layouts', stored = null, keepPrefs = null;
  try { stored = localStorage.getItem(KEY); keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var cb = document.getElementById('lm-pingbtn');
  var set = function (on) { if (cb.checked !== on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); } };
  var where = function () { var b = H.controls().ping; return !b ? 'none' : b.parentNode && b.parentNode.classList && b.parentNode.classList.contains('lm-ed-slot') ? 'slot' : b.parentNode ? (b.parentNode.id || b.parentNode.className) : 'detached'; };
  try {
    if (!cb) return { fail: ['no Ping button option'] };
    app.hideMenu();
    localStorage.setItem(KEY, JSON.stringify({ v: 1, current: { landscape: { controls: { ping: { cx: 0.5, cy: 0.3, s: 1 } } }, portrait: { controls: { ping: { cx: 0.5, cy: 0.3, s: 1 } } } } }));
    set(true);
    /* the editor is loaded and applies the saved layout (open + cancel) */
    var ob = document.getElementById('lm-ed-open');
    if (!ob) return { fail: ['no Edit controls button'] };
    ob.click();
    for (var t0 = Date.now(); !document.getElementById('lm-ed') && Date.now() - t0 < 8000;) await sleep(100);
    var cancel = null;
    document.querySelectorAll('#lm-ed-bar button').forEach(function (b) { if (b.getAttribute('data-i18n') === 'misc.editor.cancel') cancel = b; });
    if (!cancel) return { fail: ['editor or its Cancel button missing'] };
    cancel.click();
    await sleep(300);
    info.before = where();
    if (info.before !== 'slot') return { fail: ['the placed ping button is not in its slot after the editor: ' + info.before], info: info };
    set(false);
    await sleep(50);
    set(true);
    await sleep(300);
    info.after = where();
    if (info.after !== 'slot') fail.push('after the Ping button option off and on the ping button is in ' + info.after + ', not in its placed slot');
  } finally {
    try {
      if (stored === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, stored);
      if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs);
    } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (window.LMMobileEditor && window.LMMobileEditor.reload) { try { window.LMMobileEditor.reload(); } catch (e) { } }
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
