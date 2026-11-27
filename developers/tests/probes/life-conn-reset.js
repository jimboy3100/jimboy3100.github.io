// A life ends with its connection: after a server change (connect) or a lost connection the next
// life's score (the best mass of the life: Score in Game stats, the session line, personal bests and
// match history take it at the death) and its time alive start at 0. They carried the old life's:
// the score is the highest mass of the life and only a death set it back to 0, so a life on the new
// server showed (and recorded at its death) the old server's best mass until it grew past it. The
// life is faked (legendmod.play, score, life start); the real connect() and socket close are used.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w0 = 0; w0 < 40 && !(window.legendmod && window.application && window.legendmod.connect); w0++) await sleep(250);
  var LM = window.legendmod, A = window.application;
  if (!LM || !A || typeof LM.connect !== 'function') return { skip: 'no connection object' };
  var open = function () { return !!(LM.socket && LM.socket.readyState === 1); };
  /* the server-change part needs no live server (connect() ends the old connection first); the
   * lost-connection part needs an open game connection */
  for (var w = 0; w < 80 && !open(); w++) await sleep(250);
  info.open = open();
  var menu = function () { return $('#overlays').is(':visible'); };
  var ws0 = LM.ws || 'wss://ffa.legendmod.ml:8080', menu0 = menu();
  var fake = function () { LM.play = true; LM.playerScore = 23456; A._lmLifeStartAt = Date.now() - 90000; };
  try {
    /* a server change: connect() to a server (here the same one again, as the server list does) */
    fake();
    LM.connect(ws0);
    info.afterConnect = { score: LM.playerScore, life: A._lmLifeStartAt };
    if (LM.playerScore !== 0) fail.push('server change: the old life\'s score stayed (' + LM.playerScore + ')');
    if (A._lmLifeStartAt !== 0) fail.push('server change: the old life\'s start stayed');
    /* a new life on the new server: its score is its own mass, not the old best */
    LM.playerMass = 1200; LM.recalculatePlayerMass && LM.recalculatePlayerMass();
    info.newLifeScore = LM.playerScore;
    if (LM.playerScore > 1200) fail.push('new life after a server change: score ' + LM.playerScore + ' (the old life\'s 23456)');
    for (w = 0; w < 60 && !(open() && LM.ws === ws0); w++) await sleep(250);
    if (!(open() && LM.ws === ws0)) { info.skipDrop = 'no open game connection'; return { fail: fail, info: info }; }
    /* a lost connection */
    fake();
    var sock = LM.socket;
    sock.close();
    /* a loaded machine can keep the socket CLOSING for seconds: wait for the close itself */
    for (w = 0; w < 400 && LM.play && sock.readyState !== 3; w++) await sleep(25);
    for (w = 0; w < 40 && LM.play; w++) await sleep(25);
    info.afterDrop = { play: LM.play, score: LM.playerScore, rs: sock.readyState };
    if (LM.play && sock.readyState !== 3) { info.skipDrop = 'the socket did not close in 10 s'; return { fail: fail, info: info }; }
    if (LM.playerScore !== 0) fail.push('lost connection: the old life\'s score stayed (' + LM.playerScore + ')');
    for (w = 0; w < 60 && !(open() && LM.ws === ws0); w++) await sleep(250);
    info.reconnected = open() && LM.ws === ws0;
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    LM.play = false; LM.playerScore = 0; LM.playerMass = 0; A._lmLifeStartAt = 0;
    if (menu0 && !menu()) A.showMenu();
  }
  return { fail: fail, info: info };
})()
