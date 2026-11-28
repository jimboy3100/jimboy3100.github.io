// Plugins in the User Scripts panel: the Plugins view with the 5 slots and no catalogue; the version gate; a 'settingsChange' event; the Lab is
// removed (no LMLab, no Lab hotkey, section or experiments group).
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMPlugins && document.getElementById('lm-us-bar')); i++) await wait(250);
  if (!window.LMPlugins) return { fail: ['LMPlugins missing (ogario/modules/plugins.js not loaded)'] };
  if (window.LMLab) fail.push('the removed Lab (LMLab) is still loaded');
  if (!document.getElementById('lm-us-bar')) fail.push('no Plugins switch in the User Scripts panel');
  if (typeof window._lmUsGate !== 'function') fail.push('slot gate missing');
  // the Lab is removed: no hotkey or Settings section of its own; User Scripts opens from the menu
  if (hotkeysCommand['hk-lmLab'] || hotkeysCommand['hk-lmPlugins']) fail.push('a Lab or User Scripts hotkey still exists');
  if (document.querySelector('#og-options .lmLabGroup')) fail.push('the Settings tab still has a Lab section');
  if (document.getElementById('lm-pl-overlay') || document.getElementById('lm-plugins-btn')) fail.push('a separate plugin manager window still exists');
  if (!$('#legend #OpenuserScripts').length) fail.push('User Scripts button missing in the Tools tab');
  var keys = ['UserscriptEnabledInit'];
  for (var k = 1; k <= 5; k++) keys.push('Userscript' + k, 'Userscripttexture' + k, 'Userscripttext1' + k, 'UserscriptEnabled' + k);
  var saved = {};
  keys.forEach(function (key) { saved[key] = localStorage.getItem(key); });
  var origConfirm = window.confirm, asked = [], n = 0;
  window.confirm = function (m) { asked.push(String(m)); return true; };
  try {
    var free = LMPlugins.list().filter(function (s) { return s.empty; })[0];
    if (!free) fail.push('no empty slot to test with');
    LMPlugins.open('plugins');
    var hud = document.getElementById('Userscriptshud2'), ext = document.getElementById('lm-us-ext');
    if (!hud || !hud.classList.contains('lm-us-alt')) fail.push('plugins view not shown');
    info.slots = document.querySelectorAll('#lm-us-ext [data-slot]').length;
    if (info.slots !== 5) fail.push('plugins view lists ' + info.slots + ' slots, not 5');
    if (ext) {
      var r = ext.getBoundingClientRect();
      info.view = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
      if (r.width > 0 && (r.left < 0 || r.right > innerWidth + 1)) fail.push('plugin view wider than the screen: ' + info.view);
      if (ext.textContent.indexOf(lmT('modules.plugins.warn')) < 0) fail.push('no full access warning');
    }
    /* the catalogue of example plugins is removed */
    if (document.querySelector('#lm-us-bar button[data-view=catalogue]') || LMPlugins.install || LMPlugins.catalogue) fail.push('the removed plugin catalogue is back');
    if (document.querySelector('#lm-us-bar button[data-view=editor]')) fail.push('a separate Editor tab is back');
    /* the version gate: a plugin for a newer Legend Mod does not run, plain scripts do */
    var ow = toastr.warning; toastr.warning = function () { };
    if (_lmUsGate(5, '// ==LMPlugin==\n// @name Future\n// @minVersion 99\n// ==/LMPlugin==\n', false) !== false) fail.push('incompatible plugin was allowed');
    toastr.warning = ow;
    if (_lmUsGate(5, 'void 0;', false) !== true) fail.push('plain user script blocked');
    LMPlugins.close();
    /* settingsChange */
    var got = [];
    var onSet = function (e) { got.push(e); };
    LMEvents.on('settingsChange', onSet);
    var before = defaultmapsettings.showGrid;
    application.setSettings('showGrid', !before);
    application.setSettings('showGrid', before);
    LMEvents.off('settingsChange', onSet);
    info.settingsChange = got.length;
    if (got.length !== 2 || got[0].key !== 'showGrid' || got[0].value !== !before || got[1].value !== before) fail.push('settingsChange events: ' + JSON.stringify(got));
    if (got[0] && !Object.isFrozen(got[0])) fail.push('settingsChange data not frozen');
    /* the old frame time switch is gone: the stats line shows the frame time instead of the FPS */
    if (document.getElementById('showStatsFrameTime')) fail.push('the old frame time switch still exists');
    LMPlugins.open('plugins');
    await wait(50);
    if (document.querySelector('#lm-us-exps, .lm-us-labs, #lm-lab-reset')) fail.push('User Scripts still has a Lab experiments group');
    LMPlugins.close();
  } finally {
    window.confirm = origConfirm;
    if (n) {
      try { $('#Userscriptpages3').val(String(n)); erasescripter(); } catch (e) { }
    }
    keys.forEach(function (key) { if (saved[key] === null) localStorage.removeItem(key); else localStorage.setItem(key, saved[key]); });
    try { LMPlugins.close(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
