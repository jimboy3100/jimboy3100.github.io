//v1.3j
        keyBlind = {};
        hotkeys = {};
        /* Guard: textLanguage is exposed from ogario.v4.js via window.textLanguage;
         * fall back to empty object so label lookups return undefined (the UI shows
         * the key name) instead of crashing with "Cannot read properties of undefined". */
        if (typeof textLanguage === 'undefined' || textLanguage === null || textLanguage === undefined) {
            textLanguage = window.textLanguage || {};
        }
        if (typeof chatCommand === 'undefined') chatCommand = {};
        hotkeysCommand = {
            'hk-feed': {
                get label() { return lmT('settings.hk-feed'); },
                defaultKey: 'W',
                keyDown() {
                    application && application.feed();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-macroFeed': {
                get label() { return lmT('settings.hk-macroFeed'); },
                defaultKey: 'E',
                keyDown() {
                    application && application.macroFeed(!0);
                },
                keyUp() {
                    application && application.macroFeed(!1);
                },
                type: 'normal'
            },
            'hk-macroFeedPerm': {
                get label() { return lmT('settings.hk-macroFeedPerm'); },
                defaultKey: 'CTRL+E',
                keyDown() {;
                    application && application.macroFeedPerm(!0);
                },
                type: 'normal'
            },			
            'hk-split': {
                get label() { return lmT('settings.hk-split'); },
                defaultKey: 'SPACE',
                keyDown() {
                    application && application.split();
                },
                keyUp: null,
                type: 'normal'
            },		
            'hk-doubleSplit': {
                get label() { return lmT('settings.hk-doubleSplit'); },
                defaultKey: 'Q',
                keyDown() {
                    application && application.doubleSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-tripleSplit': {
                get label() { return lmT('settings.hk-tripleSplit'); },
                defaultKey: '',
                keyDown() {
                    application && application.tripleSplit();
                },
                keyUp: null,
                type: 'normal'
            },			
            'hk-popSplit': {
                get label() { return lmT('game2.hkPopSplit'); },
                defaultKey: 'ALT+Q',
                keyDown() {
                    application && application.popSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-split16': {
                get label() { return lmT('settings.hk-split16'); },
                defaultKey: 'SHIFT',
                keyDown() {
                    application && application.split16();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-crazyDoubleSplit': {
                get label() { return lmT('settings.hk-crazyDoubleSplit'); },
                defaultKey: '',
                keyDown() {
                    application && application.crazyDoubleSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            /* Locks the aim on one line and splits (settings: Line Split section).
             * No default key: E, the old standalone script's key, is macro feed here. */
            'hk-lineSplit': {
                get label() {
                    return lmT('settings.hk-lineSplit');
                },
                defaultKey: '',
                keyDown() {
                    var game = window.legendmod;
                    if (game && typeof game.lineSplit === 'function') {
                        game.lineSplit();
                    }
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-pause': {
                get label() { return lmT('settings.hk-pause'); },
                defaultKey: 'R',
                keyDown() {
                    application && application.setPause();
                },
                keyUp: null,
                type: 'normal'
            },
			'hk-dance': {
				get label() { return lmT('settings.hk-dance'); },
				defaultKey: 'ALT+R',
				keyDown() {
				application && application.dance(true);
				},
				keyUp() {
				application && application.dance(false);
				},
				type: 'normal'
			},	
			/* opens the practice arena window (ogario/modules/practice.js); no default key */
			'hk-practice': {
				get label() {
					return lmT('settings.hk-practice');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmPractice === 'function') window.lmPractice('toggle');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-middleMultiView': {
				get label() {
					return lmT('settings.hk-middleMultiView');
				},
				defaultKey: '',
				keyDown() {
					if (!application || typeof defaultmapsettings === 'undefined') return;
					defaultmapsettings.middleMultiView = !defaultmapsettings.middleMultiView;
					if (typeof application.syncHotkeyOption === 'function') application.syncHotkeyOption('middleMultiView');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-bigMinimap': {
				get label() {
					return lmT('settings.hk-bigMinimap');
				},
				defaultKey: '',
				keyDown() {
					if (typeof Settings !== 'undefined' && Settings && typeof Settings.lmToggleBigMinimap === 'function') Settings.lmToggleBigMinimap();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-notifCentre': {
				get label() {
					return lmT('settings.hk-notifCentre');
				},
				defaultKey: '',
				keyDown() {
					/* opens / closes the list (ogario/modules/notifications.js), also while its option is off */
					if (window.LMNotifications) window.LMNotifications.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-pingHelp': {
				get label() {
					return lmT('settings.hk-pingHelp');
				},
				defaultKey: '',
				keyDown() {
					/* typed team ping at the cursor (opcode 45 type 5; Delta shows a plain wave) */
					application && application.sendTeamPing && application.sendTeamPing(5);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-pingDanger': {
				get label() {
					return lmT('settings.hk-pingDanger');
				},
				defaultKey: '',
				keyDown() {
					/* typed team ping at the cursor (opcode 45 type 6; Delta shows a plain wave) */
					application && application.sendTeamPing && application.sendTeamPing(6);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-pingGoHere': {
				get label() {
					return lmT('settings.hk-pingGoHere');
				},
				defaultKey: '',
				keyDown() {
					/* typed team ping at the cursor (opcode 45 type 7; Delta shows a plain wave) */
					application && application.sendTeamPing && application.sendTeamPing(7);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-pingVirus': {
				get label() {
					return lmT('settings.hk-pingVirus');
				},
				defaultKey: '',
				keyDown() {
					/* typed team ping at the cursor (opcode 45 type 8; Delta shows a plain wave) */
					application && application.sendTeamPing && application.sendTeamPing(8);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-specNextTop': {
				get label() {
					return lmT('settings.hk-specNextTop');
				},
				defaultKey: '',
				keyDown() {
					/* while spectating: steps the followed player through the leaderboard ghost cells,
					 * wrapping around; from the follow camera or World Spectate it switches to free
					 * spectate first (_lmSpecFree), as a leaderboard click does */
					var lm = window.legendmod;
					if (!lm || lm.play || typeof lm._lmSpecFree !== 'function') return;
					var n = lm.ghostCells ? lm.ghostCells.length : 0;
					if (!n || !lm._lmSpecFree()) return;
					lm._lmSpecLb = lm._lmSpecLb == null ? 0 : (lm._lmSpecLb + 1) % n;
					lm._lmSpecCell = null; /* one follow at a time */
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-scanTrick': {
				get label() {
					return lmT('settings.hk-scanTrick');
				},
				defaultKey: '',
				keyDown() {
					var game = window.legendmod || window.LM;
					if (game && typeof game.setScanTrickHeld === 'function') {
						game.setScanTrickHeld(true);
					}
				},
				keyUp() {
					var game = window.legendmod || window.LM;
					if (game && typeof game.setScanTrickHeld === 'function') {
						game.setScanTrickHeld(false);
					}
				},
				type: 'normal'
			},
			'hk-limitposition': {
				get label() {
					return lmT('settings.hk-limitposition');
				},
				defaultKey: '',
				keyDown() {
				window.followStraight = true
				},
				keyUp() {
				window.followStraight = false
				},
				type: 'normal'
			},			
            'hk-multiboxswap': {
                get label() { return lmT('settings.hk-multiboxswap'); },
                defaultKey: '',
                keyDown() {
                    application && application.multiboxswap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-multiboxFollowMouse': {
                get label() { return lmT('settings.hk-multiboxFollowMouse'); },
                defaultKey: 'TILDE',
                keyDown() {
                    application && application.multiboxFollowMouse();
                },
                keyUp: null,
                type: 'normal'
            },				
            'hk-showTop5': {
                get label() { return lmT('settings.hk-showTop5'); },
                defaultKey: 'T',
                keyDown() {
                    application && application.setShowTop5();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTime': {
                get label() { return lmT('settings.hk-showTime'); },
                defaultKey: 'ALT+T',
                keyDown() {
                    application && application.setShowTime();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitRange': {
                get label() { return lmT('settings.hk-showSplitRange'); },
                defaultKey: 'U',
                keyDown() {
                    application && application.setShowSplitRange();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitInd': {
                get label() { return lmT('settings.hk-showSplitInd'); },
                defaultKey: 'I',
                keyDown() {
                    application && application.setShowSplitInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTeammatesInd': {
                get label() { return lmT('settings.hk-showTeammatesInd'); },
                defaultKey: 'ALT+I',
                keyDown() {
                    application && application.setShowTeammatesInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showOppColors': {
                get label() { return lmT('settings.hk-showOppColors'); },
                defaultKey: 'O',
                keyDown() {
                    application && application.setShowOppColors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleSkins': {
                get label() { return lmT('settings.hk-toggleSkins'); },
                defaultKey: 'A',
                keyDown() {
                    application && application.toggleSkins();
                    /* say which mode this press entered */
                    application && application.skinsModeMsg && application.skinsModeMsg(true);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-transparentSkins': {
                get label() { return lmT('settings.hk-transparentSkins'); },
                    
                        
                    

                defaultKey: '',

                keyDown() {
                    application &&
                        application
                            .setTransparentSkins();
                },

                keyUp: null,

                type: 'normal'
            },


            'hk-showSkins': {
                get label() { return lmT('settings.hk-showSkins'); },
                defaultKey: 'S',
                keyDown() {
                    application && application.setShowSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showStats': {
                get label() { return lmT('settings.hk-showStats'); },
                defaultKey: 'ALT+S',
                keyDown() {
                    application && application.setShowStats();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleCells': {
                get label() { return lmT('settings.hk-toggleCells'); },
                defaultKey: 'D',
                keyDown() {
                    application && application.toggleCells();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showFood': {
                get label() { return lmT('settings.hk-showFood'); },
                defaultKey: 'F',
                keyDown() {
                    application && application.setShowFood();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showGrid': {
                get label() { return lmT('settings.hk-showGrid'); },
                defaultKey: 'G',
                keyDown() {
                    application && application.setShowGrid();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMapGuides': {
                get label() { return lmT('settings.hk-showMiniMapGuides'); },
                defaultKey: 'ALT+G',
                keyDown() {
                    application && application.setShowMiniMapGuides();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideChat': {
                get label() { return lmT('settings.hk-hideChat'); },
                defaultKey: 'H',
                keyDown() {
                    application && application.hideChat();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showHUD': {
                get label() { return lmT('settings.hk-showHUD'); },
                defaultKey: 'ALT+H',
                keyDown() {
                    application && application.setShowHUD();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-copyLb': {
                get label() { return lmT('settings.hk-copyLb'); },
                defaultKey: 'L',
                keyDown() {
                    application && application.copyLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showLb': {
                get label() { return lmT('settings.hk-showLb'); },
                defaultKey: 'ALT+L',
                keyDown() {
                    application && application.setShowLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleAutoZoom': {
                get label() { return lmT('settings.hk-toggleAutoZoom'); },
                defaultKey: '',
                keyDown() {
                    application && application.toggleAutoZoom();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-resetZoom': {
                get label() { return lmT('settings.hk-resetZoom'); },
                defaultKey: 'Z',
                keyDown() {
                    application && application.resetZoom(!0);
                },
                keyUp() {
                    application && application.resetZoom(!1);
                },
                type: 'normal'
            },
            'hk-toggleDeath': {
                get label() { return lmT('settings.hk-toggleDeath'); },
                defaultKey: 'X',
                keyDown() {
                    application && application.toggleDeath();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-clearChat': {
                get label() { return lmT('settings.hk-clearChat'); },
                defaultKey: 'C',
                keyDown() {
                    application && application.displayChatHistory(!0);
                },
                keyUp() {
                    application && application.displayChatHistory(!1);
                },
                type: 'normal'
            },
            'hk-showBgSectors': {
                get label() { return lmT('settings.hk-showBgSectors'); },
                defaultKey: 'B',
                keyDown() {
                    application && application.setShowBgSectors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideBots': {
                get label() { return lmT('settings.hk-hideBots'); },
                defaultKey: 'ALT+B',
                keyDown() {
                    application && application.setHideSmallBots();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showNames': {
                get label() { return lmT('settings.hk-showNames'); },
                defaultKey: 'N',
                keyDown() {
                    application && application.setShowNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideTeammatesNames': {
                get label() { return lmT('settings.hk-hideTeammatesNames'); },
                defaultKey: '',
                keyDown() {
                    application && application.setHideTeammatesNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMass': {
                get label() { return lmT('settings.hk-showMass'); },
                defaultKey: 'M',
                keyDown() {
                    application && application.setShowMass();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMap': {
                get label() { return lmT('settings.hk-showMiniMap'); },
                defaultKey: 'ALT+M',
                keyDown() {
                    application && application.setShowMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-chatMessage': {
                get label() { return lmT('settings.hk-chatMessage'); },
                defaultKey: 'ENTER',
                keyDown() {
                    application && application.enterChatMessage();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-quickResp': {
                get label() { return lmT('settings.hk-quickResp'); },
                defaultKey: 'Y',
                keyDown() {
                    application && application.quickResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-autoResp': {
                get label() { return lmT('settings.hk-autoResp'); },
                defaultKey: '',
                keyDown() {
                    application && application.toggleAutoResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-quitGame': {
                get label() { return lmT('settings.hk-quitGame'); },
                defaultKey: '+',
                keyDown() {
                    application && application.quitGame();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-wave': {
                get label() { return lmT('settings.hk-wave'); },
                defaultKey: '',
                keyDown() {
                    application && application.sendTeamWave && application.sendTeamWave();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom1': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 1'; },
                defaultKey: 'ALT+1',
                keyDown() {
                    application && application.setZoom(0.5);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom2': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 2'; },
                defaultKey: 'ALT+2',
                keyDown() {
                    application && application.setZoom(0.25);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom3': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 3'; },
                defaultKey: 'ALT+3',
                keyDown() {
                    application && application.setZoom(0.125);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom4': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 4'; },
                defaultKey: 'ALT+4',
                keyDown() {
                    application && application.setZoom(0.075);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom5': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 5'; },
                defaultKey: 'ALT+5',
                keyDown() {
                    application && application.setZoom(0.05);
                },
                keyUp: null,
                type: 'normal'
            },
            /* HUD helpers (ogario/modules/hudhelpers.js); no default keys */
            'hk-precisionZoom': {
                get label() { return lmT('settings.hk-precisionZoom'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.precisionZoom(true);
                },
                keyUp() {
                    window.LMHudHelpers && window.LMHudHelpers.precisionZoom(false);
                },
                type: 'normal'
            },
            'hk-voiceChat': {
                get label() { return lmT('settings.hk-voiceChat'); },
                defaultKey: '=',
                keyDown() {
                    //application && application.enterChatMessage();
                    //if ($('#message-box').css('display') == 'block') {
                    $(".voice-start.icon-mic").click();
                    //}
                },
                keyUp: null,
                type: 'special'
            },
            'hk-GhostCellsInfo': {
                get label() { return lmT('settings.hk-GhostCellsInfo'); },
                defaultKey: 'K',
                keyDown() {
                    application && application.setShowGhostCellsInfo();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-Autoplay': {
                get label() { return lmT('settings.hk-Autoplay'); },
                defaultKey: 'J',
                keyDown() {
                    application && application.setAutoPlay();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-showTargeting': {
                get label() { return lmT('settings.hk-showTargeting'); },
                defaultKey: '',
                keyDown() {
                    application && application.setShowTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-setTargeting': {
                get label() { return lmT('settings.hk-setTargeting'); },
                defaultKey: '',
                keyDown() {
                    application && application.setTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-cancelTargeting': {
                get label() { return lmT('settings.hk-cancelTargeting'); },
                defaultKey: '',
                keyDown() {
                    application && application.cancelTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-changeTarget': {
                get label() { return lmT('settings.hk-changeTarget'); },
                defaultKey: '',
                keyDown() {
                    application && application.changeTarget();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-privateMiniMap': {
                get label() { return lmT('settings.hk-privateMiniMap'); },
                defaultKey: '',
                keyDown() {
                    application && application.setPrivateMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSpectator': {
                get label() { return lmT('settings.hk-showSpectator'); },
                defaultKey: 'V',
                keyDown() {
                    application && application.setShowFullSpectator();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showIngameSpectator': {
                get label() { return lmT('settings.hk-showIngameSpectator'); },
                defaultKey: '',
                keyDown() {
                    application && application.setShowIngameSpectator();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-bots-ai': {
                get label() { return lmT('settings.hk-bots-ai'); },
                defaultKey: '', // 'P' was its old key; no default now (other commands use it)
                keyDown() {
                    if (typeof window._lmBotsAiToggle === 'function') window._lmBotsAiToggle()
                },
                keyUp: null,
                type: 'normal'
            },
            /* (second, identical 'hk-macroFeed' entry removed: duplicate key, the first one stays) */
            'hk-bots-macrofeed': {
                get label() { return lmT('settings.hk-bots-macrofeed'); },
                defaultKey: '',
                keyDown() {
                    //if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
					if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) {
						application.macrobotFeed(!0);	
						//application.Botseject();
					}																
                },
                keyUp(){
					if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.macrobotFeed(!1); 
				},
                type: 'normal'
            },				
            'hk-bots-feed': {
                get label() { return lmT('settings.hk-bots-feed'); },
                defaultKey: '', // 'L' is already the Copy LB default; a later duplicate overwrote it
                keyDown() {
                    if (window.userBots && window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
					else if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.Botseject();
                },
                keyUp: null,
                type: 'normal'
            },			
            'hk-bots-split': {
                get label() { return lmT('settings.hk-bots-split'); },
                defaultKey: '', // 'M' is already the Show mass default
                keyDown() {
                    if (window.userBots && window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([2]).buffer);
					else if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.Botsplit();
                },
                keyUp: null,
                type: 'normal'
            },					
            'hk-doubleBotSplit': {
                get label() { return lmT('settings.hk-doubleBotSplit'); },
                defaultKey: '',
                keyDown() {
                    if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.doubleBotSplit();
                },
                keyUp: null,
                type: 'normal'
            },		
            'hk-popBotSplit': {
                get label() { return lmT('game2.hkPopBotSplit'); },
                defaultKey: '',
                keyDown() {
                    if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.popBotSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-splitBot16': {
                get label() { return lmT('settings.hk-splitBot16'); },
                defaultKey: '',
                keyDown() {
                    if (window.legendmod && legendmod.ws && legendmod.ws.includes("imsolo.pro") && application) application.splitBot16();
                },
                keyUp: null,
                type: 'normal'
            },			
            'hk-comm1': {
                label: chatCommand['comm1'],
                defaultKey: '1',
                keyDown() {
                    application && application.sendCommand(1);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm2': {
                label: chatCommand['comm2'],
                defaultKey: '2',
                keyDown() {
                    application && application.sendCommand(2);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm3': {
                label: chatCommand['comm3'],
                defaultKey: '3',
                keyDown() {
                    application && application.sendCommand(3);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm4': {
                label: chatCommand['comm4'],
                defaultKey: '4',
                keyDown() {
                    application && application.sendCommand(4);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm5': {
                label: chatCommand['comm5'],
                defaultKey: '5',
                keyDown() {
                    application && application.sendCommand(5);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm6': {
                label: chatCommand['comm6'],
                defaultKey: '6',
                keyDown() {
                    application && application.sendCommand(6);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm7': {
                label: chatCommand['comm7'],
                defaultKey: '7',
                keyDown() {
                    application && application.sendCommand(7);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm8': {
                label: chatCommand['comm8'],
                defaultKey: '8',
                keyDown() {
                    application && application.sendCommand(8);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm9': {
                label: chatCommand['comm9'],
                defaultKey: '9',
                keyDown() {
                    application && application.sendCommand(9);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm0': {
                label: chatCommand['comm0'],
                defaultKey: '0',
                keyDown() {
                    application && application.sendCommand(0);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm10': {
                label: chatCommand['comm10'],
                defaultKey: 'MOUSE WHEEL', // i18n-ok: a key name, stored in the hotkey settings
                keyDown() {
                    application && application.sendCommand(10);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm11': {
                label: chatCommand['comm11'],
                defaultKey: 'LEFT',
                keyDown() {
                    application && application.sendCommand(11);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm12': {
                label: chatCommand['comm12'],
                defaultKey: 'UP',
                keyDown() {
                    application && application.sendCommand(12);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm13': {
                label: chatCommand['comm13'],
                defaultKey: 'RIGHT',
                keyDown() {
                    application && application.sendCommand(13);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm14': {
                label: chatCommand['comm14'],
                defaultKey: 'DOWN',
                keyDown() {
                    application && application.sendCommand(14);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm15': {
                label: chatCommand['comm15'],
                defaultKey: 'CTRL+1',
                keyDown() {
                    application && application.sendCommand(15);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm16': {
                label: chatCommand['comm16'],
                defaultKey: 'CTRL+2',
                keyDown() {
                    application && application.sendCommand(16);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm17': {
                label: chatCommand['comm17'],
                defaultKey: 'CTRL+3',
                keyDown() {
                    application && application.sendCommand(17);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm18': {
                label: chatCommand['comm18'],
                defaultKey: 'CTRL+4',
                keyDown() {
                    application && application.sendCommand(18);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm19': {
                label: chatCommand['comm19'],
                defaultKey: 'CTRL+5',
                keyDown() {
                    application && application.sendCommand(19);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm20': {
                label: chatCommand['comm20'],
                defaultKey: 'CTRL+7',
                keyDown() {
                    application && application.sendCommand(20);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm21': {
                label: chatCommand['comm21'],
                defaultKey: 'CTRL+8',
                keyDown() {
                    application && application.sendCommand(21);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm22': {
                label: chatCommand['comm22'],
                defaultKey: 'CTRL+9',
                keyDown() {
                    application && application.sendCommand(22);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm23': {
                label: chatCommand['comm23'],
                defaultKey: 'CTRL+0',
                keyDown() {
                    application && application.sendCommand(23);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm24': {
                label: chatCommand['comm24'],
                defaultKey: 'CTRL+Z',
                keyDown() {
                    application && application.sendCommand(24);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm25': {
                label: chatCommand['comm25'],
                defaultKey: 'CTRL+X',
                keyDown() {
                    application && application.sendCommand(25);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm26': {
                label: chatCommand['comm26'],
                defaultKey: 'CTRL+Q',
                keyDown() {
                    application && application.sendCommand(26);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm27': {
                label: chatCommand['comm27'],
                defaultKey: 'CTRL+M',
                keyDown() {
                    application && application.sendCommand(27);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm28': {
                label: chatCommand['comm28'],
                defaultKey: 'CTRL+B',
                keyDown() {
                    application && application.sendCommand(28);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm29': {
                label: chatCommand['comm29'],
                defaultKey: 'CTRL+L',
                keyDown() {
                    application && application.sendCommand(29);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm30': {
                label: chatCommand['comm30'],
                defaultKey: 'CTRL+D',
                keyDown() {
                    application && application.sendCommand(30);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm31': {
                label: chatCommand['comm31'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(31);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm32': {
                label: chatCommand['comm32'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(32);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm33': {
                label: chatCommand['comm33'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(33);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm34': {
                label: chatCommand['comm34'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(34);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm35': {
                label: chatCommand['comm35'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(35);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm36': {
                label: chatCommand['comm36'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(36);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm37': {
                label: chatCommand['comm37'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(37);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm38': {
                label: chatCommand['comm38'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(38);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm39': {
                label: chatCommand['comm39'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(39);
                },
                keyUp: null,
                type: 'command'
            },		
            'hk-comm40': {
                label: chatCommand['comm40'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(40);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm41': {
                label: chatCommand['comm41'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(41);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm42': {
                label: chatCommand['comm42'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(42);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm43': {
                label: chatCommand['comm43'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(43);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm44': {
                label: chatCommand['comm44'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(44);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm45': {
                label: chatCommand['comm45'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(45);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm46': {
                label: chatCommand['comm46'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(46);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm47': {
                label: chatCommand['comm47'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(47);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm48': {
                label: chatCommand['comm48'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(48);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm49': {
                label: chatCommand['comm49'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(49);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm50': {
                label: chatCommand['comm50'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(50);
                },
                keyUp: null,
                type: 'command'
            }			
        };
        /* "Go to zoom bookmark 1-3" (removed) were the zoom level hotkeys 1-3: a mouse button or gamepad button
         * still naming them runs the zoom level (not listed: not
         * enumerable). Keyboard keys bound to them are moved in loadHotkeys (ogario.v4.js). */
        [1, 2, 3].forEach(function (n) {
            Object.defineProperty(hotkeysCommand, 'hk-zoomRecall' + n, { value: hotkeysCommand['hk-zoom' + n], enumerable: false, configurable: true });
        });
        /* "Screenshot mode" is part of Show/hide HUD (Alt+H) now: a mouse button or gamepad button
         * still naming it hides the HUD the same way (not listed). Its
         * keyboard key moves in loadHotkeys (ogario.v4.js). */
        Object.defineProperty(hotkeysCommand, 'hk-screenshotMode', { value: hotkeysCommand['hk-showHUD'], enumerable: false, configurable: true });
	
