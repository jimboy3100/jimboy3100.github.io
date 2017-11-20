/*************
 * LM Express v0.003 by Jimboy3100   email:jimboy3100@hotmail.com
 *************/
 
var semimodVersion = "01"; // the version 1.1-> 1.11
loadersetings();
loadericon();
PremiumUsers();
document.title = "Legend mod";
//Authenticate Mod Script
var accesstomod;
setTimeout(function() {
getaccesstoken();
getaccesstoken2();
}, 3000);
$("#gamemode").prop('disabled', false);
$("#region").prop('disabled', false);   		
var oldgamemode=$("#gamemode");
privateservutil();

var currentIP = "0.0.0.0:0";
var currentToken = "";
var previousMode = localStorage.getItem("gamemode");
var checkonlyonce = localStorage.getItem("checkonlyonce");
var defaultMusicUrl = "https://www.youtube.com/watch?v=L7klPYKTx64";
var coinTimer;
var musicPlayer;
var originalDeath;
var stateObj = {foo: "bar"};
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
var YoutubeAutoBtn = localStorage.getItem("YoutubeAutoBtn");
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
var realmode2 = "";
var mode=""; //just in case
var token = "";
var messageone = 1; //If legendmod is being used
var hiddenfromclan = 0;
var saveclanpassword= localStorage.getItem("saveclanpassword");
var troll1;
var seticon = "YES";
var setmessagecom = "YES";
var setyt = "YES";
var searching;
var timerId;
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
var detailed="";
var detailed1;
var userfirstname = localStorage.getItem("userfirstname");
var userlastname = localStorage.getItem("userlastname");
var usergender = localStorage.getItem("usergender");
var fbresponse={};
var prevPrivateServer = localStorage.getItem("prevPrivateServer");
var CopyTkPwLb2; 
var languagemod = localStorage.getItem("languagemod");
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
var Premadeletter53 = "Auto free coins";
var Premadeletter54 = "Stop free coins";
var Premadeletter55 = "Troll on Death";
var Premadeletter56 = "No troll on Death";
var Premadeletter57 = "Communication";
var Premadeletter58 = "Hidden";
var Premadeletter59 = "Visible";
var Premadeletter60 = "Pause";

languagemodfun();
appendLMhiFbPs();
if (realmode == "") {modebetter2 = ":ffa";} 
else {modebetter2 = realmode;}
LMserverbox();
privateserverpassword();
urlIpWhenOpened();
var minbtext2 = minbtext;
var minbtext3 = minbtext;
if (minbtext == null || minbtext == "") {
    minbtext = "Legend Mod"; //LM Express/Locked
    minbtext2 = "LM Express";
	minbtext3 = "LM Express/Private";
}
LMminimapTextAct();


function init(modVersion) {
	$("#ogario-party").wrap('<div style="display: none;" id="hidendivtoken"></div>');
	
    //var connectedbanner=0;
	$("#gamemode").prop('disabled', false);
	$("#region").prop('disabled', false);   

    if (timesopened != null) {
        timesopened++;
        localStorage.setItem("timesopened", timesopened);
    } else if (timesopened == null) {
        localStorage.setItem("timesopened", "0");
    }

    setTimeout(function() {
        document.title = "LM Express v" + modVersion;

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
		$('.btn.btn-warning.btn-spectate.btn-needs-server').after('<button onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout" data-toggle="tooltip" title="Logout"><span class="glyphicon glyphicon-off"></span></button>');
		$("#exp-bar").hide();
		$(".menu-tabs").children().attr("style", "width: 19.99%;");
		$(".profile-tab").hide();
 /*       $(".menu-tabs").children().attr("style", "width: 14.27%;");
		
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
			'<option value="7" data-itr="">Trad. Chinese - 繁體中文</option>' +

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
*/
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
			/*
        $("#leaderboard-hud").append('<div id="leaderboard-menu">' +
            '<a id="searchShortcut" class="btn btn-info" data-toggle="tooltip" data-placement="left" data-original-title="Join server (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;" data-toggle="tooltip" data-original-title="Search leaderboards" title=""><i class="fa fa-search fa-lg"></i></a>' +
            '<a id="copySIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP">Copy</a>' +
            '<a id="reconnectBtn" class="btn btn-info" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="' +
            'background-color: transparent;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; border: none;"><i class="fa fa-refresh fa-lg"></i></a>' +

            '<div id="dropDown3" class="hud" style="position: absolute; pointer-events: auto; width: 33%; left: 0px; padding: 0px; border-radius: 0px;">' +
            '<a id="lastIPBtn" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;>NEW</span>Join back</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>Connect to last IP you played</p>"><span class="glyphicon glyphicon-download-alt"></span></a>' +
            '</div>' +
            '<div id="dropDown2" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 90px; left: 67px; padding: 0px; border-radius: 0px;">' +
            '<a id="copySIPandPass" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP&Password">TK&PW</a>' +
            '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">Board</a>' +
            '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP, Password, Leaderboard...">TK&ALL</a>' +            
			'</div>' +
            '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30px; left: 67px; padding: 0px; border-radius: 0px;">' +
            '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Leaderboard (L)">Board</a>' +
//            '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP&Leaderboard">TK&PW&L</a>' +
            '</div>' +

            '<input id="tempCopy" style="display: none;" value="">' +
            '</div>');
			*/
        //$("#searchShortcut").mouseenter(function () {
        //$("#dropDown").hide();$("#dropDown3").show(100);$("#copySIPBtn").text("Copy");});
        $("#copySIPBtn").mouseenter(function() {
            $("#dropDown3").hide();
            $("#copySIPBtn").text("Token");
			if ($("#clantag").val()!=""){
				$("#dropDown2").show(100);
			}
            else {
				$("#dropDown").show(100);
				}
        });
        $("#leaderboard-menu").mouseleave(function() {
            $("#dropDown").hide();
			$("#dropDown2").hide();
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
                copy("http://agar.io/?r=" + region + "&m=" + realmode + "&search=ws://" + searchSip);
            } else {
                copy("http://agar.io/?r=" + $('#region').val() + "&m=" + realmode + "&search=ws://" + currentIP);
            }
        });

        $("#copySIPBtn").click(function() {
            if (searchSip != null) {
                if (realmode == ":party") {
                    copy("http://agar.io/#" + window.location.href.replace('http://agar.io/#',''));
                } else if (realmode != ":party") {
					if (region!=null&&realmode!=null){
                    copy("http://agar.io/?sip=" + searchSip + "&?r=" + region + "&m=" + realmode);
					}
					else{
					copy("http://agar.io/?sip=" + searchSip);	
					}
                }
            } else if (privateSrv==null) { //else if (searchSip != null && privateSrv==null)
                if (realmode == ":party") {
                    copy("http://agar.io/#" + window.location.href.replace('http://agar.io/#',''));
                } else if (realmode != ":party") {					
                    copy("http://agar.io/?sip=" + currentIP + "&?r=" + $('#region').val() + "&m=" + realmode);
                }
            }
			else if (privateSrv!=null) {
                    copy("http://agar.io/?ip=" + privateSrv + "&?SERVER=PRIVATE");                
            }
        });
        $("#copySIPandPass").click(function() {
            if (searchSip != null) {
                if (realmode == ":party") {
                    copy("http://agar.io/"+"?&pass=" + $("#clantag").val() + "#" + window.location.href.replace('http://agar.io/#',''));
                } else if (realmode != ":party") {
					if (region!=null&&realmode!=null){
                    copy("http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val() + "&?r=" + region + "&m=" + realmode);
					}
					else{
					copy("http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val());	
					}
                }
            } else if (privateSrv==null) { //else if (searchSip != null && privateSrv==null)
                if (realmode == ":party") {
                    copy("http://agar.io/"+"?&pass=" + $("#clantag").val() + "#" + window.location.href.replace('http://agar.io/#',''));
                } else if (realmode != ":party") {					
                    copy("http://agar.io/?sip=" + currentIP + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode);
                }
            }
			else if (privateSrv!=null) {
                    copy("http://agar.io/?ip=" + privateSrv + "&?pass=" + $("#clantag").val() + "&?SERVER=PRIVATE");                
            }
        });	
        $("#copySIPPassLB").click(function() {

            if (searchSip != null) {
                if (realmode == ":party") {
                    CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + "#" + window.location.href.replace('http://agar.io/#','');
					copyToClipboardAll();					
                } else if (realmode != ":party") {
					if (region!=null&&realmode!=null){
					CopyTkPwLb2="http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val() + "&?r=" + region + "&m=" + realmode;	
					copyToClipboardAll();
					}
					else{
					CopyTkPwLb2="http://agar.io/?sip=" + searchSip + "&?pass=" + $("#clantag").val();	
					copyToClipboardAll();
					}
                }
            } else if (privateSrv==null) { //else if (searchSip != null && privateSrv==null)
                if (realmode == ":party") {
					CopyTkPwLb2="http://agar.io/"+"?&pass=" + $("#clantag").val() + "#" + window.location.href.replace('http://agar.io/#','');
					copyToClipboardAll();
                } else if (realmode != ":party") {					
                    CopyTkPwLb2="http://agar.io/?sip=" + currentIP + "&?pass=" + $("#clantag").val() + "&?r=" + $('#region').val() + "&m=" + realmode;
					copyToClipboardAll();
                }
            }
			else if (privateSrv!=null) {
					CopyTkPwLb2="http://agar.io/?ip=" + privateSrv + "&?pass=" + $("#clantag").val() + "&?SERVER=PRIVATE"; 
					copyToClipboardAll();					
            }
        });			

        $("#reconnectBtn").click(function() {
            realmode=$("#gamemode").val();
			ogario.gameMode = realmode;
            hideMenu();
            changeServer();
            if (!$("#searchHud").is(':visible')) {
                delay(200, spectate);
		
            }
        });
	


        /*$("#createPartyBtn").click(function(){ hideMenu();$("#create-party-btn-2").click();if (!$("#searchHud").is(':visible')) {delay(200, spectate);}});*/
        $("#reconnectBtn").mouseenter(function() {
            $("#dropDown").hide();
			$("#dropDown2").hide();
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
			previousnickname=$("#nick").val();
			localStorage.setItem("previousnickname", previousnickname);
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
			if (privateSrv==null){
			saveclanpassword=$("#clantag").val();
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

		
		
		
        $("#boostButton").css("display", "inline-block");
        $("#massButton").css("display", "inline-block");
        $("#massButton").after($("#promo-badge-container"));

	    $(".agario-profile-name-container").after('<div class="TimesUsedPanel" align="right" display:inline-block;><h6><i>Times Used: ' + timesopened +
        '<br>LM Express by jimboy3100</i></h6></div>');
		$(".agario-profile-name").css('display', 'inline-block');
		$(".agario-profile-name").css('vertical-align', ' baseline');
		$(".agario-profile-name").before('<i id=ProfilePhotoCustom class="fa fa-clipboard" onclick="useProfilePhotoCustom();" aria-hidden="true" style="display: inline-block; margin-top: 0px; vertical-align: middle;" data-toggle="tooltip" data-title="Copy Account Image Url" data-placement="top"></i>');
				
		        //LM Express Cursors
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

        $(".agario-panel.ogario-yt-panel").css({
            marginBottom: "-10px"
        });
        $("#menu-footer").text("");
        $("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'legendWebsite\');" href="http://www.legendmod.ml" style="color: #ffffff;" data-toggle="tooltip" data-title="LM Express Website" data-placement="left">Legend Express v' + modVersion + semimodVersion + ' Beta</a></span>' +
            '<a href="https://legendmod.joomla.com/en/more-fps.html" data-toggle="tooltip" data-title="How to improve performance" data-placement="top" style ="font-size: 13px"; target="_blank">More FPS</a>');

        $("#menu-footer").after('<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" data-toggle="tooltip" data-title="Please support the development of Legend Mod" data-placement="left" target="_blank"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="CM3GDVCW6PBF6"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');

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
		
        console.log('%c Legend Mod, all rights reserved. %chttp://www.legendmod.ml', 'background: #1E1E1E; color: #FF0000', 'background: #FF0000; color: #FFFFFF');		
    }, 1500);
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
function loadersetings() {
    setTimeout(function() {
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
function loadericon() {
	//continue loadericon
    setTimeout(function() {
        setTimeout(function() {
        $("#imagebig").fadeOut(1500);
		setTimeout(function() {$("#imagebig").remove();}, 1600); //remove it
		}, 1000);   
		}, 100);
}
function PremiumUsers(){
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
		  accesstomod =  info[17];
			return accesstomod;
		}
	});
}

function getaccesstoken2() {
    setTimeout(function() {
        if(accesstomod != "a" && accesstomod != null){
			toastr["error"]('<b>[SERVER]:</b> You are using a wrong version of Legend Mod, <br>visit: <a target="_blank" href="https://jimboy3100.github.io/legendmod.user.js"><font color="yellow"><b><u>www.legendmod.ml</u></b></font></a><br>Legend mod will terminate now').css("width", "300px");
				setTimeout(function() {
					document.documentElement.innerHTML = "";
					}, 21000);
				}
   }, 13000);
}
function enableshortcuts() {
    if ($("#IPBtn").attr('aria-pressed') == "false") {
        $("#IPBtn").click();
    }
    if ($("#SHOSHOBtn").attr('aria-pressed') == "false") {
        $("#SHOSHOBtn").click();
    }
	if($("#MAINBTBtn").attr('aria-pressed') == "false"){
		$("#MAINBTBtn").click(); }
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



function languagemodfun(){
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
if (languagemod == 7) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/LanguagePackTraditionalChinese.js";
    $("body").append(s);
    setTimeout(function() {
        $('#legendlanguages').val("6");
        var s1 = document.createElement("script");
        s1.type = "text/javascript";
        s1.src = "https://jimboy3100.github.io/LanguagePackHandler.js";
        $("body").append(s1);
    }, 4000);
}
}

function appendLMhiFbPs(){
$("body").on('DOMNodeInserted', ".toast.toast-warning", function() {
    MSGCOMMANDS2 = $(".toast.toast-warning").html();
    if (MSGCOMMANDS2.includes("Welcome! You are connected to the OGARio")) {
		$("#gamemode").prop('disabled', false);
		$("#region").prop('disabled', false);   
		$(".toast.toast-warning").remove();
		setTimeout(function () {
				if (clanpass!=null&&clanpass!="") {		
					$("#clantag").val(clanpass);
					$('#clantag').css('background-color', '#ff6347');						
				}
				if (privateSrv!=null) {
					if ($('#clantag').val() == ""){
					if(privateSrv.includes("eu.fzogar.xyz:4000")){$("#clantag").val("PS1");} 
					else if(privateSrv.includes("eu.fzogar.xyz:4001")){$("#clantag").val("PS2");}
					else if(privateSrv.includes("eu.fzogar.xyz:5001")){$("#clantag").val("PS3");}
					else if(privateSrv.includes("eu.fzogar.xyz:5002")){$("#clantag").val("PS4");}
					else if(privateSrv.includes("sg.fzogar.xyz:4000")){$("#clantag").val("PS5");}
					else if(privateSrv.includes("sg.fzogar.xyz:4001")){$("#clantag").val("PS6");}
					else if(privateSrv.includes("in.fzogar.xyz:443")){$("#clantag").val("PS7");}
					else{$("#clantag").val("PS");}
					}
				}		
		$("#overlays").show();
		$(".center-container.ogario-menu").show();
		$(".side-container.right-container").show();
		$(".side-container.left-container").show();	
		},200);
		if($('#region>option:nth-child(1)').val()!=":PrS")	{
		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
		}
		//Save Name, Surname, Gender
		FB.api('/me', {fields: 'first_name, last_name, gender'}, function(response) {fbresponse=response; return fbresponse;});
		setTimeout(function (){ 
			userfirstname=fbresponse[Object.keys(fbresponse)[0]]; if (userfirstname!=null) {localStorage.setItem("userfirstname", userfirstname);}
			userlastname=fbresponse[Object.keys(fbresponse)[1]]; if (userlastname!=null) {localStorage.setItem("userlastname", userlastname);}
			usergender=fbresponse[Object.keys(fbresponse)[2]]; if (usergender!=null) {localStorage.setItem("usergender", usergender);}
			},250);
    }
	if (MSGCOMMANDS2.includes("You are using an old version of OGARio by")) {		
		$(".toast.toast-warning").html('<b>[SERVER]:</b> You are using a wrong version of Legend Mod, <br>visit: <a target="_blank" href="https://jimboy3100.github.io/legendmod.user.js"><font color="yellow"><b><u>www.legendmod.ml</u></b></font></a>');
	}
});


$("body").on('DOMSubtreeModified', "#chat-box", function() {
    MSGCOMMANDS3 = $(".command-text").text();
    if (MSGCOMMANDS3.includes("Welcome! You are connected to the OGARio by szymy server. Have a nice mass!")) {
		$("#gamemode").prop('disabled', false);
		$("#region").prop('disabled', false);   
	//	$(".toast.toast-warning").remove();
	        $(".command-text").text(Premadeletter0);
		setTimeout(function () {
		//spectate();
				if (clanpass!=null&&clanpass!="") {		
					$("#clantag").val(clanpass);
					$('#clantag').css('background-color', '#ff6347');						
				}
				if (privateSrv!=null) {
					if ($('#clantag').val() == ""){
					if(privateSrv.includes("eu.fzogar.xyz:4000")){$("#clantag").val("PS1");} 
					else if(privateSrv.includes("eu.fzogar.xyz:4001")){$("#clantag").val("PS2");}
					else if(privateSrv.includes("eu.fzogar.xyz:5001")){$("#clantag").val("PS3");}
					else if(privateSrv.includes("eu.fzogar.xyz:5002")){$("#clantag").val("PS4");}
					else if(privateSrv.includes("sg.fzogar.xyz:4000")){$("#clantag").val("PS5");}
					else if(privateSrv.includes("sg.fzogar.xyz:4001")){$("#clantag").val("PS6");}
					else if(privateSrv.includes("sg.fzogar.xyz:4002")){$("#clantag").val("PS7");}
					else{$("#clantag").val("PS");}
					}
				}			
		$("#overlays").show();
		$(".center-container.ogario-menu").show();
		$(".side-container.right-container").show();
		$(".side-container.left-container").show();			
		},200);

		if($('#region>option:nth-child(1)').val()!=":PrS")	{
		$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
		//Save Name, Surname, Gender
		FB.api('/me', {fields: 'first_name, last_name, gender'}, function(response) {fbresponse=response; return fbresponse;});
		setTimeout(function (){ 
			userfirstname=fbresponse[Object.keys(fbresponse)[0]]; if (userfirstname!=null) {localStorage.setItem("userfirstname", userfirstname);}
			userlastname=fbresponse[Object.keys(fbresponse)[1]]; if (userlastname!=null) {localStorage.setItem("userlastname", userlastname);}
			usergender=fbresponse[Object.keys(fbresponse)[2]]; if (usergender!=null) {localStorage.setItem("usergender", usergender);}
			},250);
		}		
    }
	if (MSGCOMMANDS3.includes("Welcome! You are connected to the OGARio by szymy server. Have a nice mass!")) {
	$(".command-text").text('You are using a wrong version of Legend Mod, visit: www.legendmod.ml');	
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
		
	

});
}

function privateservutil(){
//Private Servers
 $("#region").on('change', function() {
	setTimeout(function() {
	$("#gamemode").prop('disabled', false);
	$("#region").prop('disabled', false);                 
	}, 200);
	if (this.value == ":PrS") {
    console.log("Going to PrS");
        $("#gamemode").html('<select id="gamemode" class="form-control" required="" data-original-title="" title="">'+
		'<option value=":PrS0" data-itr="PrS0">-SELECT-</option>'+		
		'<option value=":PrS1" data-itr="PrS1">1vs1 Arena(1)</option>'+
		'<option value=":PrS2" data-itr="PrS2">1vs1 Arena(2)</option>'+
		'<option value=":PrS3" data-itr="PrS3">Party Server(1)</option>'+
//		'<option value=":PrS4" data-itr="PrS4">Party Server(2)</option>'+
//		'<option value=":PrS6" data-itr="PrS6">Instant Merge(1)</option>'+
//		'<option value=":PrS5" data-itr="PrS5">Instant Merge(2)</option>'+
		'<option value=":PrS7" data-itr="PrS7">Experimental</option>');
//		'<option value=":PrS8" data-itr="PrS8">Virus Mode</option>');
//		'<option value=":PrS9" data-itr="PrS9">Small Bots</option>');			
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
    else if (this.value == ":PrS6") {
    console.log("Going to PRS6");
	PrivateServer6();
    }
    else if (this.value == ":PrS7") {
    console.log("Going to PRS7");
	PrivateServer7();
    }
    else if (this.value == ":PrS8") {
    console.log("Going to PRS8");
	PrivateServer8();
    }
    else if (this.value == ":PrS9") {
    console.log("Going to PRS9");
	PrivateServer9();
    }		
});
}
function adres() {
	if ($("#gamemode").val() != ":party") {
		setTimeout(function(){		
			currentIP = "live-arena-"+$("#server-token").val()+".agar.io:80";
			$("#server").val(currentIP);
			setTimeout(function() {				 
			    realmode = $("#gamemode").val();
                if (privateSrv==null) {
                    if (realmode != ":party") {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                    }
                    else if (realmode == ":party") {
 //                       window.history.pushState(null, null, window.location.pathname);
//                        history.pushState(stateObj, "page 2", "#" + window.location.href.replace('http://agar.io/#',''));
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
                $("#server").val("#" + window.location.href.replace('http://agar.io/#',''));
            }, 2000);
        }
}
function privateserverpassword(){
setTimeout(function () {
		if (privateSrv!=null) {				
			$(".btn-spectate").click();
			prevPrivateServer=1;
			localStorage.setItem("prevPrivateServer", 1);
			return prevPrivateServer=1;						
        }
		else{
			if (prevPrivateServer=="1"){
				$("#clantag").val(saveclanpassword);
				prevPrivateServer=0;
				localStorage.setItem("prevPrivateServer", 0);
			return prevPrivateServer=0;
			}
		}
}, 6000);
}
function LMserverbox(){
setTimeout(function() {
    
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
					    var texture2, texture3;
                        texture3 = $("#server").val();
                        texture2 = texture3.replace("live-arena-", "");
						texture2 = texture2.replace(".agar.io:80", "");
						$("#server-token").val(texture2);
						$("#server-join").click();
                        setTimeout(function() {
                            realmode = $("#gamemode").val();
                            var tmz = $("#server").val();
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
                        }, 1000);
                    } else {
                        joinpartyfromconnect();
                    }

                });
            });
            setTimeout(function() {
			if (searchSip != null) {
			$("#server").val(searchSip);
			$("#connect2").click();
			}
			else{
			adres();}
            }, 2000);
            adres();
	
        })(window, window.jQuery);
    
}, 1500);		
}
function urlIpWhenOpened(){
setTimeout(function() {
        if (searchSip != null && privateSrv==null) {
            if (region == null) {
                setTimeout(function() {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip);
                }, 5000);
            } else {
               setTimeout(function() {
                    history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&?r=" + region + "&?m=" + realmode);
                }, 5000);
            }
        } else if (privateSrv==null) {
            if (realmode != ":party") {
                history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
            }
        }		
        $("#server-ws").on('change', function() {
			adres();
            setTimeout(function() {
                realmode = $("#gamemode").val();

                    if (realmode != ":party") {
                        history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&?r=" + $('#region').val() + "&?m=" + realmode);
                    }
                    else if (realmode == ":party") {
 //                       window.history.pushState(null, null, window.location.pathname);
 //                       history.pushState(stateObj, "page 2", "#" + window.location.href.replace('http://agar.io/#',''));
                    }
                             
                return realmode;
            }, 1000);
            setTimeout(function() {             
                lastIP = currentIP;
                localStorage.setItem("lastIP", lastIP);
            }, 10000);
        });
    }, //5000
    9000); //9000
}
function onhashchange(){return false}
function LMminimapTextAct(){
setTimeout(function() {LMminimapText();  }, 3000);
setTimeout(function() {LMminimapText();  }, 3500);
setTimeout(function() {LMminimapText();  }, 4000);
setTimeout(function() {LMminimapText();  }, 4500);
setTimeout(function() {LMminimapText();  }, 5500);
setTimeout(function() {LMminimapText();  }, 6000);
setTimeout(function() {LMminimapText();  }, 6500);
setTimeout(function() {LMminimapText();  }, 7000);
setTimeout(function() {LMminimapText();  }, 7500);

setTimeout(function() {   //Load Private Servers			
	if($('#region>option:nth-child(1)').val()!=":PrS")	{
	$('#region').prepend('<option value=":PrS" data-itr="PrS">Private Servers</option>');	
	}	
}, 13000);
setTimeout(function() {LMminimapText();}, 11000);
setTimeout(function() {LMminimapText();}, 12000);
setTimeout(function() {LMminimapText();}, 18000);
setTimeout(function() {LMminimapText();}, 22000);
}
function LMminimapText(){
	var c = document.getElementById("minimap-sectors");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height / 9);
    ctx.font = "16px Georgia";
    if (searchSip != null) { ctx.fillText(minbtext, c.width / 2, 22) }
	else if (privateSrv!=null) {ctx.fillText(minbtext3, c.width / 2, 22);}
	else {ctx.fillText(minbtext2, c.width / 2, 22); }	
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

function searchTKHandler(searchStr) {
    searchStr = searchStr.trim();

    if (searchStr.startsWith("http://agar.io/#")) {		
        joinToken(searchStr.replace("http://agar.io/#", ""));
		realmodereturn();
		
    } else if (searchStr.startsWith("agar.io/#")) {
		joinToken(searchStr.replace("agar.io/#", ""));	
		realmodereturn();
    } else {
        return false;
    }
    return true;	
}
function realmodereturn(){
		realmode = $("#gamemode").val();
		return realmode;
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
    }, 1500); //weird
    if (!searching) {
        if ($.trim(searchIP) == '') {} else {
            showCancelSearch();
            searching = true;
            var interval = 1800;
            var maxTries = 4;
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
//                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
					if (MC.isInGame() == true || numAttempts == maxAttempts) {
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
            var maxTries = 4;
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

                //    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
					if (MC.isInGame() == true || numAttempts == maxAttempts) {	
						
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
