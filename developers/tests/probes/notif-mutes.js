// Notification centre with its mute switches open ("Toasts..."): the switches and the notification list
// both stay inside the panel and every switch can be reached. On a 915x412 phone the switches kept
// their full height up to 3.697, the list was pushed below the panel and the last switch was cut off.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var N = window.LMNotifications, app = window.application, s = window.legendmod5;
  if (!N || !app || !s) return { fail: ['LMNotifications, application or settings missing'] };
  var keep = s.notificationCentre, ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var R = function (r) { return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; };
  try {
    app.setSettings('notificationCentre', true);
    for (var i = 0; i < 6; i++) toastr.info('notif-mutes probe ' + i);
    app.hideMenu();
    await sleep(600);
    N.refresh();
    var bell = document.getElementById('lm-notif-bell');
    if (!bell) return { fail: ['bell not shown'], info: info };
    bell.click();
    await sleep(200);
    var panel = document.getElementById('lm-notif-panel');
    if (!panel || panel.style.display === 'none') return { fail: ['panel did not open'], info: info };
    var mutes = panel.querySelector('.lmn-mutes'), list = panel.querySelector('.lmn-list'), btns = panel.querySelectorAll('.lmn-bar button');
    if (!mutes || !list || !btns.length) return { fail: ['mute switches, list or their button missing'], info: info };
    btns[btns.length - 1].click();
    await sleep(100);
    if (mutes.style.display === 'none') return { fail: ['the mute button did not open the switches'], info: info };
    var pr = panel.getBoundingClientRect(), mr = mutes.getBoundingClientRect(), lr = list.getBoundingClientRect();
    info.panel = R(pr); info.mutes = R(mr); info.list = R(lr); info.screen = [innerWidth, innerHeight];
    if (pr.top < 0 || pr.bottom > innerHeight + 1) fail.push('panel off screen');
    if (mr.bottom > pr.bottom + 1) fail.push('mute switches end below the panel');
    if (lr.top >= pr.bottom - 20 || lr.bottom > pr.bottom + 1) fail.push('notification list pushed out of the panel: ' + info.list.join(',') + ' in ' + info.panel.join(','));
    var labels = mutes.querySelectorAll('label'), cut = 0;
    for (var j = 0; j < labels.length; j++) if (labels[j].getBoundingClientRect().bottom > mr.bottom + 1) cut++;
    var oy = getComputedStyle(mutes).overflowY;
    info.cut = cut; info.overflow = oy;
    if (cut && !/auto|scroll/.test(oy)) fail.push(cut + ' mute switch(es) cut off and the box does not scroll');
  } finally {
    var p2 = document.getElementById('lm-notif-panel');
    if (p2 && p2.style.display !== 'none') { var x = p2.querySelector('.lmn-close'); if (x) x.click(); }
    app.setSettings('notificationCentre', keep);
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
