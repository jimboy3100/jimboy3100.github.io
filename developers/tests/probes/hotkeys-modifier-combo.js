// Hotkeys window, real key presses in a key field: Alt + J and Ctrl + U bind ALT+J / CTRL+U and the
// commands that have the bare Alt or Ctrl keep it (the first half of the press, Alt or Ctrl alone,
// was bound to the field at once and took it from them: Autoplay lost ALT and got J back). A bare
// Alt or Ctrl pressed and let go alone still binds ALT / CTRL, like a bare Shift; Shift + left click
// binds the left button and the Shift command keeps SHIFT. Close puts everything back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hs = window.legendmod6;
  if (typeof window.__lmInput !== 'function') return { fail: fail, info: { skipped: 'no real input' } };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hkmc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var keys = function (cmd) { return hs.keysOf(cmd).join(' / '); };
  var input = async function (q) { await send(q); await sleep(60); };
  var MOD = { ALT: ['Alt', 'AltLeft', 18, 'alt'], CTRL: ['Control', 'ControlLeft', 17, 'ctrl'] };
  var combo = async function (mod, key, code, keyCode) {
    var m = MOD[mod], o = {};
    o[m[3]] = true;
    await input(Object.assign({ type: 'keydown', key: m[0], code: m[1], keyCode: m[2] }, o));
    if (key) await input(Object.assign({ type: 'key', key: key, code: code, keyCode: keyCode }, o));
    await input({ type: 'keyup', key: m[0], code: m[1], keyCode: m[2] });
  };
  var hkBefore = JSON.stringify(hotkeys), lsBefore = localStorage.getItem('ogarioHotkeys');
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  var F = 'hk-feed', field = document.getElementById(F);
  if (!field || !$('#hotkeys').is(':visible')) return { fail: ['hotkeys window did not open'] };
  try {
    /* bare modifiers on two other commands, as a player may have them */
    hs.setHotkey('ALT', 'hk-Autoplay');
    hs.setHotkey('CTRL', 'hk-GhostCellsInfo');
    field.focus();
    await combo('ALT', 'j', 'KeyJ', 74);
    info.altJ = keys(F) + ' | Autoplay ' + keys('hk-Autoplay');
    if (keys(F) !== 'ALT+J') fail.push('Alt + J bound ' + JSON.stringify(keys(F)));
    if (keys('hk-Autoplay') !== 'ALT') fail.push('Alt + J took ALT from Autoplay: it has ' + JSON.stringify(keys('hk-Autoplay')));
    field.focus();
    await combo('CTRL', 'u', 'KeyU', 85);
    info.ctrlU = keys(F) + ' | Ghost ' + keys('hk-GhostCellsInfo');
    if (keys(F) !== 'CTRL+U') fail.push('Ctrl + U bound ' + JSON.stringify(keys(F)));
    if (keys('hk-GhostCellsInfo') !== 'CTRL') fail.push('Ctrl + U took CTRL from Ghost cells info: it has ' + JSON.stringify(keys('hk-GhostCellsInfo')));
    /* a bare modifier alone still binds it (and moves it from the other command) */
    field.focus();
    await combo('ALT');
    if (keys(F) !== 'ALT') fail.push('a bare Alt bound ' + JSON.stringify(keys(F)));
    if (hotkeys['ALT'] !== F) fail.push('a bare Alt did not move ALT to the field');
    field.focus();
    await combo('CTRL');
    if (keys(F) !== 'CTRL') fail.push('a bare Ctrl bound ' + JSON.stringify(keys(F)));
    /* Shift + left click: the left button, SHIFT stays with its command */
    if (!mobile) {
      var shiftCmd = hotkeys['SHIFT'];
      var r = field.getBoundingClientRect(), x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
      if (document.elementFromPoint(x, y) === field) {
        field.focus();
        await input({ type: 'keydown', key: 'Shift', code: 'ShiftLeft', keyCode: 16, shift: true });
        await input({ type: 'mousedown', x: x, y: y, button: 'left', shift: true });
        await input({ type: 'mouseup', x: x, y: y, button: 'left', shift: true });
        await input({ type: 'keyup', key: 'Shift', code: 'ShiftLeft', keyCode: 16 });
        info.shiftClick = keys(F);
        if (keys(F) !== 'CTRL / MOUSE LEFT') fail.push('Shift + left click bound ' + JSON.stringify(keys(F)));
        if (hotkeys['SHIFT'] !== shiftCmd) fail.push('Shift + left click moved SHIFT from ' + shiftCmd + ' to ' + hotkeys['SHIFT']);
      } else info.shiftClick = 'skipped (field covered)';
    }
  } finally {
    field.blur();
    $('#close-hotkeys').trigger('click'); /* Close reverts the changes */
    await sleep(700);
    if (JSON.stringify(hotkeys) !== hkBefore) fail.push('Close did not put the keys back');
    if (localStorage.getItem('ogarioHotkeys') !== lsBefore) fail.push('the stored keys changed');
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
