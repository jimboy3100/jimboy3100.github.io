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
    '<button type="button" class="close" onclick="closecustomskinsIframe(); return false;"><span aria-hidden="true">&#10005;</span></button>' +
    '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">Nickname Characters</h4>' +
    '</div>' +

    '<div style="padding:10px;">' +
    /* the theme goes in the link too, so the page is themed even before the theme message arrives */
    '<iframe id="customskinsIframe2" src="https://www.legendmod.ml/nicks/' + (typeof lmThemeHash === 'function' ? lmThemeHash() : '') + '" height="490" width="420" style="border:0;max-width:100%;display:block;"></iframe>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>'
);

if (typeof lmPromoChrome === 'function') lmPromoChrome('#legendchars');

function closecustomskinsIframe(){
    $("#legendchars").remove();
    $("#main-menu").show();
    $("#skins-panel").show();
    $("#quick-menu").show();
    $("#exp-bar").show();
}
