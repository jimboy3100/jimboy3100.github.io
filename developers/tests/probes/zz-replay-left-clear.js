// A replay watched in Replay Studio, then a live server joined (the Join button, a real click or
// tap): the watched recording is not "playing" any more, so Settings > Replays > Clear recordings in
// memory and the memory budget may free it again; it stayed protected as the playing replay until
// another replay was watched. Nothing is freed here (only what the button would keep is checked).
// Runs late: watching leaves the live server (it is joined again).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  if (typeof window.lmReplayStudio !== 'function' || typeof window._lmRecKeepOnClear !== 'function') return { fail: ['replay helpers missing'] };
  var l = window.legendmod, k0 = window.temporaryRecordedProtocol, arr = k0 && window.RecordedProtocol[k0];
  var liveWs = l && l.ws;
  if (!arr || arr.length < 30 || !liveWs || String(liveWs).indexOf('replay') !== -1) return { skip: 'no live recording' };
  if (l.play) return { skip: 'playing' };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var press = function (el) {
    try { el.scrollIntoView({ block: 'center' }); } catch (e) { }
    var r = el.getBoundingClientRect();
    return new Promise(function (res) {
      var id = 'rlc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 200); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }));
    });
  };
  var token = $('#server-token').val();
  var aside = [];
  try {
    window.lmReplayStudio('watch', [k0, 0]);
    for (var w = 0; w < 80 && !(window.LMReplayStudio && window.LMReplayStudio.isDriving && window.LMReplayStudio.isDriving()); w++) await sleep(100);
    if (!window.LMReplayStudio.isDriving()) return { fail: ['the replay did not start'], info: info };
    await sleep(800);
    info.whilePlaying = window._lmRecKeepOnClear(k0, window.RecordedProtocol[k0]);
    if (!info.whilePlaying) fail.push('the playing replay would be freed by Clear recordings in memory');
    /* the live server again, with the Join button of the menu */
    window.lmReplayStudio('close');
    $('.modal.in, .modal[style*="block"], .modal-backdrop').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
    $('#server-token').val(String(liveWs).replace(/^wss?:\/\//, ''));
    var join = document.getElementById('server-join');
    if (join && join.offsetParent) await press(join); else $('#server-join').trigger('click');
    for (w = 0; w < 80 && String(l.ws).indexOf('replay') !== -1; w++) await sleep(100);
    info.ws = l.ws;
    if (String(l.ws).indexOf('replay') !== -1) { fail.push('the live server was not joined again'); return { fail: fail, info: info }; }
    await sleep(500);
    info.kept = window._lmRecKeepOnClear(k0, window.RecordedProtocol[k0]);
    info.live = window.temporaryRecordedProtocol;
    if (info.kept) fail.push('after joining a live server, Clear recordings in memory still keeps the replay watched before (' + k0 + ') as playing');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    aside.forEach(function (a) { a[0].style.display = a[1]; });
    if (String(l.ws).indexOf('replay') !== -1) { $('#server-token').val(String(liveWs).replace(/^wss?:\/\//, '')); $('#server-join').trigger('click'); }
    /* the probes after this one play the live recording: give it some packets */
    for (w = 0; w < 60 && !((window.RecordedProtocol[window.temporaryRecordedProtocol] || []).length > 60); w++) await sleep(100);
    if (token && String(token).indexOf('replay') === -1) $('#server-token').val(token);
  }
  return { fail: fail, info: info };
})()
