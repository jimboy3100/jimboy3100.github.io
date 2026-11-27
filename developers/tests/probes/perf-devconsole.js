// Developer console: not among the player settings (Settings > Performance has no switch for it);
// the Performance diagnostics window switches it on and off, saved with the settings, and the profiler
// box follows (clientProfiler). The setting and the window are put back afterwards.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 50 && !(window.LMPerf && window.legendmod5); w++) await sleep(200);
  var P = window.LMPerf, S = window.legendmod5;
  if (!P || typeof P.openDiag !== 'function' || !S) return { fail: ['LMPerf / settings not loaded'] };
  if (document.getElementById('showDevConsole')) fail.push('the developer console is still a switch in Settings');
  var was = S.showDevConsole, wasOpen = !!document.getElementById('lm-perf-diag');
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}').showDevConsole; } catch (e) { return 'bad'; } };
  try {
    if (!wasOpen) P.openDiag();
    await sleep(100);
    var b = document.getElementById('lm-perf-dev');
    if (!b) return { fail: fail.concat(['no developer console switch in the diagnostics window']) };
    info.off = b.textContent;
    if (S.showDevConsole) { b.click(); await sleep(50); }
    var offText = b.textContent;
    b.click();
    await sleep(50);
    info.on = b.textContent;
    if (S.showDevConsole !== true) fail.push('the switch did not turn the developer console on');
    if (stored() !== true) fail.push('turned on but not saved: ' + stored());
    if (!window.clientProfiler || !window.clientProfiler.isEnabled()) fail.push('profiler not on');
    if (!window.clientProfiler || !window.clientProfiler.hudVisible) fail.push('profiler box not shown');
    if (b.textContent === offText || b.textContent.indexOf('pkg.caw') >= 0) fail.push('button text does not say it is on: ' + b.textContent);
    b.click();
    await sleep(50);
    if (S.showDevConsole !== false || stored() !== false) fail.push('the switch did not turn it off (saved ' + stored() + ')');
    if (window.clientProfiler && window.clientProfiler.hudVisible) fail.push('profiler box still shown after off');
  } finally {
    if (S.showDevConsole !== was) { var bb = document.getElementById('lm-perf-dev'); if (bb) bb.click(); }
    if (!wasOpen && document.getElementById('lm-perf-diag')) P.openDiag();
  }
  return { fail: fail, info: info };
})()
