// Keyboard state: one Space is one split even when agar.io's own key handler (window.addKeyListeners,
// left in the window when agar.io's page ran before the loader replaced it) is there and Play is
// pressed; a key released inside a window that stops keyup (Command Centre after Ctrl+K, dialogs)
// is released for the hotkeys too (Ctrl no longer stays down, macro feed stops).
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
  /* nothing left held for the probes that follow */
  Object.keys(keyBlind).forEach(function (k) { keyBlind[k] = false; });
  return { fail: fail, info: info };
})()
