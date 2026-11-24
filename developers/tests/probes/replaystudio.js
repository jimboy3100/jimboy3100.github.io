// Replay Studio: loads on demand, shows a recording with its bookmarks, fits the screen,
// stores and removes a library entry, closes. Nothing is played (that would leave the server).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.lmReplayStudio !== 'function') return { fail: ['lmReplayStudio loader missing'] };
  var key = 'probe-studio.lm';
  var n = 40, t = [], packets = [];
  for (var i = 0; i < n; i++) { t.push(i * 50); packets.push(new DataView(new Uint8Array([199, i]).buffer)); }
  packets._lm = { v: 1, t0: Date.now(), ct: 0, t: t, s: [100, 500, 1, 2, 350, 500, 1, 1], e: [200, 'k', 120, 900, 'p', 1, 950, 'p', 1, 1800, 'd', 800], c: [] };
  window.RecordedProtocol[key] = packets;
  window.RecordedArenasSpecifications[key] = [Date.now(), ':ffa', 'EU', 'probe'];
  window.RecordedProtocolArenas.push(key);
  try {
    window.lmReplayStudio('open', key);
    for (var w = 0; w < 50 && !(window.LMReplayStudio && window.LMReplayStudio.run); w++) await sleep(100);
    if (!window.LMReplayStudio || !window.LMReplayStudio.run) return { fail: ['module did not load'] };
    await sleep(400);
    var box = document.getElementById('lm-rs');
    if (!box || box.style.display === 'none') fail.push('window not shown');
    else {
      var r = box.getBoundingClientRect();
      info.rect = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('window outside the screen ' + info.rect.join(','));
    }
    var st = window.LMReplayStudio.state();
    info.state = st;
    if (st.key !== key) fail.push('recording not selected: ' + st.key);
    if (st.marks !== 4) fail.push('expected 4 bookmarks (kill, top1, split x2, death), got ' + st.marks);
    var mk = box ? box.querySelectorAll('.lm-rs-mk').length : 0;
    if (mk !== st.marks) fail.push('timeline markers ' + mk + ' != ' + st.marks);
    // library round trip
    var store = window.LMReplayStudio.store;
    var lens = new Uint32Array([2, 2]);
    var buf = new Uint8Array([1, 2, 3, 4]).buffer;
    var saved = await store.put({ id: 'probe1', name: 'probe <b>x</b>', tags: ['t'], date: Date.now(), packets: 2, bytes: 12 }, { buf: buf, lens: lens.buffer, spec: [Date.now()], side: { lmrs: 1 } });
    if (!saved || saved.id !== 'probe1') fail.push('library put failed');
    var list = await store.list();
    if (!list.some(function (m) { return m.id === 'probe1'; })) fail.push('library entry not listed');
    var got = await store.get('probe1');
    if (!got.data || got.data.buf.byteLength !== 4) fail.push('library data not read back');
    box && box.querySelectorAll('.lm-rs-b')[1].click(); // Library tab
    await sleep(500);
    var html = box ? box.innerHTML : '';
    if (html.indexOf('<b>x</b>') !== -1) fail.push('library name not escaped');
    await store.remove('probe1');
    list = await store.list();
    if (list.some(function (m) { return m.id === 'probe1'; })) fail.push('library entry not removed');
    // close by the X button
    var xs = box ? Array.prototype.filter.call(box.querySelectorAll('.lm-rs-b'), function (b) { return b.textContent === '✕'; }) : [];
    if (xs.length) xs[0].click();
    await sleep(200);
    if (box && box.style.display !== 'none') fail.push('window did not close');
  } finally {
    var ix = window.RecordedProtocolArenas.indexOf(key);
    if (ix !== -1) window.RecordedProtocolArenas.splice(ix, 1);
    delete window.RecordedProtocol[key];
    delete window.RecordedArenasSpecifications[key];
  }
  return { fail: fail, info: info };
})()
