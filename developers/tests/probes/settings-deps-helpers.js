// Settings > Helpers: Bubble indicators and Split prediction do something only
// while Opponents rings and Cursor tracking are on, and Settings > Stats: the frame
// time only while FPS is on (it is written after the FPS); while those are off they
// are dimmed and say what they need, as the other dependent options. With Stats off the frame time says
// it needs Stats (the outermost switch that is off). The bubble tracker is the bubble look of Cursor
// tracking: it needs Cursor tracking, choosing it turns Cursor tracking on, and while it is on only
// Split prediction (it dims the line) says it has no effect. The parent switch is turned off
// and on again with a real click (a tap on phones); every setting is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var seq = 0;
  var press = function (x, y) {
    return new Promise(function (res) {
      var id = 'sdh' + (++seq) + '_' + Date.now();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 250); } };
      window.__lmInput(JSON.stringify({ id: id, type: window.LM_IS_MOBILE ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var pairs = [['oppRings', 'bubbleInd'], ['cursorTracking', 'bubbleCursorTracker']];
  var keep = { showStats: defaultmapsettings.showStats, bubbleCursorTracker: defaultmapsettings.bubbleCursorTracker };
  pairs.forEach(function (p) { keep[p[0]] = defaultmapsettings[p[0]]; keep[p[1]] = defaultmapsettings[p[1]]; });
  var needs = application._lmMenuText('lmDepNeeds');
  var plain = function (k) { return $('<div>').html(application._lmMenuText(k)).text().trim(); };
  var menuShown = $('#og-options').is(':visible');
  /* the menu tab shown before, given back at the end (later probes click the start tab's buttons) */
  var activeTab = $('.menu-tabs li.active a').first();
  try {
    if (!menuShown) {
      $('#overlays').show(); $('#helloContainer').show();
      $('.settings-tab a').trigger('click');
      await sleep(500);
    }
    $('[id^="LMPromo"]').remove();
    /* clicks the switch of a setting where the player sees it */
    var flip = async function (k) {
      var cb = document.getElementById(k);
      var sw = cb && cb.nextElementSibling && /switchery/.test(cb.nextElementSibling.className) ? cb.nextElementSibling : cb && cb.closest('label');
      if (!sw) { fail.push('no switch for ' + k); return; }
      sw.scrollIntoView({ block: 'center' });
      await sleep(150);
      var r = sw.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var hit = document.elementFromPoint(x, y);
      if (!hit || !(hit === sw || sw.contains(hit) || (hit.closest && hit.closest('label') === cb.closest('label')))) { fail.push(k + ' switch is covered by ' + (hit ? hit.tagName + '#' + hit.id + '.' + hit.className : 'nothing')); return; }
      var was = cb.checked;
      await press(x, y);
      await sleep(150);
      if (cb.checked === was) fail.push('the click did not change ' + k);
    };
    var why = function (k) { var it = $('#' + k).closest('label'); return it.hasClass('lm-dep-off') ? String(it.attr('data-lm-why') || '') : ''; };
    if (!defaultmapsettings.showStats) { defaultmapsettings.showStats = true; application._lmDepRefresh(); }
    for (var i = 0; i < pairs.length; i++) {
      var parent = pairs[i][0], child = pairs[i][1];
      if (!document.getElementById(parent) || !document.getElementById(child)) { fail.push('missing #' + parent + ' or #' + child); continue; }
      if (!defaultmapsettings[parent]) await flip(parent);
      var on = why(child);
      await flip(parent);
      var off = why(child);
      await flip(parent);
      var back = why(child);
      info[child] = { on: on, off: off };
      if (defaultmapsettings[parent] !== true) fail.push(parent + ' not on again after two clicks');
      if (off.indexOf(needs) !== 0 || off.indexOf(plain(parent)) < 0) fail.push(child + ' does not say it needs ' + parent + ' while it is off (' + (off || 'not dimmed') + ')');
      if (on.indexOf(needs) === 0 || back.indexOf(needs) === 0) fail.push(child + ' says it needs ' + parent + ' while it is on');
    }
    /* Stats off: the frame time (showStatsFPS) needs Stats */
    defaultmapsettings.showStats = false;
    application._lmDepRefresh();
    info.statsOff = { showStatsFPS: why('showStatsFPS') };
    ['showStatsFPS'].forEach(function (k) {
      if (info.statsOff[k] !== needs + ': ' + plain('showStats')) fail.push(k + ' with Stats off says ' + (info.statsOff[k] || 'nothing'));
    });
    /* the bubble look of Cursor tracking: Cursor tracking is never dimmed for it (split prediction
     * has no switch: it is part of the line) */
    if (!defaultmapsettings.cursorTracking) await flip('cursorTracking');
    if (defaultmapsettings.bubbleCursorTracker) await flip('bubbleCursorTracker');
    var bt0 = { cursorTracking: why('cursorTracking') };
    await flip('bubbleCursorTracker');
    var bt1 = { cursorTracking: why('cursorTracking') };
    await flip('bubbleCursorTracker');
    var bt2 = { cursorTracking: why('cursorTracking') };
    info.bubbleTracker = { off: bt0, on: bt1 };
    if (document.getElementById('splitPrediction')) fail.push('the Split prediction switch is still there');
    if (bt0.cursorTracking || bt1.cursorTracking || bt2.cursorTracking) fail.push('Cursor tracking is dimmed (' + [bt0.cursorTracking, bt1.cursorTracking, bt2.cursorTracking].join(' / ') + ')');
    /* Cursor tracking off takes the bubble look off; choosing the look turns Cursor tracking on */
    await flip('bubbleCursorTracker');
    await flip('cursorTracking');
    var offBoth = { cursorTracking: defaultmapsettings.cursorTracking, bubbleCursorTracker: defaultmapsettings.bubbleCursorTracker, box: document.getElementById('bubbleCursorTracker').checked };
    await flip('bubbleCursorTracker');
    var onBoth = { cursorTracking: defaultmapsettings.cursorTracking, bubbleCursorTracker: defaultmapsettings.bubbleCursorTracker, box: document.getElementById('cursorTracking').checked };
    info.bubbleLook = { ctOff: offBoth, lookOn: onBoth };
    if (offBoth.cursorTracking || offBoth.bubbleCursorTracker || offBoth.box) fail.push('Cursor tracking off left the bubble look on ' + JSON.stringify(offBoth));
    if (!onBoth.cursorTracking || !onBoth.bubbleCursorTracker || !onBoth.box) fail.push('choosing the bubble look did not turn Cursor tracking on ' + JSON.stringify(onBoth));
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    Object.keys(keep).forEach(function (k) {
      if (defaultmapsettings[k] === keep[k]) return;
      defaultmapsettings[k] = keep[k];
      application.syncHotkeyOption(k);
    });
    try { application.saveSettings(defaultmapsettings, 'ogarioSettings'); } catch (e) { }
    if (application._lmDepRefresh) application._lmDepRefresh();
    if (!menuShown && activeTab.length) activeTab.trigger('click');
  }
  return { fail: fail, info: info };
})()
