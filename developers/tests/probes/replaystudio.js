// Replay Studio: loads on demand, shows a recording with its bookmarks, fits the screen,
// stores and removes a library entry, closes. Nothing is played (that would leave the server).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.lmReplayStudio !== 'function') return { fail: ['lmReplayStudio loader missing'] };
  var key = 'probe-studio.lm', oldKey = 'probe-old.lm', w;
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
    // a file of the old replay window (packets as binary strings, the game info array last) opens through Import
    var oldN = 30, oldPk = [];
    for (i = 0; i < oldN; i++) oldPk.push(String.fromCharCode(16, i, 200, 255));
    var oldText = JSON.stringify(oldPk.concat([[Date.now() - 60000, ':ffa', 'EU-London', 'oldnick', '{}']]));
    var fileIn = box && box.querySelector('input[type=file]');
    if (!fileIn) fail.push('no import file input');
    else {
      var dt = new DataTransfer();
      dt.items.add(new File([oldText], oldKey, { type: 'text/plain' }));
      fileIn.files = dt.files;
      fileIn.dispatchEvent(new Event('change'));
      for (w = 0; w < 30 && window.LMReplayStudio.state().key !== oldKey; w++) await sleep(100);
      var os = window.LMReplayStudio.state(), oa = window.RecordedProtocol[oldKey];
      info.oldFile = { key: os.key, n: os.n };
      if (os.key !== oldKey || os.n !== oldN) fail.push('old replay file not opened: ' + os.key + ' ' + os.n);
      else if (!(oa[5].getUint8(1) === 5 && oa[5].getUint8(2) === 200 && oa[5].getUint8(3) === 255)) fail.push('old replay file bytes changed');
      if ((window.RecordedArenasSpecifications[oldKey] || [])[3] !== 'oldnick') fail.push('old replay file game info lost');
      if (box.querySelector('select').value !== oldKey) fail.push('old replay file not selected in the list');
      for (w = 0; w < 30; w++) {
        list = await store.list();
        var oe = list.filter(function (m) { return m.key === oldKey; });
        if (oe.length) { for (var q = 0; q < oe.length; q++) await store.remove(oe[q].id); break; }
        await sleep(100);
      }
    }
    // colour filters: the select sets the renderer's flags and is remembered
    var fxSel = box && Array.prototype.filter.call(box.querySelectorAll('select'), function (s) { return s.title === lmT('pkg.rp.fx'); })[0];
    if (!fxSel) fail.push('no colour filter select');
    else {
      var fxBefore = fxSel.value, setFx = function (v) { fxSel.value = v; fxSel.dispatchEvent(new Event('change')); };
      var flags = function () { return [!!window.replayGreyScale, !!window.replaySepia, !!window.replayHueRotate].join(); };
      setFx('grey'); if (flags() !== 'true,false,false') fail.push('greyscale flags ' + flags());
      setFx('sepia'); if (flags() !== 'false,true,false') fail.push('sepia flags ' + flags());
      setFx('hue'); if (flags() !== 'false,false,true') fail.push('hue flags ' + flags());
      try { if (JSON.parse(localStorage.getItem('lmReplayStudio')).fx !== 'hue') fail.push('filter not remembered'); } catch (e) { }
      setFx(''); if (flags() !== 'false,false,false') fail.push('no filter flags ' + flags());
      setFx(fxBefore);
      if (fxSel.options.length !== 4) fail.push('filter choices ' + fxSel.options.length);
    }
    // close by the X button
    var xs = box ? Array.prototype.filter.call(box.querySelectorAll('.lm-rs-b'), function (b) { return b.textContent === '✕'; }) : [];
    if (xs.length) xs[0].click();
    await sleep(200);
    if (box && box.style.display !== 'none') fail.push('window did not close');
    // the Replay button of the Home tab opens Replay Studio; the old replay window is gone
    var qr = document.querySelector('.quick-replay');
    if (!qr) fail.push('no Replay button');
    else {
      qr.click();
      await sleep(300);
      if (!box || box.style.display === 'none') fail.push('Replay button did not open Replay Studio');
      if (document.getElementById('replayModal')) fail.push('old replay window opened');
      window.lmReplayStudio('close');
      await sleep(100);
    }
    if (document.querySelector('script[src*="LMexpress/replay.js"]') || typeof window.BeforeReplay !== 'undefined' || typeof window.loadReplayFromWeb !== 'undefined') fail.push('old replay window still loaded');
  } finally {
    [key, oldKey].forEach(function (k) {
      var ix = window.RecordedProtocolArenas.indexOf(k);
      if (ix !== -1) window.RecordedProtocolArenas.splice(ix, 1);
      delete window.RecordedProtocol[k];
      delete window.RecordedArenasSpecifications[k];
    });
  }
  return { fail: fail, info: info };
})()
