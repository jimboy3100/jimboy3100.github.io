// Settings profiles: a profile with another Scan Trick "Snapped directions" shows it in the
// dropdown of Settings > Scan Trick (and Undo shows the old one again). The setting changed but the
// dropdown kept the old choice, so the menu said 16 while the game snapped to 8 directions.
// The profiles storage and the setting are put back.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMProfiles && document.getElementById('scanTrickDirections-select')); i++) await wait(250);
  var P = window.LMProfiles, sel = document.getElementById('scanTrickDirections-select');
  if (!P || !sel) return { fail: ['LMProfiles or the Scan Trick directions dropdown missing'], info: info };
  var keys = ['lmSettingsBackups', 'lmSettingsProfilesUndo', 'lmSettingsProfilesLast', 'ogarioSettings'];
  var saved = {};
  keys.forEach(function (k) { saved[k] = localStorage.getItem(k); });
  var S = window.legendmod5 || window.defaultmapsettings, was = S.scanTrickDirections;
  var other = was === 8 ? 32 : 8;
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}').scanTrickDirections; } catch (e) { return null; } };
  try {
    P.applySet({ s: { scanTrickDirections: other } }, 'Directions probe');
    await wait(100);
    info.applied = [S.scanTrickDirections, sel.value, stored(), legendmod.getScanTrickDirectionCount()];
    if (S.scanTrickDirections !== other) fail.push('profile: setting ' + S.scanTrickDirections + ', profile ' + other);
    if (Number(sel.value) !== other) fail.push('profile: the dropdown shows ' + sel.value + ', the setting is ' + S.scanTrickDirections);
    if (stored() !== other) fail.push('profile: stored ' + stored());
    P.undo();
    await wait(100);
    info.undone = [S.scanTrickDirections, sel.value, stored()];
    if (S.scanTrickDirections !== was || Number(sel.value) !== was) fail.push('Undo: setting ' + S.scanTrickDirections + ', dropdown ' + sel.value + ', before ' + was);
  } finally {
    S.scanTrickDirections = was;
    sel.value = String(was);
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
  }
  return { fail: fail, info: info };
})()
