// Theme workshop, real clicks (mouse on desktop, touch tap on mobile): Preview of a built-in preset
// and its Revert move the knobs of the Theme tab sliders to the values they set. Until 3.695 the
// workshop set the slider's value and its number but not its knob (rangeslider), so after Apply,
// Preview or Revert the knobs stayed where they were (a knob showed 20 next to "40"). The stored
// theme and the menu tabs are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMThemeWorkshop && LMThemeWorkshop.core && $('#theme .lm-tw-open').length); w++) await sleep(250);
  var TW = window.LMThemeWorkshop;
  if (!TW || !TW.core || !$('#theme .lm-tw-open').length) return { fail: ['Theme workshop not loaded'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var press = function (el) {
    return new Promise(function (res) {
      try { el.scrollIntoView({ block: 'center' }); } catch (e) { }
      var r = el.getBoundingClientRect(), id = 'twk' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 300); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }));
    });
  };
  /* knobs that are not where their value puts them: the fill before and after the slider's own update */
  var offKnobs = function (keys) {
    var out = [];
    keys.forEach(function (k) {
      var sl = $('#' + k + '-slider'), fill = sl.next('.rangeslider').find('.rangeslider__fill')[0];
      if (!fill) return;
      var before = fill.style.width;
      sl.trigger('change');
      if (fill.style.width !== before) out.push(k + ' (knob at ' + before + ', value ' + sl.val() + ' is at ' + fill.style.width + ')');
    });
    return out;
  };
  var stored = null;
  try { stored = localStorage.getItem('ogarioThemeSettings'); } catch (e) { }
  var activeTab = $('.menu-tabs li.active a').first();
  /* windows shown over the menu (promotions, also ones that open late) are put aside */
  var aside = [];
  var putAside = function () { $('.modal.in, .modal[style*="block"], .modal-backdrop').each(function () { if (this.style.display === 'none') return; aside.push([this, this.style.display]); this.style.display = 'none'; }); };
  putAside();
  var hc = document.getElementById('helloContainer'), hcHide = hc && !$(hc).is(':visible');
  try {
    if (hcHide) $(hc).show();
    $('.theme-tab a').first().trigger('click');
    $('.theme-main-tab a').first().trigger('click');
    await sleep(200);
    var sliders = $('#theme input[type=range]').map(function () { return this.id.replace(/-slider$/, ''); }).get();
    var pick = null;
    TW.core.builtins().forEach(function (b) {
      if (pick) return;
      var m = TW.core.presetMap(b);
      var ks = m ? Object.keys(m).filter(function (k) { return sliders.indexOf(k) >= 0 && String(m[k]) !== String(defaultSettings[k]); }) : [];
      if (ks.length) pick = { bid: b.bid, keys: ks };
    });
    info.pick = pick;
    if (!pick) return { skip: 'no built-in preset changes a slider here', info: info };
    var before = {};
    pick.keys.forEach(function (k) { before[k] = defaultSettings[k]; });
    for (var tries = 0; tries < 3 && !TW.isOpen(); tries++) { putAside(); await press($('#theme .lm-tw-open')[0]); }
    if (!TW.isOpen()) {
      var ob = $('#theme .lm-tw-open')[0], obr = ob.getBoundingClientRect(), hit = document.elementFromPoint(obr.left + obr.width / 2, obr.top + obr.height / 2);
      info.hit = hit ? hit.tagName + '#' + hit.id + '.' + hit.className : 'nothing';
      fail.push('the Theme workshop did not open on a click');
      return { fail: fail, info: info };
    }
    putAside();
    await press($('#lm-tw .lm-tw-tabs button[data-tab=gallery]')[0]);
    var pv = $('#lm-tw .lm-tw-bitem[data-bid="' + pick.bid + '"] [data-act=bpv]')[0];
    if (!pv) { fail.push('no Preview button for ' + pick.bid); return { fail: fail, info: info }; }
    await press(pv);
    if (!TW.previewing()) fail.push('Preview did not start');
    info.preview = pick.keys.map(function (k) { return k + '=' + defaultSettings[k]; });
    var off = offKnobs(pick.keys);
    if (off.length) fail.push('after Preview: ' + off.join('; '));
    var rv = $('#lm-tw-pv [data-pv=revert]')[0];
    if (rv) await press(rv); else fail.push('no Revert button');
    if (TW.previewing()) fail.push('Revert did not end the preview');
    pick.keys.forEach(function (k) { if (String(defaultSettings[k]) !== String(before[k])) fail.push(k + ' is ' + defaultSettings[k] + ' after Revert, was ' + before[k]); });
    off = offKnobs(pick.keys);
    if (off.length) fail.push('after Revert: ' + off.join('; '));
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { if (TW.previewing()) TW.revert(); } catch (e) { }
    try { TW.close(); } catch (e) { }
    if (hcHide) $(hc).hide();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
    if (activeTab.length) activeTab.trigger('click');
    await sleep(700);
    try { if (stored == null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', stored); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
