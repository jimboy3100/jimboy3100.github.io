/* Legend Mod Analytics: statistics dashboard and heatmaps.
 * Opened from the Analytics button in the profile stats (click your profile picture), the
 * menu footer link while recording is on, or LMAnalytics.open().
 * Its History tab is the match history list (option "matchHistory", ogario.v4.js _lmMatchHistoryPaint;
 * the "Match history" footer link and _lmMatchHistoryOpen open it there).
 * Recording is off by default (option "analytics", Settings > Stats). While it is off this file only
 * checks the option once a second and adds no LMEvents listeners; the window still shows the old
 * match history (lmMatchHistory) and the all-time personal bests (highest mass, longest time alive).
 * Everything stays in this browser (localStorage, capped and validated on every read). No network.
 * The window is built only when it is opened.
 */
(function () {
    'use strict';
    if (window._lmAnalyticsLoaded) return;
    window._lmAnalyticsLoaded = true;

    /* ------------------------------------------------------------------ constants */
    var SCHEMA = 1;
    var KEY_GAMES = 'lmAnalyticsGames', KEY_TRACKS = 'lmAnalyticsTracks';
    var MAX_GAMES = 500;          // game summaries kept (about 300 bytes each)
    var MAX_TRACKS = 50;          // games kept for the heatmaps
    var MAX_SAMPLES = 3600;       // position samples per game; longer lives are thinned (see sample())
    var GRID = 64;                // positions are stored on a 64x64 grid over the map, 2 characters each
    var ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var SPLIT_GROUP = 400;        // splits closer than this are one split (macros send several)
    var SPLIT_WINDOW = 5000;      // mass lost this soon after a split counts against it
    var FINAL_WINDOW = 20000;     // "final 20 s" of a life
    var EDGE = 0.06;              // outer share of the map that counts as "near the border"
    var DAY = 86400000;

    /* ------------------------------------------------------------------ small helpers */
    function num(v, min, max, def) {
        v = Number(v);
        if (!isFinite(v)) return def;
        return v < min ? min : v > max ? max : v;
    }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function str(v, n) { return typeof v === 'string' ? v.slice(0, n) : ''; }
    function avg(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : 0; }
    function maxOf(a) { var m = 0; for (var i = 0; i < a.length; i++) if (a[i] > m) m = a[i]; return m; }
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    /* Monday 00:00 local time of the week holding t */
    function weekStart(t) {
        var d = new Date(t);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);
        return d.getTime();
    }

    /* ------------------------------------------------------------------ positions */
    function cellOf(v) { return Math.min(GRID - 1, Math.max(0, Math.floor(clamp01(v) * GRID))); }
    function encodeCell(x, y) { return ALPH.charAt(cellOf(x)) + ALPH.charAt(cellOf(y)); }
    function decodeCells(s) {
        var out = [];
        if (typeof s !== 'string') return out;
        for (var i = 0; i + 1 < s.length; i += 2) {
            var a = ALPH.indexOf(s.charAt(i)), b = ALPH.indexOf(s.charAt(i + 1));
            if (a >= 0 && b >= 0) out.push([a, b]);
        }
        return out;
    }
    function validCells(s, maxChars) { return typeof s === 'string' && s.length % 2 === 0 && s.length <= maxChars && /^[A-Za-z0-9_-]*$/.test(s); }
    /* near the border: a band along the sides of a square map, the outer ring of a round one
     * (Expanding Land). Cells are tested at their centres. */
    function isEdgeCell(ix, iy, shape) {
        var x = (ix + 0.5) / GRID, y = (iy + 0.5) / GRID;
        if (shape === 'c') { var dx = x - 0.5, dy = y - 0.5; return Math.sqrt(dx * dx + dy * dy) > 0.5 - EDGE; }
        return x < EDGE || y < EDGE || x > 1 - EDGE || y > 1 - EDGE;
    }
    /* movement facts of one life: visited cells of an 8x8 grid (0-64) and the edge share (0-1) */
    function trackFacts(cells, shape) {
        var seen = {}, cov = 0, edge = 0;
        for (var i = 0; i < cells.length; i++) {
            var k = (cells[i][0] >> 3) * 8 + (cells[i][1] >> 3);
            if (!seen[k]) { seen[k] = 1; cov++; }
            if (isEdgeCell(cells[i][0], cells[i][1], shape)) edge++;
        }
        return { cov: cov, edge: cells.length ? edge / cells.length : 0, n: cells.length };
    }
    /* Heatmap binning: res x res counts from the stored 64x64 cells of the given tracks.
     * layer 'move' uses every position sample, 'death' and 'spawn' one point per game. */
    function binHeat(tracks, layer, res) {
        res = Math.max(1, Math.min(GRID, res | 0));
        var cells = new Array(res * res), max = 0, total = 0, i, j;
        for (i = 0; i < cells.length; i++) cells[i] = 0;
        for (i = 0; i < tracks.length; i++) {
            var tr = tracks[i];
            var list = decodeCells(layer === 'death' ? tr.d : layer === 'spawn' ? tr.s : tr.p);
            for (j = 0; j < list.length; j++) {
                var bx = Math.floor(list[j][0] * res / GRID), by = Math.floor(list[j][1] * res / GRID);
                var k = by * res + bx;
                cells[k]++;
                total++;
                if (cells[k] > max) max = cells[k];
            }
        }
        return { res: res, cells: cells, max: max, total: total };
    }

    /* ------------------------------------------------------------------ records
     * Game record (schema 1), one per life:
     *   v      schema version            src   'lm' recorded here, 'mh' read from the old match history
     *   t      death time (ms)           ms    time alive (ms)
     *   peak   best mass of the life     end   mass in the last update before the death
     *   srv    server host (no tokens)   mode  game mode text     st  server type
     *   map    map size (world units)    bestPos / lastPos  best and last leaderboard place (0 = not listed)
     *   first  ms spent in 1st place     spl   split count (grouped, see SPLIT_GROUP)
     *   splBad splits that lost over 20 % within 5 s       splLoss  average loss after a split (0-1)
     *   cov    visited cells of an 8x8 map grid (0-64)     edge     share of samples near the border (0-1)
     *   n      position samples          loss20  mass lost in the final 20 s as a share of the peak (0-1)
     * Track record (schema 1), the last MAX_TRACKS lives: { v, t, map, shape 's'|'c', p, s, d } with
     * p = position samples, s = spawn cell, d = death cell, each 2 characters of ALPH per cell. */
    function sanitizeGame(r) {
        if (!r || typeof r !== 'object' || Array.isArray(r)) return null;
        var t = num(r.t, 0, 4102444800000, 0);
        if (!t) return null;
        var g = {
            v: SCHEMA, src: r.src === 'mh' ? 'mh' : 'lm', t: t,
            ms: Math.round(num(r.ms, 0, 6 * 3600000, 0)),
            peak: Math.round(num(r.peak, 0, 1e9, 0)),
            srv: str(r.srv, 80), mode: str(r.mode, 30), st: str(r.st, 20)
        };
        if (g.src === 'lm') {
            g.end = Math.min(g.peak, Math.round(num(r.end, 0, 1e9, 0)));
            g.map = Math.round(num(r.map, 0, 1e7, 0));
            g.bestPos = Math.round(num(r.bestPos, 0, 1000, 0));
            g.lastPos = Math.round(num(r.lastPos, 0, 1000, 0));
            g.first = Math.round(num(r.first, 0, g.ms, 0));
            g.spl = Math.round(num(r.spl, 0, 100000, 0));
            g.splBad = Math.min(g.spl, Math.round(num(r.splBad, 0, 100000, 0)));
            g.splLoss = g.spl ? num(r.splLoss, 0, 1, 0) : 0;
            g.cov = Math.round(num(r.cov, 0, 64, 0));
            g.edge = num(r.edge, 0, 1, 0);
            g.n = Math.round(num(r.n, 0, MAX_SAMPLES, 0));
            g.loss20 = num(r.loss20, 0, 1, 0);
        }
        return g;
    }
    function sanitizeTrack(r) {
        if (!r || typeof r !== 'object' || Array.isArray(r)) return null;
        var t = num(r.t, 0, 4102444800000, 0);
        if (!t || !validCells(r.p, MAX_SAMPLES * 2)) return null;
        return {
            v: SCHEMA, t: t, map: Math.round(num(r.map, 0, 1e7, 0)), shape: r.shape === 'c' ? 'c' : 's', p: r.p,
            s: validCells(r.s, 2) ? r.s : '', d: validCells(r.d, 2) ? r.d : ''
        };
    }
    /* { v: 1, games: [...] }; anything else (other version, broken JSON) reads as empty.
     * P0 fix: a schema version bump used to wipe all history. Now migrate old data
     * by re-validating each entry through the clean function instead of discarding. */
    function parseStore(raw, field, clean, cap) {
        var out = [];
        try {
            var o = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (o && typeof o === 'object') {
                /* Accept current schema or attempt migration from any older version */
                var arr = Array.isArray(o[field]) ? o[field] : [];
                for (var i = 0; i < arr.length; i++) { var c = clean(arr[i]); if (c) out.push(c); }
            }
        } catch (e) { out = []; }
        out.sort(function (a, b) { return a.t - b.t; });
        return out.length > cap ? out.slice(out.length - cap) : out;
    }
    /* old match history entries ({ t, mass, ms, killer, server, mode }) as schema 1 games */
    function fromMatchHistory(raw) {
        var out = [];
        try {
            var o = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (!Array.isArray(o)) return out;
            for (var i = 0; i < o.length; i++) {
                var r = o[i];
                if (!r || typeof r !== 'object') continue;
                var g = sanitizeGame({ src: 'mh', t: r.t, ms: r.ms, peak: r.mass, srv: r.server, mode: r.mode });
                if (g) out.push(g);
            }
        } catch (e) { }
        return out;
    }
    /* recorded games plus the old match history entries that are not the same life
     * (both options on record the same death within a moment of each other) */
    function mergeGames(lm, legacy) {
        var out = lm.slice();
        for (var i = 0; i < legacy.length; i++) {
            var dup = false;
            for (var j = 0; j < lm.length && !dup; j++) if (Math.abs(lm[j].t - legacy[i].t) < 3000) dup = true;
            if (!dup) out.push(legacy[i]);
        }
        out.sort(function (a, b) { return a.t - b.t; });
        return out;
    }

    /* ------------------------------------------------------------------ dashboard aggregation */
    function summary(list) {
        var lm = list.filter(function (g) { return g.src === 'lm'; });
        return {
            games: list.length,
            avgPeak: Math.round(avg(list.map(function (g) { return g.peak; }))),
            avgMs: Math.round(avg(list.map(function (g) { return g.ms; }))),
            /* "top-10 finish": still in the top 10 of the leaderboard at the last update before the death */
            top10: lm.length ? lm.filter(function (g) { return g.lastPos > 0 && g.lastPos <= 10; }).length / lm.length : null
        };
    }
    /* best modes: highest average peak mass; with any group of 2+ games, single games are left out */
    function groupBest(games, key) {
        var m = {}, list = [];
        games.forEach(function (g) {
            var k = g[key];
            if (!k) return;
            if (!m[k]) { m[k] = { name: k, n: 0, sum: 0 }; list.push(m[k]); }
            m[k].n++;
            m[k].sum += g.peak;
        });
        var min = list.some(function (x) { return x.n >= 2; }) ? 2 : 1;
        return list.filter(function (x) { return x.n >= min; })
            .map(function (x) { return { name: x.name, n: x.n, avgPeak: Math.round(x.sum / x.n) }; })
            .sort(function (a, b) { return b.avgPeak - a.avgPeak || b.n - a.n; })
            .slice(0, 3);
    }
    /* Mass per minute = sum of peak masses / sum of minutes alive, over lives of 10 s or more
     * (a ratio of sums, so a few very short lives cannot inflate it). */
    function aggregate(games, now, extraBest, extraMs) {
        var res = summary(games);
        res.highest = Math.max(maxOf(games.map(function (g) { return g.peak; })), +extraBest || 0);
        /* the longest life: of the stored games or the all-time personal best */
        res.longest = Math.max(maxOf(games.map(function (g) { return g.ms; })), +extraMs || 0);
        var sumPeak = 0, sumMin = 0, first = 0;
        games.forEach(function (g) {
            if (g.ms >= 10000) { sumPeak += g.peak; sumMin += g.ms / 60000; }
            if (g.src === 'lm') first += g.first;
        });
        res.perMin = sumMin > 0 ? Math.round(sumPeak / sumMin) : 0;
        res.firstMs = first;
        /* no best servers: an agar.io game host (live-arena-<token>) changes with almost every join */
        res.modes = groupBest(games, 'mode');
        /* 8 calendar weeks, oldest first; a week without games has n 0 */
        var starts = [weekStart(now)];
        for (var k = 1; k < 8; k++) starts.push(weekStart(starts[k - 1] - DAY / 2));
        starts.reverse();
        res.weeks = starts.map(function (s, i) {
            var e = i + 1 < starts.length ? starts[i + 1] : Infinity;
            var list = games.filter(function (g) { return g.t >= s && g.t < e; });
            return { start: s, n: list.length, avgPeak: Math.round(avg(list.map(function (g) { return g.peak; }))) };
        });
        var w0 = starts[7], w1 = starts[6];
        res.thisWeek = summary(games.filter(function (g) { return g.t >= w0; }));
        res.lastWeek = summary(games.filter(function (g) { return g.t >= w1 && g.t < w0; }));
        return res;
    }

    function fmtTime(ms) {
        var s = Math.max(0, Math.round((+ms || 0) / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
        s = s % 60;
        return (h ? h + ':' + pad2(m) : m) + ':' + pad2(s);
    }
    function fmtNum(n) { n = Math.round(+n || 0); return n.toLocaleString ? n.toLocaleString('en-US') : String(n); }
    function pct(f) { return Math.round(f * 100); }

    /* ------------------------------------------------------------------ text
     * From the language packs (developers/i18n/src, keys modules.analytics.*): the chosen language,
     * else English. vals fill {0} {1} {2}. */
    var TP = 'modules.analytics.';
    function T(key, vals) { return typeof window.lmT === 'function' ? window.lmT(TP + key, vals) : key; }
    function closeText() { return typeof window.lmT === 'function' ? window.lmT('settings.close') : 'Close'; }
    function langDir() { return window.LMi18n && window.LMi18n.dir ? window.LMi18n.dir() : 'ltr'; }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

    /* ------------------------------------------------------------------ storage */
    function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
    /* full or blocked storage: repeatedly halve the list until the write succeeds or list is empty.
     * P1 fix #52: original code only tried twice; a very large list may need several halvings. */
    function lsSetList(k, field, list) {
        while (true) {
            try {
                var o = { v: SCHEMA };
                o[field] = list;
                window.localStorage.setItem(k, JSON.stringify(o));
                return true;
            } catch (e) {
                if (list.length <= 1) return false;
                list = list.slice(Math.floor(list.length / 2));
            }
        }
    }
    function loadGames() { return parseStore(lsGet(KEY_GAMES), 'games', sanitizeGame, MAX_GAMES); }
    function loadTracks() { return parseStore(lsGet(KEY_TRACKS), 'tracks', sanitizeTrack, MAX_TRACKS); }
    function allGames() { return mergeGames(loadGames(), fromMatchHistory(lsGet('lmMatchHistory'))); }
    /* the all-time personal bests (lmPersonalBests, kept by ogario.v4.js _lmPersonalBests at every live
     * death, also of games older than the stored ones): best mass and longest life */
    function personalBests() {
        try {
            var o = JSON.parse(lsGet('lmPersonalBests'));
            if (o && typeof o === 'object') return { m: num(o.m, 0, 1e9, 0), t: num(o.t, 0, 6 * 3600000, 0) };
        } catch (e) { }
        return { m: 0, t: 0 };
    }

    /* ------------------------------------------------------------------ recorder */
    var life = null, listening = false;
    function lm() { return window.legendmod || null; }
    /* Own position as a 0-1 share of the map, the same projection as the minimap:
     * (playerX + mapOffsetX + mapOffset) / mapSize, without mapOffset on Expanding Land. */
    function curPos() {
        var o = lm();
        if (!o) return null;
        var size = +o.mapSize;
        if (!(size > 0)) return null;
        var off = o.isLegendWorld ? 0 : (+o.mapOffset || 0);
        var x = (+o.playerX + (+o.mapOffsetX || 0) + off) / size, y = (+o.playerY + (+o.mapOffsetY || 0) + off) / size;
        if (!isFinite(x) || !isFinite(y)) return null;
        return { x: clamp01(x), y: clamp01(y), map: Math.round(size), shape: o.isLegendWorld ? 'c' : 's' };
    }
    function modeText() {
        try {
            var s = document.getElementById('gamemode');
            if (!s) return '';
            var o = s.options && s.options[s.selectedIndex];
            return String((o && o.text || '').trim() || s.value || '').slice(0, 30);
        } catch (e) { return ''; }
    }
    function beginLife(now) {
        var o = lm();
        life = {
            start: now, pos: [], interval: 1000, lastSample: 0, spawn: '', map: 0, shape: 's',
            peak: 0, end: 0, log: [], bestPos: 0, lastPos: 0, prevPos: 0, lbAt: 0, first: 0,
            pending: [], splitLoss: [], lastSplit: 0,
            srv: typeof window._lmHostOnly === 'function' && o ? window._lmHostOnly(o.ws) : '',
            st: o ? String(o.serverType || '').slice(0, 20) : '', mode: modeText(),
            seq: o ? o._connectSeq || 0 : 0
        };
    }
    /* one position sample per interval; past MAX_SAMPLES every second sample goes and the
     * interval doubles, so a long life keeps an even (coarser) trace */
    function sample(now) {
        if (now - life.lastSample < life.interval) return;
        var p = curPos();
        if (!p) return;
        life.lastSample = now;
        var c = encodeCell(p.x, p.y);
        /* P1 fix #51: when analytics is enabled mid-match, the first position
         * sample is the current position, not the actual spawn. Flag it so the
         * analytics display can show "approximate" rather than a misleading pin. */
        if (!life.spawn) { life.spawn = c; if (life.start && Date.now() - life.start > 3000) life.spawnApprox = true; }
        life.map = p.map;
        life.shape = p.shape;
        life.pos.push(c);
        if (life.pos.length >= MAX_SAMPLES) {
            life.pos = life.pos.filter(function (x, i) { return i % 2 === 0; });
            life.interval *= 2;
        }
    }
    /* a split is judged SPLIT_WINDOW after it, or at the death (dying within the window = all lost) */
    function settleSplits(L, now, dead) {
        L.pending = L.pending.filter(function (sp) {
            var over = now - sp.t >= SPLIT_WINDOW;
            if (!dead && !over) return true;
            var low = dead && !over ? 0 : sp.min;
            L.splitLoss.push(sp.m0 > 0 ? clamp01((sp.m0 - low) / sp.m0) : 0);
            return false;
        });
    }
    /* practice arena lives (ogario/modules/practice.js) are not games */
    function practising() { return !!(window.LMPractice && window.LMPractice.on); }
    /* replays too: LMEvents says where an event comes from (context); older cores: the flags */
    function notLive(e) { return e && e.context ? e.context !== 'live' : practising() || !!window._lmEvReplayOn; }
    function onSpawn(e) { if (notLive(e)) { life = null; return; } beginLife(+e.time || Date.now()); }
    function onMass(e) {
        var now = Date.now(), m = +e.mass || 0;
        if (m <= 0 || notLive(e)) return;
        checkSession();
        if (!life) beginLife(now);
        if (m > life.peak) life.peak = m;
        life.end = m;
        life.log.push([now, m]);
        while (life.log.length && now - life.log[0][0] > FINAL_WINDOW) life.log.shift();
        for (var i = 0; i < life.pending.length; i++) if (m < life.pending[i].min) life.pending[i].min = m;
        settleSplits(life, now, false);
        sample(now);
    }
    function onSplit(e) {
        checkSession();
        if (!life) return;
        var now = +e.time || Date.now();
        if (now - life.lastSplit > SPLIT_GROUP && life.end > 0) life.pending.push({ t: now, m0: life.end, min: life.end });
        life.lastSplit = now;
    }
    function onLeaderboard(e) {
        checkSession();
        if (!life) return;
        var now = Date.now(), p = Math.max(0, +e.position || 0);
        if (life.prevPos === 1 && life.lbAt) life.first += Math.min(now - life.lbAt, 5000);
        life.lbAt = now;
        life.prevPos = p;
        life.lastPos = p;
        if (p > 0 && (!life.bestPos || p < life.bestPos)) life.bestPos = p;
    }
    function onDeath(e) {
        checkSession();
        var L = life;
        life = null;
        if (!L || notLive(e)) return;
        var now = +e.time || Date.now();
        var ms = Math.max(0, Math.min(+e.msAlive || now - L.start, 6 * 3600000));
        var peak = Math.max(L.peak, +e.mass || 0);
        /* L.end stays the last mass update before the death: the death event's mass is
         * playerScore, which is 0 once the cells are gone, so using it made every eaten life
         * end at 0. It is kept with the game (what was still there right before the final hit). */
        if (peak <= 0 && ms < 1000) return;
        if (L.prevPos === 1 && L.lbAt) L.first += Math.min(now - L.lbAt, 5000);
        settleSplits(L, now, true);
        /* final 20 s: the most mass held in that time minus the end mass, as a share of the peak */
        var top20 = maxOf(L.log.map(function (x) { return x[1]; }));
        var cells = decodeCells(L.pos.join(''));
        var f = trackFacts(cells, L.shape);
        var g = sanitizeGame({
            src: 'lm', t: now, ms: ms, peak: peak, end: L.end, srv: L.srv, mode: L.mode, st: L.st, map: L.map,
            bestPos: L.bestPos, lastPos: L.lastPos, first: L.first,
            spl: L.splitLoss.length, splBad: L.splitLoss.filter(function (x) { return x > 0.2; }).length, splLoss: avg(L.splitLoss),
            cov: f.cov, edge: f.edge, n: f.n, loss20: peak > 0 ? clamp01((top20 - L.end) / peak) : 0
        });
        if (!g) return;
        var games = loadGames();
        games.push(g);
        if (games.length > MAX_GAMES) games = games.slice(games.length - MAX_GAMES);
        lsSetList(KEY_GAMES, 'games', games);
        if (cells.length) {
            var tracks = loadTracks();
            tracks.push({ v: SCHEMA, t: now, map: L.map, shape: L.shape, p: L.pos.join(''), s: L.spawn, d: L.pos[L.pos.length - 1] });
            if (tracks.length > MAX_TRACKS) tracks = tracks.slice(tracks.length - MAX_TRACKS);
            lsSetList(KEY_TRACKS, 'tracks', tracks);
        }
        afterGame(g);
    }
    /* an open window shows the game that just ended */
    function afterGame() {
        if (md && md.parentNode) paint();
    }
    function setListening(on) {
        var E = window.LMEvents;
        if (!E || on === listening) return;
        listening = on;
        var f = on ? E.on : E.off;
        f('spawn', onSpawn); f('massUpdate', onMass); f('split', onSplit); f('leaderboard', onLeaderboard); f('death', onDeath);
        f('serverChange', onServerChange);
        if (!on) life = null;
    }
    /* the life ends with the connection: joining another server or losing the connection drops
     * the unfinished life (no death comes for it; the next mass update would continue it).
     * Checked when the next event of the life comes (at most 4 mass updates a second), not by a timer. */
    function onServerChange() { life = null; }
    function checkSession() {
        var o = lm();
        if (!life) return;
        if (!o || (typeof o.isSocketOpen === 'function' && !o.isSocketOpen())) { life = null; return; }
        /* connected again (also to the same server) */
        if ((o._connectSeq || 0) !== life.seq) { life = null; return; }
        var host = typeof window._lmHostOnly === 'function' ? window._lmHostOnly(o.ws) : '';
        if (life.srv && host && host !== life.srv) life = null;
    }
    function enabled() { var s = window.legendmod5; return !!(s && s.analytics); }

    /* ------------------------------------------------------------------ window */
    var md = null, tab = 'dash', heat = { layer: 'move', n: 25, map: 0 };
    /* theme() gives CSS (var(--lm-x, current) so an open window follows a theme change);
     * theme(true) gives the resolved colours for SVG attributes and canvas */
    function theme(raw) {
        var ds = window.defaultSettings || {};
        var r = { mc: ds.menuMainColor || '#01d9cc', pc: ds.menuPanelColor || '#00243e', pc2: ds.menuPanelColor2 || '#002f52', tc: ds.menuTextColor || '#ffffff', tc2: ds.menuTextColor2 || '#8096a7' };
        if (raw) return r;
        return { mc: 'var(--lm-mc,' + r.mc + ')', pc: 'var(--lm-pc,' + r.pc + ')', pc2: 'var(--lm-pc2,' + r.pc2 + ')', tc: 'var(--lm-tc,' + r.tc + ')', tc2: 'var(--lm-tc2,' + r.tc2 + ')' };
    }
    /* marks on the dark panel: one blue for magnitudes (bars, score bars, movement heat),
     * orange for the deaths layer so the two heat layers never look alike */
    var BLUE = '#3987e5';
    var RAMP_BLUE = ['#0d366b', '#184f95', '#256abf', '#3987e5', '#6da7ec', '#9ec5f4', '#cde2fb'];
    var RAMP_ORANGE = ['#5c2a06', '#86400c', '#b35a12', '#dd7a20', '#f39c4b', '#f8bf86', '#fde0c2'];
    function el(tag, css, text) {
        var e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text !== undefined && text !== null) e.textContent = text;
        return e;
    }
    function btn(label, css, on) {
        var b = el('button', 'cursor:pointer;font:inherit;font-size:var(--lm-w-fs,12px);min-height:var(--lm-w-ctl,28px);padding:3px 10px;border-radius:var(--lm-radius-s,4px);border:1px solid var(--lm-pc2,rgba(255,255,255,0.15));background:var(--lm-w-btn,rgba(255,255,255,0.06));color:inherit;touch-action:manipulation;' + (css || ''), label);
        b.type = 'button';
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); on(e); });
        return b;
    }
    function section(body, title) {
        body.appendChild(el('div', 'margin:10px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:' + theme().tc2 + ';', title));
    }
    function close() {
        if (!md) return;
        window.removeEventListener('keydown', onKey, true);
        if (md.parentNode) md.parentNode.removeChild(md);
        md = null;
    }
    function onKey(e) {
        if (!(e.key === 'Escape' || e.keyCode === 27)) return;
        /* with another window open that closes on Esc, only the one in front closes (winstack.js) */
        if (md && window.LMWinStack && typeof window.LMWinStack.escFor === 'function' && !window.LMWinStack.escFor(md, e)) return;
        e.preventDefault(); e.stopPropagation(); close();
    }
    function open(which) {
        if (!document.body) return;
        if (which && ['dash', 'history', 'heat'].indexOf(which) !== -1) tab = which;
        if (md) { paint(); return; }
        /* the shared window look (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        var t = theme();
        md = el('div', 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:720px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);' +
            'display:flex;flex-direction:column;z-index:999992;background:var(--lm-w-bg,' + t.pc + ');border:1px solid ' + t.pc2 + ';border-top:3px solid ' + t.mc + ';' +
            'border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + t.tc + ';font-family:inherit;font-size:var(--lm-w-fs,12px);overflow:hidden;box-sizing:border-box;');
        md.id = 'lm-analytics';
        md._lmEsc = true;
        md.classList.add('lm-modal-container', 'lm-w');
        md.setAttribute('role', 'dialog');
        md.setAttribute('aria-label', T('title'));
        md.dir = langDir();
        var head = el('div', 'display:flex;align-items:center;gap:6px;padding:var(--lm-w-hpad,4px 6px 4px 10px);border-bottom:1px solid ' + t.pc2 + ';background:var(--lm-w-head,linear-gradient(180deg,' + t.pc2 + ' 0%,' + t.pc + ' 100%));flex:0 0 auto;');
        var ttl = el('div', 'font-size:var(--lm-w-title,14px);font-weight:700;color:' + t.mc + ';letter-spacing:1px;text-transform:uppercase;white-space:nowrap;', T('title'));
        ttl.id = 'lm-analytics-title';
        head.appendChild(ttl);
        var tabs = el('div', 'display:flex;gap:4px;flex:1 1 auto;overflow-x:auto;-webkit-overflow-scrolling:touch;');
        tabs.id = 'lm-analytics-tabs';
        TABS.forEach(function (x) {
            var b = btn(tabText(x), 'white-space:nowrap;', function () { tab = x[0]; paint(); });
            b.id = 'lm-analytics-tab-' + x[0];
            b.setAttribute('data-tab', x[0]);
            tabs.appendChild(b);
        });
        head.appendChild(tabs);
        /* 36 px close target for touch */
        var x = btn('✕', 'flex:0 0 auto;width:var(--lm-w-x,36px);height:var(--lm-w-x,36px);padding:0;font-size:18px;line-height:1;color:' + t.tc2 + ';background:var(--lm-w-btn,rgba(255,255,255,0.05));border:0;', close);
        x.id = 'lm-analytics-close';
        x.title = closeText();
        x.setAttribute('aria-label', closeText());
        head.appendChild(x);
        md.appendChild(head);
        var body = el('div', 'padding:var(--lm-w-pad,6px 10px 10px);overflow:auto;-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:0;');
        body.id = 'lm-analytics-body';
        md.appendChild(body);
        window.addEventListener('keydown', onKey, true);
        document.body.appendChild(md);
        paint();
    }
    /* History: the match history list (ogario.v4.js _lmMatchHistoryPaint, its own texts), once a window of its own */
    var TABS = [['dash', 'tabDash'], ['history', 'matchHistory'], ['heat', 'tabHeat']];
    function tabText(x) {
        if (x[0] !== 'history') return T(x[1]);
        var s = typeof window.lmT === 'function' ? window.lmT(x[1]) : '';
        return s && s !== x[1] ? s : 'Match history';
    }
    /* the header texts again after a language change (the body is drawn again by paint) */
    function relabel() {
        if (!md) return;
        md.setAttribute('aria-label', T('title'));
        md.dir = langDir();
        var ttl = md.querySelector('#lm-analytics-title');
        if (ttl) ttl.textContent = T('title');
        TABS.forEach(function (x) { var b = md.querySelector('#lm-analytics-tab-' + x[0]); if (b) b.textContent = tabText(x); });
        var c = md.querySelector('#lm-analytics-close');
        if (c) { c.title = closeText(); c.setAttribute('aria-label', closeText()); }
    }
    function paint() {
        if (!md) return;
        var t = theme();
        var tabs = md.querySelectorAll('[data-tab]');
        for (var i = 0; i < tabs.length; i++) {
            var on = tabs[i].getAttribute('data-tab') === tab;
            tabs[i].style.background = on ? t.mc : 'rgba(255,255,255,0.06)';
            tabs[i].style.color = on ? t.pc : t.tc;
            tabs[i].style.fontWeight = on ? '700' : '400';
            tabs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        var body = md.querySelector('#lm-analytics-body');
        while (body.firstChild) body.removeChild(body.firstChild);
        try {
            if (tab === 'history') { if (typeof window._lmMatchHistoryPaint === 'function') window._lmMatchHistoryPaint(body); }
            else if (tab === 'heat') paintHeat(body);
            else paintDash(body);
        } catch (e) { try { console.warn('[LM Analytics] could not draw the tab:', e); } catch (e2) { } }
    }
    function note(body, text) {
        body.appendChild(el('div', 'padding:6px 8px;margin:4px 0;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.05);color:' + theme().tc2 + ';', text));
    }
    function tile(row, label, value) {
        var t = theme(), b = el('div', 'flex:1 1 120px;min-width:110px;padding:6px 8px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.05);box-sizing:border-box;');
        b.appendChild(el('div', 'font-size:11px;color:' + t.tc2 + ';', label));
        b.appendChild(el('div', 'font-size:16px;font-weight:700;color:' + t.tc + ';', value));
        row.appendChild(b);
    }
    function paintDash(body) {
        var t = theme(), games = allGames(), pb = personalBests(), a = aggregate(games, Date.now(), pb.m, pb.t);
        if (!enabled()) note(body, T('recOff'));
        if (!games.length) { note(body, T('noGames')); return; }
        var row = el('div', 'display:flex;flex-wrap:wrap;gap:6px;');
        row.id = 'lm-analytics-tiles';
        tile(row, T('games'), fmtNum(a.games));
        tile(row, T('highest'), fmtNum(a.highest));
        tile(row, typeof window.lmT === 'function' ? window.lmT('game2.stLongest') : 'game2.stLongest', fmtTime(a.longest));
        tile(row, T('avgSurv'), fmtTime(a.avgMs));
        tile(row, T('avgPeak'), fmtNum(a.avgPeak));
        tile(row, T('top10'), a.top10 === null ? '—' : pct(a.top10) + '%');
        tile(row, T('perMin'), fmtNum(a.perMin));
        tile(row, T('first'), fmtTime(a.firstMs));
        body.appendChild(row);
        section(body, T('weekChart'));
        body.appendChild(weekChart(a.weeks));
        section(body, T('thisWeek') + ' / ' + T('lastWeek'));
        var tb = el('table', 'width:100%;border-collapse:collapse;');
        var hr = el('tr');
        ['', T('thisWeek'), T('lastWeek'), T('change')].forEach(function (h) { hr.appendChild(el('th', 'text-align:left;padding:3px 6px;font-weight:400;font-size:11px;color:' + t.tc2 + ';', h)); });
        tb.appendChild(hr);
        var tw = a.thisWeek, lw = a.lastWeek;
        var diff = function (x, y) {
            if (x === null || y === null || !y) return '—';
            var d = Math.round((x - y) / y * 100);
            return (d > 0 ? '▲ +' : d < 0 ? '▼ ' : '') + d + '%';
        };
        [[T('games'), tw.games, lw.games, fmtNum], [T('avgPeak'), tw.avgPeak, lw.avgPeak, fmtNum], [T('avgSurv'), tw.avgMs, lw.avgMs, fmtTime],
         [T('top10'), tw.top10, lw.top10, function (v) { return v === null ? '—' : pct(v) + '%'; }]].forEach(function (r) {
            var tr = el('tr');
            [r[0], r[3](r[1]), r[3](r[2]), diff(r[1], r[2])].forEach(function (v, i) {
                tr.appendChild(el('td', 'padding:3px 6px;border-top:1px solid rgba(255,255,255,0.06);' + (i === 0 ? 'color:' + t.tc2 + ';' : ''), v));
            });
            tb.appendChild(tr);
        });
        body.appendChild(tb);
        var lists = el('div', 'display:flex;flex-wrap:wrap;gap:12px;');
        [[T('bestModes'), a.modes]].forEach(function (x) {
            var box = el('div', 'flex:1 1 220px;min-width:0;');
            section(box, x[0]);
            if (!x[1].length) box.appendChild(el('div', 'color:' + t.tc2 + ';', T('none')));
            x[1].forEach(function (s) {
                var line = el('div', 'display:flex;gap:6px;padding:2px 0;');
                line.appendChild(el('span', 'flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', s.name));
                line.appendChild(el('span', 'font-weight:700;', fmtNum(s.avgPeak)));
                line.appendChild(el('span', 'color:' + t.tc2 + ';white-space:nowrap;', T('gamesN', [s.n])));
                box.appendChild(line);
            });
            lists.appendChild(box);
        });
        body.appendChild(lists);
    }
    /* single-series bar chart in inline SVG: values on the bars, week dates under them, a <title>
     * per bar for hover; text uses the theme's text colours, the bars one fixed blue */
    function weekChart(weeks) {
        var t = theme(true), NS = 'http://www.w3.org/2000/svg', W = 600, H = 170, top = 18, bottom = 22, gap = 12;
        var max = Math.max(1, maxOf(weeks.map(function (w) { return w.avgPeak; })));
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('width', '100%');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', T('weekChart'));
        svg.style.cssText = 'display:block;max-height:180px;';
        svg.id = 'lm-analytics-weeks';
        var mk = function (tag, attrs, text) {
            var n = document.createElementNS(NS, tag);
            for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
            if (text !== undefined) n.textContent = text;
            svg.appendChild(n);
            return n;
        };
        var bw = (W - gap * (weeks.length + 1)) / weeks.length, base = H - bottom;
        mk('line', { x1: 0, y1: base + 0.5, x2: W, y2: base + 0.5, stroke: t.tc2, 'stroke-opacity': 0.4, 'stroke-width': 1 });
        weeks.forEach(function (w, i) {
            var x = gap + i * (bw + gap), h = w.n ? Math.max(2, (base - top) * w.avgPeak / max) : 0;
            var d = new Date(w.start), label = d.getDate() + '/' + (d.getMonth() + 1);
            if (h) {
                var r = Math.min(4, h / 2);
                var bar = mk('path', { d: 'M' + x + ',' + base + 'V' + (base - h + r) + 'Q' + x + ',' + (base - h) + ' ' + (x + r) + ',' + (base - h) + 'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + (base - h) + ' ' + (x + bw) + ',' + (base - h + r) + 'V' + base + 'Z', fill: BLUE });
                var tt = document.createElementNS(NS, 'title');
                tt.textContent = label + ': ' + fmtNum(w.avgPeak) + ' (' + T('gamesN', [w.n]) + ')';
                bar.appendChild(tt);
                mk('text', { x: x + bw / 2, y: base - h - 4, 'text-anchor': 'middle', 'font-size': 11, fill: t.tc }, fmtNum(w.avgPeak));
            } else mk('text', { x: x + bw / 2, y: base - 4, 'text-anchor': 'middle', 'font-size': 11, fill: t.tc2 }, '—');
            mk('text', { x: x + bw / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 11, fill: t.tc2 }, label);
        });
        return svg;
    }
    function rampColor(ramp, f) {
        var i = Math.min(ramp.length - 1, Math.max(0, Math.round(f * (ramp.length - 1))));
        return ramp[i];
    }
    function paintHeat(body) {
        var t = theme(), all = loadTracks();
        if (!enabled()) note(body, T('recOffShort'));
        if (!all.length) { note(body, T('noTracks')); return; }
        /* map sizes, newest first; the newest game's map is the default */
        var maps = [], count = {};
        for (var i = all.length - 1; i >= 0; i--) { var m = all[i].map; if (!count[m]) { count[m] = 0; maps.push(m); } count[m]++; }
        if (maps.indexOf(heat.map) === -1) heat.map = maps[0];
        var tracks = all.filter(function (x) { return x.map === heat.map; });
        tracks = tracks.slice(Math.max(0, tracks.length - heat.n));
        var wrap = el('div', 'display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;');
        var side = el('div', 'flex:1 1 180px;min-width:0;display:flex;flex-direction:column;gap:6px;');
        var lrow = el('div', 'display:flex;flex-wrap:wrap;gap:4px;align-items:center;');
        lrow.appendChild(el('span', 'color:' + t.tc2 + ';margin-right:2px;', T('layer')));
        ['move', 'death', 'spawn'].forEach(function (l) {
            var b = btn(T(l), heat.layer === l ? 'background:' + t.mc + ';color:' + t.pc + ';font-weight:700;' : '', function () { heat.layer = l; paint(); });
            b.setAttribute('data-layer', l);
            lrow.appendChild(b);
        });
        side.appendChild(lrow);
        var sel = function (label, opts, val, on) {
            var r = el('label', 'display:flex;gap:6px;align-items:center;'), s = el('select', 'font:inherit;font-size:var(--lm-w-fs,12px);min-height:var(--lm-w-ctl,28px);max-width:180px;color:var(--lm-tc,#000);background:var(--lm-w-field,var(--lm-pc2,#fff));border:1px solid var(--lm-pc2,rgba(255,255,255,0.2));border-radius:var(--lm-radius-s,4px);');
            r.appendChild(el('span', 'color:' + t.tc2 + ';', label));
            opts.forEach(function (o) { var op = el('option', null, o[1]); op.value = String(o[0]); if (o[0] === val) op.selected = true; s.appendChild(op); });
            s.addEventListener('change', function () { on(+s.value); paint(); });
            r.appendChild(s);
            side.appendChild(r);
            return s;
        };
        sel(T('lastN'), [[10, '10'], [25, '25'], [50, '50']], heat.n, function (v) { heat.n = v; }).id = 'lm-analytics-heat-n';
        sel(T('mapSize'), maps.map(function (m) { return [m, fmtNum(m) + ' (' + count[m] + ')']; }), heat.map, function (v) { heat.map = v; }).id = 'lm-analytics-heat-map';
        var res = heat.layer === 'move' ? 32 : 16, h = binHeat(tracks, heat.layer, res);
        side.appendChild(el('div', 'color:' + t.tc2 + ';', T('heatInfo', [tracks.length, fmtNum(h.total)])));
        var ramp = heat.layer === 'death' ? RAMP_ORANGE : RAMP_BLUE;
        var leg = el('div', 'display:flex;align-items:center;gap:6px;color:' + t.tc2 + ';font-size:11px;');
        leg.appendChild(el('span', null, T('fewer')));
        leg.appendChild(el('span', 'display:inline-block;width:90px;height:10px;border-radius:2px;background:linear-gradient(90deg,' + ramp.join(',') + ');'));
        leg.appendChild(el('span', null, T('more')));
        side.appendChild(leg);
        /* canvas fits the window: at most 320 px, less on a short phone screen */
        var avail = Math.min(320, Math.max(140, (window.innerHeight || 412) - 120), Math.max(140, (md.clientWidth || 300) - 40));
        var cv = el('canvas', 'width:' + avail + 'px;height:' + avail + 'px;flex:0 0 auto;border-radius:var(--lm-radius-s,4px);background:rgba(0,0,0,0.25);');
        cv.id = 'lm-analytics-heat';
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(avail * dpr);
        cv.height = Math.round(avail * dpr);
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', T('tabHeat') + ': ' + T(heat.layer) + ', ' + T('heatInfo', [tracks.length, h.total]));
        wrap.appendChild(cv);
        wrap.appendChild(side);
        body.appendChild(wrap);
        var ctx = cv.getContext && cv.getContext('2d');
        if (!ctx) return;
        var S = cv.width, cs = S / h.res;
        /* P1 fix #54: determine shape from all tracks, not just the last one.
         * Only use circle clip when ALL tracks come from circular maps. */
        var shape = 's';
        if (tracks.length && tracks.every(function (tr) { return tr.shape === 'c'; })) shape = 'c';
        ctx.save();
        if (shape === 'c') { ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 1, 0, Math.PI * 2); ctx.clip(); }
        for (var k = 0; k < h.cells.length; k++) {
            var v = h.cells[k];
            if (!v) continue;
            /* movement is log-scaled (a few camped cells would hide the rest); deaths and spawns linear */
            var f = heat.layer === 'move' ? Math.log(1 + v) / Math.log(1 + h.max) : v / h.max;
            ctx.fillStyle = rampColor(ramp, f);
            ctx.fillRect((k % h.res) * cs, Math.floor(k / h.res) * cs, Math.ceil(cs), Math.ceil(cs));
        }
        ctx.restore();
        ctx.strokeStyle = theme(true).tc2;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = dpr;
        ctx.beginPath();
        if (shape === 'c') ctx.arc(S / 2, S / 2, S / 2 - dpr, 0, Math.PI * 2); else ctx.rect(dpr / 2, dpr / 2, S - dpr, S - dpr);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    /* ------------------------------------------------------------------ entry points */
    /* "Analytics" button in the profile stats (#user-stats, shown by clicking the profile picture) */
    var ICON = '\ud83d\udcca ';
    function ensureButton() {
        var host = document.getElementById('user-stats');
        if (!host || document.getElementById('lm-analytics-btn')) return;
        var b = btn(ICON + T('title'), 'display:block;clear:both;margin:6px 0 0;font-size:11px;min-height:26px;', function () { open('dash'); });
        b.id = 'lm-analytics-btn';
        host.appendChild(b);
    }
    /* while recording is on, also a link under the menu footer (easy to reach on a phone); not while
     * the "Match history" link is there: that one opens this window too (History tab) */
    function ensureFooterLink(on) {
        var b = document.getElementById('lm-analytics-link');
        if (!on || document.getElementById('lm-mh-btn')) { if (b && b.parentNode) b.parentNode.removeChild(b); return; }
        if (b) return;
        var foot = document.getElementById('menu-footer');
        if (!foot || !foot.parentNode) return;
        var ref = document.getElementById('lm-session-stats');
        if (!ref || ref.parentNode !== foot.parentNode) ref = foot;
        b = el('div', 'font-size:11px;text-align:center;margin-top:2px;cursor:pointer;text-decoration:underline;opacity:.85;', ICON + T('title'));
        b.id = 'lm-analytics-link';
        b.className = 'menu-main-color';
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open('dash'); });
        ref.parentNode.insertBefore(b, ref.nextSibling);
    }
    function tick() {
        var on = enabled();
        try { setListening(on); } catch (e) { }
        try { if (on) checkSession(); } catch (e) { }
        try { if (typeof document !== 'undefined' && document.getElementById) { ensureButton(); ensureFooterLink(on); } } catch (e) { }
    }

    window.LMAnalytics = Object.freeze({
        /* the option, the listeners and the entry points again (a settings change, the Match
         * history link added or removed: ogario.v4.js _lmMatchHistoryButton) */
        sync: tick,
        open: open,
        close: close,
        isOpen: function () { return !!(md && md.parentNode); },
        /* pure parts, for the tests */
        core: Object.freeze({
            SCHEMA: SCHEMA, GRID: GRID, encodeCell: encodeCell, decodeCells: decodeCells, trackFacts: trackFacts, binHeat: binHeat,
            sanitizeGame: sanitizeGame, sanitizeTrack: sanitizeTrack, parseStore: parseStore, fromMatchHistory: fromMatchHistory,
            mergeGames: mergeGames, aggregate: aggregate, weekStart: weekStart, text: T
        })
    });
    tick();
    /* a profile, preset or import (or the switch) that changes recording or Match history */
    if (window.LMEvents && typeof window.LMEvents.on === 'function') {
        window.LMEvents.on('settingsChange', function (d) {
            if (d && (d.key === 'analytics' || d.key === 'matchHistory') && typeof setTimeout === 'function') setTimeout(tick, 0);
        });
    }
    /* language change: the open window, the profile button and the footer link follow it */
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function () {
        try {
            if (md) { relabel(); paint(); }
            if (typeof document === 'undefined' || !document.getElementById) return;
            ['lm-analytics-btn', 'lm-analytics-link'].forEach(function (id) { var n = document.getElementById(id); if (n) n.textContent = ICON + T('title'); });
        } catch (e) { }
    });
})();
