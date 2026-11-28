// One real click on a Settings switch runs its setting once, with the new value. Switchery sent a
// change with the box's old value first (the box is in a label, which then ticks it), so every
// click ran the setting twice, first backwards.
(async () => {
  var fail = [], info = {}, ms = window.defaultmapsettings, A = window.application;
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  var sleep = function (t) { return new Promise(function (r) { setTimeout(r, t); }); };
  var frames = function () { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); }); };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var seq = 0;
  var real = function (x, y) {
    return new Promise(function (res) {
      var id = 'sw1-' + (++seq) + '-' + Date.now();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var shown = function (el) { return !!(el && el.getClientRects().length && el.getBoundingClientRect().height > 0); };
  var hc = document.getElementById('helloContainer'), ov = document.getElementById('overlays');
  var hcHidden = !shown(hc), ovHidden = !shown(ov);
  var activeTab = $('.menu-tabs li.active a').first();
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  var keys = ['noNames'];
  var keep = {}; keys.forEach(function (k) { keep[k] = ms[k]; });
  var calls = [];
  var origSet = A.setSettings;
  /* a click on the switch, as a player does (the Switchery knob in the setting's row) */
  var press = async function (id) {
    var sw = $('#' + id).closest('label').find('.switchery')[0];
    if (!sw) { fail.push('no switch for ' + id); return; }
    sw.scrollIntoView({ block: 'center' });
    await frames();
    var r = sw.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var hit = document.elementFromPoint(x, y);
    if (!hit || !(hit === sw || sw.contains(hit))) fail.push(id + ': switch covered by ' + (hit ? hit.tagName + '#' + hit.id + '.' + hit.className + (hit.src ? ' ' + String(hit.src).slice(0, 80) : '') : 'nothing'));
    calls.length = 0;
    await real(x, y);
    await sleep(400);
  };
  try {
    if (ovHidden) $(ov).show();
    if (hcHidden) $(hc).show();
    $('.settings-tab a').first().trigger('click');
    await sleep(300);
    A.setSettings = function (id, v) { calls.push(id + '=' + v); return origSet.apply(this, arguments); };
    /* a plain switch: one call with the new value */
    var nn = ms.noNames;
    await press('noNames');
    info.noNames = calls.slice();
    if (calls.join() !== 'noNames=' + !nn) fail.push('one click on No names ran: ' + (calls.join(', ') || 'nothing') + ' (expected noNames=' + !nn + ' once)');
    await press('noNames');
    if (ms.noNames !== nn) fail.push('No names not back after a second click');
  } catch (e) {
    fail.push('error: ' + (e && e.message || e));
  } finally {
    A.setSettings = origSet;
    /* the settings as they were */
    keys.forEach(function (k) {
      if (ms[k] === keep[k]) return;
      var cb = document.getElementById(k);
      if (cb && cb.type === 'checkbox') { cb.checked = !!keep[k]; cb.dispatchEvent(new Event('change', { bubbles: true })); }
      else if ($('#' + k + '-slider').length) $('#' + k + '-slider').val(keep[k]).trigger('input').trigger('change');
      else ms[k] = keep[k];
    });
    try { A.saveSettings(ms, 'ogarioSettings'); } catch (e) { }
    aside.forEach(function (a) { a[0].style.display = a[1]; });
    if (activeTab.length) activeTab.trigger('click');
    if (hcHidden) $(hc).hide();
    if (ovHidden) $(ov).hide();
  }
  return { fail: fail, info: info };
})()
