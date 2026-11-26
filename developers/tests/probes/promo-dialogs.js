// Menu dialogs (lmPromoChrome): the Report as fake / change skin window, built hidden, opens with
// its top on screen and its bottom reachable (on screen, or by scrolling the dialog layer), and a
// 340 px dialog (the first-run Choose your language window) is centred on a 740 px wide phone
// (Bootstrap put it at the left edge there, under the team list). The menu is put back afterwards.
(async () => {
  var fail = [], info = {};
  if (typeof window.ReportFakesSkin !== 'function' || typeof window.exitSkinChanger !== 'function') return { fail: ['ReportFakesSkin/exitSkinChanger missing'] };
  var keep = ['main-menu', 'skins-panel', 'quick-menu', 'exp-bar'].map(function (id) { var e = document.getElementById(id); return [e, e ? e.style.display : '']; });
  try {
    ReportFakesSkin();
    var m = document.getElementById('SkinChanger'), d = m && m.querySelector('.modal-dialog');
    if (!d) fail.push('Report as fake window not built');
    else {
      var r = d.getBoundingClientRect(), H = innerHeight;
      info.skinDialog = [Math.round(r.top), Math.round(r.bottom), H];
      if (r.top < -1) fail.push('Report as fake window starts above the screen: top ' + Math.round(r.top));
      if (r.bottom > H + 1) {
        var oy = getComputedStyle(m).overflowY;
        m.scrollTop = m.scrollHeight;
        var b = d.getBoundingClientRect().bottom;
        info.scrolled = [oy, Math.round(b)];
        if (!/auto|scroll/.test(oy) || b > H + 1) fail.push('Report as fake window runs ' + Math.round(r.bottom - H) + ' px off the bottom and cannot be scrolled there (overflow-y ' + oy + ')');
      }
    }
  } finally {
    try { exitSkinChanger(); } catch (e) { }
    keep.forEach(function (k) { if (k[0]) k[0].style.display = k[1]; });
  }
  /* a 740 x 360 phone: the page's real stylesheets in a frame of that size */
  var css = document.getElementById('lm-promo-css');
  if (!css) fail.push('lm-promo-css not added');
  else {
    var links = [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (l) { return /master\.css/.test(l.href); }).map(function (l) { return '<link rel="stylesheet" href="' + l.href + '">'; }).join('');
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;left:-2000px;top:0;width:740px;height:360px;border:0;visibility:hidden';
    f.srcdoc = '<!doctype html><html><head>' + links + '<style>' + css.textContent + '</style></head><body>' +
      '<div class="modal fade in lm-promo" style="display:block"><div class="modal-dialog" style="width:340px;max-width:calc(100vw - 16px)"><div class="modal-content" style="height:200px"></div></div></div></body></html>';
    try {
      await new Promise(function (res) { f.onload = res; document.body.appendChild(f); setTimeout(res, 8000); });
      var fd = f.contentDocument.querySelector('.modal-dialog').getBoundingClientRect();
      info.narrowDialog = [Math.round(fd.left), Math.round(fd.right), 740];
      if (Math.abs(fd.left - (740 - fd.right)) > 2) fail.push('340 px dialog on a 740 px phone not centred: left ' + Math.round(fd.left) + ', right gap ' + Math.round(740 - fd.right));
    } finally { f.remove(); }
  }
  return { fail: fail, info: info };
})()
