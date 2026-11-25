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
  RS.run('close');
  return { fail: fail, info: info };
})()
