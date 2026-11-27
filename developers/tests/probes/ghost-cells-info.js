// Ghost cells: with the Ghost cells switch on, the ghost of a leaderboard player out of view shows
// the player's name (there is no separate "Ghost cells info" switch any more); with it off nothing is
// drawn; the ghost cells hotkey turns them on and off. drawRender.drawGhostCells is run on a recording
// 2D context with one ghost in the middle of the view; everything is put back afterwards.
(async () => {
  var fail = [], info = {};
  var R = window.drawRender, LM = window.legendmod, S = window.legendmod5 || window.defaultmapsettings, A = window.application;
  if (!R || !LM || !S || typeof R.drawGhostCells !== 'function') return { fail: ['drawRender.drawGhostCells not found'] };
  var keys = ['ctx', 'camX', 'camY', 'scale', 'canvasWidth', 'canvasHeight'];
  var saved = {}, lmSaved = { ghostCells: LM.ghostCells, cells: LM.cells, viewX: LM.viewX, viewY: LM.viewY };
  keys.forEach(function (k) { saved[k] = R[k]; });
  var savedOn = S.showGhostCells;
  var texts = [], fills = 0;
  var real = document.createElement('canvas').getContext('2d');
  var rec = new Proxy(real, {
    get: function (t, k) {
      /* the letters filled (the stroke under each one is not counted) */
      if (k === 'fillText') return function (s) { texts.push(String(s)); return t.fillText.apply(t, arguments); };
      if (k === 'fill') return function () { fills++; return t.fill.apply(t, arguments); };
      var v = t[k];
      return typeof v === 'function' ? v.bind(t) : v;
    },
    set: function (t, k, v) { t[k] = v; return true; }
  });
  function draw() {
    texts.length = 0; fills = 0;
    R.ctx = rec; R.camX = 0; R.camY = 0; R.scale = 1; R.canvasWidth = 1200; R.canvasHeight = 800;
    LM.ghostCells = [{ x: 0, y: 0, size: 300, nick: 'ProbeGhost' }];
    LM.cells = []; LM.viewX = 0; LM.viewY = 0;
    try { R.drawGhostCells(); } catch (e) { fail.push('drawGhostCells threw: ' + e.message); }
    keys.forEach(function (k) { R[k] = saved[k]; });
    for (var k in lmSaved) LM[k] = lmSaved[k];
    return texts.join('');
  }
  try {
    S.showGhostCells = true;
    var on = draw();
    info.on = { text: on, fills: fills };
    if (!fills) fail.push('ghost cells on: the ghost was not drawn');
    if (on.indexOf('ProbeGhost') < 0) fail.push('ghost cells on: the name of the ghost is not shown (' + JSON.stringify(on) + ')');
    S.showGhostCells = false;
    var off = draw();
    info.off = { text: off, fills: fills };
    if (fills || off) fail.push('ghost cells off: something was drawn');
    if ('showGhostCellsInfo' in S) fail.push('the old showGhostCellsInfo setting is still there');
    if (A && typeof A.setShowGhostCellsInfo === 'function') {
      A.setShowGhostCellsInfo();
      if (S.showGhostCells !== true) fail.push('the ghost cells hotkey did not turn them on');
      A.setShowGhostCellsInfo();
      if (S.showGhostCells !== false) fail.push('the ghost cells hotkey did not turn them off');
    } else fail.push('application.setShowGhostCellsInfo not found');
  } finally {
    if (A && typeof A.setSettings === 'function' && S.showGhostCells !== savedOn) A.setSettings('showGhostCells', savedOn);
    S.showGhostCells = savedOn;
  }
  return { fail: fail, info: info };
})()
