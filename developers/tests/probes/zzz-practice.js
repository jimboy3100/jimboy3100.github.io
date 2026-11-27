// Practice arena: opens the window, runs a session for a few seconds (cells render, splits and
// feeds reach the simulation, nothing goes to a server), stops and checks the client is restored.
// Runs last: a session leaves the live server.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* waits for the simulation itself (its ticks, its cells), not for a number of frames: a slow
   * machine runs the arena's 40 ms ticks later (bounded) */
  var until = async function (cond, ms) { for (var t = performance.now(); !cond() && performance.now() - t < ms;) await sleep(50); return cond(); };
  var lm = window.legendmod;
  if (typeof window.lmPractice !== 'function') return { fail: ['window.lmPractice missing'] };
  window.lmPractice('open');
  for (var w = 0; w < 60 && !(window.LMPractice && window.LMPractice.run); w++) await sleep(100);
  var P = window.LMPractice;
  if (!P || !P.run) return { fail: ['module did not load'] };
  var win = document.getElementById('lm-pr');
  if (!win || win.style.display === 'none') fail.push('window did not open');
  else {
    var r = win.getBoundingClientRect();
    info.win = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
    if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('window outside the viewport: ' + info.win.join(','));
    var x = win.querySelector('button[title="' + CSS.escape(lmT('modules.practice.close')) + '"]');
    if (!x || x.getBoundingClientRect().width < 28) fail.push('no touch-sized close button');
  }
  var sent = 0, realSend = null;
  if (lm.socket && lm.socket.send && !lm.socket._lmPractice) { realSend = lm.socket.send; }
  /* what the session replaces, taken right before it (the page may join its server while the module loads) */
  var before = { slot: window.temporaryRecordedProtocol, serverType: lm.serverType, token: (document.getElementById('server-token') || {}).value };
  var simT0 = performance.now();
  P.start({ exercise: 'free', seed: 42, bots: 4, startMass: 300, duration: 120 }, { confirm: true });
  var st = P.state();
  if (!st.on) return { fail: fail.concat(['session did not start']), info: info };
  if (P.isOpen()) fail.push('window still open after start');
  await sleep(1500);
  await until(function () { return P.state().tick >= 20 && (lm.cells || []).length > 0 && (lm.food || []).length > 0 && (lm.playerCells || []).length === 1; }, 10000);
  var simMs = performance.now() - simT0;
  info.tick = P.state().tick;
  info.ticksPerSec = Math.round(info.tick / simMs * 10000) / 10;
  var sock = lm.socket;
  if (!sock || !sock._lmPractice) fail.push('stand-in socket not in place');
  if (lm.ws !== 'lm-practice://local') fail.push('ws is ' + lm.ws);
  info.cells = (lm.cells || []).length;
  info.food = (lm.food || []).length;
  info.own = (lm.playerCells || []).length;
  if (!(info.cells > 0)) fail.push('no cells rendered');
  if (!(info.food > 0)) fail.push('no food');
  if (info.own !== 1) fail.push('own cells: ' + info.own);
  if (!lm.play) fail.push('not playing');
  if (info.tick < 20) fail.push('simulation did not advance: ' + info.tick + ' ticks in ' + Math.round(simMs) + ' ms');
  /* on the real clock: never faster than one 40 ms tick each 40 ms */
  if (info.tick * 40 > simMs + 80) fail.push('simulation faster than real time: ' + info.tick + ' ticks in ' + Math.round(simMs) + ' ms');
  /* input through the normal paths */
  lm.cursorX = (lm.playerX || 0) + 600; lm.cursorY = lm.playerY || 0;
  if (window.application && application.split) application.split();
  await sleep(400);
  await until(function () { return P.state().humanCells >= 2 && (lm.playerCells || []).length >= 2; }, 5000);
  info.afterSplit = (lm.playerCells || []).length;
  if (P.state().humanCells < 2 || info.afterSplit < 2) fail.push('split did not reach the simulation: ' + P.state().humanCells + ' / ' + info.afterSplit);
  if (window.application && application.feed) application.feed();
  await sleep(300);
  await until(function () { return P.state().ejects > 0; }, 5000);
  info.ejected = (lm.cells || []).filter(function (c) { return c.isEjected; }).length;
  info.feeds = P.state().ejects;
  if (!(info.feeds > 0)) fail.push('feed did not reach the simulation');
  var hud = document.getElementById('lm-pr-hud');
  if (!hud || hud.style.display === 'none') fail.push('no HUD');
  else {
    var hr = hud.getBoundingClientRect();
    if (hr.left < 0 || hr.right > innerWidth + 1) fail.push('HUD wider than the screen');
    ['lm-notif-bell'].forEach(function (id) {
      var e = document.getElementById(id);
      if (!e || e.offsetParent === null && getComputedStyle(e).position !== 'fixed') return;
      var b = e.getBoundingClientRect();
      if (b.width && !(b.right <= hr.left || b.left >= hr.right || b.bottom <= hr.top || b.top >= hr.bottom)) info['overlaps_' + id] = true;
    });
  }
  /* settings window pauses the arena */
  P.open();
  var t0 = P.state().tick;
  await sleep(300);
  if (P.state().tick !== t0) fail.push('arena not paused while the window is open');
  P.close();
  await sleep(300);
  await until(function () { return P.state().tick > t0; }, 5000);
  if (!(P.state().tick > t0)) fail.push('arena did not resume');
  if (P.state().errors) fail.push('packet errors: ' + P.state().errors);
  P.stop(false);
  await sleep(200);
  if (P.on || P.state().on) fail.push('still on after stop');
  if (lm.socket && lm.socket._lmPractice) fail.push('stand-in socket left behind');
  if (String(lm.ws || '').indexOf('practice') !== -1) fail.push('practice ws left behind');
  if (lm.play) fail.push('still playing after stop');
  if (window.temporaryRecordedProtocol !== before.slot) fail.push('replay slot not restored');
  if (lm.serverType !== before.serverType) fail.push('server type not restored: ' + lm.serverType + ' != ' + before.serverType);
  if ((document.getElementById('server-token') || {}).value !== before.token) fail.push('server token not restored');
  if (hud && hud.style.display !== 'none') fail.push('HUD still shown');
  if (realSend) info.liveSocketWasClosed = true;
  return { fail: fail, info: info };
})()
