//Dying Light Extension For Legend Mod
//By Jimboy3100
//v2.01
var timeslost=0;
var usedonce=0;
var usedonce1=1;
var usedonce2=0;
var usedonce3=1;

if(dyinglight1load==null||dyinglight1load=="null"){
toastr["warning"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightbanner.jpg); color:#018cf6; font-size:16px; text-align:center">Are you sure you want to load Dying Light Template?<br>Save your Settings on a file, because they will be lost.<br>' + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-DyingLight" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">'+ Premadeletter25 + '</button></div>', "", { timeOut: 20000, extendedTimeOut: 20000 }).css("width", "300px");	
playSound("https://legendmod.ml/banners/dyinglingsong5.mp3");
$(".btn.btn-sm.btn-primary.btn-play.btn-do-DyingLight").click(function () { acceptedDying(); });	
}

function acceptedDying(){
	dyinglight1load="yes";
	localStorage.setItem("dyinglight1load", dyinglight1load);
	dyinglighttemplate();
}

//setTimeout(function () {
function dyinglighttemplate(){
localStorage.setItem("musicUrl", "https://www.youtube.com/watch?v=jL6ckpJ7K7E");
	
$("#minbtext").val("The Map");
$("#minbtext").blur();
$("#leadbtext").val("The Most Dead");
$("#leadbtext").blur();
$("#teambtext").val("The Alive");
$("#teambtext").blur();
$("#imgUrl").val("https://legendmod.ml/banners/dyinglightbanner2.jpg");
$("#imgUrl").blur();
$("#imgHref").val("http://dyinglightgame.com/buy/?mainsite");
$("#imgHref").blur();
//load dying light icons
$("#pic1url").val("http://i.imgur.com/5jIjJVc.gif").blur();$("#pic1data").val("Volatile Attack").blur();
$("#pic2url").val("http://i.imgur.com/5zLjitu.gif").blur();$("#pic2data").val("Screamer").blur();
$("#pic3url").val("https://i.imgur.com/zxdXe9o.gif").blur();$("#pic3data").val("Killing Volatile").blur();
$("#pic4url").val("http://i.imgur.com/LpFoDbK.gif").blur();$("#pic4data").val("Too weak to kill").blur();
$("#pic5url").val("http://i.imgur.com/l2RhyAf.gif").blur();$("#pic5data").val("Talking zombie").blur();
//load dying light youtube
$("#yt1url").val("https://www.youtube.com/watch?v=jL6ckpJ7K7E").blur();$("#yt1data").val("Dying Light Song").blur();
$("#yt2url").val("https://www.youtube.com/watch?v=0J9-PapbMBI").blur();$("#yt2data").val("Super Aggressive Zombies").blur();
$("#yt3url").val("https://www.youtube.com/watch?v=Ej8LUO9P7Sw").blur();$("#yt3data").val("Finishing Moves Night Hunter").blur();
$("#yt4url").val("https://www.youtube.com/watch?v=4_KEV0tBKDc").blur();$("#yt4data").val("Volatile Massacre").blur();
$("#yt5url").val("https://www.youtube.com/watch?v=gbNiUIz43G0").blur();$("#yt5data").val("End Game 3rd Person").blur();

window.history.pushState(null, null, window.location.pathname);	

	setTimeout(function () {
$("#import-settings-btn").attr('class', 'btn btn-success');document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Dont W or Split too much! We dont want to get ANTI","comm2":"Split him! Stick to the Viruses!","comm3":"I am not ANTI. You can give me mass!","comm4":"I am ANTI. Do NOT give me mass!","comm5":"%currentSector%!","comm6":"Need backup at %currentSector%!","comm7":"Enemy spotted at %currentSector%!","comm8":"Tricksplit!","comm9":"[img]http:\/\/i.imgur.com\/TC7VFYr.gif[\/img]","comm0":"Dont Ally with them!","comm10":"They are Allies!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"Jade Aldemir","clanTag":"","skinURL":"https:\/\/static.wikia.nocookie.net\/dfe0c1ac-fc99-43fa-995e-e4e061e3c543","color":"#01d9cc"},{"nick":"Harris Brecken","clanTag":"","skinURL":"https:\/\/static.wikia.nocookie.net\/bf12e035-22f2-4669-8641-8c364415f467","color":"#01d9cc"},{"nick":"Bilal","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/a\/a8\/Bilal.jpg\/revision\/latest\/scale-to-width-down\/1000?cb=20160309120407","color":"#01d9cc"},{"nick":"Kadir Suleiman","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/6\/6b\/Dying_light_kadir_suleiman.png\/revision\/latest?cb=20170617025124","color":"#01d9cc"},{"nick":"Rahim Aldemir","clanTag":"","skinURL":"https:\/\/static.wikia.nocookie.net\/cd4fba5a-37b1-4c7d-8bff-da33c848f265","color":"#01d9cc"},{"nick":"Lena","clanTag":"","skinURL":"https:\/\/static.wikia.nocookie.net\/f89f8973-9f9e-42c2-a71b-05f645775f0a","color":"#01d9cc"},{"nick":"Spike","clanTag":"","skinURL":"https:\/\/static.wikia.nocookie.net\/136ccd17-575c-41ff-8efa-e3ab5a0c8517","color":"#01d9cc"},{"nick":"Kyle Crane","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/8\/82\/Kylecrane.jpg\/revision\/latest?cb=20170725233444","color":"#01d9cc"},{"nick":"Harran","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/c\/c3\/Harran.jpg\/revision\/latest?cb=20150203085024","color":"#01d9cc"},{"nick":"Screamer","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/9\/97\/ScreamerRender.jpg\/revision\/latest?cb=20151022113104","color":"#01d9cc"},{"nick":"Night Hunter","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/e\/e3\/DL_Night_Hunter.png\/revision\/latest?cb=20160515002414","color":"#01d9cc"},{"nick":"Demolisher","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/2\/2d\/DL_Demolisher.png\/revision\/latest?cb=20160515001128","color":"#01d9cc"},{"nick":"Volatile","clanTag":"","skinURL":"https:\/\/vignette.wikia.nocookie.net\/dyinglight\/images\/d\/dc\/Evolved_Volatile.png\/revision\/latest\/scale-to-width-down\/1000?cb=20160226225815","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"https:\/\/legendmod.ml\/banners\/testvideodyinglight.mp4","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"https:\/\/legendmod.ml\/banners\/testvideodyinglight2.mp4","color":"#01d9cc"}],"ogarioSettings":{"isAlphaChanged":false,"jellyPhisycs":true,"virusSound":false,"quickResp":true,"autoResp":false,"autoZoom":false,"autoHideNames":false,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":false,"hideTeammatesNames":false,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":true,"universalChat":true,"customSkins":true,"videoSkins":true,"videoSkinsMusic":false,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":true,"showBgSectors":false,"showMapBorders":true,"showGhostCells":false,"showGhostCellsInfo":false,"showPartyBots":false,"showMiniMap":true,"rotateMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"showExtraMiniMapGuides":true,"showMiniMapGhostCells":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":true,"oppColors":true,"oppRings":true,"virColors":true,"splitRange":true,"qdsplitRange":true,"sdsplitRange":false,"virusesRange":true,"textStroke":false,"namesStroke":false,"massStroke":true,"cursorTracking":false,"FBTracking":true,"teammatesInd":true,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"coloredNicks":false,"hideChat":false,"chatSounds":true,"chatEmoticons":true,"showChatBox":false,"hidecountry":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showLbData":true,"showTime":false,"centeredLb":true,"fpsAtTop":true,"tweenMaxEffect":true,"top5skins":true,"showStats":true,"showStatsMass":true,"showStatsESTE":false,"showStatsEMTE":false,"showStatsMTE":false,"showStatsSTE":true,"showStatsTTE":false,"showStatsPTE":false,"showStatsN16":true,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showQuickBots":false,"showSkinsPanel":true,"animation":140,"macroFeeding":80,"profileNumber":15,"cameraSpeed":7,"commanderDelay":1000,"suckAnimation":false,"virusGlow":true,"borderGlow":true,"limLB":10,"limTP":5,"teamView":false,"zoomSpeedValue2":-0.13,"leaderboardlimit":20,"teamboardlimit":20,"messageSound":"http:\/\/cdn.ogario.ovh\/static\/sounds\/notification_01.mp3","commandSound":"https:\/\/jimboy3100.github.io\/banners\/dyinglingsong2.wav","virusSoundurl":"https:\/\/legendmod.ml\/sounds\/sound-gunshot.mp3","soundSplit":"https:\/\/www.myinstants.com\/media\/sounds\/quack_5.mp3","FacebookIDs":""},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000000","bordersColor":"#6e0909","borderGlowColor":"#e126ff","gridColor":"#1c1e1f","sectorsColor":"#00243e","namesColor":"#ffffff","namesStrokeColor":"#000000","massColor":"#ffffff","massStrokeColor":"#000000","virusColor":"#00523e","virusStrokeColor":"#178a5a","mVirusColor":"#ce6363","mVirusStrokeColor":"#b95959","foodColor":"#0038ff","teammatesIndColor":"#ffffff","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","enemyBSTEDColor":"#8000ff","enemyBSTEColor":"#BE00FF","enemyBColor":"#FF0A00","enemySColor":"#00C8FF","enemySSTEColor":"#048245","enemySSTEDColor":"#64FF00","ghostCellsColor":"#ffffff","safeAreaColor":"#ffffff","dangerAreaColor":"#bf00aa","namesFont":"roboto","namesFontFamily":"Roboto","namesFontWeight":400,"massFont":"roboto","massFontFamily":"Roboto","massFontWeight":400,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"namesScale":1,"massScale":3,"virMassScale":3,"strokeScale":1,"foodSize":5,"bordersWidth":14,"sectorsWidth":40,"sectorsFontSize":200,"cellsAlpha":0.9,"skinsAlpha":0.99,"virusAlpha":0.6,"textAlpha":1,"backgroundAlpha":0.6,"virusGlowColor":"#6e0909","virusGlowSize":14,"borderGlowSize":40,"ghostCellsAlpha":0.3,"virusStrokeSize":14,"menuPreset":"ogario-v3","graphics":"high","menuMainColor":"#fafafa","menuBtnTextColor":"#ffffff","menuPanelColor":"#373838","menuPanelColor2":"#4d4c4c","menuTextColor":"#ffffff","menuTextColor2":"#000000","btn1Color":"#018cf6","btn1Color2":"#151a1f","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#960000","btn4Color2":"#19233b","menuBg":"https:\/\/jimboy3100.github.io\/banners\/dyinglightbackhub.jpg","menuOpacity":0.95,"hudMainColor":"#5b67d1","hudColor":"rgba(255,0,0,0.4)","hudTextColor":"#c9c9c9","statsHudColor":"#afafb3","timeHudColor":"#0b2120","top5MassColor":"#ff0000","lbMeColor":"#f2f0f2","lbTeammateColor":"#1f5431","hudFont":"shojumaru-bold","hudFontFamily":"Shojumaru","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#ffffff","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#163ec9","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapGhostCellsColor":"#ffffff","color":"#fff","customServerImage1":"https:\/\/legendmod.ml\/banners\/IconCustomServer1.png","commanderImage":"https:\/\/legendmod.ml\/banners\/drawCommander.png","commanderImage1":"https:\/\/legendmod.ml\/banners\/drawCommander1.png","commanderImage2":"https:\/\/legendmod.ml\/banners\/drawCommander2.png","commanderImage3":"https:\/\/legendmod.ml\/banners\/drawCommander3.png","commanderImage4":"https:\/\/legendmod.ml\/banners\/drawCommander4.png","commanderImage5":"https:\/\/legendmod.ml\/banners\/drawCommander5.png","commanderImage6":"https:\/\/legendmod.ml\/banners\/iconJustWatchPro.png","commanderImageDyingLight":"https:\/\/legendmod.ml\/banners\/icondyinglightzombie.png","commanderImageDyingLightvirus":"https:\/\/legendmod.ml\/banners\/icondyinglightvirus.png","miniMapFont":"shojumaru-bold","miniMapFontFamily":"Shojumaru","miniMapFontWeight":700,"miniMapNickFont":"shojumaru-bold","miniMapNickFontFamily":"Shojumaru","miniMapNickFontWeight":700,"miniMapWidth":226,"miniMapTop":23,"miniMapSectorsOpacity":0.66,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"miniMapGhostCellsAlpha":0.15,"customBackground":"https:\/\/legendmod.ml\/banners\/dyinglightback8.jpg","customCursor":"https:\/\/legendmod.ml\/cursors\/cursor_14.cur"},"legendSettings":{"previousMode":"null","checkonlyonce":"true","previousnickname":"Jade Aldemir","showToken":"null","showPlayer":"null","SHOSHOBtn":"true","XPBtn":"true","MAINBTBtn":"true","AnimatedSkinBtn":"true","TIMEcalBtn":"false","troll1Btn":null,"ComPosition":"null","autoCoinBtn":"null","timesopened":"114","saveclanpassword":"","dyinglight1load":"yes","languagemod":"1","prevPrivateServer":"null","initialMusicUrl":"https:\/\/www.youtube.com\/watch?v=jL6ckpJ7K7E","spawnspecialeffectsSaved":"null","AnimatedRainbowColorSaved":"false","lastIP":"2lranf","note1":"","note2":"","note3":"","note4":"","note5":"","note6":"","note7":"","minimapbckimg":"","teambimg":"","canvasbimg":"","leadbtext":"The Most Dead","leadbimg":"","teambtext":"The Alive","imgUrl":"https:\/\/legendmod.ml\/banners\/dyinglightbanner2.jpg","imgHref":"http:\/\/dyinglightgame.com\/buy\/?mainsite","minbtext":"The Map","pic1urlimg":"http:\/\/i.imgur.com\/5jIjJVc.gif","pic2urlimg":"http:\/\/i.imgur.com\/5zLjitu.gif","pic3urlimg":"https:\/\/i.imgur.com\/zxdXe9o.gif","pic4urlimg":"http:\/\/i.imgur.com\/LpFoDbK.gif","pic5urlimg":"http:\/\/i.imgur.com\/l2RhyAf.gif","pic6urlimg":"","yt1urlimg":"jL6ckpJ7K7E","yt2urlimg":"0J9-PapbMBI","yt3urlimg":"Ej8LUO9P7Sw","yt4urlimg":"4_KEV0tBKDc","yt5urlimg":"gbNiUIz43G0","yt6urlimg":"","pic1dataimg":"Volatile Attack","pic2dataimg":"Screamer","pic3dataimg":"Killing Volatile","pic4dataimg":"Too weak to kill","pic5dataimg":"Talking zombie","pic6dataimg":"","yt1dataimg":"Dying Light Song","yt2dataimg":"Super Aggressive Zombies","yt3dataimg":"Finishing Moves Night Hunter","yt4dataimg":"Volatile Massacre","yt5dataimg":"End Game 3rd Person","yt6dataimg":"","discwebhook1":"","discwebhook2":"","Userscript1":"","Userscript2":"","Userscript3":"","Userscript4":"","Userscript5":"","Userscripttexture1":"","Userscripttexture2":"","Userscripttexture3":"","Userscripttexture4":"","Userscripttexture5":""}}';
	$('#import-settings-btn').click();
	}, 100);
}

if(dyinglight1load=="yes"){



$("#musicUrl").val("https://www.youtube.com/watch?v=9iDYnAireiw");
//musicPlayer.setVolume("25");
setTimeout(function () {
btnmgs();
$('*[data-itr="page_play"]').click(function() {
	olddeath2();
	if (usedonce3==1){
	if (typeof YT !== 'undefined') {
	musicPlayer.playVideo();
	}
	launchIntoFullscreen(document.documentElement);	
	}
	return usedonce3=0;
});
}, 2000);

$("#leaderboard-positions").css('background-image', 'url(" http://rs437.pbsrc.com/albums/qq95/anuksanamoon27/HALLOWEEN/f76e322d.png~c200 ")');


setTimeout(function () {$("#playerBtn").focusout();}, 2100);
	

toastr["error"]('To disable Dying Light, click the icon "Dying light" on the <b><font color="blue">API</font></b> tab!').css("width", "350px");
toastr["error"]('Suggested to PLAY song of the <b><font color="blue">(YOUTUBE) last </font></b> tab!').css("width", "350px");

$("#minimap-sectors").css('background-image', 'url(https://legendmod.ml/banners/dyinglightbabyteamboard.png)');	
$("#log").css('background-image', 'url(" https://legendmod.ml/banners/dyinglightother1.jpg ")');
$("#openfl-content").css('background-image', 'url("https://legendmod.ml/banners/dyinglightother2.jpg")');
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback0.jpg";
aab();
}	
function aab(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback0.jpg";		
aab2();
}, 30000);}
function aab2(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback1.jpg";
aab3();
}, 30000);}
function aab3(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback2.jpg";
aab4();
}, 60000);}
function aab4(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback3.jpg";
aab5();
}, 60000);}
function aab5(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback4.jpg";
aab6();
}, 60000);}
function aab6(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback5.jpg";
aab7();
}, 60000);}
function aab7(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback6.jpg";
aab8();
}, 60000);}
function aab8(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback7.jpg";
aab9();
}, 60000);}
function aab9(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback8.jpg";
aab10();
}, 60000);}
function aab10(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback9.jpg";
aab11();
}, 60000);}
function aab11(){
setTimeout(function () {
defaultSettings.customBackground="https://legendmod.ml/banners/dyinglightback10.jpg";
aab();
}, 60000);}
/*
function aab12(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://legendmod.ml/banners/dyinglightback11.jpg)');	
aab();
}, 60000);}
*/


function stopdyinglight(){
	localStorage.setItem("musicUrl", defaultMusicUrl);
	$("#minimapPicture").val("").blur();
	$("#minbtext").val("").blur();
	$("#leadbtext").val("").blur();
	$("#teambtext").val("").blur();
	$("#imgUrl").val("").blur();
	$("#imgHref").val("").blur();	
//unload dying light icons
	$("#pic1url").val("").blur();$("#pic1data").val("").blur();
	$("#pic2url").val("").blur();$("#pic2data").val("").blur();
	$("#pic3url").val("").blur();$("#pic3data").val("").blur();
	$("#pic4url").val("").blur();$("#pic4data").val("").blur();
	$("#pic5url").val("").blur();$("#pic5data").val("").blur();
//unload dying light youtube
	$("#yt1url").val("").blur();$("#yt1data").val("").blur();
	$("#yt2url").val("").blur();$("#yt2data").val("").blur();
	$("#yt3url").val("").blur();$("#yt3data").val("").blur();
	$("#yt4url").val("").blur();$("#yt4data").val("").blur();
	$("#yt5url").val("").blur();$("#yt5data").val("").blur();	
	
	dyinglight1load=null;
	localStorage.setItem("dyinglight1load", dyinglight1load);
	setTimeout(function () {
	legenddefaultsettings();
	}, 100);
}


function olddeath2() {
$("#minimap-sectors").css('background-image', 'url(https://i.imgur.com/5jIjJVc.gif)');		
setTimeout(function () {
$("#minimap-sectors").css('background-image', 'url(https://legendmod.ml/banners/dyinglightbabyteamboard.png)');		
}, 20000);
if(timeslost==0){playSound("https://legendmod.ml/banners/dyinglingsong3.mp3");
toastr["error"](" !!!").css("width", "200px");	
}
if(timeslost==1){
playSound("https://legendmod.ml/banners/dyinglingsong4.mp3");
toastr["error"]("This is IO speaking, get to the nearest safe house and wait until dawn. Good night, and good luck!").css("width", "400px");	
}
if(timeslost==2){playSound("https://legendmod.ml/banners/dyinglingsong6.mp3");
toastr["error"](" You get antozine when I say you get it, not one second before!").css("width", "400px");	
}

timeslost++;
if(timeslost==3){timeslost=0;}
}

    // listen for server disconnect
	

function olddisconnect() {	
		
		playSound("https://legendmod.ml/banners/dyinglingsong7.mp3");
//		toastr["error"]("Disconnected :(");
		toastr["error"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightother8.jpg); color:#018cf6; font-size:16px; text-align:center"><br><b>Well, you not only did the job Karim, must of you, but you made it back in one piece.<br> Bravo!<br> Did you think I would be satisfied so easily? Is still plenty to prove!<br><font color="yellow">Server Changed </font></b> </div>').css("width", "400px");		   
};
	
//MC.__onDisconnect = MC.onDisconnect;
//MC.__onPlayerDeath = MC.onPlayerDeath;
setTimeout(function () {
//MC.onPlayerDeath = joint([ MC.__onPlayerDeath, olddeath2 ]);

core._disconnect= core.disconnect;
core.disconnect= function () {
            core._disconnect();
			if(usedonce1==0){
			olddisconnect();
			usedonce1=1;
			}
}
//MC.onDisconnect = joint([ MC.__onDisconnect, olddisconnect ]);
}, 3000);	

//	$(".agario-profile-picture").click(function () {
//		if(usedonce1==0){
//	playSound("https://legendmod.ml/banners/dyinglighsong8.mp3");	
//	toastr["error"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightother4.jpg); color:#018cf6; font-size:16px; text-align:center"><br><b>Kurnell Tanner and the ministry of defence have lied to you!</b> </div>').css("width", "300px");
//		usedonce1=1;
//		}});
function btnmgs() {	
	$("#copySIPBtn").click(function () {
		if(usedonce==0){
		playSound("https://legendmod.ml/banners/dyinglightsong10.mp3");			
		toastr["error"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightother8.jpg); color:#018cf6; font-size:16px; text-align:center"><br><b>The creation of ones own rules, <font color="red">THAT</font> is what makes a man!<br> Do you live by your own rules Krane? <br>Or are you merely someone elses puppet??? </b> </div>').css("width", "400px");	
		usedonce=1;
		}});
	$("#server-join").click(function () {
		if(usedonce==0){
		playSound("https://legendmod.ml/banners/dyinglightsong10.mp3");			
		toastr["error"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightother8.jpg); color:#018cf6; font-size:16px; text-align:center"><br><b>The creation of ones own rules, <font color="red">THAT</font> is what makes a man!<br> Do you live by your own rules Krane? <br>Or are you merely someone elses puppet??? </b> </div>').css("width", "400px");	
		usedonce=1;
		}});	
	$('*[data-itr="page_spectate"]').click(function () {
		if(usedonce2==0){
		playSound("https://legendmod.ml/banners/dyinglightsong9.mp3");	
toastr["error"]('<div id="tutorial" style="background-image: url(https://legendmod.ml/banners/dyinglightother7.jpg); color:#018cf6; font-size:16px; text-align:center"><br><b>I am researching traces of the prophecy about the god of the sun in the relics of local culture. It seems like a matter of life and death to the mother, and I am in no position to ask why</b> </div>').css("width", "400px");			usedonce2=1;
		}});
}		
//toastr["error"](" Well, you not only did the job Karim, must of you, but you made it back in one piece. Bravo! Did you think I would be satisfied so easily? Is still plenty to prove!").css("width", "400px");		


/*toastr["error"]('<div id="tutorial" style="background-image: url(http://vignette2.wikia.nocookie.net/dyinglight/images/3/3d/Kadir_Slueiman.jpg/revision/latest?cb=20141214090451.jpg); color:#018cf6; font-size:16px; text-align:center"><b>The creation of ones own rules, THAT is what makes a man! Do you live by your own rules Krane? Or are you merely someone elses puppet??? </b> </div>').css("width", "300px");
$("#openfl-content").css('background-image', 'url("http://static.gosunoob.com/img/1/2015/03/Dying_Light_1_5_National_Outfits.jpg")');
$("#log").css('background-image', 'url(" https://pbs.twimg.com/media/DDkK94TWAAA-8bt.jpg ")');
http://www.clker.com/cliparts/T/X/h/3/B/Z/simple-paint-splatter.svg;


function opendyinglight2() {
//toastr["info"]("Function is not ready yet");	
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/dyinglight2.js";
    $("body").append(s);
	
}
*/
function legenddefaultsettings() {
    if (dyinglight1load == null || dyinglight1load == "null") {
        $("#import-settings-btn").attr('class', 'btn btn-success');
        document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Feed me!","comm2":"Split into me!","comm3":"Need backup at %currentSector%!","comm4":"Enemy spotted at %currentSector%!","comm5":"Need a teammate!","comm6":"Tank the virus!","comm7":"Eat the virus!","comm8":"Lets bait!","comm9":"Fake tricksplit!","comm0":"Fuck!","comm10":"Tricksplit!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"Profile #1","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #2","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #3","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #4","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #5","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #6","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #7","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #8","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #9","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #10","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":true,"autoHideNames":true,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":true,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":false,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":false,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":false,"oppColors":false,"oppRings":false,"virColors":false,"splitRange":false,"virusesRange":false,"textStroke":false,"namesStroke":false,"massStroke":false,"cursorTracking":true,"teammatesInd":false,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":true,"normalLb":false,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":false,"showStatsN16":false,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"zoomSpeedValue":0.9},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000a11","gridColor":"#00243e","bordersColor":"#01d9cc","foodColor":"#5000ff","virusColor":"#002f52","virusStrokeColor":"#00b9e8","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","teammatesIndColor":"#ffffff","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"animation":140,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.9,"skinsAlpha":0.99,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#01d9cc","menuBtnTextColor":"#ffffff","menuPanelColor":"#00243e","menuPanelColor2":"#002f52","menuTextColor":"#ffffff","menuTextColor2":"#8096a7","btn1Color":"#018cf6","btn1Color2":"#0176ce","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#bf00aa","btn4Color2":"#a80096","menuBg":"http://cdn.ogario.ovh/static/img/pattern.png","menuOpacity":0.96,"hudMainColor":"#01d9cc","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#01d9cc","top5MassColor":"#bf00aa","lbMeColor":"#bf00aa","lbTeammateColor":"#018cf6","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#01d9cc","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":240,"miniMapTop":24,"miniMapSectorsOpacity":0.1,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"https://legendmod.ml/cursors/cursor_02.cur"}}'
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
            document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Feed me!","comm2":"Split into me!","comm3":"Need backup at %currentSector%!","comm4":"Enemy spotted at %currentSector%!","comm5":"Need a teammate!","comm6":"Tank the virus!","comm7":"Eat the virus!","comm8":"Lets bait!","comm9":"Fake tricksplit!","comm0":"Fuck!","comm10":"Tricksplit!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"Profile #1","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #2","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #3","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #4","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #5","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #6","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #7","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #8","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #9","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #10","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #11","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #12","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #13","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #14","clanTag":"","skinURL":"","color":"#01d9cc"},{"nick":"Profile #15","clanTag":"","skinURL":"","color":"#01d9cc"}],"ogarioSettings":{"positionClass":"toast-bottom-left","isAlphaChanged":false,"jellyPhisycs":false,"virusSound":false,"quickResp":true,"autoResp":false,"spawnSpecialEffects":false,"animatedRainbowColor":false,"autoZoom":false,"autoHideNames":true,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":false,"hideTeammatesNames":false,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":true,"universalChat":true,"customSkins":true,"videoSkins":true,"videoSkinsMusic":false,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":true,"showBgSectors":false,"showMapBorders":true,"showGhostCells":false,"showGhostCellsInfo":false,"showPartyBots":false,"showMiniMap":true,"rotateMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"showExtraMiniMapGuides":true,"showMiniMapGhostCells":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":true,"oppColors":true,"oppRings":true,"virColors":false,"splitRange":false,"qdsplitRange":true,"sdsplitRange":false,"virusesRange":false,"textStroke":false,"namesStroke":true,"massStroke":true,"cursorTracking":false,"FBTracking":true,"teammatesInd":true,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"coloredNicks":false,"hideChat":false,"chatSounds":true,"chatEmoticons":true,"showChatBox":false,"hidecountry":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showLbData":true,"showTime":false,"centeredLb":true,"fpsAtTop":true,"tweenMaxEffect":false,"top5skins":true,"showStats":true,"showStatsMass":true,"showStatsESTE":false,"showStatsEMTE":false,"showStatsMTE":false,"showStatsSTE":false,"showStatsTTE":false,"showStatsPTE":false,"showStatsN16":true,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showQuickBots":false,"showSkinsPanel":true,"animation":120,"macroFeeding":80,"profileNumber":15,"cameraSpeed":7,"commanderDelay":1000,"suckAnimation":false,"virusGlow":false,"borderGlow":false,"limLB":10,"limTP":5,"teamView":false,"zoomSpeedValue2":-0.13,"leaderboardlimit":20,"teamboardlimit":20,"messageSound":"https:\/\/legendmod.ml\/sounds\/notification_01.mp3","commandSound":"https:\/\/legendmod.ml\/sounds\/chat-message.mp3","virusSoundurl":"https:\/\/legendmod.ml\/sounds\/sound-gunshot.mp3","soundSplit":"https:\/\/www.myinstants.com\/media\/sounds\/quack_5.mp3","FacebookIDs":""},"ogarioThemeSettings":{"checkonetimeLc":false,"chatPos":"bottomleft","preset":"legendv2","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000a11","bordersColor":"#d90101","borderGlowColor":"#ffffff","gridColor":"#00243e","sectorsColor":"#00243e","namesColor":"#ffffff","namesStrokeColor":"#000000","massColor":"#ffffff","massStrokeColor":"#000000","virusColor":"#327a19","virusStrokeColor":"#327a19","mVirusColor":"#ce6363","mVirusStrokeColor":"#b95959","foodColor":"#0057ff","teammatesIndColor":"#ffffff","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","enemyBSTEDColor":"#8000ff","enemyBSTEColor":"#BE00FF","enemyBColor":"#FF0A00","enemySColor":"#00C8FF","enemySSTEColor":"#048245","enemySSTEDColor":"#64FF00","ghostCellsColor":"#ffffff","safeAreaColor":"#ffffff","dangerAreaColor":"#bf00aa","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"massFont":"ubuntu-bold","massFontFamily":"Ubuntu","massFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"namesScale":1,"massScale":3,"virMassScale":3,"strokeScale":1,"foodSize":5,"bordersWidth":14,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.99,"skinsAlpha":0.99,"virusAlpha":0.6,"textAlpha":1,"backgroundAlpha":0.6,"virusGlowColor":"#fff","virusGlowSize":14,"borderGlowSize":14,"ghostCellsAlpha":0.3,"virusStrokeSize":14,"menuPreset":"legendv2","graphics":"high","menuMainColor":"#01d9cc","menuBtnTextColor":"#ffffff","menuPanelColor":"#00243e","menuPanelColor2":"#002f52","menuTextColor":"#ffffff","menuTextColor2":"#8096a7","btn1Color":"#018cf6","btn1Color2":"#0176ce","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#bf00aa","btn4Color2":"#a80096","menuBg":"https:\/\/legendmod.ml\/banners\/static\/img\/pattern.png","menuOpacity":0.96,"hudMainColor":"#01d9cc","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#01d9cc","top5MassColor":"#bf00aa","lbMeColor":"#bf00aa","lbTeammateColor":"#018cf6","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#01d9cc","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapGhostCellsColor":"#ffffff","color":"#fff","customServerImage1":"https:\/\/legendmod.ml\/banners\/IconCustomServer1.png","commanderImage":"https:\/\/legendmod.ml\/banners\/drawCommander.png","commanderImage1":"https:\/\/legendmod.ml\/banners\/drawCommander1.png","commanderImage2":"https:\/\/legendmod.ml\/banners\/drawCommander2.png","commanderImage3":"https:\/\/legendmod.ml\/banners\/drawCommander3.png","commanderImage4":"https:\/\/legendmod.ml\/banners\/drawCommander4.png","commanderImage5":"https:\/\/legendmod.ml\/banners\/drawCommander5.png","commanderImage6":"https:\/\/legendmod.ml\/banners\/iconJustWatchPro.png","commanderImageDyingLight":"https:\/\/legendmod.ml\/banners\/icondyinglightzombie.png","commanderImageDyingLightvirus":"https:\/\/legendmod.ml\/banners\/icondyinglightvirus.png","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":240,"miniMapTop":24,"miniMapSectorsOpacity":0.1,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"miniMapGhostCellsAlpha":0.15,"customBackground":"","customCursor":"https:\/\/legendmod.ml\/cursors\/cursor_02.cur"},"legendSettings":{"previousMode":"null","checkonlyonce":"true","previousnickname":"Profile #4","showToken":"null","showPlayer":"null","SHOSHOBtn":"true","XPBtn":"true","MAINBTBtn":"true","AnimatedSkinBtn":"true","TIMEcalBtn":"false","troll1Btn":null,"autoCoinBtn":"null","timesopened":"175","saveclanpassword":"","dyinglight1load":"null","languagemod":"1","prevPrivateServer":"null","initialMusicUrl":"https:\/\/www.youtube.com\/watch?v=e7nkA7Ue5yg","lastIP":"qgfshq","note1":"","note2":"","note3":"","note4":"","note5":"","note6":"","note7":"","minimapbckimg":"","teambimg":"","canvasbimg":"","leadbtext":"","leadbimg":"","teambtext":"","imgUrl":"","imgHref":"","minbtext":"","pic1urlimg":"","pic2urlimg":"","pic3urlimg":"","pic4urlimg":"","pic5urlimg":"","pic6urlimg":"","yt1urlimg":"","yt2urlimg":"","yt3urlimg":"","yt4urlimg":"","yt5urlimg":"","yt6urlimg":"","pic1dataimg":"","pic2dataimg":"","pic3dataimg":"","pic4dataimg":"","pic5dataimg":"","pic6dataimg":"","yt1dataimg":"","yt2dataimg":"","yt3dataimg":"","yt4dataimg":"","yt5dataimg":"","yt6dataimg":"","discwebhook1":"https:\/\/discordapp.com\/api\/webhooks\/655203017385312284\/QFVOl7S6baZ7Jw_XKGA8cxKmO_EpCHNiXimV5c2oPUAsjVAbcL5ZCxP4CaQ8jI98ZDpO","discwebhook2":"","Userscript1":"","Userscript2":"","Userscript3":"","Userscript4":"","Userscript5":"","Userscripttexture1":"","Userscripttexture2":"","Userscripttexture3":"","Userscripttexture4":"","Userscripttexture5":""}}'
            window.history.pushState(null, null, window.location.pathname);
            $('#import-settings-btn').click();
        }, 100);
    }
}
function playSound(url){
  var audio = document.createElement('audio');
  audio.style.display = "none";
  audio.src = url;
  audio.autoplay = true;
  audio.onended = function(){
    audio.remove() //Remove when played.
  };
  document.body.appendChild(audio);
}
