// Settings > Accessibility > Menu text size: a real click (a tap on a phone) on its slider changes
// the menu text right away. The slider is a rangeslider widget (jQuery events); its save announces
// the change (settingsChange), which accessibility.js follows since its 2 s check was removed.
// The setting and the text size are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !(window.LMAccessibility && document.getElementById('a11yTextScale-slider')); w++) await sleep(250);
  var A = window.LMAccessibility, sl = document.getElementById('a11yTextScale-slider');
  if (!A || !sl) return { skip: 'LMAccessibility or the menu text size slider missing' };
  var S = window.legendmod5 || window.defaultmapsettings;
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var realInput = function (x, y) {
    return new Promise(function (res) {
      var id = 'a11ys' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var scale = function () { return Number(getComputedStyle(document.documentElement).getPropertyValue('--lm-font-scale')); };
  var old = S.a11yTextScale, oldStore = null;
  try { oldStore = localStorage.getItem('ogarioSettings'); } catch (e) { }
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  var hcHidden = !$('#overlays').is(':visible'), activeTab = $('.menu-tabs li.active a').first();
  try {
    if (hcHidden) $('#overlays').show();
    if (!$('#og-settings').is(':visible')) { $('.settings-tab a').first().trigger('click'); await sleep(300); }
    $('#lm-settings-search').val('').trigger('input');
    await sleep(200);
    $(sl).val(1).trigger('input').trigger('change');
    A.sync();
    await sleep(100);
    var widget = sl.nextElementSibling && sl.nextElementSibling.classList.contains('rangeslider') ? sl.nextElementSibling : null;
    if (!widget) return { fail: ['no slider widget next to the menu text size slider'], info: info };
    widget.scrollIntoView({ block: 'center' });
    await sleep(150);
    var r = widget.getBoundingClientRect();
    info.before = scale();
    await realInput(r.left + r.width * 0.5, r.top + r.height / 2);
    await sleep(300);
    info.setting = S.a11yTextScale;
    info.after = scale();
    if (!(S.a11yTextScale > 1)) fail.push('the click did not change the setting (' + S.a11yTextScale + ')');
    else if (info.after !== S.a11yTextScale) fail.push('menu text scale ' + info.after + ' 300 ms after the slider went to ' + S.a11yTextScale);
  } finally {
    $(sl).val(old).trigger('input').trigger('change');
    S.a11yTextScale = old;
    try { if (oldStore === null) localStorage.removeItem('ogarioSettings'); else localStorage.setItem('ogarioSettings', oldStore); } catch (e) { }
    A.sync();
    $('#lm-settings-search').val('').trigger('input');
    activeTab.trigger('click');
    if (hcHidden) $('#overlays').hide();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
