// Theme workshop: the window opens from its button under the Theme preset list (no hotkey) and
// fits the screen; My themes has no row in the Theme tab any more; a gallery theme is installed and previewed; Revert (and the automatic
// revert) put the theme back exactly; a theme with a URL shows it first; compare, export and
// import work; the x closes it. Everything is put back.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMThemeWorkshop && LMThemeWorkshop.open && $('#theme .lm-tw-open').length); i++) await wait(250);
  var TW = window.LMThemeWorkshop;
  if (!TW || !TW.open) return { fail: ['LMThemeWorkshop not loaded'] };
  if (window.hotkeysCommand && hotkeysCommand['hk-lmThemeWorkshop']) fail.push('the removed hotkey hk-lmThemeWorkshop is back');
  var openBtn = $('#theme .lm-tw-open'), presetBox = $('#themePreset').closest('.preset-box');
  if (!presetBox.length || !openBtn.prev().is(presetBox)) fail.push('workshop button not under the Theme preset list');
  if ($('#lm-mythemes-box, #lm-mythemes').length || window.LMMyThemes) fail.push('the removed My themes row is still there');
  var keys = ['lmThemeWorkshop', 'ogarioThemeSettings', 'ogarioSettings'];
  var saved = {};
  keys.forEach(function (k) { saved[k] = localStorage.getItem(k); });
  localStorage.removeItem('lmThemeWorkshop');
  var themeBefore = JSON.stringify(defaultSettings), storedBefore = localStorage.getItem('ogarioThemeSettings');
  var soundsBefore = JSON.stringify([defaultmapsettings.messageSound, defaultmapsettings.commandSound, defaultmapsettings.virusSoundurl]);
  var origConfirm = window.confirm;
  window.confirm = function () { return true; };
  var within = function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1;
  };
  try {
    $('#theme .lm-tw-open').first().trigger('click');
    var f = document.getElementById('lm-tw');
    if (!f) return { fail: fail.concat(['window did not open from the Theme tab button']) };
    var win = f.querySelector('.lm-tw-win');
    var wr = win.getBoundingClientRect();
    info.win = Math.round(wr.width) + 'x' + Math.round(wr.height) + ' in ' + innerWidth + 'x' + innerHeight;
    if (!within(win)) fail.push('window does not fit the screen: ' + info.win);
    var x = f.querySelector('.lm-tw-x').getBoundingClientRect();
    if (x.width < 36 || x.height < 30) fail.push('close button too small to tap: ' + Math.round(x.width) + 'x' + Math.round(x.height));

    // gallery: loaded from the repo, a theme installed
    $('#lm-tw .lm-tw-tabs button[data-tab=gallery]').trigger('click');
    for (i = 0; i < 40 && !$('#lm-tw .lm-tw-gitem').length; i++) await wait(200);
    info.gallery = $('#lm-tw .lm-tw-gitem').length;
    if (info.gallery < 4) fail.push('gallery shows ' + info.gallery + ' themes');
    if ($('#lm-tw .lm-tw-body').text().indexOf(lmT('modules.themeworkshop.publishNote')) < 0) fail.push('gallery does not say how to share a theme');
    /* the window's own import / export tab and buttons were removed (Settings > Export / Import is the one place) */
    if ($('#lm-tw [data-act=export], #lm-tw [data-act=import], #lm-tw #lm-tw-text, #lm-tw [data-tab=io]').length) fail.push('theme workshop still has its own import / export');
    $('#lm-tw [data-act=ginstall][data-id=neon]').trigger('click');
    var mine = TW.list().filter(function (t) { return t.src === 'g:neon'; })[0];
    if (!mine) fail.push('Neon not installed');
    if (!$('#lm-tw [data-act=ginstall][data-id=neon]').prop('disabled')) fail.push('install button not marked as installed');

    // URLs are shown before a theme that uses them is previewed
    $('#lm-tw [data-act=gpv][data-id=retro]').trigger('click');
    if (TW.previewing()) fail.push('Retro previewed without showing its cursor URL');
    if (!/cursor_15\.cur/.test($('#lm-tw .lm-tw-urls code').text())) fail.push('cursor URL not listed before the preview');
    $('#lm-tw [data-act=pv-cancel]').trigger('click');
    if ($('#lm-tw .lm-tw-urls').length || TW.previewing()) fail.push('Cancel did not drop the URL check');

    // preview from My themes, then Revert
    if (mine) {
      $('#lm-tw .lm-tw-tabs button[data-tab=mine]').trigger('click');
      $('#lm-tw [data-act=pv][data-id=' + mine.id + ']').trigger('click');
      if (!TW.previewing()) fail.push('preview did not start');
      if (defaultSettings.bgColor !== '#05010f' || defaultSettings.menuMainColor !== '#ff00d4') fail.push('preview not applied (bgColor ' + defaultSettings.bgColor + ')');
      if (localStorage.getItem('ogarioThemeSettings') !== storedBefore) fail.push('preview was saved');
      var bar = document.getElementById('lm-tw-pv');
      if (!bar) fail.push('no Keep / Revert bar');
      else {
        if (!within(bar)) fail.push('preview bar off screen');
        if (f.style.display !== 'none') fail.push('window not out of the way during the preview');
      }
      await wait(700); // the Theme tab saves 600 ms after a control change
      if (localStorage.getItem('ogarioThemeSettings') !== storedBefore) fail.push('preview saved by the Theme tab auto-save');
      $('#lm-tw-pv [data-pv=revert]').trigger('click');
      if (TW.previewing()) fail.push('Revert did not end the preview');
      if (JSON.stringify(defaultSettings) !== themeBefore) {
        var a = JSON.parse(themeBefore), d = [];
        for (var k in a) if (a[k] !== defaultSettings[k]) d.push(k + ': ' + a[k] + ' -> ' + defaultSettings[k]);
        fail.push('theme not restored exactly: ' + d.slice(0, 6).join('; '));
      }
      if (localStorage.getItem('ogarioThemeSettings') !== storedBefore) fail.push('stored theme changed after Revert');
      if (document.getElementById('lm-tw-pv')) fail.push('preview bar left after Revert');
      if (!document.getElementById('lm-tw') || document.getElementById('lm-tw').style.display === 'none') fail.push('window not back after Revert');
      await wait(700);
      if (localStorage.getItem('ogarioThemeSettings') !== storedBefore) fail.push('stored theme changed after Revert (auto-save)');

      // compare current vs Neon
      $('#lm-tw [data-act=cmp][data-id="m:' + mine.id + '"]').first().trigger('click');
      info.compareRows = $('#lm-tw table tr').length - 1;
      if (!(info.compareRows > 10)) fail.push('comparison lists ' + info.compareRows + ' differences');

      // export and import again
      var pkg = TW.exportPackage(mine.id);
      if (!pkg || pkg.format !== 'lm-theme' || pkg.theme.bgColor !== '#05010f') fail.push('export: ' + JSON.stringify(pkg).slice(0, 80));
      var n = TW.list().length;
      TW.importText(JSON.stringify(pkg));
      if (TW.list().length !== n + 1) fail.push('import of the export did not add a theme');
    }

    // the automatic revert, with a short time
    TW.preview({ theme: { bgColor: '#010203' } }, 'probe', 400);
    if (defaultSettings.bgColor !== '#010203') fail.push('scripted preview not applied');
    if (!TW.previewing()) fail.push('scripted preview ended before it was shown');
    await wait(1000);
    /* its timer checks 4 times a second; a slow machine runs it later (bounded) */
    for (i = 0; i < 40 && TW.previewing(); i++) await wait(200);
    if (TW.previewing()) fail.push('preview did not revert by itself');
    if (JSON.stringify(defaultSettings) !== themeBefore) fail.push('automatic revert did not restore the theme exactly');
    if (JSON.stringify([defaultmapsettings.messageSound, defaultmapsettings.commandSound, defaultmapsettings.virusSoundurl]) !== soundsBefore) fail.push('sounds changed');

    // the x closes it
    $('#lm-tw .lm-tw-x').trigger('click');
    if (document.getElementById('lm-tw')) fail.push('close button did not close the window');
  } finally {
    if (TW.previewing()) TW.revert();
    window.confirm = origConfirm;
    keys.forEach(function (k) { if (saved[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); });
    $('#lm-tw, #lm-tw-pv').remove();
  }
  return { fail: fail, info: info };
})()
