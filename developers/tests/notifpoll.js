/* Notification centre without its always-on 2 s poll: ogario/modules/notifications.js runs in a vm
 * with a small fake document. Option off: no setInterval; turned on by the switch (refresh, as
 * setSettings calls it) or by a profile / preset / import (settingsChange): the bell at once and one
 * 2 s timer (a toastr made again is wrapped, the bell finds a free spot again); off: bell and timer
 * gone. A toastr made again while the option is off is wrapped once it is turned on.
 * node developers/tests/notifpoll.js [notifications.js] [--old <older notifications.js>] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv } = require('./lib/fakedom');
const args = process.argv.slice(2);
const oi = args.indexOf('--old');
const oldPath = oi >= 0 ? args.splice(oi, 2)[1] : null;
const srcPath = args[0] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'notifications.js');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function mkToastr() {
  const t = {};
  ['success', 'info', 'warning', 'error'].forEach(k => { t[k] = function () { return { css() { return this; } }; }; });
  t.clear = () => {};
  return t;
}

function suite(label, src) {
  const res = {};
  const e = makeEnv({ notificationCentre: false }, { toastr: mkToastr(), jQuery: () => ({ length: 0, css() { return this; } }) });
  i18n(e.ctx);
  e.run(src);
  e.flush();
  const N = e.ctx.LMNotifications;
  res.noTimerOff = e.intervals.size === 0 && !e.doc.getElementById('lm-notif-bell');
  /* a toastr made again while off */
  e.ctx.toastr = mkToastr();
  /* a profile turns it on: bell and one timer at once */
  e.ctx.defaultmapsettings.notificationCentre = true;
  e.ctx.LMEvents.emit('settingsChange', { key: 'notificationCentre', value: true });
  e.flush();
  res.onBell = !!e.doc.getElementById('lm-notif-bell');
  res.onTimer = e.intervals.size === 1;
  res.rewrapped = !!e.ctx.toastr._lmNotifWrapped;
  /* toastr made again while on: wrapped by the next look */
  e.ctx.toastr = mkToastr();
  e.tick();
  res.rewrappedOn = !!e.ctx.toastr._lmNotifWrapped && e.intervals.size === 1;
  /* turned off by the switch (setSettings calls refresh): bell and timer gone */
  e.ctx.defaultmapsettings.notificationCentre = false;
  N.refresh();
  e.flush();
  res.offGone = !e.doc.getElementById('lm-notif-bell') && e.intervals.size === 0;
  /* switch on again, settings set behind its back to off: the next look removes the bell and stops */
  e.ctx.defaultmapsettings.notificationCentre = true;
  N.refresh();
  res.onAgain = e.intervals.size === 1 && !!e.doc.getElementById('lm-notif-bell');
  e.ctx.defaultmapsettings.notificationCentre = false;
  e.tick();
  res.lookStops = !e.doc.getElementById('lm-notif-bell') && e.intervals.size === 0;
  /* another key: nothing */
  e.ctx.defaultmapsettings.notificationCentre = true;
  e.ctx.LMEvents.emit('settingsChange', { key: 'showGrid', value: true });
  e.flush();
  res.otherKey = e.intervals.size === 0 && !e.doc.getElementById('lm-notif-bell');
  console.log('  ' + label + ': ' + JSON.stringify(res));
  return res;
}

const r = suite('current', fs.readFileSync(srcPath, 'utf8'));
check('option off: no setInterval, no bell', r.noTimerOff);
check('settingsChange notificationCentre on: bell and one timer at once', r.onBell && r.onTimer);
check('a toastr made again while off is wrapped when it is turned on', r.rewrapped);
check('while on, a toastr made again is wrapped by the 2 s look', r.rewrappedOn);
check('switch off (refresh): bell and timer gone', r.offGone);
check('switch on again: one timer; option off behind its back: the next look removes the bell and stops', r.onAgain && r.lookStops);
check('another key changes nothing', r.otherKey);
if (oldPath) {
  const o = suite('older', fs.readFileSync(oldPath, 'utf8'));
  check('older version polled with the option off (comparison is real)', !o.noTimerOff);
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
