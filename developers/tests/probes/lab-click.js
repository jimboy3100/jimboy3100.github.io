// Lab experiments in the User Scripts window (the Settings tab has no Lab section any more): a real
// click (mouse on desktop, touch tap on mobile, sent by the smoke harness) on the switch of an
// experiment the probe registers (the Lab has no built-in experiment) turns it on and off, stores
// it in its own key 'lmLab' (not in the settings) and leaves the window's list where it was (made
// to scroll here: a redraw after the switch must keep its place); LMLab.open() opens the window at
// the experiments; the switch is the window's own (as "Runs at start"); "Turn all experiments off"
// is there while there is an experiment. Until 3.647 a Lab row was a plain checkbox under the
// settings list's scroll bar rail: the click scrolled the list up and never ticked the box. The
// stats option "Frame time in the FPS counter" (it was the Lab's experiment) adds the frame time to
// the FPS in the stats line. The player's Lab state and menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var frames = function () { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(r, 0); }); }); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMLab && window.LMPlugins && document.getElementById('lm-us-bar')); w++) await sleep(250);
  if (!window.LMLab) return { fail: ['LMLab missing'], info: info };
  if (!window.LMPlugins || !document.getElementById('lm-us-bar')) return { fail: ['User Scripts window not built'], info: info };
  if (document.querySelector('#og-options .lmLabGroup')) fail.push('the Settings tab still has a Lab section');
  var XID = 'labClickProbe';
  var savedStore = localStorage.getItem('lmLab');
  LMLab.register({ id: XID, name: 'Lab click probe', onEnable: function () { window._lmLabClickProbe = true; }, onDisable: function () { window._lmLabClickProbe = false; } });
  var wasOn = LMLab.isEnabled(XID);
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  info.input = mobile ? 'tap' : 'click';
  var realInput = function (x, y) {
    return new Promise(function (res) {
      var id = 'lab' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify({ id: id, type: mobile ? 'tap' : 'click', x: x, y: y }));
    });
  };
  var hc = document.getElementById('helloContainer'), ov = document.getElementById('overlays');
  var shown = function (el) { return !!(el && el.getClientRects().length && el.getBoundingClientRect().height > 0); };
  var hcHidden = !shown(hc), ovHidden = !shown(ov), usWasOpen = LMPlugins.isOpen();
  var activeTab = $('.menu-tabs li.active a').first();
  /* windows shown over the menu at start (promotions) are put aside while clicking */
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  var ext = document.getElementById('lm-us-ext'), extMax = ext ? ext.style.maxHeight : '';
  var box = function () { return document.getElementById('lmLab-' + XID); };
  try {
    if (ovHidden) $(ov).show();
    if (hcHidden) $(hc).show();
    if (wasOn) LMLab.set(XID, false);
    LMLab.open();
    await sleep(300);
    if (!LMPlugins.isOpen()) fail.push('LMLab.open() did not open the User Scripts window');
    var cb = box();
    if (!cb) return { fail: fail.concat(['no switch for a registered experiment in the User Scripts window']), info: info };
    if (!$(cb).closest('#userscripts #lm-us-ext #lm-us-exps').length) fail.push('the experiment is not in the Experiments group of the User Scripts window');
    if (!document.querySelector('#lm-us-exps #lm-lab-reset')) fail.push('no "Turn all experiments off" button next to the experiments');
    /* the window's own switch, like a slot's "Runs at start" */
    var row = cb.closest('label');
    info.switchClass = row ? row.className : '';
    if (!row || !row.classList.contains('lm-us-tg')) fail.push('the experiment switch is not the window\'s switch (label.lm-us-tg)');
    var slotTg = document.querySelector('#lm-us-ext [data-slot-toggle]');
    var a = getComputedStyle(cb), b = slotTg ? getComputedStyle(slotTg) : null;
    info.size = [a.width, a.height, b ? b.width : '-'];
    if (b ? (a.width !== b.width || a.height !== b.height) : a.width !== '18px') fail.push('experiment switch size ' + a.width + ' x ' + a.height + ' differs from the window\'s switches');
    /* the list made to scroll, the row in its middle: a click must not move it */
    ext.style.maxHeight = '140px';
    await frames();
    /* screen pixels -> the list's own (the menu is scaled down on a phone) */
    var scale = ext.getBoundingClientRect().height / (ext.offsetHeight || 1) || 1;
    ext.scrollTop = ext.scrollTop + (box().getBoundingClientRect().top - ext.getBoundingClientRect().top) / scale - 60;
    info.scale = Math.round(scale * 1000) / 1000;
    await frames();
    info.scrollable = ext.scrollHeight > ext.clientHeight + 2;
    info.scrollTop = ext.scrollTop;
    if (!info.scrollable || !(ext.scrollTop > 0)) fail.push('the User Scripts list did not scroll for the test');
    var click = async function (want, tag) {
      var c = box(), r = c.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var hit = document.elementFromPoint(x, y);
      if (!hit || !c.closest('label').contains(hit)) fail.push(tag + ': the switch is covered by ' + (hit ? (hit.id || String(hit.className) || hit.nodeName) : 'nothing'));
      var top0 = ext.scrollTop;
      if (!(await realInput(x, y))) { fail.push(tag + ': the harness did not send the input'); return; }
      await sleep(400);
      c = box();
      var stored = !!((JSON.parse(localStorage.getItem('lmLab') || '{}').on || {})[XID]);
      info[tag] = { checked: c && c.checked, stored: stored, on: !!window._lmLabClickProbe, scrollMoved: Math.round(ext.scrollTop - top0) };
      if (!c || c.checked !== want || LMLab.isEnabled(XID) !== want) fail.push(tag + ': the switch is ' + (c && c.checked ? 'on' : 'off') + ', expected ' + (want ? 'on' : 'off'));
      if (stored !== want) fail.push(tag + ': lmLab stored ' + stored);
      if (!!window._lmLabClickProbe !== want) fail.push(tag + ': experiment flag ' + window._lmLabClickProbe);
      if (Math.abs(ext.scrollTop - top0) > 1) fail.push(tag + ': the User Scripts list scrolled by ' + Math.round(ext.scrollTop - top0) + ' px');
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
    /* switched from a script: the switch follows */
    LMLab.set(XID, true);
    await sleep(50);
    if (!box() || !box().checked) fail.push('LMLab.set(on) did not move the switch');
    LMLab.set(XID, false);
    await sleep(50);
    if (!box() || box().checked) fail.push('LMLab.set(off) did not move the switch');
  } finally {
    if (ext) ext.style.maxHeight = extMax;
    try { LMLab.set(XID, wasOn); } catch (e) { }
    try { if (savedStore === null) localStorage.removeItem('lmLab'); else localStorage.setItem('lmLab', savedStore); } catch (e) { }
    if (!usWasOpen) try { LMPlugins.close(); } catch (e) { }
    if (activeTab.length) activeTab.trigger('click');
    if (hcHidden) $(hc).hide();
    if (ovHidden) $(ov).hide();
    aside.forEach(function (m) { m[0].style.display = m[1]; });
  }
  return { fail: fail, info: info };
})()
