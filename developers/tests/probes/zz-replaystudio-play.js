// Replay Studio playback of this page's own recording (runs last: watching leaves the server).
// Skipped when the live server sent too little to record.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var key = window.temporaryRecordedProtocol, arr = key && window.RecordedProtocol[key];
  info.packets = arr ? arr.length : 0;
  if (!arr || arr.length < 30 || !arr._lm) { info.skipped = 'no live recording'; return { fail: fail, info: info }; }
  info.timed = arr._lm.t.length === arr.length;
  if (!info.timed) fail.push('packet times missing: ' + arr._lm.t.length + ' of ' + arr.length);
  window.lmReplayStudio('open', key);
  for (var w = 0; w < 50 && !(window.LMReplayStudio && window.LMReplayStudio.run); w++) await sleep(100);
  var RS = window.LMReplayStudio;
  if (!RS || !RS.run) return { fail: ['module did not load'] };
  if (window.legendmod.play) { info.skipped = 'playing'; return { fail: fail, info: info }; }
  /* what the stats modules see (Analytics, Death recap, macros go by the context) and the replay edges */
  var ctxSeen = [], edges = [], ctxOn = function (n) { return function (d) { ctxSeen.push(n + ':' + d.context); }; };
  ['spawn', 'death', 'massUpdate', 'kill', 'leaderboard', 'merge', 'split'].forEach(function (n) { LMEvents.on(n, ctxOn(n)); });
  LMEvents.on('replayStart', function () { edges.push('start'); });
  LMEvents.on('replayStop', function (d) { edges.push('stop:' + d.reason); });
  /* the world as the packets left it: cells (target position and size), own cells, border, leaderboard */
  var worldSig = function () {
    var L = window.legendmod, r = function (v) { return Math.round(+v || 0); }, out = [];
    Object.keys(L.indexedCells || {}).forEach(function (id) { var c = L.indexedCells[id]; if (c && !c.removed) out.push(id + ':' + r(c.targetX) + ',' + r(c.targetY) + ',' + r(c.targetSize) + (c.isFood ? 'f' : '') + (c.isVirus ? 'v' : '')); });
    out.sort();
    return JSON.stringify({ cells: out, own: (L.playerCellIDs || []).slice().sort(), border: [L.mapMinX, L.mapMinY, L.mapMaxX, L.mapMaxY], lb: (L.leaderboard || []).map(function (e) { return e && e.nick; }) });
  };
  /* a rebuild can take seconds on a slow machine: wait for it to end (bounded) */
  var settle = async function (pos) { for (var i = 0; i < 400 && (RS.state().seeking || (pos != null && RS.state().pos !== pos)); i++) await sleep(50); };
  /* the play button: its title, and the play sign (in Greek the Player tab has the same title) */
  var playB = Array.prototype.filter.call(document.querySelectorAll('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('modules.replaystudio.play')) + '"]'), function (b) { return b.textContent === '▶'; })[0];
  if (!playB) return { fail: ['no play button'] };
  playB.click();
  for (w = 0; w < 40 && !RS.state().driving; w++) await sleep(100);
  var st = RS.state();
  if (!st.driving) return { fail: ['playback did not start'], info: info };
  await sleep(1500);
  st = RS.state();
  info.after1500 = st.pos;
  info.firstAt = arr._lm.t[0];
  if (!(st.pos > 0)) fail.push('playback did not advance');
  RS.command('pause');
  var p0 = RS.state().pos;
  document.querySelector('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('modules.replaystudio.stepF')) + '"]').click();
  await sleep(50);
  if (RS.state().pos !== Math.min(p0 + 1, st.n)) fail.push('step forward: ' + p0 + ' -> ' + RS.state().pos);
  document.querySelector('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('modules.replaystudio.stepB')) + '"]').click();
  for (w = 0; w < 50 && RS.state().pos !== p0; w++) await sleep(100);
  if (RS.state().pos !== p0) fail.push('step back: ' + RS.state().pos + ' != ' + p0);
  RS.command('seek', -100000);
  await sleep(300);
  if (RS.state().pos !== 0) fail.push('seek to start: ' + RS.state().pos);
  RS.command('seek', Math.floor(st.n / 2));
  for (w = 0; w < 50 && RS.state().pos !== Math.floor(st.n / 2); w++) await sleep(100);
  if (RS.state().pos !== Math.floor(st.n / 2)) fail.push('seek forward: ' + RS.state().pos);
  info.cells = (window.legendmod.cells || []).length;
  if (RS.state().playing) fail.push('still playing after pause');
  // colour filter: the replay's cells are drawn through it (Canvas2D filter, then the pixels)
  var fxSel = Array.prototype.filter.call(document.querySelectorAll('#lm-rs select'), function (s) { return s.title === lmT('pkg.rp.fx'); })[0];
  var dr = window.drawRender, c2 = dr && dr.ctx;
  if (!fxSel) fail.push('no colour filter select');
  else if (c2) {
    var fxBefore = fxSel.value, setFx = function (v) { fxSel.value = v; fxSel.dispatchEvent(new Event('change')); };
    var pd = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'filter'), seen = {};
    Object.defineProperty(c2, 'filter', { configurable: true, get: function () { return pd.get.call(this); }, set: function (v) { seen[String(v)] = 1; pd.set.call(this, v); } });
    setFx('grey');
    await sleep(400);
    delete c2.filter;
    info.filters = Object.keys(seen);
    if (!seen['grayscale(100%)']) fail.push('greyscale not applied to the cells: ' + info.filters.join(' '));
    /* cell pixels: grey (r = g = b) inside the bigger cells on screen */
    var cv = c2.canvas, cw = dr.canvasWidth || cv.width, ch = dr.canvasHeight || cv.height, sampled = 0, colored = 0;
    try {
      (window.legendmod.cells || []).forEach(function (c) {
        if (sampled >= 15 || !c || c.isFood || c.isVirus || c.isEjected || c.removed) return;
        var r = c.size * dr.scale;
        if (!(r >= 16)) return;
        var px = Math.round(((c.x - dr.camX) * dr.scale + cw / 2 + r * 0.45) * cv.width / cw), py = Math.round(((c.y - dr.camY) * dr.scale + ch / 2 + r * 0.45) * cv.height / ch);
        if (px < 2 || py < 2 || px > cv.width - 3 || py > cv.height - 3) return;
        var d = c2.getImageData(px, py, 1, 1).data;
        sampled++;
        if (Math.max(d[0], d[1], d[2]) - Math.min(d[0], d[1], d[2]) > 12) colored++;
      });
    } catch (e) { info.pixels = 'unreadable: ' + (e && e.name); }
    info.pixelCells = sampled;
    info.pixelColored = colored;
    if (sampled && colored) fail.push('greyscale replay: ' + colored + ' of ' + sampled + ' cells still coloured');
    setFx(fxBefore);
  }
  // backwards: the reverse play button steps back (each step is rebuilt: the position runs up to it
  // while a step is rebuilt, so only the positions shown between rebuilds count)
  var mid = RS.state().pos;
  var revB = Array.prototype.filter.call(document.querySelectorAll('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('pkg.rp.playRev')) + '"]'), function (b) { return b.textContent === '◀'; })[0];
  if (!revB) fail.push('no play backwards button');
  else {
    revB.click();
    /* 1.2 s, and on until a step is shown: on a slow machine one step (a rebuild of every
     * packet up to it, then its first frame) can take seconds, so the first one may come later */
    var p1 = mid, back = 0, tw = performance.now();
    for (w = 0; w < 300 && (back === 0 || performance.now() - tw < 1200); w++) { await sleep(100); if (RS.state().seeking) continue; var pw = RS.state().pos; if (pw < p1) back++; if (pw > p1) back = -100; p1 = pw; }
    info.backMs = Math.round(performance.now() - tw);
    /* not in the middle of a step being rebuilt */
    for (w = 0; w < 400 && RS.state().seeking; w++) await sleep(50);
    st = RS.state();
    info.backwards = { from: mid, to: st.pos, dir: st.dir, steps: back };
    if (!(st.dir === -1 && st.playing && st.pos < mid && back > 0)) fail.push('backwards playback did not step back: ' + JSON.stringify(info.backwards));
    RS.command('pause');
    if (RS.state().playing) fail.push('still playing backwards after pause');
    /* the world reached by playing backwards is the one the packets up to there make */
    await settle();
    var q = RS.state().pos, sq = worldSig();
    RS.command('seek', 25);
    await settle(Math.min(q + 25, RS.state().n));
    var tb = performance.now();
    RS.command('seek', q - RS.state().pos);
    await settle(q);
    info.rebuild = { pos: q, ms: Math.round(performance.now() - tb) };
    var sr = worldSig();
    info.backwardsWorld = { cells: JSON.parse(sq).cells.length, rebuilt: JSON.parse(sr).cells.length, same: sq === sr };
    if (RS.state().pos !== q || sq !== sr) {
      var a1 = JSON.parse(sq).cells, b1 = JSON.parse(sr).cells;
      fail.push('world after playing backwards differs from the packets up to ' + q + ': ' + a1.filter(function (x) { return b1.indexOf(x) === -1; }).length + ' extra/changed, ' + b1.filter(function (x) { return a1.indexOf(x) === -1; }).length + ' missing');
    }
  }
  /* a long step back (every packet made 1 ms slower, so it is rebuilt in many slices): no frame shows
   * the world running up to the target; the frames go on once it is there */
  var dr3 = window.drawRender, L3 = window.legendmod;
  if (dr3 && typeof dr3.renderFrame === 'function' && L3) {
    var rf3 = dr3.renderFrame, hmOwn = Object.prototype.hasOwnProperty.call(L3, 'handleMessage'), hm3 = L3.handleMessage;
    var fr = { during: 0, all: 0 };
    dr3.renderFrame = function () { fr.all++; if (RS.state().seeking) fr.during++; return rf3.apply(this, arguments); };
    L3.handleMessage = function (d) { var t = performance.now(); while (performance.now() - t < 1) { } return hm3.call(this, d); };
    try {
      RS.command('seek', RS.state().n - RS.state().pos);
      /* bounded by the packets (each one 1 ms slower here) */
      var lsMax = 300 + Math.ceil(RS.state().n / 10);
      for (w = 0; w < lsMax && (RS.state().seeking || RS.state().pos !== RS.state().n); w++) await sleep(50);
      var tgt = Math.floor(RS.state().n * 0.6), tl = performance.now();
      fr.during = 0; fr.all = 0;
      RS.command('seek', tgt - RS.state().pos);
      for (w = 0; w < lsMax && (RS.state().seeking || RS.state().pos !== tgt); w++) await sleep(50);
      var lsMs = Math.round(performance.now() - tl), lsFrames = fr.all;
      await sleep(300);
      info.longStep = { to: tgt, ms: lsMs, framesDuring: fr.during, framesBy: lsFrames, framesAfter: fr.all - lsFrames };
      if (RS.state().pos !== tgt) fail.push('long step did not reach ' + tgt + ': ' + RS.state().pos);
      if (fr.during) fail.push('long step: ' + fr.during + ' frames drawn while it was rebuilt (' + lsMs + ' ms)');
      if (!(fr.all > lsFrames)) fail.push('no frame drawn after the long step');
      if (window._lmReplayHoldUntil) fail.push('frame hold left on after the long step');
    } finally {
      dr3.renderFrame = rf3;
      if (hmOwn) L3.handleMessage = hm3; else delete L3.handleMessage;
    }
  }
  /* the end: paused there, still a replay; stepping and seeking after it are replay too */
  RS.command('seek', RS.state().n - 5 - RS.state().pos);
  await settle(RS.state().n - 5);
  if (RS.state().playing) RS.command('pause');
  playB.click();
  for (w = 0; w < 40 && (RS.state().playing || RS.state().pos < RS.state().n); w++) await sleep(100);
  st = RS.state();
  info.end = { pos: st.pos, n: st.n, playing: st.playing, ctx: window._lmEvReplayOn, paused: window._lmReplayPaused };
  if (st.playing || st.pos !== st.n || !st.driving) fail.push('end not reached or not paused there: ' + JSON.stringify(info.end));
  if (window._lmEvReplayOn !== true) fail.push('the end of the replay counts as live (_lmEvReplayOn ' + window._lmEvReplayOn + ')');
  document.querySelector('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('modules.replaystudio.stepB')) + '"]').click();
  await settle(st.n - 1);
  RS.command('seek', -10);
  await settle(st.n - 11);
  await sleep(600);
  if (window._lmEvReplayOn !== true) fail.push('stepping / seeking after the end counts as live');
  // Death recap links (lmReplayWatchAt) play from a packet in the Studio
  if (window.lmReplayWatchAt(key, 10)) {
    for (w = 0; w < 30 && !(RS.state().playing && RS.state().pos >= 10 && RS.state().dir === 1); w++) await sleep(100);
    st = RS.state();
    if (!(st.playing && st.dir === 1 && st.pos >= 10)) fail.push('watch from packet 10: ' + JSON.stringify([st.pos, st.dir, st.playing]));
    RS.command('pause');
  } else fail.push('lmReplayWatchAt refused the recording');
  // a replay^ server join that the Studio did not start opens it on that replay
  RS.run('close');
  await sleep(100);
  if (RS.state().open || RS.state().driving) fail.push('close did not stop the Studio');
  /* closed, the stopped replay is still on screen: still a replay until a server is joined */
  if (window._lmEvReplayOn !== true || window._lmReplayPaused) fail.push('after close: replay context ' + window._lmEvReplayOn + ', paused flag ' + window._lmReplayPaused);
  info.contexts = ctxSeen.length;
  info.edges = edges.join(' ');
  var live = ctxSeen.filter(function (x) { return /:live$/.test(x); });
  if (live.length) fail.push('live events during the replay: ' + live.slice(0, 5).join(' '));
  if (edges.indexOf('stop:end') !== -1 || edges.filter(function (x) { return x === 'start'; }).length > 1) fail.push('replay events: ' + info.edges);
  window.playReplayLM(key);
  for (w = 0; w < 30 && !(RS.state().open && RS.state().driving); w++) await sleep(100);
  st = RS.state();
  if (!(st.open && st.driving && st.key === key)) fail.push('replay join did not open Replay Studio: ' + JSON.stringify([st.open, st.driving, st.key]));
  RS.run('close');
  return { fail: fail, info: info };
})()
