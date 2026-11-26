/* Dense-world acceptance benchmark, in the page (window.LMBenchDense).
 *
 * Runs seeded synthetic worlds through the real client: the world is encoded as MultiOgar
 * private-server packets (the layout ogario/modules/practice-sim.js uses) and fed to
 * legendmod.handleMessage through a stand-in socket, as the Practice arena does. A second
 * socket is a real multibox unit (spect.js Spect) on a stand-in socket, fed in the unit
 * layout. Nothing is sent to any server. Camera position and zoom are fixed for every scene.
 *
 * Measured per scene: frame interval p50/p95/p99 and sustained FPS, renderFrame CPU, CPU self
 * time of the timed parts (the perf.js scope names plus jelly prepare / build, food, eligibility),
 * the share of frames drawn by the WebGL scene (the others fell back to Canvas2D), then, in a
 * separate short pass that is not timed, WebGL draw calls / instances / vertices, time spent in
 * GL upload calls, label rasters, Canvas2D calls, jelly points submitted and indexed, the JS heap.
 * capture() draws one deterministic frame (static world, seeded Math.random, fresh jelly
 * points) and returns the world layers composited into one PNG, for pixel comparisons.
 *
 * From the browser console of the game page:
 *   $.getScript('https://www.legendmod.ml/developers/tests/lib/bench-scene.js').then(function () {
 *       LMBenchDense.runAll('quick').then(function (r) { console.log(LMBenchDense.summary(r)); });
 *   });
 * It leaves the current server like a replay or the Practice arena does.
 * node developers/tests/bench.js drives the same code in headless Chrome (lib/bench-client.js).
 * In Node (require) only the pure parts load: scenes, world, packets, statistics. */
(function (root) {
    'use strict';
    var VERSION = 1;

    /* ------------------------------------------------------------------ */
    /* Pure parts (also used by developers/tests/bench-dense.js in Node)   */
    /* ------------------------------------------------------------------ */

    /* Park-Miller LCG, as bench-dense.js */
    function makeRng(seed) {
        var s = (seed >>> 0) || 1;
        return function () {
            s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    var VIEW = { w: 1600, h: 900, scale: 0.4 };
    var TICK_MS = 40;
    var MAP_HALF = 7071;
    var PALETTE = [[255, 64, 64], [64, 160, 255], [80, 220, 120], [255, 200, 40], [190, 90, 255], [255, 130, 40], [40, 220, 220], [240, 90, 170]];

    /* One scene: bodies (non-food), food, sockets (1 = main, 2 = main + one multibox unit),
     * jelly and labels (nick + mass) on/off, layout 'spread', 'crowd' (all bodies overlapping
     * in a small area) or 'wide' (bodies and food over 4 x 4 views, most of them off screen),
     * sizeMul (bigger cells: more jelly points), bots: like Expanding Land's bots, every player has
     * its own name and skin URL (a different image per player, BOT_SKINS) and this share of the
     * players dies and comes back each tick with a new id, name and skin (0: names only, as before;
     * botSkins false: no skins). */
    function scene(o) {
        var s = {
            bodies: o.bodies | 0, food: o.food | 0, sockets: o.sockets || 1, jelly: o.jelly !== false, labels: o.labels !== false,
            layout: o.layout || 'spread', sizeMul: o.sizeMul || 1, seed: o.seed || 4242,
            /* socketIds: every connection numbers the cells itself, as agar.io does (the unit's ids
             * differ from the main socket's, so copies are matched by position, not by id) */
            socketIds: !!o.socketIds, bots: +o.bots || 0, botSkins: o.botSkins !== false
        };
        s.name = o.name || ('b' + s.bodies + '-f' + s.food + '-s' + s.sockets + (s.jelly ? '' : '-nojelly') + (s.labels ? '' : '-nolabels') +
            (s.layout !== 'spread' ? '-' + s.layout : '') + (s.sizeMul !== 1 ? '-x' + s.sizeMul : '') + (s.socketIds ? '-ids' : '') + (s.bots ? '-bots' + s.bots + (s.botSkins ? '' : '-noskins') : ''));
        return s;
    }
    /* skins of the bot scenes: 512 px images of this repository (the flag skins) */
    var BOT_SKINS = ('2ch,4chan,8ch,9gag,alan,alaska,argentina,asiatic,australia,austria,ayy-lmao,bait,bangladesh,bart,beavis,belarus,belgium,' +
        'boris,bosnia,botswana,brazil,bread,brian,bulgaria,bush,byzantium,cambodia,canada,chile,china,cia,cobra,confederate,croatia,croco,cuba,' +
        'denmark,doge,dollar,doraemon,earth,estonia,european-union,facebook,facepunch,finland,france,french-kingdom,german-empire,germany,greece,' +
        'greyzilla,heisenberg,homer,hong-kong,horror,hungary,illuminati,imperial-japan,india,indiana,indonesia,iran,iraq,ireland,israel,italy,' +
        'jamaica,japan,latvia,lithuania,luigi,luxembourg,mario,mars,mexico,nasa,netherlands,nigeria,ninja,north-korea,norway,pakistan,peru,' +
        'poland,portugal,prussia,python,quebec,reddit,romania,scotland,slovakia,somalia,sonic,spain,superman,sweden,switzerland,thailand,' +
        'vendetta,venezuela,watermelon,yoda,yugoslavia,zelda').split(',').map(function (n) { return 'https://www.legendmod.ml/agario/live/flags/' + n + '.png'; });
    /* quick: a few scenes; default: the bodies x food table plus the variations at 1000 bodies /
     * 10k food and the crowded / many-points scenes; full: every combination. */
    function matrix(kind) {
        var out = [];
        /* bots: like Expanding Land with ~110 bots in view, names and skins; with respawns
         * (0.004 of the players per 40 ms tick, about 4 new players a second) and without */
        if (kind === 'bots') {
            out.push(scene({ bodies: 150, food: 2000 }), scene({ bodies: 150, food: 2000, bots: 0.004, botSkins: false }),
                scene({ bodies: 150, food: 2000, bots: 0.0001 }), scene({ bodies: 150, food: 2000, bots: 0.004 }));
            return out;
        }
        if (kind === 'quick') {
            out.push(scene({ bodies: 100, food: 2000 }), scene({ bodies: 1000, food: 10000 }), scene({ bodies: 1000, food: 10000, sockets: 2 }),
                scene({ bodies: 500, food: 2000, layout: 'crowd' }));
            return out;
        }
        var B = [100, 500, 1000, 2000], F = [2000, 10000];
        if (kind === 'full') {
            B.forEach(function (b) {
                F.forEach(function (f) {
                    [1, 2].forEach(function (k) {
                        [true, false].forEach(function (j) { [true, false].forEach(function (l) { out.push(scene({ bodies: b, food: f, sockets: k, jelly: j, labels: l })); }); });
                    });
                });
            });
        } else {
            B.forEach(function (b) { F.forEach(function (f) { out.push(scene({ bodies: b, food: f })); }); });
            out.push(scene({ bodies: 1000, food: 10000, jelly: false }), scene({ bodies: 1000, food: 10000, labels: false }),
                scene({ bodies: 1000, food: 10000, jelly: false, labels: false }), scene({ bodies: 1000, food: 10000, sockets: 2 }),
                scene({ bodies: 2000, food: 10000, sockets: 2 }));
        }
        out.push(scene({ bodies: 1000, food: 2000, layout: 'crowd' }), scene({ bodies: 1000, food: 2000, layout: 'crowd', jelly: false }),
            scene({ bodies: 1500, food: 2000, sizeMul: 2.5 }), scene({ bodies: 2000, food: 10000, layout: 'wide' }));
        return out;
    }

    /* The seeded world: own cell(s), bodies grouped into players (shared nick and colour),
     * viruses, coincident split pieces, a few off screen, and food. Units are world units; the
     * camera is at (0, 0). */
    function createWorld(spec) {
        var rnd = makeRng(spec.seed + spec.bodies * 7 + spec.food * 3 + (spec.layout === 'crowd' ? 11 : 0));
        var vw = VIEW.w / VIEW.scale, vh = VIEW.h / VIEW.scale;
        var w = { spec: spec, rnd: rnd, tick: 0, nextId: 10, bodies: [], food: [], own: [], vw: vw, vh: vh, removedFood: [], addedFood: [], removedBodies: [], players: 0 };
        /* main socket's own cell in the middle, the unit's own cell to the right */
        w.own.push({ id: 1, x: 0, y: 0, r: 150, vx: 0, vy: 0, color: [0, 200, 255], name: 'Bench', unit: 0 });
        if (spec.sockets > 1) w.own.push({ id: 2, x: 700, y: 120, r: 130, vx: 0, vy: 0, color: [255, 120, 0], name: 'Unit', unit: 1 });
        var crowd = spec.layout === 'crowd', wide = spec.layout === 'wide', span = wide ? 4 : 1.25;
        var spanX = crowd ? 2600 : vw * span, spanY = crowd ? 2000 : vh * span;
        function size() {
            var r = rnd(), s;
            if (r < 0.7) s = 32 + rnd() * 50; else if (r < 0.95) s = 82 + rnd() * 170; else s = 250 + rnd() * 450;
            return Math.round(s * spec.sizeMul);
        }
        var made = 0, player = 0;
        while (made < spec.bodies) {
            var r = rnd();
            if (r < 0.08) {
                w.bodies.push({ id: w.nextId++, x: (rnd() - 0.5) * spanX, y: (rnd() - 0.5) * spanY, r: 100, vx: 0, vy: 0, virus: true, color: [51, 255, 51], name: '' });
                made++;
                continue;
            }
            /* a player of 1-8 pieces around one point (coincident pieces now and then) */
            player++;
            var n = 1 + ((rnd() * 8) | 0), cx = (rnd() - 0.5) * spanX, cy = (rnd() - 0.5) * spanY;
            if (!crowd && rnd() < 0.06) cx = (rnd() < 0.5 ? -1 : 1) * (vw / 2 + 600 + rnd() * 1500);
            var col = PALETTE[(rnd() * PALETTE.length) | 0], nick = spec.bots ? 'Bot ' + player : 'P' + player, vx = (rnd() - 0.5) * 16, vy = (rnd() - 0.5) * 16;
            var skin = spec.bots && spec.botSkins ? BOT_SKINS[player % BOT_SKINS.length] : null;
            var coincident = rnd() < 0.15, s0 = size();
            for (var k = 0; k < n && made < spec.bodies; k++, made++) {
                var s1 = coincident ? s0 : size();
                var px = coincident ? cx : cx + (rnd() - 0.5) * 500, py = coincident ? cy : cy + (rnd() - 0.5) * 500;
                w.bodies.push({ id: w.nextId++, x: Math.round(px), y: Math.round(py), r: s1, vx: vx, vy: vy, virus: false, color: col, name: nick, skin: skin, pl: player });
            }
        }
        w.players = player;
        var fx = vw * (wide ? 4 : 1.5), fy = vh * (wide ? 4 : 1.5);
        for (var f = 0; f < spec.food; f++) w.food.push(newFood(w, fx, fy));
        w.foodSpan = [fx, fy];
        w.box = [crowd ? 1400 : vw * (wide ? 2 : 0.7), crowd ? 1100 : vh * (wide ? 2 : 0.7)];
        return w;
    }
    function newFood(w, fx, fy) {
        var rnd = w.rnd;
        return { id: w.nextId++, x: Math.round((rnd() - 0.5) * fx), y: Math.round((rnd() - 0.5) * fy), r: 10 + ((rnd() * 4) | 0), color: PALETTE[(rnd() * PALETTE.length) | 0] };
    }
    /* One server tick: bodies move (bouncing in a box around the view), 3% of them grow or
     * shrink a little (their mass text changes, as when cells eat), 0.5% of the food is eaten
     * and the same amount appears elsewhere. */
    function step(w) {
        w.tick++;
        var bx = w.box[0], by = w.box[1], i;
        for (i = 0; i < w.bodies.length; i++) {
            var b = w.bodies[i];
            if (b.virus) continue;
            b.x += b.vx; b.y += b.vy;
            if (b.x > bx + 2500 || b.x < -bx - 2500) b.vx = -b.vx;
            else if ((b.x > bx && b.vx > 0 && Math.abs(b.x) < bx + 200) || (b.x < -bx && b.vx < 0 && Math.abs(b.x) < bx + 200)) b.vx = -b.vx;
            if ((b.y > by && b.vy > 0) || (b.y < -by && b.vy < 0)) b.vy = -b.vy;
        }
        var grow = Math.max(1, Math.round(w.bodies.length * 0.03));
        for (i = 0; i < grow; i++) {
            var g = w.bodies[(w.rnd() * w.bodies.length) | 0];
            if (g && !g.virus) g.r = Math.max(32, g.r + (w.rnd() < 0.7 ? 1 + ((w.rnd() * 3) | 0) : -2));
        }
        w.removedFood.length = 0; w.addedFood.length = 0;
        /* bot scenes: players die (their pieces are removed) and come back elsewhere as a new
         * player (new ids, name and skin), as Expanding Land's bots respawn */
        w.removedBodies.length = 0;
        if (w.spec.bots) {
            for (i = 0; i < w.bodies.length; i++) w.bodies[i]._new = false;
            var deaths = w.spec.bots * w.players, pick;
            w.botAcc = (w.botAcc || 0) + deaths;
            while (w.botAcc >= 1) {
                w.botAcc--;
                pick = w.bodies[(w.rnd() * w.bodies.length) | 0];
                if (!pick || pick.virus) continue;
                var dead = pick.pl, np = ++w.players, nx = (w.rnd() - 0.5) * w.box[0] * 2, ny = (w.rnd() - 0.5) * w.box[1] * 2;
                for (var d = 0; d < w.bodies.length; d++) {
                    var bd = w.bodies[d];
                    if (bd.pl !== dead) continue;
                    w.removedBodies.push(bd.id);
                    bd.id = w.nextId++; bd.pl = np; bd.name = 'Bot ' + np; bd.skin = w.spec.botSkins ? BOT_SKINS[np % BOT_SKINS.length] : null;
                    bd.x = Math.round(nx + (w.rnd() - 0.5) * 300); bd.y = Math.round(ny + (w.rnd() - 0.5) * 300); bd._new = true;
                }
            }
        }
        var churn = Math.max(1, Math.round(w.food.length * 0.005));
        for (i = 0; i < churn && w.food.length; i++) {
            var at = (w.rnd() * w.food.length) | 0;
            w.removedFood.push(w.food[at].id);
            w.food[at] = newFood(w, w.foodSpan[0], w.foodSpan[1]);
            w.addedFood.push(w.food[at]);
        }
    }

    function Writer() { this.b = new Uint8Array(1 << 16); this.n = 0; }
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
    Writer.prototype.f64 = function (v) { this.room(8); new DataView(this.b.buffer, this.n, 8).setFloat64(0, v, true); this.n += 8; };
    Writer.prototype.str = function (s) {
        s = String(s || '');
        this.room(s.length + 1);
        for (var i = 0; i < s.length; i++) this.b[this.n++] = s.charCodeAt(i) & 127;
        this.b[this.n++] = 0;
    };
    Writer.prototype.done = function () { return this.b.slice(0, this.n).buffer; };

    function encodeClear() { return new Uint8Array([18]).buffer; }
    function encodeBorder() { var b = new Writer(); b.u8(64); b.f64(-MAP_HALF); b.f64(-MAP_HALF); b.f64(MAP_HALF); b.f64(MAP_HALF); return b.done(); }
    function encodeAddOwn(id) { var b = new Writer(); b.u8(32); b.u32(id); return b.done(); }
    /* the id of a cell on this socket (socketIds: units number cells on their own) */
    var UNIT_ID_SHIFT = 1000000;
    function socketId(spec, unit, id) { return unit > 0 && spec && spec.socketIds ? id + UNIT_ID_SHIFT * unit : id; }

    /* what a socket sees: unit 0 (main) everything, unit 1 the right part of the world */
    function sees(unit, x) { return unit === 0 || x > -300; }
    /* the update packet (16) of one socket. Main: the private-server layout of
     * practice-sim.js (flag 0x80: cell type + party code). Unit: the layout spect.js reads
     * (no 0x80; food is size < 21). fresh: every cell with colour and name. */
    function encodeUpdate(w, unit, fresh) {
        var b = new Writer(), main = unit === 0, i, c;
        b.u8(16);
        b.u16(0);
        function cell(c, type) {
            var isNew = fresh || c._new;
            var flags = (main ? 0x80 : 0) | (type === 2 ? 1 : 0) | (isNew ? 2 : 0) | (isNew && c.skin ? 4 : 0) | (isNew && c.name ? 8 : 0);
            b.u32(socketId(w.spec, unit, c.id)); b.i32(Math.round(c.x)); b.i32(Math.round(c.y)); b.u16(Math.round(c.r)); b.u8(flags);
            if (flags & 2) { b.u8(c.color[0]); b.u8(c.color[1]); b.u8(c.color[2]); }
            if (flags & 4) b.str(c.skin);
            if (flags & 8) b.str(c.name);
            if (main) { b.u16(type); b.u8(0); }
        }
        for (i = 0; i < w.own.length; i++) { c = w.own[i]; if (sees(unit, c.x)) cell(c, 0); }
        for (i = 0; i < w.bodies.length; i++) { c = w.bodies[i]; if (sees(unit, c.x)) cell(c, c.virus ? 2 : 0); }
        if (fresh) { for (i = 0; i < w.food.length; i++) { c = w.food[i]; if (sees(unit, c.x)) cell(c, 1); } }
        else for (i = 0; i < w.addedFood.length; i++) { c = w.addedFood[i]; if (sees(unit, c.x)) { c._new = true; cell(c, 1); c._new = false; } }
        b.u32(0);
        var rem = fresh ? [] : w.removedBodies.length ? w.removedFood.concat(w.removedBodies) : w.removedFood;
        b.u16(rem.length);
        for (i = 0; i < rem.length; i++) b.u32(socketId(w.spec, unit, rem[i]));
        return b.done();
    }

    function percentile(sorted, p) {
        if (!sorted.length) return 0;
        var i = (sorted.length - 1) * p / 100, lo = Math.floor(i), hi = Math.ceil(i);
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
    }
    function dist(a) {
        var s = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; });
        var sum = 0;
        for (var i = 0; i < s.length; i++) sum += s[i];
        return { n: s.length, mean: r2(s.length ? sum / s.length : 0), p50: r2(percentile(s, 50)), p95: r2(percentile(s, 95)), p99: r2(percentile(s, 99)), max: r2(s.length ? s[s.length - 1] : 0) };
    }
    function r2(x) { return Math.round(x * 100) / 100; }

    /* timed parts: self time between two frames, like perf.js createScopes (a part called
     * inside another counts only for itself) */
    /* 'jelly physics' is the inline marker of renderFrame around prepare + build + the
     * movePoints loop: with prepare and build timed on their own, its self time is the loop */
    var STAGES = ['packets', 'cells update', 'unit packets', 'render', 'cell sort', 'cell compare', 'grid', 'helpers',
        'food', 'jelly physics', 'jelly prepare', 'jelly build', 'eligibility', 'WebGL cells', 'WebGL batch', 'multibox rings',
        'text pass', 'text raster', 'post overlays', 'rings/HUD pass', 'minimap', 'leaderboard', 'teamboard', 'stats HUD', 'skin jobs', 'skin upload'];
    function createScopes(clock, names) {
        var n = names.length, ids = {}, i;
        for (i = 0; i < n; i++) ids[names[i]] = i;
        var acc = new Float64Array(n), cnt = new Float64Array(n), sid = new Int32Array(64), st = new Float64Array(64), ch = new Float64Array(64), depth = 0;
        var S = {
            on: false, names: names, acc: acc, cnt: cnt, lost: 0,
            b: function (id) {
                if (typeof id !== 'number') { id = ids[id]; if (id === undefined) return -1; }
                if (depth >= 64) { S.lost++; return -1; }
                sid[depth] = id; ch[depth] = 0; st[depth] = clock();
                return depth++;
            },
            e: function (d) {
                if (!(d >= 0) || d >= depth) return;
                var t = clock();
                while (depth > d) {
                    var k = --depth, incl = t - st[k], self = incl - ch[k];
                    acc[sid[k]] += self > 0 ? self : 0;
                    cnt[sid[k]]++;
                    if (k > 0) ch[k - 1] += incl;
                }
            },
            reset: function () { acc.fill(0); cnt.fill(0); },
            depth: function () { return depth; }
        };
        return S;
    }

    /* methods timed as a stage: [window object, method, stage] */
    var WRAPS = [
        ['legendmod', 'handleMessage', 'packets'], ['legendmod', 'updateCells', 'cells update'], ['legendmod', 'sortCells', 'cell sort'],
        ['legendmod', 'compareCells', 'cell compare'], ['legendmod', 'prepareJellyCells', 'jelly prepare'], ['legendmod', 'updateQuadtree', 'jelly build'],
        ['drawRender', 'renderFrame', 'render'], ['drawRender', 'drawHelpers', 'helpers'], ['drawRender', 'drawFood', 'food'],
        ['drawRender', 'canUseWebGLScene', 'eligibility'], ['drawRender', 'drawWebGLCellBatch', 'WebGL cells'], ['drawRender', 'drawWebGLBatch', 'WebGL batch'],
        ['drawRender', 'drawWebGLMultiboxRings', 'multibox rings'], ['drawRender', '_lmRasterText', 'text raster'], ['drawRender', 'drawPostCellOverlays', 'post overlays'],
        ['application', 'drawMiniMap', 'minimap'], ['legendmod', 'handleLeaderboard', 'leaderboard'], ['application', 'displayTop5', 'teamboard'],
        ['application', 'displayStats', 'stats HUD'], ['application', '_lmSkinJobRun', 'skin jobs'], ['drawRender', '_lmUploadSkinJob', 'skin upload']
    ];

    /* Speed of the machine right now: the median ms of a fixed CPU workload (seeded fill, sort,
     * sum). Other programs busy on the same machine make it slower; the gate then does not judge
     * timings (bench.js). */
    function calibrate(clock) {
        clock = clock || Date.now;
        var a = new Float64Array(200000), times = [], sink = 0;
        for (var k = 0; k < 7; k++) {
            var rnd = makeRng(99), t0 = clock();
            for (var i = 0; i < a.length; i++) a[i] = rnd();
            a.sort();
            for (i = 0; i < a.length; i += 7) sink += a[i];
            times.push(clock() - t0);
        }
        times.sort(function (x, y) { return x - y; });
        return sink > 0 ? Math.round(times[3] * 100) / 100 : 0;
    }

    var pure = {
        VERSION: VERSION, VIEW: VIEW, TICK_MS: TICK_MS, makeRng: makeRng, scene: scene, matrix: matrix, createWorld: createWorld, step: step,
        encodeUpdate: encodeUpdate, encodeClear: encodeClear, encodeBorder: encodeBorder, encodeAddOwn: encodeAddOwn, sees: sees, socketId: socketId,
        percentile: percentile, dist: dist, createScopes: createScopes, STAGES: STAGES, WRAPS: WRAPS, calibrate: calibrate
    };
    if (typeof module === 'object' && module.exports && typeof window === 'undefined') { module.exports = pure; return; }
    if (root.LMBenchDense && root.LMBenchDense.VERSION >= VERSION) return;

    /* ------------------------------------------------------------------ */
    /* In the page                                                         */
    /* ------------------------------------------------------------------ */
    var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var now = function () { return performance.now(); };
    function LM() { return window.legendmod; }
    function DR() { return window.drawRender; }

    var ses = null; /* the running scene */

    function fakeSocket(url) {
        return {
            readyState: 1, OPEN: 1, CONNECTING: 0, CLOSING: 2, CLOSED: 3, binaryType: 'arraybuffer', bufferedAmount: 0, url: url,
            _lwIntegrity: false, _lmBench: true, onopen: null, onmessage: null, onclose: null, onerror: null,
            send: function () { }, close: function () { this.readyState = 3; }
        };
    }

    function installTiming(s) {
        var sc = s.sc;
        s.wrapped = [];
        s.missing = [];
        s.packetIncl = 0;
        WRAPS.forEach(function (w) {
            var o = window[w[0]], m = w[1];
            if (!o || typeof o[m] !== 'function') { s.missing.push(w[0] + '.' + m); return; }
            var orig = o[m], own = Object.prototype.hasOwnProperty.call(o, m), stage = w[2];
            var isRender = stage === 'render', isPk = stage === 'packets';
            var f = function () {
                if (!sc.on) return orig.apply(this, arguments);
                var t0 = isRender || isPk ? now() : 0, d = sc.b(stage);
                try { return orig.apply(this, arguments); } finally {
                    sc.e(d);
                    if (isRender) s.frameRender += now() - t0;
                    else if (isPk && sc.depth() === 0) s.packetIncl += now() - t0;
                }
            };
            o[m] = f;
            s.wrapped.push([o, m, orig, own, f]);
        });
    }
    function removeTiming(s) {
        (s.wrapped || []).forEach(function (p) {
            if (p[0][p[1]] !== p[4]) return;
            if (p[3]) p[0][p[1]] = p[2]; else delete p[0][p[1]];
        });
        s.wrapped = [];
    }

    /* fixed camera: setView() runs as usual (player position, units), then the camera is put
     * back on the scene's point and zoom */
    function fixCamera(s) {
        var dr = DR(), orig = dr.setView, own = Object.prototype.hasOwnProperty.call(dr, 'setView');
        var f = function () {
            var r = orig.apply(this, arguments);
            this.camX = 0; this.camY = 0; this.scale = VIEW.scale;
            var l = LM();
            if (l) { l.viewScale = VIEW.scale; l.playerX = 0; l.playerY = 0; }
            return r;
        };
        dr.setView = f;
        s.unCam = function () { if (dr.setView === f) { if (own) dr.setView = orig; else delete dr.setView; } };
    }

    /* settings of the scene (put back afterwards) */
    function applySettings(s) {
        var d = window.defaultmapsettings, set = { jellyPhisycs: s.spec.jelly, noNames: !s.spec.labels, showMass: s.spec.labels, fpsLimit: 0 };
        s.prevSettings = {};
        Object.keys(set).forEach(function (k) { s.prevSettings[k] = d[k]; d[k] = set[k]; });
        s.settings = {};
        ['jellyPhisycs', 'noNames', 'showMass', 'rainbowFood', 'showGrid', 'showMapBorders', 'showBgSectors', 'oppRings', 'oppColors', 'splitRange',
            'virusesRange', 'cursorTracking', 'transparentCells', 'transparentSkins', 'optimizedNames', 'optimizedMass', 'fpsLimit', 'showMiniMap']
            .forEach(function (k) { s.settings[k] = d[k]; });
        if (window.defaultSettings) s.settings.foodSize = window.defaultSettings.foodSize;
    }
    function restoreSettings(s) {
        var d = window.defaultmapsettings;
        if (s.prevSettings) Object.keys(s.prevSettings).forEach(function (k) { d[k] = s.prevSettings[k]; });
    }

    function feedMain(buf) {
        try { LM().handleMessage(new DataView(buf)); } catch (e) { if (ses) { ses.errors++; if (ses.errors < 3) console.warn('[bench] main packet failed', e); } }
    }
    function feedUnit(u, buf) {
        if (!u || !u.socket || typeof u.socket.onmessage !== 'function') return;
        var sc = ses && ses.sc, d = sc && sc.on ? sc.b('unit packets') : -1;
        try { u.socket.onmessage({ data: buf }); } catch (e) { if (ses) { ses.errors++; if (ses.errors < 3) console.warn('[bench] unit packet failed', e); } } finally { if (d >= 0) sc.e(d); }
    }
    function sendTick(s) {
        step(s.w);
        feedMain(encodeUpdate(s.w, 0, false));
        for (var i = 0; i < s.units.length; i++) feedUnit(s.units[i], encodeUpdate(s.w, i + 1, false));
    }
    function loop() {
        var s = ses;
        if (!s || s.paused) return;
        var t = now();
        s.acc += t - s.last; s.last = t;
        var n = 0;
        while (s.acc >= TICK_MS && n < 2) { sendTick(s); s.acc -= TICK_MS; n++; }
        if (s.acc > 200) s.acc = 0;
    }

    /* leaves the current server and puts the scene's world in its place */
    function setup(spec) {
        if (ses) teardown();
        var l = LM(), dr = DR();
        if (!l || !dr || typeof l.handleMessage !== 'function') throw new Error('game not ready');
        if (window.LMPractice && window.LMPractice.on && window.LMPractice.stop) window.LMPractice.stop(false);
        var tok = document.getElementById('server-token');
        var s = ses = {
            spec: spec, errors: 0, acc: 0, last: now(), paused: true, units: [], frameRender: 0,
            prev: { ws: l.ws, token: tok ? tok.value : '', serverType: l.serverType, integrity: l.integrity, connectionIntegrity: l.connectionIntegrity, gameMode: l.gameMode },
            sc: createScopes(now, STAGES), prevScope: window._lmScope, random: Math.random
        };
        /* leave the live server like the Practice arena (no reconnect, no delayed join) */
        if (window.replayTimeOuts) { clearTimeout(window.replayTimeOuts); window.replayTimeOuts = null; }
        if (l._reconnTimer) { clearTimeout(l._reconnTimer); l._reconnTimer = null; }
        l._reconnAttempts = 0; l._reconnStartTime = 0; l._lmReconnWs = null;
        if (l._accountDomainSwitchTimer) { clearTimeout(l._accountDomainSwitchTimer); l._accountDomainSwitchTimer = null; }
        l._connectSeq = (l._connectSeq || 0) + 1;
        try { l.closeConnection(); } catch (e) { }
        if (tok) tok.value = '';
        s.rec = { slot: window.temporaryRecordedProtocol, live: window._lmRecLive };
        window.temporaryRecordedProtocol = null; window._lmRecLive = false;
        try { l.flushCellsData(); } catch (e) { }
        window.multiboxPlayerEnabled = null;
        window.mainPlayerDeadMbActive = false;
        l.play = false;
        l._spawnTransitGate = false;
        l.socket = s.sock = fakeSocket('lm-bench://local');
        l.ws = 'lm-bench://local';
        l.serverType = 'private'; l.integrity = false; l.connectionIntegrity = false; l.connectionOpened = true;
        l.protocolKey = 0; l.clientKey = null; l.isLegendWorld = false; l.vnr = 0;
        if (l.gameMode === ':teams' || l.gameMode === ':party') l.gameMode = ':ffa';
        if (!l.playerNick) l.playerNick = 'Bench';
        applySettings(s);
        fixCamera(s);
        s.w = createWorld(spec);
        feedMain(encodeClear());
        feedMain(encodeBorder());
        feedMain(encodeAddOwn(1));
        feedMain(encodeUpdate(s.w, 0, true));
        /* multibox units: real spect.js units on stand-in sockets */
        if (spec.sockets > 1 && typeof window.addBox === 'function' && window.spects) {
            var prevCreate = window.createLegendWebSocket;
            for (var u = 1; u < spec.sockets && u < 2; u++) {
                window.createLegendWebSocket = function (url) { return fakeSocket(url); };
                try { window.addBox(); } finally { window.createLegendWebSocket = prevCreate; }
                var unit = window.spects[window.spects.length - 1];
                unit._lmBench = true;
                s.units.push(unit);
                try { unit.socket.onopen(); } catch (e) { console.warn('[bench] unit open', e); }
                feedUnit(unit, encodeAddOwn(socketId(spec, u, 2)));
                feedUnit(unit, encodeUpdate(s.w, u, true));
            }
            if (prevCreate === undefined) try { delete window.createLegendWebSocket; } catch (e) { }
        }
        s.timer = setInterval(loop, 8);
        return s;
    }

    function teardown() {
        var s = ses;
        if (!s) return;
        ses = null;
        clearInterval(s.timer);
        stopMeasure(s);
        Math.random = s.random;
        var l = LM();
        s.units.forEach(function (u) {
            try { u.closeConnection(); } catch (e) { }
            var i = window.spects.indexOf(u);
            if (i >= 0) window.spects.splice(i, 1);
        });
        if (!window.spects.some(function (x) { return x && x.player; })) l.multiBoxPlayerExists = false;
        window.multiboxPlayerEnabled = null;
        s.sock.readyState = 3;
        if (l.socket === s.sock) { l.socket = null; l.ws = null; l.connectionOpened = false; }
        try { l.flushCellsData(); } catch (e) { }
        l.play = false;
        l.serverType = s.prev.serverType; l.integrity = s.prev.integrity; l.connectionIntegrity = s.prev.connectionIntegrity;
        if (s.prev.gameMode && l.gameMode === ':ffa') l.gameMode = s.prev.gameMode;
        var tok = document.getElementById('server-token');
        if (tok && tok.value === '') tok.value = s.prev.token || '';
        if (window.temporaryRecordedProtocol == null) window.temporaryRecordedProtocol = s.rec.slot;
        window._lmRecLive = s.rec.live;
        if (s.unCam) s.unCam();
        restoreSettings(s);
        try { if (window.application && application.showMenu) application.showMenu(); } catch (e) { }
    }

    function startMeasure(s) {
        s.sc.reset();
        s.prevScope = window._lmScope;
        window._lmScope = s.sc;
        s.sc.on = true;
        installTiming(s);
    }
    function stopMeasure(s) {
        if (!s.sc.on) return;
        s.sc.on = false;
        removeTiming(s);
        if (window._lmScope === s.sc) window._lmScope = s.prevScope || null;
    }

    /* frames by requestAnimationFrame: interval and the renderFrame time of each frame */
    function measureFrames(s, ms) {
        return new Promise(function (resolve) {
            var iv = [], rt = [], prev = 0, t0 = now(), pk0 = s.packetIncl, ticks0 = s.w.tick, glN = 0, dr = DR();
            s.frameRender = 0;
            function f(t) {
                if (prev) { iv.push(t - prev); rt.push(s.frameRender); if (dr._lmFrameGL) glN++; }
                s.frameRender = 0;
                prev = t;
                if (t - t0 < ms) requestAnimationFrame(f);
                else resolve({ iv: iv, rt: rt, secs: (t - t0) / 1000, packetMs: s.packetIncl - pk0, ticks: s.w.tick - ticks0, glFrames: glN });
            }
            requestAnimationFrame(f);
        });
    }

    /* draw calls, GL calls, instances/vertices, upload bytes and Canvas2D calls of a few frames
     * (counting wraps every method: not timed) */
    var DRAW = { drawArrays: 1, drawElements: 1, drawArraysInstanced: 1, drawElementsInstanced: 1, drawRangeElements: 1 };
    var UPLOAD = { bufferData: 1, bufferSubData: 1, texImage2D: 1, texSubImage2D: 1, texImage3D: 1, texSubImage3D: 1, copyTexSubImage2D: 1, copyTexSubImage3D: 1 };
    function instrumentGL(gl, st) {
        var names = [];
        for (var k in gl) if (typeof gl[k] === 'function' && k !== 'getError') names.push(k);
        names.forEach(function (k) {
            var f = gl[k];
            gl[k] = function () {
                st.glCalls++;
                if (DRAW[k]) {
                    st.draws++;
                    var a = arguments;
                    if (k === 'drawArrays') st.vertices += a[2];
                    else if (k === 'drawElements' || k === 'drawRangeElements') st.vertices += k === 'drawElements' ? a[1] : a[3];
                    else if (k === 'drawArraysInstanced') { st.vertices += a[2] * a[3]; st.instances += a[3]; }
                    else { st.vertices += a[1] * a[4]; st.instances += a[4]; }
                } else if (k === 'bufferSubData' || k === 'bufferData') {
                    var d = arguments[2];
                    if (d && d.byteLength !== undefined) st.uploadBytes += d.byteLength;
                } else if (k === 'texSubImage2D' || k === 'texImage2D' || k === 'texSubImage3D' || k === 'texImage3D') {
                    var src = arguments[arguments.length - 1];
                    if (src && src.width) st.uploadBytes += src.width * src.height * 4;
                }
                if (!UPLOAD[k]) return f.apply(gl, arguments);
                /* an upload that waits for the GPU shows here */
                var t0 = now();
                try { return f.apply(gl, arguments); } finally { st.uploadMs += now() - t0; st.uploads++; }
            };
        });
        return function () { names.forEach(function (k) { delete gl[k]; }); };
    }
    var CTX_OPS = { fill: 1, stroke: 1, drawImage: 1, fillText: 1, strokeText: 1, fillRect: 1, strokeRect: 1, clearRect: 1, putImageData: 1 };
    function instrumentCtx(ctx, st) {
        var names = [];
        for (var k in ctx) if (typeof ctx[k] === 'function') names.push(k);
        names.forEach(function (k) {
            var f = ctx[k];
            ctx[k] = function () {
                st.ctxCalls++;
                if (CTX_OPS[k]) st.ctxDraws++;
                if (k === 'arc') st.ctxArcs++;
                return f.apply(ctx, arguments);
            };
        });
        return function () { names.forEach(function (k) { delete ctx[k]; }); };
    }
    function jellyPoints() {
        var dr = DR(), l = LM(), jc = dr._jellyCellsScratch || [], pts = 0;
        for (var i = 0; i < jc.length; i++) if (jc[i] && jc[i].points) pts += jc[i].points.length;
        var qt = l.quadtree, idx = 0;
        if (qt && typeof qt.size === 'number') idx = qt.size;
        else if (window.WasmQuadTree && WasmQuadTree.stats) idx = WasmQuadTree.stats().points;
        return { cells: jc.length, submitted: pts, indexed: idx };
    }
    function countFrames(frames) {
        return new Promise(function (resolve) {
            var dr = DR(), st = { frames: 0, draws: 0, glCalls: 0, vertices: 0, instances: 0, uploadBytes: 0, uploads: 0, uploadMs: 0, textRasters: 0, ctxCalls: 0, ctxDraws: 0, ctxArcs: 0 };
            var un = [];
            if (typeof dr._lmRasterText === 'function') {
                var rt = dr._lmRasterText, own = Object.prototype.hasOwnProperty.call(dr, '_lmRasterText');
                dr._lmRasterText = function () { st.textRasters++; return rt.apply(this, arguments); };
                un.push(function () { if (own) dr._lmRasterText = rt; else delete dr._lmRasterText; });
            }
            if (dr.gl) un.push(instrumentGL(dr.gl, st));
            if (dr.gridGl && dr.gridGl !== dr.gl) un.push(instrumentGL(dr.gridGl, st));
            if (dr.ctx) un.push(instrumentCtx(dr.ctx, st));
            var jp = { cells: 0, submitted: 0, indexed: 0 }, glFrames = 0;
            function f() {
                st.frames++;
                var p = jellyPoints();
                jp.cells += p.cells; jp.submitted += p.submitted; jp.indexed += p.indexed;
                if (dr._lmFrameGL) glFrames++;
                if (st.frames < frames) requestAnimationFrame(f);
                else {
                    /* the frame callback runs before the game's frame of this refresh: one more */
                    requestAnimationFrame(function () {
                        un.forEach(function (u) { u(); });
                        var n = st.frames, o = {};
                        Object.keys(st).forEach(function (k) { o[k] = k === 'frames' ? n : k === 'uploadMs' || k === 'textRasters' ? r2(st[k] / n) : Math.round(st[k] / n); });
                        o.jellyCells = Math.round(jp.cells / n); o.pointsSubmitted = Math.round(jp.submitted / n); o.pointsIndexed = Math.round(jp.indexed / n);
                        o.glFrames = glFrames;
                        resolve(o);
                    });
                }
            }
            requestAnimationFrame(f);
        });
    }

    /* Speed of the GPU right now: the median ms of a fixed fill workload on a context of its own,
     * waited for with a 1-pixel read. Other programs drawing on the same GPU make it slower. */
    function calibrateGpu() {
        var c = document.createElement('canvas');
        c.width = 1024; c.height = 1024;
        var g = c.getContext('webgl2', { antialias: false });
        if (!g) return 0;
        function sh(t, s) { var x = g.createShader(t); g.shaderSource(x, s); g.compileShader(x); return x; }
        var p = g.createProgram();
        g.attachShader(p, sh(g.VERTEX_SHADER, '#version 300 es\nin vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }'));
        g.attachShader(p, sh(g.FRAGMENT_SHADER, '#version 300 es\nprecision highp float; uniform float u; out vec4 o;\n' +
            'void main() { vec2 q = gl_FragCoord.xy * 0.001 + u; float s = 0.0; for (int i = 0; i < 64; i++) { s += sin(q.x * float(i)) * cos(q.y + s); } o = vec4(fract(s), 0.0, 0.0, 1.0); }'));
        g.linkProgram(p);
        g.useProgram(p);
        var b = g.createBuffer();
        g.bindBuffer(g.ARRAY_BUFFER, b);
        g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
        g.enableVertexAttribArray(0);
        g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
        var u = g.getUniformLocation(p, 'u'), px = new Uint8Array(4), times = [];
        for (var k = 0; k < 7; k++) {
            var t0 = now();
            for (var d = 0; d < 6; d++) { g.uniform1f(u, k + d * 0.1); g.drawArrays(g.TRIANGLE_STRIP, 0, 4); }
            g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, px);
            times.push(now() - t0);
        }
        var ext = g.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        times.sort(function (x, y) { return x - y; });
        return r2(times[3]);
    }

    function gpuName() {
        try {
            var gl = DR().gl;
            if (!gl) return 'no WebGL';
            var ext = gl.getExtension('WEBGL_debug_renderer_info');
            return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        } catch (e) { return '?'; }
    }
    function heapMB() {
        try { return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576 * 10) / 10 : null; } catch (e) { return null; }
    }
    function worldCounts() {
        var l = LM();
        var n = { cells: l.cells.length, food: l.food.length, foodMulti: (l.foodMulti || []).length, removed: (l.removedCells || []).length, own: (l.playerCells || []).length, unitOwn: (l.playerCellsMulti || []).length };
        var vis = 0;
        for (var i = 0; i < l.cells.length; i++) { var c = l.cells[i]; if (c && !c.removed && !c.invisible) vis++; }
        n.visibleCells = vis;
        return n;
    }

    /* one scene: set up, warm up, measure, count; leaves the scene running (capture() / stop()) */
    async function run(spec, opts) {
        opts = opts || {};
        if (!spec.name) spec = scene(spec);
        var s = setup(spec);
        var warm = opts.warmMs != null ? opts.warmMs : 2000, ms = opts.measureMs != null ? opts.measureMs : 4000;
        s.paused = false; s.last = now();
        await sleep(warm);
        var heap0 = heapMB();
        startMeasure(s);
        var fr = await measureFrames(s, ms);
        stopMeasure(s);
        var cnt = await countFrames(opts.countFrames || 20);
        var res = {
            name: spec.name, spec: spec, version: VERSION, gpu: gpuName(), dpr: window.devicePixelRatio || 1,
            canvas: [DR().canvasWidth, DR().canvasHeight], scale: VIEW.scale, settings: s.settings,
            frames: fr.iv.length, secs: r2(fr.secs), fps: r2(fr.iv.length / fr.secs), ticksPerSec: r2(fr.ticks / fr.secs),
            glShare: fr.iv.length ? r2(fr.glFrames / fr.iv.length) : 0,
            frameMs: dist(fr.iv), renderMs: dist(fr.rt), packetMsPerSec: r2(fr.packetMs / fr.secs),
            stages: {}, counts: cnt, world: worldCounts(), heapMB: { before: heap0, after: heapMB() }, errors: s.errors, missingStages: s.missing
        };
        var n = Math.max(1, fr.iv.length);
        for (var i = 0; i < STAGES.length; i++) {
            if (s.sc.cnt[i]) res.stages[STAGES[i]] = { msPerFrame: Math.round(s.sc.acc[i] / n * 1000) / 1000, calls: Math.round(s.sc.cnt[i] / n * 10) / 10 };
        }
        res.stagesTotalMsPerFrame = r2(Object.keys(res.stages).reduce(function (a, k) { return a + res.stages[k].msPerFrame; }, 0));
        return res;
    }

    /* One deterministic frame of the running scene, the world layers composited into a PNG
     * (data URL): the world is rebuilt from its seed and stepped `ticks` ticks, sent in full, the
     * cells settle, then jelly points start again and `frames` frames are drawn at once with a
     * seeded Math.random. */
    async function capture(opts) {
        opts = opts || {};
        var s = ses;
        if (!s) throw new Error('no scene');
        var ticks = opts.ticks != null ? opts.ticks : 20, frames = opts.frames || 12;
        s.paused = true;
        await sleep(100);
        /* the client's world from scratch, then the same packets every time */
        var l = LM();
        s.units.forEach(function (u) { try { u.flushCellsData(); } catch (e) { } });
        feedMain(encodeClear());
        feedMain(encodeBorder());
        feedMain(encodeAddOwn(1));
        s.w = createWorld(s.spec);
        for (var t = 0; t < ticks; t++) step(s.w);
        feedMain(encodeUpdate(s.w, 0, true));
        s.units.forEach(function (u, i) { feedUnit(u, encodeAddOwn(socketId(s.spec, i + 1, 2))); feedUnit(u, encodeUpdate(s.w, i + 1, true)); });
        await sleep(opts.settleMs || 1500);
        var dr = DR();
        var rnd = makeRng(777);
        Math.random = rnd;
        var out;
        try {
            l.cells.forEach(function (c) { if (c && c.points) { c.points.length = 0; if (c.pointsVel) c.pointsVel.length = 0; } });
            for (var f = 0; f < frames; f++) dr.renderFrame();
            out = composite();
        } finally { Math.random = s.random; }
        out.world = worldCounts();
        out.gl = !!dr._lmFrameGL;
        return out;
    }
    /* the world canvases in their stacking order (background, grid, main, WebGL, overlay) */
    function composite() {
        var dr = DR(), base = dr.canvas, W = base.width, H = base.height;
        var c = document.createElement('canvas');
        c.width = W; c.height = H;
        var x = c.getContext('2d');
        x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
        var layers = [dr.backgroundCanvas, dr.gridCanvas, dr.canvas, dr.glCanvas, dr.overlayCanvas].filter(function (e) { return e && e.width && e.style.display !== 'none'; });
        layers.sort(function (a, b) { return (+getComputedStyle(a).zIndex || 0) - (+getComputedStyle(b).zIndex || 0); });
        layers.forEach(function (e) { try { x.drawImage(e, 0, 0, W, H); } catch (err) { } });
        return { png: c.toDataURL('image/png'), w: W, h: H, layers: layers.map(function (e) { return e.id || e.tagName; }) };
    }
    /* pixel difference of two PNG data URLs (same size) */
    async function diffImages(a, b) {
        function load(u) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = u; }); }
        var A = await load(a), B = await load(b);
        if (A.width !== B.width || A.height !== B.height) return { sizeDiffers: true };
        function px(img) { var c = document.createElement('canvas'); c.width = img.width; c.height = img.height; var x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; }
        var pa = px(A), pb = px(B), max = 0, sum = 0, n = 0, over8 = 0, pixN = pa.length / 4;
        for (var i = 0; i < pa.length; i += 4) {
            var d = Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2]));
            if (d) { n++; sum += d; if (d > max) max = d; if (d > 8) over8++; }
        }
        return { max: max, mean: Math.round(sum / pixN * 1000) / 1000, differing: n, differingPct: Math.round(n / pixN * 10000) / 100, over8: over8 };
    }

    async function runAll(list, opts) {
        if (typeof list === 'string' || !list) list = matrix(list || 'quick');
        var out = [];
        try {
            for (var i = 0; i < list.length; i++) {
                out.push(await run(list[i], opts));
                if (opts && opts.onScene) await opts.onScene(out[out.length - 1]);
            }
        } finally { teardown(); }
        return out;
    }
    function summary(results) {
        var lines = ['scene | fps | frame p50/p95/p99 ms | render p50/p95 ms | GL share | GL draws | points sub/idx | heap MB'];
        results.forEach(function (r) {
            lines.push([r.name, r.fps, r.frameMs.p50 + '/' + r.frameMs.p95 + '/' + r.frameMs.p99, r.renderMs.p50 + '/' + r.renderMs.p95, r.glShare,
                r.counts.draws, r.counts.pointsSubmitted + '/' + r.counts.pointsIndexed, r.heapMB.after].join(' | '));
        });
        return lines.join('\n');
    }

    var api = {};
    Object.keys(pure).forEach(function (k) { api[k] = pure[k]; });
    api.calibrateGpu = calibrateGpu;
    api.run = run; api.runAll = runAll; api.capture = capture; api.stop = teardown; api.diffImages = diffImages; api.summary = summary;
    api.state = function () { return ses ? { on: true, name: ses.spec.name, tick: ses.w.tick, errors: ses.errors, units: ses.units.length } : { on: false }; };
    api.pause = function (p) { if (ses) { ses.paused = p !== false; ses.last = now(); } };
    root.LMBenchDense = api;
})(typeof window !== 'undefined' ? window : this);
