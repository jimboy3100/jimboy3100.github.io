/* texts from the language packs (window.lmT, languages/lm-<code>.js): _lmUR plain text, _lmUE escaped for HTML; v fills {0} / {name} */
function _lmUR(k, v) { return window.lmT ? window.lmT(k, v) : String(k); }
function _lmUE(k, v) { return String(_lmUR(k, v)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
/*
 * Re-enable a "BUYING..." button once the soft purchase is no longer pending
 * (opcode 71 success/failure or the 20 s timeout). The buttons used to stay
 * disabled after a failure or timeout until the modal was reopened.
 */
window._lmRestoreWhenPurchaseSettled = function (purchaseId, restore) {
    var started = Date.now();
    var timer = setInterval(function () {
        var pending = typeof window._lmHasPendingSoftPurchase === 'function' &&
            window._lmHasPendingSoftPurchase(purchaseId);
        if (!pending || Date.now() - started > 30000) {
            clearInterval(timer);
            try { restore(); } catch (e) { }
        }
    }, 500);
};

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
        /* the shared window chrome and sizes (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
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
            /* the size is for these dialogs only (in .lm-modal-overlay): module windows with the
             * .lm-modal-container class keep their own size, see lmUiKit in LMexpress.js */
            .lm-modal-overlay .lm-modal-container {
                width: 620px;
                max-width: 94vw;
                max-height: 85vh;
                border-radius:var(--lm-radius,6px) !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                border: 1px solid var(--lm-pc2, rgba(255,255,255,0.12)) !important;
                border-top: 3px solid var(--lm-mc, #01d9cc) !important;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                font-family: var(--lm-hud-font, 'Ubuntu', 'Inter', sans-serif);
            }
            .lm-modal-header {
                padding: 10px 20px 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--lm-pc2, rgba(255,255,255,0.1));
                background: linear-gradient(180deg, var(--lm-pc2, #002f52) 0%, var(--lm-pc, #00243e) 100%);
            }
            .lm-modal-title {
                font-size: 16px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: var(--lm-mc, #01d9cc);
            }
            .lm-modal-close {
                background: rgba(255,255,255,0.05);
                border: none;
                color: var(--lm-tc2, #8096a7);
                width: 28px; height: 28px;
                border-radius:var(--lm-radius-s,4px);
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex; align-items: center; justify-content: center;
                font-weight: 400;
                line-height: 1;
            }
            .lm-modal-close:hover {
                background: rgba(255,255,255,0.12);
                color: var(--lm-tc, #fff);
            }
            .lm-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            .lm-modal-body::-webkit-scrollbar { width: 6px; }
            .lm-modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius:var(--lm-radius,6px); }
            .lm-modal-footer {
                padding: 10px 20px;
                border-top: 1px solid var(--lm-pc2, rgba(255,255,255,0.1));
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            /* Leagues List Styling */
            .lm-league-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius:var(--lm-radius,6px);
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
                border-radius:var(--lm-radius,6px);
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
                border-radius:var(--lm-radius,6px);
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
    /* Expose globally so ogario/modules/*.js can inject the shared modal CSS
     * before creating a dialog. Idempotent — safe to call many times. */
    window._lmEnsureModalCSS = injectStyles;

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


    /*
     * ═════════════════════════════════════════════════════════════════════
     * CONFIG-DRIVEN LEAGUE TIER + VISUAL PRESENTATION
     * ═════════════════════════════════════════════════════════════════════
     *
     * LEVEL RANGE:
     *
     *      Leagues - Tiers
     *
     * COLOR / ICON / LOCALE:
     *
     *      Visual - Leagues
     *
     * WEEKLY RANK / PRIZES:
     *
     *      official Agar.io league response only
     *
     * _resolveOfficialLeaguePrizeData() remains completely untouched.
     */
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


            if (
                !configuredTier
            ) {
                return {
                    id:
                        'unknown',

                    configName:
                        '',

                    name:
                        _lmUR('lmx.ui.league'),

                    localeTag:
                        '',

                    color:
                        theme.mc,

                    gradient:
                        (
                            'linear-gradient(135deg, ' +
                            theme.mc +
                            ' 0%, ' +
                            theme.pc2 +
                            ' 100%)'
                        ),

                    icon:
                        null,

                    isTiered:
                        false,

                    levelFrom:
                        null,

                    levelTo:
                        null,

                    spread:
                        0,

                    topSize:
                        0,

                    raw:
                        null,

                    rawVisual:
                        null
                };
            }


            var visualLookupName =
                configuredTier
                    .configName ||
                configuredTier
                    .name ||
                configuredTier
                    .id ||
                '';


            var visual =
                typeof window
                    .getAgarVisualLeague ===
                    'function'
                    ? window
                        .getAgarVisualLeague(
                            visualLookupName
                        )
                    : null;


            /*
             * Do not recreate the old fly/wasp/bat/... hardcoded palette.
             */
            var visualColor =
                (
                    visual &&
                    visual.outlineColor &&
                    visual.outlineColor.valid &&
                    visual.outlineColor.css
                )
                    ? visual.outlineColor.css
                    : theme.mc;


            var gradientEnd =
                theme.pc2;


            if (
                visual &&
                visual.outlineColor &&
                visual.outlineColor.valid
            ) {
                gradientEnd =
                    (
                        'rgba(' +
                        visual.outlineColor.r +
                        ',' +
                        visual.outlineColor.g +
                        ',' +
                        visual.outlineColor.b +
                        ',0.42)'
                    );
            }


            return {
                id:
                    configuredTier.id,

                configName:
                    configuredTier
                        .configName,

                /*
                 * Keep the tier resolver's configured name as the visible
                 * fallback until LM's localization layer resolves localeTag.
                 */
                name:
                    configuredTier
                        .name,

                localeTag:
                    visual
                        ? visual.localeTag
                        : '',

                color:
                    visualColor,

                gradient:
                    (
                        'linear-gradient(135deg, ' +
                        visualColor +
                        ' 0%, ' +
                        gradientEnd +
                        ' 100%)'
                    ),

                icon:
                    visual
                        ? visual.icon
                        : null,

                isTiered:
                    visual
                        ? visual.isTiered
                        : true,

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
                        .raw,

                rawVisual:
                    visual
                        ? visual.raw
                        : null
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

            /* the tier name comes from Agar.io; the word League is translated */
            officialTierTitle = officialTierTitle.replace(/\s*\bleague$/i, '');
            officialTierTitle = officialTierTitle
                ? _lmUR('lmx.ui.tierLeague', [officialTierTitle.charAt(0).toUpperCase() + officialTierTitle.slice(1)])
                : '';
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
                    _lmUR('lmx.ui.countryTab', [userCountry.toUpperCase()]),

                gradient:
                    'linear-gradient(135deg, #7b1fa2 0%, #4527a0 100%)',

                icon:
                    '<span class="flag-icon flag-icon-' +
                    userCountry
                        .toLowerCase() +
                    '" style="border-radius:var(--lm-radius-s,4px);"></span>',

                prizes:
                    officialPrizeSummary
            },

            3: {
                title:
                    _lmUR('lmx.ui.world'),

                gradient:
                    'linear-gradient(135deg, #1565c0 0%, #0277bd 100%)',

                icon:
                    '🌎',

                prizes:
                    officialPrizeSummary
            },

            4: {
                title:
                    _lmUR('friends'),

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
            <div style="background: ${cfg.gradient}; border-radius:var(--lm-radius,6px); padding: 14px 18px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.3); color: #fff;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="font-size: 32px; background: rgba(255,255,255,0.15); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">
                        ${cfg.icon}
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,0.4);">${window._escapeLeagueHtmlText(cfg.title)}</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${_lmUE('lmx.ui.weeklyLeague')}</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius:var(--lm-radius,6px); border: 1px solid rgba(255,255,255,0.2); font-size: 11px; text-align: center;">
                        <div style="opacity: 0.8; margin-bottom: 2px;">${_lmUE('lmx.ui.top3Prizes')}</div>
                        <div style="font-weight: 800; color: #ffd700;">${cfg.prizes}</div>
                    </div>
                    <button class="btn" onclick="window.showMorePrizesModal(${tabType});" style="background: ${t.b2}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('lmx.ui.morePrizes')}</button>
                    <button class="btn" onclick="window.showLastWeekResultsModal(${tabType});" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 11px; padding: 6px 10px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('lmx.ui.lastWeekResults')}</button>
                    <button class="btn" onclick="window.showLeaguesInfoModal();" style="background: rgba(255,255,255,0.2); color: #fff; font-weight: 900; font-size: 15px; width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">?</button>
                </div>
            </div>
        `;

        // Table Header
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; margin-bottom: 6px; font-size: 11px; font-weight: 800; color: ${t.tc2}; text-transform: uppercase; letter-spacing: 0.5px;">
                <div style="width: 70px;">${_lmUE('lmx.ui.colRank')}</div>
                <div style="flex: 1;">${_lmUE('lmx.ui.colName')}</div>
                <div style="width: 140px; text-align: right;">${_lmUE('lmx.ui.colWeeklyWinnings')}</div>
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
            _lmUR('lmx.ui.you');

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
                    rankBadge = `<div style="padding: 3px 8px; border-radius:var(--lm-radius,6px); background: ${t.b1}; color: ${t.btc}; font-weight: 800; font-size: 12px;">#${rankNum}</div>`;
                }

                var name = entry.displayName || entry.id || _lmUR('lmx.ui.playerN', [rankNum]);
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
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius:var(--lm-radius,6px); ${rowBg} transition: transform 0.15s;">
                        <div style="width: 70px;">${rankBadge}</div>
                        <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                            <img src="${icon}" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.onerror=null; this.src='https://jimboy3100.github.io/banners/profilepic_guest.png';">
                            <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${level}</span>
                            <span class="country-icon flag-icon flag-icon-${country}" style="border-radius:var(--lm-radius-s,4px);"></span>
                            <span style="font-weight: 700; color: ${isUser ? '#00e676' : t.tc}; font-size: 13px;">${isUser ? _lmUE('lmx.ui.nameYou', [name]) : window._escapeLeagueHtmlText(name)}</span>
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
                    ${_lmUE('lmx.ui.noPlayersYet')}
                </div>
            `;
        } else {
            // No server response yet — preserve the loading state.
            html += `
                <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    ${_lmUE('lmx.ui.pleaseWait')}
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
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-top: 10px; border-radius:var(--lm-radius,6px); background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676; box-shadow: 0 0 12px rgba(0,230,118,0.2);">
                    <div style="width: 70px;">
                        <div style="padding: 4px 8px; border-radius:var(--lm-radius,6px); background: #00e676; color: #000; font-weight: 900; font-size: 12px; text-align: center;">${currentUserRank}</div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 10px;">
                        <img src="${currentUserAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #00e676;" onerror="this.src='https://jimboy3100.github.io/banners/profilepic_guest.png'">
                        <span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #fff;">${currentUserLevel}</span>
                        <span class="country-icon flag-icon flag-icon-${currentUserCountry.toLowerCase()}" style="border-radius:var(--lm-radius-s,4px);"></span>
                        <span style="font-weight: 800; color: #00e676; font-size: 14px;">${_lmUE('lmx.ui.nameYou', [currentUserName])}</span>
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

    window._renderCurrentLeaguesRequestState = function(icon, message, withRetry) {
        var listContainer = document.getElementById(
            'lm-leagues-list-container'
        );
        if (!listContainer) return;
        var t = getTheme();
        var retryHtml = withRetry
            ? `<div style="margin-top: 14px;"><button class="btn" onclick="window.retryCurrentLeaguesRequest();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 6px 20px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('retry')}</button></div>`
            : '';
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 14px; font-weight: 600;">
                <div style="font-size: 24px; margin-bottom: 10px;">${icon}</div>
                ${message}
                ${retryHtml}
            </div>
        `;
    };

    /*
     * The official client opens Leagues only when the login response carried
     * userLeaguesInfo (field 19); name that when a request gets no data.
     */
    window._leaguesNoDataMessage = function(message) {
        if (window._lmLoginHasLeaguesInfo === false) {
            return message + '<br><span style="font-size: 12px; font-weight: 500;">' + _lmUE('lmx.ui.leaguesNotEnabled') + '</span>';
        }
        return message;
    };

    /*
     * Retry button of the failure/timeout states: a failed or unanswered
     * request is not retried by switching tabs (the state is no longer idle),
     * so start a new request for the open modal here.
     */
    window.retryCurrentLeaguesRequest = function() {
        if (!document.getElementById('lm-leagues-modal')) return;
        if (window._leaguesRequestState === 'loading') return;
        if (window._leaguesTimeoutTimer) {
            clearTimeout(window._leaguesTimeoutTimer);
            window._leaguesTimeoutTimer = null;
        }
        window._leaguesRequestState = 'idle';
        window._renderCurrentLeaguesRequestState('⏳', _lmUE('lmx.ui.pleaseWait'));
        window._startCurrentLeaguesRequest();
    };

    /*
     * The Expanding Land server answers at most one opcode-130 request per
     * 5 s per connection (current and last week share that cooldown) and
     * sends nothing when throttled. Send now when allowed, otherwise delay
     * the send to the end of the cooldown. Returns the delay in ms (0 = sent
     * now), or -1 when an immediate send failed.
     */
    window._lmLastLeaguesRequestAt = 0;
    window._lmSendLeaguesRequest = function(requestType) {
        var cooldownMs = 5100;
        function send() {
            var sent = false;
            if (typeof window.requestLeaguesInfo === 'function') {
                sent = window.requestLeaguesInfo(requestType) === true;
            } else if (
                window.application &&
                typeof window.application.requestLeaguesInfo === 'function'
            ) {
                sent = window.application.requestLeaguesInfo(requestType) === true;
            } else if (
                requestType === 1 &&
                typeof window.userLeaguesInfoRequest === 'function'
            ) {
                sent = window.userLeaguesInfoRequest() !== false;
            }
            if (sent) window._lmLastLeaguesRequestAt = Date.now();
            return sent;
        }
        var now = Date.now();
        /* One queued send per request type: reopening the modal reuses it. Queuing
         * more used to hit the clock-jump cap below and fire two requests inside
         * the server's cooldown (one was silently dropped). */
        var pending = window._lmLeaguesPending || (window._lmLeaguesPending = {});
        if (pending[requestType]) {
            return Math.max(1, pending[requestType] - now);
        }
        var waitMs = window._lmLastLeaguesRequestAt + cooldownMs - now;
        if (waitMs <= 0) {
            return send() ? 0 : -1;
        }
        // With at most one queued send per type the wait stays under 3 cooldowns;
        // a longer wait means the clock jumped back.
        if (waitMs > 3 * cooldownMs) waitMs = cooldownMs;
        // Reserve the slot so a second queued request waits for this one.
        window._lmLastLeaguesRequestAt = now + waitMs;
        pending[requestType] = now + waitMs;
        setTimeout(function() {
            delete pending[requestType];
            try {
                send();
            } catch (delayedLeaguesRequestError) {
                console.warn(
                    '[LM] Delayed leagues request failed:',
                    delayedLeaguesRequestError
                );
            }
        }, waitMs);
        return waitMs;
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
        var requestDelayMs = 0;
        try {
            requestDelayMs = window._lmSendLeaguesRequest(1);
            requestWasSent = requestDelayMs >= 0;
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
                    _lmUE('lmx.ui.lbRequestFailed'),
                    true
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
                        window._leaguesNoDataMessage(_lmUE('lmx.ui.lbTimedOut')),
                        true
                    );
                }
            }, 5000 + requestDelayMs);
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
                        _lmUE('lmx.ui.lbRequestFailed'),
                        true
                    );
            } else if (
                window._leaguesRequestState ===
                'timeout'
            ) {
                window
                    ._renderCurrentLeaguesRequestState(
                        '⏱️',
                        window._leaguesNoDataMessage(_lmUE('lmx.ui.lbTimedOut')),
                        true
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
            <div class="lm-modal-container" style="background: ${t.pc}; width: 680px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 18px; font-weight: 800; color: ${t.mc}; text-transform: uppercase; letter-spacing: 1px;">${_lmUE('leaderboards')}</span>
                        <div id="lm-leagues-reset" style="display: none; font-size: 11px; font-weight: 600; color: ${t.tc2}; margin-top: 2px;"></div>
                        <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" style="position: absolute; right: 0; top: -4px;" onclick="document.getElementById('lm-leagues-modal').remove();">&times;</button>
                    </div>
                </div>

                <div class="lm-modal-body" style="padding: 16px;">
                    <!-- 3 Leaderboard Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                        <button id="lm-tab-1" class="lm-tab-btn ${window.currentLeagueTab === 1 ? 'active' : ''}" onclick="window.switchLeagueTab(1);" style="flex: 1; padding: 8px 12px; border-radius:var(--lm-radius,6px); font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 1 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 1 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 1 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            ⭐ ${_lmUE('lmx.ui.myLeague')}
                        </button>
                        <button id="lm-tab-4" class="lm-tab-btn ${window.currentLeagueTab === 4 ? 'active' : ''}" onclick="window.switchLeagueTab(4);" style="flex: 1; padding: 8px 12px; border-radius:var(--lm-radius,6px); font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 4 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 4 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 4 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            👥 ${_lmUE('friends')}
                        </button>
                        <button id="lm-tab-2" class="lm-tab-btn ${window.currentLeagueTab === 2 ? 'active' : ''}" onclick="window.switchLeagueTab(2);" style="flex: 1; padding: 8px 12px; border-radius:var(--lm-radius,6px); font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 2 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 2 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 2 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🇺🇸 ${_lmUE('lmx.ui.country')}
                        </button>
                        <button id="lm-tab-3" class="lm-tab-btn ${window.currentLeagueTab === 3 ? 'active' : ''}" onclick="window.switchLeagueTab(3);" style="flex: 1; padding: 8px 12px; border-radius:var(--lm-radius,6px); font-weight: 700; font-size: 12px; cursor: pointer; background: ${window.currentLeagueTab === 3 ? t.b1 : 'rgba(255,255,255,0.06)'}; color: ${window.currentLeagueTab === 3 ? t.btc : t.tc2}; border: 1px solid ${window.currentLeagueTab === 3 ? t.mc : 'rgba(255,255,255,0.1)'};">
                            🌎 ${_lmUE('lmx.ui.world')}
                        </button>
                    </div>

                    <!-- Dynamic Leaderboard Content Container -->
                    <div id="lm-leagues-content-area"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        /* League reset countdown (official "Resets in"): one 1 s timer while this window is open. */
        if (window._lmLeaguesResetTimer) clearInterval(window._lmLeaguesResetTimer);
        var resetTick = function () {
            var el = document.getElementById('lm-leagues-reset');
            if (!el) { clearInterval(window._lmLeaguesResetTimer); window._lmLeaguesResetTimer = null; return; }
            var secs = Math.floor(((Number(window._lmLeaguesResetAt) || 0) - Date.now()) / 1000);
            var span = '';
            if (secs >= 86400) span = _lmUR('lmx.ui.durDH', [Math.floor(secs / 86400), Math.floor(secs % 86400 / 3600)]);
            else if (secs >= 3600) span = _lmUR('lmx.ui.durHM', [Math.floor(secs / 3600), Math.floor(secs % 3600 / 60)]);
            else if (secs > 0) span = _lmUR('lmx.ui.durM', [Math.ceil(secs / 60)]);
            var txt = span ? _lmUR('leaguesResetsIn').replace('{t}', span) : '';
            if (el.textContent !== txt) el.textContent = txt;
            el.style.display = txt ? '' : 'none';
        };
        resetTick();
        window._lmLeaguesResetTimer = setInterval(resetTick, 1000);

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

        /*
         * switchLeagueTab requests only when nothing is cached. Refresh the
         * cached current week once per open as well, so trophies and rank
         * earned since the first response are shown (the cache stays visible
         * meanwhile; no-op when a request already started above).
         */
        window._startCurrentLeaguesRequest();
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
            try {
                window
                    ._captureLeagueCurrentUserIdentity(
                        detail
                    );

                window.renderLeaguesContent(
                    window.currentLeagueTab ||
                        1,
                    detail
                );
            } catch (leaguesRenderError) {
                console.warn(
                    '[LM LEAGUES] Could not render the leaderboard:',
                    leaguesRenderError
                );
                window._renderCurrentLeaguesRequestState(
                    '⚠️',
                    _lmUE('lmx.ui.lbDisplayFailed'),
                    true
                );
            }
        }
    });

    /*
     * Opcode-102 type 22 (no proper response) answering a leagues request:
     * the official client resolves its pending 130 request with no data.
     * Fail the pending request now instead of waiting for the timeout.
     */
    document.addEventListener('noProperResponse', function(e) {
        var detail = e.detail || {};
        /* only a 22 that answered a pending leagues request (ogario fills leagueRequestType) */
        if (!detail.leagueRequestType) return;

        if (Number(detail.leagueRequestType) === 2) {
            if (!window._lastWeekTimeoutTimer) return;
            clearTimeout(window._lastWeekTimeoutTimer);
            window._lastWeekTimeoutTimer = null;
            var lastWeekArea = document.getElementById('lm-lastweek-content');
            if (lastWeekArea && lastWeekArea.querySelector('[data-loading]')) {
                var lt = getTheme();
                lastWeekArea.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: ${lt.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                        <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                        ${_lmUE('lmx.ui.noWeeklyResults')}
                        <div style="margin-top: 14px;"><button class="btn" onclick="window.showLastWeekResultsModal(window._lastWeekLeagueTab);" style="background: ${lt.b1}; color: ${lt.btc}; font-weight: 800; padding: 6px 20px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('retry')}</button></div>
                    </div>
                `;
            }
            return;
        }

        if (window._leaguesRequestState !== 'loading') return;
        if (window._leaguesTimeoutTimer) {
            clearTimeout(window._leaguesTimeoutTimer);
            window._leaguesTimeoutTimer = null;
        }
        window._leaguesRequestState = 'failure';
        if (!window._hasUsableCurrentLeaguesCache()) {
            window._renderCurrentLeaguesRequestState(
                '⚠️',
                window._leaguesNoDataMessage(_lmUE('lmx.ui.lbNoData')),
                true
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
                        _lmUE('lmx.ui.prizeApiUnavailable');
                    break;

                case 'tier-unavailable':
                    reasonText =
                        _lmUE('lmx.ui.prizeTierUnavailable');
                    break;

                case 'lookup-failed':
                    reasonText =
                        _lmUE('lmx.ui.prizeLookupFailed');
                    break;

                case 'empty':
                    reasonText =
                        _lmUE('lmx.ui.prizeEmpty');
                    break;

                default:
                    reasonText =
                        _lmUE('lmx.ui.prizeFailed');
                    break;
            }

            console.error(
                '[LM LEAGUES] More Prizes unavailable:',
                resolvedPrizeData
            );

            if (window.toastr) {
                toastr.error(
                    '<b>[' + _lmUE('lmx.ui.tagLeagues') + ']:</b> ' +
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
                    '<b>[' + _lmUE('lmx.ui.tagLeagues') + ']:</b> ' + _lmUE('lmx.ui.prizeInvalid')
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
                : '';
        /* the tier id comes from Agar.io (gold_league, silver...): its name stays, the word League is translated */
        tierTitle = tierTitle.replace(/\s*\bleague$/i, '');
        tierTitle = tierTitle
            ? _lmUR('lmx.ui.tierLeague', [tierTitle.charAt(0).toUpperCase() + tierTitle.slice(1)])
            : _lmUR('lmx.ui.myLeague');

        var title;

        switch (currentTab) {
            case 2:
                title =
                    _lmUR('lmx.ui.countryLeague', [safeCountry]);
                break;

            case 3:
                title =
                    _lmUR('lmx.ui.worldLeague');
                break;

            case 4:
                title =
                    _lmUR('lmx.ui.friendsLeague');
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
                    'border-radius:var(--lm-radius,6px);' +
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
                'background:' + // i18n-ok: CSS, not text
                    theme.pc +
                ';' +
                'width:480px;' +
            '">' +

                '<div class="lm-modal-header" style="' +
                    'background:' + // i18n-ok: CSS, not text
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
                            'aria-label="' + _lmUE('close') + '" ' +
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
                            _lmUE('lmx.ui.prizes') +
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
                            'border-radius:var(--lm-radius,6px);' +
                            'border:none;' +
                            'cursor:pointer;' +
                        '"' +
                    '>' +
                        _lmUE('close') +
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
            requestedLastWeekTab === 3 ||
            requestedLastWeekTab === 4
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

        var title = _lmUE('lmx.ui.weeklyResults');
        var gradient = myTier ? myTier.gradient : 'linear-gradient(135deg, #d32f2f 0%, #7b1fa2 100%)';

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; width: 520px;">
                <div class="lm-modal-header" style="background: ${gradient}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${title}</span>
                        <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: #fff;" onclick="document.getElementById('lm-lastweek-modal').remove();">&times;</button>
                    </div>
                </div>

                <div id="lm-lastweek-content" class="lm-modal-body" style="padding: 20px; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div data-loading="true" style="text-align: center; color: ${t.tc2}; font-size: 14px;">
                        <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                        ${_lmUE('lmx.ui.loadingLastWeek')}
                    </div>
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-lastweek-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('close')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Check if we already have cached last week data
        if (window.lastWeekLeaguesResponse) {
            window._renderLastWeekContent(window.lastWeekLeaguesResponse);
            // Refresh in the background (e.g. after the weekly reset); the
            // leaguesInfoUpdate listener re-renders this modal when it lands.
            try {
                window._lmSendLeaguesRequest(2);
            } catch (lastWeekRefreshError) {}
        } else {
            // Request last week data from server (type=2).
            var lastWeekRequestWasSent = false;
            var lastWeekRequestDelayMs = 0;
            try {
                lastWeekRequestDelayMs = window._lmSendLeaguesRequest(2);
                lastWeekRequestWasSent = lastWeekRequestDelayMs >= 0;
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
                            ${_lmUE('lmx.ui.lastWeekRequestFailed')}
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
                            ${_lmUE('lmx.ui.weeklyResultsFailed')}
                            <div style="margin-top: 14px;"><button class="btn" onclick="window.showLastWeekResultsModal(window._lastWeekLeagueTab);" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 6px 20px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('retry')}</button></div>
                        </div>
                    `;
                }
            }, 5000 + lastWeekRequestDelayMs);
        }
    };

    // Helper: render "no results" message matching original agar.io
    window._renderLastWeekNoResults = function() {
        var t = getTheme();
        var contentArea = document.getElementById('lm-lastweek-content');
        if (!contentArea) return;
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: ${t.tc2}; font-size: 15px; font-weight: 600; line-height: 1.6;">
                ${_lmUR('lmx.ui.noTrophiesLastWeek')}
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
            selectedLastWeekTab !== 3 &&
            selectedLastWeekTab !== 4
        ) {
            selectedLastWeekTab = 1;
        }

        var selectedOfficialEntries =
            selectedLastWeekTab === 2
                ? countryEntries
                : (
                    selectedLastWeekTab === 3
                        ? worldEntries
                        : (
                            selectedLastWeekTab === 4
                                ? friendsEntries
                                : leagueEntries
                        )
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
                    ${_lmUE('lmx.ui.noResultsForBoard')}
                </div>
            `;
            return;
        }

        var currentUser = (window.application && window.application.user) || {};
        var currentUserName = currentUser.displayName || window.agarioProfileName || _lmUR('lmx.ui.you');

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

            var name = entry.displayName || entry.id || _lmUR('lmx.ui.playerN', [rankNum]);
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
                rankBadge = '<div style="padding: 3px 8px; border-radius:var(--lm-radius,6px); background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 800; font-size: 12px;">#' + rankNum + '</div>';
            }

            var rowBg = isUser ? 'background: rgba(0, 230, 118, 0.15); border: 2px solid #00e676;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; margin-bottom: 6px; border-radius:var(--lm-radius,6px); ' + rowBg + '">';
            html += '<div style="width: 60px;">' + rankBadge + '</div>';
            html += '<div style="flex: 1; display: flex; align-items: center; gap: 10px;">';
            html += '<img src="' + icon + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.onerror=null; this.src=\'https://jimboy3100.github.io/banners/profilepic_guest.png\';">';
            html += '<span style="background: #00e676; color: #000; font-size: 10px; font-weight: 900; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">' + level + '</span>';
            html += '<span class="country-icon flag-icon flag-icon-' + country + '" style="border-radius:var(--lm-radius-s,4px);"></span>';
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
            <div class="lm-modal-container" style="background: ${t.pc}; width: 480px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 100%; text-align: center; position: relative;">
                        <span style="font-size: 17px; font-weight: 900; color: ${t.tc};">${_lmUE('lmx.ui.worldInformation')}</span>
                        <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: ${t.tc};" onclick="document.getElementById('lm-leaguesinfo-modal').remove();">&times;</button>
                    </div>
                </div>

                <div style="display: flex; padding: 12px 20px 0 20px; gap: 8px;">
                    <button id="lm-info-tab-rules" onclick="window._switchLeaguesInfoTab('rules')" style="flex: 1; padding: 10px; border-radius:var(--lm-radius,6px); font-weight: 800; font-size: 14px; cursor: pointer; border: 2px solid ${t.b1}; background: ${t.b1}; color: ${t.btc};">${_lmUE('lmx.ui.rules')}</button>
                    <button id="lm-info-tab-trophies" onclick="window._switchLeaguesInfoTab('trophies')" style="flex: 1; padding: 10px; border-radius:var(--lm-radius,6px); font-weight: 800; font-size: 14px; cursor: pointer; border: 2px solid ${t.b2}; background: transparent; color: ${t.tc};">${_lmUE('lmx.ui.trophies')}</button>
                </div>

                <div id="lm-info-content" class="lm-modal-body" style="padding: 24px 30px; min-height: 180px; text-align: center;">
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-leaguesinfo-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('close')}</button>
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
                _lmUR('lmx.ui.rulesText') +
                '</div>';
        } else {
            trophiesBtn.style.background = t.b1;
            trophiesBtn.style.color = t.btc;
            trophiesBtn.style.borderColor = t.b1;
            rulesBtn.style.background = 'transparent';
            rulesBtn.style.color = t.tc;
            rulesBtn.style.borderColor = t.b2;

            content.innerHTML = '<div style="color: ' + t.tc + '; font-size: 14px; line-height: 1.8; font-weight: 600;">' +
                _lmUR('lmx.ui.trophiesText') +
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
            '<div class="lm-modal-container" style="background: ' + t.pc + '; width: 420px;">' +
                '<div class="lm-modal-header" style="background: ' + t.pc2 + '; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
                    '<div style="width: 100%; text-align: center; position: relative;">' +
                        '<span style="font-size: 17px; font-weight: 900; color: ' + t.tc + ';"><i class="fa fa-users"></i> ' + _lmUE('friends') + '</span>' +
                        '<button type="button" aria-label="' + _lmUE('close') + '" class="lm-modal-close" style="position: absolute; right: 0; top: -4px; color: ' + t.tc + ';" onclick="document.getElementById(\'lm-friends-modal\').remove();">&times;</button>' +
                    '</div>' +
                '</div>' +
                '<div id="lm-friends-summary" style="padding: 8px 20px; text-align: center; font-size: 12px; color: ' + t.tc2 + '; font-weight: 600; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06);"></div>' +
                '<div id="lm-friends-content" class="lm-modal-body" style="padding: 12px 16px; min-height: 200px; max-height: 400px; overflow-y: auto;">' +
                    '<div style="text-align: center; padding: 40px; color: ' + t.tc2 + ';">' +
                        '<div class="spinner" style="width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: ' + t.mc + '; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>' +
                        _lmUE('lmx.ui.requestingFriendsServer') +
                    '</div>' +
                '</div>' +
                '<div style="padding: 12px 20px; text-align: center; background: ' + t.pc2 + '; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px; justify-content: center;">' +
                    '<button id="lm-friends-refresh-btn" onclick="window._refreshFriendsList();" style="background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 800; padding: 8px 20px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer; font-size: 12px;">🔄 ' + _lmUE('roomRefresh') + '</button>' +
                    '<button onclick="document.getElementById(\'lm-friends-modal\').remove();" style="background: rgba(255,255,255,0.08); color: ' + t.tc + '; font-weight: 800; padding: 8px 20px; border-radius:var(--lm-radius,6px); border: 1px solid rgba(255,255,255,0.15); cursor: pointer; font-size: 12px;">' + _lmUE('close') + '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Listen for friend list update (one listener across reopens)
        if (window._friendsModalListener) {
            document.removeEventListener('friendListUpdate', window._friendsModalListener);
        }
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
                    _lmUE('lmx.ui.requestingFriends') +
                '</div>';
        }

        // Replays the last server-pushed 147 list (the client never requests it)
        if (window.application && typeof window.application.requestFriendListUpdate === 'function') {
            /* false = no list was pushed yet: show the empty state now instead of a 5 s spinner */
            if (window.application.requestFriendListUpdate() === false) {
                window._renderFriendsList({ friends: [], totalOnline: 0 });
                return;
            }
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
                summary.innerHTML = _lmUE('lmx.ui.noFriendsFoundShort') + ' • <span style="color: ' + t.mc + ';">' + _lmUE('lmx.ui.loginFbForFriends') + '</span>';
            } else {
                summary.innerHTML = '<span style="color: #4caf50; font-weight: 800;">' + _lmUE('lmx.ui.friendsOnline', [totalOnline]) + '</span> • ' + _lmUE('lmx.ui.friendsTotal', [friends.length]);
            }
        }

        if (friends.length === 0) {
            content.innerHTML =
                '<div style="text-align: center; padding: 30px; color: ' + t.tc2 + ';">' +
                    '<div style="font-size: 40px; margin-bottom: 12px; opacity: 0.5;">👥</div>' +
                    '<div style="font-size: 14px; font-weight: 700; color: ' + t.tc + '; margin-bottom: 6px;">' + _lmUE('lmx.ui.noFriendsFound') + '</div>' +
                    '<div style="font-size: 12px; color: ' + t.tc2 + '; line-height: 1.6;">' +
                        _lmUR('lmx.ui.friendsFromFb') +
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
            var statusText = isOnline ? _lmUE('lmx.ui.online') : _lmUE('lmx.ui.offline');

            // realmInfo is the friend's login account (official login_realm enum:
            // 1 guest, 2 facebook, 3 googleplus, 4 googleplay), not a game server.
            var realmText = '';
            if (realm) {
                var realmName = '';
                switch (realm.realm || 0) {
                    case 2: realmName = 'Facebook'; break;
                    case 3: case 4: realmName = 'Google'; break;
                    case 1: realmName = _lmUE('lmx.ui.guest'); break;
                }
                if (realmName) realmText = '<div style="font-size: 10px; color: #2196f3; font-weight: 600; margin-top: 2px;">' + realmName + '</div>';
            }

            // Display name: extract from userId or show truncated ID
            var displayId = userId;
            if (userId.length > 20) displayId = userId.substring(0, 8) + '...' + userId.substring(userId.length - 6);

            // Avatar
            var avatarHtml = '';
            if (avatarUrl) {
                avatarHtml = '<img src="' + window._escapeLeagueHtmlText(avatarUrl) + '" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; object-fit: cover;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">';
                avatarHtml += '<div style="display: none; width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; background: rgba(255,255,255,0.08); align-items: center; justify-content: center; font-size: 18px;">👤</div>';
            } else {
                avatarHtml = '<div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid ' + statusColor + '; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 18px;">👤</div>';
            }

            // No join/spectate action: the friend message carries no server or
            // party code (realmId is a Facebook/Google account id).
            var actionHtml = '';

            html += '<div style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius:var(--lm-radius,6px); background: rgba(255,255,255,' + (isOnline ? '0.06' : '0.02') + '); border: 1px solid rgba(255,255,255,' + (isOnline ? '0.1' : '0.04') + '); margin-bottom: 6px;' + (isOnline ? '' : ' opacity: 0.7;') + '">' +
                avatarHtml +
                '<div style="flex: 1; min-width: 0;">' +
                    '<div style="display: flex; align-items: center; gap: 6px;">' +
                        '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + statusColor + '; flex-shrink: 0;' + (isOnline ? ' box-shadow: 0 0 6px ' + statusColor + ';' : '') + '"></div>' +
                        '<span style="font-weight: 700; font-size: 13px; color: ' + t.tc + '; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + window._escapeLeagueHtmlText(displayId) + '</span>' +
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

        toastr && toastr.info('<b>[' + _lmUE('friends') + ']:</b> ' + _lmUE('lmx.ui.joiningFriendServer', [realmId.substring(0, 12)]));
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
                /*
                 * Visual - Help Settings now comes through the canonical
                 * GameConfiguration resolver.
                 */
                var getHelp =
                    function (
                        key,
                        fallback
                    ) {
                        return typeof window
                            .getAgarHelpSetting ===
                            'function'
                                ? window
                                    .getAgarHelpSetting(
                                        key,
                                        fallback
                                    )
                                : fallback;
                    };


                var minPosFFA =
                    getHelp(
                        'potionsMinPositionFreeForAll',
                        10
                    );

                var minTimeFFA =
                    getHelp(
                        'potionsMinTimeFreeForAll',
                        20
                    );


                /*
                 * Preserve the remaining configured help-animation metadata
                 * instead of leaving it unreachable.
                 */
                var helpAnimationConfig =
                    {
                        startingDelayInSecs:
                            Number(
                                getHelp(
                                    'startingDelayInSecs',
                                    2
                                )
                            ),

                        waveDurationInSecs:
                            Number(
                                getHelp(
                                    'waveDurationInSecs',
                                    2
                                )
                            ),

                        timeBetweenWaveAnimationsInSecs:
                            Number(
                                getHelp(
                                    'timeBetweenWaveAnimationsInSecs',
                                    2
                                )
                            ),

                        timeAfterGlowAnimationsInSecs:
                            Number(
                                getHelp(
                                    'timeAfterGlowAnimationsInSecs',
                                    1
                                )
                            ),

                        timeAfterEatAnimationsInSecs:
                            Number(
                                getHelp(
                                    'timeAfterEatAnimationsInSecs',
                                    2
                                )
                            ),

                        skinToShowInPotionsHelpMenu:
                            String(
                                getHelp(
                                    'skinToShowInPotionsHelpMenu',
                                    ''
                                ) ||
                                ''
                            )
                    };


                window
                    .AgarPotionHelpAnimationConfig =
                    helpAnimationConfig;

                return `
                    <div style="display: flex; gap: 16px; padding: 10px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:var(--lm-radius,6px); padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: ${t.mc}; margin-bottom: 12px;">🏆 ${_lmUE('lmx.ui.lbWinPotions')}</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.8;">
                                <div>${_lmUR('lmx.ui.ruleFfa', [minPosFFA, minTimeFFA])}</div>
                                <div>${_lmUR('lmx.ui.ruleTeams')}</div>
                                <div>${_lmUR('lmx.ui.ruleBrRush')}</div>
                            </div>
                            <div style="margin-top: 14px; font-size: 11px; color: #ffd700; font-weight: 700; background: rgba(255,215,0,0.1); padding: 8px; border-radius:var(--lm-radius,6px);">
                                💡 ${_lmUE('lmx.ui.rankHigher')}
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:var(--lm-radius,6px); padding: 16px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 14px; color: ${t.mc}; margin-bottom: 12px;">🛍️ ${_lmUE('lmx.ui.buyPremiumPotions')}</div>
                                <div style="font-size: 12px; color: ${t.tc2}; margin-bottom: 16px;">
                                    ${_lmUE('lmx.ui.premiumPotionsInfo')}
                                </div>
                            </div>
                            <button class="btn" onclick="document.getElementById('lm-potions-help-modal').remove(); if(window.openShop) window.openShop('potions');" style="background: ${t.b2}; color: ${t.btc}; font-weight: 800; padding: 10px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">
                                ${_lmUE('lmx.ui.openShop')}
                            </button>
                        </div>
                    </div>
                `;
            } else if (tab === 'mystery') {
                return `
                    <div style="display: flex; gap: 16px; padding: 10px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:var(--lm-radius,6px); padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: #00e676; margin-bottom: 8px;">🔓 ${_lmUE('lmx.ui.unlockSkins')}</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.6;">
                                ${_lmUE('lmx.ui.unlockSkinsInfo')}
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:var(--lm-radius,6px); padding: 16px;">
                            <div style="font-weight: 800; font-size: 14px; color: #ffd700; margin-bottom: 8px;">⭐ ${_lmUE('lmx.ui.upgradeSkins')}</div>
                            <div style="font-size: 12px; color: ${t.tc}; line-height: 1.6;">
                                ${_lmUE('lmx.ui.upgradeSkinsInfo')}
                            </div>
                            <div style="margin-top: 10px; font-size: 11px; color: #00d3ff; font-weight: 700;">
                                ✨ ${_lmUE('lmx.ui.upgradedAnimations')}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                var rawItems = (window.PotionHelpConfig && window.PotionHelpConfig.length) ? window.PotionHelpConfig :
                              ((window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig["Visual - Potion Help"]) ||
                               (window.LMAgarGameConfiguration && window.LMAgarGameConfiguration.gameConfig && window.LMAgarGameConfiguration.gameConfig["Visual - Potion Help"]));
                
                var officialTiers = [
                    { id: 'common', name: _lmUE('lmx.ui.tierCommon'), color: '#4caf50', skin: 'x1', spec: '', coins: '💰 +', trophies: '🏆 x1' },
                    { id: 'rare', name: _lmUE('lmx.ui.tierRare'), color: '#00d3ff', skin: 'x3', spec: '', coins: '💰 ++', trophies: '🏆🏆 x2' },
                    { id: 'exotic', name: _lmUE('lmx.ui.tierExotic'), color: '#e91e63', skin: 'x4', spec: _lmUE('lmx.ui.atLeastSpecial', ['1']), coins: '💰 +++', trophies: '🏆🏆 x2' },
                    { id: 'mystical', name: _lmUE('lmx.ui.tierMystical'), color: '#ffb300', skin: 'x6', spec: _lmUE('lmx.ui.atLeastSpecial', ['3']), coins: '💰 ++++', trophies: '🏆🏆🏆 x3' }
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
                            var specText = (ph.minSpecialPieces && ph.minSpecialPieces !== '0') ? ` <span style="font-size: 10px; color: ${tObj.color}; font-weight: 800;">${_lmUE('lmx.ui.atLeastSpecial', [ph.minSpecialPieces])}</span>` : '';
                            var coinVal = (ph.coinText && ph.coinText !== 'na') ? ('💰 ' + window._lmEconomyEscape(ph.coinText)) : tObj.coins;
                            rowsHtml += `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius:var(--lm-radius,6px);">
                                    <div style="width: 120px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${tObj.color}; font-size: 13px;">
                                        🧪 ${tObj.name}
                                    </div>
                                    <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">
                                        ${ph.skinPieces ? window._lmEconomyEscape(ph.skinPieces) : tObj.skin}${specText}
                                    </div>
                                    <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">
                                        ${coinVal}
                                    </div>
                                    <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">
                                        ${tObj.trophies}
                                    </div>
                                    <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">
                                        ${_lmUE('lmx.ui.andMore')}
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
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius:var(--lm-radius,6px);">
                                <div style="width: 120px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${tier.color}; font-size: 13px;">🧪 ${tier.name}</div>
                                <div style="width: 170px; text-align: center; font-weight: 700; color: ${t.tc}; font-size: 12px;">${tier.skin}${specHtml}</div>
                                <div style="width: 90px; text-align: center; font-weight: 800; color: #ffd700; font-size: 12px;">${tier.coins}</div>
                                <div style="width: 90px; text-align: center; font-weight: 800; color: #ff9800; font-size: 12px;">${tier.trophies}</div>
                                <div style="width: 80px; text-align: right; font-size: 11px; color: ${t.tc2}; font-weight: 600;">${_lmUE('lmx.ui.andMore')}</div>
                            </div>
                        `;
                    }
                }

                return `
                    <div style="text-align: center; font-size: 13px; font-weight: 700; color: ${t.tc2}; margin-bottom: 14px;">
                        ${_lmUE('lmx.ui.potionRewardsIntro')}
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; font-size: 11px; font-weight: 800; color: ${t.tc2}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        <div style="width: 120px;">${_lmUE('lmx.ui.colPotions')}</div>
                        <div style="width: 170px; text-align: center;">${_lmUE('lmx.ui.colSkinPieces')}</div>
                        <div style="width: 90px; text-align: center;">${_lmUE('lmx.ui.colCoins')}</div>
                        <div style="width: 90px; text-align: center;">${_lmUE('lmx.ui.colTrophies')}</div>
                        <div style="width: 80px; text-align: right;"></div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${rowsHtml}
                    </div>
                `;
            }
        };

        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc}; width: 640px;">
                <div class="lm-modal-header" style="background: ${t.pc2}; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 18px; font-weight: 900; color: ${t.mc}; text-transform: uppercase; letter-spacing: 1px;">${_lmUE('help')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(0,211,255,0.15); border: 1px solid #00d3ff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; color: #00d3ff;">
                            🧬 ${dnaBalance.toLocaleString()}
                        </div>
                        <div style="background: rgba(255,215,0,0.15); border: 1px solid #ffd700; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; color: #ffd700;">
                            💰 ${coinsBalance.toLocaleString()}
                        </div>
                        <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" onclick="document.getElementById('lm-potions-help-modal').remove();">&times;</button>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; padding: 12px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05); justify-content: center;">
                    <button id="lm-tab-howto" class="btn" style="flex: 1; padding: 8px; border-radius:var(--lm-radius,6px); font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='howto'?t.b2:'transparent'}; color: ${currentTab==='howto'?t.btc:t.tc};">${_lmUE('lmx.ui.howToGetPotions')}</button>
                    <button id="lm-tab-rewards" class="btn" style="flex: 1; padding: 8px; border-radius:var(--lm-radius,6px); font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='rewards'?t.b2:'transparent'}; color: ${currentTab==='rewards'?t.btc:t.tc};">${_lmUE('lmx.ui.rewards')}</button>
                    <button id="lm-tab-mystery" class="btn" style="flex: 1; padding: 8px; border-radius:var(--lm-radius,6px); font-weight: 800; font-size: 12px; cursor: pointer; border: 2px solid ${t.b2}; background: ${currentTab==='mystery'?t.b2:'transparent'}; color: ${currentTab==='mystery'?t.btc:t.tc};">${_lmUE('lmx.ui.mysterySkins')}</button>
                </div>

                <div id="lm-potions-help-body" class="lm-modal-body" style="padding: 16px;">
                    ${buildBodyContent(currentTab)}
                </div>

                <div style="padding: 12px 20px; text-align: center; background: ${t.pc2}; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="btn" onclick="document.getElementById('lm-potions-help-modal').remove();" style="background: ${t.b1}; color: ${t.btc}; font-weight: 800; padding: 8px 24px; border-radius:var(--lm-radius,6px); border: none; cursor: pointer;">${_lmUE('close')}</button>
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
                    '<b>[' + _lmUE('lmx.ui.tagOffer') + ']:</b> ' + _lmUE('lmx.ui.offerLogin')
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
                        '<b>[' + _lmUE('lmx.ui.tagOffer') + ']:</b> ' + _lmUE('lmx.ui.offerCallbackFailed')
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
                '<b>[' + _lmUE('lmx.ui.tagOffer') + ']:</b> ' + _lmUE('lmx.ui.offerNotYet')
            );
        }

        return false;
    };

    window.showDailyDealsCarouselModal = function() {
        return window.openDailyDealsModal();
    };

    window.showShopModal = function() {
        if (window._lmRoomShopOff && window._lmRoomShopOff()) return false;
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
                name: _lmUE('lmx.ui.coins'),
                bannerColor: '#7cb342',
                gradient: 'linear-gradient(180deg, #8bc34a 0%, #689f38 100%)', // i18n-ok: CSS, not text
                icon: '🪙',
                bgGraphic: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,160,0,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
                    else if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
                }
            },
            {
                id: 'dna',
                name: _lmUE('lmx.ui.dna'),
                bannerColor: '#8bc34a',
                gradient: 'linear-gradient(180deg, #9ccc65 0%, #7cb342 100%)', // i18n-ok: CSS, not text
                icon: '🧬',
                bgGraphic: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(0,230,118,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.SpecialDeals === 'function') window.SpecialDeals('deals');
                    else if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
                }
            },
            {
                id: 'flasks',
                name: _lmUE('lmx.ui.premiumPotions'),
                bannerColor: '#e91e63',
                gradient: 'linear-gradient(180deg, #ec407a 0%, #c2185b 100%)', // i18n-ok: CSS, not text
                icon: '🧪',
                bgGraphic: 'linear-gradient(135deg, rgba(233,30,99,0.2) 0%, rgba(156,39,176,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showPremiumPotionsModal === 'function') window.showPremiumPotionsModal();
                    else if (typeof window.showPotionsHelpModal === 'function') window.showPotionsHelpModal('rewards');
                }
            },
            {
                id: 'skins',
                name: _lmUE('agario.page_main_menu_skins'),
                bannerColor: '#fbc02d',
                gradient: 'linear-gradient(180deg, #fdd835 0%, #f57f17 100%)', // i18n-ok: CSS, not text
                icon: '🎭',
                bgGraphic: 'linear-gradient(135deg, rgba(255,193,7,0.2) 0%, rgba(255,87,34,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '', /* was a fixed "1" (no real count behind it) */
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.BeforeSpecialDeals === 'function') window.BeforeSpecialDeals();
                    else if (typeof window.SpecialDeals === 'function') window.SpecialDeals('skins');
                }
            },
            {
                id: 'mass',
                name: _lmUE('lmx.ui.massBoost'),
                bannerColor: '#f57c00',
                gradient: 'linear-gradient(180deg, #ff9800 0%, #e65100 100%)', // i18n-ok: CSS, not text
                icon: 'Ⓜ️',
                bgGraphic: 'linear-gradient(135deg, rgba(0,176,255,0.2) 0%, rgba(41,121,255,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showMassBoostModal === 'function') window.showMassBoostModal();
                    else if (typeof window.initBoostDropdown === 'function') window.initBoostDropdown();
                }
            },
            {
                id: 'xp',
                name: _lmUE('lmx.ui.xpBoost'),
                bannerColor: '#00bcd4',
                gradient: 'linear-gradient(180deg, #26c6da 0%, #00838f 100%)', // i18n-ok: CSS, not text
                icon: '⭐',
                bgGraphic: 'linear-gradient(135deg, rgba(255,235,59,0.2) 0%, rgba(255,152,0,0.4) 100%)', // i18n-ok: CSS, not text
                badge: '',
                action: function() {
                    document.getElementById('lm-main-shop-modal').remove();
                    if (typeof window.showXPBoostModal === 'function') window.showXPBoostModal();
                    else if (typeof window.initBoostDropdown === 'function') window.initBoostDropdown();
                }
            },
            {
                id: 'rush',
                name: _lmUE('lmx.ui.rushBoost'),
                bannerColor: '#d84315',
                gradient: 'linear-gradient(180deg, #ff7043 0%, #d84315 100%)', // i18n-ok: CSS, not text
                icon: '🚀',
                bgGraphic: 'linear-gradient(135deg, rgba(255,87,34,0.2) 0%, rgba(230,74,25,0.4) 100%)', // i18n-ok: CSS, not text
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
                <div id="shop-card-${cat.id}" onclick="window.onShopCategoryClick('${cat.id}');" style="position: relative; height: 135px; border-radius:var(--lm-radius,6px); overflow: hidden; border: 2px solid rgba(255,255,255,0.3); background: ${cat.bgGraphic}; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between;">
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
            <div class="lm-modal-container" style="background: ${t.pc}; border-radius:var(--lm-radius,6px); width: 660px; padding: 0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6); border: 1px solid ${t.pc2}; border-top: 3px solid ${t.mc};">
                <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${t.pc2}; background: linear-gradient(180deg, ${t.pc2} 0%, ${t.pc} 100%);">
                    <div style="font-size: 20px; font-weight: 900; color: ${t.mc}; letter-spacing: 1px; text-transform: uppercase;">${_lmUE('shop')}</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: rgba(0,0,0,0.3); border: 2px solid #8bc34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #8bc34a; display: flex; align-items: center; gap: 6px;">
                            <span>🧬 ${dnaBalance.toLocaleString()}</span>
                            <span role="button" title="${_lmUE('lmx.ui.getMore')}" onclick="var m=document.getElementById('lm-main-shop-modal'); if (m) m.remove(); if (window.openShop) window.openShop('dna');" style="background: #8bc34a; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 2px solid #fbc02d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 800; color: #fbc02d; display: flex; align-items: center; gap: 6px;">
                            <span>💰 ${coinsBalance.toLocaleString()}</span>
                            <span role="button" title="${_lmUE('lmx.ui.getMore')}" onclick="var m=document.getElementById('lm-main-shop-modal'); if (m) m.remove(); if (window.openShop) window.openShop('coins');" style="background: #fbc02d; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; cursor: pointer;">+</span>
                        </div>
                        <button onclick="document.getElementById('lm-main-shop-modal').remove();" style="background: rgba(255,255,255,0.05); border: none; font-size: 22px; color: ${t.tc2}; cursor: pointer; font-weight: 400; margin-left: 8px; width: 28px; height: 28px; border-radius:var(--lm-radius,6px); display: flex; align-items: center; justify-content: center;">&times;</button>
                    </div>
                </div>

                <div style="padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: rgba(0,0,0,0.15);">
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
        var t = getTheme();

        var info = typeof window.getAgarPremiumPotionInfo === 'function'
            ? window.getAgarPremiumPotionInfo(potionType) : null;

        if (!info) {
            if (window.toastr) toastr.warning('<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.potionConfigNotYet'));
            return false;
        }

        var productId = String(info.productId || '');
        var baseName = productId.replace(/^potion_/i, '').replace(/_/g, ' ')
            .replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        var name = _lmUE('lmx.ui.namedPotion', [baseName]);

        var tierColors = {
            potion_superior: '#4caf50', potion_epic: '#00bcd4',
            potion_legendary: '#e91e63', potion_mythical: '#ffb300'
        };
        var potionColor = tierColors[productId] || '#00bcd4';

        var coinText = info.coinText ? window._lmEconomyEscape(info.coinText) : '\u2014';
        var skinPiecesText = info.skinPieces > 0 ? ('x' + window._lmEconomyEscape(info.skinPieces)) : '\u2014';
        var specialPiecesText = info.minSpecialPieces > 0
            ? _lmUE('lmx.ui.specialPieces', [info.minSpecialPieces]) : '';

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
            ? '<div style="background:' + t.pc2 + ';border-radius:var(--lm-radius,6px);padding:10px 16px;margin-bottom:12px;border:1px solid rgba(255,255,255,.1);text-align:center;">' +
                '<div style="font-size:11px;font-weight:700;color:' + t.tc2 + ';text-transform:uppercase;margin-bottom:4px;">' + _lmUE('lmx.ui.atLeast') + '</div>' +
                '<div style="font-size:16px;font-weight:900;color:#f57f17;display:flex;align-items:center;justify-content:center;gap:8px;">' +
                    '<span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:3px solid #ffb300;background:rgba(255,179,0,0.15);"></span>' +
                    '<span>' + specialPiecesText + '</span></div></div>' : '';

        modal.innerHTML =
            '<div class="lm-modal-container" style="background:' + t.pc + ';border-radius:var(--lm-radius,6px);width:440px;padding:24px;position:relative;box-shadow:0 12px 48px rgba(0,0,0,.5);text-align:center;border:1px solid ' + t.pc2 + ';border-top:3px solid ' + t.mc + ';">' + // i18n-ok: CSS, not text
                '<button type="button" onclick="document.getElementById(\'lm-potion-detail-modal\').remove();" style="position:absolute;right:16px;top:16px;background:rgba(255,255,255,.05);border:none;font-size:22px;color:' + t.tc2 + ';cursor:pointer;font-weight:400;width:28px;height:28px;border-radius:var(--lm-radius,6px);display:flex;align-items:center;justify-content:center;">&times;</button>' +
                '<div style="font-size:22px;font-weight:900;color:' + t.mc + ';margin-bottom:16px;">' + name + '</div>' +
                '<div style="background:' + t.pc2 + ';border-radius:var(--lm-radius,6px);padding:20px;margin-bottom:18px;">' +
                    '<div style="width:90px;height:90px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:42px;background:radial-gradient(circle,' + potionColor + '22,' + potionColor + '44);border:3px solid ' + potionColor + ';box-shadow:0 4px 12px rgba(0,0,0,.12);">\uD83E\uDDEA</div>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
                    '<div style="display:flex;justify-content:center;gap:20px;margin-bottom:12px;">' +
                        '<div style="text-align:center;"><div style="font-size:11px;font-weight:700;color:' + t.tc2 + ';text-transform:uppercase;">' + _lmUE('lmx.ui.coins') + '</div><div style="font-size:16px;font-weight:900;color:' + t.tc + ';">' + coinText + '</div></div>' +
                        '<div style="text-align:center;"><div style="font-size:11px;font-weight:700;color:' + t.tc2 + ';text-transform:uppercase;">' + _lmUE('lmx.ui.skinPieces') + '</div><div style="font-size:16px;font-weight:900;color:' + t.tc + ';">' + skinPiecesText + '</div></div>' +
                    '</div>' + specialHtml +
                '</div>' +
                '<div style="font-size:13px;font-weight:700;color:' + t.tc2 + ';margin-bottom:8px;">' + _lmUE('lmx.ui.priceIs', [priceText]) + '</div>' +
            '</div>';

        document.body.appendChild(modal);
        return true;
    };


    window.showPremiumPotionsModal = function () {
        if (window._lmRoomShopOff && window._lmRoomShopOff()) return false;
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
            potion_superior:  { bg: 'rgba(76,175,80,0.12)', border: '#4caf50', gradient: 'linear-gradient(180deg,#66bb6a,#388e3c)' },
            potion_epic:      { bg: 'rgba(0,188,212,0.12)', border: '#00bcd4', gradient: 'linear-gradient(180deg,#26c6da,#00838f)' },
            potion_legendary: { bg: 'rgba(233,30,99,0.12)', border: '#e91e63', gradient: 'linear-gradient(180deg,#ec407a,#c2185b)' },
            potion_mythical:  { bg: 'rgba(255,179,0,0.12)', border: '#ffb300', gradient: 'linear-gradient(180deg,#ffca28,#ff8f00)' }
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
                    '<button onclick="document.getElementById(\'lm-premium-potions-modal\').remove(); if(window.showShopModal) window.showShopModal();" style="width:32px;height:32px;border-radius:50%;background:#00d3ff;color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;" title="' + _lmUE('lmx.ui.backToShop') + '">\u2039</button>' +
                    '<div style="font-size:22px;font-weight:900;color:' + t.tc1 + ';">' + _lmUE('lmx.ui.premiumPotions') + '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;">' +
                    '<div style="background:' + t.cardBg + ';border:2px solid #8bc34a;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:800;color:#558b2f;">\uD83E\uDDEC ' + dnaBalance.toLocaleString() + '</div>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
                    '<div style="background:' + t.cardBg + ';border:2px solid #fbc02d;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:800;color:#f57f17;">\uD83D\uDCB0 ' + coinsBalance.toLocaleString() + '</div>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
                    '<button onclick="document.getElementById(\'lm-premium-potions-modal\').remove();" style="background:none;border:none;font-size:24px;color:' + t.tc2 + ';cursor:pointer;font-weight:900;margin-left:8px;">&times;</button>' +
                '</div>' +
            '</div>';

        var infoBarHtml = '<div style="margin:16px 20px 0;background:' + t.panelBg + ';border-radius:var(--lm-radius,6px);padding:12px;text-align:center;font-size:13px;font-weight:700;color:' + t.tc2 + ';">' + _lmUE('lmx.ui.potionsOpenNow') + '</div>';

        var cardsHtml = '';

        if (catalog.length === 0) {
            cardsHtml = '<div style="padding:35px;text-align:center;color:' + t.tc2 + ';font-size:14px;width:100%;">' + _lmUE('lmx.ui.noPotionCatalogue') + '</div>';
        } else {
            catalog.forEach(function (info) {
                var pid = info.productId;
                var colors = tierColors[pid] || { bg: 'rgba(150,150,150,0.1)', border: '#999', gradient: 'linear-gradient(180deg,#bbb,#888)' };

                var priceText = (info.price !== null && info.price !== undefined)
                    ? (typeof window.formatAgarCurrency === 'function'
                        ? window.formatAgarCurrency(info.price, info.currency)
                        : (String(info.price) + (info.currency ? (' ' + info.currency) : '')))
                    : _lmUE('lmx.ui.unavailable');

                var baseName = pid.replace(/^potion_/i, '').replace(/_/g, ' ')
                    .replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });

                var _ppCanAfford = info.purchaseId && info.price != null
                    ? (window._lmGetCurrencyBalance(info.currency) >= Number(info.price))
                    : true;
                var buyDisabled = !info.purchaseId
                    ? ' disabled'
                    : (!_ppCanAfford
                        ? ' disabled'
                        : '');

                cardsHtml +=
                    '<div style="position:relative;flex:1;min-width:140px;max-width:180px;border-radius:var(--lm-radius,6px);padding:16px 12px;border:2px solid ' + colors.border + ';background:' + colors.bg + ';display:flex;flex-direction:column;align-items:center;text-align:center;">' +
                        '<button class="lm-premium-potion-info" data-product-id="' + window._lmEconomyEscape(pid) + '" style="position:absolute;right:8px;top:8px;width:22px;height:22px;border-radius:50%;background:#00d3ff;color:#fff;border:none;font-weight:900;cursor:pointer;font-size:12px;" title="' + _lmUE('lmx.ui.potionInfo') + '">?</button>' +
                        '<div style="width:80px;height:80px;border-radius:50%;margin:8px 0 10px;display:flex;align-items:center;justify-content:center;font-size:38px;background:radial-gradient(circle,' + colors.border + '22,' + colors.border + '44);border:3px solid ' + colors.border + ';box-shadow:0 4px 12px rgba(0,0,0,.12);">\uD83E\uDDEA</div>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
                        '<div style="font-size:15px;font-weight:900;color:' + t.tc + ';margin-bottom:4px;">' + window._lmEconomyEscape(baseName) + '</div>' +
                        '<button class="btn lm-buy-premium-potion" data-product-id="' + window._lmEconomyEscape(pid) + '" style="background:' + colors.gradient + ';color:#fff;font-weight:900;font-size:14px;padding:10px 0;border-radius:var(--lm-radius,6px);border:none;' + (buyDisabled ? 'opacity:.45;cursor:not-allowed;filter:grayscale(40%);' : 'cursor:pointer;') + 'width:100%;margin-top:auto;box-shadow:0 3px 8px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;gap:6px;"' + buyDisabled + '>' + priceText + '</button>' +
                    '</div>';
            });
        }

        modal.innerHTML =
            '<div class="lm-modal-container" style="background:' + t.bg + ';border-radius:var(--lm-radius,6px);width:720px;max-width:94vw;padding:0;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5);border:1px solid ' + t.border + ';border-top:3px solid ' + t.mc + ';">' + // i18n-ok: CSS, not text
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
            var infoBtn = e.target.closest('.lm-premium-potion-info');
            if (infoBtn) {
                if (window.showPotionDetailModal) {
                    window.showPotionDetailModal(infoBtn.getAttribute('data-product-id') || '');
                }
                return;
            }
            var btn = e.target.closest('.lm-buy-premium-potion');
            if (!btn || btn.disabled) return;

            var productId = String(btn.getAttribute('data-product-id') || '').trim();
            if (!productId || typeof window.buyAgarPremiumPotion !== 'function') return;

            /* Re-resolve from GameConfiguration */
            var potionInfo = typeof window.getAgarPremiumPotionInfo === 'function'
                ? window.getAgarPremiumPotionInfo(productId) : null;

            if (!potionInfo || !potionInfo.purchaseId) {
                if (window.toastr) toastr.warning('<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.purchaseConfigUnavailable'));
                return false;
            }

            var purchaseId = String(potionInfo.purchaseId).trim();

            /* Correct key: e.g. 1_potion_mythical */
            if (typeof window._lmHasPendingSoftPurchase === 'function' &&
                window._lmHasPendingSoftPurchase(purchaseId)) {
                if (window.toastr) toastr.info('<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.purchasePending'));
                return false;
            }

            var originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.style.opacity = '.55';
            btn.style.cursor = 'not-allowed';
            btn.textContent = _lmUR('lmx.ui.buying');

            var restorePotionBtn = function () {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.innerHTML = originalHtml;
            };
            var sent = window.buyAgarPremiumPotion(productId);
            if (!sent) {
                restorePotionBtn();
            } else {
                window._lmRestoreWhenPurchaseSettled(purchaseId, restorePotionBtn);
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
            if (window._lmRoomShopOff && window._lmRoomShopOff()) return false;
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

            /*
             * Sort by official Shop - Boost Categories position,
             * then multiplier, then duration.
             */
            catalog.sort(function (a, b) {
                var pa = (a.categoryPosition != null) ? a.categoryPosition : 99;
                var pb = (b.categoryPosition != null) ? b.categoryPosition : 99;
                if (pa !== pb) return pa - pb;
                if (a.multiplier !== b.multiplier) return a.multiplier - b.multiplier;
                return (a.durationMins || 0) - (b.durationMins || 0);
            });

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
            back.title = _lmUR('lmx.ui.backToShop');
            back.style.cssText =
                'width:32px;height:32px;border-radius:50%;background:#00d3ff;' +
                'color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;';
            back.onclick = function () {
                modal.remove();
                if (typeof window.showShopModal === 'function') window.showShopModal();
            };

            var heading = document.createElement('div');
            heading.style.cssText = 'font-size:22px;font-weight:900;color:' + t.tc1 + ';';
            heading.textContent = boostType === 'xp' ? _lmUR('lmx.ui.xpBoost') : _lmUR('lmx.ui.startingMassBoost');

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
                empty.textContent = _lmUR('lmx.ui.noBoostCatalogue');
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
                        : _lmUR('lmx.ui.durM', [info.durationMins]);

                    var priceText = (info.price !== null && info.price !== undefined)
                        ? (typeof window.formatAgarCurrency === 'function'
                            ? window.formatAgarCurrency(info.price, info.currency)
                            : (info.price + ' ' + (info.currency || '')))
                        : _lmUR('lmx.ui.unavailable');

                    var card = document.createElement('div');
                    card.style.cssText =
                        'position:relative;background:' + t.cardBg + ';' +
                        'border-radius:var(--lm-radius,6px);padding:17px;' +
                        'border:1px solid ' + t.border + ';' +
                        'display:flex;flex-direction:column;min-height:215px;';

                    /* Attach official category metadata */
                    card.dataset.productId = info.productId || '';
                    if (info.categoryTitle) card.dataset.categoryTitle = info.categoryTitle;
                    if (info.categoryDescription) card.dataset.categoryDescription = info.categoryDescription;
                    if (info.categoryImage) card.dataset.categoryImage = info.categoryImage;
                    if (info.categoryPosition != null) card.dataset.categoryPosition = info.categoryPosition;

                    if (info.bestDeal) {
                        var bestTag = document.createElement('div');
                        bestTag.textContent = '\u2605 ' + _lmUR('lmx.ui.best');
                        bestTag.style.cssText =
                            'position:absolute;top:10px;left:10px;' +
                            'background:#ff9800;color:#fff;padding:3px 7px;' +
                            'border-radius:var(--lm-radius,6px);font-size:9px;font-weight:900;';
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
                    title.textContent = _lmUR(info.type === 'xp' ? 'lmx.ui.boostXp' : 'lmx.ui.boostMass', [info.multiplier]);
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
                    ownedEl.textContent = _lmUR('lmx.ui.ownedCount', [owned]);
                    ownedEl.dataset.productId = info.productId;
                    ownedEl.className = 'lm-boost-owned-label';
                    card.appendChild(ownedEl);

                    var actions = document.createElement('div');
                    actions.style.cssText =
                        'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:auto;';

                    var buyBtn = document.createElement('button');
                    buyBtn.type = 'button';
                    buyBtn.style.cssText =
                        'border:0;border-radius:var(--lm-radius,6px);padding:8px 6px;font-size:12px;' +
                        'font-weight:900;cursor:pointer;' +
                        'background:linear-gradient(180deg,#8bc34a,#689f38);color:#fff;';
                    buyBtn.textContent = _lmUR('lmx.ui.buyPrice', [priceText]);

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
                                if (window.toastr) toastr.info(_lmUE('lmx.ui.purchasePending'));
                                return false;
                            }

                            btn.disabled = true;
                            btn.textContent = _lmUR('lmx.ui.buying');

                            var restoreBoostBtn = function () {
                                btn.disabled = false;
                                btn.textContent = _lmUR('lmx.ui.buyPrice', [capturedPriceText]);
                            };
                            var sent = window.buyConfiguredBoost(capturedInfo.productId);
                            if (!sent) {
                                restoreBoostBtn();
                            } else {
                                window._lmRestoreWhenPurchaseSettled(capturedInfo.purchaseId, restoreBoostBtn);
                            }

                            return false;
                        };
                    })(info, priceText, buyBtn);

                    var useBtn = document.createElement('button');
                    useBtn.type = 'button';
                    useBtn.style.cssText =
                        'border:0;border-radius:var(--lm-radius,6px);padding:8px 6px;font-size:12px;' +
                        'font-weight:900;cursor:pointer;' +
                        'background:linear-gradient(180deg,#29b6f6,#0288d1);color:#fff;';
                    useBtn.textContent = _lmUR('lmx.ui.use');

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
                                    toastr.warning('<b>[' + _lmUE('lmx.ui.tagBoost') + ']:</b> ' + _lmUE('lmx.ui.boostNotOwned'));
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
            backBtn.title = _lmUR('lmx.ui.backToShop');
            backBtn.style.cssText =
                'width:32px;height:32px;border-radius:50%;background:#ff5722;' +
                'color:#fff;border:none;font-weight:900;font-size:18px;cursor:pointer;';
            backBtn.onclick = function () {
                modal.remove();
                if (typeof window.showShopModal === 'function') window.showShopModal();
            };

            var headingEl = document.createElement('div');
            headingEl.style.cssText = 'font-size:22px;font-weight:900;color:' + t.tc1 + ';';
            headingEl.textContent = _lmUR('lmx.ui.rushBoost');

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
                emptyEl.textContent = _lmUR('lmx.ui.noRushCatalogue');
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
                        : _lmUR('lmx.ui.unavailable');

                    var card = document.createElement('div');
                    card.style.cssText =
                        'position:relative;background:' + t.cardBg + ';' +
                        'border-radius:var(--lm-radius,6px);padding:17px;' +
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
                    titleEl.textContent = _lmUR('lmx.ui.rushStartingMass', [info.addition]);
                    card.appendChild(titleEl);

                    var ownedLabel = document.createElement('div');
                    ownedLabel.style.cssText =
                        'text-align:center;font-size:11px;font-weight:800;' +
                        'color:' + t.tc2 + ';margin:8px 0;';
                    ownedLabel.textContent = _lmUR('lmx.ui.ownedCount', [owned]);
                    ownedLabel.dataset.productId = info.productId;
                    ownedLabel.className = 'lm-rush-owned-label';
                    card.appendChild(ownedLabel);

                    var posLabel = document.createElement('div');
                    posLabel.style.cssText =
                        'text-align:center;font-size:10px;color:' + t.tc2 + ';margin-bottom:6px;';
                    posLabel.textContent = info.position
                        ? _lmUR('lmx.ui.positionIs', [info.position])
                        : '';
                    card.appendChild(posLabel);

                    var buyRush = document.createElement('button');
                    buyRush.type = 'button';
                    buyRush.style.cssText =
                        'border:0;border-radius:var(--lm-radius,6px);padding:10px 6px;font-size:13px;' +
                        'font-weight:900;cursor:pointer;width:100%;margin-top:auto;' +
                        'background:linear-gradient(180deg,#ff7043,#d84315);color:#fff;';
                    buyRush.textContent = _lmUR('lmx.ui.buyPrice', [priceText]);

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
                                if (window.toastr) toastr.info(_lmUE('lmx.ui.purchasePending'));
                                return false;
                            }

                            btn.disabled = true;
                            btn.textContent = _lmUR('lmx.ui.buying');

                            var restoreRushBtn = function () {
                                btn.disabled = false;
                                btn.textContent = _lmUR('lmx.ui.buyPrice', [capturedPriceText]);
                            };
                            var sent = window.buyAgarRushBoost(capturedInfo.productId);
                            if (!sent) {
                                restoreRushBtn();
                            } else {
                                window._lmRestoreWhenPurchaseSettled(capturedInfo.purchaseId, restoreRushBtn);
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
    // Header balances and BUY affordability are computed at render time.
    document.addEventListener('lm-premium-potion-purchase-finished', function () {
        if (document.getElementById('lm-premium-potions-modal') &&
            typeof window.showPremiumPotionsModal === 'function') {
            window.showPremiumPotionsModal();
        }
    });


    window.openShop = function (cat) {
        if (window._lmRoomShopOff && window._lmRoomShopOff()) return false;
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

    /*
     * This definition replaces the official-field one above (userId, status,
     * realmInfo from opcode 147). Keep its login checks, then delegate to it;
     * the legacy renderer below read fields the friend proto never has.
     */
    var _lmOfficialFriendsModal = window.showFriendsModal;
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
            alert(_lmUR('lmx.ui.friendsLoginAlert'));
            if (window.toastr) toastr.error('<b>[' + _lmUE('lmx.ui.tagFriendsUpper') + ']:</b> ' + _lmUE('lmx.ui.friendsLogin'));
            return;
        }
        if (!isLoggedIn) {
            if (window.toastr) toastr.error('<b>[' + _lmUE('lmx.ui.tagFriendsUpper') + ']:</b> ' + _lmUE('lmx.ui.friendsLogin'));
            return;
        }
        if (!isFacebookLoggedIn) {
            if (window.toastr) toastr.error('<b>[' + _lmUE('lmx.ui.tagFriendsUpper') + ']:</b> ' + _lmUE('lmx.ui.friendsNeedFb'));
            return;
        }
        if (!hasServerConnection) {
            if (window.toastr) toastr.error('<b>[' + _lmUE('lmx.ui.tagFriendsUpper') + ']:</b> ' + _lmUE('lmx.ui.friendsNoServer'));
            return;
        }

        if (typeof _lmOfficialFriendsModal === 'function') {
            return _lmOfficialFriendsModal();
        }

        injectStyles();
        var t = getTheme();
        var old = document.getElementById('lm-friends-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-friends-modal';
        modal.className = 'lm-modal-overlay';
        modal.innerHTML = `
            <div class="lm-modal-container" style="background: ${t.pc};">
                <div class="lm-modal-header" style="background: ${t.pc2};">
                    <div class="lm-modal-title" style="color: ${t.b1};">
                        <span>👥</span> ${_lmUE('lmx.ui.friendsPartyRooms')}
                    </div>
                    <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" onclick="document.getElementById('lm-friends-modal').remove();">&times;</button>
                </div>
                <div class="lm-modal-body" id="lm-friends-body">
                    <div style="text-align: center; padding: 30px; color: ${t.tc2};">
                        <i class="fa fa-spinner fa-spin fa-2x" data-lm-syncing="1"></i><br><br>${_lmUE('lmx.ui.syncingFriends')}
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
            if (body && body.querySelector('[data-lm-syncing]')) {
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
                var name = friend.displayName || friend.name || _lmUR('lmx.ui.friend');
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
                    btn.style.cssText = 'background: ' + t.b1 + '; color: ' + t.btc + '; padding: 4px 12px; border-radius:var(--lm-radius,6px); font-weight: 700; border: none; cursor: pointer;';
                    btn.textContent = '🎮 ' + _lmUR('lmx.ui.joinParty');
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
                    copyInviteBtn.style.cssText = 'background:' + t.b3 + ';color:' + t.btc + ';padding:4px 10px;border-radius:var(--lm-radius,6px);font-weight:700;border:none;cursor:pointer;font-size:11px;';
                    copyInviteBtn.textContent = '\uD83D\uDD17 ' + _lmUR('lmx.ui.copy');
                    copyInviteBtn.title = _lmUR('lmx.ui.copyPartyLinkTitle');
                    copyInviteBtn.onclick = function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var inviteUrl = typeof window.buildAgarPartyInviteUrl === 'function'
                            ? window.buildAgarPartyInviteUrl(partyToken) : '';

                        if (!inviteUrl) {
                            if (window.toastr) toastr.warning('<b>[' + _lmUE('lmx.ui.tagParty') + ']:</b> ' + _lmUE('lmx.ui.partyInviteFailed'));
                            return false;
                        }

                        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                            navigator.clipboard.writeText(inviteUrl).then(function () {
                                if (window.toastr) toastr.success('<b>[' + _lmUE('lmx.ui.tagParty') + ']:</b> ' + _lmUE('lmx.ui.inviteCopied'));
                            }).catch(function () {
                                window.prompt(_lmUR('lmx.ui.copyPartyPrompt'), inviteUrl);
                            });
                            return false;
                        }

                        window.prompt(_lmUR('lmx.ui.copyPartyPrompt'), inviteUrl);
                        return false;
                    };
                    rightBox.appendChild(copyInviteBtn);
                } else {
                    var statusSpan = document.createElement('span');
                    statusSpan.style.cssText = 'font-size: 12px; color: ' + t.tc2 + ';';
                    statusSpan.textContent = isOnline ? _lmUR('lmx.ui.inLobby') : _lmUR('lmx.ui.offline');
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
            var text1 = document.createTextNode(_lmUR('lmx.ui.noOnlineFriends'));
            var br2 = document.createElement('br');
            var text2 = document.createTextNode(_lmUR('lmx.ui.signInForFriends'));

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

    /*
     * ═════════════════════════════════════════════════════════════════════
     * GLOBAL LM MODAL CLOSE ROUTING
     * ═════════════════════════════════════════════════════════════════════
     *
     * Ordinary LM modal:
     *
     *      same behaviour as before.
     *
     * Queue-owned modal:
     *
     *      invoke its close callback so the queue can finalize the active
     *      entry and display the next configured popup.
     *
     * We DO NOT hook or replace Agar.io/Haxe's native popup manager here.
     */
    $(document)
        .off(
            'click.lmModal',
            '.lm-modal-overlay'
        )
        .on(
            'click.lmModal',
            '.lm-modal-overlay',
            function (
                e
            ) {
                /*
                 * Only clicking the dark backdrop closes the modal.
                 * Clicking inside the modal must never bubble into close.
                 */
                if (
                    e.target !==
                    this
                ) {
                    return;
                }


                var overlay =
                    this;


                if (
                    typeof overlay
                        ._lmCloseCallback ===
                        'function'
                ) {
                    try {
                        overlay
                            ._lmCloseCallback(
                                'backdrop'
                            );
                    } catch (
                        closeError
                    ) {
                        console.error(
                            '[LM MODAL] Queue close callback failed:',
                            closeError
                        );


                        /*
                         * Fail closed: never leave a dead modal covering the UI.
                         */
                        $(overlay)
                            .remove();
                    }


                    return;
                }


                /*
                 * Legacy / non-queued LM modal.
                 */
                $(overlay)
                    .remove();
            }
        );


    $(document)
        .off(
            'keydown.lmModal'
        )
        .on(
            'keydown.lmModal',
            function (
                e
            ) {
                if (
                    e.which !==
                        27 &&
                    e.key !==
                        'Escape'
                ) {
                    return;
                }


                /*
                 * A queue-owned popup gets first refusal.
                 *
                 * Search newest/topmost overlay first.
                 */
                var overlays =
                    $(
                        '.lm-modal-overlay'
                    )
                        .toArray()
                        .reverse();


                for (
                    var overlayIndex = 0;
                    overlayIndex <
                        overlays.length;
                    overlayIndex++
                ) {
                    var overlay =
                        overlays[
                            overlayIndex
                        ];


                    if (
                        !overlay ||
                        typeof overlay
                            ._lmCloseCallback !==
                            'function'
                    ) {
                        continue;
                    }


                    try {
                        overlay
                            ._lmCloseCallback(
                                'escape'
                            );
                    } catch (
                        queueEscapeError
                    ) {
                        console.error(
                            '[LM MODAL] Queue ESC close failed:',
                            queueEscapeError
                        );


                        $(overlay)
                            .remove();
                    }


                    return;
                }


                /*
                 * Preserve the old behaviour for ordinary LM modals:
                 *
                 *      ESC removes the topmost overlay (it used to remove all of them,
                 *      closing e.g. Leagues under Weekly Results too).
                 */
                $(
                    '.lm-modal-overlay'
                )
                    .last()
                    .remove();
            }
        );


    /*
     * ═════════════════════════════════════════════════════════════════════
     * LM CONFIG-AWARE POPUP QUEUE
     * ═════════════════════════════════════════════════════════════════════
     *
     * VERY IMPORTANT:
     *
     * This is NOT Agar.io's native Haxe popup queue.
     *
     * It does NOT:
     *
     *      - intercept Core.ui popup creation
     *      - suppress native Agar.io popups
     *      - fabricate popup IDs
     *      - fabricate Haxe state IDs
     *      - infer a popup's meaning from its numeric ID
     *
     * It exists only for LM-owned popups that explicitly opt in by calling:
     *
     *      enqueueAgarConfigPopup(...)
     *
     * If the caller knows BOTH the official popupId and official stateId,
     * then "Visual - Popup Priorities" can order those LM popup requests.
     */


    window._lmConfigPopupQueue =
        window
            ._lmConfigPopupQueue ||
        [];


    window._lmConfigPopupActive =
        window
            ._lmConfigPopupActive ||
        null;


    window._lmConfigPopupSequence =
        Number(
            window
                ._lmConfigPopupSequence
        ) ||
        0;


    window._lmConfigPopupObserver =
        window
            ._lmConfigPopupObserver ||
        null;


    window._lmConfigPopupMutationScheduled =
        false;


    /*
     * ─────────────────────────────────────────────────────────────────────
     * EVENT DISPATCH HELPER
     * ─────────────────────────────────────────────────────────────────────
     */
    window._lmDispatchConfigPopupEvent =
        function (
            eventName,
            detail
        ) {
            try {
                document
                    .dispatchEvent(
                        new CustomEvent(
                            eventName,
                            {
                                detail:
                                    detail
                            }
                        )
                    );
            } catch (
                eventError
            ) {
                /*
                 * Popup functionality must never depend on CustomEvent support.
                 */
            }
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * RESOLVE CONFIGURED PRIORITY
     * ─────────────────────────────────────────────────────────────────────
     *
     * State is mandatory for configured lookup because popupId alone is not
     * globally unique in the GameConfiguration priority table.
     */
    window._lmResolveConfigPopupPriority =
        function (
            popupId,
            stateId,
            explicitPriority,
            explicitShowImmediately
        ) {
            var hasPopupId =
                popupId !==
                    undefined &&
                popupId !==
                    null &&
                String(
                    popupId
                ) !==
                    '';


            var hasStateId =
                stateId !==
                    undefined &&
                stateId !==
                    null &&
                String(
                    stateId
                ) !==
                    '';


            var configured =
                null;


            if (
                hasPopupId &&
                hasStateId &&
                typeof window
                    .getAgarPopupPriority ===
                    'function'
            ) {
                try {
                    configured =
                        window
                            .getAgarPopupPriority(
                                popupId,
                                stateId
                            );
                } catch (
                    priorityLookupError
                ) {
                    console.warn(
                        '[LM POPUP QUEUE] Config priority lookup failed:',
                        priorityLookupError
                    );
                }
            }


            var priority =
                configured
                    ? Number(
                        configured
                            .priority
                    )
                    : Number(
                        explicitPriority
                    );


            if (
                !Number.isFinite(
                    priority
                )
            ) {
                priority =
                    0;
            }


            var showImmediately;


            if (
                typeof explicitShowImmediately ===
                    'boolean'
            ) {
                showImmediately =
                    explicitShowImmediately;
            } else {
                showImmediately =
                    !!(
                        configured &&
                        configured
                            .showImmediately
                    );
            }


            return {
                priority:
                    priority,

                showImmediately:
                    showImmediately,

                configured:
                    !!configured,

                popupId:
                    hasPopupId
                        ? popupId
                        : null,

                stateId:
                    hasStateId
                        ? stateId
                        : null,

                raw:
                    configured
            };
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * SORT QUEUE
     * ─────────────────────────────────────────────────────────────────────
     *
     * 1. configured/explicit showImmediately requests first
     * 2. larger priority first
     * 3. FIFO for identical priority
     *
     * "showImmediately" does NOT interrupt an already-visible modal.
     *
     * Preempting an active modal could destroy user interaction/state.
     */
    window._lmSortConfigPopupQueue =
        function () {
            window
                ._lmConfigPopupQueue
                .sort(
                    function (
                        a,
                        b
                    ) {
                        var immediateDelta =
                            (
                                b.showImmediately
                                    ? 1
                                    : 0
                            ) -
                            (
                                a.showImmediately
                                    ? 1
                                    : 0
                            );


                        if (
                            immediateDelta !==
                            0
                        ) {
                            return immediateDelta;
                        }


                        var priorityDelta =
                            (
                                Number(
                                    b.priority
                                ) ||
                                0
                            ) -
                            (
                                Number(
                                    a.priority
                                ) ||
                                0
                            );


                        if (
                            priorityDelta !==
                            0
                        ) {
                            return priorityDelta;
                        }


                        return (
                            (
                                Number(
                                    a.sequence
                                ) ||
                                0
                            ) -
                            (
                                Number(
                                    b.sequence
                                ) ||
                                0
                            )
                        );
                    }
                );
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * OBSERVE ORDINARY LM MODAL REMOVAL
     * ─────────────────────────────────────────────────────────────────────
     *
     * A configured popup should not suddenly appear over an unrelated LM
     * dialog the user is already using.
     *
     * Rather than continuously polling, observe DOM changes only while a
     * configured popup is waiting.
     */
    window._lmEnsureConfigPopupObserver =
        function () {
            if (
                window
                    ._lmConfigPopupObserver ||
                typeof MutationObserver ===
                    'undefined' ||
                !document.body
            ) {
                return;
            }


            window
                ._lmConfigPopupObserver =
                new MutationObserver(
                    function () {
                        if (
                            window
                                ._lmConfigPopupMutationScheduled
                        ) {
                            return;
                        }


                        window
                            ._lmConfigPopupMutationScheduled =
                            true;


                        Promise
                            .resolve()
                            .then(
                                function () {
                                    window
                                        ._lmConfigPopupMutationScheduled =
                                        false;


                                    if (
                                        typeof window
                                            ._lmPumpConfigPopupQueue ===
                                            'function'
                                    ) {
                                        window
                                            ._lmPumpConfigPopupQueue();
                                    }
                                }
                            );
                    }
                );


            window
                ._lmConfigPopupObserver
                .observe(
                    document.body,
                    {
                        childList:
                            true,

                        subtree:
                            true
                    }
                );
        };


    window._lmStopConfigPopupObserverIfIdle =
        function () {
            if (
                window
                    ._lmConfigPopupActive ||
                window
                    ._lmConfigPopupQueue
                    .length >
                    0
            ) {
                return;
            }


            var observer =
                window
                    ._lmConfigPopupObserver;


            if (
                observer
            ) {
                try {
                    observer
                        .disconnect();
                } catch (
                    observerDisconnectError
                ) {
                }
            }


            window
                ._lmConfigPopupObserver =
                null;
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * FIND EXISTING ENTRY BY DEDUPE KEY
     * ─────────────────────────────────────────────────────────────────────
     */
    window._lmFindConfigPopupByDedupeKey =
        function (
            dedupeKey
        ) {
            if (
                dedupeKey ===
                    undefined ||
                dedupeKey ===
                    null ||
                String(
                    dedupeKey
                ) ===
                    ''
            ) {
                return null;
            }


            var normalized =
                String(
                    dedupeKey
                );


            if (
                window
                    ._lmConfigPopupActive &&
                window
                    ._lmConfigPopupActive
                    .dedupeKey ===
                    normalized
            ) {
                return window
                    ._lmConfigPopupActive;
            }


            var queue =
                window
                    ._lmConfigPopupQueue;


            for (
                var i = 0;
                i <
                    queue.length;
                i++
            ) {
                if (
                    queue[i] &&
                    queue[i]
                        .dedupeKey ===
                        normalized
                ) {
                    return queue[i];
                }
            }


            return null;
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * PUMP
     * ─────────────────────────────────────────────────────────────────────
     */
    window._lmPumpConfigPopupQueue =
        function () {
            if (
                window
                    ._lmConfigPopupActive
            ) {
                return false;
            }


            var queue =
                window
                    ._lmConfigPopupQueue;


            if (
                !queue.length
            ) {
                window
                    ._lmStopConfigPopupObserverIfIdle();

                return false;
            }


            /*
             * Do not cover another unrelated LM modal.
             */
            var existingOverlay =
                document
                    .querySelector(
                        '.lm-modal-overlay'
                    );


            if (
                existingOverlay
            ) {
                window
                    ._lmEnsureConfigPopupObserver();

                return false;
            }


            window
                ._lmSortConfigPopupQueue();


            var entry =
                queue.shift();


            if (
                !entry
            ) {
                return false;
            }


            window
                ._lmConfigPopupActive =
                entry;


            entry._finished =
                false;


            /*
             * One and only one completion path.
             */
            entry.finish =
                function (
                    reason,
                    payload
                ) {
                    if (
                        entry
                            ._finished
                    ) {
                        return false;
                    }


                    entry
                        ._finished =
                        true;


                    if (
                        window
                            ._lmConfigPopupActive ===
                        entry
                    ) {
                        window
                            ._lmConfigPopupActive =
                            null;
                    }


                    if (
                        typeof entry
                            .onClose ===
                            'function'
                    ) {
                        try {
                            entry
                                .onClose(
                                    reason ||
                                        'closed',
                                    payload,
                                    entry
                                );
                        } catch (
                            onCloseError
                        ) {
                            console.error(
                                '[LM POPUP QUEUE] onClose failed:',
                                onCloseError
                            );
                        }
                    }


                    window
                        ._lmDispatchConfigPopupEvent(
                            'lm-config-popup-closed',
                            {
                                id:
                                    entry.id,

                                popupId:
                                    entry.popupId,

                                stateId:
                                    entry.stateId,

                                priority:
                                    entry.priority,

                                showImmediately:
                                    entry
                                        .showImmediately,

                                reason:
                                    reason ||
                                    'closed',

                                payload:
                                    payload,

                                entry:
                                    entry
                            }
                        );


                    /*
                     * Wait until DOM removal has completed before creating the
                     * next overlay.
                     */
                    window.setTimeout(
                        function () {
                            window
                                ._lmPumpConfigPopupQueue();
                        },
                        0
                    );


                    window
                        ._lmStopConfigPopupObserverIfIdle();


                    return true;
                };


            try {
                var opened =
                    entry
                        .open(
                            entry.finish,
                            entry
                        );


                if (
                    opened ===
                    false
                ) {
                    entry
                        .finish(
                            'open-failed'
                        );

                    return false;
                }


                window
                    ._lmDispatchConfigPopupEvent(
                        'lm-config-popup-opened',
                        {
                            id:
                                entry.id,

                            popupId:
                                entry.popupId,

                            stateId:
                                entry.stateId,

                            priority:
                                entry.priority,

                            showImmediately:
                                entry
                                    .showImmediately,

                            configuredPriority:
                                entry
                                    .configuredPriority,

                            entry:
                                entry
                        }
                    );


                return true;
            } catch (
                popupOpenError
            ) {
                console.error(
                    '[LM POPUP QUEUE] Popup open failed:',
                    popupOpenError
                );


                entry
                    .finish(
                        'open-error',
                        popupOpenError
                    );


                return false;
            }
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * PUBLIC ENQUEUE
     * ─────────────────────────────────────────────────────────────────────
     *
     * options:
     *
     *      popupId
     *      stateId
     *      priority
     *      showImmediately
     *      dedupeKey
     *      metadata
     *      open(done, entry)
     *      onClose(reason, payload, entry)
     */
    window.enqueueAgarConfigPopup =
        function (
            options
        ) {
            options =
                options ||
                {};


            if (
                typeof options
                    .open !==
                    'function'
            ) {
                console.warn(
                    '[LM POPUP QUEUE] Rejected popup without open() callback.'
                );

                return null;
            }


            var dedupeKey =
                options
                    .dedupeKey !==
                    undefined &&
                options
                    .dedupeKey !==
                    null
                    ? String(
                        options
                            .dedupeKey
                    )
                    : '';


            if (
                dedupeKey
            ) {
                var existing =
                    window
                        ._lmFindConfigPopupByDedupeKey(
                            dedupeKey
                        );


                if (
                    existing
                ) {
                    return existing.id;
                }
            }


            var resolved =
                window
                    ._lmResolveConfigPopupPriority(
                        options
                            .popupId,

                        options
                            .stateId,

                        options
                            .priority,

                        options
                            .showImmediately
                    );


            window
                ._lmConfigPopupSequence++;


            var sequence =
                window
                    ._lmConfigPopupSequence;


            var entry =
                {
                    id:
                        (
                            'lm-config-popup-' +
                            sequence
                        ),

                    sequence:
                        sequence,

                    popupId:
                        resolved
                            .popupId,

                    stateId:
                        resolved
                            .stateId,

                    priority:
                        resolved
                            .priority,

                    showImmediately:
                        resolved
                            .showImmediately,

                    configuredPriority:
                        resolved
                            .configured,

                    rawPriority:
                        resolved
                            .raw,

                    dedupeKey:
                        dedupeKey,

                    metadata:
                        options
                            .metadata ||
                        null,

                    open:
                        options
                            .open,

                    onClose:
                        typeof options
                            .onClose ===
                            'function'
                            ? options
                                .onClose
                            : null,

                    finish:
                        null,

                    requestClose:
                        null,

                    _finished:
                        false
                };


            window
                ._lmConfigPopupQueue
                .push(
                    entry
                );


            window
                ._lmSortConfigPopupQueue();


            window
                ._lmEnsureConfigPopupObserver();


            window
                ._lmDispatchConfigPopupEvent(
                    'lm-config-popup-enqueued',
                    {
                        id:
                            entry.id,

                        popupId:
                            entry.popupId,

                        stateId:
                            entry.stateId,

                        priority:
                            entry.priority,

                        showImmediately:
                            entry
                                .showImmediately,

                        configuredPriority:
                            entry
                                .configuredPriority,

                        entry:
                            entry
                    }
                );


            window
                ._lmPumpConfigPopupQueue();


            return entry.id;
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * PUBLIC CLOSE ACTIVE
     * ─────────────────────────────────────────────────────────────────────
     */
    window.closeActiveAgarConfigPopup =
        function (
            reason
        ) {
            var active =
                window
                    ._lmConfigPopupActive;


            if (
                !active
            ) {
                return false;
            }


            if (
                typeof active
                    .requestClose ===
                    'function'
            ) {
                try {
                    active
                        .requestClose(
                            reason ||
                                'api-close'
                        );

                    return true;
                } catch (
                    requestCloseError
                ) {
                    console.error(
                        '[LM POPUP QUEUE] requestClose failed:',
                        requestCloseError
                    );
                }
            }


            if (
                typeof active
                    .finish ===
                    'function'
            ) {
                active
                    .finish(
                        reason ||
                            'api-close'
                    );
            }


            return true;
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * PUBLIC QUEUE STATUS
     * ─────────────────────────────────────────────────────────────────────
     */
    window.getAgarConfigPopupQueueStatus =
        function () {
            return {
                active:
                    window
                        ._lmConfigPopupActive
                        ? {
                            id:
                                window
                                    ._lmConfigPopupActive
                                    .id,

                            popupId:
                                window
                                    ._lmConfigPopupActive
                                    .popupId,

                            stateId:
                                window
                                    ._lmConfigPopupActive
                                    .stateId,

                            priority:
                                window
                                    ._lmConfigPopupActive
                                    .priority
                        }
                        : null,

                queueLength:
                    window
                        ._lmConfigPopupQueue
                        .length,

                queue:
                    window
                        ._lmConfigPopupQueue
                        .map(
                            function (
                                entry
                            ) {
                                return {
                                    id:
                                        entry.id,

                                    popupId:
                                        entry.popupId,

                                    stateId:
                                        entry.stateId,

                                    priority:
                                        entry.priority,

                                    showImmediately:
                                        entry
                                            .showImmediately,

                                    dedupeKey:
                                        entry
                                            .dedupeKey
                                };
                            }
                        )
            };
        };

    /*
     * ═════════════════════════════════════════════════════════════════════
     * GAMECONFIGURATION VISUAL BRIDGE
     * ═════════════════════════════════════════════════════════════════════
     *
     * Expose official visual metadata as CSS variables.
     *
     * IMPORTANT:
     *
     * We do NOT overwrite defaultSettings minimap/theme colors.
     * Existing LM user customization therefore remains authoritative.
     *
     * Config-aware UI/render code can opt into these variables/resolvers.
     */
    window.applyAgarVisualConfiguration =
        function () {
            if (
                typeof window
                    .getAgarMinimapSetting !==
                    'function'
            ) {
                return false;
            }


            var root =
                document
                    .documentElement;

            if (!root) {
                return false;
            }


            function setColorVariable(
                name,
                key
            ) {
                var raw =
                    window
                        .getAgarMinimapSetting(
                            key,
                            null
                        );

                if (
                    raw === null ||
                    raw === undefined
                ) {
                    root
                        .style
                        .removeProperty(
                            name
                        );

                    return;
                }


                var info =
                    typeof window
                        .parseAgarRgbaColor ===
                        'function'
                        ? window
                            .parseAgarRgbaColor(
                                raw
                            )
                        : null;


                if (
                    info &&
                    info.valid &&
                    info.css
                ) {
                    root
                        .style
                        .setProperty(
                            name,
                            info.css
                        );
                } else {
                    root
                        .style
                        .removeProperty(
                            name
                        );
                }
            }


            setColorVariable(
                '--lm-agar-minimap-fill',
                'minimapFillColor'
            );

            setColorVariable(
                '--lm-agar-minimap-outline',
                'minimapOutlineColor'
            );

            setColorVariable(
                '--lm-agar-br-danger-fill',
                'dangerAreaFillColor'
            );

            setColorVariable(
                '--lm-agar-br-danger-outline',
                'dangerAreaOutlineColor'
            );

            setColorVariable(
                '--lm-agar-br-safe-outline',
                'safeAreaOutlineColor'
            );

            /*
             * playerDotColor from the current GameConfiguration is malformed/
             * unusual for an RGBA8 value. The strict parser deliberately
             * refuses to truncate it.
             */
            setColorVariable(
                '--lm-agar-minimap-player-dot',
                'playerDotColor'
            );


            var dotRadius =
                window
                    .getAgarMinimapSetting(
                        'playerDotRadius',
                        null
                    );

            if (
                dotRadius !== null &&
                dotRadius !== undefined
            ) {
                root
                    .style
                    .setProperty(
                        '--lm-agar-minimap-player-dot-radius',
                        String(
                            dotRadius
                        ) +
                        'px'
                    );
            }


            try {
                document
                    .dispatchEvent(
                        new CustomEvent(
                            'lm-agar-visual-config-updated',
                            {
                                detail:
                                    {
                                        source:
                                            'applyAgarVisualConfiguration'
                                    }
                            }
                        )
                    );
            } catch (
                visualEventError
            ) {
            }


            return true;
        };


    /*
     * ─────────────────────────────────────────────────────────────────────
     * Battle Royale status banner
     * ─────────────────────────────────────────────────────────────────────
     *
     * The phase itself remains live/server-driven.
     * Only visual styling comes from GameConfiguration.
     */
    document.addEventListener(
        'battleRoyalePhaseUpdate',
        function (
            e
        ) {
            var phase =
                e.detail;

            var banner =
                document
                    .getElementById(
                        'br-hud-banner'
                    );


            if (!banner) {
                banner =
                    document
                        .createElement(
                            'div'
                        );

                banner.id =
                    'br-hud-banner';

                document
                    .body
                    .appendChild(
                        banner
                    );
            }


            var dangerFill =
                'rgba(255,0,0,0.25)';

            var dangerOutline =
                '#ff0000';


            if (
                typeof window
                    .getAgarMinimapSetting ===
                    'function' &&
                typeof window
                    .parseAgarRgbaColor ===
                    'function'
            ) {
                var rawFill =
                    window
                        .getAgarMinimapSetting(
                            'dangerAreaFillColor',
                            null
                        );

                if (rawFill) {
                    var parsedFill =
                        window
                            .parseAgarRgbaColor(
                                rawFill
                            );

                    if (
                        parsedFill &&
                        parsedFill.valid
                    ) {
                        dangerFill =
                            parsedFill.css;
                    }
                }


                var rawOutline =
                    window
                        .getAgarMinimapSetting(
                            'dangerAreaOutlineColor',
                            null
                        );

                if (rawOutline) {
                    var parsedOutline =
                        window
                            .parseAgarRgbaColor(
                                rawOutline
                            );

                    if (
                        parsedOutline &&
                        parsedOutline.valid
                    ) {
                        dangerOutline =
                            parsedOutline.css;
                    }
                }
            }


            if (
                phase
            ) {
                banner
                    .style
                    .display =
                    'flex';

                banner
                    .style
                    .background =
                    dangerFill;

                banner
                    .style
                    .borderColor =
                    dangerOutline;

                banner
                    .style
                    .boxShadow =
                    (
                        '0 0 18px ' +
                        dangerOutline
                    );

                banner
                    .innerHTML =
                    '<span>☣️ ' + _lmUE('lmx.ui.brShrinking') + '</span>';
            } else {
                banner
                    .style
                    .display =
                    'none';
            }
        }
    );


    /*
     * Apply immediately when possible.
     */
    window
        .applyAgarVisualConfiguration();

    // ─── Component 4: 🎁 "Claim All Rewards" Menu Button ───
    window.claimAllRewardsAndGifts = function() {
        var btn = document.getElementById('lm-claim-all-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ ' + _lmUE('lmx.ui.claiming');
        }

        /*
         * Send only what the server can grant now (official client rules):
         * - hourlyBonus: only when its timed event is listed and its timer is 0
         *   (FreeCoinsService.triggerFreeCoins).
         * - dailyQuest: activate the timed event (110) only with no active quest
         *   and the timer at 0; the reply's wallet update sends 114.
         * - gifts: claim ids are Facebook request ids; without Facebook the only
         *   claimable one is the configured fake user's gift
         *   ("Gifting - Fake User": fictionalPlayerFbId / fictionalGiftRequestId).
         * Opcode 117 is not sent: it needs rewards_for=progressive_video (a watched ad).
         */
        /* say what was claimed and why the rest was not: the button looked dead when nothing was ready */
        var _claimed = [], _waiting = [];
        /* Round up to whole minutes first: rounding the minutes apart from the hours gave "1h 60m". */
        var _fmtLeft = function (s) { var mins = Math.ceil(Math.max(0, s) / 60); var h = Math.floor(mins / 60), m = mins % 60; return h ? _lmUE('lmx.ui.durHM', [h, m]) : _lmUE('lmx.ui.durM', [m]); };
        if (window.application && typeof window.application.activateTimedEvent === 'function') {
            var _secs = typeof window.getLiveTimedEventSecondsRemaining === 'function'
                ? window.getLiveTimedEventSecondsRemaining : function () { return null; };
            var _hourlySecs = _secs('hourlyBonus');
            if (_hourlySecs === 0) {
                /* activateTimedEvent returns false when nothing was sent (not connected/logged in) */
                if (window.application.activateTimedEvent("hourlyBonus")) _claimed.push(_lmUE('itemHourly'));
            } else if (_hourlySecs > 0) {
                _waiting.push(_lmUE('itemIn').replace('{0}', _lmUE('itemHourly')).replace('{1}', _fmtLeft(_hourlySecs)));
            }
            var _dailySecs = _secs('dailyQuest');
            /* The list is never pruned: an expired quest is not active. */
            var _noQuest = !(window._lmActiveQuests || []).some(function (q) { return q && q.expiresAt > Date.now(); });
            if (_noQuest && (_dailySecs === 0 || _dailySecs === null) && typeof window.questActivationReq === 'function') {
                /* false: nothing was sent (not connected / not logged in) */
                if (window.questActivationReq() !== false) _claimed.push(_lmUE('itemDaily'));
            } else if (!_noQuest) {
                _waiting.push(_lmUE('dailyRunning'));
            } else if (_dailySecs > 0) {
                _waiting.push(_lmUE('itemIn').replace('{0}', _lmUE('nextDaily')).replace('{1}', _fmtLeft(_dailySecs)));
            }
        }
        /* Expanding Land daily challenges met but not claimed (none on other servers). Not listed
         * as claimed here: the server's reply (type 220) shows its own toast once it is confirmed. */
        var _dchSent = 0;
        try {
            var _dch = window._lmDailyChallenges;
            if (_dch && Array.isArray(_dch.challenges) && typeof window.claimDailyChallenge === 'function') {
                _dch.challenges.forEach(function (c) {
                    if (c && c.completed && !c.claimed && window.claimDailyChallenge(c.slot) !== false) _dchSent++;
                });
            }
        } catch (dchErr) { console.warn('[LM] Claim daily challenge error:', dchErr); }
        try {
            var _fake = {};
            var _fakeCfg = typeof window.getAgarConfigSection === 'function'
                ? window.getAgarConfigSection('Gifting - Fake User') : null;
            (Array.isArray(_fakeCfg) ? _fakeCfg : []).forEach(function (s) { if (s && s.key) _fake[s.key] = s.value; });
            var _claimable = (window._lmUserGifts && window._lmUserGifts.claimable) || [];
            var _hasFakeGift = _fake.fictionalPlayerFbId && _fake.fictionalGiftRequestId &&
                _claimable.some(function (g) { return g && g.facebookIdFrom === _fake.fictionalPlayerFbId; });
            if (_hasFakeGift && typeof window.claimGifts === 'function') {
                if (window.claimGifts([String(_fake.fictionalGiftRequestId)]) !== false) {
                    _claimed.push(_lmUE('itemGift'));
                    /* Claimed once; the next login lists it again only if it is still claimable. */
                    window._lmUserGifts.claimable = _claimable.filter(function (g) { return !g || g.facebookIdFrom !== _fake.fictionalPlayerFbId; });
                }
            }
        } catch (giftErr) { console.warn('[LM] Claim gift error:', giftErr); }
        try {
            if (window.toastr) {
                if (_claimed.length) toastr.success('<b>[' + _lmUE('lmx.ui.tagClaim') + ']:</b> ' + _lmUE('claimed').replace('{0}', _claimed.join(', ')) + (_waiting.length ? '. ' + _lmUE('claimWaiting').replace('{0}', _waiting.join(', ')) : '') + '.');
                else if (!_dchSent) toastr.info('<b>[' + _lmUE('lmx.ui.tagClaim') + ']:</b> ' + _lmUE('nothingToClaim') + (_waiting.length ? ': ' + _waiting.join(', ') : '') + '. ' + _lmUE('levelRewardsNote'));
            }
        } catch (toastErr) { }

        setTimeout(function() {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '🎁 <span data-i18n="claimAll">' + _lmUE('claimAll') + '</span>' + (_claimed.length ? ' ✓' : '');
                setTimeout(function() { if (typeof window._lmUpdateClaimLabel === 'function') window._lmUpdateClaimLabel(true); }, 3000);
            }
        }, 1200);
    };

    /* Claim All label shows whether something can be claimed now (●) or when the hourly
     * bonus is next (· 23m). Display only, same rules as claimAllRewardsAndGifts. */
    window._lmUpdateClaimLabel = function (force) {
        var btn = document.getElementById('lm-claim-all-btn');
        if (!btn || (btn.disabled && !force) || /\u23F3/.test(btn.textContent)) return;
        var base = '\uD83C\uDF81 <span data-i18n="claimAll">' + _lmUE('claimAll') + '</span>'; // i18n-ok: emoji icon and CSS; the texts come from the packs
        var extra = '';
        try {
            var secs = typeof window.getLiveTimedEventSecondsRemaining === 'function' ? window.getLiveTimedEventSecondsRemaining : null;
            if (secs) {
                var h = secs('hourlyBonus'), d = secs('dailyQuest');
                var noQuest = !(window._lmActiveQuests || []).some(function (q) { return q && q.expiresAt > Date.now(); });
                var dchReady = !!(window.legendmod && window.legendmod.isLegendWorld && window._lmDailyChallenges && Array.isArray(window._lmDailyChallenges.challenges) &&
                    window._lmDailyChallenges.challenges.some(function (c) { return c && c.completed && !c.claimed; }));
                if (h === 0 || (noQuest && d === 0) || dchReady) extra = ' \u25CF';
                else if (h > 0) { var mins = Math.ceil(h / 60); extra = ' \u00B7 ' + (mins >= 60 ? _lmUR('lmx.ui.durHM', [Math.floor(mins / 60), mins % 60]) : _lmUR('lmx.ui.durM', [mins])); }
            }
        } catch (e) { }
        /* after a claim the label is put back (as before); otherwise only the status span
         * changes, so the rest of the button (e.g. the login ribbon) stays */
        if (force) { btn.innerHTML = base; btn.disabled = false; }
        var st = btn.querySelector('.lm-claim-st');
        if (!st) { st = document.createElement('span'); st.className = 'lm-claim-st'; btn.appendChild(st); }
        if (st.textContent !== extra) st.textContent = extra;
        /* optional reminder (bell next to Claim All): one toast each time something becomes ready */
        var nowReady = extra === ' \u25CF';
        var remind = false;
        try { remind = localStorage.getItem('lmClaimRemind') === '1'; } catch (e) { }
        var playing = !!(window.legendmod && window.legendmod.play);
        /* first check after load: remember the state only (no toast for what was already ready);
         * while playing the toast waits for the menu */
        if (window._lmClaimWasReady === undefined) { window._lmClaimWasReady = nowReady; return; }
        if (playing && nowReady && !window._lmClaimWasReady) return;
        if (nowReady && !window._lmClaimWasReady && remind && window.toastr && !force) {
            toastr.info('<b>[' + _lmUE('claimAll') + ']:</b> ' + _lmUE('rewardReady'));
        }
        window._lmClaimWasReady = nowReady;
    };
    $(document).off('click.lmClaimRemind').on('click.lmClaimRemind', '#lm-claim-remind', function (e) {
        e.preventDefault();
        var on = false;
        try { on = localStorage.getItem('lmClaimRemind') !== '1'; localStorage.setItem('lmClaimRemind', on ? '1' : '0'); } catch (er) { }
        this.textContent = on ? '\uD83D\uDD14' : '\uD83D\uDD15';
        if (window.toastr) toastr.info(on ? _lmUE('remindOn') : _lmUE('remindOff'));
    });
    setInterval(function () { if (!document.hidden) window._lmUpdateClaimLabel(false); }, 30000);
    setTimeout(function () { window._lmUpdateClaimLabel(false); }, 4000);
    /* Choose Language: the menu buttons' texts follow through their data-i18n attributes (LMi18n.apply);
     * their state hints, the XP line, the boost list and the claim status are built in code, so build them again */
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') {
        window.LMi18n.onChange(function () {
            try { if (typeof window.syncProfileTabUI === 'function') window.syncProfileTabUI(); } catch (e) { }
            try { if (typeof window.initBoostDropdown === 'function') window.initBoostDropdown(true); } catch (e) { }
            try { window._lmUpdateClaimLabel(false); } catch (e) { }
        });
    }
    window.getHourlyBonusTimeLeftString = function() {
        var ms = (window.application && typeof window.application.freeCoinTimeLeft === 'function') 
            ? window.application.freeCoinTimeLeft() 
            : (window.hourlyBonusFinalTimer ? Math.max(0, window.hourlyBonusFinalTimer - Date.now()) : 0);
        if (ms <= 0) return _lmUR('lmx.ui.readyBang');
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


    /*
     * Owned potion skip-brew token for a slot (wallet type 9, productId with
     * "skip_brew_slot_<n>"), as matched by the official handlePendingRewards.
     */
    window._lmSkipBrewTokenForSlot = function (slot) {
        var u = (window.application && window.application.user) ||
            (window.legendmod && window.legendmod.user) || null;
        var tokens = (u && u.skipBrew) || {};
        for (var key in tokens) {
            if (!Object.prototype.hasOwnProperty.call(tokens, key)) continue;
            if (!(Number(tokens[key]) > 0) || key.indexOf('skip_brew_slot') === -1) continue;
            if (parseInt(key.split('_slot_')[1], 10) === Number(slot)) return key;
        }
        return '';
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
                return _lmUR('waitingServer');
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
                    _lmUR('lmx.ui.durD', [days])
                );
            }


            if (
                hours ||
                days
            ) {
                parts.push(
                    _lmUR('lmx.ui.durH', [hours])
                );
            }


            if (
                minutes ||
                hours ||
                days
            ) {
                parts.push(
                    _lmUR('lmx.ui.durM', [minutes])
                );
            }


            if (
                !days &&
                !hours
            ) {
                parts.push(
                    _lmUR('lmx.ui.durS', [secs])
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


    /*
     * Returns the player's current balance for a given currency productId.
     * Falls back to 0 if user data is unavailable.
     */
    window._lmGetCurrencyBalance =
        function (currencyId) {
            /* window.LM is only a local dummy; the real wallet lives on legendmod.user. */
            var u = (window.application && window.application.user) || (window.legendmod && window.legendmod.user) || null;
            if (!u) return 0;
            var cid = String(currencyId || '').trim().toLowerCase();
            if (cid === 'coin') return Number(u.coins) || 0;
            if (cid === 'dna') return Number(u.dna) || 0;
            return 0;
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


            /* Official: an event missing from the received list is available. */
            if (
                hourlySeconds ===
                null &&
                !window._lmTimedEventState
            ) {
                hourlyTimerText =
                    _lmUR('waitingServer');
            } else if (
                hourlySeconds === null ||
                hourlySeconds <=
                0
            ) {
                hourlyTimerText =
                    _lmUR('ready');
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


            /* Official QuestsController: no dailyQuest event means a quest can start now. */
            if (
                dailySeconds ===
                null &&
                !window._lmTimedEventState
            ) {
                dailyTimerText =
                    _lmUR('waitingServer');
            } else if (
                dailySeconds === null ||
                dailySeconds <=
                0
            ) {
                dailyTimerText =
                    _lmUR('ready');
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
                        _lmUE('rewardsTimers') +
                    '</strong>' +

                '</div>';


            html +=
                buildRow(
                    '\u2B50',
                    _lmUR('levelNext').replace('{0}', level).replace('{1}', level + 1),
                    levelRewardText ||
                        (
                            levelRewardId
                                ? levelRewardId
                                : _lmUR('noReward')
                        ),
                    ''
                );


            html +=
                buildRow(
                    '\uD83D\uDCB0',
                    _lmUR('hourlyBonus'),
                    hourlyRewardText ||
                        _lmUR('timedReward'),
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
                var _dailyCanAfford = dailyPrice != null
                    ? (window._lmGetCurrencyBalance(dailyInfo.currency) >= dailyPrice)
                    : true;

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
                        (_dailyCanAfford ? '' : 'disabled ') +
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
                            (_dailyCanAfford ? '' : 'opacity:.45;cursor:not-allowed;filter:grayscale(40%);') +
                        '"' +
                        (_dailyCanAfford ? '' : ' title="' + _lmUE('lmx.ui.notEnough', [dailyInfo.currency || _lmUR('lmx.ui.currency')]) + '"') +
                    '>' +
                        _lmUE('lmx.ui.newQuestPrice', [dailyPriceText]) +
                    '</button>';
            }


            html +=
                buildRow(
                    '\uD83C\uDFAF',
                    _lmUR('dailyQuest'),
                    dailyTimerText,
                    dailyButtonHtml
                );


/*
             * POTION SLOTS — Horizontal visual strip
             *
             * Reads live state from existing #potion1/2/3 DOM.
             * Renders 3 visual potion bottles side by side.
             */

            /* The real slot state is written by updatePotions()/newPotion() into
             * legendmod.user.potionsStatus ('potion1'..'potion3'); window.LM is only a stub. */
            var _realUser = (window.application && window.application.user) || (window.legendmod && window.legendmod.user) || null;
            var potionStates =
                (_realUser && _realUser.potionsStatus) ||
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


            /* Official getPotionState: an obtained potion cannot be brewed while
             * another slot is brewing (UNAVAILABLE; the server answers 3). */
            var pAnyBrewing = false;
            for (var bSlot = 1; bSlot <= 3; bSlot++) {
                var bp = potionStates['potion' + bSlot];
                if (bp && Number(bp.status) === 2) {
                    var bSecs = typeof window.getLivePotionSecondsRemaining === 'function'
                        ? window.getLivePotionSecondsRemaining(bp) : null;
                    if (bSecs === null || bSecs > 0) pAnyBrewing = true;
                }
            }

            for (var slot = 1; slot <= 3; slot++) {
                var potionKey = 'potion' + slot;
                var pp = potionStates[potionKey] || null;

                /* A slot without a potion is empty: the server answers "not available"
                 * (brew result 2) to a brew on it, so it must not be offered as BREW. */
                var pState = 'empty';
                var pRarity = '';
                var pTimer = '';
                var pSkipHtml = '';
                var pSvg = _pvEmpty;
                var pGlow = 'none';
                var pBorder = 'rgba(255,255,255,0.15)';
                var pBg = 'rgba(255,255,255,0.03)';
                if (pp) {
                    /* a potion is in the slot: brewable unless the status says otherwise */
                    pState = 'brew';
                    pSvg = _pvBrew;
                    pGlow = '0 0 8px rgba(76,175,80,0.5)';
                    pBorder = '#4caf50';
                    pBg = 'rgba(76,175,80,0.08)';
                    /*
                     * Extract rarity from productId (e.g. "potion_exotic" → "exotic").
                     * Falls back to legacy DOM img src scraping only if productId missing.
                     */
                    var ppProductId = pp.productId || pp.type || '';
                    var pRarityMatch = ppProductId.match(/potion_([a-z]+)/i);
                    if (pRarityMatch && pRarityMatch[1]) {
                        pRarity = pRarityMatch[1].toLowerCase();
                    } else {
                        var potionEl = document.getElementById(potionKey);
                        if (potionEl) {
                            var pImg = potionEl.querySelector('img');
                            var pSrc = pImg ? String(pImg.src || '') : '';
                            var pSrcMatch = pSrc.match(/potion_([a-z]+)\./i);
                            if (pSrcMatch && pSrcMatch[1]) pRarity = pSrcMatch[1].toLowerCase();
                        }
                    }


                    var ppStatus = Number(pp.status) || 0;
                    var ppSecsLeft = typeof window.getLivePotionSecondsRemaining === 'function'
                        ? window.getLivePotionSecondsRemaining(pp) : null;


                    /*
                     * Status 2 with an expired timer means the brew is done.
                     * The server doesn't push a status update — the client must infer it.
                     */
                    if (ppStatus === 2 && ppSecsLeft !== null && ppSecsLeft <= 0) {
                        ppStatus = 3;
                    }


                    if (ppStatus === 1 && pAnyBrewing) {
                        /* Obtained, waits until the running brew finishes */
                        pState = 'wait';
                        pSvg = _pvBrew;
                        pGlow = 'none';
                        pBorder = 'rgba(255,255,255,0.25)';
                        pBg = 'rgba(255,255,255,0.03)';
                    } else if (ppStatus === 1) {
                        /* Obtained, ready to brew */
                        pState = 'brew';
                        pSvg = _pvBrew;
                        pGlow = '0 0 8px rgba(76,175,80,0.5)';
                        pBorder = '#4caf50';
                        pBg = 'rgba(76,175,80,0.08)';
                    } else if (ppStatus === 2) {
                        /* Actively brewing — live countdown */
                        pState = 'brewing';
                        if (ppSecsLeft !== null && ppSecsLeft > 0) {
                            var bMin = Math.floor(ppSecsLeft / 60);
                            var bSec = ppSecsLeft % 60;
                            pTimer = (bMin < 10 ? '0' : '') + bMin + ':' +
                                     (bSec < 10 ? '0' : '') + bSec;
                        } else {
                            pTimer = '...';
                        }
                        pSvg = _pvBrewing;
                        pGlow = '0 0 8px rgba(255,152,0,0.5)';
                        pBorder = '#ff9800';
                        pBg = 'rgba(255,152,0,0.08)';
                    } else if (ppStatus === 3) {
                        /* Brewed, ready to open */
                        pState = 'open';
                        pSvg = _pvOpen;
                        pGlow = '0 0 12px rgba(156,39,176,0.6), 0 0 4px rgba(255,235,59,0.4)';
                        pBorder = '#9c27b0';
                        pBg = 'rgba(156,39,176,0.1)';
                    }
                    /* ppStatus === 0 or unknown: leave as default 'brew' */
                }

                var pAccent = (pRarity && _rarityAccents[pRarity]) ? _rarityAccents[pRarity] : '';
                if (pAccent) pBorder = pAccent;

                var pRarityLabel = pRarity
                    ? (pRarity.charAt(0).toUpperCase() + pRarity.slice(1))
                    : '';


                /* Skip button for brewing potions */
                if (pState === 'brewing') {

                    if (pp && Number(pp.status) === 2) {
                        var ppId = pp.productId || pp.type || '';
                        var ppSec = window.getLivePotionSecondsRemaining(pp);
                        var ppInfo = typeof window.getAgarPotionInfo === 'function'
                            ? window.getAgarPotionInfo(ppId, slot, ppSec === null ? undefined : ppSec)
                            : null;

                        if (typeof window._lmSkipBrewTokenForSlot === 'function' &&
                            window._lmSkipBrewTokenForSlot(slot)) {
                            /* skip token already owned: opening the slot uses it */
                            pSkipHtml =
                                '<button type="button" class="btn btn-xs lm-potion-skip-buy" ' +
                                    'data-potion-id="' + window._lmEconomyEscape(ppId) + '" ' +
                                    'data-slot="' + slot + '" ' +
                                    'data-purchase-id="" ' +
                                    'style="font-size:8px;padding:2px 5px;background:' +
                                        window._lmEconomyEscape(theme.b3) + ';color:' +
                                        window._lmEconomyEscape(theme.btc) +
                                        ';border:0;border-radius:var(--lm-radius-s,4px);white-space:nowrap;margin-top:2px;cursor:pointer;"' +
                                '>' + _lmUE('skipOwned') + '</button>';
                        } else if (ppInfo && ppInfo.purchaseId &&
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
                                    (typeof window._lmHasPendingSoftPurchase === 'function' && window._lmHasPendingSoftPurchase(ppInfo.purchaseId) ? 'disabled ' : '') +
                                    'style="font-size:8px;padding:2px 5px;background:' +
                                        window._lmEconomyEscape(theme.b3) + ';color:' +
                                        window._lmEconomyEscape(theme.btc) +
                                        ';border:0;border-radius:var(--lm-radius-s,4px);white-space:nowrap;margin-top:2px;cursor:pointer;"' +
                                '>' + _lmUE('skip') + ' ' + window._lmEconomyEscape(ppPriceText) + '</button>';
                        }
                    }
                }


                /* Status line */
                var pStatus = '';
                if (pState === 'empty') {
                    pStatus = '<div style="font-size:8px;color:#888;font-weight:700;">' + _lmUE('pEmpty') + '</div>';
                } else if (pState === 'brew') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:8px;color:#8bc34a;font-weight:700;">\u25B6 ' + _lmUE('pBrew') + '</div>';
                } else if (pState === 'wait') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:8px;color:#888;font-weight:700;" title="' + _lmUE('anotherBrewing') + '">' + _lmUE('pWaiting') + '</div>';
                } else if (pState === 'brewing') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:10px;color:#ff9800;font-weight:900;font-variant-numeric:tabular-nums;">' + pTimer + '</div>' +
                        pSkipHtml;
                } else if (pState === 'open') {
                    pStatus =
                        (pRarityLabel ? '<div style="font-size:9px;color:' + pBorder + ';font-weight:700;">' + pRarityLabel + '</div>' : '') +
                        '<div style="font-size:8px;color:#ce93d8;font-weight:800;">\u2728 ' + _lmUE('pOpen') + '</div>';
                }


                /* Clickable for brew/open states */
                var pActionClass = '';
                var pActionAttr = '';
                var pCursor = '';

                var pBusy = window._lmPotionBusy && Date.now() - (window._lmPotionBusy[slot] || 0) < 5000;
                if (pBusy && (pState === 'brew' || pState === 'open')) {
                    pCursor = 'cursor:not-allowed;opacity:.45;';
                } else if (pState === 'brew') {
                    pActionClass = ' lm-potion-action';
                    pActionAttr = ' data-slot="' + slot + '" data-action="brew"';
                    pCursor = 'cursor:pointer;';
                } else if (pState === 'open') {
                    pActionClass = ' lm-potion-action';
                    pActionAttr = ' data-slot="' + slot + '" data-action="open"';
                    pCursor = 'cursor:pointer;';
                }

                html +=
                    '<div class="' + pActionClass.trim() + '"' + pActionAttr + ' style="' +
                        'flex:1;display:flex;flex-direction:column;align-items:center;' +
                        'padding:5px 2px 4px;border-radius:var(--lm-radius,6px);' +
                        'border:1px solid ' + pBorder + ';' +
                        'background:' + pBg + ';' +
                        'box-shadow:' + pGlow + ';' +
                        'transition:box-shadow .3s,opacity .2s;min-width:0;' + pCursor +
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


                /* An already owned skip token for this slot is used by opening the
                 * slot (official handlePendingRewards/getSkipProduct): no purchase. */
                if (
                    slot &&
                    typeof window._lmSkipBrewTokenForSlot === 'function' &&
                    window._lmSkipBrewTokenForSlot(slot) &&
                    typeof window.openPotion === 'function'
                ) {
                    button.prop('disabled', true);
                    window.openPotion(slot, true);
                    return false;
                }


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
                            '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.softPurchaseUnavailable')
                        );
                    }


                    return false;
                }


                if (purchaseId && typeof window._lmHasPendingSoftPurchase === 'function' &&
                    window._lmHasPendingSoftPurchase(purchaseId)) {
                    if (window.toastr) toastr.info('<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.skipProcessing'));
                    return false;
                }
                button.prop(
                    'disabled',
                    true
                );


                /* Official skipPotionBrew: activate potionSkipBrew, buy the skip
                 * product, then open the slot (opcode 124) which uses it. */
                if (
                    typeof window.lmAccountReady !== 'function' ||
                    window.lmAccountReady()
                ) {
                    if (
                        window.application &&
                        typeof window.application.activateTimedEvent === 'function'
                    ) {
                        window.application.activateTimedEvent('potionSkipBrew');
                    }
                }


                var skipSent = window
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


                                    /* The purchase only grants the skip token; opening
                                     * the slot is what skips the brew. */
                                    if (
                                        slot &&
                                        typeof window.openPotion === 'function'
                                    ) {
                                        window.openPotion(slot, true);
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
                                    if (window._lmPurchaseFailToast) window._lmPurchaseFailToast(_lmUE('lmx.ui.tagPotion'), reason);
                                },

                            // No opcode 71 within the timeout: onFailure
                            // never runs, so re-enable here too.
                            onTimeout:
                                function () {
                                    button.prop(
                                        'disabled',
                                        false
                                    );
                                }
                        }
                    );


                // Not sent (login not confirmed, already pending, not
                // connected or encode error):
                // softPurchase calls no callback, so re-enable here.
                if (skipSent !== true) {
                    button.prop(
                        'disabled',
                        false
                    );
                    if (
                        window.toastr &&
                        typeof window.lmAccountReady === 'function' &&
                        !window.lmAccountReady()
                    ) {
                        toastr.warning(
                            '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.loginWaitConnected')
                        );
                    }
                }


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
                            '<b>[' + _lmUE('lmx.ui.tagEvent') + ']:</b> ' + _lmUE('lmx.ui.softPurchaseUnavailable')
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

                var _skipOriginalText = button.text();
                button.prop(
                    'disabled',
                    true
                );

                button.css({
                    opacity: '.55',
                    cursor: 'not-allowed'
                });

                button.text(
                    _lmUR('lmx.ui.working')
                );
                /* Restore when the purchase settles or the call is refused. */
                window._lmRestoreWhenPurchaseSettled(purchaseId, function () {
                    button.prop('disabled', false);
                    button.css({ opacity: '', cursor: '' });
                    button.text(_skipOriginalText);
                });


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
                                    if (window._lmPurchaseFailToast) window._lmPurchaseFailToast(_lmUE('lmx.ui.tagEvent'), reason);
                                }
                        }
                    );


                return false;
            }
        );


    /*
     * ─────────────────────────────────────────────────────────────────
     * POTION BREW / OPEN — Direct bottle click actions
     * ─────────────────────────────────────────────────────────────────
     *
     * BREW  = Start brewing a potion in this slot.
     *         Calls window.brewPotion(slot) → opcode 122.
     *         Server responds opcode 123 → updatePotions → re-render.
     *
     * OPEN  = Open/consume a ready potion.
     *         Calls window.openPotion(slot, true) → opcode 124.
     *         Server responds opcode 125 → updatePotions → re-render.
     *
     * In both cases: disable on click, server response triggers
     * lm-potions-updated which re-renders the entire panel.
     */
    $(document)
        .off(
            'click.lmPotionAction',
            '.lm-potion-action'
        )
        .on(
            'click.lmPotionAction',
            '.lm-potion-action',
            function (
                event
            ) {
                event.preventDefault();
                event.stopPropagation();


                var el =
                    $(this);


                if (
                    el.hasClass(
                        'lm-potion-busy'
                    )
                ) {
                    return false;
                }


                var slot =
                    parseInt(
                        el.attr(
                            'data-slot'
                        ),
                        10
                    );


                var action =
                    String(
                        el.attr(
                            'data-action'
                        ) ||
                        ''
                    );


                if (
                    !slot ||
                    slot < 1 ||
                    slot > 3 ||
                    !action
                ) {
                    return false;
                }


                /*
                 * Visual feedback: dim + busy flag.
                 *
                 * The panel re-render from lm-potions-updated
                 * will replace this entire DOM, so we never
                 * need to manually un-dim.
                 */
                /* the 5 s panel refresh rebuilt the DOM (busy class lost) before the
                 * server answered: remember the slot for 5 s or until lm-potions-updated */
                window._lmPotionBusy = window._lmPotionBusy || {};
                if (Date.now() - (window._lmPotionBusy[slot] || 0) < 5000) {
                    return false;
                }
                window._lmPotionBusy[slot] = Date.now();
                el.addClass(
                    'lm-potion-busy'
                );


                el.css({
                    opacity: '.45',
                    cursor: 'not-allowed',
                    'pointer-events': 'none'
                });


                if (
                    action ===
                    'brew'
                ) {
                    if (
                        typeof window
                            .brewPotion ===
                            'function'
                    ) {
                        window
                            .brewPotion(
                                slot
                            );


                        if (
                            window.toastr
                        ) {
                            toastr.info(
                                '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.brewingSlot', [slot])
                            );
                        }

                    } else {
                        if (
                            window.toastr
                        ) {
                            toastr.error(
                                '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.brewUnavailable')
                            );
                        }
                    }


                } else if (
                    action ===
                    'open'
                ) {
                    if (
                        typeof window
                            .openPotion ===
                            'function'
                    ) {
                        window
                            .openPotion(
                                slot,
                                true
                            );


                        if (
                            window.toastr
                        ) {
                            toastr.info(
                                '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.openingSlot', [slot])
                            );
                        }

                    } else {
                        if (
                            window.toastr
                        ) {
                            toastr.error(
                                '<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.openUnavailable')
                            );
                        }
                    }
                }


                /*
                 * Safety re-render after 5s in case server
                 * does not respond (e.g. already brewing).
                 */
                setTimeout(
                    function () {
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


                return false;
            }
        );


    /*
     * Server/config changes trigger immediate repaints.
     */
    document.addEventListener(
        'lm-potions-updated',
        function () {
            window._lmPotionBusy = {};
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


    /* (a second, identical lm-potions-updated listener rendered the panel twice per update) */


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
     * POTION REWARD REVEAL
     * ═══════════════════════════════════════════════════════════════════════
     *
     * When a potion is opened (opcode 125), ogario.v4.js dispatches
     * 'lm-potion-reward' with the reward items. We show a reveal modal.
     */

    /* labelKey: the label comes from the language packs when the reward is shown */
    window._lmRewardPresentation = {
        coin:     { icon: '\uD83D\uDCB0', labelKey: 'lmx.ui.coins',  color: '#ffd700' },
        dna:      { icon: '\uD83E\uDDEC', labelKey: 'lmx.ui.dna',    color: '#7c4dff' },
        create_skin_token: { icon: '\uD83C\uDFA8', labelKey: 'lmx.ui.skinToken', color: '#ff4081' }
    };

    window._lmGetRewardPresentation = function (productId) {
        var known = window._lmRewardPresentation[productId];
        if (known) return { icon: known.icon, label: known.labelKey ? _lmUR(known.labelKey) : known.label, color: known.color };
        if (productId.indexOf('piece') !== -1) {
            var skinName = productId.replace(/_piece.*/, '').replace(/_/g, ' ');
            return { icon: '\uD83E\uDDE9', label: _lmUR('lmx.ui.skinPiece', [skinName]), color: '#42a5f5' };
        }
        if (productId.indexOf('skin_') === 0 || productId.indexOf('premium_') === 0) {
            return { icon: '\u2728', label: productId.replace(/_/g, ' '), color: '#ff6d00' };
        }
        return { icon: '\uD83C\uDF81', label: productId.replace(/_/g, ' '), color: '#78909c' };
    };

    document.addEventListener('lm-potion-reward', function (e) {
        var rewards = e && e.detail && e.detail.rewards;
        if (!rewards || !rewards.length) {
            if (window.toastr) toastr.success('<b>[' + _lmUE('lmx.ui.tagPotion') + ']:</b> ' + _lmUE('lmx.ui.openedNoRewards'));
            return;
        }

        injectStyles();
        var t = getTheme();

        var old = document.getElementById('lm-potion-reward-modal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'lm-potion-reward-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000001';
        modal.addEventListener('click', function (ev) {
            if (ev.target === modal) modal.remove();
        });

        var shell = document.createElement('div');
        shell.className = 'lm-modal-container';
        shell.style.cssText = 'background:' + t.pc + ';width:380px;max-width:90vw;text-align:center;';

        /* Header */
        var header = document.createElement('div');
        header.style.cssText = 'padding:18px 20px 8px;font-size:24px;font-weight:900;color:' + t.tc + ';';
        header.innerHTML = '\uD83E\uDDEA ' + _lmUE('lmx.ui.potionReward');
        shell.appendChild(header);

        var subtitle = document.createElement('div');
        subtitle.style.cssText = 'font-size:11px;color:' + t.tc2 + ';margin-bottom:14px;';
        subtitle.textContent = rewards.length > 1 ? _lmUR('lmx.ui.receivedMany', [rewards.length]) : _lmUR('lmx.ui.receivedOne');
        shell.appendChild(subtitle);

        /* Reward cards */
        var body = document.createElement('div');
        body.style.cssText = 'padding:0 20px 16px;display:flex;flex-direction:column;gap:8px;';

        for (var i = 0; i < rewards.length; i++) {
            var rw = rewards[i];
            var pres = window._lmGetRewardPresentation(rw.productId);

            var card = document.createElement('div');
            card.style.cssText =
                'display:flex;align-items:center;gap:12px;padding:10px 14px;' +
                'border-radius:var(--lm-radius,6px);border:1px solid ' + pres.color + '33;' +
                'background:' + pres.color + '12;' +
                'animation:lm-reward-pop .4s ease ' + (i * 0.15) + 's both;';

            var iconEl = document.createElement('div');
            iconEl.style.cssText = 'font-size:28px;flex-shrink:0;';
            iconEl.textContent = pres.icon;

            var infoEl = document.createElement('div');
            infoEl.style.cssText = 'flex:1;text-align:left;';
            infoEl.innerHTML =
                '<div style="font-weight:800;font-size:14px;color:' + pres.color + ';">' + window._lmEconomyEscape(pres.label) + '</div>' +
                (rw.amount > 1 ? '<div style="font-size:11px;color:' + t.tc2 + ';">x' + window._lmEconomyEscape(rw.amount) + '</div>' : '');

            card.appendChild(iconEl);
            card.appendChild(infoEl);
            body.appendChild(card);
        }

        shell.appendChild(body);

        /* Close button */
        var closeBtn = document.createElement('button');
        closeBtn.className = 'btn';
        closeBtn.style.cssText =
            'margin:0 20px 16px;padding:8px 24px;border-radius:var(--lm-radius,6px);font-weight:700;' +
            'background:linear-gradient(135deg,' + t.b1 + ',' + t.b2 + ');color:#fff;border:none;cursor:pointer;';
        closeBtn.textContent = _lmUR('lmx.ui.nice');
        closeBtn.onclick = function () { modal.remove(); };
        shell.appendChild(closeBtn);

        modal.appendChild(shell);
        document.body.appendChild(modal);

        /* Add pop animation if not already present */
        if (!document.getElementById('lm-reward-pop-style')) {
            var style = document.createElement('style');
            style.id = 'lm-reward-pop-style';
            style.textContent =
                '@keyframes lm-reward-pop {' + // i18n-ok: CSS, not text
                    '0% { opacity:0; transform:translateY(12px) scale(.9); }' +
                    '100% { opacity:1; transform:translateY(0) scale(1); }' +
                '}';
            document.head.appendChild(style);
        }

        /* Auto-close after 8 seconds (only this modal, not a newer reward) */
        setTimeout(function () {
            if (modal.parentNode) modal.remove();
        }, 8000);
    });


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
        /* title / subtitle: language pack keys, looked up when the window is shown */
        normal_cells_eaten: { icon: '\uD83D\uDFE2', title: 'cellsEaten', subtitle: 'lmx.ui.chCellsEatenSub' },
        time_total:         { icon: '\u23F1\uFE0F',  title: 'agario.page_survival_time', subtitle: 'lmx.ui.chSurvivalSub' },
        final_level:        { icon: '\u2B50',         title: 'lmx.ui.chFinalLevel', subtitle: 'lmx.ui.chFinalLevelSub' },
        top_position:       { icon: '\uD83D\uDC51', title: 'lmx.ui.chBestPos', subtitle: 'lmx.ui.chBestPosSub' },
        game_ended:         { icon: '\uD83C\uDFC1', title: 'lmx.ui.chFinishGame', subtitle: 'lmx.ui.chFinishGameSub' },
        final_position:     { icon: '\uD83C\uDFC6', title: 'finalPosition', subtitle: 'lmx.ui.chFinalPosSub' }
    };

    window._lmGetChallengePresentation = function (type) {
        type = String(type || '').trim();
        var configured = window._lmChallengePresentation[type];
        /* HTML-escaped texts (the window puts them into innerHTML) */
        if (configured) return { icon: configured.icon, title: _lmUE(configured.title), subtitle: _lmUE(configured.subtitle) };
        var readable = type.replace(/_/g, ' ').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        return { icon: '\uD83C\uDFAF', title: readable ? window._lmEconomyEscape(readable) : _lmUE('lmx.ui.challenge'), subtitle: _lmUE('lmx.ui.chConfigured') };
    };

    window._lmFormatChallengeValue = function (type, value) {
        if (value === undefined || value === null || !Number.isFinite(Number(value))) return '\u2014';
        value = Number(value);
        switch (type) {
            case 'time_total':      return _lmUR('lmx.ui.valMinutes', [value.toLocaleString(undefined, { maximumFractionDigits: 2 })]);
            case 'final_level':     return _lmUR('lmx.ui.valLevel', [Math.floor(value)]);
            case 'top_position':
            case 'final_position':  return '#' + Math.floor(value);
            case 'game_ended':      return value >= 1 ? _lmUR('lmx.ui.finished') : _lmUR('lmx.ui.notFinished');
            default:                return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
    };

    window._lmFormatChallengeGoal = function (type, goal) {
        goal = Number(goal);
        if (!Number.isFinite(goal)) return '\u2014';
        switch (type) {
            case 'normal_cells_eaten': return _lmUR(goal === 1 ? 'lmx.ui.goalCell' : 'lmx.ui.goalCells', [goal]);
            case 'time_total':         return _lmUR(goal === 1 ? 'lmx.ui.goalMinute' : 'lmx.ui.goalMinutes', [goal]);
            case 'final_level':        return _lmUR('lmx.ui.goalLevel', [goal]);
            case 'top_position':
            case 'final_position':     return '#' + goal;
            case 'game_ended':         return _lmUR('lmx.ui.finishGame');
            default:                   return String(goal);
        }
    };


    /* Expanding Land daily challenges (102 type 220, see _lmApplyDailyChallenges in ogario.v4.js).
     * null when the server sent none: the Challenges window is then exactly as before. */
    window._lmBuildDailyChallengesSection = function (t) {
        var st = window._lmDailyChallenges;
        if (!st || !Array.isArray(st.challenges) || !st.challenges.length) return null;
        if (!(window.legendmod && window.legendmod.isLegendWorld)) return null;
        var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

        var section = document.createElement('div');
        section.id = 'lm-daily-challenges';
        section.style.cssText = 'margin-bottom:18px;border:1px solid rgba(255,215,0,.25);border-radius:var(--lm-radius,6px);overflow:hidden;';

        var head = document.createElement('div');
        head.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,215,0,.08);border-bottom:1px solid rgba(255,255,255,.06);';
        var leftSecs = Math.max(0, Math.floor(((Number(st.resetAt) || 0) - Date.now()) / 1000));
        var mins = Math.ceil(leftSecs / 60), h = Math.floor(mins / 60), m = mins % 60;
        var leftText = h ? _lmUR('lmx.ui.durHM', [h, m]) : _lmUR('lmx.ui.durM', [m]);
        head.innerHTML = '<span style="font-size:22px;">\uD83D\uDCC5</span>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
            '<div style="flex:1;"><div style="font-weight:800;font-size:14px;color:' + t.tc + ';">' + _lmUE('dailyChallenges') + '</div>' +
            '<div style="font-size:11px;color:' + t.tc2 + ';margin-top:1px;">' + _lmUE('chNewIn').replace('{0}', esc(leftText)) + '</div></div>';
        section.appendChild(head);

        st.challenges.forEach(function (c) {
            var pr = typeof window._lmDailyChallengeProgress === 'function' ? window._lmDailyChallengeProgress(c) : { ratio: 0, text: '' };
            var done = !!c.completed, claimed = !!c.claimed;
            var row = document.createElement('div');
            row.className = 'lm-daily-challenge';
            row.setAttribute('data-slot', String(c.slot));
            row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.03);flex-wrap:wrap;' + (done ? 'background:rgba(76,175,80,.08);' : '');

            var icon = document.createElement('div');
            icon.style.cssText = 'width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;';
            if (done) {
                icon.style.background = 'linear-gradient(135deg,#4caf50,#66bb6a)';
                icon.style.color = '#fff';
                icon.style.fontWeight = '900';
                icon.textContent = '\u2713';
            } else {
                icon.style.background = 'rgba(255,255,255,.08)';
                icon.style.border = '2px solid rgba(255,255,255,.15)';
            }

            var text = document.createElement('div');
            text.style.cssText = 'flex:1;min-width:140px;font-size:13px;color:' + (done ? '#4caf50' : t.tc) + ';font-weight:' + (done ? '700' : '500') + ';';
            text.textContent = typeof window._lmDailyChallengeText === 'function' ? window._lmDailyChallengeText(c) : String(c.type);
            var reward = document.createElement('div');
            reward.style.cssText = 'font-size:10px;font-weight:600;color:' + t.tc2 + ';margin-top:2px;';
            reward.textContent = typeof window._lmDailyChallengeRewardText === 'function' ? window._lmDailyChallengeRewardText(c) : '';
            text.appendChild(reward);

            var bar = document.createElement('div');
            bar.style.cssText = 'width:80px;height:6px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,.08);overflow:hidden;flex-shrink:0;';
            var fill = document.createElement('div');
            fill.style.cssText = 'height:100%;border-radius:var(--lm-radius-s,4px);width:' + Math.round(pr.ratio * 100) + '%;background:' +
                (done ? 'linear-gradient(90deg,#4caf50,#66bb6a)' : 'linear-gradient(90deg,' + t.b1 + ',' + t.b2 + ')') + ';';
            bar.appendChild(fill);

            var prog = document.createElement('div');
            prog.className = 'lm-daily-challenge-progress';
            prog.style.cssText = 'min-width:64px;text-align:right;font-size:11px;font-weight:700;color:' + (done ? '#4caf50' : t.tc2) + ';flex-shrink:0;';
            prog.textContent = pr.text;

            var action = document.createElement('div');
            action.style.cssText = 'min-width:74px;text-align:right;flex-shrink:0;';
            if (claimed) {
                action.innerHTML = '<span style="font-size:11px;font-weight:700;color:#4caf50;">' + _lmUE('chClaimed') + '</span>';
            } else if (done) {
                var btn = document.createElement('button');
                btn.className = 'btn lm-daily-claim';
                btn.style.cssText = 'background:' + t.b1 + ';color:' + t.btc + ';font-weight:800;font-size:11px;padding:4px 12px;border-radius:var(--lm-radius,6px);border:none;cursor:pointer;';
                btn.textContent = _lmUR('chClaim');
                btn.onclick = function () {
                    btn.disabled = true;
                    btn.textContent = '\u23F3';
                    var sent = typeof window.claimDailyChallenge === 'function' && window.claimDailyChallenge(c.slot) !== false;
                    if (!sent) { btn.disabled = false; btn.textContent = _lmUR('chClaim'); }
                    else setTimeout(function () { if (btn.isConnected && btn.disabled) { btn.disabled = false; btn.textContent = _lmUR('chClaim'); } }, 8000);
                };
                action.appendChild(btn);
            }

            row.appendChild(icon);
            row.appendChild(text);
            row.appendChild(bar);
            row.appendChild(prog);
            row.appendChild(action);
            section.appendChild(row);
        });
        return section;
    };

    window.showChallengesModal = function () {
        injectStyles();
        var t = getTheme();
        var dailySection = typeof window._lmBuildDailyChallengesSection === 'function' ? window._lmBuildDailyChallengesSection(t) : null;

        var old = document.getElementById('lm-challenges-modal');
        if (old) old.remove();

        var challengeTypes = typeof window.getAgarAchievementTypes === 'function'
            ? window.getAgarAchievementTypes() : [];

        var evaluation = typeof window.getAgarLastChallengeEvaluation === 'function'
            ? window.getAgarLastChallengeEvaluation() : null;

        /*
         * If no evaluation cached yet (before first game-over this session),
         * try to evaluate from whatever gameOverField data may exist
         * (e.g. from a previous game in the same page load).
         */
        if (!evaluation && typeof window.evaluateAgarChallenges === 'function') {
            try {
                var gof = (window.LM && window.LM.lastGameOver) || window._lmLastGameOverField || null;
                if (gof && gof.gameSessionStats) {
                    var ctx = { gameEnded: true };
                    if (gof.xpLevelUpdates && gof.xpLevelUpdates.length) {
                        for (var xli = 0; xli < gof.xpLevelUpdates.length; xli++) {
                            if (gof.xpLevelUpdates[xli] && gof.xpLevelUpdates[xli].finalLevel) {
                                ctx.finalLevel = Number(gof.xpLevelUpdates[xli].finalLevel);
                                break;
                            }
                        }
                    }
                    evaluation = window.evaluateAgarChallenges(gof.gameSessionStats, ctx);
                }
            } catch (evalErr) {
                console.warn('[LM Challenges] Lazy evaluation failed:', evalErr);
            }
        }

        var hasGameData = !!(evaluation && evaluation.knownThresholdCount > 0);

        var modal = document.createElement('div');
        modal.id = 'lm-challenges-modal';
        modal.className = 'lm-modal-overlay';
        modal.style.zIndex = '1000000';
        modal.addEventListener('click', function (event) {
            if (event.target === modal) modal.remove();
        });

        var shell = document.createElement('div');
        shell.className = 'lm-modal-container';
        shell.style.cssText = 'background:' + t.pc + ';width:680px;max-width:94vw;';

        /* ─── HEADER ─── */
        var header = document.createElement('div');
        header.className = 'lm-modal-header';
        header.style.cssText = 'background:' + t.pc2 + ';padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;';

        var headerLeft = document.createElement('div');
        headerLeft.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:18px;font-weight:900;color:' + t.tc + ';';
        headerLeft.innerHTML = '\uD83C\uDFC5 ' + _lmUE('lmx.ui.challenges');

        var closeBtn = document.createElement('button');
        closeBtn.className = 'btn';
        closeBtn.style.cssText = 'background:transparent;border:none;color:' + t.tc2 + ';font-size:22px;cursor:pointer;padding:0 4px;';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', _lmUR('close'));
        closeBtn.onclick = function () { modal.remove(); };

        header.appendChild(headerLeft);
        header.appendChild(closeBtn);
        shell.appendChild(header);

        /* ─── SUMMARY BAR ─── */
        if (evaluation) {
            var summaryBar = document.createElement('div');
            summaryBar.style.cssText = 'padding:10px 20px;background:rgba(255,215,0,.08);border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:' + t.tc2 + ';';

            var summaryLeft = document.createElement('span');
            summaryLeft.innerHTML = _lmUE('lmx.ui.lastGameThresholds', [evaluation.metThresholdCount, evaluation.knownThresholdCount]).replace('&lt;b&gt;', '<b style="color:' + t.b2 + ';">').replace('&lt;/b&gt;', '</b>');

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
            /* with daily challenges shown there is nothing to wait for */
            if (!dailySection) body.innerHTML = '<div style="text-align:center;padding:30px 0;color:' + t.tc2 + ';font-size:14px;">' + _lmUE('lmx.ui.noChallenges') + '<br><span style="font-size:11px;opacity:.6;">' + _lmUE('lmx.ui.waitingConfig') + '</span></div>';
        } else {
            /* Show a banner when config exists but no game data yet */
            if (!hasGameData) {
                var noDataBanner = document.createElement('div');
                noDataBanner.style.cssText = 'text-align:center;padding:14px 20px;margin-bottom:12px;border-radius:var(--lm-radius,6px);background:rgba(255,193,7,.1);border:1px solid rgba(255,193,7,.2);';
                noDataBanner.innerHTML =
                    '<div style="font-size:13px;font-weight:700;color:#ffd54f;">\uD83C\uDFAE ' + _lmUE('lmx.ui.playToSeeProgress') + '</div>' + // i18n-ok: emoji icon and CSS; the texts come from the packs
                    '<div style="font-size:10px;color:' + t.tc2 + ';margin-top:4px;">' + _lmUE('lmx.ui.challengesEvaluated') + '</div>';
                body.appendChild(noDataBanner);
            }

            for (var ti = 0; ti < challengeTypes.length; ti++) {
                var type = challengeTypes[ti];
                var pres = window._lmGetChallengePresentation(type);
                var group = evaluation && evaluation.byType ? evaluation.byType[type] : null;
                var definitions = typeof window.getAgarAchievements === 'function'
                    ? window.getAgarAchievements(type) : [];

                /* Type section */
                var section = document.createElement('div');
                section.style.cssText = 'margin-bottom:18px;border:1px solid rgba(255,255,255,.08);border-radius:var(--lm-radius,6px);overflow:hidden;';

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
                    valueBadge.innerHTML = '<span style="opacity:.4;">' + _lmUE('lmx.ui.noData') + '</span>';
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
                    progressWrap.style.cssText = 'width:100px;height:6px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,.08);overflow:hidden;flex-shrink:0;';
                    var progressFill = document.createElement('div');
                    var pct = Math.round(progress * 100);
                    progressFill.style.cssText = 'height:100%;border-radius:var(--lm-radius-s,4px);transition:width .3s;width:' + pct + '%;background:' +
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

        if (dailySection) body.insertBefore(dailySection, body.firstChild);
        shell.appendChild(body);

        /* ─── FOOTER ─── */
        var footer = document.createElement('div');
        footer.style.cssText = 'padding:10px 20px;border-top:1px solid rgba(255,255,255,.08);text-align:center;';
        footer.innerHTML = '<span style="font-size:10px;color:' + t.tc2 + ';opacity:.5;">' + _lmUE('lmx.ui.progressFooter') + '</span>';
        if (dailySection && challengeTypes.length === 0) footer.innerHTML = '<span style="font-size:10px;color:' + t.tc2 + ';opacity:.5;">' + _lmUE('chFooter') + '</span>';
        shell.appendChild(footer);

        modal.appendChild(shell);
        document.body.appendChild(modal);
    };


    /* A new daily challenge list (game over, claim) redraws an open Challenges window. */
    document.addEventListener('lm-daily-challenges-updated', function () {
        if (document.getElementById('lm-challenges-modal') && typeof window.showChallengesModal === 'function') window.showChallengesModal();
        if (typeof window._lmUpdateClaimLabel === 'function') window._lmUpdateClaimLabel(false);
    });

    /* Listen for challenge evaluation and optionally auto-show toast */
    /* Challenges were removed (owner decision): agar.io web has no achievements; the window
     * only compared the last game with the config's Play Games thresholds. No toast either. */
    document.addEventListener('lm-challenges-evaluated', function (e) {
        var ev = e && e.detail;
        if (!ev || ev.metThresholdCount <= 0 || !window._lmShowChallenges) return;

        if (window.toastr) {
            var msg = '<b>\uD83C\uDFC5 ' + _lmUE('lmx.ui.challenges') + ':</b> ' + _lmUE(ev.metThresholdCount > 1 ? 'lmx.ui.thresholdsMet' : 'lmx.ui.thresholdMet', [ev.metThresholdCount]); // i18n-ok: emoji icon and CSS; the texts come from the packs
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
        // i18n-ok: emoji icons only; every label in this template comes from the packs (data-i18n keeps it current)
        btnGroup.innerHTML = `
            <button id="lm-daily-deal-btn" class="btn btn-danger btn-shop" disabled="disabled" style="display: none; flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="${window._lmLoginHint ? String(window._lmLoginHint()).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : _lmUE('lmx.ui.loginPlayFirst')}">
                🔥 <span data-i18n="offer">${_lmUE('offer')}</span>
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;" data-i18n="needLogin">${_lmUE('needLogin')}</div>
            </button>
            <button id="lm-leagues-btn" class="btn btn-warning btn-shop" disabled="disabled" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="${window._lmLoginHint ? String(window._lmLoginHint()).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : _lmUE('lmx.ui.loginPlayFirst')}">
                <i class="fa fa-trophy"></i> <span data-i18n="leagues">${_lmUE('leagues')}</span>
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;" data-i18n="needLogin">${_lmUE('needLogin')}</div>
            </button>
            <button id="lm-friends-btn" class="btn btn-info btn-shop" disabled="disabled" style="display: none; flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="${_lmUE('lmx.ui.friendsBtnHint')}">
                <i class="fa fa-users"></i> <span data-i18n="friends">${_lmUE('friends')}</span>
                <div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;" data-i18n="needLogin">${_lmUE('needLogin')}</div>
            </button>
            <button id="lm-claim-all-btn" class="btn btn-primary btn-shop" style="flex: 1; font-weight: 700; padding: 6px 2px; font-size: 11px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;" title="${_lmUE('lmx.ui.claimAllTitle')}" data-i18n-title="lmx.ui.claimAllTitle">
                \uD83C\uDF81 <span data-i18n="claimAll">${_lmUE('claimAll')}</span>
            </button>
            <button id="lm-claim-remind" class="btn btn-default" style="flex: 0 0 auto; padding: 6px 7px; font-size: 11px; cursor: pointer;" title="${_lmUE('lmx.ui.remindTitle')}" data-i18n-title="lmx.ui.remindTitle">${(function () { try { return localStorage.getItem('lmClaimRemind') === '1' ? '\uD83D\uDD14' : '\uD83D\uDD15'; } catch (e) { return '\uD83D\uDD15'; } })()}</button>

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
            <div class="lm-modal-container" style="background: ${t.pc}; width: 500px;">
                <div class="lm-modal-header" style="background: ${t.pc2};">
                    <div class="lm-modal-title" style="color: ${t.mc};">
                        <span>👤</span> ${_lmUE('statsTitle')}
                    </div>
                    <button type="button" aria-label="${_lmUE('close')}" class="lm-modal-close" onclick="document.getElementById('lm-stats-modal').remove();">&times;</button>
                </div>
                <div class="lm-modal-body">
                    <div class="lm-stats-grid">
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">🎖️</span>
                            <div class="lm-stat-value" style="color: ${t.mc};">${stats.level || 1}</div>
                            <div class="lm-stat-label">${_lmUE('levelWord')}</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">👑</span>
                            <div class="lm-stat-value" style="color: ${t.b2};">${(stats.highestMass || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">${_lmUE('highestMass')}</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">⚔️</span>
                            <div class="lm-stat-value" style="color: ${t.b3};">${(stats.mostCellsEaten || stats.cellsEaten || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">${_lmUE('cellsEaten')}</div>
                        </div>
                        <div class="lm-stat-card">
                            <span style="font-size: 24px;">🎮</span>
                            <div class="lm-stat-value" style="color: ${t.b4};">${(stats.gamesPlayed || 0).toLocaleString()}</div>
                            <div class="lm-stat-label">${_lmUE('gamesPlayed')}</div>
                        </div>
                        <div class="lm-stat-card" style="grid-column: 1 / -1;">
                            <span style="font-size: 24px;">⚖️</span>
                            <div class="lm-stat-value" style="color: ${t.b2};">${(Number(stats.gamesPlayed) > 0 && stats.allTimeScore != null && isFinite(Number(stats.allTimeScore))) ? Math.floor(Number(stats.allTimeScore) / Number(stats.gamesPlayed)).toLocaleString() : '\u2014'}</div>
                            <div class="lm-stat-label">${_lmUE('avgMass')}</div>
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
                    '<b>[' + _lmUE('lmx.ui.tagLoginRequired') + ']:</b> ' + (window._lmLoginHint ? window._lmLoginHint() : _lmUE('lmx.ui.loginPlayFirst'))
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
        var trophies = appUser.trophy || appUser.trophies || 0; /* the user model stores 'trophy' */

        $('#coins').html('💰 ' + coins.toLocaleString());
        $('#dna').html('🧬 ' + dna.toLocaleString());
        $('#trophy, #trophies').html('🏆 ' + trophies.toLocaleString());
        $('#coinsCountModal').text(coins.toLocaleString());
        $('#dnaCountModal').text(dna.toLocaleString());

        // 2. Profile Name & Social ID / UID
        var name = appUser.displayName || appUser.name || _lmUR('lmx.ui.guest');
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
            '#lm-extended-menu-btns button:not(#lm-claim-remind)' /* the reminder bell is a local setting */
        );

        menuBtns
            .prop('disabled', !buttonsEnabled)
            .attr(
                'aria-disabled',
                buttonsEnabled ? 'false' : 'true'
            );

        var ribbonBadgeHtml = '<div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;" data-i18n="needLogin">' + _lmUE('needLogin') + '</div>';

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
                _lmUR('lmx.ui.uidHint')
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
            friendsBtn.css({ opacity: 0.5, filter: 'grayscale(35%)', cursor: 'not-allowed', pointerEvents: 'none' }).attr('title', _lmUR('lmx.ui.friendsAccessHint'));
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
                    _lmUR('lmx.ui.xpProgress', [xp, nextXp])
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
        if (!window.LM) window.LM = {};
        if (!window.LM.user) window.LM.user = {};
        if (!window.LM.user.potionsStatus) window.LM.user.potionsStatus = {};

        var potionsContainer = $('.potions-container');
        if (potionsContainer.length) {
            potionsContainer.css({ position: 'relative', overflow: 'visible' });
            if (!document.getElementById('lm-potions-help-btn')) {
                var helpBtn = $('<button id="lm-potions-help-btn" style="position: absolute; right: -28px; top: 4px; width: 22px; height: 22px; border-radius: 50%; background: #00d3ff; color: #fff; border: 2px solid #fff; font-weight: 900; font-size: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.4); z-index: 5; line-height: 1; text-align: center; padding: 0; pointer-events: auto;" title="' + _lmUE('lmx.ui.potionsHelp') + '" data-i18n-title="lmx.ui.potionsHelp">?</button>');
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

        /* The slot state lives in legendmod.user.potionsStatus (application.updatePotions /
         * newPotion). The old merge here read appUser.potions (the wallet map, not a
         * slot list) by index and only wrote the window.LM stub: it never ran. */

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
                    ? _lmUR('lmx.ui.friendsJoinHint')
                    : (!hasUserUID
                        ? _lmUR('lmx.ui.uidPlayHint')
                        : (!isFacebookLoggedIn
                            ? _lmUR('lmx.ui.friendsFbRequired')
                            : _lmUR('lmx.ui.joinServerFirst')));
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

    /*
     * Reward links use agar.io's own format, ?awardToken=... (see agario/bundle_start.js,
     * registerQueryHandlers). This function was called below but never defined, so the
     * banner never appeared. The loaders keep the launch URL in localStorage "url".
     * Only URL-safe token characters are accepted.
     */
    if (typeof window.parseRewardToken !== 'function') {
        window.parseRewardToken = function (href) {
            function pick(u) {
                if (!u) return '';
                try { return new URL(String(u), location.href).searchParams.get('awardToken') || ''; }
                catch (e) { return ''; }
            }
            var token = pick(href);
            if (!token) { try { token = pick(localStorage.getItem('url')); } catch (e) { token = ''; } }
            return /^[A-Za-z0-9._~-]{3,256}$/.test(token) ? token : '';
        };
    }

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
            bannerEl.style.cssText = 'margin: 10px 0; border-radius:var(--lm-radius,6px); overflow: hidden; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; padding: 6px; clear: both; width: 100%; box-sizing: border-box; transition: transform 0.2s ease-in-out;';
            
            if (targetContainer.find('#lm-extended-menu-btns').length) {
                targetContainer.find('#lm-extended-menu-btns').after(bannerEl);
            } else {
                targetContainer.prepend(bannerEl);
            }
        }

        bannerEl.dataset.token = token;
        /* escaped: the token comes from the page URL */
        var displayToken = $('<div>').text(token.length > 20 ? (token.substring(0, 18) + '...') : token).html();

        bannerEl.innerHTML = `
            <a id="legendAdAnchor3" href="#" onclick="window.claimPromoBannerReward(); return false;" style="display: block; text-decoration: none;">
                <div id="lm-promo-banner-title" style="color: #00ff88; font-size: 13px; font-weight: 800; margin-top: 6px; text-shadow: 0 1px 3px #000; letter-spacing: 0.5px;">
                    🎁 ${_lmUE('lmx.ui.redeemPromo', ['\u0001']).replace('\u0001', displayToken)}
                </div>
            </a>
        `;
    };

    window.claimPromoBannerReward = function() {
        var token = window.currentPromoToken || (typeof window.parseRewardToken === 'function' ? window.parseRewardToken(window.location.href) : '');
        if (!token) {
            if (window.toastr) toastr.warning('<b>[' + _lmUE('lmx.ui.tagPromo') + ']:</b> ' + _lmUE('lmx.ui.noPromoToken'));
            return;
        }

        if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('claim promo reward')) {
            return;
        }

        var titleEl = document.getElementById('lm-promo-banner-title');
        if (titleEl) titleEl.innerHTML = '🎁 ' + _lmUE('lmx.ui.claimingPromo');

        if (typeof window.activateRewardLink === 'function') {
            window.activateRewardLink(token);
        }

        setTimeout(function() {
            if (titleEl) titleEl.innerHTML = '✨ ' + _lmUE('lmx.ui.promoSent');
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


        // Wallet type-2 items live on application.user.boosts.
        var inventory =
            typeof window._lmGetBoostInventory === 'function'
                ? window._lmGetBoostInventory()
                : {};


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
                    _lmUR('lmx.ui.selectBoost')
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
                    ? _lmUR('lmx.ui.mass')
                    : _lmUR('lmx.ui.xp');


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
                    : _lmUR('lmx.ui.durM', [info.durationMins || 0]);


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
                _lmUR('lmx.ui.boostOption', [info.multiplier, typeName, duration]);


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
                    ' \u2014 ' + _lmUR('lmx.ui.ownedLower', [owned]);
            }


            if (
                info.bestDeal
            ) {
                label +=
                    ' \u2605 ' + _lmUR('lmx.ui.best');
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

            /*
             * Refresh all static presentation metadata now that the canonical
             * GameConfiguration index is available.
             */
            if (
                typeof window
                    .applyAgarVisualConfiguration ===
                    'function'
            ) {
                window
                    .applyAgarVisualConfiguration();
            }


            /*
             * If the profile UI is already visible, make it consume the newly
             * configured league presentation immediately.
             */
            if (
                typeof window
                    .syncProfileTabUI ===
                    'function'
            ) {
                try {
                    window
                        .syncProfileTabUI();
                } catch (
                    leagueVisualRefreshError
                ) {
                }
            }
        }
    );


    // Auto-initialize menu buttons and profile sync when DOM is ready
    $(document).ready(function() {
        /* The friend list (147) can arrive before #lm-friends-btn exists, or the button
         * can be rebuilt hidden: reveal it from the stored list, not only on the event. */
        var revealFriendsBtnFromData = function () {
            var fl = window._friendListData;
            if (fl && fl.friends && fl.friends.length) $('#lm-friends-btn').css('display', '');
        };
        setTimeout(function() {
            initMenuButtons();
            initBoostDropdown();
            syncProfileTabUI();
            revealFriendsBtnFromData();
            setInterval(function() {
                /* Skip when the tab is hidden or the menu is not visible (ogario hides
                 * #overlays while playing; #mainPanel is removed at init). */
                if (document.hidden) return;
                var menu = document.getElementById('overlays');
                if (menu && menu.style.display === 'none') return;
                initMenuButtons();
                syncProfileTabUI();
                revealFriendsBtnFromData();
            }, 5000);
        }, 1000);

        $(document).off('click', '#lm-claim-all-btn').on('click', '#lm-claim-all-btn', function(e) {
            e.preventDefault();
            /* same login guard as the other account buttons */
            if (typeof window._lmExtendedMenuEnabled === 'function' && !window._lmExtendedMenuEnabled()) {
                return false;
            }
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

        /* The Friends button stays hidden until the server pushes a non-empty friend
         * list (147); it then opens that list (showFriendsModal had no entry point). */
        if (!window._lmFriendsBtnRevealBound) {
            window._lmFriendsBtnRevealBound = true;
            document.addEventListener('friendListUpdate', function (e) {
                var d = e && e.detail;
                if (d && d.friends && d.friends.length) $('#lm-friends-btn').css('display', '');
            });
        }

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
                            '<b>[' + _lmUE('lmx.ui.tagFriendsLeague') + ']:</b> ' + _lmUE('lmx.ui.friendsLeagueLogin')
                        );
                    }

                    return false;
                }

                /* The server pushed a friend list (147): show it. Otherwise the
                 * Leagues friends tab, below. */
                if (
                    window._friendListData &&
                    window._friendListData.friends &&
                    window._friendListData.friends.length &&
                    typeof window.showFriendsModal === 'function'
                ) {
                    window.showFriendsModal();
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
                        '<b>[' + _lmUE('lmx.ui.tagOffer') + ']:</b> ' + _lmUE('lmx.ui.offerOpenerNotReady')
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
                toastr.error('<b>[' + _lmUE('lmx.ui.tagShop') + ']:</b> ' + _lmUE('lmx.ui.skinShopNotReady'));
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
