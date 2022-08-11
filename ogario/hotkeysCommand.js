//v1.3j
        keyBlind = {};
        hotkeys = {};
        hotkeysCommand = {
            'hk-feed': {
                label: textLanguage['hk-feed'],
                defaultKey: 'W',
                keyDown() {
                    application && application.feed();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-macroFeed': {
                label: textLanguage['hk-macroFeed'],
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
                label: textLanguage['hk-macroFeedPerm'],
                defaultKey: 'CTRL+E',
                keyDown() {;
                    application && application.macroFeedPerm(!0);
                },
                type: 'normal'
            },			
            'hk-split': {
                label: textLanguage['hk-split'],
                defaultKey: 'SPACE',
                keyDown() {
                    application && application.split();
                },
                keyUp: null,
                type: 'normal'
            },		
            'hk-doubleSplit': {
                label: textLanguage['hk-doubleSplit'],
                defaultKey: 'Q',
                keyDown() {
                    application && application.doubleSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-tripleSplit': {
                label: textLanguage['hk-tripleSplit'],
                defaultKey: '',
                keyDown() {
                    application && application.tripleSplit();
                },
                keyUp: null,
                type: 'normal'
            },			
            'hk-popSplit': {
                label: 'Popsplit',
                defaultKey: 'ALT+Q',
                keyDown() {
                    application && application.popSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-split16': {
                label: textLanguage['hk-split16'],
                defaultKey: 'SHIFT',
                keyDown() {
                    application && application.split16();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-crazyDoubleSplit': {
                label: textLanguage['hk-crazyDoubleSplit'],
                defaultKey: '',
                keyDown() {
                    application && application.crazyDoubleSplit();
                },
                keyUp: null,
                type: 'normal'
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
			'hk-dance': {
				label: textLanguage['hk-dance'],
				defaultKey: 'ALT+R',
				keyDown() {
				application && application.dance(true);
				},
				keyUp() {
				application && application.dance(false);
				},
				type: 'normal'
			},	
			'hk-limitposition': {
				label: textLanguage['hk-limitposition'],
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
                label: textLanguage['hk-multiboxswap'],
                defaultKey: 'TAB',
                keyDown() {
                    application && application.multiboxswap();
                },
                keyUp: null,
                type: 'normal'
            },	
            'hk-multiboxFollowMouse': {
                label: textLanguage['hk-multiboxFollowMouse'],
                defaultKey: 'TILDE',
                keyDown() {
                    application && application.multiboxFollowMouse();
                },
                keyUp: null,
                type: 'normal'
            },				
            'hk-showTop5': {
                label: textLanguage['hk-showTop5'],
                defaultKey: 'T',
                keyDown() {
                    application && application.setShowTop5();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTime': {
                label: textLanguage['hk-showTime'],
                defaultKey: 'ALT+T',
                keyDown() {
                    application && application.setShowTime();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitRange': {
                label: textLanguage['hk-showSplitRange'],
                defaultKey: 'U',
                keyDown() {
                    application && application.setShowSplitRange();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitInd': {
                label: textLanguage['hk-showSplitInd'],
                defaultKey: 'I',
                keyDown() {
                    application && application.setShowSplitInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTeammatesInd': {
                label: textLanguage['hk-showTeammatesInd'],
                defaultKey: 'ALT+I',
                keyDown() {
                    application && application.setShowTeammatesInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showOppColors': {
                label: textLanguage['hk-showOppColors'],
                defaultKey: 'O',
                keyDown() {
                    application && application.setShowOppColors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleSkins': {
                label: textLanguage['hk-toggleSkins'],
                defaultKey: 'A',
                keyDown() {
                    application && application.toggleSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-transparentSkins': {
                label: textLanguage['hk-transparentSkins'],
                defaultKey: '',
                keyDown() {
                    application && application.setTransparentSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSkins': {
                label: textLanguage['hk-showSkins'],
                defaultKey: 'S',
                keyDown() {
                    application && application.setShowSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showStats': {
                label: textLanguage['hk-showStats'],
                defaultKey: 'ALT+S',
                keyDown() {
                    application && application.setShowStats();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleCells': {
                label: textLanguage['hk-toggleCells'],
                defaultKey: 'D',
                keyDown() {
                    application && application.toggleCells();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showFood': {
                label: textLanguage['hk-showFood'],
                defaultKey: 'F',
                keyDown() {
                    application && application.setShowFood();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showGrid': {
                label: textLanguage['hk-showGrid'],
                defaultKey: 'G',
                keyDown() {
                    application && application.setShowGrid();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMapGuides': {
                label: textLanguage['hk-showMiniMapGuides'],
                defaultKey: 'ALT+G',
                keyDown() {
                    application && application.setShowMiniMapGuides();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideChat': {
                label: textLanguage['hk-hideChat'],
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
                type: 'normal'
            },
            'hk-copyLb': {
                label: textLanguage['hk-copyLb'],
                defaultKey: 'L',
                keyDown() {
                    application && application.copyLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showLb': {
                label: textLanguage['hk-showLb'],
                defaultKey: 'ALT+L',
                keyDown() {
                    application && application.setShowLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleAutoZoom': {
                label: textLanguage['hk-toggleAutoZoom'],
                defaultKey: '',
                keyDown() {
                    application && application.toggleAutoZoom();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-resetZoom': {
                label: textLanguage['hk-resetZoom'],
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
                label: textLanguage['hk-toggleDeath'],
                defaultKey: 'X',
                keyDown() {
                    application && application.toggleDeath();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-clearChat': {
                label: textLanguage['hk-clearChat'],
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
                label: textLanguage['hk-showBgSectors'],
                defaultKey: 'B',
                keyDown() {
                    application && application.setShowBgSectors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideBots': {
                label: textLanguage['hk-hideBots'],
                defaultKey: 'ALT+B',
                keyDown() {
                    application && application.setHideSmallBots();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showNames': {
                label: textLanguage['hk-showNames'],
                defaultKey: 'N',
                keyDown() {
                    application && application.setShowNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideTeammatesNames': {
                label: textLanguage['hk-hideTeammatesNames'],
                defaultKey: '',
                keyDown() {
                    application && application.setHideTeammatesNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMass': {
                label: textLanguage['hk-showMass'],
                defaultKey: 'M',
                keyDown() {
                    application && application.setShowMass();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMap': {
                label: textLanguage['hk-showMiniMap'],
                defaultKey: 'ALT+M',
                keyDown() {
                    application && application.setShowMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-chatMessage': {
                label: textLanguage['hk-chatMessage'],
                defaultKey: 'ENTER',
                keyDown() {
                    application && application.enterChatMessage();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-quickResp': {
                label: textLanguage['hk-quickResp'],
                defaultKey: 'Y',
                keyDown() {
                    application && application.quickResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-autoResp': {
                label: textLanguage['hk-autoResp'],
                defaultKey: '',
                keyDown() {
                    application && application.toggleAutoResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom1': {
                label: textLanguage['hk-zoomLevel'] + ' 1',
                defaultKey: 'ALT+1',
                keyDown() {
                    application && application.setZoom(0.5);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom2': {
                label: textLanguage['hk-zoomLevel'] + ' 2',
                defaultKey: 'ALT+2',
                keyDown() {
                    application && application.setZoom(0.25);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom3': {
                label: textLanguage['hk-zoomLevel'] + ' 3',
                defaultKey: 'ALT+3',
                keyDown() {
                    application && application.setZoom(0.125);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom4': {
                label: textLanguage['hk-zoomLevel'] + ' 4',
                defaultKey: 'ALT+4',
                keyDown() {
                    application && application.setZoom(0.075);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom5': {
                label: textLanguage['hk-zoomLevel'] + ' 5',
                defaultKey: 'ALT+5',
                keyDown() {
                    application && application.setZoom(0.05);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-voiceChat': {
                label: textLanguage['hk-voiceChat'],
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
                label: textLanguage['hk-GhostCellsInfo'],
                defaultKey: 'K',
                keyDown() {
                    application && application.setShowGhostCellsInfo();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-Autoplay': {
                label: textLanguage['hk-Autoplay'],
                defaultKey: 'J',
                keyDown() {
                    application && application.setAutoPlay();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-switchServerMode': {
                label: textLanguage['hk-switchServerMode'],
                defaultKey: '-',
                keyDown() {
                    application && application.switchServerMode();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTargeting': {
                label: textLanguage['hk-showTargeting'],
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
                type: 'normal'
            },
            'hk-changeTarget': {
                label: textLanguage['hk-changeTarget'],
                defaultKey: '',
                keyDown() {
                    application && application.changeTarget();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-privateMiniMap': {
                label: textLanguage['hk-privateMiniMap'],
                defaultKey: '',
                keyDown() {
                    application && application.setPrivateMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showQuest': {
                label: textLanguage['hk-showQuest'],
                defaultKey: '',
                keyDown() {
                    application && application.setShowQuest();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSpectator': {
                label: textLanguage['hk-showSpectator'],
                defaultKey: 'V',
                keyDown() {
                    application && application.setShowFullSpectator();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showIngameSpectator': {
                label: textLanguage['hk-showIngameSpectator'],
                defaultKey: '',
                keyDown() {
                    application && application.setShowIngameSpectator();
                },
                keyUp: null,
                type: 'normal'
            },	/*
            'hk-bots-ai': {
                label: textLanguage['hk-bots-ai'],
                defaultKey: 'P',
                keyDown() {
                    if (window.userBots.startedBots && window.userBots.isAlive) {
                        if (!window.bots.ai) {
                            document.getElementById('botsAI').style.color = '#00C02E'
                            document.getElementById('botsAI').innerText = 'Enabled'
                            window.bots.ai = true
                            window.connectionBots.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        } else {
                            document.getElementById('botsAI').style.color = '#DA0A00'
                            document.getElementById('botsAI').innerText = 'Disabled'
                            window.bots.ai = false
                            window.connectionBots.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        }
                    }
                },
                keyUp: null,
                type: 'normal'
            },*/
            'hk-macroFeed': {
                label: textLanguage['hk-macroFeed'],
                defaultKey: 'E',
                keyDown() {
                    application && application.macroFeed(!0);
                },
                keyUp() {
                    application && application.macroFeed(!1);
                },
                type: 'normal'
            },				
            'hk-bots-macrofeed': {
                label: textLanguage['hk-bots-macrofeed'],
                defaultKey: '',
                keyDown() {
                    //if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
					if (legendmod.ws.includes("imsolo.pro") && application) {
						application.macrobotFeed(!0);	
						//application.Botseject();
					}																
                },
                keyUp(){
					if (legendmod.ws.includes("imsolo.pro") && application) application.macrobotFeed(!1); 
				},
                type: 'normal'
            },				
            'hk-bots-feed': {
                label: textLanguage['hk-bots-feed'],
                defaultKey: 'L',
                keyDown() {
                    if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
					else if (legendmod.ws.includes("imsolo.pro") && application) application.Botseject();
                },
                keyUp: null,
                type: 'normal'
            },			
            'hk-bots-split': {
                label: textLanguage['hk-bots-split'],
                defaultKey: 'M',
                keyDown() {
                    if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([2]).buffer);
					else if (legendmod.ws.includes("imsolo.pro") && application) application.Botsplit();
                },
                keyUp: null,
                type: 'normal'
            },					
            'hk-doubleBotSplit': {
                label: textLanguage['hk-doubleBotSplit'],
                defaultKey: '',
                keyDown() {
                    if (legendmod.ws.includes("imsolo.pro") && application) application.doubleBotSplit();
                },
                keyUp: null,
                type: 'normal'
            },		
            'hk-popBotSplit': {
                label: 'Bots Popsplit (Private servers)',
                defaultKey: '',
                keyDown() {
                    if (legendmod.ws.includes("imsolo.pro") && application) application.popBotSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-splitBot16': {
                label: textLanguage['hk-splitBot16'],
                defaultKey: '',
                keyDown() {
                    if (legendmod.ws.includes("imsolo.pro") && application) application.splitBot16();
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
                defaultKey: 'MOUSE WHEEL',
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
        }
	
