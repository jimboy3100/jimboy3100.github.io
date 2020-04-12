//Language Pack Handler
//Legend Mod By Jimboy3100
//v1.3

//Legend Mod By Jimboy3100
var Languagetimesused;
var Languagetimesused1;

if($('#LanguageAuthorPanel').length==0){
	$("#TimesUsed").after('<br><div id="LanguageAuthorPanel" class="user-name" style="display:inline-block;">'+Languageletter34+': </div><div id="LanguageAuthor" style="display:inline-block"></div><br>');
	$("#LanguageAuthor").text(translator);
	}
else{
	$("#LanguageAuthorPanel").text(Languageletter34+ ': ');
	$("#LanguageAuthor").text(translator);	
}

$("#SHOSHOBtn").click();
$("#SHOSHOBtn").click();
$("#XPBtn").click();
$("#XPBtn").click();
$("#MAINBTBtn").click();
$("#MAINBTBtn").click();
$("#AnimatedSkinBtn").click();
$("#AnimatedSkinBtn").click();
$("#HideAllBthn").click();
$("#HideAllBthn").click();
$("#TIMEcalBtn").click();
$("#TIMEcalBtn").click();
var languagemod;
if (languagemod!=6){
$('#region').replace("North America",Premadeletter134).replace("South America",Premadeletter135).replace("Europe",Premadeletter136).replace("Russia",Premadeletter137).replace("Turkey",Premadeletter138).replace("East Asia",Premadeletter139).replace("China",Premadeletter139a).replace("Oceania",Premadeletter140).replace(" -- Select a Region -- ",Premadeletter140a);
}
$('#gamemode').replace("FFA",Premadeletter141).replace("Battle Royale",Premadeletter142).replace("Teams",Premadeletter143).replace("Experimental",Premadeletter144).replace("Party Mode",Premadeletter145);
//languagemod

$(".ogicon-home").attr('data-original-title',Languageletter0);
$(".ogicon-user").attr('data-original-title',Languageletter1);
$(".ogicon-cog").attr('data-original-title',Languageletter2);
$(".ogicon-droplet").attr('data-original-title',Languageletter3);
$(".hotkeys-link.ogicon-keyboard").attr('data-original-title',Languageletter4);
$(".ogicon-music").attr('data-original-title',Languageletter5);
$(".legend-tab").attr('data-original-title',Languageletter6);

$("#clantag").attr('placeholder',Languageletter7a).attr('data-original-title',Languageletter7);
$("#nick").attr('placeholder',Languageletter8a).attr('data-original-title',Languageletter8);
$("#skin").attr('placeholder',Languageletter9a).attr('data-original-title',Languageletter9);
$("#region").attr('data-original-title',Languageletter10);
$("#gamemode").attr('data-original-title',Languageletter11);
$("#connect2").text(Languageletter12a).attr('data-original-title',Languageletter12);
$("#server-join").text(Languageletter13);
$(".btn.btn-play-guest.btn-success.btn-needs-server").text(Languageletter14);
$(".btn.btn-play-guest.btn-success").text(Languageletter14);
$(".btn.btn-warning.btn-login-play.btn-needs-server").text(Languageletter15);
$(".btn.btn-warning.btn-login-play").text(Languageletter15);

$(".btn.btn-warning.btn-spectate.btn-needs-server").tooltip({
            title: Languageletter16,
            placement: "top"
        });
$(".btn.btn-warning.btn-spectate.btn-needs-server").attr('data-original-title',Languageletter16);
$(".btn.btn-primary.btn-login.btn-fb").children().last().text(Languageletter17);
$(".btn.btn-primary.btn-login.btn-gplus").children().last().text(Languageletter18);
$(".btn.btn-play.btn-primary.btn-needs-server").text(Languageletter19);

$(".quick-shop.ogicon-cart").attr('data-original-title',Languageletter20);
$(".quick-free-coins.ogicon-coin-dollar").attr('data-original-title',Languageletter21);
$(".quick-free-gifts.ogicon-gift").attr('data-original-title',Languageletter22);
$(".quick-quests.ogicon-trophy").attr('data-original-title',Languageletter23);
$(".quick-more-skins.ogicon-grin").attr('data-original-title',Languageletter24);
$(".quick-yt.ogicon-youtube2").attr('data-original-title',Languageletter25);
$("#LegGoogleForm").attr('data-original-title',Languageletter25a);
$("#themesBtn").attr('data-original-title',Languageletter126);
$("#ModInfoQuick").attr('data-original-title',Languageletter25b);

$("#more-skins").text(Languageletter26);


$(".btn.btn-primary.btn-success.btn-freecoins").text(Languageletter21);
$("#gifting").text(Languageletter22);
$("#dailyQuests").text(Languageletter23);
$("#openShopBtn").text(Languageletter20);
$(".btn.btn-danger.btn-logout").attr('data-original-title',Languageletter31);

$("#UserProfileName").replace('Name', Languageletter362);
$("#UserProfileUID").replace('Social ID', Languageletter363);

$("#TimesUsedPanel").replaceWith('<div id="TimesUsedPanel" align="left" style="display:inline-block; margin-top: -10px; margin-bottom: -10px; "><h6><i>' + Languageletter32+': '+timesopened+
		'<br>'+ Languageletter33 + ': jimboy3100<br>' + Languageletter34 + ': ' + translator + '</i></h6></div>');

$("#tcm>#tcm-header>p").text(Languageletter35);


$(".options-box.animationGroup>h5").text(Languageletter36);
$(".options-box.animationGroup>DIV>DIV>SPAN:nth-child(1)").text(Languageletter37 + ": ");
$(".options-box.zoomGroup>h5").text(Languageletter37b);
$(".options-box.zoomGroup>LABEL").replace('Auto zoom', Languageletter37a);
$(".options-box.zoomGroup>DIV>DIV>SPAN:nth-child(1)").text(Languageletter38 + ": ");

$(".options-box.leaderboard>h5").text(Languageletter320);
$(".options-box.leaderboard>LABEL").replace('Leaderboard Players', Languageletter320 + " " + Languageletter313);
$(".options-box.leaderboard>LABEL").replace('Team Players', Languageletter321 + " " +  Languageletter313);

$(".options-box.respGroup>h5").text(Languageletter39);
$(".options-box.respGroup>LABEL").replace('Quick respawn', Languageletter41);
$(".options-box.respGroup>LABEL").replace('Auto respawn', Languageletter40);
$(".options-box.respGroup>LABEL").replace('Spawn special effects', Languageletter41a);
$(".options-box.massGroup>LABEL").replace('Merge timer BETA off', Languageletter41b);
$(".options-box.massGroup>LABEL").replace('Suggested to be enabled for Lag reduce', Languageletter41c);
$(".options-box.massGroup>LABEL").replace('Virus shot sound', Languageletter41d);

$(".options-box.namesGroup>h5").text(Languageletter42);
$(".options-box.namesGroup>LABEL").replace('No names', Languageletter43);
$(".options-box.namesGroup>LABEL").replace('Optimized names', Languageletter44);
$(".options-box.namesGroup>LABEL").replace('Auto hide names', Languageletter45);
$(".options-box.namesGroup>LABEL").replace('Hide my name', Languageletter46);
$(".options-box.namesGroup>LABEL").replace('Hide teammates names', Languageletter47);
$(".options-box.namesGroup>LABEL").replace('Names stroke', Languageletter48);
$(".options-box.massGroup>h5").text(Languageletter49);
$(".options-box.massGroup>LABEL").replace('Show mass', Languageletter50);
$(".options-box.massGroup>LABEL").replace('Optimized mass',  Languageletter51);
$(".options-box.massGroup>LABEL").replace('Auto hide mass', Languageletter52);
$(".options-box.massGroup>LABEL").replace('Hide my mass', Languageletter53);
$(".options-box.massGroup>LABEL").replace('Hide enemies mass', Languageletter54);
$(".options-box.massGroup>LABEL").replace('Short mass', Languageletter55);
$(".options-box.massGroup>LABEL").replace('Virus shots', Languageletter56);
$(".options-box.massGroup>LABEL").replace('Mass stroke', Languageletter57);
$(".options-box.skinsGroup>h5").text(Languageletter58);
$(".options-box.skinsGroup>LABEL").replace('No skins', Languageletter59);
$(".options-box.skinsGroup>LABEL").replace('Custom skins', Languageletter60);
$(".options-box.skinsGroup>LABEL").replace('Vanilla skins', Languageletter61);
$(".options-box.skinsGroup>LABEL").replace('Jelly physics', Languageletter61a);
$(".options-box.skinsGroup>LABEL").replace('Sound from other\'s Video skins when both C3', Languageletter61c);
$(".options-box.skinsGroup>LABEL").replace('Video skins', Languageletter61b);

$(".options-box.foodGroup>h5").text(Languageletter6a2);
$(".options-box.foodGroup>LABEL").replace('Optimized food', Languageletter62);
$(".options-box.foodGroup>LABEL").replace('Auto hide food - mass', Languageletter63);
$(".options-box.foodGroup>LABEL").replace('Auto hide food - zoom', Languageletter64);
$(".options-box.foodGroup>LABEL").replace('Rainbow food', Languageletter65);
//$(".options-box.foodGroup>LABEL").replace('mass', Languageletter49);
//$(".options-box.foodGroup>LABEL").replace('zoom', Languageletter37b);

$(".options-box.transparencyGroup>h5").text(Languageletter66);
$(".options-box.transparencyGroup>LABEL").replace('No colors', Languageletter67);
$(".options-box.transparencyGroup>LABEL").replace('My custom color', Languageletter68);
$(".options-box.transparencyGroup>LABEL").replace('My transparent skin', Languageletter69);
$(".options-box.transparencyGroup>LABEL").replace('Transparent skins', Languageletter70);
$(".options-box.transparencyGroup>LABEL").replace('Transparent cells', Languageletter70a);
$(".options-box.transparencyGroup>LABEL").replace('Transparent viruses', Languageletter71);
$(".options-box.transparencyGroup>LABEL").replace('Virus Glow', Languageletter71a);
$(".options-box.transparencyGroup>LABEL").replace('Animated rainbow colors', Languageletter71b);

$(".options-box.gridGroup>h5").text(Languageletter72);
$(".options-box.gridGroup>LABEL").replace('Show grid', Languageletter73);
$(".options-box.gridGroup>LABEL").replace('Show background sectors', Languageletter74);
$(".options-box.gridGroup>LABEL").replace('Show map borders', Languageletter75);
$(".options-box.gridGroup>LABEL").replace('Border Glow', Languageletter75a);

$(".options-box.chatGroup>h5").text(Languageletter76);
$(".options-box.chatGroup>LABEL").replace('Disable chat', Languageletter77);
$(".options-box.chatGroup>LABEL").replace('Sound notifications', Languageletter78);
$(".options-box.chatGroup>LABEL").replace('Emoticons', Languageletter79);
$(".options-box.chatGroup>LABEL").replace('Show images on chat', Languageletter80);
$(".options-box.chatGroup>LABEL").replace('Show videos on chat', Languageletter81);
$(".options-box.chatGroup>LABEL").replace('Chatbox instead of popups', Languageletter82);
$(".options-box.miniMapGroup>h5").text(Languageletter82a);
$(".options-box.miniMapGroup>LABEL").replace('Show minimap', Languageletter82b);
$(".options-box.miniMapGroup>LABEL").replace('Show minimap grid', Languageletter82c);
$(".options-box.miniMapGroup>LABEL").replace('Show minimap guides', Languageletter82d);
$(".options-box.miniMapGroup>LABEL").replace('Show extra minimap guides', Languageletter82f);
$(".options-box.miniMapGroup>LABEL").replace('Show ghost cells', Languageletter82g);
$(".options-box.miniMapGroup>LABEL").replace('One-colored teammates', Languageletter82e);
$(".options-box.helpersGroup>h5").text(Languageletter83);
$(".options-box.helpersGroup>LABEL").replace('Opponents colors', Languageletter84);
$(".options-box.helpersGroup>LABEL").replace('Opponents rings', Languageletter85);
$(".options-box.helpersGroup>LABEL").replace('Viruses colors', Languageletter86);
$(".options-box.helpersGroup>LABEL").replace('Split range', Languageletter87);
$(".options-box.helpersGroup>LABEL").replace('Quick double split range', Languageletter87a);
$(".options-box.helpersGroup>LABEL").replace('Slow double split range', Languageletter87b);
$(".options-box.helpersGroup>LABEL").replace('Viruses range', Languageletter88);
$(".options-box.helpersGroup>LABEL").replace('Cursor tracking', Languageletter89);
$(".options-box.helpersGroup>LABEL").replace('Teammates indicators', Languageletter90);
$(".options-box.helpersGroup>LABEL").replace('Ghost cells info', Languageletter90a + " " + Externalletter1.toLowerCase());
$(".options-box.helpersGroup>LABEL").replace('Ghost cells', Languageletter90a);

$(".options-box.mouseGroup>h5").text(Languageletter91);
$(".options-box.mouseGroup>LABEL").replace('LMB - Mouse split', Languageletter92);
$(".options-box.mouseGroup>LABEL").replace('RMB - Mouse feed', Languageletter93);
$(".options-box.mouseGroup>LABEL").replace('Invert mouse buttons', Languageletter94);
$(".options-box.hudGroup>h5").text(Languageletter94a);
$(".options-box.hudGroup>LABEL").replace('Show teamboard', Languageletter95);
$(".options-box.hudGroup>LABEL").replace('Show targeting', Languageletter96);
$(".options-box.hudGroup>LABEL").replace('Show leaderboard mass', Languageletter96a);
$(".options-box.hudGroup>LABEL").replace('Centered leaderboard', Languageletter97);
$(".options-box.hudGroup>LABEL").replace('\"Leaderboard\" header ', Languageletter97a);
$(".options-box.hudGroup>LABEL").replace('Game stats at the top', Languageletter98);
$(".options-box.hudGroup>LABEL").replace('Skins on teamboard', Languageletter98a);
$(".options-box.statsGroup>h5").text(Languageletter99);
$(".options-box.statsGroup>LABEL").replace('Show game stats', Languageletter100);
$(".options-box.statsGroup>LABEL").replace('Game stats: Mass', Languageletter101 + ": " + Languageletter49);
$(".options-box.statsGroup>LABEL").replace('Game stats: Enemy\'s STE', Languageletter101 + ": " + Languageletter102 + " " + "STE");
$(".options-box.statsGroup>LABEL").replace('Game stats: Enemy\'s MTE', Languageletter101 + ": " + Languageletter102 + " " + "MTE");
$(".options-box.statsGroup>LABEL").replace('Game stats: Our STE', Languageletter101 + ": " + Languageletter103 + " " + "STE");
$(".options-box.statsGroup>LABEL").replace('Game stats: Our MTE', Languageletter101 + ": " + Languageletter103 + " " + "MTE");
$(".options-box.statsGroup>LABEL").replace('Game stats: Minimal tricksplit teammate\'s mass ', Languageletter101 + ": " + Languageletter104);
$(".options-box.statsGroup>LABEL").replace('Game stats: Maximal enemy\'s mass for presplit', Languageletter101 + ": " + Languageletter104a);
$(".options-box.statsGroup>LABEL").replace('Game stats: STE', Languageletter101 + ": " + "STE");
$(".options-box.statsGroup>LABEL").replace('Game stats: n/16', Languageletter101 + ": " + "n/16");
$(".options-box.statsGroup>LABEL").replace('Game stats: FPS', Languageletter101 + ": " + "FPS");
$(".options-box.statsGroup>LABEL").replace('Show current time', Languageletter105);
$(".options-box.extrasGroup>h5").text(Languageletter106);
$(".options-box.extrasGroup>LABEL").replace('Skip stats after death', Languageletter107);
$(".options-box.extrasGroup>LABEL").replace('Show quest', Languageletter108);
$(".options-box.extrasGroup>LABEL").replace('Game sounds', Languageletter108a);
$(".options-box.extrasGroup>LABEL").replace('Menu sounds', Languageletter108b);
$(".options-box.extrasGroup>LABEL").replace('Block popups', Languageletter109);
$(".options-box.voiceGroup>.menu-main-color").text(Languageletter109a);
$(".options-box.voiceGroup>LABEL").replace('Voice-Prefix', Languageletter109b);
$(".options-box.voiceGroup>LABEL").replace('Voice-lang', Languageletter109c);
$(".options-box.voiceGroup>LABEL").replace('UnPause', Languageletter109d);

$('#quality>option:nth-child(1)').text(Languageletter110);
$('#quality>option:nth-child(2)').text(Languageletter111);
$('#quality>option:nth-child(3)').text(Languageletter112);
$('#quality>option:nth-child(4)').text(Languageletter113);
$('#quality>option:nth-child(5)').text(Languageletter114);
$('#quality>option:nth-child(6)').text(Languageletter115);

$(".btn.btn-block.btn-success.btn-export").text(Languageletter116);
$(".restore-settings>a").eq(0).text(Languageletter117);

$("#exp-imp-settings>h1").eq(0).text(Languageletter118);
$("#exp-imp-settings>h1").eq(1).text(Languageletter119);
$("#exp-imp-settings>h2").eq(0).text(Languageletter120);
$("#exp-imp-settings>h2").eq(1).text(Languageletter121);

$("#exp-imp-settings>LABEL").replace('Commands', Languageletter122);
$("#exp-imp-settings>LABEL").replace('Hotkeys', Languageletter123);
$("#exp-imp-settings>LABEL").replace('Profiles', Languageletter124);
$("#exp-imp-settings>LABEL").replace('Settings', Languageletter125);
$("#exp-imp-settings>LABEL").replace('Theme', Languageletter126);
$("#export-settings-btn").text(Languageletter127);
$("#import-settings-btn").text(Languageletter128);
$("#import-settings-btn2").text(Languageletter128);

$("#theme>ul>li>.ogicon-paint-format").attr('data-original-title', Languageletter129);
$("#theme>ul>li>.ogicon-menu").attr('data-original-title', Languageletter130);
$("#theme>ul>li>.ogicon-display").attr('data-original-title', Languageletter131);
$("#theme>ul>li>.ogicon-bubbles").attr('data-original-title', Languageletter132);
$("#theme>ul>li>.ogicon-location2").attr('data-original-title', Languageletter133);
$("#theme>ul>li>.ogicon-compass").attr('data-original-title', Languageletter134);

$(".preset-box>span").text(Languageletter135);

$('#themePreset>option:nth-child(3)').text(Languageletter136);
$('#themePreset>option:nth-child(4)').text(Languageletter137 + " 1");
$('#themePreset>option:nth-child(5)').text(Languageletter137 + " 2");

$("#theme-main>div>span").eq(1).text(Languageletter139); //Background
$("#theme-main>div>span").eq(2).text(Languageletter140); //Map borders
$("#theme-main>div>span").eq(3).text(Languageletter75a); //Border Glow
$("#theme-main>div>span").eq(4).text(Languageletter141); //Grid
$("#theme-main>div>span").eq(5).text(Languageletter155); //Sectors font
$("#theme-main>div>span").eq(6).text(Languageletter143); //Names
$("#theme-main>div>span").eq(7).text(Languageletter145); //Names stroke
$("#theme-main>div>span").eq(8).text(Languageletter145); //Mass
$("#theme-main>div>span").eq(9).text(Languageletter146); //Mass stroke
$("#theme-main>div>span").eq(10).text(Languageletter148); //Virus
$("#theme-main>div>span").eq(11).text(Languageletter147); //Virus stroke
$("#theme-main>div>span").eq(12).text(Languageletter148a); //Mothercell
$("#theme-main>div>span").eq(13).text(Languageletter148b); //Mothercell stroke
$("#theme-main>div>span").eq(14).text(Languageletter71a); //Virus Glow
$("#theme-main>div>span").eq(15).text(Languageletter149); //Food
$("#theme-main>div>span").eq(16).text(Languageletter150); //Teammate indicator
$("#theme-main>div>span").eq(17).text(Languageletter151); //Cursor tracking
$("#theme-main>div>span").eq(18).text(Languageletter152); //Split range
$("#theme-main>div>span").eq(19).text("B2STE " + Languageletter102 + " " + Languageletter175); //B2STE Enemy Color
$("#theme-main>div>span").eq(20).text("BSTE " + Languageletter102 + " " + Languageletter175); //BSTE Enemy Color
$("#theme-main>div>span").eq(21).text(Languageletter154a + " " + Languageletter102 + " " + Languageletter175); //Bigger Enemy Color
$("#theme-main>div>span").eq(22).text(Languageletter154b + " " + Languageletter102 + " " + Languageletter175); //Smaller Enemy Color
$("#theme-main>div>span").eq(23).text("SSTE " + Languageletter102 + " " + Languageletter175); //SSTE Enemy Color
$("#theme-main>div>span").eq(24).text("S2STE " + Languageletter102 + " " + Languageletter175); //S2STE Enemy Color
$("#theme-main>div>span").eq(25).text(Languageletter154); //Safe area
$("#theme-main>div>span").eq(26).text(Languageletter154); //Danger area
$("#theme-main>div>span").eq(27).text(Languageletter90a); //Ghost cells

$("#theme-main>div>span").eq(28).text(Languageletter153 + ": ");
$("#theme-main>div>span").eq(29).text(Languageletter154 + ": ");
$("#theme-main>div>span").eq(30).text(Languageletter155 + ": ");
/*
$("#theme-main>div>span").eq(18).text(Languageletter152a);
$("#theme-main>div>span").eq(19).text(Languageletter152b);
$("#theme-main>div>span").eq(20).text(Languageletter152c);
$("#theme-main>div>span").eq(21).text(Languageletter152d);
$("#theme-main>div>span").eq(22).text(Languageletter152e);
$("#theme-main>div>span").eq(23).text(Languageletter152f);
$("#theme-main>div>span").eq(24).text(Languageletter152g);
$("#theme-main>div>span").eq(25).text(Languageletter152h);
$("#theme-main>div>span").eq(26).text(Languageletter152i);
$("#theme-main>div>span").eq(27).text(Languageletter152j);
$("#theme-main>div>span").eq(28).text(Languageletter152k);
$("#theme-main>div>span").eq(29).text(Languageletter152l);
$("#theme-main>div>span").eq(30).text(Languageletter152m);
*/
$("#theme-main>div>div>span:nth-child(1)").eq(0).text(Languageletter157 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(1).text(Languageletter158 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(2).text(Languageletter159 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(3).text(Languageletter160 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(4).text(Languageletter161 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(5).text(Languageletter162 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(6).text(Languageletter163 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(7).text(Languageletter164 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(8).text(Languageletter75a + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(9).text(Languageletter71a + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(10).text(Languageletter165 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(11).text(Languageletter166 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(12).text(Languageletter167 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(13).text(Languageletter168 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(14).text(Languageletter169 + ": ");
$("#theme-main>div>div>span:nth-child(1)").eq(15).text(Languageletter90a +" "+ Languageletter174 + ": ");
//$("#theme-main>div>div>span:nth-child(1)").eq(12).text(Languageletter169a + ": ");
//$("#theme-main>div>div>span:nth-child(1)").eq(12).text(Languageletter169b + ": ");
//$("#theme-main>div>div>span:nth-child(1)").eq(12).text(Languageletter169c + ": ");

$(".restore-settings>a").eq(1).text(Languageletter170);
$(".btn.btn-block.btn-success.btn-save").text(Languageletter171);

$(".preset-box>span").eq(1).text(Languageletter172);
$(".preset-box>div>span").eq(1).text(Languageletter173);

$("#theme-menu>div>div>span:nth-child(1)").eq(0).text(Languageletter174 + ": ");
$("#theme-menu>div>span").eq(1).text(Languageletter175);
$("#theme-menu>div>span").eq(2).text(Languageletter176);
$("#theme-menu>div>span").eq(3).text(Languageletter177);
$("#theme-menu>div>span").eq(4).text(Languageletter177 + " (2)");
$("#theme-menu>div>span").eq(5).text(Languageletter179);
$("#theme-menu>div>span").eq(6).text(Languageletter179 + " (2)");
$("#theme-menu>div>span").eq(7).text(Languageletter181 +" #1");
$("#theme-menu>div>span").eq(8).text(Languageletter181 +" #1 (2)");
$("#theme-menu>div>span").eq(9).text(Languageletter181 +" #2");
$("#theme-menu>div>span").eq(10).text(Languageletter181 +" #2 (2)");
$("#theme-menu>div>span").eq(11).text(Languageletter181 +" #3");
$("#theme-menu>div>span").eq(12).text(Languageletter181 +" #3 (2)");
$("#theme-menu>div>span").eq(13).text(Languageletter181 +" #4");
$("#theme-menu>div>span").eq(14).text(Languageletter181 +" #4 (2)");
$("#theme-menu>div>span").eq(15).text(Languageletter189);
$("#menuBg").attr('placeholder', Languageletter190);

$("#theme-hud>div>span").eq(0).text(Languageletter175);
$("#theme-hud>div>span").eq(1).text(Languageletter192);
$("#theme-hud>div>span").eq(2).text(Languageletter193);
$("#theme-hud>div>span").eq(3).text(Languageletter194);
$("#theme-hud>div>span").eq(4).text(Languageletter195);
$("#theme-hud>div>span").eq(5).text(Languageletter196);
$("#theme-hud>div>span").eq(6).text(Languageletter197);
$("#theme-hud>div>span").eq(7).text(Languageletter198);
$("#theme-hud>div>span").eq(8).text(Languageletter199);
$("#theme-hud>div>div>span:nth-child(1)").eq(0).text(Languageletter200 + ": ");

$("#theme-chat>div>span").eq(0).text(Languageletter201);
$("#theme-chat>div>span").eq(1).text(Languageletter202);
$("#theme-chat>div>span").eq(2).text(Languageletter203);
$("#theme-chat>div>span").eq(3).text(Languageletter204);
$("#theme-chat>div>span").eq(4).text(Languageletter205);
$("#theme-chat>div>span").eq(5).text(Languageletter206);
$("#theme-chat>div>span").eq(6).text(Languageletter207);
$("#theme-chat>div>span").eq(7).text(Languageletter208);
$("#theme-chat>div>span").eq(8).text(Languageletter209);
$("#theme-chat>div>div>span:nth-child(1)").eq(0).text(Languageletter210 + ": ");

$("#theme-minimap>div>span").eq(0).text(Languageletter211);
$("#theme-minimap>div>span").eq(1).text(Languageletter212);
$("#theme-minimap>div>span").eq(2).text(Languageletter213);
$("#theme-minimap>div>span").eq(3).text(Languageletter214);
$("#theme-minimap>div>span").eq(4).text(Languageletter215);
$("#theme-minimap>div>span").eq(5).text(Languageletter216);
$("#theme-minimap>div>span").eq(6).text(Languageletter217);
$("#theme-minimap>div>span").eq(7).text(Languageletter218);
$("#theme-minimap>div>span").eq(8).text(Languageletter219);
$("#theme-minimap>div>span").eq(9).text(Languageletter220);
$("#theme-minimap>div>span").eq(9).text(Languageletter221);

$("#theme-minimap>div>div>span:nth-child(1)").eq(0).text(Languageletter222 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(1).text(Languageletter223 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(2).text(Languageletter224 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(3).text(Languageletter225 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(4).text(Languageletter226 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(5).text(Languageletter227 + ": ");
$("#theme-minimap>div>div>span:nth-child(1)").eq(6).text(Languageletter228 + ": ");

$("#theme-images>div>span").eq(0).text(Languageletter229);
$("#theme-images>div>span").eq(1).text(Languageletter230);
$("#customBackground").attr('placeholder',Languageletter231);
$("#customCursor").attr('placeholder',Languageletter232);


$("#hotkeys-cfg>div>div:nth-child(1)").eq(0).text(Languageletter233);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(1).text(Languageletter234);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(2).text(Languageletter235);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(3).text(Languageletter236);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(4).text(Languageletter237);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(5).text(Languageletter238);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(6).text(Languageletter239);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(7).text(Languageletter240);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(8).text(Languageletter241);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(9).text(Languageletter242);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(10).text(Languageletter243);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(11).text(Languageletter244);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(12).text(Languageletter245);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(13).text(Languageletter246);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(14).text(Languageletter247);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(15).text(Languageletter248);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(16).text(Languageletter249);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(17).text(Languageletter250);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(18).text(Languageletter251);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(19).text(Languageletter252);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(20).text(Languageletter253);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(21).text(Languageletter254);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(22).text(Languageletter255);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(23).text(Languageletter256);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(24).text(Languageletter257);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(25).text(Languageletter258);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(26).text(Languageletter259);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(27).text(Languageletter260);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(28).text(Languageletter261);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(29).text(Languageletter262);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(30).text(Languageletter263);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(31).text(Languageletter264);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(32).text(Languageletter265);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(33).text(Languageletter266);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(34).text(Languageletter267);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(35).text(Languageletter268);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(36).text(Languageletter269);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(37).text(Languageletter270);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(38).text(Languageletter271 + " 1");
$("#hotkeys-cfg>div>div:nth-child(1)").eq(39).text(Languageletter271 + " 2");
$("#hotkeys-cfg>div>div:nth-child(1)").eq(40).text(Languageletter271 + " 3");
$("#hotkeys-cfg>div>div:nth-child(1)").eq(41).text(Languageletter271 + " 4");
$("#hotkeys-cfg>div>div:nth-child(1)").eq(42).text(Languageletter271 + " 5");

$("#hotkeys-cfg>div>div:nth-child(1)").eq(43).text(Languageletter271a);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(44).text(Languageletter271b);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(45).text(Languageletter271c);

$("#hotkeys-cfg>div>div:nth-child(1)").eq(46).text(Languageletter272);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(47).text(Languageletter273);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(48).text(Languageletter274);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(49).text(Languageletter275);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(50).text(Languageletter276);
$("#hotkeys-cfg>div>div:nth-child(1)").eq(51).text(Languageletter277);

$("#hotkeys-inst").replaceWith('<div id="hotkeys-inst"><ul><li>' + Languageletter278 + '</li><li>' + Languageletter279 + '</li><li>' + Languageletter280 + '</li></ul></div>');

$("#reset-hotkeys").text(Languageletter281);
$("#save-hotkeys").text(Languageletter282);
$("#close-hotkeys").text(Languageletter283);
$("#close-exp-imp").text(Languageletter283);

$("#youtubeplayer>h5").text(Languageletter284);
$("#musicUrl").attr('placeholder', Languageletter284a).attr('data-original-title',Languageletter285);
$(".agario-panel.sounds-panel>h5").text(Languageletter286);
$(".agario-panel.sounds-panel>div>span").eq(0).text(Languageletter287);
$(".agario-panel.sounds-panel>div>span").eq(1).text(Languageletter288);
$(".agario-panel.sounds-panel>div>span").eq(2).text(Languageletter41d);

$("#copySIPBtn").text(Languageletter291).attr('data-original-title',Languageletter289);
$("#copySIPBtn").text(Languageletter291).attr('data-original-title',Languageletter289);
        $("#copySIPBtn").mouseenter(function() {
            $("#dropDown3").hide();
            $("#copySIPBtn").text(Languageletter290);
			if ($("#clantag").val()!=""){
				$("#dropDown2").show(100);
			}
            else {
				$("#dropDown").show(100);
				}
        });
$("#leaderboard-menu").mouseleave(function () {$("#dropDown").hide();$("#dropDown3").hide();$("#copySIPBtn").text(Languageletter291);});
$("#copyLBBtn").text(Languageletter290a).attr('data-original-title', Languageletter291a);
$("#dropDown>#copyLBBtn").text(Languageletter290a).attr('data-original-title', Languageletter291a);
$("#copySIPandPass").text(Languageletter290b).attr('data-original-title', Languageletter291b);
$("#copySIPPassLB").text(Languageletter290c).attr('data-original-title', Languageletter291c);


$("#searchShortcut").attr('data-original-title', Languageletter292);
$("#reconnectBtn").attr('data-original-title', Languageletter293);
$("#logTitle").text(Languageletter294);
$("#searchInput").attr('placeholder',Languageletter295);
$("#closeBtn").text(Languageletter283); 
$("#notesclear").attr("data-original-title", Languageletter295a);
$("#message").attr('placeholder', Languageletter295b);
//$("#top5-total").each(function() { var text = $(this).html();
//   $(this).html(text.replace(' Active players: ', ' ' + Languageletter296 + ': ')); 
//});
//$("#top5-total").each(function() { var text = $(this).html();
//  $(this).html(text.replace(' Total mass: ', ' ' + Languageletter297 + ': ')); 
//});

if($('#teambtext').val()==""){
	$("#top5-hud > h5").each(function() { var text = $(this).html();
   $(this).html(text.replace('Team', Languageletter298 + ' ')); 
});}
if($('#leadbtext').val()==""){
	$("#leaderboard-hud > h5").text(Languageletter299);
};
$("#ChatBtn").attr("data-original-title", Languageletter300);
$("#SendCommands").attr("data-original-title", Languageletter301);
$("#Images").attr("data-original-title", Languageletter302);
$("#yout").attr("data-original-title", Languageletter303);
$("#Cutnames").attr("data-original-title", Languageletter304);
$("#Bino").attr("data-original-title", Languageletter305);
$("#playerBtn").attr("data-original-title", Languageletter306);
$("#fullscreenBtn").attr("data-original-title", Languageletter307);
$("#RotateRight").attr("data-original-title", Languageletter308);
$("#bottomleft").text( Languageletter309);
$("#Backtomenu").text( Languageletter283);
$("#notesaveforlater").text(Languageletter311);
$("#notesRegion").text(Languageletter312 + ": ");
$("#notesPlayers").text(Languageletter313 + ": ");
$("#notesServer").text(Languageletter314 + ": ");
if($("#target-status").text()=="[Target not set]"){$("#target-status").text(Languageletter315)}

$("#legendmanualback").text(Languageletter316 + ":  ");
$("#legendmanualmess").text(Languageletter317 + ":  ");
$("#chatbtntitle").text(Languageletter318 + ":  ");
$("#legenddiscordwebh").text(Languageletter319 +"  ");
$("#legendotherscripts").text(Languageletter364 +":");

$('#backgroundPic>option:nth-child(1)').text(Languageletter133);
$('#backgroundPic>option:nth-child(2)').text(Languageletter320);
$('#backgroundPic>option:nth-child(3)').text(Languageletter321);
$('#backgroundPic>option:nth-child(4)').text(Languageletter322);
$('#backgroundPic>option:nth-child(5)').text(Languageletter323);

$('#msgcommand1').attr("data-original-title", Languageletter324);
$('#msgcommand2').attr("data-original-title", Languageletter325);
$('#msgcommand3').attr("data-original-title", Languageletter326);
$('#msgcommand4').attr("data-original-title", Languageletter327);
$('#msgcommand5').attr("data-original-title", Languageletter328);
$('#msgcommand6').attr("data-original-title", Languageletter329);


$('#minimapPicture').attr('placeholder',Languageletter331).attr('data-original-title',Languageletter330);
$('#minbtext').attr('placeholder',Languageletter332);
$('#leadbPicture').attr('placeholder',Languageletter333a).attr('data-original-title',Languageletter330);
$('#leadbtext').attr('placeholder',Languageletter334);
$('#teambPicture').attr('placeholder',Languageletter334a).attr('data-original-title',Languageletter330);
$('#leadbtext').attr('placeholder',Languageletter334);
$('#canvasPicture').attr('placeholder',Languageletter335).attr('data-original-title',Languageletter330);
$('#imgUrl').attr('placeholder',Languageletter336).attr('data-original-title',Languageletter330);
$('#imgHref').attr('placeholder',Languageletter337).attr('data-original-title',Languageletter341);

$('#changephotos>option:nth-child(1)').text(Languageletter338 + " 1");
$('#changephotos>option:nth-child(2)').text(Languageletter338 + " 2");
$('#changephotos>option:nth-child(3)').text(Languageletter338 + " 3");
$('#changephotos>option:nth-child(4)').text(Languageletter338 + " 4");
$('#changephotos>option:nth-child(5)').text(Languageletter338 + " 5");
$('#changephotos>option:nth-child(6)').text(Languageletter338 + " 6");


$('#pic1url').attr('placeholder',Languageletter342c + " 1").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");
$('#pic2url').attr('placeholder',Languageletter342c + " 2").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");
$('#pic3url').attr('placeholder',Languageletter342c + " 3").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");
$('#pic4url').attr('placeholder',Languageletter342c + " 4").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");
$('#pic5url').attr('placeholder',Languageletter342c + " 5").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");
$('#pic6url').attr('placeholder',Languageletter342c + " 6").attr("data-original-title", Languageletter339 + " http://i.imgur.com/RVBi3T1.gif");

$('#yt1url').attr('placeholder',Languageletter342d + " 1").attr("data-original-title", Languageletter340);
$('#yt2url').attr('placeholder',Languageletter342d + " 2").attr("data-original-title", Languageletter340);
$('#yt3url').attr('placeholder',Languageletter342d + " 3").attr("data-original-title", Languageletter340);
$('#yt4url').attr('placeholder',Languageletter342d + " 4").attr("data-original-title", Languageletter340);
$('#yt5url').attr('placeholder',Languageletter342d + " 5").attr("data-original-title", Languageletter340);
$('#yt6url').attr('placeholder',Languageletter342d + " 6").attr("data-original-title", Languageletter340);

$('#pic1data').attr('placeholder',Languageletter342a + " 1");
$('#pic2data').attr('placeholder',Languageletter342a + " 2");
$('#pic3data').attr('placeholder',Languageletter342a + " 3");
$('#pic4data').attr('placeholder',Languageletter342a + " 4");
$('#pic5data').attr('placeholder',Languageletter342a + " 5");
$('#pic6data').attr('placeholder',Languageletter342a + " 6");

$('#yt1data').attr('placeholder',Languageletter342b + " 1");
// $('#yt2data').attr('placeholder',Languageletter342b + " 2");
$('#yt3data').attr('placeholder',Languageletter342b + " 3");
$('#yt4data').attr('placeholder',Languageletter342b + " 4");
$('#yt5data').attr('placeholder',Languageletter342b + " 5");
$('#yt6data').attr('placeholder',Languageletter342b + " 6");


$('#discwebhook1').attr('placeholder',Languageletter342 + ' 1').attr('data-original-title', Languageletter343 + '. https://discordapp.com/api/webhooks/.../...');
$('#discwebhook2').attr('placeholder',Languageletter342 + ' 2').attr('data-original-title', Languageletter344 + '. https://discordapp.com/api/webhooks/.../...');

$("#HideAllBthn").attr('data-original-title',Languageletter345);

$("#logoutbtn").text(Languageletter31); //for LM Express
$("#CopyAll").attr('data-original-title',Languageletter26a); //for LM Express
//$("#legendlanguagetext").text(Languageletter346+ "  :");
$(".btn.btn-play.btn-primary").text(Languageletter19); //may not work

$("#potions").text(Languageletter349);
//$("#oldSkinsBtn").text(Languageletter350);
$("#SpecialDealsBtn").text(Languageletter351);
$("#SpecialDealsQuickBtn").attr("data-original-title", Languageletter351);
$(".btn.btn-primary.btn-success.btn-leagues").text(Languageletter352); //Leaderboards

//$("#LegGoogleForm").attr("data-original-title", Languageletter353);
$("#VideoSkinsQuick").attr("data-original-title", Languageletter354);
$("#MiniScripts").attr("data-original-title", Languageletter355);
$("#OpenuserScripts").text(Languageletter356);
$("#VoiceBtn").attr("data-original-title", Languageletter357);
$("#donationbtn").attr("data-original-title", Languageletter358);
$("#opennamechars").attr("data-original-title", Languageletter359);
$("#openskinchanger").attr("data-original-title", Languageletter360);
$("#MorefpsText").text(Languageletter361);

$("#Infobtn11").text(Externalletter1);
$("#TemplatesBtn").text(Externalletter2);
$("#ManualyTemplatesBtn").text(Externalletter3);
$("#LanguagesTempBtn").text(Externalletter0a);
$("#chooselangtext1").text(Externalletter0b);

if (Languagetimesused=="1"){
	Languagestimeusedplus1();
	if (Languagetimesused1==1){
toastr["info"](Externalletter0c, "", {
    timeOut: 5000,
    extendedTimeOut: 5000
     }).css("width", "300px");
	}
}
setTimeout(function () {
$("#Backtomenu").text(Languageletter283);
$("#userscripter1").text(Externalletter6);
$("#userscripter2").text(Externalletter13);
$("#userscriptBtn1").text(Externalletter7);
$("#userscriptpages").text(Externalletter8);
$("#EraseScripter").text(Externalletter9);
$("#UserscripttextA").attr('placeholder','User Script 1 '+ Externalletter10);
$("#UserscripttextB").attr('placeholder','User Script 2 '+ Externalletter10);
$("#UserscripttextC").attr('placeholder','User Script 3 '+ Externalletter10);
$("#UserscripttextD").attr('placeholder','User Script 4 '+ Externalletter10);
$("#UserscripttextE").attr('placeholder','User Script 5 '+ Externalletter10);
$("#UserscriptA").attr('placeholder','User Script 1 .js URL ('+ Externalletter12+')').attr("data-original-title", Externalletter11+" http://... or https://...");
$("#UserscriptB").attr('placeholder','User Script 2 .js URL ('+ Externalletter12+')').attr("data-original-title", Externalletter11+" http://... or https://...");
$("#UserscriptC").attr('placeholder','User Script 3 .js URL ('+ Externalletter12+')').attr("data-original-title", Externalletter11+" http://... or https://...");
$("#UserscriptD").attr('placeholder','User Script 4 .js URL ('+ Externalletter12+')').attr("data-original-title", Externalletter11+" http://... or https://...");
$("#UserscriptE").attr('placeholder','User Script 5 .js URL ('+ Externalletter12+')').attr("data-original-title", Externalletter11+" http://... or https://...");
}, 4000);

setTimeout(function () {
$("#ao2t-hud>span").replace('Universal', Languageletter365);	
$("#block-warn").replace('WARNING! Popups are blocked in the settings.', Languageletter347);
$("#block-warn").replace('Temporary unblock', Languageletter348);
}, 1500);

function Languagestimeusedplus1(){
Languagetimesused1++;
return Languagetimesused1;
}
