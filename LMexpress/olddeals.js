//OLD DEALS
//v2.23
//for agarioUID, agarioID, look at the case 102: on this file https://jimboy3100.github.io/ogario/ogario.v4.js?v=32

/* you will need this
	var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackEnglish.js";
        $("body").append(s);



//		$("#OpenuserScripts").after('<button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" onclick="BeforeSpecialDeals(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>' + Languageletter351 + '</button>');		

if (window.agarioUID != undefined) {
	localStorage.setItem("agarioUID", window.agarioUID);
	localStorage.setItem("agarioID", window.agarioID);
}
else{
	window.agarioUID=localStorage.getItem("agarioUID");
	window.agarioID=localStorage.getItem("agarioID");	
}
*/
window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/v15/2230/GameConfiguration.json";
window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/v15/2230/";

if (window.agarversion != null) {
    window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json";
    window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion;
}

SpecialDeals();
AgarVersionDestinations();

function SpecialDeals() {

    if (window.agarioEncodedUID != null) {

       
        $('#helloContainer').after('<div class="modal fade in" id="specialShopModal" aria-hidden="false" style="display: block;">' + '<div class="modal-backdrop fade in"></div>' + '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' + '<div class="modal-content">' + '<div id="CloseSpecialDeals2" class="modal-header"><button id="CloseSpecialDeals" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQSpecialDeals" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' + '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + Languageletter351 + '</h4>' + '</div>' + //'<div class="modal-body"><input type="text" class="form-control" id="agario_uid_input" placeholder="*Encoded UID (' + Premadeletter110 + ')" style="width: 85%; display: inline-block">' +
        '<div class="modal-body"><input type="text" class="form-control" id="agario_uid_input" placeholder="Encoded UID" style="width: 85%; display: inline-block">' + '<div class="custom-checkbox" style="display: inline-block; margin-left: 10px; vertical-align: sub;"> Friend Encoded uid <input id="checkBoxLockUID" type="checkbox" disabled="disabled" style="width: 20px; height: 20px"><label for="cb1"></label></div>' + '<div class="bs-callout bs-callout-buy bs-callout-clickable" id="buy_starterpack">' + '<h4 id="dealtype" class="pull-left">purchase 125000 coins</h4><h5 class="pull-left"> <i> (' + Premadeletter111 + ')</i></h5>' + '<h4 id="dealcost" class="text-right">99.99 $</h4>' + '<div class="xpmt-buy-content" style="font-size: 13px; margin-top: -30px; float: left;font-weight: 700; background-color: rgba(0, 0, 0, 0.2); background-image: url(https://jimboy3100.github.io/banners/icondeal2.png);padding: 3px; align: middle; border-radius: 4px;width: 100%;height: 150px;z-index: 15;margin: auto;">' + '<div class="xpmt-money-stack" style="display: inline-block; margin-left: 70px; margin-top: 115px;"><span class="coins" style=""><b>125000 C</b></span></div>' + '<div class="xpmt-skins" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: -120px 310px; background-image: url(""); background-size: cover; border-color: #7c0001"></div>' + '<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(""); background-size: cover; border-color: #7c0001"></div>' + '</div>' + '</div><select id="ss-select-purchases" class="form-control" required="" style="margin-bottom: 30px"></select><select id="BuyDealCurrency" class="form-control" required="" style="display:inline-block; width: 20%; margin-top: -30px;"><option value="USD" data-itr="">USD</option><option value="EU" data-itr="">EU</option></select><color="red" style="display:inline"> ' + Premadeletter112 + '</color>' + '<select id="ss-select-agarVersionDestinations" class="form-control" required="" style="display:inline; width: 25%; margin-top: -30px;"></select><color="red" style="display:inline">' + Premadeletter117 + '</color>' +
        '<input type="text" class="form-control" id="GameConfigurationUrl" value = ' + window.MiniclipConfigDestination + ' placeholder="*Search any GameConfiguration.json destination" style="width: 95%; display: inline-block">' + '<p class="alert-warning text-center">' + Premadeletter116 + '<br>Encoded UID:<span class="alert-success" id="exp-uid" style="font-size: 2px;">' + window.agarioEncodedUID + '</span> <font color="red" onclick=copy(window.agarioEncodedUID);><b><u>' + Premadeletter114 + '</u></b></font>.<br>Encoded UID ' + Premadeletter115 + '</p>' + '</div>' + '</div>' + '</div>' + '</div>');
        $("#agario_uid_input").val(window.agarioEncodedUID);
		LoadGameConfiguration();
        
		//populateSD();
        $(".modal-dialog").draggable()		
		setTimeout(function() {
			populateLibConfig();
        }, 2500);

        $("#ss-select-agarVersionDestinations").change(function() {

            $("#GameConfigurationUrl").val("https://configs-web.agario.miniclippt.com/live/" + $("#ss-select-agarVersionDestinations").val() + "GameConfiguration.json");
            $("#GameConfigurationUrl").blur();
        });
        $("#GameConfigurationUrl").blur(function() {
            //toastr["warning"]('<b>[SERVER]:</b> Do not change this unless you know what it is');
            window.MiniclipConfigDestination = $("#GameConfigurationUrl").val();
            LoadGameConfiguration();
            //setTimeout(function() {
                //populateSD();
            //}, 1500);
        });
        $("#CloseSpecialDeals").click(function() {

            $("#specialShopModal").remove();
        });
        $("#FAQSpecialDeals").click(function() {
            window.open('https://jimboy3100.github.io/LMexpress/olddeals.html', '_blank');
        });
        $(".xpmt-buy-content").click(function() {
            toastr["warning"]('<div id="tutorial" style="background-image: url(https://jimboy3100.github.io/banners/v25toastricon.jpg); color:#018cf6; font-size:16px; text-align:center">' + Premadeletter90 + ' v0.5<br>' + 'This is a BETA function, it may not work and you may loose your money' + '<br><font color="red">' + Premadeletter91a + '</font>' + '</br> <button class="btn btn-sm btn-primary" style="width: 100%; margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button></div>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            $(".btn.btn-sm.btn-primary").click(function() {
                buydeals();
            });
        });
        $('#agario_uid_input').blur(function() {
            //if (letterCount($('#agario_uid_input').val(), '-', true) == 4) {
            if ($('#agario_uid_input').val().length > 50) {

                document.getElementById("checkBoxLockUID").checked = true;
                toastr["info"](Premadeletter92).css("width", "250px");
                $("#exp-uid").text($('#agario_uid_input').val());
            } else {
                document.getElementById("checkBoxLockUID").checked = false;
                toastr["info"](Premadeletter93).css("width", "210px");
                $("#exp-uid").text(window.agarioEncodedUID);
            }
        });
        $('#ss-select-purchases').on('change', function() {
            $(".xpmt-skins2").css('background-image', '');
            $(".xpmt-skins").css('background-image', '');
            console.log(this.value);
            findSDescription();
            //$(".xpmt-skins2").remove();
            if ($("#ss-select-purchases option:selected").text().includes('dna') && !$("#ss-select-purchases option:selected").text().includes('coins')) {
                $(".xpmt-money-stack").text($("#ss-select-purchases option:selected").text().substr(0, $("#ss-select-purchases option:selected").text().indexOf('_')) + " DNA");
            } else {
                $(".xpmt-money-stack").text($("#ss-select-purchases option:selected").text().substr(0, $("#ss-select-purchases option:selected").text().indexOf('_')) + " C");
            }
            $("#dealcost").text($("#ss-select-purchases option:selected").text().split('=').pop());

            var textcropped1 = $("#ss-select-purchases option:selected").text().split('1_skin_').pop();
            textcropped2 = $("#ss-select-purchases option:selected").text();
            if (textcropped2.split('1_skin_', 2)[1]) {
                textcropped2 = "skin_" + textcropped2.split('1_skin_', 2)[1].slice(0, -1);
            }
            textcropped1 = "skin_" + textcropped1.substr(0, textcropped1.indexOf(' ')).replace(' ', '');
            //textcropped1 = textcropped1.charAt(0).toUpperCase() + textcropped1.slice(1);
            textcropped1 = textcropped1.charAt(0) + textcropped1.slice(1);
            //if (textcropped1=="jade_dragon"){
            //textcropped1="Journey_JadeDragon";
            //}
            for (i = 0; i < GameConfiguration.gameConfig["Gameplay - Equippable Skins"].length; i++) {
                if (GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].productId == textcropped1) {
                    textcropped1 = GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].image;
                    //textcropped1 = textcropped1.substring(0, textcropped1.indexOf('.'));
                }
            }
            for (i = 0; i < GameConfiguration.gameConfig["Gameplay - Equippable Skins"].length; i++) {
                if (GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].productId == textcropped2) {
                    textcropped2 = GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].image;
                    //textcropped1 = textcropped1.substring(0, textcropped1.indexOf('.'));
                }
            }
            //$(".xpmt-skins").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/v15/2230/' + textcropped1 + '.png")');
            setTimeout(function() {
                /*
                 if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal7") {
                     $(".xpmt-skins").css('background-image', 'url(' + window.MiniclipDestination + 'Blueberry_Face.png ")');
                 } 
				 */
                $(".xpmt-skins").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/' + window.agarversion + textcropped2 + '")');
                $(".xpmt-skins2").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/' + window.agarversion + textcropped1 + '")');
            }, 500);
        });
    } else {
        toastr["warning"]('<b>[SERVER]: </b>Please play the game before you can use that feature');
    }
}

//EU OR USD
function buydeals() {
    $.ajax({
        type: "GET",
        url: "https://payments.agario.miniclippt.com/pay/" + $("#exp-uid").text() + "/" + $("#ss-select-purchases option:selected").val() + "/" + $("#BuyDealCurrency").val(),
        datatype: "json",
        success: function(info) {
            return buytoken = info.iframe_url;
        }
    });
    setTimeout(function() {
        window.open(buytoken, "PopupWindow", "width=600,height=600,scrollbars=yes,resizable=no");
    }, 3000);
}
function populateSDlines(select,i){
	    
        if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "2") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 1.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "5") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 4.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "10") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 9.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "20") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 19.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "50") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 49.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "60") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 99.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        }
    
}
function populateSD() {
    var agarVersionSelect = document.getElementById("ss-select-agarVersionDestinations");

    var select = document.getElementById("ss-select-purchases");
    if (agarVersionSelect.options && agarVersionSelect.options[0] && agarVersionSelect.value !== agarVersionSelect.options[0].value) {
        // Check if an option with the same text already exists
        
		for (var ik = 0; ik < GameConfiguration.gameConfig["Wallet - In-App Purchases"].length; ik++) {
			var optionExists = false;
			for (var j = 0; j < window.selectVariable.length; j++) { 
				if (window.selectVariable[j].value == GameConfiguration.gameConfig["Wallet - In-App Purchases"][ik].id) {
					optionExists = true;
				}
			}
			if (optionExists == false) {
				populateSDlines(select,ik);
			}
			//else console.log("no " + GameConfiguration.gameConfig["Wallet - In-App Purchases"][ik].bundleId)
			
		}
    }
	else{ //if selected value of #ss-select-agarVersionDestinations is the latest
	if (!window.selectVariable) window.selectVariable = select.options;
	for (var iq = 0; iq < GameConfiguration.gameConfig["Wallet - In-App Purchases"].length; iq++) {
		populateSDlines(select,iq);
	}
	}
	if ($('#ss-select-purchases').children().length==0)
		$('#ss-select-purchases').append('<option value="" selected>Nothing found that is not already on latest version</option>');
}

function findSDescription() {
    var findSDiconlocationString2 = $("#ss-select-purchases option:selected").text().split('=').pop();
    findSDiconlocationString2 = $("#ss-select-purchases option:selected").text().replace(findSDiconlocationString2, '');
    findSDiconlocationString2 = findSDiconlocationString2.replace(' =', '');
    var select = document.getElementById("ss-select-purchases");
    for (i = 0; i < GameConfiguration.gameConfig["Visual - Bundles"].length; i++) {

        if (GameConfiguration.gameConfig["Visual - Bundles"][i].bundleId == findSDiconlocationString2) {
            console.log("bundleId found");
            var findSDicondescriptionString = GameConfiguration.gameConfig["Visual - Bundles"][i].description;
            if (typeof findSDicondescriptionString === 'string' || findSDicondescriptionString instanceof String) {
                // it's a string

                console.log(findSDicondescriptionString);
                if (findSDicondescriptionString != "na") {
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace(' name', '');
                    $("#dealtype").text(findSDicondescriptionString);
                } else {
                    console.log("no description");
                    var findSDicondescriptionString = $('#ss-select-purchases').val();
                    findSDicondescriptionString = findSDicondescriptionString.replace('com.miniclip.agar.io.', '');
                    findSDicondescriptionString = findSDicondescriptionString.charAt(0).toUpperCase() + findSDicondescriptionString.slice(1);
                    $("#dealtype").text(findSDicondescriptionString);
                }
            } else {
                console.log("description is not a String");
                $("#dealtype").text("Unknown");
            }
        }
    }
}

function letterCount(string, letter, caseSensitive) {
    var count = 0;
    if (!caseSensitive) {
        string = string.toUpperCase();
        letter = letter.toUpperCase();
    }
    for (var i = 0, l = string.length; i < string.length; i += 1) {
        if (string[i] === letter) {
            count += 1;
        }
    }
    return count;
}

function LoadGameConfiguration() {
    for (var i = document.getElementById("ss-select-purchases").options.length; i-- > 0; ){
		document.getElementById("ss-select-purchases").options[i] = null;}
    $(".xpmt-skins2").css('background-image', '');
    $(".xpmt-skins").css('background-image', '');	
    GameConfiguration = {};
    /*     		$.ajax({
			type: "GET",
			url: window.MiniclipConfigDestination,
			async: false,
			datatype: "jsonp",
			success: function(info) {
				window.GameConfiguration = info;
				populateSD();
			}
		}).responseJSON;	
     */
    $.ajax({
        //url: 'https://configs-web.agario.miniclippt.com/live/v12/2204/GameConfiguration.json',
        url: window.MiniclipConfigDestination,
        type: 'GET',
        beforeSend: ((req)=>{
            req.setRequestHeader('Accept', 'text/plain');
           req.setRequestHeader('Accept', '*/*');
            req.setRequestHeader('Accept', 'q=0.01');
            req.setRequestHeader('Content-Type', 'application/octet-stream');
            req.setRequestHeader('x-support-proto-version', window.LMagarioheaders.proto_version);
            req.setRequestHeader('x-client-version', '' + window.LMagarioheaders.client_version);
        }
        ),
        success: ((info)=>{
            if (typeof info === 'string' || info instanceof String){
				window.GameConfiguration = JSON.parse(info);
			}
			else{
				window.GameConfiguration = info;
			}
			populateSD();
			}
         ),
		error: ((info)=>{ 
		console.log(info);
		toastr.error('<b>[' + Premadeletter123 + ']:</b> There is no such library anymore');
		})
       
    });		
	
}

function populateLibConfig() {
    var x = document.getElementById("ss-select-agarVersionDestinations");
    //for (i = 0; i < Object.keys(window.agarversionDestinations).length; i++) {
    for (var i = Object.keys(window.agarversionDestinations).length - 1; i > 0; i--) {
        //if (window.agarversionDestinations[i].includes(window.getLatestconfigVersion)) {
            var opt = document.createElement("option");
			opt.text = window.agarversionDestinations[i];
			x.add(opt);
			//x.options[x.options.length] = new Option(window.agarversionDestinations[i])
        //}
    }
}
