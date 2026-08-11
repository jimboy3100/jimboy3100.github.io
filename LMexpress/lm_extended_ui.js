/**
 * Legend Mod Extended Features UI Module (LMexpress)
 * Implements Weekly Leagues, Friends & Party Joiner, Battle Royale HUD & Danger Circle,
 * Claim All Rewards, and Player Profile Stats Modal.
 * Styled dynamically matching active user theme colors (getShopTheme()).
 */

(function() {
    'use strict';

    if (window._lmExtendedUiInitDone) {
        return;
    }

    window._lmExtendedUiInitDone = true;

    /*
     * Install official promotion capture hooks.
     *
     * The official chain is:
     *   PromoService → delegate.showBadge(badge,system)
     *   → Core.ui.mainUI.showPromoBadge(badge)
     *   → loadResources(badgeConfig) → getButtonForOffer()
     *   → HTMLPromoButton.initWithConfig()
     *   → dispatches "promo_badge_create" on document
     *
     * If loadResources fails (CDN image loading), the event never fires.
     * We hook at TWO levels:
     *   1. The document event (for when the chain completes)
     *   2. Core.ui.mainUI.showPromoBadge directly (to capture even
     *      when loadResources fails)
     */
    (function installOfficialPromotionCaptureEarly() {
        if (window._lmOfficialPromotionListenerInstalled) {
            return;
        }

        window._lmOfficialPromotionListenerInstalled = true;

        if (window._lmOfficialPromotion === undefined) {
            window._lmOfficialPromotion = null;
        }

        /* Hook 1: The standard document event (when full chain succeeds) */
        document.addEventListener(
            'promo_badge_create',
            function(event) {
                var detail = event && event.detail ? event.detail : null;
                if (!detail) return;

                window._lmOfficialPromotion = {
                    offerId: detail.offerId,
                    config: detail.config || null,
                    delegate: detail.delegate || null,
                    system: detail.system || null,
                    callback: typeof detail.callback === 'function'
                        ? detail.callback : null,
                    receivedAt: Date.now()
                };

                console.log(
                    '[OFFICIAL OFFER] Captured via promo_badge_create event:',
                    window._lmOfficialPromotion
                );
            },
            true
        );

        /*
         * Hook 2: Wrap Core.ui.mainUI.showPromoBadge to capture the
         * badge BEFORE loadResources (which may fail).
         *
         * We retry this hook because Core.ui.mainUI may not exist yet
         * when lm_extended_ui.js loads.
         */
        var hookAttempts = 0;
        var maxHookAttempts = 30;

        function tryHookShowPromoBadge() {
            hookAttempts++;

            var mainUI = null;
            try {
                /* Try window.Core first (Haxe global) */
                if (
                    typeof Core !== 'undefined' &&
                    Core && Core.ui && Core.ui.mainUI &&
                    typeof Core.ui.mainUI.showPromoBadge === 'function'
                ) {
                    mainUI = Core.ui.mainUI;
                }
            } catch (e) { /* Core not available yet */ }

            if (!mainUI) {
                if (hookAttempts < maxHookAttempts) {
                    setTimeout(tryHookShowPromoBadge, 2000);
                }
                return;
            }

            if (mainUI._lmShowPromoBadgeHooked) return;
            mainUI._lmShowPromoBadgeHooked = true;

            var origShowPromoBadge = mainUI.showPromoBadge;

            mainUI.showPromoBadge = function(pBadge) {
                /* Capture the badge data immediately */
                try {
                    if (pBadge && typeof pBadge.get_offerId === 'function') {
                        var offerId = pBadge.get_offerId();
                        var badgeConfig = typeof pBadge.getBadgeConfiguration === 'function'
                            ? pBadge.getBadgeConfiguration() : null;
                        var callback = typeof pBadge.executeCallback === 'function'
                            ? function() { pBadge.executeCallback(); } : null;

                        if (offerId) {
                            window._lmOfficialPromotion = {
                                offerId: offerId,
                                config: badgeConfig ? badgeConfig.badgeConfiguration : null,
                                delegate: null,
                                system: pBadge.system || null,
                                callback: callback,
                                receivedAt: Date.now()
                            };

                            console.log(
                                '[OFFICIAL OFFER] Captured via showPromoBadge hook:',
                                window._lmOfficialPromotion
                            );
                        }
                    }
                } catch (captureError) {
                    console.warn(
                        '[OFFICIAL OFFER] Badge capture in showPromoBadge hook failed:',
                        captureError
                    );
                }

                /* Call original so the standard chain continues */
                if (origShowPromoBadge) {
                    return origShowPromoBadge.apply(this, arguments);
                }
            };

            console.log('[OFFICIAL OFFER] showPromoBadge hook installed on Core.ui.mainUI');
        }

        /* Start trying after a short delay to let Core initialize */
        setTimeout(tryHookShowPromoBadge, 3000);
    })();

    // ─── Theme Resolver Helper ───
    function getTheme() {
        var ds = window.defaultSettings || {};
        var external = {};

        if (typeof window.getShopTheme === 'function') {
            try { external = window.getShopTheme() || {}; }
            catch (themeError) {
                console.warn('[LM UI] getShopTheme() failed:', themeError);
                external = {};
            }
        }

        var theme = {
            mc:  external.mc  || ds.menuMainColor    || '#01d9cc',
            pc:  external.pc  || external.bg || ds.menuPanelColor  || '#00243e',
            pc2: external.pc2 || external.panelBg || ds.menuPanelColor2 || '#002f52',
            tc:  external.tc  || external.tc1 || ds.menuTextColor  || '#ffffff',
            tc2: external.tc2 || ds.menuTextColor2   || '#8096a7',
            b1:  external.b1  || ds.btn1Color        || '#018cf6',
            b1h: external.b1h || ds.btn1Color2       || '#0176ce',
            b2:  external.b2  || ds.btn2Color        || '#00b9e8',
            b3:  external.b3  || ds.btn3Color        || '#8d5fe6',
            b4:  external.b4  || ds.btn4Color        || '#bf00aa',
            b4h: external.b4h || ds.btn4Color2       || '#a80096',
            btc: external.btc || ds.menuBtnTextColor  || '#ffffff'
        };

        /* Compatibility aliases for newer Shop renderers */
        theme.bg      = external.bg      || theme.pc;
        theme.panelBg = external.panelBg || theme.pc2;
        theme.cardBg  = external.cardBg  || theme.pc;
        theme.tc1     = external.tc1     || theme.tc;
        theme.border  = external.border  || 'rgba(255,255,255,0.12)';

        return theme;
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
            /* XP Bar Alignment on Profile Panel ONLY */
            #profile .agario-profile-panel .agario-exp-bar {
                margin-left: 0 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Component 1: 🏆 Leaderboards & Weekly Leagues Modal ───
    window.currentLeagueTab = 1; // 1 = My League, 2 = Country, 3 = World, 4 = Friends

    /*
     * ═════════════════════════════════════════════════════════════════════
     * CONFIG-DRIVEN LEAGUE TIER PRESENTATION
     * ═════════════════════════════════════════════════════════════════════
     *
     * RANGE / NAME:
     *
     *      Leagues - Tiers
     *
     * PRESENTATION:
     *
     *      LM theme layer
     *
     * Do not hardcode account-level thresholds here anymore.
     */


    window._lmLeaguePresentation =
        {
            fly: {
                color:
                    '#8f7e3a',

                gradient:
                    'linear-gradient(135deg, #8f7e3a 0%, #5d4037 100%)'
            },

            wasp: {
                color:
                    '#ca8f01',

                gradient:
                    'linear-gradient(135deg, #ca8f01 0%, #f57f17 100%)'
            },

            bat: {
                color:
                    '#a822c7',

                gradient:
                    'linear-gradient(135deg, #a822c7 0%, #4a148c 100%)'
            },

            fox: {
                color:
                    '#f36101',

                gradient:
                    'linear-gradient(135deg, #f36101 0%, #e65100 100%)'
            },

            hunter: {
                color:
                    '#f62000',

                gradient:
                    'linear-gradient(135deg, #f62000 0%, #b71c1c 100%)'
            },

            bear: {
                color:
                    '#8b4a1f',

                gradient:
                    'linear-gradient(135deg, #8b4a1f 0%, #4e270d 100%)'
            },

            panther: {
                color:
                    '#4d4643',

                gradient:
                    'linear-gradient(135deg, #4d4643 0%, #212121 100%)'
            },

            crocodile: {
                color:
                    '#1b8b05',

                gradient:
                    'linear-gradient(135deg, #1b8b05 0%, #0d4702 100%)'
            },

            mammoth: {
                color:
                    '#7b6750',

                gradient:
                    'linear-gradient(135deg, #7b6750 0%, #4e3629 100%)'
            },

            kraken: {
                color:
                    '#029070',

                gradient:
                    'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)'
            }
        };


    window.getLeagueTierFromLevel =
        function (
            level
        ) {
            var configuredTier =
                typeof window
                    .getAgarLeagueTierFromLevel ===
                    'function'
                    ? window
                        .getAgarLeagueTierFromLevel(
                            level
                        )
                    : null;


            var theme =
                getTheme();


            /*
             * Configuration may not have arrived during the first few
             * milliseconds of page startup.
             *
             * Do NOT recreate the old level threshold ladder as fallback.
             */
            if (
                !configuredTier
            ) {
                return {
                    id:
                        'unknown',

                    configName:
                        '',

                    name:
                        'League',

                    color:
                        theme.mc,

                    gradient:
                        'linear-gradient(135deg, ' +
                        theme.b1 +
                        ' 0%, ' +
                        theme.b3 +
                        ' 100%)',

                    levelFrom:
                        null,

                    levelTo:
                        null,

                    spread:
                        0,

                    topSize:
                        0,

                    raw:
                        null
                };
            }


            var presentation =
                window
                    ._lmLeaguePresentation[
                        configuredTier.id
                    ] ||
                {};


            return {
                id:
                    configuredTier.id,

                configName:
                    configuredTier
                        .configName,

                name:
                    configuredTier.name,

                color:
                    presentation.color ||
                    theme.mc,

                gradient:
                    presentation.gradient ||
                    (
                        'linear-gradient(135deg, ' +
                        theme.b1 +
                        ' 0%, ' +
                        theme.b3 +
                        ' 100%)'
                    ),

                levelFrom:
                    configuredTier
                        .levelFrom,

                levelTo:
                    configuredTier
                        .levelTo,

                spread:
                    configuredTier
                        .spread,

                topSize:
                    configuredTier
                        .topSize,

                raw:
                    configuredTier
                        .raw
            };
        };

    window._escapeLeagueHtmlText = function(value) {
        if (
            typeof value !== 'string' &&
            typeof value !== 'number'
        ) {
            return '';
        }

        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    window._normalizeLeagueCountryCode = function(value) {
        if (typeof value !== 'string') {
            return 'us';
        }

        var normalized = value.trim().toLowerCase();

        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)
            ? normalized
            : 'us';
    };

    /*
     * The current-user identity is resolved exactly once from the authoritative
     * My League rows and is then reused across every leaderboard category.
     *
     * Never independently guess the user again in Country, World or Friends.
     */
    window._leagueCurrentUserIdentity =
        window._leagueCurrentUserIdentity ||
        null;

    window._normalizeLeagueIdentityId =
        function(value) {
            if (
                value === undefined ||
                value === null
            ) {
                return '';
            }

            var normalized =
                String(value).trim();

            if (!normalized) {
                return '';
            }

            /*
             * Some account sources contain:
             *
             *     google$UUID
             *     facebook$UUID
             *     discord$UUID
             *
             * League rows normally contain only the UUID section.
             */
            var dollarIndex =
                normalized.lastIndexOf('$');

            if (
                dollarIndex !== -1 &&
                dollarIndex + 1 <
                    normalized.length
            ) {
                normalized =
                    normalized.substring(
                        dollarIndex + 1
                    );
            }

            return normalized
                .trim()
                .toLowerCase();
        };

    window._normalizeLeagueIdentityName =
        function(value) {
            if (
                value === undefined ||
                value === null
            ) {
                return '';
            }

            return String(value)
                .trim()
                .toLowerCase();
        };

    window._getLeagueEntryIdentityId =
        function(entry) {
            if (!entry) {
                return '';
            }

            return window
                ._normalizeLeagueIdentityId(
                    entry.userId ||
                    entry.uid ||
                    entry.id ||
                    ''
                );
        };

    window._getLeagueEntryIdentityName =
        function(entry) {
            if (!entry) {
                return '';
            }

            return window
                ._normalizeLeagueIdentityName(
                    entry.displayName ||
                    entry.name ||
                    ''
                );
        };

    /*
     * Capture the real user exclusively from My League.
     *
     * Other categories must never redefine the identity. In particular, an
     * isUser flag found in Country or World is not trusted independently.
     */
    window._captureLeagueCurrentUserIdentity =
        function(data) {
            data =
                data || {};

            if (
                Number(
                    data.leagueRequestType
                ) !== 1
            ) {
                return window
                    ._leagueCurrentUserIdentity;
            }

            var leagueRows =
                Array.isArray(data.league)
                    ? data.league
                    : [];

            if (!leagueRows.length) {
                return window
                    ._leagueCurrentUserIdentity;
            }

            var selectedRow =
                null;

            var selectedSource =
                '';

            var knownIds =
                [];

            function addKnownId(value) {
                var normalized =
                    window
                        ._normalizeLeagueIdentityId(
                            value
                        );

                if (
                    normalized &&
                    knownIds.indexOf(
                        normalized
                    ) === -1
                ) {
                    knownIds.push(
                        normalized
                    );
                }
            }

            function selectRow(
                row,
                source
            ) {
                if (
                    selectedRow ||
                    !row
                ) {
                    return;
                }

                selectedRow =
                    row;

                selectedSource =
                    source || '';
            }

            /*
             * 1. Read authoritative account IDs.
             */
            var officialUser =
                null;

            try {
                if (
                    window.agarApp &&
                    window.agarApp.API &&
                    typeof window.agarApp.API
                        .getUserInfo ===
                        'function'
                ) {
                    officialUser =
                        window.agarApp.API
                            .getUserInfo();
                }
            } catch (
                officialUserError
            ) {
                officialUser =
                    null;
            }

            if (officialUser) {
                addKnownId(
                    officialUser.id
                );

                addKnownId(
                    officialUser.userId
                );

                if (
                    officialUser.userInfo
                ) {
                    addKnownId(
                        officialUser
                            .userInfo
                            .id
                    );

                    addKnownId(
                        officialUser
                            .userInfo
                            .userId
                    );
                }
            }

            var applicationUser =
                window.application &&
                window.application.user
                    ? window.application.user
                    : null;

            if (applicationUser) {
                addKnownId(
                    applicationUser.userId
                );

                addKnownId(
                    applicationUser.id
                );
            }

            try {
                if (
                    window.Core &&
                    window.Core.user
                ) {
                    addKnownId(
                        window.Core.user.id
                    );

                    addKnownId(
                        window.Core.user.userId
                    );

                    if (
                        window.Core.user
                            .userInfo
                    ) {
                        addKnownId(
                            window.Core.user
                                .userInfo
                                .id
                        );

                        addKnownId(
                            window.Core.user
                                .userInfo
                                .userId
                        );
                    }
                }
            } catch (
                coreIdentityError
            ) {
            }

            addKnownId(
                window.agarioUID
            );

            addKnownId(
                window.expandingLandUID
            );

            /*
             * Match a known account ID against My League.
             */
            for (
                var idIndex = 0;
                idIndex <
                    knownIds.length &&
                !selectedRow;
                idIndex++
            ) {
                for (
                    var rowIndex = 0;
                    rowIndex <
                        leagueRows.length;
                    rowIndex++
                ) {
                    var row =
                        leagueRows[
                            rowIndex
                        ];

                    if (
                        window
                            ._getLeagueEntryIdentityId(
                                row
                            ) ===
                        knownIds[idIndex]
                    ) {
                        selectRow(
                            row,
                            'account-id'
                        );

                        break;
                    }
                }
            }

            /*
             * 2. Use Agar.io's cached My League row, if available.
             */
            if (!selectedRow) {
                var cachedLeagueRow =
                    null;

                try {
                    if (
                        window.agarApp &&
                        window.agarApp.API &&
                        typeof window.agarApp.API
                            .getCachedDataLeague ===
                            'function'
                    ) {
                        cachedLeagueRow =
                            window.agarApp.API
                                .getCachedDataLeague();
                    } else if (
                        window.MC &&
                        typeof window.MC
                            .getCachedDataLeague ===
                            'function'
                    ) {
                        cachedLeagueRow =
                            window.MC
                                .getCachedDataLeague();
                    }
                } catch (
                    cachedLeagueError
                ) {
                    cachedLeagueRow =
                        null;
                }

                var cachedLeagueId =
                    window
                        ._getLeagueEntryIdentityId(
                            cachedLeagueRow
                        );

                if (cachedLeagueId) {
                    for (
                        var cachedIndex = 0;
                        cachedIndex <
                            leagueRows.length;
                        cachedIndex++
                    ) {
                        if (
                            window
                                ._getLeagueEntryIdentityId(
                                    leagueRows[
                                        cachedIndex
                                    ]
                                ) ===
                            cachedLeagueId
                        ) {
                            selectRow(
                                leagueRows[
                                    cachedIndex
                                ],
                                'official-cache'
                            );

                            break;
                        }
                    }
                }
            }

            /*
             * 3. Accept an explicit marker only inside My League.
             *
             * Require exactly one marked row. Multiple marked rows are treated
             * as invalid instead of arbitrarily selecting the first row.
             */
            if (!selectedRow) {
                var markedRows =
                    [];

                for (
                    var markerIndex = 0;
                    markerIndex <
                        leagueRows.length;
                    markerIndex++
                ) {
                    var markerRow =
                        leagueRows[
                            markerIndex
                        ];

                    if (
                        markerRow &&
                        (
                            markerRow.isUser ===
                                true ||
                            markerRow.isCurrentUser ===
                                true
                        )
                    ) {
                        markedRows.push(
                            markerRow
                        );
                    }
                }

                if (
                    markedRows.length === 1
                ) {
                    selectRow(
                        markedRows[0],
                        'my-league-marker'
                    );
                }
            }

            /*
             * 4. Use the authenticated display name only when it identifies
             * exactly one My League row.
             */
            if (!selectedRow) {
                var knownNames =
                    [];

                function addKnownName(
                    value
                ) {
                    var normalizedName =
                        window
                            ._normalizeLeagueIdentityName(
                                value
                            );

                    if (
                        normalizedName &&
                        normalizedName !==
                            'guest' &&
                        normalizedName !==
                            'you' &&
                        knownNames.indexOf(
                            normalizedName
                        ) === -1
                    ) {
                        knownNames.push(
                            normalizedName
                        );
                    }
                }

                if (officialUser) {
                    addKnownName(
                        officialUser.displayName
                    );

                    addKnownName(
                        officialUser.name
                    );

                    if (
                        officialUser.userInfo
                    ) {
                        addKnownName(
                            officialUser
                                .userInfo
                                .displayName
                        );

                        addKnownName(
                            officialUser
                                .userInfo
                                .name
                        );
                    }
                }

                if (applicationUser) {
                    addKnownName(
                        applicationUser
                            .displayName
                    );

                    addKnownName(
                        applicationUser.name
                    );
                }

                try {
                    if (
                        window.Core &&
                        window.Core.user &&
                        window.Core.user
                            .userInfo
                    ) {
                        addKnownName(
                            window.Core.user
                                .userInfo
                                .displayName
                        );

                        addKnownName(
                            window.Core.user
                                .userInfo
                                .name
                        );
                    }
                } catch (
                    coreNameError
                ) {
                }

                addKnownName(
                    window.agarioProfileName
                );

                var profileNameElement =
                    document.querySelector(
                        '.agario-profile-name'
                    );

                if (profileNameElement) {
                    addKnownName(
                        profileNameElement
                            .textContent
                    );
                }

                var nameMatches =
                    [];

                for (
                    var nameRowIndex = 0;
                    nameRowIndex <
                        leagueRows.length;
                    nameRowIndex++
                ) {
                    var candidateName =
                        window
                            ._getLeagueEntryIdentityName(
                                leagueRows[
                                    nameRowIndex
                                ]
                            );

                    if (
                        candidateName &&
                        knownNames.indexOf(
                            candidateName
                        ) !== -1
                    ) {
                        nameMatches.push(
                            leagueRows[
                                nameRowIndex
                            ]
                        );
                    }
                }

                if (
                    nameMatches.length === 1
                ) {
                    selectRow(
                        nameMatches[0],
                        'unique-profile-name'
                    );
                }
            }

            /*
             * 5. Last authoritative fallback: the response's My League rank.
             */
            if (
                !selectedRow &&
                data.userPosition !==
                    undefined &&
                data.userPosition !==
                    null
            ) {
                var userPosition =
                    Number(
                        data.userPosition
                    );

                if (
                    Number.isFinite(
                        userPosition
                    ) &&
                    userPosition >= 1
                ) {
                    for (
                        var positionIndex = 0;
                        positionIndex <
                            leagueRows.length;
                        positionIndex++
                    ) {
                        if (
                            Number(
                                leagueRows[
                                    positionIndex
                                ].rank
                            ) ===
                            userPosition
                        ) {
                            selectRow(
                                leagueRows[
                                    positionIndex
                                ],
                                'user-position-rank'
                            );

                            break;
                        }
                    }

                    if (
                        !selectedRow &&
                        leagueRows[
                            userPosition - 1
                        ]
                    ) {
                        selectRow(
                            leagueRows[
                                userPosition - 1
                            ],
                            'user-position-index'
                        );
                    }
                }
            }

            if (!selectedRow) {
                console.warn(
                    '[LM LEAGUES] Could not resolve current user from My League.'
                );

                return window
                    ._leagueCurrentUserIdentity;
            }

            window._leagueCurrentUserIdentity = {
                normalizedId:
                    window
                        ._getLeagueEntryIdentityId(
                            selectedRow
                        ),

                userId:
                    selectedRow.userId ||
                    selectedRow.uid ||
                    selectedRow.id ||
                    '',

                displayName:
                    selectedRow.displayName ||
                    selectedRow.name ||
                    '',

                level:
                    selectedRow.level,

                countryCode:
                    selectedRow.countryCode ||
                    selectedRow.country ||
                    '',

                avatarUrl:
                    selectedRow.avatarUrl ||
                    selectedRow.icon ||
                    selectedRow.avatar ||
                    '',

                source:
                    selectedSource,

                capturedAt:
                    Date.now()
            };

            return window
                ._leagueCurrentUserIdentity;
        };

    window._isLeagueCurrentUser =
        function(
            entry,
            currentUserName,
            isOfficialEntry
        ) {
            if (!entry) {
                return false;
            }

            var identity =
                window
                    ._leagueCurrentUserIdentity;

            if (!identity) {
                return false;
            }

            var entryId =
                window
                    ._getLeagueEntryIdentityId(
                        entry
                    );

            var identityId =
                identity.normalizedId ||
                '';

            /*
             * IDs are authoritative.
             *
             * When either side has an ID, never fall back to a name comparison.
             * This prevents another player with a similar or duplicated name
             * from receiving the green "(You)" marker.
             */
            if (
                identityId ||
                entryId
            ) {
                return !!(
                    identityId &&
                    entryId &&
                    identityId ===
                        entryId
                );
            }

            /*
             * Name matching exists only for legacy responses with no IDs.
             */
            var entryName =
                window
                    ._getLeagueEntryIdentityName(
                        entry
                    );

            var identityName =
                window
                    ._normalizeLeagueIdentityName(
                        identity.displayName
                    );

            return !!(
                entryName &&
                identityName &&
                entryName ===
                    identityName
            );
        };

    window._normalizeLeagueAvatarUrl = function(value) {
        var fallback =
            'https://jimboy3100.github.io/banners/profilepic_guest.png';

        if (typeof value !== 'string') {
            return fallback;
        }

        var url = value.trim();
        if (!url) {
            return fallback;
        }

        /*
         * Recover a valid URL if a binary prefix, account ID or control
         * character was accidentally placed before the real URL.
         */
        var embeddedUrl = url.match(
            /https?:\/\/[^\u0000-\u0020"'<>]+/i
        );

        if (embeddedUrl) {
            url = embeddedUrl[0];
        }

        try {
            var parsed = new URL(url);

            if (
                parsed.protocol !== 'https:' &&
                parsed.protocol !== 'http:'
            ) {
                return fallback;
            }

            /*
             * Reject malformed relative requests such as:
             * https://agar.io/<id>%1Ahttps://platform-lookaside...
             */
            if (
                parsed.hostname === window.location.hostname &&
                /https?:\/\//i.test(
                    parsed.pathname + parsed.search
                )
            ) {
                return fallback;
            }

            return parsed.href;
        } catch (error) {
            return fallback;
        }
    };

    /*
     * Resolve League prizes exclusively through Agar.io's official
     * MiniclipAPI instance.
     *
     * The original Agar.io bundle exposes that same instance through:
     *   window.agarApp.API
     *   window.MC
     *
     * No manual GameConfiguration parsing and no hardcoded quantities
     * are permitted in this resolver.
     */
    window._resolveOfficialLeaguePrizeData = function(
        tabType,
        response
    ) {
        var result = {
            ok: false,
            reason: '',
            api: null,
            user: null,
            userTier: '',
            league: '',
            total: 100,
            entries: [],
            prizes: []
        };

        var api = null;

        if (
            window.agarApp &&
            window.agarApp.API &&
            typeof window.agarApp.API
                .getLeaguesPrizes === 'function'
        ) {
            api =
                window.agarApp.API;
        } else if (
            window.MC &&
            typeof window.MC
                .getLeaguesPrizes === 'function'
        ) {
            /*
             * Official bundle:
             *   agarApp.API = MC;
             *   window.MC = MC;
             */
            api =
                window.MC;
        }

        if (!api) {
            result.reason =
                'api-unavailable';

            return result;
        }

        result.api =
            api;

        try {
            if (
                typeof api.getUserInfo ===
                'function'
            ) {
                result.user =
                    api.getUserInfo();
            }
        } catch (userError) {
            console.warn(
                '[LM LEAGUES] Official getUserInfo failed:',
                userError
            );
        }

        response =
            response ||
            window.currentLeaguesResponse ||
            {};

        var officialUserId = '';

        if (result.user) {
            officialUserId =
                String(
                    result.user.id ||
                    result.user.userId ||
                    ''
                ).trim();
        }

        if (
            !officialUserId &&
            typeof window.agarioUID ===
                'string'
        ) {
            officialUserId =
                window.agarioUID.trim();
        }

        /*
         * Match official Agar.io:
         * derive the user's weekly tier from their row in res.league.
         *
         * Do not derive it from current account level because the weekly
         * tier can remain fixed while the account level changes.
         */
        var userLeagueEntry = null;

        if (Array.isArray(response.league)) {
            for (
                var leagueIndex = 0;
                leagueIndex <
                    response.league.length;
                leagueIndex++
            ) {
                var candidate =
                    response.league[
                        leagueIndex
                    ];

                if (!candidate) {
                    continue;
                }

                var candidateId =
                    String(
                        candidate.userId ||
                        candidate.id ||
                        candidate.uid ||
                        ''
                    ).trim();

                if (
                    officialUserId &&
                    candidateId ===
                        officialUserId
                ) {
                    userLeagueEntry =
                        candidate;

                    break;
                }

                if (
                    !officialUserId &&
                    candidate.isUser === true
                ) {
                    userLeagueEntry =
                        candidate;

                    break;
                }
            }
        }

        /*
         * Official cached-row fallback.
         * This still uses Agar.io's own Leagues model.
         */
        if (
            !userLeagueEntry &&
            typeof api.getCachedDataLeague ===
                'function'
        ) {
            try {
                userLeagueEntry =
                    api.getCachedDataLeague() ||
                    null;
            } catch (
                cachedLeagueError
            ) {
                console.warn(
                    '[LM LEAGUES] Official cached league lookup failed:',
                    cachedLeagueError
                );
            }
        }

        if (
            userLeagueEntry &&
            userLeagueEntry.leagueName
        ) {
            /*
             * Preserve the exact official value.
             * Do not lowercase it or strip "League".
             */
            result.userTier =
                String(
                    userLeagueEntry.leagueName
                ).trim();
        }

        var currentTab =
            Number(tabType) || 1;

        switch (currentTab) {
            case 2:
                result.league =
                    'country';

                result.entries =
                    Array.isArray(
                        response.country
                    )
                        ? response.country
                        : [];
                break;

            case 3:
                result.league =
                    'world';

                result.entries =
                    Array.isArray(
                        response.world
                    )
                        ? response.world
                        : [];
                break;

            case 4:
                result.league =
                    'friends';

                result.entries =
                    Array.isArray(
                        response.friends
                    )
                        ? response.friends
                        : [];
                break;

            case 1:
            default:
                result.league =
                    result.userTier;

                result.entries =
                    Array.isArray(
                        response.league
                    )
                        ? response.league
                        : [];
                break;
        }

        if (!result.league) {
            result.reason =
                'tier-unavailable';

            return result;
        }

        /*
         * Exact official fallback:
         * if no selected records exist, pass 100, not zero.
         */
        result.total =
            result.entries.length > 0
                ? result.entries.length
                : 100;

        try {
            result.prizes =
                api.getLeaguesPrizes(
                    result.league,
                    result.total
                );
        } catch (prizeError) {
            result.reason =
                'lookup-failed';

            result.error =
                prizeError;

            console.error(
                '[LM LEAGUES] Official getLeaguesPrizes failed:',
                {
                    league:
                        result.league,

                    total:
                        result.total,

                    error:
                        prizeError
                }
            );

            return result;
        }

        if (
            !Array.isArray(
                result.prizes
            ) ||
            result.prizes.length === 0
        ) {
            result.reason =
                'empty';

            result.prizes =
                [];

            return result;
        }

        result.ok =
            true;

        return result;
    };

    window.renderLeaguesContent = function(tabType, data) {
        data = data || {};
        var contentArea = document.getElementById('lm-leagues-content-area');
        if (!contentArea) return;

        var t = getTheme();
        tabType = tabType || window.currentLeagueTab || 1;
        var userCountry =
            window._normalizeLeagueCountryCode(
                window.application &&
                window.application.user &&
                window.application.user.country
            );
        var userLevel = (window.application && window.application.user && window.application.user.level) || 101;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        /*
         * Use only prizes resolved by Agar.io's own API.
         * Do not read rewardAmount or display invented quantities.
         */
        var officialHeaderPrizeData =
            window._resolveOfficialLeaguePrizeData(
                tabType,
                data
            );

        var _getOfficialPrizeSummary =
            function() {
                if (
                    !officialHeaderPrizeData.ok
                ) {
                    return '—';
                }

                return officialHeaderPrizeData
                    .prizes
                    .slice(0, 3)
                    .map(
                        function(
                            prize,
                            index
                        ) {
                            var quantity =
                                Number(
                                    prize.price
                                );

                            if (
                                !Number.isFinite(
                                    quantity
                                )
                            ) {
                                return null;
                            }

                            var currency =
                                String(
                                    prize.currency ||
                                    ''
                                ).toLowerCase();

                            var currencyHtml =
                                '';

                            if (
                                currency ===
                                'coin'
                            ) {
                                currencyHtml =
                                    ' <i class="Coins_S sprite-common coins"></i>';
                            } else if (
                                currency ===
                                'dna'
                            ) {
                                currencyHtml =
                                    ' <i class="DNA_S sprite-common dna"></i>';
                            }

                            return (
                                index +
                                1 +
                                '. ' +
                                window
                                    ._escapeLeagueHtmlText(
                                        quantity
                                            .toLocaleString()
                                    ) +
                                currencyHtml
                            );
                        }
                    )
                    .filter(Boolean)
                    .join(
                        ' &nbsp; '
                    ) || '—';
            };

        var officialTierTitle =
            officialHeaderPrizeData
                .userTier || '';

        if (officialTierTitle) {
            officialTierTitle =
                officialTierTitle
                    .replace(/_/g, ' ')
                    .trim();

            if (
                !/\bleague$/i.test(
                    officialTierTitle
                )
            ) {
                officialTierTitle +=
                    ' League';
            }

            officialTierTitle =
                officialTierTitle
                    .charAt(0)
                    .toUpperCase() +
                officialTierTitle
                    .slice(1);
        }

        var officialPrizeSummary =
            _getOfficialPrizeSummary();

        var headerConfig = {
            1: {
                title:
                    officialTierTitle ||
                    data.leagueName ||
                    myTier.name,

                gradient:
                    myTier.gradient,

                icon:
                    '⭐',

                prizes:
                    officialPrizeSummary
            },

            2: {
                title:
                    'Country (' +
                    userCountry
                        .toUpperCase() +
                    ')',

                gradient:
                    'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',

                icon:
                    '<span class="flag-icon flag-icon-' +
                    userCountry
                        .toLowerCase() +
                    '" style="border-radius: 3px;"></span>',

                prizes:
                    officialPrizeSummary
            },

            3: {
                title:
                    'World',

                gradient:
                    'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',

                icon:
                    '🌎',

                prizes:
                    officialPrizeSummary
            },

            4: {
                title:
                    'Friends',

                gradient:
                    'linear-gradient(135deg, #1976d2 0%, #0288d1 100%)',

                icon:
                    '👥',

                prizes:
                    officialPrizeSummary
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
                        <div style="font-size: 18px; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,0.4);">${window._escapeLeagueHtmlText(cfg.title)}</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Weekly League</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-size: 11px; text-align: center;">
                        <div style="opacity: 0.8; margin-bottom: 2px;">Top 3 prizes</div>
                        <div style="font-weight: 800; color: #ffd700;">${cfg.prizes}</div>
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

        // Select and normalize official league rows without falling back to stale legacy data.
        var entries =
            null;

        var isOfficialResponse =
            Number(
                data.leagueRequestType
            ) === 1;

        /*
         * Always resolve identity from data.league before rendering whichever
         * tab is currently selected.
         *
         * Country, World and Friends may display different players, but they
         * are forbidden from changing who the logged-in user is.
         */
        if (isOfficialResponse) {
            window
                ._captureLeagueCurrentUserIdentity(
                    data
                );

            var officialEntries;

            switch (Number(tabType)) {
                case 2:
                    officialEntries =
                        Array.isArray(data.country)
                            ? data.country
                            : [];
                    break;

                case 3:
                    officialEntries =
                        Array.isArray(data.world)
                            ? data.world
                            : [];
                    break;

                case 4:
                    officialEntries =
                        Array.isArray(data.friends)
                            ? data.friends
                            : [];
                    break;

                case 1:
                default:
                    officialEntries =
                        Array.isArray(data.league)
                            ? data.league
                            : [];
                    break;
            }
            entries =
                officialEntries
                    .map(
                        function(
                            entry,
                            index
                        ) {
                            if (!entry) {
                                return null;
                            }

                            var officialUserId =
                                entry.userId ||
                                entry.uid ||
                                entry.id ||
                                '';

                            return {
                                displayName:
                                    entry.displayName ||
                                    entry.name ||
                                    '',

                                userId:
                                    officialUserId,

                                id:
                                    officialUserId,

                                uid:
                                    officialUserId,

                                level:
                                    entry.level,

                                country:
                                    entry.countryCode ||
                                    entry.country ||
                                    'us',

                                countryCode:
                                    entry.countryCode ||
                                    entry.country ||
                                    'us',

                                icon:
                                    window
                                        ._normalizeLeagueAvatarUrl(
                                            entry.avatarUrl ||
                                            entry.icon ||
                                            entry.avatar
                                        ),

                                rank:
                                    entry.rank !==
                                        undefined
                                        ? entry.rank
                                        : index + 1,

                                score:
                                    entry.trophies !==
                                        undefined
                                        ? entry.trophies
                                        : (
                                            entry.score !==
                                                undefined
                                                ? entry.score
                                                : 0
                                        ),

                                leagueName:
                                    entry.leagueName ||
                                    '',

                                /*
                                 * Retain markers for diagnostics and My League
                                 * capture, but _isLeagueCurrentUser() does not
                                 * blindly trust them in other tabs.
                                 */
                                isUser:
                                    entry.isUser ===
                                    true,

                                isCurrentUser:
                                    entry.isCurrentUser ===
                                    true
                            };
                        }
                    )
                    .filter(Boolean);
        } else if (
            data.leagueEntries &&
            data.leagueEntries.length
        ) {
            entries = data.leagueEntries;
        } else if (
            window.RecordPlayers &&
            window.RecordPlayers.length
        ) {
            entries = window.RecordPlayers;
        }
        var currentUser =
            (
                window.application &&
                window.application.user
            ) ||
            {};

        var frozenLeagueIdentity =
            window
                ._leagueCurrentUserIdentity ||
            {};

        var currentUserName =
            frozenLeagueIdentity
                .displayName ||
            currentUser.displayName ||
            currentUser.name ||
            window.agarioProfileName ||
            'You';

        var currentUserLevel =
            frozenLeagueIdentity
                .level ||
            currentUser.level ||
            userLevel;

        var currentUserAvatar =
            window
                ._normalizeLeagueAvatarUrl(
                    frozenLeagueIdentity
                        .avatarUrl ||
                    currentUser.picture ||
                    currentUser.avatarUrl ||
                    ''
                );

        var currentUserCountry =
            window
                ._normalizeLeagueCountryCode(
                    frozenLeagueIdentity
                        .countryCode ||
                    currentUser.country ||
                    currentUser.countryCode ||
                    userCountry
                );
        var currentUserRank = (data && data.userPosition !== undefined) ? ('#' + data.userPosition) : '?';
        var currentUserScore = (data && data.userScore !== undefined) ? data.userScore : ((data && data.userWinnings !== undefined) ? data.userWinnings : 0);

        var validCount = 0;
        var userFoundInList = false;


        if (entries && entries.length) {
            entries.forEach(function(entry, idx) {
                if (!entry || (!entry.displayName && !entry.id && !entry.uid)) return;
                validCount++;
                var rankNum = entry.rank || validCount;
                var isUser = window._isLeagueCurrentUser(
                    entry,
                    currentUserName,
                    isOfficialResponse
                );
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
                var icon = window._normalizeLeagueAvatarUrl(
                    entry.icon || entry.avatar
                );
                var country =
                    window._normalizeLeagueCountryCode(
                        entry.country
                    );
                var level = entry.level || 100;

                var rowBg = isUser ? 'background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);';

                html += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius: 8px; ${rowBg} transition: transform 0.15s;">
                        <div style="width: 70px;">${rankBadge}</div>
                        <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                            <img src="${icon}" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.onerror=null; this.src='https://jimboy3100.github.io/banners/profilepic_guest.png';">
                            <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${level}</span>
                            <span class="country-icon flag-icon flag-icon-${country}" style="border-radius: 2px;"></span>
                            <span style="font-weight: 700; color: ${isUser ? '#00e676' : t.tc}; font-size: 13px;">${window._escapeLeagueHtmlText(name)}${isUser ? ' (You)' : ''}</span>
                        </div>
                        <div style="width: 140px; text-align: right; font-weight: 800; color: ${t.tc}; font-size: 13px; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                            ${score} <i class="fa fa-trophy" style="color: ${t.mc};"></i>
                        </div>
                    </div>
                `;
            });
        } else if (isOfficialResponse) {
            // Valid official response received, but the selected leaderboard is empty.
            html += `
                <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
                    No players in this leaderboard yet.
                </div>
            `;
        } else {
            // No server response yet — preserve the loading state.
            html += `
                <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    Please wait...
                </div>
            `;
        }

        // Show the user's own position at the bottom when they are not in the visible list.
        var hasUserSummary =
            data &&
            data.userPosition !== undefined &&
            (
                data.userScore !== undefined ||
                data.userWinnings !== undefined
            );
        if (!userFoundInList && hasUserSummary) {
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 10px; border-radius: 8px; background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676; box-shadow: 0 0 12px rgba(0,230,118,0.2);">
                    <div style="width: 70px;">
                        <div style="padding: 4px 8px; border-radius: 6px; background: #00e676; color: #000; font-weight: 900; font-size: 12px; text-align: center;">${currentUserRank}</div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                        <img src="${currentUserAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #00e676;" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                        <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${currentUserLevel}</span>
                        <span class="country-icon flag-icon flag-icon-${currentUserCountry.toLowerCase()}" style="border-radius: 2px;"></span>
                        <span style="font-weight: 800; color: #00e676; font-size: 14px;">${window._escapeLeagueHtmlText(currentUserName)} (You)</span>
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

    window._hasRenderableCurrentLeagueRows = function(rows) {
        if (!rows || !rows.length) return false;
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var row = rows[rowIndex];
            if (
                row &&
                (
                    row.displayName ||
                    row.id ||
                    row.uid
                )
            ) {
                return true;
            }
        }
        return false;
    };

    window._hasUsableCurrentLeaguesCache = function() {
        var cachedResponse = window.lastLeaguesResponse;
        if (
            cachedResponse &&
            Number(cachedResponse.leagueRequestType) === 1
        ) {
            return true;
        }
        if (
            cachedResponse &&
            window._hasRenderableCurrentLeagueRows(
                cachedResponse.leagueEntries
            )
        ) {
            return true;
        }
        return window._hasRenderableCurrentLeagueRows(
            window.RecordPlayers
        );
    };

    window._renderCurrentLeaguesRequestState = function(icon, message) {
        var listContainer = document.getElementById(
            'lm-leagues-list-container'
        );
        if (!listContainer) return;
        var t = getTheme();
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                <div style="font-size: 24px; margin-bottom: 10px;">${icon}</div>
                ${message}
            </div>
        `;
    };

    window._startCurrentLeaguesRequest = function() {
        if (
            !document.getElementById('lm-leagues-modal') ||
            window._leaguesRequestState !== 'idle'
        ) {
            return;
        }

        var requestToken = window._leaguesModalToken;
        window._leaguesRequestState = 'loading';

        var requestWasSent = false;
        try {
            if (typeof window.requestLeaguesInfo === 'function') {
                requestWasSent =
                    window.requestLeaguesInfo(1) === true;
            } else if (
                window.application &&
                typeof window.application.requestLeaguesInfo === 'function'
            ) {
                requestWasSent =
                    window.application.requestLeaguesInfo(1) === true;
            } else if (
                typeof window.userLeaguesInfoRequest === 'function'
            ) {
                requestWasSent =
                    window.userLeaguesInfoRequest() !== false;
            }
        } catch (currentLeaguesRequestError) {
            console.warn(
                '[LM] Current-week leagues request failed:',
                currentLeaguesRequestError
            );
            requestWasSent = false;
        }

        if (
            window._leaguesModalToken !== requestToken ||
            window._leaguesRequestState === 'success'
        ) {
            return;
        }

        if (!requestWasSent) {
            window._leaguesRequestState = 'failure';
            if (!window._hasUsableCurrentLeaguesCache()) {
                window._renderCurrentLeaguesRequestState(
                    '⚠️',
                    'Unable to request leaderboard data.'
                );
            }
            return;
        }

        if (!window._hasUsableCurrentLeaguesCache()) {
            window._leaguesTimeoutTimer = setTimeout(function() {
                if (
                    window._leaguesModalToken !== requestToken ||
                    window._leaguesRequestState !== 'loading'
                ) {
                    return;
                }
                window._leaguesTimeoutTimer = null;
                window._leaguesRequestState = 'timeout';
                if (!window._hasUsableCurrentLeaguesCache()) {
                    window._renderCurrentLeaguesRequestState(
                        '⏱️',
                        'Leaderboard request timed out.'
                    );
                }
            }, 5000);
        }
    };

    window.switchLeagueTab = function(tabType) {
        var normalizedTab = Number(tabType);
        if (
            normalizedTab !== 1 &&
            normalizedTab !== 2 &&
            normalizedTab !== 3 &&
            normalizedTab !== 4
        ) {
            normalizedTab = 1;
        }
        window.currentLeagueTab = normalizedTab;
        var t = getTheme();

        // Update tab button styles
        $('.lm-tab-btn').removeClass('active').css({
            background: 'rgba(255,255,255,0.06)',
            color: t.tc2,
            border: '1px solid rgba(255,255,255,0.1)'
        });
        $('#lm-tab-' + normalizedTab).addClass('active').css({
            background: t.b1,
            color: t.btc,
            border: '1px solid ' + t.mc
        });

        /*
         * All four tabs belong to the same opcode-131 response.
         *
         * Reuse the exact accepted response. Do not launch another network
         * request merely because the visible category changed.
         */
        var cachedLeagueResponse =
            window.currentLeaguesResponse ||
            window.lastLeaguesResponse ||
            {};

        window.renderLeaguesContent(
            normalizedTab,
            cachedLeagueResponse
        );

        if (
            !window
                ._hasUsableCurrentLeaguesCache()
        ) {
            if (
                window._leaguesRequestState ===
                'failure'
            ) {
                window
                    ._renderCurrentLeaguesRequestState(
                        '⚠️',
                        'Unable to request leaderboard data.'
                    );
            } else if (
                window._leaguesRequestState ===
                'timeout'
            ) {
                window
                    ._renderCurrentLeaguesRequestState(
                        '⏱️',
                        'Leaderboard request timed out.'
                    );
            }

            /*
             * Request only when no accepted current-week response exists.
             */
            window
                ._startCurrentLeaguesRequest();
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
                        <button id="lm-tab-1" class="lm-tab-btn ${window.currentLeagueTab === 1 ? 'active' : ''}" onclick="window.switchLeagueTab(1);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 1 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 1 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 1 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            ⭐ My League
                        </button>
                        <button id="lm-tab-4" class="lm-tab-btn ${window.currentLeagueTab === 4 ? 'active' : ''}" onclick="window.switchLeagueTab(4);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 4 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 4 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 4 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            👥 Friends
                        </button>
                        <button id="lm-tab-2" class="lm-tab-btn ${window.currentLeagueTab === 2 ? 'active' : ''}" onclick="window.switchLeagueTab(2);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 2 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 2 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 2 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🇺🇸 Country
                        </button>
                        <button id="lm-tab-3" class="lm-tab-btn ${window.currentLeagueTab === 3 ? 'active' : ''}" onclick="window.switchLeagueTab(3);" style="flex: 1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 3 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 3 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 3 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🌎 World
                        </button>
                    </div>

                    <!-- Dynamic Leaderboard Content Container -->
                    <div id="lm-leagues-content-area"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Start a new current-week request generation for this modal.
        window._leaguesModalToken =
            (window._leaguesModalToken || 0) + 1;
        if (window._leaguesTimeoutTimer) {
            clearTimeout(window._leaguesTimeoutTimer);
            window._leaguesTimeoutTimer = null;
        }
        window._leaguesRequestState = 'idle';

        // Load cached data and start exactly one background request.
        window.switchLeagueTab(window.currentLeagueTab || 1);
    };

    // Listen to leagues update event and render real player data matching Agar.io UI
    document.addEventListener('leaguesInfoUpdate', function(e) {
        var detail = e.detail || {};
        if (detail.isLastWeek) {
            var acceptedLastWeekResponse =
                Number(detail.leagueRequestType) === 2 ||
                window._hasRenderableCurrentLeagueRows(
                    detail.leagueEntries
                );

            if (!acceptedLastWeekResponse) {
                return;
            }

            if (window._lastWeekTimeoutTimer) {
                clearTimeout(window._lastWeekTimeoutTimer);
                window._lastWeekTimeoutTimer = null;
            }

            // Last week response — update last week modal if open
            window.lastWeekLeaguesResponse = detail;
            if (document.getElementById('lm-lastweek-modal')) {
                window._renderLastWeekContent(detail);
            }
        } else {
            var acceptedCurrentResponse =
                Number(detail.leagueRequestType) === 1 ||
                window._hasRenderableCurrentLeagueRows(
                    detail.leagueEntries
                );

            if (!acceptedCurrentResponse) {
                return;
            }

            if (window._leaguesTimeoutTimer) {
                clearTimeout(window._leaguesTimeoutTimer);
                window._leaguesTimeoutTimer = null;
            }
            window._leaguesRequestState = 'success';

            /*
             * Preserve one exact accepted opcode-131 response for every tab.
             */
            window.currentLeaguesResponse =
                detail;

            window.lastLeaguesResponse =
                detail;

            /*
             * Resolve and freeze the user from My League before rendering the
             * currently selected category.
             */
            window
                ._captureLeagueCurrentUserIdentity(
                    detail
                );

            window.renderLeaguesContent(
                window.currentLeagueTab ||
                    1,
                detail
            );
        }
    });

    window.showMorePrizesModal = function(tabType) {
        injectStyles();

        var theme = getTheme();
        var currentTab = Number(
            tabType ||
            window.currentLeagueTab ||
            1
        );

        if (
            currentTab !== 1 &&
            currentTab !== 2 &&
            currentTab !== 3 &&
            currentTab !== 4
        ) {
            currentTab = 1;
        }

        /*
         * Follow the original Agar.io prize path:
         *
         *   current response
         *     -> exact weekly userTier
         *     -> selected category
         *     -> records length or 100
         *     -> official MiniclipAPI.getLeaguesPrizes()
         */
        var resolvedPrizeData =
            window._resolveOfficialLeaguePrizeData(
                currentTab,
                window.currentLeaguesResponse
            );

        if (!resolvedPrizeData.ok) {
            var reasonText;

            switch (
                resolvedPrizeData.reason
            ) {
                case 'api-unavailable':
                    reasonText =
                        'The official Agar.io MiniclipAPI bridge is unavailable.';
                    break;

                case 'tier-unavailable':
                    reasonText =
                        'The current weekly league tier could not be resolved from the official leaderboard response.';
                    break;

                case 'lookup-failed':
                    reasonText =
                        'Agar.io failed while resolving its official league prize configuration.';
                    break;

                case 'empty':
                    reasonText =
                        'Agar.io returned no official prizes for this leaderboard.';
                    break;

                default:
                    reasonText =
                        'The official Agar.io prize lookup failed.';
                    break;
            }

            console.error(
                '[LM LEAGUES] More Prizes unavailable:',
                resolvedPrizeData
            );

            if (window.toastr) {
                toastr.error(
                    '<b>[LEAGUES]:</b> ' +
                    reasonText
                );
            }

            return false;
        }

        var api =
            resolvedPrizeData.api;

        var officialUser =
            resolvedPrizeData.user;

        /*
         * Keep this object only for compatibility with the existing
         * title-building code below. Its ID is the exact weekly tier
         * supplied by Agar.io, not a level-derived approximation.
         */
        var officialTier =
            resolvedPrizeData.userTier
                ? {
                    id:
                        resolvedPrizeData
                            .userTier
                }
                : null;

        var officialLeague =
            resolvedPrizeData.league;

        var participantCount =
            resolvedPrizeData.total;

        var officialPrizes =
            resolvedPrizeData.prizes;

        /*
         * Copy only fields returned by Agar.io's official API.
         * No generated quantities or manually resolved rewards.
         */
        var prizes =
            officialPrizes
                .map(function(prize) {
                    if (!prize) {
                        return null;
                    }

                    var price =
                        Number(prize.price);

                    if (
                        !Number.isFinite(price)
                    ) {
                        return null;
                    }

                    var currency =
                        String(
                            prize.currency || ''
                        ).toLowerCase();

                    if (
                        currency !== 'coin' &&
                        currency !== 'dna'
                    ) {
                        console.warn(
                            '[LM LEAGUES] Unknown official prize currency:',
                            prize
                        );
                    }

                    return {
                        place:
                            String(
                                prize.place || ''
                            ),

                        price:
                            price,

                        currency:
                            currency,

                        positionFrom:
                            Number(
                                prize.positionFrom
                            ),

                        positionTo:
                            Number(
                                prize.positionTo
                            )
                    };
                })
                .filter(Boolean);

        if (prizes.length === 0) {
            if (window.toastr) {
                toastr.error(
                    '<b>[LEAGUES]:</b> Agar.io returned invalid official prize data.'
                );
            }

            return false;
        }

        var userCountry =
            (
                officialUser &&
                (
                    officialUser.country ||
                    officialUser.countryCode
                )
            ) ||
            (
                window.application &&
                window.application.user &&
                window.application.user.country
            ) ||
            'us';

        var safeCountry =
            window._escapeLeagueHtmlText(
                String(userCountry)
            ).toUpperCase();

        var officialTierId =
            officialTier &&
            officialTier.id
                ? String(
                    officialTier.id
                ).trim()
                : '';

        var tierTitle =
            officialTierId
                ? officialTierId
                    .replace(/_/g, ' ')
                    .trim()
                : 'My League';

        if (
            tierTitle !==
                'My League' &&
            !/\bleague$/i.test(
                tierTitle
            )
        ) {
            tierTitle +=
                ' League';
        }

        tierTitle =
            tierTitle
                .charAt(0)
                .toUpperCase() +
            tierTitle.slice(1);

        var title;

        switch (currentTab) {
            case 2:
                title =
                    'Country League (' +
                    safeCountry +
                    ')';
                break;

            case 3:
                title =
                    'World League';
                break;

            case 4:
                title =
                    'Friends League';
                break;

            case 1:
            default:
                title =
                    tierTitle;
                break;
        }

        var gradient;

        switch (currentTab) {
            case 2:
                gradient =
                    'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)';
                break;

            case 3:
                gradient =
                    'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)';
                break;

            case 4:
                gradient =
                    'linear-gradient(135deg, #1976d2 0%, #0288d1 100%)';
                break;

            case 1:
            default:
                gradient =
                    'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)';
                break;
        }

        var oldModal =
            document.getElementById(
                'lm-prizes-modal'
            );

        if (oldModal) {
            oldModal.remove();
        }

        var modal =
            document.createElement('div');

        modal.id =
            'lm-prizes-modal';

        modal.className =
            'lm-modal-overlay';

        modal.style.zIndex =
            '1000000';

        modal.addEventListener(
            'click',
            function(event) {
                if (event.target === modal) {
                    modal.remove();
                }
            }
        );

        var rowsHtml = '';

        prizes.forEach(function(prize) {
            var safePlace =
                window._escapeLeagueHtmlText(
                    prize.place
                );

            var safePrice =
                window._escapeLeagueHtmlText(
                    prize.price.toLocaleString()
                );

            /*
             * Use the same sprite classes as the original Agar.io
             * More Prizes component.
             */
            var currencyHtml = '';

            if (prize.currency === 'coin') {
                currencyHtml =
                    '<i class="Coins_S sprite-common coins"></i>';
            } else if (
                prize.currency === 'dna'
            ) {
                currencyHtml =
                    '<i class="DNA_S sprite-common dna"></i>';
            }

            rowsHtml +=
                '<div style="' +
                    'display:flex;' +
                    'align-items:center;' +
                    'justify-content:space-between;' +
                    'padding:12px 20px;' +
                    'margin-bottom:6px;' +
                    'border-radius:8px;' +
                    'background:rgba(255,255,255,0.05);' +
                    'border:1px solid rgba(255,255,255,0.08);' +
                '">' +
                    '<div style="' +
                        'font-weight:800;' +
                        'font-size:14px;' +
                        'color:' +
                            theme.tc +
                        ';' +
                        'min-width:160px;' +
                    '">' +
                        safePlace +
                    '</div>' +

                    '<div style="' +
                        'font-weight:800;' +
                        'font-size:16px;' +
                        'color:#ffd700;' +
                        'display:flex;' +
                        'align-items:center;' +
                        'gap:6px;' +
                    '">' +
                        '<span>' +
                            safePrice +
                        '</span>' +
                        currencyHtml +
                    '</div>' +
                '</div>';
        });

        modal.innerHTML =
            '<div class="lm-modal-container" style="' +
                'background:' +
                    theme.pc +
                ';' +
                'border-color:' +
                    theme.b2 +
                ';' +
                'width:480px;' +
            '">' +

                '<div class="lm-modal-header" style="' +
                    'background:' +
                        gradient +
                    ';' +
                    'padding:14px 20px;' +
                    'border-bottom:1px solid rgba(255,255,255,0.15);' +
                '">' +
                    '<div style="' +
                        'width:100%;' +
                        'text-align:center;' +
                        'position:relative;' +
                    '">' +
                        '<span style="' +
                            'font-size:17px;' +
                            'font-weight:900;' +
                            'color:#fff;' +
                            'text-transform:uppercase;' +
                            'letter-spacing:1px;' +
                            'text-shadow:0 2px 4px rgba(0,0,0,0.5);' +
                        '">' +
                            window._escapeLeagueHtmlText(
                                title
                            ) +
                        '</span>' +

                        '<button ' +
                            'type="button" ' +
                            'class="lm-modal-close" ' +
                            'style="' +
                                'position:absolute;' +
                                'right:0;' +
                                'top:-4px;' +
                                'color:#fff;' +
                            '"' +
                        '>&times;</button>' +
                    '</div>' +
                '</div>' +

                '<div class="lm-modal-body" style="' +
                    'padding:20px;' +
                    'max-height:420px;' +
                    'overflow-y:auto;' +
                '">' +
                    '<div style="' +
                        'text-align:center;' +
                        'margin-bottom:16px;' +
                    '">' +
                        '<span class="list-prizes-icon sprite"></span>' +
                        '<div style="' +
                            'font-size:16px;' +
                            'font-weight:800;' +
                            'color:' +
                                theme.tc +
                            ';' +
                        '">' +
                            'Prizes' +
                        '</div>' +
                    '</div>' +

                    rowsHtml +
                '</div>' +

                '<div style="' +
                    'padding:12px 20px;' +
                    'text-align:center;' +
                    'background:' +
                        theme.pc2 +
                    ';' +
                    'border-top:1px solid rgba(255,255,255,0.1);' +
                '">' +
                    '<button ' +
                        'type="button" ' +
                        'class="btn lm-prizes-close-button" ' +
                        'style="' +
                            'background:' +
                                theme.b1 +
                            ';' +
                            'color:' +
                                theme.btc +
                            ';' +
                            'font-weight:800;' +
                            'padding:8px 24px;' +
                            'border-radius:6px;' +
                            'border:none;' +
                            'cursor:pointer;' +
                        '"' +
                    '>' +
                        'Close' +
                    '</button>' +
                '</div>' +
            '</div>';

        modal
            .querySelector(
                '.lm-modal-close'
            )
            .addEventListener(
                'click',
                function() {
                    modal.remove();
                }
            );

        modal
            .querySelector(
                '.lm-prizes-close-button'
            )
            .addEventListener(
                'click',
                function() {
                    modal.remove();
                }
            );

        document.body.appendChild(
            modal
        );

        console.log(
            '[LM LEAGUES] Rendered official Agar.io prizes:',
            {
                league:
                    officialLeague,

                participantCount:
                    participantCount,

                prizes:
                    prizes
            }
        );

        return true;
    };

    window.showLastWeekResultsModal = function(tabType) {
        injectStyles();
        var requestedLastWeekTab = Number(
            tabType || window.currentLeagueTab || 1
        );
        window._lastWeekLeagueTab =
            requestedLastWeekTab === 2 ||
            requestedLastWeekTab === 3
                ? requestedLastWeekTab
                : 1;
        var t = getTheme();
        var userLevel = (window.application && window.application.user && window.application.user.level) || 101;
        var myTier = window.getLeagueTierFromLevel(userLevel);

        var old = document.getElementById('lm-lastweek-modal');
        if (old) old.remove();

        // Start a new Last Week modal generation.
        window._lastWeekModalToken =
            (window._lastWeekModalToken || 0) + 1;
        var lastWeekRequestToken = window._lastWeekModalToken;
        if (window._lastWeekTimeoutTimer) {
            clearTimeout(window._lastWeekTimeoutTimer);
            window._lastWeekTimeoutTimer = null;
        }

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
        if (window.lastWeekLeaguesResponse) {
            window._renderLastWeekContent(window.lastWeekLeaguesResponse);
        } else {
            // Request last week data from server (type=2).
            var lastWeekRequestWasSent = false;
            try {
                if (typeof window.requestLeaguesInfo === 'function') {
                    lastWeekRequestWasSent =
                        window.requestLeaguesInfo(2) === true;
                } else if (
                    window.application &&
                    typeof window.application.requestLeaguesInfo === 'function'
                ) {
                    lastWeekRequestWasSent =
                        window.application.requestLeaguesInfo(2) === true;
                }
            } catch (lastWeekRequestError) {
                console.warn(
                    '[LM] Last Week leagues request failed:',
                    lastWeekRequestError
                );
                lastWeekRequestWasSent = false;
            }

            if (
                window._lastWeekModalToken !== lastWeekRequestToken
            ) {
                return;
            }

            // A synchronously dispatched accepted response already rendered.
            if (window.lastWeekLeaguesResponse) {
                return;
            }

            if (!lastWeekRequestWasSent) {
                var failedContentArea = document.getElementById(
                    'lm-lastweek-content'
                );
                if (failedContentArea) {
                    failedContentArea.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                            <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                            Unable to request last week results.
                        </div>
                    `;
                }
                return;
            }

            /*
             * A timeout is not an empty official response.
             * Keep transport failure separate from the genuine Agar.io
             * "no results last week" state.
             */
            window._lastWeekTimeoutTimer = setTimeout(function() {
                if (
                    window._lastWeekModalToken !== lastWeekRequestToken
                ) {
                    return;
                }

                window._lastWeekTimeoutTimer = null;

                var contentArea = document.getElementById(
                    'lm-lastweek-content'
                );

                if (
                    contentArea &&
                    contentArea.querySelector('[data-loading]')
                ) {
                    contentArea.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                            <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                            Weekly results could not be loaded.<br>
                            Close this window and try again.
                        </div>
                    `;
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

        data = data || {};

        var entries = [];
        var hasLastWeekRequestType =
            data.leagueRequestType !== undefined &&
            data.leagueRequestType !== null;

        var lastWeekResponseRequestType =
            Number(data.leagueRequestType);

        if (
            hasLastWeekRequestType &&
            lastWeekResponseRequestType !== 2
        ) {
            console.warn(
                '[LM] Refusing non-last-week response in Weekly Results:',
                data.leagueRequestType
            );
            return;
        }

        /*
         * Match original Agar.io:
         * show the global no-results state only when every last-week
         * leaderboard category is empty.
         */
        var leagueEntries =
            Array.isArray(data.league) ? data.league : [];

        var friendsEntries =
            Array.isArray(data.friends) ? data.friends : [];

        var countryEntries =
            Array.isArray(data.country) ? data.country : [];

        var worldEntries =
            Array.isArray(data.world) ? data.world : [];

        var totalLastWeekResults =
            leagueEntries.length +
            friendsEntries.length +
            countryEntries.length +
            worldEntries.length;

        if (hasLastWeekRequestType && totalLastWeekResults === 0) {
            window._renderLastWeekNoResults();
            return;
        }

        var selectedLastWeekTab = Number(
            window._lastWeekLeagueTab ||
            window.currentLeagueTab ||
            1
        );

        if (
            selectedLastWeekTab !== 2 &&
            selectedLastWeekTab !== 3
        ) {
            selectedLastWeekTab = 1;
        }

        var selectedOfficialEntries =
            selectedLastWeekTab === 2
                ? countryEntries
                : (
                    selectedLastWeekTab === 3
                        ? worldEntries
                        : leagueEntries
                );

        entries = selectedOfficialEntries.map(function(entry, index) {
            if (!entry) {
                return null;
            }

            var officialUserId =
                entry.userId || '';

            return {
                displayName:
                    entry.displayName ||
                    '',

                userId:
                    officialUserId,

                id:
                    officialUserId,

                uid:
                    officialUserId,

                isUser:
                    entry.isUser === true,

                isCurrentUser:
                    entry.isCurrentUser ===
                    true,

                level:
                    entry.level,

                country:
                    entry.countryCode ||
                    'us',

                icon:
                    typeof window
                        ._normalizeLeagueAvatarUrl ===
                        'function'
                        ? window
                            ._normalizeLeagueAvatarUrl(
                                entry.avatarUrl
                            )
                        : (
                            typeof entry.avatarUrl ===
                                'string' &&
                            entry.avatarUrl.trim()
                                ? entry.avatarUrl.trim()
                                : 'https://jimboy3100.github.io/banners/profilepic_guest.png'
                        ),

                rank:
                    entry.rank !== undefined
                        ? entry.rank
                        : index + 1,

                score:
                    entry.trophies !== undefined
                        ? entry.trophies
                        : 0,

                leagueName:
                    entry.leagueName ||
                    ''
            };
        }).filter(Boolean);

        /*
         * At least one category has results, but the selected category
         * is empty. This is not the global "you earned no trophies"
         * condition.
         */
        if (entries.length === 0) {
            contentArea.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                    No results are available for this leaderboard.
                </div>
            `;
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
            var isUser = window._isLeagueCurrentUser(
                entry,
                currentUserName,
                (
                    hasLastWeekRequestType &&
                    lastWeekResponseRequestType === 2
                )
            );

            var name = entry.displayName || entry.id || ('Player ' + rankNum);
            var score = entry.score !== undefined ? entry.score.toLocaleString() : (entry.winnings !== undefined ? entry.winnings.toLocaleString() : (entry.trophies !== undefined ? entry.trophies.toLocaleString() : '0'));
            var icon =
                typeof window._normalizeLeagueAvatarUrl ===
                'function'
                    ? window._normalizeLeagueAvatarUrl(
                        entry.icon || entry.avatar
                    )
                    : 'https://jimboy3100.github.io/banners/profilepic_guest.png';
            var country =
                window._normalizeLeagueCountryCode(
                    entry.country ||
                    entry.countryCode
                );
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
            html += '<img src="' + icon + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.onerror=null; this.src=\'https://jimboy3100.github.io/banners/profilepic_guest.png\';">';
            html += '<span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">' + level + '</span>';
            html += '<span class="country-icon flag-icon flag-icon-' + country + '" style="border-radius: 2px;"></span>';
            html += '<span style="font-weight: 700; color: ' + (isUser ? '#00e676' : t.tc) + '; font-size: 13px;">' + window._escapeLeagueHtmlText(name) + '</span>';
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
                var helpSettings = (window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig["Visual - Help Settings"]) ||
                                   (window.LMAgarGameConfiguration && window.LMAgarGameConfiguration.gameConfig && window.LMAgarGameConfiguration.gameConfig["Visual - Help Settings"]) || [];
                var getHelp = function(k, def) {
                    if (!helpSettings || !helpSettings.length) return def;
                    var s = helpSettings.find(function(x) { return x.key === k; });
                    return s ? s.value : def;
                };
                var minPosFFA = getHelp("potionsMinPositionFreeForAll", "10");
                var minTimeFFA = getHelp("potionsMinTimeFreeForAll", "100");

                return `
                    <div style="display: flex; gap: 16px; padding: 10px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: ${t.mc}; margin-bottom: 12px;">🏆 Get on the leaderboard to win Mystery Potions</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.8;">
                                <div><b>Classic / FFA:</b> Stay in top ${minPosFFA} for ${minTimeFFA} seconds</div>
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
                var rawItems = (window.PotionHelpConfig && window.PotionHelpConfig.length) ? window.PotionHelpConfig :
                              ((window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig["Visual - Potion Help"]) ||
                               (window.LMAgarGameConfiguration && window.LMAgarGameConfiguration.gameConfig && window.LMAgarGameConfiguration.gameConfig["Visual - Potion Help"]));
                
                var officialTiers = [
                    { id: 'common', name: 'Common', color: '#4caf50', skin: 'x1', spec: '', coins: '💰 +', trophies: '🏆 x1' },
                    { id: 'rare', name: 'Rare', color: '#00d3ff', skin: 'x3', spec: '', coins: '💰 ++', trophies: '🏆🏆 x2' },
                    { id: 'exotic', name: 'Exotic', color: '#e91e63', skin: 'x4', spec: '(At least x1 Special)', coins: '💰 +++', trophies: '🏆🏆 x2' },
                    { id: 'mystical', name: 'Mystical', color: '#ffb300', skin: 'x6', spec: '(At least x3 Special)', coins: '💰 ++++', trophies: '🏆🏆🏆 x3' }
                ];

                var rowsHtml = '';

                // If authoritative server configs exist, filter strictly for standard tiers to avoid internal/fake rows
                if (rawItems && rawItems.length) {
                    var tierMap = {
                        'potion_common': officialTiers[0], 'common': officialTiers[0],
                        'potion_rare': officialTiers[1], 'rare': officialTiers[1],
                        'potion_exotic': officialTiers[2], 'exotic': officialTiers[2],
                        'potion_mystical': officialTiers[3], 'mystical': officialTiers[3]
                    };
                    for (var p = 0; p < rawItems.length; p++) {
                        var ph = rawItems[p];
                        var key = (ph.potionId || '').toLowerCase();
                        if (tierMap[key]) {
                            var tObj = tierMap[key];
                            var specText = (ph.minSpecialPieces && ph.minSpecialPieces !== '0') ? ` <span style="font-size: 10px; color: ${tObj.color}; font-weight: 800;">(At least x${ph.minSpecialPieces} Special)</span>` : '';
                            var coinVal = (ph.coinText && ph.coinText !== 'na') ? ('💰 ' + ph.coinText) : tObj.coins;
                            rowsHtml += `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                                    <div style="width: 120px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${tObj.color}; font-size: 13px;">
                                        🧪 ${tObj.name}
                                    </div>
                                    <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">
                                        ${ph.skinPieces || tObj.skin}${specText}
                                    </div>
                                    <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                        ${coinVal}
                                    </div>
                                    <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                        ${tObj.trophies}
                                    </div>
                                    <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                        and more!
                                    </div>
                                </div>
                            `;
                        }
                    }
                }

                // Fallback to official 4 standard tiers if server data is unavailable or filtered
                if (!rowsHtml) {
                    for (var ot = 0; ot < officialTiers.length; ot++) {
                        var tier = officialTiers[ot];
                        var specHtml = tier.spec ? ` <span style="font-size: 10px; color: ${tier.color}; font-weight: 800;">${tier.spec}</span>` : '';
                        rowsHtml += `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
                                <div style="width: 120px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${tier.color}; font-size: 13px;">🧪 ${tier.name}</div>
                                <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">${tier.skin}${specHtml}</div>
                                <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">${tier.coins}</div>
                                <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">${tier.trophies}</div>
                                <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">and more!</div>
                            </div>
                        `;
                    }
                }

                return `
                    <div style="text-align: center; font-size: 13px; font-weight: 700; color: ${t.tc2}; margin-bottom: 14px;">
                        Each potion has amazing rewards inside! Brew the potions to open them!
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; font-size: 11px; font-weight: 800; color: ${t.tc2}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        <div style="width: 120px;">POTIONS</div>
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

    /* Official promotion listener is installed at the top of this file
     * in capture phase — see installOfficialPromotionCaptureEarly(). */

    window.openDailyDealsModal = function() {
        var appUser =
            (
                window.application &&
                window.application.user
            ) ||
            (
                window.legendmod &&
                window.legendmod.user
            ) ||
            {};

        var isLoggedIn;

        if (
            typeof window.checkUserLoggedIn ===
            'function'
        ) {
            isLoggedIn =
                window.checkUserLoggedIn();
        } else {
            var fallbackUserId =
                appUser.userId !== undefined &&
                appUser.userId !== null
                    ? String(
                        appUser.userId
                    ).trim()
                    : '';

            var normalizedFallbackUserId =
                fallbackUserId.toLowerCase();

            isLoggedIn =
                !!(
                    window.loggedIn === true ||
                    appUser.authenticated === true ||
                    (
                        fallbackUserId &&
                        fallbackUserId !== '0' &&
                        normalizedFallbackUserId !==
                            'null' &&
                        normalizedFallbackUserId !==
                            'undefined'
                    )
                );
        }

        if (!isLoggedIn) {
            if (window.toastr) {
                toastr.error(
                    '<b>[OFFICIAL OFFER]:</b> You must be logged in to access official Agar.io offers.'
                );
            }

            return false;
        }

        if (window._lmDailyDealOpening) {
            return false;
        }

        var promotion =
            window._lmOfficialPromotion;

        /*
         * Recover a promotion event that fired before LM installed its
         * listener. Agar.io's official Offers Vue component keeps the exact
         * callback in promoCallback.
         */
        if (
            !promotion ||
            typeof promotion.callback !== 'function'
        ) {
            var officialPromoHost =
                document.getElementById(
                    'lm-preserved-official-promo'
                );

            var officialOffersRoot =
                officialPromoHost
                    ? officialPromoHost.querySelector(
                        '#mainui-offers'
                    )
                    : null;

            if (!officialOffersRoot) {
                officialOffersRoot =
                    document.getElementById(
                        'mainui-offers'
                    );
            }

            var officialOffersVm =
                officialOffersRoot &&
                officialOffersRoot.__vue__
                    ? officialOffersRoot.__vue__
                    : null;

            if (
                officialOffersVm &&
                typeof officialOffersVm.promoCallback ===
                    'function'
            ) {
                promotion = {
                    offerId:
                        officialOffersVm.promoId || null,
                    config:
                        officialOffersVm.promoConfig || null,
                    delegate:
                        officialOffersVm.promoDelegate || null,
                    system:
                        officialOffersVm.promoSystem || null,
                    callback: function() {
                        return officialOffersVm
                            .promoCallback();
                    },
                    receivedAt: Date.now()
                };

                window._lmOfficialPromotion =
                    promotion;

                console.log(
                    '[OFFICIAL OFFER] Recovered official promotion from preserved Vue component:',
                    promotion
                );
            }
        }

        /*
         * Primary path:
         * use the exact callback delivered by official Agar.io.
         */
        if (
            promotion &&
            typeof promotion.callback === 'function'
        ) {
            window._lmDailyDealOpening = true;

            try {
                promotion.callback();

                if (
                    window.agarApp &&
                    window.agarApp.API &&
                    typeof window.agarApp.API.playSound ===
                        'function'
                ) {
                    window.agarApp.API.playSound(
                        'sfxClick'
                    );
                }
            } catch (promotionCallbackError) {
                console.error(
                    '[OFFICIAL OFFER] Official promotion callback failed:',
                    promotionCallbackError
                );

                window._lmDailyDealOpening = false;

                if (window.toastr) {
                    toastr.error(
                        '<b>[OFFICIAL OFFER]:</b> Agar.io supplied an offer, but its official callback failed.'
                    );
                }

                return false;
            }

            setTimeout(
                function() {
                    window._lmDailyDealOpening =
                        false;
                },
                750
            );

            return true;
        }

        /*
         * Runtime recovery path:
         * use Agar.io's actual promotion objects instead of depending
         * on the optional HTML badge or promo_badge_create event.
         *
         * The official client writes the current BasePromotionButton to
         * Core.ui.mainUI._badgeButton before loading badge resources.
         */
        var officialCore = null;

        try {
            if (
                typeof Core !== 'undefined' &&
                Core
            ) {
                officialCore = Core;
            } else if (window.Core) {
                officialCore = window.Core;
            }
        } catch (officialCoreLookupError) {
            officialCore = null;
        }

        var officialMainUI =
            officialCore &&
            officialCore.ui &&
            officialCore.ui.mainUI
                ? officialCore.ui.mainUI
                : null;

        var liveBadge =
            officialMainUI &&
            officialMainUI._badgeButton
                ? officialMainUI._badgeButton
                : null;

        /*
         * First runtime path:
         * execute the exact BasePromotionButton currently selected by
         * Agar.io.
         */
        if (
            liveBadge &&
            typeof liveBadge.executeCallback ===
                'function'
        ) {
            var liveOfferId = null;
            var liveOfferSystem =
                liveBadge.system || null;
            var liveOfferIsActive = true;
            var liveBadgeConfig = null;

            try {
                if (
                    typeof liveBadge.get_offerId ===
                        'function'
                ) {
                    liveOfferId =
                        liveBadge.get_offerId();
                }

                if (
                    liveOfferId &&
                    liveOfferSystem &&
                    typeof liveOfferSystem.isOfferActive ===
                        'function'
                ) {
                    liveOfferIsActive =
                        !!liveOfferSystem.isOfferActive(
                            liveOfferId
                        );
                }

                if (
                    typeof liveBadge.getBadgeConfiguration ===
                        'function'
                ) {
                    var liveBadgeConfigWrapper =
                        liveBadge.getBadgeConfiguration();

                    liveBadgeConfig =
                        liveBadgeConfigWrapper &&
                        liveBadgeConfigWrapper
                            .badgeConfiguration
                            ? liveBadgeConfigWrapper
                                .badgeConfiguration
                            : liveBadgeConfigWrapper;
                }
            } catch (liveBadgeReadError) {
                console.warn(
                    '[OFFICIAL OFFER] Could not inspect the live Agar.io badge:',
                    liveBadgeReadError
                );
            }

            if (liveOfferIsActive) {
                window._lmDailyDealOpening = true;

                try {
                    liveBadge.executeCallback();

                    window._lmOfficialPromotion = {
                        offerId: liveOfferId,
                        config: liveBadgeConfig,
                        delegate: null,
                        system: liveOfferSystem,
                        callback: function() {
                            return liveBadge
                                .executeCallback();
                        },
                        receivedAt: Date.now(),
                        source:
                            'Core.ui.mainUI._badgeButton'
                    };

                    if (
                        window.agarApp &&
                        window.agarApp.API &&
                        typeof window.agarApp.API.playSound ===
                            'function'
                    ) {
                        window.agarApp.API.playSound(
                            'sfxClick'
                        );
                    }

                    console.log(
                        '[OFFICIAL OFFER] Opened through Core.ui.mainUI._badgeButton:',
                        {
                            offerId: liveOfferId,
                            system: liveOfferSystem
                        }
                    );

                    setTimeout(
                        function() {
                            window._lmDailyDealOpening =
                                false;
                        },
                        750
                    );

                    return true;
                } catch (liveBadgeOpenError) {
                    window._lmDailyDealOpening = false;

                    console.warn(
                        '[OFFICIAL OFFER] Live badge callback failed; trying the active promotion client:',
                        liveBadgeOpenError
                    );
                }
            }
        }

        /*
         * Second runtime path:
         * ask the official active promotion client for its next
         * badge-eligible offer and invoke the same badgeButtonPressed()
         * method used by Agar.io's BasePromotionButton callback.
         */
        var promoService =
            officialCore &&
            officialCore.services
                ? officialCore.services.promo
                : null;

        var activePromoSystem = null;
        var activePromoClient = null;
        var activePromoDelegate = null;
        var activeOfferId = null;

        try {
            if (
                promoService &&
                typeof promoService
                    .getActivePromotionSystem ===
                    'function'
            ) {
                activePromoSystem =
                    promoService
                        .getActivePromotionSystem();
            }

            if (
                promoService &&
                typeof promoService
                    .getActivePromotionClient ===
                    'function'
            ) {
                activePromoClient =
                    promoService
                        .getActivePromotionClient();
            }

            if (
                activePromoClient &&
                typeof activePromoClient
                    .get_gameDelegate ===
                    'function'
            ) {
                activePromoDelegate =
                    activePromoClient
                        .get_gameDelegate();
            }

            if (
                activePromoClient &&
                typeof activePromoClient
                    .getNextShowableBadgeOfferId ===
                    'function'
            ) {
                activeOfferId =
                    activePromoClient
                        .getNextShowableBadgeOfferId();
            }

            /*
             * Defensive fallback for builds where the client method
             * returned no value even though the system contains active,
             * badge-eligible offers.
             */
            if (
                !activeOfferId &&
                activePromoSystem &&
                typeof activePromoSystem
                    .getActiveOffers ===
                    'function'
            ) {
                var activeOffers =
                    activePromoSystem
                        .getActiveOffers() || [];

                for (
                    var activeOfferIndex = 0;
                    activeOfferIndex <
                        activeOffers.length;
                    activeOfferIndex++
                ) {
                    var activeOffer =
                        activeOffers[
                            activeOfferIndex
                        ];

                    var candidateOfferId =
                        activeOffer &&
                        activeOffer.offerName
                            ? activeOffer.offerName
                            : null;

                    if (!candidateOfferId) {
                        continue;
                    }

                    if (
                        activePromoDelegate &&
                        typeof activePromoDelegate
                            .canShowOfferBadge ===
                            'function' &&
                        !activePromoDelegate
                            .canShowOfferBadge(
                                candidateOfferId,
                                activePromoSystem
                            )
                    ) {
                        continue;
                    }

                    activeOfferId =
                        candidateOfferId;

                    break;
                }
            }

            if (
                activeOfferId &&
                activePromoSystem &&
                typeof activePromoSystem
                    .isOfferActive ===
                    'function' &&
                !activePromoSystem
                    .isOfferActive(activeOfferId)
            ) {
                activeOfferId = null;
            }
        } catch (activePromoLookupError) {
            console.warn(
                '[OFFICIAL OFFER] Active promotion lookup failed:',
                activePromoLookupError
            );

            activeOfferId = null;
        }

        if (
            activeOfferId &&
            activePromoSystem &&
            activePromoDelegate &&
            typeof activePromoDelegate
                .badgeButtonPressed ===
                'function'
        ) {
            window._lmDailyDealOpening = true;

            try {
                activePromoDelegate
                    .badgeButtonPressed(
                        activeOfferId,
                        activePromoSystem
                    );

                window._lmOfficialPromotion = {
                    offerId: activeOfferId,
                    config: null,
                    delegate: activePromoDelegate,
                    system: activePromoSystem,
                    callback: function() {
                        return activePromoDelegate
                            .badgeButtonPressed(
                                activeOfferId,
                                activePromoSystem
                            );
                    },
                    receivedAt: Date.now(),
                    source:
                        'Core.services.promo'
                };

                if (
                    window.agarApp &&
                    window.agarApp.API &&
                    typeof window.agarApp.API.playSound ===
                        'function'
                ) {
                    window.agarApp.API.playSound(
                        'sfxClick'
                    );
                }

                console.log(
                    '[OFFICIAL OFFER] Opened through the active Agar.io promotion client:',
                    {
                        offerId: activeOfferId,
                        system: activePromoSystem
                    }
                );

                setTimeout(
                    function() {
                        window._lmDailyDealOpening =
                            false;
                    },
                    750
                );

                return true;
            } catch (activePromoOpenError) {
                window._lmDailyDealOpening = false;

                console.error(
                    '[OFFICIAL OFFER] Active Agar.io promotion failed to open:',
                    activePromoOpenError
                );
            }
        }

        /*
         * Final DOM recovery path:
         * use the original rendered promotion button if available.
         * Search multiple locations:
         *   1. #lm-preserved-official-promo (where we moved the offers container)
         *   2. .promo-badge-container (anywhere in the DOM)
         *   3. #mainui-app (the official Vue app root, stays in DOM as position:fixed)
         *   4. Any button whose id starts with "button_" (the official daily
         *      deal pattern, e.g. button_ArcadeGamesSkins_2026-08-030)
         */
        var promoContainer =
            document.querySelector(
                '#lm-preserved-official-promo .promo-badge-container, ' +
                '#lm-preserved-official-promo, ' +
                '.promo-badge-container'
            );

        var promoButtons =
            promoContainer
                ? promoContainer.querySelectorAll(
                    'button'
                )
                : [];

        var promoButton = null;

        for (
            var i = 0;
            i < promoButtons.length;
            i++
        ) {
            if (
                promoButtons[i].id !==
                'coinShop' &&
                promoButtons[i].id !==
                'freeCoins'
            ) {
                promoButton =
                    promoButtons[i];

                break;
            }
        }

        /*
         * Fallback: search #mainui-app directly.
         * The official Vue app is position:fixed and stays in the DOM
         * even after Legend Mod restructures the menu.
         */
        if (!promoButton) {
            var mainuiApp =
                document.getElementById('mainui-app');

            if (mainuiApp) {
                var mainuiPromoButtons =
                    mainuiApp.querySelectorAll(
                        '.promo-badge-container button'
                    );

                for (
                    var mi = 0;
                    mi < mainuiPromoButtons.length;
                    mi++
                ) {
                    if (
                        mainuiPromoButtons[mi].id !==
                        'coinShop' &&
                        mainuiPromoButtons[mi].id !==
                        'freeCoins'
                    ) {
                        promoButton =
                            mainuiPromoButtons[mi];

                        break;
                    }
                }
            }
        }

        /*
         * Fallback: search for any button whose id starts with "button_".
         * The official daily deal button has a dynamic id like
         * "button_ArcadeGamesSkins_2026-08-030" that changes each day.
         */
        if (!promoButton) {
            promoButton =
                document.querySelector(
                    'button[id^="button_"]'
                );

            /* Exclude coinShop / freeCoins if they accidentally match */
            if (
                promoButton &&
                (promoButton.id === 'coinShop' ||
                 promoButton.id === 'freeCoins')
            ) {
                promoButton = null;
            }
        }

        /*
         * Last resort: try calling the Vue offers component's
         * onPromoClick() directly, bypassing the DOM button entirely.
         */
        if (!promoButton) {
            var offersEl =
                document.getElementById(
                    'mainui-offers'
                );

            var offersVm =
                offersEl && offersEl.__vue__
                    ? offersEl.__vue__
                    : null;

            /* Walk up the parent chain if __vue__ is on a wrapper */
            if (
                !offersVm &&
                offersEl
            ) {
                var walker = offersEl;
                while (
                    walker &&
                    !walker.__vue__
                ) {
                    walker = walker.parentElement;
                }

                if (
                    walker &&
                    walker.__vue__
                ) {
                    offersVm = walker.__vue__;
                }
            }

            /* Try to find the offers child component */
            if (
                offersVm &&
                offersVm.$children
            ) {
                for (
                    var ci = 0;
                    ci < offersVm.$children.length;
                    ci++
                ) {
                    var child = offersVm.$children[ci];
                    if (
                        typeof child.promoCallback ===
                        'function'
                    ) {
                        offersVm = child;
                        break;
                    }
                }
            }

            if (
                offersVm &&
                typeof offersVm.promoCallback ===
                    'function' &&
                offersVm.promoConfig
            ) {
                window._lmDailyDealOpening = true;

                try {
                    offersVm.onPromoClick
                        ? offersVm.onPromoClick()
                        : offersVm.promoCallback();

                    console.log(
                        '[OFFICIAL OFFER] Opened via Vue onPromoClick/promoCallback:',
                        {
                            promoId: offersVm.promoId,
                            hasConfig: !!offersVm.promoConfig
                        }
                    );

                    setTimeout(
                        function() {
                            window._lmDailyDealOpening =
                                false;
                        },
                        750
                    );

                    return true;
                } catch (vueCallError) {
                    window._lmDailyDealOpening = false;

                    console.warn(
                        '[OFFICIAL OFFER] Vue promoCallback failed:',
                        vueCallError
                    );
                }
            }
        }

        if (promoButton) {
            window._lmDailyDealOpening = true;

            console.log(
                '[OFFICIAL OFFER] Found promo button in DOM:',
                {
                    id: promoButton.id,
                    parentId: promoButton.parentElement
                        ? promoButton.parentElement.id
                        : 'none'
                }
            );

            try {
                promoButton.dispatchEvent(
                    new MouseEvent(
                        'click',
                        {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }
                    )
                );
            } catch (promoButtonError) {
                console.error(
                    '[OFFICIAL OFFER] Original Agar.io promotion button failed:',
                    promoButtonError
                );

                window._lmDailyDealOpening = false;

                return false;
            }

            setTimeout(
                function() {
                    window._lmDailyDealOpening =
                        false;
                },
                750
            );

            return true;
        }

        /*
         * Diagnostic: log what we found at each search location
         * so we can see exactly where the chain is breaking.
         */
        var diag = {
            _lmOfficialPromotion:
                window._lmOfficialPromotion
                    ? {
                        offerId: window._lmOfficialPromotion.offerId,
                        hasCallback: typeof window._lmOfficialPromotion.callback === 'function',
                        receivedAt: window._lmOfficialPromotion.receivedAt
                    }
                    : null,
            homeEl:
                !!document.getElementById('home'),
            preservedHost:
                !!document.getElementById(
                    'lm-preserved-official-promo'
                ),
            mainuiOffers:
                !!document.getElementById(
                    'mainui-offers'
                ),
            mainuiApp:
                !!document.getElementById(
                    'mainui-app'
                ),
            promoBadgeContainer:
                !!document.querySelector(
                    '.promo-badge-container'
                ),
            promoBadgeButtons:
                document.querySelectorAll(
                    '.promo-badge-container button'
                ).length,
            buttonIdPattern:
                document.querySelectorAll(
                    'button[id^="button_"]'
                ).length,
            offersVue: (function() {
                var el = document.getElementById('mainui-offers');
                if (!el) return 'no #mainui-offers';
                if (!el.__vue__) return 'no __vue__';
                var vm = el.__vue__;
                return {
                    promoId: vm.promoId,
                    hasConfig: !!vm.promoConfig,
                    hasCallback: typeof vm.promoCallback === 'function'
                };
            })()
        };

        console.warn(
            '[OFFICIAL OFFER] All recovery paths failed. Diagnostic:',
            diag
        );

        /*
         * Do not repeatedly retry openDailyDealsModal().
         * The promotion event is produced asynchronously by Agar.io.
         */
        if (window.toastr) {
            toastr.info(
                '<b>[OFFICIAL OFFER]:</b> Agar.io has not supplied an official promotion yet. Return to the main menu and try again after a few seconds.'
            );
        }

        return false;
    };

    window.showDailyDealsCarouselModal = function() {
        return window.openDailyDealsModal();
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
            },
            {
                id: 'rush',
                name: 'Rush Boost',
                bannerColor: '#d84315',
                gradient: 'linear-gradient(180deg, #ff7043 0%, #d84315 100%)',
                icon: '🚀',
                bgGraphic: 'linear-gradient(135deg, rgba(255,87,34,0.2) 0%, rgba(230,74,25,0.4) 100%)',
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showRushBoostModal === 'function') window.showRushBoostModal();
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

    /*
     * CONFIG-DRIVEN PREMIUM POTION SHOP
     *
     * Catalogue:  getAgarPremiumPotionCatalog()
     * Detail:     getAgarPremiumPotionInfo(id)
     * Purchase:   buyAgarPremiumPotion(id)
     *
     * No hardcoded potion IDs, prices, or reward ranges.
     */


    window.showPotionDetailModal = function (potionType) {
        injectStyles();

        var info = typeof window.getAgarPremiumPotionInfo === 'function'
            ? window.getAgarPremiumPotionInfo(potionType) : null;

        if (!info) {
            if (window.toastr) toastr.warning('<b>[POTION]:</b> Potion configuration is not available yet.');
            return false;
        }

        var productId = String(info.productId || '');
        var baseName = productId.replace(/^potion_/i, '').replace(/_/g, ' ')
            .replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        var name = baseName + ' Potion';

        var tierColors = {
            potion_superior: '#4caf50', potion_epic: '#00bcd4',
            potion_legendary: '#e91e63', potion_mythical: '#ffb300'
        };
        var potionColor = tierColors[productId] || '#00bcd4';

        var coinText = info.coinText || '\u2014';
        var skinPiecesText = info.skinPieces > 0 ? ('x' + info.skinPieces) : '\u2014';
        var specialPiecesText = info.minSpecialPieces > 0
            ? ('x' + info.minSpecialPieces + ' Special') : '';

        var priceText = (info.price !== null && info.price !== undefined)
            ? (typeof window.formatAgarCurrency === 'function'
                ? window.formatAgarCurrency(info.price, info.currency)
                : (String(info.price) + (info.currency ? (' ' + info.currency) : '')))
            : '\u2014';

        var old = document.getElementById('lm-potion-detail-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-potion-detail-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000010';
        modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });

        var specialHtml = specialPiecesText
            ? '<div style="background:#fff;border-radius:12px;padding:10px 16px;margin-bottom:12px;border:1px solid rgba(0,0,0,.06);text-align:center;">' +
                '<div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:4px;">At least</div>' +
                '<div style="font-size:16px;font-weight:900;color:#f57f17;display:flex;align-items:center;justify-content:center;gap:8px;">' +
                    '<span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:3px solid #ffb300;background:#fff8e1;"></span>' +
                    '<span>' + specialPiecesText + '</span></div></div>' : '';

        modal.innerHTML =
            '<div class="lm-modal-container" style="background:#fff;border-radius:16px;width:440px;padding:24px;position:relative;box-shadow:0 12px 48px rgba(0,0,0,.5);text-align:center;">' +
                '<button type="button" onclick="document.getElementById(\'lm-potion-detail-modal\').remove();" style="position:absolute;right:16px;top:16px;background:none;border:none;font-size:22px;color:#aaa;cursor:pointer;font-weight:900;">&times;</button>' +
                '<div style="font-size:22px;font-weight:900;color:#333;margin-bottom:16px;">' + name + '</div>' +
                '<div style="background:#f0f3f6;border-radius:14px;padding:20px;margin-bottom:18px;">' +
                    '<div style="width:90px;height:90px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:42px;background:radial-gradient(circle,' + potionColor + '22,' + potionColor + '44);border:3px solid ' + potionColor + ';box-shadow:0 4px 12px rgba(0,0,0,.12);">\uD83E\uDDEA</div>' +
                    '<div style="display:flex;justify-content:center;gap:20px;margin-bottom:12px;">' +
                        '<div style="text-align:center;"><div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;">Coins</div><div style="font-size:16px;font-weight:900;color:#333;">' + coinText + '</div></div>' +
                        '<div style="text-align:center;"><div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;">Skin Pieces</div><div style="font-size:16px;font-weight:900;color:#333;">' + skinPiecesText + '</div></div>' +
                    '</div>' + specialHtml +
                '</div>' +
                '<div style="font-size:13px;font-weight:700;color:#888;margin-bottom:8px;">Price: ' + priceText + '</div>' +
            '</div>';

        document.body.appendChild(modal);
        return true;
    };


    window.showPremiumPotionsModal = function () {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-premium-potions-modal');
        if (old) old.remove();

        var catalog = typeof window.getAgarPremiumPotionCatalog === 'function'
            ? window.getAgarPremiumPotionCatalog() : [];

        var appUser = (window.application && window.application.user) || {};
        var dnaBalance = Number(appUser.dna) || 0;
        var coinsBalance = Number(appUser.coins) || 0;

        var tierColors = {
            potion_superior:  { bg: '#e8f5e9', border: '#4caf50', gradient: 'linear-gradient(180deg,#66bb6a,#388e3c)' },
            potion_epic:      { bg: '#e0f7fa', border: '#00bcd4', gradient: 'linear-gradient(180deg,#26c6da,#00838f)' },
            potion_legendary: { bg: '#fce4ec', border: '#e91e63', gradient: 'linear-gradient(180deg,#ec407a,#c2185b)' },
            potion_mythical:  { bg: '#fff8e1', border: '#ffb300', gradient: 'linear-gradient(180deg,#ffca28,#ff8f00)' }
        };

        var modal = document.createElement('div');
        modal.id = 'lm-premium-potions-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });

        /* Build header */
        var headerHtml =
            '<div style="padding:16px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ' + t.border + ';">' +
                '<div style="display:flex;align-items:center;gap:12px;">' +
                    '<button onclick="document.getElementById(\'lm-premium-potions-modal\').remove(); if(window.showShopModal) window.showShopModal();" style="width:32px;height:32px;border-radius:50%;background:#00d3ff;color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;" title="Back to Shop">\u2039</button>' +
                    '<div style="font-size:22px;font-weight:900;color:' + t.tc1 + ';">Premium Potions</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;">' +
                    '<div style="background:' + t.cardBg + ';border:2px solid #8bc34a;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:800;color:#558b2f;">\uD83E\uDDEC ' + dnaBalance.toLocaleString() + '</div>' +
                    '<div style="background:' + t.cardBg + ';border:2px solid #fbc02d;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:800;color:#f57f17;">\uD83D\uDCB0 ' + coinsBalance.toLocaleString() + '</div>' +
                    '<button onclick="document.getElementById(\'lm-premium-potions-modal\').remove();" style="background:none;border:none;font-size:24px;color:' + t.tc2 + ';cursor:pointer;font-weight:900;margin-left:8px;">&times;</button>' +
                '</div>' +
            '</div>';

        var infoBarHtml = '<div style="margin:16px 20px 0;background:' + t.panelBg + ';border-radius:10px;padding:12px;text-align:center;font-size:13px;font-weight:700;color:' + t.tc2 + ';">Potions purchased in the shop will open immediately!</div>';

        var cardsHtml = '';

        if (catalog.length === 0) {
            cardsHtml = '<div style="padding:35px;text-align:center;color:' + t.tc2 + ';font-size:14px;width:100%;">Agar.io has not supplied the premium potion catalogue yet.</div>';
        } else {
            catalog.forEach(function (info) {
                var pid = info.productId;
                var colors = tierColors[pid] || { bg: '#f5f5f5', border: '#999', gradient: 'linear-gradient(180deg,#bbb,#888)' };

                var priceText = (info.price !== null && info.price !== undefined)
                    ? (typeof window.formatAgarCurrency === 'function'
                        ? window.formatAgarCurrency(info.price, info.currency)
                        : (String(info.price) + (info.currency ? (' ' + info.currency) : '')))
                    : 'Unavailable';

                var baseName = pid.replace(/^potion_/i, '').replace(/_/g, ' ')
                    .replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });

                var buyDisabled = !info.purchaseId ? ' disabled style="opacity:.4;"' : '';

                cardsHtml +=
                    '<div style="position:relative;flex:1;min-width:140px;max-width:180px;border-radius:14px;padding:16px 12px;border:2px solid ' + colors.border + ';background:' + colors.bg + ';display:flex;flex-direction:column;align-items:center;text-align:center;">' +
                        '<button onclick="if(window.showPotionDetailModal) window.showPotionDetailModal(\'' + pid + '\');" style="position:absolute;right:8px;top:8px;width:22px;height:22px;border-radius:50%;background:#00d3ff;color:#fff;border:none;font-weight:900;cursor:pointer;font-size:12px;" title="Potion Info">?</button>' +
                        '<div style="width:80px;height:80px;border-radius:50%;margin:8px 0 10px;display:flex;align-items:center;justify-content:center;font-size:38px;background:radial-gradient(circle,' + colors.border + '22,' + colors.border + '44);border:3px solid ' + colors.border + ';box-shadow:0 4px 12px rgba(0,0,0,.12);">\uD83E\uDDEA</div>' +
                        '<div style="font-size:15px;font-weight:900;color:#333;margin-bottom:4px;">' + baseName + '</div>' +
                        '<button class="btn lm-buy-premium-potion" data-product-id="' + pid + '" style="background:' + colors.gradient + ';color:#fff;font-weight:900;font-size:14px;padding:10px 0;border-radius:8px;border:none;cursor:pointer;width:100%;margin-top:auto;box-shadow:0 3px 8px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;gap:6px;"' + buyDisabled + '>' + priceText + '</button>' +
                    '</div>';
            });
        }

        modal.innerHTML =
            '<div class="lm-modal-container" style="background:' + t.bg + ';border-radius:16px;width:720px;max-width:94vw;padding:0;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.6);">' +
                headerHtml + infoBarHtml +
                '<div style="padding:20px;display:flex;gap:14px;background:' + t.bg + ';flex-wrap:wrap;justify-content:center;">' +
                    cardsHtml +
                '</div>' +
            '</div>';

        /*
         * Wire Premium Potion purchases.
         *
         * productId  = potion_mythical
         * purchaseId = 1_potion_mythical
         *
         * Pending registry is keyed by purchaseId, not productId.
         */
        modal.addEventListener('click', function (e) {
            var btn = e.target.closest('.lm-buy-premium-potion');
            if (!btn || btn.disabled) return;

            var productId = String(btn.getAttribute('data-product-id') || '').trim();
            if (!productId || typeof window.buyAgarPremiumPotion !== 'function') return;

            /* Re-resolve from GameConfiguration */
            var potionInfo = typeof window.getAgarPremiumPotionInfo === 'function'
                ? window.getAgarPremiumPotionInfo(productId) : null;

            if (!potionInfo || !potionInfo.purchaseId) {
                if (window.toastr) toastr.warning('<b>[POTION]:</b> Purchase configuration unavailable.');
                return false;
            }

            var purchaseId = String(potionInfo.purchaseId).trim();

            /* Correct key: e.g. 1_potion_mythical */
            if (typeof window._lmHasPendingSoftPurchase === 'function' &&
                window._lmHasPendingSoftPurchase(purchaseId)) {
                if (window.toastr) toastr.info('<b>[POTION]:</b> This purchase is already pending.');
                return false;
            }

            var originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.style.opacity = '.55';
            btn.style.cursor = 'not-allowed';
            btn.textContent = 'BUYING...';

            var sent = window.buyAgarPremiumPotion(productId);
            if (!sent) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.innerHTML = originalHtml;
            }

            return false;
        });

        document.body.appendChild(modal);
    };


    /*
     * ═══════════════════════════════════════════════════════════════════
     * CONFIG-DRIVEN NORMAL BOOST SHOP
     * ═══════════════════════════════════════════════════════════════════
     *
     * Actions:
     *
     *      window.buyConfiguredBoost(productId)
     *      window.useConfiguredBoost(productId)
     *
     * No shorthand IDs. No hardcoded prices. No hardcoded durations.
     */


    window._lmGetBoostInventory =
        function () {
            if (
                window.application &&
                window.application.user &&
                window.application.user.boosts
            ) {
                return window.application.user.boosts;
            }

            if (
                window.LM &&
                window.LM.user &&
                window.LM.user.boosts
            ) {
                return window.LM.user.boosts;
            }

            return {};
        };


    window._lmGetBoostOwnedCount =
        function (productId) {
            var inventory = window._lmGetBoostInventory();
            return Math.max(0, Number(inventory[productId]) || 0);
        };


    window.showConfiguredBoostModal =
        function (boostType) {
            boostType = String(boostType || '').toLowerCase();

            if (boostType !== 'xp' && boostType !== 'mass') {
                console.warn('[LM BOOST SHOP] Invalid boost type:', boostType);
                return false;
            }

            injectStyles();

            var modalId = boostType === 'xp'
                ? 'lm-xp-boost-modal'
                : 'lm-mass-boost-modal';

            var old = document.getElementById(modalId);
            if (old) old.remove();

            var catalog = typeof window.getAgarBoostCatalog === 'function'
                ? window.getAgarBoostCatalog().filter(function (item) {
                    return item && item.type === boostType;
                })
                : [];

            var appUser = (window.application && window.application.user) || {};
            var dnaBalance = Number(appUser.dna) || 0;
            var coinsBalance = Number(appUser.coins) || 0;

            var t = getTheme();

            var modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'lm-modal-overlay';
            modal.style.zIndex = '1000000';
            modal.dataset.boostType = boostType;
            modal.addEventListener('click', function (e) {
                if (e.target === modal) modal.remove();
            });

            var shell = document.createElement('div');
            shell.className = 'lm-modal-container';
            shell.style.cssText =
                'background:' + t.bg + ';' +
                'border-radius:16px;' +
                'width:720px;' +
                'max-width:94vw;' +
                'padding:0;' +
                'overflow:hidden;' +
                'box-shadow:0 10px 40px rgba(0,0,0,.6);';

            /* Header */
            var header = document.createElement('div');
            header.style.cssText =
                'padding:16px 24px;' +
                'display:flex;align-items:center;justify-content:space-between;' +
                'border-bottom:1px solid ' + t.border + ';';

            var leftBox = document.createElement('div');
            leftBox.style.cssText = 'display:flex;align-items:center;gap:12px;';

            var back = document.createElement('button');
            back.type = 'button';
            back.textContent = '\u2039';
            back.title = 'Back to Shop';
            back.style.cssText =
                'width:32px;height:32px;border-radius:50%;background:#00d3ff;' +
                'color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;';
            back.onclick = function () {
                modal.remove();
                if (typeof window.showShopModal === 'function') window.showShopModal();
            };

            var heading = document.createElement('div');
            heading.style.cssText = 'font-size:22px;font-weight:900;color:' + t.tc1 + ';';
            heading.textContent = boostType === 'xp' ? 'XP Boost' : 'Starting Mass Boost';

            leftBox.appendChild(back);
            leftBox.appendChild(heading);

            var balDiv = document.createElement('div');
            balDiv.style.cssText = 'display:flex;align-items:center;gap:10px;';

            var dnaEl = document.createElement('div');
            dnaEl.style.cssText =
                'background:' + t.cardBg + ';border:2px solid #8bc34a;padding:4px 12px;' +
                'border-radius:20px;font-size:13px;font-weight:800;color:#558b2f;';
            dnaEl.textContent = '\uD83E\uDDEC ' + dnaBalance.toLocaleString();

            var coinsEl = document.createElement('div');
            coinsEl.style.cssText =
                'background:' + t.cardBg + ';border:2px solid #fbc02d;padding:4px 12px;' +
                'border-radius:20px;font-size:13px;font-weight:800;color:#f57f17;';
            coinsEl.textContent = '\uD83D\uDCB0 ' + coinsBalance.toLocaleString();

            var closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.textContent = '\u00D7';
            closeBtn.style.cssText =
                'background:none;border:none;font-size:24px;color:' + t.tc2 + ';' +
                'cursor:pointer;font-weight:900;';
            closeBtn.onclick = function () { modal.remove(); };

            balDiv.appendChild(dnaEl);
            balDiv.appendChild(coinsEl);
            balDiv.appendChild(closeBtn);

            header.appendChild(leftBox);
            header.appendChild(balDiv);

            /* Body */
            var body = document.createElement('div');
            body.style.cssText =
                'padding:22px;background:' + t.panelBg + ';' +
                'max-height:68vh;overflow-y:auto;';

            if (catalog.length === 0) {
                var empty = document.createElement('div');
                empty.style.cssText =
                    'padding:35px;text-align:center;color:' + t.tc2 + ';font-size:14px;';
                empty.textContent = 'Agar.io has not supplied this boost catalogue yet.';
                body.appendChild(empty);
            } else {
                var grid = document.createElement('div');
                grid.style.cssText =
                    'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;';

                catalog.forEach(function (info) {
                    var owned = window._lmGetBoostOwnedCount(info.productId);

                    var duration = typeof window.formatAgarDurationSeconds === 'function'
                        ? window.formatAgarDurationSeconds(
                            (Number(info.durationMins) || 0) * 60, true
                        )
                        : (info.durationMins + 'm');

                    var priceText = (info.price !== null && info.price !== undefined)
                        ? (typeof window.formatAgarCurrency === 'function'
                            ? window.formatAgarCurrency(info.price, info.currency)
                            : (info.price + ' ' + (info.currency || '')))
                        : 'Unavailable';

                    var card = document.createElement('div');
                    card.style.cssText =
                        'position:relative;background:' + t.cardBg + ';' +
                        'border-radius:14px;padding:17px;' +
                        'border:1px solid ' + t.border + ';' +
                        'display:flex;flex-direction:column;min-height:215px;';

                    if (info.bestDeal) {
                        var bestTag = document.createElement('div');
                        bestTag.textContent = '\u2605 BEST';
                        bestTag.style.cssText =
                            'position:absolute;top:10px;left:10px;' +
                            'background:#ff9800;color:#fff;padding:3px 7px;' +
                            'border-radius:12px;font-size:9px;font-weight:900;';
                        card.appendChild(bestTag);
                    }

                    var visual = document.createElement('div');
                    visual.style.cssText =
                        'margin:18px auto 8px;width:88px;height:88px;border-radius:50%;' +
                        'display:flex;align-items:center;justify-content:center;' +
                        'font-size:42px;font-weight:900;' +
                        'background:' + (info.type === 'xp'
                            ? 'radial-gradient(circle,#fff176,#ffb300)'
                            : 'radial-gradient(circle,#29b6f6,#0288d1)') + ';' +
                        'color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);';
                    visual.textContent = info.type === 'xp' ? '\u2B50' : 'M';
                    card.appendChild(visual);

                    var title = document.createElement('div');
                    title.style.cssText =
                        'text-align:center;font-size:17px;font-weight:900;color:' + t.tc1 + ';';
                    title.textContent = info.multiplier + 'x ' +
                        (info.type === 'xp' ? 'XP' : 'Starting Mass');
                    card.appendChild(title);

                    var durEl = document.createElement('div');
                    durEl.style.cssText =
                        'text-align:center;font-size:12px;font-weight:700;' +
                        'color:' + t.tc2 + ';margin-top:3px;';
                    durEl.textContent = duration;
                    card.appendChild(durEl);

                    var ownedEl = document.createElement('div');
                    ownedEl.style.cssText =
                        'text-align:center;font-size:11px;font-weight:800;' +
                        'color:' + t.tc2 + ';margin:8px 0;';
                    ownedEl.textContent = 'Owned: ' + owned;
                    ownedEl.dataset.productId = info.productId;
                    ownedEl.className = 'lm-boost-owned-label';
                    card.appendChild(ownedEl);

                    var actions = document.createElement('div');
                    actions.style.cssText =
                        'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:auto;';

                    var buyBtn = document.createElement('button');
                    buyBtn.type = 'button';
                    buyBtn.style.cssText =
                        'border:0;border-radius:8px;padding:8px 6px;font-size:12px;' +
                        'font-weight:900;cursor:pointer;' +
                        'background:linear-gradient(180deg,#8bc34a,#689f38);color:#fff;';
                    buyBtn.textContent = 'BUY ' + priceText;

                    if (!info.purchaseId) {
                        buyBtn.disabled = true;
                        buyBtn.style.opacity = '.4';
                    }

                    buyBtn.onclick = (function (capturedInfo, capturedPriceText, btn) {
                        return function () {
                            if (!capturedInfo.purchaseId ||
                                typeof window.buyConfiguredBoost !== 'function') {
                                return false;
                            }

                            if (typeof window._lmHasPendingSoftPurchase === 'function' &&
                                window._lmHasPendingSoftPurchase(capturedInfo.purchaseId)) {
                                if (window.toastr) toastr.info('This purchase is already pending.');
                                return false;
                            }

                            btn.disabled = true;
                            btn.textContent = 'BUYING...';

                            var sent = window.buyConfiguredBoost(capturedInfo.productId);
                            if (!sent) {
                                btn.disabled = false;
                                btn.textContent = 'BUY ' + capturedPriceText;
                            }

                            return false;
                        };
                    })(info, priceText, buyBtn);

                    var useBtn = document.createElement('button');
                    useBtn.type = 'button';
                    useBtn.style.cssText =
                        'border:0;border-radius:8px;padding:8px 6px;font-size:12px;' +
                        'font-weight:900;cursor:pointer;' +
                        'background:linear-gradient(180deg,#29b6f6,#0288d1);color:#fff;';
                    useBtn.textContent = 'USE';

                    if (owned <= 0) {
                        useBtn.disabled = true;
                        useBtn.style.opacity = '.4';
                        useBtn.style.cursor = 'not-allowed';
                    }

                    useBtn.onclick = (function (capturedInfo) {
                        return function () {
                            var cur = window._lmGetBoostOwnedCount(capturedInfo.productId);
                            if (cur <= 0) {
                                if (window.toastr) {
                                    toastr.warning('<b>[BOOST]:</b> You do not own this boost.');
                                }
                                return false;
                            }

                            if (typeof window.useConfiguredBoost === 'function') {
                                window.useConfiguredBoost(capturedInfo.productId);
                            }

                            return false;
                        };
                    })(info);

                    actions.appendChild(buyBtn);
                    actions.appendChild(useBtn);
                    card.appendChild(actions);
                    grid.appendChild(card);
                });

                body.appendChild(grid);
            }

            shell.appendChild(header);
            shell.appendChild(body);
            modal.appendChild(shell);
            document.body.appendChild(modal);

            return true;
        };


    /*
     * Compatibility: existing Shop categories call these names.
     */
    window.showXPBoostModal =
        function () {
            return window.showConfiguredBoostModal('xp');
        };


    window.showMassBoostModal =
        function () {
            return window.showConfiguredBoostModal('mass');
        };


    /*
     * ═══════════════════════════════════════════════════════════════════
     * CONFIG-DRIVEN RUSH BOOST SHOP
     * ═══════════════════════════════════════════════════════════════════
     *
     * BUY: window.buyAgarRushBoost(productId)
     *
     * There is NO invented "Use Rush Boost" protocol here.
     */


    window._lmGetRushBoostOwnedCount =
        function (productId) {
            var inventory =
                (window.application && window.application.user &&
                    window.application.user.rushBoosts) ||
                (window.LM && window.LM.user && window.LM.user.rushBoosts) ||
                {};
            return Math.max(0, Number(inventory[productId]) || 0);
        };


    window.showRushBoostModal =
        function () {
            injectStyles();

            var old = document.getElementById('lm-rush-boost-modal');
            if (old) old.remove();

            var catalog = typeof window.getAgarRushBoostCatalog === 'function'
                ? window.getAgarRushBoostCatalog()
                : [];

            catalog = catalog.filter(function (info) {
                if (!info) return false;
                var vis = String(info.visibility || '').toLowerCase();
                return (!vis || vis === 'default' || vis === 'visible');
            });

            var appUser = (window.application && window.application.user) || {};
            var coinsBalance = Number(appUser.coins) || 0;
            var t = getTheme();

            var modal = document.createElement('div');
            modal.id = 'lm-rush-boost-modal';
            modal.className = 'lm-modal-overlay';
            modal.style.zIndex = '1000000';
            modal.addEventListener('click', function (e) {
                if (e.target === modal) modal.remove();
            });

            var shell = document.createElement('div');
            shell.className = 'lm-modal-container';
            shell.style.cssText =
                'background:' + t.bg + ';border-radius:16px;width:650px;max-width:94vw;' +
                'padding:0;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.6);';

            /* Header */
            var header = document.createElement('div');
            header.style.cssText =
                'padding:16px 24px;display:flex;align-items:center;' +
                'justify-content:space-between;' +
                'border-bottom:1px solid ' + t.border + ';';

            var titleBox = document.createElement('div');
            titleBox.style.cssText = 'display:flex;align-items:center;gap:12px;';

            var backBtn = document.createElement('button');
            backBtn.type = 'button';
            backBtn.textContent = '\u2039';
            backBtn.title = 'Back to Shop';
            backBtn.style.cssText =
                'width:32px;height:32px;border-radius:50%;background:#ff5722;' +
                'color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;';
            backBtn.onclick = function () {
                modal.remove();
                if (typeof window.showShopModal === 'function') window.showShopModal();
            };

            var headingEl = document.createElement('div');
            headingEl.style.cssText = 'font-size:22px;font-weight:900;color:' + t.tc1 + ';';
            headingEl.textContent = 'Rush Boost';

            titleBox.appendChild(backBtn);
            titleBox.appendChild(headingEl);

            var rightBox = document.createElement('div');
            rightBox.style.cssText = 'display:flex;align-items:center;gap:10px;';

            var coinsBadge = document.createElement('div');
            coinsBadge.style.cssText =
                'background:' + t.cardBg + ';border:2px solid #fbc02d;padding:4px 12px;' +
                'border-radius:20px;font-size:13px;font-weight:800;color:#f57f17;';
            coinsBadge.textContent = '\uD83D\uDCB0 ' + coinsBalance.toLocaleString();

            var closeEl = document.createElement('button');
            closeEl.type = 'button';
            closeEl.textContent = '\u00D7';
            closeEl.style.cssText =
                'background:none;border:none;font-size:24px;color:' + t.tc2 + ';' +
                'cursor:pointer;font-weight:900;';
            closeEl.onclick = function () { modal.remove(); };

            rightBox.appendChild(coinsBadge);
            rightBox.appendChild(closeEl);

            header.appendChild(titleBox);
            header.appendChild(rightBox);

            /* Body */
            var body = document.createElement('div');
            body.style.cssText =
                'padding:22px;background:' + t.panelBg + ';' +
                'max-height:68vh;overflow-y:auto;';

            if (catalog.length === 0) {
                var emptyEl = document.createElement('div');
                emptyEl.style.cssText =
                    'padding:35px;text-align:center;color:' + t.tc2 + ';font-size:14px;';
                emptyEl.textContent = 'Agar.io has not supplied the Rush boost catalogue yet.';
                body.appendChild(emptyEl);
            } else {
                var gridEl = document.createElement('div');
                gridEl.style.cssText =
                    'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;';

                catalog.forEach(function (info) {
                    var owned = window._lmGetRushBoostOwnedCount(info.productId);

                    var priceText = (info.price !== null && info.price !== undefined)
                        ? (typeof window.formatAgarCurrency === 'function'
                            ? window.formatAgarCurrency(info.price, info.currency)
                            : (info.price + ' ' + (info.currency || '')))
                        : 'Unavailable';

                    var card = document.createElement('div');
                    card.style.cssText =
                        'position:relative;background:' + t.cardBg + ';' +
                        'border-radius:14px;padding:17px;' +
                        'border:1px solid ' + t.border + ';' +
                        'display:flex;flex-direction:column;min-height:190px;';

                    var vis = document.createElement('div');
                    vis.style.cssText =
                        'margin:14px auto 8px;width:88px;height:88px;border-radius:50%;' +
                        'display:flex;align-items:center;justify-content:center;' +
                        'font-size:36px;font-weight:900;' +
                        'background:radial-gradient(circle,#ff8a65,#e64a19);' +
                        'color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);';
                    vis.textContent = '\uD83D\uDE80';
                    card.appendChild(vis);

                    var titleEl = document.createElement('div');
                    titleEl.style.cssText =
                        'text-align:center;font-size:17px;font-weight:900;color:' + t.tc1 + ';';
                    titleEl.textContent = '+' + info.addition + ' Starting Mass';
                    card.appendChild(titleEl);

                    var ownedLabel = document.createElement('div');
                    ownedLabel.style.cssText =
                        'text-align:center;font-size:11px;font-weight:800;' +
                        'color:' + t.tc2 + ';margin:8px 0;';
                    ownedLabel.textContent = 'Owned: ' + owned;
                    ownedLabel.dataset.productId = info.productId;
                    ownedLabel.className = 'lm-rush-owned-label';
                    card.appendChild(ownedLabel);

                    var posLabel = document.createElement('div');
                    posLabel.style.cssText =
                        'text-align:center;font-size:10px;color:' + t.tc2 + ';margin-bottom:6px;';
                    posLabel.textContent = info.position
                        ? 'Position: ' + info.position
                        : '';
                    card.appendChild(posLabel);

                    var buyRush = document.createElement('button');
                    buyRush.type = 'button';
                    buyRush.style.cssText =
                        'border:0;border-radius:8px;padding:10px 6px;font-size:13px;' +
                        'font-weight:900;cursor:pointer;width:100%;margin-top:auto;' +
                        'background:linear-gradient(180deg,#ff7043,#d84315);color:#fff;';
                    buyRush.textContent = 'BUY ' + priceText;

                    if (!info.purchaseId) {
                        buyRush.disabled = true;
                        buyRush.style.opacity = '.4';
                    }

                    buyRush.onclick = (function (capturedInfo, capturedPriceText, btn) {
                        return function () {
                            if (!capturedInfo.purchaseId ||
                                typeof window.buyAgarRushBoost !== 'function') {
                                return false;
                            }

                            if (typeof window._lmHasPendingSoftPurchase === 'function' &&
                                window._lmHasPendingSoftPurchase(capturedInfo.purchaseId)) {
                                if (window.toastr) toastr.info('This purchase is already pending.');
                                return false;
                            }

                            btn.disabled = true;
                            btn.textContent = 'BUYING...';

                            var sent = window.buyAgarRushBoost(capturedInfo.productId);
                            if (!sent) {
                                btn.disabled = false;
                                btn.textContent = 'BUY ' + capturedPriceText;
                            }

                            return false;
                        };
                    })(info, priceText, buyRush);

                    card.appendChild(buyRush);
                    gridEl.appendChild(card);
                });

                body.appendChild(gridEl);
            }

            shell.appendChild(header);
            shell.appendChild(body);
            modal.appendChild(shell);
            document.body.appendChild(modal);

            return true;
        };


    /*
     * CONFIGURED BOOST SHOP LIVE REFRESH
     */
    window._lmRefreshOpenBoostShop = function () {
        if (document.getElementById('lm-xp-boost-modal')) {
            if (typeof window.showConfiguredBoostModal === 'function')
                window.showConfiguredBoostModal('xp');
            return;
        }
        if (document.getElementById('lm-mass-boost-modal')) {
            if (typeof window.showConfiguredBoostModal === 'function')
                window.showConfiguredBoostModal('mass');
        }
    };

    window._lmRefreshOpenRushShop = function () {
        if (document.getElementById('lm-rush-boost-modal') &&
            typeof window.showRushBoostModal === 'function') {
            window.showRushBoostModal();
        }
    };

    document.addEventListener('lm-boost-inventory-updated', function () {
        window._lmRefreshOpenBoostShop();
    });
    document.addEventListener('lm-configured-boost-purchased', function () {
        window._lmRefreshOpenBoostShop();
    });
    document.addEventListener('lm-rush-inventory-updated', function () {
        window._lmRefreshOpenRushShop();
    });
    document.addEventListener('lm-rush-boost-purchased', function () {
        window._lmRefreshOpenRushShop();
    });


    window.openShop = function (cat) {
        cat = String(cat || '').trim().toLowerCase();

        if (cat === 'potions' || cat === 'flasks') {
            if (typeof window.showPremiumPotionsModal === 'function')
                window.showPremiumPotionsModal();
            else if (typeof window.showPotionsHelpModal === 'function')
                window.showPotionsHelpModal('rewards');
            return;
        }

        if (cat === 'coins' || cat === 'dna' || cat === 'deals') {
            if (typeof window.SpecialDeals === 'function')
                window.SpecialDeals('deals');
            else if (typeof window.BeforeSpecialDeals === 'function')
                window.BeforeSpecialDeals();
            return;
        }

        if (cat === 'skins') {
            if (typeof window.BeforeSpecialDeals === 'function')
                window.BeforeSpecialDeals();
            else if (typeof window.SpecialDeals === 'function')
                window.SpecialDeals('skins');
            return;
        }

        if (cat === 'xp') {
            if (typeof window.showConfiguredBoostModal === 'function')
                window.showConfiguredBoostModal('xp');
            return;
        }

        if (cat === 'mass') {
            if (typeof window.showConfiguredBoostModal === 'function')
                window.showConfiguredBoostModal('mass');
            return;
        }

        if (cat === 'rush') {
            if (typeof window.showRushBoostModal === 'function')
                window.showRushBoostModal();
            return;
        }

        if (typeof window.showShopModal === 'function')
            window.showShopModal();
    };

    /*
     * Determine whether the current authenticated Agar.io account uses
     * Facebook.
     *
     * Do not trust only agarApp.API.isLoggedWithFacebook(). In Legend Mod,
     * the official API bridge can exist before its authenticationProvider
     * state has synchronized, while master.context and the authenticated
     * user data already identify the provider correctly.
     */
    window.isFacebookAgarAccount = function() {
        var appUser =
            (
                window.application &&
                window.application.user
            ) || {};

        var providerValues = [
            window.master && window.master.context,
            appUser.context,
            appUser.realm,
            appUser.loginProvider,
            appUser.authProvider,
            window.agarApp &&
                window.agarApp.storageInfo &&
                window.agarApp.storageInfo.context
        ];

        /*
         * First accept an affirmative result from the official Agar.io API.
         * A false result is not final because the bridge can be stale during
         * Legend Mod's loading sequence.
         */
        try {
            if (
                window.agarApp &&
                window.agarApp.API &&
                typeof window.agarApp.API
                    .isLoggedWithFacebook ===
                    'function' &&
                window.agarApp.API
                    .isLoggedWithFacebook() ===
                    true
            ) {
                return true;
            }
        } catch (facebookApiError) {
            console.warn(
                '[FRIENDS] Official Facebook provider check failed:',
                facebookApiError
            );
        }

        for (
            var i = 0;
            i < providerValues.length;
            i++
        ) {
            var value =
                providerValues[i];

            if (
                value === undefined ||
                value === null
            ) {
                continue;
            }

            var normalized =
                String(value)
                    .trim()
                    .toLowerCase();

            if (
                normalized === 'facebook' ||
                normalized.indexOf('facebook') !== -1
            ) {
                return true;
            }
        }

        if (
            appUser.facebookId !== undefined &&
            appUser.facebookId !== null &&
            String(appUser.facebookId).trim() !== ''
        ) {
            return true;
        }

        if (
            window.facebookUser ||
            window.fbLoggedIn === true
        ) {
            return true;
        }

        return false;
    };

    window.showFriendsModal = function() {
        // Authenticated & Facebook login check
        var isLoggedIn = typeof window.checkUserLoggedIn === 'function' ? window.checkUserLoggedIn() : !!(window.loggedIn || (window.application && window.application.user && window.application.user.userId));
        var isFacebookLoggedIn =
            isLoggedIn &&
            typeof window.isFacebookAgarAccount ===
                'function' &&
            window.isFacebookAgarAccount();
        var hasServerConnection = !!((window.core && window.core.proxyMobileData) || (window.application && typeof window.application.sendProto === 'function') || window.legendmod);

        var token = window.legendmod ? window.legendmod.accessToken : null;
        if (!token && !isLoggedIn) {
            alert('Please log in with Facebook or Google to access Friends.');
            if (window.toastr) toastr.error('<b>[FRIENDS]:</b> You must be logged in to view friends.');
            return;
        }
        if (!isLoggedIn) {
            if (window.toastr) toastr.error('<b>[FRIENDS]:</b> You must be logged in to view friends.');
            return;
        }
        if (!isFacebookLoggedIn) {
            if (window.toastr) toastr.error('<b>[FRIENDS]:</b> Friends feature requires logging in with Facebook.');
            return;
        }
        if (!hasServerConnection) {
            if (window.toastr) toastr.error('<b>[FRIENDS]:</b> No server connection. Join an Agar.io server first.');
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
        var data = e && e.detail;
        var body = document.getElementById('lm-friends-body');
        if (!body) return;

        var t = getTheme();
        var friends = (data && data.friends) || window.agarioFriends || (window.application && window.application.user && window.application.user.friends) || [];
        var container = document.createElement('div');

        if (Array.isArray(friends) && friends.length > 0) {
            friends.forEach(function(friend) {
                var isOnline = friend.online || friend.isOnline;
                var statusClass = isOnline ? 'lm-status-online' : 'lm-status-offline';
                var name = friend.displayName || friend.name || 'Friend';
                var partyToken = friend.partyToken || friend.partyCode || '';
                var avatar = friend.avatar || friend.icon || 'https://jimboy3100.github.io/banners/profilepic_guest.png';

                var card = document.createElement('div');
                card.className = 'lm-friend-card';

                var leftBox = document.createElement('div');
                leftBox.style.cssText = 'display: flex; align-items: center; gap: 10px;';

                var dot = document.createElement('span');
                dot.className = 'lm-status-dot ' + statusClass;

                var img = document.createElement('img');
                img.src = avatar;
                img.style.cssText = 'width: 28px; height: 28px; border-radius: 50%; object-fit: cover;';
                img.onerror = function() {
                    this.src = 'https://jimboy3100.github.io/banners/profilepic_guest.png';
                };

                var nameSpan = document.createElement('span');
                nameSpan.style.cssText = 'font-weight: 600; color: ' + t.tc + '; font-size: 13px;';
                nameSpan.textContent = name;

                leftBox.appendChild(dot);
                leftBox.appendChild(img);
                leftBox.appendChild(nameSpan);

                var rightBox = document.createElement('div');

                if (partyToken) {
                    var btn = document.createElement('button');
                    btn.className = 'btn';
                    btn.style.cssText = 'background: ' + t.b1 + '; color: ' + t.btc + '; padding: 4px 12px; border-radius: 6px; font-weight: 700; border: none; cursor: pointer;';
                    btn.textContent = '🎮 Join Party';
                    btn.onclick = function () {
                        /* Prefer centralized official Party path */
                        if (typeof window.joinAgarPartyToken === 'function') {
                            window.joinAgarPartyToken(partyToken, function () {
                                var friendsModal = document.getElementById('lm-friends-modal');
                                if (friendsModal) friendsModal.remove();
                            });
                            return false;
                        }

                        /* Very old LM fallback */
                        $('#party-token, #joinPartyToken').val(partyToken);
                        var legacyButton = document.getElementById('join-party-btn');
                        if (legacyButton) legacyButton.click();
                        return false;
                    };
                    rightBox.style.cssText = 'display:flex;align-items:center;gap:6px;';
                    rightBox.appendChild(btn);

                    /* Config-driven official short invite copy */
                    var copyInviteBtn = document.createElement('button');
                    copyInviteBtn.className = 'btn';
                    copyInviteBtn.style.cssText = 'background:' + t.b3 + ';color:' + t.btc + ';padding:4px 10px;border-radius:6px;font-weight:700;border:none;cursor:pointer;font-size:11px;';
                    copyInviteBtn.textContent = '\uD83D\uDD17 Copy';
                    copyInviteBtn.title = 'Copy Party invite link';
                    copyInviteBtn.onclick = function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var inviteUrl = typeof window.buildAgarPartyInviteUrl === 'function'
                            ? window.buildAgarPartyInviteUrl(partyToken) : '';

                        if (!inviteUrl) {
                            if (window.toastr) toastr.warning('<b>[PARTY]:</b> Could not build Party invite.');
                            return false;
                        }

                        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                            navigator.clipboard.writeText(inviteUrl).then(function () {
                                if (window.toastr) toastr.success('<b>[PARTY]:</b> Invite copied.');
                            }).catch(function () {
                                window.prompt('Copy Party invite:', inviteUrl);
                            });
                            return false;
                        }

                        window.prompt('Copy Party invite:', inviteUrl);
                        return false;
                    };
                    rightBox.appendChild(copyInviteBtn);
                } else {
                    var statusSpan = document.createElement('span');
                    statusSpan.style.cssText = 'font-size: 12px; color: ' + t.tc2 + ';';
                    statusSpan.textContent = isOnline ? 'In Lobby' : 'Offline';
                    rightBox.appendChild(statusSpan);
                }

                card.appendChild(leftBox);
                card.appendChild(rightBox);
                container.appendChild(card);
            });
        } else {
            var emptyBox = document.createElement('div');
            emptyBox.style.cssText = 'text-align: center; padding: 25px; color: ' + t.tc2 + '; font-size: 13px;';

            var icon = document.createElement('i');
            icon.className = 'fa fa-users fa-2x';
            icon.style.cssText = 'color: ' + t.b1 + '; margin-bottom: 8px;';

            var br1 = document.createElement('br');
            var text1 = document.createTextNode('No online friends connected right now.');
            var br2 = document.createElement('br');
            var text2 = document.createTextNode('Sign in with Facebook/Miniclip to see your friends list & party rooms!');

            emptyBox.appendChild(icon);
            emptyBox.appendChild(br1);
            emptyBox.appendChild(text1);
            emptyBox.appendChild(br2);
            emptyBox.appendChild(text2);
            container.appendChild(emptyBox);
        }

        body.innerHTML = '';
        body.appendChild(container);
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


    /*
     * ═════════════════════════════════════════════════════════════════════
     * HUNK 7
     * GAMECONFIGURATION-DRIVEN ACCOUNT REWARDS / TIMERS PANEL
     * ═════════════════════════════════════════════════════════════════════
     *
     * STATIC RULES:
     *
     *      GameConfiguration
     *
     * supplies:
     *
     *      - level-up reward IDs
     *      - hourly/daily reward definitions
     *      - timed-event purchase IDs
     *      - potion purchase IDs
     *      - potion brew timers
     *      - time-variable pricing rules
     *
     * LIVE STATE:
     *
     *      opcode/server state
     *
     * supplies:
     *
     *      - current level
     *      - current timed-event remaining time
     *      - current potion state
     *      - current potion remaining time
     *
     * This UI DOES NOT invent:
     *
     *      - prices
     *      - purchase IDs
     *      - rewards
     *      - brew times
     *
     * All BUY operations still go through the already-existing:
     *
     *      window.softPurchase(purchaseId, context)
     */


    window.getLiveTimedEventSecondsRemaining =
        function (
            eventId
        ) {
            if (
                !eventId ||
                !window._lmTimedEventState
            ) {
                return null;
            }


            var state =
                window._lmTimedEventState[
                    eventId
                ];


            if (!state) {
                return null;
            }


            var readyAt =
                Number(
                    state.readyAt
                );


            if (
                Number.isFinite(
                    readyAt
                ) &&
                readyAt > 0
            ) {
                return Math.max(
                    0,
                    Math.ceil(
                        (
                            readyAt -
                            Date.now()
                        ) /
                        1000
                    )
                );
            }


            var seconds =
                Number(
                    state.nextAvailableInSeconds
                );


            if (
                Number.isFinite(
                    seconds
                )
            ) {
                return Math.max(
                    0,
                    seconds
                );
            }


            return null;
        };


    window.getLivePotionSecondsRemaining =
        function (
            potion
        ) {
            if (!potion) {
                return null;
            }


            /*
             * readyAt is preferred because secondsRemaining is only the
             * server value at the instant the packet was received.
             */
            var readyAt =
                Number(
                    potion.readyAt
                );


            if (
                Number.isFinite(
                    readyAt
                ) &&
                readyAt > 0
            ) {
                return Math.max(
                    0,
                    Math.ceil(
                        (
                            readyAt -
                            Date.now()
                        ) /
                        1000
                    )
                );
            }


            var seconds =
                Number(
                    potion.secondsRemaining
                );


            if (
                Number.isFinite(
                    seconds
                )
            ) {
                return Math.max(
                    0,
                    seconds
                );
            }


            /*
             * Legacy compatibility only.
             */
            if (
                potion.expires &&
                typeof potion.expires
                    .getTime ===
                    'function'
            ) {
                var expiresAt =
                    potion.expires
                        .getTime();


                if (
                    Number.isFinite(
                        expiresAt
                    ) &&
                    expiresAt > 0
                ) {
                    return Math.max(
                        0,
                        Math.ceil(
                            (
                                expiresAt -
                                Date.now()
                            ) /
                            1000
                        )
                    );
                }
            }


            return null;
        };


    window._formatLmEconomySeconds =
        function (
            seconds
        ) {
            if (
                seconds ===
                    null ||
                seconds ===
                    undefined ||
                !Number.isFinite(
                    Number(
                        seconds
                    )
                )
            ) {
                return 'Waiting for server';
            }


            seconds =
                Math.max(
                    0,
                    Math.ceil(
                        Number(
                            seconds
                        )
                    )
                );


            if (
                typeof window
                    .formatAgarDurationSeconds ===
                    'function'
            ) {
                return window
                    .formatAgarDurationSeconds(
                        seconds,
                        true
                    );
            }


            var days =
                Math.floor(
                    seconds /
                    86400
                );


            seconds -=
                days *
                86400;


            var hours =
                Math.floor(
                    seconds /
                    3600
                );


            seconds -=
                hours *
                3600;


            var minutes =
                Math.floor(
                    seconds /
                    60
                );


            var secs =
                seconds %
                60;


            var parts = [];


            if (days) {
                parts.push(
                    days +
                    'd'
                );
            }


            if (
                hours ||
                days
            ) {
                parts.push(
                    hours +
                    'h'
                );
            }


            if (
                minutes ||
                hours ||
                days
            ) {
                parts.push(
                    minutes +
                    'm'
                );
            }


            if (
                !days &&
                !hours
            ) {
                parts.push(
                    secs +
                    's'
                );
            }


            return parts.join(
                ' '
            );
        };


    window._lmEconomyEscape =
        function (
            value
        ) {
            return String(
                value == null
                    ? ''
                    : value
            )
                .replace(
                    /&/g,
                    '&amp;'
                )
                .replace(
                    /</g,
                    '&lt;'
                )
                .replace(
                    />/g,
                    '&gt;'
                )
                .replace(
                    /"/g,
                    '&quot;'
                )
                .replace(
                    /'/g,
                    '&#39;'
                );
        };


    window.renderAgarEconomyPanel =
        function (
            currentLevel
        ) {
            var profile =
                $('#profile');


            if (
                !profile.length
            ) {
                return false;
            }


            /*
             * Do not create a second catalogue system.
             *
             * If HUNK 1 has not received GameConfiguration yet,
             * simply wait for lm-agar-config-index-ready.
             */
            if (
                typeof window
                    .getAgarConfigIndex !==
                    'function' ||
                !window
                    .getAgarConfigIndex()
            ) {
                return false;
            }


            var level =
                Number(
                    currentLevel
                );


            if (
                !Number.isFinite(
                    level
                ) ||
                level < 1
            ) {
                level =
                    Number(
                        window.agarioLEVEL
                    );


                if (
                    !Number.isFinite(
                        level
                    ) ||
                    level < 1
                ) {
                    level =
                        Number(
                            window.application &&
                            window.application.user &&
                            window.application
                                .user.level
                        ) ||
                        1;
                }
            }


            level =
                Math.max(
                    1,
                    Math.floor(
                        level
                    )
                );


            var theme =
                getTheme();


            var panel =
                $('#lm-economy-status-panel');


            if (
                !panel.length
            ) {
                panel =
                    $(
                        '<div>',
                        {
                            id:
                                'lm-economy-status-panel'
                        }
                    );


                panel.css({
                    width:
                        '100%',

                    boxSizing:
                        'border-box',

                    clear:
                        'both',

                    margin:
                        '10px 0',

                    padding:
                        '10px',

                    borderRadius:
                        '7px',

                    border:
                        '1px solid rgba(255,255,255,0.12)'
                });


                /*
                 * Prefer placing it directly beneath the extended
                 * account/profile controls.
                 */
                var menuButtons =
                    $('#lm-extended-menu-btns');


                if (
                    menuButtons.length
                ) {
                    panel.insertAfter(
                        menuButtons
                    );
                } else {
                    var profilePanels =
                        profile
                            .find(
                                '.agario-profile-panel'
                            )
                            .not(
                                '#exp-bar'
                            );


                    if (
                        profilePanels.length
                    ) {
                        profilePanels
                            .first()
                            .append(
                                panel
                            );
                    } else {
                        profile.append(
                            panel
                        );
                    }
                }
            }


            panel.css({
                background:
                    theme.pc2,

                color:
                    theme.tc
            });


            /*
             * ─────────────────────────────────────────────────────────
             * NEXT LEVEL REWARD
             * ─────────────────────────────────────────────────────────
             */
            var xpEntry =
                typeof window
                    .getAgarXpEntry ===
                    'function'
                    ? window
                        .getAgarXpEntry(
                            level
                        )
                    : null;


            var levelRewardId =
                xpEntry &&
                xpEntry.levelUpBonusId
                    ? String(
                        xpEntry
                            .levelUpBonusId
                    )
                    : '';


            var levelRewardText =
                (
                    levelRewardId &&
                    typeof window
                        .formatAgarReward ===
                        'function'
                )
                    ? window
                        .formatAgarReward(
                            levelRewardId
                        )
                    : '';


            /*
             * ─────────────────────────────────────────────────────────
             * HOURLY BONUS
             * ─────────────────────────────────────────────────────────
             */
            var hourlySeconds =
                window
                    .getLiveTimedEventSecondsRemaining(
                        'hourlyBonus'
                    );


            var hourlyInfo =
                typeof window
                    .getAgarTimedEventInfo ===
                    'function'
                    ? window
                        .getAgarTimedEventInfo(
                            'hourlyBonus',
                            hourlySeconds ===
                                null
                                ? undefined
                                : hourlySeconds
                        )
                    : null;


            var hourlyRewardId =
                hourlyInfo &&
                hourlyInfo.bonusId
                    ? hourlyInfo
                        .bonusId
                    : '';


            var hourlyRewardText =
                (
                    hourlyRewardId &&
                    typeof window
                        .formatAgarReward ===
                        'function'
                )
                    ? window
                        .formatAgarReward(
                            hourlyRewardId
                        )
                    : '';


            var hourlyTimerText;


            if (
                hourlySeconds ===
                null
            ) {
                hourlyTimerText =
                    'Waiting for server';
            } else if (
                hourlySeconds <=
                0
            ) {
                hourlyTimerText =
                    'READY';
            } else {
                hourlyTimerText =
                    window
                        ._formatLmEconomySeconds(
                            hourlySeconds
                        );
            }


            /*
             * ─────────────────────────────────────────────────────────
             * DAILY QUEST / TIME-VARIABLE SKIP PRICE
             * ─────────────────────────────────────────────────────────
             */
            var dailySeconds =
                window
                    .getLiveTimedEventSecondsRemaining(
                        'dailyQuest'
                    );


            var dailyInfo =
                typeof window
                    .getAgarTimedEventInfo ===
                    'function'
                    ? window
                        .getAgarTimedEventInfo(
                            'dailyQuest',
                            dailySeconds ===
                                null
                                ? undefined
                                : dailySeconds
                        )
                    : null;


            var dailyTimerText;


            if (
                dailySeconds ===
                null
            ) {
                dailyTimerText =
                    'Waiting for server';
            } else if (
                dailySeconds <=
                0
            ) {
                dailyTimerText =
                    'READY';
            } else {
                dailyTimerText =
                    window
                        ._formatLmEconomySeconds(
                            dailySeconds
                        );
            }


            var dailyPriceText =
                '';


            if (
                dailyInfo &&
                dailyInfo.purchaseId &&
                dailyInfo.currentPrice !==
                    null &&
                dailyInfo.currentPrice !==
                    undefined
            ) {
                var dailyPrice =
                    Math.max(
                        0,
                        Number(
                            dailyInfo
                                .currentPrice
                        ) ||
                        0
                    );


                dailyPriceText =
                    typeof window
                        .formatAgarCurrency ===
                        'function'
                        ? window
                            .formatAgarCurrency(
                                dailyPrice,
                                dailyInfo
                                    .currency
                            )
                        : (
                            String(
                                dailyPrice
                            ) +
                            (
                                dailyInfo
                                    .currency
                                    ? (
                                        ' ' +
                                        dailyInfo
                                            .currency
                                    )
                                    : ''
                            )
                        );
            }


            /*
             * Small helper for a consistent row.
             */
            function buildRow(
                icon,
                label,
                mainText,
                rightHtml
            ) {
                return (
                    '<div style="' +
                        'display:flex;' +
                        'align-items:center;' +
                        'gap:8px;' +
                        'min-height:30px;' +
                        'padding:5px 2px;' +
                        'border-top:1px solid rgba(255,255,255,0.07);' +
                    '">' +

                        '<div style="' +
                            'width:22px;' +
                            'flex:0 0 22px;' +
                            'text-align:center;' +
                            'font-size:15px;' +
                        '">' +
                            window
                                ._lmEconomyEscape(
                                    icon
                                ) +
                        '</div>' +

                        '<div style="' +
                            'min-width:0;' +
                            'flex:1;' +
                        '">' +

                            '<div style="' +
                                'font-size:11px;' +
                                'font-weight:700;' +
                                'color:' +
                                window
                                    ._lmEconomyEscape(
                                        theme.tc
                                    ) +
                                ';' +
                            '">' +
                                window
                                    ._lmEconomyEscape(
                                        label
                                    ) +
                            '</div>' +

                            '<div style="' +
                                'font-size:10px;' +
                                'overflow:hidden;' +
                                'text-overflow:ellipsis;' +
                                'white-space:normal;' +
                                'color:' +
                                window
                                    ._lmEconomyEscape(
                                        theme.tc2
                                    ) +
                                ';' +
                            '">' +
                                window
                                    ._lmEconomyEscape(
                                        mainText
                                    ) +
                            '</div>' +

                        '</div>' +

                        (
                            rightHtml ||
                            ''
                        ) +

                    '</div>'
                );
            }


            var html =
                '<div style="' +
                    'display:flex;' +
                    'align-items:center;' +
                    'justify-content:space-between;' +
                    'padding:0 2px 7px 2px;' +
                '">' +

                    '<strong style="' +
                        'font-size:11px;' +
                        'letter-spacing:.5px;' +
                    '">' +
                        'ACCOUNT REWARDS &amp; TIMERS' +
                    '</strong>' +

                '</div>';


            html +=
                buildRow(
                    '\u2B50',
                    'Level ' +
                        level +
                        ' \u2192 ' +
                        (
                            level +
                            1
                        ),
                    levelRewardText ||
                        (
                            levelRewardId
                                ? levelRewardId
                                : 'No configured reward'
                        ),
                    ''
                );


            html +=
                buildRow(
                    '\uD83D\uDCB0',
                    'Hourly Bonus',
                    hourlyRewardText ||
                        'Configured timed reward',
                    '<div style="' +
                        'font-size:10px;' +
                        'font-weight:700;' +
                        'white-space:nowrap;' +
                        'color:' +
                        window
                            ._lmEconomyEscape(
                                theme.b2
                            ) +
                        ';' +
                    '">' +
                        window
                            ._lmEconomyEscape(
                                hourlyTimerText
                            ) +
                    '</div>'
                );


            var dailyButtonHtml =
                '';


            if (
                dailySeconds !==
                    null &&
                dailySeconds > 0 &&
                dailyInfo &&
                dailyInfo.purchaseId &&
                dailyPriceText
            ) {
                dailyButtonHtml =
                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-xs lm-timed-event-skip-buy" ' +
                        'data-event-id="dailyQuest" ' +
                        'data-purchase-id="' +
                            window
                                ._lmEconomyEscape(
                                    dailyInfo
                                        .purchaseId
                                ) +
                        '" ' +
                        'style="' +
                            'margin-left:6px;' +
                            'font-size:9px;' +
                            'padding:3px 6px;' +
                            'background:' +
                                window
                                    ._lmEconomyEscape(
                                        theme.b1
                                    ) +
                            ';' +
                            'color:' +
                                window
                                    ._lmEconomyEscape(
                                        theme.btc
                                    ) +
                            ';' +
                            'border:0;' +
                            'white-space:nowrap;' +
                        '"' +
                    '>' +
                        'New Quest \u2014 ' +
                        window
                            ._lmEconomyEscape(
                                dailyPriceText
                            ) +
                    '</button>';
            }


            html +=
                buildRow(
                    '\uD83C\uDFAF',
                    'Daily Quest',
                    dailyTimerText,
                    dailyButtonHtml
                );


/*
             * POTION SLOTS — Horizontal visual strip
             *
             * Reads live state from existing #potion1/2/3 DOM.
             * Renders 3 visual potion bottles side by side.
             */

            var potionStates =
                (window.LM && window.LM.user && window.LM.user.potionsStatus) || {};

            var _pvEmpty = '<svg viewBox="0 0 40 56" width="28" height="38">' +
                '<rect x="14" y="0" width="12" height="8" rx="2" fill="#667" opacity=".5"/>' +
                '<path d="M12 8 L10 20 Q8 28 8 34 L8 48 Q8 54 14 54 L26 54 Q32 54 32 48 L32 34 Q32 28 30 20 L28 8 Z" fill="none" stroke="#556" stroke-width="1.5" opacity=".35"/>' +
                '</svg>';

            var _pvBrew = '<svg viewBox="0 0 40 56" width="28" height="38">' +
                '<rect x="14" y="0" width="12" height="8" rx="2" fill="#a0522d"/>' +
                '<path d="M12 8 L10 20 Q8 28 8 34 L8 48 Q8 54 14 54 L26 54 Q32 54 32 48 L32 34 Q32 28 30 20 L28 8 Z" fill="#2e7d32" opacity=".85" stroke="#388e3c" stroke-width="1"/>' +
                '<ellipse cx="20" cy="14" rx="5" ry="2" fill="#4caf50" opacity=".6"/>' +
                '</svg>';

            var _pvBrewing = '<svg viewBox="0 0 40 56" width="28" height="38">' +
                '<rect x="14" y="0" width="12" height="8" rx="2" fill="#a0522d"/>' +
                '<path d="M12 8 L10 20 Q8 28 8 34 L8 48 Q8 54 14 54 L26 54 Q32 54 32 48 L32 34 Q32 28 30 20 L28 8 Z" fill="#e65100" opacity=".75" stroke="#ff6d00" stroke-width="1"/>' +
                '<circle cx="15" cy="38" r="2" fill="#ffab00" opacity=".7"><animate attributeName="cy" values="38;30;38" dur="1.8s" repeatCount="indefinite"/></circle>' +
                '<circle cx="22" cy="42" r="1.5" fill="#ffab00" opacity=".6"><animate attributeName="cy" values="42;32;42" dur="2.2s" repeatCount="indefinite"/></circle>' +
                '<circle cx="26" cy="40" r="1.8" fill="#ffab00" opacity=".5"><animate attributeName="cy" values="40;28;40" dur="2s" repeatCount="indefinite"/></circle>' +
                '</svg>';

            var _pvOpen = '<svg viewBox="0 0 40 56" width="28" height="38">' +
                '<rect x="14" y="0" width="12" height="8" rx="2" fill="#b8860b"/>' +
                '<path d="M12 8 L10 20 Q8 28 8 34 L8 48 Q8 54 14 54 L26 54 Q32 54 32 48 L32 34 Q32 28 30 20 L28 8 Z" fill="#7b1fa2" opacity=".85" stroke="#9c27b0" stroke-width="1"/>' +
                '<polygon points="20,6 22,2 24,6 22,4" fill="#ffeb3b" opacity=".9"><animate attributeName="opacity" values=".9;.4;.9" dur="1s" repeatCount="indefinite"/></polygon>' +
                '<polygon points="16,4 18,0 20,4 18,2" fill="#ffc107" opacity=".7"><animate attributeName="opacity" values=".7;.3;.7" dur="1.2s" repeatCount="indefinite"/></polygon>' +
                '<ellipse cx="20" cy="14" rx="5" ry="2" fill="#ce93d8" opacity=".5"/>' +
                '</svg>';

            var _rarityAccents = {
                common: '#78909c', exotic: '#26c6da', rare: '#42a5f5',
                superior: '#66bb6a', epic: '#ab47bc', legendary: '#ef5350',
                mythical: '#ffb300', mystical: '#7e57c2'
            };


            html +=
                '<div style="display:flex;gap:6px;padding:6px 4px;border-top:1px solid rgba(255,255,255,0.07);">';


            for (var slot = 1; slot <= 3; slot++) {
                var potionEl = document.getElementById('potion' + slot);
                var pState = 'empty';
                var pRarity = '';
                var pTimer = '';
                var pSkipHtml = '';
                var pSvg = _pvEmpty;
                var pGlow = 'none';
                var pBorder = 'rgba(255,255,255,0.08)';
                var pBg = 'rgba(255,255,255,0.02)';

                if (potionEl) {
                    var pImg = potionEl.querySelector('img');
                    var pSrc = pImg ? String(pImg.src || '') : '';
                    var pMatch = pSrc.match(/potion_([a-z]+)\./i);
                    if (pMatch && pMatch[1]) pRarity = pMatch[1].toLowerCase();

                    var pDiv = potionEl.querySelector('div');
                    var pText = pDiv ? String(pDiv.textContent || '').trim().toLowerCase() : '';

                    if (pText === 'brew' || pText === 'ready') {
                        pState = 'brew';
                        pSvg = _pvBrew;
                        pGlow = '0 0 8px rgba(76,175,80,0.5)';
                        pBorder = '#4caf50';
                        pBg = 'rgba(76,175,80,0.08)';
                    } else if (pText === 'open') {
                        pState = 'open';
                        pSvg = _pvOpen;
                        pGlow = '0 0 12px rgba(156,39,176,0.6), 0 0 4px rgba(255,235,59,0.4)';
                        pBorder = '#9c27b0';
                        pBg = 'rgba(156,39,176,0.1)';
                    } else if (/\d/.test(pText)) {
                        pState = 'brewing';
                        pTimer = pText;
                        pSvg = _pvBrewing;
                        pGlow = '0 0 8px rgba(255,152,0,0.5)';
                        pBorder = '#ff9800';
                        pBg = 'rgba(255,152,0,0.08)';
                    } else if (pText) {
                        pState = 'brew';
                        pSvg = _pvBrew;
                        pBorder = '#4caf50';
                        pBg = 'rgba(76,175,80,0.06)';
                    }
                }

                var pAccent = (pRarity && _rarityAccents[pRarity]) ? _rarityAccents[pRarity] : '';
                if (pAccent) pBorder = pAccent;

                var pRarityLabel = pRarity
                    ? (pRarity.charAt(0).toUpperCase() + pRarity.slice(1))
                    : '';


                /* Skip button for brewing potions */
                if (pState === 'brewing') {
                    var pk = 'potion' + slot;
                    var pp = potionStates[pk] || null;

                    if (pp && Number(pp.status) === 2) {
                        var ppId = pp.productId || pp.type || '';
                        var ppSec = window.getLivePotionSecondsRemaining(pp);
                        var ppInfo = typeof window.getAgarPotionInfo === 'function'
                            ? window.getAgarPotionInfo(ppId, slot, ppSec === null ? undefined : ppSec)
                            : null;

                        if (ppInfo && ppInfo.purchaseId &&
                            ppInfo.currentPrice !== null && ppInfo.currentPrice !== undefined) {
                            var ppPrice = Math.max(0, Number(ppInfo.currentPrice) || 0);
                            var ppPriceText = typeof window.formatAgarCurrency === 'function'
                                ? window.formatAgarCurrency(ppPrice, ppInfo.currency)
                                : (String(ppPrice) + (ppInfo.currency ? (' ' + ppInfo.currency) : ''));

                            pSkipHtml =
                                '<button type="button" class="btn btn-xs lm-potion-skip-buy" ' +
                                    'data-potion-id="' + window._lmEconomyEscape(ppId) + '" ' +
                                    'data-slot="' + slot + '" ' +
                                    'data-purchase-id="' + window._lmEconomyEscape(ppInfo.purchaseId) + '" ' +
                                    'style="font-size:8px;padding:2px 5px;background:' +
                                        window._lmEconomyEscape(theme.b3) + ';color:' +
                                        window._lmEconomyEscape(theme.btc) +
                                        ';border:0;border-radius:4px;white-space:nowrap;margin-top:2px;cursor:pointer;"' +
                                '>Skip ' + window._lmEconomyEscape(ppPriceText) + '</button>';
                        }
                    }
                }


                /* Status line */
                var pStatus = '';
                if (pState === 'empty') {
                    pStatus = '<div style="font-size:9px;color:#667;font-weight:600;">Empty</div>';
                } else if (pState === 'brew') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:8px;color:#8bc34a;font-weight:700;">\u25B6 BREW</div>';
                } else if (pState === 'brewing') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:10px;color:#ff9800;font-weight:900;font-variant-numeric:tabular-nums;">' + pTimer + '</div>' +
                        pSkipHtml;
                } else if (pState === 'open') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:8px;color:#ce93d8;font-weight:800;">\u2728 OPEN</div>';
                }


                html +=
                    '<div style="' +
                        'flex:1;display:flex;flex-direction:column;align-items:center;' +
                        'padding:5px 2px 4px;border-radius:8px;' +
                        'border:1px solid ' + pBorder + ';' +
                        'background:' + pBg + ';' +
                        'box-shadow:' + pGlow + ';' +
                        'transition:box-shadow .3s;min-width:0;' +
                    '">' +
                        '<div style="margin-bottom:2px;line-height:0;">' + pSvg + '</div>' +
                        pStatus +
                    '</div>';
            }

            html += '</div>';




            panel.html(
                html
            );


            return true;
        };


    /*
     * ─────────────────────────────────────────────────────────────────
     * PURCHASE BUTTONS
     * ─────────────────────────────────────────────────────────────────
     *
     * IMPORTANT:
     *
     * These DO NOT implement a new shop transport.
     *
     * purchaseId came from GameConfiguration.
     * window.softPurchase() is the existing transport.
     */


    $(document)
        .off(
            'click.lmPotionSkipBuy',
            '.lm-potion-skip-buy'
        )
        .on(
            'click.lmPotionSkipBuy',
            '.lm-potion-skip-buy',
            function (
                event
            ) {
                event.preventDefault();
                event.stopPropagation();


                var button =
                    $(this);


                var purchaseId =
                    String(
                        button.attr(
                            'data-purchase-id'
                        ) ||
                        ''
                    );


                var potionId =
                    String(
                        button.attr(
                            'data-potion-id'
                        ) ||
                        ''
                    );


                var slot =
                    parseInt(
                        button.attr(
                            'data-slot'
                        ),
                        10
                    ) ||
                    0;


                if (
                    !purchaseId
                ) {
                    return false;
                }


                if (
                    typeof window
                        .validateShopIntegrity ===
                        'function' &&
                    !window
                        .validateShopIntegrity(
                            'skip potion brew'
                        )
                ) {
                    return false;
                }


                if (
                    typeof window
                        .softPurchase !==
                        'function'
                ) {
                    if (
                        window.toastr
                    ) {
                        toastr.error(
                            '<b>[POTION]:</b> Soft-purchase transport is unavailable.'
                        );
                    }


                    return false;
                }


                button.prop(
                    'disabled',
                    true
                );


                window
                    .softPurchase(
                        purchaseId,
                        {
                            kind:
                                'potion-skip',

                            potionId:
                                potionId,

                            slot:
                                slot,

                            purchaseId:
                                purchaseId,

                            onSuccess:
                                function () {
                                    button.prop(
                                        'disabled',
                                        false
                                    );


                                    if (
                                        typeof window
                                            .renderAgarEconomyPanel ===
                                            'function'
                                    ) {
                                        window
                                            .renderAgarEconomyPanel();
                                    }
                                },

                            onFailure:
                                function (
                                    reason
                                ) {
                                    button.prop(
                                        'disabled',
                                        false
                                    );


                                    console.warn(
                                        '[LM POTION] Skip purchase failed:',
                                        purchaseId,
                                        reason
                                    );
                                }
                        }
                    );


                return false;
            }
        );


    $(document)
        .off(
            'click.lmTimedEventSkipBuy',
            '.lm-timed-event-skip-buy'
        )
        .on(
            'click.lmTimedEventSkipBuy',
            '.lm-timed-event-skip-buy',
            function (
                event
            ) {
                event.preventDefault();
                event.stopPropagation();


                var button =
                    $(this);


                var eventId =
                    String(
                        button.attr(
                            'data-event-id'
                        ) ||
                        ''
                    );


                var purchaseId =
                    String(
                        button.attr(
                            'data-purchase-id'
                        ) ||
                        ''
                    );


                if (
                    !eventId ||
                    !purchaseId
                ) {
                    return false;
                }


                if (
                    typeof window
                        .validateShopIntegrity ===
                        'function' &&
                    !window
                        .validateShopIntegrity(
                            'skip timed event'
                        )
                ) {
                    return false;
                }


                if (
                    typeof window
                        .softPurchase !==
                        'function'
                ) {
                    if (
                        window.toastr
                    ) {
                        toastr.error(
                            '<b>[EVENT]:</b> Soft-purchase transport is unavailable.'
                        );
                    }


                    return false;
                }


                /*
                 * Disable immediately + visual feedback.
                 *
                 * Do NOT re-enable on success:
                 * the panel re-render will replace the entire DOM,
                 * and the new quest state won't have a skip button.
                 *
                 * Only re-enable on failure so the user can retry.
                 */
                var originalText =
                    button.text();

                button.prop(
                    'disabled',
                    true
                );

                button.css({
                    opacity: '.55',
                    cursor: 'not-allowed'
                });

                button.text(
                    'Working\u2026'
                );


                window
                    .softPurchase(
                        purchaseId,
                        {
                            kind:
                                'timed-event-skip',

                            eventId:
                                eventId,

                            purchaseId:
                                purchaseId,

                            onSuccess:
                                function () {
                                    /*
                                     * Button stays disabled.
                                     *
                                     * The re-render below rebuilds
                                     * the entire panel from live state.
                                     */
                                    if (
                                        typeof window
                                            .renderAgarEconomyPanel ===
                                            'function'
                                    ) {
                                        window
                                            .renderAgarEconomyPanel();
                                    }
                                },

                            onFailure:
                                function (
                                    reason
                                ) {
                                    button.prop(
                                        'disabled',
                                        false
                                    );

                                    button.css({
                                        opacity: '1',
                                        cursor: 'pointer'
                                    });

                                    button.text(
                                        originalText
                                    );


                                    console.warn(
                                        '[LM EVENT] Timed-event purchase failed:',
                                        eventId,
                                        purchaseId,
                                        reason
                                    );
                                }
                        }
                    );


                return false;
            }
        );


    /*
     * Server/config changes trigger immediate repaints.
     */
    document.addEventListener(
        'lm-potions-updated',
        function () {
            if (
                typeof window
                    .renderAgarEconomyPanel ===
                    'function'
            ) {
                window
                    .renderAgarEconomyPanel();
            }
        }
    );


    document.addEventListener(
        'lm-timed-events-updated',
        function () {
            if (
                typeof window
                    .renderAgarEconomyPanel ===
                    'function'
            ) {
                window
                    .renderAgarEconomyPanel();
            }
        }
    );


    document.addEventListener(
        'lm-agar-config-index-ready',
        function () {
            if (
                typeof window
                    .renderAgarEconomyPanel ===
                    'function'
            ) {
                window
                    .renderAgarEconomyPanel();
            }
        }
    );


    /*
     * One lightweight UI countdown tick.
     *
     * It does NOT:
     *
     *      - make network requests
     *      - recalculate account state
     *      - activate rewards
     *
     * It only derives remaining seconds from readyAt.
     */
    if (
        !window
            ._lmEconomyPanelRefreshTimer
    ) {
        window
            ._lmEconomyPanelRefreshTimer =
            window.setInterval(
                function () {
                    if (
                        document.hidden
                    ) {
                        return;
                    }


                    if (
                        typeof window
                            .renderAgarEconomyPanel ===
                            'function'
                    ) {
                        window
                            .renderAgarEconomyPanel();
                    }
                },
                5000
            );
    }





    /*
     * ═══════════════════════════════════════════════════════════════════════
     * CHALLENGES / ACHIEVEMENTS
     * ═══════════════════════════════════════════════════════════════════════
     *
     * Definitions:  GameConfiguration -> Achievements
     * Last-game:    server gameOverField.gameSessionStats
     *
     * Says "met this game" — not "permanently unlocked" — because persistent
     * Play Games achievement state is not exposed by the current sources.
     */

    window._lmChallengePresentation = {
        normal_cells_eaten: { icon: '\uD83D\uDFE2', title: 'Cells Eaten', subtitle: 'Eat normal player cells in one game.' },
        time_total:         { icon: '\u23F1\uFE0F',  title: 'Survival Time', subtitle: 'Stay alive for the configured time.' },
        final_level:        { icon: '\u2B50',         title: 'Final Level', subtitle: 'Finish the game at or above the configured level.' },
        top_position:       { icon: '\uD83D\uDC51', title: 'Best Position', subtitle: 'Reach the configured leaderboard position or better.' },
        game_ended:         { icon: '\uD83C\uDFC1', title: 'Finish a Game', subtitle: 'Complete a game session.' },
        final_position:     { icon: '\uD83C\uDFC6', title: 'Final Position', subtitle: 'Finish at the configured position or better.' }
    };

    window._lmGetChallengePresentation = function (type) {
        type = String(type || '').trim();
        var configured = window._lmChallengePresentation[type];
        if (configured) return configured;
        var readable = type.replace(/_/g, ' ').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        return { icon: '\uD83C\uDFAF', title: readable || 'Challenge', subtitle: 'Configured Agar.io Challenge.' };
    };

    window._lmFormatChallengeValue = function (type, value) {
        if (value === undefined || value === null || !Number.isFinite(Number(value))) return '\u2014';
        value = Number(value);
        switch (type) {
            case 'time_total':      return value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' min';
            case 'final_level':     return 'Lv ' + Math.floor(value);
            case 'top_position':
            case 'final_position':  return '#' + Math.floor(value);
            case 'game_ended':      return value >= 1 ? 'Finished' : 'Not finished';
            default:                return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
    };

    window._lmFormatChallengeGoal = function (type, goal) {
        goal = Number(goal);
        if (!Number.isFinite(goal)) return '\u2014';
        switch (type) {
            case 'normal_cells_eaten': return goal + (goal === 1 ? ' cell' : ' cells');
            case 'time_total':         return goal + (goal === 1 ? ' minute' : ' minutes');
            case 'final_level':        return 'Level ' + goal;
            case 'top_position':
            case 'final_position':     return '#' + goal;
            case 'game_ended':         return 'Finish game';
            default:                   return String(goal);
        }
    };


    window.showChallengesModal = function () {
        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-challenges-modal');
        if (old) old.remove();

        var challengeTypes = typeof window.getAgarAchievementTypes === 'function'
            ? window.getAgarAchievementTypes() : [];

        var evaluation = typeof window.getAgarLastChallengeEvaluation === 'function'
            ? window.getAgarLastChallengeEvaluation() : null;

        var modal = document.createElement('div');
        modal.id = 'lm-challenges-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function (event) {
            if (event.target === modal) modal.remove();
        });

        var shell = document.createElement('div');
        shell.className = 'lm-modal-container';
        shell.style.cssText = 'background:' + t.pc + ';border-color:' + t.mc + ';width:680px;max-width:94vw;';

        /* ─── HEADER ─── */
        var header = document.createElement('div');
        header.className = 'lm-modal-header';
        header.style.cssText = 'background:' + t.pc2 + ';padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;';

        var headerLeft = document.createElement('div');
        headerLeft.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:18px;font-weight:900;color:' + t.tc + ';';
        headerLeft.innerHTML = '\uD83C\uDFC5 Challenges';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'btn';
        closeBtn.style.cssText = 'background:transparent;border:none;color:' + t.tc2 + ';font-size:22px;cursor:pointer;padding:0 4px;';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () { modal.remove(); };

        header.appendChild(headerLeft);
        header.appendChild(closeBtn);
        shell.appendChild(header);

        /* ─── SUMMARY BAR ─── */
        if (evaluation) {
            var summaryBar = document.createElement('div');
            summaryBar.style.cssText = 'padding:10px 20px;background:rgba(255,215,0,.08);border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:' + t.tc2 + ';';

            var summaryLeft = document.createElement('span');
            summaryLeft.innerHTML = 'Last game: <b style="color:' + t.b2 + ';">' + evaluation.metThresholdCount + '</b> / ' + evaluation.knownThresholdCount + ' thresholds met';

            var summaryRight = document.createElement('span');
            summaryRight.style.cssText = 'font-size:10px;opacity:.6;';
            var evalDate = new Date(evaluation.evaluatedAt);
            summaryRight.textContent = evalDate.toLocaleTimeString();

            summaryBar.appendChild(summaryLeft);
            summaryBar.appendChild(summaryRight);
            shell.appendChild(summaryBar);
        }

        /* ─── BODY ─── */
        var body = document.createElement('div');
        body.style.cssText = 'padding:16px 20px;max-height:60vh;overflow-y:auto;';

        if (challengeTypes.length === 0) {
            body.innerHTML = '<div style="text-align:center;padding:30px 0;color:' + t.tc2 + ';font-size:14px;">No Challenges configured.<br><span style="font-size:11px;opacity:.6;">Waiting for GameConfiguration\u2026</span></div>';
        } else {
            for (var ti = 0; ti < challengeTypes.length; ti++) {
                var type = challengeTypes[ti];
                var pres = window._lmGetChallengePresentation(type);
                var group = evaluation && evaluation.byType ? evaluation.byType[type] : null;
                var definitions = typeof window.getAgarAchievements === 'function'
                    ? window.getAgarAchievements(type) : [];

                /* Type section */
                var section = document.createElement('div');
                section.style.cssText = 'margin-bottom:18px;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;';

                /* Type header */
                var typeHeader = document.createElement('div');
                typeHeader.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06);';

                var typeIcon = document.createElement('span');
                typeIcon.style.fontSize = '22px';
                typeIcon.textContent = pres.icon;

                var typeInfo = document.createElement('div');
                typeInfo.style.flex = '1';
                typeInfo.innerHTML = '<div style="font-weight:800;font-size:14px;color:' + t.tc + ';">' + pres.title + '</div>' +
                    '<div style="font-size:11px;color:' + t.tc2 + ';margin-top:1px;">' + pres.subtitle + '</div>';

                /* Current value badge */
                var valueBadge = document.createElement('div');
                valueBadge.style.cssText = 'text-align:right;font-size:12px;font-weight:700;color:' + t.b2 + ';';
                if (group && group.known) {
                    valueBadge.textContent = window._lmFormatChallengeValue(type, group.displayValue);
                } else {
                    valueBadge.innerHTML = '<span style="opacity:.4;">No data</span>';
                }

                typeHeader.appendChild(typeIcon);
                typeHeader.appendChild(typeInfo);
                typeHeader.appendChild(valueBadge);
                section.appendChild(typeHeader);

                /* Thresholds */
                for (var di = 0; di < definitions.length; di++) {
                    var def = definitions[di];
                    var goal = Number(def.goal);

                    var threshold = null;
                    if (group && group.thresholds) {
                        for (var si = 0; si < group.thresholds.length; si++) {
                            if (Number(group.thresholds[si].goal) === goal) {
                                threshold = group.thresholds[si];
                                break;
                            }
                        }
                    }

                    var met = threshold ? threshold.metThisGame : false;
                    var progress = threshold ? threshold.progressRatio : 0;

                    var row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.03);' +
                        (met ? 'background:rgba(76,175,80,.08);' : '');

                    /* Status icon */
                    var statusIcon = document.createElement('div');
                    statusIcon.style.cssText = 'width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;';
                    if (met) {
                        statusIcon.style.background = 'linear-gradient(135deg,#4caf50,#66bb6a)';
                        statusIcon.textContent = '\u2713';
                        statusIcon.style.color = '#fff';
                        statusIcon.style.fontWeight = '900';
                    } else if (threshold && threshold.known) {
                        statusIcon.style.background = 'rgba(255,255,255,.08)';
                        statusIcon.style.border = '2px solid rgba(255,255,255,.15)';
                    } else {
                        statusIcon.style.background = 'rgba(255,255,255,.04)';
                        statusIcon.style.border = '2px dashed rgba(255,255,255,.1)';
                    }

                    /* Goal text */
                    var goalLabel = document.createElement('div');
                    goalLabel.style.cssText = 'flex:1;font-size:13px;color:' + (met ? '#4caf50' : t.tc) + ';font-weight:' + (met ? '700' : '500') + ';';
                    goalLabel.textContent = window._lmFormatChallengeGoal(type, goal);

                    /* Progress bar */
                    var progressWrap = document.createElement('div');
                    progressWrap.style.cssText = 'width:100px;height:6px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden;flex-shrink:0;';
                    var progressFill = document.createElement('div');
                    var pct = Math.round(progress * 100);
                    progressFill.style.cssText = 'height:100%;border-radius:3px;transition:width .3s;width:' + pct + '%;background:' +
                        (met ? 'linear-gradient(90deg,#4caf50,#66bb6a)' : 'linear-gradient(90deg,' + t.b1 + ',' + t.b2 + ')') + ';';
                    progressWrap.appendChild(progressFill);

                    /* Percentage */
                    var pctLabel = document.createElement('div');
                    pctLabel.style.cssText = 'width:36px;text-align:right;font-size:11px;font-weight:700;color:' + (met ? '#4caf50' : t.tc2) + ';flex-shrink:0;';
                    pctLabel.textContent = threshold && threshold.known ? pct + '%' : '\u2014';

                    row.appendChild(statusIcon);
                    row.appendChild(goalLabel);
                    row.appendChild(progressWrap);
                    row.appendChild(pctLabel);
                    section.appendChild(row);
                }

                body.appendChild(section);
            }
        }

        shell.appendChild(body);

        /* ─── FOOTER ─── */
        var footer = document.createElement('div');
        footer.style.cssText = 'padding:10px 20px;border-top:1px solid rgba(255,255,255,.08);text-align:center;';
        footer.innerHTML = '<span style="font-size:10px;color:' + t.tc2 + ';opacity:.5;">Progress shown is from your last completed game. Thresholds from GameConfiguration.</span>';
        shell.appendChild(footer);

        modal.appendChild(shell);
        document.body.appendChild(modal);
    };


    /* Listen for challenge evaluation and optionally auto-show toast */
    document.addEventListener('lm-challenges-evaluated', function (e) {
        var ev = e && e.detail;
        if (!ev || ev.metThresholdCount <= 0) return;

        if (window.toastr) {
            var msg = '<b>\uD83C\uDFC5 Challenges:</b> ' + ev.metThresholdCount + ' threshold' + (ev.metThresholdCount > 1 ? 's' : '') + ' met!';
            toastr.success(msg, '', { onclick: function () { if (typeof window.showChallengesModal === 'function') window.showChallengesModal(); } });
        }
    });


    // Inject "Official Offer", "Leagues", and "Friends" buttons into Profile Tab (#profile) panel
    function initMenuButtons() {
        var profileTab = $('#profile');
        if (!profileTab.length) return;

        var profilePanels = profileTab.find('.agario-profile-panel').not('#exp-bar');
        var targetContainer = profilePanels.length ? profilePanels.first() : profileTab;

        if (document.getElementById('lm-daily-deal-btn')) {
            // Ensure button group is inside #profile / targetContainer.
            if (!$.contains(profileTab[0], document.getElementById('lm-daily-deal-btn')) || $('#lm-extended-menu-btns').closest('#exp-bar').length) {
                $('#lm-extended-menu-btns').appendTo(targetContainer);
            }

            return;
        }

        var btnGroup = document.createElement('div');
        btnGroup.id = 'lm-extended-menu-btns';
        btnGroup.style.cssText = 'display: flex; gap: 6px; margin: 10px 0; justify-content: space-between; width: 100%; box-sizing: border-box; clear: both;';
        btnGroup.innerHTML = `
            <button id="lm-daily-deal-btn" class="btn btn-danger btn-shop" disabled="disabled" style="display: none; flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="Log in with Google/Facebook and play a game session first">
                🔥 Official Offer
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;">LOGIN & PLAY NEEDED</div>
            </button>
            <button id="lm-leagues-btn" class="btn btn-warning btn-shop" disabled="disabled" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="Log in with Google/Facebook and play a game session first">
                <i class="fa fa-trophy"></i> Leagues
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;">LOGIN & PLAY NEEDED</div>
            </button>
            <button id="lm-friends-btn" class="btn btn-info btn-shop" disabled="disabled" style="display: none; flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="Log in with Facebook and play a game session first">
                <i class="fa fa-users"></i> Friends
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;">LOGIN & PLAY NEEDED</div>
            </button>
            <button id="lm-challenges-btn" class="btn btn-success btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; cursor: pointer;" title="View Challenges / Achievements">
                \uD83C\uDFC5 Challenges
            </button>
        `;

        if (targetContainer.find('#potions, .potions-container').length) {
            targetContainer.find('#potions, .potions-container').first().before(btnGroup);
        } else {
            targetContainer.prepend(btnGroup);
        }



        if (typeof window.syncProfileTabUI === 'function') {
            window.syncProfileTabUI();
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

    /**
     * Shared runtime guard for all lm-extended-menu-btns click handlers.
     * Returns true when the user is logged in AND has a valid Agar.io UID.
     * Shows a toastr warning when access is blocked.
     */
    window._lmExtendedMenuEnabled = function() {
        var appUser =
            (
                window.application &&
                window.application.user
            ) ||
            (
                window.legendmod &&
                window.legendmod.user
            ) ||
            {};

        var isLoggedIn;

        if (
            typeof window.checkUserLoggedIn ===
            'function'
        ) {
            isLoggedIn =
                window.checkUserLoggedIn();
        } else {
            var fallbackUserId =
                appUser.userId !== undefined &&
                appUser.userId !== null
                    ? String(
                        appUser.userId
                    ).trim()
                    : '';

            var normalizedFallbackUserId =
                fallbackUserId.toLowerCase();

            isLoggedIn =
                !!(
                    window.loggedIn === true ||
                    appUser.authenticated ===
                        true ||
                    (
                        fallbackUserId &&
                        fallbackUserId !== '0' &&
                        normalizedFallbackUserId !==
                            'null' &&
                        normalizedFallbackUserId !==
                            'undefined'
                    )
                );
        }

        var hasUID;

        if (
            typeof window.checkUserUID ===
            'function'
        ) {
            hasUID =
                window.checkUserUID();
        } else {
            var fallbackUID =
                typeof window.agarioUID ===
                'string'
                    ? window.agarioUID.trim()
                    : '';

            var normalizedFallbackUID =
                fallbackUID.toLowerCase();

            hasUID =
                !!(
                    isLoggedIn &&
                    fallbackUID &&
                    fallbackUID.length >= 8 &&
                    fallbackUID.indexOf('$') ===
                        -1 &&
                    fallbackUID !== '0' &&
                    normalizedFallbackUID !==
                        'null' &&
                    normalizedFallbackUID !==
                        'undefined'
                );
        }

        if (!isLoggedIn || !hasUID) {
            if (window.toastr) {
                toastr.error(
                    '<b>[LOGIN REQUIRED]:</b> Log in with Google/Facebook and play a game session first.'
                );
            }

            return false;
        }

        return true;
    };

    window.syncProfileTabUI = function() {
        var appUser =
            (
                window.application &&
                window.application.user
            ) ||
            (
                window.legendmod &&
                window.legendmod.user
            ) ||
            {};

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

        var uid =
            typeof window.agarioUID ===
            'string'
                ? window.agarioUID.trim()
                : '';

        var normalizedUID =
            uid.toLowerCase();

        var hasDisplayUID =
            !!(
                uid &&
                uid.length >= 8 &&
                uid.indexOf('$') === -1 &&
                uid !== '0' &&
                normalizedUID !== 'null' &&
                normalizedUID !==
                    'undefined'
            );

        if (hasDisplayUID) {
            $('#UserProfileUID1')
                .val(uid)
                .text(uid);

            $('#UserProfileUUID1')
                .val(uid);
        } else {
            $('#UserProfileUID1')
                .val('')
                .text('');

            $('#UserProfileUUID1')
                .val('');
        }

        /*
         * Enable Agar.io shop/profile buttons only when:
         * 1. the account is logged in; and
         * 2. Agar.io has supplied a valid UID.
         */
        var uid =
            typeof window.agarioUID === 'string'
                ? window.agarioUID.trim()
                : '';

        var normalizedUID =
            uid.toLowerCase();

        var buttonsEnabled =
            window.loggedIn === true &&
            uid.length >= 8 &&
            uid !== '0' &&
            uid.indexOf('$') === -1 &&
            normalizedUID !== 'null' &&
            normalizedUID !== 'undefined';

        var menuBtns = $(
            '#SpecialDealsBtn, ' +
            '#SpecialDealsQuickBtn, ' +
            '.lm-skins-btn, ' +
            '#lm-extended-menu-btns button'
        );

        menuBtns
            .prop('disabled', !buttonsEnabled)
            .attr(
                'aria-disabled',
                buttonsEnabled ? 'false' : 'true'
            );

        var ribbonBadgeHtml = '<div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;">LOGIN & PLAY NEEDED</div>';

        if (buttonsEnabled) {
            menuBtns.css({
                opacity: 1,
                filter: 'none',
                cursor: 'pointer',
                pointerEvents: 'auto'
            }).removeAttr('title');
            menuBtns.find('.lm-ribbon-badge').remove();
        } else {
            menuBtns.css({
                opacity: 0.5,
                filter: 'grayscale(35%)',
                cursor: 'not-allowed',
                pointerEvents: 'none',
                position: 'relative',
                overflow: 'hidden'
            }).attr(
                'title',
                'Log in and play once to receive your Agar.io UID'
            );

            menuBtns.each(function() {
                var $btn = $(this);
                if (!$btn.find('.lm-ribbon-badge').length) {
                    $btn.append(ribbonBadgeHtml);
                }
            });
        }

        // Friends requires an authenticated Facebook Agar.io account.
        var isFacebook =
            buttonsEnabled &&
            typeof window.isFacebookAgarAccount ===
                'function' &&
            window.isFacebookAgarAccount();

        var friendsBtnEnabled =
            buttonsEnabled &&
            isFacebook;
        var friendsBtn = $('#lm-friends-btn');
        friendsBtn.prop('disabled', !friendsBtnEnabled);
        if (!friendsBtnEnabled) {
            friendsBtn.css({ opacity: 0.5, filter: 'grayscale(35%)', cursor: 'not-allowed', pointerEvents: 'none' }).attr('title', 'Log in with Facebook and play a game session first to access Friends');
        } else {
            friendsBtn.css({ opacity: 1, filter: 'none', cursor: 'pointer', pointerEvents: 'auto' }).removeAttr('title');
            friendsBtn.find('.lm-ribbon-badge').remove();
        }

        // 3. Official Agar.io XP Progress Bar & Level
        var xpState =
            window.getOfficialAgarXpState(
                appUser.level,
                appUser.xp,
                appUser.nextLevelXp ||
                    appUser.nextXp
            );

        var xp =
            Math.floor(
                xpState.currentXp
            );

        var nextXp =
            Math.floor(
                xpState.totalXp
            );

        var level =
            xpState.level;

        var percent =
            xpState.percent;

        /*
         * Keep LM's account model synchronized with the authoritative
         * Agar.io XP values.
         */
        appUser.level =
            level;

        appUser.xp =
            xp;

        appUser.nextLevelXp =
            nextXp;

        window.agarioLEVEL =
            level;

        window.agarioXP =
            xp;

        window.agarioNextXP =
            nextXp;

        if (
            typeof window
                .updateOfficialXpPanel ===
                'function'
        ) {
            window.updateOfficialXpPanel(
                level,
                percent
            );
        } else {
            var profileExpBars =
                $('#profile .agario-profile-panel')
                    .not('#exp-bar');

            profileExpBars
                .find(
                    '.progress-bar-text'
                )
                .text(
                    xp +
                    '/' +
                    nextXp +
                    ' XP'
                );

            profileExpBars
                .find(
                    '.progress-bar-star'
                )
                .text(level);

            profileExpBars
                .find(
                    '.progress-bar-active, .progress-bar, .progress-bar-striped'
                )
                .not(
                    '.progress-bar-striped2'
                )
                .css(
                    'width',
                    percent +
                    '%'
                );
        }

        if (typeof window.updateLegendXpPanel === 'function') {
            window.updateLegendXpPanel();
        } else {
            var lmScoreVal = window.LMscore || 0;
            var legendXpPanel = $('#exp-bar').eq(1);
            legendXpPanel.find('.progress-bar-striped2').css({
                "transition": "5s",
                "width": Math.max(0, Math.min(100, lmScoreVal)) + "%"
            });
            legendXpPanel.find('.progress-bar-star2').text(lmScoreVal);
        }



        // 4. Potions Status Tracking (Opcodes 120, 122, 124)
        // The Vue potion components (.potion-slot-button) handle their own
        // click events via agarApp.API.openPotion/startPotion/skipPotion.
        // LM only tracks status in window.LM.user.potionsStatus for
        // autobrewing and the potions help button — never overwrite Vue DOM.
        var potions = appUser.potions || window.lastPotionsData || [];
        if (!window.LM) window.LM = {};
        if (!window.LM.user) window.LM.user = {};
        if (!window.LM.user.potionsStatus) window.LM.user.potionsStatus = {};

        var potionsContainer = $('.potions-container');
        if (potionsContainer.length) {
            potionsContainer.css({ position: 'relative', overflow: 'visible' });
            if (!document.getElementById('lm-potions-help-btn')) {
                var helpBtn = $('<button id="lm-potions-help-btn" style="position: absolute; right: -28px; top: 4px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: 2px solid #fff; font-weight: 900; font-size: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.4); z-index: 5; line-height: 1; text-align: center; padding: 0; pointer-events: auto;" title="Potions Help">?</button>');
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

        /*
         * ═══════════════════════════════════════════════════════════════
         * POTION STATE MERGE
         * ═══════════════════════════════════════════════════════════════
         *
         * application.updatePotions()/newPotion() own the authoritative
         * rich potion state.
         *
         * syncProfileTabUI() is allowed to MERGE newer information from
         * the Vue/application user model, but must never collapse:
         *
         *     readyAt
         *     secondsRemaining
         *     receivedAt
         *     productId
         *     raw
         *
         * back into the old minimal object.
         *
         * IMPORTANT:
         *
         * If pData carries a fresh secondsRemaining/expiresInSeconds,
         * that snapshot wins over an older readyAt.
         */

        for (
            var s = 1;
            s <= 3;
            s++
        ) {
            var pData =
                potions[
                    s - 1
                ] ||
                null;


            if (!pData) {
                /*
                 * Do not delete here.
                 *
                 * updatePotions() owns deletion because it receives the
                 * authoritative server slot list.
                 */
                continue;
            }


            var potionKey =
                'potion' +
                s;


            var previous =
                window.LM
                    .user
                    .potionsStatus[
                        potionKey
                    ] ||
                {};


            var now =
                Date.now();


            /*
             * STATUS
             */
            var status =
                Number(
                    pData.status
                );


            if (
                !Number.isFinite(
                    status
                ) ||
                status <= 0
            ) {
                status =
                    Number(
                        previous.status
                    ) ||
                    1;
            }


            /*
             * PRODUCT
             */
            var productId =
                pData.productId ||
                pData.type ||
                previous.productId ||
                previous.type ||
                '';


            /*
             * Detect a fresh timer snapshot.
             */
            var freshSeconds =
                null;


            if (
                pData.secondsRemaining !==
                    undefined &&
                pData.secondsRemaining !==
                    null
            ) {
                freshSeconds =
                    Math.max(
                        0,
                        Number(
                            pData
                                .secondsRemaining
                        ) ||
                        0
                    );

            } else if (
                pData.expiresInSeconds !==
                    undefined &&
                pData.expiresInSeconds !==
                    null
            ) {
                freshSeconds =
                    Math.max(
                        0,
                        Number(
                            pData
                                .expiresInSeconds
                        ) ||
                        0
                    );
            }


            var readyAt =
                Number(
                    previous.readyAt
                ) ||
                0;


            var secondsRemaining =
                0;


            var receivedAt =
                Number(
                    previous.receivedAt
                ) ||
                now;


            /*
             * Only BREWING potions should carry a running deadline.
             */
            if (
                status === 2
            ) {
                if (
                    freshSeconds !==
                    null
                ) {
                    /*
                     * Fresh server/application snapshot wins.
                     */
                    secondsRemaining =
                        freshSeconds;


                    receivedAt =
                        now;


                    readyAt =
                        now +
                        secondsRemaining *
                        1000;

                } else if (
                    readyAt > 0
                ) {
                    /*
                     * No new snapshot.
                     *
                     * Preserve the existing absolute deadline and derive
                     * the current remaining time.
                     */
                    secondsRemaining =
                        Math.max(
                            0,
                            Math.ceil(
                                (
                                    readyAt -
                                    now
                                ) /
                                1000
                            )
                        );

                } else {
                    /*
                     * Last compatibility fallback.
                     */
                    secondsRemaining =
                        Math.max(
                            0,
                            Number(
                                previous
                                    .secondsRemaining
                            ) ||
                            0
                        );


                    if (
                        secondsRemaining >
                        0
                    ) {
                        readyAt =
                            now +
                            secondsRemaining *
                            1000;


                        receivedAt =
                            now;
                    }
                }

            } else {
                /*
                 * Obtained / ready-to-brew / ready-to-open potions do not
                 * have an active brew countdown.
                 */
                secondsRemaining =
                    0;


                readyAt =
                    0;
            }


            var expires =
                readyAt > 0
                    ? new Date(
                        readyAt
                    )
                    : new Date(
                        0
                    );


            window.LM
                .user
                .potionsStatus[
                    potionKey
                ] = {
                    type:
                        productId,

                    productId:
                        productId,

                    slot:
                        s,

                    status:
                        status,

                    secondsRemaining:
                        secondsRemaining,

                    receivedAt:
                        receivedAt,

                    readyAt:
                        readyAt,

                    expires:
                        expires,

                    /*
                     * Keep current source object available for diagnostics
                     * and future fields.
                     */
                    raw:
                        pData
                };
        }

        // 5. Friends Button Disabled state when unauthenticated, missing UID, not logged in with Facebook, or disconnected
        var isUserLoggedIn = typeof window.checkUserLoggedIn === 'function' ? window.checkUserLoggedIn() : !!(window.loggedIn || (window.application && window.application.user && window.application.user.userId));
        var hasUserUID = typeof window.checkUserUID === 'function'
            ? window.checkUserUID()
            : !!(function() {
                var u = typeof window.agarioUID === 'string' ? window.agarioUID.trim() : '';
                var n = u.toLowerCase();
                return isUserLoggedIn && u && u.length >= 8 && u.indexOf('$') === -1 && u !== '0' && n !== 'null' && n !== 'undefined';
            })();
        var isFacebookLoggedIn =
            isUserLoggedIn &&
            hasUserUID &&
            typeof window.isFacebookAgarAccount ===
                'function' &&
            window.isFacebookAgarAccount();
        var hasServerConnection = !!((window.core && window.core.proxyMobileData) || (window.application && typeof window.application.sendProto === 'function') || window.legendmod);
        var friendsBtn = $('#lm-friends-btn, .lm-friends-btn');
        if (friendsBtn.length) {
            if (!isUserLoggedIn || !hasUserUID || !isFacebookLoggedIn || !hasServerConnection) {
                var friendsTitle = !isUserLoggedIn
                    ? 'Log in with Facebook and join a game session first to access Friends'
                    : (!hasUserUID
                        ? 'Play a game session first to receive your Agar.io UID'
                        : (!isFacebookLoggedIn
                            ? 'Friends feature requires logging in with Facebook'
                            : 'Join an Agar.io server first'));
                friendsBtn.css({ opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' })
                          .prop('disabled', true)
                          .attr('title', friendsTitle);
            } else {
                friendsBtn.css({ opacity: 1, cursor: 'pointer', pointerEvents: 'auto' })
                          .prop('disabled', false)
                          .removeAttr('title');
            }
        }

        /*
         * Keep the configured boost catalogue synchronized with
         * authoritative wallet quantities.
         *
         * initBoostDropdown() has its own signature guard, so no actual
         * DOM rebuild happens when nothing changed.
         */
        if (
            typeof window
                .initBoostDropdown ===
                'function'
        ) {
            window
                .initBoostDropdown(
                    false
                );
        }


        /*
         * Refresh the GameConfiguration + live account panel immediately
         * after profile synchronization.
         *
         * The 1-second countdown repaint still handles timer animation,
         * but account changes should not wait for that timer.
         */
        if (
            typeof window
                .renderAgarEconomyPanel ===
                'function'
        ) {
            window
                .renderAgarEconomyPanel(
                    level
                );
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

        var profilePanels = profileTab.find('.agario-profile-panel').not('#exp-bar');
        var targetContainer = profilePanels.length ? profilePanels.first() : profileTab;

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

    window.initBoostDropdown = function(
        force
    ) {
        var sel =
            $('#s-boost');


        if (
            !sel.length
        ) {
            return;
        }


        var catalog =
            typeof window
                .getAgarBoostCatalog ===
                'function'
                ? window
                    .getAgarBoostCatalog()
                : [];


        if (
            !catalog.length &&
            !force
        ) {
            return;
        }


        var inventory =
            (
                window.LM &&
                window.LM.user &&
                window.LM.user
                    .boosts
            ) ||
            {};


        var selectedBefore =
            sel.val() ||
            '';


        var signatureParts = [];


        for (
            var si = 0;
            si < catalog.length;
            si++
        ) {
            var signatureInfo =
                catalog[si];

            signatureParts.push(
                signatureInfo.productId +
                ':' +
                (
                    Number(
                        inventory[
                            signatureInfo.productId
                        ]
                    ) || 0
                ) +
                ':' +
                String(
                    signatureInfo.price
                ) +
                ':' +
                String(
                    signatureInfo.currency ||
                    ''
                ) +
                ':' +
                (
                    signatureInfo.bestDeal
                        ? '1'
                        : '0'
                )
            );
        }


        var signature =
            signatureParts.join(
                '|'
            );


        /*
         * syncProfileTabUI runs repeatedly.
         *
         * Do not rebuild the <select> when:
         *
         *   - catalogue is unchanged
         *   - wallet quantities are unchanged
         *   - prices/currencies are unchanged
         *
         * This also prevents the user's selected option from being reset.
         */
        if (
            !force &&
            sel.attr(
                'data-lm-boost-signature'
            ) === signature
        ) {
            return;
        }


        sel.attr(
            'data-lm-boost-signature',
            signature
        );


        sel.empty();


        sel.append(
            $('<option>', {
                value:
                    '',

                text:
                    '-- Select Boost --'
            })
        );


        for (
            var i = 0;
            i < catalog.length;
            i++
        ) {
            var info =
                catalog[i];


            if (
                !info ||
                !info.productId
            ) {
                continue;
            }


            var owned =
                Number(
                    inventory[
                        info.productId
                    ]
                ) || 0;


            var icon =
                info.type ===
                    'mass'
                    ? '\u26A1'
                    : '\u2B50';


            var typeName =
                info.type ===
                    'mass'
                    ? 'Mass'
                    : 'XP';


            var duration =
                typeof window
                    .formatAgarDurationSeconds ===
                    'function'
                    ? window
                        .formatAgarDurationSeconds(
                            (
                                Number(
                                    info.durationMins
                                ) || 0
                            ) *
                            60,
                            true
                        )
                    : (
                        String(
                            info.durationMins ||
                            0
                        ) +
                        'm'
                    );


            var priceText =
                (
                    info.price !==
                        undefined &&
                    info.price !==
                        null
                )
                    ? (
                        typeof window
                            .formatAgarCurrency ===
                            'function'
                            ? window
                                .formatAgarCurrency(
                                    info.price,
                                    info.currency
                                )
                            : (
                                String(
                                    info.price
                                ) +
                                (
                                    info.currency
                                        ? (
                                            ' ' +
                                            info.currency
                                        )
                                        : ''
                                )
                            )
                    )
                    : '';


            var label =
                icon +
                ' ' +
                info.multiplier +
                'x ' +
                typeName +
                ' (' +
                duration +
                ')';


            if (
                priceText
            ) {
                label +=
                    ' \u2014 ' +
                    priceText;
            }


            if (
                owned > 0
            ) {
                label +=
                    ' \u2014 owned: ' +
                    owned;
            }


            if (
                info.bestDeal
            ) {
                label +=
                    ' \u2605 BEST';
            }


            $('<option>')
                .val(
                    info.productId
                )
                .attr(
                    'data-purchase-id',
                    info.purchaseId ||
                    ''
                )
                .attr(
                    'data-currency',
                    info.currency ||
                    ''
                )
                .attr(
                    'data-price',
                    (
                        info.price !==
                            undefined &&
                        info.price !==
                            null
                    )
                        ? info.price
                        : ''
                )
                .attr(
                    'data-owned',
                    owned
                )
                .attr(
                    'data-boost-type',
                    info.type ||
                    ''
                )
                .attr(
                    'data-multiplier',
                    info.multiplier ||
                    1
                )
                .attr(
                    'data-duration-mins',
                    info.durationMins ||
                    0
                )
                .text(
                    label
                )
                .appendTo(
                    sel
                );
        }


        /*
         * Preserve selected product after catalogue rebuild.
         */
        if (
            selectedBefore
        ) {
            var selectedStillExists =
                sel
                    .children(
                        'option'
                    )
                    .filter(
                        function () {
                            return (
                                this.value ===
                                selectedBefore
                            );
                        }
                    )
                    .length >
                0;


            if (
                selectedStillExists
            ) {
                sel.val(
                    selectedBefore
                );
            }
        }
    };


    /*
     * GameConfiguration can arrive AFTER lm_extended_ui.js.
     *
     * Rebuild immediately when HUNK 2 announces that the new
     * authoritative configuration/index is available.
     */
    document.addEventListener(
        'lm-agar-config-index-ready',
        function () {
            /* Compact profile Boost selector */
            if (typeof window.initBoostDropdown === 'function') {
                window.initBoostDropdown(true);
            }

            /* Profile data block */
            if (typeof window.syncProfileTabUI === 'function') {
                try { window.syncProfileTabUI(); }
                catch (syncError) {
                    console.warn('[LM BOOST] Profile refresh after configuration failed:', syncError);
                }
            }

            /* Rebuild already-open XP / Mass shop */
            if (typeof window._lmRefreshOpenBoostShop === 'function') {
                try { window._lmRefreshOpenBoostShop(); }
                catch (e) { console.warn('[LM BOOST SHOP] Config refresh failed:', e); }
            }

            /* Rebuild already-open Rush shop */
            if (typeof window._lmRefreshOpenRushShop === 'function') {
                try { window._lmRefreshOpenRushShop(); }
                catch (e) { console.warn('[LM RUSH SHOP] Config refresh failed:', e); }
            }

            /* Premium Potion catalog refresh */
            if (document.getElementById('lm-premium-potions-modal') &&
                typeof window.showPremiumPotionsModal === 'function') {
                try { window.showPremiumPotionsModal(); }
                catch (e) { console.warn('[LM POTION SHOP] Config refresh failed:', e); }
            }
        }
    );


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

        /* Challenges button */
        $(document).off('click', '#lm-challenges-btn').on('click', '#lm-challenges-btn', function(e) {
            e.preventDefault();
            if (typeof window.showChallengesModal === 'function') {
                window.showChallengesModal();
            }
        });

        $(document).off('click', '#lm-leagues-btn').on('click', '#lm-leagues-btn', function(e) {
            e.preventDefault();
            if (!window._lmExtendedMenuEnabled()) {
                return false;
            }
            if (typeof window.showLeaguesModal === 'function') window.showLeaguesModal();
        });

        $(document)
            .off('click.lmFriendsLeague', '#lm-friends-btn')
            .on('click.lmFriendsLeague', '#lm-friends-btn', function(event) {
                event.preventDefault();
                event.stopPropagation();

                var isLoggedIn =
                    typeof window.checkUserLoggedIn === 'function'
                        ? window.checkUserLoggedIn()
                        : !!(
                            window.loggedIn ||
                            (
                                window.application &&
                                window.application.user &&
                                window.application.user.userId
                            )
                        );

                if (!isLoggedIn) {
                    if (window.toastr) {
                        toastr.error(
                            '<b>[FRIENDS LEAGUE]:</b> You must be logged in to view the Friends leaderboard.'
                        );
                    }

                    return false;
                }

                /*
                 * Match the official Agar.io behavior:
                 * open the Leagues interface and select data.friends.
                 */
                window.currentLeagueTab = 4;
                window._requestedLeagueTab = 4;

                if (typeof window.showLeaguesModal === 'function') {
                    window.showLeaguesModal();
                } else {
                    console.error(
                        '[LM] showLeaguesModal is unavailable.'
                    );

                    return false;
                }

                /*
                 * showLeaguesModal may create the tab buttons asynchronously.
                 * Select Friends after the modal has been inserted.
                 */
                window.setTimeout(function() {
                    var friendsTab =
                        document.getElementById(
                            'lm-tab-4'
                        );

                    if (friendsTab) {
                        friendsTab.click();
                        return;
                    }

                    if (
                        typeof window.switchLeagueTab ===
                        'function'
                    ) {
                        window.switchLeagueTab(4);
                    }
                }, 0);

                return false;
            });

        $(document).off('click', '#lm-daily-deal-btn').on('click', '#lm-daily-deal-btn', function(e) {
            e.preventDefault();
            if (!window._lmExtendedMenuEnabled()) {
                return false;
            }

            if (
                typeof window.openDailyDealsModal !==
                'function'
            ) {
                if (window.toastr) {
                    toastr.error(
                        '<b>[OFFICIAL OFFER]:</b> The official Agar.io offer opener is not ready.'
                    );
                }

                return false;
            }

            return window.openDailyDealsModal();
        });

        $(document).off('click.lmVanillaSkinShop', '.vanilla-skin-preview').on('click.lmVanillaSkinShop', '.vanilla-skin-preview', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.BeforeSpecialDeals === 'function') {
                window.BeforeSpecialDeals('skins');
            } else if (typeof window.SpecialDeals === 'function') {
                window.SpecialDeals('skins');
            } else if (window.toastr) {
                toastr.error('<b>[SHOP]:</b> The skin shop is not ready.');
            }
            return false;
        });

        $(document).off('click', '#openShopBtn, .quick-shop').on('click', '#openShopBtn, .quick-shop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.showShopModal === 'function') window.showShopModal();
        });
    });

})();
