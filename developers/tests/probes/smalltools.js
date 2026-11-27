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
  var OPTS = ['a11yTextScale', 'a11yHudTextScale', 'a11yIndicators'], keep = {};
  OPTS.forEach(function (k) { keep[k] = s[k]; });
  var inBox = function (r) { return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; };
  var HK = ['hk-radialMenu', 'hk-radialEditor', 'hk-screenshotCapture', 'hk-screenshotTool'];
  try {
    need('options off by default', LM_SETTINGS_DEFAULTS.a11yIndicators === false &&
      LM_SETTINGS_DEFAULTS.a11yTextScale === 1 && LM_SETTINGS_DEFAULTS.a11yHudTextScale === 1);
    need('removed duplicates are gone', !('hk-bugReport' in hotkeysCommand) && !('a11yPalette' in LM_SETTINGS_DEFAULTS) && !('a11yHighContrast' in LM_SETTINGS_DEFAULTS) && !('a11yNoFlash' in LM_SETTINGS_DEFAULTS) && !('_lmA11yPal' in window));
    need('menu controls', ['a11yIndicators', 'a11yTextScale-slider', 'a11yHudTextScale-slider'].every(function (id) { return !!document.getElementById(id); }));
    HK.forEach(function (id) { need(id + ' without a default key', hotkeysCommand[id] && hotkeysCommand[id].defaultKey === ''); });
    var allOff = !s.a11yIndicators && s.a11yTextScale === 1 && s.a11yHudTextScale === 1;
    if (allOff) need('accessibility off: nothing added', !document.getElementById('lm-a11y-text') && !document.getElementById('lm-a11y-ind'));
    /* Skin collections are part of the player profiles: no window, button, setting or
     * hotkey of their own; a star on every profile in the skins panel instead */
    T.open('skins');
    need('Skin collections: no window, button, setting, hotkey or command', !T.isOpen() && !document.getElementById('lm-st-skins') && !document.getElementById('lm-skin-collections') &&
      !('skinCollections' in LM_SETTINGS_DEFAULTS) && !('hk-skinCollections' in hotkeysCommand));
    var star = document.querySelector('#skins .skin-box .lm-prof-star[data-profile="1"]'), p1 = window.profiles && window.profiles[1];
    if (document.getElementById('skins')) {
      need('a star on every profile', !!star && document.querySelectorAll('#skins .lm-prof-star').length === document.querySelectorAll('#skins .skin-box').length);
      need('profile search only with more than 15 profiles', !!document.getElementById('lm-prof-search') && (window.profiles.length > 15) === ($('#lm-prof-search').css('display') !== 'none'));
    }
    info.profileStars = document.querySelectorAll('#skins .lm-prof-star').length;
    if (star && p1) {
      var favWas = p1.fav === true, selWas = $('#skins a.selected').attr('id');
      star.click();
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem('ogarioPlayerProfiles'))[1]; } catch (e) { }
      need('star click: favourite saved with the profile, ring shown, selection kept', (p1.fav === true) !== favWas && !!saved && (saved.fav === true) === (p1.fav === true) &&
        $(star).closest('.skin-box').hasClass('lm-prof-fav') === (p1.fav === true) && $('#skins a.selected').attr('id') === selWas);
      star.click();
      need('star click again: back as it was', (p1.fav === true) === favWas);
    }
    /* the conflict list is in the Hotkeys window only (its own section, not a header button and
     * not a small tools window / hotkey of its own) */
    need('no conflicts button in the hotkeys window header', !document.getElementById('lm-hk-conflicts') && !$('#hotkeys-menu #lm-hk-conf-btn').length);
    need('Hotkey conflicts: no window or hotkey of its own', !('hk-hotkeyConflicts' in hotkeysCommand) && !T.open('conflicts') && !document.getElementById('lm-st-conflicts'));
    var cfBtn = document.getElementById('lm-hk-conf-btn'), cfList = document.getElementById('lm-hk-conf-list');
    need('Hotkey conflicts: a section of the Hotkeys window', !!cfBtn && !!cfList && $(cfBtn).closest('#hotkeys #lm-hk-controls').length === 1 && cfList.style.display === 'none');
    if (cfBtn && cfList) {
      var hkWas = $('#hotkeys').is(':visible');
      if (!hkWas) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
      /* a key bound twice (an imported lower case letter is the same key) */
      var cmdA = 'hk-zzConfA', cmdB = 'hk-zzConfB';
      hotkeysCommand[cmdA] = { label: 'Probe A', defaultKey: '', keyDown: function () { } };
      hotkeysCommand[cmdB] = { label: 'Probe B', defaultKey: '', keyDown: function () { } };
      var hkF9 = window.hotkeys['J'], hkf9 = window.hotkeys['j'];
      window.hotkeys['J'] = cmdA;
      window.hotkeys['j'] = cmdB;
      cfBtn.click();
      await sleep(50);
      var rowsC = cfList.querySelectorAll('.lm-st-conf');
      var dupRow = Array.prototype.filter.call(rowsC, function (r) { return /Probe A/.test(r.textContent) && /Probe B/.test(r.textContent); })[0];
      need('Hotkey conflicts: the list opens in the window and shows a key bound twice, with a jump per command', cfList.style.display !== 'none' && !!dupRow && dupRow.querySelectorAll('a.lm-st-link').length === 2);
      var lr = cfList.getBoundingClientRect(), hr0 = document.getElementById('hotkeys').getBoundingClientRect();
      need('Hotkey conflicts: the list fits the window width', lr.width > 0 && lr.left >= hr0.left - 1 && lr.right <= hr0.right + 1);
      info.confRows = rowsC.length;
      /* a key change while it is shown: the list follows */
      delete window.hotkeys['j'];
      if (T.refreshConflicts) T.refreshConflicts();
      await sleep(30);
      need('Hotkey conflicts: built again after a change', !Array.prototype.some.call(cfList.querySelectorAll('.lm-st-conf'), function (r) { return /Probe B/.test(r.textContent); }));
      cfBtn.click();
      need('Hotkey conflicts: the button closes the list', cfList.style.display === 'none' && !cfList.firstChild);
      delete window.hotkeys['J']; delete window.hotkeys['j'];
      if (hkF9 !== undefined) window.hotkeys['J'] = hkF9;
      if (hkf9 !== undefined) window.hotkeys['j'] = hkf9;
      delete hotkeysCommand[cmdA]; delete hotkeysCommand[cmdB];
      if (!hkWas) { $('#close-hotkeys').trigger('click'); await sleep(600); }
    }
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

    /* conflicts list */
    var list = T.conflicts();
    need('conflict check runs', Array.isArray(list));

    info.conflicts = list.map(function (c) { return c.kind + ':' + c.key + ':' + c.level; }).join(' ');

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
    s.a11yIndicators = true; A.sync();
    need('indicator canvas on', !!document.getElementById('lm-a11y-ind'));
    await sleep(100);
    s.a11yIndicators = false; s.a11yTextScale = 1.3; s.a11yHudTextScale = 1.2; A.sync();
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
