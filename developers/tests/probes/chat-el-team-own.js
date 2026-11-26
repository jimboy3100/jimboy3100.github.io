// Expanding Land team chat (opcode 202, with a clan tag or in Teams mode): the server sends the
// line to the team mates but leaves out the sender (LegendWorld teams_chat_recipient), so until
// 3.691 the sender never saw their own team line. It is now shown right after it is sent, as
// your own line (no sound, mute button or word filter, own:true to LMEvents), and a copy the
// server might echo back later is not shown a second time.
// Runs the real sendChatMessage and the real opcode 99 handler; everything is put back after.
(async () => {
  var fail = [], info = {};
  var app = window.application, ms = window.defaultmapsettings, lm = window.legendmod, E = window.LMEvents, og = window.ogarcopythelb;
  if (!app || !lm || !ms || !og || typeof app.sendChatMessage !== 'function' || typeof lm.handleMessage !== 'function' || !E || typeof toastr === 'undefined') return { skip: 'no chat' };
  var tag = $('#clantag'), saved = {
    lw: lm.isLegendWorld, sock: lm.socket, send: lm.sendMessage, tag: tag.val(), ctag: og.clanTag, nick: og.nick,
    box: ms.showChatBox, hide: ms.hideChat, snd: ms.chatSounds, words: ms.chatHideWords,
    play: app.playSound, sent: app._lmElSentChat, teams: lm._lmElTeamsSocket, mb: window.multiboxPlayerEnabled,
    last: app.lastMessageSentTime, elLast: app._lmLegendChatLast
  };
  var made = [], sounds = 0, events = [], out = [];
  var listen = function (d) { events.push(d); };
  var fake = { readyState: 1, OPEN: 1, send: function () { } };
  var toasts = function () { return $('#toast-container > .toast'); };
  var keep = function (before) {
    var t = toasts();
    for (var i = before; i < t.length; i++) made.push(t[i]);
    return t.length - before;
  };
  var packet = function (name, text) {
    var enc = new TextEncoder(), n = enc.encode(name), m = enc.encode(text);
    var v = new DataView(new ArrayBuffer(5 + n.length + 1 + m.length + 1));
    v.setUint8(0, 99); v.setUint8(1, 0); v.setUint8(2, 10); v.setUint8(3, 20); v.setUint8(4, 30);
    n.forEach(function (b, i) { v.setUint8(5 + i, b); });
    m.forEach(function (b, i) { v.setUint8(6 + n.length + i, b); });
    return v;
  };
  var send = function (text) {
    app.lastMessageSentTime = 0; app._lmLegendChatLast = 0;
    var before = toasts().length;
    var ok = app.sendChatMessage(101, text);
    return { ok: ok, added: keep(before), t: toasts().last() };
  };
  var receive = function (name, text) {
    var before = toasts().length;
    lm.handleMessage(packet(name, text));
    return { added: keep(before), t: toasts().last() };
  };
  try {
    ms.showChatBox = false; ms.hideChat = false; ms.chatSounds = true; ms.chatHideWords = '';
    app.playSound = function () { sounds++; };
    window.multiboxPlayerEnabled = 0;
    tag.val('TT'); og.clanTag = 'TT'; og.nick = 'ProbeNick';
    lm.isLegendWorld = true; lm._lmElTeamsSocket = null; lm.socket = fake; app._lmElSentChat = [];
    lm.sendMessage = function (v) { out.push(v); };
    E.on('chat', listen);

    var r = send('probe team line 1');
    var op = out[0] && new Uint8Array(out[0].buffer, out[0].byteOffset || 0, 1)[0];
    info.sent = { ok: r.ok, op: op, added: r.added, sounds: sounds, ev: events[0] && events[0].own };
    if (!r.ok || op !== 202) fail.push('the team line was not sent as opcode 202 (ok ' + r.ok + ', op ' + op + ')');
    if (r.added !== 1) fail.push('your own team line was shown ' + r.added + ' times right after sending it');
    else {
      if (r.t.text().indexOf('ProbeNick: probe team line 1') === -1) fail.push('your own team line reads "' + r.t.text() + '"');
      if (r.t.find('.mute-user').length) fail.push('your own team line has a mute button');
    }
    if (sounds) fail.push('your own team line played the chat sound');
    if (!events[0] || events[0].own !== true) fail.push('LMEvents reports your own team line as own:' + (events[0] && events[0].own));
    sounds = 0; events = [];

    /* a server that echoes the line back to the sender: not shown a second time */
    var e = receive('ProbeNick', 'ProbeNick: probe team line 1');
    if (e.added) fail.push('the echo of your own team line was shown again');
    /* the same text later (a team mate repeating it) is shown: the sent line is used up */
    e = receive('ProbeNick', 'ProbeNick: probe team line 1');
    if (e.added !== 1) fail.push('a team mate repeating your line was not shown');

    /* the word filter never hides your own lines */
    sounds = 0; events = [];
    ms.chatHideWords = 'probe';
    r = send('probe team line 2');
    if (r.added !== 1) fail.push('the word filter hid your own team line');
    ms.chatHideWords = '';

    /* not sent (too soon after the previous line): nothing shown */
    out = [];
    var before = toasts().length;
    app.lastMessageSentTime = Date.now();
    var ok3 = app.sendChatMessage(101, 'probe team line 3');
    if (keep(before) && !out.length) fail.push('a team line that was not sent is shown anyway (ok ' + ok3 + ')');
  } catch (err) {
    fail.push('threw ' + (err && err.stack || err));
  } finally {
    E.off('chat', listen);
    lm.isLegendWorld = saved.lw; lm.socket = saved.sock; lm.sendMessage = saved.send; lm._lmElTeamsSocket = saved.teams;
    tag.val(saved.tag); og.clanTag = saved.ctag; og.nick = saved.nick;
    ms.showChatBox = saved.box; ms.hideChat = saved.hide; ms.chatSounds = saved.snd; ms.chatHideWords = saved.words;
    app.playSound = saved.play; app._lmElSentChat = saved.sent; window.multiboxPlayerEnabled = saved.mb;
    app.lastMessageSentTime = saved.last; app._lmLegendChatLast = saved.elLast;
    made.forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
  }
  return { fail: fail, info: info };
})()
