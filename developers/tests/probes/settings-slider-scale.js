// Settings sliders while the menu is scaled down (phones, and short windows: the menu is shrunk to
// fit the height): a real click on the track puts the knob under the pointer, and a real drag of the
// knob moves it with the pointer. The slider library measured the pointer in screen pixels but the
// knob in unscaled pixels, so on a menu shrunk to 68% the knob lagged behind the finger and a click
// near the end of the track set a value far from it. Checked at the menu's own scale and shrunk to
// 70%; the value is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var seq = 0;
  var input = function (q) {
    return new Promise(function (res) {
      var id = 'sls' + (++seq) + '_' + Date.now();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 120); } };
      q.id = id; window.__lmInput(JSON.stringify(q));
    });
  };
  var sl = document.getElementById('massLossPct-slider');
  var box = sl && sl.parentNode;
  var hd = box && box.querySelector('.rangeslider__handle'), tr = box && box.querySelector('.rangeslider');
  if (!sl || !hd || !tr) return { skip: 'no rangeslider for the mass-loss alert' };
  var hc = document.getElementById('helloContainer');
  var was = defaultmapsettings.massLossPct, tf0 = hc.style.transform, hidden = [];
  var min = +sl.min, max = +sl.max, step = +sl.step || 1;
  var cx = function (r) { return r.left + r.width / 2; };
  try {
    $('#overlays').show(); $('#helloContainer').show();
    $('.settings-tab a').trigger('click'); await sleep(400);
    $(sl).parents().each(function () { if (this.style && getComputedStyle(this).display === 'none') { hidden.push([this, this.style.display]); this.style.display = 'block'; } });
    var check = async function (name) {
      $('[id^="LMPromo"]').remove();
      box.scrollIntoView({ block: 'center' });
      try { $('#og-settings .submenu-panel').perfectScrollbar('update'); } catch (e) { }
      await sleep(250);
      var trr = tr.getBoundingClientRect(), s = trr.width / (tr.offsetWidth || 1);
      var hr0 = hd.getBoundingClientRect();
      /* half a step of knob travel on screen, plus rounding */
      var tol = (trr.width - hr0.width) / ((max - min) / step) / 2 + 3;
      var row = { scale: +s.toFixed(3), track: [Math.round(trr.left), Math.round(trr.width)], tol: +tol.toFixed(1) };
      info[name] = row;
      var y = trr.top + trr.height / 2;
      var at = document.elementFromPoint(trr.left + trr.width * 0.8, y);
      if (!at || !tr.contains(at)) { fail.push(name + ': the track is covered by ' + (at ? at.tagName + '.' + at.className : 'nothing')); return; }
      /* a click at 80% of the track: the knob comes under the pointer */
      var x1 = trr.left + trr.width * 0.8;
      $(sl).val(min).change(); await sleep(100);
      await input({ type: 'click', x: x1, y: y }); await sleep(200);
      var k1 = cx(hd.getBoundingClientRect());
      row.click = [Math.round(x1), Math.round(k1), sl.value];
      if (Math.abs(k1 - x1) > tol) fail.push(name + ': a click at x ' + Math.round(x1) + ' put the knob at ' + Math.round(k1) + ' (value ' + sl.value + ')');
      /* a drag of the knob by 40% of the track: the knob follows the pointer */
      var hr = hd.getBoundingClientRect(), hx = cx(hr), hy = hr.top + hr.height / 2, D = -trr.width * 0.4;
      await input({ type: 'mousedown', x: hx, y: hy });
      await input({ type: 'move', x: hx + D / 2, y: hy });
      await input({ type: 'move', x: hx + D, y: hy });
      var k2 = cx(hd.getBoundingClientRect());
      await input({ type: 'mouseup', x: hx + D, y: hy }); await sleep(200);
      row.drag = [Math.round(hx), Math.round(hx + D), Math.round(k2), sl.value];
      if (Math.abs(k2 - (hx + D)) > tol) fail.push(name + ': the knob dragged to x ' + Math.round(hx + D) + ' is at ' + Math.round(k2) + ' (value ' + sl.value + ')');
      if (String(defaultmapsettings.massLossPct) !== String(sl.value)) fail.push(name + ': setting ' + defaultmapsettings.massLossPct + ' != slider ' + sl.value);
    };
    await check('own');
    /* shrink the menu as on a phone or a short window */
    if (info.own && info.own.scale > 0.95) {
      hc.style.transform = 'scale(0.7)';
      await sleep(150);
      await check('scaled');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    hc.style.transform = tf0;
    $(sl).val(was).change();
    defaultmapsettings.massLossPct = was;
    try { application.saveSettings(defaultmapsettings, 'ogarioSettings'); } catch (e) { }
    hidden.forEach(function (h) { h[0].style.display = h[1]; });
  }
  return { fail: fail, info: info };
})()
