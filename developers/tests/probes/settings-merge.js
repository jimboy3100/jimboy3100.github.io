// Settings that became one control: Game stats position is one dropdown in Settings > HUD (no
// "at the top" / "at the bottom centre" switches); choosing a value moves the stats line.
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
  return { fail: fail, info: info };
})()
