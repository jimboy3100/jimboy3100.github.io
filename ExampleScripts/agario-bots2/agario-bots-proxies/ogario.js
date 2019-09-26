function init(window, ogario, JQuery) {
    window.server = {
        host: 'localhost',
        port: 8083
    }
    class Writer {
        constructor(size){
            this.dataView = new DataView(new ArrayBuffer(size))
            this.byteOffset = 0
        }
        writeUint8(value){
            this.dataView.setUint8(this.byteOffset++, value)
        }
        writeInt32(value){
            this.dataView.setInt32(this.byteOffset, value, true)
            this.byteOffset += 4
        }
        writeUint32(value){
            this.dataView.setUint32(this.byteOffset, value, true)
            this.byteOffset += 4
        }
        writeString(string){
            for(let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
            this.writeUint8(0)
        }
    }
    window.buffers = {
        startBots(url, protocolVersion, clientVersion, userStatus, botsName, botsAmount){
            const writer = new Writer(13 + url.length + botsName.length)
            writer.writeUint8(0)
            writer.writeString(url)
            writer.writeUint32(protocolVersion)
            writer.writeUint32(clientVersion)
            writer.writeUint8(Number(userStatus))
            writer.writeString(botsName)
            writer.writeUint8(botsAmount)
            return writer.dataView.buffer
        },
        mousePosition(x, y){
            const writer = new Writer(9)
            writer.writeUint8(6)
            writer.writeInt32(x)
            writer.writeInt32(y)
            return writer.dataView.buffer
        }
    }
    window.connection = {
        ws: null,
        connect(){
            this.ws = new WebSocket(`ws://${window.server.host}:${window.server.port}`)
            this.ws.binaryType = 'arraybuffer'
            this.ws.onopen = this.onopen.bind(this)
            this.ws.onmessage = this.onmessage.bind(this)
            this.ws.onclose = this.onclose.bind(this)
        },
        send(buffer){
            if(this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
        },
        onopen(){
            document.getElementById('userStatus').style.color = '#00C02E'
            document.getElementById('userStatus').innerText = 'Connected'
            document.getElementById('connect').disabled = true
            document.getElementById('startBots').disabled = false
            document.getElementById('stopBots').disabled = false
        },
        onmessage(message){
            const dataView = new DataView(message.data)
            switch(dataView.getUint8(0)){
                case 0:
                    document.getElementById('startBots').disabled = true
                    document.getElementById('stopBots').disabled = false
                    document.getElementById('startBots').style.display = 'none'
                    document.getElementById('stopBots').style.display = 'inline'
                    document.getElementById('stopBots').innerText = 'Stop Bots'
                    window.user.startedBots = true
                    break
                case 1:
                    document.getElementById('stopBots').disabled = true
                    document.getElementById('stopBots').innerText = 'Stopping Bots...'
                    break
                case 2:
                    document.getElementById('botsAI').style.color = '#DA0A00'
                    document.getElementById('botsAI').innerText = 'Disabled'
                    document.getElementById('startBots').disabled = false
                    document.getElementById('stopBots').disabled = true
                    document.getElementById('startBots').style.display = 'inline'
                    document.getElementById('stopBots').style.display = 'none'
                    document.getElementById('stopBots').innerText = 'Stop Bots'
                    window.user.startedBots = false
                    window.bots.ai = false
                    break
                case 3:
                    toastr["info"]('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots')
                    break
                case 4:
                 //Connected Bot count = getUint8(1)
                //Spawned Bot count = getUint8(2)
                //Server player amount = getUint8(3)
                $('#botCount').html(`${dataView.getUint8(1)}/${dataView.getUint8(2)}/${window.bots.amount}`)
                $('#slots').html(dataView.getUint8(3) + "/200")
                break;
            }
        },
        onclose(){
            document.getElementById('userStatus').style.color = '#DA0A00'
            document.getElementById('userStatus').innerText = 'Disconnected'
            document.getElementById('botsAI').style.color = '#DA0A00'
            document.getElementById('botsAI').innerText = 'Disabled'
            document.getElementById('connect').disabled = false
            document.getElementById('startBots').disabled = true
            document.getElementById('stopBots').disabled = true
            document.getElementById('startBots').style.display = 'inline'
            document.getElementById('stopBots').style.display = 'none'
            window.user.startedBots = false
            window.bots.ai = false
        }
    }
    window.game = {
        url: '',
        protocolVersion: 0,
        clientVersion: 0
    }
    window.user = {
        startedBots: false,
        isAlive: false,
        mouseX: 0,
        mouseY: 0,
        offsetX: 0,
        offsetY: 0,
        macroFeedInterval: null
    }
    window.bots = {
        name: '',
        amount: 0,
        ai: false
    }
    const displayText = {
        pl: {
            start: `Start`,
            settings: `Ustawienia`,
            restoreSettings: `Przywróc ustawienia domyślne`,
            animationGroup: `Animacja`,
            zoomGroup: `Zoom`,
            respGroup: `Odrodzenie`,
            namesGroup: 'Nazwy',
            massGroup: 'Masa',
            skinsGroup: `Skiny`,
            foodGroup: `Pokarm`,
            transparencyGroup: `Przezroczystość / kolory`,
            gridGroup: `Siatka / sektory`,
            miniMapGroup: `Minimapa`,
            helpersGroup: `Wspomagacze`,
            mouseGroup: `Sterowanie myszką`,
            hudGroup: `HUD`,
            chatGroup: `Czat`,
            statsGroup: 'Statystyki',
            extrasGroup: `Dodatkowe`,
            noSkins: `Wyłącz skiny`,
            noNames: 'Wyłącz nazwy',
            noColors: `Wyłącz kolory`,
            showMass: 'Pokaż masę',
            skipStats: `Pomiń statystyki po śmierci`,
            showQuest: `Pokaż zadanie (quest)`,
            autoZoom: `Auto zoom`,
            animation: `Opóźnienie animacji`,
            zoomSpeedValue: `Szybkość zoomu`,
            quickResp: `Szybkie odrodzenie (klawisz)`,
            autoResp: 'Auto odrodzenie',
            autoHideCellsInfo: `Autoukrywanie nazw i masy`,
            autoHideNames: `Autoukrywanie nazw`,
            autoHideMass: `Autoukrywanie masy`,
            autoHideFood: `Autoukrywanie pokarmu (masa)`,
            autoHideFoodOnZoom: `Autoukrywanie pokarmu (zoom)`,
            optimizedNames: `Zoptymalizowane nazwy`,
            hideMyName: `Ukryj własną nazwę`,
            hideTeammatesNames: `Ukryj nazwy graczy teamu`,
            optimizedMass: `Zoptymalizowana masa (+/-2%)`,
            shortMass: `Skrócona masa (k)`,
            virMassShots: `Licznik strzałów (wirusy)`,
            hideMyMass: `Ukryj własną masę`,
            hideEnemiesMass: 'Ukryj masę przeciwników',
            vanillaSkins: `Podstawowe skiny`,
            customSkins: 'Własne skiny',
            myTransparentSkin: `Mój przezroczysty skin`,
            myCustomColor: `Mój własny kolor`,
            transparentCells: `Przezroczyste kulki`,
            transparentViruses: `Przezroczyste wirusy`,
            transparentSkins: 'Przezroczyste skiny',
            showGrid: `Siatka`,
            showBgSectors: 'Sektory w tle',
            showMapBorders: `Granice mapy`,
            showGhostCells: `Duchy kulek`,
            showMiniMap: `Pokaż minimapę`,
            showMiniMapGrid: `Pokaż siatkę minimapy`,
            showMiniMapGuides: 'Pokaż prowadnice na minimapie',
            showMiniMapGhostCells: `Pokaż duchy kulek na minimapie`,
            oneColoredTeammates: `Jednokolorowi gracze`,
            optimizedFood: 'Zoptymalizowany pokarm',
            rainbowFood: `Kolorowy pokarm`,
            oppColors: 'Kolory przeciwników',
            oppRings: `Ringi przeciwników`,
            virColors: `Kolory wirusów`,
            splitRange: `Zasięg podziału`,
            virusesRange: `Zasięg wirusów`,
            textStroke: `Obwódki nazw i masy`,
            namesStroke: `Obwódki nazw`,
            massStroke: `Obwódki masy`,
            cursorTracking: 'Śledzenie kursora',
            teammatesInd: `Wskaźniki graczy teamu`,
            mouseSplit: `LPM - Split myszką`,
            mouseFeed: `PPM - Feed myszką`,
            mouseInvert: `Odwróć klawisze myszki`,
            disableChat: `Wyłącz czat`,
            hideChat: `Ukryj czat`,
            chatSounds: 'Powiadomienia dźwiękowe',
            chatEmoticons: `Emotikony`,
            showChatImages: 'Pokaż obrazki na czacie',
            showChatVideos: 'Pokaż filmiki na czacie',
            showChatBox: `Czatbox zamiast wyskakujących wiadomości`,
            messageSound: `Dźwięk powiadomienia o wiadomości`,
            commandSound: `Dźwięk powiadomienia o komendzie`,
            showTop5: `Pokaż top 5 teamu`,
            showTargeting: 'Pokaż namierzanie',
            showTime: `Pokaż aktualny czas`,
            showLbData: 'Pokaż masę w topce',
            normalLb: `Nagłówek "Topka"`,
            centeredLb: `Wyśrodkowana topka`,
            fpsAtTop: `Statystyki na górze`,
            showStats: `Pokaż statystyki`,
            showStatsMass: `Statystyki: Masa`,
            showStatsSTE: `Statystyki: STE`,
            showStatsN16: `Statystyki: n/16`,
            showStatsFPS: `Statystyki: FPS`,
            blockPopups: `Blokuj popupy (reklamy/sklep/zadanie)`,
            hotkeys: 'Skróty klawiszowe',
            'hk-inst-assign': `Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.`,
            'hk-inst-delete': `Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.`,
            'hk-inst-keys': `Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.`,
            'hk-bots-split': 'Bots split',
            'hk-bots-feed': 'Bots feed',
            'hk-bots-ai': 'Bots AI toggle',
            'hk-feed': `Feed`,
            'hk-macroFeed': 'Szybki feed',
            'hk-split': `Podział`,
            'hk-doubleSplit': `Podwójny podział`,
            'hk-split16': `Podział na 16`,
            'hk-pause': `Pauza kulki`,
            'hk-showTop5': `Pokaż/ukryj top 5 teamu`,
            'hk-showTime': `Pokaż/ukryj aktualny czas`,
            'hk-showSplitRange': `Pokaż/ukryj zasięg podziału`,
            'hk-showSplitInd': `Pokaż/ukryj zasięg podziału z ringami`,
            'hk-showTeammatesInd': `Pokaż/ukryj wskaźniki graczy teamu`,
            'hk-showOppColors': `Pokaż/ukryj kolory przeciwników`,
            'hk-toggleSkins': `Przełącz skiny (własne/standardowe)`,
            'hk-showSkins': `Pokaż/ukryj skiny`,
            'hk-transparentSkins': `Włącz/wyłącz przezroczyste skiny`,
            'hk-showStats': `Pokaż/ukryj statystyki gry`,
            'hk-toggleCells': `Przełącz kulkę (najmniejsza/największa)`,
            'hk-showFood': 'Pokaż/ukryj pokarm',
            'hk-showGrid': 'Pokaż/ukryj siatkę',
            'hk-showMiniMapGuides': `Pokaż/ukryj prowadnice na minimapie`,
            'hk-hideChat': `Pokaż/ukryj czat`,
            'hk-showHUD': `Pokaż/ukryj HUD`,
            'hk-copyLb': `Kopiuj topkę`,
            'hk-showLb': `Pokaż/ukryj topkę`,
            'hk-toggleAutoZoom': 'Włącz/wyłącz auto zoom',
            'hk-resetZoom': `Reset zoomu`,
            'hk-zoomLevel': `Zoom - poziom`,
            'hk-toggleDeath': `Przełącz miejsce śmierci`,
            'hk-clearChat': `Pokaż historię czatu / Czyść czat`,
            'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
            'hk-hideBots': 'Pokaż/ukryj małe boty',
            'hk-showNames': `Pokaż/ukryj nazwy`,
            'hk-hideTeammatesNames': `Pokaż/ukryj nazwy graczy teamu`,
            'hk-showMass': 'Pokaż/ukryj masę',
            'hk-showMiniMap': `Pokaż/ukryj minimapę`,
            'hk-chatMessage': `Napisz wiadomość na czacie`,
            'hk-quickResp': `Szybkie odrodzenie (respawn)`,
            'hk-autoResp': `Włącz/wyłacz auto odrodzenie`,
            'hk-switchServerMode': `Przełącz serwer [publiczny/prywatny]`,
            'hk-showTargeting': `Pokaż/ukryj panel namierzania`,
            'hk-setTargeting': 'Włącz/wyłącz namierzanie (śledzenie)',
            'hk-cancelTargeting': `Zatrzymaj namierzanie`,
            'hk-changeTarget': `Zmień cel`,
            'hk-privateMiniMap': `Pokaż cel na minimapie`,
            'hk-showQuest': `Pokaż/ukryj zadanie`,
            commands: `Komendy`,
            comm1: 'Feeduj!',
            comm2: 'Dziel się!',
            comm3: `Pomocy na %currentSector%!`,
            comm4: `Wróg na %currentSector%!`,
            comm5: `Zabij pomocnika!`,
            comm6: `Strzel z wirusa!`,
            comm7: `Zjedz wirusa!`,
            comm8: `Zjebałem, wybacz.`,
            comm9: `Ja pierdolę...`,
            comm0: `Kurwa mać!`,
            comm10: 'Trick!',
            comm11: `Lewo!`,
            comm12: `Góra!`,
            comm13: `Prawo!`,
            comm14: `Dół!`,
            saveComm: `Zapisz komendy`,
            theme: 'Wygląd',
            restoreThemeSettings: `Przywróc ustawienia domyślne wyglądu`,
            basicTheming: `Podstawowy`,
            themePreset: `Motyw`,
            themeType: 'Typ motywu',
            darkTheme: `Ciemny motyw`,
            lightTheme: 'Jasny motyw',
            mainColor: `Kolor główny`,
            bgColor: 'Tło',
            bordersColor: `Granice mapy`,
            gridColor: `Siatka`,
            sectorsColor: `Czcionka sektorów`,
            namesColor: `Nazwy`,
            namesStrokeColor: `Obwódki nazw`,
            massColor: `Masa`,
            massStrokeColor: `Obwódki masy`,
            virusColor: `Wirusy`,
            virusStrokeColor: 'Obwódki wirusów',
            foodColor: `Pokarm`,
            namesFont: 'Czcionka nazw',
            massFont: `Czcionka masy`,
            sectorsFont: `Czcionka sektorów`,
            namesScale: 'Skala nazw',
            massScale: 'Skala masy',
            virMassScale: `Skala masy wirusów`,
            strokeScale: `Skala obwódek tekstu`,
            foodSize: 'Wielkość pokarmu',
            bordersWidth: 'Grubość granic mapy',
            sectorsWidth: `Grubość siatki sektorów`,
            sectorsFontSize: `Rozmiar czcionki sektorów`,
            cellsAlpha: `Przezroczystość kulek`,
            skinsAlpha: `Przezroczystość skinów`,
            virusAlpha: `Przezroczystość wirusów`,
            textAlpha: 'Przezroczystość nazw i masy',
            virusStrokeSize: `Grubość obwódki wirusów`,
            teammatesIndColor: `Wskaźnik gracza`,
            cursorTrackingColor: 'Śledzenie kursora',
            splitRangeColor: `Zasięg podziału`,
            safeAreaColor: `Bezpieczna strefa`,
            dangerAreaColor: 'Strefa zagrożenia',
            ghostCellsColor: `Duchy kulek`,
            ghostCellsAlpha: 'Przezroczystość duchów kulek',
            menuTheming: `Menu`,
            menuPreset: `Motyw menu`,
            menuMainColor: `Kolor główny`,
            menuBtnTextColor: 'Tekst przycisku',
            menuPanelColor: `Panel`,
            menuPanelColor2: `Panel (2)`,
            menuTextColor: `Tekst panelu`,
            menuTextColor2: 'Tekst panelu (2)',
            btn1Color: `Przycisk #1`,
            btn1Color2: 'Przycisk #1 (2)',
            btn2Color: `Przycisk #2`,
            btn2Color2: `Przycisk #2 (2)`,
            btn3Color: `Przycisk #3`,
            btn3Color2: 'Przycisk #3 (2)',
            btn4Color: `Przycisk #4`,
            btn4Color2: `Przycisk #4 (2)`,
            menuBg: 'Grafika tła panelu',
            menuOpacity: 'Przezroczystość',
            hudTheming: `HUD`,
            hudMainColor: `Kolor główny`,
            hudColor: `Tło`,
            hudTextColor: 'Tekst',
            statsHudColor: `Statystyki`,
            timeHudColor: 'Czas',
            top5MassColor: `Masa`,
            lbMeColor: `Topka - ja`,
            lbTeammateColor: `Topka - team`,
            hudFont: `Czcionka HUD`,
            hudScale: `Skala HUD`,
            chatTheming: 'Czat',
            messageColor: 'Tło wiadomości',
            messageTextColor: 'Tekst wiadomości',
            messageTimeColor: `Czas wiadomości`,
            messageNickColor: `Nick wiadomości`,
            commandsColor: `Tło komendy`,
            commandsTextColor: `Tekst komendy`,
            commandsTimeColor: 'Czas komendy',
            commandsNickColor: `Nick komendy`,
            chatBoxColor: `Tło czatboxu`,
            chatScale: `Skala czatu`,
            miniMapTheming: `Minimapa`,
            miniMapSectorsColor: `Sektory`,
            miniMapSectorColor: `Aktualny sektor`,
            miniMapGuidesColor: `Prowadnice`,
            miniMapNickColor: 'Nick',
            miniMapNickStrokeColor: `Obwódka nicku`,
            miniMapMyCellColor: 'Moja kulka',
            miniMapMyCellStrokeColor: `Obwódka mojej kulki`,
            miniMapTeammatesColor: 'Gracze',
            miniMapDeathLocationColor: `Miejsce śmierci`,
            miniMapFont: `Czcionka minimapy`,
            miniMapNickFont: `Czcionka nicku`,
            miniMapWidth: `Szerokość minimapy`,
            miniMapSectorsOpacity: 'Przezroczystość sektorów',
            miniMapNickSize: `Rozmiar nicku`,
            miniMapNickStrokeSize: `Grubość obwódki nicku`,
            miniMapMyCellSize: `Wielkość mojej kulki`,
            miniMapMyCellStrokeSize: `Grubość obwódki mojej kulki`,
            miniMapTeammatesSize: `Wielkość graczy`,
            miniMapGhostCellsColor: `Duchy kulek`,
            miniMapGhostCellsAlpha: `Przezroczystość duchów kulek`,
            imagesTheming: 'Grafika / kursory',
            customBackground: `Grafika tła`,
            customCursor: `Grafika kursora`,
            hideChatMsgA: `Czat został włączony!`,
            hideChatMsgB: `Czat został ukryty!`,
            showSkinsMsgA: 'Skiny zostały włączone!',
            showSkinsMsgB: `Skiny zostały ukryte!`,
            hideSmallBotsMsgA: 'Małe boty stały się widoczne!',
            hideSmallBotsMsgB: 'Małe boty zostały ukryte!',
            autoRespMsgA: `Auto odrodzenie zostało włączone!`,
            autoRespMsgB: `Auto odrodzenie zostało wyłączone!`,
            autoZoomMsgA: `Auto zoom został włączony!`,
            autoZoomMsgB: 'Auto zoom został wyłączony!',
            targetNotSet: `Brak celu`,
            targetDead: `Nie żyje`,
            targetDistance: 'Dystans',
            targetMass: `Masa razem`,
            totalPartyPlayers: 'Aktywnych graczy',
            totalPartyMass: 'Łącznie masy',
            exportImport: `Eksport / import ustawień`,
            exportSettings: `Eksportuj ustawienia`,
            exportInfo: 'Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.',
            importSettings: 'Importuj ustawienia',
            importInfo: `Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk "Importuj ustawienia".`,
            profile: `Profil`,
            profiles: `Profile`,
            skins: 'Skiny',
            moreSkins: `Dodaj skiny`,
            thanks: `Dzięki Awesome!`,
            saveSett: `Zapisz ustawienia`,
            saved: 'Zapisano!',
            resetSett: `Resetuj ustawienia`,
            close: `Zamknij`,
            enterChatMsg: `Napisz wiadomość`,
            activeParties: `Aktywne party`,
            noActiveParties: `Brak aktywnych party ;(`,
            playlist: `Playlista`,
            pause: `PAUZA!`,
            visit: `Odwiedź`,
            exit: 'OGARio by szymy: Czy na pewno chcesz opuścic grę?',
            blockWarn: `UWAGA! Popupy zostały zablokowane w ustawieniach.`,
            unblockPopups: `Odblokuj tymczasowo`,
            mass: `Masa`,
            score: `Top`,
            leaderboard: `Topka`,
            user: `Użytkownik`,
            userMuted: `Użytkownik %user% został wyciszony.`,
            userUnmuted: `Wyłączono wyciszenie użytkownika %user%.`,
            mute: `Wycisz`,
            unmute: 'Wyłącz wyciszenie',
            mutedUsers: `Wyciszeni użytkownicy`,
            activeUsers: `Aktywni użytkownicy`,
            showActiveUsers: 'Pokaż aktywnych użytkowników',
            none: `Brak`,
            sounds: 'Dźwięki',
            page_back_button: `Wróć`,
            page_create_party: `Stwórz party`,
            page_join_party: `Dołącz`,
            page_login_and_play: `Zaloguj`,
            page_logout: `Wyloguj`,
            page_menu_login_facebook: `Zaloguj z Facebook`,
            page_menu_login_google: 'Zaloguj z Google',
            page_menu_main_free_coins: `Darmowe Monety`,
            page_menu_main_gifts: 'Prezenty',
            page_menu_main_dailyquests: `Zadania`,
            page_party_join_error: 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
            page_play: `Graj`,
            page_play_as_guest: `Graj jako gość`,
            page_shop: `Sklep`,
            page_spectate: `Obserwuj`,
            page_stats: `Statystyki`
        },
        en: {
            start: `Home`,
            settings: `Settings`,
            restoreSettings: `Restore default settings`,
            animationGroup: `Animation`,
            zoomGroup: `Zoom`,
            respGroup: `Respawn`,
            namesGroup: `Names`,
            massGroup: 'Mass',
            skinsGroup: `Skins`,
            foodGroup: `Food`,
            transparencyGroup: 'Transparency / colors',
            gridGroup: 'Grid / sectors',
            miniMapGroup: `Minimap`,
            helpersGroup: `Helpers`,
            mouseGroup: `Mouse control`,
            hudGroup: `HUD`,
            chatGroup: `Chat`,
            statsGroup: `Stats`,
            extrasGroup: `Extras`,
            noSkins: `No skins`,
            noNames: 'No names',
            noColors: 'No colors',
            showMass: `Show mass`,
            skipStats: 'Skip stats after death',
            showQuest: `Show quest`,
            autoZoom: `Auto zoom`,
            animation: `Animation delay`,
            zoomSpeedValue: `Zoom speed`,
            quickResp: `Quick respawn (hotkey)`,
            autoResp: `Auto respawn`,
            autoHideCellsInfo: `Auto hide names and mass`,
            autoHideNames: `Auto hide names`,
            autoHideMass: `Auto hide mass`,
            autoHideFood: `Auto hide food (mass)`,
            autoHideFoodOnZoom: 'Auto hide food (zoom)',
            optimizedNames: `Optimized names`,
            hideMyName: `Hide my name`,
            hideTeammatesNames: `Hide teammates names`,
            optimizedMass: `Optimized mass (+/-2%)`,
            shortMass: `Short mass (k)`,
            virMassShots: `Virus shots`,
            hideMyMass: `Hide my mass`,
            hideEnemiesMass: `Hide enemies mass`,
            vanillaSkins: `Vanilla skins`,
            customSkins: `Custom skins`,
            myTransparentSkin: `My transparent skin`,
            myCustomColor: `My custom color`,
            transparentCells: `Transparent cells`,
            transparentViruses: 'Transparent viruses',
            transparentSkins: 'Transparent skins',
            showGrid: 'Show grid',
            showBgSectors: `Show background sectors`,
            showMapBorders: `Show map borders`,
            showGhostCells: `Ghost cells`,
            showMiniMap: `Show minimap`,
            showMiniMapGrid: `Show minimap grid`,
            showMiniMapGuides: `Show minimap guides`,
            showMiniMapGhostCells: `Show ghost cells`,
            oneColoredTeammates: 'One-colored teammates',
            optimizedFood: `Optimized food`,
            rainbowFood: `Rainbow food`,
            oppColors: `Opponents colors`,
            oppRings: `Opponents rings`,
            virColors: `Viruses colors`,
            splitRange: `Split range`,
            virusesRange: 'Viruses range',
            textStroke: `Names and mass stroke`,
            namesStroke: 'Names stroke',
            massStroke: `Mass stroke`,
            cursorTracking: 'Cursor tracking',
            teammatesInd: `Teammates indicators`,
            mouseSplit: `LMB - Mouse split`,
            mouseFeed: `RMB - Mouse feed`,
            mouseInvert: `Invert mouse buttons`,
            disableChat: 'Disable chat',
            hideChat: `Hide chat`,
            chatSounds: `Sound notifications`,
            chatEmoticons: `Emoticons`,
            showChatImages: 'Show images on chat',
            showChatVideos: `Show videos on chat`,
            showChatBox: `Chatbox instead of popups`,
            messageSound: `Message notification sound`,
            commandSound: `Command notification sound`,
            showTop5: 'Show team top 5',
            showTargeting: `Show targeting`,
            showTime: 'Show current time',
            showLbData: `Show leaderboard mass`,
            normalLb: `"Leaderboard" header`,
            centeredLb: `Centered leaderboard`,
            fpsAtTop: `Game stats at the top`,
            showStats: `Show game stats`,
            showStatsMass: `Game stats: Mass`,
            showStatsSTE: `Game stats: STE`,
            showStatsN16: `Game stats: n/16`,
            showStatsFPS: `Game stats: FPS`,
            blockPopups: `Block popups (ads/shop/quest)`,
            hotkeys: 'Hotkeys',
            'hk-inst-assign': `To assign a hotkey click on the input field and press your chosen key.`,
            'hk-inst-delete': `To delete a hotkey click on the input field and press the DELETE key.`,
            'hk-inst-keys': `Possible key combinations with the CTRL and ALT keys.`,
            'hk-bots-split': 'Bots split',
            'hk-bots-feed': 'Bots feed',
            'hk-bots-ai': 'Bots AI toggle',
            'hk-feed': 'Feed',
            'hk-macroFeed': 'Macro feed',
            'hk-split': `Split`,
            'hk-doubleSplit': `Double split`,
            'hk-split16': `Split 16`,
            'hk-pause': `Cell pause`,
            'hk-showTop5': `Show/hide team top 5`,
            'hk-showTime': `Show/hide current time`,
            'hk-showSplitRange': `Show/hide split range`,
            'hk-showSplitInd': 'Show/hide split indicators',
            'hk-showTeammatesInd': 'Show/hide teammates indicators',
            'hk-showOppColors': `Show/hide opponents colors`,
            'hk-toggleSkins': 'Toggle skins (custom/default)',
            'hk-showSkins': `Show/hide skins`,
            'hk-transparentSkins': 'Toggle transparent skins',
            'hk-showStats': `Show/hide game stats`,
            'hk-toggleCells': `Toggle own cells (smallest/biggest)`,
            'hk-showFood': `Show/hide food`,
            'hk-showGrid': `Show/hide grid`,
            'hk-showMiniMapGuides': 'Show/hide minimap guides',
            'hk-hideChat': `Show/hide chat`,
            'hk-showHUD': `Show/hide HUD`,
            'hk-copyLb': `Copy leaderboard`,
            'hk-showLb': 'Show/hide leaderboard',
            'hk-toggleAutoZoom': `Toggle auto zoom`,
            'hk-resetZoom': `Reset zoom`,
            'hk-zoomLevel': 'Zoom level',
            'hk-toggleDeath': `Toggle death location`,
            'hk-clearChat': `Show chat history / Clear chat`,
            'hk-showBgSectors': `Show/hide background sectors`,
            'hk-hideBots': `Show/hide small bots`,
            'hk-showNames': 'Show/hide names',
            'hk-hideTeammatesNames': `Show/hide teammates names`,
            'hk-showMass': `Show/hide mass`,
            'hk-showMiniMap': 'Show/hide minimap',
            'hk-chatMessage': `Enter chat message`,
            'hk-quickResp': `Quick respawn`,
            'hk-autoResp': `Toggle auto respawn`,
            'hk-switchServerMode': `Switch server [public/private]`,
            'hk-showTargeting': 'Show/hide targeting panel',
            'hk-setTargeting': `Start/stop targeting (following)`,
            'hk-cancelTargeting': 'Cancel targeting',
            'hk-changeTarget': 'Change target',
            'hk-privateMiniMap': 'Show target on the minimap',
            'hk-showQuest': 'Show/hide quest',
            commands: `Commands`,
            comm1: `Feed me!`,
            comm2: `Split into me!`,
            comm3: 'Need backup at %currentSector%!',
            comm4: 'Enemy spotted at %currentSector%!',
            comm5: `Need a teammate!`,
            comm6: 'Tank the virus!',
            comm7: `Eat the virus!`,
            comm8: `Let's bait!`,
            comm9: `Fake tricksplit!`,
            comm0: `Fuck!`,
            comm10: `Tricksplit!`,
            comm11: `Left!`,
            comm12: `Up!`,
            comm13: 'Right!',
            comm14: 'Bottom!',
            saveComm: 'Save commands',
            theme: `Theme`,
            restoreThemeSettings: `Restore theme default settings`,
            basicTheming: 'Basic theming',
            themePreset: `Theme preset`,
            themeType: 'Theme type',
            darkTheme: 'Dark theme',
            lightTheme: `Light theme`,
            mainColor: 'Main color',
            bgColor: `Background`,
            bordersColor: 'Map borders',
            gridColor: `Grid`,
            sectorsColor: `Sectors font`,
            namesColor: `Names`,
            namesStrokeColor: `Names stroke`,
            massColor: 'Mass',
            massStrokeColor: `Mass stroke`,
            virusColor: `Virus`,
            virusStrokeColor: `Virus stroke`,
            foodColor: `Food`,
            namesFont: 'Names font',
            massFont: `Mass font`,
            sectorsFont: 'Sectors font',
            namesScale: `Names scale`,
            massScale: 'Mass scale',
            virMassScale: 'Virus mass scale',
            strokeScale: `Text stroke scale`,
            foodSize: `Food size`,
            bordersWidth: 'Map borders width',
            sectorsWidth: `Sectors grid width`,
            sectorsFontSize: `Sectors font size`,
            cellsAlpha: `Cells transparency`,
            skinsAlpha: 'Skins transparency',
            virusAlpha: `Virus transparency`,
            textAlpha: `Names & mass transparency`,
            virusStrokeSize: `Virus stroke size`,
            teammatesIndColor: `Teammate indicator`,
            cursorTrackingColor: `Cursor tracking`,
            splitRangeColor: `Split range`,
            safeAreaColor: `Safe area`,
            dangerAreaColor: `Danger area`,
            ghostCellsColor: `Ghost cells`,
            ghostCellsAlpha: 'Ghost cells transparency',
            menuTheming: `Menu`,
            menuPreset: `Menu theme`,
            menuMainColor: `Main color`,
            menuBtnTextColor: `Button text`,
            menuPanelColor: `Panel`,
            menuPanelColor2: `Panel (2)`,
            menuTextColor: 'Panel text',
            menuTextColor2: `Panel text (2)`,
            btn1Color: `Button #1`,
            btn1Color2: `Button #1 (2)`,
            btn2Color: 'Button #2',
            btn2Color2: `Button #2 (2)`,
            btn3Color: `Button #3`,
            btn3Color2: `Button #3 (2)`,
            btn4Color: `Button #4`,
            btn4Color2: `Button #4 (2)`,
            menuBg: 'Panel background image',
            menuOpacity: `Transparency`,
            hudTheming: `HUD`,
            hudMainColor: `Main color`,
            hudColor: 'Background',
            hudTextColor: `Text`,
            statsHudColor: `Stats`,
            timeHudColor: 'Time',
            top5MassColor: `Mass`,
            lbMeColor: `Leaderboard - me`,
            lbTeammateColor: `Leaderboard - teammate`,
            hudFont: `HUD font`,
            hudScale: `HUD scale`,
            chatTheming: `Chat`,
            messageColor: 'Message background',
            messageTextColor: 'Message text',
            messageTimeColor: `Message time`,
            messageNickColor: `Message nick`,
            commandsColor: `Command background`,
            commandsTextColor: 'Command text',
            commandsTimeColor: `Command time`,
            commandsNickColor: `Command nick`,
            chatBoxColor: `Chatbox color`,
            chatScale: `Chat scale`,
            miniMapTheming: `Minimap`,
            miniMapSectorsColor: `Sectors`,
            miniMapSectorColor: `Current sector`,
            miniMapGuidesColor: `Guides`,
            miniMapNickColor: `Nick`,
            miniMapNickStrokeColor: `Nick stroke`,
            miniMapMyCellColor: `My cell`,
            miniMapMyCellStrokeColor: `My cell stroke`,
            miniMapTeammatesColor: `Teammates`,
            miniMapDeathLocationColor: `Death location`,
            miniMapFont: `Minimap font`,
            miniMapNickFont: `Nick font`,
            miniMapWidth: `Minimap width`,
            miniMapSectorsOpacity: `Sectors transparency`,
            miniMapNickSize: 'Nick size',
            miniMapNickStrokeSize: 'Nick stroke size',
            miniMapMyCellSize: `My cell size`,
            miniMapMyCellStrokeSize: `My cell stroke size`,
            miniMapTeammatesSize: 'Teammates size',
            miniMapGhostCellsColor: `Ghost cells`,
            miniMapGhostCellsAlpha: `Ghost cells transparency`,
            imagesTheming: `Graphics / cursors`,
            customBackground: `Custom background image`,
            customCursor: `Custom cursor image`,
            hideChatMsgA: `Chat is visible!`,
            hideChatMsgB: `Chat is hidden!`,
            showSkinsMsgA: `Skins are visible!`,
            showSkinsMsgB: `Skins are hidden!`,
            hideSmallBotsMsgA: `Small bots are visible!`,
            hideSmallBotsMsgB: `Small bots are hidden!`,
            autoRespMsgA: `Auto respawn is on!`,
            autoRespMsgB: `Auto respawn is off!`,
            autoZoomMsgA: `Auto zoom is on!`,
            autoZoomMsgB: `Auto zoom is off!`,
            targetNotSet: `Target not set`,
            targetDead: 'Dead',
            targetDistance: 'Distance',
            targetMass: `Mass altogether`,
            totalPartyPlayers: `Active players`,
            totalPartyMass: `Total mass`,
            exportImport: `Export / import settings`,
            exportSettings: 'Export settings',
            exportInfo: 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
            importSettings: `Import settings`,
            importInfo: `To import selected settings paste an exported code below and press the "Import settings" button.`,
            profile: `Profile`,
            profiles: 'Profiles',
            skins: `Skins`,
            moreSkins: `Add skins`,
            thanks: `Thanks to Awesome!`,
            saveSett: 'Save settings',
            saved: `Saved!`,
            resetSett: `Reset to default`,
            close: `Close`,
            enterChatMsg: `Enter chat message`,
            activeParties: `Active parties`,
            noActiveParties: `No active parties ;(`,
            playlist: `Playlist`,
            pause: `PAUSE!`,
            visit: 'Visit',
            exit: 'OGARio by szymy: Are you sure you want to quit the game?',
            blockWarn: `WARNING! Popups are blocked in the settings.`,
            unblockPopups: `Temporary unblock`,
            mass: 'Mass',
            score: `Score`,
            leaderboard: `Leaderboard`,
            user: 'User',
            userMuted: 'User %user% has been muted.',
            userUnmuted: `User %user% has been unmuted.`,
            mute: `Mute`,
            unmute: 'Unmute',
            mutedUsers: `Muted users`,
            activeUsers: `Active users`,
            showActiveUsers: `Show active users`,
            none: `None`,
            sounds: `Sounds`,
            page_menu_main_free_coins: 'Free Coins',
            page_menu_main_gifts: 'Gifts',
            page_menu_main_dailyquests: `Daily Quest`,
            page_shop: `Shop`
        }
    };
    let lang = 'en';
    const userLanguage = window.navigator.language || window.navigator.userLanguage;
    if (userLanguage && displayText.hasOwnProperty(userLanguage)) {
        lang = userLanguage;
    }
    const textLanguage = displayText[lang];
    let chatCommand = {
        comm1: textLanguage.comm1,
        comm2: textLanguage.comm2,
        comm3: textLanguage.comm3,
        comm4: textLanguage.comm4,
        comm5: textLanguage.comm5,
        comm6: textLanguage.comm6,
        comm7: textLanguage.comm7,
        comm8: textLanguage.comm8,
        comm9: textLanguage.comm9,
        comm0: textLanguage.comm0,
        comm10: textLanguage.comm10,
        comm11: textLanguage.comm11,
        comm12: textLanguage.comm12,
        comm13: textLanguage.comm13,
        comm14: textLanguage.comm14
    };
    const escapeChar = {
        '&': `&amp;`,
        '<': `&lt;`,
        '>': `&gt;`,
        '"': `&quot;`,
        '\'': '&#39;',
        '/': `&#x2F;`
    };
    const emojiChar = {
        ':)': `smile.svg`,
        ';)': `wink.svg`,
        '=)': 'smirk.svg',
        ':D': `grin.svg`,
        'X-D': `xgrin.svg`,
        '=D': `joy.svg`,
        ':(': 'sad.svg',
        ';(': `cry.svg`,
        ':P': `tongue.svg`,
        ';P': 'tonguew.svg',
        ':*': 'kiss.svg',
        '$)': 'smileh.svg',
        '<3': `heart.svg`,
        '8=)': 'cool.svg',
        ':o': `astonished.svg`,
        '(:|': `sweat.svg`,
        ':|': `neutral.svg`,
        ':': 'unamused.svg',
        ':@': 'pouting.svg',
        '|-)': 'sleep.svg',
        '^_^': 'relaxed.svg',
        '-_-': `expressionless.svg`,
        '$_$': `money.svg`,
        'O:)': `angel.svg`,
        '3:)': `devil.svg`,
        '(poop)': `poo.svg`,
        '(fuck)': 'finger.svg',
        '(clap)': `clap.svg`,
        '(ok)': `ok.svg`,
        '(victory)': 'victory.svg',
        '(y)': 'thumb.svg',
        '(n)': `thumbd.svg`
    };
    const SkinExplain = [{
        name: `imgur.com`,
        url: `https://imgur.com/`,
        example: `https://i.imgur.com/xdmUp5N.png`,
        pattern: `https?:\/\/\w+\.imgur\.com\/\w{6,}\.(?:%file_ext%)\??\d*`
    }, {
        name: `put.re`,
        url: 'https://put.re/',
        example: 'https://s.put.re/iYHAW65g.png',
        pattern: `https?:\/\/\w+\.put\.re\/\w{8,}\.(?:%file_ext%)`
    }, {
        name: `postimages.org`,
        url: `https://postimages.org/`,
        example: 'https://i.postimg.cc/zzK0sRPg/xdmUp5N.png',
        pattern: 'https?:\/\/\w+\.postimg\.cc\/\w{8,}\/\w+\.(?:%file_ext%)'
    }];
    const gameTheme = {
        'ogario-v3': {
            name: `OGARio v3`,
            darkTheme: true,
            mainColor: '#01d9cc',
            bgColor: '#000a11',
            bordersColor: `#01d9cc`,
            gridColor: `#00243e`,
            sectorsColor: `#00243e`,
            namesColor: '#ffffff',
            namesStrokeColor: `#000000`,
            massColor: `#ffffff`,
            massStrokeColor: '#000000',
            virusColor: `#002f52`,
            virusStrokeColor: `#00b9e8`,
            foodColor: `#5000ff`,
            teammatesIndColor: `#ffffff`,
            cursorTrackingColor: `#ffffff`,
            splitRangeColor: `#ffffff`,
            safeAreaColor: `#ffffff`,
            dangerAreaColor: `#bf00aa`,
            namesFont: 'ubuntu-bold',
            massFont: `ubuntu-bold`,
            sectorsFont: 'ubuntu',
            namesScale: 1,
            massScale: 3,
            foodSize: 5,
            bordersWidth: 40,
            sectorsWidth: 40,
            sectorsFontSize: 1200,
            cellsAlpha: 0.9,
            skinsAlpha: 0.7,
            virusAlpha: 0.6,
            textAlpha: 1,
            virusStrokeSize: 14,
            menuPreset: `ogario-v3`,
            menuMainColor: `#01d9cc`,
            menuBtnTextColor: `#ffffff`,
            menuPanelColor: `#00243e`,
            menuPanelColor2: '#002f52',
            menuTextColor: `#ffffff`,
            menuTextColor2: `#8096a7`,
            btn1Color: `#018cf6`,
            btn1Color2: '#0176ce',
            btn2Color: `#00b9e8`,
            btn2Color2: `#0099c0`,
            btn3Color: '#8d5fe6',
            btn3Color2: `#814ee3`,
            btn4Color: `#bf00aa`,
            btn4Color2: '#a80096',
            menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,
            menuOpacity: 0.96,
            hudMainColor: `#01d9cc`,
            hudColor: `rgba(0,0,0,0.4)`,
            hudTextColor: `#ffffff`,
            statsHudColor: `#ffffff`,
            timeHudColor: `#01d9cc`,
            top5MassColor: '#bf00aa',
            lbMeColor: '#bf00aa',
            lbTeammateColor: `#018cf6`,
            hudFont: 'ubuntu-bold',
            hudScale: 1,
            messageColor: `rgba(0,0,0,0.4)`,
            messageTextColor: `#ffffff`,
            messageTimeColor: '#018cf6',
            messageNickColor: `#01d9cc`,
            commandsColor: 'rgba(191,0,170,0.9)',
            commandsTextColor: `#ffffff`,
            commandsTimeColor: `#bf00aa`,
            commandsNickColor: `#ffffff`,
            chatBoxColor: 'rgba(0,0,0,0.4)',
            chatScale: 1,
            miniMapSectorsColor: '#ffffff',
            miniMapSectorColor: `#01d9cc`,
            miniMapGuidesColor: `#bf00aa`,
            miniMapNickColor: `#ffffff`,
            miniMapNickStrokeColor: '#000000',
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: `#bf00aa`,
            miniMapTeammatesColor: `#01d9cc`,
            miniMapDeathLocationColor: `#bf00aa`,
            miniMapFont: `ubuntu-bold`,
            miniMapNickFont: `ubuntu-bold`,
            miniMapWidth: 240,
            miniMapSectorsOpacity: 0.1,
            miniMapNickSize: 11,
            miniMapNickStrokeSize: 2,
            miniMapMyCellSize: 7.5,
            miniMapMyCellStrokeSize: 4,
            miniMapTeammatesSize: 5.5,
            customBackground: '',
            customCursor: `https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur`
        },
        'ogario-orange': {
            name: `OGARio v2`,
            darkTheme: true,
            mainColor: `#ff7800`,
            bgColor: `#111111`,
            bordersColor: `#ff7800`,
            gridColor: '#292929',
            sectorsColor: `#292929`,
            namesColor: '#ffffff',
            namesStrokeColor: `#000000`,
            massColor: `#ffffff`,
            massStrokeColor: '#000000',
            virusColor: `#666666`,
            virusStrokeColor: `#666666`,
            foodColor: `#e16400`,
            hudMainColor: '#ff7800',
            statsHudColor: `#ff7800`,
            top5MassColor: `#ff7800`,
            timeHudColor: `#ff7800`,
            messageNickColor: `#ff7800`,
            commandsColor: `rgba(255,120,0,0.9)`,
            commandsTimeColor: `#ff7800`,
            commandsTextColor: `#ffffff`,
            miniMapSectorsColor: `#ffffff`,
            miniMapSectorColor: `#ff7800`,
            miniMapGuidesColor: `#ff7800`,
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: `#ff7800`,
            miniMapTeammatesColor: '#ff7800',
            miniMapDeathLocationColor: `#ff7800`,
            miniMapSectorsOpacity: 0.1
        },
        'ogario-gold': {
            name: `OGARio LE`,
            darkTheme: true,
            mainColor: `#b5a642`,
            bgColor: `#000000`,
            bordersColor: `#b5a642`,
            gridColor: `#111111`,
            sectorsColor: `#111111`,
            namesColor: '#ffffff',
            namesStrokeColor: `#000000`,
            massColor: `#ffffff`,
            massStrokeColor: '#000000',
            virusColor: `#666666`,
            virusStrokeColor: '#666666',
            foodColor: `#998c36`,
            hudMainColor: '#b5a642',
            statsHudColor: `#b5a642`,
            top5MassColor: `#b5a642`,
            timeHudColor: '#b5a642',
            messageNickColor: '#b5a642',
            commandsColor: 'rgba(181,166,66,0.9)',
            commandsTimeColor: `#b5a642`,
            commandsTextColor: `#ffffff`,
            miniMapSectorsColor: `#ffffff`,
            miniMapSectorColor: `#b5a642`,
            miniMapGuidesColor: `#b5a642`,
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: `#b5a642`,
            miniMapTeammatesColor: `#b5a642`,
            miniMapDeathLocationColor: `#b5a642`,
            miniMapSectorsOpacity: 0.1
        },
        'ref-style': {
            name: "ReF's Style",
            bgColor: "#000000",
            bordersColor: "#0074fc",
            bordersWidth: 80,
            btn1Color: "#0074fc",
            btn1Color2: "#3592ff",
            btn2Color: "#3592ff",
            btn2Color2: "#3592ff",
            btn3Color: "#3592ff",
            btn3Color2: "#3592ff",
            btn4Color: "#3592ff",
            btn4Color2: "#3592ff",
            cellsAlpha: 0.99,
            chatBoxColor: "rgba(0,0,0,0.4)",
            chatScale: 1,
            commandsColor: "rgba(0,116,252,1)",
            commandsNickColor: "#ffffff",
            commandsTextColor: "#ffffff",
            commandsTimeColor: "#000000",
            cursorTrackingColor: "#ffffff",
            customBackground: "",
            customCursor: "",
            dangerAreaColor: "#0074fc",
            darkTheme: true,
            foodColor: "#0074fc",
            foodSize: 1,
            ghostCellsAlpha: 0.3,
            ghostCellsColor: "#ffffff",
            gridColor: "#0094ff",
            hudColor: "rgba(0,0,0,0.49)",
            hudFont: "ubuntu-bold",
            hudFontFamily: "Ubuntu",
            hudFontWeight: 700,
            hudMainColor: "#0074fc",
            hudScale: 1.15,
            hudTextColor: "#ffffff",
            lbMeColor: "#0074fc",
            lbTeammateColor: "#0074fc",
            mainColor: "#01d9cc",
            massColor: "#ffffff",
            massFont: "ubuntu-bold",
            massFontFamily: "Ubuntu",
            massFontWeight: 700,
            massScale: 0.9,
            massStrokeColor: "#000000",
            menuBg: "",
            menuBtnTextColor: "#ffffff",
            menuMainColor: "#0074fc",
            menuOpacity: 1,
            menuPanelColor: "#050008",
            menuPanelColor2: "#1d0526",
            menuPreset: "ogario-v3",
            menuTextColor: "#ffffff",
            menuTextColor2: "#65458f",
            messageColor: "rgba(0,0,0,0.4)",
            messageNickColor: "#0074fc",
            messageTextColor: "#e8e8e8",
            messageTimeColor: "#545454",
            miniMapDeathLocationColor: "#2b2b2b",
            miniMapFont: "ubuntu-bold",
            miniMapFontFamily: "Ubuntu",
            miniMapFontWeight: 700,
            miniMapGhostCellsAlpha: 0.15,
            miniMapGhostCellsColor: "#ffffff",
            miniMapGuidesColor: "#ff00a8",
            miniMapMyCellColor: "#f0ff3d",
            miniMapMyCellSize: 5,
            miniMapMyCellStrokeColor: "#acba07",
            miniMapMyCellStrokeSize: 0,
            miniMapNickColor: "#ffffff",
            miniMapNickFont: "ubuntu-bold",
            miniMapNickFontFamily: "Ubuntu",
            miniMapNickFontWeight: 700,
            miniMapNickSize: 9,
            miniMapNickStrokeColor: "#4d4d4d",
            miniMapNickStrokeSize: 0,
            miniMapSectorColor: "#000000",
            miniMapSectorsColor: "#ffffff",
            miniMapSectorsOpacity: 0.1,
            miniMapTeammatesColor: "#305eff",
            miniMapTeammatesSize: 5,
            miniMapTop: 25,
            miniMapWidth: 250,
            namesColor: "#ffffff",
            namesFont: "ubuntu-bold",
            namesFontFamily: "Ubuntu",
            namesFontWeight: 700,
            namesScale: 0.9,
            namesStrokeColor: "#000000",
            safeAreaColor: "#ffffff",
            sectorsColor: "#0074fc",
            sectorsFont: "ubuntu",
            sectorsFontFamily: "Ubuntu",
            sectorsFontSize: 940,
            sectorsFontWeight: 400,
            sectorsWidth: 6,
            sectorsX: 5,
            sectorsY: 5,
            skinsAlpha: 0.7,
            splitRangeColor: "#ffffff",
            statsHudColor: "#ffffff",
            strokeScale: 1,
            teammatesIndColor: "#ffffff",
            textAlpha: 1,
            timeHudColor: "#0074fc",
            top5MassColor: "#0074fc",
            virMassScale: 2,
            virusAlpha: 0.4,
            virusColor: "#3b3b3b",
            virusStrokeColor: "#ffffff",
            virusStrokeSize: 10,
            customBackground: '',
            customCursor: ``
        },
        'turbo-style': {
            name: "Turbo's Style",
            bgColor: "#000000",
            bordersColor: "#ff2b77",
            bordersWidth: 80,
            btn1Color: "#ff2b77",
            btn1Color2: "#ff005b",
            btn2Color: "#ff2b77",
            btn2Color2: "#ff005b",
            btn3Color: "#ff2b77",
            btn3Color2: "#ff005b",
            btn4Color: "#ff2b77",
            btn4Color2: "#ff005b",
            cellsAlpha: 0.99,
            chatBoxColor: "rgba(0,0,0,0.4)",
            chatScale: 1,
            commandsColor: "rgba(255,43,119,1)",
            commandsNickColor: "#ffffff",
            commandsTextColor: "#ffffff",
            commandsTimeColor: "#000000",
            cursorTrackingColor: "#ffffff",
            customBackground: "",
            customCursor: "",
            dangerAreaColor: "#ff2b77",
            darkTheme: true,
            foodColor: "#ff2b77",
            foodSize: 1,
            ghostCellsAlpha: 0.3,
            ghostCellsColor: "#ffffff",
            gridColor: "#ff2b77",
            hudColor: "rgba(0,0,0,0.49)",
            hudFont: "ubuntu-bold",
            hudFontFamily: "Ubuntu",
            hudFontWeight: 700,
            hudMainColor: "#ff2b77",
            hudScale: 1.15,
            hudTextColor: "#ffffff",
            lbMeColor: "#ff2b77",
            lbTeammateColor: "#ff2b77",
            mainColor: "#ff2b77",
            massColor: "#000000",
            massFont: "ubuntu-bold",
            massFontFamily: "Ubuntu",
            massFontWeight: 700,
            massScale: 0.9,
            massStrokeColor: "#ffffff",
            menuBg: "",
            menuBtnTextColor: "#ffffff",
            menuMainColor: "#ff2b77",
            menuOpacity: 1,
            menuPanelColor: "#23192c",
            menuPanelColor2: "#382946",
            menuPreset: "ogario-v3",
            menuTextColor: "#ffffff",
            menuTextColor2: "#65458f",
            messageColor: "rgba(0,0,0,0.4)",
            messageNickColor: "#ff2b77",
            messageTextColor: "#e8e8e8",
            messageTimeColor: "#545454",
            miniMapDeathLocationColor: "#2b2b2b",
            miniMapFont: "ubuntu-bold",
            miniMapFontFamily: "Ubuntu",
            miniMapFontWeight: 700,
            miniMapGhostCellsAlpha: 0.15,
            miniMapGhostCellsColor: "#ffffff",
            miniMapGuidesColor: "#ff2b77",
            miniMapMyCellColor: "#ffdd56",
            miniMapMyCellSize: 5,
            miniMapMyCellStrokeColor: "#ff9a6b",
            miniMapMyCellStrokeSize: 0,
            miniMapNickColor: "#ffffff",
            miniMapNickFont: "ubuntu-bold",
            miniMapNickFontFamily: "Ubuntu",
            miniMapNickFontWeight: 700,
            miniMapNickSize: 9,
            miniMapNickStrokeColor: "#4d4d4d",
            miniMapNickStrokeSize: 0,
            miniMapSectorColor: "#000000",
            miniMapSectorsColor: "#ffffff",
            miniMapSectorsOpacity: 0.1,
            miniMapTeammatesColor: "#ff005b",
            miniMapTeammatesSize: 5,
            miniMapTop: 25,
            miniMapWidth: 250,
            namesColor: "#000000",
            namesFont: "ubuntu-bold",
            namesFontFamily: "Ubuntu",
            namesFontWeight: 700,
            namesScale: 0.9,
            namesStrokeColor: "#ffffff",
            safeAreaColor: "#ffffff",
            sectorsColor: "#ff2b77",
            sectorsFont: "ubuntu",
            sectorsFontFamily: "Ubuntu",
            sectorsFontSize: 940,
            sectorsFontWeight: 400,
            sectorsWidth: 6,
            sectorsX: 5,
            sectorsY: 5,
            skinsAlpha: 0.7,
            splitRangeColor: "#ffffff",
            statsHudColor: "#ffffff",
            strokeScale: 1,
            teammatesIndColor: "#ffffff",
            textAlpha: 1,
            timeHudColor: "#ff2b77",
            top5MassColor: "#ff2b77",
            virMassScale: 2,
            virusAlpha: 0.4,
            virusColor: "#3b3b3b",
            virusStrokeColor: "#ff2b77",
            virusStrokeSize: 10,
            customBackground: '',
            customCursor: ``
        },
        'sniikz-style': {
            name: `SniiKz's Style`,
            darkTheme: true,
            mainColor: `#01d9cc`,
            bgColor: `#000000`,
            bordersColor: '#ffffff',
            gridColor: `#00243e`,
            sectorsColor: '#00243e',
            namesColor: `#ffffff`,
            namesStrokeColor: '#000000',
            massColor: '#ffffff',
            massStrokeColor: `#000000`,
            virusColor: '#3b3b3b',
            virusStrokeColor: `#ffffff`,
            foodColor: `#5000ff`,
            teammatesIndColor: `#ffffff`,
            cursorTrackingColor: `#ffffff`,
            splitRangeColor: '#ffffff',
            safeAreaColor: `#ffffff`,
            dangerAreaColor: '#bf00aa',
            massScale: 4,
            foodSize: 1,
            bordersWidth: 40,
            sectorsWidth: 40,
            sectorsFontSize: 1200,
            cellsAlpha: 0.99,
            skinsAlpha: 0.7,
            virusAlpha: 0.4,
            virusStrokeSize: 10,
            menuPreset: `ogario-v3`,
            menuMainColor: `#fc0079`,
            menuBtnTextColor: `#ffffff`,
            menuPanelColor: '#050008',
            menuPanelColor2: `#1d0526`,
            menuTextColor: `#ffffff`,
            menuTextColor2: `#65458f`,
            btn1Color: '#4f0242',
            btn1Color2: `#3b0431`,
            btn2Color: `#6b0036`,
            btn2Color2: `#4d0227`,
            btn3Color: `#aa084e`,
            btn3Color2: `#80063b`,
            btn4Color: `#aa084e`,
            btn4Color2: '#8a063f',
            menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,
            menuOpacity: 1,
            hudMainColor: '#5974ff',
            hudColor: 'rgba(36,36,36,0.49)',
            hudTextColor: `#ffffff`,
            statsHudColor: `#ffffff`,
            timeHudColor: '#737373',
            top5MassColor: `#1fe000`,
            lbMeColor: '#bf00aa',
            lbTeammateColor: `#018cf6`,
            hudScale: 1.15,
            messageColor: 'rgba(0,0,0,0.4)',
            messageTextColor: `#e8e8e8`,
            messageTimeColor: '#545454',
            messageNickColor: '#05ff00',
            commandsColor: `rgba(36,36,36,0.9)`,
            commandsTextColor: `#ffffff`,
            commandsTimeColor: '#545454',
            commandsNickColor: `#ffffff`,
            chatBoxColor: `rgba(0,0,0,0.4)`,
            chatScale: 1,
            miniMapSectorsColor: '#ffffff',
            miniMapSectorColor: `#000000`,
            miniMapGuidesColor: `#ff00a8`,
            miniMapNickColor: `#ffffff`,
            miniMapNickStrokeColor: `#4d4d4d`,
            miniMapMyCellColor: '#f0ff3d',
            miniMapMyCellStrokeColor: `#acba07`,
            miniMapTeammatesColor: '#305eff',
            miniMapDeathLocationColor: '#2b2b2b',
            miniMapWidth: 250,
            miniMapSectorsOpacity: 0.1,
            miniMapNickSize: 9,
            miniMapNickStrokeSize: 0,
            miniMapMyCellSize: 5,
            miniMapMyCellStrokeSize: 0,
            miniMapTeammatesSize: 5,
            customBackground: '',
            customCursor: `https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur`
        },
        'hkg-style': {
            name: `HKG Style`,
            darkTheme: true,
            mainColor: '#651fff',
            bgColor: `#000000`,
            bordersColor: `#ffffff`,
            gridColor: `#111111`,
            sectorsColor: `#111111`,
            namesColor: `#ffffff`,
            namesStrokeColor: `#000000`,
            massColor: `#ffffff`,
            massStrokeColor: `#000000`,
            virusColor: `#666666`,
            virusStrokeColor: `#666666`,
            foodColor: `#651fff`,
            hudMainColor: `#651fff`,
            statsHudColor: '#651fff',
            top5MassColor: '#651fff',
            timeHudColor: `#651fff`,
            messageNickColor: `#651fff`,
            commandsColor: `rgba(101,31,255,0.9)`,
            commandsTimeColor: `#651fff`,
            commandsTextColor: `#ffffff`,
            miniMapSectorsColor: '#ffffff',
            miniMapSectorColor: `#651fff`,
            miniMapGuidesColor: `#651fff`,
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: `#651fff`,
            miniMapTeammatesColor: '#651fff',
            miniMapDeathLocationColor: '#651fff',
            miniMapSectorsOpacity: 0.1
        },
        'agario-light': {
            name: `Agar.io Light`,
            darkTheme: false,
            mainColor: `#ffffff`,
            bgColor: `#f2fbff`,
            bordersColor: `#858a8c`,
            gridColor: `#ced6d9`,
            sectorsColor: '#ced6d9',
            namesColor: '#ffffff',
            namesStrokeColor: '#000000',
            massColor: `#ffffff`,
            massStrokeColor: '#000000',
            virusColor: `#33ff33`,
            virusStrokeColor: `#2de52d`,
            foodColor: '#2de52d',
            hudMainColor: `#ffffff`,
            statsHudColor: `#ffffff`,
            top5MassColor: `#ffffff`,
            timeHudColor: `#ffffff`,
            messageNickColor: '#ffffff',
            commandsColor: `rgba(255,255,255,0.9)`,
            commandsTimeColor: `#ffffff`,
            commandsTextColor: `#000000`,
            miniMapSectorsColor: `#ffffff`,
            miniMapSectorColor: '#ffffff',
            miniMapGuidesColor: '#ffffff',
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: '#ffffff',
            miniMapTeammatesColor: `#ffffff`,
            miniMapDeathLocationColor: `#ffffff`,
            miniMapSectorsOpacity: 0.25
        },
        'agario-dark': {
            name: `Agar.io Dark`,
            darkTheme: true,
            mainColor: `#ffffff`,
            bgColor: `#111111`,
            bordersColor: `#999999`,
            gridColor: `#333333`,
            sectorsColor: `#333333`,
            namesColor: `#ffffff`,
            namesStrokeColor: `#000000`,
            massColor: `#ffffff`,
            massStrokeColor: `#000000`,
            virusColor: `#33ff33`,
            virusStrokeColor: `#2de52d`,
            foodColor: `#2de52d`,
            hudMainColor: `#ffffff`,
            statsHudColor: '#ffffff',
            top5MassColor: `#ffffff`,
            timeHudColor: `#ffffff`,
            messageNickColor: `#ffffff`,
            commandsColor: `rgba(255,255,255,0.9)`,
            commandsTimeColor: `#ffffff`,
            commandsTextColor: '#ffffff',
            miniMapSectorsColor: `#ffffff`,
            miniMapSectorColor: `#ffffff`,
            miniMapGuidesColor: `#ffffff`,
            miniMapMyCellColor: `#ffffff`,
            miniMapMyCellStrokeColor: '#ffffff',
            miniMapTeammatesColor: `#ffffff`,
            miniMapDeathLocationColor: `#ffffff`,
            miniMapSectorsOpacity: 0.1
        }
    };
    const themeSetup = {
        'ogario-v3': {
            name: `OGARio v3`,
            menuMainColor: '#01d9cc',
            menuBtnTextColor: `#ffffff`,
            menuPanelColor: `#00243e`,
            menuPanelColor2: `#002f52`,
            menuTextColor: `#ffffff`,
            menuTextColor2: `#8096a7`,
            btn1Color: `#018cf6`,
            btn1Color2: '#0176ce',
            btn2Color: `#00b9e8`,
            btn2Color2: `#0099c0`,
            btn3Color: `#8d5fe6`,
            btn3Color2: '#814ee3',
            btn4Color: `#f300d8`,
            btn4Color2: `#df00c6`,
            menuBg: 'https://cdn.ogario.ovh/static/img/pattern.png'
        },
        'ogario-v2': {
            name: `OGARio v2`,
            menuMainColor: `#ff7800`,
            menuBtnTextColor: '#ffffff',
            menuPanelColor: `#222222`,
            menuPanelColor2: `#333333`,
            menuTextColor: `#bbbbbb`,
            menuTextColor2: `#bbbbbb`,
            btn1Color: `#428bca`,
            btn1Color2: `#3071a9`,
            btn2Color: `#5cb85c`,
            btn2Color2: `#449d44`,
            btn3Color: `#f0ad4e`,
            btn3Color2: `#ec971f`,
            btn4Color: `#d9534f`,
            btn4Color2: `#c9302c`,
            menuBg: ''
        },
        agario: {
            name: `Agar.io`,
            menuMainColor: '#5bc0de',
            menuBtnTextColor: '#ffffff',
            menuPanelColor: `#ffffff`,
            menuPanelColor2: '#cccccc',
            menuTextColor: '#333333',
            menuTextColor2: '#999999',
            btn1Color: `#428bca`,
            btn1Color2: `#3071a9`,
            btn2Color: '#5cb85c',
            btn2Color2: `#449d44`,
            btn3Color: `#f0ad4e`,
            btn3Color2: `#ec971f`,
            btn4Color: '#d9534f',
            btn4Color2: `#c9302c`,
            menuBg: ''
        }
    };
    const gameSetupTheme = {
        preset: `ogario-v3`,
        darkTheme: true,
        mainColor: '#01d9cc',
        bgColor: `#000a11`,
        bordersColor: `#01d9cc`,
        gridColor: '#00243e',
        sectorsColor: `#00243e`,
        namesColor: `#ffffff`,
        namesStrokeColor: `#000000`,
        massColor: `#ffffff`,
        massStrokeColor: `#000000`,
        virusColor: `#002f52`,
        virusStrokeColor: '#00b9e8',
        foodColor: '#5000ff',
        teammatesIndColor: `#ffffff`,
        cursorTrackingColor: `#ffffff`,
        splitRangeColor: `#ffffff`,
        ghostCellsColor: `#ffffff`,
        safeAreaColor: `#ffffff`,
        dangerAreaColor: `#bf00aa`,
        namesFont: `ubuntu-bold`,
        namesFontFamily: `Ubuntu`,
        namesFontWeight: 700,
        massFont: 'ubuntu-bold',
        massFontFamily: `Ubuntu`,
        massFontWeight: 700,
        sectorsFont: `ubuntu`,
        sectorsFontFamily: `Ubuntu`,
        sectorsFontWeight: 400,
        sectorsX: 5,
        sectorsY: 5,
        namesScale: 1,
        massScale: 3,
        virMassScale: 3,
        strokeScale: 1,
        foodSize: 5,
        bordersWidth: 40,
        sectorsWidth: 40,
        sectorsFontSize: 1200,
        cellsAlpha: 0.9,
        skinsAlpha: 0.7,
        virusAlpha: 0.6,
        textAlpha: 1,
        ghostCellsAlpha: 0.3,
        virusStrokeSize: 14,
        menuPreset: `ogario-v3`,
        menuMainColor: `#01d9cc`,
        menuBtnTextColor: `#ffffff`,
        menuPanelColor: '#00243e',
        menuPanelColor2: `#002f52`,
        menuTextColor: '#ffffff',
        menuTextColor2: `#8096a7`,
        btn1Color: `#018cf6`,
        btn1Color2: '#0176ce',
        btn2Color: '#00b9e8',
        btn2Color2: `#0099c0`,
        btn3Color: `#8d5fe6`,
        btn3Color2: '#814ee3',
        btn4Color: '#bf00aa',
        btn4Color2: '#a80096',
        menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,
        menuOpacity: 0.96,
        hudMainColor: `#01d9cc`,
        hudColor: 'rgba(0,0,0,0.4)',
        hudTextColor: '#ffffff',
        statsHudColor: `#ffffff`,
        timeHudColor: `#01d9cc`,
        top5MassColor: `#bf00aa`,
        lbMeColor: '#bf00aa',
        lbTeammateColor: `#018cf6`,
        hudFont: `ubuntu-bold`,
        hudFontFamily: `Ubuntu`,
        hudFontWeight: 700,
        hudScale: 1,
        messageColor: `rgba(0,0,0,0.4)`,
        messageTextColor: `#ffffff`,
        messageTimeColor: `#018cf6`,
        messageNickColor: '#01d9cc',
        commandsColor: `rgba(191,0,170,0.9)`,
        commandsTextColor: `#ffffff`,
        commandsTimeColor: '#bf00aa',
        commandsNickColor: `#ffffff`,
        chatBoxColor: `rgba(0,0,0,0.4)`,
        chatScale: 1,
        miniMapSectorsColor: `#ffffff`,
        miniMapSectorColor: `#01d9cc`,
        miniMapGuidesColor: '#bf00aa',
        miniMapNickColor: '#ffffff',
        miniMapNickStrokeColor: `#000000`,
        miniMapMyCellColor: `#ffffff`,
        miniMapMyCellStrokeColor: `#bf00aa`,
        miniMapTeammatesColor: `#01d9cc`,
        miniMapDeathLocationColor: `#bf00aa`,
        miniMapGhostCellsColor: `#ffffff`,
        miniMapFont: `ubuntu-bold`,
        miniMapFontFamily: 'Ubuntu',
        miniMapFontWeight: 700,
        miniMapNickFont: `ubuntu-bold`,
        miniMapNickFontFamily: `Ubuntu`,
        miniMapNickFontWeight: 700,
        miniMapWidth: 240,
        miniMapTop: 24,
        miniMapSectorsOpacity: 0.1,
        miniMapNickSize: 11,
        miniMapNickStrokeSize: 2,
        miniMapMyCellSize: 7.5,
        miniMapMyCellStrokeSize: 4,
        miniMapTeammatesSize: 5.5,
        miniMapGhostCellsAlpha: 0.15,
        customBackground: '',
        customCursor: 'https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur'
    };
    const OgarioSettings = {
            menuMainColorCSS: null,
            menuPanelColorCSS: null,
            menuTextlColorCSS: null,
            menuButtonsCSS: null,
            hudCSS: null,
            chatCSS: null,
            chatScaleCSS: null,
            cursorCSS: null,
            loadThemeSettings() {
                let storage = null;
                if (window.localStorage.getItem('ogarioThemeSettings') !== null) {
                    storage = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'));
                }
                for (const setup in gameSetupTheme) {
                    if (gameSetupTheme.hasOwnProperty(setup)) {
                        if (storage && storage.hasOwnProperty(setup)) {
                            gameSetupTheme[setup] = storage[setup];
                        }
                        if (ogario.hasOwnProperty(setup)) {
                            ogario[setup] = gameSetupTheme[setup];
                        }
                    }
                }
            },
            saveThemeSettings() {
                window.localStorage.setItem(`ogarioThemeSettings`, JSON.stringify(gameSetupTheme));
            },
            restoreThemeSettings() {
                if (window.localStorage.getItem(`ogarioThemeSettings`) !== null) {
                    window.localStorage.removeItem('ogarioThemeSettings');
                    window.location.reload();
                }
            },
            addCustomCSS(name, css) {
                if (!this[name]) {
                    this[name] = JQuery(`<style type='text/css'>`).appendTo('head');
                }
                this[name].html(css);
            },
            addPresetBox(id, name, options, value, callback) {
                JQuery(id).append(`<div class="preset-box"><span class="title-box">` + textLanguage[name] + `</span><div class="select-wrapper"><select id="` + name + `" class="form-control"></select></div></div>`);
                for (const option in options) {
                    if (options.hasOwnProperty(option)) {
                        JQuery(`#${name}`).append(`${`<option value="` + option}">${options[option].name}${`</option>`}`);
                }
            }
            JQuery(`#${name}`).val(gameSetupTheme[value]);
            const app = this;
            JQuery(`#${name}`).on(`change`, function() {
                const optionValue = this.value;
                gameSetupTheme[value] = optionValue;
                app[callback](optionValue);
            });
        },
        addColorBox(id, name, callback) {
            JQuery(id).append(`${`<div class="color-box"><span class="title-box">` + textLanguage[name] + `</span><div class="input-group ` + name}-picker"><input type="text" value="${gameSetupTheme[name]}${`" id="`}${name}${`" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>`}`);
            if (callback) {
                const app = this;
                JQuery(`${id} .${name}-picker`).colorpicker({
                    format: `hex`
                }).on(`changeColor.colorpicker`, event => {
                    gameSetupTheme[name] = event.color.toHex();
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = gameSetupTheme[name];
                    }
                    app[callback]();
                });
            } else {
                JQuery(`${id} .${name}${`-picker`}`).colorpicker({
                    format: `hex`
                }).on(`changeColor.colorpicker`, event => {
                    gameSetupTheme[name] = event.color.toHex();
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = gameSetupTheme[name];
                    }
                });
            }
        },
        addRgbaColorBox(id, name, callback) {
            JQuery(id).append(`<div class="color-box"><span class="title-box">${textLanguage[name]}${`</span><div class="input-group `}${name}${`-picker"><input type="text" value="`}${gameSetupTheme[name]}${`" id="`}${name}${`" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>`}`);
            if (callback) {
                const app = this;
                JQuery(`${id} .${name}-picker`).colorpicker({
                    format: `rgba`
                }).on('changeColor.colorpicker', event => {
                    const color = event.color.toRGB();
                    gameSetupTheme[name] = `rgba(${color.r},${color.g},${color.b},${color.a})`;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = gameSetupTheme[name];
                    }
                    app[callback]();
                });
            } else {
                JQuery(`${id} .${name}-picker`).colorpicker({
                    format: `rgba`
                }).on(`changeColor.colorpicker`, event => {
                    const color = event.color.toRGB();
                    gameSetupTheme[name] = `${`rgba(` + color.r},${color.g},${color.b},${color.a})`;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = gameSetupTheme[name];
                    }
                });
            }
        },
        addSliderBox(id, name, min, max, step, callback) {
            JQuery(id).append(`<div class="slider-box"><div class="box-label"><span class="value-label">${textLanguage[name]}: </span><span id="${name}${`-value" class="value">`}${gameSetupTheme[name]}${`</span></div><input id="`}${name}-slider" type="range" min="${min}" max="${max}${`" step="`}${step}${`" value="`}${gameSetupTheme[name]}${`"></div>`}`);
            if (callback) {
                const app = this;
                JQuery(`#${name}${`-slider`}`).on(`input`, function() {
                    const parse = parseFloat(JQuery(this).val());
                    JQuery(`#${name}-value`).text(parse);
                    gameSetupTheme[name] = parse;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = parse;
                    }
                    app[callback]();
                });
            } else {
                JQuery(`#${name}${`-slider`}`).on('input', function() {
                    const parse = parseFloat(JQuery(this).val());
                    JQuery(`#${name}${`-value`}`).text(parse);
                    gameSetupTheme[name] = parse;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = parse;
                    }
                });
            }
        },
        addInputBox(id, name, holder, callback) {
            JQuery(id).append(`${`<div class="input-box"><span class="title-box">` + textLanguage[name] + `</span><input id="` + name + `" class="form-control" placeholder="` + holder}" value="${gameSetupTheme[name]}${`" /></div>`}`);
            const app = this;
            JQuery(`#${name}`).on(`input`, function() {
                gameSetupTheme[name] = this.value;
                app[callback]();
            });
        },
        addCursorBox(id, url) {
            if (url === gameSetupTheme.customCursor) {
                JQuery(id).append(`<div class="cursor-box"><a href="#" class="active"><img src="` + url + `"></a></div>`);
            } else {
                JQuery(id).append(`<div class="cursor-box"><a href="#"><img src="` + url + `"></a></div>`);
            }
        },
        setFont(name, fontFamily) {
            gameSetupTheme[name] = fontFamily;
            gameSetupTheme[`${name}Family`] = this.setFontFamily(fontFamily);
            gameSetupTheme[name + `Weight`] = this.setFontWeight(fontFamily);
            if (ogario.hasOwnProperty(name + `Family`)) {
                ogario[name + `Family`] = gameSetupTheme[name + `Family`];
            }
            if (ogario.hasOwnProperty(`${name}Weight`)) {
                ogario[`${name}Weight`] = gameSetupTheme[`${name}Weight`];
            }
        },
        addFontBox(id, name, callback) {
            JQuery(id).append(`${`<div class="font-box"><span class="title-box">` + textLanguage[name]}</span><div class="select-wrapper"><select id="${name}" class="form-control"></select></div></div>`);
            JQuery(`#${name}`).append(`<option value="ubuntu">Ubuntu</option><option value="ubuntu-bold">Ubuntu Bold</option>`);
            JQuery(`#${name}`).append(`<option value="roboto">Roboto</option><option value="roboto-bold">Roboto Bold</option>`);
            JQuery(`#${name}`).append('<option value="oswald">Oswald</option><option value="oswald-bold">Oswald Bold</option>');
            JQuery(`#${name}`).val(gameSetupTheme[name]);
            const app = this;
            if (callback) {
                JQuery(`#${name}`).on('change', function() {
                    const value = this.value;
                    app.setFont(name, value);
                    app[callback]();
                });
            } else {
                JQuery(`#${name}`).on(`change`, function() {
                    const value = this.value;
                    app.setFont(name, value);
                });
            }
        },
        setFontFamily(name) {
            if (name.indexOf(`roboto`) != -1) {
                return `Roboto`;
            } else if (name.indexOf(`oswald`) != -1) {
                return `Oswald`;
            } else {
                return 'Ubuntu';
            }
        },
        setFontWeight(name) {
            if (name.indexOf(`bold`) != -1) {
                return 700;
            }
            return 400;
        },
        setThemeMenu() {
            const app = this;
            JQuery(`#theme`).append(`<ul class="submenu-tabs"><li class="theme-main-tab active"><a href="#theme-main" class="active ogicon-paint-format" data-toggle="tab-tooltip" title="${textLanguage.basicTheming}${`"></a></li><li class="theme-menu-tab"><a href="#theme-menu" class="ogicon-menu" data-toggle="tab-tooltip" title="`}${textLanguage.menuTheming}${`"></a></li><li class="theme-hud-tab"><a href="#theme-hud" class="ogicon-display" data-toggle="tab-tooltip" title="`}${textLanguage.hudTheming}${`"></a></li><li class="theme-chat-tab"><a href="#theme-chat" class="ogicon-bubbles" data-toggle="tab-tooltip" title="`}${textLanguage.chatTheming}"></a></li><li class="theme-minimap-tab"><a href="#theme-minimap" class="ogicon-location2" data-toggle="tab-tooltip" title="${textLanguage.miniMapTheming}${`"></a></li><li class="theme-images-tab"><a href="#theme-images" class="ogicon-compass" data-toggle="tab-tooltip" title="`}${textLanguage.imagesTheming}"></a></li></ul><div id="theme-main" class="submenu-panel"></div><div id="theme-menu" class="submenu-panel"></div><div id="theme-hud" class="submenu-panel"></div><div id="theme-chat" class="submenu-panel"></div><div id="theme-minimap" class="submenu-panel"></div><div id="theme-images" class="submenu-panel"></div>`);
            this.addPresetBox(`#theme-main`, `themePreset`, gameTheme, `preset`, `changeThemePreset`);
            this.addColorBox('#theme-main', `bgColor`, `setBgColor`);
            this.addColorBox(`#theme-main`, `bordersColor`);
            this.addColorBox(`#theme-main`, `gridColor`);
            this.addColorBox('#theme-main', `sectorsColor`);
            this.addColorBox(`#theme-main`, 'namesColor');
            this.addColorBox('#theme-main', `namesStrokeColor`);
            this.addColorBox(`#theme-main`, `massColor`);
            this.addColorBox(`#theme-main`, `massStrokeColor`);
            this.addColorBox(`#theme-main`, `virusColor`);
            this.addColorBox(`#theme-main`, `virusStrokeColor`);
            this.addColorBox(`#theme-main`, 'foodColor', `setFoodColor`);
            this.addColorBox(`#theme-main`, `teammatesIndColor`, 'setIndicatorColor');
            this.addColorBox(`#theme-main`, `cursorTrackingColor`);
            this.addColorBox(`#theme-main`, `splitRangeColor`);
            this.addColorBox('#theme-main', `safeAreaColor`);
            this.addColorBox(`#theme-main`, `dangerAreaColor`);
            this.addFontBox(`#theme-main`, 'namesFont');
            this.addFontBox(`#theme-main`, `massFont`);
            this.addFontBox(`#theme-main`, `sectorsFont`);
            this.addSliderBox(`#theme-main`, `sectorsFontSize`, 200, 2000, 10);
            this.addSliderBox(`#theme-main`, `namesScale`, 0.5, 2, 0.1);
            this.addSliderBox(`#theme-main`, `massScale`, 1, 5, 1);
            this.addSliderBox(`#theme-main`, `virMassScale`, 1, 5, 1);
            this.addSliderBox('#theme-main', 'strokeScale', 1, 4, 0.1);
            this.addSliderBox(`#theme-main`, 'foodSize', 1, 50, 1, `setFoodColor`);
            this.addSliderBox(`#theme-main`, `virusStrokeSize`, 2, 40, 1);
            this.addSliderBox('#theme-main', `bordersWidth`, 2, 200, 2);
            this.addSliderBox(`#theme-main`, `sectorsWidth`, 2, 200, 2);
            this.addSliderBox(`#theme-main`, `cellsAlpha`, 0.01, 0.99, 0.01);
            this.addSliderBox(`#theme-main`, `skinsAlpha`, 0.01, 0.99, 0.01);
            this.addSliderBox('#theme-main', `virusAlpha`, 0, 1, 0.01);
            this.addSliderBox(`#theme-main`, 'textAlpha', 0.1, 1, 0.01);
            this.addPresetBox(`#theme-menu`, 'menuPreset', themeSetup, `menuPreset`, 'changeMenuPreset');
            this.addSliderBox(`#theme-menu`, `menuOpacity`, 0.1, 1, 0.01, `setMenuOpacity`);
            this.addColorBox(`#theme-menu`, `menuMainColor`, `setMenuMainColor`);
            this.addColorBox(`#theme-menu`, `menuBtnTextColor`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `menuPanelColor`, `setMenuPanelColor`);
            this.addColorBox('#theme-menu', `menuPanelColor2`, `setMenuPanelColor`);
            this.addColorBox(`#theme-menu`, `menuTextColor`, `setMenuTextColor`);
            this.addColorBox(`#theme-menu`, 'menuTextColor2', `setMenuTextColor`);
            this.addColorBox(`#theme-menu`, `btn1Color`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `btn1Color2`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, 'btn2Color', `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `btn2Color2`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `btn3Color`, 'setMenuButtons');
            this.addColorBox(`#theme-menu`, `btn3Color2`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `btn4Color`, `setMenuButtons`);
            this.addColorBox(`#theme-menu`, `btn4Color2`, `setMenuButtons`);
            this.addInputBox(`#theme-menu`, `menuBg`, `Image URL`, `setMenuBg`);
            this.addColorBox(`#theme-hud`, `hudMainColor`, `setHudColors`);
            this.addRgbaColorBox(`#theme-hud`, 'hudColor', 'setHudColors');
            this.addColorBox(`#theme-hud`, 'hudTextColor', 'setHudColors');
            this.addColorBox('#theme-hud', `statsHudColor`, `setHudColors`);
            this.addColorBox(`#theme-hud`, `timeHudColor`, 'setHudColors');
            this.addColorBox(`#theme-hud`, `top5MassColor`, `setHudColors`);
            this.addColorBox(`#theme-hud`, `lbMeColor`, 'setHudColors');
            this.addColorBox(`#theme-hud`, `lbTeammateColor`, `setHudColors`);
            this.addFontBox(`#theme-hud`, `hudFont`, `setHudFont`);
            this.addSliderBox('#theme-hud', 'hudScale', 1, 2, 0.01, `setHudScale`);
            this.addRgbaColorBox('#theme-chat', `messageColor`, `setChatColors`);
            this.addColorBox(`#theme-chat`, `messageTextColor`, 'setChatColors');
            this.addColorBox(`#theme-chat`, `messageTimeColor`, `setChatColors`);
            this.addColorBox('#theme-chat', `messageNickColor`, `setChatColors`);
            this.addRgbaColorBox(`#theme-chat`, `commandsColor`, 'setChatColors');
            this.addColorBox('#theme-chat', `commandsTextColor`, 'setChatColors');
            this.addColorBox(`#theme-chat`, `commandsTimeColor`, 'setChatColors');
            this.addColorBox(`#theme-chat`, `commandsNickColor`, `setChatColors`);
            this.addRgbaColorBox(`#theme-chat`, `chatBoxColor`, `setChatColors`);
            this.addSliderBox(`#theme-chat`, `chatScale`, 1, 2, 0.01, `setChatScale`);
            this.addColorBox(`#theme-minimap`, `miniMapSectorsColor`, `setMiniMapSectorsColor`);
            this.addColorBox(`#theme-minimap`, `miniMapSectorColor`);
            this.addColorBox(`#theme-minimap`, `miniMapNickColor`);
            this.addColorBox(`#theme-minimap`, `miniMapNickStrokeColor`);
            this.addColorBox(`#theme-minimap`, `miniMapMyCellColor`);
            this.addColorBox(`#theme-minimap`, `miniMapMyCellStrokeColor`);
            this.addColorBox(`#theme-minimap`, `miniMapTeammatesColor`);
            this.addColorBox(`#theme-minimap`, `miniMapDeathLocationColor`);
            this.addColorBox(`#theme-minimap`, `miniMapGuidesColor`);
            this.addFontBox(`#theme-minimap`, `miniMapFont`, `setMiniMapFont`);
            this.addFontBox(`#theme-minimap`, 'miniMapNickFont');
            this.addSliderBox('#theme-minimap', 'miniMapWidth', 200, 400, 2, 'setMiniMapWidth');
            this.addSliderBox(`#theme-minimap`, `miniMapSectorsOpacity`, 0, 1, 0.01, `setMiniMapSectorsOpacity`);
            this.addSliderBox(`#theme-minimap`, `miniMapNickSize`, 8, 16, 1);
            this.addSliderBox(`#theme-minimap`, `miniMapNickStrokeSize`, 0, 6, 1);
            this.addSliderBox(`#theme-minimap`, `miniMapMyCellSize`, 4, 10, 0.5);
            this.addSliderBox(`#theme-minimap`, `miniMapMyCellStrokeSize`, 0, 10, 1);
            this.addSliderBox(`#theme-minimap`, 'miniMapTeammatesSize', 4, 10, 0.5);
            this.addInputBox(`#theme-images`, `customBackground`, `Image URL`, `setCustomBackground`);
            this.addInputBox(`#theme-images`, `customCursor`, `Cursor image URL`, 'setCustomCursor');
            const cursorUrl = `https://cdn.ogario.ovh/static/img/cursors/cursor_`;
            for (let length = 0; length < 35; length++) {
                if (length < 9) {
                    this.addCursorBox(`#theme-images`, `${cursorUrl}0${length + 1}.cur`);
                    continue;
                }
                this.addCursorBox(`#theme-images`, `${cursorUrl}${length + 1}${`.cur`}`);
            }
            JQuery(document).on(`click`, `#theme-images .cursor-box a`, function(event) {
                event.preventDefault();
                const url = JQuery(`img`, this).attr(`src`);
                gameSetupTheme.customCursor = url;
                app.setCustomCursor();
                JQuery(`#customCursor`).val(url);
                JQuery(`#theme-images .cursor-box a`).removeClass(`active`);
                JQuery(this).addClass(`active`);
            });
            JQuery(`#theme`).append(`<button class="btn btn-block btn-success btn-save"">` + textLanguage.saveSett + `</button>`);
            JQuery(document).on('click', `#theme .btn-save`, function(event) {
                event.preventDefault();
                const theme = JQuery(this);
                theme.text(textLanguage.saved);
                app.saveThemeSettings();
                setTimeout(() => {
                    theme.text(textLanguage.saveSett);
                }, 500);
            });
            JQuery(`#theme`).append(`<div class="restore-settings"><a href="#">` + textLanguage.restoreThemeSettings + `</a></div>`);
            JQuery(document).on(`click`, `#theme .restore-settings a`, event => {
                event.preventDefault();
                app.restoreThemeSettings();
            });
            JQuery(`.skin`).colorpicker({
                format: `hex`,
                input: `#color`
            });
        },
        changePreset(names, theme) {
            if (theme[names]) {
                gameSetupTheme[names] = names;
                var names = theme[names];
            } else {
                return;
            }
            for (const name in names) {
                if (names.hasOwnProperty(name) && gameSetupTheme.hasOwnProperty(name)) {
                    gameSetupTheme[name] = names[name];
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = gameSetupTheme[name];
                    }
                    if (JQuery(`#theme .` + name + `-picker`)) {
                        JQuery(`#theme .` + name + `-picker`).colorpicker(`setValue`, gameSetupTheme[name]);
                    }
                    if (JQuery(`#${name}${`-slider`}`)) {
                        JQuery(`#${name}${`-slider`}`).val(gameSetupTheme[name]).change();
                    }
                    if (JQuery(`input[type=text]#${name}`) || JQuery(`select#` + name)) {
                        JQuery(`#${name}`).val(gameSetupTheme[name]);
                    }
                }
            }
        },
        changeThemePreset(name) {
            this.changePreset(name, gameTheme);
            this.setTheme();
        },
        setFonts() {
            this.setFont(`namesFont`, gameSetupTheme.namesFont);
            this.setFont('massFont', gameSetupTheme.namesFont);
            this.setFont('sectorsFont', gameSetupTheme.sectorsFont);
        },
        setBgColor() {
            JQuery(`body`).css('background-color', gameSetupTheme.bgColor);
        },
        setFoodColor() {
            if (!gameOptionSettings.optimizedFood) {
                return;
            }
            drawRender && drawRender.preDrawPellet();
        },
        setIndicatorColor() {
            drawRender && drawRender.preDrawIndicator();
        },
        setCustomBackground() {
            if (gameSetupTheme.customBackground) {
                JQuery('body').css(`background-image`, `${`url(` + gameSetupTheme.customBackground})`);
            } else {
                JQuery('body').css('background-image', `none`);
            }
        },
        setCustomCursor() {
            if (gameSetupTheme.customCursor) {
                var css = `*{cursor:url(` + gameSetupTheme.customCursor + `), auto !important}`;
            } else {
                var css = '*{cursor: auto}';
            }
            this.addCustomCSS(`cursorCSS`, css);
        },
        setMenu() {
            this.setMenuOpacity();
            this.setMenuMainColor();
            this.setMenuPanelColor();
            this.setMenuTextColor();
            this.setMenuButtons();
            this.setMenuBg();
        },
        changeMenuPreset(name) {
            this.changePreset(name, themeSetup);
            this.setMenu();
        },
        setMenuOpacity() {
            JQuery('#helloContainer, #hotkeys, #exp-imp').css('opacity', gameSetupTheme.menuOpacity);
        },
        setMenuMainColor() {
            const css = `::-moz-selection{background-color:` + gameSetupTheme.menuMainColor + `!important}::selection{background-color:` + gameSetupTheme.menuMainColor + `!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:` + gameSetupTheme.menuMainColor + `}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:` + gameSetupTheme.menuMainColor + `}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:` + gameSetupTheme.menuMainColor + `}.ps-scrollbar-y{background-color:` + gameSetupTheme.menuMainColor + `!important}`;
            this.addCustomCSS(`menuMainColorCSS`, css);
        },
        setMenuPanelColor() {
            const css = `${`#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ` + gameSetupTheme.menuPanelColor + `}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ` + gameSetupTheme.menuPanelColor2 + `}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ` + gameSetupTheme.menuPanelColor2}}.quick:hover,#skins a,#profiles{color:${gameSetupTheme.menuPanelColor2}}input.stream-mode,input.hide-url{color:${gameSetupTheme.menuPanelColor2}!important}`;
            this.addCustomCSS('menuPanelColorCSS', css);
        },
        setMenuTextColor() {
            const css = `${`.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:` + gameSetupTheme.menuTextColor + `}#skins a.default:hover{border-color:` + gameSetupTheme.menuTextColor + `}::-webkit-input-placeholder{color:` + gameSetupTheme.menuTextColor2 + `!important}::-moz-placeholder{color:` + gameSetupTheme.menuTextColor2 + `!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:` + gameSetupTheme.menuTextColor2 + `}#hotkeys-cfg .command-in,#theme .color-box{border-color:` + gameSetupTheme.menuTextColor2}}`;
            this.addCustomCSS(`menuTextColorCSS`, css);
        },
        setMenuButtons() {
            const css = `${`a,a:hover{color:` + gameSetupTheme.btn1Color}}.btn,#hotkeys-cfg .custom-key-in{color:${gameSetupTheme.menuBtnTextColor}${`}.btn-primary{background-color:`}${gameSetupTheme.btn1Color}${`!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:`}${gameSetupTheme.btn1Color2}${`!important}.btn-success{background-color:`}${gameSetupTheme.btn2Color}${`!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:`}${gameSetupTheme.btn2Color2}!important}.btn-warning{background-color:${gameSetupTheme.btn3Color}${`!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:`}${gameSetupTheme.btn3Color2}${`!important}.btn-danger{background-color:`}${gameSetupTheme.btn4Color}!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:${gameSetupTheme.btn4Color2}${`!important}#hotkeys-cfg .custom-key-in{background-color:`}${gameSetupTheme.btn4Color2}${`;border-color:`}${gameSetupTheme.btn4Color2}}`;
            this.addCustomCSS(`menuButtonsCSS`, css);
        },
        setMenuBg() {
            JQuery(`#menuBg`).val(gameSetupTheme.menuBg);
            if (gameSetupTheme.menuBg) {
                JQuery('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css(`background-image`, `${`url(` + gameSetupTheme.menuBg})`);
            } else {
                JQuery('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css(`background-image`, `none`);
            }
        },
        setHud() {
            this.setHudColors();
            this.setHudFont();
            this.setHudScale();
        },
        setHudColors() {
            const css = `${`.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:` + gameSetupTheme.hudMainColor + `}.hud,.hud-b,#chat-emoticons{background-color:` + gameSetupTheme.hudColor + `}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:` + gameSetupTheme.hudTextColor}}.stats-hud-color{color:${gameSetupTheme.statsHudColor}${`}.time-hud-color{color:`}${gameSetupTheme.timeHudColor}${`}.top5-mass-color{color:`}${gameSetupTheme.top5MassColor}${`}#leaderboard-positions .me{color:`}${gameSetupTheme.lbMeColor}${`}#leaderboard-positions .teammate{color:`}${gameSetupTheme.lbTeammateColor}}`;
            this.addCustomCSS('hudCSS', css);
        },
        setHudFont() {
            this.setFont('hudFont', gameSetupTheme.hudFont);
            JQuery('#overlays-hud').css({
                'font-family': gameSetupTheme.hudFontFamily,
                'font-weight': gameSetupTheme.hudFontWeight
            });
        },
        setHudScale() {
            const overlays = Math.round(20 * gameSetupTheme.hudScale);
            const leadeboard = Math.round(200 * gameSetupTheme.hudScale);
            const top5 = Math.floor(55 * gameSetupTheme.hudScale);
            const top5_pos = Math.floor(6 * gameSetupTheme.hudScale);
            const time = Math.floor(280 * gameSetupTheme.hudScale);
            const pause = Math.floor(85 * gameSetupTheme.hudScale);
            const target = Math.floor(20 * gameSetupTheme.hudScale);
            JQuery('#overlays-hud').css(`font-size`, `${overlays}px`);
            JQuery('#leaderboard-hud, #time-hud', '#botClient').width(leadeboard);
            JQuery(`#top5-hud`).width(leadeboard + 30).css(`top`, `${top5}px`);
            JQuery(`#top5-pos`).css('padding-left', `${top5_pos}px`);
            JQuery(`#time-hud`).css(`top`, `${time}px`);
            JQuery(`#pause-hud`).css(`top`, `${pause}px`);
            JQuery(`#target-hud`).css('padding-top', `${target}px`);
        },
        setChat() {
            this.setChatColors();
            this.setChatScale();
        },
        setChatColors() {
            const css = `${`#message,#messages li,.toast-success{background-color:` + gameSetupTheme.messageColor + `}#message,.message-text,.toast-success .message-text{color:` + gameSetupTheme.messageTextColor + `}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:` + gameSetupTheme.messageNickColor + `}.message-time{color:` + gameSetupTheme.messageTimeColor}}.toast-warning{background-color:${gameSetupTheme.commandsColor}${`}.command-text,.toast-warning .command-text{color:`}${gameSetupTheme.commandsTextColor}${`}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:`}${gameSetupTheme.commandsNickColor}${`}.command-time{color:`}${gameSetupTheme.commandsTimeColor}${`}#chat-box{background-color:`}${gameSetupTheme.chatBoxColor}}`;
            this.addCustomCSS(`chatCSS`, css);
        },
        setChatScale() {
            const message = Math.round(14 * gameSetupTheme.chatScale);
            const toastContainer = Math.round(280 * gameSetupTheme.chatScale);
            const messageBox = Math.round(350 * gameSetupTheme.chatScale);
            const chatBox = Math.round(300 * gameSetupTheme.chatScale);
            const userList = Math.floor(14 * gameSetupTheme.chatScale);
            JQuery(`#message-box, #messages, #toast-container, #chat-box`).css(`font-size`, `${message}px`);
            JQuery('#messages, #toast-container, #chat-box').width(toastContainer);
            JQuery(`#message-box`).width(messageBox);
            JQuery(`#chat-box`).height(chatBox);
            JQuery('.user-list').css(`padding-left`, `${userList}px`);
            const css = `#toast-container{width:` + toastContainer + `px;font-size:` + message + `px}`;
            this.addCustomCSS(`chatScaleCSS`, css);
        },
        setMiniMap() {
            this.setMiniMapFont();
            this.setMiniMapWidth();
            this.setMiniMapSectorsOpacity();
        },
        setMiniMapFont() {
            this.setFont(`miniMapFont`, gameSetupTheme.miniMapFont);
            application && application.resetMiniMapSectors();
        },
        setMiniMapWidth() {
            const resizeWidth = gameSetupTheme.miniMapWidth / 200;
            gameSetupTheme.miniMapTop = Math.round(20 * resizeWidth);
            JQuery('#minimap-hud').css({
                width: gameSetupTheme.miniMapWidth,
                height: gameSetupTheme.miniMapWidth + gameSetupTheme.miniMapTop
            });
            application && application.resetMiniMapSectors();
        },
        setMiniMapSectorsColor() {
            application && application.resetMiniMapSectors();
        },
        setMiniMapSectorsOpacity() {
            JQuery('#minimap-sectors').css(`opacity`, gameSetupTheme.miniMapSectorsOpacity);
        },
        setTheme() {
            this.setFonts();
            this.setBgColor();
            this.setCustomBackground();
            this.setCustomCursor();
            this.setMenu();
            this.setHud();
            this.setChat();
            this.setMiniMap();
        },
        init() {
            this.loadThemeSettings();
        }
    };
    let PlayerProfiles = [];
    const mainProfile = {
        nick: `I <3 OGARio`,
        clanTag: 'Ⓜ',
        skinURL: '',
        color: gameSetupTheme.mainColor
    };
    var gameOptionSettings = {
        quickResp: true,
        autoResp: false,
        autoZoom: false,
        autoHideNames: true,
        autoHideMass: true,
        autoHideFood: false,
        autoHideFoodOnZoom: false,
        noNames: false,
        optimizedNames: true,
        hideMyName: true,
        hideTeammatesNames: false,
        showMass: true,
        optimizedMass: true,
        shortMass: true,
        virMassShots: true,
        hideMyMass: false,
        hideEnemiesMass: false,
        vanillaSkins: false,
        customSkins: true,
        myTransparentSkin: false,
        myCustomColor: false,
        transparentCells: false,
        transparentViruses: true,
        transparentSkins: false,
        showGrid: false,
        showBgSectors: false,
        showMapBorders: true,
        showGhostCells: true,
        showMiniMap: true,
        showMiniMapGrid: false,
        showMiniMapGuides: true,
        showMiniMapGhostCells: false,
        oneColoredTeammates: false,
        optimizedFood: true,
        rainbowFood: false,
        oppColors: false,
        oppRings: false,
        virColors: false,
        splitRange: false,
        virusesRange: false,
        textStroke: false,
        namesStroke: false,
        massStroke: false,
        cursorTracking: false,
        teammatesInd: false,
        mouseSplit: false,
        mouseFeed: false,
        mouseInvert: false,
        disableChat: false,
        hideChat: false,
        chatSounds: true,
        chatEmoticons: true,
        showChatBox: false,
        showChatImages: true,
        showChatVideos: true,
        showTop5: true,
        showTargeting: true,
        showLbData: true,
        showTime: true,
        normalLb: false,
        centeredLb: true,
        fpsAtTop: true,
        showStats: true,
        showStatsMass: true,
        showStatsSTE: false,
        showStatsN16: false,
        showStatsFPS: true,
        blockPopups: false,
        streamMode: false,
        hideSkinUrl: false,
        showQuickMenu: true,
        showSkinsPanel: true,
        animation: 140,
        zoomSpeedValue: 0.9,
        messageSound: `https://cdn.ogario.ovh/static/sounds/notification_01.mp3`,
        commandSound: `https://cdn.ogario.ovh/static/sounds/notification_02.mp3`
    };

    function minimap(id, name, skinID, skinUrl) {
        this.id = id;
        this.nick = name;
        this.skinID = skinID;
        this.skinURL = skinUrl;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.mass = 0;
        this.clanTag = '';
        this.color = null;
        this.customColor = gameSetupTheme.miniMapTeammatesColor;
        this.alive = false;
        this.updateTime = null;
        this.pi2 = 2 * Math.PI;
        this.setColor = function(color, customColor) {
            this.color = color;
            if (customColor.length == 7) {
                this.customColor = customColor;
            }
        };
        this.drawPosition = function(ctx, offset, size, privateMap, targetID) {
            if (!this.alive || privateMap && targetID && this.id != targetID) {
                return;
            }
            this.lastX = (29 * this.lastX + this.x) / 30;
            this.lastY = (29 * this.lastY + this.y) / 30;
            const posX = (this.lastX + offset) * size;
            const posY = (this.lastY + offset) * size;
            if (this.nick.length > 0) {
                ctx.font = `${gameSetupTheme.miniMapNickFontWeight} ${gameSetupTheme.miniMapNickSize}${`px `}${gameSetupTheme.miniMapNickFontFamily}`;
                ctx.textAlign = `center`;
                if (gameSetupTheme.miniMapNickStrokeSize > 0) {
                    ctx.lineWidth = gameSetupTheme.miniMapNickStrokeSize;
                    ctx.strokeStyle = gameSetupTheme.miniMapNickStrokeColor;
                    ctx.strokeText(this.nick, posX, posY - (gameSetupTheme.miniMapTeammatesSize * 2 + 2));
                }
                ctx.fillStyle = gameSetupTheme.miniMapNickColor;
                ctx.fillText(this.nick, posX, posY - (gameSetupTheme.miniMapTeammatesSize * 2 + 2));
            }
            ctx.beginPath();
            ctx.arc(posX, posY, gameSetupTheme.miniMapTeammatesSize, 0, this.pi2, false);
            ctx.closePath();
            if (gameOptionSettings.oneColoredTeammates) {
                ctx.fillStyle = gameSetupTheme.miniMapTeammatesColor;
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fill();
        };
    }
    const application = {
        name: `OGARio by szymy v4`,
        version: `v4 (4.0.0 b38)`,
        privateMode: false,
        protocolMode: true,
        publicIP: `wss://srv.ogario.eu`,
        privateIP: null,
        updateInterval: 1000,
        updateTick: 0,
        updateMaxTick: 2,
        currentSector: '',
        miniMap: null,
        miniMapCtx: null,
        miniMapSectors: null,
        pi2: 2 * Math.PI,
        socket: null,
        cells: {},
        teamPlayers: [],
        parties: [],
        chatHistory: [],
        chatUsers: {},
        chatMutedUsers: {},
        chatMutedUserIDs: [],
        customSkinsCache: {},
        customSkinsMap: {},
        cacheQueue: [],
        deathLocations: [],
        playerID: null,
        playerMass: 0,
        selectedProfile: 0,
        lastDeath: 0,
        skipServerData: false,
        gameMode: `:ffa`,
        region: '',
        partyToken: '',
        ws: '',
        serverIP: '',
        serverArena: '',
        serverToken: '',
        lastSentNick: '',
        lastSentClanTag: null,
        lastSentSkinURL: '',
        lastSentCustomColor: '',
        lastSentPartyToken: '',
        lastSentServerToken: '',
        lastMessageSentTime: Date.now(),
        rFps: 0,
        renderedFrames: 0,
        fpsLastRequest: null,
        statsHUD: null,
        leaderboardPositionsHUD: null,
        leaderboardDataHUD: null,
        activeParties: null,
        top5pos: null,
        top5totalMass: null,
        top5totalPlayers: null,
        top5limit: 5,
        timeHUD: null,
        questHUD: null,
        retryResp: 0,
        token: 'b2dhcmlvLm92aA==',
        canvasScale: 1,
        selectBiggestCell: true,
        noColors: false,
        skipStats: false,
        showQuest: false,
        showSplitInd: false,
        pause: false,
        targetID: 0,
        targetStatus: 0,
        targetNick: '',
        targetSkinURL: '',
        targeting: false,
        privateMiniMap: false,
        messageSound: null,
        commandSound: null,
        feedInterval: null,
        getPlayerX() {
            return ogario.playerX + ogario.mapOffsetX;
        },
        getPlayerY() {
            return ogario.playerY + ogario.mapOffsetY;
        },
        feed() {
            window.core && window.core.eject && window.core.eject();
        },
        macroFeed(on) {
            if (on) {
                if (this.feedInterval) {
                    return;
                }
                const app = this;
                this.feed();
                this.feedInterval = setInterval(() => {
                    app.feed();
                }, 80);
            } else {
                if (this.feedInterval) {
                    clearInterval(this.feedInterval);
                    this.feedInterval = null;
                }
            }
        },
        split() {
            window.core && window.core.split && window.core.split();
        },
        doubleSplit() {
            const app = this;
            app.split();
            setTimeout(() => {
                app.split();
            }, 40);
        },
        popSplit() {
            const app = this;
            app.split();
            setTimeout(() => {
                app.split();
            }, 200);
        },
        split16() {
            const app = this;
            app.split();
            setTimeout(() => {
                app.split();
            }, 40);
            setTimeout(() => {
                app.split();
            }, 80);
            setTimeout(() => {
                app.split();
            }, 120);
        },
        toggleSkins() {
            if (ogario.vanillaSkins && ogario.customSkins) {
                ogario.vanillaSkins = false;
            } else if (!ogario.vannillaSkins && ogario.customSkins) {
                ogario.vanillaSkins = true;
                ogario.customSkins = false;
            } else {
                ogario.vanillaSkins = true;
                ogario.customSkins = true;
            }
        },
        toggleCells() {
            this.selectBiggestCell = !this.selectBiggestCell;
            ogario.selectBiggestCell = this.selectBiggestCell;
        },
        setShowTop5() {
            gameOptionSettings.showTop5 = !gameOptionSettings.showTop5;
            this.setTop5();
        },
        setTop5() {
            if (gameOptionSettings.showTop5) {
                JQuery(`#top5-hud`).show();
            } else {
                JQuery('#top5-hud').hide();
            }
        },
        setShowTargeting() {
            gameOptionSettings.showTargeting = !gameOptionSettings.showTargeting;
            this.setTargetingHUD();
        },
        setTargetingHUD() {
            if (gameOptionSettings.showTargeting) {
                JQuery('#target-hud, #target-panel-hud').show();
            } else {
                JQuery('#target-hud, #target-panel-hud').hide();
            }
        },
        setShowTime() {
            gameOptionSettings.showTime = !gameOptionSettings.showTime;
            if (gameOptionSettings.showTime) {
                JQuery(`#time-hud`).show();
                this.displayTime();
            } else {
                JQuery(`#time-hud`).hide();
            }
        },
        setShowSplitRange() {
            gameOptionSettings.splitRange = !gameOptionSettings.splitRange;
            ogario.splitRange = gameOptionSettings.splitRange;
        },
        setShowSplitInd() {
            this.showSplitInd = !this.showSplitInd;
            gameOptionSettings.splitRange = this.showSplitInd;
            gameOptionSettings.oppRings = this.showSplitInd;
            ogario.splitRange = gameOptionSettings.splitRange;
            ogario.oppRings = gameOptionSettings.oppRings;
        },
        setShowTeammatesInd() {
            gameOptionSettings.teammatesInd = !gameOptionSettings.teammatesInd;
        },
        setShowOppColors() {
            gameOptionSettings.oppColors = !gameOptionSettings.oppColors;
            ogario.oppColors = gameOptionSettings.oppColors;
        },
        setShowSkins() {
            this.noSkins = !this.noSkins;
            window.core && window.core.setSkins && window.core.setSkins(!this.noSkins);
            ogario.showCustomSkins = !this.noSkins;
            this.displayChatInfo(!this.noSkins, `showSkinsMsg`);
        },
        setTransparentSkins() {
            gameOptionSettings.transparentSkins = !gameOptionSettings.transparentSkins;
            ogario.transparentSkins = gameOptionSettings.transparentSkins;
        },
        setShowStats() {
            JQuery(`#stats-hud`).toggle();
        },
        setShowFood() {
            ogario.showFood = !ogario.showFood;
        },
        setShowHUD() {
            JQuery(`#overlays-hud`).toggle();
        },
        setShowGrid() {
            gameOptionSettings.showGrid = !gameOptionSettings.showGrid;
        },
        setShowMiniMapGuides() {
            gameOptionSettings.showMiniMapGuides = !gameOptionSettings.showMiniMapGuides;
        },
        setShowLb() {
            if (this.gameMode === `:teams`) {
                return;
            }
            JQuery(`#leaderboard-hud`).toggle();
        },
        setShowBgSectors() {
            gameOptionSettings.showBgSectors = !gameOptionSettings.showBgSectors;
        },
        setHideSmallBots() {
            ogario.hideSmallBots = !ogario.hideSmallBots;
            this.displayChatInfo(!ogario.hideSmallBots, `hideSmallBotsMsg`);
        },
        setShowNames() {
            gameOptionSettings.noNames = !gameOptionSettings.noNames;
        },
        setHideTeammatesNames() {
            gameOptionSettings.hideTeammatesNames = !gameOptionSettings.hideTeammatesNames;
        },
        setShowMass() {
            gameOptionSettings.showMass = !gameOptionSettings.showMass;
        },
        setShowMiniMap() {
            gameOptionSettings.showMiniMap = !gameOptionSettings.showMiniMap;
            this.setMiniMap();
        },
        setMiniMap() {
            if (gameOptionSettings.showMiniMap) {
                JQuery(`#minimap-hud`).show();
            } else {
                JQuery(`#minimap-hud`).hide();
            }
        },
        setShowQuest() {
            if (this.gameMode !== `:ffa`) {
                return;
            }
            this.showQuest = !this.showQuest;
            this.setQuest();
        },
        setQuest() {
            if (this.showQuest && this.gameMode === `:ffa`) {
                JQuery(`#quest-hud`).show();
            } else {
                JQuery(`#quest-hud`).hide();
            }
        },
        toggleAutoZoom() {
            ogario.autoZoom = !ogario.autoZoom;
            this.displayChatInfo(ogario.autoZoom, `autoZoomMsg`);
        },
        resetZoom(on) {
            if (on) {
                ogario.zoomResetValue = 1;
                ogario.zoomValue = 1;
            } else {
                ogario.zoomResetValue = 0;
            }
        },
        setZoom(value) {
            ogario.zoomValue = value;
        },
        toggleDeath() {
            this.lastDeath--;
            if (this.lastDeath < 0) {
                this.lastDeath = this.deathLocations.length - 1;
            }
        },
        tryResp() {
            if (ogario.play || this.retryResp == 20) {
                this.retryResp = 0;
                return;
            }
            this.retryResp++;
            const app = this;
            setTimeout(() => {
                if (JQuery(`.btn-play-guest`).is(`:visible`)) {
                    JQuery(`.btn-play-guest`).click();
                } else {
                    JQuery('.btn-play').click();
                }
                if (!ogario.play) {
                    app.tryResp();
                }
            }, 500);
        },
        quickResp() {
            if (!gameOptionSettings.quickResp) {
                return;
            }
            this.hideMenu();
            this.gameServerConnect(this.ws);
            ogario.play = false;
            this.tryResp();
        },
        autoResp() {
            if (!gameOptionSettings.autoResp) {
                return;
            }
            this.setAutoResp();
            JQuery('#overlays').stop().hide();
            if (JQuery('.btn-play-guest').is(`:visible`)) {
                JQuery(`.btn-play-guest`).click();
                return;
            }
            JQuery('.btn-play').click();
        },
        setAutoResp() {
            if (gameOptionSettings.autoResp) {
                if (!JQuery(`#skipStats`).prop(`checked`)) {
                    JQuery(`#skipStats`).click();
                    this.skipStats = true;
                }
            }
        },
        toggleAutoResp() {
            gameOptionSettings.autoResp = !gameOptionSettings.autoResp;
            this.setAutoResp();
            this.displayChatInfo(gameOptionSettings.autoResp, `autoRespMsg`);
        },
        copyLb() {
            const input = JQuery(`<input>`);
            JQuery(`body`).append(input);
            input.val(JQuery('#leaderboard-positions').text()).select();
            try {
                document.execCommand(`copy`);
            } catch (error) {
                console.log("can't copy..")
            }
            input.remove();
        },
        setPause() {
            this.pause = !this.pause;
            ogario.pause = this.pause;
            if (this.pause) {
                ogario.resetTargetPosition();
                JQuery(`#pause-hud`).show();
            } else {
                JQuery(`#pause-hud`).hide();
            }
        },
        setCenteredLb() {
            if (gameOptionSettings.centeredLb) {
                JQuery(`#leaderboard-hud`).addClass('hud-text-center');
            } else {
                JQuery(`#leaderboard-hud`).removeClass('hud-text-center');
            }
        },
        setNormalLb() {
            if (gameOptionSettings.normalLb) {
                JQuery(`#leaderboard-hud h4`).html(textLanguage.leaderboard);
            } else {
                JQuery('#leaderboard-hud h4').html(`ogario.ovh`);
            }
        },
        setFpsAtTop() {
            if (gameOptionSettings.fpsAtTop) {
                JQuery('#stats-hud').removeClass('hud-bottom').addClass(`hud-top`);
            } else {
                JQuery(`#stats-hud`).removeClass(`hud-top`).addClass(`hud-bottom`);
            }
        },
        setBlockPopups() {
            if (this.protocolMode) {
                JQuery(`#block-warn`).hide();
                return;
            }
            if (gameOptionSettings.blockPopups) {
                this.blockPopups();
            } else {
                this.unblockPopups();
            }
        },
        blockPopups() {
            JQuery(`#openfl-content, #openfl-overlay`).hide();
            JQuery(`#openfl-content, #openfl-overlay`).addClass(`block-popups`);
            JQuery(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`).prop(`disabled`, true);
            JQuery(`#block-warn`).show();
        },
        unblockPopups() {
            JQuery(`#openfl-overlay.disabler`).click();
            JQuery(`#openfl-content, #openfl-overlay`).hide();
            JQuery(`#openfl-content, #openfl-overlay`).removeClass(`block-popups`);
            JQuery(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`).prop(`disabled`, false);
            JQuery(`#block-warn`).hide();
        },
        tempUnblockPopups() {
            if (!gameOptionSettings.blockPopups) {
                return;
            }
            this.unblockPopups();
        },
        displayLeaderboard(position, data = '') {
            if (!this.leaderboardPositionsHUD) {
                return;
            }
            this.leaderboardPositionsHUD.innerHTML = position;
            this.leaderboardDataHUD.innerHTML = data;
        },
        displayStats() {
            if (!gameOptionSettings.showStats) {
                JQuery(`#stats-hud`).hide();
                return;
            }
            let text = '';
            if (ogario.play) {
                if (gameOptionSettings.showStatsMass && ogario.playerMass) {
                    text += `${textLanguage.mass}: ${ogario.playerMass} | `;
                }
                if (ogario.playerScore) {
                    text += `${textLanguage.score}: ${ogario.playerScore}`;
                }
                if (gameOptionSettings.showStatsSTE && ogario.STE) {
                    text += ` | STE: ` + ogario.STE;
                }
                if (gameOptionSettings.showStatsN16 && ogario.playerSplitCells) {
                    text += ` | ` + ogario.playerSplitCells + `/16`;
                }
                if (gameOptionSettings.showStatsFPS) {
                    text += ` | `;
                }
            }
            if (gameOptionSettings.showStatsFPS) {
                text += `FPS: ` + drawRender.fps;
            }
            this.statsHUD.textContent = text;
            const app = this;
            setTimeout(() => {
                app.displayStats();
            }, 250);
        },
        displayTime() {
            if (!gameOptionSettings.showTime) {
                JQuery(`#time-hud`).hide();
                return;
            }
            const time = new Date().toLocaleString();
            this.timeHUD.textContent = time;
            const app = this;
            setTimeout(() => {
                app.displayTime();
            }, 1000);
        },
        displayParties() {
            let text = '';
            for (let length = 0; length < this.parties.length; length++) {
                text += `<li><a href="https://agar.io/#` + this.parties[length] + `" onclick="$('#party-token').val('` + this.parties[length] + `'); $('#join-party-btn-2').click();">https://agar.io/#` + this.parties[length] + `</a></li>`;
            }
            if (text === '') {
                this.activeParties.className = `no-parties`;
            } else {
                this.activeParties.className = '';
            }
            this.activeParties.innerHTML = text;
        },
        displayTop5() {
            if (!gameOptionSettings.showTop5) {
                return;
            }
            let text = '';
            let mass = 0;
            let top5length = this.top5.length;
            for (let length = 0; length < top5length; length++) {
                mass += this.top5[length].mass;
                if (length >= this.top5limit) {
                    continue;
                }
                text += `<li><span class="cell-counter" style="background-color: ${this.top5[length].color}">${length + 1}${`</span>`}`;
                if (gameOptionSettings.showTargeting) {
                    text += `<a href="#" data-user-id="` + this.top5[length].id + `" class="set-target ogicon-target"></a> `;
                }
                text += `<span class="hud-main-color">[` + this.calculateMapSector(this.top5[length].x, this.top5[length].y) + `]</span>`;
                text += `<span class="top5-mass-color">[${this.shortMassFormat(this.top5[length].mass)}${`]</span> `}${this.escapeHTML(this.top5[length].nick)}${`</li>`}`;
            }
            this.top5pos.innerHTML = text;
            if (ogario.play && ogario.playerMass) {
                mass += ogario.playerMass;
                top5length++;
            }
            this.top5totalMass.textContent = this.shortMassFormat(mass);
            this.top5totalPlayers.textContent = top5length;
        },
        setTop5limit(value) {
            if (!value) {
                return;
            }
            this.top5limit = value;
        },
        displayChatHistory(on) {
            if (on) {
                this.clearChatHistory(true);
                for (let length = 0; length < this.chatHistory.length; length++) {
                    JQuery(`#messages`).append(`<li><span class="message-nick">` + this.chatHistory[length].nick + `: </span><span class="message-text">` + this.chatHistory[length].message + `</span></li>`);
                }
                return;
            }
            this.clearChatHistory(false);
        },
        clearChatHistory(on) {
            JQuery(`#messages`).empty();
            if (on) {
                toastr.clear();
                if (gameOptionSettings.showChatBox) {
                    JQuery(`#chat-box .message`).remove();
                    this.chatHistory.length = 0;
                }
            }
        },
        displayChatInfo(on, info) {
            if (on) {
                toastr.info(textLanguage[`${info}A`]);
            } else {
                toastr.error(textLanguage[`${info}B`]);
            }
        },
        setDisableChat() {
            gameOptionSettings.hideChat = gameOptionSettings.disableChat;
            this.setHideChat();
        },
        hideChat() {
            gameOptionSettings.hideChat = !gameOptionSettings.hideChat;
            this.setHideChat();
            this.displayChatInfo(!gameOptionSettings.hideChat, `hideChatMsg`);
        },
        setHideChat() {
            if (gameOptionSettings.hideChat) {
                JQuery(`#message-box`).hide();
            }
            this.setShowChatBox();
        },
        setShowChatBox() {
            if (!gameOptionSettings.hideChat && gameOptionSettings.showChatBox) {
                JQuery('#chat-box').show();
            } else {
                JQuery(`#chat-box`).hide();
            }
        },
        enterChatMessage() {
            const messageBox = JQuery(`#message-box`);
            const message = JQuery(`#message`);
            if (!messageBox.is(`:visible`)) {
                messageBox.show();
                message.focus();
                message.val('');
            } else {
                const value = message.val();
                if (value.length) {
                    this.sendChatMessage(101, value);
                    if (ogario.play) {
                        message.blur();
                        messageBox.hide();
                    }
                } else {
                    message.blur();
                    messageBox.hide();
                }
                message.val('');
            }
        },
        showMenu(value) {
            if (window.MC && window.MC.showNickDialog) {
                JQuery('.ogario-menu').show();
                JQuery('.menu-panel').hide();
                if (!ogario.play && !this.skipStats) {
                    JQuery('#stats').show();
                } else {
                    JQuery(`#main-panel`).show();
                }
                window.MC.showNickDialog(300);
                JQuery('#oferwallContainer').is(`:visible`) && window.closeOfferwall();
                JQuery(`#videoContainer`).is(`:visible`) && window.closeVideoContainer();
                return;
            }
            if (value) {
                JQuery(`#overlays`).fadeIn(value);
            } else {
                JQuery(`#overlays`).show();
            }
        },
        hideMenu(value) {
            if (window.MC && window.MC.showNickDialog) {
                JQuery(`.ogario-menu`).hide();
                return;
            }
            if (value) {
                JQuery(`#overlays`).fadeOut(value);
            } else {
                JQuery(`#overlays`).hide();
            }
        },
        escapeHTML(string) {
            return String(string).replace(/[&<>"'/]/g, event => escapeChar[event]);
        },
        checkImgURL(url) {
            if (url.includes("png") || url.includes("jpg") || url.includes("jpeg")) {
                return url;
            } else {
                return false;
            }
        },
        checkSkinURL(url) {
            return this.checkImgURL(url)
        },
        loadSettings() {
            let settings = null;
            if (window.localStorage.getItem(`ogarioSettings`) !== null) {
                settings = JSON.parse(window.localStorage.getItem(`ogarioSettings`));
            }
            for (const option in gameOptionSettings) {
                if (gameOptionSettings.hasOwnProperty(option)) {
                    if (settings && settings.hasOwnProperty(option)) {
                        gameOptionSettings[option] = settings[option];
                    }
                    if (ogario.hasOwnProperty(option)) {
                        ogario[option] = gameOptionSettings[option];
                    }
                }
            }
        },
        saveSettings(option, name) {
            window.localStorage.setItem(name, JSON.stringify(option));
        },
        exportSettings() {
            let options = {
                ogarioCommands: chatCommand,
                ogarioHotkeys: hotkeys,
                ogarioPlayerProfiles: PlayerProfiles,
                ogarioSettings: gameOptionSettings,
                ogarioThemeSettings: gameSetupTheme
            };
            for (const option in options) {
                if (options.hasOwnProperty(option)) {
                    const checked = JQuery(`#export-` + option).prop(`checked`);
                    if (!checked) {
                        delete options[option];
                    }
                }
            }
            options = JSON.stringify(options);
            JQuery(`#export-settings`).val(options);
            JQuery(`#import-settings`).val('');
            options = null;
        },
        importSettings() {
            JQuery(`#import-settings`).blur();
            let importValue = JQuery(`#import-settings`).val();
            if (importValue) {
                importValue = JSON.parse(importValue);
                for (const value in importValue) {
                    if (importValue.hasOwnProperty(value)) {
                        const checked = JQuery(`#import-` + value).prop(`checked`);
                        if (!checked) {
                            continue;
                        }
                        window.localStorage.setItem(value, JSON.stringify(importValue[value]));
                    }
                }
                window.location.reload();
            }
        },
        restoreSettings() {
            if (window.localStorage.getItem('ogarioSettings') !== null) {
                window.localStorage.removeItem(`ogarioSettings`);
                window.location.reload();
            }
        },
        setSettings(id, checked) {
            if (gameOptionSettings.hasOwnProperty(id) && checked !== null) {
                gameOptionSettings[id] = checked;
                if (ogario.hasOwnProperty(id)) {
                    ogario[id] = checked;
                }
                switch (id) {
                    case `autoResp`:
                        this.setAutoResp();
                        break;
                    case `showMiniMap`:
                        this.setMiniMap();
                        break;
                    case `showMiniMapGrid`:
                        this.resetMiniMapSectors();
                        break;
                    case `disableChat`:
                        this.setDisableChat();
                        break;
                    case `chatSounds`:
                        this.setChatSoundsBtn();
                        break;
                    case 'showChatBox':
                        this.setShowChatBox();
                        break;
                    case `showTop5`:
                        this.setTop5();
                        break;
                    case 'showTargeting':
                        this.setTargetingHUD();
                        break;
                    case `showTime`:
                        this.displayTime();
                        JQuery('#time-hud').show();
                        break;
                    case `centeredLb`:
                        this.setCenteredLb();
                        break;
                    case 'normalLb':
                        this.setNormalLb();
                        break;
                    case `fpsAtTop`:
                        this.setFpsAtTop();
                        break;
                    case `showStats`:
                        this.displayStats();
                        JQuery(`#stats-hud`).show();
                        break;
                    case 'blockPopups':
                        this.setBlockPopups();
                        break;
                }
                this.saveSettings(gameOptionSettings, 'ogarioSettings');
            }
        },
        loadProfiles() {
            if (window.localStorage.getItem(`ogarioPlayerProfiles`) !== null) {
                PlayerProfiles = JSON.parse(window.localStorage.getItem('ogarioPlayerProfiles'));
            } else {
                let profilesLength = 10;
                for (let length = 0; length < profilesLength; length++) {
                    PlayerProfiles.push({
                        nick: `Profile #` + (length + 1),
                        clanTag: '',
                        skinURL: '',
                        color: gameSetupTheme.mainColor
                    });
                }
            }
            if (window.localStorage.getItem(`ogarioSelectedProfile`) !== null) {
                this.selectedProfile = JSON.parse(window.localStorage.getItem(`ogarioSelectedProfile`));
            }
            mainProfile.nick = PlayerProfiles[this.selectedProfile].nick;
            mainProfile.clanTag = PlayerProfiles[this.selectedProfile].clanTag;
            mainProfile.skinURL = PlayerProfiles[this.selectedProfile].skinURL;
            mainProfile.color = PlayerProfiles[this.selectedProfile].color;
        },
        changeSkinPreview(img, id) {
            if (!img || !id) {
                return;
            }
            if (id === `skin-preview`) {
                JQuery(`#skin-preview`).removeClass(`default`).append(`<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<img src='${img.src}' width='500'>"></a>`);
                JQuery(`#skin-popover`).append(JQuery(img).fadeIn(1000));
                JQuery('#skin-popover').popover();
            } else {
                JQuery(`#${id}`).removeClass(`default`).append(JQuery(img).fadeIn(1000));
            }
        },
/*        setSkinPreview(img, id) {
            const skinID = id == `skin-preview`;
            if (JQuery(`#${id}${` img`}`).attr('src') === img) {
                return;
            }
            JQuery(`#${id}`).empty().addClass(`default`);
            if (!img) {
                skinID && JQuery(`#skin`).popover(`hide`);
                return;
            }
            if (!this.checkSkinURL(img)) {
                if (skinID) {
                    let notValidText = '<p><strong>Submitted URL is not valid.</strong></p>';
                    if (/hizliresim.com/ .test(img)) {
                        notValidText += `<p>NOTICE: <strong>hizliresim.com</strong> is not supported anymore.</p>`;
                    }
                    notValidText += `<p>Check if URL:</p><ul><li>is supported by OGARio (see list below)</li><li>is no longer than 60 characters</li></ul>`;
                    notValidText += '<p>Supported image hosting sites:</p>';
                    notValidText += `<ol>`;
                    for (let length = 0; length < SkinExplain.length; length++) {
                        notValidText += `${`<li><strong><a href="` + SkinExplain[length].url}" rel="noreferrer noopener" target="_blank">${SkinExplain[length].name}</a></strong><span class="example-url">e.g. <a href="${SkinExplain[length].example}${`"  rel="noreferrer noopener" target="_blank">`}${SkinExplain[length].example}${`</a></span></li>`}`;
                    }
                    notValidText += `</ol>`;
                    JQuery('#skin').attr(`data-content`, notValidText);
                    JQuery(`#skin`).popover('show');
                    JQuery(`#skin`).focus();
                }
                return;
            }
            const app = this;
            const image = new Image();
            image.crossOrigin = `Anonymous`;
            image.onload = () => {
                app.changeSkinPreview(image, id);
                skinID && JQuery(`#skin`).popover(`hide`);
            };
            image.onerror = () => {
                if (skinID) {
                    let errorText = '<p><strong>Error while loading image.</strong></p>';
                    errorText += `<p>Check if image URL is valid.</p>`;
                    JQuery(`#skin`).attr(`data-content`, errorText);
                    JQuery(`#skin`).popover('show');
                    JQuery(`#skin`).focus();
                }
            };
            image.src = img;
        },
		*/
		setSkinPreview(t, e) {		
                    checktypeImgVid = new Image();
                    if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
                        var i = this,
                            o = checktypeImgVid;
                        o.src = t;
                        o.crossOrigin = 'anonymous',
                            o.onload = function() {
                                i.changeSkinPreview(o, e);
                            };
                    }		
		}
        setProfile() {
            const prevProfile = (PlayerProfiles.length + this.selectedProfile - 1) % PlayerProfiles.length;
            const nextProfile = (this.selectedProfile + 1) % PlayerProfiles.length;
            this.setSkinPreview(PlayerProfiles[prevProfile].skinURL, 'prev-profile');
            this.setSkinPreview(PlayerProfiles[this.selectedProfile].skinURL, `skin-preview`);
            this.setSkinPreview(PlayerProfiles[nextProfile].skinURL, `next-profile`);
            this.saveSettings(this.selectedProfile, `ogarioSelectedProfile`);
            JQuery(`#nick`).val(PlayerProfiles[this.selectedProfile].nick);
            JQuery(`#clantag`).val(PlayerProfiles[this.selectedProfile].clanTag);
            JQuery(`#skin`).val(PlayerProfiles[this.selectedProfile].skinURL);
            JQuery(`#color`).val(PlayerProfiles[this.selectedProfile].color);
            JQuery(`.skin`).colorpicker(`setValue`, PlayerProfiles[this.selectedProfile].color);
            JQuery('#skins a').removeClass('selected');
            JQuery(`#skins a[data-profile=${this.selectedProfile}]`).addClass(`selected`);
        },
        prevProfile() {
            this.setPlayerSettings();
            this.selectedProfile = (PlayerProfiles.length + this.selectedProfile - 1) % PlayerProfiles.length;
            this.setProfile();
        },
        nextProfile() {
            this.setPlayerSettings();
            this.selectedProfile = (this.selectedProfile + 1) % PlayerProfiles.length;
            this.setProfile();
        },
        selectProfile(value) {
            this.setPlayerSettings();
            this.selectedProfile = parseInt(value);
            this.setProfile();
        },
        addOption(id, name, text, checked) {
            JQuery(id).append(`<label><input type="checkbox" id="${name}${`" class="js-switch"> `}${text}${`</label>`}`);
            JQuery(`#${name}`).prop(`checked`, checked);
        },
        addOptions(options, section) {
            if (!options) {
                return;
            }
            JQuery('#og-options').append(`${`<div class="options-box ` + section}"><h5 class="menu-main-color">${textLanguage[section]}</h5></div>`);

            for (const option of options) {
                if (gameOptionSettings.hasOwnProperty(option)) {
                    JQuery(`.${section}`).append(`${`<label>` + textLanguage[option]} <input type="checkbox" class="js-switch" id="${option}${`"></label>`}`);
                    JQuery(`#${option}`).prop(`checked`, gameOptionSettings[option]);
                }
            }
        },
        addInputBox(id, name, holder, callback) {
            JQuery(id).append(`${`<div class="input-box"><span class="title-box">` + textLanguage[name]}</span><input id="${name}${`" class="form-control" placeholder="`}${holder}${`" value="`}${gameOptionSettings[name]}${`" /></div>`}`);
            const app = this;
            JQuery(`#${name}`).on(`input`, function() {
                gameOptionSettings[name] = this.value;
                app[callback]();
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
            });
        },
        addSliderBox(id, name, min, max, step, callback) {
            JQuery(id).append(`${`<div class="slider-box"><div class="box-label"><span class="value-label">` + textLanguage[name] + `: </span><span id="` + name}-value" class="value">${gameOptionSettings[name]}${`</span></div><input id="`}${name}-slider" type="range" min="${min}" max="${max}${`" step="`}${step}" value="${gameOptionSettings[name]}${`"></div>`}`);
            const app = this;
            if (callback) {
                JQuery(`#${name}${`-slider`}`).on(`input`, function() {
                    const parse = parseFloat(JQuery(this).val());
                    JQuery(`#${name}-value`).text(parse);
                    gameOptionSettings[name] = parse;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = parse;
                    }
                    app[callback]();
                    app.saveSettings(gameOptionSettings, `ogarioSettings`);
                });
            } else {
                JQuery(`#${name}-slider`).on('input', function() {
                    const parse = parseFloat(JQuery(this).val());
                    JQuery(`#${name}${`-value`}`).text(parse);
                    gameOptionSettings[name] = parse;
                    if (ogario.hasOwnProperty(name)) {
                        ogario[name] = parse;
                    }
                    app.saveSettings(gameOptionSettings, 'ogarioSettings');
                });
            }
        },
        setLang() {
            if (lang !== 'pl') {
                return;
            }
            if (window.i18n_dict && window.i18n_dict.en) {
                for (var lang in window.i18n_dict.en) {
                    if (window.i18n_dict.en.hasOwnProperty(lang) && textLanguage.hasOwnProperty(lang)) {
                        window.i18n_dict.en[lang] = textLanguage[lang];
                    }
                }
            }
        },
        setMenu() {
            const app = this;
            document.title = this.name;
            JQuery(`#mainPanel`).before(`<div id="exp-bar" class="agario-panel"><span class="ogicon-user"></span><div class="agario-exp-bar progress"><span class="progress-bar-text"></span><div class="progress-bar progress-bar-striped" style="width: 0%;"></div></div><div class="progress-bar-star"></div></div><div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="start-tab active"><a href="#main-panel" class="active ogicon-home" data-toggle="tab-tooltip" title="${textLanguage.start}${`"></a></li><li class="profile-tab"><a href="#profile" class="ogicon-user" data-toggle="tab-tooltip" title="`}${textLanguage.profile}${`"></a></li><li class="settings-tab"><a href="#og-settings" class="ogicon-cog" data-toggle="tab-tooltip" title="`}${textLanguage.settings}${`"></a></li><li class="theme-tab"><a href="#theme" class="ogicon-droplet" data-toggle="tab-tooltip" title="`}${textLanguage.theme}${`"></a></li><li class="hotkeys-tab"><a href="#" class="hotkeys-link ogicon-keyboard" data-toggle="tab-tooltip" title="`}${textLanguage.hotkeys}"></a></li><li class="music-tab"><a href="#music" class="ogicon-music" data-toggle="tab-tooltip" title="Radio / ${textLanguage.sounds}"></a></li></ul><div id="main-panel" class="menu-panel"></div><div id="profile" class="menu-panel"></div><div id="og-settings" class="menu-panel"><div class="submenu-panel"></div></div><div id="theme" class="menu-panel"></div><div id="music" class="menu-panel"></div></div>`);
            JQuery('#main-panel').append('<a href="#" class="quick quick-menu ogicon-menu"></a><a href="#" class="quick quick-skins ogicon-images"></a><div id="profiles"><div id="prev-profile" class="skin-switch"></div><div id="skin-preview"></div><div id="next-profile" class="skin-switch"></div></div>');
            JQuery(`#mainPanel div[role=form]`).appendTo(JQuery('#main-panel'));
            JQuery(`#main-panel div[role=form] .form-group:first`).remove();
            JQuery('#nick').before(`<input id="clantag" class="form-control" placeholder="Tag, e.g. Ⓜ" maxlength="10"><div class="input-group nick"></div>`);
            JQuery(`#nick`).appendTo(JQuery(`.nick`));
            JQuery(`.nick`).append(`<span class="input-group-btn"><button id="stream-mode" class="btn active ogicon-eye"></button></span>`);
            JQuery(`.nick`).after(`<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (direct link)" maxlength="60"><input type="hidden" id="color" value="` + mainProfile.color + `" maxlength="7" /><span class="input-group-addon"><i></i></span><span class="input-group-btn"><button id="hide-url" class="btn active ogicon-eye"></button></span></div>`);
            JQuery(`#locationKnown, #locationUnknown`).insertAfter(JQuery(`.skin`));
            JQuery(`#region`).before(`<button class="btn btn-warning btn-server-info ogicon-cogs"></button>`);
            JQuery(`.btn-spectate, .btn-logout`).appendTo(`#agario-main-buttons`);
            JQuery(`#agario-main-buttons`).addClass('clearfix').before(`<div id="server-info" class="form-group clearfix"><input id="server-ws" class="form-control" placeholder="Server WS"><button id="server-connect" class="btn btn-success ogicon-power"></button><button id="server-reconnect" class="btn btn-primary ogicon-redo2"></button><input id="server-token" class="form-control" placeholder="Server token"><button id="server-join" class="btn btn-success" data-itr="page_join_party">Join</button></div>`);
            JQuery(`#helloContainer div[role=form]`).after(`<div id="ogario-party" class="clearfix"><input id="party-token" class="form-control" placeholder="Party token"></div>`);
            JQuery(`#ogario-party`).append(`<button id="join-party-btn-2" class="btn btn-success" data-itr="page_join_party">Join</button><button id="create-party-btn-2" class="btn btn-primary" data-itr="page_create_party">Create</button>`);
            JQuery('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first').appendTo(JQuery(`#ogario-party`));
            JQuery(`#settingsChoice, #options`).appendTo(JQuery(`#og-settings .submenu-panel`));
            JQuery(`#stats`).appendTo(JQuery(`#main-menu`)).addClass(`menu-panel`);
            JQuery(`#statsContinue`).attr('id', 'statsContinue2');
            JQuery(`#mainPanel`).empty().remove();
            JQuery(`.center-container`).addClass(`ogario-menu`);
            JQuery(`.center-container`).append(`<div id="menu-footer" class="menu-main-color">` + textLanguage.visit + ` <a href="https://ogario.ovh" target="_blank">ogario.ovh</a> | ` + this.version + ` <a href="https://goo.gl/nRREoR" class="release ogicon-info" target="_blank"></a></div>`);
            JQuery(`#leftPanel, #rightPanel`).addClass('ogario-menu').removeAttr('id');
            JQuery(`.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel`).appendTo(JQuery(`#profile`)).removeClass('agario-side-panel');
            JQuery(`.agario-profile-panel`).after(`<div id="block-warn">` + textLanguage.blockWarn + `<br><a href="#" id="unblock-popups">` + textLanguage.unblockPopups + `</a></div>`);
            JQuery(`#exp-bar`).addClass(`agario-profile-panel`);
            JQuery(`.left-container`).empty();
            JQuery(`.agario-shop-panel`).after(`<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Team OGARio (tag: Ⓜ)</h5><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>`);
            JQuery(`#tags-container`).appendTo(JQuery('#profile'));
            JQuery(`.btn-logout`).appendTo(JQuery(`#profile`));
            JQuery(`.left-container`).append(`<div id="quick-menu" class="agario-panel agario-side-panel"><a href="https://ogario.ovh/skins/" class="quick-more-skins ogicon-grin" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.skins + `"></a><a href="https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w" class="quick-yt ogicon-youtube2" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="Team OGARio"></a></div>`);
            if (!this.protocolMode) {
                JQuery(`#quick-menu`).prepend(`${`<a href="#" class="quick-shop ogicon-cart" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_shop + `"></a><a href="#" class="quick-free-coins ogicon-coin-dollar" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_menu_main_free_coins + `"></a><a href="#" class="quick-free-gifts ogicon-gift" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_menu_main_gifts}"></a><a href="#" class="quick-quests ogicon-trophy" data-toggle="tab-tooltip" data-placement="left" title="${textLanguage.page_menu_main_dailyquests}"></a>`);
            }
            JQuery(`.party-dialog, .partymode-info`).remove();
            JQuery(`.agario-party-6`).appendTo(JQuery(`.center-container`));
            JQuery(`.right-container`).empty();
            JQuery(`.right-container`).append(`<div class="agario-party"></div>`);
            JQuery(`.agario-party-6`).appendTo(JQuery(`.agario-party`)).addClass(`agario-panel agario-side-panel`);
            JQuery(`.agario-party h4, #cancel-party-btn`).remove();
            JQuery(`.agario-party .btn`).addClass(`btn-sm`);
            JQuery(`.right-container`).append(`${`<div id="skins-panel" class="agario-panel agario-side-panel"><div id="skins"></div><a href="https://ogario.ovh/skins/" id="more-skins" class="btn btn-block btn-success" target="_blank">` + textLanguage.moreSkins}</a></div>`);
            JQuery(`.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr='page_option_dark_theme'], #options #darkTheme`).remove();
            JQuery('#advertisement, #adbg, #a32592, #g32592, #s32592, #adsBottom').css(`display`, `none`);
            JQuery('#advertisement').removeClass(`agario-panel`);
            JQuery(`#adsBottom`).css({
                'z-index': '1',
                opacity: '0',
                bottom: `-100px`
            });
            JQuery(`#noNames, #showMass`).remove();
            JQuery(`#og-settings .submenu-panel`).append('<div id="og-options"></div>');
            this.addOptions([], `animationGroup`);
            this.addOptions('autoZoom', `zoomGroup`);
            this.addOptions([`quickResp`, `autoResp`], `respGroup`);
            this.addOptions(['noNames', `optimizedNames`, `autoHideNames`, `hideMyName`, `hideTeammatesNames`, `namesStroke`], `namesGroup`);
            this.addOptions(['showMass', `optimizedMass`, `autoHideMass`, `hideMyMass`, 'hideEnemiesMass', `shortMass`, `virMassShots`, `massStroke`], `massGroup`);
            if (this.protocolMode) {
                this.addOptions('customSkins', `skinsGroup`);
            } else {
                this.addOptions([`customSkins`, 'vanillaSkins'], 'skinsGroup');
            }
            this.addOptions([`optimizedFood`, 'autoHideFood', 'autoHideFoodOnZoom', `rainbowFood`], `foodGroup`);
            this.addOptions([`myCustomColor`, 'myTransparentSkin', `transparentSkins`, 'transparentCells', 'transparentViruses'], `transparencyGroup`);
            this.addOptions([`showGrid`, `showBgSectors`, `showMapBorders`], `gridGroup`);
            this.addOptions([`disableChat`, 'chatSounds', `chatEmoticons`, `showChatImages`, `showChatVideos`, `showChatBox`], `chatGroup`);
            this.addOptions(['showMiniMap', `showMiniMapGrid`, `showMiniMapGuides`, `oneColoredTeammates`], `miniMapGroup`);
            this.addOptions([`oppColors`, `oppRings`, 'virColors', `splitRange`, `virusesRange`, `cursorTracking`, 'teammatesInd'], `helpersGroup`);
            this.addOptions([`mouseSplit`, 'mouseFeed', `mouseInvert`], `mouseGroup`);
            this.addOptions([`showTop5`, 'showTargeting', `showLbData`, 'centeredLb', `normalLb`, `fpsAtTop`], `hudGroup`);
            this.addOptions(['showStats', `showStatsMass`, `showStatsSTE`, 'showStatsN16', `showStatsFPS`, `showTime`], `statsGroup`);
            if (!this.protocolMode) {
                this.addOptions('blockPopups', 'extrasGroup');
                JQuery(`#noSkins, #noColors, #skipStats, #showQuest`).addClass(`js-switch-vanilla`);
                JQuery(`.skinsGroup h5`).after(`<label class="noSkins">${textLanguage.noSkins}${` </label>`}`);
                JQuery(`#noSkins`).appendTo(JQuery(`.noSkins`));
                JQuery(`.transparencyGroup h5`).after(`<label class="noColors">${textLanguage.noColors}${` </label>`}`);
                JQuery('#noColors').appendTo(JQuery('.noColors'));
                JQuery(`.extrasGroup h5`).after(`<label class="skipStats">` + textLanguage.skipStats + ` </label>`);
                JQuery(`#skipStats`).appendTo(JQuery(`.skipStats`));
                JQuery(`.skipStats`).after(`<label class="showQuest">` + textLanguage.showQuest + ` </label>`);
                JQuery('#showQuest').appendTo(JQuery(`.showQuest`));
                JQuery(`#options`).remove();
                JQuery(`#settingsChoice`).appendTo(JQuery(`.extrasGroup`)).addClass(`select-wrapper`);
            }
            this.addSliderBox(`.animationGroup`, `animation`, 100, 200, 1);
            this.addSliderBox(`.zoomGroup`, `zoomSpeedValue`, 0.75, 0.99, 0.01);
            JQuery(`#og-settings`).append(`<button class="btn btn-block btn-success btn-export">` + textLanguage.exportImport + `</button>`);
            JQuery(`#og-settings`).append(`<div class="restore-settings"><a href="#">` + textLanguage.restoreSettings + `</a></div>`);
            JQuery(`#music`).append(`${`<div class="agario-panel radio-panel"><h5 class="menu-main-color">Radio (` + textLanguage.thanks + `)</h5><audio src="http://frshoutcast.comunicazion.eu:8815/;" controls></audio><span class="playlist"><span class="ogicon-file-music"></span> <a href="http://frshoutcast.comunicazion.eu:8815/played.html?sid=1" target="_blank">` + textLanguage.playlist}</a></span></div>`);
            JQuery(`#music`).append(`<div class="agario-panel sounds-panel"><h5 class="menu-main-color">` + textLanguage.sounds + `</h5></div>`);
            JQuery(`#music`).append(`<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Team OGARio (tag: Ⓜ)</h5><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>`);
            this.addInputBox(`.sounds-panel`, `messageSound`, 'Sound URL', 'setMessageSound');
            this.addInputBox('.sounds-panel', 'commandSound', `Sound URL`, `setCommandSound`);
            JQuery('body').append(`<div id="overlays-hud" data-gamemode=":ffa"><div id="stats-hud" class="hud stats-hud-color"></div> <div id="top5-hud" class="hud"><h5 class="hud-main-color">Team top <span class="team-top">5</span></h5><div class="hud-main-color team-top-menu"><a href="#" data-limit="5" class="team-top-limit active">5</a> | <a href="#" data-limit="10" class="team-top-limit">10</a> | <a href="#" data-limit="100" class="team-top-limit">100</a></div><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ` + textLanguage.totalPartyPlayers + `: <span id="top5-total-players" class="top5-mass-color">0</span><br><span class="hud-main-color ogicon-pacman"></span> ` + textLanguage.totalPartyMass + `: <span id="top5-total-mass" class="top5-mass-color">0</span></div></div> <div id="time-hud" class="hud time-hud-color"></div> <div id="pause-hud" class="hud">` + textLanguage.pause + `</div> <div id="leaderboard-hud" class="hud-b"><h4 class="hud-main-color">ogario.ovh</h4><div id="leaderboard-data"></div><div id="leaderboard-positions"></div></div> <div id="btl-leaderboard-hud"><div class="hud hud-c"><span id="btl-players-status">Players ready</span>: <span id="btl-players-count">0</span></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="target-hud" class="hud"><div id="target-player"><span id="target-skin"><img src="https://cdn.ogario.ovh/static/img/blank.png" alt=""> </span><span id="target-nick"></span> <span id="target-status" class="hud-main-color">[` + textLanguage.targetNotSet + `]</span></div><div id="target-summary"></div></div><div id="target-panel-hud" class="hud"><a href="#" id="set-targeting" class="ogicon-target"></a><a href="#" id="set-private-minimap" class="ogicon-location2"></a><a href="#" id="cancel-targeting" class="ogicon-cancel-circle"></a><a href="#" id="change-target" class="ogicon-arrow-right"></a></div> <div id="quest-hud" class="hud"></div> <div id="btl-hud" class="hud"></div></div>`);
            JQuery(`body`).append(`<ul id="messages"></ul>`);
            JQuery(`body`).append(`<div id="message-box"><div id="chat-emoticons"></div><div id="message-menu"><a href="#" class="chat-sound-notifications ogicon-volume-high"></a><a href="#" class="chat-active-users ogicon-user-check"></a><a href="#" class="chat-muted-users ogicon-user-minus"></a><a href="#" class="show-chat-emoticons ogicon-smile"></a></div><input type="text" id="message" class="form-control" placeholder="${textLanguage.enterChatMsg}${`..." maxlength="80"></div>`}`);
            JQuery(`body`).append('<div id="chat-box"></div>');
            for (const emoji in emojiChar) {
                if (emojiChar.hasOwnProperty(emoji)) {
                    JQuery('#chat-emoticons').append(`<img src="https://cdn.ogario.ovh/static/emoticons/${emojiChar[emoji]}${`" alt="`}${emoji}${`" class="emoticon">`}`);
                }
            }
            JQuery('body').append(`<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">` + textLanguage.close + `</button></div><div id="exp-imp-settings"></div></div>`);
            JQuery(`#exp-imp-settings`).append(`<h1>` + textLanguage.exportSettings + `</h1><h2>` + textLanguage.exportInfo + `</h2>`);
            this.addOption(`#exp-imp-settings`, `export-ogarioCommands`, textLanguage.commands, true);
            this.addOption(`#exp-imp-settings`, `export-ogarioHotkeys`, textLanguage.hotkeys, true);
            this.addOption(`#exp-imp-settings`, 'export-ogarioPlayerProfiles', textLanguage.profiles, true);
            this.addOption('#exp-imp-settings', `export-ogarioSettings`, textLanguage.settings, true);
            this.addOption(`#exp-imp-settings`, `export-ogarioThemeSettings`, textLanguage.theme, true);
            JQuery('#exp-imp-settings').append(`<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">${textLanguage.exportSettings}${`</button>`}`);
            JQuery(`#exp-imp-settings`).append(`${`<h1>` + textLanguage.importSettings}</h1><h2>${textLanguage.importInfo}${`</h2>`}`);
            this.addOption(`#exp-imp-settings`, `import-ogarioCommands`, textLanguage.commands, true);
            this.addOption(`#exp-imp-settings`, 'import-ogarioHotkeys', textLanguage.hotkeys, true);
            this.addOption(`#exp-imp-settings`, `import-ogarioPlayerProfiles`, textLanguage.profiles, true);
            this.addOption(`#exp-imp-settings`, `import-ogarioSettings`, textLanguage.settings, true);
            this.addOption(`#exp-imp-settings`, `import-ogarioThemeSettings`, textLanguage.theme, true);
            JQuery('#exp-imp-settings').append(`<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">` + textLanguage.importSettings + `</button>`);
            OgarioSettings && OgarioSettings.setThemeMenu();
            for (let length = 0; length < PlayerProfiles.length; length++) {
                JQuery(`#skins`).append(`${`<div class="skin-box"><a href="#profile-` + length}" id="profile-${length}" data-profile="${length}" class="skin-switch"></a></div>`);
                this.setSkinPreview(PlayerProfiles[length].skinURL, `profile-` + length);
                if (length == this.selectedProfile) {
                    JQuery(`#profile-` + length).addClass(`selected`);
                }
            }
        },
        setUI() {
            const app = this;
            JQuery(document).on('click', `.menu-tabs a`, function(event) {
                event.preventDefault();
                app.switchMenuTabs(JQuery(this), `menu-panel`);
            });
            JQuery(document).on('click', `.submenu-tabs a`, function(event) {
                event.preventDefault();
                app.switchMenuTabs(JQuery(this), `submenu-panel`);
            });
            JQuery(document).on(`click`, `.quick-menu`, event => {
                event.preventDefault();
                gameOptionSettings.showQuickMenu = !gameOptionSettings.showQuickMenu;
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
                app.setShowQuickMenu();
            });
            JQuery(document).on(`click`, `.quick-skins`, event => {
                event.preventDefault();
                gameOptionSettings.showSkinsPanel = !gameOptionSettings.showSkinsPanel;
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
                app.setShowSkinsPanel();
            });
            JQuery(document).on(`change`, `#region`, function() {
                app.region = this.value;
            });
            JQuery(document).on(`change`, '#gamemode', function() {
                const value = this.value;
                if (value !== ':party') {
                    app.leaveParty();
                }
                app.gameMode = ogario.gameMode = value;
                app.setQuest();
            });
            JQuery(document).on(`change`, `#quality`, function() {
                app.getQuality(this.value);
                menuScale();
            });
            JQuery(`#skin`).popover({
                html: true,
                placement: `bottom`,
                trigger: 'manual',
                animation: false
            });
            JQuery(document).on(`input click`, `#skin`, function() {
                const value = this.value;
                app.setSkinPreview(value, `skin-preview`);
                app.setSkinPreview(value, `profile-` + app.selectedProfile);
            });
            JQuery(document).on(`click`, '.skin .example-url a', function(event) {
                event.preventDefault();
                JQuery(`#skin`).val(this.href).click();
            });
            JQuery(document).on(`click`, `#overlays`, () => {
                if (!JQuery(`.skin:hover`).length && !JQuery('.skin-switch:hover').length) {
                    JQuery(`#skin`).popover(`hide`);
                }
            });
            JQuery(document).on(`click`, `#skins a`, function(event) {
                event.preventDefault();
                app.selectProfile(JQuery(this).attr(`data-profile`));
            });
            JQuery(document).on(`click`, '#prev-profile', () => {
                app.prevProfile();
            });
            JQuery(document).on(`click`, `#next-profile`, () => {
                app.nextProfile();
            });
            JQuery(document).on(`click`, `#stream-mode`, () => {
                gameOptionSettings.streamMode = !gameOptionSettings.streamMode;
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
                app.setStreamMode();
            });
            JQuery(document).on('click', `#hide-url`, () => {
                gameOptionSettings.hideSkinUrl = !gameOptionSettings.hideSkinUrl;
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
                app.setHideSkinUrl();
            });
            JQuery(document).on(`click`, `.btn-server-info`, () => {
                JQuery(`#server-info`).toggle();
            });
            JQuery(document).on(`click`, `#server-connect`, () => {
                app.gameServerConnect(JQuery('#server-ws').val());
            });
            JQuery(document).on(`click`, `#server-reconnect`, () => {
                app.gameServerReconnect();
            });
            JQuery(document).on(`click`, `#server-join`, () => {
                app.gameServerJoin(JQuery(`#server-token`).val());
            });
            JQuery(document).on(`change`, `#og-options input[type='checkbox']`, function() {
                const option = JQuery(this);
                app.setSettings(option.attr('id'), option.prop(`checked`));
            });
            JQuery(document).on(`change`, '.js-switch-vanilla', function() {
                const option = JQuery(this);
                const id = option.attr('id');
                if (typeof app[id] !== `undefined`) {
                    app[id] = option.prop('checked');
                    if (id === `noSkins`) {
                        ogario.showCustomSkins = !app.noSkins;
                    }
                    if (id === `showQuest`) {
                        app.setQuest();
                    }
                }
            });
            JQuery(document).on(`click`, `#og-settings .restore-settings a`, event => {
                event.preventDefault();
                app.restoreSettings();
            });
            JQuery(document).on(`click`, '#og-settings .btn-export', event => {
                event.preventDefault();
                app.exportSettings();
                JQuery(`#exp-imp`).fadeIn(500);
                JQuery('#exp-imp-settings, #export-settings').perfectScrollbar(`update`);
            });
            JQuery(document).on('click', '#close-exp-imp', event => {
                event.preventDefault();
                JQuery(`#exp-imp`).fadeOut(500);
            });
            JQuery(document).on(`focus`, `#export-settings`, function() {
                JQuery(this).select();
            });
            JQuery(document).on(`click`, `#export-settings-btn`, event => {
                event.preventDefault();
                app.exportSettings();
            });
            JQuery(document).on(`click`, `#import-settings-btn`, event => {
                event.preventDefault();
                app.importSettings();
            });
            JQuery(document).on(`click`, `#unblock-popups`, event => {
                event.preventDefault();
                app.unblockPopups();
            });
            JQuery(document).on(`click`, `#openfl-overlay.disabler`, () => {
                if (gameOptionSettings.blockPopups) {
                    app.blockPopups();
                }
            });
            JQuery(document).on(`click`, `#openfl-content`, function() {
                if (gameOptionSettings.blockPopups) {
                    const content = JQuery(this);
                    setTimeout(() => {
                        if (!content.is(`:visible`)) {
                            app.blockPopups();
                        }
                    }, 1000);
                }
            });
            JQuery(document).on(`click`, `.quick-shop`, event => {
                event.preventDefault();
                app.unblockPopups();
                window.MC && window.MC.openShop && window.MC.openShop();
            });
            JQuery(document).on(`click`, `.quick-free-coins`, event => {
                event.preventDefault();
                app.unblockPopups();
                window.MC && window.MC.showFreeCoins && window.MC.showFreeCoins();
            });
            JQuery(document).on(`click`, '.quick-free-gifts', event => {
                event.preventDefault();
                app.unblockPopups();
                window.MC && window.MC.showGifting && window.MC.showGifting();
            });
            JQuery(document).on(`click`, `.quick-quests`, event => {
                event.preventDefault();
                app.unblockPopups();
                window.MC && window.MC.showQuests && window.MC.showQuests();
            });
            JQuery(document).on(`click`, `#set-targeting`, event => {
                event.preventDefault();
                app.setTargeting();
            });
            JQuery(document).on('click', `#cancel-targeting`, event => {
                event.preventDefault();
                app.cancelTargeting();
            });
            JQuery(document).on(`click`, `#set-private-minimap`, event => {
                event.preventDefault();
                app.setPrivateMiniMap();
            });
            JQuery(document).on(`click`, `#change-target`, event => {
                event.preventDefault();
                app.changeTarget();
            });
            JQuery(document).on('click', `.team-top-limit`, function(event) {
                event.preventDefault();
                const top5 = JQuery(this);
                const limit = parseInt(top5.attr('data-limit'));
                if (limit) {
                    app.setTop5limit(limit);
                    app.displayTop5();
                    JQuery(`.team-top`).text(limit);
                    JQuery(`.team-top-limit`).removeClass(`active`);
                    top5.addClass(`active`);
                }
            });
            JQuery(document).on(`click`, `#top5-pos .set-target`, function(event) {
                event.preventDefault();
                app.setTarget(parseInt(JQuery(this).attr('data-user-id')));
            });
            JQuery(document).on(`click`, `.mute-user`, function(event) {
                event.preventDefault();
                app.muteChatUser(parseInt(JQuery(this).attr(`data-user-id`)));
            });
            JQuery(document).on(`click`, '.btn-mute-user', function() {
                const btn = JQuery(this);
                app.muteChatUser(parseInt(btn.attr(`data-user-id`)));
                btn.removeClass(`btn-red btn-mute-user`).addClass(`btn-green btn-unmute-user`).text(textLanguage.unmute);
            });
            JQuery(document).on(`click`, '.btn-unmute-user', function() {
                const btn = JQuery(this);
                app.unmuteChatUser(parseInt(btn.attr(`data-user-id`)));
                btn.removeClass('btn-green btn-unmute-user').addClass(`btn-red btn-mute-user`).text(textLanguage.mute);
            });
            JQuery(document).on(`click`, '.chat-sound-notifications', event => {
                event.preventDefault();
                gameOptionSettings.chatSounds = !gameOptionSettings.chatSounds;
                app.saveSettings(gameOptionSettings, 'ogarioSettings');
                app.setChatSoundsBtn();
            });
            JQuery(document).on(`click`, '.chat-active-users', event => {
                event.preventDefault();
                app.displayChatActiveUsers();
            });
            JQuery(document).on('click', `.chat-muted-users`, event => {
                event.preventDefault();
                app.displayChatMutedUsers();
            });
            JQuery(document).on(`click`, `.show-chat-emoticons`, function(event) {
                event.preventDefault();
                const option = JQuery(this);
                const chatEmoji = JQuery(`#chat-emoticons`);
                chatEmoji.toggle();
                if (chatEmoji.is(`:visible`)) {
                    option.addClass(`active`);
                } else {
                    option.removeClass('active');
                    JQuery(`#message`).focus();
                }
            });
            JQuery(document).on(`click`, '#chat-emoticons .emoticon', function() {
                const chatEmoji = JQuery(this);
                const alt = chatEmoji.attr(`alt`);
                const message = JQuery(`#message`);
                const value = message.val();
                if (value.length + alt.length <= 80) {
                    message.val(value + alt);
                }
                message.focus();
            });
            this.statsHUD = document.getElementById(`stats-hud`);
            this.activeParties = document.getElementById('active-parties');
            this.top5pos = document.getElementById('top5-pos');
            this.top5totalMass = document.getElementById(`top5-total-mass`);
            this.top5totalPlayers = document.getElementById(`top5-total-players`);
            this.leaderboardPositionsHUD = document.getElementById(`leaderboard-positions`);
            this.leaderboardDataHUD = document.getElementById(`leaderboard-data`);
            this.timeHUD = document.getElementById('time-hud');
            this.questHUD = document.getElementById(`quest-hud`);
            JQuery(`#canvas`).bind(`contextmenu`, () => false);
            JQuery(document).on('mouseup', `.btn`, function() {
                $(this).blur();
            });
            JQuery(`[data-toggle='tab-tooltip']`).tooltip({
                trigger: `hover`
            });
            JQuery('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings').perfectScrollbar({
                suppressScrollX: true
            });
            const sliceSwitch = Array.prototype.slice.call(document.querySelectorAll(`.js-switch`));
            sliceSwitch.forEach(event => {
                const switchOption = new Switchery(event, {
                    color: gameSetupTheme.menuMainColor,
                    size: 'small'
                });
            });
            JQuery('input[type="range"]').rangeslider({
                polyfill: false
            });
            toastr.options = {
                newestOnTop: false,
                positionClass: `toast-bottom-left`,
                timeOut: 15000
            };
        },
        switchMenuTabs(tab, name) {
            const parent = tab.parent();
            if (name === 'menu-panel') {
                if (tab.hasClass(`hotkeys-link`)) {
                    return;
                }
                if (parent.hasClass(`profile-tab`)) {
                    this.setBlockPopups();
                }
            }
            tab.addClass(`active`);
            parent.addClass(`active`);
            parent.siblings().removeClass(`active`);
            parent.siblings().find('a').removeClass(`active`);
            const href = tab.attr(`href`);
            if (name === 'submenu-panel') {
                const id = JQuery(href).parent().attr('id');
                JQuery(`#${id}${` .submenu-panel`}`).not(href).css(`display`, `none`);
            } else {
                JQuery(`.menu-panel`).not(href).css(`display`, 'none');
            }
            JQuery(href).fadeIn(1000);
            menuScale();
            JQuery(`.submenu-panel`).perfectScrollbar(`update`);
        },
        getDefaultSettings() {
            const app = this;
            this.noSkins = JQuery(`#noSkins`).prop(`checked`);
            this.noColors = JQuery(`#noColors`).prop(`checked`);
            this.skipStats = JQuery(`#skipStats`).prop(`checked`);
            this.showQuest = JQuery(`#showQuest`).prop(`checked`);
            ogario.showCustomSkins = !this.noSkins;
            if (window.localStorage.getItem(`scale_setting`) !== null) {
                const parseScaleSettings = JSON.parse(window.localStorage.getItem(`scale_setting`));
                this.setCanvasScale(parseScaleSettings);
            } else {
                const quality = JQuery('#quality').val();
                this.getQuality(quality);
            }
            if (window.localStorage.getItem('location') !== null) {
                this.region = window.localStorage.getItem(`location`);
                JQuery(`#region`).val(this.region);
                window.MC && window.MC.setRegion && window.MC.setRegion(this.region);
            } else {
                this.region = JQuery(`#region`).val();
            }
            this.setParty();
            if (this.gameMode === `:party` && window.location.hash) {
                JQuery(`#join-party-btn-2`).click();
            }
            const sliceSwitchVanilla = Array.prototype.slice.call(document.querySelectorAll(`.js-switch-vanilla`));
            sliceSwitchVanilla.forEach(event => {
                const SwitchVanillaOption = new Switchery(event, {
                    color: gameSetupTheme.menuMainColor,
                    size: 'small'
                });
            });
            JQuery(`#nick`).val(mainProfile.nick).blur();
            JQuery('#noNames').prop(`checked`, !gameOptionSettings.noNames);
            JQuery(`#showMass`).prop('checked', gameOptionSettings.showMass);
            this.unlockButtons();
            this.setAutoResp();
            this.setQuest();
        },
        getQuality(value) {
            const ration = `devicePixelRatio` in window;
            let defaultValue = 1;
            if (ration) {
                defaultValue = window.devicePixelRatio;
            }
            switch (value) {
                case `High`:
                    this.setCanvasScale(1);
                    break;
                case `Medium`:
                    this.setCanvasScale(0.9);
                    break;
                case `Low`:
                    this.setCanvasScale(0.75);
                    break;
                case `VeryLow`:
                    this.setCanvasScale(0.5);
                    break;
                default:
                    this.setCanvasScale(defaultValue);
                    break;
            }
        },
        setCanvasScale(value) {
            this.canvasScale = value;
            ogario.canvasScale = value;
        },
        setStreamMode() {
            if (gameOptionSettings.streamMode) {
                JQuery(`#stream-mode`).addClass(`ogicon-eye-blocked`);
                JQuery('#clantag, #nick, #party-token').addClass('stream-mode');
            } else {
                JQuery('#stream-mode').removeClass(`ogicon-eye-blocked`);
                JQuery(`#clantag, #nick, #party-token`).removeClass(`stream-mode`);
            }
        },
        setHideSkinUrl() {
            if (gameOptionSettings.hideSkinUrl) {
                JQuery('#hide-url').addClass(`ogicon-eye-blocked`);
                JQuery('#skin').addClass(`hide-url`);
            } else {
                JQuery(`#hide-url`).removeClass(`ogicon-eye-blocked`);
                JQuery(`#skin`).removeClass(`hide-url`);
            }
        },
        setShowQuickMenu() {
            if (gameOptionSettings.showQuickMenu) {
                JQuery(`#quick-menu`).fadeIn(500);
            } else {
                JQuery('#quick-menu').fadeOut(500);
            }
        },
        setShowSkinsPanel() {
            if (gameOptionSettings.showSkinsPanel) {
                JQuery(`#skins-panel`).fadeIn(500);
            } else {
                JQuery(`#skins-panel`).fadeOut(500);
            }
        },
        unlockButtons() {
            JQuery(`.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate`).prop(`disabled`, false);
        },
        setMainButtons() {
            const app = this;
            JQuery(document).on(`click`, `.btn-play, .btn-play-guest`, () => {
                app.onPlay();
            });
            JQuery(document).on('click', `.btn-spectate`, () => {
                app.onSpectate();
            });
            JQuery(document).on(`click`, `#create-party-btn-2`, () => {
                app.onCreate();
            });
            JQuery(document).on(`click`, `#join-party-btn-2`, () => {
                app.skipServerData = true;
                app.joinParty();
                app.onJoin();
            });
            JQuery(document).on('click', `#statsContinue2`, () => {
                JQuery(`#stats, #main-panel`).toggle();
            });
        },
        play() {
            this.setPlayerSettings();
            this.setParty();
            if (this.isSocketOpen()) {
                this.sendPartyData();
            } else {
                this.connect();
                const app = this;
                setTimeout(() => {
                    app.sendPartyData();
                }, 1000);
            }
        },
        onPlay() {
            this.play();
            this.hideMenu();
            window.addKeyListeners && window.addKeyListeners();
            if (gameOptionSettings.autoHideFood) {
                ogario.showFood = true;
            }
            window.ga && window.ga(`create`, `UA-67142685-2`, `auto`, `ogarioTracker`);
            window.ga && window.ga(`ogarioTracker.send`, `pageview`);
        },
        onSpectate() {
            this.onJoin();
            this.sendPlayerJoin();
            this.hideMenu();
            window.addKeyListeners && window.addKeyListeners();
            if (gameOptionSettings.autoHideFood) {
                ogario.showFood = false;
            }
        },
        join() {
            this.setParty();
            this.setPlayerSettings();
            this.sendPartyData();
            this.sendPlayerDeath();
        },
        onJoin() {
            this.setParty();
            if (this.isSocketOpen()) {
                this.join();
            } else {
                this.connect();
                const app = this;
                setTimeout(() => {
                    app.join();
                    app.sendPlayerJoin();
                }, 1000);
            }
        },
        create() {
            this.setParty();
            if (this.partyToken) {
                this.onJoin();
                return;
            }
            const app = this;
            setTimeout(() => {
                app.create();
            }, 100);
        },
        onCreate() {
            this.setParty();
            if (this.gameMode !== ':party' || !this.partyToken) {
                this.createParty();
            } else {
                this.gameServerReconnect();
            }
            this.create();
        },
        onPlayerSpawn() {
            ogario.play = true;
            if (ogario.playerColor) {
                this.sendPlayerSpawn();
                this.cacheCustomSkin(mainProfile.nick, ogario.playerColor, mainProfile.skinURL);
                return;
            }
            const app = this;
            setTimeout(() => {
                app.onPlayerSpawn();
            }, 100);
        },
        onPlayerDeath() {
            ogario.play = false;
            ogario.playerColor = null;
            ogario.foodIsHidden = false;
            ogario.playerMass = 0;
            ogario.playerScore = 0;
            ogario.playerSplitCells = 0;
            this.showMenu(300);
            this.sendPlayerDeath();
            this.updateDeathLocations(ogario.playerX, ogario.playerY);
            this.unlockButtons();
            resetonkeydown();
            this.autoResp();
        },
        setPlayerSettings() {
            const nick = JQuery(`#nick`).val();
            const tag = JQuery(`#clantag`).val();
            const skin = JQuery(`#skin`).val();
            const color = JQuery(`#color`).val();
            mainProfile.nick = nick;
            mainProfile.clanTag = tag.trim();
            mainProfile.skinURL = this.checkSkinURL(skin.trim());
            if (color.length == 7) {
                mainProfile.color = color;
            }
            if (mainProfile.clanTag.length > 0) {
                ogario.clanTag = mainProfile.clanTag;
            }
            PlayerProfiles[this.selectedProfile].nick = mainProfile.nick;
            PlayerProfiles[this.selectedProfile].clanTag = mainProfile.clanTag;
            PlayerProfiles[this.selectedProfile].skinURL = mainProfile.skinURL;
            PlayerProfiles[this.selectedProfile].color = mainProfile.color;
            this.saveSettings(PlayerProfiles, `ogarioPlayerProfiles`);
        },
        loadSkin(img, url) {
            const app = this;
            img[url] = new Image();
            img[url].crossOrigin = `Anonymous`;
            img[url].onload = function() {
                if (this.complete && this.width && this.height && this.width <= 2000 && this.height <= 2000) {
                    app.cacheQueue.push(url);
                    if (app.cacheQueue.length == 1) {
                        app.cacheSkin(app.customSkinsCache);
                    }
                }
            };
            img[url].src = url;
        },
        cacheSkin(skinCache) {
            if (this.cacheQueue.length == 0) {
                return;
            }
            const shift = this.cacheQueue.shift();
            if (shift) {
                let canvas = document.createElement(`canvas`);
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
                ctx.clip();
                ctx.drawImage(this.customSkinsCache[shift], 0, 0, 512, 512);
                this.customSkinsCache[shift + `_cached`] = new Image();
                this.customSkinsCache[shift + `_cached`].src = canvas.toDataURL();
                canvas = null;
                this.cacheSkin(this.customSkinsCache);
            }
        },
        getCachedSkin(skinCache, skinMap) {
            if (skinCache[skinMap + `_cached`] && skinCache[skinMap + `_cached`].complete && skinCache[skinMap + `_cached`].width) {
                return skinCache[`${skinMap}_cached`];
            }
            return null;
        },
        cacheCustomSkin(nick, color, skinUrl) {
            if (skinUrl) {
                const gamemode = this.gameMode === `:party` ? nick + color : nick;
                if (gamemode) {
                    this.customSkinsMap[gamemode] = skinUrl;
                }
                if (this.customSkinsCache.hasOwnProperty(skinUrl)) {
                    return;
                }
                this.loadSkin(this.customSkinsCache, skinUrl);
            }
        },
        checkSkinsMap(nick, color) {
            const skinName = this.gameMode === `:party` ? nick + color : nick;
            if (this.customSkinsMap.hasOwnProperty(skinName)) {
                return true;
            }
            return false;
        },
        getCustomSkin(nick, color) {
            if (!this.checkSkinsMap(nick, color)) {
                return null;
            }
            const skinName = this.gameMode === ':party' ? nick + color : nick;
            return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[skinName]);
        },
        calculateMapSector(x, y, resize = false) {
            if (!ogario.mapOffsetFixed) {
                return '';
            }
            const offsetX = resize ? ogario.mapOffsetX + ogario.mapOffset : ogario.mapOffset;
            const offsetY = resize ? ogario.mapOffsetY + ogario.mapOffset : ogario.mapOffset;
            let resizeX = Math.floor((y + offsetY) / (ogario.mapSize / gameSetupTheme.sectorsY));
            let resizeY = Math.floor((x + offsetX) / (ogario.mapSize / gameSetupTheme.sectorsX));
            resizeX = resizeX < 0 ? 0 : resizeX >= gameSetupTheme.sectorsY ? gameSetupTheme.sectorsY - 1 : resizeX;
            resizeY = resizeY < 0 ? 0 : resizeY >= gameSetupTheme.sectorsX ? gameSetupTheme.sectorsX - 1 : resizeY;
            return String.fromCharCode(resizeX + 65) + (resizeY + 1);
        },
        shortMassFormat(value) {
            return value < 1000 ? value : `${Math.round(value / 100) / 10}k`;
        },
        updateDeathLocations(x, y) {
            if (!ogario.mapOffsetFixed) {
                return;
            }
            this.deathLocations.push({
                x: x + ogario.mapOffsetX,
                y: y + ogario.mapOffsetY
            });
            if (this.deathLocations.length == 6) {
                this.deathLocations.shift();
            }
            this.lastDeath = this.deathLocations.length - 1;
        },
        drawMiniMap() {
            if (!ogario.mapOffsetFixed) {
                return;
            }
            const mapWidth = gameSetupTheme.miniMapWidth;
            const mapTop = gameSetupTheme.miniMapTop;
            const height = mapWidth + mapTop;
            const width = mapWidth - 18;
            const scale = mapTop + 9.5;
            if (!this.miniMap) {
                this.miniMap = document.getElementById(`minimap`);
                this.miniMapCtx = this.miniMap.getContext('2d');
                this.miniMapCtx.ogarioCtx = true;
                this.miniMap.width = mapWidth;
                this.miniMap.height = height;
            } else {
                this.miniMapCtx.clearRect(0, 0, mapWidth, height);
            }
            if (this.miniMap.width != mapWidth) {
                this.miniMap.width = mapWidth;
                this.miniMap.height = height;
            }
            const newSize = width / ogario.mapSize;
            const resizeoffX = ogario.mapOffsetX + ogario.mapOffset;
            const resizeoffY = ogario.mapOffsetY + ogario.mapOffset;
            this.drawSelectedCell(this.miniMapCtx);
            this.currentSector = this.calculateMapSector(ogario.playerX, ogario.playerY, true);
            this.miniMapCtx.globalAlpha = 1;
            this.miniMapCtx.font = `${gameSetupTheme.miniMapFontWeight} ${mapTop - 4}px ${gameSetupTheme.miniMapFontFamily}`;
            this.miniMapCtx.fillStyle = gameSetupTheme.miniMapSectorColor;
            this.miniMapCtx.fillText(this.currentSector, 10, mapTop);
            if (!this.miniMapSectors) {
                this.drawMiniMapSectors(gameSetupTheme.sectorsX, gameSetupTheme.sectorsY, width, height, scale);
            }
            this.miniMapCtx.save();
            this.miniMapCtx.translate(9.5, scale);
            if (this.gameMode === `:battleroyale`) {
                drawRender && drawRender.drawBattleAreaOnMinimap(this.miniMapCtx, width, width, newSize, resizeoffX, resizeoffY);
            }
            if (gameOptionSettings.showMiniMapGuides) {
                var roundX = Math.round((ogario.playerX + resizeoffX) * newSize);
                var roundY = Math.round((ogario.playerY + resizeoffY) * newSize);
                this.miniMapCtx.lineWidth = 1;
                this.miniMapCtx.strokeStyle = gameSetupTheme.miniMapGuidesColor;
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(roundX, 0);
                this.miniMapCtx.lineTo(roundX, width - 1);
                this.miniMapCtx.moveTo(0, roundY);
                this.miniMapCtx.lineTo(width - 1, roundY);
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.beginPath();
            this.miniMapCtx.arc((ogario.playerX + resizeoffX) * newSize, (ogario.playerY + resizeoffY) * newSize, gameSetupTheme.miniMapMyCellSize, 0, this.pi2, false);
            this.miniMapCtx.closePath();
            if (gameSetupTheme.miniMapMyCellStrokeSize > 0) {
                this.miniMapCtx.lineWidth = gameSetupTheme.miniMapMyCellStrokeSize;
                this.miniMapCtx.strokeStyle = gameSetupTheme.miniMapMyCellStrokeColor;
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.fillStyle = gameSetupTheme.miniMapMyCellColor;
            this.miniMapCtx.fill();
            if (this.teamPlayers.length) {
                for (let length = 0; length < this.teamPlayers.length; length++) {
                    this.teamPlayers[length].drawPosition(this.miniMapCtx, ogario.mapOffset, newSize, this.privateMiniMap, this.targetID);
                }
            }
            if (this.deathLocations.length > 0) {
                var roundX = Math.round((this.deathLocations[this.lastDeath].x + ogario.mapOffset) * newSize);
                var roundY = Math.round((this.deathLocations[this.lastDeath].y + ogario.mapOffset) * newSize);
                const mySize = Math.max(gameSetupTheme.miniMapMyCellSize - 2, 4);
                this.miniMapCtx.lineWidth = 1;
                this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? gameSetupTheme.miniMapDeathLocationColor : '#FFFFFF';
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(roundX - mySize, roundY);
                this.miniMapCtx.lineTo(roundX + mySize, roundY);
                this.miniMapCtx.moveTo(roundX, roundY - mySize);
                this.miniMapCtx.lineTo(roundX, roundY + mySize);
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.restore();
        },
        drawMiniMapSectors(x, y, size, height, scale) {
            this.miniMapSectors = document.getElementById(`minimap-sectors`);
            const ctx = this.miniMapSectors.getContext('2d');
            ctx.ogarioCtx = true;
            this.miniMapSectors.width = size;
            this.miniMapSectors.height = height;
            ctx.fillStyle = `#FFFFFF`;
            this.dTok(ctx, size - 1);
            drawRender.drawSectors(ctx, ogario.mapOffsetFixed, x, y, 0.5, scale, size - 0.5, height - 9.5, gameSetupTheme.miniMapSectorsColor, gameSetupTheme.miniMapSectorsColor, 1, false);
        },
        resetMiniMapSectors() {
            this.miniMapSectors = null;
        },
        drawSelectedCell(ctx) {
            if (ogario.play && ogario.playerSplitCells > 1 && (gameOptionSettings.splitRange || gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.showStatsSTE)) {
                ctx.fillStyle = `#FFFFFF`;
                ctx.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3;
                ctx.beginPath();
                ctx.arc(48, 15, 6, 0, this.pi2, false);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6;
                ctx.beginPath();
                ctx.arc(60, 15, 4, 0, this.pi2, false);
                ctx.closePath();
                ctx.fill();
            }
        },
        dTok(ctx, size) {
            ctx.font = `${gameSetupTheme.miniMapFontWeight} ${gameSetupTheme.miniMapTop - 6}${`px `}${gameSetupTheme.miniMapFontFamily}`;
            ctx.textAlign = `right`;
            ctx.textBaseline = `top`;
            ctx.fillText(atob(this.token), size, 7);
        },
        setVirusColor(size) {
            const floor = Math.floor(size * size / 100);
            if (floor > 183) {
                return `#C80000`;
            }
            return gameSetupTheme.virusColor;
        },
        setVirusStrokeColor(size) {
            if (ogario.play && ogario.playerMaxMass != 0) {
                const floor = Math.floor(size * size / 100);
                const biggestCell = floor / (this.selectBiggestCell ? ogario.playerMaxMass : ogario.playerMinMass);
                if (biggestCell > 0.76) {
                    return `#FFDC00`;
                }
                return `#C80000`;
            }
            return gameSetupTheme.virusStrokeColor;
        },
        setAutoHideCellInfo(size) {
            if (size <= 40 || ogario.viewScale < 0.5 && size < 550 && size < 25 / ogario.viewScale) {
                return true;
            }
            return false;
        },
        setParty() {
            let value = JQuery('#party-token').val();
            this.gameMode = ogario.gameMode = JQuery(`#gamemode`).val();
            this.setQuest();
            if (this.gameMode !== ':party' || !value) {
                return;
            }
            let newValue = value;
            if (value.indexOf('#') != -1) {
                value = value.split('#');
                newValue = value[1];
            }
            if (this.partyToken !== newValue) {
                this.partyToken = newValue;
                this.flushSkinsMap();
                this.flushChatData();
                this.cancelTargeting();
            }
        },
        createParty() {
            JQuery('#create-party-btn').click();
        },
        joinParty() {
            const value = JQuery(`#party-token`).val();
            if (!value) {
                return;
            }
            JQuery(`#pre-join-party-btn`).click();
            JQuery(`.party-token`).val(value);
            JQuery('#join-party-btn').click();
        },
        leaveParty() {
            JQuery(`#party-token, .party-token`).val('');
            JQuery(`#leave-party-btn`).click();
        },
        closeParty() {
            JQuery(`#party-token, .party-token`).val('');
            JQuery('.party-icon-back').click();
        },
        flushData() {
            this.flushPartyData();
            this.flushSkinsMap();
            this.flushChatData();
            this.cancelTargeting();
            ogario.play = false;
            ogario.playerColor = null;
        },
        flushPartyData() {
            this.teamPlayers = [];
            this.parties = [];
            this.lastSentNick = '';
            this.lastSentClanTag = null;
            this.lastSentSkinURL = '';
            this.lastSentCustomColor = '';
            this.lastSentPartyToken = '';
            this.lastSentServerToken = '';
        },
        flushCells() {
            this.cells = {};
        },
        flushSkinsMap() {
            this.customSkinsMap = {};
        },
        flushChatData() {
            this.chatUsers = {};
        },
        getWS(ws) {
            if (!ws) {
                return;
            }
            this.ws = ws;
            this.createServerToken();
            this.updateServerInfo();
            if (this.ws.indexOf(`agar.io`) == -1) {
                this.closeConnection();
            }
        },
        recreateWS(token) {
            if (!token) {
                return null;
            }
            let text = null;
            if (/^[a-zA-Z0-9=+/]{12,}$/ .test(token)) {
                const atobToken = atob(token);
                if (/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,4}/ .test(atobToken)) {
                    text = `wss://ip-${atobToken.replace(/./g, '-').replace(':', `.tech.agar.io:`)}`;
                }
            }
            if (!text && /^[a-z0-9]{5,}$/ .test(token)) {
                text = `wss://live-arena-` + token + `.agar.io:443`;
            }
            return text;
        },
        createServerToken() {
            console.log(this.ws)
            let matchOld = this.ws.match(/ip-d+/);
            const matchNew = this.ws.match(/live-arena-([\w\d]+)/);
            let text = null;
            if (matchOld) {
                const replace = this.ws.replace(`.tech.agar.io`, '').replace(/-/g, '.');
                matchOld = replace.match(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,4}/);
                if (matchOld) {
                    this.serverIP = matchOld[0];
                    text = btoa(this.serverIP);
                }
            }
            if (!text && matchNew) {
                this.serverArena = matchNew[1];
                text = this.serverArena;
            }
            if (text) {
                if (this.serverToken !== text) {
                    this.serverToken = text;
                    this.flushData();
                    this.flushCells();
                }
                this.partyToken = '';
                const matchPartyId = this.ws.match(/party_id=([A-Z0-9]{6})/);
                if (matchPartyId) {
                    this.partyToken = matchPartyId[1];
                    changeUrl(`/#${window.encodeURIComponent(this.partyToken)}`);
                }
            }
        },
        updateServerInfo() {
            JQuery(`#server-ws`).val(this.ws);
            JQuery(`#server-token`).val(this.serverToken);
            JQuery(`#party-token, .party-token`).val(this.partyToken);
        },
        gameServerConnect(ws) {
            if (!ws) {
                return;
            }
            this.skipServerData = true;
            window.core && window.core.connect && window.core.connect(ws);
        },
        gameServerReconnect() {
            if (window.MC && window.MC.reconnect) {
                window.MC.reconnect();
                return;
            }
            window.master && window.master.reconnect && window.master.reconnect();
        },
        gameServerJoin(token) {
            const ws = this.recreateWS(token);
            if (ws) {
                this.skipServerData = true;
                this.gameServerConnect(ws);
            }
        },
        connect() {
            this.closeConnection();
            this.flushData();
            this.setParty();
            console.log(`[OGARio by szymy] Connecting to server`);
            if (this.privateMode && this.privateIP) {
                this.socket = new WebSocket(this.privateIP);
            } else {
                this.socket = new WebSocket(this.publicIP);
            }
            this.socket.ogarioWS = true;
            this.socket.binaryType = 'arraybuffer';
            const app = this;
            this.socket.onopen = () => {
                console.log('[OGARio by szymy] Socket open');
                const buf = app.createView(3);
                buf.setUint8(0, 0);
                buf.setUint16(1, 401, true);
                app.sendBuffer(buf);
                app.sendPartyData();
            };
            this.socket.onmessage = message => {
                app.handleMessage(message);
            };
            this.socket.onclose = close => {
                app.flushData();
                console.log('[OGARio by szymy] Socket close', close);
            };
            this.socket.onerror = error => {
                app.flushData();
                console.log(`[OGARio by szymy] Socket error`, error);
            };
        },
        closeConnection() {
            if (this.socket) {
                this.socket.onmessage = null;
                try {
                    this.socket.close();
                } catch (error) {}
                this.socket = null;
            }
        },
        reconnect() {
            this.setParty();
            const app = this;
            setTimeout(() => {
                app.connect();
            }, 1000);
        },
        switchServerMode() {
            if (!this.privateIP) {
                return;
            }
            this.privateMode = !this.privateMode;
            if (this.isSocketOpen()) {
                this.closeConnection();
                toastr.error(`Zamknięto połączenie z serwerem!`);
            }
            if (this.privateMode) {
                toastr.info(`Przełączono na serwer prywatny!`);
                JQuery(`.party-panel`).show();
            } else {
                toastr.info(`Przełączono na serwer publiczny!`);
                JQuery(`#active-parties`).empty();
                JQuery(`.party-panel`).hide();
            }
            this.onJoin();
            if (ogario.play) {
                this.onPlayerSpawn();
            }
        },
        isSocketOpen() {
            return this.socket !== null && this.socket.readyState === this.socket.OPEN;
        },
        createView(value) {
            return new DataView(new ArrayBuffer(value));
        },
        strToBuff(offset, str) {
            const view = this.createView(1 + str.length * 2);
            view.setUint8(0, offset);
            for (let length = 0; length < str.length; length++) {
                view.setUint16(1 + length * 2, str.charCodeAt(length), true);
            }
            return view;
        },
        sendBuffer(value) {
            this.socket.send(value.buffer);
        },
        handleMessage(message) {
            this.readMessage(new DataView(message.data));
        },
        readMessage(message) {
            switch (message.getUint8(0)) {
                case 0:
                    this.playerID = message.getUint32(1, true);
                    break;
                case 1:
                    this.sendPlayerUpdate();
                    break;
                case 20:
                    this.updateTeamPlayer(message);
                    break;
                case 30:
                    this.updateTeamPlayerPosition(message);
                    break;
                case 96:
                    //break;
                    this.updateParties(message);
                    this.displayParties();
                    break;
                case 100:
                    this.readChatMessage(message);
                    break;
            }
        },
        sendPlayerState(state) {
            if (this.isSocketOpen()) {
                const view = this.createView(1);
                view.setUint8(0, state);
                this.sendBuffer(view);
            }
        },
        sendPlayerSpawn() {
            this.sendPlayerState(1);
        },
        sendPlayerDeath() {
            this.sendPlayerState(2);
        },
        sendPlayerJoin() {
            this.sendPlayerState(3);
        },
        sendPlayerData(offset, name, str) {
            if (this[name] !== null && this[name] === str) {
                return;
            }
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(offset, str));
                this[name] = str;
            }
        },
        sendPlayerNick() {
            this.sendPlayerData(10, `lastSentNick`, mainProfile.nick);
        },
        sendPlayerClanTag() {
            this.sendPlayerData(11, `lastSentClanTag`, mainProfile.clanTag);
        },
        sendPlayerSkinURL() {
            this.sendPlayerData(12, `lastSentSkinURL`, mainProfile.skinURL);
        },
        sendPlayerCustomColor() {
            this.sendPlayerData(13, `lastSentCustomColor`, mainProfile.color);
        },
        sendPlayerColor() {
            if (this.isSocketOpen() && ogario.playerColor) {
                this.sendBuffer(this.strToBuff(14, ogario.playerColor));
            }
        },
        sendPartyToken() {
            this.setParty();
            this.sendPlayerData(15, `lastSentPartyToken`, this.partyToken);
        },
        sendServerToken() {
            this.sendPlayerData(16, 'lastSentServerToken', this.serverToken);
        },
        sendServerJoin() {
            this.sendServerToken();
            this.sendPlayerJoin();
        },
        sendServerRegion() {
            if (!this.region) {
                return;
            }
            const region = this.region.split('-');
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(17, region[0]));
            }
        },
        sendServerGameMode() {
            let gamemode = `FFA`;
            switch (this.gameMode) {
                case `:battleroyale`:
                    gamemode = `BTR`;
                    break;
                case `:teams`:
                    gamemode = `TMS`;
                    break;
                case `:experimental`:
                    gamemode = `EXP`;
                    break;
                case `:party`:
                    gamemode = `PTY`;
                    break;
            }
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(18, gamemode));
            }
        },
        sendServerData() {
            if (this.skipServerData) {
                this.skipServerData = false;
                return;
            }
            this.region = JQuery('#region').val();
            this.gameMode = JQuery('#gamemode').val();
            this.sendServerRegion();
            this.sendServerGameMode();
        },
        sendPartyData() {
            this.sendPlayerClanTag();
            this.sendPartyToken();
            this.sendServerToken();
            this.sendPlayerNick();
        },
        sendPlayerUpdate() {
            if (this.isSocketOpen() && ogario.play && this.playerID && ogario.playerColor) {
                function encode(str) {
                    for (let length = 0; length < str.length; length++) {
                        view.setUint16(offset, str.charCodeAt(length), true);
                        offset += 2;
                    }
                    view.setUint16(offset, 0, true);
                    offset += 2;
                }
                let text = 41;
                text += mainProfile.nick.length * 2;
                text += mainProfile.skinURL.length * 2;
                var view = this.createView(text);
                view.setUint8(0, 20);
                view.setUint32(1, this.playerID, true);
                var offset = 5;
                encode(mainProfile.nick);
                encode(mainProfile.skinURL);
                encode(mainProfile.color);
                encode(ogario.playerColor);
                this.sendBuffer(view);
            }
        },
        sendPlayerPosition() {
            if (this.isSocketOpen() && ogario.play && this.playerID) {
                const view = this.createView(17);
                view.setUint8(0, 30);
                view.setUint32(1, this.playerID, true);
                view.setInt32(5, this.getPlayerX(), true);
                view.setInt32(9, this.getPlayerY(), true);
                if (typeof ogario.playerMass !== `undefined`) {
                    view.setUint32(13, ogario.playerMass, true);
                } else {
                    view.setUint32(13, this.playerMass, true);
                }
                this.sendBuffer(view);
            }
        },
        checkPlayerID(id) {
            if (id) {
                for (let length = 0; length < this.teamPlayers.length; length++) {
                    if (this.teamPlayers[length].id == id) {
                        return length;
                    }
                }
            }
            return null;
        },
        updateTeamPlayer(message) {
            function encode() {
                for (var text = '';;) {
                    const string = message.getUint16(offset, true);
                    if (string == 0) {
                        break;
                    }
                    text += String.fromCharCode(string);
                    offset += 2;
                }
                offset += 2;
                return text;
            }
            const id = message.getUint32(1, true);
            var offset = 5;
            const nick = encode();
            const skinUrl = this.checkSkinURL(encode());
            const customColor = encode();
            const defaultColor = encode();
            const skinName = this.gameMode === `:party` ? nick + defaultColor : nick;
            const userId = this.checkPlayerID(id);
            if (userId !== null) {
                this.teamPlayers[userId].nick = nick;
                this.teamPlayers[userId].skinID = skinName;
                this.teamPlayers[userId].skinURL = skinUrl;
                this.teamPlayers[userId].setColor(defaultColor, customColor);
            } else {
                const map = new minimap(id, nick, skinName, skinUrl);
                map.setColor(defaultColor, customColor);
                this.teamPlayers.push(map);
            }
            this.cacheCustomSkin(nick, defaultColor, skinUrl);
        },
        updateTeamPlayerPosition(message) {
            const id = message.getUint32(1, true);
            const userId = this.checkPlayerID(id);
            if (userId !== null) {
                const x = message.getInt32(5, true);
                const y = message.getInt32(9, true);
                const mass = message.getUint32(13, true);
                if (mass > 360000) {
                    return;
                }
                const teamPlayer = this.teamPlayers[userId];
                teamPlayer.x = x;
                teamPlayer.y = y;
                teamPlayer.mass = mass;
                teamPlayer.alive = true;
                teamPlayer.updateTime = Date.now();
                if (this.targeting && this.targetID && id == this.targetID) {
                    this.updateTarget(teamPlayer.nick, teamPlayer.skinURL, x, y, mass, teamPlayer.color);
                }
            }
        },
        updateTeamPlayers() {
            this.sendPlayerPosition();
            this.chatUsers = {};
            this.top5 = [];

            for (const teamPlayer of this.teamPlayers) {
                if (teamPlayer.alive && Date.now() - teamPlayer.updateTime >= 2000 || teamPlayer.mass == 0) {
                    teamPlayer.alive = false;
                    if (this.targeting && this.targetID && teamPlayer.id == this.targetID) {
                        this.setTargetStatus(2);
                    }
                }
                if (teamPlayer.alive) {
                    this.top5.push({
                        id: teamPlayer.id,
                        nick: teamPlayer.nick,
                        x: teamPlayer.x,
                        y: teamPlayer.y,
                        mass: teamPlayer.mass,
                        color: teamPlayer.color
                    });
                    if (!this.isChatUserMuted(teamPlayer.id)) {
                        this.addChatUser(teamPlayer.id, teamPlayer.nick);
                    }
                }
            }

            this.top5.sort((row, config) => config.mass - row.mass);
            this.displayTop5();
        },
        updateParties(message) {
            this.parties = [];
            const userLength = message.getUint8(1);
            for (let offset = 2, length = 0; length < userLength; length++) {
                for (var text = '';;) {
                    const string = message.getUint16(offset, true);
                    if (string == 0) {
                        break;
                    }
                    text += String.fromCharCode(string);
                    offset += 2;
                }
                offset += 2;
                this.parties.push(text);
            }
        },
        readChatMessage(message) {
            if (gameOptionSettings.disableChat) {
                return;
            }
            const time = new Date().toTimeString().replace(/^(d{2}:d{2}).*/, '$1');
            const type = message.getUint8(1);
            const id = message.getUint32(2, true);
            const nick = message.getUint32(6, true);
            if (this.isChatUserMuted(id) || nick != 0 && nick != this.playerID && id != this.playerID) {
                return;
            }
            for (var text = '', length = 10; length < message.byteLength; length += 2) {
                const string = message.getUint16(length, true);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            this.displayChatMessage(time, type, id, text);
        },
        sendChatMessage(type, message) {
            if (Date.now() - this.lastMessageSentTime < 500 || message.length == 0 || mainProfile.nick.length == 0) {
                return;
            }
            if (this.isSocketOpen()) {
                var message = `${mainProfile.nick}: ${message}`;
                const view = this.createView(10 + message.length * 2);
                view.setUint8(0, 100);
                view.setUint8(1, type);
                view.setUint32(2, this.playerID, true);
                view.setUint32(6, 0, true);
                for (let length = 0; length < message.length; length++) {
                    view.setUint16(10 + length * 2, message.charCodeAt(length), true);
                }
                this.sendBuffer(view);
                this.lastMessageSentTime = Date.now();
            }
        },
        prepareCommand(command) {
            const chatCommand = command.replace(`%currentSector%`, this.currentSector);
            return chatCommand;
        },
        sendCommand(command) {
            const prepareCommand = this.prepareCommand(chatCommand[`comm` + command]);
            this.sendChatMessage(102, prepareCommand);
        },
        addChatUser(id, name) {
            this.chatUsers[id] = name;
        },
        getChatUserNick(id) {
            if (this.chatUsers.hasOwnProperty(id)) {
                return this.chatUsers[id];
            }
            return '';
        },
        muteChatUser(id) {
            if (!id || this.isChatUserMuted(id)) {
                return;
            }
            const User = this.getChatUserNick(id);
            this.chatMutedUsers[id] = User;
            this.chatMutedUserIDs.push(id);
            toastr.error(`${textLanguage.userMuted.replace(`%user%`, `<strong>` + this.escapeHTML(User) + `</strong>`) + ` <button data-user-id="` + id}" class="btn btn-xs btn-green btn-unmute-user">${textLanguage.unmute}${`</button>`}`);
        },
        unmuteChatUser(id) {
            if (!id) {
                return;
            }
            const User = this.chatMutedUserIDs.indexOf(id);
            if (User != -1) {
                this.chatMutedUserIDs.splice(User, 1);
                toastr.info(textLanguage.userUnmuted.replace(`%user%`, `${`<strong>` + this.escapeHTML(this.chatMutedUsers[id])}</strong>`));
                delete this.chatMutedUsers[id];
            }
        },
        isChatUserMuted(id) {
            if (this.chatMutedUserIDs.indexOf(id) != -1) {
                return true;
            }
            return false;
        },
        parseMessage(string) {
            const isImage = /[img]([w:/.?]+)[/img]/i;
            if (isImage.test(string)) {
                var url = string.match(isImage)[1];
                if (gameOptionSettings.showChatImages && this.checkImgURL(url)) {
                    return `<img src="` + url + `" style="width:100%;border:none;">`;
                }
                return '';
            }
            const isVideo = /[yt]([w-]{11})[/yt]/i;
            if (isVideo.test(string)) {
                if (gameOptionSettings.showChatVideos) {
                    var url = string.match(isVideo);
                    return `<iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/${url[1]}${`?autoplay=1&amp;vq=tiny" frameborder="0" />`}`;
                }
                return '';
            }
            let escapedHtml = this.escapeHTML(string);
            if (gameOptionSettings.chatEmoticons) {
                escapedHtml = this.parseEmoticons(escapedHtml);
            }
            return escapedHtml;
        },
        parseEmoticons(string) {
            return String(string).replace(/&lt;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, event => `<img src="https://cdn.ogario.ovh/static/emoticons/${emojiChar[event]}${`" alt="`}${event}${`" class="emoticon">`}`);
        },
        displayChatMessage(time, type, id, nick) {
            if (nick.length == 0) {
                return;
            }
            let userName = nick.split(': ', 1).toString();
            const parseMessage = this.parseMessage(nick.replace(`${userName}: `, ''));
            if (userName.length == 0 || userName.length > 15 || parseMessage.length == 0) {
                return;
            }
            let text = '';
            if (id != 0 && id != this.playerID) {
                this.addChatUser(id, userName);
                text = `${`<a href="#" data-user-id="` + id}" class="mute-user ogicon-user-minus"></a> `;
            }
            userName = this.escapeHTML(userName);
            if (type == 101) {
                if (gameOptionSettings.showChatBox) {
                    JQuery(`#chat-box`).append(`${`<div class="message"><span class="message-time">[` + time + `] </span>` + text + `<span class="message-nick">` + userName}: </span><span class="message-text">${parseMessage}${`</span></div>`}`);
                    JQuery('#chat-box').perfectScrollbar(`update`);
                    JQuery('#chat-box').animate({
                        scrollTop: JQuery('#chat-box').prop(`scrollHeight`)
                    }, 500);
                    if (gameOptionSettings.chatSounds) {
                        this.playSound(this.messageSound);
                    }
                    return;
                }
                if (!gameOptionSettings.hideChat) {
                    toastr.success(`${`<span class="message-nick">` + userName + `: </span><span class="message-text">` + parseMessage}</span>${text}`);
                    if (gameOptionSettings.chatSounds) {
                        this.playSound(this.messageSound);
                    }
                }
                this.chatHistory.push({
                    nick: userName,
                    message: parseMessage
                });
                if (this.chatHistory.length > 15) {
                    this.chatHistory.shift();
                }
            } else if (type == 102) {
                if (gameOptionSettings.showChatBox) {
                    JQuery(`#chat-box`).append(`${`<div class="message command"><span class="command-time">[` + time + `] </span>` + text}<span class="command-nick">${userName}: </span><span class="command-text">${parseMessage}${`</span></div>`}`);
                    JQuery('#chat-box').perfectScrollbar('update');
                    JQuery(`#chat-box`).animate({
                        scrollTop: JQuery('#chat-box').prop(`scrollHeight`)
                    }, 500);
                    if (gameOptionSettings.chatSounds) {
                        this.playSound(this.commandSound);
                    }
                    return;
                }
                if (!gameOptionSettings.hideChat) {
                    toastr.warning(`${`<span class="command-nick">` + userName}: </span><span class="command-text">${parseMessage}</span>${text}`);
                    if (gameOptionSettings.chatSounds) {
                        this.playSound(this.commandSound);
                    }
                }
            } else {
                JQuery(`#messages`).append(nick);
            }
        },
        displayUserList(users, activeUser, html, isMute, icon) {
            let text = '';
            if (Object.keys(users).length) {
                text += `<ol class="user-list">`;
                for (const user in users) {
                    if (users.hasOwnProperty(user)) {
                        text += `${`<li><strong>` + this.escapeHTML(users[user]) + `</strong> <button data-user-id="` + user}" class="btn btn-xs ${html}">${isMute}${`</button></li>`}`;
                    }
                }
                text += `</ol>`;
            } else {
                text += textLanguage.none;
            }
            toastr[icon](text, activeUser, {
                closeButton: true,
                tapToDismiss: false
            });
        },
        displayChatActiveUsers() {
            this.displayUserList(this.chatUsers, textLanguage.activeUsers, `btn-red btn-mute-user`, textLanguage.mute, 'info');
        },
        displayChatMutedUsers() {
            this.displayUserList(this.chatMutedUsers, textLanguage.mutedUsers, `btn-green btn-unmute-user`, textLanguage.unmute, 'error');
        },
        preloadChatSounds() {
            this.setMessageSound();
            this.setCommandSound();
        },
        setChatSoundsBtn() {
            if (gameOptionSettings.chatSounds) {
                JQuery(`.chat-sound-notifications`).removeClass(`ogicon-volume-mute2`).addClass(`ogicon-volume-high`);
            } else {
                JQuery(`.chat-sound-notifications`).removeClass(`ogicon-volume-high`).addClass(`ogicon-volume-mute2`);
            }
        },
        setMessageSound() {
            this.messageSound = this.setSound(gameOptionSettings.messageSound);
        },
        setCommandSound() {
            this.commandSound = this.setSound(gameOptionSettings.commandSound);
        },
        setSound(audio) {
            if (!audio) {
                return null;
            }
            return new Audio(audio);
        },
        playSound(audio) {
            if (audio && audio.play) {
                audio.pause();
                audio.currentTime = 0;
                audio.play();
            }
        },
        setTargeting() {
            if (!this.targetID) {
                return;
            }
            this.targeting = !this.targeting;
            ogario.targeting = this.targeting;
            this.setTargetingInfo();
        },
        setTargetingInfo() {
            if (this.targeting) {
                JQuery(`#set-targeting`).addClass('active');
                JQuery('#target-status').show();
                if (this.targetStatus != 2) {
                    JQuery('#target-summary').show();
                }
            } else {
                JQuery('#set-targeting').removeClass(`active`);
                JQuery(`#target-summary, #target-status`).hide();
            }
        },
        cancelTargeting() {
            this.setTargetStatus(0);
        },
        setPrivateMiniMap() {
            if (!this.targetID) {
                return;
            }
            this.privateMiniMap = !this.privateMiniMap;
            if (this.privateMiniMap) {
                JQuery(`#set-private-minimap`).addClass(`active`);
            } else {
                JQuery('#set-private-minimap').removeClass(`active`);
            }
        },
        setTarget(id) {
            const userId = this.checkPlayerID(id);
            if (userId !== null) {
                const teamPlayer = this.teamPlayers[userId];
                this.targetID = teamPlayer.id;
                this.updateTarget(teamPlayer.nick, teamPlayer.skinURL, teamPlayer.x, teamPlayer.y, teamPlayer.mass, teamPlayer.color);
                if (!teamPlayer.alive) {
                    this.setTargetStatus(2);
                    return;
                }
                this.setTargetStatus(1);
            } else {
                this.setTargetStatus(0);
            }
        },
        setTargetStatus(type) {
            switch (type) {
                case 0:
                    this.targetStatus = 0;
                    this.targetID = 0;
                    this.targetNick = '';
                    this.targetSkinURL = '';
                    this.targeting = false;
                    ogario.targeting = false;
                    this.privateMiniMap = false;
                    JQuery(`#target-skin, #target-nick, #target-summary`).hide();
                    JQuery('#target-status').show().text(`[${textLanguage.targetNotSet}]`);
                    JQuery('#target-panel-hud a').removeClass(`active`);
                    break;
                case 1:
                    this.targetStatus = 1;
                    if (!this.targeting) {
                        this.targeting = true;
                        ogario.targeting = true;
                        this.setTargetingInfo();
                    }
                    JQuery(`#target-skin, #target-nick, #target-status, #target-summary`).show();
                    break;
                case 2:
                    this.targetStatus = 2;
                    JQuery(`#target-summary`).hide();
                    JQuery(`#target-status`).show().text(`[${textLanguage.targetDead}]`);
                    ogario.resetTargetPosition();
                    break;
            }
        },
        changeTarget() {
            let targetId = this.checkPlayerID(this.targetID);
            for (var target = null, length = 0; length < this.teamPlayers.length; length++) {
                if (!this.teamPlayers[length].alive) {
                    continue;
                }
                if (targetId !== null) {
                    if (length < targetId && target === null) {
                        target = length;
                        continue;
                    }
                    if (length > targetId) {
                        target = length;
                        break;
                    }
                } else {
                    targetId = length;
                    break;
                }
            }
            if (target !== null) {
                targetId = target;
            }
            if (targetId !== null) {
                this.setTarget(this.teamPlayers[targetId].id);
            } else {
                this.setTargetStatus(0);
            }
        },
        updateTarget(nick, skinUrl, x, y, mass, color) {
            ogario.setTargetPosition(x, y);
            if (this.targetNick !== nick) {
                this.targetNick = nick;
                JQuery(`#target-nick`).html(this.escapeHTML(nick));
            }
            JQuery(`#target-skin`).css(`background-color`, color);
            if (skinUrl && this.targetSkinURL !== skinUrl) {
                if (this.customSkinsCache.hasOwnProperty(skinUrl + `_cached`)) {
                    JQuery('#target-skin img').attr(`src`, skinUrl);
                    this.targetSkinURL = skinUrl;
                } else {
                    JQuery(`#target-skin img`).attr(`src`, `https://cdn.ogario.ovh/static/img/blank.png`);
                }
            }
            JQuery(`#target-status`).text(`[${this.shortMassFormat(mass)}]`);
            const mapSector = this.calculateMapSector(x, y);
            let html = `${textLanguage.targetDistance + `: <span class="hud-main-color">` + ogario.targetDistance} [${mapSector}]</span>`;
            if (ogario.play) {
                html += ` | ` + textLanguage.targetMass + `: <span class="hud-main-color">` + this.shortMassFormat(mass + ogario.playerMass) + `</span>`;
            }
            JQuery('#target-summary').html(html);
            if (this.targetStatus != 1) {
                this.setTargetStatus(1);
            }
        },
        updateQuest() {
            if (!this.showQuest || this.gameMode !== `:ffa`) {
                return;
            }
            if (window.MC && window.MC.getQuestProgressLabel) {
                this.questHUD.textContent = window.MC.getQuestProgressLabel();
            }
        },
        init() {
            this.loadSettings();
            this.loadProfiles();
            this.setLang();
            this.setMenu();
            this.setUI();
            OgarioSettings && OgarioSettings.setTheme();
            this.setShowQuickMenu();
            this.setShowSkinsPanel();
            this.setProfile();
            this.setMainButtons();
            this.setStreamMode();
            this.setHideSkinUrl();
            this.setMiniMap();
            this.setAutoResp();
            this.setDisableChat();
            this.setShowChatBox();
            this.setTop5();
            this.setTargetingHUD();
            this.setQuest();
            this.displayTime();
            this.setCenteredLb();
            this.setNormalLb();
            this.setFpsAtTop();
            this.displayStats();
            this.setBlockPopups();
            this.preloadChatSounds();
            this.setChatSoundsBtn();
            const app = this;
            setInterval(() => {
                app.drawMiniMap();
            }, 33);
            setInterval(() => {
                app.updateTeamPlayers();
            }, this.updateInterval);
        }
    };

    function newCanvas() {
        this.txt = '';
        this.txtCanvas = null;
        this.txtCtx = null;
        this.color = '#FFFFFF';
        this.stroke = false;
        this.strokeWidth = 2;
        this.strokeColor = '#000000';
        this.font = `700 16px Ubuntu`;
        this.fontFamily = `Ubuntu`;
        this.fontWeight = 700;
        this.fontSize = 16;
        this.margin = 3;
        this.scale = 1;
        this.quality = 1;
        this.measuredWidth = 0;
        this.redraw = false;
        this.remeasure = false;
        this.setTxt = function(text) {
            if (this.txt !== text) {
                this.txt = text;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setColor = function(color) {
            if (this.color !== color) {
                this.color = color;
                this.redraw = true;
            }
        };
        this.setStroke = function(stroke) {
            if (this.stroke !== stroke) {
                this.stroke = stroke;
                this.redraw = true;
            }
        };
        this.setStrokeWidth = function(width) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeWidth != width) {
                this.strokeWidth = width;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setStrokeColor = function(color) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeColor !== color) {
                this.strokeColor = color;
                this.redraw = true;
            }
        };
        this.setFont = function() {
            this.font = `${this.fontWeight} ${this.fontSize}${`px `}${this.fontFamily}`;
        };
        this.setFontFamily = function(font) {
            if (this.fontFamily !== font) {
                this.fontFamily = font;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontWeight = function(weigth) {
            if (this.fontWeight != weigth) {
                this.fontWeight = weigth;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontSize = function(size) {
            if (this.fontSize != size) {
                this.fontSize = size;
                this.margin = ~~(size * 0.2);
                this.setFont();
                this.redraw = true;
            }
        };
        this.setScale = function(scale) {
            if (this.scale != scale) {
                this.scale = scale;
                this.redraw = true;
            }
        };
        this.createCanvas = function() {
            if (this.txtCanvas) {
                return;
            }
            this.txtCanvas = document.createElement(`canvas`);
            this.txtCtx = this.txtCanvas.getContext('2d');
            this.txtCtx.ogarioCtx = true;
        };
        this.setDrawing = function(color, font, weigth, stroke, width, strokeColor) {
            this.setColor(color);
            this.setFontFamily(font);
            this.setFontWeight(weigth);
            this.setStroke(stroke);
            this.setStrokeWidth(width);
            this.setStrokeColor(strokeColor);
        };
        this.measureWidth = function() {
            if (this.remeasure) {
                this.txtCtx.font = this.fontWeight + ` 10px ` + this.fontFamily;
                this.measuredWidth = this.txtCtx.measureText(this.txt).width;
                this.remeasure = false;
            }
            return ~~(this.fontSize / 10 * this.measuredWidth) + this.strokeWidth * 2;
        };
        this.drawTxt = function() {
            this.createCanvas();
            if (this.redraw) {
                this.redraw = false;
                this.txtCanvas.width = this.measureWidth();
                this.txtCanvas.height = this.fontSize + this.margin;
                this.txtCtx.font = this.font;
                this.txtCtx.globalAlpha = 1;
                this.txtCtx.lineWidth = this.strokeWidth;
                this.txtCtx.strokeStyle = this.strokeColor;
                this.txtCtx.fillStyle = this.color;
                if (this.stroke) {
                    this.txtCtx.strokeText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
                }
                this.txtCtx.fillText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
            }
            return this.txtCanvas;
        };
    }

    function Cell(id, x, y, size, color, isFood, isVirus, isPlayer, shortMass, virusMassShots) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.color = color;
        this.oppColor = null;
        this.size = size;
        this.targetSize = size;
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
        this.isFood = isFood;
        this.isVirus = isVirus;
        this.isPlayerCell = isPlayer;
        this.shortMass = shortMass;
        this.virMassShots = virusMassShots;
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
        this.update = function(x, y, mass, isVirus, isPlayer, nick) {
            this.x = x;
            this.y = y;
            this.isVirus = isVirus;
            this.isPlayerCell = isPlayer;
            this.setMass(mass);
            this.setNick(nick);
        };
        this.removeCell = function() {
            this.removed = true;
            let cells = Connection.cells.indexOf(this);
            if (cells != -1) {
                Connection.cells.splice(cells, 1);
                if (gameOptionSettings.virusesRange) {
                    cells = Connection.viruses.indexOf(this);
                    if (cells != -1) {
                        Connection.viruses.splice(cells, 1);
                    }
                }
            } else {
                cells = Connection.food.indexOf(this);
                if (cells != -1) {
                    Connection.food.splice(cells, 1);
                }
            }
            cells = Connection.playerCells.indexOf(this);
            if (cells != -1) {
                Connection.removePlayerCell = true;
                Connection.playerCells.splice(cells, 1);
                cells = Connection.playerCellIDs.indexOf(this.id);
                if (cells != -1) {
                    Connection.playerCellIDs.splice(cells, 1);
                }
            }
            if (this.redrawed) {
                Connection.removedCells.push(this);
            }
            delete Connection.indexedCells[this.id];
        };
        this.moveCell = function() {
            const time = Connection.time - this.time;
            let delay = time / gameOptionSettings.animation;
            delay = delay < 0 ? 0 : delay > 1 ? 1 : delay;
            this.x += (this.targetX - this.x) * delay;
            this.y += (this.targetY - this.y) * delay;
            this.size += (this.targetSize - this.size) * delay;
            this.alpha = delay;
            if (!this.removed) {
                this.time = Connection.time;
                return;
            }
            if (delay == 1) {
                const removedCells = Connection.removedCells.indexOf(this);
                if (removedCells != -1) {
                    Connection.removedCells.splice(removedCells, 1);
                }
            }
        };
        this.isInView = function() {
            return this.id <= 0 ? false : this.x + this.size + 40 < Connection.viewX - Connection.canvasWidth / 2 / Connection.scale || this.y + this.size + 40 < Connection.viewY - Connection.canvasHeight / 2 / Connection.scale || this.x - this.size - 40 > Connection.viewX + Connection.canvasWidth / 2 / Connection.scale || this.y - this.size - 40 > Connection.viewY + Connection.canvasHeight / 2 / Connection.scale ? false : true;
        };
        this.setMass = function(mass) {
            this.size = mass;
            if (mass <= 40) {
                return false;
            }
            if (!this.massCanvas) {
                this.massCanvas = new newCanvas();
                return false;
            }
            this.mass = ~~(mass * mass / 100);
            this.redrawMass = true;
            if (this.isVirus) {
                if (this.virMassShots && this.mass < 200) {
                    this.mass = ~~((200 - this.mass) / 14);
                }
                this.massTxt = this.mass.toString();
                return true;
            }
            this.massTxt = this.mass.toString();
            if (this.mass <= 200) {
                return true;
            }
            if (this.shortMass && this.mass >= 1000) {
                this.kMass = Math.round(this.mass / 100) / 10;
                this.massTxt = `${this.kMass}k`;
                return true;
            }
            if (this.optimizedMass) {
                this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;
            }
            return true;
        };
        this.setNick = function(nick) {
            this.nick = nick;
            if (!nick || this.isVirus) {
                return false;
            }
            if (!this.nickCanvas) {
                this.nickCanvas = new newCanvas();
                return false;
            }
            return true;
        };
        this.setScale = function(scale, nickScale, massScale, virusScale, strokeScale) {
            const ceilScale = Math.ceil(scale * 10) / 10;
            this.rescale = false;
            if (this.scale != ceilScale) {
                this.scale = ceilScale;
                this.rescale = true;
            }
            this.nickScale = nickScale;
            this.massScale = massScale;
            this.virMassScale = virusScale;
            this.strokeScale = strokeScale;
        };
        this.setFontSize = function() {
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
        this.setStrokeSize = function() {
            if (this.strokeNick && !this.isVirus) {
                this.nickStrokeSize = ~~(this.nickSize * 0.1 * this.strokeScale);
            }
            if (this.strokeMass) {
                this.massStrokeSize = ~~(this.massSize * 0.1 * this.strokeScale);
            }
        };
        this.setDrawing = function() {
            this.optimizedNames = gameOptionSettings.optimizedNames;
            this.optimizedMass = gameOptionSettings.optimizedMass;
            this.shortMass = gameOptionSettings.shortMass;
            this.virMassShots = gameOptionSettings.virMassShots;
            this.strokeNick = gameOptionSettings.namesStroke;
            this.strokeMass = gameOptionSettings.massStroke;
        };
        this.setDrawingScale = function() {
            this.setScale(ogario.viewScale, gameSetupTheme.namesScale, gameSetupTheme.massScale, gameSetupTheme.virMassScale, gameSetupTheme.strokeScale);
            this.setFontSize();
            this.setStrokeSize();
            this.margin = 0;
        };
        this.drawNick = function(ctx) {
            if (!this.nick || !this.nickCanvas || this.isVirus) {
                return;
            }
            const canvas = this.nickCanvas;
            canvas.setDrawing(gameSetupTheme.namesColor, gameSetupTheme.namesFontFamily, gameSetupTheme.namesFontWeight, this.strokeNick, this.nickStrokeSize, gameSetupTheme.namesStrokeColor);
            canvas.setTxt(this.nick);
            if (this.redrawNick) {
                canvas.setFontSize(this.nickSize);
                this.lastNickSize = this.nickSize;
            }
            canvas.setScale(this.scale);
            const imgTxt = canvas.drawTxt();
            const width = ~~(imgTxt.width / this.scale);
            const heigth = ~~(imgTxt.height / this.scale);
            this.margin = ~~(heigth / 2);
            ctx.drawImage(imgTxt, ~~this.x - ~~(width / 2), ~~this.y - this.margin, width, heigth);
        };
        this.drawMass = function(ctx) {
            if (!this.massCanvas || this.size <= 40) {
                return;
            }
            const canvas = this.massCanvas;
            canvas.setDrawing(gameSetupTheme.massColor, gameSetupTheme.massFontFamily, gameSetupTheme.massFontWeight, this.strokeMass, this.massStrokeSize, gameSetupTheme.massStrokeColor);
            if (this.redrawMass) {
                canvas.setTxt(this.massTxt);
                this.lastMass = this.mass;
            }
            canvas.setFontSize(this.massSize);
            canvas.setScale(this.scale);
            const imgTxt = canvas.drawTxt();
            const width = ~~(imgTxt.width / this.scale);
            const heigth = ~~(imgTxt.height / this.scale);
            const margin = this.margin == 0 ? ~~this.y - ~~(heigth / 2) : ~~this.y + this.margin;
            ctx.drawImage(imgTxt, ~~this.x - ~~(width / 2), margin, width, heigth);
        };
        this.draw = function(ctx, update) {
            if (Connection.hideSmallBots && this.size <= 36) {
                return;
            }
            ctx.save();
            this.redrawed++;
            if (update) {
                this.moveCell();
            }
            if (this.removed) {
                ctx.globalAlpha *= 1 - this.alpha;
            }
            const alpha = ctx.globalAlpha;
            let isAplha = false;
            const size = this.isFood ? this.size + gameSetupTheme.foodSize : this.size;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, this.pi2, false);
            ctx.closePath();
            if (this.isFood) {
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
                return;
            }
            if (this.isVirus) {
                if (gameOptionSettings.transparentViruses) {
                    ctx.globalAlpha *= gameSetupTheme.virusAlpha;
                    isAplha = true;
                }
                if (gameOptionSettings.virColors && Connection.play) {
                    ctx.fillStyle = application.setVirusColor(size);
                    ctx.strokeStyle = application.setVirusStrokeColor(size);
                } else {
                    ctx.fillStyle = gameSetupTheme.virusColor;
                    ctx.strokeStyle = gameSetupTheme.virusStrokeColor;
                }
                ctx.fill();
                if (isAplha) {
                    ctx.globalAlpha = alpha;
                    isAplha = false;
                }
                ctx.lineWidth = gameSetupTheme.virusStrokeSize;
                ctx.stroke();
                if (gameOptionSettings.showMass) {
                    this.setDrawing();
                    this.setDrawingScale();
                    this.setMass(this.size);
                    this.drawMass(ctx);
                }
                ctx.restore();
                return;
            }
            if (gameOptionSettings.transparentCells) {
                ctx.globalAlpha *= gameSetupTheme.cellsAlpha;
                isAplha = true;
            }
            let color = this.color;
            if (Connection.play) {
                if (this.isPlayerCell) {
                    if (gameOptionSettings.myCustomColor) {
                        color = mainProfile.color;
                    }
                } else if (gameOptionSettings.oppColors && !gameOptionSettings.oppRings) {
                    color = this.oppColor;
                }
            }
            ctx.fillStyle = color;
            ctx.fill();
            if (isAplha) {
                ctx.globalAlpha = alpha;
                isAplha = false;
            }
            let skin = null;
            if (gameOptionSettings.customSkins && Connection.showCustomSkins) {
                skin = application.getCustomSkin(this.targetNick, this.color);
                if (skin) {
                    if ((gameOptionSettings.transparentSkins || Connection.play && gameOptionSettings.oppColors) && !(this.isPlayerCell && !gameOptionSettings.myTransparentSkin) || this.isPlayerCell && gameOptionSettings.myTransparentSkin) {
                        ctx.globalAlpha *= gameSetupTheme.skinsAlpha;
                        isAplha = true;
                    }
                    ctx.drawImage(skin, this.x - size, this.y - size, 2 * size, 2 * size);
                    if (isAplha) {
                        ctx.globalAlpha = alpha;
                        isAplha = false;
                    }
                }
            }
            if (gameOptionSettings.teammatesInd && !this.isPlayerCell && size <= 200 && (skin || application.checkSkinsMap(this.targetNick, this.color))) {
                drawRender.drawTeammatesInd(ctx, this.x, this.y, size);
            }
            if (gameOptionSettings.noNames && !gameOptionSettings.showMass || update) {
                ctx.restore();
                return;
            }
            let hideCells = false;
            if (!this.isPlayerCell) {
                hideCells = application.setAutoHideCellInfo(size);
                if (hideCells && gameOptionSettings.autoHideNames && gameOptionSettings.autoHideMass) {
                    ctx.restore();
                    return;
                }
            }
            this.setDrawing();
            this.setDrawingScale();
            ctx.globalAlpha *= gameSetupTheme.textAlpha;
            if (!gameOptionSettings.noNames && !(hideCells && gameOptionSettings.autoHideNames) && !(this.isPlayerCell && gameOptionSettings.hideMyName) && !(skin && gameOptionSettings.hideTeammatesNames)) {
                if (this.setNick(this.targetNick)) {
                    this.drawNick(ctx);
                }
            }
            if (gameOptionSettings.showMass && !(hideCells && gameOptionSettings.autoHideMass) && !(this.isPlayerCell && gameOptionSettings.hideMyMass) && !(gameOptionSettings.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
                if (this.setMass(this.size)) {
                    this.drawMass(ctx);
                }
            }
            ctx.restore();
        };
    }

    function Node(view, offset) {
        this.view = view;
        this.offset = offset;
        this.contentType = 1;
        this.uncompressedSize = 0;
        this.setContentType = function() {
            this.contentType = this.readUint32();
        };
        this.setUncompressedSize = function() {
            this.uncompressedSize = this.readUint32();
        };
        this.compareBytesGt = (bytes1, bytes2) => {
            const byte_1 = bytes1 < 0;
            const byte_2 = bytes2 < 0;
            if (byte_1 != byte_2) {
                return byte_1;
            }
            return bytes1 > bytes2;
        };
        this.skipByte = function() {
            const read = this.readByte();
            if (read < 128) {
                return;
            }
            this.skipByte();
        };
        this.readByte = function() {
            return this.view.getUint8(this.offset++);
        };
        this.readUint32 = function() {
            let number = 0;
            let mayor = 0;
            while (true) {
                const read = this.readByte();
                if (this.compareBytesGt(32, mayor)) {
                    if (read >= 128) {
                        number |= (read & 127) << mayor;
                    } else {
                        number |= read << mayor;
                        break;
                    }
                } else {
                    this.skipByte();
                    break;
                }
                mayor += 7;
            }
            return number;
        };
        this.readFlag = function() {
            return this.readUint32() >>> 3;
        };
    }
    const Connection = {
        ws: null,
        socket: null,
        protocolKey: null,
        clientKey: null,
        connectionOpened: false,
        accessTokenSent: false,
        loggedIn: false,
        clientVersion: 30500,
        clientVersionString: `3.5.0`,
        time: Date.now(),
        serverTime: 0,
        serverTimeDiff: 0,
        loggedInTime: 0,
        mapSize: 14142,
        mapOffset: 7071,
        mapOffsetX: 0,
        mapOffsetY: 0,
        mapOffsetFixed: false,
        mapMinX: -7071,
        mapMinY: -7071,
        mapMaxX: 7071,
        mapMaxY: 7071,
        viewMinX: 0,
        viewMinY: 0,
        viewMaxX: 0,
        viewMaxY: 0,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasScale: 1,
        indexedCells: {},
        cells: [],
        removedCells: [],
        food: [],
        viruses: [],
        playerCells: [],
        playerCellIDs: [],
        ghostCells: [],
        playerX: 0,
        playerY: 0,
        playerSize: 0,
        playerMass: 0,
        playerMaxMass: 0,
        playerMinMass: 0,
        playerScore: 0,
        playerSplitCells: 0,
        playerColor: null,
        playerNick: '',
        playerPosition: 0,
        leaderboard: [],
        biggerSTECellsCache: [],
        biggerCellsCache: [],
        smallerCellsCache: [],
        STECellsCache: [],
        STE: 0,
        autoZoom: false,
        zoomValue: 0.1,
        viewX: 0,
        viewY: 0,
        scale: 1,
        viewScale: 1,
        clientX: 0,
        clientY: 0,
        cursorX: 0,
        cursorY: 0,
        targetX: 0,
        targetY: 0,
        targetDistance: 0,
        battleRoyale: {
            state: 0,
            players: 0,
            startTime: 0,
            shrinkTime: 0,
            timeLeft: 0,
            x: 0,
            y: 0,
            radius: 0,
            targetX: 0,
            targetY: 0,
            targetRadius: 0,
            maxRadius: 11313,
            rank: [],
            playerRank: 0,
            joined: false
        },
        play: false,
        pause: false,
        targeting: false,
        removePlayerCell: false,
        showCustomSkins: true,
        showFood: true,
        foodIsHidden: false,
        selectBiggestCell: true,
        hideSmallBots: false,
        pressedKeys: {},
        connect(url) {
            console.log(`[OGARio by szymy] Connecting to game server:`, url);
            const app = this;
            this.closeConnection();
            this.flushCellsData();
            this.protocolKey = null;
            this.clientKey = null;
            this.accessTokenSent = false;
            this.connectionOpened = false;
            this.loggedIn = false;
            this.mapOffsetFixed = false;
            this.leaderboard = [];
            this.ws = url;
            if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
            window.game.url = url
            window.user.isAlive = false
            window.user.macroFeedInterval = null
            this.socket = new WebSocket(url);
            this.socket.binaryType = `arraybuffer`;
            this.socket.onopen = () => {
                app.onOpen();
            };
            this.socket.onmessage = message => {
                app.onMessage(message);
            };
            this.socket.onerror = error => {
                app.onError(error);
            };
            this.socket.onclose = close => {
                app.onClose(close);
            };
            application.getWS(this.ws);
            application.sendServerJoin();
            application.sendServerData();
            application.displayLeaderboard('');
            if (window.master && window.master.onConnect) {
                window.master.onConnect();
            }
        },
        onOpen() {
            console.log(`[OGARio by szymy] Game server socket open`);
            this.time = Date.now();
            let view = this.createView(5);
            view.setUint8(0, 254);
            if(!window.game.protocolVersion) window.game.protocolVersion = 21
            view.setUint32(1, 21, true);
            this.sendMessage(view);
            view = this.createView(5);
            view.setUint8(0, 255);
            if(!window.game.clientVersion) window.game.clientVersion = this.clientVersion
            view.setUint32(1, this.clientVersion, true);
            this.sendMessage(view);
            this.connectionOpened = true;
        },
        onMessage(message) {
            message = new DataView(message.data);
            if (this.protocolKey) {
                message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
            }
            this.handleMessage(message);
        },
        onError() {
            console.log(`[OGARio by szymy] Game server socket error`);
            this.flushCellsData();
            if (window.master && window.master.onDisconnect) {
                window.master.onDisconnect();
            }
        },
        onClose() {
            console.log('[OGARio by szymy] Game server socket close');
            this.flushCellsData();
            if (window.master && window.master.onDisconnect) {
                window.master.onDisconnect();
            }
        },
        closeConnection() {
            if (this.socket) {
                this.socket.onopen = null;
                this.socket.onmessage = null;
                this.socket.onerror = null;
                this.socket.onclose = null;
                try {
                    this.socket.close();
                } catch (error) {}
                this.socket = null;
                this.ws = null;
            }
        },
        isSocketOpen() {
            return this.socket !== null && this.socket.readyState === this.socket.OPEN;
        },
        writeUint32(data, value) {
            while (true) {
                if ((value & -128) == 0) {
                    data.push(value);
                    return;
                } else {
                    data.push(value & 127 | 128);
                    value = value >>> 7;
                }
            }
        },
        createView(value) {
            return new DataView(new ArrayBuffer(value));
        },
        sendBuffer(data) {
            this.socket.send(data.buffer);
        },
        sendMessage(message) {
            if (this.connectionOpened) {
                if (!this.clientKey) {
                    return;
                }
                message = this.shiftMessage(message, this.clientKey);
                this.clientKey = this.shiftKey(this.clientKey);
            }
            this.sendBuffer(message);
        },
        sendAction(action) {
            if (!this.isSocketOpen()) {
                return;
            }
            const view = this.createView(1);
            view.setUint8(0, action);
            this.sendMessage(view);
        },
        sendSpectate() {
            this.sendAction(1);
        },
        sendFreeSpectate() {
            this.sendAction(18);
        },
        sendEject() {
            this.sendPosition();
            this.sendAction(21);
        },
        sendSplit() {
            this.sendPosition();
            this.sendAction(17);
        },
        sendNick(nick) {
            this.playerNick = nick;
            nick = window.unescape(window.encodeURIComponent(nick));
            const view = this.createView(2 + nick.length);
            for (let length = 0; length < nick.length; length++) {
                view.setUint8(length + 1, nick.charCodeAt(length));
            }
            this.sendMessage(view);
        },
        sendPosition() {
            if (!this.isSocketOpen() || !this.connectionOpened || !this.clientKey) {
                return;
            }
            let cursorX = this.cursorX;
            let cursorY = this.cursorY;
            window.user.mouseX = cursorX - window.user.offsetX
            window.user.mouseY = cursorY - window.user.offsetY
            if(window.user.startedBots && window.user.isAlive) window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY))
            if (!this.play && this.targeting || this.pause) {
                cursorX = this.targetX;
                cursorY = this.targetY;
            }
            const view = this.createView(13);
            view.setUint8(0, 16);
            view.setInt32(1, cursorX, true);
            view.setInt32(5, cursorY, true);
            view.setUint32(9, this.protocolKey, true);
            this.sendMessage(view);
        },
        sendAccessToken(shapes, options, oW) {
            if (this.accessTokenSent) {
                return;
            }
            if (!oW) {
                oW = 102;
            }
            const curr = shapes.length;
            const count = this.clientVersionString.length;
            let data = [oW, 8, 1, 18];
            this.writeUint32(data, curr + count + 23);
            data.push(8, 10, 82);
            this.writeUint32(data, curr + count + 18);
            data.push(8, options, 18, count + 8, 8, 5, 18, count);
            for (var length = 0; length < count; length++) {
                data.push(this.clientVersionString.charCodeAt(length));
            }
            data.push(24, 0, 32, 0, 26);
            this.writeUint32(data, curr + 3);
            data.push(10);
            this.writeUint32(data, curr);
            for (length = 0; length < curr; length++) {
                data.push(shapes.charCodeAt(length));
            }
            data = new Uint8Array(data);
            const dataView = new DataView(data.buffer);
            this.sendMessage(dataView);
        },
        sendFbToken(token) {
            this.sendAccessToken(token, 2);
        },
        sendGplusToken(token) {
            this.sendAccessToken(token, 4);
        },
        sendRecaptcha(token) {
            const view = this.createView(2 + token.length);
            view.setUint8(0, 86);
            for (let length = 0; length < token.length; length++) {
                view.setUint8(1 + length, token.charCodeAt(length));
            }
            view.setUint8(token.length + 1, 0);
            this.sendMessage(view);
        },
        setClientVersion(version, string) {
            this.clientVersion = version;
            this.clientVersionString = string;
            console.log(`[OGARio by szymy] Client version:`, version, string);
        },
        generateClientKey(ip, options) {
            if (!ip.length || !options.byteLength) {
                return null;
            }
            let x = null;
            const Length = 1540483477;
            const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
            const newLength = ipCheck.length + options.byteLength;
            const uint8Arr = new Uint8Array(newLength);
            for (let length = 0; length < ipCheck.length; length++) {
                uint8Arr[length] = ipCheck.charCodeAt(length);
            }
            uint8Arr.set(options, ipCheck.length);
            const dataview = new DataView(uint8Arr.buffer);
            let type = newLength - 1;
            const value = (type - 4 & -4) + 4 | 0;
            let newValue = type ^ 255;
            let offset = 0;
            while (type > 3) {
                x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
                newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
                type -= 4;
                offset += 4;
            }
            switch (type) {
                case 3:
                    newValue = uint8Arr[value + 2] << 16 ^ newValue;
                    newValue = uint8Arr[value + 1] << 8 ^ newValue;
                    break;
                case 2:
                    newValue = uint8Arr[value + 1] << 8 ^ newValue;
                    break;
                case 1:
                    break;
                default:
                    x = newValue;
                    break;
            }
            if (x != newValue) {
                x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
            }
            newValue = x >>> 13;
            x = newValue ^ x;
            x = Math.imul(x, Length) | 0;
            newValue = x >>> 15;
            x = newValue ^ x;
            console.log(`[OGARio by szymy] Generated client key:`, x);
            return x;
        },
        shiftKey(key) {
            const value = 1540483477;
            key = Math.imul(key, value) | 0;
            key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
            key = Math.imul(key >>> 13 ^ key, value) | 0;
            return key >>> 15 ^ key;
        },
        shiftMessage(view, key, write) {
            if (!write) {
                for (var length = 0; length < view.byteLength; length++) {
                    view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
                }
            } else {
                for (var length = 0; length < view.length; length++) {
                    view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
                }
            }
            return view;
        },
        decompressMessage(message) {
            const buffer = window.buffer.Buffer;
            const messageBuffer = new buffer(message.buffer);
            const readMessage = new buffer(messageBuffer.readUInt32LE(1));
            LZ4.decodeBlock(messageBuffer.slice(5), readMessage);
            return readMessage;
        },
        handleMessage(view) {
            const encode = () => {
                for (var text = '';;) {
                    const string = view.getUint8(offset++);
                    if (string == 0) {
                        break;
                    }
                    text += String.fromCharCode(string);
                }
                return text;
            };
            var offset = 0;
            let opCode = view.getUint8(offset++);
            if (opCode == 54) {
                opCode = 53;
            }
            switch (opCode) {
                case 5:
                    break;
                case 17:
                    this.viewX = view.getFloat32(offset, true);
                    offset += 4;
                    this.viewY = view.getFloat32(offset, true);
                    offset += 4;
                    this.scale = view.getFloat32(offset, true);
                    break;
                case 18:
                    if (this.protocolKey) {
                        this.protocolKey = this.shiftKey(this.protocolKey);
                    }
                    this.flushCellsData();
                    break;
                case 32:
                    this.playerCellIDs.push(view.getUint32(offset, true));
                    if (!this.play) {
                        this.play = true;
                        application.hideMenu();
                        this.playerColor = null;
                        application.onPlayerSpawn();
                        window.user.isAlive = true
                        if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
                    }
                    break;
                case 50:
                    this.pieChart = [];
                    const pieLength = view.getUint32(offset, true);
                    offset += 4;
                    for (var length = 0; length < pieLength; length++) {
                        this.pieChart.push(view.getFloat32(offset, true));
                        offset += 4;
                    }
                    drawRender.drawPieChart();
                    break;
                case 53:
                    this.leaderboard = [];
                    this.playerPosition = 0;
                    if (view.getUint8(0) == 54) {
                        const pos = view.getUint16(offset, true);
                        offset += 2;
                    }
                    for (let position = 0; offset < view.byteLength;) {
                        var flags = view.getUint8(offset++);
                        let nick = '';
                        let id = 0;
                        let isFriend = false;
                        position++;
                        if (flags & 2) {
                            nick = window.decodeURIComponent(window.escape(encode()));
                        }
                        if (flags & 4) {
                            id = view.getUint32(offset, true);
                            offset += 4;
                        }
                        if (flags & 8) {
                            nick = this.playerNick;
                            id = `isPlayer`;
                            this.playerPosition = position;
                        }
                        if (flags & 16) {
                            isFriend = true;
                        }
                        this.leaderboard.push({
                            nick: nick,
                            id: id,
                            isFriend: isFriend
                        });
                    }
                    this.handleLeaderboard();
                    break;
                case 54:
                    break;
                case 69:
                    const cellLength = view.getUint16(offset, true);
                    offset += 2;
                    this.ghostCells = [];
                    for (var length = 0; length < cellLength; length++) {
                        offset += 8;
                        const mass = view.getUint32(offset, true);
                        offset += 5;
                        this.ghostCells.push({
                            mass: mass
                        });
                    }
                    break;
                case 85:
                    console.log(`[OGARio by szymy] Captcha requested`);
                    if (window.master && window.master.recaptchaRequested) {
                        window.master.recaptchaRequested();
                    }
                    break;
                case 102:
                    const node = new Node(view, offset);
                    var flags = node.readFlag();
                    if (flags == 1) {
                        node.setContentType();
                    }
                    flags = node.readFlag();
                    if (flags == 2) {
                        node.setUncompressedSize();
                    }
                    flags = node.readFlag();
                    if (flags == 1) {
                        const option = node.readUint32();
                        const response = node.readFlag();
                        const response_2 = node.readUint32();
                        switch (option) {
                            case 11:
                                console.log(`102 login response`, node.view.byteLength, node.contentType, node.uncompressedSize, option, response, response_2);
                                break;
                            case 62:
                                console.log('102 game over');
                                break;
                            default:
                                console.log('102 unknown', option, response);
                        }
                    }
                    if (view.byteLength < 20) {
                        this.loggedIn = false;
                        window.logout && window.logout();
                    }
                    break;
                case 103:
                    this.accessTokenSent = true;
                    break;
                case 114:
                    break;
                case 161:
                    break;
                case 176:
                    this.battleRoyale.startTime = view.getUint32(offset, true);
                    break;
                case 177:
                    this.battleRoyale.joined = true;
                    break;
                case 178:
                    this.battleRoyale.players = view.getUint16(offset, true);
                    offset += 2;
                    var flags = view.getUint16(offset, true);
                    offset += 2;
                    if (!flags) {
                        this.battleRoyale.state = 0;
                        this.battleRoyale.joined = false;
                    }
                    if (flags & 3) {
                        this.battleRoyale.state = view.getUint8(offset++);
                        this.battleRoyale.x = view.getInt32(offset, true);
                        offset += 4;
                        this.battleRoyale.y = view.getInt32(offset, true);
                        offset += 4;
                        this.battleRoyale.radius = view.getUint32(offset, true);
                        offset += 4;
                        this.battleRoyale.shrinkTime = view.getUint32(offset, true) * 1000;
                        offset += 4;
                        if (this.battleRoyale.shrinkTime) {
                            this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 1000);
                            if (this.battleRoyale.timeLeft < 0) {
                                this.battleRoyale.timeLeft = 0;
                            }
                        }
                    }
                    if (flags & 2) {
                        this.battleRoyale.targetX = view.getInt32(offset, true);
                        offset += 4;
                        this.battleRoyale.targetY = view.getInt32(offset, true);
                        offset += 4;
                        this.battleRoyale.targetRadius = view.getUint32(offset, true);
                    }
                    break;
                case 179:
                    var flags = view.getUint8(offset);
                    const string = window.decodeURIComponent(window.escape(encode()));
                    let test = null;
                    if (!flags) {
                        test = window.decodeURIComponent(window.escape(encode()));
                    }
                    break;
                case 180:
                    this.battleRoyale.joined = false;
                    this.battleRoyale.rank = [];
                    this.battleRoyale.playerRank = view.getUint32(offset, true);
                    offset += 8;
                    const royaleLength = view.getUint16(offset, true);
                    offset += 2;
                    for (var length = 0; length < royaleLength; length++) {
                        const name = window.decodeURIComponent(window.escape(encode()));
                        const place = view.getUint32(offset, true);
                        offset += 4;
                        this.battleRoyale.rank.push({
                            place: place,
                            name: name
                        });
                    }
                    break;
                case 226:
                    const ping = view.getUint16(1, true);
                    view = this.createView(3);
                    view.setUint8(0, 227);
                    view.setUint16(1, ping);
                    this.sendMessage(view);
                    break;
                case 241:
                    this.protocolKey = view.getUint32(offset, true);
                    console.log('[OGARio by szymy] Received protocol key:', this.protocolKey);
                    const agarioReader = new Uint8Array(view.buffer, offset += 4);
                    this.clientKey = this.generateClientKey(this.ws, agarioReader);
                    if (window.master && window.master.login) {
                        window.master.login();
                    }
                    break;
                case 242:
                    this.serverTime = view.getUint32(offset, true) * 1000;
                    this.serverTimeDiff = Date.now() - this.serverTime;
                    break;
                case 255:
                    this.handleSubmessage(view);
                    break;
                default:
                    console.log(`[OGARio by szymy] Unknown opcode:`, view.getUint8(0));
                    break;
            }
        },
        handleSubmessage(message) {
            message = this.decompressMessage(message);
            let offset = 0;
            switch (message.readUInt8(offset++)) {
                case 16:
                    this.updateCells(message, offset);
                    break;
                case 64:
                    this.viewMinX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMinY = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxY = message.readDoubleLE(offset);
                    this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                    if(~~(this.viewMaxX - this.viewMinX) === 14142 && ~~(this.viewMaxY - this.viewMinY) === 14142){
                        window.user.offsetX = (this.viewMinX + this.viewMaxX) / 2
                        window.user.offsetY = (this.viewMinY + this.viewMaxY) / 2
                    }
                    break;
                default:
                    console.log(`[OGARio by szymy] Unknown sub opcode:`, message.readUInt8(0));
                    break;
            }
        },
        handleLeaderboard() {
            let text = '';
            let teamText = '';
            for (var length = 0; length < this.leaderboard.length; length++) {
                if (length == 10) {
                    break;
                }
                let html = '<span>';
                if (this.leaderboard[length].id === `isPlayer`) {
                    html = `<span class="me">`;
                } else {
                    if (mainProfile.clanTag.length && this.leaderboard[length].nick.indexOf(mainProfile.clanTag) == 0) {
                        html = `<span class="teammate">`;
                    }
                }
                text += `${html + (length + 1)}. ${application.escapeHTML(this.leaderboard[length].nick)}${`</span>`}`;
            }
            if (this.playerPosition > 10) {
                text += `<span class="me">${this.playerPosition}. ${application.escapeHTML(this.playerNick)}${`</span>`}`;
            }
            if (gameOptionSettings.showLbData) {
                for (var length = 0; length < this.ghostCells.length; length++) {
                    if (length == length) {
                        break;
                    }
                    teamText += '<span class="lb-data">';
                    teamText += `<span class="top5-mass-color">[` + application.shortMassFormat(this.ghostCells[length].mass) + `]</span>`;
                    teamText += `</span>`;
                }
            }
            application.displayLeaderboard(text, teamText);
        },
        flushCellsData() {
            this.indexedCells = {};
            this.cells = [];
            this.playerCells = [];
            this.playerCellIDs = [];
            this.ghostCells = [];
            this.food = [];
            this.viruses = [];
        },
        setMapOffset(left, top, right, bottom) {
            if (right - left > 14000 && bottom - top > 14000) {
                this.mapOffsetX = this.mapOffset - right;
                this.mapOffsetY = this.mapOffset - bottom;
                this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX);
                this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY);
                this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX);
                this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY);
                if (!this.mapOffsetFixed) {
                    this.viewX = (right + left) / 2;
                    this.viewY = (bottom + top) / 2;
                }
                this.mapOffsetFixed = true;
                console.log(`[OGARio by szymy] Map offset fixed (x, y):`, this.mapOffsetX, this.mapOffsetY);
            }
        },
        updateCells(view, offset) {
            const encode = () => {
                for (var text = '';;) {
                    const string = view.readUInt8(offset++);
                    if (string == 0) {
                        break;
                    }
                    text += String.fromCharCode(string);
                }
                return text;
            };
            this.time = Date.now();
            this.removePlayerCell = false;
            let eatEventsLength = view.readUInt16LE(offset);
            offset += 2;
            for (var length = 0; length < eatEventsLength; length++) {
                const victimID = this.indexedCells[view.readUInt32LE(offset)];
                const eaterID = this.indexedCells[view.readUInt32LE(offset + 4)];
                offset += 8;
                if (victimID && eaterID) {
                    eaterID.targetX = victimID.x;
                    eaterID.targetY = victimID.y;
                    eaterID.targetSize = eaterID.size;
                    eaterID.time = this.time;
                    eaterID.removeCell();
                }
            }
            for (length = 0;;) {
                var id = view.readUInt32LE(offset);
                offset += 4;
                if (id == 0) {
                    break;
                }
                const x = view.readInt32LE(offset);
                offset += 4;
                const y = view.readInt32LE(offset);
                offset += 4;
                const size = view.readUInt16LE(offset);
                offset += 2;
                const flags = view.readUInt8(offset++);
                let extendedFlags = 0;
                if (flags & 128) {
                    extendedFlags = view.readUInt8(offset++);
                }
                let color = null;
                let skin = null;
                let name = '';
                let accountID = null;
                if (flags & 2) {
                    const r = view.readUInt8(offset++);
                    const g = view.readUInt8(offset++);
                    const b = view.readUInt8(offset++);
                    color = this.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
                }
                if (flags & 4) {
                    skin = encode();
                }
                if (flags & 8) {
                    name = window.decodeURIComponent(window.escape(encode()));
                }
                const isVirus = flags & 1;
                const isFood = extendedFlags & 1;
                var cell = null;
                if (this.indexedCells.hasOwnProperty(id)) {
                    cell = this.indexedCells[id];
                    if (color) {
                        cell.color = color;
                    }
                } else {
                    cell = new Cell(id, x, y, size, color, isFood, isVirus, false, gameOptionSettings.shortMass, gameOptionSettings.virMassShots);
                    cell.time = this.time;
                    if (!isFood) {
                        if (isVirus && gameOptionSettings.virusesRange) {
                            this.viruses.push(cell);
                        }
                        this.cells.push(cell);
                        if (this.playerCellIDs.indexOf(id) != -1 && this.playerCells.indexOf(cell) == -1) {
                            cell.isPlayerCell = true;
                            this.playerColor = color;
                            this.playerCells.push(cell);
                        }
                    } else {
                        this.food.push(cell);
                    }
                    this.indexedCells[id] = cell;
                }
                if (cell.isPlayerCell) {
                    name = this.playerNick;
                }
                if (name) {
                    cell.targetNick = name;
                }
                cell.targetX = x;
                cell.targetY = y;
                cell.targetSize = size;
                cell.isFood = isFood;
                cell.isVirus = isVirus;
                if (skin) {
                    cell.skin = skin;
                }
                if (extendedFlags & 4) {
                    accountID = view.readUInt32LE(offset);
                    offset += 4;
                }
            }
            eatEventsLength = view.readUInt16LE(offset);
            offset += 2;
            for (length = 0; length < eatEventsLength; length++) {
                var id = view.readUInt32LE(offset);
                offset += 4;
                cell = this.indexedCells[id];
                if (cell) {
                    cell.removeCell();
                }
            }
            if (this.removePlayerCell && !this.playerCells.length) {
                this.play = false;
                application.onPlayerDeath();
                application.showMenu(300);
                window.user.isAlive = false
                if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
            }
        },
        color2Hex(number) {
            const color = number.toString(16);
            return color.length == 1 ? `0${color}` : color;
        },
        rgb2Hex(r, g, b) {
            return `#${this.color2Hex(r)}${this.color2Hex(g)}${this.color2Hex(b)}`;
        },
        sortCells() {
            this.cells.sort((row, conf) => row.size == conf.size ? row.id - conf.id : row.size - conf.size);
        },
        calculatePlayerMassAndPosition() {
            let size = 0;
            let targetSize = 0;
            let x = 0;
            let y = 0;
            const playersLength = this.playerCells.length;
            for (let length = 0; length < playersLength; length++) {
                const currentPlayer = this.playerCells[length];
                size += currentPlayer.size;
                targetSize += currentPlayer.targetSize * currentPlayer.targetSize;
                x += currentPlayer.x / playersLength;
                y += currentPlayer.y / playersLength;
            }
            this.viewX = x;
            this.viewY = y;
            this.playerSize = size;
            this.playerMass = ~~(targetSize / 100);
            this.recalculatePlayerMass();
        },
        recalculatePlayerMass() {
            this.playerScore = Math.max(this.playerScore, this.playerMass);
            if (gameOptionSettings.virColors || gameOptionSettings.splitRange || gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.showStatsSTE) {
                const cells = this.playerCells;
                const CellLength = cells.length;
                cells.sort((row, conf) => row.size == conf.size ? row.id - conf.id : row.size - conf.size);
                this.playerMinMass = ~~(cells[0].size * cells[0].size / 100);
                this.playerMaxMass = ~~(cells[CellLength - 1].size * cells[CellLength - 1].size / 100);
                this.playerSplitCells = CellLength;
            }
            if (gameOptionSettings.showStatsSTE) {
                const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                if (mass > 35) {
                    this.STE = ~~(mass * (mass < 1000 ? 0.35 : 0.38));
                } else {
                    this.STE = null;
                }
            }
        },
        compareCells() {
            if (!this.play) {
                return;
            }
            if (gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.splitRange) {
                if (gameOptionSettings.oppRings || gameOptionSettings.splitRange) {
                    this.biggerSTECellsCache = [];
                    this.biggerCellsCache = [];
                    this.smallerCellsCache = [];
                    this.STECellsCache = [];
                }

                for (const cell of this.cells) {
                    if (cell.isVirus) {
                        continue;
                    }
                    const size = ~~(cell.size * cell.size / 100);
                    const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                    const fixMass = size / mass;
                    const smallMass = mass < 1000 ? 0.35 : 0.38;
                    if (gameOptionSettings.oppColors && !gameOptionSettings.oppRings) {
                        cell.oppColor = this.setCellOppColor(cell.isPlayerCell, fixMass, smallMass);
                    }
                    if (!cell.isPlayerCell && (gameOptionSettings.splitRange || gameOptionSettings.oppRings)) {
                        this.cacheCells(cell.x, cell.y, cell.size, fixMass, smallMass);
                    }
                }
            }
        },
        cacheCells(x, y, size, mass, smallMass) {
            if (mass >= 2.5) {
                this.biggerSTECellsCache.push({
                    x: x,
                    y: y,
                    size: size
                });
                return;
            } else if (mass >= 1.25) {
                this.biggerCellsCache.push({
                    x: x,
                    y: y,
                    size: size
                });
                return;
            } else if (mass < 1.25 && mass > 0.75) {
                return;
            } else if (mass > smallMass) {
                this.smallerCellsCache.push({
                    x: x,
                    y: y,
                    size: size
                });
                return;
            } else {
                this.STECellsCache.push({
                    x: x,
                    y: y,
                    size: size
                });
                return;
            }
        },
        setCellOppColor(isPlayer, mass, smallMass) {
            if (isPlayer) {
                return mainProfile.color;
            }
            if (mass > 11) {
                return `#FF008C`;
            } else if (mass >= 2.5) {
                return `#BE00FF`;
            } else if (mass >= 1.25) {
                return `#FF0A00`;
            } else if (mass < 1.25 && mass > 0.75) {
                return `#FFDC00`;
            } else if (mass > smallMass) {
                return `#00C8FF`;
            } else {
                return `#64FF00`;
            }
        },
        getCursorPosition() {
            this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX;
            this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale + this.viewY;
        },
        setZoom(event) {
            this.zoomValue *= gameOptionSettings.zoomSpeedValue ** (event.wheelDelta / -120 || event.detail || 0);
            if (this.zoomValue > 4 / this.viewScale) {
                this.zoomValue = 4 / this.viewScale;
            }
        },
        setTargetPosition(x, y) {
            this.targetX = x - this.mapOffsetX;
            this.targetY = y - this.mapOffsetY;
            this.targetDistance = Math.round(Math.sqrt((this.playerX - this.targetX) ** 2 + (this.playerY - this.targetY) ** 2));
        },
        resetTargetPosition() {
            this.targetX = this.playerX;
            this.targetY = this.playerY;
        },
        setKeys() {
            const app = this;
            document.onkeydown = event => {
                const key = event.keyCode;
                if (app.pressedKeys[key]) {
                    return;
                }
                switch (key) {
                    case 13:
                        app.sendNick('');
                        break;
                    case 32:
                        app.sendSplit();
                        break;
                    case 81:
                        app.sendFreeSpectate();
                        break;
                    case 83:
                        app.sendSpectate();
                        break;
                    case 87:
                        app.sendEject();
                        break;
                }
            };
            document.onkeyup = event => {
                app.pressedKeys[event.keyCode] = false;
            };
        },
        init() {
            const app = this;
            if (/firefox/i .test(navigator.userAgent)) {
                document.addEventListener(`DOMMouseScroll`, value => {
                    app.setZoom(value);
                }, false);
            } else {
                document.body.onmousewheel = value => {
                    app.setZoom(value);
                };
            }
            setInterval(() => {
                app.sendPosition();
            }, 40);
            if (window.master && window.master.clientVersion) {
                this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
            }
        }
    };
    window.sendAction = action => {
        Connection.sendAction(action);
    };
    var drawRender = {
        canvas: null,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        camX: 0,
        camY: 0,
        scale: 1,
        fpsLastRequest: null,
        renderedFrames: 0,
        fps: 0,
        pi2: 2 * Math.PI,
        battleAreaMap: null,
        battleAreaMapCtx: null,
        pieChart: null,
        pellet: null,
        indicator: null,
        setCanvas() {
            this.canvas = document.getElementById(`canvas`);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.onmousemove = event => {
                Connection.clientX = event.clientX;
                Connection.clientY = event.clientY;
                Connection.getCursorPosition();
            };
        },
        resizeCanvas() {
            this.canvasWidth = window.innerWidth;
            this.canvasHeight = window.innerHeight;
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            Connection.canvasWidth = this.canvasWidth;
            Connection.canvasHeight = this.canvasHeight;
            this.renderFrame();
        },
        setView() {
            this.setScale();
            if (Connection.playerCells.length) {
                Connection.calculatePlayerMassAndPosition();
                this.camX = (this.camX + Connection.viewX) / 2;
                this.camY = (this.camY + Connection.viewY) / 2;
            } else {
                this.camX = (29 * this.camX + Connection.viewX) / 30;
                this.camY = (29 * this.camY + Connection.viewY) / 30;
            }
            Connection.playerX = this.camX;
            Connection.playerY = this.camY;
        },
        setScale() {
            if (!Connection.autoZoom) {
                this.scale = (9 * this.scale + this.getZoom()) / 10;
                Connection.viewScale = this.scale;
                return;
            }
            if (Connection.play) {
                this.scale = (9 * this.scale + Math.min(64 / Connection.playerSize, 1) ** 0.4 * this.getZoom()) / 10;
            } else {
                this.scale = (9 * this.scale + Connection.scale * this.getZoom()) / 10;
            }
            Connection.viewScale = this.scale;
        },
        getZoom() {
            return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * Connection.zoomValue;
        },
        renderFrame() {
            Connection.time = Date.now();
            for (length = 0; length < Connection.cells.length; length++) {
                Connection.cells[length].moveCell();
            }
            this.setView();
            Connection.getCursorPosition();
            Connection.sortCells();
            Connection.compareCells();
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            if (gameOptionSettings.showGrid) {
                this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
            }
            this.ctx.save();
            this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.translate(-this.camX, -this.camY);
            if (gameOptionSettings.showBgSectors) {
                this.drawSectors(this.ctx, Connection.mapOffsetFixed, gameSetupTheme.sectorsX, gameSetupTheme.sectorsY, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX, Connection.mapMaxY, gameSetupTheme.gridColor, gameSetupTheme.sectorsColor, gameSetupTheme.sectorsWidth, true);
            }
            if (Connection.gameMode === ':battleroyale') {
                this.drawBattleArea(this.ctx);
            }
            if (gameOptionSettings.showMapBorders) {
                const borderWidth = gameSetupTheme.bordersWidth / 2;
                this.drawMapBorders(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, gameSetupTheme.bordersColor, gameSetupTheme.bordersWidth);
            }
            if (gameOptionSettings.virusesRange) {
                this.drawVirusesRange(this.ctx, Connection.viruses);
            }
            this.drawFood();
            if (Connection.play) {
                if (gameOptionSettings.splitRange) {
                    this.drawSplitRange(this.ctx, Connection.biggerSTECellsCache, Connection.playerCells, Connection.selectBiggestCell);
                }
                if (gameOptionSettings.oppRings) {
                    this.drawOppRings(this.ctx, this.scale, Connection.biggerSTECellsCache, Connection.biggerCellsCache, Connection.smallerCellsCache, Connection.STECellsCache);
                }
                if (gameOptionSettings.cursorTracking) {
                    this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
                }
            }
            for (var length = 0; length < Connection.removedCells.length; length++) {
                Connection.removedCells[length].draw(this.ctx, true);
            }
            for (length = 0; length < Connection.cells.length; length++) {
                Connection.cells[length].draw(this.ctx);
            }
            this.ctx.restore();
            if (Connection.gameMode === `:teams`) {
                if (this.pieChart && this.pieChart.width) {
                    this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
                }
            }
        },
        drawGrid(ctx, width, heigth, scale, camX, camY) {
            const reWidth = width / scale;
            const reHeigth = heigth / scale;
            let x = (-camX + reWidth / 2) % 50;
            let y = (-camY + reHeigth / 2) % 50;
            ctx.strokeStyle = gameSetupTheme.gridColor;
            ctx.globalAlpha = 1 * scale;
            ctx.beginPath();
            for (; x < reWidth; x += 50) {
                ctx.moveTo(x * scale - 0.5, 0);
                ctx.lineTo(x * scale - 0.5, reHeigth * scale);
            }
            for (; y < reHeigth; y += 50) {
                ctx.moveTo(0, y * scale - 0.5);
                ctx.lineTo(reWidth * scale, y * scale - 0.5);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        },
        drawSectors(ctx, mapOffset, x, y, minX, minY, maxX, maxY, stroke, color, width, type) {
            if (!mapOffset && type) {
                return;
            }
            const posX = ~~((maxX - minX) / x);
            const posY = ~~((maxY - minY) / y);
            let rePosX = 0;
            let rePosY = 0;
            ctx.strokeStyle = stroke;
            ctx.fillStyle = color;
            ctx.lineWidth = width;
            if (type || !type && gameOptionSettings.showMiniMapGrid) {
                ctx.beginPath();
                for (var length = 0; length < x + 1; length++) {
                    rePosX = minX + posX * length;
                    ctx.moveTo(length == x ? maxX : rePosX, minY);
                    ctx.lineTo(length == x ? maxX : rePosX, maxY);
                }
                for (var length = 0; length < y + 1; length++) {
                    rePosY = minY + posY * length;
                    ctx.moveTo(minX - width / 2, length == y ? maxY : rePosY);
                    ctx.lineTo(maxX + width / 2, length == y ? maxY : rePosY);
                }
                ctx.stroke();
            } else {
                this.drawMapBorders(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width);
            }
            if (type) {
                ctx.font = `${gameSetupTheme.sectorsFontWeight} ${gameSetupTheme.sectorsFontSize}${`px `}${gameSetupTheme.sectorsFontFamily}`;
            } else {
                ctx.font = `${gameSetupTheme.miniMapFontWeight} ${~~(0.4 * posY)}${`px `}${gameSetupTheme.miniMapFontFamily}`;
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = `middle`;
            for (var length = 0; length < y; length++) {
                for (let length_2 = 0; length_2 < x; length_2++) {
                    const text = String.fromCharCode(65 + length) + (length_2 + 1);
                    rePosX = ~~(minX + posX / 2 + length_2 * posX);
                    rePosY = ~~(minY + posY / 2 + length * posY);
                    ctx.fillText(text, rePosX, rePosY);
                }
            }
        },
        drawMapBorders(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width) {
            if (!mapOffset) {
                return;
            }
            ctx.strokeStyle = stroke;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(minX, minY);
            ctx.lineTo(maxX, minY);
            ctx.lineTo(maxX, maxY);
            ctx.lineTo(minX, maxY);
            ctx.closePath();
            ctx.stroke();
        },
        drawVirusesRange(ctx, viruses, reset) {
            if (!viruses.length) {
                return;
            }
            ctx.beginPath();
            for (let length = 0; length < viruses.length; length++) {
                const x = viruses[length].x;
                const y = viruses[length].y;
                ctx.moveTo(x, y);
                ctx.arc(x, y, viruses[length].size + 820, 0, this.pi2, false);
            }
            ctx.fillStyle = gameSetupTheme.virusColor;
            ctx.globalAlpha = 0.1;
            ctx.fill();
            ctx.globalAlpha = 1;
            if (reset) {
                viruses = [];
            }
        },
        drawFood() {
            if (!Connection.showFood || gameOptionSettings.autoHideFoodOnZoom && this.scale < 0.2) {
                return;
            }
            if (gameOptionSettings.autoHideFood && !Connection.foodIsHidden && Connection.playerMass > 1000) {
                Connection.showFood = false;
                Connection.foodIsHidden = true;
                return;
            }
            if (!gameOptionSettings.rainbowFood) {
                this.drawCachedFood(this.ctx, Connection.food, this.scale);
                return;
            }
            for (let length = 0; length < Connection.food.length; length++) {
                Connection.food[length].moveCell();
                Connection.food[length].draw(this.ctx);
            }
        },
        drawCachedFood(ctx, food, scale, reset) {
            if (!food.length) {
                return;
            }
            if (gameOptionSettings.optimizedFood && this.pellet) {
                for (var length = 0; length < food.length; length++) {
                    var x = food[length].x - 10 - gameSetupTheme.foodSize;
                    var y = food[length].y - 10 - gameSetupTheme.foodSize;
                    ctx.drawImage(this.pellet, x, y);
                }
            } else {
                ctx.beginPath();
                for (var length = 0; length < food.length; length++) {
                    var x = food[length].x;
                    var y = food[length].y;
                    ctx.moveTo(x, y);
                    if (scale < 0.16) {
                        const size = food[length].size + gameSetupTheme.foodSize;
                        ctx.rect(x - size, y - size, 2 * size, 2 * size);
                        continue;
                    }
                    ctx.arc(x, y, food[length].size + gameSetupTheme.foodSize, 0, this.pi2, false);
                }
                ctx.fillStyle = gameSetupTheme.foodColor;
                ctx.globalAlpha = 1;
                ctx.fill();
            }
            if (reset) {
                food = [];
            }
        },
        drawSplitRange(ctx, biggestCell, players, currentBiggestCell, reset) {
            this.drawCircles(ctx, biggestCell, 760, 4, 0.4, `#BE00FF`);
            if (players.length) {
                const current = currentBiggestCell ? players.length - 1 : 0;
                ctx.lineWidth = 6;
                ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.7 : 0.35;
                ctx.strokeStyle = gameSetupTheme.splitRangeColor;
                ctx.beginPath();
                ctx.arc(players[current].x, players[current].y, players[current].size + 760, 0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            if (reset) {
                biggestCell = [];
            }
        },
        drawOppRings(ctx, scale, biggerSte, biggetCell, smallerCell, smallSte, reset) {
            const width = 14 + 2 / scale;
            const alpha = 12 + 1 / scale;
            this.drawCircles(ctx, biggerSte, width, alpha, 0.75, `#BE00FF`);
            this.drawCircles(ctx, biggetCell, width, alpha, 0.75, `#FF0A00`);
            this.drawCircles(ctx, smallerCell, width, alpha, 0.75, '#00C8FF');
            this.drawCircles(ctx, smallSte, width, alpha, 0.75, `#64FF00`);
            if (reset) {
                biggerSte = [];
                biggetCell = [];
                smallerCell = [];
                smallSte = [];
            }
        },
        drawCursorTracking(ctx, players, cursorX, cursorY) {
            ctx.lineWidth = 4;
            ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.75 : 0.35;
            ctx.strokeStyle = gameSetupTheme.cursorTrackingColor;
            ctx.beginPath();
            for (let length = 0; length < players.length; length++) {
                ctx.moveTo(players[length].x, players[length].y);
                ctx.lineTo(cursorX, cursorY);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        },
        drawCircles(ctx, players, scale, width, alpha, stroke) {
            ctx.lineWidth = width;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = stroke;
            for (let length = 0; length < players.length; length++) {
                ctx.beginPath();
                ctx.arc(players[length].x, players[length].y, players[length].size + scale, 0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        },
        drawDashedCircle(ctx, x, y, radius, times, width, color) {
            const pi2 = this.pi2 / times;
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            for (let length = 0; length < times; length += 2) {
                ctx.beginPath();
                ctx.arc(x, y, radius - width / 2, length * pi2, (length + 1) * pi2, false);
                ctx.stroke();
            }
        },
        drawTeammatesInd(ctx, x, y, size) {
            if (!this.indicator) {
                return;
            }
            ctx.drawImage(this.indicator, x - 45, y - size - 90);
        },
        drawPieChart() {
            if (!this.pieChart) {
                this.pieChart = document.createElement(`canvas`);
            }
            const ctx = this.pieChart.getContext('2d');
            const mincanvasWidth = Math.min(200, 0.3 * this.canvasWidth) / 200;
            this.pieChart.width = 200 * mincanvasWidth;
            this.pieChart.height = 240 * mincanvasWidth;
            ctx.scale(mincanvasWidth, mincanvasWidth);
            const colors = [`#333333`, '#FF3333', '#33FF33', `#3333FF`];
            for (let time = 0, length = 0; length < Connection.pieChart.length; length++) {
                const currentPie = time + Connection.pieChart[length] * this.pi2;
                ctx.fillStyle = colors[length + 1];
                ctx.beginPath();
                ctx.moveTo(100, 140);
                ctx.arc(100, 140, 80, time, currentPie, false);
                ctx.fill();
                time = currentPie;
            }
        },
        drawBattleArea(ctx) {
            if (!Connection.battleRoyale.state) {
                return;
            }
            this.drawDangerArea(ctx, Connection.battleRoyale.x, Connection.battleRoyale.y, Connection.battleRoyale.radius, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX - Connection.mapMinX, Connection.mapMaxY - Connection.mapMinY, gameSetupTheme.dangerAreaColor, 0.25);
            this.drawSafeArea(ctx, Connection.battleRoyale.targetX, Connection.battleRoyale.targetY, Connection.battleRoyale.targetRadius, 40, gameSetupTheme.safeAreaColor);
        },
        drawBattleAreaOnMinimap(ctx, width, heigth, newWidth, offsetX, offsetY) {
            if (!Connection.battleRoyale.state) {
                return;
            }
            if (!this.battleAreaMap) {
                this.battleAreaMap = document.createElement(`canvas`);
                this.battleAreaMapCtx = this.battleAreaMap.getContext('2d');
            }
            if (this.battleAreaMap.width != width) {
                this.battleAreaMap.width = width;
                this.battleAreaMap.height = heigth;
            } else {
                this.battleAreaMapCtx.clearRect(0, 0, width, heigth);
            }
            let newX = (Connection.battleRoyale.x + offsetX) * newWidth;
            let newY = (Connection.battleRoyale.y + offsetY) * newWidth;
            let newRadius = Connection.battleRoyale.radius * newWidth;
            this.drawDangerArea(this.battleAreaMapCtx, newX, newY, newRadius, 0, 0, width, heigth, gameSetupTheme.dangerAreaColor, 0.25);
            newX = ~~((Connection.battleRoyale.targetX + offsetX) * newWidth);
            newY = ~~((Connection.battleRoyale.targetY + offsetY) * newWidth);
            newRadius = ~~(Connection.battleRoyale.targetRadius * newWidth);
            this.drawSafeArea(this.battleAreaMapCtx, newX, newY, newRadius, 2, gameSetupTheme.safeAreaColor);
            ctx.drawImage(this.battleAreaMap, 0, 0);
        },
        drawDangerArea(ctx, x, y, radius, minX, minY, maxX, maxY, color, aplha) {
            if (Connection.battleRoyale.radius == Connection.battleRoyale.maxRadius || radius <= 0) {
                return;
            }
            ctx.save();
            ctx.globalAlpha = aplha;
            ctx.fillStyle = color;
            ctx.fillRect(minX, minY, maxX, maxY);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, this.pi2, false);
            ctx.fill();
            ctx.restore();
        },
        drawSafeArea(ctx, targetX, targetY, radius, width, color) {
            if (Connection.battleRoyale.state > 2 || radius <= 0) {
                return;
            }
            this.drawDashedCircle(ctx, targetX, targetY, radius, 60, width, color);
        },
        drawGhostCells() {
            if (!gameOptionSettings.showGhostCells) {
                return;
            }
            const ghostsCells = Connection.ghostCells;
            this.ctx.beginPath();
            for (let length = 0; length < ghostsCells.length; length++) {
                if (ghostsCells[length].inView) {
                    continue;
                }
                const x = ghostsCells[length].x;
                const y = ghostsCells[length].y;
                this.ctx.moveTo(x, y);
                this.ctx.arc(x, y, ghostsCells[length].size, 0, this.pi2, false);
            }
            this.ctx.fillStyle = gameSetupTheme.ghostCellsColor;
            this.ctx.globalAlpha = gameSetupTheme.ghostCellsAlpha;
            this.ctx.shadowColor = gameSetupTheme.ghostCellsColor;
            this.ctx.shadowBlur = 40;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
        },
        preDrawPellet() {
            this.pellet = null;
            const size = 10 + gameSetupTheme.foodSize;
            let canvas = document.createElement(`canvas`);
            canvas.width = size * 2;
            canvas.height = size * 2;
            const ctx = canvas.getContext('2d');
            ctx.arc(size, size, size, 0, this.pi2, false);
            ctx.fillStyle = gameSetupTheme.foodColor;
            ctx.fill();
            this.pellet = new Image();
            this.pellet.src = canvas.toDataURL();
            canvas = null;
        },
        preDrawIndicator() {
            this.indicator = null;
            let canvas = document.createElement('canvas');
            canvas.width = 90;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2;
            ctx.fillStyle = gameSetupTheme.teammatesIndColor;
            ctx.strokeStyle = `#000000`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(90, 0);
            ctx.lineTo(45, 50);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            this.indicator = new Image();
            this.indicator.src = canvas.toDataURL();
            canvas = null;
        },
        countFps() {
            if (!gameOptionSettings.showStatsFPS) {
                return;
            }
            const Time = Date.now();
            if (!this.fpsLastRequest) {
                this.fpsLastRequest = Time;
            }
            if (Time - this.fpsLastRequest >= 1000) {
                this.fps = this.renderedFrames;
                this.renderedFrames = 0;
                this.fpsLastRequest = Time;
            }
            this.renderedFrames++;
        },
        render() {
            drawRender.countFps();
            drawRender.renderFrame();
            window.requestAnimationFrame(drawRender.render);
        },
        init() {
            this.setCanvas();
            this.resizeCanvas();
            this.preDrawPellet();
            this.preDrawIndicator();
            window.requestAnimationFrame(drawRender.render);
        }
    };
    const keyBlind = {};
    var hotkeys = {};
    const hotkeysCommand = {
        'hk-bots-split': {
            label: textLanguage[`hk-bots-split`],
            defaultKey: 'T',
            keyDown() {
                if(window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([2]).buffer)
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-bots-feed': {
            label: textLanguage[`hk-bots-feed`],
            defaultKey: 'A',
            keyDown() {
                if(window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([3]).buffer)
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-bots-ai': {
            label: textLanguage[`hk-bots-ai`],
            defaultKey: 'F',
            keyDown() {
                if(window.user.startedBots && window.user.isAlive){
                    if(!window.bots.ai){
                        document.getElementById('botsAI').style.color = '#00C02E'
                        document.getElementById('botsAI').innerText = 'Enabled'
                        window.bots.ai = true
                        window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                    }
                    else {
                        document.getElementById('botsAI').style.color = '#DA0A00'
                        document.getElementById('botsAI').innerText = 'Disabled'
                        window.bots.ai = false
                        window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                    }
                }
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-feed': {
            label: textLanguage[`hk-feed`],
            defaultKey: 'W',
            keyDown() {
                application && application.feed();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-macroFeed': {
            label: textLanguage[`hk-macroFeed`],
            defaultKey: 'E',
            keyDown() {
                application && application.macroFeed(true);
            },
            keyUp() {
                application && application.macroFeed(false);
            },
            type: `normal`
        },
        'hk-split': {
            label: textLanguage[`hk-split`],
            defaultKey: 'SPACE',
            keyDown() {
                application && application.split();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-doubleSplit': {
            label: textLanguage[`hk-doubleSplit`],
            defaultKey: 'Q',
            keyDown() {
                application && application.doubleSplit();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-popSplit': {
            label: `Popsplit`,
            defaultKey: `ALT+Q`,
            keyDown() {
                application && application.popSplit();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-split16': {
            label: textLanguage[`hk-split16`],
            defaultKey: 'SHIFT',
            keyDown() {
                application && application.split16();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-pause': {
            label: textLanguage['hk-pause'],
            defaultKey: 'R',
            keyDown() {
                application && application.setPause();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showTop5': {
            label: textLanguage[`hk-showTop5`],
            defaultKey: 'V',
            keyDown() {
                application && application.setShowTop5();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showTime': {
            label: textLanguage['hk-showTime'],
            defaultKey: 'ALT+T',
            keyDown() {
                application && application.setShowTime();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showSplitRange': {
            label: textLanguage[`hk-showSplitRange`],
            defaultKey: 'U',
            keyDown() {
                application && application.setShowSplitRange();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showSplitInd': {
            label: textLanguage[`hk-showSplitInd`],
            defaultKey: 'I',
            keyDown() {
                application && application.setShowSplitInd();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showTeammatesInd': {
            label: textLanguage[`hk-showTeammatesInd`],
            defaultKey: `ALT+I`,
            keyDown() {
                application && application.setShowTeammatesInd();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showOppColors': {
            label: textLanguage[`hk-showOppColors`],
            defaultKey: 'O',
            keyDown() {
                application && application.setShowOppColors();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-toggleSkins': {
            label: textLanguage['hk-toggleSkins'],
            defaultKey: 'K',
            keyDown() {
                application && application.toggleSkins();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-transparentSkins': {
            label: textLanguage[`hk-transparentSkins`],
            defaultKey: '',
            keyDown() {
                application && application.setTransparentSkins();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showSkins': {
            label: textLanguage[`hk-showSkins`],
            defaultKey: 'S',
            keyDown() {
                application && application.setShowSkins();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showStats': {
            label: textLanguage[`hk-showStats`],
            defaultKey: `ALT+S`,
            keyDown() {
                application && application.setShowStats();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-toggleCells': {
            label: textLanguage[`hk-toggleCells`],
            defaultKey: 'D',
            keyDown() {
                application && application.toggleCells();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showFood': {
            label: textLanguage[`hk-showFood`],
            defaultKey: 'X',
            keyDown() {
                application && application.setShowFood();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showGrid': {
            label: textLanguage[`hk-showGrid`],
            defaultKey: 'G',
            keyDown() {
                application && application.setShowGrid();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showMiniMapGuides': {
            label: textLanguage[`hk-showMiniMapGuides`],
            defaultKey: `ALT+G`,
            keyDown() {
                application && application.setShowMiniMapGuides();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-hideChat': {
            label: textLanguage[`hk-hideChat`],
            defaultKey: 'H',
            keyDown() {
                application && application.hideChat();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showHUD': {
            label: textLanguage['hk-showHUD'],
            defaultKey: 'ALT+H',
            keyDown() {
                application && application.setShowHUD();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-copyLb': {
            label: textLanguage[`hk-copyLb`],
            defaultKey: 'L',
            keyDown() {
                application && application.copyLb();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showLb': {
            label: textLanguage[`hk-showLb`],
            defaultKey: `ALT+L`,
            keyDown() {
                application && application.setShowLb();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-toggleAutoZoom': {
            label: textLanguage[`hk-toggleAutoZoom`],
            defaultKey: '',
            keyDown() {
                application && application.toggleAutoZoom();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-resetZoom': {
            label: textLanguage[`hk-resetZoom`],
            defaultKey: 'ALT+Z',
            keyDown() {
                application && application.resetZoom(true);
            },
            keyUp() {
                application && application.resetZoom(false);
            },
            type: `normal`
        },
        'hk-toggleDeath': {
            label: textLanguage['hk-toggleDeath'],
            defaultKey: 'Z',
            keyDown() {
                application && application.toggleDeath();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-clearChat': {
            label: textLanguage[`hk-clearChat`],
            defaultKey: 'C',
            keyDown() {
                application && application.displayChatHistory(true);
            },
            keyUp() {
                application && application.displayChatHistory(false);
            },
            type: `normal`
        },
        'hk-showBgSectors': {
            label: textLanguage[`hk-showBgSectors`],
            defaultKey: 'B',
            keyDown() {
                application && application.setShowBgSectors();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-hideBots': {
            label: textLanguage[`hk-hideBots`],
            defaultKey: 'ALT+B',
            keyDown() {
                application && application.setHideSmallBots();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showNames': {
            label: textLanguage['hk-showNames'],
            defaultKey: 'N',
            keyDown() {
                application && application.setShowNames();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-hideTeammatesNames': {
            label: textLanguage[`hk-hideTeammatesNames`],
            defaultKey: '',
            keyDown() {
                application && application.setHideTeammatesNames();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-showMass': {
            label: textLanguage[`hk-showMass`],
            defaultKey: 'M',
            keyDown() {
                application && application.setShowMass();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showMiniMap': {
            label: textLanguage[`hk-showMiniMap`],
            defaultKey: `ALT+M`,
            keyDown() {
                application && application.setShowMiniMap();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-chatMessage': {
            label: textLanguage[`hk-chatMessage`],
            defaultKey: `ENTER`,
            keyDown() {
                application && application.enterChatMessage();
            },
            keyUp: null,
            type: `special`
        },
        'hk-quickResp': {
            label: textLanguage[`hk-quickResp`],
            defaultKey: 'TILDE',
            keyDown() {
                application && application.quickResp();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-autoResp': {
            label: textLanguage[`hk-autoResp`],
            defaultKey: '',
            keyDown() {
                application && application.toggleAutoResp();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-zoom1': {
            label: `${textLanguage[`hk-zoomLevel`]} 1`,
            defaultKey: `ALT+1`,
            keyDown() {
                application && application.setZoom(0.5);
            },
            keyUp: null,
            type: `normal`
        },
        'hk-zoom2': {
            label: `${textLanguage[`hk-zoomLevel`]} 2`,
            defaultKey: `ALT+2`,
            keyDown() {
                application && application.setZoom(0.25);
            },
            keyUp: null,
            type: `normal`
        },
        'hk-zoom3': {
            label: `${textLanguage[`hk-zoomLevel`]} 3`,
            defaultKey: `ALT+3`,
            keyDown() {
                application && application.setZoom(0.125);
            },
            keyUp: null,
            type: `normal`
        },
        'hk-zoom4': {
            label: `${textLanguage[`hk-zoomLevel`]} 4`,
            defaultKey: `ALT+4`,
            keyDown() {
                application && application.setZoom(0.075);
            },
            keyUp: null,
            type: `normal`
        },
        'hk-zoom5': {
            label: `${textLanguage[`hk-zoomLevel`]} 5`,
            defaultKey: `ALT+5`,
            keyDown() {
                application && application.setZoom(0.05);
            },
            keyUp: null,
            type: `normal`
        },
        'hk-switchServerMode': {
            label: textLanguage[`hk-switchServerMode`],
            defaultKey: '=',
            keyDown() {
                application && application.switchServerMode();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showTargeting': {
            label: textLanguage[`hk-showTargeting`],
            defaultKey: '',
            keyDown() {
                application && application.setShowTargeting();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-setTargeting': {
            label: textLanguage['hk-setTargeting'],
            defaultKey: '',
            keyDown() {
                application && application.setTargeting();
            },
            keyUp: null,
            type: 'normal'
        },
        'hk-cancelTargeting': {
            label: textLanguage['hk-cancelTargeting'],
            defaultKey: '',
            keyDown() {
                application && application.cancelTargeting();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-changeTarget': {
            label: textLanguage[`hk-changeTarget`],
            defaultKey: '',
            keyDown() {
                application && application.changeTarget();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-privateMiniMap': {
            label: textLanguage[`hk-privateMiniMap`],
            defaultKey: '',
            keyDown() {
                application && application.setPrivateMiniMap();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-showQuest': {
            label: textLanguage[`hk-showQuest`],
            defaultKey: '',
            keyDown() {
                application && application.setShowQuest();
            },
            keyUp: null,
            type: `normal`
        },
        'hk-comm1': {
            label: chatCommand.comm1,
            defaultKey: '1',
            keyDown() {
                application && application.sendCommand(1);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm2': {
            label: chatCommand.comm2,
            defaultKey: '2',
            keyDown() {
                application && application.sendCommand(2);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm3': {
            label: chatCommand.comm3,
            defaultKey: '3',
            keyDown() {
                application && application.sendCommand(3);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm4': {
            label: chatCommand.comm4,
            defaultKey: '4',
            keyDown() {
                application && application.sendCommand(4);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm5': {
            label: chatCommand.comm5,
            defaultKey: '5',
            keyDown() {
                application && application.sendCommand(5);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm6': {
            label: chatCommand.comm6,
            defaultKey: '6',
            keyDown() {
                application && application.sendCommand(6);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm7': {
            label: chatCommand.comm7,
            defaultKey: '7',
            keyDown() {
                application && application.sendCommand(7);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm8': {
            label: chatCommand.comm8,
            defaultKey: '8',
            keyDown() {
                application && application.sendCommand(8);
            },
            keyUp: null,
            type: 'command'
        },
        'hk-comm9': {
            label: chatCommand.comm9,
            defaultKey: '9',
            keyDown() {
                application && application.sendCommand(9);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm0': {
            label: chatCommand.comm0,
            defaultKey: '0',
            keyDown() {
                application && application.sendCommand(0);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm10': {
            label: chatCommand.comm10,
            defaultKey: `MOUSE WHEEL`,
            keyDown() {
                application && application.sendCommand(10);
            },
            keyUp: null,
            type: 'command'
        },
        'hk-comm11': {
            label: chatCommand.comm11,
            defaultKey: `LEFT`,
            keyDown() {
                application && application.sendCommand(11);
            },
            keyUp: null,
            type: 'command'
        },
        'hk-comm12': {
            label: chatCommand.comm12,
            defaultKey: 'UP',
            keyDown() {
                application && application.sendCommand(12);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm13': {
            label: chatCommand.comm13,
            defaultKey: 'RIGHT',
            keyDown() {
                application && application.sendCommand(13);
            },
            keyUp: null,
            type: `command`
        },
        'hk-comm14': {
            label: chatCommand.comm14,
            defaultKey: 'DOWN',
            keyDown() {
                application && application.sendCommand(14);
            },
            keyUp: null,
            type: `command`
        }
    };
    const hotkeysSetup = {
        lastPressedKey: '',
        lastKeyId: '',
        defaultMessageKey: `ENTER`,
        inputClassName: 'custom-key-in form-control input-sm',
        loadDefaultHotkeys() {
            hotkeys = {};
            for (const command in hotkeysCommand) {
                if (hotkeysCommand.hasOwnProperty(command)) {
                    hotkeys[hotkeysCommand[command].defaultKey] = command;
                }
            }
            hotkeys[`spec-messageKey`] = this.defaultMessageKey;
        },
        loadHotkeys() {
            if (window.localStorage.getItem(`ogarioHotkeys`) !== null) {
                hotkeys = JSON.parse(window.localStorage.getItem('ogarioHotkeys'));
            } else {
                this.loadDefaultHotkeys();
            }
            if (window.localStorage.getItem(`ogarioCommands`) !== null) {
                chatCommand = JSON.parse(window.localStorage.getItem('ogarioCommands'));
            }
        },
        saveHotkeys() {
            window.localStorage.setItem('ogarioHotkeys', JSON.stringify(hotkeys));
            this.saveCommands();
        },
        saveCommands() {
            JQuery('#hotkeys .command-in').each(function() {
                const element = JQuery(this);
                const id = element.attr('id');
                if (chatCommand.hasOwnProperty(id)) {
                    chatCommand[id] = element.val();
                }
            });
            window.localStorage.setItem(`ogarioCommands`, JSON.stringify(chatCommand));
        },
        resetHotkeys() {
            this.loadDefaultHotkeys();
            JQuery('#hotkeys-cfg .custom-key-in').each(function() {
                const id = JQuery(this).attr('id');
                if (hotkeysCommand[id]) {
                    JQuery(this).val(hotkeysCommand[id].defaultKey);
                }
            });
        },
        setHotkeysMenu() {
            const setup = this;
            JQuery('body').append(`<div id="hotkeys"><div id="hotkeys-menu"><button id="reset-hotkeys" class="btn btn-primary">${textLanguage.restoreSettings}${`</button> <button id="save-hotkeys" class="btn btn-success">`}${textLanguage.saveSett}</button> <button id="close-hotkeys" class="btn btn-danger">${textLanguage.close}${`</button></div><div id="hotkeys-cfg"></div><div id="hotkeys-inst"><ul><li>`}${textLanguage['hk-inst-assign']}${`</li><li>`}${textLanguage[`hk-inst-delete`]}</li><li>${textLanguage[`hk-inst-keys`]}</li></ul></div></div>`);
            for (const command in hotkeysCommand) {
                if (hotkeysCommand.hasOwnProperty(command)) {
                    const currentCommand = hotkeysCommand[command];
                    let text = '';
                    for (const key in hotkeys) {
                        if (hotkeys.hasOwnProperty(key) && hotkeys[key] === command) {
                            text = key;
                            break;
                        }
                    }
                    if (command === `hk-switchServerMode` && application && !application.privateIP) {
                        continue;
                    }
                    if (currentCommand.type === `command`) {
                        const replaceHk = command.replace(`hk-`, '');
                        JQuery(`#hotkeys-cfg`).append(`${`<div class="row"><div class="key-label"><input id="` + replaceHk + `" class="command-in form-control input-sm" value="` + chatCommand[replaceHk] + `" maxlength="80" /></div><div class="default-key">` + currentCommand.defaultKey + `</div><div class="custom-key"><input id="` + command + `" class="custom-key-in form-control input-sm" value="` + text}" /></div></div>`);
                    } else {
                        JQuery('#hotkeys-cfg').append(`<div class="row"><div class="key-label">${currentCommand.label}</div><div class="default-key">${currentCommand.defaultKey}</div><div class="custom-key"><input id="${command}${`" class="custom-key-in form-control input-sm" value="`}${text}" /></div></div>`);
                    }
                }
            }
            JQuery(document).on('click', `#reset-hotkeys`, event => {
                event.preventDefault();
                setup.resetHotkeys();
            });
            JQuery(document).on(`click`, `#save-hotkeys`, event => {
                event.preventDefault();
                setup.saveHotkeys();
                JQuery('#hotkeys').fadeOut(500);
            });
            JQuery(document).on(`click`, `#close-hotkeys`, event => {
                event.preventDefault();
                JQuery('#hotkeys').fadeOut(500);
            });
            JQuery(document).on(`click`, `.hotkeys-link`, event => {
                JQuery(`#hotkeys`).fadeIn(500);
                JQuery(`#hotkeys-cfg`).perfectScrollbar(`update`);
                resetonkeydown();
            });
            JQuery(`#hotkeys-cfg`).perfectScrollbar();
            OgarioSettings && OgarioSettings.setMenuBg();
        },
        getPressedKey(key) {
            let specialKey = '';
            let normalKey = '';
            if (key.ctrlKey || key.keyCode == 17) {
                specialKey = 'CTRL';
            } else if (key.altKey || key.keyCode == 18) {
                specialKey = `ALT`;
            }
            switch (key.keyCode) {
                case 9:
                    normalKey = `TAB`;
                    break;
                case 13:
                    normalKey = `ENTER`;
                    break;
                case 16:
                    normalKey = 'SHIFT';
                    break;
                case 17:
                    break;
                case 18:
                    break;
                case 27:
                    normalKey = `ESC`;
                    break;
                case 32:
                    normalKey = 'SPACE';
                    break;
                case 37:
                    normalKey = `LEFT`;
                    break;
                case 38:
                    normalKey = 'UP';
                    break;
                case 39:
                    normalKey = `RIGHT`;
                    break;
                case 40:
                    normalKey = `DOWN`;
                    break;
                case 46:
                    normalKey = `DEL`;
                    break;
                case 61:
                    normalKey = '=';
                    break;
                case 187:
                    normalKey = '=';
                    break;
                case 192:
                    normalKey = `TILDE`;
                    break;
                default:
                    normalKey = String.fromCharCode(key.keyCode);
                    break;
            }
            if (specialKey !== '') {
                if (normalKey !== '') {
                    return `${specialKey}+${normalKey}`;
                }
                return specialKey;
            }
            return normalKey;
        },
        deleteHotkey(name, id) {
            delete hotkeys[name];
            JQuery(`#${id}`).val('');
        },
        setDefaultHotkey(id) {
            let key = false;
            if (hotkeysCommand[id] && !hotkeys.hasOwnProperty(hotkeysCommand[id].defaultKey)) {
                key = hotkeysCommand[id].defaultKey;
                hotkeys[key] = id;
                return key;
            }
            return key;
        },
        setHotkey(key, id) {
            if (!id || this.lastPressedKey === key && this.lastKeyId === id) {
                return;
            }
            const value = JQuery(`#${id}`).val();
            this.deleteHotkey(value, id);
            if (key === 'DEL') {
                return;
            }
            if (hotkeys[key] && hotkeys[key] !== id) {
                const hotkey = hotkeys[key];
                const defaultKey = this.setDefaultHotkey(hotkey);
                if (defaultKey) {
                    hotkeys[defaultKey] = hotkey;
                    JQuery(`#${hotkey}`).val(defaultKey);
                } else {
                    this.deleteHotkey(key, hotkey);
                }
            }
            hotkeys[key] = id;
            JQuery(`#${id}`).val(key);
            if (id === 'hk-chatMessage') {
                hotkeys[`spec-messageKey`] = key;
            }
            this.lastPressedKey = key;
            this.lastKeyId = id;
        },
        init() {
            this.loadHotkeys();
            this.setHotkeysMenu();
        }
    };
    document.onkeydown = event => {
        const pressKey = hotkeysSetup.getPressedKey(event);
        if (event.target.tagName === `INPUT` && event.target.className !== hotkeysSetup.inputClassName && pressKey !== hotkeys['spec-messageKey']) {
            return;
        }
        if (pressKey !== '' && !keyBlind[pressKey]) {
            keyBlind[pressKey] = true;
            if (pressKey === `ESC`) {
                event.preventDefault();
                application && application.showMenu();
                return;
            }
            if (event.target.className === hotkeysSetup.inputClassName) {
                event.preventDefault();
                hotkeysSetup.setHotkey(pressKey, event.target.id);
                return;
            }
            if (hotkeys[pressKey]) {
                event.preventDefault();
                const key = hotkeys[pressKey];
                if (key !== '' && hotkeysCommand[key]) {
                    if (hotkeysCommand[key].keyDown) {
                        hotkeysCommand[key].keyDown();
                    }
                }
            }
        }
    };
    document.onkeyup = event => {
        const pressedKey = hotkeysSetup.getPressedKey(event);
        if (pressedKey !== '') {
            if (hotkeys[pressedKey]) {
                const key = hotkeys[pressedKey];
                if (key !== '' && hotkeysCommand[key]) {
                    if (hotkeysCommand[key].keyUp) {
                        hotkeysCommand[key].keyUp();
                    }
                }
            }
            keyBlind[pressedKey] = false;
        }
    };
    window.onmousedown = event => {
        if (!JQuery(`#overlays`).is(`:visible`)) {
            if (event.which == 2) {
                event.preventDefault();
                application && application.sendCommand(10);
            } else {
                if (gameOptionSettings.mouseSplit) {
                    if (event.which == 1 && !gameOptionSettings.mouseInvert || event.which == 3 && gameOptionSettings.mouseInvert) {
                        event.preventDefault();
                        application && application.split();
                    }
                }
                if (gameOptionSettings.mouseFeed) {
                    if (event.which == 3 && !gameOptionSettings.mouseInvert || event.which == 1 && gameOptionSettings.mouseInvert) {
                        event.preventDefault();
                        application && application.macroFeed(true);
                    }
                }
            }
        }
    };
    window.onmouseup = event => {
        if (gameOptionSettings.mouseFeed) {
            if (event.which == 3 && !gameOptionSettings.mouseInvert || event.which == 1 && gameOptionSettings.mouseInvert) {
                application && application.macroFeed(false);
            }
        }
    };
    window.onbeforeunload = event => {
        if (ogario.play) {
            return textLanguage.exit;
        } else {
            return;
        }
    };

    function changeHistory(value) {
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, window.document.title, value);
        }
    }

    function changeUrl() {
        if (window.location.pathname === `/ogario`) {
            changeHistory(`/${window.location.hash}`);
        }
    }

    function spectateBlind() {
        window.onkeydown = event => {
            81 == event.keyCode && window.core.specialOn && window.core.specialOn();
        };
        window.onkeyup = event => {};
    }

    function menuScale() {
        const innerWidth = window.innerWidth;
        const innerHeigth = window.innerHeight;
        const helloContainer = JQuery('#helloContainer');
        let helloContainerWidth = helloContainer.innerHeight();
        if (helloContainerWidth > 0) {
            ogario.menuHeight = helloContainerWidth;
        } else {
            helloContainerWidth = ogario.menuHeight || 618;
        }
        const scale = Math.min(1, innerHeigth / helloContainerWidth);
        const top = helloContainerWidth * scale;
        const resizeTop = Math.round(innerHeigth / 2 - 0.5 * top);
        const transform = `${`translate(-50%, 0%) scale(` + scale})`;
        helloContainer.css('transform', transform);
        helloContainer.css('-ms-transform', transform);
        helloContainer.css('-webkit-transform', transform);
        helloContainer.css('top', `${resizeTop}px`);
        ogario.innerW = innerWidth;
        ogario.innerH = innerHeigth;
    }

    function resetonkeydown() {
        if (application.protocolMode) {
            return;
        }
        window.onkeydown = event => {};
    }

    function start() {
        window.core = {
            connect(url) {
                Connection.connect(url);
            },
            disconnect() {},
            sendNick(nick) {
                Connection.sendNick(nick);
            },
            sendSpectate() {
                Connection.sendSpectate();
            },
            eject() {
                Connection.sendEject();
            },
            split() {
                Connection.sendSplit();
            },
            specialOn() {
                Connection.sendFreeSpectate();
            },
            specialOff() {
                Connection.sendFreeSpectate();
            },
            sendFbToken(token) {
                Connection.sendFbToken(token);
            },
            sendGplusToken(token) {
                Connection.sendGplusToken(token);
            },
            recaptchaResponse(token) {
                Connection.sendRecaptcha(token);
            },
            setClientVersion(version, strVersion) {
                Connection.setClientVersion(version, strVersion);
            },
            proxyMobileData(data = []) {
                if (!Array.isArray(data)) {
                    console.log('ProxyMobileData ERROR: Array data required.');
                    return;
                }
                if (data[0] == 8) {
                    data.unshift(102);
                }
                data = new Uint8Array(data);
                Connection.sendMessage(new DataView(data.buffer));
            }
        };
    }

    function setGUI(){
        document.getElementById('quick-menu').innerHTML = `
            <h2 id="botsInfo">
                <a href="https://discord.gg/SDMNEcJ" target="_blank">Free Agar.io Bots</a>
            </h2>
            <h5 id="botsAuthor">
                Developed by <a href="https://www.youtube.com/channel/UCZo9WmnFPWw38q65Llu5Lug" target="_blank">Nel</a>
            </h5>
            <span id="statusText">Status: <b id="userStatus">Disconnected</b></span>
            <br>
            <br>
            <span id="aiText">Bots AI: <b id="botsAI">Disabled</b></span>
            <br>
            <input type="text" id="botsName" placeholder="Bots Name" maxlength="15" spellcheck="false">
            <input type="number" id="botsAmount" placeholder="Bots Amount" min="10" max="195" spellcheck="false">
            <button id="connect" class="btn-primary">Connect</button>
            <br>
            <button id="startBots" class="btn-warning" disabled>Start Bots</button>
            <button id="stopBots" class="btn-warning">Stop Bots</button>
            <br>
            <br>
            <input type="text" id="serverHost" placeholder="Server Host/IP" value="localhost" spellcheck="false">
            <input type="text" id="serverPort" placeholder="Server Port" value="8083" maxlength="5" spellcheck="false">
        `
        if(localStorage.getItem('localStoredBotsName') !== null){
            window.bots.name = localStorage.getItem('localStoredBotsName')
            document.getElementById('botsName').value = window.bots.name
        }
        if(localStorage.getItem('localStoredBotsAmount') !== null){
            window.bots.amount = JSON.parse(localStorage.getItem('localStoredBotsAmount'))
            document.getElementById('botsAmount').value = String(window.bots.amount)
        }
        if(localStorage.getItem('localStoredServerHost') !== null){
            window.server.host = localStorage.getItem('localStoredServerHost')
            document.getElementById('serverHost').value = window.server.host
        }
        if(localStorage.getItem('localStoredServerPort') !== null){
            window.server.port = JSON.parse(localStorage.getItem('localStoredServerPort'))
            document.getElementById('serverPort').value = String(window.server.port)
        }
    }

    function setGUIStyle(){
        document.getElementsByTagName('head')[0].innerHTML += `
            <style type="text/css">
                #quick-menu {
                    width: 280px !important;
                    height: 580px !important;
                }
                #botsInfo > a, #botsAuthor > a {
                    color: #fff;
                    text-decoration: none;
                }
                #botsAuthor {
                    margin-top: -15px;
                    letter-spacing: 1px;
                }
                #statusText, #aiText {
                    font-weight: bold;
                    position: absolute;
                    left: -5px;
                }
                #userStatus, #botsAI {
                    color: #DA0A00;
                }
                #botsName, #botsAmount, #serverHost, #serverPort {
                    margin-top: 15px;
                    width: 144px;
                    padding: 8px;
                    font-size: 14.5px;
                    outline: none;
                    margin-left: 60px;
                }
                #connect, #startBots, #stopBots {
                    color: white;
                    border: none;
                    padding: 7px;
                    width: 160px;
                    font-size: 18px;
                    outline: none;
                    margin-top: 15px;
                    letter-spacing: 1px;
                    margin-left: 50px;
                }
                #connect {
                    display: inline;
                    background-color: #0074C0;
                }
                #startBots {
                    display: inline;
                    background-color: #00C02E;
                }
                #stopBots {
                    display: none;
                    background-color: #DA0A00;
                }
                #connect:active {
                    background-color: #004E82;
                }
                #startBots:active {
                    background-color: #009A25;
                }
                #stopBots:active {
                    background-color: #9A1B00;
                }
            </style>
        `
    }

function loadUI(){
 $('#overlays-hud').append(`
 <div id="botClient" class="hud-b hud-text-center" style="text-align: center; color: #fff; position: fixed; pointer-events: none; font-size: 75%; white-space: nowrap; padding: 0; top: 42%; display: block; width: 200px; right: 10px;">
 <div style="margin: 6px;"><b>Bot Count</b>: <span id="botCount" class="label hud-main-color pull-right" style="margin: 0.55em 0 0 0; padding: 0 0.55em 0 0;">Waiting</span></div>
 <b><div style="padding: 0 10px 6px;"><b>ServerSlots</b>: <span id="slots" class="label hud-main-color pull-right" style="margin: 0.55em 0 0 0;">Waiting</span></div>
 </b></div>`);

}

    function setGUIEvents(){
        document.getElementById('botsAmount').addEventListener('keypress', e => {
            e.preventDefault()
        })
        document.getElementById('botsName').addEventListener('change', function(){
            window.bots.name = this.value
            localStorage.setItem('localStoredBotsName', window.bots.name)
        })
        document.getElementById('botsAmount').addEventListener('change', function(){
            window.bots.amount = Number(this.value)
            localStorage.setItem('localStoredBotsAmount', window.bots.amount)
        })
        document.getElementById('connect').addEventListener('click', () => {
			if (application.gameMode==":party"){
				if(!window.connection.ws || window.connection.ws.readyState !== WebSocket.OPEN) window.connection.connect()
			}
			else{
				toastr["info"]('Party bots only available for Party mode')
			}	
        })
        document.getElementById('startBots').addEventListener('click', () => {
            if(window.game.url && window.game.protocolVersion && window.game.clientVersion && !window.user.startedBots){
                //if(window.bots.name && window.bots.amount && window.getComputedStyle(document.getElementsByClassName('btn-login-play')[0]).getPropertyValue('display') === 'none') window.connection.send(window.buffers.startBots(window.game.url, window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.bots.name, window.bots.amount))
                if (application.gameMode==":party"){
				if (window.bots.name && window.bots.amount && window.getComputedStyle(document.getElementsByClassName('btn-login-play')[0]).getPropertyValue('display') === 'none') window.connection.send(window.buffers.startBots(window.game.url, window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.unescape(window.encodeURIComponent(window.bots.name)), window.bots.amount))
				else toastr["info"]('Bots name and amount are required before starting the bots, also you need to be logged in to your agar.io account in order to start the bots')	
			}
			else{
				toastr["info"]('Party bots only available for Party mode')
			}					
            }
        })
        document.getElementById('stopBots').addEventListener('click', () => {
            if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
        })
        document.getElementById('serverHost').addEventListener('change', function(){
            window.server.host = this.value
            localStorage.setItem('localStoredServerHost', window.server.host)
        })
        document.getElementById('serverPort').addEventListener('change', function(){
            window.server.port = Number(this.value)
            localStorage.setItem('localStoredServerPort', window.server.port)
        })
    }

    function resize() {
        window.onresize = () => {
            drawRender.resizeCanvas();
            menuScale();
        };
    }((() => {
        ogario = Connection;
        changeUrl();
        resize();
        spectateBlind();
        start();
        window.master.getClientVersion();
        OgarioSettings.init();
        application.init();
        application.getDefaultSettings();
        application.connect();
        hotkeysSetup.init();
        Connection.init();
        drawRender.init();
        window.master.init();
        menuScale();
        setTimeout(() => {
            setGUI()
            setGUIStyle()
            setGUIEvents()
            loadUI()
        }, 3500)
    })());
}

init(window, window.ogario, window.jQuery);
