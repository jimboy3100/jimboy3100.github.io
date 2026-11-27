// Spectator director: off until used, hotkeys without keys, opened from its hotkey; the panel
// opens, fits the screen, every tab renders, a bookmark is added, the auto camera and the broadcast HUD
// toggle on and off without errors, and the close button closes it.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && !window.LMDirector; w++) await sleep(200);
  var D = window.LMDirector;
  if (!D || typeof D.open !== 'function') return { fail: ['LMDirector not loaded (ogario/modules/director.js)'] };
  if (D.enabled !== false) fail.push('director enabled before it was used');
  if (document.getElementById('lm-dir-panel') || document.getElementById('lm-dir-bc')) fail.push('director UI built before it was used');
  ['hk-director', 'hk-dirAuto', 'hk-dirBroadcast', 'hk-dirWatchNext', 'hk-dirWatchPrev', 'hk-dirWatchAdd', 'hk-dirMarkSave',
    'hk-dirMark1', 'hk-dirMark2', 'hk-dirMark3', 'hk-dirMark4', 'hk-dirMark5'].forEach(function (k) {
    if (!hotkeysCommand[k]) fail.push(k + ' missing');
    else if (hotkeysCommand[k].defaultKey !== '') fail.push(k + ' has a default key');
  });
  var savedMarks = null;
  try { savedMarks = localStorage.getItem('lm-director-bookmarks'); } catch (e) { }
  try {
    D.open();
    await sleep(200);
    var panel = document.getElementById('lm-dir-panel');
    if (!panel || panel.style.display === 'none') fail.push('panel did not open');
    else {
      var pr = panel.getBoundingClientRect();
      info.panel = [Math.round(pr.left), Math.round(pr.top), Math.round(pr.width), Math.round(pr.height)];
      info.viewport = [innerWidth, innerHeight];
      if (pr.left < 0 || pr.top < 0 || pr.right > innerWidth + 1 || pr.bottom > innerHeight + 1) fail.push('panel does not fit the screen');
      ['#lm-notif-bell'].forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el || !el.getBoundingClientRect().width) return;
        var r = el.getBoundingClientRect();
        if (r.left < pr.right && r.right > pr.left && r.top < pr.bottom && r.bottom > pr.top) fail.push('panel covers ' + sel);
      });
      if (!D.enabled) fail.push('opening the panel did not enable the director');
      var tabs = panel.querySelectorAll('.lmd-tabs button');
      if (tabs.length !== 5) fail.push(tabs.length + ' tabs');
      for (var i = 0; i < tabs.length; i++) { tabs[i].click(); await sleep(60); }

      /* bookmarks tab: save the current view (falls back to a fixed point when there is no camera yet) */
      panel.querySelector('.lmd-tabs button[data-tab="marks"]').click();
      await sleep(60);
      var before = D.bookmarks().length;
      var name = panel.querySelector('[data-sec="marks"] input[type="text"]');
      if (name) name.value = 'probe';
      document.getElementById('lm-dir-mark-save').click();
      await sleep(100);
      if (D.bookmarks().length === before) {
        info.markFallback = true;
        if (D.addBookmark({ name: 'probe', x: 100, y: -200, zoom: 1 }) < 0) fail.push('bookmark not added');
      }
      if (D.addBookmark({ name: 'bad', x: 'x', y: 0 }) !== -1) fail.push('invalid bookmark accepted');
      await sleep(600);
      var rows = panel.querySelectorAll('[data-sec="marks"] li:not(.lmd-note)').length;
      if (rows !== D.bookmarks().length) fail.push('bookmark list shows ' + rows + ' of ' + D.bookmarks().length);

      /* auto camera on / off (not spectating here: it only reports why it waits) */
      panel.querySelector('.lmd-tabs button[data-tab="camera"]').click();
      await sleep(60);
      var auto = document.getElementById('lm-dir-auto');
      auto.click();
      await sleep(300);
      if (!D.isAuto()) fail.push('auto camera did not turn on');
      info.status = D.status();
      auto.click();
      await sleep(100);
      if (D.isAuto()) fail.push('auto camera did not turn off');

      /* broadcast HUD on / off: nothing of the player UI is hidden unless ticked */
      D.setBroadcast(true);
      await sleep(400);
      if (/lm-dir-hide-/.test(document.body.className)) fail.push('broadcast HUD hid something nobody ticked');
      D.setBroadcast(false);

      /* touch close */
      var x = panel.querySelector('.lmd-close');
      var xr = x.getBoundingClientRect();
      if (xr.width < 28 || xr.height < 28) fail.push('close button too small for touch');
      x.click();
      await sleep(100);
      if (panel.style.display !== 'none') fail.push('close button did not close the panel');
    }
  } finally {
    try { D.disable(); D.close(); } catch (e) { fail.push('disable threw ' + e); }
    try { if (savedMarks == null) localStorage.removeItem('lm-director-bookmarks'); else localStorage.setItem('lm-director-bookmarks', savedMarks); } catch (e) { }
  }
  if (D.enabled) fail.push('turn off left the director on');
  return { fail: fail, info: info };
})()
