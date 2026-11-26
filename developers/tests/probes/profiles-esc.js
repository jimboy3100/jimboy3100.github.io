// Settings profiles window: a real Esc key press closes it (only the window in front: with
// Analytics opened over it, Esc closes Analytics first, the next Esc the profiles window). Until
// 3.689 Esc did nothing there (the other windows close on Esc).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 60 && !window.LMProfiles; w++) await sleep(250);
  var P = window.LMProfiles;
  if (!P) return { skip: 'LMProfiles missing' };
  var esc = function () {
    return new Promise(function (res) {
      var id = 'pe' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); res(true); } };
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      window.__lmInput(JSON.stringify({ id: id, type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }));
    });
  };
  var isOpen = function () { return !!document.getElementById('lm-sp-overlay'); };
  var aside = [];
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  try {
    window.application.showMenu();
    P.open();
    await sleep(300);
    if (!isOpen()) return { fail: ['the profiles window did not open'], info: info };
    var menuBefore = $('#overlays').is(':visible');
    if (!(await esc())) return { fail: ['the harness did not send the input'], info: info };
    await sleep(300);
    info.menu = [menuBefore, $('#overlays').is(':visible')];
    if (isOpen()) fail.push('Esc left the profiles window open');
    if ($('#overlays').is(':visible') !== menuBefore) fail.push('Esc ' + (menuBefore ? 'closed' : 'opened') + ' the menu behind the window');
    if (window.LMAnalytics) {
      P.open();
      await sleep(200);
      LMAnalytics.open('dash');
      await sleep(300);
      await esc();
      await sleep(300);
      info.two = [LMAnalytics.isOpen(), isOpen()];
      if (LMAnalytics.isOpen() || !isOpen()) fail.push('first Esc with Analytics over it: Analytics ' + (LMAnalytics.isOpen() ? 'open' : 'closed') + ', profiles ' + (isOpen() ? 'open' : 'closed'));
      await esc();
      await sleep(300);
      if (isOpen()) fail.push('second Esc left the profiles window open');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { if (window.LMAnalytics) LMAnalytics.close(); } catch (e) { }
    try { P.close(); } catch (e) { }
    window.application.showMenu();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
