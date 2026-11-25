$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
$('body').append(
    '<div class="modal fade in" id="legendchars" aria-hidden="false" style="display:block;">' +
    '<div class="modal-backdrop fade in"></div>' +
    '<div class="modal-dialog" style="width:462px;">' +
    '<div class="modal-content">' +

    '<div class="modal-header">' +
    '<button type="button" class="close" onclick="closecustomskinsIframe(); return false;" data-i18n-title="misc.close" data-i18n-aria-label="misc.close"><span aria-hidden="true">&#10005;</span></button>' +
    '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif" data-i18n="misc.helper.nickChars">' +
    /* from the language packs (developers/i18n/src/misc.json); data-i18n follows a language change */
    String(window.lmT ? window.lmT('misc.helper.nickChars') : 'misc.helper.nickChars').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</h4>' +
    '</div>' +

    '<div style="padding:10px;">' +
    '<iframe id="customskinsIframe2" src="https://jimboy3100.github.io/nicks/" height="490" width="420" style="border:0;max-width:100%;display:block;"></iframe>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>'
);

if (window.LMi18n) window.LMi18n.apply(document.getElementById('legendchars'));
if (typeof lmPromoChrome === 'function') lmPromoChrome('#legendchars');

function closecustomskinsIframe(){
    $("#legendchars").remove();
    $("#main-menu").show();
    $("#skins-panel").show();
    $("#quick-menu").show();
    $("#exp-bar").show();
}
