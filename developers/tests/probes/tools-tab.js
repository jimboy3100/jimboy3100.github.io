// Tools tab in the real menu: row 1 is Hide Shortcuts | Hide Everything (red), the Rounded / Square
// HUD and Show Timer Calc. buttons are gone; Rounded / Square HUD is Theme > HUD "Rounded corners"
// (rounded by default; the switch rounds the menu and HUD corners and is saved). The stopwatch is
// removed: no "Show stopwatch" switch and no stopwatch above the minimap.
// Stored settings and the values are put back.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !document.getElementById('HideAllBthn'); i++) await sleep(250);
  var T = defaultSettings, S = window.legendmod5;
  var keepTheme = null, keepSet = null;
  try { keepTheme = localStorage.getItem('ogarioThemeSettings'); keepSet = localStorage.getItem('ogarioSettings'); } catch (e) { }
  var keepRound = T.hudRoundedCorners;
  var change = function (el, v) { el.checked = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
  try {
    /* row 1 */
    var hs = document.getElementById('SHOSHOBtn'), he = document.getElementById('HideAllBthn');
    need('Tools tab: Hide Shortcuts and Hide Everything', !!hs && !!he && $(hs).closest('#legend').length === 1 && $(he).closest('#legend').length === 1);
    need('Tools tab: no Rounded / Square HUD or Show Timer Calc. button', !document.getElementById('MAINBTBtn') && !document.getElementById('TIMEcalBtn'));
    if (hs && he) {
      need('Hide Everything keeps its red style', $(he).hasClass('btn-danger'));
      need('Hide Everything comes right after Hide Shortcuts', hs.nextElementSibling === he);
      var mm = document.getElementById('main-menu'), lg = document.getElementById('legend');
      var was = { mm: mm.style.display, lg: lg.style.display };
      mm.style.display = 'block'; lg.style.display = 'block';
      var a = hs.getBoundingClientRect(), b = he.getBoundingClientRect();
      mm.style.display = was.mm; lg.style.display = was.lg;
      info.row = [Math.round(a.left), Math.round(a.top), Math.round(b.left), Math.round(b.top)];
      need('row 1: Hide Shortcuts | Hide Everything on one row', a.width > 0 && b.width > 0 && Math.abs(a.top - b.top) < 2 && b.left >= a.right - 1);
    }
    /* Theme > HUD: Rounded corners */
    var rc = document.getElementById('hudRoundedCorners');
    need('theme default: rounded', LM_THEME_DEFAULTS.hudRoundedCorners === true);
    need('Theme > HUD: Rounded corners switch', !!rc && rc.type === 'checkbox' && $(rc).closest('#theme-hud').length === 1 && !!(rc.nextElementSibling && /switchery/.test(rc.nextElementSibling.className)));
    if (rc) {
      var radius = function () { return getComputedStyle(document.documentElement).getPropertyValue('--lm-radius').trim(); };
      var btnR = function () { return getComputedStyle(document.getElementById('HideAllBthn')).borderTopLeftRadius; };
      need('the switch shows the setting', rc.checked === (T.hudRoundedCorners === true));
      change(rc, false);
      await sleep(50);
      need('square: menu buttons and the corner variable 0', T.hudRoundedCorners === false && radius() === '0px' && btnR() === '0px');
      change(rc, true);
      await sleep(800);
      info.rounded = [radius(), btnR()];
      need('rounded: menu buttons 10px', T.hudRoundedCorners === true && radius() === '10px' && btnR() === '10px');
      var st = null;
      try { st = JSON.parse(localStorage.getItem('ogarioThemeSettings') || 'null'); } catch (e) { }
      need('rounded: saved with the theme', !!st && st.hudRoundedCorners === true);
      /* a theme set from elsewhere (profiles, Theme Workshop): setTheme moves the switch */
      T.hudRoundedCorners = false;
      Settings.setTheme();
      need('setTheme: the switch and the corners follow the value', rc.checked === false && radius() === '0px');
    }
    /* the stopwatch is removed */
    need('no Show stopwatch switch or setting', !document.getElementById('showStopwatch') && !('showStopwatch' in LM_SETTINGS_DEFAULTS) && !('showStopwatch' in S));
    need('no stopwatch above the minimap', !document.getElementById('timertools-hud') && !document.getElementById('playtimer') && typeof window.lmShowStopwatch === 'undefined');
  } finally {
    T.hudRoundedCorners = keepRound;
    try { Settings.setHudCorners(); } catch (e) { }
    await sleep(800);
    try {
      if (keepTheme === null) localStorage.removeItem('ogarioThemeSettings'); else localStorage.setItem('ogarioThemeSettings', keepTheme);
      if (keepSet === null) localStorage.removeItem('ogarioSettings'); else localStorage.setItem('ogarioSettings', keepSet);
    } catch (e) { }
  }
  return { fail: fail, info: info };
})()
