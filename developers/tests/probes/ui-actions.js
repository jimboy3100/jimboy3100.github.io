// A few UI actions run without throwing and leave the state as it was.
(async () => {
  var fail = [], done = [];
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  async function step(name, fn) {
    try { await fn(); done.push(name); } catch (e) { fail.push(name + ': ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); }
  }
  var app = window.application;
  await step('menu tabs', async function () {
    ['.theme-tab a', '.music-tab a', '.settings-tab a', '.start-tab a'].forEach(function (s) { $(s).first().trigger('click'); });
    await sleep(300);
  });
  await step('hotkeys window', async function () {
    $('.hotkeys-link').first().trigger('click');
    await sleep(700);
    if (!$('#hotkeys').is(':visible')) throw new Error('hotkeys window did not open');
    $('#close-hotkeys').trigger('click');
    await sleep(700);
    if ($('#hotkeys').is(':visible')) throw new Error('hotkeys window did not close');
  });
  await step('toggle grid twice', async function () {
    var before = defaultmapsettings.showGrid;
    app.setShowGrid(); app.setShowGrid();
    if (defaultmapsettings.showGrid !== before) throw new Error('showGrid changed');
  });
  await step('toggle skins full cycle', async function () {
    // three modes (custom+vanilla, custom only, vanilla only): three toggles return to the same mode
    var lm = window.legendmod, v = lm.vanillaSkins, c = lm.customSkins;
    try {
      app.toggleSkins();
      var v1 = lm.vanillaSkins, c1 = lm.customSkins;
      app.toggleSkins(); app.toggleSkins(); app.toggleSkins();
      if (lm.vanillaSkins !== v1 || lm.customSkins !== c1) throw new Error('skins mode did not cycle back');
    } finally { lm.vanillaSkins = v; lm.customSkins = c; }
  });
  await step('hide and show menu', async function () {
    app.hideMenu(); await sleep(400); app.showMenu(); await sleep(400);
  });
  await step('setSettings round trip', async function () {
    var before = defaultmapsettings.showGrid;
    app.setSettings('showGrid', !before); app.setSettings('showGrid', before);
    if (defaultmapsettings.showGrid !== before) throw new Error('showGrid not restored');
  });
  return { fail: fail, info: { done: done.length } };
})()
