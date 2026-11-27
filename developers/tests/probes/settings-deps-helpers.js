// Settings > Helpers: Bubble indicators, Split prediction and Ghost cells info do something only
// while Opponents rings, Cursor tracking and Ghost cells are on; while those are off they are
// dimmed and say what they need, as the other dependent options. The parent switch is turned off
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
  var pairs = [['oppRings', 'bubbleInd'], ['cursorTracking', 'splitPrediction'], ['showGhostCells', 'showGhostCellsInfo']];
  var keep = {};
  pairs.forEach(function (p) { keep[p[0]] = defaultmapsettings[p[0]]; keep[p[1]] = defaultmapsettings[p[1]]; });
  var needs = application._lmMenuText('lmDepNeeds');
  var plain = function (k) { return $('<div>').html(application._lmMenuText(k)).text().trim(); };
  var menuShown = $('#og-options').is(':visible');
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
  }
  return { fail: fail, info: info };
})()
