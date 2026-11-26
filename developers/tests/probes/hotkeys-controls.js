// Mouse buttons, sticky cells and gamepad support are in the Hotkeys window only (none in the Settings tab):
// a switch and a mouse 4 command chosen there are stored in the same keys and take effect; the Gamepad
// window button is there; Command Centre ("mouse button") and the settings search open the Hotkeys window
// at them; on a phone the rows fit the window. Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var IDS = ['stickyCell', 'mouseSplit', 'mouseFeed', 'mouseWheelClick', 'mouseCommand4', 'mouseCommand5', 'gamepadEnabled',
    'mouseSplit2', 'mouseFeed2', 'mouseWheelClick2', 'mouseCommand42', 'mouseCommand52', 'lm-gamepad-btn'];
  var hkVisible = function () { return $('#hotkeys').is(':visible'); };
  var closeHk = async function () { if (hkVisible()) { $('#close-hotkeys').trigger('click'); await sleep(600); } };
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}'); } catch (e) { return {}; } };
  var before = {}, keys = ['mouseCommand4', 'mouse4Click', 'stickyCell', 'reverseTrick'];
  keys.forEach(function (k) { before[k] = defaultmapsettings[k]; });
  var probeCmd = 'hk-lmProbeHkCtl', presses = 0, sel4 = document.getElementById('mouseCommand42'), added = null;
  var overlaysHidden = false;
  try {
    // nowhere in Settings, all in the Hotkeys window
    IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) { fail.push('missing #' + id); return; }
      if ($(el).closest('#og-settings, #og-options').length) fail.push('#' + id + ' is still in the Settings tab');
      if (!$(el).closest('#hotkeys #hotkeys-cfg #lm-hk-controls').length) fail.push('#' + id + ' not in the Hotkeys window');
    });
    if ($('#og-options .mouseGroup, #og-options .controlsGroup').length) fail.push('Controls section still in Settings');
    if (document.getElementById('gamepadDeadzone-slider')) fail.push('dead zone slider outside the Gamepad window');
    if ($('#lm-hk-controls').find('input[type=range]').length) fail.push('a slider in the Hotkeys window controls');
    // each switch shows its setting; each command list shows the stored command
    ['stickyCell', 'mouseSplit', 'mouseFeed', 'mouseWheelClick', 'mouseCommand4', 'mouseCommand5', 'gamepadEnabled'].forEach(function (k) {
      var cb = document.getElementById(k);
      if (cb && cb.checked !== !!defaultmapsettings[k]) fail.push(k + ' switch differs from the setting');
    });
    [['mouseSplit2', 'leftClick'], ['mouseFeed2', 'rightClick'], ['mouseWheelClick2', 'middleClick'], ['mouseCommand42', 'mouse4Click'], ['mouseCommand52', 'mouse5Click']].forEach(function (p) {
      var s = document.getElementById(p[0]);
      if (s && defaultmapsettings[p[1]] && s.value !== String(defaultmapsettings[p[1]])) fail.push(p[0] + ' shows ' + s.value + ', setting ' + defaultmapsettings[p[1]]);
      if (s && s.options.length < 30) fail.push(p[0] + ' has only ' + s.options.length + ' commands');
    });
    // the key rows keep their order: the controls block starts with a heading (old row-index selectors)
    var first = $('#hotkeys-cfg > div > div:nth-child(1)').first();
    if (!first.closest('.row').find('.custom-key-in').length) fail.push('first indexed row is not a key row');

    // a mouse 4 command chosen here: same key, saved, and it runs on mouse button 4 while playing
    if (sel4 && !defaultmapsettings.stickyCell && !defaultmapsettings.reverseTrick) {
      hotkeysCommand[probeCmd] = { label: 'probe', defaultKey: '', keyDown: function () { presses++; } };
      added = document.createElement('option');
      added.value = probeCmd; added.textContent = 'probe';
      sel4.appendChild(added);
      $(sel4).val(probeCmd).trigger('change');
      if (defaultmapsettings.mouse4Click !== probeCmd) fail.push('mouse 4 command not stored in mouse4Click');
      if (stored().mouse4Click !== probeCmd) fail.push('mouse 4 command not saved');
      var cb4 = document.getElementById('mouseCommand4');
      if (!cb4.checked) {
        var sw = cb4.nextElementSibling && cb4.nextElementSibling.classList.contains('switchery') ? cb4.nextElementSibling : null;
        if (sw) sw.click(); else { cb4.checked = true; cb4.dispatchEvent(new Event('change', { bubbles: true })); }
        await sleep(30);
      }
      if (defaultmapsettings.mouseCommand4 !== true) fail.push('mouse button 4 switch did not set mouseCommand4');
      if (stored().mouseCommand4 !== true) fail.push('mouse button 4 switch not saved');
      $('#overlays').hide(); overlaysHidden = true;
      var cv = document.getElementById('canvas') || document.body;
      window.onmousedown({ which: 4, button: 3, target: cv, preventDefault: function () { } });
      window.onmouseup({ which: 4, button: 3, target: cv, preventDefault: function () { } });
      if (presses !== 1) fail.push('mouse button 4 ran the chosen command ' + presses + ' times');
      $('#overlays').show(); overlaysHidden = false;
    } else info.mouse4 = 'skipped (sticky cells / reverse trick on)';

    // Command Centre: "mouse button" finds them and opens the Hotkeys window
    var CC = window.LMCommandCentre;
    if (CC && CC.open) {
      await closeHk();
      var items = CC.items();
      ['opt:mouseCommand4', 'set:mouseCommand42', 'opt:gamepadEnabled', 'sec:mouseGroup'].forEach(function (id) {
        if (!items.some(function (it) { return it.id === id; })) fail.push('Command Centre has no ' + id);
      });
      CC.open();
      var q = document.getElementById('lm-cc-q');
      q.value = 'mouse button';
      q.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(80);
      var rows = Array.prototype.slice.call(document.querySelectorAll('#lm-cc .lm-cc-row'));
      var row = rows.filter(function (r) { return /^set:mouse/.test(r.getAttribute('data-id') || ''); })[0];
      info.ccTop = rows.slice(0, 5).map(function (r) { return r.getAttribute('data-id'); }).join(',');
      if (!row) fail.push('"mouse button" finds no mouse button command: ' + info.ccTop);
      else {
        row.click();
        var box = null;
        for (var w = 0; w < 25; w++) {
          await sleep(100);
          box = document.getElementById(row.getAttribute('data-id').slice(4));
          box = box && box.closest('.row');
          if (box && box.classList.contains('lm-cc-flash')) break;
        }
        if (!hkVisible()) fail.push('Command Centre result did not open the Hotkeys window');
        if (!box || !box.classList.contains('lm-cc-flash')) fail.push('Command Centre result row not highlighted');
      }
      try { CC.close(); } catch (e) { }
      await closeHk();
      if (CC.reveal && !CC.reveal('gamepadEnabled')) fail.push('reveal(gamepadEnabled) failed');
      await sleep(700);
      if (!hkVisible()) fail.push('reveal(gamepadEnabled) did not open the Hotkeys window');
      await closeHk();
    } else fail.push('LMCommandCentre not loaded');

    // the settings search lists them and opens the Hotkeys window
    var ss = document.getElementById('lm-settings-search');
    if (ss) {
      ss.value = $.trim($('#lm-hk-controls [data-lm-opt="mouseCommand4"] .key-label').text()); /* the label in the current language */
      ss.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(250);
      var go = $('#lm-ss-hk .lm-ss-hk-go[data-hk-id="mouseCommand4"]');
      if (!$('#lm-ss-hk').is(':visible') || !go.length) fail.push('settings search does not point to the Hotkeys window');
      else {
        go.trigger('click');
        await sleep(700);
        if (!hkVisible()) fail.push('settings search button did not open the Hotkeys window');
      }
      ss.value = '';
      ss.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(250);
      if ($('#lm-ss-hk').is(':visible')) fail.push('settings search hint stays after clearing');
    }

    // in the open window every row fits (phone 915x412 too) and Close is on screen
    if (!hkVisible()) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
    var hr = document.getElementById('hotkeys').getBoundingClientRect();
    $('#lm-hk-controls .lm-hk-ctl').each(function () {
      var r = this.getBoundingClientRect();
      if (r.height > 90) fail.push('row too tall: ' + Math.round(r.height) + ' (' + $(this).attr('data-lm-opt') + ')');
      $(this).find('select, .switchery, .btn').each(function () {
        var c = this.getBoundingClientRect();
        if (c.width && (c.right > hr.right + 1 || c.left < hr.left - 1)) fail.push('control outside the window: ' + (this.id || this.className));
      });
    });
    var cl = document.getElementById('close-hotkeys').getBoundingClientRect();
    if (cl.right > innerWidth + 1 || cl.bottom > innerHeight + 1 || cl.width < 1) fail.push('Close off screen');
    info.window = Math.round(hr.width) + 'x' + Math.round(hr.height) + ' in ' + innerWidth + 'x' + innerHeight;
    await closeHk();
  } catch (e) {
    fail.push('error: ' + (e && e.message));
  } finally {
    if (overlaysHidden) $('#overlays').show();
    try {
      if (sel4) {
        if (added && added.parentNode) added.parentNode.removeChild(added);
        $(sel4).val(String(before.mouse4Click)).trigger('change');
        defaultmapsettings.mouse4Click = before.mouse4Click;
      }
      var c4 = document.getElementById('mouseCommand4');
      if (c4 && c4.checked !== !!before.mouseCommand4) {
        var s4 = c4.nextElementSibling && c4.nextElementSibling.classList.contains('switchery') ? c4.nextElementSibling : null;
        if (s4) s4.click(); else { c4.checked = !!before.mouseCommand4; c4.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      if (defaultmapsettings.mouseCommand4 !== before.mouseCommand4) application.setSettings('mouseCommand4', before.mouseCommand4);
      application.saveSettings(defaultmapsettings, 'ogarioSettings');
    } catch (e) { }
    delete hotkeysCommand[probeCmd];
    await closeHk();
  }
  return { fail: fail, info: info };
})()
