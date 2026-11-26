// The skin options in the real page, by the Settings switch and by the hotkey: Vanilla skins off
// hides the agar.io skins (flag names, skin ids) and keeps every custom skin, the own one included
// (setVanillaSkins emptied the skins map, so the own custom skin was gone until the next spawn and
// the agar.io skins came back with the next cell update); the "Toggle skins" hotkey's vanilla-only
// mode shows the agar.io skins (it showed none); the choice is saved for the next load.
(async () => {
  var fail = [], info = {};
  var A = window.application, L = window.legendmod, ms = window.defaultmapsettings;
  if (!A || !L || !ms || typeof A.customSkinKey !== 'function' || typeof L.vanillaskins !== 'function') return { fail: ['skin functions missing'], info: info };
  var keys = ['customSkins', 'vanillaSkins', 'ownVanillaSkin', 'noSkins'];
  var before = {}; keys.forEach(function (k) { before[k] = ms[k]; });
  var showBefore = L.showCustomSkins, mapBefore = Object.assign({}, A.customSkinsMap), vkBefore = Object.assign({}, A.vanillaSkinKeys || {});
  var vmapBefore = window.VanillaSkinUrlMap;
  var C_OWN = 'https://example.invalid/lm-probe-own-custom.png', V_ID = 'https://example.invalid/lm-probe-vanilla.png';
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}'); } catch (e) { return {}; } };
  var box = function (id) { return document.getElementById(id); };
  var flip = function (id, on) { var el = box(id); el.checked = on; el.dispatchEvent(new Event('change', { bubbles: true })); };
  /* what a renderer draws for a cell: its gate, then the one lookup */
  var gate = function () { return typeof lmSkinsShown === 'function' ? lmSkinsShown() : !!(ms.customSkins && L.showCustomSkins); }; /* (older versions: the old gate) */
  var draw = function (nick, skin, own) { return gate() ? A.customSkinKey(nick, '#00ff00', skin, false, own) : null; };
  function seed() {
    A.cacheCustomSkin('LMProbeMe', '#00ff00', C_OWN);         /* own custom skin, as onPlayerSpawn */
    L.vanillaskins('Albania', null, '#ff0000');                /* name skin (flag or free agar.io skin) */
    L.vanillaskins('LMProbeSpider', '%lmprobe', '#ff0000');    /* agar.io skin id */
  }
  try {
    window.VanillaSkinUrlMap = Object.assign({}, vmapBefore || {}, { '%lmprobe': V_ID });
    if (!box('vanillaSkins') || !box('customSkins')) throw new Error('skin checkboxes missing');
    flip('noSkins', false); flip('customSkins', true); flip('vanillaSkins', true); flip('ownVanillaSkin', false);
    seed();
    var flag = draw('Albania', null, false);
    if (!flag) fail.push('both on: no name skin (flag / free skin) for Albania');
    if (draw('LMProbeSpider', '%lmprobe', false) !== V_ID) fail.push('both on: no agar.io skin for a skin id');
    if (draw('LMProbeMe', '%lmprobe', true) !== C_OWN) fail.push('both on: own custom skin not drawn');

    /* the Settings switch */
    flip('vanillaSkins', false);
    seed();
    info.settingsOff = { albania: draw('Albania', null, false), id: draw('LMProbeSpider', '%lmprobe', false), own: draw('LMProbeMe', '%lmprobe', true) };
    if (ms.vanillaSkins !== false) fail.push('Settings switch did not turn Vanilla skins off');
    if (info.settingsOff.albania || info.settingsOff.id) fail.push('Settings: Vanilla skins off still draws agar.io skins ' + JSON.stringify(info.settingsOff));
    if (info.settingsOff.own !== C_OWN) fail.push('Settings: Vanilla skins off lost the own custom skin');
    if (A.customSkinsMap.LMProbeMe !== C_OWN) fail.push('Settings: Vanilla skins off emptied the skins map');
    if (stored().vanillaSkins !== false) fail.push('Vanilla skins off is not saved');
    flip('ownVanillaSkin', true);
    flip('customSkins', false);
    if (draw('LMProbeMe', '%lmprobe', true) !== V_ID) fail.push('Own vanilla skin when no custom: the own agar.io skin is not drawn');
    if (draw('LMProbeSpider', '%lmprobe', false) !== null) fail.push('Own vanilla skin when no custom: other players got agar.io skins');
    flip('ownVanillaSkin', false); flip('customSkins', true); flip('vanillaSkins', true);

    /* the hotkey: both -> custom only -> vanilla only -> both */
    var hk = typeof hotkeysCommand === 'object' && hotkeysCommand && hotkeysCommand['hk-toggleSkins'];
    if (!hk) throw new Error('hk-toggleSkins missing');
    hk.keyDown();
    seed();
    if (!(ms.customSkins === true && ms.vanillaSkins === false && box('vanillaSkins').checked === false)) fail.push('hotkey 1: not custom only');
    if (draw('Albania', null, false) !== null || draw('LMProbeSpider', '%lmprobe', false) !== null) fail.push('hotkey 1 (custom only): agar.io skins still drawn');
    if (draw('LMProbeMe', '%lmprobe', true) !== C_OWN) fail.push('hotkey 1 (custom only): own custom skin lost');
    if (stored().vanillaSkins !== false || stored().customSkins !== true) fail.push('hotkey 1: not saved');
    hk.keyDown();
    if (!(ms.customSkins === false && ms.vanillaSkins === true)) fail.push('hotkey 2: not vanilla only');
    if (draw('LMProbeSpider', '%lmprobe', false) !== V_ID || !draw('Albania', null, false)) fail.push('hotkey 2 (vanilla only): agar.io skins not drawn');
    if (draw('LMProbeMe', '%lmprobe', true) !== V_ID) fail.push('hotkey 2 (vanilla only): the own cell does not show its agar.io skin');
    hk.keyDown();
    if (!(ms.customSkins === true && ms.vanillaSkins === true)) fail.push('hotkey 3: not both');
    if (draw('LMProbeMe', '%lmprobe', true) !== C_OWN) fail.push('hotkey 3 (both): own custom skin lost');
  } catch (e) {
    fail.push(String(e && e.stack || e).split('\n').slice(0, 3).join(' | '));
  } finally {
    try {
      keys.forEach(function (k) { if (box(k) && box(k).checked !== !!before[k]) flip(k, !!before[k]); ms[k] = before[k]; });
      L.showCustomSkins = showBefore;
      A.customSkinsMap = mapBefore; A.vanillaSkinKeys = vkBefore;
      window.VanillaSkinUrlMap = vmapBefore;
      if (A.saveSettings) A.saveSettings(ms, 'ogarioSettings');
    } catch (e) { fail.push('restore: ' + e); }
  }
  return { fail: fail, info: info };
})()
