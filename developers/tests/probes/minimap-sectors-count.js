// Theme > Basic theming, Sectors X / Y: a real key press on the slider (Arrow Right) gives the
// minimap's sector grid the new count. The minimap draws its grid once and keeps it; until 3.695
// the sliders did not draw it again, so the minimap kept the old grid (until a reload or a minimap
// width change) while the sector name next to it already used the new count. The value and the
// stored theme are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var app = window.application;
  for (var w = 0; w < 40 && !(app && app.miniMapSectors); w++) await sleep(250);
  if (!app || !app.miniMapSectors) return { skip: 'the minimap is not drawn here' };
  var key = function (k, kc) {
    return new Promise(function (res) {
      var id = 'msc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: 'key', key: k, code: k, keyCode: kc }));
    });
  };
  var stored = null;
  try { stored = localStorage.getItem('ogarioThemeSettings'); } catch (e) { }
  var calls = [], orig = app.drawMiniMapSectors;
  app.drawMiniMapSectors = function (x, y) { calls.push(x + 'x' + y); return orig.apply(this, arguments); };
  var results = {};
  /* the Theme tab's Basic theming is shown for the key presses (focus needs a shown slider) */
  var activeTab = $('.menu-tabs li.active a').first(), activeSub = $('#theme .submenu-tabs li.active a').first();
  $('.theme-tab a').first().trigger('click');
  $('.theme-main-tab a').first().trigger('click');
  await sleep(200);
  try {
    for (var axis of ['sectorsX', 'sectorsY']) {
      var sl = document.getElementById(axis + '-slider');
      if (!sl) { fail.push('no ' + axis + ' slider'); continue; }
      var before = defaultSettings[axis];
      var dir = before < 10 ? ['ArrowRight', 39] : ['ArrowLeft', 37];
      calls.length = 0;
      sl.focus();
      await key(dir[0], dir[1]);
      var now = defaultSettings[axis];
      var want = (axis === 'sectorsX' ? now + 'x' + defaultSettings.sectorsY : defaultSettings.sectorsX + 'x' + now);
      for (w = 0; w < 20 && calls.indexOf(want) < 0; w++) await sleep(100);
      results[axis] = { before: before, now: now, draws: calls.slice() };
      if (now === before) fail.push(axis + ': the key press did not change the value');
      else if (calls.indexOf(want) < 0) fail.push(axis + ': the minimap sector grid was not drawn again with ' + want + ' (drawn: ' + (calls.join(', ') || 'never') + ')');
      /* back */
      sl.value = before;
      $(sl).trigger('input').trigger('change');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    app.drawMiniMapSectors = orig;
    app.resetMiniMapSectors();
    if (activeSub.length) activeSub.trigger('click');
    if (activeTab.length) activeTab.trigger('click');
    try { if (document.activeElement) document.activeElement.blur(); } catch (e) { }
    await sleep(700);
    try { if (stored == null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', stored); } catch (e) { }
  }
  info.results = results;
  return { fail: fail, info: info };
})()
