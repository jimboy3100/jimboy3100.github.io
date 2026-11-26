// Chat mentions in the chat popups (the default chat display, "Show chat box" off): a line with
// your nick is marked like in the chat box. Until 3.682 only the chat box marked it, so with the
// popups a mention looked like any other line. Lines go through the real displayChatMessage;
// the nick, settings and the test popups are put back after.
(async () => {
  var fail = [], info = {};
  var app = window.application, ms = window.defaultmapsettings;
  if (!app || typeof app.displayChatMessage !== 'function' || !ms || typeof toastr === 'undefined') return { skip: 'no chat' };
  var nick = $('#nick'), savedNick = nick.val(), saved = { box: ms.showChatBox, hide: ms.hideChat, snd: ms.chatSounds };
  var made = [];
  var last = function () { var t = $('#toast-container > .toast').last(); made.push(t[0]); return t; };
  try {
    ms.showChatBox = false; ms.hideChat = false; ms.chatSounds = false;
    nick.val('MentionMe');
    app.displayChatMessage('12:00', 101, 4242, 'Probe: hello mentionme, behind you');
    var t = last();
    info.cls = t.attr('class');
    if (!t.hasClass('lm-mention')) fail.push('a popup naming you is not marked (' + info.cls + ')');
    else if (String(getComputedStyle(t[0]).boxShadow).indexOf('rgb(255, 210, 0)') === -1) fail.push('the mention mark is not drawn: ' + getComputedStyle(t[0]).boxShadow);
    app.displayChatMessage('12:01', 101, 4242, 'Probe: nothing for you');
    t = last();
    if (t.hasClass('lm-mention')) fail.push('a popup without your nick is marked');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    nick.val(savedNick);
    ms.showChatBox = saved.box; ms.hideChat = saved.hide; ms.chatSounds = saved.snd;
    made.forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
  }
  return { fail: fail, info: info };
})()
