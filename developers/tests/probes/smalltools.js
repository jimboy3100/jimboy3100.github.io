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
  var KEYS = ['lmRadialMenu', 'lmSkinCollections', 'lmSmallTools'], stored = {};
  KEYS.forEach(function (k) { try { stored[k] = localStorage.getItem(k); } catch (e) { } });
  var OPTS = ['skinCollections', 'a11yTextScale', 'a11yHudTextScale', 'a11yHighContrast', 'a11yIndicators', 'a11yNoFlash', 'a11yPalette'], keep = {};
  OPTS.forEach(function (k) { keep[k] = s[k]; });
  var inBox = function (r) { return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; };
  var HK = ['hk-radialMenu', 'hk-radialEditor', 'hk-hotkeyConflicts', 'hk-screenshotMode', 'hk-screenshotCapture', 'hk-screenshotTool', 'hk-skinCollections', 'hk-bugReport'];
  try {
    need('options off by default', LM_SETTINGS_DEFAULTS.skinCollections === false && LM_SETTINGS_DEFAULTS.a11yHighContrast === false && LM_SETTINGS_DEFAULTS.a11yIndicators === false &&
      LM_SETTINGS_DEFAULTS.a11yNoFlash === false && LM_SETTINGS_DEFAULTS.a11yPalette === 'off' && LM_SETTINGS_DEFAULTS.a11yTextScale === 1 && LM_SETTINGS_DEFAULTS.a11yHudTextScale === 1);
    need('menu controls', ['a11yHighContrast', 'a11yIndicators', 'a11yNoFlash', 'a11yTextScale-slider', 'a11yHudTextScale-slider', 'a11yPalette', 'skinCollections'].every(function (id) { return !!document.getElementById(id); }));
    HK.forEach(function (id) { need(id + ' without a default key', hotkeysCommand[id] && hotkeysCommand[id].defaultKey === ''); });
    if (window.LMCommandCentre) {
      var ids = window.LMCommandCentre.items().map(function (it) { return it.id; });
      need('reachable from the Command Centre', HK.concat([]).every(function (h) { return ids.indexOf('hk:' + h) >= 0; }) && ids.indexOf('opt:a11yHighContrast') >= 0 && ids.indexOf('set:a11yPalette') >= 0 && ids.indexOf('opt:skinCollections') >= 0);
    }
    var allOff = !s.a11yHighContrast && !s.a11yIndicators && !s.a11yNoFlash && s.a11yPalette === 'off' && s.a11yTextScale === 1 && s.a11yHudTextScale === 1;
    if (allOff) need('accessibility off: nothing added', !document.getElementById('lm-a11y-style') && !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind') && window._lmA11yPal === null);
    if (!s.skinCollections) need('collections button only with its option', !document.getElementById('lm-skin-collections'));
    need('conflicts button in the hotkeys window', !!document.getElementById('lm-hk-conflicts'));

    /* every window opens on screen and closes with its x */
    var wins = { radial: 'lm-st-radial', conflicts: 'lm-st-conflicts', screenshot: 'lm-st-shot', skins: 'lm-st-skins', bugReport: 'lm-st-bug' };
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
    /* hotkeys toggle the windows */
    hotkeysCommand['hk-bugReport'].keyDown();
    var ta = document.getElementById('lm-st-bug-text');
    need('bug report text', !!ta && /Legend Mod .* diagnostic report/.test(ta.value) && /Page errors/.test(ta.value));
    var nick = document.getElementById('nick');
    if (ta && nick && nick.value && nick.value.trim().length >= 3) need('bug report has no nick', ta.value.indexOf(nick.value.trim()) < 0);
    hotkeysCommand['hk-bugReport'].keyDown();
    need('bug report hotkey toggles', !T.isOpen());

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

    /* conflicts list */
    var list = T.conflicts();
    need('conflict check runs', Array.isArray(list));
    /* the Conflicts button sits with the other hotkeys window buttons, on screen and apart */
    var hkLink = document.querySelector('.hotkeys-link');
    if (hkLink) {
      var hkWasOpen = $('#hotkeys').is(':visible');
      if (!hkWasOpen) { hkLink.click(); await sleep(700); }
      var btns = Array.prototype.slice.call(document.querySelectorAll('#hotkeys-menu button')).map(function (b) { return b.getBoundingClientRect(); });
      var cb = document.getElementById('lm-hk-conflicts').getBoundingClientRect();
      need('conflicts button on screen', inBox(cb));
      need('hotkeys window buttons do not overlap', btns.every(function (a, i) { return btns.every(function (b, j) { return i === j || !(a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1); }); }));
      info.hkMenu = Math.round(document.getElementById('hotkeys-menu').getBoundingClientRect().height);
      document.getElementById('lm-hk-conflicts').click();
      await sleep(50);
      need('conflicts window from the hotkeys window', T.isOpen('conflicts') && $('#lm-st-conflicts').css('z-index') > +($('#hotkeys').css('z-index') || 0));
      var jl = document.querySelector('#lm-st-conflicts a.lm-st-link');
      info.jump = !!jl;
      T.close();
      if (!hkWasOpen) { $('#close-hotkeys').trigger('click'); await sleep(600); }
    }
    info.conflicts = list.map(function (c) { return c.kind + ':' + c.key + ':' + c.level; }).join(' ');

    /* screenshot mode */
    var hud = document.getElementById('overlays-hud') || document.getElementById('leaderboard-hud');
    var menuWas = $('#overlays').is(':visible');
    hotkeysCommand['hk-screenshotMode'].keyDown();
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

    /* skin collections button */
    s.skinCollections = true;
    T.sync();
    var sb = document.getElementById('lm-skin-collections');
    need('collections button with its option', !!sb);
    if (sb) { sb.click(); await sleep(50); need('collections button opens the window', T.isOpen('skins')); T.close(); }
    s.skinCollections = keep.skinCollections;
    T.sync();
    need('collections button gone again', !!s.skinCollections === !!document.getElementById('lm-skin-collections'));

    /* accessibility options one by one */
    s.a11yHighContrast = true; A.sync();
    need('high contrast on', document.body.classList.contains('lm-a11y-hc') && !!document.getElementById('lm-a11y-style'));
    s.a11yHighContrast = false; s.a11yNoFlash = true; A.sync();
    need('no flashing on', document.body.classList.contains('lm-a11y-noflash') && !document.body.classList.contains('lm-a11y-hc'));
    s.a11yNoFlash = false; s.a11yIndicators = true; A.sync();
    need('indicator canvas on', !!document.getElementById('lm-a11y-ind'));
    await sleep(100);
    s.a11yIndicators = false; s.a11yPalette = 'tritanopia'; A.sync();
    need('palette on', window._lmA11yPal && window._lmA11yPal.enemyBColor === A._core.PALETTES.tritanopia.enemyBColor && document.getElementById('a11yPalette').value === 'tritanopia');
    s.a11yPalette = 'nonsense'; A.sync();
    need('unknown palette = theme colours', window._lmA11yPal === null);
    s.a11yPalette = 'off'; s.a11yTextScale = 1.3; s.a11yHudTextScale = 1.2; A.sync();
    var ts = document.getElementById('lm-a11y-text');
    need('text scale rules', !!ts && ts.textContent.indexOf('font-size') >= 0);
    s.a11yTextScale = 1; s.a11yHudTextScale = 1; A.sync();
    need('all accessibility off again: nothing left', !document.getElementById('lm-a11y-style') && !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind') &&
      !document.body.classList.contains('lm-a11y-hc') && !document.body.classList.contains('lm-a11y-noflash') && window._lmA11yPal === null);
  } finally {
    try { T.close(); T.radialClose(); T.shotOff(); } catch (e) { }
    delete hotkeysCommand['hk-zzProbe'];
    OPTS.forEach(function (k) { s[k] = keep[k]; });
    KEYS.forEach(function (k) { try { if (stored[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, stored[k]); } catch (e) { } });
    A.sync(); T.sync();
  }
  return { fail: fail, info: info };
})()
