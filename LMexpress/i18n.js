/* agar.io's own page texts (data-itr="page_play" and the like, filled by ogario.v4.master.js setUI), in
 * the language chosen in Legend Mod's Choose Language list. The texts are the "agario." keys of
 * developers/i18n/src/agario.json, loaded by languages/lm-i18n.js (this used to be English only and
 * followed the browser language). */
(function () {
    var build = function (code) { return window.LMi18n ? window.LMi18n.prefixed('agario.', code) : {}; };
    window.i18n_lang = (window.LMi18n && window.LMi18n.lang()) || 'en';
    window.i18n_dict = { en: build('en') };
    window.i18n_dict[window.i18n_lang] = build(window.i18n_lang);
    window.i18_list = window.i18n_dict[window.i18n_lang];
    if (window.LMi18n) window.LMi18n.onChange(function (code) {
        window.i18n_lang = code;
        window.i18n_dict[code] = build(code);
        window.i18_list = window.i18n_dict[code];
        /* setUI filled these once at start: fill them again (the language pack handler runs after this) */
        var els = document.querySelectorAll('[data-itr]');
        for (var i = 0; i < els.length; i++) {
            var k = els[i].getAttribute('data-itr');
            if (k && Object.prototype.hasOwnProperty.call(window.i18n_dict.en, k)) els[i].innerHTML = i18n(k);
        }
    });
})();
function i18n(s) { return window['i18_list'][s] || window['i18n_dict']['en'][s] || s; }
function parseString(tag, token, arr) {
    var finalText = i18n(tag);
    for (var i = 0; i < arr.length; i++) finalText = finalText.replace(token, arr[i]);
    return finalText;
}
window["parseString"] = parseString;
