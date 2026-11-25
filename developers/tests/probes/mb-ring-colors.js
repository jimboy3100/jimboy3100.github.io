// Multibox ring colours in the real menu: their colour boxes are in Theme > Basic theming
// (#theme-main, after the teammate indicator) and no longer in Settings > Multibox rings, which
// keeps its switches and size sliders and a line that says where the colours are.
(async () => {
  var fail = [], info = {};
  ['mbRingColorP1', 'mbRingColorP2'].forEach(function (k) {
    var inTheme = $('#theme-main .' + k + '-picker input#' + k).length;
    var inRings = $('.mbRingsGroup .' + k + '-picker, .mbRingsGroup #' + k).length;
    info[k] = { theme: inTheme, rings: inRings, value: defaultSettings[k] };
    if (inTheme !== 1) fail.push(k + ': ' + inTheme + ' colour boxes in #theme-main');
    if (inRings) fail.push(k + ': still in .mbRingsGroup');
    if (typeof lmThemeValue !== 'function' || lmThemeValue(k, defaultSettings[k]) !== defaultSettings[k]) fail.push(k + ': theme value off the schema');
    if (!(LM_THEME_SCHEMA[k] && LM_THEME_SCHEMA[k].color === true)) fail.push(k + ': no colour rule in LM_THEME_SCHEMA');
    /* the colour picker writes hex in lower case */
    if (String($('#theme-main .' + k + '-picker input').val()).toLowerCase() !== String(defaultSettings[k]).toLowerCase()) fail.push(k + ': box shows ' + $('#theme-main .' + k + '-picker input').val());
    /* the gameplay key stays valid (old imports) and holds the theme value */
    if (defaultmapsettings[k] !== defaultSettings[k]) fail.push(k + ': gameplay copy ' + defaultmapsettings[k] + ' != theme ' + defaultSettings[k]);
  });
  var boxes = $('#theme-main .color-box input').map(function () { return this.id; }).get();
  var ti = boxes.indexOf('teammatesIndColor');
  if (ti < 0 || boxes[ti + 1] !== 'mbRingColorP1' || boxes[ti + 2] !== 'mbRingColorP2') fail.push('ring colours not next to the teammate indicator: ' + boxes.slice(Math.max(0, ti), ti + 3).join(','));
  ['mbRingsP1', 'mbRingsP2', 'mbRingsActiveOnly'].forEach(function (k) { if (!$('.mbRingsGroup #' + k).length) fail.push(k + ' missing in .mbRingsGroup'); });
  ['mbRingSizeP1', 'mbRingSizeP2'].forEach(function (k) { if (!$('.mbRingsGroup #' + k + '-slider').length) fail.push(k + ' slider missing in .mbRingsGroup'); });
  var note = $('.mbRingsGroup .lm-mb-ring-colors-note');
  info.note = note.text();
  if (note.length !== 1 || !note.text() || note.text() === 'pkg.w.mbRingColorsNote') fail.push('no colour note in .mbRingsGroup');
  return { fail: fail, info: info };
})()
