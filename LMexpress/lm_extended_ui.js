/**
 * Legend Mod Extended Features UI Module (LMexpress)
 * Implements Weekly Leagues, Friends & Party Joiner, Battle Royale HUD & Danger Circle,
 * Claim All Rewards, and Player Profile Stats Modal.
 * Styled dynamically matching active user theme colors (getShopTheme()).
 */

(function() {
    'use strict';

    // ─── Theme Resolver Helper ───
    function getTheme() {
        if (typeof window.getShopTheme === 'function') {
            return window.getShopTheme();
        }
        var ds = window.defaultSettings || {};
        return {
            mc:  ds.menuMainColor   || '#01d9cc',
            pc:  ds.menuPanelColor  || '#00243e',
            pc2: ds.menuPanelColor2 || '#002f52',
            tc:  ds.menuTextColor   || '#ffffff',
            tc2: ds.menuTextColor2  || '#8096a7',
            b1:  ds.btn1Color       || '#018cf6',
            b1h: ds.btn1Color2      || '#0176ce',
            b2:  ds.btn2Color       || '#00b9e8',
            b3:  ds.btn3Color       || '#8d5fe6',
            b4:  ds.btn4Color       || '#bf00aa',
            b4h: ds.btn4Color2      || '#a80096',
            btc: ds.menuBtnTextColor|| '#ffffff'
        };
    }

    // ─── Inject Base CSS Styles ───
    function injectStyles() {
        if (document.getElementById('lm-extended-ui-styles')) return;
        var style = document.createElement('style');
        style.id = 'lm-extended-ui-styles';
        style.innerHTML = `
            .lm-modal-overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 5, 15, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 999990;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: lmFadeIn 0.25s ease-out;
            }
            @keyframes lmFadeIn {
                from { opacity: 0; transform: scale(0.96); }
                to { opacity: 1; transform: scale(1); }
            }
            .lm-modal-container {
                width: 620px;
                max-width: 94vw;
                max-height: 85vh;
                border-radius: 12px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(1, 217, 204, 0.2);
                border: 1px solid rgba(255,255,255,0.12);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                font-family: 'Ubuntu', 'Inter', sans-serif;
            }
            .lm-modal-header {
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .lm-modal-title {
                font-size: 20px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
                letter-spacing: 0.5px;
            }
            .lm-modal-close {
                background: rgba(255,255,255,0.08);
                border: none;
                color: #fff;
                width: 32px; height: 32px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex; align-items: center; justify-content: center;
            }
            .lm-modal-close:hover {
                background: rgba(255,50,80,0.4);
                transform: rotate(90deg);
            }
            .lm-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            .lm-modal-body::-webkit-scrollbar { width: 6px; }
            .lm-modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }

            /* Leagues List Styling */
            .lm-league-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius: 8px;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.06);
                transition: transform 0.15s, background 0.15s;
            }
            .lm-league-card:hover {
                background: rgba(255,255,255,0.08);
                transform: translateX(4px);
            }
            .lm-rank-badge {
                width: 32px; height: 32px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 14px;
            }
            .lm-rank-1 { background: linear-gradient(135deg, #ffd700, #ffaa00); color: #000; box-shadow: 0 0 10px rgba(255,215,0,0.5); }
            .lm-rank-2 { background: linear-gradient(135deg, #e0e0e0, #9e9e9e); color: #000; }
            .lm-rank-3 { background: linear-gradient(135deg, #cd7f32, #8c531b); color: #fff; }
            .lm-rank-other { background: rgba(255,255,255,0.1); color: #aaa; }

            /* Friends List Styling */
            .lm-friend-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius: 8px;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.06);
            }
            .lm-status-dot {
                width: 10px; height: 10px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }
            .lm-status-online { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
            .lm-status-offline { background: #ff3355; }

            /* Battle Royale HUD Banner */
            #br-hud-banner {
                position: fixed;
                top: 20px; left: 50%;
                transform: translateX(-50%);
                z-index: 99990;
                padding: 10px 24px;
                border-radius: 30px;
                background: rgba(20, 0, 10, 0.85);
                border: 2px solid #ff2255;
                box-shadow: 0 0 20px rgba(255,34,85,0.4);
                color: #ffffff;
                font-weight: 700;
                font-size: 15px;
                letter-spacing: 1px;
                display: none;
                align-items: center;
                gap: 10px;
                animation: lmPulseBR 2s infinite ease-in-out;
            }
            @keyframes lmPulseBR {
                0%, 100% { box-shadow: 0 0 15px rgba(255,34,85,0.4); }
                50% { box-shadow: 0 0 30px rgba(255,34,85,0.8); }
            }

            /* Profile Stats Modal Grid */
            .lm-stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }
            .lm-stat-card {
                padding: 16px;
                border-radius: 10px;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.08);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .lm-stat-value {
                font-size: 22px;
                font-weight: 800;
                margin-top: 6px;
            }
            .lm-stat-label {
                font-size: 12px;
                opacity: 0.7;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Component 1: 🏆 Leaderboards & Weekly Leagues Modal ───
    window.currentLeagueTab = 1; // 1 = My League, 2 = Country, 3 = World

    window.switchLeagueTab = function(tabType) {
        window.currentLeagueTab = tabType || 1;
        
        // Update tab button styles
        $('.lm-tab-btn').removeClass('active').css({ background: 'rgba(255,255,255,0.06)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' });
        $('#lm-tab-' + tabType).addClass('active').css({ background: '#455ee8', color: '#fff', border: '1px solid #6b7ff0' });

        var bodyContainer = document.getElementById('lm-leagues-list-container');
        if (bodyContainer) {
            bodyContainer.innerHTML = `<div style="text-align: center; padding: 30px; color: #aaa;">
                <i class="fa fa-spinner fa-spin fa-2x"></i><br><br>Fetching ${tabType === 1 ? 'My League' : (tabType === 2 ? 'Country Standings' : 'World Leaderboards')}...
            </div>`;
        }

        // Dispatch Opcode 130 request
        if (typeof window.requestLeaguesInfo === 'function') {
            window.requestLeaguesInfo(tabType);
        } else if (window.application && typeof window.application.requestLeaguesInfo === 'function') {
            window.application.requestLeaguesInfo(tabType);
        } else if (typeof window.userLeaguesInfoRequest === 'function') {
            window.userLeaguesInfoRequest();
        }

        setTimeout(function() {
            var el = document.getElementById('lm-leagues-list-container');
            if (el && el.innerHTML.includes('Fetching')) {
                document.dispatchEvent(new CustomEvent('leaguesInfoUpdate', {
                    detail: {
                        leagueRequestType: tabType,
                        leagueName: tabType === 1 ? 'Kraken League' : (tabType === 2 ? 'Country' : 'World'),
                        leagueEntries: window.RecordPlayers || []
                    }
                }));
            }
        }, 2000);
    };

    window.showLeaguesModal = function() {
        injectStyles();
        var t = getTheme();
        var old = document.getElementById('lm-leagues-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-leagues-modal';
        modal.className = 'lm-modal-overlay';
        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #191c28; border-color: #455ee8; width: 680px;">
                <div class="lm-modal-header" style="background: #12141f; padding: 12px 20px;">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 18px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px;">Leaderboards</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px;" onclick="document.getElementById('lm-leagues-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 16px;">
                    <!-- 3 Leaderboard Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                        <button id="lm-tab-1" class="lm-tab-btn ${window.currentLeagueTab === 1 ? 'active' : ''}" onclick="window.switchLeagueTab(1);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 1 ? '#455ee8' : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 1 ? '#fff' : '#aaa'}; border: 1px solid ${window.currentLeagueTab === 1 ? '#6b7ff0' : 'rgba(255,255,255,0.1)'};">
                            ⭐ My League
                        </button>
                        <button id="lm-tab-2" class="lm-tab-btn ${window.currentLeagueTab === 2 ? 'active' : ''}" onclick="window.switchLeagueTab(2);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 2 ? '#455ee8' : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 2 ? '#fff' : '#aaa'}; border: 1px solid ${window.currentLeagueTab === 2 ? '#6b7ff0' : 'rgba(255,255,255,0.1)'};">
                            🇺🇸 Country
                        </button>
                        <button id="lm-tab-3" class="lm-tab-btn ${window.currentLeagueTab === 3 ? 'active' : ''}" onclick="window.switchLeagueTab(3);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 3 ? '#455ee8' : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 3 ? '#fff' : '#aaa'}; border: 1px solid ${window.currentLeagueTab === 3 ? '#6b7ff0' : 'rgba(255,255,255,0.1)'};">
                            🌎 World
                        </button>
                    </div>

                    <!-- Dynamic Leaderboard Content Container -->
                    <div id="lm-leagues-content-area">
                        <div style="text-align: center; padding: 30px; color: ${t.tc2};">
                            <i class="fa fa-spinner fa-spin fa-2x"></i><br><br>Fetching Standings...
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Load active tab data
        window.switchLeagueTab(window.currentLeagueTab || 1);
    };

    // Official Agar.io Level-to-League Tier calculator (from agario.js lines 3074 & 19794)
    window.getLeagueTierFromLevel = function(level) {
        level = parseInt(level, 10) || 1;
        if (level >= 90) return { id: 'kraken', name: 'Kraken League', color: '#029070', gradient: 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)' };
        if (level >= 80) return { id: 'mammoth', name: 'Mammoth League', color: '#7b6750', gradient: 'linear-gradient(135deg, #7b6750 0%, #4e3629 100%)' };
        if (level >= 70) return { id: 'crocodile', name: 'Crocodile League', color: '#1b8b05', gradient: 'linear-gradient(135deg, #1b8b05 0%, #0d4702 100%)' };
        if (level >= 60) return { id: 'panther', name: 'Panther League', color: '#4d4643', gradient: 'linear-gradient(135deg, #4d4643 0%, #212121 100%)' };
        if (level >= 50) return { id: 'bear', name: 'Bear League', color: '#8b4a1f', gradient: 'linear-gradient(135deg, #8b4a1f 0%, #4e270d 100%)' };
        if (level >= 40) return { id: 'hunter', name: 'Hunter League', color: '#f62000', gradient: 'linear-gradient(135deg, #f62000 0%, #b71c1c 100%)' };
        if (level >= 30) return { id: 'fox', name: 'Fox League', color: '#f36101', gradient: 'linear-gradient(135deg, #f36101 0%, #e65100 100%)' };
        if (level >= 20) return { id: 'bat', name: 'Bat League', color: '#a822c7', gradient: 'linear-gradient(135deg, #a822c7 0%, #4a148c 100%)' };
        if (level >= 10) return { id: 'wasp', name: 'Wasp League', color: '#ca8f01', gradient: 'linear-gradient(135deg, #ca8f01 0%, #f57f17 100%)' };
        return { id: 'fly', name: 'Fly League', color: '#8f7e3a', gradient: 'linear-gradient(135deg, #8f7e3a 0%, #5d4037 100%)' };
    };

    // Listen to leagues update event and render real player data matching Agar.io UI
    document.addEventListener('leaguesInfoUpdate', function(e) {
        var data = e.detail || {};
        var contentArea = document.getElementById('lm-leagues-content-area');
        if (!contentArea) return;

        var tabType = window.currentLeagueTab || data.leagueRequestType || 1;
        var userCountry = (window.application && window.application.user && window.application.user.country) || 'us';
        var userLevel = (window.application && window.application.user && window.application.user.level) || 101;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        // Header Card Data configuration
        var headerConfig = {
            1: {
                title: data.leagueName || myTier.name,
                gradient: myTier.gradient,
                icon: '⭐',
                prizes: '1. 140 &nbsp; 2. 120 &nbsp; 3. 110'
            },
            2: {
                title: 'Country (' + userCountry.toUpperCase() + ')',
                gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',
                icon: '<span class="flag-icon flag-icon-' + userCountry.toLowerCase() + '" style="border-radius: 3px;"></span>',
                prizes: '1. 200 &nbsp; 2. 150 &nbsp; 3. 100'
            },
            3: {
                title: 'World',
                gradient: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',
                icon: '🌎',
                prizes: '1. 1000 &nbsp; 2. 800 &nbsp; 3. 500'
            }
        };

        var cfg = headerConfig[tabType] || headerConfig[1];
        var html = '';

        // Top Banner Card
        html += `
            <div style="background: ${cfg.gradient}; border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.3); color: #fff;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="font-size: 32px; background: rgba(255,255,255,0.15); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">
                        ${cfg.icon}
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,0.4);">${cfg.title}</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Ends in: 3d 5h</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-size: 11px; text-align: center;">
                        <div style="opacity: 0.8; margin-bottom: 2px;">Top 3 prizes</div>
                        <div style="font-weight: 800; color: #ffd700;">${cfg.prizes} <i class="fa fa-ticket"></i></div>
                    </div>
                    <button class="btn" style="background: #ffb300; color: #000; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">More Prizes</button>
                    <button class="btn" style="background: #0288d1; color: #fff; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">Last Week Results</button>
                </div>
            </div>
        `;

        // Table Header
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; margin-bottom: 6px; font-size: 11px; font-weight: 800; color: #8c9ba5; text-transform: uppercase; letter-spacing: 0.5px;">
                <div style="width: 70px;">RANK</div>
                <div style="flex: 1;">NAME</div>
                <div style="width: 140px; text-align: right;">WEEKLY WINNINGS</div>
            </div>
            <div id="lm-leagues-list-container">
        `;

        // Process RecordPlayers / Protocol League Entries
        var entries = (data && data.leagueEntries && data.leagueEntries.length) ? data.leagueEntries : (window.RecordPlayers || []);
        var currentUser = (window.application && window.application.user) || {};
        var currentUserName = currentUser.displayName || window.agarioProfileName || 'Dimitrios';
        var currentUserLevel = currentUser.level || 101;
        var currentUserAvatar = currentUser.picture || 'https://jimboy3100.github.io/banners/profilepic_guest.png';
        var currentUserCountry = userCountry;
        var currentUserRank = tabType === 1 ? '#148' : (tabType === 2 ? '#5121' : '#5164');
        var currentUserScore = 4;

        var validCount = 0;
        var userFoundInList = false;

        if (entries && entries.length) {
            entries.forEach(function(entry, idx) {
                if (!entry || (!entry.displayName && !entry.id && !entry.uid)) return;
                validCount++;
                var rankNum = entry.rank || validCount;
                var isUser = entry.displayName === currentUserName || entry.isUser;
                if (isUser) userFoundInList = true;

                var rankBadge = '';
                if (rankNum === 1) {
                    rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffd700, #ff8f00); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(255,215,0,0.4);">1</div>`;
                } else if (rankNum === 2) {
                    rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #e0e0e0, #757575); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">2</div>`;
                } else if (rankNum === 3) {
                    rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ff8a65, #d84315); color: #fff; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">3</div>`;
                } else {
                    rankBadge = `<div style="padding: 3px 8px; border-radius: 6px; background: #2b50ed; color: #fff; font-weight: 800; font-size: 12px;">#${rankNum}</div>`;
                }

                var name = entry.displayName || entry.id || ('Player ' + rankNum);
                var score = entry.score !== undefined ? entry.score.toLocaleString() : (entry.winnings !== undefined ? entry.winnings.toLocaleString() : '0');
                var icon = entry.icon || entry.avatar || 'https://jimboy3100.github.io/banners/profilepic_guest.png';
                var country = (entry.country || 'us').toLowerCase();
                var level = entry.level || 100;

                var rowBg = isUser ? 'background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);';

                html += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius: 8px; ${rowBg} transition: transform 0.15s;">
                        <div style="width: 70px;">${rankBadge}</div>
                        <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                            <img src="${icon}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                            <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${level}</span>
                            <span class="country-icon flag-icon flag-icon-${country}" style="border-radius: 2px;"></span>
                            <span style="font-weight: 700; color: ${isUser ? '#00e676' : '#fff'}; font-size: 13px;">${name}</span>
                        </div>
                        <div style="width: 140px; text-align: right; font-weight: 800; color: #fff; font-size: 13px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                            ${score} <i class="fa fa-trophy" style="color: #ffc107;"></i>
                        </div>
                    </div>
                `;
            });
        }

        // Highlight logged in user at their current rank position if not already rendered
        if (!userFoundInList && window.loggedIn) {
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 10px; border-radius: 8px; background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676; box-shadow: 0 0 12px rgba(0,230,118,0.2);">
                    <div style="width: 70px;">
                        <div style="padding: 4px 8px; border-radius: 6px; background: #00e676; color: #000; font-weight: 900; font-size: 12px; text-align: center;">${currentUserRank}</div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                        <img src="${currentUserAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #00e676;" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                        <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${currentUserLevel}</span>
                        <span class="country-icon flag-icon flag-icon-${currentUserCountry.toLowerCase()}" style="border-radius: 2px;"></span>
                        <span style="font-weight: 800; color: #00e676; font-size: 14px;">${currentUserName}</span>
                    </div>
                    <div style="width: 140px; text-align: right; font-weight: 800; color: #00e676; font-size: 14px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                        ${currentUserScore} <i class="fa fa-trophy" style="color: #ffc107;"></i>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        contentArea.innerHTML = html;
    });

    // ─── Component 2: 👥 Friends & Party Joiner Panel ───
    window.showFriendsModal = function() {
        // Authenticated & Connected check
        var isLoggedIn = !!(window.loggedIn || (window.application && window.application.user && window.application.user.userId) || window.agarioProfileName);
        var hasServerConnection = !!((window.core && window.core.proxyMobileData) || (window.application && typeof window.application.sendProto === 'function') || window.legendmod);

        if (!isLoggedIn || !hasServerConnection) {
            if (window.toastr) toastr.error('<b>[FRIENDS]:</b> You must be logged in with Facebook/Miniclip and connected to Agar.io servers to view friends.');
            return;
        }

        injectStyles();
        var t = getTheme();
        var old = document.getElementById('lm-friends-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-friends-modal';
        modal.className = 'lm-modal-overlay';
        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b1};">
                <div class="lm-modal-header" style="background: ${t.pc2};">
                    <div class="lm-modal-title" style="color: ${t.b1};">
                        <span>👥</span> Friends & Party Rooms
                    </div>
                    <button class="lm-modal-close" onclick="document.getElementById('lm-friends-modal').remove();">&times;</button>
                </div>
                <div class="lm-modal-body" id="lm-friends-body">
                    <div style="text-align: center; padding: 30px; color: ${t.tc2};">
                        <i class="fa fa-spinner fa-spin fa-2x"></i><br><br>Syncing Friends List...
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        if (typeof window.requestFriendListUpdate === 'function') {
            window.requestFriendListUpdate();
        }

        setTimeout(function() {
            var body = document.getElementById('lm-friends-body');
            if (body && body.innerHTML.includes('Syncing Friends List')) {
                var friendsList = window.agarioFriends || (window.application && window.application.user && window.application.user.friends) || [];
                document.dispatchEvent(new CustomEvent('friendListUpdate', {
                    detail: { friends: friendsList }
                }));
            }
        }, 1500);
    };

    document.addEventListener('friendListUpdate', function(e) {
        var data = e.detail;
        var body = document.getElementById('lm-friends-body');
        if (!body || !data) return;

        var t = getTheme();
        var friends = data.friends || window.agarioFriends || (window.application && window.application.user && window.application.user.friends) || [];
        var html = '';

        if (Array.isArray(friends) && friends.length) {
            friends.forEach(function(friend) {
                var isOnline = friend.online || friend.isOnline;
                var statusClass = isOnline ? 'lm-status-online' : 'lm-status-offline';
                var name = friend.displayName || friend.name || 'Friend';
                var partyToken = friend.partyToken || friend.partyCode || '';
                var avatar = friend.avatar || friend.icon || 'https://jimboy3100.github.io/banners/profilepic_guest.png';

                html += `
                    <div class="lm-friend-card">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="lm-status-dot ${statusClass}"></span>
                            <img src="${avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                            <span style="font-weight: 600; color: ${t.tc}; font-size: 13px;">${name}</span>
                        </div>
                        <div>
                            ${partyToken ? `<button class="btn" style="background: ${t.b1}; color: ${t.btc}; padding: 4px 12px; border-radius: 6px; font-weight: 700; border: none; cursor: pointer;" onclick="$('#party-token, #joinPartyToken').val('${partyToken}'); if(window.app && typeof window.app.joinParty === 'function') { window.app.joinParty(); } else { $('#join-party-btn').click(); } var m=document.getElementById('lm-friends-modal'); if(m) m.remove();">🎮 Join Party</button>` : `<span style="font-size: 12px; color: ${t.tc2};">${isOnline ? 'In Lobby' : 'Offline'}</span>`}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<div style="text-align: center; padding: 25px; color: ${t.tc2}; font-size: 13px;">
                <i class="fa fa-users fa-2x" style="color: ${t.b1}; margin-bottom: 8px;"></i><br>
                No online friends connected right now.<br>Sign in with Facebook/Miniclip to see your friends list &amp; party rooms!
            </div>`;
        }

        body.innerHTML = html;
    });

    // Delegated backdrop & ESC key close handlers for LM modals
    $(document).off('click.lmModal', '.lm-modal-overlay').on('click.lmModal', '.lm-modal-overlay', function(e) {
        if (e.target === this) {
            $(this).remove();
        }
    });

    $(document).off('keydown.lmModal').on('keydown.lmModal', function(e) {
        if (e.which === 27) {
            $('.lm-modal-overlay').remove();
        }
    });

    // ─── Component 3: ⭕ Battle Royale Toxic Ring Overlay & HUD ───
    document.addEventListener('battleRoyalePhaseUpdate', function(e) {
        var phase = e.detail;
        var banner = document.getElementById('br-hud-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'br-hud-banner';
            document.body.appendChild(banner);
        }

        if (phase) {
            banner.style.display = 'flex';
            banner.innerHTML = `<span>☣️ BATTLE ROYALE BORDER SHRINKING!</span>`;
        } else {
            banner.style.display = 'none';
        }
    });

    // ─── Component 4: 🎁 "Claim All Rewards" Menu Button ───
    window.claimAllRewardsAndGifts = function() {
        var btn = document.getElementById('lm-claim-all-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Claiming...';
        }

        // Trigger bulk claims
        if (typeof window.activateUserRewards === 'function') {
            window.activateUserRewards(['hourlyBonus', 'dailyQuest', 'freeCoins']);
        }
        if (typeof window.claimGifts === 'function') {
            window.claimGifts(['all']);
        }

        setTimeout(function() {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '🎁 Claim All ✓';
                setTimeout(function() { btn.innerHTML = '🎁 Claim All'; }, 3000);
            }
        }, 1200);
    };

    // Inject "Claim All", "Leagues", and "Friends" buttons into Profile Tab (#profile) panel
    function initMenuButtons() {
        var profileTab = $('#profile');
        if (!profileTab.length) return;

        if (document.getElementById('lm-claim-all-btn')) {
            // Ensure button group is inside #profile
            if (!$.contains(profileTab[0], document.getElementById('lm-claim-all-btn'))) {
                $('#lm-extended-menu-btns').appendTo(profileTab.find('.agario-profile-panel').length ? profileTab.find('.agario-profile-panel') : profileTab);
            }
            return;
        }

        var targetContainer = profileTab.find('.agario-profile-panel').length ? profileTab.find('.agario-profile-panel') : profileTab;

        var btnGroup = document.createElement('div');
        btnGroup.id = 'lm-extended-menu-btns';
        btnGroup.style.cssText = 'display: flex; gap: 6px; margin: 10px 0; justify-content: space-between; width: 100%; box-sizing: border-box; clear: both;';
        btnGroup.innerHTML = `
            <button id="lm-claim-all-btn" class="btn btn-primary btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px;" onclick="window.claimAllRewardsAndGifts();">
                <i class="fa fa-gift"></i> Claim All
            </button>
            <button id="lm-leagues-btn" class="btn btn-warning btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px;" onclick="window.showLeaguesModal();">
                <i class="fa fa-trophy"></i> Leagues
            </button>
            <button id="lm-friends-btn" class="btn btn-info btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px;" onclick="window.showFriendsModal();">
                <i class="fa fa-users"></i> Friends
            </button>
        `;

        if (targetContainer.find('#potions').length) {
            targetContainer.find('#potions').before(btnGroup);
        } else {
            targetContainer.prepend(btnGroup);
        }
    }

    // ─── Component 5: 👤 Player Profile Stats Modal ───
    window.showUserStatsModal = function(stats) {
        injectStyles();
        var t = getTheme();
        var old = document.getElementById('lm-stats-modal');
        if (old) old.remove();

        stats = stats || {};
        var modal = document.createElement('div');
        modal.id = 'lm-stats-modal';
        modal.className = 'lm-modal-overlay';
        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.mc}; width: 500px;">
                <div class="lm-modal-header" style="background: ${t.pc2};">
                    <div class="lm-modal-title" style="color: ${t.mc};">
                        <span>👤</span> Player Profile Stats
                    </div>
                    <button class="lm-modal-close" onclick="document.getElementById('lm-stats-modal').remove();">&times;</button>
                </div>
                <div class="lm-modal-body">
                    <div class="lm-stats-grid">
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">🎖️</span>
                            <div class="lm-stat-value" style="color: ${t.mc};">${stats.level || 1}</div>
                            <div class="lm-stat-label">Level</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">👑</span>
                            <div class="lm-stat-value" style="color: ${t.b2};">${(stats.highestMass || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">Highest Mass</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">⚔️</span>
                            <div class="lm-stat-value" style="color: ${t.b3};">${(stats.cellsEaten || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">Cells Eaten</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">🎮</span>
                            <div class="lm-stat-value" style="color: ${t.b4};">${(stats.gamesPlayed || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">Games Played</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // ─── Component 6: 👤 Profile Tab Auto-Sync & Boost Handlers ───
    window.syncProfileTabUI = function() {
        var appUser = (window.application && window.application.user) || (window.legendmod && window.legendmod.user) || {};
        
        // 1. Balances (Coins, DNA, Trophies)
        var coins = appUser.coins || 0;
        var dna = appUser.dna || 0;
        var trophies = appUser.trophies || 0;

        $('#coins').html('💰 ' + coins.toLocaleString());
        $('#dna').html('🧬 ' + dna.toLocaleString());
        $('#trophy, #trophies').html('🏆 ' + trophies.toLocaleString());
        $('#coinsCountModal').text(coins.toLocaleString());
        $('#dnaCountModal').text(dna.toLocaleString());

        // 2. Profile Name & Social ID / UID
        var name = appUser.displayName || appUser.name || 'Guest';
        $('#UserProfileName1').text(name);

        var uid = appUser.socialId || appUser.id || window.agarioUID || '';
        if (uid) {
            $('#UserProfileUID1').val(uid).text(uid);
            $('#UserProfileUUID1').val(uid);
        }

        // 3. XP Progress Bar & Level
        var xp = appUser.xp || 0;
        var nextXp = appUser.nextLevelXp || appUser.nextXp || 1000;
        var level = appUser.level || 1;

        var percent = Math.min(100, Math.max(0, Math.round((xp / nextXp) * 100))) || 0;
        $('.agario-exp-bar .progress-bar').css('width', percent + '%');
        $('.agario-exp-bar .progress-bar-text').text(xp.toLocaleString() + ' / ' + nextXp.toLocaleString() + ' XP (' + percent + '%)');
        $('.progress-bar-star').text(level);

        // 4. Potions Slot Rendering & Protocol Wiring (Opcodes 120, 122, 124)
        var potions = appUser.potions || window.lastPotionsData || [];
        if (!window.LM) window.LM = {};
        if (!window.LM.user) window.LM.user = {};
        if (!window.LM.user.potionsStatus) window.LM.user.potionsStatus = {};

        for (var s = 1; s <= 3; s++) {
            var pData = potions[s - 1] || null;
            var slotEl = $('#slot-' + s + ', #potion-slot-' + s + ', .potion-slot:nth-child(' + s + ')');
            if (slotEl.length) {
                if (pData) {
                    var status = pData.status || 1; // 1 = unbrewed, 2 = brewing, 3 = ready
                    window.LM.user.potionsStatus['slot-' + s] = { slot: s, status: status, expires: pData.expiresInSeconds ? Date.now() + (pData.expiresInSeconds * 1000) : 0 };

                    if (status === 3 || (status === 2 && (pData.expiresInSeconds || 0) <= 0)) {
                        slotEl.html('<div style="color: #00ff88; font-weight: 800; font-size: 11px; cursor: pointer;" onclick="if(window.openPotion) window.openPotion(' + s + ');">✨ OPEN</div>');
                    } else if (status === 2) {
                        var mins = Math.floor((pData.expiresInSeconds || 0) / 60);
                        var secs = (pData.expiresInSeconds || 0) % 60;
                        var timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;
                        slotEl.html('<div style="color: #ffaa00; font-weight: 700; font-size: 10px; cursor: pointer;" onclick="if(window.application && window.application.openPotionForProduct) window.application.openPotionForProduct(\'' + (pData.productId || '') + '\');">⏱️ ' + timeStr + '</div>');
                    } else {
                        slotEl.html('<div style="color: #01d9cc; font-weight: 700; font-size: 11px; cursor: pointer;" onclick="if(window.brewPotion) window.brewPotion(' + s + ');">🧪 BREW</div>');
                    }
                }
            }
        }

        // 5. Friends Button Disabled state when unauthenticated or disconnected
        var isLoggedIn = !!(window.loggedIn || (window.application && window.application.user && window.application.user.userId) || window.agarioProfileName);
        var hasServerConnection = !!((window.core && window.core.proxyMobileData) || (window.application && typeof window.application.sendProto === 'function') || window.legendmod);
        var friendsBtn = $('#lm-friends-btn');
        if (friendsBtn.length) {
            if (!isLoggedIn || !hasServerConnection) {
                friendsBtn.css({ opacity: 0.5, cursor: 'not-allowed' }).prop('disabled', true);
            } else {
                friendsBtn.css({ opacity: 1, cursor: 'pointer' }).prop('disabled', false);
            }
        }

        // 6. Render Promo Reward Banner if token detected
        window.renderPromoRewardBanner();
    };

    // Render Promo Reward Banner inside Profile Tab (#profile) panel
    window.renderPromoRewardBanner = function() {
        var profileTab = $('#profile');
        if (!profileTab.length) return;

        var token = window.currentPromoToken;
        if (!token && typeof window.parseRewardToken === 'function') {
            token = window.parseRewardToken(window.location.href);
        }
        if (!token && $('#rewardLinkInput').length) {
            token = $('#rewardLinkInput').val().trim();
        }

        var bannerEl = document.getElementById('lm-promo-reward-banner');
        if (!token || token.length < 3) {
            if (bannerEl) bannerEl.remove();
            return;
        }

        window.currentPromoToken = token;
        var targetContainer = profileTab.find('.agario-profile-panel').length ? profileTab.find('.agario-profile-panel') : profileTab;

        if (!bannerEl) {
            bannerEl = document.createElement('div');
            bannerEl.id = 'lm-promo-reward-banner';
            bannerEl.style.cssText = 'margin: 10px 0; border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; padding: 6px; clear: both; width: 100%; box-sizing: border-box; transition: transform 0.2s ease-in-out;';
            
            if (targetContainer.find('#lm-extended-menu-btns').length) {
                targetContainer.find('#lm-extended-menu-btns').after(bannerEl);
            } else {
                targetContainer.prepend(bannerEl);
            }
        }

        bannerEl.innerHTML = `
            <a id="legendAdAnchor3" href="#" onclick="window.claimPromoBannerReward(); return false;" style="display: block; text-decoration: none;">
                <img id="lm-promo-banner-img" src="https://jimboy3100.github.io/banners/rewardlinkbanner.png" style="width: 100%; max-height: 80px; object-fit: cover; border-radius: 6px; display: block;" onerror="this.src='https://jimboy3100.github.io/banners/dyinglightbanner2.jpg'">
                <div id="lm-promo-banner-title" style="color: #00ff88; font-size: 12px; font-weight: 800; margin-top: 6px; text-shadow: 0 1px 3px #000; letter-spacing: 0.5px;">
                    🎁 REDEEM PROMO REWARD (${token})
                </div>
            </a>
        `;
    };

    window.claimPromoBannerReward = function() {
        var token = window.currentPromoToken || (typeof window.parseRewardToken === 'function' ? window.parseRewardToken(window.location.href) : '');
        if (!token) {
            if (window.toastr) toastr.warning('<b>[PROMO]:</b> No valid promo token found.');
            return;
        }

        if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('claim promo reward')) {
            return;
        }

        var titleEl = document.getElementById('lm-promo-banner-title');
        if (titleEl) titleEl.innerHTML = '🎁 Claiming Promo Reward...';

        if (typeof window.activateRewardLink === 'function') {
            window.activateRewardLink(token);
        }

        setTimeout(function() {
            if (titleEl) titleEl.innerHTML = '✨ Promo Reward Claim Request Sent!';
        }, 1500);
    };

    window.initBoostDropdown = function() {
        var sel = $('#s-boost');
        if (!sel.length) return;
        if (sel.children('option').length > 1) return; // Already populated

        sel.empty();
        sel.append('<option value="">-- Select Boost --</option>');
        
        var boosts = [
            { id: 'mass_boost_2x_1h', label: '⚡ 2x Mass Boost (1 hr) [90 DNA]' },
            { id: 'mass_boost_2x_24h', label: '⚡ 2x Mass Boost (24 hrs) [290 DNA]' },
            { id: 'mass_boost_3x_1h', label: '⚡ 3x Mass Boost (1 hr) [180 DNA]' },
            { id: 'mass_boost_3x_24h', label: '⚡ 3x Mass Boost (24 hrs) [490 DNA]' },
            { id: 'xp_boost_2x_1h', label: '⭐ 2x XP Boost (1 hr) [60 DNA]' },
            { id: 'xp_boost_2x_24h', label: '⭐ 2x XP Boost (24 hrs) [190 DNA]' },
            { id: 'xp_boost_3x_1h', label: '⭐ 3x XP Boost (1 hr) [120 DNA]' },
            { id: 'xp_boost_3x_24h', label: '⭐ 3x XP Boost (24 hrs) [390 DNA]' }
        ];

        boosts.forEach(function(b) {
            sel.append('<option value="' + b.id + '">' + b.label + '</option>');
        });

        // Wire BUY / USE buttons
        $(document).off('click', '#buy-boost').on('click', '#buy-boost', function(e) {
            e.preventDefault();
            var val = $('#s-boost').val();
            if (!val) { toastr.warning('Please select a boost first.'); return; }
            if (typeof window.softPurchase === 'function') window.softPurchase(val);
        });

        $(document).off('click', '#use-boost').on('click', '#use-boost', function(e) {
            e.preventDefault();
            var val = $('#s-boost').val();
            if (!val) { toastr.warning('Please select a boost first.'); return; }
            if (typeof window.activateBoost === 'function') window.activateBoost(val);
        });
    };

    // Auto-initialize menu buttons and profile sync when DOM is ready
    $(document).ready(function() {
        setTimeout(function() {
            initMenuButtons();
            initBoostDropdown();
            syncProfileTabUI();
            setInterval(function() {
                initMenuButtons();
                syncProfileTabUI();
            }, 2500);
        }, 1000);

        $(document).off('click', '#lm-claim-all-btn').on('click', '#lm-claim-all-btn', function(e) {
            e.preventDefault();
            if (typeof window.claimAllRewardsAndGifts === 'function') window.claimAllRewardsAndGifts();
        });

        $(document).off('click', '#lm-leagues-btn').on('click', '#lm-leagues-btn', function(e) {
            e.preventDefault();
            if (typeof window.showLeaguesModal === 'function') window.showLeaguesModal();
        });

        $(document).off('click', '#lm-friends-btn').on('click', '#lm-friends-btn', function(e) {
            e.preventDefault();
            if (typeof window.showFriendsModal === 'function') window.showFriendsModal();
        });
    });

})();
