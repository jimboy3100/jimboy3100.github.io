// Phone run: the held actions of the phone controls end where the game moves on without the menu.
// (1) A held Feed stops when the chat box opens (it kept feeding under the keyboard), when the player
// dies (with auto respawn it fed the new life; a multibox unit still playing keeps it) and on a server
// change. (2) The ping button sends nothing while the menu is open (a moved ping button or the open
// drawer took the tap and pinged the last aim). (3) The free spectate button is lit only while free
// spectate is really on (the game also ends it without the button).
// The game's own feed and ping commands are counted, not run; preferences and the menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, lm = window.legendmod, E = window.LMEvents;
  if (!H || !app || !lm || !E || typeof app.macroFeed !== 'function') return { fail: ['phone controls, application, legendmod or LMEvents missing'] };
  var touch = function (el, type, id) {
    var r = el.getBoundingClientRect(), t = new Touch({ identifier: id, target: el, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    var on = type === 'touchend' ? [] : [t];
    el.dispatchEvent(new TouchEvent(type, { touches: on, targetTouches: on, changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var keepPrefs = null;
  try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var ov = document.getElementById('overlays'), menuWas = !!(ov && ov.getClientRects().length);
  var keepFeed = app.macroFeed, keepPing = app.sendTeamPing, keepChat = app.enterChatMessage;
  var keepMb = lm.multiBoxPlayerExists, keepFree = lm.isFreeSpectate;
  var calls = [], pings = [];
  var feeding = function () { return calls.length > 0 && calls[calls.length - 1] === true; };
  try {
    app.macroFeed = function (on) { calls.push(!!on); };
    app.sendTeamPing = function (t) { pings.push(t); };
    /* the chat box is not opened for real (no keyboard, nothing typed) */
    app.enterChatMessage = function () { };
    var p = {};
    try { p = JSON.parse(keepPrefs || '{}') || {}; } catch (e) { p = {}; }
    p.pingBtn = true; p.freeSpecBtn = true;
    localStorage.setItem('lm-mobile-prefs', JSON.stringify(p));
    H.reloadPrefs();
    app.hideMenu();
    await sleep(400);
    var C = H.controls(), bFeed = C.feed;
    /* (1) */
    var hold = function (id) { calls = []; touch(bFeed, 'touchstart', id); return feeding(); };
    var cases = [
      ['chat opening', function () { touch(C.chat, 'touchstart', 91); touch(C.chat, 'touchend', 91); }, false],
      ['death', function () { lm.multiBoxPlayerExists = false; E.emit('death', { time: Date.now(), mass: 0, msAlive: 0, context: 'replay' }); }, false],
      ['death with a multibox unit playing', function () { lm.multiBoxPlayerExists = true; E.emit('death', { time: Date.now(), mass: 0, msAlive: 0, context: 'replay' }); }, true],
      ['server change', function () { E.emit('serverChange', { host: 'probe.invalid' }); }, false]
    ];
    info.feed = {};
    /* the death / server change events are listened to only while the Feed is held */
    var listens = function () { return E._has('death') || E._has('serverChange'); };
    var before = listens();
    if (before) fail.push('death / serverChange listened to before the Feed was held');
    for (var i = 0; i < cases.length; i++) {
      if (!hold(80 + i)) { fail.push(cases[i][0] + ': the Feed button did not start feeding'); continue; }
      cases[i][1]();
      await sleep(30);
      info.feed[cases[i][0]] = calls.join(',');
      if (feeding() !== cases[i][2]) fail.push(cases[i][0] + (cases[i][2] ? ': the held Feed was stopped' : ': a held Feed kept feeding'));
      touch(bFeed, 'touchend', 80 + i);
      lm.multiBoxPlayerExists = keepMb;
      /* the chat case: close the (stubbed) chat again with a tap on its button */
      if (i === 0) { touch(C.chat, 'touchstart', 95); touch(C.chat, 'touchend', 95); }
    }
    if (!before && listens()) fail.push('death / serverChange still listened to after the Feed was let go');
    /* (2) */
    var ping = H.controls().ping;
    if (!ping) fail.push('the ping button was not built');
    else {
      app.showMenu();
      await sleep(300);
      pings = [];
      touch(ping, 'touchstart', 96); touch(ping, 'touchend', 96);
      info.pingInMenu = pings.slice();
      if (pings.length) fail.push('a tap on the ping button in the menu sent ping ' + pings.join(','));
      app.hideMenu();
      await sleep(300);
      pings = [];
      touch(ping, 'touchstart', 97); touch(ping, 'touchend', 97);
      info.pingPlaying = pings.slice();
      if (pings.length !== 1) fail.push('a tap on the ping button while playing sent ' + pings.length + ' pings (1 expected)');
    }
    /* (3) */
    var fs = H.controls().freeSpec;
    if (!fs) fail.push('the free spectate button was not built');
    else {
      lm.isFreeSpectate = true;
      await sleep(700);
      var litOn = fs.classList.contains('lm-active');
      lm.isFreeSpectate = false;
      await sleep(700);
      var litOff = fs.classList.contains('lm-active');
      info.freeSpec = [litOn, litOff];
      if (!litOn) fail.push('free spectate on: its button is not lit');
      if (litOff) fail.push('free spectate ended by the game: its button stayed lit');
    }
  } finally {
    app.macroFeed = keepFeed; app.sendTeamPing = keepPing; app.enterChatMessage = keepChat;
    lm.multiBoxPlayerExists = keepMb; lm.isFreeSpectate = keepFree;
    try { keepFeed.call(app, false); } catch (e) { }
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    H.reloadPrefs();
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
