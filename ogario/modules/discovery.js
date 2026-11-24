/* Legend Mod "Discover features" guide and "What works on this server".
 *
 * Discover features: one short card per optional feature (Command Centre, HUD helpers, Replay Studio,
 * Analytics, ...) with what it does, one-tap switches for its options (the real menu checkboxes, so
 * setSettings, saving and the NEW badges stay as they are), "Open" for its window and "Show in
 * settings", which opens the menu at the option and makes it blink (the Command Centre reveal). A
 * switch with a HUD part (quick bar, bell, cell panel) highlights where it appeared.
 *
 * After an update it opens once by itself, only for a returning player (one who had the guide or saw
 * the settings NEW badges of an older version; never on the first visit) and only while it has cards
 * that player has not seen; it waits until the menu is shown
 * and nobody is playing. "Show after updates" turns that off. The card ids seen, the last version and
 * that switch are in localStorage 'lmDiscover' (validated on read). Reachable from the Command Centre
 * and the link in the "What's new" toast.
 *
 * What works on this server: a static table, checked against the code, of which features work on
 * each server type (window.legendmod.serverType). It is only a guide: nothing is gated by it.
 *
 * The pure parts are in LMDiscovery.core (developers/tests/discovery.js runs this file in a vm).
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmDiscoveryLoaded) return;
    W._lmDiscoveryLoaded = true;

    var KEY = 'lmDiscover';
    var MAX_SEEN = 100;
    var own = Object.prototype.hasOwnProperty;

    /* ═══ Server types and what works on them ═══ */

    var SERVER_TYPES = [
        { id: 'agario', en: 'agar.io' },
        { id: 'expandingland', en: 'Expanding Land' },
        { id: 'senpa', en: 'Senpa' },
        { id: 'garix', en: 'Garix' },
        { id: 'sigmally', en: 'Sigmally' },
        { id: 'imsolo', en: 'Imsolo' },
        { id: 'agar2', en: 'Agar2' },
        { id: 'deltio', en: 'delt.io' },
        { id: 'private', en: 'MultiOgar / private' }
    ];
    /* v: y works, n does not, p partly (see the note), u not verified. Types not listed are n.
     * Where in ogario.v4.js (or the module) the behaviour comes from is in the comment. */
    var CAPS = [
        /* recording is in _lmHandlePacket, called from handleMessage; Sigmally and Senpa packets are
         * decoded by their own paths in onMessage, which return before handleMessage */
        { id: 'replays', en: 'Replays and Replay Studio', el: 'Επαναλήψεις και Replay Studio',
            v: { agario: 'y', expandingland: 'y', garix: 'y', imsolo: 'y', agar2: 'y', deltio: 'y', private: 'y' } },
        /* spect.js: the extra unit sends only the classic 254/255 handshake (no Senpa / Sigmally login,
         * no Garix subprotocol) */
        { id: 'multibox', en: 'Multibox (second unit)', el: 'Multibox (δεύτερη μονάδα)',
            v: { agario: 'y', expandingland: 'y', imsolo: 'y', agar2: 'y', private: 'y', garix: 'u', deltio: 'u' } },
        /* hudhelpers.js mergeFrame: LM.integrity && !LM.isLegendWorld (agar.io merge times) */
        { id: 'mergeCountdown', en: 'Merge countdown on own cells', el: 'Αντίστροφη μέτρηση συγχώνευσης',
            v: { agario: 'y' } },
        /* split prediction: LM.integrity && !LM.isLegendWorld */
        { id: 'splitPrediction', en: 'Split prediction', el: 'Πρόβλεψη διαχωρισμού', v: { agario: 'y' } },
        /* sendPlayerPosition / setParty have no server gate (relay, or ogarioWS on private) */
        { id: 'teammates', en: 'Teammates on the minimap, team chat', el: 'Συμπαίκτες στον χάρτη, συνομιλία ομάδας',
            v: { agario: 'y', expandingland: 'y', senpa: 'y', garix: 'y', sigmally: 'y', imsolo: 'y', agar2: 'y', deltio: 'y', private: 'y' } },
        /* chat opcode 99: !integrity && not Sigmally / Senpa && no clan tag; Expanding Land uses its team
         * chat (202) with a tag or in Teams */
        { id: 'serverChat', en: 'Public server chat', el: 'Δημόσια συνομιλία διακομιστή',
            v: { expandingland: 'p', garix: 'y', imsolo: 'y', agar2: 'y', private: 'y', deltio: 'u' },
            note: { expandingland: { en: 'without a clan tag, outside Teams', el: 'χωρίς tag, εκτός Teams' } } },
        /* doubleSplit / tripleSplit / split16: Senpa opcode 22, Imsolo / Agar2 / Garix / private 26-28;
         * the others send quick single splits */
        { id: 'splitMacros', en: 'Double / triple / 16 split in one step', el: 'Διπλό / τριπλό / 16 split με μία κίνηση',
            v: { senpa: 'y', garix: 'y', imsolo: 'y', agar2: 'y', private: 'y', agario: 'p', expandingland: 'p', sigmally: 'p', deltio: 'p' },
            note: { '*': { en: 'sent as quick single splits', el: 'στέλνεται ως γρήγορα απλά split' } } },
        /* freeze: sendAction(32) only for the same four types */
        { id: 'freeze', en: 'Freeze cells (hotkey)', el: 'Πάγωμα κυττάρων (πλήκτρο)', v: { garix: 'y', imsolo: 'y', agar2: 'y', private: 'y' } },
        /* free spectate: Senpa and Sigmally have their own spectate paths, the others opcode 1 / 18 */
        { id: 'spectate', en: 'Spectate and free spectate', el: 'Θέαση και ελεύθερη θέαση',
            v: { agario: 'y', expandingland: 'y', senpa: 'y', garix: 'y', sigmally: 'y', imsolo: 'y', agar2: 'y', deltio: 'y', private: 'y' } },
        /* the World Spectate button is shown only for expandingland */
        { id: 'worldSpectate', en: 'World Spectate (whole map)', el: 'World Spectate (όλος ο χάρτης)', v: { expandingland: 'y' } },
        /* social login buttons enabled only for agario and expandingland; the token is sent to no other */
        { id: 'login', en: 'Login, account skins, leagues', el: 'Σύνδεση, skins λογαριασμού, πρωταθλήματα',
            v: { agario: 'y', expandingland: 'y' } },
        /* agar.io parties go through the official API */
        { id: 'party', en: 'agar.io party codes', el: 'Κωδικοί party του agar.io', v: { agario: 'y' } },
        /* server option 5003: wss://api.legendmod.ml/el-room/... */
        { id: 'rooms', en: 'Private rooms', el: 'Ιδιωτικά δωμάτια', v: { expandingland: 'y' } },
        /* claimDailyChallenge, server events and the account match history need isLegendWorld */
        { id: 'elAccount', en: 'Daily challenges, events, match history on the account', el: 'Ημερήσιες προκλήσεις, events, ιστορικό στον λογαριασμό',
            v: { expandingland: 'y' } }
    ];
    var TYPE_IDS = SERVER_TYPES.map(function (s) { return s.id; });

    /* the server type of a connection object (window.legendmod), '' when unknown / not connected */
    function serverTypeOf(LM) {
        if (!LM || typeof LM !== 'object') return '';
        if (LM.isLegendWorld === true) return 'expandingland';
        var t = typeof LM.serverType === 'string' ? LM.serverType : '';
        return TYPE_IDS.indexOf(t) >= 0 ? t : '';
    }
    function capValue(row, type) {
        var v = row && row.v && own.call(row.v, type) ? row.v[type] : 'n';
        return v === 'y' || v === 'p' || v === 'u' ? v : 'n';
    }
    function capNote(row, type, lng) {
        if (!row || !row.note || capValue(row, type) !== 'p') return '';
        var n = own.call(row.note, type) ? row.note[type] : row.note['*'];
        return n ? (n[lng] || n.en || '') : '';
    }
    /* the rows for one type: works first, then partly, not verified, does not */
    function capsFor(type, lng) {
        var order = { y: 0, p: 1, u: 2, n: 3 };
        return CAPS.map(function (r, i) {
            return { id: r.id, label: (lng && r[lng]) || r.en, v: capValue(r, type), note: capNote(r, type, lng || 'en'), i: i };
        }).sort(function (a, b) { return order[a.v] - order[b.v] || a.i - b.i; });
    }

    /* ═══ Stored state ═══ */

    function parseStore(raw) {
        var o = null;
        if (typeof raw === 'string' && raw.length < 20000) { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        if (!o || typeof o !== 'object' || Array.isArray(o)) return { v: '', seen: [], off: false, had: false };
        var seen = [];
        if (Array.isArray(o.seen)) {
            for (var i = 0; i < o.seen.length && seen.length < MAX_SEEN; i++) {
                var s = o.seen[i];
                if (typeof s === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(s) && seen.indexOf(s) < 0) seen.push(s);
            }
        }
        return { v: typeof o.v === 'string' ? o.v.slice(0, 40) : '', seen: seen, off: o.off === true, had: true };
    }
    function serializeStore(st) {
        return JSON.stringify({ v: st.v || '', seen: (st.seen || []).slice(0, MAX_SEEN), off: !!st.off });
    }
    function unseenIds(st, ids) {
        return ids.filter(function (id) { return st.seen.indexOf(id) < 0; });
    }
    /* open by itself: a player who had the guide before, a new version, cards not seen yet */
    function shouldAutoOpen(st, ver, ids) {
        return !!(st.had && !st.off && ver && st.v !== String(ver) && unseenIds(st, ids).length);
    }

    /* no guide state yet: a player who saw the settings NEW badges of an older version (localStorage
     * lmNewBadgesSeen) is back after an update; anyone else is here for the first time */
    function firstState(st, badgesSeen, ver) {
        if (st.had) return st;
        var b = typeof badgesSeen === 'string' ? badgesSeen.slice(0, 40) : '';
        if (b && ver && b !== String(ver)) return { v: b, seen: [], off: false, had: true };
        return st;
    }

    /* ═══ Feature cards ═══ */

    /* opts: option keys (checkboxes of the settings menu); show: where a switched-on option appears;
     * open: the window, avail: whether it can be opened here */
    function fn(path) {
        return function () {
            var o = W, p = path.split('.');
            for (var i = 0; i < p.length - 1; i++) { o = o && o[p[i]]; }
            return o && typeof o[p[p.length - 1]] === 'function' ? o : null;
        };
    }
    function opener(path, arg) {
        var get = fn(path), name = path.split('.').pop();
        return { avail: function () { return !!get(); }, run: function () { var o = get(); if (o) o[name](arg); } };
    }
    var CARDS = [
        { id: 'commandCentre', en: 'Command Centre', el: 'Κέντρο εντολών',
            d: { en: 'Ctrl+K: search and run any setting, hotkey or window. Star favourites for a quick bar in game.', el: 'Ctrl+K: αναζήτηση και εκτέλεση κάθε ρύθμισης, πλήκτρου ή παραθύρου. Τα αγαπημένα μπαίνουν σε γρήγορη μπάρα.' },
            opts: ['commandCentreBar'], show: { commandCentreBar: '#lm-cc-bar' }, win: opener('LMCommandCentre.open') },
        { id: 'hudHelpers', en: 'HUD helpers', el: 'Βοηθοί HUD',
            d: { en: 'Movement arrow, merge countdown, relative enemy mass, edge arrows to teammates and threats, a cell mass panel.', el: 'Βέλος κίνησης, αντίστροφη μέτρηση συγχώνευσης, σχετική μάζα, βέλη στις άκρες, πίνακας μάζας κυττάρων.' },
            opts: ['hudMoveDir', 'hudMergeCountdown', 'hudRelativeMass', 'hudEdgeTeammates', 'hudEdgeThreats', 'hudCellPanel'], show: { hudCellPanel: '#lm-hh-cells' } },
        { id: 'replayStudio', en: 'Replay Studio', el: 'Replay Studio',
            d: { en: 'Timeline, bookmarks, speed and a replay library for the games you recorded.', el: 'Χρονολόγιο, σελιδοδείκτες, ταχύτητα και βιβλιοθήκη για τα παιχνίδια που καταγράφηκαν.' },
            opts: ['recordReplays'], win: opener('lmReplayStudio', 'open') },
        { id: 'analytics', en: 'Analytics', el: 'Αναλύσεις',
            d: { en: 'Your games over time: stats, heatmaps, a coach with tips and daily objectives. Kept in this browser.', el: 'Τα παιχνίδια σου: στατιστικά, χάρτες θερμότητας, προπονητής και ημερήσιοι στόχοι. Μένουν στον browser.' },
            opts: ['analytics'], win: opener('LMAnalytics.open') },
        { id: 'deathRecap', en: 'Death recap and kill feed', el: 'Ανασκόπηση θανάτου και ροή',
            d: { en: 'The last 20 s before a death on the Game Over card, a small feed of your eats, alerts on big mass loss.', el: 'Τα τελευταία 20 δ πριν τον θάνατο στην κάρτα Game Over, ροή φαγωμάτων, ειδοποίηση για μεγάλη απώλεια.' },
            opts: ['deathRecap', 'killFeed', 'massLossAlert'] },
        { id: 'adaptivePerf', en: 'Adaptive performance', el: 'Προσαρμοστική απόδοση',
            d: { en: 'While FPS stays low, costly effects go off for now and come back when it is fast again. Diagnostics window.', el: 'Όσο τα FPS μένουν χαμηλά, τα βαριά εφέ κλείνουν προσωρινά. Παράθυρο διαγνωστικών.' },
            opts: ['adaptivePerf', 'netHistory'], win: opener('LMPerf.openDiag') },
        { id: 'gamepad', en: 'Gamepad', el: 'Χειριστήριο',
            d: { en: 'Play with a controller: button map, stick sensitivity, profiles and a live test.', el: 'Παίξε με χειριστήριο: αντιστοίχιση κουμπιών, ευαισθησία, προφίλ και δοκιμή.' },
            opts: ['gamepadEnabled'], win: opener('LMGamepad.openWindow') },
        { id: 'profiles', en: 'Settings profiles', el: 'Προφίλ ρυθμίσεων',
            d: { en: 'Named sets of settings, theme and hotkeys, with backups and Undo; can switch by server.', el: 'Ονομασμένα σύνολα ρυθμίσεων, θέματος και πλήκτρων, με αντίγραφα και αναίρεση.' },
            opts: [], win: opener('LMProfiles.open') },
        { id: 'notifications', en: 'Notification centre', el: 'Κέντρο ειδοποιήσεων',
            d: { en: 'A bell with the last messages you missed, and a sound mixer per channel.', el: 'Καμπανάκι με τα τελευταία μηνύματα και μίκτης ήχου ανά κανάλι.' },
            opts: ['notificationCentre'], show: { notificationCentre: '#lm-notif-bell' }, win: opener('LMNotifications.open') },
        { id: 'hudEditor', en: 'HUD editor', el: 'Επεξεργασία HUD',
            d: { en: 'Move, resize, lock the HUD boxes and save layouts (also per settings profile).', el: 'Μετακίνηση, μέγεθος, κλείδωμα πλαισίων HUD και αποθήκευση διατάξεων.' },
            opts: [], win: opener('LMHudEditor.open') },
        { id: 'director', en: 'Spectator director', el: 'Σκηνοθέτης θέασης',
            d: { en: 'For spectating: auto camera on the action, watchlist, camera bookmarks and a broadcast HUD.', el: 'Για θέαση: αυτόματη κάμερα, λίστα παρακολούθησης, σελιδοδείκτες κάμερας, HUD μετάδοσης.' },
            opts: [], win: opener('LMDirector.open') },
        { id: 'companion', en: 'Stream overlay', el: 'Επικάλυψη stream',
            d: { en: 'A second screen or OBS source with mass, rank, minimap and leaderboard.', el: 'Δεύτερη οθόνη ή πηγή OBS με μάζα, θέση, χάρτη και κατάταξη.' },
            opts: ['companionLive', 'companionChat'], win: opener('LMCompanion.open') },
        { id: 'touchEditor', en: 'Touch control editor', el: 'Επεξεργασία κουμπιών αφής',
            d: { en: 'Phones: move and resize the touch buttons and the joystick.', el: 'Κινητά: μετακίνηση και μέγεθος κουμπιών αφής και joystick.' },
            opts: [], win: opener('_lmMobileHost.openEditor'), phoneOnly: true }
    ];
    var CARD_IDS = CARDS.map(function (c) { return c.id; });

    var core = {
        SERVER_TYPES: SERVER_TYPES, CAPS: CAPS, CARDS: CARDS, KEY: KEY, MAX_SEEN: MAX_SEEN,
        serverTypeOf: serverTypeOf, capValue: capValue, capNote: capNote, capsFor: capsFor,
        parseStore: parseStore, serializeStore: serializeStore, unseenIds: unseenIds, shouldAutoOpen: shouldAutoOpen, firstState: firstState
    };
    var api = W.LMDiscovery = { core: core };

    var D = W.document;
    if (!D || typeof D.createElement !== 'function' || typeof D.addEventListener !== 'function') return;

    /* ═══ Text ═══ */

    var STR = {
        title: { en: 'Discover features', el: 'Ανακάλυψε λειτουργίες' },
        tabFeatures: { en: 'Features', el: 'Λειτουργίες' },
        tabServer: { en: 'This server', el: 'Αυτός ο διακομιστής' },
        intro: { en: 'Everything here is optional and off until you turn it on.', el: 'Όλα είναι προαιρετικά και κλειστά μέχρι να τα ανοίξεις.' },
        open: { en: 'Open', el: 'Άνοιγμα' },
        showMe: { en: 'Show in settings', el: 'Δείξε στις ρυθμίσεις' },
        on: { en: 'ON', el: 'ΝΑΙ' },
        off: { en: 'OFF', el: 'ΟΧΙ' },
        look: { en: 'Turned on: it is highlighted on the screen.', el: 'Άνοιξε: φαίνεται τονισμένο στην οθόνη.' },
        later: { en: 'Turned on: it shows while you play.', el: 'Άνοιξε: φαίνεται όταν παίζεις.' },
        offNow: { en: 'Turned off.', el: 'Έκλεισε.' },
        noMenu: { en: 'Open the settings once first.', el: 'Άνοιξε πρώτα μία φορά τις ρυθμίσεις.' },
        autoShow: { en: 'Show after updates', el: 'Εμφάνιση μετά από ενημερώσεις' },
        close: { en: 'Close', el: 'Κλείσιμο' },
        serverTitle: { en: 'What works on this server', el: 'Τι λειτουργεί σε αυτόν τον διακομιστή' },
        current: { en: 'Connected to: {s}', el: 'Συνδεδεμένος σε: {s}' },
        notConnected: { en: 'Not connected: pick a server type.', el: 'Χωρίς σύνδεση: διάλεξε τύπο διακομιστή.' },
        y: { en: 'works', el: 'λειτουργεί' },
        p: { en: 'partly', el: 'εν μέρει' },
        u: { en: 'not verified', el: 'δεν επιβεβαιώθηκε' },
        n: { en: 'not here', el: 'όχι εδώ' },
        serverHint: { en: 'Features not listed (HUD, themes, hotkeys, Analytics, overlays) work on every server.', el: 'Όσα δεν αναφέρονται (HUD, θέματα, πλήκτρα, αναλύσεις, επικαλύψεις) λειτουργούν παντού.' }
    };
    function lang() {
        try { return W.localStorage.getItem('languagemod') === '2' ? 'el' : 'en'; } catch (e) { return 'en'; }
    }
    function t(k) { var r = STR[k]; return r ? (r[lang()] || r.en) : k; }
    function tr(o) { return o ? (o[lang()] || o.en) : ''; }
    function plain(s) {
        if (s == null) return '';
        return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    }

    function load() {
        var raw = null;
        try { raw = W.localStorage.getItem(KEY); } catch (e) { }
        return parseStore(raw);
    }
    function save(st) {
        try { W.localStorage.setItem(KEY, serializeStore(st)); } catch (e) { }
    }
    function ver() { return W.OgVer != null ? String(W.OgVer) : ''; }
    function isPhone() { return !!(W._lmMobileHost && typeof W._lmMobileHost.openEditor === 'function'); }
    function visibleCards() { return CARDS.filter(function (c) { return !c.phoneOnly || isPhone(); }); }
    function mainColor() {
        var ds = W.defaultSettings;
        return ds && typeof ds.menuMainColor === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(ds.menuMainColor) ? ds.menuMainColor : '#01d9cc';
    }

    /* ═══ Window ═══ */

    var root = null, body = null, tab = 'features', msgTimer = null, lastFocus = null, viewType = '';
    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function injectStyle() {
        if (D.getElementById('lm-dc-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-dc-style';
        st.textContent =
            '#lm-dc{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;' +
            'background:rgba(0,0,0,.45);padding:8px;box-sizing:border-box;font-family:Ubuntu,Roboto,Arial,sans-serif}' +
            '#lm-dc *{box-sizing:border-box}' +
            '#lm-dc .lm-dc-panel{width:760px;max-width:100%;max-height:100%;display:flex;flex-direction:column;background:#1b1d22;color:#e8e8e8;' +
            'border:1px solid #333;border-top:3px solid var(--dc-mc);border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.6);overflow:hidden}' +
            '#lm-dc .lm-dc-head{display:flex;align-items:center;gap:6px;padding:6px 6px 6px 12px;border-bottom:1px solid #333;flex:0 0 auto}' +
            '#lm-dc .lm-dc-title{flex:1 1 auto;min-width:0;font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-dc .lm-dc-tab{flex:0 0 auto;height:34px;padding:0 10px;border:1px solid #444;border-radius:5px;background:transparent;color:#ccc;font-size:12px;cursor:pointer}' +
            '#lm-dc .lm-dc-tab.on{border-color:var(--dc-mc);color:var(--dc-mc)}' +
            '#lm-dc .lm-dc-x{flex:0 0 auto;width:40px;height:40px;border:0;border-radius:5px;background:#2a2d33;color:#eee;font-size:22px;line-height:1;cursor:pointer}' +
            '#lm-dc .lm-dc-body{flex:1 1 auto;overflow-y:auto;padding:8px 10px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}' +
            '#lm-dc .lm-dc-intro{font-size:11px;color:#aaa;margin:0 0 6px}' +
            '#lm-dc .lm-dc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px}' +
            '#lm-dc .lm-dc-card{border:1px solid #333;border-radius:6px;padding:7px 8px;background:#22252b;display:flex;flex-direction:column;gap:5px}' +
            '#lm-dc .lm-dc-name{font-size:13px;font-weight:700}' +
            '#lm-dc .lm-dc-desc{font-size:11px;color:#bbb;line-height:1.35}' +
            '#lm-dc .lm-dc-sw{display:flex;flex-wrap:wrap;gap:4px}' +
            '#lm-dc .lm-dc-chip{min-height:30px;max-width:100%;padding:2px 8px;border:1px solid #555;border-radius:15px;background:transparent;color:#ddd;font-size:11px;' +
            'cursor:pointer;text-align:left;white-space:normal;touch-action:manipulation}' +
            '#lm-dc .lm-dc-chip b{font-size:9px;margin-right:4px;padding:1px 4px;border-radius:7px;background:#444;color:#ddd}' +
            '#lm-dc .lm-dc-chip.on{border-color:var(--dc-mc)}#lm-dc .lm-dc-chip.on b{background:var(--dc-mc);color:#000}' +
            '#lm-dc .lm-dc-chip:disabled{opacity:.45;cursor:default}' +
            '#lm-dc .lm-dc-acts{display:flex;flex-wrap:wrap;gap:4px;margin-top:auto}' +
            '#lm-dc .lm-dc-btn{min-height:30px;padding:2px 10px;border:1px solid #555;border-radius:4px;background:#2c3037;color:#eee;font-size:11px;cursor:pointer;touch-action:manipulation}' +
            '#lm-dc .lm-dc-btn.pri{border-color:var(--dc-mc);color:var(--dc-mc)}' +
            '#lm-dc .lm-dc-msg{font-size:11px;color:var(--dc-mc);min-height:0}' +
            '#lm-dc .lm-new-badge{display:inline-block;background:#e74c3c;color:#fff;font-size:9px;font-weight:700;line-height:1;padding:2px 4px;border-radius:3px;vertical-align:middle;margin-left:5px}' +
            '#lm-dc .lm-dc-foot{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 10px;border-top:1px solid #333;font-size:11px;color:#aaa}' +
            '#lm-dc .lm-dc-foot label{display:flex;align-items:center;gap:5px;margin:0;cursor:pointer;min-height:30px;font-weight:400}' +
            '#lm-dc .lm-dc-srv{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px;font-size:12px}' +
            '#lm-dc .lm-dc-srv select{height:32px;background:#2a2d33;color:#eee;border:1px solid #555;border-radius:4px;font-size:12px}' +
            '#lm-dc .lm-dc-caps{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2px 10px;list-style:none;margin:0;padding:0}' +
            '#lm-dc .lm-dc-caps li{display:flex;align-items:baseline;gap:6px;font-size:12px;padding:3px 0;border-bottom:1px solid #2a2d33}' +
            '#lm-dc .lm-dc-v{flex:0 0 auto;width:86px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px}' +
            '#lm-dc .lm-dc-v.y{color:#5fd35f}#lm-dc .lm-dc-v.p{color:#e6c23c}#lm-dc .lm-dc-v.u{color:#9aa}#lm-dc .lm-dc-v.n{color:#e26a6a}' +
            '#lm-dc .lm-dc-note{color:#999;font-size:11px}' +
            '.lm-dc-flash{outline:3px solid var(--lm-dc-mc,#01d9cc)!important;outline-offset:3px;animation:lmdcflash .6s ease-in-out 5}' +
            '@keyframes lmdcflash{50%{outline-color:transparent}}' +
            '@media (max-height:500px){#lm-dc{padding:4px}#lm-dc .lm-dc-head{padding:3px 3px 3px 10px}#lm-dc .lm-dc-body{padding:6px 8px}}' +
            '@media (pointer:coarse){#lm-dc .lm-dc-chip,#lm-dc .lm-dc-btn{min-height:38px}#lm-dc .lm-dc-tab{height:40px}}';
        (D.head || D.documentElement).appendChild(st);
    }
    function stop(e) { e.stopPropagation(); }
    function build() {
        injectStyle();
        root = mk('div');
        root.id = 'lm-dc';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', t('title'));
        /* the game reads mouse buttons, the wheel and keys from window handlers */
        ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel', 'pointerdown', 'pointerup', 'keyup', 'keypress'].forEach(function (ev) {
            root.addEventListener(ev, stop, false);
        });
        root.addEventListener('keydown', function (e) {
            e.stopPropagation();
            if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); close(); }
        }, false);
        root.addEventListener('click', function (e) { if (e.target === root) close(); }, false);
        var panel = mk('div', 'lm-dc-panel');
        var head = mk('div', 'lm-dc-head');
        head.appendChild(mk('div', 'lm-dc-title', t('title')));
        ['features', 'server'].forEach(function (id) {
            var b = mk('button', 'lm-dc-tab', t(id === 'features' ? 'tabFeatures' : 'tabServer'));
            b.type = 'button';
            b.setAttribute('data-tab', id);
            b.addEventListener('click', function () { show(id); });
            head.appendChild(b);
        });
        var x = mk('button', 'lm-dc-x', '×');
        x.type = 'button';
        x.title = t('close');
        x.setAttribute('aria-label', t('close'));
        x.addEventListener('click', function () { close(); });
        head.appendChild(x);
        body = mk('div', 'lm-dc-body');
        var foot = mk('div', 'lm-dc-foot');
        var lab = mk('label');
        var cb = mk('input');
        cb.type = 'checkbox';
        cb.id = 'lm-dc-auto';
        cb.checked = !load().off;
        cb.addEventListener('change', function () { var st = load(); st.off = !cb.checked; st.v = ver(); save(st); });
        lab.appendChild(cb);
        lab.appendChild(D.createTextNode(t('autoShow')));
        foot.appendChild(lab);
        panel.appendChild(head);
        panel.appendChild(body);
        panel.appendChild(foot);
        root.appendChild(panel);
    }

    function checkbox(key) {
        var el = D.getElementById(key);
        return el && el.type === 'checkbox' ? el : null;
    }
    function optLabel(key) {
        var tl = W.textLanguage || {};
        return plain(tl[key]) || key;
    }
    function setMsg(card, text) {
        var m = card.querySelector('.lm-dc-msg');
        if (m) m.textContent = text || '';
    }
    /* a switch goes through the real checkbox, as the Command Centre and the presets do: the
     * bubbling change runs setSettings (side effects, save) and moves the Switchery */
    function toggle(key) {
        var cb = checkbox(key);
        if (!cb) return null;
        cb.checked = !cb.checked;
        try { cb.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {
            try { if (W.application) W.application.setSettings(key, cb.checked); } catch (e2) { }
        }
        return cb.checked;
    }
    function visible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < W.innerHeight && r.left < W.innerWidth;
    }
    /* live demo: wait for the HUD part of a switched-on option and make it blink */
    function highlight(sel, card) {
        var tries = 0;
        var look = function () {
            var el = D.querySelector(sel);
            if (visible(el)) {
                el.style.setProperty('--lm-dc-mc', mainColor());
                el.classList.remove('lm-dc-flash');
                void el.offsetWidth;
                el.classList.add('lm-dc-flash');
                setTimeout(function () { el.classList.remove('lm-dc-flash'); }, 3200);
                setMsg(card, t('look'));
                return;
            }
            if (++tries < 8) setTimeout(look, 400);
            else setMsg(card, t('later'));
        };
        setTimeout(look, 150);
    }
    function renderChip(chip, key) {
        var cb = checkbox(key);
        var on = !!(cb && cb.checked);
        chip.classList.toggle('on', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        chip.disabled = !cb;
        chip.innerHTML = '';
        chip.appendChild(mk('b', null, on ? t('on') : t('off')));
        chip.appendChild(D.createTextNode(optLabel(key)));
    }
    function revealOpt(key) {
        var CC = W.LMCommandCentre;
        if (CC && typeof CC.reveal === 'function' && CC.reveal(key)) { close(); return true; }
        return false;
    }
    function renderFeatures() {
        body.innerHTML = '';
        body.appendChild(mk('p', 'lm-dc-intro', t('intro')));
        var st = load();
        var grid = mk('div', 'lm-dc-grid');
        visibleCards().forEach(function (c) {
            var card = mk('div', 'lm-dc-card');
            card.setAttribute('data-card', c.id);
            var name = mk('div', 'lm-dc-name', tr(c) || c.en);
            if (st.seen.indexOf(c.id) < 0) {
                var cls = W.textLanguage && W.textLanguage.lmNewBadge;
                name.appendChild(mk('span', 'lm-new-badge', plain(cls) || 'NEW'));
            }
            card.appendChild(name);
            card.appendChild(mk('div', 'lm-dc-desc', tr(c.d)));
            if (c.opts.length) {
                var sw = mk('div', 'lm-dc-sw');
                c.opts.forEach(function (key) {
                    var chip = mk('button', 'lm-dc-chip');
                    chip.type = 'button';
                    chip.setAttribute('data-opt', key);
                    renderChip(chip, key);
                    if (chip.disabled) chip.title = t('noMenu');
                    chip.addEventListener('click', function () {
                        var on = toggle(key);
                        renderChip(chip, key);
                        if (on === null) { setMsg(card, t('noMenu')); return; }
                        if (on && c.show && c.show[key]) highlight(c.show[key], card);
                        else setMsg(card, on ? t('later') : t('offNow'));
                    });
                    sw.appendChild(chip);
                });
                card.appendChild(sw);
            }
            card.appendChild(mk('div', 'lm-dc-msg'));
            var acts = mk('div', 'lm-dc-acts');
            if (c.win && c.win.avail()) {
                var ob = mk('button', 'lm-dc-btn pri', t('open'));
                ob.type = 'button';
                ob.setAttribute('data-act', 'open');
                ob.addEventListener('click', function () {
                    close();
                    setTimeout(function () { try { c.win.run(); } catch (e) { console.warn('[LM] Discover:', c.id, e); } }, 0);
                });
                acts.appendChild(ob);
            }
            if (c.opts.length && checkbox(c.opts[0]) && W.LMCommandCentre && typeof W.LMCommandCentre.reveal === 'function') {
                var sb = mk('button', 'lm-dc-btn', t('showMe'));
                sb.type = 'button';
                sb.setAttribute('data-act', 'reveal');
                sb.addEventListener('click', function () { revealOpt(c.opts[0]); });
                acts.appendChild(sb);
            }
            if (acts.childNodes.length) card.appendChild(acts);
            grid.appendChild(card);
        });
        body.appendChild(grid);
    }
    function typeName(id) {
        for (var i = 0; i < SERVER_TYPES.length; i++) if (SERVER_TYPES[i].id === id) return SERVER_TYPES[i].en;
        return id;
    }
    function renderServer() {
        body.innerHTML = '';
        var cur = serverTypeOf(W.legendmod);
        var connected = !!(W.legendmod && W.legendmod.ws);
        if (!viewType) viewType = connected && cur ? cur : 'agario';
        var row = mk('div', 'lm-dc-srv');
        row.appendChild(mk('b', null, t('serverTitle')));
        var sel = mk('select');
        sel.id = 'lm-dc-type';
        SERVER_TYPES.forEach(function (s) {
            var o = mk('option', null, s.en);
            o.value = s.id;
            if (s.id === viewType) o.selected = true;
            sel.appendChild(o);
        });
        sel.addEventListener('change', function () { viewType = sel.value; renderServer(); });
        row.appendChild(sel);
        row.appendChild(mk('span', 'lm-dc-note', connected && cur ? t('current').replace('{s}', typeName(cur)) : t('notConnected')));
        body.appendChild(row);
        var ul = mk('ul', 'lm-dc-caps');
        capsFor(viewType, lang()).forEach(function (r) {
            var li = mk('li');
            li.setAttribute('data-cap', r.id);
            li.appendChild(mk('span', 'lm-dc-v ' + r.v, t(r.v)));
            var txt = mk('span', null, r.label);
            if (r.note) txt.appendChild(mk('span', 'lm-dc-note', ' (' + r.note + ')'));
            li.appendChild(txt);
            ul.appendChild(li);
        });
        body.appendChild(ul);
        body.appendChild(mk('p', 'lm-dc-intro', t('serverHint')));
    }
    function show(which) {
        tab = which === 'server' ? 'server' : 'features';
        if (!root) return;
        var tabs = root.querySelectorAll('.lm-dc-tab');
        for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i].getAttribute('data-tab') === tab);
        if (tab === 'server') renderServer(); else renderFeatures();
        body.scrollTop = 0;
    }
    function isOpen() { return !!(root && root.parentNode); }
    function open(which) {
        if (!D.body) return;
        if (!root) build();
        root.style.setProperty('--dc-mc', mainColor());
        viewType = '';
        if (!isOpen()) {
            lastFocus = D.activeElement;
            D.body.appendChild(root);
        }
        show(which || 'features');
        var x = root.querySelector('.lm-dc-x');
        try { if (x) x.focus(); } catch (e) { }
    }
    /* closing marks the cards as seen (their NEW badges go) and the version as handled */
    function close() {
        if (!isOpen()) return;
        root.parentNode.removeChild(root);
        var st = load();
        visibleCards().forEach(function (c) { if (st.seen.indexOf(c.id) < 0) st.seen.push(c.id); });
        st.v = ver();
        save(st);
        try { if (lastFocus && lastFocus.focus && D.body.contains(lastFocus)) lastFocus.focus(); } catch (e) { }
        lastFocus = null;
    }

    /* ═══ Once after an update ═══ */

    function menuShown() {
        var ov = D.getElementById('overlays');
        return !!(ov && ov.style.display !== 'none' && (ov.offsetParent !== null || ov.offsetHeight > 0));
    }
    function playing() { return !!(W.legendmod && W.legendmod.play); }
    (function autoOpen() {
        var v = ver();
        var badges = null;
        try { badges = W.localStorage.getItem('lmNewBadgesSeen'); } catch (e) { }
        var st = firstState(load(), badges, v);
        if (!st.had) {
            /* first visit: remember the version, show nothing */
            if (v) { st.v = v; save(st); }
            return;
        }
        if (!shouldAutoOpen(st, v, visibleCards().map(function (c) { return c.id; }))) return;
        var tries = 0, calm = 0;
        var timer = setInterval(function () {
            tries++;
            if (isOpen()) { clearInterval(timer); return; }
            /* the menu stays up for a few seconds with nothing else open over it */
            calm = menuShown() && !playing() && !D.getElementById('lm-cc') ? calm + 1 : 0;
            if (calm >= 3) { clearInterval(timer); open('features'); }
            else if (tries > 300) clearInterval(timer);
        }, 2000);
    })();

    /* the link in the "What's new" toast (LMexpress) */
    D.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('.lm-dc-toast-link') : null;
        if (!a) return;
        e.preventDefault();
        open('features');
    }, false);

    api.open = open;
    api.close = close;
    api.isOpen = isOpen;
    api.openServer = function () { open('server'); };
    api.serverType = function () { return serverTypeOf(W.legendmod); };
    api.capabilities = function (type) { return capsFor(type || serverTypeOf(W.legendmod) || 'agario', 'en'); };
})();
