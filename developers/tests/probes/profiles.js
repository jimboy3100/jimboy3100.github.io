// Settings profiles: the window opens from Settings, fits the screen, a template profile is
// created and applied through the controls, a backup is made, Undo puts the settings back.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMProfiles && document.getElementById('og-options')); i++) await wait(250);
  if (!window.LMProfiles) return { fail: ['LMProfiles not loaded'] };
  ['hk-lmProfilesWindow', 'hk-lmProfileNext', 'hk-lmProfilePrev', 'hk-lmProfileUndo'].forEach(function (h) {
    if (!hotkeysCommand[h]) fail.push('hotkey ' + h + ' missing');
    else if (hotkeysCommand[h].defaultKey !== '') fail.push('hotkey ' + h + ' has a default key');
  });
  if (!(application.saveSettings && application.saveSettings._lmSp)) fail.push('automatic backups: saveSettings not watched');
  if (!(application.importSettings && application.importSettings._lmSp)) fail.push('automatic backups: importSettings not watched');
  var keys = ['lmSettingsProfiles', 'lmSettingsProfilesRules', 'lmSettingsBackups', 'lmSettingsProfilesUndo', 'lmSettingsProfilesLast'];
  var saved = {};
  keys.forEach(function (k) { saved[k] = localStorage.getItem(k); localStorage.removeItem(k); });
  var origConfirm = window.confirm;
  window.confirm = function () { return true; };
  var before = defaultmapsettings.oppColors;
  try {
    var btn = $('.lm-profiles-open');
    if (!btn.length) fail.push('no Settings profiles button next to the presets');
    btn.first().trigger('click');
    var ov = document.getElementById('lm-sp-overlay');
    if (!ov) return { fail: fail.concat(['window did not open']) };
    var r = ov.querySelector('.lm-sp-win').getBoundingClientRect();
    info.win = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('window does not fit the screen: ' + info.win);
    ['compare', 'auto', 'backups', 'profiles'].forEach(function (t) {
      $('#lm-sp-overlay .lm-sp-tabs button[data-tab=' + t + ']').trigger('click');
      if (!$('#lm-sp-overlay .lm-sp-body').children().length) fail.push('tab ' + t + ' is empty');
    });
    if ($('#lm-sp-overlay [data-rule-on]').length) fail.push('auto tab still rendered on the profiles tab');
    $('#lm-sp-tpl').val('competitive');
    $('#lm-sp-overlay [data-act=tpl]').trigger('click');
    var list = LMProfiles.list();
    if (list.length !== 1) fail.push('template profile not created (' + list.length + ')');
    else {
      $('#lm-sp-overlay [data-act=cmp][data-id="p:' + list[0].id + '"]').trigger('click');
      info.compareRows = $('#lm-sp-overlay table tr').length - 1;
      if (!(info.compareRows > 0)) fail.push('comparison of current vs the template profile lists nothing');
      $('#lm-sp-overlay .lm-sp-tabs button[data-tab=auto]').trigger('click');
      $('#lm-sp-overlay [data-rule-on]').prop('checked', true).trigger('change');
      if (!LMEvents._has('serverChange')) fail.push('switching on: no serverChange listener');
      $('#lm-sp-overlay [data-rule-on]').prop('checked', false).trigger('change');
      if (LMEvents._has('serverChange')) fail.push('switching off: serverChange listener left');
      $('#lm-sp-overlay .lm-sp-tabs button[data-tab=profiles]').trigger('click');
      $('#lm-sp-overlay [data-act=apply][data-id=' + list[0].id + ']').trigger('click');
      if (defaultmapsettings.oppColors !== true) fail.push('profile not applied (oppColors ' + defaultmapsettings.oppColors + ')');
      var cb = document.getElementById('oppColors');
      if (cb && cb.checked !== true) fail.push('the oppColors switch was not moved');
      var st = JSON.parse(localStorage.getItem('ogarioSettings') || '{}');
      if (st.oppColors !== true) fail.push('applied profile not saved');
      var bk = JSON.parse(localStorage.getItem('lmSettingsBackups') || '[]');
      info.backups = bk.length;
      if (!bk.length || bk[0].reason !== 'profile') fail.push('no backup before the profile');
      LMProfiles.undo();
      if (defaultmapsettings.oppColors !== before) fail.push('Undo did not put oppColors back');
    }
    // theme and hotkeys apply live, and Undo puts them back
    var mw = defaultSettings.miniMapWidth, hkBefore = JSON.stringify(hotkeys);
    var hk2 = JSON.parse(hkBefore); hk2['CTRL+F9'] = 'hk-lmProfilesWindow';
    var res = LMProfiles.applySet({ t: { miniMapWidth: mw + 20 }, h: hk2 }, 'probe');
    if (!res || res.length !== 2) fail.push('theme + hotkey set: ' + (res ? res.length : res) + ' changes instead of 2');
    if (defaultSettings.miniMapWidth !== mw + 20) fail.push('theme value not applied');
    if (JSON.parse(localStorage.getItem('ogarioThemeSettings') || '{}').miniMapWidth !== mw + 20) fail.push('theme value not saved');
    if (hotkeys['CTRL+F9'] !== 'hk-lmProfilesWindow') fail.push('hotkey not applied live');
    if (JSON.parse(localStorage.getItem('ogarioHotkeys') || '{}')['CTRL+F9'] !== 'hk-lmProfilesWindow') fail.push('hotkey not saved');
    LMProfiles.undo();
    if (defaultSettings.miniMapWidth !== mw) fail.push('Undo did not put the theme back');
    if ('CTRL+F9' in hotkeys) fail.push('Undo did not put the hotkeys back');
    $('#lm-sp-overlay .lm-sp-x').trigger('click');
    if (document.getElementById('lm-sp-overlay')) fail.push('close button did not close the window');
  } finally {
    window.confirm = origConfirm;
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
    $('#lm-sp-overlay').remove();
  }
  return { fail: fail, info: info };
})()
