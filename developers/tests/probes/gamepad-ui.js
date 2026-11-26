// The Gamepad window opens from the Hotkeys window (Gamepad), fits the screen, shows its tabs and closes again.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var G = window.LMGamepad;
  if (!G) return { fail: ['window.LMGamepad missing (ogario/gamepad.js not loaded)'] };
  var hk = hotkeysCommand['hk-gamepadWindow'];
  if (!hk) fail.push('hotkey hk-gamepadWindow missing');
  else if (hk.defaultKey !== '') fail.push('hk-gamepadWindow has a default key');
  var b = $('#hotkeys #lm-hk-controls #lm-gamepad-btn');
  if (!b.length) return { fail: fail.concat(['no Gamepad button in the Hotkeys window']) };
  var stored = null;
  try { stored = localStorage.getItem('lmGamepad'); } catch (e) { }
  b.first().trigger('click');
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
  var sels = md.querySelectorAll('select[id^="lm-gp-btn-"]');
  info.buttons = sels.length;
  if (sels.length !== 16) fail.push(sels.length + ' button choices instead of 16');
  else {
    info.choices = sels[0].options.length;
    if (sels[0].options.length < 30) fail.push('few commands in a button choice: ' + sels[0].options.length);
    var m = G.getMap();
    for (var i = 0; i < 16; i++) if (sels[i].value !== m[i]) fail.push('button ' + i + ' shows ' + sels[i].value + ', map has ' + m[i]);
  }
  ['tuning', 'profiles', 'test', 'buttons'].forEach(function (t) {
    var tab = document.getElementById('lm-gp-tab-' + t);
    if (!tab) { fail.push('tab ' + t + ' missing'); return; }
    tab.click();
    if (t === 'tuning' && !document.getElementById('lm-gp-gamepadMoveRange')) fail.push('sensitivity sliders missing');
    /* named setups are Settings profiles: this tab only opens them */
    if (t === 'profiles' && (!document.getElementById('lm-gp-profiles-open') || document.getElementById('lm-gp-profile-name'))) fail.push('profiles tab: no shortcut to the gamepad profiles, or an own profile list');
    if (t === 'test' && !document.getElementById('lm-gp-stick-l')) fail.push('stick view missing');
  });
  if ('saveProfile' in G || 'profiles' in G) fail.push('the gamepad still has profile functions of its own');
  // the shortcut: the Gamepad window closes (the pad works again) and Settings profiles open at the gamepad profiles
  document.getElementById('lm-gp-tab-profiles').click();
  var go = document.getElementById('lm-gp-profiles-open');
  if (go && window.LMProfiles) {
    go.click();
    await sleep(80);
    if (document.getElementById('lm-gp-modal')) fail.push('the shortcut left the Gamepad window open');
    var ov = document.getElementById('lm-sp-overlay');
    if (!ov) fail.push('the shortcut did not open Settings profiles');
    else {
      if (!ov.querySelector('[data-act=savegp]')) fail.push('Settings profiles not at the gamepad profiles (no Save gamepad)');
      if (ov.querySelector('#lm-sp-tpl') || ov.querySelector('[data-act=save]')) fail.push('the gamepad view shows the full-profile controls');
      var wr = ov.querySelector('.lm-sp-win').getBoundingClientRect();
      if (wr.left < 0 || wr.top < 0 || wr.right > innerWidth + 1 || wr.bottom > innerHeight + 1) fail.push('gamepad profiles view does not fit the screen');
      var back = ov.querySelector('[data-act=gpview]');
      if (back) back.click();
      if (!document.querySelector('#lm-sp-overlay [data-act=save]')) fail.push('"All profiles" does not go back to the full view');
      $('#lm-sp-overlay .lm-sp-x').trigger('click');
    }
    G.openWindow();
    for (var k = 0; k < 40 && !document.getElementById('lm-gp-modal'); k++) await sleep(100);
  }
  try { if (stored === null) localStorage.removeItem('lmGamepad'); else localStorage.setItem('lmGamepad', stored); } catch (e) { }
  G._reload();
  if (document.getElementById('lm-gp-close')) document.getElementById('lm-gp-close').click();
  await sleep(50);
  if (document.getElementById('lm-gp-modal') || document.getElementById('lm-gp-backdrop')) fail.push('close button did not close the window');
  // the hotkey opens and closes it
  hk && hk.keyDown();
  await sleep(50);
  if (!document.getElementById('lm-gp-modal')) fail.push('hotkey did not open the window');
  hk && hk.keyDown();
  await sleep(50);
  if (document.getElementById('lm-gp-modal')) fail.push('hotkey did not close the window');
  return { fail: fail, info: info };
})()
