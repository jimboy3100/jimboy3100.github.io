/* Legend Mod stream overlay / second screen.
 *
 * Option "companionLive" (off by default): while it is on, a compact live state (mass, rank,
 * cells, time alive, eaten cells, server / mode, leaderboard top 10, the minimap data the client
 * already has, events) is published at most 4 times per second on
 * BroadcastChannel('legendmod-live'). companion.html (repo root) shows it as widgets, for a
 * second screen or an OBS source. Chat lines are added only with "companionChat" (off too).
 * Stream mode, "hide skin URL" and "hide my country" are applied here, before anything leaves
 * the game: what the player hides is never published.
 *
 * BroadcastChannel reaches pages of the same origin in the same browser only. When the game
 * runs elsewhere (agar.io with the extension, inside an iframe), "Open companion" opens
 * companion.html on www.legendmod.ml and posts the same messages to that one window.
 *
 * Result image: a 1200x630 PNG of the last life (or the current one): nick, mass, rank, time
 * alive and an optional minimap trail, drawn on a canvas and downloaded. Nothing is uploaded.
 * Reachable from Settings, the Game Over card, the Command Centre and a hotkey without key.
 *
 * companion.html loads this file too (window.LMCompanionPage = true): there only the pure
 * helpers in LMCompanion.core are defined. developers/tests/companion.js tests them in a vm.
 */
(function (root) {
    'use strict';
    if (root._lmCompanionLoaded) return;
    root._lmCompanionLoaded = true;

    var CHANNEL = 'legendmod-live';
    var PROTO = 1;
    var INTERVAL_MS = 250;        /* at most 4 states per second */
    var KEEPALIVE_MS = 2000;      /* an unchanged state is sent again after this (late pages) */
    var TRAIL_MS = 500;           /* own trail: a point every 500 ms ... */
    var MAX_TRAIL = 120;          /* ... the last 120 (about a minute) */
    var MAX_LB = 10, MAX_TEAM = 40, MAX_GHOSTS = 40, MAX_CHAT = 10, MAX_NICK = 40, MAX_TEXT = 200;
    var EVENT_BURST = 12;         /* events per second at most (several cells eaten at once) */
    var WIDGETS = ['card', 'mass', 'rank', 'time', 'minimap', 'leaderboard', 'stats', 'events', 'chat'];
    var ALIASES = { map: 'minimap', lb: 'leaderboard', top: 'leaderboard', top10: 'leaderboard', feed: 'events', kills: 'events',
        killfeed: 'events', event: 'events', match: 'stats', score: 'mass', alive: 'time' };
    var DEFAULT_WIDGETS = ['card', 'minimap', 'leaderboard', 'events'];
    var LAYOUTS = ['column', 'row', 'grid'];
    /* hosts that serve companion.html (this repository) */
    var HOSTS_RE = /^(www\.)?legendmod\.ml$|^jimboy3100\.github\.io$|^localhost$|^127\.0\.0\.1$/i;
    var COMPANION_URL = 'https://www.legendmod.ml/companion.html';
    var EVENT_TYPES = { spawn: 1, death: 1, best: 1, kill: 1, stats: 1 };

    /* ═══ Pure helpers (also used by companion.html and developers/tests/companion.js) ═══ */

    function str(v) {
        return v == null ? '' : typeof v === 'string' ? v : (typeof v === 'number' || typeof v === 'boolean') ? String(v) : '';
    }
    /* plain text: no control or bidi override characters, trimmed and cut */
    function clip(v, max) {
        return str(v).replace(/[\u0000-\u001f\u007f-\u009f‎‏‪-‮⁦-⁩]/g, '').trim().slice(0, max || 60);
    }
    function num(v, min, max, def) {
        v = Number(v);
        if (!isFinite(v)) return def;
        return v < min ? min : v > max ? max : v;
    }
    function int(v, max) { return Math.round(num(v, 0, max || 1e9, 0)); }
    /* a minimap coordinate, 0..1 (a little outside is kept: cells on the border) */
    function unit(v) {
        v = Number(v);
        if (!isFinite(v)) return null;
        return Math.round(Math.max(-0.05, Math.min(1.05, v)) * 1000) / 1000;
    }
    function point(p) {
        if (!p || typeof p !== 'object') return null;
        var x = unit(p.x), y = unit(p.y);
        return x === null || y === null ? null : { x: x, y: y };
    }
    /* https only, no credentials, no characters that could leave an attribute */
    function safeUrl(u, max) {
        u = str(u).trim();
        if (!u || u.length > (max || 500) || !/^https:\/\/[^\s"'<>`\\]+$/i.test(u)) return '';
        try {
            var p = new URL(u);
            if (p.protocol !== 'https:' || p.username || p.password || !p.hostname) return '';
            return p.href;
        } catch (e) { return ''; }
    }
    function safeColor(c, def) {
        c = str(c).trim();
        if (/^[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/i.test(c)) c = '#' + c;
        return /^#[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/i.test(c) ? c.toLowerCase() : def;
    }
    function fmtTime(ms) {
        var s = Math.max(0, Math.floor((+ms || 0) / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
        s = s % 60;
        return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    function fmtMass(n) {
        n = Math.round(+n || 0);
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /* The published state. opts: { streamMode, hideSkinUrl, hidecountry, chat }.
     * The output has the same shape as the input, so companion.html runs it again on what it
     * receives (with no hiding options) to clean data from any other page of the origin. */
    function buildState(src, opts) {
        src = src && typeof src === 'object' ? src : {};
        opts = opts || {};
        var stream = !!opts.streamMode;
        var playing = !!src.playing;
        var country = str(src.country).toLowerCase();
        var st = {
            playing: playing,
            mass: int(src.mass),
            best: int(src.best),
            cells: int(src.cells, 256),
            rank: int(src.rank, 10000),
            bestRank: int(src.bestRank, 10000),
            alive: playing ? int(src.alive, 24 * 3600 * 1000) : 0,
            kills: int(src.kills, 1e6),
            nick: stream ? '' : clip(src.nick, MAX_NICK),
            skin: stream || opts.hideSkinUrl ? '' : safeUrl(src.skin),
            country: stream || opts.hidecountry || !/^[a-z]{2}$/.test(country) ? '' : country,
            server: stream ? '' : clip(src.server, 80),
            serverType: clip(src.serverType, 20),
            mode: clip(src.mode, 30),
            lb: [],
            map: null
        };
        var lb = Array.isArray(src.lb) ? src.lb : [];
        for (var i = 0; i < lb.length && st.lb.length < MAX_LB; i++) {
            var e = lb[i] || {};
            var me = !!e.me;
            st.lb.push({ nick: me && stream ? '' : clip(e.nick, MAX_NICK), me: me });
        }
        var m = src.map;
        if (m && typeof m === 'object') {
            var map = { own: playing ? point(m.own) : null, team: [], ghosts: [], trail: [] };
            var team = Array.isArray(m.team) ? m.team : [];
            for (i = 0; i < team.length && map.team.length < MAX_TEAM; i++) {
                var p = point(team[i]);
                if (!p) continue;
                /* teammates' nicks can give the clan away: not in stream mode */
                p.nick = stream ? '' : clip(team[i].nick, MAX_NICK);
                p.color = safeColor(team[i].color, '');
                map.team.push(p);
            }
            var gh = Array.isArray(m.ghosts) ? m.ghosts : [];
            for (i = 0; i < gh.length && map.ghosts.length < MAX_GHOSTS; i++) {
                var g = point(gh[i]);
                if (!g) continue;
                g.r = Math.round(num(gh[i].r, 0, 0.2, 0) * 10000) / 10000;
                map.ghosts.push(g);
            }
            var tr = Array.isArray(m.trail) ? m.trail : [];
            for (i = Math.max(0, tr.length - MAX_TRAIL); i < tr.length; i++) {
                var t = point(tr[i]);
                if (t) map.trail.push(t);
            }
            st.map = map;
        }
        if (opts.chat && Array.isArray(src.chat)) {
            st.chat = [];
            for (i = Math.max(0, src.chat.length - MAX_CHAT); i < src.chat.length; i++) {
                var c = src.chat[i] || {};
                var text = clip(c.text, MAX_TEXT);
                if (!text) continue;
                st.chat.push({ nick: c.own && stream ? '' : clip(c.nick, MAX_NICK), text: stream ? '[redacted]' : text, cmd: !!c.cmd, own: !!c.own });
            }
        }
        return st;
    }

    /* One event for the feed; null for unknown types. Same shape in and out (see buildState). */
    function buildEvent(e) {
        if (!e || typeof e !== 'object' || !EVENT_TYPES[e.type]) return null;
        var o = { type: e.type, t: int(e.t, 1e15) };
        if (e.type === 'death' || e.type === 'best') { o.mass = int(e.mass); o.alive = int(e.alive, 24 * 3600 * 1000); }
        if (e.type === 'best') { o.massRecord = !!e.massRecord; o.timeRecord = !!e.timeRecord; }
        if (e.type === 'kill') { o.nick = clip(e.nick, MAX_NICK); o.mass = int(e.mass); }
        if (e.type === 'stats') { o.eaten = int(e.eaten, 1e6); o.top = int(e.top, 10000); }
        return o;
    }

    /* Sends a state at most every `interval` ms, and an unchanged one only every `keepalive` ms.
     * offer(state, now, force) returns true when it was posted. */
    function createPublisher(post, o) {
        o = o || {};
        var interval = o.interval || INTERVAL_MS, keep = o.keepalive || KEEPALIVE_MS;
        var lastAt = -Infinity, lastJson = '';
        return {
            offer: function (state, now, force) {
                if (!force && now - lastAt < interval) return false;
                var json = JSON.stringify(state);
                if (!force && json === lastJson && now - lastAt < keep) return false;
                lastAt = now;
                lastJson = json;
                post(state, now);
                return true;
            },
            reset: function () { lastAt = -Infinity; lastJson = ''; }
        };
    }

    /* at most `max` calls per `windowMs`; allow(now) says whether this one may go */
    function createRateLimit(max, windowMs) {
        var times = [];
        return function (now) {
            while (times.length && now - times[0] >= windowMs) times.shift();
            if (times.length >= max) return false;
            times.push(now);
            return true;
        };
    }

    /* companion.html URL parameters:
     *   w=card,minimap,...   widgets (aliases: map, lb, feed, kills, ...); none = the defaults
     *   layout=column|row|grid   bg=transparent|dark|green|<hex>   scale=0.5..3
     *   wm=<text>  wmimg=<https image URL>  wmpos=tl|tr|bl|br   accent=<hex>
     *   lines=<chat lines 1..20>  feed=<events 1..20>  demo=1 (sample data, for placing it in OBS) */
    function parseParams(search) {
        var q = {};
        str(search).slice(0, 3000).replace(/^[?#]/, '').split('&').forEach(function (part) {
            if (!part) return;
            var i = part.indexOf('='), k = i < 0 ? part : part.slice(0, i), v = i < 0 ? '' : part.slice(i + 1);
            try { k = decodeURIComponent(k.replace(/\+/g, ' ')); v = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { return; }
            k = k.toLowerCase().trim();
            if (k && !Object.prototype.hasOwnProperty.call(q, k)) q[k] = v;
        });
        var has = function (k) { return Object.prototype.hasOwnProperty.call(q, k); };
        var widgets = [];
        str(has('w') ? q.w : q.widgets).toLowerCase().split(/[\s,;|]+/).forEach(function (w) {
            w = ALIASES[w] || w;
            if (WIDGETS.indexOf(w) >= 0 && widgets.indexOf(w) < 0) widgets.push(w);
        });
        var bg = str(q.bg).trim().toLowerCase();
        if (bg === 'none' || bg === 'transparent' || bg === 'clear') bg = 'transparent';
        else if (bg === 'green' || bg === 'chroma') bg = '#00ff00';
        else if (bg === 'magenta') bg = '#ff00ff';
        else bg = safeColor(bg, 'dark');
        var pos = str(q.wmpos).toLowerCase();
        var layout = str(q.layout).toLowerCase();
        return {
            setup: !has('w') && !has('widgets'),
            widgets: widgets.length ? widgets : DEFAULT_WIDGETS.slice(),
            layout: LAYOUTS.indexOf(layout) >= 0 ? layout : 'column',
            bg: bg,
            scale: Math.round(num(has('scale') && q.scale !== '' ? q.scale : 1, 0.5, 3, 1) * 100) / 100,
            wm: clip(q.wm, 60),
            wmImg: safeUrl(q.wmimg),
            wmPos: /^(tl|tr|bl|br)$/.test(pos) ? pos : 'br',
            accent: safeColor(q.accent, '#01d9cc'),
            lines: Math.round(num(has('lines') && q.lines !== '' ? q.lines : 6, 1, 20, 6)),
            feed: Math.round(num(has('feed') && q.feed !== '' ? q.feed : 6, 1, 20, 6)),
            demo: q.demo === '1' || q.demo === 'true'
        };
    }
    /* the query string for a config (the setup form of companion.html builds its link with it) */
    function buildQuery(cfg) {
        cfg = cfg || {};
        var parts = ['w=' + (cfg.widgets && cfg.widgets.length ? cfg.widgets : DEFAULT_WIDGETS).join(',')];
        if (cfg.layout && cfg.layout !== 'column') parts.push('layout=' + cfg.layout);
        if (cfg.bg && cfg.bg !== 'dark') parts.push('bg=' + encodeURIComponent(cfg.bg));
        if (cfg.scale && cfg.scale !== 1) parts.push('scale=' + cfg.scale);
        if (cfg.wm) parts.push('wm=' + encodeURIComponent(cfg.wm));
        if (cfg.wmImg) parts.push('wmimg=' + encodeURIComponent(cfg.wmImg));
        if ((cfg.wm || cfg.wmImg) && cfg.wmPos && cfg.wmPos !== 'br') parts.push('wmpos=' + cfg.wmPos);
        if (cfg.accent && cfg.accent !== '#01d9cc') parts.push('accent=' + encodeURIComponent(cfg.accent));
        if (cfg.lines && cfg.lines !== 6) parts.push('lines=' + cfg.lines);
        if (cfg.feed && cfg.feed !== 6) parts.push('feed=' + cfg.feed);
        return '?' + parts.join('&');
    }

    /* Where "Open companion" goes: on an origin that has companion.html and in a top window the
     * BroadcastChannel works ('bc'); elsewhere the companion window opens on www.legendmod.ml and
     * gets the messages by postMessage ('popup'). */
    function openPlan(loc, inFrame) {
        loc = loc || {};
        var host = str(loc.hostname), proto = str(loc.protocol);
        if (!inFrame && HOSTS_RE.test(host) && (proto === 'https:' || proto === 'http:')) {
            return { mode: 'bc', url: str(loc.origin) + '/companion.html' };
        }
        return { mode: 'popup', url: COMPANION_URL, reason: inFrame ? 'frame' : 'origin' };
    }

    /* data for the result image; the nick and the server follow stream mode */
    function resultData(src, opts) {
        src = src || {};
        opts = opts || {};
        var trail = [];
        var tr = Array.isArray(src.trail) ? src.trail : [];
        for (var i = Math.max(0, tr.length - MAX_TRAIL); i < tr.length; i++) { var p = point(tr[i]); if (p) trail.push(p); }
        return {
            nick: opts.streamMode ? '' : clip(src.nick, MAX_NICK),
            mass: int(src.mass),
            rank: int(src.rank, 10000),
            alive: int(src.alive, 24 * 3600 * 1000),
            kills: src.kills == null ? -1 : int(src.kills, 1e6),
            mode: clip(src.mode, 30),
            server: opts.streamMode ? '' : clip(src.server, 80),
            at: int(src.at, 1e15),
            trail: trail
        };
    }

    /* the result image on a 1200x630 canvas context; o: { accent, panel, showTrail, labels } */
    function drawResult(ctx, d, o) {
        o = o || {};
        var W = 1200, H = 630, accent = safeColor(o.accent, '#01d9cc'), panel = safeColor(o.panel, '#00243e');
        var L = o.labels || {};
        var lab = function (k, en) { return clip(L[k], 40) || en; };
        var g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, '#05101c');
        g.addColorStop(1, panel);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, W, 8);
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';
        var font = '"Segoe UI", Ubuntu, Roboto, Arial, sans-serif';
        ctx.fillStyle = accent;
        ctx.font = '700 28px ' + font;
        ctx.fillText('LEGEND MOD', 60, 72);
        var withMap = o.showTrail && d.trail && d.trail.length > 1;
        var textW = withMap ? 640 : W - 120;
        /* nick: shrunk until it fits */
        var nick = d.nick || lab('result', 'Result');
        var size = 76;
        ctx.fillStyle = '#ffffff';
        do { ctx.font = '700 ' + size + 'px ' + font; size -= 4; } while (size > 30 && ctx.measureText(nick).width > textW);
        ctx.fillText(nick, 60, 160);
        var stats = [
            [lab('mass', 'Mass'), fmtMass(d.mass)],
            [lab('rank', 'Rank'), d.rank > 0 ? '#' + d.rank : '—'],
            [lab('time', 'Time alive'), fmtTime(d.alive)]
        ];
        if (d.kills >= 0) stats.push([lab('kills', 'Players eaten'), String(d.kills)]);
        var cols = 2, cw = textW / cols;
        for (var i = 0; i < stats.length; i++) {
            var x = 60 + (i % cols) * cw, y = 250 + Math.floor(i / cols) * 150;
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '600 26px ' + font;
            ctx.fillText(stats[i][0].toUpperCase(), x, y);
            ctx.fillStyle = i === 0 ? accent : '#ffffff';
            ctx.font = '800 72px ' + font;
            ctx.fillText(stats[i][1], x, y + 76);
        }
        if (withMap) {
            var mx = 760, my = 120, ms = 380;
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(mx, my, ms, ms);
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            for (i = 1; i < 5; i++) {
                ctx.beginPath(); ctx.moveTo(mx + ms * i / 5, my); ctx.lineTo(mx + ms * i / 5, my + ms); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(mx, my + ms * i / 5); ctx.lineTo(mx + ms, my + ms * i / 5); ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
            ctx.strokeRect(mx + 0.5, my + 0.5, ms - 1, ms - 1);
            var px = function (p) { return mx + Math.max(0, Math.min(1, p.x)) * ms; };
            var py = function (p) { return my + Math.max(0, Math.min(1, p.y)) * ms; };
            ctx.strokeStyle = accent;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(px(d.trail[0]), py(d.trail[0]));
            for (i = 1; i < d.trail.length; i++) ctx.lineTo(px(d.trail[i]), py(d.trail[i]));
            ctx.stroke();
            var last = d.trail[d.trail.length - 1];
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px(last), py(last), 8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '500 24px ' + font;
        var foot = [d.mode, d.server, d.at ? new Date(d.at).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : ''].filter(Boolean).join('  ·  ');
        ctx.fillText(foot, 60, H - 44);
        ctx.textAlign = 'right';
        ctx.fillText('legendmod.ml', W - 60, H - 44);
        ctx.textAlign = 'left';
    }

    var core = {
        CHANNEL: CHANNEL, PROTO: PROTO, WIDGETS: WIDGETS, DEFAULT_WIDGETS: DEFAULT_WIDGETS, INTERVAL_MS: INTERVAL_MS, KEEPALIVE_MS: KEEPALIVE_MS,
        clip: clip, safeUrl: safeUrl, safeColor: safeColor, fmtTime: fmtTime, fmtMass: fmtMass,
        buildState: buildState, buildEvent: buildEvent, createPublisher: createPublisher, createRateLimit: createRateLimit,
        parseParams: parseParams, buildQuery: buildQuery, openPlan: openPlan, resultData: resultData, drawResult: drawResult
    };
    var api = root.LMCompanion = { core: core };

    var D = root.document;
    if (root.LMCompanionPage || !D || typeof D.createElement !== 'function') return;

    /* ═══ In the game ═══ */

    var STR = {
        open: { en: 'Open companion', el: 'Άνοιγμα companion' },
        result: { en: 'Result image', el: 'Εικόνα αποτελέσματος' },
        download: { en: 'Download PNG', el: 'Λήψη PNG' },
        trail: { en: 'Minimap trail', el: 'Διαδρομή στον χάρτη' },
        close: { en: 'Close', el: 'Κλείσιμο' },
        noLife: { en: 'Play one life first: the image shows your last (or current) life.', el: 'Παίξε πρώτα μία ζωή: η εικόνα δείχνει την τελευταία (ή την τρέχουσα) ζωή σου.' },
        turnedOn: { en: 'Stream overlay turned on.', el: 'Η επικάλυψη stream ενεργοποιήθηκε.' },
        popup: {
            en: 'The game runs on {0}, where companion.html does not exist (or inside a frame), so the companion opens on www.legendmod.ml and only that window gets the data. Another tab or an OBS source can only listen when the game runs on www.legendmod.ml or jimboy3100.github.io in the same browser.',
            el: 'Το παιχνίδι τρέχει στο {0}, όπου δεν υπάρχει το companion.html (ή μέσα σε πλαίσιο), οπότε το companion ανοίγει στο www.legendmod.ml και μόνο αυτό το παράθυρο παίρνει τα δεδομένα. Άλλη καρτέλα ή πηγή OBS ακούει μόνο όταν το παιχνίδι τρέχει στο www.legendmod.ml ή στο jimboy3100.github.io στον ίδιο browser.'
        },
        blocked: { en: 'The browser blocked the window. Allow pop-ups for this site, or open {0} yourself.', el: 'Ο browser μπλόκαρε το παράθυρο. Επίτρεψε τα pop-ups για αυτή τη σελίδα ή άνοιξε μόνος σου το {0}.' },
        noBc: { en: 'This browser has no BroadcastChannel: only a companion opened with the button gets the data.', el: 'Αυτός ο browser δεν έχει BroadcastChannel: δεδομένα παίρνει μόνο ένα companion που άνοιξε με το κουμπί.' },
        rMass: { en: 'Mass', el: 'Μάζα' },
        rRank: { en: 'Rank', el: 'Θέση' },
        rTime: { en: 'Time alive', el: 'Χρόνος ζωής' },
        rKills: { en: 'Players eaten', el: 'Παίκτες που έφαγες' },
        rResult: { en: 'Result', el: 'Αποτέλεσμα' }
    };
    function lang() { try { return root.localStorage.getItem('languagemod') === '2' ? 'el' : 'en'; } catch (e) { return 'en'; } }
    function t(k) { var r = STR[k]; return r ? (r[lang()] || r.en) : k; }
    function settings() { return root.legendmod5 || root.defaultmapsettings || {}; }
    function toast(type, text) {
        if (!root.toastr || typeof root.toastr[type] !== 'function') return;
        root.toastr[type](String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
    }
    function hostOnly(u) {
        if (typeof root._lmHostOnly === 'function') { try { return root._lmHostOnly(u); } catch (e) { } }
        return '';
    }
    function hidingOpts(s) {
        return { streamMode: !!s.streamMode, hideSkinUrl: !!s.hideSkinUrl, hidecountry: !!s.hidecountry, chat: !!s.companionChat };
    }
    function inFrame() { try { return root.top !== root.self; } catch (e) { return true; } }

    /* life data kept by this module */
    var life = { kills: 0, bestRank: 0, trail: [], trailAt: 0 };
    var lastLife = null;      /* snapshot at death, for the result image */
    var chatLines = [];
    var session = Math.random().toString(36).slice(2, 10);
    var seq = 0;

    /* minimap coordinates exactly as application.drawMiniMap places them, divided by the map size */
    function mapFrame(LM) {
        var size = +LM.mapSize;
        if (!(size > 0)) return null;
        var r = (+LM.mapOffsetX || 0) + (LM.isLegendWorld ? 0 : (+LM.mapOffset || 0));
        var l = (+LM.mapOffsetY || 0) + (LM.isLegendWorld ? 0 : (+LM.mapOffset || 0));
        return { size: size, r: r, l: l };
    }
    function ownPoint(LM, f) {
        return { x: ((+LM.playerX || 0) + f.r) / f.size, y: ((+LM.playerY || 0) + f.l) / f.size };
    }
    function sampleTrail(LM, now) {
        if (!LM.play) { life.trail.length = 0; return; }
        if (now - life.trailAt < TRAIL_MS) return;
        var f = mapFrame(LM);
        if (!f) return;
        life.trailAt = now;
        var p = ownPoint(LM, f), last = life.trail[life.trail.length - 1];
        /* a jump (respawn, multibox swap) starts a new trail */
        if (last && Math.abs(last.x - p.x) + Math.abs(last.y - p.y) > 0.25) life.trail.length = 0;
        life.trail.push(p);
        if (life.trail.length > MAX_TRAIL) life.trail.shift();
    }
    function gameMode(LM) {
        var m = '';
        try { if (root.jQuery) m = String(root.jQuery('#gamemode option:selected').text() || '').trim(); } catch (e) { }
        return m || String(LM.gameMode || '').replace(/^:/, '');
    }
    function collect(now) {
        var LM = root.legendmod, app = root.application || {}, s = settings();
        if (!LM) return { playing: false };
        var playing = !!LM.play;
        var rank = +LM.playerPosition || 0;
        if (playing && rank > 0 && (!life.bestRank || rank < life.bestRank)) life.bestRank = rank;
        var src = {
            playing: playing,
            mass: LM.playerMass,
            best: LM.playerScore,
            cells: LM.playerCells ? LM.playerCells.length : 0,
            rank: rank,
            bestRank: life.bestRank,
            alive: app._lmLifeStartAt ? now - app._lmLifeStartAt : 0,
            kills: life.kills,
            nick: LM.playerNick || (root.ogarcopythelb && root.ogarcopythelb.nick) || '',
            skin: root.ogarcopythelb && root.ogarcopythelb.skinURL,
            country: LM.user && LM.user.country,
            server: hostOnly(LM.ws),
            serverType: LM.serverType,
            mode: gameMode(LM),
            lb: [],
            map: null,
            chat: chatLines
        };
        var lb = LM.leaderboard || [];
        for (var i = 0; i < lb.length && i < MAX_LB; i++) {
            src.lb.push({ nick: lb[i] && lb[i].nick, me: !!(lb[i] && (lb[i].id === 'isPlayer' || (rank > 0 && i + 1 === rank))) });
        }
        var f = mapFrame(LM);
        if (f) {
            var map = { own: ownPoint(LM, f), team: [], ghosts: [], trail: life.trail };
            var tp = app.teamPlayers || [];
            for (i = 0; i < tp.length; i++) {
                var tm = tp[i];
                if (!tm || !tm.alive) continue;
                /* the private minimap shows only the selected teammate */
                if (app.privateMiniMap && app.targetID && tm.id != app.targetID) continue;
                var margin = +LM.mapOffset || 0;
                if (LM.isLegendWorld) margin = tm._elRawCoords || tm.x < 0 || tm.y < 0 ? (+LM.mapOffsetX || 0) : 0;
                map.team.push({ x: (+tm.x + margin) / f.size, y: (+tm.y + margin) / f.size, nick: tm.nick, color: tm.color });
            }
            if (s.showMiniMapGhostCells && Array.isArray(LM.ghostCells)) {
                for (i = 0; i < LM.ghostCells.length; i++) {
                    var g = LM.ghostCells[i];
                    if (g && !g.inView) map.ghosts.push({ x: (+g.x + f.r) / f.size, y: (+g.y + f.l) / f.size, r: (+g.size || 0) / f.size });
                }
            }
            src.map = map;
        }
        return src;
    }

    /* ── publishing ── */
    var bc = null, popup = null, popupOrigin = '', timer = null, on = false;
    var allowEvent = createRateLimit(EVENT_BURST, 1000);
    function send(msg) {
        msg.v = PROTO;
        msg.s = session;
        msg.n = ++seq;
        if (bc) { try { bc.postMessage(msg); } catch (e) { } }
        if (popup) {
            if (popup.closed) popup = null;
            else { try { popup.postMessage(msg, popupOrigin); } catch (e) { popup = null; } }
        }
    }
    var publisher = createPublisher(function (state, now) { send({ kind: 'state', t: now, state: state }); });
    function tick(force) {
        var now = Date.now(), LM = root.legendmod;
        if (LM) sampleTrail(LM, now);
        var src = collect(now);
        publisher.offer(buildState(src, hidingOpts(settings())), now, force);
    }
    function event(e) {
        if (!on) return;
        var now = Date.now();
        if (!allowEvent(now)) return;
        e.t = now;
        var ev = buildEvent(e);
        if (ev) send({ kind: 'event', t: now, event: ev });
    }

    /* LMEvents listeners, all only while the option is on (nobody listens otherwise) */
    function onSpawn() {
        life.kills = 0;
        life.bestRank = 0;
        life.trail = [];
        life.trailAt = 0;
        event({ type: 'spawn' });
    }
    function onDeath(d) {
        var LM = root.legendmod || {}, app = root.application || {};
        var rank = +LM.playerPosition || 0;
        var trail = life.trail.slice();
        /* no own trail yet (option turned on during this life): the game's minimap trail
         * (option "showMiniMapTrail"), still there at death */
        if (trail.length < 2 && Array.isArray(app._lmTrail) && app._lmTrail.length > 1) {
            var f = mapFrame(LM);
            if (f) trail = app._lmTrail.map(function (p) { return { x: (p.x + f.r) / f.size, y: (p.y + f.l) / f.size }; });
        }
        lastLife = {
            nick: LM.playerNick || (root.ogarcopythelb && root.ogarcopythelb.nick) || '',
            mass: d && d.mass, alive: d && d.msAlive,
            rank: life.bestRank && (!rank || life.bestRank < rank) ? life.bestRank : rank,
            kills: life.kills,
            mode: gameMode(LM), server: hostOnly(LM.ws), at: (d && d.time) || Date.now(), trail: trail
        };
        event({ type: 'death', mass: d && d.mass, alive: d && d.msAlive });
        tick(true);
    }
    function onBest(d) { event({ type: 'best', mass: d.mass, alive: d.msAlive, massRecord: d.massRecord, timeRecord: d.timeRecord }); }
    function onKill(d) {
        life.kills++;
        event({ type: 'kill', nick: d.nick, mass: d.mass });
    }
    function onStats(d) {
        if (lastLife && Date.now() - lastLife.at < 30000) {
            if (d.playersEaten >= 0) lastLife.kills = d.playersEaten;
            if (d.topPosition > 0 && (!lastLife.rank || d.topPosition < lastLife.rank)) lastLife.rank = d.topPosition;
            if (d.highestMass > lastLife.mass) lastLife.mass = d.highestMass;
        }
        event({ type: 'stats', eaten: d.playersEaten, top: d.topPosition });
    }
    function onChat(d) {
        if (!settings().companionChat) return;
        chatLines.push({ nick: d.nick, text: d.text, cmd: d.type === 'command', own: !!d.own });
        if (chatLines.length > MAX_CHAT) chatLines.shift();
    }
    function onBcMessage(e) {
        var d = e && e.data;
        if (d && d.kind === 'hello' && on) tick(true);
    }
    function onWindowMessage(e) {
        if (!popup || e.source !== popup) return;
        var d = e.data;
        if (d && d.kind === 'hello' && on) tick(true);
    }
    function onPageHide() { if (on) send({ kind: 'bye' }); }

    var EV = root.LMEvents && typeof root.LMEvents.on === 'function' ? root.LMEvents : null;
    var LISTEN = [['spawn', onSpawn], ['death', onDeath], ['personalBest', onBest], ['kill', onKill], ['gameStats', onStats], ['chat', onChat]];
    function start() {
        if (on) return;
        on = true;
        if (typeof root.BroadcastChannel === 'function') {
            try { bc = new root.BroadcastChannel(CHANNEL); bc.onmessage = onBcMessage; } catch (e) { bc = null; }
        }
        if (EV) LISTEN.forEach(function (l) { EV.on(l[0], l[1]); });
        root.addEventListener('message', onWindowMessage);
        root.addEventListener('pagehide', onPageHide);
        publisher.reset();
        timer = setInterval(function () { try { tick(false); } catch (e) { } }, INTERVAL_MS);
        tick(true);
    }
    function stop() {
        if (!on) return;
        send({ kind: 'bye' });
        on = false;
        clearInterval(timer);
        timer = null;
        if (EV) LISTEN.forEach(function (l) { EV.off(l[0], l[1]); });
        root.removeEventListener('message', onWindowMessage);
        root.removeEventListener('pagehide', onPageHide);
        if (bc) { try { bc.close(); } catch (e) { } bc = null; }
        chatLines.length = 0;
    }
    function refresh() {
        var s = settings();
        if (s.companionLive) start(); else stop();
        if (!s.companionChat) chatLines.length = 0;
        placeButtons();
    }

    /* ── Open companion ── */
    function open() {
        var s = settings();
        if (!s.companionLive) {
            s.companionLive = true;
            var app = root.application;
            if (app && typeof app.syncHotkeyOption === 'function') app.syncHotkeyOption('companionLive');
            refresh();
            toast('info', t('turnedOn'));
        }
        var plan = openPlan(root.location, inFrame());
        var w = null;
        try { w = root.open(plan.url, 'lmCompanion'); } catch (e) { w = null; }
        if (!w) { toast('warning', t('blocked').replace('{0}', plan.url)); return null; }
        if (plan.mode === 'popup') {
            popup = w;
            try { popupOrigin = new URL(plan.url).origin; } catch (e) { popupOrigin = 'https://www.legendmod.ml'; }
            toast('info', t('popup').replace('{0}', String(root.location && root.location.hostname || '?').slice(0, 60)));
        } else if (typeof root.BroadcastChannel !== 'function') {
            popup = w;
            popupOrigin = root.location.origin;
            toast('warning', t('noBc'));
        }
        setTimeout(function () { if (on) tick(true); }, 1500);
        return plan;
    }

    /* ── Result image ── */
    function currentLife() {
        var LM = root.legendmod, app = root.application || {};
        if (!LM || !LM.play) return null;
        var rank = +LM.playerPosition || 0;
        var f = mapFrame(LM), trail = life.trail.slice();
        if (trail.length < 2 && f && Array.isArray(app._lmTrail)) trail = app._lmTrail.map(function (p) { return { x: (p.x + f.r) / f.size, y: (p.y + f.l) / f.size }; });
        return {
            nick: LM.playerNick || (root.ogarcopythelb && root.ogarcopythelb.nick) || '',
            mass: Math.max(+LM.playerScore || 0, +LM.playerMass || 0), alive: app._lmLifeStartAt ? Date.now() - app._lmLifeStartAt : 0,
            rank: life.bestRank && (!rank || life.bestRank < rank) ? life.bestRank : rank, kills: on ? life.kills : null,
            mode: gameMode(LM), server: hostOnly(LM.ws), at: Date.now(), trail: trail
        };
    }
    function closeResult() {
        var el = D.getElementById('lm-result-modal');
        if (el && el.parentNode) el.parentNode.removeChild(el);
        D.removeEventListener('keydown', resultKey, true);
        root.removeEventListener('resize', fitResult);
    }
    /* canvas shown as large as the screen allows under the buttons (915x412 phone included) */
    function fitResult() {
        var md = D.getElementById('lm-result-modal');
        var cv = md && md.querySelector('canvas'), bar = md && md.querySelector('.lmr-bar');
        if (!cv || !bar) return;
        for (var i = 0; i < 2; i++) {
            var w = Math.min(900, (root.innerWidth || 900) - 40, ((root.innerHeight || 500) - 46 - (bar.offsetHeight || 34)) * 1200 / 630);
            w = Math.max(160, Math.floor(w));
            cv.style.width = w + 'px';
            cv.style.height = Math.floor(w * 630 / 1200) + 'px';
        }
    }
    function resultKey(e) { if (e.key === 'Escape') { e.stopPropagation(); closeResult(); } }
    function resultImage(o) {
        o = o || {};
        var LM = root.legendmod || {};
        var u = o.stats || (LM._lmLastSessionStats && Date.now() - (LM._lmLastSessionStatsAt || 0) < 30 * 60000 ? LM._lmLastSessionStats : null);
        /* from the Game Over card: that life, even after a quick respawn */
        var src = o.stats ? null : currentLife();
        if (!src && u && typeof u === 'object') {
            /* after a death: the server's Game Over numbers, with the life kept here while the
             * option was on (trail, best rank) when they belong to the same death */
            var at = +LM._lmLastSessionStatsAt || Date.now();
            var same = lastLife && Math.abs(at - lastLife.at) < 60000;
            src = {
                nick: same ? lastLife.nick : (LM.playerNick || (root.ogarcopythelb && root.ogarcopythelb.nick) || ''),
                mass: Math.max(+u.highestMass || 0, +u.finalMass || 0, same ? +lastLife.mass || 0 : 0),
                alive: (+(u.timeTotal || u.longestTimeAlive) || 0) * 1000 || (same ? lastLife.alive : 0),
                rank: +u.topPosition > 0 ? +u.topPosition : (same ? lastLife.rank : 0),
                kills: u.playersEaten != null ? +u.playersEaten || 0 : (same ? lastLife.kills : null),
                mode: same ? lastLife.mode : gameMode(LM), server: same ? lastLife.server : hostOnly(LM.ws), at: same ? lastLife.at : at,
                trail: same ? lastLife.trail : []
            };
        }
        if (!src) src = lastLife;
        if (!src) { toast('info', t('noLife')); return null; }
        closeResult();
        var data = resultData(src, { streamMode: !!settings().streamMode });
        var ds = root.defaultSettings || {};
        var accent = safeColor(ds.menuMainColor, '#01d9cc'), panel = safeColor(ds.menuPanelColor, '#00243e');
        var labels = { mass: t('rMass'), rank: t('rRank'), time: t('rTime'), kills: t('rKills'), result: t('rResult') };
        var showTrail = data.trail.length > 1;

        var md = D.createElement('div');
        md.id = 'lm-result-modal';
        md.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box;';
        var box = D.createElement('div');
        box.style.cssText = 'background:' + panel + ';border-top:3px solid ' + accent + ';border-radius:6px;padding:8px;box-sizing:border-box;max-width:100%;max-height:100%;' +
            'display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font:12px sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
        var cv = D.createElement('canvas');
        cv.width = 1200;
        cv.height = 630;
        /* scaled down to the screen (on a 915x412 phone it stays under the buttons) */
        cv.style.cssText = 'display:block;border-radius:4px;';
        var bar = D.createElement('div');
        bar.className = 'lmr-bar';
        bar.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;';
        var btn = function (text, cls) {
            var b = D.createElement('button');
            b.type = 'button';
            b.className = cls;
            b.textContent = text;
            b.style.cssText = 'width:auto;margin:0;min-height:32px;min-width:32px;padding:4px 14px;white-space:nowrap;line-height:1.2;font-size:13px;border:0;border-radius:4px;cursor:pointer;font-weight:700;color:#fff;background:' + (cls === 'lmr-dl' ? accent : 'rgba(255,255,255,0.15)') + ';';
            return b;
        };
        var dl = btn('⬇ ' + t('download'), 'lmr-dl');
        var trailLab = D.createElement('label');
        /* the menu's label / checkbox styles do not apply here */
        trailLab.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;min-height:32px;width:auto;margin:0;padding:0 4px;white-space:nowrap;font-size:13px;color:#fff;';
        var trailCb = D.createElement('input');
        trailCb.type = 'checkbox';
        trailCb.style.cssText = 'width:18px;height:18px;margin:0;position:static;opacity:1;display:inline-block;';
        trailCb.className = 'lmr-trail';
        trailCb.checked = showTrail;
        trailCb.disabled = !showTrail;
        trailLab.appendChild(trailCb);
        trailLab.appendChild(D.createTextNode(t('trail')));
        var cl = btn('✕ ' + t('close'), 'lmr-close');
        bar.appendChild(dl);
        bar.appendChild(trailLab);
        bar.appendChild(cl);
        box.appendChild(cv);
        box.appendChild(bar);
        md.appendChild(box);
        var draw = function () {
            var ctx = cv.getContext && cv.getContext('2d');
            if (ctx) drawResult(ctx, data, { accent: accent, panel: panel, showTrail: trailCb.checked, labels: labels });
        };
        draw();
        trailCb.addEventListener('change', draw);
        dl.addEventListener('click', function (e) {
            e.stopPropagation();
            var name = 'legendmod-result-' + new Date(data.at || Date.now()).toISOString().slice(0, 16).replace(/[-:T]/g, '') + '.png';
            var save = function (href, revoke) {
                var a = D.createElement('a');
                a.href = href;
                a.download = name;
                D.body.appendChild(a);
                a.click();
                D.body.removeChild(a);
                if (revoke) setTimeout(function () { try { URL.revokeObjectURL(href); } catch (e2) { } }, 4000);
            };
            try {
                if (cv.toBlob) cv.toBlob(function (b) { if (b) save(URL.createObjectURL(b), true); else save(cv.toDataURL('image/png')); }, 'image/png');
                else save(cv.toDataURL('image/png'));
            } catch (err) { toast('warning', 'Could not save the image.'); }
        });
        cl.addEventListener('click', function (e) { e.stopPropagation(); closeResult(); });
        md.addEventListener('click', function (e) { if (e.target === md) closeResult(); });
        /* keys stay out of the game while the window is open */
        md.addEventListener('keydown', function (e) { e.stopPropagation(); });
        D.addEventListener('keydown', resultKey, true);
        D.body.appendChild(md);
        fitResult();
        root.addEventListener('resize', fitResult);
        return md;
    }

    /* ── Buttons under the option in Settings ── */
    function placeButtons() {
        var cb = D.getElementById('companionLive');
        var label = cb && cb.closest ? cb.closest('label') : null;
        if (!label || !label.parentNode) return false;
        var row = D.getElementById('lm-companion-row');
        if (!row) {
            row = D.createElement('div');
            row.id = 'lm-companion-row';
            row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 6px;';
            [['open', open], ['result', function () { resultImage(); }]].forEach(function (b) {
                var el = D.createElement('button');
                el.type = 'button';
                el.className = 'btn btn-xs lm-companion-' + b[0];
                el.style.cssText = 'min-height:26px;';
                el.textContent = t(b[0]);
                el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); b[1](); });
                row.appendChild(el);
            });
        }
        if (row.previousSibling !== label) label.parentNode.insertBefore(row, label.nextSibling);
        return true;
    }

    /* publishing follows the saved option at once; the Settings buttons wait for the menu */
    var tries = 0;
    function boot() {
        if (placeButtons()) return;
        if (++tries < 240) setTimeout(boot, 500);
    }
    setTimeout(function () { refresh(); boot(); }, 0);

    api.refresh = refresh;
    api.open = open;
    api.resultImage = resultImage;
    api.closeResult = closeResult;
    api.isOn = function () { return on; };
    /* for the smoke test: one state now, built like the published ones */
    api.publishNow = function () { if (on) tick(true); return on; };
})(typeof window !== 'undefined' ? window : this);
