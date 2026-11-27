// Theme Bridge from the game: an embedded Legend page (faq.html, no #lm= in its address) gets the theme
// by the ready handshake, and follows a theme change made with the real Settings setter
// (addCustomCSS -> lmThemeChanged) without reload; http links are not decorated, an anchor stays first,
// a query token in the menu background is not exported. Everything is put back.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function need(name, ok) { if (!ok) fail.push(name); }
  /* LMexpress.js defines the bridge helpers after the game started: a probe run soon after the page
   * loaded threw "lmThemeUrl is not defined" (bounded wait) */
  for (var r = 0; r < 150 && (typeof window.lmThemeUrl !== 'function' || typeof window.lmThemeChanged !== 'function'); r++) await wait(100);
  need('lmThemeUrl defined', typeof window.lmThemeUrl === 'function');
  if (typeof window.lmThemeUrl !== 'function') return { fail: fail, info: info };
  need('lmThemeChanged defined', typeof window.lmThemeChanged === 'function');
  need('http Legend link not decorated', lmThemeUrl('http://www.legendmod.ml/faq.html') === 'http://www.legendmod.ml/faq.html');
  need('anchor stays first', /^https:\/\/www\.legendmod\.ml\/faq\.html#controls&lm=[A-Za-z0-9_-]+$/.test(lmThemeUrl('https://www.legendmod.ml/faq.html#controls')));
  var St = window.Settings;
  if (!St || typeof St.setMenuMainColor !== 'function') return { fail: fail.concat(['Settings.setMenuMainColor missing']) };
  var mc0 = defaultSettings.menuMainColor, bg0 = defaultSettings.menuBg, ss0 = sessionStorage.getItem('lmThemeBridge');
  var f = null;
  try {
    defaultSettings.menuBg = 'https://www.legendmod.ml/img/Legend.png?token=SECRET9&w=32';
    need('query token not exported', lmThemeData().bg === 'https://www.legendmod.ml/img/Legend.png?w=32');
    defaultSettings.menuBg = bg0;
    f = document.createElement('iframe');
    f.src = 'https://www.legendmod.ml/faq.html';
    f.style.cssText = 'position:fixed;left:0;top:0;width:400px;height:300px;opacity:0;pointer-events:none;border:0';
    /* the page runs its scripts (the handshake too) only after its Google Fonts stylesheet loaded
     * or failed: from a busy machine that took 6 to 30 s, so the wait runs until the frame loaded
     * (at most 45 s), then the handshake has 6 s as before */
    var loaded = false;
    f.addEventListener('load', function () { try { loaded = /faq\.html/.test(f.contentDocument.URL); } catch (e) { } });
    document.body.appendChild(f);
    var d = null;
    for (var l = 0; l < 450 && !loaded; l++) {
      await wait(100);
      try { d = f.contentDocument; if (d && d.documentElement.classList.contains('lm-themed-root')) break; } catch (e) { }
    }
    info.loadMs = l * 100;
    for (var i = 0; i < 60; i++) {
      await wait(100);
      try { d = f.contentDocument; if (d && d.documentElement.classList.contains('lm-themed-root')) break; } catch (e) { }
    }
    var mc = function () { try { return d.defaultView.getComputedStyle(d.body).getPropertyValue('--accent').trim(); } catch (e) { return ''; } };
    need('embedded page themed by the handshake', !!d && d.documentElement.classList.contains('lm-themed-root'));
    info.before = mc();
    need('embedded page has the menu colour', info.before.toLowerCase() === String(mc0).toLowerCase());
    defaultSettings.menuMainColor = '#ff00aa';
    St.setMenuMainColor();
    for (var j = 0; j < 20 && mc() !== '#ff00aa'; j++) await wait(100);
    info.after = mc();
    need('live update after Settings.setMenuMainColor', info.after === '#ff00aa');
    need('no Restore button inside the game window', !d.getElementById('lm-bridge-reset'));
  } finally {
    defaultSettings.menuMainColor = mc0;
    defaultSettings.menuBg = bg0;
    try { St.setMenuMainColor(); } catch (e) { }
    if (f && f.parentNode) f.parentNode.removeChild(f);
    if (ss0 === null) sessionStorage.removeItem('lmThemeBridge'); else sessionStorage.setItem('lmThemeBridge', ss0);
  }
  return { fail: fail, info: info };
})()
