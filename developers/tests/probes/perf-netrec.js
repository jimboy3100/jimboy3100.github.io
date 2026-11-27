// Performance diagnostics, connections and GPU time: while recording, every message of the main
// connection is in the timeline with its handling time (window._lmNetRec is set for the units of
// spect.js, legendmod.onMessage is wrapped, the timers only where the browser has no long animation
// frames: those name the timer callbacks); a page blocked for 400 ms while
// connected gives a connection gap of the client with the messages that came at once after it;
// the report lists the connections (host only, no token) and the GPU time; when recording stops
// everything is put back and nothing is recorded.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 30 && !window.LMPerf; i++) await sleep(200);
  var P = window.LMPerf, lm = window.legendmod;
  if (!P || typeof P.timeline !== 'function') return { fail: ['LMPerf.timeline missing (ogario/modules/perf.js)'] };
  if (window._lmNetRec) fail.push('connection recorder set while diagnostics are off');
  var nativeTO = window.setTimeout, onMsg = lm && lm.onMessage;
  var ap = window.application, dr = window.drawRender;
  var skinM = [[ap, '_lmSkinJobAdd'], [ap, '_lmSkinJobRun'], [dr, '_lmQueueSkinUpload'], [dr, '_lmUploadSkinJob']].map(function (p) { return [p[0], p[1], p[0] && p[0][p[1]]]; });
  P.keepRecording(true);
  if (!window._lmNetRec || typeof window._lmNetRec.b !== 'function') fail.push('recording: no connection recorder');
  if (!(lm && lm.onMessage && lm.onMessage._lmScopeOf === onMsg)) fail.push('recording: main connection messages not wrapped');
  /* skin queue waits: the real queue / run methods are timed while recording */
  skinM.forEach(function (p) { if (!(p[2] && p[0][p[1]] && p[0][p[1]]._lmScopeOf === p[2])) fail.push('recording: ' + p[1] + ' not wrapped for the skin queue waits'); });
  /* the real jelly index answers the occupancy question (also when empty) */
  if (!(lm && lm.quadtree && typeof lm.quadtree.occupancy === 'function')) info.jellyIndex = 'no index (jelly off or the JS fallback)';
  else {
    var oc = lm.quadtree.occupancy(4096);
    info.jellyIndex = oc.points + ' points, fullest ' + oc.fullest + ', ' + oc.perQuery.toFixed(1) + ' read per point';
    if (!(oc.sampled <= 4096 && oc.points >= 0 && (oc.points === 0 || oc.perQuery >= 1))) fail.push('jelly index occupancy: ' + JSON.stringify(oc));
  }
  var PO = window.PerformanceObserver, loaf = !!(PO && PO.supportedEntryTypes && PO.supportedEntryTypes.indexOf('long-animation-frame') >= 0);
  info.timers = loaf ? 'named by the long animation frames' : 'wrapped';
  if (loaf ? window.setTimeout !== nativeTO : !(window.setTimeout && window.setTimeout._lmScopeOf === nativeTO)) fail.push('recording: setTimeout ' + (loaf ? 'wrapped although the long animation frames name the timers' : 'not timed'));
  await sleep(2500);
  var open = !!(lm && lm.isSocketOpen && lm.isSocketOpen());
  info.connected = open;
  var mainOf = function () { return P.connections().filter(function (c) { return c.id === 0; })[0]; };
  /* a live server that is slow to send (a busy test server sent nothing for 2.5 s after the
   * connection opened): on until its first message is recorded (bounded) */
  for (var mw = 0; mw < 50 && open && !(mainOf() && mainOf().n > 0); mw++) { await sleep(200); open = !!lm.isSocketOpen(); }
  var cs = P.connections(), main = mainOf();
  info.main = main ? main.n + ' messages, ' + main.world + ' world updates, host ' + main.host : 'none';
  if (open && !(main && main.n > 0)) fail.push('connected but no main connection messages recorded');
  if (main && /token|\?|\//.test(main.host)) fail.push('connection host holds more than the host: ' + main.host);
  var tl = P.timeline(), kinds = {};
  tl.rows.forEach(function (r) { kinds[r[1]] = (kinds[r[1]] || 0) + 1; });
  info.rows = tl.rows.length;
  if (!kinds[tl.kinds.RAF] || !kinds[tl.kinds.FRAME]) fail.push('timeline has no frame rows');
  if (open && !kinds[tl.kinds.MSG]) fail.push('timeline has no message rows while connected');
  /* the page blocked for 400 ms: the messages wait in the browser */
  if (open) {
    var g0 = P.events().filter(function (e) { return e.type === 'connection gap'; }).length;
    var n0 = (mainOf() || {}).n || 0, nBlock = -1;
    nativeTO(function () { var t = performance.now(); while (performance.now() - t < 400) { } nBlock = (mainOf() || {}).n || 0; }, 0);
    await sleep(1500);
    /* the gap is noted when the next message comes after the block: a slow server may send it later
     * (bounded) */
    for (var bw = 0; bw < 30 && nBlock >= 0 && ((mainOf() || {}).n || 0) <= nBlock; bw++) await sleep(200);
    info.msgs = [n0, nBlock, (mainOf() || {}).n || 0];
    var gaps = P.events().filter(function (e) { return e.type === 'connection gap'; }).slice(g0);
    info.gap = gaps.length ? gaps.map(function (e) { return e.dur + ' ms ' + e.net.cause + ', busy ' + e.net.blocked + ' ms, ' + e.net.q + ' at once'; }).join('; ') : 'none';
    if (!gaps.some(function (e) { return e.net && e.net.c === 0 && e.net.cause === 'client' && e.net.blocked >= 300; })) fail.push('a 400 ms block of the page gave no client gap on the main connection: ' + info.gap);
  }
  var g = P.gpu();
  info.gpu = g.supported ? g.frames + ' frames' + (g.stats ? ', p50/p95/max ' + g.stats.join('/') + ' ms' : '') : 'timer query not supported';
  var rep = P.report();
  if (!/Connections since recording/.test(rep) || !/GPU time per frame \(timer query\)/.test(rep)) fail.push('report has no connections / GPU lines');
  if (/token=|SECRET/i.test(rep)) fail.push('report holds a token');
  if (P._scopes.depth() > 2) fail.push('timed parts left open (depth ' + P._scopes.depth() + ')');
  P.keepRecording(false);
  await sleep(50);
  if (window._lmNetRec) fail.push('recording off: connection recorder left');
  if (lm && lm.onMessage !== onMsg) fail.push('recording off: main connection messages still wrapped');
  if (window.setTimeout !== nativeTO) fail.push('recording off: setTimeout not put back');
  skinM.forEach(function (p) { if (p[0] && p[0][p[1]] !== p[2]) fail.push('recording off: ' + p[1] + ' not put back'); });
  var n0 = P.timeline().rows.length;
  await sleep(500);
  if (P.timeline().rows.length !== n0) fail.push('recording off: the timeline still grows');
  return { fail: fail, info: info };
})()
