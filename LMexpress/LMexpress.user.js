// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.9
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     https://jimboy3100.github.io
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @downloadURL  https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @updateURL    https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @run-at       document-start
// @inject-into  auto
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @connect      hslo.io
// @connect      agartool.io
// @connect      imasters.org.ru
// @connect      cdn.ogario.ovh
// @connect      deltav4.glitch.me
// @connect      jimboy3100.github.io
// @connect      legendmod.ml
// ==/UserScript==

// Legend Mod by Jimboy3100
/*MIT License*/

/*
 * Legend Express loader (bootstrap controller).
 *
 * agar.io/<mode> picks what runs in place of agar.io's own page: Legend Mod's play.html (agar.io/,
 * /legendmod, /neo, /mobile and unknown paths), another page (/captcha), a userscript (/hslo,
 * /agartool), a notice (/vanilla, /ogario, /delta), or nothing at all (/normal: agar.io untouched).
 *
 * Stages: ROUTING -> TAKEOVER -> LOADING -> INITIALIZING -> READY, and FAILED / RECOVERY from any of
 * them (at most one guarded reload per cause, never a loop). Parts, in this order:
 *   owner        only one loader per page: the Legend Express extension or this userscript
 *   router       the mode and the launch link (?sip= ?pass= ?replay= party)
 *   takeover     agar.io's page replaced at once by a local loading screen: nothing slow before it
 *   environment  Tampermonkey / Violentmonkey (GM_*), Greasemonkey 4 and Safari managers (GM.*), plain fetch
 *   transport    https-only downloads
 *   release      play.html kept in the manager's storage, checked on every visit
 *   loader       the page written, the mod's init(<version>) call after its own scripts
 *   lifecycle    init exactly once, its readiness signal
 *   recovery     a takeover that came after agar.io had started, a cached page that does not start
 *   diagnostics  sessionStorage "lmx-boot": the stages with their times, the source, any conflict
 */
(function () {
'use strict';

/* ---- owner: the first statement. Another loader of this same page load (same timeOrigin) already
 * owns it: do nothing. A value from an earlier page load in this tab is not live. ---- */
var LOADER = 'userscript';
var OWNER_KEY = 'lm-loader-owner', OWNER_ATTR = 'data-lm-loader';
var timeOrigin = '';
try { timeOrigin = String(performance.timeOrigin || performance.timing.navigationStart); } catch (e) { }
var OWNER = LOADER + ':' + timeOrigin;
function liveOwner(value) {
    var m = /^(extension|userscript):(.*)$/.exec(String(value || ''));
    return !!m && m[2] === timeOrigin;
}
var seenOwner = null;
try { seenOwner = sessionStorage.getItem(OWNER_KEY); } catch (e) { }
if (!liveOwner(seenOwner)) {
    try { seenOwner = document.documentElement ? document.documentElement.getAttribute(OWNER_ATTR) : null; } catch (e) { seenOwner = null; }
}
if (liveOwner(seenOwner)) return;
function claimOwner() {
    try { sessionStorage.setItem(OWNER_KEY, OWNER); } catch (e) { }
    try { if (document.documentElement) document.documentElement.setAttribute(OWNER_ATTR, OWNER); } catch (e) { }
}
claimOwner();

/* ---- router ---- */
var startedAt = 0;
try { startedAt = performance.now(); } catch (e) { }
/* Change to make browsers fetch a fresh play.html instead of a cached copy (also starts a new release cache) */
var pageVersion = 2;
var legendPage = 'https://www.legendmod.ml/play.html?' + pageVersion;
/*
 * page:   HTML page written over agar.io
 * script: userscript fetched and run
 * legend: the page is Legend Mod's play.html, so it gets the init(<version>) call and the release cache
 * extra:  userscript run on top of the Legend page
 * notice: { title, text, host, link, linkText } page shown instead (the mod's server is gone): text keys,
 *         host goes into the text's {0}
 * bypass: agar.io's own page is left alone
 */
var modes = {
    legendmod: { page: legendPage, legend: true },
    /* agar.io untouched: its page is neither stopped nor downloaded again */
    normal:    { bypass: true },
    hslo:      { script: 'https://hslo.io/install.user.js' },
    agartool:  { script: 'https://www.agartool.io/agartool.user.js' },
    /* Checked 2026-11: imasters.org.ru no longer answers over https (http only, which is
     * refused here), cdn.ogario.ovh does not resolve, and deltav4.glitch.me only redirects to
     * the Delta install page. Show a page with the right link instead of a blank page. */
    vanilla:   { notice: { title: 'lmx.us.vanillaOffline', text: 'lmx.us.noHttps', host: 'imasters.org.ru' } },
    ogario:    { notice: { title: 'lmx.us.ogarioOffline', text: 'lmx.us.serverGone', host: 'cdn.ogario.ovh' } },
    delta:     { notice: { title: 'lmx.us.deltaSeparate', text: 'lmx.us.deltaOwnScript', link: 'https://greasyfork.org/scripts/399197-delta-v4', linkText: 'lmx.us.deltaInstall' } },
    neo:       { page: legendPage, legend: true, extra: 'https://jimboy3100.github.io/ExampleScripts/Neoprivate.js' },
    mobile:    { page: legendPage, legend: true, extra: 'https://www.legendmod.ml/ExampleScripts/gamepad.user.js' },
    captcha:   { page: 'https://www.legendmod.ml/ogario/captcha.html' }
};
/* "/Normal/" and "/normal" are the same mode */
var modeName = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
var mode = Object.prototype.hasOwnProperty.call(modes, modeName) ? modes[modeName] : modes.legendmod;
if (mode.bypass) return;
/* early: none of agar.io's scripts ran yet; partial: its page is still being read, but its first scripts
 * ran (agar.io's game code is in its <head>, so it is running); late: its whole page and game ran (the
 * manager was slow). A partial or late start gets the same recovery. */
function agarScriptRan() {
    /* a script of agar.io's page (in it from the start: not async, not added by a manager or another
     * extension, which are async) that the page goes on after has run: the parser waits for it */
    var list = document.getElementsByTagName('script');
    for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (s === document.currentScript || !s.src || s.async || s.defer) continue;
        for (var n = s; n && n !== document; n = n.parentNode) if (n.nextSibling) return true;
    }
    return false;
}
var timing = document.readyState !== 'loading' ? 'late' : agarScriptRan() ? 'partial' : 'early';
var startedLate = timing !== 'early';

/* ---- takeover: agar.io's page is replaced by a loading screen in the player's menu colours.
 * document.open() stops its parser and drops the rest of it with its scripts. Not window.stop(): it
 * marks the parser as aborted, and the browser then ignored the later write of the mode's page
 * (a white page). Nothing of agar.io is disabled: WebSocket, timers, fetch... stay as they are. ---- */
var themeBg = '#00243e', themeBar = '#01d9cc';
try {
    var savedTheme = JSON.parse(localStorage.getItem('ogarioThemeSettings') || '{}');
    if (/^#[0-9a-f]{3,8}$/i.test(savedTheme.menuPanelColor || '')) themeBg = savedTheme.menuPanelColor;
    if (/^#[0-9a-f]{3,8}$/i.test(savedTheme.menuMainColor || '')) themeBar = savedTheme.menuMainColor;
} catch (e) { }
/* the same look as play.html's own loading screen (#lm-boot), which takes over from it */
try {
    document.open();
    document.write('<!DOCTYPE html><html ' + OWNER_ATTR + '="' + OWNER + '"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Legend Mod</title></head>' +
        '<body style="margin:0;background:' + themeBg + ';"><div id="lmx-loading" style="position:fixed;left:0;top:0;right:0;bottom:0;' +
        'z-index:2147483000;background:' + themeBg + ';color:#fff;font:15px/1.5 Ubuntu,Arial,sans-serif;display:flex;' + /* i18n-ok: style */
        'align-items:center;justify-content:center;"><div style="width:min(360px,80vw);text-align:center;">' +
        '<div style="font-size:26px;font-weight:700;letter-spacing:1px;">Legend Mod</div>' +
        '<div id="lmx-loading-text" style="margin:10px 0 12px;opacity:.85;min-height:22px;"></div>' +
        '<div style="height:6px;border-radius:3px;background:rgba(255,255,255,.15);overflow:hidden;">' +
        '<div style="height:100%;width:3%;border-radius:3px;background:' + themeBar + ';"></div></div>' +
        '<div id="lmx-loading-note" style="margin-top:8px;font-size:12px;opacity:.6;min-height:18px;"></div></div></div></body></html>');
    document.close();
} catch (e) { }
claimOwner();
var tookOverAt = 0;
try { tookOverAt = performance.now(); } catch (e) { }

/*
 * Texts in the language chosen in Legend Mod (agar.io's localStorage languagemod, 1 English ... 16 Italian;
 * never chosen: the browser's, else English). A userscript cannot load the mod's language files, so
 * developers/i18n/extension.js writes them in here from developers/i18n/src (lmx.us.*, lmx.ext.*, boot.loading).
 */
/* i18n:texts-start */ /* GENERATED by developers/i18n/extension.js: change the texts in developers/i18n/src */
var LMX_US_TEXTS = {
    "boot.loading": ["Loading... please wait", "\u03a6\u03cc\u03c1\u03c4\u03c9\u03c3\u03b7... \u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb\u03ce \u03c0\u03b5\u03c1\u03b9\u03bc\u03ad\u03bd\u03b5\u03c4\u03b5", "Cargando... por favor espere", "\u0417\u0430\u0440\u0435\u0436\u0434\u0430\u043d\u0435... \u043c\u043e\u043b\u044f, \u0438\u0437\u0447\u0430\u043a\u0430\u0439\u0442\u0435", "Chargement... veuillez patienter", "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644... \u064a\u0631\u062c\u0649 \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631", "\u8f09\u5165\u4e2d... \u8acb\u7a0d\u5019", "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430... \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435", "Wird geladen... bitte warten", "Y\u00fckleniyor... l\u00fctfen bekleyin", "\u0141adowanie... prosz\u0119 czeka\u0107", "Laden... even geduld", "Carregando... aguarde", "Memuat... harap tunggu", "\u8aad\u307f\u8fbc\u307f\u4e2d...\u304a\u5f85\u3061\u304f\u3060\u3055\u3044", "Caricamento... attendere"],
    "lmx.ext.library": ["Mod library (GitHub)", "\u0392\u03b9\u03b2\u03bb\u03b9\u03bf\u03b8\u03ae\u03ba\u03b7 mod (GitHub)", "Biblioteca del mod (GitHub)", "\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u043d\u0430 \u043c\u043e\u0434\u0430 (GitHub)", "Biblioth\u00e8que du mod (GitHub)", "\u0645\u0643\u062a\u0628\u0629 \u0627\u0644\u0645\u0648\u062f (GitHub)", "\u6a21\u7d44\u8cc7\u6e90\u5eab\uff08GitHub\uff09", "\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u043c\u043e\u0434\u0430 (GitHub)", "Mod-Bibliothek (GitHub)", "Mod k\u00fct\u00fcphanesi (GitHub)", "Biblioteka moda (GitHub)", "Modbibliotheek (GitHub)", "Biblioteca do mod (GitHub)", "Pustaka mod (GitHub)", "MOD\u30e9\u30a4\u30d6\u30e9\u30ea (GitHub)", "Libreria mod (GitHub)"],
    "lmx.ext.tryAgain": ["Try again", "\u0394\u03bf\u03ba\u03af\u03bc\u03b1\u03c3\u03b5 \u03be\u03b1\u03bd\u03ac", "Reintentar", "\u041e\u043f\u0438\u0442\u0430\u0439 \u043e\u0442\u043d\u043e\u0432\u043e", "R\u00e9essayer", "\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649", "\u518d\u8a66\u4e00\u6b21", "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430", "Erneut versuchen", "Tekrar dene", "Spr\u00f3buj ponownie", "Opnieuw proberen", "Tentar novamente", "Coba lagi", "\u518d\u8a66\u884c", "Riprova"],
    "lmx.ext.website": ["Legend Mod website", "\u0399\u03c3\u03c4\u03cc\u03c4\u03bf\u03c0\u03bf\u03c2 Legend Mod", "Web de Legend Mod", "\u0421\u0430\u0439\u0442 \u043d\u0430 Legend Mod", "Site de Legend Mod", "\u0645\u0648\u0642\u0639 Legend Mod", "Legend Mod \u7db2\u7ad9", "\u0421\u0430\u0439\u0442 Legend Mod", "Legend-Mod-Website", "Legend Mod web sitesi", "Strona Legend Mod", "Legend Mod-website", "Site do Legend Mod", "Situs Legend Mod", "Legend Mod\u306e\u30a6\u30a7\u30d6\u30b5\u30a4\u30c8", "Sito di Legend Mod"],
    "lmx.us.couldNotLoad": ["Legend Express could not load this mode", "\u03a4\u03bf Legend Express \u03b4\u03b5\u03bd \u03bc\u03c0\u03cc\u03c1\u03b5\u03c3\u03b5 \u03bd\u03b1 \u03c6\u03bf\u03c1\u03c4\u03ce\u03c3\u03b5\u03b9 \u03b1\u03c5\u03c4\u03ae \u03c4\u03b7 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1", "Legend Express no pudo cargar este modo", "Legend Express \u043d\u0435 \u0443\u0441\u043f\u044f \u0434\u0430 \u0437\u0430\u0440\u0435\u0434\u0438 \u0442\u043e\u0437\u0438 \u0440\u0435\u0436\u0438\u043c", "Legend Express n'a pas pu charger ce mode", "\u062a\u0639\u0630\u0651\u0631 \u0639\u0644\u0649 Legend Express \u062a\u062d\u0645\u064a\u0644 \u0647\u0630\u0627 \u0627\u0644\u0648\u0636\u0639", "Legend Express \u7121\u6cd5\u8f09\u5165\u6b64\u6a21\u5f0f", "Legend Express \u043d\u0435 \u0441\u043c\u043e\u0433 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u0440\u0435\u0436\u0438\u043c", "Legend Express konnte diesen Modus nicht laden", "Legend Express bu modu y\u00fckleyemedi", "Legend Express nie m\u00f3g\u0142 wczyta\u0107 tego trybu", "Legend Express kon deze modus niet laden", "O Legend Express n\u00e3o conseguiu carregar este modo", "Legend Express gagal memuat mode ini", "Legend Express\u306f\u3053\u306e\u30e2\u30fc\u30c9\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f", "Legend Express non \u00e8 riuscito a caricare questa modalit\u00e0"],
    "lmx.us.deltaInstall": ["Open the Delta install page", "\u0386\u03bd\u03bf\u03b9\u03b3\u03bc\u03b1 \u03c4\u03b7\u03c2 \u03c3\u03b5\u03bb\u03af\u03b4\u03b1\u03c2 \u03b5\u03b3\u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2 \u03c4\u03bf\u03c5 Delta", "Abrir la p\u00e1gina de instalaci\u00f3n de Delta", "\u041e\u0442\u0432\u043e\u0440\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u0442\u0430 \u0437\u0430 \u0438\u043d\u0441\u0442\u0430\u043b\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 Delta", "Ouvrir la page d'installation de Delta", "\u0627\u0641\u062a\u062d \u0635\u0641\u062d\u0629 \u062a\u062b\u0628\u064a\u062a Delta", "\u958b\u555f Delta \u5b89\u88dd\u9801\u9762", "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 Delta", "Delta-Installationsseite \u00f6ffnen", "Delta kurulum sayfas\u0131n\u0131 a\u00e7", "Otw\u00f3rz stron\u0119 instalacji Delta", "Open de installatiepagina van Delta", "Abrir a p\u00e1gina de instala\u00e7\u00e3o do Delta", "Buka halaman instalasi Delta", "Delta\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u30da\u30fc\u30b8\u3092\u958b\u304f", "Apri la pagina di installazione di Delta"],
    "lmx.us.deltaOwnScript": ["Delta has its own userscript.", "\u03a4\u03bf Delta \u03ad\u03c7\u03b5\u03b9 \u03b4\u03b9\u03ba\u03cc \u03c4\u03bf\u03c5 \u03c3\u03b5\u03bd\u03ac\u03c1\u03b9\u03bf \u03c7\u03c1\u03ae\u03c3\u03c4\u03b7.", "Delta tiene su propio userscript.", "Delta \u0438\u043c\u0430 \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d \u043f\u043e\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b\u0441\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442.", "Delta a son propre userscript.", "\u0644\u062f\u0649 Delta \u0633\u0643\u0631\u0628\u062a \u0645\u0633\u062a\u062e\u062f\u0645 \u062e\u0627\u0635 \u0628\u0647.", "Delta \u6709\u81ea\u5df1\u7684\u4f7f\u7528\u8005\u8173\u672c\u3002", "\u0423 Delta \u0435\u0441\u0442\u044c \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u044e\u0437\u0435\u0440\u0441\u043a\u0440\u0438\u043f\u0442.", "Delta hat ein eigenes Userscript.", "Delta'n\u0131n kendi kullan\u0131c\u0131 beti\u011fi var.", "Delta ma w\u0142asny skrypt u\u017cytkownika.", "Delta heeft een eigen userscript.", "O Delta tem seu pr\u00f3prio script.", "Delta memiliki userscript sendiri.", "Delta\u306b\u306f\u72ec\u81ea\u306e\u30e6\u30fc\u30b6\u30fc\u30b9\u30af\u30ea\u30d7\u30c8\u304c\u3042\u308a\u307e\u3059\u3002", "Delta ha il proprio userscript."],
    "lmx.us.deltaSeparate": ["Delta is installed separately", "\u03a4\u03bf Delta \u03b5\u03b3\u03ba\u03b1\u03b8\u03af\u03c3\u03c4\u03b1\u03c4\u03b1\u03b9 \u03be\u03b5\u03c7\u03c9\u03c1\u03b9\u03c3\u03c4\u03ac", "Delta se instala por separado", "Delta \u0441\u0435 \u0438\u043d\u0441\u0442\u0430\u043b\u0438\u0440\u0430 \u043e\u0442\u0434\u0435\u043b\u043d\u043e", "Delta s'installe s\u00e9par\u00e9ment", "\u064a\u064f\u062b\u0628\u064e\u0651\u062a Delta \u0628\u0634\u0643\u0644 \u0645\u0646\u0641\u0635\u0644", "Delta \u9700\u53e6\u5916\u5b89\u88dd", "Delta \u0443\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e", "Delta wird separat installiert", "Delta ayr\u0131 olarak kurulur", "Delta instaluje si\u0119 osobno", "Delta wordt apart ge\u00efnstalleerd", "O Delta \u00e9 instalado separadamente", "Delta diinstal secara terpisah", "Delta\u306f\u5225\u9014\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u307e\u3059", "Delta si installa separatamente"],
    "lmx.us.donate": ["Donate to Legend Mod", "\u0394\u03c9\u03c1\u03b5\u03ac \u03c3\u03c4\u03bf Legend Mod", "Donar a Legend Mod", "\u0414\u0430\u0440\u0438 \u043d\u0430 Legend Mod", "Faire un don \u00e0 Legend Mod", "\u062a\u0628\u0631\u0651\u0639 \u0644\u0640 Legend Mod", "\u8d0a\u52a9 Legend Mod", "\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u0442\u044c Legend Mod", "F\u00fcr Legend Mod spenden", "Legend Mod'a ba\u011f\u0131\u015f yap", "Wesprzyj Legend Mod", "Doneer aan Legend Mod", "Doar para o Legend Mod", "Donasi untuk Legend Mod", "Legend Mod\u306b\u5bc4\u4ed8", "Dona a Legend Mod"],
    "lmx.us.network": ["network error", "\u03c3\u03c6\u03ac\u03bb\u03bc\u03b1 \u03b4\u03b9\u03ba\u03c4\u03cd\u03bf\u03c5", "error de red", "\u043c\u0440\u0435\u0436\u043e\u0432\u0430 \u0433\u0440\u0435\u0448\u043a\u0430", "erreur r\u00e9seau", "\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0634\u0628\u0643\u0629", "\u7db2\u8def\u932f\u8aa4", "\u043e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438", "Netzwerkfehler", "a\u011f hatas\u0131", "b\u0142\u0105d sieci", "netwerkfout", "erro de rede", "kesalahan jaringan", "\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a8\u30e9\u30fc", "errore di rete"],
    "lmx.us.noHttps": ["Its server ({0}) no longer serves the script over https.", "\u039f server \u03c4\u03bf\u03c5 ({0}) \u03b4\u03b5\u03bd \u03c0\u03b1\u03c1\u03ad\u03c7\u03b5\u03b9 \u03c0\u03bb\u03ad\u03bf\u03bd \u03c4\u03bf \u03c3\u03b5\u03bd\u03ac\u03c1\u03b9\u03bf \u03bc\u03ad\u03c3\u03c9 https.", "Su servidor ({0}) ya no ofrece el script por https.", "\u0421\u044a\u0440\u0432\u044a\u0440\u044a\u0442 \u043c\u0443 ({0}) \u0432\u0435\u0447\u0435 \u043d\u0435 \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u044f \u0441\u043a\u0440\u0438\u043f\u0442\u0430 \u043f\u0440\u0435\u0437 https.", "Son serveur ({0}) ne fournit plus le script en https.", "\u062e\u0627\u062f\u0645\u0647 ({0}) \u0644\u0645 \u064a\u0639\u062f \u064a\u0642\u062f\u0651\u0645 \u0627\u0644\u0633\u0643\u0631\u0628\u062a \u0639\u0628\u0631 https.", "\u5176\u4f3a\u670d\u5668\uff08{0}\uff09\u5df2\u4e0d\u518d\u900f\u904e https \u63d0\u4f9b\u8173\u672c\u3002", "\u0415\u0433\u043e \u0441\u0435\u0440\u0432\u0435\u0440 ({0}) \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435 \u043e\u0442\u0434\u0430\u0451\u0442 \u0441\u043a\u0440\u0438\u043f\u0442 \u043f\u043e https.", "Sein Server ({0}) liefert das Skript nicht mehr \u00fcber https.", "Sunucusu ({0}) art\u0131k beti\u011fi https \u00fczerinden sunmuyor.", "Jego serwer ({0}) nie udost\u0119pnia ju\u017c skryptu przez https.", "Zijn server ({0}) levert het script niet meer via https.", "O servidor ({0}) n\u00e3o fornece mais o script via https.", "Servernya ({0}) tidak lagi menyediakan skrip melalui https.", "\u30b5\u30fc\u30d0\u30fc\uff08{0}\uff09\u306fhttps\u3067\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u914d\u4fe1\u3057\u3066\u3044\u307e\u305b\u3093\u3002", "Il server ({0}) non fornisce pi\u00f9 lo script via https."],
    "lmx.us.notHttps": ["not https", "\u03cc\u03c7\u03b9 https", "no es https", "\u043d\u0435 \u0435 https", "pas en https", "\u0644\u064a\u0633 https", "\u4e0d\u662f https", "\u043d\u0435 https", "kein https", "https de\u011fil", "nie https", "geen https", "n\u00e3o \u00e9 https", "bukan https", "https\u3067\u306f\u3042\u308a\u307e\u305b\u3093", "non https"],
    "lmx.us.ogarioOffline": ["OGARio is offline", "\u03a4\u03bf OGARio \u03b5\u03af\u03bd\u03b1\u03b9 \u03b5\u03ba\u03c4\u03cc\u03c2 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1\u03c2", "OGARio no est\u00e1 disponible", "OGARio \u0435 \u043e\u0444\u043b\u0430\u0439\u043d", "OGARio est hors ligne", "OGARio \u063a\u064a\u0631 \u0645\u062a\u0627\u062d", "OGARio \u5df2\u96e2\u7dda", "OGARio \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d", "OGARio ist offline", "OGARio \u00e7evrim d\u0131\u015f\u0131", "OGARio jest niedost\u0119pny", "OGARio is offline", "O OGARio est\u00e1 offline", "OGARio offline", "OGARio\u306f\u30aa\u30d5\u30e9\u30a4\u30f3\u3067\u3059", "OGARio \u00e8 offline"],
    "lmx.us.playLegend": ["Play with Legend Mod", "\u03a0\u03b1\u03af\u03be\u03b5 \u03bc\u03b5 \u03c4\u03bf Legend Mod", "Jugar con Legend Mod", "\u0418\u0433\u0440\u0430\u0439 \u0441 Legend Mod", "Jouer avec Legend Mod", "\u0627\u0644\u0639\u0628 \u0645\u0639 Legend Mod", "\u4f7f\u7528 Legend Mod \u904a\u73a9", "\u0418\u0433\u0440\u0430\u0442\u044c \u0441 Legend Mod", "Mit Legend Mod spielen", "Legend Mod ile oyna", "Graj z Legend Mod", "Spelen met Legend Mod", "Jogar com Legend Mod", "Main dengan Legend Mod", "Legend Mod\u3067\u30d7\u30ec\u30a4", "Gioca con Legend Mod"],
    "lmx.us.playNoMods": ["Play without mods", "\u03a0\u03b1\u03af\u03be\u03b5 \u03c7\u03c9\u03c1\u03af\u03c2 mods", "Jugar sin mods", "\u0418\u0433\u0440\u0430\u0439 \u0431\u0435\u0437 \u043c\u043e\u0434\u043e\u0432\u0435", "Jouer sans mods", "\u0627\u0644\u0639\u0628 \u0628\u062f\u0648\u0646 \u0645\u0648\u062f\u0627\u062a", "\u4e0d\u4f7f\u7528\u6a21\u7d44\u904a\u73a9", "\u0418\u0433\u0440\u0430\u0442\u044c \u0431\u0435\u0437 \u043c\u043e\u0434\u043e\u0432", "Ohne Mods spielen", "Modsuz oyna", "Graj bez mod\u00f3w", "Spelen zonder mods", "Jogar sem mods", "Main tanpa mod", "MOD\u306a\u3057\u3067\u30d7\u30ec\u30a4", "Gioca senza mod"],
    "lmx.us.playVanilla": ["Play agar.io without the mod", "\u03a0\u03b1\u03af\u03be\u03b5 agar.io \u03c7\u03c9\u03c1\u03af\u03c2 \u03c4\u03bf mod", "Jugar a agar.io sin el mod", "\u0418\u0433\u0440\u0430\u0439 agar.io \u0431\u0435\u0437 \u043c\u043e\u0434\u0430", "Jouer \u00e0 agar.io sans le mod", "\u0627\u0644\u0639\u0628 agar.io \u0628\u062f\u0648\u0646 \u0627\u0644\u0645\u0648\u062f", "\u4e0d\u4f7f\u7528\u6a21\u7d44\u73a9 agar.io", "\u0418\u0433\u0440\u0430\u0442\u044c \u0432 agar.io \u0431\u0435\u0437 \u043c\u043e\u0434\u0430", "agar.io ohne den Mod spielen", "agar.io'yu mod olmadan oyna", "Graj w agar.io bez moda", "agar.io spelen zonder de mod", "Jogar agar.io sem o mod", "Main agar.io tanpa mod", "MOD\u306a\u3057\u3067agar.io\u3092\u30d7\u30ec\u30a4", "Gioca ad agar.io senza mod"],
    "lmx.us.redirected": ["redirected off https to {0}", "\u03b1\u03bd\u03b1\u03ba\u03b1\u03c4\u03b5\u03cd\u03b8\u03c5\u03bd\u03c3\u03b7 \u03b5\u03ba\u03c4\u03cc\u03c2 https \u03c0\u03c1\u03bf\u03c2 {0}", "redirigido fuera de https a {0}", "\u043f\u0440\u0435\u043d\u0430\u0441\u043e\u0447\u0435\u043d\u043e \u0438\u0437\u0432\u044a\u043d https \u043a\u044a\u043c {0}", "redirig\u00e9 hors https vers {0}", "\u0623\u064f\u0639\u064a\u062f \u0627\u0644\u062a\u0648\u062c\u064a\u0647 \u062e\u0627\u0631\u062c https \u0625\u0644\u0649 {0}", "\u88ab\u91cd\u65b0\u5c0e\u5411\u96e2\u958b https \u81f3 {0}", "\u043f\u0435\u0440\u0435\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e \u0431\u0435\u0437 https \u043d\u0430 {0}", "ohne https umgeleitet nach {0}", "https d\u0131\u015f\u0131na y\u00f6nlendirildi: {0}", "przekierowano poza https do {0}", "zonder https doorgestuurd naar {0}", "redirecionado de https para {0}", "dialihkan dari https ke {0}", "https\u304b\u3089{0}\u306b\u30ea\u30c0\u30a4\u30ec\u30af\u30c8\u3055\u308c\u307e\u3057\u305f", "reindirizzato da https a {0}"],
    "lmx.us.restartOnce": ["Agar.io started first: restarting once so that only Legend Mod runs", "\u03a4\u03bf Agar.io \u03be\u03b5\u03ba\u03af\u03bd\u03b7\u03c3\u03b5 \u03c0\u03c1\u03ce\u03c4\u03bf: \u03b3\u03af\u03bd\u03b5\u03c4\u03b1\u03b9 \u03bc\u03af\u03b1 \u03b5\u03c0\u03b1\u03bd\u03b5\u03ba\u03ba\u03af\u03bd\u03b7\u03c3\u03b7 \u03ce\u03c3\u03c4\u03b5 \u03bd\u03b1 \u03c4\u03c1\u03ad\u03c7\u03b5\u03b9 \u03bc\u03cc\u03bd\u03bf \u03c4\u03bf Legend Mod", "Agar.io arranc\u00f3 primero: reiniciando una vez para que solo funcione Legend Mod", "Agar.io \u0441\u0442\u0430\u0440\u0442\u0438\u0440\u0430 \u043f\u044a\u0440\u0432\u0438: \u0440\u0435\u0441\u0442\u0430\u0440\u0442\u0438\u0440\u0430\u043d\u0435 \u0432\u0435\u0434\u043d\u044a\u0436, \u0437\u0430 \u0434\u0430 \u0440\u0430\u0431\u043e\u0442\u0438 \u0441\u0430\u043c\u043e Legend Mod", "Agar.io a d\u00e9marr\u00e9 en premier : red\u00e9marrage unique pour que seul Legend Mod tourne", "\u0628\u062f\u0623 Agar.io \u0623\u0648\u0644\u0627\u064b: \u0625\u0639\u0627\u062f\u0629 \u062a\u0634\u063a\u064a\u0644 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629 \u0644\u064a\u0639\u0645\u0644 Legend Mod \u0648\u062d\u062f\u0647", "Agar.io \u5148\u555f\u52d5\u4e86\uff1a\u91cd\u65b0\u555f\u52d5\u4e00\u6b21\uff0c\u8b93\u53ea\u6709 Legend Mod \u57f7\u884c", "Agar.io \u0437\u0430\u043f\u0443\u0441\u0442\u0438\u043b\u0441\u044f \u043f\u0435\u0440\u0432\u044b\u043c: \u043e\u0434\u0438\u043d \u043f\u0435\u0440\u0435\u0437\u0430\u043f\u0443\u0441\u043a, \u0447\u0442\u043e\u0431\u044b \u0440\u0430\u0431\u043e\u0442\u0430\u043b \u0442\u043e\u043b\u044c\u043a\u043e Legend Mod", "Agar.io ist zuerst gestartet: einmaliger Neustart, damit nur Legend Mod l\u00e4uft", "Agar.io \u00f6nce ba\u015flad\u0131: yaln\u0131zca Legend Mod \u00e7al\u0131\u015fs\u0131n diye bir kez yeniden ba\u015flat\u0131l\u0131yor", "Agar.io uruchomi\u0142 si\u0119 pierwszy: jednorazowy restart, aby dzia\u0142a\u0142 tylko Legend Mod", "Agar.io startte eerst: \u00e9\u00e9n keer herstarten zodat alleen Legend Mod draait", "O Agar.io iniciou primeiro: reiniciando uma vez para que s\u00f3 o Legend Mod rode", "Agar.io berjalan lebih dulu: memulai ulang sekali agar hanya Legend Mod yang berjalan", "Agar.io\u304c\u5148\u306b\u8d77\u52d5\u3057\u307e\u3057\u305f\uff1aLegend Mod\u3060\u3051\u304c\u52d5\u304f\u3088\u3046\u4e00\u5ea6\u3060\u3051\u518d\u8d77\u52d5\u3057\u307e\u3059", "Agar.io \u00e8 partito per primo: riavvio una volta perch\u00e9 giri solo Legend Mod"],
    "lmx.us.serverGone": ["Its server ({0}) no longer exists.", "\u039f server \u03c4\u03bf\u03c5 ({0}) \u03b4\u03b5\u03bd \u03c5\u03c0\u03ac\u03c1\u03c7\u03b5\u03b9 \u03c0\u03b9\u03b1.", "Su servidor ({0}) ya no existe.", "\u0421\u044a\u0440\u0432\u044a\u0440\u044a\u0442 \u043c\u0443 ({0}) \u0432\u0435\u0447\u0435 \u043d\u0435 \u0441\u044a\u0449\u0435\u0441\u0442\u0432\u0443\u0432\u0430.", "Son serveur ({0}) n'existe plus.", "\u062e\u0627\u062f\u0645\u0647 ({0}) \u0644\u0645 \u064a\u0639\u062f \u0645\u0648\u062c\u0648\u062f\u064b\u0627.", "\u5176\u4f3a\u670d\u5668\uff08{0}\uff09\u5df2\u4e0d\u5b58\u5728\u3002", "\u0415\u0433\u043e \u0441\u0435\u0440\u0432\u0435\u0440 ({0}) \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.", "Sein Server ({0}) existiert nicht mehr.", "Sunucusu ({0}) art\u0131k yok.", "Jego serwer ({0}) ju\u017c nie istnieje.", "Zijn server ({0}) bestaat niet meer.", "O servidor ({0}) n\u00e3o existe mais.", "Servernya ({0}) sudah tidak ada.", "\u30b5\u30fc\u30d0\u30fc\uff08{0}\uff09\u306f\u5b58\u5728\u3057\u307e\u305b\u3093\u3002", "Il server ({0}) non esiste pi\u00f9."],
    "lmx.us.status": ["status {0}", "\u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7 {0}", "estado {0}", "\u0441\u0442\u0430\u0442\u0443\u0441 {0}", "statut {0}", "\u0627\u0644\u062d\u0627\u0644\u0629 {0}", "\u72c0\u614b {0}", "\u0441\u0442\u0430\u0442\u0443\u0441 {0}", "Status {0}", "durum {0}", "status {0}", "status {0}", "status {0}", "status {0}", "\u30b9\u30c6\u30fc\u30bf\u30b9 {0}", "stato {0}"],
    "lmx.us.timeout": ["timed out after {0} s", "\u03bb\u03ae\u03be\u03b7 \u03c7\u03c1\u03cc\u03bd\u03bf\u03c5 \u03bc\u03b5\u03c4\u03ac \u03b1\u03c0\u03cc {0} \u03b4", "tiempo agotado tras {0} s", "\u0438\u0437\u0442\u0435\u0447\u0435 \u0432\u0440\u0435\u043c\u0435\u0442\u043e \u0441\u043b\u0435\u0434 {0} s", "d\u00e9lai d\u00e9pass\u00e9 apr\u00e8s {0} s", "\u0627\u0646\u062a\u0647\u062a \u0627\u0644\u0645\u0647\u0644\u0629 \u0628\u0639\u062f {0} \u062b", "{0} \u79d2\u5f8c\u903e\u6642", "\u0432\u0440\u0435\u043c\u044f \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f \u0438\u0441\u0442\u0435\u043a\u043b\u043e \u0447\u0435\u0440\u0435\u0437 {0} \u0441", "Zeit\u00fcberschreitung nach {0} s", "{0} sn sonra zaman a\u015f\u0131m\u0131", "przekroczono czas po {0} s", "time-out na {0} s", "tempo limite ap\u00f3s {0} s", "waktu habis setelah {0} dtk", "{0}\u79d2\u3067\u30bf\u30a4\u30e0\u30a2\u30a6\u30c8", "tempo scaduto dopo {0} s"],
    "lmx.us.vanillaOffline": ["Vanilla mod is offline", "\u03a4\u03bf Vanilla mod \u03b5\u03af\u03bd\u03b1\u03b9 \u03b5\u03ba\u03c4\u03cc\u03c2 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1\u03c2", "El mod Vanilla no est\u00e1 disponible", "Vanilla \u043c\u043e\u0434\u044a\u0442 \u0435 \u043e\u0444\u043b\u0430\u0439\u043d", "Le mod Vanilla est hors ligne", "\u0645\u0648\u062f Vanilla \u063a\u064a\u0631 \u0645\u062a\u0627\u062d", "Vanilla \u6a21\u7d44\u5df2\u96e2\u7dda", "\u041c\u043e\u0434 Vanilla \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d", "Der Vanilla-Mod ist offline", "Vanilla modu \u00e7evrim d\u0131\u015f\u0131", "Mod Vanilla jest niedost\u0119pny", "De Vanilla-mod is offline", "O mod Vanilla est\u00e1 offline", "Mod Vanilla offline", "Vanilla MOD\u306f\u30aa\u30d5\u30e9\u30a4\u30f3\u3067\u3059", "Il mod Vanilla \u00e8 offline"]
};
/* i18n:texts-end */
var lmxLang = (function () {
    var n = 0;
    try { n = parseInt(localStorage.getItem('languagemod'), 10) || 0; } catch (e) { }
    if (n >= 1 && n <= 16) return n;
    var codes = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl', 'pt', 'id', 'ja', 'it'];
    var two = String(navigator.language || '').slice(0, 2).toLowerCase();
    /* older Android WebViews report Indonesian with the old code "in" */
    var i = codes.indexOf(two === 'in' ? 'id' : two);
    return i >= 0 ? i + 1 : 1;
})();
/* the text of key in the chosen language (English when it has none); {0} {1} take vars[0] vars[1] */
function lmxText(key, vars) {
    var row = LMX_US_TEXTS[key];
    var text = row ? (row[lmxLang - 1] || row[0]) : key;
    return vars == null ? text : text.replace(/\{(\d+)\}/g, function (m, i) { return vars[i] != null ? String(vars[i]) : m; });
}
function setLoadingText(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (lmxLang === 6) el.dir = 'rtl';
}
setLoadingText('lmx-loading-text', lmxText('boot.loading'));

/* ---- environment: GM_* (Tampermonkey, Violentmonkey), GM.* (Greasemonkey 4, Safari managers) ---- */
var hasGM = typeof GM !== 'undefined' && GM;
var gmInfo = typeof GM_info !== 'undefined' ? GM_info : (hasGM && GM.info) || { script: { version: '1.9' } };
var gmXhr = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest
    : hasGM && typeof GM.xmlHttpRequest === 'function' ? function (o) { return GM.xmlHttpRequest(o); } : null;
var modVersion = String((gmInfo.script && gmInfo.script.version) || '1.9');
var requestTimeoutMs = 30000;
/* The /neo and /mobile add-on scripts run this long after the Legend page is written */
var extraScriptDelayMs = 5000;
/* the manager's own storage (not agar.io's localStorage, which Legend Mod exports with the settings);
 * synchronous in Tampermonkey and Violentmonkey, a promise in Greasemonkey 4; else localStorage */
var store = {
    get: function (key, cb) {
        try { if (typeof GM_getValue === 'function') { cb(GM_getValue(key, null)); return; } } catch (e) { }
        try { if (hasGM && typeof GM.getValue === 'function') { GM.getValue(key, null).then(cb, function () { cb(null); }); return; } } catch (e) { }
        var v = null;
        try { v = JSON.parse(localStorage.getItem('lmx-' + key) || 'null'); } catch (e) { }
        cb(v);
    },
    set: function (key, value) {
        try { if (typeof GM_setValue === 'function') { GM_setValue(key, value); return; } } catch (e) { }
        try { if (hasGM && typeof GM.setValue === 'function') { GM.setValue(key, value).then(null, function () { }); return; } } catch (e) { }
        try { localStorage.setItem('lmx-' + key, JSON.stringify(value)); } catch (e) { }
    },
    remove: function (key) {
        try { if (typeof GM_deleteValue === 'function') { GM_deleteValue(key); return; } } catch (e) { }
        try { if (hasGM && typeof GM.deleteValue === 'function') { GM.deleteValue(key).then(null, function () { }); return; } } catch (e) { }
        try { localStorage.removeItem('lmx-' + key); } catch (e) { }
    }
};

/* ---- diagnostics ---- */
var diag = {
    loader: LOADER, version: modVersion, manager: String(gmInfo.scriptHandler || '') + (gmInfo.version ? ' ' + gmInfo.version : ''),
    mode: modeName || '/', timing: timing, startMs: Math.round(startedAt), takeoverMs: Math.round(tookOverAt - startedAt),
    states: [], source: '', release: '', conflict: ''
};
var state = '';
function go(next, info) {
    state = next;
    var t = 0;
    try { t = performance.now(); } catch (e) { }
    diag.states.push([next, Math.round(t - startedAt)]);
    if (info) diag.info = String(info);
    try { sessionStorage.setItem('lmx-boot', JSON.stringify(diag)); } catch (e) { }
}
go('ROUTING');
go('TAKEOVER');

/* ---- recovery: a takeover after agar.io had started cannot stop its already running code (game socket,
 * timers, worker). One reload fixes it when the manager was only slow this time (the first page after the
 * browser started). Guarded per tab for a minute: never a loop. Where a reload did not help, the next
 * visits for 3 days do not reload; the Legend page then cancels agar.io's leftover timers and frames. ---- */
var RECOVER_KEY = 'lmx-recover', NO_RELOAD_KEY = 'lmx-late-noreload', NO_RELOAD_MS = 3 * 24 * 3600 * 1000;
function recentRecovery(kind) {
    try {
        var r = JSON.parse(sessionStorage.getItem(RECOVER_KEY) || 'null');
        return !!r && r.kind === kind && Date.now() - r.t < 60000;
    } catch (e) { return false; }
}
/* the reload is guarded with sessionStorage: without it (blocked storage) there is no reload at all */
function guardedReload(kind, url) {
    try {
        sessionStorage.setItem(RECOVER_KEY, JSON.stringify({ kind: kind, t: Date.now() }));
        if (!recentRecovery(kind)) return false;
    } catch (e) { return false; }
    go('RECOVERY', kind);
    if (url && url !== location.href) location.replace(url); else location.reload();
    return true;
}
/* the link agar.io was opened with: a late start comes after agar.io's own code, which may have
 * changed the address (its path or query) */
function launchUrl() {
    if (startedLate) {
        try {
            var nav = performance.getEntriesByType('navigation')[0];
            var navUrl = nav && String(nav.name || '');
            if (navUrl.indexOf(location.origin + '/') === 0 && navUrl.split('#')[0] !== location.href.split('#')[0]) {
                return navUrl.indexOf('#') < 0 ? navUrl + location.hash : navUrl;
            }
        } catch (e) { }
    }
    return location.href;
}
var cancelLeftovers = false;
if (startedLate) {
    var noReload = false;
    try { noReload = Date.now() - (+localStorage.getItem(NO_RELOAD_KEY) || 0) < NO_RELOAD_MS; } catch (e) { }
    if (recentRecovery('late')) {
        /* reloaded a moment ago and still late: reloading does not help in this browser */
        try { localStorage.setItem(NO_RELOAD_KEY, String(Date.now())); } catch (e) { }
        noReload = true;
    }
    if (!noReload) {
        setLoadingText('lmx-loading-note', lmxText('lmx.us.restartOnce'));
        if (guardedReload('late', launchUrl())) return;
    }
    diag.conflict = 'late-start';
    cancelLeftovers = true;
    console.warn('[LMexpress] agar.io had started before Legend Express: its running code cannot be stopped without a reload');
} else if (recentRecovery('late')) {
    /* the reload helped: a later late start in this tab gets its own reload */
    diag.conflict = 'late-start-reloaded';
    try { sessionStorage.removeItem(RECOVER_KEY); localStorage.removeItem(NO_RELOAD_KEY); } catch (e) { }
}

var menu = typeof GM_registerMenuCommand === 'function' ? GM_registerMenuCommand : null;
if (menu) {
    try {
        menu(lmxText('lmx.ext.website'), function () {
            window.open('https://jimboy3100.github.io');
        }, 'w');
        menu(lmxText('lmx.ext.library'), function () {
            window.open('https://github.com/jimboy3100/jimboy3100.github.io/');
        }, 'l');
        menu(lmxText('lmx.us.donate'), function () {
            window.open('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CM3GDVCW6PBF6');
        }, 'd');
    } catch (e) { }
}

/*
 * LMexpress.js reads the launch link (?sip=, ?pass=, ?replay=...) from localStorage "url".
 * Save it on every visit that loads the Legend page. It used to be saved on agar.io/ only,
 * so a later visit to agar.io/legendmod re-applied the previous link's server or replay.
 */
if (mode.legend) {
    try {
        localStorage.setItem('url', launchUrl());
    } catch (e) {
        console.error('[LMexpress] Could not save the launch link', e);
    }
    /* per tab too: "url" is shared by every agar.io tab, so two tabs loading at once took each other's link */
    try { sessionStorage.setItem('lm-launch-url', JSON.stringify({ o: timeOrigin, url: launchUrl() })); } catch (e) { }
}

/* the release cache (below) */
var CACHE_KEY = 'release-' + pageVersion, CACHE_FORMAT = 1;
var FRESH_WAIT_MS = 400, CACHE_MAX_MS = 3 * 24 * 3600 * 1000;

go('LOADING');
if (mode.notice) {
    showLoaderPage(lmxText(mode.notice.title), lmxText(mode.notice.text, [mode.notice.host]), mode.notice.link, mode.notice.linkText && lmxText(mode.notice.linkText));
    go('READY');
} else if (mode.legend) {
    loadLegendPage();
} else if (mode.page) {
    loadPage(mode.page);
} else {
    runUserscript(mode.script, true);
}

/* ---- release cache: the last play.html, checked on every visit. A fresh copy that answers within
 * FRESH_WAIT_MS is used (a new release at once); a slower one is saved for the next visit while the saved
 * copy runs. A saved copy that is damaged (its checksum), older than CACHE_MAX_MS or not a Legend page is
 * not used; one that does not start the mod (no init) is dropped and the page loaded once more. ---- */
/* FNV-1a checksum of a text */
function checksum(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h;
}
function isLegendHtml(html) {
    return typeof html === 'string' && html.length > 1000 && html.indexOf('/LMexpress/LMexpress.js') >= 0 && /<\/html>/i.test(html);
}
function makeRelease(html) {
    if (!isLegendHtml(html)) return null;
    var v = /\?v=(\d+(?:\.\d+)*)/.exec(html);
    return { format: CACHE_FORMAT, page: legendPage, release: v ? v[1] : '', length: html.length, sum: checksum(html), time: Date.now(), html: html };
}
function usableRelease(r) {
    return !!r && typeof r === 'object' && r.format === CACHE_FORMAT && r.page === legendPage && isLegendHtml(r.html) &&
        r.html.length === r.length && checksum(r.html) === r.sum;
}

function loadLegendPage() {
    store.get(CACHE_KEY, function (saved) {
        var cached = usableRelease(saved) ? saved : null;
        if (saved && !cached) {
            diag.conflict = diag.conflict || 'cache-damaged';
            store.remove(CACHE_KEY);
        }
        var recent = cached && Date.now() - cached.time < CACHE_MAX_MS;
        var written = false;
        var write = function (html, source, release) {
            if (written) return;
            written = true;
            clearTimeout(wait);
            diag.source = source;
            diag.release = release ? release.release : '';
            writeLegendPage(html, source);
        };
        var wait = recent ? setTimeout(function () { write(cached.html, 'cache', cached); }, FRESH_WAIT_MS) : null;
        var tries = 0;
        var fetchFresh = function () {
            tries++;
            fetchText(legendPage, true, function (html) {
                var fresh = makeRelease(html);
                if (fresh && (!cached || fresh.sum !== cached.sum || Date.now() - cached.time > 3600000)) store.set(CACHE_KEY, fresh);
                /* not a Legend page (a portal or error page): the saved release, when there is one */
                if (!fresh && cached) { write(cached.html, 'cache', cached); return; }
                write(html, 'network', fresh);
            }, function (problem, err, retry) {
                if (written) return;
                if (cached) { write(cached.html, recent ? 'cache' : 'stale', cached); return; }
                if (retry && tries < 2) { setTimeout(fetchFresh, 1500); return; }
                console.error('[LMexpress] Could not load page ' + legendPage + ' (' + problem + ')', err || '');
                showLoadError(legendPage, problem);
            });
        };
        fetchFresh();
    });
}

/* ---- loader + lifecycle: the Legend page written over agar.io, then init(<version>) once ---- */
function writeLegendPage(html, source) {
    go('INITIALIZING', source);
    var page = addInitCall(html);
    if (cancelLeftovers) page = addLeftoverCancel(page);
    var settled = false;
    writePage(page, function (started) {
        if (settled) return;
        settled = true;
        if (started) { go('READY'); return; }
        /* a saved page that does not start the mod: drop it and load the page once more from the server */
        if (source !== 'network') {
            store.remove(CACHE_KEY);
            if (!recentRecovery('cache') && guardedReload('cache', location.href)) return;
        }
        go('FAILED', 'init missing');
    });
    if (mode.extra) {
        setTimeout(function () {
            runUserscript(mode.extra, false);
        }, extraScriptDelayMs);
    }
}

/* Write a page over agar.io. onStart (Legend page only) hears the init call's signal: true when init ran,
 * false when it was missing. document.open() drops every listener of the document, so they are added after it. */
function writePage(html, onStart) {
    document.open();
    if (onStart) {
        document.addEventListener('lmx-init-ok', function () { onStart(true); });
        document.addEventListener('lmx-init-missing', function () { onStart(false); });
    }
    document.write(html);
    document.close();
    claimOwner();
}

/* Htmlscript: fetch an HTML page and write it over agar.io */
function loadPage(pageUrl) {
    fetchText(pageUrl, false, function (html) {
        go('INITIALIZING');
        writePage(html);
        go('READY');
    }, function (problem, err) {
        console.error('[LMexpress] Could not load page ' + pageUrl + ' (' + problem + ')', err || '');
        showLoadError(pageUrl, problem);
    });
}

/*
 * Userscript: fetch a userscript and run it with this loader's GM_info and GM_xmlhttpRequest.
 * replacesPage: the script is the whole mode (an empty page, as before), so a failed download gets the error page.
 */
function runUserscript(scriptUrl, replacesPage) {
    fetchText(scriptUrl, false, function (code) {
        if (replacesPage) {
            go('INITIALIZING');
            try { document.documentElement.innerHTML = ''; } catch (e) { }
        }
        try {
            new Function('GM_info', 'GM_xmlhttpRequest', code)(gmInfo, gmXhr);
        } catch (err) {
            console.error('[LMexpress] Error running userscript from ' + scriptUrl, err);
        }
        if (replacesPage) go('READY');
    }, function (problem, err) {
        console.error('[LMexpress] Not running userscript from ' + scriptUrl + ' (' + problem + ')', err || '');
        if (replacesPage) {
            showLoadError(scriptUrl, problem);
        }
    });
}

/* Add the mod's init(<version>) call at the end of the Legend page's body, after its own scripts, with its
 * readiness signal for the loader (a DOM event: the loader runs in the manager's world, not the page's) */
function addInitCall(html) {
    /* JSON quoting, with "<" escaped so the version text can never close the script tag */
    var version = JSON.stringify(modVersion).replace(/</g, '\\u003c');
    var call = '<script>' +
        'if (typeof init === "function") { try { init(' + version + '); } finally { document.dispatchEvent(new Event("lmx-init-ok")); } }' +
        ' else { console.error("[LMexpress] init() is missing: LMexpress.js did not load"); document.dispatchEvent(new Event("lmx-init-missing")); }' +
        '</script>';
    var bodyEnd = html.toLowerCase().lastIndexOf('</body>');
    if (bodyEnd === -1) {
        return html + call;
    }
    return html.slice(0, bodyEnd) + call + html.slice(bodyEnd);
}

/* A late start where reloading does not help: agar.io's timers and animation frames, still running in the
 * page, are cancelled before the Legend page's first script (the ids before it are all agar.io's).
 * The timer and frame functions themselves stay untouched for Legend Mod. */
function addLeftoverCancel(html) {
    var code = '<script>(function () { try { var i, t = setTimeout(function () { }, 0);' +
        ' for (i = Math.max(1, t - 50000); i <= t; i++) clearTimeout(i);' +
        ' var f = requestAnimationFrame(function () { });' +
        ' for (i = Math.max(1, f - 50000); i <= f; i++) cancelAnimationFrame(i); } catch (e) { } })();</script>'; /* i18n-ok: code */
    var head = /<head[^>]*>/i.exec(html);
    if (!head) return html;
    var at = head.index + head[0].length;
    return html.slice(0, at) + code + html.slice(at);
}

/* ---- transport ---- */
function isHttps(url) {
    return /^https:\/\//i.test(String(url || ''));
}

/* Returns why a response is not usable, or '' if it is. An error page (404/5xx) or a redirect away from https is not the code we asked for. */
function responseProblem(res) {
    if (!res || !(res.status >= 200 && res.status < 300)) {
        return lmxText('lmx.us.status', [res ? res.status : '-']);
    }
    if (res.finalUrl && !isHttps(res.finalUrl)) {
        return lmxText('lmx.us.redirected', [res.finalUrl]);
    }
    return '';
}

/* GET a URL over https and hand its text to onText, or a reason to onFail(problem, err, retry).
 * retry: a network error, a time-out or a server error (5xx), worth one more try.
 * fresh: asks the server whether the copy in the browser's cache is still current. */
function fetchText(url, fresh, onText, onFail) {
    var done = false;
    var ok = function (text) { if (!done) { done = true; onText(text); } };
    var fail = function (problem, err, retry) { if (!done) { done = true; onFail(problem, err, !!retry); } };
    /* Never fetch code that is not served over https */
    if (!isHttps(url)) {
        fail(lmxText('lmx.us.notHttps'));
        return;
    }
    if (gmXhr) {
        try {
            gmXhr({
                method: 'GET',
                url: url,
                timeout: requestTimeoutMs,
                nocache: !!fresh,
                revalidate: !!fresh,
                onload: function (res) {
                    var problem = responseProblem(res);
                    if (problem) {
                        fail(problem, null, res && res.status >= 500);
                        return;
                    }
                    ok(res.responseText);
                },
                onerror: function (err) {
                    fail(lmxText('lmx.us.network'), err, true);
                },
                ontimeout: function () {
                    fail(lmxText('lmx.us.timeout', [requestTimeoutMs / 1000]), null, true);
                }
            });
            return;
        } catch (e) { }
    }
    /* a manager without GM_xmlhttpRequest: the Legend Mod servers allow cross-origin reads */
    if (typeof fetch !== 'function') {
        fail(lmxText('lmx.us.network'));
        return;
    }
    var abort = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () {
        if (abort) abort.abort();
        fail(lmxText('lmx.us.timeout', [requestTimeoutMs / 1000]), null, true);
    }, requestTimeoutMs);
    fetch(url, { cache: fresh ? 'no-cache' : 'default', credentials: 'omit', signal: abort ? abort.signal : undefined }).then(function (res) {
        var problem = responseProblem({ status: res.status, finalUrl: res.url });
        if (problem) {
            clearTimeout(timer);
            fail(problem, null, res.status >= 500);
            return;
        }
        return res.text().then(function (text) { clearTimeout(timer); ok(text); });
    }).then(null, function (err) {
        clearTimeout(timer);
        fail(lmxText('lmx.us.network'), err, true);
    });
}

/* Shown instead of a blank white page (agar.io's page is already gone). */
function showLoaderPage(title, text, linkUrl, linkText) {
    var page = '<!doctype html><html' + (lmxLang === 6 ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><title>Legend Mod</title></head>' +
        '<body style="margin:0;background:#00243e;color:#fff;font:16px Ubuntu,Arial,sans-serif;text-align:center;padding-top:20vh">' +
        '<h2 style="margin:0 0 12px">' + escapeHtml(title) + '</h2><div style="opacity:.8">' + escapeHtml(text) + '</div><br>' +
        (linkUrl ? '<a style="color:#ffd200" href="' + escapeHtml(linkUrl) + '" target="_blank" rel="noopener">' + escapeHtml(linkText || linkUrl) + '</a> &nbsp;&middot;&nbsp; ' : '') +
        '<a style="color:#ffd200" href="https://agar.io/legendmod">' + escapeHtml(lmxText('lmx.us.playLegend')) + '</a> &nbsp;&middot;&nbsp; ' +
        '<a style="color:#ffd200" href="https://agar.io/normal">' + escapeHtml(lmxText('lmx.us.playNoMods')) + '</a>' +
        '</body></html>';
    writePage(page);
}

/* agar.io's page is already gone, so say what failed instead of leaving a blank tab */
function showLoadError(url, problem) {
    go('FAILED', problem);
    var page = '<!DOCTYPE html><html' + (lmxLang === 6 ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><title>Legend Express</title></head>' +
        '<body style="background:#111;color:#eee;font:16px sans-serif;padding:40px;">' +
        '<h2 id="lmx-error">' + escapeHtml(lmxText('lmx.us.couldNotLoad')) + '</h2>' +
        '<p>' + escapeHtml(url) + ' (' + escapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + escapeHtml(location.href) + '">' + escapeHtml(lmxText('lmx.ext.tryAgain')) + '</a>' +
        ' &middot; <a style="color:#6cf;" href="https://agar.io/normal">' + escapeHtml(lmxText('lmx.us.playVanilla')) + '</a></p>' +
        '</body></html>';
    writePage(page);
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}
})();
