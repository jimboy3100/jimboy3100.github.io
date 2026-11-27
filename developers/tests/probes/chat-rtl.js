// Chat line with a right-to-left nick (Arabic) and a message that starts with a number, in the chat box
// and in the chat popups: the nick stays before the message on screen. Until 3.702 the number joined
// the nick's right-to-left run and was drawn left of the nick ("500 :name gg"). Lines go through the
// real displayChatMessage; the settings and the test lines are put back after.
(async () => {
  var fail = [], info = {};
  var app = window.application, ms = window.defaultmapsettings;
  if (!app || typeof app.displayChatMessage !== 'function' || !ms || typeof toastr === 'undefined') return { skip: 'no chat' };
  var saved = { box: ms.showChatBox, hide: ms.hideChat, snd: ms.chatSounds };
  var NICK = 'علي', made = [];
  var order = function (line, where) {
    var nk = line.find('.message-nick')[0], tx = line.find('.message-text')[0];
    if (!nk || !tx) { fail.push(where + ': no nick or text span'); return; }
    var rn = nk.getBoundingClientRect(), rt = tx.getBoundingClientRect();
    info[where] = { nick: [Math.round(rn.left), Math.round(rn.right)], text: [Math.round(rt.left), Math.round(rt.right)] };
    if (!(rn.width > 0 && rt.width > 0)) fail.push(where + ': line not drawn');
    else if (rt.left < rn.right - 1) fail.push(where + ': the message is drawn before the right-to-left nick ' + JSON.stringify(info[where]));
  };
  try {
    ms.hideChat = false; ms.chatSounds = false;
    ms.showChatBox = true; app.setShowChatBox && app.setShowChatBox();
    $('#chat-box').show();
    app.displayChatMessage('12:00', 101, 4343, NICK + ': 500 gg');
    var line = $('#chat-box .message').last();
    made.push(line[0]);
    order(line, 'chat box');
    ms.showChatBox = false; app.setShowChatBox && app.setShowChatBox();
    app.displayChatMessage('12:01', 101, 4343, NICK + ': 500 gg');
    var t = $('#toast-container > .toast').last();
    made.push(t[0]);
    order(t, 'popup');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    made.forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
    ms.showChatBox = saved.box; ms.hideChat = saved.hide; ms.chatSounds = saved.snd;
    app.setShowChatBox && app.setShowChatBox();
  }
  return { fail: fail, info: info };
})()
