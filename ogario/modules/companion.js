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
        return str(v).replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').trim().slice(0, max || 60);
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

    /* The published state. opts: { streamMode, hideSkinUrl, hidecountry, chat, hideTeam, map }
     * (map: 'live' | 'delay' | 'hide'; the delay itself is applied by the game part). A state built in
     * stream mode says so (stream: true), so building it again keeps it hidden and companion.html
     * also hides the names in the events it already shows.
     * The output has the same shape as the input, so companion.html runs it again on what it
     * receives (with no hiding options) to clean data from any other page of the origin. */
    function buildState(src, opts) {
        src = src && typeof src === 'object' ? src : {};
        opts = opts || {};
        var stream = !!opts.streamMode || src.stream === true;
        var playing = !!src.playing;
        var country = str(src.country).toLowerCase();
        var st = {
            playing: playing,
            stream: stream,
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
        var m = opts.map === 'hide' ? null : src.map;
        if (m && typeof m === 'object') {
            var map = { own: playing ? point(m.own) : null, team: [], ghosts: [], trail: [] };
            var team = Array.isArray(m.team) && !opts.hideTeam ? m.team : [];
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
                /* stream mode: no sender names at all (they were only hidden for own lines) */
                st.chat.push({ nick: stream ? '' : clip(c.nick, MAX_NICK), text: stream ? '[redacted]' : text, cmd: !!c.cmd, own: !!c.own });
            }
        }
        return st;
    }

    /* One event for the feed; null for unknown types. Same shape in and out (see buildState).
     * opts.streamMode: no name of the eaten player (like the chat names). */
    function buildEvent(e, opts) {
        if (!e || typeof e !== 'object' || !EVENT_TYPES[e.type]) return null;
        var o = { type: e.type, t: int(e.t, 1e15) };
        if (e.type === 'death' || e.type === 'best') { o.mass = int(e.mass); o.alive = int(e.alive, 24 * 3600 * 1000); }
        if (e.type === 'best') { o.massRecord = !!e.massRecord; o.timeRecord = !!e.timeRecord; }
        if (e.type === 'kill') { o.nick = opts && opts.streamMode ? '' : clip(e.nick, MAX_NICK); o.mass = int(e.mass); }
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

    /* the stored privacy switches (localStorage 'lmCompanionPrivacy'), checked on read */
    var MAP_MODES = ['live', 'delay', 'hide'];
    function parsePrivacy(raw) {
        var o = null;
        if (typeof raw === 'string' && raw.length < 2000) { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        if (!o || typeof o !== 'object') o = {};
        return { hideTeam: o.hideTeam === true, map: MAP_MODES.indexOf(o.map) >= 0 ? o.map : 'live' };
    }
    /* values shown `ms` late: push(now, v) keeps them, get(now) gives the newest one that is at
     * least `ms` old (null before that); at most one value per `step` ms is kept */
    function createDelay(ms, step) {
        var q = [], lastAt = -Infinity;
        step = step || 500;
        return {
            push: function (now, v) {
                if (now - lastAt < step) return;
                lastAt = now;
                q.push({ t: now, v: v });
            },
            get: function (now) {
                var i = -1;
                for (var k = 0; k < q.length && now - q[k].t >= ms; k++) i = k;
                if (i < 0) return null;
                if (i > 0) q.splice(0, i);
                return q[0].v;
            },
            clear: function () { q.length = 0; lastAt = -Infinity; },
            size: function () { return q.length; }
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

    /* an LMEvents event of a real game: practice arena and replay lives are not published
     * (cores without the context field: the practice / replay flags) */
    function liveEvent(e, w) {
        if (e && e.context) return e.context === 'live';
        return !(w && ((w.LMPractice && w.LMPractice.on) || w._lmEvReplayOn));
    }

    var core = {
        liveEvent: liveEvent,
        CHANNEL: CHANNEL, PROTO: PROTO, WIDGETS: WIDGETS, DEFAULT_WIDGETS: DEFAULT_WIDGETS, INTERVAL_MS: INTERVAL_MS, KEEPALIVE_MS: KEEPALIVE_MS,
        clip: clip, safeUrl: safeUrl, safeColor: safeColor, fmtTime: fmtTime, fmtMass: fmtMass,
        buildState: buildState, buildEvent: buildEvent, createPublisher: createPublisher, createRateLimit: createRateLimit,
        parseParams: parseParams, buildQuery: buildQuery, openPlan: openPlan, parsePrivacy: parsePrivacy, createDelay: createDelay
    };
    var api = root.LMCompanion = { core: core };

    var D = root.document;
    if (root.LMCompanionPage || !D || typeof D.createElement !== 'function') return;

    /* ═══ In the game ═══ */

    /* texts from the language packs (developers/i18n/src) */
    var P = 'modules.companion.';
    function t(k, vars) { return typeof root.lmT === 'function' ? root.lmT(P + k, vars) : k; }
    /* an element whose text follows the language (LMi18n.apply fills data-i18n on a change) */
    function i18nText(el, k) {
        el.setAttribute('data-i18n', P + k);
        el.textContent = t(k);
        return el;
    }
    function settings() { return root.legendmod5 || root.defaultmapsettings || {}; }
    function toast(type, text) {
        if (!root.toastr || typeof root.toastr[type] !== 'function') return;
        root.toastr[type](String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
    }
    function hostOnly(u) {
        if (typeof root._lmHostOnly === 'function') { try { return root._lmHostOnly(u); } catch (e) { } }
        return '';
    }
    /* privacy switches against stream sniping (localStorage 'lmCompanionPrivacy'): hide the
     * teammates, the minimap and own position live, 30 s late or hidden */
    var PRIV_KEY = 'lmCompanionPrivacy', MAP_DELAY_MS = 30000;
    var privacy = parsePrivacy(null);
    try { privacy = parsePrivacy(root.localStorage.getItem(PRIV_KEY)); } catch (e) { }
    function setPrivacy(ch) {
        privacy = parsePrivacy(JSON.stringify({ hideTeam: own(ch, 'hideTeam') ? ch.hideTeam : privacy.hideTeam, map: own(ch, 'map') ? ch.map : privacy.map }));
        try { root.localStorage.setItem(PRIV_KEY, JSON.stringify(privacy)); } catch (e) { }
        /* positions kept under the old switches are not shown later */
        mapDelay.clear();
        if (on) tick(true);
    }
    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function hidingOpts(s) {
        return { streamMode: !!s.streamMode, hideSkinUrl: !!s.hideSkinUrl, hidecountry: !!s.hidecountry, chat: !!s.companionChat,
            hideTeam: privacy.hideTeam, map: privacy.map };
    }
    function inFrame() { try { return root.top !== root.self; } catch (e) { return true; } }

    /* life data kept by this module */
    var life = { kills: 0, bestRank: 0, trail: [], trailAt: 0 };
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
    var mapDelay = createDelay(MAP_DELAY_MS, TRAIL_MS);
    var lastStream = null;
    function tick(force) {
        var now = Date.now(), LM = root.legendmod, o = hidingOpts(settings());
        /* stream mode switched: the chat lines kept so far belong to the other mode */
        if (lastStream !== null && o.streamMode !== lastStream) { chatLines.length = 0; force = true; }
        lastStream = o.streamMode;
        if (LM) sampleTrail(LM, now);
        var st = buildState(collect(now), o);
        /* 30 s late: the map published is the one from 30 s ago (nothing before that) */
        if (o.map === 'delay') {
            mapDelay.push(now, st.map);
            st.map = mapDelay.get(now);
        }
        publisher.offer(st, now, force);
    }
    function event(e) {
        if (!on) return;
        var now = Date.now();
        if (!allowEvent(now)) return;
        e.t = now;
        var ev = buildEvent(e, hidingOpts(settings()));
        if (ev) send({ kind: 'event', t: now, event: ev });
    }

    /* LMEvents listeners, all only while the option is on (nobody listens otherwise) */
    function onSpawn(d) {
        if (!liveEvent(d, root)) return;
        life.kills = 0;
        life.bestRank = 0;
        life.trail = [];
        life.trailAt = 0;
        event({ type: 'spawn' });
    }
    function onDeath(d) {
        if (!liveEvent(d, root)) return;
        event({ type: 'death', mass: d && d.mass, alive: d && d.msAlive });
        tick(true);
    }
    function onBest(d) { if (liveEvent(d, root)) event({ type: 'best', mass: d.mass, alive: d.msAlive, massRecord: d.massRecord, timeRecord: d.timeRecord }); }
    function onKill(d) {
        if (!liveEvent(d, root)) return;
        life.kills++;
        event({ type: 'kill', nick: d.nick, mass: d.mass });
    }
    function onStats(d) {
        if (!liveEvent(d, root)) return;
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
    /* another server: its chat and the own trail are not about the new one */
    function onServerChange() {
        chatLines.length = 0;
        mapDelay.clear();
        life.trail.length = 0;
        life.trailAt = 0;
        life.bestRank = 0;
    }
    function onPageHide() { if (on) send({ kind: 'bye' }); }

    var EV = root.LMEvents && typeof root.LMEvents.on === 'function' ? root.LMEvents : null;
    var LISTEN = [['spawn', onSpawn], ['death', onDeath], ['personalBest', onBest], ['kill', onKill], ['gameStats', onStats], ['chat', onChat], ['serverChange', onServerChange]];
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
        /* the page follows the menu theme (#lm=..., see lmThemeUrl in LMexpress.js) */
        var href = typeof root.lmThemeUrl === 'function' ? root.lmThemeUrl(plan.url) : plan.url;
        try { w = root.open(href, 'lmCompanion'); } catch (e) { w = null; }
        if (!w) { toast('warning', t('blocked', plan.url)); return null; }
        if (plan.mode === 'popup') {
            popup = w;
            try { popupOrigin = new URL(plan.url).origin; } catch (e) { popupOrigin = 'https://www.legendmod.ml'; }
            toast('info', t('popup', String(root.location && root.location.hostname || '?').slice(0, 60)));
        } else if (typeof root.BroadcastChannel !== 'function') {
            popup = w;
            popupOrigin = root.location.origin;
            toast('warning', t('noBc'));
        }
        setTimeout(function () { if (on) tick(true); }, 1500);
        return plan;
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
            [['open', open]].forEach(function (b) {
                var el = D.createElement('button');
                el.type = 'button';
                el.className = 'btn btn-xs btn-primary lm-companion-' + b[0];
                el.style.cssText = 'min-height:26px;';
                i18nText(el, b[0]);
                el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); b[1](); });
                row.appendChild(el);
            });
            privacyControls(row);
            /* exactly what leaves the game, and what Stream mode takes out (buildState) */
            var note = D.createElement('div');
            note.className = 'lm-companion-note';
            note.setAttribute('data-i18n', 'pkg.i.companionShares');
            note.textContent = typeof root.lmT === 'function' ? root.lmT('pkg.i.companionShares') : '';
            note.style.cssText = 'flex-basis:100%;font-size:11px;opacity:.8;line-height:1.35;';
            row.appendChild(note);
        }
        if (row.previousSibling !== label) label.parentNode.insertBefore(row, label.nextSibling);
        return true;
    }

    /* the privacy switches next to the button */
    function privacyControls(row) {
        var wrap = D.createElement('span');
        wrap.className = 'lm-companion-priv';
        wrap.title = t('privTip');
        wrap.setAttribute('data-i18n-title', P + 'privTip');
        wrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;';
        var lab = D.createElement('label');
        lab.style.cssText = 'display:flex;align-items:center;gap:4px;margin:0;font-weight:400;cursor:pointer;';
        var cb = D.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'lm-companion-hideteam';
        cb.checked = privacy.hideTeam;
        cb.addEventListener('change', function () { setPrivacy({ hideTeam: cb.checked }); });
        lab.appendChild(cb);
        lab.appendChild(i18nText(D.createElement('span'), 'hideTeam'));
        wrap.appendChild(lab);
        var lab2 = D.createElement('label');
        lab2.style.cssText = 'display:flex;align-items:center;gap:4px;margin:0;font-weight:400;';
        lab2.appendChild(i18nText(D.createElement('span'), 'mapLabel'));
        var sel = D.createElement('select');
        sel.id = 'lm-companion-map';
        sel.style.cssText = 'min-height:24px;';
        [['live', 'mapLive'], ['delay', 'mapDelay'], ['hide', 'mapHide']].forEach(function (m) {
            var o = D.createElement('option');
            o.value = m[0];
            i18nText(o, m[1]);
            sel.appendChild(o);
        });
        sel.value = privacy.map;
        sel.addEventListener('change', function () { setPrivacy({ map: sel.value }); });
        lab2.appendChild(sel);
        wrap.appendChild(lab2);
        row.appendChild(wrap);
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
    api.isOn = function () { return on; };
    api.privacy = function () { return { hideTeam: privacy.hideTeam, map: privacy.map }; };
    api.setPrivacy = function (ch) { if (ch && typeof ch === 'object') setPrivacy(ch); return api.privacy(); };
    /* for the smoke test: one state now, built like the published ones */
    api.publishNow = function () { if (on) tick(true); return on; };
})(typeof window !== 'undefined' ? window : this);
