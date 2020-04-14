        keyBlind = {};
        hotkeys = {};
        hotkeysCommand = {
            'hk-feed': {
                label: textLanguage['hk-feed'],
                defaultKey: 'W',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.feed();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-macroFeed': {
                label: textLanguage['hk-macroFeed'],
                defaultKey: 'E',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.macroFeed(!0);
                },
                keyUp() {
                    ogarminimapdrawer && ogarminimapdrawer.macroFeed(!1);
                },
                type: 'normal'
            },
            'hk-split': {
                label: textLanguage['hk-split'],
                defaultKey: 'SPACE',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.split();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-doubleSplit': {
                label: textLanguage['hk-doubleSplit'],
                defaultKey: 'Q',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.doubleSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-popSplit': {
                label: 'Popsplit',
                defaultKey: 'ALT+Q',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.popSplit();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-split16': {
                label: textLanguage['hk-split16'],
                defaultKey: 'SHIFT',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.split16();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-pause': {
                label: textLanguage['hk-pause'],
                defaultKey: 'R',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setPause();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTop5': {
                label: textLanguage['hk-showTop5'],
                defaultKey: 'T',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowTop5();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTime': {
                label: textLanguage['hk-showTime'],
                defaultKey: 'ALT+T',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowTime();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitRange': {
                label: textLanguage['hk-showSplitRange'],
                defaultKey: 'U',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowSplitRange();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSplitInd': {
                label: textLanguage['hk-showSplitInd'],
                defaultKey: 'I',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowSplitInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTeammatesInd': {
                label: textLanguage['hk-showTeammatesInd'],
                defaultKey: 'ALT+I',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowTeammatesInd();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showOppColors': {
                label: textLanguage['hk-showOppColors'],
                defaultKey: 'O',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowOppColors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleSkins': {
                label: textLanguage['hk-toggleSkins'],
                defaultKey: 'A',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.toggleSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-transparentSkins': {
                label: textLanguage['hk-transparentSkins'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setTransparentSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSkins': {
                label: textLanguage['hk-showSkins'],
                defaultKey: 'S',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowSkins();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showStats': {
                label: textLanguage['hk-showStats'],
                defaultKey: 'ALT+S',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowStats();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleCells': {
                label: textLanguage['hk-toggleCells'],
                defaultKey: 'D',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.toggleCells();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showFood': {
                label: textLanguage['hk-showFood'],
                defaultKey: 'F',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowFood();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showGrid': {
                label: textLanguage['hk-showGrid'],
                defaultKey: 'G',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowGrid();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMapGuides': {
                label: textLanguage['hk-showMiniMapGuides'],
                defaultKey: 'ALT+G',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowMiniMapGuides();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideChat': {
                label: textLanguage['hk-hideChat'],
                defaultKey: 'H',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.hideChat();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showHUD': {
                label: textLanguage['hk-showHUD'],
                defaultKey: 'ALT+H',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowHUD();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-copyLb': {
                label: textLanguage['hk-copyLb'],
                defaultKey: 'L',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.copyLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showLb': {
                label: textLanguage['hk-showLb'],
                defaultKey: 'ALT+L',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowLb();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-toggleAutoZoom': {
                label: textLanguage['hk-toggleAutoZoom'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.toggleAutoZoom();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-resetZoom': {
                label: textLanguage['hk-resetZoom'],
                defaultKey: 'Z',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.resetZoom(!0);
                },
                keyUp() {
                    ogarminimapdrawer && ogarminimapdrawer.resetZoom(!1);
                },
                type: 'normal'
            },
            'hk-toggleDeath': {
                label: textLanguage['hk-toggleDeath'],
                defaultKey: 'X',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.toggleDeath();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-clearChat': {
                label: textLanguage['hk-clearChat'],
                defaultKey: 'C',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!0);
                },
                keyUp() {
                    ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!1);
                },
                type: 'normal'
            },
            'hk-showBgSectors': {
                label: textLanguage['hk-showBgSectors'],
                defaultKey: 'B',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowBgSectors();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideBots': {
                label: textLanguage['hk-hideBots'],
                defaultKey: 'ALT+B',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setHideSmallBots();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showNames': {
                label: textLanguage['hk-showNames'],
                defaultKey: 'N',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-hideTeammatesNames': {
                label: textLanguage['hk-hideTeammatesNames'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setHideTeammatesNames();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMass': {
                label: textLanguage['hk-showMass'],
                defaultKey: 'M',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowMass();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showMiniMap': {
                label: textLanguage['hk-showMiniMap'],
                defaultKey: 'ALT+M',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-chatMessage': {
                label: textLanguage['hk-chatMessage'],
                defaultKey: 'ENTER',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-quickResp': {
                label: textLanguage['hk-quickResp'],
                defaultKey: 'TILDE',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.quickResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-autoResp': {
                label: textLanguage['hk-autoResp'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.toggleAutoResp();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom1': {
                label: textLanguage['hk-zoomLevel'] + ' 1',
                defaultKey: 'ALT+1',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setZoom(0.5);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom2': {
                label: textLanguage['hk-zoomLevel'] + ' 2',
                defaultKey: 'ALT+2',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setZoom(0.25);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom3': {
                label: textLanguage['hk-zoomLevel'] + ' 3',
                defaultKey: 'ALT+3',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setZoom(0.125);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom4': {
                label: textLanguage['hk-zoomLevel'] + ' 4',
                defaultKey: 'ALT+4',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setZoom(0.075);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom5': {
                label: textLanguage['hk-zoomLevel'] + ' 5',
                defaultKey: 'ALT+5',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setZoom(0.05);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-voiceChat': {
                label: textLanguage['hk-voiceChat'],
                defaultKey: '=',
                keyDown() {
                    //ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
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
                    ogarminimapdrawer && ogarminimapdrawer.setShowGhostCellsInfo();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-Autoplay': {
                label: textLanguage['hk-Autoplay'],
                defaultKey: 'J',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setAutoPlay();
                },
                keyUp: null,
                type: 'special'
            },
            'hk-switchServerMode': {
                label: textLanguage['hk-switchServerMode'],
                defaultKey: '-',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.switchServerMode();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showTargeting': {
                label: textLanguage['hk-showTargeting'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-setTargeting': {
                label: textLanguage['hk-setTargeting'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-cancelTargeting': {
                label: textLanguage['hk-cancelTargeting'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.cancelTargeting();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-changeTarget': {
                label: textLanguage['hk-changeTarget'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.changeTarget();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-privateMiniMap': {
                label: textLanguage['hk-privateMiniMap'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setPrivateMiniMap();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showQuest': {
                label: textLanguage['hk-showQuest'],
                defaultKey: '',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowQuest();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-showSpectator': {
                label: textLanguage['hk-showSpectator'],
                defaultKey: 'V',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.setShowFullSpectator();
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-bots-split': {
                label: textLanguage['hk-bots-split'],
                defaultKey: 'M',
                keyDown() {
                    if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([2]).buffer);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-bots-feed': {
                label: textLanguage['hk-bots-feed'],
                defaultKey: 'L',
                keyDown() {
                    if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
                },
                keyUp: null,
                type: 'normal'
            },
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
            },
            'hk-comm1': {
                label: chatCommand['comm1'],
                defaultKey: '1',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(1);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm2': {
                label: chatCommand['comm2'],
                defaultKey: '2',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(2);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm3': {
                label: chatCommand['comm3'],
                defaultKey: '3',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(3);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm4': {
                label: chatCommand['comm4'],
                defaultKey: '4',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(4);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm5': {
                label: chatCommand['comm5'],
                defaultKey: '5',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(5);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm6': {
                label: chatCommand['comm6'],
                defaultKey: '6',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(6);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm7': {
                label: chatCommand['comm7'],
                defaultKey: '7',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(7);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm8': {
                label: chatCommand['comm8'],
                defaultKey: '8',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(8);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm9': {
                label: chatCommand['comm9'],
                defaultKey: '9',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(9);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm0': {
                label: chatCommand['comm0'],
                defaultKey: '0',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(0);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm10': {
                label: chatCommand['comm10'],
                defaultKey: 'MOUSE WHEEL',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(10);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm11': {
                label: chatCommand['comm11'],
                defaultKey: 'LEFT',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(11);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm12': {
                label: chatCommand['comm12'],
                defaultKey: 'UP',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(12);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm13': {
                label: chatCommand['comm13'],
                defaultKey: 'RIGHT',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(13);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm14': {
                label: chatCommand['comm14'],
                defaultKey: 'DOWN',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(14);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm15': {
                label: chatCommand['comm15'],
                defaultKey: 'CTRL+1',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(15);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm16': {
                label: chatCommand['comm16'],
                defaultKey: 'CTRL+2',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(16);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm17': {
                label: chatCommand['comm17'],
                defaultKey: 'CTRL+3',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(17);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm18': {
                label: chatCommand['comm18'],
                defaultKey: 'CTRL+4',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(18);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm19': {
                label: chatCommand['comm19'],
                defaultKey: 'CTRL+5',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(19);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm20': {
                label: chatCommand['comm20'],
                defaultKey: 'CTRL+7',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(20);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm21': {
                label: chatCommand['comm21'],
                defaultKey: 'CTRL+8',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(21);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm22': {
                label: chatCommand['comm22'],
                defaultKey: 'CTRL+9',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(22);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm23': {
                label: chatCommand['comm23'],
                defaultKey: 'CTRL+0',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(23);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm24': {
                label: chatCommand['comm24'],
                defaultKey: 'CTRL+Z',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(24);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm25': {
                label: chatCommand['comm25'],
                defaultKey: 'CTRL+X',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(25);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm26': {
                label: chatCommand['comm26'],
                defaultKey: 'CTRL+Q',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(26);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm27': {
                label: chatCommand['comm27'],
                defaultKey: 'CTRL+LM',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(27);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm28': {
                label: chatCommand['comm28'],
                defaultKey: 'CTRL+B',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(28);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm29': {
                label: chatCommand['comm29'],
                defaultKey: 'CTRL+L',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(29);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm30': {
                label: chatCommand['comm30'],
                defaultKey: 'CTRL+D',
                keyDown() {
                    ogarminimapdrawer && ogarminimapdrawer.sendCommand(30);
                },
                keyUp: null,
                type: 'command'
            }
        }
	
