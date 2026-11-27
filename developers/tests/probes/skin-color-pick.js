// Profile colour (the colour square of the skin field), real input: a colour picked with the colour
// picker is kept in the selected profile and saved, as typed nick, tag and skin are. The picker
// writes its hidden field without an input or change event, so until 3.701 the picked colour was
// saved only by Play and a reload (or a profile switch while playing) lost it. The profile and the
// field are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 80 && !(window.application && document.getElementById('color') && $('.skin').data('colorpicker')); w++) await sleep(250);
  var A = window.application;
  if (!A || typeof profiles === 'undefined' || !document.getElementById('color')) return { fail: ['no profile colour field'], info: info };
  var addon = document.querySelector('.skin .input-group-addon');
  if (!addon || !$(addon).is(':visible')) return { skip: 'the skin field is not on screen', info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'scp' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 150); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var at = function (el, fx, fy) {
    var r = el.getBoundingClientRect();
    return send({ type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width * fx), y: Math.round(r.top + r.height * fy) });
  };
  var sel = A.selectedProfile, keep = $.extend({}, profiles[sel]);
  var storedColor = function () { try { var p = JSON.parse(localStorage.getItem('ogarioPlayerProfiles') || '[]'); return p[sel] && p[sel].color; } catch (e) { return undefined; } };
  try {
    /* a one-time promo window (once per browser) may lie over the menu: it goes first */
    $('[id^="LMPromo"]').remove();
    var before = $('#color').val();
    await at(addon, 0.5, 0.5);
    var pick = [].filter.call(document.querySelectorAll('.colorpicker'), function (p) { return $(p).is(':visible'); })[0];
    if (!pick) throw new Error('the colour picker did not open');
    await at(pick.querySelector('.colorpicker-hue'), 0.5, 0.6);
    await at(pick.querySelector('.colorpicker-saturation'), 0.8, 0.3);
    await sleep(600);
    info.colour = [before, $('#color').val()];
    if (info.colour[1] === before) throw new Error('picking did not change the colour field');
    info.profile = profiles[sel].color;
    info.stored = storedColor();
    if (info.profile !== info.colour[1]) fail.push('the profile keeps ' + info.profile + ', the picked colour is ' + info.colour[1]);
    if (info.stored !== info.colour[1]) fail.push('the saved profile keeps ' + info.stored + ', the picked colour is ' + info.colour[1]);
    if (profiles[sel].nick !== keep.nick || profiles[sel].skinURL !== keep.skinURL) fail.push('saving the colour changed the nick or skin of the profile');
  } catch (e) {
    fail.push(String(e && e.message || e));
  } finally {
    try { $('.skin').colorpicker('hide'); } catch (e) { }
    profiles[sel] = keep;
    $('#color').val(keep.color);
    try { $('.skin').colorpicker('setValue', keep.color); } catch (e) { }
    await sleep(400);
    profiles[sel] = keep;
    try { A.saveSettings(profiles, 'ogarioPlayerProfiles'); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
