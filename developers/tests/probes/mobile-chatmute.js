// Phone run: the mute button of a chat popup (the default chat, Show chat box off) can be tapped: it is
// shown without hover (a touch never hovers; up to 3.697 it was display:none there), large enough for a
// thumb, not covered, and a real tap on it mutes that player. The probe's player is unmuted again.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* a touch-only screen: LMmobile.js may still be loading when the probes start */
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var app = window.application, ID = 987654;
  if (!app || !window.toastr || typeof app.isChatUserMuted !== 'function') return { fail: ['application or toastr missing'] };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  var realTap = function (x, y) {
    return new Promise(function (res) {
      var id = 'mute' + Date.now();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: 'tap', x: x, y: y }));
    });
  };
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  try {
    app.hideMenu();
    await sleep(400);
    toastr.success('<div class="toast-message"><span class="message-nick">Probe mute: </span><span class="message-text">hello</span><a href="#" data-user-id="' + ID + '" class="mute-user ogicon-user-minus"></a></div>');
    await sleep(300);
    var toasts = document.querySelectorAll('#toast-container .toast'), m = null;
    for (var i = 0; i < toasts.length; i++) { var q = toasts[i].querySelector('.mute-user[data-user-id="' + ID + '"]'); if (q) m = q; }
    if (!m) return { fail: ['probe chat popup not shown'], info: info };
    var cs = getComputedStyle(m), r = m.getBoundingClientRect();
    info.mute = { display: cs.display, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] };
    if (cs.display === 'none' || !(r.width > 0)) fail.push('mute button not shown without hover');
    else {
      if (r.width < 24 || r.height < 24) fail.push('mute button tap area too small: ' + Math.round(r.width) + 'x' + Math.round(r.height));
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2, top = document.elementFromPoint(cx, cy);
      if (top !== m && !m.contains(top)) fail.push('mute button covered by ' + (top ? (top.id || top.className || top.tagName) : 'nothing'));
      await realTap(cx, cy);
      await sleep(300);
      info.muted = app.isChatUserMuted(ID);
      if (!info.muted) fail.push('a tap on the mute button did not mute the player');
    }
  } finally {
    try { if (app.isChatUserMuted(ID)) app.unmuteChatUser(ID); } catch (e) { }
    try { toastr.clear(); } catch (e) { }
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
