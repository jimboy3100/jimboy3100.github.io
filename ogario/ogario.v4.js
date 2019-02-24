
// Open Source script
// Decoded simplified and modified by MGx, Adam, Jimboy3100, Snez, Volum, Alexander Lulko
// This is part of the Legend mod project
//v1.112 test
//Game Configurations

//window.agarversion="v12/1963/";
window.agarversion="v12/1922/";

var Lmagarversion="";

window.LMGameConfiguration = $.ajax({
        type: "GET",
		url: "https://jimboy3100.github.io/agario/live/"+Lmagarversion+"GameConfiguration.json",
		async: false,
        datatype: "jsonp",
        success: function(info) {
			//var GameConfiguration = info;
		}
}).responseJSON;
//weird but it works....

setTimeout(function(){ 
	if (window.LMGameConfiguration==undefined){
		window.LMGameConfiguration = $.ajax({
        type: "GET",
		url: "https://configs-web.agario.miniclippt.com/live/"+window.agarversion+"GameConfiguration.json",
		async: false,
        datatype: "jsonp",
        success: function(info) {
			//var GameConfiguration = info;
		}
		}).responseJSON;
	}
 }, 3000);
setTimeout(function(){ 
	if (window.LMGameConfiguration!=undefined){
		 window.LMAgarGameConfiguration = window.LMGameConfiguration;
         window.EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];		 
	}
 }, 5000);

//set values outside ogario
window.leaderboardlimit=10;
window.vanillaskins=false;
//window.customskinsname;
//window.customskinsurl;

/*core.registerSkin('fly', null, 'https://i.imgur.com/poFMdZd.png', 1, null)
core.registerSkin = function(a, b, c, d, e){
	window.customskinsname=a;
	window.customskinsurl=c;
}
*/

var core = function(t, e, i) {
    //here starts ogario
    (function(e, i, s) {
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
                    'zoomSpeedValue': 'Szybkość zoomu',
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
                    'myTransparentSkin': 'Mój przezroczysty skin',
                    'myCustomColor': 'Mój własny kolor',
                    'transparentCells': 'Przezroczyste kulki',
                    'transparentViruses': 'Przezroczyste wirusy',
                    'transparentSkins': 'Przezroczyste skiny',
                    'showGrid': 'Siatka',
                    'showBgSectors': 'Sektory w tle',
                    'showMapBorders': 'Granice mapy',
                    'showGhostCells': 'Duchy kulek',
                    'showMiniMap': 'Pokaż minimapę',
                    'showMiniMapGrid': 'Pokaż siatkę minimapy',
                    'showMiniMapGuides': 'Pokaż prowadnice na minimapie',
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
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
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
                    'targetNotSet': 'Brak celu',
                    'targetDead': 'Nie żyje',
                    'targetDistance': 'Dystans',
                    'targetMass': 'Masa razem',
                    'totalPartyPlayers': 'Aktywnych graczy',
                    'totalPartyMass': 'Łącznie masy',
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
                    'zoomSpeedValue': 'Zoom speed',
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
                    'myTransparentSkin': 'My transparent skin',
                    'myCustomColor': 'My custom color',
                    'transparentCells': 'Transparent cells',
                    'transparentViruses': 'Transparent viruses',
                    'transparentSkins': 'Transparent skins',
                    'showGrid': 'Show grid',
                    'showBgSectors': 'Show background sectors',
                    'showMapBorders': 'Show map borders',
                    'showGhostCells': 'Ghost cells',
                    'showMiniMap': 'Show minimap',
                    'showMiniMapGrid': 'Show minimap grid',
                    'showMiniMapGuides': 'Show minimap guides',
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
                    'showTop5': 'Show team top 5',
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
                    'hk-showTop5': 'Show/hide team top 5',
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
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
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
                    'targetNotSet': 'Target not set',
                    'targetDead': 'Dead',
                    'targetDistance': 'Distance',
                    'targetMass': 'Mass altogether',
                    'totalPartyPlayers': 'Active players',
                    'totalPartyMass': 'Total mass',
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
            l = e.navigator.language || e.navigator.userLanguage;
        l && n.hasOwnProperty(l) && (r = l);
        var h = n[r];
		if (n[r].comm15!=undefined){
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
				'(g+)': 'newgplus.svg',
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
                    'darkTheme': !0,
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
                    'cellsAlpha': 0.9,
                    'skinsAlpha': 0.7,
                    'virusAlpha': 0.6,
                    'textAlpha': 1,
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
                    'darkTheme': !0,
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
                    'darkTheme': !0,
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
                    'darkTheme': !0,
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
                    'skinsAlpha': 0.7,
                    'virusAlpha': 0.4,
                    'virusStrokeSize': 10,
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
                    'darkTheme': !0,
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
                    'darkTheme': !1,
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
                    'darkTheme': !0,
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
                'darkTheme': !0,
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
                'mVirusColor': '#ce6363',
                'mVirusStrokeColor': '#b95959',
                'foodColor': '#5000ff',
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
                'bordersWidth': 40,
                'sectorsWidth': 40,
                'sectorsFontSize': 1200,
                'cellsAlpha': 0.9,
                'skinsAlpha': 0.7,
                'virusAlpha': 0.6,
                'textAlpha': 1,
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
                    for (var s in null !== e.localStorage.getItem('ogarioThemeSettings') && (t = JSON.parse(e.localStorage.getItem('ogarioThemeSettings'))), g) g.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (g[s] = t[s]), i.hasOwnProperty(s) && (i[s] = g[s]));
                },
                'saveThemeSettings': function() {
                    e.localStorage.setItem('ogarioThemeSettings', JSON.stringify(g));
                },
                'restoreThemeSettings': function() {
                    null !== e.localStorage.getItem('ogarioThemeSettings') && (e.localStorage.removeItem('ogarioThemeSettings'), e.location.reload());
                },
                'addCustomCSS': function(t, e) {
                    this[t] || (this[t] = s("<style type=\'text/css\'>").appendTo('head')), this[t].html(e);
                },
                'addPresetBox': function(t, e, i, o, a) {
                    for (var n in s(t).append('<div class=\"preset-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>'), i) i.hasOwnProperty(n) && s('#' + e).append('<option value=\"' + n + '\">' + i[n]['name'] + '</option>');
                    s('#' + e).val(g[o]);
                    var r = this;
                    s('#' + e).on('change', function() {
                        var t = this.value;
                        g[o] = t, r[a](t);
                    });
                },
                'addColorBox': function(t, e, o) {
                    if (s(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + g[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        s(t + ' .' + e + '-picker')['colorpicker']({
                            'format': 'hex'
                        }).on('changeColor.colorpicker', function(t) {
                            g[e] = t['color'].toHex(), i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else s(t + ' .' + e + '-picker').colorpicker({
                        'format': 'hex'
                    }).on('changeColor.colorpicker', function(t) {
                        g[e] = t['color'].toHex(), i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addRgbaColorBox': function(t, e, o) {
                    if (s(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + g[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        s(t + ' .' + e + '-picker').colorpicker({
                            'format': 'rgba'
                        }).on('changeColor.colorpicker', function(t) {
                            var s = t['color'].toRGB();
                            g[e] = 'rgba(' + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else s(t + ' .' + e + '-picker').colorpicker({
                        'format': 'rgba'
                    }).on('changeColor.colorpicker', function(t) {
                        var s = t['color'].toRGB();
                        g[e] = 'rgba(' + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addSliderBox': function(t, e, o, a, n, r) {
                    if (s(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + g[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + g[e] + '\"></div>'), r) {
                        var l = this;
                        s('#' + e + '-slider').on('input', function() {
                            var t = parseFloat(s(this).val());
                            s('#' + e + '-value').text(t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r]();
                        });
                    } else s('#' + e + '-slider').on('input', function() {
                        var t = parseFloat(s(this).val());
                        s('#' + e + '-value').text(t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t);
                    });
                },
                'addInputBox': function(t, e, i, o) {
                    s(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + g[e] + '\" /></div>');
                    var a = this;
                    s('#' + e).on('input', function() {
                        g[e] = this.value, a[o]();
                    });
                },
                'addCursorBox': function(t, e) {
                    e === g.customCursor ? s(t).append('<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"' + e + '\"></a></div>') : s(t).append('<div class=\"cursor-box\"><a href=\"#\"><img src=\"' + e + '\"></a></div>');
                },
                'setFont': function(t, e) {
                    g[t] = e, g[t + 'Family'] = this['setFontFamily'](e), g[t + 'Weight'] = this.setFontWeight(e), i.hasOwnProperty(t + 'Family') && (i[t + 'Family'] = g[t + 'Family']), i.hasOwnProperty(t + 'Weight') && (i[t + 'Weight'] = g[t + 'Weight']);
                },
                'addFontBox': function(t, e, i) {
                    s(t).append('<div class=\"font-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>'), s('#' + e).append('<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>'), s('#' + e).append('<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>'), s('#' + e).append('<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>'), s('#' + e).val(g[e]);
                    var o = this;
                    i ? s('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t), o[i]();
                    }) : s('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t);
                    });
                },
                'setFontFamily': function(t) {
                    return -1 != t.indexOf('roboto') ? 'Roboto' : -1 != t.indexOf('oswald') ? 'Oswald' : 'Ubuntu';
                },
                'setFontWeight': function(t) {
                    return -1 != t.indexOf('bold') ? 700 : 400;
                },
                'setThemeMenu': function() {
                    var t = this;
                    s('#theme').append('<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"' + h['basicTheming'] + '\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"' + h['menuTheming'] + '\"></a></li><li class=\"theme-hud-tab\"><a href=\"#theme-hud\" class=\"ogicon-display\" data-toggle=\"tab-tooltip\" title=\"' + h['hudTheming'] + '\"></a></li><li class=\"theme-chat-tab\"><a href=\"#theme-chat\" class=\"ogicon-bubbles\" data-toggle=\"tab-tooltip\" title=\"' + h['chatTheming'] + '\"></a></li><li class=\"theme-minimap-tab\"><a href=\"#theme-minimap\" class=\"ogicon-location2\" data-toggle=\"tab-tooltip\" title=\"' + h['miniMapTheming'] + '\"></a></li><li class=\"theme-images-tab\"><a href=\"#theme-images\" class=\"ogicon-compass\" data-toggle=\"tab-tooltip\" title=\"' + h['imagesTheming'] + '\"></a></li></ul><div id=\"theme-main\" class=\"submenu-panel\"></div><div id=\"theme-menu\" class=\"submenu-panel\"></div><div id=\"theme-hud\" class=\"submenu-panel\"></div><div id=\"theme-chat\" class=\"submenu-panel\"></div><div id=\"theme-minimap\" class=\"submenu-panel\"></div><div id=\"theme-images\" class=\"submenu-panel\"></div>'), this['addPresetBox']('#theme-main', 'themePreset', f, 'preset', 'changeThemePreset'), this['addColorBox']('#theme-main', 'bgColor', 'setBgColor'), this['addColorBox']('#theme-main', 'bordersColor'), this['addColorBox']('#theme-main', 'gridColor'), this['addColorBox']('#theme-main', 'sectorsColor'), this['addColorBox']('#theme-main', 'namesColor'), this['addColorBox']('#theme-main', 'namesStrokeColor'), this['addColorBox']('#theme-main', 'massColor'), this['addColorBox']('#theme-main', 'massStrokeColor'), this['addColorBox']('#theme-main', 'virusColor'), this['addColorBox']('#theme-main', 'virusStrokeColor'), this.addColorBox('#theme-main', 'mVirusColor'), this.addColorBox('#theme-main', 'mVirusStrokeColor'), this['addColorBox']('#theme-main', 'foodColor', 'setFoodColor'), this['addColorBox']('#theme-main', 'teammatesIndColor', 'setIndicatorColor'), this['addColorBox']('#theme-main', 'cursorTrackingColor'), this['addColorBox']('#theme-main', 'splitRangeColor'), this['addColorBox']('#theme-main', 'safeAreaColor'), this['addColorBox']('#theme-main', 'dangerAreaColor'), this['addColorBox']('#theme-main', 'ghostCellsColor'), this['addFontBox']('#theme-main', 'namesFont'), this['addFontBox']('#theme-main', 'massFont'), this['addFontBox']('#theme-main', 'sectorsFont'), this['addSliderBox']('#theme-main', 'sectorsFontSize', 200, 2000, 10), this['addSliderBox']('#theme-main', 'namesScale', 0.5, 2, 0.1), this['addSliderBox']('#theme-main', 'massScale', 1, 5, 1), this['addSliderBox']('#theme-main', 'virMassScale', 1, 5, 1), this['addSliderBox']('#theme-main', 'strokeScale', 1, 4, 0.1), this['addSliderBox']('#theme-main', 'foodSize', 1, 50, 1, 'setFoodColor'), this['addSliderBox']('#theme-main', 'virusStrokeSize', 2, 40, 1), this['addSliderBox']('#theme-main', 'bordersWidth', 2, 200, 2), this['addSliderBox']('#theme-main', 'sectorsWidth', 2, 200, 2), this['addSliderBox']('#theme-main', 'cellsAlpha', 0.01, 0.99, 0.01), this['addSliderBox']('#theme-main', 'skinsAlpha', 0.01, 0.99, 0.01), this['addSliderBox']('#theme-main', 'virusAlpha', 0, 1, 0.01), this['addSliderBox']('#theme-main', 'textAlpha', 0.1, 1, 0.01), this['addSliderBox']('#theme-main', 'ghostCellsAlpha', 0.01, 0.99, 0.01), this['addPresetBox']('#theme-menu', 'menuPreset', m, 'menuPreset', 'changeMenuPreset'), this['addSliderBox']('#theme-menu', 'menuOpacity', 0.1, 1, 0.01, 'setMenuOpacity'), this['addColorBox']('#theme-menu', 'menuMainColor', 'setMenuMainColor'), this['addColorBox']('#theme-menu', 'menuBtnTextColor', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'menuPanelColor', 'setMenuPanelColor'), this['addColorBox']('#theme-menu', 'menuPanelColor2', 'setMenuPanelColor'), this['addColorBox']('#theme-menu', 'menuTextColor', 'setMenuTextColor'), this['addColorBox']('#theme-menu', 'menuTextColor2', 'setMenuTextColor'), this['addColorBox']('#theme-menu', 'btn1Color', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn1Color2', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn2Color', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn2Color2', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn3Color', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn3Color2', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn4Color', 'setMenuButtons'), this['addColorBox']('#theme-menu', 'btn4Color2', 'setMenuButtons'), this['addInputBox']('#theme-menu', 'menuBg', 'Image URL', 'setMenuBg'), this['addColorBox']('#theme-hud', 'hudMainColor', 'setHudColors'), this['addRgbaColorBox']('#theme-hud', 'hudColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'hudTextColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'statsHudColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'timeHudColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'top5MassColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'lbMeColor', 'setHudColors'), this['addColorBox']('#theme-hud', 'lbTeammateColor', 'setHudColors'), this['addFontBox']('#theme-hud', 'hudFont', 'setHudFont'), this['addSliderBox']('#theme-hud', 'hudScale', 1, 2, 0.01, 'setHudScale'), this['addRgbaColorBox']('#theme-chat', 'messageColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'messageTextColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'messageTimeColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'messageNickColor', 'setChatColors'), this['addRgbaColorBox']('#theme-chat', 'commandsColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'commandsTextColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'commandsTimeColor', 'setChatColors'), this['addColorBox']('#theme-chat', 'commandsNickColor', 'setChatColors'), this['addRgbaColorBox']('#theme-chat', 'chatBoxColor', 'setChatColors'), this['addSliderBox']('#theme-chat', 'chatScale', 1, 2, 0.01, 'setChatScale'), this['addColorBox']('#theme-minimap', 'miniMapSectorsColor', 'setMiniMapSectorsColor'), this['addColorBox']('#theme-minimap', 'miniMapSectorColor'), this['addColorBox']('#theme-minimap', 'miniMapNickColor'), this['addColorBox']('#theme-minimap', 'miniMapNickStrokeColor'), this['addColorBox']('#theme-minimap', 'miniMapMyCellColor'), this['addColorBox']('#theme-minimap', 'miniMapMyCellStrokeColor'), this['addColorBox']('#theme-minimap', 'miniMapTeammatesColor'), this['addColorBox']('#theme-minimap', 'miniMapDeathLocationColor'), this['addColorBox']('#theme-minimap', 'miniMapGuidesColor'), this['addColorBox']('#theme-minimap', 'miniMapGhostCellsColor'), this['addFontBox']('#theme-minimap', 'miniMapFont', 'setMiniMapFont'), this['addFontBox']('#theme-minimap', 'miniMapNickFont'), this['addSliderBox']('#theme-minimap', 'miniMapWidth', 200, 400, 2, 'setMiniMapWidth'), this['addSliderBox']('#theme-minimap', 'miniMapSectorsOpacity', 0, 1, 0.01, 'setMiniMapSectorsOpacity'), this['addSliderBox']('#theme-minimap', 'miniMapNickSize', 8, 16, 1), this['addSliderBox']('#theme-minimap', 'miniMapNickStrokeSize', 0, 6, 1), this['addSliderBox']('#theme-minimap', 'miniMapMyCellSize', 4, 10, 0.5), this['addSliderBox']('#theme-minimap', 'miniMapMyCellStrokeSize', 0, 10, 1), this['addSliderBox']('#theme-minimap', 'miniMapTeammatesSize', 4, 10, 0.5), this['addSliderBox']('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01), this['addInputBox']('#theme-images', 'customBackground', 'Image URL', 'setCustomBackground'), this['addInputBox']('#theme-images', 'customCursor', 'Cursor image URL', 'setCustomCursor');
                    for (var e = 'https://jimboy3100.github.io/cursors/cursor_', i = 0; i < 35; i++) i < 9 ? this['addCursorBox']('#theme-images', e + '0' + (i + 1) + '.cur') : this['addCursorBox']('#theme-images', e + '' + (i + 1) + '.cur');
                    s(document).on('click', '#theme-images .cursor-box a', function(e) {
                        e.preventDefault();
                        var i = s('img', this)['attr']('src');
                        g.customCursor = i, t['setCustomCursor'](), s('#customCursor').val(i), s('#theme-images .cursor-box a').removeClass('active'), s(this).addClass('active');
                    }), s('#theme').append('<button class=\"btn btn-block btn-success btn-save\"\">' + h['saveSett'] + '</button>'), s(document).on('click', '#theme .btn-save', function(e) {
                        e.preventDefault();
                        var i = s(this);
                        i.text(h['saved']), t['saveThemeSettings'](), setTimeout(function() {
                            i.text(h['saveSett']);
                        }, 500);
                    }), s('#theme').append('<div class=\"restore-settings\"><a href=\"#\">' + h['restoreThemeSettings'] + '</a></div>'), s(document).on('click', '#theme .restore-settings a', function(e) {
                        e.preventDefault(), t['restoreThemeSettings']();
                    }), s('.skin').colorpicker({
                        'format': 'hex',
                        'input': '#color'
                    });
                },
                'changePreset': function(t, e) {
                    if (e[t]) {
                        g[t] = t;
                        t = e[t];
                        for (var o in t) t.hasOwnProperty(o) && g.hasOwnProperty(o) && (g[o] = t[o], i.hasOwnProperty(o) && (i[o] = g[o]), s('#theme .' + o + '-picker') && s('#theme .' + o + '-picker').colorpicker('setValue', g[o]), s('#' + o + '-slider') && s('#' + o + '-slider').val(g[o])['change'](), (s('input[type=text]#' + o) || s('select#' + o)) && s('#' + o).val(g[o]));
                    }
                },
                'changeThemePreset': function(t) {
                    this.changePreset(t, f), this.setTheme();
                },
                'setFonts': function() {
                    this.setFont('namesFont', g.namesFont), this.setFont('massFont', g.namesFont), this.setFont('sectorsFont', g.sectorsFont);
                },
                'setBgColor': function() {
                    s('body').css('background-color', g.bgColor);
                },
                'setFoodColor': function() {
                    v['optimizedFood'] && ogarfooddrawer && ogarfooddrawer.preDrawPellet();
                },
                'setIndicatorColor': function() {
                    ogarfooddrawer && ogarfooddrawer.preDrawIndicator();
                },
                'setCustomBackground': function() {
                    g['customBackground'] ? s('body').css('background-image', 'url(' + g['customBackground'] + ')') : s('body')['css']('background-image', 'none');
                },
                'setCustomCursor': function() {
                    if (g.customCursor) var t = '*{cursor:url(' + g.customCursor + '), auto !important}';
                    else t = '*{cursor: auto}';
                    this.addCustomCSS('cursorCSS', t);
                },
                'setMenu': function() {
                    this.setMenuOpacity(), this.setMenuMainColor(), this['setMenuPanelColor'](), this['setMenuTextColor'](), this['setMenuButtons'](), this['setMenuBg']();
                },
                'changeMenuPreset': function(t) {
                    this.changePreset(t, m), this['setMenu']();
                },
                'setMenuOpacity': function() {
                    s('#helloContainer, #hotkeys, #exp-imp')['css']('opacity', g['menuOpacity']);
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
                    s('#menuBg').val(g['menuBg']), g['menuBg'] ? s('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'url(' + g['menuBg'] + ')') : s('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'none');
                },
                'setHud': function() {
                    this['setHudColors'](), this['setHudFont'](), this['setHudScale']();
                },
                'setHudColors': function() {
                    var t = '.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:' + g['hudMainColor'] + '}.hud,.hud-b,#chat-emoticons{background-color:' + g['hudColor'] + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + g['hudTextColor'] + '}.stats-hud-color{color:' + g['statsHudColor'] + '}.time-hud-color{color:' + g['timeHudColor'] + '}.top5-mass-color{color:' + g['top5MassColor'] + '}#leaderboard-positions .me{color:' + g['lbMeColor'] + '}#leaderboard-positions .teammate{color:' + g['lbTeammateColor'] + '}';
                    this.addCustomCSS('hudCSS', t);
                },
                'setHudFont': function() {
                    this.setFont('hudFont', g['hudFont']), s('#overlays-hud').css({
                        'font-family': g['hudFontFamily'],
                        'font-weight': g['hudFontWeight']
                    });
                },
                'setHudScale': function() {
                    var t = Math.round(20 * g['hudScale']),
                        e = Math.round(200 * g['hudScale']),
                        i = Math['floor'](55 * g['hudScale']),
                        o = Math['floor'](6 * g['hudScale']),
                        a = Math['floor'](280 * g['hudScale']),
                        n = Math['floor'](85 * g['hudScale']),
                        r = Math['floor'](20 * g['hudScale']);
                    s('#overlays-hud')['css']('font-size', t + 'px'), s('#leaderboard-hud, #time-hud')['width'](e), s('#top5-hud')['width'](e + 30).css('top', i + 'px'), s('#top5-pos').css('padding-left', o + 'px'), s('#time-hud').css('top', a + 'px'), s('#pause-hud')['css']('top', n + 'px'), s('#target-hud').css('padding-top', r + 'px');
                },
                'setChat': function() {
                    this['setChatColors'](), this['setChatScale']();
                },
                'setChatColors': function() {
                    var t = '#message,#messages li,.toast-success{background-color:' + g['messageColor'] + '}#message,.message-text,.toast-success .message-text{color:' + g['messageTextColor'] + '}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:' + g['messageNickColor'] + '}.message-time{color:' + g['messageTimeColor'] + '}.toast-warning{background-color:' + g['commandsColor'] + '}.command-text,.toast-warning .command-text{color:' + g['commandsTextColor'] + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + g['commandsNickColor'] + '}.command-time{color:' + g['commandsTimeColor'] + '}#chat-box{background-color:' + g['chatBoxColor'] + '}';
                    this.addCustomCSS('chatCSS', t);
                },
                'setChatScale': function() {
                    var t = Math.round(14 * g['chatScale']),
                        e = Math.round(280 * g['chatScale']),
                        i = Math.round(350 * g['chatScale']),
                        o = Math.round(300 * g['chatScale']),
                        a = Math['floor'](14 * g['chatScale']);
                    s('#message-box, #messages, #toast-container, #chat-box')['css']('font-size', t + 'px'), s('#messages, #toast-container, #chat-box')['width'](e), s('#message-box')['width'](i), s('#chat-box')['height'](o), s('.user-list').css('padding-left', a + 'px');
                    var n = '#toast-container{width:' + e + 'px;font-size:' + t + 'px}';
                    this.addCustomCSS('chatScaleCSS', n);
                },
                'setMiniMap': function() {
                    this['setMiniMapFont'](), this['setMiniMapWidth'](), this['setMiniMapSectorsOpacity']();
                },
                'setMiniMapFont': function() {
                    this.setFont('miniMapFont', g['miniMapFont']), ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapWidth': function() {
                    var t = g['miniMapWidth'] / 200;
                    g['miniMapTop'] = Math.round(20 * t), s('#minimap-hud').css({
                        'width': g['miniMapWidth'],
                        'height': g['miniMapWidth'] + g['miniMapTop']
                    }), ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapSectorsColor': function() {
                    ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapSectorsOpacity': function() {
                    s('#minimap-sectors').css('opacity', g['miniMapSectorsOpacity']);
                },
                'setTheme': function() {
                    this['setFonts'](), this['setBgColor'](), this['setCustomBackground'](), this['setCustomCursor'](), this['setMenu'](), this['setHud'](), this['setChat'](), this['setMiniMap']();
                },
                'init': function() {
                    this['loadThemeSettings']();
                }
            },
            ogario1PlayerProfiles = [],
            ogarcopythelb = {
                'nick': 'I<3Legendmod',
                'clanTag': 'Ⓜ',
                'skinURL': '',
                'color': g['mainColor']
            },
            v = {
                'quickResp': !0,
                'autoResp': !1,
                'autoZoom': !1,
                'autoHideNames': !0,
                'autoHideMass': !0,
                'autoHideFood': !1,
                'autoHideFoodOnZoom': !1,
                'noNames': !1,
                'optimizedNames': !0,
                'hideMyName': !0,
                'hideTeammatesNames': !1,
                'showMass': !0,
                'optimizedMass': !0,
                'shortMass': !0,
                'virMassShots': !0,
                'hideMyMass': !1,
                'hideEnemiesMass': !1,
                'vanillaSkins': !1,
                'customSkins': !0,
                'myTransparentSkin': !1,
                'myCustomColor': !1,
                'transparentCells': !1,
                'transparentViruses': !0,
                'transparentSkins': !1,
                'showGrid': !1,
                'showBgSectors': !1,
                'showMapBorders': !0,
                'showGhostCells': !1,
                'showMiniMap': !0,
                'showMiniMapGrid': !1,
                'showMiniMapGuides': !0,
                'showMiniMapGhostCells': !0,
                'oneColoredTeammates': !1,
                'optimizedFood': !0,
                'rainbowFood': !1,
                'oppColors': !1,
                'oppRings': !1,
                'virColors': !1,
                'splitRange': !1,
                'virusesRange': !1,
                'textStroke': !1,
                'namesStroke': !1,
                'massStroke': !1,
                'cursorTracking': !1,
                'teammatesInd': !1,
                'mouseSplit': !1,
                'mouseFeed': !1,
                'mouseInvert': !1,
                'disableChat': !1,
                'hideChat': !1,
                'chatSounds': !0,
                'chatEmoticons': !0,
                'showChatBox': !1,
                'showChatImages': !0,
                'showChatVideos': !0,
                'showTop5': !0,
                'showTargeting': !0,
                'showLbData': !0,
                'showTime': !0,
                'normalLb': !1,
                'centeredLb': !0,
                'fpsAtTop': !0,
                'showStats': !0,
                'showStatsMass': !0,
                'showStatsSTE': !1,
                'showStatsN16': !1,
                'showStatsFPS': !0,
                'blockPopups': !1,
                'streamMode': !1,
                'hideSkinUrl': !1,
                'showQuickMenu': !0,
                'showSkinsPanel': !0,
                'animation': 140,
                'zoomSpeedValue': 0.9,
                'messageSound': 'https://jimboy3100.github.io/sounds/notification_01.mp3',
//                'commandSound': 'https://jimboy3100.github.io/sounds/notification_02.mp3'
                'commandSound': 'https://jimboy3100.github.io/sounds/chat-message.mp3'
            };
			window.legendmod4= c;
        var ogarminimapdrawer = {
            'name': 'LM express',
            'version': 'v1',
            'privateMode': !1,
            'protocolMode': !0,
            'publicIP': 'wss://srv.ogario.eu',
            'privateIP': null,
            'updateInterval': 1000,
            'updateTick': 0,
            'updateMaxTick': 2,
            'currentSector': '',
            'miniMap': null,
            'miniMapCtx': null,
            'miniMapSectors': null,
            'pi2': 2 * Math['PI'],
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
            'skipServerData': !1,
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
            'lastMessageSentTime': Date['now'](),
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
            'selectBiggestCell': !0,
            'noColors': !1,
            'skipStats': !1,
            'showQuest': !1,
            'showSplitInd': !1,
            'pause': !1,
            'targetID': 0,
            'targetStatus': 0,
            'targetNick': '',
            'targetSkinURL': '',
            'targeting': !1,
            'privateMiniMap': !1,
            'messageSound': null,
            'commandSound': null,
            'feedInterval': null,
            'getPlayerX': function() {
                return i['playerX'] + i['mapOffsetX'];
            },
            'getPlayerY': function() {
                return i['playerY'] + i['mapOffsetY'];
            },
            'feed': function() {
                e.core && e.core.eject && e.core.eject();
            },
            'macroFeed': function(t) {
                if (t) {
                    if (this.feedInterval) return;
                    var e = this;
                    this.feed(), this.feedInterval = setInterval(function() {
                        e.feed();
                    }, 80);
                } else this.feedInterval && (clearInterval(this.feedInterval), this.feedInterval = null);
            },
            'split': function() {
                e.core && e.core.split && e.core.split();
            },
            'doubleSplit': function() {
                var t = this;
                t.split(), setTimeout(function() {
                    t.split();
                }, 40);
            },
            'popSplit': function() {
                var t = this;
                t.split(), setTimeout(function() {
                    t.split();
                }, 200);
            },
            'split16': function() {
                var t = this;
                t.split(), setTimeout(function() {
                    t.split();
                }, 40), setTimeout(function() {
                    t.split();
                }, 80), setTimeout(function() {
                    t.split();
                }, 0x78);
            },
            'toggleSkins': function() {
                i['vanillaSkins'] && i['customSkins'] ? i['vanillaSkins'] = !1 : !i['vannillaSkins'] && i['customSkins'] ? (i['vanillaSkins'] = !0, i['customSkins'] = !1) : (i['vanillaSkins'] = !0, i['customSkins'] = !0);
            },
            'toggleCells': function() {
                this['selectBiggestCell'] = !this['selectBiggestCell'], i['selectBiggestCell'] = this['selectBiggestCell'];
            },
            'setShowTop5': function() {
                v['showTop5'] = !v['showTop5'], this['setTop5']();
            },
            'setTop5': function() {
                v['showTop5'] ? s('#top5-hud').show() : s('#top5-hud').hide();
            },
            'setShowTargeting': function() {
                v['showTargeting'] = !v['showTargeting'], this['setTargetingHUD']();
            },
            'setTargetingHUD': function() {
                v['showTargeting'] ? s('#target-hud, #target-panel-hud').show() : s('#target-hud, #target-panel-hud').hide();
            },
            'setShowTime': function() {
                v['showTime'] = !v['showTime'], v['showTime'] ? (s('#time-hud').show(), this['displayTime']()) : s('#time-hud').hide();
            },
            'setShowSplitRange': function() {
                v['splitRange'] = !v['splitRange'], i['splitRange'] = v['splitRange'];
            },
            'setShowSplitInd': function() {
                this['showSplitInd'] = !this['showSplitInd'], v['splitRange'] = this['showSplitInd'], v['oppRings'] = this['showSplitInd'], i['splitRange'] = v['splitRange'], i['oppRings'] = v['oppRings'];
            },
            'setShowTeammatesInd': function() {
                v['teammatesInd'] = !v['teammatesInd'];
            },
            'setShowOppColors': function() {
                v['oppColors'] = !v['oppColors'], i['oppColors'] = v['oppColors'];
            },
            'setShowSkins': function() {
                this['noSkins'] = !this['noSkins'], e.core && e.core['setSkins'] && e.core['setSkins'](!this['noSkins']), i['showCustomSkins'] = !this['noSkins'], this['displayChatInfo'](!this['noSkins'], 'showSkinsMsg');
            },
            'setTransparentSkins': function() {
                v['transparentSkins'] = !v['transparentSkins'], i['transparentSkins'] = v['transparentSkins'];
            },
            'setShowStats': function() {
                s('#stats-hud')['toggle']();
            },
            'setShowFood': function() {
                i['showFood'] = !i['showFood'];
            },
            'setShowHUD': function() {
                s('#overlays-hud')['toggle']();
            },
            'setShowGrid': function() {
                v['showGrid'] = !v['showGrid'];
            },
            'setShowMiniMapGuides': function() {
                v['showMiniMapGuides'] = !v['showMiniMapGuides'];
            },
            'setShowLb': function() {
                ':teams' !== this['gameMode'] && s('#leaderboard-hud')['toggle']();
            },
            'setShowBgSectors': function() {
                v['showBgSectors'] = !v['showBgSectors'];
            },
            'setHideSmallBots': function() {
                i['hideSmallBots'] = !i['hideSmallBots'], this['displayChatInfo'](!i['hideSmallBots'], 'hideSmallBotsMsg');
            },
            'setShowNames': function() {
                v['noNames'] = !v['noNames'];
            },
            'setHideTeammatesNames': function() {
                v['hideTeammatesNames'] = !v['hideTeammatesNames'];
            },
            'setShowMass': function() {
                v['showMass'] = !v['showMass'];
            },
            'setShowMiniMap': function() {
                v['showMiniMap'] = !v['showMiniMap'], this['setMiniMap']();
            },
            'setMiniMap': function() {
                v['showMiniMap'] ? s('#minimap-hud').show() : s('#minimap-hud').hide();
            },
            'setShowQuest': function() {
                ':ffa' === this['gameMode'] && (this['showQuest'] = !this['showQuest'], this['setQuest']());
            },
            'setQuest': function() {
                this['showQuest'] && ':ffa' === this['gameMode'] ? s('#quest-hud').show() : s('#quest-hud').hide();
            },
            'toggleAutoZoom': function() {
                i['autoZoom'] = !i['autoZoom'], this['displayChatInfo'](i['autoZoom'], 'autoZoomMsg');
            },
            'resetZoom': function(t) {
                t ? (i['zoomResetValue'] = 1, i['zoomValue'] = 1) : i['zoomResetValue'] = 0;
            },
            'setZoom': function(t) {
                i['zoomValue'] = t;
            },
            'toggleDeath': function() {
                this['lastDeath']--, this['lastDeath'] < 0 && (this['lastDeath'] = this['deathLocations'].length - 1);
            },
            'tryResp': function() {
                if (i.play || 20 == this['retryResp']) this['retryResp'] = 0;
                else {
                    this['retryResp']++;
                    var t = this;
                    setTimeout(function() {
                        s('.btn-play-guest')['is'](':visible') ? s('.btn-play-guest')['click']() : s('.btn-play')['click'](), i.play || t['tryResp']();
                    }, 500);
                }
            },
            'quickResp': function() {
                v['quickResp'] && (this['hideMenu'](), this['gameServerConnect'](this['ws']), i.play = !1, this['tryResp']());
            },
            'autoResp': function() {
                v['autoResp'] && (this['setAutoResp'](), s('#overlays')['stop']().hide(), s('.btn-play-guest')['is'](':visible') ? s('.btn-play-guest')['click']() : s('.btn-play')['click']());
            },
            'setAutoResp': function() {
                v['autoResp'] && (s('#skipStats')['prop']('checked') || (s('#skipStats')['click'](), this['skipStats'] = !0));
            },
            'toggleAutoResp': function() {
                v['autoResp'] = !v['autoResp'], this['setAutoResp'](), this['displayChatInfo'](v['autoResp'], 'autoRespMsg');
            },
            'copyLb': function() {
                var t = s('<input>');
                s('body').append(t), t.val(s('#leaderboard-positions').text()).select();
                try {
                    document.execCommand('copy');
                } catch (ogarcopierlbcather) {}
                t.remove();
            },
            'setPause': function() {
                this.pause = !this.pause, i.pause = this.pause, this.pause ? (i['resetTargetPosition'](), s('#pause-hud').show()) : s('#pause-hud').hide();
            },
            'setCenteredLb': function() {
                v['centeredLb'] ? s('#leaderboard-hud').addClass('hud-text-center') : s('#leaderboard-hud').removeClass('hud-text-center');
            },
            'setNormalLb': function() {
                v['normalLb'] ? s('#leaderboard-hud h4').html(h['leaderboard']) : s('#leaderboard-hud h4').html('legendmod.ml');
            },
            'setFpsAtTop': function() {
                v['fpsAtTop'] ? s('#stats-hud').removeClass('hud-bottom').addClass('hud-top') : s('#stats-hud').removeClass('hud-top').addClass('hud-bottom');
            },
            'setBlockPopups': function() {
                this['protocolMode'] ? s('#block-warn').hide() : v['blockPopups'] ? this['blockPopups']() : this['unblockPopups']();
            },
            'blockPopups': function() {
                s('#openfl-content, #openfl-overlay').hide(), s('#openfl-content, #openfl-overlay').addClass('block-popups'), s('#freeCoins, #gifting, #openShopBtn, #dailyQuests')['prop']('disabled', !0), s('#block-warn').show();
            },
            'unblockPopups': function() {
                s('#openfl-overlay.disabler')['click'](), s('#openfl-content, #openfl-overlay').hide(), s('#openfl-content, #openfl-overlay').removeClass('block-popups'), s('#freeCoins, #gifting, #openShopBtn, #dailyQuests')['prop']('disabled', !1), s('#block-warn').hide();
            },
            'tempUnblockPopups': function() {
                v['blockPopups'] && this['unblockPopups']();
            },
            'displayLeaderboard': function(t, e = '') {
                this['leaderboardPositionsHUD'] && (this['leaderboardPositionsHUD']['innerHTML'] = t, this['leaderboardDataHUD']['innerHTML'] = e);
            },
            'displayStats': function() {
                if (v['showStats']) {
                    var t = '';
                    i.play && (v['showStatsMass'] && i['playerMass'] && (t += h['mass'] + ': ' + i['playerMass'] + ' | '), i['playerScore'] && (t += h['score'] + ': ' + i['playerScore']), v['showStatsSTE'] && i['STE'] && (t += ' | STE: ' + i['STE']), v['showStatsN16'] && i['playerSplitCells'] && (t += ' | ' + i['playerSplitCells'] + '/16'), v['showStatsFPS'] && (t += ' | ')), v['showStatsFPS'] && (t += 'FPS: ' + ogarfooddrawer['fps']), this['statsHUD']['textContent'] = t;
                    var e = this;
                    setTimeout(function() {
                        e['displayStats']();
                    }, 250);
                } else s('#stats-hud').hide();
            },
            'displayTime': function() {
                if (v['showTime']) {
                    var t = new Date()['toLocaleString']();
                    this['timeHUD']['textContent'] = t;
                    var e = this;
                    setTimeout(function() {
                        e['displayTime']();
                    }, 1000);
                } else s('#time-hud').hide();
            },
            'displayParties': function() {
                for (var t = '', e = 0; e < this['parties'].length; e++) t += '<li><a href=\"https://agar.io/#' + this['parties'][e] + '\" onclick=\"$(\'#party-token\').val(\'' + this['parties'][e] + '\'); $(\'#join-party-btn-2\').click();\">https://agar.io/#' + this['parties'][e] + '</a></li>';
                this['activeParties']['className'] = '' === t ? 'no-parties' : '', this['activeParties']['innerHTML'] = t;
            },
            'displayTop5': function() {
                if (v['showTop5']) {
                    for (var t = '', e = 0, s = this['top5'].length, o = 0; o < s; o++) e += this['top5'][o]['mass'], o >= this['top5limit'] || (t += '<li><span class=\"cell-counter\" style=\"background-color: ' + this['top5'][o]['color'] + '\">' + (o + 1) + '</span>', v['showTargeting'] && (t += '<a href=\"#\" data-user-id=\"' + this['top5'][o]['id'] + '\" class=\"set-target ogicon-target\"></a> '), t += '<span class=\"hud-main-color\">[' + this['calculateMapSector'](this['top5'][o]['x'], this['top5'][o]['y']) + ']</span>', t += '<span class=\"top5-mass-color\">[' + this['shortMassFormat'](this['top5'][o]['mass']) + ']</span> ' + this['escapeHTML'](this['top5'][o]['nick']) + '</li>');
                    this['top5pos']['innerHTML'] = t, i.play && i['playerMass'] && (e += i['playerMass'], s++), this['top5totalMass']['textContent'] = this['shortMassFormat'](e), this['top5totalPlayers']['textContent'] = s;
                }
            },
            'setTop5limit': function(t) {
                t && (this['top5limit'] = t);
            },
            'displayChatHistory': function(t) {
                if (t) {
                    this['clearChatHistory'](!0);
                    for (var e = 0; e < this['chatHistory'].length; e++) s('#messages').append('<li><span class=\"message-nick\">' + this['chatHistory'][e]['nick'] + ': </span><span class=\"message-text\">' + this['chatHistory'][e]['message'] + '</span></li>');
                } else this['clearChatHistory'](!1);
            },
            'clearChatHistory': function(t) {
                s('#messages')['empty'](), t && (toastr['clear'](), v['showChatBox'] && (s('#chat-box .message').remove(), this['chatHistory'].length = 0));
            },
            'displayChatInfo': function(t, e) {
                t ? toastr['info'](h[e + 'A']) : toastr['error'](h[e + 'B']);
            },
            'setDisableChat': function() {
                v['hideChat'] = v['disableChat'], this['setHideChat']();
            },
            'hideChat': function() {
                v['hideChat'] = !v['hideChat'], this['setHideChat'](), this['displayChatInfo'](!v['hideChat'], 'hideChatMsg');
            },
            'setHideChat': function() {
                v['hideChat'] && s('#message-box').hide(), this['setShowChatBox']();
            },
            'setShowChatBox': function() {
                !v['hideChat'] && v['showChatBox'] ? s('#chat-box').show() : s('#chat-box').hide();
            },
            'enterChatMessage': function() {
                var t = s('#message-box'),
                    e = s('#message');
                if (t['is'](':visible')) {
                    var o = e.val();
                    o.length ? (this['sendChatMessage'](101, o), i.play && (e['blur'](), t.hide())) : (e['blur'](), t.hide()), e.val('');
                } else t.show(), e['focus'](), e.val('');
            },
            'showMenu': function(t) {
                if (e.MC && e.MC['showNickDialog']) return s('.ogario-menu').show(), s('.menu-panel').hide(), i.play || this['skipStats'] ? s('#main-panel').show() : s('#stats').show(), e.MC['showNickDialog'](300), s('#oferwallContainer')['is'](':visible') && e['closeOfferwall'](), void(s('#videoContainer')['is'](':visible') && e['closeVideoContainer']());
                t ? s('#overlays')['fadeIn'](t) : s('#overlays').show();
            },
            'hideMenu': function(t) {
                e.MC && e.MC['showNickDialog'] ? s('.ogario-menu').hide() : t ? s('#overlays')['fadeOut'](t) : s('#overlays').hide();
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
                for (var s in null !== e.localStorage.getItem('ogarioSettings') && (t = JSON.parse(e.localStorage.getItem('ogarioSettings'))), v) v.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (v[s] = t[s]), i.hasOwnProperty(s) && (i[s] = v[s]));
            },
            'saveSettings': function(t, i) {
                e.localStorage.setItem(i, JSON['stringify'](t));
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
                    if (t.hasOwnProperty(e)) s('#export-' + e)['prop']('checked') || delete t[e];
                }
                t = JSON.stringify(t), s('#export-settings').val(t), s('#import-settings').val(''), t = null;
            },
            'importSettings': function() {
                s('#import-settings')['blur']();
                var t = s('#import-settings').val();
                if (t) {
                    for (var i in t = JSON.parse(t))
                        if (t.hasOwnProperty(i)) {
                            if (!s('#import-' + i)['prop']('checked')) continue;
                            e.localStorage.setItem(i, JSON.stringify(t[i]));
                        } e['location'].reload();
                }
            },
            'restoreSettings': function() {
                null !== e.localStorage.getItem('ogarioSettings') && (e.localStorage.removeItem('ogarioSettings'), e['location'].reload());
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
                            this['displayTime'](), s('#time-hud').show();
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
                            this['displayStats'](), s('#stats-hud').show();
                            break;
                        case 'blockPopups':
                            this['setBlockPopups']();
                    }
                    this['saveSettings'](v, 'ogarioSettings');
                }
            },
            'loadProfiles': function() {
                if (null !== e.localStorage.getItem('ogarioPlayerProfiles')){ 
				ogario1PlayerProfiles = JSON.parse(e.localStorage.getItem('ogarioPlayerProfiles'))
				if (ogario1PlayerProfiles.length==10){ //fix for old players
                    for (var t = 10; t < 15; t++) ogario1PlayerProfiles.push({
                        'nick': 'Profile #' + (t + 1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': g['mainColor']
                    });					
				}
				}
                else{
                    for (var t = 0; t < 15; t++) ogario1PlayerProfiles.push({
                        'nick': 'Profile #' + (t + 1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': g['mainColor']
			});}
                null !== e.localStorage.getItem('ogarioSelectedProfile') && (this['selectedProfile'] = JSON['parse'](e.localStorage.getItem('ogarioSelectedProfile'))), ogarcopythelb['nick'] = ogario1PlayerProfiles[this['selectedProfile']]['nick'], ogarcopythelb['clanTag'] = ogario1PlayerProfiles[this['selectedProfile']]['clanTag'], ogarcopythelb['skinURL'] = ogario1PlayerProfiles[this['selectedProfile']]['skinURL'], ogarcopythelb['color'] = ogario1PlayerProfiles[this['selectedProfile']]['color'];
            },
            'changeSkinPreview': function(t, e) {
                t && e && ('skin-preview' === e ? (s('#skin-preview').removeClass('default').append('<a href=\"#\" id=\"skin-popover\" data-toggle=\"popover\" title=\"\" data-html=\"true\" data-content=\"<img src=\'' + t.src + '\' width=\'500\'>\"></a>'), s('#skin-popover').append(s(t)['fadeIn'](1000)), s('#skin-popover')['popover']()) : s('#' + e).removeClass('default').append(s(t)['fadeIn'](1000)));
            },
            'setSkinPreview': function(t, e) {
                if (s('#' + e)['empty']().addClass('default'), t && 0 != t.length) {
                    var i = this,
                        o = new Image();
                    o.crossOrigin = 'Anonymous', o.onload = function() {
                        i['changeSkinPreview'](o, e);
                    }, o.src = t;
                }
            },
            'setProfile': function() {
                var t = (ogario1PlayerProfiles.length + this['selectedProfile'] - 1) % ogario1PlayerProfiles.length,
                    e = (this['selectedProfile'] + 1) % ogario1PlayerProfiles.length;
					//console.log(ogario1PlayerProfiles.length);
                this['setSkinPreview'](ogario1PlayerProfiles[t]['skinURL'], 'prev-profile'), this['setSkinPreview'](ogario1PlayerProfiles[this['selectedProfile']]['skinURL'], 'skin-preview'), this['setSkinPreview'](ogario1PlayerProfiles[e]['skinURL'], 'next-profile'), this['saveSettings'](this['selectedProfile'], 'ogarioSelectedProfile'), s('#nick').val(ogario1PlayerProfiles[this['selectedProfile']]['nick']), s('#clantag').val(ogario1PlayerProfiles[this['selectedProfile']]['clanTag']), s('#skin').val(ogario1PlayerProfiles[this['selectedProfile']]['skinURL']), s('#color').val(ogario1PlayerProfiles[this['selectedProfile']]['color']), s('.skin')['colorpicker']('setValue', ogario1PlayerProfiles[this['selectedProfile']]['color']), s('#skins a').removeClass('selected'), s('#skins a[data-profile=\'' + this['selectedProfile'] + '\']').addClass('selected');
            },
            'prevProfile': function() {
                this['setPlayerSettings'](), this['selectedProfile'] = (ogario1PlayerProfiles.length + this['selectedProfile'] - 1) % ogario1PlayerProfiles.length, this['setProfile']();
            },
            'nextProfile': function() {
                this['setPlayerSettings'](), this['selectedProfile'] = (this['selectedProfile'] + 1) % ogario1PlayerProfiles.length, this['setProfile']();
            },
            'selectProfile': function(t) {
                this['setPlayerSettings'](), this['selectedProfile'] = parseInt(t), this['setProfile']();
            },
            'addOption': function(t, e, i, o) {
                s(t).append('<label><input type=\"checkbox\" id=\"' + e + '\" class=\"js-switch\"> ' + i + '</label>'), s('#' + e)['prop']('checked', o);
            },
            'addOptions': function(t, e) {
                if (t) {
                    s('#og-options').append('<div class=\"options-box ' + e + '\"><h5 class=\"menu-main-color\">' + h[e] + '</h5></div>');
                    for (var i = 0; i < t.length; i++) {
                        var o = t[i];
                        v.hasOwnProperty(o) && (s('.' + e).append('<label>' + h[o] + ' <input type=\"checkbox\" class=\"js-switch\" id=\"' + o + '\"></label>'), s('#' + o)['prop']('checked', v[o]));
                    }
                }
            },
            'addInputBox': function(t, e, i, o) {
                s(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + v[e] + '\" /></div>');
                var a = this;
                s('#' + e).on('input', function() {
                    v[e] = this.value, a[o](), a['saveSettings'](v, 'ogarioSettings');
                });
            },
            'addSliderBox': function(t, e, o, a, n, r) {
                s(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + v[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + v[e] + '\"></div>');
                var l = this;
                r ? s('#' + e + '-slider').on('input', function() {
                    var t = parseFloat(s(this).val());
                    s('#' + e + '-value').text(t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r](), l['saveSettings'](v, 'ogarioSettings');
                }) : s('#' + e + '-slider').on('input', function() {
                    var t = parseFloat(s(this).val());
                    s('#' + e + '-value').text(t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l['saveSettings'](v, 'ogarioSettings');
                });
            },
            'setLang': function() {
                if ('pl' === r && e['i18n_dict'] && e['i18n_dict']['en'])
                    for (var t in e['i18n_dict']['en']) e['i18n_dict']['en'].hasOwnProperty(t) && h.hasOwnProperty(t) && (e['i18n_dict']['en'][t] = h[t]);
            },
            'setMenu': function() {
                for (var t in document['title'] = this['name'], s('#mainPanel')['before']('<div id=\"exp-bar\" class=\"agario-panel\"><span class=\"ogicon-user\"></span><div class=\"agario-exp-bar progress\"><span class=\"progress-bar-text\"></span><div class=\"progress-bar progress-bar-striped\" style=\"width: 0%;\"></div></div><div class=\"progress-bar-star\"></div></div><div id=\"main-menu\" class=\"agario-panel\"><ul class=\"menu-tabs\"><li class=\"start-tab active\"><a href=\"#main-panel\" class=\"active ogicon-home\" data-toggle=\"tab-tooltip\" title=\"' + h['start'] + '\"></a></li><li class=\"profile-tab\"><a href=\"#profile\" class=\"ogicon-user\" data-toggle=\"tab-tooltip\" title=\"' + h['profile'] + '\"></a></li><li class=\"settings-tab\"><a href=\"#og-settings\" class=\"ogicon-cog\" data-toggle=\"tab-tooltip\" title=\"' + h['settings'] + '\"></a></li><li class=\"theme-tab\"><a href=\"#theme\" class=\"ogicon-droplet\" data-toggle=\"tab-tooltip\" title=\"' + h['theme'] + '\"></a></li><li class=\"hotkeys-tab\"><a href=\"#\" class=\"hotkeys-link ogicon-keyboard\" data-toggle=\"tab-tooltip\" title=\"' + h['hotkeys'] + '\"></a></li><li class=\"music-tab\"><a href=\"#music\" class=\"ogicon-music\" data-toggle=\"tab-tooltip\" title=\"Radio / ' + h['sounds'] + '\"></a></li></ul><div id=\"main-panel\" class=\"menu-panel\"></div><div id=\"profile\" class=\"menu-panel\"></div><div id=\"og-settings\" class=\"menu-panel\"><div class=\"submenu-panel\"></div></div><div id=\"theme\" class=\"menu-panel\"></div><div id=\"music\" class=\"menu-panel\"></div></div>'), s('#main-panel').append('<a href=\"#\" class=\"quick quick-menu ogicon-menu\"></a><a href=\"#\" class=\"quick quick-skins ogicon-images\"></a><div id=\"profiles\"><div id=\"prev-profile\"></div><div id=\"skin-preview\"></div><div id=\"next-profile\"></div></div>'), s('#mainPanel div[role=form]').appendTo(s('#main-panel')), s('#main-panel div[role=form] .form-group:first').remove(), s('#nick')['before']('<input id=\"clantag\" class=\"form-control\" placeholder=\"Tag, e.g. Ⓜ\" maxlength=\"10\"><div class=\"input-group nick\"></div>'), s('#nick').appendTo(s('.nick')), s('.nick').append('<span class=\"input-group-btn\"><button id=\"stream-mode\" class=\"btn active ogicon-eye\"></button></span>'), s('.nick')['after']('<div class=\"input-group skin\"><input id=\"skin\" class=\"form-control\" placeholder=\"Skin URL (imgur.com direct link)\" maxlength=\"40\"><input type=\"hidden\" id=\"color\" value=\"' + ogarcopythelb['color'] + '\" maxlength=\"7\" /><span class=\"input-group-addon\"><i></i></span><span class=\"input-group-btn\"><button id=\"hide-url\" class=\"btn active ogicon-eye\"></button></span></div>'), s('#locationKnown, #locationUnknown')['insertAfter'](s('.skin')), s('#region')['before']('<button class=\"btn btn-warning btn-server-info ogicon-cogs\"></button>'), s('.btn-spectate, .btn-logout').appendTo('#agario-main-buttons'), s('#agario-main-buttons').addClass('clearfix')['before']('<div id=\"server-info\" class=\"form-group clearfix\"><input id=\"server-ws\" class=\"form-control\" placeholder=\"Server WS\"><button id=\"server-connect\" class=\"btn btn-success ogicon-power\"></button><button id=\"server-reconnect\" class=\"btn btn-primary ogicon-redo2\"></button><input id=\"server-token\" class=\"form-control\" placeholder=\"Server token\"><button id=\"server-join\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button></div>'), s('#helloContainer div[role=form]')['after']('<div id=\"ogario-party\" class=\"clearfix\"><input id=\"party-token\" class=\"form-control\" placeholder=\"Party token\"></div>'), s('#ogario-party').append('<button id=\"join-party-btn-2\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button><button id=\"create-party-btn-2\" class=\"btn btn-primary\" data-itr=\"page_create_party\">Create</button>'), s('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first').appendTo(s('#ogario-party')), s('#settingsChoice, #options').appendTo(s('#og-settings .submenu-panel')), s('#stats').appendTo(s('#main-menu')).addClass('menu-panel'), s('#statsContinue')['attr']('id', 'statsContinue2'), s('#mainPanel')['empty']().remove(), s('.center-container').addClass('ogario-menu'), s('.center-container').append('<div id=\"menu-footer\" class=\"menu-main-color\">' + h['visit'] + ' <a href=\"http://legendmod.ml\" target=\"_blank\">legendmod.ml</a> | ' + this['version'] + ' <a href=\"https://goo.gl/nRREoR\" class=\"release ogicon-info\" target=\"_blank\"></a></div>'), s('#leftPanel, #rightPanel').addClass('ogario-menu')['removeAttr']('id'), s('.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel').appendTo(s('#profile')).removeClass('agario-side-panel'), s('.agario-profile-panel')['after']('<div id=\"block-warn\">' + h['blockWarn'] + '<br><a href=\"#\" id=\"unblock-popups\">' + h['unblockPopups'] + '</a></div>'), s('#exp-bar').addClass('agario-profile-panel'), s('.left-container')['empty'](), s('.agario-shop-panel')['after']('<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: ℄)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>'), s('#tags-container').appendTo(s('#profile')), s('.btn-logout').appendTo(s('#profile')), s('.left-container').append('<div id=\"quick-menu\" class=\"agario-panel agario-side-panel\"><a href=\"https://ogario.ovh/skins/\" class=\"quick-more-skins ogicon-grin\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + h['skins'] + '\"></a><a href=\"https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w\" class=\"quick-yt ogicon-youtube2\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"Team OGARio\"></a></div>'), this['protocolMode'] || s('#quick-menu')['prepend']('<a href=\"#\" class=\"quick-shop ogicon-cart\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + h['page_shop'] + '\"></a><a href=\"#\" class=\"quick-free-coins ogicon-coin-dollar\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + h['page_menu_main_free_coins'] + '\"></a><a href=\"#\" class=\"quick-free-gifts ogicon-gift\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + h['page_menu_main_gifts'] + '\"></a><a href=\"#\" class=\"quick-quests ogicon-trophy\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + h['page_menu_main_dailyquests'] + '\"></a>'), s('.party-dialog, .partymode-info').remove(), s('.agario-party-6').appendTo(s('.center-container')), s('.right-container')['empty'](), s('.right-container').append('<div class=\"agario-party\"></div>'), s('.agario-party-6').appendTo(s('.agario-party')).addClass('agario-panel agario-side-panel'), s('.agario-party h4, #cancel-party-btn').remove(), s('.agario-party .btn').addClass('btn-sm'), s('.right-container').append('<div id=\"skins-panel\" class=\"agario-panel agario-side-panel\"><div id=\"skins\"></div><a href=\"https://ogario.ovh/skins/\" id=\"more-skins\" class=\"btn btn-block btn-success\" target=\"_blank\">' + h['moreSkins'] + '</a></div>'), s('.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr=\'page_option_dark_theme\'], #options #darkTheme').remove(), s('#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom').css('display', 'none'), s('#advertisement').removeClass('agario-panel'), s('#adsBottom')['css']({
                        'z-index': '1',
                        'opacity': '0',
                        'bottom': '-100px'
                    }), s('#noNames, #showMass').remove(), s('#og-settings .submenu-panel').append('<div id=\"og-options\"></div>'), this['addOptions']([], 'animationGroup'), this['addOptions'](['autoZoom'], 'zoomGroup'), this['addOptions'](['quickResp', 'autoResp'], 'respGroup'), this['addOptions'](['noNames', 'optimizedNames', 'autoHideNames', 'hideMyName', 'hideTeammatesNames', 'namesStroke'], 'namesGroup'), this['addOptions'](['showMass', 'optimizedMass', 'autoHideMass', 'hideMyMass', 'hideEnemiesMass', 'shortMass', 'virMassShots', 'massStroke'], 'massGroup'), this['protocolMode'] ? this['addOptions'](['customSkins'], 'skinsGroup') : this['addOptions'](['customSkins', 'vanillaSkins'], 'skinsGroup'), this['addOptions'](['optimizedFood', 'autoHideFood', 'autoHideFoodOnZoom', 'rainbowFood'], 'foodGroup'), this['addOptions'](['myCustomColor', 'myTransparentSkin', 'transparentSkins', 'transparentCells', 'transparentViruses'], 'transparencyGroup'), this['addOptions'](['showGrid', 'showBgSectors', 'showMapBorders'], 'gridGroup'), this['addOptions'](['disableChat', 'chatSounds', 'chatEmoticons', 'showChatImages', 'showChatVideos', 'showChatBox'], 'chatGroup'), this['addOptions'](['showMiniMap', 'showMiniMapGrid', 'showMiniMapGuides', 'showMiniMapGhostCells', 'oneColoredTeammates'], 'miniMapGroup'), this['addOptions'](['oppColors', 'oppRings', 'virColors', 'splitRange', 'virusesRange', 'cursorTracking', 'teammatesInd', 'showGhostCells'], 'helpersGroup'), this['addOptions'](['mouseSplit', 'mouseFeed', 'mouseInvert'], 'mouseGroup'), this['addOptions'](['showTop5', 'showTargeting', 'showLbData', 'centeredLb', 'normalLb', 'fpsAtTop'], 'hudGroup'), this['addOptions'](['showStats', 'showStatsMass', 'showStatsSTE', 'showStatsN16', 'showStatsFPS', 'showTime'], 'statsGroup'), this['protocolMode'] || (this['addOptions'](['blockPopups'], 'extrasGroup'), s('#noSkins, #noColors, #skipStats, #showQuest').addClass('js-switch-vanilla'), s('.skinsGroup h5')['after']('<label class=\"noSkins\">' + h['noSkins'] + ' </label>'), s('#noSkins').appendTo(s('.noSkins')), s('.transparencyGroup h5')['after']('<label class=\"noColors\">' + h['noColors'] + ' </label>'), s('#noColors').appendTo(s('.noColors')), s('.extrasGroup h5')['after']('<label class=\"skipStats\">' + h['skipStats'] + ' </label>'), s('#skipStats').appendTo(s('.skipStats')), s('.skipStats')['after']('<label class=\"showQuest\">' + h['showQuest'] + ' </label>'), s('#showQuest').appendTo(s('.showQuest')), s('#options').remove(), s('#settingsChoice').appendTo(s('.extrasGroup')).addClass('select-wrapper')), this['addSliderBox']('.animationGroup', 'animation', 100, 200, 1), this['addSliderBox']('.zoomGroup', 'zoomSpeedValue', 0.50, 1.99, 0.01), s('#og-settings').append('<button class=\"btn btn-block btn-success btn-export\">' + h['exportImport'] + '</button>'), s('#og-settings').append('<div class=\"restore-settings\"><a href=\"#\">' + h['restoreSettings'] + '</a></div>'), s('#music').append('<div class=\"agario-panel radio-panel\"><h5 class=\"menu-main-color\">Radio (' + h['thanks'] + ')</h5><audio src=\"" controls></audio><span class=\"playlist\"><span class=\"ogicon-file-music\"></span> <a href=\"" target=\"_blank\">' + h['playlist'] + '</a></span></div>'), s('#music').append('<div class=\"agario-panel sounds-panel\"><h5 class=\"menu-main-color\">' + h['sounds'] + '</h5></div>'), s('#music').append('<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Legend Clan (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>'), this['addInputBox']('.sounds-panel', 'messageSound', 'Sound URL', 'setMessageSound'), this['addInputBox']('.sounds-panel', 'commandSound', 'Sound URL', 'setCommandSound'), s('body').append('<div id=\"overlays-hud\" data-gamemode=\":ffa\"><div id=\"stats-hud\" class=\"hud stats-hud-color\"></div> <div id=\"top5-hud\" class=\"hud\"><h5 class=\"hud-main-color\">Team top <span class=\"team-top\">5</span></h5><div class=\"hud-main-color team-top-menu\"><a href=\"#\" data-limit=\"5\" class=\"team-top-limit active\">5</a> | <a href=\"#\" data-limit=\"15\" class=\"team-top-limit\">10</a> | <a href=\"#\" data-limit=\"100\" class=\"team-top-limit\">100</a></div><ol id=\"top5-pos\"></ol><div id=\"top5-total\"><span class=\"hud-main-color ogicon-users\"></span> ' + h['totalPartyPlayers'] + ': <span id=\"top5-total-players\" class=\"top5-mass-color\">0</span><br><span class=\"hud-main-color ogicon-pacman\"></span> ' + h['totalPartyMass'] + ': <span id=\"top5-total-mass\" class=\"top5-mass-color\">0</span></div></div> <div id=\"time-hud\" class=\"hud time-hud-color\"></div> <div id=\"pause-hud\" class=\"hud\">' + h.pause + '</div> <div id=\"leaderboard-hud\" class=\"hud-b\"><h4 class=\"hud-main-color\">legendmod.ml</h4><div id=\"leaderboard-data\"></div><div id=\"leaderboard-positions\"></div></div> <div id=\"btl-leaderboard-hud\"><div class=\"hud hud-c\"><span id=\"btl-players-status\">Players ready</span>: <span id=\"btl-players-count\">0</span></div></div> <div id=\"minimap-hud\" class=\"hud-b\"><canvas id=\"minimap-sectors\"></canvas><canvas id=\"minimap\"></canvas></div><div id=\"target-hud\" class=\"hud\"><div id=\"target-player\"><span id=\"target-skin\"><img src=\"https://jimboy3100.github.io/banners/static/img/blank.png\" alt=\"\"> </span><span id=\"target-nick\"></span> <span id=\"target-status\" class=\"hud-main-color\">[' + h['targetNotSet'] + ']</span></div><div id=\"target-summary\"></div></div><div id=\"target-panel-hud\" class=\"hud\"><a href=\"#\" id=\"set-targeting\" class=\"ogicon-target\"></a><a href=\"#\" id=\"set-private-minimap\" class=\"ogicon-location2\"></a><a href=\"#\" id=\"cancel-targeting\" class=\"ogicon-cancel-circle\"></a><a href=\"#\" id=\"change-target\" class=\"ogicon-arrow-right\"></a></div> <div id=\"quest-hud\" class=\"hud\"></div> <div id=\"btl-hud\" class=\"hud\"></div></div>'), s('body').append('<ul id=\"messages\"></ul>'), s('body').append('<div id=\"message-box\"><div id=\"chat-emoticons\"></div><div id=\"message-menu\"><a href=\"#\" class=\"chat-sound-notifications ogicon-volume-high\"></a><a href=\"#\" class=\"chat-active-users ogicon-user-check\"></a><a href=\"#\" class=\"chat-muted-users ogicon-user-minus\"></a><a href=\"#\" class=\"show-chat-emoticons ogicon-smile\"></a></div><input type=\"text\" id=\"message\" class=\"form-control\" placeholder=\"' + h['enterChatMsg'] + '...\" maxlength=\"80\"></div>'), s('body').append('<div id=\"chat-box\"></div>'), d) d.hasOwnProperty(t) && s('#chat-emoticons').append('<img src=\"https://jimboy3100.github.io/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">');
                s('body').append('<div id=\"exp-imp\"><div id=\"exp-imp-menu\"><button id=\"close-exp-imp\" class=\"btn btn-danger\">' + h['close'] + '</button></div><div id=\"exp-imp-settings\"></div></div>'), s('#exp-imp-settings').append('<h1>' + h['exportSettings'] + '</h1><h2>' + h['exportInfo'] + '</h2>'), this['addOption']('#exp-imp-settings', 'export-ogarioCommands', h['commands'], !0), this['addOption']('#exp-imp-settings', 'export-ogarioHotkeys', h['hotkeys'], !0), this['addOption']('#exp-imp-settings', 'export-ogarioPlayerProfiles', h['profiles'], !0), this['addOption']('#exp-imp-settings', 'export-ogarioSettings', h['settings'], !0), this['addOption']('#exp-imp-settings', 'export-ogarioThemeSettings', h['theme'], !0), s('#exp-imp-settings').append('<textarea id=\"export-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" readonly /><button id=\"export-settings-btn\" class=\"btn btn-block btn-success\">' + h['exportSettings'] + '</button>'), s('#exp-imp-settings').append('<h1>' + h['importSettings'] + '</h1><h2>' + h['importInfo'] + '</h2>'), this['addOption']('#exp-imp-settings', 'import-ogarioCommands', h['commands'], !0), this['addOption']('#exp-imp-settings', 'import-ogarioHotkeys', h['hotkeys'], !0), this['addOption']('#exp-imp-settings', 'import-ogarioPlayerProfiles', h['profiles'], !0), this['addOption']('#exp-imp-settings', 'import-ogarioSettings', h['settings'], !0), this['addOption']('#exp-imp-settings', 'import-ogarioThemeSettings', h['theme'], !0), s('#exp-imp-settings').append('<textarea id=\"import-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" /><button id=\"import-settings-btn\" class=\"btn btn-block btn-success\">' + h['importSettings'] + '</button>'), y && y['setThemeMenu']();
                for (var e = 0; e < ogario1PlayerProfiles.length; e++) s('#skins').append('<div class=\"skin-box\"><a href=\"#profile-' + e + '\" id=\"profile-' + e + '\" data-profile=\"' + e + '\"></a></div>'), this['setSkinPreview'](ogario1PlayerProfiles[e]['skinURL'], 'profile-' + e), e == this['selectedProfile'] && s('#profile-' + e).addClass('selected');
            },
            'setUI': function() {
                var t = this;
                s(document).on('click', '.menu-tabs a', function(e) {
                    e.preventDefault(), t['switchMenuTabs'](s(this), 'menu-panel');
                }), s(document).on('click', '.submenu-tabs a', function(e) {
                    e.preventDefault(), t['switchMenuTabs'](s(this), 'submenu-panel');
                }), s(document).on('click', '.quick-menu', function(e) {
                    e.preventDefault(), v['showQuickMenu'] = !v['showQuickMenu'], t['saveSettings'](v, 'ogarioSettings'), t['setShowQuickMenu']();
                }), s(document).on('click', '.quick-skins', function(e) {
                    e.preventDefault(), v['showSkinsPanel'] = !v['showSkinsPanel'], t['saveSettings'](v, 'ogarioSettings'), t['setShowSkinsPanel']();
                }), s(document).on('change', '#region', function() {
                    t['region'] = this.value;
                }), s(document).on('change', '#gamemode', function() {
                    var e = this.value;
                    ':party' !== e && t['leaveParty'](), t['gameMode'] = i['gameMode'] = e, t['setQuest']();
                }), s(document).on('change', '#quality', function() {
                    t['getQuality'](this.value), ogarhusettings();
                }), s(document).on('input', '#skin', function() {
                    var e = this.value;
                    t['setSkinPreview'](e, 'skin-preview'), t['setSkinPreview'](e, 'profile-' + t['selectedProfile']);
                }), s(document).on('click', '#skins a', function(e) {
                    e.preventDefault(), t['selectProfile'](s(this)['attr']('data-profile'));
                }), s(document).on('click', '#prev-profile', function() {
                    t['prevProfile']();
                }), s(document).on('click', '#next-profile', function() {
                    t['nextProfile']();
                }), s(document).on('click', '#stream-mode', function() {
                    v['streamMode'] = !v['streamMode'], t['saveSettings'](v, 'ogarioSettings'), t['setStreamMode']();
                }), s(document).on('click', '#hide-url', function() {
                    v['hideSkinUrl'] = !v['hideSkinUrl'], t['saveSettings'](v, 'ogarioSettings'), t['setHideSkinUrl']();
                }), s(document).on('click', '.btn-server-info', function() {
                    s('#server-info')['toggle']();
                }), s(document).on('click', '#server-connect', function() {
                    t['gameServerConnect'](s('#server-ws').val());
                }), s(document).on('click', '#server-reconnect', function() {
                    t['gameServerReconnect']();
                }), s(document).on('click', '#server-join', function() {
                    t['gameServerJoin'](s('#server-token').val());
                }), s(document).on('change', '#og-options input[type=\'checkbox\']', function() {
                    var e = s(this);
                    t['setSettings'](e['attr']('id'), e['prop']('checked'));
                }), s(document).on('change', '.js-switch-vanilla', function() {
                    var e = s(this),
                        o = e['attr']('id');
                    void 0 !== t[o] && (t[o] = e['prop']('checked'), 'noSkins' === o && (i['showCustomSkins'] = !t['noSkins']), 'showQuest' === o && t['setQuest']());
                }), s(document).on('click', '#og-settings .restore-settings a', function(e) {
                    e['preventDefault'](), t['restoreSettings']();
                }), s(document).on('click', '#og-settings .btn-export', function(e) {
                    e['preventDefault'](), t['exportSettings'](), s('#exp-imp')['fadeIn'](500), s('#exp-imp-settings, #export-settings')['perfectScrollbar']('update');
                }), s(document).on('click', '#close-exp-imp', function(t) {
                    t.preventDefault(), s('#exp-imp')['fadeOut'](500);
                }), s(document).on('focus', '#export-settings', function() {
                    s(this).select();
                }), s(document).on('click', '#export-settings-btn', function(e) {
                    e.preventDefault(), t['exportSettings']();
                }), s(document).on('click', '#import-settings-btn', function(e) {
                    e['preventDefault'](), t['importSettings']();
                }), s(document).on('click', '#unblock-popups', function(e) {
                    e['preventDefault'](), t['unblockPopups']();
                }), s(document).on('click', '#openfl-overlay.disabler', function() {
                    v['blockPopups'] && t['blockPopups']();
                }), s(document).on('click', '#openfl-content', function() {
                    if (v['blockPopups']) {
                        var e = s(this);
                        setTimeout(function() {
                            e['is'](':visible') || t['blockPopups']();
                        }, 1000);
                    }
                }), s(document).on('click', '.quick-shop', function(i) {
                    i.preventDefault(), t['unblockPopups'](), e.MC && e.MC['openShop'] && e.MC['openShop']();
                }), s(document).on('click', '.quick-free-coins', function(i) {
                    i.preventDefault(), t['unblockPopups'](), e.MC && e.MC['showFreeCoins'] && e.MC['showFreeCoins']();
                }), s(document).on('click', '.quick-free-gifts', function(i) {
                    i.preventDefault(), t['unblockPopups'](), e.MC && e.MC['showGifting'] && e.MC['showGifting']();
                }), s(document).on('click', '.quick-quests', function(i) {
                    i.preventDefault(), t['unblockPopups'](), e.MC && e.MC['showQuests'] && e.MC['showQuests']();
                }), s(document).on('click', '#set-targeting', function(e) {
                    e.preventDefault(), t['setTargeting']();
                }), s(document).on('click', '#cancel-targeting', function(e) {
                    e.preventDefault(), t['cancelTargeting']();
                }), s(document).on('click', '#set-private-minimap', function(e) {
                    e.preventDefault(), t['setPrivateMiniMap']();
                }), s(document).on('click', '#change-target', function(e) {
                    e['preventDefault'](), t['changeTarget']();
                }), s(document).on('click', '.team-top-limit', function(e) {
                    e.preventDefault();
                    var i = s(this),
                        o = parseInt(i['attr']('data-limit'));
                    o && (t['setTop5limit'](o), t['displayTop5'](), s('.team-top').text(o), s('.team-top-limit').removeClass('active'), i.addClass('active'));
                }), s(document).on('click', '#top5-pos .set-target', function(e) {
                    e.preventDefault(), t['setTarget'](parseInt(s(this)['attr']('data-user-id')));
                }), s(document).on('click', '.mute-user', function(e) {
                    e.preventDefault(), t['muteChatUser'](parseInt(s(this)['attr']('data-user-id')));
                }), s(document).on('click', '.btn-mute-user', function() {
                    var e = s(this);
                    t['muteChatUser'](parseInt(e['attr']('data-user-id'))), e.removeClass('btn-red btn-mute-user').addClass('btn-green btn-unmute-user').text(h['unmute']);
                }), s(document).on('click', '.btn-unmute-user', function() {
                    var e = s(this);
                    t['unmuteChatUser'](parseInt(e['attr']('data-user-id'))), e.removeClass('btn-green btn-unmute-user').addClass('btn-red btn-mute-user').text(h['mute']);
                }), s(document).on('click', '.chat-sound-notifications', function(e) {
                    e['preventDefault'](), v['chatSounds'] = !v['chatSounds'], t['saveSettings'](v, 'ogarioSettings'), t['setChatSoundsBtn']();
                }), s(document).on('click', '.chat-active-users', function(e) {
                    e.preventDefault(), t['displayChatActiveUsers']();
                }), s(document).on('click', '.chat-muted-users', function(e) {
                    e.preventDefault(), t['displayChatMutedUsers']();
                }), s(document).on('click', '.show-chat-emoticons', function(t) {
                    t['preventDefault']();
                    var e = s(this),
                        i = s('#chat-emoticons');
                    i['toggle'](), i['is'](':visible') ? e.addClass('active') : (e.removeClass('active'), s('#message')['focus']());
                }), s(document).on('click', '#chat-emoticons .emoticon', function() {
                    var t = s(this)['attr']('alt'),
                        e = s('#message'),
                        i = e.val();
                    i.length + t.length <= 80 && e.val(i + t), e['focus']();
                }), this['statsHUD'] = document.getElementById('stats-hud'), this['activeParties'] = document.getElementById('active-parties'), this['top5pos'] = document.getElementById('top5-pos'), this['top5totalMass'] = document.getElementById('top5-total-mass'), this['top5totalPlayers'] = document.getElementById('top5-total-players'), this['leaderboardPositionsHUD'] = document.getElementById('leaderboard-positions'), this['leaderboardDataHUD'] = document.getElementById('leaderboard-data'), this['timeHUD'] = document.getElementById('time-hud'), this['questHUD'] = document.getElementById('quest-hud'), s('#canvas')['bind']('contextmenu', function() {
                    return !1;
                }), s(document).on('mouseup', '.btn', function() {
                    $(this)['blur']();
                }), s('[data-toggle=\'tab-tooltip\']')['tooltip']({
                    'trigger': 'hover'
                }), s('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings')['perfectScrollbar']({
                    'suppressScrollX': !0
                }), Array['prototype']['slice']['call'](document['querySelectorAll']('.js-switch'))['forEach'](function(t) {
                    new Switchery(t, {
                        'color': g['menuMainColor'],
                        'size': 'small'
                    });
                }), s('input[type=\'range\']')['rangeslider']({
                    'polyfill': !1
                }), toastr['options'] = {
                    'newestOnTop': !1,
                    'positionClass': 'toast-bottom-left',
                    'timeOut': 15000
                };
            },
            'switchMenuTabs': function(t, e) {
                var i = t['parent']();
                if ('menu-panel' === e) {
                    if (t['hasClass']('hotkeys-link')) return;
                    i['hasClass']('profile-tab') && this['setBlockPopups']();
                }
                t.addClass('active'), i.addClass('active'), i['siblings']().removeClass('active'), i['siblings']()['find']('a').removeClass('active');
                var o = t['attr']('href');
                if ('submenu-panel' === e) {
                    var a = s(o)['parent']()['attr']('id');
                    s('#' + a + ' .submenu-panel')['not'](o).css('display', 'none');
                } else s('.menu-panel')['not'](o).css('display', 'none');
                s(o)['fadeIn'](1000), ogarhusettings(), s('.submenu-panel')['perfectScrollbar']('update');
            },
            'getDefaultSettings': function() {
                if (this['noSkins'] = s('#noSkins')['prop']('checked'), this['noColors'] = s('#noColors')['prop']('checked'), this['skipStats'] = s('#skipStats')['prop']('checked'), this['showQuest'] = s('#showQuest')['prop']('checked'), i['showCustomSkins'] = !this['noSkins'], null !== e.localStorage.getItem('scale_setting')) {
                    var t = JSON['parse'](e.localStorage.getItem('scale_setting'));
                    this['setCanvasScale'](t);
                } else {
                    var o = s('#quality').val();
                    this['getQuality'](o);
                }
                null !== e.localStorage.getItem('location') ? (this['region'] = e.localStorage.getItem('location'), s('#region').val(this['region']), e.MC && e.MC['setRegion'] && e.MC['setRegion'](this['region'])) : this['region'] = s('#region').val(), this['setParty'](), ':party' === this['gameMode'] && e.location['hash'] && s('#join-party-btn-2')['click'](), Array['prototype']['slice']['call'](document['querySelectorAll']('.js-switch-vanilla'))['forEach'](function(t) {
                    new Switchery(t, {
                        'color': g['menuMainColor'],
                        'size': 'small'
                    });
                }), s('#nick').val(ogarcopythelb['nick'])['blur'](), s('#noNames')['prop']('checked', !v['noNames']), s('#showMass')['prop']('checked', v['showMass']), this['unlockButtons'](), this['setAutoResp'](), this['setQuest']();
            },
            'getQuality': function(t) {
                var i = 1;
                switch ('devicePixelRatio' in e && (i = e['devicePixelRatio']), t) {
                    case 'High':
                        this['setCanvasScale'](1);
                        break;
                    case 'Medium':
                        this['setCanvasScale'](0.9);
                        break;
                    case 'Low':
                        this['setCanvasScale'](0.75);
                        break;
                    case 'VeryLow':
                        this['setCanvasScale'](0.5);
                        break;
                    default:
                        this['setCanvasScale'](i);
                }
            },
            'setCanvasScale': function(t) {
                this['canvasScale'] = t, i['canvasScale'] = t;
            },
            'setStreamMode': function() {
                v['streamMode'] ? (s('#stream-mode').addClass('ogicon-eye-blocked'), s('#clantag, #nick, #party-token').addClass('stream-mode')) : (s('#stream-mode').removeClass('ogicon-eye-blocked'), s('#clantag, #nick, #party-token').removeClass('stream-mode'));
            },
            'setHideSkinUrl': function() {
                v['hideSkinUrl'] ? (s('#hide-url').addClass('ogicon-eye-blocked'), s('#skin').addClass('hide-url')) : (s('#hide-url').removeClass('ogicon-eye-blocked'), s('#skin').removeClass('hide-url'));
            },
            'setShowQuickMenu': function() {
                v['showQuickMenu'] ? s('#quick-menu')['fadeIn'](500) : s('#quick-menu')['fadeOut'](500);
            },
            'setShowSkinsPanel': function() {
                v['showSkinsPanel'] ? s('#skins-panel')['fadeIn'](500) : s('#skins-panel')['fadeOut'](500);
            },
            'unlockButtons': function() {
                s('.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate')['prop']('disabled', !1);
            },
            'setMainButtons': function() {
                var t = this;
                s(document).on('click', '.btn-play, .btn-play-guest', function() {
                    t['onPlay']();
                }), s(document).on('click', '.btn-spectate', function() {
                    t['onSpectate']();
                }), s(document).on('click', '#create-party-btn-2', function() {
                    t['onCreate']();
                }), s(document).on('click', '#join-party-btn-2', function() {
                    t['skipServerData'] = !0, t['joinParty'](), t['onJoin']();
                }), s(document).on('click', '#statsContinue2', function() {
                    s('#stats, #main-panel')['toggle']();
                });
            },
            'play': function() {
                if (this['setPlayerSettings'](), this['setParty'](), this['isSocketOpen']()) this['sendPartyData']();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t['sendPartyData']();
                    }, 1000);
                }
            },
            'onPlay': function() {
//                this.play(), this['hideMenu'](), e['addKeyListeners'] && e['addKeyListeners'](), v['autoHideFood'] && (i['showFood'] = !0), e['ga'] && e['ga']('create', 'UA-92655864-7', 'auto', 'ogarioTracker'), e['ga'] && e['ga']('ogarioTracker.send', 'pageview');
                this.play(), this['hideMenu'](), e['addKeyListeners'] && e['addKeyListeners'](), v['autoHideFood'] && (i['showFood'] = !0);
            },
            'onSpectate': function() {
                this['onJoin'](), this['sendPlayerJoin'](), this['hideMenu'](), e['addKeyListeners'] && e['addKeyListeners'](), v['autoHideFood'] && (i['showFood'] = !1);
            },
            'join': function() {
                this['setParty'](), this['setPlayerSettings'](), this['sendPartyData'](), this['sendPlayerDeath']();
            },
            'onJoin': function() {
                if (this['setParty'](), this['isSocketOpen']()) this['join']();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t['join'](), t['sendPlayerJoin']();
                    }, 1000);
                }
            },
            'create': function() {
                if (this['setParty'](), this['partyToken']) this['onJoin']();
                else {
                    var t = this;
                    setTimeout(function() {
                        t['create']();
                    }, 100);
                }
            },
            'onCreate': function() {
                this['setParty'](), ':party' === this['gameMode'] && this['partyToken'] ? this['gameServerReconnect']() : this['createParty'](), this['create']();
            },
            'onPlayerSpawn': function() {
                if (i.play = !0, i['playerColor']) return this['sendPlayerSpawn'](), void this['cacheCustomSkin'](ogarcopythelb['nick'], i['playerColor'], ogarcopythelb['skinURL']);
                var t = this;
                setTimeout(function() {
                    t['onPlayerSpawn']();
                }, 100);
            },
            'onPlayerDeath': function() {
                i.play = !1, i['playerColor'] = null, i['foodIsHidden'] = !1, i['playerMass'] = 0, i['playerScore'] = 0, i['playerSplitCells'] = 0, this['showMenu'](300), this['sendPlayerDeath'](), this['updateDeathLocations'](i['playerX'], i['playerY']), this['unlockButtons'](), ogarcommando1(), this['autoResp']();
            },
            'setPlayerSettings': function() {
                var t = s('#nick').val(),
                    e = s('#clantag').val(),
                    o = s('#skin').val(),
                    a = s('#color').val();
                ogarcopythelb['nick'] = t, ogarcopythelb['clanTag'] = e['trim'](), ogarcopythelb['skinURL'] = this['checkSkinURL'](o['trim']()), 7 == a.length && (ogarcopythelb['color'] = a), ogarcopythelb['clanTag'].length > 0 && (i['clanTag'] = ogarcopythelb['clanTag']), ogario1PlayerProfiles[this['selectedProfile']]['nick'] = ogarcopythelb['nick'], ogario1PlayerProfiles[this['selectedProfile']]['clanTag'] = ogarcopythelb['clanTag'], ogario1PlayerProfiles[this['selectedProfile']]['skinURL'] = ogarcopythelb['skinURL'], ogario1PlayerProfiles[this['selectedProfile']]['color'] = ogarcopythelb['color'], this['saveSettings'](ogario1PlayerProfiles, 'ogarioPlayerProfiles');
            },
            'loadSkin': function(t, e) {
                var i = this;
                t[e] = new Image(), t[e].crossOrigin = 'Anonymous', t[e]['onload'] = function() {
                    this['complete'] && this['width'] && this['height'] && this['width'] <= 2000 && this['height'] <= 2000 && (i['cacheQueue'].push(e), 1 == i['cacheQueue'].length && i['cacheSkin'](i['customSkinsCache']));
                }, t[e].src = e;
            },
            'cacheSkin': function(t) {
                //console.log(t);  //////// return the image src
                if (0 != this['cacheQueue'].length) {
                    var e = this['cacheQueue']['shift']();
                    if (e) {
                        //console.log(e);
                        var i = document['createElement']('canvas');
                        i['width'] = 512, i['height'] = 512;
                        var s = i['getContext']('2d');
                        s['beginPath'](), s.arc(256, 256, 256, 0, 2 * Math['PI'], !1), s['clip'](), s['drawImage'](this['customSkinsCache'][e], 0, 0, 512, 512), this['customSkinsCache'][e + '_cached'] = new Image(), this['customSkinsCache'][e + '_cached'].src = i.toDataURL(), i = null, this['cacheSkin'](this['customSkinsCache']);
                    }
                }
            },
            'cacheVanillaSkin': function(vanSkin) {
                //console.log(t);  //////// returns img scr of server/tag
                //if (0 != this['cacheQueue'].length) {
                var e = vanSkin;
                if (e) {
                    console.log(e);
                    var i = document['createElement']('canvas');
                    i['width'] = 512, i['height'] = 512;
                    var s = i['getContext']('2d');
                    s['beginPath'](), s.arc(256, 256, 256, 0, 2 * Math['PI'], !1), s['clip'](), s['drawImage'](this['customSkinsCache'][e], 0, 0, 512, 512), this['customSkinsCache'][e + '_cached'] = new Image(), this['customSkinsCache'][e + '_cached'].src = i.toDataURL(), i = null, this['cacheSkin'](this['customSkinsCache']);
                    //}
                }
            },
            'getCachedSkin': function(t, e) {
                return t[e + '_cached'] && t[e + '_cached']['complete'] && t[e + '_cached']['width'] ? t[e + '_cached'] : null;
            },
            'cacheCustomSkin': function(t, e, i) {
                if (i) {
                    var s = ':party' === this['gameMode'] ? t + e : t;
//					console.log(this['customSkinsMap'][s]);
//					console.log(s);
//					console.log(i);
/*					
					if (window.vanillaSkinname!=null){
						console.log(window.vanillaSkinname);
						console.log(window.vanillaSkin);					
						this['customSkinsMap'][window.vanillaSkinname]=window.vanillaSkin;
						this['loadSkin'](this['customSkinsCache'], window.vanillaSkin);
						}
*/					
					
                    if (s && (this['customSkinsMap'][s] = i), this['customSkinsCache'].hasOwnProperty(i)) return;
                    this['loadSkin'](this['customSkinsCache'], i);
                }
            },
            'checkSkinsMap': function(t, e) {
                var i = ':party' === this['gameMode'] ? t + e : t;
				//console.log(['customSkinsMap'].hasOwnProperty(i));
                return !!this['customSkinsMap'].hasOwnProperty(i);
            },
            'getCustomSkin': function(t, e) {
                if (!this['checkSkinsMap'](t, e)) return null;
                var i = ':party' === this['gameMode'] ? t + e : t;
                return this['getCachedSkin'](this['customSkinsCache'], this['customSkinsMap'][i]);
            },
            'calculateMapSector': function(t, e, s = !1) {
                if (!i['mapOffsetFixed']) return '';
                var o = s ? i['mapOffsetX'] + i['mapOffset'] : i['mapOffset'],
                    a = s ? i['mapOffsetY'] + i['mapOffset'] : i['mapOffset'],
                    n = Math['floor']((e + a) / (i['mapSize'] / g['sectorsY'])),
                    r = Math['floor']((t + o) / (i['mapSize'] / g['sectorsX']));
                return n = n < 0 ? 0 : n >= g['sectorsY'] ? g['sectorsY'] - 1 : n, r = r < 0 ? 0 : r >= g['sectorsX'] ? g['sectorsX'] - 1 : r, String['fromCharCode'](n + 65) + (r + 1);
            },
            'shortMassFormat': function(t) {
                return t < 1000 ? t : Math.round(t / 100) / 10 + 'k';
            },
            'updateDeathLocations': function(t, e) {
                i['mapOffsetFixed'] && (this['deathLocations'].push({
                    'x': t + i['mapOffsetX'],
                    'y': e + i['mapOffsetY']
                }), 6 == this['deathLocations'].length && this['deathLocations']['shift'](), this['lastDeath'] = this['deathLocations'].length - 1);
            },
            'drawMiniMap': function() {
                if (i['mapOffsetFixed']) {
                    var t = g['miniMapWidth'],
                        e = g['miniMapTop'],
                        s = t + e,
                        o = t - 18,
                        a = e + 9.5;
                    this['miniMap'] ? this['miniMapCtx']['clearRect'](0, 0, t, s) : (this['miniMap'] = document.getElementById('minimap'), this['miniMapCtx'] = this['miniMap']['getContext']('2d'), this['miniMapCtx']['ogarioCtx'] = !0, this['miniMap']['width'] = t, this['miniMap']['height'] = s), this['miniMap']['width'] != t && (this['miniMap']['width'] = t, this['miniMap']['height'] = s);
                    var n = o / i['mapSize'],
                        r = i['mapOffsetX'] + i['mapOffset'],
                        l = i['mapOffsetY'] + i['mapOffset'];
                    if (this['drawSelectedCell'](this['miniMapCtx']), this['currentSector'] = this['calculateMapSector'](i['playerX'], i['playerY'], !0), this['miniMapCtx']['globalAlpha'] = 1, this['miniMapCtx']['font'] = g['miniMapFontWeight'] + ' ' + (e - 4) + 'px ' + g['miniMapFontFamily'], this['miniMapCtx']['fillStyle'] = g['miniMapSectorColor'], this['miniMapCtx']['fillText'](this['currentSector'], 10, e), this['miniMapSectors'] || this['drawMiniMapSectors'](g['sectorsX'], g['sectorsY'], o, s, a), this['miniMapCtx']['save'](), this['miniMapCtx']['translate'](9.5, a), ':battleroyale' === this['gameMode'] && ogarfooddrawer && ogarfooddrawer['drawBattleAreaOnMinimap'](this['miniMapCtx'], o, o, n, r, l), v['showMiniMapGhostCells']) {
                        var h = i['ghostCells'];
                        this['miniMapCtx']['beginPath']();
                        for (var c = 0; c < h.length; c++)
                            if (!h[c]['inView']) {
                                var u = ~~((h[c]['x'] + r) * n),
                                    d = ~~((h[c]['y'] + l) * n);
                                this['miniMapCtx']['moveTo'](u, d), this['miniMapCtx'].arc(u, d, ~~(h[c]['size'] * n), 0, this.pi2, !1);
                            } this['miniMapCtx']['fillStyle'] = g['miniMapGhostCellsColor'], this['miniMapCtx']['globalAlpha'] = g['miniMapGhostCellsAlpha'], this['miniMapCtx']['shadowColor'] = g['miniMapGhostCellsColor'], this['miniMapCtx']['shadowBlur'] = 10, this['miniMapCtx']['shadowOffsetX'] = 0, this['miniMapCtx']['shadowOffsetY'] = 0, this['miniMapCtx'].fill(), this['miniMapCtx']['globalAlpha'] = 1, this['miniMapCtx']['shadowBlur'] = 0;
                    }
                    if (v['showMiniMapGuides']) {
                        u = Math.round((i['playerX'] + r) * n), d = Math.round((i['playerY'] + l) * n);
                        this['miniMapCtx']['lineWidth'] = 1, this['miniMapCtx']['strokeStyle'] = g['miniMapGuidesColor'], this['miniMapCtx']['beginPath'](), this['miniMapCtx']['moveTo'](u, 0), this['miniMapCtx']['lineTo'](u, o - 1), this['miniMapCtx']['moveTo'](0, d), this['miniMapCtx']['lineTo'](o - 1, d), this['miniMapCtx']['stroke']();
                    }
                    if (this['miniMapCtx']['beginPath'](), this['miniMapCtx'].arc((i['playerX'] + r) * n, (i['playerY'] + l) * n, g['miniMapMyCellSize'], 0, this.pi2, !1), this['miniMapCtx']['closePath'](), g['miniMapMyCellStrokeSize'] > 0 && (this['miniMapCtx']['lineWidth'] = g['miniMapMyCellStrokeSize'], this['miniMapCtx']['strokeStyle'] = g['miniMapMyCellStrokeColor'], this['miniMapCtx']['stroke']()), this['miniMapCtx']['fillStyle'] = g['miniMapMyCellColor'], this['miniMapCtx'].fill(), this['teamPlayers'].length)
                        for (c = 0; c < this['teamPlayers'].length; c++) this['teamPlayers'][c]['drawPosition'](this['miniMapCtx'], i['mapOffset'], n, this['privateMiniMap'], this['targetID']);
                    if (this['deathLocations'].length > 0) {
                        u = Math.round((this['deathLocations'][this['lastDeath']]['x'] + i['mapOffset']) * n), d = Math.round((this['deathLocations'][this['lastDeath']]['y'] + i['mapOffset']) * n);
                        var f = Math['max'](g['miniMapMyCellSize'] - 2, 4);
                        this['miniMapCtx']['lineWidth'] = 1, this['miniMapCtx']['strokeStyle'] = this['deathLocations'].length - 1 == this['lastDeath'] ? g['miniMapDeathLocationColor'] : '#FFFFFF', this['miniMapCtx']['beginPath'](), this['miniMapCtx']['moveTo'](u - f, d), this['miniMapCtx']['lineTo'](u + f, d), this['miniMapCtx']['moveTo'](u, d - f), this['miniMapCtx']['lineTo'](u, d + f), this['miniMapCtx']['stroke']();
                    }
                    this['miniMapCtx']['restore']();
                }
            },
            'drawMiniMapSectors': function(t, e, s, o, a) {
                this['miniMapSectors'] = document.getElementById('minimap-sectors');
                var n = this['miniMapSectors']['getContext']('2d');
                n['ogarioCtx'] = !0, this['miniMapSectors']['width'] = s, this['miniMapSectors']['height'] = o, n['fillStyle'] = '#FFFFFF', this['dTok'](n, s - 1), ogarfooddrawer['drawSectors'](n, i['mapOffsetFixed'], t, e, 0.5, a, s - 0.5, o - 9.5, g['miniMapSectorsColor'], g['miniMapSectorsColor'], 1, !1);
            },
            'resetMiniMapSectors': function() {
                this['miniMapSectors'] = null;
            },
            'drawSelectedCell': function(t) {
                i.play && i['playerSplitCells'] > 1 && (v['splitRange'] || v['oppColors'] || v['oppRings'] || v['showStatsSTE']) && (t['fillStyle'] = '#FFFFFF', t['globalAlpha'] = this['selectBiggestCell'] ? 0.6 : 0.3, t['beginPath'](), t.arc(0x30, 15, 6, 0, this.pi2, !1), t['closePath'](), t.fill(), t['globalAlpha'] = this['selectBiggestCell'] ? 0.3 : 0.6, t['beginPath'](), t.arc(0x3c, 15, 4, 0, this.pi2, !1), t['closePath'](), t.fill());
            },
            'dTok': function(t, e) {
                t['font'] = g['miniMapFontWeight'] + ' ' + (g['miniMapTop'] - 6) + 'px ' + g['miniMapFontFamily'], t['textAlign'] = 'right', t['textBaseline'] = 'top', t['fillText'](atob(this['token']), e, 7);
            },
            'drawTeammatesInd': function(t, e, i, s) {
                this['indicator'] && t['drawImage'](this['indicator'], e - 45, i - s - 90);
            },
            'drawCellInfo': function(t, e, s, o, a, n, r, l, h, c, u, d) {
                if (!n && !h && (t['globalAlpha'] = i['globalAlpha'], v['teammatesInd'] && d && !l && a <= 200 && this['drawTeammatesInd'](t, s, o, a), !v['noNames'] || v['showMass'])) {
                    var f = !1;
                    if (l || r || !(f = this['setAutoHideCellInfo'](a)) || !v['autoHideNames'] || !v['autoHideMass']) {
                        var m = null;
                        if (!this['cells'].hasOwnProperty(e)) return (m = new ogarbasicassembly(s, o, r, l, v['shortMass'], v['virMassShots']))['setMass'](a), m['setNick'](c), void(this['cells'][e] = m);
                        (m = this['cells'][e])['update'](s, o, a, r, l, c), m['setDrawing'](v['optimizedNames'], v['optimizedMass'], v['shortMass'], v['virMassShots'], v['namesStroke'], v['massStroke']), m['setDrawingScale'](i['viewScale'], g['namesScale'], g['massScale'], g['virMassScale'], g['strokeScale']), t['globalAlpha'] = g['textAlpha'], v['noNames'] || f && v['autoHideNames'] || l && v['hideMyName'] || d && v['hideTeammatesNames'] || m['drawNick'](t, g['namesColor'], g['namesFontFamily'], g['namesFontWeight'], g['namesStrokeColor']), !v['showMass'] || f && v['autoHideMass'] || l && v['hideMyMass'] || v['hideEnemiesMass'] && !l && !r || m['drawMass'](t, g['massColor'], g['massFontFamily'], g['massFontWeight'], g['massStrokeColor']);
                    }
                }
            },
            'setVirusColor': function(t) {
                return Math['floor'](t * t / 100) > 183 ? '#C80000' : g['virusColor'];
            },
            'setVirusStrokeColor': function(t) {
                return i.play && 0 != i['playerMaxMass'] ? Math['floor'](t * t / 100) / (this['selectBiggestCell'] ? i['playerMaxMass'] : i['playerMinMass']) > 0.76 ? '#FFDC00' : '#C80000' : g['virusStrokeColor'];
            },
            'setAutoHideCellInfo': function(t) {
                return t <= 40 || i['viewScale'] < 0.5 && t < 550 && t < 25 / i['viewScale'];
            },
            'setParty': function() {
                var t = s('#party-token').val();
                if (this['gameMode'] = i['gameMode'] = s('#gamemode').val(), this['setQuest'](), ':party' === this['gameMode'] && t) {
                    var e = t; - 1 != t.indexOf('#') && (e = (t = t.split('#'))[1]), this['partyToken'] !== e && (this['partyToken'] = e, this['flushSkinsMap'](), this['flushChatData'](), this['cancelTargeting']());
                }
            },
            'createParty': function() {
                s('#create-party-btn')['click']();
            },
            'joinParty': function() {
                var t = s('#party-token').val();
                t && (s('#pre-join-party-btn')['click'](), s('.party-token').val(t), s('#join-party-btn')['click']());
            },
            'leaveParty': function() {
                s('#party-token, .party-token').val(''), s('#leave-party-btn')['click']();
            },
            'closeParty': function() {
                s('#party-token, .party-token').val(''), s('.party-icon-back')['click']();
            },
            'flushData': function() {
                this['flushPartyData'](), this['flushSkinsMap'](), this['flushChatData'](), this['cancelTargeting'](), i.play = !1, i['playerColor'] = null;
            },
            'flushPartyData': function() {
                this['teamPlayers'] = [], this['parties'] = [], this['lastSentNick'] = '', this['lastSentClanTag'] = null, this['lastSentSkinURL'] = '', this['lastSentCustomColor'] = '', this['lastSentPartyToken'] = '', this['lastSentServerToken'] = '';
            },
            'flushCells': function() {
                this['cells'] = {};
            },
            'flushSkinsMap': function() {
                this['customSkinsMap'] = {};
            },
            'flushChatData': function() {
                this['chatUsers'] = {};
            },
            'getWS': function(t) {
                t && (this['ws'] = t, this['createServerToken'](), this['updateServerInfo'](), -1 == this['ws'].indexOf('agar.io') && this['closeConnection']());
            },
            'recreateWS': function(t) {
                if (!t) return null;
                var e = null;
                if (/^[a-zA-Z0-9=+\/]{12,}$/ .test(t)) {
                    var i = atob(t);
                    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ .test(i) && (e = 'wss://ip-' + i.replace(/\./g, '-').replace(':', '.tech.agar.io:'));
                }
                return !e && /^[a-z0-9]{5,}$/ .test(t) && (e = 'wss://live-arena-' + t + '.agar.io:443'), e;
            },
            'createServerToken': function() {
                var t = this['ws']['match'](/ip-\d+/),
                    i = this['ws']['match'](/live-arena-([\w\d]+)/),
                    s = null;
                t && ((t = this['ws'].replace('.tech.agar.io', '').replace(/-/g, '.')['match'](/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this['serverIP'] = t[0], s = btoa(this['serverIP'])));
                if (!s && i && (this['serverArena'] = i[1], s = this['serverArena']), s) {
                    this['serverToken'] !== s && (this['serverToken'] = s, this['flushData'](), this['flushCells']()), this['partyToken'] = '';
                    var o = this['ws']['match'](/party_id=([A-Z0-9]{6})/);
                    o && (this['partyToken'] = o[1], ogarjoiner('/#' + e['encodeURIComponent'](this['partyToken'])));
                }
            },
            'updateServerInfo': function() {
                s('#server-ws').val(this['ws']), s('#server-token').val(this['serverToken']), s('#party-token, .party-token').val(this['partyToken']);
            },
            'gameServerConnect': function(t) {
                t && (this['skipServerData'] = !0, e.core && e.core.connect && e.core.connect(t));
            },
            'gameServerReconnect': function() {
                e.MC && e.MC['reconnect'] ? e.MC['reconnect']() : e.master && e.master['reconnect'] && e.master['reconnect']();
            },
            'gameServerJoin': function(t) {
                var e = this['recreateWS'](t);
                e && (this['skipServerData'] = !0, this['gameServerConnect'](e));
            },
            'connect': function() {
                this['closeConnection'](), this['flushData'](), this['setParty'](), console.log('[Legend mod Express] Connecting to server'), this['privateMode'] && this['privateIP'] ? this.socket = new WebSocket(this['privateIP']) : this.socket = new WebSocket(this['publicIP']), this.socket['ogarioWS'] = !0, this.socket['binaryType'] = 'arraybuffer';
                var t = this;
                this.socket['onopen'] = function() {
                    console.log('[Legend mod Express] Socket open');
                    var e = t.createView(3);
                    e.setUint8(0, 0), e.setUint16(1, 401, !0), t['sendBuffer'](e), t['sendPartyData']();
                }, this.socket['onmessage'] = function(e) {
                    t['handleMessage'](e);
                }, this.socket['onclose'] = function(e) {
                    t['flushData'](), console.log('[Legend mod Express] Socket close', e);
                }, this.socket['onerror'] = function(e) {
                    t['flushData'](), console.log('[Legend mod Express] Socket error', e);
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
                this['setParty']();
                var t = this;
                setTimeout(function() {
                    t.connect();
                }, 1000);
            },
            'switchServerMode': function() {
                this['privateIP'] && (this['privateMode'] = !this['privateMode'], this['isSocketOpen']() && (this['closeConnection'](), toastr['error']('Zamknięto połączenie z serwerem!')), this['privateMode'] ? (toastr['info']('Przełączono na serwer prywatny!'), s('.party-panel').show()) : (toastr['info']('Przełączono na serwer publiczny!'), s('#active-parties')['empty'](), s('.party-panel').hide()), this['onJoin'](), i.play && this['onPlayerSpawn']());
            },
            'isSocketOpen': function() {
                return null !== this.socket && this.socket['readyState'] === this.socket['OPEN'];
            },
        "writeUint32" : function(data, value) {
          for (; !![];) {
            if ((value & -128) == 0) {
              data["push"](value);
              return;
            } else {
              data["push"](value & 127 | 128);
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
                for (var s = 0; s < e.length; s++) i.setUint16(1 + 2 * s, e.charCodeAt(s), !0);
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
                        this['playerID'] = t.getUint32(1, !0);
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
                if (this['isSocketOpen']()) {
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
                null !== this[e] && this[e] === i || this['isSocketOpen']() && (this['sendBuffer'](this['strToBuff'](t, i)), this[e] = i);
            },
            'sendPlayerNick': function() {
                this['sendPlayerData'](10, 'lastSentNick', ogarcopythelb['nick']);
            },
            'sendPlayerClanTag': function() {
                this['sendPlayerData'](11, 'lastSentClanTag', ogarcopythelb['clanTag']);
            },
            'sendPlayerSkinURL': function() {
                this['sendPlayerData'](12, 'lastSentSkinURL', ogarcopythelb['skinURL']);
            },
            'sendPlayerCustomColor': function() {
                this['sendPlayerData'](13, 'lastSentCustomColor', ogarcopythelb['color']);
            },
            'sendPlayerColor': function() {
                this['isSocketOpen']() && i['playerColor'] && this['sendBuffer'](this['strToBuff'](14, i['playerColor']));
            },
            'sendPartyToken': function() {
                this['setParty'](), this['sendPlayerData'](15, 'lastSentPartyToken', this['partyToken']);
            },
            'sendServerToken': function() {
                this['sendPlayerData'](16, 'lastSentServerToken', this['serverToken']);
            },
            'sendServerJoin': function() {
                this['sendServerToken'](), this['sendPlayerJoin']();
            },
            'sendServerRegion': function() {
                if (this['region']) {
                    var t = this['region'].split('-');
                    this['isSocketOpen']() && this['sendBuffer'](this['strToBuff'](17, t[0]));
                }
            },
            'sendServerGameMode': function() {
                var t = 'FFA';
                switch (this['gameMode']) {
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
                this['isSocketOpen']() && this['sendBuffer'](this['strToBuff'](18, t));
            },
            'sendServerData': function() {
                this['skipServerData'] ? this['skipServerData'] = !1 : (this['region'] = s('#region').val(), this['gameMode'] = s('#gamemode').val(), this['sendServerRegion'](), this['sendServerGameMode']());
            },
            'sendPartyData': function() {
                this['sendPlayerClanTag'](), this['sendPartyToken'](), this['sendServerToken'](), this['sendPlayerNick']();
            },
            'sendPlayerUpdate': function() {
                if (this['isSocketOpen']() && i.play && this['playerID'] && i['playerColor']) {
                    function t(t) {
                        for (var e = 0; e < t.length; e++) s.setUint16(o, t.charCodeAt(e), !0), o += 2;
                        s.setUint16(o, 0, !0), o += 2;
                    }
                    var e = 41;
                    e += 2 * ogarcopythelb['nick'].length, e += 2 * ogarcopythelb['skinURL'].length;
                    var s = this.createView(e);
                    s.setUint8(0, 20), s.setUint32(1, this['playerID'], !0);
                    var o = 5;
                    t(ogarcopythelb['nick']), t(ogarcopythelb['skinURL']), t(ogarcopythelb['color']), t(i['playerColor']), this['sendBuffer'](s);
                }
            },
            'sendPlayerPosition': function() {
                if (this['isSocketOpen']() && i.play && this['playerID']) {
                    var t = this.createView(17);
                    t.setUint8(0, 30), t.setUint32(1, this['playerID'], !0), t['setInt32'](5, this['getPlayerX'](), !0), t['setInt32'](9, this['getPlayerY'](), !0), void 0 !== i['playerMass'] ? t.setUint32(13, i['playerMass'], !0) : t.setUint32(13, this['playerMass'], !0), this['sendBuffer'](t);
                }
            },
            'checkPlayerID': function(t) {
                if (t)
                    for (var e = 0; e < this['teamPlayers'].length; e++)
                        if (this['teamPlayers'][e]['id'] == t) return e;
                return null;
            },
            'updateTeamPlayer': function(t) {
                function e() {
                    for (var e = '';;) {
                        var i = t.getUint16(s, !0);
                        if (0 == i) break;
                        e += String['fromCharCode'](i), s += 2;
                    }
                    return s += 2, e;
                }
                var i = t.getUint32(1, !0),
                    s = 5,
                    o = e(),
                    a = this['checkSkinURL'](e()),
                    n = e(),
                    r = e(),
                    l = ':party' === this['gameMode'] ? o + r : o,
                    h = this['checkPlayerID'](i);
                if (null !== h) this['teamPlayers'][h]['nick'] = o, this['teamPlayers'][h]['skinID'] = l, this['teamPlayers'][h]['skinURL'] = a, this['teamPlayers'][h]['setColor'](r, n);
                else {
                    var c = new function(t, e, i, s) {
                        this['id'] = t, this['nick'] = e, this['skinID'] = i, this['skinURL'] = s, this['x'] = 0, this['y'] = 0, this['lastX'] = 0, this['lastY'] = 0, this['mass'] = 0, this['clanTag'] = '', this['color'] = null, this['customColor'] = g['miniMapTeammatesColor'], this['alive'] = !1, this['updateTime'] = null, this.pi2 = 2 * Math['PI'], this['setColor'] = function(t, e) {
                            this['color'] = t, 7 == e.length && (this['customColor'] = e);
                        }, this['drawPosition'] = function(t, e, i, s, o) {
                            if (!(!this['alive'] || s && o && this['id'] != o)) {
                                this['lastX'] = (29 * this['lastX'] + this['x']) / 30, this['lastY'] = (29 * this['lastY'] + this['y']) / 30;
                                var a = (this['lastX'] + e) * i,
                                    n = (this['lastY'] + e) * i;
                                this['nick'].length > 0 && (t['font'] = g['miniMapNickFontWeight'] + ' ' + g['miniMapNickSize'] + 'px ' + g['miniMapNickFontFamily'], t['textAlign'] = 'center', g['miniMapNickStrokeSize'] > 0 && (t['lineWidth'] = g['miniMapNickStrokeSize'], t['strokeStyle'] = g['miniMapNickStrokeColor'], t['strokeText'](this['nick'], a, n - (2 * g['miniMapTeammatesSize'] + 2))), t['fillStyle'] = g['miniMapNickColor'], t['fillText'](this['nick'], a, n - (2 * g['miniMapTeammatesSize'] + 2))), t['beginPath'](), t.arc(a, n, g['miniMapTeammatesSize'], 0, this.pi2, !1), t['closePath'](), v['oneColoredTeammates'] ? t['fillStyle'] = g['miniMapTeammatesColor'] : t['fillStyle'] = this['customColor'], t.fill();
                            }
                        };
                    }(i, o, l, a);
                    c['setColor'](r, n), this['teamPlayers'].push(c);
                }
                this['cacheCustomSkin'](o, r, a);
            },
            'updateTeamPlayerPosition': function(t) {
                var e = t.getUint32(1, !0),
                    i = this['checkPlayerID'](e);
                if (null !== i) {
                    var s = t.getInt32(5, !0),
                        o = t.getInt32(9, !0),
                        a = t.getUint32(13, !0);
                    if (a > 360000) return;
                    var n = this['teamPlayers'][i];
                    n['x'] = s, n['y'] = o, n['mass'] = a, n['alive'] = !0, n['updateTime'] = Date['now'](), this['targeting'] && this['targetID'] && e == this['targetID'] && this['updateTarget'](n['nick'], n['skinURL'], s, o, a, n['color']);
                }
            },
            'updateTeamPlayers': function() {
                this['sendPlayerPosition'](), this['chatUsers'] = {}, this['top5'] = [];
                for (var t = 0; t < this['teamPlayers'].length; t++) {
                    var e = this['teamPlayers'][t];
                    (e['alive'] && Date['now']() - e['updateTime'] >= 2000 || 0 == e['mass']) && (e['alive'] = !1, this['targeting'] && this['targetID'] && e['id'] == this['targetID'] && this['setTargetStatus'](2)), e['alive'] && (this['top5'].push({
                        'id': e['id'],
                        'nick': e['nick'],
                        'x': e['x'],
                        'y': e['y'],
                        'mass': e['mass'],
                        'color': e['color']
                    }), this['isChatUserMuted'](e['id']) || this['addChatUser'](e['id'], e['nick']));
                }
                this['top5']['sort'](function(t, e) {
                    return e['mass'] - t['mass'];
                }), this['displayTop5']();
            },
            'updateParties': function(t) {
                this['parties'] = [];
                for (var e = t.getUint8(1), i = 2, s = 0; s < e; s++) {
                    for (var o = '';;) {
                        var a = t.getUint16(i, !0);
                        if (0 == a) break;
                        o += String['fromCharCode'](a), i += 2;
                    }
                    i += 2, this['parties'].push(o);
                }
            },
            'readChatMessage': function(t) {
                if (!v['disableChat']) {
                    var e = new Date()['toTimeString']().replace(/^(\d{2}:\d{2}).*/, '$1'),
                        i = t.getUint8(1),
                        s = t.getUint32(2, !0),
                        o = t.getUint32(6, !0);
                    if (!(this['isChatUserMuted'](s) || 0 != o && o != this['playerID'] && s != this['playerID'])) {
                        for (var a = '', n = 10; n < t.byteLength; n += 2) {
                            var r = t.getUint16(n, !0);
                            if (0 == r) break;
                            a += String['fromCharCode'](r);
                        }
                        this['displayChatMessage'](e, i, s, a);
                    }
                }
            },
            'sendChatMessage': function(t, e) {
				//console.log(t);console.log(e);
                if (!(Date['now']() - this['lastMessageSentTime'] < 500 || 0 == e.length || 0 == ogarcopythelb['nick'].length) && this['isSocketOpen']()) {
                    e = ogarcopythelb['nick'] + ': ' + e;
                    var i = this.createView(10 + 2 * e.length);
                    i.setUint8(0, 100), i.setUint8(1, t), i.setUint32(2, this['playerID'], !0), i.setUint32(6, 0, !0);
                    for (var s = 0; s < e.length; s++) i.setUint16(10 + 2 * s, e.charCodeAt(s), !0);
                    this['sendBuffer'](i), this['lastMessageSentTime'] = Date['now']();
                }
            },
            'prepareCommand': function(t) {
                return t.replace('%currentSector%', this['currentSector']);
            },
            'sendCommand': function(t) {
                var e = this['prepareCommand'](c['comm' + t]);
                this['sendChatMessage'](102, e);
            },
            'addChatUser': function(t, e) {
                this['chatUsers'][t] = e;
            },
            'getChatUserNick': function(t) {
                return this['chatUsers'].hasOwnProperty(t) ? this['chatUsers'][t] : '';
            },
            'muteChatUser': function(t) {
                if (t && !this['isChatUserMuted'](t)) {
                    var e = this['getChatUserNick'](t);
                    this['chatMutedUsers'][t] = e, this['chatMutedUserIDs'].push(t), toastr['error'](h['userMuted'].replace('%user%', '<strong>' + this['escapeHTML'](e) + '</strong>') + ' <button data-user-id=\"' + t + '\" class=\"btn btn-xs btn-green btn-unmute-user\">' + h['unmute'] + '</button>');
                }
            },
            'unmuteChatUser': function(t) {
                if (t) {
                    var e = this['chatMutedUserIDs'].indexOf(t); - 1 != e && (this['chatMutedUserIDs']['splice'](e, 1), toastr['info'](h['userUnmuted'].replace('%user%', '<strong>' + this['escapeHTML'](this['chatMutedUsers'][t]) + '</strong>')), delete this['chatMutedUsers'][t]);
                }
            },
            'isChatUserMuted': function(t) {
                return -1 != this['chatMutedUserIDs']['indexOf'](t);
            },
            'parseMessage': function(t) {
                var e = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
                if (e.test(t)) return v['showChatImages'] ? '<img src=\"' + t['match'](e)[1].replace('http:', 'https:') + '\" style=\"width:100%;border:none;\">' : '';
                var i = /\[yt\]([\w-]{11})\[\/yt\]/i;
                if (i.test(t)) return v['showChatVideos'] ? '<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/' + t['match'](i)[1] + '?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />' : '';
                var s = this['escapeHTML'](t);
                return v['chatEmoticons'] && (s = this['parseEmoticons'](s)), s;
            },
            'parseEmoticons': function(t) {
                /*return String(t).replace(/\&lt\;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(t) {
                    return '<img src=\"https://jimboy3100.github.io/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });*/
                return String(t).replace(/\&lt\;3/g, '<3').replace(/℄/g, '℄ Legend Clan').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\)|\(angry\)|\(clown\)|\(crazy\)|\(devil\)|\(devil2\)|\(fb\)|\(google\)|\(ghost\)|\(heel\)|\(kiss\)|\(lipstick\)|\(rage\)|\(teacher\)|\(together\)|\(toothy\)|\(evil\)|\(baby\)|\(wow\))/g, function(t) {
                    return '<img src=\"https://jimboy3100.github.io/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });
            				
            },
            'displayChatMessage': function(t, e, i, o) {
                if (0 != o.length) {
                    var a = o.split(': ', 1)['toString'](),
                        n = this['parseMessage'](o.replace(a + ': ', ''));
                    if (!(0 == a.length || a.length > 15 || 0 == n.length)) {
                        var r = '';
                        if (0 != i && i != this['playerID'] && (this['addChatUser'](i, a), r = '<a href=\"#\" data-user-id=\"' + i + '\" class=\"mute-user ogicon-user-minus\"></a> '), a = this['escapeHTML'](a), 101 == e) {
                            if (v['showChatBox']) return s('#chat-box').append('<div class=\"message\"><span class=\"message-time\">[' + t + '] </span>' + r + '<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span></div>'), s('#chat-box')['perfectScrollbar']('update'), s('#chat-box')['animate']({
                                'scrollTop': s('#chat-box')['prop']('scrollHeight')
                            }, 500), void(v['chatSounds'] && this['playSound'](this['messageSound']));
                            v['hideChat'] || (toastr['success']('<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span>' + r), v['chatSounds'] && this['playSound'](this['messageSound'])), this['chatHistory'].push({
                                'nick': a,
                                'message': n
                            }), this['chatHistory'].length > 15 && this['chatHistory']['shift']();
                        } else if (102 == e) {
                            if (v['showChatBox']) return s('#chat-box').append('<div class=\"message command\"><span class=\"command-time\">[' + t + '] </span>' + r + '<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span></div>'), s('#chat-box')['perfectScrollbar']('update'), s('#chat-box')['animate']({
                                'scrollTop': s('#chat-box')['prop']('scrollHeight')
                            }, 500), void(v['chatSounds'] && this['playSound'](this['commandSound']));
                            v['hideChat'] || (toastr['warning']('<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span>' + r), v['chatSounds'] && this['playSound'](this['commandSound']));
                        } else s('#messages').append(o);
                    }
                }
            },
            'displayUserList': function(t, e, i, s, o) {
                var a = '';
                if (Object['keys'](t).length) {
                    for (var n in a += '<ol class=\"user-list\">', t) t.hasOwnProperty(n) && (a += '<li><strong>' + this['escapeHTML'](t[n]) + '</strong> <button data-user-id=\"' + n + '\" class=\"btn btn-xs ' + i + '\">' + s + '</button></li>');
                    a += '</ol>';
                } else a += h['none'];
                toastr[o](a, e, {
                    'closeButton': !0,
                    'tapToDismiss': !1
                });
            },
            'displayChatActiveUsers': function() {
                this['displayUserList'](this['chatUsers'], h['activeUsers'], 'btn-red btn-mute-user', h['mute'], 'info');
            },
            'displayChatMutedUsers': function() {
                this['displayUserList'](this['chatMutedUsers'], h['mutedUsers'], 'btn-green btn-unmute-user', h['unmute'], 'error');
            },
            'preloadChatSounds': function() {
                this['setMessageSound'](), this['setCommandSound']();
            },
            'setChatSoundsBtn': function() {
                v['chatSounds'] ? s('.chat-sound-notifications').removeClass('ogicon-volume-mute2').addClass('ogicon-volume-high') : s('.chat-sound-notifications').removeClass('ogicon-volume-high').addClass('ogicon-volume-mute2');
            },
            'setMessageSound': function() {
                this['messageSound'] = this['setSound'](v['messageSound']);
            },
            'setCommandSound': function() {
                this['commandSound'] = this['setSound'](v['commandSound']);
            },
            'setSound': function(t) {
                return t ? new Audio(t) : null;
            },
            'playSound': function(t) {
                //t && t.play && (t.pause(), t.currentTime = 0, t.play());
				//t && t.play && t.play!==null && (t.pause(), t.currentTime = 0, t.play());
				t.pause();
				t.currentTime = 0;
				var nopromise = {
				catch : new Function()
					};
				(t.play() || nopromise).catch(function(){}); 
            },
            'setTargeting': function() {
                this['targetID'] && (this['targeting'] = !this['targeting'], i['targeting'] = this['targeting'], this['setTargetingInfo']());
            },
            'setTargetingInfo': function() {
                this['targeting'] ? (s('#set-targeting').addClass('active'), s('#target-status').show(), 2 != this['targetStatus'] && s('#target-summary').show()) : (s('#set-targeting').removeClass('active'), s('#target-summary, #target-status').hide());
            },
            'cancelTargeting': function() {
                this['setTargetStatus'](0);
            },
            'setPrivateMiniMap': function() {
                this['targetID'] && (this['privateMiniMap'] = !this['privateMiniMap'], this['privateMiniMap'] ? s('#set-private-minimap').addClass('active') : s('#set-private-minimap').removeClass('active'));
            },
            'setTarget': function(t) {
                var e = this['checkPlayerID'](t);
                if (null !== e) {
                    var i = this['teamPlayers'][e];
                    if (this['targetID'] = i['id'], this['updateTarget'](i['nick'], i['skinURL'], i['x'], i['y'], i['mass'], i['color']), !i['alive']) return void this['setTargetStatus'](2);
                    this['setTargetStatus'](1);
                } else this['setTargetStatus'](0);
            },
            'setTargetStatus': function(t) {
                switch (t) {
                    case 0:
                        this['targetStatus'] = 0, this['targetID'] = 0, this['targetNick'] = '', this['targetSkinURL'] = '', this['targeting'] = !1, i['targeting'] = !1, this['privateMiniMap'] = !1, s('#target-skin, #target-nick, #target-summary').hide(), s('#target-status').show().text('[' + h['targetNotSet'] + ']'), s('#target-panel-hud a').removeClass('active');
                        break;
                    case 1:
                        this['targetStatus'] = 1, this['targeting'] || (this['targeting'] = !0, i['targeting'] = !0, this['setTargetingInfo']()), s('#target-skin, #target-nick, #target-status, #target-summary').show();
                        break;
                    case 2:
                        this['targetStatus'] = 2, s('#target-summary').hide(), s('#target-status').show().text('[' + h['targetDead'] + ']'), i['resetTargetPosition']();
                }
            },
            'changeTarget': function() {
                for (var t = this['checkPlayerID'](this['targetID']), e = null, i = 0; i < this['teamPlayers'].length; i++)
                    if (this['teamPlayers'][i]['alive']) {
                        if (null === t) {
                            t = i;
                            break;
                        }
                        if (i < t && null === e) e = i;
                        else if (i > t) {
                            e = i;
                            break;
                        }
                    } null !== e && (t = e), null !== t ? this['setTarget'](this['teamPlayers'][t]['id']) : this['setTargetStatus'](0);
            },
            'updateTarget': function(t, e, o, a, n, r) {
                i['setTargetPosition'](o, a), this['targetNick'] !== t && (this['targetNick'] = t, s('#target-nick').html(this['escapeHTML'](t))), s('#target-skin').css('background-color', r), e && this['targetSkinURL'] !== e && (this['customSkinsCache'].hasOwnProperty(e + '_cached') ? (s('#target-skin img')['attr']('src', e), this['targetSkinURL'] = e) : s('#target-skin img')['attr']('src', 'https://jimboy3100.github.io/banners/static/img/blank.png')), s('#target-status').text('[' + this['shortMassFormat'](n) + ']');
                var l = this['calculateMapSector'](o, a),
                    c = h['targetDistance'] + ': <span class=\"hud-main-color\">' + i['targetDistance'] + ' [' + l + ']</span>';
                i.play && (c += ' | ' + h['targetMass'] + ': <span class=\"hud-main-color\">' + this['shortMassFormat'](n + i['playerMass']) + '</span>'), s('#target-summary').html(c), 1 != this['targetStatus'] && this['setTargetStatus'](1);
            },
            'updateQuest': function() {
                this['showQuest'] && ':ffa' === this['gameMode'] && e.MC && e.MC['getQuestProgressLabel'] && (this['questHUD']['textContent'] = e.MC['getQuestProgressLabel']());
            },
            'init': function() {
                this['loadSettings'](), this['loadProfiles'](), this['setLang'](), this['setMenu'](), this['setUI'](), y && y.setTheme(), this['setShowQuickMenu'](), this['setShowSkinsPanel'](), this['setProfile'](), this['setMainButtons'](), this['setStreamMode'](), this['setHideSkinUrl'](), this['setMiniMap'](), this['setAutoResp'](), this['setDisableChat'](), this['setShowChatBox'](), this['setTop5'](), this['setTargetingHUD'](), this['setQuest'](), this['displayTime'](), this['setCenteredLb'](), this['setNormalLb'](), this['setFpsAtTop'](), this['displayStats'](), this['setBlockPopups'](), this['preloadChatSounds'](), this['setChatSoundsBtn']();
                var t = this;
                setInterval(function() {
                    t['drawMiniMap']();
                }, 33), setInterval(function() {
                    t['updateTeamPlayers']();
                }, this['updateInterval']);
            }
        };

        function irenderfromagario() {
            this['txt'] = '',
                this['txtCanvas'] = null,
                this['txtCtx'] = null,
                this['color'] = '#FFFFFF',
                this['stroke'] = !1,
                this['strokeWidth'] = 2,
                this['strokeColor'] = '#000000',
                this['font'] = '700 16px Ubuntu',
                this['fontFamily'] = 'Ubuntu',
                this['fontWeight'] = 700,
                this['fontSize'] = 16,
                this['margin'] = 3,
                this['scale'] = 1,
                this['quality'] = 1,
                this['measuredWidth'] = 0,
                this['redraw'] = !1,
                this['remeasure'] = !1,
                this['setTxt'] = function(ogariosettxtsetter) {
                    this['txt'] !== ogariosettxtsetter && (this['txt'] = ogariosettxtsetter,
                        this['redraw'] = !0,
                        this['remeasure'] = !0);
                },
                this['setColor'] = function(ogariocolorsetter) {
                    this['color'] !== ogariocolorsetter && (this['color'] = ogariocolorsetter,
                        this['redraw'] = !0);
                },
                this['setStroke'] = function(ogariostrokesetter) {
                    this['stroke'] !== ogariostrokesetter && (this['stroke'] = ogariostrokesetter,
                        this['redraw'] = !0);
                },
                this['setStrokeWidth'] = function(ogariostrokewidthsetter) {
                    this['stroke'] && this['strokeWidth'] != ogariostrokewidthsetter && (this['strokeWidth'] = ogariostrokewidthsetter,
                        this['redraw'] = !0,
                        this['remeasure'] = !0);
                },
                this['setStrokeColor'] = function(ogariostrokecolorsetter) {
                    this['stroke'] && this['strokeColor'] !== ogariostrokecolorsetter && (this['strokeColor'] = ogariostrokecolorsetter,
                        this['redraw'] = !0);
                },
                this.setFont = function() {
                    this['font'] = this['fontWeight'] + ' ' + this['fontSize'] + 'px ' + this['fontFamily'];
                },
                this['setFontFamily'] = function(ogariofontfamilysetter) {
                    this['fontFamily'] !== ogariofontfamilysetter && (this['fontFamily'] = ogariofontfamilysetter,
                        this.setFont(),
                        this['redraw'] = !0,
                        this['remeasure'] = !0);
                },
                this.setFontWeight = function(ogariofontweightsetter) {
                    this['fontWeight'] != ogariofontweightsetter && (this['fontWeight'] = ogariofontweightsetter,
                        this.setFont(),
                        this['redraw'] = !0,
                        this['remeasure'] = !0);
                },
                this['setFontSize'] = function(ogariofontsizesetter) {
                    this['fontSize'] != ogariofontsizesetter && (this['fontSize'] = ogariofontsizesetter,
                        this['margin'] = ~~(0.2 * ogariofontsizesetter),
                        this.setFont(),
                        this['redraw'] = !0);
                },
                this['setScale'] = function(ogarioscalesetter) {
                    this['scale'] != ogarioscalesetter && (this['scale'] = ogarioscalesetter,
                        this['redraw'] = !0);
                },
                this['createCanvas'] = function() {
                    this['txtCanvas'] || (this['txtCanvas'] = document['createElement']('canvas'),
                        this['txtCtx'] = this['txtCanvas']['getContext']('2d'),
                        this['txtCtx']['ogarioCtx'] = !0);
                },
                this['setDrawing'] = function(ogarsetDrawinglabel1, ogarsetDrawinglabel2, ogarsetDrawinglabel3, ogarsetDrawinglabel4, ogarsetDrawinglabel5, ogarsetDrawinglabel6) {
                    this['setColor'](ogarsetDrawinglabel1),
                        this['setFontFamily'](ogarsetDrawinglabel2),
                        this.setFontWeight(ogarsetDrawinglabel3),
                        this['setStroke'](ogarsetDrawinglabel4),
                        this['setStrokeWidth'](ogarsetDrawinglabel5),
                        this['setStrokeColor'](ogarsetDrawinglabel6);
                },
                this['measureWidth'] = function() {
                    return this['remeasure'] && (this['txtCtx']['font'] = this['fontWeight'] + ' 10px ' + this['fontFamily'],
                            this['measuredWidth'] = this['txtCtx']['measureText'](this['txt'])['width'],
                            this['remeasure'] = !1),
                        ~~(this['fontSize'] / 10 * this['measuredWidth']) + 2 * this['strokeWidth'];
                },
                this['drawTxt'] = function() {
                    return this['createCanvas'](),
                        this['redraw'] && (this['redraw'] = !1,
                            this['txtCanvas']['width'] = this['measureWidth'](),
                            this['txtCanvas']['height'] = this['fontSize'] + this['margin'] * 2,
                            this['txtCtx']['font'] = this['font'],
                            this['txtCtx']['globalAlpha'] = 1,
                            this['txtCtx']['lineWidth'] = this['strokeWidth'],
                            this['txtCtx']['strokeStyle'] = this['strokeColor'],
                            this['txtCtx']['fillStyle'] = this['color'],
                            this['stroke'] && this['txtCtx']['strokeText'](this['txt'], this['strokeWidth'], ~~(this['fontSize'] + this['margin'] * 0.5)),
                            this['txtCtx']['fillText'](this['txt'], this['strokeWidth'], ~~(this['fontSize'] + this['margin'] * 0.5))),
                        this['txtCanvas'];
                };
        }
		window.legendmod3 = ogarminimapdrawer; 
        function ogarbasicassembly(t, e, s, o, a, n, r, l, h, c) {
            this['id'] = t, this['x'] = e, this['y'] = s, this['targetX'] = e, this['targetY'] = s, this['color'] = a, this['oppColor'] = null, this['size'] = o, this['targetSize'] = o, this['alpha'] = 1, this['nick'] = '', this['targetNick'] = '', this['nickCanvas'] = null, this['mass'] = 0, this['lastMass'] = 0, this['kMass'] = 0, this['massCanvas'] = null, this['massTxt'] = '', this['margin'] = 0, this['scale'] = 1, this['nickScale'] = 1, this['massScale'] = 1, this['virMassScale'] = 3, this['strokeScale'] = 1, this['fontSize'] = 0x1a, this['nickSize'] = 0x1a, this['lastNickSize'] = 0, this['massSize'] = 0x1a, this['virMassSize'] = 0x1a, this['nickStrokeSize'] = 3, this['massStrokeSize'] = 3, this['isFood'] = n, this['isVirus'] = r, this['isPlayerCell'] = l, this['shortMass'] = h, this['virMassShots'] = c, this['rescale'] = !1, this['redrawNick'] = !0, this['redrawMass'] = !0, this['optimizedNames'] = !1, this['optimizedMass'] = !1, this['strokeNick'] = !1, this['strokeMass'] = !1, this['removed'] = !1, this['redrawed'] = 0, this['time'] = 0, this['skin'] = null, this.pi2 = 2 * Math['PI'],
                this.virusColor = null,
                this.virusStroke = null,
                this.nHeight = 6,
                this['update'] = function(t, e, i, s, o, a) {
                    this['x'] = t, this['y'] = e, this['isVirus'] = s, this['isPlayerCell'] = o, this['setMass'](i), this['setNick'](a);
                }, this['removeCell'] = function() {
                    this['removed'] = !0;
                    var t = M['cells']['indexOf'](this); - 1 != t ? (M['cells']['splice'](t, 1), v['virusesRange'] && -1 != (t = M['viruses'].indexOf(this)) && M['viruses']['splice'](t, 1)) : -1 != (t = M['food'].indexOf(this)) && M['food']['splice'](t, 1), -1 != (t = M['playerCells'].indexOf(this)) && (M['removePlayerCell'] = !0, M['playerCells']['splice'](t, 1), -1 != (t = M['playerCellIDs'].indexOf(this['id'])) && M['playerCellIDs']['splice'](t, 1)), this['redrawed'] && M['removedCells'].push(this), delete M['indexedCells'][this['id']];
                }, this['moveCell'] = function() {
                    var t = (M['time'] - this['time']) / v['animation'];
                    if (t = t < 0 ? 0 : t > 1 ? 1 : t, this['x'] += (this['targetX'] - this['x']) * t, this['y'] += (this['targetY'] - this['y']) * t, this['size'] += (this['targetSize'] - this['size']) * t, this['alpha'] = t, this['removed']) {
                        if (1 == t) {
                            var e = M['removedCells'].indexOf(this); - 1 != e && M['removedCells']['splice'](e, 1);
                        }
                    } else this['time'] = M['time'];
                }, this['isInView'] = function() {
                    return !(this['id'] <= 0) && !(this['x'] + this['size'] + 40 < M['viewX'] - M['canvasWidth'] / 2 / M['scale'] || this['y'] + this['size'] + 40 < M['viewY'] - M['canvasHeight'] / 2 / M['scale'] || this['x'] - this['size'] - 40 > M['viewX'] + M['canvasWidth'] / 2 / M['scale'] || this['y'] - this['size'] - 40 > M['viewY'] + M['canvasHeight'] / 2 / M['scale']);
                }, this['setMass'] = function(t) {
                    return this['size'] = t, !(t <= 40) && (this['massCanvas'] ? (this['mass'] = ~~(t * t / 100), this['redrawMass'] = !0, this['isVirus'] ? (this['virMassShots'] && this['mass'] < 200 && (this['mass'] = ~~((200 - this['mass']) / 14)), this['massTxt'] = this['mass']['toString'](), this.mass > 220 ? (this.virusColor = g.mVirusColor, this.virusStroke = g.mVirusStrokeColor) : (this.virusColor = g.virusColor, this.virusStroke = g.virusStrokeColor), !0) : (this['massTxt'] = this['mass']['toString'](), this['mass'] <= 200 || (this['shortMass'] && this['mass'] >= 1000 ? (this['kMass'] = Math.round(this['mass'] / 100) / 10, this['massTxt'] = this['kMass'] + 'k', !0) : (this['optimizedMass'] && (this['redrawMass'] = Math['abs']((this['mass'] - this['lastMass']) / this['mass']) >= 0.02 || this['rescale']), !0)))) : (this['massCanvas'] = new irenderfromagario(), !1));
                }, this['setNick'] = function(t) {
                    return this['nick'] = t, !(!t || this['isVirus']) && (!!this['nickCanvas'] || (this['nickCanvas'] = new irenderfromagario(), !1));
                }, this['setScale'] = function(t, e, i, s, o) {
                    var a = Math['ceil'](10 * t) / 10;
                    this['rescale'] = !1, this['scale'] != a && (this['scale'] = a, this['rescale'] = !0), this['nickScale'] = e, this['massScale'] = i, this['virMassScale'] = s, this['strokeScale'] = o;
                }, this['setFontSize'] = function() {
                    this['isVirus'] ? this['massSize'] = Math['ceil'](this['virMassSize'] * this['scale'] * this['virMassScale']) : (this['fontSize'] = Math['max'](0.3 * this['size'], 0x1a) * this['scale'], this['nickSize'] = ~~(this['fontSize'] * this['nickScale']), this['massSize'] = ~~(0.5 * this['fontSize'] * this['massScale']), this['optimizedNames'] ? this['redrawNick'] = Math['abs']((this['nickSize'] - this['lastNickSize']) / this['nickSize']) >= 0.3 || this['rescale'] : this['redrawNick'] = !0);
                }, this['setStrokeSize'] = function() {
                    this['strokeNick'] && !this['isVirus'] && (this['nickStrokeSize'] = ~~(0.1 * this['nickSize'] * this['strokeScale'])), this['strokeMass'] && (this['massStrokeSize'] = ~~(0.1 * this['massSize'] * this['strokeScale']));
                }, this['setDrawing'] = function() {
                    this['optimizedNames'] = v['optimizedNames'], this['optimizedMass'] = v['optimizedMass'], this['shortMass'] = v['shortMass'], this['virMassShots'] = v['virMassShots'], this['strokeNick'] = v['namesStroke'], this['strokeMass'] = v['massStroke'];
                }, this['setDrawingScale'] = function() {
                    this['setScale'](i['viewScale'], g['namesScale'], g['massScale'], g['virMassScale'], g['strokeScale']), this['setFontSize'](), this['setStrokeSize'](), this['margin'] = 0;
                }, this['drawNick'] = function(mainCanvas) {
                    if (this['nick'] && this['nickCanvas'] && !this['isVirus']) {
                        var nickCanvas = this['nickCanvas'];
                        nickCanvas['setDrawing'](g['namesColor'], g['namesFontFamily'], g['namesFontWeight'], this['strokeNick'], this['nickStrokeSize'], g['namesStrokeColor']), nickCanvas['setTxt'](this['nick']), this['redrawNick'] && (nickCanvas['setFontSize'](this['nickSize']), this['lastNickSize'] = this['nickSize']), nickCanvas['setScale'](this['scale']);
                        const nickImg = nickCanvas.drawTxt(),
                            w = ~~(nickImg.width / this.scale),
                            h = ~~(nickImg.height / this.scale);
                        this.margin = ~~(h / 2);
                        if (w > 1 && h > 1) {
                            mainCanvas.drawImage(nickImg, ~~(this.x - w / 2), ~~this.y - this.margin, w, h);
                        }
                    }
                }, this['drawMass'] = function(mainCanvas) {
                    if (this['massCanvas'] && !(this['size'] <= 40)) {
                        var massCanvas = this['massCanvas'];
                        massCanvas['setDrawing'](g['massColor'], g['massFontFamily'], g['massFontWeight'], this['strokeMass'], this['massStrokeSize'], g['massStrokeColor']), this['redrawMass'] && (massCanvas['setTxt'](this['massTxt']), this['lastMass'] = this['mass']), massCanvas['setFontSize'](this['massSize']), massCanvas['setScale'](this['scale']);
                        let massImg = massCanvas.drawTxt(),
                            w = ~~(massImg.width / this.scale),
                            h = ~~(massImg.height / this.scale),
                            ogartempmassraw = this.margin === 0 ? ~~(this.y - h / 2) : ~~this.y + this.margin;
                        if (w > 1 && h > 1) {
                            mainCanvas.drawImage(massImg, ~~(this.x - w / 2), ogartempmassraw, w, h);
                        }
                    }
                },
                this.createStrokeVirusPath = function(_x, _y, _radius, width = 6) {
                    const nAngelsOfVirus = ~~(45 * _radius / 98),
                        angleStep2 = this.pi2 / nAngelsOfVirus,
                        angleStep = angleStep2 / 2,
                        ptx = new Path2D(),
                        radius = _radius - width,
                        p1 = radius + this.nHeight,
                        len = this.pi2 + angleStep2;
                    for (let a1 = 0, a2 = angleStep; a1 <= len; a2 = ((a1 += angleStep2) + angleStep)) {
                        ptx.lineTo(~~(_x + radius * Math.sin(a1)), ~~(_y + radius * Math.cos(a1)));
                        ptx.lineTo(~~(_x + p1 * Math.sin(a2)), ~~(_y + p1 * Math.cos(a2)));
                    }
                    return ptx;
                },
                this['draw'] = function(t, e) {
                    if (!(M['hideSmallBots'] && this['size'] <= 36)) {
                        t['save'](), this['redrawed']++, e && this['moveCell'](), this['removed'] && (t['globalAlpha'] *= 1 - this['alpha']);
                        var i = t['globalAlpha'],
                            s = !1,
                            o = this['isFood'] ? this['size'] + g['foodSize'] : this['size'];
                        if (t['beginPath'](), t.arc(this['x'], this['y'], o, 0, this.pi2, !1), t['closePath'](), this['isFood']) return t['fillStyle'] = this['color'], t.fill(), void t['restore']();
                        if (this['isVirus']) {
                            return v['transparentViruses'] && (t['globalAlpha'] *= g['virusAlpha'], s = !0), v['virColors'] && M.play ? (t['fillStyle'] = ogarminimapdrawer['setVirusColor'](o), t['strokeStyle'] = ogarminimapdrawer['setVirusStrokeColor'](o)) : (t['fillStyle'] = this.virusColor, t['strokeStyle'] = this.virusStroke), t.fill(), s && (t['globalAlpha'] = i, s = !1), t['lineWidth'] = g['virusStrokeSize'], t['stroke'](this.createStrokeVirusPath(this.x, this.y, this.size - 2, 6)), v['showMass'] && (this['setDrawing'](), this['setDrawingScale'](), this['setMass'](this['size']), this['drawMass'](t)), void t['restore']();
                        }
                        v['transparentCells'] && (t['globalAlpha'] *= g['cellsAlpha'], s = !0);
                        var a = this['color'];
                        M.play && (this['isPlayerCell'] ? v['myCustomColor'] && (a = ogarcopythelb['color']) : v['oppColors'] && !v['oppRings'] && (a = this['oppColor'])), t['fillStyle'] = a, t.fill(), s && (t['globalAlpha'] = i, s = !1);
                        var n = null;
                        if (v['customSkins'] && M['showCustomSkins'] && (n = ogarminimapdrawer['getCustomSkin'](this['targetNick'], this['color'])) && (((v['transparentSkins'] || M.play && v['oppColors']) && (!this['isPlayerCell'] || v['myTransparentSkin']) || this['isPlayerCell'] && v['myTransparentSkin']) && (t['globalAlpha'] *= g['skinsAlpha'], s = !0), t['drawImage'](n, this['x'] - o, this['y'] - o, 2 * o, 2 * o), s && (t['globalAlpha'] = i, s = !1)), v['teammatesInd'] && !this['isPlayerCell'] && o <= 200 && (n || ogarminimapdrawer['checkSkinsMap'](this['targetNick'], this['color'])) && ogarfooddrawer['drawTeammatesInd'](t, this['x'], this['y'], o), v['noNames'] && !v['showMass'] || e) t['restore']();
                        else {
                            var r = !1;
                            !this['isPlayerCell'] && (r = ogarminimapdrawer['setAutoHideCellInfo'](o)) && v['autoHideNames'] && v['autoHideMass'] ? t['restore']() : (this['setDrawing'](), this['setDrawingScale'](), t['globalAlpha'] *= g['textAlpha'], v['noNames'] || r && v['autoHideNames'] || this['isPlayerCell'] && v['hideMyName'] || n && v['hideTeammatesNames'] || this['setNick'](this['targetNick']) && this['drawNick'](t), !v['showMass'] || r && v['autoHideMass'] || this['isPlayerCell'] && v['hideMyMass'] || v['hideEnemiesMass'] && !this['isPlayerCell'] && !this['isVirus'] || this['setMass'](this['size']) && this['drawMass'](t), t['restore']());
                        }
                    }
                };
        }		
		window.legendmod1=ogarbasicassembly;
        var M = {
            'ws': null,
            'socket': null,
            'protocolKey': null,
            'clientKey': null,
            'connectionOpened': !1,
            'accessTokenSent': !1,
            'clientVersion': 0x76c0,
            'clientVersionString': '3.4.0',
            'time': Date['now'](),
            'serverTime': 0,
            'serverTimeDiff': 0,
            'loggedInTime': 0,
            'mapSize': 0x373e,
            'mapOffset': 7071,
            'mapOffsetX': 0,
            'mapOffsetY': 0,
            'mapOffsetFixed': !1,
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
            'autoZoom': !1,
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
                'joined': !1
            },
            'play': !1,
            'pause': !1,
            'targeting': !1,
            'removePlayerCell': !1,
            'showCustomSkins': !0,
            'showFood': !0,
            'foodIsHidden': !1,
            'selectBiggestCell': !0,
            'hideSmallBots': !1,
            'pressedKeys': {},
            'connect': function(t) {
                console.log('[Legend mod Express] Connecting to game server:', t);
                var i = this;
                this['closeConnection'](), this['flushCellsData'](), this['protocolKey'] = null, this['clientKey'] = null, this['accessTokenSent'] = !1, this['connectionOpened'] = !1, this['mapOffsetFixed'] = !1, this['leaderboard'] = [], this['ws'] = t, this.socket = new WebSocket(t), this.socket['binaryType'] = 'arraybuffer', this.socket['onopen'] = function() {
                    i['onOpen']();
                }, this.socket['onmessage'] = function(t) {
                    i['onMessage'](t);
                }, this.socket['onerror'] = function(t) {
                    i['onError'](t);
                }, this.socket['onclose'] = function(t) {
                    i['onClose'](t);
                }, ogarminimapdrawer['getWS'](this['ws']), ogarminimapdrawer['sendServerJoin'](), ogarminimapdrawer['sendServerData'](), ogarminimapdrawer['displayLeaderboard'](''), e.master && e.master['onConnect'] && e.master['onConnect']();
            },
            'onOpen': function(t) {
                console.log('[Legend mod Express] Game server socket open'), this['time'] = Date['now']();
                var e = this.createView(5);
                e.setUint8(0, 254), e.setUint32(1, 20, !0), this.sendMessage(e), (e = this.createView(5)).setUint8(0, 255), e.setUint32(1, this.clientVersion, !0), this.sendMessage(e), this['connectionOpened'] = !0;
            },
            'onMessage': function(t) {
                t = new DataView(t['data']), this['protocolKey'] && (t = this['shiftMessage'](t, this['protocolKey'] ^ this.clientVersion)), this['handleMessage'](t);
            },
            'onError': function(t) {
                console.log('[Legend mod Express] Game server socket error'), this['flushCellsData'](), e.master && e.master['onDisconnect'] && e.master['onDisconnect']();
            },
            'onClose': function(t) {
                console.log('[Legend mod Express] Game server socket close'), this['flushCellsData'](), e.master && e.master['onDisconnect'] && e.master['onDisconnect']();
            },
            'closeConnection': function() {
                if (this.socket) {
                    this.socket['onopen'] = null, this.socket['onmessage'] = null, this.socket['onerror'] = null, this.socket['onclose'] = null;
                    try {
                        this.socket['close']();
                    } catch (ogarcloseconncloser) {}
                    this.socket = null, this['ws'] = null;
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
                if (this['connectionOpened']) {
                    if (!this['clientKey']) return;
                    t = this['shiftMessage'](t, this['clientKey']), this['clientKey'] = this['shiftKey'](this['clientKey']);
                }
                this['sendBuffer'](t);
            },
            'sendAction': function(t) {
                if (this['isSocketOpen']()) {
                    var e = this.createView(1);
                    e.setUint8(0, t), this.sendMessage(e);
                }
            },
            'sendSpectate': function() {
                this.sendAction(1);
            },
            'sendFreeSpectate': function() {
                this.sendAction(18);
            },
            'sendEject': function() {
                this['sendPosition'](), this.sendAction(21);
            },
            'sendSplit': function() {
                this['sendPosition'](), this.sendAction(17);
            },
            'sendNick': function(t) {
                this['playerNick'] = t, t = e['unescape'](e['encodeURIComponent'](t));
                var i = this.createView(1 + t.length);
                i.setUint8(0, 0);
                for (var s = 0; s < t.length; s++) i.setUint8(s + 1, t.charCodeAt(s));
                this.sendMessage(i);
            },
            'sendPosition': function() {
                if (this['isSocketOpen']() && this['connectionOpened'] && this['clientKey']) {
                    var t = this['cursorX'],
                        e = this['cursorY'];
                    (!this.play && this['targeting'] || this.pause) && (t = this['targetX'], e = this['targetY']);
                    var i = this.createView(13);
                    i.setUint8(0, 16), i['setInt32'](1, t, !0), i['setInt32'](5, e, !0), i.setUint32(9, this['protocolKey'], !0), this.sendMessage(i);
                }
            },
/*            'sendAccessToken': function(t, e, i) {
                if (!this['accessTokenSent']) {
                    i || (i = 102);
                    for (var s = t.length, o = this.clientVersionString.length, a = [i, 8, 1, 18, s + o + 23, 1, 8, 10, 0x52, s + o + 18, 1, 8, e, 18, o + 8, 8, 5, 18, o], n = 0; n < o; n++) a.push(this.clientVersionString.charCodeAt(n));
                    for (a.push(24, 0, 32, 0, 0x1a, s + 3, 1, 10, s, 1), n = 0; n < s; n++) a.push(t.charCodeAt(n));
                    a = new Uint8Array(a);
                    var r = new DataView(a['buffer']);
                    this.sendMessage(r);
                }
            }, */
        "sendAccessToken" : function(shapes, options, oW) {
          if (this["accessTokenSent"]) {
            return;
          }
          if (!oW) {
            oW = 102;
          }
          var curr = shapes["length"];
          var count = this["clientVersionString"]["length"];
          var data = [oW, 8, 1, 18];
          //this["writeUint32"](data, curr + count + 23);
		  ogarminimapdrawer["writeUint32"](data, curr + count + 23);
          data["push"](8, 10, 82);
		  ogarminimapdrawer['writeUint32'](data, curr + count + 18);
          //this['writeUint32'](data, curr + count + 18);
          data["push"](8, options, 18, count + 8, 8, 5, 18, count);
          var prev = 0;
          for (; prev < count; prev++) {
            data["push"](this["clientVersionString"]["charCodeAt"](prev));
          }
          data["push"](24, 0, 32, 0, 26);
		  ogarminimapdrawer["writeUint32"](data, curr + 3);
          //this["writeUint32"](data, curr + 3);
          data["push"](10);
		  ogarminimapdrawer["writeUint32"](data, curr);
          //this["writeUint32"](data, curr);
          prev = 0;
          for (; prev < curr; prev++) {
            data["push"](shapes["charCodeAt"](prev));
          }
          data = new Uint8Array(data);
          var raw_basefont = new DataView(data["buffer"]);
          this["sendMessage"](raw_basefont);
        },			
            'sendFbToken': function(t) {
				console.log("Facebook token: " + t);
                this.sendAccessToken(t, 2);
            },
            'sendGplusToken': function(t) {
				console.log("Google Plus token: " + t);
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
                this.clientVersion = t, this.clientVersionString = e, console.log('[Legend mod Express] Client version:', t, e);
            },
            'generateClientKey': function(t, e) {
                if (!t.length || !e.byteLength) return null;
                for (var i = null, s = 1540483477, o = t['match'](/(ws+:\/\/)([^:]*)(:\d+)/)[2], a = o.length + e.byteLength, n = new Uint8Array(a), r = 0; r < o.length; r++) n[r] = o.charCodeAt(r);
                n['set'](e, o.length);
                for (var l = new DataView(n['buffer']), h = a - 1, c = 4 + (h - 4 & -4) | 0, u = 255 ^ h, d = 0; h > 3;) i = 0 | Math['imul'](l.getInt32(d, !0), s), u = (0 | Math['imul'](i >>> 24 ^ i, s)) ^ (0 | Math['imul'](u, s)), h -= 4, d += 4;
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
                return i != u && (i = 0 | Math['imul'](n[c] ^ u, s)), i ^= u = i >>> 13, i = 0 | Math['imul'](i, s), i ^= u = i >>> 15, console.log('[Legend mod Express] Generated client key:', i), i;
            },
            'shiftKey': function(t) {
                return t = 0 | Math['imul'](t, 1540483477), t = 114296087 ^ (0 | Math['imul'](t >>> 24 ^ t, 1540483477)), (t = 0 | Math['imul'](t >>> 13 ^ t, 1540483477)) >>> 15 ^ t;
            },
            'shiftMessage': function(t, e, i) {
                if (i)
                    for (s = 0; s < t.length; s++) t.writeUInt8(t.readUInt8(s) ^ e >>> s % 4 * 8 & 255, s);
                else
                    for (var s = 0; s < t.byteLength; s++) t.setUint8(s, t.getUint8(s) ^ e >>> s % 4 * 8 & 255);
                return t;
            },
            'decompressMessage': function(t) {
                var e = new o(t['buffer']),
                    i = new o(e.readUInt32LE(1));
                return a['decodeBlock'](e['slice'](5), i), i;
            },
            'handleMessage': function(t) {
                var i = function() {
                        for (var e = '';;) {
                            var i = t.getUint8(s++);
                            if (0 == i) break;
                            e += String['fromCharCode'](i);
                        }
                        return e;
                    },
                    s = 0,
                    o = t['getUint8'](s++);
                switch (54 == o && (o = 53), o) {
                    case 5:
                        break;
                    case 17:
                        this['viewX'] = t.getFloat32(s, !0), s += 4, this['viewY'] = t.getFloat32(s, !0), s += 4, this['scale'] = t.getFloat32(s, !0);
                        break;
                    case 18:
                        this['protocolKey'] && (this['protocolKey'] = this['shiftKey'](this['protocolKey'])), this['flushCellsData']();
                        break;
                    case 32:
                        this['playerCellIDs'].push(t.getUint32(s, !0)), this.play || (this.play = !0, ogarminimapdrawer['hideMenu'](), this['playerColor'] = null, ogarminimapdrawer['onPlayerSpawn']());
                        break;
                    case 50:
                        this['pieChart'] = [];
                        var a = t.getUint32(s, !0);
                        s += 4;
                        for (var n = 0; n < a; n++) this['pieChart'].push(t.getFloat32(s, !0)), s += 4;
                        ogarfooddrawer['drawPieChart']();
                        break;
                    case 53:
                        if (this['leaderboard'] = [], this['playerPosition'] = 0, 54 == t.getUint8(0)) {
                            t.getUint16(s, !0);
                            s += 2;
                        }
                        for (var r = 0; s < t.byteLength;) {
                            var l = '',
                                h = 0,
                                c = !1;
                            r++, 2 & (y = t['getUint8'](s++)) && (l = e['decodeURIComponent'](escape(i()))), 4 & y && (h = t.getUint32(s, !0), s += 4), 8 & y && (l = this['playerNick'], h = 'isPlayer', this['playerPosition'] = r), 16 & y && (c = !0), this['leaderboard'].push({
                                'nick': l,
                                'id': h,
                                'isFriend': c
                            });
                        }
                        this['handleLeaderboard']();
                        break;
                    case 54:
                        break;
                    case 69:
                        var u = t.getUint16(s, !0);
                        s += 2, this['ghostCells'] = [];
                        for (n = 0; n < u; n++) {
                            var d = t.getInt32(s, !0);
                            s += 4;
                            var f = t.getInt32(s, !0);
                            s += 4;
                            var m = t.getUint32(s, !0);
                            s += 5;
                            var g = ~~Math['sqrt'](100 * m);
                            this['ghostCells'].push({
                                'x': d,
                                'y': f,
                                'size': g,
                                'mass': m,
                                'inView': this['isInView'](d, f, g)
                            });
                        }
                        break;
                    case 85:
                        console.log('[Legend mod Express] Captcha requested'), e.master && e.master['recaptchaRequested'] && e.master['recaptchaRequested']();
                        break;
                    case 102:
                        t.byteLength < 20 && e['logout'] && e['logout']();
                        break;
                    case 103:
                        this['loggedInTime'] = Date['now'](), this['accessTokenSent'] = !0;
                        break;
                    case 114:
                    case 161:
                        break;
                    case 176:
                        this['battleRoyale']['startTime'] = t.getUint32(s, !0);
                        break;
                    case 177:
                        this['battleRoyale']['joined'] = !0;
                        break;
                    case 178:
                        this['battleRoyale']['players'] = t.getUint16(s, !0), s += 2;
                        var y = t.getUint16(s, !0);
                        s += 2, y || (this['battleRoyale']['state'] = 0, this['battleRoyale']['joined'] = !1), 3 & y && (this['battleRoyale']['state'] = t.getUint8(s++), this['battleRoyale']['x'] = t.getInt32(s, !0), s += 4, this['battleRoyale']['y'] = t.getInt32(s, !0), s += 4, this['battleRoyale']['radius'] = t.getUint32(s, !0), s += 4, this['battleRoyale']['shrinkTime'] = 1000 * t.getUint32(s, !0), s += 4, this['battleRoyale']['shrinkTime'] && (this['battleRoyale']['timeLeft'] = ~~((this['battleRoyale']['shrinkTime'] - Date['now']() + this['serverTimeDiff']) / 1000), this['battleRoyale']['timeLeft'] < 0 && (this['battleRoyale']['timeLeft'] = 0))), 2 & y && (this['battleRoyale']['targetX'] = t.getInt32(s, !0), s += 4, this['battleRoyale']['targetY'] = t.getInt32(s, !0), s += 4, this['battleRoyale']['targetRadius'] = t.getUint32(s, !0));
                        break;
                    case 179:
                        y = t.getUint8(s), e['decodeURIComponent'](escape(i()));
                        y || e.decodeURIComponent(escape(i()));
                        break;
                    case 180:
                        this['battleRoyale']['joined'] = !1, this['battleRoyale']['rank'] = [], this['battleRoyale']['playerRank'] = t.getUint32(s, !0), s += 8;
                        var ogario1PlayerProfiles = t.getUint16(s, !0);
                        s += 2;
                        for (n = 0; n < ogario1PlayerProfiles; n++) {
                            var ogarcopythelb = e['decodeURIComponent'](escape(i())),
                                v = t.getUint32(s, !0);
                            s += 4, this['battleRoyale']['rank'].push({
                                'place': v,
                                'name': ogarcopythelb
                            });
                        }
                        break;
                    case 226:
                        break;
                    case 241:
                        this['protocolKey'] = t.getUint32(s, !0), console.log('[Legend mod Express] Received protocol key:', this['protocolKey']);
                        var irenderfromagario = new Uint8Array(t['buffer'], s += 4);
                        this['clientKey'] = this['generateClientKey'](this['ws'], irenderfromagario), e.master && e.master.login && e.master.login();
                        break;
                    case 242:
                        this['serverTime'] = 1000 * t.getUint32(s, !0), this['serverTimeDiff'] = Date['now']() - this['serverTime'];
                        break;
                    case 255:
                        this['handleSubmessage'](t);
                        break;
                    default:
                        console.log('[Legend mod Express] Unknown opcode:', t.getUint8(0));
                }
            },
            'handleSubmessage': function(t) {
                var e = 0;
                switch ((t = this['decompressMessage'](t)).readUInt8(e++)) {
                    case 16:
                        this['updateCells'](t, e);
                        break;
                    case 64:
                        this['viewMinX'] = t.readDoubleLE(e), e += 8, this['viewMinY'] = t.readDoubleLE(e), e += 8, this['viewMaxX'] = t.readDoubleLE(e), e += 8, this['viewMaxY'] = t.readDoubleLE(e), this['setMapOffset'](this['viewMinX'], this['viewMinY'], this['viewMaxX'], this['viewMaxY']);
                        break;
                    default:
                        console.log('[Legend mod Express] Unknown sub opcode:', t.readUInt8(0));
                }
            },
            'handleLeaderboard': function() {				
                for (var t = '', e = '', i = 0; i < this['leaderboard'].length && window.leaderboardlimit != i; i++) {
                    var s = '<span>';
                    'isPlayer' === this['leaderboard'][i]['id'] ? s = '<span class=\"me\">' : ogarcopythelb['clanTag'].length && 0 == this['leaderboard'][i]['nick'].indexOf(ogarcopythelb['clanTag']) && (s = '<span class=\"teammate\">'), t += s + (i + 1) + '. ' + ogarminimapdrawer['escapeHTML'](this['leaderboard'][i]['nick']) + '</span>';
                }
                if (this['playerPosition'] > window.leaderboardlimit && (t += '<span class=\"me\">' + this['playerPosition'] + '. ' + ogarminimapdrawer['escapeHTML'](this['playerNick']) + '</span>'), v['showLbData'])
                    for (var o = 0; o < this['ghostCells'].length && o != i; o++) e += '<span class=\"lb-data\">', e += '<span class=\"top5-mass-color\">[' + ogarminimapdrawer['shortMassFormat'](this['ghostCells'][o]['mass']) + ']</span>', e += '<span class=\"hud-main-color\">[' + ogarminimapdrawer['calculateMapSector'](this['ghostCells'][o]['x'], this['ghostCells'][o]['y']) + ']</span>', e += '</span>';
                ogarminimapdrawer['displayLeaderboard'](t, e);
				///////////////// establish core.registerSkin
				if (window.vanillaskins==true){
					if (window.customskinsname!=null && window.customskinsname!=undefined){
						for (i=0; i<=this['leaderboard'].length-1; i++){		
							if (this['leaderboard'][i]['nick'] == window.customskinsname){
								ogarminimapdrawer['customSkinsMap'][window.customskinsname]=window.customskinsurl;
								ogarminimapdrawer['loadSkin'](ogarminimapdrawer['customSkinsCache'], window.customskinsurl);
								window.customskinsname=undefined;
							}
						}
					}
				}
				
            },
            'flushCellsData': function() {
                this['indexedCells'] = {}, this['cells'] = [], this['playerCells'] = [], this['playerCellIDs'] = [], this['ghostCells'] = [], this['food'] = [], this['viruses'] = [];
            },
            'setMapOffset': function(t, e, i, s) {
                i - t > 14000 && s - e > 14000 && (this['mapOffsetX'] = this['mapOffset'] - i, this['mapOffsetY'] = this['mapOffset'] - s, this['mapMinX'] = ~~(-this['mapOffset'] - this['mapOffsetX']), this['mapMinY'] = ~~(-this['mapOffset'] - this['mapOffsetY']), this['mapMaxX'] = ~~(this['mapOffset'] - this['mapOffsetX']), this['mapMaxY'] = ~~(this['mapOffset'] - this['mapOffsetY']), this['mapOffsetFixed'] || (this['viewX'] = (i + t) / 2, this['viewY'] = (s + e) / 2), this['mapOffsetFixed'] = !0, console.log('[Legend mod Express] Map offset fixed (x, y):', this['mapOffsetX'], this['mapOffsetY']));
            },
            'isInView': function(t, e, i) {
                var s = this['canvasWidth'] / 2 / this['scale'],
                    o = this['canvasHeight'] / 2 / this['scale'];
                return !(t + i < this['viewX'] - s || e + i < this['viewY'] - o || t - i > this['viewX'] + s || e - i > this['viewY'] + o);
            },
            'updateCells': function(t, i) {
                var s = function() {
                    for (var e = '';;) {
                        var s = t.readUInt8(i++);
                        if (0 == s) break;
                        e += String['fromCharCode'](s);
                    }
                    return e;
                };
                this['time'] = Date['now'](), this['removePlayerCell'] = !1;
                var o = t.readUInt16LE(i);
                i += 2;
                for (var a = 0; a < o; a++) {
                    var n = this['indexedCells'][t.readUInt32LE(i)],
                        r = this['indexedCells'][t.readUInt32LE(i + 4)];
                    i += 8, n && r && (r['targetX'] = n['x'], r['targetY'] = n['y'], r['targetSize'] = r['size'], r['time'] = this['time'], r['removeCell']());
                }
                for (a = 0;;) {
                    var l = t.readUInt32LE(i);
                    if (i += 4, 0 == l) break;
                    var h = t['readInt32LE'](i);
                    i += 4;
                    var c = t['readInt32LE'](i);
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
                        m = this['rgb2Hex'](~~(0.9 * ogario1PlayerProfiles), ~~(0.9 * ogarcopythelb), ~~(0.9 * irenderfromagario));
                    }

                    //4 & d && (g = s()),
                    //8 & d && (y = e.decodeURIComponent(escape(s())));
                    if (4 & d) {
						g = s();
//						console.log('skin '+g);
                        
                    }
                    if (8 & d) {
                        y = e.decodeURIComponent(escape(s()));
                        if (g != null) {
							if (window.vanillaskins==true){
                            var skin2search = g.replace('%', '');
                            if (window.LMAgarGameConfiguration != undefined) {
                                for (var player = 0; player < window.EquippableSkins.length; player++) {
                                    if (window.EquippableSkins[player].productId == "skin_" + skin2search) {
                                        //console.log("Player: " + y + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);
										if (ogarminimapdrawer['customSkinsMap'][y]==undefined){	
											if (window.EquippableSkins[player].image!="uses_spine"){
												ogarminimapdrawer['customSkinsMap'][y]="https://configs-web.agario.miniclippt.com/live/"+window.agarversion+window.EquippableSkins[player].image;
												ogarminimapdrawer['loadSkin'](ogarminimapdrawer['customSkinsCache'], "https://configs-web.agario.miniclippt.com/live/"+window.agarversion+window.EquippableSkins[player].image);
												}
											}								
										}
									}
								}
							}
                        }
                    }
                    //8 & d && (y = e.decodeURIComponent(escape(s())));
                    var M = 1 & d,
                        ogarioset1final = 1 & f,
                        ogariocellssetts = null;
                    this['indexedCells'].hasOwnProperty(l) ? (ogariocellssetts = this['indexedCells'][l], m && (ogariocellssetts['color'] = m)) : ((ogariocellssetts = new ogarbasicassembly(l, h, c, u, m, ogarioset1final, M, !1, v['shortMass'], v['virMassShots']))['time'] = this['time'], ogarioset1final ? this['food'].push(ogariocellssetts) : (M && v['virusesRange'] && this['viruses'].push(ogariocellssetts), this['cells'].push(ogariocellssetts), -1 != this['playerCellIDs']['indexOf'](l) && -1 == this['playerCells'].indexOf(ogariocellssetts) && (ogariocellssetts['isPlayerCell'] = !0, this['playerColor'] = m, this['playerCells'].push(ogariocellssetts))), this['indexedCells'][l] = ogariocellssetts), ogariocellssetts['isPlayerCell'] && (y = this['playerNick']), y && (ogariocellssetts['targetNick'] = y), ogariocellssetts['targetX'] = h, ogariocellssetts['targetY'] = c, ogariocellssetts['targetSize'] = u, ogariocellssetts['isFood'] = ogarioset1final, ogariocellssetts['isVirus'] = M, g && (ogariocellssetts['skin'] = g), 4 & f && (t.readUInt32LE(i), i += 4);
                }
                for (o = t.readUInt16LE(i), i += 2, a = 0; a < o; a++) {
                    l = t.readUInt32LE(i);
                    i += 4, (ogariocellssetts = this['indexedCells'][l]) && ogariocellssetts['removeCell']();
                }
                this['removePlayerCell'] && !this['playerCells'].length && (this.play = !1, ogarminimapdrawer['onPlayerDeath'](), ogarminimapdrawer['showMenu'](300));
            },
            'color2Hex': function(t) {
                var e = t['toString'](16);
                return 1 == e.length ? '0' + e : e;
            },
            'rgb2Hex': function(t, e, i) {
                return '#' + this['color2Hex'](t) + this['color2Hex'](e) + this['color2Hex'](i);
            },
            'sortCells': function() {
                this['cells']['sort'](function(t, e) {
                    return t['size'] == e['size'] ? t['id'] - e['id'] : t['size'] - e['size'];
                });
            },
            'calculatePlayerMassAndPosition': function() {
                for (var t = 0, e = 0, i = 0, s = 0, o = this['playerCells'].length, a = 0; a < o; a++) {
                    var n = this['playerCells'][a];
                    t += n['size'], e += n['targetSize'] * n['targetSize'], i += n['x'] / o, s += n['y'] / o;
                }
                this['viewX'] = i, this['viewY'] = s, this['playerSize'] = t, this['playerMass'] = ~~(e / 100), this['recalculatePlayerMass']();
            },
            'recalculatePlayerMass': function() {
                if (this['playerScore'] = Math['max'](this['playerScore'], this['playerMass']), v['virColors'] || v['splitRange'] || v['oppColors'] || v['oppRings'] || v['showStatsSTE']) {
                    var t = this['playerCells'],
                        e = t.length;
                    t['sort'](function(t, e) {
                        return t['size'] == e['size'] ? t['id'] - e['id'] : t['size'] - e['size'];
                    }), this['playerMinMass'] = ~~(t[0]['size'] * t[0]['size'] / 100), this['playerMaxMass'] = ~~(t[e - 1]['size'] * t[e - 1]['size'] / 100), this['playerSplitCells'] = e;
                }
                if (v['showStatsSTE']) {
                    var i = this['selectBiggestCell'] ? this['playerMaxMass'] : this['playerMinMass'];
                    this['STE'] = i > 35 ? ~~(i * (i < 1000 ? 0.35 : 0.38)) : null;
                }
            },
            'compareCells': function() {
                if (this.play && (v['oppColors'] || v['oppRings'] || v['splitRange'])) {
                    (v['oppRings'] || v['splitRange']) && (this['biggerSTECellsCache'] = [], this['biggerCellsCache'] = [], this['smallerCellsCache'] = [], this['STECellsCache'] = []);
                    for (var t = 0; t < this['cells'].length; t++) {
                        var e = this['cells'][t];
                        if (!e['isVirus']) {
                            var i = ~~(e['size'] * e['size'] / 100),
                                s = this['selectBiggestCell'] ? this['playerMaxMass'] : this['playerMinMass'],
                                o = i / s,
                                a = s < 1000 ? 0.35 : 0.38;
                            v['oppColors'] && !v['oppRings'] && (e['oppColor'] = this['setCellOppColor'](e['isPlayerCell'], o, a)), e['isPlayerCell'] || !v['splitRange'] && !v['oppRings'] || this['cacheCells'](e['x'], e['y'], e['size'], o, a);
                        }
                    }
                }
            },
            'cacheCells': function(t, e, i, s, o) {
                return s >= 2.5 ? void this['biggerSTECellsCache'].push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 1.25 ? void this['biggerCellsCache'].push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s < 1.25 && s > 0.75 ? void 0 : s > o ? void this['smallerCellsCache'].push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : void this['STECellsCache'].push({
                    'x': t,
                    'y': e,
                    'size': i
                });
            },
            'setCellOppColor': function(t, e, i) {
                return t ? ogarcopythelb['color'] : e > 11 ? '#FF008C' : e >= 2.5 ? '#BE00FF' : e >= 1.25 ? '#FF0A00' : e < 1.25 && e > 0.75 ? '#FFDC00' : e > i ? '#00C8FF' : '#64FF00';
            },
            'getCursorPosition': function() {
                this['cursorX'] = (this['clientX'] - this['canvasWidth'] / 2) / this['viewScale'] + this['viewX'], this['cursorY'] = (this['clientY'] - this['canvasHeight'] / 2) / this['viewScale'] + this['viewY'];
            },
            'setZoom': function(t) {
                t.preventDefault(), this['zoomValue'] *= Math['pow'](v['zoomSpeedValue'], t['wheelDelta'] / -120 || t['detail'] || 0), this['zoomValue'] > 4 / this['viewScale'] && (this['zoomValue'] = 4 / this['viewScale']);
            },
            'setTargetPosition': function(t, e) {
                this['targetX'] = t - this['mapOffsetX'], this['targetY'] = e - this['mapOffsetY'], this['targetDistance'] = Math.round(Math['sqrt'](Math['pow'](this['playerX'] - this['targetX'], 2) + Math['pow'](this['playerY'] - this['targetY'], 2)));
            },
            'resetTargetPosition': function() {
                this['targetX'] = this['playerX'], this['targetY'] = this['playerY'];
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
                    t.pressedKeys[e.keyCode] = !1;
                };
            },
            'init': function() {
                var t = this;
                /firefox/i .test(navigator['userAgent']) ? document.addEventListener('DOMMouseScroll', function(e) {
                    t['setZoom'](e);
                }, !1): document['body']['onmousewheel'] = function(e) {
                    t['setZoom'](e);
                }, setInterval(function() {
                    t['sendPosition']();
                }, 40), e.master && e.master.clientVersion && this.setClientVersion(e.master.clientVersion, e.master.clientVersionString);
            }
        };
		window.legendmod = M; // look at this
		
        e.sendAction = function(t) {
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
                'pi2': 2 * Math['PI'],
                'battleAreaMap': null,
                'battleAreaMapCtx': null,
                'pieChart': null,
                'pellet': null,
                'indicator': null,
                'setCanvas': function() {
                    this.canvas = document.getElementById('canvas'), this['ctx'] = this.canvas['getContext']('2d'), this.canvas['onmousemove'] = function(t) {
                        M['clientX'] = t['clientX'], M['clientY'] = t['clientY'], M['getCursorPosition']();
                    };
                },
                'resizeCanvas': function() {
                    this['canvasWidth'] = e['innerWidth'], this['canvasHeight'] = e['innerHeight'], this.canvas['width'] = this['canvasWidth'], this.canvas['height'] = this['canvasHeight'], M['canvasWidth'] = this['canvasWidth'], M['canvasHeight'] = this['canvasHeight'], this['renderFrame']();
                },
                'setView': function() {
                    this['setScale'](),
					M['playerCells'].length ?
					(M['calculatePlayerMassAndPosition'](),
//					this.camX += (M.viewX - this.camX) / 2,
//					this.camY += (M.viewY - this.camY) / 2) :
					this.camX = (this.camX + M['viewX']) / 2,
					this.camY = (this.camY + M['viewY']) / 2) :
					(this.camX = (29 * this.camX + M['viewX']) / 30,
					this.camY = (29 * this.camY + M['viewY']) / 30),
					M['playerX'] = this.camX, M['playerY'] = this['camY'];
                },
                'setScale': function() {
                    if (!M['autoZoom']) return this['scale'] = (9 * this['scale'] + this['getZoom']()) / 10, void(M['viewScale'] = this['scale']);
                    M.play ? this['scale'] = (9 * this['scale'] + Math['pow'](Math['min'](64 / M['playerSize'], 1), 0.4) * this['getZoom']()) / 10 : this['scale'] = (9 * this['scale'] + M['scale'] * this['getZoom']()) / 10, M['viewScale'] = this['scale'];
                },
                'getZoom': function() {
                    return Math['max'](this['canvasWidth'] / 1080, this['canvasHeight'] / 1920) * M['zoomValue'];
                },
                'renderFrame': function() {
                    for (M['time'] = Date['now'](), e = 0; e < M['cells'].length; e++) M['cells'][e]['moveCell']();
                    if (this['setView'](), M['getCursorPosition'](), M['sortCells'](), M['compareCells'](), this['ctx']['clearRect'](0, 0, this['canvasWidth'], this['canvasHeight']), v['showGrid'] && this['drawGrid'](this['ctx'], this['canvasWidth'], this['canvasHeight'], this['scale'], this.camX, this.camY), this['ctx']['save'](), this['ctx']['translate'](this['canvasWidth'] / 2, this['canvasHeight'] / 2), this['ctx']['scale'](this['scale'], this['scale']), this['ctx']['translate'](-this.camX, -this.camY), v['showBgSectors'] && this['drawSectors'](this['ctx'], M['mapOffsetFixed'], g['sectorsX'], g['sectorsY'], M['mapMinX'], M['mapMinY'], M['mapMaxX'], M['mapMaxY'], g['gridColor'], g['sectorsColor'], g['sectorsWidth'], !0), ':battleroyale' === M['gameMode'] && this['drawBattleArea'](this['ctx']), v['showMapBorders']) {
                        var t = g['bordersWidth'] / 2;
                        this['drawMapBorders'](this['ctx'], M['mapOffsetFixed'], M['mapMinX'] - t, M['mapMinY'] - t, M['mapMaxX'] + t, M['mapMaxY'] + t, g['bordersColor'], g['bordersWidth']);
                    }
                    v['virusesRange'] && this['drawVirusesRange'](this['ctx'], M['viruses']), this['drawFood'](), M.play && (v['splitRange'] && this['drawSplitRange'](this['ctx'], M['biggerSTECellsCache'], M['playerCells'], M['selectBiggestCell']), v['oppRings'] && this['drawOppRings'](this['ctx'], this['scale'], M['biggerSTECellsCache'], M['biggerCellsCache'], M['smallerCellsCache'], M['STECellsCache']), v['cursorTracking'] && this['drawCursorTracking'](this['ctx'], M['playerCells'], M['cursorX'], M['cursorY'])), this['drawGhostCells']();
                    for (var e = 0; e < M['removedCells'].length; e++) M['removedCells'][e]['draw'](this['ctx'], !0);
                    for (e = 0; e < M['cells'].length; e++) M['cells'][e]['draw'](this['ctx']);
                    this['ctx']['restore'](), ':teams' === M['gameMode'] && this['pieChart'] && this['pieChart']['width'] && this['ctx']['drawImage'](this['pieChart'], this['canvasWidth'] - this['pieChart']['width'] - 10, 10);
                },
                'drawGrid': function(t, e, i, s, o, a) {
                    var n = e / s,
                        r = i / s,
                        l = (n / 2 - o) % 50,
                        h = (r / 2 - a) % 50;
                    for (t['strokeStyle'] = g['gridColor'], t['globalAlpha'] = 1 * s, t['beginPath'](); l < n; l += 50) t['moveTo'](l * s - 0.5, 0), t['lineTo'](l * s - 0.5, r * s);
                    for (; h < r; h += 50) t['moveTo'](0, h * s - 0.5), t['lineTo'](n * s, h * s - 0.5);
                    t['stroke'](), t['globalAlpha'] = 1;
                },
                'drawSectors': function(t, e, i, s, o, a, n, r, l, h, c, u) {
                    if (e || !u) {
                        var d = ~~((n - o) / i),
                            f = ~~((r - a) / s),
                            m = 0,
                            y = 0;
                        if (t['strokeStyle'] = l, t['fillStyle'] = h, t['lineWidth'] = c, u || !u && v['showMiniMapGrid']) {
                            t['beginPath']();
                            for (var ogario1PlayerProfiles = 0; ogario1PlayerProfiles < i + 1; ogario1PlayerProfiles++) m = o + d * ogario1PlayerProfiles, t['moveTo'](ogario1PlayerProfiles == i ? n : m, a), t['lineTo'](ogario1PlayerProfiles == i ? n : m, r);
                            for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < s + 1; ogario1PlayerProfiles++) y = a + f * ogario1PlayerProfiles, t['moveTo'](o - c / 2, ogario1PlayerProfiles == s ? r : y), t['lineTo'](n + c / 2, ogario1PlayerProfiles == s ? r : y);
                            t['stroke']();
                        } else this['drawMapBorders'](t, e, o, a, n, r, l, c);
                        t['font'] = u ? g['sectorsFontWeight'] + ' ' + g['sectorsFontSize'] + 'px ' + g['sectorsFontFamily'] : g['miniMapFontWeight'] + ' ' + ~~(0.4 * f) + 'px ' + g['miniMapFontFamily'], t['textAlign'] = 'center', t['textBaseline'] = 'middle';
                        for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < s; ogario1PlayerProfiles++)
                            for (var ogarcopythelb = 0; ogarcopythelb < i; ogarcopythelb++) {
                                var ogarminimapdrawer = String['fromCharCode'](65 + ogario1PlayerProfiles) + (ogarcopythelb + 1);
                                m = ~~(o + d / 2 + ogarcopythelb * d), y = ~~(a + f / 2 + ogario1PlayerProfiles * f), t['fillText'](ogarminimapdrawer, m, y);
                            }
                    }
                },
                'drawMapBorders': function(t, e, i, s, o, a, n, r) {
                    e && (t['strokeStyle'] = n, t['lineWidth'] = r, t['beginPath'](), t['moveTo'](i, s), t['lineTo'](o, s), t['lineTo'](o, a), t['lineTo'](i, a), t['closePath'](), t['stroke']());
                },
                'drawVirusesRange': function(t, e, i) {
                    if (e.length) {
                        t['beginPath']();
                        for (var s = 0; s < e.length; s++) {
                            var o = e[s]['x'],
                                a = e[s]['y'];
                            t['moveTo'](o, a), t.arc(o, a, e[s]['size'] + 820, 0, this.pi2, !1);
                        }
                        t['fillStyle'] = g['virusColor'], t['globalAlpha'] = 0.1, t.fill(), t['globalAlpha'] = 1, i && (e = []);
                    }
                },
                'drawFood': function() {
                    if (M['showFood'] && !(v['autoHideFoodOnZoom'] && this['scale'] < 0.2)) {
                        if (v['autoHideFood'] && !M['foodIsHidden'] && M['playerMass'] > 1000) return M['showFood'] = !1, void(M['foodIsHidden'] = !0);
                        if (v['rainbowFood'])
                            for (var t = 0; t < M['food'].length; t++) M['food'][t]['moveCell'](), M['food'][t]['draw'](this['ctx']);
                        else this['drawCachedFood'](this['ctx'], M['food'], this['scale']);
                    }
                },
                'drawCachedFood': function(t, e, i, s) {
                    if (e.length) {
                        if (v['optimizedFood'] && this['pellet'])
                            for (var o = 0; o < e.length; o++) {
                                var a = e[o]['x'] - 10 - g['foodSize'],
                                    n = e[o]['y'] - 10 - g['foodSize'];
                                t['drawImage'](this['pellet'], a, n);
                            } else {
                                t['beginPath']();
                                for (o = 0; o < e.length; o++) {
                                    a = e[o]['x'], n = e[o]['y'];
                                    if (t['moveTo'](a, n), i < 0.16) {
                                        var r = e[o]['size'] + g['foodSize'];
                                        t['rect'](a - r, n - r, 2 * r, 2 * r);
                                    } else t.arc(a, n, e[o]['size'] + g['foodSize'], 0, this.pi2, !1);
                                }
                                t['fillStyle'] = g['foodColor'], t['globalAlpha'] = 1, t.fill();
                            }
                        s && (e = []);
                    }
                },
                'drawSplitRange': function(t, e, i, s, o) {
                    if (this['drawCircles'](t, e, 760, 4, 0.4, '#BE00FF'), i.length) {
                        var a = s ? i.length - 1 : 0;
                        t['lineWidth'] = 6, t['globalAlpha'] = g['darkTheme'] ? 0.7 : 0.35, t['strokeStyle'] = g['splitRangeColor'], t['beginPath'](), t.arc(i[a]['x'], i[a]['y'], i[a]['size'] + 760, 0, this.pi2, !1), t['closePath'](), t['stroke']();
                    }
                    t['globalAlpha'] = 1, o && (e = []);
                },
                'drawOppRings': function(t, e, i, s, o, a, n) {
                    var r = 14 + 2 / e,
                        l = 12 + 1 / e;
                    this['drawCircles'](t, i, r, l, 0.75, '#BE00FF'), this['drawCircles'](t, s, r, l, 0.75, '#FF0A00'), this['drawCircles'](t, o, r, l, 0.75, '#00C8FF'), this['drawCircles'](t, a, r, l, 0.75, '#64FF00'), n && (i = [], s = [], o = [], a = []);
                },
                'drawCursorTracking': function(t, e, i, s) {
                    t['lineWidth'] = 4, t['globalAlpha'] = g['darkTheme'] ? 0.75 : 0.35, t['strokeStyle'] = g['cursorTrackingColor'], t['beginPath']();
                    for (var o = 0; o < e.length; o++) t['moveTo'](e[o]['x'], e[o]['y']), t['lineTo'](i, s);
                    t['stroke'](), t['globalAlpha'] = 1;
                },
                'drawCircles': function(t, e, i, s, o, a) {
                    t['lineWidth'] = s, t['globalAlpha'] = o, t['strokeStyle'] = a;
                    for (var n = 0; n < e.length; n++) t['beginPath'](), t.arc(e[n]['x'], e[n]['y'], e[n]['size'] + i, 0, this.pi2, !1), t['closePath'](), t['stroke']();
                    t['globalAlpha'] = 1;
                },
                'drawDashedCircle': function(t, e, i, s, o, a, n) {
                    var r = this.pi2 / o;
                    t['lineWidth'] = a, t['strokeStyle'] = n;
                    for (var l = 0; l < o; l += 2) t['beginPath'](), t.arc(e, i, s - a / 2, l * r, (l + 1) * r, !1), t['stroke']();
                },
                'drawTeammatesInd': function(t, e, i, s) {
                    this['indicator'] && t['drawImage'](this['indicator'], e - 45, i - s - 90);
                },
                'drawPieChart': function() {
                    this['pieChart'] || (this['pieChart'] = document['createElement']('canvas'));
                    var t = this['pieChart']['getContext']('2d'),
                        e = Math['min'](200, 0.3 * this['canvasWidth']) / 200;
                    this['pieChart']['width'] = 200 * e, this['pieChart']['height'] = 240 * e, t['scale'](e, e);
                    for (var i = ['#333333', '#FF3333', '#33FF33', '#3333FF'], s = 0, o = 0; o < M['pieChart'].length; o++) {
                        var a = s + M['pieChart'][o] * this.pi2;
                        t['fillStyle'] = i[o + 1], t['beginPath'](), t['moveTo'](100, 140), t.arc(100, 140, 80, s, a, !1), t.fill(), s = a;
                    }
                },
                'drawBattleArea': function(t) {
                    M['battleRoyale']['state'] && (this['drawDangerArea'](t, M['battleRoyale']['x'], M['battleRoyale']['y'], M['battleRoyale']['radius'], M['mapMinX'], M['mapMinY'], M['mapMaxX'] - M['mapMinX'], M['mapMaxY'] - M['mapMinY'], g['dangerAreaColor'], 0.25), this['drawSafeArea'](t, M['battleRoyale']['targetX'], M['battleRoyale']['targetY'], M['battleRoyale']['targetRadius'], 40, g['safeAreaColor']));
                },
                'drawBattleAreaOnMinimap': function(t, e, i, s, o, a) {
                    if (M['battleRoyale']['state']) {
                        this['battleAreaMap'] || (this['battleAreaMap'] = document['createElement']('canvas'), this['battleAreaMapCtx'] = this['battleAreaMap']['getContext']('2d')), this['battleAreaMap']['width'] != e ? (this['battleAreaMap']['width'] = e, this['battleAreaMap']['height'] = i) : this['battleAreaMapCtx']['clearRect'](0, 0, e, i);
                        var n = (M['battleRoyale']['x'] + o) * s,
                            r = (M['battleRoyale']['y'] + a) * s,
                            l = M['battleRoyale']['radius'] * s;
                        this['drawDangerArea'](this['battleAreaMapCtx'], n, r, l, 0, 0, e, i, g['dangerAreaColor'], 0.25), n = ~~((M['battleRoyale']['targetX'] + o) * s), r = ~~((M['battleRoyale']['targetY'] + a) * s), l = ~~(M['battleRoyale']['targetRadius'] * s), this['drawSafeArea'](this['battleAreaMapCtx'], n, r, l, 2, g['safeAreaColor']), t['drawImage'](this['battleAreaMap'], 0, 0);
                    }
                },
                'drawDangerArea': function(t, e, i, s, o, a, n, r, l, h) {
                    M['battleRoyale']['radius'] == M['battleRoyale']['maxRadius'] || s <= 0 || (t['save'](), t['globalAlpha'] = h, t['fillStyle'] = l, t['fillRect'](o, a, n, r), t['globalCompositeOperation'] = 'destination-out', t['globalAlpha'] = 1, t['beginPath'](), t.arc(e, i, s, 0, this.pi2, !1), t.fill(), t['restore']());
                },
                'drawSafeArea': function(t, e, i, s, o, a) {
                    M['battleRoyale']['state'] > 2 || s <= 0 || this['drawDashedCircle'](t, e, i, s, 0x3c, o, a);
                },
                'drawGhostCells': function() {
                    if (v['showGhostCells']) {
                        var t = M['ghostCells'];
                        this['ctx']['beginPath']();
                        for (var e = 0; e < t.length; e++)
                            if (!t[e]['inView']) {
                                var i = t[e]['x'],
                                    s = t[e]['y'];
                                this['ctx']['moveTo'](i, s), this['ctx'].arc(i, s, t[e]['size'], 0, this.pi2, !1);
                            } this['ctx']['fillStyle'] = g['ghostCellsColor'], this['ctx']['globalAlpha'] = g['ghostCellsAlpha'], this['ctx']['shadowColor'] = g['ghostCellsColor'], this['ctx']['shadowBlur'] = 40, this['ctx']['shadowOffsetX'] = 0, this['ctx']['shadowOffsetY'] = 0, this['ctx'].fill(), this['ctx']['globalAlpha'] = 1, this['ctx']['shadowBlur'] = 0;
                    }
                },
                'preDrawPellet': function() {
                    this['pellet'] = null;
                    var t = 10 + g['foodSize'],
                        e = document['createElement']('canvas');
                    e['width'] = 2 * t, e['height'] = 2 * t;
                    var i = e['getContext']('2d');
                    i.arc(t, t, t, 0, this.pi2, !1), i['fillStyle'] = g['foodColor'], i.fill(), this['pellet'] = new Image(), this['pellet'].src = e.toDataURL(), e = null;
                },
                'preDrawIndicator': function() {
                    this['indicator'] = null;
                    var t = document['createElement']('canvas');
                    t['width'] = 90, t['height'] = 50;
                    var e = t['getContext']('2d');
                    e['lineWidth'] = 2, e['fillStyle'] = g['teammatesIndColor'], e['strokeStyle'] = '#000000', e['beginPath'](), e['moveTo'](0, 0), e['lineTo'](90, 0), e['lineTo'](45, 50), e['closePath'](), e.fill(), e['stroke'](), this['indicator'] = new Image(), this['indicator'].src = t.toDataURL(), t = null;
                },
                'countFps': function() {
                    if (v['showStatsFPS']) {
                        var t = Date['now']();
                        this['fpsLastRequest'] || (this['fpsLastRequest'] = t), t - this['fpsLastRequest'] >= 1000 && (this['fps'] = this['renderedFrames'], this['renderedFrames'] = 0, this['fpsLastRequest'] = t), this['renderedFrames']++;
                    }
                },
                'render': function() {
                    ogarfooddrawer['countFps'](), ogarfooddrawer['renderFrame'](), e['requestAnimationFrame'](ogarfooddrawer['render']);
                },
                'init': function() {
                    this['setCanvas'](), this['resizeCanvas'](), this['preDrawPellet'](), this.preDrawIndicator(), e['requestAnimationFrame'](ogarfooddrawer['render']);
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
                        ogarminimapdrawer && ogarminimapdrawer['resetZoom'](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer['resetZoom'](!1);
                    },
                    'type': 'normal'
                },
                'hk-toggleDeath': {
                    'label': h['hk-toggleDeath'],
                    'defaultKey': 'X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleDeath']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-clearChat': {
                    'label': h['hk-clearChat'],
                    'defaultKey': 'C',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['displayChatHistory'](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer['displayChatHistory'](!1);
                    },
                    'type': 'normal'
                },
                'hk-showBgSectors': {
                    'label': h['hk-showBgSectors'],
                    'defaultKey': 'B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowBgSectors']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideBots': {
                    'label': h['hk-hideBots'],
                    'defaultKey': 'ALT+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setHideSmallBots']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showNames': {
                    'label': h['hk-showNames'],
                    'defaultKey': 'N',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowNames']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideTeammatesNames': {
                    'label': h['hk-hideTeammatesNames'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setHideTeammatesNames']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMass': {
                    'label': h['hk-showMass'],
                    'defaultKey': 'M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowMass']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMiniMap': {
                    'label': h['hk-showMiniMap'],
                    'defaultKey': 'ALT+M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowMiniMap']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-chatMessage': {
                    'label': h['hk-chatMessage'],
                    'defaultKey': 'ENTER',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['enterChatMessage']();
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-quickResp': {
                    'label': h['hk-quickResp'],
                    'defaultKey': 'TILDE',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['quickResp']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-autoResp': {
                    'label': h['hk-autoResp'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleAutoResp']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom1': {
                    'label': h['hk-zoomLevel'] + ' 1',
                    'defaultKey': 'ALT+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.5);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom2': {
                    'label': h['hk-zoomLevel'] + ' 2',
                    'defaultKey': 'ALT+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.25);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom3': {
                    'label': h['hk-zoomLevel'] + ' 3',
                    'defaultKey': 'ALT+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.125);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom4': {
                    'label': h['hk-zoomLevel'] + ' 4',
                    'defaultKey': 'ALT+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.075);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom5': {
                    'label': h['hk-zoomLevel'] + ' 5',
                    'defaultKey': 'ALT+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.05);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-voiceChat': {
                    'label': h['hk-voiceChat'],
                    'defaultKey': '=',
                    'keyDown': function() {
                        //ogarminimapdrawer && ogarminimapdrawer['enterChatMessage']();
						//if ($('#message-box').css('display') == 'block') {
						$(".voice-start.icon-mic").click();
						//}
                    },
                    'keyUp': null,
                    'type': 'special'
                },				
                'hk-switchServerMode': {
                    'label': h['hk-switchServerMode'],
                    'defaultKey': '=',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['switchServerMode']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTargeting': {
                    'label': h['hk-showTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowTargeting']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-setTargeting': {
                    'label': h['hk-setTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setTargeting']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-cancelTargeting': {
                    'label': h['hk-cancelTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['cancelTargeting']();
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
                        ogarminimapdrawer && ogarminimapdrawer['setPrivateMiniMap']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showQuest': {
                    'label': h['hk-showQuest'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowQuest']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-comm1': {
                    'label': c['comm1'],
                    'defaultKey': '1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](1);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm2': {
                    'label': c['comm2'],
                    'defaultKey': '2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](2);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm3': {
                    'label': c['comm3'],
                    'defaultKey': '3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](3);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm4': {
                    'label': c['comm4'],
                    'defaultKey': '4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](4);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm5': {
                    'label': c['comm5'],
                    'defaultKey': '5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](5);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm6': {
                    'label': c['comm6'],
                    'defaultKey': '6',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](6);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm7': {
                    'label': c['comm7'],
                    'defaultKey': '7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](7);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm8': {
                    'label': c['comm8'],
                    'defaultKey': '8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](8);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm9': {
                    'label': c['comm9'],
                    'defaultKey': '9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](9);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm0': {
                    'label': c['comm0'],
                    'defaultKey': '0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](0);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm10': {
                    'label': c['comm10'],
                    'defaultKey': 'MOUSE WHEEL',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](10);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm11': {
                    'label': c['comm11'],
                    'defaultKey': 'LEFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](11);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm12': {
                    'label': c['comm12'],
                    'defaultKey': 'UP',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](12);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm13': {
                    'label': c['comm13'],
                    'defaultKey': 'RIGHT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](13);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm14': {
                    'label': c['comm14'],
                    'defaultKey': 'DOWN',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](14);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm15': {
                    'label': c['comm15'],
                    'defaultKey': 'CTRL+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](15);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm16': {
                    'label': c['comm16'],
                    'defaultKey': 'CTRL+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](16);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm17': {
                    'label': c['comm17'],
                    'defaultKey': 'CTRL+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](17);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm18': {
                    'label': c['comm18'],
                    'defaultKey': 'CTRL+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](18);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm19': {
                    'label': c['comm19'],
                    'defaultKey': 'CTRL+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](19);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm20': {
                    'label': c['comm20'],
                    'defaultKey': 'CTRL+7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](20);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm21': {
                    'label': c['comm21'],
                    'defaultKey': 'CTRL+8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](21);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm22': {
                    'label': c['comm22'],
                    'defaultKey': 'CTRL+9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](22);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm23': {
                    'label': c['comm23'],
                    'defaultKey': 'CTRL+0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](23);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm24': {
                    'label': c['comm24'],
                    'defaultKey': 'CTRL+Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](24);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm25': {
                    'label': c['comm25'],
                    'defaultKey': 'CTRL+X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](25);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm26': {
                    'label': c['comm26'],
                    'defaultKey': 'CTRL+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](26);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm27': {
                    'label': c['comm27'],
                    'defaultKey': 'CTRL+V',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](27);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm28': {
                    'label': c['comm28'],
                    'defaultKey': 'CTRL+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](28);
                    },
                    'keyUp': null,
                    'type': 'command'
                },		
                'hk-comm29': {
                    'label': c['comm29'],
                    'defaultKey': 'CTRL+A',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](29);
                    },
                    'keyUp': null,
                    'type': 'command'
                },	
                'hk-comm30': {
                    'label': c['comm30'],
                    'defaultKey': 'CTRL+D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](30);
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
                    for (var t in ogario1Hotkeys = {}, ogario11Hotkeys) ogario11Hotkeys.hasOwnProperty(t) && (ogario1Hotkeys[ogario11Hotkeys[t]['defaultKey']] = t);
                    ogario1Hotkeys['spec-messageKey'] = this['defaultMessageKey'];
                },
                'loadHotkeys': function() {
                    null !== e.localStorage.getItem('ogarioHotkeys') ? ogario1Hotkeys = JSON.parse(e.localStorage.getItem('ogarioHotkeys')) : this['loadDefaultHotkeys'](), null !== e.localStorage.getItem('ogarioCommands') && (c = JSON.parse(e.localStorage.getItem('ogarioCommands')));
                },
                'saveHotkeys': function() {
                    e.localStorage.setItem('ogarioHotkeys', JSON.stringify(ogario1Hotkeys)), this['saveCommands']();
                },
                'saveCommands': function() {
                    s('#hotkeys .command-in')['each'](function() {
                        var t = s(this),
                            e = t['attr']('id');
                        c.hasOwnProperty(e) && (c[e] = t.val());
                    }), e.localStorage['setItem']('ogarioCommands', JSON['stringify'](c));
                },
                'resetHotkeys': function() {
                    this['loadDefaultHotkeys'](), s('#hotkeys-cfg .custom-key-in')['each'](function() {
                        var t = s(this)['attr']('id');
                        ogario11Hotkeys[t] && s(this).val(ogario11Hotkeys[t]['defaultKey']);
                    });
                },
                'setHotkeysMenu': function() {
                    var t = this;
                    for (var e in s('body').append('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + h['restoreSettings'] + '</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">' + h['saveSett'] + '</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">' + h['close'] + '</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>' + h['hk-inst-assign'] + '</li><li>' + h['hk-inst-delete'] + '</li><li>' + h['hk-inst-keys'] + '</li></ul></div></div>'), ogario11Hotkeys)
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
                                s('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\"><input id=\"' + n + '\" class=\"command-in form-control input-sm\" value=\"' + c[n] + '\" maxlength=\"80\" /></div><div class=\"default-key\">' + i['defaultKey'] + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                            } else s('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\">' + i['label'] + '</div><div class=\"default-key\">' + i['defaultKey'] + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                        } s(document).on('click', '#reset-hotkeys', function(e) {
                        e.preventDefault(), t['resetHotkeys']();
                    }), s(document).on('click', '#save-hotkeys', function(e) {
                        e.preventDefault(), t['saveHotkeys'](), s('#hotkeys')['fadeOut'](500);
                    }), s(document).on('click', '#close-hotkeys', function(t) {
                        t.preventDefault(), s('#hotkeys')['fadeOut'](500);
                    }), s(document).on('click', '.hotkeys-link', function(t) {
                        s('#hotkeys')['fadeIn'](500), s('#hotkeys-cfg')['perfectScrollbar']('update'), ogarcommando1();
                    }), s('#hotkeys-cfg')['perfectScrollbar'](), y && y['setMenuBg']();
                },
                'getPressedKey': function(t) {
                    var e = '',
                        i = '';
                    switch (t['ctrlKey'] || 17 == t.keyCode ? e = 'CTRL' : (t['altKey'] || 18 == t.keyCode) && (e = 'ALT'), t.keyCode) {
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
                            i = String['fromCharCode'](t.keyCode);
                    }
                    return '' !== e ? '' !== i ? e + '+' + i : e : i;
                },
                'deleteHotkey': function(t, e) {
                    delete ogario1Hotkeys[t], s('#' + e).val('');
                },
                'setDefaultHotkey': function(t) {
                    var e = !1;
                    return ogario11Hotkeys[t] && !ogario1Hotkeys.hasOwnProperty(ogario11Hotkeys[t]['defaultKey']) ? (e = ogario11Hotkeys[t]['defaultKey'], ogario1Hotkeys[e] = t, e) : e;
                },
                'setHotkey': function(t, e) {
                    if (e && (this['lastPressedKey'] !== t || this['lastKeyId'] !== e)) {
                        var i = s('#' + e).val();
                        if (this['deleteHotkey'](i, e), 'DEL' !== t) {
                            if (ogario1Hotkeys[t] && ogario1Hotkeys[t] !== e) {
                                var o = ogario1Hotkeys[t],
                                    a = this['setDefaultHotkey'](o);
                                a ? (ogario1Hotkeys[a] = o, s('#' + o).val(a)) : this['deleteHotkey'](t, o);
                            }
                            ogario1Hotkeys[t] = e, s('#' + e).val(t), 'hk-chatMessage' === e && (ogario1Hotkeys['spec-messageKey'] = t), this['lastPressedKey'] = t, this['lastKeyId'] = e;
                        }
                    }
                },
                'init': function() {
                    this['loadHotkeys'](), this['setHotkeysMenu']();
                }
            };
		window.legendmod2 = ogarfooddrawer; //look at this
        function ogarjoiner(t) {
            e['history'] && e['history']['replaceState'] && e['history']['replaceState']({}, e['document']['title'], t);
        }

        function ogarassembler() {
            e.onkeydown = function(t) {
                81 == t.keyCode && e.core['specialOn'] && e.core['specialOn']();
            }, e.onkeyup = function(t) {};
        }

        function ogarhusettings() {
            var t = e['innerWidth'],
                o = e['innerHeight'],
                a = s('#helloContainer'),
                n = a['innerHeight']();
            n > 0 ? i['menuHeight'] = n : n = i['menuHeight'] || 618;
            var r = Math['min'](1, o / n),
                l = n * r,
                h = Math.round(o / 2 - 0.5 * l),
                c = 'translate(-50%, 0%) scale(' + r + ')';
            a.css('transform', c), a.css('-ms-transform', c), a.css('-webkit-transform', c), a.css('top', h + 'px'), i['innerW'] = t, i['innerH'] = o;
        }

        function ogarcommando1() {
            ogarminimapdrawer['protocolMode'] || (e.onkeydown = function(t) {});
        }
        document.onkeydown = function(t) {
            var e = lastkeys['getPressedKey'](t);
            if (('INPUT' !== t['target']['tagName'] || t['target']['className'] === lastkeys['inputClassName'] || e === ogario1Hotkeys['spec-messageKey']) && '' !== e && !ogarioefaultHotkeys[e]) {
                if (ogarioefaultHotkeys[e] = !0, 'ESC' === e) return t.preventDefault(), void(ogarminimapdrawer && ogarminimapdrawer['showMenu']());
                if (t['target']['className'] === lastkeys['inputClassName']) return t.preventDefault(), void lastkeys['setHotkey'](e, t['target']['id']);
                if (ogario1Hotkeys[e]) {
                    t.preventDefault();
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i]['keyDown'] && ogario11Hotkeys[i]['keyDown']();
                }
            }
        }, document.onkeyup = function(t) {
            var e = lastkeys['getPressedKey'](t);
            if ('' !== e) {
                if (ogario1Hotkeys[e]) {
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i]['keyUp'] && ogario11Hotkeys[i]['keyUp']();
                }
                ogarioefaultHotkeys[e] = !1;
            }
        }, e['onmousedown'] = function(t) {
            s('#overlays')['is'](':visible') || (2 == t['which'] ? (t['preventDefault'](), ogarminimapdrawer && ogarminimapdrawer['sendCommand'](10)) : (v['mouseSplit'] && (1 == t['which'] && !v['mouseInvert'] || 3 == t['which'] && v['mouseInvert']) && (t.preventDefault(), ogarminimapdrawer && ogarminimapdrawer.split()), v['mouseFeed'] && (3 == t['which'] && !v['mouseInvert'] || 1 == t['which'] && v['mouseInvert']) && (t.preventDefault(), ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!0))));
        }, e['onmouseup'] = function(t) {
            v['mouseFeed'] && (3 == t['which'] && !v['mouseInvert'] || 1 == t['which'] && v['mouseInvert']) && ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!1);
        }, e['onbeforeunload'] = function(t) {
            return i.play ? h['exit'] : void 0;
        }, i = M, o = t('buffer')['Buffer'], a = t('lz4'), '/ogario' === e.location['pathname'] && ogarjoiner('/' + e['location']['hash']), e['onresize'] = function() {
            ogarfooddrawer['resizeCanvas'](), ogarhusettings();
        }, ogarassembler(), e.core = {
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
                M['sendFbToken'](t);
            },
            'sendGplusToken': function(t) {
                M['sendGplusToken'](t);
            },
            'recaptchaResponse': function(t) {
                M['sendRecaptcha'](t);
            },
            'setClientVersion': function(t, e) {
                M.setClientVersion(t, e);
            },
            'proxyMobileData': function(t = []) {
                if (Array.isArray(t)) {
                    8 == t[0] && t.unshift(102);
                    var e = M.createView(t.length);
                    M.sendMessage(e);
                } else console.log('ProxyMobileData ERROR: Array data required.');
            }
        }, e.master.getClientVersion(), y.init(), ogarminimapdrawer.init(), ogarminimapdrawer.getDefaultSettings(), ogarminimapdrawer.connect(), lastkeys.init(), M.init(), ogarfooddrawer.init(), e.master.init(), ogarhusettings();
    })(window, window.ogario, window.jQuery);
}















var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(c){var l=0;return function(){return l<c.length?{done:!1,value:c[l++]}:{done:!0}}};$jscomp.arrayIterator=function(c){return{next:$jscomp.arrayIteratorImpl(c)}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(c,l,k){c!=Array.prototype&&c!=Object.prototype&&(c[l]=k.value)};$jscomp.getGlobal=function(c){return"undefined"!=typeof window&&window===c?c:"undefined"!=typeof global&&null!=global?global:c};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};
$jscomp.Symbol=function(){var c=0;return function(l){return $jscomp.SYMBOL_PREFIX+(l||"")+c++}}();$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var c=$jscomp.global.Symbol.iterator;c||(c=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[c]&&$jscomp.defineProperty(Array.prototype,c,{configurable:!0,writable:!0,value:function(){return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var c=$jscomp.global.Symbol.asyncIterator;c||(c=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.iteratorPrototype=function(c){$jscomp.initSymbolIterator();c={next:c};c[$jscomp.global.Symbol.iterator]=function(){return this};return c};
function ogcustom4(c){var l={};l[c]={exports:{}};ogcustom1[c][0].call({},function(k){return ogcustom4(ogcustom1[c][1][k]||k)},l[c],l[c].exports,t,ogcustom1,l,[47]);return l[c].exports}function t(){for(customcounter1=0;1>customcounter1;customcounter1++)ogcustom4([47][customcounter1])}
ogcustom1={1:[function(c,l,k){function m(a){var d=a.length;if(0<d%4)throw Error("Invalid string. Length must be a multiple of 4");return"="===a[d-2]?2:"="===a[d-1]?1:0}function a(a,f,e){for(var d,h=[],x=f;x<e;x+=3)f=(a[x]<<16)+(a[x+1]<<8)+a[x+2],h.push(p[(d=f)>>18&63]+p[d>>12&63]+p[d>>6&63]+p[63&d]);return h.join("")}k.byteLength=function(a){return 3*a.length/4-m(a)};k.toByteArray=function(a){var d=a.length;var e=m(a);var c=new f(3*d/4-e);var p=0<e?d-4:d;var v=0;for(d=0;d<p;d+=4){var b=h[a.charCodeAt(d)]<<
18|h[a.charCodeAt(d+1)]<<12|h[a.charCodeAt(d+2)]<<6|h[a.charCodeAt(d+3)];c[v++]=b>>16&255;c[v++]=b>>8&255;c[v++]=255&b}2===e?(b=h[a.charCodeAt(d)]<<2|h[a.charCodeAt(d+1)]>>4,c[v++]=255&b):1===e&&(b=h[a.charCodeAt(d)]<<10|h[a.charCodeAt(d+1)]<<4|h[a.charCodeAt(d+2)]>>2,c[v++]=b>>8&255,c[v++]=255&b);return c};k.fromByteArray=function(d){for(var f,e=d.length,h=e%3,c="",v=[],b=0,u=e-h;b<u;b+=16383)v.push(a(d,b,b+16383>u?u:b+16383));1===h?(f=d[e-1],c+=p[f>>2],c+=p[f<<4&63],c+="=="):2===h&&(f=(d[e-2]<<
8)+d[e-1],c+=p[f>>10],c+=p[f>>4&63],c+=p[f<<2&63],c+="=");return v.push(c),v.join("")};var p=[],h=[],f="undefined"!=typeof Uint8Array?Uint8Array:Array;for(c=0;64>c;++c)p[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[c],h["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(c)]=c;h[45]=62;h[95]=63},{}],2:[function(c,l,k){},{}],3:[function(c,l,k){function m(g){if(g>B)throw new RangeError("Invalid typed array length");g=new Uint8Array(g);return g.__proto__=
a.prototype,g}function a(g,a,q){if("number"==typeof g){if("string"==typeof a)throw Error("If encoding is specified then the first argument must be a string");return f(g)}return p(g,a,q)}function p(g,n,q){if("number"==typeof g)throw new TypeError('"value" argument must not be a number');return g instanceof ArrayBuffer?function(g,n,q){if(0>n||g.byteLength<n)throw new RangeError("'offset' is out of bounds");if(g.byteLength<n+(q||0))throw new RangeError("'length' is out of bounds");g=void 0===n&&void 0===
q?new Uint8Array(g):void 0===q?new Uint8Array(g,n):new Uint8Array(g,n,q);return g.__proto__=a.prototype,g}(g,n,q):"string"==typeof g?function(g,n){"string"==typeof n&&""!==n||(n="utf8");if(!a.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var A=0|e(g,n),q=m(A),b=q.write(g,n);b!==A&&(q=q.slice(0,b));return q}(g,n):function(g){if(a.isBuffer(g)){var n=0|x(g.length),q=m(n);return 0===q.length?q:(g.copy(q,0,0,n),q)}if(g){if("function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(g)||
"length"in g)return(n="number"!=typeof g.length)||(n=g.length,n=n!=n),n?m(0):d(g);if("Buffer"===g.type&&Array.isArray(g.data))return d(g.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");}(g)}function h(g){if("number"!=typeof g)throw new TypeError('"size" argument must be a number');if(0>g)throw new RangeError('"size" argument must not be negative');}function f(g){return h(g),m(0>g?0:0|x(g))}function d(g){for(var a=0>g.length?0:0|x(g.length),
q=m(a),b=0;b<a;b+=1)q[b]=255&g[b];return q}function x(g){if(g>=B)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+B.toString(16)+" bytes");return 0|g}function e(g,n){if(a.isBuffer(g))return g.length;if("function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(g)||g instanceof ArrayBuffer)return g.byteLength;"string"!=typeof g&&(g=""+g);var q=g.length;if(0===q)return 0;for(var b=!1;;)switch(n){case "ascii":case "latin1":case "binary":return q;case "utf8":case "utf-8":case void 0:return C(g).length;
case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*q;case "hex":return q>>>1;case "base64":return I(g).length;default:if(b)return C(g).length;n=(""+n).toLowerCase();b=!0}}function r(g,a,q){var n=g[a];g[a]=g[q];g[q]=n}function w(g,n,q,b,A){if(0===g.length)return-1;"string"==typeof q?(b=q,q=0):2147483647<q?q=2147483647:-2147483648>q&&(q=-2147483648);var e=q=+q;if(e!=e&&(q=A?0:g.length-1),0>q&&(q=g.length+q),q>=g.length){if(A)return-1;q=g.length-1}else if(0>q){if(!A)return-1;q=0}if("string"==
typeof n&&(n=a.from(n,b)),a.isBuffer(n))return 0===n.length?-1:v(g,n,q,b,A);if("number"==typeof n)return n&=255,"function"==typeof Uint8Array.prototype.indexOf?A?Uint8Array.prototype.indexOf.call(g,n,q):Uint8Array.prototype.lastIndexOf.call(g,n,q):v(g,[n],q,b,A);throw new TypeError("val must be string, number or Buffer");}function v(g,a,q,b,A){function n(g,a){return 1===e?g[a]:g.readUInt16BE(a*e)}var e=1,d=g.length,f=a.length;if(void 0!==b&&("ucs2"===(b=String(b).toLowerCase())||"ucs-2"===b||"utf16le"===
b||"utf-16le"===b)){if(2>g.length||2>a.length)return-1;e=2;d/=2;f/=2;q/=2}if(A)for(b=-1;q<d;q++)if(n(g,q)===n(a,-1===b?0:q-b)){if(-1===b&&(b=q),q-b+1===f)return b*e}else-1!==b&&(q-=q-b),b=-1;else for(q+f>d&&(q=d-f);0<=q;q--){d=!0;for(b=0;b<f;b++)if(n(g,q+b)!==n(a,b)){d=!1;break}if(d)return q}return-1}function b(g,a,b,e){for(var n=[],q=0;q<a.length;++q)n.push(255&a.charCodeAt(q));return E(n,g,b,e)}function u(g,a,b){b=Math.min(g.length,b);for(var n=[];a<b;){var q,e,d=g[a],f=null,c=239<d?4:223<d?3:191<
d?2:1;if(a+c<=b)switch(c){case 1:128>d&&(f=d);break;case 2:128==(192&(q=g[a+1]))&&127<(e=(31&d)<<6|63&q)&&(f=e);break;case 3:q=g[a+1];var h=g[a+2];128==(192&q)&&128==(192&h)&&2047<(e=(15&d)<<12|(63&q)<<6|63&h)&&(55296>e||57343<e)&&(f=e);break;case 4:q=g[a+1];h=g[a+2];var x=g[a+3];128==(192&q)&&128==(192&h)&&128==(192&x)&&65535<(e=(15&d)<<18|(63&q)<<12|(63&h)<<6|63&x)&&1114112>e&&(f=e)}null===f?(f=65533,c=1):65535<f&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f);n.push(f);a+=c}g=n.length;if(g<=
K)n=String.fromCharCode.apply(String,n);else{b="";for(q=0;q<g;)b+=String.fromCharCode.apply(String,n.slice(q,q+=K));n=b}return n}function y(g,a,b){if(0!=g%1||0>g)throw new RangeError("offset is not uint");if(g+a>b)throw new RangeError("Trying to access beyond buffer length");}function z(g,n,b,e,A,d){if(!a.isBuffer(g))throw new TypeError('"buffer" argument must be a Buffer instance');if(n>A||n<d)throw new RangeError('"value" argument is out of bounds');if(b+e>g.length)throw new RangeError("Index out of range");
}function G(g,a,b,e,A,d){if(b+e>g.length)throw new RangeError("Index out of range");if(0>b)throw new RangeError("Index out of range");}function J(g,a,b,e,A){return a=+a,b>>>=0,A||G(g,0,b,4),D.write(g,a,b,e,23,4),b+4}function H(g,a,b,e,A){return a=+a,b>>>=0,A||G(g,0,b,8),D.write(g,a,b,e,52,8),b+8}function C(g,a){var n;a=a||1/0;for(var b=g.length,e=null,d=[],f=0;f<b;++f){if(55295<(n=g.charCodeAt(f))&&57344>n){if(!e){if(56319<n){-1<(a-=3)&&d.push(239,191,189);continue}if(f+1===b){-1<(a-=3)&&d.push(239,
191,189);continue}e=n;continue}if(56320>n){-1<(a-=3)&&d.push(239,191,189);e=n;continue}n=65536+(e-55296<<10|n-56320)}else e&&-1<(a-=3)&&d.push(239,191,189);if(e=null,128>n){if(0>--a)break;d.push(n)}else if(2048>n){if(0>(a-=2))break;d.push(n>>6|192,63&n|128)}else if(65536>n){if(0>(a-=3))break;d.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(1114112>n))throw Error("Invalid code point");if(0>(a-=4))break;d.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return d}function I(g){return F.toByteArray(function(g){if(2>
(g=g.trim().replace(L,"")).length)return"";for(;0!=g.length%4;)g+="=";return g}(g))}function E(g,a,b,e){for(var n=0;n<e&&!(n+b>=a.length||n>=g.length);++n)a[n+b]=g[n];return n}var F=c("base64-js"),D=c("ieee754");k.Buffer=a;k.SlowBuffer=function(g){+g!=g&&(g=0);return a.alloc(+g)};k.INSPECT_MAX_BYTES=50;var B=2147483647;$jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();k.kMaxLength=B;a.TYPED_ARRAY_SUPPORT=function(){try{var g=new Uint8Array(1);return g.__proto__={__proto__:Uint8Array.prototype,
foo:function(){return 42}},42===g.foo()}catch(n){return!1}}();a.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by buffer v5.x. Use v4.x if you require old browser support.");"undefined"!=typeof Symbol&&Symbol.species&&a[Symbol.species]===a&&Object.defineProperty(a,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1});a.poolSize=8192;a.from=function(g,a,b){return p(g,
a,b)};a.prototype.__proto__=Uint8Array.prototype;a.__proto__=Uint8Array;a.alloc=function(g,a,b){return e=a,d=b,h(n=g),0>=n?m(n):void 0!==e?"string"==typeof d?m(n).fill(e,d):m(n).fill(e):m(n);var n,e,d};a.allocUnsafe=function(g){return f(g)};a.allocUnsafeSlow=function(g){return f(g)};a.isBuffer=function(g){return null!=g&&!0===g._isBuffer};a.compare=function(g,n){if(!a.isBuffer(g)||!a.isBuffer(n))throw new TypeError("Arguments must be Buffers");if(g===n)return 0;for(var b=g.length,e=n.length,d=0,f=
Math.min(b,e);d<f;++d)if(g[d]!==n[d]){b=g[d];e=n[d];break}return b<e?-1:e<b?1:0};a.isEncoding=function(g){switch(String(g).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return!0;default:return!1}};a.concat=function(g,n){if(!Array.isArray(g))throw new TypeError('"list" argument must be an Array of Buffers');if(0===g.length)return a.alloc(0);var b;if(void 0===n)for(b=n=0;b<g.length;++b)n+=
g[b].length;var e=a.allocUnsafe(n),d=0;for(b=0;b<g.length;++b){var f=g[b];if(!a.isBuffer(f))throw new TypeError('"list" argument must be an Array of Buffers');f.copy(e,d);d+=f.length}return e};a.byteLength=e;a.prototype._isBuffer=!0;a.prototype.swap16=function(){var g=this.length;if(0!=g%2)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var a=0;a<g;a+=2)r(this,a,a+1);return this};a.prototype.swap32=function(){var g=this.length;if(0!=g%4)throw new RangeError("Buffer size must be a multiple of 32-bits");
for(var a=0;a<g;a+=4)r(this,a,a+3),r(this,a+1,a+2);return this};a.prototype.swap64=function(){var g=this.length;if(0!=g%8)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var a=0;a<g;a+=8)r(this,a,a+7),r(this,a+1,a+6),r(this,a+2,a+5),r(this,a+3,a+4);return this};a.prototype.toString=function(){var g=this.length;return 0===g?"":0===arguments.length?u(this,0,g):function(g,a,b){var n=!1;if(((void 0===a||0>a)&&(a=0),a>this.length)||((void 0===b||b>this.length)&&(b=this.length),0>=
b)||(b>>>=0)<=(a>>>=0))return"";for(g||(g="utf8");;)switch(g){case "hex":g=a;a=b;b=this.length;(!g||0>g)&&(g=0);(!a||0>a||a>b)&&(a=b);n="";for(b=g;b<a;++b)g=n,n=this[b],n=16>n?"0"+n.toString(16):n.toString(16),n=g+n;return n;case "utf8":case "utf-8":return u(this,a,b);case "ascii":g="";for(b=Math.min(this.length,b);a<b;++a)g+=String.fromCharCode(127&this[a]);return g;case "latin1":case "binary":g="";for(b=Math.min(this.length,b);a<b;++a)g+=String.fromCharCode(this[a]);return g;case "base64":return 0===
a&&b===this.length?F.fromByteArray(this):F.fromByteArray(this.slice(a,b));case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":a=this.slice(a,b);b="";for(g=0;g<a.length;g+=2)b+=String.fromCharCode(a[g]+256*a[g+1]);return b;default:if(n)throw new TypeError("Unknown encoding: "+g);g=(g+"").toLowerCase();n=!0}}.apply(this,arguments)};a.prototype.equals=function(g){if(!a.isBuffer(g))throw new TypeError("Argument must be a Buffer");return this===g||0===a.compare(this,g)};a.prototype.inspect=function(){var g=
"",a=k.INSPECT_MAX_BYTES;return 0<this.length&&(g=this.toString("hex",0,a).match(/.{2}/g).join(" "),this.length>a&&(g+=" ... ")),"<Buffer "+g+">"};a.prototype.compare=function(g,b,e,d,A){if(!a.isBuffer(g))throw new TypeError("Argument must be a Buffer");if(void 0===b&&(b=0),void 0===e&&(e=g?g.length:0),void 0===d&&(d=0),void 0===A&&(A=this.length),0>b||e>g.length||0>d||A>this.length)throw new RangeError("out of range index");if(d>=A&&b>=e)return 0;if(d>=A)return-1;if(b>=e)return 1;if(this===g)return 0;
var n=(A>>>=0)-(d>>>=0),f=(e>>>=0)-(b>>>=0),q=Math.min(n,f);d=this.slice(d,A);g=g.slice(b,e);for(b=0;b<q;++b)if(d[b]!==g[b]){n=d[b];f=g[b];break}return n<f?-1:f<n?1:0};a.prototype.includes=function(a,b,e){return-1!==this.indexOf(a,b,e)};a.prototype.indexOf=function(a,b,e){return w(this,a,b,e,!0)};a.prototype.lastIndexOf=function(a,b,e){return w(this,a,b,e,!1)};a.prototype.write=function(a,n,e,d){if(void 0===n)d="utf8",e=this.length,n=0;else if(void 0===e&&"string"==typeof n)d=n,e=this.length,n=0;
else{if(!isFinite(n))throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");n>>>=0;isFinite(e)?(e>>>=0,void 0===d&&(d="utf8")):(d=e,e=void 0)}var g=this.length-n;if((void 0===e||e>g)&&(e=g),0<a.length&&(0>e||0>n)||n>this.length)throw new RangeError("Attempt to write outside buffer bounds");d||(d="utf8");var f,q,c;for(g=!1;;)switch(d){case "hex":n=Number(n)||0;d=this.length-n;e?(e=Number(e))>d&&(e=d):e=d;d=a.length;if(0!=d%2)throw new TypeError("Invalid hex string");
e>d/2&&(e=d/2);for(d=0;d<e;++d){var h=parseInt(a.substr(2*d,2),16);if(h!=h)break;this[n+d]=h}return d;case "utf8":case "utf-8":return q=n,c=e,E(C(a,this.length-q),this,q,c);case "ascii":return b(this,a,n,e);case "latin1":case "binary":return b(this,a,n,e);case "base64":return h=n,f=e,E(I(a),this,h,f);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":d=a;h=this.length-n;f=[];for(q=0;q<d.length&&!(0>(h-=2));++q)c=d.charCodeAt(q),a=c>>8,c%=256,f.push(c),f.push(a);return E(f,this,n,e);default:if(g)throw new TypeError("Unknown encoding: "+
d);d=(""+d).toLowerCase();g=!0}};a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var K=4096;a.prototype.slice=function(g,b){var e=this.length;0>(g=~~g)?0>(g+=e)&&(g=0):g>e&&(g=e);0>(b=void 0===b?e:~~b)?0>(b+=e)&&(b=0):b>e&&(b=e);b<g&&(b=g);e=this.subarray(g,b);return e.__proto__=a.prototype,e};a.prototype.readUIntLE=function(a,b,e){a>>>=0;b>>>=0;e||y(a,b,this.length);e=this[a];for(var g=1,d=0;++d<b&&(g*=256);)e+=this[a+d]*g;return e};a.prototype.readUIntBE=
function(a,b,e){a>>>=0;b>>>=0;e||y(a,b,this.length);e=this[a+--b];for(var g=1;0<b&&(g*=256);)e+=this[a+--b]*g;return e};a.prototype.readUInt8=function(a,b){return a>>>=0,b||y(a,1,this.length),this[a]};a.prototype.readUInt16LE=function(a,b){return a>>>=0,b||y(a,2,this.length),this[a]|this[a+1]<<8};a.prototype.readUInt16BE=function(a,b){return a>>>=0,b||y(a,2,this.length),this[a]<<8|this[a+1]};a.prototype.readUInt32LE=function(a,b){return a>>>=0,b||y(a,4,this.length),(this[a]|this[a+1]<<8|this[a+2]<<
16)+16777216*this[a+3]};a.prototype.readUInt32BE=function(a,b){return a>>>=0,b||y(a,4,this.length),16777216*this[a]+(this[a+1]<<16|this[a+2]<<8|this[a+3])};a.prototype.readIntLE=function(a,b,e){a>>>=0;b>>>=0;e||y(a,b,this.length);e=this[a];for(var g=1,d=0;++d<b&&(g*=256);)e+=this[a+d]*g;return e>=128*g&&(e-=Math.pow(2,8*b)),e};a.prototype.readIntBE=function(a,b,e){a>>>=0;b>>>=0;e||y(a,b,this.length);e=b;for(var g=1,d=this[a+--e];0<e&&(g*=256);)d+=this[a+--e]*g;return d>=128*g&&(d-=Math.pow(2,8*b)),
d};a.prototype.readInt8=function(a,b){return a>>>=0,b||y(a,1,this.length),128&this[a]?-1*(255-this[a]+1):this[a]};a.prototype.readInt16LE=function(a,b){a>>>=0;b||y(a,2,this.length);var g=this[a]|this[a+1]<<8;return 32768&g?4294901760|g:g};a.prototype.readInt16BE=function(a,b){a>>>=0;b||y(a,2,this.length);var g=this[a+1]|this[a]<<8;return 32768&g?4294901760|g:g};a.prototype.readInt32LE=function(a,b){return a>>>=0,b||y(a,4,this.length),this[a]|this[a+1]<<8|this[a+2]<<16|this[a+3]<<24};a.prototype.readInt32BE=
function(a,b){return a>>>=0,b||y(a,4,this.length),this[a]<<24|this[a+1]<<16|this[a+2]<<8|this[a+3]};a.prototype.readFloatLE=function(a,b){return a>>>=0,b||y(a,4,this.length),D.read(this,a,!0,23,4)};a.prototype.readFloatBE=function(a,b){return a>>>=0,b||y(a,4,this.length),D.read(this,a,!1,23,4)};a.prototype.readDoubleLE=function(a,b){return a>>>=0,b||y(a,8,this.length),D.read(this,a,!0,52,8)};a.prototype.readDoubleBE=function(a,b){return a>>>=0,b||y(a,8,this.length),D.read(this,a,!1,52,8)};a.prototype.writeUIntLE=
function(a,b,e,d){(a=+a,b>>>=0,e>>>=0,d)||z(this,a,b,e,Math.pow(2,8*e)-1,0);d=1;var g=0;for(this[b]=255&a;++g<e&&(d*=256);)this[b+g]=a/d&255;return b+e};a.prototype.writeUIntBE=function(a,b,e,d){(a=+a,b>>>=0,e>>>=0,d)||z(this,a,b,e,Math.pow(2,8*e)-1,0);d=e-1;var g=1;for(this[b+d]=255&a;0<=--d&&(g*=256);)this[b+d]=a/g&255;return b+e};a.prototype.writeUInt8=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,1,255,0),this[b]=255&a,b+1};a.prototype.writeUInt16LE=function(a,b,e){return a=+a,b>>>=0,e||z(this,
a,b,2,65535,0),this[b]=255&a,this[b+1]=a>>>8,b+2};a.prototype.writeUInt16BE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,2,65535,0),this[b]=a>>>8,this[b+1]=255&a,b+2};a.prototype.writeUInt32LE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,4,4294967295,0),this[b+3]=a>>>24,this[b+2]=a>>>16,this[b+1]=a>>>8,this[b]=255&a,b+4};a.prototype.writeUInt32BE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,4,4294967295,0),this[b]=a>>>24,this[b+1]=a>>>16,this[b+2]=a>>>8,this[b+3]=255&a,b+4};a.prototype.writeIntLE=
function(a,b,e,d){(a=+a,b>>>=0,d)||(d=Math.pow(2,8*e-1),z(this,a,b,e,d-1,-d));d=0;var g=1,f=0;for(this[b]=255&a;++d<e&&(g*=256);)0>a&&0===f&&0!==this[b+d-1]&&(f=1),this[b+d]=(a/g>>0)-f&255;return b+e};a.prototype.writeIntBE=function(a,b,e,d){(a=+a,b>>>=0,d)||(d=Math.pow(2,8*e-1),z(this,a,b,e,d-1,-d));d=e-1;var g=1,f=0;for(this[b+d]=255&a;0<=--d&&(g*=256);)0>a&&0===f&&0!==this[b+d+1]&&(f=1),this[b+d]=(a/g>>0)-f&255;return b+e};a.prototype.writeInt8=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,
1,127,-128),0>a&&(a=255+a+1),this[b]=255&a,b+1};a.prototype.writeInt16LE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,2,32767,-32768),this[b]=255&a,this[b+1]=a>>>8,b+2};a.prototype.writeInt16BE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,2,32767,-32768),this[b]=a>>>8,this[b+1]=255&a,b+2};a.prototype.writeInt32LE=function(a,b,e){return a=+a,b>>>=0,e||z(this,a,b,4,2147483647,-2147483648),this[b]=255&a,this[b+1]=a>>>8,this[b+2]=a>>>16,this[b+3]=a>>>24,b+4};a.prototype.writeInt32BE=function(a,
b,e){return a=+a,b>>>=0,e||z(this,a,b,4,2147483647,-2147483648),0>a&&(a=4294967295+a+1),this[b]=a>>>24,this[b+1]=a>>>16,this[b+2]=a>>>8,this[b+3]=255&a,b+4};a.prototype.writeFloatLE=function(a,b,e){return J(this,a,b,!0,e)};a.prototype.writeFloatBE=function(a,b,e){return J(this,a,b,!1,e)};a.prototype.writeDoubleLE=function(a,b,e){return H(this,a,b,!0,e)};a.prototype.writeDoubleBE=function(a,b,e){return H(this,a,b,!1,e)};a.prototype.copy=function(a,b,e,d){if((e||(e=0),d||0===d||(d=this.length),b>=a.length&&
(b=a.length),b||(b=0),0<d&&d<e&&(d=e),d===e)||0===a.length||0===this.length)return 0;if(0>b)throw new RangeError("targetStart out of bounds");if(0>e||e>=this.length)throw new RangeError("sourceStart out of bounds");if(0>d)throw new RangeError("sourceEnd out of bounds");d>this.length&&(d=this.length);a.length-b<d-e&&(d=a.length-b+e);var g=d-e;if(this===a&&e<b&&b<d)for(d=g-1;0<=d;--d)a[d+b]=this[d+e];else if(1E3>g)for(d=0;d<g;++d)a[d+b]=this[d+e];else Uint8Array.prototype.set.call(a,this.subarray(e,
e+g),b);return g};a.prototype.fill=function(b,e,d,f){if("string"==typeof b){if("string"==typeof e?(f=e,e=0,d=this.length):"string"==typeof d&&(f=d,d=this.length),1===b.length){var g=b.charCodeAt(0);256>g&&(b=g)}if(void 0!==f&&"string"!=typeof f)throw new TypeError("encoding must be a string");if("string"==typeof f&&!a.isEncoding(f))throw new TypeError("Unknown encoding: "+f);}else"number"==typeof b&&(b&=255);if(0>e||this.length<e||this.length<d)throw new RangeError("Out of range index");if(d<=e)return this;
if(e>>>=0,d=void 0===d?this.length:d>>>0,b||(b=0),"number"==typeof b)for(f=e;f<d;++f)this[f]=b;else for(b=a.isBuffer(b)?b:new a(b,f),g=b.length,f=0;f<d-e;++f)this[f+e]=b[f%g];return this};var L=/[^+\/0-9A-Za-z-_]/g},{"base64-js":1,ieee754:9}],4:[function(c,l,k){(function(c){k.isArray=function(a){return Array.isArray?Array.isArray(a):"[object Array]"===Object.prototype.toString.call(a)};k.isBoolean=function(a){return"boolean"==typeof a};k.isNull=function(a){return null===a};k.isNullOrUndefined=function(a){return null==
a};k.isNumber=function(a){return"number"==typeof a};k.isString=function(a){return"string"==typeof a};k.isSymbol=function(a){return"symbol"==typeof a};k.isUndefined=function(a){return void 0===a};k.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)};k.isObject=function(a){return"object"==typeof a&&null!==a};k.isDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)};k.isError=function(a){return"[object Error]"===Object.prototype.toString.call(a)||a instanceof
Error};k.isFunction=function(a){return"function"==typeof a};k.isPrimitive=function(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||void 0===a};k.isBuffer=c.isBuffer}).call(this,{isBuffer:c("../../is-buffer/index.js")})},{"../../is-buffer/index.js":11}],5:[function(c,l,k){k.UINT32=c("./lib/uint32");k.UINT64=c("./lib/uint64")},{"./lib/uint32":6,"./lib/uint64":7}],6:[function(c,l,k){!function(c){function a(d,c){return this instanceof a?(this._low=
0,this._high=0,this.remainder=null,void 0===c?h.call(this,d):"string"==typeof d?f.call(this,d,c):void p.call(this,d,c)):new a(d,c)}function p(a,f){return this._low=0|a,this._high=0|f,this}function h(a){return this._low=65535&a,this._high=a>>>16,this}function f(a,f){var e=parseInt(a,f||10);return this._low=65535&e,this._high=e>>>16,this}a(Math.pow(36,5));a(Math.pow(16,7));a(Math.pow(10,9));a(Math.pow(2,30));a(36);a(16);a(10);a(2);a.prototype.fromBits=p;a.prototype.fromNumber=h;a.prototype.fromString=
f;a.prototype.toNumber=function(){return 65536*this._high+this._low};a.prototype.toString=function(a){return this.toNumber().toString(a||10)};a.prototype.add=function(a){var d=this._low+a._low,e=d>>>16;return e+=this._high+a._high,this._low=65535&d,this._high=65535&e,this};a.prototype.subtract=function(a){return this.add(a.clone().negate())};a.prototype.multiply=function(a){var d,e,f=this._high,c=this._low,h=a._high;a=a._low;return d=(e=c*a)>>>16,d+=f*a,d&=65535,d+=c*h,this._low=65535&e,this._high=
65535&d,this};a.prototype.div=function(d){if(0==d._low&&0==d._high)throw Error("division by zero");if(0==d._high&&1==d._low)return this.remainder=new a(0),this;if(d.gt(this))return this.remainder=this.clone(),this._low=0,this._high=0,this;if(this.eq(d))return this.remainder=new a(0),this._low=1,this._high=0,this;d=d.clone();for(var f=-1;!this.lt(d);)d.shiftLeft(1,!0),f++;this.remainder=this.clone();for(this._high=this._low=0;0<=f;f--)d.shiftRight(1),this.remainder.lt(d)||(this.remainder.subtract(d),
16<=f?this._high|=1<<f-16:this._low|=1<<f);return this};a.prototype.negate=function(){var a=1+(65535&~this._low);return this._low=65535&a,this._high=~this._high+(a>>>16)&65535,this};a.prototype.equals=a.prototype.eq=function(a){return this._low==a._low&&this._high==a._high};a.prototype.greaterThan=a.prototype.gt=function(a){return this._high>a._high||!(this._high<a._high)&&this._low>a._low};a.prototype.lessThan=a.prototype.lt=function(a){return this._high<a._high||!(this._high>a._high)&&this._low<
a._low};a.prototype.or=function(a){return this._low|=a._low,this._high|=a._high,this};a.prototype.and=function(a){return this._low&=a._low,this._high&=a._high,this};a.prototype.not=function(){return this._low=65535&~this._low,this._high=65535&~this._high,this};a.prototype.xor=function(a){return this._low^=a._low,this._high^=a._high,this};a.prototype.shiftRight=a.prototype.shiftr=function(a){return 16<a?(this._low=this._high>>a-16,this._high=0):16==a?(this._low=this._high,this._high=0):(this._low=
this._low>>a|this._high<<16-a&65535,this._high>>=a),this};a.prototype.shiftLeft=a.prototype.shiftl=function(a,f){return 16<a?(this._high=this._low<<a-16,this._low=0,f||(this._high&=65535)):16==a?(this._high=this._low,this._low=0):(this._high=this._high<<a|this._low>>16-a,this._low=this._low<<a&65535,f||(this._high&=65535)),this};a.prototype.rotateLeft=a.prototype.rotl=function(a){var d=this._high<<16|this._low;return d=d<<a|d>>>32-a,this._low=65535&d,this._high=d>>>16,this};a.prototype.rotateRight=
a.prototype.rotr=function(a){var d=this._high<<16|this._low;return d=d>>>a|d<<32-a,this._low=65535&d,this._high=d>>>16,this};a.prototype.clone=function(){return new a(this._low,this._high)};"undefined"!=typeof define&&define.amd?define([],function(){return a}):void 0!==l&&l.exports?l.exports=a:c.UINT32=a}(this)},{}],7:[function(c,l,k){!function(c){function a(e,d,c,v){return this instanceof a?(this.remainder=null,"string"==typeof e?f.call(this,e,d):void 0===d?h.call(this,e):void p.apply(this,arguments)):
new a(e,d,c,v)}function p(a,d,f,c){return void 0===f?(this._a00=65535&a,this._a16=a>>>16,this._a32=65535&d,this._a48=d>>>16,this):(this._a00=0|a,this._a16=0|d,this._a32=0|f,this._a48=0|c,this)}function h(a){return this._a00=65535&a,this._a16=a>>>16,this._a32=0,this._a48=0,this}function f(e,f){f=f||10;this._a48=this._a32=this._a16=this._a00=0;for(var c=d[f]||new a(Math.pow(f,5)),h=0,b=e.length;h<b;h+=5){var p=Math.min(5,b-h),x=parseInt(e.slice(h,h+p),f);this.multiply(5>p?new a(Math.pow(f,p)):c).add(new a(x))}return this}
var d={16:a(Math.pow(16,5)),10:a(Math.pow(10,5)),2:a(Math.pow(2,5))},x={16:a(16),10:a(10),2:a(2)};a.prototype.fromBits=p;a.prototype.fromNumber=h;a.prototype.fromString=f;a.prototype.toNumber=function(){return 65536*this._a16+this._a00};a.prototype.toString=function(e){var d=x[e=e||10]||new a(e);if(!this.gt(d))return this.toNumber().toString(e);for(var f=this.clone(),c=Array(64),b=63;0<=b&&(f.div(d),c[b]=f.remainder.toNumber().toString(e),f.gt(d));b--);return c[b-1]=f.toNumber().toString(e),c.join("")};
a.prototype.add=function(a){var e=this._a00+a._a00,d=e>>>16,f=(d+=this._a16+a._a16)>>>16,b=(f+=this._a32+a._a32)>>>16;return b+=this._a48+a._a48,this._a00=65535&e,this._a16=65535&d,this._a32=65535&f,this._a48=65535&b,this};a.prototype.subtract=function(a){return this.add(a.clone().negate())};a.prototype.multiply=function(a){var e=this._a00,d=this._a16,f=this._a32,b=this._a48,c=a._a00,h=a._a16,p=a._a32,x=e*c,k=x>>>16,m=(k+=e*h)>>>16;k&=65535;m+=(k+=d*c)>>>16;var l=(m+=e*p)>>>16;return m&=65535,l+=
(m+=d*h)>>>16,m&=65535,l+=(m+=f*c)>>>16,l+=e*a._a48,l&=65535,l+=d*p,l&=65535,l+=f*h,l&=65535,l+=b*c,this._a00=65535&x,this._a16=65535&k,this._a32=65535&m,this._a48=65535&l,this};a.prototype.div=function(e){if(0==e._a16&&0==e._a32&&0==e._a48){if(0==e._a00)throw Error("division by zero");if(1==e._a00)return this.remainder=new a(0),this}if(e.gt(this))return this.remainder=this.clone(),this._a00=0,this._a16=0,this._a32=0,this._a48=0,this;if(this.eq(e))return this.remainder=new a(0),this._a00=1,this._a16=
0,this._a32=0,this._a48=0,this;e=e.clone();for(var d=-1;!this.lt(e);)e.shiftLeft(1,!0),d++;this.remainder=this.clone();for(this._a48=this._a32=this._a16=this._a00=0;0<=d;d--)e.shiftRight(1),this.remainder.lt(e)||(this.remainder.subtract(e),48<=d?this._a48|=1<<d-48:32<=d?this._a32|=1<<d-32:16<=d?this._a16|=1<<d-16:this._a00|=1<<d);return this};a.prototype.negate=function(){var a=1+(65535&~this._a00);return this._a00=65535&a,a=(65535&~this._a16)+(a>>>16),this._a16=65535&a,a=(65535&~this._a32)+(a>>>
16),this._a32=65535&a,this._a48=~this._a48+(a>>>16)&65535,this};a.prototype.equals=a.prototype.eq=function(a){return this._a48==a._a48&&this._a00==a._a00&&this._a32==a._a32&&this._a16==a._a16};a.prototype.greaterThan=a.prototype.gt=function(a){return this._a48>a._a48||!(this._a48<a._a48)&&(this._a32>a._a32||!(this._a32<a._a32)&&(this._a16>a._a16||!(this._a16<a._a16)&&this._a00>a._a00))};a.prototype.lessThan=a.prototype.lt=function(a){return this._a48<a._a48||!(this._a48>a._a48)&&(this._a32<a._a32||
!(this._a32>a._a32)&&(this._a16<a._a16||!(this._a16>a._a16)&&this._a00<a._a00))};a.prototype.or=function(a){return this._a00|=a._a00,this._a16|=a._a16,this._a32|=a._a32,this._a48|=a._a48,this};a.prototype.and=function(a){return this._a00&=a._a00,this._a16&=a._a16,this._a32&=a._a32,this._a48&=a._a48,this};a.prototype.xor=function(a){return this._a00^=a._a00,this._a16^=a._a16,this._a32^=a._a32,this._a48^=a._a48,this};a.prototype.not=function(){return this._a00=65535&~this._a00,this._a16=65535&~this._a16,
this._a32=65535&~this._a32,this._a48=65535&~this._a48,this};a.prototype.shiftRight=a.prototype.shiftr=function(a){return 48<=(a%=64)?(this._a00=this._a48>>a-48,this._a16=0,this._a32=0,this._a48=0):32<=a?(a-=32,this._a00=65535&(this._a32>>a|this._a48<<16-a),this._a16=this._a48>>a&65535,this._a32=0,this._a48=0):16<=a?(a-=16,this._a00=65535&(this._a16>>a|this._a32<<16-a),this._a16=65535&(this._a32>>a|this._a48<<16-a),this._a32=this._a48>>a&65535,this._a48=0):(this._a00=65535&(this._a00>>a|this._a16<<
16-a),this._a16=65535&(this._a16>>a|this._a32<<16-a),this._a32=65535&(this._a32>>a|this._a48<<16-a),this._a48=this._a48>>a&65535),this};a.prototype.shiftLeft=a.prototype.shiftl=function(a,d){return 48<=(a%=64)?(this._a48=this._a00<<a-48,this._a32=0,this._a16=0,this._a00=0):32<=a?(a-=32,this._a48=this._a16<<a|this._a00>>16-a,this._a32=this._a00<<a&65535,this._a16=0,this._a00=0):16<=a?(a-=16,this._a48=this._a32<<a|this._a16>>16-a,this._a32=65535&(this._a16<<a|this._a00>>16-a),this._a16=this._a00<<a&
65535,this._a00=0):(this._a48=this._a48<<a|this._a32>>16-a,this._a32=65535&(this._a32<<a|this._a16>>16-a),this._a16=65535&(this._a16<<a|this._a00>>16-a),this._a00=this._a00<<a&65535),d||(this._a48&=65535),this};a.prototype.rotateLeft=a.prototype.rotl=function(a){if(0==(a%=64))return this;if(32<=a){var d=this._a00;if(this._a00=this._a32,this._a32=d,d=this._a48,this._a48=this._a16,this._a16=d,32==a)return this;a-=32}var e=this._a48<<16|this._a32,f=this._a16<<16|this._a00;d=e<<a|f>>>32-a;a=f<<a|e>>>
32-a;return this._a00=65535&a,this._a16=a>>>16,this._a32=65535&d,this._a48=d>>>16,this};a.prototype.rotateRight=a.prototype.rotr=function(a){if(0==(a%=64))return this;if(32<=a){var d=this._a00;if(this._a00=this._a32,this._a32=d,d=this._a48,this._a48=this._a16,this._a16=d,32==a)return this;a-=32}var e=this._a48<<16|this._a32,f=this._a16<<16|this._a00;d=e>>>a|f<<32-a;a=f>>>a|e<<32-a;return this._a00=65535&a,this._a16=a>>>16,this._a32=65535&d,this._a48=d>>>16,this};a.prototype.clone=function(){return new a(this._a00,
this._a16,this._a32,this._a48)};"undefined"!=typeof define&&define.amd?define([],function(){return a}):void 0!==l&&l.exports?l.exports=a:c.UINT64=a}(this)},{}],8:[function(c,l,k){function m(){this._events=this._events||{};this._maxListeners=this._maxListeners||void 0}function a(a){return"function"==typeof a}function p(a){return"object"==typeof a&&null!==a}l.exports=m;m.EventEmitter=m;m.prototype._events=void 0;m.prototype._maxListeners=void 0;m.defaultMaxListeners=10;m.prototype.setMaxListeners=function(a){if("number"!=
typeof a||0>a||isNaN(a))throw TypeError("n must be a positive number");return this._maxListeners=a,this};m.prototype.emit=function(c){var f,d,h;if(this._events||(this._events={}),"error"===c&&(!this._events.error||p(this._events.error)&&!this._events.error.length)){if((f=arguments[1])instanceof Error)throw f;var e=Error('Uncaught, unspecified "error" event. ('+f+")");throw e.context=f,e;}if(void 0===(e=this._events[c]))return!1;if(a(e))switch(arguments.length){case 1:e.call(this);break;case 2:e.call(this,
arguments[1]);break;case 3:e.call(this,arguments[1],arguments[2]);break;default:f=Array.prototype.slice.call(arguments,1),e.apply(this,f)}else if(p(e))for(f=Array.prototype.slice.call(arguments,1),e=(h=e.slice()).length,d=0;d<e;d++)h[d].apply(this,f);return!0};m.prototype.addListener=function(c,f){var d;if(!a(f))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",c,a(f.listener)?f.listener:f),this._events[c]?p(this._events[c])?
this._events[c].push(f):this._events[c]=[this._events[c],f]:this._events[c]=f,p(this._events[c])&&!this._events[c].warned&&(d=void 0===this._maxListeners?m.defaultMaxListeners:this._maxListeners)&&0<d&&this._events[c].length>d&&(this._events[c].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[c].length),"function"==typeof console.trace&&console.trace()),this};m.prototype.on=m.prototype.addListener;
m.prototype.once=function(c,f){function d(){this.removeListener(c,d);h||(h=!0,f.apply(this,arguments))}if(!a(f))throw TypeError("listener must be a function");var h=!1;return d.listener=f,this.on(c,d),this};m.prototype.removeListener=function(c,f){var d,h,e;if(!a(f))throw TypeError("listener must be a function");if(!this._events||!this._events[c])return this;if(e=(d=this._events[c]).length,h=-1,d===f||a(d.listener)&&d.listener===f)delete this._events[c],this._events.removeListener&&this.emit("removeListener",
c,f);else if(p(d)){for(;0<e--;)if(d[e]===f||d[e].listener&&d[e].listener===f){h=e;break}if(0>h)return this;1===d.length?(d.length=0,delete this._events[c]):d.splice(h,1);this._events.removeListener&&this.emit("removeListener",c,f)}return this};m.prototype.removeAllListeners=function(c){var f;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[c]&&delete this._events[c],this;if(0===arguments.length){for(f in this._events)"removeListener"!==
f&&this.removeAllListeners(f);return this.removeAllListeners("removeListener"),this._events={},this}if(a(f=this._events[c]))this.removeListener(c,f);else if(f)for(;f.length;)this.removeListener(c,f[f.length-1]);return delete this._events[c],this};m.prototype.listeners=function(c){return this._events&&this._events[c]?a(this._events[c])?[this._events[c]]:this._events[c].slice():[]};m.prototype.listenerCount=function(c){if(this._events){c=this._events[c];if(a(c))return 1;if(c)return c.length}return 0};
m.listenerCount=function(a,f){return a.listenerCount(f)}},{}],9:[function(c,l,k){k.read=function(c,a,p,h,f){var d=8*f-h-1;var k=(1<<d)-1,e=k>>1,m=-7;f=p?f-1:0;var l=p?-1:1,v=c[a+f];f+=l;p=v&(1<<-m)-1;v>>=-m;for(m+=d;0<m;p=256*p+c[a+f],f+=l,m-=8);d=p&(1<<-m)-1;p>>=-m;for(m+=h;0<m;d=256*d+c[a+f],f+=l,m-=8);if(0===p)p=1-e;else{if(p===k)return d?NaN:1/0*(v?-1:1);d+=Math.pow(2,h);p-=e}return(v?-1:1)*d*Math.pow(2,p-h)};k.write=function(c,a,p,h,f,d){var m,e,k,l=8*d-f-1,v=(1<<l)-1,b=v>>1,u=23===f?Math.pow(2,
-24)-Math.pow(2,-77):0;d=h?0:d-1;h=h?1:-1;var y=0>a||0===a&&0>1/a?1:0;a=Math.abs(a);for(isNaN(a)||a===1/0?(e=isNaN(a)?1:0,m=v):(m=Math.floor(Math.log(a)/Math.LN2),1>a*(k=Math.pow(2,-m))&&(m--,k*=2),2<=(a+=1<=m+b?u/k:u*Math.pow(2,1-b))*k&&(m++,k/=2),m+b>=v?(e=0,m=v):1<=m+b?(e=(a*k-1)*Math.pow(2,f),m+=b):(e=a*Math.pow(2,b-1)*Math.pow(2,f),m=0));8<=f;c[p+d]=255&e,d+=h,e/=256,f-=8);m=m<<f|e;for(l+=f;0<l;c[p+d]=255&m,d+=h,m/=256,l-=8);c[p+d-h]|=128*y}},{}],10:[function(c,l,k){"function"==typeof Object.create?
l.exports=function(c,a){c.super_=a;c.prototype=Object.create(a.prototype,{constructor:{value:c,enumerable:!1,writable:!0,configurable:!0}})}:l.exports=function(c,a){c.super_=a;var p=function(){};p.prototype=a.prototype;c.prototype=new p;c.prototype.constructor=c}},{}],11:[function(c,l,k){function m(a){return!!a.constructor&&"function"==typeof a.constructor.isBuffer&&a.constructor.isBuffer(a)}l.exports=function(a){return null!=a&&(m(a)||"function"==typeof(c=a).readFloatLE&&"function"==typeof c.slice&&
m(c.slice(0,0))||!!a._isBuffer);var c}},{}],12:[function(c,l,k){var m={}.toString;l.exports=Array.isArray||function(a){return"[object Array]"==m.call(a)}},{}],13:[function(c,l,k){function m(a,c,h,f,d,m){var e=d;m-=d;d=0;if(2113929216<=a.length)throw Error("input too large");if(12<a.length){var p=k.compressBound(a.length);if(m<p)throw Error("output too small: "+m+" < "+p);m=67;for(p=a.length-12;h+4<p;){var l=a[h+1]<<8|a[h],v=a[h+3]<<8|a[h+2],b=Math.imul(l|v<<16,2654435761)>>>16,u=f[b]-1;if(f[b]=h+
1,0>u||0<h-u>>>16||(a[u+3]<<8|a[u+2])!=v||(a[u+1]<<8|a[u])!=l)h+=m++>>6;else{m=67;l=h-d;v=h-u;u+=4;for(b=h+=4;h<p&&a[h]==a[u];)h++,u++;u=15>(b=h-b)?b:15;if(15<=l){c[e++]=240+u;for(u=l-15;254<u;u-=255)c[e++]=255;c[e++]=u}else c[e++]=(l<<4)+u;for(u=0;u<l;u++)c[e++]=a[d+u];if(c[e++]=v,c[e++]=v>>8,15<=b){for(b-=15;255<=b;)b-=255,c[e++]=255;c[e++]=b}d=h}}}if(0==d)return 0;if(15<=(l=a.length-d)){c[e++]=240;for(h=l-15;254<h;h-=255)c[e++]=255;c[e++]=h}else c[e++]=l<<4;for(h=d;h<a.length;)c[e++]=a[h++];return e}
c("cuint").UINT32;Math.imul||(Math.imul=function(a,c){var h=65535&a,f=65535&c;return h*f+((a>>>16)*f+h*(c>>>16)<<16)|0});k.uncompress=function(a,c,h,f){var d=h=h||0;h=f||a.length-h;for(f=0;d<h;){var p=a[d++],e=p>>4;if(0<e){for(var m=e+240;255===m;)e+=m=a[d++];for(m=d+e;d<m;)c[f++]=a[d++];if(d===h)break}e=a[d++]|a[d++]<<8;if(0===e||e>f)return-(d-2);p&=15;for(m=p+240;255===m;)p+=m=a[d++];e=f-e;for(m=f+p+4;f<m;)c[f++]=c[e++]}return f};k.compressBound=function(a){return 2113929216<a?0:a+a/255+16|0};k.compress=
function(a,c,h,f){for(var d=Array(65536),p=0;65536>p;p++)d[p]=0;return m(a,c,0,d,h||0,f||c.length)};k.compressHC=k.compress;k.compressDependent=m},{cuint:5}],14:[function(c,l,k){(function(m){var a=c("./decoder_stream");k.LZ4_uncompress=function(c,h){var f=[],d=new a(h);return d.on("data",function(a){f.push(a)}),d.end(c),m.concat(f)}}).call(this,c("buffer").Buffer)},{"./decoder_stream":15,buffer:3}],15:[function(c,l,k){(function(m){function a(d){if(!(this instanceof a))return new a(d);p.call(this,
d);this.options=d||{};this.binding=this.options.useJS?e:k;this.buffer=null;this.pos=0;this.descriptor=null;this.state=r.MAGIC;this.notEnoughData=!1;this.descriptorStart=0;this.currentStreamChecksum=this.dictId=this.streamSize=null;this.skippableSize=this.dataBlockSize=0}var p=c("stream").Transform,h=c("util").inherits,f=c("./static"),d=f.utils,k=d.bindings,e=c("./binding"),r=f.STATES,w=f.SIZES;h(a,p);a.prototype._transform=function(a,b,d){if(0<this.skippableSize){if(this.skippableSize-=a.length,0<
this.skippableSize)return void d();a=a.slice(-this.skippableSize);this.skippableSize=0;this.state=r.MAGIC}this.buffer=this.buffer?m.concat([this.buffer,a],this.buffer.length+a.length):a;this._main(d)};a.prototype.emit_Error=function(a){this.emit("error",Error(a+" @"+this.pos))};a.prototype.check_Size=function(a){var b=this.buffer.length-this.pos;return 0>=b||b<a?(this.notEnoughData&&this.emit_Error("Unexpected end of LZ4 stream"),!0):(this.pos+=a,!1)};a.prototype.read_MagicNumber=function(){var a=
this.pos;if(this.check_Size(w.MAGIC))return!0;var b=d.readInt32LE(this.buffer,a);if((4294967280&b)!==f.MAGICNUMBER_SKIPPABLE)return b!==f.MAGICNUMBER?(this.pos=a,this.emit_Error("Invalid magic number: "+b.toString(16).toUpperCase()),!0):void(this.state=r.DESCRIPTOR);this.state=r.SKIP_SIZE};a.prototype.read_SkippableSize=function(){var a=this.pos;if(this.check_Size(w.SKIP_SIZE))return!0;this.state=r.SKIP_DATA;this.skippableSize=d.readInt32LE(this.buffer,a)};a.prototype.read_Descriptor=function(){var a=
this.pos;if(this.check_Size(w.DESCRIPTOR))return!0;this.descriptorStart=a;var b=this.buffer[a],d=b>>6;if(d!==f.VERSION)return this.pos=a,this.emit_Error("Invalid version: "+d+" != "+f.VERSION),!0;if(b>>1&1)return this.pos=a,this.emit_Error("Reserved bit set"),!0;d=this.buffer[a+1]>>4&7;var e=f.blockMaxSizes[d];if(null===e)return this.pos=a,this.emit_Error("Invalid block max size: "+d),!0;this.descriptor={blockIndependence:!!(b>>5&1),blockChecksum:!!(b>>4&1),blockMaxSize:e,streamSize:!!(b>>3&1),streamChecksum:!!(b>>
2&1),dict:!!(1&b),dictId:0};this.state=r.SIZE};a.prototype.read_Size=function(){if(this.descriptor.streamSize){var a=this.pos;if(this.check_Size(w.SIZE))return!0;this.streamSize=this.buffer.slice(a,a+8)}this.state=r.DICTID};a.prototype.read_DictId=function(){if(this.descriptor.dictId){var a=this.pos;if(this.check_Size(w.DICTID))return!0;this.dictId=d.readInt32LE(this.buffer,a)}this.state=r.DESCRIPTOR_CHECKSUM};a.prototype.read_DescriptorChecksum=function(){var a=this.pos;if(this.check_Size(w.DESCRIPTOR_CHECKSUM))return!0;
var b=this.buffer[a];if(d.descriptorChecksum(this.buffer.slice(this.descriptorStart,a))!==b)return this.pos=a,this.emit_Error("Invalid stream descriptor checksum"),!0;this.state=r.DATABLOCK_SIZE};a.prototype.read_DataBlockSize=function(){var a=this.pos;if(this.check_Size(w.DATABLOCK_SIZE))return!0;a=d.readInt32LE(this.buffer,a);a!==f.EOS?(this.dataBlockSize=a,this.state=r.DATABLOCK_DATA):this.state=r.EOS};a.prototype.read_DataBlockData=function(){var a=this.pos,b=this.dataBlockSize;if(2147483648&
b&&(b&=2147483647),this.check_Size(b))return!0;this.dataBlock=this.buffer.slice(a,a+b);this.state=r.DATABLOCK_CHECKSUM};a.prototype.read_DataBlockChecksum=function(){var a=this.pos;if(this.descriptor.blockChecksum){if(this.check_Size(w.DATABLOCK_CHECKSUM))return!0;var b=d.readInt32LE(this.buffer,this.pos-4);if(d.blockChecksum(this.dataBlock)!==b)return this.pos=a,this.emit_Error("Invalid block checksum"),!0}this.state=r.DATABLOCK_UNCOMPRESS};a.prototype.uncompress_DataBlock=function(){if(2147483648&
this.dataBlockSize)var a=this.dataBlock;else{a=new m(this.descriptor.blockMaxSize);var b=this.binding.uncompress(this.dataBlock,a);if(0>b)return this.emit_Error("Invalid data block: "+-b),!0;b<this.descriptor.blockMaxSize&&(a=a.slice(0,b))}this.dataBlock=null;this.push(a);this.descriptor.streamChecksum&&(this.currentStreamChecksum=d.streamChecksum(a,this.currentStreamChecksum));this.state=r.DATABLOCK_SIZE};a.prototype.read_EOS=function(){if(this.descriptor.streamChecksum){var a=this.pos;if(this.check_Size(w.EOS))return!0;
var b=d.readInt32LE(this.buffer,a);if(b!==d.streamChecksum(null,this.currentStreamChecksum))return this.pos=a,this.emit_Error("Invalid stream checksum: "+b.toString(16).toUpperCase()),!0}this.state=r.MAGIC};a.prototype._flush=function(a){this.notEnoughData=!0;this._main(a)};a.prototype._main=function(a){for(var b,d=this.pos;!b&&this.pos<this.buffer.length;)this.state===r.MAGIC&&(b=this.read_MagicNumber()),this.state===r.SKIP_SIZE&&(b=this.read_SkippableSize()),this.state===r.DESCRIPTOR&&(b=this.read_Descriptor()),
this.state===r.SIZE&&(b=this.read_Size()),this.state===r.DICTID&&(b=this.read_DictId()),this.state===r.DESCRIPTOR_CHECKSUM&&(b=this.read_DescriptorChecksum()),this.state===r.DATABLOCK_SIZE&&(b=this.read_DataBlockSize()),this.state===r.DATABLOCK_DATA&&(b=this.read_DataBlockData()),this.state===r.DATABLOCK_CHECKSUM&&(b=this.read_DataBlockChecksum()),this.state===r.DATABLOCK_UNCOMPRESS&&(b=this.uncompress_DataBlock()),this.state===r.EOS&&(b=this.read_EOS());this.pos>d&&(this.buffer=this.buffer.slice(this.pos),
this.pos=0);a()};l.exports=a}).call(this,c("buffer").Buffer)},{"./binding":13,"./static":19,buffer:3,stream:37,util:42}],16:[function(c,l,k){(function(m){var a=c("./encoder_stream");k.LZ4_compress=function(c,h){var f=[],d=new a(h);return d.on("data",function(a){f.push(a)}),d.end(c),m.concat(f)}}).call(this,c("buffer").Buffer)},{"./encoder_stream":17,buffer:3}],17:[function(c,l,k){(function(m){function a(b){if(!(this instanceof a))return new a(b);p.call(this,b);var d=b||v;d!==v&&Object.keys(v).forEach(function(a){d.hasOwnProperty(a)||
(d[a]=v[a])});this.options=d;this.binding=this.options.useJS?e:k;this.compress=d.highCompression?this.binding.compressHC:this.binding.compress;b=0|f.VERSION<<6;b|=(1&d.blockIndependence)<<5;b|=(1&d.blockChecksum)<<4;b|=(1&d.streamSize)<<3;b|=(1&d.streamChecksum)<<2;b|=1&d.dict;var c=f.blockMaxSizes.indexOf(d.blockMaxSize);if(0>c)throw Error("Invalid blockMaxSize: "+d.blockMaxSize);this.descriptor={flg:b,bd:(7&c)<<4};this.buffer=[];this.length=0;this.first=!0;this.checksum=null}var p=c("stream").Transform,
h=c("util").inherits,f=c("./static"),d=f.utils,k=d.bindings,e=c("./binding"),r=f.STATES,w=f.SIZES,v={blockIndependence:!0,blockChecksum:!1,blockMaxSize:4194304,streamSize:!1,streamChecksum:!0,dict:!1,dictId:0,highCompression:!1};h(a,p);a.prototype.headerSize=function(){return w.MAGIC+1+1+(this.options.streamSize?w.DESCRIPTOR:0)+(this.options.dict?w.DICTID:0)+1};a.prototype.header=function(){var a=this.headerSize();a=new m(a);this.state=r.MAGIC;a.writeInt32LE(f.MAGICNUMBER,0,!0);this.state=r.DESCRIPTOR;
var e=a.slice(w.MAGIC,a.length-1);e.writeUInt8(this.descriptor.flg,0,!0);e.writeUInt8(this.descriptor.bd,1,!0);var c=2;return this.state=r.SIZE,this.options.streamSize&&(e.writeInt32LE(0,c,!0),e.writeInt32LE(this.size,c+4,!0),c+=w.SIZE),this.state=r.DICTID,this.options.dict&&(e.writeInt32LE(this.dictId,c,!0),c+=w.DICTID),this.state=r.DESCRIPTOR_CHECKSUM,a.writeUInt8(d.descriptorChecksum(e),w.MAGIC+c,!1),a};a.prototype.update_Checksum=function(a){this.state=r.CHECKSUM_UPDATE;this.options.streamChecksum&&
(this.checksum=d.streamChecksum(a,this.checksum))};a.prototype.compress_DataBlock=function(a){this.state=r.DATABLOCK_COMPRESS;var b=this.options.blockChecksum?w.DATABLOCK_CHECKSUM:0,e=this.binding.compressBound(a.length),c=new m(w.DATABLOCK_SIZE+e+b);e=c.slice(w.DATABLOCK_SIZE,w.DATABLOCK_SIZE+e);var f=this.compress(a,e);(this.state=r.DATABLOCK_SIZE,0<f&&f<=this.options.blockMaxSize?(c.writeUInt32LE(f,0,!0),c=c.slice(0,w.DATABLOCK_SIZE+f+b)):(c.writeInt32LE(2147483648|a.length,0,!0),c=c.slice(0,w.DATABLOCK_SIZE+
a.length+b),a.copy(c,w.DATABLOCK_SIZE)),this.state=r.DATABLOCK_CHECKSUM,this.options.blockChecksum)&&c.slice(-b).writeInt32LE(d.blockChecksum(e),0,!0);return this.update_Checksum(a),this.size+=a.length,c};a.prototype._transform=function(a,d,e){a&&(this.buffer.push(a),this.length+=a.length);this.first&&(this.push(this.header()),this.first=!1);a=this.options.blockMaxSize;if(this.length<a)return e();d=m.concat(this.buffer,this.length);for(var b=0,c=d.length;c>=a;c-=a,b+=a)this.push(this.compress_DataBlock(d.slice(b,
b+a)));0<c?(this.buffer=[d.slice(b)],this.length=this.buffer[0].length):(this.buffer=[],this.length=0);e()};a.prototype._flush=function(a){if(this.first&&(this.push(this.header()),this.first=!1),0<this.length){var b=m.concat(this.buffer,this.length);this.buffer=[];this.length=0;b=this.compress_DataBlock(b);this.push(b)}this.options.streamChecksum?(this.state=r.CHECKSUM,(b=new m(w.EOS+w.CHECKSUM)).writeInt32LE(d.streamChecksum(null,this.checksum),w.EOS,!0)):b=new m(w.EOS);this.state=r.EOS;b.writeInt32LE(f.EOS,
0,!0);this.push(b);a()};l.exports=a}).call(this,c("buffer").Buffer)},{"./binding":13,"./static":19,buffer:3,stream:37,util:42}],18:[function(c,l,k){l.exports=c("./static");l.exports.version="0.5.1";l.exports.createDecoderStream=c("./decoder_stream");l.exports.decode=c("./decoder").LZ4_uncompress;l.exports.createEncoderStream=c("./encoder_stream");l.exports.encode=c("./encoder").LZ4_compress;c=l.exports.utils.bindings;l.exports.decodeBlock=c.uncompress;l.exports.encodeBound=c.compressBound;l.exports.encodeBlock=
c.compress;l.exports.encodeBlockHC=c.compressHC},{"./decoder":14,"./decoder_stream":15,"./encoder":16,"./encoder_stream":17,"./static":19}],19:[function(c,l,k){l=c("buffer").Buffer;k.MAGICNUMBER=407708164;k.MAGICNUMBER_BUFFER=new l(4);k.MAGICNUMBER_BUFFER.writeUInt32LE(k.MAGICNUMBER,0,!1);k.EOS=0;k.EOS_BUFFER=new l(4);k.EOS_BUFFER.writeUInt32LE(k.EOS,0,!1);k.VERSION=1;k.MAGICNUMBER_SKIPPABLE=407710288;k.blockMaxSizes=[null,null,null,null,65536,262144,1048576,4194304];k.extension=".lz4";k.STATES={MAGIC:0,
DESCRIPTOR:1,SIZE:2,DICTID:3,DESCRIPTOR_CHECKSUM:4,DATABLOCK_SIZE:5,DATABLOCK_DATA:6,DATABLOCK_CHECKSUM:7,DATABLOCK_UNCOMPRESS:8,DATABLOCK_COMPRESS:9,CHECKSUM:10,CHECKSUM_UPDATE:11,EOS:90,SKIP_SIZE:101,SKIP_DATA:102};k.SIZES={MAGIC:4,DESCRIPTOR:2,SIZE:8,DICTID:4,DESCRIPTOR_CHECKSUM:1,DATABLOCK_SIZE:4,DATABLOCK_CHECKSUM:4,CHECKSUM:4,EOS:4,SKIP_SIZE:4};k.utils=c("./utils")},{"./utils":20,buffer:3}],20:[function(c,l,k){var m=c("xxhashjs");k.descriptorChecksum=function(a){return m(a,0).toNumber()>>8&
255};k.blockChecksum=function(a){return m(a,0).toNumber()};k.streamChecksum=function(a,c){return null===a?c.digest().toNumber():(null===c&&(c=m(0)),c.update(a))};k.readInt32LE=function(a,c){return a[c]|a[c+1]<<8|a[c+2]<<16|a[c+3]<<24};k.bindings=c("./binding")},{"./binding":13,xxhashjs:46}],21:[function(c,l,k){(function(c){!c.version||0===c.version.indexOf("v0.")||0===c.version.indexOf("v1.")&&0!==c.version.indexOf("v1.8.")?l.exports=function(a,m,h,f){if("function"!=typeof a)throw new TypeError('"callback" argument must be a function');
var d=arguments.length;switch(d){case 0:case 1:return c.nextTick(a);case 2:return c.nextTick(function(){a.call(null,m)});case 3:return c.nextTick(function(){a.call(null,m,h)});case 4:return c.nextTick(function(){a.call(null,m,h,f)});default:var k=Array(d-1);for(d=0;d<k.length;)k[d++]=arguments[d];return c.nextTick(function(){a.apply(null,k)})}}:l.exports=c.nextTick}).call(this,c("_process"))},{_process:22}],22:[function(c,l,k){function m(){throw Error("setTimeout has not been defined");}function a(){throw Error("clearTimeout has not been defined");
}function p(a){if(e===setTimeout)return setTimeout(a,0);if((e===m||!e)&&setTimeout)return e=setTimeout,setTimeout(a,0);try{return e(a,0)}catch(z){try{return e.call(null,a,0)}catch(G){return e.call(this,a,0)}}}function h(){b&&w&&(b=!1,w.length?v=w.concat(v):u=-1,v.length&&f())}function f(){if(!b){var d=p(h);b=!0;for(var e=v.length;e;){w=v;for(v=[];++u<e;)w&&w[u].run();u=-1;e=v.length}w=null;b=!1;(function(b){if(r===clearTimeout)return clearTimeout(b);if((r===a||!r)&&clearTimeout)return r=clearTimeout,
clearTimeout(b);try{r(b)}catch(J){try{return r.call(null,b)}catch(H){return r.call(this,b)}}})(d)}}function d(a,b){this.fun=a;this.array=b}function x(){}c=l.exports={};try{var e="function"==typeof setTimeout?setTimeout:m}catch(y){e=m}try{var r="function"==typeof clearTimeout?clearTimeout:a}catch(y){r=a}!0;var w,v=[],b=!1,u=-1;c.nextTick=function(a){var e=Array(arguments.length-1);if(1<arguments.length)for(var c=1;c<arguments.length;c++)e[c-1]=arguments[c];v.push(new d(a,e));1!==v.length||b||p(f)};
d.prototype.run=function(){this.fun.apply(null,this.array)};c.title="browser";c.browser=!0;c.env={};c.argv=[];c.version="";c.versions={};c.on=x;c.addListener=x;c.once=x;c.off=x;c.removeListener=x;c.removeAllListeners=x;c.emit=x;c.prependListener=x;c.prependOnceListener=x;c.listeners=function(a){return[]};c.binding=function(a){throw Error("process.binding is not supported");};c.cwd=function(){return"/"};c.chdir=function(a){throw Error("process.chdir is not supported");};c.umask=function(){return 0}},
{}],23:[function(c,l,k){l.exports=c("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":24}],24:[function(c,l,k){function m(c){if(!(this instanceof m))return new m(c);f.call(this,c);d.call(this,c);c&&!1===c.readable&&(this.readable=!1);c&&!1===c.writable&&(this.writable=!1);this.allowHalfOpen=!0;c&&!1===c.allowHalfOpen&&(this.allowHalfOpen=!1);this.once("end",a)}function a(){this.allowHalfOpen||this._writableState.ended||h(p,this)}function p(a){a.end()}var h=c("process-nextick-args");k=Object.keys||
function(a){var d=[],c;for(c in a)d.push(c);return d};l.exports=m;l=c("core-util-is");l.inherits=c("inherits");var f=c("./_stream_readable"),d=c("./_stream_writable");l.inherits(m,f);c=k(d.prototype);for(l=0;l<c.length;l++)k=c[l],m.prototype[k]||(m.prototype[k]=d.prototype[k]);Object.defineProperty(m.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&this._readableState.destroyed&&this._writableState.destroyed},set:function(a){void 0!==this._readableState&&
void 0!==this._writableState&&(this._readableState.destroyed=a,this._writableState.destroyed=a)}});m.prototype._destroy=function(a,d){this.push(null);this.end();h(d,a)}},{"./_stream_readable":26,"./_stream_writable":28,"core-util-is":4,inherits:10,"process-nextick-args":21}],25:[function(c,l,k){function m(c){if(!(this instanceof m))return new m(c);a.call(this,c)}l.exports=m;var a=c("./_stream_transform");l=c("core-util-is");l.inherits=c("inherits");l.inherits(m,a);m.prototype._transform=function(a,
c,f){f(null,a)}},{"./_stream_transform":27,"core-util-is":4,inherits:10}],26:[function(c,l,k){(function(m,a){function k(a,b){I=I||c("./_stream_duplex");a=a||{};this.objectMode=!!a.objectMode;b instanceof I&&(this.objectMode=this.objectMode||!!a.readableObjectMode);var d=a.highWaterMark,e=this.objectMode?16:16384;this.highWaterMark=d||0===d?d:e;this.highWaterMark=Math.floor(this.highWaterMark);this.buffer=new q;this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.reading=this.endEmitted=
this.ended=!1;this.sync=!0;this.destroyed=this.resumeScheduled=this.readableListening=this.emittedReadable=this.needReadable=!1;this.defaultEncoding=a.defaultEncoding||"utf8";this.awaitDrain=0;this.readingMore=!1;this.encoding=this.decoder=null;a.encoding&&(n||(n=c("string_decoder/").StringDecoder),this.decoder=new n(a.encoding),this.encoding=a.encoding)}function h(a){if(I=I||c("./_stream_duplex"),!(this instanceof h))return new h(a);this._readableState=new k(a,this);this.readable=!0;a&&("function"==
typeof a.read&&(this._read=a.read),"function"==typeof a.destroy&&(this._destroy=a.destroy));F.call(this)}function f(a,b,c,g,f){var A,n,h=a._readableState;null===b?(h.reading=!1,function(a,b){if(!b.ended){if(b.decoder){var d=b.decoder.end();d&&d.length&&(b.buffer.push(d),b.length+=b.objectMode?1:d.length)}b.ended=!0;e(a)}}(a,h)):(f||(A=function(a,b){var d;var c=b;D.isBuffer(c)||c instanceof B||"string"==typeof b||void 0===b||a.objectMode||(d=new TypeError("Invalid non-string/buffer chunk"));return d}(h,
b)),A?a.emit("error",A):h.objectMode||b&&0<b.length?("string"==typeof b||h.objectMode||Object.getPrototypeOf(b)===D.prototype||(n=b,b=D.from(n)),g?h.endEmitted?a.emit("error",Error("stream.unshift() after end event")):d(a,h,b,!0):h.ended?a.emit("error",Error("stream.push() after EOF")):(h.reading=!1,h.decoder&&!c?(b=h.decoder.write(b),h.objectMode||0!==b.length?d(a,h,b,!1):w(a,h)):d(a,h,b,!1))):g||(h.reading=!1));return!h.ended&&(h.needReadable||h.length<h.highWaterMark||0===h.length)}function d(a,
b,d,c){b.flowing&&0===b.length&&!b.sync?(a.emit("data",d),a.read(0)):(b.length+=b.objectMode?1:d.length,c?b.buffer.unshift(d):b.buffer.push(d),b.needReadable&&e(a));w(a,b)}function x(a,b){return 0>=a||0===b.length&&b.ended?0:b.objectMode?1:a!=a?b.flowing&&b.length?b.buffer.head.data.length:b.length:(a>b.highWaterMark&&(b.highWaterMark=(8388608<=(d=a)?d=8388608:(d--,d|=d>>>1,d|=d>>>2,d|=d>>>4,d|=d>>>8,d|=d>>>16,d++),d)),a<=b.length?a:b.ended?b.length:(b.needReadable=!0,0));var d}function e(a){var b=
a._readableState;b.needReadable=!1;b.emittedReadable||(g("emitReadable",b.flowing),b.emittedReadable=!0,b.sync?C(r,a):r(a))}function r(a){g("emit readable");a.emit("readable");y(a)}function w(a,b){b.readingMore||(b.readingMore=!0,C(v,a,b))}function v(a,b){for(var d=b.length;!b.reading&&!b.flowing&&!b.ended&&b.length<b.highWaterMark&&(g("maybeReadMore read 0"),a.read(0),d!==b.length);)d=b.length;b.readingMore=!1}function b(a){g("readable nexttick read 0");a.read(0)}function u(a,b){b.reading||(g("resume read 0"),
a.read(0));b.resumeScheduled=!1;b.awaitDrain=0;a.emit("resume");y(a);b.flowing&&!b.reading&&a.read(0)}function y(a){var b=a._readableState;for(g("flow",b.flowing);b.flowing&&null!==a.read(););}function z(a,b){return 0===b.length?null:(b.objectMode?d=b.buffer.shift():!a||a>=b.length?(d=b.decoder?b.buffer.join(""):1===b.buffer.length?b.buffer.head.data:b.buffer.concat(b.length),b.buffer.clear()):d=function(a,b,d){var c;a<b.head.data.length?(c=b.head.data.slice(0,a),b.head.data=b.head.data.slice(a)):
c=a===b.head.data.length?b.shift():d?function(a,b){var d=b.head,c=1,e=d.data;for(a-=e.length;d=d.next;){var g=d.data,f=a>g.length?g.length:a;if(f===g.length?e+=g:e+=g.slice(0,a),0===(a-=f)){f===g.length?(++c,d.next?b.head=d.next:b.head=b.tail=null):(b.head=d,d.data=g.slice(f));break}++c}return b.length-=c,e}(a,b):function(a,b){var d=D.allocUnsafe(a),c=b.head,e=1;c.data.copy(d);for(a-=c.data.length;c=c.next;){var g=c.data,f=a>g.length?g.length:a;if(g.copy(d,d.length-a,0,f),0===(a-=f)){f===g.length?
(++e,c.next?b.head=c.next:b.head=b.tail=null):(b.head=c,c.data=g.slice(f));break}++e}return b.length-=e,d}(a,b);return c}(a,b.buffer,b.decoder),d);var d}function G(a){var b=a._readableState;if(0<b.length)throw Error('"endReadable()" called on non-empty stream');b.endEmitted||(b.ended=!0,C(J,b,a))}function J(a,b){a.endEmitted||0!==a.length||(a.endEmitted=!0,b.readable=!1,b.emit("end"))}function H(a,b){for(var d=0,c=a.length;d<c;d++)if(a[d]===b)return d;return-1}var C=c("process-nextick-args");l.exports=
h;var I,E=c("isarray");h.ReadableState=k;c("events").EventEmitter;var F=c("./internal/streams/stream"),D=c("safe-buffer").Buffer,B=a.Uint8Array||function(){},K=c("core-util-is");K.inherits=c("inherits");var L=c("util"),g=void 0;g=L&&L.debuglog?L.debuglog("stream"):function(){};var n,q=c("./internal/streams/BufferList");L=c("./internal/streams/destroy");K.inherits(h,F);var M=["error","close","destroy","pause","resume"];Object.defineProperty(h.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&
this._readableState.destroyed},set:function(a){this._readableState&&(this._readableState.destroyed=a)}});h.prototype.destroy=L.destroy;h.prototype._undestroy=L.undestroy;h.prototype._destroy=function(a,b){this.push(null);b(a)};h.prototype.push=function(a,b){var d,c=this._readableState;return c.objectMode?d=!0:"string"==typeof a&&((b=b||c.defaultEncoding)!==c.encoding&&(a=D.from(a,b),b=""),d=!0),f(this,a,b,!1,d)};h.prototype.unshift=function(a){return f(this,a,null,!0,!1)};h.prototype.isPaused=function(){return!1===
this._readableState.flowing};h.prototype.setEncoding=function(a){return n||(n=c("string_decoder/").StringDecoder),this._readableState.decoder=new n(a),this._readableState.encoding=a,this};h.prototype.read=function(a){g("read",a);a=parseInt(a,10);var b=this._readableState,d=a;if(0!==a&&(b.emittedReadable=!1),0===a&&b.needReadable&&(b.length>=b.highWaterMark||b.ended))return g("read: emitReadable",b.length,b.ended),0===b.length&&b.ended?G(this):e(this),null;if(0===(a=x(a,b))&&b.ended)return 0===b.length&&
G(this),null;var c,f=b.needReadable;return g("need readable",f),(0===b.length||b.length-a<b.highWaterMark)&&g("length less than watermark",f=!0),b.ended||b.reading?g("reading or ended",!1):f&&(g("do read"),b.reading=!0,b.sync=!0,0===b.length&&(b.needReadable=!0),this._read(b.highWaterMark),b.sync=!1,b.reading||(a=x(d,b))),null===(c=0<a?z(a,b):null)?(b.needReadable=!0,a=0):b.length-=a,0===b.length&&(b.ended||(b.needReadable=!0),d!==a&&b.ended&&G(this)),null!==c&&this.emit("data",c),c};h.prototype._read=
function(a){this.emit("error",Error("_read() is not implemented"))};h.prototype.pipe=function(a,b){function d(b,m){g("onunpipe");b===k&&m&&!1===m.hasUnpiped&&(m.hasUnpiped=!0,g("cleanup"),a.removeListener("close",h),a.removeListener("finish",n),a.removeListener("drain",q),a.removeListener("error",f),a.removeListener("unpipe",d),k.removeListener("end",c),k.removeListener("end",B),k.removeListener("data",e),D=!0,!p.awaitDrain||a._writableState&&!a._writableState.needDrain||q())}function c(){g("onend");
a.end()}function e(b){g("ondata");u=!1;!1!==a.write(b)||u||((1===p.pipesCount&&p.pipes===a||1<p.pipesCount&&-1!==H(p.pipes,a))&&!D&&(g("false write response, pause",k._readableState.awaitDrain),k._readableState.awaitDrain++,u=!0),k.pause())}function f(b){g("onerror",b);B();a.removeListener("error",f);0===a.listeners("error").length&&a.emit("error",b)}function h(){a.removeListener("finish",n);B()}function n(){g("onfinish");a.removeListener("close",h);B()}function B(){g("unpipe");k.unpipe(a)}var k=
this,p=this._readableState;switch(p.pipesCount){case 0:p.pipes=a;break;case 1:p.pipes=[p.pipes,a];break;default:p.pipes.push(a)}p.pipesCount+=1;g("pipe count=%d opts=%j",p.pipesCount,b);var l=b&&!1===b.end||a===m.stdout||a===m.stderr?B:c;p.endEmitted?C(l):k.once("end",l);a.on("unpipe",d);var K,q=(K=k,function(){var a=K._readableState;g("pipeOnDrain",a.awaitDrain);a.awaitDrain&&a.awaitDrain--;0===a.awaitDrain&&K.listeners("data").length&&(a.flowing=!0,y(K))});a.on("drain",q);var D=!1,u=!1;return k.on("data",
e),function(a,b,d){if("function"==typeof a.prependListener)return a.prependListener(b,d);a._events&&a._events[b]?E(a._events[b])?a._events[b].unshift(d):a._events[b]=[d,a._events[b]]:a.on(b,d)}(a,"error",f),a.once("close",h),a.once("finish",n),a.emit("pipe",k),p.flowing||(g("pipe resume"),k.resume()),a};h.prototype.unpipe=function(a){var b=this._readableState,d={hasUnpiped:!1};if(0===b.pipesCount)return this;if(1===b.pipesCount)return a&&a!==b.pipes?this:(a||(a=b.pipes),b.pipes=null,b.pipesCount=
0,b.flowing=!1,a&&a.emit("unpipe",this,d),this);if(!a){a=b.pipes;var c=b.pipesCount;b.pipes=null;b.pipesCount=0;b.flowing=!1;for(b=0;b<c;b++)a[b].emit("unpipe",this,d);return this}c=H(b.pipes,a);return-1===c?this:(b.pipes.splice(c,1),--b.pipesCount,1===b.pipesCount&&(b.pipes=b.pipes[0]),a.emit("unpipe",this,d),this)};h.prototype.on=function(a,d){var c=F.prototype.on.call(this,a,d);if("data"===a)!1!==this._readableState.flowing&&this.resume();else if("readable"===a){var g=this._readableState;g.endEmitted||
g.readableListening||(g.readableListening=g.needReadable=!0,g.emittedReadable=!1,g.reading?g.length&&e(this):C(b,this))}return c};h.prototype.addListener=h.prototype.on;h.prototype.resume=function(){var a=this._readableState;return a.flowing||(g("resume"),a.flowing=!0,a.resumeScheduled||(a.resumeScheduled=!0,C(u,this,a))),this};h.prototype.pause=function(){return g("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(g("pause"),this._readableState.flowing=!1,this.emit("pause")),
this};h.prototype.wrap=function(a){var b=this._readableState,d=!1,c=this,e;for(e in a.on("end",function(){if(g("wrapped end"),b.decoder&&!b.ended){var a=b.decoder.end();a&&a.length&&c.push(a)}c.push(null)}),a.on("data",function(e){(g("wrapped data"),b.decoder&&(e=b.decoder.write(e)),b.objectMode&&null==e)||(b.objectMode||e&&e.length)&&(c.push(e)||(d=!0,a.pause()))}),a)void 0===this[e]&&"function"==typeof a[e]&&(this[e]=function(b){return function(){return a[b].apply(a,arguments)}}(e));for(e=0;e<M.length;e++)a.on(M[e],
c.emit.bind(c,M[e]));return c._read=function(b){g("wrapped _read",b);d&&(d=!1,a.resume())},c};h._fromList=z}).call(this,c("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./_stream_duplex":24,"./internal/streams/BufferList":29,"./internal/streams/destroy":30,"./internal/streams/stream":31,_process:22,"core-util-is":4,events:8,inherits:10,isarray:12,"process-nextick-args":21,"safe-buffer":36,"string_decoder/":38,util:2}],27:[function(c,
l,k){function m(a){this.afterTransform=function(d,c){var e=a._transformState;e.transforming=!1;var f=e.writecb;f?(e.writechunk=null,e.writecb=null,null!=c&&a.push(c),f(d),e=a._readableState,e.reading=!1,(e.needReadable||e.length<e.highWaterMark)&&a._read(e.highWaterMark),e=void 0):e=a.emit("error",Error("write callback called multiple times"));return e};this.transforming=this.needTransform=!1;this.writeencoding=this.writechunk=this.writecb=null}function a(c){if(!(this instanceof a))return new a(c);
h.call(this,c);this._transformState=new m(this);var d=this;this._readableState.needReadable=!0;this._readableState.sync=!1;c&&("function"==typeof c.transform&&(this._transform=c.transform),"function"==typeof c.flush&&(this._flush=c.flush));this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(a,c){p(d,a,c)}):p(d)})}function p(a,d,c){if(d)return a.emit("error",d);null!=c&&a.push(c);d=a._transformState;if(a._writableState.length)throw Error("Calling transform done when ws.length != 0");
if(d.transforming)throw Error("Calling transform done when still transforming");return a.push(null)}l.exports=a;var h=c("./_stream_duplex");l=c("core-util-is");l.inherits=c("inherits");l.inherits(a,h);a.prototype.push=function(a,d){return this._transformState.needTransform=!1,h.prototype.push.call(this,a,d)};a.prototype._transform=function(a,d,c){throw Error("_transform() is not implemented");};a.prototype._write=function(a,d,c){var e=this._transformState;(e.writecb=c,e.writechunk=a,e.writeencoding=
d,e.transforming)||(a=this._readableState,(e.needTransform||a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark))};a.prototype._read=function(a){a=this._transformState;null!==a.writechunk&&a.writecb&&!a.transforming?(a.transforming=!0,this._transform(a.writechunk,a.writeencoding,a.afterTransform)):a.needTransform=!0};a.prototype._destroy=function(a,d){var c=this;h.prototype._destroy.call(this,a,function(a){d(a);c.emit("close")})}},{"./_stream_duplex":24,"core-util-is":4,inherits:10}],
28:[function(c,l,k){(function(k,a){function m(a){var b=this;this.entry=this.next=null;this.finish=function(){var d=b.entry;for(b.entry=null;d;){var c=d.callback;a.pendingcb--;c(void 0);d=d.next}a.corkedRequestsFree?a.corkedRequestsFree.next=b:a.corkedRequestsFree=b;!0}}function h(){}function f(a,d){y=y||c("./_stream_duplex");a=a||{};this.objectMode=!!a.objectMode;d instanceof y&&(this.objectMode=this.objectMode||!!a.writableObjectMode);var f=a.highWaterMark,h=this.objectMode?16:16384;this.highWaterMark=
f||0===f?f:h;this.highWaterMark=Math.floor(this.highWaterMark);this.destroyed=this.finished=this.ended=this.ending=this.needDrain=this.finalCalled=!1;this.decodeStrings=!1!==a.decodeStrings;this.defaultEncoding=a.defaultEncoding||"utf8";this.length=0;this.writing=!1;this.corked=0;this.sync=!0;this.bufferProcessing=!1;this.onwrite=function(a){var c=d._writableState,g=c.sync,f=c.writecb;(h=c,h.writing=!1,h.writecb=null,h.length-=h.writelen,h.writelen=0,a)?(h=d,--c.pendingcb,g?(u(f,a),u(b,h,c),h._writableState.errorEmitted=
!0,h.emit("error",a)):(f(a),h._writableState.errorEmitted=!0,h.emit("error",a),b(h,c))):((h=w(c))||c.corked||c.bufferProcessing||!c.bufferedRequest||r(d,c),g?z(e,d,c,h,f):e(d,c,h,f));var h;!0};this.writecb=null;this.writelen=0;this.lastBufferedRequest=this.bufferedRequest=null;this.pendingcb=0;this.errorEmitted=this.prefinished=!1;this.bufferedRequestCount=0;this.corkedRequestsFree=new m(this)}function d(a){if(y=y||c("./_stream_duplex"),!(E.call(d,this)||this instanceof y))return new d(a);this._writableState=
new f(a,this);this.writable=!0;a&&("function"==typeof a.write&&(this._write=a.write),"function"==typeof a.writev&&(this._writev=a.writev),"function"==typeof a.destroy&&(this._destroy=a.destroy),"function"==typeof a["final"]&&(this._final=a["final"]));H.call(this)}function x(a,b,d,c,e,f,h){b.writelen=c;b.writecb=h;b.writing=!0;b.sync=!0;d?a._writev(e,b.onwrite):a._write(e,f,b.onwrite);b.sync=!1}function e(a,d,c,e){c||0===d.length&&d.needDrain&&(d.needDrain=!1,a.emit("drain"));d.pendingcb--;e();b(a,
d)}function r(a,b){b.bufferProcessing=!0;var d=b.bufferedRequest;if(a._writev&&d&&d.next){var c=Array(b.bufferedRequestCount),e=b.corkedRequestsFree;e.entry=d;for(var f=0,h=!0;d;)c[f]=d,d.isBuf||(h=!1),d=d.next,f+=1;c.allBuffers=h;x(a,b,!0,b.length,c,"",e.finish);b.pendingcb++;b.lastBufferedRequest=null;e.next?(b.corkedRequestsFree=e.next,e.next=null):b.corkedRequestsFree=new m(b)}else{for(;d&&(c=d.chunk,x(a,b,!1,b.objectMode?1:c.length,c,d.encoding,d.callback),d=d.next,!b.writing););null===d&&(b.lastBufferedRequest=
null)}b.bufferedRequestCount=0;b.bufferedRequest=d;b.bufferProcessing=!1}function w(a){return a.ending&&0===a.length&&null===a.bufferedRequest&&!a.finished&&!a.writing}function v(a,d){a._final(function(c){d.pendingcb--;c&&a.emit("error",c);d.prefinished=!0;a.emit("prefinish");b(a,d)})}function b(a,b){var d=w(b);return d&&(b.prefinished||b.finalCalled||("function"==typeof a._final?(b.pendingcb++,b.finalCalled=!0,u(v,a,b)):(b.prefinished=!0,a.emit("prefinish"))),0===b.pendingcb&&(b.finished=!0,a.emit("finish"))),
d}var u=c("process-nextick-args");l.exports=d;var y,z=!k.browser&&-1<["v0.10","v0.9."].indexOf(k.version.slice(0,5))?setImmediate:u;d.WritableState=f;var G=c("core-util-is");G.inherits=c("inherits");var J={deprecate:c("util-deprecate")},H=c("./internal/streams/stream"),C=c("safe-buffer").Buffer,I=a.Uint8Array||function(){},E,F=c("./internal/streams/destroy");$jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();G.inherits(d,H);f.prototype.getBuffer=
function(){for(var a=this.bufferedRequest,b=[];a;)b.push(a),a=a.next;return b};(function(){try{Object.defineProperty(f.prototype,"buffer",{get:J.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch(D){}})();"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(E=Function.prototype[Symbol.hasInstance],Object.defineProperty(d,Symbol.hasInstance,{value:function(a){return!!E.call(this,
a)||a&&a._writableState instanceof f}})):E=function(a){return a instanceof this};d.prototype.pipe=function(){this.emit("error",Error("Cannot pipe, not readable"))};d.prototype.write=function(a,b,d){var c,e,f,k,m,p;var l=this._writableState;var B=!1,z=(c=a,(C.isBuffer(c)||c instanceof I)&&!l.objectMode);z&&!C.isBuffer(a)&&(e=a,a=C.from(e));"function"==typeof b&&(d=b,b=null);z?b="buffer":b||(b=l.defaultEncoding);"function"!=typeof d&&(d=h);if(l.ended)l=d,d=Error("write after end"),this.emit("error",
d),u(l,d);else if(z||(k=d,m=!0,p=!1,null===(f=a)?p=new TypeError("May not write null values to stream"):"string"==typeof f||void 0===f||l.objectMode||(p=new TypeError("Invalid non-string/buffer chunk")),p&&(this.emit("error",p),u(k,p),m=!1),m))l.pendingcb++,B=z,B||(c=a,l.objectMode||!1===l.decodeStrings||"string"!=typeof c||(c=C.from(c,b)),a!==c&&(B=!0,b="buffer",a=c)),e=l.objectMode?1:a.length,l.length+=e,(c=l.length<l.highWaterMark)||(l.needDrain=!0),l.writing||l.corked?(e=l.lastBufferedRequest,
l.lastBufferedRequest={chunk:a,encoding:b,isBuf:B,callback:d,next:null},e?e.next=l.lastBufferedRequest:l.bufferedRequest=l.lastBufferedRequest,l.bufferedRequestCount+=1):x(this,l,!1,e,a,b,d),B=c;return B};d.prototype.cork=function(){this._writableState.corked++};d.prototype.uncork=function(){var a=this._writableState;a.corked&&(a.corked--,a.writing||a.corked||a.finished||a.bufferProcessing||!a.bufferedRequest||r(this,a))};d.prototype.setDefaultEncoding=function(a){if("string"==typeof a&&(a=a.toLowerCase()),
!(-1<"hex utf8 utf-8 ascii binary base64 ucs2 ucs-2 utf16le utf-16le raw".split(" ").indexOf((a+"").toLowerCase())))throw new TypeError("Unknown encoding: "+a);return this._writableState.defaultEncoding=a,this};d.prototype._write=function(a,b,d){d(Error("_write() is not implemented"))};d.prototype._writev=null;d.prototype.end=function(a,d,c){var e=this._writableState;"function"==typeof a?(c=a,a=null,d=null):"function"==typeof d&&(c=d,d=null);null!=a&&this.write(a,d);e.corked&&(e.corked=1,this.uncork());
e.ending||e.finished||(a=c,e.ending=!0,b(this,e),a&&(e.finished?u(a):this.once("finish",a)),e.ended=!0,this.writable=!1)};Object.defineProperty(d.prototype,"destroyed",{get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(a){this._writableState&&(this._writableState.destroyed=a)}});d.prototype.destroy=F.destroy;d.prototype._undestroy=F.undestroy;d.prototype._destroy=function(a,b){this.end();b(a)}}).call(this,c("_process"),"undefined"!=typeof global?global:
"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./_stream_duplex":24,"./internal/streams/destroy":30,"./internal/streams/stream":31,_process:22,"core-util-is":4,inherits:10,"process-nextick-args":21,"safe-buffer":36,"util-deprecate":39}],29:[function(c,l,k){var m=c("safe-buffer").Buffer;l.exports=function(){function a(){if(!(this instanceof a))throw new TypeError("Cannot call a class as a function");!0;this.tail=this.head=null;this.length=0}return a.prototype.push=function(a){a=
{data:a,next:null};0<this.length?this.tail.next=a:this.head=a;this.tail=a;++this.length},a.prototype.unshift=function(a){a={data:a,next:this.head};0===this.length&&(this.tail=a);this.head=a;++this.length},a.prototype.shift=function(){if(0!==this.length){var a=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,a}},a.prototype.clear=function(){this.head=this.tail=null;this.length=0},a.prototype.join=function(a){if(0===this.length)return"";for(var c=
this.head,f=""+c.data;c=c.next;)f+=a+c.data;return f},a.prototype.concat=function(a){if(0===this.length)return m.alloc(0);if(1===this.length)return this.head.data;for(var c,f,d=m.allocUnsafe(a>>>0),k=this.head,e=0;k;)a=k.data,c=d,f=e,a.copy(c,f),e+=k.data.length,k=k.next;return d},a}()},{"safe-buffer":36}],30:[function(c,l,k){function m(a,c){a.emit("error",c)}var a=c("process-nextick-args");l.exports={destroy:function(c,h){var f=this,d=this._writableState&&this._writableState.destroyed;this._readableState&&
this._readableState.destroyed||d?h?h(c):!c||this._writableState&&this._writableState.errorEmitted||a(m,this,c):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(c||null,function(d){!h&&d?(a(m,f,d),f._writableState&&(f._writableState.errorEmitted=!0)):h&&h(d)}))},undestroy:function(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=
!1);this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}}},{"process-nextick-args":21}],31:[function(c,l,k){l.exports=c("events").EventEmitter},{events:8}],32:[function(c,l,k){l.exports=c("./readable").PassThrough},{"./readable":33}],33:[function(c,l,k){(k=l.exports=c("./lib/_stream_readable.js")).Stream=k;k.Readable=k;k.Writable=c("./lib/_stream_writable.js");k.Duplex=
c("./lib/_stream_duplex.js");k.Transform=c("./lib/_stream_transform.js");k.PassThrough=c("./lib/_stream_passthrough.js")},{"./lib/_stream_duplex.js":24,"./lib/_stream_passthrough.js":25,"./lib/_stream_readable.js":26,"./lib/_stream_transform.js":27,"./lib/_stream_writable.js":28}],34:[function(c,l,k){l.exports=c("./readable").Transform},{"./readable":33}],35:[function(c,l,k){l.exports=c("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":28}],36:[function(c,l,k){function m(a,d){for(var c in a)d[c]=
a[c]}function a(a,d,c){return h(a,d,c)}var p=c("buffer"),h=p.Buffer;h.from&&h.alloc&&h.allocUnsafe&&h.allocUnsafeSlow?l.exports=p:(m(p,k),k.Buffer=a);m(h,a);a.from=function(a,d,c){if("number"==typeof a)throw new TypeError("Argument must not be a number");return h(a,d,c)};a.alloc=function(a,d,c){if("number"!=typeof a)throw new TypeError("Argument must be a number");a=h(a);return void 0!==d?"string"==typeof c?a.fill(d,c):a.fill(d):a.fill(0),a};a.allocUnsafe=function(a){if("number"!=typeof a)throw new TypeError("Argument must be a number");
return h(a)};a.allocUnsafeSlow=function(a){if("number"!=typeof a)throw new TypeError("Argument must be a number");return p.SlowBuffer(a)}},{buffer:3}],37:[function(c,l,k){function m(){a.call(this)}l.exports=m;var a=c("events").EventEmitter;c("inherits")(m,a);m.Readable=c("readable-stream/readable.js");m.Writable=c("readable-stream/writable.js");m.Duplex=c("readable-stream/duplex.js");m.Transform=c("readable-stream/transform.js");m.PassThrough=c("readable-stream/passthrough.js");m.Stream=m;m.prototype.pipe=
function(c,h){function f(a){c.writable&&!1===c.write(a)&&p.pause&&p.pause()}function d(){p.readable&&p.resume&&p.resume()}function k(){b||(b=!0,c.end())}function e(){b||(b=!0,"function"==typeof c.destroy&&c.destroy())}function m(b){if(l(),0===a.listenerCount(this,"error"))throw b;}function l(){p.removeListener("data",f);c.removeListener("drain",d);p.removeListener("end",k);p.removeListener("close",e);p.removeListener("error",m);c.removeListener("error",m);p.removeListener("end",l);p.removeListener("close",
l);c.removeListener("close",l)}var p=this;p.on("data",f);c.on("drain",d);c._isStdio||h&&!1===h.end||(p.on("end",k),p.on("close",e));var b=!1;return p.on("error",m),c.on("error",m),p.on("end",l),p.on("close",l),c.on("close",l),c.emit("pipe",p),c}},{events:8,inherits:10,"readable-stream/duplex.js":23,"readable-stream/passthrough.js":32,"readable-stream/readable.js":33,"readable-stream/transform.js":34,"readable-stream/writable.js":35}],38:[function(c,l,k){function m(a){switch(this.encoding=function(a){var b=
function(a){if(!a)return"utf8";for(var b;;)switch(a){case "utf8":case "utf-8":return"utf8";case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return"utf16le";case "latin1":case "binary":return"latin1";case "base64":case "ascii":case "hex":return a;default:if(b)return;a=(""+a).toLowerCase();b=!0}}(a);if("string"!=typeof b&&(w.isEncoding===v||!v(a)))throw Error("Unknown encoding: "+a);return b||a}(a),this.encoding){case "utf16le":this.text=h;this.end=f;a=4;break;case "utf8":this.fillLast=p;a=4;
break;case "base64":this.text=d;this.end=x;a=3;break;default:return this.write=e,void(this.end=r)}this.lastTotal=this.lastNeed=0;this.lastChar=w.allocUnsafe(a)}function a(a){return 127>=a?0:6==a>>5?2:14==a>>4?3:30==a>>3?4:-1}function p(a){var b=this.lastTotal-this.lastNeed;a:if(128!=(192&a[0]))var d=(this.lastNeed=0,"\ufffd".repeat(b));else{if(1<this.lastNeed&&1<a.length){if(128!=(192&a[1])){d=(this.lastNeed=1,"\ufffd".repeat(b+1));break a}if(2<this.lastNeed&&2<a.length&&128!=(192&a[2])){d=(this.lastNeed=
2,"\ufffd".repeat(b+2));break a}}d=void 0}return void 0!==d?d:this.lastNeed<=a.length?(a.copy(this.lastChar,b,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(a.copy(this.lastChar,b,0,a.length),void(this.lastNeed-=a.length))}function h(a,d){if(0==(a.length-d)%2){var b=a.toString("utf16le",d);if(b){var c=b.charCodeAt(b.length-1);if(55296<=c&&56319>=c)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=a[a.length-2],this.lastChar[1]=a[a.length-1],b.slice(0,-1)}return b}return this.lastNeed=
1,this.lastTotal=2,this.lastChar[0]=a[a.length-1],a.toString("utf16le",d,a.length-1)}function f(a){a=a&&a.length?this.write(a):"";return this.lastNeed?a+this.lastChar.toString("utf16le",0,this.lastTotal-this.lastNeed):a}function d(a,d){var b=(a.length-d)%3;return 0===b?a.toString("base64",d):(this.lastNeed=3-b,this.lastTotal=3,1===b?this.lastChar[0]=a[a.length-1]:(this.lastChar[0]=a[a.length-2],this.lastChar[1]=a[a.length-1]),a.toString("base64",d,a.length-b))}function x(a){a=a&&a.length?this.write(a):
"";return this.lastNeed?a+this.lastChar.toString("base64",0,3-this.lastNeed):a}function e(a){return a.toString(this.encoding)}function r(a){return a&&a.length?this.write(a):""}var w=c("safe-buffer").Buffer,v=w.isEncoding||function(a){switch((a=""+a)&&a.toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":case "raw":return!0;default:return!1}};k.StringDecoder=m;m.prototype.write=function(a){if(0===a.length)return"";
var b;if(this.lastNeed){if(void 0===(b=this.fillLast(a)))return"";var d=this.lastNeed;this.lastNeed=0}else d=0;return d<a.length?b?b+this.text(a,d):this.text(a,d):b||""};m.prototype.end=function(a){a=a&&a.length?this.write(a):"";return this.lastNeed?a+"\ufffd".repeat(this.lastTotal-this.lastNeed):a};m.prototype.text=function(b,d){var c=b.length-1;if(c<d)c=0;else{var e=a(b[c]);c=0<=e?(0<e&&(this.lastNeed=e-1),e):--c<d?0:0<=(e=a(b[c]))?(0<e&&(this.lastNeed=e-2),e):--c<d?0:0<=(e=a(b[c]))?(0<e&&(2===
e?e=0:this.lastNeed=e-3),e):0}if(!this.lastNeed)return b.toString("utf8",d);this.lastTotal=c;e=b.length-(c-this.lastNeed);return b.copy(this.lastChar,0,e),b.toString("utf8",d,e)};m.prototype.fillLast=function(a){if(this.lastNeed<=a.length)return a.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);a.copy(this.lastChar,this.lastTotal-this.lastNeed,0,a.length);this.lastNeed-=a.length}},{"safe-buffer":36}],39:[function(c,l,k){(function(c){function a(a){try{if(!c.localStorage)return!1}catch(h){return!1}a=
c.localStorage[a];return null!=a&&"true"===String(a).toLowerCase()}l.exports=function(c,h){if(a("noDeprecation"))return c;var f=!1;return function(){if(!f){if(a("throwDeprecation"))throw Error(h);a("traceDeprecation")?console.trace(h):console.warn(h);f=!0}return c.apply(this,arguments)}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],40:[function(c,l,k){arguments[4][10][0].apply(k,arguments)},{dup:10}],41:[function(c,l,k){l.exports=
function(c){return c&&"object"==typeof c&&"function"==typeof c.copy&&"function"==typeof c.fill&&"function"==typeof c.readUInt8}},{}],42:[function(c,l,k){(function(l,a){function m(a,b){var c={seen:[],stylize:f};return 3<=arguments.length&&(c.depth=arguments[2]),4<=arguments.length&&(c.colors=arguments[3]),w(b)?c.showHidden=b:b&&k._extend(c,b),u(c.showHidden)&&(c.showHidden=!1),u(c.depth)&&(c.depth=2),u(c.colors)&&(c.colors=!1),u(c.customInspect)&&(c.customInspect=!0),c.colors&&(c.stylize=h),d(c,a,
c.depth)}function h(a,b){var d=m.styles[b];return d?"\u001b["+m.colors[d][0]+"m"+a+"\u001b["+m.colors[d][1]+"m":a}function f(a,b){return a}function d(a,c,f){if(a.customInspect&&c&&H(c.inspect)&&c.inspect!==k.inspect&&(!c.constructor||c.constructor.prototype!==c)){var g=c.inspect(f,a);return b(g)||(g=d(a,g,f)),g}var h=function(a,d){if(u(d))return a.stylize("undefined","undefined");if(b(d)){var c=""+JSON.stringify(d).replace(/^"|"$/g,"").replace(/'/g,"'").replace(/\\"/g,'"');return a.stylize(c,"string")}if(v(d))return a.stylize(""+
d,"number");if(w(d))return a.stylize(""+d,"boolean");if(null===d)return a.stylize("null","null")}(a,c);if(h)return h;var l;h=Object.keys(c);var m=(l={},h.forEach(function(a,b){l[a]=!0}),l);if(a.showHidden&&(h=Object.getOwnPropertyNames(c)),J(c)&&(0<=h.indexOf("message")||0<=h.indexOf("description")))return x(c);if(0===h.length){if(H(c))return a.stylize("[Function"+(c.name?": "+c.name:"")+"]","special");if(y(c))return a.stylize(RegExp.prototype.toString.call(c),"regexp");if(G(c))return a.stylize(Date.prototype.toString.call(c),
"date");if(J(c))return x(c)}var p="",B=!1,z=["{","}"];(r(c)&&(B=!0,z=["[","]"]),H(c))&&(p=" [Function"+(c.name?": "+c.name:"")+"]");return y(c)&&(p=" "+RegExp.prototype.toString.call(c)),G(c)&&(p=" "+Date.prototype.toUTCString.call(c)),J(c)&&(p=" "+x(c)),0!==h.length||B&&0!=c.length?0>f?y(c)?a.stylize(RegExp.prototype.toString.call(c),"regexp"):a.stylize("[Object]","special"):(a.seen.push(c),g=B?function(a,b,d,c,g){for(var f=[],h=0,k=b.length;h<k;++h)Object.prototype.hasOwnProperty.call(b,String(h))?
f.push(e(a,b,d,c,String(h),!0)):f.push("");return g.forEach(function(g){g.match(/^\d+$/)||f.push(e(a,b,d,c,g,!0))}),f}(a,c,f,m,h):h.map(function(b){return e(a,c,f,m,b,B)}),a.seen.pop(),function(a,b,d){return 60<a.reduce(function(a,b){return 0,0<=b.indexOf("")&&0,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0)?d[0]+(""===b?"":b+"")+" "+a.join(",")+" "+d[1]:d[0]+b+" "+a.join(", ")+" "+d[1]}(g,p,z)):z[0]+p+z[1]}function x(a){return"["+Error.prototype.toString.call(a)+"]"}function e(a,b,c,e,f,h){var g,
k,l;if((l=Object.getOwnPropertyDescriptor(b,f)||{value:b[f]}).get?k=l.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):l.set&&(k=a.stylize("[Setter]","special")),Object.prototype.hasOwnProperty.call(e,f)||(g="["+f+"]"),k||(0>a.seen.indexOf(l.value)?-1<(k=null===c?d(a,l.value,null):d(a,l.value,c-1)).indexOf("")&&(k=h?k.split("").map(function(a){return"  "+a}).join("").substr(2):""+k.split("").map(function(a){return"   "+a}).join("")):k=a.stylize("[Circular]","special")),u(g)){if(h&&
f.match(/^\d+$/))return k;(g=JSON.stringify(""+f)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"'").replace(/\\"/g,'"').replace(/(^"|"$)/g,""),g=a.stylize(g,"string"))}return g+": "+k}function r(a){return Array.isArray(a)}function w(a){return"boolean"==typeof a}function v(a){return"number"==typeof a}function b(a){return"string"==typeof a}function u(a){return void 0===a}function y(a){return z(a)&&"[object RegExp]"===Object.prototype.toString.call(a)}
function z(a){return"object"==typeof a&&null!==a}function G(a){return z(a)&&"[object Date]"===Object.prototype.toString.call(a)}function J(a){return z(a)&&("[object Error]"===Object.prototype.toString.call(a)||a instanceof Error)}function H(a){return"function"==typeof a}function C(a){return 10>a?"0"+a.toString(10):a.toString(10)}var I=/%[sdj%]/g;k.format=function(a){if(!b(a)){for(var d=[],c=0;c<arguments.length;c++)d.push(m(arguments[c]));return d.join(" ")}c=1;var e=arguments,f=e.length;d=String(a).replace(I,
function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case "%s":return String(e[c++]);case "%d":return Number(e[c++]);case "%j":try{return JSON.stringify(e[c++])}catch(A){return"[Circular]"}default:return a}});for(var h=e[c];c<f;h=e[++c])null!==h&&z(h)?d+=" "+m(h):d+=" "+h;return d};k.deprecate=function(b,d){if(u(a.process))return function(){return k.deprecate(b,d).apply(this,arguments)};if(!0===l.noDeprecation)return b;var c=!1;return function(){if(!c){if(l.throwDeprecation)throw Error(d);
l.traceDeprecation?console.trace(d):console.error(d);c=!0}return b.apply(this,arguments)}};var E,F={};k.debuglog=function(a){if(u(E)&&(E=l.env.NODE_DEBUG||""),a=a.toUpperCase(),!F[a])if((new RegExp("\b"+a+"\b","i")).test(E)){var b=l.pid;F[a]=function(){var d=k.format.apply(k,arguments);console.error("%s %d: %s",a,b,d)}}else F[a]=function(){};return F[a]};k.inspect=m;m.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],
green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]};m.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"};k.isArray=r;k.isBoolean=w;k.isNull=function(a){return null===a};k.isNullOrUndefined=function(a){return null==a};k.isNumber=v;k.isString=b;k.isSymbol=function(a){return"symbol"==typeof a};k.isUndefined=u;k.isRegExp=y;k.isObject=z;k.isDate=G;k.isError=J;k.isFunction=H;k.isPrimitive=function(a){return null===a||
"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||void 0===a};k.isBuffer=c("./support/isBuffer");var D="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");k.log=function(){var a,b;console.log("%s - %s",(a=new Date,b=[C(a.getHours()),C(a.getMinutes()),C(a.getSeconds())].join(":"),[a.getDate(),D[a.getMonth()],b].join(" ")),k.format.apply(k,arguments))};k.inherits=c("inherits");k._extend=function(a,b){if(!b||!z(b))return a;for(var d=Object.keys(b),c=d.length;c--;)a[d[c]]=
b[d[c]];return a}}).call(this,c("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":41,_process:22,inherits:40}],43:[function(c,l,k){arguments[4][5][0].apply(k,arguments)},{"./lib/uint32":44,"./lib/uint64":45,dup:5}],44:[function(c,l,k){arguments[4][6][0].apply(k,arguments)},{dup:6}],45:[function(c,l,k){arguments[4][7][0].apply(k,arguments)},{dup:7}],46:[function(c,l,k){(function(k){!function(a){function m(){return 2==
arguments.length?(new m(arguments[1])).update(arguments[0]).digest():this instanceof m?void h.call(this,arguments[0]):new m(arguments[0])}function h(a){return this.seed=a instanceof f?a.clone():f(a),this.v1=this.seed.clone().add(v),this.v2=this.seed.clone().add(x),this.v3=this.seed.clone(),this.v4=this.seed.clone().subtract(d),this.total_len=0,this.memsize=0,this.memory=null,this}var f=c("cuint").UINT32;f.prototype.xxh_update=function(a,c){var b,e=x._low,f=x._high;var h=(b=a*e)>>>16;h=h+c*e&65535;
h+=a*f;var k=this._low+(65535&b);h=(k>>>16)+(this._high+(65535&h))<<16|65535&k;f=(h=h<<13|h>>>19)>>>16;h=(b=(k=65535&h)*(e=d._low))>>>16;h+=f*e;h&=65535;h+=k*d._high;this._low=65535&b;this._high=65535&h};var d=f("2654435761"),x=f("2246822519"),e=f("3266489917"),r=f("668265263"),w=f("374761393"),v=d.clone().add(x);m.prototype.init=h;m.prototype.update=function(a){var b="string"==typeof a;if(b){var d=[];b=0;for(var c=a.length;b<c;b++){var e=a.charCodeAt(b);128>e?d.push(e):2048>e?d.push(192|e>>6,128|
63&e):55296>e||57344<=e?d.push(224|e>>12,128|e>>6&63,128|63&e):(b++,e=65536+((1023&e)<<10|1023&a.charCodeAt(b)),d.push(240|e>>18,128|e>>12&63,128|e>>6&63,128|63&e))}a=new Uint8Array(d);b=!1;d=!0}"undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer&&(d=!0,a=new Uint8Array(a));c=0;var f=a.length;e=c+f;if(0==f)return this;if(this.total_len+=f,0==this.memsize&&(this.memory=b?"":d?new Uint8Array(16):new k(16)),16>this.memsize+f)return b?this.memory+=a:d?this.memory.set(a.subarray(0,f),this.memsize):
a.copy(this.memory,this.memsize,0,f),this.memsize+=f,this;0<this.memsize&&(b?this.memory+=a.slice(0,16-this.memsize):d?this.memory.set(a.subarray(0,16-this.memsize),this.memsize):a.copy(this.memory,this.memsize,0,16-this.memsize),f=0,b?(this.v1.xxh_update(this.memory.charCodeAt(f+1)<<8|this.memory.charCodeAt(f),this.memory.charCodeAt(f+3)<<8|this.memory.charCodeAt(f+2)),f+=4,this.v2.xxh_update(this.memory.charCodeAt(f+1)<<8|this.memory.charCodeAt(f),this.memory.charCodeAt(f+3)<<8|this.memory.charCodeAt(f+
2)),f+=4,this.v3.xxh_update(this.memory.charCodeAt(f+1)<<8|this.memory.charCodeAt(f),this.memory.charCodeAt(f+3)<<8|this.memory.charCodeAt(f+2)),f+=4,this.v4.xxh_update(this.memory.charCodeAt(f+1)<<8|this.memory.charCodeAt(f),this.memory.charCodeAt(f+3)<<8|this.memory.charCodeAt(f+2))):(this.v1.xxh_update(this.memory[f+1]<<8|this.memory[f],this.memory[f+3]<<8|this.memory[f+2]),f+=4,this.v2.xxh_update(this.memory[f+1]<<8|this.memory[f],this.memory[f+3]<<8|this.memory[f+2]),f+=4,this.v3.xxh_update(this.memory[f+
1]<<8|this.memory[f],this.memory[f+3]<<8|this.memory[f+2]),f+=4,this.v4.xxh_update(this.memory[f+1]<<8|this.memory[f],this.memory[f+3]<<8|this.memory[f+2])),c+=16-this.memsize,this.memsize=0,b&&(this.memory=""));if(c<=e-16){f=e-16;do b?(this.v1.xxh_update(a.charCodeAt(c+1)<<8|a.charCodeAt(c),a.charCodeAt(c+3)<<8|a.charCodeAt(c+2)),c+=4,this.v2.xxh_update(a.charCodeAt(c+1)<<8|a.charCodeAt(c),a.charCodeAt(c+3)<<8|a.charCodeAt(c+2)),c+=4,this.v3.xxh_update(a.charCodeAt(c+1)<<8|a.charCodeAt(c),a.charCodeAt(c+
3)<<8|a.charCodeAt(c+2)),c+=4,this.v4.xxh_update(a.charCodeAt(c+1)<<8|a.charCodeAt(c),a.charCodeAt(c+3)<<8|a.charCodeAt(c+2))):(this.v1.xxh_update(a[c+1]<<8|a[c],a[c+3]<<8|a[c+2]),c+=4,this.v2.xxh_update(a[c+1]<<8|a[c],a[c+3]<<8|a[c+2]),c+=4,this.v3.xxh_update(a[c+1]<<8|a[c],a[c+3]<<8|a[c+2]),c+=4,this.v4.xxh_update(a[c+1]<<8|a[c],a[c+3]<<8|a[c+2])),c+=4;while(c<=f)}return c<e&&(b?this.memory+=a.slice(c):d?this.memory.set(a.subarray(c,e),this.memsize):a.copy(this.memory,this.memsize,c,e),this.memsize=
e-c),this};m.prototype.digest=function(){var a,c,h=this.memory,k="string"==typeof h,l=0,m=this.memsize,p=new f;for((a=16<=this.total_len?this.v1.rotl(1).add(this.v2.rotl(7).add(this.v3.rotl(12).add(this.v4.rotl(18)))):this.seed.add(w)).add(p.fromNumber(this.total_len));l<=m-4;)k?p.fromBits(h.charCodeAt(l+1)<<8|h.charCodeAt(l),h.charCodeAt(l+3)<<8|h.charCodeAt(l+2)):p.fromBits(h[l+1]<<8|h[l],h[l+3]<<8|h[l+2]),a.add(p.multiply(e)).rotl(17).multiply(r),l+=4;for(;l<m;)p.fromBits(k?h.charCodeAt(l++):h[l++],
0),a.add(p.multiply(w)).rotl(11).multiply(d);return c=a.clone().shiftRight(15),a.xor(c).multiply(x),c=a.clone().shiftRight(13),a.xor(c).multiply(e),c=a.clone().shiftRight(16),a.xor(c),this.init(this.seed),a};"undefined"!=typeof define&&define.amd?define([],function(){return m}):void 0!==l&&l.exports?l.exports=m:a.XXH=m}(this)}).call(this,c("buffer").Buffer)},{buffer:3,cuint:43}],47:[core,{buffer:3,lz4:18}]};t();
