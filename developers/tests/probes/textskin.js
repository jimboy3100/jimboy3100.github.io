// Skin canvases are made from animation frames (not in the load callback) and WebGL mass text uses
// one texture per cell; the text cache counts its bytes. Test entries are removed afterwards.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var R = window.drawRender, A = window.application;
  need('application', !!A);
  if (!A) return { fail: fail, info: info };
  ['_lmSkinJobAdd', '_lmSkinJobDropOne', '_lmSkinDecodeNext', '_lmSkinJobsSchedule', '_lmSkinJobRun', '_lmSkinCanvases'].forEach(function (f) { need(f, typeof A[f] === 'function'); });
  var url = 'https://probe.example/lm-textskin-probe.png';
  try {
    var src = document.createElement('canvas');
    src.width = src.height = 64;
    var sc = src.getContext('2d');
    sc.fillStyle = '#3a6';
    sc.fillRect(0, 0, 64, 64);
    var im = new Image();
    await new Promise(function (r) { im.onload = r; im.onerror = r; im.src = src.toDataURL(); });
    if (!A._pendingSkinLoads) A._pendingSkinLoads = new Set();
    A._pendingSkinLoads.add(url);
    A._lmSkinJobAdd(A.customSkinsCache, url, im, undefined, true);
    need('nothing published inside the load step', !A.customSkinsCache[url] && !A.customSkinsCache[url + '_cached']);
    for (var w = 0; w < 40 && !A.customSkinsCache[url + '_cached']; w++) await new Promise(function (r) { requestAnimationFrame(r); });
    var cv = A.customSkinsCache[url + '_cached'];
    need('published with its canvases from a frame', A.customSkinsCache[url] === im && !!cv && cv.width > 0 && !!A.customSkinsCache[url + '_cached2']);
    need('no longer pending', !A._pendingSkinLoads.has(url) && !(A._lmSkinJobMap && A._lmSkinJobMap.has(url)));
    info.skinFrames = w;
  } catch (e) {
    fail.push('skin job threw: ' + e.message);
  } finally {
    ['', '_cached', '_cached2', '_cached3', '_cached4'].forEach(function (s) { delete A.customSkinsCache[url + s]; });
    if (A._lmSkinUse) A._lmSkinUse.delete(url);
    if (window._skinMemoryCache) window._skinMemoryCache.delete(url);
  }
  info.webgl = !!(R && R.gl);
  if (R && R.gl && R.glTextProgram) {
    var cell = {};
    try {
      var bytes0 = R._lmTextBytes || 0, mass0 = R._lmMassBytes || 0;
      /* a fresh frame's redraw allowance (a game frame may have used this one up) */
      R._lmMassSpent = 0; R._lmMassBusy = false; R._lmMassForced = 0;
      var e1 = R._lmMassTexture(cell, '1234', 'bold 100px Ubuntu', '#ffffff', '#000000', 10);
      need('mass: its bytes counted', !!e1 && (R._lmMassBytes || 0) === mass0 + e1.w * e1.h * 4);
      R._lmMassSpent = 0; R._lmMassBusy = false; R._lmMassForced = 0;
      var e2 = R._lmMassTexture(cell, '1235', 'bold 100px Ubuntu', '#ffffff', '#000000', 10);
      need('mass: one texture per cell, rewritten in place', !!e1 && e1 === e2 && e1.txt === '1235' && e1.w > 0 && e1.h === 140);
      need('mass: text cache bytes untouched', (R._lmTextBytes || 0) === bytes0);
      var sum = 0;
      R.glTextCache.forEach(function (v) { sum += v.bytes || 0; });
      need('text cache: byte total matches its entries', sum === (R._lmTextBytes || 0));
      info.textBytes = R._lmTextBytes || 0;
      info.textCount = R.glTextCache.size;
      info.textBudget = R._lmTextBudget || 0;
      info.massBytes = R._lmMassBytes || 0;
      info.massCount = R._lmMassTex ? R._lmMassTex.size : 0;
    } catch (e) {
      fail.push('mass texture threw: ' + e.message);
    } finally {
      var me = R._lmMassTex && R._lmMassTex.get(cell);
      if (me) { try { if (R._lmTextRelease) R._lmTextRelease(me); else R.gl.deleteTexture(me.tex); } catch (e) { } R._lmMassTex.delete(cell); R._lmMassBytes -= me.bytes || 0; }
    }
  }
  return { fail: fail, info: info };
})()
