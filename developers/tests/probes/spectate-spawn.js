// Spawning ends every spectate mode: free spectate turned on with a real Q press, then a spawn
// (opcode 32 through the real packet handler), leaves no free spectate / World Spectate flag on,
// so after the next death one Q starts free spectate again (the flag stayed on and that Q
// turned it off while the server started it).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod, app = window.application;
  if (!lm || !app || typeof lm.handleMessage !== 'function' || typeof window.__lmInput !== 'function') return { skip: 'no game or input' };
  var ids = 0, waits = {};
  window.__lmInputDone = function (id) { if (waits[id]) { waits[id](); delete waits[id]; } };
  function inp(o) { return new Promise(function (r) { var id = 's' + (++ids); o.id = id; waits[id] = r; window.__lmInput(JSON.stringify(o)); setTimeout(r, 3000); }); }
  var keys = ['play', 'isSpectateEnabled', 'isFreeSpectate', '_isWorldSpectating', '_worldSpecPanX', '_worldSpecPanY', '_spawnTransitGate', '_lmSpecLb', '_lmSpecCell'];
  var saved = {};
  keys.forEach(function (k) { saved[k] = lm[k]; });
  var sv = { sendAction: lm.sendAction, hideMenu: app.hideMenu, onPlayerSpawn: app.onPlayerSpawn, doubleSplit: app.doubleSplit,
    alive: window.userBots && window.userBots.isAlive, ids: (lm.playerCellIDs || []).slice() };
  var sent = [];
  lm.sendAction = function (a) { sent.push(a); };
  app.hideMenu = function () { };
  app.onPlayerSpawn = function () { };
  app.doubleSplit = function () { };
  var ID = 0x7ffffe31;
  function spawn() {
    var dv = new DataView(new ArrayBuffer(5));
    dv.setUint8(0, 32);
    dv.setUint32(1, ID, true);
    lm._spawnTransitGate = false;
    lm.handleMessage(dv);
  }
  function die() {
    lm.play = false;
    var i = lm.playerCellIDs.indexOf(ID);
    if (i >= 0) lm.playerCellIDs.splice(i, 1);
    if (lm._playerCellIDSet) lm._playerCellIDSet.delete(ID);
  }
  async function q() {
    var n = sent.length;
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    await inp({ type: 'key', key: 'q', code: 'KeyQ', keyCode: 81 });
    await sleep(50);
    return sent.slice(n).filter(function (a) { return a === 18; }).length;
  }
  try {
    lm.play = false;
    lm.isSpectateEnabled = true;
    lm.isFreeSpectate = false;
    lm._isWorldSpectating = false;
    var n = await q();
    info.q1 = n + ' ' + lm.isFreeSpectate;
    if (n !== 1 || lm.isFreeSpectate !== true) fail.push('Q while spectating: ' + n + ' free spectate packets, free spectate ' + lm.isFreeSpectate);
    spawn();
    info.spawn = { play: lm.play, spec: lm.isSpectateEnabled, free: lm.isFreeSpectate };
    if (lm.play !== true) fail.push('the spawn packet did not start the game');
    if (lm.isFreeSpectate) fail.push('free spectate still on after the spawn');
    if (lm.isSpectateEnabled) fail.push('spectate still on after the spawn');
    die();
    /* the next death, then Spectate: one Q is free spectate on (the server's toggle) */
    lm.isSpectateEnabled = true;
    n = await q();
    info.qAfterDeath = n + ' ' + lm.isFreeSpectate;
    if (n !== 1 || lm.isFreeSpectate !== true) fail.push('Q after a spawn and death: ' + n + ' free spectate packets, free spectate ' + lm.isFreeSpectate + ' (the server has it on)');
    /* World Spectate (opcode 55 pans the camera with the mouse) also ends with a spawn */
    lm.isFreeSpectate = false;
    lm._isWorldSpectating = true;
    lm._worldSpecPanX = 500; lm._worldSpecPanY = -300;
    spawn();
    info.wsSpawn = { ws: lm._isWorldSpectating, pan: lm._worldSpecPanX + ',' + lm._worldSpecPanY };
    if (lm._isWorldSpectating || lm._worldSpecPanX || lm._worldSpecPanY) fail.push('World Spectate still on after the spawn: ' + JSON.stringify(info.wsSpawn));
    die();
  } catch (e) { fail.push('spawn path: ' + e); }
  lm.sendAction = sv.sendAction; app.hideMenu = sv.hideMenu; app.onPlayerSpawn = sv.onPlayerSpawn; app.doubleSplit = sv.doubleSplit;
  if (window.userBots) window.userBots.isAlive = sv.alive;
  keys.forEach(function (k) { lm[k] = saved[k]; });
  lm.playerCellIDs.length = 0;
  sv.ids.forEach(function (x) { lm.playerCellIDs.push(x); });
  if (lm._playerCellIDSet) lm._playerCellIDSet.delete(ID);
  if (typeof keyBlind === 'object') Object.keys(keyBlind).forEach(function (k) { keyBlind[k] = false; });
  return { fail: fail, info: info };
})()
