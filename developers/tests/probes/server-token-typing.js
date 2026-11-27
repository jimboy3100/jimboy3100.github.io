// Join box, real input: a reconnect while an address is being typed leaves the typing alone.
// Before, every connect (auto-reconnect after a drop, server list, party link...) wrote the current
// server into the box: the caret went to its end and the rest of the typed address went after it,
// so Enter joined 'wss://ffa.legendmod.ml:8080gendmod.ml/el-teams' (WebSocket threw a SyntaxError).
// Also: with the box not being typed in, a reconnect still shows the server there; after the join the
// box shows the joined server's token. Ends on Expanding Land FFA again.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var LM = window.legendmod;
  var FFA = 'wss://ffa.legendmod.ml:8080', TEAMS = 'wss://api.legendmod.ml/el-teams';
  var on = function (ws) { return !!(LM && LM.ws === ws && LM.socket && LM.socket.readyState === 1); };
  for (var w = 0; w < 40 && !on(FFA); w++) await sleep(250);
  if (!on(FFA)) return { skip: 'not on Expanding Land FFA' };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'stt' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 30); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var type = async function (s) { for (var i = 0; i < s.length; i++) await send({ type: 'key', key: s[i], code: '', keyCode: 0, text: s[i] }); };
  /* a real drop: the client's auto-reconnect connects FFA again (a new socket) */
  var drop = async function () {
    var old = LM.socket;
    try { old.close(); } catch (e) { }
    for (var k = 0; k < 80 && !(LM.socket !== old && on(FFA)); k++) await sleep(250);
    return LM.socket !== old && on(FFA);
  };
  var keys = ['lmServerHistory', 'lmRecentServers', 'lmLastPrivateServer'], saved = {};
  keys.forEach(function (k) { try { saved[k] = localStorage.getItem(k); } catch (e) { } });
  var info0 = $('#server-info').is(':visible');
  var tk = document.getElementById('server-token');
  try {
    if (!info0) $('#server-info').show();
    /* not typing: a reconnect shows the server in the box */
    tk.blur();
    tk.value = 'old text';
    if (!(await drop())) return { skip: 'the auto-reconnect did not connect FFA again' };
    info.idle = tk.value;
    if (tk.value !== 'ffa.legendmod.ml:8080') fail.push('after a reconnect the box (not typed in) shows "' + tk.value + '"');
    tk.focus(); tk.select();
    await type('api.le');
    if (!(await drop())) return { skip: 'the auto-reconnect did not connect FFA again (typing)', info: info };
    info.typing = tk.value;
    if (tk.value !== 'api.le') fail.push('a reconnect while typing changed the box to "' + tk.value + '"');
    await type('gendmod.ml/el-teams');
    await send({ type: 'key', key: 'Enter', code: 'Enter', keyCode: 13 });
    for (w = 0; w < 60 && !on(TEAMS); w++) await sleep(250);
    info.joined = { ws: LM.ws, box: tk.value };
    if (!on(TEAMS)) fail.push('Enter did not connect ' + TEAMS + ' (' + LM.ws + ')');
    else if (tk.value !== 'api.legendmod.ml/el-teams') fail.push('after the join the box shows "' + tk.value + '"');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    tk.blur();
    if (!info0) $('#server-info').hide();
    keys.forEach(function (k) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } });
    if (LM && LM.ws !== FFA && window.core) { $('#gamemode').val('5001'); window.core.connect(FFA); }
    for (w = 0; w < 40 && !on(FFA); w++) await sleep(250);
  }
  return { fail: fail, info: info };
})()
