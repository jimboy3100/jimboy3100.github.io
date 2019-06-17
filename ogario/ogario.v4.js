// Open Source script
// Decoded simplified and modified by MGx, Adam, Jimboy3100, Snez, Volum, Alexander Lulko
// This is part of the Legend mod project
// v1.776 MEGA TEST
// Game Configurations

//window.testobjects = {};


function removeEmojis (string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, '');
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

function Video(src, append) {
    var v = document.createElement("video");
    if (src != "") {
        v.src = src;
    }
    if (append == true) {
        document.body.appendChild(v);
    }
    return v;
}

/*
$("#skin-preview").removeClass("default").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<video src=\'' + t.src + "' width='500'>\"></a>");
$("#skin-popover").append('<video id="vid1" src = "https://jimboy3100.github.io/banners/testvideomama.mp4" width="500"  controls></video>');
*/

window.targetFood = null;
window.autoPlay = false;
window.doSplitFlag = true;
window.VirusFlag = true;
window.BiggerCellFlag = true;
window.SmallerCellFlag = true;
window.bestDist = 10000;

window.videoJustWatchProflag = {};
window.videoJustWatchProflag2 = {};
//window.videoJustWatchProflag=true;
window.videoJustWatchPro = {};

function checkVideos(a, b) {
    checkVideos1(a);
    //setTimeout(function() {
    if (window.videoJustWatchPro[a].readyState == 4) {
        if (!window.videoJustWatchPro[a].playing) {
            window.videoJustWatchPro[a].play();
            setTimeout(function() {
                checkVideos2(a, b);
            }, 2000);
        };

    }
    //}, 2000);
    return true;
}

function checkVideos2(a, b) {
		//console.log("b is: "+ b);
    for (i = 0; i < legendmod3.top5.length - 1; i++) {

        if (i.nick == b) {
            //legendmod3.setTarget(i.id);	
			
            if ($("#nick").val() != b) {
                if (legendmod5.videoSkinsMusic == true) {
                    window.videoJustWatchProflag2[b] = false;
                    if (legendmod3.calculateMapSector(legendmod3.top5[i].x, legendmod3.top5[i].y) == legendmod3.currentSector && legendmod3.currentSector == "C3") {
						//console.log("volume 0, stage 0");
                        window.videoJustWatchPro[a].volume = 1;
                        window.videoJustWatchProflag2[b] = true;
                    } else {
						//console.log("volume 0, stage 1");
                        window.videoJustWatchPro[a].volume = 0;
                    }
                }
				else{
					//console.log("volume 0, stage 2");
					window.videoJustWatchPro[a].volume = 0;
				}
            }
        }

    }
    if ($("#nick").val() != b) {
        checkvideoJustWatchProflag2(a,b);
    }
}

function checkvideoJustWatchProflag2(a,b){
	
	if (!window.videoJustWatchProflag2[b]){
		//console.log("volume 0, stage 3");
		window.videoJustWatchPro[a].volume = 0;
	}
}
function checkVideos1(a){
	
	if (!videoJustWatchProflag[a]){
		console.log("video skins activated");
		window.videoJustWatchPro[a] = document.createElement("video"); // create a video element
		window.videoJustWatchPro[a].crossOrigin = 'anonymous';
		window.videoJustWatchPro[a].src = a;	
		window.videoJustWatchProflag[a]=true;
	}
};	

function checkVideos3(o){
	if(o.readyState > 0) {
		var minutes = parseInt(o.duration / 60, 10);
		var seconds = o.duration % 60;
		if (minutes>5){
			toastr["warning"]("<b>[SERVER]:</b> " +"Avoid using video skins bigger than 6 minutes");
		}
	}		
}
					
window.agarversion = "v12/2168/";
//window.agarversion="v12/1922/";

function pauseVideos(){
	setTimeout(function() {
Object.getOwnPropertyNames(window.videoJustWatchPro).forEach(function(element) {
	if (window.videoJustWatchPro[element] && window.videoJustWatchPro[element].playing){ 
	window.videoJustWatchPro[element].pause();
		}	
  //console.log(element);
});
	}, 1000);
}

//functions for mods

function LegendModSpawn(){}
//window.Bufferdata;
//window.generatedClientKey;


//window.disableIntegrity=false;
var Lmagarversion = "";

window.LMGameConfiguration = $.ajax({
    type: "GET",
    url: "https://jimboy3100.github.io/agario/live/" + Lmagarversion + "GameConfiguration.json",
    async: false,
    datatype: "jsonp",
    success: function(info) {
        //var GameConfiguration = info;
    }
}).responseJSON;
//weird but it works....

setTimeout(function() {
    if (window.LMGameConfiguration == undefined) {
        window.LMGameConfiguration = $.ajax({
            type: "GET",
            url: "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json",
            async: false,
            datatype: "jsonp",
            success: function(info) {
                //var GameConfiguration = info;
            }
        }).responseJSON;
    }
}, 3000);
setTimeout(function() {
    if (window.LMGameConfiguration != undefined) {
        window.LMAgarGameConfiguration = window.LMGameConfiguration;
        window.EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];
    }
}, 5000);

//set values outside ogario
window.leaderboardlimit = 20;
window.teamboardlimit = 20;
window.vanillaskins = false; //to enable vanilla skins it must be true
window.spawnspecialeffects = false;
window.top5skins = false;
//window.customskinsname;
//window.customskinsurl;

/*core.registerSkin('fly', null, 'https://i.imgur.com/poFMdZd.png', 1, null)
core.registerSkin = function(a, b, c, d, e){
	window.customskinsname=a;
	window.customskinsurl=c;
}
*/
var dyinglight1load;
function UpperCase(str) {
    return str.toUpperCase();
}

function LowerCase(str) {
    return str.toLowerCase();
}
var legendflags = ["argentina", "belarus", "cambodia", "isis", "jamaica", "mexico", "pakistan", "poland", "scotland", "somalia", "spain", "sweden", "switzerland", "thailand", "venezuela", "2ch", "4chan", "8ch", "9gag", "cameron", "irs", "receita-federal", "9gag", "agario-candle", "australia", "austria", "ayy-lmao", "bait", "bangladesh", "belgium", "berlusconi", "blatter", "boris", "bosnia", "botswana", "brazil", "bulgaria", "bush", "byzantium", "cambodia", "canada", "chavez", "chile", "china", "cia", "clinton", "confederate", "croatia", "cuba", "denmark", "dilma", "earth", "estonia", "european-union", "facebook", "facepunch", "feminism", "fidel", "finland", "france", "french-kingdom", "german-empire", "germany", "greece", "hillary", "hollande", "hungary", "imperial-japan", "india", "indiana", "iran", "iraq", "ireland", "italy", "jamaica", "japan", "kc", "kim-jong-un", "latvia", "lithuania", "luxembourg", "maldivas", "mars", "matriarchy", "merkel", "mexico", "nasa", "netherlands", "nigeria", "north-korea", "norway", "obama", "origin", "pakistan", "palin", "patriarchy", "peru", "pewdiepie", "piccolo", "pokerface", "portugal", "prodota", "prussia", "putin", "qing-dynasty", "quebec", "queen", "reddit", "romania"];

var thelegendmodproject = function(t, e, i) {
    //here starts ogario
    (function(i) {
        var o = null,
            a = null,
            n = {
                'pl': {
                    'start': 'Start',
                    'settings': 'Ustawienia',
                    'restoreSettings': 'Przywróc ustawienia domyślne',
                    'animationGroup': 'Animacja',
                    'zoomGroup': 'Zoom',
                    'respGroup': 'Odrodzenie',
                    'namesGroup': 'Nazwy',
                    'massGroup': 'Masa',
                    'skinsGroup': 'Skiny',
                    'foodGroup': 'Pokarm',
                    'transparencyGroup': 'Przezroczystość / kolory',
                    'gridGroup': 'Siatka / sektory',
                    'miniMapGroup': 'Minimapa',
                    'helpersGroup': 'Wspomagacze',
                    'mouseGroup': 'Sterowanie myszką',
                    'hudGroup': 'HUD',
                    'chatGroup': 'Czat',
                    'statsGroup': 'Statystyki',
                    'extrasGroup': 'Dodatkowe',
                    'noSkins': 'Wyłącz skiny',
                    'noNames': 'Wyłącz nazwy',
                    'noColors': 'Wyłącz kolory',
                    'showMass': 'Pokaż masę',
                    'skipStats': 'Pomiń statystyki po śmierci',
                    'showQuest': 'Pokaż zadanie (quest)',
                    'autoZoom': 'Auto zoom',
                    'animation': 'Opóźnienie animacji',
                    'suckAnimation': 'Cell Eat [Sucking] Animation',
                    'virusGlow': 'Virus Glow',
                    'borderGlow': 'Border Glow',
                    'zoomSpeedValue2': 'Szybkość zoomu',
                    'quickResp': 'Szybkie odrodzenie (klawisz)',
                    'autoResp': 'Auto odrodzenie',
                    'autoHideCellsInfo': 'Autoukrywanie nazw i masy',
                    'autoHideNames': 'Autoukrywanie nazw',
                    'autoHideMass': 'Autoukrywanie masy',
                    'autoHideFood': 'Autoukrywanie pokarmu (masa)',
                    'autoHideFoodOnZoom': 'Autoukrywanie pokarmu (zoom)',
                    'optimizedNames': 'Zoptymalizowane nazwy',
                    'hideMyName': 'Ukryj własną nazwę',
                    'hideTeammatesNames': 'Ukryj nazwy graczy teamu',
                    'optimizedMass': 'Zoptymalizowana masa (+/-2%)',
                    'shortMass': 'Skrócona masa (k)',
                    'virMassShots': 'Licznik strzałów (wirusy)',
                    'hideMyMass': 'Ukryj własną masę',
                    'hideEnemiesMass': 'Ukryj masę przeciwników',
                    'vanillaSkins': 'Podstawowe skiny',
                    'customSkins': 'Własne skiny',
					'videoSkins': 'Video skins (.mp4 .webm .ogv)',
					'videoSkinsMusic': 'Sound from other\'s Video skins when both C3',
                    'myTransparentSkin': 'Mój przezroczysty skin',
                    'myCustomColor': 'Mój własny kolor',
                    'transparentCells': 'Przezroczyste kulki',
                    'transparentViruses': 'Przezroczyste wirusy',
                    'transparentSkins': 'Przezroczyste skiny',					
                    'showGrid': 'Siatka',
                    'showBgSectors': 'Sektory w tle',
                    'showMapBorders': 'Granice mapy',
                    'showGhostCells': 'Duchy kulek (fps drop)',
					'showGhostCellsInfo': 'Ghost cells info (confusing)',
                    'showMiniMap': 'Pokaż minimapę',
                    'showMiniMapGrid': 'Pokaż siatkę minimapy',
                    'showMiniMapGuides': 'Pokaż prowadnice na minimapie',
					'showExtraMiniMapGuides': 'Show extra minimap guides',
                    'showMiniMapGhostCells': 'Pokaż duchy kulek na minimapie',
                    'oneColoredTeammates': 'Jednokolorowi gracze',
                    'optimizedFood': 'Zoptymalizowany pokarm',
                    'rainbowFood': 'Kolorowy pokarm',
                    'oppColors': 'Kolory przeciwników',
                    'oppRings': 'Ringi przeciwników',
                    'virColors': 'Kolory wirusów',
                    'splitRange': 'Zasięg podziału',
                    'virusesRange': 'Zasięg wirusów',
                    'textStroke': 'Obwódki nazw i masy',
                    'namesStroke': 'Obwódki nazw',
                    'massStroke': 'Obwódki masy',
                    'cursorTracking': 'Śledzenie kursora',
                    'teammatesInd': 'Wskaźniki graczy teamu',
                    'mouseSplit': 'LPM - Split myszką',
                    'mouseFeed': 'PPM - Feed myszką',
                    'mouseInvert': 'Odwróć klawisze myszki',
                    'disableChat': 'Wyłącz czat',
                    'hideChat': 'Ukryj czat',
                    'chatSounds': 'Powiadomienia dźwiękowe',
                    'chatEmoticons': 'Emotikony',
                    'showChatImages': 'Pokaż obrazki na czacie',
                    'showChatVideos': 'Pokaż filmiki na czacie',
                    'showChatBox': 'Czatbox zamiast wyskakujących wiadomości',
                    'messageSound': 'Dźwięk powiadomienia o wiadomości',
                    'commandSound': 'Dźwięk powiadomienia o komendzie',
					'virusSoundurl': 'Virus shot sound',
					'virusSound': 'Virus shot sound',
					'jellyPhisycs': 'Jelly physics',
                    'showTop5': 'Pokaż top 5 teamu',
                    'showTargeting': 'Pokaż namierzanie',
                    'showTime': 'Pokaż aktualny czas',
                    'showLbData': 'Pokaż masę w topce',
                    'normalLb': 'Nagłówek \"Topka\"',
                    'centeredLb': 'Wyśrodkowana topka',
                    'fpsAtTop': 'Statystyki na górze',
                    'showStats': 'Pokaż statystyki',
                    'showStatsMass': 'Statystyki: Masa',
                    'showStatsSTE': 'Statystyki: STE',
                    'showStatsN16': 'Statystyki: n/16',
                    'showStatsFPS': 'Statystyki: FPS',
                    'blockPopups': 'Blokuj popupy (reklamy/sklep/zadanie)',
                    'hotkeys': 'Skróty klawiszowe',
                    'hk-inst-assign': 'Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.',
                    'hk-inst-delete': 'Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.',
                    'hk-inst-keys': 'Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.',
                    'hk-feed': 'Feed',
                    'hk-macroFeed': 'Szybki feed',
                    'hk-split': 'Podział',
                    'hk-doubleSplit': 'Podwójny podział',
                    'hk-split16': 'Podział na 16',
                    'hk-pause': 'Pauza kulki',
                    'hk-showTop5': 'Pokaż/ukryj top 5 teamu',
                    'hk-showTime': 'Pokaż/ukryj aktualny czas',
                    'hk-showSplitRange': 'Pokaż/ukryj zasięg podziału',
                    'hk-showSplitInd': 'Pokaż/ukryj zasięg podziału z ringami',
                    'hk-showTeammatesInd': 'Pokaż/ukryj wskaźniki graczy teamu',
                    'hk-showOppColors': 'Pokaż/ukryj kolory przeciwników',
                    'hk-toggleSkins': 'Przełącz skiny (własne/standardowe)',
                    'hk-showSkins': 'Pokaż/ukryj skiny',
                    'hk-transparentSkins': 'Włącz/wyłącz przezroczyste skiny',
                    'hk-showStats': 'Pokaż/ukryj statystyki gry',
                    'hk-toggleCells': 'Przełącz kulkę (najmniejsza/największa)',
                    'hk-showFood': 'Pokaż/ukryj pokarm',
                    'hk-showGrid': 'Pokaż/ukryj siatkę',
                    'hk-showMiniMapGuides': 'Pokaż/ukryj prowadnice na minimapie',
                    'hk-hideChat': 'Pokaż/ukryj czat',
                    'hk-showHUD': 'Pokaż/ukryj HUD',
                    'hk-copyLb': 'Kopiuj topkę',
                    'hk-showLb': 'Pokaż/ukryj topkę',
                    'hk-toggleAutoZoom': 'Włącz/wyłącz auto zoom',
                    'hk-resetZoom': 'Reset zoomu',
                    'hk-zoomLevel': 'Zoom - poziom',
                    'hk-toggleDeath': 'Przełącz miejsce śmierci',
                    'hk-clearChat': 'Pokaż historię czatu / Czyść czat',
                    'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
                    'hk-hideBots': 'Pokaż/ukryj małe boty',
                    'hk-showNames': 'Pokaż/ukryj nazwy',
                    'hk-hideTeammatesNames': 'Pokaż/ukryj nazwy graczy teamu',
                    'hk-showMass': 'Pokaż/ukryj masę',
                    'hk-showMiniMap': 'Pokaż/ukryj minimapę',
                    'hk-chatMessage': 'Napisz wiadomość na czacie',
                    'hk-quickResp': 'Szybkie odrodzenie (respawn)',
                    'hk-autoResp': 'Włącz/wyłacz auto odrodzenie',
                    'hk-switchServerMode': 'Przełącz serwer [publiczny/prywatny]',
                    'hk-showTargeting': 'Pokaż/ukryj panel namierzania',
                    'hk-voiceChat': 'Głos do tekstu',
					'hk-GhostCellsInfo': 'Show ghost cells information', 
					'hk-Autoplay': 'Auto Play',					
                    'hk-setTargeting': 'Włącz/wyłącz namierzanie (śledzenie)',
                    'hk-cancelTargeting': 'Zatrzymaj namierzanie',
                    'hk-changeTarget': 'Zmień cel',
                    'hk-privateMiniMap': 'Pokaż cel na minimapie',
                    'hk-showQuest': 'Pokaż/ukryj zadanie',
                    'commands': 'Komendy',
                    'comm1': 'Feeduj!',
                    'comm2': 'Dziel się!',
                    'comm3': 'Pomocy na %currentSector%!',
                    'comm4': 'Wróg na %currentSector%!',
                    'comm5': 'Zabij pomocnika!',
                    'comm6': 'Strzel z wirusa!',
                    'comm7': 'Zjedz wirusa!',
                    'comm8': 'Zjebałem, wybacz.',
                    'comm9': 'Ja pierdolę...',
                    'comm0': 'Kurwa mać!',
                    'comm10': 'Trick!',
                    'comm11': 'Lewo!',
                    'comm12': 'Góra!',
                    'comm13': 'Prawo!',
                    'comm14': 'Dół!',
                    'comm15': 'Fake Tricksplit',
                    'comm16': 'Popsplit',
                    'comm17': 'Double Popsplit',
                    'comm18': 'Reversed Tricksplit',
                    'comm19': 'Canonsplit',
                    'comm20': 'Reversed Canonsplit',
                    'comm21': 'Bowlingsplit',
                    'comm22': 'Auto feed trick',
                    'comm23': 'Pause',
                    'comm24': 'ANTI alarm stage 1',
                    'comm25': 'ANTI alarm stage 2',
                    'comm26': 'ANTI alarm stage 3',
                    'comm27': 'ANTI alarm stage 4',
                    'comm28': 'ANTI alarm stage 5',
                    'comm29': 'Presplit',
                    'comm30': 'Party Run tricks',
                    'saveComm': 'Zapisz komendy',
                    'theme': 'Wygląd',
                    'restoreThemeSettings': 'Przywróc ustawienia domyślne wyglądu',
                    'basicTheming': 'Podstawowy',
                    'themePreset': 'Motyw',
                    'themeType': 'Typ motywu',
                    'darkTheme': 'Ciemny motyw',
                    'lightTheme': 'Jasny motyw',
                    'mainColor': 'Kolor główny',
                    'bgColor': 'Tło',
                    'bordersColor': 'Granice mapy',
                    'gridColor': 'Siatka',
                    'sectorsColor': 'Czcionka sektorów',
                    'namesColor': 'Nazwy',
                    'namesStrokeColor': 'Obwódki nazw',
                    'massColor': 'Masa',
                    'massStrokeColor': 'Obwódki masy',
                    'virusColor': 'Wirusy',
                    'virusStrokeColor': 'Obwódki wirusów',
                    'virusGlowColor': "Virus Glow",
                    "borderGlowColor": "Border Glow",
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
                    'virusGlowSize': 'Virus Glow Size',
                    'borderGlowSize': 'Border Glow Size',
                    'foodColor': 'Pokarm',
                    'namesFont': 'Czcionka nazw',
                    'massFont': 'Czcionka masy',
                    'sectorsFont': 'Czcionka sektorów',
                    'namesScale': 'Skala nazw',
                    'massScale': 'Skala masy',
                    'virMassScale': 'Skala masy wirusów',
                    'strokeScale': 'Skala obwódek tekstu',
                    'foodSize': 'Wielkość pokarmu',
                    'bordersWidth': 'Grubość granic mapy',
                    'sectorsWidth': 'Grubość siatki sektorów',
                    'sectorsFontSize': 'Rozmiar czcionki sektorów',
                    'cellsAlpha': 'Przezroczystość kulek',
                    'skinsAlpha': 'Przezroczystość skinów',
                    'virusAlpha': 'Przezroczystość wirusów',
                    'textAlpha': 'Przezroczystość nazw i masy',
                    'virusStrokeSize': 'Grubość obwódki wirusów',
                    "virusGlowSize": "Virus Glow Size",
                    'teammatesIndColor': 'Wskaźnik gracza',
                    'cursorTrackingColor': 'Śledzenie kursora',
                    'splitRangeColor': 'Zasięg podziału',
                    'safeAreaColor': 'Bezpieczna strefa',
                    'dangerAreaColor': 'Strefa zagrożenia',
                    'ghostCellsColor': 'Duchy kulek',
                    'ghostCellsAlpha': 'Przezroczystość duchów kulek',
                    'menuTheming': 'Menu',
                    'menuPreset': 'Motyw menu',
                    'menuMainColor': 'Kolor główny',
                    'menuBtnTextColor': 'Tekst przycisku',
                    'menuPanelColor': 'Panel',
                    'menuPanelColor2': 'Panel (2)',
                    'menuTextColor': 'Tekst panelu',
                    'menuTextColor2': 'Tekst panelu (2)',
                    'btn1Color': 'Przycisk #1',
                    'btn1Color2': 'Przycisk #1 (2)',
                    'btn2Color': 'Przycisk #2',
                    'btn2Color2': 'Przycisk #2 (2)',
                    'btn3Color': 'Przycisk #3',
                    'btn3Color2': 'Przycisk #3 (2)',
                    'btn4Color': 'Przycisk #4',
                    'btn4Color2': 'Przycisk #4 (2)',
                    'menuBg': 'Grafika tła panelu',
                    'menuOpacity': 'Przezroczystość',
                    'hudTheming': 'HUD',
                    'hudMainColor': 'Kolor główny',
                    'hudColor': 'Tło',
                    'hudTextColor': 'Tekst',
                    'statsHudColor': 'Statystyki',
                    'timeHudColor': 'Czas',
                    'top5MassColor': 'Masa',
                    'lbMeColor': 'Topka - ja',
                    'lbTeammateColor': 'Topka - team',
                    'hudFont': 'Czcionka HUD',
                    'hudScale': 'Skala HUD',
                    'chatTheming': 'Czat',
                    'messageColor': 'Tło wiadomości',
                    'messageTextColor': 'Tekst wiadomości',
                    'messageTimeColor': 'Czas wiadomości',
                    'messageNickColor': 'Nick wiadomości',
                    'commandsColor': 'Tło komendy',
                    'commandsTextColor': 'Tekst komendy',
                    'commandsTimeColor': 'Czas komendy',
                    'commandsNickColor': 'Nick komendy',
                    'chatBoxColor': 'Tło czatboxu',
                    'chatScale': 'Skala czatu',
                    'miniMapTheming': 'Minimapa',
                    'miniMapSectorsColor': 'Sektory',
                    'miniMapSectorColor': 'Aktualny sektor',
                    'miniMapGuidesColor': 'Prowadnice',
                    'miniMapNickColor': 'Nick',
                    'miniMapNickStrokeColor': 'Obwódka nicku',
                    'miniMapMyCellColor': 'Moja kulka',
                    'miniMapMyCellStrokeColor': 'Obwódka mojej kulki',
                    'miniMapTeammatesColor': 'Gracze',
                    'miniMapDeathLocationColor': 'Miejsce śmierci',
                    'miniMapFont': 'Czcionka minimapy',
                    'miniMapNickFont': 'Czcionka nicku',
                    'miniMapWidth': 'Szerokość minimapy',
                    'miniMapSectorsOpacity': 'Przezroczystość sektorów',
                    'miniMapNickSize': 'Rozmiar nicku',
                    'miniMapNickStrokeSize': 'Grubość obwódki nicku',
                    'miniMapMyCellSize': 'Wielkość mojej kulki',
                    'miniMapMyCellStrokeSize': 'Grubość obwódki mojej kulki',
                    'miniMapTeammatesSize': 'Wielkość graczy',
                    'miniMapGhostCellsColor': 'Duchy kulek',
                    'miniMapGhostCellsAlpha': 'Przezroczystość duchów kulek',
                    'imagesTheming': 'Grafika / kursory',
                    'customBackground': 'Grafika tła',
                    'customCursor': 'Grafika kursora',
                    'hideChatMsgA': 'Czat został włączony!',
                    'hideChatMsgB': 'Czat został ukryty!',
                    'showSkinsMsgA': 'Skiny zostały włączone!',
                    'showSkinsMsgB': 'Skiny zostały ukryte!',
                    'hideSmallBotsMsgA': 'Małe boty stały się widoczne!',
                    'hideSmallBotsMsgB': 'Małe boty zostały ukryte!',
                    'autoRespMsgA': 'Auto odrodzenie zostało włączone!',
                    'autoRespMsgB': 'Auto odrodzenie zostało wyłączone!',
                    'autoZoomMsgA': 'Auto zoom został włączony!',
                    'autoZoomMsgB': 'Auto zoom został wyłączony!',
//                   'targetNotSet': 'Brak celu',
					'targetNotSet': '',
                    'targetDead': 'Nie żyje',
                    'targetDistance': 'Dystans',
                    'targetMass': 'Masa razem',
                    'totalPartyPlayers': '',
                    'totalPartyMass': '',
                    'exportImport': 'Eksport / import ustawień',
                    'exportSettings': 'Eksportuj ustawienia',
                    'exportInfo': 'Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.',
                    'importSettings': 'Importuj ustawienia',
                    'importInfo': 'Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk \"Importuj ustawienia\".',
                    'profile': 'Profil',
                    'profiles': 'Profile',
                    'skins': 'Skiny',
                    'moreSkins': 'Dodaj skiny',
                    'thanks': 'Dzięki Awesome!',
                    'saveSett': 'Zapisz ustawienia',
                    'saved': 'Zapisano!',
                    'resetSett': 'Resetuj ustawienia',
                    'close': 'Zamknij',
                    'enterChatMsg': 'Napisz wiadomość',
                    'activeParties': 'Aktywne party',
                    'noActiveParties': 'Brak aktywnych party ;(',
                    'playlist': 'Playlista',
                    'pause': 'PAUZA!',
                    'visit': 'Odwiedź',
                    'exit': 'Legend mod Express: Czy na pewno chcesz opuścic grę?',
                    'blockWarn': 'UWAGA! Popupy zostały zablokowane w ustawieniach.',
                    'unblockPopups': 'Odblokuj tymczasowo',
                    'mass': 'Masa',
                    'score': 'Top',
                    'leaderboard': 'Topka',
                    'user': 'Użytkownik',
                    'userMuted': 'Użytkownik %user% został wyciszony.',
                    'userUnmuted': 'Wyłączono wyciszenie użytkownika %user%.',
                    'mute': 'Wycisz',
                    'unmute': 'Wyłącz wyciszenie',
                    'mutedUsers': 'Wyciszeni użytkownicy',
                    'activeUsers': 'Aktywni użytkownicy',
                    'showActiveUsers': 'Pokaż aktywnych użytkowników',
                    'none': 'Brak',
                    'sounds': 'Dźwięki',
                    'page_back_button': 'Wróć',
                    'page_create_party': 'Stwórz party',
                    'page_join_party': 'Dołącz',
                    'page_login_and_play': 'Zaloguj',
                    'page_logout': 'Wyloguj',
                    'page_menu_login_facebook': 'Zaloguj z Facebook',
                    'page_menu_login_google': 'Zaloguj z Google',
                    'page_menu_main_free_coins': 'Darmowe Monety',
                    'page_menu_main_gifts': 'Prezenty',
                    'page_menu_main_dailyquests': 'Zadania',
                    'page_party_join_error': 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
                    'page_play': 'Graj',
                    'page_play_as_guest': 'Graj jako gość',
                    'page_shop': 'Sklep',
                    'page_spectate': 'Obserwuj',
                    'page_stats': 'Statystyki'
                },
                'en': {
                    'start': 'Home',
                    'settings': 'Settings',
                    'restoreSettings': 'Restore default settings',
                    'animationGroup': 'Animation',
                    'zoomGroup': 'Zoom',
                    'respGroup': 'Respawn',
                    'namesGroup': 'Names',
                    'massGroup': 'Mass',
                    'skinsGroup': 'Skins',
                    'foodGroup': 'Food',
                    'transparencyGroup': 'Transparency / colors',
                    'gridGroup': 'Grid / sectors',
                    'miniMapGroup': 'Minimap',
                    'helpersGroup': 'Helpers',
                    'mouseGroup': 'Mouse control',
                    'hudGroup': 'HUD',
                    'chatGroup': 'Chat',
                    'statsGroup': 'Stats',
                    'extrasGroup': 'Extras',
                    'noSkins': 'No skins',
                    'noNames': 'No names',
                    'noColors': 'No colors',
                    'showMass': 'Show mass',
                    'skipStats': 'Skip stats after death',
                    'showQuest': 'Show quest',
                    'autoZoom': 'Auto zoom',
                    'animation': 'Animation delay',
                    'suckAnimation': 'Cell Eat [Sucking] Animation',
                    'virusGlow': 'Virus Glow',
                    'borderGlow': 'Border Glow',
                    'zoomSpeedValue2': 'Zoom speed',
                    'quickResp': 'Quick respawn (hotkey)',
                    'autoResp': 'Auto respawn',
                    'autoHideCellsInfo': 'Auto hide names and mass',
                    'autoHideNames': 'Auto hide names',
                    'autoHideMass': 'Auto hide mass',
                    'autoHideFood': 'Auto hide food (mass)',
                    'autoHideFoodOnZoom': 'Auto hide food (zoom)',
                    'optimizedNames': 'Optimized names',
                    'hideMyName': 'Hide my name',
                    'hideTeammatesNames': 'Hide teammates names',
                    'optimizedMass': 'Optimized mass (+/-2%)',
                    'shortMass': 'Short mass (k)',
                    'virMassShots': 'Virus shots',
                    'hideMyMass': 'Hide my mass',
                    'hideEnemiesMass': 'Hide enemies mass',
                    'vanillaSkins': 'Vanilla skins',
                    'customSkins': 'Custom skins',
					'videoSkins': 'Video skins (.mp4 .webm .ogv)',
					'videoSkinsMusic': 'Sound from other\'s Video skins when both C3',
                    'myTransparentSkin': 'My transparent skin',
                    'myCustomColor': 'My custom color',
                    'transparentCells': 'Transparent cells',
                    'transparentViruses': 'Transparent viruses',
                    'transparentSkins': 'Transparent skins',
                    'showGrid': 'Show grid',
                    'showBgSectors': 'Show background sectors',
                    'showMapBorders': 'Show map borders',
                    'showGhostCells': 'Ghost cells (fps drop)',
					'showGhostCellsInfo': 'Ghost cells info (confusing)',
                    'showMiniMap': 'Show minimap',
                    'showMiniMapGrid': 'Show minimap grid',
                    'showMiniMapGuides': 'Show minimap guides',
					'showExtraMiniMapGuides': 'Show extra minimap guides',
                    'showMiniMapGhostCells': 'Show ghost cells',
                    'oneColoredTeammates': 'One-colored teammates',
                    'optimizedFood': 'Optimized food',
                    'rainbowFood': 'Rainbow food',
                    'oppColors': 'Opponents colors',
                    'oppRings': 'Opponents rings',
                    'virColors': 'Viruses colors',
                    'splitRange': 'Split range',
                    'virusesRange': 'Viruses range',
                    'textStroke': 'Names and mass stroke',
                    'namesStroke': 'Names stroke',
                    'massStroke': 'Mass stroke',
                    'cursorTracking': 'Cursor tracking',
                    'teammatesInd': 'Teammates indicators',
                    'mouseSplit': 'LMB - Mouse split',
                    'mouseFeed': 'RMB - Mouse feed',
                    'mouseInvert': 'Invert mouse buttons',
                    'disableChat': 'Disable chat',
                    'hideChat': 'Hide chat',
                    'chatSounds': 'Sound notifications',
                    'chatEmoticons': 'Emoticons',
                    'showChatImages': 'Show images on chat',
                    'showChatVideos': 'Show videos on chat',
                    'showChatBox': 'Chatbox instead of popups',
                    'messageSound': 'Message notification sound',
                    'commandSound': 'Command notification sound',
					'virusSoundurl': 'Virus shot sound',
					'virusSound': 'Virus shot sound',
					'jellyPhisycs': 'Jelly physics',
                    'showTop5': 'Show teamboard',
                    'showTargeting': 'Show targeting',
                    'showTime': 'Show current time',
                    'showLbData': 'Show leaderboard mass',
                    'normalLb': '\"Leaderboard\" header',
                    'centeredLb': 'Centered leaderboard',
                    'fpsAtTop': 'Game stats at the top',
                    'showStats': 'Show game stats',
                    'showStatsMass': 'Game stats: Mass',
                    'showStatsSTE': 'Game stats: STE',
                    'showStatsN16': 'Game stats: n/16',
                    'showStatsFPS': 'Game stats: FPS',
                    'blockPopups': 'Block popups (ads/shop/quest)',
                    'hotkeys': 'Hotkeys',
                    'hk-inst-assign': 'To assign a hotkey click on the input field and press your chosen key.',
                    'hk-inst-delete': 'To delete a hotkey click on the input field and press the DELETE key.',
                    'hk-inst-keys': 'Possible key combinations with the CTRL and ALT keys.',
                    'hk-feed': 'Feed',
                    'hk-macroFeed': 'Macro feed',
                    'hk-split': 'Split',
                    'hk-doubleSplit': 'Double split',
                    'hk-split16': 'Split 16',
                    'hk-pause': 'Cell pause',
                    'hk-showTop5': 'Show/hide teamboard',
                    'hk-showTime': 'Show/hide current time',
                    'hk-showSplitRange': 'Show/hide split range',
                    'hk-showSplitInd': 'Show/hide split indicators',
                    'hk-showTeammatesInd': 'Show/hide teammates indicators',
                    'hk-showOppColors': 'Show/hide opponents colors',
                    'hk-toggleSkins': 'Toggle skins (custom/default)',
                    'hk-showSkins': 'Show/hide skins',
                    'hk-transparentSkins': 'Toggle transparent skins',
                    'hk-showStats': 'Show/hide game stats',
                    'hk-toggleCells': 'Toggle own cells (smallest/biggest)',
                    'hk-showFood': 'Show/hide food',
                    'hk-showGrid': 'Show/hide grid',
                    'hk-showMiniMapGuides': 'Show/hide minimap guides',
                    'hk-hideChat': 'Show/hide chat',
                    'hk-showHUD': 'Show/hide HUD',
                    'hk-copyLb': 'Copy leaderboard',
                    'hk-showLb': 'Show/hide leaderboard',
                    'hk-toggleAutoZoom': 'Toggle auto zoom',
                    'hk-resetZoom': 'Reset zoom',
                    'hk-zoomLevel': 'Zoom level',
                    'hk-toggleDeath': 'Toggle death location',
                    'hk-clearChat': 'Show chat history / Clear chat',
                    'hk-showBgSectors': 'Show/hide background sectors',
                    'hk-hideBots': 'Show/hide small bots',
                    'hk-showNames': 'Show/hide names',
                    'hk-hideTeammatesNames': 'Show/hide teammates names',
                    'hk-showMass': 'Show/hide mass',
                    'hk-showMiniMap': 'Show/hide minimap',
                    'hk-chatMessage': 'Enter chat message',
                    'hk-quickResp': 'Quick respawn',
                    'hk-autoResp': 'Toggle auto respawn',
                    'hk-switchServerMode': 'Switch server [public/private]',
                    'hk-showTargeting': 'Show/hide targeting panel',
                    'hk-voiceChat': 'Voice to text',
					'hk-GhostCellsInfo': ' Show ghost cells information', 
					'hk-Autoplay': 'Auto Play',	
                    'hk-setTargeting': 'Start/stop targeting (following)',
                    'hk-cancelTargeting': 'Cancel targeting',
                    'hk-changeTarget': 'Change target',
                    'hk-privateMiniMap': 'Show target on the minimap',
                    'hk-showQuest': 'Show/hide quest',
                    'commands': 'Commands',
                    'comm1': 'Feed me!',
                    'comm2': 'Split into me!',
                    'comm3': 'Need backup at %currentSector%!',
                    'comm4': 'Enemy spotted at %currentSector%!',
                    'comm5': 'Need a teammate!',
                    'comm6': 'Tank the virus!',
                    'comm7': 'Eat the virus!',
                    'comm8': 'Let\'s bait!',
                    'comm9': 'Fake tricksplit!',
                    'comm0': 'Fuck!',
                    'comm10': 'Tricksplit!',
                    'comm11': 'Left!',
                    'comm12': 'Up!',
                    'comm13': 'Right!',
                    'comm14': 'Bottom!',
                    'comm15': 'Fake Tricksplit',
                    'comm16': 'Popsplit',
                    'comm17': 'Double Popsplit',
                    'comm18': 'Reversed Tricksplit',
                    'comm19': 'Canonsplit',
                    'comm20': 'Reversed Canonsplit',
                    'comm21': 'Bowlingsplit',
                    'comm22': 'Auto feed trick',
                    'comm23': 'Pause',
                    'comm24': 'ANTI alarm stage 1',
                    'comm25': 'ANTI alarm stage 2',
                    'comm26': 'ANTI alarm stage 3',
                    'comm27': 'ANTI alarm stage 4',
                    'comm28': 'ANTI alarm stage 5',
                    'comm29': 'Presplit',
                    'comm30': 'Party Run tricks',
                    'saveComm': 'Save commands',
                    'theme': 'Theme',
                    'restoreThemeSettings': 'Restore theme default settings',
                    'basicTheming': 'Basic theming',
                    'themePreset': 'Theme preset',
                    'themeType': 'Theme type',
                    'darkTheme': 'Dark theme',
                    'lightTheme': 'Light theme',
                    'mainColor': 'Main color',
                    'bgColor': 'Background',
                    'bordersColor': 'Map borders',
                    'gridColor': 'Grid',
                    'sectorsColor': 'Sectors font',
                    'namesColor': 'Names',
                    'namesStrokeColor': 'Names stroke',
                    'massColor': 'Mass',
                    'massStrokeColor': 'Mass stroke',
                    'virusColor': 'Virus',
                    'virusStrokeColor': 'Virus stroke',
                    'virusGlowColor': "Virus Glow",
                    "borderGlowColor": "Border Glow",
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
                    'virusGlowSize': 'Virus Glow Size',
                    'borderGlowSize': 'Border Glow Size',
                    'foodColor': 'Food',
                    'namesFont': 'Names font',
                    'massFont': 'Mass font',
                    'sectorsFont': 'Sectors font',
                    'namesScale': 'Names scale',
                    'massScale': 'Mass scale',
                    'virMassScale': 'Virus mass scale',
                    'strokeScale': 'Text stroke scale',
                    'foodSize': 'Food size',
                    'bordersWidth': 'Map borders width',
                    'sectorsWidth': 'Sectors grid width',
                    'sectorsFontSize': 'Sectors font size',
                    'cellsAlpha': 'Cells transparency',
                    'skinsAlpha': 'Skins transparency',
                    'virusAlpha': 'Virus transparency',
                    'textAlpha': 'Names & mass transparency',
                    'virusStrokeSize': 'Virus stroke size',
                    "virusGlowSize": "Virus Glow Size",
                    'teammatesIndColor': 'Teammate indicator',
                    'cursorTrackingColor': 'Cursor tracking',
                    'splitRangeColor': 'Split range',
                    'safeAreaColor': 'Safe area',
                    'dangerAreaColor': 'Danger area',
                    'ghostCellsColor': 'Ghost cells',
                    'ghostCellsAlpha': 'Ghost cells transparency',
                    'menuTheming': 'Menu',
                    'menuPreset': 'Menu theme',
                    'menuMainColor': 'Main color',
                    'menuBtnTextColor': 'Button text',
                    'menuPanelColor': 'Panel',
                    'menuPanelColor2': 'Panel (2)',
                    'menuTextColor': 'Panel text',
                    'menuTextColor2': 'Panel text (2)',
                    'btn1Color': 'Button #1',
                    'btn1Color2': 'Button #1 (2)',
                    'btn2Color': 'Button #2',
                    'btn2Color2': 'Button #2 (2)',
                    'btn3Color': 'Button #3',
                    'btn3Color2': 'Button #3 (2)',
                    'btn4Color': 'Button #4',
                    'btn4Color2': 'Button #4 (2)',
                    'menuBg': 'Panel background image',
                    'menuOpacity': 'Transparency',
                    'hudTheming': 'HUD',
                    'hudMainColor': 'Main color',
                    'hudColor': 'Background',
                    'hudTextColor': 'Text',
                    'statsHudColor': 'Stats',
                    'timeHudColor': 'Time',
                    'top5MassColor': 'Mass',
                    'lbMeColor': 'Leaderboard - me',
                    'lbTeammateColor': 'Leaderboard - teammate',
                    'hudFont': 'HUD font',
                    'hudScale': 'HUD scale',
                    'chatTheming': 'Chat',
                    'messageColor': 'Message background',
                    'messageTextColor': 'Message text',
                    'messageTimeColor': 'Message time',
                    'messageNickColor': 'Message nick',
                    'commandsColor': 'Command background',
                    'commandsTextColor': 'Command text',
                    'commandsTimeColor': 'Command time',
                    'commandsNickColor': 'Command nick',
                    'chatBoxColor': 'Chatbox color',
                    'chatScale': 'Chat scale',
                    'miniMapTheming': 'Minimap',
                    'miniMapSectorsColor': 'Sectors',
                    'miniMapSectorColor': 'Current sector',
                    'miniMapGuidesColor': 'Guides',
                    'miniMapNickColor': 'Nick',
                    'miniMapNickStrokeColor': 'Nick stroke',
                    'miniMapMyCellColor': 'My cell',
                    'miniMapMyCellStrokeColor': 'My cell stroke',
                    'miniMapTeammatesColor': 'Teammates',
                    'miniMapDeathLocationColor': 'Death location',
                    'miniMapFont': 'Minimap font',
                    'miniMapNickFont': 'Nick font',
                    'miniMapWidth': 'Minimap width',
                    'miniMapSectorsOpacity': 'Sectors transparency',
                    'miniMapNickSize': 'Nick size',
                    'miniMapNickStrokeSize': 'Nick stroke size',
                    'miniMapMyCellSize': 'My cell size',
                    'miniMapMyCellStrokeSize': 'My cell stroke size',
                    'miniMapTeammatesSize': 'Teammates size',
                    'miniMapGhostCellsColor': 'Ghost cells',
                    'miniMapGhostCellsAlpha': 'Ghost cells transparency',
                    'imagesTheming': 'Graphics / cursors',
                    'customBackground': 'Custom background image',
                    'customCursor': 'Custom cursor image',
                    'hideChatMsgA': 'Chat is visible!',
                    'hideChatMsgB': 'Chat is hidden!',
                    'showSkinsMsgA': 'Skins are visible!',
                    'showSkinsMsgB': 'Skins are hidden!',
                    'hideSmallBotsMsgA': 'Small bots are visible!',
                    'hideSmallBotsMsgB': 'Small bots are hidden!',
                    'autoRespMsgA': 'Auto respawn is on!',
                    'autoRespMsgB': 'Auto respawn is off!',
                    'autoZoomMsgA': 'Auto zoom is on!',
                    'autoZoomMsgB': 'Auto zoom is off!',
                    'targetNotSet': '',
                    'targetDead': 'Dead',
                    'targetDistance': 'Distance',
                    'targetMass': 'Mass altogether',
                    'totalPartyPlayers': '',
                    'totalPartyMass': '',
                    'exportImport': 'Export / import settings',
                    'exportSettings': 'Export settings',
                    'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
                    'importSettings': 'Import settings',
                    'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
                    'profile': 'Profile',
                    'profiles': 'Profiles',
                    'skins': 'Skins',
                    'moreSkins': 'Add skins',
                    'thanks': 'Thanks to Awesome!',
                    'saveSett': 'Save settings',
                    'saved': 'Saved!',
                    'resetSett': 'Reset to default',
                    'close': 'Close',
                    'enterChatMsg': 'Enter chat message',
                    'activeParties': 'Active parties',
                    'noActiveParties': 'No active parties ;(',
                    'playlist': 'Playlist',
                    'pause': 'PAUSE!',
                    'visit': 'Visit',
                    'exit': 'Legend mod Express: Are you sure you want to quit the game?',
                    'blockWarn': 'WARNING! Popups are blocked in the settings.',
                    'unblockPopups': 'Temporary unblock',
                    'mass': 'Mass',
                    'score': 'Score',
                    'leaderboard': 'Leaderboard',
                    'user': 'User',
                    'userMuted': 'User %user% has been muted.',
                    'userUnmuted': 'User %user% has been unmuted.',
                    'mute': 'Mute',
                    'unmute': 'Unmute',
                    'mutedUsers': 'Muted users',
                    'activeUsers': 'Active users',
                    'showActiveUsers': 'Show active users',
                    'none': 'None',
                    'sounds': 'Sounds',
                    'page_menu_main_free_coins': 'Free Coins',
                    'page_menu_main_gifts': 'Gifts',
                    'page_menu_main_dailyquests': 'Daily Quest',
                    'page_shop': 'Shop'
                }
            },
            r = 'en',
            l = window.navigator.language || window.navigator.userLanguage;
        l && n.hasOwnProperty(l) && (r = l);
        var h = n[r];
        if (n[r].comm15 != undefined) {
            //console.log(h.comm15);
        }
        c = {
            'comm1': h.comm1,
            'comm2': h.comm2,
            'comm3': h.comm3,
            'comm4': h.comm4,
            'comm5': h.comm5,
            'comm6': h.comm6,
            'comm7': h.comm7,
            'comm8': h.comm8,
            'comm9': h.comm9,
            'comm10': h.comm10,
            'comm0': h.comm0,
            'comm11': h.comm11,
            'comm12': h.comm12,
            'comm13': h.comm13,
            'comm14': h.comm14,
            'comm15': h.comm15,
            'comm16': h.comm16,
            'comm17': h.comm17,
            'comm18': h.comm18,
            'comm19': h.comm19,
            'comm20': h.comm20,
            'comm21': h.comm21,
            'comm22': h.comm22,
            'comm23': h.comm23,
            'comm24': h.comm24,
            'comm25': h.comm25,
            'comm26': h.comm26,
            'comm27': h.comm27,
            'comm28': h.comm28,
            'comm29': h.comm29,
            'comm30': h.comm30
        }
        /*}
		else{
            c = { //new JSON
                'comm1': h.comm1,
                'comm2': h.comm2,
                'comm3': h.comm3,
                'comm4': h.comm4,
                'comm5': h.comm5,
                'comm6': h.comm6,
                'comm7': h.comm7,
                'comm8': h.comm8,
                'comm9': h.comm9,
                'comm10': h.comm10,
                'comm11': h.comm11,
                'comm12': h.comm12,
                'comm13': h.comm13,
                'comm14': h.comm14,
				'comm15': 'Fake Tricksplit',
					'comm16': 'Popsplit',
					'comm17': 'Double Popsplit',
					'comm18': 'Reversed Tricksplit',
					'comm19': 'Canonsplit',
					'comm20': 'Reversed Canonsplit',
					'comm21': 'Bowlingsplit',
					'comm22': 'Auto feed trick',
					'comm23': 'Pause',
					'comm24': 'ANTI alarm stage 1',
					'comm25': 'ANTI alarm stage 2',
					'comm26': 'ANTI alarm stage 3',
					'comm27': 'ANTI alarm stage 4',
					'comm28': 'ANTI alarm stage 5',
					'comm29': 'Presplit',
					'comm30': 'Party Run tricks'				
			}; 		
		};
		n[r].comm15=c.comm15; n[r].comm16=c.comm16; n[r].comm17=c.comm17; n[r].comm18=c.comm18; n[r].comm19=c.comm19; n[r].comm20=c.comm20; n[r].comm21=c.comm21; n[r].comm22=c.comm22; n[r].comm23=c.comm23; n[r].comm24=c.comm24;
		n[r].comm25=c.comm25; n[r].comm26=c.comm26; n[r].comm27=c.comm27; n[r].comm28=c.comm28; n[r].comm29=c.comm29; n[r].comm30=c.comm30;		*/
        u = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#39;',
                '/': '&#x2F;'
            },
            d = {
                ':)': 'smile.svg',
                ';)': 'wink.svg',
                '=)': 'smirk.svg',
                ':D': 'grin.svg',
                'X-D': 'xgrin.svg',
                '=D': 'joy.svg',
                ':(': 'sad.svg',
                ';(': 'cry.svg',
                ':P': 'tongue.svg',
                ';P': 'tonguew.svg',
                ':*': 'kiss.svg',
                '$)': 'smileh.svg',
                '<3': 'heart.svg',
                '8=)': 'cool.svg',
                ':o': 'astonished.svg',
                '(:|': 'sweat.svg',
                ':|': 'neutral.svg',
                ':\\': 'unamused.svg',
                ':@': 'pouting.svg',
                '|-)': 'sleep.svg',
                '^_^': 'relaxed.svg',
                '-_-': 'expressionless.svg',
                '$_$': 'money.svg',
                'O:)': 'angel.svg',
                '3:)': 'devil.svg',
                '(poop)': 'poo.svg',
                '(fuck)': 'finger.svg',
                '(clap)': 'clap.svg',
                '(ok)': 'ok.svg',
                '(victory)': 'victory.svg',
                '(y)': 'thumb.svg',
                '(n)': 'thumbd.svg',

                '(angry)': 'newangry.svg',
                '(clown)': 'newclown.svg',
                '(crazy)': 'newcrazy.svg',
                '(devil)': 'newdevil.svg',
                '(devil2)': 'newdevil2.svg',
                '(fb)': 'newfb.svg',
                '(google)': 'newgplus.svg',
                '(ghost)': 'newghost.svg',
                '(heel)': 'newheel.svg',
                '(kiss)': 'newkiss.svg',
                '(lipstick)': 'newlipstick.svg',
                //				'(rage)': 'newrage.svg',
                '(teacher)': 'newteacher.svg',
                '(together)': 'newtogether.svg',
                '(toothy)': 'newtoothy.svg',
                '(baby)': 'newbaby.svg',
                '(wow)': 'newwow.svg'
            },
            p = [{
                    name: "imgur.com",
                    url: "https://imgur.com/",
                    example: "https://i.imgur.com/xdmUp5N.png",
                    pattern: "https?://w+.imgur.com/w{6,}.(?:%file_ext%)??d*"
                },
                {
                    name: "put.re",
                    url: "https://put.re/",
                    example: "https://s.put.re/iYHAW65g.png",
                    pattern: "https?://w+.put.re/w{8,}.(?:%file_ext%)"
                },
                {
                    name: "postimages.org",
                    url: "https://postimages.org/",
                    example: "https://i.postimg.cc/zzK0sRPg/xdmUp5N.png",
                    pattern: "https?://w+.postimg.cc/w{8,}/w+.(?:%file_ext%)"
                }
            ],
            f = {
                'ogario-v3': {
                    'name': 'OGARio v3',
                    'darkTheme': true,
                    'mainColor': '#01d9cc',
                    'bgColor': '#000a11',
                    'bordersColor': '#01d9cc',
                    'gridColor': '#00243e',
                    'sectorsColor': '#00243e',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#002f52',
                    'virusStrokeColor': '#00b9e8',
                    'virusGlowColor': '#fff',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#5000ff',
                    'teammatesIndColor': '#ffffff',
                    'cursorTrackingColor': '#ffffff',
                    'splitRangeColor': '#ffffff',
                    'safeAreaColor': '#ffffff',
                    'dangerAreaColor': '#bf00aa',
                    'namesFont': 'ubuntu-bold',
                    'massFont': 'ubuntu-bold',
                    'sectorsFont': 'ubuntu',
                    'namesScale': 1,
                    'massScale': 3,
                    'foodSize': 5,
                    'bordersWidth': 40,
                    'sectorsWidth': 40,
                    'sectorsFontSize': 1200,
                    'cellsAlpha': 0.99,
                    'skinsAlpha': 0.99,
                    'virusAlpha': 0.25,
                    'textAlpha': 1,
                    'virusStrokeSize': 20,
                    "virusGlowSize": "#fff",
                    "virusGlowSize": 14,
                    "borderGlowSize": 14,
                    'menuPreset': 'ogario-v3',
                    'menuMainColor': '#01d9cc',
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#00243e',
                    'menuPanelColor2': '#002f52',
                    'menuTextColor': '#ffffff',
                    'menuTextColor2': '#8096a7',
                    'btn1Color': '#018cf6',
                    'btn1Color2': '#0176ce',
                    'btn2Color': '#00b9e8',
                    'btn2Color2': '#0099c0',
                    'btn3Color': '#8d5fe6',
                    'btn3Color2': '#814ee3',
                    'btn4Color': '#bf00aa',
                    'btn4Color2': '#a80096',
                    'menuBg': 'https://jimboy3100.github.io/banners/static/img/pattern.png',
                    'menuOpacity': 0.96,
                    'hudMainColor': '#01d9cc',
                    'hudColor': 'rgba(0,0,0,0.4)',
                    'hudTextColor': '#ffffff',
                    'statsHudColor': '#ffffff',
                    'timeHudColor': '#01d9cc',
                    'top5MassColor': '#bf00aa',
                    'lbMeColor': '#bf00aa',
                    'lbTeammateColor': '#018cf6',
                    'hudFont': 'ubuntu-bold',
                    'hudScale': 1,
                    'messageColor': 'rgba(0,0,0,0.4)',
                    'messageTextColor': '#ffffff',
                    'messageTimeColor': '#018cf6',
                    'messageNickColor': '#01d9cc',
                    'commandsColor': 'rgba(191,0,170,0.9)',
                    'commandsTextColor': '#ffffff',
                    'commandsTimeColor': '#bf00aa',
                    'commandsNickColor': '#ffffff',
                    'chatBoxColor': 'rgba(0,0,0,0.4)',
                    'chatScale': 1,
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#01d9cc',
                    'miniMapGuidesColor': '#bf00aa',
                    'miniMapNickColor': '#ffffff',
                    'miniMapNickStrokeColor': '#000000',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#bf00aa',
                    'miniMapTeammatesColor': '#01d9cc',
                    'miniMapDeathLocationColor': '#bf00aa',
                    'miniMapFont': 'ubuntu-bold',
                    'miniMapNickFont': 'ubuntu-bold',
                    'miniMapWidth': 240,
                    'miniMapSectorsOpacity': 0.1,
                    'miniMapNickSize': 11,
                    'miniMapNickStrokeSize': 2,
                    'miniMapMyCellSize': 7.5,
                    'miniMapMyCellStrokeSize': 4,
                    'miniMapTeammatesSize': 5.5,
                    'customBackground': '',
                    'customCursor': 'https://jimboy3100.github.io/cursors/cursor_02.cur'
                },
                'ogario-orange': {
                    'name': 'OGARio v2',
                    'darkTheme': true,
                    'mainColor': '#ff7800',
                    'bgColor': '#111111',
                    'bordersColor': '#ff7800',
                    'gridColor': '#292929',
                    'sectorsColor': '#292929',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#666666',
                    'virusStrokeColor': '#666666',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#e16400',
                    'hudMainColor': '#ff7800',
                    'statsHudColor': '#ff7800',
                    'top5MassColor': '#ff7800',
                    'timeHudColor': '#ff7800',
                    'messageNickColor': '#ff7800',
                    'commandsColor': 'rgba(255,120,0,0.9)',
                    'commandsTimeColor': '#ff7800',
                    'commandsTextColor': '#ffffff',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#ff7800',
                    'miniMapGuidesColor': '#ff7800',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#ff7800',
                    'miniMapTeammatesColor': '#ff7800',
                    'miniMapDeathLocationColor': '#ff7800',
                    'miniMapSectorsOpacity': 0.1
                },
                'ogario-gold': {
                    'name': 'OGARio LE',
                    'darkTheme': true,
                    'mainColor': '#b5a642',
                    'bgColor': '#000000',
                    'bordersColor': '#b5a642',
                    'gridColor': '#111111',
                    'sectorsColor': '#111111',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#666666',
                    'virusStrokeColor': '#666666',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#998c36',
                    'hudMainColor': '#b5a642',
                    'statsHudColor': '#b5a642',
                    'top5MassColor': '#b5a642',
                    'timeHudColor': '#b5a642',
                    'messageNickColor': '#b5a642',
                    'commandsColor': 'rgba(181,166,66,0.9)',
                    'commandsTimeColor': '#b5a642',
                    'commandsTextColor': '#ffffff',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#b5a642',
                    'miniMapGuidesColor': '#b5a642',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#b5a642',
                    'miniMapTeammatesColor': '#b5a642',
                    'miniMapDeathLocationColor': '#b5a642',
                    'miniMapSectorsOpacity': 0.1
                },
                'sniikz-style': {
                    'name': 'SniiKz\'s Style',
                    'darkTheme': true,
                    'mainColor': '#01d9cc',
                    'bgColor': '#000000',
                    'bordersColor': '#ffffff',
                    'gridColor': '#00243e',
                    'sectorsColor': '#00243e',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#3b3b3b',
                    'virusStrokeColor': '#ffffff',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#5000ff',
                    'teammatesIndColor': '#ffffff',
                    'cursorTrackingColor': '#ffffff',
                    'splitRangeColor': '#ffffff',
                    'safeAreaColor': '#ffffff',
                    'dangerAreaColor': '#bf00aa',
                    'massScale': 4,
                    'foodSize': 1,
                    'bordersWidth': 40,
                    'sectorsWidth': 40,
                    'sectorsFontSize': 1200,
                    'cellsAlpha': 0.99,
                    'skinsAlpha': 0.99,
                    'virusAlpha': 0.4,
                    'virusStrokeSize': 10,
                    "virusStrokeSize": 20,
                    "virusGlowSize": 14,
                    "borderGlowSize": 14,
                    'menuPreset': 'ogario-v3',
                    'menuMainColor': '#fc0079',
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#050008',
                    'menuPanelColor2': '#1d0526',
                    'menuTextColor': '#ffffff',
                    'menuTextColor2': '#65458f',
                    'btn1Color': '#4f0242',
                    'btn1Color2': '#3b0431',
                    'btn2Color': '#6b0036',
                    'btn2Color2': '#4d0227',
                    'btn3Color': '#aa084e',
                    'btn3Color2': '#80063b',
                    'btn4Color': '#aa084e',
                    'btn4Color2': '#8a063f',
                    'menuBg': 'https://jimboy3100.github.io/banners/static/img/pattern.png',
                    'menuOpacity': 1,
                    'hudMainColor': '#5974ff',
                    'hudColor': 'rgba(36,36,36,0.49)',
                    'hudTextColor': '#ffffff',
                    'statsHudColor': '#ffffff',
                    'timeHudColor': '#737373',
                    'top5MassColor': '#1fe000',
                    'lbMeColor': '#bf00aa',
                    'lbTeammateColor': '#018cf6',
                    'hudScale': 1.15,
                    'messageColor': 'rgba(0,0,0,0.4)',
                    'messageTextColor': '#e8e8e8',
                    'messageTimeColor': '#545454',
                    'messageNickColor': '#05ff00',
                    'commandsColor': 'rgba(36,36,36,0.9)',
                    'commandsTextColor': '#ffffff',
                    'commandsTimeColor': '#545454',
                    'commandsNickColor': '#ffffff',
                    'chatBoxColor': 'rgba(0,0,0,0.4)',
                    'chatScale': 1,
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#000000',
                    'miniMapGuidesColor': '#ff00a8',
                    'miniMapNickColor': '#ffffff',
                    'miniMapNickStrokeColor': '#4d4d4d',
                    'miniMapMyCellColor': '#f0ff3d',
                    'miniMapMyCellStrokeColor': '#acba07',
                    'miniMapTeammatesColor': '#305eff',
                    'miniMapDeathLocationColor': '#2b2b2b',
                    'miniMapWidth': 250,
                    'miniMapSectorsOpacity': 0.1,
                    'miniMapNickSize': 9,
                    'miniMapNickStrokeSize': 0,
                    'miniMapMyCellSize': 5,
                    'miniMapMyCellStrokeSize': 0,
                    'miniMapTeammatesSize': 5,
                    'customBackground': '',
                    'customCursor': 'https://jimboy3100.github.io/cursors/cursor_01.cur'
                },
                'hkg-style': {
                    'name': 'HKG Style',
                    'darkTheme': true,
                    'mainColor': '#651fff',
                    'bgColor': '#000000',
                    'bordersColor': '#ffffff',
                    'gridColor': '#111111',
                    'sectorsColor': '#111111',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#666666',
                    'virusStrokeColor': '#666666',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#651fff',
                    'hudMainColor': '#651fff',
                    'statsHudColor': '#651fff',
                    'top5MassColor': '#651fff',
                    'timeHudColor': '#651fff',
                    'messageNickColor': '#651fff',
                    'commandsColor': 'rgba(101,31,255,0.9)',
                    'commandsTimeColor': '#651fff',
                    'commandsTextColor': '#ffffff',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#651fff',
                    'miniMapGuidesColor': '#651fff',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#651fff',
                    'miniMapTeammatesColor': '#651fff',
                    'miniMapDeathLocationColor': '#651fff',
                    'miniMapSectorsOpacity': 0.1
                },
                'agario-light': {
                    'name': 'Agar.io Light',
                    'darkTheme': false,
                    'mainColor': '#ffffff',
                    'bgColor': '#f2fbff',
                    'bordersColor': '#858a8c',
                    'gridColor': '#ced6d9',
                    'sectorsColor': '#ced6d9',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#33ff33',
                    'virusStrokeColor': '#2de52d',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#2de52d',
                    'hudMainColor': '#ffffff',
                    'statsHudColor': '#ffffff',
                    'top5MassColor': '#ffffff',
                    'timeHudColor': '#ffffff',
                    'messageNickColor': '#ffffff',
                    'commandsColor': 'rgba(255,255,255,0.9)',
                    'commandsTimeColor': '#ffffff',
                    'commandsTextColor': '#000000',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#ffffff',
                    'miniMapGuidesColor': '#ffffff',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#ffffff',
                    'miniMapTeammatesColor': '#ffffff',
                    'miniMapDeathLocationColor': '#ffffff',
                    'miniMapSectorsOpacity': 0.25
                },
                'agario-dark': {
                    'name': 'Agar.io Dark',
                    'darkTheme': true,
                    'mainColor': '#ffffff',
                    'bgColor': '#111111',
                    'bordersColor': '#999999',
                    'gridColor': '#333333',
                    'sectorsColor': '#333333',
                    'namesColor': '#ffffff',
                    'namesStrokeColor': '#000000',
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': '#33ff33',
                    'virusStrokeColor': '#2de52d',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#2de52d',
                    'hudMainColor': '#ffffff',
                    'statsHudColor': '#ffffff',
                    'top5MassColor': '#ffffff',
                    'timeHudColor': '#ffffff',
                    'messageNickColor': '#ffffff',
                    'commandsColor': 'rgba(255,255,255,0.9)',
                    'commandsTimeColor': '#ffffff',
                    'commandsTextColor': '#ffffff',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': '#ffffff',
                    'miniMapGuidesColor': '#ffffff',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#ffffff',
                    'miniMapTeammatesColor': '#ffffff',
                    'miniMapDeathLocationColor': '#ffffff',
                    'miniMapSectorsOpacity': 0.1
                }
            },
            m = {
                'ogario-v3': {
                    'name': 'OGARio v3',
                    'menuMainColor': '#01d9cc',
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#00243e',
                    'menuPanelColor2': '#002f52',
                    'menuTextColor': '#ffffff',
                    'menuTextColor2': '#8096a7',
                    'btn1Color': '#018cf6',
                    'btn1Color2': '#0176ce',
                    'btn2Color': '#00b9e8',
                    'btn2Color2': '#0099c0',
                    'btn3Color': '#8d5fe6',
                    'btn3Color2': '#814ee3',
                    'btn4Color': '#f300d8',
                    'btn4Color2': '#df00c6',
                    'menuBg': 'https://jimboy3100.github.io/banners/static/img/pattern.png'
                },
                'ogario-v2': {
                    'name': 'OGARio v2',
                    'menuMainColor': '#ff7800',
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#222222',
                    'menuPanelColor2': '#333333',
                    'menuTextColor': '#bbbbbb',
                    'menuTextColor2': '#bbbbbb',
                    'btn1Color': '#428bca',
                    'btn1Color2': '#3071a9',
                    'btn2Color': '#5cb85c',
                    'btn2Color2': '#449d44',
                    'btn3Color': '#f0ad4e',
                    'btn3Color2': '#ec971f',
                    'btn4Color': '#d9534f',
                    'btn4Color2': '#c9302c',
                    'menuBg': ''
                },
                'agario': {
                    'name': 'Agar.io',
                    'menuMainColor': '#5bc0de',
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#ffffff',
                    'menuPanelColor2': '#cccccc',
                    'menuTextColor': '#333333',
                    'menuTextColor2': '#999999',
                    'btn1Color': '#428bca',
                    'btn1Color2': '#3071a9',
                    'btn2Color': '#5cb85c',
                    'btn2Color2': '#449d44',
                    'btn3Color': '#f0ad4e',
                    'btn3Color2': '#ec971f',
                    'btn4Color': '#d9534f',
                    'btn4Color2': '#c9302c',
                    'menuBg': ''
                }
            },
            g = {
                'preset': 'ogario-v3',
                'darkTheme': true,
                'mainColor': '#01d9cc',
                'bgColor': '#000a11',
                'bordersColor': '#d90101',
                "borderGlowColor": "#ffffff",
                'gridColor': '#00243e',
                'sectorsColor': '#00243e',
                'namesColor': '#ffffff',
                'namesStrokeColor': '#000000',
                'massColor': '#ffffff',
                'massStrokeColor': '#000000',
                'virusColor': '#327a19',
                'virusStrokeColor': '#327a19',
                'mVirusColor': '#ce6363',
                'mVirusStrokeColor': '#b95959',
                'foodColor': '#0057ff',
                'teammatesIndColor': '#ffffff',
                'cursorTrackingColor': '#ffffff',
                'splitRangeColor': '#ffffff',
                'ghostCellsColor': '#ffffff',
                'safeAreaColor': '#ffffff',
                'dangerAreaColor': '#bf00aa',
                'namesFont': 'ubuntu-bold',
                'namesFontFamily': 'Ubuntu',
                'namesFontWeight': 700,
                'massFont': 'ubuntu-bold',
                'massFontFamily': 'Ubuntu',
                'massFontWeight': 700,
                'sectorsFont': 'ubuntu',
                'sectorsFontFamily': 'Ubuntu',
                'sectorsFontWeight': 400,
                'sectorsX': 5,
                'sectorsY': 5,
                'namesScale': 1,
                'massScale': 3,
                'virMassScale': 3,
                'strokeScale': 1,
                'foodSize': 5,
                'bordersWidth': 14,
                'sectorsWidth': 40,
                'sectorsFontSize': 1200,
                'cellsAlpha': 0.99,
                'skinsAlpha': 0.99,
                'virusAlpha': 0.6,
                'textAlpha': 1,
                'virusGlowColor': '#fff',
                'virusGlowSize': 14,
                'borderGlowSize': 14,
                'ghostCellsAlpha': 0.3,
                'virusStrokeSize': 14,
                'menuPreset': 'ogario-v3',
                'menuMainColor': '#01d9cc',
                'menuBtnTextColor': '#ffffff',
                'menuPanelColor': '#00243e',
                'menuPanelColor2': '#002f52',
                'menuTextColor': '#ffffff',
                'menuTextColor2': '#8096a7',
                'btn1Color': '#018cf6',
                'btn1Color2': '#0176ce',
                'btn2Color': '#00b9e8',
                'btn2Color2': '#0099c0',
                'btn3Color': '#8d5fe6',
                'btn3Color2': '#814ee3',
                'btn4Color': '#bf00aa',
                'btn4Color2': '#a80096',
                'menuBg': 'https://jimboy3100.github.io/banners/static/img/pattern.png',
                'menuOpacity': 0.96,
                'hudMainColor': '#01d9cc',
                'hudColor': 'rgba(0,0,0,0.4)',
                'hudTextColor': '#ffffff',
                'statsHudColor': '#ffffff',
                'timeHudColor': '#01d9cc',
                'top5MassColor': '#bf00aa',
                'lbMeColor': '#bf00aa',
                'lbTeammateColor': '#018cf6',
                'hudFont': 'ubuntu-bold',
                'hudFontFamily': 'Ubuntu',
                'hudFontWeight': 700,
                'hudScale': 1,
                'messageColor': 'rgba(0,0,0,0.4)',
                'messageTextColor': '#ffffff',
                'messageTimeColor': '#018cf6',
                'messageNickColor': '#01d9cc',
                'commandsColor': 'rgba(191,0,170,0.9)',
                'commandsTextColor': '#ffffff',
                'commandsTimeColor': '#bf00aa',
                'commandsNickColor': '#ffffff',
                'chatBoxColor': 'rgba(0,0,0,0.4)',
                'chatScale': 1,
                'miniMapSectorsColor': '#ffffff',
                'miniMapSectorColor': '#01d9cc',
                'miniMapGuidesColor': '#bf00aa',
                'miniMapNickColor': '#ffffff',
                'miniMapNickStrokeColor': '#000000',
                'miniMapMyCellColor': '#ffffff',
                'miniMapMyCellStrokeColor': '#bf00aa',
                'miniMapTeammatesColor': '#01d9cc',
                'miniMapDeathLocationColor': '#bf00aa',
                'miniMapGhostCellsColor': '#ffffff',
                ////
                "color": "#fff",
                //"commanderImage" : "https://i.imgur.com/wQKUDB3.png",				
                "commanderImage": "https://jimboy3100.github.io/banners/drawCommander.png",
                "commanderImage1": "https://jimboy3100.github.io/banners/drawCommander1.png",
                "commanderImage2": "https://jimboy3100.github.io/banners/drawCommander2.png",
                "commanderImage3": "https://jimboy3100.github.io/banners/drawCommander3.png",
                "commanderImage4": "https://jimboy3100.github.io/banners/drawCommander4.png",
                "commanderImage5": "https://jimboy3100.github.io/banners/drawCommander5.png",	
				"commanderImage6": "https://jimboy3100.github.io/banners/iconJustWatchPro.png",	
				"commanderImageDyingLight": "https://jimboy3100.github.io/banners/icondyinglightzombie.png",	
				"commanderImageDyingLightvirus": "https://jimboy3100.github.io/banners/icondyinglightvirus.png",
			
                ////
                'miniMapFont': 'ubuntu-bold',
                'miniMapFontFamily': 'Ubuntu',
                'miniMapFontWeight': 700,
                'miniMapNickFont': 'ubuntu-bold',
                'miniMapNickFontFamily': 'Ubuntu',
                'miniMapNickFontWeight': 700,
                'miniMapWidth': 240,
                'miniMapTop': 24,
                'miniMapSectorsOpacity': 0.1,
                'miniMapNickSize': 11,
                'miniMapNickStrokeSize': 2,
                'miniMapMyCellSize': 7.5,
                'miniMapMyCellStrokeSize': 4,
                'miniMapTeammatesSize': 5.5,
                'miniMapGhostCellsAlpha': 0.15,
                'customBackground': '',
                'customCursor': 'https://jimboy3100.github.io/cursors/cursor_02.cur'
            },
            y = {
                'menuMainColorCSS': null,
                'menuPanelColorCSS': null,
                'menuTextlColorCSS': null,
                'menuButtonsCSS': null,
                'hudCSS': null,
                'chatCSS': null,
                'chatScaleCSS': null,
                'cursorCSS': null,
                'loadThemeSettings': function() {
                    var t = null;
                    for (var s in null !== window.localStorage.getItem('ogarioThemeSettings') && (t = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'))), g) g.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (g[s] = t[s]), i.hasOwnProperty(s) && (i[s] = g[s]));
					//if (v.zoomSpeedValue2 && v.zoomSpeedValue2>0.99){v.zoomSpeedValue2=v.zoomSpeedValue2-1};
				},
                'saveThemeSettings': function() {
                    window.localStorage.setItem('ogarioThemeSettings', JSON.stringify(g));
                },
                'restoreThemeSettings': function() {
                    null !== window.localStorage.getItem('ogarioThemeSettings') && (window.localStorage.removeItem('ogarioThemeSettings'), window.location.reload());
                },
                'addCustomCSS': function(t, e) {
                    this[t] || (this[t] = $("<style type=\'text/css\'>").appendTo('head')), this[t].html(e);
                },
                'addPresetBox': function(t, e, i, o, a) {
                    for (var n in $(t).append('<div class=\"preset-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>'), i) i.hasOwnProperty(n) && $('#' + e).append('<option value=\"' + n + '\">' + i[n]['name'] + '</option>');
                    $('#' + e).val(g[o]);
                    var r = this;
                    $('#' + e).on('change', function() {
                        var t = this.value;
                        g[o] = t, r[a](t);
                    });
                },
                'addColorBox': function(t, e, o) {
                    if ($(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + g[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        $(t + ' .' + e + '-picker')['colorpicker']({
                            'format': 'hex'
                        }).on('changeColor.colorpicker', function(t) {
                            g[e] = t.color.toHex(), i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else $(t + ' .' + e + '-picker').colorpicker({
                        'format': 'hex'
                    }).on('changeColor.colorpicker', function(t) {
                        g[e] = t.color.toHex(), i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addRgbaColorBox': function(t, e, o) {
                    if ($(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + g[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        $(t + ' .' + e + '-picker').colorpicker({
                            'format': 'rgba'
                        }).on('changeColor.colorpicker', function(t) {
                            var s = t.color.toRGB();
                            g[e] = 'rgba(' + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else s(t + ' .' + e + '-picker').colorpicker({
                        'format': 'rgba'
                    }).on('changeColor.colorpicker', function(t) {
                        var s = t.color.toRGB();
                        g[e] = 'rgba(' + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addSliderBox': function(t, e, o, a, n, r) {
                    if ($(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + g[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + g[e] + '\"></div>'), r) {
                        var l = this;
                        $('#' + e + '-slider').on('input', function() {
                            var t = parseFloat($(this).val());
                            $('#' + e + '-value').text(t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r]();
                        });
                    } else $('#' + e + '-slider').on('input', function() {
                        var t = parseFloat($(this).val());
                        $('#' + e + '-value').text(t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t);
                    });
                },
                'addInputBox': function(t, e, i, o) {
                    $(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + g[e] + '\" /></div>');
                    var a = this;
                    $('#' + e).on('input', function() {
                        g[e] = this.value, a[o]();
                    });
                },
                'addCursorBox': function(t, e) {
                    e === g.customCursor ? $(t).append('<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"' + e + '\"></a></div>') : $(t).append('<div class=\"cursor-box\"><a href=\"#\"><img src=\"' + e + '\"></a></div>');
                },
                'setFont': function(t, e) {
                    g[t] = e, g[t + 'Family'] = this.setFontFamily(e), g[t + 'Weight'] = this.setFontWeight(e), i.hasOwnProperty(t + 'Family') && (i[t + 'Family'] = g[t + 'Family']), i.hasOwnProperty(t + 'Weight') && (i[t + 'Weight'] = g[t + 'Weight']);
                },
                'addFontBox': function(t, e, i) {
                    $(t).append('<div class=\"font-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>');
					$('#' + e).append('<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>');
					$('#' + e).append('<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>'); 
					$('#' + e).append('<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>');
					$('#' + e).append('<option value=\"shojumaru\">Shojumaru</option><option value=\"shojumaru-bold\">Shojumaru Bold</option>');
					$('#' + e).append('<option value=\"allura\">Allura</option><option value=\"allura-bold\">Allura Bold</option>');
					
					$('#' + e).val(g[e]);
                    var o = this;
                    i ? $('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t), o[i]();
                    }) : $('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t);
                    });
                },
                'setFontFamily': function(t) {
					var tempFont;
					if (t.indexOf('roboto')==0){
						tempFont = 'Roboto';
					}
					else if (t.indexOf('oswald')==0){
						tempFont = 'Oswald';
					}	
					else if (t.indexOf('shojumaru')==0){
						console.log('font: shojumaru');
						tempFont = 'Shojumaru';
					}								
					else if (t.indexOf('allura')==0){
						console.log('font: allura');
						tempFont = 'Allura';
					}						
//					else (if t.indexOf('ubuntu')){
					else{	
						tempFont = 'Ubuntu';
					}		
	
					return tempFont;
                    //return -1 != t.indexOf('roboto') ? 'Roboto' : -1 != t.indexOf('oswald') ? 'Oswald' : 'Ubuntu';
                },
                'setFontWeight': function(t) {
                    return -1 != t.indexOf('bold') ? 700 : 400;
                },
                'setThemeMenu': function() {
                    var t = this;
                    $('#theme').append('<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"' + h['basicTheming'] + '\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"' + h['menuTheming'] + '\"></a></li><li class=\"theme-hud-tab\"><a href=\"#theme-hud\" class=\"ogicon-display\" data-toggle=\"tab-tooltip\" title=\"' + h['hudTheming'] + '\"></a></li><li class=\"theme-chat-tab\"><a href=\"#theme-chat\" class=\"ogicon-bubbles\" data-toggle=\"tab-tooltip\" title=\"' + h['chatTheming'] + '\"></a></li><li class=\"theme-minimap-tab\"><a href=\"#theme-minimap\" class=\"ogicon-location2\" data-toggle=\"tab-tooltip\" title=\"' + h['miniMapTheming'] + '\"></a></li><li class=\"theme-images-tab\"><a href=\"#theme-images\" class=\"ogicon-compass\" data-toggle=\"tab-tooltip\" title=\"' + h['imagesTheming'] + '\"></a></li></ul><div id=\"theme-main\" class=\"submenu-panel\"></div><div id=\"theme-menu\" class=\"submenu-panel\"></div><div id=\"theme-hud\" class=\"submenu-panel\"></div><div id=\"theme-chat\" class=\"submenu-panel\"></div><div id=\"theme-minimap\" class=\"submenu-panel\"></div><div id=\"theme-images\" class=\"submenu-panel\"></div>'), this.addPresetBox('#theme-main', 'themePreset', f, 'preset', 'changeThemePreset'), this.addColorBox('#theme-main', 'bgColor', 'setBgColor'), this.addColorBox('#theme-main', 'bordersColor'), this.addColorBox('#theme-main', 'borderGlowColor'), this.addColorBox('#theme-main', 'gridColor'), this.addColorBox('#theme-main', 'sectorsColor'), this.addColorBox('#theme-main', 'namesColor'), this.addColorBox('#theme-main', 'namesStrokeColor'), this.addColorBox('#theme-main', 'massColor'), this.addColorBox('#theme-main', 'massStrokeColor'), this.addColorBox('#theme-main', 'virusColor'), this.addColorBox('#theme-main', 'virusStrokeColor'), this.addColorBox('#theme-main', 'mVirusColor'), this.addColorBox('#theme-main', 'mVirusStrokeColor'), this.addColorBox('#theme-main', 'virusGlowColor'), this.addColorBox('#theme-main', 'foodColor', 'setFoodColor'), this.addColorBox('#theme-main', 'teammatesIndColor', 'setIndicatorColor'), this.addColorBox('#theme-main', 'cursorTrackingColor'), this.addColorBox('#theme-main', 'splitRangeColor'), this.addColorBox('#theme-main', 'safeAreaColor'), this.addColorBox('#theme-main', 'dangerAreaColor'), this.addColorBox('#theme-main', 'ghostCellsColor'), this['addFontBox']('#theme-main', 'namesFont'), this['addFontBox']('#theme-main', 'massFont'), this['addFontBox']('#theme-main', 'sectorsFont'), this.addSliderBox('#theme-main', 'sectorsFontSize', 200, 2000, 10), this.addSliderBox('#theme-main', 'namesScale', 0.5, 2, 0.1), this.addSliderBox('#theme-main', 'massScale', 1, 5, 1), this.addSliderBox('#theme-main', 'virMassScale', 1, 5, 1), this.addSliderBox('#theme-main', 'strokeScale', 1, 4, 0.1), this.addSliderBox('#theme-main', 'foodSize', 1, 50, 1, 'setFoodColor'), this.addSliderBox('#theme-main', 'virusStrokeSize', 2, 40, 1), this.addSliderBox('#theme-main', 'bordersWidth', 2, 200, 2), this.addSliderBox('#theme-main', 'borderGlowSize', 0, 40, 1), this.addSliderBox('#theme-main', 'virusGlowSize', 0, 40, 1), this.addSliderBox('#theme-main', 'sectorsWidth', 2, 200, 2), this.addSliderBox('#theme-main', 'cellsAlpha', 0.01, 0.99, 0.01), this.addSliderBox('#theme-main', 'skinsAlpha', 0.01, 0.99, 0.01), this.addSliderBox('#theme-main', 'virusAlpha', 0, 1, 0.01), this.addSliderBox('#theme-main', 'textAlpha', 0.1, 1, 0.01), this.addSliderBox('#theme-main', 'ghostCellsAlpha', 0.01, 0.99, 0.01), this.addPresetBox('#theme-menu', 'menuPreset', m, 'menuPreset', 'changeMenuPreset'), this.addSliderBox('#theme-menu', 'menuOpacity', 0.1, 1, 0.01, 'setMenuOpacity'), this.addColorBox('#theme-menu', 'menuMainColor', 'setMenuMainColor'), this.addColorBox('#theme-menu', 'menuBtnTextColor', 'setMenuButtons'), this.addColorBox('#theme-menu', 'menuPanelColor', 'setMenuPanelColor'), this.addColorBox('#theme-menu', 'menuPanelColor2', 'setMenuPanelColor'), this.addColorBox('#theme-menu', 'menuTextColor', 'setMenuTextColor'), this.addColorBox('#theme-menu', 'menuTextColor2', 'setMenuTextColor'), this.addColorBox('#theme-menu', 'btn1Color', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn1Color2', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn2Color', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn2Color2', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn3Color', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn3Color2', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn4Color', 'setMenuButtons'), this.addColorBox('#theme-menu', 'btn4Color2', 'setMenuButtons'), this.addInputBox('#theme-menu', 'menuBg', 'Image URL', 'setMenuBg'), this.addColorBox('#theme-hud', 'hudMainColor', 'setHudColors'), this['addRgbaColorBox']('#theme-hud', 'hudColor', 'setHudColors'), this.addColorBox('#theme-hud', 'hudTextColor', 'setHudColors'), this.addColorBox('#theme-hud', 'statsHudColor', 'setHudColors'), this.addColorBox('#theme-hud', 'timeHudColor', 'setHudColors'), this.addColorBox('#theme-hud', 'top5MassColor', 'setHudColors'), this.addColorBox('#theme-hud', 'lbMeColor', 'setHudColors'), this.addColorBox('#theme-hud', 'lbTeammateColor', 'setHudColors'), this['addFontBox']('#theme-hud', 'hudFont', 'setHudFont'), this.addSliderBox('#theme-hud', 'hudScale', 1, 2, 0.01, 'setHudScale'), this['addRgbaColorBox']('#theme-chat', 'messageColor', 'setChatColors'), this.addColorBox('#theme-chat', 'messageTextColor', 'setChatColors'), this.addColorBox('#theme-chat', 'messageTimeColor', 'setChatColors'), this.addColorBox('#theme-chat', 'messageNickColor', 'setChatColors'), this['addRgbaColorBox']('#theme-chat', 'commandsColor', 'setChatColors'), this.addColorBox('#theme-chat', 'commandsTextColor', 'setChatColors'), this.addColorBox('#theme-chat', 'commandsTimeColor', 'setChatColors'), this.addColorBox('#theme-chat', 'commandsNickColor', 'setChatColors'), this['addRgbaColorBox']('#theme-chat', 'chatBoxColor', 'setChatColors'), this.addSliderBox('#theme-chat', 'chatScale', 1, 2, 0.01, 'setChatScale'), this.addColorBox('#theme-minimap', 'miniMapSectorsColor', 'setMiniMapSectorsColor'), this.addColorBox('#theme-minimap', 'miniMapSectorColor'), this.addColorBox('#theme-minimap', 'miniMapNickColor'), this.addColorBox('#theme-minimap', 'miniMapNickStrokeColor'), this.addColorBox('#theme-minimap', 'miniMapMyCellColor'), this.addColorBox('#theme-minimap', 'miniMapMyCellStrokeColor'), this.addColorBox('#theme-minimap', 'miniMapTeammatesColor'), this.addColorBox('#theme-minimap', 'miniMapDeathLocationColor'), this.addColorBox('#theme-minimap', 'miniMapGuidesColor'), this.addColorBox('#theme-minimap', 'miniMapGhostCellsColor'), this['addFontBox']('#theme-minimap', 'miniMapFont', 'setMiniMapFont'), this['addFontBox']('#theme-minimap', 'miniMapNickFont'), this.addSliderBox('#theme-minimap', 'miniMapWidth', 200, 400, 2, 'setMiniMapWidth'), this.addSliderBox('#theme-minimap', 'miniMapSectorsOpacity', 0, 1, 0.01, 'setMiniMapSectorsOpacity'), this.addSliderBox('#theme-minimap', 'miniMapNickSize', 8, 16, 1), this.addSliderBox('#theme-minimap', 'miniMapNickStrokeSize', 0, 6, 1), this.addSliderBox('#theme-minimap', 'miniMapMyCellSize', 4, 10, 0.5), this.addSliderBox('#theme-minimap', 'miniMapMyCellStrokeSize', 0, 10, 1), this.addSliderBox('#theme-minimap', 'miniMapTeammatesSize', 4, 10, 0.5), this.addSliderBox('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01), this.addInputBox('#theme-images', 'customBackground', 'Image URL', 'setCustomBackground'), this.addInputBox('#theme-images', 'customCursor', 'Cursor image URL', 'setCustomCursor');
                    for (var e = 'https://jimboy3100.github.io/cursors/cursor_', i = 0; i < 35; i++) i < 9 ? this.addCursorBox('#theme-images', e + '0' + (i + 1) + '.cur') : this.addCursorBox('#theme-images', e + '' + (i + 1) + '.cur');
                    $(document).on('click', '#theme-images .cursor-box a', function(e) {
                        e.preventDefault();
                        var i = $('img', this).attr('src');
                        g.customCursor = i, t['setCustomCursor'](), $('#customCursor').val(i), $('#theme-images .cursor-box a').removeClass('active'), $(this).addClass('active');
                    }), 
					$('#theme').append('<button class=\"btn btn-block btn-success btn-save\"\">' + h['saveSett'] + '</button>'), $(document).on('click', '#theme .btn-save', function(e) {
                        e.preventDefault();
                        var i = $(this);
                        i.text(h['saved']), t['saveThemeSettings'](), setTimeout(function() {
                            i.text(h['saveSett']);
                        }, 500);
                    }), $('#theme').append('<div class=\"restore-settings\"><a href=\"#\">' + h['restoreThemeSettings'] + '</a></div>'), 
					$(document).on('click', '#theme .restore-settings a', function(e) {
                        e.preventDefault(), t['restoreThemeSettings']();
                    }), $('.skin').colorpicker({
                        'format': 'hex',
                        'input': '#color'
                    });
                },
                'changePreset': function(t, e) {
                    if (e[t]) {
                        g[t] = t;
                        t = e[t];
                        for (var o in t) t.hasOwnProperty(o) && g.hasOwnProperty(o) && (g[o] = t[o], i.hasOwnProperty(o) && (i[o] = g[o]), $('#theme .' + o + '-picker') && $('#theme .' + o + '-picker').colorpicker('setValue', g[o]), $('#' + o + '-slider') && $('#' + o + '-slider').val(g[o])['change'](), ($('input[type=text]#' + o) || $('select#' + o)) && $('#' + o).val(g[o]));
                    }
                },
                'changeThemePreset': function(t) {
                    this.changePreset(t, f), this.setTheme();
                },
                'setFonts': function() {
                    this.setFont('namesFont', g.namesFont), this.setFont('massFont', g.namesFont), this.setFont('sectorsFont', g.sectorsFont);
                },
                'setBgColor': function() {
                    $('body').css('background-color', g.bgColor);
                },
                'setFoodColor': function() {
                    v.optimizedFood && ogarfooddrawer && ogarfooddrawer.preDrawPellet();
                },
                'setIndicatorColor': function() {
                    if(ogarfooddrawer){
						ogarfooddrawer.preDrawIndicator();
					}
                },
                'setCustomBackground': function() {
                    g['customBackground'] ? $('body').css('background-image', 'url(' + g['customBackground'] + ')') : $('body').css('background-image', 'none');
                },
                'setCustomCursor': function() {
                    if (g.customCursor) var t = '*{cursor:url(' + g.customCursor + '), auto !important}';
                    else t = '*{cursor: auto}';
                    this.addCustomCSS('cursorCSS', t);
                },
                'setMenu': function() {
                    this.setMenuOpacity(), this.setMenuMainColor(), this['setMenuPanelColor'](), this['setMenuTextColor'](), this['setMenuButtons'](), this.setMenuBg();
                },
                'changeMenuPreset': function(t) {
                    this.changePreset(t, m), this.setMenu();
                },
                'setMenuOpacity': function() {
                    $('#helloContainer, #hotkeys, #exp-imp').css('opacity', g['menuOpacity']);
                },
                'setMenuMainColor': function() {
                    var t = '::-moz-selection{background-color:' + g['menuMainColor'] + '!important}::selection{background-color:' + g['menuMainColor'] + '!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:' + g['menuMainColor'] + '}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:' + g['menuMainColor'] + '}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:' + g['menuMainColor'] + '}.ps-scrollbar-y{background-color:' + g['menuMainColor'] + '!important}';
                    this.addCustomCSS('menuMainColorCSS', t);
                },
                'setMenuPanelColor': function() {
                    var t = '#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ' + g['menuPanelColor'] + '}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ' + g['menuPanelColor2'] + '}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ' + g['menuPanelColor2'] + '}.quick:hover,#skins a,#profiles{color:' + g['menuPanelColor2'] + '}input.stream-mode,input.hide-url{color:' + g['menuPanelColor2'] + '!important}';
                    this.addCustomCSS('menuPanelColorCSS', t);
                },
                'setMenuTextColor': function() {
                    var t = '.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:' + g['menuTextColor'] + '}#skins a.default:hover{border-color:' + g['menuTextColor'] + '}::-webkit-input-placeholder{color:' + g['menuTextColor2'] + '!important}::-moz-placeholder{color:' + g['menuTextColor2'] + '!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:' + g['menuTextColor2'] + '}#hotkeys-cfg .command-in,#theme .color-box{border-color:' + g['menuTextColor2'] + '}';
                    this.addCustomCSS('menuTextColorCSS', t);
                },
                'setMenuButtons': function() {
                    var t = 'a,a:hover{color:' + g['btn1Color'] + '}.btn,#hotkeys-cfg .custom-key-in{color:' + g['menuBtnTextColor'] + '}.btn-primary{background-color:' + g['btn1Color'] + '!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:' + g['btn1Color2'] + '!important}.btn-success{background-color:' + g['btn2Color'] + '!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:' + g['btn2Color2'] + '!important}.btn-warning{background-color:' + g['btn3Color'] + '!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:' + g['btn3Color2'] + '!important}.btn-danger{background-color:' + g['btn4Color'] + '!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:' + g['btn4Color2'] + '!important}#hotkeys-cfg .custom-key-in{background-color:' + g['btn4Color2'] + ';border-color:' + g['btn4Color2'] + '}';
                    this.addCustomCSS('menuButtonsCSS', t);
                },
                'setMenuBg': function() {
                    $('#menuBg').val(g['menuBg']), g['menuBg'] ? $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'url(' + g['menuBg'] + ')') : $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'none');
                },
                'setHud': function() {
                    this['setHudColors'](), this['setHudFont'](), this['setHudScale']();
                },
                'setHudColors': function() {
                    var t = '.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:' + g['hudMainColor'] + '}.hud,.hud-b,#chat-emoticons{background-color:' + g['hudColor'] + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + g['hudTextColor'] + '}.stats-hud-color{color:' + g['statsHudColor'] + '}.time-hud-color{color:' + g['timeHudColor'] + '}.top5-mass-color{color:' + g['top5MassColor'] + '}#leaderboard-positions .me{color:' + g['lbMeColor'] + '}#leaderboard-positions .teammate{color:' + g['lbTeammateColor'] + '}';
                    this.addCustomCSS('hudCSS', t);
                },
                'setHudFont': function() {
                    this.setFont('hudFont', g['hudFont']), $('#overlays-hud').css({
                        'font-family': g['hudFontFamily'],
                        'font-weight': g['hudFontWeight']
                    });
                },
                'setHudScale': function() {
                    var t = Math.round(20 * g['hudScale']),
                        e = Math.round(200 * g['hudScale']),
                        i = Math.floor(55 * g['hudScale']),
                        o = Math.floor(6 * g['hudScale']),
                        a = Math.floor(280 * g['hudScale']),
                        n = Math.floor(85 * g['hudScale']),
                        r = Math.floor(20 * g['hudScale']);
                    $('#overlays-hud').css('font-size', t + 'px'), $('#leaderboard-hud, #time-hud').width(e), $('#top5-hud').width(e + 30).css('top', i + 'px'), $('#top5-pos').css('padding-left', o + 'px'), $('#time-hud').css('top', a + 'px'), $('#pause-hud').css('top', n + 'px'), $('#target-hud').css('padding-top', r + 'px');
                },
                'setChat': function() {
                    this['setChatColors'](), this['setChatScale']();
                },
                'setChatColors': function() {
                    var t = '#message,#messages li,.toast-success{background-color:' + g['messageColor'] + '}#message,.message-text,.toast-success .message-text{color:' + g['messageTextColor'] + '}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:' + g['messageNickColor'] + '}.message-time{color:' + g['messageTimeColor'] + '}.toast-warning{background-color:' + g['commandsColor'] + '}.command-text,.toast-warning .command-text{color:' + g['commandsTextColor'] + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + g['commandsNickColor'] + '}.command-time{color:' + g['commandsTimeColor'] + '}#chat-box{background-color:' + g['chatBoxColor'] + '}';
                    this.addCustomCSS('chatCSS', t);
                },
                'setChatScale': function() {
                    var t = Math.round(14 * g['chatScale']);
                    var e = Math.round(280 * g['chatScale']);
                    var i = Math.round(350 * g['chatScale']);
                    var o = Math.round(300 * g['chatScale']);
                    var a = Math.floor(14 * g['chatScale']);
                    $('#message-box, #messages, #toast-container, #chat-box').css('font-size', t + 'px'); 
					$('#messages, #toast-container, #chat-box').width(e); 
					$('#message-box').width(i), $('#chat-box').height(o); 
					$('.user-list').css('padding-left', a + 'px');
                    var n = '#toast-container{width:' + e + 'px;font-size:' + t + 'px}';
                    this.addCustomCSS('chatScaleCSS', n);
                },
                'setMiniMap': function() {
                    this['setMiniMapFont'](); 
					this['setMiniMapWidth'](); 
					this['setMiniMapSectorsOpacity']();
                },
                'setMiniMapFont': function() {
                    this.setFont('miniMapFont', g['miniMapFont']);
					if (ogarminimapdrawer){
						ogarminimapdrawer['resetMiniMapSectors']();
					}
                },
                'setMiniMapWidth': function() {
                    var t = g['miniMapWidth'] / 200;
                    g.miniMapTop = Math.round(20 * t), $('#minimap-hud').css({
                        'width': g['miniMapWidth'],
                        'height': g['miniMapWidth'] + g.miniMapTop
                    }), ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapSectorsColor': function() {
                    if (ogarminimapdrawer){ 
					ogarminimapdrawer['resetMiniMapSectors']();
					}
                },
                'setMiniMapSectorsOpacity': function() {
                    $('#minimap-sectors').css('opacity', g['miniMapSectorsOpacity']);
                },
                'setTheme': function() {
                    this.setFonts(); 
					this.setBgColor(); 
					this.setCustomBackground(); 
					this.setCustomCursor();
					this.setMenu();
					this.setHud();
					this.setChat(); 
					this.setMiniMap();
                },
                'init': function() {
                    this.loadThemeSettings();
                }
            },
            ogario1PlayerProfiles = [],
            ogarcopythelb = {
                'nick': 'I<3Legendmod',
                'clanTag': 'Ⓜ',
                'skinURL': '',
                'color': g.mainColor
            },
            v = {
				'isAlphaChanged':false,
				'jellyPhisycs':true,
				'virusSound':true,				
                'quickResp': true,
                'autoResp': false,
                'autoZoom': false,
                'autoHideNames': true,
                'autoHideMass': true,
                'autoHideFood': false,
                'autoHideFoodOnZoom': false,
                'noNames': false,
                'optimizedNames': true,
                'hideMyName': false,
                'hideTeammatesNames': false,
                'showMass': true,
                'optimizedMass': true,
                'shortMass': true,
                'virMassShots': true,
                'hideMyMass': false,
                'hideEnemiesMass': false,
                'vanillaSkins': false,
                'customSkins': true,
				'videoSkins': true,
				'videoSkinsMusic': false,
                'myTransparentSkin': false,
                'myCustomColor': false,
                'transparentCells': false,
                'transparentViruses': true,
                'transparentSkins': false,
                'showGrid': true,
                'showBgSectors': false,
                'showMapBorders': true,
                'showGhostCells': false,
				'showGhostCellsInfo': false,
                'showMiniMap': true,
                'showMiniMapGrid': false,
                'showMiniMapGuides': true,
				'showExtraMiniMapGuides': true,
                'showMiniMapGhostCells': true,
                'oneColoredTeammates': false,
                'optimizedFood': true,
                'rainbowFood': true,
                'oppColors': true,
                'oppRings': true,
                'virColors': false,
                'splitRange': false,
                'virusesRange': false,
                'textStroke': false,
                'namesStroke': true,
                'massStroke': true,
                'cursorTracking': false,
                'teammatesInd': true,
                'mouseSplit': false,
                'mouseFeed': false,
                'mouseInvert': false,
                'disableChat': false,
                'hideChat': false,
                'chatSounds': true,
                'chatEmoticons': true,
                'showChatBox': false,
                'showChatImages': true,
                'showChatVideos': true,
                'showTop5': true,
                'showTargeting': true,
                'showLbData': true,
                'showTime': false,
                'normalLb': true,
                'centeredLb': true,
                'fpsAtTop': true,
                'showStats': true,
                'showStatsMass': true,
                'showStatsSTE': true,
                'showStatsN16': true,
                'showStatsFPS': true,
                'blockPopups': false,
                'streamMode': false,
                'hideSkinUrl': false,
                'showQuickMenu': true,
                'showSkinsPanel': true,
                'animation': 140,
                ////
                "cameraSpeed": 7,
                "commanderDelay": 1E3,
                "suckAnimation": false,
                "virusGlow": false,
                "borderGlow": true,
                "limLB": 10,
                "limTP": 5,
                ////				
                //'zoomSpeedValue': .87,
				'zoomSpeedValue2': -0.13,
                'messageSound': 'https://jimboy3100.github.io/sounds/notification_01.mp3',
                //                'commandSound': 'https://jimboy3100.github.io/sounds/notification_02.mp3'
                'commandSound': 'https://jimboy3100.github.io/sounds/chat-message.mp3',
				'virusSoundurl': 'https://jimboy3100.github.io/sounds/sound-gunshot.mp3',
				'soundSplit': 'https://www.myinstants.com/media/sounds/quack_5.mp3'
				
            };
			
        window.legendmod4 = c;
		window.legendmod5 = v;
		
        var ogarminimapdrawer = {
            'name': 'LM express',
            'version': 'v1',
            'privateMode': false,
            'protocolMode': true,
            'publicIP': 'wss://srv.ogario.eu',
            'privateIP': null,
            'updateInterval': 1000,
            'updateTick': 0,
            'updateMaxTick': 2,
            'currentSector': '',
            'miniMap': null,
            'miniMapCtx': null,
            'miniMapSectors': null,
            'pi2': 2 * Math.PI,
            'socket': null,
            'cells': {},
            'teamPlayers': [],
            'parties': [],
            'chatHistory': [],
            'chatUsers': {},
            'chatMutedUsers': {},
            'chatMutedUserIDs': [],
            'customSkinsCache': {},
            'customSkinsMap': {},
            'cacheQueue': [],
            'deathLocations': [],
            'playerID': null,
            'playerMass': 0,
            'selectedProfile': 0,
            'lastDeath': 0,
            'skipServerData': false,
            'gameMode': ':ffa',
            'region': '',
            'partyToken': '',
            'ws': '',
            'serverIP': '',
            'serverArena': '',
            'serverToken': '',
            'lastSentNick': '',
            'lastSentClanTag': null,
            'lastSentSkinURL': '',
            'lastSentCustomColor': '',
            'lastSentPartyToken': '',
            'lastSentServerToken': '',
            'lastMessageSentTime': Date.now(),
            'rFps': 0,
            'renderedFrames': 0,
            'fpsLastRequest': null,
            'statsHUD': null,
            'leaderboardPositionsHUD': null,
            'leaderboardDataHUD': null,
            'activeParties': null,
            'top5pos': null,
            'top5totalMass': null,
            'top5totalPlayers': null,
            'top5limit': 5,
            'timeHUD': null,
            'questHUD': null,
            'retryResp': 0,
            'token': 'b2dhcmlvLm92aA==',
            'canvasScale': 1,
            'selectBiggestCell': true,
            'noColors': false,
            'skipStats': false,
            'showQuest': false,
            'showSplitInd': false,
            'pause': false,
            'targetID': 0,
            'targetStatus': 0,
            'targetNick': '',
            'targetSkinURL': '',
            'targeting': false,
            'privateMiniMap': false,
            'messageSound': null,
            'commandSound': null,
			'virusSound': null,
			'virusSoundurl': null,
            'feedInterval': null,
            'getPlayerX': function() {
                return i.playerX + i.mapOffsetX;
            },
            'getPlayerY': function() {
                return i.playerY + i.mapOffsetY;
            },
            'feed': function() {
                if (window.core && window.core.eject){ 
				window.core.eject();
				}
            },
            'macroFeed': function(t) {
                if (t) {
                    if (this.feedInterval) return;
                    var e = this;
                    this.feed(), this.feedInterval = setInterval(function() {
                        e.feed();
                    }, 80);
                } else if (this.feedInterval) {
				clearInterval(this.feedInterval); 
				this.feedInterval = null
				};
            },
            'split': function() {
                window.core && window.core.split && window.core.split();
            },
            'doubleSplit': function() {
                var t = this;
                t.split();
				setTimeout(function() {
                    t.split();
                }, 40);
            },
            'popSplit': function() {
                var t = this;
                t.split();
				setTimeout(function() {
                    t.split();
                }, 200);
            },
            'split16': function() {
                var t = this;
                t.split();
				setTimeout(function() {
                    t.split();
                }, 40);
				setTimeout(function() {
                    t.split();
                }, 80);
				setTimeout(function() {
                    t.split();
                }, 120);
            },
            'toggleSkins': function() {
                i['vanillaSkins'] && i['customSkins'] ? i['vanillaSkins'] = false : !i['vannillaSkins'] && i['customSkins'] ? (i['vanillaSkins'] = true, i['customSkins'] = false) : (i['vanillaSkins'] = true, i['customSkins'] = true);
            },
            'toggleCells': function() {
                this.selectBiggestCell = !this.selectBiggestCell, 
				i.selectBiggestCell = this.selectBiggestCell;
            },
            'setShowTop5': function() {
                v['showTop5'] = !v['showTop5'], this['setTop5']();
            },
            'setTop5': function() {
                v['showTop5'] ? $('#top5-hud').show() : $('#top5-hud').hide();
            },
            'setShowTargeting': function() {
                v['showTargeting'] = !v['showTargeting'], this['setTargetingHUD']();
            },
            'setTargetingHUD': function() {
                v['showTargeting'] ? $('#target-hud, #target-panel-hud').show() : $('#target-hud, #target-panel-hud').hide();
            },
            'setShowTime': function() {
                v['showTime'] = !v['showTime'], v['showTime'] ? ($('#time-hud').show(), this['displayTime']()) : $('#time-hud').hide();
            },
            'setShowSplitRange': function() {
                v['splitRange'] = !v['splitRange'], i['splitRange'] = v['splitRange'];
            },
            'setShowGhostCellsInfo': function() {
                if ( v['showGhostCells'] == false || v['showGhostCellsInfo'] == false ){
			    v['showGhostCellsInfo'] = true;				
				v['showGhostCells'] = true;
				}
				else{
			    v['showGhostCellsInfo'] = false;
				v['showGhostCells'] = false;					
				}
				
            },		
            'setAutoPlay': function() {
				if (legendmod.pause){ogarminimapdrawer && ogarminimapdrawer.setPause()};
                if ( window.autoPlay == false){
			    window.autoPlay = true;
				$('#pause-hud').text("AI (Emanuel & Jimboy3100) SkyNet v0.04");
				$('#pause-hud').show();
				}
				else{
			    window.autoPlay = false;	
				$('#pause-hud').text(h.pause);
				$('#pause-hud').hide();				
				}				
            },				
            'setShowSplitInd': function() {
                this['showSplitInd'] = !this['showSplitInd'], 
				v['splitRange'] = this['showSplitInd'], 
				v['oppRings'] = this['showSplitInd'], 
				i['splitRange'] = v['splitRange'], 
				i['oppRings'] = v['oppRings'];
            },
            'setShowTeammatesInd': function() {
                v.teammatesInd = !v.teammatesInd;
            },
            'setShowOppColors': function() {
                v['oppColors'] = !v['oppColors'], i['oppColors'] = v['oppColors'];
            },
            'setShowSkins': function() {
                this['noSkins'] = !this['noSkins'], 
				window.core && window.core['setSkins'] && window.core['setSkins'](!this['noSkins']), 
				i['showCustomSkins'] = !this['noSkins'], 
				this['displayChatInfo'](!this['noSkins'], 'showSkinsMsg');
            },
            'setTransparentSkins': function() {
                v['transparentSkins'] = !v['transparentSkins'], 
				i['transparentSkins'] = v['transparentSkins'];
            },
            'setShowStats': function() {
                $('#stats-hud')['toggle']();
            },
            'setShowFood': function() {
                i.showFood = !i.showFood;
            },
            'setShowHUD': function() {
                $('#overlays-hud')['toggle']();
            },
            'setShowGrid': function() {
                v['showGrid'] = !v['showGrid'];
            },
            'setShowMiniMapGuides': function() {
                v['showMiniMapGuides'] = !v['showMiniMapGuides'];
            },
            'setShowLb': function() {
                ':teams' !== this.gameMode && $('#leaderboard-hud')['toggle']();
            },
            'setShowBgSectors': function() {
                v['showBgSectors'] = !v['showBgSectors'];
            },
            'setHideSmallBots': function() {
                i['hideSmallBots'] = !i['hideSmallBots'], 
				this['displayChatInfo'](!i['hideSmallBots'], 'hideSmallBotsMsg');
            },
            'setShowNames': function() {
                v.noNames = !v.noNames;
            },
            'setHideTeammatesNames': function() {
                v.hideTeammatesNames = !v.hideTeammatesNames;
            },
            'setShowMass': function() {
                v.showMass = !v.showMass;
            },
            'setShowMiniMap': function() {
                v['showMiniMap'] = !v['showMiniMap'], this['setMiniMap']();
            },
            'setMiniMap': function() {
                v['showMiniMap'] ? $('#minimap-hud').show() : $('#minimap-hud').hide();
            },
            'setShowQuest': function() {
                ':ffa' === this.gameMode && (this.showQuest = !this.showQuest, this.setQuest());
            },
            'setQuest': function() {
                this.showQuest && ':ffa' === this.gameMode ? $('#quest-hud').show() : $('#quest-hud').hide();
            },
            'toggleAutoZoom': function() {
                i.autoZoom = !i.autoZoom, this['displayChatInfo'](i.autoZoom, 'autoZoomMsg');
            },
            'resetZoom': function(t) {
                t ? (i['zoomResetValue'] = 1, i.zoomValue = 1) : i['zoomResetValue'] = 0;
            },
            'setZoom': function(t) {
                i.zoomValue = t;
            },
            'toggleDeath': function() {
                this['lastDeath']--; 
				if (this['lastDeath'] < 0){
					this['lastDeath'] = this['deathLocations'].length - 1;
				}
            },
            'tryResp': function() {
                if (i.play || 20 == this['retryResp']) this['retryResp'] = 0;
                else {
                    this['retryResp']++;
                    var t = this;
                    setTimeout(function() {
                        $('.btn-play-guest')['is'](':visible') ? $('.btn-play-guest').click() : $('.btn-play').click(), i.play || t['tryResp']();
                    }, 500);
                }
            },
            'quickResp': function() {
                if(v.quickResp){ 
				this.hideMenu();
				this['gameServerConnect'](this.ws);
				i.play = false;
				this['tryResp']();
				}
            },
            'autoResp': function() {
                v['autoResp'] && (this['setAutoResp'](), 
				$('#overlays')['stop']().hide(), 
				$('.btn-play-guest')['is'](':visible') ? $('.btn-play-guest').click() : $('.btn-play').click());
            },
            'setAutoResp': function() {
                v['autoResp'] && ($('#skipStats').prop('checked') || ($('#skipStats').click(), this['skipStats'] = true));
            },
            'toggleAutoResp': function() {
                v['autoResp'] = !v['autoResp'], this['setAutoResp'](), this['displayChatInfo'](v['autoResp'], 'autoRespMsg');
            },
            'copyLb': function() {
                var t = $('<input>');
                $('body').append(t);
				t.val($('#leaderboard-positions').text()).select();
                try {
                    document.execCommand('copy');
                } catch (ogarcopierlbcather) {}
                t.remove();
            },
            'setPause': function() {
				if (window.autoPlay){ogarminimapdrawer && ogarminimapdrawer.setAutoPlay()};
                this.pause = !this.pause, i.pause = this.pause, this.pause ? (i['resetTargetPosition'](), $('#pause-hud').text(h.pause), $('#pause-hud').show()) : $('#pause-hud').hide();				
            },
            'setCenteredLb': function() {
                v['centeredLb'] ? $('#leaderboard-hud').addClass('hud-text-center') : $('#leaderboard-hud').removeClass('hud-text-center');
            },
            'setNormalLb': function() {
                v['normalLb'] ? $('#leaderboard-hud h5').html(h['leaderboard']) : $('#leaderboard-hud h5').html('legendmod');
            },
            'setFpsAtTop': function() {
                v['fpsAtTop'] ? $('#stats-hud').removeClass('hud-bottom').addClass('hud-top') : $('#stats-hud').removeClass('hud-top').addClass('hud-bottom');
            },
            'setBlockPopups': function() {
                this['protocolMode'] ? $('#block-warn').hide() : v['blockPopups'] ? this['blockPopups']() : this['unblockPopups']();
            },
            'blockPopups': function() {
                $('#openfl-content, #openfl-overlay').hide(); 
				$('#openfl-content, #openfl-overlay').addClass('block-popups'); 
				$('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', true), $('#block-warn').show();
            },
            'unblockPopups': function() {
                $('#openfl-overlay.disabler').click(), $('#openfl-content, #openfl-overlay').hide();
				$('#openfl-content, #openfl-overlay').removeClass('block-popups'); 
				$('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', false), $('#block-warn').hide();
            },
            'tempUnblockPopups': function() {
                v['blockPopups'] && this['unblockPopups']();
            },
            'displayLeaderboard': function(t, e = '') {
				if (this['leaderboardPositionsHUD']){  
					this['leaderboardPositionsHUD'].innerHTML = t;	
					if (v['showLbData']){
						this['leaderboardDataHUD'].innerHTML = e;
						}
					else {
						this['leaderboardDataHUD'].innerHTML = '';			
					}					
				}

            },
            'displayStats': function() {
                if (v['showStats']) {
                    var t = '';
                    i.play && (v.showStatsMass && i.playerMass && (t += h.mass + ': ' + i.playerMass + ' | '), i.playerScore && (t += h['score'] + ': ' + i.playerScore), v['showStatsSTE'] && i['STE'] && (t += ' | STE: ' + i['STE']), v['showStatsN16'] && i.playerSplitCells && (t += ' | ' + i.playerSplitCells + '/16'), v['showStatsFPS'] && (t += ' | ')), v['showStatsFPS'] && (t += 'FPS: ' + ogarfooddrawer['fps']), this['statsHUD'].textContent= t;
                    var e = this;
                    setTimeout(function() {
                        e['displayStats']();
                    }, 250);
                } else $('#stats-hud').hide();
            },
            'displayTime': function() {
                if (v['showTime']) {
                    var t = new Date().toLocaleString();
                    this['timeHUD'].textContent= t;
                    var e = this;
                    setTimeout(function() {
                        e['displayTime']();
                    }, 1000);
                } else $('#time-hud').hide();
            },
            'displayParties': function() {
                for (var t = '', e = 0; e < this.parties.length; e++) t += '<li><a href=\"https://agar.io/#' + this.parties[e] + '\" onclick=\"$(\'#party-token\').val(\'' + this.parties[e] + '\'); $(\'#join-party-btn-2\').click();\">https://agar.io/#' + this.parties[e] + '</a></li>';
                this['activeParties'].className = '' === t ? 'no-parties' : '', this['activeParties'].innerHTML = t;
            },
            /*			
                        'displayTop5': function() {
                            if (v['showTop5']) {
            					//console.log(['top5'].length);
            					//console.log(.teamPlayers.length);
                                for (var t = '', e = 0, s = this['top5'].length, o = 0; o < s; o++) e += this['top5'][o].mass, o >= this['top5limit'] || (t += '<li><span class=\"cell-counter\" style=\"background-color: ' + this['top5'][o].color + '\">' + (o + 1) + '</span>', v['showTargeting'] && (t += '<a href=\"#\" data-user-id=\"' + this['top5'][o].id + '\" class=\"set-target ogicon-target\"></a> '), t += '<span class=\"hud-main-color\">[' + this['calculateMapSector'](this['top5'][o].x, this['top5'][o].y) + ']</span>', t += 					'<span class=\"top5-mass-color\">[' + this['shortMassFormat'](this['top5'][o].mass) + ']</span> ' + this.escapeHTML(this['top5'][o].nick) + '</li>');
                                this['top5pos'].innerHTML = t, i.play && i.playerMass && (e += i.playerMass, s++), this['top5totalMass'].textContent= this['shortMassFormat'](e), this['top5totalPlayers'].textContent= s;
                            }
                        },
                        'setTop5limit': function(t) {
                            t && (this['top5limit'] = t);
                        },

                    "displayTop5" : function() {
                      if (v["showTop5"]) {
                        var pix_color = "";
                        var bufferString = 0;
                        var PL$29 = this.top5.length;
                        var entityType = 0;
                        for (; entityType < PL$29; entityType++) {
                          bufferString = bufferString + this.top5[entityType].mass;
                          if (!(entityType >= v["limTP"])) {
                            pix_color = pix_color + ('<li id="player"><span id="pos-skin" style="background-color: ' + this.top5[entityType].color + '; width: 30px; height:30px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;"  src = ' + (this.top5[entityType]["skin"] ? this.top5[entityType]["skin"] : "https://jimboy3100.github.io/banners/icon32croped.ico.gif") + '" alt=""> ' + 
            				'<span class=\"top5-mass-color\">[' + this['shortMassFormat'](this['top5'][entityType].mass) + ']</span> ' + this.escapeHTML(this.top5[entityType].nick) + '</span><span class=\"hud-main-color\">[' + this.calculateMapSector(this.top5[entityType].x, this.top5[entityType].y) +']</span><span id= "top5mass" class=""> ' + 
                            this["shortMassFormat"](this.top5[entityType].mass) + '</span></li>');
                          }
                        }
                        this["top5pos"].innerHTML = pix_color;
                        if (i["play"] && i.playerMass) {
                          bufferString = bufferString + i.playerMass;
                          PL$29++;
                        }
                        this["top5totalMass"].textContent= this["shortMassFormat"](bufferString);
                        this["top5totalPlayers"].textContent= PL$29;
                      }
                    },
            */
            'displayTop5': function() {
                if (window.top5skins != true) {
                    if (v['showTop5']) {
                        //console.log(['top5'].length);
                        //console.log(.teamPlayers.length);
                        for (var t = '', e = 0, s = this['top5'].length, o = 0; o < s; o++) e += this['top5'][o].mass, o >= window.teamboardlimit || (t += '<li style=\"height: 16px;"\><span>' + (o + 1) + '. </span>', v['showTargeting'] && (t += '<a href=\"#\" data-user-id=\"' + this['top5'][o].id + '\" class=\"set-target ogicon-target\"></a> '), 
						t += '<span class=\"hud-main-color\">[' + this['calculateMapSector'](this['top5'][o].x, this['top5'][o].y) + ']</span>', t += '<span class=\"top5-mass-color\">[' + this['shortMassFormat'](this['top5'][o].mass) + ']</span> ' + this.escapeHTML(this['top5'][o].nick) + '</li>');
                        this['top5pos'].innerHTML = t, i.play && i.playerMass && (e += i.playerMass, s++), 
						this['top5totalMass'].textContent= this['shortMassFormat'](e), this['top5totalPlayers'].textContent= s;
                    }
                }
				else{
                if (v["showTop5"]) {
                    var t = "";
                    var e = 0;
                    var s = this.top5.length;
                    var o = 0;
                    for (; o < s; o++) {
                        e = e + this.top5[o].mass;
                        if (!(o >= window.teamboardlimit)) {
                            t = t + ('<li><a href="#" id="pos-skin" class= "set-target" data-user-id="' + this.top5[o].id + '"style="background-color: ' + this.top5[o].color + '; width: 30px; height:30px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;"  src = ' + (this.top5[o]["skin"] ? this.top5[o]["skin"] : "https://jimboy3100.github.io/banners/icon32croped.ico.gif") + ' alt=""> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');
                            /* if (v["showTargeting"]) {
                              t = t + ('<a href="#" data-user-id="' + this.top5[o].id + '" class="set-target ogicon-target"></a> ');
                            } */
                            t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + "]</span>");
                            t = t + ('<span class="top5-mass-color">[' + this["shortMassFormat"](this.top5[o].mass) + "]</span> " + this.escapeHTML(this.top5[o].nick) + "</div></li>");
                        }
                    }
                    this["top5pos"].innerHTML = t;
                    if (i.play && i.playerMass) {
                        e = e + i.playerMass;
                        s++;
                    }
                    this["top5totalMass"].textContent= this["shortMassFormat"](e);
                    this["top5totalPlayers"].textContent= s;
                }
				}
            },
/*			
            'setTop5limit': function(t) {
                t && (this['top5limit'] = t);
            },
            "setTop5limit": function(canCreateDiscussions) {
                if (canCreateDiscussions) {
                    this["top5limit"] = canCreateDiscussions;
                }
            }, */
			
            'displayChatHistory': function(t) {
                if (t) {
                    this['clearChatHistory'](!0);
                    for (var e = 0; e < this.chatHistory.length; e++) $('#messages').append('<li><span class=\"message-nick\">' + this.chatHistory[e].nick + ': </span><span class=\"message-text\">' + this.chatHistory[e]['message'] + '</span></li>');
                } else this['clearChatHistory'](!1);
            },
            'clearChatHistory': function(t) {
                $('#messages').empty(), t && (toastr['clear'](), v.showChatBox && ($('#chat-box .message').remove(), this.chatHistory.length = 0));
            },
            'displayChatInfo': function(t, e) {
                t ? toastr['info'](h[e + 'A']) : toastr['error'](h[e + 'B']);
            },
            'setDisableChat': function() {
                v['hideChat'] = v['disableChat']; 
				this['setHideChat']();
            },
            'hideChat': function() {
                v['hideChat'] = !v['hideChat'], this['setHideChat'](), this['displayChatInfo'](!v['hideChat'], 'hideChatMsg');
            },
            'setHideChat': function() {
				if (v['hideChat']){
					$('#message-box').hide();
				}
                 this['setShowChatBox']();
            },
            'setShowChatBox': function() {
                !v['hideChat'] && v.showChatBox ? $('#chat-box').show() : $('#chat-box').hide();
            },
            'enterChatMessage': function() {
                var t = $('#message-box');
                var e = $('#message');
                if (t['is'](':visible')) {
                    var o = e.val();
                    o.length ? (this['sendChatMessage'](101, o), i.play && (e.blur(), t.hide())) : (e.blur(), t.hide()), e.val('');
                } else { t.show();
				e['focus']();
				e.val('');}
            },
            'showMenu': function(t) {
                if (window.MC && window.MC['showNickDialog']) return $('.ogario-menu').show(), $('.menu-panel').hide(), i.play || this['skipStats'] ? $('#main-panel').show() : $('#stats').show(), window.MC['showNickDialog'](300), $('#oferwallContainer')['is'](':visible') && window['closeOfferwall'](), void($('#videoContainer')['is'](':visible') && window['closeVideoContainer']());
                t ? $('#overlays').fadeIn(t) : $('#overlays').show();
            },
            'hideMenu': function(t) {
                window.MC && window.MC['showNickDialog'] ? $('.ogario-menu').hide() : t ? $('#overlays').fadeOut(t) : $('#overlays').hide();
            },
            'escapeHTML': function(t) {
                return String(t).replace(/[&<>"'\/]/g, function(t) {
                    return u[t];
                });
            },
            'checkSkinURL': function(t) {
                //return /^https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i .test(t) ? t.replace('http:', 'https:') : '';
                return t.replace('http:', 'https:');
                //return /^https?:\/\/(i|s))\.(?:imgur|hizliresim|put)\.(com|re)\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i .test(t) ? t.replace('http:', 'https:') : '';
            },
            'loadSettings': function() {
                var t = null;
                for (var s in null !== window.localStorage.getItem('ogarioSettings') && (t = JSON.parse(window.localStorage.getItem('ogarioSettings'))), v) v.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (v[s] = t[s]), i.hasOwnProperty(s) && (i[s] = v[s]));
				
            },
            'saveSettings': function(t, i) {
                window.localStorage.setItem(i, JSON.stringify(t));
            },
            'exportSettings': function() {
                var t = {
                    'ogarioCommands': c,
                    'ogarioHotkeys': ogario1Hotkeys,
                    'ogarioPlayerProfiles': ogario1PlayerProfiles,
                    'ogarioSettings': v,
                    'ogarioThemeSettings': g
                };
                for (var e in t) {
                    if (t.hasOwnProperty(e)) $('#export-' + e).prop('checked') || delete t[e];
                }
                t = JSON.stringify(t), $('#export-settings').val(t), $('#import-settings').val(''), t = null;
            },
            'importSettings': function() {
                $('#import-settings').blur();
                var t = $('#import-settings').val();
                if (t) {
                    for (var i in t = JSON.parse(t))
                        if (t.hasOwnProperty(i)) {
                            if (!$('#import-' + i).prop('checked')) continue;
                            window.localStorage.setItem(i, JSON.stringify(t[i]));
                        } window.location.reload();
                }
            },
            'restoreSettings': function() {
                null !== window.localStorage.getItem('ogarioSettings') && (window.localStorage.removeItem('ogarioSettings'), window.location.reload());
            },
            'setSettings': function(t, e) {
                if (v.hasOwnProperty(t) && null !== e) {
                    switch (v[t] = e, i.hasOwnProperty(t) && (i[t] = e), t) {
                        case 'autoResp':
                            this['setAutoResp']();
                            break;
                        case 'showMiniMap':
                            this['setMiniMap']();
                            break;
                        case 'showMiniMapGrid':
                            this['resetMiniMapSectors']();
                            break;
                        case 'disableChat':
                            this['setDisableChat']();
                            break;
                        case 'chatSounds':
                            this['setChatSoundsBtn']();
                            break;
                        case 'showChatBox':
                            this['setShowChatBox']();
                            break;
                        case 'showTop5':
                            this['setTop5']();
                            break;
                        case 'showTargeting':
                            this['setTargetingHUD']();
                            break;
                        case 'showTime':
                            this['displayTime'](), $('#time-hud').show();
                            break;
                        case 'centeredLb':
                            this['setCenteredLb']();
                            break;
                        case 'normalLb':
                            this['setNormalLb']();
                            break;
                        case 'fpsAtTop':
                            this['setFpsAtTop']();
                            break;
                        case 'showStats':
                            this['displayStats'](), $('#stats-hud').show();
                            break;
                        case 'blockPopups':
                            this['setBlockPopups']();
                    }
                    this.saveSettings(v, 'ogarioSettings');
                }
            },
            'loadProfiles': function() {
                if (null !== window.localStorage.getItem('ogarioPlayerProfiles')) {
                    ogario1PlayerProfiles = JSON.parse(window.localStorage.getItem('ogarioPlayerProfiles'))
                    if (ogario1PlayerProfiles.length == 10) { //fix for old players
                        for (var t = 10; t < 15; t++) ogario1PlayerProfiles.push({
                            'nick': 'Profile #' + (t + 1),
                            'clanTag': '',
                            'skinURL': '',
                            'color': g.mainColor
                        });
                    }
                } else {
                    for (var t = 0; t < 15; t++) ogario1PlayerProfiles.push({
                        'nick': 'Profile #' + (t + 1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': g.mainColor
                    });
                }
                if (null !== window.localStorage.getItem('ogarioSelectedProfile')){ 
				this['selectedProfile'] = JSON.parse(window.localStorage.getItem('ogarioSelectedProfile'));
				}
				ogarcopythelb.nick = ogario1PlayerProfiles[this['selectedProfile']].nick;
				ogarcopythelb.clanTag = ogario1PlayerProfiles[this['selectedProfile']].clanTag;
				ogarcopythelb.skinURL = ogario1PlayerProfiles[this['selectedProfile']].skinURL;
				ogarcopythelb.color = ogario1PlayerProfiles[this['selectedProfile']].color;
            },
            'changeSkinPreview': function(e, t) {
				//console.log(e,t);
                if (t && e) {
                    if ("skin-preview" === t) { //or if ("skin-preview" === e)
						//console.log(e,e.src);	
						
						if (e.src.includes(".mp4") || e.src.includes(".webm") || e.src.includes(".ogg")){ //console.log("stage 3a videos");
						$("#skin-preview").children().remove();
                        $("#skin-preview").removeClass("default");
						$("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<video src=\'' + e.src + "' width='350'>\"></a>");
						$("#skin-popover").append('<video id="videoskinpreview" src=\'' + e.src + "' width='350' controls>\"></video>");
//						$("#skin-popover").popover();
						
						//$("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<video src=\'' + t.src + "' width='500'>\"></a>");
						}
						else{
						//console.log("default settings for images on changeSkinPreview")
						$("#skin-preview").removeClass("default");
						$("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<img src=\'' + e.src + "' width='500'>\"></a>");	
						}
                        $("#skin-popover").append($(e).fadeIn(1000));
                        $("#skin-popover").popover();
                    } else {
						if (e.src.includes(".mp4") || e.src.includes(".webm") || e.src.includes(".ogg")){ //console.log("stage 3b videos");
                        $("#" + t).removeClass("default");
						$("#" + t).append($(e).fadeIn(1000));
						
						}
						else{
                        $("#" + t).removeClass("default");
						$("#" + t).append($(e).fadeIn(1000));
					}
                    }
                }
            },
            'setSkinPreview': function(t, e) {
				
				if (t.includes(".mp4") || t.includes(".webm") || t.includes(".ogg")){
					//console.log("stage 1 videos");
					
                if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
					//console.log("stage 1 images/videos: " + t);	
					var i = this;
					o = new Video(); 
					o.src = t;					
                       // o = new Image(); 					
                    o.crossOrigin = 'anonymous';
					setTimeout(function() {
					//newo.onload = function() {
                        i['changeSkinPreview'](o, e);
						checkVideos3(o);
                    //}; 	
					}, 500);
					
				}
				}
				else {					
                    checktypeImgVid = new Image();
					//console.log("stage 1 images");	
								
                if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
					//console.log("stage 1 images/videos: " + t);	
					var i = this, 
					o = checktypeImgVid; o.src = t;
                       // o = new Image(); 					
                    o.crossOrigin = 'anonymous', o.onload = function() {
                        i['changeSkinPreview'](o, e);
                    }; 
                }
				}
            },
            'setProfile': function() {
                var t = (ogario1PlayerProfiles.length + this['selectedProfile'] - 1) % ogario1PlayerProfiles.length,
                    e = (this['selectedProfile'] + 1) % ogario1PlayerProfiles.length;
                //console.log(ogario1PlayerProfiles.length);
                this['setSkinPreview'](ogario1PlayerProfiles[t].skinURL, 'prev-profile');
				this['setSkinPreview'](ogario1PlayerProfiles[this['selectedProfile']].skinURL, 'skin-preview');
				this['setSkinPreview'](ogario1PlayerProfiles[e].skinURL, 'next-profile');
				this.saveSettings(this['selectedProfile'], 'ogarioSelectedProfile');
				$('#nick').val(ogario1PlayerProfiles[this['selectedProfile']].nick);
				$('#clantag').val(ogario1PlayerProfiles[this['selectedProfile']].clanTag);
				$('#skin').val(ogario1PlayerProfiles[this['selectedProfile']].skinURL);
				$('#color').val(ogario1PlayerProfiles[this['selectedProfile']].color);
				$('.skin')['colorpicker']('setValue', ogario1PlayerProfiles[this['selectedProfile']].color);
				$('#skins a').removeClass('selected');
				$('#skins a[data-profile=\'' + this['selectedProfile'] + '\']').addClass('selected');
            },
            'prevProfile': function() {
                this.setPlayerSettings(),
				this['selectedProfile'] = (ogario1PlayerProfiles.length + this['selectedProfile'] - 1) % ogario1PlayerProfiles.length, this['setProfile']();
            },
            'nextProfile': function() {
                this.setPlayerSettings(),
				this['selectedProfile'] = (this['selectedProfile'] + 1) % ogario1PlayerProfiles.length, this['setProfile']();
            },
            'selectProfile': function(t) {
                this.setPlayerSettings();
				this['selectedProfile'] = parseInt(t);
				this['setProfile']();
            },
            'addOption': function(t, e, i, o) {
                $(t).append('<label><input type=\"checkbox\" id=\"' + e + '\" class=\"js-switch\"> ' + i + '</label>');
				$('#' + e).prop('checked', o);
            },
            'addOptions': function(t, e) {
                if (t) {
                    $('#og-options').append('<div class=\"options-box ' + e + '\"><h5 class=\"menu-main-color\">' + h[e] + '</h5></div>');
                    for (var i = 0; i < t.length; i++) {
                        var o = t[i];
                        if(v.hasOwnProperty(o)){
							$('.' + e).append('<label>' + h[o] + ' <input type=\"checkbox\" class=\"js-switch\" id=\"' + o + '\"></label>'); 
							$('#' + o).prop('checked', v[o]);
						}
                    }
                }
            },
            'addInputBox': function(t, e, i, o) {
                $(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + v[e] + '\" /></div>');
                var a = this;
                $('#' + e).on('input', function() {
                    v[e] = this.value, a[o](), a.saveSettings(v, 'ogarioSettings');
                });
            },
            'addSliderBox': function(t, e, o, a, n, r) {
                $(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + v[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + v[e] + '\"></div>');
                var l = this;
                r ? $('#' + e + '-slider').on('input', function() {
                    var t = parseFloat($(this).val());
                    $('#' + e + '-value').text(t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r](), l.saveSettings(v, 'ogarioSettings');
                }) : $('#' + e + '-slider').on('input', function() {
                    var t = parseFloat($(this).val());
                    $('#' + e + '-value').text(t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l.saveSettings(v, 'ogarioSettings');
                });
            },
            'setLang': function() {
                if ('pl' === r && window.i18n_dict && window.i18n_dict.en)
                    for (var t in window.i18n_dict.en) window.i18n_dict.en.hasOwnProperty(t) && h.hasOwnProperty(t) && (window.i18n_dict.en[t] = h[t]);
            },
            'setMenu': function() {
                var t;
                for (t in document.title = this["name"], $("#mainPanel")["before"]('<div id="exp-bar" class="agario-panel"><span class="ogicon-user"></span><div class="agario-exp-bar progress"><span class="progress-bar-text"></span><div class="progress-bar progress-bar-striped" style="width: 0%;"></div></div><div class="progress-bar-star"></div></div><div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="start-tab active"><a href="#main-panel" class="active ogicon-home" data-toggle="tab-tooltip" title="' +
                        h["start"] + '"></a></li><li class="profile-tab"><a href="#profile" class="ogicon-user" data-toggle="tab-tooltip" title="' + h["profile"] + '"></a></li><li class="settings-tab"><a href="#og-settings" class="ogicon-cog" data-toggle="tab-tooltip" title="' + h["settings"] + '"></a></li><li class="theme-tab"><a href="#theme" class="ogicon-droplet" data-toggle="tab-tooltip" title="' + h["theme"] + '"></a></li><li class="hotkeys-tab"><a href="#" class="hotkeys-link ogicon-keyboard" data-toggle="tab-tooltip" title="' +
                        h["hotkeys"] + '"></a></li><li class="music-tab"><a href="#music" class="ogicon-music" data-toggle="tab-tooltip" title="Radio / ' + h["sounds"] + '"></a></li></ul><div id="main-panel" class="menu-panel"></div><div id="profile" class="menu-panel"></div><div id="og-settings" class="menu-panel"><div class="submenu-panel"></div></div><div id="theme" class="menu-panel"></div><div id="music" class="menu-panel"></div></div>'), $("#main-panel").append('<a href="#" class="quick quick-menu ogicon-menu"></a><a href="#" class="quick quick-skins ogicon-images"></a><div id="profiles"><div id="prev-profile"></div><div id="skin-preview"></div><div id="next-profile"></div></div>'),
                    $("#mainPanel div[role=form]").appendTo($("#main-panel")), $("#main-panel div[role=form] .form-group:first").remove(), $("#nick")["before"]('<input id="clantag" class="form-control" placeholder="Tag, e.g. \u24c2" maxlength="10"><div class="input-group nick"></div>'), $("#nick").appendTo($(".nick")), $(".nick").append('<span class="input-group-btn"><button id="stream-mode" class="btn active ogicon-eye"></button></span>'), $(".nick")["after"]('<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (imgur.com direct link)" maxlength="40"><input type="hidden" id="color" value="' +
                        ogarcopythelb.color + '" maxlength="7" /><span class="input-group-addon"><i></i></span><span class="input-group-btn"><button id="hide-url" class="btn active ogicon-eye"></button></span></div>'), $("#locationKnown, #locationUnknown")["insertAfter"]($(".skin")), $("#region")["before"]('<button class="btn btn-warning btn-server-info ogicon-cogs"></button>'), $(".btn-spectate, .btn-logout").appendTo("#agario-main-buttons"), $("#agario-main-buttons").addClass("clearfix")["before"]('<div id="server-info" class="form-group clearfix"><input id="server-ws" class="form-control" placeholder="Server WS"><button id="server-connect" class="btn btn-success ogicon-power"></button><button id="server-reconnect" class="btn btn-primary ogicon-redo2"></button><input id="server-token" class="form-control" placeholder="Server token"><button id="server-join" class="btn btn-success" data-itr="page_join_party">Join</button></div>'),
                    $("#helloContainer div[role=form]")["after"]('<div id="ogario-party" class="clearfix"><input id="party-token" class="form-control" placeholder="Party token"></div>'), $("#ogario-party").append('<button id="join-party-btn-2" class="btn btn-success" data-itr="page_join_party">Join</button><button id="create-party-btn-2" class="btn btn-primary" data-itr="page_create_party">Create</button>'), $("#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first").appendTo($("#ogario-party")),
                    $("#settingsChoice, #options").appendTo($("#og-settings .submenu-panel")), $("#stats").appendTo($("#main-menu")).addClass("menu-panel"), $("#statsContinue")["attr"]("id", "statsContinue2"), $("#mainPanel")["empty"]().remove(), $(".center-container").addClass("ogario-menu"), $(".center-container").append('<div id="menu-footer" class="menu-main-color">' + h["visit"] + ' <a href="http://legendmod.ml" target="_blank">legendmod.ml</a> | ' + this["version"] + ' <a href="https://goo.gl/nRREoR" class="release ogicon-info" target="_blank"></a></div>'),
                    $("#leftPanel, #rightPanel").addClass("ogario-menu")["removeAttr"]("id"), $(".agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel").appendTo($("#profile")).removeClass("agario-side-panel"), $(".agario-profile-panel")["after"]('<div id="block-warn">' + h["blockWarn"] + '<br><a href="#" id="unblock-popups">' + h["unblockPopups"] + "</a></div>"), $("#exp-bar").addClass("agario-profile-panel"), $(".left-container")["empty"](), $(".agario-shop-panel")["after"]('<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">The Legend Mod Project</h5><div class="g-ytsubscribe" data-channelid="UCoj-ZStcJ0jLMOSK7FOBTbA" data-layout="full" data-theme="dark" data-count="default"></div></div>'),
                    $("#tags-container").appendTo($("#profile")), $(".btn-logout").appendTo($("#profile")), $(".left-container").append('<div id="quick-menu" class="agario-panel agario-side-panel"><a href="https://jimboy3100.github.io/skins/" class="quick-more-skins ogicon-grin" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="' + h["skins"] + '"></a><a href="https://youtube.com/channel/UCoj-ZStcJ0jLMOSK7FOBTbA" class="quick-yt ogicon-youtube2" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="Team OGARio"></a></div>'),
                    this["protocolMode"] || $("#quick-menu")["prepend"]('<a href="#" class="quick-shop ogicon-cart" data-toggle="tab-tooltip" data-placement="left" title="' + h["page_shop"] + '"></a><a href="#" class="quick-free-coins ogicon-coin-dollar" data-toggle="tab-tooltip" data-placement="left" title="' + h["page_menu_main_free_coins"] + '"></a><a href="#" class="quick-free-gifts ogicon-gift" data-toggle="tab-tooltip" data-placement="left" title="' + h["page_menu_main_gifts"] + '"></a><a href="#" class="quick-quests ogicon-trophy" data-toggle="tab-tooltip" data-placement="left" title="' +
                        h["page_menu_main_dailyquests"] + '"></a>'), $(".party-dialog, .partymode-info").remove(), $(".agario-party-6").appendTo($(".center-container")), $(".right-container")["empty"](), $(".right-container").append('<div class="agario-party"></div>'), $(".agario-party-6").appendTo($(".agario-party")).addClass("agario-panel agario-side-panel"), $(".agario-party h4, #cancel-party-btn").remove(), $(".agario-party .btn").addClass("btn-sm"), $(".right-container").append('<div id="skins-panel" class="agario-panel agario-side-panel"><div id="skins"></div><a href="https://ogario.ovh/skins/" id="more-skins" class="btn btn-block btn-success" target="_blank">' +
                        h["moreSkins"] + "</a></div>"), $(".btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr='page_option_dark_theme'], #options #darkTheme").remove(), $("#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom").css("display", "none"), $("#advertisement").removeClass("agario-panel"), $("#adsBottom")["css"]({
                        "z-index": "1",
                        "opacity": "0",
                        "bottom": "-100px"
                    }), $("#noNames, #showMass").remove(), $("#og-settings .submenu-panel").append('<div id="og-options"></div>'), 
					this["addOptions"]([], "animationGroup"), 
					this["addOptions"](["autoZoom"], "zoomGroup"), 
					this["addOptions"](["quickResp", "autoResp"], "respGroup"), 
					this["addOptions"](["noNames", "optimizedNames", "autoHideNames", "hideMyName", "hideTeammatesNames", "namesStroke"], "namesGroup"), 
					this["addOptions"](["jellyPhisycs","showMass", "optimizedMass", "autoHideMass", "hideMyMass", "hideEnemiesMass", "shortMass", "virMassShots", "massStroke", "virusSound"], "massGroup"),
					this["protocolMode"] ? this["addOptions"](["customSkins", "videoSkins", "videoSkinsMusic"], "skinsGroup") : this["addOptions"](["customSkins", "vanillaSkins", "videoSkins", "videoSkinsMusic"], "skinsGroup"), 
					this["addOptions"](["optimizedFood", "autoHideFood", "autoHideFoodOnZoom", "rainbowFood"], "foodGroup"), 
					this["addOptions"](["myCustomColor", "myTransparentSkin", "transparentSkins", "transparentCells", "transparentViruses", "virusGlow"], "transparencyGroup"), 
					this["addOptions"](["showGrid", "showBgSectors", "showMapBorders", "borderGlow"], "gridGroup"), 
					this["addOptions"](["disableChat", "chatSounds", "chatEmoticons", "showChatImages", "showChatVideos", "showChatBox"], "chatGroup"), 
					this["addOptions"](["showMiniMap", "showMiniMapGrid", "showMiniMapGuides", "showExtraMiniMapGuides", "showMiniMapGhostCells", "oneColoredTeammates"], "miniMapGroup"), 
					this["addOptions"](["oppColors", "oppRings", "virColors", "splitRange", "virusesRange", "cursorTracking", "teammatesInd", "showGhostCells", "showGhostCellsInfo"], "helpersGroup"), 
					this["addOptions"](["mouseSplit", "mouseFeed","mouseInvert"], "mouseGroup"), 
					this["addOptions"](["showTop5", "showTargeting", "showLbData", "centeredLb", "normalLb", "fpsAtTop"], "hudGroup"), 
					this["addOptions"](["showStats", "showStatsMass", "showStatsSTE", "showStatsN16", "showStatsFPS", "showTime"], "statsGroup"), 
					this["protocolMode"] || (this["addOptions"](["blockPopups"], "extrasGroup"), $("#noSkins, #noColors, #skipStats, #showQuest").addClass("js-switch-vanilla"), $(".skinsGroup h5")["after"]('<label class="noSkins">' + h["noSkins"] +
                        " </label>"), $("#noSkins").appendTo($(".noSkins")), $(".transparencyGroup h5")["after"]('<label class="noColors">' + h["noColors"] + " </label>"), $("#noColors").appendTo($(".noColors")), $(".extrasGroup h5")["after"]('<label class="skipStats">' + h["skipStats"] + " </label>"), $("#skipStats").appendTo($(".skipStats")), $(".skipStats")["after"]('<label class="showQuest">' + h["showQuest"] + " </label>"), $("#showQuest").appendTo($(".showQuest")), $("#options").remove(), $("#settingsChoice").appendTo($(".extrasGroup")).addClass("select-wrapper")),
                    this["addSliderBox"](".animationGroup", "animation", 20, 200, 1), this["addSliderBox"](".zoomGroup", "zoomSpeedValue2", -0.90, 0.90, 0.01), $("#og-settings").append('<button class="btn btn-block btn-success btn-export">' + h["exportImport"] + "</button>"), $("#og-settings").append('<div class="restore-settings"><a href="#">' + h["restoreSettings"] + "</a></div>"), $("#music").append('<div class="agario-panel radio-panel"><h5 class="menu-main-color">Radio (' + h["thanks"] + ')</h5><audio src="" controls></audio><span class="playlist"><span class="ogicon-file-music"></span> <a href="" target="_blank">' +
                        h["playlist"] + "</a></span></div>"), $("#music").append('<div class="agario-panel sounds-panel"><h5 class="menu-main-color">' + h["sounds"] + "</h5></div>"), $("#music").append('<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Legend Clan (tag: \u24c2)</h5><div class="g-ytsubscribe" data-channelid="UCoj-ZStcJ0jLMOSK7FOBTbA" data-layout="full" data-theme="dark" data-count="default"></div></div>'), this["addInputBox"](".sounds-panel", "messageSound", "Sound URL", "setMessageSound"),
                    this["addInputBox"](".sounds-panel", "commandSound", "Sound URL", "setCommandSound"), this["addInputBox"](".sounds-panel", "virusSoundurl", "Sound URL", "setvirusSound"), $("body").append('<div id="overlays-hud" data-gamemode=":ffa"><div id="stats-hud" class="hud stats-hud-color"></div> <div id="top5-hud" class="hud"><h5 class="hud-main-color">Team<span class="team-top"></span></h5><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ' + //<div class="hud-main-color team-top-menu"><a href="#" data-limit="5" class="team-top-limit active">5</a> | <a href="#" data-limit="10" class="team-top-limit">10</a> | <a href="#" data-limit="100" class="team-top-limit">100</a></div><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ' +
                        h["totalPartyPlayers"] + ': <span id="top5-total-players" class="top5-mass-color">0</span>   <span class="hud-main-color ogicon-pacman"></span> ' + h["totalPartyMass"] + ': <span id="top5-total-mass" class="top5-mass-color">0</span></div></div> <div id="time-hud" class="hud time-hud-color"></div> <div id="pause-hud" class="hud">' + h.pause + '</div> <div id="leaderboard-hud" class="hud-b"><h5 class="hud-main-color">legendmod.ml</h5><div id="leaderboard-data"></div><div id="leaderboard-positions"></div></div> <div id="btl-leaderboard-hud"><div class="hud hud-c"><span id="btl-players-status">Players ready</span>: <span id="btl-players-count">0</span></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="target-hud" class="hud"><div id="target-player"><span id="target-skin"><img src="https://jimboy3100.github.io/banners/static/img/blank.png" alt=""> </span><span id="target-nick"></span><span id="target-status" class="hud-main-color">' + //class="hud-main-color">[' +
                        h["targetNotSet"] + '</span></div><div id="target-summary"></div></div><div id="target-panel-hud" class="hud"><a href="#" id="set-targeting" class="ogicon-target"></a><a href="#" id="set-private-minimap" class="ogicon-location2"></a><a href="#" id="cancel-targeting" class="ogicon-cancel-circle"></a><a href="#" id="change-target" class="ogicon-arrow-right"></a></div> <div id="quest-hud" class="hud"></div> <div id="btl-hud" class="hud"></div></div>'), $("body").append('<ul id="messages"></ul>'), $("body").append('<div id="message-box"><div id="chat-emoticons"></div><div id="message-menu"><a href="#" class="chat-sound-notifications ogicon-volume-high"></a><a href="#" class="chat-active-users ogicon-user-check"></a><a href="#" class="chat-muted-users ogicon-user-minus"></a><a href="#" class="show-chat-emoticons ogicon-smile"></a></div><input type="text" id="message" class="form-control" placeholder="' +
                        h["enterChatMsg"] + '..." maxlength="80"></div>'), $("body").append('<div id="chat-box"></div>'), d) {
                    if (d.hasOwnProperty(t)) {
                        $("#chat-emoticons").append('<img src="https://jimboy3100.github.io/banners/emoticons/' + d[t] + '" alt="' + t + '" class="emoticon">');
                    }
                }
                $("body").append('<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">' + h["close"] + '</button></div><div id="exp-imp-settings"></div></div>'), $("#exp-imp-settings").append("<h1>" + h["exportSettings"] + "</h1><h2>" + h["exportInfo"] + "</h2>"), this["addOption"]("#exp-imp-settings", "export-ogarioCommands", h["commands"], true), this["addOption"]("#exp-imp-settings", "export-ogarioHotkeys", h["hotkeys"], true), this["addOption"]("#exp-imp-settings", "export-ogarioPlayerProfiles",
                    h["profiles"], true), this["addOption"]("#exp-imp-settings", "export-ogarioSettings", h["settings"], true), this["addOption"]("#exp-imp-settings", "export-ogarioThemeSettings", h["theme"], true), $("#exp-imp-settings").append('<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">' + h["exportSettings"] + "</button>"), $("#exp-imp-settings").append("<h1>" + h["importSettings"] + "</h1><h2>" +
                    h["importInfo"] + "</h2>"), this["addOption"]("#exp-imp-settings", "import-ogarioCommands", h["commands"], true), this["addOption"]("#exp-imp-settings", "import-ogarioHotkeys", h["hotkeys"], true), this["addOption"]("#exp-imp-settings", "import-ogarioPlayerProfiles", h["profiles"], true), this["addOption"]("#exp-imp-settings", "import-ogarioSettings", h["settings"], true), this["addOption"]("#exp-imp-settings", "import-ogarioThemeSettings", h["theme"], true), $("#exp-imp-settings").append('<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">' +
                    h["importSettings"] + "</button>"), y && y["setThemeMenu"]();
                /** @type {number} */
                var e = 0;
                for (; e < ogario1PlayerProfiles.length; e++) {
                    $("#skins").append('<div class="skin-box"><a href="#profile-' + e + '" id="profile-' + e + '" data-profile="' + e + '"></a></div>');
                    this["setSkinPreview"](ogario1PlayerProfiles[e].skinURL, "profile-" + e);
                    if (e == this["selectedProfile"]) {
                        $("#profile-" + e).addClass("selected");
                    }
                }
            },
            'setUI': function() {
                var t = this;
                $(document).on("click", ".menu-tabs a", function(event) {
                        event.preventDefault();
                        t["switchMenuTabs"]($(this), "menu-panel");
                    });
				$(document).on("click", ".submenu-tabs a", function(event) {
                        event.preventDefault();
                        t["switchMenuTabs"]($(this), "submenu-panel");
                    });
				$(document).on("click", ".quick-menu", function(event) {
                        event.preventDefault();
                        v["showQuickMenu"] = !v["showQuickMenu"];
                        t["saveSettings"](v, "ogarioSettings");
                        t["setShowQuickMenu"]();
                    });
				$(document).on("click", ".quick-skins", function(event) {
                        event.preventDefault();
                        v["showSkinsPanel"] = !v["showSkinsPanel"];
                        t["saveSettings"](v, "ogarioSettings");
                        t["setShowSkinsPanel"]();
                    }); 
				$(document).on("change", "#region", function() {
                        t.region = this.value;
                    }); 
				$(document).on("change", "#gamemode", function() {
                        var dummy = this.value;
                        if (":party" !== dummy) {
                            t["leaveParty"]();
                        }
                        t.gameMode = i.gameMode = dummy;
                        t["setQuest"]();
                    }); 
				$(document).on("change", "#quality", function() {
                        t.getQuality(this.value);
                        ogarhusettings();
                    }); 
				$(document).on("input", "#skin", function() {
                        var hexInputVal = this.value;
                        t["setSkinPreview"](hexInputVal, "skin-preview");
                        t["setSkinPreview"](hexInputVal, "profile-" + t["selectedProfile"]);
                    }); 
				$(document).on("click", "#skins a", function(event) {
                        event.preventDefault();
                        t["selectProfile"]($(this)["attr"]("data-profile"));
                    }); 
				$(document).on("click", "#prev-profile", function() {
                        t["prevProfile"]();
                    }); 
				$(document).on("click", "#next-profile", function() {
                        t["nextProfile"]();
                    }); 
				$(document).on("click", "#stream-mode", function() {
                        /** @type {boolean} */
                        v["streamMode"] = !v["streamMode"];
                        t["saveSettings"](v, "ogarioSettings");
                        t["setStreamMode"]();
                    }); 
				$(document).on("click", "#hide-url", function() {
                        /** @type {boolean} */
                        v["hideSkinUrl"] = !v["hideSkinUrl"];
                        t["saveSettings"](v, "ogarioSettings");
                        t["setHideSkinUrl"]();
                    }); 
				$(document).on("click", ".btn-server-info", function() {
                        $("#server-info").toggle();
                    }); 
				$(document).on("click", "#server-connect", function() {
                        t["gameServerConnect"]($("#server-ws").val());
                    }); 
				$(document).on("click", "#server-reconnect", function() {
                        t["gameServerReconnect"]();
                    }); 
				$(document).on("click", "#server-join", function() {
                        t["gameServerJoin"]($("#server-token").val());
                    }); 
				$(document).on("change", "#og-options input[type='checkbox']", function() {
                        var template = $(this);
                        t["setSettings"](template["attr"]("id"), template.prop("checked"));
                    }); 
				$(document).on("change", ".js-switch-vanilla", function() {
                        var template = $(this);
                        var p = template["attr"]("id");
                        if (void 0 !== t[p]) {
                            t[p] = template.prop("checked");
                            if ("noSkins" === p) {
                                /** @type {boolean} */
                                i["showCustomSkins"] = !t["noSkins"];
                            }
                            if ("showQuest" === p) {
                                t["setQuest"]();
                            }
                        }
                    }); 
				$(document).on("click", "#og-settings .restore-settings a", function(result) {
                        result["preventDefault"]();
                        t["restoreSettings"]();
                    }); 
				$(document).on("click", "#og-settings .btn-export", function(result) {
                        result["preventDefault"]();
                        t["exportSettings"]();
                        $("#exp-imp").fadeIn(500);
                        $("#exp-imp-settings, #export-settings")["perfectScrollbar"]("update");
                    }); 
				$(document).on("click", "#close-exp-imp", function(event) {
                        event.preventDefault();
                        $("#exp-imp").fadeOut(500);
                    }); 
				$(document).on("focus", "#export-settings", function() {
                        $(this).select();
                    }), 
				$(document).on("click", "#export-settings-btn", function(event) {
                        event.preventDefault();
                        t["exportSettings"]();
                    }); 
				$(document).on("click", "#import-settings-btn", function(result) {
                        result["preventDefault"]();
                        t["importSettings"]();
                    }); 
				$(document).on("click", "#unblock-popups", function(result) {
                        result["preventDefault"]();
                        t["unblockPopups"]();
                    }); 
				$(document).on("click", "#openfl-overlay.disabler", function() {
                        if (v["blockPopups"]) {
                            t["blockPopups"]();
                        }
                    }); 
				$(document).on("click", "#openfl-content", function() {
                        if (v["blockPopups"]) {
                            var container = $(this);
                            setTimeout(function() {
                                if (!container.is(":visible")) {
                                    t["blockPopups"]();
                                }
                            }, 1000);
                        }
                    });
				$(document).on("click", ".quick-shop", function(event) {
                        event.preventDefault();
                        t["unblockPopups"]();
                        if (window.MC && window.MC["openShop"]) {
                            window.MC["openShop"]();
                        }
                    }); 
				$(document).on("click", ".quick-free-coins", function(event) {
                        event.preventDefault();
                        t["unblockPopups"]();
                        if (window.MC && window.MC["showFreeCoins"]) {
                            window.MC["showFreeCoins"]();
                        }
                    }); 
				$(document).on("click", ".quick-free-gifts", function(event) {
                        event.preventDefault();
                        t["unblockPopups"]();
                        if (window.MC && window.MC["showGifting"]) {
                            window.MC["showGifting"]();
                        }
                    }); 
				$(document).on("click", ".quick-quests", function(event) {
                        event.preventDefault();
                        t["unblockPopups"]();
                        if (window.MC && window.MC["showQuests"]) {
                            window.MC["showQuests"]();
                        }
                    }); 
				$(document).on("click", "#set-targeting", function(event) {
                        event.preventDefault();
                        t["setTargeting"]();
                    }); 
				$(document).on("click", "#cancel-targeting", function(event) {
                        event.preventDefault();
                        t["cancelTargeting"]();
                    }); 
				$(document).on("click", "#set-private-minimap", function(event) {
                        event.preventDefault();
                        t["setPrivateMiniMap"]();
                    });
				$(document).on("click", "#change-target", function(result) {
                        result["preventDefault"]();
                        t["changeTarget"]();
                    });
				$(document).on("click", ".team-top-limit", function(event) {
                        event.preventDefault();
                        var template = $(this);
                        /** @type {number} */
                        var param = parseInt(template["attr"]("data-limit"));
                        if (param) {
                            t["setTop5limit"](param);
                            t.displayTop5();
                            $(".team-top").text(param);
                            $(".team-top-limit").removeClass("active");
                            template.addClass("active");
                        }
                    }); 
				$(document).on("click", "#top5-pos .set-target", function(event) {
                        event.preventDefault();
                        t["setTarget"](parseInt($(this)["attr"]("data-user-id")));
                    }); 
				$(document).on("click", ".mute-user", function(event) {
                        event.preventDefault();
                        t["muteChatUser"](parseInt($(this)["attr"]("data-user-id")));
                    }); 
				$(document).on("click", ".btn-mute-user", function() {
                        var template = $(this);
                        t["muteChatUser"](parseInt(template["attr"]("data-user-id")));
                        template.removeClass("btn-red btn-mute-user").addClass("btn-green btn-unmute-user").text(h["unmute"]);
                    }); 
				$(document).on("click", ".btn-unmute-user", function() {
                        var template = $(this);
                        t["unmuteChatUser"](parseInt(template["attr"]("data-user-id")));
                        template.removeClass("btn-green btn-unmute-user").addClass("btn-red btn-mute-user").text(h["mute"]);
                    }); 
				$(document).on("click", ".chat-sound-notifications", function(result) {
                        result["preventDefault"]();
                        /** @type {boolean} */
                        v["chatSounds"] = !v["chatSounds"];
                        t["saveSettings"](v, "ogarioSettings");
                        t["setChatSoundsBtn"]();
                    }); 
				$(document).on("click", ".chat-active-users", function(event) {
                        event.preventDefault();
                        t["displayChatActiveUsers"]();
                    }); 
				$(document).on("click", ".chat-muted-users", function(event) {
                        event.preventDefault();
                        t["displayChatMutedUsers"]();
                    });
				$(document).on("click", ".show-chat-emoticons", function(result) {
                        result["preventDefault"]();
                        var template = $(this);
                        var p = $("#chat-emoticons");
                        p.toggle();
                        if (p.is(":visible")) {
                            template.addClass("active");
                        } else {
                            template.removeClass("active");
                            $("#message")["focus"]();
                        }
                    }); 
				$(document).on("click", "#chat-emoticons .emoticon", function() {
                        var d = $(this)["attr"]("alt");
                        var e = $("#message");
                        var n = e.val();
                        if (n.length + d.length <= 80) {
                            e.val(n + d);
                        }
                        e["focus"]();
                    }); 
				this["statsHUD"] = document.getElementById("stats-hud"); 
				this["activeParties"] = document.getElementById("active-parties");
				this["top5pos"] = document.getElementById("top5-pos");
				this["top5totalMass"] = document.getElementById("top5-total-mass");
				this["top5totalPlayers"] = document.getElementById("top5-total-players"); 
				this["leaderboardPositionsHUD"] = document.getElementById("leaderboard-positions");
				this["leaderboardDataHUD"] = document.getElementById("leaderboard-data");
				this["timeHUD"] = document.getElementById("time-hud"), this["questHUD"] = document.getElementById("quest-hud"), $("#canvas")["bind"]("contextmenu", function() {
                        return false;
                    }); 
				$(document).on("mouseup", ".btn", function() {
                        $(this)["blur"]();
                    });
				$("[data-toggle='tab-tooltip']")["tooltip"]({
                        "trigger": "hover"
                    }); 
				$(".submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings")["perfectScrollbar"]({
                        "suppressScrollX": true
                    }); 
				Array.prototype.slice.call(document.querySelectorAll(".js-switch")).forEach(function(remove) {
                        new Switchery(remove, {
                            "color": g["menuMainColor"],
                            "size": "small"
                        });
                    }); 
				$("input[type='range']")["rangeslider"]({
                        "polyfill": false
                    });
				toastr["options"] = {
                        "newestOnTop": false,
                        "positionClass": "toast-bottom-left",
                        "timeOut": 15000
                    };

            },
            'switchMenuTabs': function(t, e) {
                var i = t['parent']();
                if ('menu-panel' === e) {
                    if (t['hasClass']('hotkeys-link')) return;
                    i['hasClass']('profile-tab') && this['setBlockPopups']();
                }
                t.addClass('active'), i.addClass('active'), i['siblings']().removeClass('active'), i['siblings']()['find']('a').removeClass('active');
                var o = t.attr('href');
                if ('submenu-panel' === e) {
                    var a = $(o)['parent']().attr('id');
                    $('#' + a + ' .submenu-panel').not(o).css('display', 'none');
                } else $('.menu-panel').not(o).css('display', 'none');
                $(o).fadeIn(1000), ogarhusettings(), $('.submenu-panel').perfectScrollbar('update');
            },
            'getDefaultSettings': function() {
                if (this["noSkins"] = $("#noSkins").prop("checked"), this["noColors"] = $("#noColors").prop("checked"), this["skipStats"] = $("#skipStats").prop("checked"), this["showQuest"] = $("#showQuest").prop("checked"), i["showCustomSkins"] = !this["noSkins"], null !== window.localStorage.getItem("scale_setting")) {
                    var t = JSON.parse(window.localStorage.getItem("scale_setting"));
                    this["setCanvasScale"](t);
                } else {
                    var o = $("#quality").val();
                    this.getQuality(o);
                }
                null !== window.localStorage.getItem("location") ? (this.region = window.localStorage.getItem("location"), 
				$("#region").val(this.region), 
				window.MC && window.MC.setRegion && window.MC.setRegion(this.region)) : this.region = $("#region").val(), 
				this.setParty(), ":party" === this.gameMode && window.location.hash && 
				$("#join-party-btn-2").click(), 
				Array.prototype.slice.call(document.querySelectorAll(".js-switch-vanilla")).forEach(function(remove) {
                    new Switchery(remove, {
                        "color": g["menuMainColor"],
                        "size": "small"
                    });
                }), $("#nick").val(ogarcopythelb.nick)["blur"](), 
				$("#noNames").prop("checked", !v["noNames"]), 
				$("#showMass").prop("checked", v["showMass"]), 
				this["unlockButtons"](), 
				this["setAutoResp"](), 
				this["setQuest"]();
            },
            'getQuality': function(t) {
                var i = 1;
                switch ('devicePixelRatio' in window && (i = window.devicePixelRatio), t) {
                    case 'High':
                        this.setCanvasScale(1);
                        break;
                    case 'Medium':
                        this.setCanvasScale(0.9);
                        break;
                    case 'Low':
                        this.setCanvasScale(0.75);
                        break;
                    case 'VeryLow':
                        this.setCanvasScale(0.5);
                        break;
                    default:
                        this.setCanvasScale(i);
                }
            },
            'setCanvasScale': function(t) {
                this.canvasScale = t;
				i.canvasScale = t;
            },
            'setStreamMode': function() {
                if (v["streamMode"]) {
                    $("#stream-mode").addClass("ogicon-eye-blocked");
                    $("#clantag, #nick, #party-token").addClass("stream-mode");
                } else {
                    $("#stream-mode").removeClass("ogicon-eye-blocked");
                    $("#clantag, #nick, #party-token").removeClass("stream-mode");
                }
            },
            'setHideSkinUrl': function() {
                if (v["hideSkinUrl"]) {
                    $("#hide-url").addClass("ogicon-eye-blocked");
                    $("#skin").addClass("hide-url");
                } else {
                    $("#hide-url").removeClass("ogicon-eye-blocked");
                    $("#skin").removeClass("hide-url");
                }
            },
            'setShowQuickMenu': function() {
                if (v["showQuickMenu"]) {
                    $("#quick-menu").fadeIn(500);
                } else {
                    $("#quick-menu").fadeOut(500);
                }
            },
            'setShowSkinsPanel': function() {
                if (v["showSkinsPanel"]) {
                    $("#skins-panel").fadeIn(500);
                } else {
                    $("#skins-panel").fadeOut(500);
                }
            },
            'unlockButtons': function() {
                $('.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate').prop('disabled', false);
            },
            'setMainButtons': function() {
                var t = this;
                $(document).on("click", ".btn-play, .btn-play-guest", function() {
                    t.onPlay();
                });
				$(document).on("click", ".btn-spectate", function() {
                    t.onSpectate();
                }); 
				$(document).on("click", "#create-party-btn-2", function() {
                    t.onCreate();
                });
				$(document).on("click", "#join-party-btn-2", function() {
                    t.skipServerData = true;
                    t.joinParty();
                    t.onJoin();
                }); 
				$(document).on("click", "#statsContinue2", function() {
                    $("#stats, #main-panel").toggle();
                });
            },
            'play': function() {
                if (this.setPlayerSettings(), this.setParty(), this.isSocketOpen()) this.sendPartyData();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t.sendPartyData();
                    }, 1000);
                }
            },
            'onPlay': function() {
                //                this.play(), this.hideMenu(), window.addKeyListeners && window.addKeyListeners(), v.autoHideFood && (i.showFood = true), window['ga'] && window['ga']('create', 'UA-92655864-7', 'auto', 'ogarioTracker'), window['ga'] && window['ga']('ogarioTracker.send', 'pageview');
                this.play(); 
				this.hideMenu(); 
				if (window.addKeyListeners){
					window.addKeyListeners();
					}
				if (v.autoHideFood){
				i.showFood = true};
            },
            'onSpectate': function() {
                this.onJoin();
				this.sendPlayerJoin(); 
				this.hideMenu(); 
				if (window.addKeyListeners){
					window.addKeyListeners();
				}					
				if (v.autoHideFood) {
					i.showFood = false;
				}
            },
            'join': function() {
                this.setParty();
				this.setPlayerSettings();
				this.sendPartyData();
				this.sendPlayerDeath();
            },
            'onJoin': function() {
                if (this.setParty(), this.isSocketOpen()) this.join();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t.join(); 
						t.sendPlayerJoin();
                    }, 1000);
                }
            },
            'create': function() {
                if (this.setParty(), this.partyToken) this.onJoin();
                else {
                    var t = this;
                    setTimeout(function() {
                        t.create();
                    }, 100);
                }
            },
            'onCreate': function() {
                this.setParty(), ':party' === this.gameMode && this.partyToken ? this.gameServerReconnect() : this.createParty(), this.create();
            },
            'onPlayerSpawn': function() {
                if (i.play = true, i.playerColor) return this['sendPlayerSpawn'](), void this['cacheCustomSkin'](ogarcopythelb.nick, i.playerColor, ogarcopythelb.skinURL);
                var t = this;
                setTimeout(function() {
                    t.onPlayerSpawn();
                }, 100);
                if (window.spawnspecialeffects == true) {
                    setTimeout(function() {
                        ///////// trigger special effects
						//console.log('Special effects stage 1');
                        i.spawnX = i.playerX;
                        i.spawnY= i.playerY;
                        M.drawCommander = true;
                    }, 110);
                }
				LegendModSpawn();
            },
            'onPlayerDeath': function() {
				//
				pauseVideos();
                i.play = false;
				i.playerColor = null;
				i.foodIsHidden = false;
				i.playerMass = 0;
				i.playerScore = 0;
				i.playerSplitCells = 0;
				this.showMenu(300);
				this.sendPlayerDeath();
				this['updateDeathLocations'](i.playerX, i.playerY);
				this['unlockButtons'](), ogarcommando1(), this['autoResp']();
            },
            'setPlayerSettings': function() {
                var t = $('#nick').val(),
                    e = $('#clantag').val(),
                    o = $('#skin').val(),
                    a = $('#color').val();
                ogarcopythelb.nick = t, 
				ogarcopythelb.clanTag = e.trim(), 
				ogarcopythelb.skinURL = this['checkSkinURL'](o.trim()), 
				7 == a.length && (ogarcopythelb.color = a), 
				ogarcopythelb.clanTag.length > 0 && (i.clanTag = ogarcopythelb.clanTag), 
				ogario1PlayerProfiles[this['selectedProfile']].nick = ogarcopythelb.nick, 
				ogario1PlayerProfiles[this['selectedProfile']].clanTag = ogarcopythelb.clanTag, 
				ogario1PlayerProfiles[this['selectedProfile']].skinURL = ogarcopythelb.skinURL, 
				ogario1PlayerProfiles[this['selectedProfile']].color = ogarcopythelb.color, 
				this.saveSettings(ogario1PlayerProfiles, 'ogarioPlayerProfiles');
            },
            'loadSkin': function(t, e) {
                var i = this;
				//console.log ("t:" + t + "e:" + e);
				if (e.includes(".mp4") || e.includes(".webm") || e.includes(".ogv")){
					t[e] = new Video();
					//console.log("stage 2 videos");
				}
				else{
					t[e] = new Image();
				}
				t[e].crossOrigin = 'anonymous'; 
				t[e]['onload'] = function() {
                    this.complete &&
					this.width &&
					this.height && 
					this.width <= 2000 &&
					this.height <= 2000 &&
					(i['cacheQueue'].push(e), 
					1 == i['cacheQueue'].length &&
					i['cacheSkin'](i.customSkinsCache));
                }, t[e].src = e;
            },
            'cacheSkin': function(t) {
                //console.log(t);  //////// return the image src
                if (0 != this["cacheQueue"].length) {
                    var e = this["cacheQueue"].shift();
                    if (e) {
                        var i = document.createElement("canvas");
                        i.width = 512;
                        i.height = 512;
                        var $ = i.getContext("2d");
                        $.beginPath();
                        $.arc(256, 256, 256, 0, 2 * Math.PI, false);
                        $["clip"]();
						try {
                        $.drawImage(this["customSkinsCache"][e], 0, 0, 512, 512);
						} catch (e) {}
                        this["customSkinsCache"][e + "_cached"] = new Image;
                        this["customSkinsCache"][e + "_cached"].src = i.toDataURL();
                        i = null;
                        this["cacheSkin"](this["customSkinsCache"]);
                    }
                }
            },
            'getCachedSkin': function(t, e) {
                return t[e + '_cached'] && t[e + '_cached'].complete && t[e + '_cached'].width ? t[e + '_cached'] : null;
            },
            'cacheCustomSkin': function(t, e, i) {
                if (i) {
                    var s = ':party' === this.gameMode ? t + e : t;
					//console.log("t= " + t);
					//console.log("e= " + e);
                    if (s && (this.customSkinsMap[s] = i), this.customSkinsCache.hasOwnProperty(i)) return;
                    this.loadSkin(this.customSkinsCache, i);
                }
            },
            'checkSkinsMap': function(t, e) {
                var i = ':party' === this.gameMode ? t + e : t;
                //console.log(.customSkinsMap.hasOwnProperty(i));
                return !!this.customSkinsMap.hasOwnProperty(i);
            },
            'getCustomSkin': function(t, e) {
                if (!this.checkSkinsMap(t, e)) return null;
                var i = ':party' === this.gameMode ? t + e : t;
                return this['getCachedSkin'](this.customSkinsCache, this.customSkinsMap[i]);
            },	
            'calculateMapSector': function(t, e, s = false) {
                if (!i.mapOffsetFixed) return '';
                var o = s ? i.mapOffsetX+ i.mapOffset : i.mapOffset,
                    a = s ? i.mapOffsetY + i.mapOffset : i.mapOffset,
                    n = Math.floor((e + a) / (i.mapSize / g.sectorsY)),
                    r = Math.floor((t + o) / (i.mapSize / g.sectorsX));
					window.calculateMapSector = n < 0 ? 0 : n >= g.sectorsY ? g.sectorsY - 1 : n, r = r < 0 ? 0 : r >= g.sectorsX ? g.sectorsX - 1 : r, String.fromCharCode(n + 65) + (r + 1);
                return n = n < 0 ? 0 : n >= g.sectorsY ? g.sectorsY - 1 : n, r = r < 0 ? 0 : r >= g.sectorsX ? g.sectorsX - 1 : r, String.fromCharCode(n + 65) + (r + 1);
            },
            'shortMassFormat': function(t) {
                return t < 1000 ? t : Math.round(t / 100) / 10 + 'k';
            },
            'updateDeathLocations': function(t, e) {
                if (i.mapOffsetFixed) {
                    this.deathLocations.push({
                        "x": t + i.mapOffsetX,
                        "y": e + i.mapOffsetY
                    });
                    if (6 == this.deathLocations.length) {
                        this.deathLocations.shift();
                    }
                    this.lastDeath = this.deathLocations.length - 1;
                }
            },
            'drawMiniMap': function() {
                if (i.mapOffsetFixed) {
                    var t = g.miniMapWidth;
                    var e = g.miniMapTop;
                    var s = t + e;
                    var o = t - 18;
                    var a = e + 9.5;
                    if (this.miniMap) {
                        this.miniMapCtx.clearRect(0, 0, t, s);
                    } else {
                        this.miniMap = document.getElementById("minimap");
                        this.miniMapCtx = this.miniMap.getContext("2d");
                        this.miniMapCtx.ogarioCtx = true;
                        this.miniMap.width = t;
                        this.miniMap.height = s;
                    }
                    if (this.miniMap.width != t) {
                        this.miniMap.width = t;
                        this.miniMap.height = s;
                    }
                    var n = o / i.mapSize;
                    var r = i.mapOffsetX + i.mapOffset;
                    var l = i.mapOffsetY + i.mapOffset;
                    if (this.drawSelectedCell(this.miniMapCtx), 
					this.currentSector = this.calculateMapSector(i.playerX, i.playerY, true), 
					this.miniMapCtx.globalAlpha = 1,
					this.miniMapCtx.font = g.miniMapFontWeight + " " + (e - 4) + "px " + g.miniMapFontFamily,
					this.miniMapCtx.fillStyle = g.miniMapSectorColor,
					this.miniMapCtx.fillText(this.currentSector, 10, e),
					this.miniMapSectors || this.drawMiniMapSectors(g.sectorsX, g.sectorsY, o, s, a),
					this.miniMapCtx.save(),
                        this.miniMapCtx.translate(9.5, a), ":battleroyale" === this.gameMode && ogarfooddrawer && ogarfooddrawer.drawBattleAreaOnMinimap(this.miniMapCtx, o, o, n, r, l), v.showMiniMapGhostCells) {
                        var h = i.ghostCells;
                        this.miniMapCtx.beginPath();
                        var c = 0;
                        for (; c < h.length; c++) {
                            if (!h[c].inView) {
                                var u = ~~((h[c].x + r) * n);
                                var d = ~~((h[c].y + l) * n);
                                this.miniMapCtx.moveTo(u, d);
                                this.miniMapCtx.arc(u, d, ~~(h[c].size * n), 0, this.pi2, false);
                            }
                        }
                        this.miniMapCtx.fillStyle = g.miniMapGhostCellsColor;
                        this.miniMapCtx.globalAlpha = g.miniMapGhostCellsAlpha;
                        this.miniMapCtx.shadowColor = g.miniMapGhostCellsColor;
                        this.miniMapCtx.shadowBlur = 10;
                        this.miniMapCtx.shadowOffsetX = 0;
                        this.miniMapCtx.shadowOffsetY = 0;
                        this.miniMapCtx.fill();
                        this.miniMapCtx.globalAlpha = 1;
                        this.miniMapCtx.shadowBlur = 0;
                    }																
                    if (v.showMiniMapGuides) {
                        u = Math.round((i.playerX + r) * n);
                        d = Math.round((i.playerY + l) * n);
                        this.miniMapCtx.lineWidth = 1;
                        this.miniMapCtx.strokeStyle = g.miniMapGuidesColor;
                        this.miniMapCtx.beginPath();
                        this.miniMapCtx.moveTo(u, 0);
                        this.miniMapCtx.lineTo(u, o - 1);
                        this.miniMapCtx.moveTo(0, d);
                        this.miniMapCtx.lineTo(o - 1, d);
                        this.miniMapCtx.stroke();						
                    }
                    if (v.showExtraMiniMapGuides) {
                        u = Math.round((i.playerX + r) * n);
                        d = Math.round((i.playerY + l) * n);
						
						//draw the yellow on minimap
						this.miniMapCtx.beginPath();
						this.miniMapCtx.lineWidth = "1";
						this.miniMapCtx.strokeStyle = "yellow";		
						var miniax = legendmod.canvasWidth / (legendmod.mapMaxX - legendmod.mapMinX) / legendmod.viewScale; //CORRECT
						var miniay = legendmod.canvasHeight / (legendmod.mapMaxY - legendmod.mapMinY) / legendmod.viewScale; //CORRECT
						var minidaxx = legendmod3.miniMapSectors.width*miniax;
						var minidayy = legendmod3.miniMapSectors.width*miniay;		
					
						var fixminidaxx = u-(minidaxx/2);
						var fixminidayy = d-(minidayy/2);						
						
						//if (fixminidaxx<0){ fixminidaxx=0; }
						//if (fixminidayy<0){ fixminidayy=0; }	
						this.miniMapCtx.rect(fixminidaxx, fixminidayy, minidaxx, minidayy);						
						this.miniMapCtx.stroke();	
						
                    }					
                    if (this.miniMapCtx.beginPath(), this.miniMapCtx.arc((i.playerX + r) * n, (i.playerY + l) * n, g.miniMapMyCellSize, 0, this.pi2, false), this.miniMapCtx.closePath(), g["miniMapMyCellStrokeSize"] > 0 && (this.miniMapCtx.lineWidth = g["miniMapMyCellStrokeSize"], this.miniMapCtx.strokeStyle = g["miniMapMyCellStrokeColor"], this.miniMapCtx.stroke()), this.miniMapCtx.fillStyle = g["miniMapMyCellColor"], this.miniMapCtx.fill(), this.teamPlayers.length) {
                        c = 0;
                        for (; c < this.teamPlayers.length; c++) {
                            this.teamPlayers[c].drawPosition(this.miniMapCtx, i.mapOffset, n, this.privateMiniMap, this.targetID, legendmod3.teamPlayers[c].color);
                        }
                    }
                    if (this.deathLocations.length > 0) {
                        u = Math.round((this.deathLocations[this.lastDeath].x + i.mapOffset) * n);
                        d = Math.round((this.deathLocations[this.lastDeath].y + i.mapOffset) * n);
                        var f = Math.max(g.miniMapMyCellSize - 2, 4);
                        this.miniMapCtx.lineWidth = 1;
                        this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? g.miniMapDeathLocationColor : "#FFFFFF";
                        this.miniMapCtx.beginPath();
                        this.miniMapCtx.moveTo(u - f, d);
                        this.miniMapCtx.lineTo(u + f, d);
                        this.miniMapCtx.moveTo(u, d - f);
                        this.miniMapCtx.lineTo(u, d + f);
                        this.miniMapCtx.stroke();
                    }
                    this.miniMapCtx.restore();
                }
            },
            'drawMiniMapSectors': function(t, e, s, o, a) {
                this.miniMapSectors = document.getElementById('minimap-sectors');
                var n = this.miniMapSectors.getContext('2d');
                n.ogarioCtx = true; 
				this.miniMapSectors.width = s; 
				this.miniMapSectors.height = o; 
				n.fillStyle = '#FFFFFF'; 
				this.dTok(n, s - 1);
				ogarfooddrawer.drawSectors(n, i.mapOffsetFixed, t, e, 0.5, a, s - 0.5, o - 9.5, g['miniMapSectorsColor'], g['miniMapSectorsColor'], 1, false);
            },
            'resetMiniMapSectors': function() {
                this.miniMapSectors = null;
            },
            'drawSelectedCell': function(t) {
                i.play && i.playerSplitCells > 1 && (v['splitRange'] || v['oppColors'] || v['oppRings'] || v['showStatsSTE']) && (t.fillStyle = '#FFFFFF', t.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3, t.beginPath(), t.arc(0x30, 15, 6, 0, this.pi2, false), t.closePath(), t.fill(), t.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6, t.beginPath(), t.arc(0x3c, 15, 4, 0, this.pi2, false), t.closePath(), t.fill());
            },
            'dTok': function(t, e) {
                t.font = g.miniMapFontWeight + ' ' + (g.miniMapTop - 6) + 'px ' + g.miniMapFontFamily, t.textAlign = 'right', t.textBaseline = 'top', t.fillText(atob(this['token']), e, 7);
            },
/*            'drawTeammatesInd': function(t, e, i, s) {
                this.indicator && t.drawImage(this.indicator, e - 45, i - s - 90);
            }, */
            'drawCellInfo': function(t, e, s, o, a, n, r, l, h, c, u, d) {
                //if (!n && !h && (t.globalAlpha = i.globalAlpha, v.teammatesInd && d && !l && a <= 200 && this.drawTeammatesInd(t, s, o, a), !v.noNames || v.showMass)) {
				if (!n && !h && (t.globalAlpha = i.globalAlpha, v.teammatesInd && d && !l && a <= 200 && ogarfooddrawer.drawTeammatesInd(t, s, o, a), !v.noNames || v.showMass)) {
                    var f = false;
                    if (l || r || !(f = this.setAutoHideCellInfo(a)) || !v.autoHideNames || !v.autoHideMass) {
                        var m = null;
                        if (!this.cells.hasOwnProperty(e)) return (m = new ogarbasicassembly(s, o, r, l, v.shortMass, v.virMassShots)).setMass(a), m.setNick(c), void(this.cells[e] = m);
                        (m = this.cells[e]).update(s, o, a, r, l, c), m.setDrawing(v.optimizedNames, v.optimizedMass, v.shortMass, v.virMassShots, v.namesStroke, v.massStroke), m.setDrawingScale(i.viewScale, g.namesScale, g.massScale, g.virMassScale, g.strokeScale), 
						t.globalAlpha = g.textAlpha, v.noNames || f && v.autoHideNames || l && v.hideMyName || d && v.hideTeammatesNames || m.drawNick(t, g.namesColor, g.namesFontFamily, g.namesFontWeight, g.namesStrokeColor), 
						!v.showMass || f && v.autoHideMass || l && v.hideMyMass || v.hideEnemiesMass && !l && !r || m.drawMass(t, g.massColor, g.massFontFamily, g.massFontWeight, g.massStrokeColor);
                    }
                }
            },
            'setVirusColor': function(t) {
                return Math.floor(t * t / 100) > 183 ? '#C80000' : g.virusColor;
            },
            'setVirusStrokeColor': function(t) {
                return i.play && 0 != i.playerMaxMass ? Math.floor(t * t / 100) / (this.selectBiggestCell ? i.playerMaxMass : i.playerMinMass) > 0.76 ? '#FFDC00' : '#C80000' : g.virusStrokeColor;
            },
            'setAutoHideCellInfo': function(t) {
                return t <= 40 || i.viewScale < 0.5 && t < 550 && t < 25 / i.viewScale;
            },
            'setParty': function() {
                var t = $('#party-token').val();
                if (this.gameMode = i.gameMode = $('#gamemode').val(), this.setQuest(), ':party' === this.gameMode && t) {
                    var e = t; - 1 != t.indexOf('#') && (e = (t = t.split('#'))[1]), this.partyToken !== e && (this.partyToken = e, this.flushSkinsMap(), this.flushChatData(), this.cancelTargeting());
                }
            },
            'createParty': function() {
                $('#create-party-btn').click();
            },
            'joinParty': function() {
                var t = $('#party-token').val();
                t && ($('#pre-join-party-btn').click(), $('.party-token').val(t), $('#join-party-btn').click());
            },
            'leaveParty': function() {
                $('#party-token, .party-token').val(''); 
				$('#leave-party-btn').click();
            },
            'closeParty': function() {
                $('#party-token, .party-token').val(''); 
				$('.party-icon-back').click();
            },
            'flushData': function() {
                this.flushPartyData(); 
				this.flushSkinsMap(); 
				this.flushChatData(); 
				this.cancelTargeting(); 
				i.play = false; 
				i.playerColor = null;
            },
            'flushPartyData': function() {
                this.teamPlayers = [];
				this.parties = []; 
				this.lastSentNick = ''; 
				this.lastSentClanTag = null; 
				this.lastSentSkinURL = ''; 
				this.lastSentCustomColor = ''; 
				this.lastSentPartyToken = ''; 
				this.lastSentServerToken = '';
            },
            'flushCells': function() {
                this.cells = {};
            },
            'flushSkinsMap': function() {
                this.customSkinsMap = {};
            },
            'flushChatData': function() {
                this.chatUsers = {};
            },
            'getWS': function(t) {
                t && (this.ws = t, this.createServerToken(), this.updateServerInfo(), -1 == this.ws.indexOf('agar.io') && this.closeConnection());
            },
            'recreateWS': function(t) {
                if (!t) return null;
                var e = null;
                if (/^[a-zA-Z0-9=+\/]{12,}$/.test(t)) {
                    var i = atob(t);
                    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/.test(i) && (e = 'wss://ip-' + i.replace(/\./g, '-').replace(':', '.tech.agar.io:'));
                }
                return !e && /^[a-z0-9]{5,}$/.test(t) && (e = 'wss://live-arena-' + t + '.agar.io:443'), e;
            },
            'createServerToken': function() {
                var t = this.ws.match(/ip-\d+/),
                    i = this.ws.match(/live-arena-([\w\d]+)/),
                    s = null;
                t && ((t = this.ws.replace('.tech.agar.io', '').replace(/-/g, '.').match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this.serverIP = t[0], s = btoa(this.serverIP)));
                if (!s && i && (this['serverArena'] = i[1], s = this['serverArena']), s) {
                    this.serverToken !== s && (this.serverToken = s, this.flushData(), this.flushCells()), this.partyToken = '';
                    var o = this.ws.match(/party_id=([A-Z0-9]{6})/);
                    o && (this.partyToken = o[1], ogarjoiner('/#' + window.encodeURIComponent(this.partyToken)));
                }
            },
            'updateServerInfo': function() {
                $('#server-ws').val(this.ws), $('#server-token').val(this.serverToken), $('#party-token, .party-token').val(this.partyToken);
            },
            'gameServerConnect': function(t) {
                t && (this.skipServerData = true, window.core && window.core.connect && window.core.connect(t));
            },
            'gameServerReconnect': function() {
                window.MC && window.MC.reconnect ? window.MC.reconnect() : window.master && window.master.reconnect && window.master.reconnect();
            },
            'gameServerJoin': function(t) {
                var e = this.recreateWS(t);
                e && (this.skipServerData = true, this['gameServerConnect'](e));
            },
            'connect': function() {
                pauseVideos(), 
				this.closeConnection();
				this.flushData() ; 
				this.setParty(); 
				console.log('[Legend mod Express] Connecting to server'), 
				this['privateMode'] && this['privateIP'] ? this.socket = new WebSocket(this['privateIP']) : this.socket = new WebSocket(this['publicIP']), 
				this.socket['ogarioWS'] = true, 
				this.socket['binaryType'] = 'arraybuffer';
                var t = this;
                this.socket['onopen'] = function() {
                    console.log('[Legend mod Express] Socket open');
                    var e = t.createView(3);
                    e.setUint8(0, 0);
					e.setUint16(1, 401, true);
					t['sendBuffer'](e);
					t.sendPartyData();
                }
				this.socket['onmessage'] = function(e) {
                    t['handleMessage'](e);
                }
				this.socket['onclose'] = function(e) {
                    //t.flushData();
					console.log('[Legend mod Express] Socket close', e);
                }
				this.socket['onerror'] = function(e) {
                    //t.flushData();
					console.log('[Legend mod Express] Socket error', e);
                };
            },
            'closeConnection': function() {
                if (this.socket) {
                    this.socket['onmessage'] = null;
                    try {
                        this.socket['close']();
                    } catch (ogarcloseconlabel) {}
                    this.socket = null;
                }
            },
            'reconnect': function() {
                this.setParty();
                var t = this;
                setTimeout(function() {
                    t.connect();
                }, 1000);
            },
            'switchServerMode': function() {
                if (this["privateIP"]) {
                    this["privateMode"] = !this["privateMode"];
                    if (this.isSocketOpen()) {
                        this["closeConnection"]();
                        toastr["error"]("Zamkni\u0119to po\u0142\u0105czenie z serwerem!");
                    }
                    if (this["privateMode"]) {
                        toastr["info"]("Prze\u0142\u0105czono na serwer prywatny!");
                        $(".party-panel").show();
                    } else {
                        toastr["info"]("Prze\u0142\u0105czono na serwer publiczny!");
                        $("#active-parties")["empty"]();
                        $(".party-panel").hide();
                    }
                    this.onJoin();
                    if (i.play) {
                        this["onPlayerSpawn"]();
                    }
                }
            },
            'isSocketOpen': function() {
                return null !== this.socket && this.socket['readyState'] === this.socket['OPEN'];
            },
            "writeUint32": function(data, value) {
                for (; !![];) {
                    if ((value & -128) == 0) {
                        data.push(value);
                        return;
                    } else {
                        data.push(value & 127 | 128);
                        value = value >>> 7;
                    }
                }
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'strToBuff': function(t, e) {
                var i = this.createView(1 + 2 * e.length);
                i.setUint8(0, t);
                for (var s = 0; s < e.length; s++) i.setUint16(1 + 2 * s, e.charCodeAt(s), true);
                return i;
            },
            'sendBuffer': function(t) {
                this.socket['send'](t['buffer']);
            },
            'handleMessage': function(t) {
                this['readMessage'](new DataView(t['data']));
            },
            'readMessage': function(t) {
                switch (t.getUint8(0)) {
                    case 0:
                        this.playerID = t.getUint32(1, true);
                        break;
                    case 1:
                        this['sendPlayerUpdate']();
                        break;
                    case 20:
                        this['updateTeamPlayer'](t);
                        break;
                    case 30:
                        this['updateTeamPlayerPosition'](t);
                        break;
                    case 96:
                        break;
                    case 100:
                        this['readChatMessage'](t);
                }
            },
            'sendPlayerState': function(t) {
                if (this.isSocketOpen()) {
                    var e = this.createView(1);
                    e.setUint8(0, t), this['sendBuffer'](e);
                }
            },
            'sendPlayerSpawn': function() {
                this['sendPlayerState'](1);
            },
            'sendPlayerDeath': function() {
                this['sendPlayerState'](2);
            },
            'sendPlayerJoin': function() {
                this['sendPlayerState'](3);
            },
            'sendPlayerData': function(t, e, i) {
                null !== this[e] && this[e] === i || this.isSocketOpen() && (this['sendBuffer'](this['strToBuff'](t, i)), this[e] = i);
            },
            'sendPlayerNick': function() {
                this['sendPlayerData'](10, 'lastSentNick', ogarcopythelb.nick);
            },
            'sendPlayerClanTag': function() {
                this['sendPlayerData'](11, 'lastSentClanTag', ogarcopythelb.clanTag);
            },
            'sendPlayerSkinURL': function() {
                this['sendPlayerData'](12, 'lastSentSkinURL', ogarcopythelb.skinURL);
            },
            'sendPlayerCustomColor': function() {
                this['sendPlayerData'](13, 'lastSentCustomColor', ogarcopythelb.color);
            },
            'sendPlayerColor': function() {
                this.isSocketOpen() && i.playerColor && this['sendBuffer'](this['strToBuff'](14, i.playerColor));
            },
            'sendPartyToken': function() {
                this.setParty(), this['sendPlayerData'](15, 'lastSentPartyToken', this.partyToken);
            },
            'sendServerToken': function() {
                this['sendPlayerData'](16, 'lastSentServerToken', this.serverToken);
            },
            'sendServerJoin': function() {
                this.sendServerToken(); 
				this.sendPlayerJoin();
            },
            'sendServerRegion': function() {
                if (this.region) {
                    var t = this.region.split('-');
                    if (this.isSocketOpen())
					{
						this['sendBuffer'](this['strToBuff'](17, t[0]));
					}
                }
            },
            'sendServerGameMode': function() {
                var t = 'FFA';
                switch (this.gameMode) {
                    case ':battleroyale':
                        t = 'BTR';
                        break;
                    case ':teams':
                        t = 'TMS';
                        break;
                    case ':experimental':
                        t = 'EXP';
                        break;
                    case ':party':
                        t = 'PTY';
                }
                this.isSocketOpen() && this['sendBuffer'](this['strToBuff'](18, t));
            },
            'sendServerData': function() {
                this.skipServerData ? this.skipServerData = false : (this.region = $('#region').val(), this.gameMode = $('#gamemode').val(), this.sendServerRegion(), this.sendServerGameMode());
            },
            'sendPartyData': function() {
                this.sendPlayerClanTag(), this.sendPartyToken(), this.sendServerToken(), this.sendPlayerNick();
            },
            'sendPlayerUpdate': function() {
                if (this.isSocketOpen() && i.play && this.playerID && i.playerColor) {
                    function t(t) {
                        for (var e = 0; e < t.length; e++) s.setUint16(o, t.charCodeAt(e), true), o += 2;
                        s.setUint16(o, 0, true), o += 2;
                    }
                    var e = 41;
                    e += 2 * ogarcopythelb.nick.length, e += 2 * ogarcopythelb.skinURL.length;
                    var s = this.createView(e);
                    s.setUint8(0, 20), s.setUint32(1, this.playerID, true);
                    var o = 5;
                    t(ogarcopythelb.nick), t(ogarcopythelb.skinURL), t(ogarcopythelb.color), t(i.playerColor), this['sendBuffer'](s);
                }
            },
            'sendPlayerPosition': function() {
                if (this.isSocketOpen() && i.play && this.playerID) {
                    var t = this.createView(17);
                    t.setUint8(0, 30);
                    t.setUint32(1, this.playerID, true);
                    t.setInt32(5, this.getPlayerX(), true);
                    t.setInt32(9, this.getPlayerY(), true);
                    if (void 0 !== i.playerMass) {
                        t.setUint32(13, i.playerMass, true);
                    } else {
                        t.setUint32(13, this.playerMass, true);
                    }
                    this["sendBuffer"](t);
                }
            },
            'checkPlayerID': function(t) {
                if (t)
                    for (var e = 0; e < this.teamPlayers.length; e++)
                        if (this.teamPlayers[e].id == t) return e;
                return null;
            },
            'checkPlayerChat': function(t) {
                if (t)
                    for (var e = 0; e < this.teamPlayers.length; e++)
                        if (this.teamPlayers[e].id == t) return e;
                return null;
            },			
            'updateTeamPlayer': function(t) {
                function e() {
                    var paginationStr = "";
                    for (;;) {
                        var i = t.getUint16(s, true);
                        if (0 == i) {
                            break;
                        }
                        paginationStr = paginationStr + String.fromCharCode(i);
                        s = s + 2;
                    }
                    return s = s + 2, paginationStr;
                }
                var i = t.getUint32(1, true);
                var s = 5;
                var o = e();
                var a = this.checkSkinURL(e());
                var n = e();
                var r = e();
                var l = ":party" === this.gameMode ? o + r : o;
                var h = this.checkPlayerID(i);
                if (null !== h) {
                    this.teamPlayers[h].nick = o;
                    this.teamPlayers[h].skinID = l;
                    this.teamPlayers[h].skinURL = a;
                    this.teamPlayers[h].setColor(r, n);
                } else {
                    var c = new function(envId, cb, i, s) {
                        this.id = envId;
                        this.nick = cb;
                        this.skinID = i;
                        this.skinURL = s;
                        this.x = 0;
                        this.y = 0;
                        this.lastX = 0;
                        this.lastY= 0;
                        this.mass = 0;
                        this.clanTag = "";
                        this.color = null;
                        this.customColor = g["miniMapTeammatesColor"];
                        this.alive = false;
                        this.updateTime = null;
                        this.pi2 = 2 * Math.PI;
                        this.setColor = function(i, inRevIdx) {
                            this.color = i;
                            if (7 == inRevIdx.length) {
                                this.customColor = inRevIdx;
                            }
                        };
                        this.drawPosition = function(options, margin, mult, startcode, endcode, value) {
                            if (!(!this.alive || startcode && endcode && this.id != endcode)) {
                                this.lastX = (29 * this.lastX + this.x) / 30;
                                this.lastY= (29 * this.lastY+ this.y) / 30;
                                var w = (this.lastX + margin) * mult;
                                var h = (this.lastY+ margin) * mult;
                                if (this.nick.length > 0) {
                                    options.font = g["miniMapNickFontWeight"] + " " + g["miniMapNickSize"] + "px " + g["miniMapNickFontFamily"];
                                    options.textAlign = "center";
                                    if (g["miniMapNickStrokeSize"] > 0) {
                                        options.lineWidth = g["miniMapNickStrokeSize"];
                                        options.strokeStyle = g["miniMapNickStrokeColor"];
                                        options.strokeText(this.nick, w, h - (2 * g["miniMapTeammatesSize"] + 2));
                                    }
                                    options.fillStyle = g["miniMapNickColor"];
                                    options.fillText(this.nick, w, h - (2 * g["miniMapTeammatesSize"] + 2));
                                }
                                options.beginPath();
                                options.arc(w, h, g["miniMapTeammatesSize"], 0, this.pi2, false);
                                options.closePath();
                                if (v["oneColoredTeammates"]) {
                                    options.fillStyle = g["miniMapTeammatesColor"];
                                } else {
                                    options.fillStyle = value;
                                }
                                options.fill();
                            }
                        };
                    }(i, o, l, a);
                    c.setColor(r, n);
                    this.teamPlayers.push(c);
                }
                this.cacheCustomSkin(o, r, a);
            },
            'updateTeamPlayerPosition': function(t) {
                var e = t.getUint32(1, true),
                    i = this.checkPlayerID(e);
                if (null !== i) {
                    var s = t.getInt32(5, true),
                        o = t.getInt32(9, true),
                        a = t.getUint32(13, true);
                    if (a > 360000) return;
                    var n = this.teamPlayers[i];
                    n.x = s, n.y = o, n.mass = a, n.alive = true, n['updateTime'] = Date.now(), this.targeting && this.targetID && e == this.targetID && this.updateTarget(n.nick, n.skinURL, s, o, a, n.color);
                }
            },
            'updateTeamPlayers': function() {
                this.sendPlayerPosition(), this.chatUsers = {}, this.top5 = [];
                var t = 0;
                for (; t < this.teamPlayers.length; t++) {
                    var e = this.teamPlayers[t];
                    if (e.alive && Date.now() - e.updateTime >= 2000 || 0 == e.mass) {
                        e.alive = false;
                        if (this.targeting && this.targetID && e.id == this.targetID) {
                            this.setTargetStatus(2);
                        }
                    }
                    if (e.alive) {
                        this.top5.push({
                            "id": e.id,
                            "nick": e.nick,
                            "x": e.x,
                            "y": e.y,
                            "mass": e.mass,
                            "color": e.color,
                            "skin": e.skinURL
                        });
                        if (!this.isChatUserMuted(e.id)) {
                            this.addChatUser(e.id, e.nick);
                        }
                    }
                }
                this.top5["sort"](function(row, conf) {
                    return conf.mass - row.mass;
                }), this.displayTop5();

            },
            'updateParties': function(t) {
                this.parties = [];
                for (var e = t.getUint8(1), i = 2, s = 0; s < e; s++) {
                    for (var o = '';;) {
                        var a = t.getUint16(i, true);
                        if (0 == a) break;
                        o += String.fromCharCode(a), i += 2;
                    }
                    i += 2, this.parties.push(o);
                }
            },
            'readChatMessage': function(t) {
                if (!v['disableChat']) {
                    var e = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1'),
                        i = t.getUint8(1),
                        s = t.getUint32(2, true),
                        o = t.getUint32(6, true);
                    if (!(this['isChatUserMuted'](s) || 0 != o && o != this.playerID && s != this.playerID)) {
                        for (var a = '', n = 10; n < t.byteLength; n += 2) {
                            var r = t.getUint16(n, true);
                            if (0 == r) break;
                            a += String.fromCharCode(r);
                        }
                        this.displayChatMessage(e, i, s, a);
                    }
                }
            },
            'sendChatMessage': function(t, e) {
                //console.log(t);console.log(e);
                if (!(Date.now() - this.lastMessageSentTime < 500 || 0 == e.length || 0 == ogarcopythelb.nick.length) && this.isSocketOpen()) {
                    e = ogarcopythelb.nick + ': ' + e;
                    var i = this.createView(10 + 2 * e.length);
                    i.setUint8(0, 100), i.setUint8(1, t), i.setUint32(2, this.playerID, true), i.setUint32(6, 0, true);
                    for (var s = 0; s < e.length; s++) i.setUint16(10 + 2 * s, e.charCodeAt(s), true);
                    this['sendBuffer'](i), this.lastMessageSentTime = Date.now();
                }
            },
            'prepareCommand': function(t) {
                return t.replace('%currentSector%', this.currentSector);
            },
            'sendCommand': function(t) {
                var e = this['prepareCommand'](c['comm' + t]);
                this['sendChatMessage'](102, e);
            },
            'addChatUser': function(t, e) {
                this.chatUsers[t] = e;
            },
            'getChatUserNick': function(t) {
                return this.chatUsers.hasOwnProperty(t) ? this.chatUsers[t] : '';
            },
            'muteChatUser': function(t) {
                if (t && !this['isChatUserMuted'](t)) {
                    var e = this['getChatUserNick'](t);
                    this.chatMutedUsers[t] = e, this.chatMutedUserIDs.push(t), toastr['error'](h['userMuted'].replace('%user%', '<strong>' + this.escapeHTML(e) + '</strong>') + ' <button data-user-id=\"' + t + '\" class=\"btn btn-xs btn-green btn-unmute-user\">' + h['unmute'] + '</button>');
                }
            },
            'unmuteChatUser': function(t) {
                if (t) {
                    var e = this.chatMutedUserIDs.indexOf(t);
                    if (-1 != e) {
                        this.chatMutedUserIDs.splice(e, 1);
                        toastr["info"](h["userUnmuted"].replace("%user%", "<strong>" + this.escapeHTML(this.chatMutedUser[t]) + "</strong>"));
                        delete this.chatMutedUser[t];
                    }
                }
            },
            'isChatUserMuted': function(t) {
                return -1 != this.chatMutedUserIDs.indexOf(t);
            },
            'parseMessage': function(t) {
                var e = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
                if (e.test(t)) return v.showChatImages ? '<img src=\"' + t.match(e)[1].replace('http:', 'https:') + '\" style=\"width:100%;border:none;\">' : '';
                var i = /\[yt\]([\w-]{11})\[\/yt\]/i;
                if (i.test(t)) return v.showChatVideos ? '<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/' + t.match(i)[1] + '?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />' : '';
                var s = this.escapeHTML(t);
                return v['chatEmoticons'] && (s = this.parseEmoticons(s)), s;
            },
            'parseEmoticons': function(t) {
                /*return String(t).replace(/\&lt\;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(t) {
                    return '<img src=\"https://jimboy3100.github.io/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });*/
                return String(t).replace(/\&lt\;3/g, '<3').replace(/℄/g, '℄ Legend Clan').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\)|\(angry\)|\(clown\)|\(crazy\)|\(devil\)|\(devil2\)|\(fb\)|\(google\)|\(ghost\)|\(heel\)|\(kiss\)|\(lipstick\)|\(rage\)|\(teacher\)|\(together\)|\(toothy\)|\(evil\)|\(baby\)|\(wow\))/g, function(t) {
                    console.log(d[t]);
                    return '<img src=\"https://jimboy3100.github.io/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });

            },
            'displayChatMessage': function(t, e, i, o) {
                if (0 != o.length) {
                    var a = o.split(': ', 1).toString(),
                        n = this['parseMessage'](o.replace(a + ': ', ''));
                    if (!(0 == a.length || a.length > 15 || 0 == n.length)) {
                        var r = '';
                        if (0 != i && i != this.playerID && (this.addChatUser(i, a), r = '<a href=\"#\" data-user-id=\"' + i + '\" class=\"mute-user ogicon-user-minus\"></a> '), a = this.escapeHTML(a), 101 == e) {
                            if (v.showChatBox) return $('#chat-box').append('<div class=\"message\"><span class=\"message-time\">[' + t + '] </span>' + r + '<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span></div>'), $('#chat-box').perfectScrollbar('update'), $('#chat-box')['animate']({
                                'scrollTop': $('#chat-box').prop('scrollHeight')
                            }, 500), void(v.chatSounds && this.playSound(this.messageSound));
                            v['hideChat'] || (toastr['success']('<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span>' + r), v.chatSounds && this.playSound(this.messageSound)), this.chatHistory.push({
                                'nick': a,
                                'message': n
                            }), this.chatHistory.length > 15 && this.chatHistory.shift();
                        } else if (102 == e) {
                            if (v.showChatBox) return $('#chat-box').append('<div class=\"message command\"><span class=\"command-time\">[' + t + '] </span>' + r + '<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span></div>'), $('#chat-box').perfectScrollbar('update'), $('#chat-box')['animate']({
                                'scrollTop': $('#chat-box').prop('scrollHeight')
                            }, 500), void(v.chatSounds && this.playSound(this.commandSound));
                            v['hideChat'] || (toastr['warning']('<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span>' + r), v.chatSounds && this.playSound(this.commandSound));
                        } else $('#messages').append(o);
                    }
                }
            },
            'displayUserList': function(t, e, i, s, o) {
                var a = '';
                if (Object['keys'](t).length) {
                    for (var n in a += '<ol class=\"user-list\">', t) t.hasOwnProperty(n) && (a += '<li><strong>' + this.escapeHTML(t[n]) + '</strong> <button data-user-id=\"' + n + '\" class=\"btn btn-xs ' + i + '\">' + s + '</button></li>');
                    a += '</ol>';
                } else a += h['none'];
                toastr[o](a, e, {
                    'closeButton': true,
                    'tapToDismiss': false
                });
            },
            'displayChatActiveUsers': function() {
                this.displayUserList(this.chatUsers, h['activeUsers'], 'btn-red btn-mute-user', h['mute'], 'info');
            },
            'displayChatMutedUsers': function() {
                this.displayUserList(this.chatMutedUsers, h['mutedUsers'], 'btn-green btn-unmute-user', h['unmute'], 'error');
            },
            'preloadChatSounds': function() {
                this.setMessageSound(), this.setCommandSound(), this.setvirusSound();
            },
            'setChatSoundsBtn': function() {
                v.chatSounds ? $('.chat-sound-notifications').removeClass('ogicon-volume-mute2').addClass('ogicon-volume-high') : $('.chat-sound-notifications').removeClass('ogicon-volume-high').addClass('ogicon-volume-mute2');
            },
            'setMessageSound': function() {
                this.messageSound = this.setSound(v.messageSound);
            },
            'setCommandSound': function() {
                this.commandSound = this.setSound(v.commandSound);
            },
            'setvirusSound': function() {
                this.virusSoundurl = this.setSound(v.virusSoundurl);
            },			
            'setSound': function(t) {
                return t ? new Audio(t) : null;
            },
/*            'playSound': function(t) {
                //t && t.play && (t.pause(), t.currentTime = 0, t.play());
                //t && t.play && t.play!==null && (t.pause(), t.currentTime = 0, t.play());
                t.pause();
                t.currentTime = 0;
                var nopromise = {
                    catch: new Function()
                };
                (t.play() || nopromise).catch(function() {});
            },
*/
        'playSound': function (t) {
            if (t && t.play) {
                t.pause();
                t.currentTime = 0;
            t.play();								            				
            }
        },			
            'setTargeting': function() {
                this.targetID && (this.targeting = !this.targeting, i.targeting = this.targeting, this.setTargetingInfo());
            },
            'setTargetingInfo': function() {
                this.targeting ? ($('#set-targeting').addClass('active'), $('#target-status').show(), 2 != this.targetStatus && $('#target-summary').show()) : ($('#set-targeting').removeClass('active'), $('#target-summary, #target-status').hide());
            },
            'cancelTargeting': function() {
                this.setTargetStatus(0);
            },
            'setPrivateMiniMap': function() {
                this.targetID && (this.privateMiniMap = !this.privateMiniMap, this.privateMiniMap ? $('#set-private-minimap').addClass('active') : $('#set-private-minimap').removeClass('active'));
            },
            'setTarget': function(t) {
                var e = this.checkPlayerID(t);
                if (null !== e) {
                    var i = this.teamPlayers[e];
                    if (this.targetID = i.id, this.updateTarget(i.nick, i.skinURL, i.x, i.y, i.mass, i.color), !i.alive) return void this.setTargetStatus(2);
                    this.setTargetStatus(1);
                } else this.setTargetStatus(0);
            },
            'setTargetStatus': function(t) {
                switch (t) {
                    case 0:
                        this.targetStatus = 0, this.targetID = 0, this.targetNick = '', this.targetSkinURL = '', this.targeting = false, i.targeting = false, this.privateMiniMap = false, $('#target-skin, #target-nick, #target-summary').hide(), $("#target-hud").hide(), $('#target-status').show().text( h['targetNotSet'] ), $('#target-panel-hud a').removeClass('active'); //$('#target-status').show().text('[' + h['targetNotSet'] + ']'), $('#target-panel-hud a').removeClass('active');
                        break;
                    case 1:
                        this.targetStatus = 1, this.targeting || (this.targeting = true, i.targeting = true, $("#target-hud").show(), this.setTargetingInfo()), $('#target-skin, #target-nick, #target-status, #target-summary').show();
                        break;
                    case 2:
                        this.targetStatus = 2, $('#target-summary').hide(), $("#target-hud").show(), $('#target-status').show().text('[' + h['targetDead'] + ']'), i['resetTargetPosition']();
                }
            },
            'changeTarget': function() {
                for (var t = this.checkPlayerID(this.targetID), e = null, i = 0; i < this.teamPlayers.length; i++)
                    if (this.teamPlayers[i].alive) {
                        if (null === t) {
                            t = i;
                            break;
                        }
                        if (i < t && null === e) e = i;
                        else if (i > t) {
                            e = i;
                            break;
                        }
                    } null !== e && (t = e), null !== t ? this['setTarget'](this.teamPlayers[t].id) : this.setTargetStatus(0);
            },
            'updateTarget': function(t, e, o, a, n, r) {
                i['setTargetPosition'](o, a), this.targetNick !== t && (this.targetNick = t, $('#target-nick').html(this.escapeHTML(t))), $('#target-skin').css('background-color', r), e && this.targetSkinURL !== e && (this.customSkinsCache.hasOwnProperty(e + '_cached') ? ($('#target-skin img').attr('src', e), this.targetSkinURL = e) : $('#target-skin img').attr('src', 'https://jimboy3100.github.io/banners/static/img/blank.png')), $('#target-status').text('[' + this['shortMassFormat'](n) + ']');
                var l = this['calculateMapSector'](o, a),
                    c = h.targetDistance + ': <span class=\"hud-main-color\">' + i.targetDistance + ' [' + l + ']</span>';
                i.play && (c += ' | ' + h['targetMass'] + ': <span class=\"hud-main-color\">' + this['shortMassFormat'](n + i.playerMass) + '</span>'), $('#target-summary').html(c), 1 != this.targetStatus && this.setTargetStatus(1);
            },
            'updateQuest': function() {
                this.showQuest && ':ffa' === this.gameMode && window.MC && window.MC.getQuestProgressLabel && (this.questHUD.textContent= window.MC.getQuestProgressLabel());
            },
            'init': function() {
                this.loadSettings(), 
				this.loadProfiles(), 
				this.setLang(), 
				this.setMenu(), 
				this.setUI(), 
				y && y.setTheme(), 
				this.setShowQuickMenu(), 
				this.setShowSkinsPanel(), 
				this.setProfile(), 
				this.setMainButtons(), 
				this.setStreamMode(), 
				this.setHideSkinUrl(), 
				this.setMiniMap(), 
				this.setAutoResp(), 
				this.setDisableChat(), 
				this.setShowChatBox(), 
				this.setTop5(), 
				this.setTargetingHUD(), 
				this.setQuest(), 
				this.displayTime(), 
				this.setCenteredLb(), 
				this.setNormalLb(), 
				this.setFpsAtTop(), 
				this.displayStats(), 
				this.setBlockPopups(), 
				this.preloadChatSounds(), 
				this.setChatSoundsBtn();
                var t = this;
                setInterval(function() {
                    t.drawMiniMap();
                }, 33), 
				setInterval(function() {
                    t.updateTeamPlayers();
                }, this.updateInterval);
            }
        };

        function irenderfromagario() {
            this.txt = '',
                this.txtCanvas = null,
                this.txtCtx = null,
                this.color = '#FFFFFF',
                this.stroke = false,
                this.strokeWidth = 2,
                this.strokeColor = '#000000',
                this.font = '700 16px Ubuntu',
                this.fontFamily = 'Ubuntu',
                this.fontWeight = 700,
                this.fontSize = 16,
                this.margin = 3,
                this.scale = 1,
                this.quality = 1,
                this.measuredWidth = 0,
                this.redraw = false,
                this.remeasure = false,
                this.setTxt = function(ogariosettxtsetter) {
                    this.txt !== ogariosettxtsetter && (this.txt = ogariosettxtsetter,
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setColor = function(ogariocolorsetter) {
                    this.color !== ogariocolorsetter && (this.color = ogariocolorsetter,
                        this.redraw = true);
                },
                this.setStroke = function(ogariostrokesetter) {
                    this.stroke !== ogariostrokesetter && (this.stroke = ogariostrokesetter,
                        this.redraw = true);
                },
                this.setStrokeWidth = function(ogariostrokewidthsetter) {
                    this.stroke && this.strokeWidth != ogariostrokewidthsetter && (this.strokeWidth = ogariostrokewidthsetter,
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setStrokeColor = function(ogariostrokecolorsetter) {
                    this.stroke && this.strokeColor !== ogariostrokecolorsetter && (this.strokeColor = ogariostrokecolorsetter,
                        this.redraw = true);
                },
                this.setFont = function() {
                    this.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
                },
                this.setFontFamily = function(ogariofontfamilysetter) {
                    this.fontFamily !== ogariofontfamilysetter && (this.fontFamily = ogariofontfamilysetter,
                        this.setFont(),
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setFontWeight = function(ogariofontweightsetter) {
                    this.fontWeight != ogariofontweightsetter && (this.fontWeight = ogariofontweightsetter,
                        this.setFont(),
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setFontSize = function(ogariofontsizesetter) {
                    this.fontSize != ogariofontsizesetter && (this.fontSize = ogariofontsizesetter,
                        this.margin = ~~(0.2 * ogariofontsizesetter),
                        this.setFont(),
                        this.redraw = true);
                },
                this.setScale = function(ogarioscalesetter) {
                    this.scale != ogarioscalesetter && (this.scale = ogarioscalesetter,
                        this.redraw = true);
                },
                this.createCanvas = function() {
                    this.txtCanvas || (this.txtCanvas = document.createElement('canvas'),
                        this.txtCtx = this.txtCanvas.getContext('2d'),
                        this.txtCtx.ogarioCtx = true);
                },
                this.setDrawing = function(ogarsetDrawinglabel1, ogarsetDrawinglabel2, ogarsetDrawinglabel3, ogarsetDrawinglabel4, ogarsetDrawinglabel5, ogarsetDrawinglabel6) {
                    this.setColor(ogarsetDrawinglabel1),
                        this.setFontFamily(ogarsetDrawinglabel2),
                        this.setFontWeight(ogarsetDrawinglabel3),
                        this.setStroke(ogarsetDrawinglabel4),
                        this.setStrokeWidth(ogarsetDrawinglabel5),
                        this.setStrokeColor(ogarsetDrawinglabel6);
                },
                this.measureWidth = function() {
                    return this.remeasure && (this.txtCtx.font = this.fontWeight + ' 10px ' + this.fontFamily,
                            this.measuredWidth = this.txtCtx.measureText(this.txt).width,
                            this.remeasure = false),
                        ~~(this.fontSize / 10 * this.measuredWidth) + 2 * this.strokeWidth;
                },
                this.drawTxt = function() {
                    return this.createCanvas(),
                        this.redraw && (this.redraw = false,
                            this.txtCanvas.width = this.measureWidth(),
                            this.txtCanvas.height = this.fontSize + this.margin * 2,
                            this.txtCtx.font = this.font,
                            this.txtCtx.globalAlpha = 1,
                            this.txtCtx.lineWidth = this.strokeWidth,
                            this.txtCtx.strokeStyle = this.strokeColor,
                            this.txtCtx.fillStyle = this.color,
                            this.stroke && this.txtCtx.strokeText(this.txt, this.strokeWidth, ~~(this.fontSize + this.margin * 0.5)),
                            this.txtCtx.fillText(this.txt, this.strokeWidth, ~~(this.fontSize + this.margin * 0.5))),
                        this.txtCanvas;
                };
        }
        window.legendmod3 = ogarminimapdrawer;

        function ogarbasicassembly(t, e, s, o, a, n, r, l, h, c) {
			cimg2 = new Image;
            cimg2.src = g.commanderImage2;		
			cimg5 = new Image;			
            cimg5.src = g.commanderImage5;
			cimg6 = new Image;			
            cimg6.src = g.commanderImage6;		
			cimg7 = new Image;			
            cimg7.src = 'https://jimboy3100.github.io/banners/iconLcForCanvas.png';				
						
			if (dyinglight1load=="yes"){
			cimgDyingLight = new Image;
            cimgDyingLight.src = g.commanderImageDyingLight;	
			cimgDyingLightvirus = new Image;
            cimgDyingLightvirus.src = g.commanderImageDyingLightvirus;	
			
			
			cimgDyingLight1 = new Image;
            cimgDyingLight1.src = 'https://jimboy3100.github.io/banners/icondyinglightzombie2.png';			
			cimgDyingLight2 = new Image;
            cimgDyingLight2.src = 'https://jimboy3100.github.io/banners/icondyinglightzombie3.png';		
			cimgDyingLight3 = new Image;
            cimgDyingLight3.src = 'https://jimboy3100.github.io/banners/icondyinglightzombie4.png';		
			cimgDyingLight4 = new Image;
            cimgDyingLight4.src = 'https://jimboy3100.github.io/banners/icondyinglightzombie5.png';		
			cimgDyingLight5 = new Image;
            cimgDyingLight5.src = 'https://jimboy3100.github.io/banners/icondyinglightzombiebig.png';		
			cimgDyingLight6 = new Image;
            cimgDyingLight6.src = 'https://jimboy3100.github.io/banners/icondyinglightvolaltile.png';			
            }		
            
            //lylko
            this.points = []
            this.pointsVel = []
            this.maxPointRad = 0


			this.oldAlpha=0;
            this.id = t; 
			this.x = e; 
			this.y = s; 
			this.targetX = e;
			this.targetY = s; 
			this.color = a; 
			this.oppColor = null;
			this.size = o; 
			this.targetSize = o;
			this.alpha = 1;
			this.nick = '';
			this.targetNick = '';
			this.nickCanvas = null;
			this.mass = 0;
			this.lastMass = 0;
			this.kMass = 0; 
			this.massCanvas = null;
			this.massTxt = '';
			this.margin = 0;
			this.scale = 1;
			this.nickScale = 1;
			this.massScale = 1;
			this.virMassScale = 3;
			this.strokeScale = 1;
			this.fontSize = 26;
			this.nickSize = 26;
			this.lastNickSize = 0;
			this.massSize = 26;
			this.virMassSize = 26;
			this.nickStrokeSize = 3;
			this.massStrokeSize = 3;
			this.isFood = n;
			this.isVirus = r;
			this.isPlayerCell = l;
			this.shortMass = h;
			this.virMassShots = c;
			this.rescale = false;
			this.redrawNick = true;
			this.redrawMass = true;
			this.optimizedNames = false;
			this.optimizedMass = false;
			this.strokeNick = false;
			this.strokeMass = false;
			this.removed = false;
			this.redrawed = 0;
			this.time = 0;
			this.skin = null;
			this.pi2 = 2 * Math.PI;			
                this.virusColor = null;
                this.virusStroke = null;
                this.nHeight = 6;

        this.updateNumPoints= function() {
            //adjustment of the number of contacts
            var numPoints = this.size * ogarfooddrawer.scale | 0;
            numPoints = Math.max(numPoints, 5);
            numPoints = Math.min(numPoints, 120);
            if (this.isVirus) numPoints = 100;
            while (this.points.length > numPoints) {
                var i = Math.random() * this.points.length | 0;
                this.points.splice(i, 1);
                this.pointsVel.splice(i, 1);
            }
            if (this.points.length == 0 && numPoints != 0) {
                this.points.push({
                    x: this.x,
                    y: this.y,
                    rl: this.size,
                    parent: this//?
                });
                this.pointsVel.push(Math.random() - 0.5);
            }
            while (this.points.length < numPoints) {
                var i = Math.random() * this.points.length | 0;
                var point = this.points[i];
                var vel = this.pointsVel[i];
                this.points.splice(i, 0, {
                    x: point.x,
                    y: point.y,
                    rl: point.rl,
                    parent: this
                });
                this.pointsVel.splice(i, 0, vel);
            }
        }
        this.sqDist = function(a, b) {
            return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
        }
        this.movePoints= function() {
            //console.log(this.id)
            var pointsVel = this.pointsVel.slice();
            var len = this.points.length;
            for (var i = 0; i < len; ++i) {
                var prevVel = pointsVel[(i - 1 + len) % len];
                var nextVel = pointsVel[(i + 1) % len];
                var newVel = (this.pointsVel[i] + Math.random() - 0.5) * 0.7;
                newVel = Math.max(Math.min(newVel, 10), -10);
                this.pointsVel[i] = (prevVel + nextVel + 8 * newVel) / 10;
            }
            this.maxPointRad = 0
            for (var i = 0; i < len; ++i) {
                var curP = this.points[i];
                var curRl = curP.rl;
                var prevRl = this.points[(i - 1 + len) % len].rl;
                var nextRl = this.points[(i + 1) % len].rl;
                var self = this;
                var affected = M.quadtree.some({
                    x: curP.x - 5,
                    y: curP.y - 5,
                    w: 10,
                    h: 10
                }, function(item) {
                    return item.parent != self && this.sqDist(item, curP) <= 25;
                }.bind(this));

                //this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY

                //(curP.x < M.mapMinX || curP.y < M.mapMaxY ||
                //curP.x > M.mapMaxX || curP.y > M.mapMinY))


                //(curP.x < M.viewMinX || curP.y < M.viewMaxY ||
                //curP.x > M.viewMaxX || curP.y > M.viewMinY))

                /*if (!affected &&
                    (curP.x < M.mapMinX || curP.y < M.mapMaxY ||
                    curP.x > M.mapMaxX || curP.y > M.mapMinY))
                {
                    affected = true;
                }*/
                if (affected) {
                    //console.log('affected!!!!!')
                    this.pointsVel[i] = Math.min(this.pointsVel[i], 0);
                    this.pointsVel[i] -= 1;
                }
                curRl += this.pointsVel[i];
                curRl = Math.max(curRl, 0);

                curRl = (9 * curRl + this.size) / 10;//собака

                curP.rl = (prevRl + this.size + 8 * curRl) / 10;//собака

                //curP.rl = (prevRl + nextRl + 8 * curRl) / 10;

                var angle = 2 * Math.PI * i / len;
                var rl = curP.rl;
                if(rl > this.maxPointRad) this.maxPointRad = rl
                if (this.isVirus && i % 2 == 0) {
                    rl += 5;
                }

                curP.x = this.x + Math.cos(angle) * rl;
                curP.y = this.y + Math.sin(angle) * rl;
            }
        };
		
                this.update = function(t, e, i, s, o, a) {
                    this.x = t;
					this.y = e;
					this.isVirus = s;
					this.isPlayerCell = o;
					this.setMass(i);
					this.setNick(a);
                };
        this.removeCell = function () {
            this.removed = true;
            var t = M.cells.indexOf(this);
            if (t != -1) {
                M.cells.splice(t, 1);
                if (v.virusesRange) {
                    t = M.viruses.indexOf(this);
                    if (t != -1) {
                        M.viruses.splice(t, 1);
                    }
                }
            } else {
                t = M.food.indexOf(this);
                if (t != -1) {
                    M.food.splice(t, 1);
                }
            }
            t = M.playerCells.indexOf(this);
            if (t != -1) {
                M.removePlayerCell = true;
                M.playerCells.splice(t, 1);
                t = M.playerCellIDs.indexOf(this.id);
                if (t != -1) {
                    M.playerCellIDs.splice(t, 1);
                }
            }
            if (this.redrawed) {
                M.removedCells.push(this);
            }
            delete M.indexedCells[this.id];
        };
        this.moveCell = function () {
            var t = M.time - this.time;
            var t1 = t / v.animation;
            t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
            this.x += (this.targetX - this.x) * t1;
            this.y += (this.targetY - this.y) * t1;
            this.size += (this.targetSize - this.size) * t1;
            this.alpha = t1;
            if (!this.removed) {
                this.time = M.time;
                return;
            }
            if (t1 == 1) {
                var t2 = M.removedCells.indexOf(this);
                if (t2 != -1) {
                    M.removedCells.splice(t2, 1);
                }
            }
        };
				this.isInView = function() {
					//console.log("hi");
                    return !(this.id <= 0) && !(this.x + this.size + 40 < M.viewX - M.canvasWidth / 2 / M.scale || this.y + this.size + 40 < M.viewY - M.canvasHeight / 2 / M.scale || this.x - this.size - 40 > M.viewX + M.canvasWidth / 2 / M.scale || this.y - this.size - 40 > M.viewY + M.canvasHeight / 2 / M.scale);
                };
				/*
				this.setMass = function(t) {
                    return this.size = t, !(t <= 40) && (this.massCanvas ? (this.mass = ~~(t * t / 100), this.redrawMass = true, this.isVirus ? (this.virMassShots && this.mass < 200 && (this.mass = ~~((200 - this.mass) / 14)), this.massTxt = this.mass.toString(), this.mass > 220 ? (this.virusColor = g.mVirusColor, this.virusStroke = g.mVirusStrokeColor) : (this.virusColor = g.virusColor, this.virusStroke = g.virusStrokeColor), true) : (this.massTxt = this.mass.toString(), this.mass <= 200 || (this.shortMass && this.mass >= 1000 ? (this.kMass = Math.round(this.mass / 100) / 10, this.massTxt = this.kMass + 'k', true) : (this.optimizedMass && (this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale), true)))) : (this.massCanvas = new irenderfromagario(), false));
                };
				*/
				this.setMass = function(t) {
					this.size = t;
					if (t <= 40) {
						return false;
					}
					if (!this.massCanvas) {
						this.massCanvas = new irenderfromagario();
					return false;
            }			
			this.mass = ~~(t * t / 100); 
			this.redrawMass = true;
			if(this.isVirus){
				if(this.mass <= 200){
					this.virusColor = g.virusColor, this.virusStroke = g.virusStrokeColor;							
					}	
					else if (this.mass > 220){
					this.virusColor = g.mVirusColor, this.virusStroke = g.mVirusStrokeColor;
					}					
				if(this.virMassShots){				
					this.mass = ~~((200 - this.mass) / 14);										
				}
				if(v.virusSound && this.lastMass && this.mass < this.lastMass) {
					void ogarminimapdrawer.playSound(ogarminimapdrawer.setSound(v.virusSoundurl));
					}
					this.massTxt = this.mass.toString();											
			}
            this.massTxt = this.mass.toString();

            if (this.shortMass && this.mass >= 1000) {
                this.kMass = Math.round(this.mass / 100) / 10;
                this.massTxt = this.kMass + 'k';
            return true;    
            }
            if (this.optimizedMass) {
                this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;				
            }
            return true;
        };
		
        this.setNick = function (t) {
            this.nick = t;
            if (!t || this.isVirus) {
                return false;
            }
            if (!this.nickCanvas) {
                this.nickCanvas = new irenderfromagario();
                return false;
            }
            return true;
        };
        this.setScale = function (t, e, i, s, o) {
            var t = Math.ceil(t * 10) / 10;
            this.rescale = false;
            if (this.scale != t) {
                this.scale = t;
                this.rescale = true;
            }
            this.nickScale = e;
            this.massScale = i;
            this.virMassScale = s;
            this.strokeScale = o;
        };
        this.setFontSize = function () {
            if (this.isVirus) {
                this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale);
                return;
            }
            this.fontSize = Math.max(this.size * 0.3, 26) * this.scale;
            this.nickSize = ~~(this.fontSize * this.nickScale);
            this.massSize = ~~(this.fontSize * 0.5 * this.massScale);
            if (this.optimizedNames) {
                this.redrawNick = Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) >= 0.3 || this.rescale;
                return;
            }
            this.redrawNick = true;
        };
        this.setStrokeSize = function () {
            if (this.strokeNick && !this.isVirus) {
                this.nickStrokeSize = ~~(this.nickSize * 0.1 * this.strokeScale);
            }
            if (this.strokeMass) {
                this.massStrokeSize = ~~(this.massSize * 0.1 * this.strokeScale);
            }
        };
        this.setDrawing = function () {
            this.optimizedNames = v.optimizedNames;
            this.optimizedMass = v.optimizedMass;
            this.shortMass = v.shortMass;
            this.virMassShots = v.virMassShots;
            this.strokeNick = v.namesStroke;
            this.strokeMass = v.massStroke;
        };
        this.setDrawingScale = function () {
            this.setScale(i.viewScale, g.namesScale, g.massScale, g.virMassScale, g.strokeScale);
            this.setFontSize();
            this.setStrokeSize();
            this.margin = 0;
        };
        this.drawNick = function (t) {
            if (!this.nick || !this.nickCanvas || this.isVirus) {
                return;
            }
            var nickCanvas = this.nickCanvas;
            nickCanvas.setDrawing(g.namesColor, g.namesFontFamily, g.namesFontWeight, this.strokeNick, this.nickStrokeSize, g.namesStrokeColor);
            nickCanvas.setTxt(this.nick);
            if (this.redrawNick) {
                nickCanvas.setFontSize(this.nickSize);
                this.lastNickSize = this.nickSize;
            }
            nickCanvas.setScale(this.scale);
            var nickImg = nickCanvas.drawTxt();
            var w = ~~(nickImg.width / this.scale);
            var h = ~~(nickImg.height / this.scale);
            this.margin = ~~(h / 2);
			try {
            t.drawImage(nickImg, ~~this.x - ~~(w / 2), ~~this.y - this.margin, w, h);
			} catch (e) {}			
        };
				this.drawMass = function(context) {
                    if (this.massCanvas && !(this.size <= 40)) {
                        var massCanvas = this.massCanvas;
                        massCanvas.setDrawing(g.massColor, g.massFontFamily, g.massFontWeight, this.strokeMass, this.massStrokeSize, g.massStrokeColor);
                        if (this.redrawMass) {
                            massCanvas.setTxt(this.massTxt);
                            this.lastMass = this.mass;
                        }
                        massCanvas.setFontSize(this.massSize);
                        massCanvas.setScale(this.scale);
                        let data = massCanvas.drawTxt();
                        let width = ~~(data.width / this.scale);
                        let height = ~~(data.height / this.scale);
                        let textureY = this.margin === 0 ? ~~(this.y - height / 2) : ~~this.y + this.margin;
                        if (width > 1 && height > 1) {
							try {
                            context.drawImage(data, ~~(this.x - width / 2), textureY, width, height);
							} catch (e) {}			
                        }
                    }
                };
                this.createStrokeVirusPath = function(shadowXpos, shadowYpos, zeroSizeMax, pixelSizeTargetMax = 6) {
                    const nAngelsOfVirus = ~~(45 * zeroSizeMax / 98);
                    const GROUPSIZE = this.pi2 / nAngelsOfVirus;
                    const degreeStep = GROUPSIZE / 2;
                    const ctxfx = new Path2D;
                    const radiusX = zeroSizeMax - pixelSizeTargetMax;
                    const tileHeight = radiusX + this.nHeight;
                    const n = this.pi2 + GROUPSIZE;
                    for (let i = 0, j = degreeStep; i <= n; j = (i = i + GROUPSIZE) + degreeStep) {
                        ctxfx.lineTo(~~(shadowXpos + radiusX * Math.sin(i)), ~~(shadowYpos + radiusX * Math.cos(i)));
                        ctxfx.lineTo(~~(shadowXpos + tileHeight * Math.sin(j)), ~~(shadowYpos + tileHeight * Math.cos(j)));
                    }
                    return ctxfx;
                };
                this.draw = function(style, canCreateDiscussions) {				
                    if (!(M.hideSmallBots && this.size <= 36)) {
                        style.save();
                        this.redrawed++;
                        if (canCreateDiscussions) {
                            this.moveCell();
                        }
                        if (this.removed) {
                            style.globalAlpha *= 1 - this.alpha;
                        }
                        var value = style.globalAlpha;
                        var s = false;
                        var y = this.isFood ? this.size + g.foodSize : this.size;
                        style.beginPath()


                        if (v.jellyPhisycs && this.points.length) {
                            var point = this.points[0];
                            style.moveTo(point.x, point.y);
                            for (var i = 0; i < this.points.length; ++i) {
                                var point = this.points[i];
                                style.lineTo(point.x, point.y);
                            }
                        }else if (v.jellyPhisycs && this.isVirus) {
                            style.lineJoin = "miter"
                            var pointCount = 120;
                            var incremental = this.pi2 / pointCount;
                            style.moveTo(this.x, this.y + this.size + 3);
                            for (var i = 1; i < pointCount; i++) {
                                var angle = i * incremental;
                                var dist = this.size - 3 + (i % 2 === 0) * 6;
                                style.lineTo(
                                    this.x + dist * Math.sin(angle),
                                    this.y + dist * Math.cos(angle)
                                )
                            }
                            style.lineTo(this.x, this.y + this.size + 3);
                        }else style.arc(this.x, this.y, y, 0x0, this.pi2, false);

                        style.closePath();



                        //if (style.arc(this.x, this.y, y, 0, this.pi2, false), style.closePath(), this.isFood) {
                        //    return style.fillStyle = this.color, style.fill(), void style.restore();
                        //}


						if (!v.jellyPhisycs){
                        if (this.isVirus) {
							//console.log("is not jelly");
							if (dyinglight1load == "yes" ) {
							try {	
							style.drawImage(cimgDyingLightvirus, this.x - 0.8 * this.size, this.y - 0.8 * this.size, 1.6 * this.size, 1.6 * this.size);
							} catch (e) {}
							}							
                            return v.transparentViruses && (style.globalAlpha *= g.virusAlpha, s = true), v.virColors && M.play ? (style.fillStyle = ogarminimapdrawer.setVirusColor(y), style.strokeStyle = ogarminimapdrawer.setVirusStrokeColor(y)) : (style.fillStyle = this.virusColor, style.strokeStyle = this.virusStroke), style.fill(), s && (style.globalAlpha = value, s = false), style.lineWidth = g.virusStrokeSize, v.virusGlow ? (style.shadowBlur = g.virusGlowSize, style.shadowColor =
                                g.virusGlowColor) : "yeet", style.stroke(this.createStrokeVirusPath(this.x, this.y, this.size - 2, 6)), v.showMass && (this.setDrawing(), this.setDrawingScale(), v.virusGlow ? style.shadowBlur = 0 : "yote", this.setMass(this.size), this.drawMass(style)), void style.restore();
                        }
						}	
						else{
						if (this.isVirus) {
							//console.log("is jelly");
                if (v.transparentViruses) {
                    style.globalAlpha *= g.virusAlpha;
                    v.isAlphaChanged = true;
                }
                if (v.virColors && M.play) {
                    style.fillStyle = ogarminimapdrawer.setVirusColor(y);
                    style.strokeStyle = ogarminimapdrawer.setVirusStrokeColor(y);
                } else {
                    style.fillStyle = g.virusColor;
                    style.strokeStyle = g.virusStrokeColor;
                }
                style.fill();
                if (v.isAlphaChanged) {
                    style.globalAlpha = g.cellsAlpha;
                    v.isAlphaChanged = false;
                }
                style.lineWidth = g.virusStrokeSize;
				if(v.virusGlow){ style.shadowBlur = g.virusGlowSize;
				style.shadowColor =g.virusGlowColor; }
                style.stroke();
                if (v.showMass) {
                    this.setDrawing();
                    this.setDrawingScale();
                    this.setMass(this.size);
                    this.drawMass(style);
                }
                style.restore();
                return;
            }	
						}			
                        if (v.transparentCells) {
                            style.globalAlpha *= g.cellsAlpha;
                            s = true;
                        }
                        var color = this.color;
                        if (M.play) {
                            if (this.isPlayerCell) {
                                if (v.myCustomColor) {
                                    color = ogarcopythelb.color;
                                }
                            } else {
                                if (v.oppColors && !v.oppRings) {
                                    color = this.oppColor;
                                }
                            }
                        }
						if (dyinglight1load != "yes" || this.targetNick.includes("The Dying Light")){
                        style.fillStyle = color;
                        style.fill();
						}
                        if (s) {
                            style.globalAlpha = value;
                            s = false;
                        }
						/*if (dyinglight1load != "yes"){
                            style.globalAlpha = 1;
                            s = false;							
						}*/
                        var node = null;						
						var node2 = {}; //, node2.src = ogarminimapdrawer.customSkinsMap[this.targetNick]
                        
                        

                        //lylko
                        if (v.customSkins && M.showCustomSkins){
                             node = ogarminimapdrawer.getCustomSkin(this.targetNick, this.color);
                             
                            if (node){
                                if ((v.transparentSkins || M.play && v.oppColors) && !(this.isPlayerCell && !v.myTransparentSkin) || this.isPlayerCell && v.myTransparentSkin) {
                                    style.globalAlpha *= g.skinsAlpha;
                                    s = true;
                                }
                            

                                if(v.jellyPhisycs){
                                    var lineWidth = Math.max(~~(y / 50), 10);
                                    style.save();
                                    style.clip();
                                    this.maxPointRad && (y=this.maxPointRad);
									try {
                                    style.drawImage(node, this.x - y-lineWidth, this.y - y-lineWidth, 2 * y+lineWidth*2, 2 * y+lineWidth*2);
									} catch (e) {}
                                    style.globalCompositeOperation='luminosity';
                
                                    style.lineWidth = lineWidth
                                    style.strokeStyle = color;
                                    style.stroke();
                                    style.globalCompositeOperation='';
                                    style.restore();
                
                                } else {
									try {
									style.drawImage(node, this.x - y, this.y - y, 2 * y, 2 * y);
									} catch (e) {}
									}
								
								//special animations
								if (this.targetNick.includes("The Dying Light")){
									try {
									style.drawImage(cimg5, this.x - y * 2, this.y - y * 2, 4 * y, 4 * y);
									} catch (e) {}
								}
								else if(this.targetNick.includes("℄🌀Jimboy3100") || this.targetNick.includes("Qᴜᴇᴛᴢᴀʟ   ᶜᵒᵃᵗˡ") || this.targetNick.includes("℄🌀     ᑕᖇᗩƵƳ😈") || this.targetNick.includes("℄🌀ᔕᕼᗴᖇᗴ ᛕᕼᗩᑎ")){
									try {
									style.drawImage(cimg2, this.x - y * 2, this.y - y * 2, 4 * y, 4 * y);
									//style.translate(this.x - y * 2, this.y - y * 2, this.y - y * 2);
									//style.rotate(M.cAngle); 									
									//style.drawImage(cimg2, this.x - y * 2, this.y - y * 2, 4 * y, 4 * y);
									//try
									//M.updateCommander();									
									} catch (e) {}
								}
						//style.drawImage(node, this.x - y, this.y - y, 2 * y, 2 * y), s && (style.globalAlpha = value, s = false)), 
						//(this.targetNick.includes("℄🌀ＪｕｓｔＷａｔｃｈＰｒｏ")) && (this.oldAlpha=style.globalAlpha, style.globalAlpha = 0.1, style.drawImage(cimg7, this.x - y * 4, this.y - y * 4, 8 * y, 8 * y), style.globalAlpha=this.oldAlpha), //cimg7						
						//((v.videoSkins && (node2.src.includes(".mp4") || node2.src.includes(".webm") || node2.src.includes(".ogv")) && checkVideos(node2.src, this.targetNick)),
						//(node2.src.includes(".mp4") || node2.src.includes(".webm") || node2.src.includes(".ogv")) && style.drawImage(window.videoJustWatchPro[node2.src], this.x - 0.7 * y, this.y - 0.7 * y, 1.4 * y, 1.4 * y) ),
						//node2.src.includes(".mp4") && (style.drawImage(node2, this.x - 0.7 * y, this.y - 0.7 * y, 1.4 * y, 1.4 * y)),
						//!node2.src.includes(".mp4") && !node2.src.includes(".webm") && !node2.src.includes(".ogv") && style.drawImage(node, this.x - y, this.y - y, 2 * y, 2 * y), 
						//(this.targetNick.includes("℄🌀ＪｕｓｔＷａｔｃｈＰｒｏ")) && (style.drawImage(cimg6, this.x - y, this.y - y, 2 * y, 2 * y)),
						//this.targetNick.includes("℄") && (style.rotate(M.cAngle1)) && (style.drawImage(cimg2, this.x - y * 1.5, this.y - y * 1.5, 3 * y, 3 * y)) &&
						//(this.targetNick.includes("The Dying Light")) && (style.drawImage(cimg5, this.x - y * 2, this.y - y * 2, 4 * y, 4 * y)), 
						//(this.targetNick.includes("℄🌀Jimboy3100") || this.targetNick.includes("℄🌀     ᑕᖇᗩƵƳ😈") || this.targetNick.includes("℄🌀ᔕᕼᗴᖇᗴ ᛕᕼᗩᑎ")) && 

						//(M.cAngle += .007), console.log(M.cAngle),
						//style.rotate(M.cAngle1),
                            }
                        }
                        if (s){
                            style.globalAlpha = value;
                            s = false;
                        }
                         
                       
						if(v.teammatesInd && !this.isPlayerCell && y <= 800 && 
						window.teammatenicks && 
						(window.teammatenicks.includes(this.targetNick))){
						 ogarfooddrawer.drawTeammatesInd(style, this.x, this.y, y)}
						
						if(v.noNames && !v.showMass || canCreateDiscussions){

//                            y <= 200 && (node || ogarminimapdrawer.checkSkinsMap(this.targetNick, this.color)) && ogarfooddrawer.drawTeammatesInd(style, this.x, this.y, y), v.noNames && !v.showMass || canCreateDiscussions) {

                            style.restore();
                            return;
                        } else {
							if (v.customSkins && M.showCustomSkins){
								node2.src = ogarminimapdrawer.customSkinsMap[this.targetNick];
								ogarminimapdrawer.customSkinsMap[this.targetNick];								
								if (node2.src){
								if (v.videoSkins){ 
								if (node2.src.includes(".mp4") || node2.src.includes(".webm") || node2.src.includes(".ogv")){
									checkVideos(node2.src, this.targetNick);
									try {
									style.drawImage(window.videoJustWatchPro[node2.src], this.x - 0.7 * y, this.y - 0.7 * y, 1.4 * y, 1.4 * y);
									} catch (e) {}
								}	
							}								
							}
							if (dyinglight1load == "yes" && node==null && this.targetNick.includes("The Dying Light")==false) {			
								try {
								style.drawImage(cimgDyingLight, this.x - y, this.y - y, 2 * y, 2 * y);	
								} catch (e) {}
							}
							
							}
                            var recursive = false;
                            if (!this.isPlayerCell && (recursive = ogarminimapdrawer.setAutoHideCellInfo(y)) && v.autoHideNames && v.autoHideMass) {
                                style.restore();
                            } else {
                                this.setDrawing();
                                this.setDrawingScale();
                                style.globalAlpha *= g.textAlpha;
                                if (!(v.noNames || recursive && v.autoHideNames || this.isPlayerCell && v.hideMyName || node && v.hideTeammatesNames)) {
                                    if (this.setNick(this.targetNick)) {
                                        this.drawNick(style);
                                    }
                                }
                                if (!(!v.showMass || recursive && v.autoHideMass || this.isPlayerCell && v.hideMyMass || v.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
                                    if (this.setMass(this.size)) {
										
                                        this.drawMass(style);
                                    }
                                }
                                style.restore();
                            }
							

						
                    }
				}
            };
        }
        window.legendmod1 = ogarbasicassembly;
		

		
        var M = {
				'quadtree':null,
				updateQuadtree: function(cells) {
				var w = ogarfooddrawer.canvasWidth / ogarfooddrawer.scale;
				var h = ogarfooddrawer.canvasHeight / ogarfooddrawer.scale;
				var x = (M.viewX - w / 2);
				var y = (M.viewY - h / 2);
				this.quadtree = new PointQuadTree(x, y, w, h, 32);
				for (var i = 0; i < cells.length; ++i) {
					var cell = cells[i];
					for (var n = 0; n < cell.points.length; ++n) {
						this.quadtree.insert(cell.points[n]);
					}
				}
			},			
            'ws': null,
            'socket': null,
            'protocolKey': null,
            'clientKey': null,
            'connectionOpened': false,
            'accessTokenSent': false,
            'clientVersion': 0x76c0,
            'clientVersionString': '3.4.0',
            'time': Date.now(),
            'serverTime': 0,
            'serverTimeDiff': 0,
            'loggedInTime': 0,
            'mapSize': 0x373e,
            'mapOffset': 7071,
            'mapOffsetX': 0,
            'mapOffsetY': 0,
            'mapOffsetFixed': false,
            'mapMinX': -7071,
            'mapMinY': -7071,
            'mapMaxX': 7071,
            'mapMaxY': 7071,
            'viewMinX': 0,
            'viewMinY': 0,
            'viewMaxX': 0,
            'viewMaxY': 0,
            'canvasWidth': 0,
            'canvasHeight': 0,
            'canvasScale': 1,
            'indexedCells': {},
            'cells': [],
            'removedCells': [],
            'food': [],
            'viruses': [],
            'playerCells': [],
            'playerCellIDs': [],
            'ghostCells': [],
            'playerX': 0,
            'playerY': 0,
            'playerSize': 0,
            'playerMass': 0,
            'playerMaxMass': 0,
            'playerMinMass': 0,
            'playerScore': 0,
            'playerSplitCells': 0,
            'playerColor': null,
            'playerNick': '',
            'playerPosition': 0,
            'leaderboard': [],
            'biggerSTECellsCache': [],
            'biggerCellsCache': [],
            'smallerCellsCache': [],
            'STECellsCache': [],
            'STE': 0,
            'autoZoom': false,
            'zoomValue': 0.1,
            'viewX': 0,
            'viewY': 0,
            'scale': 1,
            'viewScale': 1,
            'clientX': 0,
            'clientY': 0,
            'cursorX': 0,
            'cursorY': 0,
            'targetX': 0,
            'targetY': 0,
            'targetDistance': 0,
            ////
            "cRadius": 10,
            "cAngle": 4,
            "cAngle1": 0,
            "cAngle2": 0,
            "cAlpha": 1,
            "drawCommander": 0,
            ////
            'battleRoyale': {
                'state': 0,
                'players': 0,
                'startTime': 0,
                'shrinkTime': 0,
                'timeLeft': 0,
                'x': 0,
                'y': 0,
                'radius': 0,
                'targetX': 0,
                'targetY': 0,
                'targetRadius': 0,
                'maxRadius': 11313,
                'rank': [],
                'playerRank': 0,
                'joined': false
            },
            'play': false,
            'pause': false,
            'targeting': false,
            'removePlayerCell': false,
            'showCustomSkins': true,
            'showFood': true,
            'foodIsHidden': false,
            'selectBiggestCell': true,
            'hideSmallBots': false,
            'pressedKeys': {},
            'connect': function(t) {
                console.log('[Legend mod Express] Connecting to game server:', t);
                var i = this;
                this.closeConnection(); 
				this.flushCellsData();
				this.protocolKey = null; 
				this.clientKey = null;
				this.accessTokenSent = false;
				this.connectionOpened = false;
				this.mapOffsetFixed= false; 
				this['leaderboard'] = [];
				this.ws = t;
				this.socket = new WebSocket(t); 
				this.socket['binaryType'] = 'arraybuffer'; 
				this.socket['onopen'] = function() {
                    i['onOpen']();
                };
				this.socket['onmessage'] = function(t) {
                    i['onMessage'](t);
                };
				this.socket['onerror'] = function(t) {
                    i['onError'](t);
                };
				this.socket['onclose'] = function(t) {
                    i['onClose'](t);
                };
				ogarminimapdrawer['getWS'](this.ws);
				ogarminimapdrawer['sendServerJoin']();
				ogarminimapdrawer['sendServerData']();
				ogarminimapdrawer['displayLeaderboard']('');
				if (window.master && window.master['onConnect']) {
					window.master['onConnect']();
				}
            },
            'onOpen': function(t) {
                console.log('[Legend mod Express] Game server socket open'),
				this.time = Date.now();
                var e = this.createView(5);
                e.setUint8(0, 254), 
				e.setUint32(1, 21, true), 
				this.sendMessage(e), 
				(e = this.createView(5)).setUint8(0, 255), 
				e.setUint32(1, this.clientVersion, true), 
				this.sendMessage(e), 
				this.connectionOpened = true;
            },
            'onMessage': function(t) {
                t = new DataView(t['data']);
				if (this.protocolKey){
				t = this['shiftMessage'](t, this.protocolKey ^ this.clientVersion);
				} 
				this['handleMessage'](t);
            },
            'onError': function(t) {
                console.log('[Legend mod Express] Game server socket error'); 
				this.flushCellsData();
				if (window.master && window.master['onDisconnect']){
					window.master['onDisconnect']();
				}
            },
            'onClose': function(t) {
                console.log('[Legend mod Express] Game server socket close'); 
				this.flushCellsData(); 
				if (window.master && window.master['onDisconnect']){
					window.master['onDisconnect']();
				}
            },
            'closeConnection': function() {
                if (this.socket) {
                    this.socket['onopen'] = null; 
					this.socket['onmessage'] = null;
					this.socket['onerror'] = null; 
					this.socket['onclose'] = null;
                    try {
                        this.socket['close']();
                    } catch (ogarcloseconncloser) {}
                    this.socket = null;
					this.ws = null;
                }
            },
            'isSocketOpen': function() {
                return null !== this.socket && this.socket['readyState'] === this.socket['OPEN'];
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'sendBuffer': function(t) {
                this.socket['send'](t['buffer']);
            },
            'sendMessage': function(t) {
                //console.log(t);
                if (this.connectionOpened) {
                    if (!this.clientKey) return;
                    t = this['shiftMessage'](t, this.clientKey);
					this.clientKey = this.shiftKey(this.clientKey);
                }
                this['sendBuffer'](t);
            },
            'sendAction': function(t) {
                if (this.isSocketOpen()) {
                    var e = this.createView(1);
                    e.setUint8(0, t);
					this.sendMessage(e);
                }
            },

            'calcDist': function(x, y) {
                return Math.round(Math.sqrt(Math.pow(this.playerX - x, 2) + Math.pow(this.playerY - y, 2)));
            },

            'calcTarget': function () {
				legendmod.zoomValue=0.3;
                let target; 
				target2 = {};
                let bestDist = 10000;
				
				let targetVirus;
				let bestDistVirus;
				let doSplit=false;
				
                Object.keys(this.food).forEach(node => {
					if (this.food[node].isFood){ //not needed
                    let cell = this.food[node];
                    let distance = this.calcDist(cell.x, cell.y);
                    if (distance < bestDist) {
                    target = cell;
                    bestDist = distance;
                    }
					} //
                });
                       		
                Object.keys(this.cells).forEach(node => {
                    let PlayerCell = this.cells[node];
                    let distancePlayerCell = this.calcDist(PlayerCell.x, PlayerCell.y);		
					
					if (this.cells[node].nick != this.playerNick){
					if (distancePlayerCell < 200 && this.playerMass >125 && this.cells[node].isVirus) {					                   
					targetVirus = PlayerCell;
					if (window.VirusFlag == true){						
						window.VirusFlag = false; setTimeout(function() {window.VirusFlag = true;}, 1000);
						$('#pause-hud').html("<font color='blue'>Virus</font> is close. X: " + parseInt(targetVirus.x - this.playerX) + " , Y: " + parseInt(targetVirus.y - this.playerY));
					}
					if (targetVirus.x-this.playerX>0){target2.x=legendmod.mapMinX;}else{target2.x=legendmod.mapMaxX;}
					if (targetVirus.y-this.playerY>0){target2.y=legendmod.mapMinY;}else{target2.y=legendmod.mapMaxY;}	                    
				}
				//this.cells[0].isPlayerCell is our cell
				else if (distancePlayerCell < this.cells[node].size+960 && this.cells[node].mass > this.playerMass * 1.25) {
					 //760 
					targetPlayerCell = PlayerCell;
					if (window.BiggerCellFlag == true){
						window.BiggerCellFlag = false; setTimeout(function() {window.BiggerCellFlag = true;}, 1000);
						$('#pause-hud').html("<font color='blue'>" + this.cells[node].nick + "</font> (mass: " + this.cells[node].mass + ") is close. X: " + parseInt(targetPlayerCell.x - this.playerX) + " , Y: " + parseInt(targetPlayerCell.y - this.playerY));
					}
					if (targetPlayerCell.x-this.playerX>0){target2.x=legendmod.mapMinX;}else{target2.x=legendmod.mapMaxX;}						
					if (targetPlayerCell.y-this.playerY>0){target2.y=legendmod.mapMinY;}else{target2.y=legendmod.mapMaxY;}		
					//Avoiding corners
					if (targetPlayerCell.x<legendmod.mapMinX+760){ target2.x=legendmod.mapMaxY;$('#pause-hud').html("Avoiding cornersX- " + targetPlayerCell.x); }
					if (targetPlayerCell.y<legendmod.mapMinY+760){ target2.x=legendmod.mapMaxX;$('#pause-hud').html("Avoiding cornersY- " + targetPlayerCell.y); }
					if (targetPlayerCell.x>legendmod.mapMaxX-760){ target2.x=legendmod.mapMinY;$('#pause-hud').html("Avoiding cornersX+ " + targetPlayerCell.x); }
					if (targetPlayerCell.y>legendmod.mapMaxY-760){ target2.x=legendmod.mapMinX;$('#pause-hud').html("Avoiding cornersY+ " + targetPlayerCell.x); }										
				}
				else if (distancePlayerCell < this.cells[node].size+600 && this.cells[node].mass * 1.4 < this.playerMass) {
				if (this.cells[node].mass!=0 && this.cells[node].nick != "" && this.cells[node].mass * 2.7 < this.playerMass && this.playerCells.length==1 && !(this.cells[node].mass * 10 < this.playerMass )){
					 //760 
					targetPlayerCell = PlayerCell;
					if (window.SmallerCellFlag == true){
						window.SmallerCellFlag = false; setTimeout(function() {window.SmallerCellFlag = true;}, 1000);
						$('#pause-hud').html("<font color='blue'>" + this.cells[node].nick + "</font> (mass: " + this.cells[node].mass + ") is close and will be eaten by split. X: " + parseInt(targetPlayerCell.x - this.playerX) + " , Y: " + parseInt(targetPlayerCell.y - this.playerY));
					}
					target2.x = this.cells[node].x; target2.y = this.cells[node].y;
					console.log("Target mass: " + this.cells[node].mass);	
						if (this.cells[node].mass!=0 && this.cells[node].mass!="0" ){ //2nd time to check
						doSplit=true;
						}
					}
			
				else if (this.cells[node].mass * 1.4 < this.playerMass && !(this.cells[node].mass * 10 < this.playerMass )){
					targetPlayerCell = PlayerCell;
					if (window.SmallerCellFlag == true){
						window.SmallerCellFlag = false; setTimeout(function() {window.SmallerCellFlag = true;}, 1000);
						$('#pause-hud').html("<font color='blue'>" + this.cells[node].nick + "</font> (mass: " + this.cells[node].mass + ") is close, AI follows... X: " + parseInt(targetPlayerCell.x - this.playerX) + " , Y: " + parseInt(targetPlayerCell.y - this.playerY));
					}
					target2.x = this.cells[node].x; target2.y = this.cells[node].y;
					console.log("Target mass: " + this.cells[node].mass);					
				}	
				}
				}				
                });
				if (target != undefined){ //not needed
                this.sendPosition(target, target2);
				}
				if (doSplit == true && window.doSplitFlag == true){ 
				doSplit = false;
				window.doSplitFlag = false;
				setTimeout(function() {window.doSplitFlag = true;}, 2000);
                this.sendAction(17);
				}				
            },
            'sendSpectate': function() {
                this.sendAction(1);
            },
            'sendFreeSpectate': function() {
                this.sendAction(18);
            },
            'sendEject': function() {
                this.sendPosition();
				this.sendAction(21);
            },
            'sendSplit': function() {
                this.sendPosition();
				this.sendAction(17);
            },
            'sendNick': function(t) {
				
                this.playerNick = t, t = window.unescape(window.encodeURIComponent(t));
				window.Bufferdata = t; //
                var i = this.createView(1 + t.length);
                i.setUint8(0, 0);
                for (var s = 0; s < t.length; s++) i.setUint8(s + 1, t.charCodeAt(s));
                this.sendMessage(i);
            },
            'sendPosition': function(cell, target2) {
                if (this.isSocketOpen() && this.connectionOpened && this.clientKey) {
                    if (!window.autoPlay) {
                    var t = this["cursorX"];
                    var e = this["cursorY"];
                    if (!this.play && this.targeting || this.pause) {
                        t = this.targetX;
                        e = this.targetY;
                    }
                } else {
					//if (typeof cell != "undefined") { //when used, autoplay not working as expected
					if (Object.keys(target2).length==0){
                    var t = cell.x;
                    var e = cell.y;
					}
					else{
                    var t = target2.x;
                    var e = target2.y;						
					}			
					//}
                }

                    
                    var i = this.createView(13);
                    i.setUint8(0, 16);
                    i.setInt32(1, t, true);
                    i.setInt32(5, e, true);
                    i.setUint32(9, this.protocolKey, true);
                    this.sendMessage(i);
                }
            },
            /*            'sendAccessToken': function(t, e, i) {
                            if (!this['accessTokenSent']) {
                                i || (i = 102);
                                for (var s = t.length, o = this.clientVersionString.length, a = [i, 8, 1, 18, s + o + 23, 1, 8, 10, 0x52, s + o + 18, 1, 8, e, 18, o + 8, 8, 5, 18, o], n = 0; n < o; n++) a.push(this.clientVersionString.charCodeAt(n));
                                for (a.push(24, 0, 32, 0, 26, s + 3, 1, 10, s, 1), n = 0; n < s; n++) a.push(t.charCodeAt(n));
                                a = new Uint8Array(a);
                                var r = new DataView(a['buffer']);
                                this.sendMessage(r);
                            }
                        }, */
            "sendAccessToken": function(shapes, options, oW) {
                if (M["accessTokenSent"]) {
                    return;
                }
                if (!oW) {
                    oW = 102;
                }
                var curr = shapes.length;
                var count = this.clientVersionString.length;
                var data = [oW, 8, 1, 18];
                //this.writeUint32(data, curr + count + 23);
                ogarminimapdrawer.writeUint32(data, curr + count + 23);
                data.push(8, 10, 82);
                ogarminimapdrawer.writeUint32(data, curr + count + 18);
                //this.writeUint32(data, curr + count + 18);
                data.push(8, options, 18, count + 8, 8, 5, 18, count);
                var prev = 0;
                for (; prev < count; prev++) {
                    data.push(this.clientVersionString.charCodeAt(prev));
                }
                data.push(24, 0, 32, 0, 26);
                ogarminimapdrawer.writeUint32(data, curr + 3);
                //this.writeUint32(data, curr + 3);
                data.push(10);
                ogarminimapdrawer.writeUint32(data, curr);
                //this.writeUint32(data, curr);
                prev = 0;
                for (; prev < curr; prev++) {
                    data.push(shapes.charCodeAt(prev));
                }
                data = new Uint8Array(data);
                var raw_basefont = new DataView(data["buffer"]);
                this["sendMessage"](raw_basefont);
            },
            'sendFbToken': function(t) {
                console.log("[Legend mod Express] Facebook token: " + t);
                this.sendAccessToken(t, 2);
            },
            'sendGplusToken': function(t) {
                console.log("[Legend mod Express] Google Plus token: " + t);
                //this.sendAccessToken(t, 3);
                this.sendAccessToken(t, 4);
            },
            'sendRecaptcha': function(t) {
                var e = this.createView(2 + t.length);
                e.setUint8(0, 86);
                for (var i = 0; i < t.length; i++) e.setUint8(1 + i, t.charCodeAt(i));
                e.setUint8(t.length + 1, 0), this.sendMessage(e);
            },
            'setClientVersion': function(t, e) {

                if (window.disableIntegrity != false) { //
                    this.clientVersion = t; 
					this.clientVersionString = e;
					console.log('[Legend mod Express] Client version:', t, e);
                } //
                else { //
                    this.clientVersion = 0;
					this.clientVersionString = e;
					console.log('[Legend mod Express] Client version:', t, e); //
                } //
            },
/*            
			'generateClientKey': function(t, e) {
                if (!t.length || !e.byteLength) return null;
                for (var i = null, s = 1540483477, o = t.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2], a = o.length + e.byteLength, n = new Uint8Array(a), r = 0; r < o.length; r++) n[r] = o.charCodeAt(r);
                n.set(e, o.length);
                for (var l = new DataView(n['buffer']), h = a - 1, c = 4 + (h - 4 & -4) | 0, u = 255 ^ h, d = 0; h > 3;) i = 0 | Math.imul(l.getInt32(d, true), s), u = (0 | Math.imul(i >>> 24 ^ i, s)) ^ (0 | Math.imul(u, s)), h -= 4, d += 4;
                switch (h) {
                    case 3:
                        u = n[c + 2] << 16 ^ u, u = n[c + 1] << 8 ^ u;
                        break;
                    case 2:
                        u = n[c + 1] << 8 ^ u;
                        break;
                    case 1:
                        break;
                    default:
                        i = u;
                }
                return i != u && (i = 0 | Math.imul(n[c] ^ u, s)), i ^= u = i >>> 13, i = 0 | Math.imul(i, s), i ^= u = i >>> 15, console.log('[Legend mod Express] Generated client key:', i),window.generatedClientKey=i, i;
            }, 
            'shiftKey': function(t) {
                //if (window.disableIntegrity!=false){ //
                return t = 0 | Math.imul(t, 1540483477), t = 114296087 ^ (0 | Math.imul(t >>> 24 ^ t, 1540483477)), (t = 0 | Math.imul(t >>> 13 ^ t, 1540483477)) >>> 15 ^ t;
                //} //
                //else{ //
                //return 0; //	
                //} //
            },			
			*/
        "generateClientKey" : function(option, _relatedTarget) {
          if (!option.length || !_relatedTarget.byteLength) {
            return null;
		  }
          var j = null;
          var suggestedValue = 1540483477;
          var constraints = option.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
          var framesize = constraints.length + _relatedTarget.byteLength;
          var data = new Uint8Array(framesize);
          var value = 0;
          for (; value < constraints.length; value++) {
            data[value] = constraints.charCodeAt(value);
		  }
          data.set(_relatedTarget, constraints.length);
          var dv = new DataView(data["buffer"]);
          var maxTextureAvailableSpace = framesize - 1;
          var k = (maxTextureAvailableSpace - 4 & -4) + 4 | 0;
          var i = maxTextureAvailableSpace ^ 255;
          var n = 0;
          for (; maxTextureAvailableSpace > 3;) {
            j = Math.imul(dv['getInt32'](n, !![]), suggestedValue) | 0;
            i = (Math.imul(j >>> 24 ^ j, suggestedValue) | 0) ^ (Math.imul(i, suggestedValue) | 0);
            maxTextureAvailableSpace = maxTextureAvailableSpace - 4;
            n = n + 4;
		  }
          switch(maxTextureAvailableSpace) {
            case 3:
              i = data[k + 2] << 16 ^ i;
              i = data[k + 1] << 8 ^ i;
              break;
            case 2:
              i = data[k + 1] << 8 ^ i;
              break;
            case 1:
              break;
            default:
              j = i;
              break;
		  }
          if (j != i) {
            j = Math.imul(data[k] ^ i, suggestedValue) | 0;
		  }
          i = j >>> 13;
          j = i ^ j;
          j = Math.imul(j, suggestedValue) | 0;
          i = j >>> 15;
          j = i ^ j;
          console.log('[Legend mod Express] Generated client key:', j);
		  window.generatedClientKey=j;
          return j;
		  
        },	
        "shiftKey" : function(c) {
          var suggestedValue = 1540483477;
          c = Math.imul(c, suggestedValue) | 0;
          c = (Math.imul(c >>> 24 ^ c, suggestedValue) | 0) ^ 114296087;
          c = Math.imul(c >>> 13 ^ c, suggestedValue) | 0;
          return c >>> 15 ^ c;
        },		
        "shiftMessage" : function(PL$42, isSlidingUp, $cont) {
          if (!$cont) {
            var PL$41 = 0;
            for (; PL$41 < PL$42.byteLength; PL$41++) {
              PL$42["setUint8"](PL$41, PL$42.getUint8(PL$41) ^ isSlidingUp >>> PL$41 % 4 * 8 & 255);
            }
          } else {
            PL$41 = 0;
            for (; PL$41 < PL$42.length; PL$41++) {
              PL$42["writeUInt8"](PL$42["readUInt8"](PL$41) ^ isSlidingUp >>> PL$41 % 4 * 8 & 255, PL$41);
            }
          }
          return PL$42;
        },
		/*
            'shiftMessage': function(t, e, i) {
                //if (window.disableIntegrity!=false){ //
                if (i)
                    for (s = 0; s < t.length; s++) t.writeUInt8(t.readUInt8(s) ^ e >>> s % 4 * 8 & 255, s);
                else
                    for (var s = 0; s < t.byteLength; s++) t.setUint8(s, t.getUint8(s) ^ e >>> s % 4 * 8 & 255);
                return t;
                //} //
                //else{ //				
                //return t; //
                //} //
            },		*/	
            'decompressMessage': function(t) {
                var e = new o(t['buffer']);
                var i = new o(e.readUInt32LE(1));
                return a.decodeBlock(e.slice(5), i), i;
            },			
            'handleMessage': function(data) {
                var i = function() {
                        for (var e = '';;) {
                            var i = data.getUint8(s++);
                            if (0 == i) break;
                            e += String.fromCharCode(i);
                        }
                        return e;
                    },
                    s = 0,
                    o = data.getUint8(s++);
                switch (54 == o && (o = 53), o) {
					
					
					
					
					
					
					
                    case 5:
						console.log('[Legend mod Express] opcode: ', data.getUint8(0));
						window.testobjectsOpcode5 = data;			  			
                        break;
                    case 17:
						window.testobjectsOpcode17 = data;		
                        this.viewX = data.getFloat32(s, true);
						s += 4;
						this.viewY = data.getFloat32(s, true);
						s += 4;
						this.scale = data.getFloat32(s, true);
                        break;
                    case 18:
						window.testobjectsOpcode18 = data;	
                        if (this.protocolKey){ 
						this.protocolKey = this.shiftKey(this.protocolKey);
						}
						this.flushCellsData();
                        break;
                    case 32:
						window.testobjectsOpcode32 = data;	
                        this.playerCellIDs.push(data.getUint32(s, true));
						this.play || (this.play = true, ogarminimapdrawer.hideMenu(), this.playerColor = null, ogarminimapdrawer.onPlayerSpawn());
                        break;
                    case 50:
						window.testobjectsOpcode50 = data;	
                        this.pieChart = [];
                        var a = data.getUint32(s, true);
                        s += 4;
                        for (var n = 0; n < a; n++) this.pieChart.push(data.getFloat32(s, true)), s += 4;
                        ogarfooddrawer.drawPieChart();
                        break;
                    case 53:
						window.testobjectsOpcode53 = data;	
                        if (this['leaderboard'] = [], this.playerPosition = 0, 54 == data.getUint8(0)) {
                            data.getUint16(s, true);
                            s += 2;
                        }
                        for (var r = 0; s < data.byteLength;) {
                            var l = '';
                            var h = 0;
                            var c = false;
                            r++; 
							if (2 & (y = data.getUint8(s++))){ 
							l = window.decodeURIComponent(escape(i()));
							}
							if (4 & y){
							h = data.getUint32(s, true);
							s += 4;
							}
							if (8 & y){ 
							l = this.playerNick;
							h = 'isPlayer';
							this.playerPosition = r
							}
							if (16 & y){
							c = true;
							}
							this['leaderboard'].push({
                                'nick': l,
                                'id': h,
                                'isFriend': c
                            });
                        }
                        this['handleLeaderboard']();
                        break;
                    case 54:
						console.log('[Legend mod Express] opcode: ', data.getUint8(0));
						window.testobjectsOpcode54 = data;	
                        break;
                    case 69:
						window.testobjectsOpcode65 = data;	
                        var u = data.getUint16(s, true);
                        s += 2, this.ghostCells = [];
                        for (n = 0; n < u; n++) {
                            var d = data.getInt32(s, true);
                            s += 4;
                            var f = data.getInt32(s, true);
                            s += 4;
                            var m = data.getUint32(s, true);
                            s += 5;
                            var g = ~~Math.sqrt(100 * m);
                            this.ghostCells.push({
                                'x': d,
                                'y': f,
                                'size': g,
                                'mass': m,
                                'inView': this.isInView(d, f, g)
                            });
                        }
                        break;
                    case 85:
						window.testobjectsOpcode85 = data;	
                        console.log('[Legend mod Express] Captcha requested'); if(window.master && window.master.recaptchaRequested) { window.master.recaptchaRequested();}
                        break;
			  case 102:
              if (data.byteLength < 20) {
                //this["loggedIn"] = ![];
                //if (window["logout"]) {
                  //window["logout"]();
                //}
              }			  
			  if (data.buffer.byteLength>1000){
			  window.testobjects = data;			  
			  var sampleBytes = new Uint8Array(window.testobjects.buffer);
			  var enc = new TextDecoder();
			  window.testobjects2=enc.decode(sampleBytes);
			  window.agarioUID= window.testobjects2.split('$')[1].substr(0, 36);
			  window.agarioID = window.testobjects2.split('$')[1].split('')[1].split('')[0].replace(/\s/g, "");
			  window.googlePic = "https"+window.testobjects2.split('https')[1].split('H')[0]+"H";

				if (window.agarioUID != undefined) {
				localStorage.setItem("agarioUID", window.agarioUID);
				localStorage.setItem("agarioID", window.agarioID);
				}
				else{
				window.agarioUID=localStorage.getItem("agarioUID");
				window.agarioID=localStorage.getItem("agarioID");	
				}			  
			  }
			  
			  
			  
              window.ret = new Node(data, s);
			  
              var key_or_value = window.ret.readFlag();
              if (key_or_value == 1) {
                window.ret.setContentType();
              }
              key_or_value = window.ret.readFlag();
              if (key_or_value == 2) {
                window.ret.setUncompressedSize();
              }
              key_or_value = window.ret.readFlag();
              if (key_or_value == 1) {
                var obj = window.ret.readUint32();
                var previousState = window.ret.readFlag();
                var artistTrack = window.ret.readUint32();
                switch(obj) {
                  case 11:
                    console.log("[Legend mod Express] 102 Login response", window.ret.view.byteLength, window.ret.contentType, window.ret.uncompressedSize, obj, previousState, artistTrack);
                    break;
                  case 62:
                    console.log("[Legend mod Express] 102 Game over");
					//$('#pause-hud').text("PAUSE!");
                    break;
                  default:
                    console.log("[Legend mod Express] 102 Unknown", obj, previousState);
                }
              }
			  

            case 103:
			  window.testobjectsOpcode103 = data;	
              M["accessTokenSent"] = !![];
              break;			  
			  /*
                    case 102:
						//in here there are sent info about the user
						//searching how protocol works
						//console.log("data: " + data);
						window.testobjects=data;
						//console.log("data.getUint32: " + s);
						//console.log("data.getUint32: " + data.getUint32(s, true));
                        if (data.byteLength < 20 && window['logout']){
							window['logout']();
							}
                        break;
                    case 103:
                        this['loggedInTime'] = Date.now();
						this['accessTokenSent'] = true;
                        break;

					//jimboy3100's protocols	 112 & 113 NOT WORK
			case 112:
				
				const packet112 = data.byteLength + 2;
				
				
				for (let i = 0; i < data.byteLength; i++) data.writeUInt8(data.readUInt8(i), i);
				ogarminimapdrawer['writeUInt16LE'](this.id, data.byteLength);
				console.log(this.id);
				this['sendBuffer'](packet112);
				break;
				
			case 113:
				const botID = data.readUInt16LE(data.byteLength - 2);
				const packet113 = data.byteLength - 2;
				for (let i = 0; i < data.byteLength - 2; i++) packet113.writeUInt8(data.readUInt8(i), i);
				this['sendBuffer'](packet113);
				break;	
				///			

*/

                    case 112:
						console.log('[Legend mod Express] opcode: ', data.getUint8(0));
						window.testobjectsOpcode112 = data;	
						break;				
                    case 114:
						console.log('[Legend mod Express] opcode: ', data.getUint8(0));
						window.testobjectsOpcode114 = data;	
						break;
                    case 161:
						//console.log('[Legend mod Express] opcode: ', data.getUint8(0));
						window.testobjectsOpcode161 = data;	
                        break;
                    case 176:
						window.testobjectsOpcode176 = data;	
                        this.battleRoyale.startTime = data.getUint32(s, true);
                        break;
                    case 177:
						window.testobjectsOpcode177 = data;	
                        this.battleRoyale.joined = true;
                        break;
                    case 178:
						window.testobjectsOpcode178 = data;	
                        this.battleRoyale.players = data.getUint16(s, true), s += 2;
                        var y = data.getUint16(s, true);
                        s += 2, y || (this.battleRoyale.state = 0, this.battleRoyale.joined = false),
						3 & y && (this.battleRoyale.state = data.getUint8(s++),
						this.battleRoyale.x = data.getInt32(s, true),
						s += 4, this.battleRoyale.y = data.getInt32(s, true),
						s += 4, this.battleRoyale.radius = data.getUint32(s, true),
						s += 4, this.battleRoyale.shrinkTime = 1000 * data.getUint32(s, true),
						s += 4, this.battleRoyale.shrinkTime && 
						(this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 1000),
						this.battleRoyale.timeLeft < 0 && (this.battleRoyale.timeLeft = 0))),
						2 & y && (this.battleRoyale.targetX = data.getInt32(s, true), s += 4,
						this.battleRoyale.targetY = data.getInt32(s, true), s += 4, this.battleRoyale.targetRadius = data.getUint32(s, true));
                        break;
                    case 179:
						window.testobjectsOpcode179 = data;	
                        y = data.getUint8(s);
						window.decodeURIComponent(escape(i()));
                        y || window.decodeURIComponent(escape(i()));
                        break;
                    case 180:
						window.testobjectsOpcode181 = data;	
                        this.battleRoyale.joined = false;
						this.battleRoyale.rank = [];
						this.battleRoyale.playerRank = data.getUint32(s, true);
						s += 8;
                        var ogario1PlayerProfiles = data.getUint16(s, true);
                        s += 2;
                        for (n = 0; n < ogario1PlayerProfiles; n++) {
                            var ogarcopythelb = window.decodeURIComponent(escape(i())),
                                v = data.getUint32(s, true);
                            s += 4, this.battleRoyale.rank.push({
                                'place': v,
                                'name': ogarcopythelb
                            });
                        }
                        break;
            case 226:
			  window.testobjectsOpcode226 = data;	
              var extraOptions = data["getUint16"](1, !![]);
              data = this["createView"](3);
              data["setUint8"](0, 227);
              data["setUint16"](1, extraOptions);
              this["sendMessage"](data);
              break;
                    case 241:
						window.testobjectsOpcode241 = data;	
                        this.protocolKey = data.getUint32(s, true);
						console.log('[Legend mod Express] Received protocol key:', this.protocolKey);
                        var irenderfromagario = new Uint8Array(data['buffer'], s += 4);
                        this.clientKey = this['generateClientKey'](this.ws, irenderfromagario);
						if (window.master && window.master.login){ 
						window.master.login();
						}
                        break;
                    case 242:
						window.testobjectsOpcode242 = data;	
                        this['serverTime'] = 1000 * data.getUint32(s, true);
						this.serverTimeDiff = Date.now() - this['serverTime'];
                        break;
                    case 255:
						window.testobjectsOpcode255 = data;	
                        this['handleSubmessage'](data);
                        break;
                    default:
                        console.log('[Legend mod Express] Unknown opcode:', data.getUint8(0));
                }
            },			
            'handleSubmessage': function(t) {
                var e = 0;
                switch ((t = this['decompressMessage'](t)).readUInt8(e++)) {
                    case 16:
                        this.updateCells(t, e);
                        break;
                    case 64:
                        this.viewMinX = t.readDoubleLE(e);
						e += 8; this.viewMinY = t.readDoubleLE(e);
						e += 8; this.viewMaxX = t.readDoubleLE(e);
						e += 8; this.viewMaxY = t.readDoubleLE(e);
						this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                        break;
                    default:
                        console.log('[Legend mod Express] Unknown sub opcode:', t.readUInt8(0));
                }
            },
            'handleLeaderboard': function() {
                /*                for (var t = '', e = '', i = 0; i < this['leaderboard'].length && window.leaderboardlimit != i; i++) {
                                    var s = '<span>';
                                    'isPlayer' === this['leaderboard'][i].id ? s = '<span class=\"me\">' : ogarcopythelb.clanTag.length && 0 == this['leaderboard'][i].nick.indexOf(ogarcopythelb.clanTag) && (s = '<span class=\"teammate\">'), t += s + (i + 1) + '. ' + ogarminimapdrawer.escapeHTML(this['leaderboard'][i].nick) + '</span>';
                                } */
                window.teammatenicks = [];
				window.teammatelegendmodnicks = [];
                for (i = 0; i < legendmod3.top5.length; i++) {
                    window.teammatelegendmodnicks.push(legendmod3.top5[i].nick);
                }
				window.teammatenicks = window.teammatelegendmodnicks;
                if (window.agartoolteammatenicks != undefined) {
                    window.teammatenicks = window.teammatenicks.concat(window.agartoolteammatenicks);
                }
                for (var t = '', e = '', i = 0; i < this['leaderboard'].length && window.leaderboardlimit != i; i++) {
                    var s = '<span>';
                    'isPlayer' === this['leaderboard'][i].id ? s = '<span class=\"me\">' : ogarcopythelb.clanTag.length && 0 != window.teammatenicks.includes(this['leaderboard'][i].nick) && (s = '<span class=\"teammate\">'), t += s + (i + 1) + '. ' + ogarminimapdrawer.escapeHTML(this['leaderboard'][i].nick) + '</span>';
                }
                if (this.playerPosition > window.leaderboardlimit && (t += '<span class=\"me\">' + this.playerPosition + '. ' + ogarminimapdrawer.escapeHTML(this.playerNick) + '</span>'), v['showLbData']);
                t += '<span class="me">Total: ' + this.leaderboard.length + '</span>';
                for (var o = 0; o < this.ghostCells.length && o != i; o++) e += '<span class=\"lb-data\" id= "' + 'leaderboardtargeting' + o + '" style="pointer-events: auto;" onclick="window.legendmod.targetingLead(' + o + ');">', e += '<span class=\"top5-mass-color\">[' + ogarminimapdrawer['shortMassFormat'](this.ghostCells[o].mass) + ']</span>', e += '<span class=\"hud-main-color\">[' + ogarminimapdrawer['calculateMapSector'](this.ghostCells[o].x, this.ghostCells[o].y) + ']</span>', e += '</span>';
				ogarminimapdrawer['displayLeaderboard'](t, e);
                ///////////////// establish core.registerSkin
                if (window.vanillaskins == true) {
                    if (window.customskinsname != null && window.customskinsname != undefined) {
                        for (i = 0; i <= this['leaderboard'].length - 1; i++) {
                            if (this['leaderboard'][i].nick == window.customskinsname) {
                                ogarminimapdrawer.customSkinsMap[window.customskinsname] = window.customskinsurl;
                                ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, window.customskinsurl);
                                window.customskinsname = undefined;
                            }
                        }
                    }
                }

            },		
            'targetingLead': function(o) {			
			window.targetingLeadX=legendmod.ghostCells[o].x;
			window.targetingLeadY=legendmod.ghostCells[o].y;
			legendmod.drawCommander2=true;
            },			
            'flushCellsData': function() {
                this.indexedCells = {}, 
				this.cells = []; 
				this.playerCells = []; 
				this.playerCellIDs = []; 
				this.ghostCells = [];
				this.food = [];
				this.viruses = [];
            },
            'setMapOffset': function(t, e, i, s) {
                if (i - t > 14000 && s - e > 14000){
				
				this.mapOffsetX= this.mapOffset - i; 
				this.mapOffsetY = this.mapOffset - s; 
				this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX);
				this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY);
				this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX);
				this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY);
				this.mapOffsetFixed|| (this.viewX = (i + t) / 2, this.viewY = (s + e) / 2);
				this.mapOffsetFixed= true;
				console.log('[Legend mod Express] Map offset fixed (x, y):', this.mapOffsetX, this.mapOffsetY);
				}
			},
            'isInView': function(t, e, i) {
                var s = this.canvasWidth / 2 / this.scale,
                    o = this.canvasHeight / 2 / this.scale;
					//console.log("t:" + t + " e:" + e + " i:" + i  + " result:" + !(t + i < this.viewX - s || e + i < this.viewY - o || t - i > this.viewX + s || e - i > this.viewY + o));
                return !(t + i < this.viewX - s || e + i < this.viewY - o || t - i > this.viewX + s || e - i > this.viewY + o);
            },
            'updateCells': function(t, i) {
                var s = function() {
                    for (var e = '';;) {
                        var s = t.readUInt8(i++);
                        if (0 == s) break;
                        e += String.fromCharCode(s);
                    }
                    return e;
                };
                this.time = Date.now(), this.removePlayerCell = false;
                var o = t.readUInt16LE(i);
                i += 2;
                for (var a = 0; a < o; a++) {
                    var n = this.indexedCells[t.readUInt32LE(i)],
                        r = this.indexedCells[t.readUInt32LE(i + 4)];
                    if (i += 8, n && r){ 
					r.targetX = n.x; 
					r.targetY = n.y; 
					r.targetSize = r.size;
					r.time = this.time;
					r.removeCell();
					}
                }
                for (a = 0;;) {
                    var l = t.readUInt32LE(i);
                    if (i += 4, 0 == l) break;
                    var h = t.readInt32LE(i);
                    i += 4;
                    var c = t.readInt32LE(i);
                    i += 4;
                    var u = t.readUInt16LE(i);
                    i += 2;
                    var d = t.readUInt8(i++),
                        f = 0;
                    128 & d && (f = t.readUInt8(i++));
                    var m = null,
                        g = null,
                        y = '';
                    if (2 & d) {
                        var ogario1PlayerProfiles = t.readUInt8(i++),
                            ogarcopythelb = t.readUInt8(i++),
                            irenderfromagario = t.readUInt8(i++);
                        m = this.rgb2Hex(~~(0.9 * ogario1PlayerProfiles), ~~(0.9 * ogarcopythelb), ~~(0.9 * irenderfromagario));
                    }

                    //4 & d && (g = s()),
                    //8 & d && (y = window.decodeURIComponent(escape(s())));
                    if (4 & d) {
                        g = s();
                        //						console.log('skin '+g);

                    }
                    if (8 & d) {
                        y = window.decodeURIComponent(escape(s()));
                        if (g != null) {
                            if (window.vanillaskins == true) {
                                var skin2search = g.replace('%', '');
                                if (window.LMAgarGameConfiguration != undefined) {
                                    for (var player = 0; player < window.EquippableSkins.length; player++) {
                                        if (window.EquippableSkins[player].productId == "skin_" + skin2search) {
                                            //console.log("Player: " + y + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);
                                            if (ogarminimapdrawer.customSkinsMap[y] == undefined) {
                                                if (window.EquippableSkins[player].image != "uses_spine") {

                                                    if (legendflags.includes(LowerCase(y))) {
                                                        console.log("[Legend mod Express] " + LowerCase(y) + " skin found. Skin registered");
                                                        core.registerSkin(y, null, "https://jimboy3100.github.io/agario/live/flags/" + LowerCase(y) + ".png", null);
                                                    } else {
                                                        ogarminimapdrawer.customSkinsMap[y] = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image;
                                                        ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //8 & d && (y = window.decodeURIComponent(escape(s())));
                    var M = 1 & d,
                        ogarioset1final = 1 & f,
                        ogariocellssetts = null;
                    this.indexedCells.hasOwnProperty(l) ? (ogariocellssetts = this.indexedCells[l], m && (ogariocellssetts.color = m)) : ((ogariocellssetts = new ogarbasicassembly(l, h, c, u, m, ogarioset1final, M, false, v.shortMass, v.virMassShots)).time = this.time, ogarioset1final ? this.food.push(ogariocellssetts) : (M && v['virusesRange'] && this.viruses.push(ogariocellssetts), this.cells.push(ogariocellssetts), -1 != this.playerCellIDs.indexOf(l) && -1 == this.playerCells.indexOf(ogariocellssetts) && (ogariocellssetts['isPlayerCell'] = true, this.playerColor = m, this.playerCells.push(ogariocellssetts))), this.indexedCells[l] = ogariocellssetts), ogariocellssetts['isPlayerCell'] && (y = this.playerNick), y && (ogariocellssetts.targetNick = y), ogariocellssetts.targetX = h, ogariocellssetts.targetY = c, ogariocellssetts.targetSize = u, ogariocellssetts['isFood'] = ogarioset1final, ogariocellssetts['isVirus'] = M, g && (ogariocellssetts['skin'] = g), 4 & f && (t.readUInt32LE(i), i += 4);
                }
                for (o = t.readUInt16LE(i), i += 2, a = 0; a < o; a++) {
                    l = t.readUInt32LE(i);
                    i += 4, (ogariocellssetts = this.indexedCells[l]) && ogariocellssetts.removeCell();
                }
                this.removePlayerCell && !this.playerCells.length && (this.play = false, ogarminimapdrawer['onPlayerDeath'](), ogarminimapdrawer.showMenu(300));
                if (window.autoPlay && legendmod.play) {this.calcTarget();}
            },
            'color2Hex': function(t) {
                var e = t.toString(16);
                return 1 == e.length ? '0' + e : e;
            },
            'rgb2Hex': function(t, e, i) {
                return '#' + this.color2Hex(t) + this.color2Hex(e) + this.color2Hex(i);
            },
            'sortCells': function() {
                this.cells.sort(function(t, e) {
                    return t.size == e.size ? t.id - e.id : t.size - e.size;
                });
            },
            'calculatePlayerMassAndPosition': function() {
                for (var t = 0, e = 0, i = 0, s = 0, o = this.playerCells.length, a = 0; a < o; a++) {
                    var n = this.playerCells[a];
                    t += n.size;
					e += n.targetSize * n.targetSize;
					i += n.x / o; 
					s += n.y / o;
                }
                this.viewX = i; 
				this.viewY = s; 
				this.playerSize = t; 
				this.playerMass = ~~(e / 100);
				this.recalculatePlayerMass();
            },
            'recalculatePlayerMass': function() {
                if (this.playerScore = Math.max(this.playerScore, this.playerMass),
				v['virColors'] || v['splitRange'] || v['oppColors'] || v['oppRings'] || v['showStatsSTE']) {
                    var t = this.playerCells;
                    var e = t.length;
                    t.sort(function(t, e) {
                        return t.size == e.size ? t.id - e.id : t.size - e.size;
                    }); 
					this.playerMinMass = ~~(t[0].size * t[0].size / 100);
					this.playerMaxMass = ~~(t[e - 1].size * t[e - 1].size / 100);
					this.playerSplitCells = e;
                }
                if (v['showStatsSTE']) {
                    var i = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                    this['STE'] = i > 35 ? ~~(i * (i < 1000 ? 0.35 : 0.38)) : null;
                }
            },
            'compareCells': function() {
                if (this.play && (v.oppColors || v.oppRings || v.splitRange)) {
                    if (v.oppRings || v.splitRange) {
                        this.biggerSTECellsCache = [];
                        this.biggerCellsCache = [];
                        this.smallerCellsCache = [];
                        this.STECellsCache = [];
                    }
                    var t = 0;
                    for (; t < this.cells.length; t++) {
                        var e = this.cells[t];
                        if (!e.isVirus) {
							//console.log(i); i for food is 13
                            var i = ~~(e.size * e.size / 100);
							if (i != 13){
                            var s = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                            var o = i / s;
                            var a = s < 1000 ? 0.35 : 0.38;
                            if (v.oppColors && !v.oppRings) {
								
									e.oppColor = this.setCellOppColor(e.isPlayerCell, o, a);
								
                            }
                            if (!(e.isPlayerCell || !v.splitRange && !v.oppRings)) {
                                this.cacheCells(e.x, e.y, e.size, o, a);
                            }
						}
                        }
                    }
                }
            },
            'cacheCells': function(t, e, i, s, o) {
                return s >= 2.5 ? void this.biggerSTECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 1.25 ? void this.biggerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s < 1.25 && s > 0.75 ? void 0 : s > o ? void this.smallerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : void this.STECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                });
            },
            'setCellOppColor': function(t, e, i) {
                return t ? ogarcopythelb.color : e > 11 ? '#FF008C' : e >= 2.5 ? '#BE00FF' : e >= 1.25 ? '#FF0A00' : e < 1.25 && e > 0.75 ? '#FFDC00' : e > i ? '#00C8FF' : '#64FF00';
            },
            'getCursorPosition': function() {
                this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX; 
				this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale + this.viewY;
            },
            'setZoom': function(t) {
                //t.preventDefault(), this.zoomValue *= Math.pow(v.zoomSpeedValue2, t.wheelDelta / -120 || t.detail || 0), this.zoomValue > 4 / this.viewScale && (this.zoomValue = 4 / this.viewScale);
                this.zoomValue *= Math.pow(v.zoomSpeedValue2+1, t.wheelDelta / -120 || t.detail || 0);
				if (this.zoomValue > 4 / this.viewScale){
				this.zoomValue = 4 / this.viewScale;
				}
            },
            'setTargetPosition': function(t, e) {
                this.targetX = t - this.mapOffsetX;
				this.targetY = e - this.mapOffsetY;
				this.targetDistance = Math.round(Math.sqrt(Math.pow(this.playerX - this.targetX, 2) + Math.pow(this.playerY - this.targetY, 2)));
				window.targetDistance=this.targetDistance;
            },
            'resetTargetPosition': function() {
                this.targetX = this.playerX;
				this.targetY = this.playerY;
            },
            'setKeys': function() {
                var t = this;
                document.onkeydown = function(e) {
                    var i = e.keyCode;
                    if (!t.pressedKeys[i]) switch (i) {
                        case 13:
                            t.sendNick('');
                            break;
                        case 32:
                            t.sendSplit();
                            break;
                        case 81:
                            t.sendFreeSpectate();
                            break;
                        case 83:
                            t.sendSpectate();
                            break;
                        case 87:
                            t.sendEject();
                    }
                }, document.onkeyup = function(e) {
                    t.pressedKeys[e.keyCode] = false;
                };
            },
            'init': function() {
                var t = this;
                /firefox/i.test(navigator.userAgent) ? document.addEventListener('DOMMouseScroll', function(e) {
                    t.setZoom(e);
                }, false) : document.body.onmousewheel = function(e) {
                    t.setZoom(e);
                }, setInterval(function() {
                    t.sendPosition();
                }, 40), window.master && window.master.clientVersion && this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
            }
        };
        window.legendmod = M; // look at this

        window.sendAction = function(t) {
            M.sendAction(t);
        };
        var ogarfooddrawer = {
                'canvas': null,
                'ctx': null,
                'canvasWidth': 0,
                'canvasHeight': 0,
                'camX': 0,
                'camY': 0,
                'scale': 1,
                'fpsLastRequest': null,
                'renderedFrames': 0,
                'fps': 0,
                'pi2': 2 * Math.PI,
                'battleAreaMap': null,
                'battleAreaMapCtx': null,
                'pieChart': null,
                'pellet': null,
                'indicator': null,
                'setCanvas': function() {
                    this.canvas = document.getElementById('canvas');
					this.ctx = this.canvas.getContext('2d');
					this.canvas.onmousemove = function(t) {
                        M.clientX = t.clientX; 
						M.clientY = t.clientY; 
						M.getCursorPosition();
                    };
                },
                'resizeCanvas': function() {
                    this.canvasWidth = window.innerWidth;
					this.canvasHeight = window.innerHeight; 
					this.canvas.width = this.canvasWidth; 
					this.canvas.height = this.canvasHeight; 
					M.canvasWidth = this.canvasWidth;
					M.canvasHeight = this.canvasHeight; 
					this.renderFrame();
                },
                'setView': function() {
                    this.setScale(),
                        M.playerCells.length ?
                        (M.calculatePlayerMassAndPosition(),
                            //					this.camX += (M.viewX - this.camX) / 2,
                            //					this.camY += (M.viewY - this.camY) / 2) :
                            this.camX = (this.camX + M.viewX) / 2,
                            this.camY = (this.camY + M.viewY) / 2) :
                        (this.camX = (29 * this.camX + M.viewX) / 30,
                            this.camY = (29 * this.camY + M.viewY) / 30),
                        M.playerX = this.camX, M.playerY = this.camY;
                },
                'setScale': function() {
                    if (!M.autoZoom) return this.scale = (9 * this.scale + this.getZoom()) / 10, void(M.viewScale = this.scale);
                    M.play ? this.scale = (9 * this.scale + Math.pow(Math.min(64 / M.playerSize, 1), 0.4) * this.getZoom()) / 10 : this.scale = (9 * this.scale + M.scale * this.getZoom()) / 10, M.viewScale = this.scale;
                },
                'getZoom': function() {
                    return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * M.zoomValue;
                },
/*                'renderFrame': function() {
                    //for (M.time = Date.now(), e = 0; e < M.cells.length; e++) M.cells[e].moveCell();
				    M.time = Date.now();
						for (i = 0; i < M.cells.length; i++) {
							M.cells[i].moveCell();
						}	
                    if (this['setView'](), M.getCursorPosition(), M['sortCells'](), M['compareCells'](), this.ctx['clearRect'](0, 0, this.canvasWidth, this.canvasHeight), v['showGrid'] && this['drawGrid'](this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY), this.ctx['save'](), this.ctx['translate'](this.canvasWidth / 2, this.canvasHeight / 2), this.ctx.scale(this.scale, this.scale), this.ctx['translate'](-this.camX, -this.camY), v['showBgSectors'] && this.drawSectors(this.ctx, M.mapOffsetFixed, g.sectorsX, g.sectorsY, M.mapMinX, M.mapMinY, M.mapMaxX, M.mapMaxY, g['gridColor'], g['sectorsColor'], g['sectorsWidth'], true), ':battleroyale' === M.gameMode && this['drawBattleArea'](this.ctx), v['showMapBorders']) {
                        var t = g['bordersWidth'] / 2;
                        this['drawMapBorders'](this.ctx, M.mapOffsetFixed, M.mapMinX - t, M.mapMinY - t, M.mapMaxX + t, M.mapMaxY + t, g['bordersColor'], g['bordersWidth']);
                    }
                    this.drawCommander();
                    v['virusesRange'] && this['drawVirusesRange'](this.ctx, M.viruses), this['drawFood'](), M.play && (v['splitRange'] && this['drawSplitRange'](this.ctx, M.biggerSTECellsCache, M.playerCells, M.selectBiggestCell), v['oppRings'] && this['drawOppRings'](this.ctx, this.scale, M.biggerSTECellsCache, M.biggerCellsCache, M.smallerCellsCache, M.STECellsCache), v['cursorTracking'] && this['drawCursorTracking'](this.ctx, M.playerCells, M.cursorX, M.cursorY)), this['drawGhostCells']();
                    for (var e = 0; e < M['removedCells'].length; e++) M['removedCells'][e].draw(this.ctx, true);
                    for (e = 0; e < M.cells.length; e++) M.cells[e].draw(this.ctx);
                    this.ctx['restore'](), ':teams' === M.gameMode && this.pieChart && this.pieChart.width && this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
                }, */
        'renderFrame': function () {
            //this.ctx.start2D();
            M.time = Date.now();
            for (i = 0; i < M.cells.length; i++) {
                M.cells[i].moveCell();
            }
            this.setView();
            M.getCursorPosition();
            M.sortCells();
            M.compareCells();
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            if (v.showGrid) {
                this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
            }
            this.ctx.save();
            this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.translate(-this.camX, -this.camY);
            if (v.showBgSectors) {
                this.drawSectors(this.ctx, M.mapOffsetFixed, g.sectorsX, g.sectorsY, M.mapMinX, M.mapMinY, M.mapMaxX, M.mapMaxY, g.gridColor, g.sectorsColor, g.sectorsWidth, true);
            }
            if (M.gameMode === ':battleroyale') {
                this.drawBattleArea(this.ctx);
            }
            if (v.showMapBorders) {
                var _0x6993ee = g.bordersWidth / 2;
                this.drawMapBorders(this.ctx, M.mapOffsetFixed, M.mapMinX - _0x6993ee, M.mapMinY - _0x6993ee, M.mapMaxX + _0x6993ee, M.mapMaxY + _0x6993ee, g.bordersColor, g.bordersWidth);
            }
			this.drawCommander();
			this.drawCommander2();
            if (v.virusesRange) {
                this.drawVirusesRange(this.ctx, M.viruses);
            }
            this.drawFood();
            if (M.play) {
                if (v.splitRange) {
                    this.drawSplitRange(this.ctx, M.biggerSTECellsCache, M.playerCells, M.selectBiggestCell);
					//console.log(M.playerCells[M.selectBiggestCell.length-1].size);
					this.drawDoubleSplitRange(this.ctx, M.biggerSTECellsCache, M.playerCells, M.selectBiggestCell);
                }
                if (v.oppRings) {
                    this.drawOppRings(this.ctx, this.scale, M.biggerSTECellsCache, M.biggerCellsCache, M.smallerCellsCache, M.STECellsCache);
					
                }
                if (v.cursorTracking) {
                    this.drawCursorTracking(this.ctx, M.playerCells, M.cursorX, M.cursorY);
                }
            }

            this.drawGhostCells();
            
            for (var i = 0; i < M.removedCells.length; i++) {
                M.removedCells[i].draw(this.ctx, true);
            }

            //lylko
           v.jellyPhisycs && M.updateQuadtree(M.cells);//

            for (i = 0; i < M.cells.length; i++) {

                if(v.jellyPhisycs){
                    M.cells[i].updateNumPoints();
                    M.cells[i].movePoints();
                }

                M.cells[i].draw(this.ctx);


                if(ogarfooddrawer.LMB && this.pointInCircle(M.cursorX, M.cursorY, M.cells[i].x, M.cells[i].y, M.cells[i].size)){
                   M.selected = M.cells[i].id
                   //this.drawRing(this.ctx,M.cells[i].x,M.cells[i].y,M.cells[i].size,0.75,'#ffffff')
                }
            }
            M.indexedCells[M.selected] && this.drawRing(this.ctx,
                M.indexedCells[M.selected].x,
                M.indexedCells[M.selected].y,
                M.indexedCells[M.selected].size,
            0.75,'#ffffff')
            
            if(ogarfooddrawer.RMB && M.indexedCells[M.selected] && M.playerCellIDs.length){
                var index = M.selectBiggestCell ? M.playerCells.length - 1 : 0;
                //ctx.arc(playerCells[index].x, playerCells[index].y, playerCells[index].size + 0x2f8, 0, this.pi2, false);
                if(M.playerCells[index] == undefined) return;
                var xc = M.playerCells[index].targetX//.x
                var yc = M.playerCells[index].targetY//.y
                
                var x = M.indexedCells[M.selected].targetX//.x
                var y = M.indexedCells[M.selected].targetY//.y
                
                var a = xc - x
                var b = yc - y
                var distance = Math.sqrt( a*a + b*b ) - (M.indexedCells[M.selected].size+M.playerCells[index].size)
                
                var ang = Math.atan2(y - yc, x - xc);
             
                M.cursorX= xc +(Math.cos(ang)*distance)
                M.cursorY= yc +(Math.sin(ang)*distance)
                M.sendPosition()
                //console.log(xc,yc,x,y,M.cursorX,M.cursorY)
                //Math.deg(ang)

                
                /*var xc = M.playerCells[index].x,
                    yc = M.playerCells[index].y,*/
                //R = 100000000,
                /*ang = Math.atan2(M.indexedCells[M.selected].y - yc, M.indexedCells[M.selected].x - xc);
                M.cursorX= Math.cos(ang)
                M.cursorY= Math.sin(ang)*/
                //Math.deg(ang)

                //M.cursorX = M.indexedCells[M.selected].x
                //M.cursorY = M.indexedCells[M.selected].y
            }


            this.ctx.restore();
            if (M.gameMode === ':teams') {
                if (this.pieChart && this.pieChart.width) {				
                    this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 0xa, 0xa);
                }
            }
            //this.ctx.finish2D();
        },		
        pointInCircle: function(x, y, cx, cy, radius) {
            var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            return distancesquared <= radius * radius;
        },
        drawRing : function (ctx, x, y, size, alpha, color) {
            ctx.lineWidth = 20;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, size-10, 0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            
            ctx.globalAlpha = 1;
        },

		
                'drawGrid': function(t, e, i, s, o, a) {
                    var n = e / s;
                    var r = i / s;
                    var l = (n / 2 - o) % 50;
                    var h = (r / 2 - a) % 50;
                    t.strokeStyle = g.gridColor, t.globalAlpha = 1 * s, t.beginPath();
                    for (; l < n; l = l + 50) {
                        t.moveTo(l * s - 0.5, 0);
                        t.lineTo(l * s - 0.5, r * s);
                    }
                    for (; h < r; h = h + 50) {
                        t.moveTo(0, h * s - 0.5);
                        t.lineTo(n * s, h * s - 0.5);
                    }
                    t.stroke(), t.globalAlpha = 1;
                },
                'drawSectors': function(t, e, i, s, o, a, n, r, l, h, c, u) {
                    if (e || !u) {
                        var d = ~~((n - o) / i);
                        var f = ~~((r - a) / s);
                        var m = 0;
                        var y = 0;
                        if (t.strokeStyle = l, t.fillStyle = h, t.lineWidth = c, u || !u && v["showMiniMapGrid"]) {
                            t.beginPath();
                            var ogario1PlayerProfiles = 0;
                            for (; ogario1PlayerProfiles < i + 1; ogario1PlayerProfiles++) {
                                m = o + d * ogario1PlayerProfiles;
                                t.moveTo(ogario1PlayerProfiles == i ? n : m, a);
                                t.lineTo(ogario1PlayerProfiles == i ? n : m, r);
                            }
                            ogario1PlayerProfiles = 0;
                            for (; ogario1PlayerProfiles < s + 1; ogario1PlayerProfiles++) {
                                y = a + f * ogario1PlayerProfiles;
                                t.moveTo(o - c / 2, ogario1PlayerProfiles == s ? r : y);
                                t.lineTo(n + c / 2, ogario1PlayerProfiles == s ? r : y);
                            }
                            t.stroke();
                        } else {
                            this.drawMapBorders(t, e, o, a, n, r, l, c);
                        }
                        t.font = u ? g.sectorsFontWeight + " " + g.sectorsFontSize + "px " + g.sectorsFontFamily : g.miniMapFontWeight + " " + ~~(0.4 * f) + "px " + g.miniMapFontFamily;
                        t.textAlign = "center";
                        t.textBaseline = "middle";
                        ogario1PlayerProfiles = 0;
                        for (; ogario1PlayerProfiles < s; ogario1PlayerProfiles++) {
                            var ogarcopythelb = 0;
                            for (; ogarcopythelb < i; ogarcopythelb++) {
                                var ogarminimapdrawer = String.fromCharCode(65 + ogario1PlayerProfiles) + (ogarcopythelb + 1);
                                m = ~~(o + d / 2 + ogarcopythelb * d);
                                y = ~~(a + f / 2 + ogario1PlayerProfiles * f);
                                t.fillText(ogarminimapdrawer, m, y);
                            }
                        }
                    }
                },
                "drawCommander": function() {
					//console.log('Special effects stage 2');
                    if (M.drawCommander) {
                        var pickerAxes = this.ctx;
                        cimg = new Image;
                        cimg.src = g.commanderImage;
                        cimg1 = new Image;
                        cimg1.src = g.commanderImage1;
                        cimg2 = new Image;
                        cimg2.src = g.commanderImage2;
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(M.cAngle);
                        pickerAxes.drawImage(cimg, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(M.cAngle1);
                        pickerAxes.drawImage(cimg1, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(M.cAngle2);
                        pickerAxes.drawImage(cimg2, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.globalAlpha = 1;
                        this.updateCommander();
                    }
                },				
                "drawCommander2": function() {
					//console.log('Special effects stage 2');
                    if (M.drawCommander2) {
                        var pickerAxes = this.ctx;
                        cimg = new Image;
                        cimg.src = g.commanderImage3;
                        cimg1 = new Image;
                        cimg1.src = g.commanderImage4;
                        cimg2 = new Image;
                        cimg2.src = g.commanderImage5;
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(M.cAngle);
                        pickerAxes.drawImage(cimg, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(M.cAngle1);
                        pickerAxes.drawImage(cimg1, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = M.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(M.cAngle2);
                        pickerAxes.drawImage(cimg2, -M.cRadius / 2, -M.cRadius / 2, M.cRadius, M.cRadius);
                        pickerAxes.restore();
                        pickerAxes.globalAlpha = 1;
                        this.updateCommander();
                    }
                },
                "updateCommander": function() {
                    M.cRadius += 7;
                    M.cAngle += .007;
                    M.cAngle1 -= .006;
                    M.cAngle2 += .003;
                    if (2025 <= M.cRadius) {
                        M.cAlpha *= .95;
                    }
                    if (1E-4 >= M.cAlpha) {
                        this.resetCommander();
                    }
                },
                "resetCommander": function() {
                    M.cRadius = 10; //M.clientX
                    M.cAngle = 4;
                    M.cAngle1 = 0;
                    M.cAngle2 = 0;
                    M.cAlpha = 1;
                    M.drawCommander = false;
					M.drawCommander2 = false;
                    i.spawnX = 0;
                    i.spawnY= 0;
                },
                /*			
                'drawMapBorders': function(t, e, i, s, o, a, n, r) {
                    e && (t.strokeStyle = n, t.lineWidth = r, t.beginPath(), t.moveTo(i, s), t.lineTo(o, s), t.lineTo(o, a), t.lineTo(i, a), t.closePath(), t.stroke());
                },
				*/
                "drawMapBorders": function(ctx, macros, text, x1, x0, y0, radius, canvas) {
                    if (macros) {
                        ctx.strokeStyle = radius;
                        ctx.lineWidth = canvas;
                        ctx.beginPath();
                        ctx.moveTo(text, x1);
                        ctx.lineTo(x0, x1);
                        ctx.lineTo(x0, y0);
                        ctx.lineTo(text, y0);
                        if (v.borderGlow) {
                            ctx.shadowBlur = g.borderGlowSize;
                            ctx.shadowColor = g.borderGlowColor;
                        } else {
                            "skrrt";
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                    if (v.borderGlow) {
                        ctx.shadowBlur = 0;
                    } else {
                        "skrrt";
                    }
                },
                'drawVirusesRange': function(t, e, i) {
                    if (e.length) {
                        t.beginPath();
                        for (var s = 0; s < e.length; s++) {
                            var o = e[s].x,
                                a = e[s].y;
                            t.moveTo(o, a), t.arc(o, a, e[s].size + 820, 0, this.pi2, false);
                        }
                        t.fillStyle = g.virusColor, t.globalAlpha = 0.1, t.fill(), t.globalAlpha = 1, i && (e = []);
                    }
                },
                'drawFood': function() {
                    if (M.showFood && !(v.autoHideFoodOnZoom && this.scale < 0.2)) {
                        if (v.autoHideFood && !M.foodIsHidden && M.playerMass > 1000) return M.showFood = false, void(M.foodIsHidden = true);
                        if (v.rainbowFood)
                            for (var t = 0; t < M.food.length; t++) M.food[t].moveCell(), M.food[t].draw(this.ctx);
                        else this.drawCachedFood(this.ctx, M.food, this.scale);
                    }
                },
                'drawCachedFood': function(t, e, i, s) {
                    if (e.length) {
                        if (v.optimizedFood && this.pellet)
                            for (var o = 0; o < e.length; o++) {
                                var a = e[o].x - 10 - g.foodSize,
                                    n = e[o].y - 10 - g.foodSize;
                                t.drawImage(this.pellet, a, n);
                            } else {
                                t.beginPath();
                                for (o = 0; o < e.length; o++) {
                                    a = e[o].x, n = e[o].y;
                                    if (t.moveTo(a, n), i < 0.16) {
                                        var r = e[o].size + g.foodSize;
                                        t.rect(a - r, n - r, 2 * r, 2 * r);
                                    } else t.arc(a, n, e[o].size + g.foodSize, 0, this.pi2, false);
                                }
                                t.fillStyle = g.foodColor, t.globalAlpha = 1, t.fill();
                            }
                        s && (e = []);
                    }
                },
                'drawSplitRange': function(t, e, i, s, o) {
                    if (this.drawCircles(t, e, 760, 4, 0.4, '#BE00FF'), i.length) {
                        var a = s ? i.length - 1 : 0;						
                        t.lineWidth = 6, t.globalAlpha = g.darkTheme? 0.7 : 0.35, t.strokeStyle = g.splitRangeColor, t.beginPath(), t.arc(i[a].x, i[a].y, i[a].size + 760, 0, this.pi2, false), t.closePath(), t.stroke();
                    }
                    t.globalAlpha = 1, o && (e = []);
                },
                'drawDoubleSplitRange': function(t, e, i, s, o) {
                    if (this.drawCircles(t, e, 760, 4, 0.4, '#BE00FF'), i.length) {
						//this.drawSplitRange(this.ctx, M.biggerSTECellsCache, M.playerCells, M.selectBiggestCell);
						
                        var a = s ? i.length - 1 : 0;
						//console.log(i[a].size);
						if (i[a].size>=400){
                        t.lineWidth = 6, 
						t.globalAlpha = g.darkTheme? 0.7 : 0.35, 
						t.strokeStyle = g.splitRangeColor; 
						t.beginPath(); 
						t.arc(i[a].x, i[a].y, 2*i[a].size + 760, 0, this.pi2, false); 
						t.closePath(); 
						t.stroke();
						}
				   }
                    t.globalAlpha = 1; 
					if (o){ e = [];
					}
                },				
                'drawOppRings': function(t, e, i, s, o, a, n) {
                    var r = 14 + 2 / e;
                    var l = 12 + 1 / e;
                    this.drawCircles(t, i, r, l, 0.75, '#BE00FF');
					this.drawCircles(t, s, r, l, 0.75, '#FF0A00');
					this.drawCircles(t, o, r, l, 0.75, '#00C8FF');
					this.drawCircles(t, a, r, l, 0.75, '#64FF00');
					if(n){
						i = [], s = [], o = [], a = [];
					}
                },
                'drawCursorTracking': function(t, e, i, s) {
                    t.lineWidth = 4, t.globalAlpha = g.darkTheme? 0.75 : 0.35, t.strokeStyle = g.cursorTrackingColor, t.beginPath();
                    for (var o = 0; o < e.length; o++) t.moveTo(e[o].x, e[o].y), t.lineTo(i, s);
                    t.stroke(), t.globalAlpha = 1;
                },
                'drawCircles': function(t, e, i, s, o, a) {
                    t.lineWidth = s, t.globalAlpha = o, t.strokeStyle = a;
                    for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, e[n].size + i, 0, this.pi2, false), t.closePath(), t.stroke();
                    t.globalAlpha = 1;
                },
                'drawDashedCircle': function(t, e, i, s, o, a, n) {
                    var r = this.pi2 / o;
                    t.lineWidth = a, t.strokeStyle = n;
                    for (var l = 0; l < o; l += 2) t.beginPath(), t.arc(e, i, s - a / 2, l * r, (l + 1) * r, false), t.stroke();
                },
                'drawTeammatesInd': function(t, e, i, s) {		
					//console.log("t:"+ t + " e:" + e + " i:" + i + "s:" + s);
                    if(this.indicator){
						t.drawImage(this.indicator, e - 45, i - s - 90);
					}
                },
                'drawPieChart': function() {
                    this.pieChart || (this.pieChart = document.createElement('canvas'));
                    var t = this.pieChart.getContext('2d'),
                        e = Math.min(200, 0.3 * this.canvasWidth) / 200;
                    this.pieChart.width = 200 * e, this.pieChart.height = 240 * e, t.scale(e, e);
                    for (var i = ['#333333', '#FF3333', '#33FF33', '#3333FF'], s = 0, o = 0; o < M.pieChart.length; o++) {
                        var a = s + M.pieChart[o] * this.pi2;
                        t.fillStyle = i[o + 1], t.beginPath(), t.moveTo(100, 140), t.arc(100, 140, 80, s, a, false), t.fill(), s = a;
                    }
                },
                'drawBattleArea': function(t) {
                    if (M.battleRoyale.state) {
                        this.drawDangerArea(t, M.battleRoyale.x, M.battleRoyale.y, M.battleRoyale.radius, M.mapMinX, M.mapMinY, M.mapMaxX - M.mapMinX, M.mapMaxY - M.mapMinY, g.dangerAreaColor, 0.25);
                        this.drawSafeArea(t, M.battleRoyale.targetX, M.battleRoyale.targetY, M.battleRoyale.targetRadius, 40, g.safeAreaColor);
                    }
                },
                'drawBattleAreaOnMinimap': function(t, e, i, s, o, a) {
                    if (M.battleRoyale.state) {
                        if (!this.battleAreaMap) {
                            this.battleAreaMap = document.createElement("canvas");
                            this.battleAreaMapCtx = this.battleAreaMap.getContext("2d");
                        }
                        if (this.battleAreaMap.width != e) {
                            this.battleAreaMap.width = e;
                            this.battleAreaMap.height = i;
                        } else {
                            this.battleAreaMapCtx.clearRect(0, 0, e, i);
                        }
                        var n = (M.battleRoyale.x + o) * s;
                        var r = (M.battleRoyale.y + a) * s;
                        var l = M.battleRoyale.radius * s;
                        this.drawDangerArea(this.battleAreaMapCtx, n, r, l, 0, 0, e, i, g.dangerAreaColor, 0.25);
                        n = ~~((M.battleRoyale.targetX + o) * s);
                        r = ~~((M.battleRoyale.targetY + a) * s);
                        l = ~~(M.battleRoyale.targetRadius * s);
                        this.drawSafeArea(this.battleAreaMapCtx, n, r, l, 2, g.safeAreaColor);
                        t.drawImage(this.battleAreaMap, 0, 0);
                    }
                },
                'drawDangerArea': function(t, e, i, s, o, a, n, r, l, h) {
                    if (!(M.battleRoyale.radius == M.battleRoyale.maxRadius || s <= 0)) {
                        t.save();
                        t.globalAlpha = h;
                        t.fillStyle = l;
                        t.fillRect(o, a, n, r);
                        t.globalCompositeOperation = "destination-out";
                        t.globalAlpha = 1;
                        t.beginPath();
                        t.arc(e, i, s, 0, this.pi2, false);
                        t.fill();
                        t.restore();
                    }
                },
                'drawSafeArea': function(t, e, i, s, o, a) {
                    if (!(M.battleRoyale.state > 2 || s <= 0)) {
                        this.drawDashedCircle(t, e, i, s, 60, o, a);
                    }
                },
				'drawTextAlongArc' : function (ctx, str, centerX, centerY, radius, angle) {
					var len = str.length,
					s;
					this.ctx.save();
					this.ctx.translate(centerX, centerY);
					this.ctx.rotate(-1 * angle / 2);
					this.ctx.rotate(-1 * (angle / len) / 2);
					for (var n = 0; n < len; n++) {
						this.ctx.rotate(angle / len);
						this.ctx.save();
						this.ctx.translate(0, -1 * radius);
						s = str[n];
						this.ctx.fillText(s, 0, 0);
						this.ctx.restore();
					}
				this.ctx.restore();
				},				
                'drawGhostCells' : function() {
                    if (v.showGhostCells) {
                        var t = M.ghostCells;
                        this.ctx.beginPath();
                        var e = 0;
                        for (; e < t.length; e++) {
                            if (!t[e].inView) {						
                                var i = t[e].x;
                                var s = t[e].y;
                                this.ctx.moveTo(i, s);
								this.ctx.arc(i, s, t[e].size, 0, this.pi2, false);	
								//
								if (v.showGhostCellsInfo){
								this.nickScale = 1;								
								this.fontSize = Math.max(t[e].size * 0.3, 26) * this.scale;								
								this.nickSize = ~~(this.fontSize * this.nickScale);						
								this.ctx.font = g.namesFontWeight + " " + this.nickSize*4 + "px " + g.namesFontFamily;
								this.ctx.textAlign = 'center';
								this.ctx.fillStyle = g.namesColor;
								this.ctx.strokeStyle = g.namesStrokeColor;
								this.ctx.lineWidth = 4;
								angle = Math.PI * 0.8;
								
								if (M.leaderboard[e]!=undefined){ //M instead of legendmod for quicker response
								
									this.ghostcellstext = removeEmojis(ogarminimapdrawer.escapeHTML(M.leaderboard[e].nick)); //legendmod3.escapeHTML(legendmod.leaderboard[0].nick)
								}
								else{
									this.ghostcellstext = "Legend mod";
								}
								this.drawTextAlongArc(this.ctx, this.ghostcellstext, i, s, t[e].size*this.pi2/6, angle);									
								if (v.customSkins && M.showCustomSkins){		
									if (M.leaderboard[e]!=undefined){
									node = ogarminimapdrawer.getCustomSkin(M.leaderboard[e].nick, "#000000");                           
										if (node){								
								this.ctx.drawImage(node, i-t[e].size, s-t[e].size, t[e].size*2, t[e].size*2);	
										}
									}	
								}	
								}
                           //
						   }							
                        }
                        this.ctx.fillStyle = g.ghostCellsColor;
                        this.ctx.globalAlpha = g.ghostCellsAlpha;
						this.ctx.shadowColor = g.ghostCellsColor;					
                        this.ctx.shadowBlur = 40;
                        this.ctx.shadowOffsetX = 0;
                        this.ctx.shadowOffsetY = 0;
                        this.ctx.fill();
                        this.ctx.globalAlpha = 1;
                        this.ctx.shadowBlur = 0;
                    }
                },
                'preDrawPellet': function() {
                    this.pellet = null;
                    var t = 10 + g.foodSize,
                        e = document.createElement('canvas');
                    e.width = 2 * t, e.height = 2 * t;
                    var i = e.getContext('2d');
                    i.arc(t, t, t, 0, this.pi2, false), i.fillStyle = g.foodColor, i.fill(), this.pellet = new Image(), this.pellet.src = e.toDataURL(), e = null;
                },
                'preDrawIndicator': function() {
                    this.indicator = null;
                    var t = document.createElement('canvas');
                    t.width = 90, t.height = 50;
                    var e = t.getContext('2d');
                    e.lineWidth = 2; 
					e.fillStyle = g.teammatesIndColor; 
					e.strokeStyle = '#000000';
					e.beginPath(); 
					e.moveTo(0, 0); 
					e.lineTo(90, 0); 
					e.lineTo(45, 50); 
					e.closePath();
					e.fill();
					e.stroke(); 
					this.indicator = new Image(); 
					this.indicator.src = t.toDataURL();
					t = null;
                },
                'countFps': function() {
                    if (v.showStatsFPS) {
                        var t = Date.now();
                        if (!this.fpsLastRequest) {
                            this.fpsLastRequest = t;
                        }
                        if (t - this.fpsLastRequest >= 1000) {
                            this.fps = this.renderedFrames;
                            this.renderedFrames = 0;
                            this.fpsLastRequest = t;
                        }
                        this.renderedFrames++;
                    }
                },
                'render': function() {
                    ogarfooddrawer.countFps(), ogarfooddrawer.renderFrame(), window.requestAnimationFrame(ogarfooddrawer.render);
                },
                'init': function() {
                    this.setCanvas();
					this.resizeCanvas(); 
					this.preDrawPellet(); 
					this.preDrawIndicator(); 
					window.requestAnimationFrame(ogarfooddrawer.render);
                }
		
            },
            ogarioefaultHotkeys = {},
            ogario1Hotkeys = {},
            ogario11Hotkeys = {
                'hk-feed': {
                    'label': h['hk-feed'],
                    'defaultKey': 'W',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.feed();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-macroFeed': {
                    'label': h['hk-macroFeed'],
                    'defaultKey': 'E',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!1);
                    },
                    'type': 'normal'
                },
                'hk-split': {
                    'label': h['hk-split'],
                    'defaultKey': 'SPACE',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.split();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-doubleSplit': {
                    'label': h['hk-doubleSplit'],
                    'defaultKey': 'Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['doubleSplit']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-popSplit': {
                    'label': 'Popsplit',
                    'defaultKey': 'ALT+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['popSplit']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-split16': {
                    'label': h['hk-split16'],
                    'defaultKey': 'SHIFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['split16']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-pause': {
                    'label': h['hk-pause'],
                    'defaultKey': 'R',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setPause']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTop5': {
                    'label': h['hk-showTop5'],
                    'defaultKey': 'T',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowTop5']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTime': {
                    'label': h['hk-showTime'],
                    'defaultKey': 'ALT+T',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowTime']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSplitRange': {
                    'label': h['hk-showSplitRange'],
                    'defaultKey': 'U',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowSplitRange']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSplitInd': {
                    'label': h['hk-showSplitInd'],
                    'defaultKey': 'I',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowSplitInd']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTeammatesInd': {
                    'label': h['hk-showTeammatesInd'],
                    'defaultKey': 'ALT+I',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowTeammatesInd']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showOppColors': {
                    'label': h['hk-showOppColors'],
                    'defaultKey': 'O',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowOppColors']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleSkins': {
                    'label': h['hk-toggleSkins'],
                    'defaultKey': 'A',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleSkins']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-transparentSkins': {
                    'label': h['hk-transparentSkins'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setTransparentSkins']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSkins': {
                    'label': h['hk-showSkins'],
                    'defaultKey': 'S',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowSkins']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showStats': {
                    'label': h['hk-showStats'],
                    'defaultKey': 'ALT+S',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowStats']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleCells': {
                    'label': h['hk-toggleCells'],
                    'defaultKey': 'D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleCells']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showFood': {
                    'label': h['hk-showFood'],
                    'defaultKey': 'F',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowFood']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showGrid': {
                    'label': h['hk-showGrid'],
                    'defaultKey': 'G',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowGrid']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMiniMapGuides': {
                    'label': h['hk-showMiniMapGuides'],
                    'defaultKey': 'ALT+G',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowMiniMapGuides']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideChat': {
                    'label': h['hk-hideChat'],
                    'defaultKey': 'H',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['hideChat']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showHUD': {
                    'label': h['hk-showHUD'],
                    'defaultKey': 'ALT+H',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowHUD']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-copyLb': {
                    'label': h['hk-copyLb'],
                    'defaultKey': 'L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['copyLb']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showLb': {
                    'label': h['hk-showLb'],
                    'defaultKey': 'ALT+L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowLb']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleAutoZoom': {
                    'label': h['hk-toggleAutoZoom'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleAutoZoom']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-resetZoom': {
                    'label': h['hk-resetZoom'],
                    'defaultKey': 'Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.resetZoom(!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer.resetZoom(!1);
                    },
                    'type': 'normal'
                },
                'hk-toggleDeath': {
                    'label': h['hk-toggleDeath'],
                    'defaultKey': 'X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleDeath();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-clearChat': {
                    'label': h['hk-clearChat'],
                    'defaultKey': 'C',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!1);
                    },
                    'type': 'normal'
                },
                'hk-showBgSectors': {
                    'label': h['hk-showBgSectors'],
                    'defaultKey': 'B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowBgSectors();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideBots': {
                    'label': h['hk-hideBots'],
                    'defaultKey': 'ALT+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setHideSmallBots();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showNames': {
                    'label': h['hk-showNames'],
                    'defaultKey': 'N',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowNames();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideTeammatesNames': {
                    'label': h['hk-hideTeammatesNames'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setHideTeammatesNames();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMass': {
                    'label': h['hk-showMass'],
                    'defaultKey': 'M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowMass();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMiniMap': {
                    'label': h['hk-showMiniMap'],
                    'defaultKey': 'ALT+M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowMiniMap();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-chatMessage': {
                    'label': h['hk-chatMessage'],
                    'defaultKey': 'ENTER',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-quickResp': {
                    'label': h['hk-quickResp'],
                    'defaultKey': 'TILDE',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.quickResp();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-autoResp': {
                    'label': h['hk-autoResp'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleAutoResp();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom1': {
                    'label': h['hk-zoomLevel'] + ' 1',
                    'defaultKey': 'ALT+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.5);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom2': {
                    'label': h['hk-zoomLevel'] + ' 2',
                    'defaultKey': 'ALT+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.25);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom3': {
                    'label': h['hk-zoomLevel'] + ' 3',
                    'defaultKey': 'ALT+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.125);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom4': {
                    'label': h['hk-zoomLevel'] + ' 4',
                    'defaultKey': 'ALT+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.075);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom5': {
                    'label': h['hk-zoomLevel'] + ' 5',
                    'defaultKey': 'ALT+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.05);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-voiceChat': {
                    'label': h['hk-voiceChat'],
                    'defaultKey': '=',
                    'keyDown': function() {
                        //ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
                        //if ($('#message-box').css('display') == 'block') {
                        $(".voice-start.icon-mic").click();
                        //}
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-GhostCellsInfo': {
                    'label': h['hk-GhostCellsInfo'],
                    'defaultKey': 'K',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowGhostCellsInfo();
                    },
                    'keyUp': null,
                    'type': 'special'
                },	
                'hk-Autoplay': {
                    'label': h['hk-Autoplay'],
                    'defaultKey': 'J',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setAutoPlay();
                    },
                    'keyUp': null,
                    'type': 'special'
                },				
                'hk-switchServerMode': {
                    'label': h['hk-switchServerMode'],
                    'defaultKey': '-',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.switchServerMode();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTargeting': {
                    'label': h['hk-showTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-setTargeting': {
                    'label': h['hk-setTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-cancelTargeting': {
                    'label': h['hk-cancelTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.cancelTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-changeTarget': {
                    'label': h['hk-changeTarget'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['changeTarget']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-privateMiniMap': {
                    'label': h['hk-privateMiniMap'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setPrivateMiniMap();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showQuest': {
                    'label': h['hk-showQuest'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowQuest();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-comm1': {
                    'label': c['comm1'],
                    'defaultKey': '1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(1);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm2': {
                    'label': c['comm2'],
                    'defaultKey': '2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(2);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm3': {
                    'label': c['comm3'],
                    'defaultKey': '3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(3);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm4': {
                    'label': c['comm4'],
                    'defaultKey': '4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(4);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm5': {
                    'label': c['comm5'],
                    'defaultKey': '5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(5);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm6': {
                    'label': c['comm6'],
                    'defaultKey': '6',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(6);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm7': {
                    'label': c['comm7'],
                    'defaultKey': '7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(7);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm8': {
                    'label': c['comm8'],
                    'defaultKey': '8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(8);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm9': {
                    'label': c['comm9'],
                    'defaultKey': '9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(9);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm0': {
                    'label': c['comm0'],
                    'defaultKey': '0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(0);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm10': {
                    'label': c['comm10'],
                    'defaultKey': 'MOUSE WHEEL',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(10);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm11': {
                    'label': c['comm11'],
                    'defaultKey': 'LEFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(11);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm12': {
                    'label': c['comm12'],
                    'defaultKey': 'UP',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(12);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm13': {
                    'label': c['comm13'],
                    'defaultKey': 'RIGHT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(13);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm14': {
                    'label': c['comm14'],
                    'defaultKey': 'DOWN',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(14);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm15': {
                    'label': c['comm15'],
                    'defaultKey': 'CTRL+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(15);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm16': {
                    'label': c['comm16'],
                    'defaultKey': 'CTRL+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(16);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm17': {
                    'label': c['comm17'],
                    'defaultKey': 'CTRL+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(17);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm18': {
                    'label': c['comm18'],
                    'defaultKey': 'CTRL+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(18);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm19': {
                    'label': c['comm19'],
                    'defaultKey': 'CTRL+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(19);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm20': {
                    'label': c['comm20'],
                    'defaultKey': 'CTRL+7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(20);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm21': {
                    'label': c['comm21'],
                    'defaultKey': 'CTRL+8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(21);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm22': {
                    'label': c['comm22'],
                    'defaultKey': 'CTRL+9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(22);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm23': {
                    'label': c['comm23'],
                    'defaultKey': 'CTRL+0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(23);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm24': {
                    'label': c['comm24'],
                    'defaultKey': 'CTRL+Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(24);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm25': {
                    'label': c['comm25'],
                    'defaultKey': 'CTRL+X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(25);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm26': {
                    'label': c['comm26'],
                    'defaultKey': 'CTRL+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(26);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm27': {
                    'label': c['comm27'],
                    'defaultKey': 'CTRL+V',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(27);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm28': {
                    'label': c['comm28'],
                    'defaultKey': 'CTRL+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(28);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm29': {
                    'label': c['comm29'],
                    'defaultKey': 'CTRL+A',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(29);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm30': {
                    'label': c['comm30'],
                    'defaultKey': 'CTRL+D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(30);
                    },
                    'keyUp': null,
                    'type': 'command'
                }
            },
            lastkeys = {
                'lastPressedKey': '',
                'lastKeyId': '',
                'defaultMessageKey': 'ENTER',
                'inputClassName': 'custom-key-in form-control input-sm',
                'loadDefaultHotkeys': function() {
                    for (var t in ogario1Hotkeys = {}, ogario11Hotkeys) ogario11Hotkeys.hasOwnProperty(t) && (ogario1Hotkeys[ogario11Hotkeys[t].defaultKey] = t);
                    ogario1Hotkeys['spec-messageKey'] = this['defaultMessageKey'];
                },
                'loadHotkeys': function() {
                    null !== window.localStorage.getItem('ogarioHotkeys') ? ogario1Hotkeys = JSON.parse(window.localStorage.getItem('ogarioHotkeys')) : this['loadDefaultHotkeys'](), null !== window.localStorage.getItem('ogarioCommands') && (c = JSON.parse(window.localStorage.getItem('ogarioCommands')));
                },
                'saveHotkeys': function() {
                    window.localStorage.setItem('ogarioHotkeys', JSON.stringify(ogario1Hotkeys)), this['saveCommands']();
                },
                'saveCommands': function() {
                    $('#hotkeys .command-in').each(function() {
                        var t = $(this),
                            e = t.attr('id');
                        c.hasOwnProperty(e) && (c[e] = t.val());
                    }), window.localStorage.setItem('ogarioCommands', JSON.stringify(c));
                },
                'resetHotkeys': function() {
                    this['loadDefaultHotkeys'](), $('#hotkeys-cfg .custom-key-in').each(function() {
                        var t = $(this).attr('id');
                        ogario11Hotkeys[t] && $(this).val(ogario11Hotkeys[t].defaultKey);
                    });
                },
                'setHotkeysMenu': function() {
                    var t = this;
                    for (var e in $('body').append('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + h['restoreSettings'] + '</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">' + h['saveSett'] + '</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">' + h['close'] + '</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>' + h['hk-inst-assign'] + '</li><li>' + h['hk-inst-delete'] + '</li><li>' + h['hk-inst-keys'] + '</li></ul></div></div>'), ogario11Hotkeys)
                        if (ogario11Hotkeys.hasOwnProperty(e)) {
                            var i = ogario11Hotkeys[e],
                                o = '';
                            for (var a in ogario1Hotkeys)
                                if (ogario1Hotkeys.hasOwnProperty(a) && ogario1Hotkeys[a] === e) {
                                    o = a;
                                    break;
                                } if ('hk-switchServerMode' === e && ogarminimapdrawer && !ogarminimapdrawer['privateIP']) continue;
                            if ('command' === i['type']) {
                                var n = e.replace('hk-', '');
                                $('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\"><input id=\"' + n + '\" class=\"command-in form-control input-sm\" value=\"' + c[n] + '\" maxlength=\"80\" /></div><div class=\"default-key\">' + i.defaultKey + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                            } else $('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\">' + i['label'] + '</div><div class=\"default-key\">' + i.defaultKey + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                        } 
					$(document).on('click', '#reset-hotkeys', function(t) {
                        t.preventDefault();
						lastkeys['resetHotkeys']();
                    }), 
					$(document).on('click', '#save-hotkeys', function(t) {
                        t.preventDefault(); 
						lastkeys.saveHotkeys();
						$('#hotkeys').fadeOut(500);
                    }), 
					$(document).on('click', '#close-hotkeys', function(t) {
                        t.preventDefault(); 
						$('#hotkeys').fadeOut(500);
                    }), 
					$(document).on('click', '.hotkeys-link', function(t) {
                        $('#hotkeys').fadeIn(500);
						$('#hotkeys-cfg').perfectScrollbar('update'); 
						ogarcommando1();
                    }), 
					$('#hotkeys-cfg').perfectScrollbar(), 
					y && y.setMenuBg();
                },
                'getPressedKey': function(t) {
                    var e = '',
                        i = '';
                    switch (t['ctrlKey'] || 17 == t.keyCode ? e = 'CTRL' : (t.altKey || 18 == t.keyCode) && (e = 'ALT'), t.keyCode) {
                        case 9:
                            i = 'TAB';
                            break;
                        case 13:
                            i = 'ENTER';
                            break;
                        case 16:
                            i = 'SHIFT';
                            break;
                        case 17:
                        case 18:
                            break;
                        case 27:
                            i = 'ESC';
                            break;
                        case 32:
                            i = 'SPACE';
                            break;
                        case 37:
                            i = 'LEFT';
                            break;
                        case 38:
                            i = 'UP';
                            break;
                        case 39:
                            i = 'RIGHT';
                            break;
                        case 40:
                            i = 'DOWN';
                            break;
                        case 46:
                            i = 'DEL';
                            break;
                        case 61:
                        case 187:
                            i = '=';
                            break;
                        case 192:
                            i = 'TILDE';
                            break;
                        default:
                            i = String.fromCharCode(t.keyCode);
                    }
                    return '' !== e ? '' !== i ? e + '+' + i : e : i;
                },
                'deleteHotkey': function(t, e) {
                    delete ogario1Hotkeys[t]; 
					$('#' + e).val('');
                },
                'setDefaultHotkey': function(t) {
                    var e = false;
                    return ogario11Hotkeys[t] && !ogario1Hotkeys.hasOwnProperty(ogario11Hotkeys[t].defaultKey) ? (e = ogario11Hotkeys[t].defaultKey, ogario1Hotkeys[e] = t, e) : e;
                },
                'setHotkey': function(t, e) {
                    if (e && (this.lastPressedKey !== t || this.lastKeyId !== e)) {
                        var i = $('#' + e).val();
                        if (this.deleteHotkey(i, e), 'DEL' !== t) {
                            if (ogario1Hotkeys[t] && ogario1Hotkeys[t] !== e) {
                                var o = ogario1Hotkeys[t],
                                    a = this.setDefaultHotkey(o);
                                a ? (ogario1Hotkeys[a] = o, $('#' + o).val(a)) : this.deleteHotkey(t, o);
                            }
                            ogario1Hotkeys[t] = e, 
							$('#' + e).val(t); 
							if ('hk-chatMessage' === e){ 
							ogario1Hotkeys['spec-messageKey'] = t} 
							this.lastPressedKey = t; 
							this.lastKeyId = e;
                        }
                    }
                },
                'init': function() {
                    this.loadHotkeys(); 
					this.setHotkeysMenu();
                }
            };
        window.legendmod2 = ogarfooddrawer; //look at this
        function ogarjoiner(t) {
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, window.document.title, t);
            }
        }

        function ogarassembler() {
            window.onkeydown = function(t) {
                81 == t.keyCode && window.core.specialOn && window.core.specialOn();
            }, window.onkeyup = function(t) {};
        }

        function ogarhusettings() {
            var t = window.innerWidth;
            var o = window.innerHeight;
            var a = $("#helloContainer");
            var n = a.innerHeight();
            if (n > 0) {
                i.menuHeight= n;
            } else {
                n = i.menuHeight|| 618;
            }
            var r = Math.min(1, o / n);
            var l = n * r;
            var h = Math.round(o / 2 - 0.5 * l);
            var c = "translate(-50%, 0%) scale(" + r + ")";
            a.css("transform", c), a.css("-ms-transform", c), a.css("-webkit-transform", c), a.css("top", h + "px"), i.innerW = t, i.innerH = o;

        }

        function ogarcommando1() {
            ogarminimapdrawer['protocolMode'] || (window.onkeydown = function(t) {});
        }
        document.onkeydown = function(t) {
            var e = lastkeys.getPressedKey(t);
            if (('INPUT' !== t['target']['tagName'] || t['target'].className === lastkeys.inputClassName || e === ogario1Hotkeys['spec-messageKey']) && '' !== e && !ogarioefaultHotkeys[e]) {
                if (ogarioefaultHotkeys[e] = true, 'ESC' === e) return t.preventDefault(), void(ogarminimapdrawer && ogarminimapdrawer.showMenu());
                if (t['target'].className === lastkeys.inputClassName) return t.preventDefault(), void lastkeys.setHotkey(e, t['target'].id);
                if (ogario1Hotkeys[e]) {
                    t.preventDefault();
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i].keyDown && ogario11Hotkeys[i].keyDown();
                }
            }
        }
		document.onkeyup = function(t) {
            var e = lastkeys.getPressedKey(t);
            if ('' !== e) {
                if (ogario1Hotkeys[e]) {
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i].keyUp && ogario11Hotkeys[i].keyUp();
                }
                ogarioefaultHotkeys[e] = false;
            }
        } 
		window.onmousedown = function(t) {
            if (!$("#overlays").is(":visible")) {
                if (2 == t.which) {
                    t["preventDefault"]();
                    if (ogarminimapdrawer) {
                        ogarminimapdrawer.sendCommand(10);
                    }
                } else {
                    if (v["mouseSplit"] && (1 == t.which && !v.mouseInvert || 3 == t.which && v.mouseInvert)) {
                        t.preventDefault();
                        if (ogarminimapdrawer) {
                            ogarminimapdrawer.split();
                        }
                    }
                    if (v.mouseFeed && (3 == t.which && !v.mouseInvert || 1 == t.which && v.mouseInvert)) {
                        t.preventDefault();
                        if (ogarminimapdrawer) {
                            ogarminimapdrawer.macroFeed(true);
                        }
                    }
                }
            }
        }
		window.onmouseup= function(t) {
            if (v.mouseFeed && (3 == t.which && !v.mouseInvert || 1 == t.which && v.mouseInvert) && ogarminimapdrawer) {
                ogarminimapdrawer.macroFeed(false);
            }
        };
		window.onbeforeunload = function(t) {
            return i.play ? h.exit : void 0;
        }; 
		i = M; 
		o = t('buffer')['Buffer'];
		a = t('lz4');
		if ('/ogario' === window.location.pathname){
			ogarjoiner('/' + window.location.hash); 
		}
		window.onresize = function() {
            ogarfooddrawer.resizeCanvas(), ogarhusettings();
        };
		ogarassembler();
		
		function Node(lsb, msb) {
        this.view = lsb;
        this.offset = msb;
        this.contentType = 1;
        this.uncompressedSize = 0;
        this.setContentType = function() {
          this.contentType = this.readUint32();
        };
        this.setUncompressedSize = function() {
          this.uncompressedSize = this.readUint32();
        };
        this.compareBytesGt = function(first, second) {
          var stripTerrain = first < 0;
          var coast = second < 0;
          if (stripTerrain != coast) {
            return stripTerrain;
          }
          return first > second;
        };
        this.skipByte = function() {
          var checkvarreadByte = this.readByte();
          if (checkvarreadByte < 128) {
            return;
          }
          this.skipByte();
        };
        this.readByte = function() {
          return this.view.getUint8(this.offset++);
        };
        this.readUint32 = function() {
          var result = 0;
          var shift = 0;
          for (; !![];) {
            var digit = this.readByte();
            if (this.compareBytesGt(32, shift)) {
              if (digit >= 128) {
                result = result | (digit & 127) << shift;
              } else {
                result = result | digit << shift;
                break;
              }
            } else {
              this.skipByte();
              break;
            }
            shift = shift + 7;
          }
          return result;
        };
        this.readFlag = function() {
          return this.readUint32() >>> 3;
        }
		}		
		window.core = {
            'connect': function(t) {
                M.connect(t);
            },
            'disconnect': function() {},
            'sendNick': function(t) {
                M.sendNick(t);
            },
            'sendSpectate': function() {
                M.sendSpectate();
            },
            'eject': function() {
                M.sendEject();
            },
            'split': function() {
                M.sendSplit();
            },
            'specialOn': function() {
                M.sendFreeSpectate();
            },
            'specialOff': function() {
                M.sendFreeSpectate();
            },
            'sendFbToken': function(t) {
                M.sendFbToken(t);
            },
            'sendGplusToken': function(t) {
                M.sendGplusToken(t);
            },
            'recaptchaResponse': function(t) {
                M.sendRecaptcha(t);
            },
            'setClientVersion': function(t, e) {
                M.setClientVersion(t, e);
            },
          "proxyMobileData" : function(arr = []) {
            if (!Array.isArray(arr)) {
              console.log("ProxyMobileData ERROR: Array data required.");
              return;
            }
            if (arr[0] == 8) {
              arr["unshift"](102);
            }
            arr = new Uint8Array(arr);
            M["sendMessage"](new DataView(arr["buffer"]));
          },
			'registerSkin': function(a, b, c, d, e){
				window.customskinsname=a;
				window.customskinsurl=c;
			}
        }; 	
		window.master.getClientVersion(); 
		y.init(); 
		ogarminimapdrawer.init(); 
		ogarminimapdrawer.getDefaultSettings(); 
		ogarminimapdrawer.connect(); 
		lastkeys.init(); 
		M.init(); 
		ogarfooddrawer.init(); 
		window.master.init();
		ogarhusettings();
    })(window.ogario);
}
