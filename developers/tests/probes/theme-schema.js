// Theme settings schema in the real menu: every Theme tab slider is built from LM_THEME_SCHEMA
// (hudScale: 0.5 up to a top for the screen, inside its schema range) and shows the value the
// game uses; the theme values in use all fit the schema.
(async () => {
  var fail = [], info = {};
  var SCH = window.LM_THEME_SCHEMA, T = defaultSettings;
  if (!SCH || typeof lmThemeValue !== 'function') return { fail: ['LM_THEME_SCHEMA missing'], info: info };
  var sliders = 0, off = [];
  Object.keys(SCH).forEach(function (k) {
    var el = document.getElementById(k + '-slider');
    if (!el || !$(el).closest('#theme').length || !Array.isArray(SCH[k])) return;
    sliders++;
    var r = SCH[k], min = Number(el.min), max = Number(el.max);
    /* a stepped range is the slider's exactly; one without a step (hudScale) holds the slider's */
    if (r[2] > 0 ? min !== r[0] || max !== r[1] || Number(el.step) !== r[2] : min < r[0] || max > r[1]) off.push(k + ' range ' + el.min + '-' + el.max + '/' + el.step);
    /* the shown value: not on a phone (LMmobile lowers some sizes in memory) and not hudScale
     * (a value above this screen's slider top is kept; the slider stops at its top) */
    if (isMobile || k === 'hudScale') return;
    if (Number(el.value) !== T[k]) off.push(k + ' shows ' + el.value + ', game ' + T[k]);
    var label = document.getElementById(k + '-value');
    if (label && Number(label.textContent) !== T[k]) off.push(k + ' label ' + label.textContent);
  });
  info.sliders = sliders;
  if (sliders < 30) fail.push('only ' + sliders + ' schema sliders in the Theme tab');
  var bad = Object.keys(LM_THEME_DEFAULTS).filter(function (k) { return lmThemeValue(k, T[k]) !== T[k]; });
  if (bad.length) off.push('theme values off the schema: ' + bad.slice(0, 6).join(', '));
  off.slice(0, 8).forEach(function (m) { fail.push(m); });
  return { fail: fail, info: info };
})()
