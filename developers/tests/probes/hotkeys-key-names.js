// Hotkeys window, real key presses in a key field: Caps Lock, Pause, Num Lock, Scroll Lock and F13-F24
// get readable names (CAPSLOCK, PAUSE, NUMLOCK, SCROLLLOCK, F13...F24); they were bound as invisible
// control characters or as '|', '}', '~' (the field looked empty). Caps Lock bound that way runs its
// command in the game. Keys stored under the old names get the new ones on load. Close puts it back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hs = window.legendmod6;
  if (typeof window.__lmInput !== 'function') return { fail: fail, info: { skipped: 'no real input' } };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hkkn' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var press = async function (key, code, keyCode) { await send({ type: 'key', key: key, code: code, keyCode: keyCode }); await sleep(60); };
  var hkBefore = JSON.stringify(hotkeys), lsBefore = localStorage.getItem('ogarioHotkeys');
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  var F = 'hk-feed', field = document.getElementById(F);
  if (!field || !$('#hotkeys').is(':visible')) return { fail: ['hotkeys window did not open'] };
  var orig = hotkeysCommand[F].keyDown, runs = 0;
  try {
    var KEYS = [['Pause', 'Pause', 19, 'PAUSE'], ['NumLock', 'NumLock', 144, 'NUMLOCK'], ['ScrollLock', 'ScrollLock', 145, 'SCROLLLOCK'],
      ['F13', 'F13', 124, 'F13'], ['F15', 'F15', 126, 'F15'], ['F24', 'F24', 135, 'F24'], ['F12', 'F12', 123, 'F12'], ['CapsLock', 'CapsLock', 20, 'CAPSLOCK']];
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      field.focus();
      await press(k[0], k[1], k[2]);
      /* a busy page handles the key a little later */
      for (var w = 0; w < 20 && field.value !== k[3]; w++) await sleep(50);
      if (field.value !== k[3] || hotkeys[k[3]] !== F) fail.push(k[0] + ' was bound as ' + JSON.stringify(field.value) + ' (want ' + k[3] + ')');
    }
    /* Caps Lock (bound last) runs the command in the game */
    field.blur();
    hotkeysCommand[F].keyDown = function () { runs++; };
    await press('CapsLock', 'CapsLock', 20);
    info.capsRuns = runs;
    if (runs !== 1) fail.push('Caps Lock bound to feed ran it ' + runs + ' times');
    hotkeysCommand[F].keyDown = orig;
    /* stored under the old names: renamed on load */
    var keep = hotkeys;
    try {
      hotkeys = { '\u0014': 'hk-feed', 'CTRL+|': 'hk-split', '\u0087': 'hk-macroFeed', '\u0090': 'hk-split16', 'spec-messageKey': 'ENTER' };
      hs.migrateBrowserSpecificHotkeys();
      info.migrated = Object.keys(hotkeys).sort().join(',');
      if (hotkeys.CAPSLOCK !== 'hk-feed' || hotkeys['CTRL+F13'] !== 'hk-split' || hotkeys.F24 !== 'hk-macroFeed' || hotkeys.NUMLOCK !== 'hk-split16') fail.push('old key names not renamed: ' + JSON.stringify(hotkeys));
    } finally { hotkeys = keep; }
  } finally {
    hotkeysCommand[F].keyDown = orig;
    $('#close-hotkeys').trigger('click'); /* Close reverts the changes */
    await sleep(700);
    if (JSON.stringify(hotkeys) !== hkBefore) fail.push('Close did not put the keys back');
    if (localStorage.getItem('ogarioHotkeys') !== lsBefore) fail.push('the stored keys changed');
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
