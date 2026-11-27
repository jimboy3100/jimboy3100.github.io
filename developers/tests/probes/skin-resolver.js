// Skin asset resolver in the real page: ogario/skinresolver.js and its registry are loaded before the
// engine, VanillaSkinUrlMap comes from its one builder, and skins asked for under several spellings
// (other host names of this site, raw / encoded space, identical copies) load once: one request, one
// image under one key, one canvas (cacheSkin) and, with WebGL, one texture layer for all of them.
// The "8 ball" flag (a file name with a space) loads; it was asked as 8_ball.png (404) before.
(async () => {
  var fail = [], info = {};
  var R = window.LMSkinResolver, A = window.application, D = window.drawRender;
  if (!R || !(R.version >= 1)) return { fail: ['skin resolver not loaded'], info: info };
  if (!R.registryLoaded()) fail.push('skin registry not loaded');
  if (!A || typeof A.loadSkin !== 'function') return { fail: fail.concat(['application.loadSkin missing']), info: info };
  var map = window.VanillaSkinUrlMap;
  info.mapKeys = map ? Object.keys(map).length : 0;
  if (window.EquippableSkins && map) {
    if (map['%fungi_warlord'] !== R.vanilla('fungi_warlord.png')) fail.push('VanillaSkinUrlMap not built by the resolver: ' + map['%fungi_warlord']);
    if (Object.getPrototypeOf(map) !== null) fail.push('VanillaSkinUrlMap has a prototype');
  }
  var L = 'https://www.legendmod.ml/';
  var groups = [
    [L + 'agario/live/flags/8 ball.png', L + 'agario/live/flags/8%20ball.png', 'https://jimboy3100.github.io/agario/live/flags/8%20ball.png'],
    ['https://jimboy3100.github.io/lowresskins/1up-custom-skin.png', 'https://legendmod.ml/lowresskins/1up-custom-skin.png', L + 'lowresskins/1up-custom-skin.png']
  ];
  var keys = groups.map(function (g) { return R.key(g[0]); });
  groups.forEach(function (g, i) { g.forEach(function (u) { if (R.key(u) !== keys[i]) fail.push('different keys for one picture: ' + u); }); });
  var C = A.customSkinsCache;
  keys.forEach(function (k) { delete C[k]; delete C[k + '_cached']; delete C[k + '_cached2']; if (A._failedSkinURLs) delete A._failedSkinURLs[k]; });
  var t0 = performance.now();
  groups.forEach(function (g) { g.forEach(function (u) { A.loadSkin(C, u, false, true); }); });
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 80 && !keys.every(function (k) { return C[k] && C[k + '_cached']; }); w++) await sleep(100);
  info.loadMs = Math.round(performance.now() - t0);
  keys.forEach(function (k) {
    var img = C[k], cv = C[k + '_cached'];
    if (!img || !(img.naturalWidth || img.width)) { fail.push('not loaded: ' + k); return; }
    if (!cv || !cv.width) { fail.push('no canvas (cacheSkin) for ' + k); return; }
    try {
      var d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, lit = 0;
      for (var i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) lit++;
      if (!lit) fail.push('canvas of ' + k + ' is empty');
    } catch (e) { fail.push('canvas of ' + k + ' unreadable (tainted?): ' + e.message); }
  });
  /* requests: each picture at most once (none when it came from the skin storage) */
  var ent = performance.getEntriesByType('resource').filter(function (e) { return e.startTime >= t0 - 1 && /8%20ball|8_ball|1up-custom-skin/.test(e.name); });
  info.requests = ent.map(function (e) { return e.name.replace(/^https:\/\/[^/]+\//, ''); });
  if (ent.some(function (e) { return /8_ball/.test(e.name); })) fail.push('8 ball asked as 8_ball.png');
  var per = {};
  ent.forEach(function (e) { var n = /8%20ball/.test(e.name) ? '8ball' : '1up'; per[n] = (per[n] || 0) + 1; });
  if ((per['8ball'] || 0) > 1 || (per['1up'] || 0) > 1) fail.push('a picture was requested more than once: ' + JSON.stringify(info.requests));
  /* the aliases hold no copy of the image */
  groups.forEach(function (g, i) { g.forEach(function (u) { if (u !== keys[i] && C.hasOwnProperty(u)) fail.push('second cache entry under ' + u); }); });
  /* WebGL: one texture layer for the picture, none for its other spellings */
  info.webgl = !!(D && D.gl);
  if (D && D.gl && typeof D.uploadSkinTexture === 'function') {
    keys.forEach(function (k) { if (C[k + '_cached']) D.uploadSkinTexture(k, C[k + '_cached']); });
    for (var w2 = 0; w2 < 40 && !keys.every(function (k) { return typeof (D.glSkinMap || {})[k] === 'number'; }); w2++) await sleep(100);
    info.layers = keys.map(function (k) { return (D.glSkinMap || {})[k]; });
    keys.forEach(function (k, i) {
      if (typeof (D.glSkinMap || {})[k] !== 'number') fail.push('no WebGL layer for ' + k);
      groups[i].forEach(function (u) { if (u !== k && D.glSkinMap && D.glSkinMap[u] !== undefined) fail.push('second WebGL layer for ' + u); });
    });
  }
  return { fail: fail, info: info };
})()
