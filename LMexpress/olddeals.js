 //OLD DEALS
 
 //for agarioUID, agarioID, look at the case 102: on this file https://jimboy3100.github.io/ogario/ogario.v4.js?v=32
 
 /* you will need this
	var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackEnglish.js";
        $("body").append(s);
*/


//		$("#OpenuserScripts").after('<button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" onclick="BeforeSpecialDeals(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>Special Deals</button>');		

if (window.agarioUID != null) {
	localStorage.setItem("agarioUID", window.agarioUID);
	localStorage.setItem("agarioID", window.agarioID);
}
else{
	window.agarioUID=localStorage.getItem("agarioUID");
	window.agarioID=localStorage.getItem("agarioID");	
}	
		function SpecialDeals(){
	GameConfiguration={};
		$.ajax({
        type: "GET",
        url: "https://configs-web.agario.miniclippt.com/live/v12/2168/GameConfiguration.json",
        datatype: "json",
        success: function(info) {
        return GameConfiguration=info;
			}
		});		
if (window.agarioUID != null) {
	
        $('#helloContainer').after('<div class="modal fade in" id="specialShopModal" aria-hidden="false" style="display: block;">' +
            '<div class="modal-backdrop fade in"></div>' +
            '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' +
            '<div class="modal-content">' +
            '<div id="CloseSpecialDeals" class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
            '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">Special deals</h4>' +
            '</div>' +
            '<div class="modal-body"><input type="email" class="form-control" id="agario_uid_input" placeholder="*UID (' + Premadeletter110 + ')" style="width: 85%; display: inline-block">' +
            '<div class="custom-checkbox" style="display: inline-block; margin-left: 10px; vertical-align: sub;"><input id="checkBoxLockUID" type="checkbox" disabled="disabled" style="width: 20px; height: 20px"><label for="cb1"></label></div>' +
            '<div class="bs-callout bs-callout-buy bs-callout-clickable" id="buy_starterpack">' +
            '<h4 id="dealtype" class="pull-left">purchase 125000 coins</h4><h5 class="pull-left"> <i> (' + Premadeletter111 + ')</i></h5>' +
            '<h4 id="dealcost" class="text-right">99.99 $</h4>' +
            '<div class="xpmt-buy-content" style="font-size: 13px; margin-top: -30px; float: left;font-weight: 700; background-color: rgba(0, 0, 0, 0.2); background-image: url(https://jimboy3100.github.io/banners/icondeal2.png);padding: 3px; align: middle; border-radius: 4px;width: 100%;height: 150px;z-index: 15;margin: auto;">' +
            '<div class="xpmt-money-stack" style="display: inline-block; margin-left: 70px; margin-top: 115px;"><span class="coins" style=""><b>125000 C</b></span></div>' +
            '<div class="xpmt-skins" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: -120px 310px; background-image: url(""); background-size: cover; border-color: #7c0001"></div>' +
            '</div>' +
            '</div><select id="ss-select-purchases" class="form-control" required="" style="margin-bottom: 30px"></select><select id="BuyDealCurrency" class="form-control" required="" style="display:inline; width: 40%; margin-top: -30px;"><option value="USD" data-itr="">USD</option><option value="EU" data-itr="">EU</option></select><color="red"> ' + Premadeletter112 + '</color>' +
            '<p class="alert-warning text-center">' + Premadeletter116 + '<br>UID:<span class="alert-success" id="exp-uid"> ' + window.agarioUID + '</span> <font color="red" onclick=copy(window.agarioUID);><b><u>'+Premadeletter114+' UID</u></b></font><br>ID: ' + window.agarioID + ' .*UID ' + Premadeletter115 + '</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');	
}
setTimeout(function() { populateSD();}, 1500);
        $("#CloseSpecialDeals").click(function() {
            
            $("#specialShopModal").remove();
        });
        $(".xpmt-buy-content").click(function() {
			toastr["warning"]('<div id="tutorial" style="background-image: url(https://jimboy3100.github.io/banners/v25toastricon.jpg); color:#018cf6; font-size:16px; text-align:center">' + Premadeletter90 +' v0.5<br>' + 'This is a BETA function, it may not work and you may loose your money' + '<br><font color="red">' + Premadeletter91a + '</font>' + '</br> <button class="btn btn-sm btn-primary" style="width: 100%; margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">'+ Premadeletter25 + '</button></div>', "", { timeOut: 20000, extendedTimeOut: 20000 }).css("width", "300px");	
			$(".btn.btn-sm.btn-primary").click(function () { buydeals(); });	
 /*           if (ProLicenceUsersTable.ProLicenceUsers[MC.getUserId()] != undefined) {
                console.log("Authorised User");
                buydeals();
            } else {
                console.log("Non Authorised User");
                var containsnickname = $("#nick").val();
                if (~containsnickname.indexOf("℄") || ~containsnickname.indexOf("ΕΛ")) {
                    toastr["info"]("If you are Lc or EA player, contact Skype Id: Jimboy3100 and refer your <font color='red'><b>UID</b></font color='red'>", "", {
                        timeOut: 10000,
                        extendedTimeOut: 10000
                    }).css("width", "300px");
                } else {
                    toastr["info"]("This Function is enabled to those who donated 6$ to author, contact Skype Id: Jimboy3100 and refer your <font color='red'><b>UID</b></font color='red'>", "", {
                        timeOut: 10000,
                        extendedTimeOut: 10000
                    }).css("width", "300px");
                }
            } */
        });
        $('#agario_uid_input').blur(function() {
            if (letterCount($('#agario_uid_input').val(), '-', true) == 4) {
                document.getElementById("checkBoxLockUID").checked = true;
                toastr["info"](Premadeletter92).css("width", "250px");
                $("#exp-uid").text($('#agario_uid_input').val());
            } else {
                document.getElementById("checkBoxLockUID").checked = false;
                toastr["info"](Premadeletter93).css("width", "210px");	
                $("#exp-uid").text(window.agarioUID);
            }
        });		
        $('#ss-select-purchases').on('change', function() {
            console.log(this.value);
			findSDescription();
            $(".xpmt-skins2").remove();
            $(".xpmt-money-stack").text($("#ss-select-purchases option:selected").text().substr(0, $("#ss-select-purchases option:selected").text().indexOf('_')) + " C");
            $("#dealcost").text($("#ss-select-purchases option:selected").text().split('=').pop());

            var textcropped1 = $("#ss-select-purchases option:selected").text().split('1_skin_').pop();
            textcropped1 = textcropped1.substr(0, textcropped1.indexOf(' ')).replace(' ', '');
            textcropped1 = textcropped1.charAt(0).toUpperCase() + textcropped1.slice(1);
            $(".xpmt-skins").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/v12/2168/' + textcropped1 + '.png")');
            setTimeout(function() {
                if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal7") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Blueberry_Face.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal15") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Hot_Dog.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal17") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Comet.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal18") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Comet.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal21") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Jar_Brain.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal22") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Jar_Brain.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal25") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Laika.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal26") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Laika.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal27") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/pig.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal36") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/UFO.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal41") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/zombie.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal42") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/zombie.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal52") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Tiger_Pattern.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal53") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/toon.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal54") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/toon.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.starterpack3") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/pig.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.starterpack4") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Blueberry_Face.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.starterpack6") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Tomato_Face.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.starterpack7") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Comet.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.boosterpromo3") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/monthly_web_husky.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack1") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_wendigo.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack2") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_red_fiend.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack3") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_wendigo.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_red_fiend.png); background-size: cover; border-color: #7c0001"></div>');
                    $(".xpmt-money-stack").text("1800 DNA");
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack4") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/anime_skull_bow.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack5") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/anime_skull_bow.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack7") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/anime_power_ninja.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack10") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_wendigo.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_night_hunter.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack11") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_war_mask.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_skull_samurai.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack12") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/birthday_2017_2_rabid.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/birthday_2017_2_delighted.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack13") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/pet_balls_elephant.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack14") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_war_mask.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack15") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_rogue_samurai.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack16") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_war_mask.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/samurai_rogue_samurai.png); background-size: cover; border-color: #7c0001"></div>');
                    $(".xpmt-money-stack").text("1800 DNA");
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.zodiacpromo") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/zodiac_2017_skin_scorpio.png ")');
                    $(".xpmt-money-stack").text("800 DNA");
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.zodiacpromoweb") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/zodiac_2017_skin_scorpio.png ")');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.collector2") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/birthday_sir.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/ChilliPepper.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.collector4") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/Rooster.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/birthday_doge.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack17") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/anime_skull_bow.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/anime_giant_human.png); background-size: cover; border-color: #7c0001"></div>');
                    $(".xpmt-money-stack").text("1800 DNA");
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.promotionpack18") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/anime_skull_bow.png ")');
                    $('.xpmt-skins').after('<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(https://configs-web.agario.miniclippt.com/live/v12/2168/anime_giant_human.png); background-size: cover; border-color: #7c0001"></div>');
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.potionpromo3") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_wendigo.png ")');
                    $(".xpmt-money-stack").text("16000 C+ 1800 DNA");
                } else if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.potionpromo6") {
                    $(".xpmt-skins").css('background-image', 'url(" https://configs-web.agario.miniclippt.com/live/v12/2168/moonlight_wendigo.png ")');
                    $(".xpmt-money-stack").text("7000 C+ 800 DNA");
                }
            }, 500);
        });	
}
//EU OR USD
function buydeals(){
   $.ajax({
        type: "GET",
        url: "https://payments.agario.miniclippt.com/pay/"+$("#exp-uid").text()+"/"+$( "#ss-select-purchases option:selected" ).val()+"/"+$("#BuyDealCurrency").val(),
        datatype: "json",
        success: function(info) {
        return buytoken=info.iframe_url;
			}
		});
setTimeout(function() {		
	window.open(buytoken, "PopupWindow", "width=600,height=600,scrollbars=yes,resizable=no");
}, 3000);
}

            function populateSD(){
			var select = document.getElementById("ss-select-purchases");
                for(i=0;i<GameConfiguration.gameConfig["Wallet - In-App Purchases"].length;i++){
                    if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="2"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 1.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}
                    else if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="5"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 4.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}
                    else if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="10"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 9.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}						
                    else if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="20"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 19.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}
                    else if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="50"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 49.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}
                    else if(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier=="60"){
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId+" = 99.99 $", GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}					
                    else {
                    select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id, GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
					}					
				}

            }

            function findSDescription(){
			var findSDiconlocationString2=$("#ss-select-purchases option:selected").text().split('=').pop();
			findSDiconlocationString2=$("#ss-select-purchases option:selected").text().replace(findSDiconlocationString2, '');
			findSDiconlocationString2=findSDiconlocationString2.replace(' =', '');	
			var select = document.getElementById("ss-select-purchases");
                for(i=0;i<GameConfiguration.gameConfig["Visual - Bundles"].length;i++){
					
                    if(GameConfiguration.gameConfig["Visual - Bundles"][i].bundleId==findSDiconlocationString2){
						console.log("bundleId found");
						var findSDicondescriptionString=GameConfiguration.gameConfig["Visual - Bundles"][i].description;
						if (typeof findSDicondescriptionString === 'string' || findSDicondescriptionString instanceof String){
							// it's a string
							
							console.log(findSDicondescriptionString);
							if(findSDicondescriptionString!="na"){		
								findSDicondescriptionString=findSDicondescriptionString.replace('_',' ');	
								findSDicondescriptionString=findSDicondescriptionString.replace('_',' ');
								findSDicondescriptionString=findSDicondescriptionString.replace('_',' ');
								findSDicondescriptionString=findSDicondescriptionString.replace('_',' ');
								findSDicondescriptionString=findSDicondescriptionString.replace('_',' ');
								findSDicondescriptionString=findSDicondescriptionString.replace(' name','');
								$("#dealtype").text(findSDicondescriptionString);
							}
							else{
								console.log("no description");
								var findSDicondescriptionString=$('#ss-select-purchases').val();
								findSDicondescriptionString = findSDicondescriptionString.replace('com.miniclip.agar.io.','');
								findSDicondescriptionString = findSDicondescriptionString.charAt(0).toUpperCase() + findSDicondescriptionString.slice(1);
								$("#dealtype").text(findSDicondescriptionString);
							}
						}
						else{
						console.log("description is not a String");
						$("#dealtype").text("Unknown");
						}	
					}
				}
			}			
function letterCount(string, letter, caseSensitive) {
    var count = 0;
    if ( !caseSensitive) {
        string = string.toUpperCase();
        letter = letter.toUpperCase();
    }
    for (var i=0, l=string.length; i<string.length; i += 1) {
        if (string[i] === letter) {
            count += 1;
        }
    }
    return count;
}

//not used
function PremiumUsers(){
        var ProLicenceUsersTableJS = document.createElement("script");
        ProLicenceUsersTableJS.type = "text/javascript";
        ProLicenceUsersTableJS.src = "https://jimboy3100.github.io/AjaxData/ProLicenceUsersTableJS.js";
        $("body").append(ProLicenceUsersTableJS);
}		
