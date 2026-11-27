// Hotkeys window: no clear (x) button next to the key fields; DEL in a field clears its key, as the
// window's own instructions say, and Close puts it back. The key list sits between the buttons and
// the instructions.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var keyOf = function (cmd) { for (var k in hotkeys) if (k !== 'spec-messageKey' && hotkeys[k] === cmd) return k; return ''; };
  var key = function (el, type, code) {
    var e = new KeyboardEvent(type, { bubbles: true, cancelable: true });
    Object.defineProperty(e, 'keyCode', { get: function () { return code; } });
    Object.defineProperty(e, 'which', { get: function () { return code; } });
    el.dispatchEvent(e);
  };
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  var cfg = document.getElementById('hotkeys-cfg');
  if (!cfg || !$('#hotkeys').is(':visible')) return { fail: ['hotkeys window did not open'] };
  var cmd = 'hk-feed', bound = keyOf(cmd);
  try {
    info.rows = $('#hotkeys-cfg .custom-key-in').length;
    if (!info.rows) fail.push('no key fields');
    if ($('#hotkeys .lm-hk-clear').length) fail.push($('#hotkeys .lm-hk-clear').length + ' clear buttons still in the Hotkeys window');
    var box = cfg.getBoundingClientRect();
    var inst = document.getElementById('hotkeys-inst'), menu = document.getElementById('hotkeys-menu');
    if (inst && box.bottom > inst.getBoundingClientRect().top + 1) fail.push('the key list runs ' + Math.round(box.bottom - inst.getBoundingClientRect().top) + 'px under the instructions');
    if (menu && box.top < menu.getBoundingClientRect().bottom - 1) fail.push('the key list starts ' + Math.round(menu.getBoundingClientRect().bottom - box.top) + 'px under the buttons');
    var field = document.getElementById(cmd);
    if (!field) fail.push('no field ' + cmd);
    else if (bound) {
      field.focus();
      key(field, 'keydown', 46); key(field, 'keyup', 46);
      info.after = keyOf(cmd) + '/' + field.value;
      if (keyOf(cmd) !== '' || field.value !== '') fail.push('DEL did not clear ' + bound + ': ' + info.after);
    } else info.skipped = cmd + ' has no key';
  } finally {
    $('#close-hotkeys').trigger('click'); /* Close reverts the change */
    await sleep(700);
    if (keyOf(cmd) !== bound) fail.push('Close did not put ' + bound + ' back: ' + keyOf(cmd));
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
