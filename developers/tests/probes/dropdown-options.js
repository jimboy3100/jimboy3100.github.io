// Dropdown lists in the game: the open list of every select (Settings, Theme, Hotkeys and the other
// windows) has fixed readable colours, dark text on white, under a dark theme,
// the light 'Agar.io' preset and grey panels with light grey text. Chrome draws a select's open list
// from the option's computed background and colour (an option without one shows the select's, over
// white). Until 3.699 the list took the panel and text colours of the theme, unreadable with grey
// panels, and some windows had their own theme rule for it. The lists must look the same in every
// theme. The theme is put back. The main panel (#main-panel: game mode, region, server list) is the
// exception: its lists keep the colours of their closed box, as before 3.699 (owner, 2026-11-27).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof Settings !== 'object' || typeof Settings.setMenu !== 'function' || typeof defaultSettings !== 'object') return { fail: ['Settings.setMenu missing'] };
  var parse = function (s) { var m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return [0, 0, 0, 0]; var p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  var over = function (top, under) { var a = top[3]; return [0, 1, 2].map(function (k) { return top[k] * a + under[k] * (1 - a); }).concat([1]); };
  var lum = function (c) { return [0, 1, 2].map(function (k) { var v = c[k] / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (s, v, k) { return s + v * [0.2126, 0.7152, 0.0722][k]; }, 0); };
  var ratio = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  var KEYS = ['menuPanelColor', 'menuPanelColor2', 'menuTextColor', 'menuTextColor2', 'menuMainColor'];
  var THEMES = {
    dark: ['#00243e', '#002f52', '#ffffff', '#8096a7', '#01d9cc'],
    light: ['#ffffff', '#cccccc', '#333333', '#999999', '#5bc0de'],
    grey: ['#7a7a7a', '#8a8a8a', '#d8d8d8', '#bbbbbb', '#01d9cc']
  };
  var before = KEYS.map(function (k) { return defaultSettings[k]; });
  /* selects that windows build only when opened sit in their window's box: one of each kind, removed after */
  var boxes = ['lm-dir-panel', 'lm-he-p', 'lm-notif-panel', 'lm-dc', 'lm-ed', 'lm-gp-modal', 'lm-me-p', 'lm-pr', 'lm-tw', 'specialShopModal'];
  var tmp = document.createElement('div');
  tmp.className = 'agario-panel';
  try {
    boxes.forEach(function (id) {
      if (document.getElementById(id)) return;
      var b = document.createElement('div');
      b.id = id;
      b.innerHTML = '<select class="form-control"><optgroup label="G"><option>A</option><option disabled>B</option></optgroup><option selected>C</option></select>';
      tmp.appendChild(b);
    });
    tmp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(tmp);
    var looks = {};
    for (var name in THEMES) {
      KEYS.forEach(function (k, i) { defaultSettings[k] = THEMES[name][i]; });
      Settings.setMenu();
      await sleep(50);
      var n = 0, bad = [], look = [];
      [].forEach.call(document.querySelectorAll('select:not(#main-panel select)'), function (sel) {
        var sbg = over(parse(getComputedStyle(sel).backgroundColor), [255, 255, 255, 1]);
        [].forEach.call(sel.querySelectorAll('option, optgroup'), function (o, j) {
          if (j > 3) return;
          var cs = getComputedStyle(o), bg = over(parse(cs.backgroundColor), sbg), fg = over(parse(cs.color), bg), r = ratio(bg, fg);
          n++;
          var lk = cs.backgroundColor + '/' + cs.color;
          if (look.indexOf(lk) < 0) look.push(lk);
          if (r < 4.5 && bad.length < 5) bad.push((sel.id || (sel.parentNode && sel.parentNode.id) || sel.className || 'select') + ' ' + o.tagName.toLowerCase() + ': ' + cs.color + ' on ' + cs.backgroundColor + ' (' + r.toFixed(2) + ')');
        });
      });
      info[name] = n;
      /* main panel: no colours of their own on the choices, so Chrome draws the list in the select's */
      var mp = 0, mbad = [];
      [].forEach.call(document.querySelectorAll('#main-panel select'), function (sel) {
        var sc = getComputedStyle(sel).color;
        [].forEach.call(sel.querySelectorAll('option, optgroup'), function (o, j) {
          if (j > 3) return;
          var cs = getComputedStyle(o);
          mp++;
          if ((parse(cs.backgroundColor)[3] !== 0 || cs.color !== sc) && mbad.length < 3) mbad.push((sel.id || 'select') + ' ' + o.tagName.toLowerCase() + ': ' + cs.color + ' on ' + cs.backgroundColor + ' (closed box text ' + sc + ')');
        });
      });
      info[name + 'MainPanel'] = mp;
      if (!mp) fail.push(name + ': no main panel dropdown choices found');
      if (mbad.length) fail.push(name + ': main panel dropdown lists do not keep the closed box colours: ' + mbad.join('; '));
      looks[name] = look.sort().join(',');
      /* the same colours whatever the theme: the list does not take the theme */
      if (name !== 'dark' && looks[name] !== looks.dark) fail.push(name + ': the open dropdown lists change colour with the theme');
      if (n < 40) fail.push(name + ': only ' + n + ' dropdown choices found');
      if (bad.length) fail.push(name + ': unreadable open dropdown choices: ' + bad.join('; '));
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { tmp.remove(); } catch (e) { }
    KEYS.forEach(function (k, i) { defaultSettings[k] = before[i]; });
    try { Settings.setMenu(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
