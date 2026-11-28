// Small tools + accessibility (ogario/modules/smalltools.js, accessibility.js): off by default with
// nothing added to the page; each window opens, fits the screen (915x412 phone too) and closes with
// its x; the radial menu runs the command pointed at; screenshot mode hides the HUD and Esc brings
// it back; the capture composes the game canvases; each accessibility option switches on and off.
// Stored keys and options are put back.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMSmallTools && window.LMSmallTools.open && window.LMAccessibility && window.LMAccessibility.sync); i++) await sleep(250);
  var T = window.LMSmallTools, A = window.LMAccessibility, s = window.legendmod5;
  need('modules loaded', !!(T && T.open && A && A.sync));
  if (!T || !A || !s) return { fail: fail, info: info };
  var KEYS = ['lmRadialMenu', 'lmSmallTools'], stored = {};
  KEYS.forEach(function (k) { try { stored[k] = localStorage.getItem(k); } catch (e) { } });
  var OPTS = ['a11yTextScale', 'a11yHudTextScale'], keep = {};
  OPTS.forEach(function (k) { keep[k] = s[k]; });
  var inBox = function (r) { return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; };
  var HK = ['hk-radialMenu', 'hk-screenshotCapture'];
  try {
    need('options off by default', LM_SETTINGS_DEFAULTS.a11yTextScale === 1 && LM_SETTINGS_DEFAULTS.a11yHudTextScale === 1 && LM_THEME_DEFAULTS.gameBrightness === 100 && LM_THEME_DEFAULTS.gameSaturation === 100);
    /* the sector symbol is removed */
    need('removed Theme options are gone', !('sectorsSymbol' in LM_THEME_DEFAULTS));
    need('menu controls', ['a11yTextScale-slider', 'a11yHudTextScale-slider', 'gameBrightness-slider', 'gameSaturation-slider'].every(function (id) { return !!document.getElementById(id); }));
    need('removed duplicates are gone', !('hk-bugReport' in hotkeysCommand) && !('a11yPalette' in LM_SETTINGS_DEFAULTS) && !('a11yHighContrast' in LM_SETTINGS_DEFAULTS) && !('a11yNoFlash' in LM_SETTINGS_DEFAULTS) && !('a11yIndicators' in LM_SETTINGS_DEFAULTS) && !document.getElementById('a11yIndicators') && !('_lmA11yPal' in window));
    HK.forEach(function (id) { need(id + ' without a default key', hotkeysCommand[id] && hotkeysCommand[id].defaultKey === ''); });
    if (window.LMCommandCentre) {
      var ids = window.LMCommandCentre.items().map(function (it) { return it.id; });
      need('reachable from the Command Centre', HK.concat([]).every(function (h) { return ids.indexOf('hk:' + h) >= 0; }) && ids.indexOf('set:a11yTextScale') >= 0);
    }
    var allOff = s.a11yTextScale === 1 && s.a11yHudTextScale === 1;
    if (allOff) need('accessibility off: nothing added', !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind'));
    /* Skin collections are part of the player profiles: no window, button, setting or
     * hotkey of their own */
    T.open('skins');
    need('Skin collections: no window, button, setting, hotkey or command', !T.isOpen() && !document.getElementById('lm-st-skins') && !document.getElementById('lm-skin-collections') &&
      !('skinCollections' in LM_SETTINGS_DEFAULTS) && !('hk-skinCollections' in hotkeysCommand) &&
      !(window.LMCommandCentre && window.LMCommandCentre.items().some(function (it) { return /skinCollections/.test(it.id); })));
    /* no favourite stars, gold ring or profile search in the skins panel (removed) */
    need('no profile stars or search', !document.querySelector('#skins .lm-prof-star, #skins .lm-prof-fav, #lm-prof-search, #lm-prof-none, #lm-prof-css'));
    /* the conflict list of the Hotkeys window is removed (section, button, list and API) */
    need('Hotkey conflicts: removed', !document.getElementById('lm-hk-conf-btn') && !document.getElementById('lm-hk-conf-list') && !$('#hotkeys-cfg [data-lm-sec="lmHkConflicts"]').length &&
      !('hk-hotkeyConflicts' in hotkeysCommand) && !('conflicts' in T) && !('renderConflicts' in T) && !('refreshConflicts' in T));
    need('Hotkeys window: the Gamepad section stays', !!document.getElementById('lm-gamepad-btn'));
    need('keyCheck refuses browser keys', T.keyCheck && T.keyCheck('CTRL+T') && T.keyCheck('CTRL+T').level === 'block' && !T.keyCheck('Q'));

    /* every window opens on screen and closes with its x */
    var wins = { radial: 'lm-st-radial', screenshot: 'lm-st-shot' };
    for (var name in wins) {
      T.open(name);
      await sleep(60);
      var w = document.getElementById(wins[name]);
      need(name + ' window opens', !!w && T.isOpen(name));
      if (!w) continue;
      var r = w.getBoundingClientRect();
      need(name + ' window fits the screen', inBox(r));
      var x = w.querySelector('.lm-st-close');
      need(name + ' close button usable', !!x && x.getBoundingClientRect().width >= 30 && x.getBoundingClientRect().height >= 30);
      if (x) x.click();
      need(name + ' closes', !document.getElementById(wins[name]) && !T.isOpen());
      info[name] = [Math.round(r.width), Math.round(r.height)];
    }
    /* the existing Settings > Copy debug info text goes through the redaction */
    var nick = document.getElementById('nick');
    var dbgText = T.redactReport('Server: wss://x.example:443/el-room/ROOMTOKEN9 nick ' + ((nick && nick.value) || ''));
    need('debug info redaction', dbgText.indexOf('ROOMTOKEN9') < 0 && dbgText.indexOf('wss://x.example:443') >= 0 && (!nick || nick.value.trim().length < 3 || dbgText.indexOf(nick.value.trim()) < 0));

    /* radial menu: a probe command on the ring, point at it, release */
    var ran = 0;
    hotkeysCommand['hk-zzProbe'] = { label: 'Probe', defaultKey: '', keyDown: function () { ran++; }, keyUp: null, type: 'normal' };
    localStorage.setItem('lmRadialMenu', JSON.stringify({ v: 1, items: ['hk-zzProbe', 'hk-showMass'] }));
    hotkeysCommand['hk-radialMenu'].keyDown();
    var rd = document.getElementById('lm-radial');
    need('radial ring opens', !!rd && T.radialOpen() && rd.querySelectorAll('.lm-rd-item').length === 2);
    if (rd) {
      var items = rd.querySelectorAll('.lm-rd-item'), ir = items[0].getBoundingClientRect();
      need('radial items on screen', inBox(ir) && inBox(items[1].getBoundingClientRect()));
      T.radialPoint(ir.left + ir.width / 2, ir.top + ir.height / 2);
      need('radial highlights the item pointed at', items[0].className.indexOf('on') >= 0);
      await sleep(400);
      hotkeysCommand['hk-radialMenu'].keyUp();
      need('radial runs it on release and closes', ran === 1 && !document.getElementById('lm-radial'));
    }
    /* a short press keeps the ring open; a tap on an item runs it */
    hotkeysCommand['hk-radialMenu'].keyDown();
    hotkeysCommand['hk-radialMenu'].keyUp();
    rd = document.getElementById('lm-radial');
    need('short press keeps the ring open', !!rd);
    if (rd) {
      var it0 = rd.querySelector('.lm-rd-item').getBoundingClientRect();
      rd.dispatchEvent(new PointerEvent('pointerdown', { clientX: it0.left + it0.width / 2, clientY: it0.top + it0.height / 2, bubbles: true, cancelable: true }));
      need('tap runs the item', ran === 2 && !document.getElementById('lm-radial'));
    }
    hotkeysCommand['hk-radialMenu'].keyDown();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true, cancelable: true }));
    need('Esc closes the ring without running', !document.getElementById('lm-radial') && ran === 2);
    delete hotkeysCommand['hk-zzProbe'];

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
    s.a11yTextScale = 1.3; s.a11yHudTextScale = 1.2; A.sync();
    var ts = document.getElementById('lm-a11y-text');
    need('text scale rules', !!ts && ts.textContent.indexOf('font-size') >= 0);
    s.a11yTextScale = 1; s.a11yHudTextScale = 1; A.sync();
    need('all accessibility off again: nothing left', !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind'));
  } finally {
    try { T.close(); T.radialClose(); T.shotOff(); } catch (e) { }
    delete hotkeysCommand['hk-zzProbe'];
    OPTS.forEach(function (k) { s[k] = keep[k]; });
    KEYS.forEach(function (k) { try { if (stored[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, stored[k]); } catch (e) { } });
    A.sync();
  }
  return { fail: fail, info: info };
})()
