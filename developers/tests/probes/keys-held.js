// Keyboard state: one Space is one split even when agar.io's own key handler (window.addKeyListeners,
// left in the window when agar.io's page ran before the loader replaced it) is there and Play is
// pressed; a key released inside a window that stops keyup (Command Centre after Ctrl+K, dialogs)
// is released for the hotkeys too (Ctrl no longer stays down, macro feed stops); Q free spectate
// keeps working after the hotkeys window and after a death.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var app = window.application, lm = window.legendmod, core = window.core;
  if (!app || !lm || !core || typeof keyBlind !== 'object' || typeof hotkeys !== 'object') return { fail: ['game objects missing'] };
  function kev(type, target, keyCode, key, ctrl) {
    var e = new KeyboardEvent(type, { bubbles: true, cancelable: true, key: key, ctrlKey: !!ctrl });
    Object.defineProperty(e, 'keyCode', { get: function () { return keyCode; } });
    Object.defineProperty(e, 'which', { get: function () { return keyCode; } });
    target.dispatchEvent(e);
  }
  var saved = { wk: window.onkeydown, wku: window.onkeyup, akl: window.addKeyListeners, split: core.split,
    play: app.play, hideMenu: app.hideMenu, lmPlay: lm.play, macroFeed: app.macroFeed };
  var splits = 0;
  core.split = function () { splits++; };
  try {
    /* 1. the leftover agar.io function cannot replace the hotkeys handler */
    if (typeof saved.akl !== 'function') fail.push('window.addKeyListeners is not Legend Mod\'s no-op');
    else {
      saved.akl();
      if (window.onkeydown !== saved.wk || window.onkeyup !== saved.wku) fail.push('window.addKeyListeners() replaced the key handlers');
      window.onkeydown = saved.wk; window.onkeyup = saved.wku;
    }
    /* 2. agar.io's real key handler (agario/bundle_start.js), there when Play is pressed */
    var src = await (await fetch('https://www.legendmod.ml/agario/bundle_start.js', { cache: 'no-store' })).text();
    var a = src.indexOf('function addKeyListeners() {'), b = src.indexOf("window['addKeyListeners'] = addKeyListeners;");
    if (a < 0 || b < a) fail.push('agar.io key handler not found in agario/bundle_start.js');
    else {
      var agarKeys = new Function('window', '_utils', 'var keysDown = {};\n' + src.slice(a, b) + '\nreturn addKeyListeners;')(window, { 'default': { isVisible: function () { return false; } } });
      window.addKeyListeners = agarKeys;
      /* Play while alive: the spawn gate and the spawn itself are left out (no packets) */
      lm.play = true;
      app.play = function () { };
      app.hideMenu = function () { };
      app.onPlay();
      lm.play = saved.lmPlay;
      if (hotkeys.SPACE === 'hk-split') {
        splits = 0;
        kev('keydown', document.body, 32, ' ');
        kev('keyup', document.body, 32, ' ');
        info.splitsPerSpace = splits;
        if (splits !== 1) fail.push('one Space after Play sent ' + splits + ' splits');
      } else info.space = 'not bound to split: ' + hotkeys.SPACE;
    }
  } catch (e) { fail.push('play path: ' + e); }
  lm.play = saved.lmPlay;
  app.play = saved.play; app.hideMenu = saved.hideMenu;
  window.onkeydown = saved.wk; window.onkeyup = saved.wku; window.addKeyListeners = saved.akl;
  /* 3. keyup that never reaches the document */
  var box = document.createElement('div'), inp = document.createElement('input');
  box.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;';
  box.appendChild(inp);
  document.body.appendChild(box);
  box.addEventListener('keyup', function (e) { e.stopPropagation(); });
  var feeds = [];
  app.macroFeed = function (on) { feeds.push(!!on); };
  try {
    var feedKey = Object.keys(hotkeys).filter(function (k) { return hotkeys[k] === 'hk-macroFeed'; })[0];
    kev('keydown', document.body, 17, 'Control', true);
    if (!keyBlind.CTRL) fail.push('Ctrl keydown not taken');
    inp.focus();
    kev('keyup', inp, 17, 'Control', false);
    await sleep(30);
    info.ctrlHeldAfter = !!keyBlind.CTRL;
    if (keyBlind.CTRL) fail.push('Ctrl released inside a window that stops keyup stays held');
    if (feedKey === 'E') {
      document.body.focus(); inp.blur();
      kev('keydown', document.body, 69, 'e');
      inp.focus();
      kev('keyup', inp, 69, 'e');
      await sleep(30);
      info.feeds = feeds.join(',');
      if (feeds[0] !== true || feeds[feeds.length - 1] !== false) fail.push('macro feed released inside such a window kept feeding: ' + feeds.join(','));
      /* released once only */
      if (feeds.length !== 2) fail.push('macro feed calls ' + feeds.join(','));
    }
    /* a keyup the document gets runs keyUp once, as before */
    feeds = [];
    if (feedKey === 'E') {
      inp.blur();
      kev('keydown', document.body, 69, 'e');
      kev('keyup', document.body, 69, 'e');
      await sleep(30);
      if (feeds.join(',') !== 'true,false') fail.push('normal E press/release: ' + feeds.join(','));
    }
    /* the real Command Centre: Ctrl+K, keys released in its search box */
    if (window.LMCommandCentre && typeof LMCommandCentre.isOpen === 'function' && !LMCommandCentre.isOpen()) {
      inp.blur();
      kev('keydown', document.body, 17, 'Control', true);
      kev('keydown', document.body, 75, 'k', true);
      info.ccOpen = LMCommandCentre.isOpen();
      var t = document.activeElement || document.body;
      kev('keyup', t, 75, 'k', true);
      kev('keyup', t, 17, 'Control', false);
      await sleep(30);
      if (info.ccOpen && keyBlind.CTRL) fail.push('Ctrl stays held after Ctrl+K');
      if (LMCommandCentre.isOpen()) LMCommandCentre.close();
    }
  } catch (e) { fail.push('keyup path: ' + e); }
  app.macroFeed = saved.macroFeed;
  core.split = saved.split;
  box.remove();
  /* 4. Q free spectate (spectateBlind's window.onkeydown) still works after the hotkeys window
   * was opened and closed and after a death, in protocol mode and outside it (resetonkeydown
   * runs there); one Q is one toggle, and none while alive (Q is double split then) */
  var fsCount = 0, sv4 = { fs: lm.sendFreeSpectate, ds: app.doubleSplit, pm: app.protocolMode, play: lm.play,
    spd: app.sendPlayerDeath, ar: app.autoResp, udl: app.updateDeathLocations, lda: app._lmLastDeathAt,
    lsa: app._lmLifeStartAt, has: window.LMEvents && LMEvents._has, ss: null, ssEl: !!document.getElementById('lm-session-stats'),
    pb: window.legendmod5 && legendmod5.personalBests, mh: window.legendmod5 && legendmod5.matchHistory };
  try { sv4.ss = sessionStorage.getItem('lmSessionStats'); } catch (e) { }
  lm.sendFreeSpectate = function () { fsCount++; };
  app.doubleSplit = function () { };
  function qPress() {
    var b = fsCount;
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    kev('keydown', document.body, 81, 'q');
    kev('keyup', document.body, 81, 'q');
    return fsCount - b;
  }
  function hotkeysWindow() {
    var link = document.querySelector('.hotkeys-link'), tmp = null;
    if (!link) { tmp = link = document.createElement('a'); link.className = 'hotkeys-link'; document.body.appendChild(link); }
    jQuery(link).trigger('click');
    jQuery('#close-hotkeys').trigger('click');
    jQuery('#hotkeys').stop(true, true).hide();
    if (tmp) tmp.remove();
  }
  function death() {
    app.sendPlayerDeath = app.autoResp = app.updateDeathLocations = function () { };
    if (window.LMEvents) LMEvents._has = function () { return false; };
    if (window.legendmod5) { legendmod5.personalBests = false; legendmod5.matchHistory = false; }
    app._lmLastDeathAt = 0;
    app.onPlayerDeath();
  }
  try {
    lm.play = false;
    [true, false].forEach(function (pm) {
      var tag = pm ? 'protocol mode' : 'outside protocol mode';
      app.protocolMode = pm;
      var n = qPress();
      if (n !== 1) fail.push('Q while spectating (' + tag + ') toggled free spectate ' + n + ' times');
      hotkeysWindow();
      n = qPress();
      info['qAfterHotkeys' + (pm ? '' : 'NoProto')] = n;
      if (n !== 1) fail.push('Q after the hotkeys window (' + tag + ') toggled free spectate ' + n + ' times');
      death();
      lm.play = false;
      n = qPress();
      info['qAfterDeath' + (pm ? '' : 'NoProto')] = n;
      if (n !== 1) fail.push('Q after a death (' + tag + ') toggled free spectate ' + n + ' times');
      /* respawned: Q is double split, not free spectate; dead again: free spectate again */
      lm.play = true;
      n = qPress();
      if (n !== 0) fail.push('Q while alive (' + tag + ') toggled free spectate ' + n + ' times');
      lm.play = false;
      n = qPress();
      if (n !== 1) fail.push('Q after respawn and death (' + tag + ') toggled free spectate ' + n + ' times');
    });
  } catch (e) { fail.push('free spectate path: ' + e); }
  lm.sendFreeSpectate = sv4.fs; app.doubleSplit = sv4.ds; app.protocolMode = sv4.pm; lm.play = sv4.play;
  app.sendPlayerDeath = sv4.spd; app.autoResp = sv4.ar; app.updateDeathLocations = sv4.udl;
  app._lmLastDeathAt = sv4.lda; app._lmLifeStartAt = sv4.lsa;
  if (window.LMEvents) LMEvents._has = sv4.has;
  if (window.legendmod5) { legendmod5.personalBests = sv4.pb; legendmod5.matchHistory = sv4.mh; }
  try { if (sv4.ss == null) sessionStorage.removeItem('lmSessionStats'); else sessionStorage.setItem('lmSessionStats', sv4.ss); } catch (e) { }
  if (!sv4.ssEl && document.getElementById('lm-session-stats')) document.getElementById('lm-session-stats').remove();
  /* nothing left held for the probes that follow */
  Object.keys(keyBlind).forEach(function (k) { keyBlind[k] = false; });
  return { fail: fail, info: info };
})()
