// Settings > Lab: a real click (mouse on desktop, touch tap on mobile, sent by the smoke harness)
// on a Lab experiment's switch (one the probe registers: the Lab has no built-in experiment since
// "Frame time in the FPS counter" became the Stats option showStatsFrameTime) turns it on and off,
// stores it in its own key 'lmLab' (not in the settings) and leaves the settings list where it was;
// the stats option adds the frame time to the FPS in the stats line. Until 3.647 the row was a plain checkbox at the far right of a
// row without padding, under the list's scroll bar rail: the click hit the rail, which scrolled
// the list up, and the box was never ticked. The row is checked to look like the other options
// (Switchery switch, same label padding). The player's Lab state, tab and menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var frames = function () { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(r, 0); }); }); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMLab && document.querySelector('#og-options .lmLabGroup .lm-lab-acts')); w++) await sleep(250);
  if (!window.LMLab) return { fail: ['LMLab missing'], info: info };
  var XID = 'labClickProbe';
  LMLab.register({ id: XID, name: 'Lab click probe', onEnable: function () { window._lmLabClickProbe = true; }, onDisable: function () { window._lmLabClickProbe = false; } });
  var cb = document.getElementById('lmLab-' + XID);
  if (!cb) return { fail: ['no Lab switch for a registered experiment'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  info.input = mobile ? 'tap' : 'click';
  var realInput = function (x, y) {
    return new Promise(function (res) {
      var id = 'lab' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var savedStore = localStorage.getItem('lmLab'), wasOn = LMLab.isEnabled(XID);
  var hc = document.getElementById('helloContainer'), ov = document.getElementById('overlays');
  var shown = function (el) { return !!(el && el.getClientRects().length && el.getBoundingClientRect().height > 0); };
  var hcHidden = !shown(hc), ovHidden = !shown(ov);
  var activeTab = $('.menu-tabs li.active a').first();
  /* windows shown over the menu at start (promotions) are put aside while clicking */
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { if (!this.contains(cb)) { aside.push([this, this.style.display]); this.style.display = 'none'; } });
  var sc = null, top0 = 0;
  try {
    if (ovHidden) $(ov).show();
    if (hcHidden) $(hc).show();
    $('.menu-tabs a[href="#og-settings"]').trigger('click');
    await sleep(300);
    if (wasOn) LMLab.set(XID, false);
    /* rebuilt after the menu made its switches (a language change, a plugin's experiment) */
    LMLab._mount();
    cb = document.getElementById('lmLab-' + XID);
    for (sc = cb.parentElement; sc && !(sc.scrollHeight > sc.clientHeight + 2 && /auto|scroll|hidden/.test(getComputedStyle(sc).overflowY)); sc = sc.parentElement) { }
    if (!sc) return { fail: ['no scroll list around the Lab section'], info: info };
    var row = cb.closest('label');
    row.scrollIntoView({ block: 'center' });
    try { $(sc).perfectScrollbar('update'); } catch (e) { }
    await frames();
    /* the look: a Switchery switch and the label padding of the other options */
    var sw = cb.nextElementSibling && cb.nextElementSibling.classList.contains('switchery') ? cb.nextElementSibling : null;
    var other = document.querySelector('#og-options .perfGroup label') || document.querySelector('#og-options .options-box label');
    info.switchery = !!sw;
    if (!sw) fail.push('the Lab row has no Switchery switch like the other options');
    if (row.querySelectorAll('.switchery').length > 1) fail.push('the Lab row has ' + row.querySelectorAll('.switchery').length + ' switches');
    if (other) {
      var a = getComputedStyle(row), b = getComputedStyle(other);
      info.padding = [a.paddingLeft, a.paddingRight, b.paddingLeft, b.paddingRight];
      if (a.paddingLeft !== b.paddingLeft || a.paddingRight !== b.paddingRight || a.fontSize !== b.fontSize) fail.push('Lab row padding/size ' + a.paddingLeft + ' ' + a.paddingRight + ' ' + a.fontSize + ' differs from the other options ' + b.paddingLeft + ' ' + b.paddingRight + ' ' + b.fontSize);
    }
    var target = sw || cb;
    var click = async function (want, tag) {
      var r = target.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var hit = document.elementFromPoint(x, y);
      if (!hit || !row.contains(hit)) fail.push(tag + ': the switch is covered by ' + (hit ? (hit.id || String(hit.className) || hit.nodeName) : 'nothing'));
      top0 = sc.scrollTop;
      if (!(await realInput(x, y))) { fail.push(tag + ': the harness did not send the input'); return; }
      await sleep(400);
      var stored = !!((JSON.parse(localStorage.getItem('lmLab') || '{}').on || {})[XID]);
      info[tag] = { checked: cb.checked, stored: stored, on: !!window._lmLabClickProbe, scrollMoved: Math.round(sc.scrollTop - top0) };
      if (cb.checked !== want || LMLab.isEnabled(XID) !== want) fail.push(tag + ': the switch is ' + (cb.checked ? 'on' : 'off') + ', expected ' + (want ? 'on' : 'off'));
      if (stored !== want) fail.push(tag + ': lmLab stored ' + stored);
      if (!!window._lmLabClickProbe !== want) fail.push(tag + ': experiment flag ' + window._lmLabClickProbe);
      if (Math.abs(sc.scrollTop - top0) > 1) fail.push(tag + ': the settings list scrolled by ' + Math.round(sc.scrollTop - top0) + ' px');
      if (sw && sw.querySelector('small') && want !== (parseFloat(sw.querySelector('small').style.left) > 0)) fail.push(tag + ': the switch knob did not move');
    };
    await click(true, 'on');
    /* the Stats option shows the frame time next to the FPS (Stats on, FPS on) */
    var ds = defaultmapsettings, keep = { showStats: ds.showStats, showStatsFPS: ds.showStatsFPS, showStatsFrameTime: ds.showStatsFrameTime }, fps = drawRender.fps;
    try {
      ds.showStats = true; ds.showStatsFPS = true; ds.showStatsFrameTime = true;
      if (!(drawRender.fps > 0)) drawRender.fps = 60;
      application.displayStats();
      var line = application.statsHUD ? application.statsHUD.textContent : '';
      info.statsLine = line.slice(0, 80);
      if (!/FPS: \d+ \(\d+\.\d ms\)/.test(line)) fail.push('the stats line shows no frame time: ' + line.slice(0, 80));
    } finally {
      drawRender.fps = fps; ds.showStats = keep.showStats; ds.showStatsFPS = keep.showStatsFPS; ds.showStatsFrameTime = keep.showStatsFrameTime;
      try { application.displayStats(); } catch (e) { }
    }
    if (Object.prototype.hasOwnProperty.call(defaultmapsettings, 'lmLab-' + XID)) fail.push('the Lab switch went into the settings (exported)');
    await click(false, 'off');
    /* switched from a script / the Command Centre: the switch follows */
    var knob = function () { var k = sw && sw.querySelector('small'); return k ? parseFloat(k.style.left) > 0 : cb.checked; };
    LMLab.set(XID, true);
    if (!cb.checked || !knob()) fail.push('LMLab.set(on) did not move the switch');
    LMLab.set(XID, false);
    if (cb.checked || knob()) fail.push('LMLab.set(off) did not move the switch');
  } finally {
    try { LMLab.set(XID, wasOn); } catch (e) { }
    try { if (savedStore === null) localStorage.removeItem('lmLab'); else localStorage.setItem('lmLab', savedStore); } catch (e) { }
    if (activeTab.length) activeTab.trigger('click');
    if (hcHidden) $(hc).hide();
    if (ovHidden) $(ov).hide();
    aside.forEach(function (m) { m[0].style.display = m[1]; });
  }
  return { fail: fail, info: info };
})()
