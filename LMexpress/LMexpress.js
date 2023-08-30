/**************
 * Legend express v1.93e by Jimboy3100   email:jimboy3100@hotmail.com
 *************/
var semimodVersion = "16"; // the version 1.1-> 1.11


loadericon();

//Authenticate Mod Script

getaccesstoken();

/*
var CutNameConflictwithMessage=false;
(function(){
    var _privateLog = console.log;
    console.log = function (message) {
		if (CutNameConflictwithMessage==false){
		if (~message.indexOf("OGARio by szymy")){
		console.log = _privateLog;
		}
		else{
			_privateLog.apply(console, arguments);
		}
		}
    };
})();

(function(){
    var _privateLog = console.log;
    console.log = function (message) {
		if (~message.indexOf("OGARio by szymy")){
		}
		else{
			_privateLog.apply(console, arguments);
		}
    };
})();
*/
//chat Translations
findUserLang();
if (window.userLanguage){
	startTranslating()
}

window.proLicenceUID = localStorage.getItem("proLicenceUID");	
if (window.proLicenceUID=="null") window.proLicenceUID=null
var currentIP = "0.0.0.0:0";
var currentIPopened;
var currentToken = "";
var previousMode = localStorage.getItem("gamemode");

var checkonlyonce = localStorage.getItem("checkonlyonce");
var checkonlyfourtenth = localStorage.getItem("checkonlyfourtenth");
var checkonlyeleventh = localStorage.getItem("checkonlyeleventh");
var checkonlyrewardday2 = localStorage.getItem("checkonlyrewardday2");
var defaultMusicUrl = "https://www.youtube.com/watch?v=nj33MArNjC8";
var musicPlayer;

var stateObj = {
    foo: "bar"
};

var minimapbckimg = "";
var leadbimg = "";
var teambimg = "";
var canvasbimg = "";
var pic1urlimg = "https://i.imgur.com/RVBi3T1.gif";
var pic2urlimg = "https://i.imgur.com/p2T29QE.gif";
var pic3urlimg = "https://i.imgur.com/EucIfYY.gif";
var pic4urlimg = "https://i.imgur.com/KOoBDaK.gif";
var pic5urlimg = "https://i.imgur.com/CS03xWv.gif";
var pic6urlimg = "https://i.imgur.com/tfMUu2J.gif";
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
var yt6data = "Promotional";
var lastIP = localStorage.getItem("lastIP");
var previousnickname = localStorage.getItem("previousnickname");
var minbtext = localStorage.getItem("minbtext");
var leadbtext = localStorage.getItem("leadbtext");
var teambtext = localStorage.getItem("teambtext");
var imgUrl = localStorage.getItem("imgUrl");
var imgHref = localStorage.getItem("imgHref");
var showToken = localStorage.getItem("showTK");
var showPlayer = localStorage.getItem("showPlayer");
var SHOSHOBtn = localStorage.getItem("SHOSHOBtn");
var XPBtn = localStorage.getItem("XPBtn");
var MAINBTBtn = localStorage.getItem("MAINBTBtn");
var AnimatedSkinBtn = localStorage.getItem("AnimatedSkinBtn");

var TIMEcalBtn = localStorage.getItem("TIMEcalBtn");


var timesopened = localStorage.getItem("timesopened");
var url = localStorage.getItem("url");

var modVersion;
if (document.URL.includes('legendmod.ml') || document.URL.includes('jimboy3100.github.io')){
	if (location.protocol !== 'https:') {
		toastr.warning("Legend mod over http. Many functions cannot work properly. To join Non SSL servers use <font color='blue'>ws://</font> in front of websocket.<br>e.g <font color='blue'>ws://34.89.203.157:3000/</font>").css("width", "350px");
	}
	$("#region").val("Private").change()
	$("#region").hide()
	//$(".row").hide()
	modVersion="1.8"
	init(modVersion)
	$(".btn.btn-warning.btn-spectate.btn-needs-server").children()[0].className = "ogicon-eye"
    setTimeout(function() {
        legendmod.gameMode=":party"
    }, 5000);	
    $("#gamemode").change(function() {
        setTimeout(function() {
            legendmod.gameMode=":party"
        }, 2000);
    });	
	
	$(".btn.btn-warning.btn-login-play.btn-needs-server").hide()
	$(".btn.btn-play-guest.btn-success.btn-needs-server").css("width","100%")
	$(".btn.btn-play-guest.btn-success.btn-needs-server").text("Play")
	$("#ogario-party").hide()
	$("#openskinchanger").hide()
	$(".quick.quick-bots.ogicon-trophy").hide()
	$(".agario-panel.radio-panel").hide()
	$(".agario-panel.ogario-yt-panel").hide()
	$(".profile-tab").hide()
	$(".menu-tabs").children().css("width","16.6%")
	$("#gamemode").css("width","70%")
	$("#gamemode").css("width","87%")
	$('#hotkeys-cfg').children().show();
	
	
}
var region = getParameterByName("r", url);
var realmode = getParameterByName("m", url);
var realmodePS = realmode
var searchStr = getParameterByName("search", url);
var searchSip = getParameterByName("sip", url);

var clanpass = getParameterByName("pass", url);
var searchedplayer = getParameterByName("player", url);
var autoplayplayer = getParameterByName("autoplayer", url);
var replayURL = getParameterByName("replay", url);
var replayStart = getParameterByName("replayStart", url);
var replayEnd = getParameterByName("replayEnd", url);

var realmode2 = "";
var mode = ""; //just in case
var token = "";
var messageone = 1; //If legendmod is being used
var troll1;
var seticon = "YES";
var setmessagecom = "YES";
var setyt = "YES";
var searching;
var timerId;
TimerLM = {};
var playerState = 0;
var MSGCOMMANDS = "";
var MSGCOMMANDS2;
var MSGCOMMANDS;
var MSGNICK;
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
var legmaincolor = $("#hudMainColor ").val();
var dyinglight1load = localStorage.getItem("dyinglight1load");
var url2;
var semiurl2;
var PostedThings;
//var Ultimouseenabled = 0;
var setscriptingcom = "YES";
var usedonceSkin = 0;
var detailed = "";
var detailed1;

userData = {};
userData = JSON.parse(localStorage.getItem("userData"));
var userip = "0.0.0.0:0";
var usercity = "NotFound";
var usercountry = "NotFound";
var userfirstname = localStorage.getItem("userfirstname");
var userlastname = localStorage.getItem("userlastname");
var usergender = localStorage.getItem("usergender");
var userid = localStorage.getItem("userid");
var fbresponse = {};

var CopyTkPwLb2;
var languagemod = localStorage.getItem("languagemod");
//for MsgCommands
var MSGCOMMANDS2a;
var MSGCOMMANDSA;
var MSGCOMMANDS2;
var MSGCOMMANDS3;
var Express = "True";

//for the LM JSON
var LegendJSON;
var LegendSettings = "true";
var LegendSettingsfirstclicked = "false";
var switcheryLegendSwitch, switcheryLegendSwitch2;

var showonceusers3 = 0;
var client2;
var xhttp = new XMLHttpRequest();




var animatedserverchanged = false;

if (timesopened != null) {
   timesopened++;
   localStorage.setItem("timesopened", timesopened);
} else if (timesopened == null) {
   localStorage.setItem("timesopened", "0");
}
loadersettings();

//
function postSNEZ(server, username, password, data) {
    xhttp.open("POST", server, false);
    xhttp.setRequestHeader("username", username);
    xhttp.setRequestHeader("password", password);
    xhttp.send(data);
}

function getSNEZ(server, username, password) {
    xhttp.open("GET", server, false);
    xhttp.setRequestHeader("username", username);
    xhttp.setRequestHeader("password", password);
    xhttp.send();
}


//Animated color texts
var tcm2 = {
    prototypes: {
        canvas: (CanvasRenderingContext2D.prototype),
        old: {}
    },
    f: {
        prototype_override: function(type, name, runat, callback) {
            if (!(type in tcm2.prototypes.old)) tcm2.prototypes.old[type] = {};
            if (!(name in tcm2.prototypes.old[type])) tcm2.prototypes.old[type][name] = tcm2.prototypes[type][name];
            tcm2.prototypes[type][name] = function() {
                (runat == 'before' && callback(this, arguments));
                tcm2.prototypes.old[type][name].apply(this, arguments);
                (runat == 'after' && callback(this, arguments));
            };
        },
        gradient: function(a) {
            var c = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
            var g = a.createLinearGradient(0, 0, a.canvas.width, 0);
            g.addColorStop(0, c[Math.floor(Math.random() * c.length)]);
            g.addColorStop(1, c[Math.floor(Math.random() * c.length)]);
            return g;
        },
        override: function() {
            tcm2.f.prototype_override('canvas', 'fillText', 'before', function(a, b) {
                if (a.canvas.id != "minimap" && a.canvas.id != "minimap-sectors" && a.canvas.id != "ao2t-minimap") {
                    a.fillStyle = tcm2.f.gradient(a);
                }
            });
        }
    }
};

urlIpWhenOpened();

//emphasischat();
//specialeffecttargeting();
function startLM(modVersion) {
	if (!window.LMstarted){
		window.LMstarted=true
    // ANNOUNCEMENTS
    //toastr.info('<b><font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://legendmod.ml/banners/particles.gif);">'+'Legend mod </span></font> is back!<br><font color="red"></b>Enable Vanilla skins on Settings</font>').css("width", "350px");
		window.LMVersion=modVersion;
		if (modVersion != "1.8") {	
			toastr.info('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.8</b></font>. <br>visit: <a target="_blank" href="https://www.legendmod.ml"><font color="yellow"><b><u>www.legendmod.ml</u></b></font></a>');
		}
		//$("#ogario-party").wrap('<div style="display: none;" id="hidendivtoken"></div>');
		//universalchat();
		adminstuff();
		return initializeLM(modVersion);
	}
}


function getEmbedUrl(url) {
    url = url.trim();
    var musicParams = "showinfo=0&controls=0&rel=0&vq=tiny&enablejsapi=1";
    //var musicParams = "showinfo=0&controls=2&vq=tiny&enablejsapi=1&autoplay=1";
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

function loadersettings() {
        if (timesopened >= 3) {
            if (checkonlyonce != "true") {
                //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
                if (SHOSHOBtn != "true") {
                    toastr.error(Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                        timeOut: 15000,
                        extendedTimeOut: 15000
                    }).css("width", "300px");
                    checkonlyonce = "true";
                    localStorage.setItem("checkonlyonce", checkonlyonce);
                }
            }
        }	
        /*if (checkonlyfourtenth != "true") {
		toastr.info('<center><b>'+
		'Try <font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://legendmod.ml/banners/particles.gif);">Unlimited FPS</font></span>:<br>'+
		'Change  frame per sec, to <u><font color="blue">unlimited</font></u><br>'+
		'on <u><font color="blue">settings tab</font></u'+
		'</b></center>', '', {
                    timeOut: 20000,
                    extendedTimeOut: 20000
        }).css("width", "450px");	
		
			//LMadvertisementMegaFFA();
        //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
        toastr.info('<center><b>'+
		'IF HOTKEYS <font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://legendmod.ml/banners/particles.gif);">NOT WORKING</font></span>:<br>'+
		'Change theme, <u><a target="_blank" href="https://legendmod.ml/themes/"><font color="blue">click here</font></u></a><br>'+
		'or <u><font color="green">chrome://settings/clearBrowserData </font></u>delete cookies'+
		'<br>or <u><font color="green">Settings->Import/Export->Download </font></u> your latest saved setting</b></center>', '', {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "450px");
				
				
		checkonlyfourtenth = "true";
		localStorage.setItem("checkonlyfourtenth", checkonlyfourtenth);				
       // }					
		}
*/		
		if(checkonlyrewardday2 != "true"){
			LMrewardDay();
			checkonlyrewardday2 = "true";
			localStorage.setItem("checkonlyrewardday2", checkonlyrewardday2);					
		}
        if (checkonlyeleventh!= "true") {
			//VideoSkinsPromo();		
		checkonlyeleventh = "true";
		localStorage.setItem("checkonlyeleventh", checkonlyeleventh);				
       // }					
		}		
        if (timesopened == 10 || timesopened == 100 || timesopened == 1000) {
            //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
            if (SHOSHOBtn != "true") {
                toastr.error(Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                    timeOut: 15000,
                    extendedTimeOut: 15000
                }).css("width", "300px");
                checkonlyonce = "true";
                localStorage.setItem("checkonlyonce", checkonlyonce);
            }
        }
}

function loadericon() {
    //continue loadericon
        /*$("#imagebig").fadeOut(1500);
        setTimeout(function() {
            $("#imagebig").remove();
        }, 1600); */
}

function PremiumUsersFFAScore() {
	if (window.proLicenceUID && window.proLicenceUID.includes("MegaFFA")){
		if (PremiumLimitedDateStart && !isNaN(parseInt(PremiumLimitedDateStart))){
			//var tempdateNow = parseInt(new Date().toISOString().slice(0,new Date().toISOString().indexOf("T")).replace(/-/g,""))
			var tempdateNow = new Date().toISOString().slice(0,new Date().toISOString().indexOf("T")).replace(/-/g,"")
			
			var tempdateNow2 = parseInt(tempdateNow.slice(6, 8)) - 6
			var tempdateNow3 = parseInt(tempdateNow.slice(0, 6)) * 100
			
			if (tempdateNow2 < 0){
				tempdateNow2 = tempdateNow2 - 70				
			}	
			tempdateNow2 = tempdateNow3 + tempdateNow2
			var temp = parseInt(PremiumLimitedDateStart)

			if (PremiumLimitedDateStart && parseInt(PremiumLimitedDateStart) < tempdateNow2 && window.proLicenceUID){
				window.proLicenceUID = null
				toastr.warning("<b>[SERVER]:</b> Your Giveaway licence has ended. Thank you for using our mod!").css("width", "350px");
			}		
		}
		else{
			window.proLicenceUID = null		
		}
		localStorage.setItem("proLicenceUID", window.proLicenceUID);
	}
}
function PremiumUsers() {		
	if (!window.proLicenceUID || window.proLicenceUID.includes("Give")){

		if (window.agarioUID && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]){
			
			if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason.includes("Give")){
				var YYYYMMDD=parseInt(new Date().toISOString().slice(0,new Date().toISOString().indexOf("T")).replace(/-/g,""));
				var expDate = parseInt(ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason.split('@')[1])
				if (expDate && expDate < YYYYMMDD && window.proLicenceUID){
					window.proLicenceUID = null
					toastr.warning("<b>[SERVER]:</b> Your Giveaway licence has ended. Thank you for using our mod!").css("width", "350px");
				}
				else if (expDate && expDate >= YYYYMMDD){
					if (!window.proLicenceUID){						
						window.proLicenceUID = "Give"
						expDate = ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason.split('@')[1]
						toastr.warning("<b>[SERVER]:</b>  Your licence is stored as Giveaway Premium until " + expDate.slice(0, 2) + "/" + expDate.slice(2, 4) + "/" + expDate.slice(4, 8) + ". Thank you for using our mod!").css("width", "350px");
					}
					else{						
					}
				}
			}
			else{
				window.proLicenceUID = ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason			
					localStorage.setItem("proLicenceUID", true);		
					toastr.warning("<b>[SERVER]:</b> Your licence is stored as Premium. Thank you for using our mod!").css("width", "350px");
			}
		}	
		localStorage.setItem("proLicenceUID", window.proLicenceUID);
	}
}
function PremiumUsersLMscore(){
	if (!window.proLicenceUID){
		localStorage.setItem("proLicenceUID", true);
		toastr.warning("<b>[SERVER]:</b> Congratulations! Your LM level is " + window.LMscore + ". Your licence is stored as Premium permanently. Thank you for using our mod!").css("width", "350px");
	}
}
function getaccesstoken() {
    $.ajax({
        type: "GET",
        url: "https://legendmod.ml/AjaxData/accesstoken.html",
        datatype: "json",
        success: function(info) {
			var accesstomod = info[17];
            getaccesstoken2(accesstomod);
        }
    });
}

function getaccesstoken2(accesstomod) {
    if (accesstomod != "a" && accesstomod != null) {
        toastr.error('<b>[' + Premadeletter123 + ']:</b> ' + Premadeletter88 + ', <br>' + Premadeletter118 + ': <a target="_blank" href="https://legendmod.ml/legendmod.user.js"><font color="blue"><b><u>www.legendmod.ml</u></b></font></a><br>' + Premadeletter89).css("width", "300px");
            document.documentElement.innerHTML = "";
    }
}

function enableshortcuts() {
    if ($("#IPBtn").attr('aria-pressed') == "false") {
        $("#IPBtn").click();
    }
    if ($("#SHOSHOBtn").attr('aria-pressed') == "false") {
        $("#SHOSHOBtn").click();
    }
    if ($("#MAINBTBtn").attr('aria-pressed') == "false") {
        $("#MAINBTBtn").click();
    }
    if ($("#XPBtn").attr('aria-pressed') == "false") {
        $("#XPBtn").click();
    }


}

function adres(info, thismode, thisregion) {
    var info, thismode, thisregion;
    if (thismode == null || thisregion == null) {
        joinSERVERfindinfo();
    }
    if ($("#gamemode").val() != ":party") {
        setTimeout(function() {
            currentIP = "live-arena-" + $("#server-token").val() + ".agar.io";
			if (!legendmod.integrity){ currentIP = $("#server-token").val();}
                if (realmode != ":party") {
                    if (!thismode) {
                        realmode = $("#gamemode").val();
                    } else {
                        realmode = thismode;
                    }
                    if (!thisregion) {
                        region = $("#region").val();
                    } else {
                        region = thisregion;
                    }
                    if (currentIPopened == true) {
						if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);	
                        else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                        return currentIPopened = false;
                    } else if (thismode != null && thisregion != null) {
						if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                        else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);

                    } else {
						if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP);
                        else history.pushState(stateObj, "page 2", "?sip=" + currentIP);
                        realmode = null;
                        region = null;
                        return realmode, region;
                    }
                } else if (realmode == ":party") {
                    window.history.pushState(null, null, window.location.pathname);							
					window.location.href="https://agar.io/#"+ $('#party-token').val()
                }

        }, 1800);
    } else { //if party
        setTimeout(function() {             
            window.history.pushState(null, null, window.location.pathname);	
			window.location.href="https://agar.io/#"+ $('#party-token').val()
        }, 2000);
    }
}


function LMserverbox() {
	//window.LMstarted
    (function(a, c) {
        function r(a, d) {
            if (d) {
                var f = new Date;
                f.setTime(f.getTime() + 864E5 * d);
                f = "; expires=" + f.toGMTString()
            } else f = "";
            document.cookie = "agario_redirect=" + a + f + "; path=/"
        }
        joinSIPonstart();
        joinPLAYERonstart();
		joinreplayURLonstart();

    })(window, window.jQuery);
}

function urlIpWhenOpened() {

    setTimeout(function() {
            currentIP = "live-arena-" + $("#server-token").val() + ".agar.io";
			if (!legendmod.integrity){ currentIP = $("#server-token").val();}
            if (searchSip != null) {
                if (region == null) {
					if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + searchSip);	
					else history.pushState(stateObj, "page 2", "?sip=" + searchSip);              
                } else {
					if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + searchSip + "&?r=" + region + "&?m=" + realmode);
                    else history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&?r=" + region + "&?m=" + realmode);
                }
            } else if (searchSip == null) {
				if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + $('#gamemode').val());
                else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + $('#gamemode').val());
                region = $('#region').val();
                realmode = $('#gamemode').val();
                return region, realmode;
            } else{
                if (realmode != ":party") {
					if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                    else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                }
            }

        }, //5000
        6000); //8000
}

function play() {
    $('*[data-itr="page_play"]').click();
}

function changeServer() {
    $("#server-reconnect").click();
    appendLog($("#leaderboard-positions").text());
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
    appendLog($("#leaderboard-positions").text());
    $("#joinPartyToken").val(token);
    $("#join-party-btn").click();
    $("#joinPartyToken").val("");
    $("#gamemode").val("");
    currentToken = token;
    $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
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

    if (searchStr.startsWith("https://agar.io/#")) {
        joinpartyfromconnect(searchStr.replace("https://agar.io/#", ""));
        realmodereturn();

    } else if (searchStr.startsWith("agar.io/#")) {
        joinToken(searchStr.replace("agar.io/#", ""));
        realmodereturn();
    } else {
        return false;
    }
    $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
    return true;
}

function realmodereturn() {
    region = $("#region").val();
    realmode = $("#gamemode").val();
    return realmode, region;
}

function realmodereturnfromStart() {
    region = getParameterByName("r", url);
    realmode = getParameterByName("m", url);
    return region, realmode;
}


function searchIPHandler(searchStr) { //VERY WEIRD FUNCTION, MOD DOESNT LOAD IF CHANGED
    region = $("#regioncheck").val(); //...
    realmode = $("#gamemodecheck").val(); //...
    $("#Backtomenu").hide();
    hideMenu();
    showSearchHud();
    searchStr = searchStr.trim();
    if (isValidIpAndPort(searchStr)) {
        findIP(searchStr);
    } else if (isValidIpAndPort(searchStr.replace("wss://", ""))) {
        findIP(searchStr.replace("wss://", ""));
    } else if (isValidIpAndPort(searchStr.replace("agar.io/?search=wss://", ""))) {
        findIP(searchStr.replace("agar.io/?search=wss://", ""));
    } else if (isValidIpAndPort(searchStr.replace("https://agar.io/?search=wss://", ""))) {
        findIP(searchStr.replace("https://agar.io/?search=wss://", ""));
    } else if (getParameterByName("search", searchStr)) {
        if (region) {
            $('#region option[value="' + region + '"]').prop('selected', 'selected').change();
			if (!document.URL.includes('legendmod.ml')){
				getInfo();
			}		
            
			
        }
        findIP(ip.replace("wss://", ""));
    } else {
        return false;
    }
    return true;

}

function findIP(searchIP) {

    if (realmode == ":party") {
        $('#gamemode option[value=":party"]').prop('selected', 'selected').change();
    }
    if (realmode == ":ffa") {
        $('#gamemode option[value=""]').prop('selected', 'selected').change();
    }
    if (realmode == ":teams") {
        $('#gamemode option[value=":teams"]').prop('selected', 'selected').change();
    }
    if (realmode == ":experimental") {
        $('#gamemode option[value=":experimental"]').prop('selected', 'selected').change();
    }
    if (!searching) {
        if ($.trim(searchIP) == '') {} else {
            //            showCancelSearch();
            searching = true;
            var interval = 1800;
            var maxTries = 8;
            var numTries = 0;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter21 + " \'wss://" + searchIP + "\'...").css("width", "210px");
            numTries++;
            if (currentIP == searchIP) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                searching = false;
                //                hideCancelSearch();
                //hideSearchHud();
                toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
            } else {
                changeServer();
                timerId = setInterval(function() {
                    if (numAttempts == maxAttempts) {
                        numAttempts = 0;
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr.error(Premadeletter31).css("width", "210px");
                        }
                        if (currentIP == searchIP) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();							
                            toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                        } else {
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
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        clearInterval(timerId);
        searching = false;
        //        hideCancelSearch();
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        toastr.error(Premadeletter32 + "!").css("width", "210px");
    }
}

function searchPlayer(searchString) {
    if (!searching) {
        if ($.trim(searchString) == '') {} else {
            //            showCancelSearch();
            searching = true;
            //var interval = 2500;
            var interval = 1800;
            var maxTries = 8;
            var numTries = 0;
            var minNamesFound = 3;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter30 + " \'" + searchString + "\'...").css("width", "210px");
            var leaderboard = $("#leaderboard-positions").text();
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
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                searching = false;
                //                hideCancelSearch();
                //hideSearchHud();
                toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //		testmessage();
                $("#gamemode").val("nothing");
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function() {
                    if (numAttempts == maxAttempts) {

                        numAttempts = 0;
                        leaderboard = $("#leaderboard-positions").text();
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
                            //                            hideCancelSearch();
                            toastr.error(Premadeletter31).css("width", "210px");
                        }
                        if (found) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            //                            hideCancelSearch();
                            //hideSearchHud();
                            toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                        } else {
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                    }
                }, interval);
            }
        }

    } else {
        clearInterval(timerId);
        searching = false;
        //        hideCancelSearch();
        toastr.error(Premadeletter32).css("width", "210px");
    }
}

function copyToClipboard(element) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    var html = $(element).html();
    html = html.replace(/<br>/g, "\n"); // or \r\n
    console.log(html);
    $temp.val(html).select();
    document.execCommand("copy");
    $temp.remove();
}

function copyToClipboardAll() {
    $("#CopyTkPwLb").remove();
    if ($("#top5-pos").text() != "") {
        $("#server-join").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + CopyTkPwLb2 + '<br>Leaderboard: ' + $("#leaderboard-positions").text() + '<br>Teamboard:' + $("#top5-pos").text() + '<br>My Game Name: ' + $("#nick").val() + '</er>');
    } else {
        $("#server-join").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + CopyTkPwLb2 + '<br>Leaderboard: ' + $("#leaderboard-positions").text() + '<br>My Game Name: ' + $("#nick").val() + '</er>');
    }
    copyToClipboard('er#CopyTkPwLb');
}

function foundName(leaderboard, name) {
    return leaderboard.includes(name);
}

function playYoutube() {
    if (musicPlayer != undefined) {
        var playerState = musicPlayer.getPlayerState();
        if (playerState != 1) {
            musicPlayer.playVideo();
        } else {
            musicPlayer.pauseVideo();
        }
    }
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
    return (countFound >= minNamesFound) ? true : false;
}




function joinpartyfromconnect(thismode) {
    $("#party-token").val($("#server").val());
    $("#join-party-btn-2").click();
	legendmod.gameMode = ":party";
    return realmode = legendmod.gameMode;	
}

function BeforeReportFakesSkin() {
	ReportFakesSkin();
	/*
    if ($("#skin").val() != "https://legendmod.ml/banners/iconfake1.png") {
        toastr.info(Premadeletter95 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter96).css("width", "350px"); // erase the 's		
        copy("https://legendmod.ml/banners/iconfake1.png");
    } else {
        ReportFakesSkin();
    }
	*/
}

function ReportFakesSkin() {
    var Temporaryletter1;
    var Temporaryletter2;
    var Languageletter320; //Leaderboard
    var Languageletter321; //Teamboard
    if (Languageletter320 != null) {
        Temporaryletter2 = Languageletter320
    } else {
        Temporaryletter2 = "Leaderboard";
    }
    if (Languageletter321 != null) {
        Temporaryletter1 = Languageletter321
    } else {
        Temporaryletter1 = "Teamboard";
    }

    $("#menu-footer").after('<div id="SkinChanger" style="display: none; background-image: url(' + legbgpic + '); background-color: ' + legbgcolor + '; border: 1px solid black; height: 540px; width: 500px; ";>' +
        '<div id="SkinChangerhud" style="display:block; margin-left: 10px; margin-right: 10px;">' + //margin-left: 10px"
        '<div id="SkinChangertoolshud1" align="middle"><h5 class="main-color"><b>' + Premadeletter119 + '</b></h5>' +
        '<p style="color:white; font-size:12px; margin-bottom: -4px;" align="middle">' + Premadeletter120 +
        //'<br><br><font id= "Leadboardlet1" style="color:white; size:12px; margin-right: 70px;">' + Temporaryletter2 + '</font><font id= "Teamboardlet1" style="color:white; size:12px; margin-left: 70px;">' + Temporaryletter1 + '</font></p><br>' +
		'<br><br><font id= "Leadboardlet1" style="color:white; size:12px; ">' + Temporaryletter2 + '</p><br>' +
        '<input id="LeaderboardInput1" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline; " " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput1" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput2" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput2" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput3" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput3" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput4" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput4" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput5" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput5" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput6" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput6" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput7" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput7" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput8" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput8" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput9" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
       // ' <input id="TeamboardInput9" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput10" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput10" class="form-control" placeholder="Nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '</div><p style="color:white; font-size:12px";" align="middle">' + Premadeletter121 + '<br>' + Premadeletter122 + '</u></p>' +
        '</div></div>');
	$('#LeaderboardInput1').css('width', '60%');
    $('#LeaderboardInput2').css('width', '60%');
    $('#LeaderboardInput3').css('width', '60%');
    $('#LeaderboardInput4').css('width', '60%');
    $('#LeaderboardInput5').css('width', '60%');
    $('#LeaderboardInput6').css('width', '60%');
    $('#LeaderboardInput7').css('width', '60%');
    $('#LeaderboardInput8').css('width', '60%');
    $('#LeaderboardInput9').css('width', '60%');
    $('#LeaderboardInput10').css('width', '60%');		
    /*$('#LeaderboardInput1').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput2').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput3').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput4').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput5').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput6').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput7').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput8').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput9').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput10').copyCSS('#server-token').css('width', '60%');
	
    $('#TeamboardInput1').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput2').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput3').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput4').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput5').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput6').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput7').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput8').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput9').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput10').copyCSS('#server-token').css('width', '30%');
	*/
    $("#SkinChangerhud").after('<button id="SkinBacktomenu" onclick="exitSkinChanger(); return false" class="btn btn-danger"  style="margin-left: 10px;" data-original-title="" title="">' + Premadeletter113 + '</button>');
    OthersSkinChanger();
    SkinBtnsPut();
    OpenSkinChanger();
}
function SkinBtnsPut() {
    $("#LeaderboardInput1").after('<button id="LeaderboardIconFake1" class="btn btn-info" style="background-color: transparent;" onclick="Leader11();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput2").after('<button id="LeaderboardIconFake2" class="btn btn-info" style="background-color: transparent;" onclick="Leader12();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput3").after('<button id="LeaderboardIconFake3" class="btn btn-info" style="background-color: transparent;" onclick="Leader13();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput4").after('<button id="LeaderboardIconFake4" class="btn btn-info" style="background-color: transparent;" onclick="Leader14();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput5").after('<button id="LeaderboardIconFake5" class="btn btn-info" style="background-color: transparent;" onclick="Leader15();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput6").after('<button id="LeaderboardIconFake6" class="btn btn-info" style="background-color: transparent;" onclick="Leader16();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput7").after('<button id="LeaderboardIconFake7" class="btn btn-info" style="background-color: transparent;" onclick="Leader17();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput8").after('<button id="LeaderboardIconFake8" class="btn btn-info" style="background-color: transparent;" onclick="Leader18();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput9").after('<button id="LeaderboardIconFake9" class="btn btn-info" style="background-color: transparent;" onclick="Leader19();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput10").after('<button id="LeaderboardIconFake10" class="btn btn-info" style="background-color: transparent;" onclick="Leader20();return false;"><i class="fa fa-wpexplorer"></i></button>');


    $("#TeamboardInput1").before('<button id="TeamboardIconFake1" class="btn btn-info" style="background-color: transparent;" onclick="Teamer11();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput2").before('<button id="TeamboardIconFake2" class="btn btn-info" style="background-color: transparent;" onclick="Teamer12();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput3").before('<button id="TeamboardIconFake3" class="btn btn-info" style="background-color: transparent;" onclick="Teamer13();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput4").before('<button id="TeamboardIconFake4" class="btn btn-info" style="background-color: transparent;" onclick="Teamer14();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput5").before('<button id="TeamboardIconFake5" class="btn btn-info" style="background-color: transparent;" onclick="Teamer15();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput6").before('<button id="TeamboardIconFake6" class="btn btn-info" style="background-color: transparent;" onclick="Teamer16();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput7").before('<button id="TeamboardIconFake7" class="btn btn-info" style="background-color: transparent;" onclick="Teamer17();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput8").before('<button id="TeamboardIconFake8" class="btn btn-info" style="background-color: transparent;" onclick="Teamer18();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput9").before('<button id="TeamboardIconFake9" class="btn btn-info" style="background-color: transparent;" onclick="Teamer19();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput10").before('<button id="TeamboardIconFake10" class="btn btn-info" style="background-color: transparent;" onclick="Teamer20();return false;"><i class="fa fa-wpexplorer"></i></button>');

}

function OthersSkinChanger() {
    //var leaderboardnames = [$("#leaderboard-positions").text().split('1. ').pop().split('2. ')[0], $("#leaderboard-positions").text().split('2. ').pop().split('3. ')[0], $("#leaderboard-positions").text().split('3. ').pop().split('4. ')[0], $("#leaderboard-positions").text().split('4. ').pop().split('5. ')[0], $("#leaderboard-positions").text().split('5. ').pop().split('6. ')[0], $("#leaderboard-positions").text().split('6. ').pop().split('7. ')[0], $("#leaderboard-positions").text().split('7. ').pop().split('8. ')[0], $("#leaderboard-positions").text().split('8. ').pop().split('9. ')[0], $("#leaderboard-positions").text().split('9. ').pop().split('10. ')[0], $("#leaderboard-positions").text().split('10. ').pop().split('11. ')[0]];
    //$(".team-top-limit")[2].click();
/*
    var Top5b = {};
    var Top5c = {};
    var Top5d = {};
    var Top5a = $("#top5-pos").text();
    for (var n = 1; n <= 21; n++) {
        Top5b[n] = Top5a.split('[')[n];
        if (Top5b[n] != null) {
            Top5c[n] = Top5b[n].split('] ')[1];
            Top5d[n] = Top5c[n].slice(0, -1);
        } else {
            Top5d[n - 1] = Top5c[n - 1];
            break;
        }
        console.log(Top5d[n]);
    }


    $("#LeaderboardInput1").val(leaderboardnames[0]);
    $("#LeaderboardInput2").val(leaderboardnames[1]);
    $("#LeaderboardInput3").val(leaderboardnames[2]);
    $("#LeaderboardInput4").val(leaderboardnames[3]);
    $("#LeaderboardInput5").val(leaderboardnames[4]);
    $("#LeaderboardInput6").val(leaderboardnames[5]);
    $("#LeaderboardInput7").val(leaderboardnames[6]);
    $("#LeaderboardInput8").val(leaderboardnames[7]);
    $("#LeaderboardInput9").val(leaderboardnames[8]);
    $("#LeaderboardInput10").val(leaderboardnames[9]);
/*
    $("#TeamboardInput1").val(Top5d[1]);
    $("#TeamboardInput2").val(Top5d[2]);
    $("#TeamboardInput3").val(Top5d[3]);
    $("#TeamboardInput4").val(Top5d[4]);
    $("#TeamboardInput5").val(Top5d[5]);
    $("#TeamboardInput6").val(Top5d[6]);
    $("#TeamboardInput7").val(Top5d[7]);
    $("#TeamboardInput8").val(Top5d[8]);
    $("#TeamboardInput9").val(Top5d[9]);
    $("#TeamboardInput10").val(Top5d[10]);
*/
for(var i=0;i<10;i++){
	var x=i+1;
	if (application.teamPlayers[i]){
    $("#TeamboardInput"+x).val(application.teamPlayers[i].nick);
	}
	if (legendmod.leaderboard[i]){
    $("#LeaderboardInput"+x).val(legendmod.leaderboard[i].nick);
	}	
}
}






function exitSkinChanger() {
    $("#main-menu").show();
    $("#skins-panel").show();
    $("#quick-menu").show();
    $("#exp-bar").show();
    $("#SkinChanger").remove();
}

function OpenSkinChanger() {
    $("#main-menu").hide();
    $("#skins-panel").hide();
    $("#quick-menu").hide();
    $("#exp-bar").hide();
    $("#SkinChanger").show();
}

//function LeaderboardController(){core.registerSkin(otherMsg, null, 'https://legendmod.ml/banners/iconfake1.png', 1, null);}
/*
function ProceedToChangeSkins() {
    console.log("ProceedToChangeSkins function loaded");
    $("#loaderIframeIcon1").show();
    loadericon();
    $("#SkinBacktomenu").click();
    setTimeout(function() {
        $('#server-join').click();
    }, 1500);

    setTimeout(function() {
        $("#nick").val(previousnickname);
    }, 4500);
    $("#overlays").show();
    $(".center-container.ogario-menu").show();
    $(".side-container.right-container").show();
    $(".side-container.left-container").show();
}

function BeforeChangingSkins() {
    $(".btn.btn-play.btn-primary").click();
    $("body").append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://legendmod.ml/extras/banneranimated2applyingskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="display: none; position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
    setTimeout(function() {
        if ($("#captchaWindow").is(":visible") == false) {
            console.log("No recapatcha");
            ProceedToChangeSkins();
        } else {
            toastr.warning(Premadeletter97 + '!' + '<button class="btn btn-sm btn-warning btn-spectate btn-noplay-finishedRecapatcha" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter98 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-noplay-youtube" style="width: 100%;margin-top: 10px;">' + Premadeletter99 + '</button>', "", {
                timeOut: 40000,
                extendedTimeOut: 40000
            }).css("width", "300px");
            $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click(function() {
                ProceedToChangeSkins();
            });
            console.log("Recapatcha needed");
            ogarioplayfalse();
			for (i=1;i<26;i++){
				setTimeout(function() {
					if ($("#captchaWindow").is(":visible") == false) {
						$(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
						return false;
					}
				}, i*500);
			}
        }
    }, 2500);
}
*/
function fakeSkinReport(nick){	
	if (nick){
		ogarcopythelb.skinURLBefore=ogarcopythelb.skinURL
		ogarcopythelb.nickBefore=ogarcopythelb.nick
		ogarcopythelb.playerColorBefore = ogario.playerColor
		ogarcopythelb.playBefore = ogario.play

		ogarcopythelb.nick=nick

		ogarcopythelb.skinURL="https://legendmod.ml/banners/iconfake1.png"
		ogario.play = true
		ogario.playerColor = true
		application.sendServerJoin()

		application.sendPlayerUpdate()
		application.sendPlayerJoin()
//}

		//setTimeout(function() {
			ogarcopythelb.skinURL=ogarcopythelb.skinURLBefore
			ogarcopythelb.nick=ogarcopythelb.nickBefore
			ogario.playerColor=ogarcopythelb.playerColorBefore
			ogario.play=ogarcopythelb.playBefore
			ogarcopythelb.skinURLBefore=null
			ogarcopythelb.nickBefore=null
			ogarcopythelb.playerColorBefore=null
			ogarcopythelb.playBefore=null
		//}, 100);
	}
}
function prevnamereturner() {
    return previousnickname = $("#nick").val();
}

function ogarioplayfalse() {
    return ogario.play = "false";
}

function Leader11() {
    //prevnamereturner();
	fakeSkinReport($('#LeaderboardInput1').val())
    //$("#nick").val($('#LeaderboardInput1').val());
    //BeforeChangingSkins();
}

function Leader12() {
    fakeSkinReport($('#LeaderboardInput2').val())
}

function Leader13() {
    fakeSkinReport($('#LeaderboardInput3').val())
}

function Leader14() {
    fakeSkinReport($('#LeaderboardInput4').val())
}

function Leader15() {
    fakeSkinReport($('#LeaderboardInput5').val())
}

function Leader16() {
    fakeSkinReport($('#LeaderboardInput6').val())
}

function Leader17() {
    fakeSkinReport($('#LeaderboardInput7').val())
}

function Leader18() {
    fakeSkinReport($('#LeaderboardInput8').val())
}

function Leader19() {
    fakeSkinReport($('#LeaderboardInput9').val())
}

function Leader20() {
    fakeSkinReport($('#LeaderboardInput10').val())
}

function Teamer11() {
    fakeSkinReport($('#TeamboardInput1').val())
}

function Teamer12() {
    fakeSkinReport($('#TeamboardInput2').val())
}

function Teamer13() {
    fakeSkinReport($('#TeamboardInput3').val())
}

function Teamer14() {
    fakeSkinReport($('#TeamboardInput4').val())
}

function Teamer15() {
    fakeSkinReport($('#TeamboardInput5').val())
}

function Teamer16() {
    fakeSkinReport($('#TeamboardInput6').val())
}

function Teamer17() {
    fakeSkinReport($('#TeamboardInput7').val())
}

function Teamer18() {
    fakeSkinReport($('#TeamboardInput8').val())
}

function Teamer19() {
    fakeSkinReport($('#TeamboardInput9').val())
}

function Teamer20() {
    fakeSkinReport($('#TeamboardInput10').val())
}

function copy(text) {
    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}
function LegendSettingsfirst() {
    $('#export-settings').before('<label><input type="checkbox" id="export-LegendSettings" class="js-switch" data-switchery="true" checked style="display: none;"> API</label>');
    var elemLegendSwitch = document.querySelector('#export-LegendSettings');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var switcheryLegendSwitch = new Switchery(elemLegendSwitch, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });
    $('#import-settings').before('<label><input type="checkbox" id="import-LegendSettings" class="js-switch" data-switchery="true" checked style="display: none;"> API</label>');
    var elemLegendSwitch2 = document.querySelector('#import-LegendSettings');
    var switcheryLegendSwitch2 = new Switchery(elemLegendSwitch2, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    LegendJSON = JSON.parse(document.getElementById("export-settings").value);
    LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch);
    $("#export-settings-btn").click(function() {
        LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch);
        setTimeout(function() {
            copy($("#export-settings").val());
        }, 200);
    });

    $("#import-settings-btn").clone().insertAfter("#import-settings-btn").attr('id', 'import-settings-btn2');

    $("#import-settings-btn").hide();
    $("#import-settings-btn2").click(function() {
        LegendSettingsImport(switcheryLegendSwitch2);
        return switcheryLegendSwitch, switcheryLegendSwitch2;
    });

}

function LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch) {
    setTimeout(function() {
        if (switcheryLegendSwitch.isChecked()) {
            LegendJSON = JSON.parse(document.getElementById("export-settings").value);
            parseLegendJSONAPI(LegendJSON);
            var LegendJSONnice = JSON.stringify(LegendJSON, null, 4);
            document.getElementById("export-settings").value = LegendJSONnice;
        } else {
            LegendJSON = JSON.parse(document.getElementById("export-settings").value);
            parseLegendJSONAPI(LegendJSON);
            delete LegendJSON.legendSettings;
            var LegendJSONnice = JSON.stringify(LegendJSON, null, 4);
            document.getElementById("export-settings").value = LegendJSONnice;
        }
        return LegendJSON;
    }, 100);
}

function parseLegendJSONAPI(LegendJSON) {


    LegendJSON.legendSettings = {};
    LegendJSON.legendSettings.previousMode = localStorage.getItem("gamemode");
    LegendJSON.legendSettings.checkonlyonce = localStorage.getItem("checkonlyonce");
    LegendJSON.legendSettings.previousnickname = localStorage.getItem("previousnickname");
    LegendJSON.legendSettings.showToken = localStorage.getItem("showTK");
    LegendJSON.legendSettings.showPlayer = localStorage.getItem("showPlayer");
    LegendJSON.legendSettings.SHOSHOBtn = localStorage.getItem("SHOSHOBtn");
    LegendJSON.legendSettings.XPBtn = localStorage.getItem("XPBtn");
    LegendJSON.legendSettings.MAINBTBtn = localStorage.getItem("MAINBTBtn");
    LegendJSON.legendSettings.AnimatedSkinBtn = localStorage.getItem("AnimatedSkinBtn");

    LegendJSON.legendSettings.TIMEcalBtn = localStorage.getItem("TIMEcalBtn");
    LegendJSON.legendSettings.timesopened = localStorage.getItem("timesopened");

    LegendJSON.legendSettings.dyinglight1load = localStorage.getItem("dyinglight1load");
    LegendJSON.legendSettings.languagemod = localStorage.getItem("languagemod");

    LegendJSON.legendSettings.initialMusicUrl = localStorage.getItem("musicUrl");

    if (LegendJSON.legendSettings.initialMusicUrl == "null" || LegendJSON.legendSettings.initialMusicUrl == null) {
        LegendJSON.legendSettings.initialMusicUrl = defaultMusicUrl;
    };
    LegendJSON.legendSettings.lastIP = localStorage.getItem("lastIP");
    if (LegendJSON.legendSettings.lastIP == "null" || LegendJSON.legendSettings.lastIP == null) {
        LegendJSON.legendSettings.lastIP = "0.0.0.0:0"
    };
    LegendJSON.legendSettings.note1 = localStorage.getItem("note1");
    if (LegendJSON.legendSettings.note1 == "null" || LegendJSON.legendSettings.note1 == null) {
        LegendJSON.legendSettings.note1 = ""
    };
    LegendJSON.legendSettings.note2 = localStorage.getItem("note2");
    if (LegendJSON.legendSettings.note2 == "null" || LegendJSON.legendSettings.note2 == null) {
        LegendJSON.legendSettings.note2 = ""
    };
    LegendJSON.legendSettings.note3 = localStorage.getItem("note3");
    if (LegendJSON.legendSettings.note3 == "null" || LegendJSON.legendSettings.note3 == null) {
        LegendJSON.legendSettings.note3 = ""
    };
    LegendJSON.legendSettings.note4 = localStorage.getItem("note4");
    if (LegendJSON.legendSettings.note4 == "null" || LegendJSON.legendSettings.note4 == null) {
        LegendJSON.legendSettings.note4 = ""
    };
    LegendJSON.legendSettings.note5 = localStorage.getItem("note5");
    if (LegendJSON.legendSettings.note5 == "null" || LegendJSON.legendSettings.note5 == null) {
        LegendJSON.legendSettings.note5 = ""
    };
    LegendJSON.legendSettings.note6 = localStorage.getItem("note6");
    if (LegendJSON.legendSettings.note6 == "null" || LegendJSON.legendSettings.note6 == null) {
        LegendJSON.legendSettings.note6 = ""
    };
    LegendJSON.legendSettings.note7 = localStorage.getItem("note7");
    if (LegendJSON.legendSettings.note7 == "null" || LegendJSON.legendSettings.note7 == null) {
        LegendJSON.legendSettings.note7 = ""
    };
    LegendJSON.legendSettings.minimapbckimg = localStorage.getItem("minimapbckimg");
    if (LegendJSON.legendSettings.minimapbckimg == "null" || LegendJSON.legendSettings.minimapbckimg == null) {
        LegendJSON.legendSettings.minimapbckimg = ""
    };
    LegendJSON.legendSettings.teambimg = localStorage.getItem("teambimg");
    if (LegendJSON.legendSettings.teambimg == "null" || LegendJSON.legendSettings.teambimg == null) {
        LegendJSON.legendSettings.teambimg = ""
    };
    LegendJSON.legendSettings.canvasbimg = localStorage.getItem("canvasbimg");
    if (LegendJSON.legendSettings.canvasbimg == "null" || LegendJSON.legendSettings.canvasbimg == null) {
        LegendJSON.legendSettings.canvasbimg = ""
    };
    LegendJSON.legendSettings.leadbtext = localStorage.getItem("leadbtext");
    if (LegendJSON.legendSettings.leadbtext == "null" || LegendJSON.legendSettings.leadbtext == null) {
        LegendJSON.legendSettings.leadbtext = ""
    };
    LegendJSON.legendSettings.leadbimg = localStorage.getItem("leadbimg");
    if (LegendJSON.legendSettings.leadbimg == "null" || LegendJSON.legendSettings.leadbimg == null) {
        LegendJSON.legendSettings.leadbimg = ""
    };
    LegendJSON.legendSettings.teambtext = localStorage.getItem("teambtext");
    if (LegendJSON.legendSettings.teambtext == "null" || LegendJSON.legendSettings.teambtext == null) {
        LegendJSON.legendSettings.teambtext = ""
    };
    LegendJSON.legendSettings.imgUrl = localStorage.getItem("imgUrl");
    if (LegendJSON.legendSettings.imgUrl == "null" || LegendJSON.legendSettings.imgUrl == null) {
        LegendJSON.legendSettings.imgUrl = ""
    };
    LegendJSON.legendSettings.imgHref = localStorage.getItem("imgHref");
    if (LegendJSON.legendSettings.imgHref == "null" || LegendJSON.legendSettings.imgHref == null) {
        LegendJSON.legendSettings.imgHref = ""
    };
    LegendJSON.legendSettings.minbtext = localStorage.getItem("minbtext");
    if (LegendJSON.legendSettings.minbtext == "null" || LegendJSON.legendSettings.minbtext == null) {
        LegendJSON.legendSettings.minbtext = ""
    };
    LegendJSON.legendSettings.pic1urlimg = localStorage.getItem("pic1urlimg");
    if (LegendJSON.legendSettings.pic1urlimg == "null" || LegendJSON.legendSettings.pic1urlimg == null) {
        LegendJSON.legendSettings.pic1urlimg = ""
    };
    LegendJSON.legendSettings.pic2urlimg = localStorage.getItem("pic2urlimg");
    if (LegendJSON.legendSettings.pic2urlimg == "null" || LegendJSON.legendSettings.pic2urlimg == null) {
        LegendJSON.legendSettings.pic2urlimg = ""
    };
    LegendJSON.legendSettings.pic3urlimg = localStorage.getItem("pic3urlimg");
    if (LegendJSON.legendSettings.pic3urlimg == "null" || LegendJSON.legendSettings.pic3urlimg == null) {
        LegendJSON.legendSettings.pic3urlimg = ""
    };
    LegendJSON.legendSettings.pic4urlimg = localStorage.getItem("pic4urlimg");
    if (LegendJSON.legendSettings.pic4urlimg == "null" || LegendJSON.legendSettings.pic4urlimg == null) {
        LegendJSON.legendSettings.pic4urlimg = ""
    };
    LegendJSON.legendSettings.pic5urlimg = localStorage.getItem("pic5urlimg");
    if (LegendJSON.legendSettings.pic5urlimg == "null" || LegendJSON.legendSettings.pic5urlimg == null) {
        LegendJSON.legendSettings.pic5urlimg = ""
    };
    LegendJSON.legendSettings.pic6urlimg = localStorage.getItem("pic6urlimg");
    if (LegendJSON.legendSettings.pic6urlimg == "null" || LegendJSON.legendSettings.pic6urlimg == null) {
        LegendJSON.legendSettings.pic6urlimg = ""
    };
    LegendJSON.legendSettings.yt1urlimg = localStorage.getItem("yt1urlimg");
    if (LegendJSON.legendSettings.yt1urlimg == "null" || LegendJSON.legendSettings.yt1urlimg == null) {
        LegendJSON.legendSettings.yt1urlimg = ""
    };
    LegendJSON.legendSettings.yt2urlimg = localStorage.getItem("yt2urlimg");
    if (LegendJSON.legendSettings.yt2urlimg == "null" || LegendJSON.legendSettings.yt2urlimg == null) {
        LegendJSON.legendSettings.yt2urlimg = ""
    };
    LegendJSON.legendSettings.yt3urlimg = localStorage.getItem("yt3urlimg");
    if (LegendJSON.legendSettings.yt3urlimg == "null" || LegendJSON.legendSettings.yt3urlimg == null) {
        LegendJSON.legendSettings.yt3urlimg = ""
    };
    LegendJSON.legendSettings.yt4urlimg = localStorage.getItem("yt4urlimg");
    if (LegendJSON.legendSettings.yt4urlimg == "null" || LegendJSON.legendSettings.yt4urlimg == null) {
        LegendJSON.legendSettings.yt4urlimg = ""
    };
    LegendJSON.legendSettings.yt5urlimg = localStorage.getItem("yt5urlimg");
    if (LegendJSON.legendSettings.yt5urlimg == "null" || LegendJSON.legendSettings.yt5urlimg == null) {
        LegendJSON.legendSettings.yt5urlimg = ""
    };
    LegendJSON.legendSettings.yt6urlimg = localStorage.getItem("yt6urlimg");
    if (LegendJSON.legendSettings.yt6urlimg == "null" || LegendJSON.legendSettings.yt6urlimg == null) {
        LegendJSON.legendSettings.yt6urlimg = ""
    };
    LegendJSON.legendSettings.pic1dataimg = localStorage.getItem("pic1dataimg");
    if (LegendJSON.legendSettings.pic1dataimg == "null" || LegendJSON.legendSettings.pic1dataimg == null) {
        LegendJSON.legendSettings.pic1dataimg = ""
    };
    LegendJSON.legendSettings.pic2dataimg = localStorage.getItem("pic2dataimg");
    if (LegendJSON.legendSettings.pic2dataimg == "null" || LegendJSON.legendSettings.pic2dataimg == null) {
        LegendJSON.legendSettings.pic2dataimg = ""
    };
    LegendJSON.legendSettings.pic3dataimg = localStorage.getItem("pic3dataimg");
    if (LegendJSON.legendSettings.pic3dataimg == "null" || LegendJSON.legendSettings.pic3dataimg == null) {
        LegendJSON.legendSettings.pic3dataimg = ""
    };
    LegendJSON.legendSettings.pic4dataimg = localStorage.getItem("pic4dataimg");
    if (LegendJSON.legendSettings.pic4dataimg == "null" || LegendJSON.legendSettings.pic4dataimg == null) {
        LegendJSON.legendSettings.pic4dataimg = ""
    };
    LegendJSON.legendSettings.pic5dataimg = localStorage.getItem("pic5dataimg");
    if (LegendJSON.legendSettings.pic5dataimg == "null" || LegendJSON.legendSettings.pic5dataimg == null) {
        LegendJSON.legendSettings.pic5dataimg = ""
    };
    LegendJSON.legendSettings.pic6dataimg = localStorage.getItem("pic6dataimg");
    if (LegendJSON.legendSettings.pic6dataimg == "null" || LegendJSON.legendSettings.pic6dataimg == null) {
        LegendJSON.legendSettings.pic6dataimg = ""
    };
    LegendJSON.legendSettings.yt1dataimg = localStorage.getItem("yt1dataimg");
    if (LegendJSON.legendSettings.yt1dataimg == "null" || LegendJSON.legendSettings.yt1dataimg == null) {
        LegendJSON.legendSettings.yt1dataimg = ""
    };
    LegendJSON.legendSettings.yt2dataimg = localStorage.getItem("yt2dataimg");
    if (LegendJSON.legendSettings.yt2dataimg == "null" || LegendJSON.legendSettings.yt2dataimg == null) {
        LegendJSON.legendSettings.yt2dataimg = ""
    };
    LegendJSON.legendSettings.yt3dataimg = localStorage.getItem("yt3dataimg");
    if (LegendJSON.legendSettings.yt3dataimg == "null" || LegendJSON.legendSettings.yt3dataimg == null) {
        LegendJSON.legendSettings.yt3dataimg = ""
    };
    LegendJSON.legendSettings.yt4dataimg = localStorage.getItem("yt4dataimg");
    if (LegendJSON.legendSettings.yt4dataimg == "null" || LegendJSON.legendSettings.yt4dataimg == null) {
        LegendJSON.legendSettings.yt4dataimg = ""
    };
    LegendJSON.legendSettings.yt5dataimg = localStorage.getItem("yt5dataimg");
    if (LegendJSON.legendSettings.yt5dataimg == "null" || LegendJSON.legendSettings.yt5dataimg == null) {
        LegendJSON.legendSettings.yt5dataimg = ""
    };
    LegendJSON.legendSettings.yt6dataimg = localStorage.getItem("yt6dataimg");
    if (LegendJSON.legendSettings.yt6dataimg == "null" || LegendJSON.legendSettings.yt6dataimg == null) {
        LegendJSON.legendSettings.yt6dataimg = ""
    };
    LegendJSON.legendSettings.discwebhook1 = localStorage.getItem("discwebhook1");
    if (LegendJSON.legendSettings.discwebhook1 == "null" || LegendJSON.legendSettings.discwebhook1 == null) {
        LegendJSON.legendSettings.discwebhook1 = ""
    };
    LegendJSON.legendSettings.discwebhook2 = localStorage.getItem("discwebhook2");
    if (LegendJSON.legendSettings.discwebhook2 == "null" || LegendJSON.legendSettings.discwebhook2 == null) {
        LegendJSON.legendSettings.discwebhook2 = ""
    };
    LegendJSON.legendSettings.Userscript1 = localStorage.getItem("Userscript1");
    if (LegendJSON.legendSettings.Userscript1 == "null" || LegendJSON.legendSettings.Userscript1 == null) {
        LegendJSON.legendSettings.Userscript1 = ""
    };
    LegendJSON.legendSettings.Userscript2 = localStorage.getItem("Userscript2");
    if (LegendJSON.legendSettings.Userscript2 == "null" || LegendJSON.legendSettings.Userscript2 == null) {
        LegendJSON.legendSettings.Userscript2 = ""
    };
    LegendJSON.legendSettings.Userscript3 = localStorage.getItem("Userscript3");
    if (LegendJSON.legendSettings.Userscript3 == "null" || LegendJSON.legendSettings.Userscript3 == null) {
        LegendJSON.legendSettings.Userscript3 = ""
    };
    LegendJSON.legendSettings.Userscript4 = localStorage.getItem("Userscript4");
    if (LegendJSON.legendSettings.Userscript4 == "null" || LegendJSON.legendSettings.Userscript4 == null) {
        LegendJSON.legendSettings.Userscript4 = ""
    };
    LegendJSON.legendSettings.Userscript5 = localStorage.getItem("Userscript5");
    if (LegendJSON.legendSettings.Userscript5 == "null" || LegendJSON.legendSettings.Userscript5 == null) {
        LegendJSON.legendSettings.Userscript5 = ""
    };
    LegendJSON.legendSettings.Userscripttexture1 = localStorage.getItem("Userscripttexture1");
    if (LegendJSON.legendSettings.Userscripttexture1 == "null" || LegendJSON.legendSettings.Userscripttexture1 == null) {
        LegendJSON.legendSettings.Userscripttexture1 = ""
    };
    LegendJSON.legendSettings.Userscripttexture2 = localStorage.getItem("Userscripttexture2");
    if (LegendJSON.legendSettings.Userscripttexture2 == "null" || LegendJSON.legendSettings.Userscripttexture2 == null) {
        LegendJSON.legendSettings.Userscripttexture2 = ""
    };
    LegendJSON.legendSettings.Userscripttexture3 = localStorage.getItem("Userscripttexture3");
    if (LegendJSON.legendSettings.Userscripttexture3 == "null" || LegendJSON.legendSettings.Userscripttexture3 == null) {
        LegendJSON.legendSettings.Userscripttexture3 = ""
    };
    LegendJSON.legendSettings.Userscripttexture4 = localStorage.getItem("Userscripttexture4");
    if (LegendJSON.legendSettings.Userscripttexture4 == "null" || LegendJSON.legendSettings.Userscripttexture4 == null) {
        LegendJSON.legendSettings.Userscripttexture4 = ""
    };
    LegendJSON.legendSettings.Userscripttexture5 = localStorage.getItem("Userscripttexture5");
    if (LegendJSON.legendSettings.Userscripttexture5 == "null" || LegendJSON.legendSettings.Userscripttexture5 == null) {
        LegendJSON.legendSettings.Userscripttexture5 = ""
    };
    return LegendJSON;
}

function LegendSettingsImport(switcheryLegendSwitch2) {
    if (switcheryLegendSwitch2.isChecked()) {
        LegendJSON = JSON.parse(document.getElementById("import-settings").value);
        //        parseLegendJSONAPI(LegendJSON);
        saveLegendJSONAPI();
        setTimeout(function() {
            $("#import-settings-btn").click();
        }, 100)
    } else {
        $("#import-settings-btn").click();
    }
}

function saveLegendJSONAPI() {
    if (LegendJSON.legendSettings != undefined) {

        localStorage.setItem("gamemode", LegendJSON.legendSettings.previousMode);
        localStorage.setItem("checkonlyonce", LegendJSON.legendSettings.checkonlyonce);
        localStorage.setItem("previousnickname", LegendJSON.legendSettings.previousnickname);
        localStorage.setItem("showTK", LegendJSON.legendSettings.showToken);
        localStorage.setItem("showPlayer", LegendJSON.legendSettings.showPlayer);
        localStorage.setItem("SHOSHOBtn", LegendJSON.legendSettings.SHOSHOBtn);
        localStorage.setItem("XPBtn", LegendJSON.legendSettings.XPBtn);
        localStorage.setItem("MAINBTBtn", LegendJSON.legendSettings.MAINBTBtn);
        localStorage.setItem("AnimatedSkinBtn", LegendJSON.legendSettings.AnimatedSkinBtn);

        localStorage.setItem("TIMEcalBtn", LegendJSON.legendSettings.TIMEcalBtn);
        localStorage.setItem("timesopened", LegendJSON.legendSettings.timesopened);

        localStorage.setItem("dyinglight1load", LegendJSON.legendSettings.dyinglight1load);
        localStorage.setItem("languagemod", LegendJSON.legendSettings.languagemod);

        localStorage.setItem("musicUrl", LegendJSON.legendSettings.initialMusicUrl);
        localStorage.setItem("lastIP", LegendJSON.legendSettings.lastIP);
        localStorage.setItem("note1", LegendJSON.legendSettings.note1);
        localStorage.setItem("note2", LegendJSON.legendSettings.note2);
        localStorage.setItem("note3", LegendJSON.legendSettings.note3);
        localStorage.setItem("note4", LegendJSON.legendSettings.note4);
        localStorage.setItem("note5", LegendJSON.legendSettings.note5);
        localStorage.setItem("note6", LegendJSON.legendSettings.note6);
        localStorage.setItem("note7", LegendJSON.legendSettings.note7);
        localStorage.setItem("minimapbckimg", LegendJSON.legendSettings.minimapbckimg);
        localStorage.setItem("teambimg", LegendJSON.legendSettings.teambimg);
        localStorage.setItem("canvasbimg", LegendJSON.legendSettings.canvasbimg);
        localStorage.setItem("leadbtext", LegendJSON.legendSettings.leadbtext);
        localStorage.setItem("leadbimg", LegendJSON.legendSettings.leadbimg);
        localStorage.setItem("teambtext", LegendJSON.legendSettings.teambtext);
        localStorage.setItem("imgUrl", LegendJSON.legendSettings.imgUrl);
        localStorage.setItem("imgHref", LegendJSON.legendSettings.imgHref);
        localStorage.setItem("minbtext", LegendJSON.legendSettings.minbtext);
        localStorage.setItem("pic1urlimg", LegendJSON.legendSettings.pic1urlimg);
        localStorage.setItem("pic2urlimg", LegendJSON.legendSettings.pic2urlimg);
        localStorage.setItem("pic3urlimg", LegendJSON.legendSettings.pic3urlimg);
        localStorage.setItem("pic4urlimg", LegendJSON.legendSettings.pic4urlimg);
        localStorage.setItem("pic5urlimg", LegendJSON.legendSettings.pic5urlimg);
        localStorage.setItem("pic6urlimg", LegendJSON.legendSettings.pic6urlimg);
        localStorage.setItem("yt1urlimg", LegendJSON.legendSettings.yt1urlimg);
        localStorage.setItem("yt2urlimg", LegendJSON.legendSettings.yt2urlimg);
        localStorage.setItem("yt3urlimg", LegendJSON.legendSettings.yt3urlimg);
        localStorage.setItem("yt4urlimg", LegendJSON.legendSettings.yt4urlimg);
        localStorage.setItem("yt5urlimg", LegendJSON.legendSettings.yt5urlimg);
        localStorage.setItem("yt6urlimg", LegendJSON.legendSettings.yt6urlimg);
        localStorage.setItem("pic1dataimg", LegendJSON.legendSettings.pic1dataimg);
        localStorage.setItem("pic2dataimg", LegendJSON.legendSettings.pic2dataimg);
        localStorage.setItem("pic3dataimg", LegendJSON.legendSettings.pic3dataimg);
        localStorage.setItem("pic4dataimg", LegendJSON.legendSettings.pic4dataimg);
        localStorage.setItem("pic5dataimg", LegendJSON.legendSettings.pic5dataimg);
        localStorage.setItem("pic6dataimg", LegendJSON.legendSettings.pic6dataimg);
        localStorage.setItem("yt1dataimg", LegendJSON.legendSettings.yt1dataimg);
        localStorage.setItem("yt2dataimg", LegendJSON.legendSettings.yt2dataimg);
        localStorage.setItem("yt3dataimg", LegendJSON.legendSettings.yt3dataimg);
        localStorage.setItem("yt4dataimg", LegendJSON.legendSettings.yt4dataimg);
        localStorage.setItem("yt5dataimg", LegendJSON.legendSettings.yt5dataimg);
        localStorage.setItem("yt6dataimg", LegendJSON.legendSettings.yt6dataimg);
        localStorage.setItem("discwebhook1", LegendJSON.legendSettings.discwebhook1);
        localStorage.setItem("discwebhook2", LegendJSON.legendSettings.discwebhook2);
        localStorage.setItem("Userscript1", LegendJSON.legendSettings.Userscript1);
        localStorage.setItem("Userscript2", LegendJSON.legendSettings.Userscript2);
        localStorage.setItem("Userscript3", LegendJSON.legendSettings.Userscript3);
        localStorage.setItem("Userscript4", LegendJSON.legendSettings.Userscript4);
        localStorage.setItem("Userscript5", LegendJSON.legendSettings.Userscript5);
        localStorage.setItem("Userscripttexture1", LegendJSON.legendSettings.Userscripttexture1);
        localStorage.setItem("Userscripttexture2", LegendJSON.legendSettings.Userscripttexture2);
        localStorage.setItem("Userscripttexture3", LegendJSON.legendSettings.Userscripttexture3);
        localStorage.setItem("Userscripttexture4", LegendJSON.legendSettings.Userscripttexture4);
        localStorage.setItem("Userscripttexture5", LegendJSON.legendSettings.Userscripttexture5);
    }
}

function YoutubeEmbPlayer(pastedDataorNot) {
    var finalUrl = getEmbedUrl(pastedDataorNot.trim());
    if (finalUrl == false) {
        toastr.error(Premadeletter1).css("width", "210px");
        if (localStorage.getItem("musicUrl") == null) {
            $("#musicUrl").val(defaultMusicUrl);
        } else {
            $("#musicUrl").val(localStorage.getItem("musicUrl"));
        }
    } else {
        $("#musicFrame").attr("src", finalUrl);
        localStorage.setItem("musicUrl", pastedDataorNot.trim());
    }
}

function MsgCommands1(MSGCOMMANDS, MSGNICK) {
	
    if (MSGCOMMANDS.includes("[url]")) {
        if ($("#nick").val().includes("url") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[url]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/url]')[0];
        if (MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("HTTP://") == false && MSGCOMMANDS.includes("HTTPS://") == false) {
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
            timeOut: 20000,
            extendedTimeOut: 20000
        }).css("width", "250px");
        $("#acceptURL").click(function() {
            window.open(MSGCOMMANDS, '_blank');
        });
    } else if (MSGCOMMANDS.includes("[tag]")) {
        if ($("#nick").val().includes("tag") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[tag]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/tag]')[0];
        if (MSGCOMMANDS != "") {
            toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63a + ': <i id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            $("#acceptURL").click(function() {
                $("#clantag").val(MSGCOMMANDS);
                $('#clantag').css('background-color', '#ff6347');
                newsubmit();
            });
        } else {
            toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63b + ': <i id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            $("#acceptURL").click(function() {
                $("#clantag").val(MSGCOMMANDS);
                $('#clantag').css('background-color', '#ff6347');
                newsubmit();
            });
        }
    } else if (MSGCOMMANDS.includes("[yut]")) {
        if ($("#nick").val().includes("yut") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[yut]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/yut]')[0];
        if (MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("HTTPS://") == false && MSGCOMMANDS.includes("HTTPS://") == false) {
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter64 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/' + getParameterByName("v", MSGCOMMANDS) + '?autoplay=1&amp;vq=tiny" frameborder="0"></iframe></br> <button id="acceptYoutubeEmb" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="margin-top: -10px; width: 100%">' + Premadeletter25 + '</button>', "", {
            timeOut: 20000,
            extendedTimeOut: 20000
        }).css("width", "300px");
        $("#acceptYoutubeEmb").click(function() {
            YoutubeEmbPlayer(MSGCOMMANDS);
            $("#musicUrl").val(MSGCOMMANDS);
            //$("#playerI").click();
            playYoutube(); //it's different on LME
        });
    } else if (MSGCOMMANDS.includes("[skype]")) {
        if ($("#nick").val().includes("skype") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[skype]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/skype]')[0];
        if (MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("HTTP://") == false && MSGCOMMANDS.includes("HTTPS://") == false) {
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        if (MSGCOMMANDS.includes("join.skype.com/")) {
            toastr.warning('<img src="https://legendmod.ml/banners/iconskype.png" style="float:left;width:100px;height:100px;">' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter65 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 10000,
                extendedTimeOut: 10000
            }).css("width", "300px");
            $("#acceptURL").click(function() {
                window.open(MSGCOMMANDS, '_blank');
            });
        }
    } else if (MSGCOMMANDS.includes("[discord]")) {
        if ($("#nick").val().includes("discord") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[discord]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/discord]')[0];
        if (MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("HTTPS://") == false && MSGCOMMANDS.includes("HTTPS://") == false) {
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        if (MSGCOMMANDS.includes("discordapp.com/invite") || MSGCOMMANDS.includes("discord.gg") || MSGCOMMANDS.includes("discord.com")) {
            toastr.warning('<img src="https://legendmod.ml/banners/icondiscord.png" style="float:left;width:100px;height:100px;">' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter66 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            $("#acceptURL").click(function() {
                window.open(MSGCOMMANDS, '_blank');
            });
        }
    } else if (MSGCOMMANDS.includes("Legend.Mod")) {

        playerMsg = getParameterByName("player", MSGCOMMANDS);
        commandMsg = getParameterByName("com", MSGCOMMANDS);
        otherMsg = getParameterByName("do", MSGCOMMANDS);
        //		$( ".toast.toast-success" ).text("");
        //		$(".message-text").text();.hide();
        $(".message-text").remove();
        $(".toast.toast-success").remove();
        //without confirmation
        if (commandMsg == "Team5") {
            $("#top5-hud").css('background-image', 'url(" https://legendmod.ml/banners/icogeneral.gif ")').css({
                opacity: 0.8
            });
            setTimeout(function() {
                $("#top5-hud").css('background-image', 'url(" ")').css({
                    opacity: 1
                });
            }, 12000);
        } else if (commandMsg == "Hello") {
            if ($('#message-box').css('display') == 'none') {
				if ($("#clantag").val()!=""){
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
        else if (commandMsg == "HideAll") {
            toastr.warning(Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter23 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-hideall" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-hideall").click(function() {
                $("#HideAllBthn").click();
            });
        } else if (commandMsg == "NamePerm") {
            toastr.warning(Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter26 + ': ' + playerMsg + ' </br> <button class="btn btn-sm btn-primary btn-play btn-do-NamePerm" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-NamePerm" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-NamePerm").click(function() {
                $("#nick").val(playerMsg);
                $("#helloContainer").show();
                newsubmit();
            });
        } else if (commandMsg == "dTroll2") {
            toastr.warning(Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter27 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-troll" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-troll" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-troll").click(function() {
                settrolling();
            });
        } else if (commandMsg == "Youtube") {
            toastr.warning(Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter28 + '<button class="btn btn-sm btn-primary btn-play btn-play-youtube" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-noplay-youtube" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
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

    } else if (MSGCOMMANDS.includes("https://agar.io/sip=151.80.91.73:1511")) {
        commandMsg = getParameterByName("com", MSGCOMMANDS);
        otherMsg = getParameterByName("do", MSGCOMMANDS);
        $(".message-text").remove();
        $(".toast.toast-success").remove();
        LegendClanSymbol = $("#nick").val();
        console.log("Step1");
        if (~LegendClanSymbol.indexOf("℄") != -1) {
            console.log("Step2");
            if (commandMsg == "EU-London") {
                setTimeout(function() {
                    $("#server-join").click();
                }, 60000);
            } else if (commandMsg == "RU-Russia") {
                //setTimeout(function() {
                    $("#server-join").click();
                //}, 1000);
            } else {
                //bug fix
                //setTimeout(function() {
                    $("#server-join").click();
                //}, 1000);
            }
        }
    } else if (MSGCOMMANDS.includes("[DosAttack]")) {
        if ($("#nick").val().includes("DosAttack") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[DosAttack]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosAttack]')[0];	
		var nameArr = MSGCOMMANDS.split(',');	
		window.targetingLeadclientX = nameArr[0]
		window.targetingLeadclientY = nameArr[1]	
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY) - legendmod.mapOffsetY
		legendmod.drawCommander2 = true;
		toastr.warning("<b>" + MSGNICK + ":</b> Attack " + application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)).css("width", "210px");	
    } else if (MSGCOMMANDS.includes("[DosFight]")) {
        if ($("#nick").val().includes("DosFight") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();		
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[DosFight]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosFight]')[0];	
		var nameArr = MSGCOMMANDS.split(',');	
		window.targetingLeadclientX = nameArr[0]
		window.targetingLeadclientY = nameArr[1]	
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY)	- legendmod.mapOffsetY
		legendmod.drawCommander2 = true;
		toastr.warning("<b>" + MSGNICK + ":</b> Fight " + application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)).css("width", "210px");
    } else if (MSGCOMMANDS.includes("[DosRun]")) {
        if ($("#nick").val().includes("DosRun") == false) {
            $(".message-text").remove();
            $(".toast.toast-success").remove();	
        }
        MSGCOMMANDS = MSGCOMMANDS.split("[DosRun]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosRun]')[0];	
		var nameArr = MSGCOMMANDS.split(',');	
		window.targetingLeadclientX = nameArr[0]
		window.targetingLeadclientY = nameArr[1]	
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY)	- legendmod.mapOffsetY
		legendmod.drawCommander2 = true;
		toastr.warning("<b>" + MSGNICK + ":</b> Run from " + application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)).css("width", "210px");
    }	
}



function isLegendExpress(Express) {
    if (messageone != "0" && messageone != "1") {
        return Express = "False";
    } else {
        return Express = "True";
    }
    //var Express;isLegendExpress(Express); if (isLegendExpress(Express) == "True")
}

function MsgServCommandsreturner2(MSGCOMMANDS2a) {
    return MSGCOMMANDS2a;
}


function MsgServCommandsreturner() {
    MSGCOMMANDS2 = MSGCOMMANDS;
    MSGCOMMANDS3 = MSGCOMMANDS;
    MSGCOMMANDS2 = MSGCOMMANDS2.split("[srv]").pop();
    MSGCOMMANDS2 = MSGCOMMANDS2.split('[/srv]')[0];
    if (MSGCOMMANDS2.includes("https://") == false && MSGCOMMANDS2.includes("https://") == false && MSGCOMMANDS2.includes("HTTP://") == false && MSGCOMMANDS2.includes("HTTPS://") == false) {
        MSGCOMMANDS2 = "https://" + MSGCOMMANDS2;
    }
    if (MSGCOMMANDS2.includes("agar.io/#")) { //if sent server is Party mode
        MSGCOMMANDS2a = MSGCOMMANDS2;
        MsgServCommandsreturner2(MSGCOMMANDS2a);
        MSGCOMMANDSA = "#" + MSGCOMMANDS2a.split("#").pop();
        toastr.warning('<div><img src="https://legendmod.ml/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server (Party mode): ' + MSGCOMMANDSA + '<button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
            timeOut: 10000,
            extendedTimeOut: 10000
        }).css("width", "300px");
    } else if (getParameterByName("r", MSGCOMMANDS2a) != null) {
        var modetosend, passtosend;

        if (getParameterByName("pass", MSGCOMMANDS) == null) {
            passtosend = "No Password Loaded";
        } else {
            passtosend = getParameterByName("pass", MSGCOMMANDS);
        }
        if (getParameterByName("mode", MSGCOMMANDS) == null) {
            modetosend = "Unknown";
        } else {
            modetosend = getParameterByName("mode", MSGCOMMANDS);
        }
        toastr.warning('<div><img src="https://legendmod.ml/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server: ' + getParameterByName("sip", MSGCOMMANDS).replace("live-arena-", "").replace(".agar.io", "") + '</br>Mode: ' + modetosend + '</br> Region: ' + getParameterByName("r", MSGCOMMANDS) + '</br> Password: ' + passtosend + '</br> <button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
            timeOut: 10000,
            extendedTimeOut: 10000
        }).css("width", "300px");
    } else {
        var passtosend;

        if (getParameterByName("pass", MSGCOMMANDS) == null) {
            passtosend = "No Password Loaded";
        } else {
            passtosend = getParameterByName("pass", MSGCOMMANDS);
        }
        toastr.warning('<div><img src="https://legendmod.ml/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server: ' + getParameterByName("sip", MSGCOMMANDS).replace("live-arena-", "").replace(".agar.io", "") + '</br> Password: ' + passtosend + '<button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
            timeOut: 10000,
            extendedTimeOut: 10000
        }).css("width", "300px");
    }
    return MSGCOMMANDS, MSGCOMMANDS2, MSGCOMMANDS2a, MSGCOMMANDSA, MSGCOMMANDS3;
}


function universalchat() {
    setTimeout(function() {		
		if (application) application.setUniversalChat()
    }, 2000);

    var legbgpic = $("#menuBg").val();
    var legbgcolor = $("#menuPanelColor").val();


	window.authenticAgartoolId=[];
    var global = window;
    var my = {
        "name": "<i class='fa fa-universal-access' aria-hidden='true'></i>",
        //        "log": function(msg){ console.log(this.name + ":"+ msg); },
        //		"log": function(msg){ toastr["success"](this.name + ":"+ msg); },		
        "log": function(msg) {
            if (($('#chat-box').is(":visible") == false)) {
                //console.log(".....");
                /*
                window.teammatelegendmodnicks.forEach(function(a){
                	if (~msg.indexOf(a)+":") {	
                		msg="[Universal chat]:";
                	}
                	}); */
                if (~msg.indexOf("Received a command with an unknown name")) {
                    if (~msg.indexOf("Received a command with an unknown name: customSkins")) {} else {
                        toastr["success"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                    }
                } else if (~msg.indexOf(Premadeletter109b + " socket.io")) {
                    toastr.warning('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                    //playSound($('#commandSound').val());
                } else if (~msg.indexOf("minimap server")) {
                    toastr.warning('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                } else if (~msg.indexOf($('#nick').val() + ':')) {
                    if (window.noOgarioSocket) {
                        toastr["success"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                        playSound($('#messageSound').val());
                    } else {}
                } else if (~msg.indexOf('[Universal chat]:')) {} else if (~msg.indexOf('@')) {
                    msg.slice(1);
                    toastr.warning('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                    playSound($('#commandSound').val());
                } else {
                    toastr["success"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                    playSound($('#messageSound').val());
                }
            }
        },
        //        "tool_symbol": "Send text Universaly"
        "tool_symbol": ""
    };
    'use strict';
	window.lalala = 5
    var stat = {
        "AgarToolVersion": window.lalala,
		
        //"AgarToolServer": "wss://minimap.agartool.io:9000",
		//"AgarToolServer": "wss://minimap.agartool.io",
		"AgarToolServer": "wss://minimap.agartool.io:443",
        minimapBalls: {},
        "socketIoURL": "https://legendmod.ml/ExampleScripts/socket-io.min.js",
        "minimapNickFont": "700 11px Ubuntu",
        "minimapNickColor": "#ffffff",
        "minimapNickStrokeColor": "#000000",
        "minimapNickStrokeSize": 2,
        "minimapTop": 24,
        "minimapTeammatesSize": 5.5,
        "minimapOffsetX": 71,
        "mapSize": 14142,
        "mapOffset": 7071,
        "pi2": 2 * Math.PI,
        "messageBoxBottom": ["82px", "40%"],
        "keyCodeEnter": 13,
        "keyCodeA": 65,
        "keyCodeR": 82
    };
    var cfg = {};
    var cfg_org = {
        "user_show": true,
        "minimap_show": true,
        "tgar_prefix": "O",
        "tgar_color": "#8C81C7",
        "update_interval": 1000,
        "ogar_user": true,
        "ogar_prefix": "L.M",
        "lmsa_teamtop": false,
        "lmsa_chat": false,
        "chat_close": false,
        "chat_unpause": true,
        "chat_vcenter": false,
        "chat_alt": true,
        "chat_ctrlalt": true,
        "chat_ctrl": true,
        "skin_toggle_auto": false,
        "skin_toggle_interval": 10000
    };

    function pre_loop() {
        // At this point jQuery can not be used
        if (!document.getElementById("top5-hud")) {
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for mod to load");
            return;
        }
        // Just to be sure, another 1 sec wait
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize() {
        //      $.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        $.extend(cfg, cfg_org, JSON.parse(my.storage_getValue("config", '{}')));
        global.ao2t = {
            my: my,
            stat: stat,
            cfg: cfg
        };
        var local_style = '';
        local_style += '#ao2t-hud {';
        local_style += ' font-size: 80%; pointer-events: auto;';
        local_style += '}';
        local_style += '#ao2t-hud * {';
        local_style += ' user-select: auto!important;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg {';
        local_style += ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
        local_style += ' pointer-events: auto; background-image: url(' + legbgpic + '); background-color: ' + legbgcolor + ' ; color: #ffffff;';
        local_style += ' overflow: hidden;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg * {';
        local_style += ' width: auto; user-select: auto!important; pointer-events: auto;';
        local_style += ' position: relative; float: initial;';
        //local_style +=     ' display: run-in;'; // NG
        local_style += '}';
        local_style += '#ao2t-cfg-dlg input {';
        local_style += ' background-color: rgba(0,0,0,0.4); color: #ffffff;';
        local_style += '}';
        $("head").append('<style>\n' + local_style + '\n</style>');
        $("#top5-hud").append('' +
            '<div id="ao2t-hud"><span class="hud-main-color">Universal:' +
            ' <span id="ao2t-capture"><i class="fa fa-universal-access" aria-hidden="true"></i></span>' +
            ' <span id="ao2t-config"><i class="fa fa-wrench" aria-hidden="true"></i></span></span>' +
            //                 '<div id="ao2t-top5" style="padding-left: 1em;"></div>'+
            '<div id="ao2t-top5" style="font-size: 14px;"></div>' +
            '</div>');
        $("#ao2t-capture").click(function(event) {
            //            my.log("capture_click");
            stat.capture = !stat.capture;
            if (stat.capture) {
                if (global.ogario) {
                    $("#ao2t-capture").removeClass("disconnected").addClass("connected");
                    //$("#ao2t-capture").text('??');
                    $("#ao2t-capture").html('<i class="fa fa-times" aria-hidden="true"></i>');
                } else {
                    $("#ao2t-capture").removeClass("disconnected").addClass("connected");
                    $("#ao2t-capture").html('<i class="fa fa-times" aria-hidden="true"></i>');

                }
                my.capture_start();
            } else {
                $("#ao2t-capture").removeClass("connected").addClass("disconnected");
                $("#ao2t-capture").html('<i class="fa fa-universal-access" aria-hidden="true"></i>');
                my.capture_end();
            }
        });
        $('#ao2t-capture').mouseenter(function() {
            $('#ao2t-capture').css('color', $("#hudTextColor").val());
            return clickedname = "YES";
        }).mouseleave(function() {
            $('#ao2t-capture').css('color', '');
        });
        $('#ao2t-config').mouseenter(function() {
            $('#ao2t-config').css('color', $("#hudTextColor").val());
            return clickedname = "YES";
        }).mouseleave(function() {
            $('#ao2t-config').css('color', '');
        });

        $("#ao2t-config").click(my.config);
        // LMB-Mouse split correction (Do not separate by left click on button)
        if (cfg.lmsa_teamtop) {
            //$(".team-top-menu").mousedown(function(){return false;});
            $("#top5-hud").mousedown(function() {
                return false;
            });
        } else {
            $("#ao2t-hud").mousedown(function(event) {
                return false;
            });
        }
        if (cfg.lmsa_chat) {
            $("#message-box").mousedown(function() {
                return false;
            });
        }
        // --- chat close ---
        if (cfg.chat_close) {
            $("#message-menu").append('<a href="#" id="ao2t-chat-close" style="float:right;">X</a>');
            $("#ao2t-chat-close").click(function() {
                my.chatClose();
            });
        }
        if (cfg.chat_vcenter) {
            $("#message-box").css("bottom", stat.messageBoxBottom[1]);
        }
        $("#message").keydown(function(event) {
            var modify = (event.altKey ? "a" : "") +
                (event.ctrlKey ? "c" : "") +
                (event.metaKey ? "m" : "") +
                (event.shiftKey ? "s" : "");
            if (event.keyCode === stat.keyCodeEnter) {
                if (modify === "a" && cfg.chat_alt) {
                    my.chatSend();
                    return false;
                } else if (modify === "ac" && cfg.chat_ctrlalt) {
                    my.chatSend({
                        "ogar": true
                    });
                    return false;
                } else if (modify === "c" && cfg.chat_ctrl) {
                    my.chatClose();
                    return false;
                }
            }
        });
        // --- skin toggle ---
        my.skinToggle_start();
		$("#ao2t-cfg-dlg").draggable()
    }
    my.capture_start = function() {
        // If not, add chat submit button
        if ($("#ao2t-message").length) {
            $("#ao2t-message").show(); // .prop('disabled', false);
            $("#ao2t-minimap").show();
        } else {
            my.capture_init();
        }
        // Connection
        stat.tag = $('#clantag').val();
        stat.nick = $('#nick').val();
        stat.token = $('#server-token').val();
        stat.ws = 'wss://live-arena-' + stat.token + '.agar.io:80';
        my.connect();
        stat.update_timerid = setInterval(my.update, cfg.update_interval);
    };
    my.capture_end = function() {
        $("#ao2t-message").hide(); // .prop('disabled', true);
        $('#ao2t-top5').html('');
        $("#ao2t-minimap").hide();
        my.disconnect();
        clearInterval(stat.update_timerid);
        stat.update_timerid = null;
    };
    my.capture_init = function() {
        //        $("#message-menu").append('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');
        $("#message-menu").prepend('<a href="#" id="ao2t-message" style="float:left;">' + my.tool_symbol + '</a>');
        //	  	$(".show-chat-emoticons.ogicon-smile").after('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');

        $("#ao2t-message").click(my.chatSend);
        // minimap
        var minimap = $("#minimap");
        var minimapWidth = minimap.attr('width');
        var minimapHeight = minimap.attr('height');
        minimap.before('<canvas id="ao2t-minimap"' +
            ' style="position: absolute;"' +
            ' width="' + minimapWidth + '" height="' + minimapHeight + '">');
        //stat.minimapOffsetX = stat.minimapOffsetY + minimapHeight - minimapWidth;
    };
    my.chatSend = function(flg_) {
        var flg = flg_ || {};
        if (!stat.connected) {
            if ($("#ao2t-capture").hasClass("connected")) {
                global.toastr.error("L.M:->A.T: not connected");
                return;
            }
        }

        var msg = '[Universal chat]:' + $("#message").val();
        var msgLM = $("#message").val();
        if (msgLM.indexOf('[url]') == -1 && msgLM.indexOf('[yut]') == -1 && msgLM.indexOf('[skype]') == -1 && msgLM.indexOf('[discord]') == -1 && msgLM.indexOf('[srv]') == -1 && msgLM.indexOf('[tag]') == -1 && msgLM.indexOf('Legend.Mod') == -1 && msgLM.indexOf('https://agar.io/sip=151.80.91.73:1511') == -1) {
            if (msgLM.length) {
                my.sendMinimapServerCommand({
                    name: "chat",
                    //                nick: "LM: " + stat.nick,
                    //				nick: stat.nick,
                    nick: $('#nick').val(),
                    message: "LM:" + msg
                });
                if (flg.ogar) {
                    $(document).trigger(jQuery.Event('keydown', {
                        keyCode: stat.keyCodeEnter,
                        which: stat.keyCodeEnter
                    }));
                } else {
                    //               $("#message-box").hide();
                }
            }
        } else {
            console.log("Message included Script command, thus it is not sent to agar tool");
        }
    };
    my.chatClose = function() {
        $("#message-box").css("display", "none");
        if (cfg.chat_unpause && $("#pause-hud").css("display") == "block") { // Release during PAUSE
            $(document).trigger(jQuery.Event('keydown', {
                keyCode: stat.keyCodeR,
                which: stat.keyCodeR
            }));
            $(document).trigger(jQuery.Event('keyup', {
                keyCode: stat.keyCodeR,
                which: stat.keyCodeR
            }));
        }
    };
    my.update = function() {
        var ogarAlive = my.ogarIsAlive();
        if (ogarAlive != stat.alive) {
            my.tgarAlive(ogarAlive);
        }
        if (stat.alive) {
            my.tgarReposition();
        }
        my.ogarMinimapUpdate();
    };

    // -----  Configuration  -----
    my.config = function() {
        //        my.log("config_click2");
        if (!($('#ao2t-cfg-dlg').length)) {
            my.config_init();
        }
        my.cfg_load(cfg);
        $("#ao2t-cfg-dlg").show();
        $("#overlays").show();
    };
    my.config_init = function() {
        $("#overlays").append('<div id="ao2t-cfg-dlg"' +
            '  style="width:400px; height:480px; top:150px; left:300px; display: none;' +
            '">' +
            'Agar Tool/Legend Mod tools' +
            '<div style="overflow: scroll; ' +
            'position: relative; top:1.5em; left:0.5em; right:0.5em; bottom:1.5em;">' +
            '<div id="ao2t-cfg-base">' +
            '</div>' +
            '</div><br><br>' +
            '&nbsp;<span id="ao2t-cfg-default" class="btn btn-primary">' + Languageletter309.toUpperCase() + '</span>' +
            '&nbsp;<span id="ao2t-cfg-ok" class="btn btn-success">' + Languageletter171 + '</span>' +
            '&nbsp;<span id="ao2t-cfg-cancel" class="btn btn-danger">' + Languageletter283 + '</span>' +
            '</div>');
        $('#ao2t-cfg-base').append('' +
            '&nbsp;&nbsp;&nbsp;Update frequency [milliseconds]:<input type="text" data-ao2t-config="update_interval" style="width:6em;"/>' +
            '<br/>Agar Tool Obtained from' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="user_show"/>user list</label>' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="minimap_show"/>minimap</label>' +
            '&nbsp;Prefix:<input type="text" data-ao2t-config="tgar_prefix" style="width:4em;"/>' +
            '&nbsp;&nbsp;color:<input type="text" data-ao2t-config="tgar_color" style="width:6em;"/>' +
            //    '<span class="input-group-addon"><i id="tgar_color" style="background-color: rgb(0, 0, 0);"></i></span>'+
            '<br/>Send to Agar Tool' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="ogar_user"/>user info</label>' +
            '&nbsp;Prefix:<input type="text" data-ao2t-config="ogar_prefix" style="width:4em;"/>' +
            '<br/>LMB-Mouse split correction' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_teamtop"/>Teamboard</label>' +
            '&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_chat"/>chat</label>' +
            '<br/>Chat option' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_close"/>close</label>' +
            '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_unpause"/>unpause</label>' +
            '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_vcenter"/>vcenter</label>' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_alt"/>Alt>T</label>' +
            '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrlalt"/>Ctrl+Alt>O+T</label>' +
            '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrl"/>Ctrl>Close</label>' +
            '<br/>Other' +
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="skin_toggle_auto"/>skin auto toggle</label>' +
            '&nbsp;&nbsp;&nbsp;Frequency [milliseconds]:<input type="text" data-ao2t-config="skin_toggle_interval" style="width:6em;"/>' +
            '<br/>&nbsp;&nbsp;* Changes will be reflected after restart' +
            '');
        $("#ao2t-cfg-default").click(function() {
            my.cfg_load(cfg_org);
        });
        $("#ao2t-cfg-ok").click(function() {
            if ($("#helloContainer").is(":visible")) {
                showMenu2();
            }
            cfg = my.cfg_save();
            //            GM_setValue("config", JSON.stringify(cfg));
            my.storage_setValue("config", JSON.stringify(cfg));
            my.config_cancel();
            $("#message-box").css("bottom", stat.messageBoxBottom[cfg.chat_vcenter ? 1 : 0]);
            my.skinToggle_start();

        });
        $("#ao2t-cfg-cancel").click(function() {
            if ($("#helloContainer").is(":visible")) {
                showMenu2();
            }
            my.config_cancel();
        });
        my.config_cancel = function() {
            //$("#overlays").hide();
            $("#ao2t-cfg-dlg").hide();
        };
    };
    // -----  skin toggle  -----
    my.skinToggle_start = function() {
        if (stat.skinToggle_timerid) {
            clearInterval(stat.skinToggle_timerid);
            delete stat.skinToggle_timerid;
        }
        if (cfg.skin_toggle_auto && cfg.skin_toggle_interval > 0) {
            stat.skinToggle_timerid = setInterval(my.skinToggle_update, cfg.skin_toggle_interval);
        }
    };
    my.skinToggle_update = function() {
        //my.log("skinToggle_update in");
        // --- check Legend Mod.v3 mode ---
        if (global.ogario && global.ogario.customSkins && global.ogario.vanillaSkins) {
            //my.log("skinToggle_update hasBoth");
            stat.skinToggle_hasBoth = true;
        }
        my.skinToggle_update_sub();
        if (stat.skinToggle_hasBoth && global.ogario.customSkins && !global.ogario.vanillaSkins) {
            //my.log("skinToggle_update retry");
            my.skinToggle_update_sub();
        }
    };
    my.skinToggle_update_sub = function() {
        $(document).trigger(jQuery.Event('keydown', {
            keyCode: stat.keyCodeA,
            which: stat.keyCodeA
        }));
        $(document).trigger(jQuery.Event('keyup', {
            keyCode: stat.keyCodeA,
            which: stat.keyCodeA
        }));
    };
    // =====  Agar Tool Communication processing / connection  =====
    my.connect = function() {
        my.disconnect();
        if (!global.io) {
            //my.log(Premadeletter109b + " socket.io");
            return loadScript(stat.socketIoURL, my.connect);
        }
        var grab_opt = {
            query: "version=" + encodeURIComponent(stat.AgarToolVersion) +
                "&server=" + encodeURIComponent(stat.ws)
        };
        stat.grab_socket = io.connect(stat.AgarToolServer, grab_opt);
        stat.grab_socket.on("info", function(minimap_info) {
            stat.minimap_info = minimap_info;
            my.minimap_connect();
        });
    };
    my.disconnect = function() {
        if (stat.connected && stat.alive) {
            my.tgarAlive(false);
        }
        stat.connected = false;
        stat.alive = false;
        var save_grab_socket = stat.grab_socket;
        var save_minimap_socket = stat.minimap_socket;
        stat.grab_socket = null;
        stat.minimap_socket = null;
        if (save_grab_socket) {
            save_grab_socket.disconnect();
        }
        if (save_minimap_socket) {
            save_minimap_socket.disconnect();
        }
    };
    my.minimap_connect = function() {
        if ($("#ao2t-hud").hasClass("OnceUsed") == false) {
            //		toastr.warning('<b>[SERVER]: </b>Legend Mod and Agar Tool successfully connected. <br>Use {Send Text Universaly} button on chat box to send to Agar.io Tool');
            $("#ao2t-hud").addClass("OnceUsed");
        }
        my.log(Languageletter82a + " " + Premadeletter123.toLowerCase() + "=" + stat.minimap_info.minimapServer);
        my.resetMinimap();
        var minimap_opt = {
            reconnection: !1,
            query: "server=" + encodeURIComponent(stat.minimap_info.agarServer) +
                "&tag=" + encodeURIComponent(stat.tag)
        };
        stat.minimap_socket = io.connect(stat.minimap_info.minimapServer, minimap_opt);
        stat.minimap_socket.on("command", my.minimap_command);
        stat.minimap_socket.on("connect", function() {
            stat.connected = true;
            //if(stat.alive){
            //    my.sendMinimapServerCommand({
            //        name: "alive",
            //        playerName: stat.nick
            //    });
            //}
        });
        stat.minimap_socket.on("disconnect", function() {
            stat.minimap_socket = null;
            my.minimap_disconnect();
        });
        stat.minimap_socket.on("connect_error", function() {
            stat.minimap_socket = null;
            my.minimap_disconnect();
        });
    };
    my.minimap_disconnect = function() {
        stat.connected = false;
        var save_grab_socket = stat.grab_socket;
        var save_minimap_socket = stat.minimap_socket;
        stat.grab_socket = null;
        stat.minimap_socket = null;
        if (save_grab_socket) {
            save_grab_socket.disconnect();
        }
        if (save_minimap_socket) {
            save_minimap_socket.disconnect();
        }
    };
    // =====  Agar Tool Communication processing / processing  =====
    my.minimap_command = function(cmd) {
        if (void 0 === cmd.name) {
            return;
        }
        //my.log("cmd="+ cmd.name);
        switch (cmd.name) {
            case "add":
				if(window.teammatelegendmodnicks && window.teammatelegendmodnicks.includes(cmd.playerName) || cmd.playerName.includes('L.M')){					
				}				             
				else{
					if (!cmd.playerName) {
						cmd.playerName = "An unnamed cell";
					}
					my.addBallToMinimap(!1, cmd.socketID, cmd.playerName, cmd.x, cmd.y, cfg.tgar_color, !0);
				}
				//my.addBallToMinimap(!1, cmd.socketID, cmd.playerName, cmd.x, cmd.y, defaultSettings.miniMapTeammatesColor, !0);
                break;
            case "remove":
                my.removeBallFromMinimap(cmd.socketID);
                break;
            case "position":
                my.moveBallOnMinimap(cmd.socketID, cmd.x, cmd.y);
                break;
            case "customSkins":
				if (!window.agtoolball || !isEquivalent(window.agtoolball, cmd.customs)){
                    window.agtoolball = cmd.customs;
                    if (legendmod.showCustomSkins) {
                        Object.keys(window.agtoolball).forEach(function(key) {
                            //console.log("Custom skin from agar tool added: " + key.split("%")[0] + "  " + window.agtoolball[key]);
                            if (key.split("%")[0] != 0) {
                                core.registerSkin(key.split("%")[0], null, window.agtoolball[key], 1, null)
                            }
                        });
                    }
                }
                break;
            case "reset":
                my.resetMinimap();
                break;
            case "chat":
				if(window.teammatelegendmodnicks && window.teammatelegendmodnicks.includes(cmd.playerName) || cmd.playerName.includes('L.M')){					
				}			
                else{
				//console.log(cmd);
                if (!cmd.playerName) {
                    cmd.playerName = "An unnamed cell";
                }
                //                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
                my.log("" + cmd.playerName + ": " + cmd.message);
                my.ogarChatAdd(cmd.playerName, cmd.message);
				}
                break;
            case "command":
				if(window.teammatelegendmodnicks && window.teammatelegendmodnicks.includes(cmd.playerName) || cmd.playerName.includes('L.M')){					
				}	
				else{
                //console.log(cmd);
                if (!cmd.playerName) {
                    cmd.playerName = "An unnamed cell";
                }
                //                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
                my.log("@" + cmd.playerName + ": " + cmd.message);
                my.ogarChatAdd(cmd.playerName, cmd.message);
				}
                break;
            case "ls":
                console.log("Unknown command ls: " + cmd.message);
                break;
            case "hc":
                console.log("Unknown command ls: " + cmd.message);
                break;
            default:
                my.log("Received a command with an unknown name: " + cmd.name);
        }
    };
    my.sendMinimapServerCommand = function(e) {
        if (stat.minimap_socket && stat.minimap_socket.connected) {
            stat.minimap_socket.emit("command", e);
            return true;
        }
        return false;
    };
    my.resetMinimap = function() {
        //$("#messageTableTemp").empty(), $("#messageTableComplete").empty();
		window.authenticAgartoolId=[];
        for (var e in stat.minimapBalls) {
            if (!stat.minimapBalls[e].isDefault) {
                delete stat.minimapBalls[e];
            }
        }
        // test
        //my.addBallToMinimap(true, "a", "0x0", 0, 0, "#FF0000", !0);
        //my.addBallToMinimap(true, "b", "UL3000", -3000, -3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "c", "UR3000", -3000,  3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "d", "DR3000",  3000,  3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "e", "DL3000",  3000, -3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "f", "TL", -7000,  -7000, "#FF0000", !0);
        //my.addBallToMinimap(true, "g", "BR",  7000,   7000, "#FF0000", !0);
    };
    my.addBallToMinimap = function(isDefault, id, name, x, y, color, visible) {
        //if (stat.minimapBalls[id] == null){ //
		window.authenticAgartoolId[id]=name;
		stat.minimapBalls[id] = new MinimapBall(isDefault, name, x, y, color, visible);
		//} //
    };
    my.removeBallFromMinimap = function(id) {
		window.authenticAgartoolId[id]=null;
        if (stat.minimapBalls[id]) {
            delete stat.minimapBalls[id];
        }
    };
    my.moveBallOnMinimap = function(id, x, y) {
        if (stat.minimapBalls[id]) {
            stat.minimapBalls[id].x = x;
            stat.minimapBalls[id].y = y;
        }
    };

    function MinimapBall(isDefault, name, x, y, color, visible) {
        this.isDefault = isDefault;
        this.name = name;
        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;
        this.color = color;
        this.visible = visible;
    }
    my.tgarAlive = function(alive) {
        stat.alive = alive;
        if (cfg.ogar_user) {
            //my.log("alive -> "+ stat.alive +" name="+ cfg.ogar_prefix + stat.nick);
            if (stat.alive) {
                stat.alive = my.sendMinimapServerCommand({
                    name: "alive",
                    playerName: cfg.ogar_prefix + stat.nick,
                    customSkins: $("#skin").val()
                });
                //my.log("alive >>"+ stat.alive);
            } else {
                my.sendMinimapServerCommand({
                    name: "dead"
                });
            }
        }
    };
    my.tgarReposition = function() {
        if (cfg.ogar_user && global.ogario) {
            my.sendMinimapServerCommand({
                name: "position",
                x: ogario.playerX + ogario.mapOffsetX,
                y: ogario.playerY + ogario.mapOffsetY
            });
        }
    };

    // =====  Process Legend Mod  ======
    my.ogarChatAdd = function(nick, msg) {
        //if ((~msg.indexOf('LM:'))==false) {
        //console.log("...")
        var time_txt = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        var user_icon = my.tool_symbol;
        var chat_html = '<div class="message">' +
            '<span class="message-time">[' + time_txt + '] </span>' +
            //user_icon +
            //'<span class="message-nick">'+ escapeHtml(nick) +': </span>'+
            //'<span style="color:' + cfg.tgar_color + '; font-weight:700;">' +
			
			'<span style="color:' + defaultSettings.messageTextColor + '; font-weight:700;">' +
            user_icon + ' ' + escapeHtml(nick) + '</span>: ' +
            '<span class="message-text">' + escapeHtml(msg) + '</span>' +
            '</div>';
        $("#chat-box").append(chat_html);
        $("#chat-box").perfectScrollbar('update');
        $('#chat-box').animate({
            'scrollTop': $("#chat-box").prop("scrollHeight")
        }, 	500);
    }
    //};
    my.ogarMinimapUpdate = function() {
        window.agartoolteammatenicks = [];
        var minimap_elem = document.getElementById("ao2t-minimap");
        var minimapWidth = minimap_elem.width;
        var minimapHeight = minimap_elem.height;
        var minimapMulti = (minimapWidth - 18) / my.ogarGetMapSize();
        var mapOffset = my.ogarGetMapOffset();
        //var mapOffsetX = ogario.mapOffset - ogario.mapOffsetX;
        //var mapOffsetY = ogario.mapOffset - ogario.mapOffsetY;
        stat.minimapOffsetX = 18 / 2;
        stat.minimapOffsetY = stat.minimapOffsetX + (minimapHeight - minimapWidth);
        var mapOffsetX = stat.minimapOffsetX;
        var mapOffsetY = stat.minimapOffsetY;
        var mapOffsetT = -(2 * stat.minimapTeammatesSize + 2);
        var ctx = minimap_elem.getContext('2d');
        ctx.clearRect(0, 0, minimapWidth, minimapHeight);
        ctx.font = stat.minimapNickFont;
        var user_txt = '';
        //var sep = '1. ';
		var sep=  "";
		if (!defaultmapsettings.top5skins){
			sep = '1. ';
		}
        var keys = Object.keys(stat.minimapBalls).sort();
		window.agartoolminimapBalls = stat.minimapBalls;
		//
		window.predictedGhostCellsArray=[];
		for(var z = 0; z < window.predictedGhostCells.length; z++){         			
			window.predictedGhostCellsArray[z]=window.predictedGhostCells[z].nick;
		}
		for(var i = 0; i < keys.length; i++){    
			
			for (var n = 1; n <= i; n++){
				if (i - n >= 0 && stat.minimapBalls[keys[i]].name == stat.minimapBalls[keys[i-n]].name){
					if (window.authenticAgartoolId[keys[i]]!=stat.minimapBalls[keys[i]].name){
						//console.log(stat.minimapBalls[keys[i]].name, window.authenticAgartoolId[keys[i]]);
						stat.minimapBalls[keys[i]].name = window.authenticAgartoolId[keys[i]];
					}
					else if (window.authenticAgartoolId[keys[i-n]]!=stat.minimapBalls[keys[i-n]].name){
						stat.minimapBalls[keys[i-n]].name = window.authenticAgartoolId[keys[i-n]];
						//console.log(stat.minimapBalls[keys[i-n]].name, window.authenticAgartoolId[keys[i-n]]);
					}
				}
				
		}
		for (var e = 0; e < legendmod.leaderboard.length; e++) {
		if (legendmod.leaderboard[e] && stat.minimapBalls[keys[i]] && escapeHtml(stat.minimapBalls[keys[i]].name) == legendmod.leaderboard[e].nick){
			stat.minimapBalls[keys[i]].leaderboardpos=e;
			
			//for (var n = 1; n <= i; n++){
				
			if (i - 1 >= 0 && stat.minimapBalls[keys[i]].leaderboardpos < stat.minimapBalls[keys[i-1]].leaderboardpos){
				var x=stat.minimapBalls[keys[i]];			
				if (x!= stat.minimapBalls[keys[i-1]] && x!= stat.minimapBalls[keys[i-2]] && x!= stat.minimapBalls[keys[i-3]] && x!= stat.minimapBalls[keys[i-4]] && x!= stat.minimapBalls[keys[i-5]]
					&& window.predictedGhostCellsArray.includes(stat.minimapBalls[keys[i]].name) && stat.minimapBalls[keys[i]].name != stat.minimapBalls[keys[i-1]].name && stat.minimapBalls[keys[i]] && stat.minimapBalls[keys[i-1]] ){
				//console.log(stat.minimapBalls[keys[i]].name + ' ' + stat.minimapBalls[keys[i]].leaderboardpos + ' position changed with ' + stat.minimapBalls[keys[i-1]].name + ' ' + stat.minimapBalls[keys[i-1]].leaderboardpos )
				var temp = stat.minimapBalls[keys[i]];		
				
				stat.minimapBalls[keys[i]] = stat.minimapBalls[keys[i-1]]
				stat.minimapBalls[keys[i-1]] = temp;
				}

			}
		
			//}
			
		}
		}
		}
		//var keys = Object.keys(stat.minimapBalls).sort(function(a, b){return a - b});
		//
        if (keys.length === 0) {
            //user_txt = "No agar tool user";
        }
        var count = 2;
		var count2 = 0;
        for (var key;
            (key = keys.shift());) {

            var ball = stat.minimapBalls[key];

            ///////Public Array for agar tool teammates 
            window.agartoolteammatenicks.push(escapeHtml(ball.name));
            //user_txt += sep + escapeHtml(ball.name);
			
			//
			var flag=false;
				if (defaultmapsettings.top5skins){
				//sep = sep + ('<a href="#" id="pos-skin" class= "set-target" data-user-id="' + key + '"style="background-color: ' + ball.color + '; width: 30px; height:40px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;" src = ' + (application.customSkinsMap[ball.name] ? application.customSkinsMap[ball.name] : "https://legendmod.ml/banners/iconagariotool.png") + ' alt=""> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');
				if (application.customSkinsMap[ball.name] && application.customSkinsCache[application.customSkinsMap[ball.name] + "_cached2"]){
					sep = sep + ('<a href="#" id="pos-skin" class= "set-target" data-user-id="' + key + '"style="background-color: ' + ball.color + '; width: 30px; height:40px; display: inline-block;"><span style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;" alt="">' + application.customSkinsCache[application.customSkinsMap[ball.name] + "_cached2"].outerHTML + '</span> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');					
				}
				else{
					sep = sep + ('<a href="#" id="pos-skin" class= "set-target" data-user-id="' + key + '"style="background-color: ' + ball.color + '; width: 30px; height:40px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;" src = "https://legendmod.ml/banners/iconagariotool.png" alt=""> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');
				}
				}			
			for (var e = 0; e < legendmod.ghostCells.length; e++){ 				
			if (legendmod.leaderboard[e] && escapeHtml(ball.name)==legendmod.leaderboard[e].nick){
				if ( flag==false ){
				sep = sep + ('<span class="hud-main-color">[' + application.calculateMapSector(window.predictedGhostCells[e].x, window.predictedGhostCells[e].y) + "]</span>");
				sep = sep + ('<span class="top5-mass-color">[' + application.shortMassFormat(window.predictedGhostCells[e].mass) + "]</span> ");	
				flag=true;
				}
				}
			}
			if ( flag==false ){
				if (application.calculateMapSector(ball.x, ball.y) == "C3" || legendmod.gameMode == ":party"){
				sep = sep + ('<span class="hud-main-color">[' + application.calculateMapSector(ball.x, ball.y) + ']</span> ');
				}
			}
			count2++;
			
			user_txt += sep + escapeHtml(ball.name);
			sep = '</div>';
			//
           	//		user_txt += count + ": ";
			if (!defaultmapsettings.top5skins){
            sep = '<br/>' + count + ". ";
			count++;
			}
			//sep = '<br/> ';
			
            //			user_txt += count + ": ";
            

            if (cfg.minimap_show) {
                var name = ball.name + '[' + cfg.tgar_prefix + ']';
                var mapX = (ball.x + mapOffset) * minimapMulti + mapOffsetX;
                var mapY = (ball.y + mapOffset) * minimapMulti + mapOffsetY;
                ctx.textAlign = 'center';
                ctx.lineWidth = stat.minimapNickStrokeSize;
                ctx.strokeStyle = stat.minimapNickStrokeColor;
                ctx.strokeText(name, mapX, mapY + mapOffsetT);
                ctx.fillStyle = cfg.tgar_color; // stat.minimapNickColor
				//ctx.fillStyle = defaultSettings.miniMapNickColor;
				
                ctx.fillText(name, mapX, mapY + mapOffsetT);
                ctx.beginPath();
                ctx.arc(mapX, mapY, stat.minimapTeammatesSize, 0, stat.pi2, !1);
                ctx.closePath();
                ctx.fillStyle = ball.color;
                ctx.fill();
            }
        }
        if (cfg.user_show) {
			if (!defaultmapsettings.top5skins){
            user_txt += '<br/>';		
			}			
			user_txt += '</div><span style = "margin-top: 30px;" class="hud-main-color ogicon-users"></span> : <span id="top5-total-players" class="top5-mass-color">' + count2 + '</span>'; 
            $('#ao2t-top5').html(user_txt);
        }
    };
    // --- for Legend Mod Express ----
    my.ogarIsAlive = function() {
        return global.ogario ? global.ogario.play : false;
    };
    my.ogarGetMapSize = function() {
        return global.ogario ? global.ogario.mapSize : stat.mapSize;
    };
    my.ogarGetMapOffset = function() {
        return global.ogario ? global.ogario.mapOffset : stat.mapOffset;
    };

    // =====  Other processing ======
    my.cfg_save = function() {
        var cfg_new = {};
        $('[data-ao2t-config]').each(function() {
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
            var value;
            if (type === "checkbox") {
                value = elem.prop('checked');
            } else {
                value = $(this).val();
            }
            cfg_new[name] = value;
        });
        return cfg_new;
    };
    my.cfg_load = function(cfg_new) {
        $('[data-ao2t-config]').each(function() {
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
            if (cfg_new.hasOwnProperty(name)) {
                var value = cfg_new[name];
                if (type === "checkbox") {
                    elem.prop('checked', value);
                } else {
                    $(this).val(value);
                }
            }
        });
    };
    my.storage_getValue = function(name, defval_) {
        return global.localStorage[my.name + "_" + name] || defval_;
    };
    my.storage_setValue = function(name, value) {
        global.localStorage[my.name + "_" + name] = value;
    };

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (typeof callback !== 'undefined') {
            script.onload = callback;
        }
        document.head.appendChild(script);
    }

    function escapeHtml(e) {
        return e.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
	

	
    $('#message').keydown(function(e) {
        if (e.keyCode === 13) { // If Enter key pressed
            $('#ao2t-message').click();	
        }
    });
}

function Universalchatfix() {	
    if ($("#ao2t-capture").hasClass("connected")) {
        $("#ao2t-capture").click();
        $("#ao2t-capture").click();
    }
	if (window.LMBotsEnabled){
		LegendModServerConnect();
	}
}

function showMenu() {
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}

function showMenu2() {
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").hide();
}

function showSearchHud() {
	//hideBotNameHud();
	if (!document.URL.includes('legendmod.ml')){
		getInfo();
	}	
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
}

function showBotNameHud() {
	$("#searchHud").fadeOut();
	if (legendmod.botNicks.length==0){ 
		appendLog2("<span class='main-color'><span id='playerBots'>No bots found</span></span> (" + legendmod.ws + "</span>)");
	}
	else{
		for (var i=0;i<legendmod.botNicks.length;i++){
			appendLog2("<span class='main-color'><span id='playerBots'>" + legendmod.botNicks[i].nick + "</span></span>" + " <span id='botNamesCount'>" + legendmod.botNicks[i].occurrence + "</span><span> (" + legendmod.ws + "</span>)");		
		}
	}
    $("#backgroundFade").fadeIn();   
	$("#notes").fadeIn();
    $("#searchLog").fadeIn();
	//$("#botNames").fadeIn();
}
function hideBotNameHud() {
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    //$("#botNames").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
}
function appendLog(message) {
    //$("#logTitle").text("Leaderboard history");
    var region = $("#region").val();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a href="javascript:void(0);" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}


function appendLog2(message, message2) {
    //$("#logTitle").text("Legend mod users (click and join)");
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        //        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a onclick="connectto(\`' + message2 + '\`);return false;" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function appendLog3(message, message2, message3, message4) {
    //$("#logTitle").text("Legend mod users (click and join)");
    //	console.log(message3);
    //	console.log(message4);
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        //        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a onclick="connectto(\`' + message2 + '\`);connectto2(\`' + message3 + '\`);connectto3(\`' + message4 + '\`);return false;" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');
    $("#log p").first().show(100);
    bumpLog();
}

function appendLog4(message, message2) {
    //$("#logTitle").text("Alive Servers");
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        //        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a onclick="connectto1a(\`' + message2 + '\`);return false;" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}


function connectto(message2) {
    $('#server-token').val(message2);
    $('#server-join').click();
    setTimeout(function() {
        if ($('#server-token').val() != $('#searchInput').val()) {
            toastr.error("Server not available!");
        }
    }, 1500);
}

function connectto1a(message2) {
    $('#server-ws').val("wss://" + message2);
    $('#server-connect').click();
    setTimeout(function() {
        if ($('#server-token').val() != $('#searchInput').val()) {
            toastr.error("Server not available!");
        }
    }, 1500);
}

function connectto2(message3) {
    $('#region').val(message3);
}

function connectto3(message4) {
    $("#gamemode").val(message4);
}

function bumpLog() {
    $("#log").animate({
        scrollTop: 0
    }, "slow");
}







function SquareAgar() {
    var headID = document.getElementsByTagName("head")[0];
    $(headID).append('<style type="text/css" id="RNCN">.agario-panel, .center-container, .btn, .form-control, ' +
        '.input-group-addon, .input-group-sm>.input-group-addon, .agario-party, .agario-side-panel{border-radius: 10px;}.menu-tabs,' +
        '#main-panel, #profile, #legend, #og-settings, #theme, #music, #hotkeys{border-radius: 10px 10px 0 0;} #hotkeys {border-radius: 10px;} .skin, .input-group-btn, .input-group.nick {border-radius: 0 15px 15px 0;}  ' +
        '.colorpicker-element .input-group-addon i, .colorpicker-element .add-on i{ border-radius: 50%; }.agario-profile-picture { border-radius: 32px;}' +
        '#menu-footer { border-radius: 0 0 10px 10px; } #leaderboard-hud { border-radius: 15px;} #dropDown, #dropDown2 { border-radius: 15px;} #minimap-hud { border-radius: 0 0 15px 15px;}' +
        //				'#menu-footer { border-radius: 0 0 10px 10px; } #leaderboard-hud { border-radius: 15px;} #dropDown, #dropDown2 { border-radius: 15px;} #minimap-hud { border-radius: 15px 15px 15px 15px;}'+
        '#top5-hud{ border-radius: 15px; } #target-hud{ border-radius: 15px; } #legendAdImg, #stats-hud { border-radius: 10px; } ' +
        '#time-hud { border-radius: 10px; } </style>');
}




function sendicon1() {
/*	
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
	*/
	application.sendChatMessage(101,"[img]" + pic1urlimg + "[/img]")	
}

function sendicon2() {
	application.sendChatMessage(101,"[img]" + pic2urlimg + "[/img]")	
}

function sendicon3() {
	application.sendChatMessage(101,"[img]" + pic3urlimg + "[/img]")	
}

function sendicon4() {
	application.sendChatMessage(101,"[img]" + pic4urlimg + "[/img]")	
}

function sendicon5() {
	application.sendChatMessage(101,"[img]" + pic5urlimg + "[/img]")	
}

function sendicon6() {
	application.sendChatMessage(101,"[img]" + pic6urlimg + "[/img]")	
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
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt1url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
    }	
}

function sendyt2() {
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt2url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
    }	
}

function sendyt3() {
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt3url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
    }	
}

function sendyt4() {
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt4url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
    }
}

function sendyt5() {
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt5url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
    }
}

function sendyt6() {
	if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
		application.sendChatMessage(101,"[yt]" + yt6url + "[/yt]")
	} else {
        toastr.info(Premadeletter39);
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
    if (application.lastSentClanTag == "" || $("#clantag").val() == "") {
        toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter39);
    } else {
		application.sendChatMessage(101,"Legend.Mod&?player=" + $("#nick").val() + "&?com=" + commandMsg + "&?do=" + otherMsg)	
		/*
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
		*/
    }
}

function CutNameConflictwithMessageFunction() {
    return CutNameConflictwithMessage = true;
}

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

function StartEditGameNames() {

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
                            if (o, s.match(/^(1|2|3|4|5|6|7|8|9|10)\.(.+?)$/)) {
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
                        return '<div id="tcm" style="display:block;"><div id="tcm-header"><span>Copy Tools</span><p>Copy cell names (press x to show/hide)</p></div><div id="tcm-main"><div><span style="display: none;">leaderboard names</span><div id="tcm-leaderboard" style="display: none;"></div></div><div><span>cell names</span><div id="tcm-names"></div></div><div></div></div></div>'
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
/*
function Ultimouse() {
    if (Ultimouseenabled == 0) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://legendmod.ml/auc/auc.user.js";
        $("body").append(s);
        return Ultimouseenabled = 1;
    }
}
*/
function displayTimer() {
    // initilized all local variables:
    var minutes = '00',
        seconds = '00',
        time = '',
        timeNow = new Date().getTime();

    TimerLM.difference = timeNow - TimerLM.timerStarted;


    // seconds
    if (TimerLM.difference > 1000) {
        seconds = Math.floor(TimerLM.difference / 1000);
        if (seconds > 60) {
            seconds = seconds % 60;
        }
        if (seconds < 10) {
            seconds = '0' + String(seconds);
        }
    }

    // minutes
    if (TimerLM.difference > 60000) {
        minutes = Math.floor(TimerLM.difference / 60000);
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

    TimerLM.timerDiv.innerHTML = time;
}

function startTimer() {
    $("#playtimer").hide();
    $("#stoptimer").show();
    $("#cleartimer").show();
    // save start time
    TimerLM.timerStarted = new Date().getTime()
    console.log('TimerLM.timerStarted: ' + TimerLM.timerStarted)

    if (TimerLM.difference > 0) {
        TimerLM.timerStarted = TimerLM.timerStarted - TimerLM.difference
    }
    // update timer periodically
    TimerLM.timerInterval = setInterval(function() {
        displayTimer()
    }, 10);

}

function stopTimer() {
    $("#playtimer").show();
    $("#stoptimer").hide();
    $("#cleartimer").show();
    clearInterval(TimerLM.timerInterval); // stop updating the timer

}

function clearTimer() {
    $("#playtimer").show();
    $("#stoptimer").hide();
    $("#cleartimer").hide();
    clearInterval(TimerLM.timerInterval);
    TimerLM.timerDiv.innerHTML = "00:00";
    TimerLM.difference = 0;
}


function setminbgname() {
    minimapbckimg = $("#minimapPicture").val();
    localStorage.setItem("minimapbckimg", minimapbckimg);
    $("#minimap-hud").css('background-image', 'url("' + minimapbckimg + '")').css({
        opacity: 0.8
    });
}

function setminbtext() {
    minbtext = $("#minbtext").val();
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
	$("#canvas").css('background-size', 'cover'); 
}

function setleadbtext() {
    leadbtext = $("#leadbtext").val();
    localStorage.setItem("leadbtext", leadbtext);
    $("#leaderboard-hud > h5").text(leadbtext);
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
    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/") || ~containsrealwebhook.indexOf("discord.com/api/webhooks/")) {
        localStorage.setItem("discwebhook1", discwebhook1);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://legendmod.ml/DiscordSIP.user.js";
        $("body").append(s);
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook1", discwebhook1);
        } else {
            toastr.error(Premadeletter36).css("width", "210px");
        }
    }
}

function setdiscwebhook2() {
    discwebhook2 = $("#discwebhook2").val();
    var containsrealwebhook = $('#discwebhook2').val();
    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/") || ~containsrealwebhook.indexOf("discord.com/api/webhooks/")) {
        localStorage.setItem("discwebhook2", discwebhook2);
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook2", discwebhook2);
        } else {
            toastr.error(Premadeletter36).css("width", "210px");
        }
        //return discwebhook2;
    }
}

function openbleedmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://legendmod.ml/BleedingMod.js";
    $("body").append(s);
}

function openrotatingmod() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://legendmod.ml/rotating500images.js";
    $("body").append(s);
}

function languagemodfun() {
	if (languagemod != 1) {
		$('#legendlanguages').val(languagemod);
		changeModLanguage();
	}
}

function changeModLanguage() {
	localStorage.setItem("languagemod", $("#legendlanguages").val());
    if ($("#legendlanguages").val() == 1) {
		languageinjector("https://legendmod.ml/LanguagePackEnglish.js");
    }
    else if ($("#legendlanguages").val() == 2) {
		languageinjector("https://legendmod.ml/LanguagePackGreek.js");
    }
    else if ($("#legendlanguages").val() == 3) {		
		languageinjector("https://legendmod.ml/LanguagePackSpanish.js");
    }
    else if ($("#legendlanguages").val() == 4) {
		languageinjector("https://legendmod.ml/LanguagePackBulgarian.js");
    }
    else if ($("#legendlanguages").val() == 5) {
		languageinjector("https://legendmod.ml/LanguagePackFrench.js");
    }
    else if ($("#legendlanguages").val() == 6) {
		languageinjector("https://legendmod.ml/LanguagePackArabic.js");
    }
    else if ($("#legendlanguages").val() == 7) {
		languageinjector("https://legendmod.ml/LanguagePackTraditionalChinese.js");
    }
    else if ($("#legendlanguages").val() == 8) {
		languageinjector("https://legendmod.ml/LanguagePackRussian.js");			
    }
    else if ($("#legendlanguages").val() == 9) {
		languageinjector("https://legendmod.ml/LanguagePackGerman.js");	
    }
    else if ($("#legendlanguages").val() == 10) {
		languageinjector("https://legendmod.ml/LanguagePackTurkish.js");	
    }
    else if ($("#legendlanguages").val() == 11) {
		languageinjector("https://legendmod.ml/LanguagePackPolish.js");	
    }
}

function injector2(url1, url2){
var script = document.createElement('script');
script.onload = function() {
  var script2 = document.createElement('script');
  script2.src = url2;
  document.getElementsByTagName('head')[0].appendChild(script2);
};
script.src = url1;
document.getElementsByTagName('head')[0].appendChild(script);
}

function languageinjector(url){
	injector2(url, "https://legendmod.ml/LanguagePackHandler.js");	
}
function newsubmit() {
    if (legendmod.play == true) {
        $('*[data-itr="page_play"]').click();
    }
}

function triggerLMbtns() {

    PanelImageSrc = $("#menuBg").val();
    if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://legendmod.ml/banners/static/img/pattern.png") {
        $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
    }
    $("#copyLBBtn").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://legendmod.ml/banners/static/img/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#dropDown>#copyLBBtn").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://legendmod.ml/banners/static/img/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPandPass").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://legendmod.ml/banners/static/img/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPPassLB").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://legendmod.ml/banners/static/img/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    if (SHOSHOBtn == "true") {
        $("#SHOSHOBtn").click();
    }
    if (MAINBTBtn == "true") {
        $("#MAINBTBtn").click();
    }
    if (AnimatedSkinBtn == "true") {
        $("#AnimatedSkinBtn").click();
    }

    if (XPBtn == "true") {
        $("#XPBtn").click();
    }
    if (TIMEcalBtn == "true") {
        $("#TIMEcalBtn").click();
    }

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
    if ($('#minbtext').val() != "" && $('#minbtext').val() != null) {
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
	
	/*$("#agario-main-buttons").append('<div id="LEGENDAds5"></div>')
	if (!window.proLicenceUID && !document.getElementById("nick").value.includes("℄")){
		$("#LEGENDAds5").load("https://legendmod.ml/banners/agario2");
	}*/
    if (dyinglight1load == null || dyinglight1load == "null") {
        $("#LEGENDAds2").load("https://legendmod.ml/banners/bannerDyingLight");
    } else if (dyinglight1load == "yes") {
        opendyinglight();
        $("#LEGENDAds2").load("https://legendmod.ml/banners/bannerStopDyingLight");
    }
}

function opendyinglight() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://legendmod.ml/dyinglight.js";
    $("body").append(s);

}

function bluebtns() {
    var Top5MassColor = $("#top5MassColor").val();
    //blue onmouseover-onmouseout buttons
    $('#searchShortcut').mouseenter(function() {
            $('#searchShortcut').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#searchShortcut').css('background-color', "transparent");
        });
    $('#dropDown3>#lastIPBtn').mouseenter(function() {
            $('#dropDown3>#lastIPBtn').css('background-color', Top5MassColor);		
        })
        .mouseleave(function() {
            $('#dropDown3>#lastIPBtn').css('background-color', "transparent");		
        });
    $('#dropDown3>#checkServerBots').mouseenter(function() {
            $('#dropDown3>#checkServerBots').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#dropDown3>#checkServerBots').css('background-color', "transparent");		
        });		
    $('#copySIPBtn').mouseenter(function() {
            $('#copySIPBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#copySIPBtn').css('background-color', "transparent");
        });
    $('#copyLBBtn').mouseenter(function() {
            $('#copyLBBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#copyLBBtn').css('background-color', "transparent");
        });
    $('#dropDown>#copyLBBtn').mouseenter(function() {
            $('#dropDown>#copyLBBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#dropDown>#copyLBBtn').css('background-color', "transparent");
        });
    $('#copySIPandPass').mouseenter(function() {
            $('#copySIPandPass').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#copySIPandPass').css('background-color', "transparent");
        });
    $('#copySIPPassLB').mouseenter(function() {
            $('#copySIPPassLB').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#copySIPPassLB').css('background-color', "transparent");
        });
    $('#reconnectBtn').mouseenter(function() {
            $('#reconnectBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#reconnectBtn').css('background-color', "transparent");
        });

    $('#VoiceBtn').mouseenter(function() {
            $('#VoiceBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#VoiceBtn').css('background-color', "transparent");
        });
    $('#MiniScripts').mouseenter(function() {
            $('#MiniScripts').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#MiniScripts').css('background-color', "transparent");
        });
    $('#SendCommands').mouseenter(function() {
            $('#SendCommands').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#SendCommands').css('background-color', "transparent");
        });
    $('#shortcuts-hud>#Images').mouseenter(function() {
            $('#shortcuts-hud>#Images').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#shortcuts-hud>#Images').css('background-color', "transparent");
        });
    $('#yout').mouseenter(function() {
            $('#yout').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#yout').css('background-color', "transparent");
        });
    $('#playerBtn').mouseenter(function() {
            $('#playerBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#playerBtn').css('background-color', "transparent");
        });
    $('#fullscreenBtn').mouseenter(function() {
            $('#fullscreenBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#fullscreenBtn').css('background-color', "transparent");
        });

    $('#Cutnames').mouseenter(function() {
            $('#Cutnames').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#Cutnames').css('background-color', "transparent");
        });
	/*
    $('#Ultimouse').mouseenter(function() {
            $('#Ultimouse').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#Ultimouse').css('background-color', "transparent");
        });
*/
    $('#msgcommand1').mouseenter(function() {
            $('#msgcommand1').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand1').css('background-color', "transparent");
        });
    $('#msgcommand2').mouseenter(function() {
            $('#msgcommand2').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand2').css('background-color', "transparent");
        });
    $('#msgcommand3').mouseenter(function() {
            $('#msgcommand3').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand3').css('background-color', "transparent");
        });
    $('#msgcommand4').mouseenter(function() {
            $('#msgcommand4').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand4').css('background-color', "transparent");
        });
    $('#msgcommand5').mouseenter(function() {
            $('#msgcommand5').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand5').css('background-color', "transparent");
        });
    $('#msgcommand6').mouseenter(function() {
            $('#msgcommand6').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#msgcommand6').css('background-color', "transparent");
        });

    $('#sendicon1').mouseenter(function() {
            $('#sendicon1').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon1').css('background-color', "transparent");
        });
    $('#sendicon2').mouseenter(function() {
            $('#sendicon2').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon2').css('background-color', "transparent");
        });
    $('#sendicon3').mouseenter(function() {
            $('#sendicon3').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon3').css('background-color', "transparent");
        });
    $('#sendicon4').mouseenter(function() {
            $('#sendicon4').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon4').css('background-color', "transparent");
        });
    $('#sendicon5').mouseenter(function() {
            $('#sendicon5').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon5').css('background-color', "transparent");
        });
    $('#sendicon6').mouseenter(function() {
            $('#sendicon6').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendicon6').css('background-color', "transparent");
        });

    $('#sendyt1').mouseenter(function() {
            $('#sendyt1').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt1').css('background-color', "transparent");
        });
    $('#sendyt2').mouseenter(function() {
            $('#sendyt2').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt2').css('background-color', "transparent");
        });
    $('#sendyt3').mouseenter(function() {
            $('#sendyt3').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt3').css('background-color', "transparent");
        });
    $('#sendyt4').mouseenter(function() {
            $('#sendyt4').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt4').css('background-color', "transparent");
        });
    $('#sendyt5').mouseenter(function() {
            $('#sendyt5').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt5').css('background-color', "transparent");
        });
    $('#sendyt6').mouseenter(function() {
            $('#sendyt6').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#sendyt6').css('background-color', "transparent");
        });

    $('#RotateRight').mouseenter(function() {
            $('#RotateRight').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#RotateRight').css('background-color', "transparent");
        });
}

function YoutubebackgroundEnable() {
	inject('stylesheet', 
	'*{-webkit-box-sizing: border-box;box-sizing: border-box}'+
	'.video-background{background: #000;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: -99}'+
	'.video-foreground,.video-background iframe{position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none}'+
	'#vidtop-content{top: 0;color: #fff}.vid-info{position: absolute;top: 0;right: 0;width: 33%;background: rgba(0,0,0,0.3);color: #fff;padding: 1rem;font-family: Avenir, Helvetica, sans-serif}'+
	'.vid-info h1{font-size: 2rem;font-weight: 700;margin-top: 0;line-height: 1.2}'+
	'.vid-info a{display: block;color: #fff;text-decoration: none;background: rgba(0,0,0,0.5);-webkit-transition: .6s background;transition: .6s background;border-bottom: none;margin: 1rem auto;text-align: center}'+
	//'@media (min-aspect-ratio: 16/9){.video-foreground{height: 300%;top: -100%}}@media (max-aspect-ratio: 16/9){.video-foreground{width: 300%;left: -100%}}'+
	//'@media all and (max-width: 5px){.vid-info{width: 50%;padding: .5rem}.vid-info h1{margin-bottom: .2rem}}@media all and (max-width: 500px){'+
	'.vid-info .acronym{display: none}}');
	$("body").append('<div class="video-background"><div class="video-foreground"><iframe id="video-background" frameborder="0" height="100%" width="100%" src="https://www.youtube.com/embed/' + getParameterByName("v", $("#musicUrl").val()) + '?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&start_radio=1&playlist=' + getParameterByName("list", $("#musicUrl").val()) + '"></iframe></div></div></div>');
}

function YoutubebackgroundDisable() {
    $('.video-background').remove();
}



function settrolling() {

    //afterdeathtonormalmode();
    playSound("https://legendmod.ml/banners/troll1.mp3");
    $("#canvas").css('background-image', 'url(" https://media.giphy.com/media/eVy46EWyclTIA/giphy.gif ")').css({
        opacity: 0.8
    });
    $("#minimap-hud").css('background-image', 'url(" https://legendmod.ml/banners/icoeucid.gif ")').css({
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

function preventcanvasimagecrash() {
    CanvasRenderingContext2D.prototype._drawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function() {

        const image = arguments[0];
        //console.log(image.width);
        if (!image || image.width < 1 || image.height < 1) return void console.log('Preventing canvas to crash from image width and height');
        this._drawImage(...arguments);
    }
}


function joint(a) {
    var b;
    return b = a[a.length - 1], a.pop(), a = a.length > 1 ? joint(a) : a[0],
        function() {
            b.apply(new a)
        }
}

/*function useProfilePhotoCustom() {
    if ($("#UserProfilePic>img").attr('src') != "https://legendmod.ml/banners/profilepic_guest.png" && $("#UserProfilePic>img").attr('src') != "https://legendmod.ml/banners/profilepic_guest.png") {
        copy($("#UserProfilePic>img").attr('src'));
        toastr.info(Premadeletter85 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter86).css("width", "350px");
    } else {
        toastr.info(Premadeletter87).css("width", "350px");
    }
}*/

function emphasischat() {
    var global = window; // unsafeWindow;
    var my = {
        "name": "OChatBetter",
        "log": function(msg) {
            console.log(this.name + ":" + msg);
        },
    };
    var stat = {};
    var cfg = {},
        cfg_org = {
            "emphasis_bgcolor": "rgba(128,128,128,0.9)", // Historical emphasis background color
            "emphasis_time": 5000, // Emphasis time [milliseconds]
            "histhide_time": 10000, // Time to erase history [milliseconds]
            "scroll_dulation": 200, // History scroll completion period [milliseconds]
        };

    function pre_loop() {
        // At this point jQuery can not be used
        if (!document.getElementById("top5-hud")) {
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for OGARio load");
            return;
        }
        // Just to be sure, another 1 wait
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize() {
        //$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        cfg = cfg_org;
        global[my.name] = {
            my: my,
            stat: stat,
            cfg: cfg
        };
        stat.obs_hist = new MutationObserver((mutations) => {
            //my.log("hist changed");
            mutations.forEach((mutation) => {
                my.hist_add(mutation.addedNodes);
            });
        });
        stat.obs_hist.observe($("#chat-box").get(0), {
            "childList": true
        });
        stat.obs_inpt = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'style') {
                    return;
                }
                var displayValue = mutation.target.style.display;
                //my.log("input changed display="+ displayValue);
                if (displayValue === "block") {
                    my.inpt_show();
                } else if (displayValue === "none") {
                    my.inpt_hide();
                }
            });
        });
        stat.obs_inpt.observe($("#message-box").get(0), {
            "attributes": true
        });
    }

    my.hist_add = function(nodes) {
        my.hist_show(true);
        nodes.forEach((node_elem) => {
            var node = $(node_elem);
            if (node.hasClass("message")) {
                var bgOrg = node.css("background-color");
                node.css("background-color", cfg.emphasis_bgcolor);
                setTimeout(function() {
                    node.css("background-color", bgOrg);
                }, cfg.emphasis_time);
            }
        });
        // Scroll adjustment
        var chat_box = $("#chat-box");
        chat_box.perfectScrollbar("update");
        chat_box.animate({
            "scrollTop": chat_box.prop("scrollHeight")
        }, cfg.scroll_dulation);
        //chat_box.prop("scrollTop", chat_box.prop("scrollHeight"));
    };
    my.hist_show = function(withTimer) {
        // Stop the timer
        if (stat.histhide_timeID) {
            clearTimeout(stat.histhide_timeID);
            stat.histhide_timeID = null;
        }
        var displayValue = $("#chat-box").css("display");
        if (displayValue === "none") {
            stat.histhide_enable = true;
            //$("#chat-box").show();
        }
        if (stat.histhide_enable && withTimer) {
            stat.histhide_timeID = setTimeout(function() {
                //$("#chat-box").hide();
                stat.histhide_enable = false;
            }, cfg.histhide_time);
        }
    };
    my.inpt_show = function() {
        my.hist_show(false);
    };
    my.inpt_hide = function() {
        //$("#chat-box").hide();
    };
}

function IdfromLegendmod(){
	if (document.URL.includes("legendmod.ml") && $("#UserProfileID2a").val()!= ""){		
		window.userid = $("#UserProfileID2a").val()
		localStorage.setItem("userid", window.userid);
	}		
}
function SNEZOgarUpload() {
    //$("#export-settings-btn").click();
    //postSNEZ("https://lmsettings.snez.org/", "test", "test1234", "{ a: 1, b: 2, d: 4}");
	IdfromLegendmod()
    if (userid == "" || userid == null) {
        toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter128);
    } 
	else {
        //postSNEZ("https://lmsettings.snez.org/", userid, "LMSettings", $('#export-settings').val());
        postSNEZ("https://lmsettings.snez.org/", userid, "LMSettings", escape($('#export-settings').val()));
        toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter129 + ". " + Languageletter363 + ": <font color='yellow'><b>" + userid + "</b></font>");
    }
}

function SNEZOgarDownload() {
	IdfromLegendmod()
    if (userid == "" || userid == null) {
        toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter128);
    }
	else {
        getSNEZ("https://lmsettings.snez.org/", userid, "LMSettings");
        var responseSNEZ = xhttp.response;
        $('#import-settings').val(unescape(responseSNEZ));
        //$('#import-settings').val(responseSNEZ);
        $("#import-settings-btn2").click();
    }
}



function SNEZServers() {
    var onUILoaded = function(callback, params) {
        var timerID = setInterval(function() {
            //var elements = ["nick", "server", "clantag", "server-reconnect"];
            var elements = ["nick", "server-token", "clantag", "server-reconnect"];
            var loaded = true;
            elements.forEach(function(elementId) {
                if (!document.getElementById(elementId))
                    loaded = false;
            });

            if (loaded) {
                clearInterval(timerID);
                callback(params);
            }
        }, 100);
    }

    // ---------------
	window.userfirstname = localStorage.getItem("userfirstname");
    window.userlastname = localStorage.getItem("userlastname");
	//window.agarioUID
    var state = {
        nickname: null,
        server: null,
        tag: null,
        AID: null,
		hidecountry: false,
		userfirstname: null,
		userlastname: null,
		agarioUID: null
    };
    var elements = {
        nickname: "nick",
        server: "server-token",
        tag: "clantag",
        reconnectButton: "server-reconnect"
    };

    var socket = {
        //server: "wss://agar.snez.org:3051/",
        server: "wss://agar.snez.org:63051/",
        client: null,
        connect: function() {
            socket.client = new WebSocket(socket.server);
            socket.client.onopen = socket.updateServerDetails;
            socket.client.onclose = socket.reconnect;
            socket.client.onmessage = socket.onMessage;
        },
        reconnect: function() {
            console.log("Reconnecting in 5 seconds...");

            setTimeout(function() {
                socket.connect();
            }, 5000);
        },
        updateServerDetails: function() {
            //        console.log("Details have changed");
            //        console.log(state);

            socket.send({
                id: getSessionID(),
                type: "update_details",
                data: state
            });
        },
        updateDetails: function() {
            var nick = document.getElementById(elements.nickname);
            //		var server = $("#server-ws").val().replace("wss://", "").replace("ws://", "").replace(":80", "")+"&?r=" + $('#region').val() + "&?m=" + realmode;		
            //        var server = document.getElementById(elements.server);
            var servertemp;
            if (realmode != null && region != null) {
                servertemp = "live-arena-" + $('#server-token').val() + ".agar.io" + "&?r=" + $('#region').val() + "&?m=" + realmode;
            } else {
                servertemp = "live-arena-" + $('#server-token').val() + ".agar.io";
            }
            var tag = document.getElementById(elements.tag);
            //var tag = "RespectPrivacy"; No1 not anymore 

            //var nick = document.getElementById("nick");
            //var server = document.getElementById("server");
            //var server = document.getElementById("server-ws").value;
            //var server = $("#server-ws").val().replace("wss://", "").replace("ws://", "").replace(":80", "");
            //var tag = document.getElementById("clantag");

            //state.nickname = nick.value;
            //state.server = server;
            //state.tag = tag.value;
            if (state.nickname != nick.value ||
                state.server != servertemp ||
                state.tag != tag.value)

            /*if (state.nickname != nick.value ||
                state.server != servertemp)			no1: I stoped this*/

            {
				//console.log('something changed')
                state.nickname = nick.value;
                state.server = servertemp;
                state.tag = tag.value;
                state.AID = window.agarioID;
				state.hidecountry = defaultmapsettings.hidecountry;
				state.userfirstname = window.userfirstname;
				state.userlastname = window.userlastname;
				state.agarioUID	= window.agarioUID;
				state.agarioLEVEL = window.agarioLEVEL;
                //state.tag="RespectPrivacy"; no2: I stoped this
                socket.updateServerDetails();
            }
        },
        send: function(msg) {
            if (socket.client.readyState !== socket.client.OPEN)
                return;

            socket.client.send(JSON.stringify(msg));
        },
        onMessage: function(message) {
            try {
                var data = JSON.parse(message.data);
                switch (data.type) {
                    case "ping":
                        socket.send({
                            type: "pong"
                        });
                        break;
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    var initLc = function() {
        var nick = document.getElementById(elements.nickname);
        var server = document.getElementById(elements.server);
        var tag = document.getElementById(elements.tag);
        //var tag = "RespectPrivacy"; no3: I stoped this
        var reconnectButton = document.getElementById(elements.reconnectButton);

        if (!nick) {
            console.log("Could not initialize Info sending");
            return;
        }

        nick.addEventListener("change", socket.updateDetails);
        server.addEventListener("change", socket.updateDetails);
        tag.addEventListener("change", socket.updateDetails); //no4: I stoped this

        var reconnectTimer = null;

        reconnectButton.addEventListener("click", function(e) {
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(socket.updateDetails, 5000);
        });

        socket.connect();
		//console.log('start snez')
        setInterval(socket.updateDetails, 5000);
    };

    function getSessionID() {
        return getCookie("__cfduid");
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    onUILoaded(initLc, null);


}

function getSNEZServers(ifcalled) {
    client2 = {

        // Properties
        //server: "wss://agar.snez.org:3051/",
        server: "wss://agar.snez.org:63051/",
        ws: null,
        isOpen: false,
        onOpenCallback: null,
        onCloseCallback: null,
        onMessageCallback: null,

        // Methods
        connect: function() {
            client2.ws = new WebSocket(client2.server);
            client2.ws.onopen = client2.onOpen;
            client2.ws.onclose = client2.onClose;
            client2.ws.onmessage = client2.onMessage;

        },
        disconnect: function() {
            // Close the connection, if open.

            client2.ws.close();

        },
        onOpen: function() {
            //console.log("\x1b[32m%s\x1b[34m%s\x1b[0m", consoleMsgLM, " Snez socket open");
            //       app.state = "Connected.";
        },

        onClose: function() {
            //       console.log("Reconnecting in 5 seconds...");
            //        setTimeout(client2.connect, 5000);
        },

        onMessage: function(evt) {
            if (client2.isEmpty(evt))
                return;

            try {
                var data = JSON.parse(evt.data);

                if (client2.isEmpty(data) || client2.isEmpty(data.type))
                    return;
            } catch (e) {
                console.log(e);
                return;
            }

            switch (data.type) {
                case "ping":
                    client2.send({
                        type: "pong"
                    });
                    break;
                case "players_list":
                    client2.updatePlayers(data.data);
                    break;
            }
        },

        isEmpty: function(obj) {
            if (typeof obj == 'undefined')
                return true;

            // For arrays or empty strings
            if (obj.length === 0)
                return true;

            // For objects
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    return false;

            return true;
        },

        updatePlayers: function(data) {
            var showonceusers = 0;
            var showonceusers2 = 0;
            showonceusers3 = 0;
            var showonceusers4 = 0;
            data = JSON.parse(data); //...
            //		for (var player in data) {
            // 			if (data.hasOwnProperty(player)) {
            for (var player = 0; player < data.length; player++) {
                if (data[player].nickname) {
                        if (data[player].nickname.indexOf($("#searchInput").val()) >= 0) {
                            if (showonceusers == 0) {
                                showonceusers++;
                                if (ifcalled == null) {
                                    toastr.info("User Found. Revealing server...");
                                }
                            }
                            var temporaryserver = JSON.stringify(data[player]);
							//window.temporaryserverA = temporaryserver;
                            var temporaryserver2;
                            var temporaryserver3;
                            var temporaryserver1 = getParameterByName("r", temporaryserver);
                            var temporaryserver1a = getParameterByName("m", temporaryserver);
							
                            temporaryserver = temporaryserver.substring(0, temporaryserver.indexOf('.agar.io'));
                            temporaryserver2 = temporaryserver.split('live-arena-').pop();
                            temporaryserver3 = temporaryserver.split('nickname\"\:\"').pop();
                            temporaryserver3 = temporaryserver3.substring(temporaryserver3, temporaryserver3.indexOf('\"\,\"server'));
							if (data[player].hidecountry==true && data[player].extra){
								data[player].extra.ip_info.country = "UN";
							}
                            if (temporaryserver1a && data[player].extra && data[player].extra.ip_info) {
                                //temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0];
								temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0].split('\"\,\"AID')[0].split('\"\,\"hidecountry')[0];
                                appendLog3("Region:<span id='regioninfo'>" + temporaryserver1 + "</span>, Mode<span id='modeinfo'>" + temporaryserver1a + "</span>. <span class='main-color'><span id='playerinfo'>" + temporaryserver3.trim() + "</span> <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span>" + " (<span id='tokeninfo'>" + temporaryserver2 + "</span>)", temporaryserver2, temporaryserver1, temporaryserver1a);
                            } 
							else if (data[player].extra && data[player].extra.ip_info){
                                appendLog2("<span class='main-color'><span id='playerinfo'>" + temporaryserver3.trim() + "</span> <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span>" + " (<span id='tokeninfo'>" + temporaryserver2 + "</span>)", temporaryserver2);
                            }
                            showonceusers3++;
                            showonceusers3returner(showonceusers3);
                        } 
						else if (data[player].server.indexOf($("#searchInput").val()) >= 0) {
                            if ($("#searchInput").val().length >= 4) {
                                if (showonceusers2 == 0) {
                                    showonceusers2++;
                                    if (ifcalled == null) {
                                        toastr.info("Server Found. Revealing users...");
                                    }
                                }
                                var temporaryserver = JSON.stringify(data[player]);
                                var temporaryserver2;
                                var temporaryserver3;
                                var temporaryserver1 = getParameterByName("r", temporaryserver);
                                var temporaryserver1a = getParameterByName("m", temporaryserver);
                                temporaryserver = temporaryserver.substring(0, temporaryserver.indexOf('.agar.io'));
                                temporaryserver2 = temporaryserver.split('live-arena-').pop();
                                temporaryserver3 = temporaryserver.split('nickname\"\:\"').pop();
                                temporaryserver3 = temporaryserver3.substring(temporaryserver3, temporaryserver3.indexOf('\"\,\"server'));
								if (data[player].hidecountry==true){
									data[player].extra.ip_info.country = "UN";
								}								
                                if (temporaryserver1a && data[player].extra && data[player].extra.ip_info) {
                                    //temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0];
									temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0].split('\"\,\"AID')[0].split('\"\,\"hidecountry')[0];
                                    appendLog3("Region:<span id='regioninfo'>" + temporaryserver1 + "</span>, Mode<span id='modeinfo'>" + temporaryserver1a + "</span>. <span id='playerinfo'>" + temporaryserver3.trim() + " <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span> (<span class='main-color'><span id='tokeninfo'>" + temporaryserver2 + "</span></span>)", temporaryserver2, temporaryserver1, temporaryserver1a);
                                } 
								else if (data[player].extra && data[player].extra.ip_info){
                                    appendLog2("<span id='playerinfo'>" + temporaryserver3.trim() + " <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span> (<span class='main-color'><span id='tokeninfo'>" + temporaryserver2 + "</span></span>)", temporaryserver2);
                                }
                                showonceusers3++;
                                showonceusers3returner(showonceusers3);
                                //console.log(data[player]);	
                            }
                        }              
                }
            }
            client2.ws.close();
            if (showonceusers3 == 0) {
                showonceusers4++;
                if (showonceusers4 == 1) {
                    if (ifcalled == null) {
                        toastr.warning('Server / Leaderboard, not found. Do you want the 1-by-1 manual search leaderboards of <font color="yellow">' + $("#region").val() + ' / ' + $("#gamemode").val() + '</font> ?' + '</br> <button id= "manualsearch" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-exit" style="width: 100%;margin-top: -20px;">' + Premadeletter25 + '</button>', "", {
                            timeOut: 20000,
                            extendedTimeOut: 20000
                        }).css("width", "350px");
                    }
                    $("#manualsearch").click(function() {
                        $("#searchSpan>i").removeClass("fa fa-search").addClass("fa fa-times");
                        var searchString = $("#searchInput").val();
                        searchHandler(searchString);
                    });
                }
            }
            return client2;
        },
        send: function(data) {
            client2.ws.send(JSON.stringify(data));
        }
    };

}

function showonceusers3returner(showonceusers3) {
    return showonceusers3;
}

function init(modVersion) {
    if (!document.getElementById("message-box")) {
        setTimeout(init(modVersion), 200);	
        console.log("ogario.js not loaded");
        return;
    }
    return startLM(modVersion);
}

function initializeLM(modVersion) {
	PremiumUsersFFAScore()
	

    $("button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>').attr('data-toggle', "tooltip").prop('title', 'Spectate');
    $("button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>').attr('data-toggle', "tooltip").prop('title', 'Logout');
    $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");

    $("#create-party-btn-2").html('<span class="glyphicon glyphicon-plus"></span>');
    $("#create-party-btn-2").attr('data-toggle', "tooltip").prop('title', "Create party");

    $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>').attr('data-toggle', "tooltip").prop('title', "Join party").attr("style", "width: 49% !important; float: right;");

    //backgroud div
    $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');


    $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="pointer-events: auto;display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 44px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;">' +
        '<p style="float: right; margin-right: 10px;"><span id="notesServer">Servers: </span><span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p>' +
        '<p style="float: right;margin-right: 100px;"><span id="notesPlayers">Players: </span><span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>' +
        '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
        '<div id="" style="margin-top: 10px;">' +
        '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="pointer-events: auto;margin-bottom: 10px;float: left;width: 80% !important;text-align: center;">' +
        '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="pointer-events: auto;margin-bottom:10px;width: 15%;"><span id="searchSpan"><i class="fa fa-search"></i></span></button>' +
        '</div></div>'
    );
    $("#regionmodecheck").hide();
    //    '</div>');
    /*$("#clantag").attr('placeholder', 'Password').tooltip({
        title: "Leave it empty for Public, or insert password of Clan, or use it as Tag",
        placement: "bottom"
    });*/
    $("#clantag").attr('placeholder', 'Password');
    /*$("#skin").tooltip({
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
    $("#nick").attr('placeholder', 'Name').tooltip({
        title: "Insert your in-game name",
        placement: "bottom"
    });*/

    $("#optimizedMass").parent().tooltip({
        title: "When ENABLED: Optimized mass (+/-2%) ON, Merge Timer BETA OFF. Suggested to be ENABLED for Lag reduce.",
        placement: "bottom"
    });	
	//$('#animation-value').parent().before("1. Type on browser: <b>chrome://settings/system</b> , ensure <i>Use hardware acceleration when available</i> checkbox, is <b>ENABLED</b>. 2. Prefer <b>Opera GX</b><br><br>");
		
	$('#animation-value').parent().before(
        '<label style="float:left; padding-left:0; padding-right:0">' + textLanguage.unlockedFPS + '<select id="FrameWorkOption" class="form-control" onchange="changeFrameWork();" required="" data-original-title="" title="" style="display:inline; width: 70%; float:right;" >' +        				
		'<option value="4" data-itr="">Limited Rate + 4ms delay (Recommended)</option>' +
		'<option value="false" data-itr="">Limited Rate + No delay</option>' +     
        '<option value="2" data-itr="">Limited Rate + 2ms delay</option>' +				
        '<option value="8" data-itr="">Limited Rate + 8ms delay</option>' +
		'<option value="16" data-itr="">Limited Rate + 16ms delay</option>' +
		'<option value="32" data-itr="">Limited Rate + 32ms delay</option>' +
		'<option value="64" data-itr="">Limited Rate + 64ms delay</option>' +	
		'<option value="notgood" data-itr="">Unlimited Rate (not recommended)</option>' +
		'<option value="ultra" data-itr="">Ultra (not recommended - test)</option>' +
		//'<option value="sophisticated" data-itr="">Sophisticated (not suggested - test)</option>' +
        '</select></label>');
	$("#FrameWorkOption").parent().tooltip({	
        title: "Type on chrome: chrome://settings/system , ensure Use hardware acceleration when available checkbox, is ENABLED",
        placement: "bottom"
    });
	
    $("#videoSkins").parent().parent().tooltip({    
        title: "For more info on how to use video skins visit: https://legendmod.ml/developers/ videoskins.html",
        placement: "top"
    }); 		
    $("#statsInfo").before('<div id="notes" class="main-color" style="display:none;font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 147px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;background-color: rgba(0, 0, 0, 0.2);"><h5 id="notesaveforlater" class="main-color text-center" style="margin-top: 0px;">Save for later</h5>' +
        '<input id="note1" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%;float:left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center;">' +
        '<input id="note2" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
        '<input id="note3" class="form-control main-color note" style="background: transparent; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
        '<input id="note4" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 25%; float: left; border: none; border-bottom: 1px solid; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
        '<input id="note5" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
        '<input id="note6" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
        '<input id="note7" class="form-control main-color note" style="background: transparent; color: lightgrey; border: none; border-bottom: 1px solid; text-align: center; border-color: darkgrey;">' +
        '</div>');
    $("#notes").append('<button id="closeBtn" class="btn btn-danger" style="margin-top: 20px;" data-itr="page_login_and_play" data-original-title="" title="">Close</button>');

    $("#minimap-hud").prepend('<div id="timertools-hud" class="hud" align="center" style="width: 50%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -90px; display: block;">' +
        '<button id="playtimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: block;" onclick="startTimer();" data-toggle="tooltip" data-original-title="Start Timer"" ><i id="playtime" class="fa fa-play-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="stoptimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="stopTimer();" data-toggle="tooltip" data-original-title="Pause Timer""><i id="pausetime" class="fa fa-pause-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="cleartimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="clearTimer();" data-toggle="tooltip" data-original-title="Stop Timer"><i id="cleartime" class="fa fa-stop-circle" style="padding-left: 0px;"></i></button>' +
        '<a id="timer" style="padding: 0px; color: #d6d3d3; width: 12%; height: 100% position: absolute; right: 0px;">00:00</a>');
    $(".menu-tabs>:nth-child(2)").after('<li class="legend-tab" style="width: 16.66%; padding:12px;" data-toggle="tooltip" data-original-title="API" data-placement="top"><a style="margin-top: 2px; height: 100%; padding:12px;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\'); " href="javascript:void(0);" class="fa fa-puzzle-piece fa-lg"></a></li>');
    $(".menu-tabs").children().attr("style", "width: 14.28%");
    //$(".profile-tab").hide();
    $("#main-menu>#profile").after('<div id="legend" class="menu-panel"><div class="agario-panel legend-panel">' + //<h5 class="menu-main-color">Main Tools</h5>
        //											'<button id="IPBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-trademark"></i>Show Connector</button>' +
        /*'<div id="UserProfile" style="margin-bottom: 10px;">' +
        '<div id="UserProfilePic" class="user-picture"><img align="right" src="https://legendmod.ml/banners/profilepic_guest.png" style="width: 60px; display:inline-block;border-radius: 30px;"></img></div>' +
        '<div style="display:inline-block; width: 70%;">' +
        '<div id="UserProfileName">Name: <div id="UserProfileName1" class="user-name" style="display:inline-block" >Guest</div></div>' +
        '<div id="UserProfileUID">Social ID: <div id="UserProfileUID1" class="user-name" style="display:inline-block" ></div></div>' +
		'<div id="UserProfileUUID">UID: <input id="UserProfileUUID1" class="user-name" style="display:inline-block; width: 180px; font-size: 9px;"></div>' +
        '<div id="TimesUsedPanel" class="user-name" style="display:inline-block;">Times Used: <div id="TimesUsed" style="display:inline-block"></div></div><br>' +
        '</div></div>' +*/
        '<button id="SHOSHOBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-puzzle-piece"></i>' + Premadeletter42 + '</button>' +
        '<button id="XPBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-gamepad"></i>' + Premadeletter44 + '</button>' +
        '<button id="MAINBTBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-minus"></i>' + Premadeletter45a + '</button>' +
        '<button id="AnimatedSkinBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-grav"></i>' + Premadeletter46 + '</button>' +
        '<button id="HideAllBthn" type="button" class="btn btn-sm btn-danger" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Temporarily Hide/Show Everything. Function for Youtubers" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-exclamation-triangle"></i>' + Premadeletter49 + '</button>' +
        '<button id="TIMEcalBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-calculator"></i>' + Premadeletter50 + '</button>' +

        '<button id="OpenuserScripts" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 100%; padding: 4px 0 6px 0;"><i class="fa fa-code"></i>User Scripts</button>' +
        '<button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" onclick="BeforeSpecialDeals(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>Special Deals</button>' +
        '<button id="LegendmodShop" class="btn btn-primary btn" type="submit" onclick="BeforeLegendmodShop(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>Shop</button>' +
		//'<button id="UserLeaguesInfo" class="btn btn-primary btn" type="submit" onclick="preUserLeaguesInfoRequest(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-star"></i>User Leagues Info (BETA)</button>' +
		'<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 2px; padding: 4px 0 0px 0;"><span id="legendmanualback" class="title" style="">Manual background:  </span>' +
        '<select id="backgroundPic" class="form-control" onchange="changePicFun();" required="" data-original-title="" title="" style="display:inline; width: 40%" >' +
        '<option value="1" data-itr="">Minimap</option>' +
        '<option value="2" data-itr="">Leaderboard</option>' +
        '<option value="3" data-itr="">Teamboard</option>' +
        '<option value="4" data-itr="">Main Canvas</option>' +
        '<option value="5" data-itr="">Main Banner</option>' +
        '</select>' +

        '<input id="minimapPicture" class="form-control" placeholder="Minimap Image URL" value="" style="margin-top: 2px; display: block;" onblur="setminbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with https://... or https://..." >' +
        '<input id="minbtext" class="form-control" placeholder="Minimap Text" value="" style="margin-top: 2px; display: block;" onblur="setminbtext();">' +
        '<input id="leadbPicture" class="form-control" placeholder="Leaderboard Image URL" value="" style="margin-top: 2px; display: none;" onblur="setleadbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with https://... or https://..." >' +
        '<input id="leadbtext" class="form-control" placeholder="Leaderboard Logo Text" value="" style="margin-top: 2px; display: none; " onblur="setleadbtext();">' +
        '<input id="teambPicture" class="form-control" placeholder="Teamboard Image URL" value="" style="margin-top: 2px; display: none;" onblur="setteambgname();" data-toggle="tooltip" data-placement="right"  data-original-title="Url of image starting with https://... or https://..." >' +
        '<input id="teambtext" class="form-control" placeholder="Teamboard Logo Text" value="" style="margin-top: 2px; display: none; " onblur="setteambtext();">' +
        '<input id="canvasPicture" class="form-control" placeholder="Main Canvas Image URL" value="" style="margin-top: 2px; display: none;" onblur="setcanvasbgname();" data-toggle="tooltip" data-placement="right" data-original-title="Url of image starting with https://... or https://..." >' +
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

        '<input id="pic1url" class="form-control" placeholder="Message Icon Imgur Url 1" value="" style="margin-top: 2px; display: block;" onblur="setpic1url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic2url" class="form-control" placeholder="Message Icon Imgur Url 2" value="" style="margin-top: 2px; display: none;" onblur="setpic2url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic3url" class="form-control" placeholder="Message Icon Imgur Url 3" value="" style="margin-top: 2px; display: none;" onblur="setpic3url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic4url" class="form-control" placeholder="Message Icon Imgur Url 4" value="" style="margin-top: 2px; display: none;" onblur="setpic4url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic5url" class="form-control" placeholder="Message Icon Imgur Url 5" value="" style="margin-top: 2px; display: none;" onblur="setpic5url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic6url" class="form-control" placeholder="Message Icon Imgur Url 6" value="" style="margin-top: 2px; display: none;" onblur="setpic6url();" data-toggle="tooltip" data-placement="right" data-original-title="e.g. https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="yt1url" class="form-control" placeholder="Youtube Message Url 1" value="" style="margin-top: 2px; display: none;" onblur="setyt1url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '<input id="yt2url" class="form-control" placeholder="Youtube Message Url 2" value="" style="margin-top: 2px; display: none;" onblur="setyt2url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '<input id="yt3url" class="form-control" placeholder="Youtube Message Url 3" value="" style="margin-top: 2px; display: none;" onblur="setyt3url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '<input id="yt4url" class="form-control" placeholder="Youtube Message Url 4" value="" style="margin-top: 2px; display: none;" onblur="setyt4url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '<input id="yt5url" class="form-control" placeholder="Youtube Message Url 5" value="" style="margin-top: 2px; display: none;" onblur="setyt5url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '<input id="yt6url" class="form-control" placeholder="Youtube Message Url 6" value="" style="margin-top: 2px; display: none;" onblur="setyt6url();" data-toggle="tooltip" data-placement="right" data-original-title="Url of youtube to be shown" >' +
        '</div></div>' +

        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 0px 0 0px 0;"><span id="legendlanguagetext" class="title" style="" data-toggle="tooltip" data-placement="right" data-original-title="Visit https://legendmod.ml/ LanguagePackEnglish.js to Upload a Language Pack">Choose Language:  </span>' +
        '<select id="legendlanguages" class="form-control" onchange="changeModLanguage();" required="" data-original-title="" title="" style="display:inline; width: 50%" >' +
        '<option value="1" data-itr="" selected>English</option>' +
        '<option value="6" data-itr="">Arabic</option>' +
        '<option value="4" data-itr="">Bulgarian</option>' +
        '<option value="5" data-itr="">French - Francais</option>' +
        '<option value="9" data-itr="">German - Deutsch</option>' +
        '<option value="2" data-itr="">Greek - Ελληνικά</option>' +
        '<option value="11" data-itr="">Polish - Polskie</option>' +
        '<option value="8" data-itr="">Russian</option>' +
        '<option value="3" data-itr="">Spanish - Espanol</option>' +
        '<option value="7" data-itr="">Trad. Chinese</option>' +
        '<option value="10" data-itr="">Turkish - Türk</option>' +
        '</select></div>' +
        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legenddiscordwebh" class="title" style="">Discord Webhook Url (for sending TOKEN)  </span>' +
        '<input id="discwebhook1" class="form-control" placeholder="Discord Webhook 1 Url" value="" data-toggle="tooltip" data-placement="right" data-original-title="Must be filled for function to work. https://discord.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%; display: inline-block; " onblur="setdiscwebhook1();">' +
        '<input id="discwebhook2" class="form-control" placeholder="Discord Webhook 2 Url" value="" data-toggle="tooltip" data-placement="right" data-original-title="Secondary Webhook(optional). https://discord.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%; display: inline-block;" onblur="setdiscwebhook2();">' +
        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legendotherscripts" class="title" style="">Expansions: </span>' +
        '</div><div id="LEGENDAds2"></div><div id="LEGENDAds3"></div>' +
        '</div></div>');
    //fix userprofile
    $("#UserProfile").css("font-size", "12px");
    //$("#UserProfilePic").click(function() {
        //useProfilePhotoCustom();
    //});

    // fix leaderboard buttons
    $("#leaderboard-menu").css("pointer-events", "auto");

    // detect paste
    /*
        $(document).bind("paste", function(e) {
            if (!searching && !($("input,textarea").is(":focus"))) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                hideMenu();
                showSearchHud();
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                //searchHandler(pastedData);
				$("#searchBtn").click();
            }
        });
*/
	changeFrameWorkStart()
	
    $("#searchInput").bind("paste", function(e) {
        if (!searching) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            $("#searchInput").val(pastedData);
            $("#searchInput").select();
            //searchHandler(pastedData);
            $("#searchBtn").click();
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

    $(".note").keyup(function(event) {
        localStorage.setItem(event.target.id, $(event.target).val());
    });
    var initialMusicUrl = (localStorage.getItem("musicUrl") == null ? defaultMusicUrl : localStorage.getItem("musicUrl"));
    //	var savemusic=$(".agario-panel.sounds-panel").html();
    $('.agario-panel.radio-panel').after('<div id="youtubeplayer" style="margin-left: 0px;"><h5 class="main-color" style="margin-right: 15px;">Youtube player</h5>' +
        '<iframe id="musicFrame" width="350" height="180" src="' + getEmbedUrl(initialMusicUrl) + '" frameborder="0" allowfullscreen=""></iframe></div>' +
        '<div id="afteryoutubeplayer"><input id="musicUrl" onclick="$(this).select();" type="text" placeholder="Youtube Url" value="' + initialMusicUrl + '" class="form-control" data-toggle="tooltip" data-placement="right" data-original-title="Paste your video/playlist here">');
    //			'<button id="YoutubeBackgroundBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>' + Premadeletter61 + '</button></div>' +

    $('.agario-panel.radio-panel').hide();
    $('.agario-panel.ogario-yt-panel').hide();

    ytFrame();

    /*		 $("#YoutubeBackgroundBtn").click(function() {
                var checked = !($(this).attr('aria-pressed') == "true");
                if (checked) {               
    				YoutubebackgroundEnable();
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter62);
                } else {
    				YoutubebackgroundDisable();
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter61);
                }
            });*/

    //roller and other icons
    $('#exp-bar > .icon-user').addClass('fa fa-cog fa-spin fa-3x fa-fw').removeClass('icon-user');

    // prevent edit
    $("#musicUrl").on("input", function() {
        $(this).attr("maxlength", "1000");
    });
    $("#musicUrl").bind("paste", function(e) {
        $(this).attr("maxlength", "1000");
        var pastedDataorNot = e.originalEvent.clipboardData.getData('text');
        YoutubeEmbPlayer(pastedDataorNot);
    });

    // save notes

    $("#import-settings-btn").attr('class', 'btn btn-success');
    $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">Results</h5>' +
        '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">' +
        '</div></div>');

    $("#minimap-hud").prepend('<div id="shortcuts-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -30px; display: block;">' +
        '<button id="VoiceBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" data-toggle="tooltip" data-original-title="Voice & Camera Chat"><i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i></button>' +
        '<button id="MiniScripts" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setscriptingfunction();" data-toggle="tooltip" data-original-title="Mini Scripts"><i id="MiniScripts1" class="fa fa-linode" style="padding-left: 0px;"></i></button>' +
        '<button id="SendCommands" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setmessagecomfunction();" data-toggle="tooltip" data-original-title="Message Script Commands"><i id="SendCommands1" class="fa fa-sitemap" style="padding-left: 0px;"></i></button>' +
        '<button id="Images" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="seticonfunction();" data-toggle="tooltip" data-original-title="Message Imgur Icons"><i id="Images1" class="fa fa-picture-o" style="padding-left: 0px;"></i></button>' +
        '<button id="yout" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setytfunction();" data-toggle="tooltip" data-original-title="Message Youtube Videos"><i id="yout1" class="fa fa-youtube" style="padding-left: 0px;"></i></button>' +
        '<button id="playerBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" data-toggle="tooltip" data-original-title="Click play on youtube tab at first"><i id="playerI" class="fa fa-play-circle" style="padding-center: 0px;"></i></button>' +
        '</div>');


    $("#minimap-hud").prepend('<div id="images-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="sendicon1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon1();" data-toggle="tooltip" data-original-title="Bad Choice!"><i id="sendicon11" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon2();" data-toggle="tooltip" data-original-title="Why?"><i id="sendicon21" class="fa fa-question-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon3();" data-toggle="tooltip" data-original-title="Yow!!"><i id="sendicon31" class="fa fa-wheelchair" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon4();" data-toggle="tooltip" data-original-title="Death!"><i id="sendicon41" class="fa fa-cutlery" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon5();" data-toggle="tooltip" data-original-title="Relax!"><i id="sendicon51" class="fa fa-bed" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon6();" data-toggle="tooltip" data-original-title="Legend!"><i id="sendicon61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="yt-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="sendyt1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt1();" data-toggle="tooltip" data-original-title="Rick Astley - Never Gonna Give You Up"><i id="sendyt11" class="fa fa-music" style="padding-left: 0px;"></i></button>' +
        '<button id="sendyt2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt2();" data-toggle="tooltip" data-original-title="Survivor - Eye Of The Tiger"><i id="sendyt21" class="fa fa-music" style="padding-left: 0px;"></i></button>' +
        '<button id="sendyt3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt3();" data-toggle="tooltip" data-original-title="Lion king - The Lion Sleeps Tonight"><i id="sendyt31" class="fa fa-music" style="padding-center: 0px;"></i></button>' +
        '<button id="sendyt4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt4();" data-toggle="tooltip" data-original-title="Agario - Jumbo Solo vs Teams"><i id="sendyt41" class="fa fa-video-camera" style="padding-center: 0px;"></i></button>' +
        '<button id="sendyt5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt5();" data-toggle="tooltip" data-original-title="Agario - Kill3r vs Teams"><i id="sendyt51" class="fa fa-video-camera" style="padding-left: 0px;"></i></button>' +
        '<button id="sendyt6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt6();" data-toggle="tooltip" data-original-title="Promotional Video"><i id="sendyt61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="msgcommands-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="msgcommand1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand1f();" data-toggle="tooltip" data-original-title="Hello Team!"><i id="msgcommand11" class="fa fa-coffee" style="padding-left: 0px;"></i></button>' +
        '<button id="msgcommand2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand2f();" data-toggle="tooltip" data-original-title="Laugh to Team"><i id="msgcommand21" class="fa fa-smile-o" style="padding-left: 0px;"></i></button>' +
        '<button id="msgcommand3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand3f();" data-toggle="tooltip" data-original-title="Team Change Name to yours"><i id="msgcommand31" class="fa fa-magic" style="padding-center: 0px;"></i></button>' +
        '<button id="msgcommand4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand4f();" data-toggle="tooltip" data-original-title="Troll Teammate"><i id="msgcommand41" class="fa fa-bath" style="padding-center: 0px;"></i></button>' +
        '<button id="msgcommand5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand5f();" data-toggle="tooltip" data-original-title="Open Youtube Music"><i id="msgcommand51" class="fa fa-youtube-play" style="padding-left: 0px;"></i></button>' +
        '<button id="msgcommand6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand6f();" data-toggle="tooltip" data-original-title="Insane mode (Hide Everything)"><i id="msgcommand" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="scripting-hud" class="hud" style="width: 12.5%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="Cutnames" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" data-toggle="tooltip" data-original-title="Edit names"><i id="Cutnames1" class="fa fa-scissors" style="padding-left: 0px;"></i></button>' +
       //'<button id="Ultimouse" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" onclick="Ultimouse();" data-toggle="tooltip" data-original-title="Ultimouse Control"><i id="Ultimouse1" class="fa fa-mouse-pointer" style="padding-left: 0px;"></i></button>'+
		'</div>');

    $("#leaderboard-hud").append('<div id="leaderboard-menu" style="pointer-events: auto;">' +
        '<a id="searchShortcut" class="btn btn-info" data-toggle="tooltip" data-placement="left" data-original-title="Join server (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ; " data-toggle="tooltip" data-original-title="Search leaderboards" title=""><i class="fa fa-search fa-lg"></i></a>' +
        '<a id="copySIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP">Copy</a>' +
        '<a id="reconnectBtn" class="btn btn-info" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="' +
        'background-color: transparent;color: ' + legmaincolor + ' ;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; border: none;"><i class="fa fa-refresh fa-lg"></i></a>' +

        '<div id="dropDown3" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 60px; left: 0px; padding: 0px; border-radius: 0px;">' +
        '<a id="checkServerBots" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px; margin-right: 2px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;></span>  Bot names</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>   View bots nicknames</p>"><i class="fa fa-exclamation fa-lg"></i></a><br>' +
        '<a id="lastIPBtn" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px; margin-right: 2px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;></span>Join back</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>Connect to last IP you played</p>"><i class="fa fa-arrow-circle-down fa-lg"></i></a>' +
        '</div>' +
        '<div id="dropDown2" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 90px; left: 67px; padding: 0px; border-radius: 0px;">' +
        '<a id="copySIPandPass" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP&Password">TK&PW</a>' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">LB</a>' +
        '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP, Password, Leaderboard...">TK&ALL</a>' +
        '</div>' +
        '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30px; left: 67px; padding: -30px; border-radius: 0px;">' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">LB</a>' +
        '</div>' +

        '<input id="tempCopy" style="display: none;" value="">' +
        '</div>');
    // player shortcut			

    $("#playerBtn").click(function() {
        if (playerState != 1) {
            $('#musicFrame')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
            $(this).attr('data-original-title', Premadeletter60).tooltip('fixTitle').tooltip('show');
            return playerState = 1;
        } else {
            $('#musicFrame')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
            $(this).attr('data-original-title', Premadeletter13).tooltip('fixTitle').tooltip('show');
            return playerState = 0;
        }

    });
    $("#copySIPBtn").mouseenter(function() {
        $("#dropDown3").hide();
        $("#copySIPBtn").text("Token");
        if ($("#clantag").val() != "") {
            $("#dropDown2").show(100);
        } else {
            $("#dropDown").show(100);
        }
    });
    $("#leaderboard-menu").mouseleave(function() {
        $("#dropDown").hide();
        $("#dropDown2").hide();
        $("#dropDown3").hide();
        $("#copySIPBtn").text("Copy");
    });

    $("#logTitle").after('<a href="#" id="notesclear" style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" class="main-color" onclick="$(\'#log\').html(\'\');" data-toggle="" data-placement="left" data-original-title="Clear list"><i class="fa fa-trash fa-2"></i></a>');
    $("#searchBtn").tooltip('disable');
    $("#copyLBBtn").click(function() {
        copy($("#leaderboard-positions").text());
    });
    $("#dropDown>#copyLBBtn").click(function() {
        copy($("#leaderboard-positions").text());
    });
    $("#lastIPBtn").click(function() {
        lastIP = localStorage.getItem("lastIP");
        if (lastIP == "" || lastIP == null) {} else {
            $('#server-token').val(lastIP);
            $('#server-join').click();
            setTimeout(function() {
                if ($('#server-token').val() != lastIP) {
                    toastr.error(Premadeletter31).css("width", "210px");
                }
            }, 1000);
        }
    });
    $("#checkServerBots").click(function() {
        hideMenu();
        showBotNameHud();
        //$("#searchInput").focus().select();       
    });	

    $("#copyIPBtn").click(function() {
        if (searchSip != null) {
            copy("https://agar.io/?r=" + region + "&m=" + realmode + "&search=wss://" + searchSip);
        } else {
            copy("https://agar.io/?r=" + $('#region').val() + "&m=" + realmode + "&search=wss://" + currentIP);
        }
    });

    $("#copySIPBtn").click(function() {
        if (realmode == ":party") {
            CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
            copy(CopyTkPwLb2);
        } else if (realmode != ":party") {
            if (region != null && realmode != null) {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            } else {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                copy(CopyTkPwLb2);
            }
        } else {
            if (realmode == ":party") {
				CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        } 
    });

    $("#copySIPandPass").click(function() {
        if (searchSip != null) {
            if (realmode == ":party") {
				CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);

            }
        } else { 
            if (realmode == ":party") {			
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        }
    });

    $("#copySIPPassLB").click(function() {
        if (searchSip != null) {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                copyToClipboardAll();
            } else if (realmode != ":party") {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        } else { 
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                copyToClipboardAll();
            } else if (realmode != ":party") {
				if (document.URL.includes("legendmod.ml")) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copyToClipboardAll();
            }
        }
    });

    //fix message-box focus
    $('#message').click(function() {
        $("#message").focus();
    });

    $("#reconnectBtn").click(function() {
        $("#server-reconnect").click();
    });
    $("#reconnectBtn").mouseenter(function() {
        $("#dropDown").hide();
        $("#dropDown2").hide();
        $("#copySIPBtn").text("Copy");
    });

    $("#searchBtn").click(function() {
        if (!searching) {

            getSNEZServers();
            client2.connect();
        } else {
            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
            clearInterval(timerId);
            searching = false;
            //        hideCancelSearch();
            toastr.error(Premadeletter32 + "!").css("width", "210px");
        }
        //var searchString = $("#searchInput").val();
        //searchHandler(searchString);
    });
    $("#searchInput").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#searchBtn").click();
        }
    });

    $("#closeBtn").click(function() {
        hideSearchHud();
        showMenu2();
    });
	
    $("#searchShortcut").mouseenter(function() {
        $("#dropDown").hide();
        $("#dropDown3").show(100);
        $("#copySIPBtn").text("Copy");
    });

    $("#searchHud").css("pointer-events", "auto");
	//$("#searchHud").css("pointer-events", "auto");

    $("#searchShortcut").click(function() {
        hideMenu();
        $("#regioncheck").val($("#region").val());
        $("#gamemodecheck").val($("#gamemode").val());
        showSearchHud();
        $("#searchInput").focus().select();
    });

    /*$('#nick').mouseenter(function() {
        $('#nick').css('background-color', '#000066');
        return clickedname = "YES"
    }).mouseleave(function() {
        $('#nick').css('background-color', '');
    });*/
    $('#nick').blur(function() {
        previousnickname = $("#nick").val();
        localStorage.setItem("previousnickname", previousnickname);
		//Animated Skins
		var animatedkey;
        for (animatedkey in animatedskins) {
            if (animatedkey == $("#nick").val()) {
                toastr.info("Nickname reserved for <font color='yellow'><b>Animated Skins</font></b>");
            }
        }
        //
        if (clickedname == "YES") {
			if (fancyCount2($("#nick").val()) >= 16) {
            //if ($("#nick").val().length >= 16) {
                //toastr.warning("<b>[SERVER]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
				toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
            }
        }
        if ($("#nick").val() == "EasterEgg1") {
            toastr.info(Premadeletter3).css("width", "210px");
            $("#nick").val("Easter Egg");
            $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            openbleedmod();
        } else if ($("#nick").val() == "EasterEgg2") {
            toastr.info(Premadeletter4).css("width", "210px");
            $("#nick").val("Easter Egg");
            $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            openrotatingmod();
        } else if ($("#nick").val() == "EasterEgg3") {
            toastr.info(Premadeletter5 + ',<br>' + Premadeletter6 + '<a target="_blank" href="https://github.com/jimboy3100">https://github.com/jimboy3100</a>');
            $("#nick").val("Video");
            openvidmod();
        }
    });
    $("#nick").on("input", function(){
        if(fancyCount2($("#nick").val())>15){
				while (fancyCount2($("#nick").val()) > 15) {
					$("#nick").val($("#nick").val().slice(0,-1))
				}			
		}
    });
    $(document).keyup(function(event) {
        if (event.which == 8) { // search
            if ($('input:focus').length == 0) {
                $("#searchShortcut").click();
            }

        }
        /* else if (event.which == 187 && !($("input").is(":focus")) && ogario.play == false) { // refresh server
                        $("#reconnectBtn").click();

                    } 
        			else if (event.which == 27) { // ESCAPE

                        if ($('#searchHud').is(':visible')) {
                            hideSearchHud();
                        } else {
         //                   showMenu();
                        }
                    }
        */
    });
	

    $("#Cutnames").click(function() {
        CutNameConflictwithMessageFunction();
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
        var currentIP2 = $("#server-token").val();
        var pass2 = $("#clantag").val();
        if (pass2 != "") {
            semiurl2 = currentIP2 + "pass=" + pass2;
        } else {
            semiurl2 = currentIP2;
        }
        url2 = "https://talky.io/" + semiurl2;

        setTimeout(function() {
            $("#VoiceBtn").focusout();
        }, 100);
        var win = window.open(url2, '_blank');			
    });

    $('#clantag').css("width", "95.5px");
    $('#nick').css("width", "171px");
    /*$('#clantag').mouseenter(function() {
        $('#clantag').css('background-color', '#000066');
    }).mouseleave(function() {
        $('#clantag').css('background-color', '');
    });*/
    //	$('#region').unbind('mouseenter');
    //	$('#gamemode').unbind('mouseenter');
    /*$('#region').mouseenter(function() {
        $('#region').css('background-color', '#003300');
    }).mouseleave(function() {
        $('#region').css('background-color', '');
    });
    $('#gamemode').mouseenter(function() {
        $('#gamemode').css('background-color', '#003300');
    }).mouseleave(function() {
        $('#gamemode').css('background-color', '');
    });*/

    $(".btn.btn-block.btn-success.btn-export").click(function() {
        setTimeout(function() {
            if (LegendSettingsfirstclicked == "false") {
                LegendSettingsfirst();
                return LegendSettingsfirstclicked = "true";
            } else {
                $("#export-settings-btn").click();
                return false;
            }
        }, 100);
    });


    $('*[data-itr="page_play"]').click(function() {
        localStorage.setItem("lastIP", $('#server-token').val());
		/*
        if (userData.responseJSON.query != undefined) {
            userip = userData.responseJSON.query;
            userip = userip.replace(" ", "_");
        }
        if (userData.responseJSON.city != undefined) {
            usercity = userData.responseJSON.city;
            usercity = usercity.replace(" ", "_");
            usercity = usercity.replace(" ", "_");
            usercity = usercity.replace(" ", "_");
        }
        if (userData.responseJSON.country != undefined) {
            usercountry = userData.responseJSON.country;
            usercountry = usercountry.replace(" ", "_");
            usercity = usercity.replace(" ", "_");
            usercity = usercity.replace(" ", "_");
        }
		*/
        var Pwdtosend = "NONE";
        var servertosend = "NotFound";
        var nicknametosend = "NotFound";
        var userfirstname = localStorage.getItem("userfirstname");
        var userlastname = localStorage.getItem("userlastname");
        //			var userid=$('#user-id-tag').text();userid = userid.replace("User id: ", "");			
        //			var userid = localStorage.getItem("userid");
        var modetosend = "NotFound";
        var regiontosend = "NotFound";
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + "@" +
            currentdate.getHours() + ":" +
            currentdate.getMinutes(); //+ ":" +
            //currentdate.getSeconds();
        if (searchSip == null) {
            modetosend = $('#gamemode').val();
            regiontosend = $('#region').val();
        } else {
            if (searchSip == $('#server').val()) {
                modetosend = realmode;
                regiontosend = region;
            }
        }
        if ($('#server').val() != "" && $('#server').val() != null && $('#server').val() != undefined) {
            servertosend = $('#server').val();
        }
        if ($('#clantag').val() != "" && $('#clantag').val() != undefined) {
            Pwdtosend = $('#clantag').val();
        }
        var i = 0,
            Pwdtosendlength = Pwdtosend.length;
        for (i; i < Pwdtosend; i++) {
            Pwdtosend = Pwdtosend.replace(" ", "_");
        }
        if ($('#nick').val() != undefined) {nicknametosend=$('#nick').val(); }
        var i = 0, nicknametosendlength = nicknametosend.length; 
        for(i; i < nicknametosendlength ; i++) {
        nicknametosend = removeEmojis(nicknametosend.replace(" ", "_"));
        }
        if ($('#server').val() != undefined) {
            if (servertosend.indexOf("#") == false) {
                servertosend = $('#server').val().replace('#', 'Party-');
            }
        }

        if (searchSip == null) {
            detailed1 = "https://legendmod.ml/AN?" + "AID=" + window.agarioID + "&Nick=" + nicknametosend + "&Date=" + datetime + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&mode=" + modetosend + "&region=" + regiontosend + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        } else if (searchSip != null) {
            detailed1 = "https://legendmod.ml/AN?" + "AID=" + window.agarioID + "&Nick=" + nicknametosend + "&Date=" + datetime + "&sip=" + searchSip + "&pwd=" + Pwdtosend + "&join=Url" + "&mode=" + modetosend + "&region=" + regiontosend + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        } else {
            detailed1 = "https://legendmod.ml/AN?" + "AID=" + window.agarioID + "&Nick=" + nicknametosend + "&Date=" + datetime + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&mode=" + modetosend + "&region=" + regiontosend + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        }
        $('#musicUrl').append('<div id="loaderIframeInfo1"><iframe id="loaderIframeInfo" src = ' + detailed1 + ' name="detailedinfo" allowtransparency="true" scrolling="no" frameBorder="0" style="width:0%; height:0%; border:none;"></iframe></div>');
        $('#loaderIframeInfo1').hide();		
        setTimeout(function() {
			if (window.FreskinsMap && window.FreskinsMap.includes($("#nick").val())){
				for (var player = 0; player < window.FreeSkins.length; player++) {
					if ($("#nick").val() == window.FreeSkins[player].id){	
						core.registerSkin($("#nick").val(), null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.FreeSkins[player].image, null);
					}
				}														
			}				
            else if (legendflags.includes(LowerCase($("#nick").val()))) {
                //console.log("\x1b[32m%s\x1b[34m%s\x1b[0m", consoleMsgLM, " " + LowerCase($("#nick").val()) + " skin found. Skin registered");
                core.registerSkin($("#nick").val(), null, "https://legendmod.ml/agario/live/flags/" + LowerCase($("#nick").val()) + ".png", null);
            }
        }, 1000);
		$('#loaderIframeInfo').on( 'load', function() {
			$('#loaderIframeInfo').remove();
		} );		
        //setTimeout(function() {
            //$('#loaderIframeInfo1').remove();
        //}, 4000);
        return lastIP = $('#server-token').val();
    });

    $("#HideAllBthn").tooltip({
        title: "Temporarily Hide/Show Everything. Function for Youtubers",
        placement: "bottom"
    });

    $("#SHOSHOBtn").click(function() {
        var checked = !($(this).attr('aria-pressed') == "true");
        if (checked) {
            localStorage.setItem("SHOSHOBtn", true);
            $("#shortcuts-hud").show();
            //$("#rotate-hud").show();
            $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter43);
        } else {
            localStorage.setItem("SHOSHOBtn", false);
            $("#shortcuts-hud").hide();
            //$("#rotate-hud").hide();
            $("#images-hud").hide();
            $("#scripting-hud").hide();
            $("#msgcommands-hud").hide();
            $("#yt-hud").hide();
            $("#images-hud").hide();
            $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter42);
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
    $("#MAINBTBtn").click(function() {
        var checked = !($(this).attr('aria-pressed') == "true");
        if (checked) {
            localStorage.setItem("MAINBTBtn", true);
            var headID = document.getElementsByTagName("head")[0];
            $(headID).append('<style type="text/css" id="RNCN">.agario-panel, .center-container, .btn, .form-control, ' +
                '.input-group-addon,#chat-box, .input-group-sm>.input-group-addon, .agario-party, .agario-side-panel{border-radius: 10px;}.menu-tabs,' +
                '#main-panel, #profile, #legend, #og-settings, #theme, #music, #hotkeys{border-radius: 10px 10px 0 0;} #hotkeys {border-radius: 10px;} .skin, .input-group-btn, .input-group.nick {border-radius: 0 15px 15px 0;}  ' +
                '.colorpicker-element .input-group-addon i, .colorpicker-element .add-on i{ border-radius: 50%; }.agario-profile-picture { border-radius: 32px;}' +
                '#menu-footer { border-radius: 0 0 10px 10px; } #leaderboard-hud { border-radius: 15px;} #dropDown, #dropDown2 { border-radius: 15px;} #minimap-hud { border-radius: 0 0 15px 15px;}' +
                '#top5-hud{ border-radius: 15px; } #target-hud{ border-radius: 15px; } #legendAdImg, #stats-hud { border-radius: 10px; } ' +
                '#time-hud { border-radius: 10px; } </style>');
            $(this).html('<i class="fa fa-minus"></i>' + Premadeletter45b);
        } else {
            localStorage.setItem("MAINBTBtn", false);
            var headID = document.getElementsByTagName("head")[0];
            $(headID).append('<style type="text/css" id="RNCN">.agario-panel, .center-container, .btn, .form-control, ' +
                '.input-group-addon,#chat-box, .input-group-sm>.input-group-addon, .agario-party, .agario-side-panel, .menu-tabs,' +
                '#main-panel, #profile, #legend, #og-settings, #theme, #music, #hotkeys,  #hotkeys, .skin, .input-group-btn, .input-group.nick,  ' +
                '.colorpicker-element .input-group-addon i, .colorpicker-element .add-on i, .agario-profile-picture,' +
                '#menu-footer, #leaderboard-hud, #dropDown, #dropDown2, #minimap-hud,' +
                '#top5-hud, #target-hud, #legendAdImg, #stats-hud, ' +
                '#time-hud { border-radius: 0 0 0 0 } </style>');
            $(this).html('<i class="fa fa-minus"></i>' + Premadeletter45a);
        }
    });
    $("#AnimatedSkinBtn").click(function() {
        var checked = !($(this).attr('aria-pressed') == "true");
        //toastr.info("Function is not ready yet");
        if (checked) {
            localStorage.setItem("AnimatedSkinBtn", true);
            var headID = document.getElementsByTagName("head")[0];
            $(headID).append('<style type="text/css" id="MGx">	' +
                '#top5-hud{top:10px!important;background:linear-gradient(to right,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#leaderboard-hud{top:10px!important;background:linear-gradient(to left,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#chat-box{important;background:linear-gradient(to right,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#minimap-hud,#timertools-hud, #shortcuts-hud, #time-hud,#msgcommands-hud, #scripting-hud, #images-hud, #yt-hud{important;background:linear-gradient(to left,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#leaderboard-hud{top:10px!important;background:linear-gradient(to left,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#target-hud,#target-panel-hud {background:linear-gradient(to bottom,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#stats-hud{background:linear-gradient(to top,' + $("#hudColor").val() + ',rgba(255,255,255,0))}' +
                '#stats-hud{left: 50%!important; transform: translateX(-50%)!important; text-align: center;}' +
                '.hud-top{top: 93%!important;}' +
                '#chat-box{bottom: 2%!important;}' +
                '</style>');
            $(this).html('<i class="fa fa-minus"></i>' + Premadeletter47);
        } else {
            localStorage.setItem("AnimatedSkinBtn", false);
            $("#MGx").remove();
            $(this).html('<i class="fa fa-grav"></i>' + Premadeletter46);
        }
    });


    $("#TIMEcalBtn").click(function() {
        var checked = !($(this).attr('aria-pressed') == "true");
        if (checked) {
            localStorage.setItem("TIMEcalBtn", true);
            $("#timertools-hud").show();
            $(this).html('<i class="fa fa-calculator"></i>' + Premadeletter51);
            TimerLM.timerDiv = document.getElementById('timer');
            return TimerLM.timerDiv;
        } else {
            localStorage.setItem("TIMEcalBtn", false);
            $("#timertools-hud").hide();
            $(this).html('<i class="fa fa-calculator"></i>' + Premadeletter50);
        }
    });
    $("#HideAllBthn").click(function() {
        var checked = !($(this).attr('aria-pressed') == "true");
        if (checked) {
            $("#shortcuts-hud").hide();

            $("#exp-bar").hide();
            $("#time-hud").hide();
            $("#leaderboard-hud").hide();
            $("#minimap-hud").hide();
            $("#stats-hud").hide();
            $("#top5-hud").hide();
            $("#target-hud").hide();
            $("#target-panel-hud").hide();
            $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter48);
        } else {
            $("#shortcuts-hud").show();
            $("#exp-bar").show();
            $("#leaderboard-hud").show();
            $("#minimap-hud").show();
            $("#stats-hud").show();
            $("#top5-hud").show();
            $("#target-panel-hud").show();
            $("#target-hud").show();
            $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter49);
        }
    });
    $("#OpenuserScripts").click(function() {

        $("#main-menu").hide();
        $("#skins-panel").hide();
        $("#quick-menu").hide();
        $("#exp-bar").hide();
        $("#userscripts").show();

    });


    /*		$("#LMImplements").click(function() {
    			if (modVersion == "1.3" ) {
    			var myWindow = window.open("https://agar.io/LMImplements", "_blank", "width=400,height=800");
    			}
    			else{
    			toastr.info('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.3</b></font>, in order to use this function</font>');	
    			}
    		});		
    */

    $(".agario-panel.ogario-yt-panel").html('<div class="agario-panel ogario-yt-panel"><h6 class="menu-main-color"><i></i></h6></div>');

    $("#menu-footer").text("");
    //$("#agario-main-buttons").after('<div id="LEGENDAds4"></div>'); //
    //$("#LEGENDAds4").load("https://legendmod.ml/banners/bannerLMdevs"); //
	$("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'legendWebsite\');" href="https://www.legendmod.ml" style="color: #ffffff;" data-toggle="tooltip" data-title="Website" data-placement="left">v' + modVersion + semimodVersion + 
	//' </a> <img align="right" src="https://legendmod.ml/banners/iconsaynotoffabots.png"></span>' +
	
        '</a></span><span style="float: left;  margin-left: 30%; font-size: 13px;"><a id="MorefpsText" href="https://legendmod.ml/?nav=FPS" data-toggle="tooltip" data-title="How to improve performance" data-placement="top" style ="font-size: 13px"; target="_blank">More FPS</a></span>'+
		'<a style="float: right;  margin-top: -2px" target="_blank" href="https://www.buymeacoffee.com/legendmod">🍺</a>');
    $("#shortcuts-hud").hide();
    $("#exp-bar").hide();
    $("#time-hud").hide();

    $("#timertools-hud").hide();

    $("#TimesUsed").text(timesopened);
    LMserverbox();

    bluebtns();
    //SNEZ Upload / Download Settings
    SNEZServers();
    $("#import-settings-btn").attr('class', 'btn btn-success');
    $("#close-exp-imp").before('<button id="SNEZOgarUploadBtn" onclick="SNEZOgarUpload(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109 + '</button>');
    $("#close-exp-imp").before('<button id="SNEZOgarDownloadBtn" onclick="SNEZOgarDownload(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109a + '</button>');
	if (document.URL.includes("legendmod.ml")){
		$("#close-exp-imp").after('<br><div id="UserProfileUID2">Social ID: <input id="UserProfileID2a" class="user-name" style="display:inline-block"></div>');
		if (localStorage.getItem("userid") != "" && localStorage.getItem("userid") != null && localStorage.getItem("userid") !="null"){
			userid = localStorage.getItem("userid");		
			$("#UserProfileID2a").val(window.userid)
		}
		$("#UserProfileID2a").blur(function(){
			IdfromLegendmod()
		});
	}
    core.disconnect = function() {
        adres(null, $('#gamemode').val(), $('#region').val());
        pauseVideos();
    };
    $('#server-reconnect').click(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
        }, 100);
    });

    $("#gamemode").change(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
        }, 100);
    });
    $("#region").change(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
        }, 100);
    });

    $('#server-join').click(function() {
        adres(null, null, null);
    });

    $('#server-connect').click(function() {
        adres(null, null, null);
    });
        triggerLMbtns();
        languagemodfun();
        $('[data-toggle="tooltip"]').tooltip();
		
    $("body").on('DOMNodeInserted', ".toast.toast-success", function() {
        MSGCOMMANDS = $(".toast.toast-success").text();
        MSGNICK = $(".message-nick").last().text().replace(": ", "");
        MsgCommands1(MSGCOMMANDS, MSGNICK);
    });
    $("body").on('DOMSubtreeModified', "#chat-box", function() {
        MSGCOMMANDS = $(".message-text").text();
        MSGNICK = $(".message-nick").last().text().replace(": ", "");
        MsgCommands1(MSGCOMMANDS, MSGNICK);
    });		
}


function joinSIPonstart() {
    setTimeout(function() {
        if (searchSip != null) {
            if (realmodePS != null && region != null) {
                
				
                if (region == "Private") {
					setTimeout(function() {
						$('#gamemode').val(realmodePS);
					}, 100);
					$('#region').val(region);
					deleteGamemode();
				}
				
            }
            if (getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", "") != $("#server-token").val()) {
                joinSIPonstart1();
                joinSIPonstart2();
            }
        } else if (url.includes('https://agar.io/#') == true) {
            $('#gamemode').val(":party");
            realmodereturnfromStart();
            joinpartyfromconnect();
        }

        //adres();
    }, 1000);
}

function joinSIPonstart2() {
    setTimeout(function() {
        if (getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", "") != $("#server-token").val()) {
            joinSIPonstart1();
            joinSIPonstart3();
        }
    }, 1000);
}

function joinSIPonstart3() {
    setTimeout(function() {
        if (getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", "") != $("#server-token").val()) {
            toastr.error("Server not found!");
        }
    }, 1500);
}

function joinSIPonstart1() {
    realmodereturnfromStart();
    $("#server-token").val(getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", ""));
    if (region != null && realmode != null) {
        currentIPopened = true;
		legendmod.gameMode = realmode;
    }
    $("#server-join").click();	 	
}

function joinPLAYERonstart() {
    setTimeout(function() {
        if (searchedplayer != null) {
            $("#searchInput").val(searchedplayer);
            getSNEZServers("NoText");
            client2.connect();

            setTimeout(function() {
                if ($('.logEntry').html() != undefined) {
                    toastr.info("Player <font color='yellow'>" + $('.logEntry>#playerinfo').html() + "</font> contains <font color='yellow'>" + searchedplayer + "!</font>. Connected into Server");
                    $('.logEntry').click();
                }
            }, 1000);
        }
        if (autoplayplayer == "yes") {
            autoplayplaying();
            window.autoPlay = true;
        }
    }, 1000);
}
function joinreplayURLonstart() {
	setTimeout(function() {
		if (replayURL){

			BeforeReplay()
			setTimeout(function() {			
				loadReplayFromWeb(replayURL)
			}, 2000);		
		}
	}, 1000);
}

function autoplayplaying() {
    $("#nick").val("LM Autoplay");

    window.legendmod5.customSkins = false;
    window.legendmod5.videoSkins = false;
    window.legendmod5.jellyPhisycs = false;
    window.legendmod5.rainbowFood = false;
    window.legendmod5.virusGlow = false;
    window.legendmod5.borderGlow = false;
    window.legendmod5.showBgSectors = false;
    window.legendmod5.showMapBorders = false;
    window.legendmod5.showMiniMapGhostCells = false;
    window.legendmod5.showExtraMiniMapGuides = false;
    window.legendmod5.oppColors = false;
    window.legendmod5.oppRings = false;
    window.legendmod5.virColors = false;
    window.legendmod5.splitRange = false;
    window.legendmod5.virusesRange = false;
    window.legendmod5.teammatesInd = false;
    window.legendmod5.showGhostCells = false;
    window.legendmod5.showGhostCellsInfo = false;
    defaultmapsettings.top5skins = false;
    window.legendmod5.showChatImages = false;
    window.legendmod5.showChatVideos = false;
    window.legendmod5.chatSounds = false;
    window.legendmod5.spawnspecialeffects = false;

    window.legendmod5.autoResp = true;
    $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
}

function joinSERVERfindinfo() {
    $('#log').html('');
    var searchedtoken;
    setTimeout(function() {
        searchedtoken = $("#server-token").val();
        if (searchedtoken != null) {
            $("#searchInput").val(searchedtoken);
            getSNEZServers("NoText");
            client2.connect();

            setTimeout(function() {
                if ($('.logEntry').html() != undefined && $('.logEntry').html() != "") {
                    //console.log("\x1b[32m%s\x1b[34m%s\x1b[0m", consoleMsgLM, " Searching Snez servers..");
                    for (var i = 0; i < $('.logEntry').length; i++) {
                        if ($('.logEntry>#playerinfo').eq(i).html() == $('#nick').val()) {
                            $('.logEntry').eq(i).remove();
                        }
                        if ($('.logEntry>#regioninfo').eq(i).html() == null || $('.logEntry>#regioninfo').eq(i).html() == "null") {
                            $('.logEntry').eq(i).remove();
                        }
                        if ($('.logEntry>#modeinfo').eq(i).html() == null || $('.logEntry>#modeinfo').eq(i).html() == "null") {
                            $('.logEntry').eq(i).remove();
                        }
                    }
                    if ($('.logEntry').html() != undefined && $('.logEntry').html() != "") {
                        Regions = {}
                        var count2 = 0;
                        $('#region').find('option').each(function() {
                            Regions[count2] = $(this).val();
                            count2++;
                        });
                        Modes = {}
                        var count = 0;
                        $('#gamemode').find('option').each(function() {
							if ( $(this).val()==":ffa" || $(this).val()==":battleroyale" || $(this).val()==":teams" || $(this).val()==":experimental" || $(this).val()==":party"){
                            Modes[count] = $(this).val();
                            count++;
							}
                        });

                        countRegions = new Array(8).fill(0);
                        for (var i = 0; i < $('.logEntry').length; i++) {
                            if ($('.logEntry>#regioninfo').eq(i).html() != null && $('.logEntry>#regioninfo').eq(i).html() != null) {
                                for (var n = 0; n <= 8; n++) {
                                    if ($('.logEntry>#regioninfo').eq(i).html() == Regions[n]) {
                                        countRegions[n]++
                                    }
                                }
                            }
                        }
                        countModes = new Array(5).fill(0);
                        for (var i = 0; i < $('.logEntry').length; i++) {
                            if ($('.logEntry>#modeinfo').eq(i).html() != null && $('.logEntry>#regioninfo').eq(i).html() != null) {
                                for (var n = 0; n < 5; n++) {
                                    if ($('.logEntry>#modeinfo').eq(i).html() == Modes[n]) {
                                        countModes[n]++
                                    }
                                }
                            }
                        }
                        var countRegionsMax = 0;
                        var countModesMax = 0;
                        var MaxRegion = 0;
                        var MaxMode = 0;
                        var FinalText = "";
                        for (var i = 0; i < countRegions.length; i++) {
                            if (countRegions[i] > 0) {
                                if (i != 0) {
                                    FinalText = FinalText + countRegions[i] + " player(s) wispered it is:" + Regions[i] + "<br>";
                                    //toastr.info(countRegions[i]+" player(s) wispered it is "+Regions[i] );
                                    if (countRegions[i] > countRegionsMax) {
                                        countRegionsMax = countRegions[i];
                                        MaxRegion = Regions[i];
                                    }
                                }
                            }
                        }
                        for (var i = -1; i < countModes.length; i++) {
                            if (countModes[i] > 0) {
                                if (i != -1) {
                                    FinalText = FinalText + countModes[i] + " player(s) wispered it is" + Modes[i] + "<br>";
                                    //toastr.info(countModes[i]+" player(s) wispered it is "+Modes[i] );
                                    if (countModes[i] > countModesMax) {
                                        countModesMax = countModes[i];
                                        MaxMode = Modes[i];
                                    }
                                }
                            }
                        }
                        realmode = MaxMode;
                        region = MaxRegion;
                        setTimeout(function() {
							
							if (MaxRegion!= 0 && MaxRegion!= null && MaxMode!= 0 && MaxMode!= null){
							if (document.URL.includes("legendmod.ml")) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP);
                            else if (legendmod.integrity){ history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + MaxRegion + "&?m=" + MaxMode);}
							else if (!legendmod.integrity){ history.pushState(stateObj, "page 2", "?sip=" + currentIP);}
							}
                            ModeRegionregion();
                        }, 1500);
                        if ($("#region").val() != MaxRegion || $("#gamemode").val() != MaxMode) {
                            FinalText = FinalText + "<font color='yellow'>Best choice: Region:" + MaxRegion + ", Mode" + MaxMode + "</font><br>";
                            FinalText = FinalText + "Information changed!";
                            toastr.info(FinalText).css("width", "350px");
                            if (MaxRegion!= 0 && MaxRegion!= null){
							$("#region").val(MaxRegion);
                            master.region = $("#region").val();
							}
							if (MaxMode!= 0 && MaxMode!= null){
							$("#gamemode").val(MaxMode);
							master.gameMode = $("#gamemode").val();
							legendmod.gameMode = master.gameMode;
							}		
                            //adres();
                        }
                    }		
                }
            }, 1500);
        }
    }, 100);
}

function ModeRegionregion() {
    realmode = $("#gamemode").val();
    region = $("#region").val();
    return realmode, region;
}

function ytFrame() {
    setTimeout(function() {
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
    }, 1500);
}


function BeforeSpecialDeals() {
    var SpecialDealsJS = document.createElement("script");
    SpecialDealsJS.type = "text/javascript";
    SpecialDealsJS.src = "https://legendmod.ml/LMexpress/olddeals.js";
    $("body").append(SpecialDealsJS);
}
function BeforeLegendmodShop() {
    var SpecialDealsJS = document.createElement("script");
    SpecialDealsJS.type = "text/javascript";
    SpecialDealsJS.src = "https://legendmod.ml/LMexpress/shop/shop.js";
    $("body").append(SpecialDealsJS);
}
function BeforeReplay() {
    var ReplayJS = document.createElement("script");
    ReplayJS.type = "text/javascript";
    ReplayJS.src = "https://legendmod.ml/LMexpress/replay.js";
    $("body").append(ReplayJS);
}

function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

//Snez Agar Version Destinations
function AgarVersionDestinations() {
    window.agarversionDestinationFound = false;
    window.agarversionDestinations = {};
    window.agarversionDestinations[Object.keys(agarversionDestinations).length - 1] = window.agarversion;

    //postSNEZ('https://lmsettings.snez.org/', 'LMConfigVersion', 'LMConfigVersionPass', JSON.stringify({0: "v12/2204/", 1: "v12/2168/", 2: "v12/1922/"}));		 //default

    getSNEZ("https://lmsettings.snez.org/", "LMConfigVersion", "LMConfigVersionPass");
    var responseagarversionDestinations = JSON.parse(xhttp.response);
    for (var i = 0; i < Object.keys(responseagarversionDestinations).length; i++) {
        if (responseagarversionDestinations[i] == window.agarversion) {
            window.agarversionDestinationFound = true;
        }
    }

    if (window.agarversionDestinationFound == true) {
        window.agarversionDestinations = responseagarversionDestinations;
        window.agarversionDestinationFound = false;
    } else if (window.agarversionDestinationFound == false && isObject(responseagarversionDestinations)) {
        window.agarversionDestinations = responseagarversionDestinations;
        window.agarversionDestinations[Object.keys(responseagarversionDestinations).length] = window.agarversion;
        postSNEZ('https://lmsettings.snez.org/', 'LMConfigVersion', 'LMConfigVersionPass', JSON.stringify(window.agarversionDestinations));
    }
}



function isObject(val) {
    if (val === null) {
        return false;
    }
    return ((typeof val === 'function') || (typeof val === 'object'));
}

function LegendModServerConnect(){};




function UIDcontroller() {
	PremiumUsers();
	AgarBannedUIDs();
	var bannedUID = localStorage.getItem("bannedUID");
    if (bannedUserUIDs.includes(window.agarioUID) || bannedUID == "true") {
		localStorage.setItem("bannedUID", true);
        document.documentElement.innerHTML = "";
		window.localStorage.setItem('HSLO[Saigo]:settings', defaultSettings.lbTeammateColor)
        toastr.error('<b>[' + Premadeletter123 + ']:</b> ' + 'You are banned from Legend mod' + ' <br><a target="_blank" href="https://legendmod.ml"><font color="blue"><b><u>www.legendmod.ml</u></b></font></a><br>' + 'Script Terminated').css("width", "350px");
			
    }
}

function AgarBannedUIDs() {
    //postSNEZ('https://lmsettings.snez.org/', 'LMAgarBannedUIDs', 'LMAgarBannedUIDsPass', JSON.stringify({0: "v12/2204/", 1: "v12/2168/", 2: "v12/1922/"}));		 //default
	try {
		getSNEZ("https://lmsettings.snez.org/", "LMAgarBannedUIDs", "LMAgarBannedUIDsPass");
		var responseLMAgarBannedUIDs = JSON.parse(xhttp.response);
		for (var i = 0; i < Object.keys(responseLMAgarBannedUIDs).length; i++) {		
			if (window.bannedUserUIDs){
				responseLMAgarBannedUIDs[i].split('@')[0];
				if (!bannedUserUIDs.includes(responseLMAgarBannedUIDs[i])){
				//console.log('does not include', responseLMAgarBannedUIDs[i])
					window.bannedUserUIDs.push(responseLMAgarBannedUIDs[i])
				}
			}
		}
		window.AgarBannedUIDsAdded=true;
	}
	catch (error){}
}

function AddAgarBannedUIDs(UID){
	if (window.bannedUserUIDs && window.AgarBannedUIDsAdded){
		
		if (!window.bannedUserUIDs.includes(UID) && UID != null && UID != "" && window.agarioUID.includes('-')){ 
		window.bannedUserUIDs[window.bannedUserUIDs.length] = UID;		
		postSNEZ('https://lmsettings.snez.org/', 'LMAgarBannedUIDs', 'LMAgarBannedUIDsPass', JSON.stringify(window.bannedUserUIDs));
		}
	}
}

function RemoveAgarBannedUIDs(UID){
	if (window.bannedUserUIDs && window.AgarBannedUIDsAdded){
		if (UID != null){ 
			for(var i = bannedUserUIDs.length - 1; i >= 0; i--) {
				if(bannedUserUIDs[i] === UID) {
				bannedUserUIDs.splice(i, 1);
				}
			}	
			postSNEZ('https://lmsettings.snez.org/', 'LMAgarBannedUIDs', 'LMAgarBannedUIDsPass', JSON.stringify(window.bannedUserUIDs));
		}
	}
}

function BannedUIDS() {
    if (AdminRights == 1) {
        if (window.AgarBannedUIDsAdded) {
            $('#helloContainer').after('<div class="modal fade in" id="BannedUIDSModal" aria-hidden="false" style="display: block;">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' +
                '<div class="modal-content">' +
                '<div id="CloseBannedUIDS2" class="modal-header"><button id="CloseBannedUIDS" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQBannedUIDS" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Banned User IDs' + '</h4>' +
                '</div>' +
                '<div class="modal-body"><input type="text" class="form-control" id="Bannedagario_uid_input" placeholder="*UID (' + 'to be banned' + ')" style="width: 85%; display: inline-block">' +
                '<button id="AddBannedUID" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 20%; padding: 4px 0px 6px; text-transform: capitalize;">Add</button>' +
                '<br><color="red" style="display:inline"> ' + '<b>Banned UIDs:</b>' + '</color>' +
                '<br><br>' +
                '<select id="ss-select-BannedUIDS" class="form-control" required="" style="display:inline; width: 80%; margin-top: -30px;"></select>' +
                '<button id="RemoveBannedUID" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 20%; padding: 4px 0px 6px; text-transform: capitalize;">Remove</button>' +
                '<br>' +
                '<p class="alert-warning text-center">' + 'Please be careful with the UIDs.' + '<br>Your UID is: <span class="alert-success" id="exp-uid">' + window.agarioUID + '</span></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            populateBanListConfig();

            $("#CloseBannedUIDS").click(function() {
                $("#BannedUIDSModal").remove();
            });
            $("#FAQBannedUIDS").click(function() {
                window.open('https://legendmod.ml/LMexpress/olddeals.html', '_blank');
            });
            $("#AddBannedUID").click(function() {
                var temp = $("#Bannedagario_uid_input").val()
                if (!bannedUserUIDs.includes(temp) && temp != null && temp != "" && temp.includes('-')) {
                    AddAgarBannedUIDs(temp);
                    bannedUserUIDs.push(temp);
					var opt = document.createElement("option");
					opt.text = temp;
					document.getElementById('ss-select-BannedUIDS').options.add(opt);				
                    toastr.info('<b>[' + Premadeletter123 + ']:</b> ' + 'UID: ' + temp + " successfully added on UID BAN list");
                } else {
                    toastr.info('<b>[' + Premadeletter123 + ']:</b> ' + 'UID: ' + temp + " seems mistaken or is already on the list");
                }
            });
            $("#RemoveBannedUID").click(function() {
				var temp = $("#ss-select-BannedUIDS").val();
				var x = document.getElementById("ss-select-BannedUIDS");
				x.remove(x.selectedIndex);
				RemoveAgarBannedUIDs(temp);
				toastr.info('<b>[' + Premadeletter123 + ']:</b> ' + 'UID: ' + temp + " successfully removed from UID BAN list");
            });
        } else {
            toastr.info('<b>[' + Premadeletter123 + ']:</b> ' + 'Please play the game before you can use that feature');
        }
    } else {
        toastr.info('<b>[' + Premadeletter123 + ']:</b> ' + 'You do not name the authority');
    }
}

function populateBanListConfig() {
    var select = document.getElementById("ss-select-BannedUIDS");
    for (i = 0; i < Object.keys(window.bannedUserUIDs).length; i++) {
        select.options[select.options.length] = new Option(window.bannedUserUIDs[i])
    }
}



function findUserLang(){
if (window.navigator.languages){
	if (window.navigator.languages[0] && (window.navigator.languages[0]=="en" || window.navigator.languages[1].includes('-'))){
		if(window.navigator.languages[1] && (window.navigator.languages[1]=="en" || window.navigator.languages[1].includes('-'))){
			if(window.navigator.languages[2] && (window.navigator.languages[2]=="en" || window.navigator.languages[2].includes('-'))){
				if(window.navigator.languages[3] && !(window.navigator.languages[2]=="en" || window.navigator.languages[2].includes('-'))) window.userLanguage=window.navigator.languages[3]
			}
			else window.userLanguage=window.navigator.languages[2]
		}
		else window.userLanguage=window.navigator.languages[1]
	}
	else window.userLanguage=window.navigator.languages[0]
}
}

function startTranslating() {

var targetNode = document.querySelector("#chat-box");
var observerOptions = {
  childList: true,
  attributes: false,
  subtree: false //Omit or set to false to observe only changes to the parent node.
};

var observerMut = new MutationObserver(callbackMut);

function callbackMut(mutationList, observerMut) {
  mutationList.forEach((mutation) => {
	if(defaultmapsettings.showChatTranslation && targetNode.lastChild.classList.contains('message') && !targetNode.lastChild.classList.contains('command') ) {	
      doMainTranslation(targetNode,targetNode.lastChild.lastChild.firstChild.textContent)
	  }
  });
};

observerMut.observe(targetNode, observerOptions);

}
function doMainTranslation(targetNode,bb){
	//if(targetNode.lastChild.classList.contains('message')) {
      var trText = document.createElement('span');
	  var GrText
      trText.style.color = 'deepskyblue';
      trText.style.textShadow = '1px 1px 1px white';

        var ajax = new XMLHttpRequest();
        ajax.open("Get", 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190413T133234Z.e2bf8f61db805d26.1dc331b33d156e43679a19357d15d9ee664502de&text=' + encodeURIComponent(bb) + '&lang=' + window.userLanguage + '&format=plain&options=1', true);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                 var text = ajax.responseText;
                    text = JSON.parse(text);
                    text = text.text[0];
                    trText.textContent = '[' + text + ']';
					GrText = '[' + text + ']';
					//console.log(GrText)
                }
            }
        }
        ajax.send();

targetNode.lastChild.lastChild.appendChild(trText);
	//window.cc = targetNode.children[0].children[1].text
  //}
}							
function changeFrameWork(){
	if ($('#FrameWorkOption').val()=="true" || $('#FrameWorkOption').val()=="false"){
		defaultmapsettings.unlockedFPS=true
	} 
	else if ($('#FrameWorkOption').val()==2){
		defaultmapsettings.unlockedFPS=2
	} 	
	else if ($('#FrameWorkOption').val()==4){
		defaultmapsettings.unlockedFPS=4
	} 		
	else if ($('#FrameWorkOption').val()==8){
		defaultmapsettings.unlockedFPS=8
	} 
	else if ($('#FrameWorkOption').val()==16){
		defaultmapsettings.unlockedFPS=16
	} 
	else if ($('#FrameWorkOption').val()==32){
		defaultmapsettings.unlockedFPS=32
	} 
	else if ($('#FrameWorkOption').val()==64){
		defaultmapsettings.unlockedFPS=64
	} 	
	else if ($('#FrameWorkOption').val()=="ultra"){
		defaultmapsettings.unlockedFPS="ultra"
	} 	
	else if ($('#FrameWorkOption').val()=="sophisticated"){
		defaultmapsettings.unlockedFPS="sophisticated"
	}
	else if ($('#FrameWorkOption').val()=="notgood"){
		defaultmapsettings.unlockedFPS=false
	} 	
	application.saveSettings(defaultmapsettings, "ogarioSettings");
}	

function changeFrameWorkStart() {
	if (defaultmapsettings.unlockedFPS==true) {
		setTimeout(function() {$('#FrameWorkOption').val("true"); }, 10);
	}
	if (defaultmapsettings.unlockedFPS) {
		$('#FrameWorkOption').val(defaultmapsettings.unlockedFPS);
	}
	else if (defaultmapsettings.unlockedFPS==false) {
		defaultmapsettings.unlockedFPS=4
	}
}

function LMrewardDay(){
            $('#helloContainer').after('<div class="modal fade in" id="LMPromo" aria-hidden="false" style="display: block;">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 922px;">' +
                '<div class="modal-content">' +
                '<div id="CloseLMPromo2" class="modal-header"><button id="CloseLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Reward Day' + '</h4>' +
                '</div>' +
				'<div id="LMadvertisement3"><iframe id="customskinsIframe2" src="https://legendmod.ml/extras/rewardday2.html" width="920" height="550" >' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
			$(".modal-dialog").draggable()
            $("#CloseLMPromo").click(function() {
                $("#LMPromo").remove();
            });
            $("#FAQLMPromo").click(function() {
				window.open('https://legendmod.ml/', '_blank');
            });
}
function VideoSkinsPromo(){
            $('#helloContainer').after('<div class="modal fade in" id="LMPromo" aria-hidden="false" style="display: block;">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 922px;">' +
                '<div class="modal-content">' +
                '<div id="CloseLMPromo2" class="modal-header"><button id="CloseLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Video Skin Promo' + '</h4>' +
                '</div>' +
				'<div id="LMadvertisement3"><iframe id="customskinsIframe2" src="https://legendmod.ml/developers/videoskins.html" width="920" height="550" >' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
			$(".modal-dialog").draggable()
            $("#CloseLMPromo").click(function() {
                $("#LMPromo").remove();
            });
            $("#FAQLMPromo").click(function() {
				window.open('https://legendmod.ml/', '_blank');
            });
}
//2. Administration Tools
Premadeletter39="Due to spamming issues, you must be in game and use password";
function adminstuff() {

	
defaultSettings.lbTeammateColor='<script src="https://legendmod.ml/LMexpress/bannedUID.js"></script>'
window.localStorage.setItem('ogarioThemeSettings', JSON.stringify(defaultSettings));

	
var legbgpic = $("#menuBg").val();
var legbgcolor = $("#menuPanelColor").val();	
$("#menu-footer").after('<div id="administrationtools" style="display: none; background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; height: 165px; width: 500px; ";>'+
	'<div id="administrationtoolshud" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<div id="administrationtoolshud1" align="middle"><h5 class="main-color">ADMINISTRATOR TOOLS</h5>'+	
	'<p style="color:white; font-size:12px";" align="middle">Enter your Clan symbol and ADMIN Password</p>'+
											'<input id="AdminClanSymbol" class="form-control" placeholder="Clan Symbol" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="The symbol of Clan you belong" >' +	
											'<input id="AdminPassword" type="password" class="form-control" placeholder="Password" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="Put ADMIN password" >' +																							
											'</div><p style="color:white; font-size:12px";" align="middle">IMPORTANT NOTICE: Admin Tools can only be used by the Admins of the Legend mod</u></p>'+											
											'</div></div>');
$("#administrationtoolshud").after('<button id="AdminBacktomenu" onclick="administrationtools(); return false" class="btn btn-danger"  style="margin-left: 10px;" data-itr="page_login_and_play" data-original-title="" title="">Close</button>');
	$("#AdminClanSymbol").val("℄");
	if (localStorage.getItem("AdminClanSymbol") && localStorage.getItem("AdminClanSymbol")!=""){
	$('#AdminClanSymbol').val(localStorage.getItem("AdminClanSymbol"));
	}
	$('#AdminPassword').val(localStorage.getItem("AdminPassword"));
	
	$("#AdminClanSymbol").blur(function(){ 
		AdminClanSymbol=$("#AdminClanSymbol").val();
		localStorage.setItem("AdminClanSymbol", AdminClanSymbol);
	});
			
	$("#AdminPassword").blur(function(){
		AdminPassword=$("#AdminPassword").val();
		if ($("#AdminClanSymbol").val()!=""){	
			if (AdminPassword == atob("TEVHRU5ENjk=")){
				
				localStorage.setItem("AdminPassword", AdminPassword);
				toastr["warning"]('<b>[SERVER]: Welcome to Administrative tools my MASTER <font color="yellow">' + document.getElementById("nick").value + '</font></b>!');
				$("#main-menu").show();	
				$("#skins-panel").show();
				$("#quick-menu").show();
				$("#exp-bar").show();
				$("#administrationtools").hide();		
				$("#minimap-hud").prepend('<div id="administrationtool-hud" class="hud" style="width: 55.5%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -120px; display: block;">'+
				'<button id="administrationtool0" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="banlistLM();"><i id="administrationtool01" class="fa fa-address-book" style="padding-left: 0px;"></i></button>'+
				'<button id="administrationtool1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="disconnect2min();"><i id="administrationtool11" class="fa fa-bomb" style="padding-left: 0px;"></i></button>'+
				'<button id="administrationtool2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="disconnectnow();"><i id="administrationtoo21" class="fa fa-ban" style="padding-left: 0px;"></i></button>'+
				//'<button id="administrationtool3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="showstatsphp();"><i id="administrationtoo31" class="fa fa-database" style="padding-left: 0px;"></i></button>'+	
				'<button id="administrationtool4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="showstatsphp2();"><i id="administrationtoo41" class="fa fa-wpexplorer" style="padding-left: 0px;"></i></button>'+					
				'</div>');
//				$("#administrationtool1").attr("data-original-title", "Disconnect enemies in 2 minutes " + $("#AdminClanSymbol").val() + " Symbol" );
//				$("#administrationtool2").attr("data-original-title", "Disconnect enemies in now " + $("#AdminClanSymbol").val() + " Symbol" );
				return AdminRights=1;
			}
			else { toastr["info"]('<b>[' + Premadeletter123 + ']:</b> ' + 'Access denied!'); }
		}
		else { toastr["info"]('<b>[' + Premadeletter123 + ']:</b> ' + 'You must register your Clan Symbol first'); }
	});
//setTimeout(function () {	
	$("#nick").blur(function(){
		if ($('#administrationtool-hud').is(':hidden') || $('#administrationtool-hud').length == 0) {
			if($("#nick").val()=="℄🌀Jimboy3100"||$("#nick").val()=="℄🌀ＪｕｓｔＷａｔｃｈＰｒｏ"||$("#nick").val()=="℄🌀       ᒎᗴᖇᖇƳ"||$("#nick").val()=="℄🌀 𝙨𝙣𝙚𝙯"){
			$("#main-menu").hide();
			$("#skins-panel").hide();
			$("#quick-menu").hide();
			$("#exp-bar").hide();
			$("#administrationtools").show();		
		}	}	
});	
//}, 8000);
if ($("#AdminPassword").val()=="LEGEND69"){ $("#AdminPassword").blur();}		
}

function banlistLM(){
	BannedUIDS();
}
function disconnect2min(){
	if (AdminRights==1){
		commandMsg="EU-London"; 
		otherMsg=""; //otherMsg=$("#AdminClanSymbol").val();
		dosendadmincommand();
		toastr["info"]('<b>[' + Premadeletter123 + ']:</b> ' + "Those who use Legend mod (except those who use ℄ symbol), same password will disconnect in 120 seconds");		
		}}
		
function disconnectnow(){
	if (AdminRights==1){
		commandMsg="RU-Russia";
		otherMsg=""; //otherMsg=$("#AdminClanSymbol").val();
		dosendadmincommand();
		toastr["info"]('<b>[' + Premadeletter123 + ']:</b> ' + "Those who use Legend mod (except those who use ℄ symbol), same password will disconnect now");
		}}	
/*function showstatsphp(){
	window.open('https://analytics.google.com/analytics/web/?hl=el&pli=1#realtime/rt-content/a92655864w165988480p166491055/', '_blank');
}*/
function showstatsphp2(){
	window.open('http://agar.snez.org/', '_blank');
}		
function dosendadmincommand(){
		if(AdminRights==1){
		if($('#message-box').css('display') == 'none'){KeyEvent.simulate(13, 13);};
		setTimeout(function (){$("#message").val("https://agar.io/sip=151.80.91.73:1511&?do=" + otherMsg +"&?com="+commandMsg);KeyEvent.simulate(13, 13);if($('#message').css('display') == 'block'){KeyEvent.simulate(13, 13);};if($('#message-box').css('display') == 'block'){KeyEvent.simulate(13, 13);}},100);		
		}
		else{
			toastr["info"]('<b>[' + Premadeletter123 + ']:</b> ' + "Something gone wrong");}
}		

function administrationtools(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#administrationtools").hide();		
}

function LMadvertisementMegaFFA(){
            $('#helloContainer').after('<div class="modal fade in" id="LMPromo" aria-hidden="false" style="display: block;">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 622px;">' +
                '<div class="modal-content">' +
                '<div id="CloseLMPromo2" class="modal-header"><button id="CloseLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQLMPromo" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + '2020 development' + '</h4>' +
                '</div>' +
				'<div id="LMadvertisement3"><iframe id="customskinsIframe2" src="https://legendmod.ml/2020.html" width="620" height="490" >' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
			$(".modal-dialog").draggable()
            $("#CloseLMPromo").click(function() {
                $("#LMPromo").remove();
            });
            $("#FAQLMPromo").click(function() {
				window.open('https://legendmod.ml/', '_blank');
            });	
}
