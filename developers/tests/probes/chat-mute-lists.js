// Chat mute with the Notification centre on and its Other category muted: a real click on a chat
// line's mute icon shows the "muted" toast with its Unmute button, the chat box's Muted users button
// (real Enter, real click) shows the list, and its Unmute button unmutes. Until 3.702 these toasts
// were held back like any toast of a muted category: the list never showed, so nobody could be
// unmuted. The settings, the mute list and the test toasts are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !(window.application && window.LMNotifications && document.getElementById('message')); w0++) await sleep(250);
  var app = window.application, ms = window.defaultmapsettings, N = window.LMNotifications;
  if (!app || !ms || !N || typeof app.displayChatMessage !== 'function') return { fail: ['chat or notification centre missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'cm' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var click = function (el) { var r = el.getBoundingClientRect(); return send({ type: 'click', x: r.left + r.width / 2, y: r.top + r.height / 2 }); };
  var key = function (k, kc) { return send({ type: 'key', key: k, code: k, keyCode: kc }); };
  var ID = 4271, NICK = 'MuteProbe';
  var keep = { box: ms.showChatBox, hide: ms.hideChat, snd: ms.chatSounds, nc: ms.notificationCentre, other: N.isMuted('other'), menu: !!$('#overlays:visible').length };
  var made = [];
  var toasts = function () { return $('#toast-container > .toast').toArray(); };
  try {
    ms.notificationCentre = true; ms.showChatBox = true; ms.hideChat = false; ms.chatSounds = false;
    app.setShowChatBox();
    N.setMuted('other', true);
    app.hideMenu();
    await sleep(600);
    var before = toasts();
    app.displayChatMessage('12:00', 101, ID, NICK + ': spam spam');
    var icon = $('#chat-box .message').last().find('.mute-user')[0];
    if (!icon) { fail.push('no mute icon on the chat line'); return { fail: fail, info: info }; }
    await click(icon);
    await sleep(300);
    info.muted = app.isChatUserMuted(ID);
    if (!info.muted) fail.push('the mute icon did not mute');
    var mt = toasts().filter(function (t) { return before.indexOf(t) < 0; });
    made = made.concat(mt);
    info.muteToast = mt.map(function (t) { return t.textContent.slice(0, 60); });
    if (!mt.some(function (t) { return t.querySelector('.btn-unmute-user'); })) fail.push('no "muted" toast with its Unmute button (Other muted in the Notification centre)');
    mt.forEach(function (t) { $(t).remove(); });
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    await key('Enter', 13);
    await sleep(200);
    var btn = $('#message-box .chat-muted-users')[0];
    if (!btn || !$('#message-box').is(':visible')) { fail.push('Enter did not open the chat box with its Muted users button'); return { fail: fail, info: info }; }
    before = toasts();
    await click(btn);
    await sleep(300);
    var lt = toasts().filter(function (t) { return before.indexOf(t) < 0; });
    made = made.concat(lt);
    info.list = lt.map(function (t) { return t.textContent.slice(0, 60); });
    var un = null;
    lt.forEach(function (t) { var b = t.querySelector('.btn-unmute-user[data-user-id="' + ID + '"]'); if (b) un = b; });
    if (!un) fail.push('the Muted users button showed no list with ' + NICK);
    else {
      await click(un);
      await sleep(200);
      if (app.isChatUserMuted(ID)) fail.push('Unmute in the list did not unmute');
    }
    var last = N.items().slice(-3).map(function (x) { return x.category + ': ' + x.text.slice(0, 40); });
    info.recorded = last;
    if (!last.some(function (x) { return x.indexOf(NICK) >= 0; })) fail.push('the toasts are not kept in the Notification centre list');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    try { app.unmuteChatUser(ID); } catch (e) { }
    $('#toast-container > .toast').filter(function () { return made.indexOf(this) >= 0 || $(this).text().indexOf(NICK) >= 0; }).remove();
    $('#chat-box .message').filter(function () { return $(this).text().indexOf(NICK) >= 0; }).remove();
    try { $('#message').val('').blur(); $('#message-box').hide(); } catch (e) { }
    N.setMuted('other', keep.other);
    ms.notificationCentre = keep.nc; ms.showChatBox = keep.box; ms.hideChat = keep.hide; ms.chatSounds = keep.snd;
    app.setShowChatBox();
    if (keep.menu && app.showMenu) app.showMenu();
  }
  return { fail: fail, info: info };
})()
