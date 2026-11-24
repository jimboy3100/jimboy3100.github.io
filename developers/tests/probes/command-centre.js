// Command Centre: Ctrl+K opens it, a search finds a switch, Enter toggles it and back, Esc closes;
// Ctrl+K in the chat box does nothing; the quick bar keeps clear of the HUD. Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var CC = window.LMCommandCentre;
  for (var w = 0; w < 40 && !(CC && CC.open); w++) { await sleep(250); CC = window.LMCommandCentre; }
  if (!CC || !CC.open) return { fail: ['LMCommandCentre not loaded'] };
  var key = function (el, k, code, mods) {
    var o = { key: k, keyCode: code, which: code, bubbles: true, cancelable: true };
    for (var m in (mods || {})) o[m] = mods[m];
    el.dispatchEvent(new KeyboardEvent('keydown', o));
  };
  var storeBefore = null;
  try { storeBefore = localStorage.getItem('lmCommandCentre'); } catch (e) { }
  var gridBefore = defaultmapsettings.showGrid;
  var barBefore = defaultmapsettings.commandCentreBar;
  try {
    var all = CC.items(), kinds = {};
    all.forEach(function (it) { kinds[it.kind] = (kinds[it.kind] || 0) + 1; });
    info.kinds = kinds;
    if (!(kinds.hk >= 50)) fail.push('hotkey items: ' + kinds.hk);
    if (!(kinds.opt >= 50)) fail.push('switch items: ' + kinds.opt);
    if (!kinds.set) fail.push('no slider / theme items');
    if (!kinds.sec) fail.push('no settings sections');
    if (!kinds.tab || !kinds.win) fail.push('no menu tabs / windows');
    if (all.some(function (it) { return it.id === 'hk:hk-commandCentre'; })) fail.push('lists its own hotkey');
    if (all.some(function (it) { return !it.label; })) fail.push('item without a label');
    if (!document.getElementById('lm-cc-open')) fail.push('no button next to the settings search');

    // Ctrl+K on the page (unless the player bound Ctrl+K to a hotkey)
    var bound = window.hotkeys && hotkeys['CTRL+K'];
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    key(document.body, 'k', 75, { ctrlKey: true });
    await sleep(50);
    if (!bound && !CC.isOpen()) fail.push('Ctrl+K did not open it');
    if (!CC.isOpen()) CC.open();
    var q = document.getElementById('lm-cc-q');
    if (!q) throw new Error('no search box');
    q.value = 'show grid';
    q.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(50);
    var rows = Array.prototype.slice.call(document.querySelectorAll('#lm-cc .lm-cc-row'));
    var idx = rows.findIndex(function (r) { return r.getAttribute('data-id') === 'opt:showGrid'; });
    info.rows = rows.length;
    info.showGridAt = idx;
    if (idx < 0 || idx > 3) fail.push('"show grid" switch not in the top results (at ' + idx + ')');
    if (idx >= 0) {
      for (var i = 0; i < idx; i++) key(q, 'ArrowDown', 40);
      if (!rows[idx].classList.contains('sel') && !document.querySelector('#lm-cc .lm-cc-row.sel[data-id="opt:showGrid"]')) fail.push('arrow keys did not select the row');
      key(q, 'Enter', 13);
      await sleep(80);
      if (defaultmapsettings.showGrid === gridBefore) fail.push('Enter did not toggle showGrid');
      if (document.getElementById('showGrid').checked !== defaultmapsettings.showGrid) fail.push('checkbox and setting differ');
      if (!CC.isOpen()) fail.push('palette closed after a switch');
      var pill = document.querySelector('#lm-cc .lm-cc-row[data-id="opt:showGrid"] .lm-cc-pill');
      if (!pill || pill.classList.contains('on') !== !!defaultmapsettings.showGrid) fail.push('ON/OFF not updated');
      var sel = document.querySelector('#lm-cc .lm-cc-row.sel');
      if (!sel || sel.getAttribute('data-id') !== 'opt:showGrid') fail.push('selection lost after the toggle');
      key(q, 'Enter', 13);
      await sleep(80);
      if (defaultmapsettings.showGrid !== gridBefore) fail.push('second Enter did not revert showGrid');
    }
    // the search box keeps game keys away from the hotkeys
    var feedCalls = 0, origFeed = application.feed;
    application.feed = function () { feedCalls++; };
    try { key(q, 'w', 87); } finally { application.feed = origFeed; }
    if (feedCalls) fail.push('typing W in the search box fed');
    key(q, 'Escape', 27);
    await sleep(50);
    if (CC.isOpen()) fail.push('Esc did not close it');
    if (document.getElementById('lm-cc')) fail.push('palette still in the page');

    // Ctrl+K while typing in an input does nothing
    var inp = document.getElementById('lm-settings-search') || document.getElementById('nick');
    if (inp) {
      key(inp, 'k', 75, { ctrlKey: true });
      await sleep(30);
      if (CC.isOpen()) { fail.push('Ctrl+K opened it from a text field'); CC.close(); }
    }

    // a slider opens the menu at its place and blinks; a theme tab and the hotkeys window open
    var activeTab = document.querySelector('.menu-tabs li.active a');
    if (CC.run('set:animation')) {
      await sleep(400);
      var box = document.getElementById('animation-slider');
      box = box && box.closest('.slider-box');
      if (!$('#og-settings').is(':visible')) fail.push('slider: settings tab not shown');
      if (!box || !box.classList.contains('lm-cc-flash')) fail.push('slider: not highlighted');
    } else fail.push('no item set:animation');
    if (CC.run('tab:theme-hud')) {
      await sleep(150);
      if (!$('#theme-hud').is(':visible')) fail.push('theme HUD tab not shown');
    } else fail.push('no item tab:theme-hud');
    if (CC.run('tab:hotkeys')) {
      await sleep(700);
      if (!$('#hotkeys').is(':visible')) fail.push('hotkeys window not shown');
      $('#close-hotkeys').trigger('click');
      await sleep(600);
    } else fail.push('no item tab:hotkeys');
    $('#theme .submenu-tabs a[href="#theme-main"]').trigger('click');
    if (activeTab) activeTab.click();

    // quick bar with one favourite: shown, not over the HUD
    localStorage.setItem('lmCommandCentre', JSON.stringify({ fav: ['opt:showGrid', 'win:matchHistory'], recent: [] }));
    defaultmapsettings.commandCentreBar = true;
    CC.syncBar();
    await sleep(50);
    var bar = document.getElementById('lm-cc-bar');
    if (!bar) fail.push('quick bar not shown');
    else {
      var br = bar.getBoundingClientRect();
      info.bar = Math.round(br.left) + ',' + Math.round(br.top) + ' ' + Math.round(br.width) + 'x' + Math.round(br.height);
      if (bar.querySelectorAll('.lm-cc-bb').length !== 3) fail.push('quick bar buttons: ' + bar.querySelectorAll('.lm-cc-bb').length);
      if (br.left < 0 || br.top < 0 || br.right > innerWidth || br.bottom > innerHeight) fail.push('quick bar off screen');
      ['leaderboard-hud', 'minimap-hud', 'chat-box', 'lm-mc-l', 'lm-mc-r', 'lm-mc-sm'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || getComputedStyle(el).display === 'none') return;
        if (Math.min(r.right, br.right) > Math.max(r.left, br.left) && Math.min(r.bottom, br.bottom) > Math.max(r.top, br.top)) fail.push('quick bar covers #' + id);
      });
      // a switch on the bar toggles through the checkbox
      var gb = bar.querySelector('.lm-cc-bb[data-id="opt:showGrid"]');
      if (gb) {
        gb.click();
        await sleep(50);
        if (defaultmapsettings.showGrid === gridBefore) fail.push('bar button did not toggle');
        if (gb.classList.contains('on') !== !!defaultmapsettings.showGrid) fail.push('bar button state wrong');
        gb.click();
        await sleep(50);
        if (defaultmapsettings.showGrid !== gridBefore) fail.push('bar button did not revert');
      }
    }
    defaultmapsettings.commandCentreBar = false;
    CC.syncBar();
    if (document.getElementById('lm-cc-bar')) fail.push('quick bar stays after the option is off');
  } finally {
    try { CC.close(); } catch (e) { }
    if (defaultmapsettings.showGrid !== gridBefore) application.setSettings('showGrid', gridBefore);
    var cb = document.getElementById('showGrid');
    if (cb) cb.checked = !!defaultmapsettings.showGrid;
    defaultmapsettings.commandCentreBar = barBefore;
    try { if (storeBefore == null) localStorage.removeItem('lmCommandCentre'); else localStorage.setItem('lmCommandCentre', storeBefore); } catch (e) { }
    try { CC.syncBar(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
