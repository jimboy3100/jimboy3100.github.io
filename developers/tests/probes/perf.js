// Adaptive performance options are in the menu; the diagnostics window opens, fits a phone and
// closes; level 3 lowers the canvas resolution without a reload and puts it back; while off
// nothing hooks the render loop.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 30 && !window.LMPerf; i++) await sleep(200);
  var P = window.LMPerf;
  if (!P) return { fail: ['LMPerf missing (ogario/modules/perf.js not loaded)'] };
  var S = window.legendmod5;
  ['adaptivePerf', 'adaptivePerfToasts'].forEach(function (k) {
    if (!document.getElementById(k)) fail.push('option ' + k + ' missing');
  });
  if (!document.getElementById('adaptivePerfTarget-slider')) fail.push('target slider missing');
  if (!document.getElementById('lm-perf-diag-btn')) fail.push('diagnostics button missing');
  if (S.adaptivePerf !== false) fail.push('options not off by default');
  /* Network quality history is removed: no switch, no saved setting */
  if (document.getElementById('netHistory') || 'netHistory' in S) fail.push('removed Network quality history still there');
  if (window._lmPerfFrame) fail.push('frame hook set while everything is off');
  /* diagnostics window */
  P.openDiag();
  await sleep(1200);
  var md = document.getElementById('lm-perf-diag');
  if (!md) fail.push('diagnostics window did not open');
  else {
    var r = md.getBoundingClientRect();
    info.window = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + window.innerWidth + 'x' + window.innerHeight;
    if (r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1) fail.push('diagnostics window larger than the screen: ' + info.window);
    if (!window._lmPerfFrame) fail.push('window open but no frame measuring');
    info.report = P.report().split('\n').slice(0, 3).join(' | ');
    if (!/Freezes \(/.test(P.report()) || !/Events \(/.test(P.report())) fail.push('report has no freezes / events lines');
    if (!window._lmPerfFrame || typeof window._lmPerfFrame.raf !== 'function') fail.push('no frame callback hook');
    if (!document.getElementById('lm-perf-keep')) fail.push('keep recording button missing');
    /* freeze breakdown: the parts are wrapped while the window is open, also global functions */
    var wrapped = [[window.legendmod, 'handleMessage'], [window.legendmod, 'updateCells'], [window.drawRender, 'renderFrame'],
      [window.drawRender, '_lmUploadSkinJob'], [window.application, '_lmSkinJobRun'], [window.application, 'displayTop5'],
      [window, 'repeatSendingSpecialSkins'], [window, 'lmReplayBarTick'], [window.Storage && Storage.prototype, 'setItem']];
    var notWrapped = wrapped.filter(function (w) { return !(w[0] && w[0][w[1]] && w[0][w[1]]._lmScopeOf); }).map(function (w) { return w[1]; });
    if (notWrapped.length) fail.push('freeze breakdown: not wrapped: ' + notWrapped.join(', '));
    if (!window._lmScope || window._lmScope !== P._scopes || !P._scopes.on) fail.push('freeze breakdown: window._lmScope not set while open');
    if (!/Freeze breakdown: on/.test(P.report())) fail.push('report has no freeze breakdown line');
    info.loaf = /long animation frames: observed/.test(P.report()) ? 'observed' : 'not supported';
    info.scopeLost = P._scopes.lost;
    if (P._scopes.depth() > 2) fail.push('freeze breakdown: parts left open (depth ' + P._scopes.depth() + ')');
    /* a real 400 ms stall inside a wrapped part (the 10 s special skins timer) is attributed */
    var rs = window.repeatSendingSpecialSkins, inner = rs && rs._lmScopeOf;
    if (inner) {
      var n0 = P.freezes().length;
      var stallFn = function () { var t = performance.now(); while (performance.now() - t < 400) { } };
      /* the wrapper calls what it wrapped: swap that for the stall for one call */
      window.repeatSendingSpecialSkins = P._scopes.wrap(stallFn, 'special skins sync');
      setTimeout(function () { window.repeatSendingSpecialSkins(); }, 50);
      await sleep(900);
      window.repeatSendingSpecialSkins = rs;
      var fz = P.freezes().slice(n0);
      info.stall = fz.length ? fz[fz.length - 1].line : 'no freeze';
      if (!fz.some(function (f) { return f.probable === 'special skins sync'; })) fail.push('a 400 ms stall in a timed part was not attributed: ' + info.stall);
    }
    document.getElementById('lm-perf-diag-close').click();
    await sleep(100);
    if (document.getElementById('lm-perf-diag')) fail.push('diagnostics window did not close');
    if (window._lmPerfFrame) fail.push('frame hook left after closing');
    var still = wrapped.filter(function (w) { return w[0] && w[0][w[1]] && w[0][w[1]]._lmScopeOf; }).map(function (w) { return w[1]; });
    if (still.length) fail.push('freeze breakdown: still wrapped after closing: ' + still.join(', '));
    if (window._lmScope) fail.push('freeze breakdown: window._lmScope left after closing');
    /* keep recording: measuring goes on with the window closed, until turned off */
    P.openDiag();
    await sleep(100);
    var keep = document.getElementById('lm-perf-keep');
    if (keep) keep.click();
    document.getElementById('lm-perf-diag-close').click();
    await sleep(300);
    if (!window._lmPerfFrame) fail.push('keep recording: no measuring after closing');
    info.events = P.events().length;
    P.keepRecording(false);
    if (window._lmPerfFrame) fail.push('keep recording off: frame hook left');
  }
  /* level 3 lowers the resolution, level 0 restores it (runtime only) */
  var cv = document.getElementById('canvas');
  /* the page may not have resized since LMmobile set its pixel ratio: start from a fresh size */
  try { window.drawRender.resizeCanvas(); } catch (e) { }
  var w0 = cv ? cv.width : 0, own = JSON.stringify([S.jellyPhisycs, S.videoSkins, S.hudBlur, S.eatPulse]);
  S.adaptivePerf = true; P.configChanged();
  /* without "may lower the resolution" (the default) level 3 keeps the full resolution */
  P._setLevel(3);
  await sleep(100);
  if (cv && cv.width !== w0) fail.push('level 3 lowered the resolution while the option is off (' + w0 + ' -> ' + cv.width + ')');
  P._setLevel(0);
  S.adaptivePerfRes = true; P.configChanged();
  P._setLevel(3);
  await sleep(100);
  var w3 = cv ? cv.width : 0;
  info.canvas = w0 + ' -> ' + w3;
  if (cv && !(w3 < w0)) fail.push('level 3 did not lower the canvas resolution (' + info.canvas + ')');
  var saved = JSON.parse(localStorage.getItem('ogarioSettings') || '{}');
  window.application.saveSettings(S, 'ogarioSettings');
  var saved2 = JSON.parse(localStorage.getItem('ogarioSettings') || '{}');
  if (saved.eatPulse !== undefined && saved2.eatPulse !== saved.eatPulse) fail.push('a lowered value was saved');
  P._setLevel(0);
  S.adaptivePerfRes = false;
  S.adaptivePerf = false; P.configChanged();
  window.application.saveSettings(S, 'ogarioSettings');
  await sleep(100);
  if (cv && cv.width !== w0) fail.push('resolution not restored (' + cv.width + ' vs ' + w0 + ')');
  if (JSON.stringify([S.jellyPhisycs, S.videoSkins, S.hudBlur, S.eatPulse]) !== own) fail.push('values not restored');
  if (window._lmPerfFrame) fail.push('frame hook left after turning it off');
  return { fail: fail, info: info };
})()
