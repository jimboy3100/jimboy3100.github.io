// Main menu layout (window.lmMenuFit): on every tab the top bar, tab bar, the list and the footer
// (Export/Import, restore links, version line) are inside the window, and the last row of every
// scroll list is reached by scrolling (wheel too). Checked at this window, at hudScale 0.5 and
// 1.5, with the menu text scale at 1.6, and for smaller and bigger windows (the size the fit
// reads is replaced; the menu layout is real). The fitted scale is never stored in hudScale.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var frames = function () { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(r, 0); }); }); }); };
  var opts = window.__lmMenuFitProbe || {};
  var hc = document.getElementById('helloContainer');
  if (typeof window.lmMenuFit !== 'function' || !hc) return { fail: ['no lmMenuFit / #helloContainer'], info: info };
  var shown = function (el) { return !!(el && el.getClientRects().length && el.getBoundingClientRect().height > 0); };
  var wasHidden = !shown(hc);
  if (wasHidden) { $('#overlays').show(); $(hc).show(); await frames(); }
  var activeTab = $('.menu-tabs li.active a').first();
  var lastShown = function (el) {
    for (var c = el.lastElementChild; c; c = c.previousElementSibling) {
      if (/ps-scrollbar/.test(String(c.className)) || !shown(c)) continue;
      var p = getComputedStyle(c).position;
      if (p !== 'absolute' && p !== 'fixed') return c;
    }
    return null;
  };
  /* one tab (or Theme sub-tab): every part on screen, the list scrolls to its last row */
  var check = function (tag, vw, vh) {
    var bad = [];
    var inside = function (name, el) {
      if (!shown(el)) return;
      var r = el.getBoundingClientRect();
      if (r.top < -1 || r.left < -1 || r.bottom > vh + 1 || r.right > vw + 1) bad.push(name + ' ' + Math.round(r.left) + ',' + Math.round(r.top) + '..' + Math.round(r.right) + ',' + Math.round(r.bottom));
    };
    inside('menu', hc);
    $('#helloContainer #exp-bar').each(function (i) { inside('top bar ' + i, this); });
    inside('tab bar', $('#main-menu .menu-tabs')[0]);
    inside('version line', document.getElementById('menu-footer'));
    var panel = $('#main-menu > .menu-panel').filter(function () { return shown(this); })[0];
    var region = panel && $(panel).children('.submenu-panel').filter(function () { return shown(this); })[0];
    if (panel) $(panel).children().each(function () { if (this !== region && !$(this).hasClass('submenu-tabs')) inside('footer ' + (this.className || this.tagName).split(' ').slice(-1)[0], this); });
    if (panel) inside('sub-tabs', $(panel).children('.submenu-tabs')[0]);
    if (region) {
      inside('list', region);
      var rr = region.getBoundingClientRect();
      if (rr.height < 60) bad.push('list only ' + Math.round(rr.height) + ' px high');
      if (getComputedStyle(region).overflowY !== 'hidden') bad.push('list has a native scrollbar next to the plugin one');
      if (hc.scrollHeight > hc.clientHeight + 2 && getComputedStyle(hc).overflowY !== 'visible') bad.push('menu box scrolls itself');
      region.scrollTop = region.scrollHeight;
      var row = region;
      for (var d = 0; d < 3; d++) { var n = lastShown(row); if (!n) break; row = n; }
      var lr = row.getBoundingClientRect();
      rr = region.getBoundingClientRect();
      if (row !== region && (lr.bottom > rr.bottom + 2 || lr.bottom < rr.top)) bad.push('last row not reachable (' + Math.round(lr.bottom) + ' vs list ' + Math.round(rr.top) + '..' + Math.round(rr.bottom) + ')');
      region.scrollTop = 0;
    }
    if (bad.length) fail.push(tag + ': ' + bad.join('; '));
    return region;
  };
  /* a tab link, then its panel shown and the size observer's refit done */
  var openTab = async function (a) {
    $(a).trigger('click');
    var href = $(a).attr('href'), t0 = Date.now();
    while (href && href.charAt(0) === '#' && !shown($(href)[0]) && Date.now() - t0 < 2000) await sleep(50);
    await frames();
  };
  var tabs = ['.start-tab a', '.settings-tab a', '.legend-tab a', '.theme-tab a', '.music-tab a', '.profile-tab a'];
  /* quick: the settings and theme lists and the tallest tabs without a list (the full pass, with
   * every Theme sub-tab, is for this window) */
  var quickTabs = ['.start-tab a', '.settings-tab a', '.theme-tab a', '.profile-tab a'];
  var allTabs = async function (tag, vw, vh, quick) {
    var list = quick ? quickTabs : tabs;
    for (var i = 0; i < list.length; i++) {
      var a = $(list[i]).first();
      if (!a.length) continue;
      await openTab(a[0]);
      var t = tag + ' ' + list[i].split(' ')[0].slice(1);
      check(t, vw, vh);
      if (list[i] === '.theme-tab a' && !quick) {
        var subs = $('#theme .submenu-tabs a');
        for (var j = 0; j < subs.length; j++) { await openTab(subs[j]); check(t + '/' + ($(subs[j]).attr('href') || j), vw, vh); }
        if (subs.length) await openTab(subs[0]);
      }
    }
    var p = window.lmMenuFit();
    return p ? p.scale : null;
  };
  var ds = window.defaultSettings || {}, hs0 = ds.hudScale;
  var a11y = window.legendmod5 || window.defaultmapsettings || {}, ts0 = a11y.a11yTextScale;
  try {
    /* this window */
    info.here = innerWidth + 'x' + innerHeight + ' scale ' + (await allTabs('here', innerWidth, innerHeight));
    /* the settings list fills the room left by the header and footer (it was 640/590/490 px whatever they were) */
    await openTab($('.settings-tab a')[0]);
    var reg = $('#og-settings > .submenu-panel')[0];
    if (reg) {
      /* the wheel scrolls the list (perfect-scrollbar) */
      reg.scrollTop = 0;
      reg.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, deltaMode: 0, bubbles: true, cancelable: true }));
      await frames();
      if (!(reg.scrollTop > 0)) fail.push('wheel does not scroll the settings list');
      reg.scrollTop = 0;
      info.list = Math.round(reg.getBoundingClientRect().height) + 'px';
    }
    /* hudScale: the player's value is the scale when it fits, and it is never changed by the fit */
    for (var hs of [0.5, 1.5]) {
      ds.hudScale = hs;
      if (hs <= 1 && window.application && typeof application.setHudScale === 'function') application.setHudScale(); else window.lmMenuFit();
      await frames();
      var sc = await allTabs('hudScale ' + hs, innerWidth, innerHeight, true);
      info['hud' + hs] = sc;
      if (ds.hudScale !== hs) fail.push('hudScale ' + hs + ' was changed to ' + ds.hudScale);
      if (sc > hs + 1e-6) fail.push('menu scale ' + sc + ' above hudScale ' + hs);
    }
    ds.hudScale = hs0;
    /* bigger menu text: refitted by the size observer, nothing calls the fit here */
    if (window.LMAccessibility && typeof LMAccessibility.sync === 'function') {
      a11y.a11yTextScale = 1.6;
      LMAccessibility.sync(true);
      await sleep(150); await frames();
      await allTabs('text 1.6', innerWidth, innerHeight, true);
    }
    /* other window sizes: the fit reads these sizes (layout and rectangles are real) */
    if (!opts.noSim) {
      var dw = Object.getOwnPropertyDescriptor(window, 'innerWidth'), dh = Object.getOwnPropertyDescriptor(window, 'innerHeight');
      /* the stylesheet breakpoints (820/821, 650/651) need real window sizes: checked with a screenshot driver */
      var sizes = opts.sizes || [[1366, 768], [1366, 650], [1920, 1080], [915, 412], [412, 915]];
      var simOk = 0;
      try {
        for (var s = 0; s < sizes.length; s++) {
          var w = sizes[s][0], h = sizes[s][1];
          Object.defineProperty(window, 'innerWidth', { configurable: true, get: function () { return w; } });
          Object.defineProperty(window, 'innerHeight', { configurable: true, get: function () { return h; } });
          window.lmMenuFit();
          var n0 = fail.length;
          await allTabs(w + 'x' + h, w, h, true);
          if (fail.length === n0) simOk++;
        }
      } finally {
        if (dw) Object.defineProperty(window, 'innerWidth', dw); else delete window.innerWidth;
        if (dh) Object.defineProperty(window, 'innerHeight', dh); else delete window.innerHeight;
      }
      info.sizesOk = simOk + '/' + sizes.length;
    }
  } finally {
    ds.hudScale = hs0;
    if (window.application && typeof application.setHudScale === 'function') application.setHudScale();
    a11y.a11yTextScale = ts0;
    if (window.LMAccessibility && typeof LMAccessibility.sync === 'function') LMAccessibility.sync(true);
    if (activeTab.length) await openTab(activeTab[0]);
    window.lmMenuFit();
    if (wasHidden) { $(hc).hide(); }
  }
  if (ds.hudScale !== hs0) fail.push('hudScale not restored');
  return { fail: fail, info: info };
})()
