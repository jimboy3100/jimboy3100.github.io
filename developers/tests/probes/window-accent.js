// Accent text on window panels stays readable: with the light "Agar.io" menu colours (accent
// #5bc0de, panels #ffffff / #cccccc, text #333333) the Theme workshop's active tab and the Discover
// window's Open buttons were accent on panel, 1.3:1. They take the menu text colour there now
// (--lm-w-acc, LMexpress.js lmUiAccent), and keep the accent with the default dark colours.
// The menu colours are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !(window.LMThemeWorkshop && window.LMDiscovery && typeof window.lmUiKit === 'function'); w++) await sleep(250);
  if (!window.LMThemeWorkshop || !window.LMDiscovery) return { fail: ['Theme workshop or Discover missing'], info: info };
  var rs = document.documentElement.style, keys = ['--lm-mc', '--lm-pc', '--lm-pc2', '--lm-tc'], keep = {};
  keys.forEach(function (k) { keep[k] = rs.getPropertyValue(k); });
  var rgb = function (c) { var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c); return m ? [+m[1], +m[2], +m[3]] : null; };
  var lum = function (v) { v = v.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  var ratio = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  var set = async function (c) { rs.setProperty('--lm-mc', c[0]); rs.setProperty('--lm-pc', c[1]); rs.setProperty('--lm-pc2', c[2]); rs.setProperty('--lm-tc', c[3]); await sleep(150); };
  var measure = async function (label) {
    var out = {};
    LMThemeWorkshop.open();
    await sleep(300);
    var tab = document.querySelector('#lm-tw .lm-tw-tabs button.active');
    if (tab) {
      var cs = getComputedStyle(tab), fg = rgb(cs.color), bg = rgb(cs.backgroundColor);
      out.twTab = fg && bg ? Math.round(ratio(fg, bg) * 100) / 100 : null;
    }
    LMThemeWorkshop.close();
    LMDiscovery.open('features');
    await sleep(300);
    var pri = document.querySelector('#lm-dc .lm-dc-btn.pri');
    if (pri) {
      /* the panel is a gradient over the menu colour (no background-color to read): against both panel colours */
      var pfg = rgb(getComputedStyle(pri).color), pcs = getComputedStyle(document.documentElement);
      var hex = function (h) { h = h.trim().replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; };
      var p1 = hex(pcs.getPropertyValue('--lm-pc')), p2 = hex(pcs.getPropertyValue('--lm-pc2'));
      out.dcOpen = pfg ? Math.round(Math.min(ratio(pfg, p1), ratio(pfg, p2)) * 100) / 100 : null;
      out.dcOpenColor = getComputedStyle(pri).color;
    }
    LMDiscovery.close();
    info[label] = out;
    return out;
  };
  try {
    await set(['#5bc0de', '#ffffff', '#cccccc', '#333333']);
    var light = await measure('agario');
    /* the page put its own colours back meanwhile (phone layout): nothing was measured with these */
    light.held = rs.getPropertyValue('--lm-mc').trim() === '#5bc0de';
    if (!light.held) { keys.forEach(function (k) { if (keep[k]) rs.setProperty(k, keep[k]); }); return { skip: 'menu colours were reset by the page', info: info }; }
    if (!(light.twTab >= 3)) fail.push('Agar.io colours: Theme workshop active tab contrast ' + light.twTab);
    if (!(light.dcOpen >= 3)) fail.push('Agar.io colours: Discover Open button contrast ' + light.dcOpen);
    await set(['#01d9cc', '#00243e', '#002f52', '#ffffff']);
    var dark = await measure('default');
    /* the default dark colours keep the accent: rgb(1, 217, 204) */
    if (dark.dcOpenColor !== 'rgb(1, 217, 204)') fail.push('default colours: Discover Open button is not the accent (' + dark.dcOpenColor + ')');
  } catch (e) { fail.push(String(e)); }
  keys.forEach(function (k) { if (keep[k]) rs.setProperty(k, keep[k]); else rs.removeProperty(k); });
  try { if (LMThemeWorkshop.isOpen()) LMThemeWorkshop.close(); if (LMDiscovery.isOpen()) LMDiscovery.close(); } catch (e) { }
  return { fail: fail, info: info };
})()
