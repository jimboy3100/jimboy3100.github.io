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
	if (typeof ProLicenceUsersTable !== "undefined" && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]){		
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
					if (typeof ProLicenceUsersTable !== "undefined" && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID] && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "Shiro"){
						window.tempAnimatedCool += '<div class="skin-box"><img class="lazy" name="' + animatedskins[key].id + '" data-original="https://i.imgur.com/' + animatedskins[key].frames[0].id + '.png"></div>'	
					}					 
				}	
				else if (animatedskins[key].id=="Just_Watch_Pro"){
					if (typeof ProLicenceUsersTable !== "undefined" && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID] && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason == "LMauthor"){
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
		
            /* shopscript.js reads this to tell its own window from a newer one */
            window._lmShopOpenId = (window._lmShopOpenId || 0) + 1;
            /* the old window's lazyload scroll/resize handlers on window (see shopscript.js) */
            if (window._lmShopUnbindLazy) window._lmShopUnbindLazy();
            $('#LMShop').remove();
            $('.modal-backdrop').remove();
            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://jimboy3100.github.io/css/specialeffects.css">' +
				/* the lazyload plugin stays on jQuery after the window is closed: load it once */
				(window.jQuery && jQuery.fn.lazyload ? '' : '<script src="https://jimboy3100.github.io/skins/jquery.lazyload.min.js"></script>') +
				'<style>' +
				/* the shop follows the user theme (--lm-* colours) and has the standard Legend window header */
				'#LMShop .modal-content { background: var(--lm-pc,#00243e) !important; color: var(--lm-tc,#fff) !important; border: 1px solid var(--lm-pc2,#002f52) !important; border-top: 3px solid var(--lm-mc,#01d9cc) !important; border-radius: var(--lm-radius,6px) !important; box-shadow: 0 8px 32px rgba(0,0,0,.5) !important; }' +
				'#LMShop .modal-header { min-height: 0 !important; padding: 10px 52px 8px !important; text-align: center !important; background: linear-gradient(180deg, var(--lm-pc2,#002f52) 0%, var(--lm-pc,#00243e) 100%) !important; color: var(--lm-tc,#fff) !important; border-bottom: 1px solid var(--lm-pc2,#002f52) !important; position: relative !important; z-index: 1060 !important; }' +
				'#LMShop .modal-title { color: var(--lm-mc,#01d9cc) !important; font-size: 16px !important; font-weight: 700 !important; letter-spacing: 1px !important; text-transform: uppercase !important; line-height: 1.4 !important; margin: 0 !important; }' +
				'#LMShop .modal-header .close { position: absolute !important; top: 6px !important; right: 10px !important; float: none !important; margin: 0 !important; padding: 0 !important; min-width: 28px !important; min-height: 28px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: var(--lm-radius-s,4px) !important; background: rgba(255,255,255,.05) !important; color: var(--lm-tc2,#8096a7) !important; opacity: 1 !important; text-shadow: none !important; font-size: 18px !important; line-height: 1 !important; cursor: pointer !important; border: none !important; outline: none !important; z-index: 1061 !important; }' +
				'#LMShop .modal-header .close + .close { right: auto !important; left: 10px !important; font-size: 14px !important; }' +
				'#LMShop .modal-header .close:hover { color: var(--lm-tc,#fff) !important; background: rgba(255,255,255,.12) !important; }' +
				'#LMShop #navbar { position: relative !important; width: 100% !important; height: auto !important; top: auto !important; left: auto !important; right: auto !important; margin: 0 !important; padding: 8px 12px !important; background: rgba(0,0,0,.2) !important; border-bottom: 1px solid var(--lm-pc2,#002f52) !important; z-index: 1052 !important; }' +
				'#LMShop #nav ul { margin: 0 !important; padding: 0 !important; float: none !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 6px !important; }' +
				'#LMShop #nav ul li { float: none !important; margin: 0 !important; list-style: none !important; }' +
				'#LMShop #nav a { display: inline-block !important; margin-top: 0 !important; padding: 5px 12px !important; font-size: 13px !important; border-radius: var(--lm-radius-s,4px) !important; font-weight: 700 !important; text-decoration: none !important; cursor: pointer !important; color: var(--lm-tc2,#8096a7) !important; border: 1px solid var(--lm-pc2,#002f52) !important; background: rgba(255,255,255,.05) !important; }' +
				'#LMShop #nav a:hover { color: var(--lm-mc,#01d9cc) !important; border-color: var(--lm-mc,#01d9cc) !important; }' +
				'#LMShop #nav a.active { color: var(--lm-btn-tc,var(--lm-btc,#fff)) !important; background: var(--lm-btn1,var(--lm-b1,#018cf6)) !important; border-color: var(--lm-btn1,var(--lm-b1,#018cf6)) !important; }' +
				'#LMShop #nav #UseEffect { color: var(--lm-btn-tc,var(--lm-btc,#fff)) !important; background: var(--lm-btn2,var(--lm-b2,#00b9e8)) !important; border-color: var(--lm-btn2,var(--lm-b2,#00b9e8)) !important; }' +
				'#LMShop #nav #UseEffect2 { color: var(--lm-btn-tc,var(--lm-btc,#fff)) !important; background: var(--lm-btn4,var(--lm-b4,#bf00aa)) !important; border-color: var(--lm-btn4,var(--lm-b4,#bf00aa)) !important; }' +
				'#LMShop #nav #UseEffect:hover, #LMShop #nav #UseEffect2:hover { filter: brightness(1.12); }' +
				'#LMShop #skin-url { margin-top: 0 !important; height: 30px !important; font-size: 12px !important; padding: 4px 8px !important; width: 140px !important; border-radius: var(--lm-radius-s,4px) !important; background: rgba(0,0,0,.25) !important; color: var(--lm-tc,#fff) !important; border: 1px solid var(--lm-pc2,#002f52) !important; }' +
				'#LMShop #skin-url::placeholder { color: var(--lm-tc2,#8096a7) !important; }' +
				'#LMShop #customskins .skin-box img { background: rgba(255,255,255,.06); }' +
				'#LMShop #LMShop3::-webkit-scrollbar { width: 8px; } #LMShop #LMShop3::-webkit-scrollbar-thumb { background: var(--lm-pc2,#002f52); border-radius: var(--lm-radius-s,4px); }' +
				'</style>' +
				'<div class="modal-backdrop fade in" style="z-index: 1040;"></div>' +
				'<div class="modal-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 900px; max-height: 85vh; margin: 0; z-index: 1050;">' +
                '<div class="modal-content" style="overflow: hidden; position: relative; z-index: 1051; max-height: 85vh; display: flex; flex-direction: column;">' +
                '<div id="CloseLMShop2" class="modal-header">' +
                '<button id="CloseLMShop" type="button" class="close" data-dismiss="modal" title="Close" data-i18n-title="shop.close" onclick="jQuery(\'#LMShop\').remove(); jQuery(\'.modal-backdrop\').remove(); jQuery(\'body\').removeClass(\'modal-open\');"><span aria-hidden="true">&times;</span><span class="sr-only" data-i18n="shop.close">Close</span></button>' +
                '<button id="FAQLMShop" type="button" class="close" title="Help" data-i18n-title="shop.help"><span aria-hidden="true">&#x2753;</span><span class="sr-only" data-i18n="shop.help">Help</span></button>' +
                '<h4 class="modal-title"><i class="fa fa-shopping-cart"></i> <span data-i18n="shop.title">Shop</span></h4>' +
                '</div>' +
				
				'<div id="LMShop3" style="overflow-y: auto; max-height: 70vh;">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active" data-i18n="shop.premium">Premium</a></li>' +
				'<li><a href="#lowres" data-i18n="shop.watermarks">WaterMarks</a></li>' +
				'<li><a href="#animatedLikeGif" data-i18n="shop.animatedFree">Animated-Free</a></li>' +
				'<li><a href="#free" data-i18n="shop.free">Free</a></li>' +
				'<li><a href="#vanillaskins" data-i18n="shop.inUse">In Use</a></li>' +
                '<li><input type="text" id="skin-url" placeholder="Special Skin Effect" data-i18n-placeholder="shop.effect" readonly></li>' +
		'<li><a id="UseEffect" class="link" data-i18n="shop.use">Use</a></li>' +
		'<li><a id="UseEffect2" class="link" data-i18n="shop.stop">Stop</a></li>' +
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
			if (window.LMi18n) window.LMi18n.apply(document.getElementById("LMShop"));
			$("#animatedLikeGif").children().css("width", "55px");	
			$("#animatedLikeGif").css("padding-right", "100px");
            $("#CloseLMShop").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
                if (window._lmShopUnbindLazy) window._lmShopUnbindLazy();
                $("#LMShop").remove();
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
            });
            $("#FAQLMShop").off('click').on('click', function(e) {
                if (e) e.stopPropagation();
                /* one handler only (an inline onclick opened the page a second time); the page gets the theme */
                var _lmDeals = 'https://www.legendmod.ml/LMexpress/olddeals.html';
                window.open(typeof lmThemeUrl === 'function' ? lmThemeUrl(_lmDeals) : _lmDeals, '_blank');
            });	
//$(".modal-dialog").draggable()
