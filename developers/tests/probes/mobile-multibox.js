// Phone run: the optional multibox button (gear panel) shows which player you control: P1 / P2 while a
// multibox unit exists (it follows LMEvents multiboxSwap), and the swap sign again once no unit exists,
// also when the last unit closes while the main player already has control (no swap event then; up to
// 3.697 the button stayed "P1"). Turning the option off and on again keeps it working (one listener).
// The player's phone preferences and multibox state are put back.
(async () => {
  var fail = [], info = {};
  if (!window.LM_IS_MOBILE) return { fail: fail, info: { skipped: 'not the phone run' } };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var H = window._lmMobileHost, lm = window.legendmod, cb = document.getElementById('lm-mbbtn');
  if (!H || !lm || !cb || typeof window.lmSetMbUnit !== 'function') return { fail: ['phone controls, multibox switch or lmSetMbUnit missing'] };
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var keepExists = lm.multiBoxPlayerExists, keepUnit = window.multiboxPlayerEnabled || 0, keepChecked = cb.checked;
  var set = function (on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); };
  var label = function () { var b = H.controls().multibox; return b ? b.textContent : null; };
  try {
    set(false); set(true); set(false); set(true);
    if (!H.controls().multibox) return { fail: ['the multibox button did not appear with the option on'] };
    if (label() !== '⇄') fail.push('no unit: the button shows "' + label() + '" instead of the swap sign');
    lm.multiBoxPlayerExists = true;
    window.lmSetMbUnit(1);
    info.unit = label();
    if (label() !== 'P2') fail.push('controlling the unit: "' + label() + '" instead of P2');
    window.lmSetMbUnit(0);
    info.main = label();
    if (label() !== 'P1') fail.push('controlling the main player: "' + label() + '" instead of P1');
    /* the last unit closes while the main player has control: no multiboxSwap event */
    lm.multiBoxPlayerExists = false;
    await sleep(700);
    info.gone = label();
    if (label() !== '⇄') fail.push('the unit is gone but the button still shows "' + label() + '"');
  } finally {
    lm.multiBoxPlayerExists = keepExists;
    if ((window.multiboxPlayerEnabled || 0) !== keepUnit) window.lmSetMbUnit(keepUnit);
    set(keepChecked);
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
  }
  return { fail: fail, info: info };
})()
