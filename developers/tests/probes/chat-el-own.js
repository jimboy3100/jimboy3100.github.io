// Expanding Land own chat lines: the server echoes public chat back as opcode 99 under the
// server's name with no sender id, so until 3.688 your own line was handled like a stranger's
// (chat sound, mute button, reported own:false to LMEvents). A line this socket just sent (same
// text) is now known as your own; the same text from anyone else is still a stranger's line.
// Runs the real buildChat99View and the real opcode 99 handler; everything is put back after.
(async () => {
  var fail = [], info = {};
  var app = window.application, ms = window.defaultmapsettings, lm = window.legendmod, E = window.LMEvents;
  if (!app || !lm || !ms || typeof app.buildChat99View !== 'function' || typeof lm.handleMessage !== 'function' || !E || typeof toastr === 'undefined') return { skip: 'no chat' };
  var tag = $('#clantag'), saved = {
    lw: lm.isLegendWorld, sock: lm.socket, tag: tag.val(), box: ms.showChatBox, hide: ms.hideChat, snd: ms.chatSounds,
    play: app.playSound, sent: app._lmElSentChat, teams: lm._lmElTeamsSocket
  };
  var made = [], sounds = 0, events = [];
  var listen = function (d) { events.push(d); };
  var fake = { readyState: 1, send: function () { } };
  var packet = function (name, text) {
    var enc = new TextEncoder(), n = enc.encode(name), m = enc.encode(text);
    var v = new DataView(new ArrayBuffer(5 + n.length + 1 + m.length + 1));
    v.setUint8(0, 99); v.setUint8(1, 0); v.setUint8(2, 10); v.setUint8(3, 20); v.setUint8(4, 30);
    n.forEach(function (b, i) { v.setUint8(5 + i, b); });
    m.forEach(function (b, i) { v.setUint8(6 + n.length + i, b); });
    return v;
  };
  var line = function (name, text) {
    var before = $('#toast-container > .toast').length;
    lm.handleMessage(packet(name, text));
    var t = $('#toast-container > .toast').last();
    if ($('#toast-container > .toast').length > before) made.push(t[0]);
    return t;
  };
  try {
    ms.showChatBox = false; ms.hideChat = false; ms.chatSounds = true;
    app.playSound = function () { sounds++; };
    tag.val('');
    lm.isLegendWorld = true; lm._lmElTeamsSocket = null; lm.socket = fake; app._lmElSentChat = [];
    E.on('chat', listen);
    app.buildChat99View('probe own line 1');
    var t = line('ProbeAccountName', 'probe own line 1');
    info.own = { mute: t.find('.mute-user').length, sounds: sounds, ev: events[0] && events[0].own };
    if (t.find('.mute-user').length) fail.push('your own line has a mute button');
    if (sounds) fail.push('your own line played the chat sound');
    if (!events[0] || events[0].own !== true) fail.push('LMEvents reports your own line as own:' + (events[0] && events[0].own));
    sounds = 0; events = [];
    /* the same text again (someone repeating it) is not yours: the sent line is used up */
    t = line('Stranger', 'probe own line 1');
    if (!t.find('.mute-user').length) fail.push('a stranger repeating your text has no mute button');
    if (!sounds) fail.push('a stranger repeating your text played no sound');
    if (!events[0] || events[0].own !== false) fail.push('a stranger repeating your text is reported own:' + (events[0] && events[0].own));
    sounds = 0; events = [];
    /* sent on another socket (an old connection): not ours on this one */
    lm.socket = { readyState: 1, send: function () { } };
    app.buildChat99View('probe own line 2');
    lm.socket = fake;
    t = line('ProbeAccountName', 'probe own line 2');
    if (!t.find('.mute-user').length) fail.push('a line sent on another socket counts as your own');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    E.off('chat', listen);
    lm.isLegendWorld = saved.lw; lm.socket = saved.sock; lm._lmElTeamsSocket = saved.teams; tag.val(saved.tag);
    ms.showChatBox = saved.box; ms.hideChat = saved.hide; ms.chatSounds = saved.snd;
    app.playSound = saved.play; app._lmElSentChat = saved.sent;
    made.forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
  }
  return { fail: fail, info: info };
})()
