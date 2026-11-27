// Hotkeys window Restore: the default keys come back and a command without a default key has none
// (the last of them, Quick chat 50, was put on the key '', so a mouse button pressed on its field
// showed " / MOUSE RIGHT"; a save from before has that '' entry too). Close puts everything back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hs = window.legendmod6;
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var real = typeof window.__lmInput === 'function' && !mobile;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hkrs' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var cfg = document.getElementById('hotkeys-cfg');
  /* a right click on a key field, real where the page has a mouse */
  var rightClick = async function (id) {
    var f = document.getElementById(id);
    if (!f) { fail.push('no field ' + id); return; }
    if (!real) { hs.setHotkey('MOUSE RIGHT', id); return; }
    cfg.scrollTop += f.getBoundingClientRect().top - cfg.getBoundingClientRect().top - 80;
    try { $(cfg).perfectScrollbar('update'); } catch (e) { }
    await sleep(150);
    var r = f.getBoundingClientRect(), x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    if (document.elementFromPoint(x, y) !== f) { hs.setHotkey('MOUSE RIGHT', id); info.realClick = 'skipped (field covered)'; return; }
    await send({ type: 'mousedown', x: x, y: y, button: 'right' });
    await send({ type: 'mouseup', x: x, y: y, button: 'right' });
    for (var w = 0; w < 20 && f.value.indexOf('MOUSE RIGHT') < 0; w++) await sleep(50);
  };
  var hkBefore = JSON.stringify(hotkeys), lsBefore = localStorage.getItem('ogarioHotkeys');
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  if (!cfg || !$('#hotkeys').is(':visible')) return { fail: ['hotkeys window did not open'] };
  try {
    hs.setHotkey('K', 'hk-feed');
    $('#reset-hotkeys').trigger('click');
    await sleep(150);
    if (hotkeys.W !== 'hk-feed' || document.getElementById('hk-feed').value !== 'W') fail.push('Restore did not put W back on feed: ' + document.getElementById('hk-feed').value);
    if (Object.prototype.hasOwnProperty.call(hotkeys, '')) fail.push('Restore put ' + hotkeys[''] + ' on the key ""');
    /* every command without a default key: no key after Restore; a mouse button shows alone */
    var none = Object.keys(hotkeysCommand).filter(function (c) { return !hotkeysCommand[c].defaultKey && document.getElementById(c); });
    var last = none[none.length - 1];
    info.lastWithoutDefault = last;
    await rightClick(last);
    info.value = document.getElementById(last).value;
    if (document.getElementById(last).value !== 'MOUSE RIGHT') fail.push('right button on ' + last + ' shows ' + JSON.stringify(document.getElementById(last).value));
    /* a save from an older version holds the '' entry */
    var other = none[none.length - 2];
    hotkeys[''] = other;
    hs.showKeys(other);
    await rightClick(other);
    if (document.getElementById(other).value !== 'MOUSE RIGHT') fail.push('with the saved "" entry, right button on ' + other + ' shows ' + JSON.stringify(document.getElementById(other).value));
  } finally {
    $('#close-hotkeys').trigger('click'); /* Close reverts the changes */
    await sleep(700);
    if (JSON.stringify(hotkeys) !== hkBefore) fail.push('Close did not put the keys back');
    if (localStorage.getItem('ogarioHotkeys') !== lsBefore) fail.push('the stored keys changed');
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
