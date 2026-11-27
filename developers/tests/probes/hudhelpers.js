// HUD helpers: module loaded, options off by default and in the menu, hotkeys without keys; the
// removed movement arrow, edge arrows and cell panel have no switch and make nothing even when an
// old value sets them; with the options on, one simulated game runs the merge countdown and the
// relative mass without throwing.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && !window.LMHudHelpers; w++) await sleep(200);
  var H = window.LMHudHelpers;
  if (!H) return { fail: ['LMHudHelpers not loaded'] };
  var S = window.legendmod5;
  var keys = ['hudMergeCountdown', 'hudMergeSound', 'hudRelativeMass'], gone = ['hudMoveDir', 'hudEdgeTeammates', 'hudEdgeThreats', 'hudCellPanel'];
  keys.forEach(function (k) {
    if (LM_SETTINGS_DEFAULTS[k] !== false) fail.push(k + ' default is not false');
    if (!document.getElementById(k)) fail.push(k + ' has no switch in the menu');
  });
  gone.forEach(function (k) {
    if (k in LM_SETTINGS_DEFAULTS || document.getElementById(k)) fail.push('removed ' + k + ' is still a setting or in the menu');
  });
  /* Mass format is one choice (exact / 12.3k / auto); "Short mass" is its 12.3k, no second switch */
  if (LM_SETTINGS_DEFAULTS.massFormat !== 2 || LM_SETTINGS_DEFAULTS.shortMass !== true) fail.push('massFormat default is not 12.3k (2, Short mass)');
  var mfSel = document.getElementById('massFormat');
  if (!mfSel || mfSel.tagName !== 'SELECT' || [].map.call(mfSel.options, function (o) { return o.value; }).join() !== '1,2,3') fail.push('massFormat is not one dropdown 1/2/3');
  if (document.getElementById('shortMass') || document.getElementById('massFormat-slider')) fail.push('Short mass switch or Mass format slider still in the menu');
  ['hk-precisionZoom', 'hk-cameraLock'].forEach(function (k) {
    if (hotkeysCommand[k]) fail.push(k + ' is still a hotkey (removed)');
  });
  var saved = {};
  keys.concat(gone, ['massFormat']).forEach(function (k) { saved[k] = S[k]; });
  var R = window.drawRender;
  var cv = document.createElement('canvas');
  cv.width = 300; cv.height = 200;
  var ctx = cv.getContext('2d');
  /* the game's own frames (not playing here) must not run in between the simulated ones */
  var realFrame = H.frame, rnd = null;
  H.frame = function (r) { if (r === rnd) return realFrame.apply(H, arguments); };
  try {
    /* the removed ones set too, as an old script or save might */
    keys.concat(gone).forEach(function (k) { S[k] = true; });
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
      if (f === 25) { big.x = 1e5; fake.cells.length = 1; } /* the big cell leaves */
      H.frame(rnd, ctx, fake);
      await sleep(20);
    }
    info.frameMs = Math.round(performance.now() - t0);
    if (!(own[0]._lmHHEnd > 0)) fail.push('merge countdown not armed after a split');
    if (H.massText(700, { isPlayerCell: false }) === '700') fail.push('relative mass not applied');
    if (document.getElementById('lm-hh-edge') || document.getElementById('lm-hh-cells')) fail.push('edge arrows or cell panel still made');
  } catch (e) {
    fail.push('run: ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | '));
  } finally {
    Object.keys(saved).forEach(function (k) { if (saved[k] === undefined) delete S[k]; else S[k] = saved[k]; });
    H.frame = realFrame;
  }
  return { fail: fail, info: info };
})()
