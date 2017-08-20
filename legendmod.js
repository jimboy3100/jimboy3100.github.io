//Legend Mod Main Script by jimboy3100
//v2.40

/*************
 * LEGEND mod v2.471 by Jimboy3100   email:jimboy3100@hotmail.com
 *************/
loadericon();
	
var oldgamemode=$("#gamemode");
		//Private Servers
//$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
 $("#region").on('change', function() {
	if (this.value == ":PrS") {
    console.log("Going to PrS");
        $("#gamemode").html('<select id="gamemode" class="form-control" required="" data-original-title="" title="">'+
		'<option value=":PrS0" data-itr="PrS0">-SELECT-</option>'+
		'<option value=":PrS2" data-itr="PrS2">FFA Bots</option>'+
		'<option value=":PrS1" data-itr="PrS1">Instant Merge</option>'+
		'<option value=":PrS3" data-itr="PrS3">1vs1 Arena(1)</option>'+
		'<option value=":PrS4" data-itr="PrS4">1vs1 Arena(2)</option>'+
		'<option value=":PrS5" data-itr="PrS5">1vs1 Arena(3)</option>');
    }
	else if (this.value != ":PrS") {
    console.log("Leaving PrS");
	
        $("#gamemode").html('<select id="gamemode" class="form-control" required="" data-original-title="" title="">'+
		'<option value="" data-itr="page_gamemode_ffa">FFA</option>'+
		'<option value=":teams" data-itr="page_gamemode_teams">Teams</option>'+
		'<option value=":experimental" data-itr="page_gamemode_experimental">Experimental</option>'+
		'<option value=":party" data-itr="page_party">Party Mode</option>');	
    }	
	adres();
});
$('#gamemode').on('change', function() {
   adres();
    if (this.value == ":party") {
        $("#create-party-btn").click();
    console.log("Party stuff fixed");
	}
    else if (this.value == ":PrS1") {
    console.log("Going to PRS1");
	PrivateServer1();
    }
    else if (this.value == ":PrS2") {
    console.log("Going to PRS2");
	PrivateServer2();
    }  
    else if (this.value == ":PrS3") {
    console.log("Going to PRS3");
	PrivateServer3();
    }
    else if (this.value == ":PrS4") {
    console.log("Going to PRS4");
	PrivateServer4();
    }
    else if (this.value == ":PrS5") {
    console.log("Going to PRS5");
	PrivateServer5();
    }	
});

/*		
setTimeout(function (){ $("#create-party-btn-2").click();$('#gamemode').val(":party");},800);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},1500);		  
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},2500);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},3500);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},4500);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},5500);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},7500);
setTimeout(function (){ $('#gamemode2').val(":party");if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},8500);	
setTimeout(function (){ if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},10500);								
setTimeout(function (){ if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},11000);	
setTimeout(function (){ if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},12000);
setTimeout(function (){ if($("#top5-hud").is(":visible")==false){$("#create-party-btn-2").click();}},13500);
*/

var currentIP = "0.0.0.0:0";
var currentToken = "";
var previousMode = localStorage.getItem("gamemode");
var checkonlyonce = localStorage.getItem("checkonlyonce");
var defaultMusicUrl = "https://www.youtube.com/watch?v=Iu8sWFVQmkM";
var coinTimer;
var musicPlayer;
var originalDeath;
var stateObj = {
    foo: "bar"
};
var containermain;
var closebutton1 = "0";
var modebetter = "";
var modbetter2 = "";
var fullornot = "NO";
var minimapbckimg = "";
var leadbimg = "";
var teambimg = "";
var canvasbimg = "";
var pic1urlimg = "http://i.imgur.com/RVBi3T1.gif";
var pic2urlimg = "http://i.imgur.com/p2T29QE.gif";
var pic3urlimg = "http://i.imgur.com/EucIfYY.gif";
var pic4urlimg = "http://i.imgur.com/KOoBDaK.gif";
var pic5urlimg = "http://i.imgur.com/CS03xWv.gif";
var pic6urlimg = "http://i.imgur.com/tfMUu2J.gif";
var pic1dataimg = "Bad Choice!";
var pic2dataimg = "Why?";
var pic3dataimg = "Yow!!";
var pic4dataimg = "Death!";
var pic5dataimg = "Relax!";
var pic6dataimg = "Legend Mod!";
var yt1url = "dQw4w9WgXcQ";
var yt2url = "btPJPFnesV4";
var yt3url = "UD-MkihnOXg";
var yt4url = "vpoqWs6BuIY";
var yt5url = "VUvfn5-BLM8";
var yt6url = "CnIfNSpCf70";
var yt1data = "Rick Astley - Never Gonna Give You Up";
var yt2data = "Survivor - Eye Of The Tiger";
var yt3data = "Lion king - The Lion Sleeps Tonight";
var yt4data = "Agario - Jumbo Solo vs Teams";
var yt5data = "Agario - Kill3r vs Teams";
var yt6data = "Legend Mod Promo";
var lastIP = "";
var minbtext = localStorage.getItem("minbtext");
var leadbtext = localStorage.getItem("leadbtext");
var teambtext = localStorage.getItem("teambtext");
var imgUrl = localStorage.getItem("imgUrl");
var imgHref = localStorage.getItem("imgHref");
//var autoRespawn = localStorage.getItem("autoRespawn");
var showToken = localStorage.getItem("showTK");
var showPlayer = localStorage.getItem("showPlayer");
//var IPBtn = localStorage.getItem("IPBtn");
var SHOSHOBtn = localStorage.getItem("SHOSHOBtn");
var XPBtn = localStorage.getItem("XPBtn");
//var TIMEBtn = localStorage.getItem("TIMEBtn");
//var MAINBBtn = localStorage.getItem("MAINBBtn");
//var MAINBTBtn = localStorage.getItem("MAINBTBtn");
//var MANUIBtn = localStorage.getItem("MANUIBtn");
var MAINBTBtn = localStorage.getItem("MAINBTBtn");
var AnimatedSkinBtn = localStorage.getItem("AnimatedSkinBtn");
// var RotationBtn = localStorage.getItem("RotationBtn");
var YoutubeAutoBtn = localStorage.getItem("YoutubeAutoBtn");
var TIMEcalBtn = localStorage.getItem("TIMEcalBtn");
var troll1Btn = localStorage.getItem("troll1Btn");
var ComPosition = localStorage.getItem("ComPosition");
var autoCoinBtn = localStorage.getItem("autoCoinBtn");
//var copyGameNames = localStorage.getItem("copyGameNames");
var timesopened = localStorage.getItem("timesopened");
var url = localStorage.getItem("url");
var region = getParameterByName("r", url);
var mode = getParameterByName("m", url);
var searchStr = getParameterByName("search", url);
var searchSip = getParameterByName("sip", url);
var privateSrv= getParameterByName("ip", url);
var realmode = "";
var realmode2 = "";
var token = "";
var messageone = 1; //If legendmod is being used
var hiddenfromclan = 0;
var saveclanpassword;
var troll1;
var seticon = "YES";
var setmessagecom = "YES";
var setyt = "YES";
var clanpassword;
var searching;
var timerId;
var semimodVersion = "48"; // the version 1.1-> 1.11
T = {};
var MSGCOMMANDS = "";
var MSGCOMMANDS2;
var MSGCOMMANDS;
var playerMsg = "";
var commandMsg = "";
var otherMsg = "";
var rotateminimap = 0;
var rotateminimapfirst = 0;
var openthecommunication = "NO";
var clickedname = "NO";
var oldteammode;
var checkedGameNames = 0;
var timesdisconnected = 0;
var PanelImageSrc;
var AdminClanSymbol;
var AdminPassword;
var AdminRights = 0;
var LegendClanSymbol = "0";
var legbgcolor = $("#menuPanelColor").val();
var legbgpic = $("#menuBg").val();
var dyinglight1load = localStorage.getItem("dyinglight1load");
var url2;
var semiurl2;
var PostedThings;
var Ultimouseenabled=0;
var setscriptingcom = "YES";
var usedonceSkin=0;
var toastrSkinNotice=0;

var Premadeletter0 = "Communication Activated";
var Premadeletter1 = "Cannot open this youtube URL";
var Premadeletter2 = "You cannot chat if player name > 15 chars";
var Premadeletter3 = "Easter Egg 1 Activated";
var Premadeletter4 = "Easter Egg 2 Activated";
var Premadeletter5 = "Easter Egg 3 Activated";
var Premadeletter6 = "Video works better on vanilla, visit:";
var Premadeletter7 = "Notes:<b>Facebook</b> compatibility is better than <b>Google Plus</b>.";
var Premadeletter8 = "Notes:Agar.io can only connect to <b>Google Plus</b> on onload events. If logout occurs, rejoin Agar.io or use <b>Facebook</b>.";
var Premadeletter9 = "If logout occurs on onload events, delete Chrome cookies from ";
var Premadeletter10 = "Disconnected from server :(";
var Premadeletter11 = "You were banned, restart your rooter!";
var Premadeletter12 = "Connected!";
var Premadeletter13 = "PLAY";
var Premadeletter14 = "SPECTATE";
var Premadeletter15 = "Invalid token or server has closed :(";
var Premadeletter16 = "can be Updated to";
var Premadeletter17 = "Welcome back";
var Premadeletter18 = "Your shortcut area and other areas (from last tab) are still disabled! We suggest you enable them.";
var Premadeletter19 = "Enable Them";
var Premadeletter20 = "Keep Them Disabled";
var Premadeletter21 = "Searching IP";
var Premadeletter22 = "Your teammate";
var Premadeletter23 = "wants you to hide all (leaderboard and minimap)";
var Premadeletter24 = "Accept";
var Premadeletter25 = "NO WAY!";
var Premadeletter26 = "wants you to change your name to";
var Premadeletter27 = "wants you to Enable Troll on death";
var Premadeletter28 = "wants you to open Youtube Player";
var Premadeletter29 = "Leaderboard found";
var Premadeletter30 = "Search";
var Premadeletter31 = "The leaderboard was not found. Keep trying...";
var Premadeletter32 = "Search was canceled";
var Premadeletter33 = "You are invisible to Team / Clan";
var Premadeletter34 = "You are visible to Team / Clan";
var Premadeletter35 = "Hide/Show can be used only while playing";
var Premadeletter36 = "This is not valid Discord Webhook address";
var Premadeletter37 = "Server is locked";
var Premadeletter38 = "You must be on spectate mode";
var Premadeletter39 = "Due to spamming issues, you must be in game and use password";
var Premadeletter40 = "Auto Youtube On";
var Premadeletter41 = "Auto Youtube Off";
var Premadeletter42 = "Show Shortcuts";
var Premadeletter43 = "Hide Shortcuts";
var Premadeletter44 = "Show XP BAR";
var Premadeletter45 = "Hide XP BAR";
var Premadeletter45a = "Rounded Hud";
var Premadeletter45b = "Square Hud";
var Premadeletter46 = "Show Anim. Skins";
var Premadeletter47 = "Hide Anim. Skins";
var Premadeletter48 = "Show Everything";
var Premadeletter49 = "Hide Everything";
var Premadeletter50 = "Show Timer Calc.";
var Premadeletter51 = "Hide Timer Calc."
//var Premadeletter52="Edit Names";
//var Premadeletter52a="Close Names";
var Premadeletter53 = "Auto free coins";
var Premadeletter54 = "Stop free coins";
var Premadeletter55 = "Troll on Death";
var Premadeletter56 = "No troll on Death";
var Premadeletter57 = "Communication";
var Premadeletter58 = "Hidden";
var Premadeletter59 = "Visible";
var Premadeletter60 = "Pause";



var languagemod = localStorage.getItem("languagemod");
if (languagemod == 2) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackGreek.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("2");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}
if (languagemod == 3) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackSpanish.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("3");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}
if (languagemod == 4) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackBulgarian.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("4");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}
if (languagemod == 5) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackFrench.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("5");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}
if (languagemod == 6) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackArabic.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("6");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}

$("body").on('DOMNodeInserted', ".toast.toast-warning", function() {
    MSGCOMMANDS2 = $(".toast.toast-warning").html();
    if (MSGCOMMANDS2.includes("Welcome! You are connected to the OGARio")) {
        //$(".toast.toast-warning").html("<b>[SERVER]:</b> " + Premadeletter0);
		$(".toast.toast-warning").remove();
		setTimeout(function () {
		spectate();
		$("#overlays").show();
		$(".center-container.ogario-menu").show();
		$(".side-container.right-container").show();
		$(".side-container.left-container").show();		
		},200);

	
		MC.setQuality($('#quality').val());
		if($('#region>option:nth-child(1)').val()!=":PrS")	{
		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
		}
		
		
        /*if (openthecommunication=="YES"){
        	setTimeout(function () {
        	$('#gamemode').val(realmode2);
        	$("#connect2").click();
        	return openthecommunication="NO";
        	},2500);
        }*/
    }
});


$("body").on('DOMSubtreeModified', "#chat-box", function() {
    MSGCOMMANDS3 = $(".command-text").text();
    if (MSGCOMMANDS3.includes("Welcome! You are connected to the OGARio by szymy server. Have a nice mass!")) {
	//	$(".toast.toast-warning").remove();
	        $(".command-text").text(Premadeletter0);
		setTimeout(function () {
		spectate();
		$("#overlays").show();
		$(".center-container.ogario-menu").show();
		$(".side-container.right-container").show();
		$(".side-container.left-container").show();		
		},200);

		
		MC.setQuality($('#quality').val());
		if($('#region>option:nth-child(1)').val()!=":PrS")	{
		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
		}
		
    }
});


if (mode == "") {
    modebetter2 = ":ffa"
} else {
    modebetter2 = mode
}

/*
///////////////////////////////////////////////////////////////////////////
// Here "addEventListener" is for standards-compliant web browsers and "attachEvent" is for IE Browsers.
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
// Now...
// if 
//    "attachEvent", then we need to select "onmessage" as the event. 
// if 
//    "addEventListener", then we need to select "message" as the event
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child IFrame window
eventer(messageEvent, function (e) {
       //alert(e.data);
       // Do whatever you want to do with the data got from IFrame in Parent form.
	   if (~e.data.indexOf("CustomSkins")){ 
	   var PostedThings=getParameterByName("skin", e.data);
	   $("#skin").val(PostedThings);
	   //alert(e.data);
	   }
}, false);   
///////////////////////////////////////////////////////////////////////////
*/

//Delete agario divs and images from memory
$("#advertisement").remove();
$("#mcbanners-container").remove();
$("#adsBottom").remove();

//remove adds
$("#adsGameOver").remove();

//Loader Icons 


setTimeout(function() {
    if (searchSip == null) {
        (function(a, c) {
            function r(a, d) {
                if (d) {
                    var f = new Date;
                    f.setTime(f.getTime() + 864E5 * d);
                    f = "; expires=" + f.toGMTString()
                } else f = "";
                document.cookie = "agario_redirect=" + a + f + "; path=/"
            }
            $(function() {
                $("#gamemode").after('<input id="server" class="form-control" style="width: 74%;  display: inline-block; margin-left: 0px; margin-top: 5px"><button type="submit" id="connect" class="btn btn-primary" style="width: 24%; display: none; margin-left: 6px; margin-top: -3px">Connect</button><button type="submit2" id="connect2" class="btn btn-primary btn " style="width: 24%; display: inline-block; margin-left: 6px; margin-top: -3px">Connect</button>');
                $("#connect2").tooltip({
                    title: "Connect to server, or restablish communication",
                    placement: "left"
                });
                $("#connect2").click(function() {


                    if ($("#server").val().includes("#") == false) {
                        var texture2, texture3;
                        texture3 = $("#server").val();
                        texture2 = texture3.substring(0, texture3.indexOf(':'));
                        texture2 = texture2.replace(".", "-");
                        texture2 = texture2.replace(".", "-");
                        texture2 = texture2.replace(".", "-");
                        texture3 = texture3.split(':').pop();
                        texture3 = "ws://ip-" + texture2 + ".tech.agar.io:" + texture3 + "/";
                        a.core.connect(texture3);

                        setTimeout(function() {
                            realmode = getGameMode();
//                            $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
                            var tmz = $("#server").val();
                            // tmz=tmz.replace("ip-", "");tmz=tmz.replace(/-/g,".");tmz=tmz.replace(".tech.agar.io","");tmz=tmz.replace("ws://","");tmz=tmz.replace("/","");
//                            $("#cur-tk-hud").text(" IP:" + tmz).attr("style", "opacity: 0;");
                            currentIP = tmz;
                            if (realmode != ":party") {
                                setTimeout(function() {
                                    history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                }, 3000);
                                setTimeout(function() {
                                    history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                }, 5000);
                                setTimeout(function() {
                                    history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                }, 7000);
                            }

                            MC.setQuality($('#quality').val());
                        }, 1000);
                    } else {
                        joinpartyfromconnect();
                    }

                });
            })
            setTimeout(function() {
                adres();
            }, 5000);
            setTimeout(function() {
                adres();
            }, 7000);
            adres();

        })(window, window.jQuery);
    }
}, 2500);
/*
setTimeout(function () {
$("#connect2").click(function() {
	if($("#top5-hud").is(":visible")){
		$("#connect").click();
		return false;
	}
	else{
	realmode2=$('#gamemode').val();
	$("#create-party-btn-2").click();
	
	
		
		setTimeout(function () {
			if (openthecommunication=="YES"){
		$('#gamemode').val(realmode2);
		$("#connect").click();
		return openthecommunication="NO";
		}
		},6000);
	
	return openthecommunication="YES", realmode2;
	}
});
}, 4500);
*/

setTimeout(function() {

        //	$("body").show();	
        MC.setQuality($('#quality').val());
        //	history.pushState(stateObj, "page 2", "#" + currentToken );
        if (searchSip != null && privateSrv==null) {
//            $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
            if (region == null) {
//                $("#cur-tk-hud").html('<i class="fa fa-lock" aria-hidden="true"></i>' + "IP:" + searchSip);
                //$("#cur-tk-hud").html('<i class="fa fa-lock" aria-hidden="true"></i>'+"IP:" + searchSip).attr("style", "opacity: 0;");
                setTimeout(function() {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip);
                }, 5000);
            } else {

//                $("#cur-tk-hud").html('<i class="fa fa-lock" aria-hidden="true"></i>' + "IP:" + searchSip + "<br>Region:" + region + " Mode" + modebetter2).attr("style", "opacity: 0;");
                //	$("#cur-tk-hud").html('<i class="fa fa-lock" aria-hidden="true"></i>'+"IP:" + searchSip + "<br>Region:" + region + " Mode" + modebetter2 ).attr("style", "opacity: 0;");
                setTimeout(function() {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&?r=" + region + "&?m=" + mode);
                }, 5000);
            }
        } else if (searchSip == null && privateSrv==null) {
            if (realmode != ":party") {
                history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + MC.getRegion() + "&?m=" + realmode);
            }
        }	
	/*	else if (privateSrv!=null) {				
                history.pushState(stateObj, "page 2", "?ip=" + privateSrv + "&?SERVER=PRIVATE");
				
				logout();
				setTimeout(function() {
					MC.setQuality($('#quality').val());
					spectate();
            }, 500);
				$("#gamemode").click(function() {                       
						$(".toast.toast-warning").remove();
                    });
				return false;
        }	*/
		
        $("#server-ws").on('change', function() {
			adres();
            setTimeout(function() {
                realmode = getGameMode();
                if (searchSip == null) {
                    if (realmode != ":party") {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + MC.getRegion() + "&?m=" + realmode);
                    }
                    if (realmode == ":party") {
                        window.history.pushState(null, null, window.location.pathname);
                        history.pushState(stateObj, "page 2", "#" + MC.getPartyToken());
                    }
                }
                MC.setQuality($('#quality').val());
                return realmode;
            }, 1000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 2000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 3000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 4000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 5000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 6000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 7000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
            }, 8000);
            setTimeout(function() {
                MC.setQuality($('#quality').val());
                lastIP = currentIP;
                localStorage.setItem("lastIP", lastIP);
            }, 10000);
        });
    }, //5000
    9000); //9000
// fix party stuff
//  	THIS COMMMAND IS IMPORTANT, DISABLE FOR INGAME COMMUNICATION
//  	$('#gamemode').on('change', function () {
//	if (this.value == ":party") { $("#create-party-btn").click(); }}
//		console.log( "Legend Mod ready!" );});$('#gamemode option[value=":party"]').prop('selected', 'selected').change();
//		history.pushState(stateObj, "page 2", "?r=" + MC.getRegion() + "&m=" + getGameMode() + "&search=ws://" + currentIP);
var minbtext2 = minbtext;
var minbtext3 = minbtext;

if (minbtext == null || minbtext == "") {
    minbtext = "Legend Mod/Locked";
    minbtext2 = "Legend Mod";
	minbtext3 = "Legend Mod/Private";
}
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 6000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 6500);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 7000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 7500);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 8000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 9000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 10000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
			//Load Private Servers
	if($('#region>option:nth-child(1)').val()!=":PrS")	{
	$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
	}	
}, 13000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 14000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 11000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 12000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 13000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 14000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
}, 18000);
setTimeout(function() {
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }
    MC.setQuality($('#quality').val());
    //if(dyinglight1load!="yes"){whenplayerdies();}
}, 22000);

setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 24000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
    //if(dyinglight1load!="yes"){whenplayerdies();}
}, 25000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 30000);
setTimeout(function() {
    MC.setQuality($('#quality').val());
}, 40000);
//setTimeout(function () {history.pushState(stateObj, "page 2", "?r=" + MC.getRegion() + "&m=" + getGameMode() + "&search=ws://" + currentIP); }, 25000);

function init(modVersion) {
    //var connectedbanner=0;


    if (timesopened != null) {
        timesopened++;
        localStorage.setItem("timesopened", timesopened);
    } else if (timesopened == null) {
        localStorage.setItem("timesopened", "0");
    }

    setTimeout(function() {
        document.title = "Legend mod v" + modVersion;
        //document.getElementById("import-settings").value="jim";
        // change buttons styles
        /*	
        	$('#gamemode').before('<select id="gamemode2" class="form-control" required="" data-original-title="" title="" style="width: 32%;  display: inline-block; margin-left: 10px; margin-top: 6px">'+
        	'<option value="" data-itr="page_gamemode_ffa">FFA</option>'+
        	'<option value=":teams" data-itr="page_gamemode_teams">Teams</option>'+
        	'<option value=":experimental" data-itr="page_gamemode_experimental">Experimental</option>'+
        	'<option value=":party" data-itr="page_party">Party Mode</option>'+
        	'</select>');
        	$('#gamemode').hide();
        	$('#gamemode2').change(function(){
        	if ($('#gamemode2').val()==":teams"){ setTimeout(function (){ ogario.gameMode=":teams";adres();appendLog(getLeaderboard());
        		$('#gamemode2').one("change", function(){
        		toastr["info"]("Wait 6 seconds", "", { timeOut: 4000, extendedTimeOut: 2000 }).css("width", "200px");
        		oldteammode=$('#gamemode2').val(); $("#create-party-btn-2").click();setTimeout(function (){MC.setGameMode(oldteammode);adres();appendLog(getLeaderboard());},6000);
        		return false;
        		});
        		},3000);}
        	MC.setGameMode($('#gamemode2').val());
        	adres();
        	});		*/

        $("button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>').attr('data-toggle', "tooltip").prop('title', 'Spectate');
        $("button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>').attr('data-toggle', "tooltip").prop('title', 'Logout');
        $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");

        $("#create-party-btn-2").html('<span class="glyphicon glyphicon-plus"></span>');
        $("#create-party-btn-2").attr('data-toggle', "tooltip").prop('title', "Create party");

        $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>').attr('data-toggle', "tooltip").prop('title', "Join party").attr("style", "width: 49% !important; float: right;");

        //backgroud div
        $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');

        $("#overlays").css("z-index", 100);

        $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 24px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;"><p style="float: left;margin-left: 10px;"><i class="fa fa-search retro"></i><span id="notesRegion">Region: </span><span id="currentRegion" data-toggle="tooltip" data-placement="top" data-original-title="The region you are searching"></span></p><p style="float: right;margin-right: 225px;"><span id="notesServer">Servers: </span><span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p><p style="margin-left: 245px;"><span id="notesPlayers">Players: </span><span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>' +
            '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
            '<div id="" style="margin-top: 10px;">' +
            '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="margin-bottom: 10px;float: left;width: 80% !important;text-align: center;">' +
            '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="margin-bottom:10px;width: 15%;"><span id="searchSpan" class="glyphicon glyphicon-search"></span></button>' +
            '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="color: #ffffff;margin-bottom:10px;width: 10%; background-color: transparent;" data-placement="right" data-original-title="Close" title=""><span class="glyphicon glyphicon-remove-circle"></span></button>' +
            '</div></div>'
        );

        $("#statsInfo").before('<div id="notes" class="main-color" style="display:none;font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 147px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;background-color: rgba(0, 0, 0, 0.2);"><h5 id="notesaveforlater" class="main-color text-center" style="margin-top: 0px;">Save for later</h5>' +
            '<input id="note1" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%;float:left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center;">' +
            '<input id="note2" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
            '<input id="note3" class="form-control main-color note" style="background: transparent; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
            '<input id="note4" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 25%; float: left; border: none; border-bottom: 1px solid; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
            '<input id="note5" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
            '<input id="note6" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
            '<input id="note7" class="form-control main-color note" style="background: transparent; color: lightgrey; border: none; border-bottom: 1px solid; text-align: center; border-color: darkgrey;">' +
            '</div>');

        $(".menu-tabs").children().attr("style", "width: 14.27%;");
        $(".menu-tabs>:nth-child(2)").after('<li class="legend-tab" style="width: 14.27%; height: 100%;" data-toggle="tooltip" data-original-title="API" data-placement="top"><a style="margin-top: 2px; height: 100%;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\');" href="javascript:void(0);" class="fa fa-puzzle-piece fa-lg"></a></li>');
        //  $(".menu-tabs>:nth-child(2)").after('<li class="legend-tab" style="width: 14.27%; height: 100%;" data-toggle="tooltip" data-original-title="Tools" data-placement="top"><a style="margin-top: 2px; height: 100%;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\'); $(\'#helloContainer\').attr(\'style\',\'transform: translate(-50%, 0%) scale(1); top: 150px;\')" href="javascript:void(0);" class="fa fa-puzzle-piece fa-lg"></a></li>');
        //	$(".menu-tabs").children().last().before('<li class="legend-tab" style="width: 14.27%; height: 100%;" data-toggle="tooltip" data-original-title="Tools" data-placement="top"><a style="height: 100%;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\'); $(\'#helloContainer\').attr(\'style\',\'transform: translate(-50%, 0%) scale(1); top: 207px;\')" href="javascript:void(0);" class="fa fa-cogs"></a></li>');
        $("#main-menu>#profile").after('<div id="legend" class="menu-panel"><div class="agario-panel legend-panel">' + //<h5 class="menu-main-color">Main Tools</h5>
            //											'<button id="IPBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-trademark"></i>Show Connector</button>' +
            '<button id="SHOSHOBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-puzzle-piece"></i>' + Premadeletter42 + '</button>' +
            '<button id="XPBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-gamepad"></i>' + Premadeletter44 + '</button>' +
            //                                          '<button id="TIMEBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-clock-o"></i>' + Premadeletter46 + '</button>' +
            //											'<button id="MAINBBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-bars"></i>Show Main Banner</button>' +
                                                        '<button id="MAINBTBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-minus"></i>' + Premadeletter45a + '</button>' +
            											'<button id="AnimatedSkinBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-grav"></i>' + Premadeletter46 + '</button>' +
            //											'<button id="RotationBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-repeat"></i>Show Rotation Btns</button>' +
            '<button id="HideAllBthn" type="button" class="btn btn-sm btn-danger" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Temporarily Hide/Show Everything. Function for Youtubers" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-exclamation-triangle"></i>' + Premadeletter49 + '</button>' +
            '<button id="TIMEcalBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-calculator"></i>' + Premadeletter50 + '</button>' +
            //											'<button id="copyGameNames" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%; display: none;"><i class="fa fa-scissors"></i>' + Premadeletter52 + '</button>' +
            '<button id="autoCoinBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-clock-o"></i>' + Premadeletter53 + '</button>' +
            //											'<button id="autoRespawnBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" data-original-title="" title="" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-flash"></i> Auto respawn</button>' +
            '<button id="troll1Btn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" data-original-title="" title="" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-bath"></i>' + Premadeletter55 + '</button>' +
            //											'<button id="OpenInfo" type="button" class="btn btn-sm btn-danger" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Mod Information and choose Template" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-info-circle"></i>Information</button>' +
            '<button id="OpenuserScripts" type="submit" class="btn btn-primary btn" data-itr="page_play" style="margin-top: 2px; display: block; width: 100%; padding: 4px 0 6px 0;"><i class="fa fa-code"></i>User Scripts</button>' +

            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 2px; padding: 4px 0 0px 0;"><span id="legendmanualback" class="title" style="">Manual background:  </span>' +
            '<select id="backgroundPic" class="form-control" onchange="changePicFun();" required="" data-original-title="" title="" style="display:inline; width: 40%" >' +
            '<option value="1" data-itr="">Minimap</option>' +
            '<option value="2" data-itr="">Leaderboard</option>' +
            '<option value="3" data-itr="">Teamboard</option>' +
            '<option value="4" data-itr="">Main Canvas</option>' +
            '<option value="5" data-itr="">Main Banner</option>' +
            '</select>' +

            '<input id="minimapPicture" class="form-control" placeholder="Minimap Image URL" value="" style="margin-top: 2px; display: block;" onblur="setminbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with http://... or https://..." >' +
            '<input id="minbtext" class="form-control" placeholder="Minimap Text" value="" style="margin-top: 2px; display: block;" onblur="setminbtext();">' +
            '<input id="leadbPicture" class="form-control" placeholder="Leaderboard Image URL" value="" style="margin-top: 2px; display: none;" onblur="setleadbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with http://... or https://..." >' +
            '<input id="leadbtext" class="form-control" placeholder="Leaderboard Logo Text" value="" style="margin-top: 2px; display: none; " onblur="setleadbtext();">' +
            '<input id="teambPicture" class="form-control" placeholder="Teamboard Image URL" value="" style="margin-top: 2px; display: none;" onblur="setteambgname();" data-toggle="tooltip" data-placement="right"  data-original-title="Url of image starting with http://... or https://..." >' +
            '<input id="teambtext" class="form-control" placeholder="Teamboard Logo Text" value="" style="margin-top: 2px; display: none; " onblur="setteambtext();">' +
            '<input id="canvasPicture" class="form-control" placeholder="Main Canvas Image URL" value="" style="margin-top: 2px; display: none;" onblur="setcanvasbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with http://... or https://..." >' +
            '<input id="imgUrl" class="form-control" placeholder="Main Banner Icon URL" value="" style="margin-top: 2px; display: none; " onblur="setimgUrl();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with http://... or https://..." >' +
            '<input id="imgHref" class="form-control" placeholder="Main Banner Link URL" value="" style="margin-top: 2px; display: none; " onblur="setimgHref();" data-toggle="tooltip" data-placement="right" data-original-title="Url of link to redirect" >' +
            '</div>' +

            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 4px 0 0px 0;"><span id="legendmanualmess" class="title" style="">Manual Message Icons&Youtube:  </span>' +
            '<select id="changephotos" class="form-control" onchange="changePhotoFun();" required="" data-original-title="" title="" style="display:inline; width: 35%" >' +
            '<option value="1" data-itr="">Icon 1</option>' +
            '<option value="2" data-itr="">Icon 2</option>' +
            '<option value="3" data-itr="">Icon 3</option>' +
            '<option value="4" data-itr="">Icon 4</option>' +
            '<option value="5" data-itr="">Icon 5</option>' +
            '<option value="6" data-itr="">Icon 6</option>' +
            '<option value="7" data-itr="">Youtube 1</option>' +
            '<option value="8" data-itr="">Youtube 2</option>' +
            '<option value="9" data-itr="">Youtube 3</option>' +
            '<option value="10" data-itr="">Youtube 4</option>' +
            '<option value="11" data-itr="">Youtube 5</option>' +
            '<option value="12" data-itr="">Youtube 6</option>' +
            '</select>' +

            '<input id="pic1data" class="form-control" placeholder="Message Icon Text 1" value="" style="margin-top: 2px; display: block; " onblur="setpic1data();">' +
            '<input id="pic2data" class="form-control" placeholder="Message Icon Text 2" value="" style="margin-top: 2px; display: none; " onblur="setpic2data();">' +
            '<input id="pic3data" class="form-control" placeholder="Message Icon Text 3" value="" style="margin-top: 2px; display: none; " onblur="setpic3data();">' +
            '<input id="pic4data" class="form-control" placeholder="Message Icon Text 4" value="" style="margin-top: 2px; display: none; " onblur="setpic4data();">' +
            '<input id="pic5data" class="form-control" placeholder="Message Icon Text 5" value="" style="margin-top: 2px; display: none; " onblur="setpic5data();">' +
            '<input id="pic6data" class="form-control" placeholder="Message Icon Text 6" value="" style="margin-top: 2px; display: none; " onblur="setpic6data();">' +
            '<input id="yt1data" class="form-control" placeholder="Youtube Message Text 1" value="" style="margin-top: 2px; display: none; " onblur="setyt1data();">' +
            '<input id="yt2data" class="form-control" placeholder="Youtube Message Text 2" value="" style="margin-top: 2px; display: none; " onblur="setyt2data();">' +
            '<input id="yt3data" class="form-control" placeholder="Youtube Message Text 3" value="" style="margin-top: 2px; display: none; " onblur="setyt3data();">' +
            '<input id="yt4data" class="form-control" placeholder="Youtube Message Text 4" value="" style="margin-top: 2px; display: none; " onblur="setyt4data();">' +
            '<input id="yt5data" class="form-control" placeholder="Youtube Message Text 5" value="" style="margin-top: 2px; display: none; " onblur="setyt5data();">' +
            '<input id="yt6data" class="form-control" placeholder="Youtube Message Text 6" value="" style="margin-top: 2px; display: none; " onblur="setyt6data();">' +

            '<input id="pic1url" class="form-control" placeholder="Message Icon Imgur Url 1" value="" style="margin-top: 2px; display: block;" onblur="setpic1url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="pic2url" class="form-control" placeholder="Message Icon Imgur Url 2" value="" style="margin-top: 2px; display: none;" onblur="setpic2url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="pic3url" class="form-control" placeholder="Message Icon Imgur Url 3" value="" style="margin-top: 2px; display: none;" onblur="setpic3url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="pic4url" class="form-control" placeholder="Message Icon Imgur Url 4" value="" style="margin-top: 2px; display: none;" onblur="setpic4url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="pic5url" class="form-control" placeholder="Message Icon Imgur Url 5" value="" style="margin-top: 2px; display: none;" onblur="setpic5url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="pic6url" class="form-control" placeholder="Message Icon Imgur Url 6" value="" style="margin-top: 2px; display: none;" onblur="setpic6url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. http://i.imgur.com/RVBi3T1.gif" >' +
            '<input id="yt1url" class="form-control" placeholder="Youtube Message Url 1" value="" style="margin-top: 2px; display: none;" onblur="setyt1url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '<input id="yt2url" class="form-control" placeholder="Youtube Message Url 2" value="" style="margin-top: 2px; display: none;" onblur="setyt2url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '<input id="yt3url" class="form-control" placeholder="Youtube Message Url 3" value="" style="margin-top: 2px; display: none;" onblur="setyt3url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '<input id="yt4url" class="form-control" placeholder="Youtube Message Url 4" value="" style="margin-top: 2px; display: none;" onblur="setyt4url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '<input id="yt5url" class="form-control" placeholder="Youtube Message Url 5" value="" style="margin-top: 2px; display: none;" onblur="setyt5url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '<input id="yt6url" class="form-control" placeholder="Youtube Message Url 6" value="" style="margin-top: 2px; display: none;" onblur="setyt6url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
            '</div></div>' +

            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 0px 0 0px 0;"><span id="legendlanguagetext" class="title" style="" data-toggle="tooltip" data-placement="right" data-original-title="Visit https://jimboy3100.github.io/ LanguagePackEnglish.js to Upload a Language Pack">Choose Language:  </span>' +
            '<select id="legendlanguages" class="form-control" onchange="changeModLanguage();" required="" data-original-title="" title="" style="display:inline; width: 50%" >' +
            '<option value="1" data-itr="">English</option>' +
            '<option value="6" data-itr="">Arabic - عربى</option>' +
            '<option value="4" data-itr="">Bulgarian - български</option>' +
            '<option value="5" data-itr="">French - Français</option>' +
            '<option value="2" data-itr="">Greek - Ελληνικά</option>' +
            '<option value="3" data-itr="">Spanish - Español</option>' +

            //		
            //		'<option value="5" data-itr="">Icon 5</option>' +
            //		'<option value="6" data-itr="">Icon 6</option>' +
            //		'<option value="7" data-itr="">Youtube 1</option>' +
            //		'<option value="8" data-itr="">Youtube 2</option>' +
            //		'<option value="9" data-itr="">Youtube 3</option>' +
            //		'<option value="10" data-itr="">Youtube 4</option>' +
            //		'<option value="11" data-itr="">Youtube 5</option>' +
            //		'<option value="12" data-itr="">Youtube 6</option>' +
            '</select></div>' +


            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id= "chatbtntitle" class="title" style="">Chat Position:  </span><div class="btn-group">' +
            '<button id="bottomleft" type="button" class="btn btn-primary">Default</button>' +
            '<button id="bottomright" type="button" class="btn btn-primary"><i class="fa fa-arrow-down" aria-hidden="true"></i><i class="fa fa-arrow-right" aria-hidden="true"></i></button>' +
            '<button id="topleft" type="button" class="btn btn-primary"><i class="fa fa-arrow-up" aria-hidden="true"></i><i class="fa fa-arrow-left" aria-hidden="true"></i></button>' +
            '<button id="topright" type="button" class="btn btn-primary"><i class="fa fa-arrow-up" aria-hidden="true"></i><i class="fa fa-arrow-right" aria-hidden="true"></i></button>' +
            '</div></div>' +
            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legenddiscordwebh" class="title" style="">Discord Webhook Url (for sending TOKEN)  </span>' +
            '<input id="discwebhook1" class="form-control" placeholder="Discord Webhook 1 Url" value="" data-toggle="tooltip" data-placement="right" data-original-title="Must be filled for function to work. https://discordapp.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%; display: inline-block; " onblur="setdiscwebhook1();">' +
            '<input id="discwebhook2" class="form-control" placeholder="Discord Webhook 2 Url" value="" data-toggle="tooltip" data-placement="right" data-original-title="Secondary Webhook(optional). https://discordapp.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%; display: inline-block;" onblur="setdiscwebhook2();">' +
            '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legendotherscripts" class="title" style="">Expansions: </span>' +
            '</div><div id="LEGENDAds2"></div><div id="LEGENDAds3"></div>' +


            '' + //<h5 class="menu-main-color" style="margin-top: 10px;">Other features</h5>        
            '</div></div>');
        //  '<button id="showCurTKBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="width: 50%; border-color: darkslategrey;"> Show token</button>' +//  '<button id="showPlayerBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="width: 50%; border-color: darkslategrey;">Show player</button>' +


        $("#HideAllBthn").tooltip({
            title: "Temporarily Hide/Show Everything. Function for Youtubers",
            placement: "bottom"
        });
        //Fix Class Legend Tab
        $(".legend-tab").click(function() {
            MC.setQuality($('#quality').val())
        });

        var initialMusicUrl = (localStorage.getItem("musicUrl") == null ? defaultMusicUrl : localStorage.getItem("musicUrl"));
        //	var savemusic=$(".agario-panel.sounds-panel").html();
        $('.agario-panel.radio-panel').after('<div id="youtubeplayer" style="margin-left: 0px;"><h5 class="main-color" style="margin-right: 15px;">Youtube player</h5>' +
            '<iframe id="musicFrame" width="350" height="180" src="' + getEmbedUrl(initialMusicUrl) + '" frameborder="0" allowfullscreen=""></iframe></div>' +
            '<div id="afteryoutubeplayer"><input id="musicUrl" onclick="$(this).select();" type="text" placeholder="Youtube Url" value="' + initialMusicUrl + '" class="form-control" data-toggle="tooltip" data-placement="right" data-original-title="Paste your video/playlist here">' +
            '<button id="YoutubeAutoBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>' + Premadeletter40 + '</button></div>');
        $('.agario-panel.radio-panel').hide();
        $('.agario-panel.ogario-yt-panel').hide();

        if ($('#menuBg').val() == "http://cdn.ogario.ovh/static/img/pattern.png") {
            $('#menuBg').val("https://jimboy3100.github.io/pattern.png");
        }
        if ($('#messageSound').val() == "http://cdn.ogario.ovh/static/sounds/notification_01.mp3") {
            $('#messageSound').val("https://jimboy3100.github.io/notification_01.mp3");
        }
        if ($('#commandSound').val() == "http://cdn.ogario.ovh/static/sounds/notification_02.mp3") {
            $('#commandSound').val("https://jimboy3100.github.io/notification_02.mp3");
        }
        //    $("#music").replaceWith('<div id="music" class="menu-panel" style="display: none;"><div class="agario-panel"><h5 class="main-color">Youtube player</h5>' +
        //                            '<iframe id="musicFrame" width="320" height="180" src="' + getEmbedUrl(initialMusicUrl) + '" frameborder="0" allowfullscreen=""></iframe>' +
        //                            '<input id="musicUrl" onclick="$(this).select();" type="text" placeholder="Youtube Url" value="' + initialMusicUrl + '" class="form-control" data-toggle="tooltip" data-placement="right" data-original-title="Paste your video/playlist here">'+
        //							'<button id="YoutubeAutoBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>Auto Youtube On</button></div>');
        //	$('#music').append(savemusic+'</div>');						


        if (typeof YT !== 'undefined') {
            musicPlayer = new YT.Player('musicFrame', {
                events: {
                    'onStateChange': function(state) {
                        if (state.data == 1) {
                            $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                            $("#playerBtn").attr('data-original-title', Premadeletter60).tooltip('fixTitle');
                        } else {
                            $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                            $("#playerBtn").attr('data-original-title', Premadeletter13).tooltip('fixTitle');
                        }
                    }
                }
            });
        }
        //roller and other icons
        $('#exp-bar > .icon-user').addClass('fa fa-cog fa-spin fa-3x fa-fw').removeClass('icon-user');
        //$('.music-tab').children().addClass('quick-yt icon-youtube2').removeClass('icon-music').attr('data-original-title', 'Youtube & Sounds');
        $('.music-tab').children().attr('data-original-title', 'Youtube & Sounds');
        document.getElementsByClassName('quick-yt ogicon-youtube2')[0].setAttribute('id', 'legendid');
		
        document.getElementsByClassName('quick-yt ogicon-youtube2')[0].href = "https://www.youtube.com/watch?v=CnIfNSpCf70";
        document.getElementsByClassName('quick-yt ogicon-youtube2')[0].setAttribute('data-original-title', 'Legend Promo Video');
 //       $('#legendid').addClass('fa fa-thumbs-o-up').removeClass('quick-yt icon-youtube2');
        $("#more-skins").attr('href', 'https://jimboy3100.github.io/skins/');
        $(".quick-more-skins.ogicon-grin").attr('href', 'https://jimboy3100.github.io/skins/');
		$("#quick-menu").append('<a id= "LegGoogleForm" class="fa fa-check-square-o" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="New Ideas & Statistics Form" onclick="legendformIframe();return false;"></a>'+
		'<a id= "ModInfoQuick" class="fa fa-info" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="Mod Info & Templates" onclick="openhelper();return false;"></a>');
		
        // prevent edit
        $("#musicUrl").on("input", function() {
            $(this).attr("maxlength", "0");
        });
        $("#musicUrl").bind("paste", function(e) {
            $(this).attr("maxlength", "1000");
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var finalUrl = getEmbedUrl(pastedData.trim());
            if (finalUrl == false) {
                toastr["error"](Premadeletter1).css("width", "210px");
                setTimeout(function() {
                    if (localStorage.getItem("musicUrl") == null) {
                        $("#musicUrl").val(defaultMusicUrl);
                    } else {
                        $("#musicUrl").val(localStorage.getItem("musicUrl"));
                    }
                }, 500);
            } else {
                $("#musicFrame").attr("src", finalUrl);
                localStorage.setItem("musicUrl", pastedData.trim());
            }
        });

        // save notes
        $(".note").keyup(function(event) {
            localStorage.setItem(event.target.id, $(event.target).val());
        });

        $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">Leaderboard history</h5>' +
            '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">' +
            '</div></div>');
        //clone region and gamemode//$("#region").clone().prependTo("#searchLog").attr("onclick","MC.setRegion($(this).val());");//$("#gamemode").clone().prependTo("#searchLog").attr('id', 'gamemode2').after("#gamemode");					 						  

        $("#leaderboard-hud").append('<div id="leaderboard-menu">' +
            '<a id="searchShortcut" class="btn btn-info" data-toggle="tooltip" data-placement="left" data-original-title="Join server (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;" data-toggle="tooltip" data-original-title="Search leaderboards" title=""><i class="fa fa-search fa-lg"></i></a>' +
            '<a id="copySIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP">Copy</a>' +
            '<a id="reconnectBtn" class="btn btn-info" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="' +
            'background-color: transparent;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; border: none;"><i class="fa fa-refresh fa-lg"></i></a>' +

            '<div id="dropDown3" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30x; left: 0px; padding: 0px; border-radius: 0px;">' +
            '<a id="lastIPBtn" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;>NEW</span>Join back</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>Connect to last IP you played</p>"><span class="glyphicon glyphicon-download-alt"></span></a>' +
            '</div>' +

            '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30px; left: 67px; padding: 0px; border-radius: 0px;">' +
            //   '<a id="copyIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy IP Address">IP</a>' +
            '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">Board</a>' +
            '</div>' +

            '<input id="tempCopy" style="display: none;" value="">' +
            '</div>');

        //$("#searchShortcut").mouseenter(function () {
        //$("#dropDown").hide();$("#dropDown3").show(100);$("#copySIPBtn").text("Copy");});
        $("#copySIPBtn").mouseenter(function() {
            $("#dropDown3").hide();
            $("#copySIPBtn").text("Token");
            $("#dropDown").show(100);
        });
        $("#leaderboard-menu").mouseleave(function() {
            $("#dropDown").hide();
            $("#dropDown3").hide();
            $("#copySIPBtn").text("Copy");
        });
        $("#logTitle").after('<a href="#" id="notesclear" style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" class="main-color" onclick="$(\'#log\').html(\'\');" data-toggle="tooltip" data-placement="left" data-original-title="Clear list"><span class="glyphicon glyphicon-ban-circle"></span></a>');
        $("#searchBtn").tooltip('disable');
        $("#copyLBBtn").click(function() {
            copy(getLeaderboard());
        });
        $("#lastIPBtn").click(function() {
            lastIP = localStorage.getItem("lastIP");
            dosearch();
            document.getElementById("searchInput").value = lastIP;
            $("#searchBtn").click();
        });
        //	$("#OpenInfo").click(function () {openhelper();});

        $("#copyIPBtn").click(function() {
            if (searchSip != null) {
                copy("http://agar.io/?r=" + region + "&m=" + mode + "&search=ws://" + searchSip);
            } else {
                copy("http://agar.io/?r=" + MC.getRegion() + "&m=" + realmode + "&search=ws://" + currentIP);
            }
        });

        $("#copySIPBtn").click(function() {
            if (searchSip != null) {
                if (mode == ":party") {
                    copy("http://agar.io/#" + MC.getPartyToken());
                } else if (mode != ":party") {
                    copy("http://agar.io/?sip=" + searchSip + "&?r=" + region + "&m=" + mode);
                }
            } else if (privateSrv==null) { //else if (searchSip != null && privateSrv==null)
                if (realmode == ":party") {
                    copy("http://agar.io/#" + currentToken);
                } else if (realmode != ":party") {
                    copy("http://agar.io/?sip=" + currentIP + "&?r=" + MC.getRegion() + "&m=" + realmode);
                }
            }
			else if (privateSrv!=null) {
                    copy("http://agar.io/?ip=" + privateSrv + "&?SERVER=PRIVATE");
                
            }
        });

        $("#reconnectBtn").click(function() {
            ogario.gameMode = realmode;
            hideMenu();
            changeServer();
            if (!$("#searchHud").is(':visible')) {
                delay(200, spectate);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 1000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 2000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 3000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 5000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 7000);				
            }
        });
	


        /*$("#createPartyBtn").click(function(){ hideMenu();$("#create-party-btn-2").click();if (!$("#searchHud").is(':visible')) {delay(200, spectate);}});*/
        $("#reconnectBtn").mouseenter(function() {
            $("#dropDown").hide();
            $("#copySIPBtn").text("Copy");
        });

        $("#searchBtn").click(function() {
            var searchString = $("#searchInput").val();
            searchHandler(searchString);
        });		
        $("#searchInput").keyup(function(event) {
            if (event.keyCode == 13) {
                $("#searchBtn").click();
            }
        });
	
        $("#closeBtn").click(function() {
            hideSearchHud();
        });
        $("#searchShortcut").click(function() {
            hideMenu();
            showSearchHud();
            $("#searchInput").focus().select();
        });

        $('#nick').mouseenter(function() {
            $('#nick').css('background-color', '#000066');
            return clickedname = "YES"
        }).mouseleave(function() {
            $('#nick').css('background-color', '');
        });
        $('#nick').blur(function() {
            if (clickedname == "YES") {
                if ($("#nick").val().length >= 16) {
                    toastr["warning"]("<b>[SERVER]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
                }
            }
            if ($("#nick").val() == "EasterEgg1") {
                toastr["info"](Premadeletter3).css("width", "210px");
                $("#nick").val("Easter Egg");
                $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
                openbleedmod();
            } else if ($("#nick").val() == "EasterEgg2") {
                toastr["info"](Premadeletter4).css("width", "210px");
                $("#nick").val("Easter Egg");
                $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
                openrotatingmod();
            } else if ($("#nick").val() == "EasterEgg3") {
                toastr["info"](Premadeletter5 + ',<br>' + Premadeletter6 + '<a target="_blank" href="https://github.com/jimboy3100">https://github.com/jimboy3100</a>');
                $("#nick").val("Video");
                openvidmod();
            }
        });
		
		$('#stream-mode').before('<button id="opennamechars" class="btn btn-info" style="background-color: transparent;" onclick="opennamechars();return false;"><i class="fa fa-language"></i></button>');
		$('#clantag').css("width", "-=20px");	$('#nick').css("width", "+=20px");	
        $('#clantag').mouseenter(function() {
            $('#clantag').css('background-color', '#000066');
        }).mouseleave(function() {
            $('#clantag').css('background-color', '');
        });
        //	$('#region').unbind('mouseenter');
        //	$('#gamemode').unbind('mouseenter');
        $('#region').mouseenter(function() {
            $('#region').css('background-color', '#003300');
        }).mouseleave(function() {
            $('#region').css('background-color', '');
        });
        $('#gamemode').mouseenter(function() {
            $('#gamemode').css('background-color', '#003300');
        }).mouseleave(function() {
            $('#gamemode').css('background-color', '');
        });

        //define if it is clicked
        $("#create-party-btn-2").click(function() {
            if (hiddenfromclan == 0) {
                $("#ChatBtn").attr("data-original-title", "Chat is ON, hide/show up");
                $("#ChatBtn1").attr('class', 'fa fa-eye-slash');
            } else if (hiddenfromclan == 1) {
                $("#ChatBtn").attr("data-original-title", "Chat is ON, hide/show up");
            }
            //return messageone=1;
        });

		
		
		
        $("#boostButton").css("display", "inline-block");
        $("#massButton").css("display", "inline-block");
        $("#massButton").after($("#promo-badge-container"));


        // LEGEND footer
        var ogarioVersion = $("#menu-footer").text().split("| ")[1];
        $("#menu-footer").text("");

        $("#TimesUsedPanel").css({
            marginBottom: "5px"
        });
        $("#freeCoins").css({
            marginBottom: "-5px"
        });
        $("#openShopBtn").css({
            marginTop: "-10px"
        });
        $("#openShopBtn").css({
            marginTop: "-15px"
        });
        $("#gifting").css({
            marginTop: "25px"
        });
        $("#dailyQuests").css({
            marginBottom: "5px"
        });
		$("#quests-blocker").hide();
		
        $('#themePreset>option:nth-child(1)').text("Legend v2");
        $('#themePreset>option:nth-child(2)').text("Legend v1");
        $('#themePreset>option:nth-child(3)').text("Legend Original");
        $('#themePreset>option:nth-child(4)').text("Crazy Style 1");
        $('#themePreset>option:nth-child(5)').text("Crazy Style 2");
        $('#menuPreset>option:nth-child(1)').text("Legend v2");
        $('#menuPreset>option:nth-child(2)').text("Legend v1");

        //Legend Mod Cursors
        if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_01.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_01.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_02.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_02.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_03.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_03.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_04.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_04.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_05.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_05.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_06.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_06.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_07.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_07.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_08.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_08.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_09.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_09.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_10.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_10.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_11.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_11.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_12.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_12.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_13.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_13.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_14.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_14.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_15.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_15.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_16.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_16.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_17.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_17.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_18.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_18.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_19.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_19.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_20.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_20.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_21.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_21.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_22.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_22.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_23.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_23.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_24.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_24.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_25.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_25.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_26.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_26.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_27.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_27.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_28.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_28.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_29.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_29.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_30.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_30.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_31.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_31.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_32.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_32.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_33.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_33.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_34.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_34.cur")
        } else if ($("#customCursor").val() == "http://cdn.ogario.ovh/static/img/cursors/cursor_35.cur") {
            $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_35.cur")
        }
        $(".cursor-box>a>img").eq(0).attr("src", "https://jimboy3100.github.io/cursors/cursor_01.cur");
        $(".cursor-box>a>img").eq(1).attr("src", "https://jimboy3100.github.io/cursors/cursor_02.cur");
        $(".cursor-box>a>img").eq(2).attr("src", "https://jimboy3100.github.io/cursors/cursor_03.cur");
        $(".cursor-box>a>img").eq(3).attr("src", "https://jimboy3100.github.io/cursors/cursor_04.cur");
        $(".cursor-box>a>img").eq(4).attr("src", "https://jimboy3100.github.io/cursors/cursor_05.cur");
        $(".cursor-box>a>img").eq(5).attr("src", "https://jimboy3100.github.io/cursors/cursor_06.cur");
        $(".cursor-box>a>img").eq(6).attr("src", "https://jimboy3100.github.io/cursors/cursor_07.cur");
        $(".cursor-box>a>img").eq(7).attr("src", "https://jimboy3100.github.io/cursors/cursor_08.cur");
        $(".cursor-box>a>img").eq(8).attr("src", "https://jimboy3100.github.io/cursors/cursor_09.cur");
        $(".cursor-box>a>img").eq(9).attr("src", "https://jimboy3100.github.io/cursors/cursor_10.cur");
        $(".cursor-box>a>img").eq(10).attr("src", "https://jimboy3100.github.io/cursors/cursor_11.cur");
        $(".cursor-box>a>img").eq(11).attr("src", "https://jimboy3100.github.io/cursors/cursor_12.cur");
        $(".cursor-box>a>img").eq(12).attr("src", "https://jimboy3100.github.io/cursors/cursor_13.cur");
        $(".cursor-box>a>img").eq(13).attr("src", "https://jimboy3100.github.io/cursors/cursor_14.cur");
        $(".cursor-box>a>img").eq(14).attr("src", "https://jimboy3100.github.io/cursors/cursor_15.cur");
        $(".cursor-box>a>img").eq(15).attr("src", "https://jimboy3100.github.io/cursors/cursor_16.cur");
        $(".cursor-box>a>img").eq(16).attr("src", "https://jimboy3100.github.io/cursors/cursor_17.cur");
        $(".cursor-box>a>img").eq(17).attr("src", "https://jimboy3100.github.io/cursors/cursor_18.cur");
        $(".cursor-box>a>img").eq(18).attr("src", "https://jimboy3100.github.io/cursors/cursor_19.cur");
        $(".cursor-box>a>img").eq(19).attr("src", "https://jimboy3100.github.io/cursors/cursor_20.cur");
        $(".cursor-box>a>img").eq(20).attr("src", "https://jimboy3100.github.io/cursors/cursor_21.cur");
        $(".cursor-box>a>img").eq(21).attr("src", "https://jimboy3100.github.io/cursors/cursor_22.cur");
        $(".cursor-box>a>img").eq(22).attr("src", "https://jimboy3100.github.io/cursors/cursor_23.cur");
        $(".cursor-box>a>img").eq(23).attr("src", "https://jimboy3100.github.io/cursors/cursor_24.cur");
        $(".cursor-box>a>img").eq(24).attr("src", "https://jimboy3100.github.io/cursors/cursor_25.cur");
        $(".cursor-box>a>img").eq(25).attr("src", "https://jimboy3100.github.io/cursors/cursor_26.cur");
        $(".cursor-box>a>img").eq(26).attr("src", "https://jimboy3100.github.io/cursors/cursor_27.cur");
        $(".cursor-box>a>img").eq(27).attr("src", "https://jimboy3100.github.io/cursors/cursor_28.cur");
        $(".cursor-box>a>img").eq(28).attr("src", "https://jimboy3100.github.io/cursors/cursor_29.cur");
        $(".cursor-box>a>img").eq(29).attr("src", "https://jimboy3100.github.io/cursors/cursor_30.cur");
        $(".cursor-box>a>img").eq(30).attr("src", "https://jimboy3100.github.io/cursors/cursor_31.cur");
        $(".cursor-box>a>img").eq(31).attr("src", "https://jimboy3100.github.io/cursors/cursor_32.cur");
        $(".cursor-box>a>img").eq(32).attr("src", "https://jimboy3100.github.io/cursors/cursor_33.cur");
        $(".cursor-box>a>img").eq(33).attr("src", "https://jimboy3100.github.io/cursors/cursor_34.cur");
        $(".cursor-box>a>img").eq(34).attr("src", "https://jimboy3100.github.io/cursors/cursor_35.cur");
        $("#theme-images>div.ps-scrollbar-x-rail").before('<div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_36.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_37.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_38.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_39.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_40.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_41.cur"></a></div><div class="cursor-box"><a href="#"><img src="https://jimboy3100.github.io/cursors/cursor_42.cur"></a></div>');

        $('#themePreset').on('change', function() {
            setTimeout(function() {
				var c = document.getElementById("minimap-sectors");
				var ctx = c.getContext("2d");
					ctx.clearRect(0, 0, c.width, c.height / 9);
					ctx.font = "16px Georgia";
					if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
					else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
					else {ctx.fillText(minbtext2, c.width / 2, 22); }
					MC.setQuality($('#quality').val());
            }, 200);
        })
        $('#miniMapWidth-value').bind("DOMSubtreeModified", function() {
            setTimeout(function() {
				var c = document.getElementById("minimap-sectors");
				var ctx = c.getContext("2d");
				ctx.clearRect(0, 0, c.width, c.height / 9);
				ctx.font = "16px Georgia";
				if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
				else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
				else {ctx.fillText(minbtext2, c.width / 2, 22); }
				MC.setQuality($('#quality').val());
            }, 100);
        })

        $(".agario-panel.ogario-yt-panel").html('<div class="agario-panel ogario-yt-panel"><h6 class="menu-main-color"><i></i></h6></div>');
        $(".agario-profile-name-container").after('<div class="TimesUsedPanel" align="right" display:inline-block;><h6><i>Times Used: ' + timesopened +
            '<br>Legend Mod by jimboy3100</i></h6></div>');
        $(".agario-panel.ogario-yt-panel").css({
            marginBottom: "-10px"
        });
        //	'Scripts used: ' + '<a href="http://ogario.ovh" target="_blank">ogario</a>'+ ", " + '<a href="https://kittymod.github.io/" target="_blank">kitty</a>' + " & " + '<a href="https://greasyfork.org/en/scripts/by-site/agar.io" target="_blank">others</a><br>'+

        //		$(".agario-panel.agario-shop-panel").after('<button id="OpenInfo" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Mod Information and choose Template" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 25%;"><i class="fa fa-info-circle"></i>Information</button>');
        //		$("#OpenInfo").tooltip({title: "Mod Information and choose Template", placement: "bottom"});
        //		$("#OpenInfo").click(function () {openhelper();});
        $("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'legendWebsite\');" href="http://www.legendmod.ml" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend Mod Website" data-placement="left">Legend mod v' + modVersion + semimodVersion + '</a></span>' +
            '<a href="https://legendmod.joomla.com/en/more-fps.html" data-toggle="tooltip" data-title="How to improve performance" data-placement="top" style ="font-size: 13px"; target="_blank">More FPS</a>');
        // donate button
        //kitty's
        // $("#menu-footer").after('<form onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'donate\');" data-toggle="tooltip" data-title="Please support " data-placement="left" target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="ELCEHJY3M52K8"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');
        //jimboy's
        $("#menu-footer").after('<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" data-toggle="tooltip" data-title="Please support the development of Legend Mod" data-placement="left" target="_blank"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="CM3GDVCW6PBF6"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');
        //$("#minimap-sectors").attr("style", "opacity: 0.25;");
        // keybinds

        $(document).keyup(function(event) {
            if (event.which == 8) { // search
                if ($('input:focus').length == 0) {
                    $("#searchShortcut").click();
                }

            } else if (event.which == 187 && !($("input").is(":focus")) && ogario.play == false) { // refresh server
                $("#reconnectBtn").click();

            } else if (event.which == 27) { // ESCAPE

                if ($('#searchHud').is(':visible')) {
                    hideSearchHud();
                } else {
                    showMenu();
                }
            }
        });

        $(".btn.btn-play-guest.btn-success.btn-needs-server").attr("onclick", "newsubmit()");
        $(".btn.btn-play.btn-primary.btn-needs-server").attr("onclick", "newsubmit()");

        //$('.btn.btn-warning.btn-spectate.btn-needs-server').click(function () {
        //	if ($("#gamemode2").val()!=":party"){
        //	toastr["info"]("Communication is disabled, after Spectate, save your ip and click <b>CONNECT</b> to fix", "", { timeOut: 6000, extendedTimeOut: 6000 }).css("width", "350px");	
        //	}
        //});

        $(document).keydown(function(event) {
            if (event.which == 81 && ogario.spectate && !($("input").is(":focus"))) { // spectate 'Q' fix
                spectate();
            }
        });

        $("#time-hud").attr("style", "top: 290px !important;");

        // fix leaderboard buttons
        $("#leaderboard-menu").css("pointer-events", "auto");
        $("#searchHud").css("pointer-events", "auto");

        // fix stats text size
        $('[id="statsText"]').css("font-size", "medium");

        // detect paste
        $(document).bind("paste", function(e) {
            if (!searching && !($("input,textarea").is(":focus"))) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                hideMenu();
                showSearchHud();
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                searchHandler(pastedData);
            }
        });

        $("#searchInput").bind("paste", function(e) {
            if (!searching) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                searchHandler(pastedData);
            }
        });

        //load notes
        $("#note1").val(localStorage.getItem('note1'));
        $("#note2").val(localStorage.getItem('note2'));
        $("#note3").val(localStorage.getItem('note3'));
        $("#note4").val(localStorage.getItem('note4'));
        $("#note5").val(localStorage.getItem('note5'));
        $("#note6").val(localStorage.getItem('note6'));
        $("#note7").val(localStorage.getItem('note7'));

        //load messages for Google Plus
        $("#gplusLogin").click(
            function() {
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 1000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 2000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 3000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 4000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());
                }, 5000);
                setTimeout(function() {
                    MC.setQuality($('#quality').val());					
                }, 6000);
                if (messageone == 1) {
                    if (timesopened == null || timesopened == "" || timesopened <= 5) {
                        toastr["error"](Premadeletter7, "", {
                            timeOut: 15000,
                            extendedTimeOut: 15000
                        }).css("width", "350px");
                    } else if (timesopened > 5) {

                        toastr["info"](Premadeletter8, "", {
                            timeOut: 15000,
                            extendedTimeOut: 15000
                        }).css("width", "350px");
                        toastr["info"](Premadeletter9 + ": <i>chrome://settings/clearBrowserData</i> ", "", {
                            timeOut: 15000,
                            extendedTimeOut: 15000
                        }).css("width", "350px");
                    }
                    return messageone = 0;
                }
            });
		$(".btn.btn-danger.btn-logout").click(
            function() {
                setTimeout(function() {
					adres();
                    MC.setQuality($('#quality').val());
                }, 1000);});
				
        // listen for server disconnect
        MC.onDisconnect = function() {
            toastr["error"](Premadeletter10).css("width", "210px");
            appendSysLog("DISCONNECTED :(");
            if (timesdisconnected < 2) {
                MC.reconnect();
				setTimeout(function() {
                adres();
				}, 3000);
                timesdisconnected++;
                return timesdisconnected;
            } else {
                return timesdisconnected = 0;
            }
        };

        // listen for player ban
        MC.onPlayerBanned = function() {
            toastr["error"](Premadeletter11).css("width", "210px");
            appendSysLog("BAN :(");
        };
        $("#region").ready(function() {
            delay(2000, getInfo);
        });
        $('body').on('click', '.logEntry', function() {
            document.getElementById('searchInput').value = "http://agar.io/#" + $(this).data('token');
            bumpLog();
            getInfo();
            searchTKHandler($("#searchInput").val());
        });

        $('body').on('click', '.btn-play-shortcut', function() {
            MC.setQuality($('#quality').val());
            hideSearchHud();
            toastr.clear();
            play();
        });
        $('body').on('click', '.btn-spectate-shortcut', function() {
            MC.setQuality($('#quality').val());
            hideSearchHud();
            toastr.clear();
            spectate();
        });

        //    $("#region, #gamemode").change(function () {appendLog(getLeaderboard());});

        // hide exp bar//$("#exp-bar").remove();// hide party form//$("#create-party-btn-2").hide();
        $("#ogario-party").wrap('<div style="display: none;" id="hidendivtoken"></div>');

        //    var url = window.location.href; /*if (url.length !== 21) {$("#ogario-party").hide();}*/

        //be careful
        //   $("#gamemode").change(function () {
        //       if ($("#gamemode").val() == ":party") {$("#hidendivtoken").css("display", "block");$("#joinPartyToken").val("");}
        //		else {$("#hidendivtoken").css("display", "none");}
        //        localStorage.setItem("gamemode", ogario.gameMode);});

        // style buttons
        $(".btn-spectate, .btn-logout").attr("style", "border-top: none; border-left: none; border-right: none;");
        $("#region").change(function() {
            localStorage.setItem("location2", MC.getRegion());
        });
/*
        if (searchSip == null) {
            $(document).ajaxComplete(function(event, xhr, settings) {
                //console.log(xhr);
                //console.log(settings);
                if (getGameMode() == "") {
                    modebetter = ":ffa"
                } else {
                    modebetter = getGameMode()
                }
                if (xhr.responseJSON != null) {
                    if (xhr.responseJSON.ip != null && xhr.responseJSON.hasOwnProperty('ip')) {
                        currentIP = xhr.responseJSON.ip;
                        //	    if (localStorage.getItem("IPBtn") == "true" || localStorage.getItem("IPBtn") == null) {
//                        $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
                        //        $("#cur-tk-hud").html("IP:" + currentIP +"<br>Region:" + MC.getRegion() + " Mode" + modebetter ) ;
//                        $("#cur-tk-hud").html("IP:" + currentIP + "<br>Region:" + MC.getRegion() + " Mode" + modebetter).attr("style", "opacity: 0;");
                        //  }
                    }

                    if (xhr.responseJSON.token != null && xhr.responseJSON.hasOwnProperty('token')) {
                        currentToken = xhr.responseJSON.token;
                        //joinToken(currentToken.replace("http://agar.io/#", ""));        
                    }
                }
                if (xhr.status == 200 && settings.url == "http://m.agar.io/getToken") {
                    //toastr["info"]("Connected :)").css("width","210px");
                    //           delay(200, spectate);
                    //			connectedbanner++;
                    realmode = ":party";
                    //			if (connectedbanner==2){
                    //			toastr["info"](Premadeletter12 + '</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", { timeOut: 20000, extendedTimeOut: 20000 }).css("width", "210px");	
                    //			$("#hidendivtoken").css("display", "block");			}
                    return realmode, modebetter;
                }
            });

            $(document).ajaxError(function(event, xhr, settings) {
                //console.log(xhr);//console.log(event);//console.log(settings);
                if (xhr.status == 404 && settings.url == "http://m.agar.io/getToken") {
                    toastr["error"](Premadeletter15).css("width", "210px");
                    $('#helloContainer').attr('data-party-state', '0');
                }
            });
            // search IP in query //     var url = window.location.href;//     var region = getParameterByName("r", url);//     var mode = getParameterByName("m", url);//     var searchStr = getParameterByName("search", url);
            setTimeout(function() {
                if (url.length == 21) {
                    joinToken(url.replace("http://agar.io/#", ""));
                } else {
                    if (region != null) {
                        MC.setRegion(region);
                        MC.setGameMode(mode);
                    } else {
                        // bug fix//            MC.setRegion(region);//            MC.setGameMode(mode);		
                        //this makes game rejoin
                        // MC.setRegion(localStorage.getItem("location2"));MC.setGameMode(previousMode);         		
                    }
                }
                if (searchStr != null && searchStr) {
                    if (searchIPHandler(searchStr)) {
                        hideMenu();
                        showSearchHud();
                        showCancelSearch();
                        $("#searchInput").val(searchStr);
                    }
                }
            }, 6000); //10
        }
*/
        $("#autoCoinBtn").click(function() {

            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("autoCoinBtn", true);
                startCoinMining();
                $(this).html('<i class="fa fa-clock-o"></i>' + Premadeletter54);
            } else {
                localStorage.setItem("autoCoinBtn", false);
                stopCoinMining();
                $(this).html('<i class="fa fa-clock-o"></i>' + Premadeletter53);
            }
        });


        /*	    $("#copyGameNames").click(function () {var checked = !($(this).attr('aria-pressed') == "true");		
                if (checked) {
        			localStorage.setItem("copyGameNames", true);
        			if (checkedGameNames==0){$(this).html('<i class="fa fa-user-o"></i>'+Premadeletter52a);StartEditGameNames();}
        			else{
        				localStorage.setItem("copyGameNames", true);
        				$(this).html('<i class="fa fa-user-o"></i>'+Premadeletter52a); ContinueEditGameNames();			}
                } 
        		else{
        			localStorage.setItem("copyGameNames", false);
        			StopEditGameNames();$(this).html('<i class="fa fa-user-o"></i>' + Premadeletter52);return checkedGameNames=1;}
        		});
        		
                $("#autoRespawnBtn").click(function () {
                var checked = !($(this).attr('aria-pressed') == "true");
                if (checked) {
                    localStorage.setItem("autoRespawn", true);
                    // auto respawn//var proxyOnDeath = MC.onPlayerDeath;
                    MC.onPlayerDeath = function () {
        				//afterdeathtonormalmode();
                        var isVisibleMenu = $("#main-menu").is(':visible');
                        var isVisibleSearchHud = $("#searchHud").is(':visible');
                        var autoRespawn = localStorage.getItem("autoRespawn");
                        //proxyOnDeath();// disable stats
                        if (!$("#skipStats").is(':checked')) { $("#skipStats").click() }
                        if (autoRespawn != null && autoRespawn == "true" && !isVisibleMenu && !isVisibleSearchHud && !($("input").is(":focus"))) {
                            setTimeout(function () { play(); }, 1500);
                        }
                    };
                    $(this).html('<i class="fa fa-flash"></i> Stop respawn');
                } else {
                    localStorage.setItem("autoRespawn", false);
                    MC.onPlayerDeath = originalDeath;
                    $(this).html('<i class="fa fa-flash"></i> Auto respawn');
                }
            }); */

        localStorage.setItem("showTK", false);

        /*     $("#IPBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("IPBtn", true);$("#server").show();$("#connect2").show();$(this).html('<i class="fa fa-trademark"></i>Hide Connector');} 
        		else {localStorage.setItem("IPBtn", false);$("#server").hide();$("#connect2").hide();$(this).html('<i class="fa fa-trademark"></i>Show Connector');}} );  */
        $("#SHOSHOBtn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("SHOSHOBtn", true);
                $("#shortcuts-hud").show();
                $("#rotate-hud").show();
                $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter43);
            } else {
                localStorage.setItem("SHOSHOBtn", false);
                $("#shortcuts-hud").hide();
                $("#rotate-hud").hide();
                $("#images-hud").hide();
                $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter44);
                return seticon = "YES";
            }
        });
        $("#XPBtn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("XPBtn", true);
                $("#exp-bar").show();
                $(this).html('<i class="fa fa-gamepad"></i>' + Premadeletter45);
            } else {
                localStorage.setItem("XPBtn", false);
                $("#exp-bar").hide();
                $(this).html('<i class="fa fa-gamepad"></i>' + Premadeletter44);
            }
        });
		
		        $("#MAINBTBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("MAINBTBtn", true);
				var headID = document.getElementsByTagName("head")[0];
				$(headID).append('<style type="text/css" id="RNCN">.agario-panel, .center-container, .btn, .form-control, '+
				'.input-group-addon, .input-group-sm>.input-group-addon, .agario-party, .agario-side-panel{border-radius: 10px;}.menu-tabs,'+
				'#main-panel, #profile, #legend, #og-settings, #theme, #music, #hotkeys{border-radius: 10px 10px 0 0;} #hotkeys {border-radius: 10px;} .skin, .input-group-btn, .input-group.nick {border-radius: 0 15px 15px 0;}  '+
				'.colorpicker-element .input-group-addon i, .colorpicker-element .add-on i{ border-radius: 50%; }.agario-profile-picture { border-radius: 32px;}'+
				'#menu-footer { border-radius: 0 0 10px 10px; } #leaderboard-hud { border-radius: 15px;} #dropDown { border-radius: 15px;} #minimap-hud { border-radius: 0 0 15px 15px;}'+
				'#top5-hud{ border-radius: 15px; } #target-hud{ border-radius: 15px; } #legendAdImg, #stats-hud { border-radius: 10px; } '+
				'#time-hud { border-radius: 10px; } </style>');				
				$(this).html('<i class="fa fa-minus"></i>'+Premadeletter45b);}
        		else {localStorage.setItem("MAINBTBtn", false);
				var headID = document.getElementsByTagName("head")[0];
				$(headID).append('<style type="text/css" id="RNCN">.agario-panel, .center-container, .btn, .form-control, '+
				'.input-group-addon, .input-group-sm>.input-group-addon, .agario-party, .agario-side-panel, .menu-tabs,'+
				'#main-panel, #profile, #legend, #og-settings, #theme, #music, #hotkeys,  #hotkeys, .skin, .input-group-btn, .input-group.nick,  '+
				'.colorpicker-element .input-group-addon i, .colorpicker-element .add-on i, .agario-profile-picture,'+
				'#menu-footer, #leaderboard-hud, #dropDown, #minimap-hud,'+
				'#top5-hud, #target-hud, #legendAdImg, #stats-hud, '+
				'#time-hud { border-radius: 0 0 0 0 } </style>');
				$(this).html('<i class="fa fa-minus"></i>'+Premadeletter45a);}} ); 
            $("#AnimatedSkinBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("AnimatedSkinBtn", true);if (usedonceSkin==0){animatedskins();}
				if (toastrSkinNotice==1){toastr["info"]("Animated skins <font color='red'><b>enabled</font></b>, <font color='red'><b>FPS drop</font></b> when 16").css("width", "300px");}
				$(this).html('<i class="fa fa-grav"></i>'+ Premadeletter47); return usedonceSkin=1;}
        		else {localStorage.setItem("AnimatedSkinBtn", false);
				toastr["info"]("Animated skins will be <font color='red'><b>disabled</font></b> after rejoin. <font color='red'><b>Better FPS</font></b> performance when 16").css("width", "300px");
				$(this).html('<i class="fa fa-grav"></i>' + Premadeletter46);}} );  				
       /*         $("#MANUIBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("MANUIBtn", true);
				var headID = document.getElementsByTagName("head")[0];
				$(headID).append('<style type="text/css" id="RNCN2">#leaderboard-positions{ text-align: center; } </style>');				
        		$(this).html('<i class="fa fa-align-left""></i>Left Leaderboard');}
				else {localStorage.setItem("MANUIBtn", false);
				var headID = document.getElementsByTagName("head")[0];
				$(headID).append('<style type="text/css" id="RNCN2">#leaderboard-positions{ text-align: left; } </style>');
				$(this).html('<i class="fa fa-align-center"></i>Cent. Leaderboard');}} ); */
        //     $("#TIMEBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        //		if (checked) {localStorage.setItem("TIMEBtn", true);$("#time-hud").show();$(this).html('<i class="fa fa-clock-o"></i>'+ Premadeletter47);}
        //		else {localStorage.setItem("TIMEBtn", false);$("#time-hud").hide();$(this).html('<i class="fa fa-clock-o"></i>' + Premadeletter46);}} );  
        /*     $("#MAINBBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("MAINBBtn", true);$("#LEGENDAds").show();$(this).html('<i class="fa fa-bars"></i>Hide Main Banner');}
        		else {localStorage.setItem("MAINBBtn", false);$("#LEGENDAds").hide();$(this).html('<i class="fa fa-bars"></i>Show Main Banner');}} );
             $("#MAINBTBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("MAINBTBtn", true);$("#legendbanners").show();$(this).html('<i class="fa fa-minus"></i>Hide Main Tools');}
        		else {localStorage.setItem("MAINBTBtn", false);$("#legendbanners").hide();$(this).html('<i class="fa fa-minus"></i>Show Main Tools');}} );   
              $("#MANUIBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("MANUIBtn", true);$(".input-group.skin.colorpicker-element").show();
        		$(this).html('<i class="fa fa-minus"></i>Hide Manual Skins');}else {localStorage.setItem("MANUIBtn", false);$(".input-group.skin.colorpicker-element").hide();$(this).html('<i class="fa fa-minus"></i>Show Manual Skins');}} ); 
             $("#RotationBtn").click(function () {var checked = !($(this).attr('aria-pressed') == "true");
        		if (checked) {localStorage.setItem("RotationBtn", true);$("#rotate-hud").show();
        		$(this).html('<i class="fa fa-repeat"></i>Hide Rotation Btns');}else {localStorage.setItem("RotationBtn", false);$("#rotate-hud").hide();$(this).html('<i class="fa fa-repeat"></i>Show Rotation Btns');}} );  */

        $("#YoutubeAutoBtn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("YoutubeAutoBtn", true);
                setTimeout(function() {
                    $("#playerBtn").click();
                }, 2000);
                setTimeout(function() {
                    $("#playerBtn").focusout();
                }, 2100);
                $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter41);
            } else {
                localStorage.setItem("YoutubeAutoBtn", false);
                $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter40);
            }
        });

        $("#TIMEcalBtn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("TIMEcalBtn", true);
                $("#timertools-hud").show();
                $(this).html('<i class="fa fa-calculator"></i>' + Premadeletter51);
                T.timerDiv = document.getElementById('timer');
                return T.timerDiv;
            } else {
                localStorage.setItem("TIMEcalBtn", false);
                $("#timertools-hud").hide();
                $(this).html('<i class="fa fa-calculator"></i>' + Premadeletter50);
            }
        });
        $("#HideAllBthn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                //		$("#cur-tk-hud").hide();
                $("#shortcuts-hud").hide();
                $("#rotate-hud").hide();
                $("#exp-bar").hide();
                $("#time-hud").hide();
                //		$(".input-group.skin.colorpicker-element").hide();
                //		$("#legendbanners").hide();
                $("#leaderboard-hud").hide();
                $("#minimap-hud").hide();
                $("#stats-hud").hide();
                $("#top5-hud").hide();
                $("#target-hud").hide();
                $("#target-panel-hud").hide();
                $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter48);
            } else {
                //		$("#cur-tk-hud").show();
                $("#shortcuts-hud").show();
                $("#rotate-hud").show();
                $("#exp-bar").show();
                $("#time-hud").show();
                //		$(".input-group.skin.colorpicker-element").show();
                //		$("#legendbanners").show();
                $("#leaderboard-hud").show();
                $("#minimap-hud").show();
                $("#stats-hud").show();
                $("#top5-hud").show();
                $("#target-panel-hud").show();
                $("#target-hud").show();
                $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter49);
            }
        });


        $("#troll1Btn").click(function() {
            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("troll1Btn", true);
                settroll1true();
                whenplayerdies();
                $(this).html('<i class="fa fa-bath"></i>' + Premadeletter56);
            } else {
                localStorage.setItem("troll1Btn", false);
                settroll1false();
                whenplayerdies();
                $(this).html('<i class="fa fa-bath"></i>' + Premadeletter55);
            }
        });

        $("#OpenuserScripts").click(function() {
            if (modVersion != "2.4") {
                toastr["info"]("Mod Version must be 2.4 or higher").css("width", "250px");
                return false;
            } else {
                $("#main-menu").hide();
                $("#skins-panel").hide();
                $("#quick-menu").hide();
                $("#exp-bar").hide();
                $("#userscripts").show();
            }
        });



//        $("#stats-hud").after('<div id="cur-tk-hud" class="hud main-color hud-top" align="right" style=" right: 220px; font-size: 13px; padding: 6px;"></div>');
        //$("#cur-tk-hud").attr("style", "opacity: 0;");


        $("#minimap-hud").prepend('<div id="shortcuts-hud" class="hud" style="width: 100%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -30px; display: block;">' +
            '<button id="VoiceBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title="Voice & Camera Chat"><i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i></button>' +
            '<button id="ChatBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title=' + Premadeletter57 + '><i id="ChatBtn1" class="fa fa-comment-o" style="padding-left: 0px;"></i></button>' +
            '<button id="MiniScripts" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setscriptingfunction();" data-toggle="tooltip" data-original-title="Mini Scripts"><i id="MiniScripts1" class="fa fa-linode" style="padding-left: 0px;"></i></button>' +
            '<button id="SendCommands" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setmessagecomfunction();" data-toggle="tooltip" data-original-title="Message Script Commands"><i id="SendCommands1" class="fa fa-sitemap" style="padding-left: 0px;"></i></button>' +
            '<button id="Images" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="seticonfunction();" data-toggle="tooltip" data-original-title="Message Imgur Icons"><i id="Images1" class="fa fa-picture-o" style="padding-left: 0px;"></i></button>' +
            '<button id="yout" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setytfunction();" data-toggle="tooltip" data-original-title="Message Youtube Videos"><i id="yout1" class="fa fa-youtube" style="padding-left: 0px;"></i></button>' +
            '<button id="Bino" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="Bino();" data-toggle="tooltip" data-original-title="[Spectate Mode Only] Binoculars"><i id="BinoBtnI" class="fa fa-binoculars" style="padding-center: 0px;"></i></button>' +
            '<button id="playerBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title=' + Premadeletter13 + '><i id="playerI" class="fa fa-play-circle" style="padding-center: 0px;"></i></button>' +
            '<button id="fullscreenBtn" class="btn-link" style="padding: 0px;color: #d6d3d3;width: 11%;height: 100%;" onclick="toggleFullScreen(fullornot);" data-toggle="tooltip" data-original-title="Fullscreen"><i class="fa fa-tv" style="padding-left: 0px;"></i></button></div>');


        $("#minimap-hud").prepend('<div id="rotate-hud" class="" style="width: 11%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: 0px; display: block;">' +
            //	'<button id="RotateLeft" class="btn-link" style="padding: 0px;color: #d6d3d3; width: 49%;height: 100%;" onclick="rotateminimapsectors2();" data-toggle="tooltip"  data-original-title="Rotate Left"><i class="fa fa-undo" style="padding-left: 0px;"></i></button>'+
            '<button id="RotateRight" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" onclick="rotateminimapsectors();" data-toggle="tooltip" data-original-title="Rotate"><i class="fa fa-repeat" style="padding-left: 0px;"></i></button></div>');

        $("#minimap-hud").prepend('<div id="images-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
            '<button id="sendicon1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon1();" data-toggle="tooltip" data-original-title="Bad Choice!"><i id="sendicon11" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button>' +
            '<button id="sendicon2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon2();" data-toggle="tooltip" data-original-title="Why?"><i id="sendicon21" class="fa fa-question-circle" style="padding-left: 0px;"></i></button>' +
            '<button id="sendicon3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon3();" data-toggle="tooltip" data-original-title="Yow!!"><i id="sendicon31" class="fa fa-wheelchair" style="padding-center: 0px;"></i></button>' +
            '<button id="sendicon4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon4();" data-toggle="tooltip" data-original-title="Death!"><i id="sendicon41" class="fa fa-cutlery" style="padding-center: 0px;"></i></button>' +
            '<button id="sendicon5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon5();" data-toggle="tooltip" data-original-title="Relax!"><i id="sendicon51" class="fa fa-bed" style="padding-left: 0px;"></i></button>' +
            '<button id="sendicon6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon6();" data-toggle="tooltip" data-original-title="Legend Mod!"><i id="sendicon61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

        $("#minimap-hud").prepend('<div id="yt-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
            '<button id="sendyt1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt1();" data-toggle="tooltip" data-original-title="Rick Astley - Never Gonna Give You Up"><i id="sendyt11" class="fa fa-music" style="padding-left: 0px;"></i></button>' +
            '<button id="sendyt2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt2();" data-toggle="tooltip" data-original-title="Survivor - Eye Of The Tiger"><i id="sendyt21" class="fa fa-music" style="padding-left: 0px;"></i></button>' +
            '<button id="sendyt3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt3();" data-toggle="tooltip" data-original-title="Lion king - The Lion Sleeps Tonight"><i id="sendyt31" class="fa fa-music" style="padding-center: 0px;"></i></button>' +
            '<button id="sendyt4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt4();" data-toggle="tooltip" data-original-title="Agario - Jumbo Solo vs Teams"><i id="sendyt41" class="fa fa-video-camera" style="padding-center: 0px;"></i></button>' +
            '<button id="sendyt5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt5();" data-toggle="tooltip" data-original-title="Agario - Kill3r vs Teams"><i id="sendyt51" class="fa fa-video-camera" style="padding-left: 0px;"></i></button>' +
            '<button id="sendyt6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt6();" data-toggle="tooltip" data-original-title="Legend Mod Promo"><i id="sendyt61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

        $("#minimap-hud").prepend('<div id="msgcommands-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
            '<button id="msgcommand1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand1f();" data-toggle="tooltip" data-original-title="Hello Team!"><i id="msgcommand11" class="fa fa-coffee" style="padding-left: 0px;"></i></button>' +
            '<button id="msgcommand2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand2f();" data-toggle="tooltip" data-original-title="Laugh to Team"><i id="msgcommand21" class="fa fa-smile-o" style="padding-left: 0px;"></i></button>' +
            '<button id="msgcommand3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand3f();" data-toggle="tooltip" data-original-title="Team Change Name to yours"><i id="msgcommand31" class="fa fa-magic" style="padding-center: 0px;"></i></button>' +
            '<button id="msgcommand4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand4f();" data-toggle="tooltip" data-original-title="Troll on Death"><i id="msgcommand41" class="fa fa-bath" style="padding-center: 0px;"></i></button>' +
            '<button id="msgcommand5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand5f();" data-toggle="tooltip" data-original-title="Open Youtube Music"><i id="msgcommand51" class="fa fa-youtube-play" style="padding-left: 0px;"></i></button>' +
            '<button id="msgcommand6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand6f();" data-toggle="tooltip" data-original-title="Insane mode (Hide Everything)"><i id="msgcommand" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button></div>');

		$("#minimap-hud").prepend('<div id="scripting-hud" class="hud" style="width: 25%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
            '<button id="Cutnames" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" data-toggle="tooltip" data-original-title="Edit names"><i id="Cutnames1" class="fa fa-scissors" style="padding-left: 0px;"></i></button>' +
            '<button id="Ultimouse" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" onclick="Ultimouse();" data-toggle="tooltip" data-original-title="Ultimouse Control"><i id="Ultimouse1" class="fa fa-mouse-pointer" style="padding-left: 0px;"></i></button></div>');

        $("#minimap-hud").prepend('<div id="timertools-hud" class="hud" align="center" style="width: 50%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -90px; display: block;">' +
            '<button id="playtimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: block;" onclick="startTimer();" data-toggle="tooltip" data-original-title="Start Timer"" ><i id="playtime" class="fa fa-play-circle" style="padding-left: 0px;"></i></button>' +
            '<button id="stoptimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="stopTimer();" data-toggle="tooltip" data-original-title="Pause Timer""><i id="pausetime" class="fa fa-pause-circle" style="padding-left: 0px;"></i></button>' +
            '<button id="cleartimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="clearTimer();" data-toggle="tooltip" data-original-title="Stop Timer"><i id="cleartime" class="fa fa-stop-circle" style="padding-left: 0px;"></i></button>' +
            '<a id="timer" style="padding: 0px; color: #d6d3d3; width: 12%; height: 100% position: absolute; right: 0px;">00:00</a>');
        $("#stoptimer").hide();
        $("#cleartimer").hide();

        // player shortcut
        $("#playerBtn").click(function() {
            if (musicPlayer != undefined) {
                var playerState = musicPlayer.getPlayerState();
                if (playerState != 1) {
                    musicPlayer.playVideo();
                    $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                    $(this).attr('data-original-title', Premadeletter60).tooltip('fixTitle').tooltip('show');
                } else {
                    musicPlayer.pauseVideo();
                    $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                    $(this).attr('data-original-title', Premadeletter13).tooltip('fixTitle').tooltip('show');
                }
            }
        });

        $('*[data-itr="page_play"]').click(function() {
            ga('send', 'event', 'Token', ogario.playerNick + ' | agar.io/#' + currentToken);
            ga('send', 'event', 'Tag', ogario.playerNick + ' | ' + ogario.clanTag);
            ga('send', 'event', 'PlayerId', ogario.playerNick + ' | ' + $("#user-id-tag").text().split(": ")[1]);
        });



        $("#topright").click(function() {
            localStorage.setItem("ComPosition", 0);
            toastr.remove();
            toastr.options = {
                "positionClass": "toast-top-right"
            }
        });
        $("#topleft").click(function() {
            localStorage.setItem("ComPosition", 1);
            toastr.remove();
            toastr.options = {
                "positionClass": "toast-top-left"
            }
        });
        $("#bottomright").click(function() {
            localStorage.setItem("ComPosition", 2);
            toastr.remove();
            toastr.options = {
                "positionClass": "toast-bottom-right"
            }
        });
        $("#bottomleft").click(function() {
            localStorage.setItem("ComPosition", 3);
            toastr.remove();
            toastr.options = {
                "positionClass": "toast-bottom-left"
            }
        });
        $("#ChatBtn").click(function() {
            chatfunction();
        });

        $("#Cutnames").click(function() {
            if (checkedGameNames == 0) {
                StartEditGameNames();
                return checkedGameNames = 2;
            } else if (checkedGameNames == 1) {
                ContinueEditGameNames();
                return checkedGameNames = 2;
            } else if (checkedGameNames == 2) {
                StopEditGameNames();
                return checkedGameNames = 1;
            }
        });
        $("#VoiceBtn").click(function() {
            if (searchSip == null) {
                if (ogario.gameMode == ":party") {
                    semiurl2 = MC.getPartyToken() + $("#clantag").val() + "?name=" + $("#nick").val() + "&?ip=" + MC.getPartyToken();
                } else {
                    var currentIP2 = currentIP.replace(".", "");
                    currentIP2 = currentIP2.replace(".", "");
                    currentIP2 = currentIP2.replace(".", "");
                    currentIP2 = currentIP2.replace(":", "");
                    semiurl2 = currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() + "&?ip=" + currentIP;
                }
            } else if (searchSip != null) {
                var currentIP2 = searchSip.replace(".", "");
                currentIP2 = currentIP2.replace(".", "");
                currentIP2 = currentIP2.replace(".", "");
                currentIP2 = currentIP2.replace(":", "");
                semiurl2 = currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() + "&?ip=" + searchSip;
            }

            url2 = "https://talky.io/" + semiurl2;

            setTimeout(function() {
                $("#VoiceBtn").focusout();
            }, 3000);
            setTimeout(function() {
                $("#VoiceBtn").focusout();
            }, 5000);
            setTimeout(function() {
                $("#VoiceBtn").focusout();
            }, 8000);
            var win = window.open(url2, '_blank');

        });
		
		//blue onmouseover-onmouseout buttons
        $('#searchShortcut').mouseenter(function() {$('#searchShortcut').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#searchShortcut').css('background-color', "transparent");});
        $('#copySIPBtn').mouseenter(function() {$('#copySIPBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#copySIPBtn').css('background-color', "transparent");});		
        $('#copyLBBtn').mouseenter(function() {$('#copyLBBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#copyLBBtn').css('background-color', "transparent");});
        $('#reconnectBtn').mouseenter(function() {$('#reconnectBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#reconnectBtn').css('background-color', "transparent");});
		
        $('#VoiceBtn').mouseenter(function() {$('#VoiceBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#VoiceBtn').css('background-color', "transparent");});
        $('#ChatBtn').mouseenter(function() {$('#ChatBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#ChatBtn').css('background-color', "transparent");});
        $('#MiniScripts').mouseenter(function() {$('#MiniScripts').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#MiniScripts').css('background-color', "transparent");});
		$('#SendCommands').mouseenter(function() {$('#SendCommands').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#SendCommands').css('background-color', "transparent");});
        $('#shortcuts-hud>#Images').mouseenter(function() {$('#shortcuts-hud>#Images').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#shortcuts-hud>#Images').css('background-color', "transparent");});
        $('#yout').mouseenter(function() {$('#yout').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#yout').css('background-color', "transparent");});
        $('#Bino').mouseenter(function() {$('#Bino').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#Bino').css('background-color', "transparent");});
        $('#playerBtn').mouseenter(function() {$('#playerBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#playerBtn').css('background-color', "transparent");});
        $('#fullscreenBtn').mouseenter(function() {$('#fullscreenBtn').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#fullscreenBtn').css('background-color', "transparent");});

        $('#Cutnames').mouseenter(function() {$('#Cutnames').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#Cutnames').css('background-color', "transparent");});				
        $('#Ultimouse').mouseenter(function() {$('#Ultimouse').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#Ultimouse').css('background-color', "transparent");});						
		
        $('#msgcommand1').mouseenter(function() {$('#msgcommand1').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand1').css('background-color', "transparent");});	
        $('#msgcommand2').mouseenter(function() {$('#msgcommand2').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand2').css('background-color', "transparent");});	
        $('#msgcommand3').mouseenter(function() {$('#msgcommand3').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand3').css('background-color', "transparent");});	
        $('#msgcommand4').mouseenter(function() {$('#msgcommand4').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand4').css('background-color', "transparent");});	
        $('#msgcommand5').mouseenter(function() {$('#msgcommand5').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand5').css('background-color', "transparent");});	
        $('#msgcommand6').mouseenter(function() {$('#msgcommand6').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#msgcommand6').css('background-color', "transparent");});	
		
        $('#sendicon1').mouseenter(function() {$('#sendicon1').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon1').css('background-color', "transparent");});	
        $('#sendicon2').mouseenter(function() {$('#sendicon2').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon2').css('background-color', "transparent");});	
        $('#sendicon3').mouseenter(function() {$('#sendicon3').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon3').css('background-color', "transparent");});	
        $('#sendicon4').mouseenter(function() {$('#sendicon4').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon4').css('background-color', "transparent");});	
        $('#sendicon5').mouseenter(function() {$('#sendicon5').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon5').css('background-color', "transparent");});	
        $('#sendicon6').mouseenter(function() {$('#sendicon6').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendicon6').css('background-color', "transparent");});
		
        $('#sendyt1').mouseenter(function() {$('#sendyt1').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt1').css('background-color', "transparent");});	
        $('#sendyt2').mouseenter(function() {$('#sendyt2').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt2').css('background-color', "transparent");});	
        $('#sendyt3').mouseenter(function() {$('#sendyt3').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt3').css('background-color', "transparent");});	
        $('#sendyt4').mouseenter(function() {$('#sendyt4').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt4').css('background-color', "transparent");});	
        $('#sendyt5').mouseenter(function() {$('#sendyt5').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt5').css('background-color', "transparent");});	
        $('#sendyt6').mouseenter(function() {$('#sendyt6').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#sendyt6').css('background-color', "transparent");});
		
        $('#RotateRight').mouseenter(function() {$('#RotateRight').css('background-color', '#018cf6');})
		.mouseleave(function() {$('#RotateRight').css('background-color', "transparent");});
		

        // fix main menu placement after stats
        // $("#statsContinue2").click(function () { $("#main-menu > ul > li.start-tab > a").click() });

        // save original death function
        originalDeath = MC.onPlayerDeath;

        // remove leaderboard setting//  
        $("#normalLb").parent().remove();
        $("#leaderboard-hud > h4").text("Leaderboard");

        //50 maxlength
        $("#nick").attr('maxlength', 50).attr('placeholder', 'Name').tooltip({
            title: "Insert your in-game name, 50 chars are visible on Mod users, 15 to other users",
            placement: "bottom"
        });
        $("#clantag").attr('placeholder', 'Password').tooltip({
            title: "Leave it empty for Public, or insert password of Clan, or use it as Tag",
            placement: "left"
        });
        $("#skin").attr('maxlength', 150).attr('placeholder', 'Manual direct skin URL').tooltip({
            title: "Insert your manual skin weblink",
            placement: "left"
        });
        $("#region").tooltip({
            title: "The region to play",
            placement: "left"
        });
        $("#gamemode").tooltip({
            title: "The mode to play",
            placement: "top"
        });

        //	document.getElementsByClassName('yt-username')[0].href="https://www.youtube.com/watch?v=CnIfNSpCf70";//	document.getElementsByClassName('yt-username')[0].innerHTML = "Legend Mod Promo";//	document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].id="playerofgame";//	document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].id="playerguest";//	document.getElementsByClassName('btn btn-warning btn-login-play btn-needs-server')[0].id="playerlogin";//	$("#playerofgame").attr("onclick","MC.setQuality($('#quality').val());MC.setNick(document.getElementById('nick').value); return false;");

        //Buttons for search Area
        $("#log").after('<button id="Backtomenu" onclick="doback(); return false" class="btn btn-danger" data-itr="page_login_and_play" data-original-title="" title="">CLOSE</button>');
        $("#tags-container").before('<div id="legendbanners" style="margin-top: 10px;"><img src="https://jimboy3100.github.io/legend.github.io/banners/iconinfo.png" data-original-title="Mod Information and choose Template" data-toggle="tooltip" id= "infoicon" onclick="openhelper();return false;" class="img-rounded" alt="Cinque Terre" width="87" height="40">' +
            '<img src="https://jimboy3100.github.io/legend.github.io/banners/vanillapic2.jpg" alt="Vanilla Like Settings" id = "vanillaset" onclick="vanillasettings(); return false" class="img-rounded"  return false" width="87" height="40" >' +
            '<img src="https://jimboy3100.github.io/legend.github.io/banners/iconlegenddefaultsmall.png" alt="Vanilla Like Settings" id = "defaultset" onclick="legenddefaultsettings(); return false" class="img-rounded"  return false" width="87" height="40"  >' +
            '<img src="https://jimboy3100.github.io/legend.github.io/banners/smallbannerlegendclan2.png" alt="Vanilla Like Settings" id = "legendclanbanner" class="img-rounded" return false" width="87" height="40" onclick="gotolegendml(); return false" > ' +
            '</div><div id="LEGENDAds"></div>');
        $("#legendbanners").css({
            marginTop: "-25px"
        });
        $("#version-tag").css({
            marginBottom: "-15px"
        });
        $("#LEGENDAds").css({
            marginBottom: "-5px"
        });
        //Other things
        // ADS
        var tag1 = document.getElementById("nick").value;
        if (modVersion != "2.4") {
            $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerupdate");
        } else {
            if (tag1.includes("♔Jimboy3100") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playeriamlegend");
            } else if (tag1.includes("GUARD") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playerguard");
            } else if (tag1.includes("℄🌀") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
            } else if (tag1.includes("₣") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
            } else if (tag1.includes("℄") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
            } else if (tag1.includes("♋") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
            } else if (tag1.includes("۞ẒṨ۞") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
            } else if (tag1.includes("ᴺ૯ᵂ۞") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
            } else if (tag1.includes("۞ᵶᵴ™") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
            } else if (tag1.includes("๔ɀ") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerdz");
            } else if (tag1.includes("ﾏｮʞʇ") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerrect");
            } else if (tag1.includes("₴₵₳Ɽ") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerscar");
            } else if (tag1.includes("ΕΛ") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerEl");
            } else if (tag1.includes("⋩ᕮχ⋨") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerex");
            } else if (tag1.includes("ƖƦ") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerir");
            } else if (tag1.includes("ȴøng") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlong");
            } else if (tag1.includes("ƸU") == true) {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannereu");
            } else {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerAll");
            }
        }

        // ANNOUNCEMENTS
        if (modVersion != "2.4") {
            toastr["info"]('Mod <font color="yellow"><b>v' + modVersion + '</b></font> ' + Premadeletter16 + ' <font color="yellow"><b>v2.4</b></font>. <br>visit: <a target="_blank" href="https://jimboy3100.github.io/legendmod.user.js"><font color="red"><b><u>www.legendmod.ml</u></b></font></a>');
        } //else{toastr["info"]('Hello ' + tag1 +'! </br>Legend Mod v' + modVersion + ' website: <a target="_blank" href="http://www.legendmod.ml/">LINK</a>');
        else {
            toastr["info"](Premadeletter17 + ' <b><font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://jimboy3100.github.io/banners/particles.gif);">' + tag1 + '</span></font>!').css("width", "300px");		
          //  toastr["info"](Premadeletter17 + ' <b><font color="red">' + tag1 + '</font></b>!<br>When experiencing lag, press <font color="red"><b>'+$("#hk-showSkins").val()+'</b></font> to disable skins. <br><i> Less to draw means better performance.</i>').css("width", "380px");
        }
        //toastr["info"](' QUICK Server reconnects may cause <b><font color="green">Google Plus / Facebook </font></b> logouts').css("width", "350px");}

        $("#infoicon").mouseover(function() {
            $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerinformation");
        });
        $("#vanillaset").mouseover(function() {
            $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannervanillaliking");
        });
        $("#defaultset").mouseover(function() {
            $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannergalaxyliking");
        });
        $("#legendclanbanner").mouseover(function() {
            $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlc");
        });

        $("#infoicon").mouseout(function() {
            if (modVersion != "2.4") {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerupdate");
            } else {
                if (tag1.includes("♔Jimboy3100") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playeriamlegend");
                } else if (tag1.includes("GUARD") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playerguard");
                } else if (tag1.includes("℄🌀") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("₣") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("℄") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("♋") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("۞ẒṨ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("ᴺ૯ᵂ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("۞ᵶᵴ™") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("๔ɀ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerdz");
                } else if (tag1.includes("ﾏｮʞʇ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerrect");
                } else if (tag1.includes("₴₵₳Ɽ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerscar");
                } else if (tag1.includes("ΕΛ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerEl");
                } else if (tag1.includes("⋩ᕮχ⋨") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerex");
                } else if (tag1.includes("ƖƦ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerir");
                } else if (tag1.includes("ȴøng") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlong");
                } else if (tag1.includes("ƸU") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannereu");
                } else {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerAll");
                }
            }
        });
        $("#vanillaset").mouseout(function() {
            if (modVersion != "2.4") {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerupdate");
            } else {
                if (tag1.includes("♔Jimboy3100") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playeriamlegend");
                } else if (tag1.includes("GUARD") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playerguard");
                } else if (tag1.includes("℄🌀") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("₣") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("℄") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("♋") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("۞ẒṨ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("ᴺ૯ᵂ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("۞ᵶᵴ™") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("๔ɀ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerdz");
                } else if (tag1.includes("ﾏｮʞʇ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerrect");
                } else if (tag1.includes("₴₵₳Ɽ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerscar");
                } else if (tag1.includes("ΕΛ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerEl");
                } else if (tag1.includes("⋩ᕮχ⋨") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerex");
                } else if (tag1.includes("ƖƦ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerir");
                } else if (tag1.includes("ȴøng") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlong");
                } else if (tag1.includes("ƸU") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannereu");
                } else {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerAll");
                }
            }
        });
        $("#defaultset").mouseout(function() {
            if (modVersion != "2.4") {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerupdate");
            } else {
                if (tag1.includes("♔Jimboy3100") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playeriamlegend");
                } else if (tag1.includes("GUARD") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playerguard");
                } else if (tag1.includes("℄🌀") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("₣") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("℄") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("♋") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("۞ẒṨ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("ᴺ૯ᵂ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("۞ᵶᵴ™") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("๔ɀ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerdz");
                } else if (tag1.includes("ﾏｮʞʇ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerrect");
                } else if (tag1.includes("₴₵₳Ɽ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerscar");
                } else if (tag1.includes("ΕΛ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerEl");
                } else if (tag1.includes("⋩ᕮχ⋨") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerex");
                } else if (tag1.includes("ƖƦ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerir");
                } else if (tag1.includes("ȴøng") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlong");
                } else if (tag1.includes("ƸU") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannereu");
                } else {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerAll");
                }
            }

        });
        $("#legendclanbanner").mouseout(function() {
            if (modVersion != "2.4") {
                $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerupdate");
            } else {
                if (tag1.includes("♔Jimboy3100") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playeriamlegend");
                } else if (tag1.includes("GUARD") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/playerguard");
                } else if (tag1.includes("℄🌀") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("₣") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("℄") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("♋") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannersflc");
                } else if (tag1.includes("۞ẒṨ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("ᴺ૯ᵂ۞") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("۞ᵶᵴ™") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerzs");
                } else if (tag1.includes("๔ɀ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerdz");
                } else if (tag1.includes("ﾏｮʞʇ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerrect");
                } else if (tag1.includes("₴₵₳Ɽ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerscar");
                } else if (tag1.includes("ΕΛ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerEl");
                } else if (tag1.includes("⋩ᕮχ⋨") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerex");
                } else if (tag1.includes("ƖƦ") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerir");
                } else if (tag1.includes("ȴøng") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerlong");
                } else if (tag1.includes("ƸU") == true) {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannereu");
                } else {
                    $("#LEGENDAds").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerAll");
                }
            }

        });
        //Load Lc Announcement
        if (tag1.includes("℄") == true) {
            $("#LEGENDAds").after('<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 2px; padding: 0px 0 0px 0;"><a href="https://jimboy3100.github.io/LcClanPriviledges.txt" target="_blank" id= "LegendPrivileges" class="title" style=""><u>Priviledges of Legend ℄ Clan Players</u></a></class>');
        }

        $('#server-connect').click(function() {
            adres();
			setTimeout(function() {
                $("#server").val(currentIP);
            }, 1500);
        });
        $('#server-reconnect').click(function() {
            adres();
			setTimeout(function() {
                $("#server").val(currentIP);
            }, 1500);
        });
        $('#server-join').click(function() {
            adres();
			setTimeout(function() {
                $("#server").val(currentIP);
            }, 1500);
        });

        $("#shortcuts-hud").hide();
        $("#rotate-hud").hide();
        $("#exp-bar").hide();
        $("#time-hud").hide();
        //	$("#LEGENDAds").hide();
        //	$("#legendbanners").hide();
        //	$(".input-group.skin.colorpicker-element").hide();
        $("#timertools-hud").hide();

        //Legend.Mod&?player=lala&?com=HideAll&?do=donothing
        //Legend.Mod&?player=a&?com=Team5&?do=donothing

        $("body").on('DOMNodeInserted', ".toast.toast-success", function() {
            MSGCOMMANDS = $(".toast.toast-success").text();



            if (MSGCOMMANDS.includes("Legend.Mod")) {

                playerMsg = getParameterByName("player", MSGCOMMANDS);
                commandMsg = getParameterByName("com", MSGCOMMANDS);
                otherMsg = getParameterByName("do", MSGCOMMANDS);
                //		$( ".toast.toast-success" ).text("");
                //		$(".toast.toast-success").hide();
                $(".toast.toast-success").remove();
                //without confirmation
                if (commandMsg == "Team5") {
                    $("#top5-hud").css('background-image', 'url(" https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/icogeneral.gif ")').css({
                        opacity: 0.8
                    });
                    setTimeout(function() {
                        $("#top5-hud").css('background-image', 'url(" ")').css({
                            opacity: 1
                        });
                    }, 12000);
                }

                if (commandMsg == "Hello") {
                    if (MC.isInGame()) {
                        if (!ogario.spectate) {
                            var nickname = $("#nick").val();
                            $("#nick").val("Hello Team");
                            $("#helloContainer").show();
                            newsubmit();
                            setTimeout(function() {
                                $("#nick").val(nickname);
                                $("#helloContainer").show();
                                newsubmit();
                            }, 5000);
                        }
                    }
                }

                //with confirmation
                if (commandMsg == "HideAll") {
                    toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter23 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-hideall" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    $(".btn.btn-sm.btn-primary.btn-play.btn-do-hideall").click(function() {
                        $("#HideAllBthn").click();
                    });
                }

                if (commandMsg == "NamePerm") {
                    toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter26 + ': ' + playerMsg + ' </br> <button class="btn btn-sm btn-primary btn-play btn-do-NamePerm" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-NamePerm" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    $(".btn.btn-sm.btn-primary.btn-play.btn-do-NamePerm").click(function() {
                        $("#nick").val(playerMsg);
                        $("#helloContainer").show();
                        newsubmit();
                    });
                }

                if (commandMsg == "dTroll2") {
                    toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter27 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-troll" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-troll" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    $(".btn.btn-sm.btn-primary.btn-play.btn-do-troll").click(function() {
                        settroll1true();
                        whenplayerdies();
                    });
                }

                if (commandMsg == "Youtube") {
                    toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter28 + '<button class="btn btn-sm btn-primary btn-play btn-play-youtube" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-noplay-youtube" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    $(".btn.btn-sm.btn-primary.btn-play.btn-play-youtube").click(function() {
                        $("#playerBtn").click();
                        setTimeout(function() {
                            $("#playerBtn").focusout();
                        }, 100);
                    });
                    //	$("#playerBtn").click();			
                }
            }

            if (MSGCOMMANDS.includes("http://agar.io/sip=151.80.91.73:1511")) {
                commandMsg = getParameterByName("com", MSGCOMMANDS);
                otherMsg = getParameterByName("do", MSGCOMMANDS);
                $(".toast.toast-success").remove();
                LegendClanSymbol = $("#nick").val();
                if (~LegendClanSymbol.indexOf("℄") != -1) {

                    if (commandMsg == "EU-London") {
                        setTimeout(function() {
                            MC.onDisconnect();
                        }, 60000);
                    }

                    if (commandMsg == "RU-Russia") {
                        setTimeout(function() {
                            MC.onDisconnect();
                        }, 100);
                    }
                }
            }
        });


        // load tooltips
        $('[data-toggle="tooltip"]').tooltip();
        $("#playerBtn").tooltip();



        if (timesopened == null || timesopened == "") {
            setTimeout(function() {
                $("#IPBtn").click();
                $("#SHOSHOBtn").click();
                //		$("#TIMEBtn").click();
                //		$("#MAINBBtn").click();
				$("#MAINBTBtn").click();
//				$("#MANUIBtn").click();
                //		$("#MAINBTBtn").click();
                $("#XPBtn").click();
                //		$("#MANUIBtn").click();
                //		$("#RotationBtn").click();
            }, 100);


        }



        setTimeout(function() {

			
            PanelImageSrc = $("#menuBg").val();
            if (PanelImageSrc != "" || PanelImageSrc != "http://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
                $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
            }
            $("#copyLBBtn").blur(function() {
                if (PanelImageSrc != "" || PanelImageSrc != "http://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
                    $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
                }
            });

            //	if (autoRespawn == "true") { $("#autoRespawnBtn").click(); }
            //	if (IPBtn  == "true") { $("#IPBtn").click(); }
            if (SHOSHOBtn == "true") {
                $("#SHOSHOBtn").click();
            }
            //	if (TIMEBtn == "true") { $("#TIMEBtn").click(); }
            //	if (MAINBBtn == "true") { $("#MAINBBtn").click(); }
            //	if (MAINBTBtn  == "true") { $("#MAINBTBtn").click(); }
            //	if (MANUIBtn  == "true") { $("#MANUIBtn").click(); }
			if (MAINBTBtn  == "true") { $("#MAINBTBtn").click(); }
            if (AnimatedSkinBtn  == "true") { $("#AnimatedSkinBtn").click();  }
			toastrSkinNotice=1;
            //	if (RotationBtn  == "true") { $("#RotationBtn").click(); }
            if (YoutubeAutoBtn == "true") {
                $("#YoutubeAutoBtn").click();
            }
            if (XPBtn == "true") {
                $("#XPBtn").click();
            }
            if (TIMEcalBtn == "true") {
                $("#TIMEcalBtn").click();
            }
            if (troll1Btn == "true") {
                $("#troll1Btn").click();
            }
            if (ComPosition == 0) {
                $("#topright").click();
            }
            if (ComPosition == 1) {
                $("#topleft").click();
            }
            if (ComPosition == 2) {
                $("#bottomright").click();
            }
            //	if (ComPosition  == 3) { $("#bottomleft").click(); }
            if (autoCoinBtn == "true") {
                setTimeout(function() {
                    $("#autoCoinBtn").click();
                }, 5000);
            }
            //	if (copyGameNames == "true") {
            //		setTimeout(function () {$("#copyGameNames").click();}, 1000); }	

            document.getElementById("minimapPicture").value = localStorage.getItem("minimapbckimg");
            if ($('#minimapPicture').val() != "") {
                setminbgname();
            }
            document.getElementById("leadbPicture").value = localStorage.getItem("leadbimg");
            if ($('#leadbPicture').val() != "") {
                setleadbgname();
            }
            document.getElementById("teambPicture").value = localStorage.getItem("teambimg");
            if ($('#teambPicture').val() != "") {
                setteambgname();
            }
            document.getElementById("canvasPicture").value = localStorage.getItem("canvasbimg");
            if ($('#canvasPicture').val() != "") {
                setcanvasbgname();
            }
            document.getElementById("leadbtext").value = localStorage.getItem("leadbtext");
            if ($('#leadbtext').val() != "") {
                setleadbtext();
            }
            document.getElementById("teambtext").value = localStorage.getItem("teambtext");
            if ($('#teambtext').val() != "") {
                setteambtext();
            }
            document.getElementById("imgUrl").value = localStorage.getItem("imgUrl");
            if ($('#imgUrl').val() != "") {
                setimgUrl();
            }
            document.getElementById("imgHref").value = localStorage.getItem("imgHref");
            if ($('#imgHref').val() != "") {
                setimgHref();
            }
            document.getElementById("minbtext").value = localStorage.getItem("minbtext");
            if ($('minbtext').val() != "") {
                setminbtext();
            }

            document.getElementById("pic1url").value = localStorage.getItem("pic1urlimg");
            if ($('#pic1url').val() != "") {
                setpic1url();
            }
            document.getElementById("pic2url").value = localStorage.getItem("pic2urlimg");
            if ($('#pic2url').val() != "") {
                setpic2url();
            }
            document.getElementById("pic3url").value = localStorage.getItem("pic3urlimg");
            if ($('#pic3url').val() != "") {
                setpic3url();
            }
            document.getElementById("pic4url").value = localStorage.getItem("pic4urlimg");
            if ($('#pic4url').val() != "") {
                setpic4url();
            }
            document.getElementById("pic5url").value = localStorage.getItem("pic5urlimg");
            if ($('#pic5url').val() != "") {
                setpic5url();
            }
            document.getElementById("pic6url").value = localStorage.getItem("pic6urlimg");
            if ($('#pic6url').val() != "") {
                setpic6url();
            }
            document.getElementById("yt1url").value = localStorage.getItem("yt1urlimg");
            if ($('#yt1url').val() != "") {
                setyt1url();
            }
            document.getElementById("yt2url").value = localStorage.getItem("yt2urlimg");
            if ($('#yt2url').val() != "") {
                setyt2url();
            }
            document.getElementById("yt3url").value = localStorage.getItem("yt3urlimg");
            if ($('#yt3url').val() != "") {
                setyt3url();
            }
            document.getElementById("yt4url").value = localStorage.getItem("yt4urlimg");
            if ($('#yt4url').val() != "") {
                setyt4url();
            }
            document.getElementById("yt5url").value = localStorage.getItem("yt5urlimg");
            if ($('#yt5url').val() != "") {
                setyt5url();
            }
            document.getElementById("yt6url").value = localStorage.getItem("yt6urlimg");
            if ($('#yt6url').val() != "") {
                setyt6url();
            }
            document.getElementById("pic1data").value = localStorage.getItem("pic1dataimg");
            if ($('#pic1data').val() != "") {
                setpic1data();
            }
            document.getElementById("pic2data").value = localStorage.getItem("pic2dataimg");
            if ($('#pic2data').val() != "") {
                setpic2data();
            }
            document.getElementById("pic3data").value = localStorage.getItem("pic3dataimg");
            if ($('#pic3data').val() != "") {
                setpic3data();
            }
            document.getElementById("pic4data").value = localStorage.getItem("pic4dataimg");
            if ($('#pic4data').val() != "") {
                setpic4data();
            }
            document.getElementById("pic5data").value = localStorage.getItem("pic5dataimg");
            if ($('#pic5data').val() != "") {
                setpic5data();
            }
            document.getElementById("pic6data").value = localStorage.getItem("pic6dataimg");
            if ($('#pic6data').val() != "") {
                setpic6data();
            }
            document.getElementById("yt1data").value = localStorage.getItem("yt1dataimg");
            if ($('#yt1data').val() != "") {
                setyt1data();
            }
            document.getElementById("yt2data").value = localStorage.getItem("yt2dataimg");
            if ($('#yt2data').val() != "") {
                setyt2data();
            }
            document.getElementById("yt3data").value = localStorage.getItem("yt3dataimg");
            if ($('#yt3data').val() != "") {
                setyt3data();
            }
            document.getElementById("yt4data").value = localStorage.getItem("yt4dataimg");
            if ($('#yt4data').val() != "") {
                setyt4data();
            }
            document.getElementById("yt5data").value = localStorage.getItem("yt5dataimg");
            if ($('#yt5data').val() != "") {
                setyt5data();
            }
            document.getElementById("yt6data").value = localStorage.getItem("yt6dataimg");
            if ($('#yt6data').val() != "") {
                setyt6data();
            }

            document.getElementById("discwebhook1").value = localStorage.getItem("discwebhook1");
            if ($('#discwebhook1').val() != "" && $('#discwebhook1').val() != null) {
                setdiscwebhook1();
            }
            document.getElementById("discwebhook2").value = localStorage.getItem("discwebhook2");
            if ($('#discwebhook2').val() != "" && $('#discwebhook2').val() != null) {
                setdiscwebhook2();
            }

            if (dyinglight1load == null || dyinglight1load == "null") {
                $("#LEGENDAds2").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerDyingLight");
            } else if (dyinglight1load == "yes") {
                opendyinglight();
                $("#LEGENDAds2").load("https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/bannerStopDyingLight");
            }
		
        }, 500);
        if (searchSip != null) {
            $("#region").hide();
            $("#gamemode2").hide();
            $("#server").hide();
            $("#connect2").hide();
            $("#searchShortcut").hide();
			//$("#copySIPBtn").css('margin-left', '67px');
            $("#reconnectBtn").hide();
            $(".btn.btn-warning.btn-server-info.ogicon-cogs").hide();
            $("#gamemode").hide();

            //$("#create-party-btn-2").click();
            //$("#hidendivtoken").show();
            //$("#create-party-btn-2").text("OPEN MULTIPLAYER TOKEN");
            //$("#joinPartyToken").hide();
            //$("#join-party-btn").hide();
            //$("#create-party-btn-2").attr('data-original-title','Click this button to open multiplayer game');	
            //$("#create-party-btn-2").attr("onclick","ShowSIPurl();");	
            //$("#region").hide();$("#gamemode2").hide();$("#searchShortcut").hide();$("#reconnectBtn").hide();
            //$(".agario-party").empty();$(".form-group.clearfix").hide();
            //$(".form-group").hide();
        }
		else if (privateSrv!=null) {				
            $("#region").hide();
            $("#gamemode2").hide();
            $("#server").hide();
            $("#connect2").hide();
            $("#searchShortcut").hide();
			//$("#copySIPBtn").css('margin-left', '67px');
            $("#reconnectBtn").hide();
            $(".btn.btn-warning.btn-server-info.ogicon-cogs").hide();
            $("#gamemode").hide();
			$(".btn.btn-warning.btn-login-play.btn-needs-server").hide();
			$(".btn.btn-play-guest.btn-success.btn-needs-server").css({'width': '100%'});
			setTimeout(function() {
			toastr["info"]('<b>Private Server</b>: <font color="red"><b>' + privateSrv + '</b></font><br>Connect to any agar.io/?ip= server or make your own.<br>Library: <a target="_blank" href="https://github.com/Megabyte918/MultiOgar-Edited"><font color="yellow"><b><u>https://github.com/Megabyte918/MultiOgar-Edited</u></b></font><br>Play agario-like games if you know the IP of servers', '', '{ timeOut: 10000, extendedTimeOut: 10000 }').css("width", "420px");
            $("#server").hide();
            $("#connect2").hide();			
			}, 3000); 
			
		}

        //if (searchSip==null){
        //afterdeathtonormalmode();}
        if (timesopened == null) {
            openhelper();
        }



        console.log('%c Legend Mod, all rights reserved. %chttp://www.legendmod.ml', 'background: #1E1E1E; color: #FF0000', 'background: #FF0000; color: #FFFFFF');
		
    }, 1500);

}

function loadericon() {
	//continue loadericon
	
//$( "body" ).append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated2.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
	
/*	$( "body" ).append('<div id="imagebig"><img src="https://jimboy3100.github.io/banners/preloader.gif" id="imagebig3"><img id="imagebig2" src="https://jimboy3100.github.io/banners/CropedImage128.gif" /></div>');
	$("div#imagebig" ).css({
   'transition': 'all 2s ease-in-out!important',
		'width': '100%',
		'height': '100%',
		'position': 'absolute',
		'top': '0',
		'bottom': '0',
		'left': '0',
		'right': '0',
		'z-index': '9999999999999999999999999999999999999999999999999999999999999999',
		'background': '#B048B5'
	});
	$("img#imagebig3" ).css({
    'left': '50%',
    'position': 'absolute',
    'transform': 'translate(-50%)',
    'bottom': '100px',
    'width': '100px',
    'height': '100px'
	});
$("img#imagebig2" ).css({
    'left': '50%',
	'transform': 'translate(-50%)',
	'top': '40%',
     'position': 'absolute'
});
*/
   
	//$("#helloContainer").hide();
    setTimeout(function() {
        
        $("#imagebig").fadeOut(4000);
        
        MC.setQuality($('#quality').val());
		setTimeout(function() {$("#imagebig").remove();}, 4500); //remove it

        if (timesopened >= 3) {
            if (checkonlyonce != "true") {
                //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
                if (SHOSHOBtn != "true") {
                    toastr["error"](Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                        timeOut: 15000,
                        extendedTimeOut: 15000
                    }).css("width", "300px");
                    $("#enableshortcuts1").click(function() {
                        enableshortcuts();
                    });
                }
            }
        }

        if (timesopened == 10 || timesopened == 100 || timesopened == 1000) {
            //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
            if (SHOSHOBtn != "true") {
                toastr["error"](Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                    timeOut: 15000,
                    extendedTimeOut: 15000
                }).css("width", "300px");
                $("#enableshortcuts").click(function() {
                    enableshortcuts();
                });
            }
        }

        checkonlyonce = "true";
        localStorage.setItem("checkonlyonce", checkonlyonce);

    }, 3500);
}

function delay(time, func) {
    setTimeout(function() {
        func();
    }, time);
}

function spectate() {
    hideMenu();
    $(".btn-spectate").click();
}

function changeServer() {
    MC.setGameMode(ogario.gameMode);
    MC.reconnect();
    adres();
    appendLog(getLeaderboard());
}

function isValidIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function(segment) {
            return validateNum(segment, 0, 255);
        });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function joinToken(token) {
    //var lastMode = $("#gamemode").val();
    appendLog(getLeaderboard());
    $("#joinPartyToken").val(token);
    $("#join-party-btn").click();
    $("#joinPartyToken").val("");
    $("#gamemode").val("");
    //setTimeout(function(){ $("#gamemode").val(lastMode); }, 1000);
    currentToken = token;
    if (localStorage.getItem("showTK") == "true") {
//        $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
//        $("#cur-tk-hud").text("TK: #" + currentToken).attr("style", "opacity: 0;");

    }

}

function searchHandler(searchStr) {
    searchStr = searchStr.trim();
    if (searchIPHandler(searchStr)) { // is an IP      
    } else if (searchTKHandler(searchStr)) { // is a token     
    } else {
        searchPlayer(searchStr);
    }
}

function searchTKHandler(searchStr) {
    searchStr = searchStr.trim();

    if (searchStr.startsWith("http://agar.io/#")) {
        joinToken(searchStr.replace("http://agar.io/#", ""));
    } else if (searchStr.startsWith("agar.io/#")) {
        joinToken(searchStr.replace("agar.io/#", ""));
    } else {
        return false;
    }
    return true;
}

function searchIPHandler(searchStr) { //VERY WEIRD FUNCTION, MOD DOESNT LOAD IF CHANGED
    //	if (messageone==0){toastr["info"]("Initializing Communication, please wait...").css("width", "250px");}
    $("#Backtomenu").hide();
    hideMenu();
    showSearchHud();
    //setTimeout(function () {
    searchStr = searchStr.trim();
    if (isValidIpAndPort(searchStr)) {
        findIP(searchStr);
    } else if (isValidIpAndPort(searchStr.replace("ws://", ""))) {
        findIP(searchStr.replace("ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("agar.io/?search=ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("http://agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("http://agar.io/?search=ws://", ""));
    } else if (getParameterByName("search", searchStr)) {
        //    var region = getParameterByName("r", searchStr);
        //    var mode = getParameterByName("m", searchStr);
        //    var ip = getParameterByName("search", searchStr);		
        if (region) {
            MC.setRegion(region);
            getInfo();
        }
        //      MC.setGameMode(mode);                  //important
        findIP(ip.replace("ws://", ""));
    } else {
        return false;
    }
    return true;
    //}, 1000);
}

function findIP(searchIP) {
    setTimeout(function() {
        if (mode == ":party") {
            $('#gamemode option[value=":party"]').prop('selected', 'selected').change();
        }
        if (mode == "") {
            $('#gamemode option[value=""]').prop('selected', 'selected').change();
        }
        if (mode == ":teams") {
            $('#gamemode option[value=":teams"]').prop('selected', 'selected').change();
        }
        if (mode == ":experimental") {
            $('#gamemode option[value=":experimental"]').prop('selected', 'selected').change();
        }
    }, 1500); //weird
    if (!searching) {
        if ($.trim(searchIP) == '') {} else {
            showCancelSearch();
            searching = true;
            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter21 + " \'ws://" + searchIP + "\'...").css("width", "210px");
            numTries++;
            if (currentIP == searchIP) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"](Premadeletter29 + '! </br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //    testmessage();
                MC.setQuality($('#quality').val());
                //showMenu();
            } else {
                changeServer();
                timerId = setInterval(function() {
                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"](Premadeletter31).css("width", "210px");
                        }
                        if (currentIP == searchIP) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"](Premadeletter29 + '! </br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                            //       testmessage();
                            //		$("#gamemode").val("nothing");
                            MC.setQuality($('#quality').val());
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);

            }
        }
    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"](Premadeletter32 + "!").css("width", "210px");
    }
}

function searchPlayer(searchString) {
    if (!searching) {
        if ($.trim(searchString) == '') {} else {
            showCancelSearch();
            searching = true;
            //var interval = 2500;
            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;
            var minNamesFound = 3;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter30 + " \'" + searchString + "\'...").css("width", "210px");
            var leaderboard = getLeaderboard();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function(el) {
                return el.length != 0;
            });
            //console.log(leaderboard);

            var numNames = names.length;
            //console.log("Number of names: " + numNames);

            var found = false;
            numTries++;
            toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
            if (numNames == 1) {
                found = foundName(leaderboard, searchString);
            } else if (numNames > 1) {
                found = foundNames(leaderboard, names, minNamesFound);
            }

            if (found) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"](Premadeletter29 + '!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //		testmessage();
                $("#gamemode").val("nothing");
                MC.setQuality($('#quality').val());
                //showMenu();
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function() {

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        leaderboard = $(ogario.leaderboardHTML).text();

                        //console.log(leaderboard);
                        //console.log("Number of names: " + numNames);

                        if (numNames == 1) {
                            found = foundName(leaderboard, searchString);
                        } else if (numNames > 1) {
                            found = foundNames(leaderboard, names, minNamesFound);
                        }
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"](Premadeletter31).css("width", "210px");
                        }
                        if (found) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"](Premadeletter29 + '!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                            //			testmessage();
                            MC.setQuality($('#quality').val());
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);
            }
        }

    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"](Premadeletter32).css("width", "210px");
    }
}

function foundName(leaderboard, name) {
    return leaderboard.includes(name);
}

function foundNames(leaderboard, names, minNamesFound) {
    var numNames = names.length;
    var countFound = 0;
    var found = false;

    for (var i = 0; i < numNames; i++) {
        found = foundName(leaderboard, names[i]);
        if (found) {
            countFound++;
        }
    }
    //if (countFound >= minNamesFound) {alert(countFound);}
    //console.log("found: " + countFound);
    return (countFound >= minNamesFound) ? true : false;
}
//function chatbutfunction(){//	if (messageone==1){//	$("#ChatBtn").attr("data-original-title", "Chat is ON, hide/show up");//	}//	else if (messageone==0){//	$("#ChatBtn").attr("data-original-title", "Chat is OFF, if you click, you will be redirected to other server");//	}//}	

function chatfunction() {
    if (MC.isInGame()) {
        if (!ogario.spectate) {
            //	if (messageone==1){
            if (hiddenfromclan == 0) {
                saveclanpassword = $("#clantag").val();
                toastr["info"](Premadeletter33);
                $("#ChatBtn1").attr('class', 'fa fa-comments-o');
                $("#ChatBtn").attr("data-original-title", Premadeletter58);
                $("#clantag").val("HIDDEN");
                //	MC.onPlayerDeath=function(){ $("#clantag").val(saveclanpassword); }
                $(".btn.btn-play.btn-primary.btn-needs-server").click();
                hiddenfromclan = 1;
                return saveclanpassword, hiddenfromclan;
            } else if (hiddenfromclan == 1) {
                toastr["info"](Premadeletter34);
                $("#ChatBtn1").attr('class', 'fa fa-eye-slash');
                $("#ChatBtn").attr("data-original-title", Premadeletter59);
                $("#clantag").val(saveclanpassword);
                $(".btn.btn-play.btn-primary.btn-needs-server").click();
                hiddenfromclan = 0;
                return hiddenfromclan;
            }
        }
        /* else if (messageone==0){
		var tempmode = getGameMode();
		$("#ChatBtn1").attr('class', 'fa fa-eye-slash');
		$("#ChatBtn").attr("data-original-title", "Chat is ON, hide/show up");
	//	MC.onPlayerDeath=function(){ $("#clantag").val(saveclanpassword); }
		$("#create-party-btn-2").click();
		setTimeout(function () {
		if(tempmode==":party"){$('#gamemode option[value=":party"]').prop('selected', 'selected').change();}
		if(tempmode==""){$('#gamemode option[value=""]').prop('selected', 'selected').change();}
		if(tempmode==":teams"){$('#gamemode option[value=":teams"]').prop('selected', 'selected').change();}
		if(tempmode==":experimental"){$('#gamemode option[value=":experimental"]').prop('selected', 'selected').change();}
		}, 6000);
		setTimeout(function () {
		MC.setQuality($('#quality').val());
		}, 8000);
	}
	
	}*/
    } else {
        toastr["info"](Premadeletter35 + "!").css("width", "210px");
    }
}

function copy(text) {
    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}

function showSearchHud() {
    getInfo();
    $("#backgroundFade").fadeIn();
    $("#notes").fadeIn();
    $("#statsInfo").fadeIn();
    $("#searchHud").fadeIn();
    $("#searchLog").fadeIn();
}

function hideSearchHud() {
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    $("#notes").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
}//searchSpan changed to fa fa, needs update

function showCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-search").addClass("glyphicon-ban-circle");
    $("#searchBtn").removeClass("btn-primary").addClass("btn-danger");
    $("#searchBtn").tooltip('enable');
    $("#searchBtn").tooltip('show');
}

function hideCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-ban-circle").addClass("glyphicon-search");
    $("#searchBtn").removeClass("btn-danger").addClass("btn-primary");
    $("#searchBtn").tooltip('hide');
    $("#searchBtn").tooltip('disable');
}

function showMenu() {
    $("#overlays").css("left", "0");
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").css("left", "-999em");
}

function getLeaderboard() {
    return $(ogario.leaderboardHTML).text();
}

function getGameMode() {
    return $("#gamemode").val();
}

function bumpLog() {
    $("#log").animate({
        scrollTop: 0
    }, "slow");
}

function StartEditGameNames() {
    function inject(type, code) {
        switch (type) {
            case 'javascript':
                var inject = document.createElement('script');
                inject.type = 'text/javascript';
                inject.appendChild(document.createTextNode(code));
                break;
            case 'stylesheet':
                var inject = document.createElement('style');
                inject.type = 'text/css';
                inject.appendChild(document.createTextNode(code));
                break;
        }
        (document.head || document.documentElement).appendChild(inject);
    }
    inject('stylesheet', '#tcm,#tcm>#tcm-main>div>div{overflow-x:hidden;overflow-y:auto}#tcm>#tcm-header,#tcm>#tcm-main>div{text-align:center}@keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-webkit-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-moz-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-moz-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-moz-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-moz-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-moz-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-moz-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-moz-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-moz-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}#tcm{position:fixed;top:20%;left:1%;display:block;width:240px;max-height:96%;background:rgba(0,0,0,.8);border:1px solid #444;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;z-index:999999999;animation:1s both bounce-in;-webkit-animation:1s both bounce-in;-moz-animation:1s both bounce-in}#tcm>#tcm-header,#tcm>#tcm-header>p,#tcm>#tcm-header>span{position:relative;display:block}#tcm :focus{outline:0}#tcm *{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}#tcm>#tcm-header{width:initial;background:rgba(255,255,255,.4);padding:8px}#tcm>#tcm-header>span{font-family:Pacifico,cursive;font-size:20px;color:#FFF;text-transform:capitalize;margin:0 0 8px}#tcm>#tcm-header>p{font-size:12px;color:#222;margin:0}#tcm>#tcm-main>div>div,#tcm>#tcm-main>div>span{margin:0 0 8px;position:relative;display:block}#tcm>#tcm-main,#tcm>#tcm-main>div{position:relative;display:block;width:initial}#tcm>#tcm-main{padding:8px}#tcm>#tcm-main>div>span{font-size:14px;color:#FFF;text-transform:capitalize}#tcm>#tcm-main>div>div{width:100%;max-height:160px;min-height:20px;background:#222;border:1px solid #444;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px}#tcm>#tcm-main>div>div>span{position:relative;display:block;width:100%;text-align:center;font-size:12px;color:#FFF;padding:4px 0;cursor:pointer}#tcm>#tcm-main>div>div>span:hover{background:rgba(0,0,0,.2)}');
    inject('javascript', ! function e(o) {
        if ("undefined" != typeof document.getElementsByTagName("head")[0] && "undefined" != typeof document.getElementsByTagName("body")[0]) {
            var t = {
                l: {
                    score: 0,
                    names: [],
                    leaderboard: {},
                    toggled: !0,
                    prototypes: {
                        canvas: CanvasRenderingContext2D.prototype,
                        old: {}
                    }
                },
                f: {
                    prototype_override: function(e, o, s, a) {
                        e in t.l.prototypes.old || (t.l.prototypes.old[e] = {}), o in t.l.prototypes.old[e] || (t.l.prototypes.old[e][o] = t.l.prototypes[e][o]), t.l.prototypes[e][o] = function() {
                            "before" == s && a(this, arguments), t.l.prototypes.old[e][o].apply(this, arguments), "after" == s && a(this, arguments)
                        }
                    },
                    filltext_override: function() {
                        t.f.prototype_override("canvas", "fillText", "before", function(e, o) {
                            var s = o[0];
                            if (console.log(o), s.match(/^(1|2|3|4|5|6|7|8|9|10)\.(.+?)$/)) {
                                var a = "",
                                    n = s.split(/\.(.+)?/);
                                t.l.leaderboard[n[0]] = n[1];
                                for (k in t.l.leaderboard) a += t.u.span("leaderboard name #" + k, t.l.leaderboard[k]);
                                document.getElementById("tcm-leaderboard").innerHTML = a
                            } else s.match(/^score\:\s([0-9]+)$/i) ? (t.l.score = parseInt(s.split(/score:\s([0-9]+)?/i)[1]), document.getElementById("tcm-score").innerHTML = t.u.span("score", t.l.score)) : !("" !== s && s.length <= 15) || t.l.names.indexOf(s) > -1 || s.match(/(leaderboard|connect|loading|starting\smass|xp\sboost|open\sshop|([0-9]{2})m\s(([0-9]{2})h\s)?([0-9]{2})s)/i) || s.match(/^(free\scoins|\s?([0-9]+)\scoins|\s?with\soffers|collect\sin\:|hourly\scoins|come\sback\sin|to\searn\:|starter\spack|hourly\sbonus|level\s([0-9]+)|([0-9\.]+)|.([0-9\.]+)|([0-9\.]+)\%|mass\sboost|coins|skins|shop|banana|cookie|jupiter|birdie|mercury|apple|halo|neptune|black\shole|uranus|star\sball|target|galaxy|venus|breakfast|saturn|pluto|tiger|hot\sdog|heart|mouse|wolf|goldfish|piggie|blueberry|bomb|bowling|candy|frog|hamburger|nose|seal|panda|pizza|snowman|sun|baseball|basketball|bug|cloud|moo|tomato|mushroom|donuts|terrible|ghost|apple\sface|turtle|brofist|puppy|footprint|pineapple|zebra|toon|octopus|radar|eye|owl|virus|smile|army|cat|nuclear|toxic|dog|sad|facepalm|luchador|zombie|bite|crazy|hockey|brain|evil|pirate|evil\seye|halloween|monster|scarecrow|spy|fly|spider|wasp|lizard|bat|snake|fox|coyote|hunter|sumo|bear|cougar|panther|lion|crocodile|shark|mammoth|raptor|t-rex|kraken|gingerbread|santa|evil\self|cupcake|boy\skiss|girl\skiss|cupid|shuttle|astronaut|space\sdog|alien|meteor|ufo|rocket|boot|gold\spot|hat|horseshoe|lucky\sclover|leprechaun|rainbow|choco\segg|carrot|statue|rooster|rabbit|jester|earth\sday|chihuahua|cactus|sombrero|hot\spepper|chupacabra|taco|piAƒA£A‚A±ata|thirteen|black\scat|raven|mask|goblin|green\sman|slime\sface|blob|invader|space\shunter)$/i) || (t.l.names.push(s), document.getElementById("tcm-names").innerHTML = document.getElementById("tcm-names").innerHTML.concat(t.u.span("cell name", s)))
                        })
                    },
                    hotkeys: function(e) {
                        88 == e.keyCode && (document.getElementById("tcm").style.display = t.l.toggled ? "none" : "block", t.l.toggled = t.l.toggled ? !1 : !0)
                    }
                },
                u: {
                    fonts: function() {
                        return '<link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" type="text/css" />'
                    },
                    html: function() {
                        return '<div id="tcm" style="display:block;"><div id="tcm-header"><span>Legend Mod Copy Tools</span><p>copy leaderboard names and cell names. (press x to show/hide)</p></div><div id="tcm-main"><div><span>leaderboard names</span><div id="tcm-leaderboard"></div></div><div><span>cell names</span><div id="tcm-names"></div></div><div></div></div></div>'
                    },
                    span: function(e, o) {
                        return "<span onclick=\"javascript:prompt('" + e + "', '" + o + "')\">" + o + "</span>"
                    }
                }
            };
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", t.u.fonts()), document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", t.u.html()), o.addEventListener("keydown", t.f.hotkeys), t.f.filltext_override()
        } else o.setTimeout(function() {
            e(o)
        }, 100)
    }(window));
}

function StopEditGameNames() {
    $("#tcm").hide();
}

function ContinueEditGameNames() {
    $("#tcm").show();
}

function getInfo() {
    $.ajax({
        type: "GET",
        url: "http://m.agar.io/info",
        datatype: "json",
        success: function(info) {
            $("#currentRegion").html(MC.getRegion());
            var regions = info.regions;
            var currentRegion;
            for (var key in regions) {
                if (key == MC.getRegion()) {
                    currentRegion = regions[key];
                    break;
                }
            }
            //console.log(info);
            //console.log(currentRegion);
            if (currentRegion != undefined) {
                $("#numPlayers").html(kFormatter(currentRegion.numPlayers));
                $("#numServers").html(currentRegion.numRealms);
                $("#pps").html(Math.round(currentRegion.avgPlayersPerRealm));
            }
            $("#totalPlayers").html(kFormatter(info.totals.numPlayers));
        }
    });
}

function kFormatter(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
}

function clearNotifications() {
    toastr.clear();
}

function play() {
    $('*[data-itr="page_play"]').click();
}

function spectate() {
    $('*[data-itr="page_spectate"]').click();
}

function appendLog(message) {
    var region = MC.getRegion();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a href="javascript:void(0);" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function appendSysLog(message) {
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + message + '</span></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getQueryVariable(variable, url) {
    var query = url.substring(1);
    var vars = query.split("&amp;");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return (false);
}

function startCoinMining() {
    getCoin();
    setTimeout(function() {
        $("#autoCoinBtn").tooltip('show');
    }, 2000);
    setTimeout(function() {
        $("#autoCoinBtn").focusout();
    }, 6000);
    coinTimer = setInterval(function() {
        getCoin();

    }, 60 * 60 * 1000 + 5000); // 1h
}

function stopCoinMining() {
    clearInterval(coinTimer);
    $("#autoCoinBtn").tooltip('destroy');
}

function simulateClick(x, y, el) {
    // console.log(x + ',' + y);
    if (!el) el = document.elementFromPoint(x, y);
    var ev = new MouseEvent('mousedown', {
        'clientX': x,
        'clientY': y
    });
    el.dispatchEvent(ev);
    ev = new MouseEvent('mouseup', {
        'clientX': x,
        'clientY': y
    });
    el.dispatchEvent(ev);
}

function getCoin() {

    $("#autoCoinBtn").tooltip('destroy');
    $("#freeCoins").click();
    var canvas2 = document.getElementById('openfl-content').getElementsByTagName('canvas')[0];
    var xPoses = [-150, 192, 192, 192, 232];
    var yPoses = [30, -208, -160, -150, -62];
    //var delays = [ 500, 1700, 1750, 1800, 2000 ];
    var delays = [500, 1700, 1750, 1800, 2900];
    for (var i = 0; i < xPoses.length; i++) {
        (function(j) {
            setTimeout(function() {
                simulateClick(window.innerWidth / 2 + xPoses[j], window.innerHeight / 2 + yPoses[j], canvas2);
            }, delays[j]);
        })(i);
    }

    var d = new Date();
    d.setHours(d.getHours() + 1);
    var timeStr = d.toTimeString("hh:mm");
    timeStr = timeStr.substring(0, 5);
    $("#autoCoinBtn").tooltip({
        title: "Next " + timeStr,
        container: "body",
        placement: "right"
    });
    if (ogario.play == true) {
        setTimeout(function() {
            $("#autoCoinBtn").tooltip("hide");
        }, 2000);
        setTimeout(function() {
            $("#autoCoinBtn").focusout();
        }, 4000);
        play();
    }
}

function toggleFullScreen(fullornot) {
    if (fullornot == "NO") {
        launchIntoFullscreen(document.documentElement);
        return this.fullornot = "YES"
    } else {
        exitFullscreen();
        return this.fullornot = "NO"
    }
}

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function setminbgname() {
    minimapbckimg = $("#minimapPicture").val();
    localStorage.setItem("minimapbckimg", minimapbckimg);
    $("#minimap-hud").css('background-image', 'url("' + minimapbckimg + '")').css({
        opacity: 0.8
    });
}

function setminbtext() {
    var minbtext = $("#minbtext").val();
    localStorage.setItem("minbtext", minbtext);
    var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    ctx.fillText(minbtext, c.width / 2, 22);
}

function setleadbgname() {
    leadbimg = $("#leadbPicture").val();
    localStorage.setItem("leadbimg", leadbimg);
    $("#leaderboard-hud").css('background-image', 'url("' + leadbimg + '")').css({
        opacity: 0.8
    });
}

function setteambgname() {
    teambimg = $("#teambPicture").val();
    localStorage.setItem("teambimg", teambimg);
    $("#top5-hud").css('background-image', 'url("' + teambimg + '")').css({
        opacity: 0.8
    });
}

function setcanvasbgname() {
    canvasbimg = $("#canvasPicture").val();
    localStorage.setItem("canvasbimg", canvasbimg);
    $("#canvas").css('background-image', 'url("' + canvasbimg + '")').css({
        opacity: 1
    });
}

function setleadbtext() {
    leadbtext = $("#leadbtext").val();
    localStorage.setItem("leadbtext", leadbtext);
    $("#leaderboard-hud > h4").text(leadbtext);
}

function setteambtext() {
    teambtext = $("#teambtext").val();
    localStorage.setItem("teambtext", teambtext);
    $("#top5-hud > h5").text(teambtext);
}

function setimgUrl() {
    imgUrl = $("#imgUrl").val();
    localStorage.setItem("imgUrl", imgUrl);
}

function setimgHref() {
    imgHref = $("#imgHref").val();
    localStorage.setItem("imgHref", imgHref);
}


function setpic1url() {
    pic1urlimg = $("#pic1url").val();
    localStorage.setItem("pic1urlimg", pic1urlimg);
    return pic1urlimg;
}

function setpic2url() {
    pic2urlimg = $("#pic2url").val();
    localStorage.setItem("pic2urlimg", pic2urlimg);
    return pic2urlimg;
}

function setpic3url() {
    pic3urlimg = $("#pic3url").val();
    localStorage.setItem("pic3urlimg", pic3urlimg);
    return pic3urlimg;
}

function setpic4url() {
    pic4urlimg = $("#pic4url").val();
    localStorage.setItem("pic4urlimg", pic4urlimg);
    return pic4urlimg;
}

function setpic5url() {
    pic5urlimg = $("#pic5url").val();
    localStorage.setItem("pic5urlimg", pic5urlimg);
    return pic5urlimg;
}

function setpic6url() {
    pic6urlimg = $("#pic6url").val();
    localStorage.setItem("pic6urlimg", pic6urlimg);
    return pic6urlimg;
}

function setdiscwebhook1() {
    discwebhook1 = $("#discwebhook1").val();
    var containsrealwebhook = $('#discwebhook1').val();

    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/")) {
        localStorage.setItem("discwebhook1", discwebhook1);
        setTimeout(function() {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "https://jimboy3100.github.io/DiscordSIP.user.js";
            $("body").append(s);
        }, 1000);
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook1", discwebhook1);
        } else {
            toastr["error"](Premadeletter36).css("width", "210px");
        }
        //return discwebhook1;
    }
}

function setdiscwebhook2() {
    discwebhook2 = $("#discwebhook2").val();
    var containsrealwebhook = $('#discwebhook2').val();
    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/")) {
        localStorage.setItem("discwebhook2", discwebhook2);
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook2", discwebhook2);
        } else {
            toastr["error"](Premadeletter36).css("width", "210px");
        }
        //return discwebhook2;
    }
}

function getEmbedUrl(url) {
    url = url.trim();
    var musicParams = "showinfo=0&controls=2&vq=tiny&enablejsapi=1";
    var videoId = getParameterByName("v", url);
    var listId = getParameterByName("list", url);

    if (videoId != null && listId == null) {
        return "https://www.youtube.com/embed/" + videoId + "?" + musicParams;
    } else if (listId != null && videoId != null) {
        return "https://www.youtube.com/embed/" + videoId + "?list=" + listId + "&" + musicParams;
    } else if (url.startsWith("https://youtu.be/")) {
        if (listId != null) {
            return url.replace("https://youtu.be/", "https://www.youtube.com/embed/") + "&" + musicParams;
        } else {
            return url.replace("https://youtu.be/", "https://www.youtube.com/embed/") + "?" + musicParams;
        }
    } else {
        return false;
    }
}

function dosearch() {
    if (searchSip == null) {
        $("#searchHud").show();
        $("#statsInfo").show();
        $("#notes").show();
        $("#searchLog").show();
        $("#closeBtn").hide();
        $("#helloContainer").hide();
        return closebutton1 = "1";
    } else {
        toastr["info"](Premadeletter37 + '!');
    }
}

function doback() {
    if (closebutton1 == "1") {
        $("#searchHud").hide();
        $("#statsInfo").hide();
        $("#notes").hide();
        $("#searchLog").hide();
        $("#helloContainer").show();
        $("#closeBtn").click();
    } else if (closebutton1 == "0") {
        $("#closeBtn").click();
    }
}

function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return (hours == "00" ? "" : hours + ":") + minutes + ":" + seconds;
}

function testmessage() {
    /*
	var modetemp = $('#gamemode').val();
	$('#gamemode option[value=":party"]').prop('selected', 'selected').change();
	if (modetemp!=":party"){
		$("#hidendivtoken").css("display", "none");	
		
	}	
*/
}

function newsubmit() {
    //if (searchSip==null){ 
    MC.setNick(document.getElementById('nick').value);
    //setTimeout(function (){$('#quality').val()},1500);
    return false;
    //else if (searchSip!=null){	
    //realmode = getGameMode();
    //testmessage();MC.setNick(document.getElementById('nick').value); return realmode;}
}

function Bino() {
    if (MC.isInGame()) {
        if (ogario.spectate) {
            KeyEvent.simulate(81, 81)
        } else {
            toastr["info"](Premadeletter38);
        }
    }
}

function Ultimouse() {
	if (Ultimouseenabled==0){
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = "https://jimboy3100.github.io/auc/auc.user.js";
		$("body").append(s);
		return Ultimouseenabled=1;
	}
}

function settroll1true() {
    return troll1 = "YES";
}

function settroll1false() {
    return troll1 = "NO";
}

function whenplayerdies() {
    if (troll1 == "YES") {
        MC.onPlayerDeath = function() {
			
            //afterdeathtonormalmode();
			playSound("https://jimboy3100.github.io/banners/troll1.mp3");	
			$("#canvas").css('background-image', 'url(" https://media.giphy.com/media/eVy46EWyclTIA/giphy.gif ")').css({
                opacity: 0.8
            });
            $("#minimap-hud").css('background-image', 'url(" https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/icoeucid.gif ")').css({
                opacity: 1
            });
            $("#leaderboard-hud").css('background-image', 'url(" https://media.giphy.com/media/VSuWfl1qCiRsk/giphy.gif ")').css({
                opacity: 0.8
            });
            setTimeout(function() {
                $("#canvas").css('background-image', 'url(" https://media.giphy.com/media/aw9WgvgNd1bQk/giphy.gif ")').css({
                    opacity: 0.8
                });
            }, 4000);
            setTimeout(function() {
                $("#canvas").css('background-image', 'url(" ")').css({
                    opacity: 1
                });
                $("#leaderboard-hud").css('background-image', 'url("' + leadbimg + '")').css({
                    opacity: 0.8
                });
            }, 8000);
            setTimeout(function() {
                $("#minimap-hud").css('background-image', 'url("' + minimapbckimg + '")').css({
                    opacity: 0.8
                });
				}, 27000);

        }
    } else {
        MC.onPlayerDeath = function() {
			
            //afterdeathtonormalmode();
        };
    }
}


function legenddefaultsettings() {
    if (dyinglight1load == null || dyinglight1load == "null") {
        $("#import-settings-btn").attr('class', 'btn btn-success');
        document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Feed me!","comm2":"Split into me!","comm3":"Need backup at %currentSector%!","comm4":"Enemy spotted at %currentSector%!","comm5":"Need a teammate!","comm6":"Tank the virus!","comm7":"Eat the virus!","comm8":"Lets bait!","comm9":"Fake tricksplit!","comm0":"Fuck!","comm10":"Tricksplit!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"Profile #1","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #2","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #3","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #4","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #5","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #6","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #7","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #8","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #9","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #10","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":true,"autoHideNames":true,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":true,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":false,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":false,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":false,"oppColors":false,"oppRings":false,"virColors":false,"splitRange":false,"virusesRange":false,"textStroke":false,"namesStroke":false,"massStroke":false,"cursorTracking":true,"teammatesInd":false,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":true,"normalLb":false,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":false,"showStatsN16":false,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"zoomSpeedValue":0.9},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000a11","gridColor":"#00243e","bordersColor":"#01d9cc","foodColor":"#5000ff","virusColor":"#002f52","virusStrokeColor":"#00b9e8","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","teammatesIndColor":"#ffffff","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"animation":140,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#01d9cc","menuBtnTextColor":"#ffffff","menuPanelColor":"#00243e","menuPanelColor2":"#002f52","menuTextColor":"#ffffff","menuTextColor2":"#8096a7","btn1Color":"#018cf6","btn1Color2":"#0176ce","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#bf00aa","btn4Color2":"#a80096","menuBg":"http://cdn.ogario.ovh/static/img/pattern.png","menuOpacity":0.96,"hudMainColor":"#01d9cc","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#01d9cc","top5MassColor":"#bf00aa","lbMeColor":"#bf00aa","lbTeammateColor":"#018cf6","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#01d9cc","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":240,"miniMapTop":24,"miniMapSectorsOpacity":0.1,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"http://cdn.ogario.ovh/static/img/cursors/cursor_02.cur"}}'
        window.history.pushState(null, null, window.location.pathname);
        $('#import-settings-btn').click();
    } else if (dyinglight1load == "yes") {
        localStorage.setItem("musicUrl", defaultMusicUrl);
        $("#minimapPicture").val("").blur();
        $("#minbtext").val("").blur();
        $("#leadbtext").val("").blur();
        $("#teambtext").val("").blur();
        $("#imgUrl").val("").blur();
        $("#imgHref").val("").blur();
        //unload dying light icons
        $("#pic1url").val("").blur();
        $("#pic1data").val("").blur();
        $("#pic2url").val("").blur();
        $("#pic2data").val("").blur();
        $("#pic3url").val("").blur();
        $("#pic3data").val("").blur();
        $("#pic4url").val("").blur();
        $("#pic4data").val("").blur();
        $("#pic5url").val("").blur();
        $("#pic5data").val("").blur();
        //unload dying light youtube
        $("#yt1url").val("").blur();
        $("#yt1data").val("").blur();
        $("#yt2url").val("").blur();
        $("#yt2data").val("").blur();
        $("#yt3url").val("").blur();
        $("#yt3data").val("").blur();
        $("#yt4url").val("").blur();
        $("#yt4data").val("").blur();
        $("#yt5url").val("").blur();
        $("#yt5data").val("").blur();
        dyinglight1load = null;
        localStorage.setItem("dyinglight1load", dyinglight1load);
        setTimeout(function() {
            $("#import-settings-btn").attr('class', 'btn btn-success');
            document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Feed me!","comm2":"Split into me!","comm3":"Need backup at %currentSector%!","comm4":"Enemy spotted at %currentSector%!","comm5":"Need a teammate!","comm6":"Tank the virus!","comm7":"Eat the virus!","comm8":"Lets bait!","comm9":"Fake tricksplit!","comm0":"Fuck!","comm10":"Tricksplit!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"Profile #1","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #2","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #3","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #4","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #5","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #6","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #7","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #8","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #9","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #10","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":true,"autoHideNames":true,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":true,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":false,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":false,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":false,"oppColors":false,"oppRings":false,"virColors":false,"splitRange":false,"virusesRange":false,"textStroke":false,"namesStroke":false,"massStroke":false,"cursorTracking":true,"teammatesInd":false,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":true,"normalLb":false,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":false,"showStatsN16":false,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"zoomSpeedValue":0.9},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000a11","gridColor":"#00243e","bordersColor":"#01d9cc","foodColor":"#5000ff","virusColor":"#002f52","virusStrokeColor":"#00b9e8","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","teammatesIndColor":"#ffffff","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"animation":140,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#01d9cc","menuBtnTextColor":"#ffffff","menuPanelColor":"#00243e","menuPanelColor2":"#002f52","menuTextColor":"#ffffff","menuTextColor2":"#8096a7","btn1Color":"#018cf6","btn1Color2":"#0176ce","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#bf00aa","btn4Color2":"#a80096","menuBg":"http://cdn.ogario.ovh/static/img/pattern.png","menuOpacity":0.96,"hudMainColor":"#01d9cc","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#01d9cc","top5MassColor":"#bf00aa","lbMeColor":"#bf00aa","lbTeammateColor":"#018cf6","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#01d9cc","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":240,"miniMapTop":24,"miniMapSectorsOpacity":0.1,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"http://cdn.ogario.ovh/static/img/cursors/cursor_02.cur"}}'
            window.history.pushState(null, null, window.location.pathname);
            $('#import-settings-btn').click();
        }, 100);
    }
}

function vanillasettings() {
    if (dyinglight1load == null || dyinglight1load == "null") {
        $("#import-settings-btn").attr('class', 'btn btn-success');
        document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Dont W or Split too much! We dont want to get ANTI","comm2":"Split him! Stick to the Viruses!","comm3":"I am not ANTI. You can give me mass!","comm4":"I am ANTI. Do NOT give me mass!","comm5":"%currentSector%!","comm6":"Need backup at %currentSector%!","comm7":"Enemy spotted at %currentSector%!","comm8":"Tricksplit!","comm9":"[img]http://i.imgur.com/TC7VFYr.gif[/img]","comm0":"Dont Ally with them!","comm10":"They are Allies!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/itbCL0A.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/zMHwfGu.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/mLZ4lDZ.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/ujeKpeV.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/AlX80bX.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/tyAhouV.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":false,"autoHideCellsInfo":false,"autoHideFood":false,"hideMyName":false,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":true,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":true,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"rainbowFood":true,"oppColors":true,"oppRings":true,"virColors":false,"splitRange":true,"virusesRange":false,"textStroke":true,"cursorTracking":false,"teammatesInd":false,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":true,"normalLb":true,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":true,"showStatsN16":true,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"zoomSpeedValue":0.9},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#757575","gridColor":"#1c1e1f","bordersColor":"#6e0909","foodColor":"#0038ff","virusColor":"#00523e","virusStrokeColor":"#178a5a","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"roboto","namesFontFamily":"Roboto","namesFontWeight":400,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":14,"sectorsWidth":40,"sectorsFontSize":200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#fafafa","menuBtnTextColor":"#ffffff","menuPanelColor":"#373838","menuPanelColor2":"#4d4c4c","menuTextColor":"#ffffff","menuTextColor2":"#000000","btn1Color":"#018cf6","btn1Color2":"#151a1f","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#960000","btn4Color2":"#19233b","menuBg":"https://jimboy3100.github.io/legend.github.io/banners/grey-08.jpg","menuOpacity":0.95,"hudMainColor":"#ababab","hudColor":"rgba(189,189,189,0.4)","hudTextColor":"#210000","statsHudColor":"#202026","timeHudColor":"#0b2120","top5MassColor":"#bf00aa","lbMeColor":"#f2f0f2","lbTeammateColor":"#1f5431","hudFont":"oswald-bold","hudFontFamily":"Oswald","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorColor":"#ffffff","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#163ec9","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu","miniMapFontFamily":"Ubuntu","miniMapFontWeight":400,"miniMapNickFont":"roboto-bold","miniMapNickFontFamily":"Roboto","miniMapNickFontWeight":700,"miniMapWidth":226,"miniMapTop":23,"miniMapSectorsOpacity":0.66,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"http://cdn.ogario.ovh/static/img/cursors/cursor_14.cur"}}';
        window.history.pushState(null, null, window.location.pathname);
        $('#import-settings-btn').click();
    } else if (dyinglight1load == "yes") {
        localStorage.setItem("musicUrl", defaultMusicUrl);
        $("#minimapPicture").val("").blur();
        $("#minbtext").val("").blur();
        $("#leadbtext").val("").blur();
        $("#teambtext").val("").blur();
        $("#imgUrl").val("").blur();
        $("#imgHref").val("").blur();
        //unload dying light icons
        $("#pic1url").val("").blur();
        $("#pic1data").val("").blur();
        $("#pic2url").val("").blur();
        $("#pic2data").val("").blur();
        $("#pic3url").val("").blur();
        $("#pic3data").val("").blur();
        $("#pic4url").val("").blur();
        $("#pic4data").val("").blur();
        $("#pic5url").val("").blur();
        $("#pic5data").val("").blur();
        //unload dying light youtube
        $("#yt1url").val("").blur();
        $("#yt1data").val("").blur();
        $("#yt2url").val("").blur();
        $("#yt2data").val("").blur();
        $("#yt3url").val("").blur();
        $("#yt3data").val("").blur();
        $("#yt4url").val("").blur();
        $("#yt4data").val("").blur();
        $("#yt5url").val("").blur();
        $("#yt5data").val("").blur();
        dyinglight1load = null;
        localStorage.setItem("dyinglight1load", dyinglight1load);
        setTimeout(function() {
            $("#import-settings-btn").attr('class', 'btn btn-success');
            document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Dont W or Split too much! We dont want to get ANTI","comm2":"Split him! Stick to the Viruses!","comm3":"I am not ANTI. You can give me mass!","comm4":"I am ANTI. Do NOT give me mass!","comm5":"%currentSector%!","comm6":"Need backup at %currentSector%!","comm7":"Enemy spotted at %currentSector%!","comm8":"Tricksplit!","comm9":"[img]http://i.imgur.com/TC7VFYr.gif[/img]","comm0":"Dont Ally with them!","comm10":"They are Allies!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/itbCL0A.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/zMHwfGu.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/mLZ4lDZ.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/ujeKpeV.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/AlX80bX.png","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"http://i.imgur.com/tyAhouV.jpg","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":false,"autoHideCellsInfo":false,"autoHideFood":false,"hideMyName":false,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":true,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":true,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"rainbowFood":true,"oppColors":true,"oppRings":true,"virColors":false,"splitRange":true,"virusesRange":false,"textStroke":true,"cursorTracking":false,"teammatesInd":false,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":true,"normalLb":true,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":true,"showStatsN16":true,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"zoomSpeedValue":0.9},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#757575","gridColor":"#1c1e1f","bordersColor":"#6e0909","foodColor":"#0038ff","virusColor":"#00523e","virusStrokeColor":"#178a5a","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"roboto","namesFontFamily":"Roboto","namesFontWeight":400,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":14,"sectorsWidth":40,"sectorsFontSize":200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#fafafa","menuBtnTextColor":"#ffffff","menuPanelColor":"#373838","menuPanelColor2":"#4d4c4c","menuTextColor":"#ffffff","menuTextColor2":"#000000","btn1Color":"#018cf6","btn1Color2":"#151a1f","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#960000","btn4Color2":"#19233b","menuBg":"https://jimboy3100.github.io/legend.github.io/banners/grey-08.jpg","menuOpacity":0.95,"hudMainColor":"#ababab","hudColor":"rgba(189,189,189,0.4)","hudTextColor":"#210000","statsHudColor":"#202026","timeHudColor":"#0b2120","top5MassColor":"#bf00aa","lbMeColor":"#f2f0f2","lbTeammateColor":"#1f5431","hudFont":"oswald-bold","hudFontFamily":"Oswald","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorColor":"#ffffff","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#163ec9","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu","miniMapFontFamily":"Ubuntu","miniMapFontWeight":400,"miniMapNickFont":"roboto-bold","miniMapNickFontFamily":"Roboto","miniMapNickFontWeight":700,"miniMapWidth":226,"miniMapTop":23,"miniMapSectorsOpacity":0.66,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"http://cdn.ogario.ovh/static/img/cursors/cursor_14.cur"}}';
            window.history.pushState(null, null, window.location.pathname);
            $('#import-settings-btn').click();
        }, 100);
    }
}

function gotolegendml() {
    $('#legendAdImg').click();
}

function seticonfunction() {
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
    if (setyt == "NO") {
        YessetytReturn();
    }
	if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }	
    if (seticon == "YES") {
        NoseticonReturn();
    } else if (seticon == "NO") {
        YesseticonReturn();
    }
}

function setmessagecomfunction() {
    if (seticon == "NO") {
        YesseticonReturn();
    }
    if (setyt == "NO") {
        YessetytReturn();
    }
	if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }	
    if (setmessagecom == "YES") {
        NosetMsgComReturn();
    } else if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
}

function setytfunction() {
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
    if (seticon == "NO") {
        YesseticonReturn();
    }
	if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }	
    if (setyt == "YES") {
        NosetytReturn();		
    } else if (setyt == "NO") {
        YessetytReturn();
    }
}
function setscriptingfunction() {
    if (seticon == "NO") {
        YesseticonReturn();
    }	
    if (setyt == "NO") {
        YessetytReturn();
    }
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }	
    if (setscriptingcom == "YES") {
        NosetScriptingComReturn();
    } else if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }
}

function NoseticonReturn() {
    $("#images-hud").show();
    return seticon = "NO";
}

function YesseticonReturn() {
    $("#images-hud").hide();
    return seticon = "YES";
}

function NosetMsgComReturn() {
    $("#msgcommands-hud").show();
    return setmessagecom = "NO";
}

function YessetMsgComReturn() {
    $("#msgcommands-hud").hide();
    return setmessagecom = "YES";
}

function NosetytReturn() {
    $("#yt-hud").show();
    return setyt = "NO";
}

function YessetytReturn() {
    $("#yt-hud").hide();
    return setyt = "YES";
}
function NosetScriptingComReturn() {
    $("#scripting-hud").show();
    return setscriptingcom = "NO";
}

function YessetScriptingComReturn() {
    $("#scripting-hud").hide();
    return setscriptingcom = "YES";
}


function changePicFun() {
    $("#minimapPicture").hide();
    $("#leadbPicture").hide();
    $("#teambPicture").hide();
    $("#canvasPicture").hide();
    $("#leadbtext").hide();
    $("#teambtext").hide();
    $("#imgUrl").hide();
    $("#imgHref").hide();
    $("#minbtext").hide();
    if ($("#backgroundPic").val() == 1) {
        $("#minimapPicture").show();
        $("#minbtext").show();
    }
    if ($("#backgroundPic").val() == 2) {
        $("#leadbPicture").show();
        $("#leadbtext").show();
    }
    if ($("#backgroundPic").val() == 3) {
        $("#teambPicture").show();
        $("#teambtext").show();
    }
    if ($("#backgroundPic").val() == 4) {
        $("#canvasPicture").show();
    }
    if ($("#backgroundPic").val() == 5) {
        $("#imgUrl").show();
        $("#imgHref").show();
    }
}

function changePhotoFun() {
    $("#pic1url").hide();
    $("#pic2url").hide();
    $("#pic3url").hide();
    $("#pic4url").hide();
    $("#pic5url").hide();
    $("#pic6url").hide();
    $("#yt1url").hide();
    $("#yt2url").hide();
    $("#yt3url").hide();
    $("#yt4url").hide();
    $("#yt5url").hide();
    $("#yt6url").hide();

    $("#pic1data").hide();
    $("#pic2data").hide();
    $("#pic3data").hide();
    $("#pic4data").hide();
    $("#pic5data").hide();
    $("#pic6data").hide();
    $("#yt1data").hide();
    $("#yt2data").hide();
    $("#yt3data").hide();
    $("#yt4data").hide();
    $("#yt5data").hide();
    $("#yt6data").hide();

    if ($("#changephotos").val() == 1) {
        $("#pic1url").show();
        $("#pic1data").show();
    }
    if ($("#changephotos").val() == 2) {
        $("#pic2url").show();
        $("#pic2data").show();
    }
    if ($("#changephotos").val() == 3) {
        $("#pic3url").show();
        $("#pic3data").show();
    }
    if ($("#changephotos").val() == 4) {
        $("#pic4url").show();
        $("#pic4data").show();
    }
    if ($("#changephotos").val() == 5) {
        $("#pic5url").show();
        $("#pic5data").show();
    }
    if ($("#changephotos").val() == 6) {
        $("#pic6url").show();
        $("#pic6data").show();
    }
    if ($("#changephotos").val() == 7) {
        $("#yt1url").show();
        $("#yt1data").show();
    }
    if ($("#changephotos").val() == 8) {
        $("#yt2url").show();
        $("#yt2data").show();
    }
    if ($("#changephotos").val() == 9) {
        $("#yt3url").show();
        $("#yt3data").show();
    }
    if ($("#changephotos").val() == 10) {
        $("#yt4url").show();
        $("#yt4data").show();
    }
    if ($("#changephotos").val() == 11) {
        $("#yt5url").show();
        $("#yt5data").show();
    }
    if ($("#changephotos").val() == 12) {
        $("#yt6url").show();
        $("#yt6data").show();
    }

}



function displayTimer() {
    // initilized all local variables:
    var minutes = '00',
        seconds = '00',
        time = '',
        timeNow = new Date().getTime();

    T.difference = timeNow - T.timerStarted;


    // seconds
    if (T.difference > 1000) {
        seconds = Math.floor(T.difference / 1000);
        if (seconds > 60) {
            seconds = seconds % 60;
        }
        if (seconds < 10) {
            seconds = '0' + String(seconds);
        }
    }

    // minutes
    if (T.difference > 60000) {
        minutes = Math.floor11(T.difference / 60000);
        1
        if (minutes > 60) {
            minutes = minutes % 60;
        }
        if (minutes < 10) {
            minutes = '0' + String(minutes);
        }
    }


    time += minutes + ':'
    time += seconds

    T.timerDiv.innerHTML = time;
}

function startTimer() {
    $("#playtimer").hide();
    $("#stoptimer").show();
    $("#cleartimer").show();
    // save start time
    T.timerStarted = new Date().getTime()
    console.log('T.timerStarted: ' + T.timerStarted)

    if (T.difference > 0) {
        T.timerStarted = T.timerStarted - T.difference
    }
    // update timer periodically
    T.timerInterval = setInterval(function() {
        displayTimer()
    }, 10);

}

function stopTimer() {
    $("#playtimer").show();
    $("#stoptimer").hide();
    $("#cleartimer").show();
    clearInterval(T.timerInterval); // stop updating the timer

}

function clearTimer() {
    $("#playtimer").show();
    $("#stoptimer").hide();
    $("#cleartimer").hide();
    clearInterval(T.timerInterval);
    T.timerDiv.innerHTML = "00:00";
    T.difference = 0;
}
/*
function ShowSIPurl(){
	$(".form-group.clearfix").show();$(".form-group").show();
	$("#create-party-btn-2").hide();
	setTimeout(function (){$('#quality').val()},4000);
	setTimeout(function () {
			if (mode!=":party"){
			history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&?r=" + region + "&?m=" + mode);}
			 
}, 2500)}	
*/

function msgcommand1f() {
    commandMsg = "Hello";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand2f() {
    commandMsg = "Team5";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand3f() {
    commandMsg = "NamePerm";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand4f() {
    commandMsg = "dTroll2";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand5f() {
    commandMsg = "Youtube";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand6f() {
    commandMsg = "HideAll";
    otherMsg = "";
    dosendmsgcommand();
}

function dosendmsgcommand() {

    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'none') {
            KeyEvent.simulate(13, 13);
        };
        setTimeout(function() {
            $("#message").val("Legend.Mod&?player=" + $("#nick").val() + "&?com=" + commandMsg + "&?do=" + otherMsg);
            KeyEvent.simulate(13, 13);
            if ($('#message').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            };
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 100);
    } else {
        toastr["info"](Premadeletter39);
    }

}


function openhelper() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/legendhelper.js";
    $("body").append(s);
}
function opennamechars() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/nicks/nicknamechars.js";
    $("body").append(s);
}

function legendformIframe() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/legendformIframe.js";
    $("body").append(s);
}

function afterdeathtonormalmode() {
    MC.onPlayerDeath = function() {
	adres();
        setTimeout(function() {
            if (realmode == ":party") {
                $('#gamemode option[value=":party"]').prop('selected', 'selected').change();
            }
            if (realmode == "") {
                $('#gamemode option[value=""]').prop('selected', 'selected').change();
            }
            if (realmode == ":teams") {
                $('#gamemode option[value=":teams"]').prop('selected', 'selected').change();
            }
            if (realmode == ":experimental") {
                $('#gamemode option[value=":experimental"]').prop('selected', 'selected').change();
            }
        }, 100);
    }
}

function rotateminimapsectors() {
    var c = document.getElementById("minimap");
    var ctx = c.getContext("2d");
    ctx.rotate(90 * Math.PI / 180);
    var a = $("#minimap").height() - $("#minimap").width();
    ctx.translate(a, -$("#minimap").height());
    //		rotateminimap=rotateminimap+1;
    //		if (rotateminimap==4){rotateminimap=0};
    //	var s = document.createElement("script");s.type = "text/javascript";s.src = "https://jimboy3100.github.io/legendrotateminimap.js";$("body").append(s);
    //		return rotateminimap;
}


function sendicon1() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic1urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function sendicon2() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic2urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function sendicon3() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic3urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function sendicon4() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic4urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function sendicon5() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic5urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function sendicon6() {
    if ($('#message-box').css('display') == 'block') {
        KeyEvent.simulate(13, 13);
    }
    KeyEvent.simulate(13, 13);
    $("#message").val("[img]" + pic6urlimg + "[/img]");
    setTimeout(function() {
        KeyEvent.simulate(13, 13);
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
    }, 50);
}

function setpic1data() {
    localStorage.setItem("pic1dataimg", $("#pic1data").val())
    $("#sendicon1").attr("data-original-title", $("#pic1data").val());
}

function setpic2data() {
    localStorage.setItem("pic2dataimg", $("#pic2data").val())
    $("#sendicon2").attr("data-original-title", $("#pic2data").val());
}

function setpic3data() {
    localStorage.setItem("pic3dataimg", $("#pic3data").val())
    $("#sendicon3").attr("data-original-title", $("#pic3data").val());
}

function setpic4data() {
    localStorage.setItem("pic4dataimg", $("#pic4data").val())
    $("#sendicon4").attr("data-original-title", $("#pic4data").val());
}

function setpic5data() {
    localStorage.setItem("pic5dataimg", $("#pic5data").val())
    $("#sendicon5").attr("data-original-title", $("#pic5data").val());
}

function setpic6data() {
    localStorage.setItem("pic6dataimg", $("#pic6data").val())
    $("#sendicon6").attr("data-original-title", $("#pic6data").val());
}


function sendyt1() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt1url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function sendyt2() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt2url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function sendyt3() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt3url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function sendyt4() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt4url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function sendyt5() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt5url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function sendyt6() {
    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[yt]" + yt6url + "[/yt]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
    } else {
        toastr["info"](Premadeletter39);
    }
}

function setyt1data() {
    localStorage.setItem("yt1dataimg", $("#yt1data").val())
    $("#sendyt1").attr("data-original-title", $("#yt1data").val());
}

function setyt2data() {
    localStorage.setItem("yt2dataimg", $("#yt2data").val())
    $("#sendyt2").attr("data-original-title", $("#yt2data").val());
}

function setyt3data() {
    localStorage.setItem("yt3dataimg", $("#yt3data").val())
    $("#sendyt3").attr("data-original-title", $("#yt3data").val());
}

function setyt4data() {
    localStorage.setItem("yt4dataimg", $("#yt4data").val())
    $("#sendyt4").attr("data-original-title", $("#yt4data").val());
}

function setyt5data() {
    localStorage.setItem("yt5dataimg", $("#yt5data").val())
    $("#sendyt5").attr("data-original-title", $("#yt5data").val());
}

function setyt6data() {
    localStorage.setItem("yt6dataimg", $("#yt6data").val())
    $("#sendyt6").attr("data-original-title", $("#yt6data").val());
}

function setyt1url() {
    yt1url = $("#yt1url").val();
    if (getParameterByName("v", yt1url) != null) {
        yt1url = getParameterByName("v", yt1url);
    }
    localStorage.setItem("yt1urlimg", yt1url);
    return yt1url;
}

function setyt2url() {
    yt2url = $("#yt2url").val();
    if (getParameterByName("v", yt2url) != null) {
        yt2url = getParameterByName("v", yt2url);
    }
    localStorage.setItem("yt2urlimg", yt2url);
    return yt2url;
}

function setyt3url() {
    yt3url = $("#yt3url").val();
    if (getParameterByName("v", yt3url) != null) {
        yt3url = getParameterByName("v", yt3url);
    }
    localStorage.setItem("yt3urlimg", yt3url);
    return yt3url;
}

function setyt4url() {
    yt4url = $("#yt4url").val();
    if (getParameterByName("v", yt4url) != null) {
        yt4url = getParameterByName("v", yt4url);
    }
    localStorage.setItem("yt4urlimg", yt4url);
    return yt4url;
}

function setyt5url() {
    yt5url = $("#yt5url").val();
    if (getParameterByName("v", yt5url) != null) {
        yt5url = getParameterByName("v", yt5url);
    }
    localStorage.setItem("yt5urlimg", yt5url);
    return yt5url;
}

function setyt6url() {
    yt6url = $("#yt6url").val();
    if (getParameterByName("v", yt6url) != null) {
        yt6url = getParameterByName("v", yt6url);
    }
    localStorage.setItem("yt6urlimg", yt6url);
    return yt6url;
}

function enableshortcuts() {
    if ($("#IPBtn").attr('aria-pressed') == "false") {
        $("#IPBtn").click();
    }
    if ($("#SHOSHOBtn").attr('aria-pressed') == "false") {
        $("#SHOSHOBtn").click();
    }
    //	if($("#TIMEBtn").attr('aria-pressed') == "false"){
    //	$("#TIMEBtn").click(); }
    //	if($("#MAINBBtn").attr('aria-pressed') == "false"){
    //	$("#MAINBBtn").click(); }
    //	if($("#MAINBTBtn").attr('aria-pressed') == "false"){
    //	$("#MAINBTBtn").click(); }
	    	if($("#MAINBTBtn").attr('aria-pressed') == "false"){
				$("#MAINBTBtn").click(); }
//			if($("#AnimatedSkinBtn").attr('aria-pressed') == "false"){
//				$("#AnimatedSkinBtn").click(); }
    if ($("#XPBtn").attr('aria-pressed') == "false") {
        $("#XPBtn").click();
    }
    //	if($("#MANUIBtn").attr('aria-pressed') == "false"){
    //	$("#MANUIBtn").click(); }
}


function PrivateServer1(){
	window.open("http://agar.io/?ip=172.73.178.205:8880","_self");
}
function PrivateServer2(){
	window.open("http://agar.io/?ip=game.fzogar.xyz:443","_self");
}
function PrivateServer3(){
	window.open("http://agar.io/?ip=game.fzogar.xyz:4000","_self");
}
function PrivateServer4(){
	window.open("http://agar.io/?ip=game.fzogar.xyz:4001","_self");
}
function PrivateServer5(){
	window.open("http://agar.io/?ip=game.fzogar.xyz:4002","_self");
}

/*
function adres() {
    var adrs = WebSocket.prototype.send;
    window.__WS_send = WebSocket.prototype.send, WebSocket.prototype.send = function(b) {
        if ($("#gamemode").val() != ":party") {
            //var texture1, texture2, texture3;
            //texture1=this.url;texture2=texture1.split(':').pop();texture2=texture2.replace("/","");texture3=texture1.split('ip-').pop();texture3=texture3.substring(0, texture3.indexOf('.'));texture3=texture3.replace(/-/g,".");texture3=texture3+":"+texture2;
            setTimeout(function() {
                $("#server").val(currentIP);
            }, 800);

            //  $('#gamemode').val(realmode);
        } else {
            setTimeout(function() {
                $("#server").val("#" + MC.getPartyToken());
            }, 2000);
        }
        try {
            adrs.apply(this, [b]), WebSocket.prototype.send = adrs
        } catch (e) {
            window.__WS_send.apply(this, [b]), WebSocket.prototype.send = window.__WS_send
        }
    }
}
*/
function adres() {
	if ($("#gamemode").val() != ":party") {
		setTimeout(function(){
	            var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
            d = c.exec($("#server-ws").val());
			$("#server").val(d[1].replace(/-/g, '.') + d[2]);
			currentIP=d[1].replace(/-/g, '.') + d[2];
			setTimeout(function() {
				 
			    realmode = getGameMode();
                if (searchSip == null && privateSrv==null) {
                    if (realmode != ":party") {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + MC.getRegion() + "&?m=" + realmode);
                    }
                    else if (realmode == ":party") {
                        window.history.pushState(null, null, window.location.pathname);
                        history.pushState(stateObj, "page 2", "#" + MC.getPartyToken());
                    }
				}
				else if (privateSrv!=null) {				
                history.pushState(stateObj, "page 2", "?ip=" + privateSrv + "&?SERVER=PRIVATE");
				
			}	                
			
				
			}, 1000);
			}, 800);
	}
	else {
            setTimeout(function() {
				 MC.setQuality($('#quality').val());
                $("#server").val("#" + MC.getPartyToken());
            }, 2000);
        }
		setTimeout(function(){MC.setQuality($('#quality').val());}, 3000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 4000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 5000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 6000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 7000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 8000);
		setTimeout(function(){MC.setQuality($('#quality').val());}, 11000);
}		

function joinpartyfromconnect() {
    MC.joinParty($("#server").val());
//    $("#cur-tk-hud").text("Party Token: " + $("#server").val()).attr("style", "opacity: 0;");;
}

function openbleedmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/BleedingMod.js";
    $("body").append(s);
}

function openrotatingmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/rotating500images.js";
    $("body").append(s);
}

function openvidmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/VidMod.js";
    $("body").append(s);
}

function changeModLanguage() {
    if ($("#legendlanguages").val() == 1) {
        localStorage.setItem("languagemod", 1);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackEnglish.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 2) {
        localStorage.setItem("languagemod", 2);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackGreek.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 3) {
        localStorage.setItem("languagemod", 3);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackSpanish.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 4) {
        localStorage.setItem("languagemod", 4);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackBulgarian.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 5) {
        localStorage.setItem("languagemod", 5);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackFrench.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 6) {
        localStorage.setItem("languagemod", 6);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackArabic.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
}

function opendyinglight() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/dyinglight.js";
    $("body").append(s);
}

//1. Animated Skins
function animatedskins(){
(function agarXTRA(w) {
   if ( typeof w.core != 'undefined' && typeof w.core.registerSkin === 'function' && document.getElementById('gamemode') ) {
      var tcm = {
         l: {
            skins:      {
               'bomb': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'bomb',
                  color:     '000000',
                  frames:    [
                     {id: 'lwneHCo', delay: '0.14'},
                     {id: 'JcOZgwb', delay: '0.14'},
                     {id: 'uwfoN9c', delay: '0.14'},
                     {id: 'IqRkRVc', delay: '0.14'},
                     {id: 'bObBbnl', delay: '0.14'},
                     {id: 'Wj1RsWf', delay: '0.14'},
                     {id: 'gjLfMcx', delay: '0.14'},
                     {id: 'I7DMQeY', delay: '0.14'},
                     {id: 'oGr1KKG', delay: '0.14'},
                     {id: 'twzFS5g', delay: '0.14'},
                     {id: 'T6er9yw', delay: '1'}
                  ]
               },
               'eye': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'eye',
                  color:     '838383',
                  frames:    [
                     {id: 'WBptNfR', delay: '1'},
                     {id: 'Ll7Y3Ek', delay: '0.15'},
                     {id: 'OIXeTfo', delay: '0.15'},
                     {id: 'htdrJ70', delay: '0.15'},
                     {id: 'FL7zYNe', delay: '0.15'},
                     {id: 'Wn1xhE8', delay: '0.15'},
                     {id: 'Pc7s79W', delay: '0.15'},
                     {id: 'sDJCsKD', delay: '0.15'}
                  ]
               },
               'blackhole': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'blackhole',
                  color:     '000000',
                  frames:    [
                     {id: 'gNeYD4y', delay: '0.12'},
                     {id: 'RWhq2m6', delay: '0.12'},
                     {id: 'Gzeutvv', delay: '0.12'},
                     {id: 'ZM5d6S7', delay: '0.12'},
                     {id: 'iP1LjJq', delay: '0.12'},
                     {id: '62GWoaP', delay: '0.12'},
                     {id: '71GSwyR', delay: '0.12'},
                     {id: 'w5b0kBu', delay: '0.12'}
                  ]
               },
               'shark': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'shark',
                  color:     '002C6C',
                  frames:    [
                     {id: 'WOnTrZc', delay: '0.15'},
                     {id: '7nVbAjo', delay: '0.15'},
                     {id: 'lhY26fT', delay: '0.15'},
                     {id: 'cVp2rVv', delay: '0.15'},
                     {id: 'lhY26fT', delay: '0.15'},
                     {id: '7nVbAjo', delay: '0.15'}
                  ]
               },
               'goldfish': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'goldfish',
                  color:     '002C6C',
                  frames:    [
                     {id: 'KgqoD2X', delay: '0.125'},
                     {id: 'Xz9rzlp', delay: '0.125'},
                     {id: 'zOb2Oqa', delay: '0.125'},
                     {id: '5i15TVe', delay: '0.125'},
                     {id: 'G3evzNO', delay: '0.125'},
                     {id: 'Bqhqqib', delay: '0.125'},
                     {id: 'i78XDTj', delay: '0.125'}
                  ]
               },
               'monster': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'monster',
                  color:     '7c0001',
                  frames:    [
                     {id: 't9Hjp1l', delay: '2'},
                     {id: 'LR7dsAT', delay: '0.12'},
                     {id: 'J8g1Kxh', delay: '0.12'},
                     {id: 'liKY8Ja', delay: '0.12'},
                     {id: 'KNR6AE6', delay: '0.12'},
                     {id: 'VOJGLCH', delay: '0.12'},
                     {id: 'KNR6AE6', delay: '0.12'},
                     {id: 'liKY8Ja', delay: '0.12'},
                     {id: 'J8g1Kxh', delay: '0.12'},
                     {id: 'LR7dsAT', delay: '0.12'}
                  ]
               },
               'crocodile': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'crocodile',
                  color:     '004F0F',
                  frames:    [
                     {id: 'Aa4bqa1', delay: '1'},
                     {id: 'nmaz62r', delay: '0.1'},
                     {id: 'RxBfX11', delay: '0.1'},
                     {id: 'KPKVF6u', delay: '0.1'},
                     {id: 'O4VjIno', delay: '0.1'},
                     {id: 'iYykA1K', delay: '0.1'},
                     {id: 'O4VjIno', delay: '0.1'},
                     {id: 'KPKVF6u', delay: '0.1'},
                     {id: 'RxBfX11', delay: '0.1'},
                     {id: 'nmaz62r', delay: '0.1'}
                  ]
               },
               'bowling': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'bowling',
                  color:     '000000',
                  frames:    [
                     {id: '1D8FYOu', delay: '0.12'},
                     {id: 'ctMzkSb', delay: '0.12'},
                     {id: 'uo8KqtT', delay: '0.12'},
                     {id: 'lAxKG9C', delay: '0.12'},
                     {id: 'bizPEiq', delay: '0.12'},
                     {id: 'UzNGxgk', delay: '0.12'},
                     {id: 'NJHBqXt', delay: '0.12'},
                     {id: 'aC8vvpe', delay: '0.12'}
                  ]
               },
               'mouse': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'mouse',
                  color:     '654217',
                  frames:    [
                     {id: 'IkAzcau', delay: '2'},
                     {id: 'ylmgRh2', delay: '0.1'},
                     {id: '0FgdFdL', delay: '0.1'},
                     {id: 'HccU8TO', delay: '0.1'},
                     {id: '0FgdFdL', delay: '0.1'},
                     {id: 'ylmgRh2', delay: '0.1'}
                  ]
               },
               'heart': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'heart',
                  color:     'AC0875',
                  frames:    [
                     {id: '2w48B0M', delay: '1'},
                     {id: 'cM2hLSt', delay: '0.12'},
                     {id: '0pfV9lu', delay: '0.12'},
                     {id: 'KxbFznI', delay: '0.12'},
                     {id: 'FhptVrD', delay: '0.12'},
                     {id: '9lJDoCK', delay: '0.12'},
                     {id: 'FhptVrD', delay: '0.12'},
                     {id: 'KxbFznI', delay: '0.12'},
                     {id: '0pfV9lu', delay: '0.12'},
                     {id: 'cM2hLSt', delay: '0.12'}
                  ]
               },
               'nuclear': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'nuclear',
                  color:     '654217',
                  frames:    [
                     {id: 'eDof29h', delay: '1.5'},
                     {id: 'zqqaUbO', delay: '1.5'}
                  ]
               },
               't-rex': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        't_rex',
                  color:     '7c0001',
                  frames:    [
                     {id: 'jeyvjUh', delay: '2'},
                     {id: 'eM38lQG', delay: '0.12'},
                     {id: 'jn7xfpf', delay: '0.12'},
                     {id: 'eM38lQG', delay: '0.12'}
                  ]
               },
               'zombie': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'zombie',
                  color:     '004F0F',
                  frames:    [
                     {id: 'uVqUXBN', delay: '3'},
                     {id: 'QclZjeR', delay: '0.1'},
                     {id: 'iXdYrD8', delay: '0.1'},
                     {id: 'vF0ZIcs', delay: '0.1'},
                     {id: 'iXdYrD8', delay: '0.1'},
                     {id: 'QclZjeR', delay: '0.1'}
                  ]
               },
               'lizard': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'lizard',
                  color:     'AC0875',
                  frames:    [
                     {id: 'ESMxT94', delay: '0.5'},
                     {id: 'cU5UMlY', delay: '0.1'},
                     {id: 'awtHLkg', delay: '0.1'},
                     {id: '9rdGdkz', delay: '0.1'}
                  ]
               },
               'raptor': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'raptor',
                  color:     '004F0F',
                  frames:    [
                     {id: 'dZbuOvZ', delay: '2'},
                     {id: 'HbK7yXt', delay: '0.1'},
                     {id: 'kRDldQ2', delay: '0.1'},
                     {id: 'wFPrb4A', delay: '0.1'},
                     {id: 'kRDldQ2', delay: '0.1'},
                     {id: 'HbK7yXt', delay: '0.1'}
                  ]
               },
               'seal': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'seal',
                  color:     '004F0F',
                  frames:    [
                     {id: 'y6O9oq6', delay: '2'},
                     {id: 'HgqK6mA', delay: '0.1'},
                     {id: 'Etk3dGT', delay: '0.1'},
                     {id: '2s2EykQ', delay: '0.1'},
                     {id: 'xs9PUYG', delay: '0.1'},
                     {id: 'j32x0NT', delay: '0.1'},
                     {id: 'xs9PUYG', delay: '0.1'},
                     {id: '2s2EykQ', delay: '0.1'},
                     {id: 'Etk3dGT', delay: '0.1'},
                     {id: 'HgqK6mA', delay: '0.1'}
                  ]
               },
               'pizza': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'pizza',
                  color:     '7c0001',
                  frames:    [
                     {id: 'SmfgnOa', delay: '2'},
                     {id: 'BD8B6wo', delay: '0.15'},
                     {id: 'Nv23NK1', delay: '0.15'},
                     {id: '2e1eNwR', delay: '0.15'},
                     {id: 'sKtjEXM', delay: '0.15'},
                     {id: 'UBEMJZs', delay: '0.15'},
                     {id: 'DLk0Xr7', delay: '0.15'},
                     {id: '7areUV1', delay: '0.15'},
                     {id: 'DLk0Xr7', delay: '0.15'},
                     {id: 'UBEMJZs', delay: '0.15'},
                     {id: 'sKtjEXM', delay: '0.15'},
                     {id: '2e1eNwR', delay: '0.15'},
                     {id: 'Nv23NK1', delay: '0.15'},
                     {id: 'BD8B6wo', delay: '0.15'}
                  ]
               },
               'brofist': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'brofist',
                  color:     '7c0001',
                  frames:    [
                     {id: 'ShcWYvU', delay: '0.1'},
                     {id: 'sTfxqoG', delay: '0.1'},
                     {id: '8vEo8Bu', delay: '0.1'},
                     {id: 'oZRIIqE', delay: '0.1'},
                     {id: 'AxqYXKo', delay: '0.1'},
                     {id: '7z65jUI', delay: '3'}
                  ]
               },
               'crazy': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'crazy',
                  color:     '7c0001',
                  frames:    [
                     {id: '6oMDz9m', delay: '0.1'},
                     {id: 'Z3DQpP4', delay: '0.1'},
                     {id: 'WPEnnWK', delay: '0.1'},
                     {id: 'gml6ud3', delay: '0.1'},
                     {id: '6hTV8AA', delay: '0.1'},
                     {id: 'IYcDRNc', delay: '0.1'},
                     {id: 'zYpx35t', delay: '3'},
                     {id: 'IYcDRNc', delay: '0.1'},
                     {id: '6hTV8AA', delay: '0.1'},
                     {id: 'gml6ud3', delay: '0.1'},
                     {id: 'WPEnnWK', delay: '0.1'},
                     {id: 'Z3DQpP4', delay: '0.1'}
                  ]
               },
               'baseball': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'baseball',
                  color:     '838383',
                  frames:    [
                     {id: 'TlffigR', delay: '0.09'},
                     {id: '5dxGVTq', delay: '0.09'}
                  ]
               },
               'cloud': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'cloud',
                  color:     '838383',
                  frames:    [
                     {id: 'rqYIfAQ', delay: '0.08'},
                     {id: 'haaANq1', delay: '0.08'},
                     {id: '5wcw4R3', delay: '0.08'},
                     {id: 'iCLv7Bb', delay: '0.08'},
                     {id: 'PSBWj5q', delay: '0.08'},
                     {id: 'Lcrh5Uj', delay: '0.08'},
                     {id: 'mWjua9q', delay: '0.08'},
                     {id: 'AD1dk6l', delay: '0.08'},
                     {id: 'fr9BnOD', delay: '2'}
                  ]
               },
               'snowman': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'snowman',
                  color:     '002C6C',
                  frames:    [
                     {id: 'fyIBJJo', delay: '0.08'},
                     {id: 'kQJz6SF', delay: '0.08'},
                     {id: 'iegAX3K', delay: '0.08'},
                     {id: 'lngWxxk', delay: '0.08'},
                     {id: 'GxhTGji', delay: '0.08'},
                     {id: 'lngWxxk', delay: '0.08'},
                     {id: 'iegAX3K', delay: '0.08'},
                     {id: 'kQJz6SF', delay: '0.08'}
                  ]
               },
               'bug': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'bug',
                  color:     '7c0001',
                  frames:    [
                     {id: 'uxKmViA', delay: '2'},
                     {id: 'n1ncMvV', delay: '0.08'},
                     {id: '0mDiZyL', delay: '0.08'},
                     {id: 'ADKOOAB', delay: '0.08'},
                     {id: '72Z5GjJ', delay: '0.08'},
                     {id: 'ADKOOAB', delay: '0.08'},
                     {id: '0mDiZyL', delay: '0.08'},
                     {id: 'n1ncMvV', delay: '0.08'}
                  ]
               },
               'mushroom': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'mushroom',
                  color:     '004F0F',
                  frames:    [
                     {id: '92FrA5N', delay: '0.1'},
                     {id: 'vbebU1q', delay: '0.1'},
                     {id: 'SrwCeQF', delay: '0.1'},
                     {id: 'jJAoWma', delay: '0.1'},
                     {id: 'gzkpCLW', delay: '0.1'}
                  ]
               },
               'ghost': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'ghost',
                  color:     '4E114E',
                  frames:    [
                     {id: 'kpT3MiF', delay: '0.08'},
                     {id: 'JiASOag', delay: '0.08'},
                     {id: 'IPrwKvq', delay: '0.08'},
                     {id: 'PHGZ1sP', delay: '0.08'},
                     {id: 'DbGkrD9', delay: '0.08'},
                     {id: 'PHGZ1sP', delay: '0.08'},
                     {id: 'IPrwKvq', delay: '0.08'},
                     {id: 'JiASOag', delay: '0.08'}
                  ]
               },
               'lol': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'birthday_lol',
                  color:     'cd5d22',
                  frames:    [
                     {id: 'SJlS8Rg', delay: '0.08'},
                     {id: 'AiICKZb', delay: '0.08'},
                     {id: '1iVfy8b', delay: '0.08'},
                     {id: 'hwPSr3s', delay: '0.08'},
                     {id: 'wpJophT', delay: '0.08'},
                     {id: 'W9oLhpz', delay: '0.08'},
                     {id: 'DexE8Kb', delay: '0.08'},
                     {id: '7ybaqXq', delay: '0.08'}
                  ]
               },
               'troll': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'birthday_troll',
                  color:     '7a0c0f',
                  frames:    [
                     {id: 'KxcI3j7', delay: '4'},
                     {id: 'aE1etcH', delay: '0.1'},
                     {id: 'ZA1rlQ0', delay: '0.1'},
                     {id: '8NUCHKe', delay: '0.1'},
                     {id: 'ZbeXIpc', delay: '0.1'},
                     {id: 'iQWIiAu', delay: '0.1'},
                     {id: 'ZbeXIpc', delay: '0.1'},
                     {id: '8NUCHKe', delay: '0.1'},
                     {id: 'ZA1rlQ0', delay: '0.1'},
                     {id: 'aE1etcH', delay: '0.1'}
                  ]
               },
               'starfish': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'starfish',
                  color:     'cf9b24',
                  frames:    [
                     {id: 'MGSsF4o', delay: '0.12'},
                     {id: 'gzt9cfR', delay: '0.12'},
                     {id: 'let5iCn', delay: '0.12'},
                     {id: 'jy0O4el', delay: '0.12'},
                     {id: 'ujIoMJj', delay: '0.12'},
                     {id: 'cjiaScB', delay: '0.12'},
                     {id: 'QLoOcDQ', delay: '0.12'},
                     {id: 'natZ9ad', delay: '0.12'}
                  ]
               },
               'mighty': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'mighty',
                  color:     '095090',
                  frames:    [
                     {id: 'V5md28Q', delay: '0.08'},
                     {id: 'bCh5H2P', delay: '0.08'},
                     {id: 'B5EQdTb', delay: '0.08'},
                     {id: 'svrkPNc', delay: '0.08'},
                     {id: 'BtCgDPE', delay: '0.08'},
                     {id: '1xE6pAf', delay: '0.08'},
                     {id: 'BtCgDPE', delay: '0.08'},
                     {id: 'svrkPNc', delay: '0.08'},
                     {id: 'B5EQdTb', delay: '0.08'},
                     {id: 'bCh5H2P', delay: '0.08'}
                  ]
               },
               'bread': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'bread',
                  color:     '593b3c',
                  frames:    [
                     {id: 'u49qoXZ', delay: '0.08'},
                     {id: 'mcRd3ld', delay: '0.08'},
                     {id: 'Pxovhai', delay: '0.08'},
                     {id: 'gHLB9y4', delay: '0.08'},
                     {id: '3Sepdpp', delay: '0.08'},
                     {id: 'zjgxKHM', delay: '0.08'},
                     {id: 'n6rglZu', delay: '0.08'},
                     {id: 'DLqYwpu', delay: '0.08'},
                     {id: 'nAqaRja', delay: '0.08'},
                     {id: 'DLqYwpu', delay: '0.08'},
                     {id: 'n6rglZu', delay: '0.08'},
                     {id: 'zjgxKHM', delay: '0.08'},
                     {id: '3Sepdpp', delay: '0.08'},
                     {id: 'gHLB9y4', delay: '0.08'},
                     {id: 'Pxovhai', delay: '0.08'},
                     {id: 'mcRd3ld', delay: '0.08'}
                  ]
               },
               'cia 2': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'birthday_cia',
                  color:     '3a185c',
                  frames:    [
                     {id: 'x7pNXov', delay: '0.12'},
                     {id: 'O2cAr4y', delay: '0.12'}
                  ]
               },
               'cactus': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'cactus',
                  color:     'a20947',
                  frames:    [
                     {id: 'GPI5CyD', delay: '0.08'},
                     {id: 'WTv6YOT', delay: '0.08'},
                     {id: 'Eiuz71P', delay: '0.08'},
                     {id: 'QPN1cYs', delay: '0.08'},
                     {id: 'Eiuz71P', delay: '0.08'},
                     {id: 'WTv6YOT', delay: '0.08'}
                  ]
               },
               'tennis': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'tennist',
                  color:     'cb1778',
                  frames:    [
                     {id: 'juVHtpb', delay: '0.12'},
                     {id: 'vrxQoUF', delay: '0.12'},
                     {id: 'azYvvQm', delay: '0.12'},
                     {id: 'vrxQoUF', delay: '0.12'}
                  ]
               },
               'duck target': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'duck_target',
                  color:     '000000',
                  frames:    [
                     {id: '6gfYVC7', delay: '0.1'},
                     {id: 'lFP4blK', delay: '0.1'},
                     {id: 'LZhQQkH', delay: '0.1'},
                     {id: '1JnabLw', delay: '0.1'},
                     {id: '5fLXTUd', delay: '0.1'},
                     {id: '1JnabLw', delay: '0.1'},
                     {id: 'LZhQQkH', delay: '0.1'},
                     {id: 'lFP4blK', delay: '0.1'}
                  ]
               },
               'wicked cat': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'wicked_cat',
                  color:     '420000',
                  frames:    [
                     {id: 'QGFmJTG', delay: '3'},
                     {id: 'tU1RYvT', delay: '0.1'},
                     {id: '9Ol2gEw', delay: '0.1'},
                     {id: 'KQGngCg', delay: '1'},
                     {id: '9Ol2gEw', delay: '0.1'},
                     {id: 'tU1RYvT', delay: '0.1'}
                  ]
               },
               'reindeer': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'reindeer',
                  color:     '1a4534',
                  frames:    [
                     {id: 'GmH7K9m', delay: '0.08'},
                     {id: 'LRpx88I', delay: '0.08'},
                     {id: 'ZZXg3kj', delay: '0.08'},
                     {id: '9klVKAq', delay: '0.08'},
                     {id: 'CBb1Qpg', delay: '0.08'},
                     {id: 'YL6sv38', delay: '0.08'},
                     {id: 'DUp7Ph2', delay: '0.08'},
                     {id: 'YL6sv38', delay: '0.08'},
                     {id: 'CBb1Qpg', delay: '0.08'},
                     {id: '9klVKAq', delay: '0.08'},
                     {id: 'ZZXg3kj', delay: '0.08'},
                     {id: 'LRpx88I', delay: '0.08'}
                  ]
               },
               'charmander': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'charmander',
                  color:     'd26900',
                  frames:    [
                     {id: '1z01PqG', delay: '4'},
                     {id: '36yUxT1', delay: '0.1'},
                     {id: 'f8YUHIM', delay: '0.1'},
                     {id: 'ULtQFXw', delay: '0.1'},
                     {id: 'CLnrlQD', delay: '0.1'},
                     {id: 'YZZfnvR', delay: '0.1'},
                     {id: 'CLnrlQD', delay: '0.1'},
                     {id: 'ULtQFXw', delay: '0.1'},
                     {id: 'f8YUHIM', delay: '0.1'},
                     {id: '36yUxT1', delay: '0.1'}
                  ]
               },
               'bulbasaur': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'bulbasaur',
                  color:     '37973c',
                  frames:    [
                     {id: 'A3TMFs5', delay: '4'},
                     {id: 'agRaNfC', delay: '0.1'},
                     {id: 'co5VkgO', delay: '0.1'},
                     {id: 'PiOFxRV', delay: '0.1'},
                     {id: 'xGmgf1p', delay: '0.1'},
                     {id: 'qjS12LB', delay: '0.1'},
                     {id: 'xGmgf1p', delay: '0.1'},
                     {id: 'PiOFxRV', delay: '0.1'},
                     {id: 'co5VkgO', delay: '0.1'},
                     {id: 'agRaNfC', delay: '0.1'}
                  ]
               },
               'squirtle': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'squirtle',
                  color:     '438be8',
                  frames:    [
                     {id: 'ntVuoKU', delay: '0.1'},
                     {id: 'bfgrQtI', delay: '0.1'},
                     {id: 'gGFq1VU', delay: '0.1'},
                     {id: '8BSCCvP', delay: '0.1'},
                     {id: '04TFtfI', delay: '0.1'},
                     {id: 'swbm5bR', delay: '0.1'},
                     {id: '04TFtfI', delay: '0.1'},
                     {id: '8BSCCvP', delay: '0.1'},
                     {id: 'gGFq1VU', delay: '0.1'},
                     {id: 'bfgrQtI', delay: '0.1'}
                  ]
               },
               'jumbo': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'jumbo_yt',
                  color:     '00560f',
                  frames:    [
                     {id: 'mlgXaGZ', delay: '0.09'},
                     {id: 'WC1eIre', delay: '0.09'},
                     {id: 'byJnguv', delay: '0.09'},
                     {id: 'EHYn8GJ', delay: '0.09'},
                     {id: 'rW33rqf', delay: '0.09'},
                     {id: 'FbijFRY', delay: '0.09'}
                  ]
               },
               'tyt': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'tyt_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'rUbIMQY', delay: '0.09'},
                     {id: 'ODW4Omn', delay: '0.09'},
                     {id: 'EtFMPm8', delay: '0.09'},
                     {id: 'IKcPprq', delay: '0.09'},
                     {id: 'Xjs9LX2', delay: '0.09'},
                     {id: 'pmfcfuz', delay: '0.09'},
                     {id: 'nXdt3ce', delay: '0.09'},
                     {id: 'd6VzSKD', delay: '0.09'},
                     {id: 'yobj44p', delay: '0.09'},
                     {id: 'BF2p3tm', delay: '0.09'},
                     {id: 'v5aHQzC', delay: '0.09'},
                     {id: 'K61nFgp', delay: '0.09'},
                     {id: 'jhMkOkA', delay: '0.09'},
                     {id: 'ebRUvat', delay: '0.09'},
                     {id: 'bWezvmS', delay: '0.09'},
                     {id: 'XYqrXYY', delay: '0.09'}
                  ]
               },
               'hero': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'hero_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'x0NKSI4', delay: '0.08'},
                     {id: 'OBRZfoQ', delay: '0.08'},
                     {id: 'mFBvHSN', delay: '0.08'},
                     {id: 'A4JskwY', delay: '0.08'},
                     {id: 'FNCLnk5', delay: '0.08'},
                     {id: 'W9QHmJU', delay: '0.08'},
                     {id: 'psnaqN4', delay: '0.08'},
                     {id: 'Yz9XVXN', delay: '0.08'},
                     {id: 'Thu6tTT', delay: '0.08'},
                     {id: 'K0yv7TU', delay: '0.08'},
                     {id: 'ineJWic', delay: '0.08'},
                     {id: 'q8emY2S', delay: '0.08'},
                     {id: 'P5Vq8tU', delay: '0.08'}
                  ]
               },
               'tigar': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'tigar_yt',
                  color:     'e67414',
                  frames:    [
                     {id: 'GCOReOG', delay: '2'},
                     {id: 'dhoZlbU', delay: '0.08'},
                     {id: 'ImMf8to', delay: '0.08'},
                     {id: 'vjVwwl0', delay: '0.08'},
                     {id: 'JIwHHfL', delay: '0.08'},
                     {id: 'HyGPKp6', delay: '0.08'},
                     {id: 'vMyMaiK', delay: '0.08'},
                     {id: 'r3awDWP', delay: '0.08'},
                     {id: 'ibW0OQu', delay: '0.08'},
                     {id: '61cj4ur', delay: '0.08'}
                  ]
               },
               'mau': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'mau_yt',
                  color:     '49bef3',
                  frames:    [
                     {id: 'dKay0Ky', delay: '3'},
                     {id: 'RcPm75A', delay: '0.08'},
                     {id: '68Y0H7A', delay: '0.08'},
                     {id: 'xuoVdBS', delay: '0.08'},
                     {id: 'rI9wFYS', delay: '0.08'},
                     {id: 'B8gsy1j', delay: '0.08'},
                     {id: '4ZBOW12', delay: '0.08'},
                     {id: 'QuMiddk', delay: '0.08'},
                     {id: 'XQnaeAO', delay: '0.08'},
                     {id: 'rQQDAH7', delay: '0.08'}
                  ]
               },
               'n0psa': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'n0psa_yt',
                  color:     'f6c803',
                  frames:    [
                     {id: 'hdvTwFa', delay: '1'},
                     {id: 'fwL1V1X', delay: '0.08'},
                     {id: 'WByRLZS', delay: '0.08'},
                     {id: 'YUL6OBd', delay: '0.08'},
                     {id: 'hzWo2HH', delay: '0.08'},
                     {id: '5VO5KiR', delay: '5'},
                     {id: 'hzWo2HH', delay: '0.08'},
                     {id: 'YUL6OBd', delay: '0.08'},
                     {id: 'WByRLZS', delay: '0.08'},
                     {id: 'fwL1V1X', delay: '0.08'}
                  ]
               },
               'planet': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'planet_yt',
                  color:     '565656',
                  frames:    [
                     {id: 'cedz7ps', delay: '0.08'},
                     {id: 'AkqsdQo', delay: '0.08'},
                     {id: 'FFHr4Y2', delay: '0.08'},
                     {id: '9AjZP6A', delay: '0.08'},
                     {id: '6CdbOo3', delay: '0.08'},
                     {id: 'uqc3xM9', delay: '0.08'},
                     {id: 'B2zmk0N', delay: '0.08'},
                     {id: 'mVCN9FP', delay: '0.08'},
                     {id: 'ymNStZ4', delay: '0.08'},
                     {id: 'OIT8rgw', delay: '0.08'},
                     {id: 'ymNStZ4', delay: '0.08'},
                     {id: 'mVCN9FP', delay: '0.08'},
                     {id: 'B2zmk0N', delay: '0.08'},
                     {id: 'uqc3xM9', delay: '0.08'},
                     {id: '6CdbOo3', delay: '0.08'},
                     {id: '9AjZP6A', delay: '0.08'},
                     {id: 'FFHr4Y2', delay: '0.08'},
                     {id: 'AkqsdQo', delay: '0.08'}
                  ]
               },
               'agarpros': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'agarpros_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'TBIlCYb', delay: '4'},
                     {id: 'NFXeciX', delay: '0.06'},
                     {id: 'tVJ1fru', delay: '0.06'},
                     {id: 'xOFUJtD', delay: '0.06'},
                     {id: 'POhhdVh', delay: '0.06'},
                     {id: 'mV17fbS', delay: '0.06'},
                     {id: 'G3lUEyj', delay: '0.06'},
                     {id: 'G4jxjM9', delay: '0.06'},
                     {id: 'WQA1R3N', delay: '0.06'}
                  ]
               },
               'wunwun': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'wunwun_yt',
                  color:     'cfb53b',
                  frames:    [
                     {id: 'HAgGIlS', delay: '0.08'},
                     {id: '2jEiLOq', delay: '0.08'},
                     {id: 'YyavcPR', delay: '0.08'},
                     {id: 'QRddsHF', delay: '0.08'},
                     {id: 's97xn1X', delay: '0.08'},
                     {id: 'G2bawix', delay: '0.08'},
                     {id: 'J5XBcRr', delay: '0.08'},
                     {id: 'jmCoKrN', delay: '0.08'},
                     {id: 'OOuT7gX', delay: '0.08'},
                     {id: '7m8p67N', delay: '0.08'},
                     {id: 'cKVriYg', delay: '2'}
                  ]
               },
               'sirius': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'sirius_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'y54E3Fq', delay: '2'},
                     {id: 'KKcOvM5', delay: '0.08'},
                     {id: 'cdPueeg', delay: '0.08'},
                     {id: 'yMHapKA', delay: '0.08'},
                     {id: 'piuBzG4', delay: '0.08'},
                     {id: 'Zhad6LJ', delay: '0.08'},
                     {id: 'pIpNT61', delay: '0.08'},
                     {id: 'LtPbRk7', delay: '0.08'},
                     {id: 'twPrMak', delay: '0.08'},
                     {id: 'C9FDBFr', delay: '0.08'},
                     {id: 'j00ha1X', delay: '0.08'},
                     {id: 'C9FDBFr', delay: '0.08'},
                     {id: 'twPrMak', delay: '0.08'},
                     {id: 'LtPbRk7', delay: '0.08'},
                     {id: 'pIpNT61', delay: '0.08'},
                     {id: 'Zhad6LJ', delay: '0.08'},
                     {id: 'piuBzG4', delay: '0.08'},
                     {id: 'yMHapKA', delay: '0.08'},
                     {id: 'cdPueeg', delay: '0.08'},
                     {id: 'KKcOvM5', delay: '0.08'}
                  ]
               },
               'miracle': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'miracle_yt',
                  color:     'e36e04',
                  frames:    [
                     {id: 'mEcp7UJ', delay: '4'},
                     {id: 'cMQYnQb', delay: '0.08'},
                     {id: 'N4fmB4V', delay: '0.08'},
                     {id: 'N3eQhQu', delay: '0.08'},
                     {id: 'cMQYnQb', delay: '0.08'},
                     {id: 'N4fmB4V', delay: '0.08'},
                     {id: 'cMQYnQb', delay: '0.08'},
                     {id: 'N3eQhQu', delay: '0.08'},
                     {id: 'cMQYnQb', delay: '0.08'},
                     {id: 'N4fmB4V', delay: '0.08'}
                  ]
               },
               'slash': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'slash_yt',
                  color:     'ffffff',
                  frames:    [
                     {id: 'AWEpAom', delay: '4'},
                     {id: 'Cvevuc8', delay: '0.08'},
                     {id: 'PtVaXeZ', delay: '0.08'},
                     {id: 'cvWzzip', delay: '0.08'},
                     {id: 's5FM9ZM', delay: '0.08'},
                     {id: 'nFzj8ow', delay: '0.08'},
                     {id: 'k6r614I', delay: '0.08'},
                     {id: '8UEJJEt', delay: '0.08'},
                     {id: 'OS0NBMS', delay: '0.08'},
                     {id: '8jQk2Uz', delay: '0.08'},
                     {id: 'uiLHrCr', delay: '0.08'},
                     {id: '8jQk2Uz', delay: '0.08'},
                     {id: 'OS0NBMS', delay: '0.08'},
                     {id: '8UEJJEt', delay: '0.08'},
                     {id: 'k6r614I', delay: '0.08'},
                     {id: 'nFzj8ow', delay: '0.08'},
                     {id: 's5FM9ZM', delay: '0.08'},
                     {id: 'cvWzzip', delay: '0.08'},
                     {id: 'PtVaXeZ', delay: '0.08'},
                     {id: 'Cvevuc8', delay: '0.08'}
                  ]
               },
               'crystal': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'crystal_yt',
                  color:     '1273e9',
                  frames:    [
                     {id: 'jZHPuF8', delay: '0.08'},
                     {id: 'D8MBnZ5', delay: '0.08'},
                     {id: 'ttiznOb', delay: '0.08'},
                     {id: 'Gm0X19w', delay: '0.08'},
                     {id: 'NPoLUf6', delay: '0.08'},
                     {id: 'XjSRDHW', delay: '0.08'},
                     {id: 'edcTt6j', delay: '0.08'},
                     {id: 'XTQBWRm', delay: '0.08'},
                     {id: 'rU3KchB', delay: '0.08'},
                     {id: 'xJe9vJh', delay: '0.08'},
                     {id: 'Gg1A4NY', delay: '0.08'},
                     {id: 'D9d2hSh', delay: '0.08'},
                     {id: 'lpX4GM6', delay: '0.08'},
                     {id: 'CKzjpKT', delay: '0.08'},
                     {id: 'pwkQvxD', delay: '0.08'},
                     {id: '2C3QpHg', delay: '0.08'},
                     {id: 'MRG3Djj', delay: '0.08'},
                     {id: '2GgbhaF', delay: '0.08'},
                     {id: 'Mqe76yX', delay: '0.08'},
                     {id: 'Oc0MPeX', delay: '0.08'},
                     {id: 'fq2oEqJ', delay: '0.08'},
                     {id: 'I8Hz7mE', delay: '0.08'},
                     {id: 'vy3sLVd', delay: '0.08'},
                     {id: 'xA7su83', delay: '0.08'},
                     {id: 'DzQLo7q', delay: '0.08'}
                  ]
               },
               'gfm': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'gfm_yt',
                  color:     '13dd9b',
                  frames:    [
                     {id: 'ImMQ1v7', delay: '0.08'},
                     {id: 'UnZ13uA', delay: '0.08'},
                     {id: 'U0Jres5', delay: '0.08'},
                     {id: 'CWKL82x', delay: '0.08'},
                     {id: '4Eehc4A', delay: '0.08'},
                     {id: 'QDIRu6q', delay: '0.08'},
                     {id: 'OlfDoKC', delay: '0.08'},
                     {id: 'EWidPaO', delay: '0.08'},
                     {id: 'wVso12O', delay: '0.08'},
                     {id: 'aRRPDXg', delay: '0.08'},
                     {id: 'Px2fPIX', delay: '0.08'},
                     {id: 'z71N8zK', delay: '0.08'},
                     {id: 'yV1oWtB', delay: '0.08'},
                     {id: 'OGp9CKr', delay: '0.08'},
                     {id: 'nOxBDx4', delay: '0.08'},
                     {id: 'bj4v8be', delay: '0.08'}
                  ]
               },
               'nbk': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'nbk_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'doovLBy', delay: '0.1'},
                     {id: '7a4bcUA', delay: '0.1'},
                     {id: 'uQiWXKK', delay: '0.1'},
                     {id: 'YvdpBSe', delay: '0.1'},
                     {id: 'sBg714h', delay: '0.1'},
                     {id: 'zturjAt', delay: '0.1'},
                     {id: 'ysfO8B6', delay: '0.1'},
                     {id: '8HJzHa4', delay: '0.1'}
                  ]
               },
               'kohai': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'kohai_yt',
                  color:     '658bd3',
                  frames:    [
                     {id: '64zpTtk', delay: '0.3'},
                     {id: '9G865mk', delay: '0.12'},
                     {id: 'xdhGWI5', delay: '0.12'},
                     {id: '5iJfJY3', delay: '0.12'},
                     {id: 'vI07nFv', delay: '0.12'},
                     {id: 'wKxUAry', delay: '0.12'},
                     {id: 'RUv4UVg', delay: '0.12'},
                     {id: 'frB66Ep', delay: '0.12'},
                     {id: 'Vnl66Df', delay: '0.12'},
                     {id: 'Nektn3N', delay: '0.12'},
                     {id: 'J2UfkzD', delay: '0.12'}
                  ]
               },
               'legend': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'turtleclan_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'cd2Jj41', delay: '0.02'},
                     {id: 'BFVi5ZK', delay: '0.02'},
                     {id: 'gWwc9X9', delay: '0.02'},
                     {id: 'IENbkme', delay: '0.02'},
                     {id: 'Zf0GySz', delay: '0.02'},
                     {id: 'C7g8eCl', delay: '0.02'},
                     {id: 'YRWVguy', delay: '0.02'},
                     {id: 'p60vq6D', delay: '0.02'},
                     {id: 'qNfGMGm', delay: '0.02'},
                     {id: 'UqnBoke', delay: '0.02'},
                     {id: 'sm4SOvA', delay: '0.02'},
                     {id: 'Mn7QR42', delay: '0.02'},
                     {id: 'iAfnoVF', delay: '0.02'},
                     {id: 'IjwC9tp', delay: '0.02'},
                     {id: 'J1CZ8hh', delay: '0.02'},
                     {id: '6gNbU66', delay: '0.02'},
                     {id: 'weyGhf9', delay: '0.02'},
                     {id: '6EjJ1M1', delay: '0.02'},
                     {id: 'MrOrIEd', delay: '0.02'}
                  ]
               },
               'trippy': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'trippy',
                  color:     'ffffff',
                  frames:    [
                     {id: 'aqEBJji', delay: '0.03'},
                     {id: 'BfSFI8I', delay: '0.03'},
                     {id: 'rHzEc0l', delay: '0.03'},
                     {id: '4Dc6iSW', delay: '0.03'},
                     {id: 'C5pbZPx', delay: '0.03'},
                     {id: 'mr588aN', delay: '0.03'},
                     {id: 'nIGIScj', delay: '0.03'},
                     {id: '4jCE9xX', delay: '0.03'},
                     {id: 'I3Dixlc', delay: '0.03'},
                     {id: 'ZXxLp0Q', delay: '0.03'}
                  ]
               },
               'trippy 2': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'trippy_2',
                  color:     'ffffff',
                  frames:    [
                     {id: '2MG25OA', delay: '0.03'},
                     {id: 'ypypCpM', delay: '0.03'},
                     {id: 'xjJyohm', delay: '0.03'},
                     {id: '46tVXfT', delay: '0.03'},
                     {id: 'gDwtKiL', delay: '0.03'},
                     {id: 'Jey9A4m', delay: '0.03'},
                     {id: 'eSwYkS3', delay: '0.03'},
                     {id: 'uId5x5t', delay: '0.03'}
                  ]
               },
               'aoyama': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'aoyama',
                  color:     '6a7aad',
                  frames:    [
                     {id: 'EZV44m5', delay: '0.08'},
                     {id: 'Be8YCIi', delay: '0.08'},
                     {id: 'aAUZMOY', delay: '0.08'},
                     {id: 'jRidrLf', delay: '0.08'},
                     {id: 'DSnCwbt', delay: '0.08'}
                  ]
               },
               'hestia': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'hestia',
                  color:     'ffffff',
                  frames:    [
                     {id: 'mHPki7d', delay: '0.13'},
                     {id: 'r68W6j3', delay: '0.13'},
                     {id: 'cnozXNA', delay: '0.13'},
                     {id: 'jzT28GE', delay: '0.13'},
                     {id: 'j4rMxd7', delay: '0.13'},
                     {id: '1yaH8Yj', delay: '0.13'},
                     {id: 'CBcsEd7', delay: '0.13'},
                     {id: 'yr6nREs', delay: '0.13'}
                  ]
               },
               'umaru': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'umaru',
                  color:     'e86b34',
                  frames:    [
                     {id: 'lzpVxie', delay: '0.1'},
                     {id: 'rUIggqs', delay: '0.1'},
                     {id: 'O5woXju', delay: '0.1'},
                     {id: 'opOYMbD', delay: '0.1'},
                     {id: 'g8nukXN', delay: '0.1'},
                     {id: 'j3jUhzB', delay: '0.1'}
                  ]
               },
               'megumin': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'megumin',
                  color:     '632d34',
                  frames:    [
                     {id: '08LhFca', delay: '0.1'},
                     {id: 'kE12JCT', delay: '0.1'},
                     {id: 'JG6acVn', delay: '0.1'},
                     {id: 'z3EAFKm', delay: '0.1'},
                     {id: '9hoQPlu', delay: '0.1'},
                     {id: 'EmdwHen', delay: '0.1'},
                     {id: 'cgaAF8j', delay: '0.1'},
                     {id: 'SgCq8Hy', delay: '0.1'},
                     {id: 'CCOOVBO', delay: '0.1'},
                     {id: 'elWHx2Y', delay: '0.1'}
                  ]
               },
               'neko': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'neko',
                  color:     '444250',
                  frames:    [
                     {id: 'l2kUHUa', delay: '0.2'},
                     {id: 'UHKbxIv', delay: '0.2'},
                     {id: 'zB4VlRl', delay: '0.2'},
                     {id: 'aVcKIMi', delay: '0.2'},
                     {id: '2V6yYIX', delay: '0.2'}
                  ]
               },
               'leekspin': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'leekspin',
                  color:     '8f5d99',
                  frames:    [
                     {id: 'acb7H09', delay: '0.1'},
                     {id: 'RvVtMsF', delay: '0.1'},
                     {id: '4dQ2gLM', delay: '0.1'},
                     {id: 'FXBj2HN', delay: '0.1'}
                  ]
               },
               'pizza 2': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'pizza_2',
                  color:     'ffffff',
                  frames:    [
                     {id: 'HKvlfSJ', delay: '0.1'},
                     {id: 'afS86PD', delay: '0.1'},
                     {id: 'wVmSKUf', delay: '0.1'},
                     {id: 'PkhWbF2', delay: '0.1'}
                  ]
               },
               'cat': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'trippy_cat',
                  color:     '000000',
                  frames:    [
                     {id: '841wvz3', delay: '0.05'},
                     {id: '2p7AaDh', delay: '0.05'},
                     {id: 'YcNy91Y', delay: '0.05'},
                     {id: 'FwiDalL', delay: '0.05'},
                     {id: 'j6Z5YfK', delay: '0.05'}
                  ]
               },
               '✧༄ᗫxxxxx　⇀㚂㜂': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'birthday_lol',
                  color:     'cd5d22',
                  frames:    [
                     {id: 'SJlS8Rg', delay: '0.08'},
                     {id: 'AiICKZb', delay: '0.08'},
                     {id: '1iVfy8b', delay: '0.08'},
                     {id: 'hwPSr3s', delay: '0.08'},
                     {id: 'wpJophT', delay: '0.08'},
                     {id: 'W9oLhpz', delay: '0.08'},
                     {id: 'DexE8Kb', delay: '0.08'},
                     {id: '7ybaqXq', delay: '0.08'}
                  ]
               },
				'℄🌀SCͥHRͣAͫMM': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'agarpros_yt',
                  color:     '000000',
                  frames:    [
                     {id: 'TBIlCYb', delay: '4'},
                     {id: 'NFXeciX', delay: '0.06'},
                     {id: 'tVJ1fru', delay: '0.06'},
                     {id: 'xOFUJtD', delay: '0.06'},
                     {id: 'POhhdVh', delay: '0.06'},
                     {id: 'mV17fbS', delay: '0.06'},
                     {id: 'G3lUEyj', delay: '0.06'},
                     {id: 'G4jxjM9', delay: '0.06'},
                     {id: 'WQA1R3N', delay: '0.06'}
                  ]
               },
               '℄🌀ℱ₳𝓗∀🌛': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'zombie',
                  color:     '004F0F',
                  frames:    [
                     {id: 'uVqUXBN', delay: '3'},
                     {id: 'QclZjeR', delay: '0.1'},
                     {id: 'iXdYrD8', delay: '0.1'},
                     {id: 'vF0ZIcs', delay: '0.1'},
                     {id: 'iXdYrD8', delay: '0.1'},
                     {id: 'QclZjeR', delay: '0.1'}
                  ]
               },			   
               '℄🌀jimboy3100': {
                  cached:    false,
                  ready:     false,
                  current:   0,
                  timestamp: 0,
                  id:        'birthday_troll',
                  color:     '7a0c0f',
                  frames:    [
                     {id: 'KxcI3j7', delay: '4'},
                     {id: 'aE1etcH', delay: '0.1'},
                     {id: 'ZA1rlQ0', delay: '0.1'},
                     {id: '8NUCHKe', delay: '0.1'},
                     {id: 'ZbeXIpc', delay: '0.1'},
                     {id: 'iQWIiAu', delay: '0.1'},
                     {id: 'ZbeXIpc', delay: '0.1'},
                     {id: '8NUCHKe', delay: '0.1'},
                     {id: 'ZA1rlQ0', delay: '0.1'},
                     {id: 'aE1etcH', delay: '0.1'}
                  ]
               }			   
            },
            cache:      {},
            prototypes: {
               canvas: (CanvasRenderingContext2D.prototype),
               old:    {}
            }
         },
         f: {
            prototype_override: function(type, name, runat, callback) {
               if ( !(type in tcm.l.prototypes.old) )       tcm.l.prototypes.old[type]       = {};
               if ( !(name in tcm.l.prototypes.old[type]) ) tcm.l.prototypes.old[type][name] = tcm.l.prototypes[type][name];
               tcm.l.prototypes[type][name] = function() {
                  (runat == 'before' && callback(this, arguments));
                  tcm.l.prototypes.old[type][name].apply(this, arguments);
                  (runat == 'after'  && callback(this, arguments));
               };
            },
            hex_to_lightness: function(hex) {
               var rgb = parseInt(hex, 16);
               var r   = (rgb >> 16) & 0xff;
               var g   = (rgb >>  8) & 0xff;
               var b   = (rgb >>  0) & 0xff;
               return (0.2126 * r + 0.7152 * g + 0.0722 * b);
            },
            new_img: function(id) {
               var img         = new Image();
               img.crossOrigin = 'anonymous';
               img.src         = 'http://i.imgur.com/' + id + '.png';
               return img;
            },
            cache_skin: function(skin) {
               for ( var i = 0; i < tcm.l.skins[skin].frames.length; i++ ) {
                  var id = tcm.l.skins[skin].frames[i].id;
                  if ( !(id in tcm.l.cache) ) {
                     tcm.l.cache[id] = tcm.f.new_img(id);
                  }
               }
               return true;
            },
            skin_ready: function(skin) {
               var ready = 0;
               for ( var i = 0; i < tcm.l.skins[skin].frames.length; i++ ) {
                  var id = tcm.l.skins[skin].frames[i].id;
                  if ( tcm.l.cache[id].complete && tcm.l.cache[id].width > 1 ) {
                     ++ready;
                  }
               }
               return (ready == tcm.l.skins[skin].frames.length ? true : false);
            },
            override: function() {
               tcm.f.prototype_override('canvas', 'drawImage', 'before', function(a, b) {
                  if ( 'src' in b['0'] && (c = decodeURIComponent(b['0'].src).match(/^https?\:\/\/i\.imgur\.com\/.+\.png\?(.+)$/i)) && c['1'] in tcm.l.skins ) {
                     if ( !tcm.l.skins[c['1']].cached ) {
                        tcm.l.skins[c['1']].cached = tcm.f.cache_skin(c['1']);
                     }
                     if ( !tcm.l.skins[c['1']].ready ) {
                        tcm.l.skins[c['1']].ready = tcm.f.skin_ready(c['1']);
                     }
                     if ( tcm.l.skins[c['1']].ready ) {
                        b['0'] = tcm.l.cache[tcm.l.skins[c['1']].frames[tcm.l.skins[c['1']].current % tcm.l.skins[c['1']].frames.length].id];
                     }
                     if ( ((Date.now() - tcm.l.skins[c['1']].timestamp) / 1000) % 60 >= tcm.l.skins[c['1']].frames[tcm.l.skins[c['1']].current % tcm.l.skins[c['1']].frames.length].delay ) {
                        ++tcm.l.skins[c['1']].current;
                        tcm.l.skins[c['1']].timestamp = Date.now();
                     }
                  }
               });
            },
            register_skins: function() {
               for ( key in tcm.l.skins ) {
                  w.core.registerSkin(key, '%tcm_' + tcm.l.skins[key].id, 'http://i.imgur.com/' + (tcm.f.hex_to_lightness(tcm.l.skins[key].color) < 50 ? 'bZuiJHx' : 'NwivnjV') + '.png?' + key, 3, '0x' + tcm.l.skins[key].color);
               }
            },
            inject_html: function() {
               var html = '<br/><br/>';
               html    += '<select class="form-control" id="movingskins" onchange="document.getElementById(\'nick\').value = this.options[this.selectedIndex].value;">';
               html    += '<option value="">---------------- Select Animated Skin ----------------</option>';
               for ( key in tcm.l.skins ) {
                  html += '<option value="' + key.toUpperCase() + '">' + key + ' (' + tcm.l.skins[key].frames.length + ' frames)</option>';
               }
               html += '</select>';
               document.getElementById('openShopBtn').insertAdjacentHTML('afterend', html);
            },
         }
      };
      tcm.f.override();
      tcm.f.register_skins();
      tcm.f.inject_html();
   }
   else {
      w.setTimeout(function() {
         agarXTRA(w);
		 $("#movingskins").css( { marginTop : "-15px" } );
		$("#movingskins").css( { marginBottom : "-30px" } );
      }, 100);
   }
   setTimeout(function() { 
    //hide extra names
    $('#movingskins>option:nth-child(68)').hide();
	$('#movingskins>option:nth-child(69)').hide();
	$('#movingskins>option:nth-child(70)').hide();
	$('#movingskins>option:nth-child(71)').hide();
   }, 300);
})(window);

}
