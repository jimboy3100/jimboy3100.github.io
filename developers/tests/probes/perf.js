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
  ['adaptivePerf', 'netHistory', 'adaptivePerfToasts'].forEach(function (k) {
    if (!document.getElementById(k)) fail.push('option ' + k + ' missing');
  });
  if (!document.getElementById('adaptivePerfTarget-slider')) fail.push('target slider missing');
  if (!document.getElementById('lm-perf-diag-btn')) fail.push('diagnostics button missing');
  if (S.adaptivePerf !== false || S.netHistory !== false) fail.push('options not off by default');
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
    document.getElementById('lm-perf-diag-close').click();
    await sleep(100);
    if (document.getElementById('lm-perf-diag')) fail.push('diagnostics window did not close');
    if (window._lmPerfFrame) fail.push('frame hook left after closing');
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
  S.adaptivePerf = false; P.configChanged();
  window.application.saveSettings(S, 'ogarioSettings');
  await sleep(100);
  if (cv && cv.width !== w0) fail.push('resolution not restored (' + cv.width + ' vs ' + w0 + ')');
  if (JSON.stringify([S.jellyPhisycs, S.videoSkins, S.hudBlur, S.eatPulse]) !== own) fail.push('values not restored');
  if (window._lmPerfFrame) fail.push('frame hook left after turning it off');
  return { fail: fail, info: info };
})()
