// Phone run: a two-finger pinch on the open menu changes the HUD / menu scale (the menu layer lies
// over the canvas, whose pinch handler never got those touches). The scale is put back afterwards.
(async () => {
  var fail = [], info = {};
  /* LMmobile.js sets up its touch handlers after the menu */
  for (var w = 0; w < 60 && !window._lmMobileHost && matchMedia('(pointer: coarse)').matches; w++) await new Promise(function (r) { setTimeout(r, 250); });
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var ov = document.getElementById('overlays'), hc = document.getElementById('helloContainer');
  if (!ov || !hc || typeof defaultSettings === 'undefined' || typeof Touch !== 'function') return { fail: ['menu, defaultSettings or Touch missing'] };
  if (getComputedStyle(ov).display === 'none') return { fail: fail, info: { skipped: 'menu not open' } };
  var keep = defaultSettings.hudScale, keepO = typeof ogario !== 'undefined' ? ogario.hudScale : undefined;
  var shown = function () { return typeof window.lmHudScale === 'function' ? window.lmHudScale() : defaultSettings.hudScale; };
  var b = hc.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, t = document.elementFromPoint(cx, cy) || hc;
  var fire = function (type, d) {
    var ts = d === null ? [] : [new Touch({ identifier: 1, target: t, clientX: cx - d, clientY: cy }), new Touch({ identifier: 2, target: t, clientX: cx + d, clientY: cy })];
    t.dispatchEvent(new TouchEvent(type, { touches: ts, targetTouches: ts, changedTouches: ts.length ? ts : [new Touch({ identifier: 1, target: t, clientX: cx, clientY: cy })], bubbles: true, cancelable: true }));
  };
  var s0 = shown();
  try {
    fire('touchstart', 120);
    for (var d = 110; d >= 40; d -= 10) fire('touchmove', d);
    fire('touchend', null);
    info.scale = [s0, shown()];
    if (!(shown() < s0 - 0.05)) fail.push('pinch on the open menu did not shrink the HUD scale: ' + s0 + ' -> ' + shown());
  } finally {
    defaultSettings.hudScale = keep;
    if (keepO !== undefined) ogario.hudScale = keepO;
    if (window.lmMenuFit && window.lmMenuFit.queue) window.lmMenuFit.queue();
  }
  return { fail: fail, info: info };
})()
