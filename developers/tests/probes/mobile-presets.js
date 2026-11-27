// Phone run, control editor > Layouts > Built-in presets: every preset loads without controls overlapping
// each other, the minimap, the leaderboard or the left button row (none that the usual layout does not
// already have), with every control on the screen;
// the preset names come from the language packs; in portrait (SMOKE_VIEWPORT=412x915) the combat
// buttons are in the lower half, within thumb reach. Up to 3.698 the names were English only and a
// portrait screen got the landscape positions (4x / 16x in the upper half, next to the leaderboard).
// The editor is closed with Cancel: nothing is stored.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost;
  if (!H) return { fail: ['phone controls missing'] };
  var barBtn = function (key) {
    var bs = document.querySelectorAll('#lm-ed-bar button');
    for (var i = 0; i < bs.length; i++) if (bs[i].getAttribute('data-i18n') === key) return bs[i];
    return null;
  };
  var portrait = innerHeight > innerWidth;
  info.screen = [innerWidth, innerHeight];
  try {
    H.openEditor();
    for (var i = 0; i < 40 && !(window.LMMobileEditor && window.LMMobileEditor.ready && document.getElementById('lm-ed')); i++) await sleep(200);
    var E = window.LMMobileEditor;
    if (!E || !document.getElementById('lm-ed')) return { fail: ['control editor did not open'], info: info };
    var rowsNow = function () {
      var d = document.getElementById('lm-ed-lay');
      if (!d) { barBtn('misc.editor.layouts').click(); d = document.getElementById('lm-ed-lay'); }
      return d ? [].slice.call(d.querySelectorAll('.it')).slice(-4) : [];
    };
    /* what the usual layout already has (a 412 px wide portrait screen: the left button row reaches
     * the minimap); a preset must add nothing to it */
    var base = (E._overlaps || []).map(function (x) { return x.join('+'); });
    info.usual = base;
    var n = rowsNow().length;
    if (n !== 4) return { fail: ['expected 4 built-in presets, found ' + n], info: info };
    info.presets = {};
    for (var p = 0; p < 4; p++) {
      var row = rowsNow()[p], name = row.querySelector('span');
      var label = name ? name.textContent : '?';
      if (!name || !name.getAttribute('data-i18n')) fail.push('preset "' + label + '" has a fixed English name (no language-pack key)');
      row.querySelector('button').click();
      await sleep(80);
      var pairs = (E._overlaps || []).map(function (x) { return x.join('+'); }).filter(function (x) { return base.indexOf(x) < 0; });
      var off = [], high = [];
      ['split', 'feed', 'x4', 'x16', 'multibox', 'menu'].forEach(function (id) {
        var px = document.querySelector('#lm-ed [data-ed="' + id + '"]');
        if (!px || !px.getClientRects().length) return;
        var r = px.getBoundingClientRect();
        if (r.left < -0.5 || r.top < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5) off.push(id);
        if (portrait && id !== 'menu' && r.top + r.height / 2 < innerHeight * 0.5) high.push(id);
      });
      info.presets[label] = { overlaps: pairs, off: off, high: high };
      if (pairs.length) fail.push('preset "' + label + '": ' + pairs.join(', ') + ' overlap');
      if (off.length) fail.push('preset "' + label + '": ' + off.join(', ') + ' off screen');
      if (high.length) fail.push('preset "' + label + '" in portrait: ' + high.join(', ') + ' in the upper half');
    }
  } finally {
    try { if (window.LMMobileEditor && window.LMMobileEditor.isOpen && window.LMMobileEditor.isOpen()) window.LMMobileEditor.close(false); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
