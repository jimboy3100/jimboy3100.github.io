/* Legend Mod Servers window: favourite servers with your own labels, the recent servers (the list the
 * "Reconnect to the previous server" hotkey uses), the agar.io arenas the server list found with
 * their player counts, the private servers of the Private region and Expanding Land (with its
 * private rooms). Opened by the button next to the server token box, a hotkey (no default key) or
 * the Command Centre.
 *
 * Joining uses the paths that already exist: an arena of the server list joins through it
 * (LMServerBrowser.join), any other server address like the previous server hotkey
 * (application.gameServerJoin, the Join button), a private server by picking it in the Private
 * list (the same change a player makes), a private room through the room window.
 * Copy link builds the TK&PW link (token + clan tag password) of the menu button.
 *
 * Player counts are only what the client already has: the arena probes of the server list, and the
 * leaderboard of the server you are on. While the window is open (and nobody plays), a server
 * the client connected to before may get a WebSocket open / close to measure its connect time,
 * at most once a minute per server, through the server list's about:blank iframe (the page's
 * WebSocket wrappers never see it). Nothing is ever sent on that socket.
 *
 * Favourites are kept in localStorage 'lmServerFavs' ({v, favs: [...], notify}, checked on
 * read) and go with the gameplay settings in Settings > Export / import. The notification when a
 * favourite agar.io arena is back (toastr, so the notification centre keeps it) is off by default.
 * The pure helpers are tested in developers/tests/servermanager.js.
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmServerManagerLoaded) return;
    W._lmServerManagerLoaded = true;

    var STORE_KEY = 'lmServerFavs';
    var MAX_FAVS = 100;
    var LABEL_MAX = 32;
    var NAME_MAX = 48;
    var PROBE_EVERY_MS = 60000;    /* one connect-time probe per server per minute at most */
    var PROBE_TIMEOUT_MS = 8000;
    var PROBE_HOLD_MS = 1500;      /* a server that closes the socket this soon after opening it failed */
    var PROBE_CONCURRENCY = 2;
    var PRESENT_PROBE_MS = 120000; /* an ok probe counts as "reachable" this long (notification) */
    var TYPES = ['arena', 'server', 'private', 'el', 'room'];
    var EL_GM = { '5001': ':ffa', '5002': ':teams' };
    var MODE_LABELS = { ':ffa': 'FFA', ':battleroyale': 'Battle Royale', ':teams': 'Teams', ':experimental': 'Experimental', ':party': 'Party' };

    var own = Object.prototype.hasOwnProperty;
    function has(o, k) { return !!o && own.call(o, k); }
    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    /* a stored time: positive, finite and not absurd */
    function stamp(v) { return typeof v === 'number' && isFinite(v) && v > 0 && v < 1e13 ? Math.floor(v) : 0; }

    /* ═══ Pure helpers ═══ */

    /* One spelling per server address: no scheme, query, :443 or trailing slash (the server list's rule) */
    function hostKey(value) {
        return String(value == null ? '' : value).trim()
            .replace(/^wss?:\/\//i, '')
            .replace(/[?#].*$/, '')
            .replace(/:443(?=\/|$)/, '')
            .replace(/\/+$/, '')
            .toLowerCase();
    }
    function hostTail(host) {
        var parts = hostKey(host).split('/');
        return parts[parts.length - 1] || String(host || '');
    }
    function isAgarWs(ws) { return /agar\.io|agario|miniclippt/i.test(hostKey(ws).split('/')[0]); }
    function isRoomUrl(ws) { return typeof ws === 'string' && ws.indexOf('/el-room/') !== -1; }
    function roomCode(c) { c = String(c == null ? '' : c).toUpperCase().replace(/\s+/g, ''); return /^[A-HJ-NP-Z2-9]{6}$/.test(c) ? c : ''; }
    function regionLabel(region) {
        return String(region || '').replace(/^[A-Z]{2}-/i, '').replace(/[-_]+/g, ' ').trim();
    }
    function modeLabel(mode) { return MODE_LABELS[mode] || ''; }
    /* a private server's mode from its name, for the mode filter */
    function modeFromName(name) {
        name = String(name || '');
        if (/party/i.test(name)) return ':party';
        if (/teams/i.test(name)) return ':teams';
        if (/experimental|\bexp\b/i.test(name)) return ':experimental';
        if (/battle ?royale/i.test(name)) return ':battleroyale';
        if (/ffa/i.test(name)) return ':ffa';
        return '';
    }

    /* A WebSocket address that is safe to store and to join: wss/ws, a plain host name, an optional
     * port and path. No replay addresses and no private room tickets (single use). */
    function validWs(ws) {
        return typeof ws === 'string' && ws.length >= 8 && ws.length <= 300 &&
            /^wss?:\/\/[A-Za-z0-9.-]{1,253}(:\d{1,5})?([\/?#][^\s"'<>`\\]*)?$/.test(ws) &&
            ws.indexOf('replay') === -1 && !isRoomUrl(ws);
    }
    function validRegion(rg) { return typeof rg === 'string' && /^[A-Za-z0-9 _-]{0,40}$/.test(rg); }
    function validMode(gm) { return typeof gm === 'string' && /^:[a-z]{2,20}$/.test(gm); }

    /* Labels and names are shown with textContent / escaped, but they are also kept short and
     * free of control, zero-width and direction characters (a label could otherwise turn the
     * row around or hide itself) and of angle brackets. */
    /* Unicode ranges written as numbers: control, soft hyphen, zero-width, line / paragraph
     * separators, direction marks and overrides, invisible operators, BOM, annotation marks */
    function hex4(n) { return String.fromCharCode(92) + 'u' + ('000' + n.toString(16)).slice(-4); }
    function charClass(ranges) {
        return '[' + ranges.map(function (r) { return hex4(r[0]) + (r.length > 1 ? '-' + hex4(r[1]) : ''); }).join('') + ']';
    }
    var INVISIBLE = new RegExp(charClass([[0x0, 0x1f], [0x7f, 0x9f], [0xad], [0x61c], [0x180e], [0x200b, 0x200f], [0x2028, 0x202e], [0x2060, 0x206f], [0xfeff], [0xfff9, 0xfffb]]), 'g');
    var COMBINING = new RegExp(charClass([[0x300, 0x36f]]), 'g');
    function sanitizeText(s, max) {
        if (s == null || typeof s === 'object' || typeof s === 'function') return '';
        s = String(s)
            .replace(INVISIBLE, ' ')
            .replace(/[<>]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        var cp = Array.from ? Array.from(s) : s.split('');
        if (cp.length > max) s = cp.slice(0, max).join('').trim();
        return s;
    }
    function sanitizeLabel(s) { return sanitizeText(s, LABEL_MAX); }

    /* A row id: the kind of server + what identifies it */
    function favId(f) {
        if (!f) return '';
        if (f.type === 'arena' || f.type === 'server') return 'a:' + hostKey(f.ws);
        if (f.type === 'private' || f.type === 'el') return 'p:' + f.gm;
        if (f.type === 'room') return 'r:' + f.code;
        return '';
    }

    /* One favourite as stored, or null. Its id is worked out again, never read. */
    function cleanFav(f) {
        if (!isObj(f) || TYPES.indexOf(f.type) === -1) return null;
        var out = { type: f.type };
        if (f.type === 'arena' || f.type === 'server') {
            if (!validWs(f.ws)) return null;
            out.type = isAgarWs(f.ws) ? 'arena' : 'server';
            out.ws = f.ws;
            out.gm = validMode(f.gm) ? f.gm : '';
            out.rg = validRegion(f.rg) ? f.rg : '';
        } else if (f.type === 'private' || f.type === 'el') {
            var gm = typeof f.gm === 'number' && isFinite(f.gm) ? String(f.gm) : f.gm;
            if (typeof gm !== 'string' || !/^\d{1,6}$/.test(gm) || gm === '5003') return null;
            out.type = has(EL_GM, gm) ? 'el' : 'private';
            out.gm = gm;
            out.rg = 'Private';
        } else {
            var code = roomCode(f.code);
            if (!code) return null;
            out.code = code;
        }
        out.label = sanitizeLabel(f.label);
        out.name = sanitizeText(f.name, NAME_MAX);
        out.added = stamp(f.added);
        out.last = stamp(f.last);
        out.id = favId(out);
        return out.id.length > 2 ? out : null;
    }

    /* The stored object, checked: unknown keys go, broken favourites go, duplicates go */
    function cleanStore(raw) {
        var o = isObj(raw) ? raw : {};
        var favs = [], seen = {};
        (Array.isArray(o.favs) ? o.favs : []).forEach(function (f) {
            var c = cleanFav(f);
            if (c && !has(seen, c.id) && favs.length < MAX_FAVS) {
                seen[c.id] = 1;
                favs.push(c);
            }
        });
        return { v: 1, favs: favs, notify: o.notify === true };
    }

    /* Players and bots in a leaderboard (nicks): a name more than twice is a group of bots,
     * as the leaderboard footer counts them */
    function splitBots(nicks) {
        var seen = Object.create(null), i, bots = 0, players = 0;
        for (i = 0; i < nicks.length; i++) seen[nicks[i]] = (seen[nicks[i]] || 0) + 1;
        for (var k in seen) {
            if (seen[k] > 2) bots += seen[k];
            else players += seen[k];
        }
        return { players: players, bots: bots };
    }

    function norm(s) {
        s = String(s == null ? '' : s).toLowerCase();
        try { s = s.normalize('NFD').replace(COMBINING, ''); } catch (e) { }
        return s;
    }
    function typeGroup(type) { return type === 'arena' ? 'arena' : type === 'el' || type === 'room' ? 'el' : 'private'; }

    /* filter: { q: words, mode: ':ffa'..., region: raw region, type: 'arena' | 'private' | 'el' } */
    function filterRows(rows, f) {
        f = f || {};
        var words = norm(f.q).split(/\s+/).filter(Boolean);
        return rows.filter(function (r) {
            if (f.mode && r.mode !== f.mode) return false;
            if (f.region && r.rg !== f.region) return false;
            if (f.type && typeGroup(r.type) !== f.type) return false;
            if (!words.length) return true;
            var hay = norm([r.label, r.name, regionLabel(r.rg), r.rg, modeLabel(r.mode), r.gm, r.code, r.ws ? hostKey(r.ws) : ''].join(' '));
            for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) === -1) return false;
            return true;
        });
    }
    function rowName(r) { return r.label || r.name || (r.ws ? hostTail(r.ws) : r.code || r.id); }
    function byName(a, b) {
        var x = norm(rowName(a)), y = norm(rowName(b));
        return x < y ? -1 : x > y ? 1 : 0;
    }
    /* by: 'players' (most first, not counted last), 'name', 'last' (last played first, never last) */
    function sortRows(rows, by) {
        var out = rows.slice();
        var idx = new Map();
        out.forEach(function (r, i) { idx.set(r, i); });
        out.sort(function (a, b) {
            var d = 0;
            if (by === 'name') d = byName(a, b);
            else if (by === 'last') d = (b.last || 0) - (a.last || 0) || byName(a, b);
            else {
                var pa = typeof a.players === 'number' ? a.players : -1;
                var pb = typeof b.players === 'number' ? b.players : -1;
                d = pb - pa || byName(a, b);
            }
            return d || idx.get(a) - idx.get(b);
        });
        return out;
    }

    /* The server token of an address, as createServerToken makes it: an agar.io arena packs into
     * a short token (packer: the client's toLong with its region list), another server is its
     * address without the scheme, anything else the address itself (recreateWS opens it as is). */
    function tokenFor(ws, packer) {
        ws = String(ws || '');
        if (!ws) return '';
        if (!/agar\.io|agario/.test(ws)) {
            var m = /^wss?:\/\/(.+)$/.exec(ws);
            return m ? m[1] : ws;
        }
        var a = /web-arenas-live-v25-0\.agario\.miniclippt\.com\/(.+)\/(\d+-\d+-\d+-\d+)/.exec(ws);
        if (a && packer) {
            var t = '';
            try { t = packer(a[1], a[2].split('-').map(function (n) { return parseInt(n, 10); })); } catch (e) { t = ''; }
            if (t) return t;
        }
        if (a) return 'wss://web-arenas-live-v25-0.agario.miniclippt.com/' + a[1] + '/' + a[2];
        return ws;
    }
    /* The TK&PW link of the menu button (LMexpress #copySIPandPass) */
    function buildLink(token, pass, region, mode, legendSite) {
        var p = '&pass=' + encodeURIComponent(pass || '');
        if (mode === ':party') return 'https://agar.io/?sip=' + token + p;
        return (legendSite ? 'https://agar.io/play?sip=' : 'https://agar.io/?sip=') + token + p + '&r=' + region + '&m=' + mode;
    }

    /* Favourites that came back: present[id] now true after it was seen false in this session.
     * Returns the ids and the next state (a first sighting only sets the state). */
    function notifyTransitions(prev, present) {
        var next = {}, ids = [];
        Object.keys(present).forEach(function (id) {
            next[id] = !!present[id];
            if (next[id] && has(prev, id) && prev[id] === false) ids.push(id);
        });
        return { ids: ids, next: next };
    }
    /* a server may be probed when it never was, or its last probe ended a minute ago */
    function probeDue(p, now) { return !p || (!p.active && now - (p.at || 0) >= PROBE_EVERY_MS); }
    /* ok, failed (once) or offline (twice or more in a row) */
    function probeStatus(p) { return !p || !p.at ? '' : p.ok ? 'ok' : p.fails >= 2 ? 'offline' : 'fail'; }

    /* the history (lmServerHistory, newest first) as rows: one per server */
    function historyRows(hist, privName) {
        var out = [], seen = {};
        (Array.isArray(hist) ? hist : []).forEach(function (h) {
            if (!h || !validWs(h.ws)) return;
            var gm = typeof h.gm === 'string' ? h.gm : '', rg = validRegion(h.rg) ? h.rg : '';
            var r;
            if (rg === 'Private' && /^\d{1,6}$/.test(gm) && gm !== '5003') {
                r = { id: 'p:' + gm, type: has(EL_GM, gm) ? 'el' : 'private', gm: gm, rg: 'Private', ws: h.ws, name: privName(gm) || 'Private ' + gm };
                r.mode = EL_GM[gm] || modeFromName(r.name);
            } else {
                var agar = isAgarWs(h.ws);
                r = { id: 'a:' + hostKey(h.ws), type: agar ? 'arena' : 'server', ws: h.ws, gm: validMode(gm) ? gm : '', rg: agar ? rg : '', name: '' };
                r.mode = r.gm;
            }
            if (has(seen, r.id)) return;
            seen[r.id] = 1;
            r.last = stamp(h.at);
            out.push(r);
        });
        return out;
    }

    var core = {
        hostKey: hostKey, sanitizeLabel: sanitizeLabel, sanitizeText: sanitizeText, validWs: validWs, cleanFav: cleanFav,
        cleanStore: cleanStore, favId: favId, filterRows: filterRows, sortRows: sortRows, tokenFor: tokenFor,
        buildLink: buildLink, notifyTransitions: notifyTransitions, probeDue: probeDue, probeStatus: probeStatus,
        historyRows: historyRows, splitBots: splitBots, modeFromName: modeFromName, roomCode: roomCode,
        packer: packer,
        STORE_KEY: STORE_KEY, MAX_FAVS: MAX_FAVS, LABEL_MAX: LABEL_MAX, PROBE_EVERY_MS: PROBE_EVERY_MS
    };
    var api = W.LMServerManager = { core: core };

    var D = W.document;
    if (!D || typeof D.addEventListener !== 'function' || typeof D.createElement !== 'function') return;

    /* ═══ Texts (English, Greek; other languages show English) ═══ */

    var TEXT = {
        title: ['Servers', 'Διακομιστές'],
        open: ['Servers: favourites, recent, arenas', 'Διακομιστές: αγαπημένοι, πρόσφατοι, αρένες'],
        close: ['Close', 'Κλείσιμο'],
        tabFav: ['Favourites', 'Αγαπημένοι'],
        tabRecent: ['Recent', 'Πρόσφατοι'],
        tabArenas: ['agar.io arenas', 'Αρένες agar.io'],
        tabPrivate: ['Private servers', 'Ιδιωτικοί'],
        tabEl: ['Expanding Land', 'Expanding Land'],
        search: ['Search', 'Αναζήτηση'],
        allModes: ['All modes', 'Όλα τα modes'],
        allRegions: ['All regions', 'Όλες οι περιοχές'],
        allTypes: ['All types', 'Όλοι οι τύποι'],
        typeArena: ['agar.io', 'agar.io'],
        typePrivate: ['Private', 'Ιδιωτικοί'],
        typeEl: ['Expanding Land', 'Expanding Land'],
        sortPlayers: ['Most players', 'Περισσότεροι παίκτες'],
        sortName: ['Name', 'Όνομα'],
        sortLast: ['Last played', 'Τελευταίο παιχνίδι'],
        join: ['Join', 'Είσοδος'],
        here: ['You are here', 'Είσαι εδώ'],
        copy: ['Link', 'Σύνδεσμος'],
        copyTitle: ['Copy the server link + password (TK&PW)', 'Αντιγραφή συνδέσμου διακομιστή + κωδικού (TK&PW)'],
        star: ['Add to favourites', 'Προσθήκη στους αγαπημένους'],
        unstar: ['Remove from favourites', 'Αφαίρεση από τους αγαπημένους'],
        rename: ['Your label', 'Δική σου ετικέτα'],
        save: ['Save', 'Αποθήκευση'],
        cancel: ['Cancel', 'Άκυρο'],
        labelPh: ['Label (empty: the server name)', 'Ετικέτα (κενή: το όνομα του διακομιστή)'],
        players: ['{0} players', '{0} παίκτες'],
        bots: ['{0} bots', '{0} bots'],
        onLb: ['on the leaderboard of the server you are on', 'στον πίνακα του διακομιστή που είσαι'],
        lastSeen: ['last seen {0}', 'τελευταία φορά {0}'],
        noCount: ['no count', 'χωρίς μέτρηση'],
        ms: ['{0} ms', '{0} ms'],
        msTitle: ['WebSocket connect time', 'Χρόνος σύνδεσης WebSocket'],
        stOk: ['Reachable at the last check', 'Διαθέσιμος στον τελευταίο έλεγχο'],
        stFail: ['The last check failed', 'Ο τελευταίος έλεγχος απέτυχε'],
        stOffline: ['Offline (checks keep failing)', 'Εκτός σύνδεσης (οι έλεγχοι αποτυγχάνουν)'],
        stNone: ['Not checked yet', 'Δεν ελέγχθηκε ακόμα'],
        checked: ['checked {0}', 'έλεγχος {0}'],
        emptyFav: ['No favourites yet. Tap ☆ on a server in the other tabs.', 'Δεν υπάρχουν αγαπημένοι. Πάτησε ☆ σε έναν διακομιστή στις άλλες καρτέλες.'],
        emptyRecent: ['No recent servers yet: they are added when a server opens.', 'Δεν υπάρχουν πρόσφατοι: προστίθενται όταν ανοίγει ένας διακομιστής.'],
        emptyArenas: ['No arenas found yet. Press Scan.', 'Δεν βρέθηκαν αρένες ακόμα. Πάτησε Σάρωση.'],
        noArenaList: ['Pick an agar.io region and mode (not Private) in the menu to list its arenas.', 'Διάλεξε περιοχή και mode του agar.io (όχι Private) στο μενού για να δεις τις αρένες.'],
        nothing: ['Nothing matches the search or filters.', 'Τίποτα δεν ταιριάζει με την αναζήτηση ή τα φίλτρα.'],
        scan: ['Scan', 'Σάρωση'],
        scanTitle: ['Look for more arenas of this region and mode', 'Αναζήτηση περισσότερων αρενών αυτής της περιοχής και του mode'],
        notify: ['Tell me when a favourite agar.io arena is back', 'Ειδοποίησέ με όταν ένας αγαπημένος agar.io διακομιστής επιστρέφει'],
        exportNote: ['Favourites go with the gameplay settings in Settings > Export / import.', 'Οι αγαπημένοι εξάγονται μαζί με τις ρυθμίσεις παιχνιδιού (Ρυθμίσεις > Εξαγωγή / εισαγωγή).'],
        probeNote: ['Connect times: at most one check per server per minute while this window is open; paused while you play.', 'Χρόνοι σύνδεσης: το πολύ ένας έλεγχος ανά διακομιστή το λεπτό, μόνο όσο είναι ανοιχτό το παράθυρο· σταματά όσο παίζεις.'],
        roomCreate: ['Create a private room', 'Νέο ιδιωτικό δωμάτιο'],
        roomJoin: ['Join by code', 'Είσοδος με κωδικό'],
        roomList: ['Public rooms', 'Δημόσια δωμάτια'],
        room: ['Private room {0}', 'Ιδιωτικό δωμάτιο {0}'],
        roomLast: ['your last private room', 'το τελευταίο σου δωμάτιο'],
        joining: ['Joining {0}…', 'Σύνδεση σε {0}…'],
        leave: ['Leave this game and join {0}?', 'Να φύγεις από αυτό το παιχνίδι και να μπεις στο {0};'],
        cannotJoin: ['This server cannot be joined from here.', 'Δεν μπορείς να μπεις σε αυτόν τον διακομιστή από εδώ.'],
        copied: ['Server link copied.', 'Ο σύνδεσμος αντιγράφηκε.'],
        noLink: ['No link for this server yet (join it once first).', 'Δεν υπάρχει σύνδεσμος ακόμα (μπες μία φορά πρώτα).'],
        storageFull: ['Could not save the favourites: the browser storage is full or blocked.', 'Δεν αποθηκεύτηκαν οι αγαπημένοι: ο χώρος του browser είναι γεμάτος ή μπλοκαρισμένος.'],
        tooMany: ['At most {0} favourites.', 'Το πολύ {0} αγαπημένοι.'],
        back: ['Favourite arena {0} is back{1}.', 'Ο αγαπημένος διακομιστής {0} επέστρεψε{1}.'],
        here2: ['you are on it', 'είσαι εκεί'],
        now: ['just now', 'μόλις τώρα']
    };
    function lang() {
        try { return W.localStorage.getItem('languagemod') === '2' ? 1 : 0; } catch (e) { return 0; }
    }
    function tx(key) {
        var row = TEXT[key];
        var s = row ? (row[lang()] || row[0]) : key;
        for (var i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(String(arguments[i]));
        return s;
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function toast(kind, html) {
        var t = W.toastr;
        if (!t) return;
        try { (t[kind] || t.info).call(t, '<b>[Servers]:</b> ' + html); } catch (e) { }
    }
    function ago(t) {
        if (!t) return '';
        /* minutes at the finest: the list is not rebuilt every second for a changing number */
        var s = Math.max(0, Math.round((Date.now() - t) / 1000));
        if (s < 60) return tx('now');
        if (s < 3600) return Math.round(s / 60) + ' min';
        if (s < 86400) return Math.round(s / 3600) + ' h';
        try { return new Date(t).toLocaleDateString(); } catch (e) { return ''; }
    }
    function val(sel) {
        var el = D.querySelector(sel);
        return el && typeof el.value === 'string' ? el.value : '';
    }

    /* ═══ Storage ═══ */

    function load() {
        var raw = null;
        try { raw = JSON.parse(W.localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { raw = null; }
        return cleanStore(raw);
    }
    function save(st) {
        try {
            if (!st.favs.length && !st.notify) W.localStorage.removeItem(STORE_KEY);
            else W.localStorage.setItem(STORE_KEY, JSON.stringify(st));
            return true;
        } catch (e) {
            toast('error', esc(tx('storageFull')));
            return false;
        }
    }

    /* ═══ What the client knows ═══ */

    function browser() { return W.LMServerBrowser || null; }
    function scanContext() {
        var b = browser();
        try { return b && b.helpers && b.helpers.context ? b.helpers.context() : null; } catch (e) { return null; }
    }
    /* host -> { e: entry, list } over every region + mode the server list knows */
    function scanIndex() {
        var idx = {}, b = browser();
        if (!b || !b.lists || typeof b.lists.forEach !== 'function') return idx;
        b.lists.forEach(function (list) {
            if (!list || !list.servers) return;
            list.servers.forEach(function (e) { if (e && e.host) idx[e.host] = { e: e, list: list }; });
        });
        return idx;
    }
    function history() {
        try { return typeof W._lmSrvHistRead === 'function' ? W._lmSrvHistRead() : []; } catch (e) { return []; }
    }
    var privCache = null;
    function privateOptions() {
        var list = null;
        try { if (typeof W._lmPrivateModOptions === 'function') list = W._lmPrivateModOptions(); } catch (e) { list = null; }
        if (!Array.isArray(list) || !list.length) {
            /* an older main file: the list in the menu when Private is picked */
            if (val('#region') === 'Private') {
                list = Array.prototype.map.call(D.querySelectorAll('#gamemode option'), function (o) { return { text: o.textContent, value: o.value, disabled: o.disabled }; });
            } else list = privCache || [{ text: '👑 Expanding Land FFA', value: 5001 }, { text: '👑 Expanding Land Teams', value: 5002 }];
        }
        privCache = list;
        return list.filter(function (o) { return o && /^\d{1,6}$/.test(String(o.value)) && String(o.value) !== '5003' && !o.disabled; })
            .map(function (o) { return { gm: String(o.value), name: sanitizeText(o.text, NAME_MAX) }; });
    }
    function privName(gm) {
        var l = privateOptions();
        for (var i = 0; i < l.length; i++) if (l[i].gm === gm) return l[i].name;
        return '';
    }
    /* the newest address the client opened for a private server pick (for its link and probe) */
    function privWs(gm, hist) {
        for (var i = 0; i < hist.length; i++) {
            var h = hist[i];
            if (h && h.rg === 'Private' && h.gm === gm && validWs(h.ws)) return h.ws;
        }
        return '';
    }

    function currentInfo(hist) {
        var lm = W.legendmod, ws = lm && lm.ws ? String(lm.ws) : '';
        var c = { ws: ws, ids: {}, connected: !!(lm && lm.socket && lm.socket.readyState === 1), play: !!(lm && lm.play) };
        if (!ws) return c;
        if (isRoomUrl(ws)) {
            var m = /\/el-room\/([A-HJ-NP-Z2-9]{6})/.exec(ws);
            if (m) c.ids['r:' + m[1]] = 1;
            return c;
        }
        c.ids['a:' + hostKey(ws)] = 1;
        var gm = val('#gamemode');
        if (val('#region') === 'Private' && /^\d{1,6}$/.test(gm)) {
            /* the pick in the Private list, when this connection came from it */
            var h = hist[0];
            if (!h || h.ws !== ws || h.gm === gm) c.ids['p:' + gm] = 1;
        }
        return c;
    }
    function anyoneAlive() {
        var lm = W.legendmod;
        if (lm && lm.play) return true;
        var u = W.spects;
        if (u && u.length) for (var i = 0; i < u.length; i++) if (u[i] && u[i].active) return true;
        return false;
    }
    /* the leaderboard of the server you are on: what the client already received */
    function currentCount() {
        var lm = W.legendmod;
        if (!lm || !Array.isArray(lm.leaderboard) || !lm.leaderboard.length) return null;
        return splitBots(lm.leaderboard.map(function (e) { return e && e.id === 'isPlayer' ? '\u0000own' : String((e && e.nick) || ''); }));
    }

    /* ═══ Connect-time probes (only while the window is open) ═══ */

    var probes = {};      /* id -> { at, ok, ms, fails, active } */
    var probeActive = 0;
    var probeCancels = [];
    var seenCounts = {};  /* id -> { players, bots, at }: the last leaderboard count of a server you were on */

    function probeRealm() {
        var b = browser();
        try { return b && b.helpers && typeof b.helpers.probeRealm === 'function' ? b.helpers.probeRealm() : null; } catch (e) { return null; }
    }
    function runProbe(url, done) {
        var realm = probeRealm();
        var PW = realm && realm.WebSocket;
        /* never the page's WebSocket: its wrappers would take the socket for a game connection */
        if (!PW) { done(null); return; }
        var start = Date.now(), openedAt = 0, ws = null, fin = false, hold = null, timer = null;
        var cancel = function () { finish(null); };
        probeCancels.push(cancel);
        function finish(ok) {
            if (fin) return;
            fin = true;
            clearTimeout(timer);
            clearTimeout(hold);
            var i = probeCancels.indexOf(cancel);
            if (i !== -1) probeCancels.splice(i, 1);
            if (ws) {
                ws.onopen = ws.onclose = ws.onerror = ws.onmessage = null;
                try { if (ws.readyState < 2) ws.close(); } catch (e) { }
            }
            done(ok === null ? null : { ok: ok, ms: openedAt ? openedAt - start : null });
        }
        timer = setTimeout(function () { finish(false); }, PROBE_TIMEOUT_MS);
        try {
            ws = new PW(url);
            ws.binaryType = 'arraybuffer';
        } catch (e) { finish(false); return; }
        ws.onopen = function () {
            openedAt = Date.now();
            hold = setTimeout(function () { finish(true); }, PROBE_HOLD_MS);
        };
        ws.onclose = function () { finish(false); };
        ws.onerror = function () { finish(false); };
    }
    function stopProbes() {
        probeCancels.slice().forEach(function (c) { c(); });
    }
    /* rows shown now: the ones the client connected to before, not counted by the server list */
    function pumpProbes(rows, cur) {
        if (!isOpen() || D.hidden || anyoneAlive()) { stopProbes(); return; }
        var now = Date.now();
        for (var i = 0; i < rows.length && probeActive < PROBE_CONCURRENCY; i++) {
            var r = rows[i];
            if (!r.probeUrl || r.scanned || cur.ids[r.id] || !probeDue(probes[r.id], now)) continue;
            start(r.id, r.probeUrl);
        }
        function start(id, url) {
            var p = probes[id] || (probes[id] = { at: 0, ok: false, ms: null, fails: 0, active: false });
            p.active = true;
            probeActive++;
            runProbe(url, function (res) {
                probeActive--;
                p.active = false;
                if (res) {
                    p.at = Date.now();
                    p.ok = res.ok;
                    p.ms = res.ok ? res.ms : null;
                    p.fails = res.ok ? 0 : p.fails + 1;
                } else if (!p.at) {
                    delete probes[id];
                }
                if (isOpen()) renderList();
            });
        }
    }

    /* ═══ Rows ═══ */

    function favToRow(f, hist) {
        var r = { id: f.id, type: f.type, gm: f.gm || '', rg: f.rg || '', ws: f.ws || '', code: f.code || '', name: f.name, last: f.last };
        if (f.type === 'private' || f.type === 'el') {
            r.name = privName(f.gm) || f.name || 'Private ' + f.gm;
            r.mode = EL_GM[f.gm] || modeFromName(r.name);
            r.ws = privWs(f.gm, hist);
        } else if (f.type === 'room') {
            r.name = tx('room', f.code);
            r.mode = '';
            r.rg = 'Private';
        } else {
            r.mode = f.gm;
        }
        return r;
    }
    function baseRows(t, st, hist, cur) {
        var rows = [];
        if (t === 'fav') {
            rows = st.favs.map(function (f) { return favToRow(f, hist); });
        } else if (t === 'recent') {
            rows = historyRows(hist, privName);
        } else if (t === 'arenas') {
            var ctx = scanContext(), b = browser();
            var list = ctx && ctx.visible && b && b.lists ? b.lists.get(ctx.key) : null;
            if (ctx && ctx.currentHost && (!list || !list.servers.get(ctx.currentHost)) && cur.ws) {
                rows.push({ id: 'a:' + ctx.currentHost, type: 'arena', ws: cur.ws, gm: ctx.mode, rg: ctx.region, mode: ctx.mode, name: '' });
            }
            if (list) {
                list.servers.forEach(function (e) {
                    if (e.offline && e.host !== (ctx && ctx.currentHost)) return;
                    var ws = /^wss?:\/\//i.test(e.endpoint) ? e.endpoint : 'wss://' + e.endpoint;
                    rows.push({ id: 'a:' + e.host, type: 'arena', ws: ws, gm: list.mode, rg: list.region, mode: list.mode, name: e.alias });
                });
            }
        } else if (t === 'private' || t === 'el') {
            privateOptions().forEach(function (o) {
                var el = has(EL_GM, o.gm);
                if (el !== (t === 'el')) return;
                rows.push({ id: 'p:' + o.gm, type: el ? 'el' : 'private', gm: o.gm, rg: 'Private', name: o.name, mode: EL_GM[o.gm] || modeFromName(o.name), ws: privWs(o.gm, hist) });
            });
            if (t === 'el') {
                var codes = [], rs = W._lmRoomState || {};
                if (roomCode(rs.code)) codes.push(roomCode(rs.code));
                var last = '';
                try { last = roomCode(W.localStorage.getItem('lmLastRoom')); } catch (e) { }
                if (last && codes.indexOf(last) === -1) codes.push(last);
                st.favs.forEach(function (f) { if (f.type === 'room' && codes.indexOf(f.code) === -1) codes.push(f.code); });
                codes.forEach(function (c) { rows.push({ id: 'r:' + c, type: 'room', code: c, rg: 'Private', mode: '', name: tx('room', c), note: c === last ? tx('roomLast') : '' }); });
            }
        }
        return rows;
    }
    function enrich(rows, st, hist, cur) {
        var favs = {}, lastBy = {}, scan = scanIndex(), now = Date.now();
        st.favs.forEach(function (f) { favs[f.id] = f; });
        historyRows(hist, privName).forEach(function (h) { lastBy[h.id] = h.last; });
        var lm = W.legendmod;
        rows.forEach(function (r) {
            var f = favs[r.id];
            r.fav = !!f;
            r.label = f ? f.label : '';
            if (!r.name && f) r.name = f.name;
            r.last = Math.max(r.last || 0, lastBy[r.id] || 0, f ? f.last : 0);
            r.current = !!cur.ids[r.id];
            r.players = null;
            r.bots = 0;
            r.ms = null;
            r.status = '';
            r.checkedAt = 0;
            r.probeUrl = '';
            if (r.type === 'arena' || r.type === 'server') {
                var s = scan[hostKey(r.ws)];
                if (s) {
                    var e = s.e;
                    r.scanned = true;
                    if (!r.name) r.name = e.alias;
                    if (!r.rg) r.rg = s.list.region;
                    if (!r.mode) r.mode = s.list.mode;
                    if (e.players !== null && e.players !== undefined) { r.players = e.players; r.bots = e.bots || 0; r.checkedAt = e.checkedAt || 0; }
                    r.status = e.offline ? 'offline' : e.fails > 0 ? 'fail' : e.players !== null && e.players !== undefined ? 'ok' : '';
                    if (e.connectMs > 0 && now - (e.connectAt || 0) < 600000) r.ms = e.connectMs;
                }
                if (!s) r.probeUrl = r.ws;
            } else if (r.type === 'private' || r.type === 'el') {
                r.probeUrl = r.ws;
            }
            var p = probes[r.id];
            if (p && p.at && !r.scanned) {
                r.status = probeStatus(p);
                r.checkedAt = p.at;
                if (p.ms !== null) r.ms = p.ms;
            }
            if (r.current) {
                if (cur.connected) {
                    r.status = 'ok';
                    r.checkedAt = now;
                    if (lm && typeof lm.ping === 'number' && lm.ping > 0 && lm.ping < 10000) r.ms = Math.round(lm.ping);
                    var c = r.players === null || r.type !== 'arena' ? currentCount() : null;
                    if (c) {
                        r.players = c.players;
                        r.bots = c.bots;
                        r.fromLb = r.type !== 'arena';
                        seenCounts[r.id] = { players: c.players, bots: c.bots, at: now };
                    }
                }
            } else if (r.players === null && seenCounts[r.id]) {
                r.players = seenCounts[r.id].players;
                r.bots = seenCounts[r.id].bots;
                r.seenAt = seenCounts[r.id].at;
            }
            if (!r.name) r.name = (regionLabel(r.rg) ? regionLabel(r.rg) + ' ' : '') + (modeLabel(r.mode) ? modeLabel(r.mode) + ' ' : '') + hostTail(r.ws);
        });
        return rows;
    }

    /* ═══ Favourites ═══ */

    function favFromRow(r) {
        return cleanFav({ type: r.type, ws: r.ws, gm: r.type === 'arena' || r.type === 'server' ? r.mode || r.gm : r.gm, rg: r.rg, code: r.code, name: r.name, label: '', added: Date.now(), last: r.last || 0 });
    }
    function toggleFav(r) {
        var st = load();
        var i = -1;
        st.favs.forEach(function (f, j) { if (f.id === r.id) i = j; });
        if (i !== -1) st.favs.splice(i, 1);
        else {
            if (st.favs.length >= MAX_FAVS) { toast('warning', esc(tx('tooMany', MAX_FAVS))); return false; }
            var f = favFromRow(r);
            if (!f) return false;
            st.favs.push(f);
        }
        return save(st);
    }
    function setLabel(id, label) {
        var st = load();
        st.favs.forEach(function (f) { if (f.id === id) f.label = sanitizeLabel(label); });
        return save(st);
    }
    function touchFav(id) {
        var st = load(), hit = false;
        st.favs.forEach(function (f) { if (f.id === id) { f.last = Date.now(); hit = true; } });
        if (hit) save(st);
    }

    /* ═══ Join and copy (the existing paths) ═══ */

    /* the previous server hotkey's path (_lmJoinPrevServer): the mode it was played in, then the Join button's join */
    function joinWs(ws, gm) {
        var jq = W.jQuery || W.$;
        try {
            if (gm && jq && jq('#gamemode option').filter(function () { return this.value === gm; }).length) jq('#gamemode').val(gm);
        } catch (e) { }
        if (!W.application || typeof W.application.gameServerJoin !== 'function') return false;
        W.application.gameServerJoin(ws);
        return true;
    }
    function hasOption(sel, value) {
        var opts = D.querySelectorAll(sel + ' option');
        for (var i = 0; i < opts.length; i++) if (opts[i].value === value && !opts[i].disabled) return true;
        return false;
    }
    function fire(el) {
        var ev;
        try { ev = new Event('change', { bubbles: true }); } catch (e) { ev = D.createEvent('Event'); ev.initEvent('change', true, true); }
        el.dispatchEvent(ev);
    }
    /* a private server: picked in the Private list as a player picks it. Coming from another
     * region, the region change opens the last private server, so that is set to this one first. */
    function joinPrivate(gm) {
        var region = D.getElementById('region'), mode = D.getElementById('gamemode');
        if (!region || !mode) return false;
        if (region.value !== 'Private') {
            if (!hasOption('#region', 'Private')) return false;
            try { W.localStorage.setItem('lmLastPrivateServer', gm); } catch (e) { }
            region.value = 'Private';
            fire(region);
            /* the storage was blocked: the list opened another server, pick this one */
            if (mode.value !== gm && hasOption('#gamemode', gm)) { mode.value = gm; fire(mode); }
            return mode.value === gm;
        }
        if (!hasOption('#gamemode', gm)) return false;
        if (mode.value === gm) {
            /* already picked: the same change again reconnects, as picking it again would */
            fire(mode);
            return true;
        }
        mode.value = gm;
        fire(mode);
        return true;
    }
    function join(r) {
        if (!r) return false;
        var cur = currentInfo(history());
        if (cur.ids[r.id] && cur.connected && r.type !== 'room') { toast('info', esc(tx('here'))); return false; }
        var name = rowName(r), ok = false;
        if (r.type === 'room') {
            if (typeof W._lmRoomOpen !== 'function') return false;
            close();
            W._lmRoomOpen('join', r.code);
            return true;
        }
        var b = browser(), ctx = scanContext();
        var host = r.ws ? hostKey(r.ws) : '';
        var list = ctx && ctx.scannable && b && b.lists ? b.lists.get(ctx.key) : null;
        var entry = list && host ? list.servers.get(host) : null;
        var asked = anyoneAlive();
        if (r.type === 'arena' && entry && !entry.offline && b && typeof b.join === 'function') {
            /* the server list's own join (it asks before leaving a game; false when the answer was no) */
            ok = b.join(host);
            if (!ok && asked) return false;
        } else {
            if (asked && !W.confirm(tx('leave', name))) return false;
            if (r.type === 'private' || r.type === 'el') ok = joinPrivate(r.gm);
            else if (validWs(r.ws)) {
                ok = joinWs(r.ws, r.gm || r.mode);
                if (ok) toast('info', esc(tx('joining', name)));
            }
        }
        if (!ok) { toast('info', esc(tx('cannotJoin'))); return false; }
        touchFav(r.id);
        close();
        return true;
    }
    function packer(region, ip) {
        /* the client's own packing (ogario.v4.js toLong, awsRegions, ranges) */
        if (typeof toLong !== 'function' || typeof awsRegions === 'undefined' || typeof ranges === 'undefined') return '';
        var i = awsRegions.indexOf(region);
        if (i < 0 || i > ranges[0]) return '';
        return toLong([i].concat(ip)).toString(36).padStart(7, '0');
    }
    function legendSite() {
        try { if (typeof _lmOnLegendWebsite === 'function') return !!_lmOnLegendWebsite(); } catch (e) { }
        return /(^|\.)jimboy3100\.github\.io$|(^|\.)legendmod\.ml$|(^|\.)expanding\.land$/i.test(W.location ? W.location.hostname : '');
    }
    function writeClipboard(text) {
        var fallback = function () {
            var i = D.createElement('textarea');
            i.value = text;
            i.setAttribute('readonly', '');
            i.style.cssText = 'position:fixed;left:-9999px;top:0;';
            D.body.appendChild(i);
            i.select();
            try { D.execCommand('copy'); } catch (e) { }
            D.body.removeChild(i);
        };
        try {
            if (W.navigator && W.navigator.clipboard && W.navigator.clipboard.writeText) {
                W.navigator.clipboard.writeText(text).then(null, fallback);
                return;
            }
        } catch (e) { }
        fallback();
    }
    function linkOf(r) {
        if (r.type === 'room') return typeof W._lmRoomShareLink === 'function' ? W._lmRoomShareLink(r.code) : '';
        if (!validWs(r.ws)) return '';
        var token = tokenFor(r.ws, packer);
        var region = r.type === 'private' || r.type === 'el' ? 'Private' : r.rg;
        var mode = r.type === 'private' || r.type === 'el' ? r.gm : r.mode || r.gm || ':ffa';
        if (!token || !region && mode !== ':party') return '';
        return buildLink(token, val('#clantag'), region, mode, legendSite());
    }
    function copyLink(r) {
        var cur = currentInfo(history());
        var btn = D.getElementById('copySIPandPass');
        /* the server you are on: the menu button itself, exactly as the Copy server link hotkey */
        if (cur.ids[r.id] && btn && val('#server-token').trim()) {
            try { (W.jQuery ? W.jQuery(btn).trigger('click') : btn.click()); } catch (e) { }
            var ae = D.activeElement;
            if (ae && ae.id === 'tempCopy') ae.blur();
            toast('info', esc(tx('copied')));
            return true;
        }
        var link = linkOf(r);
        if (!link) { toast('info', esc(tx('noLink'))); return false; }
        writeClipboard(link);
        toast('info', esc(tx('copied')));
        return true;
    }

    /* ═══ Notification: a favourite arena is back (off by default) ═══ */

    var presence = {};
    function notifyTick() {
        var st = load();
        if (!st.notify) { presence = {}; return; }
        var scan = scanIndex(), now = Date.now(), present = {}, names = {};
        st.favs.forEach(function (f) {
            if (f.type !== 'arena') return;
            var s = scan[hostKey(f.ws)], p = probes[f.id];
            present[f.id] = !!(s && !s.e.offline && (s.e.players !== null || s.e.fails === 0)) || !!(p && p.ok && now - p.at < PRESENT_PROBE_MS);
            names[f.id] = { name: f.label || f.name || (s && s.e.alias) || hostTail(f.ws), players: s && typeof s.e.players === 'number' ? s.e.players : null };
        });
        var res = notifyTransitions(presence, present);
        presence = res.next;
        res.ids.forEach(function (id) {
            var n = names[id];
            toast('info', esc(tx('back', n.name, n.players !== null ? ' (' + tx('players', n.players) + ')' : '')));
        });
    }

    /* ═══ Window ═══ */

    var tab = 'fav';
    var filter = { q: '', mode: '', region: '', type: '' };
    var sortBy = { fav: 'last', recent: 'last', arenas: 'players', private: 'name', el: 'name' };
    var editing = '';
    var lastRows = [];
    var lastSig = '';
    var timer = null;
    var refreshedArenas = false;
    var lastPointer = 0;

    function isOpen() { return !!D.getElementById('lm-sm-overlay'); }
    function mainColor() {
        var ds = W.defaultSettings;
        return ds && typeof ds.menuMainColor === 'string' && /^#[0-9a-f]{3,8}$/i.test(ds.menuMainColor) ? ds.menuMainColor : '#01d9cc';
    }
    function css() {
        if (D.getElementById('lm-sm-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-sm-style';
        st.textContent =
            '#server-info.lm-sm-has-btn #server-token{width:calc(65% - 40px)}' +
            '#lm-sm-btn{float:left;width:36px;height:34px;margin-left:4px;padding:0;font-size:15px}' +
            '#lm-sm-overlay{position:fixed;inset:0;z-index:2000000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);font-family:inherit}' +
            '#lm-sm-overlay .lm-sm-win{background:#1b1f2a;color:#eee;border-radius:8px;border-top:3px solid var(--lm-sm-mc,#01d9cc);width:min(760px,calc(100vw - 16px));height:min(560px,calc(100vh - 16px));height:min(560px,calc(100dvh - 16px));display:flex;flex-direction:column;font-size:12px;box-shadow:0 6px 30px rgba(0,0,0,.5);box-sizing:border-box;overflow:hidden}' +
            '#lm-sm-overlay .lm-sm-head{display:flex;align-items:center;gap:6px;padding:2px 4px 2px 10px;flex:none}' +
            '#lm-sm-overlay .lm-sm-head b{font-size:14px;margin-right:4px;white-space:nowrap}' +
            '#lm-sm-overlay .lm-sm-tabs{display:flex;gap:2px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}' +
            '#lm-sm-overlay .lm-sm-tabs button{flex:none;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#ccc;padding:3px 9px;border-radius:4px;min-height:28px;cursor:pointer;font-size:12px;white-space:nowrap}' +
            '#lm-sm-overlay .lm-sm-tabs button.active{background:rgba(255,255,255,.18);color:#fff;border-color:var(--lm-sm-mc,#01d9cc)}' +
            '#lm-sm-overlay .lm-sm-x{flex:none;background:none;border:0;color:#bbb;font-size:24px;line-height:1;min-width:40px;min-height:36px;cursor:pointer}' +
            '#lm-sm-overlay .lm-sm-bar{display:flex;flex-wrap:wrap;gap:4px;padding:4px 8px;flex:none;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1)}' +
            '#lm-sm-overlay input[type=text],#lm-sm-overlay input[type=search],#lm-sm-overlay select{background:#11141c;color:#eee;border:1px solid rgba(255,255,255,.2);border-radius:3px;padding:2px 6px;min-height:28px;font-size:12px;max-width:100%;box-sizing:border-box}' +
            '#lm-sm-overlay .lm-sm-q{flex:1 1 140px;min-width:100px}' +
            '#lm-sm-overlay .lm-sm-bar select{flex:0 1 auto;min-width:0}' +
            '#lm-sm-overlay .lm-sm-list{flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;padding:0 8px}' +
            '#lm-sm-overlay .lm-sm-row{display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.07);min-height:34px}' +
            '#lm-sm-overlay .lm-sm-row.lm-sm-cur{background:rgba(255,255,255,.05)}' +
            '#lm-sm-overlay .lm-sm-star{flex:none;background:none;border:0;color:#999;font-size:19px;line-height:1;min-width:32px;min-height:32px;cursor:pointer;padding:0}' +
            '#lm-sm-overlay .lm-sm-star.on{color:#f5c518}' +
            '#lm-sm-overlay .lm-sm-dot{flex:none;width:9px;height:9px;border-radius:50%;background:#666}' +
            '#lm-sm-overlay .lm-sm-dot.ok{background:#3cb371}#lm-sm-overlay .lm-sm-dot.fail{background:#e6a23c}#lm-sm-overlay .lm-sm-dot.offline{background:#d9534f}' +
            '#lm-sm-overlay .lm-sm-name{flex:1;min-width:0;overflow:hidden}' +
            '#lm-sm-overlay .lm-sm-name div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-sm-overlay .lm-sm-name small{opacity:.6;font-size:11px}' +
            '#lm-sm-overlay .lm-sm-num{flex:none;width:64px;text-align:right;white-space:nowrap}' +
            '#lm-sm-overlay .lm-sm-num small{display:block;opacity:.6;font-size:10px}' +
            '#lm-sm-overlay .lm-sm-ms{flex:none;width:50px;text-align:right;opacity:.8;white-space:nowrap}' +
            '#lm-sm-overlay .lm-sm-acts{flex:none;display:flex;gap:3px}' +
            '#lm-sm-overlay .lm-sm-b{background:rgba(127,127,127,.2);color:#eee;border:1px solid rgba(127,127,127,.45);border-radius:3px;padding:2px 8px;min-height:30px;min-width:34px;font-size:12px;cursor:pointer;white-space:nowrap}' +
            '#lm-sm-overlay .lm-sm-b:disabled{opacity:.4;cursor:default}' +
            '#lm-sm-overlay .lm-sm-b.go{border-color:#3c9e5a;background:rgba(60,158,90,.3)}' +
            '#lm-sm-overlay .lm-sm-empty{padding:14px 4px;opacity:.75}' +
            '#lm-sm-overlay .lm-sm-foot{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:4px 8px;border-top:1px solid rgba(255,255,255,.1);font-size:11px}' +
            '#lm-sm-overlay .lm-sm-foot label{font-weight:normal;margin:0;display:inline-flex;align-items:center;gap:4px;cursor:pointer}' +
            '#lm-sm-overlay .lm-sm-note{opacity:.65}' +
            '#lm-sm-overlay .lm-sm-edit{flex:1;display:flex;gap:4px;min-width:0}' +
            '#lm-sm-overlay .lm-sm-edit input{flex:1;min-width:0}' +
            '@media (max-width:600px){#lm-sm-overlay .lm-sm-ms{display:none}#lm-sm-overlay .lm-sm-num{width:48px}}' +
            '@media (max-height:440px){#lm-sm-overlay .lm-sm-win{height:calc(100vh - 8px);height:calc(100dvh - 8px);width:min(760px,calc(100vw - 8px))}#lm-sm-overlay .lm-sm-row{min-height:32px;padding:1px 0}}';
        (D.head || D.documentElement).appendChild(st);
    }
    var TABS = [['fav', 'tabFav'], ['recent', 'tabRecent'], ['arenas', 'tabArenas'], ['private', 'tabPrivate'], ['el', 'tabEl']];
    function open(which) {
        if (which && TABS.some(function (t) { return t[0] === which; })) tab = which;
        if (isOpen()) { renderAll(); return; }
        if (!D.body) return;
        css();
        var ov = D.createElement('div');
        ov.id = 'lm-sm-overlay';
        ov.innerHTML =
            '<div class="lm-sm-win" role="dialog" aria-modal="true" aria-label="' + esc(tx('title')) + '">' +
            '<div class="lm-sm-head"><b>' + esc(tx('title')) + '</b><div class="lm-sm-tabs"></div>' +
            '<button type="button" class="lm-sm-x" aria-label="' + esc(tx('close')) + '" title="' + esc(tx('close')) + '">&times;</button></div>' +
            '<div class="lm-sm-bar"></div><div class="lm-sm-list"></div><div class="lm-sm-foot"></div></div>';
        ov.querySelector('.lm-sm-win').style.setProperty('--lm-sm-mc', mainColor());
        /* a tap outside the window or on x closes it */
        ov.addEventListener('click', function (e) {
            if (e.target === ov || (e.target.closest && e.target.closest('.lm-sm-x'))) { e.preventDefault(); close(); return; }
            var b = e.target.closest ? e.target.closest('[data-act]') : null;
            if (b && ov.contains(b)) { e.preventDefault(); act(b.getAttribute('data-act'), b.getAttribute('data-id')); }
        });
        ov.addEventListener('input', function (e) {
            if (e.target.classList.contains('lm-sm-q')) { filter.q = e.target.value; renderList(); }
        });
        ov.addEventListener('change', function (e) {
            var k = e.target.getAttribute('data-f');
            if (k === 'sort') { sortBy[tab] = e.target.value; renderList(); }
            else if (k) { filter[k] = e.target.value; renderList(); }
            else if (e.target.id === 'lm-sm-notify') {
                var st = load();
                st.notify = !!e.target.checked;
                presence = {};
                if (!save(st)) e.target.checked = !e.target.checked;
                else if (st.notify) notifyTick();
            }
        });
        ov.addEventListener('keydown', function (e) {
            if (e.target.classList.contains('lm-sm-label')) {
                if (e.key === 'Enter') { e.preventDefault(); act('save', editing); }
                e.stopPropagation();
                return;
            }
            /* typing in the window's fields never reaches the game hotkeys */
            if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) e.stopPropagation();
        });
        /* a tap starts: the list is not rebuilt under the finger for a moment */
        ['pointerdown', 'touchstart', 'mousedown'].forEach(function (n) {
            ov.addEventListener(n, function () { lastPointer = Date.now(); }, { passive: true });
        });
        D.addEventListener('keydown', onEsc, true);
        D.body.appendChild(ov);
        refreshedArenas = false;
        renderAll();
        clearInterval(timer);
        timer = setInterval(tick, 1000);
    }
    /* Escape closes the window (or ends the label editing) wherever the focus is */
    function onEsc(e) {
        if (e.key !== 'Escape' && e.keyCode !== 27) return;
        if (!isOpen()) { D.removeEventListener('keydown', onEsc, true); return; }
        e.preventDefault();
        e.stopPropagation();
        if (editing) act('cancel');
        else close();
    }
    function close() {
        D.removeEventListener('keydown', onEsc, true);
        var el = D.getElementById('lm-sm-overlay');
        if (el && el.parentNode) el.parentNode.removeChild(el);
        clearInterval(timer);
        timer = null;
        editing = '';
        stopProbes();
    }
    function toggle() { if (isOpen()) close(); else open(); }

    function renderAll() {
        var ov = D.getElementById('lm-sm-overlay');
        if (!ov) return;
        var st = load();
        ov.querySelector('.lm-sm-tabs').innerHTML = TABS.map(function (t) {
            var n = t[0] === 'fav' && st.favs.length ? ' (' + st.favs.length + ')' : '';
            return '<button type="button" data-act="tab" data-id="' + t[0] + '" class="' + (t[0] === tab ? 'active' : '') + '">' + esc(tx(t[1]) + n) + '</button>';
        }).join('');
        renderBar();
        renderFoot(st);
        if (tab === 'arenas' && !refreshedArenas) {
            /* opening the arenas asks the server list for fresh counts, like opening its dropdown */
            refreshedArenas = true;
            var b = browser();
            try { if (b && typeof b.refresh === 'function') b.refresh(); } catch (e) { }
        }
        lastSig = '';
        renderList();
    }
    function option(v, label, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(label) + '</option>'; }
    function renderBar() {
        var ov = D.getElementById('lm-sm-overlay');
        if (!ov) return;
        var bar = ov.querySelector('.lm-sm-bar');
        var q = bar.querySelector('.lm-sm-q');
        var focused = q && D.activeElement === q;
        var rows = currentRows(true);
        var regions = {};
        rows.forEach(function (r) { if (r.rg) regions[r.rg] = regionLabel(r.rg) || r.rg; });
        if (filter.region && !has(regions, filter.region)) regions[filter.region] = regionLabel(filter.region) || filter.region;
        var modes = [['', tx('allModes')]].concat(Object.keys(MODE_LABELS).map(function (m) { return [m, MODE_LABELS[m]]; }));
        var html =
            '<input type="search" class="lm-sm-q" placeholder="' + esc(tx('search')) + '" aria-label="' + esc(tx('search')) + '" maxlength="60">' +
            '<select data-f="mode" aria-label="' + esc(tx('allModes')) + '">' + modes.map(function (m) { return option(m[0], m[1], filter.mode); }).join('') + '</select>' +
            '<select data-f="region" aria-label="' + esc(tx('allRegions')) + '">' + option('', tx('allRegions'), filter.region) +
            Object.keys(regions).sort().map(function (k) { return option(k, regions[k], filter.region); }).join('') + '</select>' +
            '<select data-f="type" aria-label="' + esc(tx('allTypes')) + '">' + option('', tx('allTypes'), filter.type) + option('arena', tx('typeArena'), filter.type) +
            option('private', tx('typePrivate'), filter.type) + option('el', tx('typeEl'), filter.type) + '</select>' +
            '<select data-f="sort" aria-label="' + esc(tx('sortPlayers')) + '">' + option('players', tx('sortPlayers'), sortBy[tab]) + option('name', tx('sortName'), sortBy[tab]) +
            option('last', tx('sortLast'), sortBy[tab]) + '</select>';
        if (focused) return;
        bar.innerHTML = html;
        bar.querySelector('.lm-sm-q').value = filter.q;
    }
    function renderFoot(st) {
        var ov = D.getElementById('lm-sm-overlay');
        if (!ov) return;
        var foot = ov.querySelector('.lm-sm-foot');
        var html = '';
        if (tab === 'fav') {
            html = '<label><input type="checkbox" id="lm-sm-notify"' + (st.notify ? ' checked' : '') + '> ' + esc(tx('notify')) + '</label>' +
                '<span class="lm-sm-note">' + esc(tx('exportNote')) + '</span>';
        } else if (tab === 'arenas') {
            var ctx = scanContext();
            var status = D.getElementById('lm-server-status');
            html = '<button type="button" class="lm-sm-b" data-act="scan" title="' + esc(tx('scanTitle')) + '"' + (ctx && ctx.scannable ? '' : ' disabled') + '><i class="fa fa-search"></i> ' + esc(tx('scan')) + '</button>' +
                '<span class="lm-sm-note lm-sm-scan-status">' + esc(ctx && ctx.visible && status ? status.textContent : tx('noArenaList')) + '</span>';
        } else if (tab === 'el') {
            html = '<button type="button" class="lm-sm-b" data-act="room" data-id="create">' + esc(tx('roomCreate')) + '</button>' +
                '<button type="button" class="lm-sm-b" data-act="room" data-id="join">' + esc(tx('roomJoin')) + '</button>' +
                '<button type="button" class="lm-sm-b" data-act="room" data-id="list">' + esc(tx('roomList')) + '</button>';
        } else {
            html = '<span class="lm-sm-note">' + esc(tx('probeNote')) + '</span>';
        }
        foot.innerHTML = html;
    }
    function currentRows(unfiltered) {
        var st = load(), hist = history(), cur = currentInfo(hist);
        var rows = enrich(baseRows(tab, st, hist, cur), st, hist, cur);
        if (unfiltered) return rows;
        rows = sortRows(filterRows(rows, filter), sortBy[tab] || 'players');
        /* the server you are on stays at the top of the arenas, as in the server list */
        if (tab === 'arenas') rows = rows.filter(function (r) { return r.current; }).concat(rows.filter(function (r) { return !r.current; }));
        return { rows: rows, cur: cur, st: st };
    }
    function countHtml(r) {
        if (r.players === null) return '<span title="' + esc(tx('noCount')) + '">–</span>';
        var title = tx('players', r.players) + (r.bots ? ' · ' + tx('bots', r.bots) : '') +
            (r.fromLb ? ' · ' + tx('onLb') : '') + (r.seenAt ? ' · ' + tx('lastSeen', ago(r.seenAt)) : '') +
            (r.checkedAt ? ' · ' + tx('checked', ago(r.checkedAt)) : '');
        return '<span title="' + esc(title) + '">' + esc(String(r.players) + (r.seenAt ? '*' : '')) + (r.bots ? '<small>+' + esc(r.bots) + ' bots</small>' : '') + '</span>';
    }
    function statusTitle(r) {
        var s = r.status === 'ok' ? tx('stOk') : r.status === 'fail' ? tx('stFail') : r.status === 'offline' ? tx('stOffline') : tx('stNone');
        return s + (r.checkedAt ? ' · ' + tx('checked', ago(r.checkedAt)) : '');
    }
    function rowHtml(r) {
        var id = esc(r.id);
        var sub = [];
        if (r.label && r.name && r.label !== r.name) sub.push(r.name);
        if (modeLabel(r.mode)) sub.push(modeLabel(r.mode));
        if (r.rg && r.rg !== 'Private') sub.push(regionLabel(r.rg) || r.rg);
        if (r.type === 'server' && r.ws) sub.push(hostKey(r.ws).split('/')[0]);
        if (r.note) sub.push(r.note);
        if (r.current) sub.push(tx('here2'));
        if (r.last && tab !== 'arenas') sub.push(ago(r.last));
        var main;
        if (editing === r.id) {
            main = '<div class="lm-sm-edit"><input type="text" class="lm-sm-label" maxlength="' + LABEL_MAX + '" placeholder="' + esc(tx('labelPh')) + '" value="' + esc(r.label) + '">' +
                '<button type="button" class="lm-sm-b go" data-act="save" data-id="' + id + '">' + esc(tx('save')) + '</button>' +
                '<button type="button" class="lm-sm-b" data-act="cancel">' + esc(tx('cancel')) + '</button></div>';
        } else {
            main = '<div class="lm-sm-name" title="' + esc(rowName(r) + (r.ws ? '\n' + hostKey(r.ws) : '')) + '"><div>' + esc(rowName(r)) + '</div><div><small>' + esc(sub.join(' · ')) + '</small></div></div>' +
                '<span class="lm-sm-num">' + countHtml(r) + '</span>' +
                '<span class="lm-sm-ms" title="' + esc(tx('msTitle')) + '">' + (r.ms !== null ? esc(tx('ms', r.ms)) : '') + '</span>' +
                '<span class="lm-sm-acts">' +
                (r.fav ? '<button type="button" class="lm-sm-b" data-act="edit" data-id="' + id + '" title="' + esc(tx('rename')) + '" aria-label="' + esc(tx('rename')) + '">✎</button>' : '') +
                '<button type="button" class="lm-sm-b" data-act="copy" data-id="' + id + '" title="' + esc(tx('copyTitle')) + '">' + esc(tx('copy')) + '</button>' +
                '<button type="button" class="lm-sm-b go" data-act="join" data-id="' + id + '"' + (r.current && r.type !== 'room' ? ' disabled title="' + esc(tx('here')) + '"' : '') + '>' + esc(tx('join')) + '</button>' +
                '</span>';
        }
        return '<div class="lm-sm-row' + (r.current ? ' lm-sm-cur' : '') + '" data-row="' + id + '">' +
            '<button type="button" class="lm-sm-star' + (r.fav ? ' on' : '') + '" data-act="star" data-id="' + id + '" title="' + esc(r.fav ? tx('unstar') : tx('star')) + '" aria-label="' + esc(r.fav ? tx('unstar') : tx('star')) + '" aria-pressed="' + (r.fav ? 'true' : 'false') + '">' + (r.fav ? '★' : '☆') + '</button>' +
            '<span class="lm-sm-dot ' + esc(r.status) + '" title="' + esc(statusTitle(r)) + '"></span>' + main + '</div>';
    }
    function renderList() {
        var ov = D.getElementById('lm-sm-overlay');
        if (!ov) return;
        var data = currentRows(false);
        lastRows = data.rows;
        var list = ov.querySelector('.lm-sm-list');
        var html;
        if (!data.rows.length) {
            var empty = filter.q || filter.mode || filter.region || filter.type ? tx('nothing') :
                tab === 'fav' ? tx('emptyFav') : tab === 'recent' ? tx('emptyRecent') :
                tab === 'arenas' ? ((scanContext() || {}).visible ? tx('emptyArenas') : tx('noArenaList')) : tx('nothing');
            html = '<div class="lm-sm-empty">' + esc(empty) + '</div>';
        } else html = data.rows.map(rowHtml).join('');
        if (html !== lastSig) {
            /* the label being typed is kept */
            var inp = list.querySelector('.lm-sm-label');
            var typed = inp ? inp.value : null, hadFocus = inp && D.activeElement === inp;
            var top = list.scrollTop;
            list.innerHTML = html;
            list.scrollTop = top;
            lastSig = html;
            var ni = list.querySelector('.lm-sm-label');
            if (ni && typed !== null) ni.value = typed;
            if (ni && (hadFocus || typed === null)) { try { ni.focus(); } catch (e) { } }
        }
        pumpProbes(data.rows, data.cur);
    }
    function tick() {
        if (!isOpen()) { close(); return; }
        if (editing || Date.now() - lastPointer < 1500) return;
        renderList();
        if (tab === 'arenas') {
            var s = D.querySelector('#lm-sm-overlay .lm-sm-scan-status'), status = D.getElementById('lm-server-status'), ctx = scanContext();
            var text = ctx && ctx.visible && status ? status.textContent : tx('noArenaList');
            if (s && s.textContent !== text) s.textContent = text;
        }
    }
    function rowById(id) {
        for (var i = 0; i < lastRows.length; i++) if (lastRows[i].id === id) return lastRows[i];
        var all = currentRows(true);
        for (var j = 0; j < all.length; j++) if (all[j].id === id) return all[j];
        return null;
    }
    function act(a, id) {
        if (a === 'tab') {
            if (id !== tab) { tab = id; editing = ''; filter.region = ''; renderAll(); }
            return;
        }
        if (a === 'scan') {
            var b = browser();
            try { if (b && typeof b.scan === 'function') b.scan(); } catch (e) { }
            renderFoot(load());
            return;
        }
        if (a === 'room') {
            if (typeof W._lmRoomOpen === 'function') { close(); W._lmRoomOpen(id); }
            return;
        }
        if (a === 'cancel') { editing = ''; lastSig = ''; renderList(); return; }
        var r = rowById(id);
        if (!r) return;
        if (a === 'star') {
            toggleFav(r);
            if (editing === id) editing = '';
            renderAll();
        } else if (a === 'edit') {
            editing = id;
            lastSig = '';
            renderList();
        } else if (a === 'save') {
            var inp = D.querySelector('#lm-sm-overlay .lm-sm-label');
            if (inp) setLabel(id, inp.value);
            editing = '';
            lastSig = '';
            renderList();
        } else if (a === 'join') {
            join(r);
        } else if (a === 'copy') {
            copyLink(r);
        }
    }

    /* ═══ Button next to the server token box ═══ */

    function ensureButton() {
        var info = D.getElementById('server-info'), token = D.getElementById('server-token');
        if (!info || !token || token.parentNode !== info) return;
        var btn = D.getElementById('lm-sm-btn');
        if (btn && btn.parentNode === info && btn.previousElementSibling === token) return;
        css();
        if (!btn) {
            btn = D.createElement('button');
            btn.type = 'button';
            btn.id = 'lm-sm-btn';
            btn.className = 'btn btn-primary';
            btn.innerHTML = '<i class="fa fa-server"></i>';
            btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
        }
        btn.title = tx('open');
        btn.setAttribute('aria-label', tx('open'));
        /* the token box is 40 px narrower: nothing is hidden, the Join button stays where it was */
        try { btn.style.marginTop = W.getComputedStyle(token).marginTop; } catch (e) { }
        info.insertBefore(btn, token.nextSibling);
        info.classList.add('lm-sm-has-btn');
    }

    var bootTries = 0;
    function boot() {
        ensureButton();
        if (!D.getElementById('lm-sm-btn') && ++bootTries < 240) { setTimeout(boot, 500); return; }
        /* the menu can be rebuilt: put the button back, and check favourites for the notification */
        setInterval(function () { ensureButton(); notifyTick(); }, 5000);
    }
    setTimeout(boot, 0);

    api.open = open;
    api.close = close;
    api.toggle = toggle;
    api.isOpen = isOpen;
    api.favourites = function () { return load().favs.map(function (f) { return { id: f.id, type: f.type, label: f.label, name: f.name }; }); };
    api.rows = function (which) {
        var t = tab;
        if (which) tab = which;
        try { return currentRows(true).map(function (r) { return { id: r.id, type: r.type, name: rowName(r), fav: r.fav, players: r.players, status: r.status, current: r.current }; }); } finally { tab = t; }
    };
    api.toggleFavourite = function (id) { var r = rowById(id) || null; return r ? toggleFav(r) : false; };
    api.join = function (id) { return join(rowById(id)); };
    api.linkOf = function (id) { var r = rowById(id); return r ? linkOf(r) : ''; };
})();
