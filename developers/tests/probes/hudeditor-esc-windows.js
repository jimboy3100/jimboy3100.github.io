// The HUD editor opened over a window that closes on Esc (Settings profiles, Theme workshop, Custom
// macros): a real Esc closes the editor only, the next Esc that window. Until 3.701 the window under
// the editor took the Esc too: Profiles and Theme workshop closed together with the editor, Custom
// macros closed unseen under it and the editor stayed open. Everything is closed after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !(window.LMHudEditor && window.LMProfiles && typeof window.lmMacroEditor === 'function'); w0++) await sleep(250);
  if (!window.LMHudEditor || !window.LMProfiles) return { fail: ['HUD editor or Settings profiles missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hw' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var blur = function () { if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur(); };
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.style.display !== 'none');
  var wins = [
    { name: 'Settings profiles', open: function () { LMProfiles.open(); }, isOpen: function () { return !!document.getElementById('lm-sp-overlay'); }, close: function () { LMProfiles.close(); } },
    { name: 'Theme workshop', open: function () { if (window.LMThemeWorkshop) LMThemeWorkshop.open(); }, isOpen: function () { return !!(window.LMThemeWorkshop && LMThemeWorkshop.isOpen()); }, close: function () { LMThemeWorkshop.close(); } },
    { name: 'Custom macros', open: function () { lmMacroEditor('open'); }, isOpen: function () { return !!(window.LMMacroEditor && LMMacroEditor.isOpen()); }, close: function () { LMMacroEditor.close(); } }
  ];
  var UI = null;
  for (var i = 0; i < wins.length; i++) {
    var wn = wins[i], r = {};
    try {
      application.hideMenu();
      await sleep(200);
      wn.open();
      for (var w = 0; w < 40 && !wn.isOpen(); w++) await sleep(150);
      if (!wn.isOpen()) { info[wn.name] = 'did not open'; continue; }
      LMHudEditor.open();
      for (var w2 = 0; w2 < 40 && !(window.LMHudEditorUI && LMHudEditorUI.isOpen()); w2++) await sleep(250);
      UI = window.LMHudEditorUI;
      if (!UI || !UI.isOpen()) { fail.push(wn.name + ': the HUD editor did not open'); continue; }
      await sleep(300);
      blur();
      await esc();
      await sleep(300);
      r.afterEsc1 = { editor: UI.isOpen(), win: wn.isOpen() };
      if (UI.isOpen() || !wn.isOpen()) fail.push(wn.name + ': Esc in the HUD editor over it: ' + JSON.stringify(r.afterEsc1));
      if (UI.isOpen()) UI.close(false);
      blur();
      await esc();
      await sleep(300);
      r.afterEsc2 = wn.isOpen();
      if (wn.isOpen()) fail.push(wn.name + ': the second Esc did not close it');
    } catch (e) { fail.push(wn.name + ': ' + e); }
    info[wn.name] = r;
    try { if (UI && UI.isOpen()) UI.close(false); } catch (e) { }
    try { if (wn.isOpen()) wn.close(); } catch (e) { }
  }
  if (window.LMHudEditor && LMHudEditor._internal && LMHudEditor._internal.reset) LMHudEditor._internal.reset();
  try { if (menuWas) application.showMenu(); else application.hideMenu(); } catch (e) { }
  return { fail: fail, info: info };
})()
