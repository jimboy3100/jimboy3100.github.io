/* Legend Mod game stats: the Dashboard, Heatmaps, Coach and Objectives views of the Replays window
 * (ogario/modules/replaystudio.js draws them with LMAnalytics.paint; its Match history view is
 * ogario.v4.js _lmMatchHistoryPaint).
 * Every game is recorded (no switch), as its replay and match history are; the views show the stored
 * games, the match history (lmMatchHistory) and the all-time personal bests (highest mass, longest
 * time alive). Practice arena lives and replay playback are never recorded.
 * Everything stays in this browser (localStorage, capped and validated on every read). No network.
 */
(function () {
    'use strict';
    if (window._lmAnalyticsLoaded) return;
    window._lmAnalyticsLoaded = true;

    /* ------------------------------------------------------------------ constants */
    var SCHEMA = 1;
    var KEY_GAMES = 'lmAnalyticsGames', KEY_TRACKS = 'lmAnalyticsTracks', KEY_GOALS = 'lmAnalyticsGoals';
    var MAX_GAMES = 500;          // game summaries kept (about 300 bytes each)
    var MAX_TRACKS = 50;          // games kept for the heatmaps
    var MAX_SAMPLES = 3600;       // position samples per game; longer lives are thinned (see sample())
    var MAX_CUSTOM = 8;           // user objectives
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
    /* linear interpolation between the closest ranks of an ascending list */
    function quantile(sorted, q) {
        if (!sorted.length) return 0;
        var p = (sorted.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p);
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (p - lo);
    }
    function sortNum(a) { return a.slice().sort(function (x, y) { return x - y; }); }
    /* rounds down to two significant digits (3456 -> 3400) so a target taken from history stays reachable */
    function niceFloor(v) {
        if (!(v > 0)) return 0;
        var mag = Math.pow(10, Math.max(0, Math.floor(Math.log(v) / Math.LN10) - 1));
        return Math.max(1, Math.floor(v / mag) * mag);
    }
    function hashStr(s) {
        var h = 2166136261;
        for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; }
        return h >>> 0;
    }
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    /* local calendar day, so the objectives change at the player's midnight */
    function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    function dayStart(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
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

    /* ------------------------------------------------------------------ Coach
     * Scores are 0-100 (null = no data for that part):
     *   survival  = 100 * (1 - e^(-minutes / 5))           1 min 18, 5 min 63, 10 min 86, 20 min 98
     *   growth    = 100 * log10(1 + rate / 50) / 2          rate = peak mass / max(minutes alive, 0.5);
     *                                                       50/min 15, 500/min 52, 5000/min and more 100
     *   splits    = 100 * (1 - 2 * average split loss)      split loss = share of the mass at the split that
     *                                                       was gone 0-5 s later (dying in that time = 100 %);
     *                                                       50 % average loss or more scores 0; null without splits
     *   movement  = 100 * (0.6 * coverage + 0.4 * (1 - min(1, edge / 0.5)))
     *                coverage = visited cells of an 8x8 map grid / min(24, 3 + 3 * minutes), at most 1;
     *                edge = share of position samples in the outer 6 % of the map; null under 5 samples
     *   retention = 100 * end mass / peak mass              end mass = mass in the last update before the death
     *   overall   = rounded average of the parts that have a value
     * Old match history games have no positions, splits or end mass: only survival and growth. */
    var PARTS = ['survival', 'growth', 'splits', 'movement', 'retention'];
    function coachScores(g) {
        var min = g.ms / 60000, s = {};
        s.survival = Math.round(100 * (1 - Math.exp(-min / 5)));
        /* P1 fix #50: cap the time denominator to 5 minutes so long domination runs
         * are not penalized. Without this, rate = peak/minutes decreases as the player
         * survives longer, even if they maintained high mass throughout. */
        var rate = g.peak / Math.max(Math.min(min, 5), 0.5);
        s.growth = Math.round(100 * clamp01(Math.log(1 + rate / 50) / Math.LN10 / 2));
        var lm = g.src === 'lm';
        s.splits = lm && g.spl > 0 ? Math.round(100 * clamp01(1 - 2 * g.splLoss)) : null;
        if (lm && g.n >= 5) {
            var cover = Math.min(1, g.cov / Math.min(24, 3 + 3 * min));
            s.movement = Math.round(100 * (0.6 * cover + 0.4 * (1 - Math.min(1, g.edge / 0.5))));
        } else s.movement = null;
        s.retention = lm && g.peak > 0 ? Math.round(100 * clamp01(g.end / g.peak)) : null;
        var have = PARTS.map(function (k) { return s[k]; }).filter(function (v) { return v !== null; });
        s.overall = have.length ? Math.round(avg(have)) : 0;
        s.rate = Math.round(rate);
        return s;
    }
    /* averages of the up to 10 games before game index i (scores, time alive, growth rate) */
    function recentAverages(games, i, count) {
        count = count || 10;
        var prev = games.slice(Math.max(0, i - count), i), out = { n: prev.length };
        var sc = prev.map(coachScores);
        PARTS.concat(['overall', 'rate']).forEach(function (k) {
            var v = sc.map(function (s) { return s[k]; }).filter(function (x) { return x !== null; });
            out[k] = v.length ? Math.round(avg(v)) : null;
        });
        out.ms = prev.length ? Math.round(avg(prev.map(function (g) { return g.ms; }))) : null;
        return out;
    }
    function fmtTime(ms) {
        var s = Math.max(0, Math.round((+ms || 0) / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
        s = s % 60;
        return (h ? h + ':' + pad2(m) : m) + ':' + pad2(s);
    }
    function fmtNum(n) { n = Math.round(+n || 0); return n.toLocaleString ? n.toLocaleString('en-US') : String(n); }
    function pct(f) { return Math.round(f * 100); }
    /* Suggestions, deterministic: problems in a fixed order (at most 3), then good news, then a tip for
     * the lowest part, so a report has 2-4 lines. Each line is [key, values] for the text table. */
    function coachSuggestions(g, s, rec) {
        var bad = [], good = [], min = g.ms / 60000, lm = g.src === 'lm';
        var finalLoss = lm && g.peak >= 200 && g.loss20 >= 0.25;
        if (finalLoss) bad.push(['sgFinal', [pct(g.loss20)]]);
        if (lm && g.spl >= 2 && g.splLoss >= 0.2) bad.push(['sgSplits', [g.splBad, g.spl, pct(g.splLoss)]]);
        if (lm && g.n >= 20 && g.edge >= 0.35) bad.push(['sgEdge', [pct(g.edge)]]);
        if (lm && g.n >= 20 && min >= 3 && g.cov / Math.min(24, 3 + 3 * min) < 0.4) bad.push(['sgCoverage', [Math.round(g.cov / 64 * 100)]]);
        if (rec.n >= 3 && rec.ms > 0 && g.ms < 0.6 * rec.ms) bad.push(['sgShort', [pct(1 - g.ms / rec.ms), fmtTime(rec.ms)]]);
        if (rec.n >= 3 && rec.rate > 0 && s.rate < 0.7 * rec.rate) bad.push(['sgGrowth', [fmtNum(s.rate), fmtNum(rec.rate)]]);
        if (lm && s.retention !== null && s.retention < 50 && !finalLoss) bad.push(['sgRetention', [s.retention]]);
        if (lm && g.first >= 30000) good.push(['sgFirst', [fmtTime(g.first)]]);
        if (rec.n >= 3 && rec.overall !== null && s.overall >= rec.overall + 10) good.push(['sgBetter', [s.overall - rec.overall]]);
        var out = bad.slice(0, 3).concat(good).slice(0, 4);
        if (out.length < 2) {
            var low = null;
            PARTS.forEach(function (k) { if (s[k] !== null && (low === null || s[k] < s[low])) low = k; });
            var tip = low && ('sgTip' + low.charAt(0).toUpperCase() + low.slice(1));
            if (tip && !out.some(function (x) { return x[0] === tip; })) out.push([tip, []]);
        }
        if (out.length < 2) out.push(['sgKeep', []]);
        return out;
    }

    /* ------------------------------------------------------------------ objectives
     * Objective: { id, type, target } (daily) or { id, type, target, since } (custom); big also has mass.
     * Types: mass (reach target peak mass in one game), survive (live target minutes in one game),
     * top (reach place target or better), games (play target games), beatAvg (peak mass above target,
     * the average peak when the objective was made), big (target games that each reach mass),
     * playtime (target minutes alive in all games together). Progress counts games from the start of
     * the day (daily) or from `since` (custom). */
    var GOAL_TYPES = ['mass', 'survive', 'top', 'games', 'beatAvg', 'big', 'playtime'];
    var GOAL_MAX = { mass: 1e7, survive: 360, top: 100, games: 100, beatAvg: 1e9, big: 100, playtime: 1440 };
    function sanitizeGoal(r, custom) {
        if (!r || typeof r !== 'object' || GOAL_TYPES.indexOf(r.type) === -1) return null;
        var target = Number(r.target);
        if (!(target >= 1)) return null;
        target = Math.round(Math.min(target, GOAL_MAX[r.type]));
        var g = { id: str(r.id, 40) || (r.type + ':' + target), type: r.type, target: target };
        if (r.type === 'big') {
            g.mass = Math.round(num(r.mass, 0, 1e9, 0));
            if (!(g.mass >= 1)) return null;
        }
        if (custom) g.since = num(r.since, 0, 4102444800000, 0);
        return g;
    }
    /* Daily objectives for experienced players in long sessions, from their own last 50 games (and the
     * all-time bests), so they are a real step up and never trivially easy:
     *   big      = (median games per day) / 2 games, 3-10, each reaching the median peak mass (2,500+)
     *   mass     = peak mass of the better quarter of games, at least 1.25 x the average peak, at most
     *              the best peak so far, 5,000+
     *   survive  = minutes alive of the better quarter of games, at least 5
     *   playtime = median minutes alive per day (days with games), in steps of 5, at least 30
     *   top      = smallest of 1/3/5 not below the better quarter of best places, only when 25 % or
     *              more of the recorded games reached the leaderboard
     * "big" is always one of the three; the other two rotate with the date. Under 5 games the targets
     * come from the all-time bests (pb { m, t }) with the same minimums. */
    var DAILY_RECENT = 50, MIN_MASS = 5000, MIN_BIG_MASS = 2500, MIN_BIG_N = 3, MIN_SURVIVE = 5, MIN_PLAYTIME = 30;
    function generateDaily(games, key, pb) {
        var recent = games.slice(-DAILY_RECENT);
        pb = pb || {};
        var pbM = num(pb.m, 0, 1e9, 0), pbMin = num(pb.t, 0, 6 * 3600000, 0) / 60000;
        var mk = function (type, target, mass) {
            var g = { id: key + ':' + type, type: type, target: Math.max(1, Math.round(Math.min(target, GOAL_MAX[type]))) };
            if (type === 'big') g.mass = Math.max(1, Math.round(mass));
            return g;
        };
        if (recent.length < 5) {
            var best = Math.max(pbM, maxOf(recent.map(function (g) { return g.peak; })));
            var longest = Math.max(pbMin, maxOf(recent.map(function (g) { return g.ms / 60000; })));
            return [mk('big', MIN_BIG_N, Math.max(MIN_BIG_MASS, niceFloor(best * 0.35))),
                mk('survive', Math.max(MIN_SURVIVE, Math.floor(longest * 0.6))),
                mk('mass', Math.max(MIN_MASS, niceFloor(best * 0.7)))];
        }
        var peaks = sortNum(recent.map(function (g) { return g.peak; }));
        var mins = sortNum(recent.map(function (g) { return g.ms / 60000; }));
        var perDay = {}, playDay = {}, days = [];
        recent.forEach(function (g) {
            var k = dayKey(g.t);
            if (!perDay[k]) { perDay[k] = 0; playDay[k] = 0; days.push(k); }
            perDay[k]++;
            playDay[k] += g.ms / 60000;
        });
        var bigN = Math.max(MIN_BIG_N, Math.min(10, Math.round(quantile(sortNum(days.map(function (k) { return perDay[k]; })), 0.5) / 2)));
        var bigMass = Math.max(MIN_BIG_MASS, niceFloor(quantile(peaks, 0.5)));
        var cand = [];
        var massCap = Math.max(pbM, peaks[peaks.length - 1]);
        cand.push(mk('mass', Math.max(MIN_MASS, niceFloor(Math.min(massCap, Math.max(quantile(peaks, 0.75), avg(peaks) * 1.25))))));
        cand.push(mk('survive', Math.max(MIN_SURVIVE, Math.floor(quantile(mins, 0.75)))));
        cand.push(mk('playtime', Math.max(MIN_PLAYTIME, Math.floor(quantile(sortNum(days.map(function (k) { return playDay[k]; })), 0.5) / 5) * 5)));
        var lm = recent.filter(function (g) { return g.src === 'lm'; });
        var pos = sortNum(lm.map(function (g) { return g.bestPos; }).filter(function (p) { return p > 0; }));
        if (lm.length && pos.length >= Math.max(2, lm.length * 0.25)) {
            var q = quantile(pos, 0.25), t = 5;
            [1, 3, 5].some(function (x) { if (x >= q) { t = x; return true; } return false; });
            cand.push(mk('top', t));
        }
        var rot = hashStr(key) % cand.length, out = [mk('big', bigN, bigMass)];
        for (var i = 0; i < cand.length && out.length < 3; i++) out.push(cand[(rot + i) % cand.length]);
        return out;
    }
    function goalProgress(goal, games, from) {
        var list = games.filter(function (g) { return g.t >= from; }), v = 0, done = false, frac = 0;
        if (goal.type === 'games') { v = list.length; frac = v / goal.target; done = v >= goal.target; }
        else if (goal.type === 'survive') { v = Math.floor(maxOf(list.map(function (g) { return g.ms; })) / 6000) / 10; frac = v / goal.target; done = v >= goal.target; }
        else if (goal.type === 'big') { v = list.filter(function (g) { return g.peak >= goal.mass; }).length; frac = v / goal.target; done = v >= goal.target; }
        else if (goal.type === 'playtime') {
            v = 0;
            list.forEach(function (g) { v += g.ms; });
            v = Math.floor(v / 6000) / 10; frac = v / goal.target; done = v >= goal.target;
        }
        else if (goal.type === 'top') {
            v = 0;
            list.forEach(function (g) { if (g.src === 'lm' && g.bestPos > 0 && (!v || g.bestPos < v)) v = g.bestPos; });
            done = v > 0 && v <= goal.target;
            frac = done ? 1 : 0;
        } else {
            v = maxOf(list.map(function (g) { return g.peak; }));
            frac = v / goal.target;
            done = goal.type === 'beatAvg' ? v > goal.target : v >= goal.target;
            if (!done && frac >= 1) frac = 0.99;
        }
        return { value: v, target: goal.target, frac: clamp01(frac), done: done };
    }

    /* ------------------------------------------------------------------ text
     * From the language packs (developers/i18n/src, keys modules.analytics.*): the chosen language,
     * else English. vals fill {0} {1} {2}. */
    var TP = 'modules.analytics.';
    function T(key, vals) { return typeof window.lmT === 'function' ? window.lmT(TP + key, vals) : key; }
    /* texts by their full key (developers/i18n/src/pkg-rpm.json) */
    function TF(key, vals) { return typeof window.lmT === 'function' ? window.lmT(key, vals) : key; }
    /* dates in the chosen language (zh is Traditional Chinese) */
    function locale() { var c = window.LMi18n && window.LMi18n.lang ? window.LMi18n.lang() : 'en'; return c === 'zh' ? 'zh-TW' : c; }
    function goalText(goal) {
        var t = goal.target;
        if (goal.type === 'mass') return T('gMass', [fmtNum(t)]);
        if (goal.type === 'survive') return T('gSurvive', [t]);
        if (goal.type === 'top') return t === 1 ? T('gTop1') : T('gTop', [t]);
        if (goal.type === 'games') return T('gGames', [t]);
        if (goal.type === 'big') return TF('pkg.coachobj.big', [t, fmtNum(goal.mass)]);
        if (goal.type === 'playtime') return TF('pkg.coachobj.playtime', [t]);
        return T('gBeatAvg', [fmtNum(t)]);
    }
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
    function loadGoals() {
        var s = { v: SCHEMA, day: '', daily: [], custom: [], done: {} };
        try {
            var o = JSON.parse(lsGet(KEY_GOALS));
            if (o && o.v === SCHEMA) {
                s.day = /^\d{4}-\d\d-\d\d$/.test(o.day) ? o.day : '';
                s.daily = (Array.isArray(o.daily) ? o.daily : []).slice(0, 5).map(function (g) { return sanitizeGoal(g, false); }).filter(Boolean);
                s.custom = (Array.isArray(o.custom) ? o.custom : []).slice(0, MAX_CUSTOM).map(function (g) { return sanitizeGoal(g, true); }).filter(Boolean);
                if (o.done && typeof o.done === 'object') Object.keys(o.done).slice(0, 50).forEach(function (k) { if (o.done[k] === 1) s.done[k.slice(0, 40)] = 1; });
            }
        } catch (e) { }
        return s;
    }
    function saveGoals(s) { try { window.localStorage.setItem(KEY_GOALS, JSON.stringify(s)); } catch (e) { } }
    /* a new day replaces the daily objectives and forgets their completion marks; they are made
     * from the games before today, so the first game of the day does not change them */
    function ensureDaily(s, games, now) {
        var key = dayKey(now);
        if (s.day === key && s.daily.length) return false;
        /* P1 fix #53: backward clock skew (e.g. NTP correction) could make
         * dayKey() return an earlier date, wiping today's objectives. Only
         * regenerate when the new key is strictly later or the first ever. */
        if (s.day && key < s.day) return false;
        s.daily.forEach(function (g) { delete s.done[g.id]; });
        s.day = key;
        var start = dayStart(now);
        s.daily = generateDaily(games.filter(function (g) { return g.t < start; }), key, personalBests());
        return true;
    }
    function goalFrom(goal, custom, now) { return custom ? goal.since : dayStart(now); }

    /* ------------------------------------------------------------------ recorder */
    var life = null, listening = false;
    function lm() { return window.legendmod || null; }
    /* Own position as a 0-1 share of the map, the same projection as the minimap:
     * (playerX + mapOffsetX + mapOffset) / mapSize, without mapOffset on Expanding Land.
     * The position is the core's lmMyPosition (the player you control, not the camera, which
     * follows a multibox unit or the middle of both); playerX/Y with an older core. */
    function curPos() {
        var o = lm();
        if (!o) return null;
        var size = +o.mapSize;
        if (!(size > 0)) return null;
        var me = typeof window.lmMyPosition === 'function' ? window.lmMyPosition() : null;
        var px = me ? me.x : o.playerX, py = me ? me.y : o.playerY;
        var off = o.isLegendWorld ? 0 : (+o.mapOffset || 0);
        var x = (+px + (+o.mapOffsetX || 0) + off) / size, y = (+py + (+o.mapOffsetY || 0) + off) / size;
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
    function onSpawn(e) {
        if (notLive(e)) { life = null; return; }
        beginLife(+e.time || Date.now());
    }
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
        /* a multibox unit's split (unit: its number): the life measured here is the main player's */
        if (e && e.unit) return;
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
         * end at 0 and the Coach's retention score a constant 0. Retention compares the peak
         * with what was still there right before the final hit. */
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
    function toast(kind, html, onclick) {
        if (!window.toastr) return;
        try { window.toastr[kind](html, '', onclick ? { onclick: onclick } : undefined); } catch (e) { }
    }
    /* the Coach and Objectives views live in the Replays window (ogario/modules/replaystudio.js) */
    function open(which) {
        if (typeof window.lmReplayStudio === 'function') window.lmReplayStudio('view', which);
    }
    /* after each recorded game: the Coach toast, then one toast per objective completed for the first time */
    function afterGame(g) {
        var games = allGames();
        var i = games.length - 1;
        for (var j = games.length - 1; j >= 0; j--) if (games[j].t === g.t && games[j].src === 'lm') { i = j; break; }
        var s = coachScores(g), rec = recentAverages(games, i);
        var tips = coachSuggestions(g, s, rec);
        toast('info', '<b>📊</b> ' + esc(T('coachToast', [s.overall, T(tips[0][0], tips[0][1])])) + ' <i>' + esc(T('coachToastMore')) + '</i>',
            function () { open('coach'); });
        var st = loadGoals(), now = Date.now();
        ensureDaily(st, games, now);
        st.daily.concat(st.custom).forEach(function (goal) {
            var custom = st.custom.indexOf(goal) !== -1;
            if (st.done[goal.id]) return;
            if (goalProgress(goal, games, goalFrom(goal, custom, now)).done) {
                st.done[goal.id] = 1;
                toast('success', '<b>🎯</b> ' + esc(T('goalDone', [goalText(goal)])), function () { open('goals'); });
            }
        });
        saveGoals(st);
        /* a shown view draws again with the game that just ended */
        if (shown && shown.parentNode && VIEWS[shown._lmAnView]) redraw();
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

    /* ------------------------------------------------------------------ views */
    var VIEWS = { dash: 1, heat: 1, coach: 1, goals: 1 };
    var shown = null, coachIdx = -1, heat = { layer: 'move', n: 25, map: 0 };
    /* theme() gives CSS (var(--lm-x, current) so an open window follows a theme change);
     * theme(true) gives the resolved colours for SVG attributes and canvas */
    function theme(raw) {
        /* the theme as shown (an expansion's colours while it is on), not only the saved one */
        var ds = (typeof window.lmThemeEffective === 'function' && window.lmThemeEffective()) || window.defaultSettings || {};
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
    /* draws the Dashboard ('dash'), Heatmaps ('heat'), Coach ('coach') or Objectives ('goals') into
     * host; paint() draws the last one again. The Replays window sets host._lmAnView to null when it
     * shows something else there. */
    function paint(host, which, fresh) {
        if (host) shown = host;
        host = shown;
        if (!host) return;
        /* the Coach opened from its view or its toast starts at the newest game */
        if (which === 'coach' && fresh) coachIdx = -1;
        if (which) host._lmAnView = which;
        which = host._lmAnView;
        if (!VIEWS[which]) return;
        /* Objectives drawn again (a language change, a game that ends): the objective being typed,
         * its type, the focus and the scroll stay (they were lost mid-typing) */
        var keep = null, gt = host.querySelector('#lm-analytics-goal-type'), gn = host.querySelector('#lm-analytics-goal-target');
        if (which === 'goals' && gt && gn) keep = { type: gt.value, n: gn.value, focus: document.activeElement === gn ? gn.id : document.activeElement === gt ? gt.id : '', y: host.scrollTop };
        while (host.firstChild) host.removeChild(host.firstChild);
        try {
            if (which === 'heat') paintHeat(host);
            else if (which === 'coach') paintCoach(host);
            else if (which === 'goals') paintGoals(host);
            else paintDash(host);
        } catch (e) { try { console.warn('[LM stats] could not draw the view:', e); } catch (e2) { } }
        if (keep) restoreGoalForm(host, keep);
    }
    function restoreGoalForm(body, k) {
        var gt = body.querySelector('#lm-analytics-goal-type'), gn = body.querySelector('#lm-analytics-goal-target');
        if (!gt || !gn) return;
        if (gt.value !== k.type && gt.querySelector('option[value="' + k.type + '"]')) {
            gt.value = k.type;
            try { gt.dispatchEvent(new Event('change')); } catch (e) { }
        }
        gn.value = k.n;
        body.scrollTop = k.y;
        var f = k.focus && body.querySelector('#' + k.focus);
        if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    }
    function redraw() { paint(null); }
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
        if (!games.length) { note(body, TF('pkg.rpm.noGames')); return; }
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
        if (!all.length) { note(body, TF('pkg.rpm.noTracks')); return; }
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
            var b = btn(T(l), heat.layer === l ? 'background:' + t.mc + ';color:' + t.pc + ';font-weight:700;' : '', function () { heat.layer = l; redraw(); });
            b.setAttribute('data-layer', l);
            lrow.appendChild(b);
        });
        side.appendChild(lrow);
        var sel = function (label, opts, val, on) {
            var r = el('label', 'display:flex;gap:6px;align-items:center;'), s = el('select', 'font:inherit;font-size:var(--lm-w-fs,12px);min-height:var(--lm-w-ctl,28px);max-width:180px;color:var(--lm-tc,#000);background:var(--lm-w-field,var(--lm-pc2,#fff));border:1px solid var(--lm-pc2,rgba(255,255,255,0.2));border-radius:var(--lm-radius-s,4px);');
            r.appendChild(el('span', 'color:' + t.tc2 + ';', label));
            opts.forEach(function (o) { var op = el('option', null, o[1]); op.value = String(o[0]); if (o[0] === val) op.selected = true; s.appendChild(op); });
            s.addEventListener('change', function () { on(+s.value); redraw(); });
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
        var avail = Math.min(320, Math.max(140, (window.innerHeight || 412) - 120), Math.max(140, (body.clientWidth || 300) - 20));
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
    function deltaText(v, ref) { var d = Math.round(v - ref); return (d > 0 ? '+' : d < 0 ? '−' : '±') + Math.abs(d); }
    function paintCoach(body) {
        var t = theme(), games = allGames();
        var idxs = [];
        games.forEach(function (g, i) { if (g.src === 'lm') idxs.push(i); });
        if (!idxs.length) { note(body, T('coachNoneYet')); return; }
        idxs = idxs.slice(-50);
        if (coachIdx < 0 || coachIdx >= idxs.length) coachIdx = idxs.length - 1;
        var gi = idxs[coachIdx], g = games[gi], s = coachScores(g), rec = recentAverages(games, gi);
        var nav = el('div', 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;');
        var pv = btn('◀', 'min-width:36px;', function () { coachIdx = Math.max(0, coachIdx - 1); paint(); });
        pv.title = T('prev'); pv.setAttribute('aria-label', T('prev')); pv.disabled = coachIdx === 0;
        var nx = btn('▶', 'min-width:36px;', function () { coachIdx = Math.min(idxs.length - 1, coachIdx + 1); paint(); });
        nx.title = T('next'); nx.setAttribute('aria-label', T('next')); nx.disabled = coachIdx === idxs.length - 1;
        nav.appendChild(pv);
        nav.appendChild(nx);
        var d = new Date(g.t);
        nav.appendChild(el('div', 'flex:1 1 auto;min-width:0;color:' + t.tc2 + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
            d.toLocaleString(locale()) + ' · ' + fmtNum(g.peak) + ' · ' + fmtTime(g.ms) + (g.srv ? ' · ' + g.srv : '')));
        body.appendChild(nav);
        var wrap = el('div', 'display:flex;flex-wrap:wrap;gap:12px;margin-top:6px;');
        var left = el('div', 'flex:1 1 260px;min-width:0;');
        var big = el('div', 'display:flex;align-items:baseline;gap:8px;margin-bottom:4px;');
        big.id = 'lm-analytics-overall';
        big.appendChild(el('span', 'font-size:12px;color:' + t.tc2 + ';', T('overall')));
        big.appendChild(el('span', 'font-size:26px;font-weight:700;color:' + t.mc + ';', String(s.overall)));
        big.appendChild(el('span', 'color:' + t.tc2 + ';', '/100'));
        if (rec.overall !== null) big.appendChild(el('span', 'color:' + t.tc2 + ';', deltaText(s.overall, rec.overall) + ' ' + T('vsAvg')));
        left.appendChild(big);
        /* one bar per part; the thin tick on the track is the recent average, the number on the right the difference */
        PARTS.forEach(function (k) {
            var row = el('div', 'display:flex;align-items:center;gap:6px;padding:2px 0;');
            row.setAttribute('data-part', k);
            row.appendChild(el('span', 'flex:0 0 112px;color:' + t.tc2 + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', T(k)));
            var track = el('span', 'flex:1 1 auto;height:8px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.08);position:relative;overflow:hidden;');
            if (s[k] !== null) track.appendChild(el('span', 'position:absolute;left:0;top:0;bottom:0;width:' + s[k] + '%;background:' + BLUE + ';border-radius:var(--lm-radius-s,4px);'));
            if (rec[k] !== null && rec[k] !== undefined) track.appendChild(el('span', 'position:absolute;top:-1px;bottom:-1px;width:2px;left:calc(' + rec[k] + '% - 1px);background:' + t.tc + ';opacity:.7;'));
            row.appendChild(track);
            row.appendChild(el('span', 'flex:0 0 28px;text-align:right;font-weight:700;', s[k] === null ? '—' : String(s[k])));
            row.appendChild(el('span', 'flex:0 0 36px;text-align:right;color:' + t.tc2 + ';', s[k] !== null && rec[k] !== null && rec[k] !== undefined ? deltaText(s[k], rec[k]) : ''));
            left.appendChild(row);
        });
        wrap.appendChild(left);
        var right = el('div', 'flex:1 1 260px;min-width:0;');
        section(right, T('suggestions'));
        var ul = el('ul', 'margin:0;padding-left:18px;');
        ul.id = 'lm-analytics-tips';
        coachSuggestions(g, s, rec).forEach(function (x) { ul.appendChild(el('li', 'margin:2px 0;', T(x[0], x[1]))); });
        right.appendChild(ul);
        wrap.appendChild(right);
        body.appendChild(wrap);
    }
    function goalRow(list, goal, prog, onDelete) {
        var t = theme(), row = el('div', 'display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid rgba(255,255,255,0.06);');
        row.className = 'lm-analytics-goal';
        var mid = el('div', 'flex:1 1 auto;min-width:0;');
        mid.appendChild(el('div', 'overflow:hidden;text-overflow:ellipsis;' + (prog.done ? 'color:' + t.mc + ';font-weight:700;' : ''), (prog.done ? '✓ ' : '') + goalText(goal)));
        var bar = el('div', 'height:8px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.08);overflow:hidden;margin-top:2px;');
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-valuenow', String(pct(prog.frac)));
        bar.appendChild(el('div', 'height:100%;width:' + pct(prog.frac) + '%;background:' + (prog.done ? t.mc : BLUE) + ';border-radius:var(--lm-radius-s,4px);'));
        mid.appendChild(bar);
        row.appendChild(mid);
        var val = goal.type === 'top' ? (prog.value ? '#' + prog.value : '—') + ' / #' + goal.target
            : goal.type === 'survive' || goal.type === 'playtime' ? T('surviveVal', [prog.value, goal.target]) : fmtNum(prog.value) + ' / ' + fmtNum(goal.target);
        row.appendChild(el('div', 'flex:0 0 auto;color:' + t.tc2 + ';white-space:nowrap;', val));
        if (onDelete) {
            var x = btn('✕', 'min-width:32px;padding:0;', onDelete);
            x.title = T('delete');
            x.setAttribute('aria-label', T('delete'));
            row.appendChild(x);
        }
        list.appendChild(row);
    }
    function paintGoals(body) {
        var t = theme(), games = allGames(), now = Date.now(), st = loadGoals();
        if (ensureDaily(st, games, now)) saveGoals(st);
        section(body, T('today'));
        var daily = el('div');
        daily.id = 'lm-analytics-daily';
        st.daily.forEach(function (goal) { goalRow(daily, goal, goalProgress(goal, games, goalFrom(goal, false, now))); });
        body.appendChild(daily);
        section(body, T('yours'));
        var custom = el('div');
        custom.id = 'lm-analytics-custom';
        st.custom.forEach(function (goal) {
            goalRow(custom, goal, goalProgress(goal, games, goalFrom(goal, true, now)), function () {
                var s2 = loadGoals();
                s2.custom = s2.custom.filter(function (x) { return x.id !== goal.id; });
                delete s2.done[goal.id];
                saveGoals(s2);
                paint();
            });
        });
        body.appendChild(custom);
        var form = el('div', 'display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px;');
        var type = el('select', 'font:inherit;font-size:var(--lm-w-fs,12px);min-height:var(--lm-w-ctl,28px);color:var(--lm-tc,#000);background:var(--lm-w-field,var(--lm-pc2,#fff));border:1px solid var(--lm-pc2,rgba(255,255,255,0.2));border-radius:var(--lm-radius-s,4px);');
        type.id = 'lm-analytics-goal-type';
        [['mass', 'tMass'], ['survive', 'tSurvive'], ['top', 'tTop'], ['games', 'tGames'], ['beatAvg', 'tBeatAvg']].forEach(function (o) {
            var op = el('option', null, T(o[1])); op.value = o[0]; type.appendChild(op);
        });
        var inp = el('input', 'font:inherit;font-size:var(--lm-w-fs,12px);min-height:var(--lm-w-ctl,28px);width:90px;color:var(--lm-tc,#000);background:var(--lm-w-field,var(--lm-pc2,#fff));border:1px solid var(--lm-pc2,rgba(255,255,255,0.2));border-radius:var(--lm-radius-s,4px);padding:0 6px;box-sizing:border-box;');
        inp.id = 'lm-analytics-goal-target';
        inp.type = 'number';
        inp.min = '1';
        inp.inputMode = 'numeric';
        /* "beat average" takes the current average peak as its target, so it needs no number */
        var sync = function () { inp.style.display = type.value === 'beatAvg' ? 'none' : ''; inp.max = String(GOAL_MAX[type.value]); };
        type.addEventListener('change', sync);
        sync();
        var add = btn(T('add'), '', function () {
            var s2 = loadGoals();
            if (s2.custom.length >= MAX_CUSTOM) { toast('warning', esc(T('customFull'))); return; }
            var target = type.value === 'beatAvg' ? Math.round(avg(games.slice(-30).map(function (g) { return g.peak; }))) : Math.round(+inp.value);
            var goal = sanitizeGoal({ id: 'c' + Date.now().toString(36), type: type.value, target: target, since: Date.now() }, true);
            /* "beat average" has no field to focus: without games it has no average yet, say so */
            if (!goal && type.value === 'beatAvg') { toast('info', esc(TF('pkg.rpm.noGames'))); return; }
            if (!goal) { inp.focus(); return; }
            s2.custom.push(goal);
            saveGoals(s2);
            /* added: the field starts empty again (a redraw keeps what is typed) */
            inp.value = '';
            paint();
        });
        add.id = 'lm-analytics-goal-add';
        form.appendChild(type);
        form.appendChild(inp);
        form.appendChild(add);
        body.appendChild(form);
        body.appendChild(el('div', 'margin-top:8px;font-size:11px;color:' + t.tc2 + ';', T('goalsNote')));
    }

    /* ------------------------------------------------------------------ recording (always on) */
    function tick() {
        try { setListening(true); } catch (e) { }
        try { checkSession(); } catch (e) { }
    }

    window.LMAnalytics = Object.freeze({
        /* the option and the listeners again (a settings change) */
        sync: tick,
        /* the Dashboard, Heatmaps, Coach or Objectives into an element (the Replays window) */
        paint: paint,
        /* pure parts, for the tests */
        core: Object.freeze({
            SCHEMA: SCHEMA, GRID: GRID, encodeCell: encodeCell, decodeCells: decodeCells, trackFacts: trackFacts, binHeat: binHeat,
            sanitizeGame: sanitizeGame, sanitizeTrack: sanitizeTrack, parseStore: parseStore, fromMatchHistory: fromMatchHistory,
            mergeGames: mergeGames, aggregate: aggregate, weekStart: weekStart, coachScores: coachScores, recentAverages: recentAverages,
            coachSuggestions: coachSuggestions, generateDaily: generateDaily, goalProgress: goalProgress, sanitizeGoal: sanitizeGoal,
            niceFloor: niceFloor, quantile: quantile, dayKey: dayKey, ensureDaily: ensureDaily, goalText: goalText, text: T
        })
    });
    tick();
    /* language change: a shown view follows it */
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function () {
        try { if (shown && shown.parentNode) redraw(); } catch (e) { }
    });
})();
