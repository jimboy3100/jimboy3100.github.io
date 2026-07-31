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

    // ─── Component 1: 🏆 Weekly Leagues Modal ───
    window.showLeaguesModal = function() {
        injectStyles();
        var t = getTheme();
        var old = document.getElementById('lm-leagues-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-leagues-modal';
        modal.className = 'lm-modal-overlay';
        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.mc};">
                <div class="lm-modal-header" style="background: ${t.pc2};">
                    <div class="lm-modal-title" style="color: ${t.mc};">
                        <span>🏆</span> Weekly League Standings
                    </div>
                    <button class="lm-modal-close" onclick="document.getElementById('lm-leagues-modal').remove();">&times;</button>
                </div>
                <div class="lm-modal-body" id="lm-leagues-body">
                    <div style="text-align: center; padding: 30px; color: ${t.tc2};">
                        <i class="fa fa-spinner fa-spin fa-2x"></i><br><br>Fetching Weekly League Standings...
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Fetch data
        if (typeof window.requestLeaguesInfo === 'function') {
            window.requestLeaguesInfo(1);
        }
    };

    // Listen to leagues update event
    document.addEventListener('leaguesInfoUpdate', function(e) {
        var data = e.detail;
        var body = document.getElementById('lm-leagues-body');
        if (!body || !data) return;

        var t = getTheme();
        var html = '';

        if (data.leagueName) {
            html += `<div style="text-align: center; margin-bottom: 16px; font-weight: 700; color: ${t.mc}; font-size: 16px;">
                Current Tier: ${data.leagueName.toUpperCase()}
            </div>`;
        }

        if (data.leagueEntries && data.leagueEntries.length) {
            data.leagueEntries.forEach(function(entry, idx) {
                var rank = idx + 1;
                var badgeClass = rank === 1 ? 'lm-rank-1' : (rank === 2 ? 'lm-rank-2' : (rank === 3 ? 'lm-rank-3' : 'lm-rank-other'));
                var name = entry.displayName || ('Player ' + (entry.userId || rank));
                var score = entry.score !== undefined ? entry.score.toLocaleString() : '0';

                html += `
                    <div class="lm-league-card">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="lm-rank-badge ${badgeClass}">${rank}</div>
                            <div style="font-weight: 600; color: ${t.tc};">${name}</div>
                        </div>
                        <div style="font-weight: 700; color: ${t.mc};">${score} XP</div>
                    </div>
                `;
            });
        } else {
            html += `<div style="text-align: center; padding: 20px; color: ${t.tc2};">No league participants recorded yet this week.</div>`;
        }

        body.innerHTML = html;
    });

    // ─── Component 2: 👥 Friends & Party Joiner Panel ───
    window.showFriendsModal = function() {
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
    };

    document.addEventListener('friendListUpdate', function(e) {
        var data = e.detail;
        var body = document.getElementById('lm-friends-body');
        if (!body || !data) return;

        var t = getTheme();
        var friends = data.friends || data || [];
        var html = '';

        if (Array.isArray(friends) && friends.length) {
            friends.forEach(function(friend) {
                var isOnline = friend.online || friend.isOnline;
                var statusClass = isOnline ? 'lm-status-online' : 'lm-status-offline';
                var name = friend.displayName || friend.name || 'Friend';
                var partyToken = friend.partyToken || friend.partyCode || '';

                html += `
                    <div class="lm-friend-card">
                        <div style="display: flex; align-items: center;">
                            <span class="lm-status-dot ${statusClass}"></span>
                            <span style="font-weight: 600; color: ${t.tc};">${name}</span>
                        </div>
                        <div>
                            ${partyToken ? `<button class="btn" style="background: ${t.b1}; color: ${t.btc}; padding: 4px 12px; border-radius: 6px; font-weight: 700; border: none; cursor: pointer;" onclick="$('#party-token, #joinPartyToken').val('${partyToken}'); if(window.app && typeof window.app.joinParty === 'function') { window.app.joinParty(); } else { $('#join-party-btn').click(); } var m=document.getElementById('lm-friends-modal'); if(m) m.remove();">🎮 Join Party</button>` : `<span style="font-size: 12px; color: ${t.tc2};">${isOnline ? 'In Lobby' : 'Offline'}</span>`}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<div style="text-align: center; padding: 20px; color: ${t.tc2};">No friends currently connected or logged in with Facebook/Miniclip.</div>`;
        }

        body.innerHTML = html;
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

    // Inject "Claim All" and "Leagues" and "Friends" buttons into menu header
    function initMenuButtons() {
        if (document.getElementById('lm-claim-all-btn')) return;

        var targetContainer = $('#main-menu #play-outer, .side-buttons, #top-nav-buttons').first();
        if (!targetContainer.length) targetContainer = $('body');

        var t = getTheme();
        var btnGroup = document.createElement('div');
        btnGroup.id = 'lm-extended-menu-btns';
        btnGroup.style.cssText = 'display: flex; gap: 8px; margin: 10px 0; justify-content: center; flex-wrap: wrap; z-index: 999;';
        btnGroup.innerHTML = `
            <button id="lm-claim-all-btn" class="btn" style="background: linear-gradient(135deg, ${t.b1}, ${t.b2}); color: ${t.btc}; font-weight: 700; border-radius: 8px; border: none; padding: 8px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onclick="window.claimAllRewardsAndGifts();">
                🎁 Claim All
            </button>
            <button id="lm-leagues-btn" class="btn" style="background: linear-gradient(135deg, ${t.b3}, ${t.b4}); color: ${t.btc}; font-weight: 700; border-radius: 8px; border: none; padding: 8px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onclick="window.showLeaguesModal();">
                🏆 Leagues
            </button>
            <button id="lm-friends-btn" class="btn" style="background: linear-gradient(135deg, ${t.b1}, ${t.b3}); color: ${t.btc}; font-weight: 700; border-radius: 8px; border: none; padding: 8px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onclick="window.showFriendsModal();">
                👥 Friends
            </button>
        `;

        targetContainer.prepend(btnGroup);
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
            setInterval(syncProfileTabUI, 2500);
        }, 1000);
    });

})();
