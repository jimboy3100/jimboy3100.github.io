// Gameplay settings schema in the real menu: every slider is built from LM_SETTINGS_SCHEMA and
// shows the value the game uses; 'settingsChange' from a switch, a slider (once), a text box and
// setSettings, none for an unchanged value; the profile count slider resizes the profile list live.
(async () => {
  var fail = [], info = {};
  var SCH = window.LM_SETTINGS_SCHEMA, S = defaultmapsettings;
  if (!SCH || typeof lmSettingValue !== 'function') return { fail: ['LM_SETTINGS_SCHEMA missing'], info: info };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  // every slider: range and step of the schema, shows the runtime value
  var sliders = 0, off = [];
  Object.keys(SCH).forEach(function (k) {
    var el = document.getElementById(k + '-slider');
    if (!el || !$(el).closest('#og-options').length || !Array.isArray(SCH[k])) return;
    sliders++;
    var r = SCH[k];
    if (Number(el.min) !== r[0] || Number(el.max) !== r[1] || (r[2] > 0 && Number(el.step) !== r[2])) off.push(k + ' range ' + el.min + '-' + el.max + '/' + el.step);
    if (Number(el.value) !== S[k]) off.push(k + ' shows ' + el.value + ', game ' + S[k]);
    var label = document.getElementById(k + '-value');
    if (label && Number(label.textContent) !== S[k]) off.push(k + ' label ' + label.textContent);
  });
  info.sliders = sliders;
  if (sliders < 20) fail.push('only ' + sliders + ' schema sliders in the menu');
  off.slice(0, 6).forEach(function (m) { fail.push(m); });
  var got = [];
  var onSet = function (e) { got.push(e.key + '=' + e.value); };
  LMEvents.on('settingsChange', onSet);
  try {
    // a slider dragged over several steps and released: one event, the final value
    var sl = $('#lineSplitCount-slider'), was = S.lineSplitCount;
    var other = was === 3 ? 4 : 3;
    sl.val(1).trigger('input'); sl.val(2).trigger('input'); sl.val(other).trigger('input'); sl.trigger('change');
    if (got.join() !== 'lineSplitCount=' + other) fail.push('slider events: ' + got.join());
    // a value between the steps set from a script: the slider and the game agree
    got.length = 0;
    var mf = $('#rainbowBorderSpeed-slider'), mfWas = S.rainbowBorderSpeed;
    mf.val(1.7).trigger('input').trigger('change');
    if (Number(mf.val()) !== S.rainbowBorderSpeed || S.rainbowBorderSpeed % 1 !== 0) fail.push('rainbowBorderSpeed slider ' + mf.val() + ' game ' + S.rainbowBorderSpeed);
    mf.val(mfWas).trigger('input').trigger('change');
    sl.val(was).trigger('input').trigger('change');
    got.length = 0;
    // a switch
    var cb = document.getElementById('showGrid');
    if (cb) {
      var g0 = S.showGrid;
      cb.checked = !g0; cb.dispatchEvent(new Event('change', { bubbles: true }));
      cb.checked = g0; cb.dispatchEvent(new Event('change', { bubbles: true }));
      if (got.join() !== 'showGrid=' + !g0 + ',showGrid=' + g0) fail.push('switch events: ' + got.join());
    }
    got.length = 0;
    // unchanged values: no event
    application.setSettings('showGrid', S.showGrid);
    $('#lineSplitCount-slider').trigger('change');
    if (got.length) fail.push('events without a change: ' + got.join());
    // a text box (applied on change)
    var tb = document.getElementById('chatHideWords');
    if (tb) {
      var t0 = tb.value;
      tb.value = t0 + 'zzprobe'; $(tb).trigger('change');
      tb.value = t0; $(tb).trigger('change');
      if (got.join() !== 'chatHideWords=' + t0 + 'zzprobe,chatHideWords=' + t0) fail.push('text box events: ' + got.join());
    }
    got.length = 0;
    // setSettings from a script: put on the schema
    var mfa = S.macroFeeding;
    application.setSettings('macroFeeding', -100);
    if (S.macroFeeding !== 1) fail.push('setSettings macroFeeding -100 -> ' + S.macroFeeding);
    if ($('#macroFeeding-slider').val() !== '1' || $('#macroFeeding-value').text() !== '1') fail.push('setSettings macroFeeding: slider ' + $('#macroFeeding-slider').val() + ', label ' + $('#macroFeeding-value').text());
    application.setSettings('macroFeeding', mfa);
    if ($('#macroFeeding-slider').val() !== String(mfa) || $('#macroFeeding-value').text() !== String(mfa)) fail.push('setSettings macroFeeding back: slider ' + $('#macroFeeding-slider').val());
    got.length = 0;
    // profile count: 15 -> 30 -> 10 -> 30, live, the profiles kept
    var pn = $('#profileNumber-slider'), pn0 = S.profileNumber;
    var boxes = function () { return $('#skins .skin-box').length; };
    var nicks0 = profiles.map(function (p) { return p.nick; });
    var sel0 = application.selectedProfile;
    var extra0 = localStorage.getItem('ogarioPlayerProfilesExtra');
    pn.val(30).trigger('input').trigger('change');
    var at30 = boxes() + '/' + profiles.length;
    profiles[25].nick = 'zzProbe25';
    application.selectProfile(25);
    pn.val(10).trigger('input').trigger('change');
    var at10 = boxes() + '/' + profiles.length + ' sel ' + application.selectedProfile;
    pn.val(30).trigger('input').trigger('change');
    var back = boxes() + '/' + profiles.length + ' sel ' + application.selectedProfile + ' ' + (profiles[25] && profiles[25].nick);
    info.profileCount = [at30, at10, back].join(' | ');
    if (at30 !== '30/30') fail.push('count 30: ' + at30);
    if (at10 !== '10/10 sel 0') fail.push('count 10: ' + at10);
    if (back !== '30/30 sel 25 zzProbe25') fail.push('count 30 again: ' + back);
    if (got.filter(function (g) { return g.indexOf('profileNumber=') === 0; }).length !== 3) fail.push('profile count events: ' + got.join());
    // back as it was
    application.selectProfile(sel0 < pn0 ? sel0 : 0);
    profiles[25].nick = 'Profile #26';
    pn.val(pn0).trigger('input').trigger('change');
    try { if (extra0 === null) localStorage.removeItem('ogarioPlayerProfilesExtra'); else localStorage.setItem('ogarioPlayerProfilesExtra', extra0); } catch (e) { }
    var nicks1 = profiles.map(function (p) { return p.nick; });
    if (nicks1.join() !== nicks0.join() || boxes() !== pn0) fail.push('profiles not restored: ' + boxes() + ' ' + nicks1.length);
    await wait(0);
  } finally {
    LMEvents.off('settingsChange', onSet);
  }
  return { fail: fail, info: info };
})()
