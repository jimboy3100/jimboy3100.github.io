// Show/hide HUD (Alt+H) hides everything but the game view (ogario/modules/smalltools.js). When the
// menu opens while it is on (a death: showMenu(300), or the Expanding Land death screen that shows
// #overlays itself), the menu must be seen and its nick field tappable: until 3.701 it opened under
// the HUD hide, invisible, and taps reached the canvas. Hiding the HUD while playing keeps it hidden
// as before, and a hide started with the menu open (a capture of the game behind it) keeps the menu hidden.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMSmallTools && window.LMSmallTools.shotOff); i++) await sleep(250);
  var app = window.application, ov = document.getElementById('overlays'), T = window.LMSmallTools;
  if (!app || !ov || !T || typeof app.showMenu !== 'function') return { skip: 'menu or small tools missing' };
  var menuWas = getComputedStyle(ov).display !== 'none';
  var chipOn = function () { return !!document.getElementById('lm-shot-chip'); };
  var check = async function (name, open) {
    app.hideMenu();
    await sleep(100);
    app.setShowHUD();
    await sleep(100);
    if (!chipOn()) { fail.push(name + ': Show/hide HUD did not hide the HUD'); return; }
    /* the HUD hide stays on while the menu stays closed */
    await sleep(200);
    if (!chipOn()) fail.push(name + ': the HUD hide ended by itself while playing');
    open();
    await sleep(500);
    /* the nick field of the menu (the Play buttons there are not all shown) */
    var nick = document.getElementById('nick');
    var r = nick && nick.getBoundingClientRect();
    var inView = r && r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
    var hit = inView ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
    info[name] = getComputedStyle(ov).visibility + '/' + getComputedStyle(ov).display + ' hit ' + (hit ? (hit.id || String(hit.className || '') || hit.tagName) : null);
    if (getComputedStyle(ov).visibility === 'hidden') fail.push(name + ': the menu opened under the HUD hide: invisible');
    /* a dialog the page opened over the menu (a server promo) may cover the field: that is not the HUD hide */
    var overByDialog = !!(hit && hit.closest && hit.closest('.modal'));
    if (inView && !overByDialog && !(hit && (hit === nick || nick.contains(hit)))) fail.push(name + ': the menu\'s nick field cannot be tapped: ' + info[name]);
    if (chipOn()) { fail.push(name + ': the HUD hide chip stayed over the menu'); T.shotOff(); }
  };
  try {
    await check('death', function () { app.showMenu(300); });
    /* as the Expanding Land death screen (ogario.v4.js): #helloContainer too, so the nick field is
     * in view and its tap is checked (hideMenu hid it, and the check was skipped) */
    await check('el death screen', function () { $('#overlays').stop(true, true).show(); $('#helloContainer').stop(true, true).show(); });
    /* started with the menu open: the menu stays hidden for the capture */
    app.showMenu();
    await sleep(100);
    app.setShowHUD();
    await sleep(300);
    if (!chipOn() || getComputedStyle(ov).visibility !== 'hidden') fail.push('HUD hide started in the menu: the menu did not stay hidden');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    if (chipOn()) T.shotOff();
    if (menuWas) app.showMenu(); else app.hideMenu();
  }
  return { fail: fail, info: info };
})()
