// Switching between the spectate modes with real clicks and keys keeps the free spectate flag the
// way the server has it (Expanding Land client.c, Ogar servers): Spectate (opcode 1) is the follow
// camera, so the next Q starts free spectate; World Spectate (opcode 55) is its own mode and Q
// there goes to the follow camera. The flag stayed on after Spectate / World Spectate, so the next
// Q turned it off while the server started free roam (leaderboard and click follows then did
// nothing). The packets are recorded, not sent.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod, app = window.application;
  if (!lm || !app || typeof window.__lmInput !== 'function' || !window.jQuery) return { skip: 'no game or input: ' + [!!lm, !!app, typeof window.__lmInput, !!window.jQuery].join(',') };
  var ids = 0, waits = {};
  window.__lmInputDone = function (id) { if (waits[id]) { waits[id](); delete waits[id]; } };
  function inp(o) { return new Promise(function (r) { var id = 'w' + (++ids); o.id = id; waits[id] = r; window.__lmInput(JSON.stringify(o)); setTimeout(r, 3000); }); }
  function menuOn() { return jQuery('#overlays').is(':visible') && jQuery('#helloContainer').is(':visible'); }
  var keys = ['play', 'isSpectateEnabled', 'isFreeSpectate', '_isWorldSpectating', '_worldSpecPanX', '_worldSpecPanY', '_lmSpecLb', '_lmSpecCell', '_lmKiller', 'isLegendWorld', 'connectionOpened'];
  var saved = {}, menuWas = menuOn();
  keys.forEach(function (k) { saved[k] = lm[k]; });
  var sv = { sendAction: lm.sendAction, onSpectate: app.onSpectate, doubleSplit: app.doubleSplit };
  var sent = [];
  lm.sendAction = function (a) { sent.push(a); };
  /* the menu button's own part (joins the chat relay) is left out; the spectate packets come from
   * the button's click handler, which calls the real sendSpectate */
  app.onSpectate = function () { app.hideMenu(); };
  app.doubleSplit = function () { };
  async function key(k, code, kc) {
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    await inp({ type: 'key', key: k, code: code, keyCode: kc });
    await sleep(60);
  }
  async function openMenu() {
    if (menuOn()) return true;
    await key('Escape', 'Escape', 27);
    for (var t = 0; t < 20 && !menuOn(); t++) await sleep(100);
    if (!menuOn()) app.showMenu();
    await sleep(400); /* the menu's fade-in */
    /* a promo window (Legend FFA, daily reward) a player closes first */
    closePromos();
    return menuOn();
  }
  function closePromos() { jQuery('.lm-promo, [id^="LMPromo"]').remove(); }
  /* a real click on a menu button, once nothing (a tooltip) lies over it */
  async function click(sel) {
    var b = jQuery(sel).filter(':visible')[0];
    if (!b) return sel + ' not shown';
    await inp({ type: 'move', x: 5, y: 5 });
    for (var t = 0; t < 20; t++) {
      closePromos();
      var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, h = document.elementFromPoint(x, y);
      if (h && (h === b || b.contains(h))) { await inp({ type: 'click', x: x, y: y }); await sleep(150); return ''; }
      await sleep(100);
    }
    var hh = document.elementFromPoint(x, y);
    return sel + ' covered by ' + (hh ? hh.tagName + '#' + hh.id + '.' + String(hh.className).slice(0, 40) : 'nothing') + ' at ' + Math.round(x) + ',' + Math.round(y);
  }
  function flags() { return (lm.isSpectateEnabled ? 'S' : '-') + (lm.isFreeSpectate ? 'F' : '-') + (lm._isWorldSpectating ? 'W' : '-'); }
  var steps = [], sim = null;
  try {
    lm.play = false;
    lm.isSpectateEnabled = false; lm.isFreeSpectate = false; lm._isWorldSpectating = false;
    /* the button connects when the socket is not open: only with an open one */
    var elOk = function () { return !!lm.isLegendWorld && jQuery('.btn-full-map-spec').length > 0 && lm.isSocketOpen() && !!lm.connectionOpened; };
    for (var w = 0; w < 40 && lm.isLegendWorld && !elOk(); w++) await sleep(250);
    info.el = [!!lm.isLegendWorld, jQuery('.btn-full-map-spec').length, lm.isSocketOpen(), !!lm.connectionOpened].join(',');
    if (!elOk() && jQuery('.btn-full-map-spec').length) {
      /* not on Expanding Land: the menu and the packets as there, with an open connection (the
       * packets are only recorded); all put back below */
      sim = { st: lm.serverType, ast: app.serverType, own: Object.prototype.hasOwnProperty.call(lm, 'isSocketOpen'), iso: lm.isSocketOpen };
      lm.serverType = 'expandingland'; app.serverType = 'expandingland'; lm.isLegendWorld = true; lm.connectionOpened = true;
      lm.isSocketOpen = function () { return true; };
      if (typeof window._lwUpdateWorldSpecBtn === 'function') window._lwUpdateWorldSpecBtn();
      info.el += ' (simulated)';
    }
    var el = elOk();
    if (!(await openMenu())) throw 'the menu did not open';
    var e = await click('.btn-spectate'); if (e) throw e;
    steps.push('spectate ' + flags());
    if (!lm.isSpectateEnabled || lm.isFreeSpectate || sent.indexOf(1) < 0) fail.push('Spectate: ' + flags() + ', packets ' + sent.join(','));
    await key('q', 'KeyQ', 81);
    steps.push('Q ' + flags());
    if (!lm.isFreeSpectate) fail.push('Q while spectating did not start free spectate: ' + flags());
    /* back to the menu and Spectate again: the follow camera, free spectate over */
    if (!(await openMenu())) throw 'the menu did not open again';
    sent.length = 0;
    e = await click('.btn-spectate'); if (e) throw e;
    steps.push('spectate again ' + flags());
    if (sent.indexOf(1) < 0) fail.push('Spectate again sent ' + sent.join(','));
    if (lm.isFreeSpectate) fail.push('Spectate after free spectate kept free spectate on (the server follows a player now): ' + flags());
    await key('q', 'KeyQ', 81);
    steps.push('Q ' + flags());
    if (!lm.isFreeSpectate) fail.push('Q after Spectate did not start free spectate: ' + flags());
    if (el) {
      /* World Spectate from free spectate, then from the follow camera: Q goes to the follow camera */
      for (var round = 0; round < 2; round++) {
        if (!(await openMenu())) throw 'the menu did not open for World Spectate';
        sent.length = 0;
        e = await click('.btn-full-map-spec'); if (e) throw e;
        steps.push('world ' + flags());
        if (sent.indexOf(55) < 0 || !lm._isWorldSpectating) fail.push('World Spectate (' + round + '): ' + flags() + ', packets ' + sent.join(','));
        else {
          if (lm.isFreeSpectate) fail.push('World Spectate (' + round + ') kept free spectate on: ' + flags());
          sent.length = 0;
          await key('q', 'KeyQ', 81);
          steps.push('Q ' + flags());
          if (sent.indexOf(18) < 0) fail.push('Q in World Spectate sent ' + sent.join(','));
          if (lm.isFreeSpectate || lm._isWorldSpectating || !lm.isSpectateEnabled) fail.push('Q in World Spectate (' + round + '), the server follows a player: ' + flags());
        }
      }
      /* Watch killer from World Spectate (entered from the follow camera): Spectate first, then free
       * spectate; the Q alone went to the follow camera there */
      lm._isWorldSpectating = true; lm.isSpectateEnabled = true; lm.isFreeSpectate = false;
      lm._lmKiller = { cellId: 1, nick: '' };
      sent.length = 0;
      lm._lmWatchKiller();
      steps.push('watch killer ' + flags() + ' ' + sent.join(','));
      if (sent.join(',') !== '1,18' || !lm.isFreeSpectate || lm._isWorldSpectating) fail.push('Watch killer from World Spectate: ' + flags() + ', packets ' + sent.join(','));
    } else info.world = 'no World Spectate here';
  } catch (err) { fail.push('switching: ' + err); }
  info.steps = steps.join(' | ');
  lm.sendAction = sv.sendAction; app.onSpectate = sv.onSpectate; app.doubleSplit = sv.doubleSplit;
  keys.forEach(function (k) { lm[k] = saved[k]; });
  if (sim) {
    lm.serverType = sim.st; app.serverType = sim.ast;
    if (sim.own) lm.isSocketOpen = sim.iso; else delete lm.isSocketOpen;
    if (typeof window._lwUpdateWorldSpecBtn === 'function') window._lwUpdateWorldSpecBtn();
  }
  if (lm._lmSpecLbHud) lm._lmSpecLbHud();
  if (menuWas && !menuOn()) app.showMenu();
  else if (!menuWas && menuOn()) app.hideMenu();
  if (typeof keyBlind === 'object') Object.keys(keyBlind).forEach(function (k) { keyBlind[k] = false; });
  return { fail: fail, info: info };
})()
