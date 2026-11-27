// Settings > Mass > Mass format from 12.3k to exact: the mass on a cell drawn by the Canvas
// renderer changes at once. With Optimized mass on (the default) the text was only drawn again
// when the mass changed by 2%, so a cell of 12345 kept showing "12.3k" until it grew or shrank.
(async () => {
  var fail = [], info = {}, ms = window.defaultmapsettings, A = window.application;
  var C = window.legendmod1, R = window.drawRender;
  if (typeof C !== 'function' || !R) return { fail: ['cell class or renderer missing'], info: info };
  var sel = document.getElementById('massFormat');
  if (!sel || sel.tagName !== 'SELECT') return { fail: ['no Mass format choice in Settings'], info: info };
  var keep = { massFormat: ms.massFormat, optimizedMass: ms.optimizedMass, hudRelativeMass: ms.hudRelativeMass };
  var keepDs = R._drawSettings;
  var flip = function (id, on) { var cb = document.getElementById(id); if (cb) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); } else A.setSettings(id, on); };
  var choose = function (v) { sel.value = String(v); sel.dispatchEvent(new Event('change', { bubbles: true })); };
  var ctx = document.createElement('canvas').getContext('2d');
  /* a cell of mass 12345 (size^2 / 100), as the Canvas renderer updates and draws it in a frame */
  var size = Math.sqrt(12345 * 100) + 0.01;
  var cell = new C(987654, 0, 0, size, '#33aa33', false, false, false, ms.shortMass, ms.virMassShots);
  var frame = function () {
    /* the settings as the frame reads them (renderFrame copies them; null = read them directly) */
    R._drawSettings = null;
    cell.setDrawing();
    cell.setMass(size);
    cell.drawMass(ctx);
    return cell.massCanvas ? cell.massCanvas.txt : null;
  };
  try {
    if (!ms.optimizedMass) flip('optimizedMass', true);
    if (ms.hudRelativeMass) flip('hudRelativeMass', false);
    choose(2);
    var t2 = frame(); frame();
    info.short = t2;
    if (t2 !== '12.3k') fail.push('Mass format 12.3k: the cell shows ' + t2);
    choose(1);
    var t1 = frame();
    info.exact = t1;
    if (ms.massFormat !== 1 || ms.shortMass !== false) fail.push('Mass format exact not set (' + ms.massFormat + ', shortMass ' + ms.shortMass + ')');
    if (t1 !== '12345') fail.push('Mass format 12.3k -> exact: the cell still shows ' + t1 + ' (not 12345)');
    choose(2);
    var t3 = frame();
    if (t3 !== '12.3k') fail.push('Mass format exact -> 12.3k: the cell shows ' + t3);
    choose(3);
    var t4 = frame();
    info.auto = t4;
    choose(1);
    var t5 = frame();
    if (t5 !== '12345') fail.push('Mass format auto -> exact: the cell shows ' + t5);
    /* 12.3k: a cell going from 1000 (1k) to 999 shows 999 */
    choose(2);
    size = Math.sqrt(1000 * 100) + 0.01;
    var t6 = frame();
    size = Math.sqrt(999 * 100) + 0.01;
    var t7 = frame();
    info.below = [t6, t7];
    if (t6 !== '1k' || t7 !== '999') fail.push('Mass format 12.3k, 1000 -> 999: the cell shows ' + t6 + ' then ' + t7);
  } catch (e) {
    fail.push('error: ' + (e && e.message || e));
  } finally {
    R._drawSettings = keepDs;
    if (ms.massFormat !== keep.massFormat) choose(keep.massFormat);
    if (ms.optimizedMass !== keep.optimizedMass) flip('optimizedMass', keep.optimizedMass);
    if (ms.hudRelativeMass !== keep.hudRelativeMass) flip('hudRelativeMass', keep.hudRelativeMass);
  }
  return { fail: fail, info: info };
})()
