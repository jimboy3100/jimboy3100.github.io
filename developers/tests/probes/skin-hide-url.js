// Hide skin URL (turned on by the Streamer preset or a settings profile): the skin field's text is
// hidden, and its eye button next to the field is there to show it again; a real click (tap on a
// phone) turns the option off, shows the text and saves it. Until 3.700 that button was always
// hidden, so after the Streamer preset nothing in the menu could show the skin address again.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var A = window.application, ms = window.defaultmapsettings;
  if (!A || !ms || typeof A.setHideSkinUrl !== 'function') return { fail: ['setHideSkinUrl missing'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'shu' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 150); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}').hideSkinUrl; } catch (e) { return undefined; } };
  var was = ms.hideSkinUrl, menuHidden = !$('#skin').is(':visible');
  try {
    if (menuHidden) return { skip: 'the skin field is not on screen', info: info };
    /* a one-time promo window (once per browser) may lie over the menu: it goes first */
    $('[id^="LMPromo"]').remove();
    ms.hideSkinUrl = true;
    A.saveSettings(ms, 'ogarioSettings');
    A.setHideSkinUrl();
    await sleep(100);
    var b = document.getElementById('hide-url');
    info.skinHidden = $('#skin').hasClass('hide-url');
    var r = b && b.getBoundingClientRect();
    info.button = r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null;
    if (!info.skinHidden) fail.push('the skin field text is not hidden');
    if (!b || !(r.width > 0 && r.height > 0)) throw new Error('with the skin address hidden there is no button to show it again');
    var hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!(hit === b || b.contains(hit))) fail.push('the button is covered by ' + (hit && (hit.id || hit.className || hit.tagName)));
    await send({ type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    info.after = { option: ms.hideSkinUrl, stored: stored(), hidden: $('#skin').hasClass('hide-url') };
    if (ms.hideSkinUrl !== false || info.after.hidden) fail.push('the button did not show the skin address again ' + JSON.stringify(info.after));
    if (info.after.stored !== false) fail.push('showing the skin address again is not saved');
  } catch (e) {
    fail.push(String(e && e.message || e));
  } finally {
    ms.hideSkinUrl = was;
    try { A.saveSettings(ms, 'ogarioSettings'); A.setHideSkinUrl(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
