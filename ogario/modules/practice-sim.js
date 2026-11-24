/* Practice arena simulation for Legend Mod: a small agar-like world that runs in the browser
 * with no server. ogario/modules/practice.js drives it: the world state is encoded as the
 * same binary packets a MultiOgar-style private server sends (opcodes 16, 18, 32, 49, 64),
 * fed to the normal packet handler, and the packets the client sends (mouse 16, split 17,
 * feed 21, spawn 0) are decoded back into input.
 *
 * Everything here is pure and deterministic for a seed (no Math.random, no timers, no DOM),
 * so it also runs in Node: developers/tests/practice.js.
 *
 * The physics is a simplified MultiOgar: speed 2.2 * radius^-0.439 per 40 ms tick, split and
 * feed boost of 780 units that loses 1/9 per tick, merge after base + 0.0777% of the mass in
 * seconds (30 s base = agar.io's 30 s + 2.33% of the mass), a cell eats another 1.25x its mass
 * once its centre is inside (radius - other radius / 3), viruses of 100 mass pop cells into up
 * to 16 pieces and split after being fed 7 times. */
(function (root) {
    'use strict';
    if (root && root.LMPracticeSim) return;

    var TICK_MS = 40;
    var MAX_CELLS = 16;
    var MIN_SPLIT = 36;        /* mass a cell needs to split or feed */
    var EJECT_MASS = 14;       /* mass of one ejected blob */
    var EJECT_LOSS = 18;       /* mass a cell loses per feed */
    var BOOST = 780;           /* split / feed / virus shot boost distance */
    var VIRUS_MASS = 100;
    var VIRUS_FEED = 7;
    var FOOD_MASS = 1;
    var MAX_MASS = 22500;
    var EAT_RATIO = 1.25;
    var HUMAN = 0;
    var K_PLAYER = 0, K_FOOD = 1, K_VIRUS = 2, K_EJECT = 3;

    /* ------------------------------------------------------------------ */
    /* Random numbers (mulberry32): the only source of randomness          */
    /* ------------------------------------------------------------------ */
    function rng(seed) {
        var a = (seed >>> 0) || 1;
        return function () {
            a = (a + 0x6D2B79F5) >>> 0;
            var t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    function radius(m) { return Math.sqrt(m * 100); }
    function speedOf(r) { return 2.2 * Math.pow(Math.max(r, 1), -0.439) * 40; }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function isNum(v) { return typeof v === 'number' && isFinite(v); }

    /* ------------------------------------------------------------------ */
    /* Settings                                                            */
    /* ------------------------------------------------------------------ */
    var SPLIT_MODES = ['single', 'double', 'pop', 'trick'];
    var FIELDS = {
        seed: { min: 1, max: 999999, def: 1234 },
        startMass: { min: 10, max: 20000, def: 150 },
        oppMass: { min: 10, max: 20000, def: 150 },
        bots: { min: 0, max: 30, def: 8 },
        difficulty: { min: 1, max: 4, def: 2 },
        viruses: { min: 0, max: 4, def: 2 },
        mapSize: { min: 2000, max: 14000, def: 6000 },
        latency: { min: 0, max: 500, def: 0 },
        duration: { min: 10, max: 600, def: 120 },
        mergeSecs: { min: 0, max: 30, def: 30 },
        rounds: { min: 3, max: 20, def: 10 }
    };

    /* exercises: the settings each one uses (others keep its defaults) and its defaults */
    var EXERCISES = {
        free: { uses: ['startMass', 'oppMass', 'bots', 'difficulty', 'viruses', 'mapSize', 'duration', 'mergeSecs'], defaults: { startMass: 150, oppMass: 150, bots: 10, difficulty: 2, viruses: 2, mapSize: 6000, duration: 180, mergeSecs: 30 }, decay: true },
        split: { uses: ['splitMode', 'startMass', 'rounds', 'difficulty'], defaults: { startMass: 1000, rounds: 10, difficulty: 2, bots: 0, viruses: 0, mapSize: 5000, mergeSecs: 30, splitMode: 'single' } },
        virus: { uses: ['startMass', 'rounds', 'difficulty'], defaults: { startMass: 600, rounds: 6, difficulty: 1, bots: 0, viruses: 0, mapSize: 5000, mergeSecs: 30 } },
        dodge: { uses: ['startMass', 'viruses', 'mapSize', 'duration', 'mergeSecs'], defaults: { startMass: 1000, viruses: 4, mapSize: 5000, duration: 120, mergeSecs: 3, bots: 0 } },
        path: { uses: ['startMass', 'difficulty', 'duration'], defaults: { startMass: 25, difficulty: 2, duration: 60, mapSize: 5000, bots: 0, viruses: 0 } },
        escape: { uses: ['startMass', 'oppMass', 'bots', 'difficulty', 'viruses', 'mapSize', 'duration'], defaults: { startMass: 200, oppMass: 800, bots: 4, difficulty: 2, viruses: 2, mapSize: 5000, duration: 60, mergeSecs: 30 }, decay: true },
        feed: { uses: ['startMass', 'difficulty', 'duration'], defaults: { startMass: 1500, difficulty: 1, duration: 20, mapSize: 4000, bots: 0, viruses: 0 } },
        merge: { uses: ['startMass', 'mergeSecs'], defaults: { startMass: 800, mergeSecs: 5, mapSize: 4000, bots: 0, viruses: 0 } }
    };
    var EX_IDS = Object.keys(EXERCISES);

    /* a complete, valid settings object (untrusted input: storage, the window) */
    function sanitizeConfig(c) {
        c = c && typeof c === 'object' ? c : {};
        var ex = EX_IDS.indexOf(c.exercise) !== -1 ? c.exercise : 'free';
        var d = EXERCISES[ex].defaults, out = { exercise: ex };
        Object.keys(FIELDS).forEach(function (k) {
            var f = FIELDS[k], v = Number(c[k]);
            if (!isNum(v)) v = d[k] != null ? d[k] : f.def;
            out[k] = Math.round(clamp(v, f.min, f.max));
        });
        out.splitMode = SPLIT_MODES.indexOf(c.splitMode) !== -1 ? c.splitMode : (d.splitMode || 'single');
        out.name = typeof c.name === 'string' ? c.name.replace(/[\u0000-\u001f}{]/g, '').slice(0, 30) : '';
        var col = c.color;
        out.color = Array.isArray(col) && col.length === 3 && col.every(function (v) { return isNum(v) && v >= 0 && v <= 255; }) ? col.map(Math.round) : [80, 170, 255];
        return out;
    }
    /* the exercise's defaults over the current settings (when another exercise is chosen) */
    function withDefaults(c, ex) {
        var o = {}, k;
        for (k in c) if (Object.prototype.hasOwnProperty.call(c, k)) o[k] = c[k];
        o.exercise = ex;
        var d = (EXERCISES[ex] || EXERCISES.free).defaults;
        for (k in d) o[k] = d[k];
        return sanitizeConfig(o);
    }
    /* the personal best key: exercise, seed, latency and the settings it uses */
    function bestKey(c) {
        c = sanitizeConfig(c);
        var parts = [c.exercise, c.seed, c.latency];
        EXERCISES[c.exercise].uses.forEach(function (k) { parts.push(c[k]); });
        return parts.join('|');
    }
    var KEY_RE = /^[a-z]{3,8}\|[0-9]{1,6}\|[0-9]{1,3}(\|[0-9a-z]{1,6}){0,10}$/;

    /* ------------------------------------------------------------------ */
    /* World                                                               */
    /* ------------------------------------------------------------------ */
    var PALETTE = [[255, 80, 80], [255, 160, 60], [255, 230, 70], [120, 230, 90], [60, 220, 200], [80, 150, 255], [170, 110, 255], [255, 100, 200]];
    function newPlayer(w, opts) {
        var p = {
            idx: w.players.length, human: !!opts.human, name: opts.name || '', color: opts.color || PALETTE[w.players.length % PALETTE.length],
            cells: [], mx: 0, my: 0, splitQ: 0, ejectQ: 0, ejectCd: 0, ai: opts.ai || null, passive: !!opts.passive, shield: !!opts.shield,
            noLb: !!opts.noLb, respawnAt: -1, respawnMass: opts.respawnMass || 0, kills: 0, splits: 0, ejects: 0, pops: 0, think: 0, wx: 0, wy: 0, splitCd: 0, flee: 0
        };
        w.players.push(p);
        return p;
    }
    function addCell(w, kind, owner, x, y, m, extra) {
        var c = {
            id: w.nextId++, k: kind, o: owner ? owner.idx : -1, x: x, y: y, m: m, r: radius(m),
            bx: 0, by: 0, bd: 0, born: w.tick, mergeAt: 0, fed: 0, ldx: 1, ldy: 0, dead: false, pellet: false,
            color: null, name: ''
        };
        if (extra) for (var k in extra) c[k] = extra[k];
        if (owner && kind === K_PLAYER) {
            owner.cells.push(c);
            c.color = owner.color;
            c.name = owner.name;
            if (owner.human) w.ev.own.push(c.id);
        }
        w.cells.push(c);
        return c;
    }
    function kill(w, c, eater) {
        if (c.dead) return;
        c.dead = true;
        if (eater) w.ev.eats.push(eater.id, c.id);
        if (c.k === K_FOOD && !c.pellet) w.foodN--;
        if (c.k === K_VIRUS) w.virusN--;
    }
    function setMass(c, m) { c.m = clamp(m, 1, MAX_MASS); c.r = radius(c.m); }
    function mergeTicks(w, m) { return Math.round(w.cfg.mergeSecs * (1 + 0.000777 * m) * 1000 / TICK_MS); }

    function createWorld(cfg, opts) {
        cfg = sanitizeConfig(cfg);
        opts = opts || {};
        var half = cfg.mapSize / 2;
        var w = {
            cfg: cfg, rnd: rng(cfg.seed), tick: 0, nextId: 1, cells: [], players: [], half: half,
            inQ: [], ev: { eats: [], own: [] }, foodN: 0, virusN: 0, foodMax: 0, virusMax: 0,
            over: false, result: null, reason: '', ex: {}, samples: [], noSpawn: !!opts.bare, decay: !opts.bare && !!EXERCISES[cfg.exercise].decay,
            latTicks: Math.round(cfg.latency / TICK_MS), lastSample: -999, peak: 0, msg: ''
        };
        var area = cfg.mapSize * cfg.mapSize;
        w.foodMax = opts.bare ? 0 : Math.round(clamp(area / 64e6 * 1200, 100, 2400));
        w.virusMax = opts.bare ? 0 : Math.round(area / 36e6 * 15 * [0, 0.5, 1, 2, 4][cfg.viruses]);
        newPlayer(w, { human: true, name: cfg.name || 'You', color: cfg.color });
        if (!opts.bare) {
            (EXERCISE_IMPL[cfg.exercise] || EXERCISE_IMPL.free).setup(w);
            spawnFood(w, w.foodMax);
            spawnViruses(w, w.virusMax);
        }
        return w;
    }
    function human(w) { return w.players[HUMAN]; }
    function centre(p) {
        var x = 0, y = 0, m = 0;
        for (var i = 0; i < p.cells.length; i++) { var c = p.cells[i]; if (c.dead) continue; x += c.x * c.m; y += c.y * c.m; m += c.m; }
        return m ? { x: x / m, y: y / m, m: m } : null;
    }
    function biggest(p) {
        var b = null;
        for (var i = 0; i < p.cells.length; i++) if (!p.cells[i].dead && (!b || p.cells[i].m > b.m)) b = p.cells[i];
        return b;
    }
    function freeSpot(w, minDist, from, tries) {
        var h = w.half * 0.95, best = null, bestD = -1;
        for (var i = 0; i < (tries || 12); i++) {
            var x = (w.rnd() * 2 - 1) * h, y = (w.rnd() * 2 - 1) * h;
            var d = from ? Math.hypot(x - from.x, y - from.y) : Infinity;
            if (d >= minDist) return { x: x, y: y };
            if (d > bestD) { bestD = d; best = { x: x, y: y }; }
        }
        return best;
    }
    function spawnFood(w, n) {
        var h = w.half * 0.98;
        for (var i = 0; i < n && w.foodN < w.foodMax; i++) {
            addCell(w, K_FOOD, null, (w.rnd() * 2 - 1) * h, (w.rnd() * 2 - 1) * h, FOOD_MASS, { color: PALETTE[Math.floor(w.rnd() * PALETTE.length)] });
            w.foodN++;
        }
    }
    /* viruses keep away from players and the exercise's clear zones */
    function spawnViruses(w, n) {
        var h = w.half * 0.92;
        for (var i = 0; i < n && w.virusN < w.virusMax; i++) {
            var ok = false, x = 0, y = 0;
            for (var t = 0; t < 10 && !ok; t++) {
                x = (w.rnd() * 2 - 1) * h; y = (w.rnd() * 2 - 1) * h;
                ok = true;
                for (var j = 0; j < w.cells.length && ok; j++) {
                    var c = w.cells[j];
                    if (!c.dead && c.k === K_PLAYER && Math.hypot(c.x - x, c.y - y) < c.r + 250) ok = false;
                }
                var cz = w.ex.clear || [];
                for (j = 0; j < cz.length && ok; j++) if (Math.hypot(cz[j].x - x, cz[j].y - y) < cz[j].r) ok = false;
            }
            if (!ok) break;
            addCell(w, K_VIRUS, null, x, y, VIRUS_MASS, { color: [51, 255, 51] });
            w.virusN++;
        }
    }

    /* ------------------------------------------------------------------ */
    /* Input (the human's commands, delayed by the simulated latency)      */
    /* ------------------------------------------------------------------ */
    function input(w, cmd) {
        if (!cmd || typeof cmd !== 'object') return;
        if (cmd.t === 'move' && !(isNum(cmd.x) && isNum(cmd.y))) return;
        if (w.inQ.length > 2000) w.inQ.shift();
        w.inQ.push({ at: w.tick + w.latTicks, c: cmd });
    }
    function applyInput(w) {
        var p = human(w);
        while (w.inQ.length && w.inQ[0].at <= w.tick) {
            var c = w.inQ.shift().c;
            if (c.t === 'move') { p.mx = clamp(c.x, -w.half * 4, w.half * 4); p.my = clamp(c.y, -w.half * 4, w.half * 4); }
            else if (c.t === 'split') { p.splitQ = Math.min(8, p.splitQ + Math.max(1, Math.min(4, c.n | 0 || 1))); }
            else if (c.t === 'eject') p.ejectQ = Math.min(4, p.ejectQ + 1);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Actions                                                             */
    /* ------------------------------------------------------------------ */
    function splitOnce(w, p) {
        var list = p.cells.filter(function (c) { return !c.dead; }).sort(function (a, b) { return b.m - a.m || a.id - b.id; });
        var n = 0, count = list.length;
        for (var i = 0; i < list.length && count < MAX_CELLS; i++) {
            var c = list[i];
            if (c.m < MIN_SPLIT) continue;
            var dx = p.mx - c.x, dy = p.my - c.y, d = Math.hypot(dx, dy);
            if (d < 1) { dx = c.ldx; dy = c.ldy; d = 1; }
            dx /= d; dy /= d;
            var half = c.m / 2;
            setMass(c, half);
            var nc = addCell(w, K_PLAYER, p, c.x, c.y, half);
            nc.bx = dx; nc.by = dy; nc.bd = BOOST * Math.pow(nc.r, 0.0122);
            nc.ldx = dx; nc.ldy = dy;
            c.mergeAt = nc.mergeAt = w.tick + mergeTicks(w, half);
            count++; n++;
        }
        if (n) p.splits++;
        if (n && w.ex.onSplit) w.ex.onSplit(w, p, n);
        return n;
    }
    function ejectOnce(w, p) {
        var n = 0;
        for (var i = 0; i < p.cells.length; i++) {
            var c = p.cells[i];
            if (c.dead || c.m < MIN_SPLIT) continue;
            var dx = p.mx - c.x, dy = p.my - c.y, d = Math.hypot(dx, dy);
            if (d < 1) { dx = c.ldx; dy = c.ldy; d = 1; }
            /* a little spread, as on servers (small enough that a fed virus can be aimed) */
            var a = Math.atan2(dy, dx) + (w.rnd() * 0.2 - 0.1);
            setMass(c, c.m - EJECT_LOSS);
            var ex = Math.cos(a), ey = Math.sin(a);
            var e = addCell(w, K_EJECT, null, c.x + ex * c.r, c.y + ey * c.r, EJECT_MASS, { color: c.color, src: p.idx });
            e.bx = ex; e.by = ey; e.bd = BOOST;
            n++;
        }
        if (n) { p.ejects++; if (w.ex.onEject) w.ex.onEject(w, p, n); }
        return n;
    }
    /* virus pop: the pieces a popped cell of this mass splits into (MultiOgar's rule) */
    function popPieces(mass, cellsLeft, minMass) {
        var out = [];
        if (cellsLeft <= 0) return out;
        if (mass / cellsLeft < minMass) {
            var n = 2, sm = mass / n;
            while (sm > minMass && n * 2 < cellsLeft) { n *= 2; sm = mass / n; }
            sm = mass / (n + 1);
            for (var i = 0; i < n; i++) out.push(sm);
            return out;
        }
        var left = mass / 2, piece = mass / 2;
        while (cellsLeft > 0) {
            if (left / cellsLeft < minMass) {
                piece = left / cellsLeft;
                while (cellsLeft-- > 0) out.push(piece);
                break;
            }
            while (piece >= left && cellsLeft > 1) piece /= 2;
            out.push(piece);
            left -= piece;
            cellsLeft--;
        }
        return out;
    }
    function popCell(w, p, c) {
        var alive = p.cells.filter(function (x) { return !x.dead; }).length;
        var pieces = popPieces(c.m, MAX_CELLS - alive, MIN_SPLIT);
        if (!pieces.length) return;
        var sum = 0;
        for (var i = 0; i < pieces.length; i++) sum += pieces[i];
        setMass(c, c.m - sum);
        c.mergeAt = w.tick + mergeTicks(w, c.m);
        for (i = 0; i < pieces.length; i++) {
            var a = w.rnd() * Math.PI * 2;
            var nc = addCell(w, K_PLAYER, p, c.x, c.y, pieces[i]);
            nc.bx = Math.cos(a); nc.by = Math.sin(a); nc.bd = BOOST * 0.75;
            nc.mergeAt = w.tick + mergeTicks(w, pieces[i]);
        }
        p.pops++;
    }

    /* ------------------------------------------------------------------ */
    /* Bots                                                                */
    /* ------------------------------------------------------------------ */
    var THINK = [0, 12, 6, 3, 1];
    function enemyCells(w, p) {
        var out = [];
        for (var i = 0; i < w.players.length; i++) {
            var q = w.players[i];
            if (q === p) continue;
            for (var j = 0; j < q.cells.length; j++) if (!q.cells[j].dead) out.push(q.cells[j]);
        }
        return out;
    }
    function nearestFood(w, x, y, rad) {
        var best = null, bd = rad * rad;
        queryGrid(w, x, y, rad, function (c) {
            if (c.k !== K_FOOD && c.k !== K_EJECT) return;
            var d = (c.x - x) * (c.x - x) + (c.y - y) * (c.y - y);
            if (d < bd) { bd = d; best = c; }
        });
        return best;
    }
    function botThink(w, p) {
        var ai = p.ai, lvl = ai.lvl;
        /* exercise-driven cells (targets, teammate): they stay put unless the exercise moves them */
        if (ai.mode !== 'bot') { if (!ai.drift) { var b0 = biggest(p); if (b0) { p.mx = b0.x; p.my = b0.y; } } return; }
        if (p.splitCd > 0) p.splitCd--;
        if (w.tick < p.think) return;
        p.think = w.tick + THINK[lvl];
        var me = biggest(p), ctr = centre(p);
        if (!me || !ctr) return;
        var sight = 900 + me.r * 3;
        var foes = enemyCells(w, p), threat = null, threatD = Infinity, prey = null, preyS = 0;
        for (var i = 0; i < foes.length; i++) {
            var e = foes[i], owner = w.players[e.o];
            if (owner && owner.passive && owner.shield) continue;
            var d = Math.hypot(e.x - ctr.x, e.y - ctr.y) - e.r - me.r;
            if (d > sight) continue;
            var big = e.m >= EAT_RATIO * me.m || (lvl >= 3 && e.m / 2 >= EAT_RATIO * me.m && d < 700);
            if (big && !(owner && owner.passive)) {
                if (d < threatD) { threatD = d; threat = e; }
            } else if (me.m >= EAT_RATIO * e.m && !(owner && owner.shield)) {
                var s = e.m / (Math.max(d, 0) + 100) * (ai.hunt && owner && owner.human ? 4 : 1);
                if (s > preyS) { preyS = s; prey = e; }
            }
        }
        var fleeRange = lvl === 1 ? 250 : lvl === 2 ? 500 : 900;
        if (threat && threatD < fleeRange) {
            var fx = ctr.x - threat.x, fy = ctr.y - threat.y, fd = Math.hypot(fx, fy) || 1;
            var tx = ctr.x + fx / fd * 1000, ty = ctr.y + fy / fd * 1000;
            /* slide along the border instead of running into it */
            var lim = w.half - me.r;
            if (Math.abs(tx) > lim) tx = clamp(tx, -lim, lim), ty = ctr.y + (fy >= 0 ? 1 : -1) * 1000;
            if (Math.abs(ty) > lim) ty = clamp(ty, -lim, lim), tx = ctr.x + (fx >= 0 ? 1 : -1) * 1000;
            p.mx = tx; p.my = ty;
            return;
        }
        if (prey && (lvl >= 2 || preyS > 0.5)) {
            var px = prey.x, py = prey.y;
            if (lvl >= 4 && prey._px != null) { px += (prey.x - prey._px) * 6; py += (prey.y - prey._py) * 6; }
            p.mx = px; p.my = py;
            var pd = Math.hypot(prey.x - me.x, prey.y - me.y);
            if (lvl >= 3 && p.splitCd <= 0 && !threat) {
                var alive = p.cells.length;
                if (alive <= (lvl >= 4 ? 4 : 2) && me.m / 2 >= EAT_RATIO * prey.m && pd < me.r + 560) {
                    p.splitQ = 1; p.splitCd = 50;
                } else if (lvl >= 4 && alive <= 2 && me.m / 4 >= EAT_RATIO * prey.m && pd < me.r + 950) {
                    p.splitQ = 2; p.splitCd = 70;
                }
            }
            return;
        }
        /* viruses: big bots steer around them from level 3 */
        var f = nearestFood(w, ctr.x, ctr.y, 450);
        if (f) { p.mx = f.x; p.my = f.y; }
        else {
            if (!p.wx && !p.wy || Math.hypot(p.wx - ctr.x, p.wy - ctr.y) < 150 || w.rnd() < 0.01) {
                var s2 = freeSpot(w, 0, null, 1);
                p.wx = s2.x; p.wy = s2.y;
            }
            p.mx = p.wx; p.my = p.wy;
        }
        if (lvl >= 3 && me.m >= EAT_RATIO * VIRUS_MASS) {
            queryGrid(w, me.x, me.y, me.r + 220, function (v) {
                if (v.k !== K_VIRUS) return;
                var vx = me.x - v.x, vy = me.y - v.y, vd = Math.hypot(vx, vy) || 1;
                p.mx = me.x + vx / vd * 400; p.my = me.y + vy / vd * 400;
            });
        }
    }
    function respawnBots(w) {
        var hc = centre(human(w));
        for (var i = 1; i < w.players.length; i++) {
            var p = w.players[i];
            if (!p.ai || p.ai.mode !== 'bot' || p.respawnMass <= 0) continue;
            var alive = p.cells.some(function (c) { return !c.dead; });
            if (alive) { p.respawnAt = -1; continue; }
            if (p.respawnAt < 0) { p.respawnAt = w.tick + 75; continue; }
            if (w.tick < p.respawnAt) continue;
            var s = freeSpot(w, 1300, hc, 12);
            addCell(w, K_PLAYER, p, s.x, s.y, p.respawnMass);
            p.respawnAt = -1;
        }
    }
    function addBots(w, n, mass, lvl, extra) {
        var hc = centre(human(w)) || { x: 0, y: 0 };
        for (var i = 0; i < n; i++) {
            var p = newPlayer(w, { name: 'Bot ' + (i + 1), ai: { lvl: lvl, mode: 'bot', hunt: !!(extra && extra.hunt) }, respawnMass: mass });
            var s = freeSpot(w, extra && extra.minDist || 1000, hc, 12);
            /* opponents of mixed size around the chosen mass (seeded) */
            var m = extra && extra.exact ? mass : clamp(mass * (0.5 + w.rnd()), 10, MAX_MASS);
            addCell(w, K_PLAYER, p, s.x, s.y, m);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Spatial grid                                                        */
    /* ------------------------------------------------------------------ */
    var G = 256;
    function buildGrid(w) {
        var g = new Map();
        for (var i = 0; i < w.cells.length; i++) {
            var c = w.cells[i];
            if (c.dead) continue;
            var k = (Math.floor(c.x / G) + 1000) * 4000 + (Math.floor(c.y / G) + 1000);
            var a = g.get(k);
            if (a) a.push(c); else g.set(k, [c]);
        }
        w.grid = g;
    }
    /* calls fn for every live cell whose centre may be within rad of (x, y) */
    function queryGrid(w, x, y, rad, fn) {
        var g = w.grid;
        if (!g) return;
        var x0 = Math.floor((x - rad) / G), x1 = Math.floor((x + rad) / G), y0 = Math.floor((y - rad) / G), y1 = Math.floor((y + rad) / G);
        for (var gx = x0; gx <= x1; gx++) for (var gy = y0; gy <= y1; gy++) {
            var a = g.get((gx + 1000) * 4000 + (gy + 1000));
            if (!a) continue;
            for (var i = 0; i < a.length; i++) if (!a[i].dead) fn(a[i]);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Tick                                                                */
    /* ------------------------------------------------------------------ */
    function moveBoost(w, c) {
        if (c.bd <= 1) { c.bd = 0; return; }
        var s = c.bd / 9;
        c.bd -= s;
        c.x += c.bx * s; c.y += c.by * s;
        /* ejected mass and viruses bounce off the border */
        if (c.k !== K_PLAYER) {
            var h = w.half;
            if (c.x < -h || c.x > h) { c.bx = -c.bx; c.x = clamp(c.x, -h, h); }
            if (c.y < -h || c.y > h) { c.by = -c.by; c.y = clamp(c.y, -h, h); }
        }
    }
    function border(w, c) {
        var h = w.half - c.r / 2;
        if (h < 0) h = 0;
        c.x = clamp(c.x, -h, h); c.y = clamp(c.y, -h, h);
    }
    function movePlayers(w) {
        for (var i = 0; i < w.players.length; i++) {
            var p = w.players[i];
            for (var j = 0; j < p.cells.length; j++) {
                var c = p.cells[j];
                if (c.dead) continue;
                c._px = c.x; c._py = c.y;
                if (!(p.ai && p.ai.mode !== 'bot' && !p.ai.drift)) {
                    var dx = p.mx - c.x, dy = p.my - c.y, d = Math.hypot(dx, dy);
                    if (d >= 1) {
                        var s = Math.min(d, speedOf(c.r));
                        c.x += dx / d * s; c.y += dy / d * s;
                        c.ldx = dx / d; c.ldy = dy / d;
                    }
                }
                moveBoost(w, c);
                border(w, c);
            }
        }
        for (i = 0; i < w.cells.length; i++) {
            var e = w.cells[i];
            if (!e.dead && e.k !== K_PLAYER && e.bd > 0) moveBoost(w, e);
        }
    }
    /* own cells: push apart until they may merge, then the bigger one absorbs the other */
    function ownCollisions(w, p) {
        var a = p.cells;
        for (var i = 0; i < a.length; i++) {
            var c = a[i];
            if (c.dead) continue;
            for (var j = i + 1; j < a.length; j++) {
                var o = a[j];
                if (o.dead) continue;
                var dx = o.x - c.x, dy = o.y - c.y, d = Math.hypot(dx, dy), rs = c.r + o.r;
                if (d >= rs) continue;
                var merge = c.mergeAt <= w.tick && o.mergeAt <= w.tick;
                if (merge) {
                    var big = c.m >= o.m ? c : o, sm = big === c ? o : c;
                    if (d < big.r - sm.r / 3) {
                        setMass(big, big.m + sm.m);
                        kill(w, sm, big);
                        if (sm === c) break;
                    }
                    continue;
                }
                if (c.bd > 20 || o.bd > 20 || w.tick - c.born < 13 || w.tick - o.born < 13) continue;
                if (d < 0.001) { dx = 1; dy = 0; d = 1; } else { dx /= d; dy /= d; }
                var push = rs - d, tm = c.m + o.m;
                c.x -= dx * push * (o.m / tm); c.y -= dy * push * (o.m / tm);
                o.x += dx * push * (c.m / tm); o.y += dy * push * (c.m / tm);
            }
        }
    }
    /* shielded cells (the feeding drill's teammate) cannot be eaten: other cells bump into them */
    function shieldPush(w) {
        for (var i = 0; i < w.players.length; i++) {
            var s = w.players[i];
            if (!s.shield) continue;
            for (var j = 0; j < s.cells.length; j++) {
                var S = s.cells[j];
                if (S.dead) continue;
                for (var k = 0; k < w.players.length; k++) {
                    var p = w.players[k];
                    if (p === s) continue;
                    for (var l = 0; l < p.cells.length; l++) {
                        var c = p.cells[l];
                        if (c.dead) continue;
                        var dx = c.x - S.x, dy = c.y - S.y, d = Math.hypot(dx, dy), rs = S.r + c.r;
                        if (d >= rs) continue;
                        if (d < 0.001) { dx = 1; dy = 0; d = 1; }
                        c.x = S.x + dx / d * rs; c.y = S.y + dy / d * rs;
                    }
                }
            }
        }
    }
    function eatAll(w) {
        var pcs = [];
        for (var i = 0; i < w.cells.length; i++) if (!w.cells[i].dead && w.cells[i].k === K_PLAYER) pcs.push(w.cells[i]);
        pcs.sort(function (a, b) { return b.m - a.m || a.id - b.id; });
        for (i = 0; i < pcs.length; i++) {
            var A = pcs[i];
            if (A.dead) continue;
            var owner = w.players[A.o];
            queryGrid(w, A.x, A.y, A.r, function (B) {
                if (B === A || B.dead || A.dead) return;
                var d = Math.hypot(B.x - A.x, B.y - A.y);
                if (B.k === K_FOOD) { if (d < A.r) { setMass(A, A.m + B.m); kill(w, B, A); if (w.ex.onFood) w.ex.onFood(w, A, B); } return; }
                if (d >= A.r - B.r / 3) return;
                if (B.k === K_EJECT) {
                    if (B.src === A.o && w.tick - B.born < 3) return;
                    if (A.m <= B.m) return;
                    setMass(A, A.m + B.m); kill(w, B, A);
                    if (w.ex.onEjectEaten) w.ex.onEjectEaten(w, A, B);
                    return;
                }
                if (B.k === K_VIRUS) {
                    if (A.m < EAT_RATIO * B.m) return;
                    setMass(A, A.m + B.m); kill(w, B, A);
                    popCell(w, owner, A);
                    if (w.ex.onPop) w.ex.onPop(w, A, B);
                    return;
                }
                if (B.o === A.o) return;
                var bo = w.players[B.o];
                if (owner.passive || (bo && bo.shield)) return;
                if (A.m < EAT_RATIO * B.m) return;
                setMass(A, A.m + B.m); kill(w, B, A);
                if (!bo.cells.some(function (c) { return !c.dead; })) owner.kills++;
                if (w.ex.onKill) w.ex.onKill(w, A, B);
            });
        }
        /* viruses eat ejected mass; the 7th shot splits a new virus off in the feeding direction */
        for (i = 0; i < w.cells.length; i++) {
            var V = w.cells[i];
            if (V.dead || V.k !== K_VIRUS) continue;
            queryGrid(w, V.x, V.y, V.r, function (E) {
                if (E.dead || V.dead || E.k !== K_EJECT || Math.hypot(E.x - V.x, E.y - V.y) >= V.r) return;
                setMass(V, V.m + E.m); kill(w, E, V);
                V.fed++;
                var dx = E.bx, dy = E.by;
                if (E.bd < 5) { dx = V.x - E.x; dy = V.y - E.y; var dd = Math.hypot(dx, dy) || 1; dx /= dd; dy /= dd; }
                V.ldx = dx; V.ldy = dy;
                if (V.fed >= VIRUS_FEED) {
                    V.fed = 0;
                    setMass(V, VIRUS_MASS);
                    var nv = addCell(w, K_VIRUS, null, V.x, V.y, VIRUS_MASS, { color: [51, 255, 51], shot: true, shooter: E.src });
                    nv.bx = dx; nv.by = dy; nv.bd = BOOST;
                    w.virusN++;
                    if (w.ex.onShot) w.ex.onShot(w, V, nv);
                }
            });
        }
    }
    function decay(w) {
        if (!w.decay) return;
        for (var i = 0; i < w.cells.length; i++) {
            var c = w.cells[i];
            if (!c.dead && c.k === K_PLAYER && c.m > 200) setMass(c, c.m - c.m * 0.002 / 25);
        }
    }
    function compact(w) {
        if (!w.cells.some(function (c) { return c.dead; })) return;
        w.cells = w.cells.filter(function (c) { return !c.dead; });
        for (var i = 0; i < w.players.length; i++) w.players[i].cells = w.players[i].cells.filter(function (c) { return !c.dead; });
    }
    function sample(w) {
        var p = human(w), c = centre(p);
        if (c && c.m > w.peak) w.peak = c.m;
        if (w.tick - w.lastSample < 4) return;
        w.lastSample = w.tick;
        if (w.samples.length >= 4000) return;
        w.samples.push(w.tick, c ? Math.round(c.x) : 0, c ? Math.round(c.y) : 0, c ? Math.round(c.m) : 0);
    }
    function step(w) {
        if (w.over) return;
        applyInput(w);
        for (var i = 0; i < w.players.length; i++) {
            var p = w.players[i];
            if (p.ai) botThink(w, p);
            if (p.ejectCd > 0) p.ejectCd--;
            if (p.splitQ > 0) { p.splitQ--; splitOnce(w, p); }
            if (p.ejectQ > 0 && p.ejectCd <= 0) { p.ejectQ--; p.ejectCd = 2; ejectOnce(w, p); }
        }
        movePlayers(w);
        for (i = 0; i < w.players.length; i++) ownCollisions(w, w.players[i]);
        shieldPush(w);
        buildGrid(w);
        eatAll(w);
        decay(w);
        compact(w);
        if (!w.noSpawn) {
            if (w.foodN < w.foodMax) spawnFood(w, 6);
            if (w.virusN < w.virusMax && w.tick % 25 === 0) spawnViruses(w, 1);
            respawnBots(w);
        }
        w.tick++;
        sample(w);
        var impl = EXERCISE_IMPL[w.cfg.exercise];
        if (impl && !w.noSpawn) impl.update(w);
        if (!w.over && !w.noSpawn && !human(w).cells.length && !(w.ex.allowDeath)) finish(w, 'eaten');
    }
    function finish(w, reason) {
        if (w.over) return;
        w.over = true;
        w.reason = reason || 'done';
        var impl = EXERCISE_IMPL[w.cfg.exercise];
        var r = impl.result(w);
        r.score = Math.max(0, Math.round(r.score || 0));
        r.ticks = w.tick;
        r.reason = w.reason;
        r.peak = Math.round(w.peak);
        w.result = r;
    }
    function secs(w) { return w.tick * TICK_MS / 1000; }

    /* ------------------------------------------------------------------ */
    /* Exercises                                                           */
    /* ------------------------------------------------------------------ */
    /* the human back to one cell (drill rounds): its old cells are removed, not eaten */
    function resetHuman(w, mass, x, y) {
        var p = human(w);
        for (var i = 0; i < p.cells.length; i++) kill(w, p.cells[i], null);
        p.cells = p.cells.filter(function (c) { return !c.dead; });
        p.splitQ = 0; p.ejectQ = 0;
        var c = addCell(w, K_PLAYER, p, x, y, mass);
        p.mx = x; p.my = y;
        return c;
    }
    function clearOwner(w, p) {
        for (var i = 0; i < p.cells.length; i++) kill(w, p.cells[i], null);
        p.cells = [];
    }
    /* how far the front piece of n splits (gap ticks apart) reaches, measured with the same
     * physics in an empty world: drill targets are placed from it */
    var reachCache = {};
    function splitReach(mass, n, gap) {
        var key = Math.round(mass) + ':' + n + ':' + gap;
        if (reachCache[key] != null) return reachCache[key];
        var w = createWorld({ exercise: 'free', mapSize: 14000, seed: 1, startMass: mass, mergeSecs: 30 }, { bare: true });
        var p = human(w);
        addCell(w, K_PLAYER, p, -5000, 0, mass);
        p.mx = 9000; p.my = 0;
        var best = 0, end = (n - 1) * gap + 16;
        /* the furthest piece (its centre plus most of its radius) until the last boost has mostly run out */
        for (var t = 0; t < end; t++) {
            if (t < n * gap && t % gap === 0) p.splitQ++;
            step(w);
            for (var i = 0; i < p.cells.length; i++) {
                var v = p.cells[i].x + 5000 + p.cells[i].r * 0.6;
                if (v > best) best = v;
            }
        }
        return (reachCache[key] = Math.round(best));
    }
    var SPLIT_NEED = { single: 1, double: 2, pop: 2, trick: 4 };
    /* one split drill round: hit, time to the kill, splits used (and the popsplit delay) */
    function scoreSplitRound(r, mode) {
        if (!r || !r.ok) return 0;
        var s = 100 + clamp(Math.round(100 - (r.ms - 400) / 40), 0, 100);
        var need = SPLIT_NEED[mode] || 1;
        if (mode === 'pop') { if (r.splits === 2 && r.delay >= 80 && r.delay <= 240) s += 50; }
        else if (r.splits === need) s += 50;
        return s;
    }
    var EXERCISE_IMPL = {};
    EXERCISE_IMPL.free = {
        setup: function (w) {
            var s = freeSpot(w, 0, null, 1);
            addCell(w, K_PLAYER, human(w), s.x * 0.5, s.y * 0.5, w.cfg.startMass);
            human(w).mx = s.x * 0.5; human(w).my = s.y * 0.5;
            addBots(w, w.cfg.bots, w.cfg.oppMass, w.cfg.difficulty);
        },
        update: function (w) { if (secs(w) >= w.cfg.duration) finish(w, 'time'); },
        result: function (w) {
            var p = human(w), c = centre(p), ok = w.reason === 'time';
            return {
                ok: ok, score: w.peak + p.kills * 100 + (ok ? 300 : 0),
                lines: [['peak', Math.round(w.peak)], ['kills', p.kills], ['mass', c ? Math.round(c.m) : 0], ['time', Math.round(secs(w))]]
            };
        }
    };
    EXERCISE_IMPL.escape = {
        setup: function (w) {
            addCell(w, K_PLAYER, human(w), 0, 0, w.cfg.startMass);
            addBots(w, w.cfg.bots, w.cfg.oppMass, w.cfg.difficulty, { hunt: true, minDist: 1400, exact: true });
        },
        update: function (w) { if (secs(w) >= w.cfg.duration) finish(w, 'time'); },
        result: function (w) {
            var c = centre(human(w)), ok = w.reason === 'time', t = Math.min(secs(w), w.cfg.duration);
            return { ok: ok, score: t * 10 + (ok ? 500 : 0) + (c ? c.m / 10 : 0), lines: [['survived', Math.round(t) + ' / ' + w.cfg.duration + ' s'], ['mass', c ? Math.round(c.m) : 0]] };
        }
    };
    EXERCISE_IMPL.split = {
        setup: function (w) {
            w.ex = { round: 0, phase: 'gap', until: 0, log: [], cur: null, target: null, allowDeath: false };
            w.ex.targetP = newPlayer(w, { name: 'Target', ai: { lvl: 1, mode: 'dummy' }, passive: true, noLb: true });
            resetHuman(w, w.cfg.startMass, 0, 0);
            w.ex.onSplit = function (w2, p, n) {
                if (!p.human || !w2.ex.cur) return;
                var cur = w2.ex.cur;
                cur.splits++;
                if (cur.splits === 1) cur.first = w2.tick;
                if (cur.splits === 2) cur.delay = (w2.tick - cur.first) * TICK_MS;
            };
            w.ex.onKill = function (w2, A, B) {
                var cur = w2.ex.cur;
                if (cur && B.o === w2.ex.targetP.idx && A.o === HUMAN) { cur.ok = true; cur.ms = (w2.tick - cur.start) * TICK_MS; }
            };
        },
        update: function (w) {
            var ex = w.ex, cfg = w.cfg;
            if (ex.phase === 'gap') {
                if (w.tick < ex.until) return;
                if (ex.round >= cfg.rounds) { finish(w, 'done'); return; }
                ex.round++;
                var mass = cfg.startMass, r = radius(mass), mode = cfg.splitMode, need = SPLIT_NEED[mode];
                resetHuman(w, mass, 0, 0);
                clearOwner(w, ex.targetP);
                var gap = mode === 'pop' ? 4 : 2;
                var far = splitReach(mass, need, gap), near = need > 1 ? splitReach(mass, need === 4 ? 2 : 1, 2) : r + 150;
                var tm = clamp(mass / Math.pow(2, need) / 1.5, 10, MAX_MASS);
                var tr = radius(tm);
                var lo = Math.max(near + tr * 0.5, r + tr + 60), hi = Math.max(lo + 20, far - tr * 0.2);
                var dist = lo + (hi - lo) * (0.15 + w.rnd() * 0.7), ang = w.rnd() * Math.PI * 2;
                addCell(w, K_PLAYER, ex.targetP, Math.cos(ang) * dist, Math.sin(ang) * dist, tm);
                /* from level 2 the target runs from a slow approach: only the split reaches it */
                ex.targetP.ai = { lvl: 1, mode: cfg.difficulty >= 2 ? 'skittish' : 'dummy', trigger: dist - r - 80 };
                ex.cur = { ok: false, ms: 0, splits: 0, delay: 0, start: w.tick, first: 0, dist: Math.round(dist) };
                ex.target = { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, r: tr, lo: lo, hi: hi };
                ex.phase = 'play';
                ex.until = w.tick + Math.round((cfg.difficulty <= 1 ? 8 : 6) * 1000 / TICK_MS);
                return;
            }
            var tp = ex.targetP, tc = tp.cells[0];
            if (tc && tp.ai.mode === 'skittish') {
                var hc = centre(human(w)), hb = biggest(human(w));
                var near2 = hc && hb && Math.hypot(tc.x - hb.x, tc.y - hb.y) - hb.r < tp.ai.trigger && human(w).cells.length === 1;
                var dx = tc.x - (hc ? hc.x : 0), dy = tc.y - (hc ? hc.y : 0), d = Math.hypot(dx, dy) || 1;
                tp.ai.drift = near2;
                if (near2) { tp.mx = tc.x + dx / d * 600; tp.my = tc.y + dy / d * 600; }
                else { tp.mx = tc.x; tp.my = tc.y; }
                if (cfg.difficulty >= 4 && !near2) { tp.ai.drift = true; tp.mx = tc.x + Math.cos(w.tick / 20) * 200; tp.my = tc.y + Math.sin(w.tick / 27) * 200; }
            }
            if (ex.cur.ok || w.tick >= ex.until || !human(w).cells.length) {
                ex.log.push(ex.cur);
                ex.cur.score = scoreSplitRound(ex.cur, cfg.splitMode);
                ex.cur = null;
                ex.phase = 'gap';
                ex.until = w.tick + 30;
                if (!human(w).cells.length) resetHuman(w, cfg.startMass, 0, 0);
            }
        },
        result: function (w) {
            var log = w.ex.log, hits = log.filter(function (r) { return r.ok; }), s = 0;
            log.forEach(function (r) { s += r.score || 0; });
            var avg = hits.length ? Math.round(hits.reduce(function (a, r) { return a + r.ms; }, 0) / hits.length) : 0;
            var tech = log.filter(function (r) { return r.ok && (w.cfg.splitMode === 'pop' ? r.splits === 2 && r.delay >= 80 && r.delay <= 240 : r.splits === SPLIT_NEED[w.cfg.splitMode]); }).length;
            return { ok: hits.length >= Math.ceil(log.length * 0.7) && log.length > 0, score: s, lines: [['hits', hits.length + ' / ' + log.length], ['avgTime', avg + ' ms'], ['technique', tech + ' / ' + log.length]], rounds: log.map(function (r) { return { ok: r.ok, ms: r.ms, splits: r.splits, delay: r.delay, score: r.score }; }) };
        }
    };
    EXERCISE_IMPL.virus = {
        setup: function (w) {
            w.ex = { round: 0, phase: 'gap', until: 0, log: [], cur: null };
            w.ex.targetP = newPlayer(w, { name: 'Target', ai: { lvl: 1, mode: 'dummy' }, passive: true, noLb: true });
            resetHuman(w, w.cfg.startMass, 0, 0);
            w.ex.onEject = function (w2, p) { if (p.human && w2.ex.cur) w2.ex.cur.ejects++; };
            w.ex.onPop = function (w2, A, V) {
                var cur = w2.ex.cur;
                if (!cur) return;
                if (A.o === w2.ex.targetP.idx && V.shot) { cur.ok = true; cur.ms = (w2.tick - cur.start) * TICK_MS; }
                else if (A.o === HUMAN) cur.selfPop = true;
            };
        },
        update: function (w) {
            var ex = w.ex, cfg = w.cfg;
            if (ex.phase === 'gap') {
                if (w.tick < ex.until) return;
                if (ex.round >= cfg.rounds) { finish(w, 'done'); return; }
                ex.round++;
                /* remove the last round's viruses and blobs */
                for (var i = 0; i < w.cells.length; i++) { var c = w.cells[i]; if (c.k === K_VIRUS || c.k === K_EJECT) kill(w, c, null); }
                var hc = resetHuman(w, cfg.startMass, 0, 0);
                clearOwner(w, ex.targetP);
                var a = w.rnd() * Math.PI * 2, vd = hc.r + 260;
                var vx = Math.cos(a) * vd, vy = Math.sin(a) * vd;
                var off = (cfg.difficulty - 1) * (w.rnd() * 0.7 - 0.35), td = 480 + (cfg.difficulty - 1) * 70;
                addCell(w, K_VIRUS, null, vx, vy, VIRUS_MASS, { color: [51, 255, 51] });
                w.virusN++;
                addCell(w, K_PLAYER, ex.targetP, vx + Math.cos(a + off) * td, vy + Math.sin(a + off) * td, 300);
                ex.cur = { ok: false, ms: 0, ejects: 0, start: w.tick, selfPop: false };
                ex.phase = 'play';
                ex.until = w.tick + Math.round(15000 / TICK_MS);
                return;
            }
            if (ex.cur.ok || ex.cur.selfPop || w.tick >= ex.until) {
                var r = ex.cur;
                r.score = r.ok ? 100 + clamp(60 - (r.ejects - VIRUS_FEED) * 10, 0, 60) + clamp(Math.round(80 - r.ms / 125), 0, 80) : 0;
                ex.log.push(r);
                ex.cur = null;
                ex.phase = 'gap';
                ex.until = w.tick + 30;
            }
        },
        result: function (w) {
            var log = w.ex.log, hits = log.filter(function (r) { return r.ok; }), s = 0, ej = 0;
            log.forEach(function (r) { s += r.score || 0; if (r.ok) ej += r.ejects; });
            return { ok: hits.length >= Math.ceil(log.length * 0.6) && log.length > 0, score: s, lines: [['hits', hits.length + ' / ' + log.length], ['feedsPerShot', hits.length ? (ej / hits.length).toFixed(1) : '-'], ['selfPops', log.filter(function (r) { return r.selfPop; }).length]] };
        }
    };
    EXERCISE_IMPL.dodge = {
        setup: function (w) {
            var h = w.half, goals = [];
            for (var i = 0; i < 6; i++) goals.push({ x: -h * 0.75 + i * (h * 1.5 / 5) + (w.rnd() - 0.5) * h * 0.1, y: (i % 2 ? 1 : -1) * h * (0.45 + w.rnd() * 0.25), r: 90 });
            var start = { x: -h * 0.85, y: 0 };
            w.ex = { goals: goals, next: 0, pops: 0, start: start, clear: [{ x: start.x, y: start.y, r: radius(w.cfg.startMass) + 350 }].concat(goals.map(function (g) { return { x: g.x, y: g.y, r: 260 }; })) };
            addCell(w, K_PLAYER, human(w), start.x, start.y, w.cfg.startMass);
            human(w).mx = start.x; human(w).my = start.y;
            w.ex.onPop = function (w2, A) { if (A.o === HUMAN) w2.ex.pops++; };
        },
        update: function (w) {
            var ex = w.ex, g = ex.goals[ex.next], p = human(w);
            if (g) {
                for (var i = 0; i < p.cells.length; i++) {
                    if (Math.hypot(p.cells[i].x - g.x, p.cells[i].y - g.y) < p.cells[i].r + g.r * 0.5) { ex.next++; ex.lastAt = w.tick; break; }
                }
            }
            if (ex.next >= ex.goals.length) finish(w, 'done');
            else if (secs(w) >= w.cfg.duration) finish(w, 'time');
        },
        result: function (w) {
            var ex = w.ex, all = ex.next >= ex.goals.length, left = Math.max(0, w.cfg.duration - secs(w));
            return { ok: all && ex.pops === 0, score: ex.next * 150 - ex.pops * 100 + (all ? left * 3 : 0), lines: [['goals', ex.next + ' / ' + ex.goals.length], ['pops', ex.pops], ['time', secs(w).toFixed(1) + ' s']] };
        }
    };
    /* a smooth seeded path of pellets (sum of two sines), resampled every 70 units of length */
    function makePath(w) {
        var L = Math.min(w.cfg.mapSize * 0.7, 3200), lvl = w.cfg.difficulty;
        var A1 = 200 + lvl * 110, A2 = lvl >= 3 ? 90 + lvl * 40 : 0, f1 = 0.8 + w.rnd() * 0.6 + lvl * 0.2, f2 = 2.5 + w.rnd() * 1.5;
        var p1 = w.rnd() * 6.283, p2 = w.rnd() * 6.283, dense = [];
        for (var i = 0; i <= 400; i++) {
            var t = i / 400;
            dense.push({ x: -L / 2 + L * t, y: A1 * Math.sin(6.283 * f1 * t + p1) + A2 * Math.sin(6.283 * f2 * t + p2) });
        }
        var pts = [dense[0]], acc = 0;
        for (i = 1; i < dense.length && pts.length < 90; i++) {
            acc += Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y);
            if (acc >= 70) { pts.push(dense[i]); acc = 0; }
        }
        return pts;
    }
    function distToPath(pts, x, y) {
        var best = Infinity;
        for (var i = 1; i < pts.length; i++) {
            var a = pts[i - 1], b = pts[i], vx = b.x - a.x, vy = b.y - a.y, l2 = vx * vx + vy * vy;
            var t = l2 ? clamp(((x - a.x) * vx + (y - a.y) * vy) / l2, 0, 1) : 0;
            var d = Math.hypot(a.x + vx * t - x, a.y + vy * t - y);
            if (d < best) best = d;
        }
        return best;
    }
    EXERCISE_IMPL.path = {
        setup: function (w) {
            w.foodMax = 0;
            var pts = makePath(w);
            w.ex = { path: pts, total: pts.length - 1, eaten: 0, dev: 0, devN: 0 };
            for (var i = 1; i < pts.length; i++) addCell(w, K_FOOD, null, pts[i].x, pts[i].y, 1, { pellet: true, color: [255, 215, 0] });
            addCell(w, K_PLAYER, human(w), pts[0].x, pts[0].y, w.cfg.startMass);
            human(w).mx = pts[0].x; human(w).my = pts[0].y;
            w.ex.onFood = function (w2, A, B) { if (B.pellet && A.o === HUMAN) w2.ex.eaten++; };
        },
        update: function (w) {
            var ex = w.ex, c = centre(human(w));
            if (c && ex.eaten < ex.total) { ex.dev += distToPath(ex.path, c.x, c.y); ex.devN++; }
            if (ex.eaten >= ex.total) finish(w, 'done');
            else if (secs(w) >= w.cfg.duration) finish(w, 'time');
        },
        result: function (w) {
            var ex = w.ex, all = ex.eaten >= ex.total, dev = ex.devN ? ex.dev / ex.devN : 0, left = Math.max(0, w.cfg.duration - secs(w));
            return { ok: ex.eaten >= ex.total * 0.9, score: ex.eaten * 20 + (all ? left * 5 : 0) - Math.max(0, dev - 30) * 2, lines: [['pellets', ex.eaten + ' / ' + ex.total], ['deviation', Math.round(dev)], ['time', secs(w).toFixed(1) + ' s']] };
        }
    };
    EXERCISE_IMPL.feed = {
        setup: function (w) {
            var mate = newPlayer(w, { name: 'Teammate', ai: { lvl: 1, mode: 'dummy' }, passive: true, shield: true, color: [120, 230, 90] });
            w.ex = { mate: mate, got: 0, shots: 0, moveAt: 0 };
            addCell(w, K_PLAYER, human(w), 0, 0, w.cfg.startMass);
            var a = w.rnd() * Math.PI * 2;
            addCell(w, K_PLAYER, mate, Math.cos(a) * 450, Math.sin(a) * 450, 300);
            w.ex.onEject = function (w2, p, n) { if (p.human) w2.ex.shots += n; };
            w.ex.onEjectEaten = function (w2, A, B) { if (A.o === mate.idx && B.src === HUMAN) w2.ex.got += B.m; };
            w.ex.moveAt = w.tick + [0, 0, 125, 75, 75][w.cfg.difficulty];
        },
        update: function (w) {
            var ex = w.ex, lvl = w.cfg.difficulty, mc = ex.mate.cells[0];
            if (mc && lvl >= 2 && w.tick >= ex.moveAt) {
                var hc = centre(human(w)) || { x: 0, y: 0 }, a = w.rnd() * Math.PI * 2, d = 400 + w.rnd() * 300;
                if (lvl >= 4) { ex.mate.ai.drift = true; ex.mate.mx = clamp(hc.x + Math.cos(a) * d, -w.half, w.half); ex.mate.my = clamp(hc.y + Math.sin(a) * d, -w.half, w.half); }
                else { mc.x = clamp(hc.x + Math.cos(a) * d, -w.half + 200, w.half - 200); mc.y = clamp(hc.y + Math.sin(a) * d, -w.half + 200, w.half - 200); }
                ex.moveAt = w.tick + (lvl >= 3 ? 75 : 125);
            }
            /* the teammate stays a teammate-sized target */
            if (mc && mc.m > 600) setMass(mc, 600);
            if (secs(w) >= w.cfg.duration) finish(w, 'time');
        },
        result: function (w) {
            var ex = w.ex, acc = ex.shots ? ex.got / (ex.shots * EJECT_MASS) : 0;
            return { ok: acc >= 0.7 && ex.got >= 300, score: ex.got + acc * 500, lines: [['fed', Math.round(ex.got)], ['accuracy', Math.round(acc * 100) + '%'], ['shots', ex.shots]] };
        }
    };
    EXERCISE_IMPL.merge = {
        setup: function (w) {
            var p = human(w), n = 8, m = w.cfg.startMass / n, r = radius(m), ring = r * 2.6;
            for (var i = 0; i < n; i++) {
                var a = i / n * Math.PI * 2 + w.rnd() * 0.3;
                var c = addCell(w, K_PLAYER, p, Math.cos(a) * ring, Math.sin(a) * ring, m);
                c.mergeAt = mergeTicks(w, m);
            }
            p.mx = 0; p.my = 0;
            w.ex = { ready: mergeTicks(w, m), done: -1 };
        },
        update: function (w) {
            var ex = w.ex, p = human(w);
            if (ex.done < 0 && p.cells.length === 1 && w.tick >= ex.ready) { ex.done = w.tick; finish(w, 'done'); return; }
            if (w.tick > ex.ready + Math.round(30000 / TICK_MS)) finish(w, 'time');
        },
        result: function (w) {
            var ex = w.ex, ms = ex.done >= 0 ? (ex.done - ex.ready) * TICK_MS : -1;
            return { ok: ms >= 0 && ms <= 6000, score: ms >= 0 ? 1000 * clamp(1 - ms / 15000, 0, 1) : 0, lines: [['mergeTime', ms >= 0 ? (ms / 1000).toFixed(2) + ' s' : '-'], ['cells', human(w).cells.length]] };
        }
    };

    /* ------------------------------------------------------------------ */
    /* Packets (MultiOgar private-server layout, as ogario.v4.js reads it) */
    /* ------------------------------------------------------------------ */
    function Writer() { this.b = new Uint8Array(4096); this.n = 0; }
    Writer.prototype.room = function (k) {
        if (this.n + k <= this.b.length) return;
        var nb = new Uint8Array(Math.max(this.b.length * 2, this.n + k + 1024));
        nb.set(this.b.subarray(0, this.n));
        this.b = nb;
    };
    Writer.prototype.u8 = function (v) { this.room(1); this.b[this.n++] = v & 255; };
    Writer.prototype.u16 = function (v) { this.room(2); this.b[this.n++] = v & 255; this.b[this.n++] = (v >>> 8) & 255; };
    Writer.prototype.u32 = function (v) { this.room(4); for (var i = 0; i < 4; i++) this.b[this.n++] = (v >>> (8 * i)) & 255; };
    Writer.prototype.i32 = function (v) { this.u32(v | 0); };
    Writer.prototype.f64 = function (v) { this.room(8); var dv = new DataView(this.b.buffer, this.n, 8); dv.setFloat64(0, v, true); this.n += 8; };
    /* names are UTF-8, zero-terminated (the client decodes them with decodeURIComponent(escape())) */
    Writer.prototype.str = function (s) {
        s = unescape(encodeURIComponent(String(s || '')));
        this.room(s.length + 1);
        for (var i = 0; i < s.length; i++) this.b[this.n++] = s.charCodeAt(i) & 255;
        this.b[this.n++] = 0;
    };
    Writer.prototype.done = function () { return this.b.slice(0, this.n).buffer; };

    function encodeClear() { return new Uint8Array([18]).buffer; }
    function encodeBorder(w) {
        var b = new Writer();
        b.u8(64); b.f64(-w.half); b.f64(-w.half); b.f64(w.half); b.f64(w.half);
        return b.done();
    }
    function encodeAddOwn(id) { var b = new Writer(); b.u8(32); b.u32(id); return b.done(); }
    function encodeLeaderboard(w) {
        var list = w.players.filter(function (p) { return p.cells.length && !p.noLb; })
            .map(function (p) { var c = centre(p); return { p: p, m: c ? c.m : 0 }; })
            .sort(function (a, b) { return b.m - a.m || a.p.idx - b.p.idx; }).slice(0, 10);
        var b = new Writer();
        b.u8(49); b.u32(list.length);
        list.forEach(function (e) { b.u32(e.p.human ? 1 : 0); b.str(e.p.name); });
        return b.done();
    }
    /* what the client is shown: a box around the human's cells, larger when it is bigger */
    function viewBox(w, view) {
        var p = human(w), c = centre(p);
        if (c) {
            var size = 0;
            for (var i = 0; i < p.cells.length; i++) size += p.cells[i].r;
            var scale = Math.pow(Math.min(64 / size, 1), 0.4);
            view.cx = c.x; view.cy = c.y; view.hw = 1500 / scale; view.hh = 1100 / scale;
        } else if (view.hw == null) { view.cx = 0; view.cy = 0; view.hw = 2000; view.hh = 1500; }
        return view;
    }
    function createView() { return { known: new Map(), started: false, lbAt: -999, cx: 0, cy: 0, hw: null, hh: null }; }
    var TYPE_OF = [0, 1, 2, 3];
    /* this tick's packets for the client: border and clear first, then own cells (32) before
     * the update (16) that holds them, then the leaderboard twice a second */
    function encodeFrame(w, view) {
        var out = [];
        if (!view.started) { out.push(encodeClear()); out.push(encodeBorder(w)); view.started = true; }
        for (var i = 0; i < w.ev.own.length; i++) out.push(encodeAddOwn(w.ev.own[i]));
        viewBox(w, view);
        var b = new Writer(), known = view.known, eats = w.ev.eats, eatPairs = [];
        for (i = 0; i + 1 < eats.length; i += 2) if (known.has(eats[i + 1])) { eatPairs.push(eats[i], eats[i + 1]); known.delete(eats[i + 1]); }
        b.u8(16);
        b.u16(eatPairs.length / 2);
        for (i = 0; i < eatPairs.length; i++) b.u32(eatPairs[i]);
        var seen = new Set(), x0 = view.cx - view.hw, x1 = view.cx + view.hw, y0 = view.cy - view.hh, y1 = view.cy + view.hh;
        for (i = 0; i < w.cells.length; i++) {
            var c = w.cells[i];
            if (c.dead || c.x + c.r < x0 || c.x - c.r > x1 || c.y + c.r < y0 || c.y - c.r > y1) continue;
            var x = Math.round(c.x), y = Math.round(c.y), s = Math.round(c.r), k = known.get(c.id);
            seen.add(c.id);
            if (k && k.x === x && k.y === y && k.s === s) continue;
            var fresh = !k;
            var flags = 0x80 | (c.k === K_VIRUS ? 1 : 0) | (c.k === K_EJECT ? 32 : 0) | (fresh && c.color ? 2 : 0) | (fresh && c.name ? 8 : 0);
            b.u32(c.id); b.i32(x); b.i32(y); b.u16(s); b.u8(flags);
            if (flags & 2) { b.u8(c.color[0]); b.u8(c.color[1]); b.u8(c.color[2]); }
            if (flags & 8) b.str(c.name);
            b.u16(TYPE_OF[c.k]); b.u8(0); /* cell type (1 = food) + empty party code */
            if (k) { k.x = x; k.y = y; k.s = s; } else known.set(c.id, { x: x, y: y, s: s });
        }
        b.u32(0);
        var gone = [];
        known.forEach(function (v, id) { if (!seen.has(id)) gone.push(id); });
        b.u16(gone.length);
        for (i = 0; i < gone.length; i++) { b.u32(gone[i]); known.delete(gone[i]); }
        out.push(b.done());
        if (w.tick - view.lbAt >= 12) { view.lbAt = w.tick; out.push(encodeLeaderboard(w)); }
        w.ev = { eats: [], own: [] };
        return out;
    }
    /* reads an update the way updateCells reads a non-integrity private server (tests) */
    function decodeUpdate(buf) {
        var dv = new DataView(buf), o = 0, r = { eats: [], cells: [], removes: [] };
        var str = function () { var s = ''; for (; ;) { var ch = dv.getUint8(o++); if (!ch) break; s += String.fromCharCode(ch); } try { return decodeURIComponent(escape(s)); } catch (e) { return s; } };
        if (dv.getUint8(o++) !== 16) return null;
        var n = dv.getUint16(o, true); o += 2;
        for (var i = 0; i < n; i++) { r.eats.push([dv.getUint32(o, true), dv.getUint32(o + 4, true)]); o += 8; }
        for (; ;) {
            var id = dv.getUint32(o, true); o += 4;
            if (!id) break;
            var c = { id: id, x: dv.getInt32(o, true), y: dv.getInt32(o + 4, true), size: dv.getUint16(o + 8, true) };
            o += 10;
            var flags = dv.getUint8(o++);
            if (flags & 2) { c.color = [dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2)]; o += 3; }
            if (flags & 4) c.skin = str();
            if (flags & 8) c.name = str();
            if (flags & 0x40) { c.owner = dv.getUint16(o, true); o += 2; }
            if (flags & 0x80) { c.type = dv.getUint16(o, true); o += 2; c.party = str(); }
            c.virus = !!(flags & 1); c.ejected = !!(flags & 32);
            c.food = c.type >= 0 ? c.type === 1 || c.type === 5 : (c.size <= 30 && !c.name);
            r.cells.push(c);
        }
        n = dv.getUint16(o, true); o += 2;
        for (i = 0; i < n; i++) { r.removes.push(dv.getUint32(o, true)); o += 4; }
        r.length = o;
        return r;
    }
    /* the client's packets (sendPosition, sendSplit, sendEject, spawn) -> commands */
    var MACRO_SPLITS = { 28: 2, 26: 3, 27: 4 };
    function decodeClient(buf) {
        if (!buf) return null;
        var u = buf instanceof Uint8Array ? buf : new Uint8Array(buf.buffer ? buf.buffer : buf, buf.byteOffset || 0, buf.byteLength);
        if (!u.length) return null;
        var op = u[0];
        if (op === 16 && u.length >= 9) {
            var dv = new DataView(u.buffer, u.byteOffset, u.length);
            return { t: 'move', x: dv.getInt32(1, true), y: dv.getInt32(5, true) };
        }
        if (op === 17) return { t: 'split', n: 1 };
        if (MACRO_SPLITS[op]) return { t: 'split', n: MACRO_SPLITS[op] };
        if (op === 21) return { t: 'eject' };
        if (op === 0) return { t: 'spawn' };
        if (op === 1) return { t: 'spectate' };
        return null;
    }

    /* ------------------------------------------------------------------ */
    /* Personal bests and ghosts (localStorage JSON, validated on read)    */
    /* ------------------------------------------------------------------ */
    var MAX_BESTS = 24, MAX_GHOST = 600, MAX_HIST = 100;
    /* at most MAX_GHOST samples (t, x, y, mass) kept evenly */
    function thinGhost(flat) {
        var n = Math.floor(flat.length / 4);
        if (n <= MAX_GHOST) return flat.slice(0, n * 4);
        var out = [], stepN = n / MAX_GHOST;
        for (var i = 0; i < MAX_GHOST; i++) { var j = Math.floor(i * stepN) * 4; out.push(flat[j], flat[j + 1], flat[j + 2], flat[j + 3]); }
        var last = (n - 1) * 4;
        out.splice(out.length - 4, 4, flat[last], flat[last + 1], flat[last + 2], flat[last + 3]);
        return out;
    }
    function cleanGhost(g) {
        if (!Array.isArray(g) || g.length % 4 || g.length > MAX_GHOST * 4) return null;
        var prev = -1;
        for (var i = 0; i < g.length; i += 4) {
            if (!Number.isInteger(g[i]) || g[i] < prev || g[i] > 600000) return null;
            prev = g[i];
            for (var j = 1; j < 4; j++) if (!isNum(g[i + j]) || Math.abs(g[i + j]) > 1e6) return null;
            if (g[i + 3] < 0) return null;
        }
        return g;
    }
    function emptyStore() { return { v: 1, best: {}, hist: [] }; }
    function validateStore(o) {
        var s = emptyStore();
        if (!o || typeof o !== 'object' || o.v !== 1) return s;
        if (o.best && typeof o.best === 'object' && !Array.isArray(o.best)) {
            Object.keys(o.best).forEach(function (k) {
                var b = o.best[k];
                if (!KEY_RE.test(k) || !b || typeof b !== 'object') return;
                if (!isNum(b.s) || b.s < 0 || b.s > 1e7 || !isNum(b.t) || b.t < 0) return;
                var g = b.g == null ? [] : cleanGhost(b.g);
                if (!g) return;
                s.best[k] = { s: Math.round(b.s), t: b.t, ok: !!b.ok, d: Number.isInteger(b.d) && b.d >= 0 ? b.d : 0, g: g };
            });
            var keys = Object.keys(s.best);
            if (keys.length > MAX_BESTS) keys.sort(function (a, b) { return s.best[b].t - s.best[a].t; }).slice(MAX_BESTS).forEach(function (k) { delete s.best[k]; });
        }
        if (Array.isArray(o.hist)) {
            s.hist = o.hist.filter(function (h) { return h && typeof h === 'object' && KEY_RE.test(h.k) && isNum(h.s) && h.s >= 0 && h.s <= 1e7 && isNum(h.t); })
                .slice(-MAX_HIST).map(function (h) { return { k: h.k, s: Math.round(h.s), t: h.t, ok: !!h.ok }; });
        }
        return s;
    }
    /* records a finished run; returns { store, best: true when it is a new personal best } */
    function recordRun(store, key, result, samples, now) {
        store = validateStore(store);
        var prev = store.best[key], isBest = !prev || result.score > prev.s;
        if (isBest) store.best[key] = { s: result.score, t: now, ok: !!result.ok, d: result.ticks | 0, g: thinGhost(samples || []) };
        store.hist.push({ k: key, s: result.score, t: now, ok: !!result.ok });
        if (store.hist.length > MAX_HIST) store.hist = store.hist.slice(-MAX_HIST);
        return { store: validateStore(store), best: isBest, prev: prev ? prev.s : null };
    }
    /* position and mass of a ghost at a tick (linear between samples), null outside it */
    function ghostAt(g, tick) {
        if (!g || g.length < 4) return null;
        var n = g.length / 4;
        if (tick < g[0] || tick > g[(n - 1) * 4]) return null;
        var lo = 0, hi = n - 1;
        while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (g[mid * 4] <= tick) lo = mid; else hi = mid - 1; }
        var a = lo * 4, b = Math.min(n - 1, lo + 1) * 4, span = g[b] - g[a], f = span > 0 ? (tick - g[a]) / span : 0;
        if (g[a + 3] <= 0) return null;
        return { x: g[a + 1] + (g[b + 1] - g[a + 1]) * f, y: g[a + 2] + (g[b + 2] - g[a + 2]) * f, m: g[a + 3] + (g[b + 3] - g[a + 3]) * f };
    }
    /* a short text that changes with every cell (determinism tests) */
    function hash(w) {
        var h = 2166136261 >>> 0, s = w.tick + ';';
        for (var i = 0; i < w.cells.length; i++) { var c = w.cells[i]; s += c.id + ',' + Math.round(c.x * 100) + ',' + Math.round(c.y * 100) + ',' + Math.round(c.m * 1000) + ';'; }
        for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return h.toString(16) + ':' + w.cells.length;
    }

    var API = {
        TICK_MS: TICK_MS, MAX_CELLS: MAX_CELLS, EAT_RATIO: EAT_RATIO, VIRUS_MASS: VIRUS_MASS, VIRUS_FEED: VIRUS_FEED, MIN_SPLIT: MIN_SPLIT,
        K_PLAYER: K_PLAYER, K_FOOD: K_FOOD, K_VIRUS: K_VIRUS, K_EJECT: K_EJECT,
        FIELDS: FIELDS, EXERCISES: EXERCISES, EX_IDS: EX_IDS, SPLIT_MODES: SPLIT_MODES, SPLIT_NEED: SPLIT_NEED,
        rng: rng, radius: radius, speedOf: speedOf, sanitizeConfig: sanitizeConfig, withDefaults: withDefaults, bestKey: bestKey,
        createWorld: createWorld, step: step, input: input, finish: finish, human: human, centre: centre, addCell: addCell,
        newPlayer: newPlayer, splitOnce: splitOnce, ejectOnce: ejectOnce, popPieces: popPieces, mergeTicks: mergeTicks, buildGrid: buildGrid,
        splitReach: splitReach, scoreSplitRound: scoreSplitRound, distToPath: distToPath, secs: secs,
        createView: createView, encodeFrame: encodeFrame, encodeBorder: encodeBorder, encodeClear: encodeClear, encodeAddOwn: encodeAddOwn,
        encodeLeaderboard: encodeLeaderboard, decodeUpdate: decodeUpdate, decodeClient: decodeClient,
        thinGhost: thinGhost, validateStore: validateStore, recordRun: recordRun, ghostAt: ghostAt, emptyStore: emptyStore, hash: hash
    };
    if (typeof module === 'object' && module && module.exports) module.exports = API;
    if (root) root.LMPracticeSim = API;
})(typeof window !== 'undefined' ? window : null);
