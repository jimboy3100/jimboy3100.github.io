// Phone run: a 20-row leaderboard (Expanding Land) with its mass/sector column ends above the
// right-hand touch controls and the minimap, every row stays on screen, and each mass/sector row
// is level with its name. The page's own leaderboard text is put back afterwards.
(async () => {
  var fail = [], info = {};
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var H = window._lmMobileHost;
  var lb = document.getElementById('leaderboard-hud'), pos = document.getElementById('leaderboard-positions'), data = document.getElementById('leaderboard-data');
  if (!H || !lb || !pos || !data || !window.application) return { fail: ['leaderboard or LMmobile host missing'] };
  var oldP = pos.innerHTML, oldD = data.innerHTML;
  var lbShown = lb.style.getPropertyValue('display'), lbPrio = lb.style.getPropertyPriority('display');
  var P = '', Dt = '';
  for (var i = 1; i <= 20; i++) {
    P += '<span>' + i + '. Player name ' + i + '</span>';
    Dt += '<span class="lb-data" style="pointer-events: auto;"><span class="top5-mass-color">[' + (5 - i * 0.2).toFixed(1) + 'k]</span><span class="hud-main-color">[C3]</span></span>';
  }
  P += '<span class="me">Players: 3 Bots: 100</span>';
  try {
    lb.style.setProperty('display', 'block', 'important');
    application.displayLeaderboard(P, Dt);
    H.reposition();
    var rect = function (e) { var b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    var L = rect(lb), Dr = rect(data);
    var box = { l: Math.min(L.l, Dr.l), t: L.t, r: Math.max(L.r, Dr.r), b: Math.max(L.b, Dr.b) };
    var ctl = H.controls(), els = [['minimap', document.getElementById('minimap-hud')]];
    for (var k in ctl) if (ctl[k]) els.push([k, ctl[k]]);
    els.forEach(function (e) {
      var q = rect(e[1]);
      if (q.w < 1 || q.h < 1) return;
      if (q.l < box.r - 1 && q.r > box.l + 1 && q.t < box.b - 1 && q.b > box.t + 1)
        fail.push('leaderboard ' + JSON.stringify([Math.round(box.l), Math.round(box.t), Math.round(box.r), Math.round(box.b)]) + ' overlaps ' + e[0] + ' ' + JSON.stringify([Math.round(q.l), Math.round(q.t), Math.round(q.r), Math.round(q.b)]));
    });
    var ps = pos.querySelectorAll('span'), ds = data.querySelectorAll('.lb-data');
    if (ds.length !== 20) fail.push('mass/sector rows ' + ds.length + ', want 20');
    for (var j = 0; j < ds.length; j++) {
      var a = ps[j].getBoundingClientRect(), b = ds[j].getBoundingClientRect();
      if (Math.abs(a.top - b.top) > 1.5) { fail.push('row ' + (j + 1) + ': mass/sector at ' + Math.round(b.top) + ', name at ' + Math.round(a.top)); break; }
    }
    for (var n = 0; n < ps.length; n++) {
      var c = ps[n].getBoundingClientRect();
      if (!(c.height >= 1) || c.bottom > innerHeight || c.top < 0) { fail.push('row ' + (n + 1) + ' not on screen'); break; }
    }
    var s = L.h / lb.offsetHeight;
    if (!(s >= 0.5)) fail.push('leaderboard scale ' + s + ' below half size');
    info = { scale: Math.round(s * 1000) / 1000, box: [box.l, box.t, box.r, box.b].map(Math.round), screen: [innerWidth, innerHeight] };
  } finally {
    if (lbShown) lb.style.setProperty('display', lbShown, lbPrio); else lb.style.removeProperty('display');
    application.displayLeaderboard(oldP, oldD);
    H.reposition();
  }
  return { fail: fail, info: info };
})()
