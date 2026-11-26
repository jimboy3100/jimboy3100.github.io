// perfect-scrollbar missing on agar.io: the library guard at the top of ogario.v4.js (its real code,
// run again here) puts a stand-in in place. A scroll list then scrolls natively inside its own
// height (it had no overflow rule and the settings list ran about 10,000 px over the footer), and
// when the real plugin arrives later the list has only the plugin's scrollbar (no second one).
(async () => {
  var fail = [], info = {};
  var $ = window.jQuery;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var real = $.fn.perfectScrollbar, guardLoad = window._lmLibGuardLoad;
  if (typeof real !== 'function' || real._lmStandIn) return { fail: ['the real perfect-scrollbar is not loaded'], info: info };
  var src = await (await fetch('https://www.legendmod.ml/ogario/ogario.v4.js?psfb=' + Date.now())).text();
  var end = src.indexOf('\n})();');
  if (src.indexOf('/* Library guard.') !== 0 || end < 0) return { fail: ['library guard not found at the top of ogario.v4.js'], info: info };
  var guard = src.slice(0, end + 6);
  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-3000px;top:0;width:400px;height:900px';
  document.body.appendChild(wrap);
  var box = function () {
    var b = document.createElement('div');
    b.className = 'submenu-panel';
    b.style.display = 'block';
    for (var i = 0; i < 300; i++) { var r = document.createElement('div'); r.textContent = 'row ' + i; r.style.height = '30px'; b.appendChild(r); }
    wrap.appendChild(b);
    return b;
  };
  try {
    /* 1. the plugin never comes (its file fails to load) */
    delete $.fn.perfectScrollbar;
    var noLoad = guard.replace('(document.head || document.documentElement).appendChild(s);', "setTimeout(function () { s.onerror({ type: 'error' }); }, 0);");
    if (noLoad === guard) fail.push('library guard: script loading not found');
    (0, eval)(noLoad);
    if (!($.fn.perfectScrollbar && $.fn.perfectScrollbar._lmStandIn)) fail.push('no stand-in when the plugin is missing');
    var b1 = box();
    $(b1).perfectScrollbar({ suppressScrollX: true });
    await sleep(1500);
    var cs = getComputedStyle(b1), mh = parseFloat(cs.maxHeight), h = b1.getBoundingClientRect().height;
    info.missing = { overflow: cs.overflowY + '/' + cs.overflowX, maxHeight: mh, height: Math.round(h), scrollH: b1.scrollHeight };
    if (cs.overflowY !== 'auto') fail.push('missing plugin: the list does not scroll natively (overflow-y ' + cs.overflowY + ')');
    if (cs.overflowX !== 'hidden') fail.push('missing plugin: suppressScrollX not kept (overflow-x ' + cs.overflowX + ')');
    if (!(h <= mh + 0.5)) fail.push('missing plugin: the list is ' + Math.round(h) + ' px, above its max-height ' + mh);
    b1.scrollTop = b1.scrollHeight;
    if (!(b1.scrollTop > 0 && Math.abs(b1.scrollTop + b1.clientHeight - b1.scrollHeight) <= 1)) fail.push('missing plugin: the last row is not reached by scrolling');
    $(b1).perfectScrollbar('update');
    if (!b1.classList.contains('lm-ps-native')) fail.push('missing plugin: update dropped the native scrolling');
    /* 2. the plugin arrives late: the remembered calls run on it and the native scrollbar goes */
    delete $.fn.perfectScrollbar;
    (0, eval)(guard);
    var b2 = box();
    $(b2).perfectScrollbar({ suppressScrollX: true });
    if (!b2.classList.contains('lm-ps-native')) fail.push('late plugin: no native scrolling while it loads');
    for (var t = 0; t < 40 && (!$.fn.perfectScrollbar || $.fn.perfectScrollbar._lmStandIn); t++) await sleep(150);
    await sleep(100);
    var cs2 = getComputedStyle(b2);
    info.late = { cls: b2.className, overflow: cs2.overflowY };
    if ($.fn.perfectScrollbar._lmStandIn) fail.push('late plugin: the real plugin did not load');
    else {
      if (b2.classList.contains('lm-ps-native')) fail.push('late plugin: native scrolling left on (two scrollbars)');
      if (!b2.classList.contains('ps-container')) fail.push('late plugin: the remembered call did not run on it');
      if (cs2.overflowY !== 'hidden') fail.push('late plugin: native scrollbar still shown (overflow-y ' + cs2.overflowY + ')');
    }
  } finally {
    $.fn.perfectScrollbar = real;
    window._lmLibGuardLoad = guardLoad;
    wrap.remove();
    var st = document.getElementById('lm-ps-native-css');
    while (st) { st.remove(); st = document.getElementById('lm-ps-native-css'); }
  }
  /* the normal page (plugin present): the settings list has only the plugin's scrollbar */
  var reg = $('#og-settings > .submenu-panel')[0];
  if (reg) {
    info.page = reg.className;
    if (reg.classList.contains('lm-ps-native') || getComputedStyle(reg).overflowY !== 'hidden') fail.push('settings list: native scrolling on while the plugin is there');
  }
  return { fail: fail, info: info };
})()
