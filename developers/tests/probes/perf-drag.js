// Performance diagnostics window: drag it by its title bar, it stays on screen, and it opens
// again where it was left. The close cross is not a drag handle.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && !(window.LMPerf && window.LMPerf.openDiag); w++) await sleep(200);
  var P = window.LMPerf;
  if (!P || !P.openDiag) return { fail: ['LMPerf.openDiag missing'], info: info };
  var savedPos = null;
  try { savedPos = localStorage.getItem('lmPerfDiagPos'); localStorage.removeItem('lmPerfDiagPos'); } catch (e) { }
  var fire = function (target, type, x, y) {
    target.dispatchEvent(new PointerEvent(type, { pointerId: 7, clientX: x, clientY: y, button: 0, bubbles: true, cancelable: true, pointerType: 'mouse' }));
  };
  try {
    if (document.getElementById('lm-perf-diag')) P.openDiag();
    P.openDiag();
    await sleep(100);
    var md = document.getElementById('lm-perf-diag');
    if (!md) throw new Error('window did not open');
    var head = md.firstElementChild;
    var r0 = md.getBoundingClientRect();
    fire(head, 'pointerdown', r0.left + 40, r0.top + 10);
    fire(head, 'pointermove', r0.left + 140, r0.top + 70);
    fire(head, 'pointerup', r0.left + 140, r0.top + 70);
    var r1 = md.getBoundingClientRect();
    info.moved = [Math.round(r1.left - r0.left), Math.round(r1.top - r0.top)].join(',');
    /* the whole window stays on screen: on a short screen it can only move as far as the bottom edge */
    var wantDx = Math.min(100, Math.max(0, window.innerWidth - r0.width) - r0.left);
    var wantDy = Math.min(60, Math.max(0, window.innerHeight - r0.height) - r0.top);
    if (Math.abs(r1.left - r0.left - wantDx) > 2 || Math.abs(r1.top - r0.top - wantDy) > 2) fail.push('drag did not move the window: ' + info.moved + ' (expected ' + wantDx + ',' + wantDy + ')');
    /* far off screen: kept on screen */
    fire(head, 'pointerdown', r1.left + 40, r1.top + 10);
    fire(head, 'pointermove', 99999, 99999);
    fire(head, 'pointerup', 99999, 99999);
    var r2 = md.getBoundingClientRect();
    info.clamped = [Math.round(r2.left), Math.round(r2.top), Math.round(r2.width), Math.round(r2.height)].join(',');
    if (r2.right > window.innerWidth + 1 || r2.left < -1 || r2.top < -1 || (r2.height <= window.innerHeight && r2.bottom > window.innerHeight + 1)) fail.push('window left the screen: ' + info.clamped);
    /* the close cross does not start a drag */
    var x = document.getElementById('lm-perf-diag-close');
    var rx = x.getBoundingClientRect();
    fire(x, 'pointerdown', rx.left + 5, rx.top + 5);
    fire(head, 'pointermove', rx.left - 200, rx.top + 50);
    fire(head, 'pointerup', rx.left - 200, rx.top + 50);
    var r3 = md.getBoundingClientRect();
    if (Math.abs(r3.left - r2.left) > 1 || Math.abs(r3.top - r2.top) > 1) fail.push('the close cross started a drag');
    /* reopen: same place */
    P.openDiag();
    await sleep(50);
    P.openDiag();
    await sleep(100);
    var md2 = document.getElementById('lm-perf-diag');
    var r4 = md2 && md2.getBoundingClientRect();
    info.reopened = r4 ? [Math.round(r4.left), Math.round(r4.top)].join(',') : 'none';
    /* same place, except that a window grown by its content is lifted to stay on screen */
    if (!r4 || Math.abs(r4.left - r2.left) > 2 || r4.top > r2.top + 2 || (r4.height <= window.innerHeight && r4.bottom > window.innerHeight + 1)) fail.push('not reopened at the saved place: ' + info.reopened + ' vs ' + info.clamped);
  } catch (e) {
    fail.push('error: ' + (e && e.message));
  } finally {
    try { if (document.getElementById('lm-perf-diag')) P.openDiag(); } catch (e) { }
    try { if (savedPos === null) localStorage.removeItem('lmPerfDiagPos'); else localStorage.setItem('lmPerfDiagPos', savedPos); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
