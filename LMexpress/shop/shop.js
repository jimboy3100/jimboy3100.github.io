//v0.13c

	if (!window.agarioUID){
		 window.agarioUID = localStorage.getItem("agarioUID");
	}

	window.tempModeratorSkin=""
		if ($("#nick").val().includes('℄')){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendHeroes" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsLegendclan.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="LegendClan" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsLegendclan2.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="AbsolutVodka" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsAbsolutVodka.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Chemistry" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsChemistry.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Japan" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsJapan.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Japan2" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsJapan2.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Kebab" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsKebab.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Meditation" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsMeditation.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Splash" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSplash.png"></div>'	
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="PanicAtDisco" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsPanicAtDisco.png"></div>'			
	}		
	if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]){		
		//localStorage.setItem("ProLicenceUsersreason", ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason);
		if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Moderator"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Moderator" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsModerator.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Ddev" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsDdev.png"></div>'
		}
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="RedArrow" data-original="https://jimboy3100.github.io/banners/drawCommander5.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="WhiteArrow" data-original="https://jimboy3100.github.io/banners/drawCommander5.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="BabyBoss" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsBabyBoss.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Gladiator" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsGladiator.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero1" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero1.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero2" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero2.png"></div>'	
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Key" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsKey.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="MetalOfHonor" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsMetalOfHonor.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="PeaceMaker" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsPeaceMaker.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Survivor" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSurvivor.png"></div>'
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Tiger" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsTiger.png"></div>'						
		}
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Hano"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="BabyBoss" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsBabyBoss.png"></div>'
		}			
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Junky"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Survivor" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSurvivor.png"></div>'
		}		
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Hilde"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="PeaceMaker" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsPeaceMaker.png"></div>'
		}		
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Dabous"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Tiger" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsTiger.png"></div>'
		}				
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Shiro"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Shiro" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsShiro.png"></div>'
		}	
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "WinnerPrizeAccountAge"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero1" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero1.png"></div>'			
		}	
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "WinnerPrizeQuestsCompleted"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Key" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsKey.png"></div>'
		}			
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "WinnerPrizeLongestTimeAlive"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero.png"></div>'
		}	
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "WinnerPrizeMassDisputeOverPrizes"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="Hero2" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHero2.png"></div>'
		}
		else if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "WinnerPrizeMassConsumedMassCellsEaten"){
			window.tempModeratorSkin += '<div class="skin-box"><img class="lazy" name="MetalOfHonor" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsMetalOfHonor.png"></div>'
		}		
	}	
	window.tempAnimatedCool=""
	if (animatedskins){
		Object.keys(animatedskins).forEach(function(key) {	
			if (animatedskins[key] && animatedskins[key].id && animatedskins[key].frames[0] && animatedskins[key].frames[0].id){
				if (animatedskins[key].id=="Only_For_Shiro" || animatedskins[key].id=="Only_For_Shiro_1" || animatedskins[key].id=="Only_For_Shiro_2"){
					if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID] && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Shiro"){
						window.tempAnimatedCool += '<div class="skin-box"><img class="lazy" name="' + animatedskins[key].id + '" data-original="https://i.imgur.com/' + animatedskins[key].frames[0].id + '.png"></div>'	
					}					 
				}	
				else if (animatedskins[key].id=="Just_Watch_Pro"){
					if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID] && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor"){
						window.tempAnimatedCool += '<div class="skin-box"><img class="lazy" name="' + animatedskins[key].id + '" data-original="https://i.imgur.com/' + animatedskins[key].frames[0].id + '.png"></div>'
					}					
				}				
				else{
					window.tempAnimatedCool += '<div class="skin-box"><img class="lazy" name="' + animatedskins[key].id + '" data-original="https://i.imgur.com/' + animatedskins[key].frames[0].id + '.png"></div>'
					window.tempAnimatedCoolArray.push(key)
				}
			}
		});
	}
	window.freeSkinCelebrationDays=""
	if (window.celebrationDay=="LcDay"){
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="LegendHeroes" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsLegendclan.png"></div>'		
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="LegendClan" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsLegendclan2.png"></div>'
	}
	else if (window.celebrationDay=="NewYear"){
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="HappyNewYear" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHappyNewYear.png"></div>'		
	}
	else if (window.celebrationDay=="ThanksGiving"){
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="ThanksGivings" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsThanksGivings.png"></div>'		
	}
	else if (window.celebrationDay=="Christmas"){
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="ChristmasTree" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsChristmasTree.png"></div>'		
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="SantaHat" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSantaHat.png"></div>'			
	}	
	else if (window.celebrationDay=="4July"){
		window.freeSkinCelebrationDays += '<div class="skin-box"><img class="lazy" name="Flag4July" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsUSAFlag4July.png"></div>'		
	}		
		
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://jimboy3100.github.io/css/specialeffects.css">' +
				'<script src="https://jimboy3100.github.io/skins/jquery.lazyload.min.js"></script>' +
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
		'<div class="skin-box"><img class="lazy" name="Hat" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHat3.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="JellyFish" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsJellyFish.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="King" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsCrown.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Smoke" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSmoke.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="USA" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsUSA.png"></div>' +	
        '<div class="skin-box"><img class="lazy" name="Sword" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSword.png"></div>' +
        '<div class="skin-box"><img class="lazy" name="Mask" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsMask.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Heart" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsHeart.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Vip" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsVip.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Youtube" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsYoutube.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="SunGlasses" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsSunGlasses.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Bird" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsBird.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Butterfly" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsButterfly.png"></div>' +
	    '<div class="skin-box"><img class="lazy" name="Mouse" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsMouse.png"></div>' +
		'<div class="skin-box"><img class="lazy" name="Turtle" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsTurtle.png"></div>' +		
		'<div class="skin-box"><img class="lazy" name="Coffee" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsCoffee.png"></div>' +
		window.tempModeratorSkin +
   '</div>' +
	        '<div id="lowres" class="skins-wrapper">' +
			//'<div class="skin-box"><img class="lazy" name="Byzantium" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsByzantium.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Close" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsClose.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Earth" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsEarth.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="FootStep" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsFootStep.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forward" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsForward.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsFriendsForever.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever2" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsFriendsForever2.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Forever3" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsFriendsForever3.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Police" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsPolice.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Police2" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsPolice2.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Unrest" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsUnrest.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Eagle" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsEagle.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="BobMarley" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsBobMarley.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="Einstein" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsEinstein.png"></div>' +
			'<div class="skin-box"><img class="lazy" name="DeadTable" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsDeadTable.png"></div>' +						
	'</div>' +
	        '<div id="animatedLikeGif" class="skins-wrapper">' +
			window.tempAnimatedCool	+			
	'</div>' +	
	        '<div id="free" class="skins-wrapper">' +
			'<div class="skin-box"><img class="lazy" name="Byzantium" data-original="https://jimboy3100.github.io/banners/iconSpecialSkinEffectsByzantium.png"></div>' +	
			window.freeSkinCelebrationDays +		
	'</div>' +	
        '<div id="vanillaskins" class="skins-wrapper">' +
	'</div>' +
	'</div>' +    
    '<script src="https://jimboy3100.github.io/LMexpress/shop/shopscript.js"></script>' +				
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
				window.open('https://jimboy3100.github.io/', '_blank');
            });	
//$(".modal-dialog").draggable()
