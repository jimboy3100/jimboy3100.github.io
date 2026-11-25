// Loading screen (play.html #lm-boot): shown while the scripts load, gone once the menu is there,
// and it never takes clicks. It remembers how many scripts the page had for the next progress bar.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 40 && document.getElementById('lm-boot'); w++) await sleep(250);
  var boot = document.getElementById('lm-boot');
  info.gone = !boot;
  if (boot) fail.push('loading screen still there after the page loaded (opacity ' + boot.style.opacity + ')');
  if (typeof window._lmBootHide !== 'function') fail.push('_lmBootHide missing: the loading screen script did not run');
  var n = 0;
  try { n = +localStorage.getItem('lmBootScripts') || 0; } catch (e) { }
  info.scripts = n;
  if (!(n > 5)) fail.push('script count not remembered (' + n + ')');
  if (!document.getElementById('main-menu')) fail.push('no #main-menu (the screen waits for it)');
  /* its text is in the language chosen in Legend Mod (languagemod), when one was chosen */
  var lm = 0;
  try { lm = parseInt(localStorage.getItem('languagemod'), 10) || 0; } catch (e) { }
  info.lang = window._lmBootLang;
  if (!(window._lmBootLang >= 1 && window._lmBootLang <= 12)) fail.push('loading screen language not set (' + window._lmBootLang + ')');
  else if (lm >= 1 && lm <= 12 && window._lmBootLang !== lm) fail.push('loading screen language ' + window._lmBootLang + ', chosen ' + lm);
  return { fail: fail, info: info };
})()
