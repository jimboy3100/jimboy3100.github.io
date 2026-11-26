// Logged out (the smoke test never logs in): Friends tells it with one toast and no browser alert
// (until 3.666 an alert stopped the game and a toast said it again), and opens no window. Leagues >
// More Prizes without prize data says so in a toast and logs no console error (it did until 3.666).
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 120 && typeof window.showFriendsModal !== 'function'; w++) await sleep(250);
  if (typeof window.showFriendsModal !== 'function') return { skip: 'showFriendsModal missing' };
  var loggedIn = typeof window.checkUserLoggedIn === 'function' ? window.checkUserLoggedIn() : false;
  if (loggedIn || (window.legendmod && window.legendmod.accessToken)) return { skip: 'logged in' };
  var alerts = [], origAlert = window.alert;
  /* toasts shown: the calls counted (the container drops old toasts when it is full) */
  var nToasts = 0, T = window.toastr, kinds = ['error', 'warning', 'info', 'success'], orig = {};
  if (T) kinds.forEach(function (k) { orig[k] = T[k]; T[k] = function () { nToasts++; return orig[k].apply(this, arguments); }; });
  var unspy = function () { if (T) kinds.forEach(function (k) { T[k] = orig[k]; }); };
  var toasts = function () { return nToasts; };
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
  /* More Prizes without prize data (logged out, no league response) */
  if (typeof window.showMorePrizesModal === 'function') {
    var errs = [], origErr = console.error;
    try {
      console.error = function () { errs.push([].map.call(arguments, String).join(' ')); };
      var t1 = toasts();
      var shown = window.showMorePrizesModal(1);
      await sleep(300);
      info.prizes = { shown: shown, toasts: toasts() - t1, errors: errs.length };
      if (shown === false) {
        if (errs.length) fail.push('More Prizes without data: console error ' + errs[0].slice(0, 120));
        if (toasts() - t1 < 1) fail.push('More Prizes without data: no toast');
      }
    } finally {
      console.error = origErr;
      $('.lm-modal-overlay').filter(function () { return /prize/i.test(this.id); }).remove();
    }
  }
  unspy();
  return { fail: fail, info: info };
})()
