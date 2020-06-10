//v0.01
if (window.agarioEncodedUID != null) {
	userLeaguesInfoRequest();
}
else{
	toastr["warning"]('<b>[SERVER]: </b>Please play the game before you can use that feature');
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
	if (!window.RecordPlayers[i].icon.includes('https://platform-lookaside.fbsbx.com/')) window.RecordPlayers[i].icon = 'https://legendmod.ml/banners/profilepic_guest.png'
	
	temphtml = temphtml + '<br> [' + i + '] UID: ' + window.RecordPlayers[i].uid + ' ID: ' + window.RecordPlayers[i].id + ' SKIN: ' + window.RecordPlayers[i].level + ' COUNTRY: ' +
	'<span data-toggle="popover" data-placement="left" title="" data-content="data-html=" true="" class= "country-icon flag-icon flag-icon-' + window.RecordPlayers[i].country + '" data-original-title="Player Details"></span>' + 
	'SID: ' + window.RecordPlayers[i].socialid + ' <img src=' + window.RecordPlayers[i].icon + ' style="width: 40px; height:40px;">'
	
}
	
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://legendmod.ml/css/specialeffects.css">' +
				'<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 1000px; height:500px;">' +
                '<div class="modal-content">' +
                '<div id="CloseLMShop2" class="modal-header"><button id="CloseLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'User Leagues Info' + '</h4>' +
                '</div>' +
				
				'<div id="LMShop3">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active">My League</a></li>' +
				'<li><a href="#lowres">Country</a></li>' +
				'<li><a href="#vanillaskins">World</a></li>' +			  		
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

            $("#CloseLMShop").click(function() {
                $("#LMShop").remove();
            });
            $("#FAQLMShop").click(function() {
				window.open('https://legendmod.ml/', '_blank');
            });	
}
