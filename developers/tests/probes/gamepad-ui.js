// Gamepad buttons are bound in the Hotkeys window: a key field shows its pad buttons ('PAD A') next
// to its key, a pad button pressed on a focused field goes to that command and is saved by itself
// (Close keeps it), and the instructions say how. The Gamepad window opens from the
// Hotkeys window, fits the screen, has only the sensitivity and test tabs and closes again.
// Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var G = window.LMGamepad, hs = window.legendmod6;
  if (!G) return { fail: ['window.LMGamepad missing (ogario/gamepad.js not loaded)'] };
  if (hotkeysCommand['hk-gamepadWindow']) fail.push('hotkey hk-gamepadWindow still there (removed)');
  var b = $('#hotkeys #lm-hk-controls #lm-gamepad-btn');
  if (!b.length) return { fail: fail.concat(['no Gamepad button in the Hotkeys window']) };
  var stored = null;
  try { stored = localStorage.getItem('lmGamepad'); } catch (e) { }
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  /* the buttons in the key fields */
  var m0 = G.getMap(), aCmd = m0[0];
  var fA = /^hk-/.test(aCmd) ? document.getElementById(aCmd) : null;
  info.fieldA = fA ? fA.value : '';
  if (fA && fA.value.split(' / ').indexOf('PAD A') < 0) fail.push('the field of ' + aCmd + ' does not show PAD A: ' + fA.value);
  if (!$('#hotkeys-inst [data-i18n="pkg.rm3w.hkInstPad"]').text()) fail.push('no instruction line for the gamepad buttons');
  var F = document.getElementById('hk-feed');
  if (!F) fail.push('no hk-feed field');
  else {
    /* what a press of B does while the field has the focus (gamepad.js calls setHotkey) */
    F.focus();
    hs.setHotkey('PAD B', 'hk-feed');
    await sleep(30);
    if (G.getMap()[1] !== 'hk-feed') fail.push('PAD B not on hk-feed after binding');
    if (F.value.split(' / ').indexOf('PAD B') < 0) fail.push('the hk-feed field does not show PAD B: ' + F.value);
    var fOld = /^hk-/.test(m0[1]) ? document.getElementById(m0[1]) : null;
    if (fOld && fOld.value.indexOf('PAD B') >= 0) fail.push('the old command of B still shows it');
    F.blur();
    await sleep(800);
    var gpSt = null;
    try { gpSt = JSON.parse(localStorage.getItem('lmGamepad')); } catch (e) { }
    if (!gpSt || !gpSt.map || gpSt.map[1] !== 'hk-feed') fail.push('the bound button was not saved by itself');
    /* Close keeps the buttons */
    $('#close-hotkeys').trigger('click');
    await sleep(600);
    if (G.getMap()[1] !== 'hk-feed') fail.push('Close did not keep B on hk-feed: ' + G.getMap()[1]);
    G.restore(m0);
    hs.showAllKeys();
    $('.hotkeys-link').first().trigger('click');
    await sleep(700);
  }
  /* the Gamepad window: sensitivity and test only */
  $('#hotkeys #lm-hk-controls #lm-gamepad-btn').first().trigger('click');
  var t0 = Date.now();
  while (!document.getElementById('lm-gp-modal') && Date.now() - t0 < 8000) await sleep(100);
  var md = document.getElementById('lm-gp-modal');
  if (!md) return { fail: fail.concat(['window did not open (modules/gamepad-ui.js)']) };
  await sleep(100);
  var r = md.getBoundingClientRect();
  info.size = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
  if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('window outside the screen: ' + info.size);
  if (r.width > 720 || r.height > innerHeight - 15) fail.push('window too large: ' + info.size);
  var x = document.getElementById('lm-gp-close').getBoundingClientRect();
  if (x.width < 30 || x.height < 30) fail.push('close button too small for touch');
  if (md.querySelectorAll('select[id^="lm-gp-btn-"]').length || document.getElementById('lm-gp-tab-buttons') || document.getElementById('lm-gp-tab-profiles')) fail.push('the Gamepad window still has the button map or the profiles tab');
  info.tabs = [].map.call(md.querySelectorAll('[data-tab]'), function (e) { return e.getAttribute('data-tab'); }).join();
  if (!document.getElementById('lm-gp-gamepadMoveRange')) fail.push('sensitivity sliders missing (first tab)');
  var tt = document.getElementById('lm-gp-tab-test');
  if (!tt) fail.push('test tab missing');
  else { tt.click(); if (!document.getElementById('lm-gp-stick-l')) fail.push('stick view missing'); }
  try { if (stored === null) localStorage.removeItem('lmGamepad'); else localStorage.setItem('lmGamepad', stored); } catch (e) { }
  document.getElementById('lm-gp-close').click();
  await sleep(50);
  if (document.getElementById('lm-gp-modal') || document.getElementById('lm-gp-backdrop')) fail.push('close button did not close the window');
  if (!wasOpen) { $('#close-hotkeys').trigger('click'); await sleep(600); }
  return { fail: fail, info: info };
})()
