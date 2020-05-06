            $('#helloContainer').after('<div class="modal fade in" id="LMShop" aria-hidden="false" style="display: block;">' +
				'<link rel="stylesheet" type="text/css" href="https://legendmod.ml/css/specialeffects.css">' +
				'<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 820px; height:500">' +
                '<div class="modal-content">' +
                '<div id="CloseLMShop2" class="modal-header"><button id="CloseLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMShop" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Legend mod Shop' + '</h4>' +
                '</div>' +
				
				'<div id="LMShop3">' +
				
        '<div id="customskins">' +
    '<div id="navbar">' +
        '<div id="nav">' +
            '<ul>' +
				
                '<li><a href="#imgur" class="active">Imgur</a></li>' +
				'<li><a href="#lowres">Low Res-More FPS</a></li>' +
				'<li><a href="#vanillaskins">Vanilla</a></li>' +			  		
                '<li><input type="text" id="skin-url" placeholder="Skin URL" readonly></li>' +
		'<li><a id="UseEffect" class="link">Use</a></li>' +
		    '</ul>' +
        '</div>' +
    '</div>' +

    '<div id="imgur" class="skins-wrapper">' +
		'<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/kdma64U.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/UUDXxK2.jpg"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/z7aRxuH.png"></div>' +
		'<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/SaiTVGU.png"></div>' +
		'<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/zs2dxC4.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/stb0xll.jpg"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/mHxchM9.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/hJSyWRi.png"></div>' +
		'<div class="skin-box"><img class="lazy" data-original="https://i.imgur.com/mOlOOBi.jpg"></div>' +

   '</div>' +
	        '<div id="lowres" class="skins-wrapper">' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/1up-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/ace-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/adamzonetopmarks-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/agariomods.com-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/agar-youtube-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/alaska-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/albania-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/alexelcapo-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/android-custom-skin.png"></div>' +
	        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/lowresskins/anonymous-custom-skin.png"></div>' +

	'</div>' +
        '<div id="vanillaskins" class="skins-wrapper">' +
        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/vanillaskins/Alien2_Gamma.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/vanillaskins/Alien2_Neila.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/vanillaskins/Alien2_Omicron.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/vanillaskins/Alien2_Smyg.png"></div>' +
        '<div class="skin-box"><img class="lazy" data-original="https://legendmod.ml/vanillaskins/Alien2_Vega.png"></div>' +

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
