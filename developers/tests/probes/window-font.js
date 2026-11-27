// Legend windows share one text font: Profiles, Theme Workshop and the Command Centre used the HUD
// font (Ubuntu by default) while Performance, Analytics, Notifications, Director, Gamepad, Custom
// Macros, the small tools windows and Discover used the menu's text font. The shared window kit
// (lmUiKit, LMexpress.js) set the HUD font on every .lm-modal-container; windows whose own rules set
// font-family:inherit on the window itself kept the menu font, the others got the HUD font.
// This probe opens the real windows and compares their computed font with the menu text, then
// adds the extended UI dialog styles (_lmEnsureModalCSS) and checks no window changes size, font or
// border; a dialog in a .lm-modal-overlay (Leagues, skin packs ...) keeps the HUD font.
// Every window is closed again.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hk = window.hotkeysCommand || {};
  for (var w = 0; w < 60 && !(window.LMProfiles && window.LMPerf && window.LMAnalytics && window.LMNotifications && window.LMSmallTools); w++) await sleep(250);
  if (!window.LMProfiles || !window.LMPerf || !window.LMAnalytics || !window.LMNotifications || !window.LMSmallTools) return { skip: 'windows missing' };
  /* lazily loaded windows: their hotkey or loader loads them */
  var lazy = async function (name, load) {
    if (!window[name]) { try { load(); } catch (e) { } }
    for (var i = 0; i < 40 && !window[name]; i++) await sleep(250);
    return window[name] || null;
  };
  var TW = await lazy('LMThemeWorkshop', function () { hk['hk-lmThemeWorkshop'].keyDown(); });
  if (TW && TW.close) TW.close();
  var CC = window.LMCommandCentre || null;
  var DIR = await lazy('LMDirector', function () { hk['hk-director'].keyDown(); });
  if (DIR && DIR.close) DIR.close();
  var GP = await lazy('LMGamepadUI', function () { hk['hk-gamepadWindow'].keyDown(); });
  if (GP && GP.close) GP.close();
  var ME = await lazy('LMMacroEditor', function () { window.lmMacroEditor('load'); });
  var DSC = window.LMDiscovery || null;
  var wins = [
    { n: 'Profiles', open: function () { LMProfiles.open(); }, close: function () { LMProfiles.close(); } },
    { n: 'Performance', open: function () { LMPerf.openDiag(); }, close: function () { LMPerf.closeDiag(); } },
    { n: 'Analytics', open: function () { LMAnalytics.open('dash'); }, close: function () { LMAnalytics.close(); } },
    { n: 'Notifications', open: function () { LMNotifications.open(); }, close: function () { LMNotifications.close(); } },
    { n: 'Skin collections', open: function () { LMSmallTools.open('skins'); }, close: function () { LMSmallTools.close(); } }
  ];
  if (TW) wins.push({ n: 'Theme Workshop', open: function () { TW.open(); }, close: function () { TW.close(); } });
  if (CC) wins.push({ n: 'Command Centre', open: function () { CC.open(); }, close: function () { CC.close(); } });
  if (DIR) wins.push({ n: 'Director', open: function () { DIR.open(); }, close: function () { DIR.close(); } });
  if (GP) wins.push({ n: 'Gamepad', open: function () { GP.open(); }, close: function () { GP.close(); } });
  if (ME) wins.push({ n: 'Custom Macros', open: function () { ME.open(1); }, close: function () { ME.close(); } });
  if (DSC) wins.push({ n: 'Discover', open: function () { DSC.open(); }, close: function () { DSC.close(); } });
  var closeAll = function () { wins.forEach(function (x) { try { x.close(); } catch (e) { } }); };
  var shown = function () {
    var r = [];
    document.querySelectorAll('.lm-modal-container').forEach(function (el) {
      if (el.closest('.lm-modal-overlay') || !el.offsetWidth || getComputedStyle(el).visibility === 'hidden') return;
      r.push(el);
    });
    return r;
  };
  var look = function (el) {
    /* not the height: some windows grow with their content (Performance's event list) */
    var cs = getComputedStyle(el), b = el.getBoundingClientRect();
    return { font: cs.fontFamily, size: cs.fontSize, w: Math.round(b.width), mh: cs.maxHeight, border: cs.borderTopWidth + ' ' + cs.borderTopColor, radius: cs.borderTopLeftRadius, overflow: cs.overflow };
  };
  /* the menu's text font (Settings, the menu panels and buttons) */
  var menuFont = getComputedStyle(document.querySelector('#main-panel') || document.body).fontFamily;
  info.menuFont = menuFont;
  var pass = async function () {
    var r = {};
    for (var i = 0; i < wins.length; i++) {
      var x = wins[i];
      closeAll(); await sleep(150);
      try { x.open(); } catch (e) { fail.push(x.n + ': open threw ' + e); continue; }
      var els = [];
      for (var t = 0; t < 20 && !els.length; t++) { await sleep(150); els = shown(); }
      if (!els.length) { info[x.n] = 'no window shown'; continue; }
      r[x.n] = look(els[0]);
    }
    closeAll(); await sleep(150);
    return r;
  };
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  var probeEl = null;
  try {
    var before = await pass();
    info.windows = Object.keys(before).length;
    Object.keys(before).forEach(function (n) {
      info[n] = before[n].font.slice(0, 30);
      if (before[n].font !== menuFont) fail.push(n + ': text font ' + before[n].font + ', the menu and the other windows use ' + menuFont);
    });
    if (info.windows < 6) fail.push('only ' + info.windows + ' windows could be opened');
    /* the extended UI dialog styles must not change these windows */
    if (typeof window._lmEnsureModalCSS === 'function') {
      window._lmEnsureModalCSS();
      var after = await pass();
      Object.keys(before).forEach(function (n) {
        var a = before[n], b = after[n];
        if (!b) { fail.push(n + ': not shown again after the extended UI styles'); return; }
        Object.keys(a).forEach(function (p) { if (a[p] !== b[p]) fail.push(n + ': ' + p + ' ' + a[p] + ' -> ' + b[p] + ' after the extended UI styles'); });
      });
    } else info.extUi = 'not loaded';
    /* a dialog in a .lm-modal-overlay (the extended UI and skin packs dialogs) keeps the HUD font */
    probeEl = document.createElement('div');
    probeEl.className = 'lm-modal-overlay';
    probeEl.style.cssText = 'position:fixed;left:-9999px;top:0;width:10px;height:10px;animation:none';
    probeEl.innerHTML = '<div class="lm-modal-container">x</div>';
    document.body.appendChild(probeEl);
    var hudFont = getComputedStyle(document.documentElement).getPropertyValue('--lm-hud-font').trim();
    var ovFont = getComputedStyle(probeEl.firstChild).fontFamily;
    info.overlayFont = ovFont;
    if (hudFont && ovFont.replace(/["']/g, '').indexOf(hudFont.replace(/["']/g, '').split(',')[0].trim()) !== 0) fail.push('a dialog in a .lm-modal-overlay lost the HUD font (' + ovFont + ', HUD font ' + hudFont + ')');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    if (probeEl) probeEl.remove();
    closeAll();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
