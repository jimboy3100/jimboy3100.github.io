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
  // backwards: the reverse play button steps back through the packets
  var mid = RS.state().pos;
  var revB = Array.prototype.filter.call(document.querySelectorAll('#lm-rs .lm-rs-b[title="' + CSS.escape(lmT('pkg.rp.playRev')) + '"]'), function (b) { return b.textContent === '◀'; })[0];
  if (!revB) fail.push('no play backwards button');
  else {
    revB.click();
    var p1 = mid, back = 0;
    for (w = 0; w < 12; w++) { await sleep(100); var pw = RS.state().pos; if (pw < p1) back++; if (pw > p1) back = -100; p1 = pw; }
    st = RS.state();
    info.backwards = { from: mid, to: st.pos, dir: st.dir, steps: back };
    if (!(st.dir === -1 && st.playing && st.pos < mid && back > 0)) fail.push('backwards playback did not step back: ' + JSON.stringify(info.backwards));
    RS.command('pause');
    if (RS.state().playing) fail.push('still playing backwards after pause');
  }
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
  window.playReplayLM(key);
  for (w = 0; w < 30 && !(RS.state().open && RS.state().driving); w++) await sleep(100);
  st = RS.state();
  if (!(st.open && st.driving && st.key === key)) fail.push('replay join did not open Replay Studio: ' + JSON.stringify([st.open, st.driving, st.key]));
  RS.run('close');
  return { fail: fail, info: info };
})()
