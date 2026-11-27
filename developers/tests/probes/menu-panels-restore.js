// Mod Info (openhelper) and Nick characters (opennamechars) hide the menu panels while open;
// closing them shows again only the panels that were shown. Until 3.697 a close showed all of
// them: the skins panel turned off in the settings came back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.openhelper !== 'function' || typeof window.opennamechars !== 'function') return { skip: 'openhelper / opennamechars missing' };
  var vis = function (sel) { return $(sel).length ? $(sel).css('display') !== 'none' : null; };
  var sp = $('#skins-panel'), saved = $('#main-menu, #skins-panel, #quick-menu, #exp-bar').map(function () { return [[this, this.style.display]]; }).get();
  var cases = [
    { name: 'Mod Info', open: function () { openhelper(); }, win: '#legendhelper', close: function () { closeLegendHelper(); } },
    { name: 'Nick characters', open: function () { opennamechars(); }, win: '#legendchars', close: function () { closecustomskinsIframe(); } }
  ];
  try {
    window.application.showMenu();
    await sleep(200);
    if (!vis('#main-menu')) return { skip: 'the menu is not shown' };
    for (var i = 0; i < cases.length; i++) {
      var c = cases[i];
      sp.stop(true, true).hide();
      c.open();
      for (var w = 0; w < 60 && !$(c.win).length; w++) await sleep(150);
      if (!$(c.win).length) { fail.push(c.name + ': the window did not open'); continue; }
      var during = [vis('#main-menu'), vis('#skins-panel')];
      c.close();
      await sleep(100);
      var after = [vis('#main-menu'), vis('#skins-panel'), $(c.win).length];
      info[c.name] = { during: during, after: after };
      if (during[0]) fail.push(c.name + ': the menu stayed visible behind the window');
      if (!after[0]) fail.push(c.name + ': the menu did not come back on close');
      if (after[1]) fail.push(c.name + ': the hidden skins panel was shown on close');
    }
    /* a panel that was shown comes back */
    sp.show();
    openhelper();
    for (var w2 = 0; w2 < 60 && !$('#legendhelper').length; w2++) await sleep(150);
    closeLegendHelper();
    await sleep(100);
    info.shownBack = vis('#skins-panel');
    if (!info.shownBack) fail.push('Mod Info: the shown skins panel did not come back on close');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { $('#legendhelper, #legendchars').remove(); } catch (e) { }
    window._lmMenuPanelsShown = null;
    saved.forEach(function (p) { p[0].style.display = p[1]; });
  }
  return { fail: fail, info: info };
})()
