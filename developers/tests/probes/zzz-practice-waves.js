// Team waves on screen: a Delta-layout opcode 45 packet goes through the real relay handler
// (application.readMessage) during a practice session with jelly physics on, and its ring
// shows on the main canvas, once with WebGL2 cells (the GL layer above it left clear there)
// and once with Canvas2D cells. Nothing is sent to the relay.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod, app = window.application, dr = window.drawRender;
  if (!(window.LMPractice && window.LMPractice.start) && typeof window.lmPractice === 'function') {
    window.lmPractice('open');
    for (var w = 0; w < 60 && !(window.LMPractice && window.LMPractice.start); w++) await sleep(100);
  }
  var P = window.LMPractice;
  if (!lm || !app || !dr || !P || !P.start || typeof app.readMessage !== 'function') return { fail: ['practice module or relay handler missing'] };
  if (P.isOpen && P.isOpen()) P.close();
  info.jelly = !!(window.legendmod5 && window.legendmod5.jellyPhisycs);
  if (!info.jelly) fail.push('jelly physics is not on by default');
  var dms = window.legendmod5 || {};
  var glBefore = dms.webgl2Acceleration;
  var C = dr._lmGlWhyN, G = dr.GLW || {};
  var origRender = dr.renderFrame;
  var job = null;
  /* sample right after a frame is drawn, before the browser composites it */
  dr.renderFrame = function () {
    var res = origRender.apply(this, arguments);
    try { if (job) job(); } catch (e) { info.sampleError = String(e); job = null; }
    return res;
  };
  function ringPoints(W, r) {
    var pts = [], cv = dr.ctx.canvas, cw = dr.canvasWidth || cv.width, ch = dr.canvasHeight || cv.height;
    for (var k = 0; k < 32; k++) {
      var a = 2 * Math.PI * k / 32, rr = r * (k % 2 ? 0.9 : 0.95);
      var x = W.x + Math.cos(a) * rr, y = W.y + Math.sin(a) * rr;
      var sx = (x - dr.camX) * dr.scale + cw / 2, sy = (y - dr.camY) * dr.scale + ch / 2;
      if (sx < 4 || sy < 4 || sx > cw - 5 || sy > ch - 5) continue;
      pts.push({ k: k, cx: sx, cy: sy, px: Math.round(sx * cv.width / cw), py: Math.round(sy * cv.height / ch) });
    }
    return pts;
  }
  function pixel(c2, p) { var d = c2.getImageData(p.px, p.py, 1, 1).data; return [d[0], d[1], d[2], d[3]]; }
  /* one wave: baseline pixels at its ring, then the packet, then the same pixels while it grows */
  async function waveCheck(label) {
    var W = { x: dr.camX + 40 / (dr.scale || 1), y: dr.camY - 30 / (dr.scale || 1) };
    var base = {}, gotBase = false;
    job = function () {
      ringPoints(W, 350).forEach(function (p) { base[p.k] = pixel(dr.ctx, p); });
      gotBase = true; job = null;
    };
    for (var i = 0; i < 30 && !gotBase; i++) await sleep(50);
    var ox = typeof app.lmWaveOffsetX === 'function' ? app.lmWaveOffsetX() : (lm.mapOffsetX || 0);
    var oy = typeof app.lmWaveOffsetY === 'function' ? app.lmWaveOffsetY() : (lm.mapOffsetY || 0);
    var v = new DataView(new ArrayBuffer(14));
    v.setUint8(0, 45); v.setUint16(1, 61001, true); v.setUint16(3, 61002, true); v.setUint8(5, 4);
    v.setInt32(6, Math.round(W.x + ox), true); v.setInt32(10, Math.round(W.y + oy), true);
    var n0 = lm.Waves.length;
    app.readMessage(v);
    var wave = lm.Waves[lm.Waves.length - 1];
    if (lm.Waves.length !== n0 + 1 || !wave) { fail.push(label + ': the received wave was not added (mapOffsetFixed ' + lm.mapOffsetFixed + ')'); return; }
    if (Math.abs(wave.x - Math.round(W.x)) > 1 || Math.abs(wave.y - Math.round(W.y)) > 1) fail.push(label + ': wave at ' + wave.x + ',' + wave.y + ' not ' + W.x + ',' + W.y);
    var tinted = 0, sampled = 0, covered = 0, frames = 0, glFrames0 = C ? C[G.WEBGL] : 0, done = false;
    var gl = dr.gl, glc = gl && gl.canvas;
    job = function () {
      var r = (Date.now() - wave.time) / 2;
      if (r < 350) return;
      frames++;
      var pts = ringPoints(W, r);
      for (var q = 0; q < pts.length; q++) {
        var p = pts[q], b = base[p.k];
        if (!b) continue;
        var d = pixel(dr.ctx, p);
        sampled++;
        /* the fallback colour #00e6ff over the background: green and blue up, red not */
        if (d[1] - b[1] > 12 && d[2] - b[2] > 12 && d[1] - b[1] > d[0] - b[0] + 8) {
          tinted++;
          if (label === 'WebGL2' && glc) {
            var gx = Math.round(p.cx * glc.width / (dr.canvasWidth || glc.width)), gy = Math.round(p.cy * glc.height / (dr.canvasHeight || glc.height));
            var px = new Uint8Array(4);
            gl.readPixels(gx, glc.height - gy - 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
            if (px[3] === 255) covered++;
          }
        }
      }
      if (frames >= 3) { done = true; job = null; }
    };
    for (var j = 0; j < 60 && !done; j++) await sleep(50);
    job = null;
    info[label] = { sampled: sampled, tinted: tinted, coveredByGl: covered, glFrames: C ? C[G.WEBGL] - glFrames0 : '?' };
    if (!sampled) { info[label].note = 'ring off screen'; return; }
    if (tinted < sampled * 0.25) fail.push(label + ': wave ring not visible on the main canvas (' + tinted + ' of ' + sampled + ' ring pixels)');
    if (covered > tinted / 2) fail.push(label + ': the GL layer hides the wave (' + covered + ' of ' + tinted + ')');
  }
  try {
    P.start({ exercise: 'free', seed: 11, bots: 2, startMass: 300, duration: 120 }, { confirm: true });
    if (!P.state().on) return { fail: fail.concat(['session did not start']), info: info };
    await sleep(1500);
    info.mapOffsetFixed = !!lm.mapOffsetFixed;
    var sent0 = app._lmWaveStats ? app._lmWaveStats.sent : 0;
    if (dr.gl && C && C[G.WEBGL] > 0) await waveCheck('WebGL2');
    else info.WebGL2 = 'no WebGL2 frames here (' + (dr._lmGlWhy) + ')';
    dms.webgl2Acceleration = false;
    await sleep(400);
    await waveCheck('Canvas2D');
    if (app._lmWaveStats) info.stats = app._lmWaveStats.shown + ' shown, ' + app._lmWaveStats.rendered + ' drawn';
    if (app._lmWaveStats && app._lmWaveStats.sent !== sent0) fail.push('a wave was sent to the relay');
  } finally {
    dms.webgl2Acceleration = glBefore;
    dr.renderFrame = origRender;
    try { P.stop(false); } catch (e) { }
  }
  await sleep(200);
  return { fail: fail, info: info };
})()
