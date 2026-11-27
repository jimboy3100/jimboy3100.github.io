// Small tools + accessibility (ogario/modules/smalltools.js, accessibility.js): off by default with
// nothing added to the page; the radial menu and the screenshot window are gone (no hotkeys, no
// windows, their stored data removed); screenshot mode (Alt+H) hides the HUD and Esc brings it back;
// the capture composes the game canvases; each accessibility option switches on and off.
// Options are put back.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMSmallTools && window.LMSmallTools.shotToggle && window.LMAccessibility && window.LMAccessibility.sync); i++) await sleep(250);
  var T = window.LMSmallTools, A = window.LMAccessibility, s = window.legendmod5;
  need('modules loaded', !!(T && T.shotToggle && A && A.sync));
  if (!T || !A || !s) return { fail: fail, info: info };
  var OPTS = ['a11yTextScale'], keep = {};
  OPTS.forEach(function (k) { keep[k] = s[k]; });
  var inBox = function (r) { return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; };
  try {
    need('options off by default', LM_SETTINGS_DEFAULTS.a11yTextScale === 1);
    /* HUD text size, game brightness / saturation and the sector symbol are removed */
    need('removed Theme options are gone', !('a11yHudTextScale' in LM_SETTINGS_DEFAULTS) && !document.getElementById('a11yHudTextScale-slider') && !('gameBrightness' in LM_THEME_DEFAULTS) && !('gameSaturation' in LM_THEME_DEFAULTS) && !('sectorsSymbol' in LM_THEME_DEFAULTS) && !document.getElementById('gameBrightness-slider') && !document.getElementById('lm-game-filter'));
    need('removed duplicates are gone', !('hk-bugReport' in hotkeysCommand) && !('a11yPalette' in LM_SETTINGS_DEFAULTS) && !('a11yHighContrast' in LM_SETTINGS_DEFAULTS) && !('a11yNoFlash' in LM_SETTINGS_DEFAULTS) && !('a11yIndicators' in LM_SETTINGS_DEFAULTS) && !document.getElementById('a11yIndicators') && !('_lmA11yPal' in window));
    need('menu controls', !!document.getElementById('a11yTextScale-slider'));
    /* the radial menu (and its editor) and the screenshot window (and its Capture hotkey) are removed */
    need('radial menu and screenshot window: no hotkeys', ['hk-radialMenu', 'hk-radialEditor', 'hk-screenshotCapture', 'hk-screenshotTool'].every(function (id) { return !(id in hotkeysCommand); }));
    need('radial menu and screenshot window: no window API, stored data removed', !T.open && !T.toggle && !T.radialDown && localStorage.getItem('lmRadialMenu') === null && localStorage.getItem('lmSmallTools') === null);
    var allOff = s.a11yTextScale === 1;
    if (allOff) need('accessibility off: nothing added', !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind'));
    /* Skin collections are part of the player profiles: no window, button, setting or
     * hotkey of their own */
    need('Skin collections: no window, button, setting, hotkey or command', !document.getElementById('lm-st-skins') && !document.getElementById('lm-skin-collections') &&
      !('skinCollections' in LM_SETTINGS_DEFAULTS) && !('hk-skinCollections' in hotkeysCommand));
    /* no favourite stars, gold ring or profile search in the skins panel (removed) */
    need('no profile stars or search', !document.querySelector('#skins .lm-prof-star, #skins .lm-prof-fav') && !document.getElementById('lm-prof-search') && !document.getElementById('lm-prof-css'));
    /* the hotkey conflict list is gone (the Hotkeys window still refuses a key the browser keeps) */
    need('no hotkey conflict list', !document.getElementById('lm-hk-conf-btn') && !document.getElementById('lm-hk-conf-list') && !T.conflicts && !T.renderConflicts && !('hk-hotkeyConflicts' in hotkeysCommand) && typeof T.keyCheck === 'function' && T.keyCheck('CTRL+W').level === 'block');
    need('keyCheck refuses browser keys', T.keyCheck && T.keyCheck('CTRL+T') && T.keyCheck('CTRL+T').level === 'block' && !T.keyCheck('Q'));

    /* the existing Settings > Copy debug info text goes through the redaction */
    var nick = document.getElementById('nick');
    var dbgText = T.redactReport('Server: wss://x.example:443/el-room/ROOMTOKEN9 nick ' + ((nick && nick.value) || ''));
    need('debug info redaction', dbgText.indexOf('ROOMTOKEN9') < 0 && dbgText.indexOf('wss://x.example:443') >= 0 && (!nick || nick.value.trim().length < 3 || dbgText.indexOf(nick.value.trim()) < 0));

    /* the HUD hide of Show/hide HUD (Alt+H; the former screenshot mode is not a hotkey of its own) */
    need('Screenshot mode is part of Show/hide HUD', Object.keys(hotkeysCommand).indexOf('hk-screenshotMode') < 0 && hotkeysCommand['hk-screenshotMode'] === hotkeysCommand['hk-showHUD']);
    var hud = document.getElementById('overlays-hud') || document.getElementById('leaderboard-hud');
    var menuWas = $('#overlays').is(':visible');
    hotkeysCommand['hk-showHUD'].keyDown();
    await sleep(50);
    var chip = document.getElementById('lm-shot-chip');
    need('screenshot mode on', T.shotActive() && !!chip && inBox(chip.getBoundingClientRect()));
    if (hud) {
      var hidden = false;
      for (var p = hud; p && p !== document.body; p = p.parentNode) if (p.classList.contains('lm-shot-hide')) hidden = true;
      need('HUD hidden in screenshot mode', hidden && getComputedStyle(hud).visibility === 'hidden');
    }
    var main = window.drawRender && drawRender.canvas;
    if (main) need('game canvas still visible', getComputedStyle(main).visibility !== 'hidden');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true, cancelable: true }));
    await sleep(50);
    need('Esc leaves screenshot mode', !T.shotActive() && !document.getElementById('lm-shot-chip') && !document.querySelector('.lm-shot-hide'));
    need('Esc did not toggle the menu', $('#overlays').is(':visible') === menuWas);
    if (hud) need('HUD back', getComputedStyle(hud).visibility !== 'hidden');
    var shotCanvas = T.compose();
    need('capture composes the game view', !!shotCanvas && shotCanvas.width > 0 && shotCanvas.height > 0);
    var capT0 = Date.now();
    var capRes = await new Promise(function (res) { T.capture(function (err, blob) { res({ err: err ? String(err.name || err) : null, size: blob ? blob.size : 0, ms: Date.now() - capT0 }); }); setTimeout(function () { res({ err: 'timeout' }); }, 15000); });
    info.capture = capRes;
    need('capture finished', capRes.err !== 'timeout');
    var pv = document.getElementById('lm-st-shot-preview');
    if (pv) { need('preview fits', inBox(pv.getBoundingClientRect())); pv.querySelector('button').click(); }

    /* accessibility options one by one */
    s.a11yTextScale = 1.3; A.sync();
    var ts = document.getElementById('lm-a11y-text');
    need('text scale rules', !!ts && ts.textContent.indexOf('font-size') >= 0);
    s.a11yTextScale = 1; A.sync();
    need('all accessibility off again: nothing left', !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind'));
  } finally {
    try { T.shotOff(); } catch (e) { }
    OPTS.forEach(function (k) { s[k] = keep[k]; });
    A.sync();
  }
  return { fail: fail, info: info };
})()
