//v0.13c


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
		
            $('#LMShop').remove();
            $('.modal-backdrop').remove();
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://jimboy3100.github.io/css/specialeffects.css">' +
				'<script src="https://jimboy3100.github.io/skins/jquery.lazyload.min.js"></script>' +
				'<style>' +
				'#LMShop #navbar { position: relative !important; width: 100% !important; height: auto !important; top: auto !important; left: auto !important; right: auto !important; margin: 0 !important; padding: 8px 12px !important; background: #f1f3f5 !important; border-bottom: 1px solid #dee2e6 !important; z-index: 1052 !important; }' +
				'#LMShop #nav ul { margin: 0 !important; padding: 0 !important; float: none !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 6px !important; }' +
				'#LMShop #nav ul li { float: none !important; margin: 0 !important; list-style: none !important; }' +
				'#LMShop #nav a { display: inline-block !important; margin-top: 0 !important; padding: 5px 12px !important; font-size: 13px !important; border-radius: 6px !important; font-weight: 600 !important; text-decoration: none !important; }' +
				'#LMShop #skin-url { margin-top: 0 !important; height: 30px !important; font-size: 12px !important; padding: 4px 8px !important; width: 140px !important; border-radius: 6px !important; }' +
				'#LMShop .modal-header { padding: 12px 16px !important; background: #1a1d24 !important; color: #fff !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; position: relative !important; z-index: 1060 !important; }' +
				'#LMShop .modal-header .close { opacity: 0.85 !important; color: #fff !important; font-size: 22px !important; margin-left: 8px !important; float: right !important; cursor: pointer !important; position: relative !important; z-index: 1061 !important; background: transparent !important; border: none !important; outline: none !important; }' +
				'#LMShop .modal-header .close:hover { opacity: 1 !important; color: #ff5252 !important; }' +
				'</style>' +
				'<div class="modal-backdrop fade in" style="z-index: 1040;"></div>' +
				'<div class="modal-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 900px; max-height: 85vh; margin: 0; z-index: 1050;">' +
                '<div class="modal-content" style="background: #fff; color: #333; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; position: relative; z-index: 1051; max-height: 85vh; display: flex; flex-direction: column;">' +
                '<div id="CloseLMShop2" class="modal-header">' +
                '<button id="CloseLMShop" type="button" class="close" data-dismiss="modal" title="Close" onclick="jQuery(\'#LMShop\').remove(); jQuery(\'.modal-backdrop\').remove(); jQuery(\'body\').removeClass(\'modal-open\');"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '<button id="FAQLMShop" type="button" class="close" title="Help" onclick="window.open(\'https://jimboy3100.github.io/LMexpress/olddeals.html\', \'_blank\');"><span aria-hidden="true">&#x2753;</span><span class="sr-only">Help</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif; color: #4fc3f7; font-weight: 700; margin: 0;"><i class="fa fa-shopping-cart"></i> Shop</h4>' +
                '</div>' +
				
				'<div id="LMShop3" style="overflow-y: auto; max-height: 70vh;">' +
				
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
            $("#CloseLMShop").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
                $("#LMShop").remove();
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
            });
            $("#FAQLMShop").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
                window.open('https://jimboy3100.github.io/LMexpress/olddeals.html', '_blank');
            });	
//$(".modal-dialog").draggable()
