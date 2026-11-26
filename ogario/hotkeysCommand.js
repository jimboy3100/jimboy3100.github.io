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
        /* Expanding Land panel hotkeys (no default keys): only on Expanding Land and when the
         * panel buttons are enabled (logged in, same check as the buttons); the key closes the
         * panel again when it is open */
        window._lmElPanelKey = function (modalId, open) {
            try {
                var L = window.legendmod;
                var onEl = !!(L && (L.isLegendWorld || L.serverType === 'expandingland'));
                if (!onEl) {
                    if (window.toastr) toastr.info(lmT('game2.hkElOnly'));
                    return;
                }
                if (modalId) {
                    var cur = document.getElementById(modalId);
                    if (cur) { cur.parentNode.removeChild(cur); return; }
                }
                var btn = document.getElementById('lm-leagues-btn');
                if (!btn || btn.disabled) {
                    if (window.toastr) toastr.info((window._lmLoginHint && window._lmLoginHint()) || lmT('game2.hkLoginFirst'));
                    return;
                }
                open();
            } catch (e) { }
        };
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
            /* opens the Analytics window (ogario/modules/analytics.js); no default key */
            'hk-analytics': {
                get label() {
                    return lmT('settings.hk-analytics');
                },
                defaultKey: '',
                keyDown() {
                    if (window.LMAnalytics) {
                        if (window.LMAnalytics.isOpen()) window.LMAnalytics.close();
                        else window.LMAnalytics.open();
                    }
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
            /* custom macro slot 1 (ogario/modules/macroeditor.js, loaded on the first press;
             * made in Settings > Macro > Custom macros); no default key */
            'hk-customMacro1': {
                get label() {
                    return lmT('settings.hk-customMacro1');
                },
                defaultKey: '',
                keyDown() {
                    if (typeof window.lmMacroEditor === 'function') window.lmMacroEditor('run', 1);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-customMacro2': {
                get label() {
                    return lmT('settings.hk-customMacro2');
                },
                defaultKey: '',
                keyDown() {
                    if (typeof window.lmMacroEditor === 'function') window.lmMacroEditor('run', 2);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-customMacro3': {
                get label() {
                    return lmT('settings.hk-customMacro3');
                },
                defaultKey: '',
                keyDown() {
                    if (typeof window.lmMacroEditor === 'function') window.lmMacroEditor('run', 3);
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
			/* Performance mode on/off without opening the settings (no default key). Goes through the
			 * settings switch so its backup/restore of the effect settings runs exactly once. */
			'hk-performanceMode': {
				get label() {
					return lmT('settings.hk-performanceMode');
				},
				defaultKey: '',
				keyDown() {
					if (!application || typeof defaultmapsettings === 'undefined') return;
					var next = !defaultmapsettings.performanceMode;
					if (document.getElementById('performanceMode') && typeof application.syncHotkeyOption === 'function') {
						defaultmapsettings.performanceMode = next;
						application.syncHotkeyOption('performanceMode');
					} else if (typeof application.setSettings === 'function') {
						application.setSettings('performanceMode', next);
					}
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-mergeRings': {
				get label() {
					return lmT('settings.hk-mergeRings');
				},
				defaultKey: '',
				keyDown() {
					if (!application || typeof defaultmapsettings === 'undefined') return;
					defaultmapsettings.mergeRings = defaultmapsettings.mergeRings === false;
					if (typeof application.syncHotkeyOption === 'function') application.syncHotkeyOption('mergeRings');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-elLeagues': {
				get label() {
					return lmT('settings.hk-elLeagues');
				},
				defaultKey: '',
				keyDown() {
					_lmElPanelKey('lm-leagues-modal', function () { if (typeof window.showLeaguesModal === 'function') window.showLeaguesModal(); });
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-elShop': {
				get label() {
					return lmT('settings.hk-elShop');
				},
				defaultKey: '',
				keyDown() {
					_lmElPanelKey('lm-main-shop-modal', function () { if (typeof window.showShopModal === 'function') window.showShopModal(); });
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-elChallenges': {
				get label() {
					return lmT('settings.hk-elChallenges');
				},
				defaultKey: '',
				keyDown() {
					_lmElPanelKey('lm-challenges-modal', function () { if (typeof window.showChallengesModal === 'function') window.showChallengesModal(); });
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-elPotions': {
				get label() {
					return lmT('settings.hk-elPotions');
				},
				defaultKey: '',
				keyDown() {
					_lmElPanelKey('lm-potions-help-modal', function () { if (typeof window.showPotionsHelpModal === 'function') window.showPotionsHelpModal(); });
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-elClaimAll': {
				get label() {
					return lmT('settings.hk-elClaimAll');
				},
				defaultKey: '',
				keyDown() {
					_lmElPanelKey('', function () { var b = document.getElementById('lm-claim-all-btn'); if (b && (b.disabled || /\u23F3/.test(b.textContent))) return; /* same double-press guard as the button */ if (typeof window.claimAllRewardsAndGifts === 'function') window.claimAllRewardsAndGifts(); });
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replayPause': {
				get label() {
					return lmT('settings.hk-replayPause');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplayTogglePause === 'function') window.lmReplayTogglePause();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replayFaster': {
				get label() {
					return lmT('settings.hk-replayFaster');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplaySpeed === 'function') window.lmReplaySpeed(0.5);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replaySlower': {
				get label() {
					return lmT('settings.hk-replaySlower');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplaySpeed === 'function') window.lmReplaySpeed(2);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replayFwd': {
				get label() {
					return lmT('settings.hk-replayFwd');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplaySeek === 'function') window.lmReplaySeek(250);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replayBack': {
				get label() {
					return lmT('settings.hk-replayBack');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplaySeek === 'function') window.lmReplaySeek(-250);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-replayStudio': {
				get label() {
					return lmT('settings.hk-replayStudio');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmReplayStudio === 'function') window.lmReplayStudio('toggle');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-instantReplay': {
				get label() {
					return lmT('settings.hk-instantReplay');
				},
				defaultKey: '',
				keyDown() {
					/* plays the end of the current recording; while alive it waits for the death (a replay leaves the server) */
					if (typeof window.lmReplayStudio === 'function') window.lmReplayStudio('instant');
				},
				keyUp: null,
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
			'hk-mbRings': {
				get label() {
					return lmT('settings.hk-mbRings');
				},
				defaultKey: '',
				keyDown() {
					if (!application || typeof defaultmapsettings === 'undefined') return;
					/* mbRings was split into mbRingsP1 and mbRingsP2: toggle both (any ring on = both off) */
					var _mbNew = !(defaultmapsettings.mbRingsP1 || defaultmapsettings.mbRingsP2);
					defaultmapsettings.mbRingsP1 = _mbNew;
					defaultmapsettings.mbRingsP2 = _mbNew;
					if (typeof application.syncHotkeyOption === 'function') {
						application.syncHotkeyOption('mbRingsP1');
						application.syncHotkeyOption('mbRingsP2');
					}
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
			'hk-gamepadWindow': {
				get label() {
					return lmT('settings.hk-gamepadWindow');
				},
				defaultKey: '',
				keyDown() {
					/* ogario/gamepad.js (loads the window the first time); the key closes it again */
					if (window.LMGamepad && typeof window.LMGamepad.openWindow === 'function') window.LMGamepad.openWindow(true);
				},
				keyUp: null,
				type: 'normal'
			},
			/* Settings profiles (ogario/modules/profiles.js): no default keys */
			'hk-lmProfilesWindow': {
				get label() {
					return lmT('settings.hk-lmProfilesWindow');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMProfiles) window.LMProfiles.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-lmProfileNext': {
				get label() {
					return lmT('settings.hk-lmProfileNext');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMProfiles) window.LMProfiles.applyNext(1);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-lmProfilePrev': {
				get label() {
					return lmT('settings.hk-lmProfilePrev');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMProfiles) window.LMProfiles.applyNext(-1);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-lmProfileUndo': {
				get label() {
					return lmT('settings.hk-lmProfileUndo');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMProfiles) window.LMProfiles.undo();
				},
				keyUp: null,
				type: 'normal'
			},
			/* Theme workshop window (ogario/modules/themeworkshop.js): no default key */
			'hk-lmThemeWorkshop': {
				get label() {
					return lmT('settings.hk-lmThemeWorkshop');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMThemeWorkshop && typeof window.LMThemeWorkshop.toggle === 'function') window.LMThemeWorkshop.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-copyServerLink': {
				get label() {
					return lmT('settings.hk-copyServerLink');
				},
				defaultKey: '',
				keyDown() {
					/* same as the TK&PW button in the menu */
					var b = document.getElementById('copySIPandPass');
					if (b) {
						$(b).trigger('click');
						/* the copy selects a hidden input: give the keys back to the game */
						var ae = document.activeElement;
						if (ae && ae.id === 'tempCopy') ae.blur();
						if (window.toastr) { if (String($('#server-token').val() || '').trim()) toastr.info(lmT('game2.hkLinkCopied')); else toastr.info(lmT('game2.hkLinkNotYet')); }
					}
					else if (window.toastr) toastr.info(lmT('game2.hkLinkNotYet'));
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-netGraph': {
				get label() {
					return lmT('settings.hk-netGraph');
				},
				defaultKey: '',
				keyDown() {
					if (typeof window.lmToggleNetGraph === 'function') window.lmToggleNetGraph();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-perfDiag': {
				get label() {
					return lmT('settings.hk-perfDiag');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMPerf && typeof window.LMPerf.toggleDiag === 'function') window.LMPerf.toggleDiag();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-chatSounds': {
				get label() {
					return lmT('settings.hk-chatSounds');
				},
				defaultKey: '',
				keyDown() {
					/* same as the speaker button in the chat box */
					if (!application || typeof defaultmapsettings === 'undefined') return;
					defaultmapsettings.chatSounds = !defaultmapsettings.chatSounds;
					if (typeof application.setChatSoundsBtn === 'function') application.setChatSoundsBtn();
					if (typeof application.syncHotkeyOption === 'function') application.syncHotkeyOption('chatSounds');
					if (window.toastr) toastr.info(defaultmapsettings.chatSounds ? lmT('game2.hkChatSoundsOn') : lmT('game2.hkChatSoundsOff'));
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
					/* works in free spectate whether or not lbClickSpectate is on (binding the key is the opt-in):
					 * steps the followed player through the leaderboard ghost cells, wrapping around */
					var lm = window.legendmod;
					if (!lm || lm.play) return;
					if (!lm.isFreeSpectate) {
						if (window.toastr) toastr.info(lmT('game2.hkFreeSpecFirst'));
						return;
					}
					var n = lm.ghostCells ? lm.ghostCells.length : 0;
					if (!n) return;
					lm._lmSpecLb = lm._lmSpecLb == null ? 0 : (lm._lmSpecLb + 1) % n;
					lm._lmSpecCell = null; /* one follow at a time */
					lm._lmSpecLbHud && lm._lmSpecLbHud();
					var label = lmT('settings.lmSpecFollowing');
					if (window.toastr) toastr.info(label + ' #' + (lm._lmSpecLb + 1));
				},
				keyUp: null,
				type: 'normal'
			},
			/* Spectator director (ogario/modules/director.js): only while spectating, never while playing */
			'hk-director': {
				get label() {
					return lmT('settings.hk-director');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.toggle) d.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirAuto': {
				get label() {
					return lmT('settings.hk-dirAuto');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.toggleAuto) d.toggleAuto();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirBroadcast': {
				get label() {
					return lmT('settings.hk-dirBroadcast');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.toggleBroadcast) d.toggleBroadcast();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirWatchNext': {
				get label() {
					return lmT('settings.hk-dirWatchNext');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.watchNext) d.watchNext();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirWatchPrev': {
				get label() {
					return lmT('settings.hk-dirWatchPrev');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.watchPrev) d.watchPrev();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirWatchAdd': {
				get label() {
					return lmT('settings.hk-dirWatchAdd');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.watchAddUnderCursor) d.watchAddUnderCursor();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMarkSave': {
				get label() {
					return lmT('settings.hk-dirMarkSave');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.saveView) d.saveView('');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMark1': {
				get label() {
					return lmT('settings.hk-dirMark1');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.recallBookmark) d.recallBookmark(0);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMark2': {
				get label() {
					return lmT('settings.hk-dirMark2');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.recallBookmark) d.recallBookmark(1);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMark3': {
				get label() {
					return lmT('settings.hk-dirMark3');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.recallBookmark) d.recallBookmark(2);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMark4': {
				get label() {
					return lmT('settings.hk-dirMark4');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.recallBookmark) d.recallBookmark(3);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-dirMark5': {
				get label() {
					return lmT('settings.hk-dirMark5');
				},
				defaultKey: '',
				keyDown() {
					var d = window.LMDirector; if (d && d.recallBookmark) d.recallBookmark(4);
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-prevServer': {
				get label() {
					return lmT('settings.hk-prevServer');
				},
				defaultKey: '',
				keyDown() {
					/* the last different server that opened (no replays or private room tickets), joined like the Join button */
					if (typeof window._lmJoinPrevServer === 'function') window._lmJoinPrevServer();
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
			/* Command Centre search box (ogario/modules/commandcentre.js); Ctrl+K opens it too */
			'hk-commandCentre': {
				get label() {
					return lmT('settings.hk-commandCentre');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMCommandCentre && typeof window.LMCommandCentre.toggle === 'function') window.LMCommandCentre.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			/* Small tools (ogario/modules/smalltools.js), no default keys. Radial menu: hold, point, release */
			'hk-radialMenu': {
				get label() {
					return lmT('settings.hk-radialMenu');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.radialDown();
				},
				keyUp() {
					if (window.LMSmallTools) window.LMSmallTools.radialUp();
				},
				type: 'normal'
			},
			'hk-radialEditor': {
				get label() {
					return lmT('settings.hk-radialEditor');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.toggle('radial');
				},
				keyUp: null,
				type: 'normal'
			},
			/* User Scripts panel with its plugin views (ogario/modules/plugins.js) and the Lab (lab.js) */
			'hk-lmPlugins': {
				get label() {
					return lmT('settings.hk-lmPlugins');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMPlugins && typeof window.LMPlugins.toggle === 'function') window.LMPlugins.toggle('plugins');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-lmLab': {
				get label() {
					return lmT('settings.hk-lmLab');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMLab && typeof window.LMLab.open === 'function') window.LMLab.open();
				},
				keyUp: null,
				type: 'normal'
			},
			/* HUD editor (ogario/modules/hudeditor.js): opens / closes the frames over the HUD boxes */
			'hk-hudEditor': {
				get label() {
					return lmT('settings.hk-hudEditor');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMHudEditor && typeof window.LMHudEditor.toggle === 'function') window.LMHudEditor.toggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-screenshotMode': {
				get label() {
					return lmT('settings.hk-screenshotMode');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.shotToggle();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-screenshotCapture': {
				get label() {
					return lmT('settings.hk-screenshotCapture');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.capture();
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-screenshotTool': {
				get label() {
					return lmT('settings.hk-screenshotTool');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.toggle('screenshot');
				},
				keyUp: null,
				type: 'normal'
			},
			'hk-skinCollections': {
				get label() {
					return lmT('settings.hk-skinCollections');
				},
				defaultKey: '',
				keyDown() {
					if (window.LMSmallTools) window.LMSmallTools.toggle('skins');
				},
				keyUp: null,
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
            /*
            'hk-multiboxback': {
                get label() { return lmT('settings.hk-multiboxback'); },
                defaultKey: '',
                keyDown() {
                    application && application.multiboxback();
                },
                keyUp: null,
                type: 'normal'
            },
            */	
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
                    /* the zoom the player saved as level 1 (Save the current zoom as zoom level 1), else the fixed one */
                    if (window.LMHudHelpers && window.LMHudHelpers.zoomRecall) window.LMHudHelpers.zoomRecall(1, 0.5);
                    else application && application.setZoom(0.5);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom2': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 2'; },
                defaultKey: 'ALT+2',
                keyDown() {
                    /* the zoom the player saved as level 2 (Save the current zoom as zoom level 2), else the fixed one */
                    if (window.LMHudHelpers && window.LMHudHelpers.zoomRecall) window.LMHudHelpers.zoomRecall(2, 0.25);
                    else application && application.setZoom(0.25);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom3': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 3'; },
                defaultKey: 'ALT+3',
                keyDown() {
                    /* the zoom the player saved as level 3 (Save the current zoom as zoom level 3), else the fixed one */
                    if (window.LMHudHelpers && window.LMHudHelpers.zoomRecall) window.LMHudHelpers.zoomRecall(3, 0.125);
                    else application && application.setZoom(0.125);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom4': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 4'; },
                defaultKey: 'ALT+4',
                keyDown() {
                    /* the zoom the player saved as level 4 (Save the current zoom as zoom level 4), else the fixed one */
                    if (window.LMHudHelpers && window.LMHudHelpers.zoomRecall) window.LMHudHelpers.zoomRecall(4, 0.075);
                    else application && application.setZoom(0.075);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoom5': {
                get label() { return lmT('settings.hk-zoomLevel') + ' 5'; },
                defaultKey: 'ALT+5',
                keyDown() {
                    /* the zoom the player saved as level 5 (Save the current zoom as zoom level 5), else the fixed one */
                    if (window.LMHudHelpers && window.LMHudHelpers.zoomRecall) window.LMHudHelpers.zoomRecall(5, 0.05);
                    else application && application.setZoom(0.05);
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
            'hk-zoomSave1': {
                get label() { return lmT('settings.hk-zoomSave1'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.zoomSave(1);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoomSave2': {
                get label() { return lmT('settings.hk-zoomSave2'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.zoomSave(2);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoomSave3': {
                get label() { return lmT('settings.hk-zoomSave3'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.zoomSave(3);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoomSave4': {
                get label() { return lmT('settings.hk-zoomSave4'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.zoomSave(4);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-zoomSave5': {
                get label() { return lmT('settings.hk-zoomSave5'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.zoomSave(5);
                },
                keyUp: null,
                type: 'normal'
            },
            'hk-cameraLock': {
                get label() { return lmT('settings.hk-cameraLock'); },
                defaultKey: '',
                keyDown() {
                    window.LMHudHelpers && window.LMHudHelpers.toggleCamLock();
                },
                keyUp: null,
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
            'hk-switchServerMode': {
                get label() { return lmT('settings.hk-switchServerMode'); },
                defaultKey: '-',
                keyDown() {
                    application && application.switchServerMode();
                },
                keyUp: null,
                type: 'normal'
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
            'hk-showQuest': {
                get label() { return lmT('settings.hk-showQuest'); },
                defaultKey: '',
                keyDown() {
                    application && application.setShowQuest();
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
            },	/*
            'hk-bots-ai': {
                get label() { return lmT('settings.hk-bots-ai'); },
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
        /* "Go to zoom bookmark 1-3" were the zoom level hotkeys 1-3 again: a mouse button, gamepad button,
         * radial menu or Command Centre star still naming them runs the zoom level (not listed: not
         * enumerable). Keyboard keys bound to them are moved in loadHotkeys (ogario.v4.js). */
        [1, 2, 3].forEach(function (n) {
            Object.defineProperty(hotkeysCommand, 'hk-zoomRecall' + n, { value: hotkeysCommand['hk-zoom' + n], enumerable: false, configurable: true });
        });
	
