/*
 * Spectator director (Legend Mod): tools for watching a game while spectating.
 *
 *   Automatic camera     follows the most interesting thing in view, picked by a fixed score: big
 *                        cells close to each other (likely a fight), sudden mass changes, recent
 *                        splits, leaderboard #1, watched players. It stays on a choice for a minimum
 *                        time and only switches to something clearly better, so it does not jitter.
 *                        Moving the mouse over the game or touching it hands the camera back for a
 *                        few seconds (manual override).
 *   Watchlist            players by nick, as the server sends it: from the leaderboard, typed, or by
 *                        tapping a cell. Cycle with hotkeys; shows who is in view / on the leaderboard.
 *   Bookmarks            map positions (+ zoom), recalled from the panel or with hotkeys.
 *   Cinematic camera     transition time, easing and follow smoothing for every camera move the
 *                        director makes.
 *   Broadcast HUD        clean overlay for viewers: followed player, mass, rank and a small ticker of
 *                        leaderboard changes ("X passed Y"). While it is on it can hide the Legend Mod
 *                        buttons the player ticked (nothing else).
 *   Leaderboard history  leaderboard positions over time while spectating (capped), chart + ticker.
 *
 * It only reads what the spectating client receives anyway (visible cells, the leaderboard and its
 * ghost cells). The camera is moved the way the player moves it: in free spectate through the cursor
 * position the client already sends (ogario.v4.js sendCursor calls camPoint), in Expanding Land World
 * Spectate through the client-side pan (setView calls camPoint). Nothing runs until the panel is
 * opened or a director hotkey is used, and the camera, the broadcast HUD and the recording only work
 * while spectating, never while playing. The HUD helpers camera lock and the existing free spectate
 * follows (leaderboard / clicked player) win over the director.
 *
 * Hotkeys (no default keys): open the panel, auto camera, broadcast HUD, watchlist next / previous /
 * add the player under the mouse, save a bookmark, go to bookmarks 1-5.
 */
(function () {
    'use strict';
    if (window._lmDirectorLoaded) return;
    window._lmDirectorLoaded = true;
    var W = window;

    /* ═══ Pure parts (developers/tests/director.js) ═══ */

    var MAX_BOOKMARKS = 20, MAX_WATCH = 20, MAX_HISTORY = 600, MAX_TICKER = 50, LB_DEPTH = 10;
    var COORD_MAX = 1e6, NICK_MAX = 60, NAME_MAX = 24;
    var MIN_GROUP_MASS = 50;     /* smaller groups are never candidates (food-sized players) */
    var FIGHT_MIN_MASS = 200;    /* both sides of a "fight" need at least this mass */
    var ACT_HALF_MS = 2000;      /* half-life of the mass-change activity */
    var SPLIT_MS = 3000;         /* how long a split counts */
    var PAIR_LIMIT = 40;         /* only the 40 biggest groups are paired (fights) */

    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function fin(v) { return typeof v === 'number' && isFinite(v); }
    function cmpStr(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

    var EASE = {
        linear: function (t) { return t; },
        smooth: function (t) { return t * t * (3 - 2 * t); },
        cubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
        sine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
        expo: function (t) { return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2; }
    };
    var EASINGS = ['linear', 'smooth', 'cubic', 'sine', 'expo'];
    /* 0 at t <= 0, 1 at t >= 1, monotonic in between; unknown names ease like 'smooth' */
    function ease(name, t) {
        if (!(t > 0)) return 0;
        if (t >= 1) return 1;
        return (own(EASE, name) ? EASE[name] : EASE.smooth)(t);
    }

    function isPlayerCell(c) {
        return !!(c && !c.removed && !c.isFood && !c.isVirus && !c.isEjected && c.size > 0 && fin(c.x) && fin(c.y));
    }
    function groupKey(nick, color) { return nick + '\u0001' + (color == null ? '' : String(color)); }

    /*
     * Visible player cells grouped per player (nick + colour, like the clicked-player follow).
     * Each group: key, nick, color, mass, count, x/y (mass-weighted centre), r (from the centre to the
     * farthest cell edge). Sorted by mass, then key: the same cells always give the same order.
     */
    function groupCells(cells, minMass) {
        var map = Object.create(null), list = [], i, c, g;
        if (minMass == null) minMass = MIN_GROUP_MASS;
        cells = cells || [];
        for (i = 0; i < cells.length; i++) {
            c = cells[i];
            if (!isPlayerCell(c)) continue;
            var nick = typeof c.nick === 'string' ? c.nick : '';
            var key = groupKey(nick, c.color);
            g = map[key];
            if (!g) {
                g = map[key] = { key: key, nick: nick, color: c.color, mass: 0, count: 0, x: 0, y: 0, r: 0, _w: 0, _c: [] };
                list.push(g);
            }
            var w = c.size * c.size;
            g._w += w; g.x += c.x * w; g.y += c.y * w; g.count++;
            g._c.push(c);
        }
        var out = [];
        for (i = 0; i < list.length; i++) {
            g = list[i];
            g.x /= g._w; g.y /= g._w; g.mass = g._w / 100;
            for (var j = 0; j < g._c.length; j++) {
                c = g._c[j];
                var d = Math.sqrt((c.x - g.x) * (c.x - g.x) + (c.y - g.y) * (c.y - g.y)) + c.size;
                if (d > g.r) g.r = d;
            }
            delete g._w; delete g._c;
            if (g.mass >= minMass) out.push(g);
        }
        out.sort(function (a, b) { return b.mass - a.mass || cmpStr(a.key, b.key); });
        return out;
    }

    /*
     * Per-player history between scoring ticks: mass, cell count, "activity" (relative mass change,
     * halving every ACT_HALF_MS) and the time of the last split (cell count went up). A player that
     * comes back into view does not count as a mass change. Players unseen for 10 s are dropped.
     */
    function updateTracks(tracks, groups, now) {
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i], t = tracks[g.key];
            if (!t) {
                tracks[g.key] = { mass: g.mass, count: g.count, act: 0, splitAt: -1e15, seen: now, t: now };
                continue;
            }
            var dt = now - t.t;
            if (dt > 0) {
                var rel = now - t.seen > 1000 ? 0 : Math.abs(g.mass - t.mass) / Math.max(t.mass, g.mass, 100);
                t.act = t.act * Math.pow(0.5, dt / ACT_HALF_MS) + rel;
                if (g.count > t.count && g.count >= 2 && now - t.seen <= 1000) t.splitAt = now;
                t.t = now;
            }
            t.mass = g.mass; t.count = g.count; t.seen = now;
        }
        for (var k in tracks) if (now - tracks[k].seen > 10000) delete tracks[k];
        return tracks;
    }

    /*
     * Score of each group (higher = more worth watching). ctx: { now, lbTop: nick of #1,
     * watch: { nick: true } }. Parts, all scaled by base = sqrt(mass):
     *   size     0.5 * base
     *   fight    nearest big neighbour: closeness (1 touching .. 0 far) * sqrt(smaller mass) *
     *            (0.5 + smaller/bigger) * 1.5; partner = that neighbour's key
     *   change   min(activity, 1) * 1.2 * base
     *   split    0.8 * base, fading over SPLIT_MS
     *   top      leaderboard #1: 0.4 * base + 10
     *   watch    on the watchlist: 0.3 * base + 5
     * Sorted by score, then key (deterministic).
     */
    function scoreGroups(groups, tracks, ctx) {
        ctx = ctx || {};
        tracks = tracks || {};
        var now = ctx.now || 0, watch = ctx.watch || {}, lbTop = ctx.lbTop || '';
        var n = Math.min(groups.length, PAIR_LIMIT), out = [], i, j;
        for (i = 0; i < groups.length; i++) {
            var g = groups[i], base = Math.sqrt(g.mass);
            out.push({ key: g.key, nick: g.nick, color: g.color, mass: g.mass, x: g.x, y: g.y, base: base,
                fight: 0, partner: null, change: 0, split: 0, top: 0, watch: 0, score: 0 });
        }
        for (i = 0; i < n; i++) {
            var a = groups[i];
            if (a.mass < FIGHT_MIN_MASS) continue;
            for (j = i + 1; j < n; j++) {
                var b = groups[j];
                if (b.mass < FIGHT_MIN_MASS) continue;
                var dx = a.x - b.x, dy = a.y - b.y;
                var gap = Math.sqrt(dx * dx + dy * dy) - (a.r + b.r);
                var reach = 0.75 * (a.r + b.r) + 200;
                var p = gap <= 0 ? 1 : gap >= reach ? 0 : 1 - gap / reach;
                if (p <= 0) continue;
                var lo = Math.min(a.mass, b.mass), hi = Math.max(a.mass, b.mass);
                var f = p * Math.sqrt(lo) * (0.5 + lo / hi) * 1.5;
                if (f > out[i].fight) { out[i].fight = f; out[i].partner = b.key; }
                if (f > out[j].fight) { out[j].fight = f; out[j].partner = a.key; }
            }
        }
        for (i = 0; i < out.length; i++) {
            var s = out[i], tr = tracks[s.key];
            if (tr) {
                s.change = Math.min(tr.act, 1) * 1.2 * s.base;
                var age = now - tr.splitAt;
                if (age >= 0 && age < SPLIT_MS) s.split = 0.8 * s.base * (1 - age / SPLIT_MS);
            }
            if (lbTop && s.nick === lbTop) s.top = 0.4 * s.base + 10;
            if (s.nick && watch[s.nick] === true) s.watch = 0.3 * s.base + 5;
            s.score = 0.5 * s.base + s.fight + s.change + s.split + s.top + s.watch;
        }
        out.sort(function (x, y) { return y.score - x.score || cmpStr(x.key, y.key); });
        return out;
    }

    /*
     * Dwell + hysteresis. sel = { key, partner, since, lostAt, changed }. The current choice stays for
     * at least o.dwellMs; after that only a candidate scoring above cur * (1 + o.hyst) + o.minGap
     * replaces it. A choice that left the view is kept for o.graceMs (camera holds still), then the best
     * candidate takes over at once.
     */
    function pickFocus(sel, ranked, now, o) {
        o = o || {};
        var dwell = o.dwellMs >= 0 ? o.dwellMs : 6000, hyst = o.hyst >= 0 ? o.hyst : 0.25;
        var minGap = o.minGap >= 0 ? o.minGap : 3, grace = o.graceMs >= 0 ? o.graceMs : 1500;
        var best = ranked && ranked.length ? ranked[0] : null, cur = null, i;
        function set(b) {
            var k = b ? b.key : null;
            sel.changed = k !== sel.key;
            sel.key = k;
            sel.partner = b ? b.partner : null;
            sel.since = now;
            sel.lostAt = null;
            return sel;
        }
        if (sel.key != null && ranked) for (i = 0; i < ranked.length; i++) if (ranked[i].key === sel.key) { cur = ranked[i]; break; }
        if (sel.key == null) return set(best);
        if (!cur) {
            if (sel.lostAt == null) sel.lostAt = now;
            if (now - sel.lostAt >= grace) return set(best);
            sel.changed = false;
            return sel;
        }
        sel.lostAt = null;
        sel.partner = cur.partner;
        if (best && best.key !== cur.key && now - sel.since >= dwell && best.score > cur.score * (1 + hyst) + minGap) return set(best);
        sel.changed = false;
        return sel;
    }

    /* exponential follow: tauMs 0 = no smoothing; frame-rate independent */
    function followStep(cur, target, dtMs, tauMs) {
        if (!(tauMs > 0) || !(dtMs > 0)) { cur.x = target.x; cur.y = target.y; return cur; }
        var k = 1 - Math.exp(-Math.min(dtMs, 250) / tauMs);
        cur.x += (target.x - cur.x) * k;
        cur.y += (target.y - cur.y) * k;
        return cur;
    }
    /* point on the way from tr.fx/fy to target (which may move); returns true once arrived */
    function transitionPoint(tr, target, now, easing, out) {
        var t = tr.dur > 0 ? (now - tr.start) / tr.dur : 1;
        var e = ease(easing, t);
        out.x = tr.fx + (target.x - tr.fx) * e;
        out.y = tr.fy + (target.y - tr.fy) * e;
        return t >= 1;
    }

    function cleanText(s, max) {
        if (typeof s !== 'string') return '';
        return s.replace(/[\u0000-\u001f\u007f-\u009f\u2066-\u2069\u202a-\u202e\u2028\u2029]/g, '').slice(0, max);
    }
    /* { name, x, y, zoom } with numbers only (no strings), coordinates within COORD_MAX, zoom 0 (keep
     * the zoom) or 0.01..40 like the zoom bookmarks; null when invalid */
    function validBookmark(b) {
        if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
        if (!fin(b.x) || !fin(b.y) || Math.abs(b.x) > COORD_MAX || Math.abs(b.y) > COORD_MAX) return null;
        var z = b.zoom == null ? 0 : b.zoom;
        if (!fin(z) || (z !== 0 && (z < 0.01 || z > 40))) return null;
        return { name: cleanText(b.name, NAME_MAX).trim(), x: Math.round(b.x), y: Math.round(b.y), zoom: z ? Math.round(z * 1000) / 1000 : 0 };
    }
    function parseJSON(raw) {
        if (typeof raw !== 'string' || !raw) return null;
        try { return JSON.parse(raw); } catch (e) { return null; }
    }
    function parseBookmarks(raw) {
        var v = typeof raw === 'string' ? parseJSON(raw) : raw, out = [];
        if (!Array.isArray(v)) return out;
        for (var i = 0; i < v.length && out.length < MAX_BOOKMARKS; i++) {
            var b = validBookmark(v[i]);
            if (b) out.push(b);
        }
        return out;
    }
    /* nicks are kept as received (spaces too); only control characters go, empty ones are refused */
    function validNick(n) {
        var s = cleanText(n, NICK_MAX);
        return s.trim() ? s : '';
    }
    function parseWatch(raw) {
        var v = typeof raw === 'string' ? parseJSON(raw) : raw, out = [], seen = Object.create(null);
        if (!Array.isArray(v)) return out;
        for (var i = 0; i < v.length && out.length < MAX_WATCH; i++) {
            var n = validNick(v[i]);
            if (n && !seen[n]) { seen[n] = 1; out.push(n); }
        }
        return out;
    }

    var HIDE_KEYS = ['hudButtons', 'bell', 'quickBar', 'follow', 'netGraph'];
    var NUM_CFG = {
        transitionMs: [1200, 0, 5000],
        followMs: [250, 0, 1500],
        dwellSec: [6, 2, 60],
        hystPct: [25, 0, 200],
        overrideSec: [8, 2, 60]
    };
    var BOOL_CFG = { bcName: true, bcMass: true, bcRank: true, bcTicker: true };
    function parseConfig(raw) {
        var v = typeof raw === 'string' ? parseJSON(raw) : raw, c = {}, k;
        if (!v || typeof v !== 'object' || Array.isArray(v)) v = {};
        for (k in NUM_CFG) c[k] = fin(v[k]) ? clamp(Math.round(v[k]), NUM_CFG[k][1], NUM_CFG[k][2]) : NUM_CFG[k][0];
        c.easing = typeof v.easing === 'string' && EASINGS.indexOf(v.easing) >= 0 ? v.easing : 'smooth';
        for (k in BOOL_CFG) c[k] = typeof v[k] === 'boolean' ? v[k] : BOOL_CFG[k];
        c.hide = {};
        var h = v.hide && typeof v.hide === 'object' ? v.hide : {};
        for (var i = 0; i < HIDE_KEYS.length; i++) c.hide[HIDE_KEYS[i]] = h[HIDE_KEYS[i]] === true;
        return c;
    }

    /* top LB_DEPTH nicks of a leaderboard ({ nick } entries or strings) */
    function lbSnapshot(entries, depth) {
        var out = [];
        depth = depth || LB_DEPTH;
        entries = entries || [];
        for (var i = 0; i < entries.length && out.length < depth; i++) {
            var e = entries[i], n = typeof e === 'string' ? e : (e && typeof e.nick === 'string' ? e.nick : '');
            out.push(cleanText(n, NICK_MAX));
        }
        return out;
    }
    /* nick -> index; empty and repeated nicks are left out (which one moved is unknown) */
    function rankMap(list) {
        var m = Object.create(null), dup = Object.create(null);
        for (var i = 0; i < list.length; i++) {
            var n = list[i];
            if (!n || !n.trim()) continue;
            if (m[n] !== undefined) dup[n] = 1; else m[n] = i;
        }
        for (var d in dup) delete m[d];
        return m;
    }
    /* "X passed Y" events between two snapshots: X moved up and Y, ahead of X before, is behind X now.
     * Sorted by X's new rank, then Y's; at most max (5). */
    function diffLeaderboard(prev, next, max) {
        var a = rankMap(prev || []), b = rankMap(next || []), ev = [];
        for (var n in b) {
            if (a[n] === undefined || b[n] >= a[n]) continue;
            for (var m in a) {
                if (m === n || b[m] === undefined) continue;
                if (a[m] < a[n] && b[m] > b[n]) ev.push({ nick: n, passed: m, rank: b[n] + 1, passedRank: b[m] + 1 });
            }
        }
        ev.sort(function (x, y) { return x.rank - y.rank || x.passedRank - y.passedRank || cmpStr(x.nick, y.nick) || cmpStr(x.passed, y.passed); });
        return ev.slice(0, max || 5);
    }
    function sameList(a, b) {
        if (!a || !b || a.length !== b.length) return false;
        for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    }
    /* adds { t, r } when the order changed; keeps the newest cap entries. Returns true when added. */
    function pushHistory(hist, snap, now, cap) {
        cap = cap || MAX_HISTORY;
        var last = hist.length ? hist[hist.length - 1] : null;
        if (last && sameList(last.r, snap)) return false;
        hist.push({ t: now, r: snap.slice() });
        if (hist.length > cap) hist.splice(0, hist.length - cap);
        return true;
    }
    /* rank (1-based, 0 = not listed) of nick over time: [[t, rank], ...] */
    function rankSeries(hist, nick, since) {
        var out = [];
        for (var i = 0; i < hist.length; i++) {
            if (since && hist[i].t < since && i + 1 < hist.length && hist[i + 1].t <= since) continue;
            var r = hist[i].r.indexOf(nick);
            out.push([hist[i].t, r + 1]);
        }
        return out;
    }

    function overlapArea(a, b) {
        var w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        return w > 0 && h > 0 ? w * h : 0;
    }
    /* first candidate spot (x, y) of a w x h box that covers none of the avoid rectangles, else the one
     * covering the least; spots off screen are skipped */
    function pickSpot(view, w, h, cands, avoid, margin) {
        margin = margin == null ? 4 : margin;
        var best = null;
        for (var i = 0; i < cands.length; i++) {
            var c = cands[i], r = { left: c.x, top: c.y, right: c.x + w, bottom: c.y + h };
            if (r.left < 0 || r.top < 0 || r.right > view.w + 0.5 || r.bottom > view.h + 0.5) continue;
            var m = { left: r.left - margin, top: r.top - margin, right: r.right + margin, bottom: r.bottom + margin }, ov = 0;
            for (var j = 0; j < avoid.length; j++) ov += overlapArea(m, avoid[j]);
            if (!ov) return { x: c.x, y: c.y, overlap: 0 };
            if (!best || ov < best.overlap) best = { x: c.x, y: c.y, overlap: ov };
        }
        return best || { x: Math.max(0, Math.round((view.w - w) / 2)), y: 0, overlap: -1 };
    }

    var pure = {
        ease: ease, EASINGS: EASINGS, isPlayerCell: isPlayerCell, groupKey: groupKey, groupCells: groupCells,
        updateTracks: updateTracks, scoreGroups: scoreGroups, pickFocus: pickFocus, followStep: followStep,
        transitionPoint: transitionPoint, validBookmark: validBookmark, parseBookmarks: parseBookmarks,
        validNick: validNick, parseWatch: parseWatch, parseConfig: parseConfig, lbSnapshot: lbSnapshot,
        diffLeaderboard: diffLeaderboard, pushHistory: pushHistory, rankSeries: rankSeries, pickSpot: pickSpot,
        LIMITS: { MAX_BOOKMARKS: MAX_BOOKMARKS, MAX_WATCH: MAX_WATCH, MAX_HISTORY: MAX_HISTORY, COORD_MAX: COORD_MAX }
    };

    var api = W.LMDirector = { _pure: pure, enabled: false, camPoint: function () { return null; } };

    var D = W.document;
    if (!D || typeof D.addEventListener !== 'function' || typeof D.createElement !== 'function') return;

    /* ═══ Text ═══ */

    /* texts: the language packs (developers/i18n/src, keys modules.director.*); {0} {1} are filled
     * with a and b */
    var P = 'modules.director.';
    function t(k, a, b) {
        var v = a === undefined ? null : b === undefined ? [a] : [a, b];
        return typeof W.lmT === 'function' ? W.lmT(P + k, v) : k;
    }

    /* 'rtl' for Arabic */
    function textDir() { return W.LMi18n && typeof W.LMi18n.dir === 'function' ? W.LMi18n.dir() : 'ltr'; }
    function toast(msg) {
        /* plain text in, escaped for toastr's HTML */
        try {
            if (W.toastr) W.toastr.info(String(msg).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'), '', { timeOut: 1800 });
        } catch (e) { }
    }
    function shortMass(m) {
        m = Math.round(m || 0);
        if (m >= 1e6) return (m / 1e6).toFixed(1) + 'M';
        if (m >= 1e4) return (m / 1e3).toFixed(1) + 'k';
        return String(m);
    }
    function nickText(n) { return n && n.trim() ? n : t('noName'); }

    /* ═══ Stored data ═══ */

    var KEY_CFG = 'lm-director', KEY_MARKS = 'lm-director-bookmarks', KEY_WATCH = 'lm-director-watch';
    function read(k) { try { return W.localStorage.getItem(k); } catch (e) { return null; } }
    function write(k, v) { try { W.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
    var cfg = parseConfig(read(KEY_CFG));
    var marks = parseBookmarks(read(KEY_MARKS));
    var watch = parseWatch(read(KEY_WATCH));
    function saveCfg() { write(KEY_CFG, cfg); }
    function saveMarks() { write(KEY_MARKS, marks); }
    function saveWatch() { write(KEY_WATCH, watch); }

    /* ═══ Game state ═══ */

    function LMo() { return W.legendmod || null; }
    function spectating(LM) {
        return !!(LM && !LM.play && !(LM.playerCellsMulti && LM.playerCellsMulti.length));
    }
    function worldSpec(LM) { return !!(LM && LM._isWorldSpectating && LM.isLegendWorld); }
    /* really watching a game (not only out of it, e.g. in the menu after a death) */
    function watching(LM) { return spectating(LM) && !!(LM.isSpectateEnabled || LM.isFreeSpectate || worldSpec(LM)); }
    /* 'cam' = the director can steer; otherwise why not */
    function camMode(LM) {
        if (!spectating(LM)) return 'playing';
        if (!(LM.isFreeSpectate || worldSpec(LM))) return LM.isSpectateEnabled ? 'fixed' : 'nospec';
        if (W.LMHudHelpers && W.LMHudHelpers.camLocked) return 'locked';
        if (LM._lmSpecLb != null || LM._lmSpecCell) return 'follow';
        return 'cam';
    }
    function camera(LM) {
        var R = W.drawRender;
        if (R && fin(R.camX) && fin(R.camY)) return { x: R.camX, y: R.camY };
        if (LM && fin(LM.viewX) && fin(LM.viewY)) return { x: LM.viewX, y: LM.viewY };
        return null;
    }
    function lbNick(LM, i) {
        var e = LM && LM.leaderboard && LM.leaderboard[i];
        return e && typeof e.nick === 'string' ? e.nick : '';
    }
    function lbRank(LM, nick) {
        if (!nick || !LM || !LM.leaderboard) return 0;
        for (var i = 0; i < LM.leaderboard.length; i++) if (lbNick(LM, i) === nick) return i + 1;
        return 0;
    }
    function ghostOf(LM, nick) {
        var r = lbRank(LM, nick), g = r && LM.ghostCells ? LM.ghostCells[r - 1] : null;
        return g && fin(g.x) && fin(g.y) ? g : null;
    }
    /* centre and mass of one group (nick + colour) or, with color === undefined, of the biggest group
     * with that nick (prefer: the colour followed last). Fresh every frame: no stale positions. */
    var _pos = { x: 0, y: 0, mass: 0, color: null };
    function playerPos(LM, nick, color, preferColor) {
        var cs = LM.cells || [], best = null, map = null, i, c;
        if (color !== undefined) {
            var ws = 0, wx = 0, wy = 0;
            for (i = 0; i < cs.length; i++) {
                c = cs[i];
                if (!isPlayerCell(c) || (c.nick || '') !== nick || c.color !== color) continue;
                var w = c.size * c.size; ws += w; wx += c.x * w; wy += c.y * w;
            }
            if (!ws) return null;
            _pos.x = wx / ws; _pos.y = wy / ws; _pos.mass = ws / 100; _pos.color = color;
            return _pos;
        }
        map = Object.create(null);
        for (i = 0; i < cs.length; i++) {
            c = cs[i];
            if (!isPlayerCell(c) || (c.nick || '') !== nick) continue;
            var k = String(c.color), g = map[k];
            if (!g) g = map[k] = { w: 0, x: 0, y: 0, color: c.color };
            var w2 = c.size * c.size; g.w += w2; g.x += c.x * w2; g.y += c.y * w2;
        }
        for (var key in map) {
            var m = map[key];
            if (!best || (m.color === preferColor && best.color !== preferColor) ||
                ((m.color === preferColor) === (best.color === preferColor) && (m.w > best.w || (m.w === best.w && key < String(best.color))))) best = m;
        }
        if (!best) return null;
        _pos.x = best.x / best.w; _pos.y = best.y / best.w; _pos.mass = best.w / 100; _pos.color = best.color;
        return _pos;
    }

    /* ═══ Director state ═══ */

    var st = {
        enabled: false, auto: false, broadcast: false,
        sel: { key: null, partner: null, since: 0, lostAt: null, changed: false },
        ranked: [], tracks: {}, lastScore: 0,
        manual: null,          /* { type: 'player', nick, color } | { type: 'point', x, y, zoom, name } */
        manualUntil: 0,        /* auto camera: the manual choice holds until then */
        releasedUntil: 0,      /* manual override: the director leaves the camera alone until then */
        lastId: '', tr: null, out: { x: 0, y: 0 }, follow: { x: 0, y: 0 }, has: false, lastT: 0, lastHeld: 0,
        hold: null, holdAt: 0, zoomTr: null,
        hist: [], ticker: [], lastSnap: null,
        watchIdx: -1, picking: false, raf: 0
    };

    function now() { return (W.performance && W.performance.now) ? W.performance.now() : Date.now(); }

    function scoreTick(LM, tm) {
        var groups = groupCells(LM.cells);
        updateTracks(st.tracks, groups, tm);
        var wl = {};
        for (var i = 0; i < watch.length; i++) wl[watch[i]] = true;
        st.ranked = scoreGroups(groups, st.tracks, { now: tm, lbTop: lbNick(LM, 0), watch: wl });
        if (st.auto) pickFocus(st.sel, st.ranked, tm, { dwellMs: cfg.dwellSec * 1000, hyst: cfg.hystPct / 100, minGap: 3, graceMs: 1500 });
    }

    /* what the camera should look at right now: { id, x, y } or null (camera left alone) */
    var _tgt = { id: '', x: 0, y: 0 };
    function target(LM, tm) {
        var m = st.manual, p;
        if (m && st.auto && tm >= st.manualUntil) m = st.manual = null;
        if (m) {
            if (m.type === 'point') { _tgt.id = 'b:' + m.x + ',' + m.y; _tgt.x = m.x; _tgt.y = m.y; return _tgt; }
            p = playerPos(LM, m.nick, undefined, m.color);
            _tgt.id = 'w:' + m.nick;
            if (p) { m.color = p.color; return hold(p.x, p.y, tm); }
            var g = ghostOf(LM, m.nick);
            if (g) return hold(g.x, g.y, tm);
            return held(tm);
        }
        if (!st.auto) return null;
        if (!st.sel.key) {
            /* nothing worth watching in view: the leaderboard #1 (its ghost cell, when the server sends them) */
            var top = lbNick(LM, 0), gt = top ? ghostOf(LM, top) : null;
            if (!gt) return null;
            _tgt.id = 'g:' + top;
            return hold(gt.x, gt.y, tm);
        }
        var sk = st.sel.key, cut = sk.indexOf('\u0001');
        var nick = sk.slice(0, cut), col = sk.slice(cut + 1), cur = null;
        /* the colour comes back as a string in the key: find the group by its key */
        for (var i = 0; i < st.ranked.length; i++) if (st.ranked[i].key === sk) { cur = st.ranked[i]; break; }
        _tgt.id = 'a:' + sk;
        if (!cur && !col) return held(tm);
        p = playerPos(LM, nick, cur ? cur.color : col);
        if (!p) return held(tm);
        var x = p.x, y = p.y;
        /* a fight: the middle of both players, so both stay on screen */
        if (st.sel.partner) {
            var pk = st.sel.partner, pc = pk.indexOf('\u0001'), pr = null;
            for (var j = 0; j < st.ranked.length; j++) if (st.ranked[j].key === pk) { pr = st.ranked[j]; break; }
            var q = pr ? playerPos(LM, pk.slice(0, pc), pr.color) : null;
            if (q) { x = (x + q.x) / 2; y = (y + q.y) / 2; }
        }
        return hold(x, y, tm);
    }
    function hold(x, y, tm) {
        if (!st.hold) st.hold = { x: 0, y: 0 };
        st.hold.x = x; st.hold.y = y; st.holdAt = tm;
        _tgt.x = x; _tgt.y = y;
        return _tgt;
    }
    /* out of view: keep looking at the last spot (the auto camera switches after its grace time) */
    function held(tm) {
        if (!st.hold || tm - st.holdAt > 4000) return null;
        _tgt.x = st.hold.x; _tgt.y = st.hold.y;
        return _tgt;
    }

    /*
     * Called by the game: sendCursor (free spectate, every cursor packet) and setView (World Spectate,
     * every frame). Returns the point to look at in the game's local coordinates, or null when the
     * director leaves the camera alone.
     */
    function camPoint(LM) {
        LM = LM || LMo();
        if (!st.enabled || !LM) return null;
        var tm = now(), mode = camMode(LM);
        if (mode !== 'cam') {
            if (mode === 'follow') release(tm); /* a follow picked by hand counts as manual control */
            st.has = false;
            return null;
        }
        if (tm < st.releasedUntil) { st.has = false; return null; }
        var tg = target(LM, tm);
        if (!tg) { st.has = false; st.lastId = ''; return null; }
        var dt = st.lastT ? tm - st.lastT : 16;
        if (tm === st.lastT && st.has) return st.out;
        st.lastT = tm;
        if (tg.id !== st.lastId || !st.has) {
            /* a new target: glide there from where the camera is now */
            var from = st.has ? st.out : camera(LM);
            if (!from) return null;
            st.tr = { fx: from.x, fy: from.y, start: tm, dur: cfg.transitionMs };
            st.follow.x = tg.x; st.follow.y = tg.y;
            st.lastId = tg.id;
        }
        followStep(st.follow, tg, dt, cfg.followMs);
        if (st.tr) {
            if (transitionPoint(st.tr, st.follow, tm, cfg.easing, st.out)) st.tr = null;
        } else {
            st.out.x = st.follow.x; st.out.y = st.follow.y;
        }
        st.has = true;
        st.lastHeld = tm;
        return st.out;
    }
    api.camPoint = camPoint;

    /* manual override: the camera is the player's for overrideSec seconds */
    function release(tm) {
        tm = tm || now();
        st.releasedUntil = tm + cfg.overrideSec * 1000;
        st.manual = null;
        st.has = false;
        st.lastId = '';
        st.tr = null;
        st.zoomTr = null;
    }

    function startZoom(z) {
        var LM = LMo();
        if (!LM || !(z > 0) || !(LM.zoomValue > 0)) return;
        st.zoomTr = { from: LM.zoomValue, to: z, start: now(), dur: Math.max(1, cfg.transitionMs) };
    }
    function zoomStep(LM, tm) {
        var z = st.zoomTr;
        if (!z) return;
        var k = ease(cfg.easing, (tm - z.start) / z.dur);
        LM.zoomValue = z.from + (z.to - z.from) * k;
        if (k >= 1) st.zoomTr = null;
    }

    /* a choice made by hand (watchlist, bookmark, candidate): the auto camera waits overrideSec */
    function setManual(m) {
        var tm = now();
        st.manual = m;
        st.manualUntil = tm + cfg.overrideSec * 1000;
        st.releasedUntil = 0;
        if (m && m.type === 'point' && m.zoom) startZoom(m.zoom);
        ensureEnabled();
        var LM = LMo(), mode = camMode(LM);
        if (mode !== 'cam' && mode !== 'follow') toast(statusText(LM));
        else if (mode === 'follow') {
            /* the director's choice replaces a running free spectate follow */
            if (LM._lmSpecLb != null) { LM._lmSpecLb = null; if (typeof LM._lmSpecLbHud === 'function') LM._lmSpecLbHud(); }
            if (LM._lmSpecCell && typeof LM._lmSpecCellStop === 'function') LM._lmSpecCellStop();
            st.releasedUntil = 0;
        }
        refresh();
    }

    /* ═══ Manual override from the mouse / touch ═══ */

    var moved = 0, movedAt = 0, lastPX = null, lastPY = null;
    function directorHasCamera() { return st.enabled && st.has && now() - st.lastHeld < 500; }
    function onPointerMove(e) {
        if (!st.enabled || st.picking) return;
        var tm = now();
        if (lastPX !== null && e.target && e.target.tagName === 'CANVAS' && directorHasCamera()) {
            if (tm - movedAt > 1000) moved = 0;
            moved += Math.abs(e.clientX - lastPX) + Math.abs(e.clientY - lastPY);
            movedAt = tm;
            if (moved > 80) { moved = 0; release(tm); refresh(); }
        }
        lastPX = e.clientX; lastPY = e.clientY;
    }
    function onPointerDown(e) {
        if (!st.enabled) return;
        if (st.picking) { pickAt(e); return; }
        if (e.target && e.target.tagName === 'CANVAS' && directorHasCamera()) { release(); refresh(); }
    }

    /* ═══ Watchlist ═══ */

    function addWatch(nick) {
        var n = validNick(nick);
        if (!n) return false;
        if (watch.indexOf(n) >= 0) return true;
        if (watch.length >= MAX_WATCH) { toast(t('watchFull')); return false; }
        watch.push(n);
        saveWatch();
        refresh();
        return true;
    }
    function removeWatch(nick) {
        var i = watch.indexOf(nick);
        if (i < 0) return false;
        watch.splice(i, 1);
        if (st.watchIdx >= watch.length) st.watchIdx = watch.length - 1;
        saveWatch();
        refresh();
        return true;
    }
    function watchPlayer(nick) {
        if (!nick) return;
        setManual({ type: 'player', nick: nick, color: undefined });
    }
    function cycleWatch(dir) {
        ensureEnabled();
        if (!watch.length) { toast(t('watchEmpty')); return; }
        st.watchIdx = ((st.watchIdx < 0 ? (dir > 0 ? -1 : 0) : st.watchIdx) + (dir > 0 ? 1 : -1) + watch.length) % watch.length;
        watchPlayer(watch[st.watchIdx]);
        toast(t('stFollowing', nickText(watch[st.watchIdx])));
    }
    /* biggest named player cell under the point (local game coordinates) */
    function cellAt(LM, x, y) {
        var cs = (LM && LM.cells) || [], best = null;
        for (var i = 0; i < cs.length; i++) {
            var c = cs[i];
            if (!isPlayerCell(c)) continue;
            var dx = x - c.x, dy = y - c.y;
            if (dx * dx + dy * dy <= c.size * c.size && (!best || c.size > best.size)) best = c;
        }
        return best;
    }
    function addCellNick(c) {
        var n = c && validNick(c.nick || '');
        if (!n) { toast(t('noCell')); return false; }
        if (addWatch(n)) toast(t('watchAdded', n));
        return true;
    }
    function addUnderCursor() {
        ensureEnabled();
        var LM = LMo();
        if (!LM || !fin(LM.cursorX) || !fin(LM.cursorY)) return false;
        return addCellNick(cellAt(LM, LM.cursorX, LM.cursorY));
    }
    function setPicking(on) {
        st.picking = !!on;
        refresh();
    }
    function pickAt(e) {
        var tg = e.target;
        if (!tg || tg.tagName !== 'CANVAS') return; /* taps on the panel and the HUD work as usual */
        e.preventDefault();
        e.stopPropagation();
        st.picking = false;
        var LM = LMo(), cam = camera(LM), scale = LM && fin(LM.viewScale) && LM.viewScale > 0 ? LM.viewScale : 1;
        var cw = (LM && LM.canvasWidth) || W.innerWidth, ch = (LM && LM.canvasHeight) || W.innerHeight;
        if (cam) addCellNick(cellAt(LM, cam.x + (e.clientX - cw / 2) / scale, cam.y + (e.clientY - ch / 2) / scale));
        refresh();
    }

    /* ═══ Bookmarks ═══ */

    function addBookmark(b) {
        var v = validBookmark(b);
        if (!v) return -1;
        if (marks.length >= MAX_BOOKMARKS) { toast(t('markFull')); return -1; }
        marks.push(v);
        saveMarks();
        refresh();
        return marks.length - 1;
    }
    function saveView(name) {
        ensureEnabled();
        var LM = LMo(), cam = camera(LM);
        if (!cam) { toast(t('markNoView')); return -1; }
        var i = addBookmark({ name: typeof name === 'string' ? name : '', x: cam.x, y: cam.y, zoom: LM && LM.zoomValue > 0 ? Math.min(40, Math.max(0.01, LM.zoomValue)) : 0 });
        if (i >= 0) toast(t('markSaved', i + 1));
        return i;
    }
    function removeBookmark(i) {
        if (!(i >= 0 && i < marks.length)) return false;
        marks.splice(i, 1);
        saveMarks();
        refresh();
        return true;
    }
    function recallBookmark(i) {
        ensureEnabled();
        var b = marks[i];
        if (!b) { toast(t('markNone', i + 1)); return false; }
        setManual({ type: 'point', x: b.x, y: b.y, zoom: b.zoom, name: b.name || t('markN', i + 1) });
        return true;
    }

    /* ═══ Leaderboard history ═══ */

    function onLeaderboard(ev) {
        if (!st.enabled || !watching(LMo())) return;
        var snap = lbSnapshot(ev && ev.entries);
        if (!snap.length) return;
        var prev = st.lastSnap, tm = Date.now();
        st.lastSnap = snap;
        if (pushHistory(st.hist, snap, tm, MAX_HISTORY) && prev) {
            var evs = diffLeaderboard(prev, snap, 5);
            for (var i = 0; i < evs.length; i++) st.ticker.push({ t: tm, nick: evs[i].nick, passed: evs[i].passed, rank: evs[i].rank });
            if (st.ticker.length > MAX_TICKER) st.ticker.splice(0, st.ticker.length - MAX_TICKER);
        }
        if (ui.open && ui.tab === 'history') ui.dirty = true;
    }
    var lbHooked = false;
    function hookLb(on) {
        var E = W.LMEvents;
        if (!E || typeof E.on !== 'function' || on === lbHooked) return;
        lbHooked = on;
        if (on) E.on('leaderboard', onLeaderboard); else E.off('leaderboard', onLeaderboard);
    }

    /* ═══ Enable / loop ═══ */

    var listening = false;
    function ensureEnabled() {
        if (st.enabled) return;
        st.enabled = api.enabled = true;
        hookLb(true);
        if (!listening) {
            listening = true;
            W.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
            W.addEventListener('pointerdown', onPointerDown, true);
        }
        if (!st.raf) st.raf = raf(loop);
    }
    function disable() {
        st.enabled = api.enabled = false;
        st.auto = false; st.broadcast = false; st.picking = false;
        st.manual = null; st.has = false; st.lastId = ''; st.zoomTr = null; st.tr = null;
        st.sel = { key: null, partner: null, since: 0, lostAt: null, changed: false };
        hookLb(false);
        if (listening) {
            listening = false;
            W.removeEventListener('pointermove', onPointerMove, { passive: true, capture: true });
            W.removeEventListener('pointerdown', onPointerDown, true);
        }
        bcSync(false);
        refresh();
    }
    var lastBc = 0, lastUi = 0;
    function raf(f) { return W.requestAnimationFrame ? W.requestAnimationFrame(f) : setTimeout(f, 16); }
    function loop() {
        st.raf = 0;
        if (!st.enabled) return;
        st.raf = raf(loop);
        var LM = LMo(), tm = now();
        try {
            var spec = watching(LM);
            if (LM && spec) {
                if (tm - st.lastScore >= 200) { st.lastScore = tm; scoreTick(LM, tm); }
                if (st.zoomTr) zoomStep(LM, tm);
            } else {
                st.zoomTr = null;
                if (st.ranked.length) { st.ranked = []; st.sel.key = null; }
            }
            if (tm - lastBc >= 250) { lastBc = tm; bcSync(st.broadcast && spec); }
            if (ui.open && (tm - lastUi >= 500 || ui.dirty)) { lastUi = tm; ui.dirty = false; ui.update(); }
        } catch (e) {
            if (!loop._warned) { loop._warned = true; try { console.warn('[LM director]', e); } catch (e2) { } }
        }
    }

    function setAuto(on) {
        on = !!on;
        if (on) ensureEnabled();
        st.auto = on;
        st.sel = { key: null, partner: null, since: 0, lostAt: null, changed: false };
        if (on) { st.manual = null; st.releasedUntil = 0; }
        st.lastId = '';
        refresh();
        return st.auto;
    }
    function setBroadcast(on) {
        on = !!on;
        if (on) ensureEnabled();
        st.broadcast = on;
        lastBc = 0;
        bcSync(on && watching(LMo()));
        refresh();
        return st.broadcast;
    }

    /* like the Game Over "Watch killer": spectate first when needed, then free spectate */
    function freeSpectate(LM) {
        if (!LM || LM.play || LM.isFreeSpectate || typeof LM.sendFreeSpectate !== 'function') return;
        try {
            var ov = D.getElementById('overlays');
            if (ov && ov.offsetParent !== null && W.application && typeof W.application.onSpectate === 'function') W.application.onSpectate();
            /* World Spectate: Q from it goes to the follow camera, so leave it with Spectate first */
            if ((!LM.isSpectateEnabled || LM._isWorldSpectating) && typeof LM.sendSpectate === 'function') LM.sendSpectate();
            if (!LM.isFreeSpectate) LM.sendFreeSpectate();
        } catch (e) { }
    }
    function statusText(LM) {
        var mode = camMode(LM), tm = now();
        if (mode === 'playing') return t('stPlaying');
        if (mode === 'nospec') return t('stNoSpec');
        if (mode === 'fixed') return t('stFixed');
        if (mode === 'locked') return t('stLocked');
        if (mode === 'follow') return t('stFollow');
        if (tm < st.releasedUntil) return t('stPaused', Math.ceil((st.releasedUntil - tm) / 1000));
        if (st.manual) return st.manual.type === 'point' ? t('stPoint', st.manual.name) : t('stFollowing', nickText(st.manual.nick));
        if (st.auto) {
            var f = followed(LM);
            return f ? t('stFollowing', nickText(f)) : t('stSearching');
        }
        return t('stIdle');
    }
    /* nick of the player the viewers are looking at */
    function followed(LM) {
        if (st.manual && st.manual.type === 'player') return st.manual.nick;
        if (st.auto && st.sel.key && !st.manual && camMode(LM) === 'cam') return st.sel.key.slice(0, st.sel.key.indexOf('\u0001'));
        if (st.auto && !st.sel.key && !st.manual && camMode(LM) === 'cam' && ghostOf(LM, lbNick(LM, 0))) return lbNick(LM, 0);
        if (LM && LM._lmSpecCell) return LM._lmSpecCell.nick || '';
        if (LM && LM._lmSpecLb != null) return lbNick(LM, LM._lmSpecLb);
        return null;
    }

    /* ═══ UI ═══ */

    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function btn(text, act, cls) {
        var b = mk('button', cls || '', text);
        b.type = 'button';
        if (act) b.setAttribute('data-act', act);
        return b;
    }
    function mainColor() {
        var ds = W.defaultSettings;
        var c = ds && typeof ds.menuMainColor === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(ds.menuMainColor) ? ds.menuMainColor : '#01d9cc';
        /* the theme variable first, so a theme change shows at once */
        return 'var(--lm-mc,' + c + ')';
    }
    function visibleRect(sel) {
        var out = [], els = D.querySelectorAll(sel);
        for (var i = 0; i < els.length; i++) {
            var el = els[i], r = el.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) continue;
            var cs = W.getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
            out.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
        }
        return out;
    }

    var CSS = '' +
        '#lm-dir-panel{position:fixed;z-index:100000;width:460px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);display:flex;' +
        'flex-direction:column;box-sizing:border-box;background:var(--lm-w-bg,var(--lm-pc,#12141a));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.15));border-top:3px solid var(--lmd-mc,rgba(255,255,255,.15));overflow:hidden;' +
        'border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);font-size:var(--lm-w-fs,12px);line-height:1.35;font-family:inherit;text-align:start}' +
        '#lm-dir-panel .lmd-head{display:flex;align-items:center;gap:6px;padding:var(--lm-w-hpad,5px 6px 5px 10px);border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1));background:var(--lm-w-head,linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%))}' +
        '#lm-dir-panel .lmd-title{font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:var(--lm-w-title,13px);color:var(--lmd-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
        '#lm-dir-panel .lmd-tabs{display:flex;gap:2px;padding:4px 6px 0;flex-wrap:wrap;border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1))}' +
        '#lm-dir-panel .lmd-tabs button{border-radius:var(--lm-radius-s,4px) var(--lm-radius-s,4px) 0 0;border-bottom:0;min-height:var(--lm-w-ctl,28px)}' +
        '#lm-dir-panel .lmd-tabs button.lmd-on{background:var(--lmd-mc);color:var(--lm-pc,#111);border-color:var(--lmd-mc)}' +
        '#lm-dir-panel .lmd-body{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:var(--lm-w-pad,6px 10px 10px);flex:1;min-height:0}' +
        '#lm-dir-panel button,#lm-dir-panel select,#lm-dir-panel input[type=text]{background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc,#eee);' +
        'border:1px solid var(--lm-pc2,rgba(255,255,255,.2));border-radius:var(--lm-radius-s,4px);padding:3px 8px;min-height:var(--lm-w-ctl,28px);font:inherit;cursor:pointer;' +
        'touch-action:manipulation;box-sizing:border-box}' +
        '#lm-dir-panel input[type=text],#lm-dir-panel select{background:var(--lm-w-field,rgba(0,0,0,.25))}#lm-dir-panel input[type=text]{cursor:text;flex:1;min-width:80px}' +
        '#lm-dir-panel button:hover{background:var(--lm-w-btn-h,rgba(255,255,255,.12))}' +
        '#lm-dir-panel button.lmd-act{border-color:var(--lmd-mc);color:var(--lmd-mc)}' +
        '#lm-dir-panel button.lmd-act.lmd-on{background:var(--lmd-mc);color:var(--lm-pc,#111)}' +
        '#lm-dir-panel .lmd-close{min-width:var(--lm-w-x,32px);min-height:var(--lm-w-x,32px);font-size:18px;line-height:1;padding:2px 6px;color:var(--lm-tc2,#eee);border-color:transparent}' +
        '#lm-dir-panel .lmd-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:5px 0}' +
        '#lm-dir-panel .lmd-status{padding:5px 8px;margin:4px 0;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,.06);min-height:18px}' +
        '#lm-dir-panel .lmd-set{display:grid;grid-template-columns:1fr 130px 44px;gap:4px 8px;align-items:center;margin:6px 0}' +
        '#lm-dir-panel .lmd-set input[type=range]{width:100%;margin:0}' +
        '#lm-dir-panel .lmd-set span.lmd-val{text-align:right;opacity:.8}' +
        '#lm-dir-panel h6{margin:8px 0 3px;font-size:11px;font-weight:700;opacity:.75;text-transform:none}' +
        '#lm-dir-panel ul{list-style:none;margin:0;padding:0}' +
        '#lm-dir-panel li{display:flex;align-items:center;gap:6px;padding:3px 4px;border-top:1px solid rgba(255,255,255,.06)}' +
        '#lm-dir-panel li .lmd-n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
        '#lm-dir-panel li .lmd-m{color:var(--lm-tc2,rgba(238,238,238,.65));font-size:11px;white-space:nowrap}' +
        '#lm-dir-panel li button{min-height:26px;padding:2px 7px}' +
        '#lm-dir-panel li.lmd-cur{background:rgba(255,255,255,.08)}' +
        '#lm-dir-panel .lmd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;vertical-align:middle}' +
        '#lm-dir-panel label{display:inline-flex;align-items:center;gap:4px;margin:2px 12px 2px 0;font-weight:400;cursor:pointer}' +
        '#lm-dir-panel .lmd-note{color:var(--lm-tc2,rgba(238,238,238,.65));font-size:var(--lm-w-fs-s,11px);margin:4px 0}' +
        '#lm-dir-panel canvas{display:block;width:100%;height:110px;background:rgba(255,255,255,.04);border-radius:var(--lm-radius-s,4px)}' +
        '#lm-dir-panel .lmd-legend span{display:inline-block;margin:2px 10px 0 0;white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis;vertical-align:top}' +
        /* the broadcast line: HUD font weight and scale (Theme > HUD) */
        '#lm-dir-bc{position:fixed;z-index:14;pointer-events:none;color:var(--lm-hud-tc,#fff);font-weight:var(--lm-hud-fw,600);font-size:calc(14px * var(--lm-hud-scale,1));line-height:1.3;font-family:inherit;text-align:center;' +
        'text-shadow:0 1px 3px rgba(0,0,0,.9);background:var(--lm-hud-bg,rgba(0,0,0,.42));border-radius:var(--lm-radius,6px);padding:.3em .85em;max-width:min(calc(480px * var(--lm-hud-scale,1)),calc(100vw - 16px));box-sizing:border-box}' +
        '#lm-dir-bc .lmd-bc-main{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '#lm-dir-bc .lmd-bc-main b{color:var(--lm-hud-mc,var(--lmd-mc))}' +
        '#lm-dir-bc .lmd-bc-tick{font-size:.86em;font-weight:400;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        'body.lm-dir-hide-hudButtons #target-panel-hud,body.lm-dir-hide-bell #lm-notif-bell,' +
        'body.lm-dir-hide-quickBar #lm-cc-bar,body.lm-dir-hide-quickBar #lm-cc-bar-open,body.lm-dir-hide-follow #lm-spec-follow,' +
        'body.lm-dir-hide-netGraph #lm-net-graph{visibility:hidden!important;pointer-events:none!important}';
    function css() {
        /* the shared window look (LMexpress.js) */
        if (typeof W.lmUiKit === 'function') W.lmUiKit();
        if (D.getElementById('lm-dir-style')) return;
        var s = mk('style');
        s.id = 'lm-dir-style';
        s.textContent = CSS;
        (D.head || D.body).appendChild(s);
    }

    var ui = {
        root: null, open: false, tab: 'camera', dirty: false, sigs: {}, els: {},
        build: function () {
            if (this.root) return;
            css();
            var self = this, root = mk('div');
            root.id = 'lm-dir-panel';
            root.classList.add('lm-modal-container', 'lm-w');
            root._lmEsc = true;
            root.dir = textDir();
            root.setAttribute('role', 'dialog');
            root.setAttribute('aria-label', t('title'));
            var head = mk('div', 'lmd-head');
            head.appendChild(mk('div', 'lmd-title', '\ud83c\udfac ' + t('title')));
            var offB = btn(t('off'), 'off');
            offB.title = t('offTip');
            head.appendChild(offB);
            var x = btn('\u00d7', 'close', 'lmd-close');
            x.title = t('close');
            x.setAttribute('aria-label', t('close'));
            head.appendChild(x);
            root.appendChild(head);
            var tabs = mk('div', 'lmd-tabs');
            [['camera', 'tCamera'], ['watch', 'tWatch'], ['marks', 'tMarks'], ['broadcast', 'tBroadcast'], ['history', 'tHistory']].forEach(function (p) {
                var b = btn(t(p[1]), 'tab');
                b.setAttribute('data-tab', p[0]);
                tabs.appendChild(b);
            });
            root.appendChild(tabs);
            var body = mk('div', 'lmd-body');
            root.appendChild(body);
            this.els.body = body;
            this.els.tabs = tabs;
            this.buildCamera(body);
            this.buildWatch(body);
            this.buildMarks(body);
            this.buildBroadcast(body);
            this.buildHistory(body);
            root.addEventListener('click', function (e) { self.onClick(e); });
            root.addEventListener('input', function (e) { self.onInput(e); });
            root.addEventListener('change', function (e) { self.onInput(e); });
            root.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); self.close(); return; }
                if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type === 'text') {
                    e.preventDefault();
                    if (e.target === self.els.nick) self.addNick();
                    else if (e.target === self.els.markName) self.saveMark();
                }
            });
            /* taps on the panel never reach the game */
            ['mousedown', 'touchstart', 'wheel'].forEach(function (n) {
                root.addEventListener(n, function (e) { e.stopPropagation(); }, { passive: true });
            });
            root.style.setProperty('--lmd-mc', mainColor());
            D.body.appendChild(root);
            this.root = root;
        },
        section: function (body, id) {
            var s = mk('div', 'lmd-sec');
            s.setAttribute('data-sec', id);
            body.appendChild(s);
            return s;
        },
        slider: function (parent, key, label, min, max, step) {
            var wrap = mk('div', 'lmd-set');
            var l = mk('span', '', label);
            var r = mk('input');
            r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = cfg[key];
            r.setAttribute('data-cfg', key);
            r.setAttribute('aria-label', label);
            var v = mk('span', 'lmd-val', String(cfg[key]));
            wrap.appendChild(l); wrap.appendChild(r); wrap.appendChild(v);
            parent.appendChild(wrap);
            this.els['val-' + key] = v;
        },
        check: function (parent, key, label, hide) {
            var l = mk('label');
            var c = mk('input');
            c.type = 'checkbox';
            c.checked = hide ? cfg.hide[key] : cfg[key];
            c.setAttribute(hide ? 'data-hide' : 'data-cfg', key);
            l.appendChild(c);
            l.appendChild(D.createTextNode(label));
            parent.appendChild(l);
        },
        buildCamera: function (body) {
            var s = this.section(body, 'camera');
            this.els.status = mk('div', 'lmd-status');
            s.appendChild(this.els.status);
            var row = mk('div', 'lmd-row');
            this.els.autoBtn = btn('', 'auto', 'lmd-act');
            this.els.autoBtn.id = 'lm-dir-auto';
            row.appendChild(this.els.autoBtn);
            row.appendChild(btn(t('stopCam'), 'release'));
            this.els.freeBtn = btn(t('freeSpec'), 'freespec');
            row.appendChild(this.els.freeBtn);
            s.appendChild(row);
            this.slider(s, 'transitionMs', t('transition'), 0, 5000, 100);
            var ew = mk('div', 'lmd-set');
            ew.appendChild(mk('span', '', t('easing')));
            var sel = mk('select');
            sel.setAttribute('data-cfg', 'easing');
            sel.setAttribute('aria-label', t('easing'));
            EASINGS.forEach(function (e) {
                /* modules.director.easeLinear, easeSmooth, ... */
                var o = mk('option', '', t('ease' + e.charAt(0).toUpperCase() + e.slice(1)));
                o.value = e;
                sel.appendChild(o);
            });
            sel.value = cfg.easing;
            ew.appendChild(sel);
            ew.appendChild(mk('span'));
            s.appendChild(ew);
            this.slider(s, 'followMs', t('followMs'), 0, 1500, 50);
            this.slider(s, 'dwellSec', t('dwell'), 2, 60, 1);
            this.slider(s, 'hystPct', t('hyst'), 0, 200, 5);
            this.slider(s, 'overrideSec', t('override'), 2, 60, 1);
            s.appendChild(mk('h6', '', t('cands')));
            this.els.cands = mk('ul');
            s.appendChild(this.els.cands);
        },
        buildWatch: function (body) {
            var s = this.section(body, 'watch');
            var row = mk('div', 'lmd-row');
            var inp = mk('input');
            inp.type = 'text'; inp.maxLength = NICK_MAX; inp.placeholder = t('nickPh');
            inp.setAttribute('autocomplete', 'off'); inp.setAttribute('spellcheck', 'false');
            this.els.nick = inp;
            row.appendChild(inp);
            row.appendChild(btn(t('add'), 'addnick'));
            this.els.pickBtn = btn(t('pick'), 'pick', 'lmd-act');
            row.appendChild(this.els.pickBtn);
            s.appendChild(row);
            var row2 = mk('div', 'lmd-row');
            row2.appendChild(btn(t('prev'), 'wprev'));
            row2.appendChild(btn(t('next'), 'wnext'));
            s.appendChild(row2);
            this.els.watch = mk('ul');
            s.appendChild(this.els.watch);
            s.appendChild(mk('h6', '', t('lbTitle')));
            this.els.lb = mk('ul');
            s.appendChild(this.els.lb);
        },
        buildMarks: function (body) {
            var s = this.section(body, 'marks');
            var row = mk('div', 'lmd-row');
            var inp = mk('input');
            inp.type = 'text'; inp.maxLength = NAME_MAX; inp.placeholder = t('markPh');
            inp.setAttribute('autocomplete', 'off');
            this.els.markName = inp;
            row.appendChild(inp);
            var sv = btn(t('markSave'), 'msave');
            sv.id = 'lm-dir-mark-save';
            row.appendChild(sv);
            s.appendChild(row);
            s.appendChild(mk('div', 'lmd-note', t('markHint')));
            this.els.marks = mk('ul');
            s.appendChild(this.els.marks);
        },
        buildBroadcast: function (body) {
            var s = this.section(body, 'broadcast');
            var row = mk('div', 'lmd-row');
            this.els.bcBtn = btn('', 'bc', 'lmd-act');
            row.appendChild(this.els.bcBtn);
            s.appendChild(row);
            s.appendChild(mk('h6', '', t('bcShow')));
            var r2 = mk('div');
            this.check(r2, 'bcName', t('bcName'));
            this.check(r2, 'bcMass', t('bcMass'));
            this.check(r2, 'bcRank', t('bcRank'));
            this.check(r2, 'bcTicker', t('bcTicker'));
            s.appendChild(r2);
            s.appendChild(mk('h6', '', t('bcHide')));
            var r3 = mk('div');
            this.check(r3, 'hudButtons', t('hHudButtons'), true);
            this.check(r3, 'bell', t('hBell'), true);
            this.check(r3, 'quickBar', t('hQuickBar'), true);
            this.check(r3, 'follow', t('hFollow'), true);
            this.check(r3, 'netGraph', t('hNetGraph'), true);
            s.appendChild(r3);
        },
        buildHistory: function (body) {
            var s = this.section(body, 'history');
            var cv = mk('canvas');
            cv.width = 440; cv.height = 110;
            cv.dir = 'ltr';
            this.els.chart = cv;
            s.appendChild(cv);
            this.els.legend = mk('div', 'lmd-legend');
            s.appendChild(this.els.legend);
            var row = mk('div', 'lmd-row');
            this.els.histNote = mk('span', 'lmd-note');
            row.appendChild(this.els.histNote);
            row.appendChild(btn(t('clear'), 'hclear'));
            s.appendChild(row);
            this.els.ticker = mk('ul');
            s.appendChild(this.els.ticker);
        },
        showTab: function (id) {
            this.tab = id;
            var secs = this.els.body.querySelectorAll('.lmd-sec'), i;
            for (i = 0; i < secs.length; i++) secs[i].style.display = secs[i].getAttribute('data-sec') === id ? '' : 'none';
            var tb = this.els.tabs.querySelectorAll('button');
            for (i = 0; i < tb.length; i++) tb[i].classList.toggle('lmd-on', tb[i].getAttribute('data-tab') === id);
            this.sigs = {};
            this.update();
            this.place();
        },
        openPanel: function () {
            ensureEnabled();
            this.build();
            this.root.style.display = '';
            this.open = true;
            this.root.style.setProperty('--lmd-mc', mainColor());
            this.showTab(this.tab);
        },
        close: function () {
            if (!this.root) return;
            this.root.style.display = 'none';
            this.open = false;
            if (st.picking) setPicking(false);
        },
        /* away from the notification bell and the Command Centre quick bar; full height on phones */
        place: function () {
            var r = this.root;
            if (!r || !this.open) return;
            var vw = W.innerWidth || 915, vh = W.innerHeight || 412;
            var avoid = visibleRect('#lm-notif-bell, #lm-cc-bar, #lm-cc-bar-open');
            var w = Math.min(460, vw - 16), tops = [8], best = null, i;
            for (i = 0; i < avoid.length; i++) tops.push(Math.ceil(avoid[i].bottom) + 6);
            for (i = 0; i < tops.length; i++) {
                var mh = vh - tops[i] - 8;
                if (mh < 200 && i) continue;
                r.style.maxHeight = mh + 'px';
                var h = Math.min(mh, r.offsetHeight || mh);
                var sp = pickSpot({ w: vw, h: vh }, w, h, [{ x: vw - w - 8, y: tops[i] }, { x: 8, y: tops[i] }, { x: Math.round((vw - w) / 2), y: tops[i] }], avoid, 4);
                var ov = sp.overlap < 0 ? Infinity : sp.overlap;
                if (!best || ov < best.ov) best = { x: sp.x, y: sp.y, ov: ov, mh: mh };
                if (!ov) break;
            }
            r.style.left = best.x + 'px';
            r.style.top = best.y + 'px';
            r.style.maxHeight = best.mh + 'px';
        },
        onClick: function (e) {
            var b = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
            if (!b || !this.root.contains(b)) return;
            e.preventDefault();
            var act = b.getAttribute('data-act'), i = +b.getAttribute('data-i'), LM = LMo();
            switch (act) {
                case 'close': this.close(); break;
                case 'off': disable(); this.close(); break;
                case 'tab': this.showTab(b.getAttribute('data-tab')); break;
                case 'auto': setAuto(!st.auto); break;
                case 'release': st.manual = null; st.has = false; st.lastId = ''; setAuto(false); break;
                case 'freespec': freeSpectate(LM); break;
                case 'cand': watchPlayer(b.getAttribute('data-n') || ''); break;
                case 'addnick': this.addNick(); break;
                case 'pick': setPicking(!st.picking); break;
                case 'wprev': cycleWatch(-1); break;
                case 'wnext': cycleWatch(1); break;
                case 'wgo': if (watch[i] != null) { st.watchIdx = i; watchPlayer(watch[i]); } break;
                case 'wdel': if (watch[i] != null) removeWatch(watch[i]); break;
                case 'lbadd': { var n = b.getAttribute('data-n') || ''; if (validNick(n)) addWatch(n); else toast(t('noCell')); } break;
                case 'msave': this.saveMark(); break;
                case 'mgo': recallBookmark(i); break;
                case 'mdel': removeBookmark(i); break;
                case 'bc': setBroadcast(!st.broadcast); break;
                case 'hclear': st.hist.length = 0; st.ticker.length = 0; st.lastSnap = null; this.sigs = {}; break;
            }
            this.update();
        },
        onInput: function (e) {
            var el = e.target, k = el.getAttribute('data-cfg'), h = el.getAttribute('data-hide');
            if (h) { cfg.hide[h] = !!el.checked; saveCfg(); lastBc = 0; return; }
            if (!k) return;
            if (el.type === 'checkbox') cfg[k] = !!el.checked;
            else if (k === 'easing') cfg.easing = EASINGS.indexOf(el.value) >= 0 ? el.value : 'smooth';
            else if (own(NUM_CFG, k)) {
                var v = Number(el.value);
                cfg[k] = fin(v) ? clamp(Math.round(v), NUM_CFG[k][1], NUM_CFG[k][2]) : NUM_CFG[k][0];
                if (this.els['val-' + k]) this.els['val-' + k].textContent = String(cfg[k]);
            }
            if (e.type === 'change' || el.type !== 'range') saveCfg();
            lastBc = 0;
        },
        addNick: function () {
            var v = this.els.nick.value;
            if (addWatch(v)) { this.els.nick.value = ''; toast(t('watchAdded', validNick(v))); }
        },
        saveMark: function () {
            if (saveView(this.els.markName.value) >= 0) this.els.markName.value = '';
        },
        /* rebuilds a list only when its content changed (no flicker, focus kept) */
        list: function (name, rows, sig) {
            if (this.sigs[name] === sig) return;
            this.sigs[name] = sig;
            var ul = this.els[name];
            while (ul.firstChild) ul.removeChild(ul.firstChild);
            if (!rows.length) { ul.appendChild(mk('li', 'lmd-note', t('none'))); return; }
            for (var i = 0; i < rows.length; i++) ul.appendChild(rows[i]);
        },
        row: function (name, meta, buttons, cur, color) {
            var li = mk('li', cur ? 'lmd-cur' : '');
            var n = mk('span', 'lmd-n');
            if (color) { var d = mk('span', 'lmd-dot'); d.style.background = color; n.appendChild(d); }
            n.appendChild(D.createTextNode(name));
            li.appendChild(n);
            if (meta) li.appendChild(mk('span', 'lmd-m', meta));
            for (var i = 0; i < buttons.length; i++) li.appendChild(buttons[i]);
            return li;
        },
        ibtn: function (text, act, i, nick, tip) {
            var b = btn(text, act);
            b.setAttribute('data-i', i);
            if (nick != null) b.setAttribute('data-n', nick);
            if (tip) { b.title = tip; b.setAttribute('aria-label', tip); }
            return b;
        },
        update: function () {
            if (!this.open || !this.root) return;
            var LM = LMo(), self = this, rows = [], sig, i;
            this.els.autoBtn.textContent = t('auto') + ': ' + (st.auto ? t('on') : t('offShort'));
            this.els.autoBtn.classList.toggle('lmd-on', st.auto);
            this.els.bcBtn.textContent = t('bc') + ': ' + (st.broadcast ? t('on') : t('offShort'));
            this.els.bcBtn.classList.toggle('lmd-on', st.broadcast);
            this.els.pickBtn.textContent = st.picking ? t('pickOn') : t('pick');
            this.els.pickBtn.classList.toggle('lmd-on', st.picking);
            var mode = camMode(LM);
            this.els.freeBtn.style.display = mode === 'fixed' || mode === 'nospec' ? '' : 'none';
            if (this.tab === 'camera') {
                this.els.status.textContent = statusText(LM);
                var top = st.ranked.slice(0, 6), fk = st.manual ? null : st.sel.key;
                sig = fk + '|' + top.map(function (c) { return c.key + Math.round(c.score) + Math.round(c.mass / 50) + (c.fight > 1) + (c.split > 1) + (c.change > 1); }).join(';');
                for (i = 0; i < top.length; i++) {
                    var c = top[i], tags = [];
                    if (c.fight > 1) tags.push(t('fight'));
                    if (c.split > 1) tags.push(t('split'));
                    if (c.change > 1) tags.push(t('change'));
                    if (c.top) tags.push('#1');
                    rows.push(this.row(nickText(c.nick), shortMass(c.mass) + ' \u00b7 ' + Math.round(c.score) + (tags.length ? ' \u00b7 ' + tags.join(', ') : ''),
                        [this.ibtn(t('go'), 'cand', i, c.nick)], c.key === fk, typeof c.color === 'string' ? c.color : null));
                }
                this.list('cands', rows, sig);
            } else if (this.tab === 'watch') {
                var cur = st.manual && st.manual.type === 'player' ? st.manual.nick : null, vis = {};
                for (i = 0; i < st.ranked.length; i++) vis[st.ranked[i].nick] = true;
                var cs = (LM && LM.cells) || [];
                if (watch.length) for (i = 0; i < cs.length; i++) if (isPlayerCell(cs[i]) && cs[i].nick) vis[cs[i].nick] = true;
                sig = cur + '|' + watch.map(function (n) { return n + (vis[n] ? 1 : 0) + lbRank(LM, n); }).join('\u0002');
                for (i = 0; i < watch.length; i++) {
                    var n = watch[i], r = lbRank(LM, n), meta = [];
                    meta.push(vis[n] ? '\u25cf ' + t('inView') : '\u25cb ' + t('notSeen'));
                    if (r) meta.push('#' + r);
                    rows.push(this.row(n, meta.join(' \u00b7 '), [this.ibtn(t('go'), 'wgo', i), this.ibtn('\u00d7', 'wdel', i, null, t('del'))], n === cur));
                }
                this.list('watch', rows, sig);
                var lb = [], lbSig = '';
                var L = (LM && LM.leaderboard) || [];
                for (i = 0; i < L.length && i < LB_DEPTH; i++) {
                    var ln = lbNick(LM, i);
                    lbSig += ln + '\u0002' + (watch.indexOf(ln) >= 0 ? 1 : 0);
                    var g = LM.ghostCells && LM.ghostCells[i];
                    lb.push(this.row((i + 1) + '. ' + nickText(ln), g && g.mass ? shortMass(g.mass) : '',
                        watch.indexOf(ln) >= 0 || !validNick(ln) ? [] : [this.ibtn('+', 'lbadd', i, ln)], false));
                }
                this.list('lb', lb, lbSig);
            } else if (this.tab === 'marks') {
                var curM = st.manual && st.manual.type === 'point' ? st.manual.x + ',' + st.manual.y : null;
                sig = curM + '|' + marks.map(function (b) { return b.name + b.x + ',' + b.y + ',' + b.zoom; }).join(';');
                for (i = 0; i < marks.length; i++) {
                    var b = marks[i];
                    rows.push(this.row((i < 5 ? '[' + (i + 1) + '] ' : '') + (b.name || t('markN', i + 1)),
                        b.x + ', ' + b.y + (b.zoom ? ' \u00b7 ' + b.zoom + 'x' : ''),
                        [this.ibtn(t('go'), 'mgo', i), this.ibtn('\u00d7', 'mdel', i, null, t('del'))], curM === b.x + ',' + b.y));
                }
                this.list('marks', rows, sig);
            } else if (this.tab === 'history') {
                this.els.histNote.textContent = t('histNote', st.hist.length, MAX_HISTORY);
                sig = st.hist.length + '|' + (st.hist.length ? st.hist[st.hist.length - 1].t : 0) + '|' + st.ticker.length + '|' + Math.floor(Date.now() / 5000);
                if (this.sigs.chart !== sig) { this.sigs.chart = sig; this.drawChart(); }
                var tk = st.ticker.slice(-12).reverse();
                for (i = 0; i < tk.length; i++) {
                    var d = new Date(tk[i].t), hh = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
                    rows.push(self.row(t('passed', nickText(tk[i].nick), nickText(tk[i].passed)), hh + ' \u00b7 #' + tk[i].rank, [], false));
                }
                this.list('ticker', rows, st.ticker.length + '|' + (st.ticker.length ? st.ticker[st.ticker.length - 1].t : 0));
            }
        },
        /* rank (1 at the top .. 10) of the current top 5 and the followed player over the last 10 min */
        drawChart: function () {
            var cv = this.els.chart, ctx = cv.getContext && cv.getContext('2d');
            var lg = this.els.legend;
            while (lg.firstChild) lg.removeChild(lg.firstChild);
            if (!ctx) return;
            var W2 = cv.width, H = cv.height, padL = 22, padR = 6, padT = 6, padB = 6;
            ctx.clearRect(0, 0, W2, H);
            ctx.font = '10px Ubuntu, Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,.45)';
            ctx.strokeStyle = 'rgba(255,255,255,.08)';
            ctx.lineWidth = 1;
            var rowH = (H - padT - padB) / (LB_DEPTH - 1), i, j;
            for (i = 0; i < LB_DEPTH; i++) {
                var gy = padT + i * rowH;
                ctx.beginPath(); ctx.moveTo(padL, gy + 0.5); ctx.lineTo(W2 - padR, gy + 0.5); ctx.stroke();
                if (i === 0 || i === 4 || i === 9) ctx.fillText('#' + (i + 1), 2, gy + 3);
            }
            var h = st.hist;
            if (!h.length) return;
            var end = Date.now(), start = Math.max(h[0].t, end - 600000);
            if (end - start < 30000) start = end - 30000;
            var last = h[h.length - 1].r, names = [];
            for (i = 0; i < last.length && names.length < 5; i++) if (last[i] && last[i].trim() && names.indexOf(last[i]) < 0) names.push(last[i]);
            var f = followed(LMo());
            if (f && names.indexOf(f) < 0 && f.trim()) names.push(f);
            var colors = ['#4fc3f7', '#ffb74d', '#81c784', '#e57373', '#ba68c8', '#fff176'];
            var xOf = function (tm) { return padL + (W2 - padL - padR) * (Math.max(tm, start) - start) / (end - start); };
            var yOf = function (r) { return padT + (r - 1) * rowH; };
            for (j = 0; j < names.length; j++) {
                var s = rankSeries(h, names[j], start);
                ctx.strokeStyle = colors[j];
                ctx.lineWidth = names[j] === f ? 2.5 : 1.5;
                ctx.beginPath();
                var pen = false;
                for (i = 0; i < s.length; i++) {
                    var x0 = xOf(s[i][0]), x1 = i + 1 < s.length ? xOf(s[i + 1][0]) : xOf(end);
                    if (!s[i][1]) { pen = false; continue; }
                    var y = yOf(s[i][1]);
                    if (!pen) ctx.moveTo(x0, y); else ctx.lineTo(x0, y);
                    ctx.lineTo(x1, y);
                    pen = true;
                }
                ctx.stroke();
                var sp = mk('span');
                var dot = mk('span', 'lmd-dot');
                dot.style.background = colors[j];
                sp.appendChild(dot);
                sp.appendChild(D.createTextNode(names[j]));
                lg.appendChild(sp);
            }
        }
    };
    function refresh() { if (ui.open) ui.dirty = true; }

    /* a language change: the panel is built again in the new language (its state is in cfg and
     * st; typed text and the tab are kept), the broadcast HUD redraws its text */
    function relang() {
        bc.sig = '';
        if (bc.el) bc.el.dir = textDir();
        var r = ui.root;
        if (!r) return;
        var wasOpen = ui.open, nick = ui.els.nick ? ui.els.nick.value : '', mark = ui.els.markName ? ui.els.markName.value : '';
        if (r.parentNode) r.parentNode.removeChild(r);
        ui.root = null; ui.els = {}; ui.sigs = {}; ui.open = false;
        if (!wasOpen) return;
        ui.openPanel();
        if (ui.els.nick) ui.els.nick.value = nick;
        if (ui.els.markName) ui.els.markName.value = mark;
    }
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () { try { relang(); } catch (e) { } });

    /* ═══ Broadcast HUD ═══ */

    var bc = { el: null, main: null, tick: null, sig: '', placedSig: '', placedAt: 0, hidden: '' };
    var BC_AVOID = '#overlays-hud > *, #leaderboard-hud, #minimap-hud, #chat-box, #messages, #message-box, #top5-hud, #stats-hud, #time-hud, ' +
        '#target-hud, #target-panel-hud, #pause-hud, #quest-hud, #lm-event-banner, #lm-net-graph, #lm-stats, #lm-mc-l, #lm-mc-r, #lm-mc-sm, ' +
        '#lm-drawer, #lm-sp, #lm-replay-bar, #lm-spec-follow, #lm-notif-bell, #lm-cc-bar, #lm-cc-bar-open';
    function setHidden(on) {
        var want = '';
        if (on) for (var i = 0; i < HIDE_KEYS.length; i++) if (cfg.hide[HIDE_KEYS[i]]) want += HIDE_KEYS[i] + ' ';
        if (want === bc.hidden || !D.body) return;
        for (var j = 0; j < HIDE_KEYS.length; j++) D.body.classList.toggle('lm-dir-hide-' + HIDE_KEYS[j], want.indexOf(HIDE_KEYS[j] + ' ') >= 0);
        bc.hidden = want;
    }
    function bcSync(on) {
        setHidden(on);
        if (!on) {
            if (bc.el) bc.el.style.display = 'none';
            return;
        }
        css();
        if (!bc.el) {
            bc.el = mk('div');
            bc.el.id = 'lm-dir-bc';
            bc.el.dir = textDir();
            bc.main = mk('div', 'lmd-bc-main');
            bc.tick = mk('div', 'lmd-bc-tick');
            bc.el.appendChild(bc.main);
            bc.el.appendChild(bc.tick);
            D.body.appendChild(bc.el);
        }
        bc.el.style.setProperty('--lmd-mc', mainColor());
        var LM = LMo(), f = followed(LM), parts = [], sig;
        if (f != null) {
            var p = f ? playerPos(LM, f, undefined, st.manual && st.manual.color) : null, g = p ? null : ghostOf(LM, f);
            var mass = p ? p.mass : (g && g.mass) || 0, rank = lbRank(LM, f);
            if (cfg.bcName) parts.push(nickText(f));
            if (cfg.bcMass && mass) parts.push(shortMass(mass));
            if (cfg.bcRank && rank) parts.push('#' + rank);
        }
        var tick = '', tm = Date.now();
        if (cfg.bcTicker) {
            var recent = [];
            for (var i = st.ticker.length - 1; i >= 0 && recent.length < 2; i--) {
                if (tm - st.ticker[i].t > 8000) break;
                recent.push(t('passed', nickText(st.ticker[i].nick), nickText(st.ticker[i].passed)) + ' (#' + st.ticker[i].rank + ')');
            }
            tick = recent.join(' \u00b7 ');
        }
        sig = parts.join('\u0002') + '|' + tick;
        if (sig !== bc.sig) {
            bc.sig = sig;
            while (bc.main.firstChild) bc.main.removeChild(bc.main.firstChild);
            if (parts.length) {
                var first = cfg.bcName ? 1 : 0;
                if (first) { var nb = mk('b', '', parts[0]); bc.main.appendChild(nb); }
                var rest = parts.slice(first).join(' \u00b7 ');
                if (rest) bc.main.appendChild(D.createTextNode((first ? ' \u00b7 ' : '') + rest));
            }
            bc.main.style.display = parts.length ? '' : 'none';
            bc.tick.textContent = tick;
            bc.tick.style.display = tick ? '' : 'none';
        }
        var show = !!(parts.length || tick);
        bc.el.style.display = show ? '' : 'none';
        if (show) bcPlace();
    }
    /* top middle first (below the event banner / follow label when they are there), then the bottom
     * middle, then the sides: never over the HUD boxes, the bell, the quick bar or the phone buttons */
    function bcPlace() {
        var el = bc.el, tm = now();
        var vw = W.innerWidth || 915, vh = W.innerHeight || 412;
        var w = Math.ceil(el.offsetWidth), h = Math.ceil(el.offsetHeight);
        var ps = w + 'x' + h + '@' + vw + 'x' + vh;
        if (ps === bc.placedSig && tm - bc.placedAt < 2000) return;
        bc.placedSig = ps; bc.placedAt = tm;
        var avoid = visibleRect(BC_AVOID), cands = [], y, x = Math.round((vw - w) / 2);
        for (y = 6; y <= vh * 0.35; y += 10) cands.push({ x: x, y: y });
        for (y = vh - h - 6; y >= vh * 0.6; y -= 10) cands.push({ x: x, y: y });
        cands.push({ x: 8, y: Math.round((vh - h) / 2) }, { x: vw - w - 8, y: Math.round((vh - h) / 2) });
        var sp = pickSpot({ w: vw, h: vh }, w, h, cands, avoid, 4);
        el.style.left = sp.x + 'px';
        el.style.top = sp.y + 'px';
    }

    /* ═══ API ═══ */

    function toggle() { if (ui.open) ui.close(); else ui.openPanel(); }
    function needSpec(fn) {
        return function () {
            ensureEnabled();
            if (!spectating(LMo())) { toast(t('specOnly')); return; }
            return fn.apply(null, arguments);
        };
    }
    api.toggle = toggle;
    api.open = function () { ui.openPanel(); };
    api.close = function () { ui.close(); };
    api.isOpen = function () { return ui.open; };
    api.disable = disable;
    api.setAuto = setAuto;
    api.toggleAuto = function () { var on = setAuto(!st.auto); toast(on ? t('dirOn') : t('dirOff')); return on; };
    api.isAuto = function () { return st.auto; };
    api.setBroadcast = setBroadcast;
    api.toggleBroadcast = function () { var on = setBroadcast(!st.broadcast); toast(on ? t('bcOn') : t('bcOff')); return on; };
    api.isBroadcast = function () { return st.broadcast; };
    api.status = function () { return statusText(LMo()); };
    api.addBookmark = addBookmark;
    api.saveView = saveView;
    api.recallBookmark = needSpec(recallBookmark);
    api.removeBookmark = removeBookmark;
    api.bookmarks = function () { return marks.map(function (b) { return { name: b.name, x: b.x, y: b.y, zoom: b.zoom }; }); };
    api.addWatch = addWatch;
    api.removeWatch = removeWatch;
    api.watchlist = function () { return watch.slice(); };
    api.watchNext = needSpec(function () { cycleWatch(1); });
    api.watchPrev = needSpec(function () { cycleWatch(-1); });
    api.watchAddUnderCursor = addUnderCursor;
    api.config = function () { return JSON.parse(JSON.stringify(cfg)); };
    api.history = function () { return st.hist.map(function (h) { return { t: h.t, r: h.r.slice() }; }); };
    api.ticker = function () { return st.ticker.map(function (e) { return { t: e.t, nick: e.nick, passed: e.passed, rank: e.rank }; }); };
    api.followed = function () { return followed(LMo()); };
    api._onLeaderboard = onLeaderboard;

    W.addEventListener('resize', function () { if (ui.open) ui.place(); bc.placedSig = ''; });
    D.addEventListener('keydown', function (e) {
        if (st.picking && e.key === 'Escape') { setPicking(false); e.stopPropagation(); }
    }, true);
    /* Esc closes the panel wherever the focus is, as Analytics and Custom macros do: it closed only with
     * the focus inside, so after a click on the game Esc opened the game menu instead. While a player is
     * picked on the map, Esc ends the picking first (above); a window in front that closes on Esc takes
     * it first (winstack.js). */
    W.addEventListener('keydown', function (e) {
        if (!(e.key === 'Escape' || e.keyCode === 27) || e.ctrlKey || e.altKey || e.metaKey) return;
        if (!ui.open || !ui.root || st.picking) return;
        if (W.LMWinStack && typeof W.LMWinStack.escFor === 'function' && !W.LMWinStack.escFor(ui.root, e)) return;
        e.preventDefault();
        e.stopPropagation();
        ui.close();
    }, true);
})();
