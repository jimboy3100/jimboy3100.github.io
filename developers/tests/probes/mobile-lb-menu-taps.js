// Phone run: while the menu is open the leaderboard's mass/sector column (a tap targets that
// player) takes no taps, so it no longer eats taps on the menu tab bar under it (portrait) or the
// skins panel (landscape); in the game it is tappable again. The page's leaderboard is put back.
(async () => {
  var fail = [], info = {};
  /* LMmobile.js sets up its controls after the menu */
  for (var w = 0; w < 60 && !window._lmMobileHost && matchMedia('(pointer: coarse)').matches; w++) await new Promise(function (r) { setTimeout(r, 250); });
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var lb = document.getElementById('leaderboard-hud'), pos = document.getElementById('leaderboard-positions'), data = document.getElementById('leaderboard-data');
  if (!lb || !pos || !data || !window.application) return { fail: ['leaderboard missing'] };
  var B = document.body, hadMenu = B.classList.contains('lm-menu');
  var oldP = pos.innerHTML, oldD = data.innerHTML;
  var lbShown = lb.style.getPropertyValue('display'), lbPrio = lb.style.getPropertyPriority('display');
  try {
    lb.style.setProperty('display', 'block', 'important');
    application.displayLeaderboard('<span>1. Player one</span><span>2. Player two</span>',
      '<span class="lb-data" style="pointer-events: auto;"><span class="top5-mass-color">[2k]</span><span class="hud-main-color">[C3]</span></span>' +
      '<span class="lb-data" style="pointer-events: auto;"><span class="top5-mass-color">[1k]</span><span class="hud-main-color">[A1]</span></span>');
    var d = data.querySelector('.lb-data');
    if (!d) return { fail: ['no mass/sector row'] };
    B.classList.add('lm-menu');
    var r = d.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    info.menu = [getComputedStyle(d).pointerEvents, hit ? (hit.id || hit.className || hit.tagName) : null];
    if (getComputedStyle(d).pointerEvents !== 'none' || (hit && lb.contains(hit))) fail.push('menu open: the mass/sector column still takes taps (' + info.menu.join(', ') + ')');
    B.classList.remove('lm-menu');
    info.game = getComputedStyle(d).pointerEvents;
    if (info.game === 'none') fail.push('in the game the mass/sector column takes no taps (targeting by tap lost)');
  } finally {
    B.classList.toggle('lm-menu', hadMenu);
    if (lbShown) lb.style.setProperty('display', lbShown, lbPrio); else lb.style.removeProperty('display');
    application.displayLeaderboard(oldP, oldD);
  }
  return { fail: fail, info: info };
})()
