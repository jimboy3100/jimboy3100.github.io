// Replay Studio ?replay= links and imports in the real page: two downloads finishing out of
// order open only the newer one; a live game played meanwhile is not left (the usual notice
// instead); closing the Studio cancels a download; the server stored in a file wins over its
// name and can be changed; an import over the size budget is refused before it is read.
// legendmod.play is set for the test, so nothing is ever joined (that would leave the server).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.lmReplayStudio !== 'function') return { fail: ['lmReplayStudio loader missing'] };
  window.lmReplayStudio('close');
  for (var w = 0; w < 50 && !(window.LMReplayStudio && window.LMReplayStudio.run); w++) await sleep(100);
  var RS = window.LMReplayStudio;
  if (!RS || !RS.lib || !RS.lib.LIMITS) return { fail: ['Replay Studio without size budgets'] };
  var l = window.legendmod, realFetch = window.fetch, wasPlay = l.play, token = $('#server-token').val();
  var calls = [], toasts = [], keys = ['one.lm', 'two.lm', 'three.lm', 'big.lm'];
  /* the recording of the live connection stores the server it comes from */
  var curRec = window.RecordedProtocol[window.temporaryRecordedProtocol];
  info.recType = curRec && curRec._lm ? [curRec._lm.p, l.serverType] : null;
  if (window._lmRecLive && curRec && curRec._lm && curRec._lm.p !== l.serverType) fail.push('recording type ' + curRec._lm.p + ' != ' + l.serverType);
  var tz = window.toastr, keepT = {};
  ['info', 'error', 'warning', 'success'].forEach(function (k) { keepT[k] = tz[k]; tz[k] = function (m) { toasts.push(k + ':' + m); }; });
  /* a replay file of the current format: 30 packets, times, the server it came from */
  var pk = [], t = [];
  for (var i = 0; i < 30; i++) { pk.push(new DataView(new Uint8Array([199, i]).buffer)); t.push(i * 40); }
  var file = RS.lib.lmFileParts(pk, [Date.now(), ':ffa', 'EU', 'probe'], RS.lib.makeSidecar({ t: t, s: [], e: [], c: [], p: 'expandingland' }, 30)).join('');
  window.fetch = function (url, opt) {
    if (String(url).indexOf('https://probe.invalid/') !== 0) return realFetch.apply(this, arguments);
    return new Promise(function (res, rej) {
      var c = { url: String(url), opt: opt || {}, res: function () { res(new Response(file)); } };
      calls.push(c);
      if (c.opt.signal) c.opt.signal.addEventListener('abort', function () { rej(new DOMException('aborted', 'AbortError')); });
    });
  };
  try {
    l.play = true;
    window.lmReplayStudio('url', ['https://probe.invalid/a/one.lm']);
    window.lmReplayStudio('url', ['https://probe.invalid/b/two.lm', 3, 10]);
    await sleep(50);
    if (calls.length !== 2) fail.push('downloads started: ' + calls.length);
    else {
      calls[1].res();
      await sleep(300);
      calls[0].res();
      await sleep(300);
      var st = RS.state();
      info.state = { key: st.key, pos: st.pos, stopAt: st.stopAt, driving: st.driving };
      if (window.RecordedProtocol['one.lm']) fail.push('the older link opened after the newer one');
      if (!calls[0].opt.signal || !calls[0].opt.signal.aborted) fail.push('older download not aborted');
      if (st.key !== 'two.lm') fail.push('newer link not shown: ' + st.key);
      if (st.pos !== 3 || st.stopAt !== 11) fail.push('link Start/End not kept: ' + st.pos + ' ' + st.stopAt);
      if (st.driving || $('#server-token').val() !== token) fail.push('the live game was left without asking');
      if (!toasts.some(function (m) { return m.indexOf('info:') === 0 && m.indexOf(lmT('modules.replaystudio.leave').slice(0, 12)) !== -1; })) fail.push('no leave notice: ' + toasts.join(' | '));
      /* the file says Expanding Land, its name would guess agar.io */
      var box = document.getElementById('lm-rs');
      var ps = box && Array.prototype.filter.call(box.querySelectorAll('select'), function (s) { return s.title === lmT('pkg.n56.proto'); })[0];
      if (!ps) fail.push('no server list');
      else {
        if (ps.value !== 'expandingland') fail.push('stored server not shown: ' + ps.value);
        if (window.lmReplayGuessType('two.lm') !== 'agario') fail.push('name guess ' + window.lmReplayGuessType('two.lm'));
        ps.value = 'garix';
        ps.dispatchEvent(new Event('change'));
        if ((window.RecordedProtocol['two.lm']._lmSide || {}).p !== 'garix') fail.push('server choice not kept');
        ps.value = '';
        ps.dispatchEvent(new Event('change'));
        if (ps.options[0].textContent.indexOf('Agar.io') === -1) fail.push('guess option ' + ps.options[0].textContent);
      }
    }
    /* closing the Studio cancels a download */
    window.lmReplayStudio('url', ['https://probe.invalid/c/three.lm']);
    await sleep(50);
    var c3 = calls[2];
    window.lmReplayStudio('close');
    if (!c3 || !c3.opt.signal || !c3.opt.signal.aborted) fail.push('close did not abort the download');
    if (c3) c3.res();
    await sleep(300);
    if (window.RecordedProtocol['three.lm']) fail.push('cancelled link opened');
    if (document.getElementById('lm-rs').style.display !== 'none') fail.push('cancelled link opened the Studio');
    /* a link that is not https: refused without a download */
    var nCalls = calls.length;
    window.lmReplayStudio('url', ['http://probe.invalid/x.lm']);
    window.lmReplayStudio('url', ['javascript:alert(1)//x.lm']);
    await sleep(50);
    if (calls.length !== nCalls) fail.push('bad link downloaded');
    /* an import over the file budget is refused before it is read */
    var LIM = RS.lib.LIMITS, keepF = LIM.fileBytes, before = toasts.length;
    LIM.fileBytes = 100;
    window.lmReplayStudio('open');
    var fileIn = document.querySelector('#lm-rs input[type=file]');
    var dt = new DataTransfer();
    dt.items.add(new File([file], 'big.lm', { type: 'text/plain' }));
    fileIn.files = dt.files;
    fileIn.dispatchEvent(new Event('change'));
    await sleep(300);
    LIM.fileBytes = keepF;
    if (window.RecordedProtocol['big.lm']) fail.push('oversized file opened');
    if (!toasts.slice(before).some(function (m) { return m.indexOf('error:') === 0 && m.indexOf(lmT('pkg.n56.tooBig').slice(0, 10)) !== -1; })) fail.push('no too large message: ' + toasts.slice(before).join(' | '));
    window.lmReplayStudio('close');
  } finally {
    l.play = wasPlay;
    window.fetch = realFetch;
    Object.keys(keepT).forEach(function (k) { tz[k] = keepT[k]; });
    keys.forEach(function (k) {
      var ix = window.RecordedProtocolArenas.indexOf(k);
      if (ix !== -1) window.RecordedProtocolArenas.splice(ix, 1);
      delete window.RecordedProtocol[k];
      delete window.RecordedArenasSpecifications[k];
    });
    for (w = 0; w < 20; w++) {
      var list = await RS.store.list(), mine = list.filter(function (m) { return keys.indexOf(m.key) !== -1; });
      for (var q = 0; q < mine.length; q++) await RS.store.remove(mine[q].id);
      if (mine.length) break;
      await sleep(100);
    }
  }
  return { fail: fail, info: info };
})()
