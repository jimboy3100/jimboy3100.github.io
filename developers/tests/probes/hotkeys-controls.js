// Mouse buttons are keys of the Hotkeys window (no Mouse control block, no gamepad switch): a real
// right / wheel / 4 / 5 press on a key field binds that button (Shift + left click the left button),
// the field keeps its key; a bound button runs its command once per press through keyDown / keyUp,
// never over the menu, an input or a HUD link; the old mouse settings become those keys once (also
// for a profile that brings them); the conflict list shows buttons sticky cells takes and buttons the
// old settings moved; Sticky cells is in Settings; Command Centre and the settings search lead to the
// mouse line of the Hotkeys window; on a phone it fits. Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hs = window.legendmod6;
  var hkVisible = function () { return $('#hotkeys').is(':visible'); };
  var closeHk = async function () { if (hkVisible()) { $('#close-hotkeys').trigger('click'); await sleep(600); } };
  var stored = function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  var OLD = ['mouseSplit', 'mouseFeed', 'mouseWheelClick', 'mouseCommand4', 'mouseCommand5', 'leftClick', 'rightClick', 'middleClick', 'mouse4Click', 'mouse5Click', 'stickyCell', 'reverseTrick'];
  var before = {}, lsBefore = {};
  OLD.forEach(function (k) { before[k] = defaultmapsettings[k]; });
  ['ogarioHotkeys', 'ogarioHotkeysKnown', 'ogarioSettings', 'lmHkMouseMoved'].forEach(function (k) { lsBefore[k] = localStorage.getItem(k); });
  var hkBefore = JSON.stringify(window.hotkeys);
  /* the commands used here count their keyDown / keyUp instead of running */
  var CMDS = ['hk-macroFeed', 'hk-split', 'hk-doubleSplit', 'hk-multiboxswap', 'hk-comm10', 'hk-split16'];
  var orig = {}, downs = {}, ups = {};
  CMDS.forEach(function (c) {
    var hc = hotkeysCommand[c];
    if (!hc) { fail.push('no command ' + c); return; }
    orig[c] = { d: hc.keyDown, u: hc.keyUp };
    downs[c] = 0; ups[c] = 0;
    hc.keyDown = function () { downs[c]++; };
    hc.keyUp = orig[c].u ? function () { ups[c]++; } : null;
  });
  var reset = function () { CMDS.forEach(function (c) { downs[c] = 0; ups[c] = 0; }); };
  /* a real MouseEvent: button 0 left, 1 wheel, 2 right, 3 and 4 the side buttons (which = button + 1) */
  var mouse = function (el, type, button, extra) {
    var e = new MouseEvent(type, Object.assign({ bubbles: true, cancelable: true, button: button, clientX: 300, clientY: 200 }, extra || {}));
    el.dispatchEvent(e);
    return e;
  };
  var click = function (el, button, extra) { var d = mouse(el, 'mousedown', button, extra); mouse(el, 'mouseup', button, extra); return d; };
  var key = function (el, type, code) {
    var e = new KeyboardEvent(type, { bubbles: true, cancelable: true });
    Object.defineProperty(e, 'keyCode', { get: function () { return code; } });
    Object.defineProperty(e, 'which', { get: function () { return code; } });
    el.dispatchEvent(e);
    return e;
  };
  var overlaysHidden = false, tmp = [];
  try {
    if (!hs || typeof hs.migrateMouseControls !== 'function' || typeof hs.mouseKey !== 'function') throw new Error('hotkeysSetup mouse functions missing');
    // 1. the Mouse control block and the gamepad switch are gone; gamepad window and conflicts stay
    ['mouseSplit', 'mouseFeed', 'mouseWheelClick', 'mouseCommand4', 'mouseCommand5', 'mouseSplit2', 'mouseFeed2', 'mouseWheelClick2', 'mouseCommand42', 'mouseCommand52', 'gamepadEnabled', 'lm-gp-enable'].forEach(function (id) {
      if (document.getElementById(id)) fail.push('#' + id + ' still exists');
    });
    if ($('#lm-hk-controls .lm-hk-ctl[data-lm-opt], #lm-hk-controls h5[data-lm-sec="mouseGroup"]').length) fail.push('Mouse control rows still in the Hotkeys window');
    if (!$('#hotkeys #lm-hk-controls #lm-gamepad-btn').length) fail.push('Gamepad window button not in the Hotkeys window');
    if (!$('#hotkeys #lm-hk-controls #lm-hk-conf-btn').length) fail.push('conflict list button not in the Hotkeys window');
    var first = $('#hotkeys-cfg > div > div:nth-child(1)').first();
    if (!first.closest('.row').find('.custom-key-in').length) fail.push('first indexed row is not a key row');
    if (!$('#hotkeys-inst [data-i18n="pkg.mb.hkInstMouse"]').text().trim()) fail.push('no mouse line in the Hotkeys window instructions');

    // 2. Sticky cells: once, in Settings > Helpers, same key, saved
    var sc = document.getElementById('stickyCell');
    if ($('[id="stickyCell"]').length !== 1 || !$(sc).closest('#og-options .helpersGroup').length) fail.push('Sticky cells not once in Settings > Helpers');
    else {
      if (sc.checked !== !!defaultmapsettings.stickyCell) fail.push('Sticky cells switch differs from the setting');
      sc.checked = !sc.checked;
      sc.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(30);
      if (defaultmapsettings.stickyCell !== sc.checked) fail.push('Sticky cells switch did not set stickyCell');
      if ((stored('ogarioSettings') || {}).stickyCell !== sc.checked) fail.push('Sticky cells switch not saved');
      sc.checked = !!before.stickyCell;
      sc.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(30);
    }
    defaultmapsettings.stickyCell = false; defaultmapsettings.reverseTrick = false;

    // 3. real mouse buttons on key fields
    $('.hotkeys-link').first().trigger('click');
    await sleep(600);
    var fFeed = document.getElementById('hk-macroFeed'), fDbl = document.getElementById('hk-doubleSplit'), f16 = document.getElementById('hk-split16'), fSwap = document.getElementById('hk-multiboxswap');
    if (!fFeed || !fDbl || !f16 || !fSwap) throw new Error('key fields missing');
    hs.setHotkey('DEL', 'hk-macroFeed');
    hs.setHotkey('W', 'hk-macroFeed');
    fFeed.focus();
    var md = mouse(fFeed, 'mousedown', 2);
    var cm = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
    fFeed.dispatchEvent(cm);
    mouse(fFeed, 'mouseup', 2);
    if (hotkeys['MOUSE RIGHT'] !== 'hk-macroFeed') fail.push('right button on a field did not bind MOUSE RIGHT: ' + hotkeys['MOUSE RIGHT']);
    if (hotkeys.W !== 'hk-macroFeed') fail.push('the field lost its key W when the right button was added');
    if (fFeed.value !== 'W / MOUSE RIGHT') fail.push('field shows "' + fFeed.value + '"');
    if (fFeed.className !== hs.inputClassName) fail.push('field class changed: ' + fFeed.className);
    if (!md.defaultPrevented || !cm.defaultPrevented) fail.push('right click on a field not prevented (browser menu)');
    click(fDbl, 3);
    if (hotkeys['MOUSE 4'] !== 'hk-doubleSplit') fail.push('mouse 4 on a field did not bind MOUSE 4');
    click(f16, 4);
    if (hotkeys['MOUSE 5'] !== 'hk-split16') fail.push('mouse 5 on a field did not bind MOUSE 5');
    click(fSwap, 1);
    if (hotkeys['MOUSE WHEEL'] !== 'hk-multiboxswap') fail.push('wheel click on a field did not bind MOUSE WHEEL');
    if (hs.keysOf('hk-comm10').indexOf('MOUSE WHEEL') >= 0) fail.push('quick chat 10 kept MOUSE WHEEL');
    // a new mouse button replaces the row's button, its key stays
    var dblKeys = hs.keysOf('hk-doubleSplit').filter(function (k) { return !hs.isMouseKey(k); }).join();
    click(fDbl, 4);
    var dblNow = hs.keysOf('hk-doubleSplit');
    if (dblNow.indexOf('MOUSE 5') < 0 || hotkeys['MOUSE 4'] || dblNow.filter(function (k) { return !hs.isMouseKey(k); }).join() !== dblKeys) fail.push('mouse 5 on the double split field: ' + dblNow.join(' / ') + ' (key before ' + dblKeys + ')');
    if (hs.keysOf('hk-split16').indexOf('MOUSE 5') >= 0) fail.push('MOUSE 5 stayed on its old row');
    // a plain left click focuses, Shift + left click binds the left button (a bare Shift only on release)
    hs.setHotkey('DEL', 'hk-split16');
    var leftBefore = hotkeys['MOUSE LEFT'];
    click(f16, 0);
    if (hotkeys['MOUSE LEFT'] !== leftBefore) fail.push('a plain left click bound the left button');
    f16.focus();
    key(f16, 'keydown', 16);
    if (hs.keysOf('hk-split16').length) fail.push('a bare Shift was bound on keydown');
    click(f16, 0, { shiftKey: true });
    key(f16, 'keyup', 16);
    if (hotkeys['MOUSE LEFT'] !== 'hk-split16') fail.push('Shift + left click did not bind MOUSE LEFT');
    if (hs.keysOf('hk-split16').indexOf('SHIFT') >= 0) fail.push('Shift + left click also bound SHIFT');
    key(f16, 'keydown', 16); key(f16, 'keyup', 16);
    if (hotkeys.SHIFT !== 'hk-split16') fail.push('a bare Shift press and release did not bind SHIFT');
    key(f16, 'keydown', 46); key(f16, 'keyup', 46);
    if (hs.keysOf('hk-split16').length || f16.value) fail.push('DEL did not clear the key and the button: ' + f16.value);

    // 4. a bound button runs its command once per press, held commands until release; not over the menu
    var cv = document.getElementById('canvas');
    $('#overlays').hide(); overlaysHidden = true;
    await sleep(50);
    reset();
    mouse(cv, 'mousedown', 2);
    if (downs['hk-macroFeed'] !== 1 || ups['hk-macroFeed'] !== 0) fail.push('right button: macro feed down ' + downs['hk-macroFeed'] + ' up ' + ups['hk-macroFeed']);
    if (!window._lmMacroFeedHeld()) fail.push('macro feed not held while the right button is');
    mouse(cv, 'mouseup', 2);
    if (ups['hk-macroFeed'] !== 1) fail.push('right button up: macro feed keyUp ' + ups['hk-macroFeed']);
    click(cv, 4); click(cv, 4);
    if (downs['hk-doubleSplit'] !== 2) fail.push('mouse 5: two presses ran double split ' + downs['hk-doubleSplit'] + ' times');
    click(cv, 1);
    if (downs['hk-multiboxswap'] !== 1 || downs['hk-comm10'] !== 0) fail.push('wheel: multibox swap ' + downs['hk-multiboxswap'] + ', quick chat 10 ' + downs['hk-comm10']);
    // over inputs, buttons and HUD links nothing runs
    reset();
    var a = document.createElement('a'); a.href = '#'; a.textContent = 'x';
    var btn = document.createElement('button'); btn.type = 'button';
    var inp = document.createElement('input');
    [a, btn, inp].forEach(function (n) { n.style.cssText = 'position:fixed;left:0;top:0;'; document.body.appendChild(n); tmp.push(n); click(n, 2); });
    if (downs['hk-macroFeed']) fail.push('right button over a link / button / input ran macro feed ' + downs['hk-macroFeed'] + ' times');
    // sticky cells takes the left and right button
    defaultmapsettings.stickyCell = true;
    click(cv, 2);
    if (downs['hk-macroFeed']) fail.push('right button ran macro feed with sticky cells on');
    var cf = document.createElement('div'); document.body.appendChild(cf); tmp.push(cf);
    if (window.LMSmallTools && window.LMSmallTools.renderConflicts) {
      window.LMSmallTools.renderConflicts(cf);
      if (!$(cf).find('.lm-st-conf kbd').filter(function () { return $(this).text() === 'MOUSE RIGHT'; }).length) fail.push('conflict list: MOUSE RIGHT taken by sticky cells not listed');
    } else fail.push('LMSmallTools.renderConflicts missing');
    defaultmapsettings.stickyCell = false;
    $('#overlays').show(); overlaysHidden = false;
    await sleep(50);
    reset();
    click(cv, 2);
    if (downs['hk-macroFeed']) fail.push('right button with the menu open ran macro feed');
    await closeHk();
    if (JSON.stringify(window.hotkeys) !== hkBefore) fail.push('Close did not undo the field changes');

    // 5. the old mouse settings become keys, once
    var s = defaultmapsettings;
    hs.loadDefaultHotkeys();
    localStorage.removeItem('lmHkMouseMoved');
    OLD.slice(0, 5).forEach(function (k) { s[k] = false; });
    if (hs.migrateMouseControls() !== 0) fail.push('migration did something with the switches off');
    if (hotkeys['MOUSE WHEEL'] !== 'hk-comm10') fail.push('untouched player: the wheel no longer runs quick chat 10');
    Object.assign(s, { mouseSplit: true, leftClick: 'hk-macroFeed', mouseFeed: true, rightClick: 'hk-gone', mouseWheelClick: true, middleClick: 'hk-multiboxswap', mouseCommand4: true, mouse4Click: 'hk-doubleSplit', mouseCommand5: false, mouse5Click: 'hk-split16' });
    var n = hs.migrateMouseControls();
    info.migrated = n;
    if (n !== 4) fail.push('migration bound ' + n + ' buttons, not 4');
    if (hotkeys['MOUSE LEFT'] !== 'hk-macroFeed' || hotkeys.E !== 'hk-macroFeed') fail.push('left button next to E: ' + hs.keysText('hk-macroFeed'));
    if (hotkeys['MOUSE RIGHT'] !== 'hk-split' || hotkeys.SPACE !== 'hk-split') fail.push('right button with a removed command did not become split next to SPACE: ' + hs.keysText('hk-split'));
    if (hotkeys['MOUSE WHEEL'] !== 'hk-multiboxswap') fail.push('wheel did not become multibox swap');
    if (hotkeys['MOUSE 4'] !== 'hk-doubleSplit') fail.push('mouse 4 did not become double split');
    if (hotkeys['MOUSE 5']) fail.push('mouse 5 (switch off) was bound');
    if (['mouseSplit', 'mouseFeed', 'mouseWheelClick', 'mouseCommand4'].some(function (k) { return s[k] !== false || (stored('ogarioSettings') || {})[k] !== false; })) fail.push('old switches not turned off and saved');
    if ((stored('ogarioHotkeys') || {})['MOUSE LEFT'] !== 'hk-macroFeed') fail.push('migrated keys not saved');
    var notes = hs.mouseNotes();
    if (!(notes.length === 1 && notes[0].key === 'MOUSE WHEEL' && notes[0].from === 'hk-comm10' && notes[0].to === 'hk-multiboxswap')) fail.push('the wheel taken from quick chat 10 not noted: ' + JSON.stringify(notes));
    var snap = JSON.stringify(hotkeys);
    if (hs.migrateMouseControls() !== 0 || JSON.stringify(hotkeys) !== snap) fail.push('migration is not idempotent');
    // the migrated buttons run their commands
    $('#overlays').hide(); overlaysHidden = true;
    await sleep(50);
    reset();
    click(cv, 0); click(cv, 3);
    if (downs['hk-macroFeed'] !== 1 || ups['hk-macroFeed'] !== 1 || downs['hk-doubleSplit'] !== 1) fail.push('migrated buttons: feed ' + downs['hk-macroFeed'] + '/' + ups['hk-macroFeed'] + ', double split ' + downs['hk-doubleSplit']);
    $('#overlays').show(); overlaysHidden = false;
    if (window.LMSmallTools && window.LMSmallTools.renderConflicts) {
      window.LMSmallTools.renderConflicts(cf);
      var mrow = $(cf).find('.lm-st-conf').filter(function () { return $(this).find('kbd').text() === 'MOUSE WHEEL'; });
      if (!mrow.length) fail.push('conflict list: the moved wheel not listed');
      else {
        mrow.find('a.lm-st-link').last()[0].click();
        if (hs.mouseNotes().length) fail.push('OK did not dismiss the wheel note');
      }
    }
    // a profile from before brings a switch: it becomes a key too
    if (window.LMProfiles && typeof window.LMProfiles.applySet === 'function') {
      hs.setHotkey('DEL', 'hk-doubleSplit');
      var pr = window.LMProfiles.applySet({ s: { mouseCommand5: true, mouse5Click: 'hk-doubleSplit' } }, 'probe');
      await sleep(50);
      if (pr === null) info.profile = 'not applied (profiles not ready)';
      else if (hotkeys['MOUSE 5'] !== 'hk-doubleSplit' || s.mouseCommand5 !== false) fail.push('an old profile with mouse button 5 did not become MOUSE 5: ' + hotkeys['MOUSE 5'] + ', switch ' + s.mouseCommand5);
    }

    // 6. Command Centre and the settings search lead to the mouse line of the Hotkeys window
    var CC = window.LMCommandCentre;
    if (CC && CC.items) {
      var ids = CC.items().map(function (it) { return it.id; });
      ['sec:lmHkMouse', 'sec:lmHkGamepad', 'opt:stickyCell'].forEach(function (id) { if (ids.indexOf(id) < 0) fail.push('Command Centre has no ' + id); });
      ['opt:mouseCommand4', 'set:mouseCommand42', 'opt:gamepadEnabled', 'sec:mouseGroup'].forEach(function (id) { if (ids.indexOf(id) >= 0) fail.push('Command Centre still has ' + id); });
      CC.open();
      var q = document.getElementById('lm-cc-q');
      q.value = $.trim(lmT('pkg.mb.mouseButtons'));
      q.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(80);
      var row = document.querySelector('#lm-cc .lm-cc-row[data-id="sec:lmHkMouse"]');
      if (!row) fail.push('Command Centre search finds no mouse buttons line');
      else {
        row.click();
        await sleep(900);
        if (!hkVisible()) fail.push('Command Centre mouse buttons did not open the Hotkeys window');
      }
      try { CC.close(); } catch (e) { }
      await closeHk();
    } else fail.push('LMCommandCentre not loaded');
    var ss = document.getElementById('lm-settings-search');
    if (ss) {
      ss.value = $.trim(lmT('pkg.mb.mouseButtons'));
      ss.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(250);
      var go = $('#lm-ss-hk .lm-ss-hk-go[data-hk-id="hotkeys-inst"]');
      if (!go.length) fail.push('settings search does not point to the mouse buttons of the Hotkeys window');
      else { go.trigger('click'); await sleep(700); if (!hkVisible()) fail.push('settings search button did not open the Hotkeys window'); }
      ss.value = '';
      ss.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(250);
      await closeHk();
    }

    // 7. the window fits (phone 915x412 too), a field with a key and a button too
    $('.hotkeys-link').first().trigger('click'); await sleep(600);
    var hr = document.getElementById('hotkeys').getBoundingClientRect();
    $('#lm-hk-controls .btn, #hotkeys-cfg .custom-key-in[data-lm-two]').each(function () {
      var c = this.getBoundingClientRect();
      if (c.width && (c.right > hr.right + 1 || c.left < hr.left - 1)) fail.push('control outside the window: ' + (this.id || this.className));
    });
    info.twoKeyFields = $('#hotkeys-cfg .custom-key-in[data-lm-two]').length;
    var cl = document.getElementById('close-hotkeys').getBoundingClientRect();
    if (cl.right > innerWidth + 1 || cl.bottom > innerHeight + 1 || cl.width < 1) fail.push('Close off screen');
    info.window = Math.round(hr.width) + 'x' + Math.round(hr.height) + ' in ' + innerWidth + 'x' + innerHeight;
    await closeHk();
  } catch (e) {
    fail.push('error: ' + (e && e.message));
  } finally {
    if (overlaysHidden) $('#overlays').show();
    tmp.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    CMDS.forEach(function (c) { if (orig[c]) { hotkeysCommand[c].keyDown = orig[c].d; hotkeysCommand[c].keyUp = orig[c].u; } });
    try {
      OLD.forEach(function (k) { defaultmapsettings[k] = before[k]; });
      window.hotkeys = JSON.parse(hkBefore);
      if (hs) { hs.openSnapshot = null; hs.syncMessageKey(); hs.refreshHotkeysMenu(); }
      Object.keys(lsBefore).forEach(function (k) { if (lsBefore[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, lsBefore[k]); });
    } catch (e) { }
    await closeHk();
  }
  return { fail: fail, info: info };
})()
