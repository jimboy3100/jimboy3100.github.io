// Settings > Accessibility > menu text size also makes the text of the Legend Mod windows larger
// (Settings profiles, Command Centre, Analytics...: the shared window kit sizes their text), once.
// Until 3.700 it scaled only the Settings / Theme tabs, the Hotkeys list and the main panel.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !(window.LMProfiles && window.LMAccessibility); w++) await sleep(250);
  var P = window.LMProfiles, A = window.LMAccessibility;
  if (!P || !A || typeof A.remeasure !== 'function') return { skip: 'LMProfiles or LMAccessibility missing' };
  var S = window.legendmod5 || window.defaultmapsettings;
  var old = S.a11yTextScale;
  var px = function (sel) { var n = document.querySelector(sel); return n ? parseFloat(getComputedStyle(n).fontSize) : NaN; };
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  try {
    S.a11yTextScale = 1;
    A.remeasure();
    P.open();
    await sleep(300);
    var WIN = '#lm-sp-overlay .lm-sp-win', TITLE = '#lm-sp-overlay .lm-sp-head b';
    if (!document.querySelector(WIN)) return { fail: ['the profiles window did not open'], info: info };
    var base = px(WIN), baseT = px(TITLE);
    S.a11yTextScale = 1.5;
    A.remeasure();
    await sleep(150);
    var big = px(WIN), bigT = px(TITLE);
    info.text = [base, big];
    info.title = [baseT, bigT];
    if (!(Math.abs(big - base * 1.5) < 0.6)) fail.push('window text ' + base + 'px at text size 1 -> ' + big + 'px at 1.5 (expected ' + base * 1.5 + 'px)');
    if (!(Math.abs(bigT - baseT * 1.5) < 0.6)) fail.push('window title ' + baseT + 'px -> ' + bigT + 'px at 1.5');
    S.a11yTextScale = 1;
    A.remeasure();
    await sleep(150);
    if (px(WIN) !== base) fail.push('back at text size 1 the window text is ' + px(WIN) + 'px, not ' + base + 'px');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    S.a11yTextScale = old;
    try { A.remeasure(); } catch (e) { }
    try { P.close(); } catch (e) { }
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})();
