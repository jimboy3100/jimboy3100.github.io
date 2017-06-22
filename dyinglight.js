var dyinglight1load = localStorage.getItem("dyinglight1load");

if(dyinglight1load==null){
toastr["warning"]('<div id="tutorial" style="background-image: url(https://jimboy3100.github.io/banners/dyinglightbanner.jpg); color:#018cf6; font-size:16px; text-align:center">Are you sure you want to load Dying Light Template?<br>Save your Settings on a file, because they will be lost.<br>' + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-DyingLight" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">'+ Premadeletter25 + '</button></div>', "", { timeOut: 20000, extendedTimeOut: 20000 }).css("width", "300px");	
$(".btn.btn-sm.btn-primary.btn-play.btn-do-DyingLight").click(function () { acceptedDying(); });	
}

function acceptedDying(){
	dyinglight1load="yes";
	localStorage.setItem("dyinglight1load", dyinglight1load);
	dyinglighttemplate();
}

//setTimeout(function () {
function dyinglighttemplate(){
localStorage.setItem("musicUrl", "https://www.youtube.com/watch?v=9iDYnAireiw");	
$("#minimapPicture").val("https://jimboy3100.github.io/banners/dyinglightbabyteamboard.png");
$("#minimapPicture").blur();
$("#minbtext").val("The Map");
$("#minbtext").blur();
$("#leadbtext").val("The Most Dead");
$("#leadbtext").blur();
$("#teambtext").val("The Alive");
$("#teambtext").blur();
$("#imgUrl").val("https://jimboy3100.github.io/banners/dyinglightbanner2.jpg");
$("#imgUrl").blur();
$("#imgHref").val("http://dyinglightgame.com/buy/?mainsite");
$("#imgHref").blur();


	setTimeout(function () {
$("#import-settings-btn").attr('class', 'btn btn-success');document.getElementById("import-settings").value = '{"ogarioCommands":{"comm1":"Dont W or Split too much! We dont want to get ANTI","comm2":"Split him! Stick to the Viruses!","comm3":"I am not ANTI. You can give me mass!","comm4":"I am ANTI. Do NOT give me mass!","comm5":"%currentSector%!","comm6":"Need backup at %currentSector%!","comm7":"Enemy spotted at %currentSector%!","comm8":"Tricksplit!","comm9":"[img]http://i.imgur.com/TC7VFYr.gif[/img]","comm0":"Dont Ally with them!","comm10":"They are Allies!","comm11":"Left!","comm12":"Up!","comm13":"Right!","comm14":"Bottom!"},"ogarioHotkeys":{"0":"hk-comm0","1":"hk-comm1","2":"hk-comm2","3":"hk-comm3","4":"hk-comm4","5":"hk-comm5","6":"hk-comm6","7":"hk-comm7","8":"hk-comm8","9":"hk-comm9","W":"hk-feed","E":"hk-macroFeed","SPACE":"hk-split","Q":"hk-doubleSplit","ALT+Q":"hk-popSplit","SHIFT":"hk-split16","R":"hk-pause","T":"hk-showTop5","ALT+T":"hk-showTime","U":"hk-showSplitRange","I":"hk-showSplitInd","ALT+I":"hk-showTeammatesInd","O":"hk-showOppColors","A":"hk-toggleSkins","S":"hk-showSkins","ALT+S":"hk-showStats","D":"hk-toggleCells","F":"hk-showFood","G":"hk-showGrid","ALT+G":"hk-showMiniMapGuides","H":"hk-hideChat","ALT+H":"hk-showHUD","L":"hk-copyLb","ALT+L":"hk-showLb","":"hk-privateMiniMap","Z":"hk-resetZoom","X":"hk-toggleDeath","C":"hk-clearChat","B":"hk-showBgSectors","ALT+B":"hk-hideBots","N":"hk-showNames","M":"hk-showMass","ALT+M":"hk-showMiniMap","ENTER":"hk-chatMessage","TILDE":"hk-quickResp","ALT+1":"hk-zoom1","ALT+2":"hk-zoom2","ALT+3":"hk-zoom3","ALT+4":"hk-zoom4","ALT+5":"hk-zoom5","=":"hk-switchServerMode","MOUSE WHEEL":"hk-comm10","LEFT":"hk-comm11","UP":"hk-comm12","RIGHT":"hk-comm13","DOWN":"hk-comm14","spec-messageKey":"ENTER"},"ogarioPlayerProfiles":[{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"},{"nick":"The Dying Light","clanTag":"","skinURL":"http://i.imgur.com/5zLjitu.gif","color":"#01d9cc"}],"ogarioSettings":{"quickResp":true,"autoResp":false,"autoZoom":false,"autoHideNames":false,"autoHideMass":true,"autoHideFood":false,"autoHideFoodOnZoom":false,"noNames":false,"optimizedNames":true,"hideMyName":false,"hideTeammatesNames":false,"showMass":true,"optimizedMass":true,"shortMass":true,"virMassShots":true,"hideMyMass":false,"hideEnemiesMass":false,"vanillaSkins":true,"customSkins":true,"myTransparentSkin":false,"myCustomColor":false,"transparentCells":false,"transparentViruses":true,"transparentSkins":false,"showGrid":true,"showBgSectors":false,"showMapBorders":true,"showMiniMap":true,"showMiniMapGrid":false,"showMiniMapGuides":true,"oneColoredTeammates":false,"optimizedFood":true,"rainbowFood":true,"oppColors":true,"oppRings":false,"virColors":true,"splitRange":true,"virusesRange":false,"textStroke":false,"namesStroke":false,"massStroke":false,"cursorTracking":false,"teammatesInd":true,"mouseSplit":false,"mouseFeed":false,"mouseInvert":false,"disableChat":false,"hideChat":false,"chatSounds":true,"chatEmoticons":true,"showChatBox":false,"showChatImages":true,"showChatVideos":true,"showTop5":true,"showTargeting":true,"showTime":false,"normalLb":false,"centeredLb":true,"fpsAtTop":true,"showStats":true,"showStatsMass":true,"showStatsSTE":true,"showStatsN16":true,"showStatsFPS":true,"blockPopups":false,"streamMode":false,"hideSkinUrl":false,"showQuickMenu":true,"showSkinsPanel":true,"animation":140,"zoomSpeedValue":0.9,"messageSound":"http://cdn.ogario.ovh/static/sounds/notification_01.mp3","commandSound":"https://jimboy3100.github.io/dyinglingsong2.wav"},"ogarioThemeSettings":{"preset":"ogario-v3","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000000","bordersColor":"#6e0909","gridColor":"#1c1e1f","sectorsColor":"#00243e","namesColor":"#ffffff","namesStrokeColor":"#000000","massColor":"#ffffff","massStrokeColor":"#000000","virusColor":"#00523e","virusStrokeColor":"#178a5a","foodColor":"#0038ff","teammatesIndColor":"#ffffff","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"roboto","namesFontFamily":"Roboto","namesFontWeight":400,"massFont":"roboto","massFontFamily":"Roboto","massFontWeight":400,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"namesScale":1,"massScale":3,"virMassScale":3,"strokeScale":1,"foodSize":5,"bordersWidth":14,"sectorsWidth":40,"sectorsFontSize":200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"textAlpha":1,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#fafafa","menuBtnTextColor":"#ffffff","menuPanelColor":"#373838","menuPanelColor2":"#4d4c4c","menuTextColor":"#ffffff","menuTextColor2":"#000000","btn1Color":"#018cf6","btn1Color2":"#151a1f","btn2Color":"#00b9e8","btn2Color2":"#0099c0","btn3Color":"#8d5fe6","btn3Color2":"#814ee3","btn4Color":"#960000","btn4Color2":"#19233b","menuBg":"https://jimboy3100.github.io/banners/dyinglightbackhub.jpg","menuOpacity":0.95,"hudMainColor":"#5b67d1","hudColor":"rgba(255,0,0,0.4)","hudTextColor":"#000000","statsHudColor":"#202026","timeHudColor":"#0b2120","top5MassColor":"#ff0000","lbMeColor":"#f2f0f2","lbTeammateColor":"#1f5431","hudFont":"oswald-bold","hudFontFamily":"Oswald","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#018cf6","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#ffffff","miniMapGuidesColor":"#bf00aa","miniMapNickColor":"#163ec9","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#bf00aa","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu","miniMapFontFamily":"Ubuntu","miniMapFontWeight":400,"miniMapNickFont":"roboto-bold","miniMapNickFontFamily":"Roboto","miniMapNickFontWeight":700,"miniMapWidth":226,"miniMapTop":23,"miniMapSectorsOpacity":0.66,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":"http://cdn.ogario.ovh/static/img/cursors/cursor_14.cur"}}';
	$('#import-settings-btn').click();
	}, 100);
}

if(dyinglight1load=="yes"){



$("#musicUrl").val("https://www.youtube.com/watch?v=9iDYnAireiw");

setTimeout(function () {$("#playerBtn").click();}, 2000);
setTimeout(function () {$("#playerBtn").focusout();}, 2100);


//$("#leadbPicture").val("https://jimboy3100.github.io/banners/dyinglightbabyleaderboard.png");
//$("#leadbPicture").blur();




$(".input-group.skin.colorpicker-element").hide();
$("#next-profile").hide();
$("#prev-profile").hide();
$("#skin-preview").css( { marginLeft: "+80px" } );
$(".quick.quick-skins.icon-images").hide();
$("#skins-panel").hide();
$("#fullscreenBtn").click();
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback0.jpg)');	
aab();
}	
function aab(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback0.jpg)');	
aab2();
}, 30000);
}
function aab2(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback1.jpg)');	
aab3();
}, 30000);
}
function aab3(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback2.jpg)');	
aab4();
}, 60000);
}
function aab4(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback3.jpg)');	
aab5();
}, 60000);
}
function aab5(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback4.jpg)');	
aab6();
}, 60000);
}
function aab6(){
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightback5.jpg)');	
aab();
}, 60000);
}

MC.onPlayerDeath=function(){ 
$("#canvas").css('background-image', 'url(https://i.imgur.com/5jIjJVc.gif)');		
setTimeout(function () {
$("#canvas").css('background-image', 'url(https://jimboy3100.github.io/banners/dyinglightbabyteamboard.png)');		

aab2();
}, 20000);
}


