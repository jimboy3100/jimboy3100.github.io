// A mouse button bound in the Hotkeys window, pressed on the game and released over a layer that
// keeps mouseup from the window, with real mouse input: the radial menu on the right button opens on
// the press, a real move points at a command and the release runs it once and closes the ring (until
// 3.692 the ring stayed open, ran nothing and its button stayed held); macro feed on the right button
// released over the Command Centre stops feeding. Bindings, the ring and the menu are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'mr' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  for (var w = 0; w < 40 && !(window.LMSmallTools && LMSmallTools.radialOpen && window.LMCommandCentre); w++) await sleep(250);
  var T = window.LMSmallTools, CC = window.LMCommandCentre, hc = window.hotkeysCommand, app = window.application;
  if (!T || !T.radialOpen || !CC || !hc || !app || typeof hotkeys !== 'object') return { fail: ['small tools, Command Centre or hotkeys missing'] };
  var savedHk = JSON.stringify(hotkeys), savedRad = null;
  try { savedRad = localStorage.getItem('lmRadialMenu'); } catch (e) { }
  var ov = document.getElementById('overlays'), ovDisp = ov ? ov.style.display : '';
  var runs = 0, origDown = hc['hk-showTime'].keyDown, origFeed = app.macroFeed;
  var cx = Math.round(innerWidth / 2), cy = Math.round(innerHeight / 2);
  /* the game, not the menu, takes the buttons */
  if (ov) ov.style.display = 'none';
  try {
    hc['hk-showTime'].keyDown = function () { runs++; };
    localStorage.setItem('lmRadialMenu', JSON.stringify({ v: 1, items: ['hk-showTime', 'hk-showGrid'] }));
    hotkeys['MOUSE RIGHT'] = 'hk-radialMenu';
    await send({ type: 'move', x: cx, y: cy });
    await sleep(150);
    await send({ type: 'mousedown', button: 'right', x: cx, y: cy });
    await sleep(300);
    info.openOnPress = T.radialOpen();
    if (!info.openOnPress) fail.push('the right button bound to the radial menu did not open it');
    var dot = document.querySelector('#lm-radial .lm-rd-dot');
    var dx = dot ? parseFloat(dot.style.left) : cx, dy = dot ? parseFloat(dot.style.top) : cy;
    /* sector 0 (the first command) is at the top */
    await send({ type: 'move', x: dx, y: dy - 80 });
    await sleep(200);
    info.selected = document.querySelectorAll('#lm-radial .lm-rd-item.on').length;
    await send({ type: 'mouseup', button: 'right', x: dx, y: dy - 80 });
    await sleep(400);
    info.openAfterRelease = T.radialOpen();
    info.runs = runs;
    info.heldAfter = !!window._lmHotkeyHeld('hk-radialMenu');
    if (info.openAfterRelease) fail.push('the radial menu stayed open after its button was released');
    if (runs !== 1) fail.push('releasing over the radial menu ran its command ' + runs + ' times');
    if (info.heldAfter) fail.push('the radial menu button stays held after its release');
  } catch (e) { fail.push('radial: ' + e); }
  try { if (T.radialOpen()) T.radialClose(); } catch (e) { }
  hc['hk-showTime'].keyDown = origDown;
  var feeds = [];
  try {
    app.macroFeed = function (on) { feeds.push(!!on); };
    hotkeys['MOUSE RIGHT'] = 'hk-macroFeed';
    await send({ type: 'mousedown', button: 'right', x: cx, y: cy });
    await sleep(200);
    CC.open();
    await sleep(300);
    info.ccOpen = CC.isOpen();
    await send({ type: 'mouseup', button: 'right', x: cx, y: cy });
    await sleep(300);
    info.feeds = feeds.join(',');
    if (feeds.join(',') !== 'true,false') fail.push('macro feed on the right button released over the Command Centre: ' + feeds.join(','));
  } catch (e) { fail.push('macro feed: ' + e); }
  try { if (CC.isOpen()) CC.close(); } catch (e) { }
  app.macroFeed = origFeed;
  var o = JSON.parse(savedHk), k;
  for (k in hotkeys) if (!Object.prototype.hasOwnProperty.call(o, k)) delete hotkeys[k];
  for (k in o) hotkeys[k] = o[k];
  try { if (savedRad == null) localStorage.removeItem('lmRadialMenu'); else localStorage.setItem('lmRadialMenu', savedRad); } catch (e) { }
  if (ov) ov.style.display = ovDisp;
  return { fail: fail, info: info };
})()
