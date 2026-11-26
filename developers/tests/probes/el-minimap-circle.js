// Expanding Land: the minimap is a circle, with Rounded corners (Theme > HUD) off and on (the switch
// pressed with a real click or tap). Since 3.694 the HUD corners stylesheet is always there and gives
// #minimap-hud its corners with !important, which made the circle square again. The switch and the
// stored theme are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.legendmod && legendmod.isLegendWorld && window.application && application._miniMapCircle); w++) await sleep(250);
  if (!(window.legendmod && legendmod.isLegendWorld && application._miniMapCircle)) return { skip: 'not on Expanding Land' };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var mm = document.getElementById('minimap-hud');
  var round = function () {
    var cs = getComputedStyle(mm), w = mm.offsetWidth, h = mm.offsetHeight;
    var px = function (v) { return /%$/.test(v) ? parseFloat(v) / 100 * Math.min(w, h) : parseFloat(v); };
    var r = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius];
    /* a circle (or an ellipse that fills the box): every corner at least a third of the side */
    return { ok: r.every(function (v) { return px(v) >= Math.min(w, h) / 3; }), r: r.join(' '), overflow: cs.overflow };
  };
  var stored = null;
  try { stored = localStorage.getItem('ogarioThemeSettings'); } catch (e) { }
  var cb = document.getElementById('hudRoundedCorners');
  var was = defaultSettings.hudRoundedCorners === true;
  var activeTab = $('.menu-tabs li.active a').first(), activeSub = $('#theme .submenu-tabs li.active a').first();
  var aside = [];
  $('.modal.in, .modal[style*="block"], .modal-backdrop').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  var press = function () {
    var sw = cb && cb.nextElementSibling && cb.nextElementSibling.classList.contains('switchery') ? cb.nextElementSibling : cb;
    try { sw.scrollIntoView({ block: 'center' }); } catch (e) { }
    var r = sw.getBoundingClientRect();
    return new Promise(function (res) {
      var id = 'elc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 300); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }));
    });
  };
  try {
    info.start = round();
    if (!info.start.ok) fail.push('the minimap is not a circle (corners ' + info.start.r + ', Rounded corners ' + (was ? 'on' : 'off') + ')');
    if (info.start.overflow !== 'hidden') fail.push('the minimap does not clip to its circle (overflow ' + info.start.overflow + ')');
    if (cb) {
      $('.theme-tab a').first().trigger('click');
      $('.theme-hud-tab a').first().trigger('click');
      await sleep(200);
      await press();
      info.corners = defaultSettings.hudRoundedCorners;
      if (defaultSettings.hudRoundedCorners === was) fail.push('the Rounded corners switch did not change on a ' + (mobile ? 'tap' : 'click'));
      info.toggled = round();
      if (!info.toggled.ok) fail.push('with Rounded corners ' + (was ? 'off' : 'on') + ' the minimap is not a circle (corners ' + info.toggled.r + ')');
      if (defaultSettings.hudRoundedCorners !== was) await press();
      if (defaultSettings.hudRoundedCorners !== was) fail.push('the switch did not go back');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    aside.forEach(function (a) { a[0].style.display = a[1]; });
    if (activeSub.length) activeSub.trigger('click');
    if (activeTab.length) activeTab.trigger('click');
    await sleep(700);
    try { if (stored == null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', stored); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
