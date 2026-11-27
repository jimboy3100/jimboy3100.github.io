// Phone run, gear panel options (off by default): a Quick respawn button runs the Quick respawn
// hotkey's command (application.quickResp) when Settings > Quick respawn is on and says how to turn it
// on otherwise. It is a phone control the control editor can move. The custom macro buttons M1-M3
// are removed (no option, no buttons, no editor entries).
// The commands are counted, not run; the phone preferences and the setting are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, s = window.legendmod5;
  var cbR = document.getElementById('lm-respbtn');
  if (!H || !app || !s) return { fail: ['phone controls, application or settings missing'] };
  if (!cbR) return { fail: ['no Quick respawn button option in the gear panel'] };
  if (document.getElementById('lm-macrobtn') || 'm1' in H.controls()) fail.push('the removed custom macro buttons are still there');
  if (H.controls().respawn) fail.push('the Quick respawn button is shown with its option off');
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var keep = { quickResp: app.quickResp, info: toastr.info, setting: s.quickResp };
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var calls = [];
  var set = function (cb, on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); };
  var tap = function (el) {
    var r = el.getBoundingClientRect(), t = new Touch({ identifier: 91, target: el, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    el.dispatchEvent(new TouchEvent('touchstart', { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }));
    el.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  try {
    app.quickResp = function () { calls.push('respawn'); };
    toastr.info = function (m) { calls.push('hint'); return keep.info.apply(this, arguments); };
    set(cbR, true);
    var c = H.controls();
    if (!c.respawn) return { fail: fail.concat(['Quick respawn button missing with its option on']), info: info };
    app.hideMenu();
    await sleep(300);
    s.quickResp = false;
    tap(c.respawn);
    info.off = calls.join(',');
    if (calls.indexOf('respawn') >= 0 || calls.indexOf('hint') < 0) fail.push('Quick respawn off: the button gave ' + info.off + ' (want only the hint)');
    calls = [];
    s.quickResp = true;
    await sleep(1050); /* the button's 1 s guard against a double respawn */
    tap(c.respawn);
    info.on = calls.join(',');
    if (calls.join(',') !== 'respawn') fail.push('Quick respawn on: the button gave ' + info.on);
    var E = window.LMMobileEditor;
    if (E && E.CONTROLS) {
      if (!E.CONTROLS.some(function (x) { return x.id === 'respawn'; })) fail.push('control editor cannot move respawn');
      if (E.CONTROLS.some(function (x) { return /^m[1-3]$/.test(x.id); })) fail.push('control editor still lists the removed macro buttons');
    }
  } finally {
    app.quickResp = keep.quickResp; toastr.info = keep.info; s.quickResp = keep.setting;
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
