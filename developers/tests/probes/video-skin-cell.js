// Video skins in the real game: a video skin sent with the cell (Expanding Land sends each player's
// skin URL with the cell) plays on it in Canvas2D and in WebGL (which hands a video cell to Canvas2D),
// and a Legend Mod player's video skin stops with Custom skins off, as its picture does. Until 3.700
// Canvas2D looked the video up by name only: a cell's own video URL showed nothing in either
// renderer, and video skins kept playing with Custom skins off in Canvas2D frames. Uses the named
// cells on screen; their skins, the skins map and the settings are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var A = window.application, L = window.legendmod, ms = window.defaultmapsettings;
  if (!A || !L || !ms || typeof _lmVideoSkins !== 'object' || typeof A.customSkinKey !== 'function') return { fail: ['video skin code missing'], info: info };
  var VURL = 'https://www.legendmod.ml/banners/testvideodyinglight.mp4';
  var keep = { webgl2Acceleration: ms.webgl2Acceleration, videoSkins: ms.videoSkins, customSkins: ms.customSkins, vanillaSkins: ms.vanillaSkins, noSkins: ms.noSkins };
  var shown = L.showCustomSkins;
  var picked = [], mapKeys = [];
  var mapBefore = Object.assign(Object.create(null), A.customSkinsMap);
  var vkBefore = Object.assign(Object.create(null), A.vanillaSkinKeys || {});
  /* the named player cells around the camera (one of them is drawn in every frame) */
  var pick = function () {
    var cx = L.viewX, cy = L.viewY, out = [];
    (L.cells || []).forEach(function (c) {
      if (!c || c.isFood || c.isVirus || c.isEjected || !c.targetNick || !String(c.targetNick).trim()) return;
      if (Math.abs(c.x - cx) < 900 && Math.abs(c.y - cy) < 500) out.push(c);
    });
    return out.slice(0, 12);
  };
  /* ms since the video was last drawn (Infinity: never) */
  var since = function () { var st = _lmVideoSkins.state(VURL); return st ? Date.now() - st.lastDraw : Infinity; };
  var drawnWithin = async function (ms0) { await sleep(ms0); return since() < 400; };
  try {
    for (var w = 0; w < 40 && !(picked = pick()).length; w++) await sleep(250);
    if (!picked.length) return { skip: 'no named cell on screen', info: info };
    info.cells = picked.length;
    picked.forEach(function (c) { c._lmProbeSkin = c.skin; });
    ms.videoSkins = true; ms.customSkins = true; ms.vanillaSkins = true; ms.noSkins = false; L.showCustomSkins = true;
    var modes = [['WebGL', true], ['Canvas2D', false]];
    for (var m = 0; m < modes.length; m++) {
      var label = modes[m][0];
      ms.webgl2Acceleration = modes[m][1];
      /* the cell's own video URL, nothing for its name */
      picked.forEach(function (c) { c.skin = VURL; });
      if (!(await drawnWithin(1500))) fail.push(label + ': a video skin sent with the cell is not played (last drawn ' + since() + ' ms ago)');
      /* a Legend Mod player's video skin (by name, the cell sends none), then Custom skins off */
      picked.forEach(function (c) { c.skin = null; A.cacheCustomSkin(c.targetNick, c.color, VURL); mapKeys.push(c.targetNick); });
      if (!(await drawnWithin(1500))) fail.push(label + ': a video skin set for the name is not played');
      ms.customSkins = false;
      await sleep(600);
      if (await drawnWithin(1200)) fail.push(label + ': Custom skins off still plays a custom video skin');
      ms.customSkins = true;
      picked.forEach(function (c) { A.clearOwnCustomSkin(c.targetNick, c.color); });
      await sleep(300);
    }
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    picked.forEach(function (c) { c.skin = c._lmProbeSkin; delete c._lmProbeSkin; });
    Object.keys(keep).forEach(function (k) { ms[k] = keep[k]; });
    L.showCustomSkins = shown;
    var map = A.customSkinsMap;
    Object.keys(map).forEach(function (k) { if (!(k in mapBefore)) delete map[k]; });
    Object.keys(mapBefore).forEach(function (k) { map[k] = mapBefore[k]; });
    if (A.vanillaSkinKeys) {
      Object.keys(A.vanillaSkinKeys).forEach(function (k) { if (!(k in vkBefore)) delete A.vanillaSkinKeys[k]; });
      Object.keys(vkBefore).forEach(function (k) { A.vanillaSkinKeys[k] = vkBefore[k]; });
    }
  }
  return { fail: fail, info: info };
})()
