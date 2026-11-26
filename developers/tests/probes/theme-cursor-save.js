// Theme > Images: a cursor picked from the cursor list is saved like the tab's other controls
// (it was shown at once but lost on reload unless Save was pressed). Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioThemeSettings') || '{}'); } catch (e) { return {}; } };
  var links = $('#theme-images .cursor-box a');
  if (links.length < 2) return { fail: ['no cursor list in Theme > Images'] };
  var before = defaultSettings.customCursor, rawBefore = localStorage.getItem('ogarioThemeSettings');
  var pick = links.filter(function () { return $('img', this).attr('src') !== before; }).eq(2);
  var url = pick.find('img').attr('src');
  try {
    pick.trigger('click');
    if (defaultSettings.customCursor !== url) fail.push('the click did not set the cursor');
    if ($('#customCursor').val() !== url) fail.push('the cursor field shows ' + $('#customCursor').val());
    for (var i = 0; i < 20 && stored().customCursor !== url; i++) await sleep(100);
    info.stored = stored().customCursor;
    if (stored().customCursor !== url) fail.push('the picked cursor was not saved: stored ' + stored().customCursor);
  } finally {
    defaultSettings.customCursor = before;
    $('#customCursor').val(before == null ? '' : String(before));
    links.removeClass('active').filter(function () { return $('img', this).attr('src') === before; }).addClass('active');
    try { Settings.setCustomCursor(); } catch (e) { }
    await sleep(800); /* the tab's own delayed save first, then the old value back */
    try { if (rawBefore == null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', rawBefore); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
