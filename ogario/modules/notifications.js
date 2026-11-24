/* Legend Mod notification centre and sound mixer.
 *
 * Notification centre (option "notificationCentre", off by default): every toastr toast
 * (success / info / warning / error) is also kept, as plain text, in localStorage
 * 'lmNotifications' (last 200). A bell shows the unread count and opens a list that can be
 * filtered, marked read, cleared, and can stop the toasts of a category from showing (they
 * are still recorded). The hotkey "Open the notification centre" has no default key.
 * While the option is off the toasts pass straight through and nothing is stored.
 *
 * Mixer: volume per channel (chat, commands, gameplay effects, video skins, notifications)
 * times the master volume, all 1 by default (unchanged), and "audioDucking" (off by default):
 * a chat or alert sound that is really heard lowers the video skins while it plays. ogario.v4.js
 * asks LMNotifications.soundVolume / videoVolume where it plays a sound and reports the started
 * playback with duckPlayback (LMNotifications.play does both).
 */
(function (root) {
    'use strict';
    if (root._lmNotificationsLoaded) return;
    root._lmNotificationsLoaded = true;

    var CATEGORIES = ['achievements', 'bests', 'party', 'replay', 'connection', 'settings', 'chat', 'other'];
    var TYPES = ['success', 'info', 'warning', 'error'];
    var STORE_KEY = 'lmNotifications';
    var PREFS_KEY = 'lmNotificationPrefs';
    var MAX_ITEMS = 200;
    var MAX_TEXT = 300;          /* characters kept per notification */
    var MAX_BYTES = 120000;      /* stored JSON is cut (oldest first) to stay under this */
    var DUCK_MS = 1500;          /* how long the video skins stay lowered when the sound's length is unknown */
    var DUCK_MAX_MS = 10000;     /* at most, for a long sound */
    var DUCK_LEVEL = 0.3;        /* their volume meanwhile, as a fraction */
    /* channels whose sound lowers the video skins while "audioDucking" is on */
    var DUCK_CHANNELS = { chat: 1, commands: 1, notifications: 1 };
    var CHANNEL_KEYS = { chat: 'volChat', commands: 'volCommands', gameplay: 'volGameplay', video: 'volVideo', notifications: 'volNotifications' };
    /* "[TAG]:" prefixes used by the toasts. SERVER (the generic prefix) and ERROR are not
     * listed: their text decides. */
    var TAGS = {
        'SETTINGS': 'settings', 'PRESET': 'settings', 'SCAN TRICK': 'settings', 'MULTIBOX': 'settings',
        'PARTY': 'party', 'TEAM': 'party', 'CLAN': 'party', 'INVITE': 'party',
        'CHAT': 'chat',
        'AUTH': 'connection', 'CONNECTION': 'connection', 'SERVERS': 'connection',
        'REPLAY': 'replay',
        'BADGE': 'achievements', 'ACHIEVEMENT': 'achievements', 'ACHIEVEMENTS': 'achievements',
        'BEST': 'bests', 'RECORD': 'bests'
    };
    var CONTENT_RULES = [
        ['achievements', /\bbadges?\b|achievement|\bunlocked\b/],
        ['bests', /personal best|new best|new record|record broken|\bbeat your (best|record)/],
        ['party', /invit|\bparty\b|\bclan\b|joined (your|the) team|team (invite|request)/],
        ['replay', /\breplays?\b/],
        ['connection', /disconnect|reconnect|connect|websocket|\bsocket\b|offline|\bping\b|timed out|timeout|login elsewhere|logged in from another/],
        ['settings', /setting|preset|import|export|\bprofile\b|restored|hotkey/]
    ];

    /* ── pure helpers (also used by developers/tests/notifications.js) ── */

    function decodeEntities(s) {
        var named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
        return s.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,6}|#39);/gi, function (all, code) {
            var c = code.toLowerCase();
            if (named.hasOwnProperty(c)) return named[c];
            if (c.charAt(0) === '#') {
                var n = c.charAt(1) === 'x' ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10);
                /* no control characters, surrogates or values past Unicode */
                if (n >= 32 && n <= 0x10FFFF && !(n >= 0xD800 && n <= 0xDFFF) && n !== 127) {
                    try { return String.fromCodePoint(n); } catch (e) { }
                }
                return '';
            }
            return all;
        });
    }

    /* Toast HTML to plain text without parsing it as HTML (no DOM, so nothing in it can
     * load or run): script/style blocks and tags removed, entities decoded, spaces folded. */
    function stripHtml(html, max) {
        if (html == null) return '';
        var s = typeof html === 'string' ? html : (typeof html === 'number' || typeof html === 'boolean') ? String(html) : '';
        if (!s && html && typeof html.text === 'function') {
            try { s = String(html.text()); } catch (e) { s = ''; }
        }
        s = s.slice(0, 20000)
            .replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1\s*>/gi, ' ')
            .replace(/<!--[\s\S]*?-->/g, ' ')
            .replace(/<br\s*\/?>|<\/?(p|div|li|tr|td|h\d)\b[^>]*>/gi, ' ')
            .replace(/<\/?[a-z!\/?][^>]*>/gi, '')
            .replace(/</g, ' ');
        s = decodeEntities(s).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
        max = max || MAX_TEXT;
        return s.length > max ? s.slice(0, max - 1) + '…' : s;
    }

    /* Category of a toast: chat popups by their markup, then the "[TAG]:" prefix, then words. */
    function detectCategory(rawHtml, text) {
        var raw = typeof rawHtml === 'string' ? rawHtml : '';
        if (/class\s*=\s*["']?(message|command)-(nick|text)\b/i.test(raw)) return 'chat';
        var t = String(text || '');
        var m = /^\s*\[([^\]\[]{1,24})\]\s*:?\s*/.exec(t);
        if (m) {
            var tag = m[1].trim().toUpperCase();
            if (TAGS.hasOwnProperty(tag)) return TAGS[tag];
            t = t.slice(m[0].length);
        }
        var low = t.toLowerCase();
        for (var i = 0; i < CONTENT_RULES.length; i++) {
            if (CONTENT_RULES[i][1].test(low)) return CONTENT_RULES[i][0];
        }
        return 'other';
    }

    function makeItem(type, message, title, id, now) {
        var msg = stripHtml(message);
        var ttl = typeof title === 'string' ? stripHtml(title, 80) : '';
        var text = ttl && msg ? ttl + ': ' + msg : (ttl || msg);
        if (text.length > MAX_TEXT) text = text.slice(0, MAX_TEXT - 1) + '…';
        return {
            id: id,
            t: now,
            ty: TYPES.indexOf(type) >= 0 ? type : 'info',
            c: detectCategory(typeof message === 'string' ? message : '', msg),
            m: text
        };
    }

    /* Stored list -> clean list: anything malformed is dropped, text re-capped, ids unique. */
    function sanitizeItems(arr) {
        var out = [], seen = {};
        if (!Array.isArray(arr)) return out;
        for (var i = 0; i < arr.length; i++) {
            var it = arr[i];
            if (!it || typeof it !== 'object') continue;
            var id = Number(it.id), t = Number(it.t);
            if (!Number.isFinite(id) || id < 1 || Math.floor(id) !== id || seen[id]) continue;
            if (!Number.isFinite(t) || t <= 0) continue;
            if (TYPES.indexOf(it.ty) < 0 || CATEGORIES.indexOf(it.c) < 0 || typeof it.m !== 'string') continue;
            seen[id] = 1;
            out.push({ id: id, t: t, ty: it.ty, c: it.c, m: it.m.length > MAX_TEXT ? it.m.slice(0, MAX_TEXT) : it.m });
        }
        out.sort(function (a, b) { return a.id - b.id; });
        if (out.length > MAX_ITEMS) out = out.slice(out.length - MAX_ITEMS);
        return out;
    }

    function parseStore(raw) {
        var state = { items: [], nextId: 1 };
        if (typeof raw !== 'string' || !raw || raw.length > MAX_BYTES * 4) return state;
        var o = null;
        try { o = JSON.parse(raw); } catch (e) { return state; }
        if (!o || typeof o !== 'object') return state;
        state.items = sanitizeItems(o.items);
        var last = state.items.length ? state.items[state.items.length - 1].id : 0;
        var n = Number(o.nextId);
        state.nextId = Number.isFinite(n) && n > last && n < 9e15 ? Math.floor(n) : last + 1;
        return state;
    }

    /* JSON for storage, oldest entries dropped until it fits maxBytes (characters). */
    function serializeStore(state, maxBytes) {
        var items = (state.items || []).slice(-MAX_ITEMS);
        var limit = maxBytes || MAX_BYTES;
        var json = JSON.stringify({ v: 1, nextId: state.nextId, items: items });
        while (json.length > limit && items.length) {
            items = items.slice(Math.max(1, Math.ceil(items.length / 10)));
            json = JSON.stringify({ v: 1, nextId: state.nextId, items: items });
        }
        return json;
    }

    function parsePrefs(raw) {
        var p = { readId: 0, muted: {}, cat: 'all', type: 'all' };
        var o = null;
        try { o = typeof raw === 'string' && raw.length < 4000 ? JSON.parse(raw) : null; } catch (e) { o = null; }
        if (!o || typeof o !== 'object') return p;
        var r = Number(o.readId);
        if (Number.isFinite(r) && r >= 0) p.readId = Math.floor(r);
        if (o.muted && typeof o.muted === 'object') {
            CATEGORIES.forEach(function (c) { if (o.muted[c] === true) p.muted[c] = true; });
        }
        if (o.cat === 'all' || CATEGORIES.indexOf(o.cat) >= 0) p.cat = o.cat;
        if (o.type === 'all' || TYPES.indexOf(o.type) >= 0) p.type = o.type;
        return p;
    }

    function unreadCount(items, readId) {
        var n = 0;
        for (var i = items.length - 1; i >= 0 && items[i].id > readId; i--) n++;
        return n;
    }

    function filterItems(items, cat, type) {
        var out = [];
        for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i];
            if (cat && cat !== 'all' && it.c !== cat) continue;
            if (type && type !== 'all' && it.ty !== type) continue;
            out.push(it);
        }
        return out; /* newest first */
    }

    /* a volume setting: a number 0..1, anything else counts as 1 (unchanged) */
    function vol(v) {
        var n = typeof v === 'number' ? v : (typeof v === 'string' && v !== '' ? Number(v) : NaN);
        if (!Number.isFinite(n)) return 1;
        return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    /* base volume x channel x master x ducking, kept inside 0..1 (media elements throw outside) */
    function mixVolume(base, channel, master, duck) {
        var b = Number(base);
        if (!Number.isFinite(b)) b = 0;
        var v = b * vol(channel) * vol(master) * (duck == null ? 1 : vol(duck));
        return v < 0 ? 0 : v > 1 ? 1 : v;
    }

    /* ── state ── */

    function settings() { return root.legendmod5 || root.defaultmapsettings || {}; }
    function enabled() { return !!settings().notificationCentre; }
    function storage() { try { return root.localStorage || null; } catch (e) { return null; } }
    function now() { return Date.now(); }

    var state = null, prefs = null, saveTimer = null;

    function load() {
        if (state) return;
        var ls = storage(), raw = null, rawP = null;
        try { if (ls) { raw = ls.getItem(STORE_KEY); rawP = ls.getItem(PREFS_KEY); } } catch (e) { }
        state = parseStore(raw);
        prefs = parsePrefs(rawP);
        if (prefs.readId >= state.nextId) prefs.readId = state.nextId - 1;
    }

    function writeKey(key, value) {
        var ls = storage();
        if (!ls) return false;
        try { ls.setItem(key, value); return true; } catch (e) { return false; }
    }

    /* storage full or blocked: keep half of the list and try once more, else keep it in memory only */
    function saveNow() {
        if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
        if (!state) return;
        if (!writeKey(STORE_KEY, serializeStore(state))) {
            var half = { nextId: state.nextId, items: state.items.slice(Math.floor(state.items.length / 2)) };
            if (writeKey(STORE_KEY, serializeStore(half))) state.items = half.items;
        }
        writeKey(PREFS_KEY, JSON.stringify(prefs));
    }

    /* toasts come in bursts: write once they settle */
    function saveSoon() {
        if (saveTimer) return;
        saveTimer = setTimeout(saveNow, 1000);
    }

    function record(type, message, title) {
        load();
        var it = makeItem(type, message, title, state.nextId, now());
        if (!it.m) return null;
        state.nextId++;
        state.items.push(it);
        if (state.items.length > MAX_ITEMS) state.items.splice(0, state.items.length - MAX_ITEMS);
        saveSoon();
        ui.changed();
        return it;
    }

    /* ── toastr wrapper ── */

    function wrapToastr(t) {
        if (!t || t._lmNotifWrapped) return false;
        TYPES.forEach(function (type) {
            var orig = t[type];
            if (typeof orig !== 'function') return;
            var wrapped = function (message, title) {
                var it = null;
                if (enabled()) {
                    try { it = record(type, message, title); } catch (e) { it = null; }
                    /* a category the player muted: recorded, not shown. An empty jQuery set stands
                     * in for the toast so callers that chain on it (.css(...)) keep working. */
                    if (it && prefs.muted[it.c]) return root.jQuery ? root.jQuery() : undefined;
                }
                return orig.apply(this, arguments);
            };
            wrapped._lmOriginal = orig;
            t[type] = wrapped;
        });
        try { Object.defineProperty(t, '_lmNotifWrapped', { value: true }); } catch (e) { t._lmNotifWrapped = true; }
        return true;
    }

    /* ── mixer ── */

    var duckUntil = 0;

    function channelVolume(channel) {
        var s = settings();
        var key = CHANNEL_KEYS[channel];
        return mixVolume(1, key ? s[key] : 1, s.volMaster, 1);
    }

    function duckFactor() {
        return settings().audioDucking && now() < duckUntil ? DUCK_LEVEL : 1;
    }

    function videoVolume(base) {
        var s = settings();
        return mixVolume(base, s.volVideo, s.volMaster, duckFactor());
    }

    /* Ducks of the sounds playing now, { a: audio element, until: ms }: the video skins stay low until
     * the latest deadline. Their 500 ms volume tick (lmVideoSkinRegistry in ogario.v4.js) keeps them
     * low until then and brings them back afterwards. */
    var ducks = [];
    function duckRecompute() {
        var t = now(), max = 0;
        ducks = ducks.filter(function (d) { return d.until > t; });
        ducks.forEach(function (d) { if (d.until > max) max = d.until; });
        duckUntil = max;
    }
    function duck(until, audio) {
        var wasDucked = now() < duckUntil;
        /* the same element played again: its new playback replaces the old one */
        ducks = ducks.filter(function (d) { return !audio || d.a !== audio; });
        ducks.push({ a: audio || null, until: until });
        duckRecompute();
        if (wasDucked || !(now() < duckUntil)) return;
        var players = root.videoSkinPlayer;
        if (!players) return;
        for (var k in players) {
            var v = players[k];
            if (!v || v.paused || !(v.volume > 0)) continue;
            try { v.volume = mixVolume(v.volume, 1, 1, DUCK_LEVEL); } catch (e) { }
        }
    }
    /* a sound ended or failed: its duck ends (others keep theirs) */
    function release(audio) {
        ducks = ducks.filter(function (d) { return d.a !== audio; });
        duckRecompute();
    }
    function listenEnd(audio) {
        if (audio._lmDuckL || typeof audio.addEventListener !== 'function') return;
        try { audio._lmDuckL = true; } catch (e) { return; }
        ['ended', 'error'].forEach(function (n) { audio.addEventListener(n, function () { release(audio); }); });
    }
    /* A chat / alert sound was started with audio.play() (p: its promise). Ducks only when it is
     * heard: volume above 0, not muted, and play() succeeded (a muted channel or a refused play,
     * e.g. no user gesture yet, must not lower the video). Lasts as long as the sound still plays
     * (DUCK_MS when its length is unknown, at most DUCK_MAX_MS), less when it ends or fails. */
    function duckPlayback(audio, channel, p) {
        if (!audio || !settings().audioDucking || !DUCK_CHANNELS[channel]) return;
        if (audio.muted || !(+audio.volume > 0)) return;
        var go = function () {
            if (!settings().audioDucking || audio.muted || !(+audio.volume > 0) || audio.paused === true || audio.ended === true) return;
            var d = +audio.duration, left = isFinite(d) && d > 0 ? (d - (+audio.currentTime || 0)) * 1000 : DUCK_MS;
            if (!(left > 0)) return;
            duck(now() + Math.min(left, DUCK_MAX_MS), audio);
            listenEnd(audio);
        };
        if (p && typeof p.then === 'function') p.then(go, function () { });
        /* old browsers: play() gives no promise, the element says whether it plays */
        else if (audio.paused === false) go();
    }

    /* volume for a sound of this channel (ducking: duckPlayback once it plays) */
    function soundVolume(channel) {
        return channelVolume(channel);
    }

    /* for scripts: play an Audio element on a mixer channel */
    function play(audio, channel) {
        if (!audio || typeof audio.play !== 'function') return;
        try {
            var ch = channel || 'notifications', v = soundVolume(ch);
            if (audio.volume !== v) audio.volume = v;
            audio.currentTime = 0;
            var p = audio.play();
            if (p && p.catch) p.catch(function () { });
            duckPlayback(audio, ch, p);
        } catch (e) { }
    }

    /* ── UI: bell + panel ── */

    var CAT_LABELS = {
        achievements: ['lmNotifCatAchievements', 'Achievements / badges'],
        bests: ['lmNotifCatBests', 'Personal bests'],
        party: ['lmNotifCatParty', 'Party / team invitations'],
        replay: ['lmNotifCatReplay', 'Replay'],
        connection: ['lmNotifCatConnection', 'Connection'],
        settings: ['lmNotifCatSettings', 'Settings'],
        chat: ['lmNotifCatChat', 'Chat popups'],
        other: ['lmNotifCatOther', 'Other']
    };
    var TYPE_LABELS = {
        success: ['lmNotifTypeSuccess', 'Success'],
        info: ['lmNotifTypeInfo', 'Info'],
        warning: ['lmNotifTypeWarning', 'Warning'],
        error: ['lmNotifTypeError', 'Error']
    };
    var TYPE_COLORS = { success: '#51a351', info: '#2f96b4', warning: '#f89406', error: '#bd362f' };

    function L(key, en) {
        var t = root.textLanguage;
        return (t && typeof t[key] === 'string' && t[key]) || en;
    }
    function catLabel(c) { var l = CAT_LABELS[c] || CAT_LABELS.other; return L(l[0], l[1]); }
    function typeLabel(ty) { var l = TYPE_LABELS[ty] || TYPE_LABELS.info; return L(l[0], l[1]); }

    var CSS = '' +
        '#lm-notif-bell{position:fixed;z-index:99;width:32px;height:32px;padding:0;margin:0;border:0;border-radius:50%;' +
        'background:var(--lm-hud-bg,rgba(0,0,0,.55));color:var(--lm-hud-tc,#fff);font-size:17px;line-height:32px;text-align:center;cursor:pointer;' +
        'touch-action:manipulation;-webkit-tap-highlight-color:transparent;box-shadow:0 0 0 1px rgba(255,255,255,.18)}' +
        '#lm-notif-bell:hover,#lm-notif-bell:focus-visible{background:rgba(0,0,0,.75);outline:none;box-shadow:0 0 0 2px rgba(255,255,255,.45)}' +
        '#lm-notif-bell .lmn-count{position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;' +
        'background:#d9213a;color:#fff;font-weight:700;font-size:10px;line-height:16px;font-family:inherit;box-sizing:border-box}' +
        '#lm-notif-panel{position:fixed;z-index:100001;top:8px;left:50%;transform:translateX(-50%);width:400px;max-width:calc(100vw - 16px);' +
        'max-height:calc(100vh - 16px);display:flex;flex-direction:column;box-sizing:border-box;background:var(--lm-pc,#12141a);color:var(--lm-tc,#eee);overflow:hidden;' +
        'border:1px solid var(--lm-pc2,rgba(255,255,255,.15));border-top:3px solid var(--lm-mc,rgba(255,255,255,.15));border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-size:13px;line-height:1.35;font-family:inherit}' +
        '#lm-notif-panel .lmn-head,#lm-notif-panel .lmn-bar{display:flex;align-items:center;gap:6px;padding:6px 8px;flex-wrap:wrap}' +
        '#lm-notif-panel .lmn-head{border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1));background:linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%)}' +
        '#lm-notif-panel .lmn-title{font-weight:700;flex:1;white-space:nowrap;color:var(--lm-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
        '#lm-notif-panel button,#lm-notif-panel select{background:rgba(255,255,255,.05);color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.2));' +
        'border-radius:4px;padding:4px 8px;min-height:30px;font:inherit;cursor:pointer;touch-action:manipulation}' +
        '#lm-notif-panel select option{background:var(--lm-pc,#22252c);color:var(--lm-tc,#eee)}' +
        '#lm-notif-panel button:hover{background:rgba(255,255,255,.12)}' +
        '#lm-notif-panel .lmn-close{min-width:32px;font-size:18px;line-height:1;padding:2px 6px;color:var(--lm-tc2,#eee)}' +
        '#lm-notif-panel .lmn-mutes{padding:4px 10px 8px;border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1))}' +
        '#lm-notif-panel .lmn-mutes label{display:inline-flex;align-items:center;gap:4px;margin:3px 12px 3px 0;font-weight:400;cursor:pointer}' +
        '#lm-notif-panel .lmn-note{padding:6px 10px;color:#f8c56a}' +
        '#lm-notif-panel .lmn-list{list-style:none;margin:0;padding:0;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;min-height:60px}' +
        '#lm-notif-panel .lmn-list li{padding:6px 10px;border-top:1px solid rgba(255,255,255,.06);border-left:3px solid transparent;word-wrap:break-word;overflow-wrap:anywhere}' +
        '#lm-notif-panel .lmn-list li.lmn-unread{background:rgba(255,255,255,.05)}' +
        '#lm-notif-panel .lmn-meta{font-size:11px;color:var(--lm-tc2,rgba(238,238,238,.65));margin-bottom:2px}' +
        '#lm-notif-panel .lmn-empty{padding:16px 10px;text-align:center;color:var(--lm-tc2,rgba(238,238,238,.6))}';

    var ui = {
        bell: null,
        count: null,
        panel: null,
        list: null,
        timer: null,
        placedAt: null,

        changed: function () {
            this.updateCount();
            if (this.panel && this.panel.style.display !== 'none') this.renderList();
        },

        css: function () {
            var d = root.document;
            if (!d || d.getElementById('lm-notif-css')) return;
            var st = d.createElement('style');
            st.id = 'lm-notif-css';
            st.textContent = CSS;
            (d.head || d.body).appendChild(st);
        },

        /* bell shown while the option is on, removed while it is off */
        sync: function () {
            var d = root.document;
            if (!d || !d.body) return;
            if (!enabled()) {
                if (this.bell) { this.bell.parentNode && this.bell.parentNode.removeChild(this.bell); this.bell = null; this.count = null; }
                return;
            }
            if (!this.bell) {
                this.css();
                var b = d.createElement('button');
                b.id = 'lm-notif-bell';
                b.type = 'button';
                b.textContent = '🔔';
                var c = d.createElement('span');
                c.className = 'lmn-count';
                c.style.display = 'none';
                b.appendChild(c);
                b.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); ui.toggle(); });
                /* a tap on the bell must not also reach the game (split / feed) */
                ['mousedown', 'pointerdown', 'touchstart'].forEach(function (n) {
                    b.addEventListener(n, function (ev) { ev.stopPropagation(); }, { passive: true });
                });
                d.body.appendChild(b);
                this.bell = b;
                this.count = c;
                this.placedAt = null;
                this.updateCount();
            }
            this.place();
        },

        updateCount: function () {
            if (!this.bell) return;
            load();
            var n = unreadCount(state.items, prefs.readId);
            this.count.style.display = n ? '' : 'none';
            this.count.textContent = n > 99 ? '99+' : String(n);
            var title = L('lmNotifTitle', 'Notifications') + (n ? ' (' + n + ')' : '');
            this.bell.title = title;
            this.bell.setAttribute('aria-label', title);
        },

        /* Places the bell where it covers nothing: every visible element on screen is avoided
         * (HUD, minimap, leaderboard, chat, the phone buttons). Spots along the top edge first,
         * then the sides, then the bottom; it stays put while its spot is still free. */
        place: function () {
            var b = this.bell, d = root.document;
            if (!b) return;
            var w = root.innerWidth || d.documentElement.clientWidth, h = root.innerHeight || d.documentElement.clientHeight;
            var size = 32, gap = 6;
            var rects = avoidRects();
            var free = function (x, y) {
                for (var i = 0; i < rects.length; i++) {
                    var r = rects[i];
                    if (x < r.right + gap && x + size > r.left - gap && y < r.bottom + gap && y + size > r.top - gap) return false;
                }
                return true;
            };
            if (this.placedAt && this.placedAt.w === w && this.placedAt.h === h && free(this.placedAt.x, this.placedAt.y)) return;
            var spots = candidateSpots(w, h, size);
            var pick = spots[0];
            for (var i = 0; i < spots.length; i++) {
                if (free(spots[i][0], spots[i][1])) { pick = spots[i]; break; }
            }
            b.style.left = pick[0] + 'px';
            b.style.top = pick[1] + 'px';
            this.placedAt = { x: pick[0], y: pick[1], w: w, h: h, free: free(pick[0], pick[1]) };
        },

        build: function () {
            var d = root.document;
            this.css();
            var p = d.createElement('div');
            p.id = 'lm-notif-panel';
            p.setAttribute('role', 'dialog');
            p.setAttribute('aria-label', L('lmNotifTitle', 'Notifications'));
            p.style.display = 'none';

            var head = el('div', 'lmn-head');
            head.appendChild(el('span', 'lmn-title', L('lmNotifTitle', 'Notifications')));
            head.appendChild(btn(L('lmNotifMarkRead', 'Mark all read'), function () { markAllRead(); }));
            head.appendChild(btn(L('lmNotifClear', 'Clear'), function () { clearAll(); }));
            var close = btn('×', function () { ui.close(); });
            close.className = 'lmn-close';
            close.title = L('close', 'Close');
            close.setAttribute('aria-label', L('close', 'Close'));
            head.appendChild(close);
            p.appendChild(head);

            var bar = el('div', 'lmn-bar');
            var cat = d.createElement('select');
            cat.className = 'lmn-cat';
            cat.setAttribute('aria-label', L('lmNotifCategory', 'Category'));
            addOpt(cat, 'all', L('lmNotifAllCats', 'All categories'));
            CATEGORIES.forEach(function (c) { addOpt(cat, c, catLabel(c)); });
            cat.value = prefs.cat;
            cat.addEventListener('change', function () { prefs.cat = cat.value; saveSoon(); ui.renderList(); });
            var type = d.createElement('select');
            type.className = 'lmn-type';
            type.setAttribute('aria-label', L('lmNotifType', 'Type'));
            addOpt(type, 'all', L('lmNotifAllTypes', 'All types'));
            TYPES.forEach(function (t) { addOpt(type, t, typeLabel(t)); });
            type.value = prefs.type;
            type.addEventListener('change', function () { prefs.type = type.value; saveSoon(); ui.renderList(); });
            var mutesBtn = btn(L('lmNotifMutesBtn', 'Toasts…'), function () {
                mutes.style.display = mutes.style.display === 'none' ? '' : 'none';
            });
            mutesBtn.title = L('lmNotifMutesTitle', 'Don’t show the toasts of a category (they are still recorded here)');
            bar.appendChild(cat);
            bar.appendChild(type);
            bar.appendChild(mutesBtn);
            p.appendChild(bar);

            var mutes = el('div', 'lmn-mutes');
            mutes.style.display = 'none';
            mutes.appendChild(el('div', 'lmn-meta', L('lmNotifMutesTitle', 'Don’t show the toasts of a category (they are still recorded here)')));
            CATEGORIES.forEach(function (c) {
                var lab = d.createElement('label');
                var cb = d.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!prefs.muted[c];
                cb.addEventListener('change', function () {
                    if (cb.checked) prefs.muted[c] = true; else delete prefs.muted[c];
                    saveNow();
                });
                lab.appendChild(cb);
                lab.appendChild(d.createTextNode(catLabel(c)));
                mutes.appendChild(lab);
            });
            p.appendChild(mutes);

            this.note = el('div', 'lmn-note', L('lmNotifOffNote', 'Recording is off: turn on “Notification centre” in Settings.'));
            p.appendChild(this.note);
            this.list = el('ul', 'lmn-list');
            p.appendChild(this.list);

            /* keys typed in the panel (selects) and wheel / taps on it are not game input */
            ['keydown', 'keyup', 'wheel', 'mousedown', 'pointerdown', 'touchstart', 'contextmenu'].forEach(function (n) {
                p.addEventListener(n, function (ev) { ev.stopPropagation(); }, { passive: n === 'wheel' || n === 'touchstart' });
            });
            p.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') ui.close(); });
            d.body.appendChild(p);
            this.panel = p;
        },

        renderList: function () {
            var d = root.document, list = this.list;
            if (!list) return;
            while (list.firstChild) list.removeChild(list.firstChild);
            this.note.style.display = enabled() ? 'none' : '';
            var items = filterItems(state.items, prefs.cat, prefs.type);
            if (!items.length) {
                list.appendChild(el('li', 'lmn-empty', L('lmNotifEmpty', 'No notifications')));
                return;
            }
            var frag = d.createDocumentFragment();
            items.forEach(function (it) {
                var li = d.createElement('li');
                if (it.id > prefs.readId) li.className = 'lmn-unread';
                li.style.borderLeftColor = TYPE_COLORS[it.ty] || '#888';
                li.appendChild(el('div', 'lmn-meta', fmtTime(it.t) + ' · ' + typeLabel(it.ty) + ' · ' + catLabel(it.c)));
                li.appendChild(el('div', 'lmn-text', it.m)); /* textContent: stored text is never HTML */
                frag.appendChild(li);
            });
            list.appendChild(frag);
        },

        open: function () {
            if (!root.document || !root.document.body) return;
            load();
            if (!this.panel) this.build();
            this.panel.style.display = '';
            this.renderList();
        },
        close: function () {
            if (this.panel) this.panel.style.display = 'none';
            saveNow();
        },
        toggle: function () {
            if (this.panel && this.panel.style.display !== 'none') this.close(); else this.open();
        }
    };

    function el(tag, cls, text) {
        var e = root.document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function btn(text, fn) {
        var b = el('button', null, text);
        b.type = 'button';
        b.addEventListener('click', function (ev) { ev.preventDefault(); fn(); });
        return b;
    }
    function addOpt(sel, value, text) {
        var o = root.document.createElement('option');
        o.value = value;
        o.textContent = text;
        sel.appendChild(o);
    }
    function pad2(n) { return n < 10 ? '0' + n : String(n); }
    function fmtTime(t) {
        var dt = new Date(t), today = new Date();
        var hm = pad2(dt.getHours()) + ':' + pad2(dt.getMinutes()) + ':' + pad2(dt.getSeconds());
        if (dt.toDateString() === today.toDateString()) return hm;
        return dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate()) + ' ' + hm;
    }

    /* the bell's spots: along the top edge (outwards from just right of the centre, where the
     * target HUD is not), then the right and left edges, then the bottom */
    function candidateSpots(w, h, size) {
        var m = 8, step = 36, out = [], xs = [], i;
        var maxX = Math.max(m, w - size - m), maxY = Math.max(m, h - size - m);
        for (var x = m; x <= maxX; x += step) xs.push(x);
        var pref = w * 0.5 + 150;
        xs.sort(function (a, b) { return Math.abs(a - pref) - Math.abs(b - pref); });
        for (i = 0; i < xs.length; i++) out.push([xs[i], m]);
        for (var y = m + step; y <= maxY; y += step) out.push([maxX, y]);
        for (y = m + step; y <= maxY; y += step) out.push([m, y]);
        for (i = 0; i < xs.length; i++) out.push([xs[i], maxY]);
        return out;
    }

    /* Rectangles of the visible things on screen. Big containers (the canvas, full screen
     * wrappers) are looked into instead of avoided. Left out: toasts (they come and go) and
     * the main menu (it covers the bell anyway; avoiding it made the bell jump on every
     * menu open / close). */
    var SKIP_IDS = { 'lm-notif-bell': 1, 'lm-notif-panel': 1, 'toast-container': 1, 'overlays': 1 };
    /* nothing to see: no children, no text, no background or border (the font preload line
     * "&nbsp;" spans the whole top edge) */
    var REPLACED = { IMG: 1, CANVAS: 1, VIDEO: 1, INPUT: 1, BUTTON: 1, SELECT: 1, TEXTAREA: 1, IFRAME: 1, svg: 1, SVG: 1, OBJECT: 1, EMBED: 1 };
    function looksEmpty(c, cs) {
        if (c.children.length || REPLACED[c.tagName]) return false;
        if (String(c.textContent || '').trim()) return false;
        var bg = cs.backgroundColor;
        if (bg && bg !== 'transparent' && !/^rgba\(.*,\s*0\)$/.test(bg)) return false;
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return false;
        if (parseFloat(cs.borderTopWidth) || parseFloat(cs.borderBottomWidth) || parseFloat(cs.borderLeftWidth) || parseFloat(cs.borderRightWidth)) return false;
        if (cs.boxShadow && cs.boxShadow !== 'none') return false;
        /* icon font buttons draw in ::before / ::after */
        try {
            var b = root.getComputedStyle(c, '::before').content, a = root.getComputedStyle(c, '::after').content;
            if ((b && b !== 'none' && b !== 'normal') || (a && a !== 'none' && a !== 'normal')) return false;
        } catch (e) { return false; }
        return true;
    }
    function avoidRects() {
        var d = root.document, out = [];
        var w = root.innerWidth || 0, h = root.innerHeight || 0, area = w * h;
        var budget = 1500;
        function visit(parent, depth) {
            var kids = parent.children;
            for (var i = 0; i < kids.length && budget > 0; i++) {
                var c = kids[i];
                budget--;
                var tag = c.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'TEMPLATE') continue;
                if (SKIP_IDS[c.id]) continue;
                var cs = root.getComputedStyle(c);
                if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
                if (looksEmpty(c, cs)) continue;
                var r = c.getBoundingClientRect();
                var onScreen = r.right > 0 && r.bottom > 0 && r.left < w && r.top < h;
                var big = r.width * r.height > area * 0.3 || tag === 'CANVAS' && r.width >= w * 0.9;
                if (r.width >= 1 && r.height >= 1 && onScreen && !big) {
                    out.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
                    continue;
                }
                if (depth < 4 && tag !== 'CANVAS' && tag !== 'VIDEO' && tag !== 'IFRAME') visit(c, depth + 1);
            }
        }
        if (d && d.body && root.getComputedStyle) visit(d.body, 0);
        return out;
    }

    function markAllRead() {
        load();
        prefs.readId = state.nextId - 1;
        saveNow();
        ui.changed();
    }

    function clearAll() {
        load();
        state.items = [];
        prefs.readId = state.nextId - 1;
        saveNow();
        ui.changed();
    }

    function refresh() {
        if (root.toastr && !root.toastr._lmNotifWrapped) wrapToastr(root.toastr);
        try { ui.sync(); } catch (e) { }
    }

    /* ── start ── */

    load();
    wrapToastr(root.toastr);
    var api = {
        record: function (type, message, title) { return record(type, message, title); },
        items: function () { load(); return state.items.map(function (it) { return { id: it.id, t: it.t, type: it.ty, category: it.c, text: it.m }; }); },
        unread: function () { load(); return unreadCount(state.items, prefs.readId); },
        markAllRead: markAllRead,
        clear: clearAll,
        open: function () { ui.open(); },
        close: function () { ui.close(); },
        toggle: function () { ui.toggle(); },
        refresh: refresh,
        isMuted: function (cat) { load(); return !!prefs.muted[cat]; },
        setMuted: function (cat, on) {
            load();
            if (CATEGORIES.indexOf(cat) < 0) return;
            if (on) prefs.muted[cat] = true; else delete prefs.muted[cat];
            saveNow();
        },
        soundVolume: soundVolume,
        duckPlayback: duckPlayback,
        channelVolume: channelVolume,
        videoVolume: videoVolume,
        play: play,
        categories: CATEGORIES.slice(),
        _avoidRects: avoidRects,
        _bellPlace: function () { return ui.placedAt; },
        _core: {
            stripHtml: stripHtml, decodeEntities: decodeEntities, detectCategory: detectCategory, makeItem: makeItem,
            sanitizeItems: sanitizeItems, parseStore: parseStore, serializeStore: serializeStore, parsePrefs: parsePrefs,
            unreadCount: unreadCount, filterItems: filterItems, mixVolume: mixVolume, vol: vol, candidateSpots: candidateSpots,
            wrapToastr: wrapToastr, saveNow: saveNow, MAX_ITEMS: MAX_ITEMS, MAX_TEXT: MAX_TEXT, MAX_BYTES: MAX_BYTES,
            DUCK_LEVEL: DUCK_LEVEL, DUCK_MS: DUCK_MS, DUCK_MAX_MS: DUCK_MAX_MS
        }
    };
    root.LMNotifications = api;

    if (root.addEventListener) {
        root.addEventListener('pagehide', function () { if (saveTimer) saveNow(); });
        root.addEventListener('resize', function () { if (ui.bell) { ui.placedAt = null; refresh(); } });
    }
    /* the option can also change by a settings import or preset: check it every 2 s (and
     * look again for a free spot, the HUD moves when the menu closes or a panel opens) */
    if (root.setInterval) root.setInterval(refresh, 2000);
    refresh();
})(window);
