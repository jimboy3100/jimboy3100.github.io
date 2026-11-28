// Phone run, gear panel: Joystick size changes the drawn joystick (a thumb on the game: its ring, its
// knob and how far the knob travels) and at 100 % it is exactly as before (120 px ring, 55 px travel).
// The joystick is always fully opaque: its opacity slider is removed and a saved value changes nothing.
// The phone preferences are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, canvas = document.getElementById('canvas');
  var size = document.getElementById('lm-jss');
  var jo = document.querySelector('.lm-jo'), ji = document.querySelector('.lm-ji');
  if (!H || !app || !canvas || !jo || !ji) return { fail: ['phone controls or joystick missing'] };
  if (!size) return { fail: ['no Joystick size slider in the gear panel'] };
  if (document.getElementById('lm-jso') || document.getElementById('lm-dz')) fail.push('the removed Joystick opacity / Dead zone sliders are still in the gear panel');
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var touch = function (type, id, x, y) {
    var t = new Touch({ identifier: id, target: canvas, clientX: x, clientY: y });
    var on = type === 'touchend' ? [] : [t];
    canvas.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var slide = function (el, v) { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
  var c = function (el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; };
  var measure = function (id) {
    var x = innerWidth * 0.25, y = innerHeight * 0.55;
    touch('touchstart', id, x, y);
    touch('touchmove', id, x + 200, y);
    var a = c(jo), b = c(ji), m = { ring: Math.round(a.w), knob: Math.round(b.w), travel: Math.round(Math.hypot(b.x - a.x, b.y - a.y)), opacity: getComputedStyle(jo).opacity };
    touch('touchend', id, x + 200, y);
    return m;
  };
  try {
    app.hideMenu();
    await sleep(300);
    slide(size, 100);
    info.normal = measure(81);
    if (info.normal.ring !== 120 || info.normal.knob !== 50 || info.normal.travel !== 55 || info.normal.opacity !== '1') fail.push('at 100 % the joystick is not as before: ' + JSON.stringify(info.normal));
    /* an old saved opacity of 50 % is skipped */
    try { var sv = JSON.parse(localStorage.getItem('lm-mobile-prefs') || '{}'); sv.jsOpacity = 0.5; localStorage.setItem('lm-mobile-prefs', JSON.stringify(sv)); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    slide(size, 150);
    info.big = measure(82);
    if (info.big.ring !== 180 || info.big.knob !== 75) fail.push('Joystick size 150 %: ring ' + info.big.ring + ' / knob ' + info.big.knob + ' px (want 180 / 75)');
    if (Math.abs(info.big.travel - 82.5) > 1) fail.push('Joystick size 150 %: the knob travels ' + info.big.travel + ' px (want 82.5)');
    if (info.big.opacity !== '1') fail.push('an old saved joystick opacity of 50 %: drawn at ' + info.big.opacity);
    var st = JSON.parse(localStorage.getItem('lm-mobile-prefs') || '{}');
    if (st.jsSize !== 1.5) fail.push('not saved: ' + JSON.stringify({ jsSize: st.jsSize }));
  } finally {
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
