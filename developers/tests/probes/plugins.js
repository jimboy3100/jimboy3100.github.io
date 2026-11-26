// Plugins in the User Scripts panel: the view switch, the Plugins and Catalogue views, a catalogue
// example plugin (served from the checkout) installed into a free slot, run, registered, its settings
// saved and the slot turned off again; the version gate; a 'settingsChange' event; the Lab.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMPlugins && window.LMLab && document.getElementById('lm-us-bar') && document.querySelector('#og-options .lmLabGroup .lm-lab-acts')); i++) await wait(250);
  if (!window.LMPlugins) return { fail: ['LMPlugins missing (ogario/modules/plugins.js not loaded)'] };
  if (!window.LMLab) return { fail: ['LMLab missing (ogario/modules/lab.js not loaded)'] };
  if (!document.getElementById('lm-us-bar')) fail.push('no Editor / Plugins / Catalogue switch in the User Scripts panel');
  if (typeof window._lmUsGate !== 'function') fail.push('slot gate missing');
  ['hk-lmPlugins', 'hk-lmLab'].forEach(function (h) {
    if (!hotkeysCommand[h]) fail.push('hotkey ' + h + ' missing');
    else if (hotkeysCommand[h].defaultKey !== '') fail.push('hotkey ' + h + ' has a default key');
  });
  if (document.getElementById('lm-pl-overlay') || document.getElementById('lm-plugins-btn')) fail.push('a separate plugin manager window still exists');
  if (!document.querySelector('#og-options .lmLabGroup h5')) fail.push('no Lab section');
  var keys = ['lmLab', 'lmPluginSettings.mass-milestones', 'UserscriptEnabledInit'];
  for (var k = 1; k <= 5; k++) keys.push('Userscript' + k, 'Userscripttexture' + k, 'Userscripttext1' + k, 'UserscriptEnabled' + k);
  var saved = {};
  keys.forEach(function (key) { saved[key] = localStorage.getItem(key); });
  var origConfirm = window.confirm, asked = [], n = 0;
  window.confirm = function (m) { asked.push(String(m)); return true; };
  try {
    var free = LMPlugins.list().filter(function (s) { return s.empty; })[0];
    if (!free) fail.push('no empty slot to test with');
    LMPlugins.open('catalogue');
    var hud = document.getElementById('Userscriptshud2'), ext = document.getElementById('lm-us-ext');
    if (!hud || !hud.classList.contains('lm-us-alt')) fail.push('catalogue view not shown');
    for (i = 0; i < 40 && !document.querySelector('#lm-us-ext [data-cat="mass-milestones"]'); i++) await wait(150);
    info.catalogue = document.querySelectorAll('#lm-us-ext [data-cat]').length;
    var row = document.querySelector('#lm-us-ext [data-cat="mass-milestones"]');
    if (!row) fail.push('catalogue not listed');
    if (ext) {
      var r = ext.getBoundingClientRect();
      info.view = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
      if (r.width > 0 && (r.left < 0 || r.right > innerWidth + 1)) fail.push('plugin view wider than the screen: ' + info.view);
      if (ext.textContent.indexOf(lmT('modules.plugins.warn')) < 0) fail.push('no full access warning');
    }
    if (row && free) {
      row.querySelector('[data-act=install]').click();
      for (i = 0; i < 60; i++) {
        var s = LMPlugins.list()[free.slot - 1];
        if (s && s.registered) break;
        await wait(150);
      }
      n = free.slot;
      var p = LMPlugins.list()[n - 1];
      info.slot = n + ': ' + (p.name || '?') + ', ' + p.status + (p.registered ? ', registered' : '');
      if (p.id !== 'mass-milestones' || !p.enabled || p.status !== 'running' || !p.registered) fail.push('catalogue plugin not running in slot ' + info.slot);
      if (!asked.some(function (m) { return m.indexOf(lmT('modules.plugins.confirmPerms')) >= 0 && m.indexOf(lmT('modules.plugins.permGameRead')) >= 0; })) fail.push('no confirmation listing the permissions');
      if (localStorage.getItem('Userscript' + n) !== 'https://www.legendmod.ml/extras/plugins/mass-milestones.js') fail.push('slot URL not stored');
      if (!LMEvents._has('massUpdate')) fail.push('plugin did not add its massUpdate listener');
      /* Plugins view: settings, then the switch */
      document.querySelector('#lm-us-bar button[data-view=plugins]').click();
      var sb = document.querySelector('#lm-us-ext [data-slot="' + n + '"] [data-act=settings]');
      if (!sb) fail.push('no settings button for the plugin');
      else {
        sb.click();
        var inp = document.querySelector('#lm-us-ext [data-key=milestones]');
        if (!inp) fail.push('plugin settings form missing');
        else {
          inp.value = '2k, 4k';
          document.querySelector('#lm-us-ext [data-act=saveSettings]').click();
          if (JSON.parse(localStorage.getItem('lmPluginSettings.mass-milestones') || '{}').milestones !== '2k, 4k') fail.push('plugin settings not saved');
        }
      }
      await wait(50);
      var tg = document.querySelector('#lm-us-ext [data-slot-toggle="' + n + '"]');
      if (!tg || !tg.checked) fail.push('slot switch missing or off');
      else {
        tg.checked = false;
        tg.dispatchEvent(new Event('change', { bubbles: true }));
        if (LMEvents._has('massUpdate')) fail.push('turning the slot off left the listener');
        if (localStorage.getItem('UserscriptEnabled' + n) !== '0') fail.push('slot not turned off in storage');
      }
      /* Editor view, from the slot's Edit button: the header of the chosen slot under the slot chooser */
      if (document.querySelector('#lm-us-bar button[data-view=editor]')) fail.push('a separate Editor tab is back');
      var eb2 = document.querySelector('#lm-us-ext [data-slot="' + n + '"] [data-act=edit]');
      if (!eb2) fail.push('no Edit button on the slot'); else eb2.click();
      var allb = document.getElementById('lm-us-allslots');
      if (!allb || allb.style.display === 'none') fail.push('no way back to all slots while editing');
      $('#Userscriptpages3').val(String(n)).trigger('change');
      await wait(50);
      if (hud.classList.contains('lm-us-alt')) fail.push('editor view not back');
      var inf = document.getElementById('lm-us-info');
      if (!inf || !/Mass milestone toasts/.test(inf.textContent)) fail.push('header of the chosen slot not shown in the editor');
    }
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
    /* Lab: no built-in experiment (the frame time one is the stats option showStatsFrameTime) */
    if (document.getElementById('lmLab-frameTime')) fail.push('Lab still shows the frame time experiment');
    var ft = document.getElementById('showStatsFrameTime');
    if (!ft || !$(ft).closest('#og-options').length) fail.push('Settings > Stats: no frame time switch');
    else if (ft.checked || defaultmapsettings.showStatsFrameTime) fail.push('frame time switch on by default');
    var probeOn = 0;
    LMLab.register({ id: 'probeDemo', name: 'Probe demo', onEnable: function () { probeOn++; }, onDisable: function () { probeOn--; } });
    var cb = document.getElementById('lmLab-probeDemo');
    if (!cb) fail.push('Lab switch of a registered experiment missing');
    else {
      if (cb.checked || LMLab.isEnabled('probeDemo')) fail.push('Lab experiment on by default');
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
      if (probeOn !== 1) fail.push('Lab switch did not turn the experiment on');
      if (!(JSON.parse(localStorage.getItem('lmLab') || '{}').on || {}).probeDemo) fail.push('Lab state not stored in lmLab');
      document.getElementById('lm-lab-reset').click();
      if (probeOn !== 0 || cb.checked) fail.push('Reset Lab did not turn the experiment off');
    }
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
