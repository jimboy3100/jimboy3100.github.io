// Cell skins: one lookup (application.customSkinKey) for the WebGL batch, Canvas2D and the
// teamboard. The WebGL batch had its own copy that ignored loadSkin's URL aliases (a skin fetched
// from another address: jimboy3100.github.io asked on www.legendmod.ml, mirror fallbacks) and a
// cell's own skin URL, so skins sent over the chat socket showed only when a frame fell back to
// Canvas2D (e.g. two cells overlapping) and on the teamboard.
(async () => {
  var fail = [], info = {};
  var A = window.application;
  if (!A || typeof A.customSkinKey !== 'function') return { fail: ['application.customSkinKey missing'], info: info };
  var orig = 'https://example.invalid/lm-probe-orig.png', alias = 'https://example.invalid/lm-probe-alias.png';
  var saved = { map: A.customSkinsMap['LMProbeNick'], alias: A._skinUrlAlias && A._skinUrlAlias[orig] };
  try {
    A._skinUrlAlias = A._skinUrlAlias || {};
    A._skinUrlAlias[orig] = alias;
    var img = document.createElement('canvas'); img.width = img.height = 8;
    A.customSkinsCache[alias] = img;
    A.customSkinsMap['LMProbeNick'] = orig;
    var k = A.customSkinKey('LMProbeNick', '#ff0000');
    info.aliasKey = k;
    if (k !== alias) fail.push('a chat-socket skin loaded from another address: key ' + k + ', expected the alias');
    if (A.getCustomSkin('LMProbeNick', '#ff0000') !== img) fail.push('getCustomSkin does not return the aliased image');
    /* a cell whose server gives its skin as a URL */
    var own = 'https://example.invalid/lm-probe-own.png';
    A.customSkinsCache[own] = img;
    var k2 = A.customSkinKey('SomeoneElse', '#00ff00', own);
    if (k2 !== own) fail.push('a cell\'s own skin URL: key ' + k2);
    if (A.customSkinKey('', '#00ff00', own) !== null) fail.push('a cell without a name got a skin');
  } finally {
    if (saved.map === undefined) delete A.customSkinsMap['LMProbeNick']; else A.customSkinsMap['LMProbeNick'] = saved.map;
    if (saved.alias === undefined) delete A._skinUrlAlias[orig];
    delete A.customSkinsCache[alias];
    delete A.customSkinsCache['https://example.invalid/lm-probe-own.png'];
  }
  return { fail: fail, info: info };
})()
