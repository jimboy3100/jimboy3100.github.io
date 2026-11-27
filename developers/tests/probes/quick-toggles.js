// The quick HUD buttons of the main menu work as tabs: the quick menu (ogicon-menu) and the
// Battle Royale HUD (its button shows on agar.io Battle Royale only); the bots button (trophy)
// is hidden on every server and its panel stays closed. Real clicks on the real buttons
// (A = quick menu, B = Battle Royale) in the order A, A, B, A, B, B: after each click at most one
// HUD is shown, the saved flags equal what is shown, and only the open HUD's button has the ring.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var app = window.application;
  need('application', !!app && typeof app.toggleQuickPanel === 'function');
  if (fail.length) return { fail: fail, info: info };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var shown = function (id) { var el = document.getElementById(id); return !!el && el.style.display !== 'none' && getComputedStyle(el).display !== 'none'; };
  var ring = function (sel) { var el = document.querySelector(sel); return !!el && el.classList.contains('lm-quick-on'); };
  var trophy = document.querySelector('.quick.quick-bots.ogicon-trophy');
  var brBtn = document.querySelector('.quick.quick-br');
  var agar = !!(window.legendmod && window.legendmod.integrity);
  need('bots button shown on agar.io only', !!trophy && (getComputedStyle(trophy).display !== 'none') === agar);
  info.server = window.legendmod && window.legendmod.ws ? (window.legendmod.integrity ? 'agar.io' : 'other') : 'none';
  info.mode = window.legendmod && window.legendmod.gameMode;
  var inBR = !!(window.legendmod && window.legendmod.integrity && window.legendmod.ws && window.legendmod.gameMode === ':battleroyale');
  need('Battle Royale button only on agar.io Battle Royale', !!brBtn && (getComputedStyle(brBtn).display !== 'none') === inBR);
  var saved = { menu: defaultmapsettings.showQuickMenu, bots: defaultmapsettings.showQuickBots, br: app._lmQuickBR };
  /* a server or mode switch during the clicks would close the Battle Royale HUD off Battle Royale: paused for the click test */
  var realSync = app.syncQuickPanels;
  app.syncQuickPanels = function () { };
  app.setQuickPanel(null);
  var state = function () {
    return { menu: shown('quick-menu'), bots: shown('quick-bots'), br: shown('quick-br'),
      fMenu: !!defaultmapsettings.showQuickMenu, fBots: !!defaultmapsettings.showQuickBots, fBR: !!app._lmQuickBR,
      rMenu: ring('.quick.quick-menu'), rBots: ring('.quick.quick-bots'), rBR: ring('.quick.quick-br') };
  };
  var expect = { A: ['menu', null, 'br', 'menu', 'br', null] };
  var seq = ['A', 'A', 'B', 'A', 'B', 'B'], got = [];
  for (var i = 0; i < seq.length; i++) {
    $(seq[i] === 'A' ? '.quick.quick-menu' : '.quick.quick-br').trigger('click');
    await sleep(30);
    var s = state(), want = expect.A[i];
    got.push(seq[i] + ':' + (s.menu ? 'menu' : s.br ? 'br' : s.bots ? 'bots' : '-'));
    need(seq[i] + ' #' + (i + 1) + ' shows ' + (want || 'none'), s.menu === (want === 'menu') && s.br === (want === 'br') && !s.bots);
    need(seq[i] + ' #' + (i + 1) + ' flags equal visibility', s.fMenu === s.menu && s.fBots === s.bots && s.fBR === s.br);
    need(seq[i] + ' #' + (i + 1) + ' ring only on the open HUD', s.rMenu === s.menu && s.rBR === s.br && !s.rBots);
  }
  info.seq = got.join(' ');
  // a fast double click: no animation left, the state is the toggled-twice one at once
  $('.quick.quick-menu').trigger('click'); $('.quick.quick-menu').trigger('click');
  var q = document.getElementById('quick-menu');
  need('double click: closed again at once, no fade queued', !shown('quick-menu') && !$(q).is(':animated') && !defaultmapsettings.showQuickMenu);
  // the bots panel cannot open while its button is hidden: a settings profile sets the flag, then setShowQuickBots (no sync follows)
  app.syncQuickPanels = realSync;
  if (!agar) {
    defaultmapsettings.showQuickBots = true; app.setShowQuickBots();
    need('bots panel closed and its flag off while its button is hidden', !shown('quick-bots') && !defaultmapsettings.showQuickBots);
  }
  // back to the state before the probe
  app.setQuickPanel(saved.br ? 'br' : saved.menu ? 'menu' : null);
  return { fail: fail, info: info };
})()
