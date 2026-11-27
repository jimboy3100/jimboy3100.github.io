// The settings menu, tabs and option groups were built.
(async () => {
  var fail = [], info = {};
  info.groups = $('#og-options').children().length;
  info.inputs = $('#og-options input').length;
  if (info.groups < 10) fail.push('#og-options has only ' + info.groups + ' groups');
  if (info.inputs < 50) fail.push('#og-options has only ' + info.inputs + ' inputs');
  ['.settings-tab a', '.theme-tab a', '.hotkeys-link', '.profile-tab a', '#main-panel', '#og-settings', '#theme', '#profile']
    .forEach(function (s) { if (!$(s).length) fail.push('missing ' + s); });
  // keyboard hotkeys live in the Hotkeys tab only: no Hotkeys button in Settings (the settings search stays)
  if ($('#og-settings #lm-open-hotkeys-btn').length) fail.push('hotkeys button in the Settings tab');
  // the Command Centre is deleted: no module, button, hotkey or quick bar, and Ctrl+K opens nothing
  if (window.LMCommandCentre || document.getElementById('lm-cc-open') || document.getElementById('lm-cc-bar') || ('hk-commandCentre' in hotkeysCommand) || ('commandCentreBar' in defaultmapsettings)) fail.push('Command Centre parts left');
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', keyCode: 75, ctrlKey: true, bubbles: true }));
  if (document.getElementById('lm-cc')) fail.push('Ctrl+K opened a Command Centre');
  if (!$('#lm-settings-search').closest('#og-settings').length) fail.push('settings search missing');
  // no control bindings in Settings: mouse buttons are keys of the Hotkeys window, the gamepad is there
  // too; Sticky cells (a behaviour of the buttons, not a binding) is in Settings > Helpers, once
  if ($('[id="stickyCell"]').length !== 1 || !$('#stickyCell').closest('#og-options .options-box.helpersGroup').length) fail.push('Sticky cells not once in Settings > Helpers');
  if ($('#og-settings').find('#mouseSplit, #mouseFeed, #mouseWheelClick, #mouseCommand4, #mouseCommand5, #gamepadEnabled, #gamepadDeadzone-slider, #lm-gamepad-btn, select[id$="2"][id^="mouse"], .mouseGroup, .controlsGroup').length) fail.push('control bindings in the Settings tab');
  // the Lab experiments are in the User Scripts window: no Lab section, note or Reset Lab in Settings
  if ($('#og-settings').find('.lmLabGroup, .lm-lab-note, #lm-lab-reset, [id^="lmLab-"]').length) fail.push('Lab section in the Settings tab');
  // "Spawn special effects" had no effect left (its spawn effect was taken out): no switch for it
  if (document.getElementById('spawnSpecialEffects')) fail.push('Spawn special effects switch in Settings (it does nothing)');
  // "Rotate Map" only started the removed map orientation server: no switch for it
  if (document.getElementById('rotateMap')) fail.push('Rotate Map switch in Settings (it does nothing)');
  // one link to the skins page: the skins panel's Add skins button (the left column had a second one)
  if ($('#quick-menu .quick-more-skins').length) fail.push('second Skins link in the left column');
  if ($('#skins-panel #more-skins').attr('href') !== 'https://www.legendmod.ml/skins/') fail.push('Add skins button missing or not the skins page');
  if (!$('#quick-menu #ModInfoQuick').length) fail.push('left column lost Mod Info');
  // the sound files are in Settings > Sounds (no second Sounds panel in the Youtube & Sounds tab)
  if ($('#music .sounds-panel').length) fail.push('second Sounds panel in the Youtube & Sounds tab');
  ['messageSound', 'commandSound', 'virusSoundurl'].forEach(function (k) {
    var el = document.getElementById(k);
    if (!el || !$(el).closest('.options-box.soundsGroup').length) fail.push('#' + k + ' not in Settings > Sounds');
    else if (el.value !== String(defaultmapsettings[k] == null ? '' : defaultmapsettings[k])) fail.push('#' + k + ' does not show its setting');
  });
  if ($('#virusSoundurl').closest('.input-box').prev().find('#virusSound').length !== 1) fail.push('virus sound file not next to its switch');
  // the HUD box images / titles and the screen background image are in the Theme tab (no chooser in Tools)
  if ($('#backgroundPic').length) fail.push('Manual background chooser still in the Tools tab');
  [['minimapPicture', 'theme-minimap'], ['leadbPicture', 'theme-hud'], ['leadbtext', 'theme-hud'],
    ['teambPicture', 'theme-hud'], ['teambtext', 'theme-hud'], ['canvasPicture', 'theme-images']].forEach(function (p) {
    var el = document.getElementById(p[0]);
    if (!el || !$(el).closest('#' + p[1] + ' .input-box').length) fail.push('#' + p[0] + ' not in Theme #' + p[1]);
    else if (!$(el).closest('.input-box').find('.title-box').text().trim()) fail.push('#' + p[0] + ' has no label');
    else if (el.style.display === 'none') fail.push('#' + p[0] + ' hidden');
  });
  if (!$('#canvasPicture').closest('.input-box').prev().find('#backgroundAlpha-slider').length) fail.push('screen image not under the map background');
  if (!$('#legend #imgUrl').is(':visible') && $('#legend').is(':visible')) fail.push('main banner fields hidden');
  // the moved field still works: stored and shown on the game view, then put back
  try {
    var cbOld = localStorage.getItem('canvasbimg'), cbBg = $('#canvas').css('background-image');
    $('#canvasPicture').val('https://www.legendmod.ml/banners/IconCustomServer1.png');
    window.setcanvasbgname();
    if (localStorage.getItem('canvasbimg') !== 'https://www.legendmod.ml/banners/IconCustomServer1.png' || String($('#canvas').css('background-image')).indexOf('IconCustomServer1') < 0) fail.push('screen background image from Theme not applied');
    if (cbOld === null) localStorage.removeItem('canvasbimg'); else localStorage.setItem('canvasbimg', cbOld);
    $('#canvasPicture').val(cbOld || '');
    $('#canvas').css('background-image', cbBg);
  } catch (e) { fail.push('screen image check: ' + e); }
  // cell animations in Animation, once each (the developer console is switched in the diagnostics window: probe perf-devconsole)
  [['jellyPhisycs', 'animationGroup'], ['suckAnimation', 'animationGroup']].forEach(function (p) {
    if ($('#og-options [id="' + p[0] + '"]').length !== 1 || !$('#' + p[0]).closest('.options-box.' + p[1]).length) fail.push('#' + p[0] + ' not once in .' + p[1]);
    else if ($('#' + p[0]).prop('checked') !== !!defaultmapsettings[p[0]]) fail.push('#' + p[0] + ' does not show its setting');
  });
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
  var place = { recordReplays: 'replayGroup', 'lm-perf-diag-btn': 'perfGroup',
    adaptivePerf: 'perfGroup', hudMergeCountdown: 'mergeGroup', hudMergeSound: 'mergeGroup', mergeRings: 'mergeGroup', virusSound: 'soundsGroup',
    reducedMotion: 'expandingLandGroup', showStatsWorldSize: 'expandingLandGroup', showStatsDecayInfo: 'expandingLandGroup',
    showStatsServerHz: 'expandingLandGroup', hideEventBanner: 'expandingLandGroup',
    'profileNumber-slider': 'profiles', showCellShadows: 'transparencyGroup' };
  Object.keys(place).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) fail.push('missing #' + id);
    else if (!$(el).closest('.options-box.' + place[id]).length) fail.push('#' + id + ' not in .' + place[id]);
  });
  /* no spectate options (the follows are always on), no Spectating and streaming section; the spectator director is gone */
  /* the instant replay is removed: no length slider */
  if ($('#og-options .spectateGroup').length) fail.push('Spectating and streaming section still in the menu');
  ['clickSpectate', 'lbClickSpectate', 'minimapClickSpectate', 'lm-director-btn', 'instantReplaySecs-slider'].forEach(function (id) { if (document.getElementById(id)) fail.push('#' + id + ' still in the menu'); });
  if (window.LMDirector || document.querySelector('script[src*="modules/director.js"]')) fail.push('spectator director still loaded');
  $('#og-options > .options-box > h5').each(function () {
    var t = $(this).text().trim();
    if (!t || t === 'undefined') fail.push('empty heading in .' + $(this).parent().attr('class'));
  });
  // dependency marks match the parent switches (nothing is changed here)
  var deps = { showStats: 'showStatsMass', showMiniMap: 'showMiniMapGuides', showMass: 'hudRelativeMass' };
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
    /* a server without a feature: its note names the server (it said "(undefined)") */
    var LMc = window.legendmod;
    if (!LMc) fail.push('no window.legendmod');
    else {
      var st0 = LMc.serverType, lw0 = LMc.isLegendWorld, ct0 = defaultmapsettings.cursorTracking, spWhy = function () { return String($('#splitPrediction').closest('label').attr('data-lm-why') || ''); };
      try {
        /* Split prediction also needs Cursor tracking: that note comes first while it is off */
        defaultmapsettings.cursorTracking = true;
        LMc.isLegendWorld = false;
        LMc.serverType = 'senpa';
        application._lmDepRefresh();
        info.serverNote = spWhy();
        if (info.serverNote !== application._lmMenuText('lmDepServer') + ' (Senpa)') fail.push('server note: ' + info.serverNote);
        LMc.serverType = 'private';
        application._lmDepRefresh();
        if (spWhy() !== application._lmMenuText('lmDepServer') + ' (' + lmT('modules.profiles.serverPrivate') + ')') fail.push('private server note: ' + spWhy());
        /* replays work on private servers: no note there */
        if ($('#recordReplays').closest('label').attr('data-lm-why')) fail.push('replays dimmed on a private server');
        LMc.serverType = 'agario';
        application._lmDepRefresh();
        if (spWhy()) fail.push('split prediction dimmed on agar.io: ' + spWhy());
        defaultmapsettings.cursorTracking = false;
        application._lmDepRefresh();
        if (spWhy().indexOf(application._lmMenuText('lmDepNeeds')) !== 0) fail.push('split prediction without cursor tracking: ' + spWhy());
      } finally { LMc.serverType = st0; LMc.isLegendWorld = lw0; defaultmapsettings.cursorTracking = ct0; application._lmDepRefresh(); }
    }
    // the Game Over card is one switch: no switch per part of it
    ['massGraph', 'showKiller', 'deathRecap'].forEach(function (k) {
      if ($('#' + k).length) fail.push('Game Over card part #' + k + ' has its own switch');
    });
  }
  // the Streamer preset and the Stream mode button say what they do (language packs)
  var stTip = $('.lm-preset-btn[data-preset="streamer"]').attr('title') || '';
  if (!stTip || stTip !== lmT('pkg.pt.streamerTip')) fail.push('Streamer preset has no tip from the language pack');
  // one list of starter setups: the row's buttons are the presets Settings profiles create from
  var ids = $('.lm-presets-row .lm-preset-btn').map(function () { return $(this).attr('data-preset'); }).get();
  info.presets = ids.join(',');
  if (ids.join(',') !== 'competitive,battery,streamer,reducedMotion,cleanHud,ffa,teams,multibox') fail.push('presets row: ' + info.presets);
  if (!application.lmPresets || Object.keys(application.lmPresets).join(',') !== ids.join(',')) fail.push('the presets are not published for Settings profiles');
  $('.lm-presets-row .lm-preset-btn').each(function () {
    var b = this.getBoundingClientRect(), row = this.parentNode.getBoundingClientRect();
    if (b.width && (b.right > row.right + 1 || b.left < row.left - 1)) fail.push('preset button outside its row: ' + $(this).attr('data-preset'));
  });
  if (($('#stream-mode').attr('title') || '') !== lmT('pkg.i.streamModeTip')) fail.push('Stream mode button has no tip from the language pack');
  return { fail: fail, info: info };
})()
