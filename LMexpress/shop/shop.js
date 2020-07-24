//v0.8
	window.tempModeratorSkin=""
		if ($("#nick").val().includes('℄')){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendHeroes" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsLegendclan.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendClan" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsLegendclan2.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="AbsolutVodka" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsAbsolutVodka.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Chemistry" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsChemistry.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Japan" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsJapan.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Japan2" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsJapan2.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Kebab" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsKebab.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Meditation" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsMeditation.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Splash" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsSplash.png"></div>'		
	}		
	if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]){
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Moderator"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Moderator" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsModerator.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Ddev" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsDdev.png"></div>'
		}
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="RedArrow" data-original="https://legendmod.ml/banners/drawCommander5.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="WhiteArrow" data-original="https://legendmod.ml/banners/drawCommander5.png"></div>'
		}
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Shiro"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Shiro" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsShiro.png"></div>'
		}				
	}	
	window.tempAnimatedCool=""
	if (animatedskins){
		Object.keys(animatedskins).forEach(function(key) {	
			if (animatedskins[key] && animatedskins[key].id && animatedskins[key].frames[0] && animatedskins[key].frames[0].id)
			window.tempAnimatedCool += '<div class="skin-box"><img class="lazy" name="' + animatedskins[key].id + '" data-original="https://i.imgur.com/' + animatedskins[key].frames[0].id + '.png"></div>'
			window.tempAnimatedCoolArray.push(key)
		});
	}
		
		
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://legendmod.ml/css/specialeffects.css">' +
				'<div class="modal-backdrop fade in"></div>' +
                //'<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 780px; height:500">' +
				'<div class="modal-dialog" style="top: calc(50vh - 400px); width: 900px; height:500px">' +
                '<div class="modal-content">' +
                '<div id="CloseLMShop2" class="modal-header"><button id="CloseLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Shop' + '</h4>' +
                '</div>' +
				
				'<div id="LMShop3">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active">Premium</a></li>' +
				'<li><a href="#lowres">WaterMarks</a></li>' +
				'<li><a href="#animatedLikeGif">Animated-Free</a></li>' +
				'<li><a href="#free">Free</a></li>' +						
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
	    '<div class="skin-box"><img class="lazy" name="SunGlasses" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsSunGlasses.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Bird" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsBird.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Butterfly" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsButterfly.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Mouse" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsMouse.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Turtle" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsTurtle.png"></div>' +
		window.tempModeratorSkin +
   '</div>' +
	        '<div id="lowres" class="skins-wrapper">' +
			//'<div class="skin-box"><img class="lazy" name="Byzantium" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsByzantium.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Close" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsClose.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Earth" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsEarth.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="FootStep" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsFootStep.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forward" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsForward.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsFriendsForever.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever2" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsFriendsForever2.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever3" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsFriendsForever3.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Police" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsPolice.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Police2" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsPolice2.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Unrest" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsUnrest.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Eagle" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsEagle.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="BobMarley" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsBobMarley.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Einstein" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsEinstein.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="DeadTable" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsDeadTable.png"></div>' +						
	'</div>' +
	        '<div id="animatedLikeGif" class="skins-wrapper">' +
			window.tempAnimatedCool	+			
	'</div>' +	
	        '<div id="free" class="skins-wrapper">' +
			'<div class="skin-box"><img class="lazy" name="Byzantium" data-original="https://legendmod.ml/banners/iconSpecialSkinEffectsByzantium.png"></div>' +			
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
			$("#animatedLikeGif").children().css("width", "55px");	
			$("#animatedLikeGif").css("padding-right", "100px");
            $("#CloseLMShop").click(function() {
                $("#LMShop").remove();
            });
            $("#FAQLMShop").click(function() {
				window.open('https://legendmod.ml/', '_blank');
            });	
$(".modal-dialog").draggable()
