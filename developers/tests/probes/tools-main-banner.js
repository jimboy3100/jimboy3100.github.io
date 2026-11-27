// Tools tab: the "Main Banner" icon and link fields are gone. They were saved and exported but
// nothing showed them anywhere (the banner they were for no longer exists), so a player filled them
// in for nothing. The minimap / leaderboard / teamboard / screen images of the same box stay in
// the Theme tab, and a stored or imported value of the old fields is kept in storage.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !document.getElementById('discwebhook1'); w++) await sleep(250);
  if (!document.getElementById('discwebhook1')) return { fail: ['the Tools tab was not built'], info: info };
  info.imgUrl = !!document.getElementById('imgUrl');
  info.imgHref = !!document.getElementById('imgHref');
  if (info.imgUrl || info.imgHref) fail.push('the dead Main Banner fields are still in the menu');
  if (document.getElementById('lm-tools-imgs')) fail.push('an empty image box is left in the Tools tab');
  var lab = document.getElementById('legendmanualback');
  info.label = lab ? lab.textContent : null;
  if (lab) fail.push('the "Main Banner" heading is still in the Tools tab');
  [['minimapPicture', 'theme-minimap'], ['leadbPicture', 'theme-hud'], ['teambPicture', 'theme-hud'], ['canvasPicture', 'theme-images']].forEach(function (p) {
    var el = document.getElementById(p[0]);
    var host = document.getElementById(p[1]);
    if (!el) fail.push(p[0] + ' missing');
    else if (host && !host.contains(el)) fail.push(p[0] + ' is not in ' + p[1]);
  });
  var stored = null;
  try { stored = localStorage.getItem('imgUrl'); } catch (e) { }
  info.stored = stored;
  return { fail: fail, info: info };
})()
