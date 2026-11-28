//v1.0
/* Texts from the language packs (developers/i18n/src: pack.* are the old Externalletter texts,
 * misc.* this window's own), escaped for the HTML below. data-i18n marks let a language change
 * update the window while it is open. */
function _lmHT(key, vars) {
    var s = window.lmT ? window.lmT(key, vars) : key;
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function _lmHTx(key) { return '<span data-i18n="' + key + '">' + _lmHT(key) + '</span>'; }
/* the Information page with the menu theme in its URL (see lmThemeUrl in LMexpress.js) */
function _lmHelperSrc() {
    var u = 'https://www.legendmod.ml/extras/helper.html';
    return typeof lmThemeUrl === 'function' ? lmThemeUrl(u) : u;
}

/* the menu panels that were shown come back on close (ogario.v4.js lmMenuPanelsHide) */
if (typeof lmMenuPanelsHide === 'function') lmMenuPanelsHide();
else $("#main-menu, #skins-panel, #quick-menu, #exp-bar").hide();
$('body').append(
    '<div class="modal fade in" id="legendhelper" aria-hidden="false" style="display:block;">' +
    '<div class="modal-backdrop fade in"></div>' +
    '<div class="modal-dialog" style="width:942px;">' +
    '<div class="modal-content">' +

									
    '<div class="modal-header">' +
    '<button type="button" class="close" onclick="return closeLegendHelper(event);"><span aria-hidden="true">&#10005;</span></button>' +
    '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + _lmHTx('pack.modInfoTemplates') + '</h4>' +
    '</div>' +

    '<div id="Userscriptshud2" style="padding:10px;">' +
    '<div id="Userscriptshud3">' +
    '<iframe id="customskinsIframe2" src="' + _lmHelperSrc() + '" width="920" height="490" style="border:0;max-width:100%;display:block;"></iframe>' +
    '</div>' +
    '</div>' +

    '<div class="modal-footer" style="text-align:left;border-top:1px solid rgba(255,255,255,.1);">' +
    '<button type="button" id="LegendHelperBacktomenu" onclick="return closeLegendHelper(event);" class="btn btn-danger">' + _lmHTx('misc.close') + '</button>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>'
);

if (typeof lmPromoChrome === 'function') { try { lmPromoChrome('#legendhelper'); } catch(e) {} }

function closeLegendHelper(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();

        if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
        }
    }

    $("#legendhelper")
        .stop(true, true)
        .remove();

    $("#main-menu, #skins-panel, #quick-menu, #exp-bar").stop(true, true);
    if (typeof lmMenuPanelsRestore === 'function') lmMenuPanelsRestore();
    else $("#main-menu, #skins-panel, #quick-menu, #exp-bar").show();

    return false;
}
function openbleedmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/extras/BleedingMod.js";
    s.src = "https://www.legendmod.ml/extras/bleedmod.js";
    $("body").append(s);
}

function openrotatingmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/extras/rotating500images.js";
    $("body").append(s);
}


