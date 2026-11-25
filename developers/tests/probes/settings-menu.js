// The settings menu, tabs and option groups were built.
(async () => {
  var fail = [], info = {};
  info.groups = $('#og-options').children().length;
  info.inputs = $('#og-options input').length;
  if (info.groups < 10) fail.push('#og-options has only ' + info.groups + ' groups');
  if (info.inputs < 50) fail.push('#og-options has only ' + info.inputs + ' inputs');
  ['.settings-tab a', '.theme-tab a', '.hotkeys-link', '.music-tab a', '.profile-tab a', '#main-panel', '#og-settings', '#theme', '#music', '#profile']
    .forEach(function (s) { if (!$(s).length) fail.push('missing ' + s); });
  // keyboard hotkeys live in the Hotkeys tab only: no Hotkeys or Command Centre button in Settings
  // (the Command Centre stays on Ctrl+K and its own hotkey; the settings search stays)
  if ($('#og-settings #lm-open-hotkeys-btn, #og-settings #lm-cc-open, #og-settings .lm-cc-open-btn').length) fail.push('hotkeys / Command Centre button in the Settings tab');
  if (!$('#lm-settings-search').closest('#og-settings').length) fail.push('settings search missing');
  // every checkbox option maps to a known setting
  var unknown = [];
  $('#og-options input[type=checkbox]').each(function () {
    if (this.id && !(this.id in defaultmapsettings) && !(this.id in defaultSettings)) unknown.push(this.id);
  });
  info.checkboxes = $('#og-options input[type=checkbox]').length;
  info.unmappedCheckboxes = unknown.length;
  // no option twice (moved options must not be duplicated)
  var seen = {}, dup = [];
  $('#og-options input[type=checkbox][id], #og-options input[type=range][id]').each(function () { if (seen[this.id]) dup.push(this.id); seen[this.id] = 1; });
  if (dup.length) fail.push('options built twice: ' + dup.slice(0, 5).join(', '));
  // options in their section, and every heading has a text
  var place = { recordReplays: 'replayGroup', 'instantReplaySecs-slider': 'replayGroup', netHistory: 'perfGroup', 'lm-perf-diag-btn': 'perfGroup',
    adaptivePerf: 'perfGroup', hudMergeCountdown: 'mergeGroup', hudMergeSound: 'mergeGroup', mergeRings: 'mergeGroup', virusSound: 'soundsGroup',
    reducedMotion: 'accessibilityGroup', a11yIndicators: 'accessibilityGroup', companionLive: 'spectateGroup', clickSpectate: 'spectateGroup',
    gamepadEnabled: 'mouseGroup', 'lm-gamepad-btn': 'mouseGroup', 'profileNumber-slider': 'profiles', showCellShadows: 'transparencyGroup' };
  Object.keys(place).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) fail.push('missing #' + id);
    else if (!$(el).closest('.options-box.' + place[id]).length) fail.push('#' + id + ' not in .' + place[id]);
  });
  $('#og-options > .options-box > h5').each(function () {
    var t = $(this).text().trim();
    if (!t || t === 'undefined') fail.push('empty heading in .' + $(this).parent().attr('class'));
  });
  // dependency marks match the parent switches (nothing is changed here)
  var deps = { showStats: 'showStatsMass', showMiniMap: 'showMiniMapGuides', showMass: 'hudRelativeMass', recordReplays: 'instantReplaySecs-slider', companionLive: 'companionChat', adaptivePerf: 'adaptivePerfToasts', gameOverStats: 'deathRecap' };
  if (typeof application._lmDepRefresh !== 'function') fail.push('no dependency refresh');
  else {
    application._lmDepRefresh();
    Object.keys(deps).forEach(function (p) {
      var it = $('#' + deps[p]).closest('.slider-box, label');
      if (!it.length) return;
      var needs = it.hasClass('lm-dep-off') && String(it.attr('data-lm-why') || '').indexOf(application._lmMenuText('lmDepNeeds')) === 0;
      if (needs !== !defaultmapsettings[p]) fail.push(deps[p] + ' mark does not match ' + p);
    });
    info.dimmed = $('#og-options .lm-dep-off').length;
    // the Game Over card parts say they need Game over stats while it is off
    ['massGraph', 'showKiller', 'deathRecap'].forEach(function (k) {
      var it = $('#' + k).closest('label');
      if (!it.length) { fail.push('missing #' + k); return; }
      var why = String(it.attr('data-lm-why') || '');
      if (!defaultmapsettings.gameOverStats && why.indexOf($('<div>').html(application._lmMenuText('gameOverStats')).text().trim()) < 0) fail.push(k + ' does not say it needs Game over stats');
    });
  }
  // the Streamer preset and the Stream mode button say what they do (language packs)
  var stTip = $('.lm-preset-btn[data-preset="streamer"]').attr('title') || '';
  if (!stTip || stTip !== lmT('pkg.i.streamerTip')) fail.push('Streamer preset has no tip from the language pack');
  if (($('#stream-mode').attr('title') || '') !== lmT('pkg.i.streamModeTip')) fail.push('Stream mode button has no tip from the language pack');
  return { fail: fail, info: info };
})()
