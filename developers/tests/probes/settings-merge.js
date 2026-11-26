// Settings that became one control: Game stats position is one dropdown in Settings > HUD (no
// "at the top" / "at the bottom centre" switches); choosing a value moves the stats line.
// HUD text size is in Theme > HUD right after HUD scale (not in Settings > Accessibility), still the
// gameplay setting: moving it changes legendmod5.a11yHudTextScale and is saved with the settings.
(async () => {
  var fail = [], info = {};
  var S = window.legendmod5;
  var pos = document.getElementById('statsPosition');
  if (!pos || pos.tagName !== 'SELECT' || !$(pos).closest('.hudGroup').length) fail.push('statsPosition is not a dropdown in Settings > HUD');
  else if ([].map.call(pos.options, function (o) { return o.value; }).join() !== 'top,bottom,center') fail.push('statsPosition choices: ' + [].map.call(pos.options, function (o) { return o.value; }).join());
  if (document.getElementById('fpsAtTop') || document.getElementById('statsAtCenter')) fail.push('the old stats position switches are still in the menu');
  var hud = document.getElementById('stats-hud');
  if (pos && hud) {
    var was = S.statsPosition, seen = [];
    ['bottom', 'center', 'top'].forEach(function (v) {
      pos.value = v;
      pos.dispatchEvent(new Event('change', { bubbles: true }));
      seen.push(v + ':' + (hud.classList.contains('hud-top') ? 'top' : 'bottom') + (hud.classList.contains('lm-stats-center') ? '+c' : ''));
    });
    info.placed = seen.join(' ');
    if (seen.join() !== 'bottom:bottom,center:bottom+c,top:top') fail.push('stats line placed ' + seen.join());
    if (S.statsPosition !== 'top' || S.fpsAtTop !== true || S.statsAtCenter !== false) fail.push('copies do not follow: ' + [S.statsPosition, S.fpsAtTop, S.statsAtCenter].join());
    pos.value = was;
    pos.dispatchEvent(new Event('change', { bubbles: true }));
  }
  var ts = document.getElementById('a11yHudTextScale-slider');
  var tsBox = ts && ts.closest('.slider-box'), hsBox = document.getElementById('hudScale-slider');
  hsBox = hsBox && hsBox.closest('.slider-box');
  if (!ts || !ts.closest('#theme-hud')) fail.push('HUD text size is not in Theme > HUD');
  else if (!hsBox || hsBox.nextElementSibling !== tsBox) fail.push('HUD text size is not next to HUD scale');
  if (ts && ts.closest('#og-options')) fail.push('HUD text size still in Settings');
  if (ts) {
    var tWas = S.a11yHudTextScale;
    ts.value = '1.3';
    ts.dispatchEvent(new Event('input', { bubbles: true }));
    ts.dispatchEvent(new Event('change', { bubbles: true }));
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('ogarioSettings')).a11yHudTextScale; } catch (e) { }
    info.textScale = S.a11yHudTextScale + '/' + stored;
    if (S.a11yHudTextScale !== 1.3 || stored !== 1.3) fail.push('HUD text size slider does not set and save the gameplay setting: ' + info.textScale);
    ts.value = String(tWas);
    ts.dispatchEvent(new Event('input', { bubbles: true }));
    ts.dispatchEvent(new Event('change', { bubbles: true }));
  }
  return { fail: fail, info: info };
})()
