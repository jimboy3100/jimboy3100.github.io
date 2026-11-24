// Custom macros (the skin editor moved to skins/skinchecker.html): the button, hotkeys (no default
// keys) and Command Centre entry exist and no skin editor is left in the game; the macro editor fits, builds a sequence, and its dry run sends nothing. Storage is
// put back at the end.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var wait = async function (fn, n) { for (var i = 0; i < (n || 50) && !fn(); i++) await sleep(100); return !!fn(); };
  var fits = function (el, what) {
    var r = el.getBoundingClientRect();
    info[what] = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
    if (r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push(what + ' does not fit the screen');
  };
  var touchSize = function (el, what) {
    var r = el && el.getBoundingClientRect();
    if (!r || r.width < 28 || r.height < 28) fail.push(what + ' too small for touch');
  };
  var SK = 'lmSkinEditorSaved', MK = 'lmCustomMacros', skBefore = null, mkBefore = null;
  try { skBefore = localStorage.getItem(SK); mkBefore = localStorage.getItem(MK); } catch (e) { }
  var app = window.application, origSplit = app && app.split, origFeed = app && app.feed, sends = 0;

  [1, 2, 3].forEach(function (n) {
    var hk = window.hotkeysCommand && hotkeysCommand['hk-customMacro' + n];
    if (!hk || hk.defaultKey !== '') fail.push('hk-customMacro' + n + ' missing or has a default key');
  });
  if (typeof window.lmMacroEditor !== 'function') fail.push('lmMacroEditor loader missing');
  if (!document.getElementById('lm-macro-editor-btn')) fail.push('custom macros button missing in Settings > Macro');
  var CC = window.LMCommandCentre;
  if (window.LMSkinEditor || document.getElementById('lm-skin-editor-btn')) fail.push('the skin editor is back in the game');
  if (CC && typeof CC.items === 'function') {
    var ids = CC.items().map(function (it) { return it.id; }).join(' ');
    if (ids.indexOf('macroEditor') < 0) fail.push('no Command Centre entry for custom macros');
  }
  if (fail.length) return { fail: fail, info: info };

  try {
    /* ── custom macros ── */
    if (app) {
      app.split = function () { sends++; };
      app.feed = function () { sends++; };
    }
    window.lmMacroEditor('open', 3);
    if (!(await wait(function () { return window.LMMacroEditor && LMMacroEditor.isOpen(); }))) throw new Error('macro editor did not open');
    await sleep(100);
    var mp = document.getElementById('lm-me-p');
    fits(mp, 'macroPanel');
    touchSize(mp.querySelector('.lm-me-x'), 'macro editor close button');
    LMMacroEditor.setMacro(3, null);
    mp.querySelector('.lm-me-add-split').click();
    mp.querySelector('.lm-me-add-split').click();
    mp.querySelector('.lm-me-add-wait').click();
    mp.querySelector('.lm-me-add-feed').click();
    mp.querySelector('.lm-me-add-mouse').click();
    var m3 = LMMacroEditor.macros().slots[2];
    if (m3.steps.length !== 5) fail.push('steps not added (' + m3.steps.length + ')');
    var evs = mp.querySelectorAll('.lm-me-tl .lm-me-ev');
    info.timeline = evs.length;
    if (evs.length !== 4) fail.push('timeline shows ' + evs.length + ' actions');
    mp.querySelector('.lm-me-test').click();
    await sleep(400);
    if (!mp.querySelector('.lm-me-ev.done')) fail.push('dry run did not play');
    if (sends) fail.push('dry run sent ' + sends + ' actions');
    fits(mp, 'macroPanelFull');
    mp.querySelector('.lm-me-x').click();
    await sleep(50);
    if (LMMacroEditor.isOpen()) fail.push('macro editor did not close');
    /* the hotkey path uses application.split / feed */
    LMMacroEditor.setMacro(3, { steps: [{ a: 'split' }, { a: 'feed' }] });
    window.lmMacroEditor('run', 3);
    await sleep(120);
    if (sends !== 2) fail.push('custom macro run sent ' + sends + ' actions instead of 2');
  } catch (e) {
    fail.push(String(e && e.message || e));
  } finally {
    if (app) { app.split = origSplit; app.feed = origFeed; }
    try { if (window.LMMacroEditor) { LMMacroEditor.stop(); LMMacroEditor.close(); LMMacroEditor.setMacro(3, null); } } catch (e) { }
    try {
      if (skBefore == null) localStorage.removeItem(SK); else localStorage.setItem(SK, skBefore);
      if (mkBefore == null) localStorage.removeItem(MK); else localStorage.setItem(MK, mkBefore);
    } catch (e) { }
  }
  return { fail: fail, info: info };
})()
