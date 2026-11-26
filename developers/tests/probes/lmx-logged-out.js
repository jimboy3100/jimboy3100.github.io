// Logged out (the smoke test never logs in): Friends tells it with one toast and no browser alert
// (until 3.666 an alert stopped the game and a toast said it again), and opens no window.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 120 && typeof window.showFriendsModal !== 'function'; w++) await sleep(250);
  if (typeof window.showFriendsModal !== 'function') return { skip: 'showFriendsModal missing' };
  var loggedIn = typeof window.checkUserLoggedIn === 'function' ? window.checkUserLoggedIn() : false;
  if (loggedIn || (window.legendmod && window.legendmod.accessToken)) return { skip: 'logged in' };
  var alerts = [], origAlert = window.alert;
  var toasts = function () { return document.querySelectorAll('#toast-container .toast').length; };
  try {
    window.alert = function (m) { alerts.push(String(m)); };
    var t0 = toasts();
    window.showFriendsModal();
    await sleep(300);
    info.alerts = alerts.length;
    info.toasts = toasts() - t0;
    if (alerts.length) fail.push('Friends logged out: a browser alert (' + alerts[0] + ')');
    if (toasts() - t0 < 1) fail.push('Friends logged out: no toast');
    if (document.getElementById('lm-friends-modal')) fail.push('Friends logged out: the window opened');
  } finally {
    window.alert = origAlert;
    var m = document.getElementById('lm-friends-modal');
    if (m) m.remove();
  }
  return { fail: fail, info: info };
})()
