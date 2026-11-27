// Hotkeys window Save, with a real key press and a real click: the new key is stored and loads again
// (as after a reload). With the browser storage full, Save says so and the window stays open; it threw
// (a page error), said nothing and the change was gone after the next load. Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var hs = window.legendmod6;
  if (typeof window.__lmInput !== 'function') return { fail: fail, info: { skipped: 'no real input' } };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hksv' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var clickEl = async function (el) {
    var r = el.getBoundingClientRect(), x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    if (document.elementFromPoint(x, y) !== el && !el.contains(document.elementFromPoint(x, y))) { $(el).trigger('click'); return 'trigger'; }
    await send({ type: mobile ? 'tap' : 'click', x: x, y: y });
    await sleep(150);
    return 'real';
  };
  var keep = {};
  ['ogarioHotkeys', 'ogarioHotkeysKnown', 'ogarioCommands'].forEach(function (k) { keep[k] = localStorage.getItem(k); });
  var hkBefore = JSON.stringify(hotkeys);
  var wasOpen = $('#hotkeys').is(':visible');
  var open = async function () { if (!$('#hotkeys').is(':visible')) { $('.hotkeys-link').first().trigger('click'); await sleep(700); } };
  var F = 'hk-feed';
  var errs = [], onErr = function (e) { errs.push(String(e.message || e)); };
  window.addEventListener('error', onErr);
  var setItem = Storage.prototype.setItem;
  try {
    await open();
    var field = document.getElementById(F);
    field.focus();
    await send({ type: 'key', key: 'F9', code: 'F9', keyCode: 120 });
    for (var w = 0; w < 20 && field.value !== 'F9'; w++) await sleep(50);
    field.blur();
    if (hotkeys.F9 !== F) fail.push('F9 was not bound: ' + field.value);
    /* storage full: Save says so, the window stays */
    Storage.prototype.setItem = function (k, v) {
      if (k === 'ogarioHotkeys') { var e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      return setItem.call(this, k, v);
    };
    $('#toast-container').empty();
    info.click1 = await clickEl(document.getElementById('save-hotkeys'));
    await sleep(700);
    Storage.prototype.setItem = setItem;
    info.toast = $('#toast-container').text().slice(0, 120);
    if (errs.length) fail.push('Save with full storage threw: ' + errs[0]);
    if (!$('#hotkeys').is(':visible')) fail.push('Save with full storage closed the window as if saved');
    if (!/storage/i.test(info.toast)) fail.push('Save with full storage said nothing');
    if (hotkeys.F9 !== F) fail.push('the unsaved key was dropped');
    /* storage works: Save stores it and it loads again */
    info.click2 = await clickEl(document.getElementById('save-hotkeys'));
    await sleep(700);
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('ogarioHotkeys')); } catch (e) { }
    if (!stored || stored.F9 !== F || stored.W === F) fail.push('Save did not store F9 for feed: ' + JSON.stringify(stored && { F9: stored.F9, W: stored.W }));
    if ($('#hotkeys').is(':visible')) fail.push('Save did not close the window');
    var live = JSON.stringify(hotkeys);
    hs.loadHotkeys(); /* what a reload does */
    if (hotkeys.F9 !== F || hs.keysText(F) !== 'F9') fail.push('after loading again feed has ' + JSON.stringify(hs.keysText(F)));
    info.sameAfterLoad = JSON.stringify(hotkeys) === live;
  } finally {
    Storage.prototype.setItem = setItem;
    window.removeEventListener('error', onErr);
    Object.keys(keep).forEach(function (k) { if (keep[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, keep[k]); });
    hotkeys = JSON.parse(hkBefore);
    hs.openSnapshot = null;
    hs.refreshHotkeysMenu();
    if ($('#hotkeys').is(':visible')) { $('#close-hotkeys').trigger('click'); await sleep(700); }
    if (JSON.stringify(hotkeys) !== hkBefore) fail.push('the keys were not put back');
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
