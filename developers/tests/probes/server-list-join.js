// Private server list, real input: a server joined with the Join box (address typed, Enter) is
// shown in the list (Expanding Land Teams), and the server history stores it with that entry.
// Until 3.697 the list kept the last picked entry (Expanding Land FFA while on Teams), and the
// server history, the match history and the address bar link took that wrong mode. Back with
// Arrow Up on the list (connects FFA again); the stored server lists are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var LM = window.legendmod;
  var FFA = 'wss://ffa.legendmod.ml:8080', TEAMS = 'wss://api.legendmod.ml/el-teams';
  var on = function (ws) { return !!(LM && LM.ws === ws && LM.socket && LM.socket.readyState === 1); };
  for (var w = 0; w < 40 && !on(FFA); w++) await sleep(250);
  if (!on(FFA) || $('#region').val() !== 'Private' || $('#gamemode').val() !== '5001' || !$('#gamemode option[value="5002"]').length) return { skip: 'not on Expanding Land FFA from the list' };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'slj' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 30); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var keys = ['lmServerHistory', 'lmRecentServers', 'lmLastPrivateServer'], saved = {};
  keys.forEach(function (k) { try { saved[k] = localStorage.getItem(k); } catch (e) { } });
  var info0 = $('#server-info').is(':visible');
  try {
    if (!info0) $('#server-info').show();
    var tk = document.getElementById('server-token');
    tk.focus(); tk.select();
    var addr = 'api.legendmod.ml/el-teams';
    for (var i = 0; i < addr.length; i++) await send({ type: 'key', key: addr[i], code: '', keyCode: 0, text: addr[i] });
    await send({ type: 'key', key: 'Enter', code: 'Enter', keyCode: 13 });
    for (w = 0; w < 60 && !on(TEAMS); w++) await sleep(250);
    info.joined = { ws: LM.ws, list: $('#gamemode').val() };
    if (!on(TEAMS)) fail.push('the Join box did not connect ' + TEAMS + ' (' + LM.ws + ')');
    else {
      if ($('#gamemode').val() !== '5002') fail.push('the list shows ' + $('#gamemode option:selected').text() + ' while on Expanding Land Teams');
      var h = (window._lmSrvHistRead ? window._lmSrvHistRead() : [])[0];
      info.hist = h && { ws: h.ws, gm: h.gm };
      if (!h || h.ws !== TEAMS || h.gm !== '5002') fail.push('server history stored ' + JSON.stringify(info.hist));
    }
    tk.blur();
    var gm = document.getElementById('gamemode');
    gm.focus();
    await send({ type: 'key', key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 });
    gm.blur();
    for (w = 0; w < 60 && !on(FFA); w++) await sleep(250);
    info.back = { ws: LM.ws, list: $('#gamemode').val() };
    if (!on(FFA) || $('#gamemode').val() !== '5001') fail.push('Arrow Up on the list did not return to Expanding Land FFA ' + JSON.stringify(info.back));
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    if (!info0) $('#server-info').hide();
    keys.forEach(function (k) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } });
    /* never leave the page on Teams for the next probes */
    if (LM && LM.ws !== FFA && window.core) { $('#gamemode').val('5001'); window.core.connect(FFA); }
  }
  return { fail: fail, info: info };
})()
