// Radial menu held on a key (a real J key press) while the window loses focus: the ring closes and the
// command pointed at does not run. Until 3.696 the blur released the held key through the ring's
// release and ran it. Letting the key go after a blur runs nothing either. Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var i = 0; i < 40 && !(window.LMSmallTools && window.LMSmallTools.radialOpen); i++) await sleep(250);
  var T = window.LMSmallTools;
  if (!T || typeof hotkeys !== 'object' || !hotkeysCommand['hk-radialMenu']) return { fail: ['small tools or hotkeys missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'rb' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (id) { if (id === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var key = function (type) { return send({ type: type, key: 'j', code: 'KeyJ', keyCode: 74 }); };
  var stored = null;
  try { stored = localStorage.getItem('lmRadialMenu'); } catch (e) { }
  var hadJ = Object.prototype.hasOwnProperty.call(hotkeys, 'J'), oldJ = hotkeys.J;
  var ov = document.getElementById('overlays'), ovDisp = ov ? ov.style.display : '';
  var ran = 0;
  try {
    hotkeysCommand['hk-zzProbe'] = { label: 'Probe', defaultKey: '', keyDown: function () { ran++; }, keyUp: null, type: 'normal' };
    localStorage.setItem('lmRadialMenu', JSON.stringify({ v: 1, items: ['hk-zzProbe', 'hk-showMass'] }));
    hotkeys.J = 'hk-radialMenu';
    if (ov) ov.style.display = 'none';
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    await key('keydown');
    await sleep(50);
    var rd = document.getElementById('lm-radial');
    info.open = !!rd;
    if (!rd) fail.push('holding J did not open the radial menu');
    else {
      var it = rd.querySelector('.lm-rd-item').getBoundingClientRect();
      T.radialPoint(it.left + it.width / 2, it.top + it.height / 2);
      await sleep(400);
      window.dispatchEvent(new Event('blur'));
      await sleep(30);
      info.ranAfterBlur = ran;
      if (ran) fail.push('the window blur ran the command pointed at');
      if (document.getElementById('lm-radial') || T.radialOpen()) fail.push('the ring stayed open after the window blur');
      await key('keyup');
      await sleep(30);
      if (ran) fail.push('letting J go after the blur ran the command');
      /* the release itself still runs the command pointed at */
      await key('keydown');
      await sleep(50);
      rd = document.getElementById('lm-radial');
      if (rd) {
        it = rd.querySelector('.lm-rd-item').getBoundingClientRect();
        T.radialPoint(it.left + it.width / 2, it.top + it.height / 2);
        await sleep(400);
      }
      await key('keyup');
      await sleep(30);
      info.ranAfterRelease = ran;
      if (ran !== 1) fail.push('letting J go no longer runs the command pointed at');
    }
  } catch (e) { fail.push('radial blur: ' + e); }
  finally {
    try { T.radialClose(); } catch (e) { }
    delete hotkeysCommand['hk-zzProbe'];
    if (hadJ) hotkeys.J = oldJ; else delete hotkeys.J;
    if (ov) ov.style.display = ovDisp;
    try { if (stored == null) localStorage.removeItem('lmRadialMenu'); else localStorage.setItem('lmRadialMenu', stored); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
