// Notification centre: toasts are recorded, the bell covers no other visible element (menu
// closed, as in game), the panel fits the screen and closes; the mixer is at its defaults.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var N = window.LMNotifications, app = window.application, s = window.legendmod5;
  if (!N) return { fail: ['LMNotifications missing (ogario/modules/notifications.js not loaded)'] };
  if (!s || s.notificationCentre !== false) fail.push('notificationCentre should be off by default');
  if (document.getElementById('lm-notif-bell')) fail.push('bell shown while the option is off');
  ['chat', 'commands', 'gameplay', 'video', 'notifications'].forEach(function (c) {
    if (N.channelVolume(c) !== 1) fail.push('channel ' + c + ' not 1 by default');
  });
  if (N.videoVolume(0.42) !== 0.42) fail.push('video volume changed by default');
  ['volMaster', 'volChat', 'volCommands', 'volGameplay', 'volNotifications'].forEach(function (k) {
    if (!document.getElementById(k + '-slider')) fail.push('slider ' + k + ' missing');
  });
  /* one video skin volume: the level slider in Skins; the second one (volVideo) in Sounds is gone */
  if (document.getElementById('volVideo-slider') || 'volVideo' in s) fail.push('the removed video volume (volVideo) is back');
  if (!$('#videoSkinSoundLevel-slider').closest('.options-box.skinsGroup').length) fail.push('video skin sound level slider not in Skins');
  if (!document.getElementById('audioDucking')) fail.push('audioDucking switch missing');
  if (!document.getElementById('notificationCentre')) fail.push('notificationCentre switch missing');
  if (!hotkeysCommand['hk-notifCentre'] || hotkeysCommand['hk-notifCentre'].defaultKey !== '') fail.push('hk-notifCentre missing or has a default key');

  var before = N.items().length;
  try {
    app.setSettings('notificationCentre', true);
    toastr.info('<b>[SETTINGS]:</b> probe <i>toast</i>');
    var items = N.items();
    if (items.length !== before + 1) fail.push('toast not recorded');
    else if (items[items.length - 1].text !== '[SETTINGS]: probe toast' || items[items.length - 1].category !== 'settings') fail.push('recorded as ' + JSON.stringify(items[items.length - 1]));
    var r = toastr.warning('chain').css('width', '250px');
    if (!r) fail.push('toastr return value not chainable');

    app.hideMenu();
    await sleep(900);
    N.refresh();
    var bell = document.getElementById('lm-notif-bell');
    if (!bell) fail.push('bell not shown with the option on');
    else {
      var b = bell.getBoundingClientRect();
      info.bell = [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)];
      info.viewport = [innerWidth, innerHeight];
      if (b.left < 0 || b.top < 0 || b.right > innerWidth || b.bottom > innerHeight) fail.push('bell off screen');
      var area = innerWidth * innerHeight, hits = [];
      var all = document.querySelectorAll('body *');
      for (var i = 0; i < all.length; i++) {
        var e = all[i];
        if (e === bell || bell.contains(e) || e.closest('#toast-container, #lm-notif-panel')) continue;
        var q = e.getBoundingClientRect();
        if (q.width < 1 || q.height < 1 || q.right <= b.left || q.left >= b.right || q.bottom <= b.top || q.top >= b.bottom) continue;
        if (q.width * q.height > area * 0.3) continue;
        var cs = getComputedStyle(e);
        if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
        /* invisible: no children, text, background, border or ::before / ::after (font preload line) */
        if (!e.children.length && !/^(IMG|CANVAS|VIDEO|INPUT|BUTTON|SELECT|TEXTAREA|IFRAME|svg)$/.test(e.tagName) && !e.textContent.trim() &&
            /^(transparent|rgba\(.*,\s*0\))$/.test(cs.backgroundColor) && cs.backgroundImage === 'none' && !parseFloat(cs.borderTopWidth) &&
            !parseFloat(cs.borderBottomWidth) && !parseFloat(cs.borderLeftWidth) && !parseFloat(cs.borderRightWidth) &&
            /^(none|normal)$/.test(getComputedStyle(e, '::before').content) && /^(none|normal)$/.test(getComputedStyle(e, '::after').content)) continue;
        var hidden = false;
        for (var p = e; p && p !== document.body; p = p.parentElement) {
          var pcs = getComputedStyle(p);
          if (pcs.display === 'none' || Number(pcs.opacity) === 0) { hidden = true; break; }
        }
        if (!hidden) hits.push((e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')));
      }
      info.overlaps = hits.slice(0, 10);
      if (hits.length) fail.push('bell overlaps ' + hits.slice(0, 5).join(', '));
      /* a tap at the bell's centre reaches it (nothing transparent on top eats it) */
      var top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      if (!top || !(top === bell || bell.contains(top))) fail.push('bell covered by ' + (top ? (top.id ? '#' + top.id : top.tagName) : 'nothing'));
      var badge = bell.querySelector('.lmn-count');
      if (!badge || badge.style.display === 'none' || !(Number(badge.textContent) >= 1)) fail.push('unread count not shown');

      bell.click();
      await sleep(200);
      var panel = document.getElementById('lm-notif-panel');
      if (!panel || panel.style.display === 'none') fail.push('panel did not open');
      else {
        var pr = panel.getBoundingClientRect();
        info.panel = [Math.round(pr.left), Math.round(pr.top), Math.round(pr.width), Math.round(pr.height)];
        if (pr.left < 0 || pr.top < 0 || pr.right > innerWidth + 1 || pr.bottom > innerHeight + 1) fail.push('panel does not fit the screen');
        var rows = panel.querySelectorAll('.lmn-list li:not(.lmn-empty)').length;
        if (rows < 2) fail.push('panel lists ' + rows + ' rows');
        if (panel.querySelector('.lmn-list li i')) fail.push('toast HTML rendered as HTML in the panel');
        var sel = panel.querySelector('.lmn-cat');
        sel.value = 'settings'; sel.dispatchEvent(new Event('change'));
        if (panel.querySelectorAll('.lmn-list li:not(.lmn-empty)').length < 1) fail.push('category filter shows nothing');
        sel.value = 'all'; sel.dispatchEvent(new Event('change'));
        var close = panel.querySelector('.lmn-close');
        var cr = close.getBoundingClientRect();
        if (cr.width < 28 || cr.height < 28) fail.push('close button too small for touch');
        close.click();
        if (panel.style.display !== 'none') fail.push('panel did not close');
      }
      N.markAllRead();
      if (N.unread() !== 0 || badge.style.display !== 'none') fail.push('mark all read did not clear the count');
    }
  } finally {
    app.setSettings('notificationCentre', false);
    N.refresh();
    app.showMenu();
  }
  if (document.getElementById('lm-notif-bell')) fail.push('bell still shown after turning the option off');
  return { fail: fail, info: info };
})()
