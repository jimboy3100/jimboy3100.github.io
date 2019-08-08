/**************
 * Legend express v0.074 by Jimboy3100   email:jimboy3100@hotmail.com
 *************/
var semimodVersion = "66"; // the version 1.1-> 1.11
//fix ffa
/*
setTimeout(function() {
$('#gamemode>option:nth-child(1)').val(':ffa');	
$('#gamemode').trigger('change');
}, 1500);
*/

$("#toast-container").hide();
setTimeout(function() {
    $("#toast-container").show()
}, 8000);
appendLMhiFbPs();
PreLcCelebration();
loadericon();
PremiumUsers();
document.title = "LM express";
//Authenticate Mod Script
var accesstomod;
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
$("#gamemode").prop('disabled', false);
$("#region").prop('disabled', false);
var oldgamemode = $("#gamemode");
//privateservutil();

var currentIP = "0.0.0.0:0";
var currentIPopened;
var currentToken = "";
var previousMode = localStorage.getItem("gamemode");

var checkonlyonce = localStorage.getItem("checkonlyonce");
var checkonlysixth = localStorage.getItem("checkonlysixth");
var defaultMusicUrl = "https://www.youtube.com/watch?v=e7nkA7Ue5yg";
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
var yt6data = "Legend mod Promo";
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
//var YoutubeAutoBtn = localStorage.getItem("YoutubeAutoBtn");
var TIMEcalBtn = localStorage.getItem("TIMEcalBtn");
var troll1Btn = localStorage.getItem("troll1Btn");
var ComPosition = localStorage.getItem("ComPosition");
var autoCoinBtn = localStorage.getItem("autoCoinBtn");
var timesopened = localStorage.getItem("timesopened");
var url = localStorage.getItem("url");
var region = getParameterByName("r", url);
var realmode = getParameterByName("m", url);
var searchStr = getParameterByName("search", url);
var searchSip = getParameterByName("sip", url);
var privateSrv = getParameterByName("ip", url);
var clanpass = getParameterByName("pass", url);
var searchedplayer = getParameterByName("player", url);
var autoplayplayer = getParameterByName("autoplayer", url);
var realmode2 = "";
var mode = ""; //just in case
var token = "";
var messageone = 1; //If legendmod is being used
var hiddenfromclan = 0;
var saveclanpassword = localStorage.getItem("saveclanpassword");
var troll1;
var seticon = "YES";
var setmessagecom = "YES";
var setyt = "YES";
var searching;
var timerId;
T = {};
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
var Ultimouseenabled = 0;
var setscriptingcom = "YES";
var usedonceSkin = 0;
var toastrSkinNotice = 0;
var detailed = "";
var detailed1;
var fromstart = "false";
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
var prevPrivateServer = localStorage.getItem("prevPrivateServer");
var CopyTkPwLb2;
var languagemod = localStorage.getItem("languagemod");
//for MsgCommands
var MSGCOMMANDS2a;
var MSGCOMMANDSA;
var MSGCOMMANDS2;
var MSGCOMMANDS3;
var Express = "True";
var acceptServerBtnFlag = null;
var animateSkinsStart;
//for the LM JSON
var LegendJSON;
var LegendSettings = "true";
var LegendSettingsfirstclicked = "false";
var switcheryLegendSwitch, switcheryLegendSwitch2;
var UniversalChatSaved = localStorage.getItem("UniversalChatSaved");
var VanillaskinsSaved = localStorage.getItem("VanillaskinsSaved");
var top5skinsSaved = localStorage.getItem("top5skinsSaved");
var spawnspecialeffectsSaved = localStorage.getItem("spawnspecialeffectsSaved");
var AnimatedRainbowColorSaved = localStorage.getItem("AnimatedRainbowColorSaved");
if (localStorage.getItem("leaderboardlimit") != null) {
    window.leaderboardlimit = localStorage.getItem("leaderboardlimit");
}
if (localStorage.getItem("teamboardlimit") != null) {
    window.teamboardlimit = localStorage.getItem("teamboardlimit");
}



var showonceusers3 = 0;
var client2;
var xhttp = new XMLHttpRequest();
//var a= xhttp.response;


//Animated Skins
var animatedi;
var animateda;
var animatedkey;
window.a = 0;
var b, c;
var animatedserverchanged = false;

loadersetings();

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

var stylesLegendModConsole1 = [
    'background: linear-gradient(#D33106, #571402)', 'border: 1px solid #3E0E02', 'color: #99c2ff', 'display: block', 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)', 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset', 'line-height: 40px', 'text-align: center', 'font-weight: bold'
].join(';');
var stylesLegendModConsole2 = [
    'background: linear-gradient(grey, black)', 'border: 1px solid #3E0E02', 'color: #FFFFFF', 'display: block', 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)', 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    //    , 'line-height: 40px'
    , 'text-align: center'
    //    , 'font-weight: bold'
].join(';');

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
                    //console.log(a.canvas.id);
                    a.fillStyle = tcm2.f.gradient(a);
                }
            });
        }
    }
};
//tcm2.f.override();


var $head = $("head");
var $headlinklast = $head.find("link[rel='stylesheet']:last");
var linkElement = "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/css/flag-icon.min.css' type='text/css' media='screen'>";
if ($headlinklast.length) {
    $headlinklast.after(linkElement);
} else {
    $head.append(linkElement);
}

if (realmode == "") {
    modebetter2 = ":ffa";
} else {
    modebetter2 = realmode;
}
privateserverpassword();
urlIpWhenOpened();
var minbtext2 = minbtext;
var minbtext3 = minbtext;
if (minbtext == null || minbtext == "") {
    minbtext = "Legend express"; //Legend express/Locked
    minbtext2 = "Legend express";
    minbtext3 = "Legend express/Private";
}
LMminimapTextAct();

var datasent2;
//fzogarOgarIframeListener();
emphasischat();
//specialeffecttargeting();
function init(modVersion) {
    // ANNOUNCEMENTS
    //toastr["info"]('<b><font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://jimboy3100.github.io/banners/particles.gif);">'+'Legend mod </span></font> is back!<br><font color="red"></b>Enable Vanilla skins on Settings</font>').css("width", "350px");
    if (modVersion != "1.6") {
        toastr["info"]('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.6</b></font>. <br>(Https Protocol)<br>visit: <a target="_blank" href="http://www.legendmod.ml"><font color="yellow"><b><u>www.legendmod.ml</u></b></font></a>');
    }
    $("#ogario-party").wrap('<div style="display: none;" id="hidendivtoken"></div>');
    universalchat();
    $('.options-box.chatGroup').append('<label><input type="checkbox" id="UniversalChat" class="js-switch" data-switchery="true" checked style="display: none;"> Agar Tool/Legend Mod</input></label>');
    var elemLegendSwitch = document.querySelector('#UniversalChat');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var UniversalChat = new Switchery(elemLegendSwitch, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    $("#UniversalChat").click(function() {
        if (UniversalChat.isChecked()) {
            $("#ao2t-hud").show();
            localStorage.setItem("UniversalChatSaved", true);
            if ($("#ao2t-capture").hasClass("disconnected")) {
                $("#ao2t-capture").click();
            }
        } else {
            $("#ao2t-hud").hide();
            localStorage.setItem("UniversalChatSaved", false);
            if ($("#ao2t-capture").hasClass("connected")) {
                $("#ao2t-capture").click();
            }
        }
    });
    $('.options-box.skinsGroup').append('<label><input type="checkbox" id="Vanillaskins" class="js-switch" data-switchery="true" style="display: none;"> Vanilla skins</input></label>');
    var elemLegendSwitch2 = document.querySelector('#Vanillaskins');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var Vanillaskinsbtn = new Switchery(elemLegendSwitch2, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    $("#Vanillaskins").click(function() {
        if (Vanillaskinsbtn.isChecked()) {
            localStorage.setItem("VanillaskinsSaved", "true");
            window.vanillaskins = true;
            // Animated Skins
            animateSkinsStart = setInterval(animateSkincheckTimer, 60000);
            return animateSkinsStart;
        } else {
            localStorage.setItem("VanillaskinsSaved", "false");
            legendmod3.flushSkinsMap();
            window.vanillaskins = false;
            // Animated Skins
            animateSkinsStop();
        }
    });
    $("#Vanillaskins").click(); //enabled by default
    $('.options-box.hudGroup').append('<label><input type="checkbox" id="top5skins" class="js-switch" data-switchery="true" style="display: none;"> Skins on teamboard</input></label>');
    var elemLegendSwitch3 = document.querySelector('#top5skins');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var top5skinsbtn = new Switchery(elemLegendSwitch3, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    $("#top5skins").click(function() {
        if (top5skinsbtn.isChecked()) {
            localStorage.setItem("top5skinsSaved", "true");
            window.top5skins = true;
        } else {
            localStorage.setItem("top5skinsSaved", "false");
            window.top5skins = false;
        }
    });
    $("#top5skins").click(); //enabled by default
    $('.options-box.respGroup').append('<label><input type="checkbox" id="spawnspecialeffects" class="js-switch" data-switchery="true" style="display: none;"> Spawn special effects</input></label>');
    var elemLegendSwitch4 = document.querySelector('#spawnspecialeffects');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var spawnspecialeffectsbtn = new Switchery(elemLegendSwitch4, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    $("#spawnspecialeffects").click(function() {
        if (spawnspecialeffectsbtn.isChecked()) {
            localStorage.setItem("spawnspecialeffectsSaved", "true");
            window.spawnspecialeffects = true;
        } else {
            localStorage.setItem("spawnspecialeffectsSaved", "false");
            window.spawnspecialeffects = false;
        }
    });

    $('.options-box.transparencyGroup').append('<label><input type="checkbox" id="AnimatedRainbowColor" class="js-switch" data-switchery="true" style="display: none;">Animated rainbow colors</input></label>');
    var elemLegendSwitch2 = document.querySelector('#AnimatedRainbowColor');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var AnimatedRainbowColorbtn = new Switchery(elemLegendSwitch2, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    $("#AnimatedRainbowColor").click(function() {
        if (AnimatedRainbowColorbtn.isChecked()) {
            localStorage.setItem("AnimatedRainbowColorSaved", "true");
            tcm2.f.override();
            // Animated Skins

        } else {
            localStorage.setItem("AnimatedRainbowColorSaved", "false");
            toastr["info"]("Changes will fully be reflected after restart");
        }
    });

    /*           if (UniversalChatSaved == "false") { //For Setting DoubleSplitRange
                    $("#UniversalChat").click();
    				setTimeout(function() {
    				$("#ao2t-hud").hide();
    				}, 1100);
                }		
    */

    //var connectedbanner=0;
    $("#gamemode").prop('disabled', false);
    $("#region").prop('disabled', false);

    if (timesopened != null) {
        timesopened++;
        localStorage.setItem("timesopened", timesopened);
    } else if (timesopened == null) {
        localStorage.setItem("timesopened", "0");
    }
    pre_loopLM(modVersion);
}


function getEmbedUrl(url) {
    url = url.trim();
    var musicParams = "showinfo=0&controls=2&vq=tiny&enablejsapi=1";
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

function loadersetings() {
    setTimeout(function() {
        if (timesopened >= 3) {
            if (checkonlyonce != "true") {
                //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
                if (SHOSHOBtn != "true") {
                    toastr["error"](Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                        timeOut: 15000,
                        extendedTimeOut: 15000
                    }).css("width", "300px");
                    checkonlyonce = "true";
                    localStorage.setItem("checkonlyonce", checkonlyonce);
                }
            }
        }
/*		
        if (checkonlysixth != "true") {
        //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
		toastr["info"]('<b>Thanks to author of <span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://jimboy3100.github.io/banners/particles.gif);"> <a href="http://deltav4.glitch.me/" target="blank"><font color="yellow">http://deltav4.glitch.me/</font></a> </span> for fixing tokens.<br><font color="red"></b>LM updated!<font>').css("width", "350px");
	
        toastr["info"]('<center><b><font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://jimboy3100.github.io/banners/particles.gif);">'+
		'✮✰𝑺𝒐𝒏𝒊𝒂✰✮</span></font> is the new co-developer of Legend Express. <br>'+
		'New updates by ✮✰𝑺𝒐𝒏𝒊𝒂✰✮:<br>'+
		'1. <font color="red">Huge Perfomance improvement</font></a> (test it yourself)<br>'+
		'2. <font color="red">Map position fixed</font> with all LM users </i>(like party)<i><br>'+
		'3. Opponent rings and colors improved<br>'+
		'New updates by ℄🌀Jimboy3100:<br>'+
		'1. Webbouncers, skin destinations autoupdate<br>'+
		'2. Universal tool socket enabled if primary falls <br>'+
		'<u><a target="_blank" href="http://www.legendmod.ml"><font color="blue">www.legendmod.ml</font></u></b></center>', '', {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "450px");  
				
		checkonlysixth = "true";
		localStorage.setItem("checkonlysixth", checkonlysixth);				
       // }					
		}
*/
        if (timesopened == 10 || timesopened == 100 || timesopened == 1000) {
            //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
            if (SHOSHOBtn != "true") {
                toastr["error"](Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                    timeOut: 15000,
                    extendedTimeOut: 15000
                }).css("width", "300px");
                checkonlyonce = "true";
                localStorage.setItem("checkonlyonce", checkonlyonce);
            }
        }

    }, 3500);
}

function loadericon() {
    //continue loadericon
    //    setTimeout(function() {
    setTimeout(function() {
        $("#imagebig").fadeOut(1500);
        setTimeout(function() {
            $("#imagebig").remove();
        }, 1600); //remove it
    }, 1000);
    //		}, 100);
}

function PremiumUsers() {
    var ProLicenceUsersTableJS = document.createElement("script");
    ProLicenceUsersTableJS.type = "text/javascript";
    ProLicenceUsersTableJS.src = "https://jimboy3100.github.io/AjaxData/ProLicenceUsersTableJS.js";
    $("body").append(ProLicenceUsersTableJS);
}

function getaccesstoken() {
    $.ajax({
        type: "GET",
        url: "https://jimboy3100.github.io/AjaxData/accesstoken.html",
        datatype: "json",
        success: function(info) {
            accesstomod = info[17];
            //return accesstomod;
            getaccesstoken2(accesstomod);
        }
    });
}

function getaccesstoken2(accesstomod) {
    //    setTimeout(function() {
    if (accesstomod != "a" && accesstomod != null) {
        toastr["error"]('<b>[' + Premadeletter123 + ']:</b> ' + Premadeletter88 + ', <br>' + Premadeletter118 + ': <a target="_blank" href="https://jimboy3100.github.io/legendmod.user.js"><font color="yellow"><b><u>www.legendmod.ml</u></b></font></a><br>' + Premadeletter89).css("width", "300px");
        setTimeout(function() {
            document.documentElement.innerHTML = "";
        }, 8000);
    }
    //   }, 10000);
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function appendLMhiFbPs() {
    $("body").on('DOMNodeInserted', ".toast.toast-warning", function() {
        MSGCOMMANDS2 = $(".toast.toast-warning").html();
        if (MSGCOMMANDS2.includes("You are using an old version of OGARio by")) {
            toastr["error"]("You are using a wrong version, visit: www.legendmod.ml");

        } else if (MSGCOMMANDS2.includes("Welcome! You are connected to the OGARio")) {
            $(".toast.toast-warning").remove();
            $("#gamemode").prop('disabled', false);
            $("#region").prop('disabled', false);
            $(".toast.toast-warning").remove();
            //		setTimeout(function () {
            if (clanpass != null && clanpass != "") {
                $("#clantag").val(clanpass);
                $('#clantag').css('background-color', '#ff6347');
            }
            if (privateSrv != null) {
                if ($('#clantag').val() == "") {
                    if (privateSrv.includes("eu.fzogar.xyz:4000")) {
                        $("#clantag").val("PS1");
                    } else if (privateSrv.includes("eu.fzogar.xyz:4001")) {
                        $("#clantag").val("PS2");
                    } else if (privateSrv.includes("eu.fzogar.xyz:5001")) {
                        $("#clantag").val("PS3");
                    } else if (privateSrv.includes("eu.fzogar.xyz:5002")) {
                        $("#clantag").val("PS4");
                    } else if (privateSrv.includes("sg.fzogar.xyz:4000")) {
                        $("#clantag").val("PS5");
                    } else if (privateSrv.includes("sg.fzogar.xyz:4001")) {
                        $("#clantag").val("PS6");
                    } else if (privateSrv.includes("in.fzogar.xyz:443")) {
                        $("#clantag").val("PS7");
                    } else {
                        $("#clantag").val("PS");
                    }
                }
            }
            $("#overlays").show();
            $(".center-container.ogario-menu").show();
            $(".side-container.right-container").show();
            $(".side-container.left-container").show();
            //		},200);
            //		if($('#region>option:nth-child(1)').val()!=":PrS")	{
            //		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
            //		}


            //userData=$.get("http://gd.geobytes.com/GetCityDetails", function (response) { $("#response").html(JSON.stringify(response, null, 4)); }, "jsonp");
            userData = $.get("https://extreme-ip-lookup.com/json/", function(response) {
                $("#response").html(JSON.stringify(response, null, 4));
                if (userData != null) {
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            }, "jsonp");
            /*		setTimeout(function (){ 
            		if (userData!=null) {localStorage.setItem("userData", JSON.stringify(userData));}
            		},300); */
        }


    });


    $("body").on('DOMSubtreeModified', "#chat-box", function() {
        var MSGCOMMANDS3 = $(".command-text").text();
        if (MSGCOMMANDS3.includes("You are using an old version of OGARio by")) {
            $(".command-text").text('You are using a wrong version, visit: www.legendmod.ml');
        } else if (MSGCOMMANDS3.includes("Welcome! You are connected to the OGARio by szymy server. Have a nice mass!")) {
            $("#gamemode").prop('disabled', false);
            $("#region").prop('disabled', false);
            //	$(".toast.toast-warning").remove();
            $(".command-text").text(Premadeletter0);
            //		setTimeout(function () {
            //spectate();
            if (clanpass != null && clanpass != "") {
                $("#clantag").val(clanpass);
                $('#clantag').css('background-color', '#ff6347');
            }
            if (privateSrv != null) {
                if ($('#clantag').val() == "") {
                    if (privateSrv.includes("eu.fzogar.xyz:4000")) {
                        $("#clantag").val("PS1");
                    } else if (privateSrv.includes("eu.fzogar.xyz:4001")) {
                        $("#clantag").val("PS2");
                    } else if (privateSrv.includes("eu.fzogar.xyz:5001")) {
                        $("#clantag").val("PS3");
                    } else if (privateSrv.includes("eu.fzogar.xyz:5002")) {
                        $("#clantag").val("PS4");
                    } else if (privateSrv.includes("sg.fzogar.xyz:4000")) {
                        $("#clantag").val("PS5");
                    } else if (privateSrv.includes("sg.fzogar.xyz:4001")) {
                        $("#clantag").val("PS6");
                    } else if (privateSrv.includes("sg.fzogar.xyz:4002")) {
                        $("#clantag").val("PS7");
                    } else {
                        $("#clantag").val("PS");
                    }
                }
            }
            $("#overlays").show();
            $(".center-container.ogario-menu").show();
            $(".side-container.right-container").show();
            $(".side-container.left-container").show();
            //		},200);

            //		if($('#region>option:nth-child(1)').val()!=":PrS")	{
            //		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
            userData = $.get("https://extreme-ip-lookup.com/json/", function(response) {
                $("#response").html(JSON.stringify(response, null, 4));
                if (userData != null) {
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            }, "jsonp");
            /*		setTimeout(function (){ 
            		if (userData!=null) {localStorage.setItem("userData", JSON.stringify(userData));}
            		},300); */

            //		}		
        }

    });

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



/*

        $('#server-reconnect').click(function() {
            adres();
			setTimeout(function() {
                $("#server").val(currentIP);
            }, 2500);
        });

		$("#gamemode").change(function () {
            adres();
			setTimeout(function() {
				if ($("#gamemode").val() != ":party") {				
                $("#server").val(currentIP);
				}
            }, 2500);
        });
		$("#region").change(function () {
            adres();
			setTimeout(function() {
                $("#server").val(currentIP);
            }, 2500);
        });		
*/

function adres(info, thismode, thisregion) {
    var info, thismode, thisregion;
    if (thismode == null || thisregion == null) {
        joinSERVERfindinfo();
    }
    if ($("#gamemode").val() != ":party") {
        setTimeout(function() {
            currentIP = "live-arena-" + $("#server-token").val() + ".agar.io";
            $("#server").val(currentIP);

            if (privateSrv == null) {
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
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                        return currentIPopened = false;
                    } else if (thismode != null && thisregion != null) {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                        //history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                    } else {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP);
                        realmode = null;
                        region = null;
                        return realmode, region;
                    }
                } else if (realmode == ":party") {
                    window.history.pushState(null, null, window.location.pathname);
                    $("#server").val("#" + window.location.href.replace('https://agar.io/#', ''));
                }
            } else if (privateSrv != null) {
                history.pushState(stateObj, "page 2", "?ip=" + privateSrv + "&?SERVER=PRIVATE");
            }

        }, 1800);
    } else { //if party
        setTimeout(function() {
            //				if (info!="noinfo"){                     
            //window.history.pushState(null, null, window.location.pathname);
            $("#server").val("#" + window.location.href.replace('https://agar.io/#', ''));
            //				}			
        }, 2000);
    }
}

function privateserverpassword() {
    setTimeout(function() {
        if (privateSrv != null) {
            $(".btn-spectate").click();
            prevPrivateServer = 1;
            localStorage.setItem("prevPrivateServer", 1);
            return prevPrivateServer = 1;
        } else {
            if (prevPrivateServer == "1") {
                $("#clantag").val(saveclanpassword);
                prevPrivateServer = 0;
                localStorage.setItem("prevPrivateServer", 0);
                return prevPrivateServer = 0;
            }
        }
    }, 6000);
}

function LMserverbox() {


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
            $("#gamemode").after('<input id="server" class="form-control" style="width: 74%;  display: none; margin-left: 0px; margin-top: 5px"><button type="submit" id="connect" class="btn btn-primary" style="width: 24%; display: none; margin-left: 6px; margin-top: -3px">Connect</button><button type="submit2" id="connect2" class="btn btn-primary btn " style="width: 24%; display: none; margin-left: 6px; margin-top: -3px">Connect</button>');
            $("#connect2").tooltip({
                title: "Connect to server, or restablish communication",
                placement: "left"
            });
            $("#connect2").click(function() {
                if ($("#server").val().includes("#") == false) {
                    if ($("#server").val().includes(":80") == true) {
                        $("#server").val($("#server").val().replace(":80", ""));
                    } //fixing code for :80  
                    var texture2, texture3;
                    var texture2, texture3;
                    texture3 = $("#server").val();
                    texture2 = texture3.replace("live-arena-", "");
                    texture2 = texture2.replace(".agar.io:80", "");
                    texture2 = texture2.replace(".agar.io", "");
                    $("#server-token").val(texture2);
                    $("#server-join").click();
                    /*                     setTimeout(function() {

                    							if (fromstart==true){
                    								realmode = getParameterByName("m", url);
                    								returnfromstartfalse();
                    							}
                    							else{
                                                realmode = $("#gamemode").val();
                    							}
                                                var tmz = $("#server").val();
                                                currentIP = tmz;
                                                if (realmode != ":party") {
                                                    setTimeout(function() {
                                                        history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                                    }, 1000);
                                                    setTimeout(function() {
                                                        history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                                    }, 2000);
                                                    setTimeout(function() {
                                                        history.pushState(stateObj, "page 2", "?sip=" + tmz);
                                                    }, 3000);
                                                }
                                            }, 1000); */
                } else {
                    joinpartyfromconnect();
                }

            });
        });
        joinSIPonstart();
        joinPLAYERonstart();

    })(window, window.jQuery);


}

function urlIpWhenOpened() {

    setTimeout(function() {
            currentIP = "live-arena-" + $("#server-token").val() + ".agar.io";
            if (searchSip != null && privateSrv == null) {
                if (region == null) {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip);
                } else {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&?r=" + region + "&?m=" + realmode);
                }
            } else if (searchSip == null) {
                history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + $('#gamemode').val());
                region = $('#region').val();
                realmode = $('#gamemode').val();
                return region, realmode;
            } else if (privateSrv == null) {
                if (realmode != ":party") {
                    history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                }
            }

        }, //5000
        6000); //8000
}

function onhashchange() {
    return false
}

function LMminimapTextAct() {
    LMminimapText();
    setTimeout(function() {
        LMminimapText();
    }, 2000);
    setTimeout(function() {
        LMminimapText();
    }, 2500);
    setTimeout(function() {
        LMminimapText();
    }, 3000);
    setTimeout(function() {
        LMminimapText();
    }, 3500);
    setTimeout(function() {
        LMminimapText();
    }, 4000);
    setTimeout(function() {
        LMminimapText();
    }, 4500);
    setTimeout(function() {
        LMminimapText();
    }, 5500);
    setTimeout(function() {
        LMminimapText();
    }, 6000);
    setTimeout(function() {
        LMminimapText();
    }, 6500);
    setTimeout(function() {
        LMminimapText();
    }, 7000);
    setTimeout(function() {
        LMminimapText();
    }, 7500);

    setTimeout(function() {
        LMminimapText();
    }, 11000);
    setTimeout(function() {
        LMminimapText();
    }, 12000);
    setTimeout(function() {
        LMminimapText();
    }, 18000);
    setTimeout(function() {
        LMminimapText();
    }, 22000);
}

function LMminimapText() {
    var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) {
        ctx.fillText(minbtext, c.width / 2, 22)
    } else if (privateSrv != null) {
        ctx.fillText(minbtext3, c.width / 2, 22);
    } else {
        ctx.fillText(minbtext2, c.width / 2, 22);
    }
}

function delay(time, func) {
    setTimeout(function() {
        func();
    }, time);
}

function spectate() {
    //    hideMenu();
    $(".btn-spectate").click();
}

function play() {
    $('*[data-itr="page_play"]').click();
}

function changeServer() {
    $("#server-reconnect").click();
    //    adres();
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
    //var lastMode = $("#gamemode").val();
    appendLog($("#leaderboard-positions").text());
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
    fromstart = true;
    return fromstart, region, realmode, fromstart;
}

function returnfromstartfalse() {
    return fromstart = false;
}

function searchIPHandler(searchStr) { //VERY WEIRD FUNCTION, MOD DOESNT LOAD IF CHANGED
    //	if (messageone==0){toastr["info"]("Initializing Communication, please wait...").css("width", "250px");}
    region = $("#regioncheck").val(); //...
    realmode = $("#gamemodecheck").val(); //...
    $("#Backtomenu").hide();
    hideMenu();
    showSearchHud();
    //setTimeout(function () {
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
            getInfo();
        }
        //      MC.setGameMode(mode);                  //important
        findIP(ip.replace("wss://", ""));
    } else {
        return false;
    }
    return true;
    //}, 1000);
}

function findIP(searchIP) {
    //   setTimeout(function() {
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
    //   }, 1500); //weird
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
                toastr["info"](Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //    testmessage();
                //MC.setQuality($('#quality').val());
                //showMenu();
            } else {
                changeServer();
                timerId = setInterval(function() {
                    //                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                    if (numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"](Premadeletter31).css("width", "210px");
                        }
                        if (currentIP == searchIP) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();							
                            toastr["info"](Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                            //       testmessage();
                            //		$("#gamemode").val("nothing");
                            //MC.setQuality($('#quality').val());
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
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        clearInterval(timerId);
        searching = false;
        //        hideCancelSearch();
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        toastr["error"](Premadeletter32 + "!").css("width", "210px");
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
                toastr["info"](Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //		testmessage();
                $("#gamemode").val("nothing");
                //MC.setQuality($('#quality').val());
                //showMenu();
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function() {

                    //    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                    if (numAttempts == maxAttempts) {

                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        leaderboard = $("#leaderboard-positions").text();

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
                            //                            hideCancelSearch();
                            toastr["error"](Premadeletter31).css("width", "210px");
                        }
                        if (found) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            //                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"](Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                            //			testmessage();
                            //MC.setQuality($('#quality').val());
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
        //        hideCancelSearch();
        toastr["error"](Premadeletter32).css("width", "210px");
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
        $("#connect2").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + CopyTkPwLb2 + '<br>Leaderboard: ' + $("#leaderboard-positions").text() + '<br>Teamboard:' + $("#top5-pos").text() + '<br>My Game Name: ' + $("#nick").val() + '</er>');
    } else {
        $("#connect2").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + CopyTkPwLb2 + '<br>Leaderboard: ' + $("#leaderboard-positions").text() + '<br>My Game Name: ' + $("#nick").val() + '</er>');
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
    //if (countFound >= minNamesFound) {alert(countFound);}
    //console.log("found: " + countFound);
    return (countFound >= minNamesFound) ? true : false;
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

function joinpartyfromconnect(thismode) {
    $("#party-token").val($("#server").val());
    $("#join-party-btn-2").click();
    return realmode = ":party";
}

function BeforeReportFakesSkin() {
    if ($("#skin").val() != "https://jimboy3100.github.io/banners/iconfake1.png") {
        toastr["info"](Premadeletter95 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter96).css("width", "350px"); // erase the 's		
        copy("https://jimboy3100.github.io/banners/iconfake1.png");
    } else {
        ReportFakesSkin();
    }
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
        '<br><font id= "Leadboardlet1" style="color:white; size:12px; margin-right: 70px;">' + Temporaryletter2 + '</font><font id= "Teamboardlet1" style="color:white; size:12px; margin-left: 70px;">' + Temporaryletter1 + '</font></p>' +
        '<input id="LeaderboardInput1" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline; " " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput1" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput2" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput2" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput3" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput3" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput4" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput4" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput5" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput5" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput6" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput6" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput7" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput7" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput8" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput8" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput9" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput9" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput10" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        ' <input id="TeamboardInput10" class="form-control" placeholder="Nickname" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '</div><p style="color:white; font-size:12px";" align="middle">' + Premadeletter121 + '<br>' + Premadeletter122 + '</u></p>' +
        '</div></div>');
    $('#LeaderboardInput1').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput2').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput3').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput4').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput5').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput6').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput7').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput8').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput9').copyCSS('#server-token').css('width', '40%');
    $('#LeaderboardInput10').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput1').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput2').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput3').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput4').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput5').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput6').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput7').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput8').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput9').copyCSS('#server-token').css('width', '40%');
    $('#TeamboardInput10').copyCSS('#server-token').css('width', '40%');

    $("#SkinChangerhud").after('<button id="SkinBacktomenu" onclick="exitSkinChanger(); return false" class="btn btn-danger"  style="margin-left: 10px;" data-original-title="" title="">' + Premadeletter113 + '</button>');
    OthersSkinChanger();
    SkinBtnsPut();
    OpenSkinChanger();
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
	if (legendmod3.teamPlayers[i]){
    $("#TeamboardInput"+x).val(legendmod3.teamPlayers[i].nick);
	}
	if (legendmod.leaderboard[i]){
    $("#LeaderboardInput"+x).val(legendmod.leaderboard[i].nick);
	}	
}
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
    $("#TeamboardInput8").before('<button id="TeamboardIconFake8" class="btn btn-info" style="background-color: transparent;" onclick="Teamber18();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput9").before('<button id="TeamboardIconFake9" class="btn btn-info" style="background-color: transparent;" onclick="Teamer19();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput10").before('<button id="TeamboardIconFake10" class="btn btn-info" style="background-color: transparent;" onclick="Teamer20();return false;"><i class="fa fa-wpexplorer"></i></button>');

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

//function LeaderboardController(){core.registerSkin(otherMsg, null, 'https://jimboy3100.github.io/banners/iconfake1.png', 1, null);}
function ProceedToChangeSkins() {
    console.log("ProceedToChangeSkins function loaded");
    $("#loaderIframeIcon1").show();
    loadericon();
    $("#SkinBacktomenu").click();
    //    setTimeout(function() {
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
    //    }, 4000);	
}

function BeforeChangingSkins() {
    $(".btn.btn-play.btn-primary").click();
    $("body").append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated2applyingskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="display: none; position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
    setTimeout(function() {
        if ($("#captchaWindow").is(":visible") == false) {
            console.log("No recapatcha");
            ProceedToChangeSkins();
        } else {
            toastr["warning"](Premadeletter97 + '!' + '<button class="btn btn-sm btn-warning btn-spectate btn-noplay-finishedRecapatcha" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter98 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-noplay-youtube" style="width: 100%;margin-top: 10px;">' + Premadeletter99 + '</button>', "", {
                timeOut: 40000,
                extendedTimeOut: 40000
            }).css("width", "300px");
            $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click(function() {
                ProceedToChangeSkins();
            });
            console.log("Recapatcha needed");
            ogarioplayfalse();
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 1000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 1500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 2000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 2500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 3000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 3500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 4000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 4500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 5000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 5500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 6000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 6500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 7000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 7500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 8000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 8500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 9000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 9500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 10000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 10500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 11000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 11500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 12000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 12500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 13000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 13500);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 14000);
            setTimeout(function() {
                if ($("#captchaWindow").is(":visible") == false) {
                    $(".btn.btn-sm.btn-warning.btn-spectate.btn-noplay-finishedRecapatcha").click();
                    return false;
                }
            }, 14500);

        }
    }, 2500);
}

function prevnamereturner() {
    return previousnickname = $("#nick").val();
}

function ogarioplayfalse() {
    return ogario.play = "false";
}

function Leader11() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput1').val());
    BeforeChangingSkins();
}

function Leader12() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput2').val());
    BeforeChangingSkins();
}

function Leader13() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput3').val());
    BeforeChangingSkins();
}

function Leader14() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput4').val());
    BeforeChangingSkins();
}

function Leader15() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput5').val());
    BeforeChangingSkins();
}

function Leader16() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput6').val());
    BeforeChangingSkins();
}

function Leader17() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput7').val());
    BeforeChangingSkins();
}

function Leader18() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput8').val());
    BeforeChangingSkins();
}

function Leader19() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput9').val());
    BeforeChangingSkins();
}

function Leader20() {
    prevnamereturner();
    $("#nick").val($('#LeaderboardInput10').val());
    BeforeChangingSkins();
}

function Teamer11() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput1").val());
    BeforeChangingSkins();
}

function Teamer12() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput2").val());
    BeforeChangingSkins();
}

function Teamer13() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput3").val());
    BeforeChangingSkins();
}

function Teamer14() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput4").val());
    BeforeChangingSkins();
}

function Teamer15() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput5").val());
    BeforeChangingSkins();
}

function Teamer16() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput6").val());
    BeforeChangingSkins();
}

function Teamer17() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput7").val());
    BeforeChangingSkins();
}

function Teamer18() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput8").val());
    BeforeChangingSkins();
}

function Teamer19() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput9").val());
    BeforeChangingSkins();
}

function Teamer20() {
    prevnamereturner();
    $("#nick").val($("#TeamboardInput10").val());
    BeforeChangingSkins();
}

function copy(text) {
    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}
/*
function fzogarOgarSettings(datasent2){
        setTimeout(function() {
            $("#import-settings-btn").attr('class', 'btn btn-success');
            document.getElementById("import-settings").value = datasent2;
            window.history.pushState(null, null, window.location.pathname);
            //$('#import-settings-btn').click();
			$('#import-settings-btn2').click();
        }, 100);
}		

function fzogarOgarIframe() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/AjaxData/fzogarOgarIframe.js";
    $("body").append(s);
}


function fzogarOgarIframeListener(){
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
	   if (~e.data.indexOf("PostedOgarSettings1")){ 

//		try{window.parent.postMessage("PostedOgarSettings2?datasent="+$('#export-settings').val(), "*"); 
//        } catch (e) {}
		//alert(e.data);
		datasent2=e.data;
		datasent2=datasent2.replace("PostedOgarSettings1?datasent=", "");
		fzogarOgarSettings(datasent2);
	//	var datasent = getParameterByName("datasent", datasent2);
	//   alert(datasent);
	   
	   }
		return datasent2;
}, false);
///////////////////////////////////////////////////////////////////////////
}
*/
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
    $("#import-settings-btn2").css({
        width: "676px",
        margin: "12px"
    });
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

    if (LegendJSON.ogarioCommands.comm15 == undefined) {
        LegendJSON.ogarioCommands.comm15 = "Fake Tricksplit";
        LegendJSON.ogarioCommands.comm16 = "Popsplit";
        LegendJSON.ogarioCommands.comm17 = "Double Popsplit";
        LegendJSON.ogarioCommands.comm18 = "Reversed Tricksplit";
        LegendJSON.ogarioCommands.comm19 = "Canonsplit";
        LegendJSON.ogarioCommands.comm20 = "Reversed Canonsplit";
        LegendJSON.ogarioCommands.comm21 = "Bowlingsplit";
        LegendJSON.ogarioCommands.comm22 = "Auto feed trick";
        LegendJSON.ogarioCommands.comm23 = "Pause";
        LegendJSON.ogarioCommands.comm24 = "ANTI alarm stage 1";
        LegendJSON.ogarioCommands.comm25 = "ANTI alarm stage 2";
        LegendJSON.ogarioCommands.comm26 = "ANTI alarm stage 3";
        LegendJSON.ogarioCommands.comm27 = "ANTI alarm stage 4";
        LegendJSON.ogarioCommands.comm28 = "ANTI alarm stage 5";
        LegendJSON.ogarioCommands.comm29 = "Presplit";
        LegendJSON.ogarioCommands.comm30 = "Party Run tricks";
    }

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
    //    LegendJSON.legendSettings.YoutubeAutoBtn = localStorage.getItem("YoutubeAutoBtn");
    LegendJSON.legendSettings.TIMEcalBtn = localStorage.getItem("TIMEcalBtn");
    LegendJSON.legendSettings.troll1Btn = localStorage.getItem("troll1Btn ");
    LegendJSON.legendSettings.ComPosition = localStorage.getItem("ComPosition");
    LegendJSON.legendSettings.autoCoinBtn = localStorage.getItem("autoCoinBtn");
    LegendJSON.legendSettings.timesopened = localStorage.getItem("timesopened");
    LegendJSON.legendSettings.saveclanpassword = localStorage.getItem("saveclanpassword");
    LegendJSON.legendSettings.dyinglight1load = localStorage.getItem("dyinglight1load");
    LegendJSON.legendSettings.languagemod = localStorage.getItem("languagemod");
    //    LegendJSON.legendSettings.userfirstname = localStorage.getItem("userfirstname");
    //   LegendJSON.legendSettings.userlastname = localStorage.getItem("userlastname");
    //    LegendJSON.legendSettings.usergender = localStorage.getItem("usergender");
    LegendJSON.legendSettings.prevPrivateServer = localStorage.getItem("prevPrivateServer");
    LegendJSON.legendSettings.initialMusicUrl = localStorage.getItem("musicUrl");

    LegendJSON.legendSettings.VanillaskinsSaved = localStorage.getItem("VanillaskinsSaved");
    LegendJSON.legendSettings.top5skinsSaved = localStorage.getItem("top5skinsSaved");
    LegendJSON.legendSettings.spawnspecialeffectsSaved = localStorage.getItem("spawnspecialeffectsSaved");
    if (localStorage.getItem("leaderboardlimit") != null) {
        LegendJSON.legendSettings.leaderboardlimit = localStorage.getItem("leaderboardlimit");
    }
    if (localStorage.getItem("teamboardlimit") != null) {
        LegendJSON.legendSettings.teamboardlimit = localStorage.getItem("teamboardlimit");
    }
    LegendJSON.legendSettings.AnimatedRainbowColorSaved = localStorage.getItem("AnimatedRainbowColorSaved");
    if (localStorage.getItem("AnimatedRainbowColorSaved") != null) {
        LegendJSON.legendSettings.AnimatedRainbowColorSaved = localStorage.getItem("AnimatedRainbowColorSaved");
    }
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
        //    localStorage.setItem("YoutubeAutoBtn", LegendJSON.legendSettings.YoutubeAutoBtn);
        localStorage.setItem("TIMEcalBtn", LegendJSON.legendSettings.TIMEcalBtn);
        localStorage.setItem("troll1Btn", LegendJSON.legendSettings.troll1Btn);
        localStorage.setItem("ComPosition", LegendJSON.legendSettings.ComPosition);
        localStorage.setItem("autoCoinBtn", LegendJSON.legendSettings.autoCoinBtn);
        localStorage.setItem("timesopened", LegendJSON.legendSettings.timesopened);
        localStorage.setItem("saveclanpassword", LegendJSON.legendSettings.saveclanpassword);
        localStorage.setItem("dyinglight1load", LegendJSON.legendSettings.dyinglight1load);
        localStorage.setItem("languagemod", LegendJSON.legendSettings.languagemod);

        localStorage.setItem("VanillaskinsSaved", LegendJSON.legendSettings.VanillaskinsSaved);
        localStorage.setItem("top5skinsSaved", LegendJSON.legendSettings.top5skinsSaved);
        localStorage.setItem("spawnspecialeffectsSaved", LegendJSON.legendSettings.spawnspecialeffectsSaved);
        if (LegendJSON.legendSettings.leaderboardlimit != null) {
            localStorage.setItem("leaderboardlimit", LegendJSON.legendSettings.leaderboardlimit);
        }
        if (LegendJSON.legendSettings.teamboardlimit != null) {
            localStorage.setItem("teamboardlimit", LegendJSON.legendSettings.teamboardlimit);
        }
        localStorage.setItem("AnimatedRainbowColorSaved", LegendJSON.legendSettings.AnimatedRainbowColorSaved);
        if (LegendJSON.legendSettings.AnimatedRainbowColorSaved != null) {
            localStorage.setItem("AnimatedRainbowColorSaved", LegendJSON.legendSettings.AnimatedRainbowColorSaved);
        }
        //    localStorage.setItem("userfirstname", LegendJSON.legendSettings.userfirstname);
        //    localStorage.setItem("userlastname", LegendJSON.legendSettings.userlastname);
        //    localStorage.setItem("usergender", LegendJSON.legendSettings.usergender);
        localStorage.setItem("prevPrivateServer", LegendJSON.legendSettings.prevPrivateServer);
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
        toastr["error"](Premadeletter1).css("width", "210px");
        //               setTimeout(function() {
        if (localStorage.getItem("musicUrl") == null) {
            $("#musicUrl").val(defaultMusicUrl);
        } else {
            $("#musicUrl").val(localStorage.getItem("musicUrl"));
        }
        //               }, 500);
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
        toastr["warning"](Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
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
            toastr["warning"](Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63a + ': <i id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            $("#acceptURL").click(function() {
                $("#clantag").val(MSGCOMMANDS);
                $('#clantag').css('background-color', '#ff6347');
                newsubmit();
            });
        } else {
            toastr["warning"](Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63b + ': <i id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
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
        toastr["warning"](Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter64 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/' + getParameterByName("v", MSGCOMMANDS) + '?autoplay=1&amp;vq=tiny" frameborder="0"></iframe></br> <button id="acceptYoutubeEmb" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="margin-top: -10px; width: 100%">' + Premadeletter25 + '</button>', "", {
            timeOut: 20000,
            extendedTimeOut: 20000
        }).css("width", "300px");
        $("#acceptYoutubeEmb").click(function() {
            YoutubeEmbPlayer(MSGCOMMANDS);
            $("#musicUrl").val(MSGCOMMANDS);
            //setTimeout(function() {
            //$("#playerI").click();
            playYoutube(); //it's different on LME
            //}, 1000);
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
            toastr["warning"]('<img src="https://jimboy3100.github.io/banners/iconskype.png" style="float:left;width:100px;height:100px;">' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter65 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
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
        if (MSGCOMMANDS.includes("discordapp.com/invite") || MSGCOMMANDS.includes("discord.gg")) {
            toastr["warning"]('<img src="https://jimboy3100.github.io/banners/icondiscord.png" style="float:left;width:100px;height:100px;">' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter66 + ': <a id="visiturl" href=' + MSGCOMMANDS + ' target="_blank"><font color="blue">' + MSGCOMMANDS + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            $("#acceptURL").click(function() {
                window.open(MSGCOMMANDS, '_blank');
            });
        }
    } else if (MSGCOMMANDS.includes("[srv]")) {
        if (MSGCOMMANDS.includes("sip=") || MSGCOMMANDS.includes("agar.io/#")) {
            if ($("#nick").val().includes("srv") == false) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            } //split pop is included on functions above
            MsgServCommandsreturner();
            acceptServerBtn();
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
            $("#top5-hud").css('background-image', 'url(" https://jimboy3100.github.io/banners/icogeneral.gif ")').css({
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
            toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter23 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-hideall" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-hideall").click(function() {
                $("#HideAllBthn").click();
            });
        } else if (commandMsg == "NamePerm") {
            toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter26 + ': ' + playerMsg + ' </br> <button class="btn btn-sm btn-primary btn-play btn-do-NamePerm" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-NamePerm" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-NamePerm").click(function() {
                $("#nick").val(playerMsg);
                $("#helloContainer").show();
                newsubmit();
            });
        } else if (commandMsg == "dTroll2") {
            toastr["warning"](Premadeletter22 + ' ' + playerMsg + ' ' + Premadeletter27 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-troll" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-troll" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            $(".btn.btn-sm.btn-primary.btn-play.btn-do-troll").click(function() {
                settrolling();
            });
        } else if (commandMsg == "Youtube") {
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

    } else if (MSGCOMMANDS.includes("https://agar.io/sip=151.80.91.73:1511")) {
        commandMsg = getParameterByName("com", MSGCOMMANDS);
        otherMsg = getParameterByName("do", MSGCOMMANDS);
        $(".message-text").remove();
        $(".toast.toast-success").remove();
        LegendClanSymbol = $("#nick").val();
        console.log("Step1");
        if (~LegendClanSymbol.indexOf("?") != -1) {
            console.log("Step2");
            if (commandMsg == "EU-London") {
                setTimeout(function() {
                    $("#server-join").click();
                }, 60000);
            } else if (commandMsg == "RU-Russia") {
                setTimeout(function() {
                    $("#server-join").click();
                }, 1000);
            } else {
                //bug fix
                setTimeout(function() {
                    $("#server-join").click();
                }, 1000);
            }
        }
    }
}

function isLegendExpress(Express) {
    if (messageone != "0" && messageone != "1") {
        return Express = "False";
    } else {
        return Express = "True";
    }
    //var Express;isLegendExpress(Express);
}

function MsgServCommandsreturner2(MSGCOMMANDS2a) {
    return MSGCOMMANDS2a;
}

function acceptServerBtn() {
    if (acceptServerBtnFlag == null) {
        $("#acceptServer").click(function() {


            if (isLegendExpress(Express) == "True") { //if is Legend express
                if (MSGCOMMANDS.includes("agar.io/#")) { //if sent server is Party mode
                    console.log("1a - Legend express, Party mode");
                    if (getParameterByName("pass", MSGCOMMANDS) != null) {
                        $("#clantag").val(getParameterByName("pass", MSGCOMMANDS));
                    };
                    $('#server').val(MSGCOMMANDSA);
                    $("#connect2").click();
                } else if (MSGCOMMANDS3.includes("sip=")) { //if not Party mode
                    console.log("1b - Legend express, Not Party mode");
                    if (getParameterByName("pass", MSGCOMMANDS) != null) {
                        $("#clantag").val(getParameterByName("pass", MSGCOMMANDS));
                    };
                    $("#server-token").val(getParameterByName("sip", MSGCOMMANDS3).replace("live-arena-", "").replace(".agar.io", ""));
                    $("#server-join").click();
                }
            } else { //if is Legend mod
                if (searchSip == null) { //if is not Locked
                    if (MSGCOMMANDS.includes("agar.io/#")) { //if sent server is Party mode
                        console.log("2a - Legend Mod, No Locked, Party Mode");
                        if (getParameterByName("pass", MSGCOMMANDS) != null) {
                            $("#clantag").val(getParameterByName("pass", MSGCOMMANDS));
                        };
                        $('#server').val(MSGCOMMANDSA);
                        $("#connect2").click();
                    } else if (MSGCOMMANDS3.includes("sip=")) { //if not Party	mode	
                        console.log("2b - Legend Mod, Locked, No Party mode");
                        if (getParameterByName("pass", MSGCOMMANDS) != null) {
                            $("#clantag").val(getParameterByName("pass", MSGCOMMANDS));
                        };
                        $("#server-token").val(getParameterByName("sip", MSGCOMMANDS3).replace("live-arena-", "").replace(".agar.io", ""));
                        $("#server-join").click();

                    }
                } else { //if Locked	
                    console.log("2b - Legend Mod, Locked");
                    MSGCOMMANDS = MSGCOMMANDS.split("[srv]").pop();
                    MSGCOMMANDS = MSGCOMMANDS.split('[/srv]')[0];
                    if (MSGCOMMANDS.length > 70) {
                        MSGCOMMANDS = MSGCOMMANDS.split('[')[0];
                    }
                    location.replace(MSGCOMMANDS);
                    //window.open(MSGCOMMANDS,'_blank');

                }
            }
            // window.open(MSGCOMMANDS2a,'_blank');
        });
    }
    //return acceptServerBtnFlag=1;
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
        toastr["warning"]('<div><img src="https://jimboy3100.github.io/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server (Party mode): ' + MSGCOMMANDSA + '<button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
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
        toastr["warning"]('<div><img src="https://jimboy3100.github.io/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server: ' + getParameterByName("sip", MSGCOMMANDS).replace("live-arena-", "").replace(".agar.io", "") + '</br>Mode: ' + modetosend + '</br> Region: ' + getParameterByName("r", MSGCOMMANDS) + '</br> Password: ' + passtosend + '</br> <button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
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
        toastr["warning"]('<div><img src="https://jimboy3100.github.io/banners/iconagario.png" style="float:left;width:100px;height:100px;"></img>' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter67 + '</font></a></br>Server: ' + getParameterByName("sip", MSGCOMMANDS).replace("live-arena-", "").replace(".agar.io", "") + '</br> Password: ' + passtosend + '<button id="acceptServer" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button></div>', "", {
            timeOut: 10000,
            extendedTimeOut: 10000
        }).css("width", "300px");
    }
    return MSGCOMMANDS, MSGCOMMANDS2, MSGCOMMANDS2a, MSGCOMMANDSA, MSGCOMMANDS3;
}


function universalchat() {
    $("#overlays").css("z-index", 100);
    fixservbtn();
    setTimeout(function() {
        fixservbtn2();
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
                    toastr["warning"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                    //playSound($('#commandSound').val());
                } else if (~msg.indexOf("minimap server")) {
                    toastr["warning"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                } else if (~msg.indexOf($('#nick').val() + ':')) {
                    if (window.noOgarioSocket) {
                        toastr["success"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
                        playSound($('#messageSound').val());
                    } else {}
                } else if (~msg.indexOf('[Universal chat]:')) {} else if (~msg.indexOf('@')) {
                    msg.slice(1);
                    toastr["warning"]('<div class="toast-message"><span class="message-nick">' + this.name + ': </span><span class="message-text">' + msg + '</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>');
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
    var stat = {
        "AgarToolVersion": 5,
        "AgarToolServer": "wss://minimap.agartool.io:9000",
        minimapBalls: {},
        "socketIoURL": "https://jimboy3100.github.io/ExampleScripts/socket-io.min.js",
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
            my.log("wait for Legend Mod load");
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
                //			      setTimeout(function() {
                showMenu2();
                //				   }, 100);
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
                //			      setTimeout(function() {
                showMenu2();
                //				   }, 100);
            }
            my.config_cancel();
        });
        my.config_cancel = function() {
            $("#overlays").hide();
            $("#ao2t-cfg-dlg").hide();
        };
        //$("#tgar_color").colorpicker({'format': 'hex'}).on('changeColor.colorpicker', function(event){
        //    var id = event.target.id;
        //    $('[data-ao2t-config="'+ id +'"]').val(event.color.toHex());
        //    event.target.style.backgroundColor = event.color.toRGB();
        //});
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
            //		toastr["warning"]('<b>[SERVER]: </b>Legend Mod and Agar Tool successfully connected. <br>Use {Send Text Universaly} button on chat box to send to Agar.io Tool');
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
                if (!cmd.playerName) {
                    cmd.playerName = "An unnamed cell";
                }
                my.addBallToMinimap(!1, cmd.socketID, cmd.playerName, cmd.x, cmd.y, cfg.tgar_color, !0);
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
                            console.log("Custom skin from agar tool added: " + key.split("%")[0] + "  " + window.agtoolball[key]);
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
                //console.log(cmd);
                if (!cmd.playerName) {
                    cmd.playerName = "An unnamed cell";
                }
                //                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
                my.log("" + cmd.playerName + ": " + cmd.message);
                my.ogarChatAdd(cmd.playerName, cmd.message);
                break;
            case "command":
                //console.log(cmd);
                if (!cmd.playerName) {
                    cmd.playerName = "An unnamed cell";
                }
                //                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
                my.log("@" + cmd.playerName + ": " + cmd.message);
                my.ogarChatAdd(cmd.playerName, cmd.message);
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
		if (!window.top5skins){
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
				if (window.top5skins){
				sep = sep + ('<a href="#" id="pos-skin" class= "set-target" data-user-id="' + key + '"style="background-color: ' + ball.color + '; width: 30px; height:40px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;" src = ' + (legendmod3.customSkinsMap[ball.name] ? legendmod3.customSkinsMap[ball.name] : "https://jimboy3100.github.io/banners/iconagariotool.png") + ' alt=""> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');
				}			
			for (var e = 0; e < legendmod.ghostCells.length; e++){ 				
			if (legendmod.leaderboard[e] && escapeHtml(ball.name)==legendmod.leaderboard[e].nick){
				if ( flag==false ){
				sep = sep + ('<span class="hud-main-color">[' + window.legendmod3.calculateMapSector(window.predictedGhostCells[e].x, window.predictedGhostCells[e].y) + "]</span>");
				sep = sep + ('<span class="top5-mass-color">[' + window.legendmod3.shortMassFormat(window.predictedGhostCells[e].mass) + "]</span> ");	
				flag=true;
				}
				}
			}
			if ( flag==false ){
				if (window.legendmod3.calculateMapSector(ball.x, ball.y) == "C3" || legendmod.gameMode == ":party"){
				sep = sep + ('<span class="hud-main-color">[' + window.legendmod3.calculateMapSector(ball.x, ball.y) + ']</span> ');
				}
			}
			count2++;
			
			user_txt += sep + escapeHtml(ball.name);
			sep = '</div>';
			//
           	//		user_txt += count + ": ";
			if (!window.top5skins){
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
			if (!window.top5skins){
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




    setTimeout(function() {
        //if (window.noOgarioSocket) {
            //toastr["error"]("Master Socket is down, Connecting to Socket 3");
            //$('#ao2t-capture').click();
			setTimeout(function() {
				Socket3enabler(window.legendmod.ws);
			}, 1000);				
        //}
    }, 1000);

    $('#message').keydown(function(e) {
        if (e.keyCode === 13) { // If Enter key pressed

            $('#ao2t-message').click();
            //		$('#message').val("");		
        }
    });
    //}, 500);	



}

function fixservbtn() {
    $("#clantag").blur(function() {
        Universalchatfix();
    });
    $("#server-connect").click(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    /*$("#server-reconnect").click(function() {
            setTimeout(function() {
    		Universalchatfix();
    			}, 200);
        });*/
    $("#server-join").click(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    $('#tag').blur(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    $("#gamemode").change(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    $("#region").change(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    $("#join-party-btn-2").click(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
    $("#create-party-btn-2").click(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
    });
}

function fixservbtn2() {
    $("#server-reconnect").click(function() {
        setTimeout(function() {
            Universalchatfix();
        }, 1000);
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
    //$("#overlays").css("right", "0em");

    $('a[href="#main-panel"]').click();
}

function showMenu2() {
    $("#overlays").show();
    //$("#overlays").css("right", "-999em");
    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").hide();
    //$("#overlays").css("left", "-999em");
}

function hideMenu2() {
    $("#overlays").hide();
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

/*
function appendLog2(message, message2) {
	$("#logTitle").text("Legend mod users (click and join)");
    var region = $("#region").val();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a onclick="connectto(\`'+message2+'\`);return false;" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}*/
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

function appendLogGraphql() {
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">Graphql</span> &nbsp;' +
        '<a href="https://github.com/vbalien/agarlist/tree/master/server" target="_blank" class="logEntry" style="color: lightgrey; font-size: 14px;">by 엘련</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function appendLogGraphMain() {
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">Main Graph</span> &nbsp;' +
        '<a href="javascript:void(0);" target="_blank" class="logEntry" style="color: lightgrey; font-size: 14px;">by Snez</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function connectto(message2) {
    $('#server-token').val(message2);
    $('#server-join').click();
    setTimeout(function() {
        if ($('#server-token').val() != $('#searchInput').val()) {
            toastr["error"]("Server not available!");
        }
    }, 1500);
}

function connectto1a(message2) {
    $('#server-ws').val("wss://" + message2);
    $('#server-connect').click();
    setTimeout(function() {
        if ($('#server-token').val() != $('#searchInput').val()) {
            toastr["error"]("Server not available!");
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

function PreLcCelebration() {
    var checkonetimeLc = localStorage.getItem("checkonetimeLc");
    if (checkonetimeLc == null) {
        //   if ($("#nick").val().includes("?")) {
        var checkdate;
        Date.prototype.yyyymmdd = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = this.getDate().toString();
            return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0]); // padding
        };

        var date = new Date();
        checkdate = date.yyyymmdd();
        if (checkdate == "2018/11/12") {
            LcCelebration();
        }
        //    }
    }
}

function getInfo() {
    $.ajax({
        type: "GET",
        url: "https://webbouncer-live-v7-0.agario.miniclippt.com/info",
        datatype: "json",
        success: function(info) {
            //$("#currentRegion").html($('#region').val());
            var regions = info.regions;
            var currentRegion;
            for (var key in regions) {
                if (key == $('#region').val()) {
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

function LcCelebration() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/extras/LcHistory/LcHistoryBanner.js";
    $("body").append(s);
    checkonetimeLc = 1;
    localStorage.setItem("checkonetimeLc", checkonetimeLc);
    return checkonetimeLc;
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
    if ($("#MAINBTBtn").attr('aria-pressed') == "false") {
        $("#MAINBTBtn").click();
    }
    //			if($("#AnimatedSkinBtn").attr('aria-pressed') == "false"){
    //				$("#AnimatedSkinBtn").click(); }
    if ($("#XPBtn").attr('aria-pressed') == "false") {
        $("#XPBtn").click();
    }
    //	if($("#MANUIBtn").attr('aria-pressed') == "false"){
    //	$("#MANUIBtn").click(); }
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

function Bino() {
    //    if (MC.isInGame()) {
    //        if (ogario.spectate) {
    KeyEvent.simulate(81, 81)
    //        } else {
    //            toastr["info"](Premadeletter38);
    //        }
    //    }
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
    if (legendmod3.lastSentClanTag == "" || $("#clantag").val() == "") {
        toastr["warning"]("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter39);
    } else {
        //    if ((MC.isInGame() && $("#clantag").val() != "") || document.getElementById("nick").value.includes("?")) {
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
        //   } else {
        //       toastr["info"](Premadeletter39);
        //   }

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

function Ultimouse() {
    if (Ultimouseenabled == 0) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/auc/auc.user.js";
        $("body").append(s);
        return Ultimouseenabled = 1;
    }
}

function chatfunction() {
    //    if (MC.isInGame()) {
    if ($("#helloContainer").is(":visible") == false) {
        //        if (!ogario.spectate) {
        //	if (messageone==1){
        if (hiddenfromclan == 0) {
            saveclanpassword = $("#clantag").val();
            toastr["info"](Premadeletter33);
            $("#ChatBtn1").attr('class', 'fa fa-comments-o');
            $("#ChatBtn").attr("data-original-title", Premadeletter58);
            $("#clantag").val("HIDDEN");
            //	MC.onPlayerDeath=function(){ $("#clantag").val(saveclanpassword); }
            $(".btn.btn-warning.btn-spectate.btn-needs-server").click();
            hiddenfromclan = 1;
            return saveclanpassword, hiddenfromclan;
        } else if (hiddenfromclan == 1) {
            toastr["info"](Premadeletter34);
            $("#ChatBtn1").attr('class', 'fa fa-eye-slash');
            $("#ChatBtn").attr("data-original-title", Premadeletter59);
            $("#clantag").val(saveclanpassword);
            $(".btn.btn-warning.btn-spectate.btn-needs-server").click();
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
	
	
    }   */
    else {
        toastr["info"](Premadeletter35 + "!").css("width", "210px");
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
        minutes = Math.floor(T.difference / 60000);
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
        //       setTimeout(function() {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/DiscordSIP.user.js";
        $("body").append(s);
        //      }, 1000);
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

function languagemodfun() {
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
        }, 800);
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
        }, 800);
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
        }, 800);
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
        }, 800);
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
        }, 800);
    }
    if (languagemod == 7) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackTraditionalChinese.js";
        $("body").append(s);
        setTimeout(function() {
            $('#legendlanguages').val("7");
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);
        }, 800);
    }
    if (languagemod == 8) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackRussian.js";
        $("body").append(s);
        setTimeout(function() {
            $('#legendlanguages').val("8");
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);
        }, 800);
    }
    if (languagemod == 9) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackGerman.js";
        $("body").append(s);
        setTimeout(function() {
            $('#legendlanguages').val("9");
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);
        }, 800);
    }
    if (languagemod == 10) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackTurkish.js";
        $("body").append(s);
        setTimeout(function() {
            $('#legendlanguages').val("10");
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);
        }, 800);
    }
    if (languagemod == 11) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackPolish.js";
        $("body").append(s);
        setTimeout(function() {
            $('#legendlanguages').val("11");
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);
        }, 800);
    }
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
    if ($("#legendlanguages").val() == 7) {
        localStorage.setItem("languagemod", 7);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackTraditionalChinese.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 8) {
        localStorage.setItem("languagemod", 8);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackRussian.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 9) {
        localStorage.setItem("languagemod", 9);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackGerman.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 10) {
        localStorage.setItem("languagemod", 10);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackTurkish.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
    if ($("#legendlanguages").val() == 11) {
        localStorage.setItem("languagemod", 11);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackPolish.js";
        $("body").append(s);
        setTimeout(function() {
            var s1 = document.createElement("script");
            s1.type = "text/javascript";
            s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
            $("body").append(s1);

        }, 800);
    }
}

function newsubmit() {
    if (legendmod.play == true) {
        $('*[data-itr="page_play"]').click();
    }
}

function triggerLMbtns() {
    $('#leaderboardlimit').val(window.leaderboardlimit);
    $('#teamboardlimit').val(window.teamboardlimit);
    $('.btn').css("text-transform", "capitalize");
    PanelImageSrc = $("#menuBg").val();
    if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
        $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
    }
    $("#copyLBBtn").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#dropDown>#copyLBBtn").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPandPass").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPPassLB").blur(function() {
        if (PanelImageSrc != "" || PanelImageSrc != "https://cdn.ogario.ovh/static/img/pattern.png" || PanelImageSrc != "https://jimboy3100.github.io/pattern.png") {
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
    if (MAINBTBtn == "true") {
        $("#MAINBTBtn").click();
    }
    if (AnimatedSkinBtn == "true") {
        $("#AnimatedSkinBtn").click();
    }
    toastrSkinNotice = 1;
    //	if (RotationBtn  == "true") { $("#RotationBtn").click(); }
    //            if (YoutubeAutoBtn == "true") {
    //                $("#YoutubeAutoBtn").click();
    //            }
    if (XPBtn == "true") {
        $("#XPBtn").click();
    }
    if (TIMEcalBtn == "true") {
        $("#TIMEcalBtn").click();
    }
    /*            if (troll1Btn == "true") {
                    $("#troll1Btn").click();
                }*/
    if (ComPosition == 0) {
        $("#topright").click();
    }
    if (ComPosition == 1) {
        $("#topleft").click();
    }
    if (ComPosition == 2) {
        $("#bottomright").click();
    }
    //           if (DoubleSplitRangeSaved == "true") { //For Setting DoubleSplitRange
    //               $("#DoubleSplitRange").click();
    //           }	
    if (UniversalChatSaved == "false") {
        $("#UniversalChat").click();
    }
    if (VanillaskinsSaved == "false") {
        $("#Vanillaskins").click();
    }
    if (top5skinsSaved == "false") {
        $("#top5skins").click();
    }
    if (spawnspecialeffectsSaved == "true") {
        $("#spawnspecialeffects").click();
    }
    if (AnimatedRainbowColorSaved == "true") {
        $("#AnimatedRainbowColor").click();
    }
    //	if (ComPosition  == 3) { $("#bottomleft").click(); }
    /*            if (autoCoinBtn == "true") {
                    setTimeout(function() {
                        $("#autoCoinBtn").click();
                    }, 5000); 
                }*/
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
        $("#LEGENDAds2").load("https://jimboy3100.github.io/banners/bannerDyingLight");
    } else if (dyinglight1load == "yes") {
        opendyinglight();
        $("#LEGENDAds2").load("https://jimboy3100.github.io/banners/bannerStopDyingLight");
    }
}

function opendyinglight() {
    //toastr["info"]("Function is not ready yet");	
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/dyinglight.js";
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
    $('#ChatBtn').mouseenter(function() {
            $('#ChatBtn').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#ChatBtn').css('background-color', "transparent");
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
    $('#Bino').mouseenter(function() {
            $('#Bino').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#Bino').css('background-color', "transparent");
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
    $('#Ultimouse').mouseenter(function() {
            $('#Ultimouse').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#Ultimouse').css('background-color', "transparent");
        });

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
    inject('stylesheet', '*{-webkit-box-sizing: border-box;box-sizing: border-box}.video-background{background: #000;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: -99}.video-foreground,.video-background iframe{position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none}#vidtop-content{top: 0;color: #fff}.vid-info{position: absolute;top: 0;right: 0;width: 33%;background: rgba(0,0,0,0.3);color: #fff;padding: 1rem;font-family: Avenir, Helvetica, sans-serif}.vid-info h1{font-size: 2rem;font-weight: 700;margin-top: 0;line-height: 1.2}.vid-info a{display: block;color: #fff;text-decoration: none;background: rgba(0,0,0,0.5);-webkit-transition: .6s background;transition: .6s background;border-bottom: none;margin: 1rem auto;text-align: center}@media (min-aspect-ratio: 16/9){.video-foreground{height: 300%;top: -100%}}@media (max-aspect-ratio: 16/9){.video-foreground{width: 300%;left: -100%}}@media all and (max-width: 600px){.vid-info{width: 50%;padding: .5rem}.vid-info h1{margin-bottom: .2rem}}@media all and (max-width: 500px){.vid-info .acronym{display: none}}');
    $("body").append('<div class="video-background"><div class="video-foreground"><iframe frameborder="0" height="100%" width="100%" src="https://www.youtube.com/embed/' + getParameterByName("v", $("#musicUrl").val()) + '?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&start_radio=1&playlist=' + getParameterByName("list", $("#musicUrl").val()) + '"></iframe></div></div></div>');
}

function YoutubebackgroundDisable() {
    $('.video-background').remove();
}

function kFormatter(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
}

function settrolling() {

    //afterdeathtonormalmode();
    playSound("https://jimboy3100.github.io/banners/troll1.mp3");
    $("#canvas").css('background-image', 'url(" https://media.giphy.com/media/eVy46EWyclTIA/giphy.gif ")').css({
        opacity: 0.8
    });
    $("#minimap-hud").css('background-image', 'url(" https://jimboy3100.github.io/banners/icoeucid.gif ")').css({
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

function doGl() {
    $("#UserProfilePic>img").attr('src', gapi.auth2.getAuthInstance().currentUser.Ab.w3.Paa);
    $("#UserProfileName1").text(gapi.auth2.getAuthInstance().currentUser.Ab.w3.ofa);
    $("#UserProfileUID1").text(gapi.auth2.getAuthInstance().currentUser.Ab.w3.Eea);

    userfirstname = gapi.auth2.getAuthInstance().currentUser.Ab.w3.ofa;
    userid = gapi.auth2.getAuthInstance().currentUser.Ab.w3.Eea;
    userlastname = gapi.auth2.getAuthInstance().currentUser.Ab.w3.wea;
    if (userfirstname != null) {
        localStorage.setItem("userfirstname", userfirstname);
    }
    if (userlastname != null) {
        localStorage.setItem("userlastname", userlastname);
    }
    if (userid != null) {
        localStorage.setItem("userid", userid);
    }
    return userfirstname, userlastname, usergender, userid;

}

function doFB() {

    FB.api('/me', {
        fields: 'first_name, last_name, gender, id'
    }, function(fbresponse) {
        $("#UserProfilePic>img").attr('src', 'https://graph.facebook.com/' + fbresponse.id + '/picture?type=large');
        //	setTimeout(function (){ 
        $("#UserProfileName1").text(fbresponse[Object.keys(fbresponse)[0]]);
        $("#UserProfileUID1").text(fbresponse[Object.keys(fbresponse)[2]]);
        userfirstname = fbresponse[Object.keys(fbresponse)[0]];
        if (userfirstname != null) {
            localStorage.setItem("userfirstname", userfirstname);
        }
        userlastname = fbresponse[Object.keys(fbresponse)[1]];
        if (userlastname != null) {
            localStorage.setItem("userlastname", userlastname);
        }
        userid = fbresponse[Object.keys(fbresponse)[2]];
        if (userid != null) {
            localStorage.setItem("userid", userid);
        }
        usergender = fbresponse[Object.keys(fbresponse)[3]];
        if (usergender != null) {
            localStorage.setItem("usergender", usergender);
        }
        return userfirstname, userlastname, usergender, userid;
        //	},250);
    });
}

function doGl2() {
    //				setTimeout(function() {	
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        doGl();
    }
    //            }, 1000); 	
}

function doFB2() {
    //				setTimeout(function() {	
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            doFB();
        }
    });
    //            }, 1000); 	
}

function loginsfbGplstart() {
    //				setTimeout(function() {	
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        doGl();
    } else {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                doFB();
            }
        });
    }
    //            }, 1000);					
}

function loginsfbGpl() {
    master._doLoginWithGPlus = master.doLoginWithGPlus;
    //master.doLoginWithGPlus = joint([ master._doLoginWithGPlus, doGl2]);
    master.doLoginWithGPlus = joint([doGl2, master._doLoginWithGPlus]);
    master._doLoginWithFB = master.doLoginWithFB;
    //master._doLoginWithFB = joint([ master._doLoginWithFB, doFB2]);
    master._doLoginWithFB = joint([doFB2, master._doLoginWithFB]);
    $("#logoutbtn").click(function() {
        $("#UserProfileName1").text("Guest");
        $("#UserProfileUID1").text("");
        $("#UserProfilePic>img").attr('src', 'https://jimboy3100.github.io/banners/profilepic_guest.png');
    });
}

function loginsfbGpl2() {
    $("#logoutbtn").click(function() {
        $("#UserProfileName1").text("Guest");
        $("#UserProfileUID1").text("");
        $("#UserProfilePic>img").attr('src', 'https://jimboy3100.github.io/banners/profilepic_guest.png');
    });
    $(".btn.btn-primary.btn-login.btn-fb").click(function() {
        //toastr["warning"]("<b>[SERVER]:</b> Facebook login info will be reflected after restart");		
        setTimeout(function() {
            doFB2();
        }, 5000);
    });
    $(".btn.btn-primary.btn-login.btn-gplus").click(function() {
        setTimeout(function() {
            doGl2();
        }, 5000);
    });
}

function joint(a) {
    var b;
    return b = a[a.length - 1], a.pop(), a = a.length > 1 ? joint(a) : a[0],
        function() {
            b.apply(new a)
        }
}

function useProfilePhotoCustom() {
    if ($("#UserProfilePic>img").attr('src') != "https://jimboy3100.github.io/banners/profilepic_guest.png" && $("#UserProfilePic>img").attr('src') != "https://jimboy3100.github.io/banners/profilepic_guest.png") {
        copy($("#UserProfilePic>img").attr('src'));
        toastr["info"](Premadeletter85 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter86).css("width", "350px");
    } else {
        toastr["info"](Premadeletter87).css("width", "350px");
    }
}

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

function SNEZOgarUpload() {
    //$("#export-settings-btn").click();
    //postSNEZ("https://lmsettings.snez.org/", "test", "test1234", "{ a: 1, b: 2, d: 4}");

    if (userid == "" || userid == null) {
        toastr["warning"]("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter128);
    } else {
        //postSNEZ("https://lmsettings.snez.org/", userid, "LMSettings", $('#export-settings').val());
        postSNEZ("https://lmsettings.snez.org/", userid, "LMSettings", escape($('#export-settings').val()));
        toastr["warning"]("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter129 + ". " + Languageletter363 + ": <font color='yellow'><b>" + userid + "</b></font>");
    }
}

function SNEZOgarDownload() {
    if (userid == "" || userid == null) {
        toastr["warning"]("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter128);
    } else {
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

    var state = {
        nickname: null,
        server: null,
        tag: null,
        AID: null
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
                state.nickname = nick.value;
                state.server = servertemp;
                state.tag = tag.value;
                state.AID = window.agarioID;
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
            console.log("[Legend mod Express] Snez socket open");
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
                    if (data[player].nickname) {
                        if (data[player].nickname.indexOf($("#searchInput").val()) >= 0) {
                            if (showonceusers == 0) {
                                showonceusers++;
                                if (ifcalled == null) {
                                    toastr["info"]("User Found. Revealing server...");
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
                            if (temporaryserver1a) {
                                temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0];
                                appendLog3("Region:<span id='regioninfo'>" + temporaryserver1 + "</span>, Mode<span id='modeinfo'>" + temporaryserver1a + "</span>. <span class='main-color'><span id='playerinfo'>" + temporaryserver3.trim() + "</span> <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span>" + " (<span id='tokeninfo'>" + temporaryserver2 + "</span>)", temporaryserver2, temporaryserver1, temporaryserver1a);
                            } else {
                                appendLog2("<span class='main-color'><span id='playerinfo'>" + temporaryserver3.trim() + "</span> <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span>" + " (<span id='tokeninfo'>" + temporaryserver2 + "</span>)", temporaryserver2);
                            }
                            showonceusers3++;
                            showonceusers3returner(showonceusers3);
                        } else if (data[player].server.indexOf($("#searchInput").val()) >= 0) {
                            if ($("#searchInput").val().length >= 4) {
                                if (showonceusers2 == 0) {
                                    showonceusers2++;
                                    if (ifcalled == null) {
                                        toastr["info"]("Server Found. Revealing users...");
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
                                if (temporaryserver1a) {
                                    temporaryserver1a = temporaryserver1a.split('\"\,\"tag')[0];
                                    appendLog3("Region:<span id='regioninfo'>" + temporaryserver1 + "</span>, Mode<span id='modeinfo'>" + temporaryserver1a + "</span>. <span id='playerinfo'>" + temporaryserver3.trim() + " <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span> (<span class='main-color'><span id='tokeninfo'>" + temporaryserver2 + "</span></span>)", temporaryserver2, temporaryserver1, temporaryserver1a);
                                } else {
                                    appendLog2("<span id='playerinfo'>" + temporaryserver3.trim() + " <span data-toggle='popover' data-placement='left' title='' data-content='data-html='true' class='country-icon flag-icon flag-icon-" + data[player].extra.ip_info.country.toLowerCase() + "' data-original-title='Player Details'></span></span> (<span class='main-color'><span id='tokeninfo'>" + temporaryserver2 + "</span></span>)", temporaryserver2);
                                }
                                showonceusers3++;
                                showonceusers3returner(showonceusers3);
                                //console.log(data[player]);	

                            }
                        }
                    }

                }

            }
            client2.ws.close();
            if (showonceusers3 == 0) {
                showonceusers4++;
                if (showonceusers4 == 1) {
                    if (ifcalled == null) {
                        toastr["warning"]('Server / Leaderboard, not found. Do you want the 1-by-1 manual search leaderboards of <font color="yellow">' + $("#region").val() + ' / ' + $("#gamemode").val() + '</font> ?' + '</br> <button id= "manualsearch" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-exit" style="width: 100%;margin-top: -20px;">' + Premadeletter25 + '</button>', "", {
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

function pre_loopLM(modVersion) {
    if (!document.getElementById("message-box")) {
        setTimeout(pre_loopLM, 200);
        console.log("Ogario not loaded");
        return;
    }
    return initializeLM(modVersion);
}

function initializeLM(modVersion) {

    $("#server-ws").hide();
    $("#server-connect").hide();
    //$('#region').before($("#server-reconnect"));
    $("#server-info").show();
    //$(".btn.btn-warning.btn-server-info.ogicon-cogs").after($("#server-reconnect"));
    $(".btn.btn-warning.btn-server-info.ogicon-cogs").hide();

    $("#server-token").css("margin-top", "-10px");
    $("#server-join").css("margin-top", "-10px");
    $("#agario-main-buttons").css("margin-top", "-10px");
    $("#gamemode").css("margin-left", "2px");
    $("#server-reconnect").remove();
    $(".btn.btn-warning.btn-server-info.ogicon-cogs").after('<button id="server-reconnect" class="btn btn-success" style="display: inline-block; float: left; margin-top: 6px; width: 11%; text-transform: capitalize;"><i class="fa fa-refresh"></i></button>');

    $("#server-reconnect").css("display", "inline-block");
    $("#server-reconnect").css("float", "left");
    $("#server-reconnect").css("margin-top", "6px");
    $("#server-reconnect").css("width", "11%");

    //preventcanvasimagecrash();
    //    setTimeout(function() {
    //document.title = "Legend express v" + modVersion;
    $("#leaderboard-hud > h4").text("Leaderboard");
    $("button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>').attr('data-toggle', "tooltip").prop('title', 'Spectate');
    $("button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>').attr('data-toggle', "tooltip").prop('title', 'Logout');
    $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");

    $("#create-party-btn-2").html('<span class="glyphicon glyphicon-plus"></span>');
    $("#create-party-btn-2").attr('data-toggle', "tooltip").prop('title', "Create party");

    $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>').attr('data-toggle', "tooltip").prop('title', "Join party").attr("style", "width: 49% !important; float: right;");

    //backgroud div
    $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');

    $("#overlays").css("z-index", 100);

    $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="pointer-events: auto;display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 44px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;"><p id="regionmodecheck" style="float: left;margin-left: 10px;">' +
        '<i class="fa fa-search retro" onclick="getInfo2(); return false;"></i>  ' +
        '<select id="regioncheck" class="form-control main-color note" onchange="getInfo2();getInfo3();" style="display: inline-block; font-size: 13px; position: relative; width: 150px; height: 32px; pointer-events: auto;background:' + legbgcolor + '"; border: none; border-bottom: 1px solid; margin-left: 20px; text-align: center; border-color: darkgrey;">' +
        '<option style="background:' + legbgcolor + '" value="US-Atlanta" data-itr="page_region_north_america">North America</option>' +
        '<option style="background:' + legbgcolor + '" value="BR-Brazil" data-itr="page_region_south_america">South America</option>' +
        '<option style="background:' + legbgcolor + '"  value="EU-London" data-itr="page_region_europe">Europe</option>' +
        '<option style="background:' + legbgcolor + '"  value="RU-Russia" data-itr="page_region_russia">Russia</option>' +
        '<option style="background:' + legbgcolor + '" value="TK-Turkey" data-itr="page_region_turkey">Turkey</option>' +
        '<option style="background:' + legbgcolor + '"  value="JP-Tokyo" data-itr="page_region_east_asia">East Asia</option>' +
        '<option style="background:' + legbgcolor + '"  value="CN-China" data-itr="page_region_china">China </option>' +
        '<option style="background:' + legbgcolor + '"  value="SG-Singapore" data-itr="page_region_oceania">Oceania</option></select>' +

        '<select id="gamemodecheck" class="form-control main-color note" onchange="getInfo2();" style="display: inline-block; font-size: 13px; position: relative; width: 150px; height: 32px; pointer-events: auto;background:' + legbgcolor + '"; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
        '<option style="background:' + legbgcolor + '" value=":ffa" data-itr="page_gamemode_ffa">FFA</option>' +
        '<option style="background:' + legbgcolor + '" value=":battleroyale" data-itr="page_gamemode_battle_royale">Battle Royal</option>' +
        '<option style="background:' + legbgcolor + '" value=":teams" data-itr="page_gamemode_teams">Teams</option>' +
        '<option style="background:' + legbgcolor + '" value=":experimental" data-itr="page_gamemode_experimental">Experimental</option>' +
        '<option style="background:' + legbgcolor + '" value=":party" data-itr="page_party">Party</option>' +
        '</select>' +
        '</p>' +

        '<p style="float: right; margin-right: 10px;"><span id="notesServer">Servers: </span><span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p>' +
        '<p style="float: right;margin-right: 100px;"><span id="notesPlayers">Players: </span><span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>' +
        '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
        '<div id="" style="margin-top: 10px;">' +
        '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="pointer-events: auto;margin-bottom: 10px;float: left;width: 80% !important;text-align: center;">' +
        '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="pointer-events: auto;margin-bottom:10px;width: 15%;"><span id="searchSpan"><i class="fa fa-search"></i></span></button>' +
        //            '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="pointer-events: auto;color: #ffffff;margin-bottom:10px;width: 10%; background-color: transparent;" data-placement="right" data-original-title="Close" title=""><i class="fa fa-window-close fa-2"></i></button>' +
        '</div></div>'
    );
    $("#regionmodecheck").hide();
    $("#leaderboard-hud").append('<input id="tempCopy" style="display: none;" value="">' +
        '</div>');
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
    $("#nick").attr('placeholder', 'Name').tooltip({
        title: "Insert your in-game name",
        placement: "bottom"
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
    $('.glyphicon.glyphicon-globe').removeClass('glyphicon glyphicon-globe').addClass('fa fa-globe fa-lg');
    $('.btn.btn-warning.btn-spectate.btn-needs-server').after('<button id="logoutbtn" onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout">Logout</button>');

    $("#minimap-hud").prepend('<div id="timertools-hud" class="hud" align="center" style="width: 50%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -90px; display: block;">' +
        '<button id="playtimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: block;" onclick="startTimer();" data-toggle="tooltip" data-original-title="Start Timer"" ><i id="playtime" class="fa fa-play-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="stoptimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="stopTimer();" data-toggle="tooltip" data-original-title="Pause Timer""><i id="pausetime" class="fa fa-pause-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="cleartimer" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100% display: none;" onclick="clearTimer();" data-toggle="tooltip" data-original-title="Stop Timer"><i id="cleartime" class="fa fa-stop-circle" style="padding-left: 0px;"></i></button>' +
        '<a id="timer" style="padding: 0px; color: #d6d3d3; width: 12%; height: 100% position: absolute; right: 0px;">00:00</a>');
    $("#stoptimer").hide();
    $("#cleartimer").hide();

    //        $(".menu-tabs").children().attr("style", "width: 14.27%;");
    $(".menu-tabs>:nth-child(2)").after('<li class="legend-tab" style="width: 16.66%; padding:12px;" data-toggle="tooltip" data-original-title="API" data-placement="top"><a style="margin-top: 2px; height: 100%; padding:12px;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\');" href="javascript:void(0);" class="fa fa-puzzle-piece fa-lg"></a></li>');
    $(".menu-tabs").children().attr("style", "width: 16.66%;");

    $(".menu-tabs").children().attr("style", "width: 16.66%;");
    $(".profile-tab").hide();
    $("#main-menu>#profile").after('<div id="legend" class="menu-panel"><div class="agario-panel legend-panel">' + //<h5 class="menu-main-color">Main Tools</h5>
        //											'<button id="IPBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-trademark"></i>Show Connector</button>' +
        '<div id="UserProfile" style="margin-bottom: 10px;">' +
        '<div id="UserProfilePic" class="user-picture"><img align="right" src="https://jimboy3100.github.io/banners/profilepic_guest.png" style="width: 60px; display:inline-block;border-radius: 30px;"></img></div>' +
        '<div style="display:inline-block; width: 70%;">' +
        '<div id="UserProfileName">Name: <div id="UserProfileName1" class="user-name" style="display:inline-block" >Guest</div></div>' +
        '<div id="UserProfileUID">Social ID: <div id="UserProfileUID1" class="user-name" style="display:inline-block" ></div></div>' +
        '<div id="TimesUsedPanel" class="user-name" style="display:inline-block;">Times Used: <div id="TimesUsed" style="display:inline-block"></div></div><br>' +
        '</div></div>' +
        '<button id="SHOSHOBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-puzzle-piece"></i>' + Premadeletter42 + '</button>' +
        '<button id="XPBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-gamepad"></i>' + Premadeletter44 + '</button>' +
        //                                          '<button id="TIMEBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-clock-o"></i>' + Premadeletter46 + '</button>' +
        //											'<button id="MAINBBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-bars"></i>Show Main Banner</button>' +
        '<button id="MAINBTBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-minus"></i>' + Premadeletter45a + '</button>' +
        '<button id="AnimatedSkinBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-grav"></i>' + Premadeletter46 + '</button>' +
        //											'<button id="RotationBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-repeat"></i>Show Rotation Btns</button>' +
        '<button id="HideAllBthn" type="button" class="btn btn-sm btn-danger" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Temporarily Hide/Show Everything. Function for Youtubers" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-exclamation-triangle"></i>' + Premadeletter49 + '</button>' +
        '<button id="TIMEcalBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-calculator"></i>' + Premadeletter50 + '</button>' +
        //											'<button id="copyGameNames" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%; display: none;"><i class="fa fa-scissors"></i>' + Premadeletter52 + '</button>' +
        /*           '<button id="autoCoinBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-clock-o"></i>' + Premadeletter53 + '</button>' +
                   //											'<button id="autoRespawnBtn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" data-original-title="" title="" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-flash"></i> Auto respawn</button>' +
                   '<button id="troll1Btn" type="button" class="btn btn-sm btn-warning" data-toggle="button" aria-pressed="false" autocomplete="off" data-original-title="" title="" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-bath"></i>' + Premadeletter55 + '</button>' +
                   //											'<button id="OpenInfo" type="button" class="btn btn-sm btn-danger" data-toggle="button" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="Mod Information and choose Template" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-info-circle"></i>Information</button>' +
        */
        '<button id="OpenuserScripts" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 100%; padding: 4px 0 6px 0;"><i class="fa fa-code"></i>User Scripts</button>' +
        '<button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" onclick="BeforeSpecialDeals(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>Special Deals</button>' +
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

        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 0px 0 0px 0;"><span id="legendlanguagetext" class="title" style="" data-toggle="tooltip" data-placement="right" data-original-title="Visit https://jimboy3100.github.io/ LanguagePackEnglish.js to Upload a Language Pack">Choose Language:  </span>' +
        '<select id="legendlanguages" class="form-control" onchange="changeModLanguage();" required="" data-original-title="" title="" style="display:inline; width: 50%" >' +
        '<option value="1" data-itr="">English</option>' +
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
        '</div></div>');
    loginsfbGpl2();
    //fix userprofile
    $("#UserProfile").css("font-size", "12px");
    $("#UserProfilePic").click(function() {
        useProfilePhotoCustom();
    });
    //			loginsfbGpl();			
    //		$("#exp-bar").hide();
    //		$(".menu-tabs").children().attr("style", "width: 19.99%;");
    //		$(".profile-tab").hide();

    $("#time-hud").attr("style", "top: 290px !important;");

    // fix leaderboard buttons
    $("#leaderboard-menu").css("pointer-events", "auto");


    // fix stats text size
    $('[id="statsText"]').css("font-size", "medium");


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
    //            '<button id="YoutubeAutoBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>' + Premadeletter40 + '</button></div>'+
    //			'<button id="YoutubeBackgroundBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>' + Premadeletter61 + '</button></div>' +

    $('.agario-panel.radio-panel').hide();
    $('.agario-panel.ogario-yt-panel').hide();

    if ($('#menuBg').val() == "https://cdn.ogario.ovh/static/img/pattern.png") {
        $('#menuBg').val("https://jimboy3100.github.io/pattern.png");
    }
    if ($('#messageSound').val() == "https://cdn.ogario.ovh/static/sounds/notification_01.mp3") {
        $('#messageSound').val("https://jimboy3100.github.io/notification_01.mp3");
    }
    if ($('#commandSound').val() == "https://cdn.ogario.ovh/static/sounds/notification_02.mp3") {
        $('#commandSound').val("https://jimboy3100.github.io/notification_02.mp3");
    }
    //    $("#music").replaceWith('<div id="music" class="menu-panel" style="display: none;"><div class="agario-panel"><h5 class="main-color">Youtube player</h5>' +
    //                            '<iframe id="musicFrame" width="320" height="180" src="' + getEmbedUrl(initialMusicUrl) + '" frameborder="0" allowfullscreen=""></iframe>' +
    //                            '<input id="musicUrl" onclick="$(this).select();" type="text" placeholder="Youtube Url" value="' + initialMusicUrl + '" class="form-control" data-toggle="tooltip" data-placement="right" data-original-title="Paste your video/playlist here">'+
    //							'<button id="YoutubeAutoBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px;"><i class="fa fa-youtube-play"></i>Auto Youtube On</button></div>');
    //	$('#music').append(savemusic+'</div>');						

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
    //$('.music-tab').children().addClass('quick-yt icon-youtube2').removeClass('icon-music').attr('data-original-title', 'Youtube & Sounds');
    $('.music-tab').children().attr('data-original-title', 'Youtube & Sounds');
    document.getElementsByClassName('quick-yt ogicon-youtube2')[0].setAttribute('id', 'legendid');

    document.getElementsByClassName('quick-yt ogicon-youtube2')[0].href = "https://www.youtube.com/watch?v=CnIfNSpCf70";
    document.getElementsByClassName('quick-yt ogicon-youtube2')[0].setAttribute('data-original-title', 'Legend Promo Video');
    //       $('#legendid').addClass('fa fa-thumbs-o-up').removeClass('quick-yt icon-youtube2');
    $("#more-skins").attr('href', 'https://jimboy3100.github.io/skins/');
    $(".quick-more-skins.ogicon-grin").attr('href', 'https://jimboy3100.github.io/skins/');
    $("#quick-menu").append('<a id= "oldSkinsBtn" class="fa fa-shopping-basket" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="Old Skins/ MassX3 1h"></a>');
    $(".quick-more-skins.ogicon-grin").after('<a id= "themesBtn" target="_blank" href="https://jimboy3100.github.io/themes/" class="fa fa-tint" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="Themes"></a>' +
        //		'<a id= "LMImplements" class="fa fa-eercast" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="Implementations from Legend Mod"></a>'+
        '<a id= "LegGoogleForm" class="fa fa-check-square-o" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="New Ideas & Statistics Form" onclick="legendformIframe();return false;"></a>' +
        '<a id= "ModInfoQuick" class="fa fa-info" data-toggle="tooltip" data-container="body" data-placement="left" title="" data-original-title="Mod Info & Templates" onclick="openhelper();return false;"></a>');
    $("#LegGoogleForm").tooltip('show').tooltip('hide');
    $("#oldSkinsBtn").tooltip('show').tooltip('hide');
    $("#oldSkinsBtn").hide();
    $("#ModInfoQuick").tooltip('show').tooltip('hide');
    //		$("#LMImplements").tooltip('show').tooltip('hide');
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

    //fzogar Upload / Download Settings
    $("#import-settings-btn").attr('class', 'btn btn-success');
    //		$("#close-exp-imp").before('<button id="fzogarOgarBtn" onclick="fzogarOgarIframe(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">Upload / Download</button>');

    $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">Results</h5>' +
        '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">' +
        '</div></div>');

    //$("#minimap-hud").prepend('<div id="rotate-hud" class="" style="width: 11%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: 0px; display: block;">' +
        //	'<button id="RotateLeft" class="btn-link" style="padding: 0px;color: #d6d3d3; width: 49%;height: 100%;" onclick="rotateminimapsectors2();" data-toggle="tooltip"  data-original-title="Rotate Left"><i class="fa fa-undo" style="padding-left: 0px;"></i></button>'+
        //'<button id="RotateRight" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" onclick="rotateminimapsectors();" data-toggle="tooltip" data-original-title="Rotate"><i class="fa fa-repeat" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="shortcuts-hud" class="hud" style="width: 100%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -30px; display: block;">' +
        '<button id="VoiceBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title="Voice & Camera Chat"><i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i></button>' +
        '<button id="ChatBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title=' + Premadeletter57 + '><i id="ChatBtn1" class="fa fa-comment-o" style="padding-left: 0px;"></i></button>' +
        '<button id="MiniScripts" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setscriptingfunction();" data-toggle="tooltip" data-original-title="Mini Scripts"><i id="MiniScripts1" class="fa fa-linode" style="padding-left: 0px;"></i></button>' +
        '<button id="SendCommands" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setmessagecomfunction();" data-toggle="tooltip" data-original-title="Message Script Commands"><i id="SendCommands1" class="fa fa-sitemap" style="padding-left: 0px;"></i></button>' +
        '<button id="Images" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="seticonfunction();" data-toggle="tooltip" data-original-title="Message Imgur Icons"><i id="Images1" class="fa fa-picture-o" style="padding-left: 0px;"></i></button>' +
        '<button id="yout" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="setytfunction();" data-toggle="tooltip" data-original-title="Message Youtube Videos"><i id="yout1" class="fa fa-youtube" style="padding-left: 0px;"></i></button>' +
        '<button id="Bino" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" onclick="Bino();" data-toggle="tooltip" data-original-title="[Spectate Mode Only] Binoculars"><i id="BinoBtnI" class="fa fa-binoculars" style="padding-center: 0px;"></i></button>' +
        '<button id="playerBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 11%; height: 100%;" data-toggle="tooltip" data-original-title="Click play on youtube tab at first"><i id="playerI" class="fa fa-play-circle" style="padding-center: 0px;"></i></button>' +
        '<button id="fullscreenBtn" class="btn-link" style="padding: 0px;color: #d6d3d3;width: 11%;height: 100%;" onclick="toggleFullScreen(fullornot);" data-toggle="tooltip" data-original-title="Fullscreen"><i class="fa fa-tv" style="padding-left: 0px;"></i></button></div>');


    $("#minimap-hud").prepend('<div id="images-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="sendicon1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon1();" data-toggle="tooltip" data-original-title="Bad Choice!"><i id="sendicon11" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon2();" data-toggle="tooltip" data-original-title="Why?"><i id="sendicon21" class="fa fa-question-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon3();" data-toggle="tooltip" data-original-title="Yow!!"><i id="sendicon31" class="fa fa-wheelchair" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon4();" data-toggle="tooltip" data-original-title="Death!"><i id="sendicon41" class="fa fa-cutlery" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon5();" data-toggle="tooltip" data-original-title="Relax!"><i id="sendicon51" class="fa fa-bed" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon6();" data-toggle="tooltip" data-original-title="Legend mod!"><i id="sendicon61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

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

    $("#minimap-hud").prepend('<div id="scripting-hud" class="hud" style="width: 25%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="Cutnames" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" data-toggle="tooltip" data-original-title="Edit names"><i id="Cutnames1" class="fa fa-scissors" style="padding-left: 0px;"></i></button>' +
        '<button id="Cutnames" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" onclick="Ultimouse();" data-toggle="tooltip" data-original-title="Ultimouse Control"><i id="Ultimouse1" class="fa fa-mouse-pointer" style="padding-left: 0px;"></i></button></div>');

    $("#leaderboard-hud").append('<div id="leaderboard-menu" style="pointer-events: auto;">' +
        '<a id="searchShortcut" class="btn btn-info" data-toggle="tooltip" data-placement="left" data-original-title="Join server (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ; " data-toggle="tooltip" data-original-title="Search leaderboards" title=""><i class="fa fa-search fa-lg"></i></a>' +
        '<a id="copySIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP">Copy</a>' +
        '<a id="reconnectBtn" class="btn btn-info" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="' +
        'background-color: transparent;color: ' + legmaincolor + ' ;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; border: none;"><i class="fa fa-refresh fa-lg"></i></a>' +

        '<div id="dropDown3" class="hud" style="position: absolute; pointer-events: auto; width: 33%; left: 0px; padding: 0px; border-radius: 0px;">' +
        '<a id="lastIPBtn" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px; margin-right: 2px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;>NEW</span>Join back</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>Connect to last IP you played</p>"><i class="fa fa-arrow-circle-down fa-lg"></i></a>' +
        '</div>' +
        '<div id="dropDown2" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 90px; left: 67px; padding: 0px; border-radius: 0px;">' +
        '<a id="copySIPandPass" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP&Password">TK&PW</a>' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">LB</a>' +
        '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP, Password, Leaderboard...">TK&ALL</a>' +
        '</div>' +
        '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30px; left: 67px; padding: -30px; border-radius: 0px;">' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">LB</a>' +
        //            '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP&Leaderboard">TK&PW&L</a>' +
        '</div>' +

        '<input id="tempCopy" style="display: none;" value="">' +
        '</div>');
    // player shortcut			

    $(".options-box.zoomGroup").after('<div class="options-box leaderboard">' +
        '<h5 class="menu-main-color">Leaderboards</h5>' +
        '<label>Leaderboard Players<input type="checkbox" class="js-switch" id="quickleaderbaord" data-switchery="true" style="display: none;">' +
        '<span><select id="leaderboardlimit" class="form-control" onchange="changeleaderboardlimit();" required="" data-original-title="" title="" style="display:inline; position: absolute;margin-top: -10px; right: 10px; width: 80px" >' +
        '<option selected value="10" data-itr="">10</option>' +
        '<option value="15" data-itr="">15</option>' +
        '<option value="20" data-itr="">20</option>' +
        '<option value="25" data-itr="">25</option>' +
        '<option value="30" data-itr="">30</option>' +
        '</select></span></label><br><br>' +
        '<label>Team Players<input type="checkbox" class="js-switch" id="quickteambaord" data-switchery="true" style="display: none;">' +
        '<span><select id="teamboardlimit" class="form-control" onchange="changeteamboardlimit();" required="" data-original-title="" title="" style="display:inline; position: absolute;margin-top: -10px; right: 10px; width: 80px" >' +
        '<option selected value="5" data-itr="">5</option>' +
        '<option value="10" data-itr="">10</option>' +
        '<option value="15" data-itr="">15</option>' +
        '<option value="20" data-itr="">20</option>' +
        '<option value="25" data-itr="">25</option>' +
        '<option value="30" data-itr="">30</option>' +
        '<option value="35" data-itr="">35</option>' +
        '<option value="40" data-itr="">40</option>' +
        '</select></span></label>' +
        '</div>');

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
                    toastr["error"](Premadeletter31).css("width", "210px");
                }
            }, 1000);
        }
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
            // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
            copy(CopyTkPwLb2);
        } else if (realmode != ":party") {
            if (region != null && realmode != null) {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val() + "&?r=" + region + "&m=" + realmode;	
                copy(CopyTkPwLb2);
            } else {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                copy(CopyTkPwLb2);
            }
        } else if (privateSrv == null) { //else if (searchSip != null && privateSrv==null)
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip="+$("#server-token").val()+"&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        } else if (privateSrv != null) {
            CopyTkPwLb2 = "https://agar.io/?ip=" + privateSrv + "&?pass=" + $("#clantag").val() + "&?SERVER=PRIVATE";
            copy(CopyTkPwLb2);
        }
    });

    $("#copySIPandPass").click(function() {
        if (searchSip != null) {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                //					if (region!=null&&realmode!=null){
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val() + "&?r=" + region + "&m=" + realmode;	
                copy(CopyTkPwLb2);
                //					}
                //					else{
                //					CopyTkPwLb2="http://agar.io/?sip=" +$("#server-token").val()+ "&?pass=" + $("#clantag").val();	
                //					copy(CopyTkPwLb2);
                //					}
            }
        } else if (privateSrv == null) { //else if (searchSip != null && privateSrv==null)
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip="+$("#server-token").val()+"&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        } else if (privateSrv != null) {
            CopyTkPwLb2 = "https://agar.io/?ip=" + privateSrv + "&?pass=" + $("#clantag").val() + "&?SERVER=PRIVATE";
            copy(CopyTkPwLb2);
        }
    });

    $("#copySIPPassLB").click(function() {
        if (searchSip != null) {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
                copyToClipboardAll();
            } else if (realmode != ":party") {
                //					if (region!=null&&realmode!=null){
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val() + "&?r=" + region + "&m=" + realmode;	
                copy(CopyTkPwLb2);
                //					}
                //					else{
                //					CopyTkPwLb2="http://agar.io/?sip=" +$("#server-token").val()+ "&?pass=" + $("#clantag").val();	
                //					copy(CopyTkPwLb2);
                //					}
            }
        } else if (privateSrv == null) { //else if (searchSip != null && privateSrv==null)
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val();
                // CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + $("#server").val();
                copyToClipboardAll();
            } else if (realmode != ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                //CopyTkPwLb2="http://agar.io/?sip="+$("#server-token").val()+"&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
                copyToClipboardAll();
            }
        } else if (privateSrv != null) {
            CopyTkPwLb2 = "https://agar.io/?ip=" + privateSrv + "&?pass=" + $("#clantag").val() + "&?SERVER=PRIVATE";
            copyToClipboardAll();
        }
    });

    //fix message-box focus
    $('#message').click(function() {
        $("#message").focus();
    });

    $("#reconnectBtn").click(function() {
        $("#server-reconnect").click();
    });



    /*$("#createPartyBtn").click(function(){ hideMenu();$("#create-party-btn-2").click();if (!$("#searchHud").is(':visible')) {delay(200, spectate);}});*/
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
            toastr["error"](Premadeletter32 + "!").css("width", "210px");
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
        //			hideMenu();
        showMenu2();
    });
    $("#searchShortcut").mouseenter(function() {
        $("#dropDown").hide();
        $("#dropDown3").show(100);
        $("#copySIPBtn").text("Copy");
    });

    $("#searchHud").css("pointer-events", "auto");

    $("#searchShortcut").click(function() {
        hideMenu();
        //			showMenu();
        $("#regioncheck").val($("#region").val());
        $("#gamemodecheck").val($("#gamemode").val());
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
        previousnickname = $("#nick").val();
        localStorage.setItem("previousnickname", previousnickname);
        //Animated Skins
        for (animatedkey in animatedskins) {
            if (animatedkey == $("#nick").val()) {
                toastr["info"]("Nickname reserved for <font color='yellow'><b>Animated Skins</font></b>");
            }
        }
        //
        if (clickedname == "YES") {
            if ($("#nick").val().length >= 16) {
                //toastr["warning"]("<b>[SERVER]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
				toastr["warning"]("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
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

    $("#ChatBtn").click(function() {
        chatfunction();
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
        //				if (modVersion == "1.4" ) {
        var currentIP2 = $("#server-token").val();
        var pass2 = $("#clantag").val();
        //var currentIP2=currentIP.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(":","");
        //semiurl2=currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + currentIP;	
        if (pass2 != "") {
            semiurl2 = currentIP2 + "pass=" + pass2;
        } else {
            semiurl2 = currentIP2;
        }




        url2 = "https://talky.io/" + semiurl2;

        setTimeout(function() {
            $("#VoiceBtn").focusout();
        }, 100);
        //			setTimeout(function (){ $("#VoiceBtn").focusout();}, 5000);
        //			setTimeout(function (){ $("#VoiceBtn").focusout();}, 8000);
        var win = window.open(url2, '_blank');
        //				}
        //			else{
        //			toastr["info"]('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.4</b></font>, in order to use this function</font>');	
        //			}					
    });

    $('#stream-mode').before('<button id="opennamechars" class="btn btn-info" style="background-color: transparent;" onclick="opennamechars();return false;"><i class="fa fa-language"></i></button>');
    $('#opennamechars').tooltip({
        title: "Design Nickname Font",
        placement: "bottom"
    });
    $('#hide-url').before('<button id="openskinchanger" class="btn btn-info" style="background-color: transparent;" onclick="BeforeReportFakesSkin();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $('#openskinchanger').attr('placeholder', 'Name').tooltip({
        title: "Flag the Fake's Skin",
        placement: "bottom"
    });

    //$('#clantag').css("width", "-=20px");	$('#nick').css("width", "+=20px");	
    $('#clantag').css("width", "95.5px");
    $('#nick').css("width", "171px");
    $('#clantag').mouseenter(function() {
        $('#clantag').css('background-color', '#000066');
    }).mouseleave(function() {
        $('#clantag').css('background-color', '');
        if (privateSrv == null) {
            saveclanpassword = $("#clantag").val();
            localStorage.setItem("saveclanpassword", saveclanpassword);
        }
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
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
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
        //if ($('#nick').val() != undefined) {nicknametosend=$('#nick').val(); }
        //var i = 0, nicknametosendlength = nicknametosend.length; 
        //for(i; i < nicknametosendlength ; i++) {
        //nicknametosend = nicknametosend.replace(" ", "_");
        //}
        if ($('#server').val() != undefined) {
            if (servertosend.indexOf("#") == false) {
                servertosend = $('#server').val().replace('#', 'Party-');
            }
        }

        if (privateSrv != null) {
            detailed1 = "https://jimboy3100.github.io/AN?" + "AID=" + window.agarioID + "&Date=" + datetime + "&sip=" + privateSrv + "&pwd=" + Pwdtosend + "&join=PrivateServer" + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        } else if (searchSip == null) {
            detailed1 = "https://jimboy3100.github.io/AN?" + "AID=" + window.agarioID + "&Date=" + datetime + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&mode=" + modetosend + "&region=" + regiontosend + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        } else if (searchSip != null) {
            detailed1 = "https://jimboy3100.github.io/AN?" + "AID=" + window.agarioID + "&Date=" + datetime + "&sip=" + searchSip + "&pwd=" + Pwdtosend + "&join=Url" + "&mode=" + modetosend + "&region=" + regiontosend + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        } else {
            detailed1 = "https://jimboy3100.github.io/AN?" + "AID=" + window.agarioID + "&Date=" + datetime + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&mode=" + modetosend + "&region=" + regiontosend + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&UID=" + window.agarioUID + "&lastname=" + userlastname + "&firstname=" + userfirstname;
        }
        $('#musicUrl').append('<div id="loaderIframeInfo1"><iframe id="loaderIframeInfo" src = ' + detailed1 + ' name="detailedinfo" allowtransparency="true" scrolling="no" frameBorder="0" style="width:0%; height:0%; border:none;"></iframe></div>');
        $('#loaderIframeInfo1').hide();
        //		if (YoutubeAutoBtn==true){$('#musicFrame')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');}

        setTimeout(function() {
            if (legendflags.includes(LowerCase($("#nick").val()))) {
                console.log("[Legend mod Express] " + LowerCase($("#nick").val()) + " skin found. Skin registered");
                core.registerSkin($("#nick").val(), null, "https://jimboy3100.github.io/agario/live/flags/" + LowerCase($("#nick").val()) + ".png", null);
            }
        }, 1500);
        setTimeout(function() {
            $('#loaderIframeInfo1').remove();
        }, 4000);
        return lastIP = $('#server-token').val();
    });


    $("#boostButton").css("display", "inline-block");
    $("#massButton").css("display", "inline-block");
    $("#massButton").after($("#promo-badge-container"));


    $(".agario-profile-name").css('display', 'inline-block');
    $(".agario-profile-name").css('vertical-align', ' baseline');

    $('#themePreset>option:nth-child(1)').text("Legend v2");
    $('#themePreset>option:nth-child(2)').text("Legend v1");
    $('#themePreset>option:nth-child(3)').text("Legend Original");
    $('#themePreset>option:nth-child(4)').text("Crazy Style 1");
    $('#themePreset>option:nth-child(5)').text("Crazy Style 2");
    $('#menuPreset>option:nth-child(1)').text("Legend v2");
    $('#menuPreset>option:nth-child(2)').text("Legend v1");
    //Legend express Cursors
    if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_01.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_02.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_03.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_03.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_04.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_04.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_05.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_05.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_06.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_06.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_07.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_07.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_08.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_08.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_09.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_09.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_10.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_10.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_11.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_11.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_12.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_12.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_13.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_13.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_14.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_14.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_15.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_15.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_16.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_16.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_17.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_17.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_18.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_18.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_19.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_19.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_20.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_20.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_21.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_21.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_22.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_22.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_23.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_23.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_24.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_24.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_25.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_25.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_26.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_26.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_27.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_27.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_28.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_28.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_29.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_29.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_30.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_30.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_31.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_31.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_32.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_32.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_33.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_33.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_34.cur") {
        $("#customCursor").val("https://jimboy3100.github.io/cursors/cursor_34.cur")
    } else if ($("#customCursor").val() == "https://cdn.ogario.ovh/static/img/cursors/cursor_35.cur") {
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
            if (searchSip != null) {
                ctx.fillText(minbtext, c.width / 2, 22)
            } else if (privateSrv != null) {
                ctx.fillText(minbtext3, c.width / 2, 22);
            } else {
                ctx.fillText(minbtext2, c.width / 2, 22);
            }
            //MC.setQuality($('#quality').val());
        }, 200);
    })
    $('#miniMapWidth-value').bind("DOMSubtreeModified", function() {
        setTimeout(function() {
            var c = document.getElementById("minimap-sectors");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height / 9);
            ctx.font = "16px Georgia";
            if (searchSip != null) {
                ctx.fillText(minbtext, c.width / 2, 22)
            } else if (privateSrv != null) {
                ctx.fillText(minbtext3, c.width / 2, 22);
            } else {
                ctx.fillText(minbtext2, c.width / 2, 22);
            }
            //MC.setQuality($('#quality').val());
        }, 100);
    })
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
        //toastr["info"]("Function is not ready yet");
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



    /*				var checked = !($(this).attr('aria-pressed') == "true");
            		if (checked) {localStorage.setItem("AnimatedSkinBtn", true);if (usedonceSkin==0){animatedskins();}
    				if (toastrSkinNotice==1){toastr["info"](Premadeletter71 + " <font color='red'><b>" + Premadeletter72 + "</font></b>, <font color='red'><b>FPS " + Premadeletter73 + "</font></b> "+Premadeletter74+" 16").css("width", "300px");}
    				$(this).html('<i class="fa fa-grav"></i>'+ Premadeletter47); return usedonceSkin=1;}
            		else {localStorage.setItem("AnimatedSkinBtn", false);
    				toastr["info"](Premadeletter75 +" <font color='red'><b>" + Premadeletter76 + "</font></b> " + Premadeletter77 + ". <font color='red'><b>" + Premadeletter78 + "</font></b> "+Premadeletter79).css("width", "300px");
    				$(this).html('<i class="fa fa-grav"></i>' + Premadeletter46);} 
    				} );  	*/
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
            //$("#rotate-hud").hide();
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
            //$("#rotate-hud").show();
            $("#exp-bar").show();
            //$("#time-hud").show();
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
    $("#OpenuserScripts").click(function() {

        $("#main-menu").hide();
        $("#skins-panel").hide();
        $("#quick-menu").hide();
        $("#exp-bar").hide();
        $("#userscripts").show();

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

    $("#oldSkinsBtn").click(function() {

        if (modVersion == "1.5" || modVersion == "1.6") {
            location.replace("https://agar.io/LMoldskins");
        } else {
            toastr["info"]('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.6</b></font>, in order to use this function</font>');
        }
    });
    /*		$("#LMImplements").click(function() {
    			if (modVersion == "1.3" ) {
    			var myWindow = window.open("http://agar.io/LMImplements", "_blank", "width=400,height=800");
    			}
    			else{
    			toastr["info"]('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.3</b></font>, in order to use this function</font>');	
    			}
    		});		
    */

    $(".agario-panel.ogario-yt-panel").html('<div class="agario-panel ogario-yt-panel"><h6 class="menu-main-color"><i></i></h6></div>');

    $(".agario-panel.ogario-yt-panel").css({
        marginBottom: "-10px"
    });
    $("#menu-footer").text("");
    //$("#agario-main-buttons").after('<div id="LEGENDAds4"></div>'); //
    //$("#LEGENDAds4").load("https://jimboy3100.github.io/banners/bannerLMdevs"); //
    $("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'legendWebsite\');" href="http://www.legendmod.ml" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend express Website" data-placement="left">Legend express v' + modVersion + semimodVersion + '</a></span>' +
        '<a id="MorefpsText" href="https://jimboy3100.github.io/?nav=FPS" data-toggle="tooltip" data-title="How to improve performance" data-placement="top" style ="font-size: 13px"; target="_blank">More FPS</a>');

    $("#menu-footer").after('<form id="donationbtn" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" data-toggle="tooltip" data-title="Please support the development of Legend Mod" data-placement="left" target="_blank"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="CM3GDVCW6PBF6"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');

    /*        $("#YoutubeAutoBtn").click(function() {
                var checked = !($(this).attr('aria-pressed') == "true");
                if (checked) {
                    localStorage.setItem("YoutubeAutoBtn", true);
     //               setTimeout(function() {
                        playYoutube();
     //               }, 4000);
    //               setTimeout(function() {
    //                    playYoutube();
    //                }, 2100);
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter41);
                } else {
                    localStorage.setItem("YoutubeAutoBtn", false);
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter40);
                }
            }); 
            $("#YoutubeAutoBtn").click(function() {
                var checked = !($(this).attr('aria-pressed') == "true");
                if (checked) {
                    localStorage.setItem("YoutubeAutoBtn", true);
    				
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter41);
    				return YoutubeAutoBtn=true;
                } else {
                    localStorage.setItem("YoutubeAutoBtn", false);
                    $(this).html('<i class="fa fa-youtube-play"></i>' + Premadeletter40);
    				return YoutubeAutoBtn=false;
                }
            });			 */
    $("#shortcuts-hud").hide();
    //$("#rotate-hud").hide();
    $("#exp-bar").hide();
    $("#time-hud").hide();
    //	$("#LEGENDAds").hide();
    //	$("#legendbanners").hide();
    //	$(".input-group.skin.colorpicker-element").hide();
    $("#timertools-hud").hide();

    $("#TimesUsed").text(timesopened);
    LMserverbox();

    bluebtns();
    //SNEZ Upload / Download Settings
    SNEZServers();
    $("#import-settings-btn").attr('class', 'btn btn-success');
    $("#close-exp-imp").before('<button id="SNEZOgarUploadBtn" onclick="SNEZOgarUpload(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109 + '</button>');
    $("#close-exp-imp").before('<button id="SNEZOgarDownloadBtn" onclick="SNEZOgarDownload(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109a + '</button>');



    core.disconnect = function() {
        adres(null, $('#gamemode').val(), $('#region').val());
        pauseVideos();
    };
    $('#server-reconnect').click(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
            $("#server").val(currentIP);
        }, 100);
    });

    $("#gamemode").change(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
            $("#server").val(currentIP);
        }, 100);
    });
    $("#region").change(function() {
        setTimeout(function() {
            adres(null, $('#gamemode').val(), $('#region').val());
            $("#server").val(currentIP);
        }, 100);
    });

    $('#server-join').click(function() {
        adres(null, null, null);
    });

    $('#server-connect').click(function() {
        adres(null, null, null);
    });


    console.group('%cLegend express%c  %chttp://www.legendmod.ml', stylesLegendModConsole1, 'font-size: 48px; background: url(https://jimboy3100.github.io/banners/icon48.png) no-repeat', stylesLegendModConsole1);
    console.group("Part of");
    console.log('%cThe Legend mod Project™', stylesLegendModConsole2);
    console.groupEnd();
    console.group("Mod developed by");
    console.log('%cwww.legendclan.ml', stylesLegendModConsole2);
    console.groupEnd();
    console.groupEnd();

    setTimeout(function() {

        //$('#server-join').click(); //next time that ogario will be down
        loginsfbGplstart();
        triggerLMbtns();
        languagemodfun();
        $('[data-toggle="tooltip"]').tooltip();
    }, 2000);
    /*		toastr["info"]('<div id="tutorial" style="background-image: url(https://jimboy3100.github.io/banners/v25toastricon.jpg); color:#018cf6; font-size:16px; text-align:center">'+ 
    		'The Legend Mod <font color="yellow"><b>Project </b></font>'+
    		'<br><font style="color:#018cf6; font-size:16px; text-align:center"><b>Agario Updated Libraries</font></b><font color="black">'+
    		'<br><b>If you play FFA, use <a target="_blank" href="http://legendmod.joomla.com/en/"><font color="blue"><b><u>LM v3.1</u></b></font></a> until LM express be compatible again </b><i>(disable LM express on tampermonkey / agarioscripts before)</i>'+
    		'</div>', '', '{ timeOut: 15000, extendedTimeOut: 15000 }').css("width", "500px");	*/
    //    }, 1500);
}

function joinSIPonstart() {
    setTimeout(function() {
        if (searchSip != null) {
            if (realmode != null && region != null) {
                $('#gamemode').val(realmode);
                $("#region").val(region);
            }
            if (getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", "") != $("#server-token").val()) {
                joinSIPonstart1();
                joinSIPonstart2();
            }
        } else if (url.includes('https://agar.io/#') == true) {
            $('#gamemode').val(":party");
            realmodereturnfromStart();
            $("#server").val(url.replace('https://agar.io/#', ''));
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
            toastr["error"]("Server not found!");
        }
    }, 1500);
}

function joinSIPonstart1() {
    realmodereturnfromStart();
    $("#server-token").val(getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", ""));
    if (region != null && realmode != null) {
        currentIPopened = true;
    }
    $("#server-join").click();
    //$("#server").val(searchSip);
    //$("#connect2").click();			
}

function joinPLAYERonstart() {
    setTimeout(function() {
        if (searchedplayer != null) {
            $("#searchInput").val(searchedplayer);
            getSNEZServers("NoText");
            client2.connect();

            setTimeout(function() {
                if ($('.logEntry').html() != undefined) {
                    toastr["info"]("Player <font color='yellow'>" + $('.logEntry>#playerinfo').html() + "</font> contains <font color='yellow'>" + searchedplayer + "!</font>. Connected into Server");
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
    window.legendmod5.top5skins = false;
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
                    console.log("[Legend mod Express] Searching Snez servers..");
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

                    //if ($('.logEntry').html()!=undefined && $('.logEntry').html()!=""){
                    //$("#region").val($('.logEntry>#regioninfo').html());
                    //$("#gamemode").val($('.logEntry>#modeinfo').html());}
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
                            Modes[count] = $(this).val();
                            count++;
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
                                    //toastr["info"](countRegions[i]+" player(s) wispered it is "+Regions[i] );
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
                                    //toastr["info"](countModes[i]+" player(s) wispered it is "+Modes[i] );
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
                            history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + MaxRegion + "&?m=" + MaxMode);
                            ModeRegionregion();
                        }, 1500);
                        if ($("#region").val() != MaxRegion || $("#gamemode").val() != MaxMode) {
                            FinalText = FinalText + "<font color='yellow'>Best choice: Region:" + MaxRegion + ", Mode" + MaxMode + "</font><br>";
                            FinalText = FinalText + "Information changed!";
                            toastr["info"](FinalText).css("width", "350px");
                            $("#region").val(MaxRegion);
                            $("#gamemode").val(MaxMode);
                            master.region = $("#region").val();
                            master.gamemode = $("#gamemode").val();
                            //adres();
                        }
                    }
                    /*
                    else{
                    var FinalText = "No wispers found</font>";
                    toastr["info"](FinalText).css("width", "350px");	
                    }
                    */
                    //$('.logEntry').click();			
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

function getInfo2() {
    //console.log("hi");
    //$("#logTitle").text("Alive Servers");
    $('#log').html('');
    var region2search = $("#regioncheck").val();
    var gamemode2search = $("#gamemodecheck").val();
    gamemode2search = gamemode2search.replace(':', '');
    $.ajax({
        type: "GET",
        url: "https://agarlist.alien.moe/graphql?query={serverList(length:5,region:%20%22" + region2search + "%22,mode:%22" + gamemode2search + "%22)%20{%20addr,%20lastChecked%20}}",
        datatype: "json",
        success: function(info) {
            //$("#currentRegion").html($('#region').val());
            servers = info.data.serverList;
            for (var player = 0; player < servers.length; player++) {
                //console.log(servers[player].addr);
                var lastchecked = servers[player].lastChecked;
                //console.log(lastchecked);
                var hourschecked = new Date(Date.now() - lastchecked).getHours() - 2;
                var minuteschecked = new Date(Date.now() - lastchecked).getMinutes();
                var secondachecked = new Date(Date.now() - lastchecked).getSeconds();
                var resulttime;
                if (hourschecked == 0) {
                    if (minuteschecked == 0) {
                        resulttime = (secondachecked + " seconds " + " ago");
                    } else {
                        resulttime = (minuteschecked + " minutes " + secondachecked + " seconds " + " ago");
                    }
                } else {
                    resulttime = (hourschecked + " hours: " + minuteschecked + " minutes " + secondachecked + " seconds " + " ago");
                }
                if (hourschecked == 0) {
                    if (servers[player].addr.indexOf("ip-") >= 0) { //if wss
                        appendLog4("<span id='playerinfo'>" + resulttime + "</span> (<span class='main-color'><span id='tokeninfo'>" + servers[player].addr + "</span></span>)", servers[player].addr);
                    } else { //if wss
                        servers[player].addr = servers[player].addr.replace("live-arena-", "").replace(".agar.io", "").replace(":80", "");
                        appendLog2("<span id='playerinfo'>" + resulttime + "</span> (<span class='main-color'><span id='tokeninfo'>" + servers[player].addr + "</span></span>)", servers[player].addr);
                    }
                }

            }

        }
    });
}

function getInfo3() {
    $.ajax({
        type: "GET",
        url: "https://webbouncer-live-v7-0.agario.miniclippt.com/info",
        datatype: "json",
        success: function(info) {
            //$("#currentRegion").html($('#region').val());
            var regions = info.regions;
            var currentRegion;
            for (var key in regions) {
                if (key == $("#regioncheck").val()) {
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

function changeleaderboardlimit() {
    window.leaderboardlimit = $("#leaderboardlimit").val();
    localStorage.setItem("leaderboardlimit", window.leaderboardlimit);
}

function changeteamboardlimit() {
    window.teamboardlimit = $("#teamboardlimit").val();
    localStorage.setItem("teamboardlimit", window.teamboardlimit);
}
//Animated Skins
function animateSkincheckTimer() {
    animateSkincheck();
}

function animateSkinsStop() {
    clearInterval(animateSkinsStart);
}

function animateSkincheck() {
    for (i = 0; i < 10; i++) {
        for (animatedi = 0; animatedi < legendmod.leaderboard.length; animatedi++) {
            for (animatedkey in animatedskins) {
                if (animatedkey == legendmod.leaderboard[animatedi].nick) {
                    //console.log(animatedkey);
                    e = animatedskins[animatedkey].frames.length - 1;
                    for (animateda = 0; animateda <= animatedskins[animatedkey].frames.length - 1; animateda++) {
                        b = animateda;
                        verifiednames = animatedkey;
                        window.anual = window.anual + animatedskins[verifiednames].frames[b].delay * 1000;
                        d = animatedi;
                        animateSkin(window.anual, b, verifiednames, d, e, i);

                    }
                }
            }
        }
    }
}

function animateSkin(a, b, verifiednames, d, e, i) {
    setTimeout(function() {
        //if (verifiednames==legendmod.leaderboard[d].nick){
        legendmod3.cacheCustomSkin(verifiednames, animatedskins[verifiednames].color, "https://i.imgur.com/" + animatedskins[verifiednames].frames[b].id + ".png");
        //console.log(verifiednames, animatedskins[verifiednames].color, "https://i.imgur.com/" + animatedskins[verifiednames].frames[b].id + ".png");		
        //console.log("https://i.imgur.com/" + animatedskins[verifiednames].frames[b].id + ".png");
        //console.log(window.a);
        if (b == e) {
            //console.log("Animated Skins: End of cycle: " + i);
            if (i == 9) {
                window.anual = 0;
                if (animatedserverchanged == false) {
                    //animateSkincheck();
                    //console.log("Animated Skins: End of total cycles");
                }
            }
            //animateSkincheck()
        }
        //}
    }, window.anual);
}

/*				
function specialeffecttargeting(){
					document.getElementById("set-targeting").addEventListener('click',function ()
					{
					if ($("#target-nick").text()!=null && $("#target-nick").text()!=""){
					for (var i=0; i< 20 && i < legendmod.leaderboard.length ;i++){
						if (legendmod.leaderboard[i].nick==$("#target-nick").text()){
							window.legendmod.targetingLead(i);
						}
					}
					}
					}  ); 		
}
*/
function BeforeSpecialDeals() {
    var SpecialDealsJS = document.createElement("script");
    SpecialDealsJS.type = "text/javascript";
    SpecialDealsJS.src = "https://jimboy3100.github.io/LMexpress/olddeals.js";
    $("body").append(SpecialDealsJS);

    window.open('https://jimboy3100.github.io/LMexpress/olddeals.html', '_blank');
}


function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
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

function HiddenBots() {
    var hiddenBotsJS = document.createElement("script");
    hiddenBotsJS.type = "text/javascript";
    hiddenBotsJS.src = "https://jimboy3100.github.io/ExampleScripts/agario-bots/bots.js";
    $("body").append(hiddenBotsJS);
}

// Socket3enabler(window.legendmod.ws);
function Socket3enabler(srv) {

    this.room = ogarcopythelb.clanTag + "-" + srv.match("-([A-Za-z0-9]{6,7})\.")[1];
    if (Socket3) {
        Socket3.close();
    }
    //Socket3 = new WebSocket("wss://connect.websocket.in/Jimboy3100_socket?room_id=" + this.room);
	Socket3 = new WebSocket("wss://cloud.achex.ca/jimboy3100");
    Socket3.onmessage = function(message) {
        //console.log(message.data);
        Socket3handler(message.data);
    }
    Socket3.onopen = function(e) {
		Socket3.send(JSON.stringify({ "auth": customLMID, "password": "ILoveLegendClan"}));
		Socket3.send(JSON.stringify({ "joinHub": "legendmod"}));		
        console.log('[Legend mod Express] Socket 3 open');		
        if (!window.socket3Opened && window.noOgarioSocket) {
            $("#message").keydown(function(event) {
                if (event.keyCode === 13) { //window.legendmod6.getPressedKey(13)
                    enterChatMessage2();
                }
            });
        }
        window.socket3Opened = true;
    }
    Socket3.onerror = function(e) {
        console.log('[Legend mod Express] Socket 3 error', e);
    }
    Socket3.onclose = function(e) {
        console.log('[Legend mod Express] Socket 3 close', e);
    }
    return Socket3;
}

function Socket3handler(message) {
	//
    var Socket3data2 = JSON.parse(message);
	var Socket3data = Socket3data2.msg;
	//
    if (Socket3data == null){
		return;
	}
    else if (Socket3data.com == "chat") {
        Socket3DisplaychatMsg(Socket3data.chattype, Socket3data.tid, Socket3data.nick, Socket3data.chat);
    }
    else if (Socket3data.com == "sendPlayerSkinURL") {
        Socket3updateTeamPlayer(Socket3data);
    }
    else if (Socket3data.com == "pos") {
        Socket3updateTeamPlayerPosition(Socket3data);
    }
    else if (Socket3data.com == "death") { //not used yet
        Socket3updateTeamPlayerDeath(Socket3data);
    }	
    else if (Socket3data.com == "pcells") { 
		Socket3updateTeamPlayerCells(Socket3data);

		//}
    }		
}

function Socket3updateTeamPlayer(Socket3data) {
    var h = legendmod3.checkPlayerID(Socket3data.id);
    if (!legendmod3.teamPlayers[h]) {
        h = legendmod3.teamPlayers.length;
        legendmod3.teamPlayers[h] = {}
    }
    legendmod3.teamPlayers[h].id = Socket3data.id;
    legendmod3.teamPlayers[h].nick = Socket3data.nick;
    legendmod3.teamPlayers[h].skinID = Socket3data.nick;
    legendmod3.teamPlayers[h].skinURL = Socket3data.skin;
    legendmod3.teamPlayers[h].color = Socket3data.color;

    legendmod3.teamPlayers[h].lbgpi = -2;
    legendmod3.teamPlayers[h].x = Socket3data.x;
    legendmod3.teamPlayers[h].y = Socket3data.y;
    legendmod3.teamPlayers[h].alive = true;
    legendmod3.teamPlayers[h].mass = Socket3data.mass;
    legendmod3.teamPlayers[h].temp = true;
    legendmod3.teamPlayers[h].drawPosition = function() {};
	var tempTime = new Date().getTime();
	legendmod3.teamPlayers[h].lastUpdatedTime = tempTime;
}

function Socket3updateTeamPlayerPosition(Socket3data) {
    var h = legendmod3.checkPlayerID(Socket3data.id);
    if (!legendmod3.teamPlayers[h]) {
        return;
    }
    legendmod3.teamPlayers[h].x = Socket3data.x;
    legendmod3.teamPlayers[h].y = Socket3data.y;
    legendmod3.teamPlayers[h].mass = Socket3data.mass;
	legendmod3.teamPlayers[h].alive = true;
	var tempTime = new Date().getTime();	
	legendmod3.teamPlayers[h].lastUpdatedTime = tempTime;
}
function Socket3updateTeamPlayerDeath(Socket3data) {
	var h = legendmod3.checkPlayerID(Socket3data.id);	    
	legendmod3.teamPlayers[h].alive = false;
	legendmod3.teamPlayers[h].mass=1;	
}
function Socket3updateTeamPlayerCells(Socket3data) {
        var temp = Socket3data.playerCells;
		for (var i=0; i < legendmod3.teamPlayers.length; i++){
			if (legendmod3.teamPlayers[i].id == Socket3data.tid){
				for(var j=0; j< temp.length; j++){
					var ogariocellssetts = new legendmod1(temp[j].id + 1000000000, temp[j].x - legendmod.mapOffsetX, temp[j].y - legendmod.mapOffsetY, temp[j].size, legendmod3.teamPlayers[i].color, false, true, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
					ogariocellssetts.isVirus = false;	
					ogariocellssetts.fake = true;
					ogariocellssetts.targetNick = legendmod3.teamPlayers[i].nick;
					ogariocellssetts.nick = legendmod3.teamPlayers[i].nick;
					if (!ogariocellssetts.isInView()){
					legendmod.indexedCells[temp[j].id + 1000000000] = ogariocellssetts;	
					var ab=false;
					for (x=0;x<window.cellsFake.length;x++){
						if (window.cellsFake[x].id == ogariocellssetts.id){
							//window.cellsFake[x] = ogariocellssetts;
							window.cellsFake[x].targetX = temp[j].x - legendmod.mapOffsetX;
							window.cellsFake[x].targetY = temp[j].y - legendmod.mapOffsetY;
							window.cellsFake[x].mass = temp[j].mass;
							ab = true;
						}
					}
					if (ab == false){
						window.cellsFake.push(ogariocellssetts);
					}
					//window.cellsFake.push(ogariocellssetts);
					}			
				}
			}
		}
}
function timernow() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    return time;
}

//Socket3.send(JSON.stringify({ com: "death", id: customLMID}));
//Socket3.send(JSON.stringify({ com: "sendPlayerSkinURL", nick: ogarcopythelb.nick, token: legendmod3.serverToken, tag: ogarcopythelb.clanTag, skin: ogarcopythelb.skinURL, color: ogarcopythelb.color, id: customLMID, x: legendmod3.getPlayerX(), y: legendmod3.getPlayerY(), mass: legendmod.playerMass}));
//Socket3.send(JSON.stringify({ com: "pos", id: customLMID, x: legendmod3.getPlayerX(), y: legendmod3.getPlayerY(), mass: legendmod.playerMass}));

//sending commands
function Socket3MessageChat(chattypemsg, chatreader) {
    var temp={
        com: "chat",
        id: customLMID,
        nick: ogarcopythelb.nick,
        chat: chatreader,
        chattype: chattypemsg
    };
    Socket3.send(JSON.stringify({ "toH": "legendmod", "msg": temp}));
	
    //wss://connect.websocket.in does not send commands to sender again
    Socket3DisplaychatMsg(chattypemsg, customLMID, ogarcopythelb.nick, chatreader)
}

function Socket3DisplaychatMsg(b, c, x, d) {
    var time;
    timernow();
    legendmod3.displayChatMessage(time, b, c, x + ": " + d);
}

//enterChatMessage();					
function enterChatMessage2() {
    var t = $('#message-box');
    var e = $('#message');
    if (t.is(':visible')) {
        var o = e.val();
        o.length ? (Socket3MessageChat(101, o), legendmod.play && (e.blur(), t.hide())) : (e.blur(), t.hide()), e.val('');
		setTimeout(function() {
		t.hide();
		}, 10);
    } else {
        t.show();
        e.focus();
        e.val('');
    }
}
