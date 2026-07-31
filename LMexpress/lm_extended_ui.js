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

    window.renderLeaguesContent = function(tabType, data) {
        data = data || {};
        var contentArea = document.getElementById('lm-leagues-content-area');
        if (!contentArea) return;

        var t = getTheme();
        tabType = tabType || window.currentLeagueTab || 1;
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
                    <button class="btn" onclick="window.showMorePrizesModal(${tabType});" style="background: ${t.b2}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">More Prizes</button>
                    <button class="btn" onclick="window.showLastWeekResultsModal(${tabType});" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">Last Week Results</button>
                </div>
            </div>
        `;

        // Table Header
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; margin-bottom: 6px; font-size: 11px; font-weight: 800; color: ${t.tc2}; text-transform: uppercase; letter-spacing: 0.5px;">
                <div style="width: 70px;">RANK</div>
                <div style="flex: 1;">NAME</div>
                <div style="width: 140px; text-align: right;">WEEKLY WINNINGS</div>
            </div>
            <div id="lm-leagues-list-container">
        `;

        // Process RecordPlayers / Protocol League Entries or Default Category Standings
        var defaultTabEntries = {
            1: [ // My League (Kraken League Top 10)
                { rank: 1, displayName: '⚡ Apex Predator', level: 100, country: 'us', score: 1420, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 2, displayName: '🔥 KrakenMaster', level: 98, country: 'us', score: 1180, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 3, displayName: '☠️ Viper_Solo', level: 96, country: 'us', score: 950, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 4, displayName: '🛡️ ShadowHunter', level: 95, country: 'us', score: 820, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 5, displayName: '👑 LegendMod_Pro', level: 94, country: 'us', score: 710, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 6, displayName: '👻 Ghost_Rider', level: 93, country: 'us', score: 650, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 7, displayName: '❄️ FrostBite', level: 92, country: 'us', score: 580, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 8, displayName: '⚡ Storm_Rage', level: 91, country: 'us', score: 510, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 9, displayName: '🔮 Phantom_X', level: 90, country: 'us', score: 440, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 10, displayName: '💥 Blaze_It', level: 90, country: 'us', score: 390, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
            ],
            2: [ // Country League (US Standings Top 10)
                { rank: 1, displayName: '🦅 USA_Master', level: 100, country: 'us', score: 2450, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 2, displayName: '🎯 EagleEye_US', level: 99, country: 'us', score: 2100, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 3, displayName: '🗽 Liberty_King', level: 97, country: 'us', score: 1890, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 4, displayName: '⭐️ Patriot_Solo', level: 96, country: 'us', score: 1650, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 5, displayName: '🎆 StarsStripes', level: 95, country: 'us', score: 1400, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 6, displayName: '🛩️ Maverick_99', level: 93, country: 'us', score: 1220, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 7, displayName: '🤠 Ranger_Danger', level: 92, country: 'us', score: 1050, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 8, displayName: '⚖️ Justice_US', level: 91, country: 'us', score: 910, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 9, displayName: '🏆 Victory_Wave', level: 90, country: 'us', score: 820, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 10, displayName: '🗽 Freedom_Fighter', level: 90, country: 'us', score: 730, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
            ],
            3: [ // World League (Global Top 10)
                { rank: 1, displayName: '🇧🇷 SoloKing_BR', level: 100, country: 'br', score: 5800, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 2, displayName: '🇯🇵 Sakura_JP', level: 100, country: 'jp', score: 5100, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 3, displayName: '🇩🇪 Jaeger_DE', level: 99, country: 'de', score: 4600, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 4, displayName: '🇫🇷 LePrince_FR', level: 98, country: 'fr', score: 4150, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 5, displayName: '🇹🇷 Sultan_TR', level: 97, country: 'tr', score: 3800, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 6, displayName: '🇰🇷 Alpha_KR', level: 96, country: 'kr', score: 3500, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 7, displayName: '🇪🇸 Matador_ES', level: 95, country: 'es', score: 3200, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 8, displayName: '🇬🇧 Crown_UK', level: 94, country: 'gb', score: 2950, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 9, displayName: '🇷🇺 Legend_RU', level: 93, country: 'ru', score: 2700, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                { rank: 10, displayName: '🇨🇦 Polaris_CA', level: 92, country: 'ca', score: 2480, icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
            ]
        };

        var entries = (data && data.leagueEntries && data.leagueEntries.length) ? data.leagueEntries : (window.RecordPlayers && window.RecordPlayers.length ? window.RecordPlayers : (defaultTabEntries[tabType] || defaultTabEntries[1]));
        var currentUser = (window.application && window.application.user) || {};
        var currentUserName = currentUser.displayName || window.agarioProfileName || 'Dimitrios';
        var currentUserLevel = currentUser.level || userLevel;
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
                    rankBadge = `<div style="padding: 3px 8px; border-radius: 6px; background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 12px;">#${rankNum}</div>`;
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
                            <span style="font-weight: 700; color: ${isUser ? '#00e676' : t.tc}; font-size: 13px;">${name}</span>
                        </div>
                        <div style="width: 140px; text-align: right; font-weight: 800; color: ${t.tc}; font-size: 13px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                            ${score} <i class="fa fa-trophy" style="color: ${t.mc};"></i>
                        </div>
                    </div>
                `;
            });
        }

        // Highlight logged in user at their current rank position
        if (!userFoundInList) {
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
                        ${currentUserScore} <i class="fa fa-trophy" style="color: ${t.mc};"></i>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        contentArea.innerHTML = html;
    };

    window.switchLeagueTab = function(tabType) {
        window.currentLeagueTab = tabType || 1;
        var t = getTheme();

        // Update tab button styles
        $('.lm-tab-btn').removeClass('active').css({ background: 'rgba(255,255,255,0.06)', color: t.tc2, border: '1px solid rgba(255,255,255,0.1)' });
        $('#lm-tab-' + tabType).addClass('active').css({ background: t.b1, color: t.btc, border: '1px solid ' + t.mc });

        // Immediately render content area with current tab configuration & cached response
        window.renderLeaguesContent(tabType, window.lastLeaguesResponse || {});

        // Dispatch Opcode 130 request in background
        if (typeof window.requestLeaguesInfo === 'function') {
            window.requestLeaguesInfo(tabType);
        } else if (window.application && typeof window.application.requestLeaguesInfo === 'function') {
            window.application.requestLeaguesInfo(tabType);
        } else if (typeof window.userLeaguesInfoRequest === 'function') {
            window.userLeaguesInfoRequest();
        }
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
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.mc}; width: 680px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 18px; font-weight: 800; color: ${t.mc}; text-transform: uppercase; letter-spacing: 1px;">Leaderboards</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px;" onclick="document.getElementById('lm-leagues-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 16px;">
                    <!-- 3 Leaderboard Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                        <button id="lm-tab-1" class="lm-tab-btn ${window.currentLeagueTab === 1 ? 'active' : ''}" onclick="window.switchLeagueTab(1);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 1 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 1 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 1 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            ⭐ My League
                        </button>
                        <button id="lm-tab-2" class="lm-tab-btn ${window.currentLeagueTab === 2 ? 'active' : ''}" onclick="window.switchLeagueTab(2);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 2 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 2 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 2 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🇺🇸 Country
                        </button>
                        <button id="lm-tab-3" class="lm-tab-btn ${window.currentLeagueTab === 3 ? 'active' : ''}" onclick="window.switchLeagueTab(3);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; background: ${window.currentLeagueTab === 3 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 3 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 3 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🌎 World
                        </button>
                    </div>

                    <!-- Dynamic Leaderboard Content Container -->
                    <div id="lm-leagues-content-area"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Load active tab data immediately
        window.switchLeagueTab(window.currentLeagueTab || 1);
    };

    // Listen to leagues update event and render real player data matching Agar.io UI
    document.addEventListener('leaguesInfoUpdate', function(e) {
        window.renderLeaguesContent(window.currentLeagueTab || 1, e.detail || {});
    });

    window.showMorePrizesModal = function(tabType) {
        injectStyles();
        var t = getTheme();
        var currentTab = tabType || window.currentLeagueTab || 1;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        var prizeData = {
            1: {
                title: (myTier && myTier.name ? myTier.name : 'Kraken League') + ' - Prizes Breakdown',
                gradient: myTier ? myTier.gradient : 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)',
                tiers: [
                    { rank: '🥇 Rank 1', prize: '140 🎫 Potions & 2,500 Coins', bonus: 'Golden Box + 2x XP Boost' },
                    { rank: '🥈 Rank 2', prize: '120 🎫 Potions & 1,800 Coins', bonus: 'Silver Box' },
                    { rank: '🥉 Rank 3', prize: '110 🎫 Potions & 1,200 Coins', bonus: 'Bronze Box' },
                    { rank: '🏅 Rank 4 - 10', prize: '80 🎫 Potions & 800 Coins', bonus: 'Mass Boost (1h)' },
                    { rank: '🏅 Rank 11 - 20', prize: '50 🎫 Potions & 500 Coins', bonus: 'Mystery Potion' },
                    { rank: '🏅 Rank 21 - 50', prize: '30 🎫 Potions & 300 Coins', bonus: '100 DNA' },
                    { rank: '🏅 Rank 51 - 100', prize: '15 🎫 Potions & 150 Coins', bonus: '50 DNA' }
                ]
            },
            2: {
                title: 'Country League (' + userCountry.toUpperCase() + ') - Prizes Breakdown',
                gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',
                tiers: [
                    { rank: '🥇 Rank 1', prize: '200 🎫 Potions & 5,000 Coins', bonus: 'Golden Country Box + Flag Skin' },
                    { rank: '🥈 Rank 2', prize: '150 🎫 Potions & 3,500 Coins', bonus: 'Silver Box' },
                    { rank: '🥉 Rank 3', prize: '100 🎫 Potions & 2,500 Coins', bonus: 'Bronze Box' },
                    { rank: '🏅 Rank 4 - 10', prize: '75 🎫 Potions & 1,500 Coins', bonus: '2x XP Boost (24h)' },
                    { rank: '🏅 Rank 11 - 20', prize: '50 🎫 Potions & 1,000 Coins', bonus: '200 DNA' },
                    { rank: '🏅 Rank 21 - 50', prize: '30 🎫 Potions & 600 Coins', bonus: '100 DNA' },
                    { rank: '🏅 Rank 51 - 100', prize: '20 🎫 Potions & 300 Coins', bonus: '50 DNA' }
                ]
            },
            3: {
                title: 'World League - Prizes Breakdown',
                gradient: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',
                tiers: [
                    { rank: '🥇 Rank 1', prize: '1,000 🎫 Potions & 15,000 Coins', bonus: 'Diamond World Box + Exclusive World Crown' },
                    { rank: '🥈 Rank 2', prize: '800 🎫 Potions & 10,000 Coins', bonus: 'Platinum Box' },
                    { rank: '🥉 Rank 3', prize: '500 🎫 Potions & 7,500 Coins', bonus: 'Gold Box' },
                    { rank: '🏅 Rank 4 - 10', prize: '300 🎫 Potions & 5,000 Coins', bonus: '3x Mass Boost (24h)' },
                    { rank: '🏅 Rank 11 - 20', prize: '200 🎫 Potions & 3,000 Coins', bonus: '500 DNA' },
                    { rank: '🏅 Rank 21 - 50', prize: '100 🎫 Potions & 1,500 Coins', bonus: '250 DNA' },
                    { rank: '🏅 Rank 51 - 100', prize: '50 🎫 Potions & 800 Coins', bonus: '100 DNA' }
                ]
            }
        };

        var cfg = prizeData[currentTab] || prizeData[1];
        var old = document.getElementById('lm-prizes-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-prizes-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var rowsHtml = '';
        cfg.tiers.forEach(function(row) {
            rowsHtml += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-bottom: 6px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-weight: 800; font-size: 13px; color: ${t.mc}; min-width: 140px;">${row.rank}</div>
                    <div style="flex: 1; font-weight: 700; font-size: 13px; color: ${t.tc}; text-align: center;">${row.prize}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #ffd700; background: rgba(255,215,0,0.1); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,215,0,0.2); min-width: 160px; text-align: right;">${row.bonus}</div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b2}; width: 620px;">
                <div class="lm-modal-header" style="background: ${cfg.gradient}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${cfg.title}</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: #fff;" onclick="document.getElementById('lm-prizes-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 16px; max-height: 420px; overflow-y: auto;">
                    <div style="font-size: 12px; color: ${t.tc2}; margin-bottom: 12px; text-align: center; font-weight: 600;">
                        🎁 Finish in these rank positions at the end of the week to claim these rewards!
                    </div>
                    ${rowsHtml}
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-prizes-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
    };

    window.showLastWeekResultsModal = function(tabType) {
        injectStyles();
        var t = getTheme();
        var currentTab = tabType || window.currentLeagueTab || 1;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        var lastWeekData = {
            1: {
                title: 'Last Week Results - ' + (myTier && myTier.name ? myTier.name : 'Kraken League'),
                gradient: myTier ? myTier.gradient : 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)',
                winners: [
                    { rank: 1, name: '⚡ Apex Predator', score: '18,450', prize: '140 🎫 Potions + 2,500 💰', level: 100, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 2, name: '🔥 KrakenMaster', score: '15,200', prize: '120 🎫 Potions + 1,800 💰', level: 98, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 3, name: '☠️ Viper_Solo', score: '12,900', prize: '110 🎫 Potions + 1,200 💰', level: 96, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 4, name: '🛡️ ShadowHunter', score: '10,800', prize: '80 🎫 Potions', level: 95, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 5, name: '👑 LegendMod_Pro', score: '9,400', prize: '80 🎫 Potions', level: 94, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
                ],
                userResult: { rank: '#94', name: window.agarioProfileName || 'Dimitrios', score: '3,850', prize: '15 🎫 Potions', level: userLevel, country: userCountry }
            },
            2: {
                title: 'Last Week Results - Country League (' + userCountry.toUpperCase() + ')',
                gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',
                winners: [
                    { rank: 1, name: '🦅 USA_Master', score: '34,200', prize: '200 🎫 Potions + 5,000 💰', level: 100, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 2, name: '🎯 EagleEye_US', score: '28,900', prize: '150 🎫 Potions + 3,500 💰', level: 99, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 3, name: '🗽 Liberty_King', score: '24,500', prize: '100 🎫 Potions + 2,500 💰', level: 97, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 4, name: '⭐️ Patriot_Solo', score: '21,100', prize: '75 🎫 Potions', level: 96, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 5, name: '🎆 StarsStripes', score: '18,600', prize: '75 🎫 Potions', level: 95, country: 'us', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
                ],
                userResult: { rank: '#2,410', name: window.agarioProfileName || 'Dimitrios', score: '5,120', prize: '20 🎫 Potions', level: userLevel, country: userCountry }
            },
            3: {
                title: 'Last Week Results - World League',
                gradient: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',
                winners: [
                    { rank: 1, name: '🇧🇷 SoloKing_BR', score: '89,400', prize: '1,000 🎫 Potions + 15,000 💰', level: 100, country: 'br', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 2, name: '🇯🇵 Sakura_JP', score: '76,100', prize: '800 🎫 Potions + 10,000 💰', level: 100, country: 'jp', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 3, name: '🇩🇪 Jaeger_DE', score: '68,500', prize: '500 🎫 Potions + 7,500 💰', level: 99, country: 'de', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 4, name: '🇫🇷 LePrince_FR', score: '59,200', prize: '300 🎫 Potions', level: 98, country: 'fr', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' },
                    { rank: 5, name: '🇹🇷 Sultan_TR', score: '52,800', prize: '300 🎫 Potions', level: 97, country: 'tr', icon: 'https://jimboy3100.github.io/banners/profilepic_guest.png' }
                ],
                userResult: { rank: '#3,180', name: window.agarioProfileName || 'Dimitrios', score: '5,120', prize: '50 🎫 Potions', level: userLevel, country: userCountry }
            }
        };

        var cfg = lastWeekData[currentTab] || lastWeekData[1];
        var old = document.getElementById('lm-lastweek-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-lastweek-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var rowsHtml = '';
        cfg.winners.forEach(function(player) {
            var rankBadge = '';
            if (player.rank === 1) {
                rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffd700, #ff8f00); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(255,215,0,0.4);">1</div>`;
            } else if (player.rank === 2) {
                rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #e0e0e0, #757575); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">2</div>`;
            } else if (player.rank === 3) {
                rankBadge = `<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ff8a65, #d84315); color: #fff; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">3</div>`;
            } else {
                rankBadge = `<div style="padding: 3px 8px; border-radius: 6px; background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 12px;">#${player.rank}</div>`;
            }

            rowsHtml += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
                    <div style="width: 60px;">${rankBadge}</div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                        <img src="${player.icon}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                        <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">${player.level}</span>
                        <span class="country-icon flag-icon flag-icon-${player.country.toLowerCase()}" style="border-radius: 2px;"></span>
                        <span style="font-weight: 700; color: ${t.tc}; font-size: 13px;">${player.name}</span>
                    </div>
                    <div style="width: 130px; text-align: right; font-weight: 800; color: #ffd700; font-size: 12px;">
                        ${player.score} 🏆
                    </div>
                    <div style="width: 170px; text-align: right; font-weight: 700; color: ${t.mc}; font-size: 11px;">
                        🎁 ${player.prize}
                    </div>
                </div>
            `;
        });

        var userRow = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 10px; border-radius: 8px; background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676; box-shadow: 0 0 12px rgba(0,230,118,0.2);">
                <div style="width: 60px;">
                    <div style="padding: 3px 6px; border-radius: 6px; background: #00e676; color: #000; font-weight: 900; font-size: 12px; text-align: center;">${cfg.userResult.rank}</div>
                </div>
                <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">${cfg.userResult.level}</span>
                    <span class="country-icon flag-icon flag-icon-${cfg.userResult.country.toLowerCase()}" style="border-radius: 2px;"></span>
                    <span style="font-weight: 800; color: #00e676; font-size: 13px;">${cfg.userResult.name} (Your Rank)</span>
                </div>
                <div style="width: 130px; text-align: right; font-weight: 800; color: #00e676; font-size: 12px;">
                    ${cfg.userResult.score} 🏆
                </div>
                <div style="width: 170px; text-align: right; font-weight: 700; color: #00e676; font-size: 11px;">
                    🎁 ${cfg.userResult.prize}
                </div>
            </div>
        `;

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b1}; width: 660px;">
                <div class="lm-modal-header" style="background: ${cfg.gradient}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${cfg.title}</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: #fff;" onclick="document.getElementById('lm-lastweek-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 16px; max-height: 420px; overflow-y: auto;">
                    <div style="font-size: 12px; color: ${t.tc2}; margin-bottom: 12px; text-align: center; font-weight: 600;">
                        🏆 Previous week final standings and awarded prizes
                    </div>
                    ${rowsHtml}
                    ${userRow}
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-lastweek-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.showPotionsHelpModal = function(activeTabName) {
        injectStyles();
        var t = getTheme();
        var currentTab = activeTabName || 'rewards';

        var old = document.getElementById('lm-potions-help-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna) || window.userDna || 1033;
        var coinsBalance = (window.application && window.application.user && window.application.user.coins) || window.userCoins || 28490;

        var modal = document.createElement('div');
        modal.id = 'lm-potions-help-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var buildBodyContent = function(tab) {
            if (tab === 'howto') {
                return `
                    <div style="display: flex; gap: 16px; padding: 10px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: ${t.mc}; margin-bottom: 12px;">🏆 Get on the leaderboard to win Mystery Potions</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.8;">
                                <div><b>Classic / FFA:</b> Stay in top 10 for 100 seconds</div>
                                <div><b>Teams:</b> Survive 4 minutes</div>
                                <div><b>Battle Royale / Rush:</b> Finish in top half</div>
                            </div>
                            <div style="margin-top: 14px; font-size: 11px; color: #ffd700; font-weight: 700; background: rgba(255,215,0,0.1); padding: 8px; border-radius: 6px;">
                                💡 Rank higher to win rarer potions with better rewards!
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 14px; color: ${t.mc}; margin-bottom: 12px;">🛍️ Buy Premium Potions</div>
                                <div style="font-size: 12px; color: ${t.tc2}; margin-bottom: 16px;">
                                    Premium Potions open immediately without brewing! Get them directly in the shop.
                                </div>
                            </div>
                            <button class="btn" onclick="document.getElementById('lm-potions-help-modal').remove(); if(window.openShop) window.openShop('potions');" style="background: ${t.b2}; color: ${t.btc}; font-weight: 800; padding: 10px; border-radius: 8px; border: none; cursor: pointer;">
                                Open Shop
                            </button>
                        </div>
                    </div>
                `;
            } else if (tab === 'mystery') {
                return `
                    <div style="display: flex; gap: 16px; padding: 10px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: #00e676; margin-bottom: 8px;">🔓 Unlock Skins</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.6;">
                                Collect skin pieces from potions to unlock exclusive Mystery Skins!
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: #ffd700; margin-bottom: 8px;">⭐ Upgrade Skins</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.6;">
                                Keep collecting skin pieces to level up your skin and make it look even cooler!
                            </div>
                            <div style="margin-top: 10px; font-size: 11px; color: #00d3ff; font-weight: 700;">
                                ✨ Upgraded skins have special animations!
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div style="text-align: center; font-size: 13px; font-weight: 700; color: ${t.tc2}; margin-bottom: 14px;">
                        Each potion has amazing rewards inside! Brew the potions to open them!
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 14px; font-size: 11px; font-weight: 800; color: ${t.tc2}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        <div style="width: 110px;">POTIONS</div>
                        <div style="width: 170px; text-align: center;">SKIN PIECES</div>
                        <div style="width: 90px; text-align: center;">COINS</div>
                        <div style="width: 90px; text-align: center;">TROPHIES</div>
                        <div style="width: 80px; text-align: right;"></div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #4caf50; font-size: 13px;">
                                🧪 Common
                            </div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">
                                <span style="display: inline-block; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #00d3ff; vertical-align: middle; margin-right: 4px;"></span> x1
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                💰 +Coins
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                🏆 x1
                            </div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                and more!
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #2196f3; font-size: 13px;">
                                🧪 Rare
                            </div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">
                                <span style="display: inline-block; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #2196f3; vertical-align: middle; margin-right: 4px;"></span> x3
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                💰 ++Coins
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                🏆 x2
                            </div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                and more!
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #e91e63; font-size: 13px;">
                                🧪 Exotic
                            </div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 11px;">
                                x4 <span style="font-size: 10px; color: #ff4081;">(At least x1 Special)</span>
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                💰 +++Coins
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                🏆 x3
                            </div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                and more!
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #ffb300; font-size: 13px;">
                                🧪 Mystical
                            </div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 11px;">
                                x6 <span style="font-size: 10px; color: #ffd700;">(At least x3 Special)</span>
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                💰 ++++Coins
                            </div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                🏆 x3
                            </div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                and more!
                            </div>
                        </div>
                    </div>
                `;
            }
        };

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b2}; width: 640px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 18px; font-weight: 900; color: ${t.mc}; text-transform: uppercase; letter-spacing: 1px;">Help</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(0,211,255,0.15); border: 1px solid #00d3ff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; color: #00d3ff;">
                            🧬 ${dnaBalance.toLocaleString()}
                        </div>
                        <div style="background: rgba(255,215,0,0.15); border: 1px solid #ffd700; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; color: #ffd700;">
                            💰 ${coinsBalance.toLocaleString()}
                        </div>
                        <button class="lm-modal-close" onclick="document.getElementById('lm-potions-help-modal').remove();">&times;</button>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; padding: 12px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05); justify-content: center;">
                    <button id="lm-tab-howto" class="btn" style="flex: 1; padding: 8px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='howto'?t.b2:'transparent'}; color: ${currentTab==='howto'?t.btc:t.tc};">How to get potions</button>
                    <button id="lm-tab-rewards" class="btn" style="flex: 1; padding: 8px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='rewards'?t.b2:'transparent'}; color: ${currentTab==='rewards'?t.btc:t.tc};">Rewards</button>
                    <button id="lm-tab-mystery" class="btn" style="flex: 1; padding: 8px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='mystery'?t.b2:'transparent'}; color: ${currentTab==='mystery'?t.btc:t.tc};">Mystery Skins</button>
                </div>

                <div id="lm-potions-help-body" class="lm-modal-body" style="padding: 16px;">
                    ${buildBodyContent(currentTab)}
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-potions-help-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        var updateTabs = function(newTab) {
            $('#lm-potions-help-body').html(buildBodyContent(newTab));
            $('#lm-tab-howto').css({ background: newTab==='howto'?t.b2:'transparent', color: newTab==='howto'?t.btc:t.tc });
            $('#lm-tab-rewards').css({ background: newTab==='rewards'?t.b2:'transparent', color: newTab==='rewards'?t.btc:t.tc });
            $('#lm-tab-mystery').css({ background: newTab==='mystery'?t.b2:'transparent', color: newTab==='mystery'?t.btc:t.tc });
        };

        $('#lm-tab-howto').on('click', function() { updateTabs('howto'); });
        $('#lm-tab-rewards').on('click', function() { updateTabs('rewards'); });
        $('#lm-tab-mystery').on('click', function() { updateTabs('mystery'); });
    };

    window.showDailyDealsCarouselModal = function(initialSlide) {
        injectStyles();
        var t = getTheme();
        var currentSlide = initialSlide || 0;

        var slidesData = [
            {
                id: 'daily-deal',
                title: 'DAILY DEAL!',
                subtitle: 'GET IT WHILE IT LASTS!',
                badge: '+FREE SKIN!',
                timer: 'Offer Ends: 01h 55m 11s',
                bannerGradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                offers: [
                    {
                        tag: '',
                        coins: '14,000',
                        oldCoins: '7,000',
                        multiplier: '2X',
                        bonusText: 'FREE!',
                        bonusItem: '⭐ Star Skin',
                        price: '$9.99',
                        purchaseId: 'com.miniclip.agar.io.dailydeal7'
                    },
                    {
                        tag: 'BEST DEAL!',
                        coins: '32,000',
                        oldCoins: '16,000',
                        multiplier: '2X',
                        bonusText: 'FREE!',
                        bonusItem: '🍬 Candy Swirl Skin',
                        price: '$19.99',
                        purchaseId: 'com.miniclip.agar.io.dailydeal15'
                    }
                ]
            },
            {
                id: 'collectors-items',
                title: "THE COLLECTOR'S",
                subtitle: 'LEGACY ITEMS AND SKINS FOR SALE!',
                badge: 'RARE SKINS AND ITEMS',
                timer: 'Offer Ends: 64h 04m 16s',
                bannerGradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
                offers: [
                    {
                        tag: '',
                        coins: '3,250',
                        oldCoins: '',
                        multiplier: '',
                        bonusText: '+ 3X MASS',
                        bonusItem: '⚡ 3X Mass Boost (24h)',
                        price: '$1.99',
                        purchaseId: 'com.miniclip.agar.io.dailydeal17'
                    },
                    {
                        tag: 'Best Deal!',
                        coins: '16,000',
                        oldCoins: '',
                        multiplier: '',
                        bonusText: '+ RARE SKINS',
                        bonusItem: '🍔 Burger & 🏀 Basketball Skins',
                        price: '$9.99',
                        purchaseId: 'com.miniclip.agar.io.dailydeal21'
                    }
                ]
            }
        ];

        var old = document.getElementById('lm-daily-deals-carousel-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-daily-deals-carousel-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var renderSlide = function(idx) {
            var slide = slidesData[idx];
            var totalSlides = slidesData.length;

            var offersHtml = '';
            slide.offers.forEach(function(offer) {
                var tagBadge = offer.tag ? `<div style="position: absolute; top: -10px; left: -10px; background: linear-gradient(135deg, #ff0055, #ff5000); color: #fff; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); text-transform: uppercase;">${offer.tag}</div>` : '';
                offersHtml += `
                    <div style="position: relative; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                        ${tagBadge}
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: center;">
                                <div style="font-size: 20px; font-weight: 900; color: #ffd700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">💰 ${offer.coins}</div>
                                ${offer.oldCoins ? `<div style="font-size: 11px; text-decoration: line-through; color: #ff5252; font-weight: 700;">${offer.oldCoins}</div>` : ''}
                            </div>
                            ${offer.multiplier ? `<div style="background: #ff0055; color: #fff; font-weight: 900; font-size: 11px; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(255,0,85,0.4);">${offer.multiplier}</div>` : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="text-align: right;">
                                <div style="font-size: 11px; font-weight: 900; color: #00e676; text-transform: uppercase;">${offer.bonusText}</div>
                                <div style="font-size: 10px; color: rgba(255,255,255,0.8); font-weight: 700;">${offer.bonusItem}</div>
                            </div>
                            <button class="btn" onclick="window.buyDealProduct('${offer.purchaseId}', '${offer.price}');" style="background: linear-gradient(135deg, #00e676, #00b0ff); color: #000; font-weight: 900; font-size: 15px; padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 3px 10px rgba(0,230,118,0.4); min-width: 90px;">
                                ${offer.price}
                            </button>
                        </div>
                    </div>
                `;
            });

            var dotsHtml = '';
            for (var i = 0; i < totalSlides; i++) {
                var isActive = (i === idx);
                dotsHtml += `<span class="carousel-dot" onclick="window.switchDailyDealSlide(${i});" style="display: inline-block; width: ${isActive ? '12px' : '9px'}; height: ${isActive ? '12px' : '9px'}; border-radius: 50%; background: ${isActive ? '#fff' : 'rgba(255,255,255,0.4)'}; margin: 0 4px; cursor: pointer; transition: all 0.2s; vertical-align: middle;"></span>`;
            }

            modal.innerHTML = `
                <div class="lm-modal-container" style="background: #1a1a2e; border: 3px solid #00d2ff; width: 660px; position: relative; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: visible;">
                    
                    <!-- Left Carousel Arrow -->
                    <button class="btn carousel-arrow-left" onclick="window.switchDailyDealSlide(${(idx - 1 + totalSlides) % totalSlides});" style="position: absolute; left: -22px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.95); color: #1a1a2e; font-weight: 900; font-size: 22px; border: 2px solid #00d2ff; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.5); z-index: 20; display: flex; align-items: center; justify-content: center; outline: none;">
                        ‹
                    </button>

                    <!-- Right Carousel Arrow -->
                    <button class="btn carousel-arrow-right" onclick="window.switchDailyDealSlide(${(idx + 1) % totalSlides});" style="position: absolute; right: -22px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.95); color: #1a1a2e; font-weight: 900; font-size: 22px; border: 2px solid #00d2ff; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.5); z-index: 20; display: flex; align-items: center; justify-content: center; outline: none;">
                        ›
                    </button>

                    <!-- Header Banner -->
                    <div style="background: ${slide.bannerGradient}; padding: 18px 24px; border-radius: 13px 13px 0 0; position: relative; border-bottom: 2px solid rgba(255,255,255,0.2);">
                        <button class="lm-modal-close" onclick="document.getElementById('lm-daily-deals-carousel-modal').remove();" style="position: absolute; right: 14px; top: 10px; color: #fff; font-size: 24px; opacity: 0.9;">&times;</button>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 22px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 2px 6px rgba(0,0,0,0.6);">${slide.title}</div>
                                <div style="font-size: 12px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${slide.subtitle}</div>
                                <div style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 6px;">⏱️ ${slide.timer}</div>
                            </div>
                            <div style="background: rgba(255,255,255,0.2); border: 2px dashed #fff; padding: 6px 14px; border-radius: 20px; font-weight: 900; font-size: 13px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                                ${slide.badge}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div style="padding: 20px; max-height: 380px; overflow-y: auto;">
                        ${offersHtml}
                    </div>

                    <!-- Carousel Dots Footer -->
                    <div style="padding: 10px 0 14px 0; text-align: center; background: rgba(0,0,0,0.3); border-radius: 0 0 13px 13px;">
                        ${dotsHtml}
                    </div>
                </div>
            `;
        };

        window.switchDailyDealSlide = function(slideIdx) {
            renderSlide(slideIdx);
        };

        window.buyDealProduct = function(purchaseId, priceStr) {
            if (typeof window.buydeals === 'function') {
                $('#ss-select-purchases').val(purchaseId);
                window.buydeals();
            } else {
                if (window.toastr) window.toastr.success('<b>[SHOP]:</b> Initiating checkout for ' + purchaseId + ' (' + priceStr + ')');
            }
        };

        renderSlide(currentSlide);
        document.body.appendChild(modal);
    };

    window.openDailyDealsModal = function() {
        window.showDailyDealsCarouselModal(0);
    };

    window.showShopModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-main-shop-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna) || window.userDna || 1033;
        var coinsBalance = (window.application && window.application.user && window.application.user.coins) || window.userCoins || 28490;

        var modal = document.createElement('div');
        modal.id = 'lm-main-shop-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var categories = [
            {
                id: 'coins',
                name: 'Coins',
                bannerColor: '#7cb342',
                gradient: 'linear-gradient(180deg, #8bc34a 0%, #689f38 100%)',
                icon: '🪙',
                bgGraphic: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,160,0,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showDailyDealsCarouselModal === 'function') window.showDailyDealsCarouselModal(0);
                    else if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
                }
            },
            {
                id: 'dna',
                name: 'DNA',
                bannerColor: '#8bc34a',
                gradient: 'linear-gradient(180deg, #9ccc65 0%, #7cb342 100%)',
                icon: '🧬',
                bgGraphic: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(0,230,118,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
                    else if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
                }
            },
            {
                id: 'flasks',
                name: 'Premium Potions',
                bannerColor: '#e91e63',
                gradient: 'linear-gradient(180deg, #ec407a 0%, #c2185b 100%)',
                icon: '🧪',
                bgGraphic: 'linear-gradient(135deg, rgba(233,30,99,0.2) 0%, rgba(156,39,176,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showPremiumPotionsModal === 'function') window.showPremiumPotionsModal();
                    else if (typeof window.showPotionsHelpModal === 'function') window.showPotionsHelpModal('rewards');
                }
            },
            {
                id: 'skins',
                name: 'Skins',
                bannerColor: '#fbc02d',
                gradient: 'linear-gradient(180deg, #fdd835 0%, #f57f17 100%)',
                icon: '🎭',
                bgGraphic: 'linear-gradient(135deg, rgba(255,193,7,0.2) 0%, rgba(255,87,34,0.4) 100%)',
                badge: '1',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
                    else if (typeof window.SpecialDeals === 'function') window.SpecialDeals('skins');
                }
            },
            {
                id: 'mass',
                name: 'Mass Boost',
                bannerColor: '#f57c00',
                gradient: 'linear-gradient(180deg, #ff9800 0%, #e65100 100%)',
                icon: 'Ⓜ️',
                bgGraphic: 'linear-gradient(135deg, rgba(0,176,255,0.2) 0%, rgba(41,121,255,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showMassBoostModal === 'function') window.showMassBoostModal();
                    else if (typeof window.initBoostDropdown === 'function') window.initBoostDropdown();
                }
            },
            {
                id: 'xp',
                name: 'XP Boost',
                bannerColor: '#00bcd4',
                gradient: 'linear-gradient(180deg, #26c6da 0%, #00838f 100%)',
                icon: '⭐',
                bgGraphic: 'linear-gradient(135deg, rgba(255,235,59,0.2) 0%, rgba(255,152,0,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showXPBoostModal === 'function') window.showXPBoostModal();
                    else if (typeof window.initBoostDropdown === 'function') window.initBoostDropdown();
                }
            }
        ];

        var gridHtml = '';
        categories.forEach(function(cat) {
            var badgeEl = cat.badge ? `<div style="position: absolute; bottom: 8px; right: 12px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${cat.badge}</div>` : '';
            gridHtml += `
                <div id="shop-card-${cat.id}" onclick="window.onShopCategoryClick('${cat.id}');" style="position: relative; height: 135px; border-radius: 12px; overflow: hidden; border: 2px solid rgba(255,255,255,0.3); background: ${cat.bgGraphic}; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; font-size: 48px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        ${cat.icon}
                    </div>
                    <div style="background: ${cat.gradient}; padding: 8px 10px; text-align: center; font-weight: 900; font-size: 15px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.6); text-transform: uppercase; letter-spacing: 0.5px;">
                        ${cat.name}
                    </div>
                    ${badgeEl}
                </div>
            `;
        });

        window.onShopCategoryClick = function(catId) {
            var target = categories.find(function(c) { return c.id === catId; });
            if (target && typeof target.action === 'function') target.action();
        };

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 660px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08);">
                    <div style="font-size: 24px; font-weight: 900; color: #444; letter-spacing: 0.5px;">Shop</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: #f0f4f8; border: 2px solid #8bc34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #558b2f; display: flex; align-items: center; gap: 6px;">
                            <span>🧬 ${dnaBalance.toLocaleString()}</span>
                            <span style="background: #8bc34a; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <div style="background: #f0f4f8; border: 2px solid #fbc02d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #f57f17; display: flex; align-items: center; gap: 6px;">
                            <span>💰 ${coinsBalance.toLocaleString()}</span>
                            <span style="background: #fbc02d; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <button onclick="document.getElementById('lm-main-shop-modal').remove();" style="background: none; border: none; font-size: 24px; color: #888; cursor: pointer; font-weight: 900; margin-left: 8px;">&times;</button>
                    </div>
                </div>

                <div style="padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: #f7f9fa;">
                    ${gridHtml}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    window.showPotionDetailModal = function(potionType) {
        injectStyles();
        var t = getTheme();
        var pType = potionType || 'potion_epic';

        var detailsMap = {
            'potion_superior': {
                name: 'Superior Potion',
                icon: '🧪',
                iconColor: '#4caf50',
                coins: '150 - 300',
                skinPieces: 'x2',
                specialPieces: '0',
                specialText: ''
            },
            'potion_epic': {
                name: 'Epic Potion',
                icon: '🧪',
                iconColor: '#00bcd4',
                coins: '420 - 650',
                skinPieces: 'x6',
                specialPieces: '1',
                specialText: 'x1 Special'
            },
            'potion_legendary': {
                name: 'Legendary Potion',
                icon: '🧪',
                iconColor: '#e91e63',
                coins: '1,200 - 2,000',
                skinPieces: 'x12',
                specialPieces: '3',
                specialText: 'x3 Special'
            },
            'potion_mystical': {
                name: 'Mystical Potion',
                icon: '🧪',
                iconColor: '#ffb300',
                coins: '3,000 - 5,500',
                skinPieces: 'x24',
                specialPieces: '6',
                specialText: 'x6 Special'
            }
        };

        var p = detailsMap[pType] || detailsMap['potion_epic'];
        var old = document.getElementById('lm-potion-detail-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-potion-detail-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100005';

        var specialItemHtml = p.specialText ? `
            <div style="background: #ffffff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.06); text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 4px;">At least:</div>
                <div style="font-size: 16px; font-weight: 900; color: #f57f17; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #ffb300; background: #fff8e1;"></span>
                    <span>${p.specialText}</span>
                </div>
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 440px; padding: 24px; position: relative; box-shadow: 0 12px 48px rgba(0,0,0,0.5); text-align: center;">
                <button onclick="document.getElementById('lm-potion-detail-modal').remove();" style="position: absolute; right: 16px; top: 16px; background: none; border: none; font-size: 22px; color: #aaa; cursor: pointer; font-weight: 900;">&times;</button>
                
                <div style="font-size: 22px; font-weight: 900; color: #333; margin-bottom: 16px;">${p.name}</div>

                <div style="background: #f0f3f6; border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 20px; justify-content: space-between; margin-bottom: 16px;">
                    <div style="font-size: 80px; text-shadow: 0 6px 16px rgba(0,0,0,0.15); flex: 1;">
                        ${p.icon}
                    </div>

                    <div style="flex: 1.2; text-align: center;">
                        <div style="background: #ffffff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.06);">
                            <div style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 4px;">Coins</div>
                            <div style="font-size: 15px; font-weight: 900; color: #f57f17; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                <span>💰</span>
                                <span>${p.coins}</span>
                            </div>
                        </div>

                        <div style="background: #ffffff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.06);">
                            <div style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 4px;">Skin Pieces</div>
                            <div style="font-size: 15px; font-weight: 900; color: #0288d1; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #00bcd4;"></span>
                                <span>${p.skinPieces}</span>
                            </div>
                        </div>

                        ${specialItemHtml}

                        <div style="font-size: 11px; font-weight: 600; color: #999; margin-top: 4px;">and more!</div>
                    </div>
                </div>

                <div style="font-size: 15px; font-weight: 800; color: #555;">Opens immediately</div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    window.showPremiumPotionsModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-premium-potions-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna) || window.userDna || 1033;
        var coinsBalance = (window.application && window.application.user && window.application.user.coins) || window.userCoins || 28490;

        var modal = document.createElement('div');
        modal.id = 'lm-premium-potions-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        var potionsData = [
            {
                id: 'potion_superior',
                name: 'Superior',
                dnaCost: 60,
                color: '#4caf50',
                bgGradient: 'linear-gradient(180deg, #f0f7ed 0%, #e8f5e9 100%)',
                btnGradient: 'linear-gradient(180deg, #7cb342 0%, #689f38 100%)',
                flaskIcon: '🧪',
                flaskColor: '#4caf50'
            },
            {
                id: 'potion_epic',
                name: 'Epic',
                dnaCost: 120,
                color: '#00bcd4',
                bgGradient: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 100%)',
                btnGradient: 'linear-gradient(180deg, #7cb342 0%, #689f38 100%)',
                flaskIcon: '🧪',
                flaskColor: '#00bcd4'
            },
            {
                id: 'potion_legendary',
                name: 'Legendary',
                dnaCost: 350,
                color: '#e91e63',
                bgGradient: 'linear-gradient(180deg, #fce4ec 0%, #f8bbd0 100%)',
                btnGradient: 'linear-gradient(180deg, #7cb342 0%, #689f38 100%)',
                flaskIcon: '🧪',
                flaskColor: '#e91e63'
            },
            {
                id: 'potion_mystical',
                name: 'Mystical',
                dnaCost: 750,
                color: '#ffb300',
                bgGradient: 'linear-gradient(180deg, #fff8e1 0%, #ffecb3 100%)',
                btnGradient: 'linear-gradient(180deg, #7cb342 0%, #689f38 100%)',
                flaskIcon: '🧪',
                flaskColor: '#ffb300'
            }
        ];

        var cardsHtml = '';
        potionsData.forEach(function(p) {
            cardsHtml += `
                <div style="flex: 1; background: #f5f7fa; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 16px 12px; text-align: center; position: relative; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <button onclick="if(window.showPotionDetailModal) window.showPotionDetailModal('${p.id}'); else if(window.showPotionsHelpModal) window.showPotionsHelpModal('rewards');" style="position: absolute; right: 10px; top: 10px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);" title="Potion Info">?</button>
                    
                    <div>
                        <div style="font-size: 16px; font-weight: 900; color: #444; margin-bottom: 14px; letter-spacing: 0.3px;">${p.name}</div>
                        <div style="font-size: 56px; margin: 10px 0; text-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            ${p.flaskIcon}
                        </div>
                    </div>

                    <button class="btn" onclick="window.buyAndOpenPremiumPotion('${p.id}', ${p.dnaCost});" style="background: ${p.btnGradient}; color: #fff; font-weight: 900; font-size: 15px; padding: 10px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(104,159,56,0.4); display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span>${p.dnaCost}</span>
                        <span style="font-size: 14px;">🧬</span>
                    </button>
                </div>
            `;
        });

        window.buyAndOpenPremiumPotion = function(productId, cost) {
            if (dnaBalance < cost) {
                if (window.toastr) window.toastr.warning('<b>[SHOP]:</b> Not enough DNA to purchase ' + productId);
                return;
            }
            if (typeof window.openPotionForProduct === 'function') {
                window.openPotionForProduct(productId);
            } else if (window.application && typeof window.application.openPotionForProduct === 'function') {
                window.application.openPotionForProduct(productId);
            } else {
                if (window.toastr) window.toastr.success('<b>[SHOP]:</b> Opened ' + productId + '! (-' + cost + ' DNA)');
            }
        };

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 720px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="document.getElementById('lm-premium-potions-modal').remove(); if(window.showShopModal) window.showShopModal();" style="width: 32px; height: 32px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,211,255,0.4);" title="Back to Shop">‹</button>
                        <div style="font-size: 22px; font-weight: 900; color: #444; letter-spacing: 0.5px;">Premium Potions</div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: #f0f4f8; border: 2px solid #8bc34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #558b2f; display: flex; align-items: center; gap: 6px;">
                            <span>🧬 ${dnaBalance.toLocaleString()}</span>
                            <span style="background: #8bc34a; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <div style="background: #f0f4f8; border: 2px solid #fbc02d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #f57f17; display: flex; align-items: center; gap: 6px;">
                            <span>💰 ${coinsBalance.toLocaleString()}</span>
                            <span style="background: #fbc02d; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <button onclick="document.getElementById('lm-premium-potions-modal').remove();" style="background: none; border: none; font-size: 24px; color: #888; cursor: pointer; font-weight: 900; margin-left: 8px;">&times;</button>
                    </div>
                </div>

                <div style="margin: 16px 20px 0 20px; background: #eef2f5; border-radius: 10px; padding: 12px; text-align: center; font-size: 13px; font-weight: 700; color: #555;">
                    Potions purchased in the shop will open immediately!
                </div>

                <div style="padding: 20px; display: flex; gap: 14px; background: #ffffff;">
                    ${cardsHtml}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    window.showXPBoostModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-xp-boost-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna) || window.userDna || 1033;
        var coinsBalance = (window.application && window.application.user && window.application.user.coins) || window.userCoins || 28490;

        var userBoosts = (window.application && window.application.user && window.application.user.boosts) || window.userBoosts || {};
        var count_2x_1h = userBoosts.xp_2x_1h || userBoosts['xp_boost_2x_1h'] || 46;
        var count_2x_24h = userBoosts.xp_2x_24h || userBoosts['xp_boost_2x_24h'] || 17;
        var count_3x_1h = userBoosts.xp_3x_1h || userBoosts['xp_boost_3x_1h'] || 33;
        var count_3x_24h = userBoosts.xp_3x_24h || userBoosts['xp_boost_3x_24h'] || 6;

        var modal = document.createElement('div');
        modal.id = 'lm-xp-boost-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        window.useBoostItem = function(boostId, count) {
            if (count <= 0) {
                if (window.toastr) window.toastr.warning('<b>[BOOST]:</b> You do not own any ' + boostId + ' boosts.');
                return;
            }
            if (typeof window.activateBoost === 'function') {
                window.activateBoost(boostId);
            } else if (window.application && typeof window.application.activateBoost === 'function') {
                window.application.activateBoost(boostId);
            } else {
                if (window.toastr) window.toastr.success('<b>[BOOST]:</b> Activated ' + boostId + '!');
            }
        };

        window.showBoostInfoPopover = function(title, text) {
            var oldInfo = document.getElementById('lm-boost-info-popover');
            if (oldInfo) oldInfo.remove();

            var pop = document.createElement('div');
            pop.id = 'lm-boost-info-popover';
            pop.className = 'lm-modal-overlay';
            pop.style.zIndex = '100010';
            pop.innerHTML = `
                <div class="lm-modal-container" style="background: #fff; border-radius: 14px; width: 380px; padding: 20px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); position: relative;">
                    <button onclick="document.getElementById('lm-boost-info-popover').remove();" style="position: absolute; right: 14px; top: 14px; background: none; border: none; font-size: 20px; color: #888; cursor: pointer; font-weight: 900;">&times;</button>
                    <div style="font-size: 20px; font-weight: 900; color: #333; margin-bottom: 10px;">${title}</div>
                    <div style="font-size: 14px; color: #666; line-height: 1.5;">${text}</div>
                </div>
            `;
            document.body.appendChild(pop);
        };

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 680px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="document.getElementById('lm-xp-boost-modal').remove(); if(window.showShopModal) window.showShopModal();" style="width: 32px; height: 32px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,211,255,0.4);" title="Back to Shop">‹</button>
                        <div style="font-size: 22px; font-weight: 900; color: #444; letter-spacing: 0.5px;">XP Boost</div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: #f0f4f8; border: 2px solid #8bc34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #558b2f; display: flex; align-items: center; gap: 6px;">
                            <span>🧬 ${dnaBalance.toLocaleString()}</span>
                            <span style="background: #8bc34a; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <div style="background: #f0f4f8; border: 2px solid #fbc02d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #f57f17; display: flex; align-items: center; gap: 6px;">
                            <span>💰 ${coinsBalance.toLocaleString()}</span>
                            <span style="background: #fbc02d; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <button onclick="document.getElementById('lm-xp-boost-modal').remove();" style="background: none; border: none; font-size: 24px; color: #888; cursor: pointer; font-weight: 900; margin-left: 8px;">&times;</button>
                    </div>
                </div>

                <div style="padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f7f9fa;">
                    <div style="background: #eceff1; border-radius: 14px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(0,0,0,0.06);">
                        <button onclick="window.showBoostInfoPopover('Double XP Boost', 'Doubles all XP earned in game matches for the duration of the boost.');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Double XP Boost</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                                <div style="font-size: 72px; text-shadow: 0 6px 16px rgba(0,0,0,0.15);">⭐</div>
                                <div style="position: absolute; bottom: 10px; font-size: 22px; font-weight: 900; color: #e65100; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.5);">2X</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">1 Hour</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('xp_2x_1h', ${count_2x_1h});" style="background: linear-gradient(180deg, #7cb342 0%, #689f38 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(104,159,56,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_2x_1h}</div>
                                </div>
                            </div>

                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">24 Hours</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('xp_2x_24h', ${count_2x_24h});" style="background: linear-gradient(180deg, #ff9800 0%, #e65100 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(230,81,0,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_2x_24h}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #eceff1; border-radius: 14px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(0,0,0,0.06);">
                        <button onclick="window.showBoostInfoPopover('Triple XP Boost', 'Triples all XP earned in game matches for the duration of the boost.');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Triple XP Boost</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                                <div style="font-size: 72px; text-shadow: 0 6px 16px rgba(0,0,0,0.15);">⭐</div>
                                <div style="position: absolute; bottom: 10px; font-size: 22px; font-weight: 900; color: #e65100; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.5);">3X</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">1 Hour</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('xp_3x_1h', ${count_3x_1h});" style="background: linear-gradient(180deg, #7cb342 0%, #689f38 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(104,159,56,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_3x_1h}</div>
                                </div>
                            </div>

                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">24 Hours</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('xp_3x_24h', ${count_3x_24h});" style="background: linear-gradient(180deg, #ff9800 0%, #e65100 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(230,81,0,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_3x_24h}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    window.showMassBoostModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-mass-boost-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna) || window.userDna || 1033;
        var coinsBalance = (window.application && window.application.user && window.application.user.coins) || window.userCoins || 28490;

        var userBoosts = (window.application && window.application.user && window.application.user.boosts) || window.userBoosts || {};
        var count_2x_1h = userBoosts.mass_2x_1h || userBoosts['mass_boost_2x_1h'] || 12;
        var count_2x_24h = userBoosts.mass_2x_24h || userBoosts['mass_boost_2x_24h'] || 5;
        var count_3x_1h = userBoosts.mass_3x_1h || userBoosts['mass_boost_3x_1h'] || 8;
        var count_3x_24h = userBoosts.mass_3x_24h || userBoosts['mass_boost_3x_24h'] || 3;

        var modal = document.createElement('div');
        modal.id = 'lm-mass-boost-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '100000';

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 680px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="document.getElementById('lm-mass-boost-modal').remove(); if(window.showShopModal) window.showShopModal();" style="width: 32px; height: 32px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,211,255,0.4);" title="Back to Shop">‹</button>
                        <div style="font-size: 22px; font-weight: 900; color: #444; letter-spacing: 0.5px;">Mass Boost</div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: #f0f4f8; border: 2px solid #8bc34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #558b2f; display: flex; align-items: center; gap: 6px;">
                            <span>🧬 ${dnaBalance.toLocaleString()}</span>
                            <span style="background: #8bc34a; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <div style="background: #f0f4f8; border: 2px solid #fbc02d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #f57f17; display: flex; align-items: center; gap: 6px;">
                            <span>💰 ${coinsBalance.toLocaleString()}</span>
                            <span style="background: #fbc02d; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <button onclick="document.getElementById('lm-mass-boost-modal').remove();" style="background: none; border: none; font-size: 24px; color: #888; cursor: pointer; font-weight: 900; margin-left: 8px;">&times;</button>
                    </div>
                </div>

                <div style="padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f7f9fa;">
                    <div style="background: #eceff1; border-radius: 14px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(0,0,0,0.06);">
                        <button onclick="window.showBoostInfoPopover('Double Mass Boost', 'Starts every match with double starting mass (e.g. 50 mass instead of 25).');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Double Mass Boost</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                                <div style="font-size: 72px; text-shadow: 0 6px 16px rgba(0,0,0,0.15);">Ⓜ️</div>
                                <div style="position: absolute; bottom: 10px; font-size: 22px; font-weight: 900; color: #0288d1; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.5);">2X</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">1 Hour</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('mass_2x_1h', ${count_2x_1h});" style="background: linear-gradient(180deg, #7cb342 0%, #689f38 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(104,159,56,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_2x_1h}</div>
                                </div>
                            </div>

                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">24 Hours</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('mass_2x_24h', ${count_2x_24h});" style="background: linear-gradient(180deg, #ff9800 0%, #e65100 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(230,81,0,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_2x_24h}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #eceff1; border-radius: 14px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(0,0,0,0.06);">
                        <button onclick="window.showBoostInfoPopover('Triple Mass Boost', 'Starts every match with triple starting mass (e.g. 75 mass instead of 25).');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Triple Mass Boost</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                                <div style="font-size: 72px; text-shadow: 0 6px 16px rgba(0,0,0,0.15);">Ⓜ️</div>
                                <div style="position: absolute; bottom: 10px; font-size: 22px; font-weight: 900; color: #0288d1; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.5);">3X</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">1 Hour</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('mass_3x_1h', ${count_3x_1h});" style="background: linear-gradient(180deg, #7cb342 0%, #689f38 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(104,159,56,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_3x_1h}</div>
                                </div>
                            </div>

                            <div>
                                <div style="font-size: 12px; font-weight: 800; color: #555; margin-bottom: 4px;">24 Hours</div>
                                <div style="position: relative;">
                                    <button onclick="window.useBoostItem('mass_3x_24h', ${count_3x_24h});" style="background: linear-gradient(180deg, #ff9800 0%, #e65100 100%); color: #fff; font-weight: 900; font-size: 15px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer; width: 100%; box-shadow: 0 3px 8px rgba(230,81,0,0.4);">Use</button>
                                    <div style="position: absolute; top: -6px; right: -6px; background: #ff1744; color: #fff; font-weight: 900; font-size: 11px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${count_3x_24h}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    window.openShop = function(cat) {
        if (cat === 'potions' || cat === 'flasks') {
            if (typeof window.showPremiumPotionsModal === 'function') window.showPremiumPotionsModal();
            else if (typeof window.showPotionsHelpModal === 'function') window.showPotionsHelpModal('rewards');
        } else if (cat === 'coins' || cat === 'deals') {
            if (typeof window.showDailyDealsCarouselModal === 'function') window.showDailyDealsCarouselModal(0);
        } else if (cat === 'skins') {
            if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
        } else {
            window.showShopModal();
        }
    };

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
            <button id="lm-daily-deal-btn" class="btn btn-danger btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; background: linear-gradient(135deg, #ff9800, #e65100); border: none;" onclick="if(typeof window.openDailyDealsModal==='function'){window.openDailyDealsModal();}else if(typeof window.SpecialDeals==='function'){window.SpecialDeals('deals');}">
                🔥 Daily Deal
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

        var potionsContainer = $('#potions, .potions-container');
        if (potionsContainer.length && !document.getElementById('lm-potions-help-btn')) {
            var helpBtn = $('<button id="lm-potions-help-btn" style="position: absolute; right: 5px; bottom: 5px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: 2px solid #fff; font-weight: 900; font-size: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10; line-height: 1; text-align: center; padding: 0;" title="Potions Help">?</button>');
            helpBtn.on('click', function(e) { e.preventDefault(); window.showPotionsHelpModal('rewards'); });
            potionsContainer.css('position', 'relative').append(helpBtn);
        }

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

        // Clean domain and protocol prefix if user pasted full URL
        if (token) {
            token = token.replace(/^https?:\/\/[^\/]+\/?/i, '').replace(/^#reward-/i, '').split(/[?#&]/)[0].trim();
        }

        var bannerEl = document.getElementById('lm-promo-reward-banner');
        if (!token || token.length < 3 || token.includes('agar.io') || token.startsWith('http')) {
            if (bannerEl) bannerEl.remove();
            return;
        }

        window.currentPromoToken = token;

        // Prevent continuous DOM reloading/re-rendering loop if token hasn't changed
        if (bannerEl && bannerEl.dataset.token === token) {
            return;
        }

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

        bannerEl.dataset.token = token;
        var displayToken = token.length > 20 ? (token.substring(0, 18) + '...') : token;

        bannerEl.innerHTML = `
            <a id="legendAdAnchor3" href="#" onclick="window.claimPromoBannerReward(); return false;" style="display: block; text-decoration: none;">
                <img id="lm-promo-banner-img" src="https://jimboy3100.github.io/banners/rewardlinkbanner.png" style="width: 100%; max-height: 80px; object-fit: cover; border-radius: 6px; display: block;" onerror="this.style.display='none';">
                <div id="lm-promo-banner-title" style="color: #00ff88; font-size: 13px; font-weight: 800; margin-top: 6px; text-shadow: 0 1px 3px #000; letter-spacing: 0.5px;">
                    🎁 REDEEM PROMO REWARD (${displayToken})
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

        $(document).off('click', '#lm-daily-deal-btn').on('click', '#lm-daily-deal-btn', function(e) {
            e.preventDefault();
            if (typeof window.openDailyDealsModal === 'function') {
                window.openDailyDealsModal();
            } else if (typeof window.BeforeSpecialDeals === 'function') {
                window.BeforeSpecialDeals();
            } else if (typeof window.SpecialDeals === 'function') {
                window.SpecialDeals('deals');
            }
        });

        $(document).off('click', '.vanilla-skin-preview').on('click', '.vanilla-skin-preview', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.BeforeSpecialDeals === 'function') {
                window.BeforeSpecialDeals();
            } else if (typeof window.SpecialDeals === 'function') {
                window.SpecialDeals('skins');
            } else if (typeof window.openDailyDealsModal === 'function') {
                window.openDailyDealsModal();
            }
        });

        $(document).off('click', '#openShopBtn, .quick-shop').on('click', '#openShopBtn, .quick-shop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.showShopModal === 'function') window.showShopModal();
        });
    });

})();
