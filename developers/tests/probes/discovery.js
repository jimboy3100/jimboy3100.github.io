// Discover features: does not open by itself on a first visit, opens,
// fits the screen, shows the feature cards with NEW badges (no server tab: the What works on this
// server table is removed), a switch flips the real option and back, and the close button (touch
// size) closes it and marks the cards seen.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && !window.LMDiscovery; w++) await sleep(200);
  var L = window.LMDiscovery;
  if (!L || typeof L.open !== 'function') return { fail: ['LMDiscovery not loaded (ogario/modules/discovery.js)'] };
  if (document.getElementById('lm-dc')) fail.push('opened by itself on a first visit');
  var saved = null;
  try { saved = localStorage.getItem('lmDiscover'); } catch (e) { }
  var dms = window.legendmod5 || window.defaultmapsettings || {};
  var before = dms.hudMoveDir;
  try {
    L.open();
    await sleep(150);
    var root = document.getElementById('lm-dc');
    var panel = root && root.querySelector('.lm-dc-panel');
    if (!panel) { fail.push('window did not open'); return { fail: fail, info: info }; }
    var pr = panel.getBoundingClientRect();
    info.panel = [Math.round(pr.left), Math.round(pr.top), Math.round(pr.width), Math.round(pr.height)];
    info.viewport = [innerWidth, innerHeight];
    if (pr.left < 0 || pr.top < 0 || pr.right > innerWidth + 1 || pr.bottom > innerHeight + 1) fail.push('window does not fit the screen');
    var cards = root.querySelectorAll('.lm-dc-card');
    info.cards = cards.length;
    if (cards.length < 12) fail.push(cards.length + ' cards');
    if (!root.querySelector('.lm-dc-card .lm-new-badge')) fail.push('no NEW badges on a first open');
    info.open = root.querySelectorAll('.lm-dc-btn[data-act="open"]').length;
    if (info.open < 8) fail.push('only ' + info.open + ' Open buttons');
    var chip = root.querySelector('.lm-dc-chip[data-opt="hudMoveDir"]');
    if (!chip) fail.push('no hudMoveDir switch');
    else if (chip.disabled) fail.push('hudMoveDir switch disabled (option checkbox not found)');
    else {
      chip.click();
      await sleep(100);
      var cb = document.getElementById('hudMoveDir');
      if (!cb || cb.checked === !!before) fail.push('switch did not flip the checkbox');
      if (dms.hudMoveDir === before) fail.push('switch did not change the setting');
      if (chip.classList.contains('on') !== !before) fail.push('switch does not show its state');
      chip.click();
      await sleep(100);
      if (dms.hudMoveDir !== before) fail.push('switch did not turn it back');
    }

    if (root.querySelector('.lm-dc-tab, .lm-dc-caps, #lm-dc-type')) fail.push('the removed server tab is back');

    var x = root.querySelector('.lm-dc-x');
    var xr = x.getBoundingClientRect();
    if (xr.width < 28 || xr.height < 28) fail.push('close button too small for touch');
    x.click();
    await sleep(80);
    if (document.getElementById('lm-dc')) fail.push('close button did not close');
    var st = L.core.parseStore(localStorage.getItem('lmDiscover'));
    if (!st.seen.length) fail.push('cards not marked seen on close');
    L.open();
    await sleep(80);
    if (document.querySelector('#lm-dc .lm-dc-card .lm-new-badge')) fail.push('NEW badges still shown after the cards were seen');
    L.close();
  } finally {
    try { if (L.isOpen()) L.close(); } catch (e) { }
    try { if (saved == null) localStorage.removeItem('lmDiscover'); else localStorage.setItem('lmDiscover', saved); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
