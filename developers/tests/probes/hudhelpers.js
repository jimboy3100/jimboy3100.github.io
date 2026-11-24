// HUD helpers: module loaded, options off by default and in the menu, hotkeys without keys; with all
// options on, one simulated game runs every helper without throwing, the cell panel fits on screen
// without covering the HUD boxes, and everything is hidden again when the options go off.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && !window.LMHudHelpers; w++) await sleep(200);
  var H = window.LMHudHelpers;
  if (!H) return { fail: ['LMHudHelpers not loaded'] };
  var S = window.legendmod5;
  var keys = ['hudMoveDir', 'hudMergeCountdown', 'hudMergeSound', 'hudRelativeMass', 'hudEdgeTeammates', 'hudEdgeThreats', 'hudCellPanel'];
  keys.forEach(function (k) {
    if (LM_SETTINGS_DEFAULTS[k] !== false) fail.push(k + ' default is not false');
    if (!document.getElementById(k)) fail.push(k + ' has no switch in the menu');
  });
  if (LM_SETTINGS_DEFAULTS.massFormat !== 0) fail.push('massFormat default is not 0');
  if (!document.getElementById('massFormat-slider')) fail.push('massFormat has no slider');
  ['hk-precisionZoom', 'hk-zoomSave1', 'hk-zoomSave2', 'hk-zoomSave3', 'hk-zoomRecall1', 'hk-zoomRecall2', 'hk-zoomRecall3', 'hk-cameraLock'].forEach(function (k) {
    if (!hotkeysCommand[k]) fail.push(k + ' missing');
    else if (hotkeysCommand[k].defaultKey !== '') fail.push(k + ' has a default key');
  });
  var saved = {};
  keys.concat(['massFormat']).forEach(function (k) { saved[k] = S[k]; });
  var R = window.drawRender;
  var cv = document.createElement('canvas');
  cv.width = 300; cv.height = 200;
  var ctx = cv.getContext('2d');
  /* the game's own frames (not playing here) must not run in between the simulated ones */
  var realFrame = H.frame, rnd = null;
  H.frame = function (r) { if (r === rnd) return realFrame.apply(H, arguments); };
  try {
    keys.forEach(function (k) { S[k] = true; });
    S.massFormat = 3;
    var mk = function (id, x, y, size, own) {
      return { id: id, x: x, y: y, size: size, targetSize: size, nick: own ? 'me' : 'enemy', isPlayerCell: own, isInView: function () { return true; } };
    };
    var own = [mk(1, 0, 0, 120, true)];
    var big = mk(9, 300, 0, 400, false);
    var fake = { play: true, integrity: true, isLegendWorld: false, playerCells: own, playerCellsMulti: [], cells: [own[0], big], mapOffsetX: 0, mapOffsetY: 0 };
    rnd = { scale: 1, camX: 0, camY: 0, canvasWidth: window.innerWidth, canvasHeight: window.innerHeight, dpr: 1, canvas: R && R.canvas, _renderLayerZ: R && R._renderLayerZ,
      getLegendWorldAttachedRenderPoint: function (x, y, o) { o.x = x; o.y = y; return o; } };
    var t0 = performance.now();
    for (var f = 0; f < 40; f++) {
      own[0].x += 8;
      if (f === 10) { own[0].size = own[0].targetSize = 85; own.push(mk(2, own[0].x + 100, 0, 85, true)); }
      if (f === 25) { big.x = 1e5; fake.cells.length = 1; } /* the threat leaves */
      H.frame(rnd, ctx, fake);
      await sleep(20);
    }
    info.frameMs = Math.round(performance.now() - t0);
    if (!(own[0]._lmHHEnd > 0)) fail.push('merge countdown not armed after a split');
    if (H.massText(700, { isPlayerCell: false }) === '700') fail.push('relative mass not applied');
    var edge = document.getElementById('lm-hh-edge');
    if (!edge || edge.style.display !== 'block') fail.push('edge canvas not shown');
    await sleep(300);
    H.frame(rnd, ctx, fake);
    var panel = document.getElementById('lm-hh-cells');
    if (!panel || panel.style.display !== 'block') fail.push('cell panel not shown');
    else {
      var r = panel.getBoundingClientRect();
      info.panel = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      if (r.left < 0 || r.top < 0 || r.right > window.innerWidth || r.bottom > window.innerHeight) fail.push('cell panel off screen ' + info.panel);
      ['leaderboard-hud', 'minimap-hud', 'lm-mc-l', 'lm-mc-r'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var b = el.getBoundingClientRect();
        if (b.width < 2 || b.height < 2) return;
        if (r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top) fail.push('cell panel covers #' + id);
      });
    }
  } catch (e) {
    fail.push('run: ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | '));
  } finally {
    Object.keys(saved).forEach(function (k) { S[k] = saved[k]; });
    H.frame = realFrame;
  }
  H.frame(R || {}, null, window.legendmod);
  var p2 = document.getElementById('lm-hh-cells'), e2 = document.getElementById('lm-hh-edge');
  if (p2 && p2.style.display !== 'none') fail.push('cell panel still shown after off');
  if (e2 && e2.style.display !== 'none') fail.push('edge canvas still shown after off');
  return { fail: fail, info: info };
})()
