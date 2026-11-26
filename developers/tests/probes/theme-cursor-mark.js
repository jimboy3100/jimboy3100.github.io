// Theme > Images: a cursor address typed in the cursor box (its last letter a real key press) marks
// that cursor in the cursor list, and an address of no listed cursor marks none. Until 3.695 the
// list kept marking the cursor picked before (also after a settings profile set another cursor).
// Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var links = $('#theme-images .cursor-box a'), box = document.getElementById('customCursor');
  if (links.length < 4 || !box) return { fail: ['no cursor list or cursor box in Theme > Images'] };
  var key = function (ch) {
    return new Promise(function (res) {
      var id = 'tcm' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 150); } };
      window.__lmInput(JSON.stringify({ id: id, type: 'key', key: ch, code: 'Key' + ch.toUpperCase(), keyCode: ch.toUpperCase().charCodeAt(0), text: ch }));
    });
  };
  var marked = function () { return links.filter('.active').map(function () { return $('img', this).attr('src'); }).get(); };
  var before = defaultSettings.customCursor, rawBefore = localStorage.getItem('ogarioThemeSettings');
  var activeTab = $('.menu-tabs li.active a').first(), activeSub = $('#theme .submenu-tabs li.active a').first();
  var pick = links.filter(function () { return $('img', this).attr('src') !== before; }).eq(3).find('img').attr('src');
  try {
    $('.theme-tab a').first().trigger('click');
    $('.theme-images-tab a').first().trigger('click');
    await sleep(200);
    info.before = marked();
    box.focus();
    /* the address but its last letter, then that letter typed */
    box.value = pick.slice(0, -1);
    await key(pick.slice(-1));
    info.typed = [box.value, defaultSettings.customCursor];
    if (defaultSettings.customCursor !== pick) fail.push('typing did not set the cursor (' + defaultSettings.customCursor + ')');
    info.after = marked();
    if (info.after.length !== 1 || info.after[0] !== pick) fail.push('the cursor list marks ' + (info.after.join(', ') || 'nothing') + ' instead of the typed ' + pick);
    /* one letter more: no listed cursor has this address */
    await key('x');
    info.other = marked();
    if (info.other.length) fail.push('an address of no listed cursor still marks ' + info.other.join(', '));
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { box.blur(); } catch (e) { }
    defaultSettings.customCursor = before;
    $('#customCursor').val(before == null ? '' : String(before));
    links.removeClass('active').filter(function () { return $('img', this).attr('src') === before; }).addClass('active');
    try { Settings.setCustomCursor(); } catch (e) { }
    if (activeSub.length) activeSub.trigger('click');
    if (activeTab.length) activeTab.trigger('click');
    await sleep(800); /* the tab's own delayed save first, then the old value back */
    try { if (rawBefore == null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', rawBefore); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
