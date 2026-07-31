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
            @keyframes spin {
                to { transform: rotate(360deg); }
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
        // Try to read top 3 prizes from GameConfiguration
        var _getPrizeSummary = function(leagueId) {
            var cfg = window.LeaguesPrizesConfig;
            if (!cfg || !cfg.length) return null;
            var filtered = cfg.filter(function(p) { return p.leagueName === leagueId; });
            if (!filtered.length) return null;
            // Sort by positionFrom, take top 3
            filtered.sort(function(a, b) { return a.positionFrom - b.positionFrom; });
            var top3 = filtered.slice(0, 3);
            return top3.map(function(p, i) { return (i+1) + '. ' + (p.rewardAmount || '?'); }).join(' &nbsp; ');
        };

        var headerConfig = {
            1: {
                title: data.leagueName || myTier.name,
                gradient: myTier.gradient,
                icon: '⭐',
                prizes: _getPrizeSummary(myTier.id) || '🏆 🏆 🏆'
            },
            2: {
                title: 'Country (' + userCountry.toUpperCase() + ')',
                gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',
                icon: '<span class="flag-icon flag-icon-' + userCountry.toLowerCase() + '" style="border-radius: 3px;"></span>',
                prizes: _getPrizeSummary('country') || '🏆 🏆 🏆'
            },
            3: {
                title: 'World',
                gradient: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',
                icon: '🌎',
                prizes: _getPrizeSummary('world') || '🏆 🏆 🏆'
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
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Weekly League</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-size: 11px; text-align: center;">
                        <div style="opacity: 0.8; margin-bottom: 2px;">Top 3 prizes</div>
                        <div style="font-weight: 800; color: #ffd700;">${cfg.prizes} <i class="fa fa-ticket"></i></div>
                    </div>
                    <button class="btn" onclick="window.showMorePrizesModal(${tabType});" style="background: ${t.b2}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">More Prizes</button>
                    <button class="btn" onclick="window.showLastWeekResultsModal(${tabType});" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">Last Week Results</button>
                    <button class="btn" onclick="window.showLeaguesInfoModal();" style="background: rgba(255,255,255,0.2); color: #fff; font-weight: 900; font-size: 15px; width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">?</button>
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

        // Use real server data instead of hardcoded fake entries
        var entries = (data && data.leagueEntries && data.leagueEntries.length) ? data.leagueEntries : (window.RecordPlayers && window.RecordPlayers.length ? window.RecordPlayers : null);
        var currentUser = (window.application && window.application.user) || {};
        var currentUserName = currentUser.displayName || window.agarioProfileName || 'You';
        var currentUserLevel = currentUser.level || userLevel;
        var currentUserAvatar = currentUser.picture || 'https://jimboy3100.github.io/banners/profilepic_guest.png';
        var currentUserCountry = userCountry;
        var currentUserRank = (data && data.userPosition !== undefined) ? ('#' + data.userPosition) : '?';
        var currentUserScore = (data && data.userScore !== undefined) ? data.userScore : ((data && data.userWinnings !== undefined) ? data.userWinnings : 0);

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
        } else {
            // No server data yet — show loading message matching original agar.io
            html += `
                <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    Please wait...
                </div>
            `;
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

        // Dispatch Opcode 130 request for current week standings
        // NOTE: leagueRequestType 1=current week, 2=last week (NOT the tab number!)
        // Tabs (1=My League, 2=Country, 3=World) are UI-level only
        if (typeof window.requestLeaguesInfo === 'function') {
            window.requestLeaguesInfo(1);
        } else if (window.application && typeof window.application.requestLeaguesInfo === 'function') {
            window.application.requestLeaguesInfo(1);
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
        var detail = e.detail || {};
        if (detail.isLastWeek) {
            // Last week response — update last week modal if open
            window.lastWeekLeaguesResponse = detail;
            if (document.getElementById('lm-lastweek-modal')) {
                window._renderLastWeekContent(detail);
            }
        } else {
            // Current week — update leaderboard
            window.renderLeaguesContent(window.currentLeagueTab || 1, detail);
        }
    });

    window.showMorePrizesModal = function(tabType) {
        injectStyles();
        var t = getTheme();
        var currentTab = tabType || window.currentLeagueTab || 1;
        var userLevel = (window.application && window.application.user && window.application.user.level) || 101;
        var myTier = window.getLeagueTierFromLevel(userLevel);
        var userCountry = (window.application && window.application.user && window.application.user.country) || 'us';

        // Map tab to league name for filtering
        var leagueFilterMap = {
            1: myTier ? myTier.id : 'kraken',
            2: 'country',
            3: 'world'
        };
        var leagueFilter = leagueFilterMap[currentTab] || 'kraken';

        var titleMap = {
            1: (myTier && myTier.name ? myTier.name : 'Kraken League'),
            2: 'Country League (' + userCountry.toUpperCase() + ')',
            3: 'World League'
        };
        var gradientMap = {
            1: myTier ? myTier.gradient : 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)',
            2: 'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',
            3: 'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)'
        };

        var title = titleMap[currentTab] || titleMap[1];
        var gradient = gradientMap[currentTab] || gradientMap[1];

        // Build prize rows from real config or fallback
        var prizeRows = [];
        var prizesConfig = window.LeaguesPrizesConfig;
        if (prizesConfig && prizesConfig.length) {
            // Filter by league name
            var filtered = prizesConfig.filter(function(p) { return p.leagueName === leagueFilter; });
            if (filtered.length === 0) {
                // Try lowercase matching or partial
                filtered = prizesConfig.filter(function(p) {
                    return p.leagueName && p.leagueName.toLowerCase() === leagueFilter.toLowerCase();
                });
            }
            if (filtered.length > 0) {
                filtered.forEach(function(prize) {
                    var place;
                    if (prize.positionFrom === prize.positionTo) {
                        if (prize.positionFrom === 1) place = '1st place';
                        else if (prize.positionFrom === 2) place = '2nd place';
                        else if (prize.positionFrom === 3) place = '3rd place';
                        else place = prize.positionFrom + 'th place';
                    } else {
                        place = prize.positionFrom + 'th - ' + prize.positionTo + 'th';
                    }
                    // Try to resolve reward amount from Wallet - Bonuses and Rewards
                    var amount = '?';
                    var currency = '🏆';
                    try {
                        var gcfg = (window.GameConfiguration || window.LMAgarGameConfiguration || {}).gameConfig || {};
                        var bonuses = gcfg["Wallet - Bonuses and Rewards"];
                        if (bonuses) {
                            var bonus = bonuses.find(function(b) { return b.id === prize.rewardId; });
                            if (bonus && bonus.bundleId) {
                                var bundles = gcfg["Wallet - Product Bundles"];
                                if (bundles) {
                                    var bundle = bundles.find(function(bun) { return bun.bundleId === bonus.bundleId; });
                                    if (bundle) {
                                        amount = bundle.quantity || '?';
                                        currency = bundle.productId === 'coin' ? '💰' : (bundle.productId === 'trophy' ? '🏆' : '🎫');
                                    }
                                }
                            }
                        }
                    } catch(e) {}
                    prizeRows.push({ rank: place, prize: amount + ' ' + currency });
                });
            }
        }

        var old = document.getElementById('lm-prizes-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-prizes-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        var rowsHtml = '';
        if (prizeRows.length > 0) {
            prizeRows.forEach(function(row) {
                rowsHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; margin-bottom: 6px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-weight: 800; font-size: 14px; color: ${t.tc}; min-width: 160px;">${row.rank}</div>
                        <div style="font-weight: 800; font-size: 16px; color: #ffd700; display: flex; align-items: center; gap: 6px;">${row.prize}</div>
                    </div>
                `;
            });
        } else {
            rowsHtml = `<div style="text-align: center; color: ${t.tc2}; padding: 30px; font-weight: 600; font-size: 13px;">Fetching league prize configuration from server...</div>`;
        }

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b2}; width: 480px;">
                <div class="lm-modal-header" style="background: ${gradient}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${title}</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: #fff;" onclick="document.getElementById('lm-prizes-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 20px; max-height: 420px; overflow-y: auto;">
                    <div style="text-align: center; margin-bottom: 16px;">
                        <div style="font-size: 48px; margin-bottom: 8px;">⭐</div>
                        <div style="font-size: 16px; font-weight: 800; color: ${t.tc};">Prizes</div>
                    </div>
                    ${rowsHtml}
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-prizes-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.showLastWeekResultsModal = function(tabType) {
        injectStyles();
        var t = getTheme();
        var userLevel = (window.application && window.application.user && window.application.user.level) || 101;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        var old = document.getElementById('lm-lastweek-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-lastweek-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        var title = 'Weekly Results';
        var gradient = myTier ? myTier.gradient : 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)';

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b1}; width: 520px;">
                <div class="lm-modal-header" style="background: ${gradient}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${title}</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: #fff;" onclick="document.getElementById('lm-lastweek-modal').remove();">&times;</button>
                    </div>
                </div>

                <div id="lm-lastweek-content" class="lm-modal-body" style="padding: 20px; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div data-loading="true" style="text-align: center; color: ${t.tc2}; font-size: 14px;">
                        <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                        Loading last week results...
                    </div>
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-lastweek-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Check if we already have cached last week data
        if (window.lastWeekLeaguesResponse && window.lastWeekLeaguesResponse.leagueEntries) {
            window._renderLastWeekContent(window.lastWeekLeaguesResponse);
        } else {
            // Request last week data from server (type=2)
            if (typeof window.requestLeaguesInfo === 'function') {
                window.requestLeaguesInfo(2);
            } else if (window.application && typeof window.application.requestLeaguesInfo === 'function') {
                window.application.requestLeaguesInfo(2);
            }
            // Response will come via leaguesInfoUpdate event → _renderLastWeekContent
            // Show timeout fallback after 5 seconds
            setTimeout(function() {
                var contentArea = document.getElementById('lm-lastweek-content');
                if (contentArea && contentArea.querySelector('[data-loading]')) {
                    window._renderLastWeekNoResults();
                }
            }, 5000);
        }
    };

    // Helper: render "no results" message matching original agar.io
    window._renderLastWeekNoResults = function() {
        var t = getTheme();
        var contentArea = document.getElementById('lm-lastweek-content');
        if (!contentArea) return;
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                There are no results available<br>since you didn't earn trophies<br>last week
            </div>
        `;
    };

    // Helper: render real last week data into the modal
    window._renderLastWeekContent = function(data) {
        var t = getTheme();
        var contentArea = document.getElementById('lm-lastweek-content');
        if (!contentArea) return;

        var entries = data.leagueEntries || [];
        if (entries.length === 0 && window.RecordPlayers && window.RecordPlayers.length) {
            entries = window.RecordPlayers;
        }

        if (entries.length === 0) {
            window._renderLastWeekNoResults();
            return;
        }

        var currentUser = (window.application && window.application.user) || {};
        var currentUserName = currentUser.displayName || window.agarioProfileName || 'You';

        var html = '';
        var validCount = 0;

        entries.forEach(function(entry, idx) {
            if (!entry || (!entry.displayName && !entry.id && !entry.uid)) return;
            validCount++;
            var rankNum = entry.rank || validCount;
            var isUser = entry.displayName === currentUserName || entry.isUser;

            var name = entry.displayName || entry.id || ('Player ' + rankNum);
            var score = entry.score !== undefined ? entry.score.toLocaleString() : (entry.winnings !== undefined ? entry.winnings.toLocaleString() : (entry.trophies !== undefined ? entry.trophies.toLocaleString() : '0'));
            var icon = entry.icon || entry.avatar || 'https://jimboy3100.github.io/banners/profilepic_guest.png';
            var country = (entry.country || entry.countryCode || 'us').toLowerCase();
            var level = entry.level || 100;

            var rankBadge = '';
            if (rankNum === 1) {
                rankBadge = '<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffd700, #ff8f00); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(255,215,0,0.4);">1</div>';
            } else if (rankNum === 2) {
                rankBadge = '<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #e0e0e0, #757575); color: #000; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">2</div>';
            } else if (rankNum === 3) {
                rankBadge = '<div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ff8a65, #d84315); color: #fff; font-weight: 900; font-size: 13px; display: flex; align-items: center; justify-content: center;">3</div>';
            } else {
                rankBadge = '<div style="padding: 3px 8px; border-radius: 6px; background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 800; font-size: 12px;">#' + rankNum + '</div>';
            }

            var rowBg = isUser ? 'background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius: 8px; ' + rowBg + '">';
            html += '<div style="width: 60px;">' + rankBadge + '</div>';
            html += '<div style="flex: 1; display: flex; align-items: center; gap: 10px;">';
            html += '<img src="' + icon + '" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src=\'https://jimboy3100.github.io/banners/profilepic_guest.png\'">';
            html += '<span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">' + level + '</span>';
            html += '<span class="country-icon flag-icon flag-icon-' + country + '" style="border-radius: 2px;"></span>';
            html += '<span style="font-weight: 700; color: ' + (isUser ? '#00e676' : t.tc) + '; font-size: 13px;">' + name + '</span>';
            html += '</div>';
            html += '<div style="width: 100px; text-align: right; font-weight: 800; color: ' + (isUser ? '#00e676' : t.tc) + '; font-size: 13px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">' + score + ' <i class="fa fa-trophy" style="color: ' + t.mc + ';"></i></div>';
            html += '</div>';
        });

        contentArea.style.display = 'block';
        contentArea.style.maxHeight = '420px';
        contentArea.style.overflowY = 'auto';
        contentArea.innerHTML = html;
    };

    // Leagues Information "?" modal — matches original agar.io "World Information" popup
    window.showLeaguesInfoModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-leaguesinfo-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-leaguesinfo-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.b2}; width: 480px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: ${t.tc};">World Information</span>
                        <button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: ${t.tc};" onclick="document.getElementById('lm-leaguesinfo-modal').remove();">&times;</button>
                    </div>
                </div>

                <div style="display: flex; padding: 12px 20px 0 20px; gap: 8px;">
                    <button id="lm-info-tab-rules" onclick="window._switchLeaguesInfoTab('rules')" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; border: 2px solid ${t.b1}; background: ${t.b1}; color: ${t.btc};">Rules</button>
                    <button id="lm-info-tab-trophies" onclick="window._switchLeaguesInfoTab('trophies')" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; border: 2px solid ${t.b2}; background: transparent; color: ${t.tc};">Trophies</button>
                </div>

                <div id="lm-info-content" class="lm-modal-body" style="padding: 24px 30px; min-height: 180px; text-align: center;">
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-leaguesinfo-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius: 6px; border: none; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        window._switchLeaguesInfoTab('rules');
    };

    window._switchLeaguesInfoTab = function(tab) {
        var t = getTheme();
        var content = document.getElementById('lm-info-content');
        var rulesBtn = document.getElementById('lm-info-tab-rules');
        var trophiesBtn = document.getElementById('lm-info-tab-trophies');
        if (!content || !rulesBtn || !trophiesBtn) return;

        if (tab === 'rules') {
            rulesBtn.style.background = t.b1;
            rulesBtn.style.color = t.btc;
            rulesBtn.style.borderColor = t.b1;
            trophiesBtn.style.background = 'transparent';
            trophiesBtn.style.color = t.tc;
            trophiesBtn.style.borderColor = t.b2;

            content.innerHTML = '<div style="color: ' + t.tc + '; font-size: 14px; line-height: 1.8; font-weight: 600;">' +
                '<p>Ranking is based on total weekly trophy winnings.</p>' +
                '<p style="margin-top: 12px;">At the end of each week, come back to check if you won the prize.</p>' +
                '<p style="margin-top: 12px;">You need to open the app to claim your prize - so don\'t miss out!</p>' +
                '</div>';
        } else {
            trophiesBtn.style.background = t.b1;
            trophiesBtn.style.color = t.btc;
            trophiesBtn.style.borderColor = t.b1;
            rulesBtn.style.background = 'transparent';
            rulesBtn.style.color = t.tc;
            rulesBtn.style.borderColor = t.b2;

            content.innerHTML = '<div style="color: ' + t.tc + '; font-size: 14px; line-height: 1.8; font-weight: 600;">' +
                '<p>Trophies can be found inside Mystery Potions. Collect as many as you can to climb on the leaderboards.</p>' +
                '<p style="font-weight: 800; margin-top: 14px;">Play any game mode to collect Mystery Potions.</p>' +
                '<div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px;">' +
                '<div style="font-size: 48px;">🧪</div>' +
                '<div style="font-size: 32px; color: ' + t.mc + ';">➤</div>' +
                '<div style="font-size: 48px;">🏆</div>' +
                '</div>' +
                '</div>';
        }
    };

    // ═══════════════════════════════════════════════════════════════
    //  FRIENDS MODAL
    // ═══════════════════════════════════════════════════════════════

    window.showFriendsModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-friends-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-friends-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        modal.innerHTML =
            '<div class="lm-modal-container" style="background: ' + t.pc + '; border-color: ' + t.b2 + '; width: 420px;">' +
                '<div class="lm-modal-header" style="background: ' + t.pc2 + '; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
                    '<div style="width: 100%; text-align: center; position: relative;">' +
                        '<span style="font-size: 17px; font-weight: 900; color: ' + t.tc + ';"><i class="fa fa-users"></i> Friends</span>' +
                        '<button class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: ' + t.tc + ';" onclick="document.getElementById(\'lm-friends-modal\').remove();">&times;</button>' +
                    '</div>' +
                '</div>' +
                '<div id="lm-friends-summary" style="padding: 8px 20px; text-align: center; font-size: 12px; color: ' + t.tc2 + '; font-weight: 600; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06);"></div>' +
                '<div id="lm-friends-content" class="lm-modal-body" style="padding: 12px 16px; min-height: 200px; max-height: 400px; overflow-y: auto;">' +
                    '<div style="text-align: center; padding: 40px; color: ' + t.tc2 + ';">' +
                        '<div class="spinner" style="width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: ' + t.mc + '; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>' +
                        'Requesting friend list from server...' +
                    '</div>' +
                '</div>' +
                '<div style="padding: 12px 20px; text-align: center; background: ' + t.pc2 + '; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px; justify-content: center;">' +
                    '<button id="lm-friends-refresh-btn" onclick="window._refreshFriendsList();" style="background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 800; padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px;">🔄 Refresh</button>' +
                    '<button onclick="document.getElementById(\'lm-friends-modal\').remove();" style="background: rgba(255,255,255,0.08); color: ' + t.tc + '; font-weight: 800; padding: 8px 20px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; font-size: 12px;">Close</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Listen for friend list update
        window._friendsModalListener = function(e) {
            window._renderFriendsList(e.detail);
        };
        document.addEventListener('friendListUpdate', window._friendsModalListener);

        // If we already have cached data, render it immediately while we fetch new
        if (window._friendListData) {
            window._renderFriendsList(window._friendListData);
        }

        // Request fresh data from server
        window._refreshFriendsList();
    };

    window._refreshFriendsList = function() {
        var content = document.getElementById('lm-friends-content');
        var t = getTheme();
        if (content && (!window._friendListData || !window._friendListData.friends.length)) {
            content.innerHTML =
                '<div style="text-align: center; padding: 40px; color: ' + t.tc2 + ';">' +
                    '<div class="spinner" style="width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: ' + t.mc + '; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>' +
                    'Requesting friend list...' +
                '</div>';
        }

        // Send opcode 147 request
        if (window.application && typeof window.application.requestFriendListUpdate === 'function') {
            window.application.requestFriendListUpdate();
        } else if (window.core && window.core.proxyMobileData) {
            // Try direct proto send
            try {
                window.application.requestFriendListUpdate();
            } catch(e) {
                console.warn('[Friends] Could not request friend list:', e);
            }
        }

        // If no data arrives within 5s, show empty state
        setTimeout(function() {
            var modal = document.getElementById('lm-friends-modal');
            var content = document.getElementById('lm-friends-content');
            if (modal && content && content.querySelector('.spinner')) {
                window._renderFriendsList({ friends: [], totalOnline: 0 });
            }
        }, 5000);
    };

    window._renderFriendsList = function(data) {
        var t = getTheme();
        var content = document.getElementById('lm-friends-content');
        var summary = document.getElementById('lm-friends-summary');
        if (!content) return;

        var friends = data.friends || [];
        var totalOnline = data.totalOnline || 0;

        // Update summary bar
        if (summary) {
            if (friends.length === 0) {
                summary.innerHTML = 'No friends found • <span style="color: ' + t.mc + ';">Log in with Facebook to see friends</span>';
            } else {
                summary.innerHTML = '<span style="color: #4caf50; font-weight: 800;">' + totalOnline + ' Online</span> • ' + friends.length + ' Total Friends';
            }
        }

        if (friends.length === 0) {
            content.innerHTML =
                '<div style="text-align: center; padding: 30px; color: ' + t.tc2 + ';">' +
                    '<div style="font-size: 40px; margin-bottom: 12px; opacity: 0.5;">👥</div>' +
                    '<div style="font-size: 14px; font-weight: 700; color: ' + t.tc + '; margin-bottom: 6px;">No Friends Found</div>' +
                    '<div style="font-size: 12px; color: ' + t.tc2 + '; line-height: 1.6;">' +
                        'Friends are loaded from your Facebook account.<br>' +
                        'Log in with Facebook in agar.io to see your friends who play.' +
                    '</div>' +
                '</div>';
            return;
        }

        // Sort: online first, then offline
        friends.sort(function(a, b) {
            var aOnline = (a.status === 1) ? 0 : 1;
            var bOnline = (b.status === 1) ? 0 : 1;
            return aOnline - bOnline;
        });

        var html = '';
        for (var i = 0; i < friends.length; i++) {
            var f = friends[i];
            var isOnline = (f.status === 1);
            var userId = f.userId || f.user_id || '';
            var realm = f.realmInfo || f.realm_info || null;
            var avatarUrl = (realm && (realm.avatarUrl || realm.avatar_url)) || '';

            // Status indicator
            var statusColor = isOnline ? '#4caf50' : '#666';
            var statusText = isOnline ? 'Online' : 'Offline';

            // Realm/server info
            var realmText = '';
            if (isOnline && realm) {
                var realmId = realm.realmId || realm.realm_id || '';
                var realmType = realm.realm || 0;
                var realmName = '';
                // Map realm types
                switch (realmType) {
                    case 1: realmName = 'FFA'; break;
                    case 2: realmName = 'Teams'; break;
                    case 3: realmName = 'Experimental'; break;
                    case 4: realmName = 'Party'; break;
                    case 5: realmName = 'Battle Royale'; break;
                    default: realmName = 'Playing'; break;
                }
                if (realmId) realmName += ' (' + realmId.substring(0, 8) + ')';
                realmText = '<div style="font-size: 10px; color: #2196f3; font-weight: 600; margin-top: 2px;">🎮 ' + realmName + '</div>';
            }

            // Display name: extract from userId or show truncated ID
            var displayId = userId;
            if (userId.length > 20) displayId = userId.substring(0, 8) + '...' + userId.substring(userId.length - 6);

            // Avatar
            var avatarHtml = '';
            if (avatarUrl) {
                avatarHtml = '<img src="' + avatarUrl + '" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; object-fit: cover;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">';
                avatarHtml += '<div style="display: none; width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; background: rgba(255,255,255,0.08); align-items: center; justify-content: center; font-size: 18px;">👤</div>';
            } else {
                avatarHtml = '<div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 18px;">👤</div>';
            }

            // Spectate button (only for online friends with realm info)
            var actionHtml = '';
            if (isOnline && realm) {
                var realmIdForJoin = realm.realmId || realm.realm_id || '';
                if (realmIdForJoin) {
                    actionHtml = '<button onclick="window._spectacteFriend(\'' + realmIdForJoin.replace(/'/g, "\\'") + '\');" style="background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 800; padding: 4px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 10px; white-space: nowrap;">👁 Spectate</button>';
                }
            }

            html += '<div style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,' + (isOnline ? '0.06' : '0.02') + '); border: 1px solid rgba(255,255,255,' + (isOnline ? '0.1' : '0.04') + '); margin-bottom: 6px;' + (isOnline ? '' : ' opacity: 0.7;') + '">' +
                avatarHtml +
                '<div style="flex: 1; min-width: 0;">' +
                    '<div style="display: flex; align-items: center; gap: 6px;">' +
                        '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + statusColor + '; flex-shrink: 0;' + (isOnline ? ' box-shadow: 0 0 6px ' + statusColor + ';' : '') + '"></div>' +
                        '<span style="font-weight: 700; font-size: 13px; color: ' + t.tc + '; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + displayId + '</span>' +
                    '</div>' +
                    '<div style="font-size: 10px; color: ' + statusColor + '; font-weight: 600;">' + statusText + '</div>' +
                    realmText +
                '</div>' +
                '<div style="flex-shrink: 0;">' + actionHtml + '</div>' +
            '</div>';
        }

        content.innerHTML = html;
    };

    window._spectacteFriend = function(realmId) {
        // Try to join the friend's server to spectate
        if (!realmId) return;
        console.log('[Friends] Spectating friend on realm:', realmId);

        // Close the modal
        var modal = document.getElementById('lm-friends-modal');
        if (modal) modal.remove();

        // Join the server
        if (typeof window.joinGame === 'function') {
            try { window.joinGame(realmId); } catch(e) {}
        } else if (window.core && typeof window.core.connect === 'function') {
            try { window.core.connect(realmId); } catch(e) {}
        }

        toastr && toastr.info('<b>[Friends]:</b> Joining friend\'s server: ' + realmId.substring(0, 12) + '...');
    };

    // Clean up listener when modal is removed
    var friendsModalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.removedNodes.forEach(function(node) {
                if (node.id === 'lm-friends-modal' && window._friendsModalListener) {
                    document.removeEventListener('friendListUpdate', window._friendsModalListener);
                    window._friendsModalListener = null;
                }
            });
        });
    });
    friendsModalObserver.observe(document.body, { childList: true });

    window.showPotionsHelpModal = function(activeTabName) {
        injectStyles();
        var t = getTheme();
        var currentTab = activeTabName || 'rewards';

        var old = document.getElementById('lm-potions-help-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna !== undefined && window.application.user.dna !== null) ? window.application.user.dna : (window.userDna || 0);
        var coinsBalance = (window.application && window.application.user && window.application.user.coins !== undefined && window.application.user.coins !== null) ? window.application.user.coins : (window.userCoins || 0);

        var modal = document.createElement('div');
        modal.id = 'lm-potions-help-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

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
                var potionHelpItems = (window.PotionHelpConfig && window.PotionHelpConfig.length) ? window.PotionHelpConfig :
                                      ((window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig["Visual - Potion Help"]) ||
                                       (window.LMAgarGameConfiguration && window.LMAgarGameConfiguration.gameConfig && window.LMAgarGameConfiguration.gameConfig["Visual - Potion Help"]));
                
                if (potionHelpItems && potionHelpItems.length) {
                    var tierColors = { "potion_common": "#4caf50", "potion_rare": "#2196f3", "potion_exotic": "#e91e63", "potion_mystical": "#ffb300", "potion_superior": "#4caf50", "potion_epic": "#00bcd4", "potion_legendary": "#e91e63", "potion_mythical": "#ffb300", "Common": "#4caf50", "Rare": "#2196f3", "Exotic": "#e91e63", "Mystical": "#ffb300" };
                    for (var p = 0; p < potionHelpItems.length; p++) {
                        var ph = potionHelpItems[p];
                        var pColor = tierColors[ph.potionId] || t.mc;
                        var specText = (ph.minSpecialPieces && ph.minSpecialPieces !== '0') ? ` <span style="font-size: 10px; color: ${pColor};">(${ph.minSpecialPieces})</span>` : '';
                        var coinVal = (ph.coinText && ph.coinText !== 'na') ? ('💰 ' + ph.coinText) : '<span style="opacity: 0.5;">—</span>';
                        var nameLabel = (ph.potionId || 'Potion').replace('potion_', '').replace(/\b\w/g, function(c){return c.toUpperCase();});
                        rowsHtml += `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                                <div style="width: 130px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${pColor}; font-size: 13px;">
                                    🧪 ${nameLabel}
                                </div>
                                <div style="width: 150px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">
                                    ${ph.skinPieces || 'x1'}${specText}
                                </div>
                                <div style="width: 100px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                    ${coinVal}
                                </div>
                                <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                    🏆 x1
                                </div>
                                <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                    and more!
                                </div>
                            </div>
                        `;
                    }
                } else {
                    rowsHtml = `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #4caf50; font-size: 13px;">🧪 Common</div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">x1</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">💰 +Coins</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">🏆 x1</div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">and more!</div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #2196f3; font-size: 13px;">🧪 Rare</div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">x3</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">💰 ++Coins</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">🏆 x2</div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">and more!</div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #e91e63; font-size: 13px;">🧪 Exotic</div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 11px;">x4 <span style="font-size: 10px; color: #ff4081;">(At least x1 Special)</span></div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">💰 +++Coins</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">🏆 x3</div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">and more!</div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                            <div style="width: 110px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #ffb300; font-size: 13px;">🧪 Mystical</div>
                            <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 11px;">x6 <span style="font-size: 10px; color: #ffd700;">(At least x3 Special)</span></div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">💰 ++++Coins</div>
                            <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">🏆 x3</div>
                            <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">and more!</div>
                        </div>
                    `;
                }

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
                        ${rowsHtml}
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

    window.openDailyDealsModal = function() {
        if (typeof window.SpecialDeals === 'function') {
            window.SpecialDeals('deals');
        } else if (typeof window.BeforeSpecialDeals === 'function') {
            window.BeforeSpecialDeals();
        }
    };
    window.showDailyDealsCarouselModal = function() {
        window.openDailyDealsModal();
    };

    window.showShopModal = function() {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-main-shop-modal');
        if (old) old.remove();

        var dnaBalance = (window.application && window.application.user && window.application.user.dna !== undefined && window.application.user.dna !== null) ? window.application.user.dna : (window.userDna || 0);
        var coinsBalance = (window.application && window.application.user && window.application.user.coins !== undefined && window.application.user.coins !== null) ? window.application.user.coins : (window.userCoins || 0);

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
                    if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
                    else if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
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

        var potionHelpItems = (window.PotionHelpConfig && window.PotionHelpConfig.length) ? window.PotionHelpConfig :
                              ((window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig["Visual - Potion Help"]) ||
                               (window.LMAgarGameConfiguration && window.LMAgarGameConfiguration.gameConfig && window.LMAgarGameConfiguration.gameConfig["Visual - Potion Help"]));

        var ph = (potionHelpItems || []).find(function(item) {
            if (!item || !item.potionId) return false;
            var id = String(item.potionId).toLowerCase();
            var target = String(pType).toLowerCase();
            return id === target || id === ('potion_' + target) || id.replace('potion_', '') === target.replace('potion_', '');
        });

        var tierColors = { "potion_superior": "#4caf50", "potion_epic": "#00bcd4", "potion_legendary": "#e91e63", "potion_mystical": "#ffb300" };
        var pColor = tierColors[pType] || tierColors['potion_' + pType] || '#00bcd4';
        
        var nameStr = (ph && ph.potionId) ? ph.potionId.replace('potion_', '').replace(/\b\w/g, function(c){return c.toUpperCase();}) + ' Potion' : (pType.replace('potion_', '').replace(/\b\w/g, function(c){return c.toUpperCase();}) + ' Potion');
        var coinsStr = (ph && ph.coinText && ph.coinText !== 'na') ? ph.coinText : ((pType.indexOf('superior') !== -1) ? '150 - 300' : ((pType.indexOf('epic') !== -1) ? '420 - 650' : ((pType.indexOf('legendary') !== -1) ? '720 - 900' : '950 - 1500')));
        var piecesStr = (ph && ph.skinPieces) ? ('x' + ph.skinPieces) : 'x2';
        var specialPiecesStr = (ph && ph.minSpecialPieces && ph.minSpecialPieces !== '0') ? ('x' + ph.minSpecialPieces + ' Special') : '';

        var p = {
            name: nameStr,
            icon: '🧪',
            iconColor: pColor,
            coins: coinsStr,
            skinPieces: piecesStr,
            specialText: specialPiecesStr
        };

        var old = document.getElementById('lm-potion-detail-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-potion-detail-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000010';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

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

        var dnaBalance = (window.application && window.application.user && window.application.user.dna !== undefined && window.application.user.dna !== null) ? window.application.user.dna : (window.userDna || 0);
        var coinsBalance = (window.application && window.application.user && window.application.user.coins !== undefined && window.application.user.coins !== null) ? window.application.user.coins : (window.userCoins || 0);

        var modal = document.createElement('div');
        modal.id = 'lm-premium-potions-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

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

        var dnaBalance = (window.application && window.application.user && window.application.user.dna !== undefined && window.application.user.dna !== null) ? window.application.user.dna : (window.userDna || 0);
        var coinsBalance = (window.application && window.application.user && window.application.user.coins !== undefined && window.application.user.coins !== null) ? window.application.user.coins : (window.userCoins || 0);

        var userBoosts = (window.application && window.application.user && window.application.user.boosts) || window.userBoosts || {};
        var count_2x_1h = userBoosts.xp_2x_1h || userBoosts['xp_boost_2x_1h'] || 0;
        var count_2x_24h = userBoosts.xp_2x_24h || userBoosts['xp_boost_2x_24h'] || 0;
        var count_3x_1h = userBoosts.xp_3x_1h || userBoosts['xp_boost_3x_1h'] || 0;
        var count_3x_24h = userBoosts.xp_3x_24h || userBoosts['xp_boost_3x_24h'] || 0;

        var modal = document.createElement('div');
        modal.id = 'lm-xp-boost-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

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
            pop.style.zIndex = '1000020';
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

        var dnaBalance = (window.application && window.application.user && window.application.user.dna !== undefined && window.application.user.dna !== null) ? window.application.user.dna : (window.userDna || 0);
        var coinsBalance = (window.application && window.application.user && window.application.user.coins !== undefined && window.application.user.coins !== null) ? window.application.user.coins : (window.userCoins || 0);

        var userBoosts = (window.application && window.application.user && window.application.user.boosts) || window.userBoosts || {};
        var count_2x_1h = userBoosts.mass_2x_1h || userBoosts['mass_boost_2x_1h'] || 0;
        var count_2x_24h = userBoosts.mass_2x_24h || userBoosts['mass_boost_2x_24h'] || 0;
        var count_3x_1h = userBoosts.mass_3x_1h || userBoosts['mass_boost_3x_1h'] || 0;
        var count_3x_24h = userBoosts.mass_3x_24h || userBoosts['mass_boost_3x_24h'] || 0;

        var modal = document.createElement('div');
        modal.id = 'lm-mass-boost-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: #ffffff; border-radius: 16px; width: 680px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="document.getElementById('lm-mass-boost-modal').remove(); if(window.showShopModal) window.showShopModal();" style="width: 32px; height: 32px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,211,255,0.4);" title="Back to Shop">‹</button>
                        <div style="font-size: 22px; font-weight: 900; color: #444; letter-spacing: 0.5px;">Starting Mass Boost</div>
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
                        <button onclick="window.showBoostInfoPopover('Double Starting Mass', 'Starts every match with double starting mass (e.g. 50 mass instead of 25).');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Double Starting Mass</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #00b0ff 0%, #0091ea 100%); border-radius: 50%; box-shadow: inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 12px rgba(0,145,234,0.4); border: 3px solid #fff;">
                                <div style="font-size: 54px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">M</div>
                                <div style="position: absolute; bottom: -4px; right: -4px; font-size: 20px; font-weight: 900; color: #fff; background: #0288d1; border: 2px solid #fff; border-radius: 12px; padding: 2px 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">2X</div>
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
                        <button onclick="window.showBoostInfoPopover('Triple Starting Mass', 'Starts every match with triple starting mass (e.g. 75 mass instead of 25).');" style="position: absolute; right: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: none; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">?</button>

                        <div>
                            <div style="font-size: 17px; font-weight: 900; color: #333; margin-bottom: 12px;">Triple Starting Mass</div>
                            
                            <div style="position: relative; margin: 10px auto; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #00b0ff 0%, #0091ea 100%); border-radius: 50%; box-shadow: inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 12px rgba(0,145,234,0.4); border: 3px solid #fff;">
                                <div style="font-size: 54px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">M</div>
                                <div style="position: absolute; bottom: -4px; right: -4px; font-size: 20px; font-weight: 900; color: #fff; background: #0288d1; border: 2px solid #fff; border-radius: 12px; padding: 2px 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">3X</div>
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
            if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
            else if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
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

        if (window.application) {
            if (typeof window.application.activateTimedEvent === 'function') {
                window.application.activateTimedEvent("hourlyBonus");
                window.application.activateTimedEvent("dailyQuest");
            }
            if (typeof window.application.claimGifts === 'function') {
                window.application.claimGifts(["all"]);
            }
        }
        if (typeof window.activateUserRewards === 'function') {
            window.activateUserRewards(['hourlyBonus', 'dailyQuest', 'freeCoins']);
        }
        if (typeof window.claimGifts === 'function' && (!window.application || !window.application.claimGifts)) {
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

    window.getHourlyBonusTimeLeftString = function() {
        var ms = (window.application && typeof window.application.freeCoinTimeLeft === 'function') 
            ? window.application.freeCoinTimeLeft() 
            : (window.hourlyBonusFinalTimer ? Math.max(0, window.hourlyBonusFinalTimer - Date.now()) : 0);
        if (ms <= 0) return 'READY!';
        var totalSec = Math.floor(ms / 1000);
        var mins = Math.floor(totalSec / 60);
        var secs = totalSec % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    };

    // Inject "Daily Deal", "Leagues", and "Friends" buttons into Profile Tab (#profile) panel
    function initMenuButtons() {
        var profileTab = $('#profile');
        if (!profileTab.length) return;

        if (document.getElementById('lm-daily-deal-btn')) {
            // Ensure button group is inside #profile
            if (!$.contains(profileTab[0], document.getElementById('lm-daily-deal-btn'))) {
                $('#lm-extended-menu-btns').appendTo(profileTab.find('.agario-profile-panel').length ? profileTab.find('.agario-profile-panel') : profileTab);
            }
            return;
        }

        var targetContainer = profileTab.find('.agario-profile-panel').length ? profileTab.find('.agario-profile-panel') : profileTab;

        var btnGroup = document.createElement('div');
        btnGroup.id = 'lm-extended-menu-btns';
        btnGroup.style.cssText = 'display: flex; gap: 6px; margin: 10px 0; justify-content: space-between; width: 100%; box-sizing: border-box; clear: both;';
        btnGroup.innerHTML = `
            <button id="lm-daily-deal-btn" class="btn btn-danger btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px;" onclick="if(typeof window.openDailyDealsModal==='function'){window.openDailyDealsModal();}else if(typeof window.SpecialDeals==='function'){window.SpecialDeals('deals');}">
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

        var uid = appUser.socialId || appUser.id || window.agarioUID || window.agarioEncodedUID || '';
        if (uid) {
            $('#UserProfileUID1').val(uid).text(uid);
            $('#UserProfileUUID1').val(uid);
        }

        // Disable Agar.io Skins buttons if not logged in or missing UID
        var isLoggedIn = !!(appUser.authenticated || window.loggedIn || appUser.socialId || appUser.id);
        var hasUID = !!(uid || localStorage.getItem("agarioEncodedUID") || localStorage.getItem("agarioUID"));
        var skinBtnEnabled = isLoggedIn && hasUID;
        var skinBtns = $('#SpecialDealsBtn, #SpecialDealsQuickBtn, .lm-skins-btn');
        skinBtns.prop('disabled', !skinBtnEnabled);
        if (!skinBtnEnabled) {
            skinBtns.css({ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }).attr('title', 'Log in with Google/Facebook and play a game first to access Agar.io Skins');
        } else {
            skinBtns.css({ opacity: 1, cursor: 'pointer', pointerEvents: 'auto' }).removeAttr('title');
        }

        // 3. XP Progress Bar & Level
        var xp = appUser.xp || 0;
        var nextXp = appUser.nextLevelXp || appUser.nextXp || 1000;
        var level = appUser.level || 1;

        var percent = Math.min(100, Math.max(0, Math.round((xp / nextXp) * 100))) || 0;
        $('.agario-exp-bar .progress-bar').css('width', percent + '%');
        var xpText = level >= 100 ? 'MAX LEVEL (' + level + ')' : xp.toLocaleString() + ' / ' + nextXp.toLocaleString() + ' XP';
        $('.agario-exp-bar .progress-bar-text').text(xpText);
        $('.progress-bar-star').text(level);

        // 4. Potions Slot Rendering & Protocol Wiring (Opcodes 120, 122, 124)
        var potions = appUser.potions || window.lastPotionsData || [];
        if (!window.LM) window.LM = {};
        if (!window.LM.user) window.LM.user = {};
        if (!window.LM.user.potionsStatus) window.LM.user.potionsStatus = {};

        var potionsContainer = $('#potions, .potions-container');
        if (potionsContainer.length) {
            potionsContainer.css({ position: 'relative', overflow: 'visible' });
            if (!document.getElementById('lm-potions-help-btn')) {
                var helpBtn = $('<button id="lm-potions-help-btn" onclick="if(typeof window.showPotionsHelpModal===\'function\'){window.showPotionsHelpModal(\'rewards\');}else if(typeof window.showPremiumPotionsModal===\'function\'){window.showPremiumPotionsModal();} return false;" style="position: absolute; right: -28px; top: 4px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: 2px solid #fff; font-weight: 900; font-size: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.4); z-index: 9999; line-height: 1; text-align: center; padding: 0; pointer-events: auto;" title="Potions Help">?</button>');
                potionsContainer.append(helpBtn);
            }
        }
        $(document).off('click', '#lm-potions-help-btn').on('click', '#lm-potions-help-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.showPotionsHelpModal === 'function') window.showPotionsHelpModal('rewards');
            else if (typeof window.showPremiumPotionsModal === 'function') window.showPremiumPotionsModal();
            return false;
        });

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
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('buy boost')) return false;
            var val = $('#s-boost').val();
            if (!val) { toastr.warning('Please select a boost first.'); return; }
            if (typeof window.softPurchase === 'function') window.softPurchase(val);
        });

        $(document).off('click', '#use-boost').on('click', '#use-boost', function(e) {
            e.preventDefault();
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('use boost')) return false;
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
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('access Weekly Leagues')) {
                return false;
            }
            if (typeof window.showLeaguesModal === 'function') window.showLeaguesModal();
        });

        $(document).off('click', '#lm-friends-btn').on('click', '#lm-friends-btn', function(e) {
            e.preventDefault();
            if (typeof window.showFriendsModal === 'function') window.showFriendsModal();
        });

        $(document).off('click', '#lm-daily-deal-btn').on('click', '#lm-daily-deal-btn', function(e) {
            e.preventDefault();
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('access Special Deals')) {
                return false;
            }
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
