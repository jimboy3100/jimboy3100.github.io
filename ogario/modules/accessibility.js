/* Legend Mod accessibility option (Settings > Accessibility, off by default):
 *   a11yTextScale     larger menu text (1 = unchanged), separate from the HUD scale
 * (HUD text follows the HUD scale in Theme > HUD and the HUD editor's resize.)
 * While it is off this file adds no style or loop.
 * (Colour-blind colours and a high-contrast HUD: the theme preset "Colour-blind safe"; the
 * Expanding Land effects (death shake, particles, entrance spin): Reduced motion in
 * Settings > Expanding Land.)
 */
(function () {
    'use strict';
    var W = window;
    if (W._lmA11yLoaded) return;
    W._lmA11yLoaded = true;
    var D = W.document;

    /* ═══ Pure helpers (developers/tests/smalltools.js) ═══ */

    function cleanScale(v) {
        v = +v;
        return isFinite(v) ? Math.min(1.6, Math.max(1, Math.round(v * 100) / 100)) : 1;
    }
    /* one CSS rule that scales a text element relative to its parent (ratio = its own size /
     * the parent's, measured without the rule), so later HUD scale changes still apply */
    function scaleRule(sel, ratio, k) {
        if (!(ratio > 0) || !(k > 0)) return '';
        return sel + '{font-size:' + (Math.round(ratio * k * 10000) / 100) + '% !important;}';
    }

    var core = { cleanScale: cleanScale, scaleRule: scaleRule };
    var api = W.LMAccessibility = { _core: core };
    if (!D || !D.createElement) return;

    function settings() { return W.legendmod5 || W.defaultmapsettings || {}; }

    /* ═══ Text scale ═══ */

    var MENU_TEXT = ['#og-options label', '#og-options h5', '#og-options .box-label', '#og-options .title-box', '#theme label', '#theme h5', '#theme .title-box', '#theme .box-label',
        '.menu-tabs a', '.submenu-tabs a', '#hotkeys .key-label', '#hotkeys .default-key', '#hotkeys-inst', '#main-panel label', '#main-panel .btn', '#profile label',
        '#toast-container .toast-message', '#exp-imp label'];
    var textStyle = null, textSig = '';
    function measure(list, k, out) {
        list.forEach(function (sel) {
            var n = D.querySelector(sel);
            if (!n || !n.parentNode || n.parentNode.nodeType !== 1) return;
            var fs = parseFloat(W.getComputedStyle(n).fontSize), pfs = parseFloat(W.getComputedStyle(n.parentNode).fontSize);
            if (fs > 0 && pfs > 0) out.push(scaleRule(sel, fs / pfs, k));
        });
    }
    function applyText(menuK, force) {
        var sig = String(menuK);
        /* one property for windows that size their text from it */
        D.documentElement.style.setProperty('--lm-font-scale', sig);
        if (sig === textSig && !force) return;
        textSig = sig;
        if (menuK === 1) {
            if (textStyle && textStyle.parentNode) textStyle.parentNode.removeChild(textStyle);
            textStyle = null;
            return;
        }
        if (!textStyle) { textStyle = D.createElement('style'); textStyle.id = 'lm-a11y-text'; D.head.appendChild(textStyle); }
        /* measure the unscaled sizes */
        textStyle.textContent = '';
        var rules = [];
        measure(MENU_TEXT, menuK, rules);
        textStyle.textContent = rules.join('');
    }

    /* ═══ Applying the options ═══ */

    function sync(force) {
        applyText(cleanScale(settings().a11yTextScale), force === true);
    }
    api.sync = sync;
    api.remeasure = function () { sync(true); };

    /* the slider has no callback in the menu: follow its input here */
    D.addEventListener('input', function (e) {
        var id = e.target && e.target.id;
        if (id === 'a11yTextScale-slider') setTimeout(sync, 0);
    }, true);
    /* menus built later (theme, hotkeys): measure again when the menu opens with a text scale on */
    D.addEventListener('click', function (e) {
        if (textSig && textSig !== '1' && e.target && e.target.closest && e.target.closest('.menu-tabs a, .hotkeys-link')) setTimeout(function () { sync(true); }, 300);
    }, true);
    if (D.body) sync(); else D.addEventListener('DOMContentLoaded', function () { sync(); });
    /* a preset or import that changes it (ogario.v4.js lmSettingsCommit); the slider is
     * followed above */
    if (W.LMEvents && typeof W.LMEvents.on === 'function') {
        W.LMEvents.on('settingsChange', function (d) {
            if (d && d.key === 'a11yTextScale') setTimeout(function () { try { sync(); } catch (e) { } }, 0);
        });
    }
})();
