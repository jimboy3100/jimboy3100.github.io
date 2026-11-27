// Phone run, gear panel options (off by default): a Quick respawn button runs the Quick respawn
// hotkey's command (application.quickResp) when Settings > Quick respawn is on and says how to turn it
// on otherwise; custom macro buttons M1-M3 run the Custom macro hotkeys' command (lmMacroEditor 'run')
// and take no taps while the menu is open. They are phone controls the control editor can move.
// The commands are counted, not run; the phone preferences and the setting are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, s = window.legendmod5;
  var cbR = document.getElementById('lm-respbtn'), cbM = document.getElementById('lm-macrobtn');
  if (!H || !app || !s) return { fail: ['phone controls, application or settings missing'] };
  if (!cbR || !cbM) return { fail: ['no Quick respawn / custom macro button options in the gear panel'] };
  if (H.controls().respawn || H.controls().m1) fail.push('the new buttons are shown with the options off');
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var keep = { quickResp: app.quickResp, macro: window.lmMacroEditor, info: toastr.info, setting: s.quickResp };
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
    window.lmMacroEditor = function (a, n) { calls.push(a + n); };
    toastr.info = function (m) { calls.push('hint'); return keep.info.apply(this, arguments); };
    set(cbR, true); set(cbM, true);
    var c = H.controls();
    if (!c.respawn || !c.m1 || !c.m2 || !c.m3) return { fail: fail.concat(['buttons missing with the options on']), info: info };
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
    calls = [];
    tap(c.m2);
    if (calls.join(',') !== 'run2') fail.push('M2 gave ' + calls.join(',') + ' (want run2)');
    calls = [];
    app.showMenu();
    await sleep(400);
    tap(c.m1);
    if (calls.length) fail.push('M1 ran with the menu open: ' + calls.join(','));
    var E = window.LMMobileEditor;
    if (E && E.CONTROLS) ['respawn', 'm1', 'm2', 'm3'].forEach(function (id) { if (!E.CONTROLS.some(function (x) { return x.id === id; })) fail.push('control editor cannot move ' + id); });
  } finally {
    app.quickResp = keep.quickResp; window.lmMacroEditor = keep.macro; toastr.info = keep.info; s.quickResp = keep.setting;
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
