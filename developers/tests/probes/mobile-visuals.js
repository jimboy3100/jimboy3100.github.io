// Phone run: the phone's fainter grid and smaller food are drawn without changing the theme. Up to 3.698
// LMmobile.js wrote the reduced grid colour and food size into the theme (defaultSettings), so a save,
// Theme Workshop preview / Revert or a settings profile kept them and every load reduced them again.
// Now the theme keeps the player's values; only a drawn frame uses the reduced ones. Theme put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var ds = window.defaultSettings, app = window.application, dr = window.drawRender;
  if (!ds || !app || !dr) return { fail: ['defaultSettings, application or drawRender missing'] };
  var stored = null, raw = null;
  try { raw = localStorage.getItem('ogarioThemeSettings'); stored = raw ? JSON.parse(raw) : null; } catch (e) { }
  var want = { foodSize: stored && stored.foodSize !== undefined ? stored.foodSize : 5, gridColor: stored && stored.gridColor ? stored.gridColor : '#00243e' };
  info.theme = { foodSize: ds.foodSize, gridColor: ds.gridColor };
  if (ds.foodSize !== want.foodSize) fail.push('the theme food size is ' + ds.foodSize + ', the saved / default value is ' + want.foodSize);
  if (ds.gridColor !== want.gridColor) fail.push('the theme grid colour is ' + ds.gridColor + ', the saved / default value is ' + want.gridColor);
  var keep = { foodSize: ds.foodSize, gridColor: ds.gridColor }, origFrame = dr.renderFrame;
  try {
    if (typeof window._lmPhoneVis !== 'function') { fail.push('no frame-time phone visuals (window._lmPhoneVis)'); return { fail: fail, info: info }; }
    ds.foodSize = 10; ds.gridColor = '#123456';
    var seen = null;
    dr.renderFrame = function () { if (!seen) seen = { foodSize: ds.foodSize, gridColor: ds.gridColor }; return origFrame.apply(this, arguments); };
    for (var i = 0; i < 40 && !seen; i++) await sleep(50);
    dr.renderFrame = origFrame;
    info.inFrame = seen;
    if (!seen) fail.push('no frame was drawn');
    else if (seen.foodSize !== 6 || seen.gridColor !== 'rgba(18,52,86,0.15)') fail.push('a frame drew food ' + seen.foodSize + ' / grid ' + seen.gridColor + ' (expected 6 / rgba(18,52,86,0.15))');
    await sleep(50);
    info.after = { foodSize: ds.foodSize, gridColor: ds.gridColor };
    if (ds.foodSize !== 10 || ds.gridColor !== '#123456') fail.push('after a frame the theme has food ' + ds.foodSize + ' / grid ' + ds.gridColor + ' instead of the player\'s 10 / #123456');
    (window.Settings || app).saveThemeSettings();
    var saved = JSON.parse(localStorage.getItem('ogarioThemeSettings'));
    if (saved.foodSize !== 10 || saved.gridColor !== '#123456') fail.push('saved theme has food ' + saved.foodSize + ' / grid ' + saved.gridColor);
    /* rgba colours: 0.3 of their opacity */
    window._lmPhoneVis(false);
    ds.gridColor = 'rgba(10, 20, 30, 0.5)';
    window._lmPhoneVis(true);
    var rg = ds.gridColor;
    window._lmPhoneVis(false);
    if (rg !== 'rgba(10,20,30,0.15)' || ds.gridColor !== 'rgba(10, 20, 30, 0.5)') fail.push('rgba grid colour drawn as ' + rg + ', theme left at ' + ds.gridColor);
  } finally {
    dr.renderFrame = origFrame;
    ds.foodSize = keep.foodSize; ds.gridColor = keep.gridColor;
    try { if (raw === null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', raw); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
