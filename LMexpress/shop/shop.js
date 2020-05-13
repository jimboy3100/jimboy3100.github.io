	window.tempModeratorSkin=""
	if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]){
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Moderator"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Moderator" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsModerator.png"></div>'
		}
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="RedArrow" data-original="https://legendmod.ml/banners/drawCommander5.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="WhiteArrow" data-original="https://legendmod.ml/banners/drawCommander5.png"></div>'
		}
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor" || ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Shiro"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Shiro" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsShiro.png"></div>'
		}		
		if ($("#nick").val().includes('℄') || ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Admin"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendHeroes" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsLegendclan.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendClan" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsLegendclan2.png"></div>'
		}			
	}
		
		
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://legendmod.ml/css/specialeffects.css">' +
				'<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 780px; height:500">' +
                '<div class="modal-content">' +
                '<div id="CloseLMShop2" class="modal-header"><button id="CloseLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Legend mod Shop' + '</h4>' +
                '</div>' +
				
				'<div id="LMShop3">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active">Premium</a></li>' +
				'<li><a href="#lowres">Free</a></li>' +
				'<li><a href="#vanillaskins">In Use</a></li>' +			  		
                '<li><input type="text" id="skin-url" placeholder="Special Skin Effect" readonly></li>' +
		'<li><a id="UseEffect" class="link">Use</a></li>' +
		'<li><a id="UseEffect2" class="link">Stop</a></li>' +
		    '</ul>' +
        '</div>' +
    '</div>' +

    '<div id="imgur" class="skins-wrapper">' +
		'<div class="skin-box"><img class="lazy" name="Hat" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsHat3.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="JellyFish" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsJellyFish.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="King" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsCrown.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Smoke" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsSmoke.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="USA" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsUSA.png"></div>' +	
        '<div class="skin-box"><img class="lazy" name="Sword" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsSword.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="Mask" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsMask.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Heart" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsHeart.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Vip" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsVip.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Youtube" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsYoutube.png"></div>' +
		window.tempModeratorSkin +
   '</div>' +
	        '<div id="lowres" class="skins-wrapper">' +
	'</div>' +
        '<div id="vanillaskins" class="skins-wrapper">' +
	'</div>' +
	'</div>' +
    '<script src="https://legendmod.ml/skins/jquery.lazyload.min.js"></script>' +
    '<script src="https://legendmod.ml/LMexpress/shop/shopscript.js"></script>' +				
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
