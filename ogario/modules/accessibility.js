/* Legend Mod accessibility options (Settings > Accessibility, all off by default):
 *   a11yTextScale     larger menu text (1 = unchanged), separate from the HUD scale
 *   a11yHudTextScale  larger HUD text (leaderboard, stats, clock, chat); follows the HUD scale
 *                     (its slider is in Theme > HUD next to the HUD scale; still a gameplay setting)
 * While they are off this file adds no style or loop.
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
    var HUD_TEXT = ['#leaderboard-hud', '#top5-hud', '#stats-hud', '#time-hud', '#target-hud', '#pause-hud', '#chat-box',
        /* the newer HUD parts on body: they are made when first used, so they are measured once they exist */
        '#lm-killfeed', '#lm-dir-bc', '#lm-pr-hud', '#lm-shot-chip'];
    var textStyle = null, textSig = '', textSeen = '';
    function present(list) { return list.filter(function (sel) { return !!D.querySelector(sel); }).join(); }
    function measure(list, k, out) {
        list.forEach(function (sel) {
            var n = D.querySelector(sel);
            if (!n || !n.parentNode || n.parentNode.nodeType !== 1) return;
            var fs = parseFloat(W.getComputedStyle(n).fontSize), pfs = parseFloat(W.getComputedStyle(n.parentNode).fontSize);
            if (fs > 0 && pfs > 0) out.push(scaleRule(sel, fs / pfs, k));
        });
    }
    function applyText(menuK, hudK, force) {
        var sig = menuK + '|' + hudK;
        /* one set of properties for windows and HUD parts that size their text from it */
        var rs = D.documentElement.style;
        rs.setProperty('--lm-font-scale', String(menuK));
        rs.setProperty('--lm-hud-text-scale', String(hudK));
        var seen = hudK !== 1 ? present(HUD_TEXT) : '';
        if (sig === textSig && seen === textSeen && !force) return;
        textSig = sig;
        textSeen = seen;
        if (menuK === 1 && hudK === 1) {
            if (textStyle && textStyle.parentNode) textStyle.parentNode.removeChild(textStyle);
            textStyle = null;
            return;
        }
        if (!textStyle) { textStyle = D.createElement('style'); textStyle.id = 'lm-a11y-text'; D.head.appendChild(textStyle); }
        /* measure the unscaled sizes */
        textStyle.textContent = '';
        var rules = [];
        if (menuK !== 1) measure(MENU_TEXT, menuK, rules);
        if (hudK !== 1) measure(HUD_TEXT, hudK, rules);
        textStyle.textContent = rules.join('');
    }

    /* ═══ Applying the options ═══ */

    /* HUD parts made later (kill feed, notification bell, quick bar...) are measured once they
     * exist: looked for every 2 s, only while a HUD text size other than 1 is set */
    var hudTimer = null;
    function sync(force) {
        var s = settings(), hudK = cleanScale(s.a11yHudTextScale);
        applyText(cleanScale(s.a11yTextScale), hudK, force === true);
        if (hudK !== 1 && !hudTimer) hudTimer = setInterval(function () { try { sync(); } catch (e) { } }, 2000);
        else if (hudK === 1 && hudTimer) { clearInterval(hudTimer); hudTimer = null; }
    }
    api.sync = sync;
    api.remeasure = function () { sync(true); };

    /* the sliders have no callback in the menu: follow their input here */
    D.addEventListener('input', function (e) {
        var id = e.target && e.target.id;
        if (id === 'a11yTextScale-slider' || id === 'a11yHudTextScale-slider') setTimeout(sync, 0);
    }, true);
    /* menus built later (theme, hotkeys): measure again when the menu opens with a text scale on */
    D.addEventListener('click', function (e) {
        if (textSig && textSig !== '1|1' && e.target && e.target.closest && e.target.closest('.menu-tabs a, .hotkeys-link')) setTimeout(function () { sync(true); }, 300);
    }, true);
    if (D.body) sync(); else D.addEventListener('DOMContentLoaded', function () { sync(); });
    /* a profile, preset or import that changes them (ogario.v4.js lmSettingsCommit); the sliders
     * are followed above */
    var KEYS = { a11yTextScale: 1, a11yHudTextScale: 1 };
    if (W.LMEvents && typeof W.LMEvents.on === 'function') {
        W.LMEvents.on('settingsChange', function (d) {
            if (d && KEYS[d.key] === 1) setTimeout(function () { try { sync(); } catch (e) { } }, 0);
        });
    }
    api._hudTimerOn = function () { return !!hudTimer; };
})();
