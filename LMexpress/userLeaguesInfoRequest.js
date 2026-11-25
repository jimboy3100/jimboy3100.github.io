//v0.01
/* Texts from the language packs (developers/i18n/src/lmx.json, lmx.lg.*); the window is built again
 * every time it opens, so it always shows the current language. */
function _lmlgT(k, v) { return window.lmT ? window.lmT(k, v) : String(k); }
function _lmlgE(k, v) { return String(_lmlgT(k, v)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
if (window.agarioEncodedUID != null) {
	userLeaguesInfoRequest();
}
else{
	toastr["warning"]('<b>[' + _lmlgE('pack.server') + ']: </b>' + _lmlgE('lmx.lg.playFirst'));
}

function userLeaguesInfoResponse(){
var temphtml= ""
for (var i=1;i<window.RecordPlayers.length;i++){
	//console.log(i)
	if (window.RecordPlayers[i].country){
		window.RecordPlayers[i].country = window.RecordPlayers[i].country.toLowerCase()
	}
	else{
		window.RecordPlayers[i].country = "UN"
	}
	if (!window.RecordPlayers[i].icon.includes('https://platform-lookaside.fbsbx.com/')) window.RecordPlayers[i].icon = 'https://jimboy3100.github.io/banners/profilepic_guest.png'
	
	temphtml = temphtml + '<br> [' + i + '] UID: ' + window.RecordPlayers[i].uid + ' ID: ' + window.RecordPlayers[i].id + ' ' + _lmlgE('lmx.lg.skin') + ' ' + window.RecordPlayers[i].level + ' ' + _lmlgE('lmx.lg.country') + ' ' +
	'<span data-toggle="popover" data-placement="left" title="" data-content="data-html=" true="" class= "country-icon flag-icon flag-icon-' + window.RecordPlayers[i].country + '" data-original-title="' + _lmlgE('lmx.lg.playerDetails') + '"></span>' + 
	'SID: ' + window.RecordPlayers[i].socialid + ' <img src=' + window.RecordPlayers[i].icon + ' style="width: 40px; height:40px;">'
	
}
	
            $('#UserLeaguesInfoModal').remove();
            $('.modal-backdrop').remove();
            $('#helloContainer').after('<div class="modal fade in" id="UserLeaguesInfoModal" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://jimboy3100.github.io/css/specialeffects.css">' +
				'<div class="modal-backdrop fade in" style="z-index: 1040;"></div>' +
				'<div class="modal-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1000px; max-height: 85vh; margin: 0; z-index: 1050;">' +
                '<div class="modal-content" style="background: #fff; color: #333; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; position: relative; z-index: 1051; max-height: 85vh; display: flex; flex-direction: column;">' +
                '<div id="CloseUserLeaguesInfo2" class="modal-header"><button id="CloseUserLeaguesInfo" type="button" class="close" data-dismiss="modal" title="' + _lmlgE('close') + '"><span aria-hidden="true">×</span><span class="sr-only">' + _lmlgE('pack.close2') + '</span></button> <button id="FAQUserLeaguesInfo" type="button" class="close" title="' + _lmlgE('help') + '"><span aria-hidden="true">?</span><span class="sr-only">' + _lmlgE('help') + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + _lmlgE('lmx.lg.title') + '</h4>' +
                '</div>' +
				
				'<div id="UserLeaguesInfo3" style="overflow-y: auto; max-height: 70vh;">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active">' + _lmlgE('lmx.lg.myLeague') + '</a></li>' +
				'<li><a href="#lowres">' + _lmlgE('lmx.lg.countryTab') + '</a></li>' +
				'<li><a href="#vanillaskins">' + _lmlgE('lmx.lg.world') + '</a></li>' +			  		
		    '</ul>' +
        '</div>' +
    '</div>' +

    '<div id="imgur" style="width: 990px; height: 500px; overflow: scroll">' +
		temphtml +
   '</div>' +
	        '<div id="lowres" class="skins-wrapper">' +
	'</div>' +
        '<div id="vanillaskins" class="skins-wrapper">' +
	'</div>' +
	'</div>' +				
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');

            $("#CloseUserLeaguesInfo").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
                $("#UserLeaguesInfoModal").remove();
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
            });
            $("#FAQUserLeaguesInfo").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
				window.open(typeof lmThemeUrl === 'function' ? lmThemeUrl('https://www.legendmod.ml/') : 'https://www.legendmod.ml/', '_blank');
            });	
}
