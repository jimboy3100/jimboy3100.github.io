// A game connection that drops while the player is in the game: the life is over (the server
// forgets the player, auto-reconnect opens a new session), so the menu comes back with Play, as
// after a death, and Play then spawns again; Play is disabled (with the reason) until the connection
// is back. Until 3.697 the menu stayed hidden over the reconnected world, the player no longer in
// the game, until Esc. The life is faked (legendmod.play, menu hidden, nothing spawned) and the
// socket is closed from here; auto-reconnect restores it.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var LM = window.legendmod, A = window.application;
  if (!LM || !A || typeof A.hideMenu !== 'function') return { skip: 'no connection object' };
  var open = function () { return !!(LM.socket && LM.socket.readyState === 1); };
  for (var w = 0; w < 40 && !open(); w++) await sleep(250);
  if (!open()) return { skip: 'no open game connection' };
  var menu = function () { return $('#overlays').is(':visible'); };
  var ws0 = LM.ws, menu0 = menu();
  var playBtns = function () { return $('.btn-play, .btn-play-guest').not('#toast-container *').get(); };
  try {
    A.hideMenu();
    LM.play = true;
    await sleep(200);
    if (menu()) { fail.push('the menu did not hide for the faked life'); }
    var s0 = LM.socket;
    s0.close();
    /* a loaded machine can keep the socket closing for seconds: judge once it is closed */
    for (w = 0; w < 40 && s0.readyState !== 3; w++) await sleep(250);
    await sleep(800);
    info.afterDrop = { play: LM.play, menu: menu(), rs: LM.socket && LM.socket.readyState };
    /* while not reconnected, Play waits (disabled, with the reason as title; never hidden) */
    info.afterDrop.playOff = playBtns().map(function (b) { return b.disabled ? b.title : ''; });
    if (info.afterDrop.rs !== 1 && !info.afterDrop.playOff.every(function (t) { return !!t; })) fail.push('Play stayed enabled while not connected');
    if (LM.play) fail.push('still in the game after the connection dropped');
    if (!menu()) fail.push('the menu did not come back after the connection dropped while in the game');
    /* 15 s, and on (up to 45 s) while a retry is still pending or connecting: when the live server
     * refused the first retries, the next ones come 4 and 8 s later */
    var retrying = function () { return !!LM._reconnTimer || !!(LM.socket && LM.socket.readyState === 0); };
    for (w = 0; w < 180 && !(open() && LM.ws === ws0) && (w < 60 || retrying()); w++) await sleep(250);
    info.reconnectMs = w * 250;
    info.reconnected = open() && LM.ws === ws0;
    if (!info.reconnected) fail.push('no auto-reconnect to ' + ws0);
    else {
      await sleep(300);
      info.playOffAfter = playBtns().filter(function (b) { return b.disabled; }).length;
      if (info.playOffAfter) fail.push('Play still disabled after the reconnect');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    LM.play = false;
    if (menu0 && !menu()) A.showMenu();
  }
  return { fail: fail, info: info };
})()
